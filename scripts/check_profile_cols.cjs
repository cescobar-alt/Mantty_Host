
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

async function checkProfileColumns() {
    await supabase.auth.signInWithPassword({
        email: 'ph2@admin.com',
        password: '12345678',
    });

    console.log('Checking all columns of "profiles" as logged in user...');
    const { data, error } = await supabase.from('profiles').select('*').limit(1);

    if (error) {
        console.error('Error:', error.message);
    } else if (data && data.length > 0) {
        console.log('Columns in profiles:', Object.keys(data[0]));
        console.log('Full profile:', data[0]);
    } else {
        console.log('No profiles found to inspect.');
    }
    await supabase.auth.signOut();
}

checkProfileColumns();
