/**
 * Riot platform codes used in the url, mapped to the regional routing value that
 * `account-v1` and `match-v5` expect in their hostname ({routing}.api.riotgames.com).
 * Riot exposes three regional routing values: europe, americas and asia.
 */
export const REGIONS = {
    euw: { label: 'EUW', routing: 'europe' },
    eune: { label: 'EUNE', routing: 'europe' },
    tr: { label: 'TR', routing: 'europe' },
    ru: { label: 'RU', routing: 'europe' },
    na: { label: 'NA', routing: 'americas' },
    br: { label: 'BR', routing: 'americas' },
    lan: { label: 'LAN', routing: 'americas' },
    las: { label: 'LAS', routing: 'americas' },
    kr: { label: 'KR', routing: 'asia' },
    jp: { label: 'JP', routing: 'asia' },
    oce: { label: 'OCE', routing: 'asia' },
    ph: { label: 'PH', routing: 'asia' },
    sg: { label: 'SG', routing: 'asia' },
    th: { label: 'TH', routing: 'asia' },
    tw: { label: 'TW', routing: 'asia' },
    vn: { label: 'VN', routing: 'asia' }
} as const;

export type Region = keyof typeof REGIONS;

export function isRegion(value: string): value is Region {
    return Object.hasOwn(REGIONS, value);
}

/** The Riot host for a region, e.g. `euw` -> `europe.api.riotgames.com`. */
export function regionalHost(region: Region): string {
    return `${REGIONS[region].routing}.api.riotgames.com`;
}
