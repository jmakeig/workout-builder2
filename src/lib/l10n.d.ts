export type Lang = 'en' | 'fr' | 'de' | 'jp' | 'zh' | 'he';
export type Message = string | { [L in Lang]?: string };
export function local(
	message: Message,
	fallback?: string | undefined,
	language?: Lang | undefined
): string;
