interface ClientMessage {
    username: string;
    type: clientMessageTypes;
    message: {};
}

interface ServerMessage {
    type: serverMessageTypes;
    message: {};
}

enum clientMessageTypes {
    Authentication = "authentication",
    SetState = "setState",
    GetState = "getState",
    GetLeaderboard = "getLeaderboard",
    SendMessage = "sendMessage"
}

enum serverMessageTypes {
    ChatMessage = "chatMessage",
    GameState = "gameState",
    Leaderboard = "leaderboard",
    Messages = "messages",
    Error = "error",
    Success = "success"
}

export type { ClientMessage, ServerMessage };
export { clientMessageTypes, serverMessageTypes };