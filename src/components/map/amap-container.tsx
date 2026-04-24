"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useMemo, useRef, useState, useImperativeHandle, forwardRef } from "react";
import AMapLoader from "@amap/amap-jsapi-loader";
import type { Business } from "@/types";

interface AmapContainerProps {
  businesses: Business[];
  activeBusiness?: Business | null;
  onMarkerClick?: (business: Business) => void;
}

export interface AmapContainerRef {
  flyTo: (business: Business) => void;
}

function createMarkerContent(name: string, color: string, visited: boolean, rating: number | null, isActive: boolean) {
  const border = visited ? "border:2px solid #00B894;" : "";
  const activeStyle = isActive ? "transform:scale(1.15);box-shadow:0 6px 20px rgba(0,0,0,0.25);" : "";
  const badge = visited
    ? `<span style="font-size:10px;font-weight:normal;opacity:0.9;">${rating != null ? "★".repeat(Math.round(rating)) : "已吃"}</span>`
    : "";
  return `<div style="background-color:${color};padding:8px 14px;border-radius:10px;color:white;font-size:14px;font-weight:bold;min-width:80px;text-align:center;box-shadow:0 4px 12px rgba(0,0,0,0.15);transition:all 0.2s;${border}${activeStyle}">${name}${badge ? "<br/>" + badge : ""}</div>`;
}

export const AmapContainer = forwardRef<AmapContainerRef, AmapContainerProps>(
  function AmapContainer({ businesses, activeBusiness, onMarkerClick }, ref) {
    const mapRef = useRef<HTMLDivElement>(null);
    const mapInstanceRef = useRef<AMap.Map | null>(null);
    const markersRef = useRef<Map<number, any>>(new Map());
    const onMarkerClickRef = useRef(onMarkerClick);
    const AMapRef = useRef<any>(null);
    const [loaded, setLoaded] = useState(false);

    const businessKey = useMemo(
      () => businesses.map((b) => `${b.id}:${b.tags.map((t) => t.color).join(",")}:${b.visited}:${b.rating}`).join("|"),
      [businesses]
    );

    useEffect(() => {
      onMarkerClickRef.current = onMarkerClick;
    }, [onMarkerClick]);

    useImperativeHandle(ref, () => ({
      flyTo(business: Business) {
        const map = mapInstanceRef.current;
        if (!map) return;
        (map as any).setZoom(16);
        map.setCenter([business.longitude, business.latitude]);
      },
    }));

    // Initialize map
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
            plugins: ["AMap.Geolocation"],
          });
        })
        .then((AMap) => {
          if (destroyed || !AMap || !mapRef.current) return;

          AMapRef.current = AMap;
          const map = new AMap.Map(mapRef.current, {
            zoom: 13,
            center: [108.946465, 34.261433],
            resizeEnable: true,
          });
          mapInstanceRef.current = map;

          // Geolocation: just show a blue dot, don't zoom/pan
          try {
            const geolocation = new AMap.Geolocation({
              enableHighAccuracy: true,
              timeout: 8000,
              zoomToAccuracy: false,
              showButton: false,
              showMarker: true,
              showCircle: true,
              panToLocation: false,
            });
            map.addControl(geolocation);
            geolocation.getCurrentPosition();
          } catch {
            // Geolocation not supported, ignore
          }

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
        AMapRef.current = null;
        setLoaded(false);
      };
    }, []);

    // Update markers (no clustering — direct add for reliability)
    useEffect(() => {
      const map = mapInstanceRef.current;
      const AMap = AMapRef.current;
      if (!map || !loaded || !AMap) return;

      // Clear old markers
      markersRef.current.forEach((m) => map.remove(m));
      markersRef.current.clear();

      const isActive = (id: number) => activeBusiness?.id === id;

      // Create and add markers
      businesses.forEach((b) => {
        const mainColor = b.tags[0]?.color || "#E8614D";
        const marker = new AMap.Marker({
          position: new AMap.LngLat(b.longitude, b.latitude),
          title: b.name,
          content: createMarkerContent(b.name, mainColor, b.visited, b.rating, isActive(b.id)),
          offset: new AMap.Pixel(-50, -30),
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
        markersRef.current.set(b.id, marker);
      });

      if (businesses.length > 0 && !activeBusiness) {
        map.setCenter([businesses[0].longitude, businesses[0].latitude]);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [businessKey, loaded]);

    // Update active marker highlight
    useEffect(() => {
      const map = mapInstanceRef.current;
      if (!map || !loaded) return;

      markersRef.current.forEach((marker, id) => {
        const b = businesses.find((biz) => biz.id === id);
        if (!b) return;
        const mainColor = b.tags[0]?.color || "#E8614D";
        marker.setContent(createMarkerContent(b.name, mainColor, b.visited, b.rating, activeBusiness?.id === id) as any);
      });
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeBusiness?.id, loaded]);

    return (
      <div
        ref={mapRef}
        className="w-full h-[50vh] lg:h-[600px] rounded-2xl border border-white/60 shadow-[0_1px_3px_rgba(0,0,0,0.06)] overflow-hidden"
      />
    );
  }
);
