
import { useState, useEffect, useRef } from 'react';
import { FARMER_SPEED, TILE_SIZE } from '../constants';

export const usePlayerMovement = (gridRef: React.RefObject<HTMLDivElement>) => {
    const [position, setPosition] = useState({ x: 300, y: 200 });
    const [direction, setDirection] = useState<'down' | 'up' | 'left' | 'right'>('down');
    const [currentTileIndex, setCurrentTileIndex] = useState<number | null>(null);

    const keysPressed = useRef<{ [key: string]: boolean }>({});
    const animationFrameId = useRef<number | null>(null);

    const positionRef = useRef(position);
    positionRef.current = position;
    
    const directionRef = useRef(direction);
    directionRef.current = direction;

    useEffect(() => {
        // The entire game loop is contained in this single effect, which runs once.
        const move = () => {
            // Read latest values from refs to avoid stale state
            let newX = positionRef.current.x;
            let newY = positionRef.current.y;
            let newDirection = directionRef.current;
            
            let moved = false;
            if (keysPressed.current['w'] || keysPressed.current['ArrowUp']) {
                newY -= FARMER_SPEED;
                newDirection = 'up';
                moved = true;
            }
            if (keysPressed.current['s'] || keysPressed.current['ArrowDown']) {
                newY += FARMER_SPEED;
                newDirection = 'down';
                moved = true;
            }
            if (keysPressed.current['a'] || keysPressed.current['ArrowLeft']) {
                newX -= FARMER_SPEED;
                newDirection = 'left';
                moved = true;
            }
            if (keysPressed.current['d'] || keysPressed.current['ArrowRight']) {
                newX += FARMER_SPEED;
                newDirection = 'right';
                moved = true;
            }

            if (gridRef.current) {
                const rect = gridRef.current.getBoundingClientRect();
                newX = Math.max(0, Math.min(newX, rect.width - 32)); // 32 is farmer width
                newY = Math.max(0, Math.min(newY, rect.height - 48)); // 48 is farmer height
            }
            
            if (moved) {
                // Set state to trigger re-render for the visuals
                setPosition({ x: newX, y: newY });
                setDirection(newDirection);

                // Calculate current tile index
                const farmerCenterX = newX + 16;
                const farmerCenterY = newY + 40; // towards the feet

                if (gridRef.current) {
                    const gridRect = gridRef.current.getBoundingClientRect();
                    const tiles = gridRef.current.querySelectorAll('.tile-hittarget');
                    let closestTile: { index: number | null, distance: number } = { index: null, distance: Infinity };

                    tiles.forEach((tileNode, index) => {
                        const tileRect = tileNode.getBoundingClientRect();
                        const tileCenterX = tileRect.left - gridRect.left + tileRect.width / 2;
                        const tileCenterY = tileRect.top - gridRect.top + tileRect.height / 2;
                        const distance = Math.sqrt(Math.pow(farmerCenterX - tileCenterX, 2) + Math.pow(farmerCenterY - tileCenterY, 2));

                        if (distance < closestTile.distance) {
                            closestTile = { index, distance };
                        }
                    });
                    
                    if (closestTile.distance < TILE_SIZE / 1.5) { // Interaction radius
                        setCurrentTileIndex(closestTile.index);
                    } else {
                        setCurrentTileIndex(null);
                    }
                }
            }
            
            animationFrameId.current = requestAnimationFrame(move);
        };
        
        const handleKeyDown = (e: KeyboardEvent) => { keysPressed.current[e.key.toLowerCase()] = true; };
        const handleKeyUp = (e: KeyboardEvent) => { keysPressed.current[e.key.toLowerCase()] = false; };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);

        animationFrameId.current = requestAnimationFrame(move);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
            if (animationFrameId.current) {
                cancelAnimationFrame(animationFrameId.current);
            }
        };
    }, [gridRef]); // Effect runs once when gridRef is available.

    return { position, direction, currentTileIndex };
};
