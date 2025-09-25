import React, { useCallback, useRef } from 'react';
import ReactFlow, {
  Node,
  Edge,
  useNodesState,
  useEdgesState,
  Connection,
  EdgeTypes,
  NodeTypes,
  ReactFlowProvider,
  Controls,
  MiniMap,
  Background,
  BackgroundVariant,
  MarkerType,
  ConnectionMode
} from 'reactflow';
import { Box } from '@mui/material';
import 'reactflow/dist/style.css';

import CustomNode from '../Nodes/CustomNode';
import CustomEdge from './CustomEdge';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { addNode, updateNodePosition } from '../../store/nodesSlice';
import { addEdge as addEdgeAction } from '../../store/edgesSlice';
import { selectNode, selectEdge, clearSelection } from '../../store/selectionSlice';
import { markDirty } from '../../store/projectSlice';
import { getNodeConfigById } from '../../config/nodeConfigs';
import { CustomNodeData, EdgeConfig } from '../../types';

const edgeTypes: EdgeTypes = {
  default: CustomEdge,
  directional: CustomEdge,
  'non-directional': CustomEdge,
  dashed: CustomEdge,
};

const nodeTypes: NodeTypes = {
  customNode: CustomNode,
};

interface CanvasProps {
  sidebarWidth: number;
}

const Canvas: React.FC<CanvasProps> = ({ sidebarWidth }) => {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const dispatch = useAppDispatch();
  const { nodes: nodeData } = useAppSelector((state) => state.nodes);
  const { edges: edgeData } = useAppSelector((state) => state.edges);
  const { selectedNodeId, selectedEdgeId } = useAppSelector((state) => state.selection);

  const nodes: Node<CustomNodeData>[] = React.useMemo(() => 
    nodeData.map((nodeItem, index) => ({
      id: nodeItem.config.id,
      type: 'customNode',
      position: nodeItem.position,
      data: nodeItem,
      selected: selectedNodeId === nodeItem.config.id
    })), [nodeData, selectedNodeId]
  );

  const edges: Edge[] = React.useMemo(() => 
    edgeData.map((edge) => ({
      id: edge.id,
      source: edge.source,
      target: edge.target,
      sourceHandle: edge.sourceHandle,
      targetHandle: edge.targetHandle,
      type: 'default',
      label: edge.label,
      animated: edge.animated || false,
      markerEnd: edge.type === 'directional' ? { type: MarkerType.ArrowClosed } : undefined,
      style: edge.type === 'dashed' ? { strokeDasharray: '5,5' } : undefined,
      selected: selectedEdgeId === edge.id,
      data: { type: edge.type } // Pass the actual edge type in data
    })), [edgeData, selectedEdgeId]
  );

  const [reactFlowNodes, setNodes, onNodesChange] = useNodesState([]);
  const [reactFlowEdges, setEdges, onEdgesChange] = useEdgesState([]);

  // Update ReactFlow nodes when Redux state changes
  React.useEffect(() => {
    setNodes(nodes);
  }, [nodes, setNodes]);

  // Update ReactFlow edges when Redux state changes
  React.useEffect(() => {
    setEdges(edges);
  }, [edges, setEdges]);

  const onConnect = useCallback(
    (connection: Connection) => {
      if (connection.source && connection.target) {
        const newEdge: EdgeConfig = {
          id: `edge-${Date.now()}`,
          source: connection.source,
          target: connection.target,
          sourceHandle: connection.sourceHandle || undefined,
          targetHandle: connection.targetHandle || undefined,
          type: 'directional', // Default edge type
          label: '',
          animated: false
        };
        dispatch(addEdgeAction(newEdge));
        dispatch(markDirty());
      }
    },
    [dispatch]
  );

  const onNodeClick = useCallback(
    (event: React.MouseEvent, node: Node) => {
      dispatch(selectNode(node.id));
    },
    [dispatch]
  );

  const onEdgeClick = useCallback(
    (event: React.MouseEvent, edge: Edge) => {
      dispatch(selectEdge(edge.id));
    },
    [dispatch]
  );

  const onPaneClick = useCallback(() => {
    dispatch(clearSelection());
  }, [dispatch]);

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const nodeConfigId = event.dataTransfer.getData('application/reactflow');
      const nodeConfig = getNodeConfigById(nodeConfigId);

      if (!nodeConfig || !reactFlowWrapper.current) return;

      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      const position = {
        x: event.clientX - reactFlowBounds.left - sidebarWidth,
        y: event.clientY - reactFlowBounds.top - 100, // Account for top bar height
      };

      // Create a unique ID for this node instance
      const newNodeId = `${nodeConfigId}-${Date.now()}`;
      dispatch(addNode({
        configId: nodeConfigId,
        position,
        id: newNodeId
      }));
      dispatch(markDirty());
    },
    [dispatch, sidebarWidth]
  );

  const onNodeDragStop = useCallback(
    (event: React.MouseEvent, node: Node) => {
      dispatch(updateNodePosition({
        id: node.id,
        position: node.position
      }));
      dispatch(markDirty());
    },
    [dispatch]
  );

  return (
    <Box
      ref={reactFlowWrapper}
      sx={{
        width: '100%',
        height: '92vh',
        bgcolor: 'grey.50'
      }}
    >
      <ReactFlowProvider>
        <ReactFlow
          nodes={reactFlowNodes}
          edges={reactFlowEdges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={onNodeClick}
          onEdgeClick={onEdgeClick}
          onPaneClick={onPaneClick}
          onDrop={onDrop}
          onDragOver={onDragOver}
          onNodeDragStop={onNodeDragStop}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          connectionMode={ConnectionMode.Loose}
          fitView
          minZoom={0.2}
          maxZoom={2}
          defaultEdgeOptions={{
            animated: false,
            style: { strokeWidth: 2 },
          }}
        >
          <Controls />
          <MiniMap 
            nodeStrokeColor="#1976d2"
            nodeColor="#fff"
            nodeBorderRadius={2}
          />
          <Background 
            variant={BackgroundVariant.Dots} 
            gap={12} 
            size={1} 
            color="#838282ff"
          />
        </ReactFlow>
      </ReactFlowProvider>
    </Box>
  );
};

export default Canvas;