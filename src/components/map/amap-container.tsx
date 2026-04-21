"use client";

import { useEffect, useRef, useState } from "react";
import AMapLoader from "@amap/amap-jsapi-loader";
import type { Business } from "@/types";

interface AmapContainerProps {
  businesses: Business[];
  onMarkerClick?: (business: Business) => void;
}

export function AmapContainer({ businesses, onMarkerClick }: AmapContainerProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<AMap.Map | null>(null);
  const markersRef = useRef<AMap.Marker[]>([]);
  const onMarkerClickRef = useRef(onMarkerClick);
  const [loaded, setLoaded] = useState(false);

  // 保持 callback ref 最新，不触发 re-init
  onMarkerClickRef.current = onMarkerClick;

  useEffect(() => {
    const el = mapRef.current;
    if (!el) return;

    let destroyed = false;

    fetch("/api/amap/config")
      .then((r) => r.json())
      .then((config) => {
        if (destroyed) return;

        // 安全密钥必须在 load 之前设置
        window._AMapSecurityConfig = {
          securityJsCode: config.securityJsCode,
        };

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
        mapInstanceRef.current = map;
        setLoaded(true);
      })
      .catch((err) => {
        console.error("AMap load failed:", err);
      });

    return () => {
      destroyed = true;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.destroy();
        mapInstanceRef.current = null;
      }
      setLoaded(false);
    };
  }, []);

  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !loaded) return;

    markersRef.current.forEach((m) => map.remove(m));
    markersRef.current = [];

    businesses.forEach((b) => {
      const mainColor = b.tags[0]?.color || "#3498db";
      const marker = new AMap.Marker({
        position: new AMap.LngLat(b.longitude, b.latitude),
        title: b.name,
        content: `<div style="background-color:${mainColor};padding:8px 12px;border-radius:6px;color:white;font-size:14px;font-weight:bold;min-width:80px;text-align:center;box-shadow:0 2px 8px rgba(0,0,0,0.3);">${b.name}</div>`,
      });

      marker.on("click", () => {
        const cb = onMarkerClickRef.current;
        if (cb) {
          cb(b);
        } else {
          window.open(
            `https://uri.amap.com/marker?position=${b.longitude},${b.latitude}&name=${encodeURIComponent(b.name)}&coordinate=gaode&callnative=1`,
            "_blank"
          );
        }
      });

      map.add(marker);
      markersRef.current.push(marker);
    });

    if (businesses.length > 0) {
      map.setCenter([businesses[0].longitude, businesses[0].latitude]);
    }
  }, [businesses, loaded]);

  return (
    <div
      ref={mapRef}
      className="w-full rounded-xl border border-gray-200 overflow-hidden"
      style={{ height: "600px" }}
    />
  );
}
