## Voxera.live

Futuristic AI-powered global news platform built with Next.js App Router, TypeScript, Tailwind CSS, and Framer Motion.

### Stack

- Next.js 16 App Router
- TypeScript
- Tailwind CSS v4
- Framer Motion
- Shadcn-style component primitives

### Features

- Live breaking ticker and hero coverage
- AI summaries with key points and article timelines
- Search + category filtering + load-more feed exploration
- Dynamic article routes with OpenGraph metadata
- JSON-LD structured data, robots, sitemap, RSS
- API endpoints for feed and search
- Dark/light mode

### API provider setup

Create `.env.local`:

```bash
NEWS_API_KEY=...
GNEWS_API_KEY=...
MEDIASTACK_API_KEY=...
```

If keys are not configured, Voxera falls back to curated mock wire data.

### Run

```bash
npm install
npm run dev
```

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
