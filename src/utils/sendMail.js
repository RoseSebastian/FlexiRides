import transporter from '../config/email.js';

const sendEmail = async (to, subject, text) => {
    const mailOptions = {
        from: process.env.EMAIL_ADDRESS,
        to,
        subject,
        html:text
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent: ' + info.response);
    } catch (error) {
        console.error('Failed to send email:', error);
    }
};

export default sendEmail;