import crypto from 'crypto';

/**
 * Simple PGN tag extractor - extracts basic metadata from PGN tags
 * This is a minimal parser for Milestone 1. Full parsing comes in Milestone 2.
 */
export function extractPGNTags(pgn) {
  const tags = {};

  // Match PGN tags like [Event "Casual Game"]
  const tagRegex = /\[(\w+)\s+"([^"]+)"\]/g;
  let match;

  while ((match = tagRegex.exec(pgn)) !== null) {
    const [, tagName, tagValue] = match;
    tags[tagName.toLowerCase()] = tagValue;
  }

  return tags;
}

/**
 * Generate a consistent hash from PGN content for duplicate detection
 * Normalizes the PGN by removing comments, variations, and extra whitespace
 * @param {string} pgn - The PGN string
 * @returns {string} SHA-256 hash of normalized PGN content
 */
export function generatePGNHash(pgn) {
  // Normalize the PGN by removing comments and variations
  let normalized = pgn
    // Remove PGN comments in curly braces {comment}
    .replace(/\{[^}]*\}/g, '')
    // Remove move variations in parentheses (variation)
    .replace(/\([^)]*\)/g, '')
    // Remove extra whitespace and normalize line breaks
    .replace(/\s+/g, ' ')
    .trim();

  // Create SHA-256 hash
  return crypto.createHash('sha256').update(normalized, 'utf8').digest('hex');
}

/**
 * Extract moves from PGN as an array of SAN moves
 * @param {string} pgn - The PGN string
 * @returns {string[]} Array of moves in SAN notation
 */
export function extractMovesFromPGN(pgn) {
  const moves = [];

  const pgnWithoutTags = pgn.replace(/^\[.*\]$/gm, '').trim();

  // Remove game result markers like 1-0, 0-1, 1/2-1/2, *
  const pgnWithoutResult = pgnWithoutTags.replace(/\s+(1-0|0-1|1\/2-1\/2|\*)\s*$/, '');

  // Split by move numbers and extract individual moves
  // This regex handles move numbers like "1.", "1...", "2.", etc.
  const moveRegex = /(\d+)\.(\s*\S+)(?:\s+(\S+))?/g;
  let match;

  while ((match = moveRegex.exec(pgnWithoutResult)) !== null) {
    const [, moveNumber, whiteMove, blackMove] = match;

    // Clean up the moves (remove extra spaces, comments in {})
    const cleanWhiteMove = whiteMove.trim().replace(/{[^}]*}/g, '').trim();
    const cleanBlackMove = blackMove ? blackMove.trim().replace(/{[^}]*}/g, '').trim() : null;

    // Add white move
    if (cleanWhiteMove) {
      moves.push(cleanWhiteMove);
    }

    // Add black move if it exists
    if (cleanBlackMove) {
      moves.push(cleanBlackMove);
    }
  }

  return moves;
}

