import { browser } from "$app/environment";
import { emojis, score, isClassic, buildings} from "$lib/store";

/**
 * Load the state from local storage and overwrite the store.
 */
export function loadLocalStorage() {
    if (browser) {
        let emojisLocal = localStorage.getItem('emojis');
        let scoreLocal = localStorage.getItem('score');
        let buildingsLocal = localStorage.getItem('buildings');
        if (emojisLocal && scoreLocal && buildingsLocal) {
            // TODO: add all stores
            emojis.set(JSON.parse(emojisLocal));
            score.set(JSON.parse(scoreLocal));

            // convert string to array and save to buildings store
            const arr = buildingsLocal.slice(1,-1).split(",");
            buildings.reset();
            for (let i = 0; i < arr.length; i++) {
               buildings.increment(Number(arr[i]),i);
            }
        }
    }
}

/**
 * Save the state of the store to local storage or server by subscribing to the store.
 * To switch between local storage and the server, use the isOnline store.
 */
export function save() {
    let classic = false;
    const ununscribeIsOnline = isClassic.subscribe(c => {classic = c});

    // TODO: add all stores
    const unscribeEmojis = emojis.subscribe(value => {
        if (browser && !classic) {
            localStorage.setItem('emojis', JSON.stringify(value));
        }
    });
    const unscribeScore = score.subscribe(value => {
        if (browser && !classic) {
            localStorage.setItem('score', JSON.stringify(value));
        }
    });
    const unscribeBuildings = buildings.subscribe(value => {
        if (browser && !classic) {
            console.log(JSON.stringify(value.toString()));
            localStorage.setItem('buildings', JSON.stringify(value.toString()));
        }
    });
}

/**
 * Reset the gamestate.
 */
export function reset() {
    emojis.reset();
    score.reset();
    buildings.reset();
    if (browser) {
        localStorage.removeItem('emojis');
        localStorage.removeItem('score');
        localStorage.removeItem('buildings');
    }
}