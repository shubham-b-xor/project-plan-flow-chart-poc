import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CustomNodeData, UIOption } from '../types';
import { nodeConfigs } from '../config/nodeConfigs';

interface NodesState {
  nodes: CustomNodeData[];
  draggedNodeType: string | null;
}

const initialState: NodesState = {
  nodes: [],
  draggedNodeType: null
};

const nodesSlice = createSlice({
  name: 'nodes',
  initialState,
  reducers: {
    addNode: (state, action: PayloadAction<{ 
      configId: string; 
      position: { x: number; y: number }; 
      id: string;
    }>) => {
      const { configId, position, id } = action.payload;
      const config = nodeConfigs.find((c: any) => c.id === configId);
      
      if (config) {
        const newNode: CustomNodeData = {
          config: { ...config, id }, // Use unique id for the node instance
          position,
          isDescriptionExpanded: false
        };
        state.nodes.push(newNode);
      }
    },
    
    removeNode: (state, action: PayloadAction<string>) => {
      state.nodes = state.nodes.filter((node: any) => node.config.id !== action.payload);
    },
    
    updateNodePosition: (state, action: PayloadAction<{ 
      id: string; 
      position: { x: number; y: number } 
    }>) => {
      const { id, position } = action.payload;
      const node = state.nodes.find((n: any) => n.config.id === id);
      if (node) {
        node.position = position;
      }
    },
    
    updateNodeUIOption: (state, action: PayloadAction<{
      nodeId: string;
      optionIndex: number;
      value: string | boolean;
    }>) => {
      const { nodeId, optionIndex, value } = action.payload;
      const node = state.nodes.find((n: any) => n.config.id === nodeId);
      if (node && node.config.uiOptions[optionIndex]) {
        node.config.uiOptions[optionIndex].value = value;
      }
    },
    
    updateNodeUIOptionProperty: (state, action: PayloadAction<{
      nodeId: string;
      optionIndex: number;
      property: keyof UIOption;
      value: any;
    }>) => {
      const { nodeId, optionIndex, property, value } = action.payload;
      const node = state.nodes.find((n: any) => n.config.id === nodeId);
      if (node && node.config.uiOptions[optionIndex]) {
        (node.config.uiOptions[optionIndex] as any)[property] = value;
      }
    },
    
    toggleNodeDescription: (state, action: PayloadAction<string>) => {
      const node = state.nodes.find((n: any) => n.config.id === action.payload);
      if (node) {
        node.isDescriptionExpanded = !node.isDescriptionExpanded;
      }
    },
    
    setDraggedNodeType: (state, action: PayloadAction<string | null>) => {
      state.draggedNodeType = action.payload;
    },
    
    clearNodes: (state) => {
      state.nodes = [];
    },
    
    setNodes: (state, action: PayloadAction<CustomNodeData[]>) => {
      state.nodes = action.payload;
    }
  }
});

export const {
  addNode,
  removeNode,
  updateNodePosition,
  updateNodeUIOption,
  updateNodeUIOptionProperty,
  toggleNodeDescription,
  setDraggedNodeType,
  clearNodes,
  setNodes
} = nodesSlice.actions;

export default nodesSlice.reducer;