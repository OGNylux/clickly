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

enum clientMessageTypes {
    Authentication = "authentication",
    SetState = "setState",
    GetState = "getState",
    GetLeaderboard = "getLeaderboard",
    SendMessage = "sendMessage",
    DebugEvent = "debugEvent",
    EventScore = "eventScore"
}

enum serverMessageTypes {
    ChatMessage = "chatMessage",
    GameState = "gameState",
    Leaderboard = "leaderboard",
    Messages = "messages",
    Error = "error",
    Success = "success",
    EventStart = "EventStart",
    EventEnd = "eventEnd"
}

// enum eventTypes {
//     TestEvent = "TestEvent.svelte",
//     Cookie = "CookieEventWrapper.svelte",
// }


type Event = {
    name: string;
    component: string;
    description: string;
}

const eventTypes: Map<string, Event[]> = new Map([
    ["TestEvent", [
        {
            name: "TestEvent",
            component: "TestEvent.svelte",
            description: "This is a test event"
        }
    ]],
    ["Cookie", [
        {
            name: "Cookie",
            component: "CookieEventWrapper.svelte",
            description: "This is a test event"
        }
    ]]
]);

export type { ClientMessage, ServerMessage, GameState };
export { clientMessageTypes, serverMessageTypes, eventTypes };