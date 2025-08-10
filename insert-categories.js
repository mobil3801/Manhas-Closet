import dotenv from 'dotenv';
import pkg from 'pg';
const { Client } = pkg;

dotenv.config();

const client = new Client({
  connectionString: process.env.DATABASE_URL,
});

async function insertCategories() {
  try {
    console.log('🔄 Connecting to PostgreSQL database...');
    await client.connect();
    console.log('✅ Connected successfully');

    // Insert sample categories without ON CONFLICT
    const insertCategoriesSQL = `
      INSERT INTO public.categories (name, description) VALUES 
      ('Sarees', 'Traditional Indian sarees'),
      ('Salwar Kameez', 'Traditional Pakistani/Indian suits'),
      ('Kurtis', 'Indian tunics and tops'),
      ('Lehengas', 'Traditional skirt and blouse sets');
    `;

    console.log('📝 Inserting sample categories...');
    await client.query(insertCategoriesSQL);
    console.log('✅ Sample categories inserted');

    // Test by querying the categories
    console.log('\n🔍 Testing categories table...');
    const result = await client.query('SELECT id, name FROM public.categories LIMIT 10');
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

insertCategories();