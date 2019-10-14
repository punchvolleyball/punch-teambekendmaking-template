let admin = require("firebase-admin");

import PlayerManager from "./PlayerManager";

class FirebaseHelper {
    private static database;
    public static loaded = false;

    // TODO Change to your firebase URL.
    private static databaseURL: string = "https://teambekendmaking-template.firebaseio.com/";

    public static init() {
        if (process.env.HEROKU) {
            console.log("Running on Heroku");
            admin.initializeApp({
                credential: admin.credential.cert(JSON.parse(process.env.SERVICE_ACCOUNT_KEY)),
                databaseURL: this.databaseURL
            });
        } else {
            console.log("Running locally");
            let serviceAccount = require("../serviceAccountKey.json");
            admin.initializeApp({
                credential: admin.credential.cert(serviceAccount),
                databaseURL: this.databaseURL
            });
        }

        this.database = admin.app().database();
        this.connectPlayerManager();
    }

    public static connectPlayerManager() {
        this.database.ref().on('value', function (snap) {
            let json = snap.val();
            PlayerManager.fromJSON(json.teams);
            console.log("Team list loaded!");
            FirebaseHelper.loaded = true;
        });

    }

    public static unlockPlayer(teamIndex: number, playerIndex: number) {
        this.database.ref("/teams/" + teamIndex + "/players/" + playerIndex).update({
            unlocked: true
        });
    }

    // TODO Change to a meaningful method
    public static updateSetting(amount: number = 1) {
        this.database.ref("/config/").update({
            "setting": amount
        });
    }

}

export default FirebaseHelper