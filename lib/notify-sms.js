function NotifySMS(client, destination, message, callback) {
    client.sendMessage({

        to: destination,
        from: '+441234911608',
        body: message

    }, callback);
}

module.exports = function(twilioCredentials) {
    // Create our Twilio client to send notifications from
    var client = require('twilio')(twilioCredentials.sid, twilioCredentials.token);

    // Return a function allowing specification of a phone number
    return function(destination) {

        this.destination = destination;

        // This function can be reused to send multiple messages to same receiver
        return function(message, callback) {
            NotifySMS(client, destination, message, callback);
        };
    };
}