
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

async function checkFinalState() {
    const email = 'ph2@admin.com';
    const password = '12345678';

    console.log(`Checking final state for ${email}...`);
    const { data: { user }, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (authError) {
        console.error('Auth Error:', authError.message);
        return;
    }

    // 1. Check profile
    const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

    console.log('Profile Data:', JSON.stringify(profile, null, 2));

    // 2. Check properties where admin_id is this user
    const { data: propertiesByAdmin } = await supabase
        .from('properties')
        .select('*')
        .eq('admin_id', user.id);

    console.log('Properties where user is admin:', JSON.stringify(propertiesByAdmin, null, 2));

    // 3. If profile has property_id, check that specific property
    if (profile && profile.property_id) {
        const { data: propertyById } = await supabase
            .from('properties')
            .select('*')
            .eq('id', profile.property_id)
            .single();
        console.log('Property linked in profile:', JSON.stringify(propertyById, null, 2));
    }

    await supabase.auth.signOut();
}

checkFinalState();
