import { isClassic, user } from '$lib/store';
import { redirect } from '@sveltejs/kit';



export async function load() {
    console.log('user', user);
    isClassic.set(false);
    console.log(isClassic);
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