import { resolve } from '$app/paths';

export type View = 'matches' | 'pings';

export type AccountRef = {
    region: string;
    name: string;
    tag: string;
};

// Route ids include the `(app)` group. Kept here so the components don't have to
// know about the group or about url-encoding.
const VIEW_ROUTES = {
    matches: '/(app)/matches/[region]/[name]/[tag]',
    pings: '/(app)/pings/[region]/[name]/[tag]'
} as const;

/**
 * Url for a view of an account, e.g. `/matches/euw/thebausffs/EUW?match=EUW1_123`.
 * Values are encoded here because `resolve` inserts route params as-is.
 */
export function accountViewHref(
    view: View,
    account: AccountRef,
    search: Record<string, string> = {}
): string {
    const params = {
        region: encodeURIComponent(account.region),
        name: encodeURIComponent(account.name),
        tag: encodeURIComponent(account.tag)
    };

    const resolved =
        view === 'pings'
            ? resolve(VIEW_ROUTES.pings, params)
            : resolve(VIEW_ROUTES.matches, params);

    const query = new URLSearchParams(search).toString();
    return query ? `${resolved}?${query}` : resolved;
}
