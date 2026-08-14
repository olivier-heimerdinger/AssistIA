import type { PageServerLoad, Actions } from './$types';
import { adminClient } from '$lib/server/appwrite';
import { error, redirect } from '@sveltejs/kit';

const DB_ID = 'assistia';

export const load: PageServerLoad = async ({ params }) => {
    try {
        const db = adminClient.databases;
        const document = await db.getDocument(DB_ID, 'documents', params.id);

        return {
            document: {
                id: document.$id,
                title: document.title || "Document sans titre",
                blocks: document.blocks ? JSON.parse(document.blocks) : [],
                updatedAt: document.$updatedAt
            }
        };
    } catch (err: any) {
        if (err.code === 404) {
            throw error(404, 'Document introuvable');
        }
        console.error("Error loading document:", err);
        throw error(500, 'Erreur lors du chargement du document');
    }
};

export const actions: Actions = {
    save: async ({ request, params }) => {
        const data = await request.formData();
        const title = data.get('title') as string;
        const blocksStr = data.get('blocks') as string;

        try {
            const db = adminClient.databases;
            await db.updateDocument(
                DB_ID,
                'documents',
                params.id,
                {
                    title,
                    blocks: blocksStr
                }
            );
            return { success: true };
        } catch (err) {
            console.error("Error saving document:", err);
            return { success: false, error: 'Erreur lors de la sauvegarde.' };
        }
    },
    delete: async ({ params }) => {
        try {
            const db = adminClient.databases;
            await db.deleteDocument(DB_ID, 'documents', params.id);
        } catch (err) {
            console.error("Error deleting document:", err);
            return { success: false, error: 'Erreur lors de la suppression.' };
        }
        throw redirect(303, '/dashboard/documents');
    }
};
