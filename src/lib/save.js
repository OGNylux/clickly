import { browser } from "$app/environment";
import { emojis, score, isOnline} from "./store";

/**
 * Load the store state from local storage
 * @returns {void}
 */
export function loadLocalStorage() {
    if (browser) {
        let emojisLocal = localStorage.getItem('emojis');
        let scoreLocal = localStorage.getItem('score');
        if (emojisLocal && scoreLocal) {
            // TODO: add all stores
            emojis.set(JSON.parse(emojisLocal));
            score.set(JSON.parse(scoreLocal));
        }
    }
}

/**
 * Save the state of the store to local storage or server by subscribing to the store.
 * To switch between local storage and the server, use the isOnline store.
 * @returns {void}
 */
export function save() {
    let online = false;
    const ununscribeIsOnline = isOnline.subscribe(o => {online = o, console.log(o);});

    // TODO: add all stores
    const unscribeEmojis = emojis.subscribe(value => {
        if (browser && !online) {
            console.log(online);
            localStorage.setItem('emojis', JSON.stringify(value));
        }
    });
    const unscribeScore = score.subscribe(value => {
        if (browser && !online) {
            localStorage.setItem('score', JSON.stringify(value));
        }
    });
}