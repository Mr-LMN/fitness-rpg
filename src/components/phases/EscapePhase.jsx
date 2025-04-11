function EscapePhase({ setGameState }) {
  const handleBreakOut = () => {
    // Update introStage to 4 for the Corridor phase
    setGameState((prev) => ({ ...prev, introStage: 4 }));
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>🔧 Escape Options</h2>
      <p>
        You finally grab the object—it’s a flathead screwdriver. Not much… but it could help.
      </p>
      <p>
        You check the door: locked. But maybe you can loosen it. Or… there's a bench nearby. Could
        you climb and escape through the ceiling tiles?
      </p>
      <p>🧠 Choose your escape route:</p>
      <p>💪 Slam the screwdriver into the lock—10 slam balls</p>
      <p>⚡ Leap onto the bench and push up into the tiles—10 jump squats</p>
      <button onClick={handleBreakOut}>Break Out</button>
    </div>
  );
}

export default EscapePhase;