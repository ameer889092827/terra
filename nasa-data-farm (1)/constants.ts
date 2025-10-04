import { Season, SoilType, Upgrade } from './types';

export const TILE_COUNT = 96;
export const FARMER_SPEED = 4;
export const TILE_SIZE = 70; // Approximate size of a tile in pixels for movement calculations
export const GRID_COLS = 12;
export const GRID_ROWS = 8;

export const SEASONS: Season[] = ['Spring', 'Summer', 'Fall', 'Winter'];

// XP required to reach the next level (index 0 is level 1, etc.)
export const LEVEL_THRESHOLDS = [0, 100, 250, 500, 1000, 2000, 3500, 5000, 7500, 10000];

export const ACHIEVEMENTS = {
  firstPlant: { name: 'Green Thumb', desc: 'Plant your first crop', reward: 50 },
  firstHarvest: { name: 'Bountiful Harvest', desc: 'Complete your first harvest', reward: 100 },
  dataDriven: { name: 'Data Farmer', desc: 'Make a smart decision based on data', reward: 75 },
  seasonedVet: { name: 'Seasoned Veteran', desc: 'Survive through all 4 seasons', reward: 200 },
  farmExpansion: { name: 'Land Baron', desc: 'Expand your farm for the first time', reward: 150 },
};

export const TOOL_INFO: { [key: string]: { title: string, description: string } } = {
    plant: { title: 'Plant', description: 'Cost: 5 Energy. Best when soil moisture is 50-70% and temp is optimal.' },
    water: { title: 'Water', description: 'Cost: 10L Water. Most effective when soil moisture is below 40%.' },
    fertilize: { title: 'Fertilize', description: 'Cost: 10 Energy. Apply when NDVI (vegetation index) is below 0.5 for a bonus.' },
    harvest: { title: 'Harvest', description: 'Harvest fully grown crops for $ and XP. Higher NDVI means better rewards!' },
    inspect: { title: 'Inspect', description: 'Get a detailed analysis of a crop plot, connecting its status to NASA data.' },
    expand: { title: 'Expand Farm', description: 'Cost: Varies. Purchase adjacent locked plots to grow your farm.' },
    default: { title: 'Welcome!', description: 'Use WASD to move and E to interact. Select a tool to get started!' }
};

export const SOIL_MODIFIERS: { [key in SoilType]: { waterRetention: number, growthModifier: number, yieldModifier: number, color: string } } = {
    loamy: { waterRetention: 1.0, growthModifier: 1.0, yieldModifier: 1.0, color: 'bg-yellow-800/60' }, // Baseline
    sandy: { waterRetention: 0.6, growthModifier: 0.9, yieldModifier: 0.8, color: 'bg-amber-800/50' }, // Dries fast, lower yield
    clay: { waterRetention: 1.4, growthModifier: 1.1, yieldModifier: 1.2, color: 'bg-stone-700/50' }, // Retains water, higher yield
};


export const UPGRADES: { [key: string]: Upgrade } = {
    'water_pump_1': {
        id: 'water_pump_1',
        name: 'Improved Water Pump',
        description: 'Reduces the cost of watering plants by 20%.',
        cost: 500,
        levelRequired: 2,
        stat: 'water_cost_multiplier',
        modifier: 0.8,
    },
};
