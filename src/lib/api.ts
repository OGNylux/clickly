interface ClientMessage {
    username: string;
    type: clientMessageTypes;
    message: {};
}

interface ServerMessage {
    type: serverMessageTypes;
    message: EventEndMessage | {};
}

interface EventEndMessage {
    Leaderboard: Array<{Name: string, Score: number}>;
    ParticipantsCount: number;
    Place: number;
    Score: number;
}

interface GameState {
    score: number;
    emojis: number;
    crops: number;
    clicker: number;
    passive: number[];
    farmUpgrades: number[];
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

interface Event {
    name: string;
    component: string;
    description: string;
}

interface LeaderboardPosition {
    username: string;
    score: number;
}

interface EventResult {
    leaderboard: LeaderboardPosition[];
    place: number;
}

const eventTypes: Map<string, Event> = new Map([
    ["TestEvent",
        {
            name: "TestEvent",
            component: "CookieEventWrapper",
            description: "This is a test event"
        }
    ],
    ["Cookie", 
        {
            name: "Cookie",
            component: "CookieEventWrapper",
            description: "This is a test event"
        }
    ]
]);

export type { ClientMessage, ServerMessage, GameState, Event, EventResult, LeaderboardPosition, EventEndMessage};
export { clientMessageTypes, serverMessageTypes, eventTypes };
