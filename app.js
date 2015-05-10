require('dotenv').load();
var packageJSON = require('./package.json');
var config = packageJSON.config;

var checker = require('./lib/check-url')();
var notifier = require('./lib/notify-sms')();

checker.onMessage(function(msg) {
    console.log("Checker: " + msg);
});

checker.onError(function(err) {
    console.log("Checker has reported an issue: " + err);
});

//config.destinationNumbers.forEach(function(number) {
(function() {
    var number = process.env.DESTINATION_NUMBER;
    console.log("Adding notifier for number: " + number);
    checker.addNotifier(notifier(number));
});
//});

checker.setInterval(config.checkIntervalSeconds);

checker.addCheck("SYSTEM007", 
                 "http://www.wearesystem.co.uk/product/systm007-las-backyard-tic", 
                 function(page) {

    // Return true iff "Coming Soon" is not present
    return !(/(Coming Soon)/.test(page));

});

checker.start();
