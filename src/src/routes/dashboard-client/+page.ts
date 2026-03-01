import type { PageLoad } from './$types';

export const load: PageLoad = async () => {
    // Mimics a database call delay (optional)
    // await new Promise(resolve => setTimeout(resolve, 300));

    // MOCK DATA for Epic 2 (Before connecting to real Appwrite DB in Epic 3)
    const nextAppointment = {
        title: "Consultation de suivi",
        date: "Demain à 14h30",
        duration: "45 min",
        practitioner: "Dr. Lelong",
    };

    const invoices = [
        {
            id: "F-2026-003",
            date: "24 Fév 2026",
            amount: "65.00",
            status: "payée",
        },
        {
            id: "F-2026-004",
            date: "01 Mar 2026",
            amount: "120.00",
            status: "en attente",
        },
    ];

    const documents = [
        { name: "CR_Bilan_Sang.pdf", date: "Le 28 Fév 2026", type: "Bilan" },
        {
            name: "Ordonnance_Mars.pdf",
            date: "Le 01 Mar 2026",
            type: "Prescription",
        },
    ];

    return {
        nextAppointment,
        invoices,
        documents
    };
};
