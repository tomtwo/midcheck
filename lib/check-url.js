
var DEFAULT_CHECK_INTERVAL = 30; // seconds


var request = require('request');

/**
 * Represents a single 'Checker', which will perform tests
 * on given URLs and notify a given 'Notifier' object.
 * @constructor
 */
function CheckURL() {
    this.checkers = [];
    this.notifiers = [];
    this.onErrorCallback = function() {};
    this.onMessageCallback = function() {};
    this.interval = DEFAULT_CHECK_INTERVAL;
}

/**
 * Adds a 'Notifier' object to list of clients to notify
 * @param {Notifier} notifier - Notifier to signal.
 */
CheckURL.prototype.addNotifier = function(notifier) {
    this.notifiers.push(notifier);
};

/**
 * Sends a given signal to all added notifiers
 * @param {string} message - Signal to send to notifiers.
 */
CheckURL.prototype.notify = function(message) {
    this.message("Notifying clients: " + message);

    var self = this;
    this.notifiers.forEach(function(notify) {
        notify(message, function(err) {
            // Redirect the error to appropriate handler
            if(err) self.error(err); 
        });
    });
};

/**
 * Sends an error signal to parent of this object
 * @param {Object} err - Error signal to send.
 */
CheckURL.prototype.error = function(err) {
    this.onErrorCallback(err);
};

/**
 * Registers a callback as the error handler for this Checker
 * @param {function} callback - Called when this Checker has an error.
 */
CheckURL.prototype.onError = function(callback) {
    this.onErrorCallback = callback;
};

/**
 * Sends message to parent of this object
 * @param {Object} message - Message to send.
 */
CheckURL.prototype.message = function(msg) {
    this.onMessageCallback(msg);
};

/**
 * Registers a callback as the message handler for this Checker
 * @param {function} callback - Called when this Checker has a message.
 */
CheckURL.prototype.onMessage = function(callback) {
    this.onMessageCallback = callback;
};

/**
 * Sets the interval at which to perform all checks
 * @param {int} seconds - Time interval in SECONDS.
 */
CheckURL.prototype.setInterval = function(seconds) {
    this.interval = seconds;
};

/**
 * Adds a new check to list of checks performed by this Checker
 * @param {string} name - Identifier for this checker.
 * @param {string} url - URL of webpage to check.
 * @param {function} testCallback - Synchronous function to test URL's contents.
 */
CheckURL.prototype.addCheck = function(name, url, testCallback) {
    // We callback() to retrieve whether a notification is appropriate

    var check = {
        name: name,
        url: url,
        test: testCallback
    };

    this.checkers.push(check);
};

/**
 * Performs all checks added to this Checker
 */
CheckURL.prototype.performChecks = function() {
    var checker = this;
    this.checkers.forEach(function(check) {

        request(check.url, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                // Retrieved the page successfully, perform test
                if(check.test(body)) {
                    // Positive flag, we need to send notifications
                    checker.notify('Checker ' + check.name + ' has sent a signal. URL: ' + check.url);
                }
            } else {
                // Failure to fetch page properly: we cannot test this!
                checker.error('Failed to retrieve page for ' + check.name);
            }
        });

    });
};

/**
 * Starts checking loop
 */
CheckURL.prototype.start = function() {
    this.message('Starting checker, interval set to: ' + this.interval + 's');
    var self = this;

    // Perform initial check:
    self.performChecks();

    setInterval(function() {
        self.performChecks();
    }, this.interval * 1000);
};

// ---------------------------------------- // 

module.exports = function() {
    return new CheckURL();
};
