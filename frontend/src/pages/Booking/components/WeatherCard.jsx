import React from "react";
import { motion } from "framer-motion";
import { Sun, Cloud, CloudRain } from "lucide-react";
import useWeather from "../../../hooks/useWeather";

export default function WeatherCard({ location, mapLink, date, darkMode }) {
    const { weather, loading } = useWeather({ location, mapLink, date });

    return (
        <motion.div
            className={`p-4 rounded-lg shadow ${darkMode ? "bg-gray-800" : "bg-white"}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
        >
            <div className="flex items-center justify-between">
                <h4 className="font-semibold">Weather</h4>
                <div className="text-sm opacity-80">{date}</div>
            </div>

            {loading ? (
                <p className="mt-2 text-sm opacity-75">Loading weather...</p>
            ) : weather ? (
                <motion.div
                    key={weather.date}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.4 }}
                    className="mt-3 flex flex-col items-center justify-center"
                >
                    {weather.icon && (
                        <motion.img
                            src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`}
                            alt={weather.description || "Weather"}
                            className="mt-2 mx-auto"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.3, duration: 0.4 }}
                        />
                    )}
                    <div className="flex gap-4">
                        <div className="text-4xl">
                            {weather.icon?.includes("09") ? (
                                <CloudRain size={28} />
                            ) : weather.icon?.includes("02") ? (
                                <>
                                    <Sun size={26} /> <Cloud size={26} />
                                </>
                            ) : (
                                <Sun size={30} />
                            )}
                        </div>

                        <div>
                            <div className="text-2xl font-bold">{weather.temp ?? "—"}°C</div>
                            <div className="text-sm opacity-80 capitalize">
                                {weather.description ?? "—"}
                            </div>
                        </div>
                    </div>
                </motion.div>
            ) : (
                <p className="mt-2 text-sm opacity-75">No weather data available</p>
            )}
        </motion.div>
    );
}
