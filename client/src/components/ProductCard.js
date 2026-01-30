import React from 'react';
import { Card, CardMedia, CardContent, Typography, IconButton, Box, Chip, Rating } from '@mui/material';
import { AddShoppingCart, FavoriteBorder } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const ProductCard = ({ product }) => {
  return (
    <motion.div whileHover={{ y: -8 }} transition={{ type: 'spring', stiffness: 300 }}>
      <Card sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        position: 'relative',
        overflow: 'visible',
        bgcolor: 'background.paper'
      }}>
        
        {/* Hover Actions Overlay */}
        <Box 
          className="overlay"
          sx={{
            position: 'absolute',
            top: 15,
            right: 15,
            zIndex: 2,
            display: 'flex',
            flexDirection: 'column',
            gap: 1
          }}
        >
          <IconButton sx={{ bgcolor: 'white', boxShadow: 1, '&:hover': { bgcolor: '#ec4899', color: 'white' } }}>
            <FavoriteBorder fontSize="small" />
          </IconButton>
        </Box>

        <Box sx={{ position: 'relative', pt: '100%', overflow: 'hidden', borderRadius: '20px 20px 0 0' }}>
            <CardMedia
            component="img"
            image={product.image}
            alt={product.name}
            sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover', // or 'contain' depending on your images
                p: 2
            }}
            />
        </Box>

        <CardContent sx={{ flexGrow: 1, pt: 3 }}>
          <Typography variant="caption" color="secondary" fontWeight="bold" textTransform="uppercase">
            {product.category || 'Electronics'}
          </Typography>
          
          <Typography 
            variant="h6" 
            component={Link} 
            to={`/product/${product._id}`}
            sx={{ 
                display: 'block',
                textDecoration: 'none', 
                color: 'text.primary', 
                mt: 1, 
                mb: 1,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                '&:hover': { color: 'primary.main' }
            }}
          >
            {product.name}
          </Typography>

          <Box display="flex" alignItems="center" gap={1} mb={2}>
            <Rating value={product.rating} readOnly size="small" />
            <Typography variant="body2" color="text.secondary">({product.numReviews})</Typography>
          </Box>

          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h5" fontWeight={800} color="primary.main">
              ${product.price}
            </Typography>
            
            <IconButton 
                color="primary" 
                sx={{ 
                    bgcolor: '#e0e7ff', 
                    '&:hover': { bgcolor: 'primary.main', color: 'white' } 
                }}
            >
              <AddShoppingCart />
            </IconButton>
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ProductCard;