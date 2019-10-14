import Message from "./chat/Message";

class InputParser {
    public static chatMessage(data): Message {
        if (data.user === null || data.user === undefined) {
            throw Error("user is not defined");
        }
        if (data.message === null || data.message === undefined) {
            throw Error("message is not defined");
        }
        return new Message(data.user, data.message);
    }
}

export default InputParser;
