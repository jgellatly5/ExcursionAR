var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var config = require('./nodemailerConfig');

var index = require('./routes/index');

var app = express();
var nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: config.mailUser,
        pass: config.mailPass
    }
});
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'excursion-react/build')));

app.use('/', index);

app.post('/sdkForm', (req, res) => {
    res.setHeader('Content-Type', 'application/json');

    setTimeout(() => {
        res.send(JSON.stringify({
            name: req.body.name || null,
            email: req.body.email || null,
            companyName: req.body.companyName || null,
            website: req.body.website || null,
            storeLink: req.body.storeLink || null,
            refer: req.body.refer || null,
            message: req.body.message || null
        }));
    }, 1000);

    var sdkReply = {
        from: '"Excursion" contact@excursion-ar.com',
        to: req.body.email,
        subject: 'Beta Registration Confirmation',
        text: `Thank you for signing up for the Excursion SDK. We will notify you when the beta will be ready to release.
            - Excursion`
    }

    transporter.sendMail(sdkReply);

    var sdkInfo = {
        from: '"Excursion" contact@excursion-ar.com',
        to: 'contact@excursion-ar.com',
        subject: `${req.body.name} wants to sign up for the SDK!`,
        text: `
            Name: ${req.body.name},
            Email: ${req.body.email},
            Company: ${req.body.companyName},
            Website: ${req.body.website},
            StoreLink: ${req.body.storeLink},
            Referral: ${req.body.refer},
            Message: ${req.body.message}`
    }

    transporter.sendMail(sdkInfo);
});

app.post('/contactForm', (req, res) => {
    res.setHeader('Content-Type', 'application/json');

    setTimeout(() => {
        res.send(JSON.stringify({
            name: req.body.name || null,
            email: req.body.email || null,
            message: req.body.message || null
        }));
    }, 1000)

    var contactInfo = {
        from: '"Excursion" contact@excursion-ar.com',
        to: 'contact@excursion-ar.com',
        subject: `${req.body.name} ${req.body.email} sent a message!`,
        text: req.body.message
    }

    transporter.sendMail(contactInfo);
});

app.post('/adForm', (req, res) => {
    res.setHeader('Content-Type', 'application/json');

    setTimeout(() => {
        res.send(JSON.stringify({
            name: req.body.name || null,
            email: req.body.email || null,
            phone: req.body.phoneNumber || null,
            company: req.body.companyName || null,
            industry: req.body.industry || null,
            website: req.body.website || null,
            referral: req.body.referral || null,
        }));
    }, 1000)

    var adReply = {
        from: '"Excursion" contact@excursion-ar.com',
        to: req.body.email,
        subject: 'Excursion Ad Portal Confirmation',
        text: `Thank you for signing up for the Excursion Ad Portal. We will notify you when we are finished building the web app.
                - Excursion`
    }

    transporter.sendMail(adReply);

    var adInfo = {
        from: '"Excursion" contact@excursion-ar.com',
        to: 'contact@excursion-ar.com',
        subject: `${req.body.name} wants to sign up to the Ad Portal!`,
        text:`
            Name: ${req.body.name},
            Email: ${req.body.email},
            Company: ${req.body.company},
            Website: ${req.body.website},
            Referral: ${req.body.referral},
            Phone: ${req.body.phone},
            Industry: ${req.body.industry}`
    }

    transporter.sendMail(adInfo);
});

app.get('/*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '..', 'excursion-react/build', 'index.html'));
});

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '..', 'excursion-react/build', 'index.html'));
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
