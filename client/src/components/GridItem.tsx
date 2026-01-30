import React from 'react';
import { Box, BoxProps } from '@mui/material';

interface GridItemProps extends BoxProps {
  xs?: number;
  sm?: number;
  md?: number;
  lg?: number;
  children?: React.ReactNode;
}

export const GridItem: React.FC<GridItemProps> = ({ 
  xs = 12, 
  sm, 
  md, 
  lg, 
  children, 
  sx, 
  ...props 
}) => {
  const getWidth = () => {
    // Simple responsive width calculation
    return '100%';
  };

  const mediaQueries = {
    '@media (min-width: 600px)': sm ? { width: `${(sm / 12) * 100}%` } : {},
    '@media (min-width: 960px)': md ? { width: `${(md / 12) * 100}%` } : {},
    '@media (min-width: 1280px)': lg ? { width: `${(lg / 12) * 100}%` } : {},
  };

  return (
    <Box
      sx={{
        width: `${(xs / 12) * 100}%`,
        padding: 1,
        ...mediaQueries,
        ...sx,
      }}
      {...props}
    >
      {children}
    </Box>
  );
};
