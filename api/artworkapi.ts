const BASE_URL = "https://api.artic.edu/api/v1";

const ARTWORK_FIELDS = "id,title,artist_title,image_id";

const DEFAULT_IIIF_BASE_URL = "https://www.artic.edu/iiif/2";

// Convenience: URL builders for the generic useFetch hook.
export const urls = {
  // Get a paginated list of artworks
  list: (limit = 24, page = 1) =>
    `${BASE_URL}/artworks?limit=${limit}&page=${page}&fields=${ARTWORK_FIELDS}`,

  // Get one artwork by id
  detail: (id: number | string) =>
    `${BASE_URL}/artworks/${id}?fields=${ARTWORK_FIELDS}`,

  // Search artworks by text
  search: (query: string, limit = 24, page = 1) =>
    `${BASE_URL}/artworks/search?q=${encodeURIComponent(
      query
    )}&limit=${limit}&page=${page}&fields=${ARTWORK_FIELDS}`,

  // Search only public-domain artworks
  publicDomainSearch: (query: string, limit = 24, page = 1) =>
    `${BASE_URL}/artworks/search?q=${encodeURIComponent(
      query
    )}&query[term][is_public_domain]=true&limit=${limit}&page=${page}&fields=${ARTWORK_FIELDS}`,

  // Get several specific artworks by ids
  byIds: (ids: Array<number | string>) =>
    `${BASE_URL}/artworks?ids=${ids.join(",")}&fields=${ARTWORK_FIELDS}`,

  // Build an image URL from image_id
  image: (
    imageId: string,
    iiifBaseUrl = DEFAULT_IIIF_BASE_URL,
    width = 843
  ) => `${iiifBaseUrl}/${imageId}/full/${width},/0/default.jpg`,
};