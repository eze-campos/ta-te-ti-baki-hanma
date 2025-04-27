export function StartScreen({ onStart }) {
  return (
    <div className="start-screen">
      <h1>Baki Ta Te Tí</h1>
      <div className="start-content">
        <button onClick={onStart}>
          Comenzar Batalla
        </button>
      </div>
    </div>
  )
}
