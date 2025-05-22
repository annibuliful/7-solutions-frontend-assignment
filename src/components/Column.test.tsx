import { render, screen, fireEvent } from '@testing-library/react';
import { Column } from './Column';
import { Item } from '@/@types/item';

const fruitItem: Item = { name: 'Apple', type: 'Fruit' };
const vegetableItem: Item = { name: 'Carrot', type: 'Vegetable' };

describe('<Column />', () => {
  it('renders title and items', () => {
    render(
      <Column
        title="Fruits"
        items={[fruitItem]}
        borderColor="text-green-600"
        acceptType="Fruit"
        onClick={jest.fn()}
        onDropItem={jest.fn()}
      />
    );

    expect(screen.getByText('Fruits')).not.toBeNull();
    expect(screen.getByText('Apple')).not.toBeNull();
  });

  it('calls onClick if item is clicked quickly', () => {
    const onClick = jest.fn();

    render(
      <Column
        title="Fruits"
        items={[fruitItem]}
        borderColor=""
        acceptType="Fruit"
        onClick={onClick}
        onDropItem={jest.fn()}
      />
    );

    const item = screen.getByText('Apple');
    fireEvent.pointerDown(item);
    fireEvent.click(item);

    expect(onClick).toHaveBeenCalledWith(fruitItem);
  });

  it('does not call onClick if drag held >200ms', async () => {
    jest.useFakeTimers();
    const onClick = jest.fn();

    render(
      <Column
        title="Fruits"
        items={[fruitItem]}
        borderColor=""
        acceptType="Fruit"
        onClick={onClick}
        onDropItem={jest.fn()}
      />
    );

    const item = screen.getByText('Apple');
    fireEvent.pointerDown(item);

    jest.advanceTimersByTime(300); // Simulate long press
    fireEvent.click(item);

    expect(onClick).not.toHaveBeenCalled();

    jest.useRealTimers();
  });

  it('calls onDropItem if dropped with valid type', () => {
    const onDropItem = jest.fn();

    render(
      <Column
        title="Fruit Column"
        items={[]}
        borderColor=""
        acceptType="Fruit"
        onClick={jest.fn()}
        onDropItem={onDropItem}
      />
    );

    const column = screen.getByText('Fruit Column').closest('div')!;
    const dataTransfer = {
      getData: () => JSON.stringify(fruitItem),
    };

    fireEvent.dragOver(column, { dataTransfer });
    fireEvent.drop(column, { dataTransfer });

    expect(onDropItem).toHaveBeenCalledWith(fruitItem);
  });

  it('does not call onDropItem if dropped with invalid type', () => {
    const onDropItem = jest.fn();

    render(
      <Column
        title="Fruit Column"
        items={[]}
        borderColor=""
        acceptType="Fruit"
        onClick={jest.fn()}
        onDropItem={onDropItem}
      />
    );

    const column = screen.getByText('Fruit Column').closest('div')!;
    const dataTransfer = {
      getData: () => JSON.stringify(vegetableItem),
    };

    fireEvent.dragOver(column, { dataTransfer });
    fireEvent.drop(column, { dataTransfer });

    expect(onDropItem).not.toHaveBeenCalled();
  });
});
