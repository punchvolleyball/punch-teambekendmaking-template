import FirebaseHelper from "./players/FirebaseHelper";
import WebsocketHelper from "./connection/WebsocketHelper";

FirebaseHelper.init();

let waitUntil = require('wait-until');

waitUntil(1000, 20, function condition() {
    return FirebaseHelper.loaded;
}, function done(result) {
    if (result) {
        WebsocketHelper.init();
    } else {
        throw new Error("Could not load players from firebase.")
    }
});
