import { Link } from 'react-router-dom'
import './HomePage.css'

function HomePage() {
  return (
    <div className="home-page">
      <h1>Chess Review System</h1>
      <p>Review and analyze your chess games</p>
      <div className="home-actions">
        <Link to="/games/new" className="btn btn-primary">
          Upload New Game
        </Link>
        <Link to="/games" className="btn btn-secondary">
          View My Games
        </Link>
      </div>
    </div>
  )
}

export default HomePage