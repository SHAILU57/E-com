// client/src/theme.ts
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#4338ca', // Indigo 700 - Main Brand Color
      light: '#6366f1',
      dark: '#312e81',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#ec4899', // Pink 500 - Action Buttons
    },
    background: {
      default: '#f8fafc', // Light Grey Background
      paper: '#ffffff',   // White Cards
    },
    text: {
      primary: '#0f172a', // Dark Slate
      secondary: '#64748b',
    },
  },
  typography: {
    fontFamily: '"Inter", "Poppins", sans-serif',
    h1: { fontWeight: 800 },
    h2: { fontWeight: 700 },
    button: { textTransform: 'none', fontWeight: 600 },
  },
  shape: {
    borderRadius: 12, // Soft rounded corners
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 50, // Pill shaped buttons
          boxShadow: 'none',
          padding: '10px 24px',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
        },
      },
    },
  },
});

export default theme;