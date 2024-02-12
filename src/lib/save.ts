import { browser } from "$app/environment";
import { emojis, score, isClassic, unlockedClicker, unlockedPassiveItems, unlockedFarmItems, crops} from "$lib/store";
import { StoreItem } from "./data";
import { unlockAllunlockedItems } from "./helper";

/**
 * Load the state from local storage and overwrite the store.
 */
export function loadLocalStorage() {
    if (browser) {
        let emojisLocal = localStorage.getItem('emojis');
        let scoreLocal = localStorage.getItem('score');
        let cropsLocal = localStorage.getItem('crops');
        let passiveLocal = localStorage.getItem('passive');
        let clickerLocal = localStorage.getItem('clicker');

        if (emojisLocal && scoreLocal && cropsLocal && passiveLocal && clickerLocal) {
            emojis.set(JSON.parse(emojisLocal));
            score.set(JSON.parse(scoreLocal));
            crops.set(JSON.parse(cropsLocal));

            const clicker = unlockedClicker.get();
            clicker.setAmount(Number(clickerLocal));
            unlockedClicker.update(clicker)

            const arr = passiveLocal.slice(1,-1).split(",");
            unlockedPassiveItems.get().forEach((item: StoreItem, index: number) => {
                item.setAmount(Number(arr[index]));
                unlockedPassiveItems.update(item);
            });
        }
    }
}

/**
 * Save the state of the store to local storage or server by subscribing to the store.
 * To switch between local storage and the server, use the isClassic store.
 */
export function save() {
    let classic = true;
    const ununscribeIsOnline = isClassic.subscribe(c => {classic = c});

    emojis.subscribe(value => {
        if (browser && classic) {
            localStorage.setItem('emojis', JSON.stringify(value));
        }
    });
    score.subscribe(value => {
        if (browser && classic) {
            localStorage.setItem('score', JSON.stringify(value));
        }
    });
    crops.subscribe(value => {
        if (browser && classic) {
            localStorage.setItem('crops', JSON.stringify(value));
        }
    });
    unlockedPassiveItems.subscribe(value => {
        if (browser && classic) {
            let arr: number[] = [];
            value.forEach(item => {
                arr.push(item.getAmount());
            });
            localStorage.setItem('passive', JSON.stringify(arr));
        }
    });
    unlockedClicker.subscribe(value => {
        if (browser && classic) {
            localStorage.setItem('clicker', JSON.stringify(value.getAmount()));
        }
    });
}

/**
 * Reset the gamestate.
 */
export function reset() {
    emojis.reset();
    score.reset();
    unlockedClicker.reset();
    unlockedPassiveItems.reset();
    unlockedFarmItems.reset();
    unlockAllunlockedItems(0);
    if (browser) {
        localStorage.removeItem('emojis');
        localStorage.removeItem('score');
        localStorage.removeItem('crops');
        localStorage.removeItem('passive');
        localStorage.removeItem('clicker');
    }
}