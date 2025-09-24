import { configureStore } from '@reduxjs/toolkit';
import nodesReducer from './nodesSlice';
import edgesReducer from './edgesSlice';
import selectionReducer from './selectionSlice';
import projectReducer from './projectSlice';

export const store = configureStore({
  reducer: {
    nodes: nodesReducer,
    edges: edgesReducer,
    selection: selectionReducer,
    project: projectReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;