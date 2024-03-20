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
    passiveUpgrades: number[];
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
    ["button",
        {
            name: "Don't Press the Button!",
            component: "ButtonEventWrapper",
            description: "Click the button as late as possible"
        }
    ],
    ["cookie", 
        {
            name: "Cookie",
            component: "CookieEventWrapper",
            description: "Collect as many cookies as you can"
        }
    ],
    ["simonsays", 
        {
            name: "Simon Says",
            component: "SimonEvent",
            description: "Repeat the sequence"
        }
]
]);

export type { ClientMessage, ServerMessage, GameState, Event, EventResult, LeaderboardPosition, EventEndMessage};
export { clientMessageTypes, serverMessageTypes, eventTypes };
