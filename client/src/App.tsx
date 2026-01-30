import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Container } from '@mui/material';
import { Toaster } from 'react-hot-toast';

// Import Pages
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Orders from './pages/Orders';
import ProductManagement from './pages/ProductManagement';

// Import Layout
import Navbar from './components/Layout/Navbar';
import Footer from './components/Layout/Footer'; 

const App = () => {
  return (
    <Router>
      <Navbar />
      <Container maxWidth="xl" sx={{ minHeight: '80vh', py: 4 }}>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/products" component={Products} />
          <Route path="/product/:id" component={ProductDetail} />
          <Route path="/cart" component={Cart} />
          <Route path="/login" component={Login} />
          <Route path="/register" component={Register} />
          <Route path="/profile" component={Profile} />
          <Route path="/orders" component={Orders} />
          <Route path="/admin/products" component={ProductManagement} />
        </Switch>
      </Container>
      <Footer />
      <Toaster position="top-center" />
    </Router>
  );
};

export default App;