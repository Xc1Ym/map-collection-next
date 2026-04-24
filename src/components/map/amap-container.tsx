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
    const clusterRef = useRef<any>(null);
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
            plugins: ["AMap.Geolocation", "AMap.MarkerCluster"],
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

          // Auto geolocation
          const geolocation = new AMap.Geolocation({
            enableHighAccuracy: true,
            timeout: 8000,
            zoomToAccuracy: true,
          });
          map.addControl(geolocation);
          geolocation.getCurrentPosition();

          setLoaded(true);
        })
        .catch((err) => {
          console.error("AMap load failed:", err);
        });

      return () => {
        destroyed = true;
        if (clusterRef.current) {
          clusterRef.current.setMap(null);
          clusterRef.current = null;
        }
        if (mapInstanceRef.current) {
          mapInstanceRef.current.destroy();
          mapInstanceRef.current = null;
        }
        AMapRef.current = null;
        setLoaded(false);
      };
    }, []);

    // Update markers + cluster
    useEffect(() => {
      const map = mapInstanceRef.current;
      const AMap = AMapRef.current;
      if (!map || !loaded || !AMap) return;

      // Clear old cluster
      if (clusterRef.current) {
        clusterRef.current.setMap(null);
        clusterRef.current = null;
      }

      // Clear old markers
      markersRef.current.forEach((m) => map.remove(m));
      markersRef.current.clear();

      const isActive = (id: number) => activeBusiness?.id === id;

      // Create markers
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

        markersRef.current.set(b.id, marker);
      });

      const markerArray = Array.from(markersRef.current.values());

      // Use MarkerCluster when many businesses, plain markers when few
      if (markerArray.length > 10 && AMap.MarkerCluster) {
        const cluster = new AMap.MarkerCluster(map, markerArray, {
          gridSize: 60,
          maxZoom: 16,
          renderMarker: (context: any) => {
            const data = context.clusterData?.[0];
            if (data) {
              const b = businesses.find((biz) => biz.id === data.id);
              if (b) {
                const mainColor = b.tags[0]?.color || "#E8614D";
                context.marker.setContent(createMarkerContent(b.name, mainColor, b.visited, b.rating, isActive(b.id)));
                context.marker.setOffset(new AMap.Pixel(-50, -30));
              }
            }
          },
          renderClusterMarker: (context: any) => {
            const count = context.count;
            const size = Math.max(36, Math.min(56, 36 + count * 2));
            context.marker.setContent(
              `<div style="width:${size}px;height:${size}px;border-radius:50%;background:linear-gradient(135deg,#E8614D,#FF9F43);color:white;display:flex;align-items:center;justify-content:center;font-weight:bold;font-size:${size > 44 ? 16 : 13}px;box-shadow:0 4px 12px rgba(232,97,77,0.35);">${count}</div>`
            );
            context.marker.setOffset(new AMap.Pixel(-size / 2, -size / 2));
          },
        });
        clusterRef.current = cluster;
      } else {
        markerArray.forEach((m) => map.add(m));
      }

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
