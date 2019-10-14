import Team from "./Team";
import FirebaseHelper from "./FirebaseHelper";
import Player from "./Player";
import WebsocketHelper from "../connection/WebsocketHelper";

class PlayerManager {
    public static teams: Team[];

    public static fromJSON(teamsJson) {
        this.teams = [];
        for (let i = 0; i < teamsJson.length; i++) {
            let team = Team.fromJSON(teamsJson[i]);
            this.teams.push(team);
        }
    }

    // Return the team- and playerindex of the player
    public static getPlayerIndices(name: string) {
        if (this.teams === undefined) {
            throw new Error("Player managers teamList is empty");
        }
        for (let i = 0; i < this.teams.length; i++) {
            let team = this.teams[i];
            for (let j = 0; j < team.players.length; j++) {
                let player = team.players[j];
                if (player.name == name) {
                    return [i, j];
                }
            }
        }
        throw new Error("Could not find player " + name);
    }

    public static getPlayerTeam(name: string) {
        return this.getPlayerIndices(name)[0];
    }

    public static getPlayerTeamShortName(name: string) {
        let teamNumber = this.getPlayerTeam(name);
        return this.teams[teamNumber].shortName;
    }

    public static getRandomLockedPlayer(blackList: Player[] = []) {
        let playerList = [];
        for (let i = 0; i < this.teams.length; i++) {
            for (let j = 0; j < this.teams[i].players.length; j++) {
                if (!this.teams[i].players[j].unlocked && !this.contains(this.teams[i].players[j].name, blackList)) {
                    playerList.push(this.teams[i].players[j]);
                }
            }
        }
        if (playerList.length > 0) {
            return playerList[Math.floor(Math.random() * playerList.length)];
        }
        throw new Error("All players are unlocked or blacklisted.");
    }

    private static contains(name: string, blackList: Player[]) {
        for (let i = 0; i < blackList.length; i++) {
            if (name == blackList[i].name) {
                return true;
            }
        }
        return false;
    }

    public static getPlayerByName(name: string) {
        let teamIndex = -1;
        let playerIndex = -1;
        try {
            [teamIndex, playerIndex] = this.getPlayerIndices(name);
        } catch (e) {
            console.log(e.message);
            return;
        }
        return this.teams[teamIndex].players[playerIndex];
    }

    public static isPlayerUnlocked(name: string) {
        return this.getPlayerByName(name).unlocked
    }

    public static unlockPlayerByName(name: string) {
        let teamIndex = -1;
        let playerIndex = -1;
        try {
            [teamIndex, playerIndex] = this.getPlayerIndices(name);
        } catch (e) {
            console.log(e.message);
            return;
        }
        console.log("Unlocking player " + name + "!");
        this.teams[teamIndex].players[playerIndex].unlocked = true;
        WebsocketHelper.broadCastCaptureProgress();
        FirebaseHelper.unlockPlayer(teamIndex, playerIndex);
    }

    public static getAllUnlockedPlayers() {
        if (this.teams == undefined) {
            return [];
        }
        let teamCopy = JSON.parse(JSON.stringify(this.teams));
        for (let i = 0; i < teamCopy.length; i++) {
            for (let j = 0; j < teamCopy[i].players.length; j++) {
                if (!teamCopy[i].players[j].unlocked) {
                    teamCopy[i].players.splice(j, 1);
                    j--;
                }
            }
        }
        return teamCopy;
    }

    public static getProgressString() {
        return this.getUnlockedPlayerCount() + "/" + this.getTotalPlayerCount();
    }

    public static getUnlockedPlayerCount() {
        let count = 0;
        for (let i = 0; i < this.teams.length; i++) {
            for (let j = 0; j < this.teams[i].players.length; j++) {
                if (this.teams[i].players[j].unlocked) {
                    count++
                }
            }
        }
        return count;
    }

    public static getTotalPlayerCount() {
        let count = 0;
        for (let i = 0; i < this.teams.length; i++) {
            count += this.teams[i].players.length;
        }
        return count;
    }
}

export default PlayerManager