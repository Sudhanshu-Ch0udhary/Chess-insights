const STOCKFISH_PATH = '/stockfish-17.1-lite-single-03e3232.js'

let engine = null
let ready = false

export function initStockfish(onMessage) {
  if (engine) return Promise.resolve()

  return new Promise((resolve, reject) => {
    try {
      engine = new Worker(STOCKFISH_PATH)

      engine.onmessage = (e) => {
        const msg = e.data

        if (msg === 'readyok') {
          ready = true
          resolve()
        }

        if (onMessage) onMessage(msg)
      }

      engine.onerror = (err) => {
        reject(err)
      }

      engine.postMessage('uci')
      engine.postMessage('isready')
    } catch (err) {
      reject(err)
    }
  })
}

/**
 * Analyze a single position and return evaluation + best move
 * @param {string} fen - FEN string
 * @param {number} depth - Search depth
 * @returns {Promise<{evaluation: number, bestMove: string, pv: string[]}>}
 */

export function analyzePosition(fen, depth = 16, multiPV = 3) {
  return new Promise((resolve, reject) => {
    if (!engine || !ready) {
      return reject(new Error('Engine not ready'))
    }

    const lines = {}
    let finished = false

    const timeout = setTimeout(() => {
      if (!finished) {
        finished = true
        engine.postMessage('stop')
        reject(new Error('Stockfish timeout'))
      }
    }, 25000)

    engine.onmessage = (e) => {
      const msg = e.data
      if (typeof msg !== 'string' || finished) return

      const mp = msg.match(/multipv\s+(\d+)/)
      const multipv = mp ? parseInt(mp[1]) : 1

      if (!lines[multipv]) {
        lines[multipv] = {
          multipv,
          eval: 0,
          mate: null,
          pv: []
        }
      }

      const cp = msg.match(/score cp (-?\d+)/)
      if (cp) {
        lines[multipv].eval = parseInt(cp[1]) / 100
        lines[multipv].mate = null
      }

      const mate = msg.match(/score mate (-?\d+)/)
      if (mate) {
        lines[multipv].mate = parseInt(mate[1])
        lines[multipv].eval = mate[1] > 0 ? 100 : -100
      }

      const pv = msg.match(/ pv (.+)/)
      if (pv) {
        lines[multipv].pv = pv[1].trim().split(/\s+/)
      }

      if (msg.startsWith('bestmove')) {
        clearTimeout(timeout)
        finished = true

        resolve({
          lines: Object.values(lines).sort((a, b) => a.multipv - b.multipv)
        })
      }
    }

    engine.postMessage('ucinewgame')
    engine.postMessage(`position fen ${fen}`)
    engine.postMessage(`setoption name MultiPV value ${multiPV}`)
    engine.postMessage(`go depth ${depth}`)
  })
}


function classifyMove(evalDiff, isBestMove) {
  if (isBestMove) return 'best'
  const absDiff = Math.abs(evalDiff)
  if (absDiff < 0.3) return 'good'
  if (absDiff < 0.8) return 'inaccuracy'
  if (absDiff < 1.5) return 'mistake'
  return 'blunder'
}

/**
 * Analyze entire game move by move
 * @param {string[]} moves - SAN moves
 * @returns {Promise<Array<{moveIndex, move, evaluation, bestMove, evalDiff, severity, pv}>>}
 */
export async function analyzeGame(moves) {
  const { Chess } = await import('chess.js')
  const chess = new Chess()
  const analyses = []

  await initStockfish()

  for (let i = 0; i < moves.length; i++) {
    const move = moves[i]
    const fenBefore = chess.fen()

    try {
      const analysis = await analyzePosition(fenBefore, 14)
      chess.move(move)
      const fenAfter = chess.fen()
      const analysisAfter = await analyzePosition(fenAfter, 14)

      const evalDiff = analysisAfter.evaluation - analysis.evaluation
      const playedMove = move
      const bestSan = analysis.bestMove ? await uciToSanAsync(analysis.bestMove, fenBefore) : null
      const isBest = bestSan && playedMove === bestSan
      const severity = classifyMove(evalDiff, isBest)

      analyses.push({
        moveIndex: i,
        move: playedMove,
        evaluation: analysisAfter.evaluation,
        bestMove: bestSan,
        evalDiff,
        severity,
        pv: analysisAfter.pv || []
      })
    } catch (err) {
      console.error(`Error analyzing move ${i}:`, err)
      analyses.push({
        moveIndex: i,
        move,
        evaluation: 0,
        bestMove: null,
        evalDiff: 0,
        severity: 'unknown',
        pv: []
      })
    }
  }

  return analyses
}

async function uciToSanAsync(uci, fen) {
  if (!uci || uci.length < 4) return null
  try {
    const { Chess } = await import('chess.js')
    const chess = new Chess(fen)
    const from = uci.slice(0, 2)
    const to = uci.slice(2, 4)
    const promo = uci.length > 4 ? uci[4] : null
    const m = chess.move({ from, to, promotion: promo })
    return m ? m.san : null
  } catch {
    return null
  }
}

export function stopStockfish() {
  if (engine) {
    engine.terminate()
    engine = null
    ready = false
  }
}

export function isReady() {
  return !!engine && ready
}
