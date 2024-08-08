'use client'

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Item } from '@/app/page';

type ItemsState = {
    items: Item[];
    totalItems: number;
};

const initialState: ItemsState = {
    items: [],
    totalItems: 0,
};

const itemsSlice = createSlice({
    name: 'items',
    initialState,
    reducers: {
        setItems(state, action: PayloadAction<{ items: Item[], totalItems: number }>) {
            state.items = action.payload.items;
            state.totalItems = action.payload.totalItems;
        },
        updateItem(state, action: PayloadAction<Item>) {
            const index = state.items.findIndex(item => item.id === action.payload.id);
            if (index !== -1) {
                state.items[index] = action.payload;
            }
        },
        removeItem(state, action: PayloadAction<string>) {
            const itemIndex = state.items.findIndex(item => item.id === action.payload);
            if (itemIndex !== -1) {
                state.items.splice(itemIndex, 1);
                state.totalItems -= 1;
            }
        },
        addItem(state, action: PayloadAction<Item>) {
            state.items.push(action.payload)
            state.totalItems += 1;
        },
    },
});

export const { setItems, updateItem, removeItem, addItem } = itemsSlice.actions;
export default itemsSlice.reducer;
