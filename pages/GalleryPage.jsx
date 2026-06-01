import { useState } from 'react';
import ArtworkCard from '../components/ArtworkCard';
import { STORAGE_KEY, NOTES_KEY, NoteSchema } from '../schemas/ArtworkSchema';
import { useNavigate } from 'react-router'


// Read gallery artworks from localStorage
const getGallery = () => {
    try {
        return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}');
    } catch {
        return {};
    }
};

const getNotes = () => {
    try { return JSON.parse(localStorage.getItem(NOTES_KEY) ?? '{}'); }
    catch { return {}; }
};


const GalleryPage = () => {
    const navigate = useNavigate();
    const artworks = Object.values(getGallery());

    const [notes, setNotes] = useState(getNotes); // { [artworkId]: Note }
    const [editing, setEditing]  = useState(null); // artworkId being edited
    const [draft, setDraft] = useState('');
    const [error, setError] = useState('');


    const handleEdit = (id, existing) => {
        setEditing(id);
        setDraft(existing?.text ?? '');
        setError('');
    };

    const handleSave = (artworkId) => {
        const result = NoteSchema.safeParse({
            artworkId,
            text: draft,
            updatedAt: new Date().toISOString(),
        });

        if (!result.success) {
            setError(result.error.issues[0].message); // Zod validation message
            return;
        }

        const updated = { ...notes, [artworkId]: result.data };
        localStorage.setItem(NOTES_KEY, JSON.stringify(updated));
        setNotes(updated);
        setEditing(null);
        setError('');
    };

    const handleDelete = (artworkId) => {
        const updated = { ...notes };
        delete updated[artworkId];
        localStorage.setItem(NOTES_KEY, JSON.stringify(updated));
        setNotes(updated);
    };



    if (artworks.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-64 gap-4">
                <p className="text-gray-400">No artworks in your gallery yet.</p>
                <button
                    className="btn btn-sm"
                    onClick={() => navigate('/')}       
                >
                    ← Back to Search
                </button>
            </div>
        );
    }

    return (

        <>
            <div className="p-8">
                <button
                    className="btn btn-sm btn-ghost mb-6"
                    onClick={() => navigate('/')}        
                >
                    ← Back
                </button>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem' }}>
                    {artworks.map((artwork) => (
                        <div key={artwork.id} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', width: '300px' }}>

                            <ArtworkCard artwork={artwork} />

                            {/* Note display / edit */}
                            {editing === artwork.id ? (
                                <div className="flex flex-col gap-2 p-2 border border-gray-300 rounded">
                                    <textarea
                                        className="textarea textarea-bordered text-sm w-full"
                                        rows={3}
                                        maxLength={300}
                                        value={draft}
                                        onChange={(e) => setDraft(e.target.value)}
                                        placeholder="Write a note..."
                                        autoFocus
                                    />
                                    {error && <p className="text-xs text-red-500">{error}</p>}
                                    <div className="flex gap-2 justify-end">
                                        <button className="btn btn-xs btn-ghost" onClick={() => setEditing(null)}>
                                            Cancel
                                        </button>
                                        <button className="btn btn-xs btn-primary" onClick={() => handleSave(artwork.id)}>
                                            Save
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex flex-col gap-1 px-1">
                                    {notes[artwork.id] ? (
                                        <>
                                            <p className="text-sm text-gray-600 italic">"{notes[artwork.id].text}"</p>
                                            <div className="flex gap-2">
                                                <button className="btn btn-xs btn-ghost" onClick={() => handleEdit(artwork.id, notes[artwork.id])}>
                                                    ✏️ Edit note
                                                </button>
                                                <button className="btn btn-xs btn-ghost text-red-400" onClick={() => handleDelete(artwork.id)}>
                                                    🗑 Delete note
                                                </button>
                                            </div>
                                        </>
                                    ) : (
                                        <button className="btn btn-xs btn-ghost self-start" onClick={() => handleEdit(artwork.id, null)}>
                                            + Add note
                                        </button>
                                    )}
                                </div>
                            )}

                        </div>
                    ))}
                </div>

            </div>
        </>
    )
};




export default GalleryPage;