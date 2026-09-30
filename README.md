# Ping calculator

League of Legends ping statistics viewer built with SvelteKit, Svelte 5, Tailwind CSS 4 and Skeleton.

Enter a Riot ID to fetch a player's latest matches, then pick a match to see how many of each ping type every player used.

## Developing

Requires [Bun](https://bun.sh).

Create a `.env` file with a Riot Games API key:

```sh
PRIVATE_API_KEY=your_riot_api_key_here
```

Then install dependencies and start the dev server:

```sh
bun install
bun run dev

# or start the server and open the app in a new browser tab
bun run dev -- --open
```

## Scripts

| Command           | Description                     |
| ----------------- | ------------------------------- |
| `bun run dev`     | Start the dev server            |
| `bun run build`   | Create a production build       |
| `bun run preview` | Preview the production build    |
| `bun run check`   | Run `svelte-check`              |
| `bun run test`    | Run unit tests with Vitest      |
| `bun run lint`    | Check formatting and run ESLint |
| `bun run format`  | Format all files with Prettier  |

> To deploy your app, you may need to install an [adapter](https://svelte.dev/docs/kit/adapters) for your target environment.
