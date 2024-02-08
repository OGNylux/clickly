import { writable,get } from "svelte/store";
import StoreItem  from "$lib/data";

// enable server communication and certain features
export const isClassic = writable(true);


function unlockedClickerClickerStore() {
    const store = writable<StoreItem[]>([]);
    const { subscribe, set, update } = store;
    return {
        subscribe,
        add: (item: StoreItem) => update(n => [...n, item]),
        contains: (item: StoreItem) => get(store).includes(item),
        update: (item: StoreItem) => update(n => n.filter(x => x.name == item.name )),
        get: (index:number) => get(store)[index],
        reset: () => set([]),
    };
}

export const unlockedClicker = unlockedClickerClickerStore();

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

