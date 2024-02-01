// all static lookup tables

export interface storeItem {
	index: number;
	name: string;
	description: string;
    component?: string;
	image: {
		src: string;
		alt: string;
	};
	multiplier: number;
    // describes how the storeItem affects the emojis per second or crops per second (linear and exponential)
	operation: 'linEps' | 'expEps' | 'linCps' | 'expCps';
	initialCost: number;
	costMultiplier: number;
	sell: number;
	cropsCost: number;
	max: number;
}


export const storeItems: storeItem[] = [
    {
        index: 0,
        name: 'Emoji Upgrade',
        description: 'Increses the amount of emojis per click',
        image: {
            src: 'emojis/heart.svg',
            alt: 'clicker emoji',
        },
        multiplier: 1,
        operation: 'linEps',
        initialCost: 30,
        costMultiplier: 1.2,
        sell: 5,
        cropsCost: 0,
        max: Infinity,
   },
   {
        index: 1,
        name: 'Nerd Face',
        description: 'nerd face',
        component: 'NerdEmoji',
        image: {
            src: 'emojis/nerd.svg',
            alt: 'nerd face',
        },
        multiplier: 1,
        operation: 'linEps',
        initialCost: 50,
        costMultiplier: 1.2,
        sell: 5,
        cropsCost: 0,
        max: Infinity,
   },
   {
        index: 2,
        name: 'Blushed Face',
        description: 'blushed face',
        component: 'BlushedEmoji',
        image: {
            src: 'emojis/blushed.svg',
            alt: 'blushed face',
        },
        multiplier: 3,
        operation: 'linEps',
        initialCost: 150,
        costMultiplier: 1.4,
        sell: 50,
        cropsCost: 0,
        max: Infinity,
   },
   {
        index: 3,
        name: 'Hot Face',
        description: 'hot face',
        component: 'HotEmoji',
        image: {
            src: 'emojis/hot.svg',
            alt: 'hot face',
        },
        multiplier: 6,  
        operation: 'linEps',
        initialCost: 350,
        costMultiplier: 1.5,
        sell: 50,
        cropsCost: 0,
        max: Infinity,
    }
]
