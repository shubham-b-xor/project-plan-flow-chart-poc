import React from 'react';
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
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Button
} from '@mui/material';
import { Close, ExpandMore, Save, Delete } from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { setPropertiesPanelOpen, clearSelection } from '../../store/selectionSlice';
import { updateNodeUIOption, updateNodeUIOptionProperty, removeNode } from '../../store/nodesSlice';
import { updateEdgeLabel, updateEdgeType, removeEdge } from '../../store/edgesSlice';
import { markDirty } from '../../store/projectSlice';
import { UIOption, EdgeType, InputType } from '../../types';

const PROPERTIES_PANEL_WIDTH = 320;

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

  const handleDeleteNode = () => {
    if (selectedNodeId && selectedNode) {
      const confirmDelete = window.confirm(`Are you sure you want to delete the "${selectedNode.config.label}" node?`);
      if (confirmDelete) {
        dispatch(removeNode(selectedNode.config.id));
        dispatch(clearSelection());
        dispatch(markDirty());
      }
    }
  };

  const handleDeleteEdge = () => {
    if (selectedEdgeId) {
      const confirmDelete = window.confirm('Are you sure you want to delete this edge?');
      if (confirmDelete) {
        dispatch(removeEdge(selectedEdgeId));
        dispatch(clearSelection());
        dispatch(markDirty());
      }
    }
  };

  return (
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
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
            Properties
          </Typography>
          <IconButton onClick={handleClose} size="small">
            <Close />
          </IconButton>
        </Box>
        <Divider />
      </Box>

      <Box sx={{ overflow: 'auto', flex: 1, p: 2 }}>
        {selectedNode && (
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                Node: {selectedNode.config.label}
              </Typography>
              <Button
                variant="outlined"
                color="error"
                size="small"
                startIcon={<Delete />}
                onClick={handleDeleteNode}
              >
                Delete Node
              </Button>
            </Box>
            
            <Accordion defaultExpanded>
              <AccordionSummary expandIcon={<ExpandMore />}>
                <Typography variant="subtitle2">Basic Properties</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <TextField
                  label="Node Label"
                  value={selectedNode.config.label}
                  fullWidth
                  size="small"
                  sx={{ mb: 2 }}
                  disabled // For now, don't allow changing the base label
                />
                <TextField
                  label="Description"
                  value={selectedNode.config.description}
                  fullWidth
                  multiline
                  rows={3}
                  size="small"
                  sx={{ mb: 2 }}
                  disabled // For now, don't allow changing the base description
                />
              </AccordionDetails>
            </Accordion>

            <Accordion defaultExpanded>
              <AccordionSummary expandIcon={<ExpandMore />}>
                <Typography variant="subtitle2">UI Options</Typography>
              </AccordionSummary>
              <AccordionDetails>
                {selectedNode.config.uiOptions.map((option, index) => (
                  <Accordion key={index} sx={{ mb: 1 }}>
                    <AccordionSummary expandIcon={<ExpandMore />}>
                      <Typography variant="body2">{option.label}</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                        <TextField
                          label="Label"
                          value={option.label}
                          onChange={(e) => handleNodeUIOptionPropertyChange(index, 'label', e.target.value)}
                          size="small"
                          fullWidth
                        />
                        
                        <FormControl size="small" fullWidth>
                          <InputLabel>Input Type</InputLabel>
                          <Select
                            value={option.inputType}
                            label="Input Type"
                            onChange={(e) => handleNodeUIOptionPropertyChange(index, 'inputType', e.target.value as InputType)}
                          >
                            <MenuItem value="Textbox">Textbox</MenuItem>
                            <MenuItem value="Checkbox">Checkbox</MenuItem>
                            <MenuItem value="Button">Button</MenuItem>
                            <MenuItem value="Div">Div</MenuItem>
                          </Select>
                        </FormControl>

                        <TextField
                          label="UI Text"
                          value={option.uiText || ''}
                          onChange={(e) => handleNodeUIOptionPropertyChange(index, 'uiText', e.target.value)}
                          size="small"
                          fullWidth
                        />

                        {(option.inputType === 'Textbox' || option.inputType === 'Checkbox') && (
                          <TextField
                            label={option.inputType === 'Checkbox' ? 'Checked' : 'Value'}
                            value={option.value?.toString() || ''}
                            onChange={(e) => {
                              const value = option.inputType === 'Checkbox' 
                                ? e.target.value === 'true' 
                                : e.target.value;
                              handleNodeUIOptionChange(index, value);
                            }}
                            size="small"
                            fullWidth
                          />
                        )}

                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={option.isVisible}
                              onChange={(e) => handleNodeUIOptionPropertyChange(index, 'isVisible', e.target.checked)}
                            />
                          }
                          label="Visible"
                        />

                        {option.validation && (
                          <Box sx={{ mt: 1 }}>
                            <Typography variant="caption" sx={{ fontWeight: 'bold' }}>
                              Validation:
                            </Typography>
                            <FormControlLabel
                              control={
                                <Checkbox
                                  checked={option.validation.required || false}
                                  onChange={(e) => handleNodeUIOptionPropertyChange(
                                    index, 
                                    'validation', 
                                    { ...option.validation, required: e.target.checked }
                                  )}
                                />
                              }
                              label="Required"
                            />
                          </Box>
                        )}
                      </Box>
                    </AccordionDetails>
                  </Accordion>
                ))}
              </AccordionDetails>
            </Accordion>
          </Box>
        )}

        {selectedEdge && (
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                Edge Properties
              </Typography>
              <Button
                variant="outlined"
                color="error"
                size="small"
                startIcon={<Delete />}
                onClick={handleDeleteEdge}
              >
                Delete Edge
              </Button>
            </Box>
            
            <Accordion defaultExpanded>
              <AccordionSummary expandIcon={<ExpandMore />}>
                <Typography variant="subtitle2">Display Settings</Typography>
              </AccordionSummary>
              <AccordionDetails>
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
              </AccordionDetails>
            </Accordion>

            <Accordion>
              <AccordionSummary expandIcon={<ExpandMore />}>
                <Typography variant="subtitle2">Connection Details</Typography>
              </AccordionSummary>
              <AccordionDetails>
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
              </AccordionDetails>
            </Accordion>
          </Box>
        )}

        {!selectedNode && !selectedEdge && (
          <Box sx={{ textAlign: 'center', mt: 4 }}>
            <Typography variant="body2" color="text.secondary">
              Select a node or edge to view its properties
            </Typography>
          </Box>
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
  );
};

export default PropertiesPanel;