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

Cloudflare Workers Builds should deploy from Nitro's generated `.output` directory:

```text
Build command: npm run build
Deploy command: npm run deploy
Test environment deploy command: npm run deploy:preview
```

`npm run build` lets Nitro generate the Cloudflare Wrangler deployment config under `.output/server/wrangler.json`, and `npm run deploy` runs Wrangler with `--cwd .output` so the generated output is deployed. Production deploys the `takumi` Worker. The `deploy:preview` script deploys the same generated output with an explicit `--name test-takumi` override for `test.takumi.com.my`.

Required Worker variables and secrets should be configured in Cloudflare without committing secret values. The app reads Basic Auth and Kuroco values from server-only runtime config or Cloudflare runtime bindings.

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.

## Runtime Config

The app reads Kuroco CMS values from server-side Nuxt runtime config. Defaults match the migrated source project, and production can override them with:

```bash
NUXT_BASIC_AUTH_USERNAME=
NUXT_BASIC_AUTH_PASSWORD=
NUXT_BASIC_AUTH_ENABLED=false
NUXT_BASIC_AUTH_PREVIEW_HOSTNAMES=
KUROCO_BASE_URL=
KUROCO_HOME_ID=
KUROCO_HOME_SLUG_ID=
KUROCO_NEWS_BLOG_ID=
KUROCO_PRODUCTS_ID=
KUROCO_KNIVES_ID=
KUROCO_FORM_JP_ID=
KUROCO_FORM_ENG_ID=
NUXT_PUBLIC_SITE_URL=
```

## Reusable Skills

This project uses reusable implementation skills from `docs/skills`, which is a Git submodule.

Before non-trivial implementation work, inspect `docs/skills` for a matching `SKILL.md` and follow it unless project-specific instructions conflict.

To update skills:

```bash
git submodule update --remote docs/skills
git add docs/skills
git commit -m "chore(skills): update reusable patterns"
```
