import { config } from '../config';

export function isSupportedLanguage(language: string): boolean {
  return config.language.supported.some(l => l.toLowerCase() === language.toLowerCase());
}

export function isDefaultLanguage(language: string): boolean {
  return language.toLowerCase() === config.language.default.toLowerCase();
}

export function getDefaultLanguage(): string {
  return config.language.default;
}

export function getLanguages(): string[] {
  return config.language.supported;
}
