import { unlockedClicker, unlockedPassiveItems } from "./store";


interface Item {
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

/**
 * This class is the base class for all items in the shop.
 * It contains the basic properties and methods that are needed for all items.
 * extend this class to create a new item only when you need custom behavior.
 */
abstract class StoreItem {
    // contains the amount of items the player currently has
    protected amount: number = 0;
    // contains the name of the item
    readonly name: string = "";
    // contains the description of the item
    readonly description: string = "";
    // contains the component name of the item that is used for animated emojis
    readonly component?: string;
    // contains the image of the item with alt text and src path
    image: {
        src: string;
        alt: string;
    };
    // contains the initial cost of the item
    initialCost: number;
    // contains the maximum amount the player can have of this item
    readonly max: number;


    constructor(item: Item) {
        this.name = item.name;
        this.description = item.description;
        this.image = item.image;
        this.initialCost = item.initialCost;
        this.max = item.max;
        this.component = item.component;
    }

    abstract nextCost(count: number): number;

    /* When you only want to buy items, you dont need this function.
     * When you want to INFLUENCE the game then override this function.
     * In this function you can calculate the influence on a given value (that is defined sonewhere else)
     * e.g.: Passive income should not be increased by 1 per upgrade, but by 1% of the current income.
     */

    abstract getInfluence(): number;

    addItem(amount: number = 1) {
        if (this.amount + amount > this.max) return; // fix needed
        this.amount = this.amount + amount;
        unlockedPassiveItems.update(this);
    }

    // sell a given amount of items and get half of the cost back
    removeItem(amount: number) {
        if (this.amount - amount < 0) {
            for (let i = amount; i > 0; i--) {
                if (this.amount === 0) {
                    break;
                }
                this.amount = this.amount - 1;
                unlockedPassiveItems.update(this);
            }
        } else {
            this.amount = this.amount - amount;
            unlockedPassiveItems.update(this);
        }
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
            name: "Emoji Upgrade",
            description: "lol",
            image: { src: "emojis/heart.svg", alt: "clicker emoji" },
            initialCost: 30,
            max: Infinity
        });
        this.multiplier = 1;
        this.costMultiplier = 1.2;
    }

    nextCost(count: number) {
        return Math.floor(this.initialCost * Math.pow(this.costMultiplier, this.amount) * count);
    }

    getInfluence(): number {
        return this.amount * this.multiplier;
    }


    addItem(amount: number = 1) {
        this.amount = this.amount + amount;
        unlockedClicker.update(this);
    }

    // sell a given amount of items and get half of the cost back
    removeItem(amount: number) {
        if (this.amount - amount < 0) {
            for (let i = amount; i > 0; i--) {
                if (this.amount === 0) {
                    break;
                }
                this.amount = this.amount - 1;
                unlockedClicker.update(this);
            }
        } else {
            this.amount = this.amount - amount;
            unlockedClicker.update(this);
        }
    }

    setImage(src: string, alt: string) {
        this.image.src = src;
        this.image.alt = alt;
    }
}

class PassiveIncomeItem extends StoreItem {
    incomeMultiplier: number;
    costMultiplier: number;
    component: string;

    constructor(item: Item, incomeMultiplier: number, costMultiplier: number, component: string) {
        super(item);
        this.incomeMultiplier = incomeMultiplier;
        this.costMultiplier = costMultiplier;
        this.component = component;
    }

    getInfluence(): number {
        return this.amount * this.incomeMultiplier;
    }

    nextCost(count: number) {
        return Math.floor(this.initialCost * Math.pow(this.costMultiplier, this.amount) * count);
    }
}

// sollte das nicht passiveicome extenden?
class ExpensivePassiveIncomeItem extends StoreItem {
    costArray: number[];
    incomeArray: number[];

    constructor(item: Item,costArray: number[], incomeArray: number[]) {
        super(item);
        this.costArray = costArray;
        this.incomeArray = incomeArray;
    }

    nextCost(count: number): number {
        if(this.amount + count > this.costArray.length) return Infinity;
        if(this.amount == 0) return this.costArray[0];
        return this.costArray[this.amount + count-1];
    }

    getInfluence(): number {
        console.log(this.amount);
        console.log(this.incomeArray[this.amount]);
        return this.incomeArray[this.amount];
    }

}
let costArray = [300, 500, 1000, 2000, 5000];
let incomeArray = [0, 6, 12, 30, 33, 96];

let expensiveHot = new ExpensivePassiveIncomeItem(
    { name: "expensive hot face", 
    description: "hot face", 
    image: { src: "emojis/hot.svg", 
    alt: "hot face" 
}, initialCost: Infinity, max: costArray.length }, costArray, incomeArray);

// Hier werden die Werte direkt in der Klasse definiert, falls man weiß das Custom verhalten gibt es nur einmal
class EasyExpensivePassiveIncomeItem extends StoreItem {
    costArray: number[] = [300, 500, 1000, 2000, 5000];
    incomeArray: number[] = [0, 6, 12, 30, 33, 96];
    constructor(){
        super({ name: "easy", description: "easy", image: { src: "emojis/hot.svg", alt: "hot face" }, initialCost: 300, max: 5 });
    }

    nextCost(count: number): number {
        if(this.amount + count > this.costArray.length) return Infinity;
        if(this.amount == 0) return this.costArray[0];
        return this.costArray[this.amount + count-1];
    }

    getInfluence(): number {
        console.log(this.amount);
        console.log(this.incomeArray[this.amount]);
        return this.incomeArray[this.amount];
    }
}

let easyHot = new EasyExpensivePassiveIncomeItem();


export { StoreItem, ClickerItem, PassiveIncomeItem };

// Neues Item CHECK
let nerd = new PassiveIncomeItem({ name: "Nerd Face", description: "your mother", image: { src: "emojis/nerd.svg", alt: "nerd face" }, initialCost: 10, max: Infinity }, 1, 1.2, "NerdEmoji");

// GUCKT UNTEN
let blushed = new PassiveIncomeItem({ name: "blushed face", description: "blushed face", image: { src: "emojis/blushed.svg", alt: "blushed face" }, initialCost: 100, max: Infinity }, 3, 1.4, "BlushedEmoji");

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
    0: [nerd, blushed, expensiveHot],
    1: [easyHot],
}
