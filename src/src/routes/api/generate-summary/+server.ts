import { json } from '@sveltejs/kit';
import { getAIClient, getAIModel } from '$lib/server/ai';
import { adminClient } from '$lib/server/appwrite';

export async function POST({ request }) {
    try {
        const body = await request.json();
        const { id, notes, title } = body;

        if (!notes) {
            return json({ error: "Missing clinical notes" }, { status: 400 });
        }

        const client = getAIClient();
        const model = getAIModel();

        const systemPrompt = `
Tu es un assistant médical administratif professionnel. 
On te fournit les notes brutes tapées rapidement par le secrétaire à l'issue d'un rendez-vous client.
Ton but est de reformuler ces notes en un texte propre, concis et structuré en 3 parties claires :
- ### Résumé : Synthèse du RDV en quelques lignes.
- ### Décisions : Ce qui a été acté.
- ### Actions : Les tâches à faire (ex: ordonnance, prochain RDV).

Rédige ce texte directement. Ne fais pas de longue introduction. Reste professionnel.
`;

        const userPrompt = `Rendez-vous concerné : "${title || 'Non spécifié'}"\nNotes brutes : ${notes}`;

        const response = await client.chat.completions.create({
            model: model,
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: userPrompt }
            ],
            temperature: 0.3,
        });

        const summary = response.choices[0]?.message?.content || "Erreur lors de la génération. Résultat vide.";

        // Save generated summary back to Appwrite if ID is provided
        if (id) {
            try {
                await adminClient.databases.updateDocument(
                    'assistia',
                    'appointments',
                    id,
                    { summary: summary }
                );
            } catch (dbError) {
                console.error("Failed to save summary to DB:", dbError);
                // Still return the generated summary even if save fails
            }
        }

        return json({ summary });

    } catch (error: any) {
        console.error("AI Generation Error:", error);
        return json({
            error: "Erreur de génération. Vérifiez que votre modèle local (LM Studio) est lancé.",
            details: error.message
        }, { status: 500 });
    }
}
