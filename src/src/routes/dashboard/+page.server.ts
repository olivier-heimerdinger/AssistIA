import type { PageServerLoad } from './$types';
import { adminClient } from '$lib/server/appwrite';
import { Query } from 'node-appwrite';

const DB_ID = 'assistia';

export const load: PageServerLoad = async () => {
    try {
        const db = adminClient.databases;

        // Fetch today's appointments (Ideally using a Query.greaterThan/lessThan on start date)
        // For MVP, if we don't have records yet, we fetch up to 50 latest or return mock data.
        const response = await db.listDocuments(
            DB_ID,
            'appointments',
            [
                Query.limit(50),
                Query.orderDesc('$createdAt')
            ]
        );

        let appointments = [];
        let stats = {
            totalToday: 0,
            completed: 0,
            aiActionsPending: 0,
        };

        if (response.documents.length === 0) {
            console.log("No appointments found in DB, falling back to mock data for layout purposes.");
            appointments = [
                {
                    id: "mock_1",
                    title: "Consultation - Dr. Lelong",
                    clientName: "Jean Dupont (Mock)",
                    time: "09:00 - 09:45",
                    status: "terminé",
                    aiActionStatus: "todo",
                    notes: "Patient se plaint de douleurs lombaires."
                }
            ];
            stats.totalToday = 1;
            stats.aiActionsPending = 1;
        } else {
            // Map actual Appwrite documents to expected UI structure
            appointments = response.documents.map(doc => {

                // Derive status/badge from DB fields
                let aiActionStatus = "none";
                if (doc.status === 'terminé' && !doc.summary) {
                    aiActionStatus = "todo";
                } else if (doc.summary) {
                    aiActionStatus = "done";
                }

                // Temporary logic until we sync Google Calendar dates format properly
                const startDate = new Date(doc.start);
                const endDate = new Date(doc.end);
                const timeString = `${startDate.getHours().toString().padStart(2, '0')}:${startDate.getMinutes().toString().padStart(2, '0')} - ${endDate.getHours().toString().padStart(2, '0')}:${endDate.getMinutes().toString().padStart(2, '0')}`;

                return {
                    id: doc.$id,
                    title: doc.title,
                    // Note: In real life we'd query the Clients collection to join the name via clientId
                    clientName: "Client ID: " + (doc.clientId || "N/A"),
                    time: timeString,
                    status: doc.status || "à venir",
                    aiActionStatus,
                    notes: doc.notes || "",
                    summary: doc.summary || null
                };
            });

            // Calculate stats based on actual data
            stats.totalToday = appointments.length;
            stats.completed = appointments.filter(a => a.status === 'terminé').length;
            stats.aiActionsPending = appointments.filter(a => a.aiActionStatus === 'todo').length;
        }

        return {
            appointments,
            stats
        };

    } catch (error) {
        console.error("Error loading dashboard data:", error);
        return {
            appointments: [],
            stats: { totalToday: 0, completed: 0, aiActionsPending: 0 }
        };
    }
};
