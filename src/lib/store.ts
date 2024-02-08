import { writable,get } from "svelte/store";
import { ClickerItem, StoreItem } from "$lib/data";


// enable server communication and certain features
export const isClassic = writable(true);


function clickerStoreFunc() {
    const store = writable(new ClickerItem());
    const { subscribe, set, update } = store;
    return {
        subscribe,
        update: (item: ClickerItem) => update(n =>item),
        get: () => get(store),
        reset: () => set(new ClickerItem()),
    };
}
export const unlockedClicker = clickerStoreFunc();

function passiveStoreItems() {
    const store = writable<StoreItem[]>([]);
    const { subscribe, set, update } = store;
    return {
        subscribe,
        update: (item: StoreItem) => update(n => n.filter(x => x.name == item.name)),
        get: () => get(store),
        reset: () => set([]),
    };
}
export const unlockedPassiveItems = passiveStoreItems();

function cropStore() {
    const { subscribe, set, update } = writable(0);
    return {
        subscribe,
        increment: (incrementValue: number) => update(n => n + incrementValue),
        decrement: (decrementValue: number) => update(n => n - decrementValue),
        set: (value: number) => set(value),
        reset: () => set(0)
    };
}

export const crops = cropStore();

function emojiStore () {
    const { subscribe, set, update } = writable(0);
    return {
        subscribe,
        increment: (incrementValue: number) => update(n => n + incrementValue),
        decrement: (decrementValue: number) => update(n => n - decrementValue),
        set: (value: number) => set(value),
        reset: () => set(0)
    };
}

export const emojis = emojiStore();

function scoreStore() {
    const { subscribe, set, update } = writable(0);
    return {
        subscribe,
        increment: (incrementValue: number) => update(n => n + incrementValue),
        decrement: (decrementValue: number) => update(n => n - decrementValue),
        set: (value: number) => set(value),
        reset: () => set(0)
    };
}

export const score = scoreStore(); 

