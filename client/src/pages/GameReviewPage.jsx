import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import './GameReviewPage.css'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

function GameReviewPage() {
  const { id } = useParams()
  const [game, setGame] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchGame = async () => {
      try {
        const response = await fetch(`${API_URL}/api/games/${id}`)
        
        if (!response.ok) {
          throw new Error('Failed to fetch game')
        }

        const gameData = await response.json()
        setGame(gameData)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchGame()
    }
  }, [id])

  if (loading) {
    return (
      <div className="game-review-page">
        <p>Loading game...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="game-review-page">
        <div className="error-message">{error}</div>
      </div>
    )
  }

  if (!game) {
    return (
      <div className="game-review-page">
        <p>Game not found</p>
      </div>
    )
  }

  return (
    <div className="game-review-page">
      <h1>Game Review</h1>
      
      <div className="game-metadata">
        <div className="metadata-item">
          <strong>Event:</strong> {game.event}
        </div>
        <div className="metadata-item">
          <strong>White:</strong> {game.white}
        </div>
        <div className="metadata-item">
          <strong>Black:</strong> {game.black}
        </div>
        <div className="metadata-item">
          <strong>Date:</strong> {game.date}
        </div>
        <div className="metadata-item">
          <strong>Result:</strong> {game.result}
        </div>
        {game.createdAt && (
          <div className="metadata-item">
            <strong>Saved:</strong> {new Date(game.createdAt).toLocaleString()}
          </div>
        )}
      </div>

      <div className="pgn-display">
        <h2>PGN</h2>
        <pre className="pgn-text">{game.pgn}</pre>
      </div>
    </div>
  )
}

export default GameReviewPage
