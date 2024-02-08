import { writable } from "svelte/store";
import type { StoreItem } from "$lib/data";

// enable server communication and certain features
export const isClassic = writable(true);

// no magic numbers pls 👉👈
// maybe dinamically calculate this based on the data.ts file?
const numberOfBuildings = 8;

function unlockedStore() {
    const { subscribe, set, update } = writable<StoreItem[]>([]);
    return {
        subscribe,
        add: (item: StoreItem) => update(n => [...n, item]),
        remove: (item: StoreItem) => update(n => n.filter(i => i !== item)),
        contains: (item: StoreItem) => subscribe(n => n.includes(item)),
        reset: () => set([]),
    };
}

export const unlocked = unlockedStore();

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

function buildingStore() {
    const { subscribe, set, update } = writable<number[]>(Array(numberOfBuildings).fill(0));
    return {
        subscribe,
        increment: (incrementValue: number, index: number) => update(n => { n[index] += incrementValue; return n }),
        decrement: (decrementValue: number, index: number) => update(n => { n[index] -= decrementValue; return n }),
        set: (arr: number[]) => set(arr),
        reset: () => set(Array(8).fill(0))
    };
}

export const buildings = buildingStore();

function buildingMultiplierStore() {
    const { subscribe, set, update } = writable<number[]>(Array(numberOfBuildings).fill(0));
    return {
        subscribe,
        increment: (incrementValue: number, index: number) => update(n => { n[index] += incrementValue; return n }),
        decrement: (decrementValue: number, index: number) => update(n => { n[index] -= decrementValue; return n }),
        set: (arr: number[]) => set(arr),
        reset: () => set(Array(8).fill(0))
    };
}

export const buildingMultipliers = buildingMultiplierStore();

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

