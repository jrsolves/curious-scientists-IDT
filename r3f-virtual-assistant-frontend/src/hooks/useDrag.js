// File: src/hooks/useDrag.js
import { useState, useEffect } from "react";

function useDrag(initialPos = { x: 0, y: 0 }) {
  const [pos, setPos] = useState(initialPos);
  const [dragging, setDragging] = useState(false);
  const [start, setStart] = useState({ x: 0, y: 0 });
  const [origin, setOrigin] = useState(initialPos);

  const onPointerDown = (e) => {
    e.preventDefault();
    setDragging(true);
    setStart({ x: e.clientX, y: e.clientY });
    setOrigin({ x: pos.x, y: pos.y });
  };

  useEffect(() => {
    const onMove = (e) => {
      if (dragging) {
        setPos({ x: origin.x + e.clientX - start.x, y: origin.y + e.clientY - start.y });
      }
    };
    const onUp = () => setDragging(false);

    document.addEventListener("pointermove", onMove);
    document.addEventListener("pointerup", onUp);

    return () => {
      document.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerup", onUp);
    };
  }, [dragging, origin, start]);

  return { pos, setPos, onPointerDown };
}

export default useDrag;
