/*
# Create slide_content table for editable banner text

1. New Tables
- `slide_content`
  - `slot` (text, primary key; stable slot id 'slide-1' … 'slide-5')
  - `badge` (text, optional small tag label such as 'QUẢNG CÁO' / 'NỔI BẬT')
  - `title_vi` (text, banner title in Vietnamese)
  - `title_en` (text, banner title in English)
  - `sub_vi` (text, banner subtitle in Vietnamese)
  - `sub_en` (text, banner subtitle in English)
  - `updated_at` (timestamptz)
2. Security
- Enable RLS; the site is a no-sign-in app managed from the hidden panel,
  so policies target anon + authenticated with USING/WITH CHECK (true).
- Grant SELECT, INSERT, UPDATE, DELETE to anon + authenticated.
3. Notes
- Rows referenced by stable slot ids; safe on rebuild. Empty fields fall back
  to the built-in default banner copy in the app.
*/

CREATE TABLE IF NOT EXISTS slide_content (
  slot text PRIMARY KEY,
  badge text,
  title_vi text,
  title_en text,
  sub_vi text,
  sub_en text,
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE slide_content ENABLE ROW LEVEL SECURITY;

GRANT SELECT, INSERT, UPDATE, DELETE ON slide_content TO anon, authenticated;

DROP POLICY IF EXISTS "slide_content_select" ON slide_content;
CREATE POLICY "slide_content_select" ON slide_content
FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "slide_content_insert" ON slide_content;
CREATE POLICY "slide_content_insert" ON slide_content
FOR INSERT TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "slide_content_update" ON slide_content;
CREATE POLICY "slide_content_update" ON slide_content
FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "slide_content_delete" ON slide_content;
CREATE POLICY "slide_content_delete" ON slide_content
FOR DELETE TO anon, authenticated USING (true);
