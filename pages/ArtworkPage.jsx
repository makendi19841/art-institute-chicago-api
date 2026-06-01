/* import { useFetch } from '../hooks/useFetch';
import { ArtworkDetailResponseSchema } from '../schemas/ArtworkSchema';
import { urls } from '../api/artworkapi';
import ArtworkCard from '../components/ArtworkCard';

const TEST_ID = 27992; // A known artwork ID from the Art Institute of Chicago

const ArtworkPage = () => {
    const state = useFetch(urls.detail(TEST_ID), ArtworkDetailResponseSchema);

    if (state.status === 'idle')    return <p>Waiting...</p>;
    if (state.status === 'loading') return <p>Loading artwork...</p>;
    if (state.status === 'error')   return <p style={{ color: 'red' }}>Error: {state.error}</p>;

    return (
        <main style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
            <h1>Artwork Test Page</h1>
            <ArtworkCard artwork={state.data.data} />
        </main>
    );
};

export default ArtworkPage; */

import { useState } from 'react';
import { Link, Routes, Route} from 'react-router'
import { useFetch } from '../hooks/useFetch';
import { ArtworkSearchResponseSchema } from '../schemas/ArtworkSchema';
import { urls } from '../api/artworkapi';
import ArtworkCard from '../components/ArtworkCard';

const ArtworkPage = () => {
    const [query, setQuery]   = useState('monet');
    const [search, setSearch] = useState('monet'); 

    const state = useFetch(urls.search(search), ArtworkSearchResponseSchema);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (query.trim()) setSearch(query.trim()); 
    };

    return (
        <>
            <header className="w-full bg-black text-white py-12 px-8 mb-8">
                <div className="max-w-5xl mx-auto">
                    {/* Top bar — label left, nav right */}
                    <div className="flex justify-between items-center mb-8">
                        <p className="text-xs uppercase tracking-[0.3em] text-gray-400">
                            Collection Explorer
                        </p>
                        <Link
                            to="/gallery"
                            className="text-xs uppercase tracking-[0.2em] text-gray-400 hover:text-white border border-gray-600 hover:border-white px-4 py-2 transition-colors duration-200"
                        >
                            My Gallery
                        </Link>
                    </div>
                    
                    
                    {/* Hero text */}
                    <h1 className="text-6xl font-thin tracking-tight leading-none mb-4">
                        Art Institute
                        <span className="block font-light text-gray-300">of Chicago</span>
                    </h1>
                    <div className="w-16 h-[1px] bg-white mt-6 mb-6" />
                    <p className="text-gray-400 text-sm max-w-md leading-relaxed">
                        Explore nearly 132,000 published artworks spanning thousands of years of history from one of the world's great encyclopedic museums.
                    </p>
                
                </div>
            </header>


            <main style={{ padding: '2rem', fontFamily: 'sans-serif', maxWidth: '1200px', margin: '0 auto' }}>
            
            {/* Search Bar */}
            <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem' }}>
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search artworks..."
                    style={{
                        flex: 1,
                        padding: '0.5rem 1rem',
                        fontSize: '1rem',
                        border: '1px solid #ccc',
                        borderRadius: '6px'
                    }}
                />
                <button
                    type="submit"
                    style={{
                        padding: '0.5rem 1.5rem',
                        fontSize: '1rem',
                        background: '#1a1a1a',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer'
                    }}
                >
                    Search
                </button>
            </form>

            {/* Status feedback */}
            {state.status === 'idle'    && <p>Start searching...</p>}
            {state.status === 'loading' && <p>Loading results...</p>}
            {state.status === 'error'   && <p style={{ color: 'red' }}>Error: {state.error}</p>}

            {/* Results Grid */}
            {state.status === 'success' && (
                <>
                    <p style={{ color: '#666', marginBottom: '1rem' }}>
                        {state.data.pagination.total} results for "<strong>{search}</strong>"
                    </p>
                    <div style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '1.5rem',
                    }}>
                        {state.data.data.map((artwork) => (
                            <ArtworkCard key={artwork.id} artwork={artwork} />
                        ))}
                    </div>
                </>
            )}

        </main>

        {/* Footer — outside main so it spans full viewport width */}
        <footer style={{
            textAlign: 'center',
            padding: '1rem',
            marginTop: '2rem',
            backgroundColor: '#e5e7eb',
            color: '#374151',
            fontSize: '0.875rem'
        }}>
            <p>Copyright © {new Date().getFullYear()} - All right reserved by Amos Makendi</p>
        </footer>

        </>
        
        
    );
};

export default ArtworkPage;