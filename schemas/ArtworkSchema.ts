import { z } from "zod";

export const STORAGE_KEY = 'gallery_artworks';

export const NOTES_KEY = 'gallery_notes';

export const NoteSchema = z.object({
  artworkId: z.number().int().nonnegative(),
  text: z.string().trim().min(1, 'Note cannot be empty').max(300, 'Note too long than 300 chars'),
  updateAt: z.string().datetime().optional(),
})

export type Note = z.infer<typeof NoteSchema>;

// Shapes returned by the Art Institute of Chicago API
// https://api.artic.edu/api/v1/artworks
//
// CONCEPT: Zod + TypeScript
// TypeScript checks your code while you write it.
// Zod checks real API data while the app is running.
//
// This matters because external APIs may return null, missing fields,
// or unexpected data. Zod protects your React app from crashing.

// Default IIIF image base URL.
// The API response may also provide this as `config.iiif_url`.
export const DEFAULT_IIIF_BASE_URL = "https://www.artic.edu/iiif/2";

// CONCEPT: Helper schemas for safe defaults
// `.default()` only handles undefined, not null.
// The Art Institute API often uses null, so we use `.nullish().transform()`.
const stringWithDefault = (fallback: string) =>
  z
    .string()
    .trim()
    .nullish()
    .transform((value) => (value && value.length > 0 ? value : fallback));

const stringOrNull = z
  .string()
  .trim()
  .nullish()
  .transform((value) => (value && value.length > 0 ? value : null));

const numberOrNull = z
  .number()
  .nullish()
  .transform((value) => value ?? null);

// Thumbnail object inside each artwork.
// We only type the fields useful for display.
export const ThumbnailSchema = z
  .object({
    lqip: stringOrNull,
    width: numberOrNull,
    height: numberOrNull,
    alt_text: stringOrNull,
  })
  .nullish()
  .transform((value) => value ?? null);

// One artwork inside the `data` array.
//
// Important:
// `id` is required because React needs it for keys and detail pages.
// For title and artist, we provide safe display defaults.
// For image_id, we return null if missing because no image can be built.
export const ArtworkSchema = z.object({
  id: z.number().int().nonnegative(),

  title: stringWithDefault("Untitled"),

  artist_title: stringWithDefault("Unknown artist"),

  image_id: stringOrNull,

  thumbnail: ThumbnailSchema,
});

// Pagination object returned by the list/search endpoint.
export const PaginationSchema = z.object({
  total: z.number().int().nonnegative().catch(0),
  limit: z.number().int().nonnegative().catch(0),
  offset: z.number().int().nonnegative().catch(0),
  total_pages: z.number().int().nonnegative().catch(0),
  current_page: z.number().int().nonnegative().catch(1),
  next_url: stringOrNull,
});

// Config object returned by the API.
// `iiif_url` is used to build real image URLs.
export const ConfigSchema = z
  .object({
    iiif_url: z.string().url().catch(DEFAULT_IIIF_BASE_URL),
    website_url: stringOrNull,
  })
  .default({
    iiif_url: DEFAULT_IIIF_BASE_URL,
    website_url: null,
  });

// Build a displayable artwork image URL from image_id.
export function buildArtworkImageUrl(
  imageId: string | null | undefined,
  iiifBaseUrl = DEFAULT_IIIF_BASE_URL,
  width = 843
): string | null {
  if (!imageId) return null;

  return `${iiifBaseUrl}/${imageId}/full/${width},/0/default.jpg`;
}

// Raw artwork type directly after Zod validation.
export type RawArtwork = z.infer<typeof ArtworkSchema>;

// Artwork type used by your React components.
// This adds `image_url` and `alt_text` for easier rendering.
export type Artwork = RawArtwork & {
  image_url: string | null;
  alt_text: string;
};

// Convert validated API artwork into frontend-ready artwork.
export function normalizeArtwork(
  artwork: RawArtwork,
  iiifBaseUrl = DEFAULT_IIIF_BASE_URL
): Artwork {
  return {
    ...artwork,
    image_url: buildArtworkImageUrl(artwork.image_id, iiifBaseUrl),
    alt_text: artwork.thumbnail?.alt_text ?? artwork.title,
  };
}

// Full list response from `/artworks`.
export const ArtworkListResponseSchema = z
  .object({
    pagination: PaginationSchema,
    data: z.array(ArtworkSchema).default([]),
    config: ConfigSchema,
  })
  .transform((response) => ({
    ...response,
    data: response.data.map((artwork) =>
      normalizeArtwork(artwork, response.config.iiif_url)
    ),
  }));

export const ArtworkSearchResponseSchema = ArtworkListResponseSchema; 

// Full detail response from `/artworks/{id}`.
export const ArtworkDetailResponseSchema = z
  .object({
    data: ArtworkSchema,
    config: ConfigSchema,
  })
  .transform((response) => ({
    ...response,
    data: normalizeArtwork(response.data, response.config.iiif_url),
  }));

// Final TypeScript types inferred from Zod.
export type ArtworkListResponse = z.infer<typeof ArtworkListResponseSchema>;
export type ArtworkDetailResponse = z.infer<typeof ArtworkDetailResponseSchema>;