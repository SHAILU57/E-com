declare module '@mui/material/Grid' {
  import { GridProps } from '@mui/material/Grid';
  interface GridProps {
    item?: boolean;
    xs?: 'auto' | true | number;
    sm?: 'auto' | true | number;
    md?: 'auto' | true | number;
    lg?: 'auto' | true | number;
    xl?: 'auto' | true | number;
  }
}
