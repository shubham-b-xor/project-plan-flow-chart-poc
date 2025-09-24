import React from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  Box,
  Chip,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
import {
  Login,
  Dashboard,
  Person,
  Description,
  List as ListIcon,
  TableChart,
  Settings,
  PersonAdd,
  Message,
  Error,
  ExpandMore
} from '@mui/icons-material';
import { nodeConfigs, getAllNodeTypes } from '../../config/nodeConfigs';
import { NodeConfig } from '../../types';

const SIDEBAR_WIDTH = 320;

// Icon mapping for different node types
const getNodeIcon = (nodeId: string) => {
  const iconMap: { [key: string]: React.ReactElement } = {
    login: <Login />,
    dashboard: <Dashboard />,
    profile: <Person />,
    fileview: <Description />,
    list: <ListIcon />,
    table: <TableChart />,
    settings: <Settings />,
    createaccount: <PersonAdd />,
    messagewindow: <Message />,
    errorpage: <Error />
  };
  return iconMap[nodeId] || <Description />;
};

// Color mapping for different node types
const getTypeColor = (type: string): "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning" => {
  const colorMap: { [key: string]: "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning" } = {
    auth: 'primary',
    main: 'success',
    user: 'info',
    content: 'secondary',
    config: 'warning',
    communication: 'info',
    system: 'error'
  };
  return colorMap[type] || 'default';
};

interface SidebarProps {
  open: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ open }) => {
  const nodeTypes = getAllNodeTypes();

  const handleDragStart = (event: React.DragEvent, nodeConfig: NodeConfig) => {
    event.dataTransfer.setData('application/reactflow', nodeConfig.id);
    event.dataTransfer.effectAllowed = 'move';
  };

  const getNodesByType = (type: string) => {
    return nodeConfigs.filter(config => config.type === type);
  };

  return (
    <Drawer
      variant="persistent"
      anchor="left"
      open={open}
      sx={{
        width: SIDEBAR_WIDTH,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: SIDEBAR_WIDTH,
          boxSizing: 'border-box',
          bgcolor: 'background.paper',
          borderRight: '1px solid',
          borderColor: 'divider',
        },
      }}
    >
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" component="div" sx={{ mb: 2, fontWeight: 'bold' }}>
          Node Library
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Drag nodes to the canvas to build your flow
        </Typography>
        <Divider />
      </Box>

      <Box sx={{ overflow: 'auto', flex: 1 }}>
        {nodeTypes.map((type) => (
          <Accordion key={type} defaultExpanded>
            <AccordionSummary
              expandIcon={<ExpandMore />}
              sx={{
                bgcolor: 'grey.50',
                '&:hover': {
                  bgcolor: 'grey.100'
                }
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 'medium', textTransform: 'capitalize' }}>
                  {type}
                </Typography>
                <Chip 
                  label={getNodesByType(type).length} 
                  size="small" 
                  color={getTypeColor(type)}
                />
              </Box>
            </AccordionSummary>
            <AccordionDetails sx={{ p: 0 }}>
              <List>
                {getNodesByType(type).map((nodeConfig) => (
                  <ListItem
                    key={nodeConfig.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, nodeConfig)}
                    sx={{
                      cursor: 'grab',
                      '&:hover': {
                        bgcolor: 'action.hover',
                      },
                      '&:active': {
                        cursor: 'grabbing',
                      },
                      borderRadius: 1,
                      mb: 0.5
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: 35 }}>
                      {getNodeIcon(nodeConfig.id)}
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                          {nodeConfig.label}
                        </Typography>
                      }
                      secondary={
                        <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
                          {nodeConfig.description.length > 50 
                            ? `${nodeConfig.description.substring(0, 50)}...` 
                            : nodeConfig.description
                          }
                        </Typography>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </AccordionDetails>
          </Accordion>
        ))}
      </Box>

      <Box sx={{ p: 2, bgcolor: 'grey.50' }}>
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', textAlign: 'center' }}>
          {nodeConfigs.length} nodes available
        </Typography>
      </Box>
    </Drawer>
  );
};

export default Sidebar;