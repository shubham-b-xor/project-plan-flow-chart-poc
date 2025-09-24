import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { EdgeConfig } from '../types';

interface EdgesState {
  edges: EdgeConfig[];
}

const initialState: EdgesState = {
  edges: []
};

const edgesSlice = createSlice({
  name: 'edges',
  initialState,
  reducers: {
    addEdge: (state, action: PayloadAction<EdgeConfig>) => {
      state.edges.push(action.payload);
    },
    
    removeEdge: (state, action: PayloadAction<string>) => {
      state.edges = state.edges.filter(edge => edge.id !== action.payload);
    },
    
    updateEdge: (state, action: PayloadAction<EdgeConfig>) => {
      const index = state.edges.findIndex(edge => edge.id === action.payload.id);
      if (index !== -1) {
        state.edges[index] = action.payload;
      }
    },
    
    updateEdgeLabel: (state, action: PayloadAction<{ id: string; label: string }>) => {
      const { id, label } = action.payload;
      const edge = state.edges.find(edge => edge.id === id);
      if (edge) {
        edge.label = label;
      }
    },
    
    updateEdgeType: (state, action: PayloadAction<{ 
      id: string; 
      type: 'directional' | 'non-directional' | 'dashed' 
    }>) => {
      const { id, type } = action.payload;
      const edge = state.edges.find(edge => edge.id === id);
      if (edge) {
        edge.type = type;
      }
    },
    
    clearEdges: (state) => {
      state.edges = [];
    },
    
    setEdges: (state, action: PayloadAction<EdgeConfig[]>) => {
      state.edges = action.payload;
    }
  }
});

export const {
  addEdge,
  removeEdge,
  updateEdge,
  updateEdgeLabel,
  updateEdgeType,
  clearEdges,
  setEdges
} = edgesSlice.actions;

export default edgesSlice.reducer;