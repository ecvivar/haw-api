import { readFileSync } from 'fs';
import { join } from 'path';

export interface SeedTranslation {
  language: string;
  title?: string;
  name?: string;
  description: string;
  genres?: string[];
  trailers?: string[];
  trailer?: string;
}

export interface SeedOverview {
  data: {
    languages: string[];
    creators: string[];
    sources: string[];
    thumbnail?: string;
    translations: SeedTranslation[];
  };
}

export interface SeedActorSocial {
  social: string;
  handle: string;
  url: string;
}

export interface SeedActor {
  uuid: string;
  firstName: string;
  lastName: string;
  nicknames: string[];
  gender: number;
  birthDate?: string;
  deathDate?: string;
  nationality?: string;
  character: string;
  seasons: string[];
  images: string[];
  sources: string[];
  socials?: SeedActorSocial[];
}

export interface SeedCharacter {
  uuid: string;
  firstName?: string;
  lastName?: string;
  nicknames: string[];
  gender?: number;
  birthDate?: string;
  deathDate?: string;
  actor?: string;
  images: string[];
  sources: string[];
}

export interface SeedSeason {
  uuid: string;
  durationTotal: number;
  seasonNum: number;
  releaseDate: string;
  episodes: string[];
  budget?: number | null;
  images: string[];
  sources: string[];
  nextSeason?: string;
  prevSeason?: string;
  translations: SeedTranslation[];
}

export interface SeedEpisode {
  uuid: string;
  duration: number;
  episodeNum: number;
  season: string;
  images: string[];
  sources: string[];
  nextEpisode?: string;
  prevEpisode?: string;
  translations: SeedTranslation[];
}

export interface SeedLocation {
  uuid: string;
  images: string[];
  sources: string[];
  translations: SeedTranslation[];
}

export interface SeedGame {
  uuid: string;
  playtime?: number;
  ageRating?: string;
  releaseDate: string;
  website: string;
  stores: string[];
  modes: string[];
  platforms: string[];
  publishers: string[];
  developers: string[];
  tags: string[];
  images: string[];
  sources: string[];
  translations: SeedTranslation[];
}

export interface SeedUser {
  uuid: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
  role: string;
}

export interface SeedSoundtrack {
  uuid: string;
  name: string;
  duration: number;
  artist: string;
  album?: string;
  releaseDate: string;
  urls: string[];
  sources: string[];
}

function loadJSON<T>(filename: string): T {
  const filePath = join(__dirname, 'data', filename);
  return JSON.parse(readFileSync(filePath, 'utf-8')) as T;
}

export function loadOverview(): SeedOverview {
  return loadJSON<SeedOverview>('overview.json');
}

export function loadActors(): SeedActor[] {
  return loadJSON<SeedActor[]>('actors.json');
}

export function loadCharacters(): SeedCharacter[] {
  return loadJSON<SeedCharacter[]>('characters.json');
}

export function loadSeasons(): SeedSeason[] {
  return loadJSON<SeedSeason[]>('seasons.json');
}

export function loadEpisodes(): SeedEpisode[] {
  return loadJSON<SeedEpisode[]>('episodes.json');
}

export function loadLocations(): SeedLocation[] {
  return loadJSON<SeedLocation[]>('locations.json');
}

export function loadGames(): SeedGame[] {
  return loadJSON<SeedGame[]>('games.json');
}

export function loadSoundtracks(): SeedSoundtrack[] {
  return loadJSON<SeedSoundtrack[]>('soundtracks.json');
}

export function loadUsers(): SeedUser[] {
  return loadJSON<SeedUser[]>('users.json');
}
