import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { describe, it, expect, beforeEach } from 'vitest';
import { todoReducer } from '../store';
import TodoApp from './TodoApp';

// Helper to render with a fresh store
const renderWithStore = (component, initialState = {}) => {
  const store = configureStore({
    reducer: {
      todos: todoReducer,
    },
    preloadedState: initialState,
  });
  return render(<Provider store={store}>{component}</Provider>);
};

describe('TodoApp Component', () => {
  it('renders correctly', () => {
    renderWithStore(<TodoApp />);
    expect(screen.getByText('Мои задачи')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Что нужно сделать?')).toBeInTheDocument();
  });

  it('adds a new todo', () => {
    renderWithStore(<TodoApp />);
    const input = screen.getByPlaceholderText('Что нужно сделать?');
    const addButton = screen.getByText('+');

    fireEvent.change(input, { target: { value: 'New Task' } });
    fireEvent.click(addButton);

    expect(screen.getByText('New Task')).toBeInTheDocument();
  });

  it('toggles a todo status', () => {
    const initialState = {
      todos: {
        items: [{ id: 1, text: 'Test Task', completed: false }],
        filter: 'all',
        maxLength: 50,
      }
    };
    renderWithStore(<TodoApp />, initialState);
    
    const taskItem = screen.getByText('Test Task');
    fireEvent.click(taskItem);
    
    // Check if it's crossed out (by checking class or style if possible, 
    // or just checking if the badge/tick appears if implemented)
    // Based on code: item.completed ? 'text-decoration-line-through'
    expect(taskItem).toHaveClass('text-decoration-line-through');
  });

  it('filters tasks', () => {
    const initialState = {
      todos: {
        items: [
          { id: 1, text: 'Active Task', completed: false },
          { id: 2, text: 'Completed Task', completed: true },
        ],
        filter: 'all',
        maxLength: 50,
      }
    };
    renderWithStore(<TodoApp />, initialState);
    
    expect(screen.getByText('Active Task')).toBeInTheDocument();
    expect(screen.getByText('Completed Task')).toBeInTheDocument();

    const activeFilter = screen.getByText('Текущие');
    fireEvent.click(activeFilter);
    
    expect(screen.getByText('Active Task')).toBeInTheDocument();
    expect(screen.queryByText('Completed Task')).not.toBeInTheDocument();
  });

  it('searches for tasks', () => {
    const initialState = {
      todos: {
        items: [
          { id: 1, text: 'Apple', completed: false },
          { id: 2, text: 'Banana', completed: false },
        ],
        filter: 'all',
        maxLength: 50,
      }
    };
    renderWithStore(<TodoApp />, initialState);
    
    const searchInput = screen.getByPlaceholderText('Поиск...');
    fireEvent.change(searchInput, { target: { value: 'App' } });
    
    expect(screen.getByText('Apple')).toBeInTheDocument();
    expect(screen.queryByText('Banana')).not.toBeInTheDocument();
  });
});
