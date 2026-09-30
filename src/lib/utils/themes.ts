// All themes shipped with Skeleton. Keep in sync with the theme imports in src/app.css.
export const THEMES = [
	'catppuccin',
	'cerberus',
	'concord',
	'crimson',
	'dracula',
	'fennec',
	'hamlindigo',
	'legacy',
	'mint',
	'modern',
	'mona',
	'nosh',
	'nouveau',
	'pine',
	'reign',
	'rocket',
	'rose',
	'rosepine',
	'sahara',
	'seafoam',
	'terminus',
	'vintage',
	'vox',
	'wintry'
] as const;

export type Theme = (typeof THEMES)[number];

export const DEFAULT_THEME: Theme = 'crimson';

export function isTheme(value: unknown): value is Theme {
	return typeof value === 'string' && (THEMES as readonly string[]).includes(value);
}
