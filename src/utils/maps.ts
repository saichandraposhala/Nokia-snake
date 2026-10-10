import { MapDefinition, MapType, Point } from '../types/game';

// Helper to generate coordinates
const createCoords = (coords: [number, number][]): Point[] => {
  return coords.map(([x, y]) => ({ x, y }));
};

export const GAME_MAPS: Record<MapType, MapDefinition> = {
  open: {
    id: 'open',
    name: 'Classic Open',
    label: 'Open Box',
    description: 'Pure authentic 20×20 field without internal barriers. Classic reflex gameplay.',
    barriers: [],
  },
  pillars: {
    id: 'pillars',
    name: 'Twin Pillars',
    label: 'Pillars',
    description: 'Two vertical monolith barriers dividing the arena into 3 high-speed corridors.',
    barriers: createCoords([
      // Left vertical pillar
      [5, 4], [5, 5], [5, 6], [5, 7], [5, 8], [5, 9], [5, 10], [5, 11], [5, 12], [5, 13], [5, 14], [5, 15],
      // Right vertical pillar
      [14, 4], [14, 5], [14, 6], [14, 7], [14, 8], [14, 9], [14, 10], [14, 11], [14, 12], [14, 13], [14, 14], [14, 15],
    ]),
  },
  corners: {
    id: 'corners',
    name: 'Four Bastions',
    label: 'Corners',
    description: 'Corner fortification barriers that penalize wide turns and squeeze perimeter runs.',
    barriers: createCoords([
      // Top-Left corner L-bracket
      [3, 3], [4, 3], [5, 3], [6, 3],
      [3, 4], [3, 5], [3, 6],

      // Top-Right corner L-bracket
      [13, 3], [14, 3], [15, 3], [16, 3],
      [16, 4], [16, 5], [16, 6],

      // Bottom-Left corner L-bracket
      [3, 13], [3, 14], [3, 15], [3, 16],
      [4, 16], [5, 16], [6, 16],

      // Bottom-Right corner L-bracket
      [16, 13], [16, 14], [16, 15], [16, 16],
      [13, 16], [14, 16], [15, 16],
    ]),
  },
  cross: {
    id: 'cross',
    name: 'Crossroads Maze',
    label: 'Crossroads',
    description: 'Cruciform barrier layout with central roundabouts partitioning the grid into four zones.',
    barriers: createCoords([
      // Top stem
      [9, 2], [10, 2],
      [9, 3], [10, 3],
      [9, 4], [10, 4],
      [9, 5], [10, 5],

      // Bottom stem
      [9, 14], [10, 14],
      [9, 15], [10, 15],
      [9, 16], [10, 16],
      [9, 17], [10, 17],

      // Left stem
      [2, 9], [2, 10],
      [3, 9], [3, 10],
      [4, 9], [4, 10],
      [5, 9], [5, 10],

      // Right stem
      [14, 9], [14, 10],
      [15, 9], [15, 10],
      [16, 9], [16, 10],
      [17, 9], [17, 10],
    ]),
  },
  box: {
    id: 'box',
    name: 'Inner Sanctum',
    label: 'Box Ring',
    description: 'Central fortified room with 4 narrow entry portals. High spatial awareness required.',
    barriers: createCoords([
      // Top wall with middle gap
      [5, 5], [6, 5], [7, 5], [8, 5],
      [11, 5], [12, 5], [13, 5], [14, 5],

      // Bottom wall with middle gap
      [5, 14], [6, 14], [7, 14], [8, 14],
      [11, 14], [12, 14], [13, 14], [14, 14],

      // Left wall with middle gap
      [5, 6], [5, 7], [5, 8],
      [5, 11], [5, 12], [5, 13],

      // Right wall with middle gap
      [14, 6], [14, 7], [14, 8],
      [14, 11], [14, 12], [14, 13],
    ]),
  },
};

export const MAP_LIST: MapDefinition[] = Object.values(GAME_MAPS);
