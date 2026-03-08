import React, { useState } from "react";

/**
 * Full-screen looping video background.
 * Falls back to a CSS background-image if the video fails to load.
 */
export default function VideoBackground({ src, fallbackImage }) {
  const [failed, setFailed] = useState(false);

  if (failed && fallbackImage) {
    return (
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: 0,
          backgroundImage: `url(${fallbackImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
    );
  }

  return (
    <video
      src={src}
      autoPlay
      muted
      loop
      playsInline
      onError={() => setFailed(true)}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        objectFit: "cover",
        zIndex: 0,
      }}
    />
  );
}
