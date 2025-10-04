
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { GameState, TileState, NasaData, Tool, Season, Crop, Achievement, NotificationMessage, TerraAnalysisResponse, Location, SoilType } from './types';
import { TILE_COUNT, SEASONS, ACHIEVEMENTS, TOOL_INFO, LEVEL_THRESHOLDS, GRID_COLS, GRID_ROWS, SOIL_MODIFIERS, UPGRADES } from './constants';
import { ALL_CROPS } from './data/crops';
import { LOCATIONS } from './data/locations';
import { getAIAssistantTip, getTerraAnalysis } from './services/geminiService';
import { usePlayerMovement } from './hooks/usePlayerMovement';

import Header from './components/Header';
import FarmGrid from './components/FarmGrid';
import SidePanel from './components/SidePanel';
import TutorialOverlay from './components/TutorialOverlay';
import Notification from './components/Notification';
import AchievementsModal from './components/AchievementsModal';
import Farmer from './components/Farmer';
import InspectModal from './components/InspectModal';
import LocationSelect from './components/LocationSelect';
import WeatherEffects from './components/WeatherEffects';
import MarketModal from './components/MarketModal';
import MapModal from './components/MapModal';
import AIHelper from './components/AIHelper';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [nasaData, setNasaData] = useState<NasaData | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  
  const [notification, setNotification] = useState<NotificationMessage | null>(null);
  const [showTutorial, setShowTutorial] = useState<boolean>(true);
  const [showAchievements, setShowAchievements] = useState<boolean>(false);
  const [showMarket, setShowMarket] = useState<boolean>(false);
  const [showMap, setShowMap] = useState<boolean>(false);

  const [aiTip, setAiTip] = useState<string>('Welcome! I am Terra, your AI assistant. Choose a location to begin!');
  const [isAiLoading, setIsAiLoading] = useState<boolean>(false);
  const [inspectedTileIndex, setInspectedTileIndex] = useState<number | null>(null);
  const [terraAnalysis, setTerraAnalysis] = useState<TerraAnalysisResponse | null>(null);
  
  const gridRef = useRef<HTMLDivElement>(null);
  const { position, direction, currentTileIndex } = usePlayerMovement(gridRef);
  
  const notificationTimeoutRef = useRef<number | null>(null);
  const tickCounter = useRef(0);
  const lastAINotificationTick = useRef(-100);
  const wasRaining = useRef(false);

  const showNotificationMessage = useCallback((message: string, type: NotificationMessage['type'] = 'info') => {
    if (notificationTimeoutRef.current) {
      clearTimeout(notificationTimeoutRef.current);
    }
    setNotification({ message, type });
    notificationTimeoutRef.current = window.setTimeout(() => {
      setNotification(null);
    }, 4000);
  }, []);

  const handleLocationSelect = useCallback((location: Location) => {
    setSelectedLocation(location);

    const initialTiles: TileState[] = Array(TILE_COUNT).fill(null).map((_, index) => {
      const row = Math.floor(index / GRID_COLS);
      const col = index % GRID_COLS;
      const isLocked = row > 0 && row < GRID_ROWS -1 && col > 3 && col < GRID_COLS - 4 ? false : true;
      
      let soilType: SoilType = 'loamy';
      const random = Math.random();
      if (random < location.soilDistribution.sandy) soilType = 'sandy';
      else if (random < location.soilDistribution.sandy + location.soilDistribution.clay) soilType = 'clay';
      
      return {
        planted: false,
        watered: false,
        fertilized: false,
        growth: 0,
        crop: null,
        health: 100,
        locked: isLocked,
        soilType: soilType,
      };
    });

    setGameState({
      money: 100,
      xp: 0,
      level: 1,
      water: 100,
      energy: 100,
      day: 1,
      season: 'Spring',
      selectedTool: null,
      tiles: initialTiles,
      achievements: [],
      availableCrops: location.availableCrops.map(id => ALL_CROPS.find(c => c.id === id)).filter(Boolean) as Crop[],
      upgrades: {},
      maxWater: 100,
      maxEnergy: 100,
    });

    setNasaData(location.baseNasaData);
    setShowTutorial(true);
  }, []);

  const checkAchievement = useCallback((type: keyof typeof ACHIEVEMENTS) => {
    if (!gameState || gameState.achievements.some(a => a.id === type)) return;

    const achievement = ACHIEVEMENTS[type];
    setGameState(prev => {
        if (!prev) return null;
        return {
            ...prev,
            money: prev.money + achievement.reward,
            achievements: [...prev.achievements, { id: type, name: achievement.name }],
        }
    });
    showNotificationMessage(`🏆 ${achievement.name}`, 'achievement');
  }, [gameState, showNotificationMessage]);
  
  const checkForLevelUp = useCallback((currentGameState: GameState): GameState => {
    const currentLevel = currentGameState.level;
    if (currentLevel >= LEVEL_THRESHOLDS.length) return currentGameState;

    const nextLevelXP = LEVEL_THRESHOLDS[currentLevel];
    if (currentGameState.xp >= nextLevelXP) {
      showNotificationMessage(`🎉 Level Up! You've reached Level ${currentLevel + 1}!`, 'levelup');
      return { ...currentGameState, level: currentLevel + 1 };
    }
    return currentGameState;
  }, [showNotificationMessage]);

  const handleAction = useCallback((index: number) => {
    if (!gameState || !nasaData) return;

    const tile = gameState.tiles[index];
    if (tile.locked && gameState.selectedTool !== 'expand') {
      showNotificationMessage('This land is locked. Use the expand tool to purchase it.', 'warning');
      return;
    }

    if (!gameState.selectedTool) {
      showNotificationMessage('Please select a tool from the side panel first.', 'warning');
      return;
    }

    let updatedTiles = [...gameState.tiles];
    let tileUpdated = false;
    let energyCost = 5 * (gameState.upgrades.tool_efficiency || 1);


    switch (gameState.selectedTool) {
      case 'plant':
        if (!tile.planted && gameState.energy >= energyCost) {
          const newCrop = gameState.availableCrops[gameState.day % gameState.availableCrops.length];
          updatedTiles[index] = { ...tile, planted: true, crop: newCrop, growth: 0.1, health: 100 };
          setGameState(prev => prev ? { ...prev, energy: prev.energy - energyCost } : null);
          showNotificationMessage(`Planted ${newCrop.name}!`, 'success');
          checkAchievement('firstPlant');
          tileUpdated = true;
        }
        break;
      case 'water':
        const waterCost = 10 * (gameState.upgrades.water_pump || 1);
        if (tile.planted && !tile.watered && gameState.water >= waterCost) {
          updatedTiles[index] = { ...tile, watered: true };
          let moneyBonus = 0;
          if (nasaData.soilMoisture < 40) {
            moneyBonus = 10;
            showNotificationMessage('Smart watering! Soil is dry. (+$10)', 'success');
            checkAchievement('dataDriven');
          } else {
            showNotificationMessage('Watered the plant.', 'info');
          }
          setGameState(prev => prev ? { ...prev, water: prev.water - waterCost, money: prev.money + moneyBonus } : null);
          tileUpdated = true;
        }
        break;
      case 'fertilize':
        if (tile.planted && !tile.fertilized && gameState.energy >= (energyCost + 5)) {
          updatedTiles[index] = { ...tile, fertilized: true };
          let moneyBonus = 0;
          if (nasaData.ndvi < 0.5) {
            moneyBonus = 15;
            showNotificationMessage('Great timing! NDVI was low. (+$15)', 'success');
            checkAchievement('dataDriven');
          } else {
            showNotificationMessage('Fertilized the plant.', 'info');
          }
          setGameState(prev => prev ? { ...prev, energy: prev.energy - (energyCost + 5), money: prev.money + moneyBonus } : null);
          tileUpdated = true;
        }
        break;
      case 'harvest':
        if (tile.planted && tile.growth >= 4) {
          const soilModifier = SOIL_MODIFIERS[tile.soilType].yieldModifier;
          const yieldMultiplier = gameState.upgrades.fertilizer_mix || 1;
          let baseMoney = 50 * soilModifier * yieldMultiplier;
          if (tile.fertilized) baseMoney += 20;
          if (nasaData.ndvi > 0.7) baseMoney += 30;
          
          const moneyGained = Math.round(baseMoney);
          const xpGained = Math.round(25 * (gameState.upgrades.almanac || 1));

          setGameState(prev => {
            if (!prev) return null;
            const newState = { ...prev, money: prev.money + moneyGained, xp: prev.xp + xpGained, energy: prev.energy - energyCost };
            return checkForLevelUp(newState);
          });
          updatedTiles[index] = { ...updatedTiles[index], planted: false, watered: false, fertilized: false, growth: 0, crop: null, health: 100 };
          showNotificationMessage(`Harvested for $${moneyGained} and ${xpGained} XP!`, 'success');
          checkAchievement('firstHarvest');
          tileUpdated = true;
        }
        break;
      case 'inspect':
        setInspectedTileIndex(index);
        break;
      case 'expand': {
        const expansionCost = 150;
        if(tile.locked && gameState.money >= expansionCost) {
            updatedTiles[index] = { ...tile, locked: false };
            setGameState(prev => prev ? { ...prev, money: prev.money - expansionCost } : null);
            showNotificationMessage('Land purchased! Your farm is growing.', 'success');
            checkAchievement('farmExpansion');
            tileUpdated = true;
        } else if (tile.locked && gameState.money < expansionCost) {
            showNotificationMessage(`You need $${expansionCost} to expand here.`, 'warning');
        }
        break;
      }
    }

    if (tileUpdated) {
        setGameState(prev => prev ? { ...prev, tiles: updatedTiles } : null);
    }
  }, [gameState, nasaData, showNotificationMessage, checkAchievement, checkForLevelUp]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
        if ((e.key.toLowerCase() === 'e') && currentTileIndex !== null) {
            handleAction(currentTileIndex);
        }
    };
    window.addEventListener('keypress', handleKeyPress);
    return () => window.removeEventListener('keypress', handleKeyPress);
  }, [currentTileIndex, handleAction]);
  
  const handleToolSelect = useCallback((tool: Tool) => {
      setGameState(prev => prev ? { ...prev, selectedTool: tool } : null);
  }, []);

  const fetchAITip = useCallback(async () => {
    if (!gameState || !nasaData || !selectedLocation) return;
    setIsAiLoading(true);
    setTerraAnalysis(null);
    try {
        const tip = await getAIAssistantTip(gameState, nasaData, selectedLocation);
        setAiTip(tip);
    } catch (error) {
        console.error("Error fetching AI tip:", error);
        setAiTip("I'm having trouble connecting to my network. Let's rely on the raw data for now!");
    } finally {
        setIsAiLoading(false);
    }
  }, [gameState, nasaData, selectedLocation]);

  const handleRequestAnalysis = useCallback(async () => {
    if (!gameState || !nasaData || !selectedLocation) return;
    setIsAiLoading(true);
    setTerraAnalysis(null);
    try {
        const analysis = await getTerraAnalysis(gameState, nasaData, selectedLocation);
        setTerraAnalysis(analysis);
        setAiTip(analysis.summary);
    } catch (error) {
        console.error("Error fetching Terra analysis:", error);
        setAiTip("My analysis systems are down. What does the raw data tell you?");
    } finally {
        setIsAiLoading(false);
    }
  }, [gameState, nasaData, selectedLocation]);
  
  const handleApplySuggestion = useCallback(() => {
    if (!terraAnalysis?.suggestion || !gameState || !nasaData) return;

    const { action, criteria } = terraAnalysis.suggestion;
    const updatedTiles = [...gameState.tiles];
    let actionsTaken = 0;
    const waterCost = 10 * (gameState.upgrades.water_pump || 1);
    const energyCost = 10 * (gameState.upgrades.tool_efficiency || 1);

    updatedTiles.forEach((tile, index) => {
        let criteriaMet = true;
        if (criteria.requiresPlanted && !tile.planted) criteriaMet = false;
        
        if (action === 'water') {
            if (criteria.isWatered === false && tile.watered) criteriaMet = false;
            if (criteria.soilMoisture?.comparison === 'less_than' && nasaData.soilMoisture >= criteria.soilMoisture.value) criteriaMet = false;
        }
        if (action === 'fertilize') {
            if (criteria.isFertilized === false && tile.fertilized) criteriaMet = false;
            if (criteria.ndvi?.comparison === 'less_than' && nasaData.ndvi >= criteria.ndvi.value) criteriaMet = false;
        }

        if (criteriaMet) {
            if (action === 'water' && gameState.water >= waterCost * (actionsTaken + 1)) {
                updatedTiles[index] = { ...tile, watered: true };
                actionsTaken++;
            }
            if (action === 'fertilize' && gameState.energy >= energyCost * (actionsTaken + 1)) {
                updatedTiles[index] = { ...tile, fertilized: true };
                actionsTaken++;
            }
        }
    });

    if (actionsTaken > 0) {
        setGameState(prev => {
            if (!prev) return null;
            return {
                ...prev,
                tiles: updatedTiles,
                water: prev.water - (action === 'water' ? waterCost * actionsTaken : 0),
                energy: prev.energy - (action === 'fertilize' ? energyCost * actionsTaken : 0),
            }
        });
        showNotificationMessage(`Terra's suggestion applied! Affected ${actionsTaken} plots.`, 'success');
    } else {
        showNotificationMessage("Couldn't apply suggestion. Either no plots met the criteria or you lack resources.", 'warning');
    }
    setTerraAnalysis(null);
  }, [terraAnalysis, gameState, nasaData, showNotificationMessage]);

  useEffect(() => {
    if (!gameState || !nasaData) return;

    const gameLoop = setInterval(() => {
      tickCounter.current++;
      const isNewDay = tickCounter.current > 0 && tickCounter.current % 24 === 0; // 24 ticks * 2.5s = 60s
      
      setGameState(prev => {
        if (!prev) return null;

        const isRaining = nasaData.precipitation > 15;
        const isSunny = nasaData.solarIrradiance > 800;

        let newTiles = prev.tiles.map(tile => {
          let newTile = { ...tile };
          if (!newTile.locked && newTile.planted && newTile.growth < 4) {
            let baseGrowth = 0;
            if (newTile.watered) baseGrowth = 0.34;
            if (newTile.fertilized) baseGrowth += 0.1;

            const soilModifier = SOIL_MODIFIERS[newTile.soilType];
            baseGrowth *= soilModifier.growthModifier;
            
            const isTempOptimal = nasaData.temperature >= (newTile.crop?.optimalTemp[0] ?? 18) && nasaData.temperature <= (newTile.crop?.optimalTemp[1] ?? 28);
            if (isTempOptimal) baseGrowth += 0.05;
            if (isSunny) baseGrowth += 0.05;
            
            const wasHarvestable = newTile.growth >= 4;
            newTile.growth = Math.min(4, newTile.growth + baseGrowth);
            const isNowHarvestable = newTile.growth >= 4;
            if (!wasHarvestable && isNowHarvestable) {
              showNotificationMessage(`${newTile.crop?.icon} ${newTile.crop?.name} is ready to harvest!`, 'info');
            }
          }
          
          const soilWaterRetention = SOIL_MODIFIERS[newTile.soilType].waterRetention;
          const dryingChance = (isSunny ? 0.4 : 0.2) / soilWaterRetention;
          if (newTile.watered && Math.random() < dryingChance) newTile.watered = false;

          if (newTile.fertilized && newTile.growth > 2 && Math.random() < 0.1) newTile.fertilized = false;
          
          return newTile;
        });

        if (isRaining) {
          let wateredCount = 0;
          newTiles = newTiles.map(tile => {
            if (!tile.locked && tile.planted && !tile.watered) {
              wateredCount++;
              return { ...tile, watered: true };
            }
            return tile;
          });
          if (wateredCount > 0 && !wasRaining.current) {
            showNotificationMessage(`The rain watered ${wateredCount} of your crops!`, 'info');
          }
        }
        wasRaining.current = isRaining;

        // Proactive AI Notifications
        if (tickCounter.current - lastAINotificationTick.current > 40) { // Cooldown to prevent spam
            let notificationSent = false;
            const harvestableCrops = newTiles.filter(t => !t.locked && t.growth >= 4).length;

            if (prev.water < 20) {
                showNotificationMessage("🤖 Terra: Your water tank is nearly empty. Remember to refill it!", 'warning');
                notificationSent = true;
            } else if (nasaData.soilMoisture < 25 && prev.tiles.some(t => t.planted && !t.watered)) {
                showNotificationMessage("🤖 Terra: The soil is very dry! Your crops are thirsty.", 'warning');
                notificationSent = true;
            } else if (harvestableCrops > 5) {
                showNotificationMessage(`🤖 Terra: ${harvestableCrops} crops are ready to harvest! Great work.`, 'info');
                notificationSent = true;
            }
            
            if (notificationSent) {
                lastAINotificationTick.current = tickCounter.current;
            }
        }

        let newDay = prev.day;
        let newSeason = prev.season;
        if (isNewDay) {
          newDay++;
          if (newDay > 0 && newDay % 30 === 0) {
            const currentSeasonIndex = SEASONS.indexOf(prev.season);
            newSeason = SEASONS[(currentSeasonIndex + 1) % SEASONS.length];
            showNotificationMessage(`The season has changed to ${newSeason}!`, 'info');
            checkAchievement('seasonedVet');
          }
        }
        
        const newState = {
          ...prev,
          day: newDay,
          season: newSeason,
          water: Math.min(prev.maxWater, prev.water + (isNewDay ? (5 + Math.round(nasaData.precipitation / 2)) : 0)),
          energy: Math.min(prev.maxEnergy, prev.energy + (isNewDay ? 100 : 0)),
          tiles: newTiles,
        };

        return isNewDay ? checkForLevelUp(newState) : newState;
      });
    }, 2500);

    return () => clearInterval(gameLoop);
  }, [gameState, nasaData, showNotificationMessage, checkAchievement, checkForLevelUp]);

  useEffect(() => {
    if (!selectedLocation) return;
    
    const dataUpdater = setInterval(() => {
      setNasaData(prev => {
        if (!prev || !gameState) return prev;

        const season = gameState.season;
        const modifiers = selectedLocation.seasonalModifiers[season];
        const vary = (value: number, amount: number) => value + (Math.random() - 0.5) * amount;

        return {
          soilMoisture: Math.max(10, Math.min(95, vary(prev.soilMoisture, 8))),
          temperature: Math.max(-10, Math.min(45, prev.temperature + (modifiers.temp - prev.temperature) * 0.1 + (Math.random() - 0.5) * 2)),
          precipitation: Math.max(0, Math.min(40, vary(modifiers.precipitation, 5))),
          solarIrradiance: Math.max(100, Math.min(1000, vary(modifiers.solar, 100))),
          windSpeed: Math.max(0, Math.min(50, vary(prev.windSpeed, 5))),
          ndvi: Math.max(0.1, Math.min(0.9, vary(prev.ndvi, 0.05))),
          relativeHumidity: Math.max(20, Math.min(99, vary(modifiers.humidity, 10))),
        };
      });
    }, 2500);
    return () => clearInterval(dataUpdater);
  }, [selectedLocation, gameState]);
  
  useEffect(() => {
    if (!gameState) return;
    const tipTimer = setInterval(() => {
        fetchAITip();
    }, 30000);
    
    return () => clearInterval(tipTimer);
  }, [gameState, fetchAITip]);

  const handleBuyUpgrade = useCallback((upgradeId: string, cost: number) => {
    setGameState(prev => {
        if (!prev || prev.money < cost) {
            showNotificationMessage("Not enough money!", 'warning');
            return prev;
        }

        const upgrade = UPGRADES[upgradeId as keyof typeof UPGRADES];
        if (!upgrade) {
            showNotificationMessage("Upgrade not found!", 'warning');
            return prev;
        }

        showNotificationMessage("Upgrade purchased!", 'success');
        
        const newState: GameState = {
            ...prev,
            money: prev.money - cost,
            upgrades: { ...prev.upgrades, [upgradeId]: upgrade.modifier },
        };
        
        if (upgrade.stat === 'water_tank') {
            newState.maxWater = upgrade.modifier;
        }
        if (upgrade.stat === 'tool_efficiency') {
            newState.maxEnergy = upgrade.modifier;
        }
        
        return newState;
    });
  }, [showNotificationMessage]);

  const startGame = () => {
    setShowTutorial(false);
    showNotificationMessage('Use WASD to move, E to interact!', 'info');
    fetchAITip();
  };

  if (!selectedLocation || !gameState || !nasaData) {
    return <LocationSelect onSelect={handleLocationSelect} />;
  }

  return (
    <div className="bg-slate-900 min-h-screen flex items-center justify-center p-4 text-white font-sans antialiased">
      <div className="w-full max-w-7xl h-[800px] max-h-[90vh] bg-slate-800 rounded-2xl shadow-2xl shadow-cyan-500/10 flex flex-col overflow-hidden ring-1 ring-slate-700">
        <Header 
            gameState={gameState} 
            onAchievementsClick={() => setShowAchievements(true)} 
            onMarketClick={() => setShowMarket(true)}
            onMapClick={() => setShowMap(true)}
        />
        <main className="flex-1 flex p-4 gap-4 overflow-hidden">
          <div id="farm-grid-container" className="flex-1 relative bg-lime-900/20 p-4 rounded-lg overflow-hidden border-4 border-yellow-800/50" ref={gridRef}>
            <WeatherEffects nasaData={nasaData} />
            <FarmGrid tiles={gameState.tiles} highlightedTileIndex={currentTileIndex} nasaData={nasaData} />
            <Farmer position={position} direction={direction} />
          </div>
          <SidePanel 
            nasaData={nasaData} 
            selectedTool={gameState.selectedTool}
            onToolSelect={handleToolSelect}
            info={TOOL_INFO[gameState.selectedTool ?? 'default']}
            aiTip={aiTip}
            isAiLoading={isAiLoading}
            onAiRefresh={fetchAITip}
            onAiAnalyze={handleRequestAnalysis}
            aiSuggestion={terraAnalysis?.suggestion ?? null}
            onApplySuggestion={handleApplySuggestion}
          />
        </main>
      </div>
      {showTutorial && <TutorialOverlay onStart={startGame} />}
      {notification && <Notification message={notification.message} type={notification.type} />}
      {showAchievements && <AchievementsModal achievements={gameState.achievements} onClose={() => setShowAchievements(false)} />}
      {inspectedTileIndex !== null && <InspectModal tile={gameState.tiles[inspectedTileIndex]} nasaData={nasaData} onClose={() => setInspectedTileIndex(null)} />}
      {showMarket && <MarketModal gameState={gameState} onClose={() => setShowMarket(false)} onBuyUpgrade={handleBuyUpgrade} />}
      {showMap && <MapModal onClose={() => setShowMap(false)} />}
    </div>
  );
};

export default App;
