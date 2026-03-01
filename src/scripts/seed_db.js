import { Client, Databases, ID } from 'node-appwrite';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const ENDPOINT = process.env.VITE_APPWRITE_ENDPOINT || 'http://app.localhost/v1';
const PROJECT_ID = process.env.VITE_APPWRITE_PROJECT_ID;
const API_KEY = process.env.APPWRITE_API_KEY;

if (!PROJECT_ID || !API_KEY) {
    console.error("❌ Missing variables in .env");
    process.exit(1);
}

const client = new Client()
    .setEndpoint(ENDPOINT)
    .setProject(PROJECT_ID)
    .setKey(API_KEY);

const db = new Databases(client);
const DATABASE_ID = 'assistia';

async function seed() {
    console.log("🌱 Seeding Mock Appointments...");

    const today = new Date();
    today.setHours(9, 0, 0, 0);

    const appointments = [
        {
            title: "Consultation - Dr. Lelong",
            start: today.toISOString(),
            end: new Date(today.getTime() + 45 * 60000).toISOString(),
            status: "terminé",
            notes: "Patient se plaint de douleurs lombaires. Prescription de kinésithérapie."
        },
        {
            title: "Bilan Sanguin",
            start: new Date(today.getTime() + 90 * 60000).toISOString(),
            end: new Date(today.getTime() + 120 * 60000).toISOString(),
            status: "en cours",
            notes: ""
        },
        {
            title: "Suivi mensuel",
            start: new Date(today.getTime() + 5 * 3600000).toISOString(),
            end: new Date(today.getTime() + 6 * 3600000).toISOString(),
            status: "à venir",
            notes: ""
        }
    ];

    for (const apt of appointments) {
        try {
            await db.createDocument(
                DATABASE_ID,
                'appointments',
                ID.unique(),
                apt
            );
            console.log(`✅ Created appointment: ${apt.title}`);
        } catch (err) {
            console.error(`❌ Failed: ${apt.title}`, err);
        }
    }

    console.log("Done!");
}

seed().catch(console.error);
