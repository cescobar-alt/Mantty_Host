
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const env = fs.readFileSync('.env', 'utf8')
    .split('\n')
    .reduce((acc, line) => {
        const [key, value] = line.split('=');
        if (key && value) acc[key.trim()] = value.trim();
        return acc;
    }, {});

const supabaseUrl = env.VITE_SUPABASE_URL;
const supabaseAnonKey = env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function verifyUser() {
    console.log('Checking user ph3@email.com...');
    const { data, error } = await supabase.auth.signInWithPassword({
        email: 'ph3@email.com',
        password: '12345678',
    });

    if (error) {
        console.log('Verification Status: NOT FOUND or INCORRECT.');
        console.log('Error Details:', error.message);
    } else {
        console.log('Verification Status: SUCCESS! User exists.');
        console.log('User ID:', data.user.id);

        // Check profile
        const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', data.user.id)
            .single();

        if (profileError) {
            console.log('Profile Error:', profileError.message);
        } else {
            console.log('Profile Data:', JSON.stringify(profile, null, 2));
        }

        await supabase.auth.signOut();
    }
}

verifyUser();
