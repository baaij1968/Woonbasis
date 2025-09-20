import { createClient } from '@supabase/supabase-js';

// --- CONFIGURATIE ---
// U bent bij de laatste stap! Kopieer en plak hier uw Supabase-gegevens.
// Deze vindt u in uw Supabase-project onder Instellingen (tandwiel-icoon) > API.

// VOORBEELD:
// const supabaseUrl = 'https://jouw-unieke-project-id.supabase.co';
// const supabaseKey = 'jouw-lange-anon-public-key-begint-met-ey...';

// GEGEVENS ZIJN INGEVULD:
const supabaseUrl = 'https://hgqramsewulixmanlynk.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhncXJhbXNld3VsaXhtYW5seW5rIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgzNzMzNzAsImV4cCI6MjA3Mzk0OTM3MH0.BLwR0xjpMu-jmRyhEZxKBr96MY47Jsbv0wC0I7De0wQ';


// --- Validatie & Initialisatie (Hieronder hoeft u niets te wijzigen) ---
if (supabaseUrl.includes('PLAK_HIER') || supabaseKey.includes('PLAK_HIER')) {
    // Dit stopt de app en geeft een duidelijke instructie in de developer console.
    throw new Error(
        "Supabase is nog niet geconfigureerd. Open 'services/supabaseClient.ts', " +
        "en vervang de placeholder-waarden met uw eigen Supabase URL en Anon Key."
    );
}

// Maak en exporteer de Supabase client
export const supabase = createClient(supabaseUrl, supabaseKey);