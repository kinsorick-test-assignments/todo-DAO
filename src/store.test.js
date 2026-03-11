import { describe, it, expect } from 'vitest';
import { store, addTodo, toggleTodo, setFilter } from './store';

describe('todoSlice', () => {
  it('should handle initial state', () => {
    expect(store.getState().todos).toEqual({
      items: [],
      filter: 'all',
      maxLength: 50,
    });
  });

  it('should handle adding a todo', () => {
    store.dispatch(addTodo('Test Todo'));
    const state = store.getState().todos;
    expect(state.items.length).toBe(1);
    expect(state.items[0].text).toBe('Test Todo');
    expect(state.items[0].completed).toBe(false);
  });

  it('should handle toggling a todo', () => {
    const todoId = store.getState().todos.items[0].id;
    store.dispatch(toggleTodo(todoId));
    expect(store.getState().todos.items[0].completed).toBe(true);
    
    store.dispatch(toggleTodo(todoId));
    expect(store.getState().todos.items[0].completed).toBe(false);
  });

  it('should handle setting the filter', () => {
    store.dispatch(setFilter('active'));
    expect(store.getState().todos.filter).toBe('active');
    
    store.dispatch(setFilter('completed'));
    expect(store.getState().todos.filter).toBe('completed');
  });

  it('should not add todo if text is too long', () => {
    const longText = 'a'.repeat(51);
    const initialCount = store.getState().todos.items.length;
    store.dispatch(addTodo(longText));
    expect(store.getState().todos.items.length).toBe(initialCount);
  });
});
