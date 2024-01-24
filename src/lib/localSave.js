import { browser } from "$app/environment";
import { emojis, score, gameMode } from "./store";

export function init() {
    if (browser) {
        let emojisLocal = localStorage.getItem('emojis');
        let scoreLocal = localStorage.getItem('score');
        if (emojisLocal && scoreLocal) {
            emojis.set(JSON.parse(emojisLocal));
            score.set(JSON.parse(scoreLocal));
        }
    }

    // TODO: unscribe when gameMode changes
    const unscribeEmojis = emojis.subscribe(value => {
        if (browser) {
            localStorage.setItem('emojis', JSON.stringify(value));
        }
    });
    const unscribeScore = score.subscribe(value => {
        if (browser) {
            localStorage.setItem('score', JSON.stringify(value));
        }
    });
}