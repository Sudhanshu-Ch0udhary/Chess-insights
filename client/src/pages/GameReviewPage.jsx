import { useParams } from 'react-router-dom'
import './GameReviewPage.css'

function GameReviewPage() {
  const { id } = useParams()

  return (
    <div className="game-review-page">
      <h1>Game Review</h1>
      <p>Game ID: {id}</p>
      <p className="placeholder">Game review functionality</p>
    </div>
  )
}

export default GameReviewPage

