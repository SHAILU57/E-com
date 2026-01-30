import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Container, Box } from '@mui/material';
import { Toaster } from 'react-hot-toast';

// 1. Import your Custom Theme
import theme from './theme';

// 2. Import Layout Components
import Navbar from './components/Layout/Navbar';
import Footer from './components/Layout/Footer';
import Hero from './components/Home/Hero';

// 3. Import your Screens (Assuming these exist in your project)
import HomeScreen from './screens/HomeScreen';
import ProductScreen from './screens/ProductScreen';
import CartScreen from './screens/CartScreen';
import LoginScreen from './screens/LoginScreen';
// import RegisterScreen from './screens/RegisterScreen'; 

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      {/* CssBaseline normalizes web styles to look consistent */}
      <CssBaseline />
      
      {/* Toast Notifications */}
      <Toaster position="top-center" />

      <Router>
        {/* HEADER - Always visible */}
        <Navbar />

        <main style={{ minHeight: '80vh', display: 'flex', flexDirection: 'column' }}>
          <Routes>
            
            {/* --- HOME ROUTE (Hero + Products) --- */}
            <Route 
              path="/" 
              element={
                <>
                  <Hero /> {/* Hero sits at top, full width */}
                  <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
                    <HomeScreen /> {/* Your existing product grid */}
                  </Container>
                </>
              } 
            />

            {/* --- PRODUCT DETAILS --- */}
            <Route 
              path="/product/:id" 
              element={
                <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
                  <ProductScreen />
                </Container>
              } 
            />

            {/* --- CART --- */}
            <Route 
              path="/cart/:id?" 
              element={
                <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
                  <CartScreen />
                </Container>
              } 
            />

            {/* --- AUTH --- */}
            <Route 
              path="/login" 
              element={
                <Container maxWidth="xs" sx={{ mt: 8 }}>
                  <LoginScreen />
                </Container>
              } 
            />

          </Routes>
        </main>

        {/* FOOTER - Always visible */}
        <Footer />
        
      </Router>
    </ThemeProvider>
  );
};

export default App;