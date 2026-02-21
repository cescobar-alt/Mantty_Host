
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

async function checkState() {
    const email = 'ph2@admin.com';
    const password = '12345678';

    console.log(`Checking state for ${email}...`);
    const { data: { user }, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (authError) {
        console.error('Auth Error:', authError.message);
        return;
    }

    console.log('User ID:', user.id);

    // 1. Check profile
    const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

    if (profileError) {
        console.log('Profile State: NOT FOUND or Error:', profileError.message);
    } else {
        console.log('Profile State:', JSON.stringify(profile, null, 2));
    }

    // 2. Check properties
    const { data: properties, error: propsError } = await supabase
        .from('properties')
        .select('*')
        .eq('admin_id', user.id);

    if (propsError) {
        console.log('Properties Check Error:', propsError.message);
    } else {
        console.log(`Properties found for this user: ${properties.length}`);
        console.log(JSON.stringify(properties, null, 2));
    }

    await supabase.auth.signOut();
}

checkState();
