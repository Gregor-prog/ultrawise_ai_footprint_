import { config } from 'dotenv';
config();

import '@/ai/flows/predict-maintenance-needs.ts';
import '@/ai/flows/detect-anomalous-water-usage.ts';
import '@/ai/flows/suggest-cooling-optimization.ts';