
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const env = fs.readFileSync('.env', 'utf8')
    .split('\n')
    .reduce((acc, line) => {
        const [key, ...valueParts] = line.split('=');
        if (key && valueParts.length > 0) acc[key.trim()] = valueParts.join('=').trim();
        return acc;
    }, {});

const supabaseUrl = env.VITE_SUPABASE_URL;
const supabaseAnonKey = env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function verifyUser() {
    const email = 'ph2@admin.com';
    const password = '12345678';

    console.log(`Checking user ${email}...`);
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error) {
        console.log(`Verification Status for ${email}: NOT FOUND or INCORRECT CREDENTIALS.`);
        console.log('Error:', error.message);
    } else {
        console.log(`Verification Status for ${email}: SUCCESS! User exists.`);
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
