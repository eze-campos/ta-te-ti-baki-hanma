import { useState, useEffect } from 'react'
import confetti from 'canvas-confetti'

import { Square } from './components/Square.jsx'
import { TURNS } from './constants.js'
import { checkWinnerFrom, checkEndGame } from './logic/board.js'
import { WinnerModal } from './components/WinnerModal.jsx'
import { StartScreen } from './components/StartScreen.jsx'
import { saveGameToStorage, resetGameStorage } from './logic/storage/index.js'

// Importar assets
import bakiAudio from './assets/baki.mp3'
import yujiroAudio from './assets/yujiro.mp3'
import bakiImage from './assets/baki-back.png'
import yujiroImage from './assets/yujiro-back.png'

function App () {
  // Estado para controlar si el juego ha comenzado
  const [gameStarted, setGameStarted] = useState(false)
  
  // Estado para la animación inicial
  const [showContent, setShowContent] = useState(false)

  // Efecto para la animación inicial
  useEffect(() => {
    const timer = setTimeout(() => setShowContent(true), 500)
    return () => clearTimeout(timer)
  }, [])

  const handleStartGame = () => {
    setGameStarted(true)
  }

  const [board, setBoard] = useState(() => {
    const boardFromStorage = window.localStorage.getItem('board')
    if (boardFromStorage) return JSON.parse(boardFromStorage)
    return Array(9).fill(null)
  })

  const [turn, setTurn] = useState(() => {
    const turnFromStorage = window.localStorage.getItem('turn')
    return turnFromStorage ?? TURNS.X
  })

  // Contadores de victorias
  const [xWins, setXWins] = useState(0)
  const [oWins, setOWins] = useState(0)

  // null es que no hay ganador, false es que hay un empate
  const [winner, setWinner] = useState(null)
  
  // Estado para la imagen del ganador
  const [winnerImage, setWinnerImage] = useState(null)

  // Referencias a los audios
  const [bakiAudioRef] = useState(new Audio(bakiAudio))
  const [yujiroAudioRef] = useState(new Audio(yujiroAudio))

  // Efecto para manejar el audio y la imagen cuando hay un ganador
  useEffect(() => {
    if (winner === TURNS.X && xWins >= 1) {
      bakiAudioRef.currentTime = 12 // Comenzar un segundo antes
      bakiAudioRef.play()
      setWinnerImage(bakiImage)
      const audioTimer = setTimeout(() => {
        bakiAudioRef.pause()
        bakiAudioRef.currentTime = 12
      }, 8000) // Dos segundos más al final
      return () => {
        clearTimeout(audioTimer)
        bakiAudioRef.pause()
        bakiAudioRef.currentTime = 12
      }
    } else if (winner === TURNS.O && oWins >= 1) {
      yujiroAudioRef.currentTime = 15
      yujiroAudioRef.play()
      setWinnerImage(yujiroImage)
      const audioTimer = setTimeout(() => {
        yujiroAudioRef.pause()
        yujiroAudioRef.currentTime = 15
      }, 18000) // Un segundo más
      return () => {
        clearTimeout(audioTimer)
        yujiroAudioRef.pause()
        yujiroAudioRef.currentTime = 15
      }
    }
  }, [winner])

  const resetGame = () => {
    // Limpiar el estado del juego
    setBoard(Array(9).fill(null))
    setTurn(TURNS.X)
    setWinner(null)
    setWinnerImage(null)
    setXWins(0)
    setOWins(0)

    // Detener cualquier audio que esté reproduciéndose
    bakiAudioRef.pause()
    bakiAudioRef.currentTime = 12
    yujiroAudioRef.pause()
    yujiroAudioRef.currentTime = 15

    // Limpiar el almacenamiento local
    resetGameStorage()
  }

  const updateBoard = (index) => {
    // no actualizamos esta posición si ya tiene algo o si ya hay un ganador
    if (board[index] || winner) return

    // actualizar el tablero
    const newBoard = [...board]
    newBoard[index] = turn
    setBoard(newBoard)

    // cambiar el turno
    const newTurn = turn === TURNS.X ? TURNS.O : TURNS.X
    setTurn(newTurn)

    // guardar partida
    saveGameToStorage({
      board: newBoard,
      turn: newTurn
    })

    // revisar si hay ganador
    const newWinner = checkWinnerFrom(newBoard)
    if (newWinner) {
      confetti()
      setWinner(newWinner)
      // Actualizar contadores
      if (newWinner === TURNS.X) {
        setXWins(prev => prev + 1)
      } else if (newWinner === TURNS.O) {
        setOWins(prev => prev + 1)
      }
    } else if (checkEndGame(newBoard)) {
      setWinner(false) // empate
    }
  }

  if (!showContent) return null

  if (!gameStarted) {
    return <StartScreen onStart={handleStartGame} />
  }

  return (
    <main className='board'>
      <h1 translate="no">Baki Ta Te Tí</h1>
      <div className="score">
        <span>Baki: {xWins} wins</span>
        <span>Yujiro: {oWins} wins</span>
      </div>
      <button onClick={resetGame}>Reset del juego</button>
      <section className='game'>
        {
          board.map((square, index) => {
            return (
              <Square
                key={index}
                index={index}
                updateBoard={updateBoard}
              >
                {square}
              </Square>
            )
          })
        }
      </section>

      <section className='turn'>
        <Square isSelected={turn === TURNS.X}>
          {TURNS.X}
        </Square>
        <Square isSelected={turn === TURNS.O}>
          {TURNS.O}
        </Square>
      </section>

      <WinnerModal resetGame={resetGame} winner={winner} winnerImage={winnerImage} />
    </main>
  )
}

export default App
