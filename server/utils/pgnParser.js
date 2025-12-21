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

