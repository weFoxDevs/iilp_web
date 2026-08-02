This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Environment Setup

Before running the application, copy the example environment template and configure your local variables:

```bash
cp .env.example .env
```

### Configured Environment Variables

- `APP_NAME` / `NEXT_PUBLIC_APP_NAME`: The name of the application.
- `APP_PORT`: The port the app runs on (default: `3000`).
- `APP_URL` / `NEXT_PUBLIC_APP_URL`: The frontend application URL.
- `API_URL` / `NEXT_PUBLIC_API_URL`: The backend api endpoint (default: `http://localhost:8000`).

## Tailwind CSS & Design System Configuration

This project uses **Tailwind CSS v4** which organizes theme configurations directly inside CSS. 

We have configured a CSS variable-based design system in [`app/globals.css`](file:///Users/jonecoder/Projects/iilp_web/app/globals.css).

### How to Modify:
- **Colors**: Edit the CSS custom properties under `:root` (e.g. `--color-primary-500`, `--bg-app`) and their dark mode overrides (`@media (prefers-color-scheme: dark)` or `html.dark`).
- **Fonts**: Update `--font-sans-family` or `--font-mono-family` to switch system or next/font configurations.
- **Radii**: Modify `--radius-md` etc. to instantly adjust component border-radii across the entire site.

All variables are automatically linked to Tailwind utilities under the `@theme` block, allowing you to use standard utility classes (e.g., `bg-primary-500`, `text-text-muted`, `border-border-default`, `rounded-md`).

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

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load Geist, a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

