import React, { memo, useState } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Collapse,
  IconButton,
  Divider,
} from '@mui/material';
import { ExpandMore, ExpandLess, Delete } from '@mui/icons-material';
import { CustomNodeData, UIOption } from '../../types';
import { UIOptionRenderer } from '../UIOptions/UIOptionRenderer';
import { useAppDispatch } from '../../store/hooks';
import { removeNode } from '../../store/nodesSlice';
import { markDirty } from '../../store/projectSlice';

// ✅ Reusable dual handle (source + target overlap, looks like one)
const DualHandle = ({ position, id }: { position: Position; id: string }) => (
  <>
    <Handle
      type="source"
      position={position}
      id={`${id}-source`}
      style={{
        background: '#1976d2',
        width: 12,
        height: 12,
        borderRadius: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 2,
      }}
      isConnectable
    />
    <Handle
      type="target"
      position={position}
      id={`${id}-target`}
      style={{
        background: 'transparent', // invisible, still works
        width: 12,
        height: 12,
        borderRadius: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 1,
      }}
      isConnectable
    />
  </>
);

const CustomNode: React.FC<NodeProps<CustomNodeData>> = ({ data, selected }) => {
  const dispatch = useAppDispatch();
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(
    data.isDescriptionExpanded || false
  );
  const [isHovered, setIsHovered] = useState(false);

  const handleUIOptionChange = (optionIndex: number, value: string | boolean) => {
    console.log(`Option ${optionIndex} changed to:`, value);
  };

  const toggleDescription = () => {
    setIsDescriptionExpanded(!isDescriptionExpanded);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch(removeNode(data.config.id));
    dispatch(markDirty());
  };

  return (
    <Box
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      sx={{ position: 'relative' }}
    >
      {/* Delete button */}
      {isHovered && (
        <IconButton
          onClick={handleDelete}
          sx={{
            position: 'absolute',
            top: -8,
            right: -8,
            zIndex: 1000,
            width: 24,
            height: 24,
            backgroundColor: 'error.main',
            color: 'white',
            '&:hover': {
              backgroundColor: 'error.dark',
            },
          }}
          size="small"
        >
          <Delete sx={{ fontSize: 14 }} />
        </IconButton>
      )}

      <Card
        sx={{
          width: 280,
          minHeight: 200,
          border: selected ? '2px solid #1976d2' : '1px solid #e0e0e0',
          boxShadow: selected ? 3 : 1,
          '&:hover': {
            boxShadow: 2,
          },
        }}
      >
        {/* Connection Handles - one dot per side (dual mode) */}
        <DualHandle position={Position.Top} id="top" />
        <DualHandle position={Position.Right} id="right" />
        <DualHandle position={Position.Bottom} id="bottom" />
        <DualHandle position={Position.Left} id="left" />

        <CardContent sx={{ p: 2 }}>
          {/* Node Label */}
          <Typography
            variant="h6"
            component="div"
            sx={{
              mb: 2,
              textAlign: 'center',
              fontWeight: 'bold',
              color: 'primary.main',
            }}
          >
            {data.config.label}
          </Typography>

          <Divider sx={{ mb: 2 }} />

          {/* UI Options */}
          <Box sx={{ mb: 2 }}>
            {data.config.uiOptions.map((option: UIOption, index: number) => (
              <UIOptionRenderer
                key={`${data.config.id}-option-${index}`}
                option={option}
                onChange={(value) => handleUIOptionChange(index, value)}
                disabled={false}
              />
            ))}
          </Box>

          <Divider sx={{ mb: 1 }} />

          {/* Collapsible Description */}
          <Box>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                cursor: 'pointer',
                '&:hover': {
                  backgroundColor: 'action.hover',
                },
                p: 0.5,
                borderRadius: 1,
              }}
              onClick={toggleDescription}
            >
              <Typography variant="body2" sx={{ flexGrow: 1, fontWeight: 'medium' }}>
                Description
              </Typography>
              <IconButton size="small" sx={{ p: 0 }}>
                {isDescriptionExpanded ? <ExpandLess /> : <ExpandMore />}
              </IconButton>
            </Box>

            <Collapse in={isDescriptionExpanded}>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  mt: 1,
                  p: 1,
                  backgroundColor: 'grey.50',
                  borderRadius: 1,
                  fontSize: '0.75rem',
                }}
              >
                {data.config.description}
              </Typography>
            </Collapse>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default memo(CustomNode);
