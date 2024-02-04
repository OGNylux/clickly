// all static lookup tables

export interface storeItem {
	index: number;
	name: string;
	description: string;
    component: string;
	image: {
		src: string;
		alt: string;
	};
	incomeMultiplier: number;
    // describes how the storeItem affects the passive income of E or crops per second
	operation: 'linEps' | 'expEps' | 'linCps' | 'expCps';
	initialCost: number;
	valueMultiplier: number;
    // describes the change in the buy/sell value of the emoji (measured in E)
	sell: number;
	cropsCost: number;
	max: number;
}


export const storeItems: storeItem[] = [
   {
        index: 0,
        name: 'nerd face',
        description: '+1 E pro Sekunde',
        component: 'NerdEmoji',
        image: {
            src: 'emojis/nerd.svg',
            alt: 'nerd face',
        },
        incomeMultiplier: 1,
        operation: 'linEps',
        initialCost: 10,
        valueMultiplier: 1.2,
        sell: 5,
        cropsCost: 0,
        max: Infinity,
   },
   {
        index: 1,
        name: 'blushed face',
        description: '+3 E pro Sekunde',
        component: 'BlushedEmoji',
        image: {
            src: 'emojis/blushed.svg',
            alt: 'blushed face',
        },
        incomeMultiplier: 3,
        operation: 'linEps',
        initialCost: 100,
        valueMultiplier: 1.4,
        sell: 50,
        cropsCost: 0,
        max: Infinity,
   },
   {
        index: 2,
        name: 'hot face',
        description: '+6 E pro Sekunde',
        component: 'HotEmoji',
        image: {
            src: 'emojis/hot.svg',
            alt: 'hot face',
        },
        incomeMultiplier: 6,  
        operation: 'linEps',
        initialCost: 300,
        valueMultiplier: 1.5,
        sell: 50,
        cropsCost: 0,
        max: Infinity,
    }
]
