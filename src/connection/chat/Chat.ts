import Message from "./Message";

class Chat {
    static filterMessage(message: Message): Message {
        message.message = message.message.trim();

        message.message = message.message.replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");

        message.message = message.message.slice(0, 200);
        return message;
    }
}

export default Chat;
