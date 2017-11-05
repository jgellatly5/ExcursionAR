'use strict';
var nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

module.exports.hello = (event, context, callback) => {
  const response = {
    statusCode: 200,
    body: JSON.stringify({
      message: 'Go Serverless v1.0! Your function executed successfully!',
      input: event,
    }),
  };

  callback(null, response);
};

module.exports.sendSdkEmail = (event, context, callback) => {
    const response = {
      statusCode: 200,
      headers: {
          'Access-Control-Allow-Origin' : 'http://localhost:3000',        // Required for CORS support to work
          'Access-Control-Allow-Credentials' : 'true',
          'Access-Control-Allow-Methods' : 'POST,OPTIONS',
          'Access-Control-Allow-Headers' : 'Access-Control-Allow-Headers, Origin, Accept, X-Requested-With, Content-Type, Access-Control-Request-Headers'
      },
      body: JSON.stringify({
        message: 'This is the send SDK email function',
        input: event,
      }),
    };

    const parsedBody = event['body'].split("&");

    const nameParse = parsedBody[0].split("=");
    const emailParse = parsedBody[1].split("=");
    const companyParse = parsedBody[2].split("=");
    const websiteParse = parsedBody[3].split("=");
    const storeLinkParse = parsedBody[4].split("=");
    const referParse = parsedBody[5].split("=");
    const messageParse = parsedBody[6].split("=");

    const name = decodeURIComponent(nameParse[1]);
    const email = decodeURIComponent(emailParse[1]);
    const company = decodeURIComponent(companyParse[1]);
    const website = decodeURIComponent(websiteParse[1]);
    const storeLink = decodeURIComponent(storeLinkParse[1]);
    const refer = decodeURIComponent(referParse[1]);
    const message = decodeURIComponent(messageParse[1]);

    var sdkReply = {
        from: '"Excursion" contact@excursion-ar.com',
        to: email,
        subject: 'Beta Registration Confirmation',
        text: `Thank you for signing up for the Excursion SDK. We will notify you when the beta will be ready to release.
            - Excursion`
    }
    transporter.sendMail(sdkReply);

    var sdkInfo = {
      from: '"Excursion" contact@excursion-ar.com',
      to: 'contact@excursion-ar.com',
      subject: `${name} wants to sign up for the SDK!`,
      text: `
          Name: ${name},
          Email: ${email},
          Company: ${company},
          Website: ${website},
          StoreLink: ${storeLink},
          Referral: ${refer},
          Message: ${message}`
      }

  transporter.sendMail(sdkInfo);

  callback(null, response);
};

module.exports.sendContactEmail = (event, context, callback) => {
  const response = {
    statusCode: 200,
    body: JSON.stringify({
      message: 'Go Serverless v1.0! Your function executed successfully!',
      input: event,
    }),
  };

  callback(null, response);

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // callback(null, { message: 'Go Serverless v1.0! Your function executed successfully!', event });
};

module.exports.sendAdEmail = (event, context, callback) => {
  const response = {
    statusCode: 200,
    body: JSON.stringify({
      message: 'Go Serverless v1.0! Your function executed successfully!',
      input: event,
    }),
  };

  callback(null, response);

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // callback(null, { message: 'Go Serverless v1.0! Your function executed successfully!', event });
};
