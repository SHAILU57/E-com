import React from 'react';
import { AppBar, Toolbar, Typography, Button, Container, Badge, IconButton, Box, Stack } from '@mui/material';
import { ShoppingBag, PersonOutline, Search, FavoriteBorder } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Navbar = () => {
  return (
    <AppBar position="sticky">
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ justifyContent: 'space-between', py: 1 }}>
          
          {/* LOGO BRANDING */}
          <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
            <Box component={motion.div} whileHover={{ scale: 1.05 }} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box 
                sx={{ 
                  width: 35, 
                  height: 35, 
                  bgcolor: 'primary.main', 
                  borderRadius: 2, 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  color: 'white'
                }}
              >
                <ShoppingBag fontSize="small" />
              </Box>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 800,
                  background: 'linear-gradient(45deg, #4338ca 30%, #ec4899 90%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  letterSpacing: '-0.5px'
                }}
              >
                IntelliCart
              </Typography>
            </Box>
          </Link>

          {/* DESKTOP MENU */}
          <Stack direction="row" spacing={4} sx={{ display: { xs: 'none', md: 'flex' } }}>
            {['Home', 'Electronics', 'Fashion', 'Deals'].map((item) => (
              <Button 
                key={item} 
                component={Link} 
                to={`/${item.toLowerCase()}`}
                sx={{ color: 'text.primary', '&:hover': { color: 'primary.main' } }}
              >
                {item}
              </Button>
            ))}
          </Stack>

          {/* ICONS ACTION AREA */}
          <Stack direction="row" spacing={1} alignItems="center">
            <IconButton><Search /></IconButton>
            <IconButton><FavoriteBorder /></IconButton>
            
            <IconButton component={Link} to="/cart">
              <Badge badgeContent={2} color="secondary">
                <ShoppingBag />
              </Badge>
            </IconButton>
            
            <Button 
              variant="outlined" 
              startIcon={<PersonOutline />}
              component={Link} 
              to="/login"
              sx={{ ml: 2, borderRadius: 50, borderColor: 'divider', color: 'text.primary' }}
            >
              Sign In
            </Button>
          </Stack>

        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;