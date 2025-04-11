function MobilityPhase({ setGameState }) {
  return (
    <div style={{ padding: 20 }}>
      <h2>🧍 Mobility Stretch</h2>
      <p>
        With your blood flowing, you explore the changing room. A locker lies tipped on
        its side—underneath it, something shiny glints in the flickering light.
      </p>
      <p>
        You crawl forward… but your body is still stiff from the locker. You can’t quite
        reach.
      </p>
      <p>🦵 Perform 10 lunges and 10 arm circles to loosen up.</p>
      <button onClick={() => setGameState((prev) => ({ ...prev, introStage: 3 }))}>
        Stretch Complete
      </button>
    </div>
  );
}

export default MobilityPhase;