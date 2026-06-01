# 🎨 Art Institute of Chicago — Collection Explorer

> A tool for searching the Art Institute of Chicago's collection, saving favourite artworks to a personal gallery, and adding notes.

---

## 📋 Project Overview

This project practises integrating a third-party API, validating data with Zod, and building a dynamic user interface with React and TypeScript.

- **API:** [Art Institute of Chicago Public API](https://api.artic.edu/docs/)

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm

### Installation

```bash
# Scaffold the project
npm create vite@latest art-institute-chicago-api -- --template react-ts

# Navigate into project
cd art-institute-chicago-api

# Install dependencies
npm install

# Install Zod
npm install zod

# Install Router
npm install react-router

# Install Tailwindcss
npm install -D @tailwindcss/vite tailwindcss

# Install daisyUI
npm install daisyui@latest
```

### Tailwind CSS Setup

Add the Tailwind plugin to `vite.config.ts`:

```ts
import tailwindcss from '@tailwindcss/vite'

export default {
  plugins: [tailwindcss()]
}
```

Add to `src/index.css`:

```css
@import "tailwindcss";
@plugin "daisyui";
```

### Run locally

```bash
npm run dev
```

---

## 📝 Functional Requirements

| ID | Requirement | Description |
|---|---|---|
| FR001 | React + Vite (TypeScript) Setup | Scaffold with `npm create vite@latest my-app -- --template react-ts` |
| FR002 | Install Core Dependencies | Add Zod via `npm install zod` |
| FR003 | Artwork Zod Schema | Create `ArtworkSchema` covering `id`, `title`, `artist_title`, `image_id` with sensible defaults |
| FR004 | API Fetch with Validation | Query the AIC search endpoint, parse JSON, validate with `ArtworkSchema` |
| FR005 | Search Interface | Allow users to query the API via a search bar |
| FR006 | ArtworkCard Component | Reusable card showing artwork image, title, and artist |
| FR007 | Gallery Component | Display the collection of artworks the user has saved |
| FR008 | Create — Add to Gallery | On "Add to Gallery" click, push artwork object into `localStorage` |
| FR009 | Read — Display Gallery | Gallery renders every saved artwork using `ArtworkCard` |
| FR010 | Update — Notes per Artwork | Add/edit a short text note per artwork; validate with a Zod schema |
| FR011 | Delete — Remove from Gallery | Control to delete an artwork and its note from the gallery |
| FR012 | Type-Safe State | TypeScript types throughout, re-using Zod-inferred types where possible |

---

## 🗂️ Project Structure

```
src/
├── api/              # API base URLs and fetch helpers
├── components/       # ArtworkCard, Gallery
├── hooks/            # useFetch (generic, reusable)
├── pages/            # ArtworkPage, GalleryPage
├── schemas/          # Zod schemas (ArtworkSchema, NoteSchema)
└── types/            # Shared TypeScript types (FetchState, etc.)
```

---

## 🔑 Key Technical Decisions

| Decision | Reason |
|---|---|
| **Zod validation** | API data is untrusted — validated at runtime before use |
| **Generic `useFetch<T>` hook** | Reusable across any endpoint and schema |
| **`localStorage` for gallery** | Persistence without a backend |
| **`AbortController`** | Cancels stale requests on fast searches |
| **Zod-inferred types** | Single source of truth — schema and type stay in sync |

---

## 📡 API Reference

Base URL: `https://api.artic.edu/api/v1`

| Endpoint | Method | Description |
|---|---|---|
| `/artworks/search?q={query}` | GET | Search artworks by keyword |
| `/artworks/{id}` | GET | Fetch a single artwork by ID |

---

## 🛠️ Tech Stack

- [React](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vitejs.dev/)
- [Zod](https://zod.dev/)
- [Tailwind CSS v4](https://tailwindcss.com/)
- [daisyUI v5](https://daisyui.com/)
- [React Router](https://reactrouter.com/)
