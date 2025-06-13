import React from "react";
import "./styles/BlazePods.css";

function BlazePods({ count = 4 }) {
  const pods = Array.from({ length: count });
  return (
    <div className="blaze-pods">
      {pods.map((_, i) => (
        <div key={i} className="blaze-pod" style={{ animationDelay: `${i * 0.2}s` }} />
      ))}
    </div>
  );
}

export default BlazePods;
