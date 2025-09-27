
'use client';

import { useState, useEffect, useRef, RefObject } from 'react';

interface Position {
  x: number;
  y: number;
}

export function useDraggable(elRef: RefObject<HTMLElement>): void {
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState<Position>({ x: 0, y: 0 });
  const dragInfo = useRef<{ startX: number; startY: number; lastX: number; lastY: number }>();

  useEffect(() => {
    const el = elRef.current;
    if (!el) return;

    const handleMouseDown = (e: MouseEvent) => {
      // Only drag on a specific handle if available, otherwise the whole element
      const handle = el.querySelector('[data-drag-handle]');
      if (handle && !handle.contains(e.target as Node)) {
        return;
      }
      // Prevent text selection while dragging
      e.preventDefault(); 

      setIsDragging(true);
      dragInfo.current = {
        startX: e.clientX,
        startY: e.clientY,
        lastX: position.x,
        lastY: position.y,
      };
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || !dragInfo.current) return;

      const nextX = dragInfo.current.lastX + e.clientX - dragInfo.current.startX;
      const nextY = dragInfo.current.lastY + e.clientY - dragInfo.current.startY;

      setPosition({ x: nextX, y: nextY });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    el.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      el.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, elRef, position.x, position.y]);

  useEffect(() => {
    const el = elRef.current;
    if (el) {
      el.style.transform = `translate(${position.x}px, ${position.y}px)`;
    }
  }, [position, elRef]);
}
