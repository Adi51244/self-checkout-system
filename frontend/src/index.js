import React from "react";
import ReactDOM from "react-dom/client";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import App from "./App";

const theme = createTheme({
  palette: {
    primary: {
      main: '#2196f3',
      light: '#64b5f6',
      dark: '#1976d2',
    },
    secondary: {
      main: '#ff9800',
      light: '#ffb74d',
      dark: '#f57c00',
    },
    background: {
      default: '#f8faff',
      paper: '#ffffff',
    }
  },
  typography: {
    fontFamily: [
      'Inter',
      '-apple-system',
      'BlinkMacSystemFont',
      'Segoe UI',
      'Roboto',
      'Arial',
      'sans-serif'
    ].join(','),
    h4: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 500,
    }
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundImage: `
            radial-gradient(circle at 100% 0%, rgba(33, 150, 243, 0.15) 0%, rgba(33, 150, 243, 0.05) 50%, transparent 100%),
            radial-gradient(circle at 0% 100%, rgba(255, 152, 0, 0.15) 0%, rgba(255, 152, 0, 0.05) 50%, transparent 100%),
            linear-gradient(135deg, rgba(144, 202, 249, 0.2) 0%, rgba(255, 183, 77, 0.2) 100%)
          `,
          backgroundAttachment: 'fixed',
          backgroundSize: 'cover',
        }
      }
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
          padding: '10px 24px',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
          background: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(8px)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          background: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(8px)',
        }
      }
    }
  },
});

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <App />
  </ThemeProvider>
);
