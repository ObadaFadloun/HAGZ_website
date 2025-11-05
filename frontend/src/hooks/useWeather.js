import { useEffect, useState } from "react";
import api from "../utils/api"; // ✅ using your configured instance

export default function useWeather({ location, mapLink, date }) {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🗺️ Extract coordinates from Google Maps link
  const extractCoords = (url) => {
    if (!url) return { lat: null, lon: null };
    const match =
      url.match(/@([-.\d]+),([-.\d]+)/) || url.match(/q=([-.\d]+),([-.\d]+)/);
    if (match) {
      return { lat: parseFloat(match[1]), lon: parseFloat(match[2]) };
    }
    return { lat: null, lon: null };
  };

  useEffect(() => {
    const { lat, lon } = extractCoords(mapLink);
    if ((!lat || !lon) && !location) return;
    if (!date) return;

    const fetchWeather = async () => {
      try {
        setLoading(true);

        const { data } = await api.get("/weather", {
          params: { location, lat, lon, date },
        });

        setWeather(data);
      } catch (err) {
        console.error("Error fetching weather:", err);
        setWeather(null);
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, [mapLink, location, date]); // ✅ refetch automatically when date changes

  return { weather, loading };
}
