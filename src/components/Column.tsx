import { Item } from '@/@types/data';
import { useRef, useState } from 'react';

type ColumnProps = {
  title: string;
  items: Item[];
  borderColor: string;
  onClick: (item: Item) => void;
  onDropItem: (item: Item) => void;
};

export function Column({
  title,
  items,
  borderColor,
  onClick,
  onDropItem,
}: ColumnProps) {
  const draggedRef = useRef(false);
  const [isDraggingOver, setIsDraggingOver] = useState(false);

  function handleDragStart(
    e: React.DragEvent,
    item: ColumnProps['items'][0]
  ) {
    draggedRef.current = true;
    e.dataTransfer.setData('text/plain', JSON.stringify(item));
    e.dataTransfer.effectAllowed = 'move';
  }

  function handleDragEnd() {
    setTimeout(() => {
      draggedRef.current = false;
    }, 100);
  }

  function handleClick(item: ColumnProps['items'][0]) {
    if (draggedRef.current) return;
    onClick(item);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setIsDraggingOver(false);

    const raw = e.dataTransfer.getData('text/plain');
    if (!raw) return;
    try {
      const item = JSON.parse(raw);
      onDropItem(item);
    } catch {
      return;
    }
  }

  return (
    <div
      className="min-w-[260px] flex-1 transition-all"
      onDragOver={(e) => {
        e.preventDefault();
        setIsDraggingOver(true);
      }}
      onDragLeave={() => setIsDraggingOver(false)}
      onDrop={handleDrop}
    >
      <div
        className={`rounded-xl border bg-white p-4 shadow-sm transition-colors duration-300 ${
          isDraggingOver ? 'bg-blue-50 border-blue-300' : ''
        }`}
      >
        <h2 className={`text-base font-semibold mb-3 ${borderColor}`}>
          {title}
        </h2>
        <div className="flex flex-col gap-2 min-h-[100px]">
          {items.map((item) => (
            <div
              key={item.name}
              draggable
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
