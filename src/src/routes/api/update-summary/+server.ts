import { json } from '@sveltejs/kit';
import { adminClient } from '$lib/server/appwrite';

export async function PUT({ request }) {
    try {
        const body = await request.json();
        const { id, summary } = body;

        if (!id || summary === undefined) {
            return json({ error: "Missing required fields: id or summary" }, { status: 400 });
        }

        const document = await adminClient.databases.updateDocument(
            'assistia',
            'appointments',
            id,
            { summary: summary }
        );

        return json({ success: true, document });

    } catch (error: any) {
        console.error("Manual Summary Update Error:", error);
        return json({
            error: "Erreur lors de la sauvegarde.",
            details: error.message
        }, { status: 500 });
    }
}
