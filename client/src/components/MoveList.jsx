import { useState, useEffect, useRef } from 'react';
import './MoveList.css';

function MoveList({ moves, currentMoveIndex, onMoveSelect }) {
  const [formattedMoves, setFormattedMoves] = useState([]);
  const moveRefs = useRef([]);

  // Format moves for display - pairs white and black moves with move numbers
  const formatMovesForDisplay = (movesArray) => {
    const formatted = [];
    for (let i = 0; i < movesArray.length; i += 2) {
      const moveNumber = Math.floor(i / 2) + 1;
      const whiteMove = movesArray[i];
      const blackMove = movesArray[i + 1];

      formatted.push({
        moveNumber,
        white: whiteMove || '',
        black: blackMove || '',
        whiteIndex: i,
        blackIndex: blackMove ? i + 1 : -1
      });
    }
    return formatted;
  };

  useEffect(() => {
    if (moves && moves.length > 0) {
      setFormattedMoves(formatMovesForDisplay(moves));
    } else {
      setFormattedMoves([]);
    }
  }, [moves]);

  // Scroll selected move into view
  useEffect(() => {
    if (moveRefs.current[currentMoveIndex]) {
      moveRefs.current[currentMoveIndex].scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });
    }
  }, [currentMoveIndex]);

  // Add keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event) => {
      // Only handle keyboard events when this component is focused/interactive
      if (!moves || moves.length === 0) return;

      switch (event.key) {
        case 'ArrowLeft':
          event.preventDefault();
          handlePrevious();
          break;
        case 'ArrowRight':
          event.preventDefault();
          handleNext();
          break;
        case 'Home':
          event.preventDefault();
          handleReset();
          break;
        default:
          break;
      }
    };

    // Add event listener
    document.addEventListener('keydown', handleKeyDown);

    // Cleanup
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [moves, currentMoveIndex]); // Re-add listeners when moves or currentMoveIndex changes

  const handleMoveClick = (moveIndex) => {
    if (onMoveSelect) {
      onMoveSelect(moveIndex);
    }
  };

  const handlePrevious = () => {
    if (currentMoveIndex > 0) {
      handleMoveClick(currentMoveIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentMoveIndex < (moves?.length || 0)) {
      handleMoveClick(currentMoveIndex + 1);
    }
  };

  const handleReset = () => {
    handleMoveClick(0);
  };

  if (!moves || moves.length === 0) {
    return (
      <div className="move-list">
        <div className="move-list-header">
          <h3>Move List</h3>
        </div>
        <div className="move-list-content">
          <p className="no-moves">No moves available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="move-list">
      <div className="move-list-header">
        <h3>Move List</h3>
        <div className="move-navigation">
          <button
            className="nav-button"
            onClick={handleReset}
            disabled={currentMoveIndex === 0}
            title="Go to start"
          >
            ⟲
          </button>
          <button
            className="nav-button"
            onClick={handlePrevious}
            disabled={currentMoveIndex === 0}
            title="Previous move"
          >
            ←
          </button>
          <span className="move-counter">
            {currentMoveIndex} / {moves.length}
          </span>
          <button
            className="nav-button"
            onClick={handleNext}
            disabled={currentMoveIndex >= moves.length}
            title="Next move"
          >
            →
          </button>
        </div>
      </div>

      <div className="move-list-content">
        {formattedMoves.map((movePair, pairIndex) => (
          <div key={pairIndex} className="move-pair">
            <span className="move-number">{movePair.moveNumber}.</span>
            <button
              ref={el => moveRefs.current[movePair.whiteIndex] = el}
              className={`move-button ${movePair.whiteIndex === currentMoveIndex ? 'selected' : ''}`}
              onClick={() => handleMoveClick(movePair.whiteIndex)}
            >
              {movePair.white}
            </button>
            {movePair.black && (
              <button
                ref={el => moveRefs.current[movePair.blackIndex] = el}
                className={`move-button ${movePair.blackIndex === currentMoveIndex ? 'selected' : ''}`}
                onClick={() => handleMoveClick(movePair.blackIndex)}
              >
                {movePair.black}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default MoveList;
