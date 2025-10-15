import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SelectionState {
  selectedNodeId: string | null;
  selectedEdgeId: string | null;
  propertiesPanelOpen: boolean;
}

const initialState: SelectionState = {
  selectedNodeId: null,
  selectedEdgeId: null,
  propertiesPanelOpen: false
};

const selectionSlice = createSlice({
  name: 'selection',
  initialState,
  reducers: {
    selectNode: (state, action: PayloadAction<string>) => {
      state.selectedNodeId = action.payload;
      state.selectedEdgeId = null;
      state.propertiesPanelOpen = true;
    },
    
    selectEdge: (state, action: PayloadAction<string>) => {
      state.selectedEdgeId = action.payload;
      state.selectedNodeId = null;
      state.propertiesPanelOpen = true;
    },
    
    clearSelection: (state) => {
      state.selectedNodeId = null;
      state.selectedEdgeId = null;
      state.propertiesPanelOpen = false;
    },
    
    setPropertiesPanelOpen: (state, action: PayloadAction<boolean>) => {
      state.propertiesPanelOpen = action.payload;
    },
    
    togglePropertiesPanel: (state) => {
      state.propertiesPanelOpen = !state.propertiesPanelOpen;
    }
  }
});

export const {
  selectNode,
  selectEdge,
  clearSelection,
  setPropertiesPanelOpen,
  togglePropertiesPanel
} = selectionSlice.actions;

export default selectionSlice.reducer;