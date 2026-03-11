import { configureStore, createSlice } from '@reduxjs/toolkit';

const todoSlice = createSlice({
  name: 'todos',
  initialState: {
    items: [],
    filter: 'all',
    maxLength: 50,
  },

  reducers: {
    addTodo: (state, action) => {
      if (action.payload.length <= state.maxLength) {
        state.items.push({
          id: Date.now(),
          text: action.payload,
          completed: false,
        });
      }
    },

    toggleTodo: (state, action) => {
      const todo = state.items.find(item => item.id === action.payload);
      if (todo) todo.completed = !todo.completed;
    },

    setFilter: (state, action) => {
      state.filter = action.payload;
    },
  },
});

export const { addTodo, toggleTodo, setFilter } = todoSlice.actions;
export const todoReducer = todoSlice.reducer;

export const store = configureStore({
  reducer: {
    todos: todoReducer,
  },
});
