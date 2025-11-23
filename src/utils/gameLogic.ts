import { GridItem } from '../types';
import { ICON_KEYS, PASTEL_COLORS } from '../constants';

export const generateGrid = (size: number): GridItem[] => {
  const totalItems = size * size;
  const grid: GridItem[] = [];
  
  // Create a randomized pool of icons
  const availableIcons = [...ICON_KEYS].sort(() => 0.5 - Math.random());
  
  for (let i = 0; i < totalItems; i++) {
    // Pick icon: rotate through shuffled list to minimize dupes in smaller grids,
    // but allow repeats for huge grids (10x10=100 items) if we run out.
    // However, ICON_KEYS is large (~200+), so we should be fine.
    const iconName = availableIcons[i % availableIcons.length];
    
    // Pick a pastel color
    const color = PASTEL_COLORS[Math.floor(Math.random() * PASTEL_COLORS.length)];
    
    grid.push({
      id: `item-${i}-${Date.now()}`,
      iconName,
      color
    });
  }
  
  return grid;
};

export const performSwap = (currentGrid: GridItem[], count: number = 2): { newGrid: GridItem[], swappedIds: string[] } => {
  const newGrid = [...currentGrid];
  const totalItems = newGrid.length;
  
  // Pick 'count' unique random indices
  const indices = new Set<number>();
  while (indices.size < count) {
    indices.add(Math.floor(Math.random() * totalItems));
  }
  
  const indicesArray = Array.from(indices);
  const swappedIds: string[] = [];
  
  // Rotate the items at these indices
  // E.g. if indices are [A, B, C], we move Item A to B's spot, B to C's spot, C to A's spot.
  
  const firstIndex = indicesArray[0];
  const firstItem = newGrid[firstIndex];
  swappedIds.push(firstItem.id);
  
  for (let i = 0; i < indicesArray.length - 1; i++) {
    const currentIdx = indicesArray[i];
    const nextIdx = indicesArray[i+1];
    
    newGrid[currentIdx] = newGrid[nextIdx];
    swappedIds.push(newGrid[nextIdx].id);
  }
  
  // Place the first item in the last index's spot
  const lastIndex = indicesArray[indicesArray.length - 1];
  newGrid[lastIndex] = firstItem;
  
  return {
    newGrid,
    swappedIds
  };
};

export const checkGuess = (selectedIds: string[], swappedIds: string[]): boolean => {
  if (selectedIds.length !== swappedIds.length) return false;
  
  const set1 = new Set(selectedIds);
  const set2 = new Set(swappedIds);
  
  for (let id of set1) {
    if (!set2.has(id)) return false;
  }
  return true;
};