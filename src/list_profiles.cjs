const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const envContent = fs.readFileSync('.env', 'utf8');
const env = envContent.split('\n').reduce((acc, line) => {
    const [key, ...valueParts] = line.split('=');
    if (key && valueParts.length > 0) acc[key.trim()] = valueParts.join('=').trim();
    return acc;
}, {});

const supabaseUrl = env.VITE_SUPABASE_URL;
const supabaseAnonKey = env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function listSomeProfiles() {
    console.log(`Listing first 5 profiles...`);

    // We try to list profiles. If RLS is enabled and active, this might return nothing or only current user.
    const { data: profiles, error } = await supabase
        .from('profiles')
        .select('*')
        .limit(5);

    if (error) {
        console.error('Error fetching profiles:', error.message);
        return;
    }

    console.log('Profiles found:', JSON.stringify(profiles, null, 2));
}

listSomeProfiles();
