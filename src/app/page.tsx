'use client';

import { Item } from '@/@types/data';
import { Column } from '@/components/Column';
import { initialItems } from '@/constant/data';
import { useState } from 'react';

export default function Page() {
  const [mainList, setMainList] = useState<Item[]>(initialItems);
  const [fruitList, setFruitList] = useState<Item[]>([]);
  const [vegetableList, setVegetableList] = useState<Item[]>([]);

  const moveToMainList = (item: Item) => {
    setMainList((prev) => [...prev, item]);
    if (item.type === 'Fruit') {
      setFruitList((prev) =>
        prev.filter((i) => i.name !== item.name)
      );
    } else {
      setVegetableList((prev) =>
        prev.filter((i) => i.name !== item.name)
      );
    }
  };

  const handleMainItemClick = (item: Item) => {
    setMainList((prev) => prev.filter((i) => i.name !== item.name));
    if (item.type === 'Fruit') {
      setFruitList((prev) => [...prev, item]);
    } else {
      setVegetableList((prev) => [...prev, item]);
    }

    setTimeout(() => {
      moveToMainList(item);
    }, 5000);
  };

  const handleFruitItemClick = (item: Item) => {
    setFruitList((prev) => prev.filter((i) => i.name !== item.name));
    setMainList((prev) => [...prev, item]);
  };

  const handleVegetableItemClick = (item: Item) => {
    setVegetableList((prev) =>
      prev.filter((i) => i.name !== item.name)
    );
    setMainList((prev) => [...prev, item]);
  };

  const handleOnDropItemToMainList = (item: Item) => {
    if (item.type === 'Fruit') {
      setFruitList((prev) =>
        prev.filter((i) => i.name !== item.name)
      );
    } else {
      setVegetableList((prev) =>
        prev.filter((i) => i.name !== item.name)
      );
    }
    setMainList((prev) => [...prev, item]);
  };

  const handleOnDropItemToFruitList = (item: Item) => {
    setMainList((prev) => prev.filter((i) => i.name !== item.name));
    setFruitList((prev) => [...prev, item]);
    setTimeout(() => moveToMainList(item), 5000);
  };

  const handleOnDropItemToVegetableList = (item: Item) => {
    setMainList((prev) => prev.filter((i) => i.name !== item.name));
    setVegetableList((prev) => [...prev, item]);
    setTimeout(() => moveToMainList(item), 5000);
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
