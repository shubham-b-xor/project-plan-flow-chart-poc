import React, { useState, useCallback } from 'react';
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  Divider,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox,
  Button,
} from '@mui/material';
import { Close, ExpandMore, Save, Delete, DragHandle } from '@mui/icons-material';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import SortableUIOption from '../UIOptions/SortableUIOption';
import SectionAccordion from '../common/SectionAccordion';
import ConfirmDialog from '../common/ConfirmDialog';
import EmptyState from '../common/EmptyState';
import PanelHeader from '../common/PanelHeader';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { setPropertiesPanelOpen, clearSelection } from '../../store/selectionSlice';
import { updateNodeUIOption, updateNodeUIOptionProperty, reorderNodeUIOptions, addNodeUIOption, removeNodeUIOption, removeNode } from '../../store/nodesSlice';
import { updateEdgeLabel, updateEdgeType, removeEdge } from '../../store/edgesSlice';
import { markDirty } from '../../store/projectSlice';
import { UIOption, EdgeType, InputType } from '../../types';

const PROPERTIES_PANEL_WIDTH = 320;

// Confirmation Dialog State Type
interface ConfirmDialogState {
  open: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
}


const PropertiesPanel: React.FC = () => {
  const dispatch = useAppDispatch();
  const { selectedNodeId, selectedEdgeId, propertiesPanelOpen } = useAppSelector(
    (state) => state.selection
  );
  const { nodes } = useAppSelector((state) => state.nodes);
  const { edges } = useAppSelector((state) => state.edges);

  const selectedNode = selectedNodeId 
    ? nodes.find(node => node.config.id === selectedNodeId)
    : null;
  
  const selectedEdge = selectedEdgeId 
    ? edges.find(edge => edge.id === selectedEdgeId)
    : null;

  // --- Confirmation Dialog State and Handlers ---
  const [confirmDialog, setConfirmDialog] = useState<ConfirmDialogState>({
    open: false,
    title: '',
    message: '',
    onConfirm: () => {},
  });

  const handleOpenConfirmDialog = (title: string, message: string, onConfirm: () => void) => {
    setConfirmDialog({ open: true, title, message, onConfirm });
  };

  const handleCloseConfirmDialog = () => {
    setConfirmDialog(prev => ({ ...prev, open: false }));
  };

  const handleConfirmAction = () => {
    confirmDialog.onConfirm();
    handleCloseConfirmDialog();
  };
  // ---------------------------------------------


  const handleClose = () => {
    dispatch(setPropertiesPanelOpen(false));
    dispatch(clearSelection());
  };

  const handleNodeUIOptionChange = (optionIndex: number, value: string | boolean) => {
    if (selectedNodeId) {
      dispatch(updateNodeUIOption({
        nodeId: selectedNodeId,
        optionIndex,
        value
      }));
      dispatch(markDirty());
    }
  };

  const handleNodeUIOptionPropertyChange = (
    optionIndex: number, 
    property: keyof UIOption, 
    value: any
  ) => {
    if (selectedNodeId) {
      dispatch(updateNodeUIOptionProperty({
        nodeId: selectedNodeId,
        optionIndex,
        property,
        value
      }));
      dispatch(markDirty());
    }
  };

  const handleEdgeLabelChange = (label: string) => {
    if (selectedEdgeId) {
      dispatch(updateEdgeLabel({ id: selectedEdgeId, label }));
      dispatch(markDirty());
    }
  };

  const handleEdgeTypeChange = (type: EdgeType) => {
    if (selectedEdgeId) {
      dispatch(updateEdgeType({ id: selectedEdgeId, type }));
      dispatch(markDirty());
    }
  };

  const performDeleteNode = useCallback(() => {
    if (selectedNodeId) {
      dispatch(removeNode(selectedNodeId));
      dispatch(clearSelection());
      dispatch(markDirty());
    }
  }, [dispatch, selectedNodeId]);

  const handleDeleteNode = () => {
    if (selectedNodeId && selectedNode) {
      handleOpenConfirmDialog(
        'Delete Node',
        `Are you sure you want to delete the "${selectedNode.config.label}" node? This action cannot be undone.`,
        performDeleteNode
      );
    }
  };

  const performDeleteEdge = useCallback(() => {
    if (selectedEdgeId) {
      dispatch(removeEdge(selectedEdgeId));
      dispatch(clearSelection());
      dispatch(markDirty());
    }
  }, [dispatch, selectedEdgeId]);

  const handleDeleteEdge = () => {
    if (selectedEdgeId) {
      handleOpenConfirmDialog(
        'Delete Edge',
        'Are you sure you want to delete this edge? This action cannot be undone.',
        performDeleteEdge
      );
    }
  };

  const performDeleteUIOption = useCallback((optionIndex: number) => {
    if (selectedNodeId) {
      dispatch(removeNodeUIOption({
        nodeId: selectedNodeId,
        optionIndex
      }));
      dispatch(markDirty());
    }
  }, [dispatch, selectedNodeId]);

  const handleDeleteUIOptionRequest = (optionLabel: string, optionIndex: number) => {
    handleOpenConfirmDialog(
      'Delete UI Option',
      `Are you sure you want to delete the "${optionLabel}" UI option? This action cannot be undone.`,
      () => performDeleteUIOption(optionIndex)
    );
  };
  
  // Drag and drop sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id && selectedNodeId) {
      dispatch(reorderNodeUIOptions({
        nodeId: selectedNodeId,
        activeId: active.id.toString(),
        overId: over!.id.toString(),
      }));
      dispatch(markDirty());
    }
  };

  const handleAddUIOption = () => {
    if (selectedNodeId && selectedNode) {
      dispatch(addNodeUIOption({
        nodeId: selectedNodeId,
        uiOption: {
          label: `Option ${selectedNode.config.uiOptions.length + 1}`,
          inputType: 'Textbox',
          isVisible: true,
          uiText: '',
          value: '',
          validation: { required: false }
        }
      }));
      dispatch(markDirty());
    }
  };

  return (
    <>
      <Drawer
        anchor="right"
        open={propertiesPanelOpen}
        variant="persistent"
        sx={{
          width: PROPERTIES_PANEL_WIDTH,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: PROPERTIES_PANEL_WIDTH,
            boxSizing: 'border-box',
            bgcolor: 'background.paper',
            borderLeft: '1px solid',
            borderColor: 'divider',
          },
        }}
      >
        <Box sx={{ p: 2 }}>
          <PanelHeader title="Properties" onClose={handleClose} />
          <Divider />
        </Box>

        <Box sx={{ overflow: 'auto', flex: 1, p: 2 }}>
          {selectedNode && (
            <Box>
              <PanelHeader
                title={`Node: ${selectedNode.config.label}`}
                actionLabel="Delete Node"
                onAction={handleDeleteNode}
                actionIcon={<Delete />}
                actionColor="error"
              />
              <SectionAccordion title="Basic Properties" defaultExpanded>
                <TextField
                  label="Node Label"
                  value={selectedNode.config.label}
                  fullWidth
                  size="small"
                  sx={{ mb: 2 }}
                  disabled
                />
                <TextField
                  label="Description"
                  value={selectedNode.config.description}
                  fullWidth
                  multiline
                  rows={3}
                  size="small"
                  sx={{ mb: 2 }}
                  disabled
                />
              </SectionAccordion>
              <SectionAccordion
                title="UI Options"
                defaultExpanded
                actions={
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddUIOption();
                    }}
                    sx={{ ml: 1 }}
                  >
                    Add Option
                  </Button>
                }
              >
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={handleDragEnd}
                >
                  <SortableContext
                    items={selectedNode.config.uiOptions.map((option, index) => option.id || `${selectedNodeId}-${index}`)}
                    strategy={verticalListSortingStrategy}
                  >
                    {selectedNode.config.uiOptions.map((option, index) => (
                      <SortableUIOption
                        key={option.id || `${selectedNodeId}-${index}`}
                        option={option}
                        index={index}
                        nodeId={selectedNodeId!}
                        onUIOptionChange={handleNodeUIOptionChange}
                        onUIOptionPropertyChange={handleNodeUIOptionPropertyChange}
                        onDeleteRequest={handleDeleteUIOptionRequest}
                      />
                    ))}
                  </SortableContext>
                </DndContext>
                {selectedNode.config.uiOptions.length === 0 && (
                  <EmptyState message="No UI options yet. Click 'Add Option' to create one." />
                )}
              </SectionAccordion>
            </Box>
          )}

          {selectedEdge && (
            <Box>
              <PanelHeader
                title="Edge Properties"
                actionLabel="Delete Edge"
                onAction={handleDeleteEdge}
                actionIcon={<Delete />}
                actionColor="error"
              />
              <SectionAccordion title="Display Settings" defaultExpanded>
                <TextField
                  label="Edge Text"
                  value={selectedEdge.label || ''}
                  onChange={(e) => handleEdgeLabelChange(e.target.value)}
                  fullWidth
                  size="small"
                  sx={{ mb: 2 }}
                  placeholder="Enter text to display on edge"
                  helperText="This text will appear on the edge and can be edited by double-clicking on the canvas"
                />
                <FormControl size="small" fullWidth sx={{ mb: 2 }}>
                  <InputLabel>Edge Type</InputLabel>
                  <Select
                    value={selectedEdge.type}
                    label="Edge Type"
                    onChange={(e) => handleEdgeTypeChange(e.target.value as EdgeType)}
                  >
                    <MenuItem value="directional">
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <span>→</span>
                        <span>Directional (with arrow)</span>
                      </Box>
                    </MenuItem>
                    <MenuItem value="non-directional">
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <span>—</span>
                        <span>Non-directional (simple line)</span>
                      </Box>
                    </MenuItem>
                    <MenuItem value="dashed">
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <span>- - -</span>
                        <span>Dashed (conditional)</span>
                      </Box>
                    </MenuItem>
                  </Select>
                </FormControl>
              </SectionAccordion>
              <SectionAccordion title="Connection Details">
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Source Node:</strong> {selectedEdge.source}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Target Node:</strong> {selectedEdge.target}
                  </Typography>
                  {selectedEdge.sourceHandle && (
                    <Typography variant="body2" color="text.secondary">
                      <strong>Source Handle:</strong> {selectedEdge.sourceHandle}
                    </Typography>
                  )}
                  {selectedEdge.targetHandle && (
                    <Typography variant="body2" color="text.secondary">
                      <strong>Target Handle:</strong> {selectedEdge.targetHandle}
                    </Typography>
                  )}
                </Box>
              </SectionAccordion>
            </Box>
          )}

          {!selectedNode && !selectedEdge && (
            <EmptyState message="Select a node or edge to view its properties" />
          )}
        </Box>

        <Box sx={{ p: 2, bgcolor: 'grey.50' }}>
          <Button
            variant="contained"
            startIcon={<Save />}
            fullWidth
            onClick={() => {
              // Save functionality could be implemented here
              console.log('Save properties');
            }}
          >
            Save Changes
          </Button>
        </Box>
      </Drawer>
      
      <ConfirmDialog
        open={confirmDialog.open}
        title={confirmDialog.title}
        message={confirmDialog.message}
        onClose={handleCloseConfirmDialog}
        onConfirm={handleConfirmAction}
      />
    </>
  );
};

export default PropertiesPanel;