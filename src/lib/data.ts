import { farmUpgrades, unlockedClicker, unlockedFarmItems, unlockedPassiveItems } from "./store";


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
    // contains the amount of upgrades of a building the player currently has
    protected upgradeAmount: number = 0;
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
    nextUpgradeCost() {
        return 0
    };
    abstract nextSell(count: number): number;
    /**
     * This function returns the influence of the item.
     * The influence is the value that the item has on the game.
     * e.g. the clicker item has an influence of 1, because it increases the amount of emojis per click by 1.
     */
    abstract getInfluence(): number;

    addItem(amount: number = 1) {
        if (this.amount + amount > this.max) return; // fix needed
        this.amount = this.amount + amount;
        unlockedPassiveItems.update(this);
    }

    /**
     * Remove (sell) a given amount of items
     * If you want to remove more items than there are left, the function will not remove any items
     */
    removeItem(amount: number) {
        if (this.amount - amount < 0) {
            this.amount = 0;
        } else {
            this.amount = this.amount - amount;
        }
        unlockedPassiveItems.update(this);
    }

    getAmount() {
        return this.amount;
    }

    checkAddAmount(count: number) {
        return this.amount + count <= this.max;
    }

    checkRemoveAmount(count: number) {
        return this.amount - count >= 0;
    }

    addUpgrade(amount: number = 1) {
        this.upgradeAmount = this.upgradeAmount + amount;
        unlockedPassiveItems.update(this);
    }
    
    getUpgradeAmount() {
        return this.upgradeAmount;
    }
}

class ClickerItem extends StoreItem {
    multiplier: number;
    costMultiplier: number;
    upgradeAmount: number = 0;
    initialUpgradeCost: number;
    upgradeCostMultiplier: number;

    constructor() {
        super({
            name: "Emoji Upgrade",
            description: "Increses the amount of emojis per click",
            image: { src: "emojis/heart.svg", alt: "clicker emoji" },
            initialCost: 30,
            max: Infinity
        });
        this.multiplier = 1;
        this.costMultiplier = 1.2;
        this.initialUpgradeCost = 30;
        this.upgradeCostMultiplier = 1.2;
    }

    nextCost(count: number) {
        if (this.amount == 0 && count == 1) return this.initialCost;
        if (count == 1) return Math.floor(this.initialCost * this.costMultiplier ** (this.amount + count - 1));
        let tmp = 0;
        for (let i = 0; i < count; i++) {
            tmp += Math.floor(this.initialCost * this.costMultiplier ** (this.amount + i));
        }
        return tmp;
    }

    nextUpgradeCost() {
        if (this.upgradeAmount == 0) return this.initialUpgradeCost;
        return Math.floor(this.initialUpgradeCost * this.upgradeCostMultiplier ** this.upgradeAmount);
    }

    nextSell(count: number): number {
        let tmp = 0;
        for (let i = 0; i < count; i++) {
            if (this.amount - i <= 0) break;
            tmp += Math.floor((this.initialCost * this.costMultiplier ** (this.amount - i))*0.3);
        }
        return tmp;
    }

    getInfluence(): number {
        return this.amount * this.multiplier * (2 ** this.upgradeAmount);
    }

    addItem(amount: number = 1) {
        this.amount = this.amount + amount;
        unlockedClicker.update(this);
    }

    // sell a given amount of items
    removeItem(amount: number) {
        if (this.amount - amount < 0) {
            this.amount = 0;
        } else {
            this.amount = this.amount - amount;
        }
        unlockedClicker.update(this);
    }

    addUpgrade(amount: number = 1) {
        this.upgradeAmount = this.upgradeAmount + amount;
        unlockedClicker.update(this);
    }

    setImage(src: string, alt: string) {
        this.image.src = src;
        this.image.alt = alt;
    }
}

class PassiveIncomeItem extends StoreItem {
    incomeMultiplier: number;
    costMultiplier: number;
    upgradeAmount: number = 0;
    initialUpgradeCost: number;
    upgradeCostMultiplier: number;
    component: string;

    constructor(item: Item, incomeMultiplier: number, costMultiplier: number, initialUpgradeCost: number, upgradeCostMultiplier: number, component: string) {
        super(item);
        this.incomeMultiplier = incomeMultiplier;
        this.costMultiplier = costMultiplier;
        this.initialUpgradeCost = initialUpgradeCost;
        this.upgradeCostMultiplier = upgradeCostMultiplier;
        this.component = component;
    }

    getInfluence(): number {
        return this.amount * this.incomeMultiplier * (2 ** this.upgradeAmount);
    }

    nextCost(count: number) {
        if (this.amount == 0 && count == 1) return this.initialCost;
        if (count == 1) return Math.floor(this.initialCost * this.costMultiplier ** (this.amount + count - 1));
        let tmp = 0;
        for (let i = 0; i < count; i++) {
            tmp += Math.floor(this.initialCost * this.costMultiplier ** (this.amount + i));
        }
        return tmp;
    }

    nextUpgradeCost() {
        if (this.upgradeAmount == 0) return this.initialUpgradeCost;
        return Math.floor(this.initialUpgradeCost * this.upgradeCostMultiplier ** this.upgradeAmount);
    }

    nextSell(count: number): number {
        let tmp = 0;
        for (let i = 0; i < count; i++) {
            if (this.amount - i <= 0) break;
            tmp += Math.floor((this.initialCost * this.costMultiplier ** (this.amount - i))*0.3);
        }
        return tmp;
    }
}

class ExpensivePassiveIncomeItem extends StoreItem {
    costArray: number[];
    incomeArray: number[];

    constructor(item: Item, costArray: number[], incomeArray: number[]) {
        super(item);
        this.costArray = costArray;
        this.incomeArray = incomeArray;
    }

    nextCost(count: number): number {
        if (this.amount + count > this.costArray.length) return Infinity;
        if (this.amount == 0) return this.costArray[0];
        return this.costArray[this.amount + count - 1];
    }
    nextUpgradeCost() {
        return 2
    }
    nextSell(count: number): number {
        return this.costArray[this.amount - count];
    }
    

    getInfluence(): number {
        return this.incomeArray[this.amount];
    }

}

// values are directly defined in the class here
class EasyExpensivePassiveIncomeItem extends StoreItem {
    costArray: number[] = [300, 500, 1000, 2000, 5000];
    incomeArray: number[] = [0, 6, 12, 30, 33, 96];
    constructor() {
        super({ name: "easy", description: "easy", image: { src: "emojis/hot.svg", alt: "hot face" }, initialCost: 300, max: 5, component: "HotEmoji"});
    }

    nextCost(count: number): number {
        if (this.amount + count > this.costArray.length) return Infinity;
        if (this.amount == 0) return this.costArray[0];
        return this.costArray[this.amount + count - 1];
    }
    
    nextUpgradeCost() {
        return 2
    }

    nextSell(count: number): number {
        return this.costArray[this.amount - count];
    }

    getInfluence(): number {
        return this.incomeArray[this.amount];
    }
}

class FarmItem {
    protected amount: number = 1;
    protected planted: number = 0;
    readonly name: string;
    readonly description: string;
    readonly value: number;
    // how long it takes the FarmItem to grow in ms
    growthTime: number;
    image: {
        src: string;
        alt: string;
    };

    constructor(name: string, description: string, value: number, growthTime: number, image: { src: string, alt: string }) {
        this.name = name;
        this.description = description;
        this.value = value;
        this.growthTime = growthTime;
        this.image = image;
    }

    plant() {
        if (this.planted + 1 > this.amount) return;

        this.planted += 1;
        unlockedFarmItems.update(this);
    }

    harvest() {
        if (this.planted - 1 < 0) return;

        this.planted -= 1;
        unlockedFarmItems.update(this);
    }

    getAvailable() {
        return this.amount - this.planted;
    }

    getAmount() {
        return this.amount;
    }

    setAmount(amount: number) {
        this.amount = amount;
        unlockedFarmItems.update(this);
    }
}

class FarmUpgrade extends StoreItem {
    costMultiplier: number;
    growthTimeMultiplier?: number;

    constructor(item: Item, costMultiplier: number, growthTimeMultiplier?: number) {
        super(item);
        this.costMultiplier = costMultiplier;
        this.growthTimeMultiplier = growthTimeMultiplier;
    }

    nextCost(count: number) {
        if (this.amount == 0 && count == 1) return this.initialCost;
        if (count == 1) return Math.floor(this.initialCost * this.costMultiplier ** (this.amount + count - 1));
        let tmp = 0;
        for (let i = 0; i < count; i++) {
            tmp += Math.floor(this.initialCost * this.costMultiplier ** (this.amount + i));
        }
        return tmp;
    }

    nextSell(count: number): number {
        let tmp = 0;
        for (let i = 0; i < count; i++) {
            if (this.amount - i <= 0) break;
            tmp += Math.floor((this.initialCost * this.costMultiplier ** (this.amount - i))*0.3);
        }
        return tmp;
    }

    addItem(amount: number = 1) {
        if (this.amount + amount > this.max) return; // fix needed
        this.amount = this.amount + amount;
        farmUpgrades.update(this);
    }

    getInfluence(): number {
        if (!this.growthTimeMultiplier) return 0;

        return this.amount * this.growthTimeMultiplier;
    }
}

/**
 * StoreItem Definitions
 */
let nerd = new PassiveIncomeItem({
    name: "Nerd Face",
    description: "your mother",
    image: { src: "emojis/nerd.svg", alt: "nerd face" },
    initialCost: 10,
    max: Infinity
}, 1, 1.2, 10, 1.4, "NerdEmoji");

let blushed = new PassiveIncomeItem({
    name: "Blushed Face",
    description: "Blushed Face",
    image: { src: "emojis/blushed.svg", alt: "blushed face" },
    initialCost: 50,
    max: Infinity
}, 3, 1.2, 15, 1.1, "BlushedEmoji");

let money = new PassiveIncomeItem({
    name: "Money Face",
    description: "Money Face",
    image: { src: "emojis/money.svg", alt: "money face" },
    initialCost: 250,
    max: Infinity
}, 5, 1.2, 20, 1.1, "MoneyEmoji");

let cowboy = new PassiveIncomeItem({
    name: "Cowboy",
    description: "Cowboy",
    image: { src: "emojis/cowboy.svg", alt: "cowboy" },
    initialCost: 500,
    max: Infinity
}, 10, 1.3, 30, 1.2, "CowboyEmoji");

let hot = new PassiveIncomeItem({
    name: "Hot Face",
    description: "Hot Face",
    image: { src: "emojis/hot.svg", alt: "hot face" },
    initialCost: 1500,
    max: Infinity
}, 20, 1.3, 50, 1.2, "HotEmoji");

let cold = new PassiveIncomeItem({
    name: "Cold Face",
    description: "Cold Face",
    image: { src: "emojis/cold.svg", alt: "cold face" },
    initialCost: 5000,
    max: Infinity
}, 50, 1.3, 100, 1.2, "ColdEmoji");

let weary = new PassiveIncomeItem({
    name: "Weary Face",
    description: "Weary Face",
    image: { src: "emojis/weary.svg", alt: "weary face" },
    initialCost: 7500,
    max: Infinity
}, 75, 1.4, 250, 1.3, "WearyEmoji");

let clown = new PassiveIncomeItem({
    name: "Clown Face",
    description: "Clown Face",
    image: { src: "emojis/clown.svg", alt: "clown face" },
    initialCost: 15000,
    max: Infinity
}, 120, 1.4, 500, 1.3, "ClownEmoji");

let cool = new PassiveIncomeItem({
    name: "Cool Face",
    description: "Cool Face",
    image: { src: "emojis/cool.svg", alt: "cool face" },
    initialCost: 25000,
    max: Infinity
}, 200, 1.4, 1000, 1.4, "CoolEmoji");

let byebye = new PassiveIncomeItem({
    name: "Bye Bye Face",
    description: "Bye Bye Face",
    image: { src: "emojis/byebye.svg", alt: "bye bye face" },
    initialCost: 40000,
    max: Infinity
}, 300, 1.4, 2000, 1.4, "ByeByeEmoji");

let stonks = new PassiveIncomeItem({
    name: "Stonks Emoji",
    description: "Stonks",
    image: { src: "emojis/stonks.svg", alt: "stonks emoji" },
    initialCost: 100000,
    max: Infinity
}, 500, 1.4, 5000, 1.4, "StonksEmoji");

let hole = new PassiveIncomeItem({
    name: "Hole Emoji",
    description: "Hole Emoji",
    image: { src: "emojis/hole.svg", alt: "hole emoji" },
    initialCost: 200000,
    max: Infinity
}, 1000, 1.4, 10000, 1.4, "HoleEmoji");

let easyHot = new EasyExpensivePassiveIncomeItem();

let costArray = [300, 500, 1000, 2000, 5000];
let incomeArray = [0, 6, 12, 30, 33, 96];
let expensiveHot = new ExpensivePassiveIncomeItem(
    {
        name: "expensive hot face",
        description: "hot face",
        image: {
            src: "emojis/hot.svg",
            alt: "hot face"
        }, initialCost: Infinity, max: costArray.length
    }, costArray, incomeArray);


/**
 * Farm Definitions
 */
let strawberry = new FarmItem("Strawberry", "A juicy strawberry", 1, 5000, { src: "/farm/strawberry.svg", alt: "strawberry" });
let potato = new FarmItem("Potato", "A juicy potato", 2, 8000, { src: "/farm/potato.svg", alt: "potato" });
let banana = new FarmItem("Banana", "A juicy banana", 3, 10000, { src: "/farm/banana.svg", alt: "banana" });
let eggplant = new FarmItem("Eggplant", "A juicy eggplant", 4, 10000, { src: "/farm/eggplant.svg", alt: "eggplant" });
let peach = new FarmItem("Peach", "A juicy peach", 4, 10000, { src: "/farm/peach.svg", alt: "peach" });
let peanut = new FarmItem("Peanut", "A juicy peanut", 5, 12000, { src: "/farm/peanut.svg", alt: "peanut" });

let burger = new FarmItem("Burger", "A juicy burger", 10, 15000, { src: "/farm/burger.svg", alt: "burger" });
let candy = new FarmItem("Candy", "A juicy candy", 20, 20000, { src: "/farm/candy.svg", alt: "candy" });

const initialFarmUpgrades = () => {
    return [ new FarmUpgrade({
        name: "House Upgrade",
        description: "Increases the number of fields you can have at once. ",
        image: { src: "emojis/house.svg", alt: "house" },
        initialCost: 5000,
        max: 7
    }, 2),
    new FarmUpgrade({
        name: "Tractor Upgrade",
        description: "Increases the speed at which your crops grow.",
        image: { src: "emojis/tractor.svg", alt: "tractor" },
        initialCost: 10000,
        max: 9 // max 90% speed increase
    }, 2, 0.1)
]};

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
export const levelUpRewards: Record<number, Array<StoreItem | FarmItem>> = {
    0: [nerd],
    1: [strawberry, blushed],
    2: [peach, money, cowboy],
    4: [potato, hot, cold],
    5: [banana, weary],
    6: [eggplant, clown, cool],
    7: [peanut, byebye],
    8: [burger, stonks],
    9: [candy, hole]
}

export { StoreItem, ClickerItem, PassiveIncomeItem, EasyExpensivePassiveIncomeItem, FarmItem, FarmUpgrade, initialFarmUpgrades };