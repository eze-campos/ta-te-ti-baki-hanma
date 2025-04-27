import { Square } from './Square.jsx'
import { TURNS } from '../constants.js'

export function WinnerModal ({ winner, resetGame, winnerImage }) {
  if (winner === null) return null

  const winnerText = winner === false ? 'Empate' : 'Ganó:'
  const winnerName = winner === TURNS.X ? 'Baki' : 'Yujiro'

  return (
    <section className='winner'>
      <div className='text'>
        {winnerImage ? (
          <>
            <div className="winner-header">
              <h2>{winnerName} {winnerText}</h2>
              <Square>{winner}</Square>
            </div>
            <div className="winner-content">
              <img 
                src={winnerImage} 
                alt={`${winnerName} victory`} 
                className="winner-image"
              />
            </div>
          </>
        ) : (
          <>
            <h2>{winnerText}</h2>
            <header className='win'>
              {winner && <Square>{winner}</Square>}
              <h3>{winner && winnerName}</h3>
            </header>
          </>
        )}
        <footer>
          <button onClick={resetGame}>Empezar de nuevo</button>
        </footer>
      </div>
    </section>
  )
}
