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

async function executeSQL(sql) {
  try {
    const { data, error } = await supabase.rpc('sql', { query: sql });
    if (error) {
      console.error('SQL Error:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Exception:', err.message);
    return false;
  }
}

async function createTablesDirectly() {
  console.log('🔄 Creating database tables directly...');
  
  // Create categories table first (minimal version)
  const createCategoriesSQL = `
    CREATE TABLE IF NOT EXISTS public.categories (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name TEXT NOT NULL,
      description TEXT,
      parent_id UUID,
      image_url TEXT,
      is_active BOOLEAN DEFAULT TRUE,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  `;
  
  console.log('📝 Creating categories table...');
  const success = await executeSQL(createCategoriesSQL);
  
  if (success) {
    console.log('✅ Categories table created successfully');
    
    // Insert sample categories
    const insertCategoriesSQL = `
      INSERT INTO public.categories (name, description) VALUES 
      ('Sarees', 'Traditional Indian sarees'),
      ('Salwar Kameez', 'Traditional Pakistani/Indian suits'),
      ('Kurtis', 'Indian tunics and tops'),
      ('Lehengas', 'Traditional skirt and blouse sets')
      ON CONFLICT (name) DO NOTHING;
    `;
    
    console.log('📝 Inserting sample categories...');
    await executeSQL(insertCategoriesSQL);
    
    console.log('✅ Sample categories inserted');
  } else {
    console.log('❌ Failed to create categories table');
  }
  
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
      console.log('📋 Categories:', categories.map(c => c.name).join(', '));
    }
  }
}

createTablesDirectly();