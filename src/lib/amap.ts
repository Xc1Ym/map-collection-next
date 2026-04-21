const SERVER_API_KEY = process.env.AMAP_SERVER_API_KEY || "";
const BASE_URL = "https://restapi.amap.com/v3";

async function amapFetch(url: string, retries = 3): Promise<unknown> {
  let lastError: unknown;
  for (let i = 0; i < retries; i++) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 10000);

      const res = await fetch(url, { signal: controller.signal });
      clearTimeout(timeout);

      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (err) {
      lastError = err;
      if (i < retries - 1) {
        await new Promise((r) => setTimeout(r, 1000 * Math.pow(2, i)));
      }
    }
  }
  throw lastError;
}

export async function searchPlace(keyword: string, city = "") {
  const url = `${BASE_URL}/place/text?keywords=${encodeURIComponent(keyword)}&city=${encodeURIComponent(city)}&output=json&key=${SERVER_API_KEY}`;
  const data = (await amapFetch(url)) as {
    status: string;
    pois: Array<{ name: string; address: string; location: string }>;
  };

  if (data.status === "1" && data.pois?.length) {
    return data.pois.map((poi) => {
      const [lng, lat] = poi.location.split(",").map(Number);
      return { name: poi.name, address: poi.address, longitude: lng, latitude: lat };
    });
  }
  return [];
}

export async function reverseGeocode(lng: number, lat: number) {
  const url = `${BASE_URL}/geocode/regeo?location=${lng},${lat}&key=${SERVER_API_KEY}&radius=1000&extensions=base`;
  const data = (await amapFetch(url)) as {
    status: string;
    regeocode?: { formatted_address: string };
  };

  if (data.status === "1" && data.regeocode) {
    return data.regeocode.formatted_address;
  }
  return null;
}

export async function geocode(address: string) {
  const url = `${BASE_URL}/geocode/geo?address=${encodeURIComponent(address)}&key=${SERVER_API_KEY}`;
  const data = (await amapFetch(url)) as {
    status: string;
    geocodes: Array<{ location: string; formatted_address: string }>;
  };

  if (data.status === "1" && data.geocodes?.length) {
    const [lng, lat] = data.geocodes[0].location.split(",").map(Number);
    return { latitude: lat, longitude: lng, formatted_address: data.geocodes[0].formatted_address };
  }
  return null;
}
