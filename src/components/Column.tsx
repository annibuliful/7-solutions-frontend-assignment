'use client';
import { Item } from '@/@types/data';
import { useRef, useState } from 'react';

type ColumnProps = {
  title: string;
  items: Item[];
  borderColor: string;
  acceptType: 'Fruit' | 'Vegetable' | 'Any';
  onClick: (item: Item) => void;
  onDropItem: (item: Item) => void;
};

export function Column({
  title,
  items,
  borderColor,
  acceptType,
  onClick,
  onDropItem,
}: ColumnProps) {
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const [isInvalidDrop, setIsInvalidDrop] = useState(false);

  const pointerDownTimeRef = useRef<number | null>(null);

  function handlePointerDown() {
    pointerDownTimeRef.current = Date.now();
  }

  function handleClick(item: Item) {
    const duration = Date.now() - (pointerDownTimeRef.current ?? 0);
    // If held down less than 200ms, treat as click
    if (duration < 200) {
      onClick(item);
    }
  }

  function handleDragStart(e: React.DragEvent, item: Item) {
    e.dataTransfer.setData('text/plain', JSON.stringify(item));
    e.dataTransfer.effectAllowed = 'move';
  }

  function handleDragEnd() {
    setTimeout(() => {
      setIsInvalidDrop(false);
    }, 100);
  }

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault();
    const raw = e.dataTransfer.getData('text/plain');
    try {
      const item: Item = JSON.parse(raw);
      if (acceptType === 'Any' || item.type === acceptType) {
        setIsDraggingOver(true);
        setIsInvalidDrop(false);
      } else {
        setIsDraggingOver(false);
        setIsInvalidDrop(true);
      }
    } catch {
      setIsInvalidDrop(true);
    }
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setIsDraggingOver(false);
    setIsInvalidDrop(false);

    try {
      const item: Item = JSON.parse(
        e.dataTransfer.getData('text/plain')
      );
      if (acceptType === 'Any' || item.type === acceptType) {
        onDropItem(item);
      }
    } catch {}
  }

  return (
    <div
      className="min-w-[260px] flex-1"
      onDragOver={handleDragOver}
      onDragLeave={() => {
        setIsDraggingOver(false);
        setIsInvalidDrop(false);
      }}
      onDrop={handleDrop}
    >
      <div
        className={`rounded-xl border p-4 shadow-sm transition-colors duration-300 bg-white ${
          isDraggingOver ? 'bg-blue-50 border-blue-300' : ''
        } ${isInvalidDrop ? 'border-red-400 bg-red-50' : ''}`}
      >
        <h2 className={`text-base font-semibold mb-3 ${borderColor}`}>
          {title}
        </h2>
        <div className="flex flex-col gap-2 min-h-[100px]">
          {items.map((item) => (
            <div
              key={item.name}
              draggable
              onPointerDown={handlePointerDown}
              onClick={() => handleClick(item)}
              onDragStart={(e) => handleDragStart(e, item)}
              onDragEnd={handleDragEnd}
              className="cursor-move select-none px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-100 transition-all duration-300 animate-fadeIn"
            >
              {item.name}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
