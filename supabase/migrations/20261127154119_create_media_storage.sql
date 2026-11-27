/*
# Create media storage bucket and media_slots table

1. New Tables
- `media_slots`
  - `slot` (text, primary key; stable slot id like 'slide-1', 'card-map')
  - `path` (text, storage object path inside the 'media' bucket)
  - `updated_at` (timestamptz)
2. Storage
- Create public bucket `media` with a 5 MB size limit and an image-only MIME allowlist
  (jpeg/png/webp), enforced server-side by the bucket itself.
- storage.objects policies scoped to bucket_id = 'media' for anon + authenticated:
  this is a no-sign-in tourist app; the bucket constraints are the real validation.
3. Security
- Enable RLS on `media_slots`; policies allow full CRUD to anon + authenticated
  because the site is intentionally public and managed from the hidden admin panel.
- Grant SELECT/INSERT/UPDATE/DELETE on media_slots to anon + authenticated.
4. Notes
- Bucket is public so images render via plain <img> URLs; only site imagery lives here.
- Rows are referenced by stable slot ids, safe on rebuild.
*/

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('media', 'media', true, 5242880, ARRAY['image/jpeg','image/png','image/webp'])
ON CONFLICT (id) DO UPDATE
SET file_size_limit = EXCLUDED.file_size_limit,
    allowed_mime_types = EXCLUDED.allowed_mime_types;

CREATE TABLE IF NOT EXISTS media_slots (
  slot text PRIMARY KEY,
  path text NOT NULL,
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE media_slots ENABLE ROW LEVEL SECURITY;

GRANT SELECT, INSERT, UPDATE, DELETE ON media_slots TO anon, authenticated;

DROP POLICY IF EXISTS "media_slots_select" ON media_slots;
CREATE POLICY "media_slots_select" ON media_slots
FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "media_slots_insert" ON media_slots;
CREATE POLICY "media_slots_insert" ON media_slots
FOR INSERT TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "media_slots_update" ON media_slots;
CREATE POLICY "media_slots_update" ON media_slots
FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "media_slots_delete" ON media_slots;
CREATE POLICY "media_slots_delete" ON media_slots
FOR DELETE TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "media_bucket_select" ON storage.objects;
CREATE POLICY "media_bucket_select" ON storage.objects
FOR SELECT TO anon, authenticated
USING (bucket_id = 'media');

DROP POLICY IF EXISTS "media_bucket_insert" ON storage.objects;
CREATE POLICY "media_bucket_insert" ON storage.objects
FOR INSERT TO anon, authenticated
WITH CHECK (bucket_id = 'media');

DROP POLICY IF EXISTS "media_bucket_update" ON storage.objects;
CREATE POLICY "media_bucket_update" ON storage.objects
FOR UPDATE TO anon, authenticated
USING (bucket_id = 'media') WITH CHECK (bucket_id = 'media');

DROP POLICY IF EXISTS "media_bucket_delete" ON storage.objects;
CREATE POLICY "media_bucket_delete" ON storage.objects
FOR DELETE TO anon, authenticated
USING (bucket_id = 'media');
