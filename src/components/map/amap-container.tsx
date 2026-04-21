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
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    fetch("/api/amap/config")
      .then((r) => r.json())
      .then((config) => {
        window._AMapSecurityConfig = {
          securityJsCode: config.apiKey,
        };

        AMapLoader.load({
          key: config.apiKey,
          version: config.mapVersion,
        }).then((AMap) => {
          const map = new AMap.Map(mapRef.current!, {
            zoom: 13,
            center: [108.946465, 34.261433],
          });
          mapInstanceRef.current = map;
          setLoaded(true);
        });
      });

    return () => {
      mapInstanceRef.current?.destroy();
      mapInstanceRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !loaded) return;

    // 清除旧标记
    markersRef.current.forEach((m) => map.remove(m));
    markersRef.current = [];

    // 添加新标记
    businesses.forEach((b) => {
      const mainColor = b.tags[0]?.color || "#3498db";

      const marker = new AMap.Marker({
        position: new AMap.LngLat(b.longitude, b.latitude),
        title: b.name,
        content: `<div style="background-color:${mainColor};padding:8px 12px;border-radius:6px;color:white;font-size:14px;font-weight:bold;min-width:80px;text-align:center;box-shadow:0 2px 8px rgba(0,0,0,0.3);">${b.name}</div>`,
      });

      marker.on("click", () => {
        if (onMarkerClick) {
          onMarkerClick(b);
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

    // 调整视野
    if (businesses.length > 0) {
      map.setCenter([businesses[0].longitude, businesses[0].latitude]);
    }
  }, [businesses, loaded, onMarkerClick]);

  return (
    <div
      ref={mapRef}
      className="w-full rounded-xl border border-gray-200 overflow-hidden"
      style={{ height: "600px" }}
    />
  );
}
