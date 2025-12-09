export enum Screen {
  LOGIN = 'LOGIN',
  HOME = 'HOME',
  DISEASE_DETECTION = 'DISEASE_DETECTION',
  MARKET_PRICES = 'MARKET_PRICES',
  CROP_ADVISORY = 'CROP_ADVISORY',
  GOVT_SCHEMES = 'GOVT_SCHEMES',
  ANALYTICS = 'ANALYTICS',
  VOICE_ASSISTANT = 'VOICE_ASSISTANT',
  SETTINGS = 'SETTINGS',
  INSURANCE = 'INSURANCE',
}

export interface User {
  name: string;
  language: 'en' | 'hi' | 'ta' | 'pa';
  location: string;
}

export interface MarketItem {
  id: string;
  name: string;
  price: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  image: string;
}

export interface Scheme {
  id: string;
  title: string;
  description: string;
  eligibility: string;
}

export interface WeatherData {
  temp: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  location: string;
}

export interface AdvisoryItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}