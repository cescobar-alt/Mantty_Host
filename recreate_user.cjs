
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

async function createUser() {
    console.log('Attempting to create user ph3@email.com...');
    const { data, error } = await supabase.auth.signUp({
        email: 'ph3@email.com',
        password: '12345678',
        options: {
            data: {
                full_name: 'Admin PH 3',
                role: 'admin_uh'
            }
        }
    });

    if (error) {
        console.error('Error:', error.message);
    } else {
        console.log('Success! User created with ID:', data.user?.id);
        if (data.session) console.log('Session created.');
    }
}

createUser();
