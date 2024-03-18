import { isClassic, user } from '$lib/store';
import { redirect } from '@sveltejs/kit';



export async function load() {
    isClassic.set(false);
    let localUser = null;
    const unscribe = user.subscribe(value => {
        localUser = value;
    });

    if (!localUser) {
        redirect(302, '/lockscreen');
    }

    unscribe();	

    return {
        props: {
        }
    };
}