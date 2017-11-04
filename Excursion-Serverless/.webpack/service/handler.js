(function(e, a) { for(var i in a) e[i] = a[i]; }(exports, /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 22);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

module.exports = require("util");

/***/ }),
/* 1 */
/***/ (function(module, exports) {

module.exports = require("stream");

/***/ }),
/* 2 */
/***/ (function(module, exports) {

module.exports = require("events");

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var urllib = __webpack_require__(4);
var util = __webpack_require__(0);
var fs = __webpack_require__(17);
var fetch = __webpack_require__(18);

/**
 * Parses connection url to a structured configuration object
 *
 * @param {String} str Connection url
 * @return {Object} Configuration object
 */
module.exports.parseConnectionUrl = function (str) {
    str = str || '';
    var options = {};

    [urllib.parse(str, true)].forEach(function (url) {
        var auth;

        switch (url.protocol) {
            case 'smtp:':
                options.secure = false;
                break;
            case 'smtps:':
                options.secure = true;
                break;
            case 'direct:':
                options.direct = true;
                break;
        }

        if (!isNaN(url.port) && Number(url.port)) {
            options.port = Number(url.port);
        }

        if (url.hostname) {
            options.host = url.hostname;
        }

        if (url.auth) {
            auth = url.auth.split(':');

            if (!options.auth) {
                options.auth = {};
            }

            options.auth.user = auth.shift();
            options.auth.pass = auth.join(':');
        }

        Object.keys(url.query || {}).forEach(function (key) {
            var obj = options;
            var lKey = key;
            var value = url.query[key];

            if (!isNaN(value)) {
                value = Number(value);
            }

            switch (value) {
                case 'true':
                    value = true;
                    break;
                case 'false':
                    value = false;
                    break;
            }

            // tls is nested object
            if (key.indexOf('tls.') === 0) {
                lKey = key.substr(4);
                if (!options.tls) {
                    options.tls = {};
                }
                obj = options.tls;
            } else if (key.indexOf('.') >= 0) {
                // ignore nested properties besides tls
                return;
            }

            if (!(lKey in obj)) {
                obj[lKey] = value;
            }
        });
    });

    return options;
};

/**
 * Returns a bunyan-compatible logger interface. Uses either provided logger or
 * creates a default console logger
 *
 * @param {Object} [options] Options object that might include 'logger' value
 * @return {Object} bunyan compatible logger
 */
module.exports.getLogger = function (options) {
    options = options || {};

    if (!options.logger) {
        // use vanity logger
        return {
            info: function () {},
            debug: function () {},
            error: function () {}
        };
    }

    if (options.logger === true) {
        // create console logger
        return createDefaultLogger();
    }

    // return whatever was passed
    return options.logger;
};

/**
 * Wrapper for creating a callback than either resolves or rejects a promise
 * based on input
 *
 * @param {Function} resolve Function to run if callback is called
 * @param {Function} reject Function to run if callback ends with an error
 */
module.exports.callbackPromise = function (resolve, reject) {
    return function () {
        var args = Array.prototype.slice.call(arguments);
        var err = args.shift();
        if (err) {
            reject(err);
        } else {
            resolve.apply(null, args);
        }
    };
};

/**
 * Resolves a String or a Buffer value for content value. Useful if the value
 * is a Stream or a file or an URL. If the value is a Stream, overwrites
 * the stream object with the resolved value (you can't stream a value twice).
 *
 * This is useful when you want to create a plugin that needs a content value,
 * for example the `html` or `text` value as a String or a Buffer but not as
 * a file path or an URL.
 *
 * @param {Object} data An object or an Array you want to resolve an element for
 * @param {String|Number} key Property name or an Array index
 * @param {Function} callback Callback function with (err, value)
 */
module.exports.resolveContent = function (data, key, callback) {
    var promise;

    if (!callback && typeof Promise === 'function') {
        promise = new Promise(function (resolve, reject) {
            callback = module.exports.callbackPromise(resolve, reject);
        });
    }

    var content = data && data[key] && data[key].content || data[key];
    var contentStream;
    var encoding = (typeof data[key] === 'object' && data[key].encoding || 'utf8')
        .toString()
        .toLowerCase()
        .replace(/[-_\s]/g, '');

    if (!content) {
        return callback(null, content);
    }

    if (typeof content === 'object') {
        if (typeof content.pipe === 'function') {
            return resolveStream(content, function (err, value) {
                if (err) {
                    return callback(err);
                }
                // we can't stream twice the same content, so we need
                // to replace the stream object with the streaming result
                data[key] = value;
                callback(null, value);
            });
        } else if (/^https?:\/\//i.test(content.path || content.href)) {
            contentStream = fetch(content.path || content.href);
            return resolveStream(contentStream, callback);
        } else if (/^data:/i.test(content.path || content.href)) {
            var parts = (content.path || content.href).match(/^data:((?:[^;]*;)*(?:[^,]*)),(.*)$/i);
            if (!parts) {
                return callback(null, new Buffer(0));
            }
            return callback(null, /\bbase64$/i.test(parts[1]) ? new Buffer(parts[2], 'base64') : new Buffer(decodeURIComponent(parts[2])));
        } else if (content.path) {
            return resolveStream(fs.createReadStream(content.path), callback);
        }
    }

    if (typeof data[key].content === 'string' && ['utf8', 'usascii', 'ascii'].indexOf(encoding) < 0) {
        content = new Buffer(data[key].content, encoding);
    }

    // default action, return as is
    setImmediate(callback.bind(null, null, content));

    return promise;
};

/**
 * Streams a stream value into a Buffer
 *
 * @param {Object} stream Readable stream
 * @param {Function} callback Callback function with (err, value)
 */
function resolveStream(stream, callback) {
    var responded = false;
    var chunks = [];
    var chunklen = 0;

    stream.on('error', function (err) {
        if (responded) {
            return;
        }

        responded = true;
        callback(err);
    });

    stream.on('readable', function () {
        var chunk;
        while ((chunk = stream.read()) !== null) {
            chunks.push(chunk);
            chunklen += chunk.length;
        }
    });

    stream.on('end', function () {
        if (responded) {
            return;
        }
        responded = true;

        var value;

        try {
            value = Buffer.concat(chunks, chunklen);
        } catch (E) {
            return callback(E);
        }
        callback(null, value);
    });
}

/**
 * Generates a bunyan-like logger that prints to console
 *
 * @returns {Object} Bunyan logger instance
 */
function createDefaultLogger() {

    var logger = {
        _print: function ( /* level, message */ ) {
            var args = Array.prototype.slice.call(arguments);
            var level = args.shift();
            var message;

            if (args.length > 1) {
                message = util.format.apply(util, args);
            } else {
                message = args.shift();
            }

            console.log('[%s] %s: %s',
                new Date().toISOString().substr(0, 19).replace(/T/, ' '),
                level.toUpperCase(),
                message);
        }
    };

    logger.info = logger._print.bind(null, 'info');
    logger.debug = logger._print.bind(null, 'debug');
    logger.error = logger._print.bind(null, 'error');

    return logger;
}


/***/ }),
/* 4 */
/***/ (function(module, exports) {

module.exports = require("url");

/***/ }),
/* 5 */
/***/ (function(module, exports) {

module.exports = require("os");

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var packageInfo = __webpack_require__(56);
var EventEmitter = __webpack_require__(2).EventEmitter;
var util = __webpack_require__(0);
var net = __webpack_require__(7);
var tls = __webpack_require__(11);
var os = __webpack_require__(5);
var crypto = __webpack_require__(10);
var DataStream = __webpack_require__(57);
var PassThrough = __webpack_require__(1).PassThrough;
var shared = __webpack_require__(3);
var ntlm = __webpack_require__(58);

// default timeout values in ms
var CONNECTION_TIMEOUT = 2 * 60 * 1000; // how much to wait for the connection to be established
var SOCKET_TIMEOUT = 10 * 60 * 1000; // how much to wait for socket inactivity before disconnecting the client
var GREETING_TIMEOUT = 30 * 1000; // how much to wait after connection is established but SMTP greeting is not receieved

module.exports = SMTPConnection;

/**
 * Generates a SMTP connection object
 *
 * Optional options object takes the following possible properties:
 *
 *  * **port** - is the port to connect to (defaults to 25 or 465)
 *  * **host** - is the hostname or IP address to connect to (defaults to 'localhost')
 *  * **secure** - use SSL
 *  * **ignoreTLS** - ignore server support for STARTTLS
 *  * **requireTLS** - forces the client to use STARTTLS
 *  * **name** - the name of the client server
 *  * **localAddress** - outbound address to bind to (see: http://nodejs.org/api/net.html#net_net_connect_options_connectionlistener)
 *  * **greetingTimeout** - Time to wait in ms until greeting message is received from the server (defaults to 10000)
 *  * **connectionTimeout** - how many milliseconds to wait for the connection to establish
 *  * **socketTimeout** - Time of inactivity until the connection is closed (defaults to 1 hour)
 *  * **lmtp** - if true, uses LMTP instead of SMTP protocol
 *  * **logger** - bunyan compatible logger interface
 *  * **debug** - if true pass SMTP traffic to the logger
 *  * **tls** - options for createCredentials
 *  * **socket** - existing socket to use instead of creating a new one (see: http://nodejs.org/api/net.html#net_class_net_socket)
 *  * **secured** - boolean indicates that the provided socket has already been upgraded to tls
 *
 * @constructor
 * @namespace SMTP Client module
 * @param {Object} [options] Option properties
 */
function SMTPConnection(options) {
    EventEmitter.call(this);

    this.id = crypto.randomBytes(8).toString('base64').replace(/\W/g, '');
    this.stage = 'init';

    this.options = options || {};

    this.secureConnection = !!this.options.secure;
    this.alreadySecured = !!this.options.secured;

    this.port = this.options.port || (this.secureConnection ? 465 : 25);
    this.host = this.options.host || 'localhost';

    if (typeof this.options.secure === 'undefined' && this.port === 465) {
        // if secure option is not set but port is 465, then default to secure
        this.secureConnection = true;
    }

    this.name = this.options.name || this._getHostname();

    this.logger = shared.getLogger(this.options);

    /**
     * Expose version nr, just for the reference
     * @type {String}
     */
    this.version = packageInfo.version;

    /**
     * If true, then the user is authenticated
     * @type {Boolean}
     */
    this.authenticated = false;

    /**
     * If set to true, this instance is no longer active
     * @private
     */
    this.destroyed = false;

    /**
     * Defines if the current connection is secure or not. If not,
     * STARTTLS can be used if available
     * @private
     */
    this.secure = !!this.secureConnection;

    /**
     * Store incomplete messages coming from the server
     * @private
     */
    this._remainder = '';

    /**
     * Unprocessed responses from the server
     * @type {Array}
     */
    this._responseQueue = [];

    /**
     * The socket connecting to the server
     * @publick
     */
    this._socket = false;

    /**
     * Lists supported auth mechanisms
     * @private
     */
    this._supportedAuth = [];

    /**
     * Includes current envelope (from, to)
     * @private
     */
    this._envelope = false;

    /**
     * Lists supported extensions
     * @private
     */
    this._supportedExtensions = [];

    /**
     * Defines the maximum allowed size for a single message
     * @private
     */
    this._maxAllowedSize = 0;

    /**
     * Function queue to run if a data chunk comes from the server
     * @private
     */
    this._responseActions = [];
    this._recipientQueue = [];

    /**
     * Timeout variable for waiting the greeting
     * @private
     */
    this._greetingTimeout = false;

    /**
     * Timeout variable for waiting the connection to start
     * @private
     */
    this._connectionTimeout = false;

    /**
     * If the socket is deemed already closed
     * @private
     */
    this._destroyed = false;

    /**
     * If the socket is already being closed
     * @private
     */
    this._closing = false;
}
util.inherits(SMTPConnection, EventEmitter);

/**
 * Creates a connection to a SMTP server and sets up connection
 * listener
 */
SMTPConnection.prototype.connect = function (connectCallback) {
    if (typeof connectCallback === 'function') {
        this.once('connect', function () {
            this.logger.debug('[%s] SMTP handshake finished', this.id);
            connectCallback();
        }.bind(this));
    }

    var opts = {
        port: this.port,
        host: this.host
    };

    if (this.options.localAddress) {
        opts.localAddress = this.options.localAddress;
    }

    if (this.options.connection) {
        // connection is already opened
        this._socket = this.options.connection;
        if (this.secureConnection && !this.alreadySecured) {
            setImmediate(this._upgradeConnection.bind(this, function (err) {
                if (err) {
                    this._onError(new Error('Error initiating TLS - ' + (err.message || err)), 'ETLS', false, 'CONN');
                    return;
                }
                this._onConnect();
            }.bind(this)));
        } else {
            setImmediate(this._onConnect.bind(this));
        }
    } else if (this.options.socket) {
        // socket object is set up but not yet connected
        this._socket = this.options.socket;
        try {
            this._socket.connect(this.port, this.host, this._onConnect.bind(this));
        } catch (E) {
            return setImmediate(this._onError.bind(this, E, 'ECONNECTION', false, 'CONN'));
        }
    } else if (this.secureConnection) {
        // connect using tls
        if (this.options.tls) {
            Object.keys(this.options.tls).forEach(function (key) {
                opts[key] = this.options.tls[key];
            }.bind(this));
        }
        try {
            this._socket = tls.connect(this.port, this.host, opts, this._onConnect.bind(this));
        } catch (E) {
            return setImmediate(this._onError.bind(this, E, 'ECONNECTION', false, 'CONN'));
        }
    } else {
        // connect using plaintext
        try {
            this._socket = net.connect(opts, this._onConnect.bind(this));
        } catch (E) {
            return setImmediate(this._onError.bind(this, E, 'ECONNECTION', false, 'CONN'));
        }
    }

    this._connectionTimeout = setTimeout(function () {
        this._onError('Connection timeout', 'ETIMEDOUT', false, 'CONN');
    }.bind(this), this.options.connectionTimeout || CONNECTION_TIMEOUT);

    this._socket.on('error', function (err) {
        this._onError(err, 'ECONNECTION', false, 'CONN');
    }.bind(this));
};

/**
 * Sends QUIT
 */
SMTPConnection.prototype.quit = function () {
    this._sendCommand('QUIT');
    this._responseActions.push(this.close);
};

/**
 * Closes the connection to the server
 */
SMTPConnection.prototype.close = function () {
    clearTimeout(this._connectionTimeout);
    clearTimeout(this._greetingTimeout);
    this._responseActions = [];

    // allow to run this function only once
    if (this._closing) {
        return;
    }
    this._closing = true;

    var closeMethod = 'end';

    if (this.stage === 'init') {
        // Close the socket immediately when connection timed out
        closeMethod = 'destroy';
    }

    this.logger.debug('[%s] Closing connection to the server using "%s"', this.id, closeMethod);

    var socket = this._socket && this._socket.socket || this._socket;

    if (socket && !socket.destroyed) {
        try {
            this._socket[closeMethod]();
        } catch (E) {
            // just ignore
        }
    }

    this._destroy();
};

/**
 * Authenticate user
 */
SMTPConnection.prototype.login = function (authData, callback) {
    this._auth = authData || {};
    this._user = this._auth.xoauth2 && this._auth.xoauth2.options && this._auth.xoauth2.options.user || this._auth.user || '';

    this._authMethod = false;
    if (this.options.authMethod) {
        this._authMethod = this.options.authMethod.toUpperCase().trim();
    } else if (this._auth.xoauth2 && this._supportedAuth.indexOf('XOAUTH2') >= 0) {
        this._authMethod = 'XOAUTH2';
    } else if (this._auth.domain && this._supportedAuth.indexOf('NTLM') >= 0) {
        this._authMethod = 'NTLM';
    } else {
        // use first supported
        this._authMethod = (this._supportedAuth[0] || 'PLAIN').toUpperCase().trim();
    }

    switch (this._authMethod) {
        case 'XOAUTH2':
            this._handleXOauth2Token(false, callback);
            return;
        case 'LOGIN':
            this._responseActions.push(function (str) {
                this._actionAUTH_LOGIN_USER(str, callback);
            }.bind(this));
            this._sendCommand('AUTH LOGIN');
            return;
        case 'PLAIN':
            this._responseActions.push(function (str) {
                this._actionAUTHComplete(str, callback);
            }.bind(this));
            this._sendCommand('AUTH PLAIN ' + new Buffer(
                //this._auth.user+'\u0000'+
                '\u0000' + // skip authorization identity as it causes problems with some servers
                this._auth.user + '\u0000' +
                this._auth.pass, 'utf-8').toString('base64'));
            return;
        case 'CRAM-MD5':
            this._responseActions.push(function (str) {
                this._actionAUTH_CRAM_MD5(str, callback);
            }.bind(this));
            this._sendCommand('AUTH CRAM-MD5');
            return;
        case 'NTLM':
            this._responseActions.push(function (str) {
                this._actionAUTH_NTLM_TYPE1(str, callback);
            }.bind(this));
            this._sendCommand('AUTH ' + ntlm.createType1Message({
                domain: this._auth.domain || '',
                workstation: this._auth.workstation || ''
            }));
            return;
    }

    return callback(this._formatError('Unknown authentication method "' + this._authMethod + '"', 'EAUTH', false, 'API'));
};

/**
 * Sends a message
 *
 * @param {Object} envelope Envelope object, {from: addr, to: [addr]}
 * @param {Object} message String, Buffer or a Stream
 * @param {Function} callback Callback to return once sending is completed
 */
SMTPConnection.prototype.send = function (envelope, message, done) {
    if (!message) {
        return done(this._formatError('Empty message', 'EMESSAGE', false, 'API'));
    }

    // reject larger messages than allowed
    if (this._maxAllowedSize && envelope.size > this._maxAllowedSize) {
        return setImmediate(function () {
            done(this._formatError('Message size larger than allowed ' + this._maxAllowedSize, 'EMESSAGE', false, 'MAIL FROM'));
        }.bind(this));
    }

    // ensure that callback is only called once
    var returned = false;
    var callback = function () {
        if (returned) {
            return;
        }
        returned = true;

        done.apply(null, Array.prototype.slice.call(arguments));
    };

    if (typeof message.on === 'function') {
        message.on('error', function (err) {
            return callback(this._formatError(err, 'ESTREAM', false, 'API'));
        }.bind(this));
    }

    this._setEnvelope(envelope, function (err, info) {
        if (err) {
            return callback(err);
        }
        var stream = this._createSendStream(function (err, str) {
            if (err) {
                return callback(err);
            }
            info.response = str;
            return callback(null, info);
        });
        if (typeof message.pipe === 'function') {
            message.pipe(stream);
        } else {
            stream.write(message);
            stream.end();
        }

    }.bind(this));
};

/**
 * Resets connection state
 *
 * @param {Function} callback Callback to return once connection is reset
 */
SMTPConnection.prototype.reset = function (callback) {
    this._sendCommand('RSET');
    this._responseActions.push(function (str) {
        if (str.charAt(0) !== '2') {
            return callback(this._formatError('Could not reset session state:\n' + str, 'EPROTOCOL', str, 'RSET'));
        }
        this._envelope = false;
        return callback(null, true);
    }.bind(this));
};

/**
 * Connection listener that is run when the connection to
 * the server is opened
 *
 * @event
 */
SMTPConnection.prototype._onConnect = function () {
    clearTimeout(this._connectionTimeout);

    this.logger.info('[%s] %s established to %s:%s', this.id, this.secure ? 'Secure connection' : 'Connection', this._socket.remoteAddress, this._socket.remotePort);

    if (this._destroyed) {
        // Connection was established after we already had canceled it
        this.close();
        return;
    }

    this.stage = 'connected';

    // clear existing listeners for the socket
    this._socket.removeAllListeners('data');
    this._socket.removeAllListeners('timeout');
    this._socket.removeAllListeners('close');
    this._socket.removeAllListeners('end');

    this._socket.on('data', this._onData.bind(this));
    this._socket.once('close', this._onClose.bind(this));
    this._socket.once('end', this._onEnd.bind(this));

    this._socket.setTimeout(this.options.socketTimeout || SOCKET_TIMEOUT);
    this._socket.on('timeout', this._onTimeout.bind(this));

    this._greetingTimeout = setTimeout(function () {
        // if still waiting for greeting, give up
        if (this._socket && !this._destroyed && this._responseActions[0] === this._actionGreeting) {
            this._onError('Greeting never received', 'ETIMEDOUT', false, 'CONN');
        }
    }.bind(this), this.options.greetingTimeout || GREETING_TIMEOUT);

    this._responseActions.push(this._actionGreeting);

    // we have a 'data' listener set up so resume socket if it was paused
    this._socket.resume();
};

/**
 * 'data' listener for data coming from the server
 *
 * @event
 * @param {Buffer} chunk Data chunk coming from the server
 */
SMTPConnection.prototype._onData = function (chunk) {
    if (this._destroyed || !chunk || !chunk.length) {
        return;
    }

    var data = (chunk || '').toString('binary');
    var lines = (this._remainder + data).split(/\r?\n/);
    var lastline;

    this._remainder = lines.pop();

    for (var i = 0, len = lines.length; i < len; i++) {
        if (this._responseQueue.length) {
            lastline = this._responseQueue[this._responseQueue.length - 1];
            if (/^\d+\-/.test(lastline.split('\n').pop())) {
                this._responseQueue[this._responseQueue.length - 1] += '\n' + lines[i];
                continue;
            }
        }
        this._responseQueue.push(lines[i]);
    }

    this._processResponse();
};

/**
 * 'error' listener for the socket
 *
 * @event
 * @param {Error} err Error object
 * @param {String} type Error name
 */
SMTPConnection.prototype._onError = function (err, type, data, command) {
    clearTimeout(this._connectionTimeout);
    clearTimeout(this._greetingTimeout);

    if (this._destroyed) {
        // just ignore, already closed
        // this might happen when a socket is canceled because of reached timeout
        // but the socket timeout error itself receives only after
        return;
    }

    err = this._formatError(err, type, data, command);

    this.logger.error('[%s] %s', this.id, err.message);

    this.emit('error', err);
    this.close();
};

SMTPConnection.prototype._formatError = function (message, type, response, command) {
    var err;

    if (/Error\]$/i.test(Object.prototype.toString.call(message))) {
        err = message;
    } else {
        err = new Error(message);
    }

    if (type && type !== 'Error') {
        err.code = type;
    }

    if (response) {
        err.response = response;
        err.message += ': ' + response;
    }

    var responseCode = typeof response === 'string' && Number((response.match(/^\d+/) || [])[0]) || false;
    if (responseCode) {
        err.responseCode = responseCode;
    }

    if (command) {
        err.command = command;
    }

    return err;
};

/**
 * 'close' listener for the socket
 *
 * @event
 */
SMTPConnection.prototype._onClose = function () {
    this.logger.info('[%s] Connection closed', this.id);

    if ([this._actionGreeting, this.close].indexOf(this._responseActions[0]) < 0 && !this._destroyed) {
        return this._onError(new Error('Connection closed unexpectedly'), 'ECONNECTION', false, 'CONN');
    }

    this._destroy();
};

/**
 * 'end' listener for the socket
 *
 * @event
 */
SMTPConnection.prototype._onEnd = function () {
    this._destroy();
};

/**
 * 'timeout' listener for the socket
 *
 * @event
 */
SMTPConnection.prototype._onTimeout = function () {
    return this._onError(new Error('Timeout'), 'ETIMEDOUT', false, 'CONN');
};

/**
 * Destroys the client, emits 'end'
 */
SMTPConnection.prototype._destroy = function () {
    if (this._destroyed) {
        return;
    }
    this._destroyed = true;
    this.emit('end');
};

/**
 * Upgrades the connection to TLS
 *
 * @param {Function} callback Callback function to run when the connection
 *        has been secured
 */
SMTPConnection.prototype._upgradeConnection = function (callback) {
    // do not remove all listeners or it breaks node v0.10 as there's
    // apparently a 'finish' event set that would be cleared as well

    // we can safely keep 'error', 'end', 'close' etc. events
    this._socket.removeAllListeners('data'); // incoming data is going to be gibberish from this point onwards
    this._socket.removeAllListeners('timeout'); // timeout will be re-set for the new socket object

    var socketPlain = this._socket;
    var opts = {
        socket: this._socket,
        host: this.host
    };

    Object.keys(this.options.tls || {}).forEach(function (key) {
        opts[key] = this.options.tls[key];
    }.bind(this));

    this._socket = tls.connect(opts, function () {
        this.secure = true;
        this._socket.on('data', this._onData.bind(this));

        socketPlain.removeAllListeners('close');
        socketPlain.removeAllListeners('end');

        return callback(null, true);
    }.bind(this));

    this._socket.on('error', this._onError.bind(this));
    this._socket.once('close', this._onClose.bind(this));
    this._socket.once('end', this._onEnd.bind(this));

    this._socket.setTimeout(this.options.socketTimeout || SOCKET_TIMEOUT); // 10 min.
    this._socket.on('timeout', this._onTimeout.bind(this));

    // resume in case the socket was paused
    socketPlain.resume();
};

/**
 * Processes queued responses from the server
 *
 * @param {Boolean} force If true, ignores _processing flag
 */
SMTPConnection.prototype._processResponse = function () {
    if (!this._responseQueue.length) {
        return false;
    }

    var str = (this._responseQueue.shift() || '').toString();

    if (/^\d+\-/.test(str.split('\n').pop())) {
        // keep waiting for the final part of multiline response
        return;
    }

    if (this.options.debug) {
        this.logger.debug('[%s] S: %s', this.id, str.replace(/\r?\n$/, ''));
    }

    if (!str.trim()) { // skip unexpected empty lines
        setImmediate(this._processResponse.bind(this, true));
    }

    var action = this._responseActions.shift();

    if (typeof action === 'function') {
        action.call(this, str);
        setImmediate(this._processResponse.bind(this, true));
    } else {
        return this._onError(new Error('Unexpected Response'), 'EPROTOCOL', str, 'CONN');
    }
};

/**
 * Send a command to the server, append \r\n
 *
 * @param {String} str String to be sent to the server
 */
SMTPConnection.prototype._sendCommand = function (str) {
    if (this._destroyed) {
        // Connection already closed, can't send any more data
        return;
    }

    if (this._socket.destroyed) {
        return this.close();
    }

    if (this.options.debug) {
        this.logger.debug('[%s] C: %s', this.id, (str || '').toString().replace(/\r?\n$/, ''));
    }

    this._socket.write(new Buffer(str + '\r\n', 'utf-8'));
};

/**
 * Initiates a new message by submitting envelope data, starting with
 * MAIL FROM: command
 *
 * @param {Object} envelope Envelope object in the form of
 *        {from:'...', to:['...']}
 *        or
 *        {from:{address:'...',name:'...'}, to:[address:'...',name:'...']}
 */
SMTPConnection.prototype._setEnvelope = function (envelope, callback) {
    var args = [];
    var useSmtpUtf8 = false;

    this._envelope = envelope || {};
    this._envelope.from = (this._envelope.from && this._envelope.from.address || this._envelope.from || '').toString().trim();

    this._envelope.to = [].concat(this._envelope.to || []).map(function (to) {
        return (to && to.address || to || '').toString().trim();
    });

    if (!this._envelope.to.length) {
        return callback(this._formatError('No recipients defined', 'EENVELOPE', false, 'API'));
    }

    if (this._envelope.from && /[\r\n<>]/.test(this._envelope.from)) {
        return callback(this._formatError('Invalid sender ' + JSON.stringify(this._envelope.from), 'EENVELOPE', false, 'API'));
    }

    // check if the sender address uses only ASCII characters,
    // otherwise require usage of SMTPUTF8 extension
    if (/[\x80-\uFFFF]/.test(this._envelope.from)) {
        useSmtpUtf8 = true;
    }

    for (var i = 0, len = this._envelope.to.length; i < len; i++) {
        if (!this._envelope.to[i] || /[\r\n<>]/.test(this._envelope.to[i])) {
            return callback(this._formatError('Invalid recipient ' + JSON.stringify(this._envelope.to[i]), 'EENVELOPE', false, 'API'));
        }

        // check if the recipients addresses use only ASCII characters,
        // otherwise require usage of SMTPUTF8 extension
        if (/[\x80-\uFFFF]/.test(this._envelope.to[i])) {
            useSmtpUtf8 = true;
        }
    }

    // clone the recipients array for latter manipulation
    this._envelope.rcptQueue = JSON.parse(JSON.stringify(this._envelope.to || []));
    this._envelope.rejected = [];
    this._envelope.rejectedErrors = [];
    this._envelope.accepted = [];

    if (this._envelope.dsn) {
        try {
            this._envelope.dsn = this._setDsnEnvelope(this._envelope.dsn);
        } catch (err) {
            return callback(this._formatError('Invalid dsn ' + err.message, 'EENVELOPE', false, 'API'));
        }
    }

    this._responseActions.push(function (str) {
        this._actionMAIL(str, callback);
    }.bind(this));

    // If the server supports SMTPUTF8 and the envelope includes an internationalized
    // email address then append SMTPUTF8 keyword to the MAIL FROM command
    if (useSmtpUtf8 && this._supportedExtensions.indexOf('SMTPUTF8') >= 0) {
        args.push('SMTPUTF8');
        this._usingSmtpUtf8 = true;
    }

    // If the server supports 8BITMIME and the message might contain non-ascii bytes
    // then append the 8BITMIME keyword to the MAIL FROM command
    if (this._envelope.use8BitMime && this._supportedExtensions.indexOf('8BITMIME') >= 0) {
        args.push('BODY=8BITMIME');
        this._using8BitMime = true;
    }

    if (this._envelope.size && this._supportedExtensions.indexOf('SIZE') >= 0) {
        args.push('SIZE=' + this._envelope.size);
    }

    // If the server supports DSN and the envelope includes an DSN prop
    // then append DSN params to the MAIL FROM command
    if (this._envelope.dsn && this._supportedExtensions.indexOf('DSN') >= 0) {
        if (this._envelope.dsn.ret) {
            args.push('RET=' + this._envelope.dsn.ret);
        }
        if (this._envelope.dsn.envid) {
            args.push('ENVID=' + this._envelope.dsn.envid);
        }
    }

    this._sendCommand('MAIL FROM:<' + (this._envelope.from) + '>' + (args.length ? ' ' + args.join(' ') : ''));
};

SMTPConnection.prototype._setDsnEnvelope = function (params) {
    var ret = params.ret ? params.ret.toString().toUpperCase() : null;
    if (ret && ['FULL', 'HDRS'].indexOf(ret) < 0) {
        throw new Error('ret: ' + JSON.stringify(ret));
    }
    var envid = params.envid ? params.envid.toString() : null;
    var notify = params.notify ? params.notify : null;
    if (notify) {
        if (typeof notify === 'string') {
            notify = notify.split(',');
        }
        notify = notify.map(function (n) {
            return n.trim().toUpperCase();
        });
        var validNotify = ['NEVER', 'SUCCESS', 'FAILURE', 'DELAY'];
        var invaliNotify = notify.filter(function (n) {
            return validNotify.indexOf(n) === -1;
        });
        if (invaliNotify.length || (notify.length > 1 && notify.indexOf('NEVER') >= 0)) {
            throw new Error('notify: ' + JSON.stringify(notify.join(',')));
        }
        notify = notify.join(',');
    }
    var orcpt = params.orcpt ? params.orcpt.toString() : null;
    return {
        ret: ret,
        envid: envid,
        notify: notify,
        orcpt: orcpt
    };
};

SMTPConnection.prototype._getDsnRcptToArgs = function () {
    var args = [];
    // If the server supports DSN and the envelope includes an DSN prop
    // then append DSN params to the RCPT TO command
    if (this._envelope.dsn && this._supportedExtensions.indexOf('DSN') >= 0) {
        if (this._envelope.dsn.notify) {
            args.push('NOTIFY=' + this._envelope.dsn.notify);
        }
        if (this._envelope.dsn.orcpt) {
            args.push('ORCPT=' + this._envelope.dsn.orcpt);
        }
    }
    return (args.length ? ' ' + args.join(' ') : '');
};

SMTPConnection.prototype._createSendStream = function (callback) {
    var dataStream = new DataStream();
    var logStream;

    if (this.options.lmtp) {
        this._envelope.accepted.forEach(function (recipient, i) {
            var final = i === this._envelope.accepted.length - 1;
            this._responseActions.push(function (str) {
                this._actionLMTPStream(recipient, final, str, callback);
            }.bind(this));
        }.bind(this));
    } else {
        this._responseActions.push(function (str) {
            this._actionSMTPStream(str, callback);
        }.bind(this));
    }

    dataStream.pipe(this._socket, {
        end: false
    });

    if (this.options.debug) {
        logStream = new PassThrough();
        logStream.on('readable', function () {
            var chunk;
            while ((chunk = logStream.read())) {
                this.logger.debug('[%s] C: %s', this.id, chunk.toString('binary').replace(/\r?\n$/, ''));
            }
        }.bind(this));
        dataStream.pipe(logStream);
    }

    dataStream.once('end', function () {
        this.logger.info('[%s] C: <%s bytes encoded mime message (source size %s bytes)>', this.id, dataStream.outByteCount, dataStream.inByteCount);
    }.bind(this));

    return dataStream;
};

/** ACTIONS **/

/**
 * Will be run after the connection is created and the server sends
 * a greeting. If the incoming message starts with 220 initiate
 * SMTP session by sending EHLO command
 *
 * @param {String} str Message from the server
 */
SMTPConnection.prototype._actionGreeting = function (str) {
    clearTimeout(this._greetingTimeout);

    if (str.substr(0, 3) !== '220') {
        this._onError(new Error('Invalid greeting from server:\n' + str), 'EPROTOCOL', str, 'CONN');
        return;
    }

    if (this.options.lmtp) {
        this._responseActions.push(this._actionLHLO);
        this._sendCommand('LHLO ' + this.name);
    } else {
        this._responseActions.push(this._actionEHLO);
        this._sendCommand('EHLO ' + this.name);
    }
};

/**
 * Handles server response for LHLO command. If it yielded in
 * error, emit 'error', otherwise treat this as an EHLO response
 *
 * @param {String} str Message from the server
 */
SMTPConnection.prototype._actionLHLO = function (str) {
    if (str.charAt(0) !== '2') {
        this._onError(new Error('Invalid response for LHLO:\n' + str), 'EPROTOCOL', str, 'LHLO');
        return;
    }

    this._actionEHLO(str);
};

/**
 * Handles server response for EHLO command. If it yielded in
 * error, try HELO instead, otherwise initiate TLS negotiation
 * if STARTTLS is supported by the server or move into the
 * authentication phase.
 *
 * @param {String} str Message from the server
 */
SMTPConnection.prototype._actionEHLO = function (str) {
    var match;

    if (str.substr(0, 3) === '421') {
        this._onError(new Error('Server terminates connection:\n' + str), 'ECONNECTION', str, 'EHLO');
        return;
    }

    if (str.charAt(0) !== '2') {
        if (this.options.requireTLS) {
            this._onError(new Error('EHLO failed but HELO does not support required STARTTLS:\n' + str), 'ECONNECTION', str, 'EHLO');
            return;
        }

        // Try HELO instead
        this._responseActions.push(this._actionHELO);
        this._sendCommand('HELO ' + this.name);
        return;
    }

    // Detect if the server supports STARTTLS
    if (!this.secure && !this.options.ignoreTLS && (/[ \-]STARTTLS\b/mi.test(str) || this.options.requireTLS)) {
        this._sendCommand('STARTTLS');
        this._responseActions.push(this._actionSTARTTLS);
        return;
    }

    // Detect if the server supports SMTPUTF8
    if (/[ \-]SMTPUTF8\b/mi.test(str)) {
        this._supportedExtensions.push('SMTPUTF8');
    }

    // Detect if the server supports DSN
    if (/[ \-]DSN\b/mi.test(str)) {
        this._supportedExtensions.push('DSN');
    }

    // Detect if the server supports 8BITMIME
    if (/[ \-]8BITMIME\b/mi.test(str)) {
        this._supportedExtensions.push('8BITMIME');
    }

    // Detect if the server supports PIPELINING
    if (/[ \-]PIPELINING\b/mi.test(str)) {
        this._supportedExtensions.push('PIPELINING');
    }

    // Detect if the server supports PLAIN auth
    if (/AUTH(?:(\s+|=)[^\n]*\s+|\s+|=)PLAIN/i.test(str)) {
        this._supportedAuth.push('PLAIN');
    }

    // Detect if the server supports LOGIN auth
    if (/AUTH(?:(\s+|=)[^\n]*\s+|\s+|=)LOGIN/i.test(str)) {
        this._supportedAuth.push('LOGIN');
    }

    // Detect if the server supports CRAM-MD5 auth
    if (/AUTH(?:(\s+|=)[^\n]*\s+|\s+|=)CRAM-MD5/i.test(str)) {
        this._supportedAuth.push('CRAM-MD5');
    }

    // Detect if the server supports XOAUTH2 auth
    if (/AUTH(?:(\s+|=)[^\n]*\s+|\s+|=)XOAUTH2/i.test(str)) {
        this._supportedAuth.push('XOAUTH2');
    }

    // Detect if the server supports SIZE extensions (and the max allowed size)
    if ((match = str.match(/[ \-]SIZE(?:\s+(\d+))?/mi))) {
        this._supportedExtensions.push('SIZE');
        this._maxAllowedSize = Number(match[1]) || 0;
    }

    this.emit('connect');
};

/**
 * Handles server response for HELO command. If it yielded in
 * error, emit 'error', otherwise move into the authentication phase.
 *
 * @param {String} str Message from the server
 */
SMTPConnection.prototype._actionHELO = function (str) {
    if (str.charAt(0) !== '2') {
        this._onError(new Error('Invalid response for EHLO/HELO:\n' + str), 'EPROTOCOL', str, 'HELO');
        return;
    }

    this.emit('connect');
};

/**
 * Handles server response for STARTTLS command. If there's an error
 * try HELO instead, otherwise initiate TLS upgrade. If the upgrade
 * succeedes restart the EHLO
 *
 * @param {String} str Message from the server
 */
SMTPConnection.prototype._actionSTARTTLS = function (str) {
    if (str.charAt(0) !== '2') {
        if (this.options.opportunisticTLS) {
            this.logger.info('[%s] Failed STARTTLS upgrade, continuing unencrypted', this.id);
            return this.emit('connect');
        }
        this._onError(new Error('Error upgrading connection with STARTTLS'), 'ETLS', str, 'STARTTLS');
        return;
    }

    this._upgradeConnection(function (err, secured) {
        if (err) {
            this._onError(new Error('Error initiating TLS - ' + (err.message || err)), 'ETLS', false, 'STARTTLS');
            return;
        }

        this.logger.info('[%s] Connection upgraded with STARTTLS', this.id);

        if (secured) {
            // restart session
            this._responseActions.push(this._actionEHLO);
            this._sendCommand('EHLO ' + this.name);
        } else {
            this.emit('connect');
        }
    }.bind(this));
};

/**
 * Handle the response for AUTH LOGIN command. We are expecting
 * '334 VXNlcm5hbWU6' (base64 for 'Username:'). Data to be sent as
 * response needs to be base64 encoded username.
 *
 * @param {String} str Message from the server
 */
SMTPConnection.prototype._actionAUTH_LOGIN_USER = function (str, callback) {
    if (str !== '334 VXNlcm5hbWU6') {
        callback(this._formatError('Invalid login sequence while waiting for "334 VXNlcm5hbWU6"', 'EAUTH', str, 'AUTH LOGIN'));
        return;
    }

    this._responseActions.push(function (str) {
        this._actionAUTH_LOGIN_PASS(str, callback);
    }.bind(this));

    this._sendCommand(new Buffer(this._auth.user + '', 'utf-8').toString('base64'));
};

/**
 * Handle the response for AUTH NTLM, which should be a
 * '334 <challenge string>'. See http://davenport.sourceforge.net/ntlm.html
 * We already sent the Type1 message, the challenge is a Type2 message, we
 * need to respond with a Type3 message.
 *
 * @param {String} str Message from the server
 */
SMTPConnection.prototype._actionAUTH_NTLM_TYPE1 = function (str, callback) {
    var challengeMatch = str.match(/^334\s+(.+)$/);
    var challengeString = '';

    if (!challengeMatch) {
        return callback(this._formatError('Invalid login sequence while waiting for server challenge string', 'EAUTH', str, 'AUTH NTLM'));
    } else {
        challengeString = challengeMatch[1];
    }

    if (!/^NTLM/i.test(challengeString)) {
        challengeString = 'NTLM ' + challengeString;
    }

    var type2Message = ntlm.parseType2Message(challengeString, callback);
    if (!type2Message) {
        return;
    }

    var type3Message = ntlm.createType3Message(type2Message, {
        domain: this._auth.domain || '',
        workstation: this._auth.workstation || '',
        username: this._auth.user,
        password: this._auth.pass
    });

    type3Message = type3Message.substring(5); // remove the "NTLM " prefix

    this._responseActions.push(function (str) {
        this._actionAUTH_NTLM_TYPE3(str, callback);
    }.bind(this));

    this._sendCommand(type3Message);
};

/**
 * Handle the response for AUTH CRAM-MD5 command. We are expecting
 * '334 <challenge string>'. Data to be sent as response needs to be
 * base64 decoded challenge string, MD5 hashed using the password as
 * a HMAC key, prefixed by the username and a space, and finally all
 * base64 encoded again.
 *
 * @param {String} str Message from the server
 */
SMTPConnection.prototype._actionAUTH_CRAM_MD5 = function (str, callback) {
    var challengeMatch = str.match(/^334\s+(.+)$/);
    var challengeString = '';

    if (!challengeMatch) {
        return callback(this._formatError('Invalid login sequence while waiting for server challenge string', 'EAUTH', str, 'AUTH CRAM-MD5'));
    } else {
        challengeString = challengeMatch[1];
    }

    // Decode from base64
    var base64decoded = new Buffer(challengeString, 'base64').toString('ascii'),
        hmac_md5 = crypto.createHmac('md5', this._auth.pass);

    hmac_md5.update(base64decoded);

    var hex_hmac = hmac_md5.digest('hex'),
        prepended = this._auth.user + ' ' + hex_hmac;

    this._responseActions.push(function (str) {
        this._actionAUTH_CRAM_MD5_PASS(str, callback);
    }.bind(this));


    this._sendCommand(new Buffer(prepended).toString('base64'));
};

/**
 * Handles the response to CRAM-MD5 authentication, if there's no error,
 * the user can be considered logged in. Start waiting for a message to send
 *
 * @param {String} str Message from the server
 */
SMTPConnection.prototype._actionAUTH_CRAM_MD5_PASS = function (str, callback) {
    if (!str.match(/^235\s+/)) {
        return callback(this._formatError('Invalid login sequence while waiting for "235"', 'EAUTH', str, 'AUTH CRAM-MD5'));
    }

    this.logger.info('[%s] User %s authenticated', this.id, JSON.stringify(this._user));
    this.authenticated = true;
    callback(null, true);
};

/**
 * Handles the TYPE3 response for NTLM authentication, if there's no error,
 * the user can be considered logged in. Start waiting for a message to send
 *
 * @param {String} str Message from the server
 */
SMTPConnection.prototype._actionAUTH_NTLM_TYPE3 = function (str, callback) {
    if (!str.match(/^235\s+/)) {
        return callback(this._formatError('Invalid login sequence while waiting for "235"', 'EAUTH', str, 'AUTH NTLM'));
    }

    this.logger.info('[%s] User %s authenticated', this.id, JSON.stringify(this._user));
    this.authenticated = true;
    callback(null, true);
};

/**
 * Handle the response for AUTH LOGIN command. We are expecting
 * '334 UGFzc3dvcmQ6' (base64 for 'Password:'). Data to be sent as
 * response needs to be base64 encoded password.
 *
 * @param {String} str Message from the server
 */
SMTPConnection.prototype._actionAUTH_LOGIN_PASS = function (str, callback) {
    if (str !== '334 UGFzc3dvcmQ6') {
        return callback(this._formatError('Invalid login sequence while waiting for "334 UGFzc3dvcmQ6"', 'EAUTH', str, 'AUTH LOGIN'));
    }

    this._responseActions.push(function (str) {
        this._actionAUTHComplete(str, callback);
    }.bind(this));

    this._sendCommand(new Buffer(this._auth.pass + '', 'utf-8').toString('base64'));
};

/**
 * Handles the response for authentication, if there's no error,
 * the user can be considered logged in. Start waiting for a message to send
 *
 * @param {String} str Message from the server
 */
SMTPConnection.prototype._actionAUTHComplete = function (str, isRetry, callback) {
    if (!callback && typeof isRetry === 'function') {
        callback = isRetry;
        isRetry = undefined;
    }

    if (str.substr(0, 3) === '334') {
        this._responseActions.push(function (str) {
            if (isRetry || !this._auth.xoauth2 || typeof this._auth.xoauth2 !== 'object') {
                this._actionAUTHComplete(str, true, callback);
            } else {
                setTimeout(this._handleXOauth2Token.bind(this, true, callback), Math.random() * 4000 + 1000);
            }
        }.bind(this));
        this._sendCommand('');
        return;
    }

    if (str.charAt(0) !== '2') {
        this.logger.info('[%s] User %s failed to authenticate', this.id, JSON.stringify(this._user));
        return callback(this._formatError('Invalid login', 'EAUTH', str, 'AUTH ' + this._authMethod));
    }

    this.logger.info('[%s] User %s authenticated', this.id, JSON.stringify(this._user));
    this.authenticated = true;
    callback(null, true);
};

/**
 * Handle response for a MAIL FROM: command
 *
 * @param {String} str Message from the server
 */
SMTPConnection.prototype._actionMAIL = function (str, callback) {
    var message, curRecipient;
    if (Number(str.charAt(0)) !== 2) {
        if (this._usingSmtpUtf8 && /^550 /.test(str) && /[\x80-\uFFFF]/.test(this._envelope.from)) {
            message = 'Internationalized mailbox name not allowed';
        } else {
            message = 'Mail command failed';
        }
        return callback(this._formatError(message, 'EENVELOPE', str, 'MAIL FROM'));
    }

    if (!this._envelope.rcptQueue.length) {
        return callback(this._formatError('Can\'t send mail - no recipients defined', 'EENVELOPE', false, 'API'));
    } else {
        this._recipientQueue = [];

        if (this._supportedExtensions.indexOf('PIPELINING') >= 0) {
            while (this._envelope.rcptQueue.length) {
                curRecipient = this._envelope.rcptQueue.shift();
                this._recipientQueue.push(curRecipient);
                this._responseActions.push(function (str) {
                    this._actionRCPT(str, callback);
                }.bind(this));
                this._sendCommand('RCPT TO:<' + curRecipient + '>' + this._getDsnRcptToArgs());
            }
        } else {
            curRecipient = this._envelope.rcptQueue.shift();
            this._recipientQueue.push(curRecipient);
            this._responseActions.push(function (str) {
                this._actionRCPT(str, callback);
            }.bind(this));
            this._sendCommand('RCPT TO:<' + curRecipient + '>' + this._getDsnRcptToArgs());
        }
    }
};

/**
 * Handle response for a RCPT TO: command
 *
 * @param {String} str Message from the server
 */
SMTPConnection.prototype._actionRCPT = function (str, callback) {
    var message, err, curRecipient = this._recipientQueue.shift();
    if (Number(str.charAt(0)) !== 2) {
        // this is a soft error
        if (this._usingSmtpUtf8 && /^553 /.test(str) && /[\x80-\uFFFF]/.test(curRecipient)) {
            message = 'Internationalized mailbox name not allowed';
        } else {
            message = 'Recipient command failed';
        }
        this._envelope.rejected.push(curRecipient);
        // store error for the failed recipient
        err = this._formatError(message, 'EENVELOPE', str, 'RCPT TO');
        err.recipient = curRecipient;
        this._envelope.rejectedErrors.push(err);
    } else {
        this._envelope.accepted.push(curRecipient);
    }

    if (!this._envelope.rcptQueue.length && !this._recipientQueue.length) {
        if (this._envelope.rejected.length < this._envelope.to.length) {
            this._responseActions.push(function (str) {
                this._actionDATA(str, callback);
            }.bind(this));
            this._sendCommand('DATA');
        } else {
            err = this._formatError('Can\'t send mail - all recipients were rejected', 'EENVELOPE', str, 'RCPT TO');
            err.rejected = this._envelope.rejected;
            err.rejectedErrors = this._envelope.rejectedErrors;
            return callback(err);
        }
    } else if (this._envelope.rcptQueue.length) {
        curRecipient = this._envelope.rcptQueue.shift();
        this._recipientQueue.push(curRecipient);
        this._responseActions.push(function (str) {
            this._actionRCPT(str, callback);
        }.bind(this));
        this._sendCommand('RCPT TO:<' + curRecipient + '>' + this._getDsnRcptToArgs());
    }
};

/**
 * Handle response for a DATA command
 *
 * @param {String} str Message from the server
 */
SMTPConnection.prototype._actionDATA = function (str, callback) {
    // response should be 354 but according to this issue https://github.com/eleith/emailjs/issues/24
    // some servers might use 250 instead, so lets check for 2 or 3 as the first digit
    if ([2, 3].indexOf(Number(str.charAt(0))) < 0) {
        return callback(this._formatError('Data command failed', 'EENVELOPE', str, 'DATA'));
    }

    var response = {
        accepted: this._envelope.accepted,
        rejected: this._envelope.rejected
    };

    if (this._envelope.rejectedErrors.length) {
        response.rejectedErrors = this._envelope.rejectedErrors;
    }

    callback(null, response);
};

/**
 * Handle response for a DATA stream when using SMTP
 * We expect a single response that defines if the sending succeeded or failed
 *
 * @param {String} str Message from the server
 */
SMTPConnection.prototype._actionSMTPStream = function (str, callback) {
    if (Number(str.charAt(0)) !== 2) {
        // Message failed
        return callback(this._formatError('Message failed', 'EMESSAGE', str, 'DATA'));
    } else {
        // Message sent succesfully
        return callback(null, str);
    }
};

/**
 * Handle response for a DATA stream
 * We expect a separate response for every recipient. All recipients can either
 * succeed or fail separately
 *
 * @param {String} recipient The recipient this response applies to
 * @param {Boolean} final Is this the final recipient?
 * @param {String} str Message from the server
 */
SMTPConnection.prototype._actionLMTPStream = function (recipient, final, str, callback) {
    var err;
    if (Number(str.charAt(0)) !== 2) {
        // Message failed
        err = this._formatError('Message failed for recipient ' + recipient, 'EMESSAGE', str, 'DATA');
        err.recipient = recipient;
        this._envelope.rejected.push(recipient);
        this._envelope.rejectedErrors.push(err);
        for (var i = 0, len = this._envelope.accepted.length; i < len; i++) {
            if (this._envelope.accepted[i] === recipient) {
                this._envelope.accepted.splice(i, 1);
            }
        }
    }
    if (final) {
        return callback(null, str);
    }
};

SMTPConnection.prototype._handleXOauth2Token = function (isRetry, callback) {
    this._responseActions.push(function (str) {
        this._actionAUTHComplete(str, isRetry, callback);
    }.bind(this));

    if (this._auth.xoauth2 && typeof this._auth.xoauth2 === 'object') {
        this._auth.xoauth2[isRetry ? 'generateToken' : 'getToken'](function (err, token) {
            if (err) {
                this.logger.info('[%s] User %s failed to authenticate', this.id, JSON.stringify(this._user));
                return callback(this._formatError(err, 'EAUTH', false, 'AUTH XOAUTH2'));
            }
            this._sendCommand('AUTH XOAUTH2 ' + token);
        }.bind(this));
    } else {
        this._sendCommand('AUTH XOAUTH2 ' + this._buildXOAuth2Token(this._auth.user, this._auth.xoauth2));
    }
};

/**
 * Builds a login token for XOAUTH2 authentication command
 *
 * @param {String} user E-mail address of the user
 * @param {String} token Valid access token for the user
 * @return {String} Base64 formatted login token
 */
SMTPConnection.prototype._buildXOAuth2Token = function (user, token) {
    var authData = [
        'user=' + (user || ''),
        'auth=Bearer ' + token,
        '',
        ''
    ];
    return new Buffer(authData.join('\x01')).toString('base64');
};

SMTPConnection.prototype._getHostname = function () {
    // defaul hostname is machine hostname or [IP]
    var defaultHostname = os.hostname() || '';

    // ignore if not FQDN
    if (defaultHostname.indexOf('.') < 0) {
        defaultHostname = '[127.0.0.1]';
    }

    // IP should be enclosed in []
    if (defaultHostname.match(/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/)) {
        defaultHostname = '[' + defaultHostname + ']';
    }

    return defaultHostname;
};


/***/ }),
/* 7 */
/***/ (function(module, exports) {

module.exports = require("net");

/***/ }),
/* 8 */
/***/ (function(module, exports) {

module.exports = [["0","\u0000",127,"€"],["8140","丂丄丅丆丏丒丗丟丠両丣並丩丮丯丱丳丵丷丼乀乁乂乄乆乊乑乕乗乚乛乢乣乤乥乧乨乪",5,"乲乴",9,"乿",6,"亇亊"],["8180","亐亖亗亙亜亝亞亣亪亯亰亱亴亶亷亸亹亼亽亾仈仌仏仐仒仚仛仜仠仢仦仧仩仭仮仯仱仴仸仹仺仼仾伀伂",6,"伋伌伒",4,"伜伝伡伣伨伩伬伭伮伱伳伵伷伹伻伾",4,"佄佅佇",5,"佒佔佖佡佢佦佨佪佫佭佮佱佲併佷佸佹佺佽侀侁侂侅來侇侊侌侎侐侒侓侕侖侘侙侚侜侞侟価侢"],["8240","侤侫侭侰",4,"侶",8,"俀俁係俆俇俈俉俋俌俍俒",4,"俙俛俠俢俤俥俧俫俬俰俲俴俵俶俷俹俻俼俽俿",11],["8280","個倎倐們倓倕倖倗倛倝倞倠倢倣値倧倫倯",10,"倻倽倿偀偁偂偄偅偆偉偊偋偍偐",4,"偖偗偘偙偛偝",7,"偦",5,"偭",8,"偸偹偺偼偽傁傂傃傄傆傇傉傊傋傌傎",20,"傤傦傪傫傭",4,"傳",6,"傼"],["8340","傽",17,"僐",5,"僗僘僙僛",10,"僨僩僪僫僯僰僱僲僴僶",4,"僼",9,"儈"],["8380","儉儊儌",5,"儓",13,"儢",28,"兂兇兊兌兎兏児兒兓兗兘兙兛兝",4,"兣兤兦內兩兪兯兲兺兾兿冃冄円冇冊冋冎冏冐冑冓冔冘冚冝冞冟冡冣冦",4,"冭冮冴冸冹冺冾冿凁凂凃凅凈凊凍凎凐凒",5],["8440","凘凙凚凜凞凟凢凣凥",5,"凬凮凱凲凴凷凾刄刅刉刋刌刏刐刓刔刕刜刞刟刡刢刣別刦刧刪刬刯刱刲刴刵刼刾剄",5,"剋剎剏剒剓剕剗剘"],["8480","剙剚剛剝剟剠剢剣剤剦剨剫剬剭剮剰剱剳",9,"剾劀劃",4,"劉",6,"劑劒劔",6,"劜劤劥劦劧劮劯劰労",9,"勀勁勂勄勅勆勈勊勌勍勎勏勑勓勔動勗務",5,"勠勡勢勣勥",10,"勱",7,"勻勼勽匁匂匃匄匇匉匊匋匌匎"],["8540","匑匒匓匔匘匛匜匞匟匢匤匥匧匨匩匫匬匭匯",9,"匼匽區卂卄卆卋卌卍卐協単卙卛卝卥卨卪卬卭卲卶卹卻卼卽卾厀厁厃厇厈厊厎厏"],["8580","厐",4,"厖厗厙厛厜厞厠厡厤厧厪厫厬厭厯",6,"厷厸厹厺厼厽厾叀參",4,"収叏叐叒叓叕叚叜叝叞叡叢叧叴叺叾叿吀吂吅吇吋吔吘吙吚吜吢吤吥吪吰吳吶吷吺吽吿呁呂呄呅呇呉呌呍呎呏呑呚呝",4,"呣呥呧呩",7,"呴呹呺呾呿咁咃咅咇咈咉咊咍咑咓咗咘咜咞咟咠咡"],["8640","咢咥咮咰咲咵咶咷咹咺咼咾哃哅哊哋哖哘哛哠",4,"哫哬哯哰哱哴",5,"哻哾唀唂唃唄唅唈唊",4,"唒唓唕",5,"唜唝唞唟唡唥唦"],["8680","唨唩唫唭唲唴唵唶唸唹唺唻唽啀啂啅啇啈啋",4,"啑啒啓啔啗",4,"啝啞啟啠啢啣啨啩啫啯",5,"啹啺啽啿喅喆喌喍喎喐喒喓喕喖喗喚喛喞喠",6,"喨",8,"喲喴営喸喺喼喿",4,"嗆嗇嗈嗊嗋嗎嗏嗐嗕嗗",4,"嗞嗠嗢嗧嗩嗭嗮嗰嗱嗴嗶嗸",4,"嗿嘂嘃嘄嘅"],["8740","嘆嘇嘊嘋嘍嘐",7,"嘙嘚嘜嘝嘠嘡嘢嘥嘦嘨嘩嘪嘫嘮嘯嘰嘳嘵嘷嘸嘺嘼嘽嘾噀",11,"噏",4,"噕噖噚噛噝",4],["8780","噣噥噦噧噭噮噯噰噲噳噴噵噷噸噹噺噽",7,"嚇",6,"嚐嚑嚒嚔",14,"嚤",10,"嚰",6,"嚸嚹嚺嚻嚽",12,"囋",8,"囕囖囘囙囜団囥",5,"囬囮囯囲図囶囷囸囻囼圀圁圂圅圇國",6],["8840","園",9,"圝圞圠圡圢圤圥圦圧圫圱圲圴",4,"圼圽圿坁坃坄坅坆坈坉坋坒",4,"坘坙坢坣坥坧坬坮坰坱坲坴坵坸坹坺坽坾坿垀"],["8880","垁垇垈垉垊垍",4,"垔",6,"垜垝垞垟垥垨垪垬垯垰垱垳垵垶垷垹",8,"埄",6,"埌埍埐埑埓埖埗埛埜埞埡埢埣埥",7,"埮埰埱埲埳埵埶執埻埼埾埿堁堃堄堅堈堉堊堌堎堏堐堒堓堔堖堗堘堚堛堜堝堟堢堣堥",4,"堫",4,"報堲堳場堶",7],["8940","堾",5,"塅",6,"塎塏塐塒塓塕塖塗塙",4,"塟",5,"塦",4,"塭",16,"塿墂墄墆墇墈墊墋墌"],["8980","墍",4,"墔",4,"墛墜墝墠",7,"墪",17,"墽墾墿壀壂壃壄壆",10,"壒壓壔壖",13,"壥",5,"壭壯壱売壴壵壷壸壺",7,"夃夅夆夈",4,"夎夐夑夒夓夗夘夛夝夞夠夡夢夣夦夨夬夰夲夳夵夶夻"],["8a40","夽夾夿奀奃奅奆奊奌奍奐奒奓奙奛",4,"奡奣奤奦",12,"奵奷奺奻奼奾奿妀妅妉妋妌妎妏妐妑妔妕妘妚妛妜妝妟妠妡妢妦"],["8a80","妧妬妭妰妱妳",5,"妺妼妽妿",6,"姇姈姉姌姍姎姏姕姖姙姛姞",4,"姤姦姧姩姪姫姭",11,"姺姼姽姾娀娂娊娋娍娎娏娐娒娔娕娖娗娙娚娛娝娞娡娢娤娦娧娨娪",6,"娳娵娷",4,"娽娾娿婁",4,"婇婈婋",9,"婖婗婘婙婛",5],["8b40","婡婣婤婥婦婨婩婫",8,"婸婹婻婼婽婾媀",17,"媓",6,"媜",13,"媫媬"],["8b80","媭",4,"媴媶媷媹",4,"媿嫀嫃",5,"嫊嫋嫍",4,"嫓嫕嫗嫙嫚嫛嫝嫞嫟嫢嫤嫥嫧嫨嫪嫬",4,"嫲",22,"嬊",11,"嬘",25,"嬳嬵嬶嬸",7,"孁",6],["8c40","孈",7,"孒孖孞孠孡孧孨孫孭孮孯孲孴孶孷學孹孻孼孾孿宂宆宊宍宎宐宑宒宔宖実宧宨宩宬宭宮宯宱宲宷宺宻宼寀寁寃寈寉寊寋寍寎寏"],["8c80","寑寔",8,"寠寢寣實寧審",4,"寯寱",6,"寽対尀専尃尅將專尋尌對導尐尒尓尗尙尛尞尟尠尡尣尦尨尩尪尫尭尮尯尰尲尳尵尶尷屃屄屆屇屌屍屒屓屔屖屗屘屚屛屜屝屟屢層屧",6,"屰屲",6,"屻屼屽屾岀岃",4,"岉岊岋岎岏岒岓岕岝",4,"岤",4],["8d40","岪岮岯岰岲岴岶岹岺岻岼岾峀峂峃峅",5,"峌",5,"峓",5,"峚",6,"峢峣峧峩峫峬峮峯峱",9,"峼",4],["8d80","崁崄崅崈",5,"崏",4,"崕崗崘崙崚崜崝崟",4,"崥崨崪崫崬崯",4,"崵",7,"崿",7,"嵈嵉嵍",10,"嵙嵚嵜嵞",10,"嵪嵭嵮嵰嵱嵲嵳嵵",12,"嶃",21,"嶚嶛嶜嶞嶟嶠"],["8e40","嶡",21,"嶸",12,"巆",6,"巎",12,"巜巟巠巣巤巪巬巭"],["8e80","巰巵巶巸",4,"巿帀帄帇帉帊帋帍帎帒帓帗帞",7,"帨",4,"帯帰帲",4,"帹帺帾帿幀幁幃幆",5,"幍",6,"幖",4,"幜幝幟幠幣",14,"幵幷幹幾庁庂広庅庈庉庌庍庎庒庘庛庝庡庢庣庤庨",4,"庮",4,"庴庺庻庼庽庿",6],["8f40","廆廇廈廋",5,"廔廕廗廘廙廚廜",11,"廩廫",8,"廵廸廹廻廼廽弅弆弇弉弌弍弎弐弒弔弖弙弚弜弝弞弡弢弣弤"],["8f80","弨弫弬弮弰弲",6,"弻弽弾弿彁",14,"彑彔彙彚彛彜彞彟彠彣彥彧彨彫彮彯彲彴彵彶彸彺彽彾彿徃徆徍徎徏徑従徔徖徚徛徝從徟徠徢",5,"復徫徬徯",5,"徶徸徹徺徻徾",4,"忇忈忊忋忎忓忔忕忚忛応忞忟忢忣忥忦忨忩忬忯忰忲忳忴忶忷忹忺忼怇"],["9040","怈怉怋怌怐怑怓怗怘怚怞怟怢怣怤怬怭怮怰",4,"怶",4,"怽怾恀恄",6,"恌恎恏恑恓恔恖恗恘恛恜恞恟恠恡恥恦恮恱恲恴恵恷恾悀"],["9080","悁悂悅悆悇悈悊悋悎悏悐悑悓悕悗悘悙悜悞悡悢悤悥悧悩悪悮悰悳悵悶悷悹悺悽",7,"惇惈惉惌",4,"惒惓惔惖惗惙惛惞惡",4,"惪惱惲惵惷惸惻",4,"愂愃愄愅愇愊愋愌愐",4,"愖愗愘愙愛愜愝愞愡愢愥愨愩愪愬",18,"慀",6],["9140","慇慉態慍慏慐慒慓慔慖",6,"慞慟慠慡慣慤慥慦慩",6,"慱慲慳慴慶慸",18,"憌憍憏",4,"憕"],["9180","憖",6,"憞",8,"憪憫憭",9,"憸",5,"憿懀懁懃",4,"應懌",4,"懓懕",16,"懧",13,"懶",8,"戀",5,"戇戉戓戔戙戜戝戞戠戣戦戧戨戩戫戭戯戰戱戲戵戶戸",4,"扂扄扅扆扊"],["9240","扏扐払扖扗扙扚扜",6,"扤扥扨扱扲扴扵扷扸扺扻扽抁抂抃抅抆抇抈抋",5,"抔抙抜抝択抣抦抧抩抪抭抮抯抰抲抳抴抶抷抸抺抾拀拁"],["9280","拃拋拏拑拕拝拞拠拡拤拪拫拰拲拵拸拹拺拻挀挃挄挅挆挊挋挌挍挏挐挒挓挔挕挗挘挙挜挦挧挩挬挭挮挰挱挳",5,"挻挼挾挿捀捁捄捇捈捊捑捒捓捔捖",7,"捠捤捥捦捨捪捫捬捯捰捲捳捴捵捸捹捼捽捾捿掁掃掄掅掆掋掍掑掓掔掕掗掙",6,"採掤掦掫掯掱掲掵掶掹掻掽掿揀"],["9340","揁揂揃揅揇揈揊揋揌揑揓揔揕揗",6,"揟揢揤",4,"揫揬揮揯揰揱揳揵揷揹揺揻揼揾搃搄搆",4,"損搎搑搒搕",5,"搝搟搢搣搤"],["9380","搥搧搨搩搫搮",5,"搵",4,"搻搼搾摀摂摃摉摋",6,"摓摕摖摗摙",4,"摟",7,"摨摪摫摬摮",9,"摻",6,"撃撆撈",8,"撓撔撗撘撚撛撜撝撟",4,"撥撦撧撨撪撫撯撱撲撳撴撶撹撻撽撾撿擁擃擄擆",6,"擏擑擓擔擕擖擙據"],["9440","擛擜擝擟擠擡擣擥擧",24,"攁",7,"攊",7,"攓",4,"攙",8],["9480","攢攣攤攦",4,"攬攭攰攱攲攳攷攺攼攽敀",4,"敆敇敊敋敍敎敐敒敓敔敗敘敚敜敟敠敡敤敥敧敨敩敪敭敮敯敱敳敵敶數",14,"斈斉斊斍斎斏斒斔斕斖斘斚斝斞斠斢斣斦斨斪斬斮斱",7,"斺斻斾斿旀旂旇旈旉旊旍旐旑旓旔旕旘",7,"旡旣旤旪旫"],["9540","旲旳旴旵旸旹旻",4,"昁昄昅昇昈昉昋昍昐昑昒昖昗昘昚昛昜昞昡昢昣昤昦昩昪昫昬昮昰昲昳昷",4,"昽昿晀時晄",6,"晍晎晐晑晘"],["9580","晙晛晜晝晞晠晢晣晥晧晩",4,"晱晲晳晵晸晹晻晼晽晿暀暁暃暅暆暈暉暊暋暍暎暏暐暒暓暔暕暘",4,"暞",8,"暩",4,"暯",4,"暵暶暷暸暺暻暼暽暿",25,"曚曞",7,"曧曨曪",5,"曱曵曶書曺曻曽朁朂會"],["9640","朄朅朆朇朌朎朏朑朒朓朖朘朙朚朜朞朠",5,"朧朩朮朰朲朳朶朷朸朹朻朼朾朿杁杄杅杇杊杋杍杒杔杕杗",4,"杝杢杣杤杦杧杫杬杮東杴杶"],["9680","杸杹杺杻杽枀枂枃枅枆枈枊枌枍枎枏枑枒枓枔枖枙枛枟枠枡枤枦枩枬枮枱枲枴枹",7,"柂柅",9,"柕柖柗柛柟柡柣柤柦柧柨柪柫柭柮柲柵",7,"柾栁栂栃栄栆栍栐栒栔栕栘",4,"栞栟栠栢",6,"栫",6,"栴栵栶栺栻栿桇桋桍桏桒桖",5],["9740","桜桝桞桟桪桬",7,"桵桸",8,"梂梄梇",7,"梐梑梒梔梕梖梘",9,"梣梤梥梩梪梫梬梮梱梲梴梶梷梸"],["9780","梹",6,"棁棃",5,"棊棌棎棏棐棑棓棔棖棗棙棛",4,"棡棢棤",9,"棯棲棳棴棶棷棸棻棽棾棿椀椂椃椄椆",4,"椌椏椑椓",11,"椡椢椣椥",7,"椮椯椱椲椳椵椶椷椸椺椻椼椾楀楁楃",16,"楕楖楘楙楛楜楟"],["9840","楡楢楤楥楧楨楩楪楬業楯楰楲",4,"楺楻楽楾楿榁榃榅榊榋榌榎",5,"榖榗榙榚榝",9,"榩榪榬榮榯榰榲榳榵榶榸榹榺榼榽"],["9880","榾榿槀槂",7,"構槍槏槑槒槓槕",5,"槜槝槞槡",11,"槮槯槰槱槳",9,"槾樀",9,"樋",11,"標",5,"樠樢",5,"権樫樬樭樮樰樲樳樴樶",6,"樿",4,"橅橆橈",7,"橑",6,"橚"],["9940","橜",4,"橢橣橤橦",10,"橲",6,"橺橻橽橾橿檁檂檃檅",8,"檏檒",4,"檘",7,"檡",5],["9980","檧檨檪檭",114,"欥欦欨",6],["9a40","欯欰欱欳欴欵欶欸欻欼欽欿歀歁歂歄歅歈歊歋歍",11,"歚",7,"歨歩歫",13,"歺歽歾歿殀殅殈"],["9a80","殌殎殏殐殑殔殕殗殘殙殜",4,"殢",7,"殫",7,"殶殸",6,"毀毃毄毆",4,"毌毎毐毑毘毚毜",4,"毢",7,"毬毭毮毰毱毲毴毶毷毸毺毻毼毾",6,"氈",4,"氎氒気氜氝氞氠氣氥氫氬氭氱氳氶氷氹氺氻氼氾氿汃汄汅汈汋",4,"汑汒汓汖汘"],["9b40","汙汚汢汣汥汦汧汫",4,"汱汳汵汷汸決汻汼汿沀沄沇沊沋沍沎沑沒沕沖沗沘沚沜沝沞沠沢沨沬沯沰沴沵沶沷沺泀況泂泃泆泇泈泋泍泎泏泑泒泘"],["9b80","泙泚泜泝泟泤泦泧泩泬泭泲泴泹泿洀洂洃洅洆洈洉洊洍洏洐洑洓洔洕洖洘洜洝洟",5,"洦洨洩洬洭洯洰洴洶洷洸洺洿浀浂浄浉浌浐浕浖浗浘浛浝浟浡浢浤浥浧浨浫浬浭浰浱浲浳浵浶浹浺浻浽",4,"涃涄涆涇涊涋涍涏涐涒涖",4,"涜涢涥涬涭涰涱涳涴涶涷涹",5,"淁淂淃淈淉淊"],["9c40","淍淎淏淐淒淓淔淕淗淚淛淜淟淢淣淥淧淨淩淪淭淯淰淲淴淵淶淸淺淽",7,"渆渇済渉渋渏渒渓渕渘渙減渜渞渟渢渦渧渨渪測渮渰渱渳渵"],["9c80","渶渷渹渻",7,"湅",7,"湏湐湑湒湕湗湙湚湜湝湞湠",10,"湬湭湯",14,"満溁溂溄溇溈溊",4,"溑",6,"溙溚溛溝溞溠溡溣溤溦溨溩溫溬溭溮溰溳溵溸溹溼溾溿滀滃滄滅滆滈滉滊滌滍滎滐滒滖滘滙滛滜滝滣滧滪",5],["9d40","滰滱滲滳滵滶滷滸滺",7,"漃漄漅漇漈漊",4,"漐漑漒漖",9,"漡漢漣漥漦漧漨漬漮漰漲漴漵漷",6,"漿潀潁潂"],["9d80","潃潄潅潈潉潊潌潎",9,"潙潚潛潝潟潠潡潣潤潥潧",5,"潯潰潱潳潵潶潷潹潻潽",6,"澅澆澇澊澋澏",12,"澝澞澟澠澢",4,"澨",10,"澴澵澷澸澺",5,"濁濃",5,"濊",6,"濓",10,"濟濢濣濤濥"],["9e40","濦",7,"濰",32,"瀒",7,"瀜",6,"瀤",6],["9e80","瀫",9,"瀶瀷瀸瀺",17,"灍灎灐",13,"灟",11,"灮灱灲灳灴灷灹灺灻災炁炂炃炄炆炇炈炋炌炍炏炐炑炓炗炘炚炛炞",12,"炰炲炴炵炶為炾炿烄烅烆烇烉烋",12,"烚"],["9f40","烜烝烞烠烡烢烣烥烪烮烰",6,"烸烺烻烼烾",10,"焋",4,"焑焒焔焗焛",10,"焧",7,"焲焳焴"],["9f80","焵焷",13,"煆煇煈煉煋煍煏",12,"煝煟",4,"煥煩",4,"煯煰煱煴煵煶煷煹煻煼煾",5,"熅",4,"熋熌熍熎熐熑熒熓熕熖熗熚",4,"熡",6,"熩熪熫熭",5,"熴熶熷熸熺",8,"燄",9,"燏",4],["a040","燖",9,"燡燢燣燤燦燨",5,"燯",9,"燺",11,"爇",19],["a080","爛爜爞",9,"爩爫爭爮爯爲爳爴爺爼爾牀",6,"牉牊牋牎牏牐牑牓牔牕牗牘牚牜牞牠牣牤牥牨牪牫牬牭牰牱牳牴牶牷牸牻牼牽犂犃犅",4,"犌犎犐犑犓",11,"犠",11,"犮犱犲犳犵犺",6,"狅狆狇狉狊狋狌狏狑狓狔狕狖狘狚狛"],["a1a1","　、。·ˉˇ¨〃々—～‖…‘’“”〔〕〈",7,"〖〗【】±×÷∶∧∨∑∏∪∩∈∷√⊥∥∠⌒⊙∫∮≡≌≈∽∝≠≮≯≤≥∞∵∴♂♀°′″℃＄¤￠￡‰§№☆★○●◎◇◆□■△▲※→←↑↓〓"],["a2a1","ⅰ",9],["a2b1","⒈",19,"⑴",19,"①",9],["a2e5","㈠",9],["a2f1","Ⅰ",11],["a3a1","！＂＃￥％",88,"￣"],["a4a1","ぁ",82],["a5a1","ァ",85],["a6a1","Α",16,"Σ",6],["a6c1","α",16,"σ",6],["a6e0","︵︶︹︺︿﹀︽︾﹁﹂﹃﹄"],["a6ee","︻︼︷︸︱"],["a6f4","︳︴"],["a7a1","А",5,"ЁЖ",25],["a7d1","а",5,"ёж",25],["a840","ˊˋ˙–―‥‵℅℉↖↗↘↙∕∟∣≒≦≧⊿═",35,"▁",6],["a880","█",7,"▓▔▕▼▽◢◣◤◥☉⊕〒〝〞"],["a8a1","āáǎàēéěèīíǐìōóǒòūúǔùǖǘǚǜüêɑ"],["a8bd","ńň"],["a8c0","ɡ"],["a8c5","ㄅ",36],["a940","〡",8,"㊣㎎㎏㎜㎝㎞㎡㏄㏎㏑㏒㏕︰￢￤"],["a959","℡㈱"],["a95c","‐"],["a960","ー゛゜ヽヾ〆ゝゞ﹉",9,"﹔﹕﹖﹗﹙",8],["a980","﹢",4,"﹨﹩﹪﹫"],["a996","〇"],["a9a4","─",75],["aa40","狜狝狟狢",5,"狪狫狵狶狹狽狾狿猀猂猄",5,"猋猌猍猏猐猑猒猔猘猙猚猟猠猣猤猦猧猨猭猯猰猲猳猵猶猺猻猼猽獀",8],["aa80","獉獊獋獌獎獏獑獓獔獕獖獘",7,"獡",10,"獮獰獱"],["ab40","獲",11,"獿",4,"玅玆玈玊玌玍玏玐玒玓玔玕玗玘玙玚玜玝玞玠玡玣",5,"玪玬玭玱玴玵玶玸玹玼玽玾玿珁珃",4],["ab80","珋珌珎珒",6,"珚珛珜珝珟珡珢珣珤珦珨珪珫珬珮珯珰珱珳",4],["ac40","珸",10,"琄琇琈琋琌琍琎琑",8,"琜",5,"琣琤琧琩琫琭琯琱琲琷",4,"琽琾琿瑀瑂",11],["ac80","瑎",6,"瑖瑘瑝瑠",12,"瑮瑯瑱",4,"瑸瑹瑺"],["ad40","瑻瑼瑽瑿璂璄璅璆璈璉璊璌璍璏璑",10,"璝璟",7,"璪",15,"璻",12],["ad80","瓈",9,"瓓",8,"瓝瓟瓡瓥瓧",6,"瓰瓱瓲"],["ae40","瓳瓵瓸",6,"甀甁甂甃甅",7,"甎甐甒甔甕甖甗甛甝甞甠",4,"甦甧甪甮甴甶甹甼甽甿畁畂畃畄畆畇畉畊畍畐畑畒畓畕畖畗畘"],["ae80","畝",7,"畧畨畩畫",6,"畳畵當畷畺",4,"疀疁疂疄疅疇"],["af40","疈疉疊疌疍疎疐疓疕疘疛疜疞疢疦",4,"疭疶疷疺疻疿痀痁痆痋痌痎痏痐痑痓痗痙痚痜痝痟痠痡痥痩痬痭痮痯痲痳痵痶痷痸痺痻痽痾瘂瘄瘆瘇"],["af80","瘈瘉瘋瘍瘎瘏瘑瘒瘓瘔瘖瘚瘜瘝瘞瘡瘣瘧瘨瘬瘮瘯瘱瘲瘶瘷瘹瘺瘻瘽癁療癄"],["b040","癅",6,"癎",5,"癕癗",4,"癝癟癠癡癢癤",6,"癬癭癮癰",7,"癹発發癿皀皁皃皅皉皊皌皍皏皐皒皔皕皗皘皚皛"],["b080","皜",7,"皥",8,"皯皰皳皵",9,"盀盁盃啊阿埃挨哎唉哀皑癌蔼矮艾碍爱隘鞍氨安俺按暗岸胺案肮昂盎凹敖熬翱袄傲奥懊澳芭捌扒叭吧笆八疤巴拔跋靶把耙坝霸罢爸白柏百摆佰败拜稗斑班搬扳般颁板版扮拌伴瓣半办绊邦帮梆榜膀绑棒磅蚌镑傍谤苞胞包褒剥"],["b140","盄盇盉盋盌盓盕盙盚盜盝盞盠",4,"盦",7,"盰盳盵盶盷盺盻盽盿眀眂眃眅眆眊県眎",10,"眛眜眝眞眡眣眤眥眧眪眫"],["b180","眬眮眰",4,"眹眻眽眾眿睂睄睅睆睈",7,"睒",7,"睜薄雹保堡饱宝抱报暴豹鲍爆杯碑悲卑北辈背贝钡倍狈备惫焙被奔苯本笨崩绷甭泵蹦迸逼鼻比鄙笔彼碧蓖蔽毕毙毖币庇痹闭敝弊必辟壁臂避陛鞭边编贬扁便变卞辨辩辫遍标彪膘表鳖憋别瘪彬斌濒滨宾摈兵冰柄丙秉饼炳"],["b240","睝睞睟睠睤睧睩睪睭",11,"睺睻睼瞁瞂瞃瞆",5,"瞏瞐瞓",11,"瞡瞣瞤瞦瞨瞫瞭瞮瞯瞱瞲瞴瞶",4],["b280","瞼瞾矀",12,"矎",8,"矘矙矚矝",4,"矤病并玻菠播拨钵波博勃搏铂箔伯帛舶脖膊渤泊驳捕卜哺补埠不布步簿部怖擦猜裁材才财睬踩采彩菜蔡餐参蚕残惭惨灿苍舱仓沧藏操糙槽曹草厕策侧册测层蹭插叉茬茶查碴搽察岔差诧拆柴豺搀掺蝉馋谗缠铲产阐颤昌猖"],["b340","矦矨矪矯矰矱矲矴矵矷矹矺矻矼砃",5,"砊砋砎砏砐砓砕砙砛砞砠砡砢砤砨砪砫砮砯砱砲砳砵砶砽砿硁硂硃硄硆硈硉硊硋硍硏硑硓硔硘硙硚"],["b380","硛硜硞",11,"硯",7,"硸硹硺硻硽",6,"场尝常长偿肠厂敞畅唱倡超抄钞朝嘲潮巢吵炒车扯撤掣彻澈郴臣辰尘晨忱沉陈趁衬撑称城橙成呈乘程惩澄诚承逞骋秤吃痴持匙池迟弛驰耻齿侈尺赤翅斥炽充冲虫崇宠抽酬畴踌稠愁筹仇绸瞅丑臭初出橱厨躇锄雏滁除楚"],["b440","碄碅碆碈碊碋碏碐碒碔碕碖碙碝碞碠碢碤碦碨",7,"碵碶碷碸確碻碼碽碿磀磂磃磄磆磇磈磌磍磎磏磑磒磓磖磗磘磚",9],["b480","磤磥磦磧磩磪磫磭",4,"磳磵磶磸磹磻",5,"礂礃礄礆",6,"础储矗搐触处揣川穿椽传船喘串疮窗幢床闯创吹炊捶锤垂春椿醇唇淳纯蠢戳绰疵茨磁雌辞慈瓷词此刺赐次聪葱囱匆从丛凑粗醋簇促蹿篡窜摧崔催脆瘁粹淬翠村存寸磋撮搓措挫错搭达答瘩打大呆歹傣戴带殆代贷袋待逮"],["b540","礍",5,"礔",9,"礟",4,"礥",14,"礵",4,"礽礿祂祃祄祅祇祊",8,"祔祕祘祙祡祣"],["b580","祤祦祩祪祫祬祮祰",6,"祹祻",4,"禂禃禆禇禈禉禋禌禍禎禐禑禒怠耽担丹单郸掸胆旦氮但惮淡诞弹蛋当挡党荡档刀捣蹈倒岛祷导到稻悼道盗德得的蹬灯登等瞪凳邓堤低滴迪敌笛狄涤翟嫡抵底地蒂第帝弟递缔颠掂滇碘点典靛垫电佃甸店惦奠淀殿碉叼雕凋刁掉吊钓调跌爹碟蝶迭谍叠"],["b640","禓",6,"禛",11,"禨",10,"禴",4,"禼禿秂秄秅秇秈秊秌秎秏秐秓秔秖秗秙",5,"秠秡秢秥秨秪"],["b680","秬秮秱",6,"秹秺秼秾秿稁稄稅稇稈稉稊稌稏",4,"稕稖稘稙稛稜丁盯叮钉顶鼎锭定订丢东冬董懂动栋侗恫冻洞兜抖斗陡豆逗痘都督毒犊独读堵睹赌杜镀肚度渡妒端短锻段断缎堆兑队对墩吨蹲敦顿囤钝盾遁掇哆多夺垛躲朵跺舵剁惰堕蛾峨鹅俄额讹娥恶厄扼遏鄂饿恩而儿耳尔饵洱二"],["b740","稝稟稡稢稤",14,"稴稵稶稸稺稾穀",5,"穇",9,"穒",4,"穘",16],["b780","穩",6,"穱穲穳穵穻穼穽穾窂窅窇窉窊窋窌窎窏窐窓窔窙窚窛窞窡窢贰发罚筏伐乏阀法珐藩帆番翻樊矾钒繁凡烦反返范贩犯饭泛坊芳方肪房防妨仿访纺放菲非啡飞肥匪诽吠肺废沸费芬酚吩氛分纷坟焚汾粉奋份忿愤粪丰封枫蜂峰锋风疯烽逢冯缝讽奉凤佛否夫敷肤孵扶拂辐幅氟符伏俘服"],["b840","窣窤窧窩窪窫窮",4,"窴",10,"竀",10,"竌",9,"竗竘竚竛竜竝竡竢竤竧",5,"竮竰竱竲竳"],["b880","竴",4,"竻竼竾笀笁笂笅笇笉笌笍笎笐笒笓笖笗笘笚笜笝笟笡笢笣笧笩笭浮涪福袱弗甫抚辅俯釜斧脯腑府腐赴副覆赋复傅付阜父腹负富讣附妇缚咐噶嘎该改概钙盖溉干甘杆柑竿肝赶感秆敢赣冈刚钢缸肛纲岗港杠篙皋高膏羔糕搞镐稿告哥歌搁戈鸽胳疙割革葛格蛤阁隔铬个各给根跟耕更庚羹"],["b940","笯笰笲笴笵笶笷笹笻笽笿",5,"筆筈筊筍筎筓筕筗筙筜筞筟筡筣",10,"筯筰筳筴筶筸筺筼筽筿箁箂箃箄箆",6,"箎箏"],["b980","箑箒箓箖箘箙箚箛箞箟箠箣箤箥箮箯箰箲箳箵箶箷箹",7,"篂篃範埂耿梗工攻功恭龚供躬公宫弓巩汞拱贡共钩勾沟苟狗垢构购够辜菇咕箍估沽孤姑鼓古蛊骨谷股故顾固雇刮瓜剐寡挂褂乖拐怪棺关官冠观管馆罐惯灌贯光广逛瑰规圭硅归龟闺轨鬼诡癸桂柜跪贵刽辊滚棍锅郭国果裹过哈"],["ba40","篅篈築篊篋篍篎篏篐篒篔",4,"篛篜篞篟篠篢篣篤篧篨篩篫篬篭篯篰篲",4,"篸篹篺篻篽篿",7,"簈簉簊簍簎簐",5,"簗簘簙"],["ba80","簚",4,"簠",5,"簨簩簫",12,"簹",5,"籂骸孩海氦亥害骇酣憨邯韩含涵寒函喊罕翰撼捍旱憾悍焊汗汉夯杭航壕嚎豪毫郝好耗号浩呵喝荷菏核禾和何合盒貉阂河涸赫褐鹤贺嘿黑痕很狠恨哼亨横衡恒轰哄烘虹鸿洪宏弘红喉侯猴吼厚候后呼乎忽瑚壶葫胡蝴狐糊湖"],["bb40","籃",9,"籎",36,"籵",5,"籾",9],["bb80","粈粊",6,"粓粔粖粙粚粛粠粡粣粦粧粨粩粫粬粭粯粰粴",4,"粺粻弧虎唬护互沪户花哗华猾滑画划化话槐徊怀淮坏欢环桓还缓换患唤痪豢焕涣宦幻荒慌黄磺蝗簧皇凰惶煌晃幌恍谎灰挥辉徽恢蛔回毁悔慧卉惠晦贿秽会烩汇讳诲绘荤昏婚魂浑混豁活伙火获或惑霍货祸击圾基机畸稽积箕"],["bc40","粿糀糂糃糄糆糉糋糎",6,"糘糚糛糝糞糡",6,"糩",5,"糰",7,"糹糺糼",13,"紋",5],["bc80","紑",14,"紡紣紤紥紦紨紩紪紬紭紮細",6,"肌饥迹激讥鸡姬绩缉吉极棘辑籍集及急疾汲即嫉级挤几脊己蓟技冀季伎祭剂悸济寄寂计记既忌际妓继纪嘉枷夹佳家加荚颊贾甲钾假稼价架驾嫁歼监坚尖笺间煎兼肩艰奸缄茧检柬碱硷拣捡简俭剪减荐槛鉴践贱见键箭件"],["bd40","紷",54,"絯",7],["bd80","絸",32,"健舰剑饯渐溅涧建僵姜将浆江疆蒋桨奖讲匠酱降蕉椒礁焦胶交郊浇骄娇嚼搅铰矫侥脚狡角饺缴绞剿教酵轿较叫窖揭接皆秸街阶截劫节桔杰捷睫竭洁结解姐戒藉芥界借介疥诫届巾筋斤金今津襟紧锦仅谨进靳晋禁近烬浸"],["be40","継",12,"綧",6,"綯",42],["be80","線",32,"尽劲荆兢茎睛晶鲸京惊精粳经井警景颈静境敬镜径痉靖竟竞净炯窘揪究纠玖韭久灸九酒厩救旧臼舅咎就疚鞠拘狙疽居驹菊局咀矩举沮聚拒据巨具距踞锯俱句惧炬剧捐鹃娟倦眷卷绢撅攫抉掘倔爵觉决诀绝均菌钧军君峻"],["bf40","緻",62],["bf80","縺縼",4,"繂",4,"繈",21,"俊竣浚郡骏喀咖卡咯开揩楷凯慨刊堪勘坎砍看康慷糠扛抗亢炕考拷烤靠坷苛柯棵磕颗科壳咳可渴克刻客课肯啃垦恳坑吭空恐孔控抠口扣寇枯哭窟苦酷库裤夸垮挎跨胯块筷侩快宽款匡筐狂框矿眶旷况亏盔岿窥葵奎魁傀"],["c040","繞",35,"纃",23,"纜纝纞"],["c080","纮纴纻纼绖绤绬绹缊缐缞缷缹缻",6,"罃罆",9,"罒罓馈愧溃坤昆捆困括扩廓阔垃拉喇蜡腊辣啦莱来赖蓝婪栏拦篮阑兰澜谰揽览懒缆烂滥琅榔狼廊郎朗浪捞劳牢老佬姥酪烙涝勒乐雷镭蕾磊累儡垒擂肋类泪棱楞冷厘梨犁黎篱狸离漓理李里鲤礼莉荔吏栗丽厉励砾历利傈例俐"],["c140","罖罙罛罜罝罞罠罣",4,"罫罬罭罯罰罳罵罶罷罸罺罻罼罽罿羀羂",7,"羋羍羏",4,"羕",4,"羛羜羠羢羣羥羦羨",6,"羱"],["c180","羳",4,"羺羻羾翀翂翃翄翆翇翈翉翋翍翏",4,"翖翗翙",5,"翢翣痢立粒沥隶力璃哩俩联莲连镰廉怜涟帘敛脸链恋炼练粮凉梁粱良两辆量晾亮谅撩聊僚疗燎寥辽潦了撂镣廖料列裂烈劣猎琳林磷霖临邻鳞淋凛赁吝拎玲菱零龄铃伶羚凌灵陵岭领另令溜琉榴硫馏留刘瘤流柳六龙聋咙笼窿"],["c240","翤翧翨翪翫翬翭翯翲翴",6,"翽翾翿耂耇耈耉耊耎耏耑耓耚耛耝耞耟耡耣耤耫",5,"耲耴耹耺耼耾聀聁聄聅聇聈聉聎聏聐聑聓聕聖聗"],["c280","聙聛",13,"聫",5,"聲",11,"隆垄拢陇楼娄搂篓漏陋芦卢颅庐炉掳卤虏鲁麓碌露路赂鹿潞禄录陆戮驴吕铝侣旅履屡缕虑氯律率滤绿峦挛孪滦卵乱掠略抡轮伦仑沦纶论萝螺罗逻锣箩骡裸落洛骆络妈麻玛码蚂马骂嘛吗埋买麦卖迈脉瞒馒蛮满蔓曼慢漫"],["c340","聾肁肂肅肈肊肍",5,"肔肕肗肙肞肣肦肧肨肬肰肳肵肶肸肹肻胅胇",4,"胏",6,"胘胟胠胢胣胦胮胵胷胹胻胾胿脀脁脃脄脅脇脈脋"],["c380","脌脕脗脙脛脜脝脟",12,"脭脮脰脳脴脵脷脹",4,"脿谩芒茫盲氓忙莽猫茅锚毛矛铆卯茂冒帽貌贸么玫枚梅酶霉煤没眉媒镁每美昧寐妹媚门闷们萌蒙檬盟锰猛梦孟眯醚靡糜迷谜弥米秘觅泌蜜密幂棉眠绵冕免勉娩缅面苗描瞄藐秒渺庙妙蔑灭民抿皿敏悯闽明螟鸣铭名命谬摸"],["c440","腀",5,"腇腉腍腎腏腒腖腗腘腛",4,"腡腢腣腤腦腨腪腫腬腯腲腳腵腶腷腸膁膃",4,"膉膋膌膍膎膐膒",5,"膙膚膞",4,"膤膥"],["c480","膧膩膫",7,"膴",5,"膼膽膾膿臄臅臇臈臉臋臍",6,"摹蘑模膜磨摩魔抹末莫墨默沫漠寞陌谋牟某拇牡亩姆母墓暮幕募慕木目睦牧穆拿哪呐钠那娜纳氖乃奶耐奈南男难囊挠脑恼闹淖呢馁内嫩能妮霓倪泥尼拟你匿腻逆溺蔫拈年碾撵捻念娘酿鸟尿捏聂孽啮镊镍涅您柠狞凝宁"],["c540","臔",14,"臤臥臦臨臩臫臮",4,"臵",5,"臽臿舃與",4,"舎舏舑舓舕",5,"舝舠舤舥舦舧舩舮舲舺舼舽舿"],["c580","艀艁艂艃艅艆艈艊艌艍艎艐",7,"艙艛艜艝艞艠",7,"艩拧泞牛扭钮纽脓浓农弄奴努怒女暖虐疟挪懦糯诺哦欧鸥殴藕呕偶沤啪趴爬帕怕琶拍排牌徘湃派攀潘盘磐盼畔判叛乓庞旁耪胖抛咆刨炮袍跑泡呸胚培裴赔陪配佩沛喷盆砰抨烹澎彭蓬棚硼篷膨朋鹏捧碰坯砒霹批披劈琵毗"],["c640","艪艫艬艭艱艵艶艷艸艻艼芀芁芃芅芆芇芉芌芐芓芔芕芖芚芛芞芠芢芣芧芲芵芶芺芻芼芿苀苂苃苅苆苉苐苖苙苚苝苢苧苨苩苪苬苭苮苰苲苳苵苶苸"],["c680","苺苼",4,"茊茋茍茐茒茓茖茘茙茝",9,"茩茪茮茰茲茷茻茽啤脾疲皮匹痞僻屁譬篇偏片骗飘漂瓢票撇瞥拼频贫品聘乒坪苹萍平凭瓶评屏坡泼颇婆破魄迫粕剖扑铺仆莆葡菩蒲埔朴圃普浦谱曝瀑期欺栖戚妻七凄漆柒沏其棋奇歧畦崎脐齐旗祈祁骑起岂乞企启契砌器气迄弃汽泣讫掐"],["c740","茾茿荁荂荄荅荈荊",4,"荓荕",4,"荝荢荰",6,"荹荺荾",6,"莇莈莊莋莌莍莏莐莑莔莕莖莗莙莚莝莟莡",6,"莬莭莮"],["c780","莯莵莻莾莿菂菃菄菆菈菉菋菍菎菐菑菒菓菕菗菙菚菛菞菢菣菤菦菧菨菫菬菭恰洽牵扦钎铅千迁签仟谦乾黔钱钳前潜遣浅谴堑嵌欠歉枪呛腔羌墙蔷强抢橇锹敲悄桥瞧乔侨巧鞘撬翘峭俏窍切茄且怯窃钦侵亲秦琴勤芹擒禽寝沁青轻氢倾卿清擎晴氰情顷请庆琼穷秋丘邱球求囚酋泅趋区蛆曲躯屈驱渠"],["c840","菮華菳",4,"菺菻菼菾菿萀萂萅萇萈萉萊萐萒",5,"萙萚萛萞",5,"萩",7,"萲",5,"萹萺萻萾",7,"葇葈葉"],["c880","葊",6,"葒",4,"葘葝葞葟葠葢葤",4,"葪葮葯葰葲葴葷葹葻葼取娶龋趣去圈颧权醛泉全痊拳犬券劝缺炔瘸却鹊榷确雀裙群然燃冉染瓤壤攘嚷让饶扰绕惹热壬仁人忍韧任认刃妊纫扔仍日戎茸蓉荣融熔溶容绒冗揉柔肉茹蠕儒孺如辱乳汝入褥软阮蕊瑞锐闰润若弱撒洒萨腮鳃塞赛三叁"],["c940","葽",4,"蒃蒄蒅蒆蒊蒍蒏",7,"蒘蒚蒛蒝蒞蒟蒠蒢",12,"蒰蒱蒳蒵蒶蒷蒻蒼蒾蓀蓂蓃蓅蓆蓇蓈蓋蓌蓎蓏蓒蓔蓕蓗"],["c980","蓘",4,"蓞蓡蓢蓤蓧",4,"蓭蓮蓯蓱",10,"蓽蓾蔀蔁蔂伞散桑嗓丧搔骚扫嫂瑟色涩森僧莎砂杀刹沙纱傻啥煞筛晒珊苫杉山删煽衫闪陕擅赡膳善汕扇缮墒伤商赏晌上尚裳梢捎稍烧芍勺韶少哨邵绍奢赊蛇舌舍赦摄射慑涉社设砷申呻伸身深娠绅神沈审婶甚肾慎渗声生甥牲升绳"],["ca40","蔃",8,"蔍蔎蔏蔐蔒蔔蔕蔖蔘蔙蔛蔜蔝蔞蔠蔢",8,"蔭",9,"蔾",4,"蕄蕅蕆蕇蕋",10],["ca80","蕗蕘蕚蕛蕜蕝蕟",4,"蕥蕦蕧蕩",8,"蕳蕵蕶蕷蕸蕼蕽蕿薀薁省盛剩胜圣师失狮施湿诗尸虱十石拾时什食蚀实识史矢使屎驶始式示士世柿事拭誓逝势是嗜噬适仕侍释饰氏市恃室视试收手首守寿授售受瘦兽蔬枢梳殊抒输叔舒淑疏书赎孰熟薯暑曙署蜀黍鼠属术述树束戍竖墅庶数漱"],["cb40","薂薃薆薈",6,"薐",10,"薝",6,"薥薦薧薩薫薬薭薱",5,"薸薺",6,"藂",6,"藊",4,"藑藒"],["cb80","藔藖",5,"藝",6,"藥藦藧藨藪",14,"恕刷耍摔衰甩帅栓拴霜双爽谁水睡税吮瞬顺舜说硕朔烁斯撕嘶思私司丝死肆寺嗣四伺似饲巳松耸怂颂送宋讼诵搜艘擞嗽苏酥俗素速粟僳塑溯宿诉肃酸蒜算虽隋随绥髓碎岁穗遂隧祟孙损笋蓑梭唆缩琐索锁所塌他它她塔"],["cc40","藹藺藼藽藾蘀",4,"蘆",10,"蘒蘓蘔蘕蘗",15,"蘨蘪",13,"蘹蘺蘻蘽蘾蘿虀"],["cc80","虁",11,"虒虓處",4,"虛虜虝號虠虡虣",7,"獭挞蹋踏胎苔抬台泰酞太态汰坍摊贪瘫滩坛檀痰潭谭谈坦毯袒碳探叹炭汤塘搪堂棠膛唐糖倘躺淌趟烫掏涛滔绦萄桃逃淘陶讨套特藤腾疼誊梯剔踢锑提题蹄啼体替嚏惕涕剃屉天添填田甜恬舔腆挑条迢眺跳贴铁帖厅听烃"],["cd40","虭虯虰虲",6,"蚃",6,"蚎",4,"蚔蚖",5,"蚞",4,"蚥蚦蚫蚭蚮蚲蚳蚷蚸蚹蚻",4,"蛁蛂蛃蛅蛈蛌蛍蛒蛓蛕蛖蛗蛚蛜"],["cd80","蛝蛠蛡蛢蛣蛥蛦蛧蛨蛪蛫蛬蛯蛵蛶蛷蛺蛻蛼蛽蛿蜁蜄蜅蜆蜋蜌蜎蜏蜐蜑蜔蜖汀廷停亭庭挺艇通桐酮瞳同铜彤童桶捅筒统痛偷投头透凸秃突图徒途涂屠土吐兔湍团推颓腿蜕褪退吞屯臀拖托脱鸵陀驮驼椭妥拓唾挖哇蛙洼娃瓦袜歪外豌弯湾玩顽丸烷完碗挽晚皖惋宛婉万腕汪王亡枉网往旺望忘妄威"],["ce40","蜙蜛蜝蜟蜠蜤蜦蜧蜨蜪蜫蜬蜭蜯蜰蜲蜳蜵蜶蜸蜹蜺蜼蜽蝀",6,"蝊蝋蝍蝏蝐蝑蝒蝔蝕蝖蝘蝚",5,"蝡蝢蝦",7,"蝯蝱蝲蝳蝵"],["ce80","蝷蝸蝹蝺蝿螀螁螄螆螇螉螊螌螎",4,"螔螕螖螘",6,"螠",4,"巍微危韦违桅围唯惟为潍维苇萎委伟伪尾纬未蔚味畏胃喂魏位渭谓尉慰卫瘟温蚊文闻纹吻稳紊问嗡翁瓮挝蜗涡窝我斡卧握沃巫呜钨乌污诬屋无芜梧吾吴毋武五捂午舞伍侮坞戊雾晤物勿务悟误昔熙析西硒矽晰嘻吸锡牺"],["cf40","螥螦螧螩螪螮螰螱螲螴螶螷螸螹螻螼螾螿蟁",4,"蟇蟈蟉蟌",4,"蟔",6,"蟜蟝蟞蟟蟡蟢蟣蟤蟦蟧蟨蟩蟫蟬蟭蟯",9],["cf80","蟺蟻蟼蟽蟿蠀蠁蠂蠄",5,"蠋",7,"蠔蠗蠘蠙蠚蠜",4,"蠣稀息希悉膝夕惜熄烯溪汐犀檄袭席习媳喜铣洗系隙戏细瞎虾匣霞辖暇峡侠狭下厦夏吓掀锨先仙鲜纤咸贤衔舷闲涎弦嫌显险现献县腺馅羡宪陷限线相厢镶香箱襄湘乡翔祥详想响享项巷橡像向象萧硝霄削哮嚣销消宵淆晓"],["d040","蠤",13,"蠳",5,"蠺蠻蠽蠾蠿衁衂衃衆",5,"衎",5,"衕衖衘衚",6,"衦衧衪衭衯衱衳衴衵衶衸衹衺"],["d080","衻衼袀袃袆袇袉袊袌袎袏袐袑袓袔袕袗",4,"袝",4,"袣袥",5,"小孝校肖啸笑效楔些歇蝎鞋协挟携邪斜胁谐写械卸蟹懈泄泻谢屑薪芯锌欣辛新忻心信衅星腥猩惺兴刑型形邢行醒幸杏性姓兄凶胸匈汹雄熊休修羞朽嗅锈秀袖绣墟戌需虚嘘须徐许蓄酗叙旭序畜恤絮婿绪续轩喧宣悬旋玄"],["d140","袬袮袯袰袲",4,"袸袹袺袻袽袾袿裀裃裄裇裈裊裋裌裍裏裐裑裓裖裗裚",4,"裠裡裦裧裩",6,"裲裵裶裷裺裻製裿褀褁褃",5],["d180","褉褋",4,"褑褔",4,"褜",4,"褢褣褤褦褧褨褩褬褭褮褯褱褲褳褵褷选癣眩绚靴薛学穴雪血勋熏循旬询寻驯巡殉汛训讯逊迅压押鸦鸭呀丫芽牙蚜崖衙涯雅哑亚讶焉咽阉烟淹盐严研蜒岩延言颜阎炎沿奄掩眼衍演艳堰燕厌砚雁唁彦焰宴谚验殃央鸯秧杨扬佯疡羊洋阳氧仰痒养样漾邀腰妖瑶"],["d240","褸",8,"襂襃襅",24,"襠",5,"襧",19,"襼"],["d280","襽襾覀覂覄覅覇",26,"摇尧遥窑谣姚咬舀药要耀椰噎耶爷野冶也页掖业叶曳腋夜液一壹医揖铱依伊衣颐夷遗移仪胰疑沂宜姨彝椅蚁倚已乙矣以艺抑易邑屹亿役臆逸肄疫亦裔意毅忆义益溢诣议谊译异翼翌绎茵荫因殷音阴姻吟银淫寅饮尹引隐"],["d340","覢",30,"觃觍觓觔觕觗觘觙觛觝觟觠觡觢觤觧觨觩觪觬觭觮觰觱觲觴",6],["d380","觻",4,"訁",5,"計",21,"印英樱婴鹰应缨莹萤营荧蝇迎赢盈影颖硬映哟拥佣臃痈庸雍踊蛹咏泳涌永恿勇用幽优悠忧尤由邮铀犹油游酉有友右佑釉诱又幼迂淤于盂榆虞愚舆余俞逾鱼愉渝渔隅予娱雨与屿禹宇语羽玉域芋郁吁遇喻峪御愈欲狱育誉"],["d440","訞",31,"訿",8,"詉",21],["d480","詟",25,"詺",6,"浴寓裕预豫驭鸳渊冤元垣袁原援辕园员圆猿源缘远苑愿怨院曰约越跃钥岳粤月悦阅耘云郧匀陨允运蕴酝晕韵孕匝砸杂栽哉灾宰载再在咱攒暂赞赃脏葬遭糟凿藻枣早澡蚤躁噪造皂灶燥责择则泽贼怎增憎曾赠扎喳渣札轧"],["d540","誁",7,"誋",7,"誔",46],["d580","諃",32,"铡闸眨栅榨咋乍炸诈摘斋宅窄债寨瞻毡詹粘沾盏斩辗崭展蘸栈占战站湛绽樟章彰漳张掌涨杖丈帐账仗胀瘴障招昭找沼赵照罩兆肇召遮折哲蛰辙者锗蔗这浙珍斟真甄砧臻贞针侦枕疹诊震振镇阵蒸挣睁征狰争怔整拯正政"],["d640","諤",34,"謈",27],["d680","謤謥謧",30,"帧症郑证芝枝支吱蜘知肢脂汁之织职直植殖执值侄址指止趾只旨纸志挚掷至致置帜峙制智秩稚质炙痔滞治窒中盅忠钟衷终种肿重仲众舟周州洲诌粥轴肘帚咒皱宙昼骤珠株蛛朱猪诸诛逐竹烛煮拄瞩嘱主著柱助蛀贮铸筑"],["d740","譆",31,"譧",4,"譭",25],["d780","讇",24,"讬讱讻诇诐诪谉谞住注祝驻抓爪拽专砖转撰赚篆桩庄装妆撞壮状椎锥追赘坠缀谆准捉拙卓桌琢茁酌啄着灼浊兹咨资姿滋淄孜紫仔籽滓子自渍字鬃棕踪宗综总纵邹走奏揍租足卒族祖诅阻组钻纂嘴醉最罪尊遵昨左佐柞做作坐座"],["d840","谸",8,"豂豃豄豅豈豊豋豍",7,"豖豗豘豙豛",5,"豣",6,"豬",6,"豴豵豶豷豻",6,"貃貄貆貇"],["d880","貈貋貍",6,"貕貖貗貙",20,"亍丌兀丐廿卅丕亘丞鬲孬噩丨禺丿匕乇夭爻卮氐囟胤馗毓睾鼗丶亟鼐乜乩亓芈孛啬嘏仄厍厝厣厥厮靥赝匚叵匦匮匾赜卦卣刂刈刎刭刳刿剀剌剞剡剜蒯剽劂劁劐劓冂罔亻仃仉仂仨仡仫仞伛仳伢佤仵伥伧伉伫佞佧攸佚佝"],["d940","貮",62],["d980","賭",32,"佟佗伲伽佶佴侑侉侃侏佾佻侪佼侬侔俦俨俪俅俚俣俜俑俟俸倩偌俳倬倏倮倭俾倜倌倥倨偾偃偕偈偎偬偻傥傧傩傺僖儆僭僬僦僮儇儋仝氽佘佥俎龠汆籴兮巽黉馘冁夔勹匍訇匐凫夙兕亠兖亳衮袤亵脔裒禀嬴蠃羸冫冱冽冼"],["da40","贎",14,"贠赑赒赗赟赥赨赩赪赬赮赯赱赲赸",8,"趂趃趆趇趈趉趌",4,"趒趓趕",9,"趠趡"],["da80","趢趤",12,"趲趶趷趹趻趽跀跁跂跅跇跈跉跊跍跐跒跓跔凇冖冢冥讠讦讧讪讴讵讷诂诃诋诏诎诒诓诔诖诘诙诜诟诠诤诨诩诮诰诳诶诹诼诿谀谂谄谇谌谏谑谒谔谕谖谙谛谘谝谟谠谡谥谧谪谫谮谯谲谳谵谶卩卺阝阢阡阱阪阽阼陂陉陔陟陧陬陲陴隈隍隗隰邗邛邝邙邬邡邴邳邶邺"],["db40","跕跘跙跜跠跡跢跥跦跧跩跭跮跰跱跲跴跶跼跾",6,"踆踇踈踋踍踎踐踑踒踓踕",7,"踠踡踤",4,"踫踭踰踲踳踴踶踷踸踻踼踾"],["db80","踿蹃蹅蹆蹌",4,"蹓",5,"蹚",11,"蹧蹨蹪蹫蹮蹱邸邰郏郅邾郐郄郇郓郦郢郜郗郛郫郯郾鄄鄢鄞鄣鄱鄯鄹酃酆刍奂劢劬劭劾哿勐勖勰叟燮矍廴凵凼鬯厶弁畚巯坌垩垡塾墼壅壑圩圬圪圳圹圮圯坜圻坂坩垅坫垆坼坻坨坭坶坳垭垤垌垲埏垧垴垓垠埕埘埚埙埒垸埴埯埸埤埝"],["dc40","蹳蹵蹷",4,"蹽蹾躀躂躃躄躆躈",6,"躑躒躓躕",6,"躝躟",11,"躭躮躰躱躳",6,"躻",7],["dc80","軃",10,"軏",21,"堋堍埽埭堀堞堙塄堠塥塬墁墉墚墀馨鼙懿艹艽艿芏芊芨芄芎芑芗芙芫芸芾芰苈苊苣芘芷芮苋苌苁芩芴芡芪芟苄苎芤苡茉苷苤茏茇苜苴苒苘茌苻苓茑茚茆茔茕苠苕茜荑荛荜茈莒茼茴茱莛荞茯荏荇荃荟荀茗荠茭茺茳荦荥"],["dd40","軥",62],["dd80","輤",32,"荨茛荩荬荪荭荮莰荸莳莴莠莪莓莜莅荼莶莩荽莸荻莘莞莨莺莼菁萁菥菘堇萘萋菝菽菖萜萸萑萆菔菟萏萃菸菹菪菅菀萦菰菡葜葑葚葙葳蒇蒈葺蒉葸萼葆葩葶蒌蒎萱葭蓁蓍蓐蓦蒽蓓蓊蒿蒺蓠蒡蒹蒴蒗蓥蓣蔌甍蔸蓰蔹蔟蔺"],["de40","轅",32,"轪辀辌辒辝辠辡辢辤辥辦辧辪辬辭辮辯農辳辴辵辷辸辺辻込辿迀迃迆"],["de80","迉",4,"迏迒迖迗迚迠迡迣迧迬迯迱迲迴迵迶迺迻迼迾迿逇逈逌逎逓逕逘蕖蔻蓿蓼蕙蕈蕨蕤蕞蕺瞢蕃蕲蕻薤薨薇薏蕹薮薜薅薹薷薰藓藁藜藿蘧蘅蘩蘖蘼廾弈夼奁耷奕奚奘匏尢尥尬尴扌扪抟抻拊拚拗拮挢拶挹捋捃掭揶捱捺掎掴捭掬掊捩掮掼揲揸揠揿揄揞揎摒揆掾摅摁搋搛搠搌搦搡摞撄摭撖"],["df40","這逜連逤逥逧",5,"逰",4,"逷逹逺逽逿遀遃遅遆遈",4,"過達違遖遙遚遜",5,"遤遦遧適遪遫遬遯",4,"遶",6,"遾邁"],["df80","還邅邆邇邉邊邌",4,"邒邔邖邘邚邜邞邟邠邤邥邧邨邩邫邭邲邷邼邽邿郀摺撷撸撙撺擀擐擗擤擢攉攥攮弋忒甙弑卟叱叽叩叨叻吒吖吆呋呒呓呔呖呃吡呗呙吣吲咂咔呷呱呤咚咛咄呶呦咝哐咭哂咴哒咧咦哓哔呲咣哕咻咿哌哙哚哜咩咪咤哝哏哞唛哧唠哽唔哳唢唣唏唑唧唪啧喏喵啉啭啁啕唿啐唼"],["e040","郂郃郆郈郉郋郌郍郒郔郕郖郘郙郚郞郟郠郣郤郥郩郪郬郮郰郱郲郳郵郶郷郹郺郻郼郿鄀鄁鄃鄅",19,"鄚鄛鄜"],["e080","鄝鄟鄠鄡鄤",10,"鄰鄲",6,"鄺",8,"酄唷啖啵啶啷唳唰啜喋嗒喃喱喹喈喁喟啾嗖喑啻嗟喽喾喔喙嗪嗷嗉嘟嗑嗫嗬嗔嗦嗝嗄嗯嗥嗲嗳嗌嗍嗨嗵嗤辔嘞嘈嘌嘁嘤嘣嗾嘀嘧嘭噘嘹噗嘬噍噢噙噜噌噔嚆噤噱噫噻噼嚅嚓嚯囔囗囝囡囵囫囹囿圄圊圉圜帏帙帔帑帱帻帼"],["e140","酅酇酈酑酓酔酕酖酘酙酛酜酟酠酦酧酨酫酭酳酺酻酼醀",4,"醆醈醊醎醏醓",6,"醜",5,"醤",5,"醫醬醰醱醲醳醶醷醸醹醻"],["e180","醼",10,"釈釋釐釒",9,"針",8,"帷幄幔幛幞幡岌屺岍岐岖岈岘岙岑岚岜岵岢岽岬岫岱岣峁岷峄峒峤峋峥崂崃崧崦崮崤崞崆崛嵘崾崴崽嵬嵛嵯嵝嵫嵋嵊嵩嵴嶂嶙嶝豳嶷巅彳彷徂徇徉後徕徙徜徨徭徵徼衢彡犭犰犴犷犸狃狁狎狍狒狨狯狩狲狴狷猁狳猃狺"],["e240","釦",62],["e280","鈥",32,"狻猗猓猡猊猞猝猕猢猹猥猬猸猱獐獍獗獠獬獯獾舛夥飧夤夂饣饧",5,"饴饷饽馀馄馇馊馍馐馑馓馔馕庀庑庋庖庥庠庹庵庾庳赓廒廑廛廨廪膺忄忉忖忏怃忮怄忡忤忾怅怆忪忭忸怙怵怦怛怏怍怩怫怊怿怡恸恹恻恺恂"],["e340","鉆",45,"鉵",16],["e380","銆",7,"銏",24,"恪恽悖悚悭悝悃悒悌悛惬悻悱惝惘惆惚悴愠愦愕愣惴愀愎愫慊慵憬憔憧憷懔懵忝隳闩闫闱闳闵闶闼闾阃阄阆阈阊阋阌阍阏阒阕阖阗阙阚丬爿戕氵汔汜汊沣沅沐沔沌汨汩汴汶沆沩泐泔沭泷泸泱泗沲泠泖泺泫泮沱泓泯泾"],["e440","銨",5,"銯",24,"鋉",31],["e480","鋩",32,"洹洧洌浃浈洇洄洙洎洫浍洮洵洚浏浒浔洳涑浯涞涠浞涓涔浜浠浼浣渚淇淅淞渎涿淠渑淦淝淙渖涫渌涮渫湮湎湫溲湟溆湓湔渲渥湄滟溱溘滠漭滢溥溧溽溻溷滗溴滏溏滂溟潢潆潇漤漕滹漯漶潋潴漪漉漩澉澍澌潸潲潼潺濑"],["e540","錊",51,"錿",10],["e580","鍊",31,"鍫濉澧澹澶濂濡濮濞濠濯瀚瀣瀛瀹瀵灏灞宀宄宕宓宥宸甯骞搴寤寮褰寰蹇謇辶迓迕迥迮迤迩迦迳迨逅逄逋逦逑逍逖逡逵逶逭逯遄遑遒遐遨遘遢遛暹遴遽邂邈邃邋彐彗彖彘尻咫屐屙孱屣屦羼弪弩弭艴弼鬻屮妁妃妍妩妪妣"],["e640","鍬",34,"鎐",27],["e680","鎬",29,"鏋鏌鏍妗姊妫妞妤姒妲妯姗妾娅娆姝娈姣姘姹娌娉娲娴娑娣娓婀婧婊婕娼婢婵胬媪媛婷婺媾嫫媲嫒嫔媸嫠嫣嫱嫖嫦嫘嫜嬉嬗嬖嬲嬷孀尕尜孚孥孳孑孓孢驵驷驸驺驿驽骀骁骅骈骊骐骒骓骖骘骛骜骝骟骠骢骣骥骧纟纡纣纥纨纩"],["e740","鏎",7,"鏗",54],["e780","鐎",32,"纭纰纾绀绁绂绉绋绌绐绔绗绛绠绡绨绫绮绯绱绲缍绶绺绻绾缁缂缃缇缈缋缌缏缑缒缗缙缜缛缟缡",6,"缪缫缬缭缯",4,"缵幺畿巛甾邕玎玑玮玢玟珏珂珑玷玳珀珉珈珥珙顼琊珩珧珞玺珲琏琪瑛琦琥琨琰琮琬"],["e840","鐯",14,"鐿",43,"鑬鑭鑮鑯"],["e880","鑰",20,"钑钖钘铇铏铓铔铚铦铻锜锠琛琚瑁瑜瑗瑕瑙瑷瑭瑾璜璎璀璁璇璋璞璨璩璐璧瓒璺韪韫韬杌杓杞杈杩枥枇杪杳枘枧杵枨枞枭枋杷杼柰栉柘栊柩枰栌柙枵柚枳柝栀柃枸柢栎柁柽栲栳桠桡桎桢桄桤梃栝桕桦桁桧桀栾桊桉栩梵梏桴桷梓桫棂楮棼椟椠棹"],["e940","锧锳锽镃镈镋镕镚镠镮镴镵長",7,"門",42],["e980","閫",32,"椤棰椋椁楗棣椐楱椹楠楂楝榄楫榀榘楸椴槌榇榈槎榉楦楣楹榛榧榻榫榭槔榱槁槊槟榕槠榍槿樯槭樗樘橥槲橄樾檠橐橛樵檎橹樽樨橘橼檑檐檩檗檫猷獒殁殂殇殄殒殓殍殚殛殡殪轫轭轱轲轳轵轶轸轷轹轺轼轾辁辂辄辇辋"],["ea40","闌",27,"闬闿阇阓阘阛阞阠阣",6,"阫阬阭阯阰阷阸阹阺阾陁陃陊陎陏陑陒陓陖陗"],["ea80","陘陙陚陜陝陞陠陣陥陦陫陭",4,"陳陸",12,"隇隉隊辍辎辏辘辚軎戋戗戛戟戢戡戥戤戬臧瓯瓴瓿甏甑甓攴旮旯旰昊昙杲昃昕昀炅曷昝昴昱昶昵耆晟晔晁晏晖晡晗晷暄暌暧暝暾曛曜曦曩贲贳贶贻贽赀赅赆赈赉赇赍赕赙觇觊觋觌觎觏觐觑牮犟牝牦牯牾牿犄犋犍犏犒挈挲掰"],["eb40","隌階隑隒隓隕隖隚際隝",9,"隨",7,"隱隲隴隵隷隸隺隻隿雂雃雈雊雋雐雑雓雔雖",9,"雡",6,"雫"],["eb80","雬雭雮雰雱雲雴雵雸雺電雼雽雿霂霃霅霊霋霌霐霑霒霔霕霗",4,"霝霟霠搿擘耄毪毳毽毵毹氅氇氆氍氕氘氙氚氡氩氤氪氲攵敕敫牍牒牖爰虢刖肟肜肓肼朊肽肱肫肭肴肷胧胨胩胪胛胂胄胙胍胗朐胝胫胱胴胭脍脎胲胼朕脒豚脶脞脬脘脲腈腌腓腴腙腚腱腠腩腼腽腭腧塍媵膈膂膑滕膣膪臌朦臊膻"],["ec40","霡",8,"霫霬霮霯霱霳",4,"霺霻霼霽霿",18,"靔靕靗靘靚靜靝靟靣靤靦靧靨靪",7],["ec80","靲靵靷",4,"靽",7,"鞆",4,"鞌鞎鞏鞐鞓鞕鞖鞗鞙",4,"臁膦欤欷欹歃歆歙飑飒飓飕飙飚殳彀毂觳斐齑斓於旆旄旃旌旎旒旖炀炜炖炝炻烀炷炫炱烨烊焐焓焖焯焱煳煜煨煅煲煊煸煺熘熳熵熨熠燠燔燧燹爝爨灬焘煦熹戾戽扃扈扉礻祀祆祉祛祜祓祚祢祗祠祯祧祺禅禊禚禧禳忑忐"],["ed40","鞞鞟鞡鞢鞤",6,"鞬鞮鞰鞱鞳鞵",46],["ed80","韤韥韨韮",4,"韴韷",23,"怼恝恚恧恁恙恣悫愆愍慝憩憝懋懑戆肀聿沓泶淼矶矸砀砉砗砘砑斫砭砜砝砹砺砻砟砼砥砬砣砩硎硭硖硗砦硐硇硌硪碛碓碚碇碜碡碣碲碹碥磔磙磉磬磲礅磴礓礤礞礴龛黹黻黼盱眄眍盹眇眈眚眢眙眭眦眵眸睐睑睇睃睚睨"],["ee40","頏",62],["ee80","顎",32,"睢睥睿瞍睽瞀瞌瞑瞟瞠瞰瞵瞽町畀畎畋畈畛畲畹疃罘罡罟詈罨罴罱罹羁罾盍盥蠲钅钆钇钋钊钌钍钏钐钔钗钕钚钛钜钣钤钫钪钭钬钯钰钲钴钶",4,"钼钽钿铄铈",6,"铐铑铒铕铖铗铙铘铛铞铟铠铢铤铥铧铨铪"],["ef40","顯",5,"颋颎颒颕颙颣風",37,"飏飐飔飖飗飛飜飝飠",4],["ef80","飥飦飩",30,"铩铫铮铯铳铴铵铷铹铼铽铿锃锂锆锇锉锊锍锎锏锒",4,"锘锛锝锞锟锢锪锫锩锬锱锲锴锶锷锸锼锾锿镂锵镄镅镆镉镌镎镏镒镓镔镖镗镘镙镛镞镟镝镡镢镤",8,"镯镱镲镳锺矧矬雉秕秭秣秫稆嵇稃稂稞稔"],["f040","餈",4,"餎餏餑",28,"餯",26],["f080","饊",9,"饖",12,"饤饦饳饸饹饻饾馂馃馉稹稷穑黏馥穰皈皎皓皙皤瓞瓠甬鸠鸢鸨",4,"鸲鸱鸶鸸鸷鸹鸺鸾鹁鹂鹄鹆鹇鹈鹉鹋鹌鹎鹑鹕鹗鹚鹛鹜鹞鹣鹦",6,"鹱鹭鹳疒疔疖疠疝疬疣疳疴疸痄疱疰痃痂痖痍痣痨痦痤痫痧瘃痱痼痿瘐瘀瘅瘌瘗瘊瘥瘘瘕瘙"],["f140","馌馎馚",10,"馦馧馩",47],["f180","駙",32,"瘛瘼瘢瘠癀瘭瘰瘿瘵癃瘾瘳癍癞癔癜癖癫癯翊竦穸穹窀窆窈窕窦窠窬窨窭窳衤衩衲衽衿袂袢裆袷袼裉裢裎裣裥裱褚裼裨裾裰褡褙褓褛褊褴褫褶襁襦襻疋胥皲皴矜耒耔耖耜耠耢耥耦耧耩耨耱耋耵聃聆聍聒聩聱覃顸颀颃"],["f240","駺",62],["f280","騹",32,"颉颌颍颏颔颚颛颞颟颡颢颥颦虍虔虬虮虿虺虼虻蚨蚍蚋蚬蚝蚧蚣蚪蚓蚩蚶蛄蚵蛎蚰蚺蚱蚯蛉蛏蚴蛩蛱蛲蛭蛳蛐蜓蛞蛴蛟蛘蛑蜃蜇蛸蜈蜊蜍蜉蜣蜻蜞蜥蜮蜚蜾蝈蜴蜱蜩蜷蜿螂蜢蝽蝾蝻蝠蝰蝌蝮螋蝓蝣蝼蝤蝙蝥螓螯螨蟒"],["f340","驚",17,"驲骃骉骍骎骔骕骙骦骩",6,"骲骳骴骵骹骻骽骾骿髃髄髆",4,"髍髎髏髐髒體髕髖髗髙髚髛髜"],["f380","髝髞髠髢髣髤髥髧髨髩髪髬髮髰",8,"髺髼",6,"鬄鬅鬆蟆螈螅螭螗螃螫蟥螬螵螳蟋蟓螽蟑蟀蟊蟛蟪蟠蟮蠖蠓蟾蠊蠛蠡蠹蠼缶罂罄罅舐竺竽笈笃笄笕笊笫笏筇笸笪笙笮笱笠笥笤笳笾笞筘筚筅筵筌筝筠筮筻筢筲筱箐箦箧箸箬箝箨箅箪箜箢箫箴篑篁篌篝篚篥篦篪簌篾篼簏簖簋"],["f440","鬇鬉",5,"鬐鬑鬒鬔",10,"鬠鬡鬢鬤",10,"鬰鬱鬳",7,"鬽鬾鬿魀魆魊魋魌魎魐魒魓魕",5],["f480","魛",32,"簟簪簦簸籁籀臾舁舂舄臬衄舡舢舣舭舯舨舫舸舻舳舴舾艄艉艋艏艚艟艨衾袅袈裘裟襞羝羟羧羯羰羲籼敉粑粝粜粞粢粲粼粽糁糇糌糍糈糅糗糨艮暨羿翎翕翥翡翦翩翮翳糸絷綦綮繇纛麸麴赳趄趔趑趱赧赭豇豉酊酐酎酏酤"],["f540","魼",62],["f580","鮻",32,"酢酡酰酩酯酽酾酲酴酹醌醅醐醍醑醢醣醪醭醮醯醵醴醺豕鹾趸跫踅蹙蹩趵趿趼趺跄跖跗跚跞跎跏跛跆跬跷跸跣跹跻跤踉跽踔踝踟踬踮踣踯踺蹀踹踵踽踱蹉蹁蹂蹑蹒蹊蹰蹶蹼蹯蹴躅躏躔躐躜躞豸貂貊貅貘貔斛觖觞觚觜"],["f640","鯜",62],["f680","鰛",32,"觥觫觯訾謦靓雩雳雯霆霁霈霏霎霪霭霰霾龀龃龅",5,"龌黾鼋鼍隹隼隽雎雒瞿雠銎銮鋈錾鍪鏊鎏鐾鑫鱿鲂鲅鲆鲇鲈稣鲋鲎鲐鲑鲒鲔鲕鲚鲛鲞",5,"鲥",4,"鲫鲭鲮鲰",7,"鲺鲻鲼鲽鳄鳅鳆鳇鳊鳋"],["f740","鰼",62],["f780","鱻鱽鱾鲀鲃鲄鲉鲊鲌鲏鲓鲖鲗鲘鲙鲝鲪鲬鲯鲹鲾",4,"鳈鳉鳑鳒鳚鳛鳠鳡鳌",4,"鳓鳔鳕鳗鳘鳙鳜鳝鳟鳢靼鞅鞑鞒鞔鞯鞫鞣鞲鞴骱骰骷鹘骶骺骼髁髀髅髂髋髌髑魅魃魇魉魈魍魑飨餍餮饕饔髟髡髦髯髫髻髭髹鬈鬏鬓鬟鬣麽麾縻麂麇麈麋麒鏖麝麟黛黜黝黠黟黢黩黧黥黪黯鼢鼬鼯鼹鼷鼽鼾齄"],["f840","鳣",62],["f880","鴢",32],["f940","鵃",62],["f980","鶂",32],["fa40","鶣",62],["fa80","鷢",32],["fb40","鸃",27,"鸤鸧鸮鸰鸴鸻鸼鹀鹍鹐鹒鹓鹔鹖鹙鹝鹟鹠鹡鹢鹥鹮鹯鹲鹴",9,"麀"],["fb80","麁麃麄麅麆麉麊麌",5,"麔",8,"麞麠",5,"麧麨麩麪"],["fc40","麫",8,"麵麶麷麹麺麼麿",4,"黅黆黇黈黊黋黌黐黒黓黕黖黗黙黚點黡黣黤黦黨黫黬黭黮黰",8,"黺黽黿",6],["fc80","鼆",4,"鼌鼏鼑鼒鼔鼕鼖鼘鼚",5,"鼡鼣",8,"鼭鼮鼰鼱"],["fd40","鼲",4,"鼸鼺鼼鼿",4,"齅",10,"齒",38],["fd80","齹",5,"龁龂龍",11,"龜龝龞龡",4,"郎凉秊裏隣"],["fe40","兀嗀﨎﨏﨑﨓﨔礼﨟蘒﨡﨣﨤﨧﨨﨩"]]

/***/ }),
/* 9 */
/***/ (function(module, exports) {

module.exports = require("buffer");

/***/ }),
/* 10 */
/***/ (function(module, exports) {

module.exports = require("crypto");

/***/ }),
/* 11 */
/***/ (function(module, exports) {

module.exports = require("tls");

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var libcharset = __webpack_require__(27);
var libbase64 = __webpack_require__(15);
var libqp = __webpack_require__(16);
var mimetypes = __webpack_require__(47);

var libmime = module.exports = {

    /**
     * Checks if a value is plaintext string (uses only printable 7bit chars)
     *
     * @param {String} value String to be tested
     * @returns {Boolean} true if it is a plaintext string
     */
    isPlainText: function (value) {
        if (typeof value !== 'string' || /[\x00-\x08\x0b\x0c\x0e-\x1f\u0080-\uFFFF]/.test(value)) {
            return false;
        } else {
            return true;
        }
    },

    /**
     * Checks if a multi line string containes lines longer than the selected value.
     *
     * Useful when detecting if a mail message needs any processing at all –
     * if only plaintext characters are used and lines are short, then there is
     * no need to encode the values in any way. If the value is plaintext but has
     * longer lines then allowed, then use format=flowed
     *
     * @param {Number} lineLength Max line length to check for
     * @returns {Boolean} Returns true if there is at least one line longer than lineLength chars
     */
    hasLongerLines: function (str, lineLength) {
        return new RegExp('^.{' + (lineLength + 1) + ',}', 'm').test(str);
    },

    /**
     * Decodes a string from a format=flowed soft wrapping.
     *
     * @param {String} str Plaintext string with format=flowed to decode
     * @param {Boolean} [delSp] If true, delete leading spaces (delsp=yes)
     * @return {String} Mime decoded string
     */
    decodeFlowed: function (str, delSp) {
        str = (str || '').toString();

        return str.
        split(/\r?\n/).
            // remove soft linebreaks
            // soft linebreaks are added after space symbols
        reduce(
                function (previousValue, currentValue, index) {
                    var body = previousValue;
                    if (delSp) {
                        // delsp adds spaces to text to be able to fold it
                        // these spaces can be removed once the text is unfolded
                        body = body.replace(/[ ]+$/, '');
                    }
                    if (/ $/.test(previousValue) && !/(^|\n)\-\- $/.test(previousValue) || index === 1) {
                        return body + currentValue;
                    } else {
                        return body + '\n' + currentValue;
                    }
                }
            ).
            // remove whitespace stuffing
            // http://tools.ietf.org/html/rfc3676#section-4.4
        replace(/^ /gm, '');
    },

    /**
     * Adds soft line breaks to content marked with format=flowed to
     * ensure that no line in the message is never longer than lineLength
     *
     * @param {String} str Plaintext string that requires wrapping
     * @param {Number} [lineLength=76] Maximum length of a line
     * @return {String} String with forced line breaks
     */
    encodeFlowed: function (str, lineLength) {
        lineLength = lineLength || 76;

        var flowed = [];
        str.split(/\r?\n/).forEach(function (line) {
            flowed.push(libmime.foldLines(line.
                // space stuffing http://tools.ietf.org/html/rfc3676#section-4.2
                replace(/^( |From|>)/igm, ' $1'),
                lineLength, true));
        });
        return flowed.join('\r\n');
    },

    /**
     * Encodes a string or an Buffer to an UTF-8 MIME Word (rfc2047)
     *
     * @param {String|Buffer} data String to be encoded
     * @param {String} mimeWordEncoding='Q' Encoding for the mime word, either Q or B
     * @param {Number} [maxLength=0] If set, split mime words into several chunks if needed
     * @return {String} Single or several mime words joined together
     */
    encodeWord: function (data, mimeWordEncoding, maxLength) {
        mimeWordEncoding = (mimeWordEncoding || 'Q').toString().toUpperCase().trim().charAt(0);
        maxLength = maxLength || 0;

        var encodedStr,
            toCharset = 'UTF-8',
            i, len, parts, lpart, chr;

        if (maxLength && maxLength > 7 + toCharset.length) {
            maxLength -= (7 + toCharset.length);
        }

        if (mimeWordEncoding === 'Q') {
            // https://tools.ietf.org/html/rfc2047#section-5 rule (3)
            encodedStr = libqp.encode(data).replace(/[^a-z0-9!*+\-\/=]/ig, function (chr) {
                var ord = chr.charCodeAt(0).toString(16).toUpperCase();
                if (chr === ' ') {
                    return '_';
                } else {
                    return '=' + (ord.length === 1 ? '0' + ord : ord);
                }
            });
        } else if (mimeWordEncoding === 'B') {
            encodedStr = typeof data === 'string' ? data : libbase64.encode(data);
            maxLength = maxLength ? Math.max(3, (maxLength - maxLength % 4) / 4 * 3) : 0;
        }

        if (maxLength && (mimeWordEncoding !== 'B' ? encodedStr : libbase64.encode(data)).length > maxLength) {
            if (mimeWordEncoding === 'Q') {
                encodedStr = splitMimeEncodedString(encodedStr, maxLength).join('?= =?' + toCharset + '?' + mimeWordEncoding + '?');
            } else {
                // RFC2047 6.3 (2) states that encoded-word must include an integral number of characters, so no chopping unicode sequences
                parts = [];
                lpart = '';
                for (i = 0, len = encodedStr.length; i < len; i++) {
                    chr = encodedStr.charAt(i);
                    // check if we can add this character to the existing string
                    // without breaking byte length limit
                    if (Buffer.byteLength(lpart + chr) <= maxLength || i === 0) {
                        lpart += chr;
                    } else {
                        // we hit the length limit, so push the existing string and start over
                        parts.push(libbase64.encode(lpart));
                        lpart = chr;
                    }
                }
                if (lpart) {
                    parts.push(libbase64.encode(lpart));
                }

                if (parts.length > 1) {
                    encodedStr = parts.join('?= =?' + toCharset + '?' + mimeWordEncoding + '?');
                } else {
                    encodedStr = parts.join('');
                }
            }
        } else if (mimeWordEncoding === 'B') {
            encodedStr = libbase64.encode(data);
        }

        return '=?' + toCharset + '?' + mimeWordEncoding + '?' + encodedStr + (encodedStr.substr(-2) === '?=' ? '' : '?=');
    },

    /**
     * Decode a complete mime word encoded string
     *
     * @param {String} str Mime word encoded string
     * @return {String} Decoded unicode string
     */
    decodeWord: function (str) {
        str = (str || '').toString().trim();

        var fromCharset, encoding, match;

        match = str.match(/^\=\?([\w_\-\*]+)\?([QqBb])\?([^\?]+)\?\=$/i);
        if (!match) {
            return str;
        }

        // RFC2231 added language tag to the encoding
        // see: https://tools.ietf.org/html/rfc2231#section-5
        // this implementation silently ignores this tag
        fromCharset = match[1].split('*').shift();

        encoding = (match[2] || 'Q').toString().toUpperCase();
        str = (match[3] || '');

        if (encoding === 'Q') {
            // remove spaces between = and hex char, this might indicate invalidly applied line splitting
            str = str.replace(/=\s+([0-9a-fA-F])/, '=$1');
        }

        // convert all underscores to spaces
        str = str.replace(/_/g, ' ').replace(/ $/, '=20');

        if (encoding === 'B') {
            return libcharset.decode(libbase64.decode(str), fromCharset);
        } else if (encoding === 'Q') {
            return libcharset.decode(libqp.decode(str), fromCharset);
        } else {
            return str;
        }
    },

    /**
     * Finds word sequences with non ascii text and converts these to mime words
     *
     * @param {String|Buffer} data String to be encoded
     * @param {String} mimeWordEncoding='Q' Encoding for the mime word, either Q or B
     * @param {Number} [maxLength=0] If set, split mime words into several chunks if needed
     * @param {String} [fromCharset='UTF-8'] Source sharacter set
     * @return {String} String with possible mime words
     */
    encodeWords: function (data, mimeWordEncoding, maxLength, fromCharset) {
        if (!fromCharset && typeof maxLength === 'string' && !maxLength.match(/^[0-9]+$/)) {
            fromCharset = maxLength;
            maxLength = undefined;
        }

        maxLength = maxLength || 0;

        var decodedValue = libcharset.decode(libcharset.convert((data || ''), fromCharset));
        var encodedValue;

        var firstMatch = decodedValue.match(/(?:^|\s)([^\s]*[\u0080-\uFFFF])/);
        if (!firstMatch) {
            return decodedValue;
        }
        var lastMatch = decodedValue.match(/([\u0080-\uFFFF][^\s]*)[^\u0080-\uFFFF]*$/);
        if (!lastMatch) {
            // should not happen
            return decodedValue;
        }
        var startIndex = firstMatch.index + (firstMatch[0].match(/[^\s]/) || {
            index: 0
        }).index;
        var endIndex = lastMatch.index + (lastMatch[1] || '').length;

        encodedValue =
            (startIndex ? decodedValue.substr(0, startIndex) : '') +
            libmime.encodeWord(decodedValue.substring(startIndex, endIndex), mimeWordEncoding || 'Q', maxLength) +
            (endIndex < decodedValue.length ? decodedValue.substr(endIndex) : '');

        return encodedValue;
    },

    /**
     * Decode a string that might include one or several mime words
     *
     * @param {String} str String including some mime words that will be encoded
     * @return {String} Decoded unicode string
     */
    decodeWords: function (str) {
        return (str || '').toString().

        // find base64 words that can be joined
        replace(/(=\?([^?]+)\?[Bb]\?[^?]+[^^=]\?=)\s*(?==\?([^?]+)\?[Bb]\?[^?]+\?=)/g,
            function (match, left, chLeft, chRight) {
                // only mark b64 chunks to be joined if charsets match
                if (libcharset.normalizeCharset(chLeft || '').toLowerCase().trim() === libcharset.normalizeCharset(chRight || '').toLowerCase().trim()) {
                    // set a joiner marker
                    return left + '__\x00JOIN\x00__';
                }
                return match;
            }).

        // find QP words that can be joined
        replace(/(=\?([^?]+)\?[Qq]\?[^?]+\?=)\s*(?==\?([^?]+)\?[Qq]\?[^?]+\?=)/g,
            function (match, left, chLeft, chRight) {
                // only mark QP chunks to be joined if charsets match
                if (libcharset.normalizeCharset(chLeft || '').toLowerCase().trim() === libcharset.normalizeCharset(chRight || '').toLowerCase().trim()) {
                    // set a joiner marker
                    return left + '__\x00JOIN\x00__';
                }
                return match;
            }).

        // join base64 encoded words
        replace(/(\?=)?__\x00JOIN\x00__(=\?([^?]+)\?[QqBb]\?)?/g, '').

        // remove spaces between mime encoded words
        replace(/(=\?[^?]+\?[QqBb]\?[^?]+\?=)\s+(?==\?[^?]+\?[QqBb]\?[^?]+\?=)/g, '$1').

        // decode words
        replace(/\=\?([\w_\-\*]+)\?([QqBb])\?[^\?]+\?\=/g, function (mimeWord) {
            return libmime.decodeWord(mimeWord);
        });
    },

    /**
     * Splits a string by :
     * The result is not mime word decoded, you need to do your own decoding based
     * on the rules for the specific header key
     *
     * @param {String} headerLine Single header line, might include linebreaks as well if folded
     * @return {Object} And object of {key, value}
     */
    decodeHeader: function (headerLine) {
        var line = (headerLine || '').toString().replace(/(?:\r?\n|\r)[ \t]*/g, ' ').trim(),
            match = line.match(/^\s*([^:]+):(.*)$/),
            key = (match && match[1] || '').trim().toLowerCase(),
            value = (match && match[2] || '').trim();

        return {
            key: key,
            value: value
        };
    },

    /**
     * Parses a block of header lines. Does not decode mime words as every
     * header might have its own rules (eg. formatted email addresses and such)
     *
     * @param {String} headers Headers string
     * @return {Object} An object of headers, where header keys are object keys. NB! Several values with the same key make up an Array
     */
    decodeHeaders: function (headers) {
        var lines = headers.split(/\r?\n|\r/),
            headersObj = {},
            header,
            i, len;

        for (i = lines.length - 1; i >= 0; i--) {
            if (i && lines[i].match(/^\s/)) {
                lines[i - 1] += '\r\n' + lines[i];
                lines.splice(i, 1);
            }
        }

        for (i = 0, len = lines.length; i < len; i++) {
            header = libmime.decodeHeader(lines[i]);
            if (!headersObj[header.key]) {
                headersObj[header.key] = [header.value];
            } else {
                headersObj[header.key].push(header.value);
            }
        }

        return headersObj;
    },

    /**
     * Joins parsed header value together as 'value; param1=value1; param2=value2'
     * PS: We are following RFC 822 for the list of special characters that we need to keep in quotes.
     *      Refer: https://www.w3.org/Protocols/rfc1341/4_Content-Type.html
     * @param {Object} structured Parsed header value
     * @return {String} joined header value
     */
    buildHeaderValue: function (structured) {
        var paramsArray = [];

        Object.keys(structured.params || {}).forEach(function (param) {
            // filename might include unicode characters so it is a special case
            var value = structured.params[param];
            if (!libmime.isPlainText(value) || value.length >= 75) {
                libmime.buildHeaderParam(param, value, 50).forEach(function (encodedParam) {
                    if (!/[\s"\\;:\/=\(\),<>@\[\]\?]|^[\-']|'$/.test(encodedParam.value) || encodedParam.key.substr(-1) === '*') {
                        paramsArray.push(encodedParam.key + '=' + encodedParam.value);
                    } else {
                        paramsArray.push(encodedParam.key + '=' + JSON.stringify(encodedParam.value));
                    }
                });
            } else if (/[\s'"\\;:\/=\(\),<>@\[\]\?]|^\-/.test(value)) {
                paramsArray.push(param + '=' + JSON.stringify(value));
            } else {
                paramsArray.push(param + '=' + value);
            }
        }.bind(this));

        return structured.value + (paramsArray.length ? '; ' + paramsArray.join('; ') : '');
    },

    /**
     * Parses a header value with key=value arguments into a structured
     * object.
     *
     *   parseHeaderValue('content-type: text/plain; CHARSET='UTF-8'') ->
     *   {
     *     'value': 'text/plain',
     *     'params': {
     *       'charset': 'UTF-8'
     *     }
     *   }
     *
     * @param {String} str Header value
     * @return {Object} Header value as a parsed structure
     */
    parseHeaderValue: function (str) {
        var response = {
                value: false,
                params: {}
            },
            key = false,
            value = '',
            type = 'value',
            quote = false,
            escaped = false,
            chr;

        for (var i = 0, len = str.length; i < len; i++) {
            chr = str.charAt(i);
            if (type === 'key') {
                if (chr === '=') {
                    key = value.trim().toLowerCase();
                    type = 'value';
                    value = '';
                    continue;
                }
                value += chr;
            } else {
                if (escaped) {
                    value += chr;
                } else if (chr === '\\') {
                    escaped = true;
                    continue;
                } else if (quote && chr === quote) {
                    quote = false;
                } else if (!quote && chr === '"') {
                    quote = chr;
                } else if (!quote && chr === ';') {
                    if (key === false) {
                        response.value = value.trim();
                    } else {
                        response.params[key] = value.trim();
                    }
                    type = 'key';
                    value = '';
                } else {
                    value += chr;
                }
                escaped = false;

            }
        }

        if (type === 'value') {
            if (key === false) {
                response.value = value.trim();
            } else {
                response.params[key] = value.trim();
            }
        } else if (value.trim()) {
            response.params[value.trim().toLowerCase()] = '';
        }

        // handle parameter value continuations
        // https://tools.ietf.org/html/rfc2231#section-3

        // preprocess values
        Object.keys(response.params).forEach(function (key) {
            var actualKey, nr, match, value;
            if ((match = key.match(/(\*(\d+)|\*(\d+)\*|\*)$/))) {
                actualKey = key.substr(0, match.index);
                nr = Number(match[2] || match[3]) || 0;

                if (!response.params[actualKey] || typeof response.params[actualKey] !== 'object') {
                    response.params[actualKey] = {
                        charset: false,
                        values: []
                    };
                }

                value = response.params[key];

                if (nr === 0 && match[0].substr(-1) === '*' && (match = value.match(/^([^']*)'[^']*'(.*)$/))) {
                    response.params[actualKey].charset = match[1] || 'iso-8859-1';
                    value = match[2];
                }

                response.params[actualKey].values[nr] = value;

                // remove the old reference
                delete response.params[key];
            }
        });

        // concatenate split rfc2231 strings and convert encoded strings to mime encoded words
        Object.keys(response.params).forEach(function (key) {
            var value;
            if (response.params[key] && Array.isArray(response.params[key].values)) {
                value = response.params[key].values.map(function (val) {
                    return val || '';
                }).join('');

                if (response.params[key].charset) {
                    // convert "%AB" to "=?charset?Q?=AB?="
                    response.params[key] = '=?' +
                        response.params[key].charset +
                        '?Q?' +
                        value.
                        // fix invalidly encoded chars
                    replace(/[=\?_\s]/g,
                            function (s) {
                                var c = s.charCodeAt(0).toString(16);
                                if (s === ' ') {
                                    return '_';
                                } else {
                                    return '%' + (c.length < 2 ? '0' : '') + c;
                                }
                            }
                        ).
                        // change from urlencoding to percent encoding
                    replace(/%/g, '=') +
                        '?=';
                } else {
                    response.params[key] = value;
                }
            }
        }.bind(this));

        return response;
    },

    /**
     * Encodes a string or an Buffer to an UTF-8 Parameter Value Continuation encoding (rfc2231)
     * Useful for splitting long parameter values.
     *
     * For example
     *      title="unicode string"
     * becomes
     *     title*0*=utf-8''unicode
     *     title*1*=%20string
     *
     * @param {String|Buffer} data String to be encoded
     * @param {Number} [maxLength=50] Max length for generated chunks
     * @param {String} [fromCharset='UTF-8'] Source sharacter set
     * @return {Array} A list of encoded keys and headers
     */
    buildHeaderParam: function (key, data, maxLength, fromCharset) {
        var list = [];
        var encodedStr = typeof data === 'string' ? data : libmime.decode(data, fromCharset);
        var encodedStrArr;
        var chr, ord;
        var line;
        var startPos = 0;
        var isEncoded = false;
        var i, len;

        maxLength = maxLength || 50;

        // process ascii only text
        if (libmime.isPlainText(data)) {

            // check if conversion is even needed
            if (encodedStr.length <= maxLength) {
                return [{
                    key: key,
                    value: encodedStr
                }];
            }

            encodedStr = encodedStr.replace(new RegExp('.{' + maxLength + '}', 'g'), function (str) {
                list.push({
                    line: str
                });
                return '';
            });

            if (encodedStr) {
                list.push({
                    line: encodedStr
                });
            }

        } else {

            if (/[\uD800-\uDBFF]/.test(encodedStr)) {
                // string containts surrogate pairs, so normalize it to an array of bytes
                encodedStrArr = [];
                for (i = 0, len = encodedStr.length; i < len; i++) {
                    chr = encodedStr.charAt(i);
                    ord = chr.charCodeAt(0);
                    if (ord >= 0xD800 && ord <= 0xDBFF && i < len - 1) {
                        chr += encodedStr.charAt(i + 1);
                        encodedStrArr.push(chr);
                        i++;
                    } else {
                        encodedStrArr.push(chr);
                    }
                }
                encodedStr = encodedStrArr;
            }

            // first line includes the charset and language info and needs to be encoded
            // even if it does not contain any unicode characters
            line = 'utf-8\'\'';
            isEncoded = true;
            startPos = 0;

            // process text with unicode or special chars
            for (i = 0, len = encodedStr.length; i < len; i++) {

                chr = encodedStr[i];

                if (isEncoded) {
                    chr = safeEncodeURIComponent(chr);
                } else {
                    // try to urlencode current char
                    chr = chr === ' ' ? chr : safeEncodeURIComponent(chr);
                    // By default it is not required to encode a line, the need
                    // only appears when the string contains unicode or special chars
                    // in this case we start processing the line over and encode all chars
                    if (chr !== encodedStr[i]) {
                        // Check if it is even possible to add the encoded char to the line
                        // If not, there is no reason to use this line, just push it to the list
                        // and start a new line with the char that needs encoding
                        if ((safeEncodeURIComponent(line) + chr).length >= maxLength) {
                            list.push({
                                line: line,
                                encoded: isEncoded
                            });
                            line = '';
                            startPos = i - 1;
                        } else {
                            isEncoded = true;
                            i = startPos;
                            line = '';
                            continue;
                        }
                    }
                }

                // if the line is already too long, push it to the list and start a new one
                if ((line + chr).length >= maxLength) {
                    list.push({
                        line: line,
                        encoded: isEncoded
                    });
                    line = chr = encodedStr[i] === ' ' ? ' ' : safeEncodeURIComponent(encodedStr[i]);
                    if (chr === encodedStr[i]) {
                        isEncoded = false;
                        startPos = i - 1;
                    } else {
                        isEncoded = true;
                    }
                } else {
                    line += chr;
                }
            }

            if (line) {
                list.push({
                    line: line,
                    encoded: isEncoded
                });
            }
        }

        return list.map(function (item, i) {
            return {
                // encoded lines: {name}*{part}*
                // unencoded lines: {name}*{part}
                // if any line needs to be encoded then the first line (part==0) is always encoded
                key: key + '*' + i + (item.encoded ? '*' : ''),
                value: item.line
            };
        });
    },


    /**
     * Returns file extension for a content type string. If no suitable extensions
     * are found, 'bin' is used as the default extension
     *
     * @param {String} mimeType Content type to be checked for
     * @return {String} File extension
     */
    detectExtension: function (mimeType) {
        mimeType = (mimeType || '').toString().toLowerCase().replace(/\s/g, '');
        if (!(mimeType in mimetypes.list)) {
            return 'bin';
        }

        if (typeof mimetypes.list[mimeType] === 'string') {
            return mimetypes.list[mimeType];
        }

        var mimeParts = mimeType.split('/');

        // search for name match
        for (var i = 0, len = mimetypes.list[mimeType].length; i < len; i++) {
            if (mimeParts[1] === mimetypes.list[mimeType][i]) {
                return mimetypes.list[mimeType][i];
            }
        }

        // use the first one
        return mimetypes.list[mimeType][0] !== '*' ? mimetypes.list[mimeType][0] : 'bin';
    },

    /**
     * Returns content type for a file extension. If no suitable content types
     * are found, 'application/octet-stream' is used as the default content type
     *
     * @param {String} extension Extension to be checked for
     * @return {String} File extension
     */
    detectMimeType: function (extension) {
        extension = (extension || '').toString().toLowerCase().replace(/\s/g, '').replace(/^\./g, '').split('.').pop();

        if (!(extension in mimetypes.extensions)) {
            return 'application/octet-stream';
        }

        if (typeof mimetypes.extensions[extension] === 'string') {
            return mimetypes.extensions[extension];
        }

        var mimeParts;

        // search for name match
        for (var i = 0, len = mimetypes.extensions[extension].length; i < len; i++) {
            mimeParts = mimetypes.extensions[extension][i].split('/');
            if (mimeParts[1] === extension) {
                return mimetypes.extensions[extension][i];
            }
        }

        // use the first one
        return mimetypes.extensions[extension][0];
    },

    /**
     * Folds long lines, useful for folding header lines (afterSpace=false) and
     * flowed text (afterSpace=true)
     *
     * @param {String} str String to be folded
     * @param {Number} [lineLength=76] Maximum length of a line
     * @param {Boolean} afterSpace If true, leave a space in th end of a line
     * @return {String} String with folded lines
     */
    foldLines: function (str, lineLength, afterSpace) {
        str = (str || '').toString();
        lineLength = lineLength || 76;

        var pos = 0,
            len = str.length,
            result = '',
            line, match;

        while (pos < len) {
            line = str.substr(pos, lineLength);
            if (line.length < lineLength) {
                result += line;
                break;
            }
            if ((match = line.match(/^[^\n\r]*(\r?\n|\r)/))) {
                line = match[0];
                result += line;
                pos += line.length;
                continue;
            } else if ((match = line.match(/(\s+)[^\s]*$/)) && match[0].length - (afterSpace ? (match[1] || '').length : 0) < line.length) {
                line = line.substr(0, line.length - (match[0].length - (afterSpace ? (match[1] || '').length : 0)));
            } else if ((match = str.substr(pos + line.length).match(/^[^\s]+(\s*)/))) {
                line = line + match[0].substr(0, match[0].length - (!afterSpace ? (match[1] || '').length : 0));
            }

            result += line;
            pos += line.length;
            if (pos < len) {
                result += '\r\n';
            }
        }

        return result;
    }
};

/**
 * Splits a mime encoded string. Needed for dividing mime words into smaller chunks
 *
 * @param {String} str Mime encoded string to be split up
 * @param {Number} maxlen Maximum length of characters for one part (minimum 12)
 * @return {Array} Split string
 */
function splitMimeEncodedString(str, maxlen) {
    var curLine, match, chr, done,
        lines = [];

    // require at least 12 symbols to fit possible 4 octet UTF-8 sequences
    maxlen = Math.max(maxlen || 0, 12);

    while (str.length) {
        curLine = str.substr(0, maxlen);

        // move incomplete escaped char back to main
        if ((match = curLine.match(/\=[0-9A-F]?$/i))) {
            curLine = curLine.substr(0, match.index);
        }

        done = false;
        while (!done) {
            done = true;
            // check if not middle of a unicode char sequence
            if ((match = str.substr(curLine.length).match(/^\=([0-9A-F]{2})/i))) {
                chr = parseInt(match[1], 16);
                // invalid sequence, move one char back anc recheck
                if (chr < 0xC2 && chr > 0x7F) {
                    curLine = curLine.substr(0, curLine.length - 3);
                    done = false;
                }
            }
        }

        if (curLine.length) {
            lines.push(curLine);
        }
        str = str.substr(curLine.length);
    }

    return lines;
}

function encodeURICharComponent(chr) {
    var i, len, ord;
    var res = '';

    ord = chr.charCodeAt(0).toString(16).toUpperCase();
    if (ord.length % 2) {
        ord = '0' + ord;
    }
    if (ord.length > 2) {
        for (i = 0, len = ord.length / 2; i < len; i++) {
            res += '%' + ord.substr(i, 2);
        }
    } else {
        res += '%' + ord;
    }

    return res;
}

function safeEncodeURIComponent(str) {
    str = (str || '').toString();

    try {
        // might throw if we try to encode invalid sequences, eg. partial emoji
        str = encodeURIComponent(str);
    } catch (E) {
        // should never run
        return str.replace(/[^\x00-\x1F *'()<>@,;:\\"\[\]?=\u007F-\uFFFF]+/g, '');
    }

    // ensure chars that are not handled by encodeURICompent are converted as well
    return str.replace(/[\x00-\x1F *'()<>@,;:\\"\[\]?=\u007F-\uFFFF]/g, encodeURICharComponent);
}


/***/ }),
/* 13 */
/***/ (function(module, exports) {

module.exports = [["a140","",62],["a180","",32],["a240","",62],["a280","",32],["a2ab","",5],["a2e3","€"],["a2ef",""],["a2fd",""],["a340","",62],["a380","",31,"　"],["a440","",62],["a480","",32],["a4f4","",10],["a540","",62],["a580","",32],["a5f7","",7],["a640","",62],["a680","",32],["a6b9","",7],["a6d9","",6],["a6ec",""],["a6f3",""],["a6f6","",8],["a740","",62],["a780","",32],["a7c2","",14],["a7f2","",12],["a896","",10],["a8bc",""],["a8bf","ǹ"],["a8c1",""],["a8ea","",20],["a958",""],["a95b",""],["a95d",""],["a989","〾⿰",11],["a997","",12],["a9f0","",14],["aaa1","",93],["aba1","",93],["aca1","",93],["ada1","",93],["aea1","",93],["afa1","",93],["d7fa","",4],["f8a1","",93],["f9a1","",93],["faa1","",93],["fba1","",93],["fca1","",93],["fda1","",93],["fe50","⺁⺄㑳㑇⺈⺋㖞㘚㘎⺌⺗㥮㤘㧏㧟㩳㧐㭎㱮㳠⺧⺪䁖䅟⺮䌷⺳⺶⺷䎱䎬⺻䏝䓖䙡䙌"],["fe80","䜣䜩䝼䞍⻊䥇䥺䥽䦂䦃䦅䦆䦟䦛䦷䦶䲣䲟䲠䲡䱷䲢䴓",6,"䶮",93]]

/***/ }),
/* 14 */
/***/ (function(module, exports) {

module.exports = [["0","\u0000",127],["a140","　，、。．‧；：？！︰…‥﹐﹑﹒·﹔﹕﹖﹗｜–︱—︳╴︴﹏（）︵︶｛｝︷︸〔〕︹︺【】︻︼《》︽︾〈〉︿﹀「」﹁﹂『』﹃﹄﹙﹚"],["a1a1","﹛﹜﹝﹞‘’“”〝〞‵′＃＆＊※§〃○●△▲◎☆★◇◆□■▽▼㊣℅¯￣＿ˍ﹉﹊﹍﹎﹋﹌﹟﹠﹡＋－×÷±√＜＞＝≦≧≠∞≒≡﹢",4,"～∩∪⊥∠∟⊿㏒㏑∫∮∵∴♀♂⊕⊙↑↓←→↖↗↙↘∥∣／"],["a240","＼∕﹨＄￥〒￠￡％＠℃℉﹩﹪﹫㏕㎜㎝㎞㏎㎡㎎㎏㏄°兙兛兞兝兡兣嗧瓩糎▁",7,"▏▎▍▌▋▊▉┼┴┬┤├▔─│▕┌┐└┘╭"],["a2a1","╮╰╯═╞╪╡◢◣◥◤╱╲╳０",9,"Ⅰ",9,"〡",8,"十卄卅Ａ",25,"ａ",21],["a340","ｗｘｙｚΑ",16,"Σ",6,"α",16,"σ",6,"ㄅ",10],["a3a1","ㄐ",25,"˙ˉˊˇˋ"],["a3e1","€"],["a440","一乙丁七乃九了二人儿入八几刀刁力匕十卜又三下丈上丫丸凡久么也乞于亡兀刃勺千叉口土士夕大女子孑孓寸小尢尸山川工己已巳巾干廾弋弓才"],["a4a1","丑丐不中丰丹之尹予云井互五亢仁什仃仆仇仍今介仄元允內六兮公冗凶分切刈勻勾勿化匹午升卅卞厄友及反壬天夫太夭孔少尤尺屯巴幻廿弔引心戈戶手扎支文斗斤方日曰月木欠止歹毋比毛氏水火爪父爻片牙牛犬王丙"],["a540","世丕且丘主乍乏乎以付仔仕他仗代令仙仞充兄冉冊冬凹出凸刊加功包匆北匝仟半卉卡占卯卮去可古右召叮叩叨叼司叵叫另只史叱台句叭叻四囚外"],["a5a1","央失奴奶孕它尼巨巧左市布平幼弁弘弗必戊打扔扒扑斥旦朮本未末札正母民氐永汁汀氾犯玄玉瓜瓦甘生用甩田由甲申疋白皮皿目矛矢石示禾穴立丞丟乒乓乩亙交亦亥仿伉伙伊伕伍伐休伏仲件任仰仳份企伋光兇兆先全"],["a640","共再冰列刑划刎刖劣匈匡匠印危吉吏同吊吐吁吋各向名合吃后吆吒因回囝圳地在圭圬圯圩夙多夷夸妄奸妃好她如妁字存宇守宅安寺尖屹州帆并年"],["a6a1","式弛忙忖戎戌戍成扣扛托收早旨旬旭曲曳有朽朴朱朵次此死氖汝汗汙江池汐汕污汛汍汎灰牟牝百竹米糸缶羊羽老考而耒耳聿肉肋肌臣自至臼舌舛舟艮色艾虫血行衣西阡串亨位住佇佗佞伴佛何估佐佑伽伺伸佃佔似但佣"],["a740","作你伯低伶余佝佈佚兌克免兵冶冷別判利刪刨劫助努劬匣即卵吝吭吞吾否呎吧呆呃吳呈呂君吩告吹吻吸吮吵吶吠吼呀吱含吟听囪困囤囫坊坑址坍"],["a7a1","均坎圾坐坏圻壯夾妝妒妨妞妣妙妖妍妤妓妊妥孝孜孚孛完宋宏尬局屁尿尾岐岑岔岌巫希序庇床廷弄弟彤形彷役忘忌志忍忱快忸忪戒我抄抗抖技扶抉扭把扼找批扳抒扯折扮投抓抑抆改攻攸旱更束李杏材村杜杖杞杉杆杠"],["a840","杓杗步每求汞沙沁沈沉沅沛汪決沐汰沌汨沖沒汽沃汲汾汴沆汶沍沔沘沂灶灼災灸牢牡牠狄狂玖甬甫男甸皂盯矣私秀禿究系罕肖肓肝肘肛肚育良芒"],["a8a1","芋芍見角言谷豆豕貝赤走足身車辛辰迂迆迅迄巡邑邢邪邦那酉釆里防阮阱阪阬並乖乳事些亞享京佯依侍佳使佬供例來侃佰併侈佩佻侖佾侏侑佺兔兒兕兩具其典冽函刻券刷刺到刮制剁劾劻卒協卓卑卦卷卸卹取叔受味呵"],["a940","咖呸咕咀呻呷咄咒咆呼咐呱呶和咚呢周咋命咎固垃坷坪坩坡坦坤坼夜奉奇奈奄奔妾妻委妹妮姑姆姐姍始姓姊妯妳姒姅孟孤季宗定官宜宙宛尚屈居"],["a9a1","屆岷岡岸岩岫岱岳帘帚帖帕帛帑幸庚店府底庖延弦弧弩往征彿彼忝忠忽念忿怏怔怯怵怖怪怕怡性怩怫怛或戕房戾所承拉拌拄抿拂抹拒招披拓拔拋拈抨抽押拐拙拇拍抵拚抱拘拖拗拆抬拎放斧於旺昔易昌昆昂明昀昏昕昊"],["aa40","昇服朋杭枋枕東果杳杷枇枝林杯杰板枉松析杵枚枓杼杪杲欣武歧歿氓氛泣注泳沱泌泥河沽沾沼波沫法泓沸泄油況沮泗泅泱沿治泡泛泊沬泯泜泖泠"],["aaa1","炕炎炒炊炙爬爭爸版牧物狀狎狙狗狐玩玨玟玫玥甽疝疙疚的盂盲直知矽社祀祁秉秈空穹竺糾罔羌羋者肺肥肢肱股肫肩肴肪肯臥臾舍芳芝芙芭芽芟芹花芬芥芯芸芣芰芾芷虎虱初表軋迎返近邵邸邱邶采金長門阜陀阿阻附"],["ab40","陂隹雨青非亟亭亮信侵侯便俠俑俏保促侶俘俟俊俗侮俐俄係俚俎俞侷兗冒冑冠剎剃削前剌剋則勇勉勃勁匍南卻厚叛咬哀咨哎哉咸咦咳哇哂咽咪品"],["aba1","哄哈咯咫咱咻咩咧咿囿垂型垠垣垢城垮垓奕契奏奎奐姜姘姿姣姨娃姥姪姚姦威姻孩宣宦室客宥封屎屏屍屋峙峒巷帝帥帟幽庠度建弈弭彥很待徊律徇後徉怒思怠急怎怨恍恰恨恢恆恃恬恫恪恤扁拜挖按拼拭持拮拽指拱拷"],["ac40","拯括拾拴挑挂政故斫施既春昭映昧是星昨昱昤曷柿染柱柔某柬架枯柵柩柯柄柑枴柚查枸柏柞柳枰柙柢柝柒歪殃殆段毒毗氟泉洋洲洪流津洌洱洞洗"],["aca1","活洽派洶洛泵洹洧洸洩洮洵洎洫炫為炳炬炯炭炸炮炤爰牲牯牴狩狠狡玷珊玻玲珍珀玳甚甭畏界畎畋疫疤疥疢疣癸皆皇皈盈盆盃盅省盹相眉看盾盼眇矜砂研砌砍祆祉祈祇禹禺科秒秋穿突竿竽籽紂紅紀紉紇約紆缸美羿耄"],["ad40","耐耍耑耶胖胥胚胃胄背胡胛胎胞胤胝致舢苧范茅苣苛苦茄若茂茉苒苗英茁苜苔苑苞苓苟苯茆虐虹虻虺衍衫要觔計訂訃貞負赴赳趴軍軌述迦迢迪迥"],["ada1","迭迫迤迨郊郎郁郃酋酊重閂限陋陌降面革韋韭音頁風飛食首香乘亳倌倍倣俯倦倥俸倩倖倆值借倚倒們俺倀倔倨俱倡個候倘俳修倭倪俾倫倉兼冤冥冢凍凌准凋剖剜剔剛剝匪卿原厝叟哨唐唁唷哼哥哲唆哺唔哩哭員唉哮哪"],["ae40","哦唧唇哽唏圃圄埂埔埋埃堉夏套奘奚娑娘娜娟娛娓姬娠娣娩娥娌娉孫屘宰害家宴宮宵容宸射屑展屐峭峽峻峪峨峰島崁峴差席師庫庭座弱徒徑徐恙"],["aea1","恣恥恐恕恭恩息悄悟悚悍悔悌悅悖扇拳挈拿捎挾振捕捂捆捏捉挺捐挽挪挫挨捍捌效敉料旁旅時晉晏晃晒晌晅晁書朔朕朗校核案框桓根桂桔栩梳栗桌桑栽柴桐桀格桃株桅栓栘桁殊殉殷氣氧氨氦氤泰浪涕消涇浦浸海浙涓"],["af40","浬涉浮浚浴浩涌涊浹涅浥涔烊烘烤烙烈烏爹特狼狹狽狸狷玆班琉珮珠珪珞畔畝畜畚留疾病症疲疳疽疼疹痂疸皋皰益盍盎眩真眠眨矩砰砧砸砝破砷"],["afa1","砥砭砠砟砲祕祐祠祟祖神祝祗祚秤秣秧租秦秩秘窄窈站笆笑粉紡紗紋紊素索純紐紕級紜納紙紛缺罟羔翅翁耆耘耕耙耗耽耿胱脂胰脅胭胴脆胸胳脈能脊胼胯臭臬舀舐航舫舨般芻茫荒荔荊茸荐草茵茴荏茲茹茶茗荀茱茨荃"],["b040","虔蚊蚪蚓蚤蚩蚌蚣蚜衰衷袁袂衽衹記訐討訌訕訊託訓訖訏訑豈豺豹財貢起躬軒軔軏辱送逆迷退迺迴逃追逅迸邕郡郝郢酒配酌釘針釗釜釙閃院陣陡"],["b0a1","陛陝除陘陞隻飢馬骨高鬥鬲鬼乾偺偽停假偃偌做偉健偶偎偕偵側偷偏倏偯偭兜冕凰剪副勒務勘動匐匏匙匿區匾參曼商啪啦啄啞啡啃啊唱啖問啕唯啤唸售啜唬啣唳啁啗圈國圉域堅堊堆埠埤基堂堵執培夠奢娶婁婉婦婪婀"],["b140","娼婢婚婆婊孰寇寅寄寂宿密尉專將屠屜屝崇崆崎崛崖崢崑崩崔崙崤崧崗巢常帶帳帷康庸庶庵庾張強彗彬彩彫得徙從徘御徠徜恿患悉悠您惋悴惦悽"],["b1a1","情悻悵惜悼惘惕惆惟悸惚惇戚戛扈掠控捲掖探接捷捧掘措捱掩掉掃掛捫推掄授掙採掬排掏掀捻捩捨捺敝敖救教敗啟敏敘敕敔斜斛斬族旋旌旎晝晚晤晨晦晞曹勗望梁梯梢梓梵桿桶梱梧梗械梃棄梭梆梅梔條梨梟梡梂欲殺"],["b240","毫毬氫涎涼淳淙液淡淌淤添淺清淇淋涯淑涮淞淹涸混淵淅淒渚涵淚淫淘淪深淮淨淆淄涪淬涿淦烹焉焊烽烯爽牽犁猜猛猖猓猙率琅琊球理現琍瓠瓶"],["b2a1","瓷甜產略畦畢異疏痔痕疵痊痍皎盔盒盛眷眾眼眶眸眺硫硃硎祥票祭移窒窕笠笨笛第符笙笞笮粒粗粕絆絃統紮紹紼絀細紳組累終紲紱缽羞羚翌翎習耜聊聆脯脖脣脫脩脰脤舂舵舷舶船莎莞莘荸莢莖莽莫莒莊莓莉莠荷荻荼"],["b340","莆莧處彪蛇蛀蚶蛄蚵蛆蛋蚱蚯蛉術袞袈被袒袖袍袋覓規訪訝訣訥許設訟訛訢豉豚販責貫貨貪貧赧赦趾趺軛軟這逍通逗連速逝逐逕逞造透逢逖逛途"],["b3a1","部郭都酗野釵釦釣釧釭釩閉陪陵陳陸陰陴陶陷陬雀雪雩章竟頂頃魚鳥鹵鹿麥麻傢傍傅備傑傀傖傘傚最凱割剴創剩勞勝勛博厥啻喀喧啼喊喝喘喂喜喪喔喇喋喃喳單喟唾喲喚喻喬喱啾喉喫喙圍堯堪場堤堰報堡堝堠壹壺奠"],["b440","婷媚婿媒媛媧孳孱寒富寓寐尊尋就嵌嵐崴嵇巽幅帽幀幃幾廊廁廂廄弼彭復循徨惑惡悲悶惠愜愣惺愕惰惻惴慨惱愎惶愉愀愒戟扉掣掌描揀揩揉揆揍"],["b4a1","插揣提握揖揭揮捶援揪換摒揚揹敞敦敢散斑斐斯普晰晴晶景暑智晾晷曾替期朝棺棕棠棘棗椅棟棵森棧棹棒棲棣棋棍植椒椎棉棚楮棻款欺欽殘殖殼毯氮氯氬港游湔渡渲湧湊渠渥渣減湛湘渤湖湮渭渦湯渴湍渺測湃渝渾滋"],["b540","溉渙湎湣湄湲湩湟焙焚焦焰無然煮焜牌犄犀猶猥猴猩琺琪琳琢琥琵琶琴琯琛琦琨甥甦畫番痢痛痣痙痘痞痠登發皖皓皴盜睏短硝硬硯稍稈程稅稀窘"],["b5a1","窗窖童竣等策筆筐筒答筍筋筏筑粟粥絞結絨絕紫絮絲絡給絢絰絳善翔翕耋聒肅腕腔腋腑腎脹腆脾腌腓腴舒舜菩萃菸萍菠菅萋菁華菱菴著萊菰萌菌菽菲菊萸萎萄菜萇菔菟虛蛟蛙蛭蛔蛛蛤蛐蛞街裁裂袱覃視註詠評詞証詁"],["b640","詔詛詐詆訴診訶詖象貂貯貼貳貽賁費賀貴買貶貿貸越超趁跎距跋跚跑跌跛跆軻軸軼辜逮逵週逸進逶鄂郵鄉郾酣酥量鈔鈕鈣鈉鈞鈍鈐鈇鈑閔閏開閑"],["b6a1","間閒閎隊階隋陽隅隆隍陲隄雁雅雄集雇雯雲韌項順須飧飪飯飩飲飭馮馭黃黍黑亂傭債傲傳僅傾催傷傻傯僇剿剷剽募勦勤勢勣匯嗟嗨嗓嗦嗎嗜嗇嗑嗣嗤嗯嗚嗡嗅嗆嗥嗉園圓塞塑塘塗塚塔填塌塭塊塢塒塋奧嫁嫉嫌媾媽媼"],["b740","媳嫂媲嵩嵯幌幹廉廈弒彙徬微愚意慈感想愛惹愁愈慎慌慄慍愾愴愧愍愆愷戡戢搓搾搞搪搭搽搬搏搜搔損搶搖搗搆敬斟新暗暉暇暈暖暄暘暍會榔業"],["b7a1","楚楷楠楔極椰概楊楨楫楞楓楹榆楝楣楛歇歲毀殿毓毽溢溯滓溶滂源溝滇滅溥溘溼溺溫滑準溜滄滔溪溧溴煎煙煩煤煉照煜煬煦煌煥煞煆煨煖爺牒猷獅猿猾瑯瑚瑕瑟瑞瑁琿瑙瑛瑜當畸瘀痰瘁痲痱痺痿痴痳盞盟睛睫睦睞督"],["b840","睹睪睬睜睥睨睢矮碎碰碗碘碌碉硼碑碓硿祺祿禁萬禽稜稚稠稔稟稞窟窠筷節筠筮筧粱粳粵經絹綑綁綏絛置罩罪署義羨群聖聘肆肄腱腰腸腥腮腳腫"],["b8a1","腹腺腦舅艇蒂葷落萱葵葦葫葉葬葛萼萵葡董葩葭葆虞虜號蛹蜓蜈蜇蜀蛾蛻蜂蜃蜆蜊衙裟裔裙補裘裝裡裊裕裒覜解詫該詳試詩詰誇詼詣誠話誅詭詢詮詬詹詻訾詨豢貊貉賊資賈賄貲賃賂賅跡跟跨路跳跺跪跤跦躲較載軾輊"],["b940","辟農運遊道遂達逼違遐遇遏過遍遑逾遁鄒鄗酬酪酩釉鈷鉗鈸鈽鉀鈾鉛鉋鉤鉑鈴鉉鉍鉅鈹鈿鉚閘隘隔隕雍雋雉雊雷電雹零靖靴靶預頑頓頊頒頌飼飴"],["b9a1","飽飾馳馱馴髡鳩麂鼎鼓鼠僧僮僥僖僭僚僕像僑僱僎僩兢凳劃劂匱厭嗾嘀嘛嘗嗽嘔嘆嘉嘍嘎嗷嘖嘟嘈嘐嗶團圖塵塾境墓墊塹墅塽壽夥夢夤奪奩嫡嫦嫩嫗嫖嫘嫣孵寞寧寡寥實寨寢寤察對屢嶄嶇幛幣幕幗幔廓廖弊彆彰徹慇"],["ba40","愿態慷慢慣慟慚慘慵截撇摘摔撤摸摟摺摑摧搴摭摻敲斡旗旖暢暨暝榜榨榕槁榮槓構榛榷榻榫榴槐槍榭槌榦槃榣歉歌氳漳演滾漓滴漩漾漠漬漏漂漢"],["baa1","滿滯漆漱漸漲漣漕漫漯澈漪滬漁滲滌滷熔熙煽熊熄熒爾犒犖獄獐瑤瑣瑪瑰瑭甄疑瘧瘍瘋瘉瘓盡監瞄睽睿睡磁碟碧碳碩碣禎福禍種稱窪窩竭端管箕箋筵算箝箔箏箸箇箄粹粽精綻綰綜綽綾綠緊綴網綱綺綢綿綵綸維緒緇綬"],["bb40","罰翠翡翟聞聚肇腐膀膏膈膊腿膂臧臺與舔舞艋蓉蒿蓆蓄蒙蒞蒲蒜蓋蒸蓀蓓蒐蒼蓑蓊蜿蜜蜻蜢蜥蜴蜘蝕蜷蜩裳褂裴裹裸製裨褚裯誦誌語誣認誡誓誤"],["bba1","說誥誨誘誑誚誧豪貍貌賓賑賒赫趙趕跼輔輒輕輓辣遠遘遜遣遙遞遢遝遛鄙鄘鄞酵酸酷酴鉸銀銅銘銖鉻銓銜銨鉼銑閡閨閩閣閥閤隙障際雌雒需靼鞅韶頗領颯颱餃餅餌餉駁骯骰髦魁魂鳴鳶鳳麼鼻齊億儀僻僵價儂儈儉儅凜"],["bc40","劇劈劉劍劊勰厲嘮嘻嘹嘲嘿嘴嘩噓噎噗噴嘶嘯嘰墀墟增墳墜墮墩墦奭嬉嫻嬋嫵嬌嬈寮寬審寫層履嶝嶔幢幟幡廢廚廟廝廣廠彈影德徵慶慧慮慝慕憂"],["bca1","慼慰慫慾憧憐憫憎憬憚憤憔憮戮摩摯摹撞撲撈撐撰撥撓撕撩撒撮播撫撚撬撙撢撳敵敷數暮暫暴暱樣樟槨樁樞標槽模樓樊槳樂樅槭樑歐歎殤毅毆漿潼澄潑潦潔澆潭潛潸潮澎潺潰潤澗潘滕潯潠潟熟熬熱熨牖犛獎獗瑩璋璃"],["bd40","瑾璀畿瘠瘩瘟瘤瘦瘡瘢皚皺盤瞎瞇瞌瞑瞋磋磅確磊碾磕碼磐稿稼穀稽稷稻窯窮箭箱範箴篆篇篁箠篌糊締練緯緻緘緬緝編緣線緞緩綞緙緲緹罵罷羯"],["bda1","翩耦膛膜膝膠膚膘蔗蔽蔚蓮蔬蔭蔓蔑蔣蔡蔔蓬蔥蓿蔆螂蝴蝶蝠蝦蝸蝨蝙蝗蝌蝓衛衝褐複褒褓褕褊誼諒談諄誕請諸課諉諂調誰論諍誶誹諛豌豎豬賠賞賦賤賬賭賢賣賜質賡赭趟趣踫踐踝踢踏踩踟踡踞躺輝輛輟輩輦輪輜輞"],["be40","輥適遮遨遭遷鄰鄭鄧鄱醇醉醋醃鋅銻銷鋪銬鋤鋁銳銼鋒鋇鋰銲閭閱霄霆震霉靠鞍鞋鞏頡頫頜颳養餓餒餘駝駐駟駛駑駕駒駙骷髮髯鬧魅魄魷魯鴆鴉"],["bea1","鴃麩麾黎墨齒儒儘儔儐儕冀冪凝劑劓勳噙噫噹噩噤噸噪器噥噱噯噬噢噶壁墾壇壅奮嬝嬴學寰導彊憲憑憩憊懍憶憾懊懈戰擅擁擋撻撼據擄擇擂操撿擒擔撾整曆曉暹曄曇暸樽樸樺橙橫橘樹橄橢橡橋橇樵機橈歙歷氅濂澱澡"],["bf40","濃澤濁澧澳激澹澶澦澠澴熾燉燐燒燈燕熹燎燙燜燃燄獨璜璣璘璟璞瓢甌甍瘴瘸瘺盧盥瞠瞞瞟瞥磨磚磬磧禦積穎穆穌穋窺篙簑築篤篛篡篩篦糕糖縊"],["bfa1","縑縈縛縣縞縝縉縐罹羲翰翱翮耨膳膩膨臻興艘艙蕊蕙蕈蕨蕩蕃蕉蕭蕪蕞螃螟螞螢融衡褪褲褥褫褡親覦諦諺諫諱謀諜諧諮諾謁謂諷諭諳諶諼豫豭貓賴蹄踱踴蹂踹踵輻輯輸輳辨辦遵遴選遲遼遺鄴醒錠錶鋸錳錯錢鋼錫錄錚"],["c040","錐錦錡錕錮錙閻隧隨險雕霎霑霖霍霓霏靛靜靦鞘頰頸頻頷頭頹頤餐館餞餛餡餚駭駢駱骸骼髻髭鬨鮑鴕鴣鴦鴨鴒鴛默黔龍龜優償儡儲勵嚎嚀嚐嚅嚇"],["c0a1","嚏壕壓壑壎嬰嬪嬤孺尷屨嶼嶺嶽嶸幫彌徽應懂懇懦懋戲戴擎擊擘擠擰擦擬擱擢擭斂斃曙曖檀檔檄檢檜櫛檣橾檗檐檠歜殮毚氈濘濱濟濠濛濤濫濯澀濬濡濩濕濮濰燧營燮燦燥燭燬燴燠爵牆獰獲璩環璦璨癆療癌盪瞳瞪瞰瞬"],["c140","瞧瞭矯磷磺磴磯礁禧禪穗窿簇簍篾篷簌篠糠糜糞糢糟糙糝縮績繆縷縲繃縫總縱繅繁縴縹繈縵縿縯罄翳翼聱聲聰聯聳臆臃膺臂臀膿膽臉膾臨舉艱薪"],["c1a1","薄蕾薜薑薔薯薛薇薨薊虧蟀蟑螳蟒蟆螫螻螺蟈蟋褻褶襄褸褽覬謎謗謙講謊謠謝謄謐豁谿豳賺賽購賸賻趨蹉蹋蹈蹊轄輾轂轅輿避遽還邁邂邀鄹醣醞醜鍍鎂錨鍵鍊鍥鍋錘鍾鍬鍛鍰鍚鍔闊闋闌闈闆隱隸雖霜霞鞠韓顆颶餵騁"],["c240","駿鮮鮫鮪鮭鴻鴿麋黏點黜黝黛鼾齋叢嚕嚮壙壘嬸彝懣戳擴擲擾攆擺擻擷斷曜朦檳檬櫃檻檸櫂檮檯歟歸殯瀉瀋濾瀆濺瀑瀏燻燼燾燸獷獵璧璿甕癖癘"],["c2a1","癒瞽瞿瞻瞼礎禮穡穢穠竄竅簫簧簪簞簣簡糧織繕繞繚繡繒繙罈翹翻職聶臍臏舊藏薩藍藐藉薰薺薹薦蟯蟬蟲蟠覆覲觴謨謹謬謫豐贅蹙蹣蹦蹤蹟蹕軀轉轍邇邃邈醫醬釐鎔鎊鎖鎢鎳鎮鎬鎰鎘鎚鎗闔闖闐闕離雜雙雛雞霤鞣鞦"],["c340","鞭韹額顏題顎顓颺餾餿餽餮馥騎髁鬃鬆魏魎魍鯊鯉鯽鯈鯀鵑鵝鵠黠鼕鼬儳嚥壞壟壢寵龐廬懲懷懶懵攀攏曠曝櫥櫝櫚櫓瀛瀟瀨瀚瀝瀕瀘爆爍牘犢獸"],["c3a1","獺璽瓊瓣疇疆癟癡矇礙禱穫穩簾簿簸簽簷籀繫繭繹繩繪羅繳羶羹羸臘藩藝藪藕藤藥藷蟻蠅蠍蟹蟾襠襟襖襞譁譜識證譚譎譏譆譙贈贊蹼蹲躇蹶蹬蹺蹴轔轎辭邊邋醱醮鏡鏑鏟鏃鏈鏜鏝鏖鏢鏍鏘鏤鏗鏨關隴難霪霧靡韜韻類"],["c440","願顛颼饅饉騖騙鬍鯨鯧鯖鯛鶉鵡鵲鵪鵬麒麗麓麴勸嚨嚷嚶嚴嚼壤孀孃孽寶巉懸懺攘攔攙曦朧櫬瀾瀰瀲爐獻瓏癢癥礦礪礬礫竇競籌籃籍糯糰辮繽繼"],["c4a1","纂罌耀臚艦藻藹蘑藺蘆蘋蘇蘊蠔蠕襤覺觸議譬警譯譟譫贏贍躉躁躅躂醴釋鐘鐃鏽闡霰飄饒饑馨騫騰騷騵鰓鰍鹹麵黨鼯齟齣齡儷儸囁囀囂夔屬巍懼懾攝攜斕曩櫻欄櫺殲灌爛犧瓖瓔癩矓籐纏續羼蘗蘭蘚蠣蠢蠡蠟襪襬覽譴"],["c540","護譽贓躊躍躋轟辯醺鐮鐳鐵鐺鐸鐲鐫闢霸霹露響顧顥饗驅驃驀騾髏魔魑鰭鰥鶯鶴鷂鶸麝黯鼙齜齦齧儼儻囈囊囉孿巔巒彎懿攤權歡灑灘玀瓤疊癮癬"],["c5a1","禳籠籟聾聽臟襲襯觼讀贖贗躑躓轡酈鑄鑑鑒霽霾韃韁顫饕驕驍髒鬚鱉鰱鰾鰻鷓鷗鼴齬齪龔囌巖戀攣攫攪曬欐瓚竊籤籣籥纓纖纔臢蘸蘿蠱變邐邏鑣鑠鑤靨顯饜驚驛驗髓體髑鱔鱗鱖鷥麟黴囑壩攬灞癱癲矗罐羈蠶蠹衢讓讒"],["c640","讖艷贛釀鑪靂靈靄韆顰驟鬢魘鱟鷹鷺鹼鹽鼇齷齲廳欖灣籬籮蠻觀躡釁鑲鑰顱饞髖鬣黌灤矚讚鑷韉驢驥纜讜躪釅鑽鑾鑼鱷鱸黷豔鑿鸚爨驪鬱鸛鸞籲"],["c940","乂乜凵匚厂万丌乇亍囗兀屮彳丏冇与丮亓仂仉仈冘勼卬厹圠夃夬尐巿旡殳毌气爿丱丼仨仜仩仡仝仚刌匜卌圢圣夗夯宁宄尒尻屴屳帄庀庂忉戉扐氕"],["c9a1","氶汃氿氻犮犰玊禸肊阞伎优伬仵伔仱伀价伈伝伂伅伢伓伄仴伒冱刓刉刐劦匢匟卍厊吇囡囟圮圪圴夼妀奼妅奻奾奷奿孖尕尥屼屺屻屾巟幵庄异弚彴忕忔忏扜扞扤扡扦扢扙扠扚扥旯旮朾朹朸朻机朿朼朳氘汆汒汜汏汊汔汋"],["ca40","汌灱牞犴犵玎甪癿穵网艸艼芀艽艿虍襾邙邗邘邛邔阢阤阠阣佖伻佢佉体佤伾佧佒佟佁佘伭伳伿佡冏冹刜刞刡劭劮匉卣卲厎厏吰吷吪呔呅吙吜吥吘"],["caa1","吽呏呁吨吤呇囮囧囥坁坅坌坉坋坒夆奀妦妘妠妗妎妢妐妏妧妡宎宒尨尪岍岏岈岋岉岒岊岆岓岕巠帊帎庋庉庌庈庍弅弝彸彶忒忑忐忭忨忮忳忡忤忣忺忯忷忻怀忴戺抃抌抎抏抔抇扱扻扺扰抁抈扷扽扲扴攷旰旴旳旲旵杅杇"],["cb40","杙杕杌杈杝杍杚杋毐氙氚汸汧汫沄沋沏汱汯汩沚汭沇沕沜汦汳汥汻沎灴灺牣犿犽狃狆狁犺狅玕玗玓玔玒町甹疔疕皁礽耴肕肙肐肒肜芐芏芅芎芑芓"],["cba1","芊芃芄豸迉辿邟邡邥邞邧邠阰阨阯阭丳侘佼侅佽侀侇佶佴侉侄佷佌侗佪侚佹侁佸侐侜侔侞侒侂侕佫佮冞冼冾刵刲刳剆刱劼匊匋匼厒厔咇呿咁咑咂咈呫呺呾呥呬呴呦咍呯呡呠咘呣呧呤囷囹坯坲坭坫坱坰坶垀坵坻坳坴坢"],["cc40","坨坽夌奅妵妺姏姎妲姌姁妶妼姃姖妱妽姀姈妴姇孢孥宓宕屄屇岮岤岠岵岯岨岬岟岣岭岢岪岧岝岥岶岰岦帗帔帙弨弢弣弤彔徂彾彽忞忥怭怦怙怲怋"],["cca1","怴怊怗怳怚怞怬怢怍怐怮怓怑怌怉怜戔戽抭抴拑抾抪抶拊抮抳抯抻抩抰抸攽斨斻昉旼昄昒昈旻昃昋昍昅旽昑昐曶朊枅杬枎枒杶杻枘枆构杴枍枌杺枟枑枙枃杽极杸杹枔欥殀歾毞氝沓泬泫泮泙沶泔沭泧沷泐泂沺泃泆泭泲"],["cd40","泒泝沴沊沝沀泞泀洰泍泇沰泹泏泩泑炔炘炅炓炆炄炑炖炂炚炃牪狖狋狘狉狜狒狔狚狌狑玤玡玭玦玢玠玬玝瓝瓨甿畀甾疌疘皯盳盱盰盵矸矼矹矻矺"],["cda1","矷祂礿秅穸穻竻籵糽耵肏肮肣肸肵肭舠芠苀芫芚芘芛芵芧芮芼芞芺芴芨芡芩苂芤苃芶芢虰虯虭虮豖迒迋迓迍迖迕迗邲邴邯邳邰阹阽阼阺陃俍俅俓侲俉俋俁俔俜俙侻侳俛俇俖侺俀侹俬剄剉勀勂匽卼厗厖厙厘咺咡咭咥哏"],["ce40","哃茍咷咮哖咶哅哆咠呰咼咢咾呲哞咰垵垞垟垤垌垗垝垛垔垘垏垙垥垚垕壴复奓姡姞姮娀姱姝姺姽姼姶姤姲姷姛姩姳姵姠姾姴姭宨屌峐峘峌峗峋峛"],["cea1","峞峚峉峇峊峖峓峔峏峈峆峎峟峸巹帡帢帣帠帤庰庤庢庛庣庥弇弮彖徆怷怹恔恲恞恅恓恇恉恛恌恀恂恟怤恄恘恦恮扂扃拏挍挋拵挎挃拫拹挏挌拸拶挀挓挔拺挕拻拰敁敃斪斿昶昡昲昵昜昦昢昳昫昺昝昴昹昮朏朐柁柲柈枺"],["cf40","柜枻柸柘柀枷柅柫柤柟枵柍枳柷柶柮柣柂枹柎柧柰枲柼柆柭柌枮柦柛柺柉柊柃柪柋欨殂殄殶毖毘毠氠氡洨洴洭洟洼洿洒洊泚洳洄洙洺洚洑洀洝浂"],["cfa1","洁洘洷洃洏浀洇洠洬洈洢洉洐炷炟炾炱炰炡炴炵炩牁牉牊牬牰牳牮狊狤狨狫狟狪狦狣玅珌珂珈珅玹玶玵玴珫玿珇玾珃珆玸珋瓬瓮甮畇畈疧疪癹盄眈眃眄眅眊盷盻盺矧矨砆砑砒砅砐砏砎砉砃砓祊祌祋祅祄秕种秏秖秎窀"],["d040","穾竑笀笁籺籸籹籿粀粁紃紈紁罘羑羍羾耇耎耏耔耷胘胇胠胑胈胂胐胅胣胙胜胊胕胉胏胗胦胍臿舡芔苙苾苹茇苨茀苕茺苫苖苴苬苡苲苵茌苻苶苰苪"],["d0a1","苤苠苺苳苭虷虴虼虳衁衎衧衪衩觓訄訇赲迣迡迮迠郱邽邿郕郅邾郇郋郈釔釓陔陏陑陓陊陎倞倅倇倓倢倰倛俵俴倳倷倬俶俷倗倜倠倧倵倯倱倎党冔冓凊凄凅凈凎剡剚剒剞剟剕剢勍匎厞唦哢唗唒哧哳哤唚哿唄唈哫唑唅哱"],["d140","唊哻哷哸哠唎唃唋圁圂埌堲埕埒垺埆垽垼垸垶垿埇埐垹埁夎奊娙娖娭娮娕娏娗娊娞娳孬宧宭宬尃屖屔峬峿峮峱峷崀峹帩帨庨庮庪庬弳弰彧恝恚恧"],["d1a1","恁悢悈悀悒悁悝悃悕悛悗悇悜悎戙扆拲挐捖挬捄捅挶捃揤挹捋捊挼挩捁挴捘捔捙挭捇挳捚捑挸捗捀捈敊敆旆旃旄旂晊晟晇晑朒朓栟栚桉栲栳栻桋桏栖栱栜栵栫栭栯桎桄栴栝栒栔栦栨栮桍栺栥栠欬欯欭欱欴歭肂殈毦毤"],["d240","毨毣毢毧氥浺浣浤浶洍浡涒浘浢浭浯涑涍淯浿涆浞浧浠涗浰浼浟涂涘洯浨涋浾涀涄洖涃浻浽浵涐烜烓烑烝烋缹烢烗烒烞烠烔烍烅烆烇烚烎烡牂牸"],["d2a1","牷牶猀狺狴狾狶狳狻猁珓珙珥珖玼珧珣珩珜珒珛珔珝珚珗珘珨瓞瓟瓴瓵甡畛畟疰痁疻痄痀疿疶疺皊盉眝眛眐眓眒眣眑眕眙眚眢眧砣砬砢砵砯砨砮砫砡砩砳砪砱祔祛祏祜祓祒祑秫秬秠秮秭秪秜秞秝窆窉窅窋窌窊窇竘笐"],["d340","笄笓笅笏笈笊笎笉笒粄粑粊粌粈粍粅紞紝紑紎紘紖紓紟紒紏紌罜罡罞罠罝罛羖羒翃翂翀耖耾耹胺胲胹胵脁胻脀舁舯舥茳茭荄茙荑茥荖茿荁茦茜茢"],["d3a1","荂荎茛茪茈茼荍茖茤茠茷茯茩荇荅荌荓茞茬荋茧荈虓虒蚢蚨蚖蚍蚑蚞蚇蚗蚆蚋蚚蚅蚥蚙蚡蚧蚕蚘蚎蚝蚐蚔衃衄衭衵衶衲袀衱衿衯袃衾衴衼訒豇豗豻貤貣赶赸趵趷趶軑軓迾迵适迿迻逄迼迶郖郠郙郚郣郟郥郘郛郗郜郤酐"],["d440","酎酏釕釢釚陜陟隼飣髟鬯乿偰偪偡偞偠偓偋偝偲偈偍偁偛偊偢倕偅偟偩偫偣偤偆偀偮偳偗偑凐剫剭剬剮勖勓匭厜啵啶唼啍啐唴唪啑啢唶唵唰啒啅"],["d4a1","唌唲啥啎唹啈唭唻啀啋圊圇埻堔埢埶埜埴堀埭埽堈埸堋埳埏堇埮埣埲埥埬埡堎埼堐埧堁堌埱埩埰堍堄奜婠婘婕婧婞娸娵婭婐婟婥婬婓婤婗婃婝婒婄婛婈媎娾婍娹婌婰婩婇婑婖婂婜孲孮寁寀屙崞崋崝崚崠崌崨崍崦崥崏"],["d540","崰崒崣崟崮帾帴庱庴庹庲庳弶弸徛徖徟悊悐悆悾悰悺惓惔惏惤惙惝惈悱惛悷惊悿惃惍惀挲捥掊掂捽掽掞掭掝掗掫掎捯掇掐据掯捵掜捭掮捼掤挻掟"],["d5a1","捸掅掁掑掍捰敓旍晥晡晛晙晜晢朘桹梇梐梜桭桮梮梫楖桯梣梬梩桵桴梲梏桷梒桼桫桲梪梀桱桾梛梖梋梠梉梤桸桻梑梌梊桽欶欳欷欸殑殏殍殎殌氪淀涫涴涳湴涬淩淢涷淶淔渀淈淠淟淖涾淥淜淝淛淴淊涽淭淰涺淕淂淏淉"],["d640","淐淲淓淽淗淍淣涻烺焍烷焗烴焌烰焄烳焐烼烿焆焓焀烸烶焋焂焎牾牻牼牿猝猗猇猑猘猊猈狿猏猞玈珶珸珵琄琁珽琇琀珺珼珿琌琋珴琈畤畣痎痒痏"],["d6a1","痋痌痑痐皏皉盓眹眯眭眱眲眴眳眽眥眻眵硈硒硉硍硊硌砦硅硐祤祧祩祪祣祫祡离秺秸秶秷窏窔窐笵筇笴笥笰笢笤笳笘笪笝笱笫笭笯笲笸笚笣粔粘粖粣紵紽紸紶紺絅紬紩絁絇紾紿絊紻紨罣羕羜羝羛翊翋翍翐翑翇翏翉耟"],["d740","耞耛聇聃聈脘脥脙脛脭脟脬脞脡脕脧脝脢舑舸舳舺舴舲艴莐莣莨莍荺荳莤荴莏莁莕莙荵莔莩荽莃莌莝莛莪莋荾莥莯莈莗莰荿莦莇莮荶莚虙虖蚿蚷"],["d7a1","蛂蛁蛅蚺蚰蛈蚹蚳蚸蛌蚴蚻蚼蛃蚽蚾衒袉袕袨袢袪袚袑袡袟袘袧袙袛袗袤袬袌袓袎覂觖觙觕訰訧訬訞谹谻豜豝豽貥赽赻赹趼跂趹趿跁軘軞軝軜軗軠軡逤逋逑逜逌逡郯郪郰郴郲郳郔郫郬郩酖酘酚酓酕釬釴釱釳釸釤釹釪"],["d840","釫釷釨釮镺閆閈陼陭陫陱陯隿靪頄飥馗傛傕傔傞傋傣傃傌傎傝偨傜傒傂傇兟凔匒匑厤厧喑喨喥喭啷噅喢喓喈喏喵喁喣喒喤啽喌喦啿喕喡喎圌堩堷"],["d8a1","堙堞堧堣堨埵塈堥堜堛堳堿堶堮堹堸堭堬堻奡媯媔媟婺媢媞婸媦婼媥媬媕媮娷媄媊媗媃媋媩婻婽媌媜媏媓媝寪寍寋寔寑寊寎尌尰崷嵃嵫嵁嵋崿崵嵑嵎嵕崳崺嵒崽崱嵙嵂崹嵉崸崼崲崶嵀嵅幄幁彘徦徥徫惉悹惌惢惎惄愔"],["d940","惲愊愖愅惵愓惸惼惾惁愃愘愝愐惿愄愋扊掔掱掰揎揥揨揯揃撝揳揊揠揶揕揲揵摡揟掾揝揜揄揘揓揂揇揌揋揈揰揗揙攲敧敪敤敜敨敥斌斝斞斮旐旒"],["d9a1","晼晬晻暀晱晹晪晲朁椌棓椄棜椪棬棪棱椏棖棷棫棤棶椓椐棳棡椇棌椈楰梴椑棯棆椔棸棐棽棼棨椋椊椗棎棈棝棞棦棴棑椆棔棩椕椥棇欹欻欿欼殔殗殙殕殽毰毲毳氰淼湆湇渟湉溈渼渽湅湢渫渿湁湝湳渜渳湋湀湑渻渃渮湞"],["da40","湨湜湡渱渨湠湱湫渹渢渰湓湥渧湸湤湷湕湹湒湦渵渶湚焠焞焯烻焮焱焣焥焢焲焟焨焺焛牋牚犈犉犆犅犋猒猋猰猢猱猳猧猲猭猦猣猵猌琮琬琰琫琖"],["daa1","琚琡琭琱琤琣琝琩琠琲瓻甯畯畬痧痚痡痦痝痟痤痗皕皒盚睆睇睄睍睅睊睎睋睌矞矬硠硤硥硜硭硱硪确硰硩硨硞硢祴祳祲祰稂稊稃稌稄窙竦竤筊笻筄筈筌筎筀筘筅粢粞粨粡絘絯絣絓絖絧絪絏絭絜絫絒絔絩絑絟絎缾缿罥"],["db40","罦羢羠羡翗聑聏聐胾胔腃腊腒腏腇脽腍脺臦臮臷臸臹舄舼舽舿艵茻菏菹萣菀菨萒菧菤菼菶萐菆菈菫菣莿萁菝菥菘菿菡菋菎菖菵菉萉萏菞萑萆菂菳"],["dba1","菕菺菇菑菪萓菃菬菮菄菻菗菢萛菛菾蛘蛢蛦蛓蛣蛚蛪蛝蛫蛜蛬蛩蛗蛨蛑衈衖衕袺裗袹袸裀袾袶袼袷袽袲褁裉覕覘覗觝觚觛詎詍訹詙詀詗詘詄詅詒詈詑詊詌詏豟貁貀貺貾貰貹貵趄趀趉跘跓跍跇跖跜跏跕跙跈跗跅軯軷軺"],["dc40","軹軦軮軥軵軧軨軶軫軱軬軴軩逭逴逯鄆鄬鄄郿郼鄈郹郻鄁鄀鄇鄅鄃酡酤酟酢酠鈁鈊鈥鈃鈚鈦鈏鈌鈀鈒釿釽鈆鈄鈧鈂鈜鈤鈙鈗鈅鈖镻閍閌閐隇陾隈"],["dca1","隉隃隀雂雈雃雱雰靬靰靮頇颩飫鳦黹亃亄亶傽傿僆傮僄僊傴僈僂傰僁傺傱僋僉傶傸凗剺剸剻剼嗃嗛嗌嗐嗋嗊嗝嗀嗔嗄嗩喿嗒喍嗏嗕嗢嗖嗈嗲嗍嗙嗂圔塓塨塤塏塍塉塯塕塎塝塙塥塛堽塣塱壼嫇嫄嫋媺媸媱媵媰媿嫈媻嫆"],["dd40","媷嫀嫊媴媶嫍媹媐寖寘寙尟尳嵱嵣嵊嵥嵲嵬嵞嵨嵧嵢巰幏幎幊幍幋廅廌廆廋廇彀徯徭惷慉慊愫慅愶愲愮慆愯慏愩慀戠酨戣戥戤揅揱揫搐搒搉搠搤"],["dda1","搳摃搟搕搘搹搷搢搣搌搦搰搨摁搵搯搊搚摀搥搧搋揧搛搮搡搎敯斒旓暆暌暕暐暋暊暙暔晸朠楦楟椸楎楢楱椿楅楪椹楂楗楙楺楈楉椵楬椳椽楥棰楸椴楩楀楯楄楶楘楁楴楌椻楋椷楜楏楑椲楒椯楻椼歆歅歃歂歈歁殛嗀毻毼"],["de40","毹毷毸溛滖滈溏滀溟溓溔溠溱溹滆滒溽滁溞滉溷溰滍溦滏溲溾滃滜滘溙溒溎溍溤溡溿溳滐滊溗溮溣煇煔煒煣煠煁煝煢煲煸煪煡煂煘煃煋煰煟煐煓"],["dea1","煄煍煚牏犍犌犑犐犎猼獂猻猺獀獊獉瑄瑊瑋瑒瑑瑗瑀瑏瑐瑎瑂瑆瑍瑔瓡瓿瓾瓽甝畹畷榃痯瘏瘃痷痾痼痹痸瘐痻痶痭痵痽皙皵盝睕睟睠睒睖睚睩睧睔睙睭矠碇碚碔碏碄碕碅碆碡碃硹碙碀碖硻祼禂祽祹稑稘稙稒稗稕稢稓"],["df40","稛稐窣窢窞竫筦筤筭筴筩筲筥筳筱筰筡筸筶筣粲粴粯綈綆綀綍絿綅絺綎絻綃絼綌綔綄絽綒罭罫罧罨罬羦羥羧翛翜耡腤腠腷腜腩腛腢腲朡腞腶腧腯"],["dfa1","腄腡舝艉艄艀艂艅蓱萿葖葶葹蒏蒍葥葑葀蒆葧萰葍葽葚葙葴葳葝蔇葞萷萺萴葺葃葸萲葅萩菙葋萯葂萭葟葰萹葎葌葒葯蓅蒎萻葇萶萳葨葾葄萫葠葔葮葐蜋蜄蛷蜌蛺蛖蛵蝍蛸蜎蜉蜁蛶蜍蜅裖裋裍裎裞裛裚裌裐覅覛觟觥觤"],["e040","觡觠觢觜触詶誆詿詡訿詷誂誄詵誃誁詴詺谼豋豊豥豤豦貆貄貅賌赨赩趑趌趎趏趍趓趔趐趒跰跠跬跱跮跐跩跣跢跧跲跫跴輆軿輁輀輅輇輈輂輋遒逿"],["e0a1","遄遉逽鄐鄍鄏鄑鄖鄔鄋鄎酮酯鉈鉒鈰鈺鉦鈳鉥鉞銃鈮鉊鉆鉭鉬鉏鉠鉧鉯鈶鉡鉰鈱鉔鉣鉐鉲鉎鉓鉌鉖鈲閟閜閞閛隒隓隑隗雎雺雽雸雵靳靷靸靲頏頍頎颬飶飹馯馲馰馵骭骫魛鳪鳭鳧麀黽僦僔僗僨僳僛僪僝僤僓僬僰僯僣僠"],["e140","凘劀劁勩勫匰厬嘧嘕嘌嘒嗼嘏嘜嘁嘓嘂嗺嘝嘄嗿嗹墉塼墐墘墆墁塿塴墋塺墇墑墎塶墂墈塻墔墏壾奫嫜嫮嫥嫕嫪嫚嫭嫫嫳嫢嫠嫛嫬嫞嫝嫙嫨嫟孷寠"],["e1a1","寣屣嶂嶀嵽嶆嵺嶁嵷嶊嶉嶈嵾嵼嶍嵹嵿幘幙幓廘廑廗廎廜廕廙廒廔彄彃彯徶愬愨慁慞慱慳慒慓慲慬憀慴慔慺慛慥愻慪慡慖戩戧戫搫摍摛摝摴摶摲摳摽摵摦撦摎撂摞摜摋摓摠摐摿搿摬摫摙摥摷敳斠暡暠暟朅朄朢榱榶槉"],["e240","榠槎榖榰榬榼榑榙榎榧榍榩榾榯榿槄榽榤槔榹槊榚槏榳榓榪榡榞槙榗榐槂榵榥槆歊歍歋殞殟殠毃毄毾滎滵滱漃漥滸漷滻漮漉潎漙漚漧漘漻漒滭漊"],["e2a1","漶潳滹滮漭潀漰漼漵滫漇漎潃漅滽滶漹漜滼漺漟漍漞漈漡熇熐熉熀熅熂熏煻熆熁熗牄牓犗犕犓獃獍獑獌瑢瑳瑱瑵瑲瑧瑮甀甂甃畽疐瘖瘈瘌瘕瘑瘊瘔皸瞁睼瞅瞂睮瞀睯睾瞃碲碪碴碭碨硾碫碞碥碠碬碢碤禘禊禋禖禕禔禓"],["e340","禗禈禒禐稫穊稰稯稨稦窨窫窬竮箈箜箊箑箐箖箍箌箛箎箅箘劄箙箤箂粻粿粼粺綧綷緂綣綪緁緀緅綝緎緄緆緋緌綯綹綖綼綟綦綮綩綡緉罳翢翣翥翞"],["e3a1","耤聝聜膉膆膃膇膍膌膋舕蒗蒤蒡蒟蒺蓎蓂蒬蒮蒫蒹蒴蓁蓍蒪蒚蒱蓐蒝蒧蒻蒢蒔蓇蓌蒛蒩蒯蒨蓖蒘蒶蓏蒠蓗蓔蓒蓛蒰蒑虡蜳蜣蜨蝫蝀蜮蜞蜡蜙蜛蝃蜬蝁蜾蝆蜠蜲蜪蜭蜼蜒蜺蜱蜵蝂蜦蜧蜸蜤蜚蜰蜑裷裧裱裲裺裾裮裼裶裻"],["e440","裰裬裫覝覡覟覞觩觫觨誫誙誋誒誏誖谽豨豩賕賏賗趖踉踂跿踍跽踊踃踇踆踅跾踀踄輐輑輎輍鄣鄜鄠鄢鄟鄝鄚鄤鄡鄛酺酲酹酳銥銤鉶銛鉺銠銔銪銍"],["e4a1","銦銚銫鉹銗鉿銣鋮銎銂銕銢鉽銈銡銊銆銌銙銧鉾銇銩銝銋鈭隞隡雿靘靽靺靾鞃鞀鞂靻鞄鞁靿韎韍頖颭颮餂餀餇馝馜駃馹馻馺駂馽駇骱髣髧鬾鬿魠魡魟鳱鳲鳵麧僿儃儰僸儆儇僶僾儋儌僽儊劋劌勱勯噈噂噌嘵噁噊噉噆噘"],["e540","噚噀嘳嘽嘬嘾嘸嘪嘺圚墫墝墱墠墣墯墬墥墡壿嫿嫴嫽嫷嫶嬃嫸嬂嫹嬁嬇嬅嬏屧嶙嶗嶟嶒嶢嶓嶕嶠嶜嶡嶚嶞幩幝幠幜緳廛廞廡彉徲憋憃慹憱憰憢憉"],["e5a1","憛憓憯憭憟憒憪憡憍慦憳戭摮摰撖撠撅撗撜撏撋撊撌撣撟摨撱撘敶敺敹敻斲斳暵暰暩暲暷暪暯樀樆樗槥槸樕槱槤樠槿槬槢樛樝槾樧槲槮樔槷槧橀樈槦槻樍槼槫樉樄樘樥樏槶樦樇槴樖歑殥殣殢殦氁氀毿氂潁漦潾澇濆澒"],["e640","澍澉澌潢潏澅潚澖潶潬澂潕潲潒潐潗澔澓潝漀潡潫潽潧澐潓澋潩潿澕潣潷潪潻熲熯熛熰熠熚熩熵熝熥熞熤熡熪熜熧熳犘犚獘獒獞獟獠獝獛獡獚獙"],["e6a1","獢璇璉璊璆璁瑽璅璈瑼瑹甈甇畾瘥瘞瘙瘝瘜瘣瘚瘨瘛皜皝皞皛瞍瞏瞉瞈磍碻磏磌磑磎磔磈磃磄磉禚禡禠禜禢禛歶稹窲窴窳箷篋箾箬篎箯箹篊箵糅糈糌糋緷緛緪緧緗緡縃緺緦緶緱緰緮緟罶羬羰羭翭翫翪翬翦翨聤聧膣膟"],["e740","膞膕膢膙膗舖艏艓艒艐艎艑蔤蔻蔏蔀蔩蔎蔉蔍蔟蔊蔧蔜蓻蔫蓺蔈蔌蓴蔪蓲蔕蓷蓫蓳蓼蔒蓪蓩蔖蓾蔨蔝蔮蔂蓽蔞蓶蔱蔦蓧蓨蓰蓯蓹蔘蔠蔰蔋蔙蔯虢"],["e7a1","蝖蝣蝤蝷蟡蝳蝘蝔蝛蝒蝡蝚蝑蝞蝭蝪蝐蝎蝟蝝蝯蝬蝺蝮蝜蝥蝏蝻蝵蝢蝧蝩衚褅褌褔褋褗褘褙褆褖褑褎褉覢覤覣觭觰觬諏諆誸諓諑諔諕誻諗誾諀諅諘諃誺誽諙谾豍貏賥賟賙賨賚賝賧趠趜趡趛踠踣踥踤踮踕踛踖踑踙踦踧"],["e840","踔踒踘踓踜踗踚輬輤輘輚輠輣輖輗遳遰遯遧遫鄯鄫鄩鄪鄲鄦鄮醅醆醊醁醂醄醀鋐鋃鋄鋀鋙銶鋏鋱鋟鋘鋩鋗鋝鋌鋯鋂鋨鋊鋈鋎鋦鋍鋕鋉鋠鋞鋧鋑鋓"],["e8a1","銵鋡鋆銴镼閬閫閮閰隤隢雓霅霈霂靚鞊鞎鞈韐韏頞頝頦頩頨頠頛頧颲餈飺餑餔餖餗餕駜駍駏駓駔駎駉駖駘駋駗駌骳髬髫髳髲髱魆魃魧魴魱魦魶魵魰魨魤魬鳼鳺鳽鳿鳷鴇鴀鳹鳻鴈鴅鴄麃黓鼏鼐儜儓儗儚儑凞匴叡噰噠噮"],["e940","噳噦噣噭噲噞噷圜圛壈墽壉墿墺壂墼壆嬗嬙嬛嬡嬔嬓嬐嬖嬨嬚嬠嬞寯嶬嶱嶩嶧嶵嶰嶮嶪嶨嶲嶭嶯嶴幧幨幦幯廩廧廦廨廥彋徼憝憨憖懅憴懆懁懌憺"],["e9a1","憿憸憌擗擖擐擏擉撽撉擃擛擳擙攳敿敼斢曈暾曀曊曋曏暽暻暺曌朣樴橦橉橧樲橨樾橝橭橶橛橑樨橚樻樿橁橪橤橐橏橔橯橩橠樼橞橖橕橍橎橆歕歔歖殧殪殫毈毇氄氃氆澭濋澣濇澼濎濈潞濄澽澞濊澨瀄澥澮澺澬澪濏澿澸"],["ea40","澢濉澫濍澯澲澰燅燂熿熸燖燀燁燋燔燊燇燏熽燘熼燆燚燛犝犞獩獦獧獬獥獫獪瑿璚璠璔璒璕璡甋疀瘯瘭瘱瘽瘳瘼瘵瘲瘰皻盦瞚瞝瞡瞜瞛瞢瞣瞕瞙"],["eaa1","瞗磝磩磥磪磞磣磛磡磢磭磟磠禤穄穈穇窶窸窵窱窷篞篣篧篝篕篥篚篨篹篔篪篢篜篫篘篟糒糔糗糐糑縒縡縗縌縟縠縓縎縜縕縚縢縋縏縖縍縔縥縤罃罻罼罺羱翯耪耩聬膱膦膮膹膵膫膰膬膴膲膷膧臲艕艖艗蕖蕅蕫蕍蕓蕡蕘"],["eb40","蕀蕆蕤蕁蕢蕄蕑蕇蕣蔾蕛蕱蕎蕮蕵蕕蕧蕠薌蕦蕝蕔蕥蕬虣虥虤螛螏螗螓螒螈螁螖螘蝹螇螣螅螐螑螝螄螔螜螚螉褞褦褰褭褮褧褱褢褩褣褯褬褟觱諠"],["eba1","諢諲諴諵諝謔諤諟諰諈諞諡諨諿諯諻貑貒貐賵賮賱賰賳赬赮趥趧踳踾踸蹀蹅踶踼踽蹁踰踿躽輶輮輵輲輹輷輴遶遹遻邆郺鄳鄵鄶醓醐醑醍醏錧錞錈錟錆錏鍺錸錼錛錣錒錁鍆錭錎錍鋋錝鋺錥錓鋹鋷錴錂錤鋿錩錹錵錪錔錌"],["ec40","錋鋾錉錀鋻錖閼闍閾閹閺閶閿閵閽隩雔霋霒霐鞙鞗鞔韰韸頵頯頲餤餟餧餩馞駮駬駥駤駰駣駪駩駧骹骿骴骻髶髺髹髷鬳鮀鮅鮇魼魾魻鮂鮓鮒鮐魺鮕"],["eca1","魽鮈鴥鴗鴠鴞鴔鴩鴝鴘鴢鴐鴙鴟麈麆麇麮麭黕黖黺鼒鼽儦儥儢儤儠儩勴嚓嚌嚍嚆嚄嚃噾嚂噿嚁壖壔壏壒嬭嬥嬲嬣嬬嬧嬦嬯嬮孻寱寲嶷幬幪徾徻懃憵憼懧懠懥懤懨懞擯擩擣擫擤擨斁斀斶旚曒檍檖檁檥檉檟檛檡檞檇檓檎"],["ed40","檕檃檨檤檑橿檦檚檅檌檒歛殭氉濌澩濴濔濣濜濭濧濦濞濲濝濢濨燡燱燨燲燤燰燢獳獮獯璗璲璫璐璪璭璱璥璯甐甑甒甏疄癃癈癉癇皤盩瞵瞫瞲瞷瞶"],["eda1","瞴瞱瞨矰磳磽礂磻磼磲礅磹磾礄禫禨穜穛穖穘穔穚窾竀竁簅簏篲簀篿篻簎篴簋篳簂簉簃簁篸篽簆篰篱簐簊糨縭縼繂縳顈縸縪繉繀繇縩繌縰縻縶繄縺罅罿罾罽翴翲耬膻臄臌臊臅臇膼臩艛艚艜薃薀薏薧薕薠薋薣蕻薤薚薞"],["ee40","蕷蕼薉薡蕺蕸蕗薎薖薆薍薙薝薁薢薂薈薅蕹蕶薘薐薟虨螾螪螭蟅螰螬螹螵螼螮蟉蟃蟂蟌螷螯蟄蟊螴螶螿螸螽蟞螲褵褳褼褾襁襒褷襂覭覯覮觲觳謞"],["eea1","謘謖謑謅謋謢謏謒謕謇謍謈謆謜謓謚豏豰豲豱豯貕貔賹赯蹎蹍蹓蹐蹌蹇轃轀邅遾鄸醚醢醛醙醟醡醝醠鎡鎃鎯鍤鍖鍇鍼鍘鍜鍶鍉鍐鍑鍠鍭鎏鍌鍪鍹鍗鍕鍒鍏鍱鍷鍻鍡鍞鍣鍧鎀鍎鍙闇闀闉闃闅閷隮隰隬霠霟霘霝霙鞚鞡鞜"],["ef40","鞞鞝韕韔韱顁顄顊顉顅顃餥餫餬餪餳餲餯餭餱餰馘馣馡騂駺駴駷駹駸駶駻駽駾駼騃骾髾髽鬁髼魈鮚鮨鮞鮛鮦鮡鮥鮤鮆鮢鮠鮯鴳鵁鵧鴶鴮鴯鴱鴸鴰"],["efa1","鵅鵂鵃鴾鴷鵀鴽翵鴭麊麉麍麰黈黚黻黿鼤鼣鼢齔龠儱儭儮嚘嚜嚗嚚嚝嚙奰嬼屩屪巀幭幮懘懟懭懮懱懪懰懫懖懩擿攄擽擸攁攃擼斔旛曚曛曘櫅檹檽櫡櫆檺檶檷櫇檴檭歞毉氋瀇瀌瀍瀁瀅瀔瀎濿瀀濻瀦濼濷瀊爁燿燹爃燽獶"],["f040","璸瓀璵瓁璾璶璻瓂甔甓癜癤癙癐癓癗癚皦皽盬矂瞺磿礌礓礔礉礐礒礑禭禬穟簜簩簙簠簟簭簝簦簨簢簥簰繜繐繖繣繘繢繟繑繠繗繓羵羳翷翸聵臑臒"],["f0a1","臐艟艞薴藆藀藃藂薳薵薽藇藄薿藋藎藈藅薱薶藒蘤薸薷薾虩蟧蟦蟢蟛蟫蟪蟥蟟蟳蟤蟔蟜蟓蟭蟘蟣螤蟗蟙蠁蟴蟨蟝襓襋襏襌襆襐襑襉謪謧謣謳謰謵譇謯謼謾謱謥謷謦謶謮謤謻謽謺豂豵貙貘貗賾贄贂贀蹜蹢蹠蹗蹖蹞蹥蹧"],["f140","蹛蹚蹡蹝蹩蹔轆轇轈轋鄨鄺鄻鄾醨醥醧醯醪鎵鎌鎒鎷鎛鎝鎉鎧鎎鎪鎞鎦鎕鎈鎙鎟鎍鎱鎑鎲鎤鎨鎴鎣鎥闒闓闑隳雗雚巂雟雘雝霣霢霥鞬鞮鞨鞫鞤鞪"],["f1a1","鞢鞥韗韙韖韘韺顐顑顒颸饁餼餺騏騋騉騍騄騑騊騅騇騆髀髜鬈鬄鬅鬩鬵魊魌魋鯇鯆鯃鮿鯁鮵鮸鯓鮶鯄鮹鮽鵜鵓鵏鵊鵛鵋鵙鵖鵌鵗鵒鵔鵟鵘鵚麎麌黟鼁鼀鼖鼥鼫鼪鼩鼨齌齕儴儵劖勷厴嚫嚭嚦嚧嚪嚬壚壝壛夒嬽嬾嬿巃幰"],["f240","徿懻攇攐攍攉攌攎斄旞旝曞櫧櫠櫌櫑櫙櫋櫟櫜櫐櫫櫏櫍櫞歠殰氌瀙瀧瀠瀖瀫瀡瀢瀣瀩瀗瀤瀜瀪爌爊爇爂爅犥犦犤犣犡瓋瓅璷瓃甖癠矉矊矄矱礝礛"],["f2a1","礡礜礗礞禰穧穨簳簼簹簬簻糬糪繶繵繸繰繷繯繺繲繴繨罋罊羃羆羷翽翾聸臗臕艤艡艣藫藱藭藙藡藨藚藗藬藲藸藘藟藣藜藑藰藦藯藞藢蠀蟺蠃蟶蟷蠉蠌蠋蠆蟼蠈蟿蠊蠂襢襚襛襗襡襜襘襝襙覈覷覶觶譐譈譊譀譓譖譔譋譕"],["f340","譑譂譒譗豃豷豶貚贆贇贉趬趪趭趫蹭蹸蹳蹪蹯蹻軂轒轑轏轐轓辴酀鄿醰醭鏞鏇鏏鏂鏚鏐鏹鏬鏌鏙鎩鏦鏊鏔鏮鏣鏕鏄鏎鏀鏒鏧镽闚闛雡霩霫霬霨霦"],["f3a1","鞳鞷鞶韝韞韟顜顙顝顗颿颽颻颾饈饇饃馦馧騚騕騥騝騤騛騢騠騧騣騞騜騔髂鬋鬊鬎鬌鬷鯪鯫鯠鯞鯤鯦鯢鯰鯔鯗鯬鯜鯙鯥鯕鯡鯚鵷鶁鶊鶄鶈鵱鶀鵸鶆鶋鶌鵽鵫鵴鵵鵰鵩鶅鵳鵻鶂鵯鵹鵿鶇鵨麔麑黀黼鼭齀齁齍齖齗齘匷嚲"],["f440","嚵嚳壣孅巆巇廮廯忀忁懹攗攖攕攓旟曨曣曤櫳櫰櫪櫨櫹櫱櫮櫯瀼瀵瀯瀷瀴瀱灂瀸瀿瀺瀹灀瀻瀳灁爓爔犨獽獼璺皫皪皾盭矌矎矏矍矲礥礣礧礨礤礩"],["f4a1","禲穮穬穭竷籉籈籊籇籅糮繻繾纁纀羺翿聹臛臙舋艨艩蘢藿蘁藾蘛蘀藶蘄蘉蘅蘌藽蠙蠐蠑蠗蠓蠖襣襦覹觷譠譪譝譨譣譥譧譭趮躆躈躄轙轖轗轕轘轚邍酃酁醷醵醲醳鐋鐓鏻鐠鐏鐔鏾鐕鐐鐨鐙鐍鏵鐀鏷鐇鐎鐖鐒鏺鐉鏸鐊鏿"],["f540","鏼鐌鏶鐑鐆闞闠闟霮霯鞹鞻韽韾顠顢顣顟飁飂饐饎饙饌饋饓騲騴騱騬騪騶騩騮騸騭髇髊髆鬐鬒鬑鰋鰈鯷鰅鰒鯸鱀鰇鰎鰆鰗鰔鰉鶟鶙鶤鶝鶒鶘鶐鶛"],["f5a1","鶠鶔鶜鶪鶗鶡鶚鶢鶨鶞鶣鶿鶩鶖鶦鶧麙麛麚黥黤黧黦鼰鼮齛齠齞齝齙龑儺儹劘劗囃嚽嚾孈孇巋巏廱懽攛欂櫼欃櫸欀灃灄灊灈灉灅灆爝爚爙獾甗癪矐礭礱礯籔籓糲纊纇纈纋纆纍罍羻耰臝蘘蘪蘦蘟蘣蘜蘙蘧蘮蘡蘠蘩蘞蘥"],["f640","蠩蠝蠛蠠蠤蠜蠫衊襭襩襮襫觺譹譸譅譺譻贐贔趯躎躌轞轛轝酆酄酅醹鐿鐻鐶鐩鐽鐼鐰鐹鐪鐷鐬鑀鐱闥闤闣霵霺鞿韡顤飉飆飀饘饖騹騽驆驄驂驁騺"],["f6a1","騿髍鬕鬗鬘鬖鬺魒鰫鰝鰜鰬鰣鰨鰩鰤鰡鶷鶶鶼鷁鷇鷊鷏鶾鷅鷃鶻鶵鷎鶹鶺鶬鷈鶱鶭鷌鶳鷍鶲鹺麜黫黮黭鼛鼘鼚鼱齎齥齤龒亹囆囅囋奱孋孌巕巑廲攡攠攦攢欋欈欉氍灕灖灗灒爞爟犩獿瓘瓕瓙瓗癭皭礵禴穰穱籗籜籙籛籚"],["f740","糴糱纑罏羇臞艫蘴蘵蘳蘬蘲蘶蠬蠨蠦蠪蠥襱覿覾觻譾讄讂讆讅譿贕躕躔躚躒躐躖躗轠轢酇鑌鑐鑊鑋鑏鑇鑅鑈鑉鑆霿韣顪顩飋饔饛驎驓驔驌驏驈驊"],["f7a1","驉驒驐髐鬙鬫鬻魖魕鱆鱈鰿鱄鰹鰳鱁鰼鰷鰴鰲鰽鰶鷛鷒鷞鷚鷋鷐鷜鷑鷟鷩鷙鷘鷖鷵鷕鷝麶黰鼵鼳鼲齂齫龕龢儽劙壨壧奲孍巘蠯彏戁戃戄攩攥斖曫欑欒欏毊灛灚爢玂玁玃癰矔籧籦纕艬蘺虀蘹蘼蘱蘻蘾蠰蠲蠮蠳襶襴襳觾"],["f840","讌讎讋讈豅贙躘轤轣醼鑢鑕鑝鑗鑞韄韅頀驖驙鬞鬟鬠鱒鱘鱐鱊鱍鱋鱕鱙鱌鱎鷻鷷鷯鷣鷫鷸鷤鷶鷡鷮鷦鷲鷰鷢鷬鷴鷳鷨鷭黂黐黲黳鼆鼜鼸鼷鼶齃齏"],["f8a1","齱齰齮齯囓囍孎屭攭曭曮欓灟灡灝灠爣瓛瓥矕礸禷禶籪纗羉艭虃蠸蠷蠵衋讔讕躞躟躠躝醾醽釂鑫鑨鑩雥靆靃靇韇韥驞髕魙鱣鱧鱦鱢鱞鱠鸂鷾鸇鸃鸆鸅鸀鸁鸉鷿鷽鸄麠鼞齆齴齵齶囔攮斸欘欙欗欚灢爦犪矘矙礹籩籫糶纚"],["f940","纘纛纙臠臡虆虇虈襹襺襼襻觿讘讙躥躤躣鑮鑭鑯鑱鑳靉顲饟鱨鱮鱭鸋鸍鸐鸏鸒鸑麡黵鼉齇齸齻齺齹圞灦籯蠼趲躦釃鑴鑸鑶鑵驠鱴鱳鱱鱵鸔鸓黶鼊"],["f9a1","龤灨灥糷虪蠾蠽蠿讞貜躩軉靋顳顴飌饡馫驤驦驧鬤鸕鸗齈戇欞爧虌躨钂钀钁驩驨鬮鸙爩虋讟钃鱹麷癵驫鱺鸝灩灪麤齾齉龘碁銹裏墻恒粧嫺╔╦╗╠╬╣╚╩╝╒╤╕╞╪╡╘╧╛╓╥╖╟╫╢╙╨╜║═╭╮╰╯▓"]]

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var stream = __webpack_require__(1);
var util = __webpack_require__(0);
var Transform = stream.Transform;

// expose to the world
module.exports = {
    encode: encode,
    decode: decode,
    wrap: wrap,
    Encoder: Encoder,
    Decoder: Decoder
};

/**
 * Encodes a Buffer into a base64 encoded string
 *
 * @param {Buffer} buffer Buffer to convert
 * @returns {String} base64 encoded string
 */
function encode(buffer) {
    if (typeof buffer === 'string') {
        buffer = new Buffer(buffer, 'utf-8');
    }

    return buffer.toString('base64');
}

/**
 * Decodes a base64 encoded string to a Buffer object
 *
 * @param {String} str base64 encoded string
 * @returns {Buffer} Decoded value
 */
function decode(str) {
    str = (str || '');
    return new Buffer(str, 'base64');
}

/**
 * Adds soft line breaks to a base64 string
 *
 * @param {String} str base64 encoded string that might need line wrapping
 * @param {Number} [lineLength=76] Maximum allowed length for a line
 * @returns {String} Soft-wrapped base64 encoded string
 */
function wrap(str, lineLength) {
    str = (str || '').toString();
    lineLength = lineLength || 76;

    if (str.length <= lineLength) {
        return str;
    }

    return str.replace(new RegExp('.{' + lineLength + '}', 'g'), '$&\r\n').trim();
}

/**
 * Creates a transform stream for encoding data to base64 encoding
 *
 * @constructor
 * @param {Object} options Stream options
 * @param {Number} [options.lineLength=76] Maximum lenght for lines, set to false to disable wrapping
 */
function Encoder(options) {
    // init Transform
    this.options = options || {};

    if (this.options.lineLength !== false) {
        this.options.lineLength = this.options.lineLength || 76;
    }

    this._curLine = '';
    this._remainingBytes = false;

    this.inputBytes = 0;
    this.outputBytes = 0;

    Transform.call(this, this.options);
}
util.inherits(Encoder, Transform);

Encoder.prototype._transform = function(chunk, encoding, done) {
    var b64, _self = this;

    if (encoding !== 'buffer') {
        chunk = new Buffer(chunk, encoding);
    }

    if (!chunk || !chunk.length) {
        return done();
    }

    this.inputBytes += chunk.length;

    if (this._remainingBytes && this._remainingBytes.length) {
        chunk = Buffer.concat([this._remainingBytes, chunk]);
        this._remainingBytes = false;
    }

    if (chunk.length % 3) {
        this._remainingBytes = chunk.slice(chunk.length - chunk.length % 3);
        chunk = chunk.slice(0, chunk.length - chunk.length % 3);
    } else {
        this._remainingBytes = false;
    }

    b64 = this._curLine + encode(chunk);

    if (this.options.lineLength) {
        b64 = wrap(b64, this.options.lineLength);
        b64 = b64.replace(/(^|\n)([^\n]*)$/, function(match, lineBreak, lastLine) {
            _self._curLine = lastLine;
            return lineBreak;
        });
    }

    if (b64) {
        this.outputBytes += b64.length;
        this.push(b64);
    }

    done();
};

Encoder.prototype._flush = function(done) {
    if (this._remainingBytes && this._remainingBytes.length) {
        this._curLine += encode(this._remainingBytes);
    }
    if (this._curLine) {
        this._curLine = wrap(this._curLine, this.options.lineLength);
        this.outputBytes += this._curLine.length;
        this.push(this._curLine, 'ascii');
        this._curLine = '';
    }
    done();
};

/**
 * Creates a transform stream for decoding base64 encoded strings
 *
 * @constructor
 * @param {Object} options Stream options
 */
function Decoder(options) {
    // init Transform
    this.options = options || {};
    this._curLine = '';

    this.inputBytes = 0;
    this.outputBytes = 0;

    Transform.call(this, this.options);
}
util.inherits(Decoder, Transform);

Decoder.prototype._transform = function(chunk, encoding, done) {
    var b64, buf;

    chunk = chunk.toString('ascii');

    if (!chunk || !chunk.length) {
        return done();
    }

    this.inputBytes += chunk.length;

    b64 = (this._curLine + chunk);
    this._curLine = '';

    b64 = b64.replace(/[^a-zA-Z0-9+\/=]/g, '');

    if (b64.length % 4) {
        this._curLine = b64.substr(-b64.length % 4);
        if (this._curLine.length == b64.length) {
            b64 = '';
        } else {
            b64 = b64.substr(0, this._curLine.length);
        }
    }

    if (b64) {
        buf = decode(b64);
        this.outputBytes += buf.length;
        this.push(buf);
    }

    done();
};

Decoder.prototype._flush = function(done) {
    var b64, buf;
    if (this._curLine) {
        buf = decode(this._curLine);
        this.outputBytes += buf.length;
        this.push(buf);
        this._curLine = '';
    }
    done();
};

/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var stream = __webpack_require__(1);
var util = __webpack_require__(0);
var Transform = stream.Transform;

// expose to the world
module.exports = {
    encode: encode,
    decode: decode,
    wrap: wrap,
    Encoder: Encoder,
    Decoder: Decoder
};

/**
 * Encodes a Buffer into a Quoted-Printable encoded string
 *
 * @param {Buffer} buffer Buffer to convert
 * @returns {String} Quoted-Printable encoded string
 */
function encode(buffer) {
    if (typeof buffer === 'string') {
        buffer = new Buffer(buffer, 'utf-8');
    }

    // usable characters that do not need encoding
    var ranges = [
        // https://tools.ietf.org/html/rfc2045#section-6.7
        [0x09], // <TAB>
        [0x0A], // <LF>
        [0x0D], // <CR>
        [0x20, 0x3C], // <SP>!"#$%&'()*+,-./0123456789:;
        [0x3E, 0x7E] // >?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\]^_`abcdefghijklmnopqrstuvwxyz{|}
    ];
    var result = '';
    var ord;

    for (var i = 0, len = buffer.length; i < len; i++) {
        ord = buffer[i];
        // if the char is in allowed range, then keep as is, unless it is a ws in the end of a line
        if (checkRanges(ord, ranges) && !((ord === 0x20 || ord === 0x09) && (i === len - 1 || buffer[i + 1] === 0x0a || buffer[i + 1] === 0x0d))) {
            result += String.fromCharCode(ord);
            continue;
        }
        result += '=' + (ord < 0x10 ? '0' : '') + ord.toString(16).toUpperCase();
    }

    return result;
}

/**
 * Decodes a Quoted-Printable encoded string to a Buffer object
 *
 * @param {String} str Quoted-Printable encoded string
 * @returns {Buffer} Decoded value
 */
function decode(str) {
    str = (str || '').toString().
        // remove invalid whitespace from the end of lines
    replace(/[\t ]+$/gm, '').
        // remove soft line breaks
    replace(/\=(?:\r?\n|$)/g, '');

    var encodedBytesCount = (str.match(/\=[\da-fA-F]{2}/g) || []).length,
        bufferLength = str.length - encodedBytesCount * 2,
        chr, hex,
        buffer = new Buffer(bufferLength),
        bufferPos = 0;

    for (var i = 0, len = str.length; i < len; i++) {
        chr = str.charAt(i);
        if (chr === '=' && (hex = str.substr(i + 1, 2)) && /[\da-fA-F]{2}/.test(hex)) {
            buffer[bufferPos++] = parseInt(hex, 16);
            i += 2;
            continue;
        }
        buffer[bufferPos++] = chr.charCodeAt(0);
    }

    return buffer;
}

/**
 * Adds soft line breaks to a Quoted-Printable string
 *
 * @param {String} str Quoted-Printable encoded string that might need line wrapping
 * @param {Number} [lineLength=76] Maximum allowed length for a line
 * @returns {String} Soft-wrapped Quoted-Printable encoded string
 */
function wrap(str, lineLength) {
    str = (str || '').toString();
    lineLength = lineLength || 76;

    if (str.length <= lineLength) {
        return str;
    }

    var pos = 0,
        len = str.length,
        match, code, line,
        lineMargin = Math.floor(lineLength / 3),
        result = '';

    // insert soft linebreaks where needed
    while (pos < len) {
        line = str.substr(pos, lineLength);
        if ((match = line.match(/\r\n/))) {
            line = line.substr(0, match.index + match[0].length);
            result += line;
            pos += line.length;
            continue;
        }

        if (line.substr(-1) === '\n') {
            // nothing to change here
            result += line;
            pos += line.length;
            continue;
        } else if ((match = line.substr(-lineMargin).match(/\n.*?$/))) {
            // truncate to nearest line break
            line = line.substr(0, line.length - (match[0].length - 1));
            result += line;
            pos += line.length;
            continue;
        } else if (line.length > lineLength - lineMargin && (match = line.substr(-lineMargin).match(/[ \t\.,!\?][^ \t\.,!\?]*$/))) {
            // truncate to nearest space
            line = line.substr(0, line.length - (match[0].length - 1));
        } else {
            if (line.match(/\=[\da-f]{0,2}$/i)) {

                // push incomplete encoding sequences to the next line
                if ((match = line.match(/\=[\da-f]{0,1}$/i))) {
                    line = line.substr(0, line.length - match[0].length);
                }

                // ensure that utf-8 sequences are not split
                while (line.length > 3 && line.length < len - pos && !line.match(/^(?:=[\da-f]{2}){1,4}$/i) && (match = line.match(/\=[\da-f]{2}$/ig))) {
                    code = parseInt(match[0].substr(1, 2), 16);
                    if (code < 128) {
                        break;
                    }

                    line = line.substr(0, line.length - 3);

                    if (code >= 0xC0) {
                        break;
                    }
                }
            }
        }

        if (pos + line.length < len && line.substr(-1) !== '\n') {
            if (line.length === lineLength && line.match(/\=[\da-f]{2}$/i)) {
                line = line.substr(0, line.length - 3);
            } else if (line.length === lineLength) {
                line = line.substr(0, line.length - 1);
            }
            pos += line.length;
            line += '=\r\n';
        } else {
            pos += line.length;
        }

        result += line;
    }

    return result;
}

/**
 * Helper function to check if a number is inside provided ranges
 *
 * @param {Number} nr Number to check for
 * @param {Array} ranges An Array of allowed values
 * @returns {Boolean} True if the value was found inside allowed ranges, false otherwise
 */
function checkRanges(nr, ranges) {
    for (var i = ranges.length - 1; i >= 0; i--) {
        if (!ranges[i].length) {
            continue;
        }
        if (ranges[i].length === 1 && nr === ranges[i][0]) {
            return true;
        }
        if (ranges[i].length === 2 && nr >= ranges[i][0] && nr <= ranges[i][1]) {
            return true;
        }
    }
    return false;
}

/**
 * Creates a transform stream for encoding data to Quoted-Printable encoding
 *
 * @constructor
 * @param {Object} options Stream options
 * @param {Number} [options.lineLength=76] Maximum lenght for lines, set to false to disable wrapping
 */
function Encoder(options) {
    // init Transform
    this.options = options || {};

    if (this.options.lineLength !== false) {
        this.options.lineLength = this.options.lineLength || 76;
    }

    this._curLine = '';

    this.inputBytes = 0;
    this.outputBytes = 0;

    Transform.call(this, this.options);
}
util.inherits(Encoder, Transform);

Encoder.prototype._transform = function(chunk, encoding, done) {
    var qp, _self = this;

    if (encoding !== 'buffer') {
        chunk = new Buffer(chunk, encoding);
    }

    if (!chunk || !chunk.length) {
        return done();
    }

    this.inputBytes += chunk.length;

    if (this.options.lineLength) {
        qp = this._curLine + encode(chunk);
        qp = wrap(qp, this.options.lineLength);
        qp = qp.replace(/(^|\n)([^\n]*)$/, function(match, lineBreak, lastLine) {
            _self._curLine = lastLine;
            return lineBreak;
        });

        if (qp) {
            this.outputBytes += qp.length;
            this.push(qp);
        }

    } else {
        qp = encode(chunk);
        this.outputBytes += qp.length;
        this.push(qp, 'ascii');
    }

    done();
};

Encoder.prototype._flush = function(done) {
    if (this._curLine) {
        this.outputBytes += this._curLine.length;
        this.push(this._curLine, 'ascii');
    }
    done();
};

/**
 * Creates a transform stream for decoding Quoted-Printable encoded strings
 *
 * @constructor
 * @param {Object} options Stream options
 */
function Decoder(options) {
    // init Transform
    this.options = options || {};
    this._curLine = '';

    this.inputBytes = 0;
    this.outputBytes = 0;

    Transform.call(this, this.options);
}
util.inherits(Decoder, Transform);

Decoder.prototype._transform = function(chunk, encoding, done) {
    var qp, buf, _self = this;

    chunk = chunk.toString('ascii');

    if (!chunk || !chunk.length) {
        return done();
    }

    this.inputBytes += chunk.length;

    qp = (this._curLine + chunk);
    this._curLine = '';
    qp = qp.replace(/=[^\n]?$/, function(lastLine) {
        _self._curLine = lastLine;
        return '';
    });

    if (qp) {
        buf = decode(qp);
        this.outputBytes += buf.length;
        this.push(buf);
    }

    done();
};

Decoder.prototype._flush = function(done) {
    var qp, buf;
    if (this._curLine) {
        buf = decode(this._curLine);
        this.outputBytes += buf.length;
        this.push(buf);
    }
    done();
};

/***/ }),
/* 17 */
/***/ (function(module, exports) {

module.exports = require("fs");

/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var http = __webpack_require__(50);
var https = __webpack_require__(51);
var urllib = __webpack_require__(4);
var zlib = __webpack_require__(52);
var PassThrough = __webpack_require__(1).PassThrough;
var Cookies = __webpack_require__(53);

var MAX_REDIRECTS = 5;

module.exports = function (url, options) {
    return fetch(url, options);
};

module.exports.Cookies = Cookies;

function fetch(url, options) {
    options = options || {};

    options.fetchRes = options.fetchRes || new PassThrough();
    options.cookies = options.cookies || new Cookies();
    options.redirects = options.redirects || 0;
    options.maxRedirects = isNaN(options.maxRedirects) ? MAX_REDIRECTS : options.maxRedirects;

    if (options.cookie) {
        [].concat(options.cookie || []).forEach(function (cookie) {
            options.cookies.set(cookie, url);
        });
        options.cookie = false;
    }

    var fetchRes = options.fetchRes;
    var parsed = urllib.parse(url);
    var method = (options.method || '').toString().trim().toUpperCase() || 'GET';
    var finished = false;
    var cookies;
    var body;

    var handler = parsed.protocol === 'https:' ? https : http;

    var headers = {
        'accept-encoding': 'gzip,deflate'
    };

    Object.keys(options.headers || {}).forEach(function (key) {
        headers[key.toLowerCase().trim()] = options.headers[key];
    });

    if (options.userAgent) {
        headers['User-Agent'] = options.userAgent;
    }

    if (parsed.auth) {
        headers.Authorization = 'Basic ' + new Buffer(parsed.auth).toString('base64');
    }

    if ((cookies = options.cookies.get(url))) {
        headers.cookie = cookies;
    }

    if (options.body) {
        if (options.contentType !== false) {
            headers['Content-Type'] = options.contentType || 'application/x-www-form-urlencoded';
        }

        if (typeof options.body.pipe === 'function') {
            // it's a stream
            headers['Transfer-Encoding'] = 'chunked';
            body = options.body;
            body.on('error', function (err) {
                if (finished) {
                    return;
                }
                finished = true;
                fetchRes.emit('error', err);
            });
        } else {
            if (options.body instanceof Buffer) {
                body = options.body;
            } else if (typeof options.body === 'object') {
                body = new Buffer(Object.keys(options.body).map(function (key) {
                    var value = options.body[key].toString().trim();
                    return encodeURIComponent(key) + '=' + encodeURIComponent(value);
                }).join('&'));
            } else {
                body = new Buffer(options.body.toString().trim());
            }

            headers['Content-Type'] = options.contentType || 'application/x-www-form-urlencoded';
            headers['Content-Length'] = body.length;
        }
        // if method is not provided, use POST instead of GET
        method = (options.method || '').toString().trim().toUpperCase() || 'POST';
    }

    var req;
    var reqOptions = {
        method: method,
        host: parsed.hostname,
        path: parsed.path,
        port: parsed.port ? parsed.port : (parsed.protocol === 'https:' ? 443 : 80),
        headers: headers,
        rejectUnauthorized: false,
        agent: false
    };

    if (options.tls) {
        Object.keys(options.tls).forEach(function (key) {
            reqOptions[key] = options.tls[key];
        });
    }

    try {
        req = handler.request(reqOptions);
    } catch (E) {
        finished = true;
        setImmediate(function () {
            fetchRes.emit('error', E);
        });
        return fetchRes;
    }

    if (options.timeout) {
        req.setTimeout(options.timeout, function () {
            if (finished) {
                return;
            }
            finished = true;
            req.abort();
            fetchRes.emit('error', new Error('Request Tiemout'));
        });
    }

    req.on('error', function (err) {
        if (finished) {
            return;
        }
        finished = true;
        fetchRes.emit('error', err);
    });

    req.on('response', function (res) {
        var inflate;

        if (finished) {
            return;
        }

        switch (res.headers['content-encoding']) {
            case 'gzip':
            case 'deflate':
                inflate = zlib.createUnzip();
                break;
        }

        if (res.headers['set-cookie']) {
            [].concat(res.headers['set-cookie'] || []).forEach(function (cookie) {
                options.cookies.set(cookie, url);
            });
        }

        if ([301, 302, 303, 307, 308].indexOf(res.statusCode) >= 0 && res.headers.location) {
            // redirect
            options.redirects++;
            if (options.redirects > options.maxRedirects) {
                finished = true;
                fetchRes.emit('error', new Error('Maximum redirect count exceeded'));
                req.abort();
                return;
            }
            return fetch(urllib.resolve(url, res.headers.location), options);
        }

        if (res.statusCode >= 300) {
            finished = true;
            fetchRes.emit('error', new Error('Invalid status code ' + res.statusCode));
            req.abort();
            return;
        }

        res.on('error', function (err) {
            if (finished) {
                return;
            }
            finished = true;
            fetchRes.emit('error', err);
            req.abort();
        });

        if (inflate) {
            res.pipe(inflate).pipe(fetchRes);
            inflate.on('error', function (err) {
                if (finished) {
                    return;
                }
                finished = true;
                fetchRes.emit('error', err);
                req.abort();
            });
        } else {
            res.pipe(fetchRes);
        }
    });

    setImmediate(function () {
        if (body) {
            try {
                if (typeof body.pipe === 'function') {
                    return body.pipe(req);
                } else {
                    req.write(body);
                }
            } catch (err) {
                finished = true;
                fetchRes.emit('error', err);
                return;
            }
        }
        req.end();
    });

    return fetchRes;
}


/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var services = __webpack_require__(63);
var normalized = {};

Object.keys(services).forEach(function(key) {
    var service = services[key];

    normalized[normalizeKey(key)] = normalizeService(service);

    [].concat(service.aliases || []).forEach(function(alias) {
        normalized[normalizeKey(alias)] = normalizeService(service);
    });

    [].concat(service.domains || []).forEach(function(domain) {
        normalized[normalizeKey(domain)] = normalizeService(service);
    });
});

function normalizeKey(key) {
    return key.replace(/[^a-zA-Z0-9.\-]/g, '').toLowerCase();
}

function normalizeService(service) {
    var filter = ['domains', 'aliases'];
    var response = {};

    Object.keys(service).forEach(function(key) {
        if (filter.indexOf(key) < 0) {
            response[key] = service[key];
        }
    });

    return response;
}

/**
 * Resolves SMTP config for given key. Key can be a name (like 'Gmail'), alias (like 'Google Mail') or
 * an email address (like 'test@googlemail.com').
 *
 * @param {String} key [description]
 * @returns {Object} SMTP config or false if not found
 */
module.exports = function(key) {
    key = normalizeKey(key.split('@').pop());
    return normalized[key] || false;
};

/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = assign;

/**
 * Copies properties from source objects to target objects
 */
function assign( /* target, ... sources */ ) {
    var args = Array.prototype.slice.call(arguments);
    var target = args.shift() || {};

    args.forEach(function (source) {
        Object.keys(source || {}).forEach(function (key) {
            if (['tls', 'auth'].indexOf(key) >= 0 && source[key] && typeof source[key] === 'object') {
                // tls and auth are special keys that need to be enumerated separately
                // other objects are passed as is
                if (!target[key]) {
                    // esnure that target has this key
                    target[key] = {};
                }
                Object.keys(source[key]).forEach(function (subKey) {
                    target[key][subKey] = source[key][subKey];
                });
            } else {
                target[key] = source[key];
            }
        });
    });
    return target;
}


/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

var net = __webpack_require__(7);
var ip = __webpack_require__(71);
var SmartBuffer = __webpack_require__(72);

(function () {

    var COMMAND = {
        Connect: 0x01,
        Bind: 0x02,
        Associate: 0x03
    };

    var SOCKS4_RESPONSE = {
        Granted: 0x5A,
        Failed: 0x5B,
        Rejected: 0x5C,
        RejectedIdent: 0x5D
    };

    var SOCKS5_AUTH = {
        NoAuth: 0x00,
        GSSApi: 0x01,
        UserPass: 0x02
    };

    var SOCKS5_RESPONSE = {
        Granted: 0x00,
        Failure: 0x01,
        NotAllowed: 0x02,
        NetworkUnreachable: 0x03,
        HostUnreachable: 0x04,
        ConnectionRefused: 0x05,
        TTLExpired: 0x06,
        CommandNotSupported: 0x07,
        AddressNotSupported: 0x08
    };


    exports.createConnection = function (options, callback) {
        var socket = new net.Socket(), finished = false, buff = new SmartBuffer();

        // Defaults
        options.timeout = options.timeout || 10000;
        options.proxy.command = commandFromString(options.proxy.command);
        options.proxy.userid = options.proxy.userid || "";

        var auth = options.proxy.authentication || {};
        auth.username = auth.username || "";
        auth.password = auth.password || "";

        options.proxy.authentication = auth;

        // Connect & negotiation timeout
        function onTimeout() {
            finish(new Error("Connection Timed Out"), socket, null, callback);
        }
        socket.setTimeout(options.timeout, onTimeout);

        // Socket events
        socket.once('close', function () {
            finish(new Error("Socket Closed"), socket, null, callback);
        });

        socket.once('error', function (err) {
        });

        socket.once('connect', function () {
            if (options.proxy.type === 4) {
                negotiateSocks4(options, socket, callback);
            } else if (options.proxy.type === 5) {
                negotiateSocks5(options, socket, callback);
            } else {
                throw new Error("Please specify a proxy type in options.proxy.type");
            }
        });

        socket.connect(options.proxy.port, options.proxy.ipaddress);


        // 4/4a  (connect, bind) - Supports domains & ipaddress
        function negotiateSocks4(options, socket, callback) {
            buff.writeUInt8(0x04);
            buff.writeUInt8(options.proxy.command);
            buff.writeUInt16BE(options.target.port);

            // ipv4 or domain?
            if (net.isIPv4(options.target.host)) {
                buff.writeBuffer(ip.toBuffer(options.target.host));
                buff.writeStringNT(options.proxy.userid);
            } else {
                buff.writeUInt8(0x00);
                buff.writeUInt8(0x00);
                buff.writeUInt8(0x00);
                buff.writeUInt8(0x01);
                buff.writeStringNT(options.proxy.userid);
                buff.writeStringNT(options.target.host);
            }

            socket.once('data', receivedResponse);
            socket.write(buff.toBuffer());

            function receivedResponse(data) {
                socket.pause();
                if (data.length === 8 && data[1] === SOCKS4_RESPONSE.Granted) {

                    if (options.proxy.command === COMMAND.Bind) {
                        buff.clear();
                        buff.writeBuffer(data);
                        buff.skip(2);

                        var info = {
                            port: buff.readUInt16BE(),
                            host: buff.readUInt32BE()
                        };

                        if (info.host === 0) {
                            info.host = options.proxy.ipaddress;
                        } else {
                            info.host = ip.fromLong(info.host);
                        }

                        finish(null, socket, info, callback);
                    } else {
                        finish(null, socket, null, callback);
                    }

                } else {
                    finish(new Error("Rejected (" + data[1] + ")"), socket, null, callback);
                }
            }
        }

        // Socks 5 (connect, bind, associate) - Supports domains and ipv4, ipv6.
        function negotiateSocks5(options, socket, callback) {
            buff.writeUInt8(0x05);
            buff.writeUInt8(2);
            buff.writeUInt8(SOCKS5_AUTH.NoAuth);
            buff.writeUInt8(SOCKS5_AUTH.UserPass);

            socket.once('data', handshake);
            socket.write(buff.toBuffer());

            function handshake(data) {
                if (data.length !== 2) {
                    finish(new Error("Negotiation Error"), socket, null, callback);
                } else if (data[0] !== 0x05) {
                    finish(new Error("Negotiation Error (invalid version)"), socket, null, callback);
                } else if (data[1] === 0xFF) {
                    finish(new Error("Negotiation Error (unacceptable authentication)"), socket, null, callback);
                } else {
                    if (data[1] === SOCKS5_AUTH.NoAuth) {
                        sendRequest();
                    } else if (data[1] === SOCKS5_AUTH.UserPass) {
                        sendAuthentication(options.proxy.authentication);
                    } else {
                        finish(new Error("Negotiation Error (unknown authentication type)"), socket, null, callback);
                    }
                }
            }

            function sendAuthentication(authinfo) {
                buff.clear();
                buff.writeUInt8(0x01);
                buff.writeUInt8(Buffer.byteLength(authinfo.username));
                buff.writeString(authinfo.username);
                buff.writeUInt8(Buffer.byteLength(authinfo.password));
                buff.writeString(authinfo.password);

                socket.once('data', authenticationResponse);
                socket.write(buff.toBuffer());

                function authenticationResponse(data) {
                    if (data.length === 2 && data[1] === 0x00) {
                        sendRequest();
                    } else {
                        finish(new Error("Negotiation Error (authentication failed)"), socket, null, callback);
                    }
                }
            }

            function sendRequest() {
                buff.clear();
                buff.writeUInt8(0x05);
                buff.writeUInt8(options.proxy.command);
                buff.writeUInt8(0x00);

                // ipv4, ipv6, domain?
                if (net.isIPv4(options.target.host)) {
                    buff.writeUInt8(0x01);
                    buff.writeBuffer(ip.toBuffer(options.target.host));
                } else if (net.isIPv6(options.target.host)) {
                    buff.writeUInt8(0x04);
                    buff.writeBuffer(ip.toBuffer(options.target.host));
                } else {
                    buff.writeUInt8(0x03);
                    buff.writeUInt8(options.target.host.length);
                    buff.writeString(options.target.host);
                }
                buff.writeUInt16BE(options.target.port);

                socket.once('data', receivedResponse);
                socket.write(buff.toBuffer());
            }

            function receivedResponse(data) {
                socket.pause();
                if (data.length < 4) {
                    finish(new Error("Negotiation Error"), socket, null, callback);
                } else if (data[0] === 0x05 && data[1] === SOCKS5_RESPONSE.Granted) {
                    if (options.proxy.command === COMMAND.Connect) {
                        finish(null, socket, null, callback);
                    } else if (options.proxy.command === COMMAND.Bind || options.proxy.command === COMMAND.Associate) {
                        buff.clear();
                        buff.writeBuffer(data);
                        buff.skip(3);

                        var info = {};
                        var addrtype = buff.readUInt8();

                        try {

                            if (addrtype === 0x01) {
                                info.host = buff.readUInt32BE();
                                if (info.host === 0)
                                    info.host = options.proxy.ipaddress;
                                else
                                    info.host = ip.fromLong(info.host);
                            } else if (addrtype === 0x03) {
                                var len = buff.readUInt8();
                                info.host = buff.readString(len);
                            } else if (addrtype === 0x04) {
                                info.host = buff.readBuffer(16);
                            } else {
                                finish(new Error("Negotiation Error (invalid host address)"), socket, null, callback);
                            }
                            info.port = buff.readUInt16BE();

                            finish(null, socket, info, callback);
                        } catch (ex) {
                            finish(new Error("Negotiation Error (missing data)"), socket, null, callback);
                        }
                    }
                } else {
                    finish(new Error("Negotiation Error (" + data[1] + ")"), socket, null, callback);
                }
            }
        }

        function finish(err, socket, info, callback) {
            socket.setTimeout(0, onTimeout);
            if (!finished) {
                finished = true;

                if (buff instanceof SmartBuffer)
                    buff.destroy();

                if (err && socket instanceof net.Socket) {
                    socket.removeAllListeners('close');
                    socket.removeAllListeners('timeout');
                    socket.removeAllListeners('data');
                    socket.destroy();
                    socket = null;
                }

                callback(err, socket, info);
            }
        }

        function commandFromString(str) {
            var result = COMMAND.Connect;

            if (str === "connect") {
                result = COMMAND.Connect;
            } else if (str === 'associate') {
                result = COMMAND.Associate;
            } else if (str === 'bind') {
                result = COMMAND.Bind;
            }

            return result;
        }
    };


    exports.createUDPFrame = function (target, data, frame) {
        var buff = new SmartBuffer();
        buff.writeUInt16BE(0);
        buff.writeUInt8(frame || 0x00);

        if (net.isIPv4(target.host)) {
            buff.writeUInt8(0x01);
            buff.writeUInt32BE(ip.toLong(target.host));
        } else if (net.isIPv6(target.host)) {
            buff.writeUInt8(0x04);
            buff.writeBuffer(ip.toBuffer(target.host));
        } else {
            buff.writeUInt8(0x03);
            buff.writeUInt8(Buffer.byteLength(target.host));
            buff.writeString(target.host);
        }

        buff.writeUInt16BE(target.port);
        buff.writeBuffer(data);
        return buff.toBuffer();
    };
})();


/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _stringify = __webpack_require__(23);

var _stringify2 = _interopRequireDefault(_stringify);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var nodemailer = __webpack_require__(24);
var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

var responseHeaders = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*', // Required for CORS support to work
  'Access-Control-Allow-Credentials': true // Required for cookies, authorization headers with HTTPS
};

module.exports.hello = function (event, context, callback) {
  var response = {
    statusCode: 200,
    body: (0, _stringify2.default)({
      message: 'Go Serverless v1.0! Your function executed successfully!',
      input: event
    })
  };

  callback(null, response);
};

module.exports.sendSdkEmail = function (event, context, callback) {
  var response = {
    statusCode: 200,
    body: (0, _stringify2.default)({
      message: 'This is the send SDK email function',
      input: event
    })
  };

  var parsedBody = event['body'].split("&");

  var nameParse = parsedBody[0].split("=");
  var emailParse = parsedBody[1].split("=");
  var companyParse = parsedBody[2].split("=");
  var websiteParse = parsedBody[3].split("=");
  var storeLinkParse = parsedBody[4].split("=");
  var referParse = parsedBody[5].split("=");
  var messageParse = parsedBody[6].split("=");

  var name = decodeURIComponent(nameParse[1]);
  var email = decodeURIComponent(emailParse[1]);
  var company = decodeURIComponent(companyParse[1]);
  var website = decodeURIComponent(websiteParse[1]);
  var storeLink = decodeURIComponent(storeLinkParse[1]);
  var refer = decodeURIComponent(referParse[1]);
  var message = decodeURIComponent(messageParse[1]);

  var sdkReply = {
    from: '"Excursion" contact@excursion-ar.com',
    to: email,
    subject: 'Beta Registration Confirmation',
    text: 'Thank you for signing up for the Excursion SDK. We will notify you when the beta will be ready to release.\n            - Excursion'
  };
  transporter.sendMail(sdkReply);

  var sdkInfo = {
    from: '"Excursion" contact@excursion-ar.com',
    to: 'contact@excursion-ar.com',
    subject: name + ' wants to sign up for the SDK!',
    text: '\n          Name: ' + name + ',\n          Email: ' + email + ',\n          Company: ' + company + ',\n          Website: ' + website + ',\n          StoreLink: ' + storeLink + ',\n          Referral: ' + refer + ',\n          Message: ' + message
  };

  transporter.sendMail(sdkInfo);

  callback(null, response);
};

module.exports.sendContactEmail = function (event, context, callback) {
  var response = {
    statusCode: 200,
    body: (0, _stringify2.default)({
      message: 'Go Serverless v1.0! Your function executed successfully!',
      input: event
    })
  };

  callback(null, response);

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // callback(null, { message: 'Go Serverless v1.0! Your function executed successfully!', event });
};

module.exports.sendAdEmail = function (event, context, callback) {
  var response = {
    statusCode: 200,
    body: (0, _stringify2.default)({
      message: 'Go Serverless v1.0! Your function executed successfully!',
      input: event
    })
  };

  callback(null, response);

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // callback(null, { message: 'Go Serverless v1.0! Your function executed successfully!', event });
};

/***/ }),
/* 23 */
/***/ (function(module, exports) {

module.exports = require("babel-runtime/core-js/json/stringify");

/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var mailcomposer = __webpack_require__(25);
var EventEmitter = __webpack_require__(2).EventEmitter;
var util = __webpack_require__(0);
var shared = __webpack_require__(3);
var directTransport = __webpack_require__(54);
var smtpTransport = __webpack_require__(61);
var smtpPoolTransport = __webpack_require__(64);
var templateSender = __webpack_require__(67);
var packageData = __webpack_require__(68);
var httpProxy = __webpack_require__(69);
var Socks = __webpack_require__(70);
var urllib = __webpack_require__(4);

// Export createTransport method
module.exports.createTransport = function (transporter, defaults) {
    var urlConfig;
    var options;
    var mailer;
    var proxyUrl;

    // if no transporter configuration is provided use direct as default
    transporter = transporter || directTransport({
        debug: true
    });

    if (
        // provided transporter is a configuration object, not transporter plugin
        (typeof transporter === 'object' && typeof transporter.send !== 'function') ||
        // provided transporter looks like a connection url
        (typeof transporter === 'string' && /^(smtps?|direct):/i.test(transporter))
    ) {

        if ((urlConfig = typeof transporter === 'string' ? transporter : transporter.url)) {
            // parse a configuration URL into configuration options
            options = shared.parseConnectionUrl(urlConfig);
        } else {
            options = transporter;
        }

        if (options.proxy && typeof options.proxy === 'string') {
            proxyUrl = options.proxy;
        }

        if (options.transport && typeof options.transport === 'string') {
            try {
                transporter = !(function webpackMissingModule() { var e = new Error("Cannot find module \".\""); e.code = 'MODULE_NOT_FOUND'; throw e; }())(options);
            } catch (E) {
                // if transporter loader fails, return an error when sending mail
                transporter = {
                    send: function (mail, callback) {
                        var errmsg = 'Requested transport plugin  "nodemailer-' + (options.transport).toLowerCase() + '-transport" could not be initiated';
                        var err = new Error(errmsg);
                        err.code = 'EINIT';
                        setImmediate(function () {
                            return callback(err);
                        });
                    }
                };
            }
        } else if (options.direct) {
            transporter = directTransport(options);
        } else if (options.pool) {
            transporter = smtpPoolTransport(options);
        } else {
            transporter = smtpTransport(options);
        }
    }

    mailer = new Nodemailer(transporter, options, defaults);

    if (proxyUrl) {
        setupProxy(mailer, proxyUrl);
    }

    return mailer;
};

/**
 * Sets up proxy handler for a Nodemailer object
 *
 * @param {Object} mailer Nodemailer instance to modify
 * @param {String} proxyUrl Proxy configuration url
 */
function setupProxy(mailer, proxyUrl) {
    var proxy = urllib.parse(proxyUrl);

    // setup socket handler for the mailer object
    mailer.getSocket = function (options, callback) {
        switch (proxy.protocol) {

            // Connect using a HTTP CONNECT method
            case 'http:':
            case 'https:':
                httpProxy(proxy.href, options.port, options.host, function (err, socket) {
                    if (err) {
                        return callback(err);
                    }
                    return callback(null, {
                        connection: socket
                    });
                });
                return;

                // Connect using a SOCKS4/5 proxy
            case 'socks:':
            case 'socks5:':
            case 'socks4:':
            case 'socks4a:':
                Socks.createConnection({
                    proxy: {
                        ipaddress: proxy.hostname,
                        port: proxy.port,
                        type: Number(proxy.protocol.replace(/\D/g, '')) || 5
                    },
                    target: {
                        host: options.host,
                        port: options.port
                    },
                    command: 'connect',
                    authentication: !proxy.auth ? false : {
                        username: decodeURIComponent(proxy.auth.split(':').shift()),
                        password: decodeURIComponent(proxy.auth.split(':').pop())
                    }
                }, function (err, socket) {
                    if (err) {
                        return callback(err);
                    }
                    return callback(null, {
                        connection: socket
                    });
                });
                return;
        }

        callback(new Error('Unknown proxy configuration'));
    };
}

/**
 * Creates an object for exposing the Nodemailer API
 *
 * @constructor
 * @param {Object} transporter Transport object instance to pass the mails to
 */
function Nodemailer(transporter, options, defaults) {
    EventEmitter.call(this);

    this._options = options || {};

    this._defaults = defaults || {};

    this._plugins = {
        compile: [],
        stream: []
    };

    this.transporter = transporter;
    this.logger = this.transporter.logger || shared.getLogger({
        logger: false
    });

    // setup emit handlers for the transporter
    if (typeof transporter.on === 'function') {

        // deprecated log interface
        this.transporter.on('log', function (log) {
            this.logger.debug('%s: %s', log.type, log.message);
        }.bind(this));

        // transporter errors
        this.transporter.on('error', function (err) {
            this.logger.error('Transport Error: %s', err.message);
            this.emit('error', err);
        }.bind(this));

        // indicates if the sender has became idle
        this.transporter.on('idle', function () {
            var args = Array.prototype.slice.call(arguments);
            args.unshift('idle');
            this.emit.apply(this, args);
        }.bind(this));
    }
}
util.inherits(Nodemailer, EventEmitter);

/**
 * Creates a template based sender function
 *
 * @param {Object} templates Object with string values where key is a message field and value is a template
 * @param {Object} defaults Optional default message fields
 * @return {Function} E-mail sender
 */
Nodemailer.prototype.templateSender = function (templates, defaults) {
    return templateSender(this, templates, defaults);
};

Nodemailer.prototype.use = function (step, plugin) {
    step = (step || '').toString();
    if (!this._plugins.hasOwnProperty(step)) {
        this._plugins[step] = [plugin];
    } else {
        this._plugins[step].push(plugin);
    }
};

/**
 * Optional methods passed to the underlying transport object
 */
['close', 'isIdle', 'verify'].forEach(function (method) {
    Nodemailer.prototype[method] = function ( /* possible arguments */ ) {
        var args = Array.prototype.slice.call(arguments);
        if (typeof this.transporter[method] === 'function') {
            return this.transporter[method].apply(this.transporter, args);
        } else {
            return false;
        }
    };
});

/**
 * Sends an email using the preselected transport object
 *
 * @param {Object} data E-data description
 * @param {Function} callback Callback to run once the sending succeeded or failed
 */
Nodemailer.prototype.sendMail = function (data, callback) {
    var promise;

    if (!callback && typeof Promise === 'function') {
        promise = new Promise(function (resolve, reject) {
            callback = shared.callbackPromise(resolve, reject);
        });
    }

    if (typeof this.getSocket === 'function') {
        this.transporter.getSocket = this.getSocket.bind(this);
        this.getSocket = false;
    }

    data = data || {};
    data.headers = data.headers || {};
    callback = callback || function () {};

    // apply defaults
    Object.keys(this._defaults).forEach(function (key) {
        if (!(key in data)) {
            data[key] = this._defaults[key];
        } else if (key === 'headers') {
            // headers is a special case. Allow setting individual default headers
            Object.keys(this._defaults.headers || {}).forEach(function (key) {
                if (!(key in data.headers)) {
                    data.headers[key] = this._defaults.headers[key];
                }
            }.bind(this));
        }
    }.bind(this));

    // force specific keys from transporter options
    ['disableFileAccess', 'disableUrlAccess'].forEach(function (key) {
        if (key in this._options) {
            data[key] = this._options[key];
        }
    }.bind(this));

    var mail = {
        data: data,
        message: null,
        resolveContent: shared.resolveContent
    };

    if (typeof this.transporter === 'string') {
        callback(new Error('Unsupported configuration, downgrade Nodemailer to v0.7.1 to use it'));
        return promise;
    }

    this.logger.info('Sending mail using %s/%s', this.transporter.name, this.transporter.version);

    this._processPlugins('compile', mail, function (err) {
        if (err) {
            this.logger.error('PluginCompile Error: %s', err.message);
            return callback(err);
        }

        mail.message = mailcomposer(mail.data);

        if (mail.data.xMailer !== false) {
            mail.message.setHeader('X-Mailer', mail.data.xMailer || this._getVersionString());
        }

        if (mail.data.priority) {
            switch ((mail.data.priority || '').toString().toLowerCase()) {
                case 'high':
                    mail.message.setHeader('X-Priority', '1 (Highest)');
                    mail.message.setHeader('X-MSMail-Priority', 'High');
                    mail.message.setHeader('Importance', 'High');
                    break;
                case 'low':
                    mail.message.setHeader('X-Priority', '5 (Lowest)');
                    mail.message.setHeader('X-MSMail-Priority', 'Low');
                    mail.message.setHeader('Importance', 'Low');
                    break;
                default:
                    // do not add anything, since all messages are 'Normal' by default
            }
        }

        // add optional List-* headers
        if (mail.data.list && typeof mail.data.list === 'object') {
            this._getListHeaders(mail.data.list).forEach(function (listHeader) {
                listHeader.value.forEach(function (value) {
                    mail.message.addHeader(listHeader.key, value);
                });
            });
        }

        this._processPlugins('stream', mail, function (err) {
            if (err) {
                this.logger.error('PluginStream Error: %s', err.message);
                return callback(err);
            }

            this.transporter.send(mail, function () {
                var args = Array.prototype.slice.call(arguments);
                if (args[0]) {
                    this.logger.error('Send Error: %s', args[0].message);
                }
                callback.apply(null, args);
            }.bind(this));
        }.bind(this));
    }.bind(this));

    return promise;
};

Nodemailer.prototype._getVersionString = function () {
    return util.format(
        '%s (%s; +%s; %s/%s)',
        packageData.name,
        packageData.version,
        packageData.homepage,
        this.transporter.name,
        this.transporter.version
    );
};

Nodemailer.prototype._processPlugins = function (step, mail, callback) {
    step = (step || '').toString();

    if (!this._plugins.hasOwnProperty(step) || !this._plugins[step].length) {
        return callback(null);
    }

    var plugins = Array.prototype.slice.call(this._plugins[step]);

    this.logger.debug('Using %s plugins for %s', plugins.length, step);

    var processPlugins = function () {
        if (!plugins.length) {
            return callback(null);
        }
        var plugin = plugins.shift();
        plugin(mail, function (err) {
            if (err) {
                return callback(err);
            }
            processPlugins();
        });
    }.bind(this);

    processPlugins();
};

/**
 * This method takes list headers structure and converts it into
 * header list with key-value pairs
 *
 * @param {Object} listData Structured List-* headers
 * @return {Array} An array of headers
 */
Nodemailer.prototype._getListHeaders = function (listData) {
    // make sure an url looks like <protocol:url>
    var formatListUrl = function (url) {
        url = url.replace(/[\s<]+|[\s>]+/g, '');
        if (/^(https?|mailto|ftp):/.test(url)) {
            return '<' + url + '>';
        }
        if (/^[^@]+@[^@]+$/.test(url)) {
            return '<mailto:' + url + '>';
        }

        return '<http://' + url + '>';
    };

    return Object.keys(listData).map(function (key) {
        return {
            key: 'list-' + key.toLowerCase().trim(),
            value: [].concat(listData[key] || []).map(function (value) {
                if (typeof value === 'string') {
                    return formatListUrl(value);
                }
                return {
                    prepared: true,
                    value: [].concat(value || []).map(function (value) {
                        if (typeof value === 'string') {
                            return formatListUrl(value);
                        }
                        if (value && value.url) {
                            return formatListUrl(value.url) + (value.comment ? ' (' + value.comment + ')' : '');
                        }
                        return '';
                    }).join(', ')
                };
            })
        };
    });
};


/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var BuildMail = __webpack_require__(26);
var libmime = __webpack_require__(12);

module.exports = function (mail) {
    return new MailComposer(mail).compile();
};

module.exports.MailComposer = MailComposer;

/**
 * Creates the object for composing a BuildMail instance out from the mail options
 *
 * @constructor
 * @param {Object} mail Mail options
 */
function MailComposer(mail) {
    if (!(this instanceof MailComposer)) {
        return new MailComposer(mail);
    }

    this.mail = mail || {};
    this.message = false;
}

/**
 * Builds BuildMail instance
 */
MailComposer.prototype.compile = function () {
    this._alternatives = this.getAlternatives();
    this._htmlNode = this._alternatives.filter(function (alternative) {
        return /^text\/html\b/i.test(alternative.contentType);
    }).pop();
    this._attachments = this.getAttachments(!!this._htmlNode);

    this._useRelated = !!(this._htmlNode && this._attachments.related.length);
    this._useAlternative = this._alternatives.length > 1;
    this._useMixed = this._attachments.attached.length > 1 || (this._alternatives.length && this._attachments.attached.length === 1);

    // Compose MIME tree
    if (this.mail.raw) {
        this.message = new BuildMail().setRaw(this.mail.raw);
    } else if (this._useMixed) {
        this.message = this._createMixed();
    } else if (this._useAlternative) {
        this.message = this._createAlternative();
    } else if (this._useRelated) {
        this.message = this._createRelated();
    } else {
        this.message = this._createContentNode(false, [].concat(this._alternatives || []).concat(this._attachments.attached || []).shift() || {
            contentType: 'text/plain',
            content: ''
        });
    }

    // Add custom headers
    if (this.mail.headers) {
        this.message.addHeader(this.mail.headers);
    }

    // Add headers to the root node, always overrides custom headers
    [
        'from',
        'sender',
        'to',
        'cc',
        'bcc',
        'reply-to',
        'in-reply-to',
        'references',
        'subject',
        'message-id',
        'date'
    ].forEach(function (header) {
        var key = header.replace(/-(\w)/g, function (o, c) {
            return c.toUpperCase();
        });
        if (this.mail[key]) {
            this.message.setHeader(header, this.mail[key]);
        }
    }.bind(this));

    // Sets custom envelope
    if (this.mail.envelope) {
        this.message.setEnvelope(this.mail.envelope);
    }

    // ensure Message-Id value
    this.message.messageId();

    return this.message;
};

/**
 * List all attachments. Resulting attachment objects can be used as input for BuildMail nodes
 *
 * @param {Boolean} findRelated If true separate related attachments from attached ones
 * @returns {Object} An object of arrays (`related` and `attached`)
 */
MailComposer.prototype.getAttachments = function (findRelated) {
    var attachments = [].concat(this.mail.attachments || []).map(function (attachment, i) {
        var data;
        var isMessageNode = /^message\//i.test(attachment.contentType);

        if (/^data:/i.test(attachment.path || attachment.href)) {
            attachment = this._processDataUrl(attachment);
        }

        data = {
            contentType: attachment.contentType ||
                libmime.detectMimeType(attachment.filename || attachment.path || attachment.href || 'bin'),
            contentDisposition: attachment.contentDisposition || (isMessageNode ? 'inline' : 'attachment'),
            contentTransferEncoding: attachment.contentTransferEncoding
        };

        if (attachment.filename) {
            data.filename = attachment.filename;
        } else if (!isMessageNode && attachment.filename !== false) {
            data.filename = (attachment.path || attachment.href || '').split('/').pop() || 'attachment-' + (i + 1);
            if (data.filename.indexOf('.') < 0) {
                data.filename += '.' + libmime.detectExtension(data.contentType);
            }
        }

        if (/^https?:\/\//i.test(attachment.path)) {
            attachment.href = attachment.path;
            attachment.path = undefined;
        }

        if (attachment.cid) {
            data.cid = attachment.cid;
        }

        if (attachment.raw) {
            data.raw = attachment.raw;
        } else if (attachment.path) {
            data.content = {
                path: attachment.path
            };
        } else if (attachment.href) {
            data.content = {
                href: attachment.href
            };
        } else {
            data.content = attachment.content || '';
        }

        if (attachment.encoding) {
            data.encoding = attachment.encoding;
        }

        if (attachment.headers) {
            data.headers = attachment.headers;
        }

        return data;
    }.bind(this));

    if (!findRelated) {
        return {
            attached: attachments,
            related: []
        };
    } else {
        return {
            attached: attachments.filter(function (attachment) {
                return !attachment.cid;
            }),
            related: attachments.filter(function (attachment) {
                return !!attachment.cid;
            })
        };
    }
};

/**
 * List alternatives. Resulting objects can be used as input for BuildMail nodes
 *
 * @returns {Array} An array of alternative elements. Includes the `text` and `html` values as well
 */
MailComposer.prototype.getAlternatives = function () {
    var alternatives = [],
        text, html, watchHtml, icalEvent;

    if (this.mail.text) {
        if (typeof this.mail.text === 'object' && (this.mail.text.content || this.mail.text.path || this.mail.text.href || this.mail.text.raw)) {
            text = this.mail.text;
        } else {
            text = {
                content: this.mail.text
            };
        }
        text.contentType = 'text/plain' + (!text.encoding && libmime.isPlainText(text.content) ? '' : '; charset=utf-8');
    }

    if (this.mail.watchHtml) {
        if (typeof this.mail.watchHtml === 'object' && (this.mail.watchHtml.content || this.mail.watchHtml.path || this.mail.watchHtml.href || this.mail.watchHtml.raw)) {
            watchHtml = this.mail.watchHtml;
        } else {
            watchHtml = {
                content: this.mail.watchHtml
            };
        }
        watchHtml.contentType = 'text/watch-html' + (!watchHtml.encoding && libmime.isPlainText(watchHtml.content) ? '' : '; charset=utf-8');
    }

    if (this.mail.icalEvent) {
        if (typeof this.mail.icalEvent === 'object' && (this.mail.icalEvent.content || this.mail.icalEvent.path || this.mail.icalEvent.href || this.mail.icalEvent.raw)) {
            icalEvent = this.mail.icalEvent;
        } else {
            icalEvent = {
                content: this.mail.icalEvent
            };
        }
        icalEvent.contentType = 'text/calendar; charset="utf-8"; method=' + (icalEvent.method || 'PUBLISH').toString().trim().toUpperCase();
        if (!icalEvent.headers) {
            icalEvent.headers = {};
        }
        icalEvent.headers['Content-Transfer-Encoding'] = 'base64';
    }

    if (this.mail.html) {
        if (typeof this.mail.html === 'object' && (this.mail.html.content || this.mail.html.path || this.mail.html.href || this.mail.html.raw)) {
            html = this.mail.html;
        } else {
            html = {
                content: this.mail.html
            };
        }
        html.contentType = 'text/html' + (!html.encoding && libmime.isPlainText(html.content) ? '' : '; charset=utf-8');
    }

    [].
    concat(text || []).
    concat(watchHtml || []).
    concat(html || []).
    concat(icalEvent || []).
    concat(this.mail.alternatives || []).
    forEach(function (alternative) {
        var data;

        if (/^data:/i.test(alternative.path || alternative.href)) {
            alternative = this._processDataUrl(alternative);
        }

        data = {
            contentType: alternative.contentType ||
                libmime.detectMimeType(alternative.filename || alternative.path || alternative.href || 'txt'),
            contentTransferEncoding: alternative.contentTransferEncoding
        };

        if (alternative.filename) {
            data.filename = alternative.filename;
        }

        if (/^https?:\/\//i.test(alternative.path)) {
            alternative.href = alternative.path;
            alternative.path = undefined;
        }

        if (alternative.raw) {
            data.raw = alternative.raw;
        } else if (alternative.path) {
            data.content = {
                path: alternative.path
            };
        } else if (alternative.href) {
            data.content = {
                href: alternative.href
            };
        } else {
            data.content = alternative.content || '';
        }

        if (alternative.encoding) {
            data.encoding = alternative.encoding;
        }

        if (alternative.headers) {
            data.headers = alternative.headers;
        }

        alternatives.push(data);
    }.bind(this));

    return alternatives;
};

/**
 * Builds multipart/mixed node. It should always contain different type of elements on the same level
 * eg. text + attachments
 *
 * @param {Object} parentNode Parent for this note. If it does not exist, a root node is created
 * @returns {Object} BuildMail node element
 */
MailComposer.prototype._createMixed = function (parentNode) {
    var node;

    if (!parentNode) {
        node = new BuildMail('multipart/mixed', {
            baseBoundary: this.mail.baseBoundary,
            textEncoding: this.mail.textEncoding,
            boundaryPrefix: this.mail.boundaryPrefix,
            disableUrlAccess: this.mail.disableUrlAccess,
            disableFileAccess: this.mail.disableFileAccess
        });
    } else {
        node = parentNode.createChild('multipart/mixed', {
            disableUrlAccess: this.mail.disableUrlAccess,
            disableFileAccess: this.mail.disableFileAccess
        });
    }

    if (this._useAlternative) {
        this._createAlternative(node);
    } else if (this._useRelated) {
        this._createRelated(node);
    }

    [].concat(!this._useAlternative && this._alternatives || []).concat(this._attachments.attached || []).forEach(function (element) {
        // if the element is a html node from related subpart then ignore it
        if (!this._useRelated || element !== this._htmlNode) {
            this._createContentNode(node, element);
        }
    }.bind(this));

    return node;
};

/**
 * Builds multipart/alternative node. It should always contain same type of elements on the same level
 * eg. text + html view of the same data
 *
 * @param {Object} parentNode Parent for this note. If it does not exist, a root node is created
 * @returns {Object} BuildMail node element
 */
MailComposer.prototype._createAlternative = function (parentNode) {
    var node;

    if (!parentNode) {
        node = new BuildMail('multipart/alternative', {
            baseBoundary: this.mail.baseBoundary,
            textEncoding: this.mail.textEncoding,
            boundaryPrefix: this.mail.boundaryPrefix,
            disableUrlAccess: this.mail.disableUrlAccess,
            disableFileAccess: this.mail.disableFileAccess
        });
    } else {
        node = parentNode.createChild('multipart/alternative', {
            disableUrlAccess: this.mail.disableUrlAccess,
            disableFileAccess: this.mail.disableFileAccess
        });
    }

    this._alternatives.forEach(function (alternative) {
        if (this._useRelated && this._htmlNode === alternative) {
            this._createRelated(node);
        } else {
            this._createContentNode(node, alternative);
        }
    }.bind(this));

    return node;
};

/**
 * Builds multipart/related node. It should always contain html node with related attachments
 *
 * @param {Object} parentNode Parent for this note. If it does not exist, a root node is created
 * @returns {Object} BuildMail node element
 */
MailComposer.prototype._createRelated = function (parentNode) {
    var node;

    if (!parentNode) {
        node = new BuildMail('multipart/related; type="text/html"', {
            baseBoundary: this.mail.baseBoundary,
            textEncoding: this.mail.textEncoding,
            boundaryPrefix: this.mail.boundaryPrefix,
            disableUrlAccess: this.mail.disableUrlAccess,
            disableFileAccess: this.mail.disableFileAccess
        });
    } else {
        node = parentNode.createChild('multipart/related; type="text/html"', {
            disableUrlAccess: this.mail.disableUrlAccess,
            disableFileAccess: this.mail.disableFileAccess
        });
    }

    this._createContentNode(node, this._htmlNode);

    this._attachments.related.forEach(function (alternative) {
        this._createContentNode(node, alternative);
    }.bind(this));

    return node;
};

/**
 * Creates a regular node with contents
 *
 * @param {Object} parentNode Parent for this note. If it does not exist, a root node is created
 * @param {Object} element Node data
 * @returns {Object} BuildMail node element
 */
MailComposer.prototype._createContentNode = function (parentNode, element) {
    element = element || {};
    element.content = element.content || '';

    var node;
    var encoding = (element.encoding || 'utf8')
        .toString()
        .toLowerCase()
        .replace(/[-_\s]/g, '');

    if (!parentNode) {
        node = new BuildMail(element.contentType, {
            filename: element.filename,
            baseBoundary: this.mail.baseBoundary,
            textEncoding: this.mail.textEncoding,
            boundaryPrefix: this.mail.boundaryPrefix,
            disableUrlAccess: this.mail.disableUrlAccess,
            disableFileAccess: this.mail.disableFileAccess
        });
    } else {
        node = parentNode.createChild(element.contentType, {
            filename: element.filename,
            disableUrlAccess: this.mail.disableUrlAccess,
            disableFileAccess: this.mail.disableFileAccess
        });
    }

    // add custom headers
    if (element.headers) {
        node.addHeader(element.headers);
    }

    if (element.cid) {
        node.setHeader('Content-Id', '<' + element.cid.replace(/[<>]/g, '') + '>');
    }

    if (element.contentTransferEncoding) {
        node.setHeader('Content-Transfer-Encoding', element.contentTransferEncoding);
    } else if (this.mail.encoding && /^text\//i.test(element.contentType)) {
        node.setHeader('Content-Transfer-Encoding', this.mail.encoding);
    }

    if (!/^text\//i.test(element.contentType) || element.contentDisposition) {
        node.setHeader('Content-Disposition', element.contentDisposition || (element.cid ? 'inline' : 'attachment'));
    }

    if (typeof element.content === 'string' && ['utf8', 'usascii', 'ascii'].indexOf(encoding) < 0) {
        element.content = new Buffer(element.content, encoding);
    }

    // prefer pregenerated raw content
    if (element.raw) {
        node.setRaw(element.raw);
    } else {
        node.setContent(element.content);
    }

    return node;
};

/**
 * Parses data uri and converts it to a Buffer
 *
 * @param {Object} element Content element
 * @return {Object} Parsed element
 */
MailComposer.prototype._processDataUrl = function (element) {
    var parts = (element.path || element.href).match(/^data:((?:[^;]*;)*(?:[^,]*)),(.*)$/i);
    if (!parts) {
        return element;
    }

    element.content = /\bbase64$/i.test(parts[1]) ? new Buffer(parts[2], 'base64') : new Buffer(decodeURIComponent(parts[2]));

    if ('path' in element) {
        element.path = false;
    }

    if ('href' in element) {
        element.href = false;
    }

    parts[1].split(';').forEach(function (item) {
        if (/^\w+\/[^\/]+$/i.test(item)) {
            element.contentType = element.contentType || item.toLowerCase();
        }
    });

    return element;
};


/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var libmime = __webpack_require__(12);
var libqp = __webpack_require__(16);
var libbase64 = __webpack_require__(15);
var punycode = __webpack_require__(48);
var addressparser = __webpack_require__(49);
var stream = __webpack_require__(1);
var PassThrough = stream.PassThrough;
var fs = __webpack_require__(17);
var fetch = __webpack_require__(18);
var crypto = __webpack_require__(10);
var os = __webpack_require__(5);

module.exports = MimeNode;

/**
 * Creates a new mime tree node. Assumes 'multipart/*' as the content type
 * if it is a branch, anything else counts as leaf. If rootNode is missing from
 * the options, assumes this is the root.
 *
 * @param {String} contentType Define the content type for the node. Can be left blank for attachments (derived from filename)
 * @param {Object} [options] optional options
 * @param {Object} [options.rootNode] root node for this tree
 * @param {Object} [options.parentNode] immediate parent for this node
 * @param {Object} [options.filename] filename for an attachment node
 * @param {String} [options.baseBoundary] shared part of the unique multipart boundary
 * @param {Boolean} [options.keepBcc] If true, do not exclude Bcc from the generated headers
 * @param {String} [options.textEncoding] either 'Q' (the default) or 'B'
 */
function MimeNode(contentType, options) {
    this.nodeCounter = 0;

    options = options || {};

    /**
     * shared part of the unique multipart boundary
     */
    this.baseBoundary = options.baseBoundary || Date.now().toString() + Math.random();
    this.boundaryPrefix = options.boundaryPrefix || '----sinikael';

    this.disableFileAccess = !!options.disableFileAccess;
    this.disableUrlAccess = !!options.disableUrlAccess;

    /**
     * If date headers is missing and current node is the root, this value is used instead
     */
    this.date = new Date();

    /**
     * Root node for current mime tree
     */
    this.rootNode = options.rootNode || this;

    /**
     * If true include Bcc in generated headers (if available)
     */
    this.keepBcc = !!options.keepBcc;

    /**
     * If filename is specified but contentType is not (probably an attachment)
     * detect the content type from filename extension
     */
    if (options.filename) {
        /**
         * Filename for this node. Useful with attachments
         */
        this.filename = options.filename;
        if (!contentType) {
            contentType = libmime.detectMimeType(this.filename.split('.').pop());
        }
    }

    /**
     * Indicates which encoding should be used for header strings: "Q" or "B"
     */
    this.textEncoding = (options.textEncoding || '').toString().trim().charAt(0).toUpperCase();

    /**
     * Immediate parent for this node (or undefined if not set)
     */
    this.parentNode = options.parentNode;

    /**
     * Hostname for default message-id values
     */
    this.hostname = options.hostname;

    /**
     * An array for possible child nodes
     */
    this.childNodes = [];

    /**
     * Used for generating unique boundaries (prepended to the shared base)
     */
    this._nodeId = ++this.rootNode.nodeCounter;

    /**
     * A list of header values for this node in the form of [{key:'', value:''}]
     */
    this._headers = [];

    /**
     * True if the content only uses ASCII printable characters
     * @type {Boolean}
     */
    this._isPlainText = false;

    /**
     * True if the content is plain text but has longer lines than allowed
     * @type {Boolean}
     */
    this._hasLongLines = false;

    /**
     * If set, use instead this value for envelopes instead of generating one
     * @type {Boolean}
     */
    this._envelope = false;

    /**
     * If set then use this value as the stream content instead of building it
     * @type {String|Buffer|Stream}
     */
    this._raw = false;

    /**
     * Additional transform streams that the message will be piped before
     * exposing by createReadStream
     * @type {Array}
     */
    this._transforms = [];

    /**
     * If content type is set (or derived from the filename) add it to headers
     */
    if (contentType) {
        this.setHeader('Content-Type', contentType);
    }
}

/////// PUBLIC METHODS

/**
 * Creates and appends a child node.Arguments provided are passed to MimeNode constructor
 *
 * @param {String} [contentType] Optional content type
 * @param {Object} [options] Optional options object
 * @return {Object} Created node object
 */
MimeNode.prototype.createChild = function (contentType, options) {
    if (!options && typeof contentType === 'object') {
        options = contentType;
        contentType = undefined;
    }
    var node = new MimeNode(contentType, options);
    this.appendChild(node);
    return node;
};

/**
 * Appends an existing node to the mime tree. Removes the node from an existing
 * tree if needed
 *
 * @param {Object} childNode node to be appended
 * @return {Object} Appended node object
 */
MimeNode.prototype.appendChild = function (childNode) {

    if (childNode.rootNode !== this.rootNode) {
        childNode.rootNode = this.rootNode;
        childNode._nodeId = ++this.rootNode.nodeCounter;
    }

    childNode.parentNode = this;

    this.childNodes.push(childNode);
    return childNode;
};

/**
 * Replaces current node with another node
 *
 * @param {Object} node Replacement node
 * @return {Object} Replacement node
 */
MimeNode.prototype.replace = function (node) {
    if (node === this) {
        return this;
    }

    this.parentNode.childNodes.forEach(function (childNode, i) {
        if (childNode === this) {

            node.rootNode = this.rootNode;
            node.parentNode = this.parentNode;
            node._nodeId = this._nodeId;

            this.rootNode = this;
            this.parentNode = undefined;

            node.parentNode.childNodes[i] = node;
        }
    }.bind(this));

    return node;
};

/**
 * Removes current node from the mime tree
 *
 * @return {Object} removed node
 */
MimeNode.prototype.remove = function () {
    if (!this.parentNode) {
        return this;
    }

    for (var i = this.parentNode.childNodes.length - 1; i >= 0; i--) {
        if (this.parentNode.childNodes[i] === this) {
            this.parentNode.childNodes.splice(i, 1);
            this.parentNode = undefined;
            this.rootNode = this;
            return this;
        }
    }
};

/**
 * Sets a header value. If the value for selected key exists, it is overwritten.
 * You can set multiple values as well by using [{key:'', value:''}] or
 * {key: 'value'} as the first argument.
 *
 * @param {String|Array|Object} key Header key or a list of key value pairs
 * @param {String} value Header value
 * @return {Object} current node
 */
MimeNode.prototype.setHeader = function (key, value) {
    var added = false,
        headerValue;

    // Allow setting multiple headers at once
    if (!value && key && typeof key === 'object') {
        // allow {key:'content-type', value: 'text/plain'}
        if (key.key && 'value' in key) {
            this.setHeader(key.key, key.value);
        }
        // allow [{key:'content-type', value: 'text/plain'}]
        else if (Array.isArray(key)) {
            key.forEach(function (i) {
                this.setHeader(i.key, i.value);
            }.bind(this));
        }
        // allow {'content-type': 'text/plain'}
        else {
            Object.keys(key).forEach(function (i) {
                this.setHeader(i, key[i]);
            }.bind(this));
        }
        return this;
    }

    key = this._normalizeHeaderKey(key);

    headerValue = {
        key: key,
        value: value
    };

    // Check if the value exists and overwrite
    for (var i = 0, len = this._headers.length; i < len; i++) {
        if (this._headers[i].key === key) {
            if (!added) {
                // replace the first match
                this._headers[i] = headerValue;
                added = true;
            } else {
                // remove following matches
                this._headers.splice(i, 1);
                i--;
                len--;
            }
        }
    }

    // match not found, append the value
    if (!added) {
        this._headers.push(headerValue);
    }

    return this;
};

/**
 * Adds a header value. If the value for selected key exists, the value is appended
 * as a new field and old one is not touched.
 * You can set multiple values as well by using [{key:'', value:''}] or
 * {key: 'value'} as the first argument.
 *
 * @param {String|Array|Object} key Header key or a list of key value pairs
 * @param {String} value Header value
 * @return {Object} current node
 */
MimeNode.prototype.addHeader = function (key, value) {

    // Allow setting multiple headers at once
    if (!value && key && typeof key === 'object') {
        // allow {key:'content-type', value: 'text/plain'}
        if (key.key && key.value) {
            this.addHeader(key.key, key.value);
        }
        // allow [{key:'content-type', value: 'text/plain'}]
        else if (Array.isArray(key)) {
            key.forEach(function (i) {
                this.addHeader(i.key, i.value);
            }.bind(this));
        }
        // allow {'content-type': 'text/plain'}
        else {
            Object.keys(key).forEach(function (i) {
                this.addHeader(i, key[i]);
            }.bind(this));
        }
        return this;
    } else if (Array.isArray(value)) {
        value.forEach(function (val) {
            this.addHeader(key, val);
        }.bind(this));
        return this;
    }

    this._headers.push({
        key: this._normalizeHeaderKey(key),
        value: value
    });

    return this;
};

/**
 * Retrieves the first mathcing value of a selected key
 *
 * @param {String} key Key to search for
 * @retun {String} Value for the key
 */
MimeNode.prototype.getHeader = function (key) {
    key = this._normalizeHeaderKey(key);
    for (var i = 0, len = this._headers.length; i < len; i++) {
        if (this._headers[i].key === key) {
            return this._headers[i].value;
        }
    }
};

/**
 * Sets body content for current node. If the value is a string, charset is added automatically
 * to Content-Type (if it is text/*). If the value is a Buffer, you need to specify
 * the charset yourself
 *
 * @param (String|Buffer) content Body content
 * @return {Object} current node
 */
MimeNode.prototype.setContent = function (content) {
    var _self = this;
    this.content = content;
    if (typeof this.content.pipe === 'function') {
        // pre-stream handler. might be triggered if a stream is set as content
        // and 'error' fires before anything is done with this stream
        this._contentErrorHandler = function (err) {
            _self.content.removeListener('error', _self._contentErrorHandler);
            _self.content = err;
        };
        this.content.once('error', this._contentErrorHandler);
    } else if (typeof this.content === 'string') {
        this._isPlainText = libmime.isPlainText(this.content);
        if (this._isPlainText && libmime.hasLongerLines(this.content, 76)) {
            // If there are lines longer than 76 symbols/bytes do not use 7bit
            this._hasLongLines = true;
        }
    }
    return this;
};

MimeNode.prototype.build = function (callback) {
    var stream = this.createReadStream();
    var buf = [];
    var buflen = 0;
    var returned = false;

    stream.on('readable', function () {
        var chunk;

        while ((chunk = stream.read()) !== null) {
            buf.push(chunk);
            buflen += chunk.length;
        }
    });

    stream.once('error', function (err) {
        if (returned) {
            return;
        }
        returned = true;

        return callback(err);
    });

    stream.once('end', function (chunk) {
        if (returned) {
            return;
        }
        returned = true;

        if (chunk && chunk.length) {
            buf.push(chunk);
            buflen += chunk.length;
        }
        return callback(null, Buffer.concat(buf, buflen));
    });
};

MimeNode.prototype.getTransferEncoding = function () {
    var transferEncoding = false;
    var contentType = (this.getHeader('Content-Type') || '').toString().toLowerCase().trim();

    if (this.content) {
        transferEncoding = (this.getHeader('Content-Transfer-Encoding') || '').toString().toLowerCase().trim();
        if (!transferEncoding || ['base64', 'quoted-printable'].indexOf(transferEncoding) < 0) {
            if (/^text\//i.test(contentType)) {
                // If there are no special symbols, no need to modify the text
                if (this._isPlainText && !this._hasLongLines) {
                    transferEncoding = '7bit';
                } else if (typeof this.content === 'string' || this.content instanceof Buffer) {
                    // detect preferred encoding for string value
                    transferEncoding = this._getTextEncoding(this.content) === 'Q' ? 'quoted-printable' : 'base64';
                } else {
                    // we can not check content for a stream, so either use preferred encoding or fallback to QP
                    transferEncoding = this.transferEncoding === 'B' ? 'base64' : 'quoted-printable';
                }
            } else if (!/^(multipart|message)\//i.test(contentType)) {
                transferEncoding = transferEncoding || 'base64';
            }
        }
    }
    return transferEncoding;
};

/**
 * Builds the header block for the mime node. Append \r\n\r\n before writing the content
 *
 * @returns {String} Headers
 */
MimeNode.prototype.buildHeaders = function () {
    var _self = this;
    var transferEncoding = this.getTransferEncoding();
    var headers = [];

    if (transferEncoding) {
        this.setHeader('Content-Transfer-Encoding', transferEncoding);
    }

    if (this.filename && !this.getHeader('Content-Disposition')) {
        this.setHeader('Content-Disposition', 'attachment');
    }

    // Ensure mandatory header fields
    if (this.rootNode === this) {
        if (!this.getHeader('Date')) {
            this.setHeader('Date', this.date.toUTCString().replace(/GMT/, '+0000'));
        }

        // ensure that Message-Id is present
        this.messageId();

        if (!this.getHeader('MIME-Version')) {
            this.setHeader('MIME-Version', '1.0');
        }
    }

    this._headers.forEach(function (header) {
        var key = header.key;
        var value = header.value;
        var structured;
        var param;
        var options = {};
        var formattedHeaders = ['From', 'Sender', 'To', 'Cc', 'Bcc', 'Reply-To', 'Date', 'References'];

        if (value && formattedHeaders.indexOf(key) < 0 && typeof value === 'object') {
            Object.keys(value).forEach(function (key) {
                if (key !== 'value') {
                    options[key] = value[key];
                }
            });
            value = (value.value || '').toString();
            if (!value.trim()) {
                return;
            }
        }

        if (options.prepared) {
            // header value is
            headers.push(key + ': ' + value);
            return;
        }

        switch (header.key) {
            case 'Content-Disposition':
                structured = libmime.parseHeaderValue(value);
                if (_self.filename) {
                    structured.params.filename = _self.filename;
                }
                value = libmime.buildHeaderValue(structured);
                break;
            case 'Content-Type':
                structured = libmime.parseHeaderValue(value);

                _self._handleContentType(structured);

                if (structured.value.match(/^text\/plain\b/) && typeof _self.content === 'string' && /[\u0080-\uFFFF]/.test(_self.content)) {
                    structured.params.charset = 'utf-8';
                }

                value = libmime.buildHeaderValue(structured);

                if (_self.filename) {
                    // add support for non-compliant clients like QQ webmail
                    // we can't build the value with buildHeaderValue as the value is non standard and
                    // would be converted to parameter continuation encoding that we do not want
                    param = this._encodeWords(_self.filename);

                    if (param !== _self.filename || /[\s'"\\;:\/=\(\),<>@\[\]\?]|^\-/.test(param)) {
                        // include value in quotes if needed
                        param = '"' + param + '"';
                    }
                    value += '; name=' + param;
                }
                break;
            case 'Bcc':
                if (!_self.keepBcc) {
                    // skip BCC values
                    return;
                }
                break;
        }

        value = _self._encodeHeaderValue(key, value);

        // skip empty lines
        if (!(value || '').toString().trim()) {
            return;
        }

        headers.push(libmime.foldLines(key + ': ' + value, 76));
    }.bind(this));

    return headers.join('\r\n');
};

/**
 * Streams the rfc2822 message from the current node. If this is a root node,
 * mandatory header fields are set if missing (Date, Message-Id, MIME-Version)
 *
 * @return {String} Compiled message
 */
MimeNode.prototype.createReadStream = function (options) {
    options = options || {};

    var outputStream = new PassThrough(options);
    var transform;

    this.stream(outputStream, options, function (err) {
        if (err) {
            outputStream.emit('error', err);
            return;
        }
        outputStream.end();
    });

    for (var i = 0, len = this._transforms.length; i < len; i++) {
        transform = typeof this._transforms[i] === 'function' ? this._transforms[i]() : this._transforms[i];
        outputStream.once('error', function (err) {
            transform.emit('error', err);
        });
        outputStream = outputStream.pipe(transform);
    }

    return outputStream;
};

/**
 * Appends a transform stream object to the transforms list. Final output
 * is passed through this stream before exposing
 *
 * @param {Object} transform Read-Write stream
 */
MimeNode.prototype.transform = function (transform) {
    this._transforms.push(transform);
};

MimeNode.prototype.stream = function (outputStream, options, done) {
    var _self = this;
    var transferEncoding = this.getTransferEncoding();
    var contentStream;
    var localStream;

    // protect actual callback against multiple triggering
    var returned = false;
    var callback = function (err) {
        if (returned) {
            return;
        }
        returned = true;
        done(err);
    };

    // pushes node content
    function sendContent() {
        if (_self.content) {

            if (Object.prototype.toString.call(_self.content) === '[object Error]') {
                // content is already errored
                return callback(_self.content);
            }

            if (typeof _self.content.pipe === 'function') {
                _self.content.removeListener('error', _self._contentErrorHandler);
                _self._contentErrorHandler = function (err) {
                    return callback(err);
                };
                _self.content.once('error', _self._contentErrorHandler);
            }

            if (['quoted-printable', 'base64'].indexOf(transferEncoding) >= 0) {
                contentStream = new(transferEncoding === 'base64' ? libbase64 : libqp).Encoder(options);

                contentStream.pipe(outputStream, {
                    end: false
                });
                contentStream.once('end', finalize);
                contentStream.once('error', function (err) {
                    return callback(err);
                });

                localStream = _self._getStream(_self.content);
                localStream.pipe(contentStream);
            } else {
                // anything that is not QP or Base54 passes as-is
                localStream = _self._getStream(_self.content);
                localStream.pipe(outputStream, {
                    end: false
                });
                localStream.once('end', finalize);
            }

            localStream.once('error', function (err) {
                return callback(err);
            });

            return;
        } else {
            return setImmediate(finalize);
        }
    }

    // for multipart nodes, push child nodes
    // for content nodes end the stream
    function finalize() {
        var childId = 0;
        var processChildNode = function () {
            if (childId >= _self.childNodes.length) {
                outputStream.write('\r\n--' + _self.boundary + '--\r\n');
                return callback();
            }
            var child = _self.childNodes[childId++];
            outputStream.write((childId > 1 ? '\r\n' : '') + '--' + _self.boundary + '\r\n');
            child.stream(outputStream, options, function (err) {
                if (err) {
                    return callback(err);
                }
                setImmediate(processChildNode);
            });
        };

        if (_self.multipart) {
            setImmediate(processChildNode);
        } else {
            return callback();
        }
    }

    if (this._raw) {
        setImmediate(function () {
            if (Object.prototype.toString.call(_self._raw) === '[object Error]') {
                // content is already errored
                return callback(_self._raw);
            }

            // remove default error handler (if set)
            if (typeof _self._raw.pipe === 'function') {
                _self._raw.removeListener('error', _self._contentErrorHandler);
            }

            var raw = _self._getStream(_self._raw);
            raw.pipe(outputStream, {
                end: false
            });
            raw.on('error', function (err) {
                outputStream.emit('error', err);
            });
            raw.on('end', finalize);
        });
    } else {
        outputStream.write(this.buildHeaders() + '\r\n\r\n');
        setImmediate(sendContent);
    }
};

/**
 * Sets envelope to be used instead of the generated one
 *
 * @return {Object} SMTP envelope in the form of {from: 'from@example.com', to: ['to@example.com']}
 */
MimeNode.prototype.setEnvelope = function (envelope) {
    var list;

    this._envelope = {
        from: false,
        to: []
    };

    if (envelope.from) {
        list = [];
        this._convertAddresses(this._parseAddresses(envelope.from), list);
        list = list.filter(function (address) {
            return address && address.address;
        });
        if (list.length && list[0]) {
            this._envelope.from = list[0].address;
        }
    }
    ['to', 'cc', 'bcc'].forEach(function (key) {
        if (envelope[key]) {
            this._convertAddresses(this._parseAddresses(envelope[key]), this._envelope.to);
        }
    }.bind(this));

    this._envelope.to = this._envelope.to.map(function (to) {
        return to.address;
    }).filter(function (address) {
        return address;
    });

    var standardFields = ['to', 'cc', 'bcc', 'from'];
    Object.keys(envelope).forEach(function (key) {
        if (standardFields.indexOf(key) === -1) {
            this._envelope[key] = envelope[key];
        }
    }.bind(this));

    return this;
};

/**
 * Generates and returns an object with parsed address fields
 *
 * @return {Object} Address object
 */
MimeNode.prototype.getAddresses = function () {
    var addresses = {};

    this._headers.forEach(function (header) {
        var key = header.key.toLowerCase();
        if (['from', 'sender', 'reply-to', 'to', 'cc', 'bcc'].indexOf(key) >= 0) {
            if (!Array.isArray(addresses[key])) {
                addresses[key] = [];
            }

            this._convertAddresses(this._parseAddresses(header.value), addresses[key]);
        }
    }.bind(this));

    return addresses;
};

/**
 * Generates and returns SMTP envelope with the sender address and a list of recipients addresses
 *
 * @return {Object} SMTP envelope in the form of {from: 'from@example.com', to: ['to@example.com']}
 */
MimeNode.prototype.getEnvelope = function () {
    if (this._envelope) {
        return this._envelope;
    }

    var envelope = {
        from: false,
        to: []
    };
    this._headers.forEach(function (header) {
        var list = [];
        if (header.key === 'From' || (!envelope.from && ['Reply-To', 'Sender'].indexOf(header.key) >= 0)) {
            this._convertAddresses(this._parseAddresses(header.value), list);
            if (list.length && list[0]) {
                envelope.from = list[0].address;
            }
        } else if (['To', 'Cc', 'Bcc'].indexOf(header.key) >= 0) {
            this._convertAddresses(this._parseAddresses(header.value), envelope.to);
        }
    }.bind(this));

    envelope.to = envelope.to.map(function (to) {
        return to.address;
    });

    return envelope;
};

/**
 * Returns Message-Id value. If it does not exist, then creates one
 *
 * @return {String} Message-Id value
 */
MimeNode.prototype.messageId = function () {
    var messageId = this.getHeader('Message-ID');
    // You really should define your own Message-Id field!
    if (!messageId) {
        messageId = this._generateMessageId();
        this.setHeader('Message-ID', messageId);
    }
    return messageId;
};

/**
 * Sets pregenerated content that will be used as the output of this node
 *
 * @param {String|Buffer|Stream} Raw MIME contents
 */
MimeNode.prototype.setRaw = function (raw) {
    var _self = this;

    this._raw = raw;

    if (this._raw && typeof this._raw.pipe === 'function') {
        // pre-stream handler. might be triggered if a stream is set as content
        // and 'error' fires before anything is done with this stream
        this._contentErrorHandler = function (err) {
            _self._raw.removeListener('error', _self._contentErrorHandler);
            _self._raw = err;
        };
        _self._raw.once('error', this._contentErrorHandler);
    }

    return this;
};

/////// PRIVATE METHODS

/**
 * Detects and returns handle to a stream related with the content.
 *
 * @param {Mixed} content Node content
 * @returns {Object} Stream object
 */
MimeNode.prototype._getStream = function (content) {
    var contentStream;

    if (typeof content.pipe === 'function') {
        // assume as stream
        return content;
    } else if (content && typeof content.path === 'string' && !content.href) {
        if (this.disableFileAccess) {
            contentStream = new PassThrough();
            setImmediate(function () {
                contentStream.emit('error', new Error('File access rejected for ' + content.path));
            });
            return contentStream;
        }
        // read file
        return fs.createReadStream(content.path);
    } else if (content && typeof content.href === 'string') {
        if (this.disableUrlAccess) {
            contentStream = new PassThrough();
            setImmediate(function () {
                contentStream.emit('error', new Error('Url access rejected for ' + content.href));
            });
            return contentStream;
        }
        // fetch URL
        return fetch(content.href);
    } else {
        // pass string or buffer content as a stream
        contentStream = new PassThrough();
        setImmediate(function () {
            contentStream.end(content || '');
        });
        return contentStream;
    }
};

/**
 * Parses addresses. Takes in a single address or an array or an
 * array of address arrays (eg. To: [[first group], [second group],...])
 *
 * @param {Mixed} addresses Addresses to be parsed
 * @return {Array} An array of address objects
 */
MimeNode.prototype._parseAddresses = function (addresses) {
    return [].concat.apply([], [].concat(addresses).map(function (address) {
        if (address && address.address) {
            address.address = this._normalizeAddress(address.address);
            address.name = address.name || '';
            return [address];
        }
        return addressparser(address);
    }.bind(this)));
};

/**
 * Normalizes a header key, uses Camel-Case form, except for uppercase MIME-
 *
 * @param {String} key Key to be normalized
 * @return {String} key in Camel-Case form
 */
MimeNode.prototype._normalizeHeaderKey = function (key) {
    return (key || '').toString().
        // no newlines in keys
    replace(/\r?\n|\r/g, ' ').
    trim().toLowerCase().
        // use uppercase words, except MIME
    replace(/^X\-SMTPAPI$|^(MIME|DKIM)\b|^[a-z]|\-(SPF|FBL|ID|MD5)$|\-[a-z]/ig,
            function (c) {
                return c.toUpperCase();
            }).
        // special case
    replace(/^Content\-Features$/i, 'Content-features');
};

/**
 * Checks if the content type is multipart and defines boundary if needed.
 * Doesn't return anything, modifies object argument instead.
 *
 * @param {Object} structured Parsed header value for 'Content-Type' key
 */
MimeNode.prototype._handleContentType = function (structured) {
    this.contentType = structured.value.trim().toLowerCase();

    this.multipart = this.contentType.split('/').reduce(function (prev, value) {
        return prev === 'multipart' ? value : false;
    });

    if (this.multipart) {
        this.boundary = structured.params.boundary = structured.params.boundary || this.boundary || this._generateBoundary();
    } else {
        this.boundary = false;
    }
};

/**
 * Generates a multipart boundary value
 *
 * @return {String} boundary value
 */
MimeNode.prototype._generateBoundary = function () {
    return this.rootNode.boundaryPrefix + '-?=_' + this._nodeId + '-' + this.rootNode.baseBoundary;
};

/**
 * Encodes a header value for use in the generated rfc2822 email.
 *
 * @param {String} key Header key
 * @param {String} value Header value
 */
MimeNode.prototype._encodeHeaderValue = function (key, value) {
    key = this._normalizeHeaderKey(key);

    switch (key) {

        // Structured headers
        case 'From':
        case 'Sender':
        case 'To':
        case 'Cc':
        case 'Bcc':
        case 'Reply-To':
            return this._convertAddresses(this._parseAddresses(value));

            // values enclosed in <>
        case 'Message-ID':
        case 'In-Reply-To':
        case 'Content-Id':
            value = (value || '').toString().replace(/\r?\n|\r/g, ' ');

            if (value.charAt(0) !== '<') {
                value = '<' + value;
            }

            if (value.charAt(value.length - 1) !== '>') {
                value = value + '>';
            }
            return value;

            // space separated list of values enclosed in <>
        case 'References':
            value = [].concat.apply([], [].concat(value || '').map(function (elm) {
                elm = (elm || '').toString().replace(/\r?\n|\r/g, ' ').trim();
                return elm.replace(/<[^>]*>/g, function (str) {
                    return str.replace(/\s/g, '');
                }).split(/\s+/);
            })).map(function (elm) {
                if (elm.charAt(0) !== '<') {
                    elm = '<' + elm;
                }
                if (elm.charAt(elm.length - 1) !== '>') {
                    elm = elm + '>';
                }
                return elm;
            });

            return value.join(' ').trim();

        case 'Date':
            if (Object.prototype.toString.call(value) === '[object Date]') {
                return value.toUTCString().replace(/GMT/, '+0000');
            }

            value = (value || '').toString().replace(/\r?\n|\r/g, ' ');
            return this._encodeWords(value);

        default:
            value = (value || '').toString().replace(/\r?\n|\r/g, ' ');
            // encodeWords only encodes if needed, otherwise the original string is returned
            return this._encodeWords(value);
    }
};

/**
 * Rebuilds address object using punycode and other adjustments
 *
 * @param {Array} addresses An array of address objects
 * @param {Array} [uniqueList] An array to be populated with addresses
 * @return {String} address string
 */
MimeNode.prototype._convertAddresses = function (addresses, uniqueList) {
    var values = [];

    uniqueList = uniqueList || [];

    [].concat(addresses || []).forEach(function (address) {
        if (address.address) {
            address.address = this._normalizeAddress(address.address);

            if (!address.name) {
                values.push(address.address);
            } else if (address.name) {
                values.push(this._encodeAddressName(address.name) + ' <' + address.address + '>');
            }

            if (address.address) {
                if (!uniqueList.filter(
                        function (a) {
                            return a.address === address.address;
                        }).length) {
                    uniqueList.push(address);
                }
            }
        } else if (address.group) {
            values.push(this._encodeAddressName(address.name) + ':' + (address.group.length ? this._convertAddresses(address.group, uniqueList) : '').trim() + ';');
        }
    }.bind(this));

    return values.join(', ');
};

/**
 * Normalizes an email address
 *
 * @param {Array} address An array of address objects
 * @return {String} address string
 */
MimeNode.prototype._normalizeAddress = function (address) {
    address = (address || '').toString().trim();

    var lastAt = address.lastIndexOf('@');
    var user = address.substr(0, lastAt);
    var domain = address.substr(lastAt + 1);

    // Usernames are not touched and are kept as is even if these include unicode
    // Domains are punycoded by default
    // 'jõgeva.ee' will be converted to 'xn--jgeva-dua.ee'
    // non-unicode domains are left as is

    return user + '@' + punycode.toASCII(domain.toLowerCase());
};

/**
 * If needed, mime encodes the name part
 *
 * @param {String} name Name part of an address
 * @returns {String} Mime word encoded string if needed
 */
MimeNode.prototype._encodeAddressName = function (name) {
    if (!/^[\w ']*$/.test(name)) {
        if (/^[\x20-\x7e]*$/.test(name)) {
            return '"' + name.replace(/([\\"])/g, '\\$1') + '"';
        } else {
            return libmime.encodeWord(name, this._getTextEncoding(name), 52);
        }
    }
    return name;
};

/**
 * If needed, mime encodes the name part
 *
 * @param {String} name Name part of an address
 * @returns {String} Mime word encoded string if needed
 */
MimeNode.prototype._encodeWords = function (value) {
    return libmime.encodeWords(value, this._getTextEncoding(value), 52);
};

/**
 * Detects best mime encoding for a text value
 *
 * @param {String} value Value to check for
 * @return {String} either 'Q' or 'B'
 */
MimeNode.prototype._getTextEncoding = function (value) {
    value = (value || '').toString();

    var encoding = this.textEncoding;
    var latinLen;
    var nonLatinLen;

    if (!encoding) {
        // count latin alphabet symbols and 8-bit range symbols + control symbols
        // if there are more latin characters, then use quoted-printable
        // encoding, otherwise use base64
        nonLatinLen = (value.match(/[\x00-\x08\x0B\x0C\x0E-\x1F\u0080-\uFFFF]/g) || []).length;
        latinLen = (value.match(/[a-z]/gi) || []).length;
        // if there are more latin symbols than binary/unicode, then prefer Q, otherwise B
        encoding = nonLatinLen < latinLen ? 'Q' : 'B';
    }
    return encoding;
};

/**
 * Generates a message id
 *
 * @return {String} Random Message-ID value
 */
MimeNode.prototype._generateMessageId = function () {
    return '<' + [2, 2, 2, 6].reduce(
            // crux to generate UUID-like random strings
            function (prev, len) {
                return prev + '-' + crypto.randomBytes(len).toString('hex');
            }, crypto.randomBytes(4).toString('hex')) +
        '@' +
        // try to use the domain of the FROM address or fallback to server hostname
        (this.getEnvelope().from || this.hostname || os.hostname() || 'localhost').split('@').pop() + '>';
};


/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var iconv = __webpack_require__(28);

/**
 * Character set encoding and decoding functions
 */
var charset = module.exports = {

    /**
     * Encodes an unicode string into an Buffer object as UTF-8
     *
     * We force UTF-8 here, no strange encodings allowed.
     *
     * @param {String} str String to be encoded
     * @return {Buffer} UTF-8 encoded typed array
     */
    encode: function (str) {
        return new Buffer(str, 'utf-8');
    },

    /**
     * Decodes a string from Buffer to an unicode string using specified encoding
     *
     * @param {Buffer} buf Binary data to be decoded
     * @param {String} [fromCharset='UTF-8'] Binary data is decoded into string using this charset
     * @return {String} Decded string
     */
    decode: function (buf, fromCharset) {
        fromCharset = charset.normalizeCharset(fromCharset || 'UTF-8');

        if (/^(us\-)?ascii|utf\-8|7bit$/i.test(fromCharset)) {
            return buf.toString('utf-8');
        }

        return iconv.decode(buf, fromCharset);
    },

    /**
     * Convert a string from specific encoding to UTF-8 Buffer
     *
     * @param {String|Buffer} str String to be encoded
     * @param {String} [fromCharset='UTF-8'] Source encoding for the string
     * @return {Buffer} UTF-8 encoded typed array
     */
    convert: function (data, fromCharset) {
        fromCharset = charset.normalizeCharset(fromCharset || 'UTF-8');

        var bufString;

        if (typeof data !== 'string') {
            if (/^(us\-)?ascii|utf\-8|7bit$/i.test(fromCharset)) {
                return data;
            }
            bufString = charset.decode(data, fromCharset);
            return charset.encode(bufString);
        }
        return charset.encode(data);
    },

    /**
     * Converts well known invalid character set names to proper names.
     * eg. win-1257 will be converted to WINDOWS-1257
     *
     * @param {String} charset Charset name to convert
     * @return {String} Canoninicalized charset name
     */
    normalizeCharset: function (charset) {
        var match;

        if ((match = charset.match(/^utf[\-_]?(\d+)$/i))) {
            return 'UTF-' + match[1];
        }

        if ((match = charset.match(/^win(?:dows)?[\-_]?(\d+)$/i))) {
            return 'WINDOWS-' + match[1];
        }

        if ((match = charset.match(/^latin[\-_]?(\d+)$/i))) {
            return 'ISO-8859-' + match[1];
        }

        return charset;
    }
};


/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var bomHandling = __webpack_require__(29),
    iconv = module.exports;

// All codecs and aliases are kept here, keyed by encoding name/alias.
// They are lazy loaded in `iconv.getCodec` from `encodings/index.js`.
iconv.encodings = null;

// Characters emitted in case of error.
iconv.defaultCharUnicode = '�';
iconv.defaultCharSingleByte = '?';

// Public API.
iconv.encode = function encode(str, encoding, options) {
    str = "" + (str || ""); // Ensure string.

    var encoder = iconv.getEncoder(encoding, options);

    var res = encoder.write(str);
    var trail = encoder.end();
    
    return (trail && trail.length > 0) ? Buffer.concat([res, trail]) : res;
}

iconv.decode = function decode(buf, encoding, options) {
    if (typeof buf === 'string') {
        if (!iconv.skipDecodeWarning) {
            console.error('Iconv-lite warning: decode()-ing strings is deprecated. Refer to https://github.com/ashtuchkin/iconv-lite/wiki/Use-Buffers-when-decoding');
            iconv.skipDecodeWarning = true;
        }

        buf = new Buffer("" + (buf || ""), "binary"); // Ensure buffer.
    }

    var decoder = iconv.getDecoder(encoding, options);

    var res = decoder.write(buf);
    var trail = decoder.end();

    return trail ? (res + trail) : res;
}

iconv.encodingExists = function encodingExists(enc) {
    try {
        iconv.getCodec(enc);
        return true;
    } catch (e) {
        return false;
    }
}

// Legacy aliases to convert functions
iconv.toEncoding = iconv.encode;
iconv.fromEncoding = iconv.decode;

// Search for a codec in iconv.encodings. Cache codec data in iconv._codecDataCache.
iconv._codecDataCache = {};
iconv.getCodec = function getCodec(encoding) {
    if (!iconv.encodings)
        iconv.encodings = __webpack_require__(30); // Lazy load all encoding definitions.
    
    // Canonicalize encoding name: strip all non-alphanumeric chars and appended year.
    var enc = (''+encoding).toLowerCase().replace(/[^0-9a-z]|:\d{4}$/g, "");

    // Traverse iconv.encodings to find actual codec.
    var codecOptions = {};
    while (true) {
        var codec = iconv._codecDataCache[enc];
        if (codec)
            return codec;

        var codecDef = iconv.encodings[enc];

        switch (typeof codecDef) {
            case "string": // Direct alias to other encoding.
                enc = codecDef;
                break;

            case "object": // Alias with options. Can be layered.
                for (var key in codecDef)
                    codecOptions[key] = codecDef[key];

                if (!codecOptions.encodingName)
                    codecOptions.encodingName = enc;
                
                enc = codecDef.type;
                break;

            case "function": // Codec itself.
                if (!codecOptions.encodingName)
                    codecOptions.encodingName = enc;

                // The codec function must load all tables and return object with .encoder and .decoder methods.
                // It'll be called only once (for each different options object).
                codec = new codecDef(codecOptions, iconv);

                iconv._codecDataCache[codecOptions.encodingName] = codec; // Save it to be reused later.
                return codec;

            default:
                throw new Error("Encoding not recognized: '" + encoding + "' (searched as: '"+enc+"')");
        }
    }
}

iconv.getEncoder = function getEncoder(encoding, options) {
    var codec = iconv.getCodec(encoding),
        encoder = new codec.encoder(options, codec);

    if (codec.bomAware && options && options.addBOM)
        encoder = new bomHandling.PrependBOM(encoder, options);

    return encoder;
}

iconv.getDecoder = function getDecoder(encoding, options) {
    var codec = iconv.getCodec(encoding),
        decoder = new codec.decoder(options, codec);

    if (codec.bomAware && !(options && options.stripBOM === false))
        decoder = new bomHandling.StripBOM(decoder, options);

    return decoder;
}


// Load extensions in Node. All of them are omitted in Browserify build via 'browser' field in package.json.
var nodeVer = typeof process !== 'undefined' && process.versions && process.versions.node;
if (nodeVer) {

    // Load streaming support in Node v0.10+
    var nodeVerArr = nodeVer.split(".").map(Number);
    if (nodeVerArr[0] > 0 || nodeVerArr[1] >= 10) {
        __webpack_require__(45)(iconv);
    }

    // Load Node primitive extensions.
    __webpack_require__(46)(iconv);
}



/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var BOMChar = '\uFEFF';

exports.PrependBOM = PrependBOMWrapper
function PrependBOMWrapper(encoder, options) {
    this.encoder = encoder;
    this.addBOM = true;
}

PrependBOMWrapper.prototype.write = function(str) {
    if (this.addBOM) {
        str = BOMChar + str;
        this.addBOM = false;
    }

    return this.encoder.write(str);
}

PrependBOMWrapper.prototype.end = function() {
    return this.encoder.end();
}


//------------------------------------------------------------------------------

exports.StripBOM = StripBOMWrapper;
function StripBOMWrapper(decoder, options) {
    this.decoder = decoder;
    this.pass = false;
    this.options = options || {};
}

StripBOMWrapper.prototype.write = function(buf) {
    var res = this.decoder.write(buf);
    if (this.pass || !res)
        return res;

    if (res[0] === BOMChar) {
        res = res.slice(1);
        if (typeof this.options.stripBOM === 'function')
            this.options.stripBOM();
    }

    this.pass = true;
    return res;
}

StripBOMWrapper.prototype.end = function() {
    return this.decoder.end();
}



/***/ }),
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// Update this array if you add/rename/remove files in this directory.
// We support Browserify by skipping automatic module discovery and requiring modules directly.
var modules = [
    __webpack_require__(31),
    __webpack_require__(33),
    __webpack_require__(34),
    __webpack_require__(35),
    __webpack_require__(36),
    __webpack_require__(37),
    __webpack_require__(38),
    __webpack_require__(39),
];

// Put all encoding/alias/codec definitions to single object and export it. 
for (var i = 0; i < modules.length; i++) {
    var module = modules[i];
    for (var enc in module)
        if (Object.prototype.hasOwnProperty.call(module, enc))
            exports[enc] = module[enc];
}


/***/ }),
/* 31 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// Export Node.js internal encodings.

module.exports = {
    // Encodings
    utf8:   { type: "_internal", bomAware: true},
    cesu8:  { type: "_internal", bomAware: true},
    unicode11utf8: "utf8",

    ucs2:   { type: "_internal", bomAware: true},
    utf16le: "ucs2",

    binary: { type: "_internal" },
    base64: { type: "_internal" },
    hex:    { type: "_internal" },

    // Codec.
    _internal: InternalCodec,
};

//------------------------------------------------------------------------------

function InternalCodec(codecOptions, iconv) {
    this.enc = codecOptions.encodingName;
    this.bomAware = codecOptions.bomAware;

    if (this.enc === "base64")
        this.encoder = InternalEncoderBase64;
    else if (this.enc === "cesu8") {
        this.enc = "utf8"; // Use utf8 for decoding.
        this.encoder = InternalEncoderCesu8;

        // Add decoder for versions of Node not supporting CESU-8
        if (new Buffer("eda080", 'hex').toString().length == 3) {
            this.decoder = InternalDecoderCesu8;
            this.defaultCharUnicode = iconv.defaultCharUnicode;
        }
    }
}

InternalCodec.prototype.encoder = InternalEncoder;
InternalCodec.prototype.decoder = InternalDecoder;

//------------------------------------------------------------------------------

// We use node.js internal decoder. Its signature is the same as ours.
var StringDecoder = __webpack_require__(32).StringDecoder;

if (!StringDecoder.prototype.end) // Node v0.8 doesn't have this method.
    StringDecoder.prototype.end = function() {};


function InternalDecoder(options, codec) {
    StringDecoder.call(this, codec.enc);
}

InternalDecoder.prototype = StringDecoder.prototype;


//------------------------------------------------------------------------------
// Encoder is mostly trivial

function InternalEncoder(options, codec) {
    this.enc = codec.enc;
}

InternalEncoder.prototype.write = function(str) {
    return new Buffer(str, this.enc);
}

InternalEncoder.prototype.end = function() {
}


//------------------------------------------------------------------------------
// Except base64 encoder, which must keep its state.

function InternalEncoderBase64(options, codec) {
    this.prevStr = '';
}

InternalEncoderBase64.prototype.write = function(str) {
    str = this.prevStr + str;
    var completeQuads = str.length - (str.length % 4);
    this.prevStr = str.slice(completeQuads);
    str = str.slice(0, completeQuads);

    return new Buffer(str, "base64");
}

InternalEncoderBase64.prototype.end = function() {
    return new Buffer(this.prevStr, "base64");
}


//------------------------------------------------------------------------------
// CESU-8 encoder is also special.

function InternalEncoderCesu8(options, codec) {
}

InternalEncoderCesu8.prototype.write = function(str) {
    var buf = new Buffer(str.length * 3), bufIdx = 0;
    for (var i = 0; i < str.length; i++) {
        var charCode = str.charCodeAt(i);
        // Naive implementation, but it works because CESU-8 is especially easy
        // to convert from UTF-16 (which all JS strings are encoded in).
        if (charCode < 0x80)
            buf[bufIdx++] = charCode;
        else if (charCode < 0x800) {
            buf[bufIdx++] = 0xC0 + (charCode >>> 6);
            buf[bufIdx++] = 0x80 + (charCode & 0x3f);
        }
        else { // charCode will always be < 0x10000 in javascript.
            buf[bufIdx++] = 0xE0 + (charCode >>> 12);
            buf[bufIdx++] = 0x80 + ((charCode >>> 6) & 0x3f);
            buf[bufIdx++] = 0x80 + (charCode & 0x3f);
        }
    }
    return buf.slice(0, bufIdx);
}

InternalEncoderCesu8.prototype.end = function() {
}

//------------------------------------------------------------------------------
// CESU-8 decoder is not implemented in Node v4.0+

function InternalDecoderCesu8(options, codec) {
    this.acc = 0;
    this.contBytes = 0;
    this.accBytes = 0;
    this.defaultCharUnicode = codec.defaultCharUnicode;
}

InternalDecoderCesu8.prototype.write = function(buf) {
    var acc = this.acc, contBytes = this.contBytes, accBytes = this.accBytes, 
        res = '';
    for (var i = 0; i < buf.length; i++) {
        var curByte = buf[i];
        if ((curByte & 0xC0) !== 0x80) { // Leading byte
            if (contBytes > 0) { // Previous code is invalid
                res += this.defaultCharUnicode;
                contBytes = 0;
            }

            if (curByte < 0x80) { // Single-byte code
                res += String.fromCharCode(curByte);
            } else if (curByte < 0xE0) { // Two-byte code
                acc = curByte & 0x1F;
                contBytes = 1; accBytes = 1;
            } else if (curByte < 0xF0) { // Three-byte code
                acc = curByte & 0x0F;
                contBytes = 2; accBytes = 1;
            } else { // Four or more are not supported for CESU-8.
                res += this.defaultCharUnicode;
            }
        } else { // Continuation byte
            if (contBytes > 0) { // We're waiting for it.
                acc = (acc << 6) | (curByte & 0x3f);
                contBytes--; accBytes++;
                if (contBytes === 0) {
                    // Check for overlong encoding, but support Modified UTF-8 (encoding NULL as C0 80)
                    if (accBytes === 2 && acc < 0x80 && acc > 0)
                        res += this.defaultCharUnicode;
                    else if (accBytes === 3 && acc < 0x800)
                        res += this.defaultCharUnicode;
                    else
                        // Actually add character.
                        res += String.fromCharCode(acc);
                }
            } else { // Unexpected continuation byte
                res += this.defaultCharUnicode;
            }
        }
    }
    this.acc = acc; this.contBytes = contBytes; this.accBytes = accBytes;
    return res;
}

InternalDecoderCesu8.prototype.end = function() {
    var res = 0;
    if (this.contBytes > 0)
        res += this.defaultCharUnicode;
    return res;
}


/***/ }),
/* 32 */
/***/ (function(module, exports) {

module.exports = require("string_decoder");

/***/ }),
/* 33 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// Note: UTF16-LE (or UCS2) codec is Node.js native. See encodings/internal.js

// == UTF16-BE codec. ==========================================================

exports.utf16be = Utf16BECodec;
function Utf16BECodec() {
}

Utf16BECodec.prototype.encoder = Utf16BEEncoder;
Utf16BECodec.prototype.decoder = Utf16BEDecoder;
Utf16BECodec.prototype.bomAware = true;


// -- Encoding

function Utf16BEEncoder() {
}

Utf16BEEncoder.prototype.write = function(str) {
    var buf = new Buffer(str, 'ucs2');
    for (var i = 0; i < buf.length; i += 2) {
        var tmp = buf[i]; buf[i] = buf[i+1]; buf[i+1] = tmp;
    }
    return buf;
}

Utf16BEEncoder.prototype.end = function() {
}


// -- Decoding

function Utf16BEDecoder() {
    this.overflowByte = -1;
}

Utf16BEDecoder.prototype.write = function(buf) {
    if (buf.length == 0)
        return '';

    var buf2 = new Buffer(buf.length + 1),
        i = 0, j = 0;

    if (this.overflowByte !== -1) {
        buf2[0] = buf[0];
        buf2[1] = this.overflowByte;
        i = 1; j = 2;
    }

    for (; i < buf.length-1; i += 2, j+= 2) {
        buf2[j] = buf[i+1];
        buf2[j+1] = buf[i];
    }

    this.overflowByte = (i == buf.length-1) ? buf[buf.length-1] : -1;

    return buf2.slice(0, j).toString('ucs2');
}

Utf16BEDecoder.prototype.end = function() {
}


// == UTF-16 codec =============================================================
// Decoder chooses automatically from UTF-16LE and UTF-16BE using BOM and space-based heuristic.
// Defaults to UTF-16LE, as it's prevalent and default in Node.
// http://en.wikipedia.org/wiki/UTF-16 and http://encoding.spec.whatwg.org/#utf-16le
// Decoder default can be changed: iconv.decode(buf, 'utf16', {defaultEncoding: 'utf-16be'});

// Encoder uses UTF-16LE and prepends BOM (which can be overridden with addBOM: false).

exports.utf16 = Utf16Codec;
function Utf16Codec(codecOptions, iconv) {
    this.iconv = iconv;
}

Utf16Codec.prototype.encoder = Utf16Encoder;
Utf16Codec.prototype.decoder = Utf16Decoder;


// -- Encoding (pass-through)

function Utf16Encoder(options, codec) {
    options = options || {};
    if (options.addBOM === undefined)
        options.addBOM = true;
    this.encoder = codec.iconv.getEncoder('utf-16le', options);
}

Utf16Encoder.prototype.write = function(str) {
    return this.encoder.write(str);
}

Utf16Encoder.prototype.end = function() {
    return this.encoder.end();
}


// -- Decoding

function Utf16Decoder(options, codec) {
    this.decoder = null;
    this.initialBytes = [];
    this.initialBytesLen = 0;

    this.options = options || {};
    this.iconv = codec.iconv;
}

Utf16Decoder.prototype.write = function(buf) {
    if (!this.decoder) {
        // Codec is not chosen yet. Accumulate initial bytes.
        this.initialBytes.push(buf);
        this.initialBytesLen += buf.length;
        
        if (this.initialBytesLen < 16) // We need more bytes to use space heuristic (see below)
            return '';

        // We have enough bytes -> detect endianness.
        var buf = Buffer.concat(this.initialBytes),
            encoding = detectEncoding(buf, this.options.defaultEncoding);
        this.decoder = this.iconv.getDecoder(encoding, this.options);
        this.initialBytes.length = this.initialBytesLen = 0;
    }

    return this.decoder.write(buf);
}

Utf16Decoder.prototype.end = function() {
    if (!this.decoder) {
        var buf = Buffer.concat(this.initialBytes),
            encoding = detectEncoding(buf, this.options.defaultEncoding);
        this.decoder = this.iconv.getDecoder(encoding, this.options);

        var res = this.decoder.write(buf),
            trail = this.decoder.end();

        return trail ? (res + trail) : res;
    }
    return this.decoder.end();
}

function detectEncoding(buf, defaultEncoding) {
    var enc = defaultEncoding || 'utf-16le';

    if (buf.length >= 2) {
        // Check BOM.
        if (buf[0] == 0xFE && buf[1] == 0xFF) // UTF-16BE BOM
            enc = 'utf-16be';
        else if (buf[0] == 0xFF && buf[1] == 0xFE) // UTF-16LE BOM
            enc = 'utf-16le';
        else {
            // No BOM found. Try to deduce encoding from initial content.
            // Most of the time, the content has ASCII chars (U+00**), but the opposite (U+**00) is uncommon.
            // So, we count ASCII as if it was LE or BE, and decide from that.
            var asciiCharsLE = 0, asciiCharsBE = 0, // Counts of chars in both positions
                _len = Math.min(buf.length - (buf.length % 2), 64); // Len is always even.

            for (var i = 0; i < _len; i += 2) {
                if (buf[i] === 0 && buf[i+1] !== 0) asciiCharsBE++;
                if (buf[i] !== 0 && buf[i+1] === 0) asciiCharsLE++;
            }

            if (asciiCharsBE > asciiCharsLE)
                enc = 'utf-16be';
            else if (asciiCharsBE < asciiCharsLE)
                enc = 'utf-16le';
        }
    }

    return enc;
}




/***/ }),
/* 34 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// UTF-7 codec, according to https://tools.ietf.org/html/rfc2152
// See also below a UTF-7-IMAP codec, according to http://tools.ietf.org/html/rfc3501#section-5.1.3

exports.utf7 = Utf7Codec;
exports.unicode11utf7 = 'utf7'; // Alias UNICODE-1-1-UTF-7
function Utf7Codec(codecOptions, iconv) {
    this.iconv = iconv;
};

Utf7Codec.prototype.encoder = Utf7Encoder;
Utf7Codec.prototype.decoder = Utf7Decoder;
Utf7Codec.prototype.bomAware = true;


// -- Encoding

var nonDirectChars = /[^A-Za-z0-9'\(\),-\.\/:\? \n\r\t]+/g;

function Utf7Encoder(options, codec) {
    this.iconv = codec.iconv;
}

Utf7Encoder.prototype.write = function(str) {
    // Naive implementation.
    // Non-direct chars are encoded as "+<base64>-"; single "+" char is encoded as "+-".
    return new Buffer(str.replace(nonDirectChars, function(chunk) {
        return "+" + (chunk === '+' ? '' : 
            this.iconv.encode(chunk, 'utf16-be').toString('base64').replace(/=+$/, '')) 
            + "-";
    }.bind(this)));
}

Utf7Encoder.prototype.end = function() {
}


// -- Decoding

function Utf7Decoder(options, codec) {
    this.iconv = codec.iconv;
    this.inBase64 = false;
    this.base64Accum = '';
}

var base64Regex = /[A-Za-z0-9\/+]/;
var base64Chars = [];
for (var i = 0; i < 256; i++)
    base64Chars[i] = base64Regex.test(String.fromCharCode(i));

var plusChar = '+'.charCodeAt(0), 
    minusChar = '-'.charCodeAt(0),
    andChar = '&'.charCodeAt(0);

Utf7Decoder.prototype.write = function(buf) {
    var res = "", lastI = 0,
        inBase64 = this.inBase64,
        base64Accum = this.base64Accum;

    // The decoder is more involved as we must handle chunks in stream.

    for (var i = 0; i < buf.length; i++) {
        if (!inBase64) { // We're in direct mode.
            // Write direct chars until '+'
            if (buf[i] == plusChar) {
                res += this.iconv.decode(buf.slice(lastI, i), "ascii"); // Write direct chars.
                lastI = i+1;
                inBase64 = true;
            }
        } else { // We decode base64.
            if (!base64Chars[buf[i]]) { // Base64 ended.
                if (i == lastI && buf[i] == minusChar) {// "+-" -> "+"
                    res += "+";
                } else {
                    var b64str = base64Accum + buf.slice(lastI, i).toString();
                    res += this.iconv.decode(new Buffer(b64str, 'base64'), "utf16-be");
                }

                if (buf[i] != minusChar) // Minus is absorbed after base64.
                    i--;

                lastI = i+1;
                inBase64 = false;
                base64Accum = '';
            }
        }
    }

    if (!inBase64) {
        res += this.iconv.decode(buf.slice(lastI), "ascii"); // Write direct chars.
    } else {
        var b64str = base64Accum + buf.slice(lastI).toString();

        var canBeDecoded = b64str.length - (b64str.length % 8); // Minimal chunk: 2 quads -> 2x3 bytes -> 3 chars.
        base64Accum = b64str.slice(canBeDecoded); // The rest will be decoded in future.
        b64str = b64str.slice(0, canBeDecoded);

        res += this.iconv.decode(new Buffer(b64str, 'base64'), "utf16-be");
    }

    this.inBase64 = inBase64;
    this.base64Accum = base64Accum;

    return res;
}

Utf7Decoder.prototype.end = function() {
    var res = "";
    if (this.inBase64 && this.base64Accum.length > 0)
        res = this.iconv.decode(new Buffer(this.base64Accum, 'base64'), "utf16-be");

    this.inBase64 = false;
    this.base64Accum = '';
    return res;
}


// UTF-7-IMAP codec.
// RFC3501 Sec. 5.1.3 Modified UTF-7 (http://tools.ietf.org/html/rfc3501#section-5.1.3)
// Differences:
//  * Base64 part is started by "&" instead of "+"
//  * Direct characters are 0x20-0x7E, except "&" (0x26)
//  * In Base64, "," is used instead of "/"
//  * Base64 must not be used to represent direct characters.
//  * No implicit shift back from Base64 (should always end with '-')
//  * String must end in non-shifted position.
//  * "-&" while in base64 is not allowed.


exports.utf7imap = Utf7IMAPCodec;
function Utf7IMAPCodec(codecOptions, iconv) {
    this.iconv = iconv;
};

Utf7IMAPCodec.prototype.encoder = Utf7IMAPEncoder;
Utf7IMAPCodec.prototype.decoder = Utf7IMAPDecoder;
Utf7IMAPCodec.prototype.bomAware = true;


// -- Encoding

function Utf7IMAPEncoder(options, codec) {
    this.iconv = codec.iconv;
    this.inBase64 = false;
    this.base64Accum = new Buffer(6);
    this.base64AccumIdx = 0;
}

Utf7IMAPEncoder.prototype.write = function(str) {
    var inBase64 = this.inBase64,
        base64Accum = this.base64Accum,
        base64AccumIdx = this.base64AccumIdx,
        buf = new Buffer(str.length*5 + 10), bufIdx = 0;

    for (var i = 0; i < str.length; i++) {
        var uChar = str.charCodeAt(i);
        if (0x20 <= uChar && uChar <= 0x7E) { // Direct character or '&'.
            if (inBase64) {
                if (base64AccumIdx > 0) {
                    bufIdx += buf.write(base64Accum.slice(0, base64AccumIdx).toString('base64').replace(/\//g, ',').replace(/=+$/, ''), bufIdx);
                    base64AccumIdx = 0;
                }

                buf[bufIdx++] = minusChar; // Write '-', then go to direct mode.
                inBase64 = false;
            }

            if (!inBase64) {
                buf[bufIdx++] = uChar; // Write direct character

                if (uChar === andChar)  // Ampersand -> '&-'
                    buf[bufIdx++] = minusChar;
            }

        } else { // Non-direct character
            if (!inBase64) {
                buf[bufIdx++] = andChar; // Write '&', then go to base64 mode.
                inBase64 = true;
            }
            if (inBase64) {
                base64Accum[base64AccumIdx++] = uChar >> 8;
                base64Accum[base64AccumIdx++] = uChar & 0xFF;

                if (base64AccumIdx == base64Accum.length) {
                    bufIdx += buf.write(base64Accum.toString('base64').replace(/\//g, ','), bufIdx);
                    base64AccumIdx = 0;
                }
            }
        }
    }

    this.inBase64 = inBase64;
    this.base64AccumIdx = base64AccumIdx;

    return buf.slice(0, bufIdx);
}

Utf7IMAPEncoder.prototype.end = function() {
    var buf = new Buffer(10), bufIdx = 0;
    if (this.inBase64) {
        if (this.base64AccumIdx > 0) {
            bufIdx += buf.write(this.base64Accum.slice(0, this.base64AccumIdx).toString('base64').replace(/\//g, ',').replace(/=+$/, ''), bufIdx);
            this.base64AccumIdx = 0;
        }

        buf[bufIdx++] = minusChar; // Write '-', then go to direct mode.
        this.inBase64 = false;
    }

    return buf.slice(0, bufIdx);
}


// -- Decoding

function Utf7IMAPDecoder(options, codec) {
    this.iconv = codec.iconv;
    this.inBase64 = false;
    this.base64Accum = '';
}

var base64IMAPChars = base64Chars.slice();
base64IMAPChars[','.charCodeAt(0)] = true;

Utf7IMAPDecoder.prototype.write = function(buf) {
    var res = "", lastI = 0,
        inBase64 = this.inBase64,
        base64Accum = this.base64Accum;

    // The decoder is more involved as we must handle chunks in stream.
    // It is forgiving, closer to standard UTF-7 (for example, '-' is optional at the end).

    for (var i = 0; i < buf.length; i++) {
        if (!inBase64) { // We're in direct mode.
            // Write direct chars until '&'
            if (buf[i] == andChar) {
                res += this.iconv.decode(buf.slice(lastI, i), "ascii"); // Write direct chars.
                lastI = i+1;
                inBase64 = true;
            }
        } else { // We decode base64.
            if (!base64IMAPChars[buf[i]]) { // Base64 ended.
                if (i == lastI && buf[i] == minusChar) { // "&-" -> "&"
                    res += "&";
                } else {
                    var b64str = base64Accum + buf.slice(lastI, i).toString().replace(/,/g, '/');
                    res += this.iconv.decode(new Buffer(b64str, 'base64'), "utf16-be");
                }

                if (buf[i] != minusChar) // Minus may be absorbed after base64.
                    i--;

                lastI = i+1;
                inBase64 = false;
                base64Accum = '';
            }
        }
    }

    if (!inBase64) {
        res += this.iconv.decode(buf.slice(lastI), "ascii"); // Write direct chars.
    } else {
        var b64str = base64Accum + buf.slice(lastI).toString().replace(/,/g, '/');

        var canBeDecoded = b64str.length - (b64str.length % 8); // Minimal chunk: 2 quads -> 2x3 bytes -> 3 chars.
        base64Accum = b64str.slice(canBeDecoded); // The rest will be decoded in future.
        b64str = b64str.slice(0, canBeDecoded);

        res += this.iconv.decode(new Buffer(b64str, 'base64'), "utf16-be");
    }

    this.inBase64 = inBase64;
    this.base64Accum = base64Accum;

    return res;
}

Utf7IMAPDecoder.prototype.end = function() {
    var res = "";
    if (this.inBase64 && this.base64Accum.length > 0)
        res = this.iconv.decode(new Buffer(this.base64Accum, 'base64'), "utf16-be");

    this.inBase64 = false;
    this.base64Accum = '';
    return res;
}




/***/ }),
/* 35 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// Single-byte codec. Needs a 'chars' string parameter that contains 256 or 128 chars that
// correspond to encoded bytes (if 128 - then lower half is ASCII). 

exports._sbcs = SBCSCodec;
function SBCSCodec(codecOptions, iconv) {
    if (!codecOptions)
        throw new Error("SBCS codec is called without the data.")
    
    // Prepare char buffer for decoding.
    if (!codecOptions.chars || (codecOptions.chars.length !== 128 && codecOptions.chars.length !== 256))
        throw new Error("Encoding '"+codecOptions.type+"' has incorrect 'chars' (must be of len 128 or 256)");
    
    if (codecOptions.chars.length === 128) {
        var asciiString = "";
        for (var i = 0; i < 128; i++)
            asciiString += String.fromCharCode(i);
        codecOptions.chars = asciiString + codecOptions.chars;
    }

    this.decodeBuf = new Buffer(codecOptions.chars, 'ucs2');
    
    // Encoding buffer.
    var encodeBuf = new Buffer(65536);
    encodeBuf.fill(iconv.defaultCharSingleByte.charCodeAt(0));

    for (var i = 0; i < codecOptions.chars.length; i++)
        encodeBuf[codecOptions.chars.charCodeAt(i)] = i;

    this.encodeBuf = encodeBuf;
}

SBCSCodec.prototype.encoder = SBCSEncoder;
SBCSCodec.prototype.decoder = SBCSDecoder;


function SBCSEncoder(options, codec) {
    this.encodeBuf = codec.encodeBuf;
}

SBCSEncoder.prototype.write = function(str) {
    var buf = new Buffer(str.length);
    for (var i = 0; i < str.length; i++)
        buf[i] = this.encodeBuf[str.charCodeAt(i)];
    
    return buf;
}

SBCSEncoder.prototype.end = function() {
}


function SBCSDecoder(options, codec) {
    this.decodeBuf = codec.decodeBuf;
}

SBCSDecoder.prototype.write = function(buf) {
    // Strings are immutable in JS -> we use ucs2 buffer to speed up computations.
    var decodeBuf = this.decodeBuf;
    var newBuf = new Buffer(buf.length*2);
    var idx1 = 0, idx2 = 0;
    for (var i = 0; i < buf.length; i++) {
        idx1 = buf[i]*2; idx2 = i*2;
        newBuf[idx2] = decodeBuf[idx1];
        newBuf[idx2+1] = decodeBuf[idx1+1];
    }
    return newBuf.toString('ucs2');
}

SBCSDecoder.prototype.end = function() {
}


/***/ }),
/* 36 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// Manually added data to be used by sbcs codec in addition to generated one.

module.exports = {
    // Not supported by iconv, not sure why.
    "10029": "maccenteuro",
    "maccenteuro": {
        "type": "_sbcs",
        "chars": "ÄĀāÉĄÖÜáąČäčĆćéŹźĎíďĒēĖóėôöõúĚěü†°Ę£§•¶ß®©™ę¨≠ģĮįĪ≤≥īĶ∂∑łĻļĽľĹĺŅņŃ¬√ńŇ∆«»… ňŐÕőŌ–—“”‘’÷◊ōŔŕŘ‹›řŖŗŠ‚„šŚśÁŤťÍŽžŪÓÔūŮÚůŰűŲųÝýķŻŁżĢˇ"
    },

    "808": "cp808",
    "ibm808": "cp808",
    "cp808": {
        "type": "_sbcs",
        "chars": "АБВГДЕЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯабвгдежзийклмноп░▒▓│┤╡╢╖╕╣║╗╝╜╛┐└┴┬├─┼╞╟╚╔╩╦╠═╬╧╨╤╥╙╘╒╓╫╪┘┌█▄▌▐▀рстуфхцчшщъыьэюяЁёЄєЇїЎў°∙·√№€■ "
    },

    // Aliases of generated encodings.
    "ascii8bit": "ascii",
    "usascii": "ascii",
    "ansix34": "ascii",
    "ansix341968": "ascii",
    "ansix341986": "ascii",
    "csascii": "ascii",
    "cp367": "ascii",
    "ibm367": "ascii",
    "isoir6": "ascii",
    "iso646us": "ascii",
    "iso646irv": "ascii",
    "us": "ascii",

    "latin1": "iso88591",
    "latin2": "iso88592",
    "latin3": "iso88593",
    "latin4": "iso88594",
    "latin5": "iso88599",
    "latin6": "iso885910",
    "latin7": "iso885913",
    "latin8": "iso885914",
    "latin9": "iso885915",
    "latin10": "iso885916",

    "csisolatin1": "iso88591",
    "csisolatin2": "iso88592",
    "csisolatin3": "iso88593",
    "csisolatin4": "iso88594",
    "csisolatincyrillic": "iso88595",
    "csisolatinarabic": "iso88596",
    "csisolatingreek" : "iso88597",
    "csisolatinhebrew": "iso88598",
    "csisolatin5": "iso88599",
    "csisolatin6": "iso885910",

    "l1": "iso88591",
    "l2": "iso88592",
    "l3": "iso88593",
    "l4": "iso88594",
    "l5": "iso88599",
    "l6": "iso885910",
    "l7": "iso885913",
    "l8": "iso885914",
    "l9": "iso885915",
    "l10": "iso885916",

    "isoir14": "iso646jp",
    "isoir57": "iso646cn",
    "isoir100": "iso88591",
    "isoir101": "iso88592",
    "isoir109": "iso88593",
    "isoir110": "iso88594",
    "isoir144": "iso88595",
    "isoir127": "iso88596",
    "isoir126": "iso88597",
    "isoir138": "iso88598",
    "isoir148": "iso88599",
    "isoir157": "iso885910",
    "isoir166": "tis620",
    "isoir179": "iso885913",
    "isoir199": "iso885914",
    "isoir203": "iso885915",
    "isoir226": "iso885916",

    "cp819": "iso88591",
    "ibm819": "iso88591",

    "cyrillic": "iso88595",

    "arabic": "iso88596",
    "arabic8": "iso88596",
    "ecma114": "iso88596",
    "asmo708": "iso88596",

    "greek" : "iso88597",
    "greek8" : "iso88597",
    "ecma118" : "iso88597",
    "elot928" : "iso88597",

    "hebrew": "iso88598",
    "hebrew8": "iso88598",

    "turkish": "iso88599",
    "turkish8": "iso88599",

    "thai": "iso885911",
    "thai8": "iso885911",

    "celtic": "iso885914",
    "celtic8": "iso885914",
    "isoceltic": "iso885914",

    "tis6200": "tis620",
    "tis62025291": "tis620",
    "tis62025330": "tis620",

    "10000": "macroman",
    "10006": "macgreek",
    "10007": "maccyrillic",
    "10079": "maciceland",
    "10081": "macturkish",

    "cspc8codepage437": "cp437",
    "cspc775baltic": "cp775",
    "cspc850multilingual": "cp850",
    "cspcp852": "cp852",
    "cspc862latinhebrew": "cp862",
    "cpgr": "cp869",

    "msee": "cp1250",
    "mscyrl": "cp1251",
    "msansi": "cp1252",
    "msgreek": "cp1253",
    "msturk": "cp1254",
    "mshebr": "cp1255",
    "msarab": "cp1256",
    "winbaltrim": "cp1257",

    "cp20866": "koi8r",
    "20866": "koi8r",
    "ibm878": "koi8r",
    "cskoi8r": "koi8r",

    "cp21866": "koi8u",
    "21866": "koi8u",
    "ibm1168": "koi8u",

    "strk10482002": "rk1048",

    "tcvn5712": "tcvn",
    "tcvn57121": "tcvn",

    "gb198880": "iso646cn",
    "cn": "iso646cn",

    "csiso14jisc6220ro": "iso646jp",
    "jisc62201969ro": "iso646jp",
    "jp": "iso646jp",

    "cshproman8": "hproman8",
    "r8": "hproman8",
    "roman8": "hproman8",
    "xroman8": "hproman8",
    "ibm1051": "hproman8",

    "mac": "macintosh",
    "csmacintosh": "macintosh",
};



/***/ }),
/* 37 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// Generated data for sbcs codec. Don't edit manually. Regenerate using generation/gen-sbcs.js script.
module.exports = {
  "437": "cp437",
  "737": "cp737",
  "775": "cp775",
  "850": "cp850",
  "852": "cp852",
  "855": "cp855",
  "856": "cp856",
  "857": "cp857",
  "858": "cp858",
  "860": "cp860",
  "861": "cp861",
  "862": "cp862",
  "863": "cp863",
  "864": "cp864",
  "865": "cp865",
  "866": "cp866",
  "869": "cp869",
  "874": "windows874",
  "922": "cp922",
  "1046": "cp1046",
  "1124": "cp1124",
  "1125": "cp1125",
  "1129": "cp1129",
  "1133": "cp1133",
  "1161": "cp1161",
  "1162": "cp1162",
  "1163": "cp1163",
  "1250": "windows1250",
  "1251": "windows1251",
  "1252": "windows1252",
  "1253": "windows1253",
  "1254": "windows1254",
  "1255": "windows1255",
  "1256": "windows1256",
  "1257": "windows1257",
  "1258": "windows1258",
  "28591": "iso88591",
  "28592": "iso88592",
  "28593": "iso88593",
  "28594": "iso88594",
  "28595": "iso88595",
  "28596": "iso88596",
  "28597": "iso88597",
  "28598": "iso88598",
  "28599": "iso88599",
  "28600": "iso885910",
  "28601": "iso885911",
  "28603": "iso885913",
  "28604": "iso885914",
  "28605": "iso885915",
  "28606": "iso885916",
  "windows874": {
    "type": "_sbcs",
    "chars": "€����…�����������‘’“”•–—�������� กขฃคฅฆงจฉชซฌญฎฏฐฑฒณดตถทธนบปผฝพฟภมยรฤลฦวศษสหฬอฮฯะัาำิีึืฺุู����฿เแโใไๅๆ็่้๊๋์ํ๎๏๐๑๒๓๔๕๖๗๘๙๚๛����"
  },
  "win874": "windows874",
  "cp874": "windows874",
  "windows1250": {
    "type": "_sbcs",
    "chars": "€�‚�„…†‡�‰Š‹ŚŤŽŹ�‘’“”•–—�™š›śťžź ˇ˘Ł¤Ą¦§¨©Ş«¬­®Ż°±˛ł´µ¶·¸ąş»Ľ˝ľżŔÁÂĂÄĹĆÇČÉĘËĚÍÎĎĐŃŇÓÔŐÖ×ŘŮÚŰÜÝŢßŕáâăäĺćçčéęëěíîďđńňóôőö÷řůúűüýţ˙"
  },
  "win1250": "windows1250",
  "cp1250": "windows1250",
  "windows1251": {
    "type": "_sbcs",
    "chars": "ЂЃ‚ѓ„…†‡€‰Љ‹ЊЌЋЏђ‘’“”•–—�™љ›њќћџ ЎўЈ¤Ґ¦§Ё©Є«¬­®Ї°±Ііґµ¶·ё№є»јЅѕїАБВГДЕЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯабвгдежзийклмнопрстуфхцчшщъыьэюя"
  },
  "win1251": "windows1251",
  "cp1251": "windows1251",
  "windows1252": {
    "type": "_sbcs",
    "chars": "€�‚ƒ„…†‡ˆ‰Š‹Œ�Ž��‘’“”•–—˜™š›œ�žŸ ¡¢£¤¥¦§¨©ª«¬­®¯°±²³´µ¶·¸¹º»¼½¾¿ÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖ×ØÙÚÛÜÝÞßàáâãäåæçèéêëìíîïðñòóôõö÷øùúûüýþÿ"
  },
  "win1252": "windows1252",
  "cp1252": "windows1252",
  "windows1253": {
    "type": "_sbcs",
    "chars": "€�‚ƒ„…†‡�‰�‹�����‘’“”•–—�™�›���� ΅Ά£¤¥¦§¨©�«¬­®―°±²³΄µ¶·ΈΉΊ»Ό½ΎΏΐΑΒΓΔΕΖΗΘΙΚΛΜΝΞΟΠΡ�ΣΤΥΦΧΨΩΪΫάέήίΰαβγδεζηθικλμνξοπρςστυφχψωϊϋόύώ�"
  },
  "win1253": "windows1253",
  "cp1253": "windows1253",
  "windows1254": {
    "type": "_sbcs",
    "chars": "€�‚ƒ„…†‡ˆ‰Š‹Œ����‘’“”•–—˜™š›œ��Ÿ ¡¢£¤¥¦§¨©ª«¬­®¯°±²³´µ¶·¸¹º»¼½¾¿ÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏĞÑÒÓÔÕÖ×ØÙÚÛÜİŞßàáâãäåæçèéêëìíîïğñòóôõö÷øùúûüışÿ"
  },
  "win1254": "windows1254",
  "cp1254": "windows1254",
  "windows1255": {
    "type": "_sbcs",
    "chars": "€�‚ƒ„…†‡ˆ‰�‹�����‘’“”•–—˜™�›���� ¡¢£₪¥¦§¨©×«¬­®¯°±²³´µ¶·¸¹÷»¼½¾¿ְֱֲֳִֵֶַָֹ�ֻּֽ־ֿ׀ׁׂ׃װױײ׳״�������אבגדהוזחטיךכלםמןנסעףפץצקרשת��‎‏�"
  },
  "win1255": "windows1255",
  "cp1255": "windows1255",
  "windows1256": {
    "type": "_sbcs",
    "chars": "€پ‚ƒ„…†‡ˆ‰ٹ‹Œچژڈگ‘’“”•–—ک™ڑ›œ‌‍ں ،¢£¤¥¦§¨©ھ«¬­®¯°±²³´µ¶·¸¹؛»¼½¾؟ہءآأؤإئابةتثجحخدذرزسشصض×طظعغـفقكàلâمنهوçèéêëىيîïًٌٍَôُِ÷ّùْûü‎‏ے"
  },
  "win1256": "windows1256",
  "cp1256": "windows1256",
  "windows1257": {
    "type": "_sbcs",
    "chars": "€�‚�„…†‡�‰�‹�¨ˇ¸�‘’“”•–—�™�›�¯˛� �¢£¤�¦§Ø©Ŗ«¬­®Æ°±²³´µ¶·ø¹ŗ»¼½¾æĄĮĀĆÄÅĘĒČÉŹĖĢĶĪĻŠŃŅÓŌÕÖ×ŲŁŚŪÜŻŽßąįāćäåęēčéźėģķīļšńņóōõö÷ųłśūüżž˙"
  },
  "win1257": "windows1257",
  "cp1257": "windows1257",
  "windows1258": {
    "type": "_sbcs",
    "chars": "€�‚ƒ„…†‡ˆ‰�‹Œ����‘’“”•–—˜™�›œ��Ÿ ¡¢£¤¥¦§¨©ª«¬­®¯°±²³´µ¶·¸¹º»¼½¾¿ÀÁÂĂÄÅÆÇÈÉÊË̀ÍÎÏĐÑ̉ÓÔƠÖ×ØÙÚÛÜỮßàáâăäåæçèéêë́íîïđṇ̃óôơö÷øùúûüư₫ÿ"
  },
  "win1258": "windows1258",
  "cp1258": "windows1258",
  "iso88591": {
    "type": "_sbcs",
    "chars": " ¡¢£¤¥¦§¨©ª«¬­®¯°±²³´µ¶·¸¹º»¼½¾¿ÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖ×ØÙÚÛÜÝÞßàáâãäåæçèéêëìíîïðñòóôõö÷øùúûüýþÿ"
  },
  "cp28591": "iso88591",
  "iso88592": {
    "type": "_sbcs",
    "chars": " Ą˘Ł¤ĽŚ§¨ŠŞŤŹ­ŽŻ°ą˛ł´ľśˇ¸šşťź˝žżŔÁÂĂÄĹĆÇČÉĘËĚÍÎĎĐŃŇÓÔŐÖ×ŘŮÚŰÜÝŢßŕáâăäĺćçčéęëěíîďđńňóôőö÷řůúűüýţ˙"
  },
  "cp28592": "iso88592",
  "iso88593": {
    "type": "_sbcs",
    "chars": " Ħ˘£¤�Ĥ§¨İŞĞĴ­�Ż°ħ²³´µĥ·¸ışğĵ½�żÀÁÂ�ÄĊĈÇÈÉÊËÌÍÎÏ�ÑÒÓÔĠÖ×ĜÙÚÛÜŬŜßàáâ�äċĉçèéêëìíîï�ñòóôġö÷ĝùúûüŭŝ˙"
  },
  "cp28593": "iso88593",
  "iso88594": {
    "type": "_sbcs",
    "chars": " ĄĸŖ¤ĨĻ§¨ŠĒĢŦ­Ž¯°ą˛ŗ´ĩļˇ¸šēģŧŊžŋĀÁÂÃÄÅÆĮČÉĘËĖÍÎĪĐŅŌĶÔÕÖ×ØŲÚÛÜŨŪßāáâãäåæįčéęëėíîīđņōķôõö÷øųúûüũū˙"
  },
  "cp28594": "iso88594",
  "iso88595": {
    "type": "_sbcs",
    "chars": " ЁЂЃЄЅІЇЈЉЊЋЌ­ЎЏАБВГДЕЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯабвгдежзийклмнопрстуфхцчшщъыьэюя№ёђѓєѕіїјљњћќ§ўџ"
  },
  "cp28595": "iso88595",
  "iso88596": {
    "type": "_sbcs",
    "chars": " ���¤�������،­�������������؛���؟�ءآأؤإئابةتثجحخدذرزسشصضطظعغ�����ـفقكلمنهوىيًٌٍَُِّْ�������������"
  },
  "cp28596": "iso88596",
  "iso88597": {
    "type": "_sbcs",
    "chars": " ‘’£€₯¦§¨©ͺ«¬­�―°±²³΄΅Ά·ΈΉΊ»Ό½ΎΏΐΑΒΓΔΕΖΗΘΙΚΛΜΝΞΟΠΡ�ΣΤΥΦΧΨΩΪΫάέήίΰαβγδεζηθικλμνξοπρςστυφχψωϊϋόύώ�"
  },
  "cp28597": "iso88597",
  "iso88598": {
    "type": "_sbcs",
    "chars": " �¢£¤¥¦§¨©×«¬­®¯°±²³´µ¶·¸¹÷»¼½¾��������������������������������‗אבגדהוזחטיךכלםמןנסעףפץצקרשת��‎‏�"
  },
  "cp28598": "iso88598",
  "iso88599": {
    "type": "_sbcs",
    "chars": " ¡¢£¤¥¦§¨©ª«¬­®¯°±²³´µ¶·¸¹º»¼½¾¿ÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏĞÑÒÓÔÕÖ×ØÙÚÛÜİŞßàáâãäåæçèéêëìíîïğñòóôõö÷øùúûüışÿ"
  },
  "cp28599": "iso88599",
  "iso885910": {
    "type": "_sbcs",
    "chars": " ĄĒĢĪĨĶ§ĻĐŠŦŽ­ŪŊ°ąēģīĩķ·ļđšŧž―ūŋĀÁÂÃÄÅÆĮČÉĘËĖÍÎÏÐŅŌÓÔÕÖŨØŲÚÛÜÝÞßāáâãäåæįčéęëėíîïðņōóôõöũøųúûüýþĸ"
  },
  "cp28600": "iso885910",
  "iso885911": {
    "type": "_sbcs",
    "chars": " กขฃคฅฆงจฉชซฌญฎฏฐฑฒณดตถทธนบปผฝพฟภมยรฤลฦวศษสหฬอฮฯะัาำิีึืฺุู����฿เแโใไๅๆ็่้๊๋์ํ๎๏๐๑๒๓๔๕๖๗๘๙๚๛����"
  },
  "cp28601": "iso885911",
  "iso885913": {
    "type": "_sbcs",
    "chars": " ”¢£¤„¦§Ø©Ŗ«¬­®Æ°±²³“µ¶·ø¹ŗ»¼½¾æĄĮĀĆÄÅĘĒČÉŹĖĢĶĪĻŠŃŅÓŌÕÖ×ŲŁŚŪÜŻŽßąįāćäåęēčéźėģķīļšńņóōõö÷ųłśūüżž’"
  },
  "cp28603": "iso885913",
  "iso885914": {
    "type": "_sbcs",
    "chars": " Ḃḃ£ĊċḊ§Ẁ©ẂḋỲ­®ŸḞḟĠġṀṁ¶ṖẁṗẃṠỳẄẅṡÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏŴÑÒÓÔÕÖṪØÙÚÛÜÝŶßàáâãäåæçèéêëìíîïŵñòóôõöṫøùúûüýŷÿ"
  },
  "cp28604": "iso885914",
  "iso885915": {
    "type": "_sbcs",
    "chars": " ¡¢£€¥Š§š©ª«¬­®¯°±²³Žµ¶·ž¹º»ŒœŸ¿ÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖ×ØÙÚÛÜÝÞßàáâãäåæçèéêëìíîïðñòóôõö÷øùúûüýþÿ"
  },
  "cp28605": "iso885915",
  "iso885916": {
    "type": "_sbcs",
    "chars": " ĄąŁ€„Š§š©Ș«Ź­źŻ°±ČłŽ”¶·žčș»ŒœŸżÀÁÂĂÄĆÆÇÈÉÊËÌÍÎÏĐŃÒÓÔŐÖŚŰÙÚÛÜĘȚßàáâăäćæçèéêëìíîïđńòóôőöśűùúûüęțÿ"
  },
  "cp28606": "iso885916",
  "cp437": {
    "type": "_sbcs",
    "chars": "ÇüéâäàåçêëèïîìÄÅÉæÆôöòûùÿÖÜ¢£¥₧ƒáíóúñÑªº¿⌐¬½¼¡«»░▒▓│┤╡╢╖╕╣║╗╝╜╛┐└┴┬├─┼╞╟╚╔╩╦╠═╬╧╨╤╥╙╘╒╓╫╪┘┌█▄▌▐▀αßΓπΣσµτΦΘΩδ∞φε∩≡±≥≤⌠⌡÷≈°∙·√ⁿ²■ "
  },
  "ibm437": "cp437",
  "csibm437": "cp437",
  "cp737": {
    "type": "_sbcs",
    "chars": "ΑΒΓΔΕΖΗΘΙΚΛΜΝΞΟΠΡΣΤΥΦΧΨΩαβγδεζηθικλμνξοπρσςτυφχψ░▒▓│┤╡╢╖╕╣║╗╝╜╛┐└┴┬├─┼╞╟╚╔╩╦╠═╬╧╨╤╥╙╘╒╓╫╪┘┌█▄▌▐▀ωάέήϊίόύϋώΆΈΉΊΌΎΏ±≥≤ΪΫ÷≈°∙·√ⁿ²■ "
  },
  "ibm737": "cp737",
  "csibm737": "cp737",
  "cp775": {
    "type": "_sbcs",
    "chars": "ĆüéāäģåćłēŖŗīŹÄÅÉæÆōöĢ¢ŚśÖÜø£Ø×¤ĀĪóŻżź”¦©®¬½¼Ł«»░▒▓│┤ĄČĘĖ╣║╗╝ĮŠ┐└┴┬├─┼ŲŪ╚╔╩╦╠═╬Žąčęėįšųūž┘┌█▄▌▐▀ÓßŌŃõÕµńĶķĻļņĒŅ’­±“¾¶§÷„°∙·¹³²■ "
  },
  "ibm775": "cp775",
  "csibm775": "cp775",
  "cp850": {
    "type": "_sbcs",
    "chars": "ÇüéâäàåçêëèïîìÄÅÉæÆôöòûùÿÖÜø£Ø×ƒáíóúñÑªº¿®¬½¼¡«»░▒▓│┤ÁÂÀ©╣║╗╝¢¥┐└┴┬├─┼ãÃ╚╔╩╦╠═╬¤ðÐÊËÈıÍÎÏ┘┌█▄¦Ì▀ÓßÔÒõÕµþÞÚÛÙýÝ¯´­±‗¾¶§÷¸°¨·¹³²■ "
  },
  "ibm850": "cp850",
  "csibm850": "cp850",
  "cp852": {
    "type": "_sbcs",
    "chars": "ÇüéâäůćçłëŐőîŹÄĆÉĹĺôöĽľŚśÖÜŤťŁ×čáíóúĄąŽžĘę¬źČş«»░▒▓│┤ÁÂĚŞ╣║╗╝Żż┐└┴┬├─┼Ăă╚╔╩╦╠═╬¤đĐĎËďŇÍÎě┘┌█▄ŢŮ▀ÓßÔŃńňŠšŔÚŕŰýÝţ´­˝˛ˇ˘§÷¸°¨˙űŘř■ "
  },
  "ibm852": "cp852",
  "csibm852": "cp852",
  "cp855": {
    "type": "_sbcs",
    "chars": "ђЂѓЃёЁєЄѕЅіІїЇјЈљЉњЊћЋќЌўЎџЏюЮъЪаАбБцЦдДеЕфФгГ«»░▒▓│┤хХиИ╣║╗╝йЙ┐└┴┬├─┼кК╚╔╩╦╠═╬¤лЛмМнНоОп┘┌█▄Пя▀ЯрРсСтТуУжЖвВьЬ№­ыЫзЗшШэЭщЩчЧ§■ "
  },
  "ibm855": "cp855",
  "csibm855": "cp855",
  "cp856": {
    "type": "_sbcs",
    "chars": "אבגדהוזחטיךכלםמןנסעףפץצקרשת�£�×����������®¬½¼�«»░▒▓│┤���©╣║╗╝¢¥┐└┴┬├─┼��╚╔╩╦╠═╬¤���������┘┌█▄¦�▀������µ�������¯´­±‗¾¶§÷¸°¨·¹³²■ "
  },
  "ibm856": "cp856",
  "csibm856": "cp856",
  "cp857": {
    "type": "_sbcs",
    "chars": "ÇüéâäàåçêëèïîıÄÅÉæÆôöòûùİÖÜø£ØŞşáíóúñÑĞğ¿®¬½¼¡«»░▒▓│┤ÁÂÀ©╣║╗╝¢¥┐└┴┬├─┼ãÃ╚╔╩╦╠═╬¤ºªÊËÈ�ÍÎÏ┘┌█▄¦Ì▀ÓßÔÒõÕµ�×ÚÛÙìÿ¯´­±�¾¶§÷¸°¨·¹³²■ "
  },
  "ibm857": "cp857",
  "csibm857": "cp857",
  "cp858": {
    "type": "_sbcs",
    "chars": "ÇüéâäàåçêëèïîìÄÅÉæÆôöòûùÿÖÜø£Ø×ƒáíóúñÑªº¿®¬½¼¡«»░▒▓│┤ÁÂÀ©╣║╗╝¢¥┐└┴┬├─┼ãÃ╚╔╩╦╠═╬¤ðÐÊËÈ€ÍÎÏ┘┌█▄¦Ì▀ÓßÔÒõÕµþÞÚÛÙýÝ¯´­±‗¾¶§÷¸°¨·¹³²■ "
  },
  "ibm858": "cp858",
  "csibm858": "cp858",
  "cp860": {
    "type": "_sbcs",
    "chars": "ÇüéâãàÁçêÊèÍÔìÃÂÉÀÈôõòÚùÌÕÜ¢£Ù₧ÓáíóúñÑªº¿Ò¬½¼¡«»░▒▓│┤╡╢╖╕╣║╗╝╜╛┐└┴┬├─┼╞╟╚╔╩╦╠═╬╧╨╤╥╙╘╒╓╫╪┘┌█▄▌▐▀αßΓπΣσµτΦΘΩδ∞φε∩≡±≥≤⌠⌡÷≈°∙·√ⁿ²■ "
  },
  "ibm860": "cp860",
  "csibm860": "cp860",
  "cp861": {
    "type": "_sbcs",
    "chars": "ÇüéâäàåçêëèÐðÞÄÅÉæÆôöþûÝýÖÜø£Ø₧ƒáíóúÁÍÓÚ¿⌐¬½¼¡«»░▒▓│┤╡╢╖╕╣║╗╝╜╛┐└┴┬├─┼╞╟╚╔╩╦╠═╬╧╨╤╥╙╘╒╓╫╪┘┌█▄▌▐▀αßΓπΣσµτΦΘΩδ∞φε∩≡±≥≤⌠⌡÷≈°∙·√ⁿ²■ "
  },
  "ibm861": "cp861",
  "csibm861": "cp861",
  "cp862": {
    "type": "_sbcs",
    "chars": "אבגדהוזחטיךכלםמןנסעףפץצקרשת¢£¥₧ƒáíóúñÑªº¿⌐¬½¼¡«»░▒▓│┤╡╢╖╕╣║╗╝╜╛┐└┴┬├─┼╞╟╚╔╩╦╠═╬╧╨╤╥╙╘╒╓╫╪┘┌█▄▌▐▀αßΓπΣσµτΦΘΩδ∞φε∩≡±≥≤⌠⌡÷≈°∙·√ⁿ²■ "
  },
  "ibm862": "cp862",
  "csibm862": "cp862",
  "cp863": {
    "type": "_sbcs",
    "chars": "ÇüéâÂà¶çêëèïî‗À§ÉÈÊôËÏûù¤ÔÜ¢£ÙÛƒ¦´óú¨¸³¯Î⌐¬½¼¾«»░▒▓│┤╡╢╖╕╣║╗╝╜╛┐└┴┬├─┼╞╟╚╔╩╦╠═╬╧╨╤╥╙╘╒╓╫╪┘┌█▄▌▐▀αßΓπΣσµτΦΘΩδ∞φε∩≡±≥≤⌠⌡÷≈°∙·√ⁿ²■ "
  },
  "ibm863": "cp863",
  "csibm863": "cp863",
  "cp864": {
    "type": "_sbcs",
    "chars": "\u0000\u0001\u0002\u0003\u0004\u0005\u0006\u0007\b\t\n\u000b\f\r\u000e\u000f\u0010\u0011\u0012\u0013\u0014\u0015\u0016\u0017\u0018\u0019\u001a\u001b\u001c\u001d\u001e\u001f !\"#$٪&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~°·∙√▒─│┼┤┬├┴┐┌└┘β∞φ±½¼≈«»ﻷﻸ��ﻻﻼ� ­ﺂ£¤ﺄ��ﺎﺏﺕﺙ،ﺝﺡﺥ٠١٢٣٤٥٦٧٨٩ﻑ؛ﺱﺵﺹ؟¢ﺀﺁﺃﺅﻊﺋﺍﺑﺓﺗﺛﺟﺣﺧﺩﺫﺭﺯﺳﺷﺻﺿﻁﻅﻋﻏ¦¬÷×ﻉـﻓﻗﻛﻟﻣﻧﻫﻭﻯﻳﺽﻌﻎﻍﻡﹽّﻥﻩﻬﻰﻲﻐﻕﻵﻶﻝﻙﻱ■�"
  },
  "ibm864": "cp864",
  "csibm864": "cp864",
  "cp865": {
    "type": "_sbcs",
    "chars": "ÇüéâäàåçêëèïîìÄÅÉæÆôöòûùÿÖÜø£Ø₧ƒáíóúñÑªº¿⌐¬½¼¡«¤░▒▓│┤╡╢╖╕╣║╗╝╜╛┐└┴┬├─┼╞╟╚╔╩╦╠═╬╧╨╤╥╙╘╒╓╫╪┘┌█▄▌▐▀αßΓπΣσµτΦΘΩδ∞φε∩≡±≥≤⌠⌡÷≈°∙·√ⁿ²■ "
  },
  "ibm865": "cp865",
  "csibm865": "cp865",
  "cp866": {
    "type": "_sbcs",
    "chars": "АБВГДЕЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯабвгдежзийклмноп░▒▓│┤╡╢╖╕╣║╗╝╜╛┐└┴┬├─┼╞╟╚╔╩╦╠═╬╧╨╤╥╙╘╒╓╫╪┘┌█▄▌▐▀рстуфхцчшщъыьэюяЁёЄєЇїЎў°∙·√№¤■ "
  },
  "ibm866": "cp866",
  "csibm866": "cp866",
  "cp869": {
    "type": "_sbcs",
    "chars": "������Ά�·¬¦‘’Έ―ΉΊΪΌ��ΎΫ©Ώ²³ά£έήίϊΐόύΑΒΓΔΕΖΗ½ΘΙ«»░▒▓│┤ΚΛΜΝ╣║╗╝ΞΟ┐└┴┬├─┼ΠΡ╚╔╩╦╠═╬ΣΤΥΦΧΨΩαβγ┘┌█▄δε▀ζηθικλμνξοπρσςτ΄­±υφχ§ψ΅°¨ωϋΰώ■ "
  },
  "ibm869": "cp869",
  "csibm869": "cp869",
  "cp922": {
    "type": "_sbcs",
    "chars": " ¡¢£¤¥¦§¨©ª«¬­®‾°±²³´µ¶·¸¹º»¼½¾¿ÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏŠÑÒÓÔÕÖ×ØÙÚÛÜÝŽßàáâãäåæçèéêëìíîïšñòóôõö÷øùúûüýžÿ"
  },
  "ibm922": "cp922",
  "csibm922": "cp922",
  "cp1046": {
    "type": "_sbcs",
    "chars": "ﺈ×÷ﹱ■│─┐┌└┘ﹹﹻﹽﹿﹷﺊﻰﻳﻲﻎﻏﻐﻶﻸﻺﻼ ¤ﺋﺑﺗﺛﺟﺣ،­ﺧﺳ٠١٢٣٤٥٦٧٨٩ﺷ؛ﺻﺿﻊ؟ﻋءآأؤإئابةتثجحخدذرزسشصضطﻇعغﻌﺂﺄﺎﻓـفقكلمنهوىيًٌٍَُِّْﻗﻛﻟﻵﻷﻹﻻﻣﻧﻬﻩ�"
  },
  "ibm1046": "cp1046",
  "csibm1046": "cp1046",
  "cp1124": {
    "type": "_sbcs",
    "chars": " ЁЂҐЄЅІЇЈЉЊЋЌ­ЎЏАБВГДЕЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯабвгдежзийклмнопрстуфхцчшщъыьэюя№ёђґєѕіїјљњћќ§ўџ"
  },
  "ibm1124": "cp1124",
  "csibm1124": "cp1124",
  "cp1125": {
    "type": "_sbcs",
    "chars": "АБВГДЕЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯабвгдежзийклмноп░▒▓│┤╡╢╖╕╣║╗╝╜╛┐└┴┬├─┼╞╟╚╔╩╦╠═╬╧╨╤╥╙╘╒╓╫╪┘┌█▄▌▐▀рстуфхцчшщъыьэюяЁёҐґЄєІіЇї·√№¤■ "
  },
  "ibm1125": "cp1125",
  "csibm1125": "cp1125",
  "cp1129": {
    "type": "_sbcs",
    "chars": " ¡¢£¤¥¦§œ©ª«¬­®¯°±²³Ÿµ¶·Œ¹º»¼½¾¿ÀÁÂĂÄÅÆÇÈÉÊË̀ÍÎÏĐÑ̉ÓÔƠÖ×ØÙÚÛÜỮßàáâăäåæçèéêë́íîïđṇ̃óôơö÷øùúûüư₫ÿ"
  },
  "ibm1129": "cp1129",
  "csibm1129": "cp1129",
  "cp1133": {
    "type": "_sbcs",
    "chars": " ກຂຄງຈສຊຍດຕຖທນບປຜຝພຟມຢຣລວຫອຮ���ຯະາຳິີຶືຸູຼັົຽ���ເແໂໃໄ່້໊໋໌ໍໆ�ໜໝ₭����������������໐໑໒໓໔໕໖໗໘໙��¢¬¦�"
  },
  "ibm1133": "cp1133",
  "csibm1133": "cp1133",
  "cp1161": {
    "type": "_sbcs",
    "chars": "��������������������������������่กขฃคฅฆงจฉชซฌญฎฏฐฑฒณดตถทธนบปผฝพฟภมยรฤลฦวศษสหฬอฮฯะัาำิีึืฺุู้๊๋€฿เแโใไๅๆ็่้๊๋์ํ๎๏๐๑๒๓๔๕๖๗๘๙๚๛¢¬¦ "
  },
  "ibm1161": "cp1161",
  "csibm1161": "cp1161",
  "cp1162": {
    "type": "_sbcs",
    "chars": "€…‘’“”•–— กขฃคฅฆงจฉชซฌญฎฏฐฑฒณดตถทธนบปผฝพฟภมยรฤลฦวศษสหฬอฮฯะัาำิีึืฺุู����฿เแโใไๅๆ็่้๊๋์ํ๎๏๐๑๒๓๔๕๖๗๘๙๚๛����"
  },
  "ibm1162": "cp1162",
  "csibm1162": "cp1162",
  "cp1163": {
    "type": "_sbcs",
    "chars": " ¡¢£€¥¦§œ©ª«¬­®¯°±²³Ÿµ¶·Œ¹º»¼½¾¿ÀÁÂĂÄÅÆÇÈÉÊË̀ÍÎÏĐÑ̉ÓÔƠÖ×ØÙÚÛÜỮßàáâăäåæçèéêë́íîïđṇ̃óôơö÷øùúûüư₫ÿ"
  },
  "ibm1163": "cp1163",
  "csibm1163": "cp1163",
  "maccroatian": {
    "type": "_sbcs",
    "chars": "ÄÅÇÉÑÖÜáàâäãåçéèêëíìîïñóòôöõúùûü†°¢£§•¶ß®Š™´¨≠ŽØ∞±≤≥∆µ∂∑∏š∫ªºΩžø¿¡¬√ƒ≈Ć«Č… ÀÃÕŒœĐ—“”‘’÷◊�©⁄¤‹›Æ»–·‚„‰ÂćÁčÈÍÎÏÌÓÔđÒÚÛÙıˆ˜¯πË˚¸Êæˇ"
  },
  "maccyrillic": {
    "type": "_sbcs",
    "chars": "АБВГДЕЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ†°¢£§•¶І®©™Ђђ≠Ѓѓ∞±≤≥іµ∂ЈЄєЇїЉљЊњјЅ¬√ƒ≈∆«»… ЋћЌќѕ–—“”‘’÷„ЎўЏџ№Ёёяабвгдежзийклмнопрстуфхцчшщъыьэю¤"
  },
  "macgreek": {
    "type": "_sbcs",
    "chars": "Ä¹²É³ÖÜ΅àâä΄¨çéèêë£™îï•½‰ôö¦­ùûü†ΓΔΘΛΞΠß®©ΣΪ§≠°·Α±≤≥¥ΒΕΖΗΙΚΜΦΫΨΩάΝ¬ΟΡ≈Τ«»… ΥΧΆΈœ–―“”‘’÷ΉΊΌΎέήίόΏύαβψδεφγηιξκλμνοπώρστθωςχυζϊϋΐΰ�"
  },
  "maciceland": {
    "type": "_sbcs",
    "chars": "ÄÅÇÉÑÖÜáàâäãåçéèêëíìîïñóòôöõúùûüÝ°¢£§•¶ß®©™´¨≠ÆØ∞±≤≥¥µ∂∑∏π∫ªºΩæø¿¡¬√ƒ≈∆«»… ÀÃÕŒœ–—“”‘’÷◊ÿŸ⁄¤ÐðÞþý·‚„‰ÂÊÁËÈÍÎÏÌÓÔ�ÒÚÛÙıˆ˜¯˘˙˚¸˝˛ˇ"
  },
  "macroman": {
    "type": "_sbcs",
    "chars": "ÄÅÇÉÑÖÜáàâäãåçéèêëíìîïñóòôöõúùûü†°¢£§•¶ß®©™´¨≠ÆØ∞±≤≥¥µ∂∑∏π∫ªºΩæø¿¡¬√ƒ≈∆«»… ÀÃÕŒœ–—“”‘’÷◊ÿŸ⁄¤‹›ﬁﬂ‡·‚„‰ÂÊÁËÈÍÎÏÌÓÔ�ÒÚÛÙıˆ˜¯˘˙˚¸˝˛ˇ"
  },
  "macromania": {
    "type": "_sbcs",
    "chars": "ÄÅÇÉÑÖÜáàâäãåçéèêëíìîïñóòôöõúùûü†°¢£§•¶ß®©™´¨≠ĂŞ∞±≤≥¥µ∂∑∏π∫ªºΩăş¿¡¬√ƒ≈∆«»… ÀÃÕŒœ–—“”‘’÷◊ÿŸ⁄¤‹›Ţţ‡·‚„‰ÂÊÁËÈÍÎÏÌÓÔ�ÒÚÛÙıˆ˜¯˘˙˚¸˝˛ˇ"
  },
  "macthai": {
    "type": "_sbcs",
    "chars": "«»…“”�•‘’� กขฃคฅฆงจฉชซฌญฎฏฐฑฒณดตถทธนบปผฝพฟภมยรฤลฦวศษสหฬอฮฯะัาำิีึืฺุู﻿​–—฿เแโใไๅๆ็่้๊๋์ํ™๏๐๑๒๓๔๕๖๗๘๙®©����"
  },
  "macturkish": {
    "type": "_sbcs",
    "chars": "ÄÅÇÉÑÖÜáàâäãåçéèêëíìîïñóòôöõúùûü†°¢£§•¶ß®©™´¨≠ÆØ∞±≤≥¥µ∂∑∏π∫ªºΩæø¿¡¬√ƒ≈∆«»… ÀÃÕŒœ–—“”‘’÷◊ÿŸĞğİıŞş‡·‚„‰ÂÊÁËÈÍÎÏÌÓÔ�ÒÚÛÙ�ˆ˜¯˘˙˚¸˝˛ˇ"
  },
  "macukraine": {
    "type": "_sbcs",
    "chars": "АБВГДЕЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ†°Ґ£§•¶І®©™Ђђ≠Ѓѓ∞±≤≥іµґЈЄєЇїЉљЊњјЅ¬√ƒ≈∆«»… ЋћЌќѕ–—“”‘’÷„ЎўЏџ№Ёёяабвгдежзийклмнопрстуфхцчшщъыьэю¤"
  },
  "koi8r": {
    "type": "_sbcs",
    "chars": "─│┌┐└┘├┤┬┴┼▀▄█▌▐░▒▓⌠■∙√≈≤≥ ⌡°²·÷═║╒ё╓╔╕╖╗╘╙╚╛╜╝╞╟╠╡Ё╢╣╤╥╦╧╨╩╪╫╬©юабцдефгхийклмнопярстужвьызшэщчъЮАБЦДЕФГХИЙКЛМНОПЯРСТУЖВЬЫЗШЭЩЧЪ"
  },
  "koi8u": {
    "type": "_sbcs",
    "chars": "─│┌┐└┘├┤┬┴┼▀▄█▌▐░▒▓⌠■∙√≈≤≥ ⌡°²·÷═║╒ёє╔ії╗╘╙╚╛ґ╝╞╟╠╡ЁЄ╣ІЇ╦╧╨╩╪Ґ╬©юабцдефгхийклмнопярстужвьызшэщчъЮАБЦДЕФГХИЙКЛМНОПЯРСТУЖВЬЫЗШЭЩЧЪ"
  },
  "koi8ru": {
    "type": "_sbcs",
    "chars": "─│┌┐└┘├┤┬┴┼▀▄█▌▐░▒▓⌠■∙√≈≤≥ ⌡°²·÷═║╒ёє╔ії╗╘╙╚╛ґў╞╟╠╡ЁЄ╣ІЇ╦╧╨╩╪ҐЎ©юабцдефгхийклмнопярстужвьызшэщчъЮАБЦДЕФГХИЙКЛМНОПЯРСТУЖВЬЫЗШЭЩЧЪ"
  },
  "koi8t": {
    "type": "_sbcs",
    "chars": "қғ‚Ғ„…†‡�‰ҳ‹ҲҷҶ�Қ‘’“”•–—�™�›�����ӯӮё¤ӣ¦§���«¬­®�°±²Ё�Ӣ¶·�№�»���©юабцдефгхийклмнопярстужвьызшэщчъЮАБЦДЕФГХИЙКЛМНОПЯРСТУЖВЬЫЗШЭЩЧЪ"
  },
  "armscii8": {
    "type": "_sbcs",
    "chars": " �և։)(»«—.՝,-֊…՜՛՞ԱաԲբԳգԴդԵեԶզԷէԸըԹթԺժԻիԼլԽխԾծԿկՀհՁձՂղՃճՄմՅյՆնՇշՈոՉչՊպՋջՌռՍսՎվՏտՐրՑցՒւՓփՔքՕօՖֆ՚�"
  },
  "rk1048": {
    "type": "_sbcs",
    "chars": "ЂЃ‚ѓ„…†‡€‰Љ‹ЊҚҺЏђ‘’“”•–—�™љ›њқһџ ҰұӘ¤Ө¦§Ё©Ғ«¬­®Ү°±Ііөµ¶·ё№ғ»әҢңүАБВГДЕЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯабвгдежзийклмнопрстуфхцчшщъыьэюя"
  },
  "tcvn": {
    "type": "_sbcs",
    "chars": "\u0000ÚỤ\u0003ỪỬỮ\u0007\b\t\n\u000b\f\r\u000e\u000f\u0010ỨỰỲỶỸÝỴ\u0018\u0019\u001a\u001b\u001c\u001d\u001e\u001f !\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~ÀẢÃÁẠẶẬÈẺẼÉẸỆÌỈĨÍỊÒỎÕÓỌỘỜỞỠỚỢÙỦŨ ĂÂÊÔƠƯĐăâêôơưđẶ̀̀̉̃́àảãáạẲằẳẵắẴẮẦẨẪẤỀặầẩẫấậèỂẻẽéẹềểễếệìỉỄẾỒĩíịòỔỏõóọồổỗốộờởỡớợùỖủũúụừửữứựỳỷỹýỵỐ"
  },
  "georgianacademy": {
    "type": "_sbcs",
    "chars": "‚ƒ„…†‡ˆ‰Š‹Œ‘’“”•–—˜™š›œŸ ¡¢£¤¥¦§¨©ª«¬­®¯°±²³´µ¶·¸¹º»¼½¾¿აბგდევზთიკლმნოპჟრსტუფქღყშჩცძწჭხჯჰჱჲჳჴჵჶçèéêëìíîïðñòóôõö÷øùúûüýþÿ"
  },
  "georgianps": {
    "type": "_sbcs",
    "chars": "‚ƒ„…†‡ˆ‰Š‹Œ‘’“”•–—˜™š›œŸ ¡¢£¤¥¦§¨©ª«¬­®¯°±²³´µ¶·¸¹º»¼½¾¿აბგდევზჱთიკლმნჲოპჟრსტჳუფქღყშჩცძწჭხჴჯჰჵæçèéêëìíîïðñòóôõö÷øùúûüýþÿ"
  },
  "pt154": {
    "type": "_sbcs",
    "chars": "ҖҒӮғ„…ҶҮҲүҠӢҢҚҺҸҗ‘’“”•–—ҳҷҡӣңқһҹ ЎўЈӨҘҰ§Ё©Ә«¬ӯ®Ҝ°ұІіҙө¶·ё№ә»јҪҫҝАБВГДЕЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯабвгдежзийклмнопрстуфхцчшщъыьэюя"
  },
  "viscii": {
    "type": "_sbcs",
    "chars": "\u0000\u0001Ẳ\u0003\u0004ẴẪ\u0007\b\t\n\u000b\f\r\u000e\u000f\u0010\u0011\u0012\u0013Ỷ\u0015\u0016\u0017\u0018Ỹ\u001a\u001b\u001c\u001dỴ\u001f !\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~ẠẮẰẶẤẦẨẬẼẸẾỀỂỄỆỐỒỔỖỘỢỚỜỞỊỎỌỈỦŨỤỲÕắằặấầẩậẽẹếềểễệốồổỗỠƠộờởịỰỨỪỬơớƯÀÁÂÃẢĂẳẵÈÉÊẺÌÍĨỳĐứÒÓÔạỷừửÙÚỹỵÝỡưàáâãảăữẫèéêẻìíĩỉđựòóôõỏọụùúũủýợỮ"
  },
  "iso646cn": {
    "type": "_sbcs",
    "chars": "\u0000\u0001\u0002\u0003\u0004\u0005\u0006\u0007\b\t\n\u000b\f\r\u000e\u000f\u0010\u0011\u0012\u0013\u0014\u0015\u0016\u0017\u0018\u0019\u001a\u001b\u001c\u001d\u001e\u001f !\"#¥%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}‾��������������������������������������������������������������������������������������������������������������������������������"
  },
  "iso646jp": {
    "type": "_sbcs",
    "chars": "\u0000\u0001\u0002\u0003\u0004\u0005\u0006\u0007\b\t\n\u000b\f\r\u000e\u000f\u0010\u0011\u0012\u0013\u0014\u0015\u0016\u0017\u0018\u0019\u001a\u001b\u001c\u001d\u001e\u001f !\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[¥]^_`abcdefghijklmnopqrstuvwxyz{|}‾��������������������������������������������������������������������������������������������������������������������������������"
  },
  "hproman8": {
    "type": "_sbcs",
    "chars": " ÀÂÈÊËÎÏ´ˋˆ¨˜ÙÛ₤¯Ýý°ÇçÑñ¡¿¤£¥§ƒ¢âêôûáéóúàèòùäëöüÅîØÆåíøæÄìÖÜÉïßÔÁÃãÐðÍÌÓÒÕõŠšÚŸÿÞþ·µ¶¾—¼½ªº«■»±�"
  },
  "macintosh": {
    "type": "_sbcs",
    "chars": "ÄÅÇÉÑÖÜáàâäãåçéèêëíìîïñóòôöõúùûü†°¢£§•¶ß®©™´¨≠ÆØ∞±≤≥¥µ∂∑∏π∫ªºΩæø¿¡¬√ƒ≈∆«»… ÀÃÕŒœ–—“”‘’÷◊ÿŸ⁄¤‹›ﬁﬂ‡·‚„‰ÂÊÁËÈÍÎÏÌÓÔ�ÒÚÛÙıˆ˜¯˘˙˚¸˝˛ˇ"
  },
  "ascii": {
    "type": "_sbcs",
    "chars": "��������������������������������������������������������������������������������������������������������������������������������"
  },
  "tis620": {
    "type": "_sbcs",
    "chars": "���������������������������������กขฃคฅฆงจฉชซฌญฎฏฐฑฒณดตถทธนบปผฝพฟภมยรฤลฦวศษสหฬอฮฯะัาำิีึืฺุู����฿เแโใไๅๆ็่้๊๋์ํ๎๏๐๑๒๓๔๕๖๗๘๙๚๛����"
  }
}

/***/ }),
/* 38 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// Multibyte codec. In this scheme, a character is represented by 1 or more bytes.
// Our codec supports UTF-16 surrogates, extensions for GB18030 and unicode sequences.
// To save memory and loading time, we read table files only when requested.

exports._dbcs = DBCSCodec;

var UNASSIGNED = -1,
    GB18030_CODE = -2,
    SEQ_START  = -10,
    NODE_START = -1000,
    UNASSIGNED_NODE = new Array(0x100),
    DEF_CHAR = -1;

for (var i = 0; i < 0x100; i++)
    UNASSIGNED_NODE[i] = UNASSIGNED;


// Class DBCSCodec reads and initializes mapping tables.
function DBCSCodec(codecOptions, iconv) {
    this.encodingName = codecOptions.encodingName;
    if (!codecOptions)
        throw new Error("DBCS codec is called without the data.")
    if (!codecOptions.table)
        throw new Error("Encoding '" + this.encodingName + "' has no data.");

    // Load tables.
    var mappingTable = codecOptions.table();


    // Decode tables: MBCS -> Unicode.

    // decodeTables is a trie, encoded as an array of arrays of integers. Internal arrays are trie nodes and all have len = 256.
    // Trie root is decodeTables[0].
    // Values: >=  0 -> unicode character code. can be > 0xFFFF
    //         == UNASSIGNED -> unknown/unassigned sequence.
    //         == GB18030_CODE -> this is the end of a GB18030 4-byte sequence.
    //         <= NODE_START -> index of the next node in our trie to process next byte.
    //         <= SEQ_START  -> index of the start of a character code sequence, in decodeTableSeq.
    this.decodeTables = [];
    this.decodeTables[0] = UNASSIGNED_NODE.slice(0); // Create root node.

    // Sometimes a MBCS char corresponds to a sequence of unicode chars. We store them as arrays of integers here. 
    this.decodeTableSeq = [];

    // Actual mapping tables consist of chunks. Use them to fill up decode tables.
    for (var i = 0; i < mappingTable.length; i++)
        this._addDecodeChunk(mappingTable[i]);

    this.defaultCharUnicode = iconv.defaultCharUnicode;

    
    // Encode tables: Unicode -> DBCS.

    // `encodeTable` is array mapping from unicode char to encoded char. All its values are integers for performance.
    // Because it can be sparse, it is represented as array of buckets by 256 chars each. Bucket can be null.
    // Values: >=  0 -> it is a normal char. Write the value (if <=256 then 1 byte, if <=65536 then 2 bytes, etc.).
    //         == UNASSIGNED -> no conversion found. Output a default char.
    //         <= SEQ_START  -> it's an index in encodeTableSeq, see below. The character starts a sequence.
    this.encodeTable = [];
    
    // `encodeTableSeq` is used when a sequence of unicode characters is encoded as a single code. We use a tree of
    // objects where keys correspond to characters in sequence and leafs are the encoded dbcs values. A special DEF_CHAR key
    // means end of sequence (needed when one sequence is a strict subsequence of another).
    // Objects are kept separately from encodeTable to increase performance.
    this.encodeTableSeq = [];

    // Some chars can be decoded, but need not be encoded.
    var skipEncodeChars = {};
    if (codecOptions.encodeSkipVals)
        for (var i = 0; i < codecOptions.encodeSkipVals.length; i++) {
            var val = codecOptions.encodeSkipVals[i];
            if (typeof val === 'number')
                skipEncodeChars[val] = true;
            else
                for (var j = val.from; j <= val.to; j++)
                    skipEncodeChars[j] = true;
        }
        
    // Use decode trie to recursively fill out encode tables.
    this._fillEncodeTable(0, 0, skipEncodeChars);

    // Add more encoding pairs when needed.
    if (codecOptions.encodeAdd) {
        for (var uChar in codecOptions.encodeAdd)
            if (Object.prototype.hasOwnProperty.call(codecOptions.encodeAdd, uChar))
                this._setEncodeChar(uChar.charCodeAt(0), codecOptions.encodeAdd[uChar]);
    }

    this.defCharSB  = this.encodeTable[0][iconv.defaultCharSingleByte.charCodeAt(0)];
    if (this.defCharSB === UNASSIGNED) this.defCharSB = this.encodeTable[0]['?'];
    if (this.defCharSB === UNASSIGNED) this.defCharSB = "?".charCodeAt(0);


    // Load & create GB18030 tables when needed.
    if (typeof codecOptions.gb18030 === 'function') {
        this.gb18030 = codecOptions.gb18030(); // Load GB18030 ranges.

        // Add GB18030 decode tables.
        var thirdByteNodeIdx = this.decodeTables.length;
        var thirdByteNode = this.decodeTables[thirdByteNodeIdx] = UNASSIGNED_NODE.slice(0);

        var fourthByteNodeIdx = this.decodeTables.length;
        var fourthByteNode = this.decodeTables[fourthByteNodeIdx] = UNASSIGNED_NODE.slice(0);

        for (var i = 0x81; i <= 0xFE; i++) {
            var secondByteNodeIdx = NODE_START - this.decodeTables[0][i];
            var secondByteNode = this.decodeTables[secondByteNodeIdx];
            for (var j = 0x30; j <= 0x39; j++)
                secondByteNode[j] = NODE_START - thirdByteNodeIdx;
        }
        for (var i = 0x81; i <= 0xFE; i++)
            thirdByteNode[i] = NODE_START - fourthByteNodeIdx;
        for (var i = 0x30; i <= 0x39; i++)
            fourthByteNode[i] = GB18030_CODE
    }        
}

DBCSCodec.prototype.encoder = DBCSEncoder;
DBCSCodec.prototype.decoder = DBCSDecoder;

// Decoder helpers
DBCSCodec.prototype._getDecodeTrieNode = function(addr) {
    var bytes = [];
    for (; addr > 0; addr >>= 8)
        bytes.push(addr & 0xFF);
    if (bytes.length == 0)
        bytes.push(0);

    var node = this.decodeTables[0];
    for (var i = bytes.length-1; i > 0; i--) { // Traverse nodes deeper into the trie.
        var val = node[bytes[i]];

        if (val == UNASSIGNED) { // Create new node.
            node[bytes[i]] = NODE_START - this.decodeTables.length;
            this.decodeTables.push(node = UNASSIGNED_NODE.slice(0));
        }
        else if (val <= NODE_START) { // Existing node.
            node = this.decodeTables[NODE_START - val];
        }
        else
            throw new Error("Overwrite byte in " + this.encodingName + ", addr: " + addr.toString(16));
    }
    return node;
}


DBCSCodec.prototype._addDecodeChunk = function(chunk) {
    // First element of chunk is the hex mbcs code where we start.
    var curAddr = parseInt(chunk[0], 16);

    // Choose the decoding node where we'll write our chars.
    var writeTable = this._getDecodeTrieNode(curAddr);
    curAddr = curAddr & 0xFF;

    // Write all other elements of the chunk to the table.
    for (var k = 1; k < chunk.length; k++) {
        var part = chunk[k];
        if (typeof part === "string") { // String, write as-is.
            for (var l = 0; l < part.length;) {
                var code = part.charCodeAt(l++);
                if (0xD800 <= code && code < 0xDC00) { // Decode surrogate
                    var codeTrail = part.charCodeAt(l++);
                    if (0xDC00 <= codeTrail && codeTrail < 0xE000)
                        writeTable[curAddr++] = 0x10000 + (code - 0xD800) * 0x400 + (codeTrail - 0xDC00);
                    else
                        throw new Error("Incorrect surrogate pair in "  + this.encodingName + " at chunk " + chunk[0]);
                }
                else if (0x0FF0 < code && code <= 0x0FFF) { // Character sequence (our own encoding used)
                    var len = 0xFFF - code + 2;
                    var seq = [];
                    for (var m = 0; m < len; m++)
                        seq.push(part.charCodeAt(l++)); // Simple variation: don't support surrogates or subsequences in seq.

                    writeTable[curAddr++] = SEQ_START - this.decodeTableSeq.length;
                    this.decodeTableSeq.push(seq);
                }
                else
                    writeTable[curAddr++] = code; // Basic char
            }
        } 
        else if (typeof part === "number") { // Integer, meaning increasing sequence starting with prev character.
            var charCode = writeTable[curAddr - 1] + 1;
            for (var l = 0; l < part; l++)
                writeTable[curAddr++] = charCode++;
        }
        else
            throw new Error("Incorrect type '" + typeof part + "' given in "  + this.encodingName + " at chunk " + chunk[0]);
    }
    if (curAddr > 0xFF)
        throw new Error("Incorrect chunk in "  + this.encodingName + " at addr " + chunk[0] + ": too long" + curAddr);
}

// Encoder helpers
DBCSCodec.prototype._getEncodeBucket = function(uCode) {
    var high = uCode >> 8; // This could be > 0xFF because of astral characters.
    if (this.encodeTable[high] === undefined)
        this.encodeTable[high] = UNASSIGNED_NODE.slice(0); // Create bucket on demand.
    return this.encodeTable[high];
}

DBCSCodec.prototype._setEncodeChar = function(uCode, dbcsCode) {
    var bucket = this._getEncodeBucket(uCode);
    var low = uCode & 0xFF;
    if (bucket[low] <= SEQ_START)
        this.encodeTableSeq[SEQ_START-bucket[low]][DEF_CHAR] = dbcsCode; // There's already a sequence, set a single-char subsequence of it.
    else if (bucket[low] == UNASSIGNED)
        bucket[low] = dbcsCode;
}

DBCSCodec.prototype._setEncodeSequence = function(seq, dbcsCode) {
    
    // Get the root of character tree according to first character of the sequence.
    var uCode = seq[0];
    var bucket = this._getEncodeBucket(uCode);
    var low = uCode & 0xFF;

    var node;
    if (bucket[low] <= SEQ_START) {
        // There's already a sequence with  - use it.
        node = this.encodeTableSeq[SEQ_START-bucket[low]];
    }
    else {
        // There was no sequence object - allocate a new one.
        node = {};
        if (bucket[low] !== UNASSIGNED) node[DEF_CHAR] = bucket[low]; // If a char was set before - make it a single-char subsequence.
        bucket[low] = SEQ_START - this.encodeTableSeq.length;
        this.encodeTableSeq.push(node);
    }

    // Traverse the character tree, allocating new nodes as needed.
    for (var j = 1; j < seq.length-1; j++) {
        var oldVal = node[uCode];
        if (typeof oldVal === 'object')
            node = oldVal;
        else {
            node = node[uCode] = {}
            if (oldVal !== undefined)
                node[DEF_CHAR] = oldVal
        }
    }

    // Set the leaf to given dbcsCode.
    uCode = seq[seq.length-1];
    node[uCode] = dbcsCode;
}

DBCSCodec.prototype._fillEncodeTable = function(nodeIdx, prefix, skipEncodeChars) {
    var node = this.decodeTables[nodeIdx];
    for (var i = 0; i < 0x100; i++) {
        var uCode = node[i];
        var mbCode = prefix + i;
        if (skipEncodeChars[mbCode])
            continue;

        if (uCode >= 0)
            this._setEncodeChar(uCode, mbCode);
        else if (uCode <= NODE_START)
            this._fillEncodeTable(NODE_START - uCode, mbCode << 8, skipEncodeChars);
        else if (uCode <= SEQ_START)
            this._setEncodeSequence(this.decodeTableSeq[SEQ_START - uCode], mbCode);
    }
}



// == Encoder ==================================================================

function DBCSEncoder(options, codec) {
    // Encoder state
    this.leadSurrogate = -1;
    this.seqObj = undefined;
    
    // Static data
    this.encodeTable = codec.encodeTable;
    this.encodeTableSeq = codec.encodeTableSeq;
    this.defaultCharSingleByte = codec.defCharSB;
    this.gb18030 = codec.gb18030;
}

DBCSEncoder.prototype.write = function(str) {
    var newBuf = new Buffer(str.length * (this.gb18030 ? 4 : 3)), 
        leadSurrogate = this.leadSurrogate,
        seqObj = this.seqObj, nextChar = -1,
        i = 0, j = 0;

    while (true) {
        // 0. Get next character.
        if (nextChar === -1) {
            if (i == str.length) break;
            var uCode = str.charCodeAt(i++);
        }
        else {
            var uCode = nextChar;
            nextChar = -1;    
        }

        // 1. Handle surrogates.
        if (0xD800 <= uCode && uCode < 0xE000) { // Char is one of surrogates.
            if (uCode < 0xDC00) { // We've got lead surrogate.
                if (leadSurrogate === -1) {
                    leadSurrogate = uCode;
                    continue;
                } else {
                    leadSurrogate = uCode;
                    // Double lead surrogate found.
                    uCode = UNASSIGNED;
                }
            } else { // We've got trail surrogate.
                if (leadSurrogate !== -1) {
                    uCode = 0x10000 + (leadSurrogate - 0xD800) * 0x400 + (uCode - 0xDC00);
                    leadSurrogate = -1;
                } else {
                    // Incomplete surrogate pair - only trail surrogate found.
                    uCode = UNASSIGNED;
                }
                
            }
        }
        else if (leadSurrogate !== -1) {
            // Incomplete surrogate pair - only lead surrogate found.
            nextChar = uCode; uCode = UNASSIGNED; // Write an error, then current char.
            leadSurrogate = -1;
        }

        // 2. Convert uCode character.
        var dbcsCode = UNASSIGNED;
        if (seqObj !== undefined && uCode != UNASSIGNED) { // We are in the middle of the sequence
            var resCode = seqObj[uCode];
            if (typeof resCode === 'object') { // Sequence continues.
                seqObj = resCode;
                continue;

            } else if (typeof resCode == 'number') { // Sequence finished. Write it.
                dbcsCode = resCode;

            } else if (resCode == undefined) { // Current character is not part of the sequence.

                // Try default character for this sequence
                resCode = seqObj[DEF_CHAR];
                if (resCode !== undefined) {
                    dbcsCode = resCode; // Found. Write it.
                    nextChar = uCode; // Current character will be written too in the next iteration.

                } else {
                    // TODO: What if we have no default? (resCode == undefined)
                    // Then, we should write first char of the sequence as-is and try the rest recursively.
                    // Didn't do it for now because no encoding has this situation yet.
                    // Currently, just skip the sequence and write current char.
                }
            }
            seqObj = undefined;
        }
        else if (uCode >= 0) {  // Regular character
            var subtable = this.encodeTable[uCode >> 8];
            if (subtable !== undefined)
                dbcsCode = subtable[uCode & 0xFF];
            
            if (dbcsCode <= SEQ_START) { // Sequence start
                seqObj = this.encodeTableSeq[SEQ_START-dbcsCode];
                continue;
            }

            if (dbcsCode == UNASSIGNED && this.gb18030) {
                // Use GB18030 algorithm to find character(s) to write.
                var idx = findIdx(this.gb18030.uChars, uCode);
                if (idx != -1) {
                    var dbcsCode = this.gb18030.gbChars[idx] + (uCode - this.gb18030.uChars[idx]);
                    newBuf[j++] = 0x81 + Math.floor(dbcsCode / 12600); dbcsCode = dbcsCode % 12600;
                    newBuf[j++] = 0x30 + Math.floor(dbcsCode / 1260); dbcsCode = dbcsCode % 1260;
                    newBuf[j++] = 0x81 + Math.floor(dbcsCode / 10); dbcsCode = dbcsCode % 10;
                    newBuf[j++] = 0x30 + dbcsCode;
                    continue;
                }
            }
        }

        // 3. Write dbcsCode character.
        if (dbcsCode === UNASSIGNED)
            dbcsCode = this.defaultCharSingleByte;
        
        if (dbcsCode < 0x100) {
            newBuf[j++] = dbcsCode;
        }
        else if (dbcsCode < 0x10000) {
            newBuf[j++] = dbcsCode >> 8;   // high byte
            newBuf[j++] = dbcsCode & 0xFF; // low byte
        }
        else {
            newBuf[j++] = dbcsCode >> 16;
            newBuf[j++] = (dbcsCode >> 8) & 0xFF;
            newBuf[j++] = dbcsCode & 0xFF;
        }
    }

    this.seqObj = seqObj;
    this.leadSurrogate = leadSurrogate;
    return newBuf.slice(0, j);
}

DBCSEncoder.prototype.end = function() {
    if (this.leadSurrogate === -1 && this.seqObj === undefined)
        return; // All clean. Most often case.

    var newBuf = new Buffer(10), j = 0;

    if (this.seqObj) { // We're in the sequence.
        var dbcsCode = this.seqObj[DEF_CHAR];
        if (dbcsCode !== undefined) { // Write beginning of the sequence.
            if (dbcsCode < 0x100) {
                newBuf[j++] = dbcsCode;
            }
            else {
                newBuf[j++] = dbcsCode >> 8;   // high byte
                newBuf[j++] = dbcsCode & 0xFF; // low byte
            }
        } else {
            // See todo above.
        }
        this.seqObj = undefined;
    }

    if (this.leadSurrogate !== -1) {
        // Incomplete surrogate pair - only lead surrogate found.
        newBuf[j++] = this.defaultCharSingleByte;
        this.leadSurrogate = -1;
    }
    
    return newBuf.slice(0, j);
}

// Export for testing
DBCSEncoder.prototype.findIdx = findIdx;


// == Decoder ==================================================================

function DBCSDecoder(options, codec) {
    // Decoder state
    this.nodeIdx = 0;
    this.prevBuf = new Buffer(0);

    // Static data
    this.decodeTables = codec.decodeTables;
    this.decodeTableSeq = codec.decodeTableSeq;
    this.defaultCharUnicode = codec.defaultCharUnicode;
    this.gb18030 = codec.gb18030;
}

DBCSDecoder.prototype.write = function(buf) {
    var newBuf = new Buffer(buf.length*2),
        nodeIdx = this.nodeIdx, 
        prevBuf = this.prevBuf, prevBufOffset = this.prevBuf.length,
        seqStart = -this.prevBuf.length, // idx of the start of current parsed sequence.
        uCode;

    if (prevBufOffset > 0) // Make prev buf overlap a little to make it easier to slice later.
        prevBuf = Buffer.concat([prevBuf, buf.slice(0, 10)]);
    
    for (var i = 0, j = 0; i < buf.length; i++) {
        var curByte = (i >= 0) ? buf[i] : prevBuf[i + prevBufOffset];

        // Lookup in current trie node.
        var uCode = this.decodeTables[nodeIdx][curByte];

        if (uCode >= 0) { 
            // Normal character, just use it.
        }
        else if (uCode === UNASSIGNED) { // Unknown char.
            // TODO: Callback with seq.
            //var curSeq = (seqStart >= 0) ? buf.slice(seqStart, i+1) : prevBuf.slice(seqStart + prevBufOffset, i+1 + prevBufOffset);
            i = seqStart; // Try to parse again, after skipping first byte of the sequence ('i' will be incremented by 'for' cycle).
            uCode = this.defaultCharUnicode.charCodeAt(0);
        }
        else if (uCode === GB18030_CODE) {
            var curSeq = (seqStart >= 0) ? buf.slice(seqStart, i+1) : prevBuf.slice(seqStart + prevBufOffset, i+1 + prevBufOffset);
            var ptr = (curSeq[0]-0x81)*12600 + (curSeq[1]-0x30)*1260 + (curSeq[2]-0x81)*10 + (curSeq[3]-0x30);
            var idx = findIdx(this.gb18030.gbChars, ptr);
            uCode = this.gb18030.uChars[idx] + ptr - this.gb18030.gbChars[idx];
        }
        else if (uCode <= NODE_START) { // Go to next trie node.
            nodeIdx = NODE_START - uCode;
            continue;
        }
        else if (uCode <= SEQ_START) { // Output a sequence of chars.
            var seq = this.decodeTableSeq[SEQ_START - uCode];
            for (var k = 0; k < seq.length - 1; k++) {
                uCode = seq[k];
                newBuf[j++] = uCode & 0xFF;
                newBuf[j++] = uCode >> 8;
            }
            uCode = seq[seq.length-1];
        }
        else
            throw new Error("iconv-lite internal error: invalid decoding table value " + uCode + " at " + nodeIdx + "/" + curByte);

        // Write the character to buffer, handling higher planes using surrogate pair.
        if (uCode > 0xFFFF) { 
            uCode -= 0x10000;
            var uCodeLead = 0xD800 + Math.floor(uCode / 0x400);
            newBuf[j++] = uCodeLead & 0xFF;
            newBuf[j++] = uCodeLead >> 8;

            uCode = 0xDC00 + uCode % 0x400;
        }
        newBuf[j++] = uCode & 0xFF;
        newBuf[j++] = uCode >> 8;

        // Reset trie node.
        nodeIdx = 0; seqStart = i+1;
    }

    this.nodeIdx = nodeIdx;
    this.prevBuf = (seqStart >= 0) ? buf.slice(seqStart) : prevBuf.slice(seqStart + prevBufOffset);
    return newBuf.slice(0, j).toString('ucs2');
}

DBCSDecoder.prototype.end = function() {
    var ret = '';

    // Try to parse all remaining chars.
    while (this.prevBuf.length > 0) {
        // Skip 1 character in the buffer.
        ret += this.defaultCharUnicode;
        var buf = this.prevBuf.slice(1);

        // Parse remaining as usual.
        this.prevBuf = new Buffer(0);
        this.nodeIdx = 0;
        if (buf.length > 0)
            ret += this.write(buf);
    }

    this.nodeIdx = 0;
    return ret;
}

// Binary search for GB18030. Returns largest i such that table[i] <= val.
function findIdx(table, val) {
    if (table[0] > val)
        return -1;

    var l = 0, r = table.length;
    while (l < r-1) { // always table[l] <= val < table[r]
        var mid = l + Math.floor((r-l+1)/2);
        if (table[mid] <= val)
            l = mid;
        else
            r = mid;
    }
    return l;
}



/***/ }),
/* 39 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// Description of supported double byte encodings and aliases.
// Tables are not require()-d until they are needed to speed up library load.
// require()-s are direct to support Browserify.

module.exports = {
    
    // == Japanese/ShiftJIS ====================================================
    // All japanese encodings are based on JIS X set of standards:
    // JIS X 0201 - Single-byte encoding of ASCII + ¥ + Kana chars at 0xA1-0xDF.
    // JIS X 0208 - Main set of 6879 characters, placed in 94x94 plane, to be encoded by 2 bytes. 
    //              Has several variations in 1978, 1983, 1990 and 1997.
    // JIS X 0212 - Supplementary plane of 6067 chars in 94x94 plane. 1990. Effectively dead.
    // JIS X 0213 - Extension and modern replacement of 0208 and 0212. Total chars: 11233.
    //              2 planes, first is superset of 0208, second - revised 0212.
    //              Introduced in 2000, revised 2004. Some characters are in Unicode Plane 2 (0x2xxxx)

    // Byte encodings are:
    //  * Shift_JIS: Compatible with 0201, uses not defined chars in top half as lead bytes for double-byte
    //               encoding of 0208. Lead byte ranges: 0x81-0x9F, 0xE0-0xEF; Trail byte ranges: 0x40-0x7E, 0x80-0x9E, 0x9F-0xFC.
    //               Windows CP932 is a superset of Shift_JIS. Some companies added more chars, notably KDDI.
    //  * EUC-JP:    Up to 3 bytes per character. Used mostly on *nixes.
    //               0x00-0x7F       - lower part of 0201
    //               0x8E, 0xA1-0xDF - upper part of 0201
    //               (0xA1-0xFE)x2   - 0208 plane (94x94).
    //               0x8F, (0xA1-0xFE)x2 - 0212 plane (94x94).
    //  * JIS X 208: 7-bit, direct encoding of 0208. Byte ranges: 0x21-0x7E (94 values). Uncommon.
    //               Used as-is in ISO2022 family.
    //  * ISO2022-JP: Stateful encoding, with escape sequences to switch between ASCII, 
    //                0201-1976 Roman, 0208-1978, 0208-1983.
    //  * ISO2022-JP-1: Adds esc seq for 0212-1990.
    //  * ISO2022-JP-2: Adds esc seq for GB2313-1980, KSX1001-1992, ISO8859-1, ISO8859-7.
    //  * ISO2022-JP-3: Adds esc seq for 0201-1976 Kana set, 0213-2000 Planes 1, 2.
    //  * ISO2022-JP-2004: Adds 0213-2004 Plane 1.
    //
    // After JIS X 0213 appeared, Shift_JIS-2004, EUC-JISX0213 and ISO2022-JP-2004 followed, with just changing the planes.
    //
    // Overall, it seems that it's a mess :( http://www8.plala.or.jp/tkubota1/unicode-symbols-map2.html

    'shiftjis': {
        type: '_dbcs',
        table: function() { return __webpack_require__(40) },
        encodeAdd: {'\u00a5': 0x5C, '\u203E': 0x7E},
        encodeSkipVals: [{from: 0xED40, to: 0xF940}],
    },
    'csshiftjis': 'shiftjis',
    'mskanji': 'shiftjis',
    'sjis': 'shiftjis',
    'windows31j': 'shiftjis',
    'ms31j': 'shiftjis',
    'xsjis': 'shiftjis',
    'windows932': 'shiftjis',
    'ms932': 'shiftjis',
    '932': 'shiftjis',
    'cp932': 'shiftjis',

    'eucjp': {
        type: '_dbcs',
        table: function() { return __webpack_require__(41) },
        encodeAdd: {'\u00a5': 0x5C, '\u203E': 0x7E},
    },

    // TODO: KDDI extension to Shift_JIS
    // TODO: IBM CCSID 942 = CP932, but F0-F9 custom chars and other char changes.
    // TODO: IBM CCSID 943 = Shift_JIS = CP932 with original Shift_JIS lower 128 chars.


    // == Chinese/GBK ==========================================================
    // http://en.wikipedia.org/wiki/GBK
    // We mostly implement W3C recommendation: https://www.w3.org/TR/encoding/#gbk-encoder

    // Oldest GB2312 (1981, ~7600 chars) is a subset of CP936
    'gb2312': 'cp936',
    'gb231280': 'cp936',
    'gb23121980': 'cp936',
    'csgb2312': 'cp936',
    'csiso58gb231280': 'cp936',
    'euccn': 'cp936',

    // Microsoft's CP936 is a subset and approximation of GBK.
    'windows936': 'cp936',
    'ms936': 'cp936',
    '936': 'cp936',
    'cp936': {
        type: '_dbcs',
        table: function() { return __webpack_require__(8) },
    },

    // GBK (~22000 chars) is an extension of CP936 that added user-mapped chars and some other.
    'gbk': {
        type: '_dbcs',
        table: function() { return __webpack_require__(8).concat(__webpack_require__(13)) },
    },
    'xgbk': 'gbk',
    'isoir58': 'gbk',

    // GB18030 is an algorithmic extension of GBK.
    // Main source: https://www.w3.org/TR/encoding/#gbk-encoder
    // http://icu-project.org/docs/papers/gb18030.html
    // http://source.icu-project.org/repos/icu/data/trunk/charset/data/xml/gb-18030-2000.xml
    // http://www.khngai.com/chinese/charmap/tblgbk.php?page=0
    'gb18030': {
        type: '_dbcs',
        table: function() { return __webpack_require__(8).concat(__webpack_require__(13)) },
        gb18030: function() { return __webpack_require__(42) },
        encodeSkipVals: [0x80],
        encodeAdd: {'€': 0xA2E3},
    },

    'chinese': 'gb18030',


    // == Korean ===============================================================
    // EUC-KR, KS_C_5601 and KS X 1001 are exactly the same.
    'windows949': 'cp949',
    'ms949': 'cp949',
    '949': 'cp949',
    'cp949': {
        type: '_dbcs',
        table: function() { return __webpack_require__(43) },
    },

    'cseuckr': 'cp949',
    'csksc56011987': 'cp949',
    'euckr': 'cp949',
    'isoir149': 'cp949',
    'korean': 'cp949',
    'ksc56011987': 'cp949',
    'ksc56011989': 'cp949',
    'ksc5601': 'cp949',


    // == Big5/Taiwan/Hong Kong ================================================
    // There are lots of tables for Big5 and cp950. Please see the following links for history:
    // http://moztw.org/docs/big5/  http://www.haible.de/bruno/charsets/conversion-tables/Big5.html
    // Variations, in roughly number of defined chars:
    //  * Windows CP 950: Microsoft variant of Big5. Canonical: http://www.unicode.org/Public/MAPPINGS/VENDORS/MICSFT/WINDOWS/CP950.TXT
    //  * Windows CP 951: Microsoft variant of Big5-HKSCS-2001. Seems to be never public. http://me.abelcheung.org/articles/research/what-is-cp951/
    //  * Big5-2003 (Taiwan standard) almost superset of cp950.
    //  * Unicode-at-on (UAO) / Mozilla 1.8. Falling out of use on the Web. Not supported by other browsers.
    //  * Big5-HKSCS (-2001, -2004, -2008). Hong Kong standard. 
    //    many unicode code points moved from PUA to Supplementary plane (U+2XXXX) over the years.
    //    Plus, it has 4 combining sequences.
    //    Seems that Mozilla refused to support it for 10 yrs. https://bugzilla.mozilla.org/show_bug.cgi?id=162431 https://bugzilla.mozilla.org/show_bug.cgi?id=310299
    //    because big5-hkscs is the only encoding to include astral characters in non-algorithmic way.
    //    Implementations are not consistent within browsers; sometimes labeled as just big5.
    //    MS Internet Explorer switches from big5 to big5-hkscs when a patch applied.
    //    Great discussion & recap of what's going on https://bugzilla.mozilla.org/show_bug.cgi?id=912470#c31
    //    In the encoder, it might make sense to support encoding old PUA mappings to Big5 bytes seq-s.
    //    Official spec: http://www.ogcio.gov.hk/en/business/tech_promotion/ccli/terms/doc/2003cmp_2008.txt
    //                   http://www.ogcio.gov.hk/tc/business/tech_promotion/ccli/terms/doc/hkscs-2008-big5-iso.txt
    // 
    // Current understanding of how to deal with Big5(-HKSCS) is in the Encoding Standard, http://encoding.spec.whatwg.org/#big5-encoder
    // Unicode mapping (http://www.unicode.org/Public/MAPPINGS/OBSOLETE/EASTASIA/OTHER/BIG5.TXT) is said to be wrong.

    'windows950': 'cp950',
    'ms950': 'cp950',
    '950': 'cp950',
    'cp950': {
        type: '_dbcs',
        table: function() { return __webpack_require__(14) },
    },

    // Big5 has many variations and is an extension of cp950. We use Encoding Standard's as a consensus.
    'big5': 'big5hkscs',
    'big5hkscs': {
        type: '_dbcs',
        table: function() { return __webpack_require__(14).concat(__webpack_require__(44)) },
        encodeSkipVals: [0xa2cc],
    },

    'cnbig5': 'big5hkscs',
    'csbig5': 'big5hkscs',
    'xxbig5': 'big5hkscs',
};


/***/ }),
/* 40 */
/***/ (function(module, exports) {

module.exports = [["0","\u0000",128],["a1","｡",62],["8140","　、。，．・：；？！゛゜´｀¨＾￣＿ヽヾゝゞ〃仝々〆〇ー―‐／＼～∥｜…‥‘’“”（）〔〕［］｛｝〈",9,"＋－±×"],["8180","÷＝≠＜＞≦≧∞∴♂♀°′″℃￥＄￠￡％＃＆＊＠§☆★○●◎◇◆□■△▲▽▼※〒→←↑↓〓"],["81b8","∈∋⊆⊇⊂⊃∪∩"],["81c8","∧∨￢⇒⇔∀∃"],["81da","∠⊥⌒∂∇≡≒≪≫√∽∝∵∫∬"],["81f0","Å‰♯♭♪†‡¶"],["81fc","◯"],["824f","０",9],["8260","Ａ",25],["8281","ａ",25],["829f","ぁ",82],["8340","ァ",62],["8380","ム",22],["839f","Α",16,"Σ",6],["83bf","α",16,"σ",6],["8440","А",5,"ЁЖ",25],["8470","а",5,"ёж",7],["8480","о",17],["849f","─│┌┐┘└├┬┤┴┼━┃┏┓┛┗┣┳┫┻╋┠┯┨┷┿┝┰┥┸╂"],["8740","①",19,"Ⅰ",9],["875f","㍉㌔㌢㍍㌘㌧㌃㌶㍑㍗㌍㌦㌣㌫㍊㌻㎜㎝㎞㎎㎏㏄㎡"],["877e","㍻"],["8780","〝〟№㏍℡㊤",4,"㈱㈲㈹㍾㍽㍼≒≡∫∮∑√⊥∠∟⊿∵∩∪"],["889f","亜唖娃阿哀愛挨姶逢葵茜穐悪握渥旭葦芦鯵梓圧斡扱宛姐虻飴絢綾鮎或粟袷安庵按暗案闇鞍杏以伊位依偉囲夷委威尉惟意慰易椅為畏異移維緯胃萎衣謂違遺医井亥域育郁磯一壱溢逸稲茨芋鰯允印咽員因姻引飲淫胤蔭"],["8940","院陰隠韻吋右宇烏羽迂雨卯鵜窺丑碓臼渦嘘唄欝蔚鰻姥厩浦瓜閏噂云運雲荏餌叡営嬰影映曳栄永泳洩瑛盈穎頴英衛詠鋭液疫益駅悦謁越閲榎厭円"],["8980","園堰奄宴延怨掩援沿演炎焔煙燕猿縁艶苑薗遠鉛鴛塩於汚甥凹央奥往応押旺横欧殴王翁襖鴬鴎黄岡沖荻億屋憶臆桶牡乙俺卸恩温穏音下化仮何伽価佳加可嘉夏嫁家寡科暇果架歌河火珂禍禾稼箇花苛茄荷華菓蝦課嘩貨迦過霞蚊俄峨我牙画臥芽蛾賀雅餓駕介会解回塊壊廻快怪悔恢懐戒拐改"],["8a40","魁晦械海灰界皆絵芥蟹開階貝凱劾外咳害崖慨概涯碍蓋街該鎧骸浬馨蛙垣柿蛎鈎劃嚇各廓拡撹格核殻獲確穫覚角赫較郭閣隔革学岳楽額顎掛笠樫"],["8a80","橿梶鰍潟割喝恰括活渇滑葛褐轄且鰹叶椛樺鞄株兜竃蒲釜鎌噛鴨栢茅萱粥刈苅瓦乾侃冠寒刊勘勧巻喚堪姦完官寛干幹患感慣憾換敢柑桓棺款歓汗漢澗潅環甘監看竿管簡緩缶翰肝艦莞観諌貫還鑑間閑関陥韓館舘丸含岸巌玩癌眼岩翫贋雁頑顔願企伎危喜器基奇嬉寄岐希幾忌揮机旗既期棋棄"],["8b40","機帰毅気汽畿祈季稀紀徽規記貴起軌輝飢騎鬼亀偽儀妓宜戯技擬欺犠疑祇義蟻誼議掬菊鞠吉吃喫桔橘詰砧杵黍却客脚虐逆丘久仇休及吸宮弓急救"],["8b80","朽求汲泣灸球究窮笈級糾給旧牛去居巨拒拠挙渠虚許距鋸漁禦魚亨享京供侠僑兇競共凶協匡卿叫喬境峡強彊怯恐恭挟教橋況狂狭矯胸脅興蕎郷鏡響饗驚仰凝尭暁業局曲極玉桐粁僅勤均巾錦斤欣欽琴禁禽筋緊芹菌衿襟謹近金吟銀九倶句区狗玖矩苦躯駆駈駒具愚虞喰空偶寓遇隅串櫛釧屑屈"],["8c40","掘窟沓靴轡窪熊隈粂栗繰桑鍬勲君薫訓群軍郡卦袈祁係傾刑兄啓圭珪型契形径恵慶慧憩掲携敬景桂渓畦稽系経継繋罫茎荊蛍計詣警軽頚鶏芸迎鯨"],["8c80","劇戟撃激隙桁傑欠決潔穴結血訣月件倹倦健兼券剣喧圏堅嫌建憲懸拳捲検権牽犬献研硯絹県肩見謙賢軒遣鍵険顕験鹸元原厳幻弦減源玄現絃舷言諺限乎個古呼固姑孤己庫弧戸故枯湖狐糊袴股胡菰虎誇跨鈷雇顧鼓五互伍午呉吾娯後御悟梧檎瑚碁語誤護醐乞鯉交佼侯候倖光公功効勾厚口向"],["8d40","后喉坑垢好孔孝宏工巧巷幸広庚康弘恒慌抗拘控攻昂晃更杭校梗構江洪浩港溝甲皇硬稿糠紅紘絞綱耕考肯肱腔膏航荒行衡講貢購郊酵鉱砿鋼閤降"],["8d80","項香高鴻剛劫号合壕拷濠豪轟麹克刻告国穀酷鵠黒獄漉腰甑忽惚骨狛込此頃今困坤墾婚恨懇昏昆根梱混痕紺艮魂些佐叉唆嵯左差査沙瑳砂詐鎖裟坐座挫債催再最哉塞妻宰彩才採栽歳済災采犀砕砦祭斎細菜裁載際剤在材罪財冴坂阪堺榊肴咲崎埼碕鷺作削咋搾昨朔柵窄策索錯桜鮭笹匙冊刷"],["8e40","察拶撮擦札殺薩雑皐鯖捌錆鮫皿晒三傘参山惨撒散桟燦珊産算纂蚕讃賛酸餐斬暫残仕仔伺使刺司史嗣四士始姉姿子屍市師志思指支孜斯施旨枝止"],["8e80","死氏獅祉私糸紙紫肢脂至視詞詩試誌諮資賜雌飼歯事似侍児字寺慈持時次滋治爾璽痔磁示而耳自蒔辞汐鹿式識鴫竺軸宍雫七叱執失嫉室悉湿漆疾質実蔀篠偲柴芝屡蕊縞舎写射捨赦斜煮社紗者謝車遮蛇邪借勺尺杓灼爵酌釈錫若寂弱惹主取守手朱殊狩珠種腫趣酒首儒受呪寿授樹綬需囚収周"],["8f40","宗就州修愁拾洲秀秋終繍習臭舟蒐衆襲讐蹴輯週酋酬集醜什住充十従戎柔汁渋獣縦重銃叔夙宿淑祝縮粛塾熟出術述俊峻春瞬竣舜駿准循旬楯殉淳"],["8f80","準潤盾純巡遵醇順処初所暑曙渚庶緒署書薯藷諸助叙女序徐恕鋤除傷償勝匠升召哨商唱嘗奨妾娼宵将小少尚庄床廠彰承抄招掌捷昇昌昭晶松梢樟樵沼消渉湘焼焦照症省硝礁祥称章笑粧紹肖菖蒋蕉衝裳訟証詔詳象賞醤鉦鍾鐘障鞘上丈丞乗冗剰城場壌嬢常情擾条杖浄状畳穣蒸譲醸錠嘱埴飾"],["9040","拭植殖燭織職色触食蝕辱尻伸信侵唇娠寝審心慎振新晋森榛浸深申疹真神秦紳臣芯薪親診身辛進針震人仁刃塵壬尋甚尽腎訊迅陣靭笥諏須酢図厨"],["9080","逗吹垂帥推水炊睡粋翠衰遂酔錐錘随瑞髄崇嵩数枢趨雛据杉椙菅頗雀裾澄摺寸世瀬畝是凄制勢姓征性成政整星晴棲栖正清牲生盛精聖声製西誠誓請逝醒青静斉税脆隻席惜戚斥昔析石積籍績脊責赤跡蹟碩切拙接摂折設窃節説雪絶舌蝉仙先千占宣専尖川戦扇撰栓栴泉浅洗染潜煎煽旋穿箭線"],["9140","繊羨腺舛船薦詮賎践選遷銭銑閃鮮前善漸然全禅繕膳糎噌塑岨措曾曽楚狙疏疎礎祖租粗素組蘇訴阻遡鼠僧創双叢倉喪壮奏爽宋層匝惣想捜掃挿掻"],["9180","操早曹巣槍槽漕燥争痩相窓糟総綜聡草荘葬蒼藻装走送遭鎗霜騒像増憎臓蔵贈造促側則即息捉束測足速俗属賊族続卒袖其揃存孫尊損村遜他多太汰詑唾堕妥惰打柁舵楕陀駄騨体堆対耐岱帯待怠態戴替泰滞胎腿苔袋貸退逮隊黛鯛代台大第醍題鷹滝瀧卓啄宅托択拓沢濯琢託鐸濁諾茸凧蛸只"],["9240","叩但達辰奪脱巽竪辿棚谷狸鱈樽誰丹単嘆坦担探旦歎淡湛炭短端箪綻耽胆蛋誕鍛団壇弾断暖檀段男談値知地弛恥智池痴稚置致蜘遅馳築畜竹筑蓄"],["9280","逐秩窒茶嫡着中仲宙忠抽昼柱注虫衷註酎鋳駐樗瀦猪苧著貯丁兆凋喋寵帖帳庁弔張彫徴懲挑暢朝潮牒町眺聴脹腸蝶調諜超跳銚長頂鳥勅捗直朕沈珍賃鎮陳津墜椎槌追鎚痛通塚栂掴槻佃漬柘辻蔦綴鍔椿潰坪壷嬬紬爪吊釣鶴亭低停偵剃貞呈堤定帝底庭廷弟悌抵挺提梯汀碇禎程締艇訂諦蹄逓"],["9340","邸鄭釘鼎泥摘擢敵滴的笛適鏑溺哲徹撤轍迭鉄典填天展店添纏甜貼転顛点伝殿澱田電兎吐堵塗妬屠徒斗杜渡登菟賭途都鍍砥砺努度土奴怒倒党冬"],["9380","凍刀唐塔塘套宕島嶋悼投搭東桃梼棟盗淘湯涛灯燈当痘祷等答筒糖統到董蕩藤討謄豆踏逃透鐙陶頭騰闘働動同堂導憧撞洞瞳童胴萄道銅峠鴇匿得徳涜特督禿篤毒独読栃橡凸突椴届鳶苫寅酉瀞噸屯惇敦沌豚遁頓呑曇鈍奈那内乍凪薙謎灘捺鍋楢馴縄畷南楠軟難汝二尼弐迩匂賑肉虹廿日乳入"],["9440","如尿韮任妊忍認濡禰祢寧葱猫熱年念捻撚燃粘乃廼之埜嚢悩濃納能脳膿農覗蚤巴把播覇杷波派琶破婆罵芭馬俳廃拝排敗杯盃牌背肺輩配倍培媒梅"],["9480","楳煤狽買売賠陪這蝿秤矧萩伯剥博拍柏泊白箔粕舶薄迫曝漠爆縛莫駁麦函箱硲箸肇筈櫨幡肌畑畠八鉢溌発醗髪伐罰抜筏閥鳩噺塙蛤隼伴判半反叛帆搬斑板氾汎版犯班畔繁般藩販範釆煩頒飯挽晩番盤磐蕃蛮匪卑否妃庇彼悲扉批披斐比泌疲皮碑秘緋罷肥被誹費避非飛樋簸備尾微枇毘琵眉美"],["9540","鼻柊稗匹疋髭彦膝菱肘弼必畢筆逼桧姫媛紐百謬俵彪標氷漂瓢票表評豹廟描病秒苗錨鋲蒜蛭鰭品彬斌浜瀕貧賓頻敏瓶不付埠夫婦富冨布府怖扶敷"],["9580","斧普浮父符腐膚芙譜負賦赴阜附侮撫武舞葡蕪部封楓風葺蕗伏副復幅服福腹複覆淵弗払沸仏物鮒分吻噴墳憤扮焚奮粉糞紛雰文聞丙併兵塀幣平弊柄並蔽閉陛米頁僻壁癖碧別瞥蔑箆偏変片篇編辺返遍便勉娩弁鞭保舗鋪圃捕歩甫補輔穂募墓慕戊暮母簿菩倣俸包呆報奉宝峰峯崩庖抱捧放方朋"],["9640","法泡烹砲縫胞芳萌蓬蜂褒訪豊邦鋒飽鳳鵬乏亡傍剖坊妨帽忘忙房暴望某棒冒紡肪膨謀貌貿鉾防吠頬北僕卜墨撲朴牧睦穆釦勃没殆堀幌奔本翻凡盆"],["9680","摩磨魔麻埋妹昧枚毎哩槙幕膜枕鮪柾鱒桝亦俣又抹末沫迄侭繭麿万慢満漫蔓味未魅巳箕岬密蜜湊蓑稔脈妙粍民眠務夢無牟矛霧鵡椋婿娘冥名命明盟迷銘鳴姪牝滅免棉綿緬面麺摸模茂妄孟毛猛盲網耗蒙儲木黙目杢勿餅尤戻籾貰問悶紋門匁也冶夜爺耶野弥矢厄役約薬訳躍靖柳薮鑓愉愈油癒"],["9740","諭輸唯佑優勇友宥幽悠憂揖有柚湧涌猶猷由祐裕誘遊邑郵雄融夕予余与誉輿預傭幼妖容庸揚揺擁曜楊様洋溶熔用窯羊耀葉蓉要謡踊遥陽養慾抑欲"],["9780","沃浴翌翼淀羅螺裸来莱頼雷洛絡落酪乱卵嵐欄濫藍蘭覧利吏履李梨理璃痢裏裡里離陸律率立葎掠略劉流溜琉留硫粒隆竜龍侶慮旅虜了亮僚両凌寮料梁涼猟療瞭稜糧良諒遼量陵領力緑倫厘林淋燐琳臨輪隣鱗麟瑠塁涙累類令伶例冷励嶺怜玲礼苓鈴隷零霊麗齢暦歴列劣烈裂廉恋憐漣煉簾練聯"],["9840","蓮連錬呂魯櫓炉賂路露労婁廊弄朗楼榔浪漏牢狼篭老聾蝋郎六麓禄肋録論倭和話歪賄脇惑枠鷲亙亘鰐詫藁蕨椀湾碗腕"],["989f","弌丐丕个丱丶丼丿乂乖乘亂亅豫亊舒弍于亞亟亠亢亰亳亶从仍仄仆仂仗仞仭仟价伉佚估佛佝佗佇佶侈侏侘佻佩佰侑佯來侖儘俔俟俎俘俛俑俚俐俤俥倚倨倔倪倥倅伜俶倡倩倬俾俯們倆偃假會偕偐偈做偖偬偸傀傚傅傴傲"],["9940","僉僊傳僂僖僞僥僭僣僮價僵儉儁儂儖儕儔儚儡儺儷儼儻儿兀兒兌兔兢竸兩兪兮冀冂囘册冉冏冑冓冕冖冤冦冢冩冪冫决冱冲冰况冽凅凉凛几處凩凭"],["9980","凰凵凾刄刋刔刎刧刪刮刳刹剏剄剋剌剞剔剪剴剩剳剿剽劍劔劒剱劈劑辨辧劬劭劼劵勁勍勗勞勣勦飭勠勳勵勸勹匆匈甸匍匐匏匕匚匣匯匱匳匸區卆卅丗卉卍凖卞卩卮夘卻卷厂厖厠厦厥厮厰厶參簒雙叟曼燮叮叨叭叺吁吽呀听吭吼吮吶吩吝呎咏呵咎呟呱呷呰咒呻咀呶咄咐咆哇咢咸咥咬哄哈咨"],["9a40","咫哂咤咾咼哘哥哦唏唔哽哮哭哺哢唹啀啣啌售啜啅啖啗唸唳啝喙喀咯喊喟啻啾喘喞單啼喃喩喇喨嗚嗅嗟嗄嗜嗤嗔嘔嗷嘖嗾嗽嘛嗹噎噐營嘴嘶嘲嘸"],["9a80","噫噤嘯噬噪嚆嚀嚊嚠嚔嚏嚥嚮嚶嚴囂嚼囁囃囀囈囎囑囓囗囮囹圀囿圄圉圈國圍圓團圖嗇圜圦圷圸坎圻址坏坩埀垈坡坿垉垓垠垳垤垪垰埃埆埔埒埓堊埖埣堋堙堝塲堡塢塋塰毀塒堽塹墅墹墟墫墺壞墻墸墮壅壓壑壗壙壘壥壜壤壟壯壺壹壻壼壽夂夊夐夛梦夥夬夭夲夸夾竒奕奐奎奚奘奢奠奧奬奩"],["9b40","奸妁妝佞侫妣妲姆姨姜妍姙姚娥娟娑娜娉娚婀婬婉娵娶婢婪媚媼媾嫋嫂媽嫣嫗嫦嫩嫖嫺嫻嬌嬋嬖嬲嫐嬪嬶嬾孃孅孀孑孕孚孛孥孩孰孳孵學斈孺宀"],["9b80","它宦宸寃寇寉寔寐寤實寢寞寥寫寰寶寳尅將專對尓尠尢尨尸尹屁屆屎屓屐屏孱屬屮乢屶屹岌岑岔妛岫岻岶岼岷峅岾峇峙峩峽峺峭嶌峪崋崕崗嵜崟崛崑崔崢崚崙崘嵌嵒嵎嵋嵬嵳嵶嶇嶄嶂嶢嶝嶬嶮嶽嶐嶷嶼巉巍巓巒巖巛巫已巵帋帚帙帑帛帶帷幄幃幀幎幗幔幟幢幤幇幵并幺麼广庠廁廂廈廐廏"],["9c40","廖廣廝廚廛廢廡廨廩廬廱廳廰廴廸廾弃弉彝彜弋弑弖弩弭弸彁彈彌彎弯彑彖彗彙彡彭彳彷徃徂彿徊很徑徇從徙徘徠徨徭徼忖忻忤忸忱忝悳忿怡恠"],["9c80","怙怐怩怎怱怛怕怫怦怏怺恚恁恪恷恟恊恆恍恣恃恤恂恬恫恙悁悍惧悃悚悄悛悖悗悒悧悋惡悸惠惓悴忰悽惆悵惘慍愕愆惶惷愀惴惺愃愡惻惱愍愎慇愾愨愧慊愿愼愬愴愽慂慄慳慷慘慙慚慫慴慯慥慱慟慝慓慵憙憖憇憬憔憚憊憑憫憮懌懊應懷懈懃懆憺懋罹懍懦懣懶懺懴懿懽懼懾戀戈戉戍戌戔戛"],["9d40","戞戡截戮戰戲戳扁扎扞扣扛扠扨扼抂抉找抒抓抖拔抃抔拗拑抻拏拿拆擔拈拜拌拊拂拇抛拉挌拮拱挧挂挈拯拵捐挾捍搜捏掖掎掀掫捶掣掏掉掟掵捫"],["9d80","捩掾揩揀揆揣揉插揶揄搖搴搆搓搦搶攝搗搨搏摧摯摶摎攪撕撓撥撩撈撼據擒擅擇撻擘擂擱擧舉擠擡抬擣擯攬擶擴擲擺攀擽攘攜攅攤攣攫攴攵攷收攸畋效敖敕敍敘敞敝敲數斂斃變斛斟斫斷旃旆旁旄旌旒旛旙无旡旱杲昊昃旻杳昵昶昴昜晏晄晉晁晞晝晤晧晨晟晢晰暃暈暎暉暄暘暝曁暹曉暾暼"],["9e40","曄暸曖曚曠昿曦曩曰曵曷朏朖朞朦朧霸朮朿朶杁朸朷杆杞杠杙杣杤枉杰枩杼杪枌枋枦枡枅枷柯枴柬枳柩枸柤柞柝柢柮枹柎柆柧檜栞框栩桀桍栲桎"],["9e80","梳栫桙档桷桿梟梏梭梔條梛梃檮梹桴梵梠梺椏梍桾椁棊椈棘椢椦棡椌棍棔棧棕椶椒椄棗棣椥棹棠棯椨椪椚椣椡棆楹楷楜楸楫楔楾楮椹楴椽楙椰楡楞楝榁楪榲榮槐榿槁槓榾槎寨槊槝榻槃榧樮榑榠榜榕榴槞槨樂樛槿權槹槲槧樅榱樞槭樔槫樊樒櫁樣樓橄樌橲樶橸橇橢橙橦橈樸樢檐檍檠檄檢檣"],["9f40","檗蘗檻櫃櫂檸檳檬櫞櫑櫟檪櫚櫪櫻欅蘖櫺欒欖鬱欟欸欷盜欹飮歇歃歉歐歙歔歛歟歡歸歹歿殀殄殃殍殘殕殞殤殪殫殯殲殱殳殷殼毆毋毓毟毬毫毳毯"],["9f80","麾氈氓气氛氤氣汞汕汢汪沂沍沚沁沛汾汨汳沒沐泄泱泓沽泗泅泝沮沱沾沺泛泯泙泪洟衍洶洫洽洸洙洵洳洒洌浣涓浤浚浹浙涎涕濤涅淹渕渊涵淇淦涸淆淬淞淌淨淒淅淺淙淤淕淪淮渭湮渮渙湲湟渾渣湫渫湶湍渟湃渺湎渤滿渝游溂溪溘滉溷滓溽溯滄溲滔滕溏溥滂溟潁漑灌滬滸滾漿滲漱滯漲滌"],["e040","漾漓滷澆潺潸澁澀潯潛濳潭澂潼潘澎澑濂潦澳澣澡澤澹濆澪濟濕濬濔濘濱濮濛瀉瀋濺瀑瀁瀏濾瀛瀚潴瀝瀘瀟瀰瀾瀲灑灣炙炒炯烱炬炸炳炮烟烋烝"],["e080","烙焉烽焜焙煥煕熈煦煢煌煖煬熏燻熄熕熨熬燗熹熾燒燉燔燎燠燬燧燵燼燹燿爍爐爛爨爭爬爰爲爻爼爿牀牆牋牘牴牾犂犁犇犒犖犢犧犹犲狃狆狄狎狒狢狠狡狹狷倏猗猊猜猖猝猴猯猩猥猾獎獏默獗獪獨獰獸獵獻獺珈玳珎玻珀珥珮珞璢琅瑯琥珸琲琺瑕琿瑟瑙瑁瑜瑩瑰瑣瑪瑶瑾璋璞璧瓊瓏瓔珱"],["e140","瓠瓣瓧瓩瓮瓲瓰瓱瓸瓷甄甃甅甌甎甍甕甓甞甦甬甼畄畍畊畉畛畆畚畩畤畧畫畭畸當疆疇畴疊疉疂疔疚疝疥疣痂疳痃疵疽疸疼疱痍痊痒痙痣痞痾痿"],["e180","痼瘁痰痺痲痳瘋瘍瘉瘟瘧瘠瘡瘢瘤瘴瘰瘻癇癈癆癜癘癡癢癨癩癪癧癬癰癲癶癸發皀皃皈皋皎皖皓皙皚皰皴皸皹皺盂盍盖盒盞盡盥盧盪蘯盻眈眇眄眩眤眞眥眦眛眷眸睇睚睨睫睛睥睿睾睹瞎瞋瞑瞠瞞瞰瞶瞹瞿瞼瞽瞻矇矍矗矚矜矣矮矼砌砒礦砠礪硅碎硴碆硼碚碌碣碵碪碯磑磆磋磔碾碼磅磊磬"],["e240","磧磚磽磴礇礒礑礙礬礫祀祠祗祟祚祕祓祺祿禊禝禧齋禪禮禳禹禺秉秕秧秬秡秣稈稍稘稙稠稟禀稱稻稾稷穃穗穉穡穢穩龝穰穹穽窈窗窕窘窖窩竈窰"],["e280","窶竅竄窿邃竇竊竍竏竕竓站竚竝竡竢竦竭竰笂笏笊笆笳笘笙笞笵笨笶筐筺笄筍笋筌筅筵筥筴筧筰筱筬筮箝箘箟箍箜箚箋箒箏筝箙篋篁篌篏箴篆篝篩簑簔篦篥籠簀簇簓篳篷簗簍篶簣簧簪簟簷簫簽籌籃籔籏籀籐籘籟籤籖籥籬籵粃粐粤粭粢粫粡粨粳粲粱粮粹粽糀糅糂糘糒糜糢鬻糯糲糴糶糺紆"],["e340","紂紜紕紊絅絋紮紲紿紵絆絳絖絎絲絨絮絏絣經綉絛綏絽綛綺綮綣綵緇綽綫總綢綯緜綸綟綰緘緝緤緞緻緲緡縅縊縣縡縒縱縟縉縋縢繆繦縻縵縹繃縷"],["e380","縲縺繧繝繖繞繙繚繹繪繩繼繻纃緕繽辮繿纈纉續纒纐纓纔纖纎纛纜缸缺罅罌罍罎罐网罕罔罘罟罠罨罩罧罸羂羆羃羈羇羌羔羞羝羚羣羯羲羹羮羶羸譱翅翆翊翕翔翡翦翩翳翹飜耆耄耋耒耘耙耜耡耨耿耻聊聆聒聘聚聟聢聨聳聲聰聶聹聽聿肄肆肅肛肓肚肭冐肬胛胥胙胝胄胚胖脉胯胱脛脩脣脯腋"],["e440","隋腆脾腓腑胼腱腮腥腦腴膃膈膊膀膂膠膕膤膣腟膓膩膰膵膾膸膽臀臂膺臉臍臑臙臘臈臚臟臠臧臺臻臾舁舂舅與舊舍舐舖舩舫舸舳艀艙艘艝艚艟艤"],["e480","艢艨艪艫舮艱艷艸艾芍芒芫芟芻芬苡苣苟苒苴苳苺莓范苻苹苞茆苜茉苙茵茴茖茲茱荀茹荐荅茯茫茗茘莅莚莪莟莢莖茣莎莇莊荼莵荳荵莠莉莨菴萓菫菎菽萃菘萋菁菷萇菠菲萍萢萠莽萸蔆菻葭萪萼蕚蒄葷葫蒭葮蒂葩葆萬葯葹萵蓊葢蒹蒿蒟蓙蓍蒻蓚蓐蓁蓆蓖蒡蔡蓿蓴蔗蔘蔬蔟蔕蔔蓼蕀蕣蕘蕈"],["e540","蕁蘂蕋蕕薀薤薈薑薊薨蕭薔薛藪薇薜蕷蕾薐藉薺藏薹藐藕藝藥藜藹蘊蘓蘋藾藺蘆蘢蘚蘰蘿虍乕虔號虧虱蚓蚣蚩蚪蚋蚌蚶蚯蛄蛆蚰蛉蠣蚫蛔蛞蛩蛬"],["e580","蛟蛛蛯蜒蜆蜈蜀蜃蛻蜑蜉蜍蛹蜊蜴蜿蜷蜻蜥蜩蜚蝠蝟蝸蝌蝎蝴蝗蝨蝮蝙蝓蝣蝪蠅螢螟螂螯蟋螽蟀蟐雖螫蟄螳蟇蟆螻蟯蟲蟠蠏蠍蟾蟶蟷蠎蟒蠑蠖蠕蠢蠡蠱蠶蠹蠧蠻衄衂衒衙衞衢衫袁衾袞衵衽袵衲袂袗袒袮袙袢袍袤袰袿袱裃裄裔裘裙裝裹褂裼裴裨裲褄褌褊褓襃褞褥褪褫襁襄褻褶褸襌褝襠襞"],["e640","襦襤襭襪襯襴襷襾覃覈覊覓覘覡覩覦覬覯覲覺覽覿觀觚觜觝觧觴觸訃訖訐訌訛訝訥訶詁詛詒詆詈詼詭詬詢誅誂誄誨誡誑誥誦誚誣諄諍諂諚諫諳諧"],["e680","諤諱謔諠諢諷諞諛謌謇謚諡謖謐謗謠謳鞫謦謫謾謨譁譌譏譎證譖譛譚譫譟譬譯譴譽讀讌讎讒讓讖讙讚谺豁谿豈豌豎豐豕豢豬豸豺貂貉貅貊貍貎貔豼貘戝貭貪貽貲貳貮貶賈賁賤賣賚賽賺賻贄贅贊贇贏贍贐齎贓賍贔贖赧赭赱赳趁趙跂趾趺跏跚跖跌跛跋跪跫跟跣跼踈踉跿踝踞踐踟蹂踵踰踴蹊"],["e740","蹇蹉蹌蹐蹈蹙蹤蹠踪蹣蹕蹶蹲蹼躁躇躅躄躋躊躓躑躔躙躪躡躬躰軆躱躾軅軈軋軛軣軼軻軫軾輊輅輕輒輙輓輜輟輛輌輦輳輻輹轅轂輾轌轉轆轎轗轜"],["e780","轢轣轤辜辟辣辭辯辷迚迥迢迪迯邇迴逅迹迺逑逕逡逍逞逖逋逧逶逵逹迸遏遐遑遒逎遉逾遖遘遞遨遯遶隨遲邂遽邁邀邊邉邏邨邯邱邵郢郤扈郛鄂鄒鄙鄲鄰酊酖酘酣酥酩酳酲醋醉醂醢醫醯醪醵醴醺釀釁釉釋釐釖釟釡釛釼釵釶鈞釿鈔鈬鈕鈑鉞鉗鉅鉉鉤鉈銕鈿鉋鉐銜銖銓銛鉚鋏銹銷鋩錏鋺鍄錮"],["e840","錙錢錚錣錺錵錻鍜鍠鍼鍮鍖鎰鎬鎭鎔鎹鏖鏗鏨鏥鏘鏃鏝鏐鏈鏤鐚鐔鐓鐃鐇鐐鐶鐫鐵鐡鐺鑁鑒鑄鑛鑠鑢鑞鑪鈩鑰鑵鑷鑽鑚鑼鑾钁鑿閂閇閊閔閖閘閙"],["e880","閠閨閧閭閼閻閹閾闊濶闃闍闌闕闔闖關闡闥闢阡阨阮阯陂陌陏陋陷陜陞陝陟陦陲陬隍隘隕隗險隧隱隲隰隴隶隸隹雎雋雉雍襍雜霍雕雹霄霆霈霓霎霑霏霖霙霤霪霰霹霽霾靄靆靈靂靉靜靠靤靦靨勒靫靱靹鞅靼鞁靺鞆鞋鞏鞐鞜鞨鞦鞣鞳鞴韃韆韈韋韜韭齏韲竟韶韵頏頌頸頤頡頷頽顆顏顋顫顯顰"],["e940","顱顴顳颪颯颱颶飄飃飆飩飫餃餉餒餔餘餡餝餞餤餠餬餮餽餾饂饉饅饐饋饑饒饌饕馗馘馥馭馮馼駟駛駝駘駑駭駮駱駲駻駸騁騏騅駢騙騫騷驅驂驀驃"],["e980","騾驕驍驛驗驟驢驥驤驩驫驪骭骰骼髀髏髑髓體髞髟髢髣髦髯髫髮髴髱髷髻鬆鬘鬚鬟鬢鬣鬥鬧鬨鬩鬪鬮鬯鬲魄魃魏魍魎魑魘魴鮓鮃鮑鮖鮗鮟鮠鮨鮴鯀鯊鮹鯆鯏鯑鯒鯣鯢鯤鯔鯡鰺鯲鯱鯰鰕鰔鰉鰓鰌鰆鰈鰒鰊鰄鰮鰛鰥鰤鰡鰰鱇鰲鱆鰾鱚鱠鱧鱶鱸鳧鳬鳰鴉鴈鳫鴃鴆鴪鴦鶯鴣鴟鵄鴕鴒鵁鴿鴾鵆鵈"],["ea40","鵝鵞鵤鵑鵐鵙鵲鶉鶇鶫鵯鵺鶚鶤鶩鶲鷄鷁鶻鶸鶺鷆鷏鷂鷙鷓鷸鷦鷭鷯鷽鸚鸛鸞鹵鹹鹽麁麈麋麌麒麕麑麝麥麩麸麪麭靡黌黎黏黐黔黜點黝黠黥黨黯"],["ea80","黴黶黷黹黻黼黽鼇鼈皷鼕鼡鼬鼾齊齒齔齣齟齠齡齦齧齬齪齷齲齶龕龜龠堯槇遙瑤凜熙"],["ed40","纊褜鍈銈蓜俉炻昱棈鋹曻彅丨仡仼伀伃伹佖侒侊侚侔俍偀倢俿倞偆偰偂傔僴僘兊兤冝冾凬刕劜劦勀勛匀匇匤卲厓厲叝﨎咜咊咩哿喆坙坥垬埈埇﨏"],["ed80","塚增墲夋奓奛奝奣妤妺孖寀甯寘寬尞岦岺峵崧嵓﨑嵂嵭嶸嶹巐弡弴彧德忞恝悅悊惞惕愠惲愑愷愰憘戓抦揵摠撝擎敎昀昕昻昉昮昞昤晥晗晙晴晳暙暠暲暿曺朎朗杦枻桒柀栁桄棏﨓楨﨔榘槢樰橫橆橳橾櫢櫤毖氿汜沆汯泚洄涇浯涖涬淏淸淲淼渹湜渧渼溿澈澵濵瀅瀇瀨炅炫焏焄煜煆煇凞燁燾犱"],["ee40","犾猤猪獷玽珉珖珣珒琇珵琦琪琩琮瑢璉璟甁畯皂皜皞皛皦益睆劯砡硎硤硺礰礼神祥禔福禛竑竧靖竫箞精絈絜綷綠緖繒罇羡羽茁荢荿菇菶葈蒴蕓蕙"],["ee80","蕫﨟薰蘒﨡蠇裵訒訷詹誧誾諟諸諶譓譿賰賴贒赶﨣軏﨤逸遧郞都鄕鄧釚釗釞釭釮釤釥鈆鈐鈊鈺鉀鈼鉎鉙鉑鈹鉧銧鉷鉸鋧鋗鋙鋐﨧鋕鋠鋓錥錡鋻﨨錞鋿錝錂鍰鍗鎤鏆鏞鏸鐱鑅鑈閒隆﨩隝隯霳霻靃靍靏靑靕顗顥飯飼餧館馞驎髙髜魵魲鮏鮱鮻鰀鵰鵫鶴鸙黑"],["eeef","ⅰ",9,"￢￤＇＂"],["f040","",62],["f080","",124],["f140","",62],["f180","",124],["f240","",62],["f280","",124],["f340","",62],["f380","",124],["f440","",62],["f480","",124],["f540","",62],["f580","",124],["f640","",62],["f680","",124],["f740","",62],["f780","",124],["f840","",62],["f880","",124],["f940",""],["fa40","ⅰ",9,"Ⅰ",9,"￢￤＇＂㈱№℡∵纊褜鍈銈蓜俉炻昱棈鋹曻彅丨仡仼伀伃伹佖侒侊侚侔俍偀倢俿倞偆偰偂傔僴僘兊"],["fa80","兤冝冾凬刕劜劦勀勛匀匇匤卲厓厲叝﨎咜咊咩哿喆坙坥垬埈埇﨏塚增墲夋奓奛奝奣妤妺孖寀甯寘寬尞岦岺峵崧嵓﨑嵂嵭嶸嶹巐弡弴彧德忞恝悅悊惞惕愠惲愑愷愰憘戓抦揵摠撝擎敎昀昕昻昉昮昞昤晥晗晙晴晳暙暠暲暿曺朎朗杦枻桒柀栁桄棏﨓楨﨔榘槢樰橫橆橳橾櫢櫤毖氿汜沆汯泚洄涇浯"],["fb40","涖涬淏淸淲淼渹湜渧渼溿澈澵濵瀅瀇瀨炅炫焏焄煜煆煇凞燁燾犱犾猤猪獷玽珉珖珣珒琇珵琦琪琩琮瑢璉璟甁畯皂皜皞皛皦益睆劯砡硎硤硺礰礼神"],["fb80","祥禔福禛竑竧靖竫箞精絈絜綷綠緖繒罇羡羽茁荢荿菇菶葈蒴蕓蕙蕫﨟薰蘒﨡蠇裵訒訷詹誧誾諟諸諶譓譿賰賴贒赶﨣軏﨤逸遧郞都鄕鄧釚釗釞釭釮釤釥鈆鈐鈊鈺鉀鈼鉎鉙鉑鈹鉧銧鉷鉸鋧鋗鋙鋐﨧鋕鋠鋓錥錡鋻﨨錞鋿錝錂鍰鍗鎤鏆鏞鏸鐱鑅鑈閒隆﨩隝隯霳霻靃靍靏靑靕顗顥飯飼餧館馞驎髙"],["fc40","髜魵魲鮏鮱鮻鰀鵰鵫鶴鸙黑"]]

/***/ }),
/* 41 */
/***/ (function(module, exports) {

module.exports = [["0","\u0000",127],["8ea1","｡",62],["a1a1","　、。，．・：；？！゛゜´｀¨＾￣＿ヽヾゝゞ〃仝々〆〇ー―‐／＼～∥｜…‥‘’“”（）〔〕［］｛｝〈",9,"＋－±×÷＝≠＜＞≦≧∞∴♂♀°′″℃￥＄￠￡％＃＆＊＠§☆★○●◎◇"],["a2a1","◆□■△▲▽▼※〒→←↑↓〓"],["a2ba","∈∋⊆⊇⊂⊃∪∩"],["a2ca","∧∨￢⇒⇔∀∃"],["a2dc","∠⊥⌒∂∇≡≒≪≫√∽∝∵∫∬"],["a2f2","Å‰♯♭♪†‡¶"],["a2fe","◯"],["a3b0","０",9],["a3c1","Ａ",25],["a3e1","ａ",25],["a4a1","ぁ",82],["a5a1","ァ",85],["a6a1","Α",16,"Σ",6],["a6c1","α",16,"σ",6],["a7a1","А",5,"ЁЖ",25],["a7d1","а",5,"ёж",25],["a8a1","─│┌┐┘└├┬┤┴┼━┃┏┓┛┗┣┳┫┻╋┠┯┨┷┿┝┰┥┸╂"],["ada1","①",19,"Ⅰ",9],["adc0","㍉㌔㌢㍍㌘㌧㌃㌶㍑㍗㌍㌦㌣㌫㍊㌻㎜㎝㎞㎎㎏㏄㎡"],["addf","㍻〝〟№㏍℡㊤",4,"㈱㈲㈹㍾㍽㍼≒≡∫∮∑√⊥∠∟⊿∵∩∪"],["b0a1","亜唖娃阿哀愛挨姶逢葵茜穐悪握渥旭葦芦鯵梓圧斡扱宛姐虻飴絢綾鮎或粟袷安庵按暗案闇鞍杏以伊位依偉囲夷委威尉惟意慰易椅為畏異移維緯胃萎衣謂違遺医井亥域育郁磯一壱溢逸稲茨芋鰯允印咽員因姻引飲淫胤蔭"],["b1a1","院陰隠韻吋右宇烏羽迂雨卯鵜窺丑碓臼渦嘘唄欝蔚鰻姥厩浦瓜閏噂云運雲荏餌叡営嬰影映曳栄永泳洩瑛盈穎頴英衛詠鋭液疫益駅悦謁越閲榎厭円園堰奄宴延怨掩援沿演炎焔煙燕猿縁艶苑薗遠鉛鴛塩於汚甥凹央奥往応"],["b2a1","押旺横欧殴王翁襖鴬鴎黄岡沖荻億屋憶臆桶牡乙俺卸恩温穏音下化仮何伽価佳加可嘉夏嫁家寡科暇果架歌河火珂禍禾稼箇花苛茄荷華菓蝦課嘩貨迦過霞蚊俄峨我牙画臥芽蛾賀雅餓駕介会解回塊壊廻快怪悔恢懐戒拐改"],["b3a1","魁晦械海灰界皆絵芥蟹開階貝凱劾外咳害崖慨概涯碍蓋街該鎧骸浬馨蛙垣柿蛎鈎劃嚇各廓拡撹格核殻獲確穫覚角赫較郭閣隔革学岳楽額顎掛笠樫橿梶鰍潟割喝恰括活渇滑葛褐轄且鰹叶椛樺鞄株兜竃蒲釜鎌噛鴨栢茅萱"],["b4a1","粥刈苅瓦乾侃冠寒刊勘勧巻喚堪姦完官寛干幹患感慣憾換敢柑桓棺款歓汗漢澗潅環甘監看竿管簡緩缶翰肝艦莞観諌貫還鑑間閑関陥韓館舘丸含岸巌玩癌眼岩翫贋雁頑顔願企伎危喜器基奇嬉寄岐希幾忌揮机旗既期棋棄"],["b5a1","機帰毅気汽畿祈季稀紀徽規記貴起軌輝飢騎鬼亀偽儀妓宜戯技擬欺犠疑祇義蟻誼議掬菊鞠吉吃喫桔橘詰砧杵黍却客脚虐逆丘久仇休及吸宮弓急救朽求汲泣灸球究窮笈級糾給旧牛去居巨拒拠挙渠虚許距鋸漁禦魚亨享京"],["b6a1","供侠僑兇競共凶協匡卿叫喬境峡強彊怯恐恭挟教橋況狂狭矯胸脅興蕎郷鏡響饗驚仰凝尭暁業局曲極玉桐粁僅勤均巾錦斤欣欽琴禁禽筋緊芹菌衿襟謹近金吟銀九倶句区狗玖矩苦躯駆駈駒具愚虞喰空偶寓遇隅串櫛釧屑屈"],["b7a1","掘窟沓靴轡窪熊隈粂栗繰桑鍬勲君薫訓群軍郡卦袈祁係傾刑兄啓圭珪型契形径恵慶慧憩掲携敬景桂渓畦稽系経継繋罫茎荊蛍計詣警軽頚鶏芸迎鯨劇戟撃激隙桁傑欠決潔穴結血訣月件倹倦健兼券剣喧圏堅嫌建憲懸拳捲"],["b8a1","検権牽犬献研硯絹県肩見謙賢軒遣鍵険顕験鹸元原厳幻弦減源玄現絃舷言諺限乎個古呼固姑孤己庫弧戸故枯湖狐糊袴股胡菰虎誇跨鈷雇顧鼓五互伍午呉吾娯後御悟梧檎瑚碁語誤護醐乞鯉交佼侯候倖光公功効勾厚口向"],["b9a1","后喉坑垢好孔孝宏工巧巷幸広庚康弘恒慌抗拘控攻昂晃更杭校梗構江洪浩港溝甲皇硬稿糠紅紘絞綱耕考肯肱腔膏航荒行衡講貢購郊酵鉱砿鋼閤降項香高鴻剛劫号合壕拷濠豪轟麹克刻告国穀酷鵠黒獄漉腰甑忽惚骨狛込"],["baa1","此頃今困坤墾婚恨懇昏昆根梱混痕紺艮魂些佐叉唆嵯左差査沙瑳砂詐鎖裟坐座挫債催再最哉塞妻宰彩才採栽歳済災采犀砕砦祭斎細菜裁載際剤在材罪財冴坂阪堺榊肴咲崎埼碕鷺作削咋搾昨朔柵窄策索錯桜鮭笹匙冊刷"],["bba1","察拶撮擦札殺薩雑皐鯖捌錆鮫皿晒三傘参山惨撒散桟燦珊産算纂蚕讃賛酸餐斬暫残仕仔伺使刺司史嗣四士始姉姿子屍市師志思指支孜斯施旨枝止死氏獅祉私糸紙紫肢脂至視詞詩試誌諮資賜雌飼歯事似侍児字寺慈持時"],["bca1","次滋治爾璽痔磁示而耳自蒔辞汐鹿式識鴫竺軸宍雫七叱執失嫉室悉湿漆疾質実蔀篠偲柴芝屡蕊縞舎写射捨赦斜煮社紗者謝車遮蛇邪借勺尺杓灼爵酌釈錫若寂弱惹主取守手朱殊狩珠種腫趣酒首儒受呪寿授樹綬需囚収周"],["bda1","宗就州修愁拾洲秀秋終繍習臭舟蒐衆襲讐蹴輯週酋酬集醜什住充十従戎柔汁渋獣縦重銃叔夙宿淑祝縮粛塾熟出術述俊峻春瞬竣舜駿准循旬楯殉淳準潤盾純巡遵醇順処初所暑曙渚庶緒署書薯藷諸助叙女序徐恕鋤除傷償"],["bea1","勝匠升召哨商唱嘗奨妾娼宵将小少尚庄床廠彰承抄招掌捷昇昌昭晶松梢樟樵沼消渉湘焼焦照症省硝礁祥称章笑粧紹肖菖蒋蕉衝裳訟証詔詳象賞醤鉦鍾鐘障鞘上丈丞乗冗剰城場壌嬢常情擾条杖浄状畳穣蒸譲醸錠嘱埴飾"],["bfa1","拭植殖燭織職色触食蝕辱尻伸信侵唇娠寝審心慎振新晋森榛浸深申疹真神秦紳臣芯薪親診身辛進針震人仁刃塵壬尋甚尽腎訊迅陣靭笥諏須酢図厨逗吹垂帥推水炊睡粋翠衰遂酔錐錘随瑞髄崇嵩数枢趨雛据杉椙菅頗雀裾"],["c0a1","澄摺寸世瀬畝是凄制勢姓征性成政整星晴棲栖正清牲生盛精聖声製西誠誓請逝醒青静斉税脆隻席惜戚斥昔析石積籍績脊責赤跡蹟碩切拙接摂折設窃節説雪絶舌蝉仙先千占宣専尖川戦扇撰栓栴泉浅洗染潜煎煽旋穿箭線"],["c1a1","繊羨腺舛船薦詮賎践選遷銭銑閃鮮前善漸然全禅繕膳糎噌塑岨措曾曽楚狙疏疎礎祖租粗素組蘇訴阻遡鼠僧創双叢倉喪壮奏爽宋層匝惣想捜掃挿掻操早曹巣槍槽漕燥争痩相窓糟総綜聡草荘葬蒼藻装走送遭鎗霜騒像増憎"],["c2a1","臓蔵贈造促側則即息捉束測足速俗属賊族続卒袖其揃存孫尊損村遜他多太汰詑唾堕妥惰打柁舵楕陀駄騨体堆対耐岱帯待怠態戴替泰滞胎腿苔袋貸退逮隊黛鯛代台大第醍題鷹滝瀧卓啄宅托択拓沢濯琢託鐸濁諾茸凧蛸只"],["c3a1","叩但達辰奪脱巽竪辿棚谷狸鱈樽誰丹単嘆坦担探旦歎淡湛炭短端箪綻耽胆蛋誕鍛団壇弾断暖檀段男談値知地弛恥智池痴稚置致蜘遅馳築畜竹筑蓄逐秩窒茶嫡着中仲宙忠抽昼柱注虫衷註酎鋳駐樗瀦猪苧著貯丁兆凋喋寵"],["c4a1","帖帳庁弔張彫徴懲挑暢朝潮牒町眺聴脹腸蝶調諜超跳銚長頂鳥勅捗直朕沈珍賃鎮陳津墜椎槌追鎚痛通塚栂掴槻佃漬柘辻蔦綴鍔椿潰坪壷嬬紬爪吊釣鶴亭低停偵剃貞呈堤定帝底庭廷弟悌抵挺提梯汀碇禎程締艇訂諦蹄逓"],["c5a1","邸鄭釘鼎泥摘擢敵滴的笛適鏑溺哲徹撤轍迭鉄典填天展店添纏甜貼転顛点伝殿澱田電兎吐堵塗妬屠徒斗杜渡登菟賭途都鍍砥砺努度土奴怒倒党冬凍刀唐塔塘套宕島嶋悼投搭東桃梼棟盗淘湯涛灯燈当痘祷等答筒糖統到"],["c6a1","董蕩藤討謄豆踏逃透鐙陶頭騰闘働動同堂導憧撞洞瞳童胴萄道銅峠鴇匿得徳涜特督禿篤毒独読栃橡凸突椴届鳶苫寅酉瀞噸屯惇敦沌豚遁頓呑曇鈍奈那内乍凪薙謎灘捺鍋楢馴縄畷南楠軟難汝二尼弐迩匂賑肉虹廿日乳入"],["c7a1","如尿韮任妊忍認濡禰祢寧葱猫熱年念捻撚燃粘乃廼之埜嚢悩濃納能脳膿農覗蚤巴把播覇杷波派琶破婆罵芭馬俳廃拝排敗杯盃牌背肺輩配倍培媒梅楳煤狽買売賠陪這蝿秤矧萩伯剥博拍柏泊白箔粕舶薄迫曝漠爆縛莫駁麦"],["c8a1","函箱硲箸肇筈櫨幡肌畑畠八鉢溌発醗髪伐罰抜筏閥鳩噺塙蛤隼伴判半反叛帆搬斑板氾汎版犯班畔繁般藩販範釆煩頒飯挽晩番盤磐蕃蛮匪卑否妃庇彼悲扉批披斐比泌疲皮碑秘緋罷肥被誹費避非飛樋簸備尾微枇毘琵眉美"],["c9a1","鼻柊稗匹疋髭彦膝菱肘弼必畢筆逼桧姫媛紐百謬俵彪標氷漂瓢票表評豹廟描病秒苗錨鋲蒜蛭鰭品彬斌浜瀕貧賓頻敏瓶不付埠夫婦富冨布府怖扶敷斧普浮父符腐膚芙譜負賦赴阜附侮撫武舞葡蕪部封楓風葺蕗伏副復幅服"],["caa1","福腹複覆淵弗払沸仏物鮒分吻噴墳憤扮焚奮粉糞紛雰文聞丙併兵塀幣平弊柄並蔽閉陛米頁僻壁癖碧別瞥蔑箆偏変片篇編辺返遍便勉娩弁鞭保舗鋪圃捕歩甫補輔穂募墓慕戊暮母簿菩倣俸包呆報奉宝峰峯崩庖抱捧放方朋"],["cba1","法泡烹砲縫胞芳萌蓬蜂褒訪豊邦鋒飽鳳鵬乏亡傍剖坊妨帽忘忙房暴望某棒冒紡肪膨謀貌貿鉾防吠頬北僕卜墨撲朴牧睦穆釦勃没殆堀幌奔本翻凡盆摩磨魔麻埋妹昧枚毎哩槙幕膜枕鮪柾鱒桝亦俣又抹末沫迄侭繭麿万慢満"],["cca1","漫蔓味未魅巳箕岬密蜜湊蓑稔脈妙粍民眠務夢無牟矛霧鵡椋婿娘冥名命明盟迷銘鳴姪牝滅免棉綿緬面麺摸模茂妄孟毛猛盲網耗蒙儲木黙目杢勿餅尤戻籾貰問悶紋門匁也冶夜爺耶野弥矢厄役約薬訳躍靖柳薮鑓愉愈油癒"],["cda1","諭輸唯佑優勇友宥幽悠憂揖有柚湧涌猶猷由祐裕誘遊邑郵雄融夕予余与誉輿預傭幼妖容庸揚揺擁曜楊様洋溶熔用窯羊耀葉蓉要謡踊遥陽養慾抑欲沃浴翌翼淀羅螺裸来莱頼雷洛絡落酪乱卵嵐欄濫藍蘭覧利吏履李梨理璃"],["cea1","痢裏裡里離陸律率立葎掠略劉流溜琉留硫粒隆竜龍侶慮旅虜了亮僚両凌寮料梁涼猟療瞭稜糧良諒遼量陵領力緑倫厘林淋燐琳臨輪隣鱗麟瑠塁涙累類令伶例冷励嶺怜玲礼苓鈴隷零霊麗齢暦歴列劣烈裂廉恋憐漣煉簾練聯"],["cfa1","蓮連錬呂魯櫓炉賂路露労婁廊弄朗楼榔浪漏牢狼篭老聾蝋郎六麓禄肋録論倭和話歪賄脇惑枠鷲亙亘鰐詫藁蕨椀湾碗腕"],["d0a1","弌丐丕个丱丶丼丿乂乖乘亂亅豫亊舒弍于亞亟亠亢亰亳亶从仍仄仆仂仗仞仭仟价伉佚估佛佝佗佇佶侈侏侘佻佩佰侑佯來侖儘俔俟俎俘俛俑俚俐俤俥倚倨倔倪倥倅伜俶倡倩倬俾俯們倆偃假會偕偐偈做偖偬偸傀傚傅傴傲"],["d1a1","僉僊傳僂僖僞僥僭僣僮價僵儉儁儂儖儕儔儚儡儺儷儼儻儿兀兒兌兔兢竸兩兪兮冀冂囘册冉冏冑冓冕冖冤冦冢冩冪冫决冱冲冰况冽凅凉凛几處凩凭凰凵凾刄刋刔刎刧刪刮刳刹剏剄剋剌剞剔剪剴剩剳剿剽劍劔劒剱劈劑辨"],["d2a1","辧劬劭劼劵勁勍勗勞勣勦飭勠勳勵勸勹匆匈甸匍匐匏匕匚匣匯匱匳匸區卆卅丗卉卍凖卞卩卮夘卻卷厂厖厠厦厥厮厰厶參簒雙叟曼燮叮叨叭叺吁吽呀听吭吼吮吶吩吝呎咏呵咎呟呱呷呰咒呻咀呶咄咐咆哇咢咸咥咬哄哈咨"],["d3a1","咫哂咤咾咼哘哥哦唏唔哽哮哭哺哢唹啀啣啌售啜啅啖啗唸唳啝喙喀咯喊喟啻啾喘喞單啼喃喩喇喨嗚嗅嗟嗄嗜嗤嗔嘔嗷嘖嗾嗽嘛嗹噎噐營嘴嘶嘲嘸噫噤嘯噬噪嚆嚀嚊嚠嚔嚏嚥嚮嚶嚴囂嚼囁囃囀囈囎囑囓囗囮囹圀囿圄圉"],["d4a1","圈國圍圓團圖嗇圜圦圷圸坎圻址坏坩埀垈坡坿垉垓垠垳垤垪垰埃埆埔埒埓堊埖埣堋堙堝塲堡塢塋塰毀塒堽塹墅墹墟墫墺壞墻墸墮壅壓壑壗壙壘壥壜壤壟壯壺壹壻壼壽夂夊夐夛梦夥夬夭夲夸夾竒奕奐奎奚奘奢奠奧奬奩"],["d5a1","奸妁妝佞侫妣妲姆姨姜妍姙姚娥娟娑娜娉娚婀婬婉娵娶婢婪媚媼媾嫋嫂媽嫣嫗嫦嫩嫖嫺嫻嬌嬋嬖嬲嫐嬪嬶嬾孃孅孀孑孕孚孛孥孩孰孳孵學斈孺宀它宦宸寃寇寉寔寐寤實寢寞寥寫寰寶寳尅將專對尓尠尢尨尸尹屁屆屎屓"],["d6a1","屐屏孱屬屮乢屶屹岌岑岔妛岫岻岶岼岷峅岾峇峙峩峽峺峭嶌峪崋崕崗嵜崟崛崑崔崢崚崙崘嵌嵒嵎嵋嵬嵳嵶嶇嶄嶂嶢嶝嶬嶮嶽嶐嶷嶼巉巍巓巒巖巛巫已巵帋帚帙帑帛帶帷幄幃幀幎幗幔幟幢幤幇幵并幺麼广庠廁廂廈廐廏"],["d7a1","廖廣廝廚廛廢廡廨廩廬廱廳廰廴廸廾弃弉彝彜弋弑弖弩弭弸彁彈彌彎弯彑彖彗彙彡彭彳彷徃徂彿徊很徑徇從徙徘徠徨徭徼忖忻忤忸忱忝悳忿怡恠怙怐怩怎怱怛怕怫怦怏怺恚恁恪恷恟恊恆恍恣恃恤恂恬恫恙悁悍惧悃悚"],["d8a1","悄悛悖悗悒悧悋惡悸惠惓悴忰悽惆悵惘慍愕愆惶惷愀惴惺愃愡惻惱愍愎慇愾愨愧慊愿愼愬愴愽慂慄慳慷慘慙慚慫慴慯慥慱慟慝慓慵憙憖憇憬憔憚憊憑憫憮懌懊應懷懈懃懆憺懋罹懍懦懣懶懺懴懿懽懼懾戀戈戉戍戌戔戛"],["d9a1","戞戡截戮戰戲戳扁扎扞扣扛扠扨扼抂抉找抒抓抖拔抃抔拗拑抻拏拿拆擔拈拜拌拊拂拇抛拉挌拮拱挧挂挈拯拵捐挾捍搜捏掖掎掀掫捶掣掏掉掟掵捫捩掾揩揀揆揣揉插揶揄搖搴搆搓搦搶攝搗搨搏摧摯摶摎攪撕撓撥撩撈撼"],["daa1","據擒擅擇撻擘擂擱擧舉擠擡抬擣擯攬擶擴擲擺攀擽攘攜攅攤攣攫攴攵攷收攸畋效敖敕敍敘敞敝敲數斂斃變斛斟斫斷旃旆旁旄旌旒旛旙无旡旱杲昊昃旻杳昵昶昴昜晏晄晉晁晞晝晤晧晨晟晢晰暃暈暎暉暄暘暝曁暹曉暾暼"],["dba1","曄暸曖曚曠昿曦曩曰曵曷朏朖朞朦朧霸朮朿朶杁朸朷杆杞杠杙杣杤枉杰枩杼杪枌枋枦枡枅枷柯枴柬枳柩枸柤柞柝柢柮枹柎柆柧檜栞框栩桀桍栲桎梳栫桙档桷桿梟梏梭梔條梛梃檮梹桴梵梠梺椏梍桾椁棊椈棘椢椦棡椌棍"],["dca1","棔棧棕椶椒椄棗棣椥棹棠棯椨椪椚椣椡棆楹楷楜楸楫楔楾楮椹楴椽楙椰楡楞楝榁楪榲榮槐榿槁槓榾槎寨槊槝榻槃榧樮榑榠榜榕榴槞槨樂樛槿權槹槲槧樅榱樞槭樔槫樊樒櫁樣樓橄樌橲樶橸橇橢橙橦橈樸樢檐檍檠檄檢檣"],["dda1","檗蘗檻櫃櫂檸檳檬櫞櫑櫟檪櫚櫪櫻欅蘖櫺欒欖鬱欟欸欷盜欹飮歇歃歉歐歙歔歛歟歡歸歹歿殀殄殃殍殘殕殞殤殪殫殯殲殱殳殷殼毆毋毓毟毬毫毳毯麾氈氓气氛氤氣汞汕汢汪沂沍沚沁沛汾汨汳沒沐泄泱泓沽泗泅泝沮沱沾"],["dea1","沺泛泯泙泪洟衍洶洫洽洸洙洵洳洒洌浣涓浤浚浹浙涎涕濤涅淹渕渊涵淇淦涸淆淬淞淌淨淒淅淺淙淤淕淪淮渭湮渮渙湲湟渾渣湫渫湶湍渟湃渺湎渤滿渝游溂溪溘滉溷滓溽溯滄溲滔滕溏溥滂溟潁漑灌滬滸滾漿滲漱滯漲滌"],["dfa1","漾漓滷澆潺潸澁澀潯潛濳潭澂潼潘澎澑濂潦澳澣澡澤澹濆澪濟濕濬濔濘濱濮濛瀉瀋濺瀑瀁瀏濾瀛瀚潴瀝瀘瀟瀰瀾瀲灑灣炙炒炯烱炬炸炳炮烟烋烝烙焉烽焜焙煥煕熈煦煢煌煖煬熏燻熄熕熨熬燗熹熾燒燉燔燎燠燬燧燵燼"],["e0a1","燹燿爍爐爛爨爭爬爰爲爻爼爿牀牆牋牘牴牾犂犁犇犒犖犢犧犹犲狃狆狄狎狒狢狠狡狹狷倏猗猊猜猖猝猴猯猩猥猾獎獏默獗獪獨獰獸獵獻獺珈玳珎玻珀珥珮珞璢琅瑯琥珸琲琺瑕琿瑟瑙瑁瑜瑩瑰瑣瑪瑶瑾璋璞璧瓊瓏瓔珱"],["e1a1","瓠瓣瓧瓩瓮瓲瓰瓱瓸瓷甄甃甅甌甎甍甕甓甞甦甬甼畄畍畊畉畛畆畚畩畤畧畫畭畸當疆疇畴疊疉疂疔疚疝疥疣痂疳痃疵疽疸疼疱痍痊痒痙痣痞痾痿痼瘁痰痺痲痳瘋瘍瘉瘟瘧瘠瘡瘢瘤瘴瘰瘻癇癈癆癜癘癡癢癨癩癪癧癬癰"],["e2a1","癲癶癸發皀皃皈皋皎皖皓皙皚皰皴皸皹皺盂盍盖盒盞盡盥盧盪蘯盻眈眇眄眩眤眞眥眦眛眷眸睇睚睨睫睛睥睿睾睹瞎瞋瞑瞠瞞瞰瞶瞹瞿瞼瞽瞻矇矍矗矚矜矣矮矼砌砒礦砠礪硅碎硴碆硼碚碌碣碵碪碯磑磆磋磔碾碼磅磊磬"],["e3a1","磧磚磽磴礇礒礑礙礬礫祀祠祗祟祚祕祓祺祿禊禝禧齋禪禮禳禹禺秉秕秧秬秡秣稈稍稘稙稠稟禀稱稻稾稷穃穗穉穡穢穩龝穰穹穽窈窗窕窘窖窩竈窰窶竅竄窿邃竇竊竍竏竕竓站竚竝竡竢竦竭竰笂笏笊笆笳笘笙笞笵笨笶筐"],["e4a1","筺笄筍笋筌筅筵筥筴筧筰筱筬筮箝箘箟箍箜箚箋箒箏筝箙篋篁篌篏箴篆篝篩簑簔篦篥籠簀簇簓篳篷簗簍篶簣簧簪簟簷簫簽籌籃籔籏籀籐籘籟籤籖籥籬籵粃粐粤粭粢粫粡粨粳粲粱粮粹粽糀糅糂糘糒糜糢鬻糯糲糴糶糺紆"],["e5a1","紂紜紕紊絅絋紮紲紿紵絆絳絖絎絲絨絮絏絣經綉絛綏絽綛綺綮綣綵緇綽綫總綢綯緜綸綟綰緘緝緤緞緻緲緡縅縊縣縡縒縱縟縉縋縢繆繦縻縵縹繃縷縲縺繧繝繖繞繙繚繹繪繩繼繻纃緕繽辮繿纈纉續纒纐纓纔纖纎纛纜缸缺"],["e6a1","罅罌罍罎罐网罕罔罘罟罠罨罩罧罸羂羆羃羈羇羌羔羞羝羚羣羯羲羹羮羶羸譱翅翆翊翕翔翡翦翩翳翹飜耆耄耋耒耘耙耜耡耨耿耻聊聆聒聘聚聟聢聨聳聲聰聶聹聽聿肄肆肅肛肓肚肭冐肬胛胥胙胝胄胚胖脉胯胱脛脩脣脯腋"],["e7a1","隋腆脾腓腑胼腱腮腥腦腴膃膈膊膀膂膠膕膤膣腟膓膩膰膵膾膸膽臀臂膺臉臍臑臙臘臈臚臟臠臧臺臻臾舁舂舅與舊舍舐舖舩舫舸舳艀艙艘艝艚艟艤艢艨艪艫舮艱艷艸艾芍芒芫芟芻芬苡苣苟苒苴苳苺莓范苻苹苞茆苜茉苙"],["e8a1","茵茴茖茲茱荀茹荐荅茯茫茗茘莅莚莪莟莢莖茣莎莇莊荼莵荳荵莠莉莨菴萓菫菎菽萃菘萋菁菷萇菠菲萍萢萠莽萸蔆菻葭萪萼蕚蒄葷葫蒭葮蒂葩葆萬葯葹萵蓊葢蒹蒿蒟蓙蓍蒻蓚蓐蓁蓆蓖蒡蔡蓿蓴蔗蔘蔬蔟蔕蔔蓼蕀蕣蕘蕈"],["e9a1","蕁蘂蕋蕕薀薤薈薑薊薨蕭薔薛藪薇薜蕷蕾薐藉薺藏薹藐藕藝藥藜藹蘊蘓蘋藾藺蘆蘢蘚蘰蘿虍乕虔號虧虱蚓蚣蚩蚪蚋蚌蚶蚯蛄蛆蚰蛉蠣蚫蛔蛞蛩蛬蛟蛛蛯蜒蜆蜈蜀蜃蛻蜑蜉蜍蛹蜊蜴蜿蜷蜻蜥蜩蜚蝠蝟蝸蝌蝎蝴蝗蝨蝮蝙"],["eaa1","蝓蝣蝪蠅螢螟螂螯蟋螽蟀蟐雖螫蟄螳蟇蟆螻蟯蟲蟠蠏蠍蟾蟶蟷蠎蟒蠑蠖蠕蠢蠡蠱蠶蠹蠧蠻衄衂衒衙衞衢衫袁衾袞衵衽袵衲袂袗袒袮袙袢袍袤袰袿袱裃裄裔裘裙裝裹褂裼裴裨裲褄褌褊褓襃褞褥褪褫襁襄褻褶褸襌褝襠襞"],["eba1","襦襤襭襪襯襴襷襾覃覈覊覓覘覡覩覦覬覯覲覺覽覿觀觚觜觝觧觴觸訃訖訐訌訛訝訥訶詁詛詒詆詈詼詭詬詢誅誂誄誨誡誑誥誦誚誣諄諍諂諚諫諳諧諤諱謔諠諢諷諞諛謌謇謚諡謖謐謗謠謳鞫謦謫謾謨譁譌譏譎證譖譛譚譫"],["eca1","譟譬譯譴譽讀讌讎讒讓讖讙讚谺豁谿豈豌豎豐豕豢豬豸豺貂貉貅貊貍貎貔豼貘戝貭貪貽貲貳貮貶賈賁賤賣賚賽賺賻贄贅贊贇贏贍贐齎贓賍贔贖赧赭赱赳趁趙跂趾趺跏跚跖跌跛跋跪跫跟跣跼踈踉跿踝踞踐踟蹂踵踰踴蹊"],["eda1","蹇蹉蹌蹐蹈蹙蹤蹠踪蹣蹕蹶蹲蹼躁躇躅躄躋躊躓躑躔躙躪躡躬躰軆躱躾軅軈軋軛軣軼軻軫軾輊輅輕輒輙輓輜輟輛輌輦輳輻輹轅轂輾轌轉轆轎轗轜轢轣轤辜辟辣辭辯辷迚迥迢迪迯邇迴逅迹迺逑逕逡逍逞逖逋逧逶逵逹迸"],["eea1","遏遐遑遒逎遉逾遖遘遞遨遯遶隨遲邂遽邁邀邊邉邏邨邯邱邵郢郤扈郛鄂鄒鄙鄲鄰酊酖酘酣酥酩酳酲醋醉醂醢醫醯醪醵醴醺釀釁釉釋釐釖釟釡釛釼釵釶鈞釿鈔鈬鈕鈑鉞鉗鉅鉉鉤鉈銕鈿鉋鉐銜銖銓銛鉚鋏銹銷鋩錏鋺鍄錮"],["efa1","錙錢錚錣錺錵錻鍜鍠鍼鍮鍖鎰鎬鎭鎔鎹鏖鏗鏨鏥鏘鏃鏝鏐鏈鏤鐚鐔鐓鐃鐇鐐鐶鐫鐵鐡鐺鑁鑒鑄鑛鑠鑢鑞鑪鈩鑰鑵鑷鑽鑚鑼鑾钁鑿閂閇閊閔閖閘閙閠閨閧閭閼閻閹閾闊濶闃闍闌闕闔闖關闡闥闢阡阨阮阯陂陌陏陋陷陜陞"],["f0a1","陝陟陦陲陬隍隘隕隗險隧隱隲隰隴隶隸隹雎雋雉雍襍雜霍雕雹霄霆霈霓霎霑霏霖霙霤霪霰霹霽霾靄靆靈靂靉靜靠靤靦靨勒靫靱靹鞅靼鞁靺鞆鞋鞏鞐鞜鞨鞦鞣鞳鞴韃韆韈韋韜韭齏韲竟韶韵頏頌頸頤頡頷頽顆顏顋顫顯顰"],["f1a1","顱顴顳颪颯颱颶飄飃飆飩飫餃餉餒餔餘餡餝餞餤餠餬餮餽餾饂饉饅饐饋饑饒饌饕馗馘馥馭馮馼駟駛駝駘駑駭駮駱駲駻駸騁騏騅駢騙騫騷驅驂驀驃騾驕驍驛驗驟驢驥驤驩驫驪骭骰骼髀髏髑髓體髞髟髢髣髦髯髫髮髴髱髷"],["f2a1","髻鬆鬘鬚鬟鬢鬣鬥鬧鬨鬩鬪鬮鬯鬲魄魃魏魍魎魑魘魴鮓鮃鮑鮖鮗鮟鮠鮨鮴鯀鯊鮹鯆鯏鯑鯒鯣鯢鯤鯔鯡鰺鯲鯱鯰鰕鰔鰉鰓鰌鰆鰈鰒鰊鰄鰮鰛鰥鰤鰡鰰鱇鰲鱆鰾鱚鱠鱧鱶鱸鳧鳬鳰鴉鴈鳫鴃鴆鴪鴦鶯鴣鴟鵄鴕鴒鵁鴿鴾鵆鵈"],["f3a1","鵝鵞鵤鵑鵐鵙鵲鶉鶇鶫鵯鵺鶚鶤鶩鶲鷄鷁鶻鶸鶺鷆鷏鷂鷙鷓鷸鷦鷭鷯鷽鸚鸛鸞鹵鹹鹽麁麈麋麌麒麕麑麝麥麩麸麪麭靡黌黎黏黐黔黜點黝黠黥黨黯黴黶黷黹黻黼黽鼇鼈皷鼕鼡鼬鼾齊齒齔齣齟齠齡齦齧齬齪齷齲齶龕龜龠"],["f4a1","堯槇遙瑤凜熙"],["f9a1","纊褜鍈銈蓜俉炻昱棈鋹曻彅丨仡仼伀伃伹佖侒侊侚侔俍偀倢俿倞偆偰偂傔僴僘兊兤冝冾凬刕劜劦勀勛匀匇匤卲厓厲叝﨎咜咊咩哿喆坙坥垬埈埇﨏塚增墲夋奓奛奝奣妤妺孖寀甯寘寬尞岦岺峵崧嵓﨑嵂嵭嶸嶹巐弡弴彧德"],["faa1","忞恝悅悊惞惕愠惲愑愷愰憘戓抦揵摠撝擎敎昀昕昻昉昮昞昤晥晗晙晴晳暙暠暲暿曺朎朗杦枻桒柀栁桄棏﨓楨﨔榘槢樰橫橆橳橾櫢櫤毖氿汜沆汯泚洄涇浯涖涬淏淸淲淼渹湜渧渼溿澈澵濵瀅瀇瀨炅炫焏焄煜煆煇凞燁燾犱"],["fba1","犾猤猪獷玽珉珖珣珒琇珵琦琪琩琮瑢璉璟甁畯皂皜皞皛皦益睆劯砡硎硤硺礰礼神祥禔福禛竑竧靖竫箞精絈絜綷綠緖繒罇羡羽茁荢荿菇菶葈蒴蕓蕙蕫﨟薰蘒﨡蠇裵訒訷詹誧誾諟諸諶譓譿賰賴贒赶﨣軏﨤逸遧郞都鄕鄧釚"],["fca1","釗釞釭釮釤釥鈆鈐鈊鈺鉀鈼鉎鉙鉑鈹鉧銧鉷鉸鋧鋗鋙鋐﨧鋕鋠鋓錥錡鋻﨨錞鋿錝錂鍰鍗鎤鏆鏞鏸鐱鑅鑈閒隆﨩隝隯霳霻靃靍靏靑靕顗顥飯飼餧館馞驎髙髜魵魲鮏鮱鮻鰀鵰鵫鶴鸙黑"],["fcf1","ⅰ",9,"￢￤＇＂"],["8fa2af","˘ˇ¸˙˝¯˛˚～΄΅"],["8fa2c2","¡¦¿"],["8fa2eb","ºª©®™¤№"],["8fa6e1","ΆΈΉΊΪ"],["8fa6e7","Ό"],["8fa6e9","ΎΫ"],["8fa6ec","Ώ"],["8fa6f1","άέήίϊΐόςύϋΰώ"],["8fa7c2","Ђ",10,"ЎЏ"],["8fa7f2","ђ",10,"ўџ"],["8fa9a1","ÆĐ"],["8fa9a4","Ħ"],["8fa9a6","Ĳ"],["8fa9a8","ŁĿ"],["8fa9ab","ŊØŒ"],["8fa9af","ŦÞ"],["8fa9c1","æđðħıĳĸłŀŉŋøœßŧþ"],["8faaa1","ÁÀÄÂĂǍĀĄÅÃĆĈČÇĊĎÉÈËÊĚĖĒĘ"],["8faaba","ĜĞĢĠĤÍÌÏÎǏİĪĮĨĴĶĹĽĻŃŇŅÑÓÒÖÔǑŐŌÕŔŘŖŚŜŠŞŤŢÚÙÜÛŬǓŰŪŲŮŨǗǛǙǕŴÝŸŶŹŽŻ"],["8faba1","áàäâăǎāąåãćĉčçċďéèëêěėēęǵĝğ"],["8fabbd","ġĥíìïîǐ"],["8fabc5","īįĩĵķĺľļńňņñóòöôǒőōõŕřŗśŝšşťţúùüûŭǔűūųůũǘǜǚǖŵýÿŷźžż"],["8fb0a1","丂丄丅丌丒丟丣两丨丫丮丯丰丵乀乁乄乇乑乚乜乣乨乩乴乵乹乿亍亖亗亝亯亹仃仐仚仛仠仡仢仨仯仱仳仵份仾仿伀伂伃伈伋伌伒伕伖众伙伮伱你伳伵伷伹伻伾佀佂佈佉佋佌佒佔佖佘佟佣佪佬佮佱佷佸佹佺佽佾侁侂侄"],["8fb1a1","侅侉侊侌侎侐侒侓侔侗侙侚侞侟侲侷侹侻侼侽侾俀俁俅俆俈俉俋俌俍俏俒俜俠俢俰俲俼俽俿倀倁倄倇倊倌倎倐倓倗倘倛倜倝倞倢倧倮倰倲倳倵偀偁偂偅偆偊偌偎偑偒偓偗偙偟偠偢偣偦偧偪偭偰偱倻傁傃傄傆傊傎傏傐"],["8fb2a1","傒傓傔傖傛傜傞",4,"傪傯傰傹傺傽僀僃僄僇僌僎僐僓僔僘僜僝僟僢僤僦僨僩僯僱僶僺僾儃儆儇儈儋儌儍儎僲儐儗儙儛儜儝儞儣儧儨儬儭儯儱儳儴儵儸儹兂兊兏兓兕兗兘兟兤兦兾冃冄冋冎冘冝冡冣冭冸冺冼冾冿凂"],["8fb3a1","凈减凑凒凓凕凘凞凢凥凮凲凳凴凷刁刂刅划刓刕刖刘刢刨刱刲刵刼剅剉剕剗剘剚剜剟剠剡剦剮剷剸剹劀劂劅劊劌劓劕劖劗劘劚劜劤劥劦劧劯劰劶劷劸劺劻劽勀勄勆勈勌勏勑勔勖勛勜勡勥勨勩勪勬勰勱勴勶勷匀匃匊匋"],["8fb4a1","匌匑匓匘匛匜匞匟匥匧匨匩匫匬匭匰匲匵匼匽匾卂卌卋卙卛卡卣卥卬卭卲卹卾厃厇厈厎厓厔厙厝厡厤厪厫厯厲厴厵厷厸厺厽叀叅叏叒叓叕叚叝叞叠另叧叵吂吓吚吡吧吨吪启吱吴吵呃呄呇呍呏呞呢呤呦呧呩呫呭呮呴呿"],["8fb5a1","咁咃咅咈咉咍咑咕咖咜咟咡咦咧咩咪咭咮咱咷咹咺咻咿哆哊响哎哠哪哬哯哶哼哾哿唀唁唅唈唉唌唍唎唕唪唫唲唵唶唻唼唽啁啇啉啊啍啐啑啘啚啛啞啠啡啤啦啿喁喂喆喈喎喏喑喒喓喔喗喣喤喭喲喿嗁嗃嗆嗉嗋嗌嗎嗑嗒"],["8fb6a1","嗓嗗嗘嗛嗞嗢嗩嗶嗿嘅嘈嘊嘍",5,"嘙嘬嘰嘳嘵嘷嘹嘻嘼嘽嘿噀噁噃噄噆噉噋噍噏噔噞噠噡噢噣噦噩噭噯噱噲噵嚄嚅嚈嚋嚌嚕嚙嚚嚝嚞嚟嚦嚧嚨嚩嚫嚬嚭嚱嚳嚷嚾囅囉囊囋囏囐囌囍囙囜囝囟囡囤",4,"囱囫园"],["8fb7a1","囶囷圁圂圇圊圌圑圕圚圛圝圠圢圣圤圥圩圪圬圮圯圳圴圽圾圿坅坆坌坍坒坢坥坧坨坫坭",4,"坳坴坵坷坹坺坻坼坾垁垃垌垔垗垙垚垜垝垞垟垡垕垧垨垩垬垸垽埇埈埌埏埕埝埞埤埦埧埩埭埰埵埶埸埽埾埿堃堄堈堉埡"],["8fb8a1","堌堍堛堞堟堠堦堧堭堲堹堿塉塌塍塏塐塕塟塡塤塧塨塸塼塿墀墁墇墈墉墊墌墍墏墐墔墖墝墠墡墢墦墩墱墲壄墼壂壈壍壎壐壒壔壖壚壝壡壢壩壳夅夆夋夌夒夓夔虁夝夡夣夤夨夯夰夳夵夶夿奃奆奒奓奙奛奝奞奟奡奣奫奭"],["8fb9a1","奯奲奵奶她奻奼妋妌妎妒妕妗妟妤妧妭妮妯妰妳妷妺妼姁姃姄姈姊姍姒姝姞姟姣姤姧姮姯姱姲姴姷娀娄娌娍娎娒娓娞娣娤娧娨娪娭娰婄婅婇婈婌婐婕婞婣婥婧婭婷婺婻婾媋媐媓媖媙媜媞媟媠媢媧媬媱媲媳媵媸媺媻媿"],["8fbaa1","嫄嫆嫈嫏嫚嫜嫠嫥嫪嫮嫵嫶嫽嬀嬁嬈嬗嬴嬙嬛嬝嬡嬥嬭嬸孁孋孌孒孖孞孨孮孯孼孽孾孿宁宄宆宊宎宐宑宓宔宖宨宩宬宭宯宱宲宷宺宼寀寁寍寏寖",4,"寠寯寱寴寽尌尗尞尟尣尦尩尫尬尮尰尲尵尶屙屚屜屢屣屧屨屩"],["8fbba1","屭屰屴屵屺屻屼屽岇岈岊岏岒岝岟岠岢岣岦岪岲岴岵岺峉峋峒峝峗峮峱峲峴崁崆崍崒崫崣崤崦崧崱崴崹崽崿嵂嵃嵆嵈嵕嵑嵙嵊嵟嵠嵡嵢嵤嵪嵭嵰嵹嵺嵾嵿嶁嶃嶈嶊嶒嶓嶔嶕嶙嶛嶟嶠嶧嶫嶰嶴嶸嶹巃巇巋巐巎巘巙巠巤"],["8fbca1","巩巸巹帀帇帍帒帔帕帘帟帠帮帨帲帵帾幋幐幉幑幖幘幛幜幞幨幪",4,"幰庀庋庎庢庤庥庨庪庬庱庳庽庾庿廆廌廋廎廑廒廔廕廜廞廥廫异弆弇弈弎弙弜弝弡弢弣弤弨弫弬弮弰弴弶弻弽弿彀彄彅彇彍彐彔彘彛彠彣彤彧"],["8fbda1","彯彲彴彵彸彺彽彾徉徍徏徖徜徝徢徧徫徤徬徯徰徱徸忄忇忈忉忋忐",4,"忞忡忢忨忩忪忬忭忮忯忲忳忶忺忼怇怊怍怓怔怗怘怚怟怤怭怳怵恀恇恈恉恌恑恔恖恗恝恡恧恱恾恿悂悆悈悊悎悑悓悕悘悝悞悢悤悥您悰悱悷"],["8fbea1","悻悾惂惄惈惉惊惋惎惏惔惕惙惛惝惞惢惥惲惵惸惼惽愂愇愊愌愐",4,"愖愗愙愜愞愢愪愫愰愱愵愶愷愹慁慅慆慉慞慠慬慲慸慻慼慿憀憁憃憄憋憍憒憓憗憘憜憝憟憠憥憨憪憭憸憹憼懀懁懂懎懏懕懜懝懞懟懡懢懧懩懥"],["8fbfa1","懬懭懯戁戃戄戇戓戕戜戠戢戣戧戩戫戹戽扂扃扄扆扌扐扑扒扔扖扚扜扤扭扯扳扺扽抍抎抏抐抦抨抳抶抷抺抾抿拄拎拕拖拚拪拲拴拼拽挃挄挊挋挍挐挓挖挘挩挪挭挵挶挹挼捁捂捃捄捆捊捋捎捒捓捔捘捛捥捦捬捭捱捴捵"],["8fc0a1","捸捼捽捿掂掄掇掊掐掔掕掙掚掞掤掦掭掮掯掽揁揅揈揎揑揓揔揕揜揠揥揪揬揲揳揵揸揹搉搊搐搒搔搘搞搠搢搤搥搩搪搯搰搵搽搿摋摏摑摒摓摔摚摛摜摝摟摠摡摣摭摳摴摻摽撅撇撏撐撑撘撙撛撝撟撡撣撦撨撬撳撽撾撿"],["8fc1a1","擄擉擊擋擌擎擐擑擕擗擤擥擩擪擭擰擵擷擻擿攁攄攈攉攊攏攓攔攖攙攛攞攟攢攦攩攮攱攺攼攽敃敇敉敐敒敔敟敠敧敫敺敽斁斅斊斒斕斘斝斠斣斦斮斲斳斴斿旂旈旉旎旐旔旖旘旟旰旲旴旵旹旾旿昀昄昈昉昍昑昒昕昖昝"],["8fc2a1","昞昡昢昣昤昦昩昪昫昬昮昰昱昳昹昷晀晅晆晊晌晑晎晗晘晙晛晜晠晡曻晪晫晬晾晳晵晿晷晸晹晻暀晼暋暌暍暐暒暙暚暛暜暟暠暤暭暱暲暵暻暿曀曂曃曈曌曎曏曔曛曟曨曫曬曮曺朅朇朎朓朙朜朠朢朳朾杅杇杈杌杔杕杝"],["8fc3a1","杦杬杮杴杶杻极构枎枏枑枓枖枘枙枛枰枱枲枵枻枼枽柹柀柂柃柅柈柉柒柗柙柜柡柦柰柲柶柷桒栔栙栝栟栨栧栬栭栯栰栱栳栻栿桄桅桊桌桕桗桘桛桫桮",4,"桵桹桺桻桼梂梄梆梈梖梘梚梜梡梣梥梩梪梮梲梻棅棈棌棏"],["8fc4a1","棐棑棓棖棙棜棝棥棨棪棫棬棭棰棱棵棶棻棼棽椆椉椊椐椑椓椖椗椱椳椵椸椻楂楅楉楎楗楛楣楤楥楦楨楩楬楰楱楲楺楻楿榀榍榒榖榘榡榥榦榨榫榭榯榷榸榺榼槅槈槑槖槗槢槥槮槯槱槳槵槾樀樁樃樏樑樕樚樝樠樤樨樰樲"],["8fc5a1","樴樷樻樾樿橅橆橉橊橎橐橑橒橕橖橛橤橧橪橱橳橾檁檃檆檇檉檋檑檛檝檞檟檥檫檯檰檱檴檽檾檿櫆櫉櫈櫌櫐櫔櫕櫖櫜櫝櫤櫧櫬櫰櫱櫲櫼櫽欂欃欆欇欉欏欐欑欗欛欞欤欨欫欬欯欵欶欻欿歆歊歍歒歖歘歝歠歧歫歮歰歵歽"],["8fc6a1","歾殂殅殗殛殟殠殢殣殨殩殬殭殮殰殸殹殽殾毃毄毉毌毖毚毡毣毦毧毮毱毷毹毿氂氄氅氉氍氎氐氒氙氟氦氧氨氬氮氳氵氶氺氻氿汊汋汍汏汒汔汙汛汜汫汭汯汴汶汸汹汻沅沆沇沉沔沕沗沘沜沟沰沲沴泂泆泍泏泐泑泒泔泖"],["8fc7a1","泚泜泠泧泩泫泬泮泲泴洄洇洊洎洏洑洓洚洦洧洨汧洮洯洱洹洼洿浗浞浟浡浥浧浯浰浼涂涇涑涒涔涖涗涘涪涬涴涷涹涽涿淄淈淊淎淏淖淛淝淟淠淢淥淩淯淰淴淶淼渀渄渞渢渧渲渶渹渻渼湄湅湈湉湋湏湑湒湓湔湗湜湝湞"],["8fc8a1","湢湣湨湳湻湽溍溓溙溠溧溭溮溱溳溻溿滀滁滃滇滈滊滍滎滏滫滭滮滹滻滽漄漈漊漌漍漖漘漚漛漦漩漪漯漰漳漶漻漼漭潏潑潒潓潗潙潚潝潞潡潢潨潬潽潾澃澇澈澋澌澍澐澒澓澔澖澚澟澠澥澦澧澨澮澯澰澵澶澼濅濇濈濊"],["8fc9a1","濚濞濨濩濰濵濹濼濽瀀瀅瀆瀇瀍瀗瀠瀣瀯瀴瀷瀹瀼灃灄灈灉灊灋灔灕灝灞灎灤灥灬灮灵灶灾炁炅炆炔",4,"炛炤炫炰炱炴炷烊烑烓烔烕烖烘烜烤烺焃",4,"焋焌焏焞焠焫焭焯焰焱焸煁煅煆煇煊煋煐煒煗煚煜煞煠"],["8fcaa1","煨煹熀熅熇熌熒熚熛熠熢熯熰熲熳熺熿燀燁燄燋燌燓燖燙燚燜燸燾爀爇爈爉爓爗爚爝爟爤爫爯爴爸爹牁牂牃牅牎牏牐牓牕牖牚牜牞牠牣牨牫牮牯牱牷牸牻牼牿犄犉犍犎犓犛犨犭犮犱犴犾狁狇狉狌狕狖狘狟狥狳狴狺狻"],["8fcba1","狾猂猄猅猇猋猍猒猓猘猙猞猢猤猧猨猬猱猲猵猺猻猽獃獍獐獒獖獘獝獞獟獠獦獧獩獫獬獮獯獱獷獹獼玀玁玃玅玆玎玐玓玕玗玘玜玞玟玠玢玥玦玪玫玭玵玷玹玼玽玿珅珆珉珋珌珏珒珓珖珙珝珡珣珦珧珩珴珵珷珹珺珻珽"],["8fcca1","珿琀琁琄琇琊琑琚琛琤琦琨",9,"琹瑀瑃瑄瑆瑇瑋瑍瑑瑒瑗瑝瑢瑦瑧瑨瑫瑭瑮瑱瑲璀璁璅璆璇璉璏璐璑璒璘璙璚璜璟璠璡璣璦璨璩璪璫璮璯璱璲璵璹璻璿瓈瓉瓌瓐瓓瓘瓚瓛瓞瓟瓤瓨瓪瓫瓯瓴瓺瓻瓼瓿甆"],["8fcda1","甒甖甗甠甡甤甧甩甪甯甶甹甽甾甿畀畃畇畈畎畐畒畗畞畟畡畯畱畹",5,"疁疅疐疒疓疕疙疜疢疤疴疺疿痀痁痄痆痌痎痏痗痜痟痠痡痤痧痬痮痯痱痹瘀瘂瘃瘄瘇瘈瘊瘌瘏瘒瘓瘕瘖瘙瘛瘜瘝瘞瘣瘥瘦瘩瘭瘲瘳瘵瘸瘹"],["8fcea1","瘺瘼癊癀癁癃癄癅癉癋癕癙癟癤癥癭癮癯癱癴皁皅皌皍皕皛皜皝皟皠皢",6,"皪皭皽盁盅盉盋盌盎盔盙盠盦盨盬盰盱盶盹盼眀眆眊眎眒眔眕眗眙眚眜眢眨眭眮眯眴眵眶眹眽眾睂睅睆睊睍睎睏睒睖睗睜睞睟睠睢"],["8fcfa1","睤睧睪睬睰睲睳睴睺睽瞀瞄瞌瞍瞔瞕瞖瞚瞟瞢瞧瞪瞮瞯瞱瞵瞾矃矉矑矒矕矙矞矟矠矤矦矪矬矰矱矴矸矻砅砆砉砍砎砑砝砡砢砣砭砮砰砵砷硃硄硇硈硌硎硒硜硞硠硡硣硤硨硪确硺硾碊碏碔碘碡碝碞碟碤碨碬碭碰碱碲碳"],["8fd0a1","碻碽碿磇磈磉磌磎磒磓磕磖磤磛磟磠磡磦磪磲磳礀磶磷磺磻磿礆礌礐礚礜礞礟礠礥礧礩礭礱礴礵礻礽礿祄祅祆祊祋祏祑祔祘祛祜祧祩祫祲祹祻祼祾禋禌禑禓禔禕禖禘禛禜禡禨禩禫禯禱禴禸离秂秄秇秈秊秏秔秖秚秝秞"],["8fd1a1","秠秢秥秪秫秭秱秸秼稂稃稇稉稊稌稑稕稛稞稡稧稫稭稯稰稴稵稸稹稺穄穅穇穈穌穕穖穙穜穝穟穠穥穧穪穭穵穸穾窀窂窅窆窊窋窐窑窔窞窠窣窬窳窵窹窻窼竆竉竌竎竑竛竨竩竫竬竱竴竻竽竾笇笔笟笣笧笩笪笫笭笮笯笰"],["8fd2a1","笱笴笽笿筀筁筇筎筕筠筤筦筩筪筭筯筲筳筷箄箉箎箐箑箖箛箞箠箥箬箯箰箲箵箶箺箻箼箽篂篅篈篊篔篖篗篙篚篛篨篪篲篴篵篸篹篺篼篾簁簂簃簄簆簉簋簌簎簏簙簛簠簥簦簨簬簱簳簴簶簹簺籆籊籕籑籒籓籙",5],["8fd3a1","籡籣籧籩籭籮籰籲籹籼籽粆粇粏粔粞粠粦粰粶粷粺粻粼粿糄糇糈糉糍糏糓糔糕糗糙糚糝糦糩糫糵紃紇紈紉紏紑紒紓紖紝紞紣紦紪紭紱紼紽紾絀絁絇絈絍絑絓絗絙絚絜絝絥絧絪絰絸絺絻絿綁綂綃綅綆綈綋綌綍綑綖綗綝"],["8fd4a1","綞綦綧綪綳綶綷綹緂",4,"緌緍緎緗緙縀緢緥緦緪緫緭緱緵緶緹緺縈縐縑縕縗縜縝縠縧縨縬縭縯縳縶縿繄繅繇繎繐繒繘繟繡繢繥繫繮繯繳繸繾纁纆纇纊纍纑纕纘纚纝纞缼缻缽缾缿罃罄罇罏罒罓罛罜罝罡罣罤罥罦罭"],["8fd5a1","罱罽罾罿羀羋羍羏羐羑羖羗羜羡羢羦羪羭羴羼羿翀翃翈翎翏翛翟翣翥翨翬翮翯翲翺翽翾翿耇耈耊耍耎耏耑耓耔耖耝耞耟耠耤耦耬耮耰耴耵耷耹耺耼耾聀聄聠聤聦聭聱聵肁肈肎肜肞肦肧肫肸肹胈胍胏胒胔胕胗胘胠胭胮"],["8fd6a1","胰胲胳胶胹胺胾脃脋脖脗脘脜脞脠脤脧脬脰脵脺脼腅腇腊腌腒腗腠腡腧腨腩腭腯腷膁膐膄膅膆膋膎膖膘膛膞膢膮膲膴膻臋臃臅臊臎臏臕臗臛臝臞臡臤臫臬臰臱臲臵臶臸臹臽臿舀舃舏舓舔舙舚舝舡舢舨舲舴舺艃艄艅艆"],["8fd7a1","艋艎艏艑艖艜艠艣艧艭艴艻艽艿芀芁芃芄芇芉芊芎芑芔芖芘芚芛芠芡芣芤芧芨芩芪芮芰芲芴芷芺芼芾芿苆苐苕苚苠苢苤苨苪苭苯苶苷苽苾茀茁茇茈茊茋荔茛茝茞茟茡茢茬茭茮茰茳茷茺茼茽荂荃荄荇荍荎荑荕荖荗荰荸"],["8fd8a1","荽荿莀莂莄莆莍莒莔莕莘莙莛莜莝莦莧莩莬莾莿菀菇菉菏菐菑菔菝荓菨菪菶菸菹菼萁萆萊萏萑萕萙莭萯萹葅葇葈葊葍葏葑葒葖葘葙葚葜葠葤葥葧葪葰葳葴葶葸葼葽蒁蒅蒒蒓蒕蒞蒦蒨蒩蒪蒯蒱蒴蒺蒽蒾蓀蓂蓇蓈蓌蓏蓓"],["8fd9a1","蓜蓧蓪蓯蓰蓱蓲蓷蔲蓺蓻蓽蔂蔃蔇蔌蔎蔐蔜蔞蔢蔣蔤蔥蔧蔪蔫蔯蔳蔴蔶蔿蕆蕏",4,"蕖蕙蕜",6,"蕤蕫蕯蕹蕺蕻蕽蕿薁薅薆薉薋薌薏薓薘薝薟薠薢薥薧薴薶薷薸薼薽薾薿藂藇藊藋藎薭藘藚藟藠藦藨藭藳藶藼"],["8fdaa1","藿蘀蘄蘅蘍蘎蘐蘑蘒蘘蘙蘛蘞蘡蘧蘩蘶蘸蘺蘼蘽虀虂虆虒虓虖虗虘虙虝虠",4,"虩虬虯虵虶虷虺蚍蚑蚖蚘蚚蚜蚡蚦蚧蚨蚭蚱蚳蚴蚵蚷蚸蚹蚿蛀蛁蛃蛅蛑蛒蛕蛗蛚蛜蛠蛣蛥蛧蚈蛺蛼蛽蜄蜅蜇蜋蜎蜏蜐蜓蜔蜙蜞蜟蜡蜣"],["8fdba1","蜨蜮蜯蜱蜲蜹蜺蜼蜽蜾蝀蝃蝅蝍蝘蝝蝡蝤蝥蝯蝱蝲蝻螃",6,"螋螌螐螓螕螗螘螙螞螠螣螧螬螭螮螱螵螾螿蟁蟈蟉蟊蟎蟕蟖蟙蟚蟜蟟蟢蟣蟤蟪蟫蟭蟱蟳蟸蟺蟿蠁蠃蠆蠉蠊蠋蠐蠙蠒蠓蠔蠘蠚蠛蠜蠞蠟蠨蠭蠮蠰蠲蠵"],["8fdca1","蠺蠼衁衃衅衈衉衊衋衎衑衕衖衘衚衜衟衠衤衩衱衹衻袀袘袚袛袜袟袠袨袪袺袽袾裀裊",4,"裑裒裓裛裞裧裯裰裱裵裷褁褆褍褎褏褕褖褘褙褚褜褠褦褧褨褰褱褲褵褹褺褾襀襂襅襆襉襏襒襗襚襛襜襡襢襣襫襮襰襳襵襺"],["8fdda1","襻襼襽覉覍覐覔覕覛覜覟覠覥覰覴覵覶覷覼觔",4,"觥觩觫觭觱觳觶觹觽觿訄訅訇訏訑訒訔訕訞訠訢訤訦訫訬訯訵訷訽訾詀詃詅詇詉詍詎詓詖詗詘詜詝詡詥詧詵詶詷詹詺詻詾詿誀誃誆誋誏誐誒誖誗誙誟誧誩誮誯誳"],["8fdea1","誶誷誻誾諃諆諈諉諊諑諓諔諕諗諝諟諬諰諴諵諶諼諿謅謆謋謑謜謞謟謊謭謰謷謼譂",4,"譈譒譓譔譙譍譞譣譭譶譸譹譼譾讁讄讅讋讍讏讔讕讜讞讟谸谹谽谾豅豇豉豋豏豑豓豔豗豘豛豝豙豣豤豦豨豩豭豳豵豶豻豾貆"],["8fdfa1","貇貋貐貒貓貙貛貜貤貹貺賅賆賉賋賏賖賕賙賝賡賨賬賯賰賲賵賷賸賾賿贁贃贉贒贗贛赥赩赬赮赿趂趄趈趍趐趑趕趞趟趠趦趫趬趯趲趵趷趹趻跀跅跆跇跈跊跎跑跔跕跗跙跤跥跧跬跰趼跱跲跴跽踁踄踅踆踋踑踔踖踠踡踢"],["8fe0a1","踣踦踧踱踳踶踷踸踹踽蹀蹁蹋蹍蹎蹏蹔蹛蹜蹝蹞蹡蹢蹩蹬蹭蹯蹰蹱蹹蹺蹻躂躃躉躐躒躕躚躛躝躞躢躧躩躭躮躳躵躺躻軀軁軃軄軇軏軑軔軜軨軮軰軱軷軹軺軭輀輂輇輈輏輐輖輗輘輞輠輡輣輥輧輨輬輭輮輴輵輶輷輺轀轁"],["8fe1a1","轃轇轏轑",4,"轘轝轞轥辝辠辡辤辥辦辵辶辸达迀迁迆迊迋迍运迒迓迕迠迣迤迨迮迱迵迶迻迾适逄逈逌逘逛逨逩逯逪逬逭逳逴逷逿遃遄遌遛遝遢遦遧遬遰遴遹邅邈邋邌邎邐邕邗邘邙邛邠邡邢邥邰邲邳邴邶邽郌邾郃"],["8fe2a1","郄郅郇郈郕郗郘郙郜郝郟郥郒郶郫郯郰郴郾郿鄀鄄鄅鄆鄈鄍鄐鄔鄖鄗鄘鄚鄜鄞鄠鄥鄢鄣鄧鄩鄮鄯鄱鄴鄶鄷鄹鄺鄼鄽酃酇酈酏酓酗酙酚酛酡酤酧酭酴酹酺酻醁醃醅醆醊醎醑醓醔醕醘醞醡醦醨醬醭醮醰醱醲醳醶醻醼醽醿"],["8fe3a1","釂釃釅釓釔釗釙釚釞釤釥釩釪釬",5,"釷釹釻釽鈀鈁鈄鈅鈆鈇鈉鈊鈌鈐鈒鈓鈖鈘鈜鈝鈣鈤鈥鈦鈨鈮鈯鈰鈳鈵鈶鈸鈹鈺鈼鈾鉀鉂鉃鉆鉇鉊鉍鉎鉏鉑鉘鉙鉜鉝鉠鉡鉥鉧鉨鉩鉮鉯鉰鉵",4,"鉻鉼鉽鉿銈銉銊銍銎銒銗"],["8fe4a1","銙銟銠銤銥銧銨銫銯銲銶銸銺銻銼銽銿",4,"鋅鋆鋇鋈鋋鋌鋍鋎鋐鋓鋕鋗鋘鋙鋜鋝鋟鋠鋡鋣鋥鋧鋨鋬鋮鋰鋹鋻鋿錀錂錈錍錑錔錕錜錝錞錟錡錤錥錧錩錪錳錴錶錷鍇鍈鍉鍐鍑鍒鍕鍗鍘鍚鍞鍤鍥鍧鍩鍪鍭鍯鍰鍱鍳鍴鍶"],["8fe5a1","鍺鍽鍿鎀鎁鎂鎈鎊鎋鎍鎏鎒鎕鎘鎛鎞鎡鎣鎤鎦鎨鎫鎴鎵鎶鎺鎩鏁鏄鏅鏆鏇鏉",4,"鏓鏙鏜鏞鏟鏢鏦鏧鏹鏷鏸鏺鏻鏽鐁鐂鐄鐈鐉鐍鐎鐏鐕鐖鐗鐟鐮鐯鐱鐲鐳鐴鐻鐿鐽鑃鑅鑈鑊鑌鑕鑙鑜鑟鑡鑣鑨鑫鑭鑮鑯鑱鑲钄钃镸镹"],["8fe6a1","镾閄閈閌閍閎閝閞閟閡閦閩閫閬閴閶閺閽閿闆闈闉闋闐闑闒闓闙闚闝闞闟闠闤闦阝阞阢阤阥阦阬阱阳阷阸阹阺阼阽陁陒陔陖陗陘陡陮陴陻陼陾陿隁隂隃隄隉隑隖隚隝隟隤隥隦隩隮隯隳隺雊雒嶲雘雚雝雞雟雩雯雱雺霂"],["8fe7a1","霃霅霉霚霛霝霡霢霣霨霱霳靁靃靊靎靏靕靗靘靚靛靣靧靪靮靳靶靷靸靻靽靿鞀鞉鞕鞖鞗鞙鞚鞞鞟鞢鞬鞮鞱鞲鞵鞶鞸鞹鞺鞼鞾鞿韁韄韅韇韉韊韌韍韎韐韑韔韗韘韙韝韞韠韛韡韤韯韱韴韷韸韺頇頊頙頍頎頔頖頜頞頠頣頦"],["8fe8a1","頫頮頯頰頲頳頵頥頾顄顇顊顑顒顓顖顗顙顚顢顣顥顦顪顬颫颭颮颰颴颷颸颺颻颿飂飅飈飌飡飣飥飦飧飪飳飶餂餇餈餑餕餖餗餚餛餜餟餢餦餧餫餱",4,"餹餺餻餼饀饁饆饇饈饍饎饔饘饙饛饜饞饟饠馛馝馟馦馰馱馲馵"],["8fe9a1","馹馺馽馿駃駉駓駔駙駚駜駞駧駪駫駬駰駴駵駹駽駾騂騃騄騋騌騐騑騖騞騠騢騣騤騧騭騮騳騵騶騸驇驁驄驊驋驌驎驑驔驖驝骪骬骮骯骲骴骵骶骹骻骾骿髁髃髆髈髎髐髒髕髖髗髛髜髠髤髥髧髩髬髲髳髵髹髺髽髿",4],["8feaa1","鬄鬅鬈鬉鬋鬌鬍鬎鬐鬒鬖鬙鬛鬜鬠鬦鬫鬭鬳鬴鬵鬷鬹鬺鬽魈魋魌魕魖魗魛魞魡魣魥魦魨魪",4,"魳魵魷魸魹魿鮀鮄鮅鮆鮇鮉鮊鮋鮍鮏鮐鮔鮚鮝鮞鮦鮧鮩鮬鮰鮱鮲鮷鮸鮻鮼鮾鮿鯁鯇鯈鯎鯐鯗鯘鯝鯟鯥鯧鯪鯫鯯鯳鯷鯸"],["8feba1","鯹鯺鯽鯿鰀鰂鰋鰏鰑鰖鰘鰙鰚鰜鰞鰢鰣鰦",4,"鰱鰵鰶鰷鰽鱁鱃鱄鱅鱉鱊鱎鱏鱐鱓鱔鱖鱘鱛鱝鱞鱟鱣鱩鱪鱜鱫鱨鱮鱰鱲鱵鱷鱻鳦鳲鳷鳹鴋鴂鴑鴗鴘鴜鴝鴞鴯鴰鴲鴳鴴鴺鴼鵅鴽鵂鵃鵇鵊鵓鵔鵟鵣鵢鵥鵩鵪鵫鵰鵶鵷鵻"],["8feca1","鵼鵾鶃鶄鶆鶊鶍鶎鶒鶓鶕鶖鶗鶘鶡鶪鶬鶮鶱鶵鶹鶼鶿鷃鷇鷉鷊鷔鷕鷖鷗鷚鷞鷟鷠鷥鷧鷩鷫鷮鷰鷳鷴鷾鸊鸂鸇鸎鸐鸑鸒鸕鸖鸙鸜鸝鹺鹻鹼麀麂麃麄麅麇麎麏麖麘麛麞麤麨麬麮麯麰麳麴麵黆黈黋黕黟黤黧黬黭黮黰黱黲黵"],["8feda1","黸黿鼂鼃鼉鼏鼐鼑鼒鼔鼖鼗鼙鼚鼛鼟鼢鼦鼪鼫鼯鼱鼲鼴鼷鼹鼺鼼鼽鼿齁齃",4,"齓齕齖齗齘齚齝齞齨齩齭",4,"齳齵齺齽龏龐龑龒龔龖龗龞龡龢龣龥"]]

/***/ }),
/* 42 */
/***/ (function(module, exports) {

module.exports = {"uChars":[128,165,169,178,184,216,226,235,238,244,248,251,253,258,276,284,300,325,329,334,364,463,465,467,469,471,473,475,477,506,594,610,712,716,730,930,938,962,970,1026,1104,1106,8209,8215,8218,8222,8231,8241,8244,8246,8252,8365,8452,8454,8458,8471,8482,8556,8570,8596,8602,8713,8720,8722,8726,8731,8737,8740,8742,8748,8751,8760,8766,8777,8781,8787,8802,8808,8816,8854,8858,8870,8896,8979,9322,9372,9548,9588,9616,9622,9634,9652,9662,9672,9676,9680,9702,9735,9738,9793,9795,11906,11909,11913,11917,11928,11944,11947,11951,11956,11960,11964,11979,12284,12292,12312,12319,12330,12351,12436,12447,12535,12543,12586,12842,12850,12964,13200,13215,13218,13253,13263,13267,13270,13384,13428,13727,13839,13851,14617,14703,14801,14816,14964,15183,15471,15585,16471,16736,17208,17325,17330,17374,17623,17997,18018,18212,18218,18301,18318,18760,18811,18814,18820,18823,18844,18848,18872,19576,19620,19738,19887,40870,59244,59336,59367,59413,59417,59423,59431,59437,59443,59452,59460,59478,59493,63789,63866,63894,63976,63986,64016,64018,64021,64025,64034,64037,64042,65074,65093,65107,65112,65127,65132,65375,65510,65536],"gbChars":[0,36,38,45,50,81,89,95,96,100,103,104,105,109,126,133,148,172,175,179,208,306,307,308,309,310,311,312,313,341,428,443,544,545,558,741,742,749,750,805,819,820,7922,7924,7925,7927,7934,7943,7944,7945,7950,8062,8148,8149,8152,8164,8174,8236,8240,8262,8264,8374,8380,8381,8384,8388,8390,8392,8393,8394,8396,8401,8406,8416,8419,8424,8437,8439,8445,8482,8485,8496,8521,8603,8936,8946,9046,9050,9063,9066,9076,9092,9100,9108,9111,9113,9131,9162,9164,9218,9219,11329,11331,11334,11336,11346,11361,11363,11366,11370,11372,11375,11389,11682,11686,11687,11692,11694,11714,11716,11723,11725,11730,11736,11982,11989,12102,12336,12348,12350,12384,12393,12395,12397,12510,12553,12851,12962,12973,13738,13823,13919,13933,14080,14298,14585,14698,15583,15847,16318,16434,16438,16481,16729,17102,17122,17315,17320,17402,17418,17859,17909,17911,17915,17916,17936,17939,17961,18664,18703,18814,18962,19043,33469,33470,33471,33484,33485,33490,33497,33501,33505,33513,33520,33536,33550,37845,37921,37948,38029,38038,38064,38065,38066,38069,38075,38076,38078,39108,39109,39113,39114,39115,39116,39265,39394,189000]}

/***/ }),
/* 43 */
/***/ (function(module, exports) {

module.exports = [["0","\u0000",127],["8141","갂갃갅갆갋",4,"갘갞갟갡갢갣갥",6,"갮갲갳갴"],["8161","갵갶갷갺갻갽갾갿걁",9,"걌걎",5,"걕"],["8181","걖걗걙걚걛걝",18,"걲걳걵걶걹걻",4,"겂겇겈겍겎겏겑겒겓겕",6,"겞겢",5,"겫겭겮겱",6,"겺겾겿곀곂곃곅곆곇곉곊곋곍",7,"곖곘",7,"곢곣곥곦곩곫곭곮곲곴곷",4,"곾곿괁괂괃괅괇",4,"괎괐괒괓"],["8241","괔괕괖괗괙괚괛괝괞괟괡",7,"괪괫괮",5],["8261","괶괷괹괺괻괽",6,"굆굈굊",5,"굑굒굓굕굖굗"],["8281","굙",7,"굢굤",7,"굮굯굱굲굷굸굹굺굾궀궃",4,"궊궋궍궎궏궑",10,"궞",5,"궥",17,"궸",7,"귂귃귅귆귇귉",6,"귒귔",7,"귝귞귟귡귢귣귥",18],["8341","귺귻귽귾긂",5,"긊긌긎",5,"긕",7],["8361","긝",18,"긲긳긵긶긹긻긼"],["8381","긽긾긿깂깄깇깈깉깋깏깑깒깓깕깗",4,"깞깢깣깤깦깧깪깫깭깮깯깱",6,"깺깾",5,"꺆",5,"꺍",46,"꺿껁껂껃껅",6,"껎껒",5,"껚껛껝",8],["8441","껦껧껩껪껬껮",5,"껵껶껷껹껺껻껽",8],["8461","꼆꼉꼊꼋꼌꼎꼏꼑",18],["8481","꼤",7,"꼮꼯꼱꼳꼵",6,"꼾꽀꽄꽅꽆꽇꽊",5,"꽑",10,"꽞",5,"꽦",18,"꽺",5,"꾁꾂꾃꾅꾆꾇꾉",6,"꾒꾓꾔꾖",5,"꾝",26,"꾺꾻꾽꾾"],["8541","꾿꿁",5,"꿊꿌꿏",4,"꿕",6,"꿝",4],["8561","꿢",5,"꿪",5,"꿲꿳꿵꿶꿷꿹",6,"뀂뀃"],["8581","뀅",6,"뀍뀎뀏뀑뀒뀓뀕",6,"뀞",9,"뀩",26,"끆끇끉끋끍끏끐끑끒끖끘끚끛끜끞",29,"끾끿낁낂낃낅",6,"낎낐낒",5,"낛낝낞낣낤"],["8641","낥낦낧낪낰낲낶낷낹낺낻낽",6,"냆냊",5,"냒"],["8661","냓냕냖냗냙",6,"냡냢냣냤냦",10],["8681","냱",22,"넊넍넎넏넑넔넕넖넗넚넞",4,"넦넧넩넪넫넭",6,"넶넺",5,"녂녃녅녆녇녉",6,"녒녓녖녗녙녚녛녝녞녟녡",22,"녺녻녽녾녿놁놃",4,"놊놌놎놏놐놑놕놖놗놙놚놛놝"],["8741","놞",9,"놩",15],["8761","놹",18,"뇍뇎뇏뇑뇒뇓뇕"],["8781","뇖",5,"뇞뇠",7,"뇪뇫뇭뇮뇯뇱",7,"뇺뇼뇾",5,"눆눇눉눊눍",6,"눖눘눚",5,"눡",18,"눵",6,"눽",26,"뉙뉚뉛뉝뉞뉟뉡",6,"뉪",4],["8841","뉯",4,"뉶",5,"뉽",6,"늆늇늈늊",4],["8861","늏늒늓늕늖늗늛",4,"늢늤늧늨늩늫늭늮늯늱늲늳늵늶늷"],["8881","늸",15,"닊닋닍닎닏닑닓",4,"닚닜닞닟닠닡닣닧닩닪닰닱닲닶닼닽닾댂댃댅댆댇댉",6,"댒댖",5,"댝",54,"덗덙덚덝덠덡덢덣"],["8941","덦덨덪덬덭덯덲덳덵덶덷덹",6,"뎂뎆",5,"뎍"],["8961","뎎뎏뎑뎒뎓뎕",10,"뎢",5,"뎩뎪뎫뎭"],["8981","뎮",21,"돆돇돉돊돍돏돑돒돓돖돘돚돜돞돟돡돢돣돥돦돧돩",18,"돽",18,"됑",6,"됙됚됛됝됞됟됡",6,"됪됬",7,"됵",15],["8a41","둅",10,"둒둓둕둖둗둙",6,"둢둤둦"],["8a61","둧",4,"둭",18,"뒁뒂"],["8a81","뒃",4,"뒉",19,"뒞",5,"뒥뒦뒧뒩뒪뒫뒭",7,"뒶뒸뒺",5,"듁듂듃듅듆듇듉",6,"듑듒듓듔듖",5,"듞듟듡듢듥듧",4,"듮듰듲",5,"듹",26,"딖딗딙딚딝"],["8b41","딞",5,"딦딫",4,"딲딳딵딶딷딹",6,"땂땆"],["8b61","땇땈땉땊땎땏땑땒땓땕",6,"땞땢",8],["8b81","땫",52,"떢떣떥떦떧떩떬떭떮떯떲떶",4,"떾떿뗁뗂뗃뗅",6,"뗎뗒",5,"뗙",18,"뗭",18],["8c41","똀",15,"똒똓똕똖똗똙",4],["8c61","똞",6,"똦",5,"똭",6,"똵",5],["8c81","똻",12,"뙉",26,"뙥뙦뙧뙩",50,"뚞뚟뚡뚢뚣뚥",5,"뚭뚮뚯뚰뚲",16],["8d41","뛃",16,"뛕",8],["8d61","뛞",17,"뛱뛲뛳뛵뛶뛷뛹뛺"],["8d81","뛻",4,"뜂뜃뜄뜆",33,"뜪뜫뜭뜮뜱",6,"뜺뜼",7,"띅띆띇띉띊띋띍",6,"띖",9,"띡띢띣띥띦띧띩",6,"띲띴띶",5,"띾띿랁랂랃랅",6,"랎랓랔랕랚랛랝랞"],["8e41","랟랡",6,"랪랮",5,"랶랷랹",8],["8e61","럂",4,"럈럊",19],["8e81","럞",13,"럮럯럱럲럳럵",6,"럾렂",4,"렊렋렍렎렏렑",6,"렚렜렞",5,"렦렧렩렪렫렭",6,"렶렺",5,"롁롂롃롅",11,"롒롔",7,"롞롟롡롢롣롥",6,"롮롰롲",5,"롹롺롻롽",7],["8f41","뢅",7,"뢎",17],["8f61","뢠",7,"뢩",6,"뢱뢲뢳뢵뢶뢷뢹",4],["8f81","뢾뢿룂룄룆",5,"룍룎룏룑룒룓룕",7,"룞룠룢",5,"룪룫룭룮룯룱",6,"룺룼룾",5,"뤅",18,"뤙",6,"뤡",26,"뤾뤿륁륂륃륅",6,"륍륎륐륒",5],["9041","륚륛륝륞륟륡",6,"륪륬륮",5,"륶륷륹륺륻륽"],["9061","륾",5,"릆릈릋릌릏",15],["9081","릟",12,"릮릯릱릲릳릵",6,"릾맀맂",5,"맊맋맍맓",4,"맚맜맟맠맢맦맧맩맪맫맭",6,"맶맻",4,"먂",5,"먉",11,"먖",33,"먺먻먽먾먿멁멃멄멅멆"],["9141","멇멊멌멏멐멑멒멖멗멙멚멛멝",6,"멦멪",5],["9161","멲멳멵멶멷멹",9,"몆몈몉몊몋몍",5],["9181","몓",20,"몪몭몮몯몱몳",4,"몺몼몾",5,"뫅뫆뫇뫉",14,"뫚",33,"뫽뫾뫿묁묂묃묅",7,"묎묐묒",5,"묙묚묛묝묞묟묡",6],["9241","묨묪묬",7,"묷묹묺묿",4,"뭆뭈뭊뭋뭌뭎뭑뭒"],["9261","뭓뭕뭖뭗뭙",7,"뭢뭤",7,"뭭",4],["9281","뭲",21,"뮉뮊뮋뮍뮎뮏뮑",18,"뮥뮦뮧뮩뮪뮫뮭",6,"뮵뮶뮸",7,"믁믂믃믅믆믇믉",6,"믑믒믔",35,"믺믻믽믾밁"],["9341","밃",4,"밊밎밐밒밓밙밚밠밡밢밣밦밨밪밫밬밮밯밲밳밵"],["9361","밶밷밹",6,"뱂뱆뱇뱈뱊뱋뱎뱏뱑",8],["9381","뱚뱛뱜뱞",37,"벆벇벉벊벍벏",4,"벖벘벛",4,"벢벣벥벦벩",6,"벲벶",5,"벾벿볁볂볃볅",7,"볎볒볓볔볖볗볙볚볛볝",22,"볷볹볺볻볽"],["9441","볾",5,"봆봈봊",5,"봑봒봓봕",8],["9461","봞",5,"봥",6,"봭",12],["9481","봺",5,"뵁",6,"뵊뵋뵍뵎뵏뵑",6,"뵚",9,"뵥뵦뵧뵩",22,"붂붃붅붆붋",4,"붒붔붖붗붘붛붝",6,"붥",10,"붱",6,"붹",24],["9541","뷒뷓뷖뷗뷙뷚뷛뷝",11,"뷪",5,"뷱"],["9561","뷲뷳뷵뷶뷷뷹",6,"븁븂븄븆",5,"븎븏븑븒븓"],["9581","븕",6,"븞븠",35,"빆빇빉빊빋빍빏",4,"빖빘빜빝빞빟빢빣빥빦빧빩빫",4,"빲빶",4,"빾빿뺁뺂뺃뺅",6,"뺎뺒",5,"뺚",13,"뺩",14],["9641","뺸",23,"뻒뻓"],["9661","뻕뻖뻙",6,"뻡뻢뻦",5,"뻭",8],["9681","뻶",10,"뼂",5,"뼊",13,"뼚뼞",33,"뽂뽃뽅뽆뽇뽉",6,"뽒뽓뽔뽖",44],["9741","뾃",16,"뾕",8],["9761","뾞",17,"뾱",7],["9781","뾹",11,"뿆",5,"뿎뿏뿑뿒뿓뿕",6,"뿝뿞뿠뿢",89,"쀽쀾쀿"],["9841","쁀",16,"쁒",5,"쁙쁚쁛"],["9861","쁝쁞쁟쁡",6,"쁪",15],["9881","쁺",21,"삒삓삕삖삗삙",6,"삢삤삦",5,"삮삱삲삷",4,"삾샂샃샄샆샇샊샋샍샎샏샑",6,"샚샞",5,"샦샧샩샪샫샭",6,"샶샸샺",5,"섁섂섃섅섆섇섉",6,"섑섒섓섔섖",5,"섡섢섥섨섩섪섫섮"],["9941","섲섳섴섵섷섺섻섽섾섿셁",6,"셊셎",5,"셖셗"],["9961","셙셚셛셝",6,"셦셪",5,"셱셲셳셵셶셷셹셺셻"],["9981","셼",8,"솆",5,"솏솑솒솓솕솗",4,"솞솠솢솣솤솦솧솪솫솭솮솯솱",11,"솾",5,"쇅쇆쇇쇉쇊쇋쇍",6,"쇕쇖쇙",6,"쇡쇢쇣쇥쇦쇧쇩",6,"쇲쇴",7,"쇾쇿숁숂숃숅",6,"숎숐숒",5,"숚숛숝숞숡숢숣"],["9a41","숤숥숦숧숪숬숮숰숳숵",16],["9a61","쉆쉇쉉",6,"쉒쉓쉕쉖쉗쉙",6,"쉡쉢쉣쉤쉦"],["9a81","쉧",4,"쉮쉯쉱쉲쉳쉵",6,"쉾슀슂",5,"슊",5,"슑",6,"슙슚슜슞",5,"슦슧슩슪슫슮",5,"슶슸슺",33,"싞싟싡싢싥",5,"싮싰싲싳싴싵싷싺싽싾싿쌁",6,"쌊쌋쌎쌏"],["9b41","쌐쌑쌒쌖쌗쌙쌚쌛쌝",6,"쌦쌧쌪",8],["9b61","쌳",17,"썆",7],["9b81","썎",25,"썪썫썭썮썯썱썳",4,"썺썻썾",5,"쎅쎆쎇쎉쎊쎋쎍",50,"쏁",22,"쏚"],["9c41","쏛쏝쏞쏡쏣",4,"쏪쏫쏬쏮",5,"쏶쏷쏹",5],["9c61","쏿",8,"쐉",6,"쐑",9],["9c81","쐛",8,"쐥",6,"쐭쐮쐯쐱쐲쐳쐵",6,"쐾",9,"쑉",26,"쑦쑧쑩쑪쑫쑭",6,"쑶쑷쑸쑺",5,"쒁",18,"쒕",6,"쒝",12],["9d41","쒪",13,"쒹쒺쒻쒽",8],["9d61","쓆",25],["9d81","쓠",8,"쓪",5,"쓲쓳쓵쓶쓷쓹쓻쓼쓽쓾씂",9,"씍씎씏씑씒씓씕",6,"씝",10,"씪씫씭씮씯씱",6,"씺씼씾",5,"앆앇앋앏앐앑앒앖앚앛앜앟앢앣앥앦앧앩",6,"앲앶",5,"앾앿얁얂얃얅얆얈얉얊얋얎얐얒얓얔"],["9e41","얖얙얚얛얝얞얟얡",7,"얪",9,"얶"],["9e61","얷얺얿",4,"엋엍엏엒엓엕엖엗엙",6,"엢엤엦엧"],["9e81","엨엩엪엫엯엱엲엳엵엸엹엺엻옂옃옄옉옊옋옍옎옏옑",6,"옚옝",6,"옦옧옩옪옫옯옱옲옶옸옺옼옽옾옿왂왃왅왆왇왉",6,"왒왖",5,"왞왟왡",10,"왭왮왰왲",5,"왺왻왽왾왿욁",6,"욊욌욎",5,"욖욗욙욚욛욝",6,"욦"],["9f41","욨욪",5,"욲욳욵욶욷욻",4,"웂웄웆",5,"웎"],["9f61","웏웑웒웓웕",6,"웞웟웢",5,"웪웫웭웮웯웱웲"],["9f81","웳",4,"웺웻웼웾",5,"윆윇윉윊윋윍",6,"윖윘윚",5,"윢윣윥윦윧윩",6,"윲윴윶윸윹윺윻윾윿읁읂읃읅",4,"읋읎읐읙읚읛읝읞읟읡",6,"읩읪읬",7,"읶읷읹읺읻읿잀잁잂잆잋잌잍잏잒잓잕잙잛",4,"잢잧",4,"잮잯잱잲잳잵잶잷"],["a041","잸잹잺잻잾쟂",5,"쟊쟋쟍쟏쟑",6,"쟙쟚쟛쟜"],["a061","쟞",5,"쟥쟦쟧쟩쟪쟫쟭",13],["a081","쟻",4,"젂젃젅젆젇젉젋",4,"젒젔젗",4,"젞젟젡젢젣젥",6,"젮젰젲",5,"젹젺젻젽젾젿졁",6,"졊졋졎",5,"졕",26,"졲졳졵졶졷졹졻",4,"좂좄좈좉좊좎",5,"좕",7,"좞좠좢좣좤"],["a141","좥좦좧좩",18,"좾좿죀죁"],["a161","죂죃죅죆죇죉죊죋죍",6,"죖죘죚",5,"죢죣죥"],["a181","죦",14,"죶",5,"죾죿줁줂줃줇",4,"줎　、。·‥…¨〃­―∥＼∼‘’“”〔〕〈",9,"±×÷≠≤≥∞∴°′″℃Å￠￡￥♂♀∠⊥⌒∂∇≡≒§※☆★○●◎◇◆□■△▲▽▼→←↑↓↔〓≪≫√∽∝∵∫∬∈∋⊆⊇⊂⊃∪∩∧∨￢"],["a241","줐줒",5,"줙",18],["a261","줭",6,"줵",18],["a281","쥈",7,"쥒쥓쥕쥖쥗쥙",6,"쥢쥤",7,"쥭쥮쥯⇒⇔∀∃´～ˇ˘˝˚˙¸˛¡¿ː∮∑∏¤℉‰◁◀▷▶♤♠♡♥♧♣⊙◈▣◐◑▒▤▥▨▧▦▩♨☏☎☜☞¶†‡↕↗↙↖↘♭♩♪♬㉿㈜№㏇™㏂㏘℡€®"],["a341","쥱쥲쥳쥵",6,"쥽",10,"즊즋즍즎즏"],["a361","즑",6,"즚즜즞",16],["a381","즯",16,"짂짃짅짆짉짋",4,"짒짔짗짘짛！",58,"￦］",32,"￣"],["a441","짞짟짡짣짥짦짨짩짪짫짮짲",5,"짺짻짽짾짿쨁쨂쨃쨄"],["a461","쨅쨆쨇쨊쨎",5,"쨕쨖쨗쨙",12],["a481","쨦쨧쨨쨪",28,"ㄱ",93],["a541","쩇",4,"쩎쩏쩑쩒쩓쩕",6,"쩞쩢",5,"쩩쩪"],["a561","쩫",17,"쩾",5,"쪅쪆"],["a581","쪇",16,"쪙",14,"ⅰ",9],["a5b0","Ⅰ",9],["a5c1","Α",16,"Σ",6],["a5e1","α",16,"σ",6],["a641","쪨",19,"쪾쪿쫁쫂쫃쫅"],["a661","쫆",5,"쫎쫐쫒쫔쫕쫖쫗쫚",5,"쫡",6],["a681","쫨쫩쫪쫫쫭",6,"쫵",18,"쬉쬊─│┌┐┘└├┬┤┴┼━┃┏┓┛┗┣┳┫┻╋┠┯┨┷┿┝┰┥┸╂┒┑┚┙┖┕┎┍┞┟┡┢┦┧┩┪┭┮┱┲┵┶┹┺┽┾╀╁╃",7],["a741","쬋",4,"쬑쬒쬓쬕쬖쬗쬙",6,"쬢",7],["a761","쬪",22,"쭂쭃쭄"],["a781","쭅쭆쭇쭊쭋쭍쭎쭏쭑",6,"쭚쭛쭜쭞",5,"쭥",7,"㎕㎖㎗ℓ㎘㏄㎣㎤㎥㎦㎙",9,"㏊㎍㎎㎏㏏㎈㎉㏈㎧㎨㎰",9,"㎀",4,"㎺",5,"㎐",4,"Ω㏀㏁㎊㎋㎌㏖㏅㎭㎮㎯㏛㎩㎪㎫㎬㏝㏐㏓㏃㏉㏜㏆"],["a841","쭭",10,"쭺",14],["a861","쮉",18,"쮝",6],["a881","쮤",19,"쮹",11,"ÆÐªĦ"],["a8a6","Ĳ"],["a8a8","ĿŁØŒºÞŦŊ"],["a8b1","㉠",27,"ⓐ",25,"①",14,"½⅓⅔¼¾⅛⅜⅝⅞"],["a941","쯅",14,"쯕",10],["a961","쯠쯡쯢쯣쯥쯦쯨쯪",18],["a981","쯽",14,"찎찏찑찒찓찕",6,"찞찟찠찣찤æđðħıĳĸŀłøœßþŧŋŉ㈀",27,"⒜",25,"⑴",14,"¹²³⁴ⁿ₁₂₃₄"],["aa41","찥찦찪찫찭찯찱",6,"찺찿",4,"챆챇챉챊챋챍챎"],["aa61","챏",4,"챖챚",5,"챡챢챣챥챧챩",6,"챱챲"],["aa81","챳챴챶",29,"ぁ",82],["ab41","첔첕첖첗첚첛첝첞첟첡",6,"첪첮",5,"첶첷첹"],["ab61","첺첻첽",6,"쳆쳈쳊",5,"쳑쳒쳓쳕",5],["ab81","쳛",8,"쳥",6,"쳭쳮쳯쳱",12,"ァ",85],["ac41","쳾쳿촀촂",5,"촊촋촍촎촏촑",6,"촚촜촞촟촠"],["ac61","촡촢촣촥촦촧촩촪촫촭",11,"촺",4],["ac81","촿",28,"쵝쵞쵟А",5,"ЁЖ",25],["acd1","а",5,"ёж",25],["ad41","쵡쵢쵣쵥",6,"쵮쵰쵲",5,"쵹",7],["ad61","춁",6,"춉",10,"춖춗춙춚춛춝춞춟"],["ad81","춠춡춢춣춦춨춪",5,"춱",18,"췅"],["ae41","췆",5,"췍췎췏췑",16],["ae61","췢",5,"췩췪췫췭췮췯췱",6,"췺췼췾",4],["ae81","츃츅츆츇츉츊츋츍",6,"츕츖츗츘츚",5,"츢츣츥츦츧츩츪츫"],["af41","츬츭츮츯츲츴츶",19],["af61","칊",13,"칚칛칝칞칢",5,"칪칬"],["af81","칮",5,"칶칷칹칺칻칽",6,"캆캈캊",5,"캒캓캕캖캗캙"],["b041","캚",5,"캢캦",5,"캮",12],["b061","캻",5,"컂",19],["b081","컖",13,"컦컧컩컪컭",6,"컶컺",5,"가각간갇갈갉갊감",7,"같",4,"갠갤갬갭갯갰갱갸갹갼걀걋걍걔걘걜거걱건걷걸걺검겁것겄겅겆겉겊겋게겐겔겜겝겟겠겡겨격겪견겯결겸겹겻겼경곁계곈곌곕곗고곡곤곧골곪곬곯곰곱곳공곶과곽관괄괆"],["b141","켂켃켅켆켇켉",6,"켒켔켖",5,"켝켞켟켡켢켣"],["b161","켥",6,"켮켲",5,"켹",11],["b181","콅",14,"콖콗콙콚콛콝",6,"콦콨콪콫콬괌괍괏광괘괜괠괩괬괭괴괵괸괼굄굅굇굉교굔굘굡굣구국군굳굴굵굶굻굼굽굿궁궂궈궉권궐궜궝궤궷귀귁귄귈귐귑귓규균귤그극근귿글긁금급긋긍긔기긱긴긷길긺김깁깃깅깆깊까깍깎깐깔깖깜깝깟깠깡깥깨깩깬깰깸"],["b241","콭콮콯콲콳콵콶콷콹",6,"쾁쾂쾃쾄쾆",5,"쾍"],["b261","쾎",18,"쾢",5,"쾩"],["b281","쾪",5,"쾱",18,"쿅",6,"깹깻깼깽꺄꺅꺌꺼꺽꺾껀껄껌껍껏껐껑께껙껜껨껫껭껴껸껼꼇꼈꼍꼐꼬꼭꼰꼲꼴꼼꼽꼿꽁꽂꽃꽈꽉꽐꽜꽝꽤꽥꽹꾀꾄꾈꾐꾑꾕꾜꾸꾹꾼꿀꿇꿈꿉꿋꿍꿎꿔꿜꿨꿩꿰꿱꿴꿸뀀뀁뀄뀌뀐뀔뀜뀝뀨끄끅끈끊끌끎끓끔끕끗끙"],["b341","쿌",19,"쿢쿣쿥쿦쿧쿩"],["b361","쿪",5,"쿲쿴쿶",5,"쿽쿾쿿퀁퀂퀃퀅",5],["b381","퀋",5,"퀒",5,"퀙",19,"끝끼끽낀낄낌낍낏낑나낙낚난낟날낡낢남납낫",4,"낱낳내낵낸낼냄냅냇냈냉냐냑냔냘냠냥너넉넋넌널넒넓넘넙넛넜넝넣네넥넨넬넴넵넷넸넹녀녁년녈념녑녔녕녘녜녠노녹논놀놂놈놉놋농높놓놔놘놜놨뇌뇐뇔뇜뇝"],["b441","퀮",5,"퀶퀷퀹퀺퀻퀽",6,"큆큈큊",5],["b461","큑큒큓큕큖큗큙",6,"큡",10,"큮큯"],["b481","큱큲큳큵",6,"큾큿킀킂",18,"뇟뇨뇩뇬뇰뇹뇻뇽누눅눈눋눌눔눕눗눙눠눴눼뉘뉜뉠뉨뉩뉴뉵뉼늄늅늉느늑는늘늙늚늠늡늣능늦늪늬늰늴니닉닌닐닒님닙닛닝닢다닥닦단닫",4,"닳담답닷",4,"닿대댁댄댈댐댑댓댔댕댜더덕덖던덛덜덞덟덤덥"],["b541","킕",14,"킦킧킩킪킫킭",5],["b561","킳킶킸킺",5,"탂탃탅탆탇탊",5,"탒탖",4],["b581","탛탞탟탡탢탣탥",6,"탮탲",5,"탹",11,"덧덩덫덮데덱덴델뎀뎁뎃뎄뎅뎌뎐뎔뎠뎡뎨뎬도독돈돋돌돎돐돔돕돗동돛돝돠돤돨돼됐되된될됨됩됫됴두둑둔둘둠둡둣둥둬뒀뒈뒝뒤뒨뒬뒵뒷뒹듀듄듈듐듕드득든듣들듦듬듭듯등듸디딕딘딛딜딤딥딧딨딩딪따딱딴딸"],["b641","턅",7,"턎",17],["b661","턠",15,"턲턳턵턶턷턹턻턼턽턾"],["b681","턿텂텆",5,"텎텏텑텒텓텕",6,"텞텠텢",5,"텩텪텫텭땀땁땃땄땅땋때땍땐땔땜땝땟땠땡떠떡떤떨떪떫떰떱떳떴떵떻떼떽뗀뗄뗌뗍뗏뗐뗑뗘뗬또똑똔똘똥똬똴뙈뙤뙨뚜뚝뚠뚤뚫뚬뚱뛔뛰뛴뛸뜀뜁뜅뜨뜩뜬뜯뜰뜸뜹뜻띄띈띌띔띕띠띤띨띰띱띳띵라락란랄람랍랏랐랑랒랖랗"],["b741","텮",13,"텽",6,"톅톆톇톉톊"],["b761","톋",20,"톢톣톥톦톧"],["b781","톩",6,"톲톴톶톷톸톹톻톽톾톿퇁",14,"래랙랜랠램랩랫랬랭랴략랸럇량러럭런럴럼럽럿렀렁렇레렉렌렐렘렙렛렝려력련렬렴렵렷렸령례롄롑롓로록론롤롬롭롯롱롸롼뢍뢨뢰뢴뢸룀룁룃룅료룐룔룝룟룡루룩룬룰룸룹룻룽뤄뤘뤠뤼뤽륀륄륌륏륑류륙륜률륨륩"],["b841","퇐",7,"퇙",17],["b861","퇫",8,"퇵퇶퇷퇹",13],["b881","툈툊",5,"툑",24,"륫륭르륵른를름릅릇릉릊릍릎리릭린릴림립릿링마막만많",4,"맘맙맛망맞맡맣매맥맨맬맴맵맷맸맹맺먀먁먈먕머먹먼멀멂멈멉멋멍멎멓메멕멘멜멤멥멧멨멩며멱면멸몃몄명몇몌모목몫몬몰몲몸몹못몽뫄뫈뫘뫙뫼"],["b941","툪툫툮툯툱툲툳툵",6,"툾퉀퉂",5,"퉉퉊퉋퉌"],["b961","퉍",14,"퉝",6,"퉥퉦퉧퉨"],["b981","퉩",22,"튂튃튅튆튇튉튊튋튌묀묄묍묏묑묘묜묠묩묫무묵묶문묻물묽묾뭄뭅뭇뭉뭍뭏뭐뭔뭘뭡뭣뭬뮈뮌뮐뮤뮨뮬뮴뮷므믄믈믐믓미믹민믿밀밂밈밉밋밌밍및밑바",4,"받",4,"밤밥밧방밭배백밴밸뱀뱁뱃뱄뱅뱉뱌뱍뱐뱝버벅번벋벌벎범법벗"],["ba41","튍튎튏튒튓튔튖",5,"튝튞튟튡튢튣튥",6,"튭"],["ba61","튮튯튰튲",5,"튺튻튽튾틁틃",4,"틊틌",5],["ba81","틒틓틕틖틗틙틚틛틝",6,"틦",9,"틲틳틵틶틷틹틺벙벚베벡벤벧벨벰벱벳벴벵벼벽변별볍볏볐병볕볘볜보복볶본볼봄봅봇봉봐봔봤봬뵀뵈뵉뵌뵐뵘뵙뵤뵨부북분붇불붉붊붐붑붓붕붙붚붜붤붰붸뷔뷕뷘뷜뷩뷰뷴뷸븀븃븅브븍븐블븜븝븟비빅빈빌빎빔빕빗빙빚빛빠빡빤"],["bb41","틻",4,"팂팄팆",5,"팏팑팒팓팕팗",4,"팞팢팣"],["bb61","팤팦팧팪팫팭팮팯팱",6,"팺팾",5,"퍆퍇퍈퍉"],["bb81","퍊",31,"빨빪빰빱빳빴빵빻빼빽뺀뺄뺌뺍뺏뺐뺑뺘뺙뺨뻐뻑뻔뻗뻘뻠뻣뻤뻥뻬뼁뼈뼉뼘뼙뼛뼜뼝뽀뽁뽄뽈뽐뽑뽕뾔뾰뿅뿌뿍뿐뿔뿜뿟뿡쀼쁑쁘쁜쁠쁨쁩삐삑삔삘삠삡삣삥사삭삯산삳살삵삶삼삽삿샀상샅새색샌샐샘샙샛샜생샤"],["bc41","퍪",17,"퍾퍿펁펂펃펅펆펇"],["bc61","펈펉펊펋펎펒",5,"펚펛펝펞펟펡",6,"펪펬펮"],["bc81","펯",4,"펵펶펷펹펺펻펽",6,"폆폇폊",5,"폑",5,"샥샨샬샴샵샷샹섀섄섈섐섕서",4,"섣설섦섧섬섭섯섰성섶세섹센셀셈셉셋셌셍셔셕션셜셤셥셧셨셩셰셴셸솅소속솎손솔솖솜솝솟송솥솨솩솬솰솽쇄쇈쇌쇔쇗쇘쇠쇤쇨쇰쇱쇳쇼쇽숀숄숌숍숏숑수숙순숟술숨숩숫숭"],["bd41","폗폙",7,"폢폤",7,"폮폯폱폲폳폵폶폷"],["bd61","폸폹폺폻폾퐀퐂",5,"퐉",13],["bd81","퐗",5,"퐞",25,"숯숱숲숴쉈쉐쉑쉔쉘쉠쉥쉬쉭쉰쉴쉼쉽쉿슁슈슉슐슘슛슝스슥슨슬슭슴습슷승시식신싣실싫심십싯싱싶싸싹싻싼쌀쌈쌉쌌쌍쌓쌔쌕쌘쌜쌤쌥쌨쌩썅써썩썬썰썲썸썹썼썽쎄쎈쎌쏀쏘쏙쏜쏟쏠쏢쏨쏩쏭쏴쏵쏸쐈쐐쐤쐬쐰"],["be41","퐸",7,"푁푂푃푅",14],["be61","푔",7,"푝푞푟푡푢푣푥",7,"푮푰푱푲"],["be81","푳",4,"푺푻푽푾풁풃",4,"풊풌풎",5,"풕",8,"쐴쐼쐽쑈쑤쑥쑨쑬쑴쑵쑹쒀쒔쒜쒸쒼쓩쓰쓱쓴쓸쓺쓿씀씁씌씐씔씜씨씩씬씰씸씹씻씽아악안앉않알앍앎앓암압앗았앙앝앞애액앤앨앰앱앳앴앵야약얀얄얇얌얍얏양얕얗얘얜얠얩어억언얹얻얼얽얾엄",6,"엌엎"],["bf41","풞",10,"풪",14],["bf61","풹",18,"퓍퓎퓏퓑퓒퓓퓕"],["bf81","퓖",5,"퓝퓞퓠",7,"퓩퓪퓫퓭퓮퓯퓱",6,"퓹퓺퓼에엑엔엘엠엡엣엥여역엮연열엶엷염",5,"옅옆옇예옌옐옘옙옛옜오옥온올옭옮옰옳옴옵옷옹옻와왁완왈왐왑왓왔왕왜왝왠왬왯왱외왹왼욀욈욉욋욍요욕욘욜욤욥욧용우욱운울욹욺움웁웃웅워웍원월웜웝웠웡웨"],["c041","퓾",5,"픅픆픇픉픊픋픍",6,"픖픘",5],["c061","픞",25],["c081","픸픹픺픻픾픿핁핂핃핅",6,"핎핐핒",5,"핚핛핝핞핟핡핢핣웩웬웰웸웹웽위윅윈윌윔윕윗윙유육윤율윰윱윳융윷으윽은을읊음읍읏응",7,"읜읠읨읫이익인일읽읾잃임입잇있잉잊잎자작잔잖잗잘잚잠잡잣잤장잦재잭잰잴잼잽잿쟀쟁쟈쟉쟌쟎쟐쟘쟝쟤쟨쟬저적전절젊"],["c141","핤핦핧핪핬핮",5,"핶핷핹핺핻핽",6,"햆햊햋"],["c161","햌햍햎햏햑",19,"햦햧"],["c181","햨",31,"점접젓정젖제젝젠젤젬젭젯젱져젼졀졈졉졌졍졔조족존졸졺좀좁좃종좆좇좋좌좍좔좝좟좡좨좼좽죄죈죌죔죕죗죙죠죡죤죵주죽준줄줅줆줌줍줏중줘줬줴쥐쥑쥔쥘쥠쥡쥣쥬쥰쥴쥼즈즉즌즐즘즙즛증지직진짇질짊짐집짓"],["c241","헊헋헍헎헏헑헓",4,"헚헜헞",5,"헦헧헩헪헫헭헮"],["c261","헯",4,"헶헸헺",5,"혂혃혅혆혇혉",6,"혒"],["c281","혖",5,"혝혞혟혡혢혣혥",7,"혮",9,"혺혻징짖짙짚짜짝짠짢짤짧짬짭짯짰짱째짹짼쨀쨈쨉쨋쨌쨍쨔쨘쨩쩌쩍쩐쩔쩜쩝쩟쩠쩡쩨쩽쪄쪘쪼쪽쫀쫄쫌쫍쫏쫑쫓쫘쫙쫠쫬쫴쬈쬐쬔쬘쬠쬡쭁쭈쭉쭌쭐쭘쭙쭝쭤쭸쭹쮜쮸쯔쯤쯧쯩찌찍찐찔찜찝찡찢찧차착찬찮찰참찹찻"],["c341","혽혾혿홁홂홃홄홆홇홊홌홎홏홐홒홓홖홗홙홚홛홝",4],["c361","홢",4,"홨홪",5,"홲홳홵",11],["c381","횁횂횄횆",5,"횎횏횑횒횓횕",7,"횞횠횢",5,"횩횪찼창찾채책챈챌챔챕챗챘챙챠챤챦챨챰챵처척천철첨첩첫첬청체첵첸첼쳄쳅쳇쳉쳐쳔쳤쳬쳰촁초촉촌촐촘촙촛총촤촨촬촹최쵠쵤쵬쵭쵯쵱쵸춈추축춘출춤춥춧충춰췄췌췐취췬췰췸췹췻췽츄츈츌츔츙츠측츤츨츰츱츳층"],["c441","횫횭횮횯횱",7,"횺횼",7,"훆훇훉훊훋"],["c461","훍훎훏훐훒훓훕훖훘훚",5,"훡훢훣훥훦훧훩",4],["c481","훮훯훱훲훳훴훶",5,"훾훿휁휂휃휅",11,"휒휓휔치칙친칟칠칡침칩칫칭카칵칸칼캄캅캇캉캐캑캔캘캠캡캣캤캥캬캭컁커컥컨컫컬컴컵컷컸컹케켁켄켈켐켑켓켕켜켠켤켬켭켯켰켱켸코콕콘콜콤콥콧콩콰콱콴콸쾀쾅쾌쾡쾨쾰쿄쿠쿡쿤쿨쿰쿱쿳쿵쿼퀀퀄퀑퀘퀭퀴퀵퀸퀼"],["c541","휕휖휗휚휛휝휞휟휡",6,"휪휬휮",5,"휶휷휹"],["c561","휺휻휽",6,"흅흆흈흊",5,"흒흓흕흚",4],["c581","흟흢흤흦흧흨흪흫흭흮흯흱흲흳흵",6,"흾흿힀힂",5,"힊힋큄큅큇큉큐큔큘큠크큭큰클큼큽킁키킥킨킬킴킵킷킹타탁탄탈탉탐탑탓탔탕태택탠탤탬탭탯탰탱탸턍터턱턴털턺텀텁텃텄텅테텍텐텔템텝텟텡텨텬텼톄톈토톡톤톨톰톱톳통톺톼퇀퇘퇴퇸툇툉툐투툭툰툴툼툽툿퉁퉈퉜"],["c641","힍힎힏힑",6,"힚힜힞",5],["c6a1","퉤튀튁튄튈튐튑튕튜튠튤튬튱트특튼튿틀틂틈틉틋틔틘틜틤틥티틱틴틸팀팁팃팅파팍팎판팔팖팜팝팟팠팡팥패팩팬팰팸팹팻팼팽퍄퍅퍼퍽펀펄펌펍펏펐펑페펙펜펠펨펩펫펭펴편펼폄폅폈평폐폘폡폣포폭폰폴폼폽폿퐁"],["c7a1","퐈퐝푀푄표푠푤푭푯푸푹푼푿풀풂품풉풋풍풔풩퓌퓐퓔퓜퓟퓨퓬퓰퓸퓻퓽프픈플픔픕픗피픽핀필핌핍핏핑하학한할핥함합핫항해핵핸핼햄햅햇했행햐향허헉헌헐헒험헙헛헝헤헥헨헬헴헵헷헹혀혁현혈혐협혓혔형혜혠"],["c8a1","혤혭호혹혼홀홅홈홉홋홍홑화확환활홧황홰홱홴횃횅회획횐횔횝횟횡효횬횰횹횻후훅훈훌훑훔훗훙훠훤훨훰훵훼훽휀휄휑휘휙휜휠휨휩휫휭휴휵휸휼흄흇흉흐흑흔흖흗흘흙흠흡흣흥흩희흰흴흼흽힁히힉힌힐힘힙힛힝"],["caa1","伽佳假價加可呵哥嘉嫁家暇架枷柯歌珂痂稼苛茄街袈訶賈跏軻迦駕刻却各恪慤殼珏脚覺角閣侃刊墾奸姦干幹懇揀杆柬桿澗癎看磵稈竿簡肝艮艱諫間乫喝曷渴碣竭葛褐蝎鞨勘坎堪嵌感憾戡敢柑橄減甘疳監瞰紺邯鑑鑒龕"],["cba1","匣岬甲胛鉀閘剛堈姜岡崗康强彊慷江畺疆糠絳綱羌腔舡薑襁講鋼降鱇介价個凱塏愷愾慨改槪漑疥皆盖箇芥蓋豈鎧開喀客坑更粳羹醵倨去居巨拒据據擧渠炬祛距踞車遽鉅鋸乾件健巾建愆楗腱虔蹇鍵騫乞傑杰桀儉劍劒檢"],["cca1","瞼鈐黔劫怯迲偈憩揭擊格檄激膈覡隔堅牽犬甄絹繭肩見譴遣鵑抉決潔結缺訣兼慊箝謙鉗鎌京俓倞傾儆勁勍卿坰境庚徑慶憬擎敬景暻更梗涇炅烱璟璥瓊痙硬磬竟競絅經耕耿脛莖警輕逕鏡頃頸驚鯨係啓堺契季屆悸戒桂械"],["cda1","棨溪界癸磎稽系繫繼計誡谿階鷄古叩告呱固姑孤尻庫拷攷故敲暠枯槁沽痼皐睾稿羔考股膏苦苽菰藁蠱袴誥賈辜錮雇顧高鼓哭斛曲梏穀谷鵠困坤崑昆梱棍滾琨袞鯤汨滑骨供公共功孔工恐恭拱控攻珙空蚣貢鞏串寡戈果瓜"],["cea1","科菓誇課跨過鍋顆廓槨藿郭串冠官寬慣棺款灌琯瓘管罐菅觀貫關館刮恝括适侊光匡壙廣曠洸炚狂珖筐胱鑛卦掛罫乖傀塊壞怪愧拐槐魁宏紘肱轟交僑咬喬嬌嶠巧攪敎校橋狡皎矯絞翹膠蕎蛟較轎郊餃驕鮫丘久九仇俱具勾"],["cfa1","區口句咎嘔坵垢寇嶇廐懼拘救枸柩構歐毆毬求溝灸狗玖球瞿矩究絿耉臼舅舊苟衢謳購軀逑邱鉤銶駒驅鳩鷗龜國局菊鞠鞫麴君窘群裙軍郡堀屈掘窟宮弓穹窮芎躬倦券勸卷圈拳捲權淃眷厥獗蕨蹶闕机櫃潰詭軌饋句晷歸貴"],["d0a1","鬼龜叫圭奎揆槻珪硅窺竅糾葵規赳逵閨勻均畇筠菌鈞龜橘克剋劇戟棘極隙僅劤勤懃斤根槿瑾筋芹菫覲謹近饉契今妗擒昑檎琴禁禽芩衾衿襟金錦伋及急扱汲級給亘兢矜肯企伎其冀嗜器圻基埼夔奇妓寄岐崎己幾忌技旗旣"],["d1a1","朞期杞棋棄機欺氣汽沂淇玘琦琪璂璣畸畿碁磯祁祇祈祺箕紀綺羈耆耭肌記譏豈起錡錤飢饑騎騏驥麒緊佶吉拮桔金喫儺喇奈娜懦懶拏拿癩",5,"那樂",4,"諾酪駱亂卵暖欄煖爛蘭難鸞捏捺南嵐枏楠湳濫男藍襤拉"],["d2a1","納臘蠟衲囊娘廊",4,"乃來內奈柰耐冷女年撚秊念恬拈捻寧寗努勞奴弩怒擄櫓爐瑙盧",5,"駑魯",10,"濃籠聾膿農惱牢磊腦賂雷尿壘",7,"嫩訥杻紐勒",5,"能菱陵尼泥匿溺多茶"],["d3a1","丹亶但單團壇彖斷旦檀段湍短端簞緞蛋袒鄲鍛撻澾獺疸達啖坍憺擔曇淡湛潭澹痰聃膽蕁覃談譚錟沓畓答踏遝唐堂塘幢戇撞棠當糖螳黨代垈坮大對岱帶待戴擡玳臺袋貸隊黛宅德悳倒刀到圖堵塗導屠島嶋度徒悼挑掉搗桃"],["d4a1","棹櫂淘渡滔濤燾盜睹禱稻萄覩賭跳蹈逃途道都鍍陶韜毒瀆牘犢獨督禿篤纛讀墩惇敦旽暾沌焞燉豚頓乭突仝冬凍動同憧東桐棟洞潼疼瞳童胴董銅兜斗杜枓痘竇荳讀豆逗頭屯臀芚遁遯鈍得嶝橙燈登等藤謄鄧騰喇懶拏癩羅"],["d5a1","蘿螺裸邏樂洛烙珞絡落諾酪駱丹亂卵欄欒瀾爛蘭鸞剌辣嵐擥攬欖濫籃纜藍襤覽拉臘蠟廊朗浪狼琅瑯螂郞來崍徠萊冷掠略亮倆兩凉梁樑粮粱糧良諒輛量侶儷勵呂廬慮戾旅櫚濾礪藜蠣閭驢驪麗黎力曆歷瀝礫轢靂憐戀攣漣"],["d6a1","煉璉練聯蓮輦連鍊冽列劣洌烈裂廉斂殮濂簾獵令伶囹寧岺嶺怜玲笭羚翎聆逞鈴零靈領齡例澧禮醴隷勞怒撈擄櫓潞瀘爐盧老蘆虜路輅露魯鷺鹵碌祿綠菉錄鹿麓論壟弄朧瀧瓏籠聾儡瀨牢磊賂賚賴雷了僚寮廖料燎療瞭聊蓼"],["d7a1","遼鬧龍壘婁屢樓淚漏瘻累縷蔞褸鏤陋劉旒柳榴流溜瀏琉瑠留瘤硫謬類六戮陸侖倫崙淪綸輪律慄栗率隆勒肋凜凌楞稜綾菱陵俚利厘吏唎履悧李梨浬犁狸理璃異痢籬罹羸莉裏裡里釐離鯉吝潾燐璘藺躪隣鱗麟林淋琳臨霖砬"],["d8a1","立笠粒摩瑪痲碼磨馬魔麻寞幕漠膜莫邈万卍娩巒彎慢挽晩曼滿漫灣瞞萬蔓蠻輓饅鰻唜抹末沫茉襪靺亡妄忘忙望網罔芒茫莽輞邙埋妹媒寐昧枚梅每煤罵買賣邁魅脈貊陌驀麥孟氓猛盲盟萌冪覓免冕勉棉沔眄眠綿緬面麵滅"],["d9a1","蔑冥名命明暝椧溟皿瞑茗蓂螟酩銘鳴袂侮冒募姆帽慕摸摹暮某模母毛牟牡瑁眸矛耗芼茅謀謨貌木沐牧目睦穆鶩歿沒夢朦蒙卯墓妙廟描昴杳渺猫竗苗錨務巫憮懋戊拇撫无楙武毋無珷畝繆舞茂蕪誣貿霧鵡墨默們刎吻問文"],["daa1","汶紊紋聞蚊門雯勿沕物味媚尾嵋彌微未梶楣渼湄眉米美薇謎迷靡黴岷悶愍憫敏旻旼民泯玟珉緡閔密蜜謐剝博拍搏撲朴樸泊珀璞箔粕縛膊舶薄迫雹駁伴半反叛拌搬攀斑槃泮潘班畔瘢盤盼磐磻礬絆般蟠返頒飯勃拔撥渤潑"],["dba1","發跋醱鉢髮魃倣傍坊妨尨幇彷房放方旁昉枋榜滂磅紡肪膀舫芳蒡蚌訪謗邦防龐倍俳北培徘拜排杯湃焙盃背胚裴裵褙賠輩配陪伯佰帛柏栢白百魄幡樊煩燔番磻繁蕃藩飜伐筏罰閥凡帆梵氾汎泛犯範范法琺僻劈壁擘檗璧癖"],["dca1","碧蘗闢霹便卞弁變辨辯邊別瞥鱉鼈丙倂兵屛幷昞昺柄棅炳甁病秉竝輧餠騈保堡報寶普步洑湺潽珤甫菩補褓譜輔伏僕匐卜宓復服福腹茯蔔複覆輹輻馥鰒本乶俸奉封峯峰捧棒烽熢琫縫蓬蜂逢鋒鳳不付俯傅剖副否咐埠夫婦"],["dda1","孚孵富府復扶敷斧浮溥父符簿缶腐腑膚艀芙莩訃負賦賻赴趺部釜阜附駙鳧北分吩噴墳奔奮忿憤扮昐汾焚盆粉糞紛芬賁雰不佛弗彿拂崩朋棚硼繃鵬丕備匕匪卑妃婢庇悲憊扉批斐枇榧比毖毗毘沸泌琵痺砒碑秕秘粃緋翡肥"],["dea1","脾臂菲蜚裨誹譬費鄙非飛鼻嚬嬪彬斌檳殯浜濱瀕牝玭貧賓頻憑氷聘騁乍事些仕伺似使俟僿史司唆嗣四士奢娑寫寺射巳師徙思捨斜斯柶査梭死沙泗渣瀉獅砂社祀祠私篩紗絲肆舍莎蓑蛇裟詐詞謝賜赦辭邪飼駟麝削數朔索"],["dfa1","傘刪山散汕珊産疝算蒜酸霰乷撒殺煞薩三參杉森渗芟蔘衫揷澁鈒颯上傷像償商喪嘗孀尙峠常床庠廂想桑橡湘爽牀狀相祥箱翔裳觴詳象賞霜塞璽賽嗇塞穡索色牲生甥省笙墅壻嶼序庶徐恕抒捿敍暑曙書栖棲犀瑞筮絮緖署"],["e0a1","胥舒薯西誓逝鋤黍鼠夕奭席惜昔晳析汐淅潟石碩蓆釋錫仙僊先善嬋宣扇敾旋渲煽琁瑄璇璿癬禪線繕羨腺膳船蘚蟬詵跣選銑鐥饍鮮卨屑楔泄洩渫舌薛褻設說雪齧剡暹殲纖蟾贍閃陝攝涉燮葉城姓宬性惺成星晟猩珹盛省筬"],["e1a1","聖聲腥誠醒世勢歲洗稅笹細說貰召嘯塑宵小少巢所掃搔昭梳沼消溯瀟炤燒甦疏疎瘙笑篠簫素紹蔬蕭蘇訴逍遡邵銷韶騷俗屬束涑粟續謖贖速孫巽損蓀遜飡率宋悚松淞訟誦送頌刷殺灑碎鎖衰釗修受嗽囚垂壽嫂守岫峀帥愁"],["e2a1","戍手授搜收數樹殊水洙漱燧狩獸琇璲瘦睡秀穗竪粹綏綬繡羞脩茱蒐蓚藪袖誰讐輸遂邃酬銖銹隋隧隨雖需須首髓鬚叔塾夙孰宿淑潚熟琡璹肅菽巡徇循恂旬栒楯橓殉洵淳珣盾瞬筍純脣舜荀蓴蕣詢諄醇錞順馴戌術述鉥崇崧"],["e3a1","嵩瑟膝蝨濕拾習褶襲丞乘僧勝升承昇繩蠅陞侍匙嘶始媤尸屎屍市弑恃施是時枾柴猜矢示翅蒔蓍視試詩諡豕豺埴寔式息拭植殖湜熄篒蝕識軾食飾伸侁信呻娠宸愼新晨燼申神紳腎臣莘薪藎蜃訊身辛辰迅失室實悉審尋心沁"],["e4a1","沈深瀋甚芯諶什十拾雙氏亞俄兒啞娥峨我牙芽莪蛾衙訝阿雅餓鴉鵝堊岳嶽幄惡愕握樂渥鄂鍔顎鰐齷安岸按晏案眼雁鞍顔鮟斡謁軋閼唵岩巖庵暗癌菴闇壓押狎鴨仰央怏昻殃秧鴦厓哀埃崖愛曖涯碍艾隘靄厄扼掖液縊腋額"],["e5a1","櫻罌鶯鸚也倻冶夜惹揶椰爺耶若野弱掠略約若葯蒻藥躍亮佯兩凉壤孃恙揚攘敭暘梁楊樣洋瀁煬痒瘍禳穰糧羊良襄諒讓釀陽量養圄御於漁瘀禦語馭魚齬億憶抑檍臆偃堰彦焉言諺孼蘖俺儼嚴奄掩淹嶪業円予余勵呂女如廬"],["e6a1","旅歟汝濾璵礖礪與艅茹輿轝閭餘驪麗黎亦力域役易曆歷疫繹譯轢逆驛嚥堧姸娟宴年延憐戀捐挻撚椽沇沿涎涓淵演漣烟然煙煉燃燕璉硏硯秊筵緣練縯聯衍軟輦蓮連鉛鍊鳶列劣咽悅涅烈熱裂說閱厭廉念捻染殮炎焰琰艶苒"],["e7a1","簾閻髥鹽曄獵燁葉令囹塋寧嶺嶸影怜映暎楹榮永泳渶潁濚瀛瀯煐營獰玲瑛瑩瓔盈穎纓羚聆英詠迎鈴鍈零霙靈領乂倪例刈叡曳汭濊猊睿穢芮藝蘂禮裔詣譽豫醴銳隸霓預五伍俉傲午吾吳嗚塢墺奧娛寤悟惡懊敖旿晤梧汚澳"],["e8a1","烏熬獒筽蜈誤鰲鼇屋沃獄玉鈺溫瑥瘟穩縕蘊兀壅擁瓮甕癰翁邕雍饔渦瓦窩窪臥蛙蝸訛婉完宛梡椀浣玩琓琬碗緩翫脘腕莞豌阮頑曰往旺枉汪王倭娃歪矮外嵬巍猥畏了僚僥凹堯夭妖姚寥寮尿嶢拗搖撓擾料曜樂橈燎燿瑤療"],["e9a1","窈窯繇繞耀腰蓼蟯要謠遙遼邀饒慾欲浴縟褥辱俑傭冗勇埇墉容庸慂榕涌湧溶熔瑢用甬聳茸蓉踊鎔鏞龍于佑偶優又友右宇寓尤愚憂旴牛玗瑀盂祐禑禹紆羽芋藕虞迂遇郵釪隅雨雩勖彧旭昱栯煜稶郁頊云暈橒殞澐熉耘芸蕓"],["eaa1","運隕雲韻蔚鬱亐熊雄元原員圓園垣媛嫄寃怨愿援沅洹湲源爰猿瑗苑袁轅遠阮院願鴛月越鉞位偉僞危圍委威尉慰暐渭爲瑋緯胃萎葦蔿蝟衛褘謂違韋魏乳侑儒兪劉唯喩孺宥幼幽庾悠惟愈愉揄攸有杻柔柚柳楡楢油洧流游溜"],["eba1","濡猶猷琉瑜由留癒硫紐維臾萸裕誘諛諭踰蹂遊逾遺酉釉鍮類六堉戮毓肉育陸倫允奫尹崙淪潤玧胤贇輪鈗閏律慄栗率聿戎瀜絨融隆垠恩慇殷誾銀隱乙吟淫蔭陰音飮揖泣邑凝應膺鷹依倚儀宜意懿擬椅毅疑矣義艤薏蟻衣誼"],["eca1","議醫二以伊利吏夷姨履已弛彛怡易李梨泥爾珥理異痍痢移罹而耳肄苡荑裏裡貽貳邇里離飴餌匿溺瀷益翊翌翼謚人仁刃印吝咽因姻寅引忍湮燐璘絪茵藺蚓認隣靭靷鱗麟一佚佾壹日溢逸鎰馹任壬妊姙恁林淋稔臨荏賃入卄"],["eda1","立笠粒仍剩孕芿仔刺咨姉姿子字孜恣慈滋炙煮玆瓷疵磁紫者自茨蔗藉諮資雌作勺嚼斫昨灼炸爵綽芍酌雀鵲孱棧殘潺盞岑暫潛箴簪蠶雜丈仗匠場墻壯奬將帳庄張掌暲杖樟檣欌漿牆狀獐璋章粧腸臟臧莊葬蔣薔藏裝贓醬長"],["eea1","障再哉在宰才材栽梓渽滓災縡裁財載齋齎爭箏諍錚佇低儲咀姐底抵杵楮樗沮渚狙猪疽箸紵苧菹著藷詛貯躇這邸雎齟勣吊嫡寂摘敵滴狄炙的積笛籍績翟荻謫賊赤跡蹟迪迹適鏑佃佺傳全典前剪塡塼奠專展廛悛戰栓殿氈澱"],["efa1","煎琠田甸畑癲筌箋箭篆纏詮輾轉鈿銓錢鐫電顚顫餞切截折浙癤竊節絶占岾店漸点粘霑鮎點接摺蝶丁井亭停偵呈姃定幀庭廷征情挺政整旌晶晸柾楨檉正汀淀淨渟湞瀞炡玎珽町睛碇禎程穽精綎艇訂諪貞鄭酊釘鉦鋌錠霆靖"],["f0a1","靜頂鼎制劑啼堤帝弟悌提梯濟祭第臍薺製諸蹄醍除際霽題齊俎兆凋助嘲弔彫措操早晁曺曹朝條棗槽漕潮照燥爪璪眺祖祚租稠窕粗糟組繰肇藻蚤詔調趙躁造遭釣阻雕鳥族簇足鏃存尊卒拙猝倧宗從悰慫棕淙琮種終綜縱腫"],["f1a1","踪踵鍾鐘佐坐左座挫罪主住侏做姝胄呪周嗾奏宙州廚晝朱柱株注洲湊澍炷珠疇籌紂紬綢舟蛛註誅走躊輳週酎酒鑄駐竹粥俊儁准埈寯峻晙樽浚準濬焌畯竣蠢逡遵雋駿茁中仲衆重卽櫛楫汁葺增憎曾拯烝甑症繒蒸證贈之只"],["f2a1","咫地址志持指摯支旨智枝枳止池沚漬知砥祉祗紙肢脂至芝芷蜘誌識贄趾遲直稙稷織職唇嗔塵振搢晉晋桭榛殄津溱珍瑨璡畛疹盡眞瞋秦縉縝臻蔯袗診賑軫辰進鎭陣陳震侄叱姪嫉帙桎瓆疾秩窒膣蛭質跌迭斟朕什執潗緝輯"],["f3a1","鏶集徵懲澄且侘借叉嗟嵯差次此磋箚茶蹉車遮捉搾着窄錯鑿齪撰澯燦璨瓚竄簒纂粲纘讚贊鑽餐饌刹察擦札紮僭參塹慘慙懺斬站讒讖倉倡創唱娼廠彰愴敞昌昶暢槍滄漲猖瘡窓脹艙菖蒼債埰寀寨彩採砦綵菜蔡采釵冊柵策"],["f4a1","責凄妻悽處倜刺剔尺慽戚拓擲斥滌瘠脊蹠陟隻仟千喘天川擅泉淺玔穿舛薦賤踐遷釧闡阡韆凸哲喆徹撤澈綴輟轍鐵僉尖沾添甛瞻簽籤詹諂堞妾帖捷牒疊睫諜貼輒廳晴淸聽菁請靑鯖切剃替涕滯締諦逮遞體初剿哨憔抄招梢"],["f5a1","椒楚樵炒焦硝礁礎秒稍肖艸苕草蕉貂超酢醋醮促囑燭矗蜀觸寸忖村邨叢塚寵悤憁摠總聰蔥銃撮催崔最墜抽推椎楸樞湫皺秋芻萩諏趨追鄒酋醜錐錘鎚雛騶鰍丑畜祝竺筑築縮蓄蹙蹴軸逐春椿瑃出朮黜充忠沖蟲衝衷悴膵萃"],["f6a1","贅取吹嘴娶就炊翠聚脆臭趣醉驟鷲側仄厠惻測層侈値嗤峙幟恥梔治淄熾痔痴癡稚穉緇緻置致蚩輜雉馳齒則勅飭親七柒漆侵寢枕沈浸琛砧針鍼蟄秤稱快他咤唾墮妥惰打拖朶楕舵陀馱駝倬卓啄坼度托拓擢晫柝濁濯琢琸託"],["f7a1","鐸呑嘆坦彈憚歎灘炭綻誕奪脫探眈耽貪塔搭榻宕帑湯糖蕩兌台太怠態殆汰泰笞胎苔跆邰颱宅擇澤撑攄兎吐土討慟桶洞痛筒統通堆槌腿褪退頹偸套妬投透鬪慝特闖坡婆巴把播擺杷波派爬琶破罷芭跛頗判坂板版瓣販辦鈑"],["f8a1","阪八叭捌佩唄悖敗沛浿牌狽稗覇貝彭澎烹膨愎便偏扁片篇編翩遍鞭騙貶坪平枰萍評吠嬖幣廢弊斃肺蔽閉陛佈包匍匏咆哺圃布怖抛抱捕暴泡浦疱砲胞脯苞葡蒲袍褒逋鋪飽鮑幅暴曝瀑爆輻俵剽彪慓杓標漂瓢票表豹飇飄驃"],["f9a1","品稟楓諷豊風馮彼披疲皮被避陂匹弼必泌珌畢疋筆苾馝乏逼下何厦夏廈昰河瑕荷蝦賀遐霞鰕壑學虐謔鶴寒恨悍旱汗漢澣瀚罕翰閑閒限韓割轄函含咸啣喊檻涵緘艦銜陷鹹合哈盒蛤閤闔陜亢伉姮嫦巷恒抗杭桁沆港缸肛航"],["faa1","行降項亥偕咳垓奚孩害懈楷海瀣蟹解該諧邂駭骸劾核倖幸杏荇行享向嚮珦鄕響餉饗香噓墟虛許憲櫶獻軒歇險驗奕爀赫革俔峴弦懸晛泫炫玄玹現眩睍絃絢縣舷衒見賢鉉顯孑穴血頁嫌俠協夾峽挾浹狹脅脇莢鋏頰亨兄刑型"],["fba1","形泂滎瀅灐炯熒珩瑩荊螢衡逈邢鎣馨兮彗惠慧暳蕙蹊醯鞋乎互呼壕壺好岵弧戶扈昊晧毫浩淏湖滸澔濠濩灝狐琥瑚瓠皓祜糊縞胡芦葫蒿虎號蝴護豪鎬頀顥惑或酷婚昏混渾琿魂忽惚笏哄弘汞泓洪烘紅虹訌鴻化和嬅樺火畵"],["fca1","禍禾花華話譁貨靴廓擴攫確碻穫丸喚奐宦幻患換歡晥桓渙煥環紈還驩鰥活滑猾豁闊凰幌徨恍惶愰慌晃晄榥況湟滉潢煌璜皇篁簧荒蝗遑隍黃匯回廻徊恢悔懷晦會檜淮澮灰獪繪膾茴蛔誨賄劃獲宖橫鐄哮嚆孝效斅曉梟涍淆"],["fda1","爻肴酵驍侯候厚后吼喉嗅帿後朽煦珝逅勛勳塤壎焄熏燻薰訓暈薨喧暄煊萱卉喙毁彙徽揮暉煇諱輝麾休携烋畦虧恤譎鷸兇凶匈洶胸黑昕欣炘痕吃屹紇訖欠欽歆吸恰洽翕興僖凞喜噫囍姬嬉希憙憘戱晞曦熙熹熺犧禧稀羲詰"]]

/***/ }),
/* 44 */
/***/ (function(module, exports) {

module.exports = [["8740","䏰䰲䘃䖦䕸𧉧䵷䖳𧲱䳢𧳅㮕䜶䝄䱇䱀𤊿𣘗𧍒𦺋𧃒䱗𪍑䝏䗚䲅𧱬䴇䪤䚡𦬣爥𥩔𡩣𣸆𣽡晍囻"],["8767","綕夝𨮹㷴霴𧯯寛𡵞媤㘥𩺰嫑宷峼杮薓𩥅瑡璝㡵𡵓𣚞𦀡㻬"],["87a1","𥣞㫵竼龗𤅡𨤍𣇪𠪊𣉞䌊蒄龖鐯䤰蘓墖靊鈘秐稲晠権袝瑌篅枂稬剏遆㓦珄𥶹瓆鿇垳䤯呌䄱𣚎堘穲𧭥讏䚮𦺈䆁𥶙箮𢒼鿈𢓁𢓉𢓌鿉蔄𣖻䂴鿊䓡𪷿拁灮鿋"],["8840","㇀",4,"𠄌㇅𠃑𠃍㇆㇇𠃋𡿨㇈𠃊㇉㇊㇋㇌𠄎㇍㇎ĀÁǍÀĒÉĚÈŌÓǑÒ࿿Ê̄Ế࿿Ê̌ỀÊāáǎàɑēéěèīíǐìōóǒòūúǔùǖǘǚ"],["88a1","ǜü࿿ê̄ế࿿ê̌ềêɡ⏚⏛"],["8940","𪎩𡅅"],["8943","攊"],["8946","丽滝鵎釟"],["894c","𧜵撑会伨侨兖兴农凤务动医华发变团声处备夲头学实実岚庆总斉柾栄桥济炼电纤纬纺织经统缆缷艺苏药视设询车轧轮"],["89a1","琑糼緍楆竉刧"],["89ab","醌碸酞肼"],["89b0","贋胶𠧧"],["89b5","肟黇䳍鷉鸌䰾𩷶𧀎鸊𪄳㗁"],["89c1","溚舾甙"],["89c5","䤑马骏龙禇𨑬𡷊𠗐𢫦两亁亀亇亿仫伷㑌侽㹈倃傈㑽㒓㒥円夅凛凼刅争剹劐匧㗇厩㕑厰㕓参吣㕭㕲㚁咓咣咴咹哐哯唘唣唨㖘唿㖥㖿嗗㗅"],["8a40","𧶄唥"],["8a43","𠱂𠴕𥄫喐𢳆㧬𠍁蹆𤶸𩓥䁓𨂾睺𢰸㨴䟕𨅝𦧲𤷪擝𠵼𠾴𠳕𡃴撍蹾𠺖𠰋𠽤𢲩𨉖𤓓"],["8a64","𠵆𩩍𨃩䟴𤺧𢳂骲㩧𩗴㿭㔆𥋇𩟔𧣈𢵄鵮頕"],["8a76","䏙𦂥撴哣𢵌𢯊𡁷㧻𡁯"],["8aa1","𦛚𦜖𧦠擪𥁒𠱃蹨𢆡𨭌𠜱"],["8aac","䠋𠆩㿺塳𢶍"],["8ab2","𤗈𠓼𦂗𠽌𠶖啹䂻䎺"],["8abb","䪴𢩦𡂝膪飵𠶜捹㧾𢝵跀嚡摼㹃"],["8ac9","𪘁𠸉𢫏𢳉"],["8ace","𡃈𣧂㦒㨆𨊛㕸𥹉𢃇噒𠼱𢲲𩜠㒼氽𤸻"],["8adf","𧕴𢺋𢈈𪙛𨳍𠹺𠰴𦠜羓𡃏𢠃𢤹㗻𥇣𠺌𠾍𠺪㾓𠼰𠵇𡅏𠹌"],["8af6","𠺫𠮩𠵈𡃀𡄽㿹𢚖搲𠾭"],["8b40","𣏴𧘹𢯎𠵾𠵿𢱑𢱕㨘𠺘𡃇𠼮𪘲𦭐𨳒𨶙𨳊閪哌苄喹"],["8b55","𩻃鰦骶𧝞𢷮煀腭胬尜𦕲脴㞗卟𨂽醶𠻺𠸏𠹷𠻻㗝𤷫㘉𠳖嚯𢞵𡃉𠸐𠹸𡁸𡅈𨈇𡑕𠹹𤹐𢶤婔𡀝𡀞𡃵𡃶垜𠸑"],["8ba1","𧚔𨋍𠾵𠹻𥅾㜃𠾶𡆀𥋘𪊽𤧚𡠺𤅷𨉼墙剨㘚𥜽箲孨䠀䬬鼧䧧鰟鮍𥭴𣄽嗻㗲嚉丨夂𡯁屮靑𠂆乛亻㔾尣彑忄㣺扌攵歺氵氺灬爫丬犭𤣩罒礻糹罓𦉪㓁"],["8bde","𦍋耂肀𦘒𦥑卝衤见𧢲讠贝钅镸长门𨸏韦页风飞饣𩠐鱼鸟黄歯龜丷𠂇阝户钢"],["8c40","倻淾𩱳龦㷉袏𤅎灷峵䬠𥇍㕙𥴰愢𨨲辧釶熑朙玺𣊁𪄇㲋𡦀䬐磤琂冮𨜏䀉橣𪊺䈣蘏𠩯稪𩥇𨫪靕灍匤𢁾鏴盙𨧣龧矝亣俰傼丯众龨吴綋墒壐𡶶庒庙忂𢜒斋"],["8ca1","𣏹椙橃𣱣泿"],["8ca7","爀𤔅玌㻛𤨓嬕璹讃𥲤𥚕窓篬糃繬苸薗龩袐龪躹龫迏蕟駠鈡龬𨶹𡐿䁱䊢娚"],["8cc9","顨杫䉶圽"],["8cce","藖𤥻芿𧄍䲁𦵴嵻𦬕𦾾龭龮宖龯曧繛湗秊㶈䓃𣉖𢞖䎚䔶"],["8ce6","峕𣬚諹屸㴒𣕑嵸龲煗䕘𤃬𡸣䱷㥸㑊𠆤𦱁諌侴𠈹妿腬顖𩣺弻"],["8d40","𠮟"],["8d42","𢇁𨥭䄂䚻𩁹㼇龳𪆵䃸㟖䛷𦱆䅼𨚲𧏿䕭㣔𥒚䕡䔛䶉䱻䵶䗪㿈𤬏㙡䓞䒽䇭崾嵈嵖㷼㠏嶤嶹㠠㠸幂庽弥徃㤈㤔㤿㥍惗愽峥㦉憷憹懏㦸戬抐拥挘㧸嚱"],["8da1","㨃揢揻搇摚㩋擀崕嘡龟㪗斆㪽旿晓㫲暒㬢朖㭂枤栀㭘桊梄㭲㭱㭻椉楃牜楤榟榅㮼槖㯝橥橴橱檂㯬檙㯲檫檵櫔櫶殁毁毪汵沪㳋洂洆洦涁㳯涤涱渕渘温溆𨧀溻滢滚齿滨滩漤漴㵆𣽁澁澾㵪㵵熷岙㶊瀬㶑灐灔灯灿炉𠌥䏁㗱𠻘"],["8e40","𣻗垾𦻓焾𥟠㙎榢𨯩孴穉𥣡𩓙穥穽𥦬窻窰竂竃燑𦒍䇊竚竝竪䇯咲𥰁笋筕笩𥌎𥳾箢筯莜𥮴𦱿篐萡箒箸𥴠㶭𥱥蒒篺簆簵𥳁籄粃𤢂粦晽𤕸糉糇糦籴糳糵糎"],["8ea1","繧䔝𦹄絝𦻖璍綉綫焵綳緒𤁗𦀩緤㴓緵𡟹緥𨍭縝𦄡𦅚繮纒䌫鑬縧罀罁罇礶𦋐駡羗𦍑羣𡙡𠁨䕜𣝦䔃𨌺翺𦒉者耈耝耨耯𪂇𦳃耻耼聡𢜔䦉𦘦𣷣𦛨朥肧𨩈脇脚墰𢛶汿𦒘𤾸擧𡒊舘𡡞橓𤩥𤪕䑺舩𠬍𦩒𣵾俹𡓽蓢荢𦬊𤦧𣔰𡝳𣷸芪椛芳䇛"],["8f40","蕋苐茚𠸖𡞴㛁𣅽𣕚艻苢茘𣺋𦶣𦬅𦮗𣗎㶿茝嗬莅䔋𦶥莬菁菓㑾𦻔橗蕚㒖𦹂𢻯葘𥯤葱㷓䓤檧葊𣲵祘蒨𦮖𦹷𦹃蓞萏莑䒠蒓蓤𥲑䉀𥳀䕃蔴嫲𦺙䔧蕳䔖枿蘖"],["8fa1","𨘥𨘻藁𧂈蘂𡖂𧃍䕫䕪蘨㙈𡢢号𧎚虾蝱𪃸蟮𢰧螱蟚蠏噡虬桖䘏衅衆𧗠𣶹𧗤衞袜䙛袴袵揁装睷𧜏覇覊覦覩覧覼𨨥觧𧤤𧪽誜瞓釾誐𧩙竩𧬺𣾏䜓𧬸煼謌謟𥐰𥕥謿譌譍誩𤩺讐讛誯𡛟䘕衏貛𧵔𧶏貫㜥𧵓賖𧶘𧶽贒贃𡤐賛灜贑𤳉㻐起"],["9040","趩𨀂𡀔𤦊㭼𨆼𧄌竧躭躶軃鋔輙輭𨍥𨐒辥錃𪊟𠩐辳䤪𨧞𨔽𣶻廸𣉢迹𪀔𨚼𨔁𢌥㦀𦻗逷𨔼𧪾遡𨕬𨘋邨𨜓郄𨛦邮都酧㫰醩釄粬𨤳𡺉鈎沟鉁鉢𥖹銹𨫆𣲛𨬌𥗛"],["90a1","𠴱錬鍫𨫡𨯫炏嫃𨫢𨫥䥥鉄𨯬𨰹𨯿鍳鑛躼閅閦鐦閠濶䊹𢙺𨛘𡉼𣸮䧟氜陻隖䅬隣𦻕懚隶磵𨫠隽双䦡𦲸𠉴𦐐𩂯𩃥𤫑𡤕𣌊霱虂霶䨏䔽䖅𤫩灵孁霛靜𩇕靗孊𩇫靟鐥僐𣂷𣂼鞉鞟鞱鞾韀韒韠𥑬韮琜𩐳響韵𩐝𧥺䫑頴頳顋顦㬎𧅵㵑𠘰𤅜"],["9140","𥜆飊颷飈飇䫿𦴧𡛓喰飡飦飬鍸餹𤨩䭲𩡗𩤅駵騌騻騐驘𥜥㛄𩂱𩯕髠髢𩬅髴䰎鬔鬭𨘀倴鬴𦦨㣃𣁽魐魀𩴾婅𡡣鮎𤉋鰂鯿鰌𩹨鷔𩾷𪆒𪆫𪃡𪄣𪇟鵾鶃𪄴鸎梈"],["91a1","鷄𢅛𪆓𪈠𡤻𪈳鴹𪂹𪊴麐麕麞麢䴴麪麯𤍤黁㭠㧥㴝伲㞾𨰫鼂鼈䮖鐤𦶢鼗鼖鼹嚟嚊齅馸𩂋韲葿齢齩竜龎爖䮾𤥵𤦻煷𤧸𤍈𤩑玞𨯚𡣺禟𨥾𨸶鍩鏳𨩄鋬鎁鏋𨥬𤒹爗㻫睲穃烐𤑳𤏸煾𡟯炣𡢾𣖙㻇𡢅𥐯𡟸㜢𡛻𡠹㛡𡝴𡣑𥽋㜣𡛀坛𤨥𡏾𡊨"],["9240","𡏆𡒶蔃𣚦蔃葕𤦔𧅥𣸱𥕜𣻻𧁒䓴𣛮𩦝𦼦柹㜳㰕㷧塬𡤢栐䁗𣜿𤃡𤂋𤄏𦰡哋嚞𦚱嚒𠿟𠮨𠸍鏆𨬓鎜仸儫㠙𤐶亼𠑥𠍿佋侊𥙑婨𠆫𠏋㦙𠌊𠐔㐵伩𠋀𨺳𠉵諚𠈌亘"],["92a1","働儍侢伃𤨎𣺊佂倮偬傁俌俥偘僼兙兛兝兞湶𣖕𣸹𣺿浲𡢄𣺉冨凃𠗠䓝𠒣𠒒𠒑赺𨪜𠜎剙劤𠡳勡鍮䙺熌𤎌𠰠𤦬𡃤槑𠸝瑹㻞璙琔瑖玘䮎𤪼𤂍叐㖄爏𤃉喴𠍅响𠯆圝鉝雴鍦埝垍坿㘾壋媙𨩆𡛺𡝯𡜐娬妸銏婾嫏娒𥥆𡧳𡡡𤊕㛵洅瑃娡𥺃"],["9340","媁𨯗𠐓鏠璌𡌃焅䥲鐈𨧻鎽㞠尞岞幞幈𡦖𡥼𣫮廍孏𡤃𡤄㜁𡢠㛝𡛾㛓脪𨩇𡶺𣑲𨦨弌弎𡤧𡞫婫𡜻孄蘔𧗽衠恾𢡠𢘫忛㺸𢖯𢖾𩂈𦽳懀𠀾𠁆𢘛憙憘恵𢲛𢴇𤛔𩅍"],["93a1","摱𤙥𢭪㨩𢬢𣑐𩣪𢹸挷𪑛撶挱揑𤧣𢵧护𢲡搻敫楲㯴𣂎𣊭𤦉𣊫唍𣋠𡣙𩐿曎𣊉𣆳㫠䆐𥖄𨬢𥖏𡛼𥕛𥐥磮𣄃𡠪𣈴㑤𣈏𣆂𤋉暎𦴤晫䮓昰𧡰𡷫晣𣋒𣋡昞𥡲㣑𣠺𣞼㮙𣞢𣏾瓐㮖枏𤘪梶栞㯄檾㡣𣟕𤒇樳橒櫉欅𡤒攑梘橌㯗橺歗𣿀𣲚鎠鋲𨯪𨫋"],["9440","銉𨀞𨧜鑧涥漋𤧬浧𣽿㶏渄𤀼娽渊塇洤硂焻𤌚𤉶烱牐犇犔𤞏𤜥兹𤪤𠗫瑺𣻸𣙟𤩊𤤗𥿡㼆㺱𤫟𨰣𣼵悧㻳瓌琼鎇琷䒟𦷪䕑疃㽣𤳙𤴆㽘畕癳𪗆㬙瑨𨫌𤦫𤦎㫻"],["94a1","㷍𤩎㻿𤧅𤣳釺圲鍂𨫣𡡤僟𥈡𥇧睸𣈲眎眏睻𤚗𣞁㩞𤣰琸璛㺿𤪺𤫇䃈𤪖𦆮錇𥖁砞碍碈磒珐祙𧝁𥛣䄎禛蒖禥樭𣻺稺秴䅮𡛦䄲鈵秱𠵌𤦌𠊙𣶺𡝮㖗啫㕰㚪𠇔𠰍竢婙𢛵𥪯𥪜娍𠉛磰娪𥯆竾䇹籝籭䈑𥮳𥺼𥺦糍𤧹𡞰粎籼粮檲緜縇緓罎𦉡"],["9540","𦅜𧭈綗𥺂䉪𦭵𠤖柖𠁎𣗏埄𦐒𦏸𤥢翝笧𠠬𥫩𥵃笌𥸎駦虅驣樜𣐿㧢𤧷𦖭騟𦖠蒀𧄧𦳑䓪脷䐂胆脉腂𦞴飃𦩂艢艥𦩑葓𦶧蘐𧈛媆䅿𡡀嬫𡢡嫤𡣘蚠蜨𣶏蠭𧐢娂"],["95a1","衮佅袇袿裦襥襍𥚃襔𧞅𧞄𨯵𨯙𨮜𨧹㺭蒣䛵䛏㟲訽訜𩑈彍鈫𤊄旔焩烄𡡅鵭貟賩𧷜妚矃姰䍮㛔踪躧𤰉輰轊䋴汘澻𢌡䢛潹溋𡟚鯩㚵𤤯邻邗啱䤆醻鐄𨩋䁢𨫼鐧𨰝𨰻蓥訫閙閧閗閖𨴴瑅㻂𤣿𤩂𤏪㻧𣈥随𨻧𨹦𨹥㻌𤧭𤩸𣿮琒瑫㻼靁𩂰"],["9640","桇䨝𩂓𥟟靝鍨𨦉𨰦𨬯𦎾銺嬑譩䤼珹𤈛鞛靱餸𠼦巁𨯅𤪲頟𩓚鋶𩗗釥䓀𨭐𤩧𨭤飜𨩅㼀鈪䤥萔餻饍𧬆㷽馛䭯馪驜𨭥𥣈檏騡嫾騯𩣱䮐𩥈馼䮽䮗鍽塲𡌂堢𤦸"],["96a1","𡓨硄𢜟𣶸棅㵽鑘㤧慐𢞁𢥫愇鱏鱓鱻鰵鰐魿鯏𩸭鮟𪇵𪃾鴡䲮𤄄鸘䲰鴌𪆴𪃭𪃳𩤯鶥蒽𦸒𦿟𦮂藼䔳𦶤𦺄𦷰萠藮𦸀𣟗𦁤秢𣖜𣙀䤭𤧞㵢鏛銾鍈𠊿碹鉷鑍俤㑀遤𥕝砽硔碶硋𡝗𣇉𤥁㚚佲濚濙瀞瀞吔𤆵垻壳垊鴖埗焴㒯𤆬燫𦱀𤾗嬨𡞵𨩉"],["9740","愌嫎娋䊼𤒈㜬䭻𨧼鎻鎸𡣖𠼝葲𦳀𡐓𤋺𢰦𤏁妔𣶷𦝁綨𦅛𦂤𤦹𤦋𨧺鋥珢㻩璴𨭣𡢟㻡𤪳櫘珳珻㻖𤨾𤪔𡟙𤩦𠎧𡐤𤧥瑈𤤖炥𤥶銄珦鍟𠓾錱𨫎𨨖鎆𨯧𥗕䤵𨪂煫"],["97a1","𤥃𠳿嚤𠘚𠯫𠲸唂秄𡟺緾𡛂𤩐𡡒䔮鐁㜊𨫀𤦭妰𡢿𡢃𧒄媡㛢𣵛㚰鉟婹𨪁𡡢鍴㳍𠪴䪖㦊僴㵩㵌𡎜煵䋻𨈘渏𩃤䓫浗𧹏灧沯㳖𣿭𣸭渂漌㵯𠏵畑㚼㓈䚀㻚䡱姄鉮䤾轁𨰜𦯀堒埈㛖𡑒烾𤍢𤩱𢿣𡊰𢎽梹楧𡎘𣓥𧯴𣛟𨪃𣟖𣏺𤲟樚𣚭𦲷萾䓟䓎"],["9840","𦴦𦵑𦲂𦿞漗𧄉茽𡜺菭𦲀𧁓𡟛妉媂𡞳婡婱𡤅𤇼㜭姯𡜼㛇熎鎐暚𤊥婮娫𤊓樫𣻹𧜶𤑛𤋊焝𤉙𨧡侰𦴨峂𤓎𧹍𤎽樌𤉖𡌄炦焳𤏩㶥泟勇𤩏繥姫崯㷳彜𤩝𡟟綤萦"],["98a1","咅𣫺𣌀𠈔坾𠣕𠘙㿥𡾞𪊶瀃𩅛嵰玏糓𨩙𩐠俈翧狍猐𧫴猸猹𥛶獁獈㺩𧬘遬燵𤣲珡臶㻊県㻑沢国琙琞琟㻢㻰㻴㻺瓓㼎㽓畂畭畲疍㽼痈痜㿀癍㿗癴㿜発𤽜熈嘣覀塩䀝睃䀹条䁅㗛瞘䁪䁯属瞾矋売砘点砜䂨砹硇硑硦葈𥔵礳栃礲䄃"],["9940","䄉禑禙辻稆込䅧窑䆲窼艹䇄竏竛䇏両筢筬筻簒簛䉠䉺类粜䊌粸䊔糭输烀𠳏総緔緐緽羮羴犟䎗耠耥笹耮耱联㷌垴炠肷胩䏭脌猪脎脒畠脔䐁㬹腖腙腚"],["99a1","䐓堺腼膄䐥膓䐭膥埯臁臤艔䒏芦艶苊苘苿䒰荗险榊萅烵葤惣蒈䔄蒾蓡蓸蔐蔸蕒䔻蕯蕰藠䕷虲蚒蚲蛯际螋䘆䘗袮裿褤襇覑𧥧訩訸誔誴豑賔賲贜䞘塟跃䟭仮踺嗘坔蹱嗵躰䠷軎転軤軭軲辷迁迊迌逳駄䢭飠鈓䤞鈨鉘鉫銱銮銿"],["9a40","鋣鋫鋳鋴鋽鍃鎄鎭䥅䥑麿鐗匁鐝鐭鐾䥪鑔鑹锭関䦧间阳䧥枠䨤靀䨵鞲韂噔䫤惨颹䬙飱塄餎餙冴餜餷饂饝饢䭰駅䮝騼鬏窃魩鮁鯝鯱鯴䱭鰠㝯𡯂鵉鰺"],["9aa1","黾噐鶓鶽鷀鷼银辶鹻麬麱麽黆铜黢黱黸竈齄𠂔𠊷𠎠椚铃妬𠓗塀铁㞹𠗕𠘕𠙶𡚺块煳𠫂𠫍𠮿呪吆𠯋咞𠯻𠰻𠱓𠱥𠱼惧𠲍噺𠲵𠳝𠳭𠵯𠶲𠷈楕鰯螥𠸄𠸎𠻗𠾐𠼭𠹳尠𠾼帋𡁜𡁏𡁶朞𡁻𡂈𡂖㙇𡂿𡃓𡄯𡄻卤蒭𡋣𡍵𡌶讁𡕷𡘙𡟃𡟇乸炻𡠭𡥪"],["9b40","𡨭𡩅𡰪𡱰𡲬𡻈拃𡻕𡼕熘桕𢁅槩㛈𢉼𢏗𢏺𢜪𢡱𢥏苽𢥧𢦓𢫕覥𢫨辠𢬎鞸𢬿顇骽𢱌"],["9b62","𢲈𢲷𥯨𢴈𢴒𢶷𢶕𢹂𢽴𢿌𣀳𣁦𣌟𣏞徱晈暿𧩹𣕧𣗳爁𤦺矗𣘚𣜖纇𠍆墵朎"],["9ba1","椘𣪧𧙗𥿢𣸑𣺹𧗾𢂚䣐䪸𤄙𨪚𤋮𤌍𤀻𤌴𤎖𤩅𠗊凒𠘑妟𡺨㮾𣳿𤐄𤓖垈𤙴㦛𤜯𨗨𩧉㝢𢇃譞𨭎駖𤠒𤣻𤨕爉𤫀𠱸奥𤺥𤾆𠝹軚𥀬劏圿煱𥊙𥐙𣽊𤪧喼𥑆𥑮𦭒釔㑳𥔿𧘲𥕞䜘𥕢𥕦𥟇𤤿𥡝偦㓻𣏌惞𥤃䝼𨥈𥪮𥮉𥰆𡶐垡煑澶𦄂𧰒遖𦆲𤾚譢𦐂𦑊"],["9c40","嵛𦯷輶𦒄𡤜諪𤧶𦒈𣿯𦔒䯀𦖿𦚵𢜛鑥𥟡憕娧晉侻嚹𤔡𦛼乪𤤴陖涏𦲽㘘襷𦞙𦡮𦐑𦡞營𦣇筂𩃀𠨑𦤦鄄𦤹穅鷰𦧺騦𦨭㙟𦑩𠀡禃𦨴𦭛崬𣔙菏𦮝䛐𦲤画补𦶮墶"],["9ca1","㜜𢖍𧁋𧇍㱔𧊀𧊅銁𢅺𧊋錰𧋦𤧐氹钟𧑐𠻸蠧裵𢤦𨑳𡞱溸𤨪𡠠㦤㚹尐秣䔿暶𩲭𩢤襃𧟌𧡘囖䃟𡘊㦡𣜯𨃨𡏅熭荦𧧝𩆨婧䲷𧂯𨦫𧧽𧨊𧬋𧵦𤅺筃祾𨀉澵𪋟樃𨌘厢𦸇鎿栶靝𨅯𨀣𦦵𡏭𣈯𨁈嶅𨰰𨂃圕頣𨥉嶫𤦈斾槕叒𤪥𣾁㰑朶𨂐𨃴𨄮𡾡𨅏"],["9d40","𨆉𨆯𨈚𨌆𨌯𨎊㗊𨑨𨚪䣺揦𨥖砈鉕𨦸䏲𨧧䏟𨧨𨭆𨯔姸𨰉輋𨿅𩃬筑𩄐𩄼㷷𩅞𤫊运犏嚋𩓧𩗩𩖰𩖸𩜲𩣑𩥉𩥪𩧃𩨨𩬎𩵚𩶛纟𩻸𩼣䲤镇𪊓熢𪋿䶑递𪗋䶜𠲜达嗁"],["9da1","辺𢒰边𤪓䔉繿潖檱仪㓤𨬬𧢝㜺躀𡟵𨀤𨭬𨮙𧨾𦚯㷫𧙕𣲷𥘵𥥖亚𥺁𦉘嚿𠹭踎孭𣺈𤲞揞拐𡟶𡡻攰嘭𥱊吚𥌑㷆𩶘䱽嘢嘞罉𥻘奵𣵀蝰东𠿪𠵉𣚺脗鵞贘瘻鱅癎瞹鍅吲腈苷嘥脲萘肽嗪祢噃吖𠺝㗎嘅嗱曱𨋢㘭甴嗰喺咗啲𠱁𠲖廐𥅈𠹶𢱢"],["9e40","𠺢麫絚嗞𡁵抝靭咔賍燶酶揼掹揾啩𢭃鱲𢺳冚㓟𠶧冧呍唞唓癦踭𦢊疱肶蠄螆裇膶萜𡃁䓬猄𤜆宐茋𦢓噻𢛴𧴯𤆣𧵳𦻐𧊶酰𡇙鈈𣳼𪚩𠺬𠻹牦𡲢䝎𤿂𧿹𠿫䃺"],["9ea1","鱝攟𢶠䣳𤟠𩵼𠿬𠸊恢𧖣𠿭"],["9ead","𦁈𡆇熣纎鵐业丄㕷嬍沲卧㚬㧜卽㚥𤘘墚𤭮舭呋垪𥪕𠥹"],["9ec5","㩒𢑥獴𩺬䴉鯭𣳾𩼰䱛𤾩𩖞𩿞葜𣶶𧊲𦞳𣜠挮紥𣻷𣸬㨪逈勌㹴㙺䗩𠒎癀嫰𠺶硺𧼮墧䂿噼鮋嵴癔𪐴麅䳡痹㟻愙𣃚𤏲"],["9ef5","噝𡊩垧𤥣𩸆刴𧂮㖭汊鵼"],["9f40","籖鬹埞𡝬屓擓𩓐𦌵𧅤蚭𠴨𦴢𤫢𠵱"],["9f4f","凾𡼏嶎霃𡷑麁遌笟鬂峑箣扨挵髿篏鬪籾鬮籂粆鰕篼鬉鼗鰛𤤾齚啳寃俽麘俲剠㸆勑坧偖妷帒韈鶫轜呩鞴饀鞺匬愰"],["9fa1","椬叚鰊鴂䰻陁榀傦畆𡝭駚剳"],["9fae","酙隁酜"],["9fb2","酑𨺗捿𦴣櫊嘑醎畺抅𠏼獏籰𥰡𣳽"],["9fc1","𤤙盖鮝个𠳔莾衂"],["9fc9","届槀僭坺刟巵从氱𠇲伹咜哚劚趂㗾弌㗳"],["9fdb","歒酼龥鮗頮颴骺麨麄煺笔"],["9fe7","毺蠘罸"],["9feb","嘠𪙊蹷齓"],["9ff0","跔蹏鸜踁抂𨍽踨蹵竓𤩷稾磘泪詧瘇"],["a040","𨩚鼦泎蟖痃𪊲硓咢贌狢獱謭猂瓱賫𤪻蘯徺袠䒷"],["a055","𡠻𦸅"],["a058","詾𢔛"],["a05b","惽癧髗鵄鍮鮏蟵"],["a063","蠏賷猬霡鮰㗖犲䰇籑饊𦅙慙䰄麖慽"],["a073","坟慯抦戹拎㩜懢厪𣏵捤栂㗒"],["a0a1","嵗𨯂迚𨸹"],["a0a6","僙𡵆礆匲阸𠼻䁥"],["a0ae","矾"],["a0b0","糂𥼚糚稭聦聣絍甅瓲覔舚朌聢𧒆聛瓰脃眤覉𦟌畓𦻑螩蟎臈螌詉貭譃眫瓸蓚㘵榲趦"],["a0d4","覩瑨涹蟁𤀑瓧㷛煶悤憜㳑煢恷"],["a0e2","罱𨬭牐惩䭾删㰘𣳇𥻗𧙖𥔱𡥄𡋾𩤃𦷜𧂭峁𦆭𨨏𣙷𠃮𦡆𤼎䕢嬟𦍌齐麦𦉫"],["a3c0","␀",31,"␡"],["c6a1","①",9,"⑴",9,"ⅰ",9,"丶丿亅亠冂冖冫勹匸卩厶夊宀巛⼳广廴彐彡攴无疒癶辵隶¨ˆヽヾゝゞ〃仝々〆〇ー［］✽ぁ",23],["c740","す",58,"ァアィイ"],["c7a1","ゥ",81,"А",5,"ЁЖ",4],["c840","Л",26,"ёж",25,"⇧↸↹㇏𠃌乚𠂊刂䒑"],["c8a1","龰冈龱𧘇"],["c8cd","￢￤＇＂㈱№℡゛゜⺀⺄⺆⺇⺈⺊⺌⺍⺕⺜⺝⺥⺧⺪⺬⺮⺶⺼⺾⻆⻊⻌⻍⻏⻖⻗⻞⻣"],["c8f5","ʃɐɛɔɵœøŋʊɪ"],["f9fe","￭"],["fa40","𠕇鋛𠗟𣿅蕌䊵珯况㙉𤥂𨧤鍄𡧛苮𣳈砼杄拟𤤳𨦪𠊠𦮳𡌅侫𢓭倈𦴩𧪄𣘀𤪱𢔓倩𠍾徤𠎀𠍇滛𠐟偽儁㑺儎顬㝃萖𤦤𠒇兠𣎴兪𠯿𢃼𠋥𢔰𠖎𣈳𡦃宂蝽𠖳𣲙冲冸"],["faa1","鴴凉减凑㳜凓𤪦决凢卂凭菍椾𣜭彻刋刦刼劵剗劔効勅簕蕂勠蘍𦬓包𨫞啉滙𣾀𠥔𣿬匳卄𠯢泋𡜦栛珕恊㺪㣌𡛨燝䒢卭却𨚫卾卿𡖖𡘓矦厓𨪛厠厫厮玧𥝲㽙玜叁叅汉义埾叙㪫𠮏叠𣿫𢶣叶𠱷吓灹唫晗浛呭𦭓𠵴啝咏咤䞦𡜍𠻝㶴𠵍"],["fb40","𨦼𢚘啇䳭启琗喆喩嘅𡣗𤀺䕒𤐵暳𡂴嘷曍𣊊暤暭噍噏磱囱鞇叾圀囯园𨭦㘣𡉏坆𤆥汮炋坂㚱𦱾埦𡐖堃𡑔𤍣堦𤯵塜墪㕡壠壜𡈼壻寿坃𪅐𤉸鏓㖡够梦㛃湙"],["fba1","𡘾娤啓𡚒蔅姉𠵎𦲁𦴪𡟜姙𡟻𡞲𦶦浱𡠨𡛕姹𦹅媫婣㛦𤦩婷㜈媖瑥嫓𦾡𢕔㶅𡤑㜲𡚸広勐孶斈孼𧨎䀄䡝𠈄寕慠𡨴𥧌𠖥寳宝䴐尅𡭄尓珎尔𡲥𦬨屉䣝岅峩峯嶋𡷹𡸷崐崘嵆𡺤岺巗苼㠭𤤁𢁉𢅳芇㠶㯂帮檊幵幺𤒼𠳓厦亷廐厨𡝱帉廴𨒂"],["fc40","廹廻㢠廼栾鐛弍𠇁弢㫞䢮𡌺强𦢈𢏐彘𢑱彣鞽𦹮彲鍀𨨶徧嶶㵟𥉐𡽪𧃸𢙨釖𠊞𨨩怱暅𡡷㥣㷇㘹垐𢞴祱㹀悞悤悳𤦂𤦏𧩓璤僡媠慤萤慂慈𦻒憁凴𠙖憇宪𣾷"],["fca1","𢡟懓𨮝𩥝懐㤲𢦀𢣁怣慜攞掋𠄘担𡝰拕𢸍捬𤧟㨗搸揸𡎎𡟼撐澊𢸶頔𤂌𥜝擡擥鑻㩦携㩗敍漖𤨨𤨣斅敭敟𣁾斵𤥀䬷旑䃘𡠩无旣忟𣐀昘𣇷𣇸晄𣆤𣆥晋𠹵晧𥇦晳晴𡸽𣈱𨗴𣇈𥌓矅𢣷馤朂𤎜𤨡㬫槺𣟂杞杧杢𤇍𩃭柗䓩栢湐鈼栁𣏦𦶠桝"],["fd40","𣑯槡樋𨫟楳棃𣗍椁椀㴲㨁𣘼㮀枬楡𨩊䋼椶榘㮡𠏉荣傐槹𣙙𢄪橅𣜃檝㯳枱櫈𩆜㰍欝𠤣惞欵歴𢟍溵𣫛𠎵𡥘㝀吡𣭚毡𣻼毜氷𢒋𤣱𦭑汚舦汹𣶼䓅𣶽𤆤𤤌𤤀"],["fda1","𣳉㛥㳫𠴲鮃𣇹𢒑羏样𦴥𦶡𦷫涖浜湼漄𤥿𤂅𦹲蔳𦽴凇沜渝萮𨬡港𣸯瑓𣾂秌湏媑𣁋濸㜍澝𣸰滺𡒗𤀽䕕鏰潄潜㵎潴𩅰㴻澟𤅄濓𤂑𤅕𤀹𣿰𣾴𤄿凟𤅖𤅗𤅀𦇝灋灾炧炁烌烕烖烟䄄㷨熴熖𤉷焫煅媈煊煮岜𤍥煏鍢𤋁焬𤑚𤨧𤨢熺𨯨炽爎"],["fe40","鑂爕夑鑃爤鍁𥘅爮牀𤥴梽牕牗㹕𣁄栍漽犂猪猫𤠣𨠫䣭𨠄猨献珏玪𠰺𦨮珉瑉𤇢𡛧𤨤昣㛅𤦷𤦍𤧻珷琕椃𤨦琹𠗃㻗瑜𢢭瑠𨺲瑇珤瑶莹瑬㜰瑴鏱樬璂䥓𤪌"],["fea1","𤅟𤩹𨮏孆𨰃𡢞瓈𡦈甎瓩甞𨻙𡩋寗𨺬鎅畍畊畧畮𤾂㼄𤴓疎瑝疞疴瘂瘬癑癏癯癶𦏵皐臯㟸𦤑𦤎皡皥皷盌𦾟葢𥂝𥅽𡸜眞眦着撯𥈠睘𣊬瞯𨥤𨥨𡛁矴砉𡍶𤨒棊碯磇磓隥礮𥗠磗礴碱𧘌辸袄𨬫𦂃𢘜禆褀椂禀𥡗禝𧬹礼禩渪𧄦㺨秆𩄍秔"]]

/***/ }),
/* 45 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var Transform = __webpack_require__(1).Transform;


// == Exports ==================================================================
module.exports = function(iconv) {
    
    // Additional Public API.
    iconv.encodeStream = function encodeStream(encoding, options) {
        return new IconvLiteEncoderStream(iconv.getEncoder(encoding, options), options);
    }

    iconv.decodeStream = function decodeStream(encoding, options) {
        return new IconvLiteDecoderStream(iconv.getDecoder(encoding, options), options);
    }

    iconv.supportsStreams = true;


    // Not published yet.
    iconv.IconvLiteEncoderStream = IconvLiteEncoderStream;
    iconv.IconvLiteDecoderStream = IconvLiteDecoderStream;
    iconv._collect = IconvLiteDecoderStream.prototype.collect;
};


// == Encoder stream =======================================================
function IconvLiteEncoderStream(conv, options) {
    this.conv = conv;
    options = options || {};
    options.decodeStrings = false; // We accept only strings, so we don't need to decode them.
    Transform.call(this, options);
}

IconvLiteEncoderStream.prototype = Object.create(Transform.prototype, {
    constructor: { value: IconvLiteEncoderStream }
});

IconvLiteEncoderStream.prototype._transform = function(chunk, encoding, done) {
    if (typeof chunk != 'string')
        return done(new Error("Iconv encoding stream needs strings as its input."));
    try {
        var res = this.conv.write(chunk);
        if (res && res.length) this.push(res);
        done();
    }
    catch (e) {
        done(e);
    }
}

IconvLiteEncoderStream.prototype._flush = function(done) {
    try {
        var res = this.conv.end();
        if (res && res.length) this.push(res);
        done();
    }
    catch (e) {
        done(e);
    }
}

IconvLiteEncoderStream.prototype.collect = function(cb) {
    var chunks = [];
    this.on('error', cb);
    this.on('data', function(chunk) { chunks.push(chunk); });
    this.on('end', function() {
        cb(null, Buffer.concat(chunks));
    });
    return this;
}


// == Decoder stream =======================================================
function IconvLiteDecoderStream(conv, options) {
    this.conv = conv;
    options = options || {};
    options.encoding = this.encoding = 'utf8'; // We output strings.
    Transform.call(this, options);
}

IconvLiteDecoderStream.prototype = Object.create(Transform.prototype, {
    constructor: { value: IconvLiteDecoderStream }
});

IconvLiteDecoderStream.prototype._transform = function(chunk, encoding, done) {
    if (!Buffer.isBuffer(chunk))
        return done(new Error("Iconv decoding stream needs buffers as its input."));
    try {
        var res = this.conv.write(chunk);
        if (res && res.length) this.push(res, this.encoding);
        done();
    }
    catch (e) {
        done(e);
    }
}

IconvLiteDecoderStream.prototype._flush = function(done) {
    try {
        var res = this.conv.end();
        if (res && res.length) this.push(res, this.encoding);                
        done();
    }
    catch (e) {
        done(e);
    }
}

IconvLiteDecoderStream.prototype.collect = function(cb) {
    var res = '';
    this.on('error', cb);
    this.on('data', function(chunk) { res += chunk; });
    this.on('end', function() {
        cb(null, res);
    });
    return this;
}



/***/ }),
/* 46 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// == Extend Node primitives to use iconv-lite =================================

module.exports = function (iconv) {
    var original = undefined; // Place to keep original methods.

    // Node authors rewrote Buffer internals to make it compatible with
    // Uint8Array and we cannot patch key functions since then.
    iconv.supportsNodeEncodingsExtension = !(new Buffer(0) instanceof Uint8Array);

    iconv.extendNodeEncodings = function extendNodeEncodings() {
        if (original) return;
        original = {};

        if (!iconv.supportsNodeEncodingsExtension) {
            console.error("ACTION NEEDED: require('iconv-lite').extendNodeEncodings() is not supported in your version of Node");
            console.error("See more info at https://github.com/ashtuchkin/iconv-lite/wiki/Node-v4-compatibility");
            return;
        }

        var nodeNativeEncodings = {
            'hex': true, 'utf8': true, 'utf-8': true, 'ascii': true, 'binary': true, 
            'base64': true, 'ucs2': true, 'ucs-2': true, 'utf16le': true, 'utf-16le': true,
        };

        Buffer.isNativeEncoding = function(enc) {
            return enc && nodeNativeEncodings[enc.toLowerCase()];
        }

        // -- SlowBuffer -----------------------------------------------------------
        var SlowBuffer = __webpack_require__(9).SlowBuffer;

        original.SlowBufferToString = SlowBuffer.prototype.toString;
        SlowBuffer.prototype.toString = function(encoding, start, end) {
            encoding = String(encoding || 'utf8').toLowerCase();

            // Use native conversion when possible
            if (Buffer.isNativeEncoding(encoding))
                return original.SlowBufferToString.call(this, encoding, start, end);

            // Otherwise, use our decoding method.
            if (typeof start == 'undefined') start = 0;
            if (typeof end == 'undefined') end = this.length;
            return iconv.decode(this.slice(start, end), encoding);
        }

        original.SlowBufferWrite = SlowBuffer.prototype.write;
        SlowBuffer.prototype.write = function(string, offset, length, encoding) {
            // Support both (string, offset, length, encoding)
            // and the legacy (string, encoding, offset, length)
            if (isFinite(offset)) {
                if (!isFinite(length)) {
                    encoding = length;
                    length = undefined;
                }
            } else {  // legacy
                var swap = encoding;
                encoding = offset;
                offset = length;
                length = swap;
            }

            offset = +offset || 0;
            var remaining = this.length - offset;
            if (!length) {
                length = remaining;
            } else {
                length = +length;
                if (length > remaining) {
                    length = remaining;
                }
            }
            encoding = String(encoding || 'utf8').toLowerCase();

            // Use native conversion when possible
            if (Buffer.isNativeEncoding(encoding))
                return original.SlowBufferWrite.call(this, string, offset, length, encoding);

            if (string.length > 0 && (length < 0 || offset < 0))
                throw new RangeError('attempt to write beyond buffer bounds');

            // Otherwise, use our encoding method.
            var buf = iconv.encode(string, encoding);
            if (buf.length < length) length = buf.length;
            buf.copy(this, offset, 0, length);
            return length;
        }

        // -- Buffer ---------------------------------------------------------------

        original.BufferIsEncoding = Buffer.isEncoding;
        Buffer.isEncoding = function(encoding) {
            return Buffer.isNativeEncoding(encoding) || iconv.encodingExists(encoding);
        }

        original.BufferByteLength = Buffer.byteLength;
        Buffer.byteLength = SlowBuffer.byteLength = function(str, encoding) {
            encoding = String(encoding || 'utf8').toLowerCase();

            // Use native conversion when possible
            if (Buffer.isNativeEncoding(encoding))
                return original.BufferByteLength.call(this, str, encoding);

            // Slow, I know, but we don't have a better way yet.
            return iconv.encode(str, encoding).length;
        }

        original.BufferToString = Buffer.prototype.toString;
        Buffer.prototype.toString = function(encoding, start, end) {
            encoding = String(encoding || 'utf8').toLowerCase();

            // Use native conversion when possible
            if (Buffer.isNativeEncoding(encoding))
                return original.BufferToString.call(this, encoding, start, end);

            // Otherwise, use our decoding method.
            if (typeof start == 'undefined') start = 0;
            if (typeof end == 'undefined') end = this.length;
            return iconv.decode(this.slice(start, end), encoding);
        }

        original.BufferWrite = Buffer.prototype.write;
        Buffer.prototype.write = function(string, offset, length, encoding) {
            var _offset = offset, _length = length, _encoding = encoding;
            // Support both (string, offset, length, encoding)
            // and the legacy (string, encoding, offset, length)
            if (isFinite(offset)) {
                if (!isFinite(length)) {
                    encoding = length;
                    length = undefined;
                }
            } else {  // legacy
                var swap = encoding;
                encoding = offset;
                offset = length;
                length = swap;
            }

            encoding = String(encoding || 'utf8').toLowerCase();

            // Use native conversion when possible
            if (Buffer.isNativeEncoding(encoding))
                return original.BufferWrite.call(this, string, _offset, _length, _encoding);

            offset = +offset || 0;
            var remaining = this.length - offset;
            if (!length) {
                length = remaining;
            } else {
                length = +length;
                if (length > remaining) {
                    length = remaining;
                }
            }

            if (string.length > 0 && (length < 0 || offset < 0))
                throw new RangeError('attempt to write beyond buffer bounds');

            // Otherwise, use our encoding method.
            var buf = iconv.encode(string, encoding);
            if (buf.length < length) length = buf.length;
            buf.copy(this, offset, 0, length);
            return length;

            // TODO: Set _charsWritten.
        }


        // -- Readable -------------------------------------------------------------
        if (iconv.supportsStreams) {
            var Readable = __webpack_require__(1).Readable;

            original.ReadableSetEncoding = Readable.prototype.setEncoding;
            Readable.prototype.setEncoding = function setEncoding(enc, options) {
                // Use our own decoder, it has the same interface.
                // We cannot use original function as it doesn't handle BOM-s.
                this._readableState.decoder = iconv.getDecoder(enc, options);
                this._readableState.encoding = enc;
            }

            Readable.prototype.collect = iconv._collect;
        }
    }

    // Remove iconv-lite Node primitive extensions.
    iconv.undoExtendNodeEncodings = function undoExtendNodeEncodings() {
        if (!iconv.supportsNodeEncodingsExtension)
            return;
        if (!original)
            throw new Error("require('iconv-lite').undoExtendNodeEncodings(): Nothing to undo; extendNodeEncodings() is not called.")

        delete Buffer.isNativeEncoding;

        var SlowBuffer = __webpack_require__(9).SlowBuffer;

        SlowBuffer.prototype.toString = original.SlowBufferToString;
        SlowBuffer.prototype.write = original.SlowBufferWrite;

        Buffer.isEncoding = original.BufferIsEncoding;
        Buffer.byteLength = original.BufferByteLength;
        Buffer.prototype.toString = original.BufferToString;
        Buffer.prototype.write = original.BufferWrite;

        if (iconv.supportsStreams) {
            var Readable = __webpack_require__(1).Readable;

            Readable.prototype.setEncoding = original.ReadableSetEncoding;
            delete Readable.prototype.collect;
        }

        original = undefined;
    }
}


/***/ }),
/* 47 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* eslint quote-props: 0 */



module.exports = {
    list: {
        'application/acad': 'dwg',
        'application/applixware': 'aw',
        'application/arj': 'arj',
        'application/atom+xml': 'xml',
        'application/atomcat+xml': 'atomcat',
        'application/atomsvc+xml': 'atomsvc',
        'application/base64': ['mm', 'mme'],
        'application/binhex': 'hqx',
        'application/binhex4': 'hqx',
        'application/book': ['book', 'boo'],
        'application/ccxml+xml,': 'ccxml',
        'application/cdf': 'cdf',
        'application/cdmi-capability': 'cdmia',
        'application/cdmi-container': 'cdmic',
        'application/cdmi-domain': 'cdmid',
        'application/cdmi-object': 'cdmio',
        'application/cdmi-queue': 'cdmiq',
        'application/clariscad': 'ccad',
        'application/commonground': 'dp',
        'application/cu-seeme': 'cu',
        'application/davmount+xml': 'davmount',
        'application/drafting': 'drw',
        'application/dsptype': 'tsp',
        'application/dssc+der': 'dssc',
        'application/dssc+xml': 'xdssc',
        'application/dxf': 'dxf',
        'application/ecmascript': ['js', 'es'],
        'application/emma+xml': 'emma',
        'application/envoy': 'evy',
        'application/epub+zip': 'epub',
        'application/excel': ['xls', 'xl', 'xla', 'xlb', 'xlc', 'xld', 'xlk', 'xll', 'xlm', 'xlt', 'xlv', 'xlw'],
        'application/exi': 'exi',
        'application/font-tdpfr': 'pfr',
        'application/fractals': 'fif',
        'application/freeloader': 'frl',
        'application/futuresplash': 'spl',
        'application/gnutar': 'tgz',
        'application/groupwise': 'vew',
        'application/hlp': 'hlp',
        'application/hta': 'hta',
        'application/hyperstudio': 'stk',
        'application/i-deas': 'unv',
        'application/iges': ['iges', 'igs'],
        'application/inf': 'inf',
        'application/internet-property-stream': 'acx',
        'application/ipfix': 'ipfix',
        'application/java': 'class',
        'application/java-archive': 'jar',
        'application/java-byte-code': 'class',
        'application/java-serialized-object': 'ser',
        'application/java-vm': 'class',
        'application/javascript': 'js',
        'application/json': 'json',
        'application/lha': 'lha',
        'application/lzx': 'lzx',
        'application/mac-binary': 'bin',
        'application/mac-binhex': 'hqx',
        'application/mac-binhex40': 'hqx',
        'application/mac-compactpro': 'cpt',
        'application/macbinary': 'bin',
        'application/mads+xml': 'mads',
        'application/marc': 'mrc',
        'application/marcxml+xml': 'mrcx',
        'application/mathematica': 'ma',
        'application/mathml+xml': 'mathml',
        'application/mbedlet': 'mbd',
        'application/mbox': 'mbox',
        'application/mcad': 'mcd',
        'application/mediaservercontrol+xml': 'mscml',
        'application/metalink4+xml': 'meta4',
        'application/mets+xml': 'mets',
        'application/mime': 'aps',
        'application/mods+xml': 'mods',
        'application/mp21': 'm21',
        'application/mp4': 'mp4',
        'application/mspowerpoint': ['ppt', 'pot', 'pps', 'ppz'],
        'application/msword': ['doc', 'dot', 'w6w', 'wiz', 'word'],
        'application/mswrite': 'wri',
        'application/mxf': 'mxf',
        'application/netmc': 'mcp',
        'application/octet-stream': ['*'],
        'application/oda': 'oda',
        'application/oebps-package+xml': 'opf',
        'application/ogg': 'ogx',
        'application/olescript': 'axs',
        'application/onenote': 'onetoc',
        'application/patch-ops-error+xml': 'xer',
        'application/pdf': 'pdf',
        'application/pgp-encrypted': 'asc',
        'application/pgp-signature': 'pgp',
        'application/pics-rules': 'prf',
        'application/pkcs-12': 'p12',
        'application/pkcs-crl': 'crl',
        'application/pkcs10': 'p10',
        'application/pkcs7-mime': ['p7c', 'p7m'],
        'application/pkcs7-signature': 'p7s',
        'application/pkcs8': 'p8',
        'application/pkix-attr-cert': 'ac',
        'application/pkix-cert': ['cer', 'crt'],
        'application/pkix-crl': 'crl',
        'application/pkix-pkipath': 'pkipath',
        'application/pkixcmp': 'pki',
        'application/plain': 'text',
        'application/pls+xml': 'pls',
        'application/postscript': ['ps', 'ai', 'eps'],
        'application/powerpoint': 'ppt',
        'application/pro_eng': ['part', 'prt'],
        'application/prs.cww': 'cww',
        'application/pskc+xml': 'pskcxml',
        'application/rdf+xml': 'rdf',
        'application/reginfo+xml': 'rif',
        'application/relax-ng-compact-syntax': 'rnc',
        'application/resource-lists+xml': 'rl',
        'application/resource-lists-diff+xml': 'rld',
        'application/ringing-tones': 'rng',
        'application/rls-services+xml': 'rs',
        'application/rsd+xml': 'rsd',
        'application/rss+xml': 'xml',
        'application/rtf': ['rtf', 'rtx'],
        'application/sbml+xml': 'sbml',
        'application/scvp-cv-request': 'scq',
        'application/scvp-cv-response': 'scs',
        'application/scvp-vp-request': 'spq',
        'application/scvp-vp-response': 'spp',
        'application/sdp': 'sdp',
        'application/sea': 'sea',
        'application/set': 'set',
        'application/set-payment-initiation': 'setpay',
        'application/set-registration-initiation': 'setreg',
        'application/shf+xml': 'shf',
        'application/sla': 'stl',
        'application/smil': ['smi', 'smil'],
        'application/smil+xml': 'smi',
        'application/solids': 'sol',
        'application/sounder': 'sdr',
        'application/sparql-query': 'rq',
        'application/sparql-results+xml': 'srx',
        'application/srgs': 'gram',
        'application/srgs+xml': 'grxml',
        'application/sru+xml': 'sru',
        'application/ssml+xml': 'ssml',
        'application/step': ['step', 'stp'],
        'application/streamingmedia': 'ssm',
        'application/tei+xml': 'tei',
        'application/thraud+xml': 'tfi',
        'application/timestamped-data': 'tsd',
        'application/toolbook': 'tbk',
        'application/vda': 'vda',
        'application/vnd.3gpp.pic-bw-large': 'plb',
        'application/vnd.3gpp.pic-bw-small': 'psb',
        'application/vnd.3gpp.pic-bw-var': 'pvb',
        'application/vnd.3gpp2.tcap': 'tcap',
        'application/vnd.3m.post-it-notes': 'pwn',
        'application/vnd.accpac.simply.aso': 'aso',
        'application/vnd.accpac.simply.imp': 'imp',
        'application/vnd.acucobol': 'acu',
        'application/vnd.acucorp': 'atc',
        'application/vnd.adobe.air-application-installer-package+zip': 'air',
        'application/vnd.adobe.fxp': 'fxp',
        'application/vnd.adobe.xdp+xml': 'xdp',
        'application/vnd.adobe.xfdf': 'xfdf',
        'application/vnd.ahead.space': 'ahead',
        'application/vnd.airzip.filesecure.azf': 'azf',
        'application/vnd.airzip.filesecure.azs': 'azs',
        'application/vnd.amazon.ebook': 'azw',
        'application/vnd.americandynamics.acc': 'acc',
        'application/vnd.amiga.ami': 'ami',
        'application/vnd.android.package-archive': 'apk',
        'application/vnd.anser-web-certificate-issue-initiation': 'cii',
        'application/vnd.anser-web-funds-transfer-initiation': 'fti',
        'application/vnd.antix.game-component': 'atx',
        'application/vnd.apple.installer+xml': 'mpkg',
        'application/vnd.apple.mpegurl': 'm3u8',
        'application/vnd.aristanetworks.swi': 'swi',
        'application/vnd.audiograph': 'aep',
        'application/vnd.blueice.multipass': 'mpm',
        'application/vnd.bmi': 'bmi',
        'application/vnd.businessobjects': 'rep',
        'application/vnd.chemdraw+xml': 'cdxml',
        'application/vnd.chipnuts.karaoke-mmd': 'mmd',
        'application/vnd.cinderella': 'cdy',
        'application/vnd.claymore': 'cla',
        'application/vnd.cloanto.rp9': 'rp9',
        'application/vnd.clonk.c4group': 'c4g',
        'application/vnd.cluetrust.cartomobile-config': 'c11amc',
        'application/vnd.cluetrust.cartomobile-config-pkg': 'c11amz',
        'application/vnd.commonspace': 'csp',
        'application/vnd.contact.cmsg': 'cdbcmsg',
        'application/vnd.cosmocaller': 'cmc',
        'application/vnd.crick.clicker': 'clkx',
        'application/vnd.crick.clicker.keyboard': 'clkk',
        'application/vnd.crick.clicker.palette': 'clkp',
        'application/vnd.crick.clicker.template': 'clkt',
        'application/vnd.crick.clicker.wordbank': 'clkw',
        'application/vnd.criticaltools.wbs+xml': 'wbs',
        'application/vnd.ctc-posml': 'pml',
        'application/vnd.cups-ppd': 'ppd',
        'application/vnd.curl.car': 'car',
        'application/vnd.curl.pcurl': 'pcurl',
        'application/vnd.data-vision.rdz': 'rdz',
        'application/vnd.denovo.fcselayout-link': 'fe_launch',
        'application/vnd.dna': 'dna',
        'application/vnd.dolby.mlp': 'mlp',
        'application/vnd.dpgraph': 'dpg',
        'application/vnd.dreamfactory': 'dfac',
        'application/vnd.dvb.ait': 'ait',
        'application/vnd.dvb.service': 'svc',
        'application/vnd.dynageo': 'geo',
        'application/vnd.ecowin.chart': 'mag',
        'application/vnd.enliven': 'nml',
        'application/vnd.epson.esf': 'esf',
        'application/vnd.epson.msf': 'msf',
        'application/vnd.epson.quickanime': 'qam',
        'application/vnd.epson.salt': 'slt',
        'application/vnd.epson.ssf': 'ssf',
        'application/vnd.eszigno3+xml': 'es3',
        'application/vnd.ezpix-album': 'ez2',
        'application/vnd.ezpix-package': 'ez3',
        'application/vnd.fdf': 'fdf',
        'application/vnd.fdsn.seed': 'seed',
        'application/vnd.flographit': 'gph',
        'application/vnd.fluxtime.clip': 'ftc',
        'application/vnd.framemaker': 'fm',
        'application/vnd.frogans.fnc': 'fnc',
        'application/vnd.frogans.ltf': 'ltf',
        'application/vnd.fsc.weblaunch': 'fsc',
        'application/vnd.fujitsu.oasys': 'oas',
        'application/vnd.fujitsu.oasys2': 'oa2',
        'application/vnd.fujitsu.oasys3': 'oa3',
        'application/vnd.fujitsu.oasysgp': 'fg5',
        'application/vnd.fujitsu.oasysprs': 'bh2',
        'application/vnd.fujixerox.ddd': 'ddd',
        'application/vnd.fujixerox.docuworks': 'xdw',
        'application/vnd.fujixerox.docuworks.binder': 'xbd',
        'application/vnd.fuzzysheet': 'fzs',
        'application/vnd.genomatix.tuxedo': 'txd',
        'application/vnd.geogebra.file': 'ggb',
        'application/vnd.geogebra.tool': 'ggt',
        'application/vnd.geometry-explorer': 'gex',
        'application/vnd.geonext': 'gxt',
        'application/vnd.geoplan': 'g2w',
        'application/vnd.geospace': 'g3w',
        'application/vnd.gmx': 'gmx',
        'application/vnd.google-earth.kml+xml': 'kml',
        'application/vnd.google-earth.kmz': 'kmz',
        'application/vnd.grafeq': 'gqf',
        'application/vnd.groove-account': 'gac',
        'application/vnd.groove-help': 'ghf',
        'application/vnd.groove-identity-message': 'gim',
        'application/vnd.groove-injector': 'grv',
        'application/vnd.groove-tool-message': 'gtm',
        'application/vnd.groove-tool-template': 'tpl',
        'application/vnd.groove-vcard': 'vcg',
        'application/vnd.hal+xml': 'hal',
        'application/vnd.handheld-entertainment+xml': 'zmm',
        'application/vnd.hbci': 'hbci',
        'application/vnd.hhe.lesson-player': 'les',
        'application/vnd.hp-hpgl': ['hgl', 'hpg', 'hpgl'],
        'application/vnd.hp-hpid': 'hpid',
        'application/vnd.hp-hps': 'hps',
        'application/vnd.hp-jlyt': 'jlt',
        'application/vnd.hp-pcl': 'pcl',
        'application/vnd.hp-pclxl': 'pclxl',
        'application/vnd.hydrostatix.sof-data': 'sfd-hdstx',
        'application/vnd.hzn-3d-crossword': 'x3d',
        'application/vnd.ibm.minipay': 'mpy',
        'application/vnd.ibm.modcap': 'afp',
        'application/vnd.ibm.rights-management': 'irm',
        'application/vnd.ibm.secure-container': 'sc',
        'application/vnd.iccprofile': 'icc',
        'application/vnd.igloader': 'igl',
        'application/vnd.immervision-ivp': 'ivp',
        'application/vnd.immervision-ivu': 'ivu',
        'application/vnd.insors.igm': 'igm',
        'application/vnd.intercon.formnet': 'xpw',
        'application/vnd.intergeo': 'i2g',
        'application/vnd.intu.qbo': 'qbo',
        'application/vnd.intu.qfx': 'qfx',
        'application/vnd.ipunplugged.rcprofile': 'rcprofile',
        'application/vnd.irepository.package+xml': 'irp',
        'application/vnd.is-xpr': 'xpr',
        'application/vnd.isac.fcs': 'fcs',
        'application/vnd.jam': 'jam',
        'application/vnd.jcp.javame.midlet-rms': 'rms',
        'application/vnd.jisp': 'jisp',
        'application/vnd.joost.joda-archive': 'joda',
        'application/vnd.kahootz': 'ktz',
        'application/vnd.kde.karbon': 'karbon',
        'application/vnd.kde.kchart': 'chrt',
        'application/vnd.kde.kformula': 'kfo',
        'application/vnd.kde.kivio': 'flw',
        'application/vnd.kde.kontour': 'kon',
        'application/vnd.kde.kpresenter': 'kpr',
        'application/vnd.kde.kspread': 'ksp',
        'application/vnd.kde.kword': 'kwd',
        'application/vnd.kenameaapp': 'htke',
        'application/vnd.kidspiration': 'kia',
        'application/vnd.kinar': 'kne',
        'application/vnd.koan': 'skp',
        'application/vnd.kodak-descriptor': 'sse',
        'application/vnd.las.las+xml': 'lasxml',
        'application/vnd.llamagraphics.life-balance.desktop': 'lbd',
        'application/vnd.llamagraphics.life-balance.exchange+xml': 'lbe',
        'application/vnd.lotus-1-2-3': '123',
        'application/vnd.lotus-approach': 'apr',
        'application/vnd.lotus-freelance': 'pre',
        'application/vnd.lotus-notes': 'nsf',
        'application/vnd.lotus-organizer': 'org',
        'application/vnd.lotus-screencam': 'scm',
        'application/vnd.lotus-wordpro': 'lwp',
        'application/vnd.macports.portpkg': 'portpkg',
        'application/vnd.mcd': 'mcd',
        'application/vnd.medcalcdata': 'mc1',
        'application/vnd.mediastation.cdkey': 'cdkey',
        'application/vnd.mfer': 'mwf',
        'application/vnd.mfmp': 'mfm',
        'application/vnd.micrografx.flo': 'flo',
        'application/vnd.micrografx.igx': 'igx',
        'application/vnd.mif': 'mif',
        'application/vnd.mobius.daf': 'daf',
        'application/vnd.mobius.dis': 'dis',
        'application/vnd.mobius.mbk': 'mbk',
        'application/vnd.mobius.mqy': 'mqy',
        'application/vnd.mobius.msl': 'msl',
        'application/vnd.mobius.plc': 'plc',
        'application/vnd.mobius.txf': 'txf',
        'application/vnd.mophun.application': 'mpn',
        'application/vnd.mophun.certificate': 'mpc',
        'application/vnd.mozilla.xul+xml': 'xul',
        'application/vnd.ms-artgalry': 'cil',
        'application/vnd.ms-cab-compressed': 'cab',
        'application/vnd.ms-excel': ['xls', 'xla', 'xlc', 'xlm', 'xlt', 'xlw', 'xlb', 'xll'],
        'application/vnd.ms-excel.addin.macroenabled.12': 'xlam',
        'application/vnd.ms-excel.sheet.binary.macroenabled.12': 'xlsb',
        'application/vnd.ms-excel.sheet.macroenabled.12': 'xlsm',
        'application/vnd.ms-excel.template.macroenabled.12': 'xltm',
        'application/vnd.ms-fontobject': 'eot',
        'application/vnd.ms-htmlhelp': 'chm',
        'application/vnd.ms-ims': 'ims',
        'application/vnd.ms-lrm': 'lrm',
        'application/vnd.ms-officetheme': 'thmx',
        'application/vnd.ms-outlook': 'msg',
        'application/vnd.ms-pki.certstore': 'sst',
        'application/vnd.ms-pki.pko': 'pko',
        'application/vnd.ms-pki.seccat': 'cat',
        'application/vnd.ms-pki.stl': 'stl',
        'application/vnd.ms-pkicertstore': 'sst',
        'application/vnd.ms-pkiseccat': 'cat',
        'application/vnd.ms-pkistl': 'stl',
        'application/vnd.ms-powerpoint': ['ppt', 'pot', 'pps', 'ppa', 'pwz'],
        'application/vnd.ms-powerpoint.addin.macroenabled.12': 'ppam',
        'application/vnd.ms-powerpoint.presentation.macroenabled.12': 'pptm',
        'application/vnd.ms-powerpoint.slide.macroenabled.12': 'sldm',
        'application/vnd.ms-powerpoint.slideshow.macroenabled.12': 'ppsm',
        'application/vnd.ms-powerpoint.template.macroenabled.12': 'potm',
        'application/vnd.ms-project': 'mpp',
        'application/vnd.ms-word.document.macroenabled.12': 'docm',
        'application/vnd.ms-word.template.macroenabled.12': 'dotm',
        'application/vnd.ms-works': ['wks', 'wcm', 'wdb', 'wps'],
        'application/vnd.ms-wpl': 'wpl',
        'application/vnd.ms-xpsdocument': 'xps',
        'application/vnd.mseq': 'mseq',
        'application/vnd.musician': 'mus',
        'application/vnd.muvee.style': 'msty',
        'application/vnd.neurolanguage.nlu': 'nlu',
        'application/vnd.noblenet-directory': 'nnd',
        'application/vnd.noblenet-sealer': 'nns',
        'application/vnd.noblenet-web': 'nnw',
        'application/vnd.nokia.configuration-message': 'ncm',
        'application/vnd.nokia.n-gage.data': 'ngdat',
        'application/vnd.nokia.n-gage.symbian.install': 'n-gage',
        'application/vnd.nokia.radio-preset': 'rpst',
        'application/vnd.nokia.radio-presets': 'rpss',
        'application/vnd.nokia.ringing-tone': 'rng',
        'application/vnd.novadigm.edm': 'edm',
        'application/vnd.novadigm.edx': 'edx',
        'application/vnd.novadigm.ext': 'ext',
        'application/vnd.oasis.opendocument.chart': 'odc',
        'application/vnd.oasis.opendocument.chart-template': 'otc',
        'application/vnd.oasis.opendocument.database': 'odb',
        'application/vnd.oasis.opendocument.formula': 'odf',
        'application/vnd.oasis.opendocument.formula-template': 'odft',
        'application/vnd.oasis.opendocument.graphics': 'odg',
        'application/vnd.oasis.opendocument.graphics-template': 'otg',
        'application/vnd.oasis.opendocument.image': 'odi',
        'application/vnd.oasis.opendocument.image-template': 'oti',
        'application/vnd.oasis.opendocument.presentation': 'odp',
        'application/vnd.oasis.opendocument.presentation-template': 'otp',
        'application/vnd.oasis.opendocument.spreadsheet': 'ods',
        'application/vnd.oasis.opendocument.spreadsheet-template': 'ots',
        'application/vnd.oasis.opendocument.text': 'odt',
        'application/vnd.oasis.opendocument.text-master': 'odm',
        'application/vnd.oasis.opendocument.text-template': 'ott',
        'application/vnd.oasis.opendocument.text-web': 'oth',
        'application/vnd.olpc-sugar': 'xo',
        'application/vnd.oma.dd2+xml': 'dd2',
        'application/vnd.openofficeorg.extension': 'oxt',
        'application/vnd.openxmlformats-officedocument.presentationml.presentation': 'pptx',
        'application/vnd.openxmlformats-officedocument.presentationml.slide': 'sldx',
        'application/vnd.openxmlformats-officedocument.presentationml.slideshow': 'ppsx',
        'application/vnd.openxmlformats-officedocument.presentationml.template': 'potx',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'xlsx',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.template': 'xltx',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.template': 'dotx',
        'application/vnd.osgeo.mapguide.package': 'mgp',
        'application/vnd.osgi.dp': 'dp',
        'application/vnd.palm': 'pdb',
        'application/vnd.pawaafile': 'paw',
        'application/vnd.pg.format': 'str',
        'application/vnd.pg.osasli': 'ei6',
        'application/vnd.picsel': 'efif',
        'application/vnd.pmi.widget': 'wg',
        'application/vnd.pocketlearn': 'plf',
        'application/vnd.powerbuilder6': 'pbd',
        'application/vnd.previewsystems.box': 'box',
        'application/vnd.proteus.magazine': 'mgz',
        'application/vnd.publishare-delta-tree': 'qps',
        'application/vnd.pvi.ptid1': 'ptid',
        'application/vnd.quark.quarkxpress': 'qxd',
        'application/vnd.realvnc.bed': 'bed',
        'application/vnd.recordare.musicxml': 'mxl',
        'application/vnd.recordare.musicxml+xml': 'musicxml',
        'application/vnd.rig.cryptonote': 'cryptonote',
        'application/vnd.rim.cod': 'cod',
        'application/vnd.rn-realmedia': 'rm',
        'application/vnd.rn-realplayer': 'rnx',
        'application/vnd.route66.link66+xml': 'link66',
        'application/vnd.sailingtracker.track': 'st',
        'application/vnd.seemail': 'see',
        'application/vnd.sema': 'sema',
        'application/vnd.semd': 'semd',
        'application/vnd.semf': 'semf',
        'application/vnd.shana.informed.formdata': 'ifm',
        'application/vnd.shana.informed.formtemplate': 'itp',
        'application/vnd.shana.informed.interchange': 'iif',
        'application/vnd.shana.informed.package': 'ipk',
        'application/vnd.simtech-mindmapper': 'twd',
        'application/vnd.smaf': 'mmf',
        'application/vnd.smart.teacher': 'teacher',
        'application/vnd.solent.sdkm+xml': 'sdkm',
        'application/vnd.spotfire.dxp': 'dxp',
        'application/vnd.spotfire.sfs': 'sfs',
        'application/vnd.stardivision.calc': 'sdc',
        'application/vnd.stardivision.draw': 'sda',
        'application/vnd.stardivision.impress': 'sdd',
        'application/vnd.stardivision.math': 'smf',
        'application/vnd.stardivision.writer': 'sdw',
        'application/vnd.stardivision.writer-global': 'sgl',
        'application/vnd.stepmania.stepchart': 'sm',
        'application/vnd.sun.xml.calc': 'sxc',
        'application/vnd.sun.xml.calc.template': 'stc',
        'application/vnd.sun.xml.draw': 'sxd',
        'application/vnd.sun.xml.draw.template': 'std',
        'application/vnd.sun.xml.impress': 'sxi',
        'application/vnd.sun.xml.impress.template': 'sti',
        'application/vnd.sun.xml.math': 'sxm',
        'application/vnd.sun.xml.writer': 'sxw',
        'application/vnd.sun.xml.writer.global': 'sxg',
        'application/vnd.sun.xml.writer.template': 'stw',
        'application/vnd.sus-calendar': 'sus',
        'application/vnd.svd': 'svd',
        'application/vnd.symbian.install': 'sis',
        'application/vnd.syncml+xml': 'xsm',
        'application/vnd.syncml.dm+wbxml': 'bdm',
        'application/vnd.syncml.dm+xml': 'xdm',
        'application/vnd.tao.intent-module-archive': 'tao',
        'application/vnd.tmobile-livetv': 'tmo',
        'application/vnd.trid.tpt': 'tpt',
        'application/vnd.triscape.mxs': 'mxs',
        'application/vnd.trueapp': 'tra',
        'application/vnd.ufdl': 'ufd',
        'application/vnd.uiq.theme': 'utz',
        'application/vnd.umajin': 'umj',
        'application/vnd.unity': 'unityweb',
        'application/vnd.uoml+xml': 'uoml',
        'application/vnd.vcx': 'vcx',
        'application/vnd.visio': 'vsd',
        'application/vnd.visionary': 'vis',
        'application/vnd.vsf': 'vsf',
        'application/vnd.wap.wbxml': 'wbxml',
        'application/vnd.wap.wmlc': 'wmlc',
        'application/vnd.wap.wmlscriptc': 'wmlsc',
        'application/vnd.webturbo': 'wtb',
        'application/vnd.wolfram.player': 'nbp',
        'application/vnd.wordperfect': 'wpd',
        'application/vnd.wqd': 'wqd',
        'application/vnd.wt.stf': 'stf',
        'application/vnd.xara': ['web', 'xar'],
        'application/vnd.xfdl': 'xfdl',
        'application/vnd.yamaha.hv-dic': 'hvd',
        'application/vnd.yamaha.hv-script': 'hvs',
        'application/vnd.yamaha.hv-voice': 'hvp',
        'application/vnd.yamaha.openscoreformat': 'osf',
        'application/vnd.yamaha.openscoreformat.osfpvg+xml': 'osfpvg',
        'application/vnd.yamaha.smaf-audio': 'saf',
        'application/vnd.yamaha.smaf-phrase': 'spf',
        'application/vnd.yellowriver-custom-menu': 'cmp',
        'application/vnd.zul': 'zir',
        'application/vnd.zzazz.deck+xml': 'zaz',
        'application/vocaltec-media-desc': 'vmd',
        'application/vocaltec-media-file': 'vmf',
        'application/voicexml+xml': 'vxml',
        'application/widget': 'wgt',
        'application/winhlp': 'hlp',
        'application/wordperfect': ['wp', 'wp5', 'wp6', 'wpd'],
        'application/wordperfect6.0': ['w60', 'wp5'],
        'application/wordperfect6.1': 'w61',
        'application/wsdl+xml': 'wsdl',
        'application/wspolicy+xml': 'wspolicy',
        'application/x-123': 'wk1',
        'application/x-7z-compressed': '7z',
        'application/x-abiword': 'abw',
        'application/x-ace-compressed': 'ace',
        'application/x-aim': 'aim',
        'application/x-authorware-bin': 'aab',
        'application/x-authorware-map': 'aam',
        'application/x-authorware-seg': 'aas',
        'application/x-bcpio': 'bcpio',
        'application/x-binary': 'bin',
        'application/x-binhex40': 'hqx',
        'application/x-bittorrent': 'torrent',
        'application/x-bsh': ['bsh', 'sh', 'shar'],
        'application/x-bytecode.elisp': 'elc',
        'applicaiton/x-bytecode.python': 'pyc',
        'application/x-bzip': 'bz',
        'application/x-bzip2': ['boz', 'bz2'],
        'application/x-cdf': 'cdf',
        'application/x-cdlink': 'vcd',
        'application/x-chat': ['cha', 'chat'],
        'application/x-chess-pgn': 'pgn',
        'application/x-cmu-raster': 'ras',
        'application/x-cocoa': 'cco',
        'application/x-compactpro': 'cpt',
        'application/x-compress': 'z',
        'application/x-compressed': ['tgz', 'gz', 'z', 'zip'],
        'application/x-conference': 'nsc',
        'application/x-cpio': 'cpio',
        'application/x-cpt': 'cpt',
        'application/x-csh': 'csh',
        'application/x-debian-package': 'deb',
        'application/x-deepv': 'deepv',
        'application/x-director': ['dir', 'dcr', 'dxr'],
        'application/x-doom': 'wad',
        'application/x-dtbncx+xml': 'ncx',
        'application/x-dtbook+xml': 'dtb',
        'application/x-dtbresource+xml': 'res',
        'application/x-dvi': 'dvi',
        'application/x-elc': 'elc',
        'application/x-envoy': ['env', 'evy'],
        'application/x-esrehber': 'es',
        'application/x-excel': ['xls', 'xla', 'xlb', 'xlc', 'xld', 'xlk', 'xll', 'xlm', 'xlt', 'xlv', 'xlw'],
        'application/x-font-bdf': 'bdf',
        'application/x-font-ghostscript': 'gsf',
        'application/x-font-linux-psf': 'psf',
        'application/x-font-otf': 'otf',
        'application/x-font-pcf': 'pcf',
        'application/x-font-snf': 'snf',
        'application/x-font-ttf': 'ttf',
        'application/x-font-type1': 'pfa',
        'application/x-font-woff': 'woff',
        'application/x-frame': 'mif',
        'application/x-freelance': 'pre',
        'application/x-futuresplash': 'spl',
        'application/x-gnumeric': 'gnumeric',
        'application/x-gsp': 'gsp',
        'application/x-gss': 'gss',
        'application/x-gtar': 'gtar',
        'application/x-gzip': ['gz', 'gzip'],
        'application/x-hdf': 'hdf',
        'application/x-helpfile': ['help', 'hlp'],
        'application/x-httpd-imap': 'imap',
        'application/x-ima': 'ima',
        'application/x-internet-signup': ['ins', 'isp'],
        'application/x-internett-signup': 'ins',
        'application/x-inventor': 'iv',
        'application/x-ip2': 'ip',
        'application/x-iphone': 'iii',
        'application/x-java-class': 'class',
        'application/x-java-commerce': 'jcm',
        'application/x-java-jnlp-file': 'jnlp',
        'application/x-javascript': 'js',
        'application/x-koan': ['skd', 'skm', 'skp', 'skt'],
        'application/x-ksh': 'ksh',
        'application/x-latex': ['latex', 'ltx'],
        'application/x-lha': 'lha',
        'application/x-lisp': 'lsp',
        'application/x-livescreen': 'ivy',
        'application/x-lotus': 'wq1',
        'application/x-lotusscreencam': 'scm',
        'application/x-lzh': 'lzh',
        'application/x-lzx': 'lzx',
        'application/x-mac-binhex40': 'hqx',
        'application/x-macbinary': 'bin',
        'application/x-magic-cap-package-1.0': 'mc$',
        'application/x-mathcad': 'mcd',
        'application/x-meme': 'mm',
        'application/x-midi': ['mid', 'midi'],
        'application/x-mif': 'mif',
        'application/x-mix-transfer': 'nix',
        'application/x-mobipocket-ebook': 'prc',
        'application/x-mplayer2': 'asx',
        'application/x-ms-application': 'application',
        'application/x-ms-wmd': 'wmd',
        'application/x-ms-wmz': 'wmz',
        'application/x-ms-xbap': 'xbap',
        'application/x-msaccess': 'mdb',
        'application/x-msbinder': 'obd',
        'application/x-mscardfile': 'crd',
        'application/x-msclip': 'clp',
        'application/x-msdownload': ['exe', 'dll'],
        'application/x-msexcel': ['xls', 'xla', 'xlw'],
        'application/x-msmediaview': ['mvb', 'm13', 'm14'],
        'application/x-msmetafile': 'wmf',
        'application/x-msmoney': 'mny',
        'application/x-mspowerpoint': 'ppt',
        'application/x-mspublisher': 'pub',
        'application/x-msschedule': 'scd',
        'application/x-msterminal': 'trm',
        'application/x-mswrite': 'wri',
        'application/x-navi-animation': 'ani',
        'application/x-navidoc': 'nvd',
        'application/x-navimap': 'map',
        'application/x-navistyle': 'stl',
        'application/x-netcdf': ['cdf', 'nc'],
        'application/x-newton-compatible-pkg': 'pkg',
        'application/x-nokia-9000-communicator-add-on-software': 'aos',
        'application/x-omc': 'omc',
        'application/x-omcdatamaker': 'omcd',
        'application/x-omcregerator': 'omcr',
        'application/x-pagemaker': ['pm4', 'pm5'],
        'application/x-pcl': 'pcl',
        'application/x-perfmon': ['pma', 'pmc', 'pml', 'pmr', 'pmw'],
        'application/x-pixclscript': 'plx',
        'application/x-pkcs10': 'p10',
        'application/x-pkcs12': ['p12', 'pfx'],
        'application/x-pkcs7-certificates': ['p7b', 'spc'],
        'application/x-pkcs7-certreqresp': 'p7r',
        'application/x-pkcs7-mime': ['p7m', 'p7c'],
        'application/x-pkcs7-signature': ['p7s', 'p7a'],
        'application/x-pointplus': 'css',
        'application/x-portable-anymap': 'pnm',
        'application/x-project': ['mpc', 'mpt', 'mpv', 'mpx'],
        'application/x-qpro': 'wb1',
        'application/x-rar-compressed': 'rar',
        'application/x-rtf': 'rtf',
        'application/x-sdp': 'sdp',
        'application/x-sea': 'sea',
        'application/x-seelogo': 'sl',
        'application/x-sh': 'sh',
        'application/x-shar': ['shar', 'sh'],
        'application/x-shockwave-flash': 'swf',
        'application/x-silverlight-app': 'xap',
        'application/x-sit': 'sit',
        'application/x-sprite': ['spr', 'sprite'],
        'application/x-stuffit': 'sit',
        'application/x-stuffitx': 'sitx',
        'application/x-sv4cpio': 'sv4cpio',
        'application/x-sv4crc': 'sv4crc',
        'application/x-tar': 'tar',
        'application/x-tbook': ['sbk', 'tbk'],
        'application/x-tcl': 'tcl',
        'application/x-tex': 'tex',
        'application/x-tex-tfm': 'tfm',
        'application/x-texinfo': ['texi', 'texinfo'],
        'application/x-troff': ['roff', 't', 'tr'],
        'application/x-troff-man': 'man',
        'application/x-troff-me': 'me',
        'application/x-troff-ms': 'ms',
        'application/x-troff-msvideo': 'avi',
        'application/x-ustar': 'ustar',
        'application/x-visio': ['vsd', 'vst', 'vsw'],
        'application/x-vnd.audioexplosion.mzz': 'mzz',
        'application/x-vnd.ls-xpix': 'xpix',
        'application/x-vrml': 'vrml',
        'application/x-wais-source': ['src', 'wsrc'],
        'application/x-winhelp': 'hlp',
        'application/x-wintalk': 'wtk',
        'application/x-world': ['wrl', 'svr'],
        'application/x-wpwin': 'wpd',
        'application/x-wri': 'wri',
        'application/x-x509-ca-cert': ['cer', 'crt', 'der'],
        'application/x-x509-user-cert': 'crt',
        'application/x-xfig': 'fig',
        'application/x-xpinstall': 'xpi',
        'application/x-zip-compressed': 'zip',
        'application/xcap-diff+xml': 'xdf',
        'application/xenc+xml': 'xenc',
        'application/xhtml+xml': 'xhtml',
        'application/xml': 'xml',
        'application/xml-dtd': 'dtd',
        'application/xop+xml': 'xop',
        'application/xslt+xml': 'xslt',
        'application/xspf+xml': 'xspf',
        'application/xv+xml': 'mxml',
        'application/yang': 'yang',
        'application/yin+xml': 'yin',
        'application/ynd.ms-pkipko': 'pko',
        'application/zip': 'zip',
        'audio/adpcm': 'adp',
        'audio/aiff': ['aiff', 'aif', 'aifc'],
        'audio/basic': ['snd', 'au'],
        'audio/it': 'it',
        'audio/make': ['funk', 'my', 'pfunk'],
        'audio/make.my.funk': 'pfunk',
        'audio/mid': ['mid', 'rmi'],
        'audio/midi': ['midi', 'kar', 'mid'],
        'audio/mod': 'mod',
        'audio/mp4': 'mp4a',
        'audio/mpeg': ['mpga', 'mp3', 'm2a', 'mp2', 'mpa', 'mpg'],
        'audio/mpeg3': 'mp3',
        'audio/nspaudio': ['la', 'lma'],
        'audio/ogg': 'oga',
        'audio/s3m': 's3m',
        'audio/tsp-audio': 'tsi',
        'audio/tsplayer': 'tsp',
        'audio/vnd.dece.audio': 'uva',
        'audio/vnd.digital-winds': 'eol',
        'audio/vnd.dra': 'dra',
        'audio/vnd.dts': 'dts',
        'audio/vnd.dts.hd': 'dtshd',
        'audio/vnd.lucent.voice': 'lvp',
        'audio/vnd.ms-playready.media.pya': 'pya',
        'audio/vnd.nuera.ecelp4800': 'ecelp4800',
        'audio/vnd.nuera.ecelp7470': 'ecelp7470',
        'audio/vnd.nuera.ecelp9600': 'ecelp9600',
        'audio/vnd.qcelp': 'qcp',
        'audio/vnd.rip': 'rip',
        'audio/voc': 'voc',
        'audio/voxware': 'vox',
        'audio/wav': 'wav',
        'audio/webm': 'weba',
        'audio/x-aac': 'aac',
        'audio/x-adpcm': 'snd',
        'audio/x-aiff': ['aiff', 'aif', 'aifc'],
        'audio/x-au': 'au',
        'audio/x-gsm': ['gsd', 'gsm'],
        'audio/x-jam': 'jam',
        'audio/x-liveaudio': 'lam',
        'audio/x-mid': ['mid', 'midi'],
        'audio/x-midi': ['midi', 'mid'],
        'audio/x-mod': 'mod',
        'audio/x-mpeg': 'mp2',
        'audio/x-mpeg-3': 'mp3',
        'audio/x-mpegurl': 'm3u',
        'audio/x-mpequrl': 'm3u',
        'audio/x-ms-wax': 'wax',
        'audio/x-ms-wma': 'wma',
        'audio/x-nspaudio': ['la', 'lma'],
        'audio/x-pn-realaudio': ['ra', 'ram', 'rm', 'rmm', 'rmp'],
        'audio/x-pn-realaudio-plugin': ['ra', 'rmp', 'rpm'],
        'audio/x-psid': 'sid',
        'audio/x-realaudio': 'ra',
        'audio/x-twinvq': 'vqf',
        'audio/x-twinvq-plugin': ['vqe', 'vql'],
        'audio/x-vnd.audioexplosion.mjuicemediafile': 'mjf',
        'audio/x-voc': 'voc',
        'audio/x-wav': 'wav',
        'audio/xm': 'xm',
        'chemical/x-cdx': 'cdx',
        'chemical/x-cif': 'cif',
        'chemical/x-cmdf': 'cmdf',
        'chemical/x-cml': 'cml',
        'chemical/x-csml': 'csml',
        'chemical/x-pdb': ['pdb', 'xyz'],
        'chemical/x-xyz': 'xyz',
        'drawing/x-dwf': 'dwf',
        'i-world/i-vrml': 'ivr',
        'image/bmp': ['bmp', 'bm'],
        'image/cgm': 'cgm',
        'image/cis-cod': 'cod',
        'image/cmu-raster': ['ras', 'rast'],
        'image/fif': 'fif',
        'image/florian': ['flo', 'turbot'],
        'image/g3fax': 'g3',
        'image/gif': 'gif',
        'image/ief': ['ief', 'iefs'],
        'image/jpeg': ['jpeg', 'jpe', 'jpg', 'jfif', 'jfif-tbnl'],
        'image/jutvision': 'jut',
        'image/ktx': 'ktx',
        'image/naplps': ['nap', 'naplps'],
        'image/pict': ['pic', 'pict'],
        'image/pipeg': 'jfif',
        'image/pjpeg': ['jfif', 'jpe', 'jpeg', 'jpg'],
        'image/png': ['png', 'x-png'],
        'image/prs.btif': 'btif',
        'image/svg+xml': 'svg',
        'image/tiff': ['tif', 'tiff'],
        'image/vasa': 'mcf',
        'image/vnd.adobe.photoshop': 'psd',
        'image/vnd.dece.graphic': 'uvi',
        'image/vnd.djvu': 'djvu',
        'image/vnd.dvb.subtitle': 'sub',
        'image/vnd.dwg': ['dwg', 'dxf', 'svf'],
        'image/vnd.dxf': 'dxf',
        'image/vnd.fastbidsheet': 'fbs',
        'image/vnd.fpx': 'fpx',
        'image/vnd.fst': 'fst',
        'image/vnd.fujixerox.edmics-mmr': 'mmr',
        'image/vnd.fujixerox.edmics-rlc': 'rlc',
        'image/vnd.ms-modi': 'mdi',
        'image/vnd.net-fpx': ['fpx', 'npx'],
        'image/vnd.rn-realflash': 'rf',
        'image/vnd.rn-realpix': 'rp',
        'image/vnd.wap.wbmp': 'wbmp',
        'image/vnd.xiff': 'xif',
        'image/webp': 'webp',
        'image/x-cmu-raster': 'ras',
        'image/x-cmx': 'cmx',
        'image/x-dwg': ['dwg', 'dxf', 'svf'],
        'image/x-freehand': 'fh',
        'image/x-icon': 'ico',
        'image/x-jg': 'art',
        'image/x-jps': 'jps',
        'image/x-niff': ['niff', 'nif'],
        'image/x-pcx': 'pcx',
        'image/x-pict': ['pct', 'pic'],
        'image/x-portable-anymap': 'pnm',
        'image/x-portable-bitmap': 'pbm',
        'image/x-portable-graymap': 'pgm',
        'image/x-portable-greymap': 'pgm',
        'image/x-portable-pixmap': 'ppm',
        'image/x-quicktime': ['qif', 'qti', 'qtif'],
        'image/x-rgb': 'rgb',
        'image/x-tiff': ['tif', 'tiff'],
        'image/x-windows-bmp': 'bmp',
        'image/x-xbitmap': 'xbm',
        'image/x-xbm': 'xbm',
        'image/x-xpixmap': ['xpm', 'pm'],
        'image/x-xwd': 'xwd',
        'image/x-xwindowdump': 'xwd',
        'image/xbm': 'xbm',
        'image/xpm': 'xpm',
        'message/rfc822': ['eml', 'mht', 'mhtml', 'nws', 'mime'],
        'model/iges': ['iges', 'igs'],
        'model/mesh': 'msh',
        'model/vnd.collada+xml': 'dae',
        'model/vnd.dwf': 'dwf',
        'model/vnd.gdl': 'gdl',
        'model/vnd.gtw': 'gtw',
        'model/vnd.mts': 'mts',
        'model/vnd.vtu': 'vtu',
        'model/vrml': ['vrml', 'wrl', 'wrz'],
        'model/x-pov': 'pov',
        'multipart/x-gzip': 'gzip',
        'multipart/x-ustar': 'ustar',
        'multipart/x-zip': 'zip',
        'music/crescendo': ['mid', 'midi'],
        'music/x-karaoke': 'kar',
        'paleovu/x-pv': 'pvu',
        'text/asp': 'asp',
        'text/calendar': 'ics',
        'text/css': 'css',
        'text/csv': 'csv',
        'text/ecmascript': 'js',
        'text/h323': '323',
        'text/html': ['html', 'htm', 'stm', 'acgi', 'htmls', 'htx', 'shtml'],
        'text/iuls': 'uls',
        'text/javascript': 'js',
        'text/mcf': 'mcf',
        'text/n3': 'n3',
        'text/pascal': 'pas',
        'text/plain': ['txt', 'bas', 'c', 'h', 'c++', 'cc', 'com', 'conf', 'cxx', 'def', 'f', 'f90', 'for', 'g', 'hh', 'idc', 'jav', 'java', 'list', 'log', 'lst', 'm', 'mar', 'pl', 'sdml', 'text'],
        'text/plain-bas': 'par',
        'text/prs.lines.tag': 'dsc',
        'text/richtext': ['rtx', 'rt', 'rtf'],
        'text/scriplet': 'wsc',
        'text/scriptlet': 'sct',
        'text/sgml': ['sgm', 'sgml'],
        'text/tab-separated-values': 'tsv',
        'text/troff': 't',
        'text/turtle': 'ttl',
        'text/uri-list': ['uni', 'unis', 'uri', 'uris'],
        'text/vnd.abc': 'abc',
        'text/vnd.curl': 'curl',
        'text/vnd.curl.dcurl': 'dcurl',
        'text/vnd.curl.mcurl': 'mcurl',
        'text/vnd.curl.scurl': 'scurl',
        'text/vnd.fly': 'fly',
        'text/vnd.fmi.flexstor': 'flx',
        'text/vnd.graphviz': 'gv',
        'text/vnd.in3d.3dml': '3dml',
        'text/vnd.in3d.spot': 'spot',
        'text/vnd.rn-realtext': 'rt',
        'text/vnd.sun.j2me.app-descriptor': 'jad',
        'text/vnd.wap.wml': 'wml',
        'text/vnd.wap.wmlscript': 'wmls',
        'text/webviewhtml': 'htt',
        'text/x-asm': ['asm', 's'],
        'text/x-audiosoft-intra': 'aip',
        'text/x-c': ['c', 'cc', 'cpp'],
        'text/x-component': 'htc',
        'text/x-fortran': ['for', 'f', 'f77', 'f90'],
        'text/x-h': ['h', 'hh'],
        'text/x-java-source': ['java', 'jav'],
        'text/x-java-source,java': 'java',
        'text/x-la-asf': 'lsx',
        'text/x-m': 'm',
        'text/x-pascal': 'p',
        'text/x-script': 'hlb',
        'text/x-script.csh': 'csh',
        'text/x-script.elisp': 'el',
        'text/x-script.guile': 'scm',
        'text/x-script.ksh': 'ksh',
        'text/x-script.lisp': 'lsp',
        'text/x-script.perl': 'pl',
        'text/x-script.perl-module': 'pm',
        'text/x-script.phyton': 'py',
        'text/x-script.rexx': 'rexx',
        'text/x-script.scheme': 'scm',
        'text/x-script.sh': 'sh',
        'text/x-script.tcl': 'tcl',
        'text/x-script.tcsh': 'tcsh',
        'text/x-script.zsh': 'zsh',
        'text/x-server-parsed-html': ['shtml', 'ssi'],
        'text/x-setext': 'etx',
        'text/x-sgml': ['sgm', 'sgml'],
        'text/x-speech': ['spc', 'talk'],
        'text/x-uil': 'uil',
        'text/x-uuencode': ['uu', 'uue'],
        'text/x-vcalendar': 'vcs',
        'text/x-vcard': 'vcf',
        'text/xml': 'xml',
        'video/3gpp': '3gp',
        'video/3gpp2': '3g2',
        'video/animaflex': 'afl',
        'video/avi': 'avi',
        'video/avs-video': 'avs',
        'video/dl': 'dl',
        'video/fli': 'fli',
        'video/gl': 'gl',
        'video/h261': 'h261',
        'video/h263': 'h263',
        'video/h264': 'h264',
        'video/jpeg': 'jpgv',
        'video/jpm': 'jpm',
        'video/mj2': 'mj2',
        'video/mp4': 'mp4',
        'video/mpeg': ['mpeg', 'mp2', 'mpa', 'mpe', 'mpg', 'mpv2', 'm1v', 'm2v', 'mp3'],
        'video/msvideo': 'avi',
        'video/ogg': 'ogv',
        'video/quicktime': ['mov', 'qt', 'moov'],
        'video/vdo': 'vdo',
        'video/vivo': ['viv', 'vivo'],
        'video/vnd.dece.hd': 'uvh',
        'video/vnd.dece.mobile': 'uvm',
        'video/vnd.dece.pd': 'uvp',
        'video/vnd.dece.sd': 'uvs',
        'video/vnd.dece.video': 'uvv',
        'video/vnd.fvt': 'fvt',
        'video/vnd.mpegurl': 'mxu',
        'video/vnd.ms-playready.media.pyv': 'pyv',
        'video/vnd.rn-realvideo': 'rv',
        'video/vnd.uvvu.mp4': 'uvu',
        'video/vnd.vivo': ['viv', 'vivo'],
        'video/vosaic': 'vos',
        'video/webm': 'webm',
        'video/x-amt-demorun': 'xdr',
        'video/x-amt-showrun': 'xsr',
        'video/x-atomic3d-feature': 'fmf',
        'video/x-dl': 'dl',
        'video/x-dv': ['dif', 'dv'],
        'video/x-f4v': 'f4v',
        'video/x-fli': 'fli',
        'video/x-flv': 'flv',
        'video/x-gl': 'gl',
        'video/x-isvideo': 'isu',
        'video/x-la-asf': ['lsf', 'lsx'],
        'video/x-m4v': 'm4v',
        'video/x-motion-jpeg': 'mjpg',
        'video/x-mpeg': ['mp3', 'mp2'],
        'video/x-mpeq2a': 'mp2',
        'video/x-ms-asf': ['asf', 'asr', 'asx'],
        'video/x-ms-asf-plugin': 'asx',
        'video/x-ms-wm': 'wm',
        'video/x-ms-wmv': 'wmv',
        'video/x-ms-wmx': 'wmx',
        'video/x-ms-wvx': 'wvx',
        'video/x-msvideo': 'avi',
        'video/x-qtc': 'qtc',
        'video/x-scm': 'scm',
        'video/x-sgi-movie': ['movie', 'mv'],
        'windows/metafile': 'wmf',
        'www/mime': 'mime',
        'x-conference/x-cooltalk': 'ice',
        'x-music/x-midi': ['mid', 'midi'],
        'x-world/x-3dmf': ['3dm', '3dmf', 'qd3', 'qd3d'],
        'x-world/x-svr': 'svr',
        'x-world/x-vrml': ['flr', 'vrml', 'wrl', 'wrz', 'xaf', 'xof'],
        'x-world/x-vrt': 'vrt',
        'xgl/drawing': 'xgz',
        'xgl/movie': 'xmz'
    },

    extensions: {
        '*': 'application/octet-stream',
        '123': 'application/vnd.lotus-1-2-3',
        '323': 'text/h323',
        '3dm': 'x-world/x-3dmf',
        '3dmf': 'x-world/x-3dmf',
        '3dml': 'text/vnd.in3d.3dml',
        '3g2': 'video/3gpp2',
        '3gp': 'video/3gpp',
        '7z': 'application/x-7z-compressed',
        'a': 'application/octet-stream',
        'aab': 'application/x-authorware-bin',
        'aac': 'audio/x-aac',
        'aam': 'application/x-authorware-map',
        'aas': 'application/x-authorware-seg',
        'abc': 'text/vnd.abc',
        'abw': 'application/x-abiword',
        'ac': 'application/pkix-attr-cert',
        'acc': 'application/vnd.americandynamics.acc',
        'ace': 'application/x-ace-compressed',
        'acgi': 'text/html',
        'acu': 'application/vnd.acucobol',
        'acx': 'application/internet-property-stream',
        'adp': 'audio/adpcm',
        'aep': 'application/vnd.audiograph',
        'afl': 'video/animaflex',
        'afp': 'application/vnd.ibm.modcap',
        'ahead': 'application/vnd.ahead.space',
        'ai': 'application/postscript',
        'aif': ['audio/aiff', 'audio/x-aiff'],
        'aifc': ['audio/aiff', 'audio/x-aiff'],
        'aiff': ['audio/aiff', 'audio/x-aiff'],
        'aim': 'application/x-aim',
        'aip': 'text/x-audiosoft-intra',
        'air': 'application/vnd.adobe.air-application-installer-package+zip',
        'ait': 'application/vnd.dvb.ait',
        'ami': 'application/vnd.amiga.ami',
        'ani': 'application/x-navi-animation',
        'aos': 'application/x-nokia-9000-communicator-add-on-software',
        'apk': 'application/vnd.android.package-archive',
        'application': 'application/x-ms-application',
        'apr': 'application/vnd.lotus-approach',
        'aps': 'application/mime',
        'arc': 'application/octet-stream',
        'arj': ['application/arj', 'application/octet-stream'],
        'art': 'image/x-jg',
        'asf': 'video/x-ms-asf',
        'asm': 'text/x-asm',
        'aso': 'application/vnd.accpac.simply.aso',
        'asp': 'text/asp',
        'asr': 'video/x-ms-asf',
        'asx': ['video/x-ms-asf', 'application/x-mplayer2', 'video/x-ms-asf-plugin'],
        'atc': 'application/vnd.acucorp',
        'atomcat': 'application/atomcat+xml',
        'atomsvc': 'application/atomsvc+xml',
        'atx': 'application/vnd.antix.game-component',
        'au': ['audio/basic', 'audio/x-au'],
        'avi': ['video/avi', 'video/msvideo', 'application/x-troff-msvideo', 'video/x-msvideo'],
        'avs': 'video/avs-video',
        'aw': 'application/applixware',
        'axs': 'application/olescript',
        'azf': 'application/vnd.airzip.filesecure.azf',
        'azs': 'application/vnd.airzip.filesecure.azs',
        'azw': 'application/vnd.amazon.ebook',
        'bas': 'text/plain',
        'bcpio': 'application/x-bcpio',
        'bdf': 'application/x-font-bdf',
        'bdm': 'application/vnd.syncml.dm+wbxml',
        'bed': 'application/vnd.realvnc.bed',
        'bh2': 'application/vnd.fujitsu.oasysprs',
        'bin': ['application/octet-stream', 'application/mac-binary', 'application/macbinary', 'application/x-macbinary', 'application/x-binary'],
        'bm': 'image/bmp',
        'bmi': 'application/vnd.bmi',
        'bmp': ['image/bmp', 'image/x-windows-bmp'],
        'boo': 'application/book',
        'book': 'application/book',
        'box': 'application/vnd.previewsystems.box',
        'boz': 'application/x-bzip2',
        'bsh': 'application/x-bsh',
        'btif': 'image/prs.btif',
        'bz': 'application/x-bzip',
        'bz2': 'application/x-bzip2',
        'c': ['text/plain', 'text/x-c'],
        'c++': 'text/plain',
        'c11amc': 'application/vnd.cluetrust.cartomobile-config',
        'c11amz': 'application/vnd.cluetrust.cartomobile-config-pkg',
        'c4g': 'application/vnd.clonk.c4group',
        'cab': 'application/vnd.ms-cab-compressed',
        'car': 'application/vnd.curl.car',
        'cat': ['application/vnd.ms-pkiseccat', 'application/vnd.ms-pki.seccat'],
        'cc': ['text/plain', 'text/x-c'],
        'ccad': 'application/clariscad',
        'cco': 'application/x-cocoa',
        'ccxml': 'application/ccxml+xml,',
        'cdbcmsg': 'application/vnd.contact.cmsg',
        'cdf': ['application/cdf', 'application/x-cdf', 'application/x-netcdf'],
        'cdkey': 'application/vnd.mediastation.cdkey',
        'cdmia': 'application/cdmi-capability',
        'cdmic': 'application/cdmi-container',
        'cdmid': 'application/cdmi-domain',
        'cdmio': 'application/cdmi-object',
        'cdmiq': 'application/cdmi-queue',
        'cdx': 'chemical/x-cdx',
        'cdxml': 'application/vnd.chemdraw+xml',
        'cdy': 'application/vnd.cinderella',
        'cer': ['application/pkix-cert', 'application/x-x509-ca-cert'],
        'cgm': 'image/cgm',
        'cha': 'application/x-chat',
        'chat': 'application/x-chat',
        'chm': 'application/vnd.ms-htmlhelp',
        'chrt': 'application/vnd.kde.kchart',
        'cif': 'chemical/x-cif',
        'cii': 'application/vnd.anser-web-certificate-issue-initiation',
        'cil': 'application/vnd.ms-artgalry',
        'cla': 'application/vnd.claymore',
        'class': ['application/octet-stream', 'application/java', 'application/java-byte-code', 'application/java-vm', 'application/x-java-class'],
        'clkk': 'application/vnd.crick.clicker.keyboard',
        'clkp': 'application/vnd.crick.clicker.palette',
        'clkt': 'application/vnd.crick.clicker.template',
        'clkw': 'application/vnd.crick.clicker.wordbank',
        'clkx': 'application/vnd.crick.clicker',
        'clp': 'application/x-msclip',
        'cmc': 'application/vnd.cosmocaller',
        'cmdf': 'chemical/x-cmdf',
        'cml': 'chemical/x-cml',
        'cmp': 'application/vnd.yellowriver-custom-menu',
        'cmx': 'image/x-cmx',
        'cod': ['image/cis-cod', 'application/vnd.rim.cod'],
        'com': ['application/octet-stream', 'text/plain'],
        'conf': 'text/plain',
        'cpio': 'application/x-cpio',
        'cpp': 'text/x-c',
        'cpt': ['application/mac-compactpro', 'application/x-compactpro', 'application/x-cpt'],
        'crd': 'application/x-mscardfile',
        'crl': ['application/pkix-crl', 'application/pkcs-crl'],
        'crt': ['application/pkix-cert', 'application/x-x509-user-cert', 'application/x-x509-ca-cert'],
        'cryptonote': 'application/vnd.rig.cryptonote',
        'csh': ['text/x-script.csh', 'application/x-csh'],
        'csml': 'chemical/x-csml',
        'csp': 'application/vnd.commonspace',
        'css': ['text/css', 'application/x-pointplus'],
        'csv': 'text/csv',
        'cu': 'application/cu-seeme',
        'curl': 'text/vnd.curl',
        'cww': 'application/prs.cww',
        'cxx': 'text/plain',
        'dae': 'model/vnd.collada+xml',
        'daf': 'application/vnd.mobius.daf',
        'davmount': 'application/davmount+xml',
        'dcr': 'application/x-director',
        'dcurl': 'text/vnd.curl.dcurl',
        'dd2': 'application/vnd.oma.dd2+xml',
        'ddd': 'application/vnd.fujixerox.ddd',
        'deb': 'application/x-debian-package',
        'deepv': 'application/x-deepv',
        'def': 'text/plain',
        'der': 'application/x-x509-ca-cert',
        'dfac': 'application/vnd.dreamfactory',
        'dif': 'video/x-dv',
        'dir': 'application/x-director',
        'dis': 'application/vnd.mobius.dis',
        'djvu': 'image/vnd.djvu',
        'dl': ['video/dl', 'video/x-dl'],
        'dll': 'application/x-msdownload',
        'dms': 'application/octet-stream',
        'dna': 'application/vnd.dna',
        'doc': 'application/msword',
        'docm': 'application/vnd.ms-word.document.macroenabled.12',
        'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'dot': 'application/msword',
        'dotm': 'application/vnd.ms-word.template.macroenabled.12',
        'dotx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.template',
        'dp': ['application/commonground', 'application/vnd.osgi.dp'],
        'dpg': 'application/vnd.dpgraph',
        'dra': 'audio/vnd.dra',
        'drw': 'application/drafting',
        'dsc': 'text/prs.lines.tag',
        'dssc': 'application/dssc+der',
        'dtb': 'application/x-dtbook+xml',
        'dtd': 'application/xml-dtd',
        'dts': 'audio/vnd.dts',
        'dtshd': 'audio/vnd.dts.hd',
        'dump': 'application/octet-stream',
        'dv': 'video/x-dv',
        'dvi': 'application/x-dvi',
        'dwf': ['model/vnd.dwf', 'drawing/x-dwf'],
        'dwg': ['application/acad', 'image/vnd.dwg', 'image/x-dwg'],
        'dxf': ['application/dxf', 'image/vnd.dwg', 'image/vnd.dxf', 'image/x-dwg'],
        'dxp': 'application/vnd.spotfire.dxp',
        'dxr': 'application/x-director',
        'ecelp4800': 'audio/vnd.nuera.ecelp4800',
        'ecelp7470': 'audio/vnd.nuera.ecelp7470',
        'ecelp9600': 'audio/vnd.nuera.ecelp9600',
        'edm': 'application/vnd.novadigm.edm',
        'edx': 'application/vnd.novadigm.edx',
        'efif': 'application/vnd.picsel',
        'ei6': 'application/vnd.pg.osasli',
        'el': 'text/x-script.elisp',
        'elc': ['application/x-elc', 'application/x-bytecode.elisp'],
        'eml': 'message/rfc822',
        'emma': 'application/emma+xml',
        'env': 'application/x-envoy',
        'eol': 'audio/vnd.digital-winds',
        'eot': 'application/vnd.ms-fontobject',
        'eps': 'application/postscript',
        'epub': 'application/epub+zip',
        'es': ['application/ecmascript', 'application/x-esrehber'],
        'es3': 'application/vnd.eszigno3+xml',
        'esf': 'application/vnd.epson.esf',
        'etx': 'text/x-setext',
        'evy': ['application/envoy', 'application/x-envoy'],
        'exe': ['application/octet-stream', 'application/x-msdownload'],
        'exi': 'application/exi',
        'ext': 'application/vnd.novadigm.ext',
        'ez2': 'application/vnd.ezpix-album',
        'ez3': 'application/vnd.ezpix-package',
        'f': ['text/plain', 'text/x-fortran'],
        'f4v': 'video/x-f4v',
        'f77': 'text/x-fortran',
        'f90': ['text/plain', 'text/x-fortran'],
        'fbs': 'image/vnd.fastbidsheet',
        'fcs': 'application/vnd.isac.fcs',
        'fdf': 'application/vnd.fdf',
        'fe_launch': 'application/vnd.denovo.fcselayout-link',
        'fg5': 'application/vnd.fujitsu.oasysgp',
        'fh': 'image/x-freehand',
        'fif': ['application/fractals', 'image/fif'],
        'fig': 'application/x-xfig',
        'fli': ['video/fli', 'video/x-fli'],
        'flo': ['image/florian', 'application/vnd.micrografx.flo'],
        'flr': 'x-world/x-vrml',
        'flv': 'video/x-flv',
        'flw': 'application/vnd.kde.kivio',
        'flx': 'text/vnd.fmi.flexstor',
        'fly': 'text/vnd.fly',
        'fm': 'application/vnd.framemaker',
        'fmf': 'video/x-atomic3d-feature',
        'fnc': 'application/vnd.frogans.fnc',
        'for': ['text/plain', 'text/x-fortran'],
        'fpx': ['image/vnd.fpx', 'image/vnd.net-fpx'],
        'frl': 'application/freeloader',
        'fsc': 'application/vnd.fsc.weblaunch',
        'fst': 'image/vnd.fst',
        'ftc': 'application/vnd.fluxtime.clip',
        'fti': 'application/vnd.anser-web-funds-transfer-initiation',
        'funk': 'audio/make',
        'fvt': 'video/vnd.fvt',
        'fxp': 'application/vnd.adobe.fxp',
        'fzs': 'application/vnd.fuzzysheet',
        'g': 'text/plain',
        'g2w': 'application/vnd.geoplan',
        'g3': 'image/g3fax',
        'g3w': 'application/vnd.geospace',
        'gac': 'application/vnd.groove-account',
        'gdl': 'model/vnd.gdl',
        'geo': 'application/vnd.dynageo',
        'gex': 'application/vnd.geometry-explorer',
        'ggb': 'application/vnd.geogebra.file',
        'ggt': 'application/vnd.geogebra.tool',
        'ghf': 'application/vnd.groove-help',
        'gif': 'image/gif',
        'gim': 'application/vnd.groove-identity-message',
        'gl': ['video/gl', 'video/x-gl'],
        'gmx': 'application/vnd.gmx',
        'gnumeric': 'application/x-gnumeric',
        'gph': 'application/vnd.flographit',
        'gqf': 'application/vnd.grafeq',
        'gram': 'application/srgs',
        'grv': 'application/vnd.groove-injector',
        'grxml': 'application/srgs+xml',
        'gsd': 'audio/x-gsm',
        'gsf': 'application/x-font-ghostscript',
        'gsm': 'audio/x-gsm',
        'gsp': 'application/x-gsp',
        'gss': 'application/x-gss',
        'gtar': 'application/x-gtar',
        'gtm': 'application/vnd.groove-tool-message',
        'gtw': 'model/vnd.gtw',
        'gv': 'text/vnd.graphviz',
        'gxt': 'application/vnd.geonext',
        'gz': ['application/x-gzip', 'application/x-compressed'],
        'gzip': ['multipart/x-gzip', 'application/x-gzip'],
        'h': ['text/plain', 'text/x-h'],
        'h261': 'video/h261',
        'h263': 'video/h263',
        'h264': 'video/h264',
        'hal': 'application/vnd.hal+xml',
        'hbci': 'application/vnd.hbci',
        'hdf': 'application/x-hdf',
        'help': 'application/x-helpfile',
        'hgl': 'application/vnd.hp-hpgl',
        'hh': ['text/plain', 'text/x-h'],
        'hlb': 'text/x-script',
        'hlp': ['application/winhlp', 'application/hlp', 'application/x-helpfile', 'application/x-winhelp'],
        'hpg': 'application/vnd.hp-hpgl',
        'hpgl': 'application/vnd.hp-hpgl',
        'hpid': 'application/vnd.hp-hpid',
        'hps': 'application/vnd.hp-hps',
        'hqx': ['application/mac-binhex40', 'application/binhex', 'application/binhex4', 'application/mac-binhex', 'application/x-binhex40', 'application/x-mac-binhex40'],
        'hta': 'application/hta',
        'htc': 'text/x-component',
        'htke': 'application/vnd.kenameaapp',
        'htm': 'text/html',
        'html': 'text/html',
        'htmls': 'text/html',
        'htt': 'text/webviewhtml',
        'htx': 'text/html',
        'hvd': 'application/vnd.yamaha.hv-dic',
        'hvp': 'application/vnd.yamaha.hv-voice',
        'hvs': 'application/vnd.yamaha.hv-script',
        'i2g': 'application/vnd.intergeo',
        'icc': 'application/vnd.iccprofile',
        'ice': 'x-conference/x-cooltalk',
        'ico': 'image/x-icon',
        'ics': 'text/calendar',
        'idc': 'text/plain',
        'ief': 'image/ief',
        'iefs': 'image/ief',
        'ifm': 'application/vnd.shana.informed.formdata',
        'iges': ['application/iges', 'model/iges'],
        'igl': 'application/vnd.igloader',
        'igm': 'application/vnd.insors.igm',
        'igs': ['application/iges', 'model/iges'],
        'igx': 'application/vnd.micrografx.igx',
        'iif': 'application/vnd.shana.informed.interchange',
        'iii': 'application/x-iphone',
        'ima': 'application/x-ima',
        'imap': 'application/x-httpd-imap',
        'imp': 'application/vnd.accpac.simply.imp',
        'ims': 'application/vnd.ms-ims',
        'inf': 'application/inf',
        'ins': ['application/x-internet-signup', 'application/x-internett-signup'],
        'ip': 'application/x-ip2',
        'ipfix': 'application/ipfix',
        'ipk': 'application/vnd.shana.informed.package',
        'irm': 'application/vnd.ibm.rights-management',
        'irp': 'application/vnd.irepository.package+xml',
        'isp': 'application/x-internet-signup',
        'isu': 'video/x-isvideo',
        'it': 'audio/it',
        'itp': 'application/vnd.shana.informed.formtemplate',
        'iv': 'application/x-inventor',
        'ivp': 'application/vnd.immervision-ivp',
        'ivr': 'i-world/i-vrml',
        'ivu': 'application/vnd.immervision-ivu',
        'ivy': 'application/x-livescreen',
        'jad': 'text/vnd.sun.j2me.app-descriptor',
        'jam': ['application/vnd.jam', 'audio/x-jam'],
        'jar': 'application/java-archive',
        'jav': ['text/plain', 'text/x-java-source'],
        'java': ['text/plain', 'text/x-java-source,java', 'text/x-java-source'],
        'jcm': 'application/x-java-commerce',
        'jfif': ['image/pipeg', 'image/jpeg', 'image/pjpeg'],
        'jfif-tbnl': 'image/jpeg',
        'jisp': 'application/vnd.jisp',
        'jlt': 'application/vnd.hp-jlyt',
        'jnlp': 'application/x-java-jnlp-file',
        'joda': 'application/vnd.joost.joda-archive',
        'jpe': ['image/jpeg', 'image/pjpeg'],
        'jpeg': ['image/jpeg', 'image/pjpeg'],
        'jpg': ['image/jpeg', 'image/pjpeg'],
        'jpgv': 'video/jpeg',
        'jpm': 'video/jpm',
        'jps': 'image/x-jps',
        'js': ['application/javascript', 'application/ecmascript', 'text/javascript', 'text/ecmascript', 'application/x-javascript'],
        'json': 'application/json',
        'jut': 'image/jutvision',
        'kar': ['audio/midi', 'music/x-karaoke'],
        'karbon': 'application/vnd.kde.karbon',
        'kfo': 'application/vnd.kde.kformula',
        'kia': 'application/vnd.kidspiration',
        'kml': 'application/vnd.google-earth.kml+xml',
        'kmz': 'application/vnd.google-earth.kmz',
        'kne': 'application/vnd.kinar',
        'kon': 'application/vnd.kde.kontour',
        'kpr': 'application/vnd.kde.kpresenter',
        'ksh': ['application/x-ksh', 'text/x-script.ksh'],
        'ksp': 'application/vnd.kde.kspread',
        'ktx': 'image/ktx',
        'ktz': 'application/vnd.kahootz',
        'kwd': 'application/vnd.kde.kword',
        'la': ['audio/nspaudio', 'audio/x-nspaudio'],
        'lam': 'audio/x-liveaudio',
        'lasxml': 'application/vnd.las.las+xml',
        'latex': 'application/x-latex',
        'lbd': 'application/vnd.llamagraphics.life-balance.desktop',
        'lbe': 'application/vnd.llamagraphics.life-balance.exchange+xml',
        'les': 'application/vnd.hhe.lesson-player',
        'lha': ['application/octet-stream', 'application/lha', 'application/x-lha'],
        'lhx': 'application/octet-stream',
        'link66': 'application/vnd.route66.link66+xml',
        'list': 'text/plain',
        'lma': ['audio/nspaudio', 'audio/x-nspaudio'],
        'log': 'text/plain',
        'lrm': 'application/vnd.ms-lrm',
        'lsf': 'video/x-la-asf',
        'lsp': ['application/x-lisp', 'text/x-script.lisp'],
        'lst': 'text/plain',
        'lsx': ['video/x-la-asf', 'text/x-la-asf'],
        'ltf': 'application/vnd.frogans.ltf',
        'ltx': 'application/x-latex',
        'lvp': 'audio/vnd.lucent.voice',
        'lwp': 'application/vnd.lotus-wordpro',
        'lzh': ['application/octet-stream', 'application/x-lzh'],
        'lzx': ['application/lzx', 'application/octet-stream', 'application/x-lzx'],
        'm': ['text/plain', 'text/x-m'],
        'm13': 'application/x-msmediaview',
        'm14': 'application/x-msmediaview',
        'm1v': 'video/mpeg',
        'm21': 'application/mp21',
        'm2a': 'audio/mpeg',
        'm2v': 'video/mpeg',
        'm3u': ['audio/x-mpegurl', 'audio/x-mpequrl'],
        'm3u8': 'application/vnd.apple.mpegurl',
        'm4v': 'video/x-m4v',
        'ma': 'application/mathematica',
        'mads': 'application/mads+xml',
        'mag': 'application/vnd.ecowin.chart',
        'man': 'application/x-troff-man',
        'map': 'application/x-navimap',
        'mar': 'text/plain',
        'mathml': 'application/mathml+xml',
        'mbd': 'application/mbedlet',
        'mbk': 'application/vnd.mobius.mbk',
        'mbox': 'application/mbox',
        'mc$': 'application/x-magic-cap-package-1.0',
        'mc1': 'application/vnd.medcalcdata',
        'mcd': ['application/mcad', 'application/vnd.mcd', 'application/x-mathcad'],
        'mcf': ['image/vasa', 'text/mcf'],
        'mcp': 'application/netmc',
        'mcurl': 'text/vnd.curl.mcurl',
        'mdb': 'application/x-msaccess',
        'mdi': 'image/vnd.ms-modi',
        'me': 'application/x-troff-me',
        'meta4': 'application/metalink4+xml',
        'mets': 'application/mets+xml',
        'mfm': 'application/vnd.mfmp',
        'mgp': 'application/vnd.osgeo.mapguide.package',
        'mgz': 'application/vnd.proteus.magazine',
        'mht': 'message/rfc822',
        'mhtml': 'message/rfc822',
        'mid': ['audio/mid', 'audio/midi', 'music/crescendo', 'x-music/x-midi', 'audio/x-midi', 'application/x-midi', 'audio/x-mid'],
        'midi': ['audio/midi', 'music/crescendo', 'x-music/x-midi', 'audio/x-midi', 'application/x-midi', 'audio/x-mid'],
        'mif': ['application/vnd.mif', 'application/x-mif', 'application/x-frame'],
        'mime': ['message/rfc822', 'www/mime'],
        'mj2': 'video/mj2',
        'mjf': 'audio/x-vnd.audioexplosion.mjuicemediafile',
        'mjpg': 'video/x-motion-jpeg',
        'mlp': 'application/vnd.dolby.mlp',
        'mm': ['application/base64', 'application/x-meme'],
        'mmd': 'application/vnd.chipnuts.karaoke-mmd',
        'mme': 'application/base64',
        'mmf': 'application/vnd.smaf',
        'mmr': 'image/vnd.fujixerox.edmics-mmr',
        'mny': 'application/x-msmoney',
        'mod': ['audio/mod', 'audio/x-mod'],
        'mods': 'application/mods+xml',
        'moov': 'video/quicktime',
        'mov': 'video/quicktime',
        'movie': 'video/x-sgi-movie',
        'mp2': ['video/mpeg', 'audio/mpeg', 'video/x-mpeg', 'audio/x-mpeg', 'video/x-mpeq2a'],
        'mp3': ['audio/mpeg', 'audio/mpeg3', 'video/mpeg', 'audio/x-mpeg-3', 'video/x-mpeg'],
        'mp4': ['video/mp4', 'application/mp4'],
        'mp4a': 'audio/mp4',
        'mpa': ['video/mpeg', 'audio/mpeg'],
        'mpc': ['application/vnd.mophun.certificate', 'application/x-project'],
        'mpe': 'video/mpeg',
        'mpeg': 'video/mpeg',
        'mpg': ['video/mpeg', 'audio/mpeg'],
        'mpga': 'audio/mpeg',
        'mpkg': 'application/vnd.apple.installer+xml',
        'mpm': 'application/vnd.blueice.multipass',
        'mpn': 'application/vnd.mophun.application',
        'mpp': 'application/vnd.ms-project',
        'mpt': 'application/x-project',
        'mpv': 'application/x-project',
        'mpv2': 'video/mpeg',
        'mpx': 'application/x-project',
        'mpy': 'application/vnd.ibm.minipay',
        'mqy': 'application/vnd.mobius.mqy',
        'mrc': 'application/marc',
        'mrcx': 'application/marcxml+xml',
        'ms': 'application/x-troff-ms',
        'mscml': 'application/mediaservercontrol+xml',
        'mseq': 'application/vnd.mseq',
        'msf': 'application/vnd.epson.msf',
        'msg': 'application/vnd.ms-outlook',
        'msh': 'model/mesh',
        'msl': 'application/vnd.mobius.msl',
        'msty': 'application/vnd.muvee.style',
        'mts': 'model/vnd.mts',
        'mus': 'application/vnd.musician',
        'musicxml': 'application/vnd.recordare.musicxml+xml',
        'mv': 'video/x-sgi-movie',
        'mvb': 'application/x-msmediaview',
        'mwf': 'application/vnd.mfer',
        'mxf': 'application/mxf',
        'mxl': 'application/vnd.recordare.musicxml',
        'mxml': 'application/xv+xml',
        'mxs': 'application/vnd.triscape.mxs',
        'mxu': 'video/vnd.mpegurl',
        'my': 'audio/make',
        'mzz': 'application/x-vnd.audioexplosion.mzz',
        'n-gage': 'application/vnd.nokia.n-gage.symbian.install',
        'n3': 'text/n3',
        'nap': 'image/naplps',
        'naplps': 'image/naplps',
        'nbp': 'application/vnd.wolfram.player',
        'nc': 'application/x-netcdf',
        'ncm': 'application/vnd.nokia.configuration-message',
        'ncx': 'application/x-dtbncx+xml',
        'ngdat': 'application/vnd.nokia.n-gage.data',
        'nif': 'image/x-niff',
        'niff': 'image/x-niff',
        'nix': 'application/x-mix-transfer',
        'nlu': 'application/vnd.neurolanguage.nlu',
        'nml': 'application/vnd.enliven',
        'nnd': 'application/vnd.noblenet-directory',
        'nns': 'application/vnd.noblenet-sealer',
        'nnw': 'application/vnd.noblenet-web',
        'npx': 'image/vnd.net-fpx',
        'nsc': 'application/x-conference',
        'nsf': 'application/vnd.lotus-notes',
        'nvd': 'application/x-navidoc',
        'nws': 'message/rfc822',
        'o': 'application/octet-stream',
        'oa2': 'application/vnd.fujitsu.oasys2',
        'oa3': 'application/vnd.fujitsu.oasys3',
        'oas': 'application/vnd.fujitsu.oasys',
        'obd': 'application/x-msbinder',
        'oda': 'application/oda',
        'odb': 'application/vnd.oasis.opendocument.database',
        'odc': 'application/vnd.oasis.opendocument.chart',
        'odf': 'application/vnd.oasis.opendocument.formula',
        'odft': 'application/vnd.oasis.opendocument.formula-template',
        'odg': 'application/vnd.oasis.opendocument.graphics',
        'odi': 'application/vnd.oasis.opendocument.image',
        'odm': 'application/vnd.oasis.opendocument.text-master',
        'odp': 'application/vnd.oasis.opendocument.presentation',
        'ods': 'application/vnd.oasis.opendocument.spreadsheet',
        'odt': 'application/vnd.oasis.opendocument.text',
        'oga': 'audio/ogg',
        'ogv': 'video/ogg',
        'ogx': 'application/ogg',
        'omc': 'application/x-omc',
        'omcd': 'application/x-omcdatamaker',
        'omcr': 'application/x-omcregerator',
        'onetoc': 'application/onenote',
        'opf': 'application/oebps-package+xml',
        'org': 'application/vnd.lotus-organizer',
        'osf': 'application/vnd.yamaha.openscoreformat',
        'osfpvg': 'application/vnd.yamaha.openscoreformat.osfpvg+xml',
        'otc': 'application/vnd.oasis.opendocument.chart-template',
        'otf': 'application/x-font-otf',
        'otg': 'application/vnd.oasis.opendocument.graphics-template',
        'oth': 'application/vnd.oasis.opendocument.text-web',
        'oti': 'application/vnd.oasis.opendocument.image-template',
        'otp': 'application/vnd.oasis.opendocument.presentation-template',
        'ots': 'application/vnd.oasis.opendocument.spreadsheet-template',
        'ott': 'application/vnd.oasis.opendocument.text-template',
        'oxt': 'application/vnd.openofficeorg.extension',
        'p': 'text/x-pascal',
        'p10': ['application/pkcs10', 'application/x-pkcs10'],
        'p12': ['application/pkcs-12', 'application/x-pkcs12'],
        'p7a': 'application/x-pkcs7-signature',
        'p7b': 'application/x-pkcs7-certificates',
        'p7c': ['application/pkcs7-mime', 'application/x-pkcs7-mime'],
        'p7m': ['application/pkcs7-mime', 'application/x-pkcs7-mime'],
        'p7r': 'application/x-pkcs7-certreqresp',
        'p7s': ['application/pkcs7-signature', 'application/x-pkcs7-signature'],
        'p8': 'application/pkcs8',
        'par': 'text/plain-bas',
        'part': 'application/pro_eng',
        'pas': 'text/pascal',
        'paw': 'application/vnd.pawaafile',
        'pbd': 'application/vnd.powerbuilder6',
        'pbm': 'image/x-portable-bitmap',
        'pcf': 'application/x-font-pcf',
        'pcl': ['application/vnd.hp-pcl', 'application/x-pcl'],
        'pclxl': 'application/vnd.hp-pclxl',
        'pct': 'image/x-pict',
        'pcurl': 'application/vnd.curl.pcurl',
        'pcx': 'image/x-pcx',
        'pdb': ['application/vnd.palm', 'chemical/x-pdb'],
        'pdf': 'application/pdf',
        'pfa': 'application/x-font-type1',
        'pfr': 'application/font-tdpfr',
        'pfunk': ['audio/make', 'audio/make.my.funk'],
        'pfx': 'application/x-pkcs12',
        'pgm': ['image/x-portable-graymap', 'image/x-portable-greymap'],
        'pgn': 'application/x-chess-pgn',
        'pgp': 'application/pgp-signature',
        'pic': ['image/pict', 'image/x-pict'],
        'pict': 'image/pict',
        'pkg': 'application/x-newton-compatible-pkg',
        'pki': 'application/pkixcmp',
        'pkipath': 'application/pkix-pkipath',
        'pko': ['application/ynd.ms-pkipko', 'application/vnd.ms-pki.pko'],
        'pl': ['text/plain', 'text/x-script.perl'],
        'plb': 'application/vnd.3gpp.pic-bw-large',
        'plc': 'application/vnd.mobius.plc',
        'plf': 'application/vnd.pocketlearn',
        'pls': 'application/pls+xml',
        'plx': 'application/x-pixclscript',
        'pm': ['text/x-script.perl-module', 'image/x-xpixmap'],
        'pm4': 'application/x-pagemaker',
        'pm5': 'application/x-pagemaker',
        'pma': 'application/x-perfmon',
        'pmc': 'application/x-perfmon',
        'pml': ['application/vnd.ctc-posml', 'application/x-perfmon'],
        'pmr': 'application/x-perfmon',
        'pmw': 'application/x-perfmon',
        'png': 'image/png',
        'pnm': ['application/x-portable-anymap', 'image/x-portable-anymap'],
        'portpkg': 'application/vnd.macports.portpkg',
        'pot': ['application/vnd.ms-powerpoint', 'application/mspowerpoint'],
        'potm': 'application/vnd.ms-powerpoint.template.macroenabled.12',
        'potx': 'application/vnd.openxmlformats-officedocument.presentationml.template',
        'pov': 'model/x-pov',
        'ppa': 'application/vnd.ms-powerpoint',
        'ppam': 'application/vnd.ms-powerpoint.addin.macroenabled.12',
        'ppd': 'application/vnd.cups-ppd',
        'ppm': 'image/x-portable-pixmap',
        'pps': ['application/vnd.ms-powerpoint', 'application/mspowerpoint'],
        'ppsm': 'application/vnd.ms-powerpoint.slideshow.macroenabled.12',
        'ppsx': 'application/vnd.openxmlformats-officedocument.presentationml.slideshow',
        'ppt': ['application/vnd.ms-powerpoint', 'application/mspowerpoint', 'application/powerpoint', 'application/x-mspowerpoint'],
        'pptm': 'application/vnd.ms-powerpoint.presentation.macroenabled.12',
        'pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        'ppz': 'application/mspowerpoint',
        'prc': 'application/x-mobipocket-ebook',
        'pre': ['application/vnd.lotus-freelance', 'application/x-freelance'],
        'prf': 'application/pics-rules',
        'prt': 'application/pro_eng',
        'ps': 'application/postscript',
        'psb': 'application/vnd.3gpp.pic-bw-small',
        'psd': ['application/octet-stream', 'image/vnd.adobe.photoshop'],
        'psf': 'application/x-font-linux-psf',
        'pskcxml': 'application/pskc+xml',
        'ptid': 'application/vnd.pvi.ptid1',
        'pub': 'application/x-mspublisher',
        'pvb': 'application/vnd.3gpp.pic-bw-var',
        'pvu': 'paleovu/x-pv',
        'pwn': 'application/vnd.3m.post-it-notes',
        'pwz': 'application/vnd.ms-powerpoint',
        'py': 'text/x-script.phyton',
        'pya': 'audio/vnd.ms-playready.media.pya',
        'pyc': 'applicaiton/x-bytecode.python',
        'pyv': 'video/vnd.ms-playready.media.pyv',
        'qam': 'application/vnd.epson.quickanime',
        'qbo': 'application/vnd.intu.qbo',
        'qcp': 'audio/vnd.qcelp',
        'qd3': 'x-world/x-3dmf',
        'qd3d': 'x-world/x-3dmf',
        'qfx': 'application/vnd.intu.qfx',
        'qif': 'image/x-quicktime',
        'qps': 'application/vnd.publishare-delta-tree',
        'qt': 'video/quicktime',
        'qtc': 'video/x-qtc',
        'qti': 'image/x-quicktime',
        'qtif': 'image/x-quicktime',
        'qxd': 'application/vnd.quark.quarkxpress',
        'ra': ['audio/x-realaudio', 'audio/x-pn-realaudio', 'audio/x-pn-realaudio-plugin'],
        'ram': 'audio/x-pn-realaudio',
        'rar': 'application/x-rar-compressed',
        'ras': ['image/cmu-raster', 'application/x-cmu-raster', 'image/x-cmu-raster'],
        'rast': 'image/cmu-raster',
        'rcprofile': 'application/vnd.ipunplugged.rcprofile',
        'rdf': 'application/rdf+xml',
        'rdz': 'application/vnd.data-vision.rdz',
        'rep': 'application/vnd.businessobjects',
        'res': 'application/x-dtbresource+xml',
        'rexx': 'text/x-script.rexx',
        'rf': 'image/vnd.rn-realflash',
        'rgb': 'image/x-rgb',
        'rif': 'application/reginfo+xml',
        'rip': 'audio/vnd.rip',
        'rl': 'application/resource-lists+xml',
        'rlc': 'image/vnd.fujixerox.edmics-rlc',
        'rld': 'application/resource-lists-diff+xml',
        'rm': ['application/vnd.rn-realmedia', 'audio/x-pn-realaudio'],
        'rmi': 'audio/mid',
        'rmm': 'audio/x-pn-realaudio',
        'rmp': ['audio/x-pn-realaudio-plugin', 'audio/x-pn-realaudio'],
        'rms': 'application/vnd.jcp.javame.midlet-rms',
        'rnc': 'application/relax-ng-compact-syntax',
        'rng': ['application/ringing-tones', 'application/vnd.nokia.ringing-tone'],
        'rnx': 'application/vnd.rn-realplayer',
        'roff': 'application/x-troff',
        'rp': 'image/vnd.rn-realpix',
        'rp9': 'application/vnd.cloanto.rp9',
        'rpm': 'audio/x-pn-realaudio-plugin',
        'rpss': 'application/vnd.nokia.radio-presets',
        'rpst': 'application/vnd.nokia.radio-preset',
        'rq': 'application/sparql-query',
        'rs': 'application/rls-services+xml',
        'rsd': 'application/rsd+xml',
        'rt': ['text/richtext', 'text/vnd.rn-realtext'],
        'rtf': ['application/rtf', 'text/richtext', 'application/x-rtf'],
        'rtx': ['text/richtext', 'application/rtf'],
        'rv': 'video/vnd.rn-realvideo',
        's': 'text/x-asm',
        's3m': 'audio/s3m',
        'saf': 'application/vnd.yamaha.smaf-audio',
        'saveme': 'application/octet-stream',
        'sbk': 'application/x-tbook',
        'sbml': 'application/sbml+xml',
        'sc': 'application/vnd.ibm.secure-container',
        'scd': 'application/x-msschedule',
        'scm': ['application/vnd.lotus-screencam', 'video/x-scm', 'text/x-script.guile', 'application/x-lotusscreencam', 'text/x-script.scheme'],
        'scq': 'application/scvp-cv-request',
        'scs': 'application/scvp-cv-response',
        'sct': 'text/scriptlet',
        'scurl': 'text/vnd.curl.scurl',
        'sda': 'application/vnd.stardivision.draw',
        'sdc': 'application/vnd.stardivision.calc',
        'sdd': 'application/vnd.stardivision.impress',
        'sdkm': 'application/vnd.solent.sdkm+xml',
        'sdml': 'text/plain',
        'sdp': ['application/sdp', 'application/x-sdp'],
        'sdr': 'application/sounder',
        'sdw': 'application/vnd.stardivision.writer',
        'sea': ['application/sea', 'application/x-sea'],
        'see': 'application/vnd.seemail',
        'seed': 'application/vnd.fdsn.seed',
        'sema': 'application/vnd.sema',
        'semd': 'application/vnd.semd',
        'semf': 'application/vnd.semf',
        'ser': 'application/java-serialized-object',
        'set': 'application/set',
        'setpay': 'application/set-payment-initiation',
        'setreg': 'application/set-registration-initiation',
        'sfd-hdstx': 'application/vnd.hydrostatix.sof-data',
        'sfs': 'application/vnd.spotfire.sfs',
        'sgl': 'application/vnd.stardivision.writer-global',
        'sgm': ['text/sgml', 'text/x-sgml'],
        'sgml': ['text/sgml', 'text/x-sgml'],
        'sh': ['application/x-shar', 'application/x-bsh', 'application/x-sh', 'text/x-script.sh'],
        'shar': ['application/x-bsh', 'application/x-shar'],
        'shf': 'application/shf+xml',
        'shtml': ['text/html', 'text/x-server-parsed-html'],
        'sid': 'audio/x-psid',
        'sis': 'application/vnd.symbian.install',
        'sit': ['application/x-stuffit', 'application/x-sit'],
        'sitx': 'application/x-stuffitx',
        'skd': 'application/x-koan',
        'skm': 'application/x-koan',
        'skp': ['application/vnd.koan', 'application/x-koan'],
        'skt': 'application/x-koan',
        'sl': 'application/x-seelogo',
        'sldm': 'application/vnd.ms-powerpoint.slide.macroenabled.12',
        'sldx': 'application/vnd.openxmlformats-officedocument.presentationml.slide',
        'slt': 'application/vnd.epson.salt',
        'sm': 'application/vnd.stepmania.stepchart',
        'smf': 'application/vnd.stardivision.math',
        'smi': ['application/smil', 'application/smil+xml'],
        'smil': 'application/smil',
        'snd': ['audio/basic', 'audio/x-adpcm'],
        'snf': 'application/x-font-snf',
        'sol': 'application/solids',
        'spc': ['text/x-speech', 'application/x-pkcs7-certificates'],
        'spf': 'application/vnd.yamaha.smaf-phrase',
        'spl': ['application/futuresplash', 'application/x-futuresplash'],
        'spot': 'text/vnd.in3d.spot',
        'spp': 'application/scvp-vp-response',
        'spq': 'application/scvp-vp-request',
        'spr': 'application/x-sprite',
        'sprite': 'application/x-sprite',
        'src': 'application/x-wais-source',
        'sru': 'application/sru+xml',
        'srx': 'application/sparql-results+xml',
        'sse': 'application/vnd.kodak-descriptor',
        'ssf': 'application/vnd.epson.ssf',
        'ssi': 'text/x-server-parsed-html',
        'ssm': 'application/streamingmedia',
        'ssml': 'application/ssml+xml',
        'sst': ['application/vnd.ms-pkicertstore', 'application/vnd.ms-pki.certstore'],
        'st': 'application/vnd.sailingtracker.track',
        'stc': 'application/vnd.sun.xml.calc.template',
        'std': 'application/vnd.sun.xml.draw.template',
        'step': 'application/step',
        'stf': 'application/vnd.wt.stf',
        'sti': 'application/vnd.sun.xml.impress.template',
        'stk': 'application/hyperstudio',
        'stl': ['application/vnd.ms-pkistl', 'application/sla', 'application/vnd.ms-pki.stl', 'application/x-navistyle'],
        'stm': 'text/html',
        'stp': 'application/step',
        'str': 'application/vnd.pg.format',
        'stw': 'application/vnd.sun.xml.writer.template',
        'sub': 'image/vnd.dvb.subtitle',
        'sus': 'application/vnd.sus-calendar',
        'sv4cpio': 'application/x-sv4cpio',
        'sv4crc': 'application/x-sv4crc',
        'svc': 'application/vnd.dvb.service',
        'svd': 'application/vnd.svd',
        'svf': ['image/vnd.dwg', 'image/x-dwg'],
        'svg': 'image/svg+xml',
        'svr': ['x-world/x-svr', 'application/x-world'],
        'swf': 'application/x-shockwave-flash',
        'swi': 'application/vnd.aristanetworks.swi',
        'sxc': 'application/vnd.sun.xml.calc',
        'sxd': 'application/vnd.sun.xml.draw',
        'sxg': 'application/vnd.sun.xml.writer.global',
        'sxi': 'application/vnd.sun.xml.impress',
        'sxm': 'application/vnd.sun.xml.math',
        'sxw': 'application/vnd.sun.xml.writer',
        't': ['text/troff', 'application/x-troff'],
        'talk': 'text/x-speech',
        'tao': 'application/vnd.tao.intent-module-archive',
        'tar': 'application/x-tar',
        'tbk': ['application/toolbook', 'application/x-tbook'],
        'tcap': 'application/vnd.3gpp2.tcap',
        'tcl': ['text/x-script.tcl', 'application/x-tcl'],
        'tcsh': 'text/x-script.tcsh',
        'teacher': 'application/vnd.smart.teacher',
        'tei': 'application/tei+xml',
        'tex': 'application/x-tex',
        'texi': 'application/x-texinfo',
        'texinfo': 'application/x-texinfo',
        'text': ['application/plain', 'text/plain'],
        'tfi': 'application/thraud+xml',
        'tfm': 'application/x-tex-tfm',
        'tgz': ['application/gnutar', 'application/x-compressed'],
        'thmx': 'application/vnd.ms-officetheme',
        'tif': ['image/tiff', 'image/x-tiff'],
        'tiff': ['image/tiff', 'image/x-tiff'],
        'tmo': 'application/vnd.tmobile-livetv',
        'torrent': 'application/x-bittorrent',
        'tpl': 'application/vnd.groove-tool-template',
        'tpt': 'application/vnd.trid.tpt',
        'tr': 'application/x-troff',
        'tra': 'application/vnd.trueapp',
        'trm': 'application/x-msterminal',
        'tsd': 'application/timestamped-data',
        'tsi': 'audio/tsp-audio',
        'tsp': ['application/dsptype', 'audio/tsplayer'],
        'tsv': 'text/tab-separated-values',
        'ttf': 'application/x-font-ttf',
        'ttl': 'text/turtle',
        'turbot': 'image/florian',
        'twd': 'application/vnd.simtech-mindmapper',
        'txd': 'application/vnd.genomatix.tuxedo',
        'txf': 'application/vnd.mobius.txf',
        'txt': 'text/plain',
        'ufd': 'application/vnd.ufdl',
        'uil': 'text/x-uil',
        'uls': 'text/iuls',
        'umj': 'application/vnd.umajin',
        'uni': 'text/uri-list',
        'unis': 'text/uri-list',
        'unityweb': 'application/vnd.unity',
        'unv': 'application/i-deas',
        'uoml': 'application/vnd.uoml+xml',
        'uri': 'text/uri-list',
        'uris': 'text/uri-list',
        'ustar': ['application/x-ustar', 'multipart/x-ustar'],
        'utz': 'application/vnd.uiq.theme',
        'uu': ['application/octet-stream', 'text/x-uuencode'],
        'uue': 'text/x-uuencode',
        'uva': 'audio/vnd.dece.audio',
        'uvh': 'video/vnd.dece.hd',
        'uvi': 'image/vnd.dece.graphic',
        'uvm': 'video/vnd.dece.mobile',
        'uvp': 'video/vnd.dece.pd',
        'uvs': 'video/vnd.dece.sd',
        'uvu': 'video/vnd.uvvu.mp4',
        'uvv': 'video/vnd.dece.video',
        'vcd': 'application/x-cdlink',
        'vcf': 'text/x-vcard',
        'vcg': 'application/vnd.groove-vcard',
        'vcs': 'text/x-vcalendar',
        'vcx': 'application/vnd.vcx',
        'vda': 'application/vda',
        'vdo': 'video/vdo',
        'vew': 'application/groupwise',
        'vis': 'application/vnd.visionary',
        'viv': ['video/vivo', 'video/vnd.vivo'],
        'vivo': ['video/vivo', 'video/vnd.vivo'],
        'vmd': 'application/vocaltec-media-desc',
        'vmf': 'application/vocaltec-media-file',
        'voc': ['audio/voc', 'audio/x-voc'],
        'vos': 'video/vosaic',
        'vox': 'audio/voxware',
        'vqe': 'audio/x-twinvq-plugin',
        'vqf': 'audio/x-twinvq',
        'vql': 'audio/x-twinvq-plugin',
        'vrml': ['model/vrml', 'x-world/x-vrml', 'application/x-vrml'],
        'vrt': 'x-world/x-vrt',
        'vsd': ['application/vnd.visio', 'application/x-visio'],
        'vsf': 'application/vnd.vsf',
        'vst': 'application/x-visio',
        'vsw': 'application/x-visio',
        'vtu': 'model/vnd.vtu',
        'vxml': 'application/voicexml+xml',
        'w60': 'application/wordperfect6.0',
        'w61': 'application/wordperfect6.1',
        'w6w': 'application/msword',
        'wad': 'application/x-doom',
        'wav': ['audio/wav', 'audio/x-wav'],
        'wax': 'audio/x-ms-wax',
        'wb1': 'application/x-qpro',
        'wbmp': 'image/vnd.wap.wbmp',
        'wbs': 'application/vnd.criticaltools.wbs+xml',
        'wbxml': 'application/vnd.wap.wbxml',
        'wcm': 'application/vnd.ms-works',
        'wdb': 'application/vnd.ms-works',
        'web': 'application/vnd.xara',
        'weba': 'audio/webm',
        'webm': 'video/webm',
        'webp': 'image/webp',
        'wg': 'application/vnd.pmi.widget',
        'wgt': 'application/widget',
        'wiz': 'application/msword',
        'wk1': 'application/x-123',
        'wks': 'application/vnd.ms-works',
        'wm': 'video/x-ms-wm',
        'wma': 'audio/x-ms-wma',
        'wmd': 'application/x-ms-wmd',
        'wmf': ['windows/metafile', 'application/x-msmetafile'],
        'wml': 'text/vnd.wap.wml',
        'wmlc': 'application/vnd.wap.wmlc',
        'wmls': 'text/vnd.wap.wmlscript',
        'wmlsc': 'application/vnd.wap.wmlscriptc',
        'wmv': 'video/x-ms-wmv',
        'wmx': 'video/x-ms-wmx',
        'wmz': 'application/x-ms-wmz',
        'woff': 'application/x-font-woff',
        'word': 'application/msword',
        'wp': 'application/wordperfect',
        'wp5': ['application/wordperfect', 'application/wordperfect6.0'],
        'wp6': 'application/wordperfect',
        'wpd': ['application/wordperfect', 'application/vnd.wordperfect', 'application/x-wpwin'],
        'wpl': 'application/vnd.ms-wpl',
        'wps': 'application/vnd.ms-works',
        'wq1': 'application/x-lotus',
        'wqd': 'application/vnd.wqd',
        'wri': ['application/mswrite', 'application/x-wri', 'application/x-mswrite'],
        'wrl': ['model/vrml', 'x-world/x-vrml', 'application/x-world'],
        'wrz': ['model/vrml', 'x-world/x-vrml'],
        'wsc': 'text/scriplet',
        'wsdl': 'application/wsdl+xml',
        'wspolicy': 'application/wspolicy+xml',
        'wsrc': 'application/x-wais-source',
        'wtb': 'application/vnd.webturbo',
        'wtk': 'application/x-wintalk',
        'wvx': 'video/x-ms-wvx',
        'x-png': 'image/png',
        'x3d': 'application/vnd.hzn-3d-crossword',
        'xaf': 'x-world/x-vrml',
        'xap': 'application/x-silverlight-app',
        'xar': 'application/vnd.xara',
        'xbap': 'application/x-ms-xbap',
        'xbd': 'application/vnd.fujixerox.docuworks.binder',
        'xbm': ['image/xbm', 'image/x-xbm', 'image/x-xbitmap'],
        'xdf': 'application/xcap-diff+xml',
        'xdm': 'application/vnd.syncml.dm+xml',
        'xdp': 'application/vnd.adobe.xdp+xml',
        'xdr': 'video/x-amt-demorun',
        'xdssc': 'application/dssc+xml',
        'xdw': 'application/vnd.fujixerox.docuworks',
        'xenc': 'application/xenc+xml',
        'xer': 'application/patch-ops-error+xml',
        'xfdf': 'application/vnd.adobe.xfdf',
        'xfdl': 'application/vnd.xfdl',
        'xgz': 'xgl/drawing',
        'xhtml': 'application/xhtml+xml',
        'xif': 'image/vnd.xiff',
        'xl': 'application/excel',
        'xla': ['application/vnd.ms-excel', 'application/excel', 'application/x-msexcel', 'application/x-excel'],
        'xlam': 'application/vnd.ms-excel.addin.macroenabled.12',
        'xlb': ['application/excel', 'application/vnd.ms-excel', 'application/x-excel'],
        'xlc': ['application/vnd.ms-excel', 'application/excel', 'application/x-excel'],
        'xld': ['application/excel', 'application/x-excel'],
        'xlk': ['application/excel', 'application/x-excel'],
        'xll': ['application/excel', 'application/vnd.ms-excel', 'application/x-excel'],
        'xlm': ['application/vnd.ms-excel', 'application/excel', 'application/x-excel'],
        'xls': ['application/vnd.ms-excel', 'application/excel', 'application/x-msexcel', 'application/x-excel'],
        'xlsb': 'application/vnd.ms-excel.sheet.binary.macroenabled.12',
        'xlsm': 'application/vnd.ms-excel.sheet.macroenabled.12',
        'xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'xlt': ['application/vnd.ms-excel', 'application/excel', 'application/x-excel'],
        'xltm': 'application/vnd.ms-excel.template.macroenabled.12',
        'xltx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.template',
        'xlv': ['application/excel', 'application/x-excel'],
        'xlw': ['application/vnd.ms-excel', 'application/excel', 'application/x-msexcel', 'application/x-excel'],
        'xm': 'audio/xm',
        'xml': ['application/xml', 'text/xml', 'application/atom+xml', 'application/rss+xml'],
        'xmz': 'xgl/movie',
        'xo': 'application/vnd.olpc-sugar',
        'xof': 'x-world/x-vrml',
        'xop': 'application/xop+xml',
        'xpi': 'application/x-xpinstall',
        'xpix': 'application/x-vnd.ls-xpix',
        'xpm': ['image/xpm', 'image/x-xpixmap'],
        'xpr': 'application/vnd.is-xpr',
        'xps': 'application/vnd.ms-xpsdocument',
        'xpw': 'application/vnd.intercon.formnet',
        'xslt': 'application/xslt+xml',
        'xsm': 'application/vnd.syncml+xml',
        'xspf': 'application/xspf+xml',
        'xsr': 'video/x-amt-showrun',
        'xul': 'application/vnd.mozilla.xul+xml',
        'xwd': ['image/x-xwd', 'image/x-xwindowdump'],
        'xyz': ['chemical/x-xyz', 'chemical/x-pdb'],
        'yang': 'application/yang',
        'yin': 'application/yin+xml',
        'z': ['application/x-compressed', 'application/x-compress'],
        'zaz': 'application/vnd.zzazz.deck+xml',
        'zip': ['application/zip', 'multipart/x-zip', 'application/x-zip-compressed', 'application/x-compressed'],
        'zir': 'application/vnd.zul',
        'zmm': 'application/vnd.handheld-entertainment+xml',
        'zoo': 'application/octet-stream',
        'zsh': 'text/x-script.zsh'
    }
};


/***/ }),
/* 48 */
/***/ (function(module, exports) {

module.exports = require("punycode");

/***/ }),
/* 49 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// expose to the world
module.exports = addressparser;

/**
 * Parses structured e-mail addresses from an address field
 *
 * Example:
 *
 *    'Name <address@domain>'
 *
 * will be converted to
 *
 *     [{name: 'Name', address: 'address@domain'}]
 *
 * @param {String} str Address field
 * @return {Array} An array of address objects
 */
function addressparser(str) {
    var tokenizer = new Tokenizer(str);
    var tokens = tokenizer.tokenize();

    var addresses = [];
    var address = [];
    var parsedAddresses = [];

    tokens.forEach(function (token) {
        if (token.type === 'operator' && (token.value === ',' || token.value === ';')) {
            if (address.length) {
                addresses.push(address);
            }
            address = [];
        } else {
            address.push(token);
        }
    });

    if (address.length) {
        addresses.push(address);
    }

    addresses.forEach(function (address) {
        address = _handleAddress(address);
        if (address.length) {
            parsedAddresses = parsedAddresses.concat(address);
        }
    });

    return parsedAddresses;
}

/**
 * Converts tokens for a single address into an address object
 *
 * @param {Array} tokens Tokens object
 * @return {Object} Address object
 */
function _handleAddress(tokens) {
    var token;
    var isGroup = false;
    var state = 'text';
    var address;
    var addresses = [];
    var data = {
        address: [],
        comment: [],
        group: [],
        text: []
    };
    var i;
    var len;

    // Filter out <addresses>, (comments) and regular text
    for (i = 0, len = tokens.length; i < len; i++) {
        token = tokens[i];
        if (token.type === 'operator') {
            switch (token.value) {
                case '<':
                    state = 'address';
                    break;
                case '(':
                    state = 'comment';
                    break;
                case ':':
                    state = 'group';
                    isGroup = true;
                    break;
                default:
                    state = 'text';
            }
        } else if (token.value) {
            if (state === 'address') {
                // handle use case where unquoted name includes a "<"
                // Apple Mail truncates everything between an unexpected < and an address
                // and so will we
                token.value = token.value.replace(/^[^<]*<\s*/, '');
            }
            data[state].push(token.value);
        }
    }

    // If there is no text but a comment, replace the two
    if (!data.text.length && data.comment.length) {
        data.text = data.comment;
        data.comment = [];
    }

    if (isGroup) {
        // http://tools.ietf.org/html/rfc2822#appendix-A.1.3
        data.text = data.text.join(' ');
        addresses.push({
            name: data.text || (address && address.name),
            group: data.group.length ? addressparser(data.group.join(',')) : []
        });
    } else {
        // If no address was found, try to detect one from regular text
        if (!data.address.length && data.text.length) {
            for (i = data.text.length - 1; i >= 0; i--) {
                if (data.text[i].match(/^[^@\s]+@[^@\s]+$/)) {
                    data.address = data.text.splice(i, 1);
                    break;
                }
            }

            var _regexHandler = function (address) {
                if (!data.address.length) {
                    data.address = [address.trim()];
                    return ' ';
                } else {
                    return address;
                }
            };

            // still no address
            if (!data.address.length) {
                for (i = data.text.length - 1; i >= 0; i--) {
                    // fixed the regex to parse email address correctly when email address has more than one @
                    data.text[i] = data.text[i].replace(/\s*\b[^@\s]+@[^\s]+\b\s*/, _regexHandler).trim();
                    if (data.address.length) {
                        break;
                    }
                }
            }
        }

        // If there's still is no text but a comment exixts, replace the two
        if (!data.text.length && data.comment.length) {
            data.text = data.comment;
            data.comment = [];
        }

        // Keep only the first address occurence, push others to regular text
        if (data.address.length > 1) {
            data.text = data.text.concat(data.address.splice(1));
        }

        // Join values with spaces
        data.text = data.text.join(' ');
        data.address = data.address.join(' ');

        if (!data.address && isGroup) {
            return [];
        } else {
            address = {
                address: data.address || data.text || '',
                name: data.text || data.address || ''
            };

            if (address.address === address.name) {
                if ((address.address || '').match(/@/)) {
                    address.name = '';
                } else {
                    address.address = '';
                }

            }

            addresses.push(address);
        }
    }

    return addresses;
}

/**
 * Creates a Tokenizer object for tokenizing address field strings
 *
 * @constructor
 * @param {String} str Address field string
 */
function Tokenizer(str) {
    this.str = (str || '').toString();
    this.operatorCurrent = '';
    this.operatorExpecting = '';
    this.node = null;
    this.escaped = false;

    this.list = [];
}

/**
 * Operator tokens and which tokens are expected to end the sequence
 */
Tokenizer.prototype.operators = {
    '"': '"',
    '(': ')',
    '<': '>',
    ',': '',
    ':': ';',
    // Semicolons are not a legal delimiter per the RFC2822 grammar other
    // than for terminating a group, but they are also not valid for any
    // other use in this context.  Given that some mail clients have
    // historically allowed the semicolon as a delimiter equivalent to the
    // comma in their UI, it makes sense to treat them the same as a comma
    // when used outside of a group.
    ';': ''
};

/**
 * Tokenizes the original input string
 *
 * @return {Array} An array of operator|text tokens
 */
Tokenizer.prototype.tokenize = function () {
    var chr, list = [];
    for (var i = 0, len = this.str.length; i < len; i++) {
        chr = this.str.charAt(i);
        this.checkChar(chr);
    }

    this.list.forEach(function (node) {
        node.value = (node.value || '').toString().trim();
        if (node.value) {
            list.push(node);
        }
    });

    return list;
};

/**
 * Checks if a character is an operator or text and acts accordingly
 *
 * @param {String} chr Character from the address field
 */
Tokenizer.prototype.checkChar = function (chr) {
    if ((chr in this.operators || chr === '\\') && this.escaped) {
        this.escaped = false;
    } else if (this.operatorExpecting && chr === this.operatorExpecting) {
        this.node = {
            type: 'operator',
            value: chr
        };
        this.list.push(this.node);
        this.node = null;
        this.operatorExpecting = '';
        this.escaped = false;
        return;
    } else if (!this.operatorExpecting && chr in this.operators) {
        this.node = {
            type: 'operator',
            value: chr
        };
        this.list.push(this.node);
        this.node = null;
        this.operatorExpecting = this.operators[chr];
        this.escaped = false;
        return;
    }

    if (!this.escaped && chr === '\\') {
        this.escaped = true;
        return;
    }

    if (!this.node) {
        this.node = {
            type: 'text',
            value: ''
        };
        this.list.push(this.node);
    }

    if (this.escaped && chr !== '\\') {
        this.node.value += '\\';
    }

    this.node.value += chr;
    this.escaped = false;
};


/***/ }),
/* 50 */
/***/ (function(module, exports) {

module.exports = require("http");

/***/ }),
/* 51 */
/***/ (function(module, exports) {

module.exports = require("https");

/***/ }),
/* 52 */
/***/ (function(module, exports) {

module.exports = require("zlib");

/***/ }),
/* 53 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// module to handle cookies

var urllib = __webpack_require__(4);

var SESSION_TIMEOUT = 1800; // 30 min

module.exports = Cookies;

/**
 * Creates a biskviit cookie jar for managing cookie values in memory
 *
 * @constructor
 * @param {Object} [options] Optional options object
 */
function Cookies(options) {
    this.options = options || {};
    this.cookies = [];
}

/**
 * Stores a cookie string to the cookie storage
 *
 * @param {String} cookieStr Value from the 'Set-Cookie:' header
 * @param {String} url Current URL
 */
Cookies.prototype.set = function (cookieStr, url) {
    var urlparts = urllib.parse(url || '');
    var cookie = this.parse(cookieStr);
    var domain;

    if (cookie.domain) {
        domain = cookie.domain.replace(/^\./, '');

        // do not allow cross origin cookies
        if (
            // can't be valid if the requested domain is shorter than current hostname
            urlparts.hostname.length < domain.length ||

            // prefix domains with dot to be sure that partial matches are not used
            ('.' + urlparts.hostname).substr(-domain.length + 1) !== ('.' + domain)) {
            cookie.domain = urlparts.hostname;
        }
    } else {
        cookie.domain = urlparts.hostname;
    }

    if (!cookie.path) {
        cookie.path = this.getPath(urlparts.pathname);
    }

    // if no expire date, then use sessionTimeout value
    if (!cookie.expires) {
        cookie.expires = new Date(Date.now() + (Number(this.options.sessionTimeout || SESSION_TIMEOUT) || SESSION_TIMEOUT) * 1000);
    }

    return this.add(cookie);
};

/**
 * Returns cookie string for the 'Cookie:' header.
 *
 * @param {String} url URL to check for
 * @returns {String} Cookie header or empty string if no matches were found
 */
Cookies.prototype.get = function (url) {
    return this.list(url).map(function (cookie) {
        return cookie.name + '=' + cookie.value;
    }).join('; ');
};

/**
 * Lists all valied cookie objects for the specified URL
 *
 * @param {String} url URL to check for
 * @returns {Array} An array of cookie objects
 */
Cookies.prototype.list = function (url) {
    var result = [];
    var i;
    var cookie;

    for (i = this.cookies.length - 1; i >= 0; i--) {
        cookie = this.cookies[i];

        if (this.isExpired(cookie)) {
            this.cookies.splice(i, i);
            continue;
        }

        if (this.match(cookie, url)) {
            result.unshift(cookie);
        }
    }

    return result;
};

/**
 * Parses cookie string from the 'Set-Cookie:' header
 *
 * @param {String} cookieStr String from the 'Set-Cookie:' header
 * @returns {Object} Cookie object
 */
Cookies.prototype.parse = function (cookieStr) {
    var cookie = {};

    (cookieStr || '').toString().split(';').forEach(function (cookiePart) {
        var valueParts = cookiePart.split('=');
        var key = valueParts.shift().trim().toLowerCase();
        var value = valueParts.join('=').trim();
        var domain;

        if (!key) {
            // skip empty parts
            return;
        }

        switch (key) {

            case 'expires':
                value = new Date(value);
                // ignore date if can not parse it
                if (value.toString() !== 'Invalid Date') {
                    cookie.expires = value;
                }
                break;

            case 'path':
                cookie.path = value;
                break;

            case 'domain':
                domain = value.toLowerCase();
                if (domain.length && domain.charAt(0) !== '.') {
                    domain = '.' + domain; // ensure preceeding dot for user set domains
                }
                cookie.domain = domain;
                break;

            case 'max-age':
                cookie.expires = new Date(Date.now() + (Number(value) || 0) * 1000);
                break;

            case 'secure':
                cookie.secure = true;
                break;

            case 'httponly':
                cookie.httponly = true;
                break;

            default:
                if (!cookie.name) {
                    cookie.name = key;
                    cookie.value = value;
                }
        }
    });

    return cookie;
};

/**
 * Checks if a cookie object is valid for a specified URL
 *
 * @param {Object} cookie Cookie object
 * @param {String} url URL to check for
 * @returns {Boolean} true if cookie is valid for specifiec URL
 */
Cookies.prototype.match = function (cookie, url) {
    var urlparts = urllib.parse(url || '');

    // check if hostname matches
    // .foo.com also matches subdomains, foo.com does not
    if (urlparts.hostname !== cookie.domain && (cookie.domain.charAt(0) !== '.' || ('.' + urlparts.hostname).substr(-cookie.domain.length) !== cookie.domain)) {
        return false;
    }

    // check if path matches
    var path = this.getPath(urlparts.pathname);
    if (path.substr(0, cookie.path.length) !== cookie.path) {
        return false;
    }

    // check secure argument
    if (cookie.secure && urlparts.protocol !== 'https:') {
        return false;
    }

    return true;
};

/**
 * Adds (or updates/removes if needed) a cookie object to the cookie storage
 *
 * @param {Object} cookie Cookie value to be stored
 */
Cookies.prototype.add = function (cookie) {
    var i;
    var len;

    // nothing to do here
    if (!cookie || !cookie.name) {
        return false;
    }

    // overwrite if has same params
    for (i = 0, len = this.cookies.length; i < len; i++) {
        if (this.compare(this.cookies[i], cookie)) {

            // check if the cookie needs to be removed instead
            if (this.isExpired(cookie)) {
                this.cookies.splice(i, 1); // remove expired/unset cookie
                return false;
            }

            this.cookies[i] = cookie;
            return true;
        }
    }

    // add as new if not already expired
    if (!this.isExpired(cookie)) {
        this.cookies.push(cookie);
    }

    return true;
};

/**
 * Checks if two cookie objects are the same
 *
 * @param {Object} a Cookie to check against
 * @param {Object} b Cookie to check against
 * @returns {Boolean} True, if the cookies are the same
 */
Cookies.prototype.compare = function (a, b) {
    return a.name === b.name && a.path === b.path && a.domain === b.domain && a.secure === b.secure && a.httponly === a.httponly;
};

/**
 * Checks if a cookie is expired
 *
 * @param {Object} cookie Cookie object to check against
 * @returns {Boolean} True, if the cookie is expired
 */
Cookies.prototype.isExpired = function (cookie) {
    return (cookie.expires && cookie.expires < new Date()) || !cookie.value;
};

/**
 * Returns normalized cookie path for an URL path argument
 *
 * @param {String} pathname
 * @returns {String} Normalized path
 */
Cookies.prototype.getPath = function (pathname) {
    var path = (pathname || '/').split('/');
    path.pop(); // remove filename part
    path = path.join('/').trim();

    // ensure path prefix /
    if (path.charAt(0) !== '/') {
        path = '/' + path;
    }

    // ensure path suffix /
    if (path.substr(-1) !== '/') {
        path += '/';
    }

    return path;
};


/***/ }),
/* 54 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var createQueue = __webpack_require__(55);
var SMTPConnection = __webpack_require__(6);
var dns = __webpack_require__(59);
var net = __webpack_require__(7);
var os = __webpack_require__(5);
var util = __webpack_require__(0);
var packageData = __webpack_require__(60);
var EventEmitter = __webpack_require__(2).EventEmitter;
var shared = __webpack_require__(3);

// Expose to the world
module.exports = function (options) {
    return new DirectMailer(options);
};

/**
 * Creates a new DirectMailer instance. Provides method 'send' to queue
 * outgoing e-mails. The queue is processed in the background.
 *
 * @constructor
 * @param {Object} [options] Optional options object
 */
function DirectMailer(options) {
    EventEmitter.call(this);
    this.options = options || {};
    this._queue = createQueue();
    this._started = false;
    this._lastId = 0;

    if (options && typeof options.getSocket === 'function') {
        this.getSocket = options.getSocket;
    }

    this.logger = shared.getLogger(this.options);

    // temporary object
    var connection = new SMTPConnection({});

    this.name = 'SMTP (direct)';
    this.version = packageData.version + '[client:' + connection.version + ']';
}
util.inherits(DirectMailer, EventEmitter);

// Adds a dynamic property 'length'
Object.defineProperty(DirectMailer.prototype, 'length', {
    get: function () {
        return this._queue._instantQueue.length + this._queue._sortedQueue.length;
    }
});

/**
 * Placeholder function for creating proxy sockets. This method immediatelly returns
 * without a socket
 *
 * @param {Object} options Connection options
 * @param {Function} callback Callback function to run with the socket keys
 */
DirectMailer.prototype.getSocket = function (options, callback) {
    // return immediatelly
    return callback(null, false);
};

/**
 * Adds an outgoing message to the queue. Recipient addresses are sorted
 * by the receiving domain and for every domain, a copy of the message is queued.
 *
 * If input is deemed invalid, an error is thrown, so be ready to catch these
 * when calling directmail.send(...)
 *
 * @param {Object} mail Mail object
 * @param {Function} callback Callback function
 */
DirectMailer.prototype.send = function (mail, callback) {

    var envelope = mail.message.getEnvelope();
    var domainEnvelopes = {};

    if (!envelope.from) {
        return callback(new Error('"From" address missing'));
    }

    envelope.to = [].concat(envelope.to || []);

    if (!envelope.to.length) {
        return callback('"Recipients" addresses missing');
    }

    // We cant't run existing streams more than once so we need to change these
    // to buffers. Filenames, URLs etc are not affected – for every
    // message copy a new file stream will be created
    this._clearStreams(mail, function (err) {
        if (err) {
            return callback(err);
        }

        this._formatMessage(mail.message);

        envelope.to.forEach(function (recipient) {
            recipient = (recipient || '').toString();

            var domain = (recipient.split('@').pop() || '').toLowerCase().trim();

            if (!domainEnvelopes[domain]) {
                domainEnvelopes[domain] = {
                    from: envelope.from,
                    to: [recipient]
                };
            } else if (domainEnvelopes[domain].to.indexOf(recipient) < 0) {
                domainEnvelopes[domain].to.push(recipient);
            }
        });

        var returned = 0;
        var domains = Object.keys(domainEnvelopes);
        var combinedInfo = {
            accepted: [],
            rejected: [],
            pending: [],
            errors: [],
            envelope: mail.message.getEnvelope()
        };

        domains.forEach((function (domain) {
            var called = false;
            var id = ++this._lastId;
            var item = {
                envelope: domainEnvelopes[domain],
                data: mail.data,
                message: mail.message,
                domain: domain,
                id: id,
                callback: function (err, info) {
                    if (called) {
                        this.logger.info('Callback for #%s already called. Updated values: %s', id, JSON.stringify(err || info));
                        return;
                    }

                    called = true;
                    returned++;

                    if (err) {
                        combinedInfo.errors.push(err);
                        if (err.recipients) {
                            combinedInfo.rejected = combinedInfo.rejected.concat(err.recipients || []);
                        }
                    } else if (info) {
                        combinedInfo.accepted = combinedInfo.accepted.concat(info.accepted || []);
                        combinedInfo.rejected = combinedInfo.rejected.concat(info.rejected || []);
                        combinedInfo.pending = combinedInfo.pending.concat(info.pending || []);
                        combinedInfo.messageId = info.messageId;
                    }

                    if (returned >= domains.length) {
                        if (combinedInfo.errors.length === domains.length) {
                            var error = new Error('Sending failed');
                            error.errors = combinedInfo.errors;
                            return callback(error);
                        } else {
                            return callback(null, combinedInfo);
                        }
                    }
                }.bind(this)
            };

            this._queue.insert(item);
        }).bind(this));

        // start send loop if needed
        if (!this._started) {
            this._started = true;

            // do not start the loop before current execution context is finished
            setImmediate(this._loop.bind(this));
        }

    }.bind(this));
};

/**
 * Looping function to fetch a message from the queue and send it.
 */
DirectMailer.prototype._loop = function () {

    // callback is fired when a message is added to the queue
    this._queue.get((function (data) {

        this.logger.info('Retrieved message #%s from the queue, resolving %s', data.id, data.domain);

        // Resolve destination MX server
        this._resolveMx(data.domain, (function (err, list) {

            if (err) {
                this.logger.info('Resolving %s for #%s failed', data.domain, data.id);
                this.logger.info(err);
            } else if (!list || !list.length) {
                this.logger.info('Could not resolve any MX servers for %s', data.domain);
            }
            if (err || !list || !list.length) {
                data.callback(err || new Error('Could not resolve MX for ' + data.domain));
                return setImmediate(this._loop.bind(this));
            }

            // Sort MX list by priority field
            list.sort(function (a, b) {
                return (a && a.priority || 0) - (b && b.priority || 0);
            });

            // Use the first server on the list
            var exchanges = list.map(function (item) {
                return item.exchange;
            });

            // Try to send the message
            this._process([].concat(exchanges), data, (function (err, response) {
                if (err) {
                    this.logger.info('Failed processing message #%s', data.id);
                } else {
                    this.logger.info('Server responded for #%s: %s', data.id, JSON.stringify(response));
                }

                if (err) {
                    if (err.responseCode && err.responseCode >= 500) {
                        err.domain = data.domain;
                        err.exchange = exchanges[0];
                        err.recipients = data.envelope.to;
                        data.callback(err);
                    } else {
                        data.replies = (data.replies || 0) + 1;
                        if (data.replies <= 5) {
                            this._queue.insert(data, this.options.retryDelay || data.replies * 15 * 60 * 1000);
                            this.logger.info('Message #%s requeued', data.id);
                            data.callback(null, {
                                pending: {
                                    domain: data.domain,
                                    exchange: exchanges[0],
                                    recipients: data.envelope.to,
                                    response: err.response
                                }
                            });
                        } else {
                            err.domain = data.domain;
                            err.exchange = exchanges[0];
                            err.recipients = data.envelope.to;
                            data.callback(err);
                        }
                    }
                } else {
                    data.callback(null, response);
                }

                setImmediate(this._loop.bind(this));
            }).bind(this));
        }).bind(this));
    }).bind(this));
};

/**
 * Sends a message to provided MX server
 *
 * @param {Array} exchanges Priority list of MX servers
 * @param {Object} data Message object
 * @param {Function} callback Callback to run once the message is either sent or sending fails
 */
DirectMailer.prototype._process = function (exchanges, data, callback) {
    var exchange = exchanges[0];

    this.logger.info('%s resolved to %s for #%s', data.domain, exchange, data.id);

    this.logger.info('Connecting to %s:%s for message #%s %s STARTTLS', exchange, this.options.port || 25, data.id, data.ignoreTLS ? 'without' : 'with');

    var options = {
        host: exchange,
        port: this.options.port || 25,
        requireTLS: !data.ignoreTLS,
        ignoreTLS: data.ignoreTLS,
        tls: {
            rejectUnauthorized: false
        }
    };

    // Add options from DirectMailer options to simplesmtp client
    Object.keys(this.options).forEach((function (key) {
        options[key] = this.options[key];
    }).bind(this));

    this.getSocket(options, function (err, socketOptions) {
        if (err) {
            // try next host
            exchanges.shift();
            if (!exchanges.length) {
                // no more hosts to try
                return callback(err);
            }
            this.logger.info('Failed to connect to %s, trying next MX', exchange);
            return this._process(exchanges, data, callback);
        }

        if (socketOptions && socketOptions.connection) {
            this.logger.info('Using proxied socket from %s:%s to %s:%s', socketOptions.connection.remoteAddress, socketOptions.connection.remotePort, options.host || '', options.port || '');
            Object.keys(socketOptions).forEach(function (key) {
                options[key] = socketOptions[key];
            });
        }

        var connection = new SMTPConnection(options);
        var returned = false;
        var connected = false;

        connection.once('error', function (err) {
            if (returned) {
                return;
            }
            returned = true;
            if (err.code === 'ETLS') {
                // STARTTLS failed, try again, this time without encryption
                data.ignoreTLS = true;
                return this._process(exchanges, data, callback);
            }
            if (!connected) {
                // try next host
                exchanges.shift();
                if (!exchanges.length) {
                    // no more hosts to try
                    return callback(err);
                }
                this.logger.info('Failed to connect to %s, trying next MX', exchange);
                return this._process(exchanges, data, callback);
            }
            return callback(err);
        }.bind(this));

        var sendMessage = function () {
            var messageId = (data.message.getHeader('message-id') || '').replace(/[<>\s]/g, '');
            var recipients = [].concat(data.envelope.to || []);
            if (recipients.length > 3) {
                recipients.push('...and ' + recipients.splice(2).length + ' more');
            }

            this.logger.info('Sending message <%s> to <%s>', messageId, recipients.join(', '));
            connection.send(data.envelope, data.message.createReadStream(), function (err, info) {
                if (returned) {
                    return;
                }
                returned = true;

                connection.close();
                if (err) {
                    return callback(err);
                }

                info.messageId = (data.message.getHeader('message-id') || '').replace(/[<>\s]/g, '');
                return callback(null, info);
            });
        }.bind(this);

        connection.connect(function () {
            connected = true;
            if (returned) {
                return;
            }
            sendMessage();
        }.bind(this));
    }.bind(this));
};

/**
 * Adds additional headers to the outgoing message
 *
 * @param {Object} message BuildMail message object
 */
DirectMailer.prototype._formatMessage = function (message) {
    var hostname = this._resolveHostname(this.options.name);

    // set the first header as 'Received:'
    message._headers.unshift({
        key: 'Received',
        value: 'from localhost (127.0.0.1) by ' + hostname + ' with SMTP; ' + Date()
    });
};

/**
 * Detects stream objects and resolves these to buffers before sending. File paths,
 * urls etc. are not affected.
 *
 * @param {Object} message BuildMail message object
 * @param {Function} callback Callback to run
 */
DirectMailer.prototype._clearStreams = function (mail, callback) {
    var streamNodes = [];

    function walkNode(node) {
        if (node.content && typeof node.content.pipe === 'function') {
            streamNodes.push(node);
        }
        if (node.childNodes && node.childNodes.length) {
            node.childNodes.forEach(walkNode);
        }
    }
    walkNode(mail.message);

    function resolveNodes() {
        if (!streamNodes.length) {
            return callback();
        }
        var node = streamNodes.shift();

        mail.resolveContent(node, 'content', function (err) {
            if (err) {
                return callback(err);
            }
            setImmediate(resolveNodes);
        });
    }

    resolveNodes();
};

/**
 * Resolves MX server for a domain. This solution is somewhat incomplete as
 * it only considers the hostname with lowest priority and ignores all the rest
 *
 * @param {String} domain Domain to resolve the MX to
 * @param {Function} callback Callback function to run
 */
DirectMailer.prototype._resolveMx = function (domain, callback) {
    domain = domain.replace(/^\[(ipv6:)?|\]$/gi, '');

    // Do not try to resolve the domain name if it is an IP address
    if (net.isIP(domain)) {
        return callback(null, [{
            priority: 0,
            exchange: domain
        }]);
    }

    dns.resolveMx(domain, function (err, list) {
        if (err) {
            if (err.code === 'ENODATA' || err.code === 'ENOTFOUND') {
                // fallback to A
                dns.resolve4(domain, function (err, list) {
                    if (err) {
                        if (err.code === 'ENODATA' || err.code === 'ENOTFOUND') {
                            // fallback to AAAA
                            dns.resolve6(domain, function (err, list) {
                                if (err) {
                                    return callback(err);
                                }

                                // return the first resolved Ipv6 with priority 0
                                return callback(null, [].concat(list || []).map(function (entry) {
                                    return {
                                        priority: 0,
                                        exchange: entry
                                    };
                                }).slice(0, 1));
                            });
                        } else {
                            return callback(err);
                        }
                        return;
                    }

                    // return the first resolved Ipv4 with priority 0
                    return callback(null, [].concat(list || []).map(function (entry) {
                        return {
                            priority: 0,
                            exchange: entry
                        };
                    }).slice(0, 1));
                });
            } else {
                return callback(err);
            }
            return;
        }
        callback(null, list);
    });
};

/**
 * Resolves current hostname. If resolved name is an IP address, uses 'localhost'.
 *
 * @param {String} [name] Preferred hostname
 * @return {String} Resolved hostname
 */
DirectMailer.prototype._resolveHostname = function (name) {
    if (!name || net.isIP(name.replace(/[\[\]]/g, '').trim())) {
        name = (os.hostname && os.hostname()) || '';
    }

    if (!name || net.isIP(name.replace(/[\[\]]/g, '').trim())) {
        name = 'localhost';
    }

    return name.toLowerCase();
};


/***/ }),
/* 55 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// expose to the world
module.exports = function () {
    return new MessageQueue();
};

/**
 * Creates a queue object
 *
 * @constructor
 */
function MessageQueue() {
    this._instantQueue = [];
    this._sortedQueue = [];
    this._shiftTimer = null;
    this._callbackQueue = [];
}

/**
 * Sets a callback to be run when something comes available from the queue
 *
 * @param {Function} callback Callback function to run with queue element as an argument
 */
MessageQueue.prototype.get = function (callback) {
    if (this._instantQueue.length) {
        return callback(this._instantQueue.pop());
    } else {
        this._callbackQueue.unshift(callback);
    }
};

/**
 * Adds an element to the queue. If delay (ms) is set, the data will not be available before
 * specified delay has passed. Otherwise the data will be available for processing immediatelly.
 *
 * @param {Mixed} data Value to be queued
 * @param {Number} [delay] If set, delay the availability of the data by {delay} milliseconds
 */
MessageQueue.prototype.insert = function (data, delay) {
    var container, added = -1;
    if (typeof delay !== 'number') {
        this._instantQueue.unshift(data);
        this._processInsert();
        return true;
    } else {
        container = {
            data: data,
            available: Date.now() + delay
        };
        for (var i = 0, len = this._sortedQueue.length; i < len; i++) {
            if (this._sortedQueue[i].available >= container.available) {
                this._sortedQueue.splice(i, 0, container);
                added = i;
                break;
            }
        }
        if (added < 0) {
            this._sortedQueue.push(container);
            added = 0;
        }

        if (added === 0) {
            this._updateShiftTimer();
        }
    }
};

/**
 * Clears previous timer and creates a new one (if needed) to process the element
 * in the queue that needs to be processed first.
 */
MessageQueue.prototype._updateShiftTimer = function () {
    var nextShift, now = Date.now();
    clearTimeout(this._shiftTimer);

    if (!this._sortedQueue.length) {
        return;
    }

    nextShift = this._sortedQueue[0].available;

    if (nextShift <= now) {
        this._shiftSorted();
    } else {
        setTimeout(this._shiftSorted.bind(this),
            // add +15ms to ensure that data is already available when the timer is fired
            this._sortedQueue[0].available - Date.now() + 15);
    }
};

/**
 * Moves an element from the delayed queue to the immediate queue if an elmenet
 * becomes avilable
 */
MessageQueue.prototype._shiftSorted = function () {
    var container;
    if (!this._sortedQueue.length) {
        return;
    }

    if (this._sortedQueue[0].available <= Date.now()) {
        container = this._sortedQueue.shift();
        this.insert(container.data);
    }

    this._updateShiftTimer();
};

/**
 * If data from a queue is available and a callback is set, run the callback
 * with available data
 */
MessageQueue.prototype._processInsert = function () {
    if (this._instantQueue.length && this._callbackQueue.length) {
        this._callbackQueue.pop()(this._instantQueue.pop());
    }
};


/***/ }),
/* 56 */
/***/ (function(module, exports) {

module.exports = {"_from":"smtp-connection@2.12.0","_id":"smtp-connection@2.12.0","_inBundle":false,"_integrity":"sha1-1275EnyyPCJZ7bHoNJwujV4tdME=","_location":"/smtp-connection","_phantomChildren":{},"_requested":{"type":"version","registry":true,"raw":"smtp-connection@2.12.0","name":"smtp-connection","escapedName":"smtp-connection","rawSpec":"2.12.0","saveSpec":null,"fetchSpec":"2.12.0"},"_requiredBy":["/nodemailer-direct-transport","/nodemailer-smtp-pool","/nodemailer-smtp-transport"],"_resolved":"https://registry.npmjs.org/smtp-connection/-/smtp-connection-2.12.0.tgz","_shasum":"d76ef9127cb23c2259edb1e8349c2e8d5e2d74c1","_spec":"smtp-connection@2.12.0","_where":"C:\\Users\\jgell\\Excursion_Web_Node\\node_modules\\nodemailer-direct-transport","author":{"name":"Andris Reinman"},"bugs":{"url":"https://github.com/andris9/smtp-connection/issues"},"bundleDependencies":false,"dependencies":{"httpntlm":"1.6.1","nodemailer-shared":"1.1.0"},"deprecated":false,"description":"Connect to SMTP servers","devDependencies":{"chai":"^3.5.0","grunt":"^1.0.1","grunt-cli":"^1.2.0","grunt-eslint":"^19.0.0","grunt-mocha-test":"^0.12.7","mocha":"^3.0.2","proxy-test-server":"^1.0.0","sinon":"^1.17.5","smtp-server":"^1.14.2","xoauth2":"^1.2.0"},"directories":{"test":"test"},"homepage":"https://github.com/andris9/smtp-connection","keywords":["SMTP"],"license":"MIT","main":"lib/smtp-connection.js","name":"smtp-connection","repository":{"type":"git","url":"git://github.com/andris9/smtp-connection.git"},"scripts":{"test":"grunt mochaTest"},"version":"2.12.0"}

/***/ }),
/* 57 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var stream = __webpack_require__(1);
var Transform = stream.Transform;
var util = __webpack_require__(0);

module.exports = DataStream;

/**
 * Escapes dots in the beginning of lines. Ends the stream with <CR><LF>.<CR><LF>
 * Also makes sure that only <CR><LF> sequences are used for linebreaks
 *
 * @param {Object} options Stream options
 */
function DataStream(options) {
    // init Transform
    this.options = options || {};
    this._curLine = '';

    this.inByteCount = 0;
    this.outByteCount = 0;
    this.lastByte = false;

    Transform.call(this, this.options);
}
util.inherits(DataStream, Transform);

/**
 * Escapes dots
 */
DataStream.prototype._transform = function (chunk, encoding, done) {
    var chunks = [];
    var chunklen = 0;
    var i, len, lastPos = 0;
    var buf;

    if (!chunk || !chunk.length) {
        return done();
    }

    if (typeof chunk === 'string') {
        chunk = new Buffer(chunk);
    }

    this.inByteCount += chunk.length;

    for (i = 0, len = chunk.length; i < len; i++) {
        if (chunk[i] === 0x2E) { // .
            if (
                (i && chunk[i - 1] === 0x0A) ||
                (!i && (!this.lastByte || this.lastByte === 0x0A))
            ) {
                buf = chunk.slice(lastPos, i + 1);
                chunks.push(buf);
                chunks.push(new Buffer('.'));
                chunklen += buf.length + 1;
                lastPos = i + 1;
            }
        } else if (chunk[i] === 0x0A) { // .
            if (
                (i && chunk[i - 1] !== 0x0D) ||
                (!i && this.lastByte !== 0x0D)
            ) {
                if (i > lastPos) {
                    buf = chunk.slice(lastPos, i);
                    chunks.push(buf);
                    chunklen += buf.length + 2;
                } else {
                    chunklen += 2;
                }
                chunks.push(new Buffer('\r\n'));
                lastPos = i + 1;
            }
        }
    }

    if (chunklen) {
        // add last piece
        if (lastPos < chunk.length) {
            buf = chunk.slice(lastPos);
            chunks.push(buf);
            chunklen += buf.length;
        }

        this.outByteCount += chunklen;
        this.push(Buffer.concat(chunks, chunklen));
    } else {
        this.outByteCount += chunk.length;
        this.push(chunk);
    }

    this.lastByte = chunk[chunk.length - 1];
    done();
};

/**
 * Finalizes the stream with a dot on a single line
 */
DataStream.prototype._flush = function (done) {
    var buf;
    if (this.lastByte === 0x0A) {
        buf = new Buffer('.\r\n');
    } else if (this.lastByte === 0x0D) {
        buf = new Buffer('\n.\r\n');
    } else {
        buf = new Buffer('\r\n.\r\n');
    }
    this.outByteCount += buf.length;
    this.push(buf);
    done();
};


/***/ }),
/* 58 */
/***/ (function(module, exports, __webpack_require__) {

var crypto = __webpack_require__(10);

var flags = {
	NTLM_NegotiateUnicode                :  0x00000001,
	NTLM_NegotiateOEM                    :  0x00000002,
	NTLM_RequestTarget                   :  0x00000004,
	NTLM_Unknown9                        :  0x00000008,
	NTLM_NegotiateSign                   :  0x00000010,
	NTLM_NegotiateSeal                   :  0x00000020,
	NTLM_NegotiateDatagram               :  0x00000040,
	NTLM_NegotiateLanManagerKey          :  0x00000080,
	NTLM_Unknown8                        :  0x00000100,
	NTLM_NegotiateNTLM                   :  0x00000200,
	NTLM_NegotiateNTOnly                 :  0x00000400,
	NTLM_Anonymous                       :  0x00000800,
	NTLM_NegotiateOemDomainSupplied      :  0x00001000,
	NTLM_NegotiateOemWorkstationSupplied :  0x00002000,
	NTLM_Unknown6                        :  0x00004000,
	NTLM_NegotiateAlwaysSign             :  0x00008000,
	NTLM_TargetTypeDomain                :  0x00010000,
	NTLM_TargetTypeServer                :  0x00020000,
	NTLM_TargetTypeShare                 :  0x00040000,
	NTLM_NegotiateExtendedSecurity       :  0x00080000,
	NTLM_NegotiateIdentify               :  0x00100000,
	NTLM_Unknown5                        :  0x00200000,
	NTLM_RequestNonNTSessionKey          :  0x00400000,
	NTLM_NegotiateTargetInfo             :  0x00800000,
	NTLM_Unknown4                        :  0x01000000,
	NTLM_NegotiateVersion                :  0x02000000,
	NTLM_Unknown3                        :  0x04000000,
	NTLM_Unknown2                        :  0x08000000,
	NTLM_Unknown1                        :  0x10000000,
	NTLM_Negotiate128                    :  0x20000000,
	NTLM_NegotiateKeyExchange            :  0x40000000,
	NTLM_Negotiate56                     :  0x80000000
};
var typeflags = {
	NTLM_TYPE1_FLAGS : 	  flags.NTLM_NegotiateUnicode
						+ flags.NTLM_NegotiateOEM
						+ flags.NTLM_RequestTarget
						+ flags.NTLM_NegotiateNTLM
						+ flags.NTLM_NegotiateOemDomainSupplied
						+ flags.NTLM_NegotiateOemWorkstationSupplied
						+ flags.NTLM_NegotiateAlwaysSign
						+ flags.NTLM_NegotiateExtendedSecurity
						+ flags.NTLM_NegotiateVersion
						+ flags.NTLM_Negotiate128
						+ flags.NTLM_Negotiate56,

	NTLM_TYPE2_FLAGS :    flags.NTLM_NegotiateUnicode
						+ flags.NTLM_RequestTarget
						+ flags.NTLM_NegotiateNTLM
						+ flags.NTLM_NegotiateAlwaysSign
						+ flags.NTLM_NegotiateExtendedSecurity
						+ flags.NTLM_NegotiateTargetInfo
						+ flags.NTLM_NegotiateVersion
						+ flags.NTLM_Negotiate128
						+ flags.NTLM_Negotiate56
};

function createType1Message(options){
	var domain = escape(options.domain.toUpperCase());
	var workstation = escape(options.workstation.toUpperCase());
	var protocol = 'NTLMSSP\0';

	var BODY_LENGTH = 40;

	var type1flags = typeflags.NTLM_TYPE1_FLAGS;
	if(!domain || domain === '')
		type1flags = type1flags - flags.NTLM_NegotiateOemDomainSupplied;

	var pos = 0;
	var buf = new Buffer(BODY_LENGTH + domain.length + workstation.length);


	buf.write(protocol, pos, protocol.length); pos += protocol.length; // protocol
	buf.writeUInt32LE(1, pos); pos += 4;          // type 1
	buf.writeUInt32LE(type1flags, pos); pos += 4; // TYPE1 flag

	buf.writeUInt16LE(domain.length, pos); pos += 2; // domain length
	buf.writeUInt16LE(domain.length, pos); pos += 2; // domain max length
	buf.writeUInt32LE(BODY_LENGTH + workstation.length, pos); pos += 4; // domain buffer offset

	buf.writeUInt16LE(workstation.length, pos); pos += 2; // workstation length
	buf.writeUInt16LE(workstation.length, pos); pos += 2; // workstation max length
	buf.writeUInt32LE(BODY_LENGTH, pos); pos += 4; // workstation buffer offset

	buf.writeUInt8(5, pos); pos += 1;      //ProductMajorVersion
	buf.writeUInt8(1, pos); pos += 1;      //ProductMinorVersion
	buf.writeUInt16LE(2600, pos); pos += 2; //ProductBuild

	buf.writeUInt8(0 , pos); pos += 1; //VersionReserved1
	buf.writeUInt8(0 , pos); pos += 1; //VersionReserved2
	buf.writeUInt8(0 , pos); pos += 1; //VersionReserved3
	buf.writeUInt8(15, pos); pos += 1; //NTLMRevisionCurrent

	buf.write(workstation, pos, workstation.length, 'ascii'); pos += workstation.length; // workstation string
	buf.write(domain     , pos, domain.length     , 'ascii'); pos += domain.length;

	return 'NTLM ' + buf.toString('base64');
}

function parseType2Message(rawmsg, callback){
	var match = rawmsg.match(/NTLM (.+)?/);
	if(!match || !match[1])
		return callback(new Error("Couldn't find NTLM in the message type2 comming from the server"));

	var buf = new Buffer(match[1], 'base64');

	var msg = {};

	msg.signature = buf.slice(0, 8);
	msg.type = buf.readInt16LE(8);

	if(msg.type != 2)
		return callback(new Error("Server didn't return a type 2 message"));

	msg.targetNameLen = buf.readInt16LE(12);
	msg.targetNameMaxLen = buf.readInt16LE(14);
	msg.targetNameOffset = buf.readInt32LE(16);
	msg.targetName  = buf.slice(msg.targetNameOffset, msg.targetNameOffset + msg.targetNameMaxLen);

    msg.negotiateFlags = buf.readInt32LE(20);
    msg.serverChallenge = buf.slice(24, 32);
    msg.reserved = buf.slice(32, 40);

    if(msg.negotiateFlags & flags.NTLM_NegotiateTargetInfo){
    	msg.targetInfoLen = buf.readInt16LE(40);
    	msg.targetInfoMaxLen = buf.readInt16LE(42);
    	msg.targetInfoOffset = buf.readInt32LE(44);
    	msg.targetInfo = buf.slice(msg.targetInfoOffset, msg.targetInfoOffset + msg.targetInfoLen);
    }
	return msg;
}

function createType3Message(msg2, options){
	var nonce = msg2.serverChallenge;
	var username = options.username;
	var password = options.password;
	var negotiateFlags = msg2.negotiateFlags;

	var isUnicode = negotiateFlags & flags.NTLM_NegotiateUnicode;
	var isNegotiateExtendedSecurity = negotiateFlags & flags.NTLM_NegotiateExtendedSecurity;

	var BODY_LENGTH = 72;

	var domainName = escape(options.domain.toUpperCase());
	var workstation = escape(options.workstation.toUpperCase());

	var workstationBytes, domainNameBytes, usernameBytes, encryptedRandomSessionKeyBytes;

	var encryptedRandomSessionKey = "";
	if(isUnicode){
		workstationBytes = new Buffer(workstation, 'utf16le');
		domainNameBytes = new Buffer(domainName, 'utf16le');
		usernameBytes = new Buffer(username, 'utf16le');
		encryptedRandomSessionKeyBytes = new Buffer(encryptedRandomSessionKey, 'utf16le');
	}else{
		workstationBytes = new Buffer(workstation, 'ascii');
		domainNameBytes = new Buffer(domainName, 'ascii');
		usernameBytes = new Buffer(username, 'ascii');
		encryptedRandomSessionKeyBytes = new Buffer(encryptedRandomSessionKey, 'ascii');
	}

	var lmChallengeResponse = calc_resp(create_LM_hashed_password_v1(password), nonce);
	var ntChallengeResponse = calc_resp(create_NT_hashed_password_v1(password), nonce);

	if(isNegotiateExtendedSecurity){
		var pwhash = create_NT_hashed_password_v1(password);
	 	var clientChallenge = "";
	 	for(var i=0; i < 8; i++){
	 		clientChallenge += String.fromCharCode( Math.floor(Math.random()*256) );
	   	}
	   	var clientChallengeBytes = new Buffer(clientChallenge, 'ascii');
	    var challenges = ntlm2sr_calc_resp(pwhash, nonce, clientChallengeBytes);
	    lmChallengeResponse = challenges.lmChallengeResponse;
	    ntChallengeResponse = challenges.ntChallengeResponse;
	}

	var signature = 'NTLMSSP\0';

	var pos = 0;
	var buf = new Buffer(BODY_LENGTH + domainNameBytes.length + usernameBytes.length + workstationBytes.length + lmChallengeResponse.length + ntChallengeResponse.length + encryptedRandomSessionKeyBytes.length);

	buf.write(signature, pos, signature.length); pos += signature.length;
	buf.writeUInt32LE(3, pos); pos += 4;          // type 1

	buf.writeUInt16LE(lmChallengeResponse.length, pos); pos += 2; // LmChallengeResponseLen
	buf.writeUInt16LE(lmChallengeResponse.length, pos); pos += 2; // LmChallengeResponseMaxLen
	buf.writeUInt32LE(BODY_LENGTH + domainNameBytes.length + usernameBytes.length + workstationBytes.length, pos); pos += 4; // LmChallengeResponseOffset

	buf.writeUInt16LE(ntChallengeResponse.length, pos); pos += 2; // NtChallengeResponseLen
	buf.writeUInt16LE(ntChallengeResponse.length, pos); pos += 2; // NtChallengeResponseMaxLen
	buf.writeUInt32LE(BODY_LENGTH + domainNameBytes.length + usernameBytes.length + workstationBytes.length + lmChallengeResponse.length, pos); pos += 4; // NtChallengeResponseOffset

	buf.writeUInt16LE(domainNameBytes.length, pos); pos += 2; // DomainNameLen
	buf.writeUInt16LE(domainNameBytes.length, pos); pos += 2; // DomainNameMaxLen
	buf.writeUInt32LE(BODY_LENGTH, pos); pos += 4; 			  // DomainNameOffset

	buf.writeUInt16LE(usernameBytes.length, pos); pos += 2; // UserNameLen
	buf.writeUInt16LE(usernameBytes.length, pos); pos += 2; // UserNameMaxLen
	buf.writeUInt32LE(BODY_LENGTH + domainNameBytes.length, pos); pos += 4; // UserNameOffset

	buf.writeUInt16LE(workstationBytes.length, pos); pos += 2; // WorkstationLen
	buf.writeUInt16LE(workstationBytes.length, pos); pos += 2; // WorkstationMaxLen
	buf.writeUInt32LE(BODY_LENGTH + domainNameBytes.length + usernameBytes.length, pos); pos += 4; // WorkstationOffset

	buf.writeUInt16LE(encryptedRandomSessionKeyBytes.length, pos); pos += 2; // EncryptedRandomSessionKeyLen
	buf.writeUInt16LE(encryptedRandomSessionKeyBytes.length, pos); pos += 2; // EncryptedRandomSessionKeyMaxLen
	buf.writeUInt32LE(BODY_LENGTH + domainNameBytes.length + usernameBytes.length + workstationBytes.length + lmChallengeResponse.length + ntChallengeResponse.length, pos); pos += 4; // EncryptedRandomSessionKeyOffset

	buf.writeUInt32LE(typeflags.NTLM_TYPE2_FLAGS, pos); pos += 4; // NegotiateFlags

	buf.writeUInt8(5, pos); pos++; // ProductMajorVersion
	buf.writeUInt8(1, pos); pos++; // ProductMinorVersion
	buf.writeUInt16LE(2600, pos); pos += 2; // ProductBuild
	buf.writeUInt8(0, pos); pos++; // VersionReserved1
	buf.writeUInt8(0, pos); pos++; // VersionReserved2
	buf.writeUInt8(0, pos); pos++; // VersionReserved3
	buf.writeUInt8(15, pos); pos++; // NTLMRevisionCurrent

	domainNameBytes.copy(buf, pos); pos += domainNameBytes.length;
	usernameBytes.copy(buf, pos); pos += usernameBytes.length;
	workstationBytes.copy(buf, pos); pos += workstationBytes.length;
	lmChallengeResponse.copy(buf, pos); pos += lmChallengeResponse.length;
	ntChallengeResponse.copy(buf, pos); pos += ntChallengeResponse.length;
	encryptedRandomSessionKeyBytes.copy(buf, pos); pos += encryptedRandomSessionKeyBytes.length;

	return 'NTLM ' + buf.toString('base64');
}

function create_LM_hashed_password_v1(password){
	// fix the password length to 14 bytes
	password = password.toUpperCase();
	var passwordBytes = new Buffer(password, 'ascii');

	var passwordBytesPadded = new Buffer(14);
	passwordBytesPadded.fill("\0");
	var sourceEnd = 14;
	if(passwordBytes.length < 14) sourceEnd = passwordBytes.length;
	passwordBytes.copy(passwordBytesPadded, 0, 0, sourceEnd);

	// split into 2 parts of 7 bytes:
	var firstPart = passwordBytesPadded.slice(0,7);
	var secondPart = passwordBytesPadded.slice(7);

	function encrypt(buf){
		var key = insertZerosEvery7Bits(buf);
		var des = crypto.createCipheriv('DES-ECB', key, '');
		return des.update("KGS!@#$%"); // page 57 in [MS-NLMP]);
	}

	var firstPartEncrypted = encrypt(firstPart);
	var secondPartEncrypted = encrypt(secondPart);

	return Buffer.concat([firstPartEncrypted, secondPartEncrypted]);
}

function insertZerosEvery7Bits(buf){
	var binaryArray = bytes2binaryArray(buf);
	var newBinaryArray = [];
	for(var i=0; i<binaryArray.length; i++){
		newBinaryArray.push(binaryArray[i]);

		if((i+1)%7 === 0){
			newBinaryArray.push(0);
		}
	}
	return binaryArray2bytes(newBinaryArray);
}

function bytes2binaryArray(buf){
	var hex2binary = {
		0: [0,0,0,0],
		1: [0,0,0,1],
		2: [0,0,1,0],
		3: [0,0,1,1],
		4: [0,1,0,0],
		5: [0,1,0,1],
		6: [0,1,1,0],
		7: [0,1,1,1],
		8: [1,0,0,0],
		9: [1,0,0,1],
		A: [1,0,1,0],
		B: [1,0,1,1],
		C: [1,1,0,0],
		D: [1,1,0,1],
		E: [1,1,1,0],
		F: [1,1,1,1]
	};

	var hexString = buf.toString('hex').toUpperCase();
	var array = [];
	for(var i=0; i<hexString.length; i++){
   		var hexchar = hexString.charAt(i);
   		array = array.concat(hex2binary[hexchar]);
   	}
   	return array;
}

function binaryArray2bytes(array){
	var binary2hex = {
		'0000': 0,
		'0001': 1,
		'0010': 2,
		'0011': 3,
		'0100': 4,
		'0101': 5,
		'0110': 6,
		'0111': 7,
		'1000': 8,
		'1001': 9,
		'1010': 'A',
		'1011': 'B',
		'1100': 'C',
		'1101': 'D',
		'1110': 'E',
		'1111': 'F'
	};

 	var bufArray = [];

	for(var i=0; i<array.length; i +=8 ){
		if((i+7) > array.length)
			break;

		var binString1 = '' + array[i] + '' + array[i+1] + '' + array[i+2] + '' + array[i+3];
		var binString2 = '' + array[i+4] + '' + array[i+5] + '' + array[i+6] + '' + array[i+7];
   		var hexchar1 = binary2hex[binString1];
   		var hexchar2 = binary2hex[binString2];

   		var buf = new Buffer(hexchar1 + '' + hexchar2, 'hex');
   		bufArray.push(buf);
   	}

   	return Buffer.concat(bufArray);
}

function create_NT_hashed_password_v1(password){
	var buf = new Buffer(password, 'utf16le');
	var md4 = crypto.createHash('md4');
	md4.update(buf);
	return new Buffer(md4.digest());
}

function calc_resp(password_hash, server_challenge){
    // padding with zeros to make the hash 21 bytes long
    var passHashPadded = new Buffer(21);
    passHashPadded.fill("\0");
    password_hash.copy(passHashPadded, 0, 0, password_hash.length);

    var resArray = [];

    var des = crypto.createCipheriv('DES-ECB', insertZerosEvery7Bits(passHashPadded.slice(0,7)), '');
    resArray.push( des.update(server_challenge.slice(0,8)) );

    des = crypto.createCipheriv('DES-ECB', insertZerosEvery7Bits(passHashPadded.slice(7,14)), '');
    resArray.push( des.update(server_challenge.slice(0,8)) );

    des = crypto.createCipheriv('DES-ECB', insertZerosEvery7Bits(passHashPadded.slice(14,21)), '');
    resArray.push( des.update(server_challenge.slice(0,8)) );

   	return Buffer.concat(resArray);
}

function ntlm2sr_calc_resp(responseKeyNT, serverChallenge, clientChallenge){
	// padding with zeros to make the hash 16 bytes longer
    var lmChallengeResponse = new Buffer(clientChallenge.length + 16);
    lmChallengeResponse.fill("\0");
    clientChallenge.copy(lmChallengeResponse, 0, 0, clientChallenge.length);

    var buf = Buffer.concat([serverChallenge, clientChallenge]);
    var md5 = crypto.createHash('md5');
    md5.update(buf);
    var sess = md5.digest();
    var ntChallengeResponse = calc_resp(responseKeyNT, sess.slice(0,8));

    return {
    	lmChallengeResponse: lmChallengeResponse,
    	ntChallengeResponse: ntChallengeResponse
    };
}

exports.createType1Message = createType1Message;
exports.parseType2Message = parseType2Message;
exports.createType3Message = createType3Message;






/***/ }),
/* 59 */
/***/ (function(module, exports) {

module.exports = require("dns");

/***/ }),
/* 60 */
/***/ (function(module, exports) {

module.exports = {"_from":"nodemailer-direct-transport@3.3.2","_id":"nodemailer-direct-transport@3.3.2","_inBundle":false,"_integrity":"sha1-6W+vuQNYVglH5WkBfZfmBzilCoY=","_location":"/nodemailer-direct-transport","_phantomChildren":{},"_requested":{"type":"version","registry":true,"raw":"nodemailer-direct-transport@3.3.2","name":"nodemailer-direct-transport","escapedName":"nodemailer-direct-transport","rawSpec":"3.3.2","saveSpec":null,"fetchSpec":"3.3.2"},"_requiredBy":["/nodemailer"],"_resolved":"https://registry.npmjs.org/nodemailer-direct-transport/-/nodemailer-direct-transport-3.3.2.tgz","_shasum":"e96fafb90358560947e569017d97e60738a50a86","_spec":"nodemailer-direct-transport@3.3.2","_where":"C:\\Users\\jgell\\Excursion_Web_Node\\node_modules\\nodemailer","author":{"name":"Andris Reinman"},"bugs":{"url":"https://github.com/andris9/nodemailer-direct-transport/issues"},"bundleDependencies":false,"dependencies":{"nodemailer-shared":"1.1.0","smtp-connection":"2.12.0"},"deprecated":false,"description":"Direct transport for Nodemailer","devDependencies":{"chai":"^3.5.0","grunt":"^1.0.1","grunt-eslint":"^19.0.0","grunt-mocha-test":"^0.12.7","mocha":"^3.0.2","smtp-server":"^1.14.2"},"homepage":"http://github.com/andris9/nodemailer-direct-transport","keywords":["SMTP","Nodemailer"],"license":"MIT","main":"lib/direct-transport.js","name":"nodemailer-direct-transport","repository":{"type":"git","url":"git://github.com/andris9/nodemailer-direct-transport.git"},"scripts":{"test":"grunt mochaTest"},"version":"3.3.2"}

/***/ }),
/* 61 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var SMTPConnection = __webpack_require__(6);
var packageData = __webpack_require__(62);
var wellknown = __webpack_require__(19);
var shared = __webpack_require__(3);

var EventEmitter = __webpack_require__(2).EventEmitter;
var util = __webpack_require__(0);

// expose to the world
module.exports = function (options) {
    return new SMTPTransport(options);
};

/**
 * Creates a SMTP transport object for Nodemailer
 *
 * @constructor
 * @param {Object} options Connection options
 */
function SMTPTransport(options) {
    EventEmitter.call(this);

    options = options || {};
    if (typeof options === 'string') {
        options = {
            url: options
        };
    }

    var urlData;
    var service = options.service;

    if (typeof options.getSocket === 'function') {
        this.getSocket = options.getSocket;
    }

    if (options.url) {
        urlData = shared.parseConnectionUrl(options.url);
        service = service || urlData.service;
    }

    this.options = assign(
        false, // create new object
        options, // regular options
        urlData, // url options
        service && wellknown(service) // wellknown options
    );

    this.logger = shared.getLogger(this.options);

    // temporary object
    var connection = new SMTPConnection(this.options);

    this.name = 'SMTP';
    this.version = packageData.version + '[client:' + connection.version + ']';
}
util.inherits(SMTPTransport, EventEmitter);

/**
 * Placeholder function for creating proxy sockets. This method immediatelly returns
 * without a socket
 *
 * @param {Object} options Connection options
 * @param {Function} callback Callback function to run with the socket keys
 */
SMTPTransport.prototype.getSocket = function (options, callback) {
    // return immediatelly
    return callback(null, false);
};

/**
 * Sends an e-mail using the selected settings
 *
 * @param {Object} mail Mail object
 * @param {Function} callback Callback function
 */
SMTPTransport.prototype.send = function (mail, callback) {

    this.getSocket(this.options, function (err, socketOptions) {
        if (err) {
            return callback(err);
        }

        var options = this.options;
        if (socketOptions && socketOptions.connection) {
            this.logger.info('Using proxied socket from %s:%s to %s:%s', socketOptions.connection.remoteAddress, socketOptions.connection.remotePort, options.host || '', options.port || '');
            // only copy options if we need to modify it
            options = assign(false, options);
            Object.keys(socketOptions).forEach(function (key) {
                options[key] = socketOptions[key];
            });
        }

        var connection = new SMTPConnection(options);
        var returned = false;

        connection.once('error', function (err) {
            if (returned) {
                return;
            }
            returned = true;
            connection.close();
            return callback(err);
        });

        connection.once('end', function () {
            if (returned) {
                return;
            }
            returned = true;
            return callback(new Error('Connection closed'));
        });

        var sendMessage = function () {
            var envelope = mail.message.getEnvelope();
            var messageId = (mail.message.getHeader('message-id') || '').replace(/[<>\s]/g, '');
            var recipients = [].concat(envelope.to || []);
            if (recipients.length > 3) {
                recipients.push('...and ' + recipients.splice(2).length + ' more');
            }

            this.logger.info('Sending message <%s> to <%s>', messageId, recipients.join(', '));

            connection.send(envelope, mail.message.createReadStream(), function (err, info) {
                if (returned) {
                    return;
                }
                returned = true;

                connection.close();
                if (err) {
                    return callback(err);
                }
                info.envelope = {
                    from: envelope.from,
                    to: envelope.to
                };
                info.messageId = messageId;
                return callback(null, info);
            });
        }.bind(this);

        connection.connect(function () {
            if (returned) {
                return;
            }

            if (this.options.auth) {
                connection.login(this.options.auth, function (err) {
                    if (returned) {
                        return;
                    }

                    if (err) {
                        returned = true;
                        connection.close();
                        return callback(err);
                    }

                    sendMessage();
                });
            } else {
                sendMessage();
            }
        }.bind(this));
    }.bind(this));
};

/**
 * Verifies SMTP configuration
 *
 * @param {Function} callback Callback function
 */
SMTPTransport.prototype.verify = function (callback) {
    var promise;

    if (!callback && typeof Promise === 'function') {
        promise = new Promise(function (resolve, reject) {
            callback = shared.callbackPromise(resolve, reject);
        });
    }

    this.getSocket(this.options, function (err, socketOptions) {
        if (err) {
            return callback(err);
        }

        var options = this.options;
        if (socketOptions && socketOptions.connection) {
            this.logger.info('Using proxied socket from %s:%s', socketOptions.connection.remoteAddress, socketOptions.connection.remotePort);
            options = assign(false, options);
            Object.keys(socketOptions).forEach(function (key) {
                options[key] = socketOptions[key];
            });
        }

        var connection = new SMTPConnection(options);
        var returned = false;

        connection.once('error', function (err) {
            if (returned) {
                return;
            }
            returned = true;
            connection.close();
            return callback(err);
        });

        connection.once('end', function () {
            if (returned) {
                return;
            }
            returned = true;
            return callback(new Error('Connection closed'));
        });

        var finalize = function () {
            if (returned) {
                return;
            }
            returned = true;
            connection.quit();
            return callback(null, true);
        };

        connection.connect(function () {
            if (returned) {
                return;
            }

            if (this.options.auth) {
                connection.login(this.options.auth, function (err) {
                    if (returned) {
                        return;
                    }

                    if (err) {
                        returned = true;
                        connection.close();
                        return callback(err);
                    }

                    finalize();
                });
            } else {
                finalize();
            }
        }.bind(this));
    }.bind(this));

    return promise;
};

/**
 * Copies properties from source objects to target objects
 */
function assign( /* target, ... sources */ ) {
    var args = Array.prototype.slice.call(arguments);
    var target = args.shift() || {};

    args.forEach(function (source) {
        Object.keys(source || {}).forEach(function (key) {
            if (['tls', 'auth'].indexOf(key) >= 0 && source[key] && typeof source[key] === 'object') {
                // tls and auth are special keys that need to be enumerated separately
                // other objects are passed as is
                if (!target[key]) {
                    // esnure that target has this key
                    target[key] = {};
                }
                Object.keys(source[key]).forEach(function (subKey) {
                    target[key][subKey] = source[key][subKey];
                });
            } else {
                target[key] = source[key];
            }
        });
    });
    return target;
}


/***/ }),
/* 62 */
/***/ (function(module, exports) {

module.exports = {"_from":"nodemailer-smtp-transport@2.7.2","_id":"nodemailer-smtp-transport@2.7.2","_inBundle":false,"_integrity":"sha1-A9ccdjFPFKx9vHvwM6am0W1n+3c=","_location":"/nodemailer-smtp-transport","_phantomChildren":{},"_requested":{"type":"version","registry":true,"raw":"nodemailer-smtp-transport@2.7.2","name":"nodemailer-smtp-transport","escapedName":"nodemailer-smtp-transport","rawSpec":"2.7.2","saveSpec":null,"fetchSpec":"2.7.2"},"_requiredBy":["/nodemailer"],"_resolved":"https://registry.npmjs.org/nodemailer-smtp-transport/-/nodemailer-smtp-transport-2.7.2.tgz","_shasum":"03d71c76314f14ac7dbc7bf033a6a6d16d67fb77","_spec":"nodemailer-smtp-transport@2.7.2","_where":"C:\\Users\\jgell\\Excursion_Web_Node\\node_modules\\nodemailer","author":{"name":"Andris Reinman"},"bugs":{"url":"https://github.com/andris9/nodemailer-smtp-transport/issues"},"bundleDependencies":false,"dependencies":{"nodemailer-shared":"1.1.0","nodemailer-wellknown":"0.1.10","smtp-connection":"2.12.0"},"deprecated":false,"description":"SMTP transport for Nodemailer","devDependencies":{"chai":"^3.5.0","grunt":"^1.0.1","grunt-cli":"^1.2.0","grunt-eslint":"^19.0.0","grunt-mocha-test":"^0.12.7","mocha":"^3.0.2","smtp-server":"^1.14.2"},"homepage":"http://github.com/andris9/nodemailer-smtp-transport","keywords":["SMTP","Nodemailer"],"license":"MIT","main":"lib/smtp-transport.js","name":"nodemailer-smtp-transport","repository":{"type":"git","url":"git://github.com/andris9/nodemailer-smtp-transport.git"},"scripts":{"test":"grunt mochaTest"},"version":"2.7.2"}

/***/ }),
/* 63 */
/***/ (function(module, exports) {

module.exports = {"126":{"host":"smtp.126.com","port":465,"secure":true},"163":{"host":"smtp.163.com","port":465,"secure":true},"1und1":{"host":"smtp.1und1.de","port":465,"secure":true,"authMethod":"LOGIN"},"AOL":{"domains":["aol.com"],"host":"smtp.aol.com","port":587},"DebugMail":{"host":"debugmail.io","port":25},"DynectEmail":{"aliases":["Dynect"],"host":"smtp.dynect.net","port":25},"FastMail":{"domains":["fastmail.fm"],"host":"mail.messagingengine.com","port":465,"secure":true},"GandiMail":{"aliases":["Gandi","Gandi Mail"],"host":"mail.gandi.net","port":587},"Gmail":{"aliases":["Google Mail"],"domains":["gmail.com","googlemail.com"],"host":"smtp.gmail.com","port":465,"secure":true},"Godaddy":{"host":"smtpout.secureserver.net","port":25},"GodaddyAsia":{"host":"smtp.asia.secureserver.net","port":25},"GodaddyEurope":{"host":"smtp.europe.secureserver.net","port":25},"hot.ee":{"host":"mail.hot.ee"},"Hotmail":{"aliases":["Outlook","Outlook.com","Hotmail.com"],"domains":["hotmail.com","outlook.com"],"host":"smtp.live.com","port":587,"tls":{"ciphers":"SSLv3"}},"iCloud":{"aliases":["Me","Mac"],"domains":["me.com","mac.com"],"host":"smtp.mail.me.com","port":587},"mail.ee":{"host":"smtp.mail.ee"},"Mail.ru":{"host":"smtp.mail.ru","port":465,"secure":true},"Maildev":{"port":1025,"ignoreTLS":true},"Mailgun":{"host":"smtp.mailgun.org","port":587},"Mailjet":{"host":"in.mailjet.com","port":587},"Mandrill":{"host":"smtp.mandrillapp.com","port":587},"Naver":{"host":"smtp.naver.com","port":587},"OpenMailBox":{"aliases":["OMB","openmailbox.org"],"host":"smtp.openmailbox.org","port":465,"secure":true},"Postmark":{"aliases":["PostmarkApp"],"host":"smtp.postmarkapp.com","port":2525},"QQ":{"domains":["qq.com"],"host":"smtp.qq.com","port":465,"secure":true},"QQex":{"aliases":["QQ Enterprise"],"domains":["exmail.qq.com"],"host":"smtp.exmail.qq.com","port":465,"secure":true},"SendCloud":{"host":"smtpcloud.sohu.com","port":25},"SendGrid":{"host":"smtp.sendgrid.net","port":587},"SES":{"host":"email-smtp.us-east-1.amazonaws.com","port":465,"secure":true},"SES-US-EAST-1":{"host":"email-smtp.us-east-1.amazonaws.com","port":465,"secure":true},"SES-US-WEST-2":{"host":"email-smtp.us-west-2.amazonaws.com","port":465,"secure":true},"SES-EU-WEST-1":{"host":"email-smtp.eu-west-1.amazonaws.com","port":465,"secure":true},"Sparkpost":{"aliases":["SparkPost","SparkPost Mail"],"domains":["sparkpost.com"],"host":"smtp.sparkpostmail.com","port":587,"secure":false},"Yahoo":{"domains":["yahoo.com"],"host":"smtp.mail.yahoo.com","port":465,"secure":true},"Yandex":{"domains":["yandex.ru"],"host":"smtp.yandex.ru","port":465,"secure":true},"Zoho":{"host":"smtp.zoho.com","port":465,"secure":true,"authMethod":"LOGIN"}}

/***/ }),
/* 64 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var SMTPConnection = __webpack_require__(6);
var packageData = __webpack_require__(65);
var wellknown = __webpack_require__(19);
var assign = __webpack_require__(20);
var PoolResource = __webpack_require__(66);
var EventEmitter = __webpack_require__(2).EventEmitter;
var util = __webpack_require__(0);
var shared = __webpack_require__(3);

// expose to the world
module.exports = function (options) {
    return new SMTPPool(options);
};

/**
 * Creates a SMTP pool transport object for Nodemailer
 *
 * @constructor
 * @param {Object} options SMTP Connection options
 */
function SMTPPool(options) {
    EventEmitter.call(this);

    options = options || {};
    if (typeof options === 'string') {
        options = {
            url: options
        };
    }

    var urlData;
    var service = options.service;

    if (typeof options.getSocket === 'function') {
        this.getSocket = options.getSocket;
    }

    if (options.url) {
        urlData = shared.parseConnectionUrl(options.url);
        service = service || urlData.service;
    }

    this.options = assign(
        false, // create new object
        options, // regular options
        urlData, // url options
        service && wellknown(service) // wellknown options
    );

    this.options.maxConnections = this.options.maxConnections || 5;
    this.options.maxMessages = this.options.maxMessages || 100;

    this.logger = this.options.logger = shared.getLogger(this.options);

    // temporary object
    var connection = new SMTPConnection(this.options);

    this.name = 'SMTP (pool)';
    this.version = packageData.version + '[client:' + connection.version + ']';

    this._rateLimit = {
        counter: 0,
        timeout: null,
        waiting: [],
        checkpoint: false
    };
    this._closed = false;
    this._queue = [];
    this._connections = [];
    this._connectionCounter = 0;

    this.idling = true;

    setImmediate(function () {
        if (this.idling) {
            this.emit('idle');
        }
    }.bind(this));
}
util.inherits(SMTPPool, EventEmitter);

/**
 * Placeholder function for creating proxy sockets. This method immediatelly returns
 * without a socket
 *
 * @param {Object} options Connection options
 * @param {Function} callback Callback function to run with the socket keys
 */
SMTPPool.prototype.getSocket = function (options, callback) {
    // return immediatelly
    return callback(null, false);
};

/**
 * Queues an e-mail to be sent using the selected settings
 *
 * @param {Object} mail Mail object
 * @param {Function} callback Callback function
 */
SMTPPool.prototype.send = function (mail, callback) {
    if (this._closed) {
        return false;
    }

    this._queue.push({
        mail: mail,
        callback: callback
    });

    if (this.idling && this._queue.length >= this.options.maxConnections) {
        this.idling = false;
    }

    setImmediate(this._processMessages.bind(this));

    return true;
};

/**
 * Closes all connections in the pool. If there is a message being sent, the connection
 * is closed later
 */
SMTPPool.prototype.close = function () {
    var connection;
    var len = this._connections.length;
    this._closed = true;

    // clear rate limit timer if it exists
    clearTimeout(this._rateLimit.timeout);

    // remove all available connections
    for (var i = len - 1; i >= 0; i--) {
        if (this._connections[i] && this._connections[i].available) {
            connection = this._connections[i];
            connection.close();
            this.logger.info('Connection #%s removed', connection.id);
        }
    }

    if (len && !this._connections.length) {
        this.logger.debug('All connections removed');
    }

    // make sure that entire queue would be cleaned
    var invokeCallbacks = function () {
        if (!this._queue.length) {
            this.logger.debug('Pending queue elements cleared');
            return;
        }
        var element = this._queue.shift();
        if (element && typeof element.callback === 'function') {
            try {
                element.callback(new Error('Connection pool was closed'));
            } catch (E) {
                this.logger.error('Callback error for #%s: %s', connection.id, E.message);
            }
        }
        setImmediate(invokeCallbacks);
    }.bind(this);
    setImmediate(invokeCallbacks);
};

/**
 * Check the queue and available connections. If there is a message to be sent and there is
 * an available connection, then use this connection to send the mail
 */
SMTPPool.prototype._processMessages = function () {
    var connection;
    var i, len;

    // do nothing if already closed
    if (this._closed) {
        return;
    }

    // do nothing if queue is empty
    if (!this._queue.length) {
        if (!this.idling) {
            // no pending jobs
            this.idling = true;
            this.emit('idle');
        }
        return;
    }

    // find first available connection
    for (i = 0, len = this._connections.length; i < len; i++) {
        if (this._connections[i].available) {
            connection = this._connections[i];
            break;
        }
    }

    if (!connection && this._connections.length < this.options.maxConnections) {
        connection = this._createConnection();
    }

    if (!connection) {
        // no more free connection slots available
        this.idling = false;
        return;
    }

    // check if there is free space in the processing queue
    if (!this.idling && this._queue.length < this.options.maxConnections) {
        this.idling = true;
        this.emit('idle');
    }

    var element = connection.queueElement = this._queue.shift();
    element.messageId = (connection.queueElement.mail.message.getHeader('message-id') || '').replace(/[<>\s]/g, '');

    connection.available = false;

    this.logger.debug('Assigned message <%s> to #%s (%s)', element.messageId, connection.id, connection.messages + 1);

    if (this.options.rateLimit) {
        this._rateLimit.counter++;
        if (!this._rateLimit.checkpoint) {
            this._rateLimit.checkpoint = Date.now();
        }
    }

    connection.send(element.mail, function (err, info) {
        // only process callback if current handler is not changed
        if (element === connection.queueElement) {
            try {
                element.callback(err, info);
            } catch (E) {
                this.logger.error('Callback error for #%s: %s', connection.id, E.message);
            }
            connection.queueElement = false;
        }
    }.bind(this));
};

/**
 * Creates a new pool resource
 */
SMTPPool.prototype._createConnection = function () {
    var connection = new PoolResource(this);

    connection.id = ++this._connectionCounter;

    this.logger.info('Created new pool resource #%s', connection.id);

    // resource comes available
    connection.on('available', function () {
        this.logger.debug('Connection #%s became available', connection.id);

        if (this._closed) {
            // if already closed run close() that will remove this connections from connections list
            this.close();
        } else {
            // check if there's anything else to send
            this._processMessages();
        }
    }.bind(this));

    // resource is terminated with an error
    connection.once('error', function (err) {
        if (err.code !== 'EMAXLIMIT') {
            this.logger.error('Pool Error for #%s: %s', connection.id, err.message);
        } else {
            this.logger.debug('Max messages limit exchausted for #%s', connection.id);
        }

        if (connection.queueElement) {
            try {
                connection.queueElement.callback(err);
            } catch (E) {
                this.logger.error('Callback error for #%s: %s', connection.id, E.message);
            }
            connection.queueElement = false;
        }

        // remove the erroneus connection from connections list
        this._removeConnection(connection);

        this._continueProcessing();
    }.bind(this));

    connection.once('close', function () {
        this.logger.info('Connection #%s was closed', connection.id);

        this._removeConnection(connection);

        if (connection.queueElement) {
            // If the connection closed when sending, add the message to the queue again
            // Note that we must wait a bit.. because the callback of the 'error' handler might be called
            // in the next event loop
            setTimeout(function () {
                if (connection.queueElement) {
                    this.logger.debug('Re-queued message <%s> for #%s', connection.queueElement.messageId, connection.id);
                    this._queue.unshift(connection.queueElement);
                    connection.queueElement = false;
                }
                this._continueProcessing();
            }.bind(this), 50);
        } else {
            this._continueProcessing();
        }
    }.bind(this));

    this._connections.push(connection);

    return connection;
};

/**
 * Continue to process message if the pool hasn't closed
 */
SMTPPool.prototype._continueProcessing = function () {
    if (this._closed) {
        this.close();
    } else {
        setTimeout(this._processMessages.bind(this), 100);
    }
};

/**
 * Remove resource from pool
 *
 * @param {Object} connection The PoolResource to remove
 */
SMTPPool.prototype._removeConnection = function (connection) {
    var index = this._connections.indexOf(connection);

    if (index !== -1) {
        this._connections.splice(index, 1);
    }
};

/**
 * Checks if connections have hit current rate limit and if so, queues the availability callback
 *
 * @param {Function} callback Callback function to run once rate limiter has been cleared
 */
SMTPPool.prototype._checkRateLimit = function (callback) {
    if (!this.options.rateLimit) {
        return callback();
    }

    var now = Date.now();

    if (this._rateLimit.counter < this.options.rateLimit) {
        return callback();
    }

    this._rateLimit.waiting.push(callback);

    if (this._rateLimit.checkpoint <= now - 1000) {
        return this._clearRateLimit();
    } else if (!this._rateLimit.timeout) {
        this._rateLimit.timeout = setTimeout(this._clearRateLimit.bind(this), 1000 - (now - this._rateLimit.checkpoint));
        this._rateLimit.checkpoint = now;
    }
};

/**
 * Clears current rate limit limitation and runs paused callback
 */
SMTPPool.prototype._clearRateLimit = function () {
    clearTimeout(this._rateLimit.timeout);
    this._rateLimit.timeout = null;
    this._rateLimit.counter = 0;
    this._rateLimit.checkpoint = false;

    // resume all paused connections
    while (this._rateLimit.waiting.length) {
        var cb = this._rateLimit.waiting.shift();
        setImmediate(cb);
    }
};

/**
 * Returns true if there are free slots in the queue
 */
SMTPPool.prototype.isIdle = function () {
    return this.idling;
};

/**
 * Verifies SMTP configuration
 *
 * @param {Function} callback Callback function
 */
SMTPPool.prototype.verify = function (callback) {
    var promise;

    if (!callback && typeof Promise === 'function') {
        promise = new Promise(function (resolve, reject) {
            callback = shared.callbackPromise(resolve, reject);
        });
    }

    this.getSocket(this.options, function (err, socketOptions) {
        if (err) {
            return callback(err);
        }

        var options = this.options;
        if (socketOptions && socketOptions.connection) {
            this.logger.info('Using proxied socket from %s:%s to %s:%s', socketOptions.connection.remoteAddress, socketOptions.connection.remotePort, options.host || '', options.port || '');
            options = assign(false, options);
            Object.keys(socketOptions).forEach(function (key) {
                options[key] = socketOptions[key];
            });
        }

        var connection = new SMTPConnection(options);
        var returned = false;

        connection.once('error', function (err) {
            if (returned) {
                return;
            }
            returned = true;
            connection.close();
            return callback(err);
        });

        connection.once('end', function () {
            if (returned) {
                return;
            }
            returned = true;
            return callback(new Error('Connection closed'));
        });

        var finalize = function () {
            if (returned) {
                return;
            }
            returned = true;
            connection.quit();
            return callback(null, true);
        };

        connection.connect(function () {
            if (returned) {
                return;
            }

            if (this.options.auth) {
                connection.login(this.options.auth, function (err) {
                    if (returned) {
                        return;
                    }

                    if (err) {
                        returned = true;
                        connection.close();
                        return callback(err);
                    }

                    finalize();
                });
            } else {
                finalize();
            }
        }.bind(this));
    }.bind(this));

    return promise;
};


/***/ }),
/* 65 */
/***/ (function(module, exports) {

module.exports = {"_from":"nodemailer-smtp-pool@2.8.2","_id":"nodemailer-smtp-pool@2.8.2","_inBundle":false,"_integrity":"sha1-LrlNbPhXgLG0clzoU7nL1ejajHI=","_location":"/nodemailer-smtp-pool","_phantomChildren":{},"_requested":{"type":"version","registry":true,"raw":"nodemailer-smtp-pool@2.8.2","name":"nodemailer-smtp-pool","escapedName":"nodemailer-smtp-pool","rawSpec":"2.8.2","saveSpec":null,"fetchSpec":"2.8.2"},"_requiredBy":["/nodemailer"],"_resolved":"https://registry.npmjs.org/nodemailer-smtp-pool/-/nodemailer-smtp-pool-2.8.2.tgz","_shasum":"2eb94d6cf85780b1b4725ce853b9cbd5e8da8c72","_spec":"nodemailer-smtp-pool@2.8.2","_where":"C:\\Users\\jgell\\Excursion_Web_Node\\node_modules\\nodemailer","author":{"name":"Andris Reinman"},"bugs":{"url":"https://github.com/andris9/nodemailer-smtp-pool/issues"},"bundleDependencies":false,"dependencies":{"nodemailer-shared":"1.1.0","nodemailer-wellknown":"0.1.10","smtp-connection":"2.12.0"},"deprecated":false,"description":"SMTP transport for Nodemailer","devDependencies":{"chai":"^3.5.0","grunt":"^1.0.1","grunt-cli":"^1.2.0","grunt-eslint":"^19.0.0","grunt-mocha-test":"^0.12.7","mocha":"^3.0.2","smtp-server":"^1.14.2"},"homepage":"http://github.com/andris9/nodemailer-smtp-pool","keywords":["SMTP","Nodemailer"],"license":"MIT","main":"lib/smtp-pool.js","name":"nodemailer-smtp-pool","repository":{"type":"git","url":"git://github.com/andris9/nodemailer-smtp-pool.git"},"scripts":{"test":"grunt mochaTest"},"version":"2.8.2"}

/***/ }),
/* 66 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var SMTPConnection = __webpack_require__(6);
var assign = __webpack_require__(20);
var EventEmitter = __webpack_require__(2).EventEmitter;
var util = __webpack_require__(0);

module.exports = PoolResource;

/**
 * Creates an element for the pool
 *
 * @constructor
 * @param {Object} options SMTPPool instance
 */
function PoolResource(pool) {
    EventEmitter.call(this);
    this.pool = pool;
    this.options = pool.options;

    this.logger = this.options.logger;

    this._connection = false;
    this._connected = false;

    this.messages = 0;
    this.available = true;
}
util.inherits(PoolResource, EventEmitter);

/**
 * Initiates a connection to the SMTP server
 *
 * @param {Function} callback Callback function to run once the connection is established or failed
 */
PoolResource.prototype.connect = function (callback) {
    this.pool.getSocket(this.options, function (err, socketOptions) {
        if (err) {
            return callback(err);
        }

        var returned = false;
        var options = this.options;
        if (socketOptions && socketOptions.connection) {
            this.logger.info('Using proxied socket from %s:%s to %s:%s', socketOptions.connection.remoteAddress, socketOptions.connection.remotePort, options.host || '', options.port || '');
            options = assign(false, options);
            Object.keys(socketOptions).forEach(function (key) {
                options[key] = socketOptions[key];
            });
        }

        this.connection = new SMTPConnection(options);

        this.connection.once('error', function (err) {
            this.emit('error', err);
            if (returned) {
                return;
            }
            returned = true;
            return callback(err);
        }.bind(this));

        this.connection.once('end', function () {
            this.close();
            if (returned) {
                return;
            }
            returned = true;
            return callback();
        }.bind(this));

        this.connection.connect(function () {
            if (returned) {
                return;
            }

            if (this.options.auth) {
                this.connection.login(this.options.auth, function (err) {
                    if (returned) {
                        return;
                    }
                    returned = true;

                    if (err) {
                        this.connection.close();
                        this.emit('error', err);
                        return callback(err);
                    }

                    this._connected = true;
                    callback(null, true);
                }.bind(this));
            } else {
                returned = true;
                this._connected = true;
                return callback(null, true);
            }
        }.bind(this));
    }.bind(this));
};

/**
 * Sends an e-mail to be sent using the selected settings
 *
 * @param {Object} mail Mail object
 * @param {Function} callback Callback function
 */
PoolResource.prototype.send = function (mail, callback) {
    if (!this._connected) {
        this.connect(function (err) {
            if (err) {
                return callback(err);
            }
            this.send(mail, callback);
        }.bind(this));
        return;
    }

    var envelope = mail.message.getEnvelope();
    var messageId = (mail.message.getHeader('message-id') || '').replace(/[<>\s]/g, '');
    var recipients = [].concat(envelope.to || []);
    if (recipients.length > 3) {
        recipients.push('...and ' + recipients.splice(2).length + ' more');
    }

    this.logger.info('Sending message <%s> using #%s to <%s>', messageId, this.id, recipients.join(', '));

    this.connection.send(envelope, mail.message.createReadStream(), function (err, info) {
        this.messages++;

        if (err) {
            this.connection.close();
            this.emit('error', err);
            return callback(err);
        }

        info.envelope = {
            from: envelope.from,
            to: envelope.to
        };
        info.messageId = messageId;

        setImmediate(function () {
            var err;
            if (this.messages >= this.options.maxMessages) {
                err = new Error('Resource exhausted');
                err.code = 'EMAXLIMIT';
                this.connection.close();
                this.emit('error', err);
            } else {
                this.pool._checkRateLimit(function () {
                    this.available = true;
                    this.emit('available');
                }.bind(this));
            }
        }.bind(this));

        callback(null, info);
    }.bind(this));
};

/**
 * Closes the connection
 */
PoolResource.prototype.close = function () {
    this._connected = false;
    if (this.connection) {
        this.connection.close();
    }
    this.emit('close');
};


/***/ }),
/* 67 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var shared = __webpack_require__(3);

module.exports = templateSender;

// expose for testing
module.exports.render = render;

/**
 * Create template based e-mail sender
 *
 * @param {Object} transport Nodemailer transport object to use for actual sending
 * @param {Object} templates Either an object with template strings or an external renderer
 * @param {Object} [defaults] Default fields set for every mail sent using this sender
 * @return {Function} Template based sender
 */
function templateSender(transport, templates, defaults) {
    templates = templates || {};
    defaults = defaults || {};

    // built in renderer
    var defaultRenderer = function (context, callback) {
        var rendered = {};
        Object.keys(templates).forEach(function (key) {
            rendered[key] = render(templates[key], {
                escapeHtml: key === 'html'
            }, context);
        });
        callback(null, rendered);
    };

    // actual renderer
    var renderer = (typeof templates.render === 'function' ? templates.render.bind(templates) : defaultRenderer);

    return function (fields, context, callback) {

        var promise;

        if (!callback && typeof Promise === 'function') {
            promise = new Promise(function (resolve, reject) {
                callback = shared.callbackPromise(resolve, reject);
            });
        }

        // render data
        renderer(context, function (err, rendered) {
            if (err) {
                return callback(err);
            }
            var mailData = mix(defaults, fields, rendered);
            setImmediate(function () {
                transport.sendMail(mailData, callback);
            });
        });

        return promise;
    };
}

/**
 * Merges multiple objects into one. Assumes single level, except 'headers'
 */
function mix( /* obj1, obj2, ..., objN */ ) {
    var args = Array.prototype.slice.call(arguments);
    var result = {};

    args.forEach(function (arg) {
        Object.keys(arg || {}).forEach(function (key) {
            if (key === 'headers') {
                if (!result.headers) {
                    result.headers = {};
                }
                Object.keys(arg[key]).forEach(function (hKey) {
                    if (!(hKey in result.headers)) {
                        result.headers[hKey] = arg[key][hKey];
                    }
                });
            } else if (!(key in result)) {
                result[key] = arg[key];
            }
        });
    });

    return result;
}

/**
 * Renders a template string using provided context. Values are marked as {{key}} in the template.
 *
 * @param {String} str Template string
 * @param {Object} options Render options. options.escapeHtml=true escapes html specific characters
 * @param {Object} context Key-value pairs for the template, eg {name: 'User Name'}
 * @return {String} Rendered template
 */
function render(str, options, context) {
    str = (str || '').toString();
    context = context || {};
    options = options || {};

    var re = /\{\{[ ]*([^{}\s]+)[ ]*\}\}/g;

    return str.replace(re, function (match, key) {
        var value;
        if (context.hasOwnProperty(key)) {
            value = context[key].toString();
            if (options.escapeHtml) {
                value = value.replace(/["'&<>]/g, function (char) {
                    switch (char) {
                        case '&':
                            return '&amp;';
                        case '<':
                            return '&lt;';
                        case '>':
                            return '&gt;';
                        case '"':
                            return '&quot;';
                        case '\'':
                            return '&#039;';
                        default:
                            return char;
                    }
                });
            }
            return value;
        }
        return match;
    });
}


/***/ }),
/* 68 */
/***/ (function(module, exports) {

module.exports = {"_from":"nodemailer@2.7.2","_id":"nodemailer@2.7.2","_inBundle":false,"_integrity":"sha1-8kLmSa7q45tsftdA73sGHEBNMPk=","_location":"/nodemailer","_phantomChildren":{},"_requested":{"type":"version","registry":true,"raw":"nodemailer@2.7.2","name":"nodemailer","escapedName":"nodemailer","rawSpec":"2.7.2","saveSpec":null,"fetchSpec":"2.7.2"},"_requiredBy":["#USER","/"],"_resolved":"https://registry.npmjs.org/nodemailer/-/nodemailer-2.7.2.tgz","_shasum":"f242e649aeeae39b6c7ed740ef7b061c404d30f9","_spec":"nodemailer@2.7.2","_where":"C:\\Users\\jgell\\Excursion_Web_Node","author":{"name":"Andris Reinman"},"bugs":{"url":"https://github.com/nodemailer/nodemailer/issues"},"bundleDependencies":false,"dependencies":{"libmime":"3.0.0","mailcomposer":"4.0.1","nodemailer-direct-transport":"3.3.2","nodemailer-shared":"1.1.0","nodemailer-smtp-pool":"2.8.2","nodemailer-smtp-transport":"2.7.2","socks":"1.1.9"},"deprecated":"All versions below 4.0.1 of Nodemailer are deprecated. See https://nodemailer.com/status/","description":"Easy as cake e-mail sending from your Node.js applications","devDependencies":{"amqp":"^0.2.6","chai":"^3.5.0","email-templates":"^2.5.4","grunt":"^1.0.1","grunt-cli":"^1.2.0","grunt-eslint":"^19.0.0","grunt-mocha-test":"^0.13.2","handlebars":"^4.0.6","mocha":"^3.2.0","nodemailer-dkim":"^1.0.4","nodemailer-markdown":"^1.0.1","nodemailer-stub-transport":"^1.1.0","proxy-test-server":"^1.0.0","sinon":"^1.17.6","smtp-server":"^1.16.1","swig-email-templates":"^4.0.0"},"engines":{"node":">=0.10.0"},"homepage":"https://nodemailer.com/","keywords":["e-mail","mime","email","mail","sendmail","ses","smtp"],"license":"MIT","main":"lib/nodemailer.js","name":"nodemailer","repository":{"type":"git","url":"https://nodemailer.com/"},"scripts":{"test":"grunt mochaTest"},"version":"2.7.2"}

/***/ }),
/* 69 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Minimal HTTP/S proxy client
 */

var net = __webpack_require__(7);
var tls = __webpack_require__(11);
var urllib = __webpack_require__(4);

module.exports = proxyConnect;

/**
 * Establishes proxied connection to destinationPort
 *
 * proxyConnect("http://localhost:3128/", 80, "google.com", function(err, socket){
 *     socket.write("GET / HTTP/1.0\r\n\r\n");
 * });
 *
 * @param {String} proxyUrl proxy configuration, etg "http://proxy.host:3128/"
 * @param {Number} destinationPort Port to open in destination host
 * @param {String} destinationHost Destination hostname
 * @param {Function} callback Callback to run with the rocket object once connection is established
 */
function proxyConnect(proxyUrl, destinationPort, destinationHost, callback) {
    var proxy = urllib.parse(proxyUrl);

    // create a socket connection to the proxy server
    var options;
    var connect;
    var socket;

    options = {
        host: proxy.hostname,
        port: Number(proxy.port) ? Number(proxy.port) : (proxy.protocol === 'https:' ? 443 : 80)
    };

    if (proxy.protocol === 'https:') {
        // we can use untrusted proxies as long as we verify actual SMTP certificates
        options.rejectUnauthorized = false;
        connect = tls.connect.bind(tls);
    } else {
        connect = net.connect.bind(net);
    }

    // Error harness for initial connection. Once connection is established, the responsibility
    // to handle errors is passed to whoever uses this socket
    var finished = false;
    var tempSocketErr = function (err) {
        if (finished) {
            return;
        }
        finished = true;
        try {
            socket.destroy();
        } catch (E) {
            // ignore
        }
        callback(err);
    };

    socket = connect(options, function () {
        if (finished) {
            return;
        }

        var reqHeaders = {
            Host: destinationHost + ':' + destinationPort,
            Connection: 'close'
        };
        if (proxy.auth) {
            reqHeaders['Proxy-Authorization'] = 'Basic ' + new Buffer(proxy.auth).toString('base64');
        }

        socket.write(
            // HTTP method
            'CONNECT ' + destinationHost + ':' + destinationPort + ' HTTP/1.1\r\n' +

            // HTTP request headers
            Object.keys(reqHeaders).map(function (key) {
                return key + ': ' + reqHeaders[key];
            }).join('\r\n') +

            // End request
            '\r\n\r\n');


        var headers = '';
        var onSocketData = function (chunk) {
            var match;
            var remainder;

            if (finished) {
                return;
            }

            headers += chunk.toString('binary');
            if ((match = headers.match(/\r\n\r\n/))) {
                socket.removeListener('data', onSocketData);
                remainder = headers.substr(match.index + match[0].length);
                headers = headers.substr(0, match.index);
                if (remainder) {
                    socket.unshift(new Buffer(remainder, 'binary'));
                }
                // proxy connection is now established
                finished = true;

                socket.removeListener('error', tempSocketErr);

                // check response code
                match = headers.match(/^HTTP\/\d+\.\d+ (\d+)/i);
                if (!match || (match[1] || '').charAt(0) !== '2') {
                    try {
                        socket.destroy();
                    } catch (E) {
                        // ignore
                    }
                    return callback(new Error('Invalid response from proxy' + (match && ': ' + match[1] || '')));
                }

                return callback(null, socket);
            }
        };
        socket.on('data', onSocketData);
    });

    socket.once('error', tempSocketErr);
}


/***/ }),
/* 70 */
/***/ (function(module, exports, __webpack_require__) {

var SocksClient = __webpack_require__(21);
var SocksAgent = __webpack_require__(73);

exports.createConnection = SocksClient.createConnection;
exports.createUDPFrame = SocksClient.createUDPFrame;
exports.Agent = SocksAgent.Agent;


/***/ }),
/* 71 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var ip = exports;
var Buffer = __webpack_require__(9).Buffer;
var os = __webpack_require__(5);

ip.toBuffer = function(ip, buff, offset) {
  offset = ~~offset;

  var result;

  if (this.isV4Format(ip)) {
    result = buff || new Buffer(offset + 4);
    ip.split(/\./g).map(function(byte) {
      result[offset++] = parseInt(byte, 10) & 0xff;
    });
  } else if (this.isV6Format(ip)) {
    var sections = ip.split(':', 8);

    var i;
    for (i = 0; i < sections.length; i++) {
      var isv4 = this.isV4Format(sections[i]);
      var v4Buffer;

      if (isv4) {
        v4Buffer = this.toBuffer(sections[i]);
        sections[i] = v4Buffer.slice(0, 2).toString('hex');
      }

      if (v4Buffer && ++i < 8) {
        sections.splice(i, 0, v4Buffer.slice(2, 4).toString('hex'));
      }
    }

    if (sections[0] === '') {
      while (sections.length < 8) sections.unshift('0');
    } else if (sections[sections.length - 1] === '') {
      while (sections.length < 8) sections.push('0');
    } else if (sections.length < 8) {
      for (i = 0; i < sections.length && sections[i] !== ''; i++);
      var argv = [ i, 1 ];
      for (i = 9 - sections.length; i > 0; i--) {
        argv.push('0');
      }
      sections.splice.apply(sections, argv);
    }

    result = buff || new Buffer(offset + 16);
    for (i = 0; i < sections.length; i++) {
      var word = parseInt(sections[i], 16);
      result[offset++] = (word >> 8) & 0xff;
      result[offset++] = word & 0xff;
    }
  }

  if (!result) {
    throw Error('Invalid ip address: ' + ip);
  }

  return result;
};

ip.toString = function(buff, offset, length) {
  offset = ~~offset;
  length = length || (buff.length - offset);

  var result = [];
  if (length === 4) {
    // IPv4
    for (var i = 0; i < length; i++) {
      result.push(buff[offset + i]);
    }
    result = result.join('.');
  } else if (length === 16) {
    // IPv6
    for (var i = 0; i < length; i += 2) {
      result.push(buff.readUInt16BE(offset + i).toString(16));
    }
    result = result.join(':');
    result = result.replace(/(^|:)0(:0)*:0(:|$)/, '$1::$3');
    result = result.replace(/:{3,4}/, '::');
  }

  return result;
};

var ipv4Regex = /^(\d{1,3}\.){3,3}\d{1,3}$/;
var ipv6Regex =
    /^(::)?(((\d{1,3}\.){3}(\d{1,3}){1})?([0-9a-f]){0,4}:{0,2}){1,8}(::)?$/i;

ip.isV4Format = function(ip) {
  return ipv4Regex.test(ip);
};

ip.isV6Format = function(ip) {
  return ipv6Regex.test(ip);
};
function _normalizeFamily(family) {
  return family ? family.toLowerCase() : 'ipv4';
}

ip.fromPrefixLen = function(prefixlen, family) {
  if (prefixlen > 32) {
    family = 'ipv6';
  } else {
    family = _normalizeFamily(family);
  }

  var len = 4;
  if (family === 'ipv6') {
    len = 16;
  }
  var buff = new Buffer(len);

  for (var i = 0, n = buff.length; i < n; ++i) {
    var bits = 8;
    if (prefixlen < 8) {
      bits = prefixlen;
    }
    prefixlen -= bits;

    buff[i] = ~(0xff >> bits) & 0xff;
  }

  return ip.toString(buff);
};

ip.mask = function(addr, mask) {
  addr = ip.toBuffer(addr);
  mask = ip.toBuffer(mask);

  var result = new Buffer(Math.max(addr.length, mask.length));

  var i = 0;
  // Same protocol - do bitwise and
  if (addr.length === mask.length) {
    for (i = 0; i < addr.length; i++) {
      result[i] = addr[i] & mask[i];
    }
  } else if (mask.length === 4) {
    // IPv6 address and IPv4 mask
    // (Mask low bits)
    for (i = 0; i < mask.length; i++) {
      result[i] = addr[addr.length - 4  + i] & mask[i];
    }
  } else {
    // IPv6 mask and IPv4 addr
    for (var i = 0; i < result.length - 6; i++) {
      result[i] = 0;
    }

    // ::ffff:ipv4
    result[10] = 0xff;
    result[11] = 0xff;
    for (i = 0; i < addr.length; i++) {
      result[i + 12] = addr[i] & mask[i + 12];
    }
    i = i + 12;
  }
  for (; i < result.length; i++)
    result[i] = 0;

  return ip.toString(result);
};

ip.cidr = function(cidrString) {
  var cidrParts = cidrString.split('/');

  var addr = cidrParts[0];
  if (cidrParts.length !== 2)
    throw new Error('invalid CIDR subnet: ' + addr);

  var mask = ip.fromPrefixLen(parseInt(cidrParts[1], 10));

  return ip.mask(addr, mask);
};

ip.subnet = function(addr, mask) {
  var networkAddress = ip.toLong(ip.mask(addr, mask));

  // Calculate the mask's length.
  var maskBuffer = ip.toBuffer(mask);
  var maskLength = 0;

  for (var i = 0; i < maskBuffer.length; i++) {
    if (maskBuffer[i] === 0xff) {
      maskLength += 8;
    } else {
      var octet = maskBuffer[i] & 0xff;
      while (octet) {
        octet = (octet << 1) & 0xff;
        maskLength++;
      }
    }
  }

  var numberOfAddresses = Math.pow(2, 32 - maskLength);

  return {
    networkAddress: ip.fromLong(networkAddress),
    firstAddress: numberOfAddresses <= 2 ?
                    ip.fromLong(networkAddress) :
                    ip.fromLong(networkAddress + 1),
    lastAddress: numberOfAddresses <= 2 ?
                    ip.fromLong(networkAddress + numberOfAddresses - 1) :
                    ip.fromLong(networkAddress + numberOfAddresses - 2),
    broadcastAddress: ip.fromLong(networkAddress + numberOfAddresses - 1),
    subnetMask: mask,
    subnetMaskLength: maskLength,
    numHosts: numberOfAddresses <= 2 ?
                numberOfAddresses : numberOfAddresses - 2,
    length: numberOfAddresses,
    contains: function(other) {
      return networkAddress === ip.toLong(ip.mask(other, mask));
    }
  };
};

ip.cidrSubnet = function(cidrString) {
  var cidrParts = cidrString.split('/');

  var addr = cidrParts[0];
  if (cidrParts.length !== 2)
    throw new Error('invalid CIDR subnet: ' + addr);

  var mask = ip.fromPrefixLen(parseInt(cidrParts[1], 10));

  return ip.subnet(addr, mask);
};

ip.not = function(addr) {
  var buff = ip.toBuffer(addr);
  for (var i = 0; i < buff.length; i++) {
    buff[i] = 0xff ^ buff[i];
  }
  return ip.toString(buff);
};

ip.or = function(a, b) {
  a = ip.toBuffer(a);
  b = ip.toBuffer(b);

  // same protocol
  if (a.length === b.length) {
    for (var i = 0; i < a.length; ++i) {
      a[i] |= b[i];
    }
    return ip.toString(a);

  // mixed protocols
  } else {
    var buff = a;
    var other = b;
    if (b.length > a.length) {
      buff = b;
      other = a;
    }

    var offset = buff.length - other.length;
    for (var i = offset; i < buff.length; ++i) {
      buff[i] |= other[i - offset];
    }

    return ip.toString(buff);
  }
};

ip.isEqual = function(a, b) {
  a = ip.toBuffer(a);
  b = ip.toBuffer(b);

  // Same protocol
  if (a.length === b.length) {
    for (var i = 0; i < a.length; i++) {
      if (a[i] !== b[i]) return false;
    }
    return true;
  }

  // Swap
  if (b.length === 4) {
    var t = b;
    b = a;
    a = t;
  }

  // a - IPv4, b - IPv6
  for (var i = 0; i < 10; i++) {
    if (b[i] !== 0) return false;
  }

  var word = b.readUInt16BE(10);
  if (word !== 0 && word !== 0xffff) return false;

  for (var i = 0; i < 4; i++) {
    if (a[i] !== b[i + 12]) return false;
  }

  return true;
};

ip.isPrivate = function(addr) {
  return /^(::f{4}:)?10\.([0-9]{1,3})\.([0-9]{1,3})\.([0-9]{1,3})$/i
      .test(addr) ||
    /^(::f{4}:)?192\.168\.([0-9]{1,3})\.([0-9]{1,3})$/i.test(addr) ||
    /^(::f{4}:)?172\.(1[6-9]|2\d|30|31)\.([0-9]{1,3})\.([0-9]{1,3})$/i
      .test(addr) ||
    /^(::f{4}:)?127\.([0-9]{1,3})\.([0-9]{1,3})\.([0-9]{1,3})$/i.test(addr) ||
    /^(::f{4}:)?169\.254\.([0-9]{1,3})\.([0-9]{1,3})$/i.test(addr) ||
    /^f[cd][0-9a-f]{2}:/i.test(addr) ||
    /^fe80:/i.test(addr) ||
    /^::1$/.test(addr) ||
    /^::$/.test(addr);
};

ip.isPublic = function(addr) {
  return !ip.isPrivate(addr);
};

ip.isLoopback = function(addr) {
  return /^(::f{4}:)?127\.([0-9]{1,3})\.([0-9]{1,3})\.([0-9]{1,3})/
      .test(addr) ||
    /^fe80::1$/.test(addr) ||
    /^::1$/.test(addr) ||
    /^::$/.test(addr);
};

ip.loopback = function(family) {
  //
  // Default to `ipv4`
  //
  family = _normalizeFamily(family);

  if (family !== 'ipv4' && family !== 'ipv6') {
    throw new Error('family must be ipv4 or ipv6');
  }

  return family === 'ipv4' ? '127.0.0.1' : 'fe80::1';
};

//
// ### function address (name, family)
// #### @name {string|'public'|'private'} **Optional** Name or security
//      of the network interface.
// #### @family {ipv4|ipv6} **Optional** IP family of the address (defaults
//      to ipv4).
//
// Returns the address for the network interface on the current system with
// the specified `name`:
//   * String: First `family` address of the interface.
//             If not found see `undefined`.
//   * 'public': the first public ip address of family.
//   * 'private': the first private ip address of family.
//   * undefined: First address with `ipv4` or loopback address `127.0.0.1`.
//
ip.address = function(name, family) {
  var interfaces = os.networkInterfaces();
  var all;

  //
  // Default to `ipv4`
  //
  family = _normalizeFamily(family);

  //
  // If a specific network interface has been named,
  // return the address.
  //
  if (name && name !== 'private' && name !== 'public') {
    var res = interfaces[name].filter(function(details) {
      var itemFamily = details.family.toLowerCase();
      return itemFamily === family;
    });
    if (res.length === 0)
      return undefined;
    return res[0].address;
  }

  var all = Object.keys(interfaces).map(function (nic) {
    //
    // Note: name will only be `public` or `private`
    // when this is called.
    //
    var addresses = interfaces[nic].filter(function (details) {
      details.family = details.family.toLowerCase();
      if (details.family !== family || ip.isLoopback(details.address)) {
        return false;
      } else if (!name) {
        return true;
      }

      return name === 'public' ? ip.isPrivate(details.address) :
          ip.isPublic(details.address);
    });

    return addresses.length ? addresses[0].address : undefined;
  }).filter(Boolean);

  return !all.length ? ip.loopback(family) : all[0];
};

ip.toLong = function(ip) {
  var ipl = 0;
  ip.split('.').forEach(function(octet) {
    ipl <<= 8;
    ipl += parseInt(octet);
  });
  return(ipl >>> 0);
};

ip.fromLong = function(ipl) {
  return ((ipl >>> 24) + '.' +
      (ipl >> 16 & 255) + '.' +
      (ipl >> 8 & 255) + '.' +
      (ipl & 255) );
};


/***/ }),
/* 72 */
/***/ (function(module, exports) {

var SmartBuffer = (function () {

    /**
     * Constructor for SmartBuffer.
     * @param arg1 {Buffer || Number || String} Buffer to read from, or expected size to write to, or encoding to use.
     * @param arg2 {String} Encoding to use for writing and reading strings. Defaults to utf8. If encoding is given in arg1, this is ignored.
     * @constructor
     *
     * There are a few ways to construct a SmartBuffer:
     *
     * SmartBuffer() - Defaults to utf8, 4096 pre-set internal Buffer length.
     * SmartBuffer(size) - Defaults to utf8, sets internal Buffer length to the size given.
     * SmartBuffer(encoding) - Sets the given encoding, defaults to 4096 pre-set internal Buffer length.
     * SmartBuffer(Buffer) - Defaults to utf8, sets the internal Buffer to the given buffer (same memory).
     * SmartBuffer(Buffer, encoding) - Sets the given encoding, sets the internal Buffer to the given buffer (same memory).
     *
     */
    function SmartBuffer(arg1, arg2) {
        var type;
        switch (type = typeof arg1) {
            case 'number':
                if (isFinite(arg1) && arg1 > 0) {
                    this.buff = new Buffer(Math.ceil(arg1));
                    this.length = 0;
                } else {
                    throw new Error('When specifying a size, it must be a valid number above zero.');
                }
                break;

            case 'string':
                if (Buffer.isEncoding(arg1)) {
                    this.buff = new Buffer(4096);
                    this.length = 0;
                    this.encoding = arg1;
                } else {
                    throw new Error('Invalid Encoding');
                }
                break;

            case 'object':
                if (Buffer.isBuffer(arg1)) {
                    this.buff = arg1;
                    this.length = arg1.length;
                } else {
                    throw new TypeError('First argument must be a Buffer, Number representing the size, or a String representing the encoding.');
                }
                break;

            default:
                this.buff = new Buffer(4096);
                this.length = 0;
                break;
        }

        if (typeof this.encoding === 'undefined') {
            if (typeof arg2 === 'string') {
                if (Buffer.isEncoding(arg2)) {
                    this.encoding = arg2;
                } else {
                    throw new Error('Invalid Encoding');
                }
            }
        }

        this._readOffset = 0;
        this._writeOffset = 0;
    }


    SmartBuffer.prototype._ensureWritable = function (len, offset) {
        this._ensureCapacity(this.length + len + (typeof offset === 'number' ? offset : 0));

        if (typeof offset === 'number') {
            this.buff.copy(this.buff, offset + len, offset, this.buff.length);
        }
        this.length = Math.max(this.length + len, (typeof offset === 'number' ?  offset : 0) + len);
    };

    SmartBuffer.prototype._ensureCapacity = function (minlen) {
        var oldlen = this.buff.length;

        if (minlen > oldlen) {
            var data = this.buff;
            var newlen = (oldlen * 3) / 2 + 1;
            if (newlen < minlen)
                newlen = minlen;
            this.buff = new Buffer(newlen);
            data.copy(this.buff, 0, 0, oldlen);
        }
    };


    var makeReader = function (func, size) {
        return function () {
            var ret = func.call(this.buff, this._readOffset);
            this._readOffset += size;
            return ret;
        }
    };

    var makeWriter = function (func, size) {
        return function (value, offset) {
            this._ensureWritable(size, offset);
            func.call(this.buff, value, typeof offset === 'number' ? offset : this._writeOffset);
            this._writeOffset += size;
            return this;
        }
    };


    /*
     Read Operations
     */

    SmartBuffer.prototype.readInt8 = makeReader(Buffer.prototype.readInt8, 1);
    SmartBuffer.prototype.readInt16BE = makeReader(Buffer.prototype.readInt16BE, 2);
    SmartBuffer.prototype.readInt16LE = makeReader(Buffer.prototype.readInt16LE, 2);
    SmartBuffer.prototype.readInt32BE = makeReader(Buffer.prototype.readInt32BE, 4);
    SmartBuffer.prototype.readInt32LE = makeReader(Buffer.prototype.readInt32LE, 4);

    SmartBuffer.prototype.readUInt8 = makeReader(Buffer.prototype.readUInt8, 1);
    SmartBuffer.prototype.readUInt16BE = makeReader(Buffer.prototype.readUInt16BE, 2);
    SmartBuffer.prototype.readUInt16LE = makeReader(Buffer.prototype.readUInt16LE, 2);
    SmartBuffer.prototype.readUInt32BE = makeReader(Buffer.prototype.readUInt32BE, 4);
    SmartBuffer.prototype.readUInt32LE = makeReader(Buffer.prototype.readUInt32LE, 4);

    SmartBuffer.prototype.readFloatBE = makeReader(Buffer.prototype.readFloatBE, 4);
    SmartBuffer.prototype.readFloatLE = makeReader(Buffer.prototype.readFloatLE, 4);

    SmartBuffer.prototype.readDoubleBE = makeReader(Buffer.prototype.readDoubleBE, 8);
    SmartBuffer.prototype.readDoubleLE = makeReader(Buffer.prototype.readDoubleLE, 8);


    /**
     * Reads a string of the given length.
     * @param length {Number} The length of the string to read. (Defaults to the length of the remaining data)
     * @param encoding {String} The encoding to use. (Defaults to encoding set in constructor, or utf8)
     * @returns {string} The string.
     */
    SmartBuffer.prototype.readString = function (length, encoding) {
        var len = Math.min(length, this.length - this._readOffset) || (this.length - this._readOffset);
        var ret = this.buff.slice(this._readOffset, this._readOffset + len).toString(encoding || this.encoding);
        this._readOffset += len;
        return ret;
    };

    /**
     * Reads a null terminated string from the underlying buffer.
     * @param encoding {String} Encoding to use. Defaults to encoding set in constructor, or utf8.
     * @returns {string}
     */
    SmartBuffer.prototype.readStringNT = function (encoding) {
        var nullpos = this.length;
        for (var i = this._readOffset; i < this.length; i++) {
            if (this.buff[i] == 0x00) {
                nullpos = i;
                break;
            }
        }

        var result = this.buff.slice(this._readOffset, nullpos);
        this._readOffset = nullpos + 1;

        return result.toString(encoding || this.encoding);
    };


    /**
     * Reads a specified number of bytes.
     * @param len {Number} Numbers of bytes to read. (Defaults to the remaining data length)
     * @returns {Buffer} Buffer containing the read bytes.
     */
    SmartBuffer.prototype.readBuffer = function (len) {
        var endpoint = Math.min(this.length, this._readOffset + (typeof len === 'number' ? len : this.length));
        var ret = this.buff.slice(this._readOffset, endpoint);
        this._readOffset = endpoint;
        return ret;
    };

    /**
     * Reads a null terminated sequence of bytes from the underlying buffer.
     * @returns {Buffer} Buffer containing the read bytes.
     */
    SmartBuffer.prototype.readBufferNT = function () {
        var nullpos = this.length;
        for (var i = this._readOffset; i < this.length; i++) {
            if (this.buff[i] == 0x00) {
                nullpos = i;
                break;
            }
        }

        var ret = this.buff.slice(this._readOffset, nullpos);
        this._readOffset = nullpos + 1;

        return ret;
    };


    /*
     Write Operations
     */


    SmartBuffer.prototype.writeInt8 = makeWriter(Buffer.prototype.writeInt8, 1);
    SmartBuffer.prototype.writeInt16BE = makeWriter(Buffer.prototype.writeInt16BE, 2);
    SmartBuffer.prototype.writeInt16LE = makeWriter(Buffer.prototype.writeInt16LE, 2);
    SmartBuffer.prototype.writeInt32BE = makeWriter(Buffer.prototype.writeInt32BE, 4);
    SmartBuffer.prototype.writeInt32LE = makeWriter(Buffer.prototype.writeInt32LE, 4);

    SmartBuffer.prototype.writeUInt8 = makeWriter(Buffer.prototype.writeUInt8, 1);
    SmartBuffer.prototype.writeUInt16BE = makeWriter(Buffer.prototype.writeUInt16BE, 2);
    SmartBuffer.prototype.writeUInt16LE = makeWriter(Buffer.prototype.writeUInt16LE, 2);
    SmartBuffer.prototype.writeUInt32BE = makeWriter(Buffer.prototype.writeUInt32BE, 4);
    SmartBuffer.prototype.writeUInt32LE = makeWriter(Buffer.prototype.writeUInt32LE, 4);

    SmartBuffer.prototype.writeFloatBE = makeWriter(Buffer.prototype.writeFloatBE, 4);
    SmartBuffer.prototype.writeFloatLE = makeWriter(Buffer.prototype.writeFloatLE, 4);

    SmartBuffer.prototype.writeDoubleBE = makeWriter(Buffer.prototype.writeDoubleBE, 8);
    SmartBuffer.prototype.writeDoubleLE = makeWriter(Buffer.prototype.writeDoubleLE, 8);


    /**
     * Writes a string to the underlying buffer.
     * @param value {String} The string to write.
     * @param offset {Number} The offset to write the string to. (Encoding can also be set here in place of offset)
     * @param encoding {String} The encoding to use. (Defaults to encoding set in constructor, or to utf8)
     * @returns {*}
     */
    SmartBuffer.prototype.writeString = function (value, offset, encoding) {
        var len, _offset, type = typeof offset;

        if (type === 'number') {
            _offset = offset;
        } else if (type === 'string') {
            encoding = offset;
            offset = this._writeOffset;
        } else {
            encoding = undefined;
            offset = this._writeOffset;
        }

        len = Buffer.byteLength(value, encoding || this.encoding);
        this._ensureWritable(len, _offset);

        this.buff.write(value, offset, len, encoding || this.encoding);
        this._writeOffset += len;
        return this;
    };

    /**
     * Writes a null terminated string to the underlying buffer.
     * @param value {String} The string to write.
     * @param offset {Number} The offset to write the string to. (Encoding can also be set here in place of offset)
     * @param encoding {String} The encoding to use. (Defaults to encoding set in constructor, or to utf8)
     * @returns {*}
     */
    SmartBuffer.prototype.writeStringNT = function (value, offset, encoding) {
        this.writeString(value, offset, encoding);
        this.writeUInt8(0x00, (typeof offset === 'number' ? offset + value.length : this._writeOffset));
        return this;
    };

    /**
     * Writes a Buffer to the underlying buffer.
     * @param value {Buffer} The buffer to write.
     * @param offset {Number} The offset to write the Buffer to.
     * @returns {*}
     */
    SmartBuffer.prototype.writeBuffer = function (value, offset) {
        var len = value.length;
        this._ensureWritable(len, offset);
        value.copy(this.buff, typeof offset === 'number' ? offset : this._writeOffset);
        this._writeOffset += len;
        return this;
    };

    /**
     * Writes a null terminated Buffer to the underlying buffer.
     * @param value {Buffer} The buffer to write.
     * @param offset {Number} The offset to write the Buffer to.
     * @returns {*}
     */
    SmartBuffer.prototype.writeBufferNT = function (value, offset) {
        this.writeBuffer(value, offset);
        this.writeUInt8(0x00, (typeof offset === 'number' ? offset + value.length : this._writeOffset));

        return this;
    };


    /**
     * Resets the Endless Buffer.
     */
    SmartBuffer.prototype.clear = function () {
        this._writeOffset = 0;
        this._readOffset = 0;
        this.length = 0;
    };

    /**
     * Gets the remaining number of bytes to be read from the existing Buffer.
     * @returns {number} The number of bytes remaining.
     */
    SmartBuffer.prototype.remaining = function () {
        return this.length - this._readOffset;
    };

    /**
     * Skips the read position forward by the amount of given.
     * @param amount {Number} The amount of bytes to skip forward.
     */
    SmartBuffer.prototype.skip = function (amount) {
        if (this._readOffset + amount > this.length)
            throw new Error('Target position is beyond the bounds of the data.');

        this._readOffset += amount;
    };

    /**
     * Rewinds the read position backward by the amount given.
     * @param amount {Number} The amount of bytes to reverse backward.
     */
    SmartBuffer.prototype.rewind = function (amount) {
        if (this._readOffset - amount < 0)
            throw new Error('Target position is beyond the bounds of the data.');

        this._readOffset -= amount;
    };

    /**
     * Skips the read position to the given position.
     * @param position {Number} The position to skip to.
     */
    SmartBuffer.prototype.skipTo = function (position) {
        if (position < 0 || position > this.length)
            throw new Error('Target position is beyond the bounds of the data.');

        this._readOffset = position;
    };

    /**
     * Gets the underlying Buffer.
     * @returns {*}
     */
    SmartBuffer.prototype.toBuffer = function () {
        return this.buff.slice(0, this.length);
    };

    /**
     * Gets a string representation of the underlying Buffer.
     * @param encoding {String} Encoding to use. (Defaults to encoding set in constructor, or utf8.)
     * @returns {*}
     */
    SmartBuffer.prototype.toString = function (encoding) {
        return this.buff.toString(encoding || this.encoding, 0, this.length);
    };

    /**
     * Destroys the underlying Buffer, and resets the SmartBuffer.
     */
    SmartBuffer.prototype.destroy = function () {
        delete this.buff;
        this.clear();
    };

    return SmartBuffer;
})();

module.exports = SmartBuffer;

/***/ }),
/* 73 */
/***/ (function(module, exports, __webpack_require__) {

var tls = __webpack_require__(11);
var inherits = __webpack_require__(0).inherits;
var EventEmitter = __webpack_require__(2).EventEmitter;
var SocksClient = __webpack_require__(21);

function SocksAgent(options, secure, rejectUnauthorized) {
    this.options = options;
    this.secure = secure || false;
    this.rejectUnauthorized = rejectUnauthorized;

    if (this.rejectUnauthorized === undefined) {
        this.rejectUnauthorized = true;
    }
}

inherits(SocksAgent, EventEmitter);

SocksAgent.prototype.createConnection = function(req, opts, fn) {
    var handler = fn, host, self = this;

    this.options.target = this.options.target || {};

    if (!this.options.target.host) {
        this.options.target.host = opts.host;
    }

    if (!this.options.target.port) {
        this.options.target.port = opts.port;
    }

    host = this.options.target.host;

    if (this.secure) {
        handler = function(err, socket, info) {
            var options, cleartext;

            if (err) {
                return fn(err);
            }

            // save encrypted socket
            self.encryptedSocket = socket;

            options = {
                socket: socket,
                servername: host,
                rejectUnauthorized: self.rejectUnauthorized
            };

            cleartext = tls.connect(options, function (err) {
                return fn(err, this);
            });
            cleartext.on('error', fn);

            socket.resume();
        }
    }

    SocksClient.createConnection(this.options, handler);
};

/**
 * @see https://www.npmjs.com/package/agent-base
 */
SocksAgent.prototype.addRequest = function(req, host, port, localAddress) {
    var opts;
    if ('object' === typeof host) {
        // >= v0.11.x API
        opts = host;
        if (opts.host && opts.path) {
            // if both a `host` and `path` are specified then it's most likely the
            // result of a `url.parse()` call... we need to remove the `path` portion so
            // that `net.connect()` doesn't attempt to open that as a unix socket file.
            delete opts.path;
        }
    } else {
        // <= v0.10.x API
        opts = { host: host, port: port };
        if (null !== localAddress) {
            opts.localAddress = localAddress;
        }
    }

    var sync = true;

    this.createConnection(req, opts, function (err, socket) {
        function emitErr () {
            req.emit('error', err);
        }
        if (err) {
            if (sync) {
                // need to defer the "error" event, when sync, because by now the `req`
                // instance hasn't event been passed back to the user yet...
                process.nextTick(emitErr);
            } else {
                emitErr();
            }
        } else {
            req.onSocket(socket);
            //have to resume this socket when node 12
            socket.resume();
        }
    });

    sync = false;
};

exports.Agent = SocksAgent;


/***/ }),
/* 74 */
/***/ (function(module, exports) {

function webpackEmptyContext(req) {
	throw new Error("Cannot find module '" + req + "'.");
}
webpackEmptyContext.keys = function() { return []; };
webpackEmptyContext.resolve = webpackEmptyContext;
module.exports = webpackEmptyContext;
webpackEmptyContext.id = 74;

/***/ })
/******/ ])));