import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Badge,
  Button,
  Menu,
  MenuItem,
  Box,
  TextField,
  InputAdornment
} from '@mui/material';
import {
  ShoppingCart,
  AccountCircle,
  Search,
  Store
} from '@mui/icons-material';
import { useHistory, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';

const Navbar: React.FC = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const history = useHistory();
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();
  const { items } = useCart();

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleMenuClose();
    history.push('/');
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      history.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    if (location.pathname !== '/products') {
      setSearchQuery('');
    } else {
      const params = new URLSearchParams(location.search);
      setSearchQuery(params.get('search') || '');
    }
  }, [location]);

  return (
    <>
      <AppBar position="sticky" sx={{ backgroundColor: '#4f46e5' }}>
        <Toolbar>
          <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
            <Store sx={{ mr: 1 }} />
            <Typography
              variant="h6"
              component="div"
              sx={{ cursor: 'pointer', mr: 3 }}
              onClick={() => history.push('/')}
            >
              AI Shop
            </Typography>

            <Box component="form" onSubmit={handleSearch} sx={{ flexGrow: 1, maxWidth: 500 }}>
              <TextField
                fullWidth
                size="small"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  ),
                  sx: {
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: 1,
                    '& .MuiOutlinedInput-notchedOutline': {
                      border: 'none'
                    },
                    '& input': {
                      color: 'white'
                    },
                    '& input::placeholder': {
                      color: 'rgba(255, 255, 255, 0.7)'
                    }
                  }
                }}
              />
            </Box>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconButton color="inherit" onClick={() => history.push('/cart')}>
              <Badge badgeContent={totalItems} color="error">
                <ShoppingCart />
              </Badge>
            </IconButton>

            {isAuthenticated ? (
              <>
                <Typography variant="body2" sx={{ mr: 1 }}>
                  Hi, {user?.name}
                </Typography>
                <IconButton color="inherit" onClick={handleMenuOpen}>
                  <AccountCircle />
                </IconButton>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleMenuClose}
                >
                  <MenuItem onClick={() => { history.push('/profile'); handleMenuClose(); }}>
                    Profile
                  </MenuItem>
                  <MenuItem onClick={() => { history.push('/orders'); handleMenuClose(); }}>
                    My Orders
                  </MenuItem>
                  {(user?.role === 'admin' || user?.isAdmin) && (
                    <MenuItem onClick={() => { history.push('/admin/products'); handleMenuClose(); }}>
                      Manage Products
                    </MenuItem>
                  )}
                  <MenuItem onClick={handleLogout}>Logout</MenuItem>
                </Menu>
              </>
            ) : (
              <>
                <Button color="inherit" onClick={() => history.push('/login')}>
                  Login
                </Button>
                <Button color="inherit" onClick={() => history.push('/register')}>
                  Register
                </Button>
              </>
            )}
          </Box>
        </Toolbar>
      </AppBar>
    </>
  );
};

export default Navbar;