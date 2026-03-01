import { Client, Databases, Users } from 'node-appwrite';
import { env } from '$env/dynamic/private';
import { env as publicEnv } from '$env/dynamic/public';

// Retrieve environment variables safely in SvelteKit
const APPWRITE_ENDPOINT = env.APPWRITE_ENDPOINT || publicEnv.PUBLIC_APPWRITE_ENDPOINT || 'http://app.localhost/v1';
const APPWRITE_PROJECT_ID = publicEnv.PUBLIC_APPWRITE_PROJECT_ID || '';
const APPWRITE_API_KEY = env.APPWRITE_API_KEY;

function createAdminClient() {
    if (!APPWRITE_PROJECT_ID || !APPWRITE_API_KEY) {
        throw new Error("Missing Appwrite configuration. Check your .env file.");
    }

    const client = new Client()
        .setEndpoint(APPWRITE_ENDPOINT)
        .setProject(APPWRITE_PROJECT_ID)
        .setKey(APPWRITE_API_KEY);

    return {
        get databases() {
            return new Databases(client);
        },
        get users() {
            return new Users(client);
        }
    };
}

export const adminClient = createAdminClient();
