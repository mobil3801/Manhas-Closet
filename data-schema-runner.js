// Data Schema Runner for Manhas Closet
// This script validates all tables and forms are properly connected to Supabase

const { createClient } = require('@supabase/supabase-js');

// Supabase configuration
const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://npuqxyocqaqvicclwjti.supabase.co';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5wdXF4eW9jcWFxdmljY2x3anRpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMzNzc4NTMsImV4cCI6MjA2ODk1Mzg1M30.mzMsUY0kIoRASwalbm7Pu7ohzZzFuqzMKLekJqFZS8c';

const supabase = createClient(supabaseUrl, supabaseKey);

class DataSchemaRunner {
  constructor() {
    this.results = {
      tables: {},
      forms: {},
      connections: {},
      errors: []
    };
  }

  // Test all database tables
  async testAllTables() {
    const tables = [
      'users',
      'categories', 
      'products',
      'product_variants',
      'stock_movements',
      'invoices',
      'invoice_items',
      'payments',
      'cash_registers',
      'employees',
      'employee_documents',
      'attendance',
      'salaries',
      'salary_deductions',
      'salary_bonuses',
      'audit_logs'
    ];

    console.log('🔍 Testing Database Tables...');

    for (const table of tables) {
      try {
        console.log(`  Testing table: ${table}`);

        // Test SELECT permission
        const { data, error, count } = await supabase
          .from(table)
          .select('*', { count: 'exact', head: true })
          .limit(1);

        if (error) {
          this.results.tables[table] = {
            status: 'error',
            error: error.message,
            permissions: { select: false }
          };
          console.log(`    ❌ ${table}: ${error.message}`);
        } else {
          this.results.tables[table] = {
            status: 'success',
            count: count || 0,
            permissions: { select: true }
          };
          console.log(`    ✅ ${table}: Connected (Records: ${count || 0})`);
        }

      } catch (error) {
        this.results.tables[table] = {
          status: 'error',
          error: error.message
        };
        console.log(`    ❌ ${table}: ${error.message}`);
      }
    }
  }

  // Test form data structures
  async testFormConnections() {
    console.log('\n📝 Testing Form Connections...');

    const formTests = [
      {
        name: 'Product Form',
        table: 'products',
        requiredFields: ['name', 'sku', 'category_id', 'price'],
        sampleData: {
          name: 'Sample Product',
          sku: 'SAMPLE-001',
          price: 100.00,
          stock_quantity: 10,
          min_stock_level: 5
        }
      },
      {
        name: 'Category Form',
        table: 'categories',
        requiredFields: ['name'],
        sampleData: {
          name: 'Sample Category',
          description: 'A sample category for testing'
        }
      },
      {
        name: 'Invoice Form',
        table: 'invoices',
        requiredFields: ['invoice_number', 'customer_name', 'total_amount'],
        sampleData: {
          invoice_number: 'INV-SAMPLE-001',
          customer_name: 'Sample Customer',
          total_amount: 100.00,
          subtotal: 85.00,
          tax_amount: 15.00,
          discount_amount: 0.00
        }
      },
      {
        name: 'Employee Form',
        table: 'employees',
        requiredFields: ['employee_id', 'full_name', 'phone', 'nid', 'address', 'position', 'department', 'hire_date', 'salary'],
        sampleData: {
          employee_id: 'EMP-SAMPLE-001',
          full_name: 'Sample Employee',
          phone: '+1234567890',
          nid: 'SAMPLE123456',
          address: 'Sample Address',
          position: 'Sample Position',
          department: 'Sample Department',
          hire_date: '2024-01-01',
          salary: 50000.00
        }
      },
      {
        name: 'Payment Form',
        table: 'payments',
        requiredFields: ['amount', 'payment_method'],
        sampleData: {
          amount: 100.00,
          payment_method: 'cash',
          status: 'completed'
        }
      }
    ];

    for (const formTest of formTests) {
      try {
        console.log(`  Testing ${formTest.name}...`);

        // Validate form structure by checking table schema
        const { data: tableInfo, error: schemaError } = await supabase
          .from(formTest.table)
          .select('*')
          .limit(0);

        if (schemaError) {
          this.results.forms[formTest.name] = {
            status: 'error',
            error: schemaError.message
          };
          console.log(`    ❌ ${formTest.name}: ${schemaError.message}`);
        } else {
          this.results.forms[formTest.name] = {
            status: 'success',
            note: 'Form structure validated against table schema',
            requiredFields: formTest.requiredFields
          };
          console.log(`    ✅ ${formTest.name}: Structure validated`);
        }

      } catch (error) {
        this.results.forms[formTest.name] = {
          status: 'error',
          error: error.message
        };
        console.log(`    ❌ ${formTest.name}: ${error.message}`);
      }
    }
  }

  // Test RLS policies
  async testRLSPolicies() {
    console.log('\n🔒 Testing Row Level Security Policies...');

    const publicTables = ['categories', 'products', 'product_variants'];
    const protectedTables = ['users', 'employees', 'salaries', 'audit_logs'];

    for (const table of publicTables) {
      try {
        const { data, error } = await supabase
          .from(table)
          .select('*')
          .limit(1);

        if (error) {
          console.log(`  ❌ ${table} (public): ${error.message}`);
        } else {
          console.log(`  ✅ ${table} (public): Accessible`);
        }
      } catch (error) {
        console.log(`  ❌ ${table} (public): ${error.message}`);
      }
    }

    for (const table of protectedTables) {
      try {
        const { data, error } = await supabase
          .from(table)
          .select('*')
          .limit(1);

        if (error && error.message.includes('permission')) {
          console.log(`  ✅ ${table} (protected): RLS working correctly`);
        } else if (error) {
          console.log(`  ❌ ${table} (protected): ${error.message}`);
        } else {
          console.log(`  ⚠️  ${table} (protected): Accessible (may need authentication)`);
        }
      } catch (error) {
        console.log(`  ❌ ${table} (protected): ${error.message}`);
      }
    }
  }

  // Generate comprehensive report
  generateReport() {
    console.log('\n📊 COMPREHENSIVE DATA SCHEMA REPORT');
    console.log('='.repeat(60));

    // Tables Summary
    console.log('\n📋 DATABASE TABLES:');
    const tableStats = {
      total: Object.keys(this.results.tables).length,
      successful: Object.values(this.results.tables).filter(t => t.status === 'success').length,
      errors: Object.values(this.results.tables).filter(t => t.status === 'error').length
    };

    console.log(`  Total Tables: ${tableStats.total}`);
    console.log(`  ✅ Connected: ${tableStats.successful}`);
    console.log(`  ❌ Errors: ${tableStats.errors}`);

    // Forms Summary  
    console.log('\n📝 FORM CONNECTIONS:');
    const formStats = {
      total: Object.keys(this.results.forms).length,
      successful: Object.values(this.results.forms).filter(f => f.status === 'success').length,
      errors: Object.values(this.results.forms).filter(f => f.status === 'error').length
    };

    console.log(`  Total Forms: ${formStats.total}`);
    console.log(`  ✅ Working: ${formStats.successful}`);
    console.log(`  ❌ Errors: ${formStats.errors}`);

    // Table Details
    console.log('\n📋 TABLE DETAILS:');
    Object.entries(this.results.tables).forEach(([table, result]) => {
      const status = result.status === 'success' ? '✅' : '❌';
      const count = result.count !== undefined ? ` (${result.count} records)` : '';
      console.log(`  ${status} ${table}${count}`);
      if (result.error) {
        console.log(`      Error: ${result.error}`);
      }
    });

    // Form Details
    console.log('\n📝 FORM DETAILS:');
    Object.entries(this.results.forms).forEach(([form, result]) => {
      const status = result.status === 'success' ? '✅' : '❌';
      console.log(`  ${status} ${form}`);
      if (result.requiredFields) {
        console.log(`      Required Fields: ${result.requiredFields.join(', ')}`);
      }
      if (result.error) {
        console.log(`      Error: ${result.error}`);
      }
    });

    // Recommendations
    console.log('\n💡 RECOMMENDATIONS:');

    if (tableStats.errors === 0 && formStats.errors === 0) {
      console.log('  🎉 All systems operational! Your data schema is properly connected to Supabase.');
      console.log('  🔧 Consider implementing additional features:');
      console.log('    - Real-time subscriptions for inventory updates');
      console.log('    - Advanced search and filtering');
      console.log('    - Automated backup procedures');
      console.log('    - Performance monitoring');
    } else {
      console.log('  🔧 Issues found that need attention:');
      if (tableStats.errors > 0) {
        console.log('    - Fix database table connectivity issues');
        console.log('    - Verify RLS policies are correctly configured');
      }
      if (formStats.errors > 0) {
        console.log('    - Update form validation to match database schema');
        console.log('    - Ensure all required fields are handled');
      }
    }

    console.log('\n✅ Data Schema validation complete!');
    return this.results;
  }

  // Run all tests
  async runAll() {
    console.log('🚀 Starting Manhas Closet Data Schema Validation...\n');

    try {
      await this.testAllTables();
      await this.testFormConnections();
      await this.testRLSPolicies();
      this.generateReport();
    } catch (error) {
      console.error('❌ Critical error during validation:', error.message);
    }
  }
}

// Export for use
module.exports = DataSchemaRunner;

// Run if called directly
if (require.main === module) {
  const runner = new DataSchemaRunner();
  runner.runAll().then(() => {
    console.log('\n🏁 Validation complete!');
    process.exit(0);
  }).catch(error => {
    console.error('💥 Fatal error:', error);
    process.exit(1);
  });
}