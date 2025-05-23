'use client';

import { useRef, useState } from 'react';
import { Column } from '@/components/Column';
import { initialItems } from '@/constant/item';
import { ColumnType, Item } from '@/@types/item';

export default function Page() {
  const [mainList, setMainList] = useState<Item[]>(initialItems);
  const [fruitList, setFruitList] = useState<Item[]>([]);
  const [vegetableList, setVegetableList] = useState<Item[]>([]);

  const transitionMapRef = useRef<Map<string, NodeJS.Timeout>>(
    new Map()
  );

  const listSetters: Record<
    ColumnType,
    React.Dispatch<React.SetStateAction<Item[]>>
  > = {
    Main: setMainList,
    Fruit: setFruitList,
    Vegetable: setVegetableList,
  };

  const isItemLocked = (item: Item) =>
    transitionMapRef.current.has(item.name);

  const lockItem = (
    item: Item,
    timeoutMs: number = 5000,
    onExpire?: () => void
  ) => {
    if (isItemLocked(item)) return;

    const timer = setTimeout(() => {
      transitionMapRef.current.delete(item.name);
      onExpire?.();
    }, timeoutMs);

    transitionMapRef.current.set(item.name, timer);
  };

  const cancelLock = (item: Item) => {
    const timer = transitionMapRef.current.get(item.name);
    if (timer) {
      clearTimeout(timer);
      transitionMapRef.current.delete(item.name);
    }
  };

  const moveItemBetweenLists = (
    item: Item,
    from: ColumnType,
    to: ColumnType,
    delayBackToMain = false
  ) => {
    if (isItemLocked(item)) return;

    listSetters[from]((prev) =>
      prev.filter((i) => i.name !== item.name)
    );
    listSetters[to]((prev) =>
      prev.some((i) => i.name === item.name) ? prev : [...prev, item]
    );

    if (delayBackToMain) {
      lockItem(item, 5000, () => {
        moveItemBetweenLists(item, to, 'Main');
      });
    }
  };

  const handleMainItemClick = (item: Item) => {
    moveItemBetweenLists(item, 'Main', item.type as ColumnType, true);
  };

  const handleFruitItemClick = (item: Item) => {
    cancelLock(item);
    moveItemBetweenLists(item, 'Fruit', 'Main');
  };

  const handleVegetableItemClick = (item: Item) => {
    cancelLock(item);
    moveItemBetweenLists(item, 'Vegetable', 'Main');
  };

  const handleOnDropItemToMainList = (item: Item) => {
    cancelLock(item);
    moveItemBetweenLists(item, item.type as ColumnType, 'Main');
  };

  const handleOnDropItemToFruitList = (item: Item) => {
    moveItemBetweenLists(item, 'Main', 'Fruit', true);
  };

  const handleOnDropItemToVegetableList = (item: Item) => {
    moveItemBetweenLists(item, 'Main', 'Vegetable', true);
  };

  return (
    <main className="min-h-screen bg-gray-50 text-gray-900 font-sans px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Item Board</h1>
      <div className="flex flex-col md:flex-row gap-6 overflow-x-auto pb-4">
        <Column
          title="Main List"
          items={mainList}
          borderColor="text-gray-700"
          acceptType="Any"
          onClick={handleMainItemClick}
          onDropItem={handleOnDropItemToMainList}
        />

        <Column
          title="Fruit"
          items={fruitList}
          borderColor="text-green-600"
          acceptType="Fruit"
          onClick={handleFruitItemClick}
          onDropItem={handleOnDropItemToFruitList}
        />

        <Column
          title="Vegetable"
          items={vegetableList}
          borderColor="text-orange-500"
          acceptType="Vegetable"
          onClick={handleVegetableItemClick}
          onDropItem={handleOnDropItemToVegetableList}
        />
      </div>
    </main>
  );
}
