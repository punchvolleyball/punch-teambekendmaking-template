import PlayerManager from "./PlayerManager";

const server = require('http').createServer();
const io = require('socket.io')(server);

import InputParser from "./InputParser";
import Message from "./model/Message";
import Player from "./model/Player";

class WebsocketHelper {
    public static init() {

        io.on('connection', function (socket) {
            console.log('a user connected');
            socket.emit("unlocked players", PlayerManager.getAllUnlockedPlayers());
            socket.emit('capture progress', PlayerManager.getProgressString());
            socket.emit('connection count', io.engine.clientsCount);

            socket.on('disconnect', function () {
                console.log('user disconnected');
            });


            socket.on("chat message", function (request) {
                // TODO(@Dennis) properly implement the chat with filters and such.
                let chatMessage: Message;
                try {
                    chatMessage = InputParser.chatMessage(request);
                } catch (e) {
                    socket.emit("notification", e.message);
                    return;
                }
                console.log(`chat request - ${chatMessage.user}: ${chatMessage.message}`);

                chatMessage.message = chatMessage.message.trim();

                chatMessage.message = chatMessage.message.replace(/&/g, "&amp;")
                    .replace(/</g, "&lt;")
                    .replace(/>/g, "&gt;")
                    .replace(/"/g, "&quot;")
                    .replace(/'/g, "&#039;");

                chatMessage.message = chatMessage.message.slice(0, 200);

                WebsocketHelper.broadCastChat(chatMessage);
            });


            socket.on("get unlocked players", function () {
                console.log("Sending unlocked players");
                socket.emit("unlocked players", PlayerManager.getAllUnlockedPlayers());
            });

        });

        let port = process.env.PORT || 3000;
        server.listen(port, () => {
            console.log(`Server started on port ${port} :)`);
        });

    }

    public static broadCastPlayerUnlocked(player: Player) {
        let team = PlayerManager.getPlayerTeamShortName(player.name);
        io.emit('notifications', player.name + " is placed in " + team + "!", {for: 'everyone'});
    }

    public static broadCastUnlockedPlayers(unlockedPlayers: Player[]) {
        io.emit('unlocked players', unlockedPlayers, {for: 'everyone'});
    }

    static broadCastChat(message: Message) {
        io.emit('chat', message, {for: 'everyone'});
    }

    static broadCastConnectionCount() {
        io.emit('connection count', io.engine.clientsCount, {for: 'everyone'});
    }

    static broadCastCaptureProgress() {
        io.emit('capture progress', PlayerManager.getProgressString(), {for: 'everyone'});
    }

}

export default WebsocketHelper
