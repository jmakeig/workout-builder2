/**
 *
 * @param {import('./l10n').Message} message
 * @param {string} [fallback = '']
 * @param {import('./l10n').Lang} [language = 'en']
 * @returns
 */
export function local(message, fallback = '', language) {
	if ('string' === typeof message) return message;
	language = language ?? window?.navigator?.language ?? 'en';
	if (language in message) return message[language];
	const lang = language.split('-')[0]; // language-region, e.g. en-US
	if (lang in message) return message[lang];
	if ('string' === typeof fallback) return fallback;
	throw new ReferenceError(`No message exists for ${language}`);
}
