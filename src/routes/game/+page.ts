import { isClassic } from '$lib/store.js';

export async function load() {
    isClassic.set(true);

    return {
        props: {
        }
    };
}