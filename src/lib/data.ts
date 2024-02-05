// all static lookup tables

export interface StoreItem {
	index: number;
	name: string;
	description: string;
    component?: string;
	image: {
		src: string;
		alt: string;
	};
	multiplier: number;
    // The operation takes can perform the scaling of the profit
	operation?: (n: number, m: number) => number;
	initialCost: number;
	costMultiplier: number;
	sell: number;
	cropsCost: number;
	max: number;
}

const clicker: StoreItem = {
    index: 0,
    name: 'Emoji Upgrade',
    description: 'Increses the amount of emojis per click',
    image: {
        src: 'emojis/heart.svg',
        alt: 'clicker emoji',
    },
    multiplier: 1,
    initialCost: 30,
    costMultiplier: 1.2,
    sell: 5,
    cropsCost: 0,
    max: Infinity,
}

const nerd: StoreItem = {
    index: 1,
    component: 'NerdEmoji',
    name: 'Nerd Face',
    description: 'your mother',
    image: {
        src: 'emojis/nerd.svg',
        alt: 'nerd face',
    },
    multiplier: 1,
    initialCost: 10,
    costMultiplier: 1.2,
    sell: 5,
    cropsCost: 0,
    max: Infinity,
}

const blushed: StoreItem = {
    index: 2,
    component: 'BlushedEmoji',
    name: 'blushed face',
    description: 'blushed face',
    image: {
        src: 'emojis/blushed.svg',
        alt: 'blushed face',
    },
    multiplier: 3,
    initialCost: 100,
    costMultiplier: 1.4,
    sell: 50,
    cropsCost: 0,
    max: Infinity,
}

const hot: StoreItem = {
    index: 3,
    component: 'HotEmoji',
    name: 'hot face',
    description: 'hot face',
    image: {
        src: 'emojis/hot.svg',
        alt: 'hot face',
    },
    multiplier: 6,  
    initialCost: 300,
    costMultiplier: 1.5,
    sell: 50,
    cropsCost: 0,
    max: Infinity,
}

/**
 * This array contains the scores needed to level up.
 * The first element is the score needed to reach level 1. 
 * If the player reaches a level that is not in the array it is calculated.
 */
export const levelScores = [2000, 5000, 10000, 50000];

/**
 * This object contains the rewards for each level up.
 * The key is the level and the value is an array of StoreItems that get unlocked at that level.
 * The key t0 is he initial rewards starting items. 
 * Note that you can also skip levels, e.g. level 2 has no rewards, but level 3 and 1 has.
 */
export const levelUpRewards: Record<number, StoreItem[]> = {
    0: [clicker, nerd],
    1: [blushed],
    3: [hot],
}