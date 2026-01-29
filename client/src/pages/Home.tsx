import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Button,
  Box,
  Chip,
  CircularProgress,
  Alert
} from '@mui/material';
import { Grid } from '@mui/material';
import { ShoppingCart, Star } from '@mui/icons-material';
import { useHistory } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import axios from 'axios';

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: string;
  brand: string;
  images: { url: string; alt?: string }[];
  rating: { average: number; count: number };
  isFeatured: boolean;
}

const Home: React.FC = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [addingToCart, setAddingToCart] = useState<string | null>(null);
  
  const history = useHistory();
  const { addToCart } = useCart();

  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  const fetchFeaturedProducts = async () => {
    try {
      setLoading(true);
      const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
      const response = await axios.get(`${API_URL}/products/featured`);
      setFeaturedProducts(response.data.data.products);
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to fetch featured products');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (productId: string) => {
    try {
      setAddingToCart(productId);
      await addToCart(productId, 1);
    } catch (error) {
      console.error('Failed to add to cart:', error);
    } finally {
      setAddingToCart(null);
    }
  };

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container sx={{ py: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(45deg, #4f46e5 30%, #8b5cf6 90%)',
          color: 'white',
          py: 8,
          borderRadius: 2,
          mb: 6,
          textAlign: 'center'
        }}
      >
        <Typography variant="h2" component="h1" gutterBottom>
          Smart Shopping Powered by AI
        </Typography>
        <Typography variant="h5" gutterBottom>
          Personalized recommendations just for you
        </Typography>
        <Button
          variant="contained"
          size="large"
          onClick={() => history.push('/products')}
          sx={{ mt: 2, backgroundColor: 'white', color: 'primary.main', '&:hover': { backgroundColor: '#f3f4f6' } }}
        >
          Shop Now
        </Button>
      </Box>

      {/* Featured Products */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="h4" component="h2" gutterBottom>
          🤖 Featured Products
        </Typography>
        
        {featuredProducts.length === 0 ? (
          <Typography variant="body1" color="text.secondary">
            No featured products available at the moment.
          </Typography>
        ) : (
          <Grid container spacing={4}>
            {featuredProducts.map((product) => (
              <Grid xs={12} sm={6} md={4} lg={3} key={product._id}>
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: 4
                    }
                  }}
                >
                  <CardMedia
                    component="img"
                    height="200"
                    image={product.images[0]?.url || 'https://via.placeholder.com/200x200?text=Product'}
                    alt={product.name}
                    sx={{ objectFit: 'cover' }}
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography gutterBottom variant="h6" component="h3">
                      {product.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      {product.description.substring(0, 100)}...
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Chip label={product.category} size="small" sx={{ mr: 1 }} />
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Star sx={{ fontSize: 16, color: 'warning.main', mr: 0.5 }} />
                        <Typography variant="body2">
                          {product.rating.average.toFixed(1)} ({product.rating.count})
                        </Typography>
                      </Box>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="h6" color="primary.main">
                        ₹{product.price}
                      </Typography>
                      {product.originalPrice && (
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ textDecoration: 'line-through' }}
                        >
                          ₹{product.originalPrice}
                        </Typography>
                      )}
                    </Box>
                  </CardContent>
                  <CardActions sx={{ p: 2 }}>
                    <Button
                      size="small"
                      onClick={() => history.push(`/product/${product._id}`)}
                    >
                      View Details
                    </Button>
                    <Button
                      size="small"
                      variant="contained"
                      startIcon={<ShoppingCart />}
                      onClick={() => handleAddToCart(product._id)}
                      disabled={addingToCart === product._id}
                      sx={{ ml: 'auto' }}
                    >
                      {addingToCart === product._id ? (
                        <CircularProgress size={16} />
                      ) : (
                        'Add to Cart'
                      )}
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>

      {/* Categories Section */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="h4" component="h2" gutterBottom>
          Shop by Category
        </Typography>
        <Grid container spacing={2}>
          {['Electronics', 'Clothing', 'Books', 'Home', 'Sports', 'Toys', 'Beauty'].map((category) => (
            <Grid xs={6} sm={4} md={3} key={category}>
              <Card
                sx={{
                  textAlign: 'center',
                  py: 3,
                  cursor: 'pointer',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'scale(1.05)'
                  }
                }}
                onClick={() => history.push(`/products?category=${category.toLowerCase()}`)}
              >
                <Typography variant="h6">{category}</Typography>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Container>
  );
};

export default Home;