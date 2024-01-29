import { browser } from "$app/environment";
import { emojis, score, isClassic} from "./store";

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
    let classic = false;
    const ununscribeIsOnline = isClassic.subscribe(c => {classic = c, console.log(c);});

    // TODO: add all stores
    const unscribeEmojis = emojis.subscribe(value => {
        if (browser && !classic) {
            console.log(classic);
            localStorage.setItem('emojis', JSON.stringify(value));
        }
    });
    const unscribeScore = score.subscribe(value => {
        if (browser && !classic) {
            localStorage.setItem('score', JSON.stringify(value));
        }
    });
}