export type SensorData = {
  waterLevel: number;
  flowRate: number;
  consumption: number;
  wue: number;
};

export const currentSensorData: SensorData = {
  waterLevel: 85.4,
  flowRate: 1205,
  consumption: 5432,
  wue: 1.51,
};

export const historicalWaterData = [
  { name: '7 days ago', consumption: 4000, goal: 4500 },
  { name: '6 days ago', consumption: 3000, goal: 4500 },
  { name: '5 days ago', consumption: 2000, goal: 4500 },
  { name: '4 days ago', consumption: 2780, goal: 4500 },
  { name: '3 days ago', consumption: 1890, goal: 4500 },
  { name: '2 days ago', consumption: 2390, goal: 4500 },
  { name: 'Yesterday', consumption: 3490, goal: 4500 },
];

export const systemHealth = {
  status: 'All systems operational',
  checks: [
    { name: 'Cooling System', status: 'ok' },
    { name: 'Leak Detection', status: 'ok' },
    { name: 'Pump Integrity', status: 'ok' },
    { name: 'Sensor Network', status: 'ok' },
  ],
};

export const recentActivities = [
  {
    title: 'Cooling cycle optimized',
    timestamp: '2 hours ago',
  },
  {
    title: 'Routine maintenance check on Pump B completed',
    timestamp: '1 day ago',
  },
  {
    title: 'Minor anomaly detected: brief pressure drop',
    timestamp: '2 days ago',
  },
  {
    title: 'Firmware update for sensor array 3',
    timestamp: '3 days ago',
  },
];
