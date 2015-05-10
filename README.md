# midcheck

Simple NodeJS program to notify clients by SMS when certain conditions are met on a web page's source content.

------

## Installation & Execution

First: you'll need an activated Twilio account. Free trial works OK.

Then:

    git clone https://github.com/tomtwo/midcheck
    cd midcheck && npm install
    # Configure package.json with Twilio API credentials and target SMS number
    # Modify app.js to include your checks
    npm start

It's recommended to background this process, so that it can continuously keep checking. For example, you may use nohup:

    nohup npm start &

## Configuration

### env

Sensitive config is passed in via env:

      TWILIO_ACCOUNT_SID=<your twilio sid>
      TWILIO_AUTH_TOKEN=<your twilio auth token>
      TWILIO_PHONE_NUMBER=<your twilio phone number>
      DESTINATION_NUMBER=<phone number to notify>

Alternatively, put the above in a `.env` file to pass environment variables in via [dotenv](https://github.com/bkeepers/dotenv).


### package.json

In package.json, you can configure app's configuration:

      "config": {
        "checkIntervalSeconds": <INTERVAL IN SECONDS TO CHECK PAGES>
      }

### app.js

In app.js, the main app's logic is contained. You must add checks by calling _checker.addCheck()_:

    checker.addCheck("SYSTEM007", 
                     "http://www.wearesystem.co.uk/product/systm007-las-backyard-tic", 
                     function(page) {

        // Return true iff "Coming Soon" is not present
        return !(/(Coming Soon)/.test(page));

    });

Arguments:

- name (string): A name for the check, which is quoted when users are notified
- url (string): The URL for which to perform the check on
- callback(page) (function): Callback which to perform your synchronous analysis of the page, returning true when the client should be alerted

## Documentation for internal objects

No public API is available (yet), please do not depend on any of this for external projects. Fork or use as given.

## License

MIT

## Future work

Currently this project is fairly flexible for basic use cases. In future, all synchronous calls should probably be removed - it's not the NodeJS way!

Also, I'm not sure about the current configuration split between package.json and app.js. I may move more app logic out of app.js and move the configuration in from package.json.

## midcheck?!

[Midnight Checker](https://www.youtube.com/watch?v=_OUxAPgV_AA)