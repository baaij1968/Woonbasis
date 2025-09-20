import { createClient } from '@supabase/supabase-js';

// Configuratie van de Supabase client.
// Deze gegevens zijn afkomstig uit uw Supabase-project.
const supabaseUrl = 'https://hgqramsewulixmanlynk.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhncXJhbXNld3VsaXhtYW5seW5rIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgzNzMzNzAsImV4cCI6MjA3Mzk0OTM3MH0.BLwR0xjpMu-jmRyhEZxKBr96MY47Jsbv0wC0I7De0wQ';

// Validatie om te controleren of de sleutels zijn ingevuld.
if (!supabaseUrl || !supabaseKey) {
    throw new Error(
        "Supabase URL of Key ontbreekt. Controleer de configuratie in 'services/supabaseClient.ts'."
    );
}

// Maak en exporteer de Supabase client, die in de rest van de app gebruikt wordt.
export const supabase = createClient(supabaseUrl, supabaseKey);
