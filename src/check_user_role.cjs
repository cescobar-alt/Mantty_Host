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

async function checkUser() {
    const email = 'ph3@admin.com';
    console.log(`Checking profile for email: ${email}...`);

    const { data: profiles, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('email', email);

    if (error) {
        console.error('Error fetching profiles:', error.message);
        return;
    }

    if (profiles.length === 0) {
        console.log(`No profile found for email: ${email}`);

        // Let's also try ph3@email.com just in case it was a typo in the request or script
        console.log(`Checking profile for email: ph3@email.com...`);
        const { data: profiles2, error: error2 } = await supabase
            .from('profiles')
            .select('*')
            .eq('email', 'ph3@email.com');

        if (profiles2 && profiles2.length > 0) {
            console.log('Found profile for ph3@email.com:', JSON.stringify(profiles2, null, 2));
        } else {
            console.log('No profile found for ph3@email.com either.');
        }
    } else {
        console.log('Found profile:', JSON.stringify(profiles, null, 2));
    }
}

checkUser();
