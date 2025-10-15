import React from 'react';
import { Fab, Tooltip, useTheme } from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { togglePropertiesPanel } from '../../store/selectionSlice';

const PROPERTIES_PANEL_WIDTH = 350;

const PropertiesPanelToggle: React.FC = () => {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const { propertiesPanelOpen } = useAppSelector((state) => state.selection);

  const handleToggle = () => {
    dispatch(togglePropertiesPanel());
  };

  return (
    <Tooltip 
      title={propertiesPanelOpen ? "Hide Properties Panel" : "Show Properties Panel"} 
      placement="left"
    >
      <Fab
        color="primary"
        size="medium"
        onClick={handleToggle}
        sx={{
          position: 'fixed',
          bottom: 20,
          right: propertiesPanelOpen ? PROPERTIES_PANEL_WIDTH + 20 : 20,
          transition: theme.transitions.create(['right'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
          zIndex: theme.zIndex.speedDial,
          boxShadow: theme.shadows[4],
          '&:hover': {
            boxShadow: theme.shadows[8],
          },
        }}
      >
        {propertiesPanelOpen ? <ChevronRightIcon /> : <ChevronLeftIcon />}
      </Fab>
    </Tooltip>
  );
};

export default PropertiesPanelToggle;