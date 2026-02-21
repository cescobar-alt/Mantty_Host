
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

    const { data: profile } = await supabase.from('profiles').select('*').limit(1).single();

    if (profile) {
        console.log('COLUMNS_START');
        Object.keys(profile).forEach(k => console.log(`COL:${k}`));
        console.log('COLUMNS_END');
    } else {
        console.log('PROFILE_NOT_FOUND');
    }
    await supabase.auth.signOut();
}

checkProfileColumns();
