import GameReviewPage from './pages/GameReviewPage'
import { Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import './App.css'


function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/games/:id" element={<GameReviewPage />} />
    </Routes>
  )
}

export default App