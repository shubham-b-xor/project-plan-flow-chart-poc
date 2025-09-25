import React from 'react';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box,
  Typography,
  IconButton,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox,
} from '@mui/material';
import { Delete, DragHandle, ExpandMore } from '@mui/icons-material';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { UIOption, InputType } from '../../types';

interface SortableUIOptionProps {
  option: UIOption;
  index: number;
  nodeId: string;
  onUIOptionChange: (optionIndex: number, value: string | boolean) => void;
  onUIOptionPropertyChange: (optionIndex: number, property: keyof UIOption, value: any) => void;
  onDeleteRequest: (optionLabel: string, optionIndex: number) => void;
}

const SortableUIOption: React.FC<SortableUIOptionProps> = ({
  option,
  index,
  nodeId,
  onUIOptionChange,
  onUIOptionPropertyChange,
  onDeleteRequest,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: option.id || `${nodeId}-${index}` });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <Accordion
      ref={setNodeRef}
      style={style}
      sx={{ mb: 1, bgcolor: isDragging ? 'action.hover' : 'background.paper' }}
    >
      <AccordionSummary
        expandIcon={<ExpandMore />}
        sx={{ '& .MuiAccordionSummary-content': { alignItems: 'center', gap: 1, justifyContent: 'space-between' } }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton
            size="small"
            {...attributes}
            {...listeners}
            sx={{ cursor: 'grab', '&:active': { cursor: 'grabbing' } }}
          >
            <DragHandle fontSize="small" />
          </IconButton>
          <Typography variant="body2">{option.label}</Typography>
        </Box>
        <Box
          onClick={e => {
            e.stopPropagation();
            onDeleteRequest(option.label, index);
          }}
          sx={{ p: 0.5, lineHeight: 0, color: 'error.main', borderRadius: '50%', cursor: 'pointer', '&:hover': { bgcolor: 'action.hover' } }}
        >
          <Delete fontSize="small" />
        </Box>
      </AccordionSummary>
      <AccordionDetails>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <TextField
            label="Label"
            value={option.label}
            onChange={e => onUIOptionPropertyChange(index, 'label', e.target.value)}
            size="small"
            fullWidth
          />
          <FormControl size="small" fullWidth>
            <InputLabel>Input Type</InputLabel>
            <Select
              value={option.inputType}
              label="Input Type"
              onChange={e => onUIOptionPropertyChange(index, 'inputType', e.target.value as InputType)}
            >
              <MenuItem value="Textbox">Textbox</MenuItem>
              <MenuItem value="Checkbox">Checkbox</MenuItem>
              <MenuItem value="Button">Button</MenuItem>
              <MenuItem value="Div">Div</MenuItem>
              <MenuItem value="Image">Image</MenuItem>
            </Select>
          </FormControl>
          <TextField
            label="UI Text"
            value={option.uiText || ''}
            onChange={e => onUIOptionPropertyChange(index, 'uiText', e.target.value)}
            size="small"
            fullWidth
          />
          {(option.inputType === 'Textbox' || option.inputType === 'Checkbox') && (
            <TextField
              label={option.inputType === 'Checkbox' ? 'Checked' : 'Value'}
              value={option.value?.toString() || ''}
              onChange={e => {
                const value = option.inputType === 'Checkbox' ? e.target.value === 'true' : e.target.value;
                onUIOptionChange(index, value);
              }}
              size="small"
              fullWidth
            />
          )}
          <FormControlLabel
            control={
              <Checkbox
                checked={option.isVisible}
                onChange={e => onUIOptionPropertyChange(index, 'isVisible', e.target.checked)}
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
                    onChange={e => onUIOptionPropertyChange(index, 'validation', { ...option.validation, required: e.target.checked })}
                  />
                }
                label="Required"
              />
            </Box>
          )}
        </Box>
      </AccordionDetails>
    </Accordion>
  );
};

export default SortableUIOption;
