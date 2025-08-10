-- Row Level Security Policies for Manhas Closet

-- Helper function to check user role
CREATE OR REPLACE FUNCTION auth.user_role() RETURNS user_role AS $$
  SELECT role FROM users WHERE id = auth.uid()
$$ LANGUAGE sql SECURITY DEFINER;

-- Helper function to check if user has permission
CREATE OR REPLACE FUNCTION auth.has_permission(required_roles user_role[]) RETURNS boolean AS $$
  SELECT auth.user_role() = ANY(required_roles)
$$ LANGUAGE sql SECURITY DEFINER;

-- Users table policies
CREATE POLICY "Users can view their own profile" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Store owners and admins can view all users" ON users
  FOR SELECT USING (auth.has_permission(ARRAY['store_owner', 'system_admin']::user_role[]));

CREATE POLICY "Store owners and admins can update users" ON users
  FOR UPDATE USING (auth.has_permission(ARRAY['store_owner', 'system_admin']::user_role[]));

CREATE POLICY "Users can update their own profile" ON users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "System admins can insert users" ON users
  FOR INSERT WITH CHECK (auth.has_permission(ARRAY['system_admin']::user_role[]));

-- Categories table policies
CREATE POLICY "Everyone can view active categories" ON categories
  FOR SELECT USING (is_active = true);

CREATE POLICY "Managers and above can view all categories" ON categories
  FOR SELECT USING (auth.has_permission(ARRAY['store_owner', 'store_manager', 'system_admin']::user_role[]));

CREATE POLICY "Managers and above can manage categories" ON categories
  FOR ALL USING (auth.has_permission(ARRAY['store_owner', 'store_manager', 'system_admin']::user_role[]));

-- Products table policies
CREATE POLICY "Everyone can view active products" ON products
  FOR SELECT USING (is_active = true);

CREATE POLICY "Managers and above can view all products" ON products
  FOR SELECT USING (auth.has_permission(ARRAY['store_owner', 'store_manager', 'system_admin']::user_role[]));

CREATE POLICY "Managers and above can manage products" ON products
  FOR INSERT WITH CHECK (auth.has_permission(ARRAY['store_owner', 'store_manager', 'system_admin']::user_role[]));

CREATE POLICY "Managers and above can update products" ON products
  FOR UPDATE USING (auth.has_permission(ARRAY['store_owner', 'store_manager', 'system_admin']::user_role[]));

CREATE POLICY "Only store owners can delete products" ON products
  FOR DELETE USING (auth.has_permission(ARRAY['store_owner']::user_role[]));

-- Product variants table policies
CREATE POLICY "Everyone can view product variants" ON product_variants
  FOR SELECT USING (true);

CREATE POLICY "Managers and above can manage product variants" ON product_variants
  FOR ALL USING (auth.has_permission(ARRAY['store_owner', 'store_manager', 'system_admin']::user_role[]));

-- Stock movements table policies
CREATE POLICY "Staff and above can view stock movements" ON stock_movements
  FOR SELECT USING (auth.has_permission(ARRAY['store_owner', 'store_manager', 'sales_staff', 'accountant', 'system_admin']::user_role[]));

CREATE POLICY "Managers and above can create stock movements" ON stock_movements
  FOR INSERT WITH CHECK (auth.has_permission(ARRAY['store_owner', 'store_manager', 'system_admin']::user_role[]));

CREATE POLICY "Only store owners can delete stock movements" ON stock_movements
  FOR DELETE USING (auth.has_permission(ARRAY['store_owner']::user_role[]));

-- Invoices table policies
CREATE POLICY "Staff and above can view invoices" ON invoices
  FOR SELECT USING (auth.has_permission(ARRAY['store_owner', 'store_manager', 'sales_staff', 'accountant', 'system_admin']::user_role[]));

CREATE POLICY "Sales staff and above can create invoices" ON invoices
  FOR INSERT WITH CHECK (auth.has_permission(ARRAY['store_owner', 'store_manager', 'sales_staff', 'system_admin']::user_role[]));

CREATE POLICY "Sales staff can update their own invoices" ON invoices
  FOR UPDATE USING (
    created_by = auth.uid() OR 
    auth.has_permission(ARRAY['store_owner', 'store_manager', 'system_admin']::user_role[])
  );

CREATE POLICY "Only managers and above can delete invoices" ON invoices
  FOR DELETE USING (auth.has_permission(ARRAY['store_owner', 'store_manager', 'system_admin']::user_role[]));

-- Invoice items table policies
CREATE POLICY "Staff and above can view invoice items" ON invoice_items
  FOR SELECT USING (auth.has_permission(ARRAY['store_owner', 'store_manager', 'sales_staff', 'accountant', 'system_admin']::user_role[]));

CREATE POLICY "Sales staff and above can manage invoice items" ON invoice_items
  FOR ALL USING (auth.has_permission(ARRAY['store_owner', 'store_manager', 'sales_staff', 'system_admin']::user_role[]));

-- Payments table policies
CREATE POLICY "Staff and above can view payments" ON payments
  FOR SELECT USING (auth.has_permission(ARRAY['store_owner', 'store_manager', 'sales_staff', 'accountant', 'system_admin']::user_role[]));

CREATE POLICY "Sales staff and above can create payments" ON payments
  FOR INSERT WITH CHECK (auth.has_permission(ARRAY['store_owner', 'store_manager', 'sales_staff', 'system_admin']::user_role[]));

CREATE POLICY "Managers and above can update payments" ON payments
  FOR UPDATE USING (auth.has_permission(ARRAY['store_owner', 'store_manager', 'system_admin']::user_role[]));

CREATE POLICY "Only store owners can delete payments" ON payments
  FOR DELETE USING (auth.has_permission(ARRAY['store_owner']::user_role[]));

-- Cash registers table policies
CREATE POLICY "Staff and above can view cash registers" ON cash_registers
  FOR SELECT USING (auth.has_permission(ARRAY['store_owner', 'store_manager', 'sales_staff', 'accountant', 'system_admin']::user_role[]));

CREATE POLICY "Managers and above can manage cash registers" ON cash_registers
  FOR ALL USING (auth.has_permission(ARRAY['store_owner', 'store_manager', 'system_admin']::user_role[]));

-- Employees table policies
CREATE POLICY "Managers and above can view employees" ON employees
  FOR SELECT USING (auth.has_permission(ARRAY['store_owner', 'store_manager', 'accountant', 'system_admin']::user_role[]));

CREATE POLICY "Store owners and admins can manage employees" ON employees
  FOR ALL USING (auth.has_permission(ARRAY['store_owner', 'system_admin']::user_role[]));

-- Employee documents table policies
CREATE POLICY "Managers and above can view employee documents" ON employee_documents
  FOR SELECT USING (auth.has_permission(ARRAY['store_owner', 'store_manager', 'accountant', 'system_admin']::user_role[]));

CREATE POLICY "Store owners and admins can manage employee documents" ON employee_documents
  FOR ALL USING (auth.has_permission(ARRAY['store_owner', 'system_admin']::user_role[]));

-- Attendance table policies
CREATE POLICY "Managers and above can view attendance" ON attendance
  FOR SELECT USING (auth.has_permission(ARRAY['store_owner', 'store_manager', 'accountant', 'system_admin']::user_role[]));

CREATE POLICY "Managers and above can manage attendance" ON attendance
  FOR ALL USING (auth.has_permission(ARRAY['store_owner', 'store_manager', 'system_admin']::user_role[]));

-- Salaries table policies
CREATE POLICY "Accountants and above can view salaries" ON salaries
  FOR SELECT USING (auth.has_permission(ARRAY['store_owner', 'accountant', 'system_admin']::user_role[]));

CREATE POLICY "Accountants and above can manage salaries" ON salaries
  FOR ALL USING (auth.has_permission(ARRAY['store_owner', 'accountant', 'system_admin']::user_role[]));

-- Salary deductions table policies
CREATE POLICY "Accountants and above can view salary deductions" ON salary_deductions
  FOR SELECT USING (auth.has_permission(ARRAY['store_owner', 'accountant', 'system_admin']::user_role[]));

CREATE POLICY "Accountants and above can manage salary deductions" ON salary_deductions
  FOR ALL USING (auth.has_permission(ARRAY['store_owner', 'accountant', 'system_admin']::user_role[]));

-- Salary bonuses table policies
CREATE POLICY "Accountants and above can view salary bonuses" ON salary_bonuses
  FOR SELECT USING (auth.has_permission(ARRAY['store_owner', 'accountant', 'system_admin']::user_role[]));

CREATE POLICY "Accountants and above can manage salary bonuses" ON salary_bonuses
  FOR ALL USING (auth.has_permission(ARRAY['store_owner', 'accountant', 'system_admin']::user_role[]));

-- Audit logs table policies
CREATE POLICY "Store owners and admins can view audit logs" ON audit_logs
  FOR SELECT USING (auth.has_permission(ARRAY['store_owner', 'system_admin']::user_role[]));

-- No insert, update, or delete policies for audit_logs as they should only be managed by triggers

-- Create a function to handle user creation
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'sales_staff'::user_role)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Create function to update user last login
CREATE OR REPLACE FUNCTION update_user_last_login()
RETURNS trigger AS $$
BEGIN
  UPDATE public.users
  SET last_login = NOW()
  WHERE id = NEW.id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for user login
CREATE TRIGGER on_auth_user_login
  AFTER UPDATE OF last_sign_in_at ON auth.users
  FOR EACH ROW
  WHEN (OLD.last_sign_in_at IS DISTINCT FROM NEW.last_sign_in_at)
  EXECUTE FUNCTION update_user_last_login();

-- Create function to automatically update invoice totals
CREATE OR REPLACE FUNCTION update_invoice_totals()
RETURNS trigger AS $$
DECLARE
  invoice_subtotal DECIMAL(10,2);
  invoice_tax DECIMAL(10,2);
  invoice_total DECIMAL(10,2);
BEGIN
  -- Calculate subtotal from invoice items
  SELECT COALESCE(SUM(total_amount), 0)
  INTO invoice_subtotal
  FROM invoice_items
  WHERE invoice_id = COALESCE(NEW.invoice_id, OLD.invoice_id);
  
  -- Calculate tax (15% VAT)
  invoice_tax := invoice_subtotal * 0.15;
  
  -- Calculate total
  SELECT subtotal + tax_amount - discount_amount
  INTO invoice_total
  FROM invoices
  WHERE id = COALESCE(NEW.invoice_id, OLD.invoice_id);
  
  -- Update invoice
  UPDATE invoices
  SET 
    subtotal = invoice_subtotal,
    tax_amount = invoice_tax,
    total_amount = invoice_subtotal + invoice_tax - discount_amount,
    updated_at = NOW()
  WHERE id = COALESCE(NEW.invoice_id, OLD.invoice_id);
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create triggers for invoice total updates
CREATE TRIGGER update_invoice_totals_on_item_change
  AFTER INSERT OR UPDATE OR DELETE ON invoice_items
  FOR EACH ROW EXECUTE FUNCTION update_invoice_totals();

-- Create function to update product stock on invoice completion
CREATE OR REPLACE FUNCTION update_stock_on_invoice_completion()
RETURNS trigger AS $$
BEGIN
  -- Only process when invoice status changes to 'completed'
  IF NEW.status = 'completed' AND OLD.status != 'completed' THEN
    -- Update product stock quantities
    UPDATE products
    SET stock_quantity = stock_quantity - item_quantities.total_quantity
    FROM (
      SELECT 
        ii.product_id,
        SUM(ii.quantity) as total_quantity
      FROM invoice_items ii
      WHERE ii.invoice_id = NEW.id
      GROUP BY ii.product_id
    ) as item_quantities
    WHERE products.id = item_quantities.product_id;
    
    -- Update variant stock quantities if applicable
    UPDATE product_variants
    SET stock_quantity = stock_quantity - item_quantities.total_quantity
    FROM (
      SELECT 
        ii.variant_id,
        SUM(ii.quantity) as total_quantity
      FROM invoice_items ii
      WHERE ii.invoice_id = NEW.id AND ii.variant_id IS NOT NULL
      GROUP BY ii.variant_id
    ) as item_quantities
    WHERE product_variants.id = item_quantities.variant_id;
    
    -- Create stock movement records
    INSERT INTO stock_movements (product_id, variant_id, movement_type, quantity, reason, reference_id, reference_type, created_by)
    SELECT 
      ii.product_id,
      ii.variant_id,
      'out'::stock_movement_type,
      ii.quantity,
      'Sale - Invoice: ' || NEW.invoice_number,
      NEW.id,
      'sale',
      NEW.created_by
    FROM invoice_items ii
    WHERE ii.invoice_id = NEW.id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for stock updates on invoice completion
CREATE TRIGGER update_stock_on_invoice_completion
  AFTER UPDATE ON invoices
  FOR EACH ROW EXECUTE FUNCTION update_stock_on_invoice_completion();