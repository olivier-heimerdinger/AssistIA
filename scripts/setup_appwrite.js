require('dotenv').config();
const { Client, Databases } = require('node-appwrite');

const endpoint = process.env.APPWRITE_ENDPOINT || 'http://localhost/v1';
const projectId = process.env.APPWRITE_PROJECT_ID;
const apiKey = process.env.APPWRITE_API_KEY;

if (!projectId || !apiKey) {
    console.error("Missing APPWRITE_PROJECT_ID or APPWRITE_API_KEY in .env");
    console.error("Please create a project in the Appwrite Console (http://localhost),");
    console.error("generate an API Key (with Database read/write scopes), and add them to scripts/.env");
    process.exit(1);
}

const client = new Client()
    .setEndpoint(endpoint)
    .setProject(projectId)
    .setKey(apiKey);

const databases = new Databases(client);

const DB_ID = 'assistia';
const DB_NAME = 'AssistIA';

async function init() {
    try {
        console.log(`Checking database ${DB_ID}...`);
        try {
            await databases.get(DB_ID);
            console.log("Database already exists.");
        } catch (e) {
            console.log("Creating Database...");
            await databases.create(DB_ID, DB_NAME);
            console.log("Database created.");
        }

        // Helper to create collection and wait
        async function createCol(id, name) {
            try {
                await databases.getCollection(DB_ID, id);
                console.log(`Collection ${name} exists.`);
            } catch (e) {
                console.log(`Creating Collection ${name}...`);
                await databases.createCollection(DB_ID, id, name);
                console.log(`Collection ${name} created.`);
            }
        }

        await createCol('profiles', 'Profiles');
        await createCol('clients', 'Clients');
        await createCol('appointments', 'Appointments');
        await createCol('invoices', 'Invoices');
        await createCol('groups', 'Groups');
        await createCol('documents', 'Documents');

        // Note: Attribute creation can take time in Appwrite. We will catch 409 (already exists)
        async function addString(col, key, size, req = false, array = false) {
            try { await databases.createStringAttribute(DB_ID, col, key, size, req, undefined, array); console.log(`+ Added string ${key} to ${col}`); } catch (e) { if (e.code !== 409) console.error(e.message); }
        }
        async function addFloat(col, key, req = false) {
            try { await databases.createFloatAttribute(DB_ID, col, key, req, undefined, undefined, undefined); console.log(`+ Added float ${key} to ${col}`); } catch (e) { if (e.code !== 409) console.error(e.message); }
        }
        async function addEmail(col, key, req = false) {
            try { await databases.createEmailAttribute(DB_ID, col, key, req, undefined, undefined); console.log(`+ Added email ${key} to ${col}`); } catch (e) { if (e.code !== 409) console.error(e.message); }
        }
        async function addDatetime(col, key, req = false) {
            try { await databases.createDatetimeAttribute(DB_ID, col, key, req, undefined, undefined); console.log(`+ Added datetime ${key} to ${col}`); } catch (e) { if (e.code !== 409) console.error(e.message); }
        }

        console.log("\nConfiguring attributes...");
        // Profiles
        await addString('profiles', 'userId', 36, true);
        await addString('profiles', 'name', 128, true);
        await addFloat('profiles', 'hourlyRate', false);
        await addString('profiles', 'companyInfo', 1000, false);

        // Clients
        await addString('clients', 'name', 128, true);
        await addEmail('clients', 'email', true);
        await addString('clients', 'groupId', 36, false);
        await addString('clients', 'billingAddress', 1000, false);

        // Appointments
        await addString('appointments', 'calendarId', 255, false);
        await addString('appointments', 'title', 128, true);
        await addDatetime('appointments', 'start', true);
        await addDatetime('appointments', 'end', true);
        await addString('appointments', 'notes', 10000, false);
        await addString('appointments', 'status', 32, false);

        // Invoices
        await addString('invoices', 'clientId', 36, true);
        await addFloat('invoices', 'amount', true);
        await addString('invoices', 'status', 32, true);
        await addString('invoices', 'pdfUrl', 1000, false);
        await addDatetime('invoices', 'dueDate', false);

        // Groups
        await addString('groups', 'groupName', 128, true);
        await addString('groups', 'description', 1000, false);
        await addString('groups', 'members', 36, false, true);

        // Documents
        await addString('documents', 'fileId', 36, true);
        await addString('documents', 'groupId', 36, true);
        await addString('documents', 'type', 32, true);
        await addString('documents', 'ownerId', 36, true);

        console.log("\nSchema initialization completed! Attributes are provisioning in the background.");

    } catch (error) {
        console.error("Initialization failed:", error);
    }
}

init();
