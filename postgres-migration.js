import dotenv from 'dotenv';
import pkg from 'pg';
const { Client } = pkg;

dotenv.config();

const client = new Client({
  connectionString: process.env.DATABASE_URL,
});

async function createTables() {
  try {
    console.log('🔄 Connecting to PostgreSQL database...');
    await client.connect();
    console.log('✅ Connected successfully');

    // Create categories table
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
    await client.query(createCategoriesSQL);
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
    await client.query(insertCategoriesSQL);
    console.log('✅ Sample categories inserted');

    // Test by querying the categories
    console.log('\n🔍 Testing categories table...');
    const result = await client.query('SELECT id, name FROM public.categories LIMIT 5');
    console.log(`✅ Found ${result.rows.length} categories:`);
    result.rows.forEach(row => {
      console.log(`  - ${row.name} (${row.id})`);
    });

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await client.end();
    console.log('🔌 Database connection closed');
  }
}

createTables();