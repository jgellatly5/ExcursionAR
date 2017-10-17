const sendEmail = () => {
    var nodemailer = require('nodemailer');
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'jgellatly5@gmail.com',
            pass: 'beloteca1992'
        }
    });

    var mailOptions = {
        from: 'jgellatly5@gmail.com',
        to: 'jgellatly5@gmail.com',
        subject: 'Excursion test',
        text: 'This is a test!'
    }

    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
};

export default sendEmail;
