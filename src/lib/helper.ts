import { FarmItem, levelScores, levelUpRewards } from "$lib/data";
import { unlockedClicker, unlockedFarmItems, unlockedPassiveItems, notifications } from "$lib/store";
import { toast } from '@zerodevx/svelte-toast'

export function getLevelupScore(level: number) {
    if (level === 0) return 0;

    if (level <= levelScores.length) {
        return levelScores[level - 1];
    }
    // If the level is higher than predefined, calculate the score
    return levelScores[levelScores.length - 1] * Math.pow(2, level - levelScores.length)
}

export function getLevel(score: number) {
    if (score === 0) return 0;

    let level = 0;
    while (score >= getLevelupScore(level)) {
        level++;
    }
    return level - 1;
}

/**
 * This function resets the unlocked items and unlocks all items up to the given level.
 * Note that this function should only be called when the game is reset or initialized.
 */
export function unlockAllunlockedItems(level: number) {
    unlockedClicker.reset();
    unlockedPassiveItems.reset();

    for (let i = 0; i <= level; i++) {
        if (levelUpRewards[i]) {
            levelUpRewards[i].forEach(item => {
                if (item instanceof FarmItem) {
                    if (!unlockedFarmItems.contains(item)) {
                        unlockedFarmItems.add(item);
                    }
                } else {
                    if (!unlockedPassiveItems.contains(item)) {
                        unlockedPassiveItems.add(item);
                    }
                }
            });
        }
    }
}

/**
 * This function unlocks the items that are unlocked at the given level.
 */
export function unlockLevelUpReward(level: number) {
    if (levelUpRewards[level]) {
        levelUpRewards[level].forEach(item => {
            const unread = true;
            const message = `<div class="flex"> <img src="${item.image.src}" alt="" class="size-8" /> <p class="px-2"> New item unlocked! </p></div>`
            toast.push(message)
            notifications.update(n => [...n, {message:message, unread:unread}])
            if (item instanceof FarmItem) {
                if (!unlockedFarmItems.contains(item)) {
                    unlockedFarmItems.add(item);
                }
            } else {
                if (!unlockedPassiveItems.contains(item)) {
                    unlockedPassiveItems.add(item);
                }
            }
        });
    }
}

export function loadScore() {
    let score = localStorage.getItem('score');
    if (score) {
        return JSON.parse(score);
    }
    return 0;
}