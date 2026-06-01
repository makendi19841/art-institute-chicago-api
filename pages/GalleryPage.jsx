import ArtworkCard from '../components/ArtworkCard';
import { STORAGE_KEY } from '../schemas/ArtworkSchema';
import { Navigate } from 'react-router'


// Read gallery artworks from localStorage
const getGallery = () => {
    try {
        return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}');
    } catch {
        return {};
    }
};


const GalleryPage = () => {

    const artworks = Object.values(getGallery());

    if ( artworks.length === 0) {

        return <p>No artwork in the gallery yet.</p>
    }

    return (

        <>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', padding: '2rem' }}>
                {artworks.map((artwork) => (
                    <ArtworkCard key={artwork.id} artwork={artwork} />
                ))}
            </div>
        </>
    )
};




export default GalleryPage;