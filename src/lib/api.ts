interface ClientMessage {
    username: string;
    type: clientMessageTypes;
    message: {};
}

interface ServerMessage {
    type: serverMessageTypes;
    message: {};
}

interface GameState {
    score: number;
    emojis: number;
    crops: number;
    clicker: number;
    passive: number[];
    farm: number[];
}

interface Leaderboard {
    username: string;
    score: number;
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

export type { ClientMessage, ServerMessage, GameState, Leaderboard };
export { clientMessageTypes, serverMessageTypes };