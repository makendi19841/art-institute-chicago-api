import { useState } from 'react';
import { DEFAULT_IIIF_BASE_URL, STORAGE_KEY } from '../schemas/ArtworkSchema';



const buildImageUrl = (image_id) => {
    if (!image_id) return null;
    return `${DEFAULT_IIIF_BASE_URL}/${image_id}/full/400,/0/default.jpg`;
};

// Read liked artworks from localStorage
const getLiked = () => {
    try {
        return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}');
    } catch {
        return {};
    }
};

const ArtworkCard = ({ artwork }) => {
    const imageUrl = buildImageUrl(artwork.image_id);
    const altText  = artwork.thumbnail?.alt_text ?? artwork.title;

    // Check if this artwork is already liked on first render
    const [liked, setLiked] = useState(() => !!getLiked()[artwork.id]);

    const handleLike = () => {
        const current = getLiked();

        if (liked) {
            // Unlike — remove from localStorage
            delete current[artwork.id];
        } else {
            // Like — save artwork object to localStorage
            current[artwork.id] = artwork;
        }

        localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
        setLiked(!liked);
    };

    return (
        <div style={{
            width: '300px',
            border: '1px solid #ddd',
            borderRadius: '8px',
            overflow: 'hidden',
            boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
            fontFamily: 'sans-serif'
        }}>
            {/* Image */}
            {imageUrl
                ? <img
                    src={imageUrl}
                    alt={altText}
                    style={{ width: '100%', height: '220px', objectFit: 'cover', display: 'block' }}
                  />
                : <div style={{
                    height: '220px',
                    background: '#f0f0f0',
                    display: 'grid',
                    placeItems: 'center',
                    color: '#999',
                    fontSize: '0.875rem'
                  }}>
                    No image available
                  </div>
            }

            {/* Info */}
            <div style={{ padding: '1rem' }}>
                <h2 style={{ fontSize: '1rem', margin: '0 0 0.25rem', color: '#222' }}>
                    {artwork.title}
                </h2>
                <p style={{ fontSize: '0.875rem', margin: 0, color: '#666' }}>
                    {artwork.artist_title}
                </p>
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                    <button
                        className={`btn btn-sm ${liked ? 'btn-neutral text-gray-400'  : 'btn-ghost'}`}
                        onClick={handleLike}
                    >
                        {liked ? 'In Gallery' : 'Add to Gallery'}
                        <svg xmlns="http://www.w3.org/2000/svg"
                            fill={liked ? 'currentColor' : 'none'}
                            viewBox="0 0 24 24"
                            strokeWidth="2.5"
                            stroke="currentColor"
                            className="size-[1.2em]">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ArtworkCard;