
export type Tool = 'plant' | 'water' | 'fertilize' | 'harvest' | 'inspect' | 'expand';

export type Season = 'Spring' | 'Summer' | 'Fall' | 'Winter';

export type SoilType = 'loamy' | 'sandy' | 'clay';

export interface Crop {
  id: string;
  name: string;
  icon: string;
  optimalTemp: [number, number];
  waterNeeds: 'low' | 'medium' | 'high';
}

export interface TileState {
  planted: boolean;
  watered: boolean;
  fertilized: boolean;
  growth: number;
  crop: Crop | null;
  health: number;
  soilType: SoilType;
  locked: boolean;
}

export interface Achievement {
    id: string;
    name: string;
}

export interface Upgrade {
    id: string;
    name: string;
    description: string;
    cost: number;
    levelRequired: number;
    stat: string; // e.g., 'water_cost_multiplier'
    modifier: number;
}

export interface GameState {
  money: number;
  xp: number;
  level: number;
  water: number;
  energy: number;
  day: number;
  season: Season;
  selectedTool: Tool | null;
  tiles: TileState[];
  achievements: Achievement[];
  availableCrops: Crop[];
  upgrades: { [key: string]: number }; // Stores the level of each upgrade
  maxWater: number;
  maxEnergy: number;
}

export interface NasaData {
  soilMoisture: number;
  temperature: number;
  precipitation: number;
  solarIrradiance: number; // Replaces UV Index, W/m^2
  windSpeed: number;
  ndvi: number;
  relativeHumidity: number; // As a percentage
}

export interface NotificationMessage {
    message: string;
    type: 'info' | 'success' | 'warning' | 'achievement' | 'levelup';
}

export interface FarmerState {
    position: { x: number; y: number };
    direction: 'down' | 'up' | 'left' | 'right';
    action: 'idle' | Tool;
}

export interface TerraSuggestion {
  action: 'water' | 'fertilize';
  message: string;
  criteria: {
    requiresPlanted?: boolean;
    isWatered?: boolean;
    isFertilized?: boolean;
    soilMoisture?: { comparison: 'less_than'; value: number };
    ndvi?: { comparison: 'less_than'; value: number };
  };
}

export interface TerraAnalysisResponse {
  summary: string;
  suggestion: TerraSuggestion | null;
}

export interface Location {
    id: string;
    name: string;
    description: string;
    baseNasaData: NasaData;
    seasonalModifiers: {
        [key in Season]: {
            temp: number;
            precipitation: number;
            solar: number;
            humidity: number;
        }
    };
    availableCrops: string[]; // Array of Crop IDs
    soilDistribution: { [key in SoilType]: number };
}
