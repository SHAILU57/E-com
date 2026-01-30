import React from 'react';
import { Box, Typography, Button, Container, Grid } from '@mui/material';
import { motion } from 'framer-motion';
import { ArrowForward } from '@mui/icons-material';

const Hero = () => {
  return (
    <Box sx={{ 
      background: 'linear-gradient(135deg, #eef2ff 0%, #f5f3ff 100%)', 
      pt: 8, 
      pb: 12,
      overflow: 'hidden'
    }}>
      <Container maxWidth="lg">
        <Grid container spacing={6} alignItems="center">
          
          <Grid item xs={12} md={6}>
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Typography variant="overline" color="secondary" fontWeight="bold" letterSpacing={2}>
                WELCOME TO INTELLICART
              </Typography>
              <Typography variant="h1" sx={{ fontSize: { xs: '2.5rem', md: '4rem' }, mt: 2, mb: 3, lineHeight: 1.1 }}>
                Shop <br />
                <span style={{ color: '#4338ca' }}>IntelliCart</span>
              </Typography>
              <Typography variant="h6" color="text.secondary" sx={{ mb: 4, fontWeight: 400, maxWidth: '480px' }}>
                Discover premium products curated with intelligence. Fast delivery, excellent support, and unbeatable prices.
              </Typography>
              
              <Button 
                variant="contained" 
                size="large" 
                endIcon={<ArrowForward />}
                sx={{ px: 5, py: 1.5, fontSize: '1.1rem' }}
              >
                Start Shopping
              </Button>
            </motion.div>
          </Grid>

          <Grid item xs={12} md={6}>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              {/* Placeholder for a Hero Image - Use a high quality PNG with transparency */}
              <Box 
                component="img"
                src="https://res.cloudinary.com/dbdy92bvo/image/upload/v1646671842/sample_ecommerce_hero.png" // Replace with your own logic/image
                alt="IntelliCart Hero"
                sx={{ width: '100%', maxWidth: 600, filter: 'drop-shadow(0px 20px 40px rgba(67, 56, 202, 0.2))' }}
              />
            </motion.div>
          </Grid>

        </Grid>
      </Container>
    </Box>
  );
};

export default Hero;