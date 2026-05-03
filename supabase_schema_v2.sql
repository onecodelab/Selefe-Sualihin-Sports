-- ============================================================
-- V2 SCHEMA: Admin Schedule Management
-- Run this AFTER the initial schema has been applied.
-- ============================================================

-- 1. Add 'role' column to profiles so we can identify admins
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin'));

-- 2. Create schedule table: defines which slots are open on which dates
-- The admin toggles these ON/OFF. Only "open" slots appear to users.
CREATE TABLE IF NOT EXISTS schedule (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  date TEXT NOT NULL,             -- e.g. "Sat, May 10"
  time_slot TEXT NOT NULL,        -- e.g. "08:00 AM - 10:00 AM"
  is_available BOOLEAN DEFAULT true,
  blocked_reason TEXT,            -- e.g. "Maintenance", "Private Event", "Ramadan hours"
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  UNIQUE(date, time_slot)         -- Prevent duplicate entries for the same date+slot
);

-- 3. Enable RLS on schedule
ALTER TABLE schedule ENABLE ROW LEVEL SECURITY;

-- Clean up existing policies
DROP POLICY IF EXISTS "Anyone can view schedule" ON schedule;
DROP POLICY IF EXISTS "Admins can manage schedule" ON schedule;
DROP POLICY IF EXISTS "Admins can update bookings" ON bookings;

-- 4. Everyone can READ the schedule (users need to see availability)
CREATE POLICY "Anyone can view schedule" ON schedule
  FOR SELECT USING (true);

-- 5. Only admins can INSERT/UPDATE/DELETE schedule entries
CREATE POLICY "Admins can manage schedule" ON schedule
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- 6. Allow admins to view ALL bookings (update existing policy)
DROP POLICY IF EXISTS "Admins can view all bookings" ON bookings;
CREATE POLICY "Admins can view all bookings" ON bookings
  FOR SELECT USING (
    auth.uid() = user_id
    OR EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- 7. Allow admins to UPDATE booking status (Confirm/Cancel)
CREATE POLICY "Admins can update bookings" ON bookings
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- 8. Add payment_status to bookings for tracking
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS payment_status TEXT DEFAULT 'unpaid' CHECK (payment_status IN ('unpaid', 'paid'));

-- ============================================================
-- TO MAKE YOURSELF AN ADMIN:
-- Replace 'YOUR_USER_ID' with your actual user UUID from auth.users
-- UPDATE profiles SET role = 'admin' WHERE id = 'YOUR_USER_ID';
-- ============================================================
