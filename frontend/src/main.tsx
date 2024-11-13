import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

// Crea el tema oscuro
const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#90caf9",
    },
    secondary: {
      main: "#f48fb1",
    },
  },
});

createRoot(document.getElementById('root')!).render(
  // <StrictMode>
  <ThemeProvider theme={darkTheme}>
    <CssBaseline>
      <App />
    </CssBaseline>
  </ThemeProvider>
  //</StrictMode>,
)

