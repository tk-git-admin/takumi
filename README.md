# Takumi SSR Frontend

Look at the [Nuxt 3 documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

## Setup

Initialize repository-local reusable skills:

```bash
git submodule update --init --recursive
```

Make sure to install the dependencies:

```bash
# yarn
yarn install

# npm
npm install

# pnpm
pnpm install
```

## Development Server

Start the development server on `http://localhost:3000`

```bash
npm run dev
```

## Production

Build the Nitro SSR server:

```bash
npm run build
```

Run the built server:

```bash
npm run start
```

Locally preview production build with Nuxt:

```bash
npm run preview
```

Deploy to Cloudflare Workers:

```bash
npm run build
npm run deploy
```

Cloudflare Workers Builds should use these settings:

```text
Root directory: /
Build command: npm run build
Deploy command: npm run deploy
Version command: npx wrangler versions upload
```

`npm run build` lets Nitro generate the Cloudflare Wrangler deployment config under `.output/server/wrangler.json`. `npm run deploy` runs Wrangler with `--cwd .output` so the generated output is deployed. The version command runs from the repository root and follows Nitro's generated `.wrangler/deploy/config.json` redirect to the same generated Worker config. Production deploys the `takumi` Worker. `test-takumi.bridge-asia.workers.dev` is the `test` branch preview alias for the `takumi` Worker, not a separate Worker name. Wrangler 4.21.0+ is required for Cloudflare Workers Builds to create the branch preview alias.

Required Worker variables and secrets should be configured in Cloudflare without committing secret values. The app reads Basic Auth and Kuroco values from server-only runtime config or Cloudflare runtime bindings.

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.

## Runtime Config

The app reads Kuroco CMS values from server-side Nuxt runtime config. Defaults match the migrated source project, and production can override them with:

```bash
NUXT_BASIC_AUTH_USERNAME=
NUXT_BASIC_AUTH_PASSWORD=
NUXT_BASIC_AUTH_ENABLED=false
NUXT_BASIC_AUTH_PREVIEW_HOSTNAMES=
NUXT_PUBLIC_GTM_ID=GTM-NJP9WCVD
KUROCO_BASE_URL=
KUROCO_HOME_ID=
KUROCO_HOME_SLUG_ID=
KUROCO_NEWS_BLOG_ID=
KUROCO_PRODUCTS_ID=
KUROCO_KNIVES_ID=
KUROCO_FORM_JP_ID=
KUROCO_FORM_ENG_ID=
KUROCO_HOMEPAGE_TOKEN=
KUROCO_NEWS_TOKEN=
KUROCO_PRODUCTS_TOKEN=
KUROCO_KNIVES_TOKEN=
NUXT_PUBLIC_SITE_URL=
```

`NUXT_PUBLIC_GTM_ID` is the public Google Tag Manager container ID for Consent Mode v2.
Set it as a build variable for environments that should emit GTM; leaving it blank omits
the GTM script and noscript fallback from rendered pages.

Kuroco static API tokens are server-only read tokens. `KUROCO_HOMEPAGE_TOKEN` is used for
homepage, SEIBU content, and SEIBU workshop reads; `KUROCO_NEWS_TOKEN` is used for news reads;
`KUROCO_PRODUCTS_TOKEN` is used for product reads; and `KUROCO_KNIVES_TOKEN` is used for knife
reads. These tokens are not sent with contact or SEIBU reservation form submissions.

## Reusable Skills

This project uses reusable implementation skills from `docs/skills`, which is a Git submodule.

Before non-trivial implementation work, inspect `docs/skills` for a matching `SKILL.md` and follow it unless project-specific instructions conflict.

To update skills:

```bash
git submodule update --remote docs/skills
git add docs/skills
git commit -m "chore(skills): update reusable patterns"
```
