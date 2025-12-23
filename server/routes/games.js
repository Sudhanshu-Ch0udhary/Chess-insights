import { Router } from 'express'
import { getGamebyId, newGameController, getAllGames } from '../conrollers/game.controller.js'

const router = Router()

// GET /api/games - Get all games (summary)
router.get('/', getAllGames)

// POST /api/games - Create a new game from PGN
router.post('/', newGameController)

// GET /api/games/:id - Get a single game by ID
router.get('/:id', getGamebyId)

export default router