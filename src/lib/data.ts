import { unlockedClicker,unlockedPassiveItems } from "./store";

interface Item {
    amount: number;
    name: string;
    description: string;
    component?: string;
    image: {
        src: string;
        alt: string;
    };
    initialCost: number;
    max: number;
}

/*
 * When do you need a new class?
 * When you need custom behavior for the nextCostFunction or getInfluence function.
 * Like an array that contains the specific cost values for each upgrade.
 */

abstract class StoreItem {
    // contains the amount of items the player has
    protected amount: number = 0;
    // contains the name of the item
    readonly name: string = "";
    // contains the description of the item
    readonly description: string = "";
    // contains the component name of the item that is used for animated emojis
    readonly component?: string;
    // contains the image of the item with alt text and src
    image: {
        src: string;
        alt: string;
    };
    // contains the initial cost of the item
    initialCost: number;
    // contains the maximum amount the player can have of this item
    readonly max: number;
    

    constructor(item: Item) {
        this.amount = item.amount;
        this.name = item.name;
        this.description = item.description;
        this.image = item.image;
        this.initialCost = item.initialCost;
        this.max = item.max;
        this.component = item.component;
    }

    abstract nextCostFunction(count:number): number;

    /* When you only want to buy items, you dont need this function.
     * When you want to INFLUENCE the game then override this function.
     * In this function you can calculate the influence on a given value (that is defined sonewhere else)
     * e.g.: Passive income should not be increased by 1 per upgrade, but by 1% of the current income.
     */

    abstract getInfluence(): number;

    buy(amount: number = 1) {
        this.amount = this.amount + amount;
        unlockedPassiveItems.update(this);
    }

    sell(amount: number = 1) {
        this.amount = this.amount - amount;
    }

    getAmount() {
        return this.amount;
    }
}

class ClickerItem extends StoreItem {
    multiplier: number;
    costMultiplier: number;

    constructor() {
        super({
            amount: 0,
            name: "Emoji Upgrade",
            description: "lol",
            image: { src: "emojis/heart.svg", alt: "clicker emoji" },
            initialCost: 30,
            max: Infinity
        });
        this.multiplier = 1;
        this.costMultiplier = 1.2;
    }

    nextCostFunction(count:number): number {
        if (count <=0) return 0;
        if(this.amount == 0) return this.initialCost;
        return Math.round(this.initialCost + ((this.amount+count) * this.costMultiplier? this.costMultiplier : 1));
    }


    getInfluence(): number {
        return this.amount * this.multiplier;
    }

    buy() {
        this.amount++;
        unlockedClicker.update(this);
    }

    setImage(src: string, alt: string) {
        this.image.src = src;
        this.image.alt = alt;
    }
}

export {StoreItem, ClickerItem};

// const clicker: StoreItem = {
//     index: 0,
//     name: 'Emoji Upgrade',
//     description: 'Increses the amount of emojis per click',
//     image: {
//         src: 'emojis/heart.svg',
//         alt: 'clicker emoji',
//     },
//     incomeMultiplier: 1,
//     initialCost: 30,
//     valueMultiplier: 1.2,
//     sell: 5,
//     cropsCost: 0,
//     max: Infinity,
// }

// const nerd: StoreItem = {
//     index: 1,
//     component: 'NerdEmoji',
//     name: 'Nerd Face',
//     description: 'your mother',
//     image: {
//         src: 'emojis/nerd.svg',
//         alt: 'nerd face',
//     },
//     incomeMultiplier: 1,
//     initialCost: 10,
//     valueMultiplier: 1.2,
//     sell: 5,
//     cropsCost: 0,
//     max: Infinity,
// }

// const blushed: StoreItem = {
//     index: 2,
//     component: 'BlushedEmoji',
//     name: 'blushed face',
//     description: 'blushed face',
//     image: {
//         src: 'emojis/blushed.svg',
//         alt: 'blushed face',
//     },
//     incomeMultiplier: 3,
//     initialCost: 100,
//     valueMultiplier: 1.4,
//     sell: 50,
//     cropsCost: 0,
//     max: Infinity,
// }

// const hot: StoreItem = {
//     index: 3,
//     component: 'HotEmoji',
//     name: 'hot face',
//     description: 'hot face',
//     image: {
//         src: 'emojis/hot.svg',
//         alt: 'hot face',
//     },
//     incomeMultiplier: 6,
//     initialCost: 300,
//     valueMultiplier: 1.5,
//     sell: 50,
//     cropsCost: 0,
//     max: Infinity,
// }

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
    0: [],
}
