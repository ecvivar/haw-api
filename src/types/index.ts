export enum Role {
  ANONYMOUS = 'ANONYMOUS',
  BASIC = 'BASIC',
  DEV = 'DEV',
  MAINTAINER = 'MAINTAINER',
  ADMIN = 'ADMIN',
}

export interface BaseDTO {
  uuid?: string;
  href?: string;
  sources?: string[];
  thumbnail?: string;
  created_at?: string;
  updated_at?: string;
}

export interface CharacterDTO extends BaseDTO {
  first_name?: string;
  last_name?: string;
  nicknames?: string[];
  birth_date?: string;
  death_date?: string;
  gender?: number;
  actor?: string;
  images?: string[];
}

export interface ActorSocialDTO {
  social?: string;
  handle?: string;
  url?: string;
}

export interface ActorDTO extends BaseDTO {
  first_name?: string;
  last_name?: string;
  nicknames?: string[];
  birth_date?: string;
  death_date?: string;
  gender?: number;
  nationality?: string;
  seasons?: string[];
  awards?: string[];
  character?: string;
  socials?: ActorSocialDTO[];
  images?: string[];
}

export interface EpisodeTranslationDTO {
  language?: string;
  title?: string;
  description?: string;
}

export interface EpisodeDTO extends BaseDTO {
  title?: string;
  description?: string;
  language?: string;
  duration?: number;
  episode_num?: number;
  next_episode?: string;
  prev_episode?: string;
  season?: string;
  images?: string[];
}

export interface GameTranslationDTO {
  language?: string;
  name?: string;
  description?: string;
  genres?: string[];
  trailer?: string;
}

export interface GameDTO extends BaseDTO {
  playtime?: number;
  age_rating?: string;
  stores?: string[];
  modes?: string[];
  platforms?: string[];
  publishers?: string[];
  developers?: string[];
  tags?: string[];
  release_date?: string;
  website?: string;
  images?: string[];
}

export interface LocationTranslationDTO {
  language?: string;
  name?: string;
  description?: string;
}

export interface LocationDTO extends BaseDTO {
  images?: string[];
}

export interface OverviewTranslationDTO {
  language?: string;
  title?: string;
  description?: string;
}

export interface OverviewDTO extends BaseDTO {
  languages?: string[];
  creators?: string[];
}

export interface SeasonTranslationDTO {
  language?: string;
  title?: string;
  description?: string;
  genres?: string[];
  trailers?: string[];
}

export interface SeasonDTO extends BaseDTO {
  duration_total?: number;
  season_num?: number;
  release_date?: string;
  next_season?: string;
  prev_season?: string;
  episodes?: string[];
  soundtracks?: string[];
  budget?: number;
  images?: string[];
}

export interface SoundtrackDTO extends BaseDTO {
  name?: string;
  duration?: number;
  artist?: string;
  album?: string;
  release_date?: string;
  urls?: string[];
}

export interface UserRegistrationDTO {
  first_name?: string;
  last_name?: string;
  username: string;
  email: string;
  password: string;
  role?: string;
}

export interface UserAuthDTO {
  username?: string;
  email: string;
  password: string;
}

export interface UserDTO {
  uuid?: string;
  first_name?: string;
  last_name?: string;
  username?: string;
  email?: string;
  role?: string;
  token?: string;
  token_type?: string;
  created_at?: string;
  updated_at?: string;
}

export interface PaginationHeaders {
  'X-Pagination-Page-Index': number;
  'X-Pagination-Page-Size': number;
  'X-Pagination-Page-Total': number;
  'X-Pagination-Item-Total': number;
}

export interface PaginationResult<T> {
  data: T[];
  pagination: PaginationHeaders;
}

export interface ApiInfo {
  title: string;
  description: string;
  version: string;
  url: string;
  docs: string;
  github: string;
  githubHome: string;
  apiVersion: string;
  apiPath: string;
  apiBaseUrl: string;
  license: string;
  licenseUrl: string;
  languages: string[];
  defaultLanguage: string;
  enableRegistration: boolean;
}

export interface ErrorResponse {
  code: number;
  status: string;
  method: string;
  cause: string;
  message: string;
  timestamps: string;
  url: string;
  params?: Record<string, string>;
}

export interface FilterOperator {
  operator: string;
  value: string;
}
