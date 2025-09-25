import React from 'react';
import { Box, Typography, Button } from '@mui/material';

interface EmptyStateProps {
  message: string;
  actionLabel?: string;
  onAction?: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({ message, actionLabel, onAction }) => (
  <Box sx={{ textAlign: 'center', py: 2, color: 'text.secondary' }}>
    <Typography variant="body2">{message}</Typography>
    {actionLabel && onAction && (
      <Button variant="outlined" size="small" sx={{ mt: 1 }} onClick={onAction}>
        {actionLabel}
      </Button>
    )}
  </Box>
);

export default EmptyState;
