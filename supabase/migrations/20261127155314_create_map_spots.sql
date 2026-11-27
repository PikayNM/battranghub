/*
# Create map_spots table with seeded Bat Trang locations

1. New Tables
- `map_spots`
  - `key` (text, primary key; stable id like 'museum', 'market' or generated for new spots)
  - `name_vi` (text, Vietnamese name)
  - `name_en` (text, English name)
  - `kind` (text, one of 'spot' | 'workshop' | 'parking' | 'service')
  - `desc_vi` (text, short Vietnamese description)
  - `desc_en` (text, short English description)
  - `hours` (text, opening hours, may be null)
  - `lat` (double precision, latitude)
  - `lng` (double precision, longitude)
  - `updated_at` (timestamptz)
2. Security
- Enable RLS; no-sign-in app managed from the hidden PIN-protected panel,
  so policies target anon + authenticated with USING/WITH CHECK (true).
- Grant SELECT, INSERT, UPDATE, DELETE to anon + authenticated.
3. Data
- Seeds the 12 default Bat Trang points of interest (museum, market, wharf,
  communal house, workshops, parking, restrooms, info point, ATM) referenced
  by stable keys so re-running the migration never duplicates rows.
*/

CREATE TABLE IF NOT EXISTS map_spots (
  key text PRIMARY KEY,
  name_vi text NOT NULL,
  name_en text NOT NULL,
  kind text NOT NULL DEFAULT 'spot',
  desc_vi text NOT NULL DEFAULT '',
  desc_en text NOT NULL DEFAULT '',
  hours text,
  lat double precision NOT NULL,
  lng double precision NOT NULL,
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE map_spots ENABLE ROW LEVEL SECURITY;

GRANT SELECT, INSERT, UPDATE, DELETE ON map_spots TO anon, authenticated;

DROP POLICY IF EXISTS "map_spots_select" ON map_spots;
CREATE POLICY "map_spots_select" ON map_spots
FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "map_spots_insert" ON map_spots;
CREATE POLICY "map_spots_insert" ON map_spots
FOR INSERT TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "map_spots_update" ON map_spots;
CREATE POLICY "map_spots_update" ON map_spots
FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "map_spots_delete" ON map_spots;
CREATE POLICY "map_spots_delete" ON map_spots
FOR DELETE TO anon, authenticated USING (true);

INSERT INTO map_spots (key, name_vi, name_en, kind, desc_vi, desc_en, hours, lat, lng) VALUES
  ('museum', 'Bảo tàng gốm Bát Tràng', 'Bat Trang Ceramic Museum', 'spot', 'Kiến trúc hình bàn tay độc đáo, trưng bày cổ vật 700 năm', 'Hand-shaped architecture with 700-year relics', '8:00–17:00', 20.9729, 105.9160),
  ('market', 'Chợ gốm trung tâm', 'Central Pottery Market', 'spot', 'Hơn 100 gian hàng chén bát, lọ hoa, mở cửa mỗi ngày', '100+ stalls of ceramics, open daily', '8:00–18:00', 20.9767, 105.9150),
  ('wharf', 'Bến sông Hồng cổ', 'Ancient Red River Wharf', 'spot', 'Bến phà trăm năm tuổi, đẹp nhất lúc chiều tà', 'Century-old ferry wharf, best at sunset', NULL, 20.9805, 105.9140),
  ('temple', 'Đình làng Bát Tràng', 'Bat Trang Communal House', 'spot', 'Di tích thờ tổ nghề gốm của làng', 'Historic shrine of the pottery ancestors', '8:00–17:00', 20.9775, 105.9120),
  ('workshop-gia-nguyen', 'Gốm Gia Nguyên Thuật', 'Gia Nguyen Thuat Workshop', 'workshop', 'Xoay mâm + vẽ gốm cùng nghệ nhân', 'Wheel + painting class with artisans', '8:00–18:00', 20.9752, 105.9117),
  ('workshop-herico', 'Xưởng gốm Herico', 'Herico Pottery Studio', 'workshop', 'Trải nghiệm gia đình, có khu vẽ tranh gốm', 'Family-friendly ceramic painting zone', '8:30–18:00', 20.9740, 105.9100),
  ('workshop-lo-cu', 'Lò gốm cũ Chợ Mới', 'Old Kiln Cho Moi', 'workshop', 'Lò gốm cổ & mô hình lò bầu truyền thống', 'Traditional kiln model & photo spot', '8:00–17:30', 20.9760, 105.9090),
  ('parking-market', 'Bãi đỗ xe cổng chợ', 'Market Gate Parking', 'parking', '10.000đ/xe máy, 30.000đ/ô tô', '10k motorbike, 30k car', NULL, 20.9778, 105.9163),
  ('parking-river', 'Bãi đỗ xe bến sông', 'Riverside Parking', 'parking', 'Gần bến phà, dễ đầy vào cuối tuần', 'Near the wharf, fills on weekends', NULL, 20.9800, 105.9155),
  ('restroom', 'Nhà vệ sinh công cộng', 'Public Restrooms', 'service', 'Cạnh chợ gốm, miễn phí', 'Next to pottery market, free', NULL, 20.9770, 105.9155),
  ('info-point', 'Điểm hỗ trợ du khách', 'Visitor Info Point', 'service', 'Bản đồ miễn phí, wifi, cất hành lý', 'Free maps, wifi, luggage storage', '8:00–18:00', 20.9755, 105.9138),
  ('atm', 'ATM & đổi tiền', 'ATM & Currency Exchange', 'service', 'Đầu đường vào làng', 'At the village entrance', NULL, 20.9785, 105.9110)
ON CONFLICT (key) DO NOTHING;
