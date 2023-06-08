import React, { useState } from 'react';

import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import MuiAccordion, { AccordionProps } from '@mui/material/Accordion';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import MuiAccordionSummary, {
  AccordionSummaryProps
} from '@mui/material/AccordionSummary';
import { styled } from '@mui/material/styles';

const Accordion = styled((props: AccordionProps) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  '&:not(:last-child)': {
    marginBottom: '8px'
  },
  '&:before': {
    display: 'none'
  }
}));

const AccordionSummary = styled((props: AccordionSummaryProps) => (
  <MuiAccordionSummary expandIcon={<KeyboardArrowRightIcon />} {...props} />
))(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === 'dark'
      ? 'rgba(255, 255, 255, .05)'
      : 'rgba(0, 0, 0, .03)',
  flexDirection: 'row-reverse',
  '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
    transform: 'rotate(90deg)'
  },
  '& .MuiAccordionSummary-content': {
    marginLeft: theme.spacing(1)
  }
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: theme.spacing(2)
}));

interface ExtendedAccordionProps extends AccordionProps {
  summary: JSX.Element;
  details: JSX.Element;
  scrollable?: boolean;
}

interface FlexiPanelProps extends Omit<ExtendedAccordionProps, 'children'> {}

export const FlexiPanel = ({
  summary,
  details,
  scrollable = false,
  sx,
  ...flexiPanelProps
}: FlexiPanelProps): JSX.Element => {
  const [expanded, setExpanded] = useState(false);

  const handleExpandedChange = (expanded: boolean) => {
    setExpanded(expanded);
  };

  return (
    <Accordion
      onChange={(event: React.SyntheticEvent, expanded: boolean) => {
        handleExpandedChange(expanded);
      }}
      sx={{
        ...(scrollable && {
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          '& .MuiCollapse-root': {
            overflowY: 'scroll'
          }
        }),
        ...sx
      }}
      {...flexiPanelProps}
    >
      <AccordionSummary
        sx={{
          ...(expanded && {
            boxShadow: 'inset 0 -1px 0 0 rgba(0, 0, 0, .125)'
          })
        }}
      >
        {summary}
      </AccordionSummary>
      <AccordionDetails>{details}</AccordionDetails>
    </Accordion>
  );
};
