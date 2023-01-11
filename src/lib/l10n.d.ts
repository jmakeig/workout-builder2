export type Lang = 'en' | 'fr' | 'de' | 'jp' | 'zh' | 'he';
export type Message = string | { [L in Lang]?: string };
