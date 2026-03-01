import { writable } from 'svelte/store';
import { account } from '$lib/appwrite';
import { ID, type Models } from 'appwrite';

export const user = writable<Models.User<Models.Preferences> | null>(null);
export const isLoading = writable(true);

export async function loadUser() {
    try {
        const session = await account.get();
        user.set(session);
    } catch {
        user.set(null);
    } finally {
        isLoading.set(false);
    }
}

export async function login(email: string, password: string) {
    await account.createEmailPasswordSession(email, password);
    const session = await account.get();
    user.set(session);
}

export async function logout() {
    await account.deleteSession('current');
    user.set(null);
}

export async function sendMagicLink(email: string) {
    const redirectUrl = `${window.location.origin}/login/verify`;
    await account.createMagicURLToken(ID.unique(), email, redirectUrl);
}

export async function verifyMagicLink(userId: string, secret: string) {
    await account.updateMagicURLSession(userId, secret);
    await loadUser();
}
