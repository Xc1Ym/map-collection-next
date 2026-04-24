"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import AMapLoader from "@amap/amap-jsapi-loader";
import type { Business } from "@/types";

interface AmapContainerProps {
  businesses: Business[];
  onMarkerClick?: (business: Business) => void;
}

function createMarkerContent(name: string, color: string, visited: boolean, rating: number | null) {
  const border = visited ? "border:2px solid #22c55e;" : "";
  const badge = visited
    ? `<span style="font-size:10px;font-weight:normal;opacity:0.9;">${rating != null ? "★".repeat(Math.round(rating)) : "已吃"}</span>`
    : "";
  return `<div style="background-color:${color};padding:8px 12px;border-radius:6px;color:white;font-size:14px;font-weight:bold;min-width:80px;text-align:center;box-shadow:0 2px 8px rgba(0,0,0,0.3);${border}">${name}${badge ? "<br/>" + badge : ""}</div>`;
}

export function AmapContainer({ businesses, onMarkerClick }: AmapContainerProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<AMap.Map | null>(null);
  const markersRef = useRef<AMap.Marker[]>([]);
  const onMarkerClickRef = useRef(onMarkerClick);
  const [loaded, setLoaded] = useState(false);

  // Stable key for businesses list to detect actual changes
  const businessKey = useMemo(
    () => businesses.map((b) => `${b.id}:${b.tags.map((t) => t.color).join(",")}:${b.visited}:${b.rating}`).join("|"),
    [businesses]
  );

  useEffect(() => {
    onMarkerClickRef.current = onMarkerClick;
  });

  useEffect(() => {
    const el = mapRef.current;
    if (!el) return;

    let destroyed = false;

    fetch("/api/amap/config")
      .then((r) => r.json())
      .then((config) => {
        if (destroyed) return;

        window._AMapSecurityConfig = {
          serviceHost: window.location.origin + "/_AMapService",
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

    // Remove old markers
    markersRef.current.forEach((m) => map.remove(m));
    markersRef.current = [];

    // Create new markers
    businesses.forEach((b) => {
      const mainColor = b.tags[0]?.color || "#3498db";
      const marker = new AMap.Marker({
        position: new AMap.LngLat(b.longitude, b.latitude),
        title: b.name,
        content: createMarkerContent(b.name, mainColor, b.visited, b.rating),
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [businessKey, loaded]);

  return (
    <div
      ref={mapRef}
      className="w-full h-[50vh] lg:h-[600px] rounded-xl border border-gray-200 overflow-hidden"
    />
  );
}
