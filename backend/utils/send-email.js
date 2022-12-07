import nodeMailer from 'nodemailer';

const sendEmail = async ( options ) => {
    const transporter = nodeMailer.createTransport( {
        service: process.env.SMPT_SERVICE,
        auth: {
            user: process.env.SMPT_MAIL,
            pass: process.env.SMPT_PASSWORD
        }
    } );

    const mainOptions = {
        from: process.env.SMPT_MAIL,
        to: options.email,
        subject: options.subject,
        text: options.message
    };

    await transporter.sendMail( mainOptions );
};

export { sendEmail };