import React, { useState } from 'react';
import { 
  EdgeProps, 
  getBezierPath, 
  EdgeLabelRenderer,
  BaseEdge,
  getStraightPath
} from 'reactflow';
import { IconButton, TextField, Box } from '@mui/material';
import { Delete, Edit } from '@mui/icons-material';
import { useAppDispatch } from '../../store/hooks';
import { removeEdge, updateEdgeLabel } from '../../store/edgesSlice';
import { selectEdge } from '../../store/selectionSlice';
import { markDirty } from '../../store/projectSlice';

const CustomEdge: React.FC<EdgeProps> = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  label,
  markerEnd,
  style = {},
  data
}) => {
  const dispatch = useAppDispatch();
  const [isHovered, setIsHovered] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(label?.toString() || '');

  // Get edge path based on type
  const getEdgePath = () => {
    if (data?.type === 'dashed' || data?.type === 'non-directional') {
      return getStraightPath({
        sourceX,
        sourceY,
        targetX,
        targetY,
      });
    }
    
    return getBezierPath({
      sourceX,
      sourceY,
      sourcePosition,
      targetX,
      targetY,
      targetPosition,
    });
  };

  const [edgePath, labelX, labelY] = getEdgePath();

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch(removeEdge(id));
    dispatch(markDirty());
  };

  const handleEdgeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch(selectEdge(id));
  };

  const handleLabelDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditing(true);
    setEditValue(label?.toString() || '');
  };

  const handleLabelSave = () => {
    dispatch(updateEdgeLabel({ id, label: editValue }));
    dispatch(markDirty());
    setIsEditing(false);
  };

  const handleLabelCancel = () => {
    setEditValue(label?.toString() || '');
    setIsEditing(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleLabelSave();
    } else if (e.key === 'Escape') {
      handleLabelCancel();
    }
  };

  return (
    <>
      <BaseEdge
        path={edgePath}
        markerEnd={markerEnd}
        style={{
          ...style,
          strokeWidth: isHovered ? 3 : 2,
          stroke: isHovered ? '#1976d2' : style.stroke || '#b1b1b7',
        }}
      />
      
      {/* Invisible thicker path for better hover detection */}
      <path
        d={edgePath}
        fill="none"
        stroke="transparent"
        strokeWidth={20} // Much larger hover area
        style={{ cursor: 'pointer' }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleEdgeClick}
      />

      <EdgeLabelRenderer>
        <div
          style={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            fontSize: 12,
            pointerEvents: 'all',
          }}
          className="nodrag nopan"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {isEditing ? (
            <TextField
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onBlur={handleLabelSave}
              onKeyDown={handleKeyPress}
              size="small"
              autoFocus
              variant="outlined"
              sx={{
                minWidth: 100,
                '& .MuiOutlinedInput-root': {
                  height: 32,
                  fontSize: 12,
                  backgroundColor: 'white',
                  '& fieldset': {
                    borderColor: '#1976d2',
                  },
                },
              }}
            />
          ) : (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
                backgroundColor: 'white',
                border: '1px solid #e0e0e0',
                borderRadius: 1,
                padding: '6px 12px',
                minHeight: 32,
                fontSize: 12,
                cursor: 'pointer',
                minWidth: isHovered ? 120 : 80, // Expand on hover to prevent jumping
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  borderColor: '#1976d2',
                  backgroundColor: '#f5f5f5',
                },
              }}
              onDoubleClick={handleLabelDoubleClick}
              onClick={handleEdgeClick}
            >
              <span style={{ flexGrow: 1 }}>
                {label || 'Click to add text'}
              </span>
              
              {isHovered && (
                <Box 
                  sx={{ 
                    display: 'flex', 
                    alignItems: 'center',
                    gap: 0.5,
                    opacity: 1,
                    transition: 'opacity 0.1s ease-in-out'
                  }}
                >
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleLabelDoubleClick(e);
                    }}
                    sx={{
                      width: 24,
                      height: 24,
                      color: 'primary.main',
                      '&:hover': {
                        backgroundColor: 'primary.light',
                        color: 'white',
                      },
                    }}
                  >
                    <Edit sx={{ fontSize: 14 }} />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(e);
                    }}
                    sx={{
                      width: 24,
                      height: 24,
                      color: 'error.main',
                      '&:hover': {
                        backgroundColor: 'error.main',
                        color: 'white',
                      },
                    }}
                  >
                    <Delete sx={{ fontSize: 14 }} />
                  </IconButton>
                </Box>
              )}
            </Box>
          )}
        </div>
      </EdgeLabelRenderer>
    </>
  );
};

export default CustomEdge;