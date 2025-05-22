'use client';

import { ColumnType, Item } from '@/@types/data';
import { Column } from '@/components/Column';
import { initialItems } from '@/constant/data';
import { useState } from 'react';

export default function Page() {
  const [mainList, setMainList] = useState<Item[]>(initialItems);
  const [fruitList, setFruitList] = useState<Item[]>([]);
  const [vegetableList, setVegetableList] = useState<Item[]>([]);

  const listSetters: Record<
    ColumnType,
    React.Dispatch<React.SetStateAction<Item[]>>
  > = {
    main: setMainList,
    Fruit: setFruitList,
    Vegetable: setVegetableList,
  };

  const moveItemBetweenLists = (
    item: Item,
    from: ColumnType,
    to: ColumnType
  ) => {
    listSetters[from]((prev) =>
      prev.filter((i) => i.name !== item.name)
    );
    listSetters[to]((prev) => [...prev, item]);
  };

  const moveToMainList = (item: Item) => {
    moveItemBetweenLists(item, item.type as ColumnType, 'main');
  };

  const handleMainItemClick = (item: Item) => {
    moveItemBetweenLists(item, 'main', item.type as ColumnType);

    setTimeout(() => {
      moveToMainList(item);
    }, 5000);
  };

  const handleFruitItemClick = (item: Item) => {
    moveItemBetweenLists(item, 'Fruit', 'main');
  };

  const handleVegetableItemClick = (item: Item) => {
    moveItemBetweenLists(item, 'Vegetable', 'main');
  };

  const handleOnDropItemToMainList = (item: Item) => {
    moveItemBetweenLists(item, item.type as ColumnType, 'main');
  };

  const handleOnDropItemToFruitList = (item: Item) => {
    moveItemBetweenLists(item, 'main', 'Fruit');
    setTimeout(() => moveToMainList(item), 5000);
  };

  const handleOnDropItemToVegetableList = (item: Item) => {
    moveItemBetweenLists(item, 'main', 'Vegetable');
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
