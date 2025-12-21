import Game from '../models/Game.js'
import { extractPGNTags } from '../utils/pgnParser.js'

export const newGameController = async (req, res) => {
  try {
    const { pgn, event, white, black, date, result } = req.body;

    if (!pgn) {
      return res.status(400).json({ error: 'PGN is required' });
    }

    // Extract tags from PGN if not provided in request
    const pgnTags = extractPGNTags(pgn);

    const game = new Game({
      pgn,
      event: event || pgnTags.event || 'Unknown Event',
      white: white || pgnTags.white || 'Unknown',
      black: black || pgnTags.black || 'Unknown',
      date: date || pgnTags.date || new Date().toISOString().split('T')[0],
      result: result || pgnTags.result || '*'
    });

    const savedGame = await game.save();
    res.status(201).json(savedGame);
  } catch (error) {
    console.error('Error creating game:', error);
    res.status(500).json({ error: 'Failed to create game' });
  }
}

export const getGamebyId = async (req, res) => {
  try {
    const game = await Game.findById(req.params.id);
    
    if (!game) {
      return res.status(404).json({ error: 'Game not found' });
    }

    res.json(game);
  } catch (error) {
    console.error('Error fetching game:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({ error: 'Invalid game ID' });
    }
    res.status(500).json({ error: 'Failed to fetch game' });
  }
}