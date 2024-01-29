import { isOnline } from '$lib/store.js';

export function load({ fetch }) {
    if (isOnline) {
       // TODO: set store to server data
    }
}