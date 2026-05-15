
export type Status = 'normal' | 'caution' | 'none';

export interface Plant {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  capacity: string;
  generatorsCount: number;
  status: Status;
  warningCount: number;
  errorCount: number;
}

export interface Generator {
  id: string;
  plantId: string;
  name: string;
  fuelType: string;
  status: Status;
  isOperating: boolean;
  maxMse: number;
  alertCount: number;
  loadFactor: number;
  totalAssets: number;
  faultyAssets: number;
}

export interface Asset {
  id: string;
  generatorId: string;
  name: string;
  mse: number;
  status: Status;
  lastUpdated: string;
  current?: number;
  tempNDE?: number;
  tempDE?: number;
  vibNDE1?: number;
  vibNDE2?: number;
  vibDE1?: number;
  vibDE2?: number;
}

export interface SensorPoint {
  time: string;
  value: number;
  status: Status;
}

export interface Sensor {
  id: string;
  assetId: string;
  name: string;
  tag: string;
  unit: string;
  currentValue: number;
  prevValue: number;
  changeRate: number;
  status: Status;
  thresholds: {
    caution: number;
  };
  dataQuality: 'good' | 'fair' | 'poor';
}

export interface Alert {
  id: string;
  plantId: string;
  generatorId: string;
  assetId: string;
  type: 'threshold' | 'anomaly';
  severity: Status;
  message: string;
  timestamp: string;
  status: 'unconfirmed' | 'confirmed' | 'resolved' | 'processing' | 'false_alarm';
  processedBy?: string;
  memo?: string;
  channels: {
    email: 'success' | 'failed' | 'pending';
    slack: 'success' | 'failed' | 'pending';
  };
}

export interface AdminEmail {
  id: string;
  email: string;
  name: string;
  plantId: string;
  assetScope: string;
  slackUserId?: string;
  isVerified: boolean;
  isActive: boolean;
}

export interface User {
  id: string;
  role: 'admin' | 'viewer';
  loginId: string;
  name: string;
  department: string;
}
