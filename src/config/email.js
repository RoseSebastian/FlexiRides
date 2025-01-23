import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    service: 'gmail', // You can use any email service
    auth: {
        user: `${process.env.EMAIL_ADDRESS}`, // Your email address
        pass: `${process.env.EMAIL_APP_PASSWORD}`   // Your email password
    }
});

transporter.verify((error, success) => {
    if (error) {
        console.error('Error with email configuration:', error);
    } else {
        console.log('Ready to send emails:', success);
    }
});

export default transporter;