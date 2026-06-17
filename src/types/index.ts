export type UserRole = 'investigator' | 'analyst' | 'supervisor' | 'policymaker';

export type RiskLevel = 'HIGH' | 'MEDIUM' | 'LOW';

export type FIRStatus = 'OPEN' | 'UNDER_INVESTIGATION' | 'CHARGE_SHEET' | 'CLOSED';

export type CrimeCategory =
  | 'ROBBERY' | 'THEFT' | 'ASSAULT' | 'MURDER'
  | 'DRUG_TRAFFICKING' | 'FRAUD' | 'CYBERCRIME'
  | 'SEXUAL_OFFENCE' | 'EXTORTION' | 'KIDNAPPING'
  | 'BURGLARY' | 'CHEATING' | 'GAMBLING';

export interface User {
  id: string;
  name: string;
  role: UserRole;
  district: string;
  badgeNumber: string;
}

export interface FIR {
  id: string;
  firNumber: string;
  policeStation: string;
  district: string;
  dateOfCrime: string;
  dateFiled: string;
  crimeCategory: CrimeCategory;
  ipcSection: string;
  description: string;
  status: FIRStatus;
  latitude: number;
  longitude: number;
  officerInCharge: string;
  accusedIds: string[];
  victimIds: string[];
  severity: RiskLevel;
}

export interface Accused {
  id: string;
  name: string;
  alias?: string;
  age: number;
  gender: 'M' | 'F';
  address: string;
  district: string;
  occupation: string;
  education: string;
  riskScore: number;
  priorOffences: number;
  crimeHistory: CrimeCategory[];
  modusOperandi: string[];
  associateIds: string[];
  financialLinks: boolean;
  activeWarrant: boolean;
  lastKnownLocation?: string;
}

export interface Victim {
  id: string;
  name: string;
  age: number;
  gender: 'M' | 'F';
  district: string;
  occupation: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  language: 'en' | 'kn';
  citations?: Citation[];
}

export interface Citation {
  type: 'FIR' | 'ACCUSED' | 'LOCATION' | 'ANALYSIS';
  reference: string;
  confidence: number;
}

export interface NetworkNode {
  id: string;
  label: string;
  type: 'accused' | 'location' | 'crime' | 'organization';
  riskLevel?: RiskLevel;
  x?: number;
  y?: number;
}

export interface NetworkEdge {
  id: string;
  from: string;
  to: string;
  label: string;
  strength: number;
}

export interface CrimeStats {
  district: string;
  count: number;
  trend: 'UP' | 'DOWN' | 'STABLE';
  changePercent: number;
  coordinates: [number, number];
}