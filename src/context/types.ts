export interface Translations {
  [key: string]: {
    [key: string]: string | Record<string, unknown>;
  };
} 