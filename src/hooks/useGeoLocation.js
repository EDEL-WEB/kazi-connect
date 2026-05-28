import { useState, useRef, useCallback } from 'react';

const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

function cacheKey(lat, lng) {
  return `geo_v2_${lat.toFixed(4)}_${lng.toFixed(4)}`;
}

function getCached(lat, lng) {
  try {
    const raw = sessionStorage.getItem(cacheKey(lat, lng));
    if (!raw) return null;
    const { data, ts } = JSON.parse(raw);
    if (Date.now() - ts > CACHE_TTL) return null;
    return data;
  } catch { return null; }
}

function setCache(lat, lng, data) {
  try {
    sessionStorage.setItem(cacheKey(lat, lng), JSON.stringify({ data, ts: Date.now() }));
  } catch {}
}

async function reverseGeocode(lat, lng) {
  const cached = getCached(lat, lng);
  if (cached) return cached;

  const res = await fetch(
    `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
  );
  const json = await res.json();
  const a = json.address || {};

  // Nominatim maps Kenyan admin levels unusually:
  // city = ward, county = sub-county, state = county
  const ward      = a.village || a.suburb || a.neighbourhood || a.quarter || a.hamlet || a.city || '';
  const subcounty = a.city_district || a.county_district || a.town || a.county || '';
  const county    = a.state_district || a.state || '';

  // Build readable label: 2–3 most specific unique parts
  const location = [...new Set([ward, subcounty, county].filter(Boolean))].join(', ');

  const result = { location, ward, subcounty, county };
  setCache(lat, lng, result);
  return result;
}

export function useGeoLocation() {
  const [coords, setCoords] = useState(null);
  const [locating, setLocating] = useState(false);
  const [watching, setWatching] = useState(false);
  const watchIdRef = useRef(null);

  const applyPosition = useCallback(async (lat, lng) => {
    try {
      const geo = await reverseGeocode(lat, lng);
      const result = { latitude: lat, longitude: lng, ...geo };
      setCoords(result);
      return result;
    } catch {
      const result = { latitude: lat, longitude: lng, location: `${lat.toFixed(5)}, ${lng.toFixed(5)}`, ward: '', subcounty: '', county: '' };
      setCoords(result);
      return result;
    }
  }, []);

  const getOnce = useCallback(() => {
    if (!navigator.geolocation) return;
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        await applyPosition(pos.coords.latitude, pos.coords.longitude);
        setLocating(false);
      },
      () => setLocating(false),
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, [applyPosition]);

  const startWatch = useCallback((onUpdate) => {
    if (!navigator.geolocation || watchIdRef.current != null) return;
    setWatching(true);
    watchIdRef.current = navigator.geolocation.watchPosition(
      async (pos) => {
        const result = await applyPosition(pos.coords.latitude, pos.coords.longitude);
        onUpdate?.(result);
      },
      () => {},
      { enableHighAccuracy: true, maximumAge: 5000 }
    );
  }, [applyPosition]);

  const stopWatch = useCallback(() => {
    if (watchIdRef.current != null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
    setWatching(false);
  }, []);

  return { coords, locating, watching, getOnce, startWatch, stopWatch };
}
