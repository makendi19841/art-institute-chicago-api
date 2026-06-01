import { Routes, Route } from 'react-router'
import ArtworkPage from './pages/ArtworkPage'
import GalleryPage from './pages/GalleryPage'

const App = () => {   
  return (
    
      <Routes>

        <Route path="/" element={<ArtworkPage />} />
        <Route path="/gallery" element={<GalleryPage />} />

      </Routes>    
  )
}

export default App;