import { writable } from "svelte/store";

// enable server communication and certain features
export const isClassic = writable(true);

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
    const { subscribe, set, update } = writable<number[]>(Array(8).fill(0));
    return {
        subscribe,
        increment: (incrementValue: number, index: number) => update(n => { n[index] += incrementValue; return n }),
        decrement: (decrementValue: number, index: number) => update(n => { n[index] -= decrementValue; return n }),
        set: (arr: number[]) => set(arr),
        reset: () => set(Array(8).fill(0))
    };
}

export const buildings = buildingStore();

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

