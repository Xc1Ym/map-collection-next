"use client";

import { useEffect, useRef } from "react";
import AMapLoader from "@amap/amap-jsapi-loader";

interface AmapPickerProps {
  onLocationSelect: (lng: number, lat: number, address: string) => void;
}

export function AmapPicker({ onLocationSelect }: AmapPickerProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<AMap.Map | null>(null);
  const markerRef = useRef<AMap.Marker | null>(null);
  const callbackRef = useRef(onLocationSelect);

  useEffect(() => {
    callbackRef.current = onLocationSelect;
  });

  useEffect(() => {
    const el = mapRef.current;
    if (!el) return;

    let destroyed = false;

    fetch("/api/amap/config")
      .then((r) => r.json())
      .then((config) => {
        if (destroyed) return;

        window._AMapSecurityConfig = { serviceHost: window.location.origin + "/_AMapService" };

        return AMapLoader.load({
          key: config.apiKey,
          version: config.mapVersion,
        });
      })
      .then((AMap) => {
        if (destroyed || !AMap || !mapRef.current) return;

        const map = new AMap.Map(mapRef.current, {
          zoom: 13,
          center: [108.946465, 34.261433],
        });

        map.on("click", async (e: { lnglat: { getLng: () => number; getLat: () => number } }) => {
          const lng = e.lnglat.getLng();
          const lat = e.lnglat.getLat();

          if (markerRef.current) map.remove(markerRef.current);
          markerRef.current = new AMap.Marker({
            position: new AMap.LngLat(lng, lat),
          });
          map.add(markerRef.current!);
          map.setCenter([lng, lat]);

          try {
            const res = await fetch(`/api/amap/geocode?lng=${lng}&lat=${lat}`);
            const data = await res.json();
            const addr = data.data?.formatted_address || "";
            callbackRef.current(lng, lat, addr);
          } catch {
            callbackRef.current(lng, lat, "");
          }
        });

        mapInstanceRef.current = map;
      })
      .catch((err) => {
        console.error("AMap Picker load failed:", err);
      });

    return () => {
      destroyed = true;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.destroy();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  return (
    <div>
      <div
        ref={mapRef}
        className="w-full h-[40vh] md:h-[300px] rounded-lg border-2 border-gray-200 overflow-hidden"
      />
      <p className="text-sm text-gray-500 mt-2">
        点击地图选择位置，或使用搜索功能
      </p>
    </div>
  );
}
