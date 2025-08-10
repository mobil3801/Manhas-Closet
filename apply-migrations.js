import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function applyMigrations() {
  console.log('🔄 Applying database migrations...');
  
  try {
    // Read the migration file
    const migrationPath = path.join(__dirname, 'supabase', 'migrations', '001_initial_schema.sql');
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
    
    console.log('📄 Migration file loaded');
    
    // Split the SQL into individual statements
    const statements = migrationSQL
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));
    
    console.log(`📝 Found ${statements.length} SQL statements`);
    
    // Execute each statement
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      if (statement.trim()) {
        try {
          console.log(`⚡ Executing statement ${i + 1}/${statements.length}...`);
          const { error } = await supabase.rpc('exec_sql', { sql: statement });
          
          if (error) {
            // Some errors are expected (like "already exists")
            if (error.message.includes('already exists') || 
                error.message.includes('does not exist') ||
                error.message.includes('duplicate key')) {
              console.log(`⚠️  Statement ${i + 1}: ${error.message} (continuing...)`);
            } else {
              console.error(`❌ Error in statement ${i + 1}:`, error.message);
            }
          } else {
            console.log(`✅ Statement ${i + 1} executed successfully`);
          }
        } catch (err) {
          console.error(`❌ Exception in statement ${i + 1}:`, err.message);
        }
      }
    }
    
    console.log('🎉 Migration process completed!');
    
    // Test the connection
    console.log('\n🔍 Testing database connection...');
    const { data: categories, error: testError } = await supabase
      .from('categories')
      .select('*')
      .limit(5);
    
    if (testError) {
      console.error('❌ Connection test failed:', testError.message);
    } else {
      console.log('✅ Connection test successful!');
      console.log(`📊 Found ${categories?.length || 0} categories`);
      if (categories && categories.length > 0) {
        console.log('📋 Sample categories:', categories.map(c => c.name).join(', '));
      }
    }
    
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    process.exit(1);
  }
}

// Alternative approach: Use direct SQL execution
async function applyMigrationsDirectly() {
  console.log('🔄 Applying migrations using direct SQL execution...');
  
  try {
    // First, let's try to create the basic tables one by one
    const basicTables = [
      `CREATE TABLE IF NOT EXISTS public.categories (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name TEXT NOT NULL,
        description TEXT,
        parent_id UUID REFERENCES categories(id) ON DELETE SET NULL,
        image_url TEXT,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );`,
      
      `INSERT INTO public.categories (name, description) VALUES 
      ('Sarees', 'Traditional Indian sarees'),
      ('Salwar Kameez', 'Traditional Pakistani/Indian suits'),
      ('Kurtis', 'Indian tunics and tops'),
      ('Lehengas', 'Traditional skirt and blouse sets')
      ON CONFLICT (name) DO NOTHING;`
    ];
    
    for (const sql of basicTables) {
      try {
        const { error } = await supabase.rpc('exec_sql', { sql });
        if (error && !error.message.includes('already exists')) {
          console.error('❌ SQL Error:', error.message);
        } else {
          console.log('✅ Table operation successful');
        }
      } catch (err) {
        console.log('⚠️  Direct SQL not available, trying alternative...');
        break;
      }
    }
    
    // Test the connection
    console.log('\n🔍 Testing database connection...');
    const { data: categories, error: testError } = await supabase
      .from('categories')
      .select('*')
      .limit(5);
    
    if (testError) {
      console.error('❌ Connection test failed:', testError.message);
      console.log('💡 The database schema may need to be created manually in Supabase dashboard');
    } else {
      console.log('✅ Connection test successful!');
      console.log(`📊 Found ${categories?.length || 0} categories`);
      if (categories && categories.length > 0) {
        console.log('📋 Sample categories:', categories.map(c => c.name).join(', '));
      }
    }
    
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
  }
}

// Run the migration
applyMigrationsDirectly();