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
    
    reorderNodeUIOptions: (state, action: PayloadAction<{
      nodeId: string;
      activeId: string;
      overId: string;
    }>) => {
      const { nodeId, activeId, overId } = action.payload;
      const node = state.nodes.find((n: any) => n.config.id === nodeId);
      if (node && node.config.uiOptions) {
        const activeIndex = node.config.uiOptions.findIndex((option: UIOption) => 
          option.id === activeId || `${nodeId}-${node.config.uiOptions.indexOf(option)}` === activeId
        );
        const overIndex = node.config.uiOptions.findIndex((option: UIOption) => 
          option.id === overId || `${nodeId}-${node.config.uiOptions.indexOf(option)}` === overId
        );
        
        if (activeIndex !== -1 && overIndex !== -1 && activeIndex !== overIndex) {
          const [movedOption] = node.config.uiOptions.splice(activeIndex, 1);
          node.config.uiOptions.splice(overIndex, 0, movedOption);
        }
      }
    },
    
    addNodeUIOption: (state, action: PayloadAction<{
      nodeId: string;
      uiOption?: Partial<UIOption>;
    }>) => {
      const { nodeId, uiOption } = action.payload;
      const node = state.nodes.find((n: any) => n.config.id === nodeId);
      if (node) {
        const timestamp = Date.now();
        const random = Math.random().toString(36).substr(2, 9);
        const newOption: UIOption = {
          id: `${nodeId}-option-${timestamp}-${random}`,
          label: uiOption?.label || 'New Option',
          inputType: uiOption?.inputType || 'Textbox',
          isVisible: uiOption?.isVisible ?? true,
          uiText: uiOption?.uiText || '',
          value: uiOption?.value || '',
          validation: uiOption?.validation || { required: false }
        };
        node.config.uiOptions.push(newOption);
      }
    },
    
    removeNodeUIOption: (state, action: PayloadAction<{
      nodeId: string;
      optionIndex: number;
    }>) => {
      const { nodeId, optionIndex } = action.payload;
      const node = state.nodes.find((n: any) => n.config.id === nodeId);
      if (node && node.config.uiOptions[optionIndex]) {
        node.config.uiOptions.splice(optionIndex, 1);
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
  reorderNodeUIOptions,
  addNodeUIOption,
  removeNodeUIOption,
  toggleNodeDescription,
  setDraggedNodeType,
  clearNodes,
  setNodes
} = nodesSlice.actions;

export default nodesSlice.reducer;