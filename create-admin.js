import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials in .env file');
  console.log('Please ensure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set in your .env file');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function createAdminUser() {
  try {
    console.log('🔄 Creating admin user...');

    // Sign up a new user
    const { data: authData, error: signUpError } = await supabase.auth.signUp({
      email: 'admin@manhascloset.com',
      password: 'Admin@123456',
      options: {
        data: {
          full_name: 'System Administrator',
          role: 'system_admin'
        }
      }
    });

    if (signUpError && signUpError.message !== 'User already registered') {
      console.error('❌ Error creating admin user:', signUpError.message);
      return;
    }

    console.log('✅ Admin user created or already exists');

    // Get the user ID
    let userId;
    if (authData?.user) {
      userId = authData.user.id;
    } else {
      // If user already exists, get their ID
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        console.error('❌ Error getting existing user:', userError?.message || 'User not found');
        return;
      }
      userId = user.id;
    }

    console.log(`🔑 User ID: ${userId}`);

    // Update the user role in the users table
    const { error: updateError } = await supabase
      .from('users')
      .upsert({
        id: userId,
        email: 'admin@manhascloset.com',
        full_name: 'System Administrator',
        role: 'system_admin',
        is_active: true
      });

    if (updateError) {
      console.error('❌ Error updating user role:', updateError.message);
      return;
    }

    console.log('✅ User role updated to system_admin');

    // Sign in to verify
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email: 'admin@manhascloset.com',
      password: 'Admin@123456'
    });

    if (signInError) {
      console.error('❌ Error signing in:', signInError.message);
      return;
    }

    console.log('✅ Successfully signed in as admin');
    console.log('
🎉 Admin user created successfully!');
    console.log('📍 Email: admin@manhascloset.com');
    console.log('🔑 Password: Admin@123456');
    console.log('👤 Role: System Administrator');

  } catch (error) {
    console.error('❌ Unexpected error:', error.message);
  }
}

createAdminUser();
