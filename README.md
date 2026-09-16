# Simple Todo List

A small React + Vite todo app built with [shadcn/ui](https://ui.shadcn.com) and Tailwind CSS v4.

## Getting started

```bash
npm install
npm run dev
```

Other scripts:

| Script | Description |
| --- | --- |
| `npm run dev` | Start the Vite dev server |
| `npm run build` | Production build into `dist/` |
| `npm run preview` | Preview the production build |
| `npm run lint` | Run Oxlint |

Tailwind and shadcn/ui are **already configured** in this repo. If you only want to add more
components, jump to [Adding components](#adding-components). The two sections below document how the
setup was done, so you can reproduce it in a fresh Vite project.

## Setting up Tailwind CSS v4

### 1. Create the Vite + React project

```bash
npm create vite@latest simple-todo-list -- --template react
cd simple-todo-list
npm install
```

### 2. Install Tailwind and its Vite plugin

```bash
npm install tailwindcss @tailwindcss/vite
```

Tailwind v4 has no `tailwind.config.js` and no PostCSS setup — the Vite plugin does the work, and
configuration lives in CSS.

### 3. Register the plugin in `vite.config.js`

```js
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
})
```

### 4. Import Tailwind in your CSS

Replace the contents of `src/index.css` with a single line:

```css
@import "tailwindcss";
```

That one import replaces the v3 `@tailwind base/components/utilities` trio. Make sure the file is
imported by your entry point — in `src/main.jsx`:

```js
import './index.css'
```

### 5. Configure the `@/` path alias

Not strictly a Tailwind step, but the shadcn CLI writes components to `@/components`, so both the
bundler and the editor need to resolve that alias.

`jsconfig.json` (create it if missing — use `tsconfig.json` in a TypeScript project):

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src"]
}
```

`vite.config.js`:

```js
import path from 'node:path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
```

### Customizing the Tailwind theme

In v4 you extend the theme from CSS with `@theme` instead of a JS config. This project maps a custom
font and lets shadcn's CSS variables drive the color and radius scales:

```css
@theme inline {
  --font-sans: 'Geist Variable', sans-serif;
  --font-heading: var(--font-sans);
  --color-primary: var(--primary);
  --radius-lg: var(--radius);
}
```

Every token you declare becomes a utility class: `--color-primary` gives you `bg-primary`,
`text-primary`, `border-primary`; `--font-sans` gives you `font-sans`; `--radius-lg` gives you
`rounded-lg`. The `inline` keyword tells Tailwind to resolve the `var()` at build time so the
light/dark values below still apply at runtime.

Base styles go in `@layer base`, as this project does in `src/index.css`:

```css
@layer base {
  * {
    @apply border-border outline-ring/50;
  }
  body {
    @apply bg-background text-foreground;
  }
  html {
    @apply font-sans;
  }
}
```

### Dark mode

shadcn's init adds a class-based dark variant rather than relying on the OS setting:

```css
@custom-variant dark (&:is(.dark *));
```

With that in place, `dark:` utilities apply to anything inside an element carrying the `dark` class,
and the `.dark` block in `src/index.css` swaps the theme variables. Toggle it by putting the class on
`<html>`:

```js
document.documentElement.classList.toggle('dark')
```

## Setting up shadcn/ui

### 1. Initialize shadcn/ui

```bash
npx shadcn@latest init
```

The CLI asks a few questions (style, base color, CSS file, whether you use TypeScript) and then
writes `components.json`, adds the theme tokens to your CSS, and installs the runtime dependencies.
This project answered with:

- **Style:** `radix-nova`
- **Base color:** `neutral`
- **CSS variables:** yes
- **TypeScript:** no (`"tsx": false`, so components are generated as `.jsx`)
- **Icon library:** `lucide`

The resulting `components.json`:

```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "radix-nova",
  "rsc": false,
  "tsx": false,
  "tailwind": {
    "config": "",
    "css": "src/index.css",
    "baseColor": "neutral",
    "cssVariables": true,
    "prefix": ""
  },
  "iconLibrary": "lucide",
  "rtl": false,
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui",
    "lib": "@/lib",
    "hooks": "@/hooks"
  },
  "menuColor": "default",
  "menuAccent": "subtle",
  "registries": {}
}
```

> `"tsx": false` matters — if you leave it at the default `true`, the CLI will drop `.tsx` files into
> a project that has no TypeScript toolchain.

### 2. What `init` adds

- **`src/index.css`** — the theme layer, written on top of your Tailwind import:

  ```css
  @import "tailwindcss";
  @import "tw-animate-css";
  @import "shadcn/tailwind.css";

  @custom-variant dark (&:is(.dark *));

  @theme inline {
    /* --color-* and --radius-* tokens mapped to the CSS variables below */
  }

  :root {
    /* light theme values, in oklch() */
  }

  .dark {
    /* dark theme values */
  }
  ```

  Order matters: `@import "tailwindcss"` must come first, and any font or extra stylesheet imports
  must sit with the other `@import` rules at the top of the file.

- **`src/lib/utils.js`** — the `cn` class-merging helper every generated component imports:

  ```js
  export { cn } from "cn"
  ```

- **Dependencies** — `shadcn`, `radix-ui`, `class-variance-authority`, `cn`, `lucide-react`, and
  `tw-animate-css`.

This project additionally imports a font in `src/index.css` and maps it in the theme block:

```css
@import "@fontsource-variable/geist";

@theme inline {
  --font-sans: 'Geist Variable', sans-serif;
  --font-heading: var(--font-sans);
}
```

## Adding components

```bash
npx shadcn@latest add button card input
```

Components land in `src/components/ui/` as plain source files you own and can edit directly. Already
installed here: `button`, `card`, `input`.

Browse the full catalog at [ui.shadcn.com/docs/components](https://ui.shadcn.com/docs/components).

Import them through the alias:

```jsx
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
```

## Project structure

```
src/
├── App.jsx                 # App shell and todo state
├── main.jsx                # React entry point
├── index.css               # Tailwind import + shadcn theme tokens
├── assets/
├── components/
│   ├── TodoForm.jsx        # Add-todo form
│   ├── TodoItem.jsx        # Single todo row
│   ├── TodoList.jsx        # Renders the list
│   └── ui/                 # shadcn/ui components (generated, editable)
│       ├── button.jsx
│       ├── card.jsx
│       └── input.jsx
└── lib/
    └── utils.js            # cn() helper
```

## Troubleshooting

- **`Cannot find module '@/components/ui/button'`** — the alias is missing from `vite.config.js` or
  `jsconfig.json`. Both are required: Vite resolves it at build time, the editor at author time.
- **CLI generates `.tsx` files** — set `"tsx": false` in `components.json`.
- **Components render unstyled / no Tailwind classes apply** — check that `src/index.css` is imported
  in `src/main.jsx` and that `@tailwindcss/vite` is in the `plugins` array of `vite.config.js`.
- **`Unknown at rule @tailwind`** — you're on v3 syntax. Tailwind v4 uses a single
  `@import "tailwindcss";`.
- **Editing `tailwind.config.js` has no effect** — v4 doesn't read it. Move theme customization into
  an `@theme` block in `src/index.css`.
- **`dark:` utilities never activate** — the dark variant here is class-based, so the `dark` class has
  to be on an ancestor (normally `<html>`); it does not follow the OS setting on its own.
- **Colors look wrong after `init`** — `init` may have overwritten `src/index.css`. Re-add any custom
  imports (such as the font) alongside the Tailwind and shadcn imports.
