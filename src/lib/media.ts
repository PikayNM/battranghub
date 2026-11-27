import { supabase } from './supabase';

export const MEDIA_BUCKET = 'media';

export const SLOTS = {
  slide1: 'slide-1',
  slide2: 'slide-2',
  slide3: 'slide-3',
  slide4: 'slide-4',
  slide5: 'slide-5',
} as const;

export const SLOT_IDS = Object.values(SLOTS) as string[];

export type MediaMap = Record<string, string>;

export interface SlideContent {
  badge: string;
  titleVi: string;
  titleEn: string;
  subVi: string;
  subEn: string;
}

export type ContentMap = Record<string, SlideContent>;

export async function fetchSlideContent(): Promise<ContentMap> {
  const { data, error } = await supabase
    .from('slide_content')
    .select('slot, badge, title_vi, title_en, sub_vi, sub_en');
  if (error) throw error;
  const map: ContentMap = {};
  for (const row of data ?? []) {
    map[row.slot] = {
      badge: row.badge ?? '',
      titleVi: row.title_vi ?? '',
      titleEn: row.title_en ?? '',
      subVi: row.sub_vi ?? '',
      subEn: row.sub_en ?? '',
    };
  }
  return map;
}

export async function saveSlideContent(
  slot: string,
  content: SlideContent,
): Promise<void> {
  const { error } = await supabase.from('slide_content').upsert({
    slot,
    badge: content.badge || null,
    title_vi: content.titleVi || null,
    title_en: content.titleEn || null,
    sub_vi: content.subVi || null,
    sub_en: content.subEn || null,
    updated_at: new Date().toISOString(),
  });
  if (error) throw error;
}

export type SpotKind = 'spot' | 'workshop' | 'parking' | 'service';

export interface MapSpot {
  key: string;
  nameVi: string;
  nameEn: string;
  kind: SpotKind;
  descVi: string;
  descEn: string;
  hours: string | null;
  lat: number;
  lng: number;
}

export async function fetchMapSpots(): Promise<MapSpot[]> {
  const { data, error } = await supabase
    .from('map_spots')
    .select('key, name_vi, name_en, kind, desc_vi, desc_en, hours, lat, lng')
    .order('key');
  if (error) throw error;
  return (data ?? []).map((row) => ({
    key: row.key,
    nameVi: row.name_vi,
    nameEn: row.name_en,
    kind: (row.kind as SpotKind) ?? 'spot',
    descVi: row.desc_vi ?? '',
    descEn: row.desc_en ?? '',
    hours: row.hours,
    lat: row.lat,
    lng: row.lng,
  }));
}

export async function saveMapSpot(spot: MapSpot): Promise<void> {
  const { error } = await supabase.from('map_spots').upsert({
    key: spot.key,
    name_vi: spot.nameVi,
    name_en: spot.nameEn,
    kind: spot.kind,
    desc_vi: spot.descVi,
    desc_en: spot.descEn,
    hours: spot.hours || null,
    lat: spot.lat,
    lng: spot.lng,
    updated_at: new Date().toISOString(),
  });
  if (error) throw error;
}

export async function deleteMapSpot(key: string): Promise<void> {
  const { error } = await supabase.from('map_spots').delete().eq('key', key);
  if (error) throw error;
}

const PUBLIC_URL_CACHE = new Map<string, string>();

export function getMediaUrl(path: string): string {
  const cached = PUBLIC_URL_CACHE.get(path);
  if (cached) return cached;
  const { data } = supabase.storage
    .from(MEDIA_BUCKET)
    .getPublicUrl(path);
  const url = data.publicUrl;
  PUBLIC_URL_CACHE.set(path, url);
  return url;
}

export async function fetchMediaSlots(): Promise<Record<string, string>> {
  const { data, error } = await supabase
    .from('media_slots')
    .select('slot, path');
  if (error) throw error;
  const map: Record<string, string> = {};
  for (const row of data ?? []) {
    map[row.slot] = getMediaUrl(row.path);
  }
  return map;
}

export async function uploadImage(
  slot: string,
  file: File,
): Promise<string> {
  if (!file.type.startsWith('image/')) {
    throw new Error('INVALID_TYPE');
  }
  if (file.size > 5 * 1024 * 1024) {
    throw new Error('TOO_LARGE');
  }
  const ext = file.type === 'image/png' ? 'png' : file.type === 'image/webp' ? 'webp' : 'jpg';
  const path = `slots/${slot}-${Date.now()}.${ext}`;
  const { error: upErr } = await supabase.storage
    .from(MEDIA_BUCKET)
    .upload(path, file, {
      contentType: file.type,
      cacheControl: '3600',
      upsert: false,
    });
  if (upErr) throw upErr;
  const { error: dbErr } = await supabase
    .from('media_slots')
    .upsert({ slot, path, updated_at: new Date().toISOString() });
  if (dbErr) throw dbErr;
  return getMediaUrl(path);
}

export async function deleteMedia(slot: string): Promise<void> {
  const { data, error } = await supabase
    .from('media_slots')
    .select('path')
    .eq('slot', slot)
    .maybeSingle();
  if (error) throw error;
  if (data?.path) {
    await supabase.storage.from(MEDIA_BUCKET).remove([data.path]);
    await supabase.from('media_slots').delete().eq('slot', slot);
  }
}
