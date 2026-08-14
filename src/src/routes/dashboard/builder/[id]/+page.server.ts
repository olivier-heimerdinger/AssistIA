import type { PageServerLoad, Actions } from './$types';
import { adminClient } from '$lib/server/appwrite';
import { error, fail } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params }) => {
    try {
        const databases = adminClient.databases;
        const document = await databases.getDocument(
            'assistia', // Database ID
            'documents', // Collection ID
            params.id
        );

        return {
            id: params.id,
            document: {
                title: document.title,
                blocks: document.blocks // This is where the AST JSON is stored
            }
        };
    } catch (e) {
        console.error("Error loading builder document:", e);
        // Fallback for demo/testing if not found
        return {
            id: params.id,
            document: {
                title: "Nouveau Projet (Non Sauvegardé)",
                blocks: null
            }
        };
    }
};

export const actions: Actions = {
    save: async ({ request, params }) => {
        const data = await request.formData();
        const astJSON = data.get('blocks') as string;

        if (!astJSON) {
            return fail(400, { missing: true });
        }

        try {
            const databases = adminClient.databases;
            await databases.updateDocument(
                'assistia', // Database ID
                'documents', // Collection ID
                params.id,
                {
                    blocks: astJSON
                }
            );
            return { success: true };
        } catch (e) {
            console.error("Failed to save AST:", e);
            return fail(500, { error: 'Failed to save document' });
        }
    }
};
