import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { Delete } from '@mui/icons-material';

interface PanelHeaderProps {
  title: string;
  onClose?: () => void;
  actionLabel?: string;
  onAction?: () => void;
  actionIcon?: React.ReactNode;
  actionColor?: 'error' | 'primary' | 'secondary' | 'inherit';
}

const PanelHeader: React.FC<PanelHeaderProps> = ({ title, onClose, actionLabel, onAction, actionIcon, actionColor = 'error' }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
    <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>{title}</Typography>
    {onAction && actionLabel && (
      <Button
        variant="outlined"
        color={actionColor}
        size="small"
        startIcon={actionIcon || <Delete />}
        onClick={onAction}
      >
        {actionLabel}
      </Button>
    )}
    {onClose && (
      <Button onClick={onClose} size="small" sx={{ minWidth: 0, ml: 1 }}>
        ✕
      </Button>
    )}
  </Box>
);

export default PanelHeader;
