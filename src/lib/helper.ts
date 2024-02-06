import { levelScores, levelUpRewards } from "$lib/data";
import { unlocked } from "$lib/store";

export function formatNumber(num: number) {
    return num.toLocaleString('de-DE');
}

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

export function unlockAllUnlockedItems(level: number) {
    unlocked.reset();
    for (let i = 0; i <= level; i++) {
        if (levelUpRewards[i]) {
            levelUpRewards[i].forEach(item => {
                unlocked.add(item);
            });
        }
    }
}

export function unlockLevelUpReward(level: number) {
    if (levelUpRewards[level]) {
        levelUpRewards[level].forEach(item => {
            if (!unlocked.contains(item)) {
                unlocked.add(item);
            }
        });
    }
}