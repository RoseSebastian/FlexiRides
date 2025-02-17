import { Booking } from "../models/bookingModel.js";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const PaymentController = async (req, res) => {
    try {
        const userId = req.loggedInUser.id;
        const  booking  = req.body;
        

        const lineItems = [{
            price_data: {
                currency: "inr",
                product_data: {
                    name: booking?.car?.model,
                    images: [booking?.car?.image],
                },
                unit_amount: Math.round(booking?.totalPrice * 100),
            },
            quantity: 1,
        }];

        const newBooking = new Booking({ 
            userId: userId, 
            carId: booking.car._id, 
            startDate: booking.startDate, 
            endDate: booking.endDate, 
            totalPrice: booking.totalPrice
        });
        await newBooking.save();

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: lineItems,
            mode: "payment",
            success_url: `${process.env.WEB_URL}/confirmation/${newBooking?._id}`,
            cancel_url: `${process.env.WEB_URL}/confirmation/${newBooking?._id}`,
        });   

        const tempBooking = await Booking.findById(newBooking._id);
        console.log(tempBooking)
        tempBooking.transactionId = session.id;
        const savedBooking =  await tempBooking.save();      
        console.log(savedBooking);
        
        res.json({ success: true, sessionId: session?.id });
    } catch (error) {
        return res.status(error.statusCode || 500).json({ message: error.message || "Internal server error" });
    }
}

export const TransactionDetails = async (req,res) => {
    try {
        const sessionId = req.params.id;
        const session = await stripe.checkout.sessions.retrieve(sessionId);

        res.send({
            status: session?.status,
            customer_email: session?.customer_details?.email,
            session_data: session,
        });
    } catch (error) {
        res.status(error?.statusCode || 500).json(error.message || "internal server error");
    }
}