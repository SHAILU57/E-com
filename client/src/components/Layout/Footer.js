import React from 'react';
import { Box, Container, Grid, Typography, Stack, IconButton } from '@mui/material';
import { Facebook, Twitter, Instagram, LinkedIn, ShoppingBag } from '@mui/icons-material';

const Footer = () => {
  return (
    <Box sx={{ bgcolor: '#0f172a', color: 'white', pt: 8, pb: 4, mt: 8 }}>
      <Container maxWidth="lg">
        <Grid container spacing={5}>
          
          <Grid item xs={12} md={4}>
            <Box display="flex" alignItems="center" gap={1} mb={2}>
              <ShoppingBag sx={{ color: 'primary.light' }} />
              <Typography variant="h6" fontWeight="bold">IntelliCart</Typography>
            </Box>
            <Typography variant="body2" sx={{ color: 'gray', maxWidth: 300 }}>
              Premium e-commerce experience driven by intelligence. Quality products, fast delivery, and exceptional support.
            </Typography>
          </Grid>

          <Grid item xs={6} md={2}>
            <Typography variant="subtitle1" fontWeight="bold" mb={2}>Shop</Typography>
            <Stack spacing={1}>
              <Typography variant="body2" sx={{ color: 'gray', cursor: 'pointer' }}>All Products</Typography>
              <Typography variant="body2" sx={{ color: 'gray', cursor: 'pointer' }}>Featured</Typography>
              <Typography variant="body2" sx={{ color: 'gray', cursor: 'pointer' }}>New Arrivals</Typography>
            </Stack>
          </Grid>

          <Grid item xs={6} md={2}>
            <Typography variant="subtitle1" fontWeight="bold" mb={2}>Support</Typography>
            <Stack spacing={1}>
              <Typography variant="body2" sx={{ color: 'gray', cursor: 'pointer' }}>FAQ</Typography>
              <Typography variant="body2" sx={{ color: 'gray', cursor: 'pointer' }}>Shipping</Typography>
              <Typography variant="body2" sx={{ color: 'gray', cursor: 'pointer' }}>Returns</Typography>
            </Stack>
          </Grid>

          <Grid item xs={12} md={4}>
            <Typography variant="subtitle1" fontWeight="bold" mb={2}>Stay Connected</Typography>
            <Stack direction="row" spacing={1}>
              {[<Facebook/>, <Twitter/>, <Instagram/>, <LinkedIn/>].map((icon, i) => (
                <IconButton key={i} sx={{ color: 'white', bgcolor: 'rgba(255,255,255,0.1)' }}>
                  {icon}
                </IconButton>
              ))}
            </Stack>
          </Grid>

        </Grid>
        
        <Box sx={{ borderTop: '1px solid #1e293b', mt: 6, pt: 3, textAlign: 'center' }}>
          <Typography variant="body2" sx={{ color: '#64748b' }}>
            © 2026 IntelliCart. All rights reserved. | Intelligent Shopping Made Simple
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;