import { Crop } from '../types';

export const ALL_CROPS: Crop[] = [
  // Temperate / General
  { id: 'corn', name: 'Corn', icon: '🌽', optimalTemp: [20, 30], waterNeeds: 'medium' },
  { id: 'carrot', name: 'Carrot', icon: '🥕', optimalTemp: [15, 25], waterNeeds: 'medium' },
  { id: 'wheat', name: 'Wheat', icon: '🌾', optimalTemp: [20, 25], waterNeeds: 'low' },
  { id: 'tomato', name: 'Tomato', icon: '🍅', optimalTemp: [21, 29], waterNeeds: 'high' },
  { id: 'strawberry', name: 'Strawberry', icon: '🍓', optimalTemp: [15, 26], waterNeeds: 'medium' },
  { id: 'soybean', name: 'Soybean', icon: '🌱', optimalTemp: [20, 30], waterNeeds: 'medium' },

  // Cool Weather
  { id: 'potato', name: 'Potato', icon: '🥔', optimalTemp: [15, 20], waterNeeds: 'medium' },
  { id: 'lettuce', name: 'Lettuce', icon: '🥬', optimalTemp: [10, 20], waterNeeds: 'high' },
  { id: 'quinoa', name: 'Quinoa', icon: '🥣', optimalTemp: [10, 20], waterNeeds: 'low' },
  
  // Warm Weather / Tropical
  { id: 'rice', name: 'Rice', icon: '🍚', optimalTemp: [25, 35], waterNeeds: 'high' },
  { id: 'pineapple', name: 'Pineapple', icon: '🍍', optimalTemp: [23, 32], waterNeeds: 'low' },
  { id: 'tea', name: 'Tea Leaves', icon: '🍵', optimalTemp: [18, 30], waterNeeds: 'high' },
];
