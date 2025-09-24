export interface UIOption {
  label: string;
  inputType: 'Textbox' | 'Checkbox' | 'Button' | 'Div';
  isVisible: boolean;
  validation?: {
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    pattern?: string;
  };
  uiText?: string;
  value?: string | boolean;
}

export interface NodeConfig {
  id: string;
  label: string;
  type: string;
  description: string;
  uiOptions: UIOption[];
}

export interface CustomNodeData {
  config: NodeConfig;
  position: { x: number; y: number };
  isDescriptionExpanded?: boolean;
}

export interface EdgeConfig {
  id: string;
  source: string;
  target: string;
  sourceHandle?: string;
  targetHandle?: string;
  type: 'directional' | 'non-directional' | 'dashed';
  label?: string;
  animated?: boolean;
}

export interface ProjectState {
  projectName: string;
  nodes: CustomNodeData[];
  edges: EdgeConfig[];
  selectedNodeId?: string;
  selectedEdgeId?: string;
}

export type HandleType = 'top' | 'right' | 'bottom' | 'left';

export type InputType = 'Textbox' | 'Checkbox' | 'Button' | 'Div';

export type EdgeType = 'directional' | 'non-directional' | 'dashed';