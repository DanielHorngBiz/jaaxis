-- Create order_status enum
CREATE TYPE public.order_status AS ENUM (
  'pending', 'processing', 'on-hold', 
  'completed', 'cancelled', 'refunded', 'failed'
);

-- Create orders table (NO RLS for dev/testing)
CREATE TABLE public.orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number text NOT NULL,
  status order_status NOT NULL DEFAULT 'pending',
  billing_name text NOT NULL,
  billing_phone text,
  billing_email text,
  billing_address text,
  shipping_name text,
  shipping_phone text,
  shipping_email text,
  shipping_address text,
  items jsonb NOT NULL DEFAULT '[]'::jsonb,
  metadata jsonb DEFAULT '{}'::jsonb,
  order_total numeric(10,2) NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Create trigger for updated_at
CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON public.orders
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Insert 10 mock WooCommerce-style orders
INSERT INTO public.orders (order_number, status, billing_name, billing_phone, billing_email, billing_address, shipping_name, shipping_phone, shipping_email, shipping_address, items, metadata, order_total, created_at) VALUES
-- Completed orders with tracking
('#1001', 'completed', 'John Smith', '+1 555-0101', 'john.smith@email.com', '123 Main St, New York, NY 10001', 'John Smith', '+1 555-0101', 'john.smith@email.com', '456 Oak Ave, Brooklyn, NY 11201', 
  '[{"name": "Wireless Headphones", "qty": 1, "price": 79.99, "total": 79.99}, {"name": "Phone Case", "qty": 2, "price": 19.99, "total": 39.98}]'::jsonb,
  '{"tracking_number": "1Z999AA10123456784", "carrier": "UPS", "shipped_at": "2024-01-15T10:30:00Z"}'::jsonb,
  119.97, '2024-01-10T14:30:00Z'),

('#1002', 'completed', 'Sarah Johnson', '+1 555-0102', 'sarah.j@email.com', '789 Pine Rd, Los Angeles, CA 90001', 'Sarah Johnson', '+1 555-0102', 'sarah.j@email.com', '789 Pine Rd, Los Angeles, CA 90001',
  '[{"name": "Smart Watch", "qty": 1, "price": 299.99, "total": 299.99}, {"name": "Watch Band", "qty": 3, "price": 24.99, "total": 74.97}]'::jsonb,
  '{"tracking_number": "9400111899223033005", "carrier": "USPS", "shipped_at": "2024-01-18T09:15:00Z"}'::jsonb,
  374.96, '2024-01-12T09:45:00Z'),

-- Processing orders
('#1003', 'processing', 'Michael Chen', '+1 555-0103', 'mchen@email.com', '321 Elm St, Chicago, IL 60601', 'Michael Chen', '+1 555-0103', 'mchen@email.com', '321 Elm St, Chicago, IL 60601',
  '[{"name": "Laptop Stand", "qty": 1, "price": 89.99, "total": 89.99}, {"name": "USB-C Hub", "qty": 1, "price": 49.99, "total": 49.99}]'::jsonb,
  '{}'::jsonb,
  139.98, '2024-01-20T16:20:00Z'),

('#1004', 'processing', 'Emily Davis', '+1 555-0104', 'emily.d@email.com', '654 Maple Ave, Houston, TX 77001', 'Robert Davis', '+1 555-0105', 'robert.d@email.com', '987 Cedar Ln, Austin, TX 78701',
  '[{"name": "Mechanical Keyboard", "qty": 1, "price": 149.99, "total": 149.99}]'::jsonb,
  '{}'::jsonb,
  149.99, '2024-01-21T11:00:00Z'),

-- Pending orders
('#1005', 'pending', 'David Wilson', '+1 555-0106', 'dwilson@email.com', '147 Birch Blvd, Phoenix, AZ 85001', 'David Wilson', '+1 555-0106', 'dwilson@email.com', '147 Birch Blvd, Phoenix, AZ 85001',
  '[{"name": "Wireless Mouse", "qty": 2, "price": 39.99, "total": 79.98}, {"name": "Mouse Pad XL", "qty": 1, "price": 29.99, "total": 29.99}]'::jsonb,
  '{}'::jsonb,
  109.97, '2024-01-22T08:30:00Z'),

('#1006', 'pending', 'Lisa Brown', '+1 555-0107', 'lisa.b@email.com', '258 Walnut Way, Philadelphia, PA 19101', 'Lisa Brown', '+1 555-0107', 'lisa.b@email.com', '258 Walnut Way, Philadelphia, PA 19101',
  '[{"name": "Webcam HD", "qty": 1, "price": 79.99, "total": 79.99}, {"name": "Ring Light", "qty": 1, "price": 44.99, "total": 44.99}, {"name": "Tripod", "qty": 1, "price": 34.99, "total": 34.99}]'::jsonb,
  '{}'::jsonb,
  159.97, '2024-01-22T15:45:00Z'),

-- On-hold order
('#1007', 'on-hold', 'James Taylor', '+1 555-0108', 'jtaylor@email.com', '369 Spruce St, San Antonio, TX 78201', 'James Taylor', '+1 555-0108', 'jtaylor@email.com', '369 Spruce St, San Antonio, TX 78201',
  '[{"name": "Gaming Headset", "qty": 1, "price": 129.99, "total": 129.99}, {"name": "Headset Stand", "qty": 1, "price": 24.99, "total": 24.99}]'::jsonb,
  '{"hold_reason": "Payment verification required"}'::jsonb,
  154.98, '2024-01-19T13:20:00Z'),

-- Cancelled order
('#1008', 'cancelled', 'Amanda Martinez', '+1 555-0109', 'amanda.m@email.com', '741 Ash Dr, San Diego, CA 92101', 'Amanda Martinez', '+1 555-0109', 'amanda.m@email.com', '741 Ash Dr, San Diego, CA 92101',
  '[{"name": "Bluetooth Speaker", "qty": 1, "price": 69.99, "total": 69.99}]'::jsonb,
  '{"cancelled_reason": "Customer requested cancellation", "cancelled_at": "2024-01-17T10:00:00Z"}'::jsonb,
  69.99, '2024-01-16T09:00:00Z'),

-- Refunded order
('#1009', 'refunded', 'Christopher Lee', '+1 555-0110', 'chris.lee@email.com', '852 Hickory Ct, Dallas, TX 75201', 'Christopher Lee', '+1 555-0110', 'chris.lee@email.com', '852 Hickory Ct, Dallas, TX 75201',
  '[{"name": "Portable Charger", "qty": 2, "price": 49.99, "total": 99.98}]'::jsonb,
  '{"refund_reason": "Item defective", "refunded_at": "2024-01-14T16:30:00Z", "refund_amount": 99.98}'::jsonb,
  99.98, '2024-01-08T12:15:00Z'),

-- Failed order
('#1010', 'failed', 'Jennifer White', '+1 555-0111', 'jen.white@email.com', '963 Chestnut Pl, San Jose, CA 95101', 'Jennifer White', '+1 555-0111', 'jen.white@email.com', '963 Chestnut Pl, San Jose, CA 95101',
  '[{"name": "Noise Cancelling Earbuds", "qty": 1, "price": 199.99, "total": 199.99}]'::jsonb,
  '{"failure_reason": "Payment declined"}'::jsonb,
  199.99, '2024-01-21T18:00:00Z');