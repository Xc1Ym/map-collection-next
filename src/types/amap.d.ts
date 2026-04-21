declare namespace AMap {
  class Map {
    constructor(container: string | HTMLElement, options?: Record<string, unknown>);
    destroy(): void;
    add(overlay: unknown): void;
    remove(overlay: unknown): void;
    clearMap(): void;
    setCenter(position: [number, number]): void;
  }
  class Marker {
    constructor(options: Record<string, unknown>);
    on(event: string, callback: () => void): void;
  }
  class LngLat {
    constructor(lng: number, lat: number);
  }
}

interface Window {
  _AMapSecurityConfig: { securityJsCode?: string; serviceHost?: string };
}
