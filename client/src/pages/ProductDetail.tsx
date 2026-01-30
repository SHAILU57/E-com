import React, { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import {
  Container,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
  Box,
  CircularProgress,
  Alert,
  IconButton,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Rating,
  Divider,
  Chip
} from '@mui/material';
import {
  ShoppingCart,
  Add,
  Remove,
  Star,
  ArrowBack
} from '@mui/icons-material';
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
  stock: number;
  specifications: Map<string, string>;
  tags: string[];
  rating: { average: number; count: number };
  reviews: Array<{
    _id: string;
    user: { name: string };
    rating: number;
    comment: string;
    createdAt: string;
  }>;
}

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const history = useHistory();
  const { addToCart } = useCart();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    if (id) {
      fetchProduct(id);
    }
  }, [id]);

  const fetchProduct = async (productId: string) => {
    try {
      setLoading(true);
      const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
      const response = await axios.get(`${API_URL}/products/${productId}`);
      setProduct(response.data.data.product);
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to fetch product');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!product) return;
    
    try {
      setAddingToCart(true);
      await addToCart(product._id, quantity);
    } catch (error) {
      console.error('Failed to add to cart:', error);
    } finally {
      setAddingToCart(false);
    }
  };

  const handleQuantityChange = (newQuantity: number) => {
    if (product && newQuantity >= 1 && newQuantity <= product.stock) {
      setQuantity(newQuantity);
    }
  };

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error || !product) {
    return (
      <Container sx={{ py: 4 }}>
        <Alert severity="error">{error || 'Product not found'}</Alert>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => history.goBack()}
          sx={{ mt: 2 }}
        >
          Go Back
        </Button>
      </Container>
    );
  }

  const discount = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Button
        startIcon={<ArrowBack />}
        onClick={() => history.goBack()}
        sx={{ mb: 3 }}
      >
        Back to Products
      </Button>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 4 }}>
        <Box>
          <Box>
            {/* Main Image */}
            <CardMedia
              component="img"
              height="400"
              image={product.images[selectedImage]?.url || 'https://via.placeholder.com/400x400?text=Product'}
              alt={product.name}
              sx={{ objectFit: 'cover', borderRadius: 2, mb: 2 }}
            />
            
            {/* Thumbnail Images */}
            {product.images.length > 1 && (
              <Box sx={{ display: 'flex', gap: 1, overflowX: 'auto' }}>
                {product.images.map((image, index) => (
                  <CardMedia
                    key={index}
                    component="img"
                    height="80"
                    width="80"
                    image={image.url}
                    alt={image.alt || `Product image ${index + 1}`}
                    sx={{
                      objectFit: 'cover',
                      borderRadius: 1,
                      cursor: 'pointer',
                      border: selectedImage === index ? '2px solid' : 'none',
                      borderColor: 'primary.main',
                      minWidth: 80
                    }}
                    onClick={() => setSelectedImage(index)}
                  />
                ))}
              </Box>
            )}
          </Box>
        </Grid>

        <Grid item xs={12} md={6}>
          <Box>
            {/* Title and Price */}
            <Typography variant="h4" component="h1" gutterBottom>
              {product.name}
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Rating value={product.rating.average} precision={0.1} readOnly />
                <Typography variant="body2" sx={{ ml: 1 }}>
                  ({product.rating.count} reviews)
                </Typography>
              </Box>
              <Chip label={product.category} size="small" />
              <Chip label={product.brand} size="small" variant="outlined" />
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
              <Typography variant="h4" color="primary.main">
                ₹{product.price}
              </Typography>
              {product.originalPrice && (
                <>
                  <Typography
                    variant="h6"
                    color="text.secondary"
                    sx={{ textDecoration: 'line-through' }}
                  >
                    ₹{product.originalPrice}
                  </Typography>
                  <Chip 
                    label={`${discount}% OFF`} 
                    color="error" 
                    size="small" 
                  />
                </>
              )}
            </Box>

            {/* Description */}
            <Typography variant="body1" paragraph sx={{ mb: 3 }}>
              {product.description}
            </Typography>

            {/* Stock Info */}
            <Alert 
              severity={product.stock > 10 ? "success" : product.stock > 0 ? "warning" : "error"}
              sx={{ mb: 3 }}
            >
              {product.stock > 10 
                ? 'In Stock' 
                : product.stock > 0 
                ? `Only ${product.stock} left in stock!` 
                : 'Out of Stock'
              }
            </Alert>

            {/* Quantity and Add to Cart */}
            {product.stock > 0 && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <IconButton
                    onClick={() => handleQuantityChange(quantity - 1)}
                    disabled={quantity <= 1}
                  >
                    <Remove />
                  </IconButton>
                  <Typography sx={{ mx: 2, minWidth: 40, textAlign: 'center' }}>
                    {quantity}
                  </Typography>
                  <IconButton
                    onClick={() => handleQuantityChange(quantity + 1)}
                    disabled={quantity >= product.stock}
                  >
                    <Add />
                  </IconButton>
                </Box>

                <Button
                  variant="contained"
                  size="large"
                  startIcon={<ShoppingCart />}
                  onClick={handleAddToCart}
                  disabled={addingToCart}
                  sx={{ flexGrow: 1 }}
                >
                  {addingToCart ? (
                    <CircularProgress size={20} />
                  ) : (
                    'Add to Cart'
                  )}
                </Button>
              </Box>
            )}

            <Divider sx={{ my: 3 }} />

            {/* Specifications */}
            {product.specifications && product.specifications.size > 0 && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Specifications
                </Typography>
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' }, gap: 2 }}>
                  {Array.from(product.specifications.entries()).map(([key, value]) => (
                    <Box key={key}>
                      <Typography variant="body2" color="text.secondary">
                        {key}:
                      </Typography>
                      <Typography variant="body1">
                        {value}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Box>
            )}

            {/* Tags */}
            {product.tags.length > 0 && (
              <Box>
                <Typography variant="h6" gutterBottom>
                  Tags
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {product.tags.map((tag, index) => (
                    <Chip key={index} label={tag} size="small" variant="outlined" />
                  ))}
                </Box>
              </Box>
            )}
          </Box>
        </Box>
      </Box>

      {/* Reviews Section */}
      {product.reviews.length > 0 && (
        <Box sx={{ mt: 6 }}>
          <Typography variant="h4" component="h2" gutterBottom>
            Customer Reviews
          </Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 3 }}>
            {product.reviews.map((review) => (
              <Box key={review._id}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Typography variant="h6" sx={{ flexGrow: 1 }}>
                        {review.user.name}
                      </Typography>
                      <Rating value={review.rating} readOnly size="small" />
                    </Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      {new Date(review.createdAt).toLocaleDateString()}
                    </Typography>
                    <Typography variant="body1">
                      {review.comment}
                    </Typography>
                  </CardContent>
                </Card>
              </Box>
            ))}
          </Box>
        </Box>
      )}
    </Container>
  );
};

export default ProductDetail;
