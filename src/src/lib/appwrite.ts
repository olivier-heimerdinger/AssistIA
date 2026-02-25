import { browser } from '$app/environment';
import { Client, Account, Databases } from 'appwrite';

// On the browser: use the browser's own origin so requests go through
// the Vite/Traefik proxy at /appwrite → http://appwrite (Docker service).
// On the server (SSR/Node.js): call the Appwrite Docker service directly.
const APPWRITE_ENDPOINT = browser
    ? `${window.location.origin}/appwrite/v1`
    : 'http://appwrite/v1';

const APPWRITE_PROJECT_ID = import.meta.env.VITE_APPWRITE_PROJECT_ID || '';

export const client = new Client()
    .setEndpoint(APPWRITE_ENDPOINT)
    .setProject(APPWRITE_PROJECT_ID);

export const account = new Account(client);
export const databases = new Databases(client);

export const DB_ID = 'assistia';
