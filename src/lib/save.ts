import { browser } from "$app/environment";
import { emojis, score, isClassic, unlockedClicker, unlockedPassiveItems, unlockedFarmItems, crops, farmUpgrades, isSoundOn} from "$lib/store";
import { FarmItem, StoreItem } from "./data";
import { unlockAllunlockedItems } from "./helper";

/**
 * Load the state from local storage and overwrite the store.
 */
export function loadLocalStorage() {
    if (browser) {
        let isSoundOnLocal = localStorage.getItem('isSoundOn');
        let emojisLocal = localStorage.getItem('emojis');
        let scoreLocal = localStorage.getItem('score');
        let cropsLocal = localStorage.getItem('crops');
        let passiveLocal = localStorage.getItem('passive');
        let upgradeLocal = localStorage.getItem('upgrade');
        let clickerLocal = localStorage.getItem('clicker');
        let farmLocal = localStorage.getItem('farm');
        let farmUpgradesLocal = localStorage.getItem('farmUpgrades');

        if (isSoundOnLocal && emojisLocal && scoreLocal && cropsLocal && passiveLocal && upgradeLocal && clickerLocal && farmLocal && farmUpgradesLocal) {
            isSoundOn.set(JSON.parse(isSoundOnLocal));
            emojis.set(JSON.parse(emojisLocal));
            score.set(JSON.parse(scoreLocal));
            crops.set(JSON.parse(cropsLocal));

            const clicker = unlockedClicker.get();
            clicker.addItem(Number(clickerLocal));
            unlockedClicker.update(clicker)

            const arr2 = upgradeLocal.slice(1,-1).split(",");
            const arr = passiveLocal.slice(1,-1).split(",");
            unlockedPassiveItems.get().forEach((item: StoreItem, index: number) => {
                item.addItem(Number(arr[index]));
                item.addUpgrade(Number(arr2[index]));
                unlockedPassiveItems.update(item);
            });
            
            const farmArr = farmLocal.slice(1,-1).split(",");
            unlockedFarmItems.get().forEach((item: FarmItem, index: number) => {
                item.setAmount(Number(farmArr[index]));
                unlockedFarmItems.update(item);
            });

            const farmUpgradesArr = farmUpgradesLocal.slice(1,-1).split(",");
            farmUpgrades.get().forEach((item, index) => {
                item.addItem(Number(farmUpgradesArr[index]));
                farmUpgrades.update(item);
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

    isSoundOn.subscribe(value => {
        if (browser && classic) {
            localStorage.setItem('isSoundOn', JSON.stringify(value));
        }
    });

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
    unlockedClicker.subscribe(value => {
        if (browser && classic) {
            localStorage.setItem('clicker', JSON.stringify(value.getAmount()));
        }
    });
    unlockedPassiveItems.subscribe(value => {
        if (browser && classic) {
            let arr: number[] = [];
            let arr2: number[] = [];
            value.forEach(item => {
                arr.push(item.getAmount());
                arr2.push(item.getUpgradeAmount());
            });
            localStorage.setItem('passive', JSON.stringify(arr));
            localStorage.setItem('upgrade', JSON.stringify(arr2));
        }
    });
    unlockedFarmItems.subscribe(value => {
        if (browser && classic) {
            let arr: number[] = [];
            value.forEach(item => {
                arr.push(item.getAmount());
            });
            localStorage.setItem('farm', JSON.stringify(arr));
        }
    });
    farmUpgrades.subscribe(value => {
        if (browser && classic) {
            let arr: number[] = [];
            value.forEach(item => {
                arr.push(item.getAmount());
            });
            localStorage.setItem('farmUpgrades', JSON.stringify(arr));
        }
    });
}

/**
 * Reset the gamestate.
 */
export function reset() {
    isSoundOn.set(true);
    emojis.reset();
    score.reset();
    unlockedClicker.reset();
    unlockedPassiveItems.reset();
    unlockedFarmItems.reset();
    farmUpgrades.reset();
    unlockAllunlockedItems(0);
    if (browser) {
        localStorage.removeItem('isSoundOn');
        localStorage.removeItem('emojis');
        localStorage.removeItem('score');
        localStorage.removeItem('crops');
        localStorage.removeItem('passive');
        localStorage.removeItem('clicker');
        localStorage.removeItem('farm');
        localStorage.removeItem('farmUpgrades');
    }
}