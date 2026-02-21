
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

async function listTables() {
    console.log('Fetching table list...');
    // This is a trick to get table names via a common error or a system query if RLS allows
    const { data, error } = await supabase.from('properties').select('*').limit(0);

    if (error) {
        console.log('Error checking "properties" table:', error.message);
    } else {
        console.log('Table "properties" exists and is accessible.');
    }

    const { data: phData, error: phError } = await supabase.from('ph_properties').select('*').limit(0);
    if (phError) {
        console.log('Error checking "ph_properties" table:', phError.message);
    } else {
        console.log('Table "ph_properties" exists and is accessible.');
    }
}

listTables();
