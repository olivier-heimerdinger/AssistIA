import type { PageServerLoad, Actions } from './$types';
import { adminClient } from '$lib/server/appwrite';
import { ID, Query } from 'node-appwrite';
import { redirect } from '@sveltejs/kit';

const DB_ID = 'assistia';

export const load: PageServerLoad = async () => {
    try {
        const db = adminClient.databases;

        const response = await db.listDocuments(
            DB_ID,
            'documents',
            [
                Query.limit(50),
                Query.orderDesc('$createdAt')
            ]
        );

        const documents = response.documents.map(doc => ({
            id: doc.$id,
            title: doc.title || "Document sans titre",
            createdAt: doc.$createdAt,
            updatedAt: doc.$updatedAt
        }));

        return {
            documents
        };

    } catch (error) {
        console.error("Error loading documents:", error);
        return {
            documents: []
        };
    }
};

export const actions: Actions = {
    create: async () => {
        let docId = '';
        try {
            const db = adminClient.databases;
            const doc = await db.createDocument(
                DB_ID,
                'documents',
                ID.unique(),
                {
                    title: "Nouveau Document",
                    // Initial block: a single empty paragraph or h1
                    blocks: JSON.stringify([{ id: ID.unique(), type: 'h1', content: '' }]),
                    ownerId: "system", // Using a dummy for MVP if there's no auth session yet
                    fileId: "none",    // Provide dummy values for now until schema update stabilizes
                    groupId: "none",
                    type: "draft"
                }
            );
            docId = doc.$id;
        } catch (error) {
            console.error("Error creating document:", error);
            // Handle error, maybe return a fail() response.
            // For now, we'll let it fail silently or we should enhance this later.
        }

        if (docId) {
            throw redirect(303, `/dashboard/documents/${docId}`);
        }
    }
};
