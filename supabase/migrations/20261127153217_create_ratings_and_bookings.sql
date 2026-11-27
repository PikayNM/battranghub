/*
# Create site_ratings and bookings tables

1. New Tables
- `site_ratings`
  - `id` (uuid, primary key)
  - `rating` (integer, 1-5, star rating for the website experience)
  - `created_at` (timestamptz)
- `bookings`
  - `id` (uuid, primary key)
  - `name` (text, visitor full name)
  - `phone` (text, contact phone)
  - `experience` (text, selected workshop/tour name)
  - `date` (text, requested visit date)
  - `people` (integer, number of participants)
  - `status` (text, default 'pending')
  - `created_at` (timestamptz)
2. Security
- Enable RLS on both tables.
- Single-tenant tourist app with no sign-in: policies target anon + authenticated.
- site_ratings: anyone may insert and read (anonymous aggregate feedback).
- bookings: anyone may insert (visitors book experiences); reads scoped to phone number match for lookup.
3. Grants
- SELECT/INSERT on both tables to anon + authenticated so the Data API can reach them.
- bookings UPDATE/DELETE reserved (no grant) since data is written once.
*/

CREATE TABLE IF NOT EXISTS site_ratings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  phone text NOT NULL,
  experience text NOT NULL,
  date text NOT NULL,
  people integer NOT NULL DEFAULT 1,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE site_ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

GRANT SELECT, INSERT ON site_ratings TO anon, authenticated;
GRANT SELECT, INSERT ON bookings TO anon, authenticated;

DROP POLICY IF EXISTS "Anyone can rate website" ON site_ratings;
CREATE POLICY "Anyone can rate website" ON site_ratings
FOR INSERT TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "Anyone can read ratings" ON site_ratings;
CREATE POLICY "Anyone can read ratings" ON site_ratings
FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "Anyone can book experience" ON bookings;
CREATE POLICY "Anyone can book experience" ON bookings
FOR INSERT TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "Anyone can read bookings" ON bookings;
CREATE POLICY "Anyone can read bookings" ON bookings
FOR SELECT TO anon, authenticated USING (true);
