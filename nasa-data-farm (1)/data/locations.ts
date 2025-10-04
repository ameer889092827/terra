import { Location } from '../types';

export const LOCATIONS: Location[] = [
    {
        id: 'central_valley_usa',
        name: 'Central Valley, USA',
        description: 'A fertile plain with hot, dry summers and mild, wet winters. A global agricultural powerhouse, but water management is critical.',
        baseNasaData: {
            soilMoisture: 60,
            temperature: 18,
            precipitation: 5,
            solarIrradiance: 500,
            windSpeed: 10,
            ndvi: 0.6,
            relativeHumidity: 65,
        },
        seasonalModifiers: {
            Spring: { temp: 20, precipitation: 10, solar: 600, humidity: 60 },
            Summer: { temp: 32, precipitation: 1, solar: 850, humidity: 40 },
            Fall: { temp: 22, precipitation: 8, solar: 500, humidity: 55 },
            Winter: { temp: 10, precipitation: 20, solar: 300, humidity: 75 },
        },
        availableCrops: ['corn', 'wheat', 'tomato', 'strawberry', 'soybean', 'carrot'],
        soilDistribution: { loamy: 0.6, sandy: 0.3, clay: 0.1 },
    },
    {
        id: 'kyoto_japan',
        name: 'Kyoto Prefecture, Japan',
        description: 'A humid, subtropical region with hot, wet summers and cool winters. Famous for its tea and rice paddies, this area requires managing high humidity.',
        baseNasaData: {
            soilMoisture: 75,
            temperature: 15,
            precipitation: 20,
            solarIrradiance: 400,
            windSpeed: 8,
            ndvi: 0.7,
            relativeHumidity: 75,
        },
        seasonalModifiers: {
            Spring: { temp: 18, precipitation: 25, solar: 550, humidity: 70 },
            Summer: { temp: 28, precipitation: 40, solar: 650, humidity: 85 },
            Fall: { temp: 20, precipitation: 20, solar: 450, humidity: 75 },
            Winter: { temp: 8, precipitation: 10, solar: 300, humidity: 65 },
        },
        availableCrops: ['rice', 'tea', 'soybean', 'lettuce', 'carrot', 'strawberry'],
        soilDistribution: { loamy: 0.5, sandy: 0.1, clay: 0.4 },
    },
    {
        id: 'andes_peru',
        name: 'Andes Foothills, Peru',
        description: 'A high-altitude, mountainous region with cool temperatures and a distinct wet and dry season. The ancestral home of potatoes and quinoa.',
        baseNasaData: {
            soilMoisture: 55,
            temperature: 12,
            precipitation: 15,
            solarIrradiance: 650,
            windSpeed: 15,
            ndvi: 0.5,
            relativeHumidity: 50,
        },
        seasonalModifiers: {
            Spring: { temp: 14, precipitation: 20, solar: 600, humidity: 60 }, // Wet season starts
            Summer: { temp: 16, precipitation: 5, solar: 750, humidity: 45 },  // Dry season
            Fall: { temp: 13, precipitation: 10, solar: 650, humidity: 50 },  // Dry season ends
            Winter: { temp: 10, precipitation: 25, solar: 550, humidity: 65 }, // Wet season
        },
        availableCrops: ['potato', 'quinoa', 'corn', 'wheat', 'lettuce', 'soybean'],
        soilDistribution: { loamy: 0.7, sandy: 0.2, clay: 0.1 },
    }
];
