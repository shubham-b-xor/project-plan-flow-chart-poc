import React, { useState, useMemo } from 'react';
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
  AccordionDetails,
  TextField,
  FormControl,
  Select,
  MenuItem
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
import FilterListIcon from '@mui/icons-material/FilterList';
import { nodeConfigs, getAllNodeTypes } from '../../config/nodeConfigs';
import { NodeConfig } from '../../types';

const SIDEBAR_WIDTH = 250;

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
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');

  const filteredNodeConfigs = useMemo(() => {
    return nodeConfigs.filter(config => {
      const matchesType = typeFilter === 'all' || config.type === typeFilter;
      const matchesSearch =
        config.label.toLowerCase().includes(search.toLowerCase()) ||
        config.description.toLowerCase().includes(search.toLowerCase());
      return matchesType && matchesSearch;
    });
  }, [search, typeFilter]);

  const filteredTypes = useMemo(() => {
    return nodeTypes.filter(type =>
      filteredNodeConfigs.some(config => config.type === type)
    );
  }, [filteredNodeConfigs, nodeTypes]);

  const handleDragStart = (event: React.DragEvent, nodeConfig: NodeConfig) => {
    event.dataTransfer.setData('application/reactflow', nodeConfig.id);
    event.dataTransfer.effectAllowed = 'move';
  };

  const getNodesByType = (type: string) => {
    return filteredNodeConfigs.filter(config => config.type === type);
  };

  return (
    <Drawer
      variant="persistent"
      anchor="left"
      open={open}
      sx={{
        width: open ? SIDEBAR_WIDTH : 0,
        flexShrink: 0,
        transition: (theme) => theme.transitions.create('width', {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.standard,
        }),
        '& .MuiDrawer-paper': {
          width: SIDEBAR_WIDTH,
          boxSizing: 'border-box',
          bgcolor: 'background.paper',
          borderRight: '1px solid',
          borderColor: 'divider',
          transition: (theme) => theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.standard,
          }),
        },
        overflowX: 'hidden',
      }}
    >
      <Box sx={{ p: 2, marginTop: 8, overflowX: 'hidden' }}>
        <Typography variant="body1" component="div" sx={{ mb: 0, fontWeight: 'bold' }}>
          <Typography variant="body1" component="div" sx={{ mb: 0, fontWeight: 'bold', fontSize: '1rem' }}>
            Node Library
          </Typography>
        </Typography>
        <Typography variant="caption" color="text.secondary" sx={{ mb: 2, mt: 0 }}>
          <Typography variant="caption" color="text.secondary" sx={{ mb: 2, mt: 0, fontSize: '0.75rem' }}>
            Drag nodes to the canvas.
          </Typography>
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, mt: 2, mb: 1 }}>
          <TextField
            size="small"
            placeholder="Search nodes"
            value={search}
            onChange={e => setSearch(e.target.value)}
            sx={{ flex: 2, fontSize: '0.8rem' }}
            variant="outlined"
          />
            <FormControl size="small" sx={{ minWidth: 32, width: 32, maxWidth: 32, fontSize: '0.9rem', padding: 0 }}>
            <Select
              value={typeFilter}
              size='small'
              onChange={e => setTypeFilter(e.target.value)}
                sx={{
                  fontSize: '0.8rem',
                  border: 'none',
                  outline: 'none',
                  boxShadow: 'none',
                  background: 'none',
                  padding: 0,
                  minHeight: 0,
                  width: 55,
                  maxWidth: 55,
                  '& fieldset': { border: 'none' },
                  '&:focus': { outline: 'none', border: 'none', boxShadow: 'none' },
                  '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
                  '&:hover .MuiOutlinedInput-notchedOutline': { border: 'none' },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': { border: 'none' },
                  '& .MuiSelect-select': { padding: 0, minHeight: 0, width: 32, maxWidth: 32, display: 'flex', alignItems: 'center', justifyContent: 'center' },
                }}
              displayEmpty
              renderValue={() => <FilterListIcon />}
            >
              <MenuItem value="all">All</MenuItem>
              {nodeTypes.map(type => (
                <MenuItem key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
        <Divider />
      </Box>

      <Box sx={{ overflow: 'auto', flex: 1 }}>
        {filteredTypes.length === 0 ? (
          <Typography variant="body2" color="text.secondary" sx={{ p: 2 }}>
            <Typography variant="body2" color="text.secondary" sx={{ p: 2, fontSize: '0.9rem' }}>
              No nodes found.
            </Typography>
          </Typography>
        ) : (
          filteredTypes.map((type) => (
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
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'medium', textTransform: 'capitalize', fontSize: '1rem' }}>
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
                            <Typography variant="body2" sx={{ fontWeight: 'medium', fontSize: '0.9rem' }}>
                              {nodeConfig.label}
                            </Typography>
                          </Typography>
                        }
                        secondary={
                          <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
                            <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
                              {nodeConfig.description.length > 50
                                ? `${nodeConfig.description.substring(0, 50)}...`
                                : nodeConfig.description
                              }
                            </Typography>
                          </Typography>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              </AccordionDetails>
            </Accordion>
          ))
        )}
      </Box>

      <Box sx={{ p: 1, bgcolor: 'grey.50' }}>
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', textAlign: 'center' }}>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', textAlign: 'center', fontSize: '0.7rem' }}>
            {nodeConfigs.length} nodes available
          </Typography>
        </Typography>
      </Box>
    </Drawer>
  );
};

export default Sidebar;