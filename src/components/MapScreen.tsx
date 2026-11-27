import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin, ParkingSquare, Wrench, ConciergeBell, Navigation, Crosshair, Clock, X } from 'lucide-react';
import type { MapSpot, SpotKind } from '@/lib/media';
import type { Lang, Translations } from '@/lib/i18n';

interface Props {
  t: Translations;
  lang: Lang;
  spots: MapSpot[];
}

const kindIcon = {
  spot: MapPin,
  workshop: Wrench,
  parking: ParkingSquare,
  service: ConciergeBell,
};

const kindColor: Record<SpotKind, string> = {
  spot: '#7D3A17',
  workshop: '#D2845E',
  parking: '#B3954F',
  service: '#4E3E23',
};

function makeMarkerIcon(kind: SpotKind, active: boolean) {
  const color = kindColor[kind] ?? kindColor.spot;
  const size = active ? 40 : 32;
  return L.divIcon({
    className: '',
    html: `<span style="display:flex;align-items:center;justify-content:center;width:${size}px;height:${size}px;border-radius:9999px;background:${color};border:3px solid #FBF3E4;box-shadow:0 3px 8px rgba(51,23,5,.45);transform:translate(-50%,-50%);${
      active ? 'outline:4px solid rgba(251,194,63,.8);outline-offset:2px;' : ''
   }">
      <svg width="${Math.round(size * 0.45)}" height="${Math.round(size * 0.45)}" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
    </span>`,
    iconSize: [size, size],
    iconAnchor: [0, 0],
  });
}

const userIcon = L.divIcon({
  className: '',
  html: `<span style="display:flex;align-items:center;justify-content:center;width:22px;height:22px;border-radius:9999px;background:#2563EB;border:3px solid #FFFFFF;box-shadow:0 0 0 8px rgba(37,99,235,.25);transform:translate(-50%,-50%)"></span>`,
  iconSize: [22, 22],
  iconAnchor: [0, 0],
});

const BAT_TRANG: [number, number] = [20.9765, 105.9135];

export default function MapScreen({ t, lang, spots }: Props) {
  const [filter, setFilter] = useState<SpotKind | 'all'>('all');
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [userPos, setUserPos] = useState<[number, number] | null>(null);
  const [locating, setLocating] = useState(false);
  const [locError, setLocError] = useState(false);

  const mapRef = useRef<L.Map | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const markersRef = useRef<Record<string, L.Marker>>({});
  const userMarkerRef = useRef<L.Marker | null>(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    const map = L.map(containerRef.current, {
      center: BAT_TRANG,
      zoom: 16,
      zoomControl: false,
      attributionControl: true,
    });
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(map);
    L.control.zoom({ position: 'bottomright' }).addTo(map);
    mapRef.current = map;
    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  const visible = spots.filter((s) => filter === 'all' || s.kind === filter);
  const selected = spots.find((s) => s.key === selectedKey) ?? null;

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    for (const marker of Object.values(markersRef.current)) {
      map.removeLayer(marker);
    }
    markersRef.current = {};
    for (const spot of visible) {
      const marker = L.marker([spot.lat, spot.lng], {
        icon: makeMarkerIcon(spot.kind, spot.key === selectedKey),
      }).addTo(map);
      marker.on('click', () => setSelectedKey(spot.key));
      markersRef.current[spot.key] = marker;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible, selectedKey]);

  useEffect(() => {
    if (!selected || !mapRef.current) return;
    mapRef.current.flyTo([selected.lat, selected.lng], 17, { duration: 0.8 });
  }, [selectedKey]);

  const focusSpot = (key: string) => setSelectedKey(key);

  const locate = () => {
    if (!navigator.geolocation) {
      setLocError(true);
      return;
    }
    setLocating(true);
    setLocError(false);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const p: [number, number] = [pos.coords.latitude, pos.coords.longitude];
        setUserPos(p);
        setLocating(false);
        mapRef.current?.flyTo(p, 17, { duration: 0.8 });
        if (userMarkerRef.current) {
          userMarkerRef.current.remove();
        }
        userMarkerRef.current = L.marker(p, { icon: userIcon }).addTo(mapRef.current!);
      },
      () => {
        setLocating(false);
        setLocError(true);
      },
      { enableHighAccuracy: true, timeout: 10000 },
    );
  };

  const filters: { key: SpotKind | 'all'; label: string }[] = [
    { key: 'all', label: t.filterAll },
    { key: 'spot', label: t.filterSpot },
    { key: 'workshop', label: t.filterWorkshop },
    { key: 'parking', label: t.filterParking },
  ];

  const spotName = (s: MapSpot) => (lang === 'vi' ? s.nameVi : s.nameEn);
  const spotDesc = (s: MapSpot) => (lang === 'vi' ? s.descVi : s.descEn);

  return (
    <div className="flex flex-col gap-4 px-4 pb-6 pt-3">
      <header className="animate-fade-up">
        <h1 className="text-xl font-extrabold text-white">{t.mapTitle}</h1>
        <p className="text-xs text-cream/80">{t.mapSubtitle}</p>
      </header>

      <div className="no-scrollbar -mx-1 flex animate-fade-up gap-2 overflow-x-auto px-1 pb-1" style={{ animationDelay: '60ms' }}>
        {filters.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={`shrink-0 rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-all active:scale-95 ${
              filter === key
                ? 'border-cream bg-terra-500 text-white shadow-md shadow-terra-900/40'
                : 'border-cream/50 bg-terra-900/20 text-cream/90 hover:bg-terra-900/35'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="relative animate-fade-up overflow-hidden rounded-2xl border border-cream/80 shadow-lg shadow-terra-900/30" style={{ animationDelay: '120ms' }}>
        <div ref={containerRef} className="h-[340px] w-full bg-sand-100" />

        <button
          onClick={locate}
          disabled={locating}
          aria-label={t.myLocation}
          className={`absolute right-3 top-3 z-[500] flex items-center gap-1.5 rounded-full border border-cream/70 px-3 py-2 text-[11px] font-bold shadow-lg transition active:scale-95 ${
            locating ? 'bg-terra-900/60 text-cream/70' : 'bg-terra-700 text-white hover:bg-terra-600'
          }`}
        >
          <Crosshair className={`h-3.5 w-3.5 ${locating ? 'animate-spin' : ''}`} />
          {locating ? '...' : t.myLocation}
        </button>

        {locError && (
          <div className="absolute inset-x-3 top-14 z-[500] rounded-lg bg-red-900/85 px-3 py-2 text-[11px] font-semibold text-red-100 backdrop-blur">
            {t.locationDenied}
          </div>
        )}

        {selected && (
          <div className="absolute inset-x-3 bottom-3 z-[500] animate-fade-up rounded-2xl border border-cream/70 bg-terra-700/95 p-3 shadow-xl backdrop-blur">
            <button
              onClick={() => setSelectedKey(null)}
              aria-label="Đóng"
              className="absolute right-2 top-2 rounded-full bg-white/15 p-1 transition hover:bg-white/30"
            >
              <X className="h-3.5 w-3.5 text-white" />
            </button>
            <h3 className="pr-6 text-sm font-bold text-white">{spotName(selected)}</h3>
            <p className="mt-0.5 text-[11px] leading-relaxed text-cream/85">{spotDesc(selected)}</p>
            {selected.hours && (
              <p className="mt-1 flex items-center gap-1 text-[10px] font-bold text-yellow-300">
                <Clock className="h-3 w-3" /> {selected.hours}
              </p>
            )}
            <a
              href={`https://www.google.com/maps/dir/?api=1&destination=${selected.lat},${selected.lng}`}
              target="_blank"
              rel="noreferrer"
              className="mt-2 flex items-center justify-center gap-1.5 rounded-lg bg-yellow-400 py-2 text-[11px] font-extrabold text-terra-900 transition hover:bg-yellow-300 active:scale-95"
            >
              <Navigation className="h-3.5 w-3.5" /> {t.directions}
            </a>
          </div>
        )}
      </div>

      <ul className="flex animate-fade-up flex-col gap-2" style={{ animationDelay: '180ms' }}>
        {visible.map((spot) => {
          const Icon = kindIcon[spot.kind] ?? MapPin;
          return (
            <li key={spot.key}>
              <button
                onClick={() => focusSpot(spot.key)}
                className={`flex w-full items-center gap-3 rounded-xl border p-3 text-left backdrop-blur-sm transition-all active:scale-[0.98] ${
                  selectedKey === spot.key
                    ? 'border-yellow-400 bg-terra-500/50 shadow-lg'
                    : 'border-cream/70 bg-terra-500/25 hover:bg-terra-500/40'
                }`}
              >
                <span
                  className="rounded-lg p-1.5"
                  style={{ backgroundColor: kindColor[spot.kind] ?? kindColor.spot }}
                >
                  <Icon className="h-4 w-4 text-white" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-bold text-white">{spotName(spot)}</span>
                  <span className="block truncate text-[11px] text-cream/75">{spotDesc(spot)}</span>
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
