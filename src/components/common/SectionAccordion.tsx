import React from 'react';
import { Accordion, AccordionSummary, AccordionDetails, Box, Typography, IconButton } from '@mui/material';
import { ExpandMore } from '@mui/icons-material';

interface SectionAccordionProps {
  title: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
  defaultExpanded?: boolean;
}

const SectionAccordion: React.FC<SectionAccordionProps> = ({ title, children, actions, defaultExpanded = false }) => (
  <Accordion defaultExpanded={defaultExpanded} sx={{ mb: 1 }}>
    <AccordionSummary expandIcon={<ExpandMore />}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
        <Typography variant="subtitle2">{title}</Typography>
        {actions}
      </Box>
    </AccordionSummary>
    <AccordionDetails>
      {children}
    </AccordionDetails>
  </Accordion>
);

export default SectionAccordion;
