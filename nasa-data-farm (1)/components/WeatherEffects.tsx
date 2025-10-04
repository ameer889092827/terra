import React from 'react';
import { NasaData } from '../types';

const RAIN_THRESHOLD = 15; // mm
const RAIN_DROP_COUNT = 70;
const SUN_GLARE_THRESHOLD = 800; // W/m^2
const FOG_HUMIDITY_THRESHOLD = 90;
const FOG_TEMP_THRESHOLD = 15;

const WeatherEffects: React.FC<{ nasaData: NasaData }> = ({ nasaData }) => {
    const showRain = nasaData.precipitation > RAIN_THRESHOLD;
    const showSun = nasaData.solarIrradiance > SUN_GLARE_THRESHOLD;
    const showFog = nasaData.relativeHumidity > FOG_HUMIDITY_THRESHOLD && nasaData.temperature < FOG_TEMP_THRESHOLD;

    return (
        <>
            {showRain && (
                <div className="absolute inset-0 overflow-hidden pointer-events-none z-10">
                    {Array.from({ length: RAIN_DROP_COUNT }).map((_, i) => (
                        <div
                            key={i}
                            className="absolute bg-blue-300/50 w-0.5 h-6 animate-rain"
                            style={{
                                left: `${Math.random() * 100}%`,
                                animationDelay: `${Math.random() * 2}s`,
                                animationDuration: `${0.5 + Math.random() * 0.5}s`,
                            }}
                        ></div>
                    ))}
                </div>
            )}
            {showSun && (
                <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-radial-sun pointer-events-none z-10 opacity-60 animate-pulse-sun"></div>
            )}
            {showFog && <div className="animate-fog"></div>}
        </>
    );
};

export default WeatherEffects;