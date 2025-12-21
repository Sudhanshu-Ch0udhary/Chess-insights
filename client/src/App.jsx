import { Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import NewGamePage from './pages/NewGamePage'
import GameReviewPage from './pages/GameReviewPage'
import './App.css'

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/games/new" element={<NewGamePage />} />
      <Route path="/games/:id" element={<GameReviewPage />} />
    </Routes>
  )
}

export default App