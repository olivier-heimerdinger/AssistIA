import { Client, Databases, ID, Permission, Role } from 'node-appwrite';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const ENDPOINT = process.env.VITE_APPWRITE_ENDPOINT || 'http://app.localhost/v1';
const PROJECT_ID = process.env.VITE_APPWRITE_PROJECT_ID;
const API_KEY = process.env.APPWRITE_API_KEY;

if (!PROJECT_ID || !API_KEY) {
    console.error("❌ Missing VITE_APPWRITE_PROJECT_ID or APPWRITE_API_KEY in .env");
    process.exit(1);
}

const client = new Client()
    .setEndpoint(ENDPOINT)
    .setProject(PROJECT_ID)
    .setKey(API_KEY);

const db = new Databases(client);

// Configuration
const DATABASE_ID = 'assistia';
const DATABASE_NAME = 'AssistIA DB';

const SCHEMA = [
    {
        name: 'Profiles',
        id: 'profiles',
        permissions: [
            Permission.read(Role.any()),
            Permission.create(Role.users()),
            Permission.update(Role.users()),
            Permission.delete(Role.users()),
        ],
        documentSecurity: true,
        attributes: [
            { id: 'userId', type: 'string', required: true, size: 255 },
            { id: 'name', type: 'string', required: true, size: 255 },
            { id: 'hourlyRate', type: 'float', required: false },
            { id: 'companyInfo', type: 'string', required: false, size: 1000 },
        ]
    },
    {
        name: 'Clients',
        id: 'clients',
        permissions: [
            Permission.read(Role.users()),
            Permission.create(Role.users()),
            Permission.update(Role.users()),
            Permission.delete(Role.users()),
        ],
        documentSecurity: true,
        attributes: [
            { id: 'name', type: 'string', required: true, size: 255 },
            { id: 'email', type: 'email', required: true },
            { id: 'groupId', type: 'string', required: false, size: 255 },
            { id: 'billingAddress', type: 'string', required: false, size: 1000 },
        ]
    },
    {
        name: 'Appointments',
        id: 'appointments',
        permissions: [
            Permission.read(Role.users()),
            Permission.create(Role.users()),
            Permission.update(Role.users()),
            Permission.delete(Role.users()),
        ],
        documentSecurity: true,
        attributes: [
            { id: 'calendarId', type: 'string', required: false, size: 255 },
            { id: 'title', type: 'string', required: true, size: 255 },
            { id: 'start', type: 'datetime', required: true },
            { id: 'end', type: 'datetime', required: true },
            { id: 'notes', type: 'string', required: false, size: 10000 },
            { id: 'status', type: 'string', required: true, size: 50 },
        ]
    },
    {
        name: 'Invoices',
        id: 'invoices',
        permissions: [
            Permission.read(Role.users()),
            Permission.create(Role.users()),
            Permission.update(Role.users()),
            Permission.delete(Role.users()),
        ],
        documentSecurity: true,
        attributes: [
            { id: 'clientId', type: 'string', required: true, size: 255 },
            { id: 'amount', type: 'float', required: true },
            { id: 'status', type: 'string', required: true, size: 50 },
            { id: 'pdfUrl', type: 'url', required: false },
            { id: 'dueDate', type: 'datetime', required: true },
        ]
    },
    {
        name: 'Groups',
        id: 'groups',
        permissions: [
            Permission.read(Role.users()),
            Permission.create(Role.users()),
            Permission.update(Role.users()),
            Permission.delete(Role.users()),
        ],
        documentSecurity: true,
        attributes: [
            { id: 'groupName', type: 'string', required: true, size: 255 },
            { id: 'description', type: 'string', required: false, size: 1000 },
            { id: 'members', type: 'string', required: false, size: 255, array: true }, // Array of user IDs
        ]
    },
    {
        name: 'Documents',
        id: 'documents',
        permissions: [
            Permission.read(Role.users()),
            Permission.create(Role.users()),
            Permission.update(Role.users()),
            Permission.delete(Role.users()),
        ],
        documentSecurity: true,
        attributes: [
            { id: 'fileId', type: 'string', required: true, size: 255 },
            { id: 'groupId', type: 'string', required: false, size: 255 },
            { id: 'type', type: 'string', required: true, size: 50 },
            { id: 'ownerId', type: 'string', required: true, size: 255 },
        ]
    }
];

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function createAttribute(collectionId, attr) {
    console.log(`⏳ Creating attribute ${attr.id} in ${collectionId}...`);
    try {
        switch (attr.type) {
            case 'string':
                await db.createStringAttribute(DATABASE_ID, collectionId, attr.id, attr.size, attr.required, attr.default, attr.array);
                break;
            case 'email':
                await db.createEmailAttribute(DATABASE_ID, collectionId, attr.id, attr.required, attr.default, attr.array);
                break;
            case 'url':
                await db.createUrlAttribute(DATABASE_ID, collectionId, attr.id, attr.required, attr.default, attr.array);
                break;
            case 'float':
                await db.createFloatAttribute(DATABASE_ID, collectionId, attr.id, attr.required, attr.min, attr.max, attr.default, attr.array);
                break;
            case 'datetime':
                await db.createDatetimeAttribute(DATABASE_ID, collectionId, attr.id, attr.required, attr.default, attr.array);
                break;
            case 'boolean':
                await db.createBooleanAttribute(DATABASE_ID, collectionId, attr.id, attr.required, attr.default, attr.array);
                break;
        }
    } catch (err) {
        if (err.code === 409) {
            console.log(`✅ Attribute ${attr.id} already exists`);
            return;
        }
        throw err;
    }
}

async function migrate() {
    console.log("🚀 Starting Database Migration...");

    // 1. Create or verify Database
    try {
        await db.get(DATABASE_ID);
        console.log(`✅ Database ${DATABASE_ID} found.`);
    } catch (err) {
        if (err.code === 404) {
            console.log(`🔨 Creating database ${DATABASE_ID}...`);
            await db.create(DATABASE_ID, DATABASE_NAME);
        } else {
            throw err;
        }
    }

    // 2. Loop through collections
    for (const col of SCHEMA) {
        let exists = false;
        try {
            await db.getCollection(DATABASE_ID, col.id);
            exists = true;
            console.log(`✅ Collection ${col.id} found.`);
            // Update permissions just in case
            await db.updateCollection(DATABASE_ID, col.id, col.name, col.permissions, col.documentSecurity);
        } catch (err) {
            if (err.code === 404) {
                console.log(`🔨 Creating collection ${col.id}...`);
                await db.createCollection(DATABASE_ID, col.id, col.name, col.permissions, col.documentSecurity);
                exists = true;
            } else {
                throw err;
            }
        }

        if (exists) {
            // Get existing attributes
            const currentObj = await db.listAttributes(DATABASE_ID, col.id);
            const currentKeys = currentObj.attributes.map(a => a.key);

            for (const attr of col.attributes) {
                if (!currentKeys.includes(attr.id)) {
                    await createAttribute(col.id, attr);
                    // Wait a bit because Appwrite takes time to provision attributes
                    await sleep(2000);
                }
            }
            console.log(`🎉 Collection ${col.id} is fully migrated.`);
        }
    }

    console.log("✅ All migrations applied successfully!");
}

migrate().catch(console.error);
