import React, { useState, useEffect } from 'react';
import {
  Container,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  CircularProgress,
  Alert,
  Slider,
  Chip,
  Pagination,
  Fab
} from '@mui/material';
import { Grid } from '@mui/material';
import { ShoppingCart, Star, FilterList } from '@mui/icons-material';
import { useHistory, useLocation } from 'react-router-dom';
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
  stock: number;
}

const Products: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [brands, setBrands] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [addingToCart, setAddingToCart] = useState<string | null>(null);
  const [filtersOpen, setFiltersOpen] = useState(false);
  
  const location = useLocation();
  const history = useHistory();
  const { addToCart } = useCart();

  const getQueryParams = () => {
    const params = new URLSearchParams(location.search);
    return {
      search: params.get('search') || '',
      category: params.get('category') || '',
      brand: params.get('brand') || '',
      minPrice: Number(params.get('minPrice')) || 0,
      maxPrice: Number(params.get('maxPrice')) || 50000,
      rating: Number(params.get('rating')) || 0,
      page: Number(params.get('page')) || 1,
      limit: 20
    };
  };

  const [filters, setFilters] = useState(getQueryParams());

  const [pagination, setPagination] = useState({
    current: 1,
    pages: 1,
    total: 0
  });

  useEffect(() => {
    fetchCategories();
    fetchBrands();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [filters]);

  const fetchCategories = async () => {
    try {
      const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
      const response = await axios.get(`${API_URL}/products/categories`);
      // Handle different response formats
      if (response.data.data) {
        setCategories(response.data.data.categories);
      } else {
        setCategories(response.data.categories || ['Electronics', 'Clothing', 'Books', 'Home', 'Sports']);
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error);
      // Set default categories if API fails
      setCategories(['Electronics', 'Clothing', 'Books', 'Home', 'Sports']);
    }
  };

  const fetchBrands = async () => {
    try {
      const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
      const response = await axios.get(`${API_URL}/products/brands`);
      // Handle different response formats
      if (response.data.data) {
        setBrands(response.data.data.brands);
      } else {
        setBrands(response.data.brands || ['Apple', 'Samsung', 'Nike', 'Adidas', 'Sony']);
      }
    } catch (error) {
      console.error('Failed to fetch brands:', error);
      // Set default brands if API fails
      setBrands(['Apple', 'Samsung', 'Nike', 'Adidas', 'Sony']);
    }
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
      const params = new URLSearchParams();
      
      if (filters.search) params.append('search', filters.search);
      if (filters.category) params.append('category', filters.category);
      if (filters.brand) params.append('brand', filters.brand);
      if (filters.minPrice > 0) params.append('minPrice', filters.minPrice.toString());
      if (filters.maxPrice < 50000) params.append('maxPrice', filters.maxPrice.toString());
      if (filters.rating > 0) params.append('rating', filters.rating.toString());
      params.append('page', filters.page.toString());
      params.append('limit', filters.limit.toString());

      const response = await axios.get(`${API_URL}/products?${params}`);
      
      // Handle different response formats
      if (response.data.data) {
        setProducts(response.data.data.products);
        setPagination(response.data.data.pagination);
      } else if (response.data.products) {
        setProducts(response.data.products);
        setPagination({
          current: filters.page,
          pages: Math.ceil(response.data.total / filters.limit),
          total: response.data.total
        });
      } else {
        setProducts(response.data);
        setPagination({
          current: filters.page,
          pages: 1,
          total: response.data.length
        });
      }
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (field: string, value: any) => {
    const newFilters = { ...filters, [field]: value };
    if (field !== 'page') {
      newFilters.page = 1;
    }
    setFilters(newFilters);
    updateURL(newFilters);
  };

  const updateURL = (newFilters: any) => {
    const params = new URLSearchParams();
    
    if (newFilters.search) params.append('search', newFilters.search);
    if (newFilters.category) params.append('category', newFilters.category);
    if (newFilters.brand) params.append('brand', newFilters.brand);
    if (newFilters.minPrice > 0) params.append('minPrice', newFilters.minPrice.toString());
    if (newFilters.maxPrice < 50000) params.append('maxPrice', newFilters.maxPrice.toString());
    if (newFilters.rating > 0) params.append('rating', newFilters.rating.toString());
    if (newFilters.page > 1) params.append('page', newFilters.page.toString());

    history.push(`/products${params.toString() ? '?' + params.toString() : ''}`);
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

  if (loading && products.length === 0) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Filters */}
      <Box sx={{ mb: 4, p: 2, bgcolor: 'background.paper', borderRadius: 2 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid xs={12} md={3}>
            <TextField
              fullWidth
              label="Search products"
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              size="small"
            />
          </Grid>
          <Grid xs={12} md={2}>
            <FormControl fullWidth size="small">
              <InputLabel>Category</InputLabel>
              <Select
                value={filters.category}
                label="Category"
                onChange={(e) => handleFilterChange('category', e.target.value)}
              >
                <MenuItem value="">All</MenuItem>
                {categories.map((cat) => (
                  <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid xs={12} md={2}>
            <FormControl fullWidth size="small">
              <InputLabel>Brand</InputLabel>
              <Select
                value={filters.brand}
                label="Brand"
                onChange={(e) => handleFilterChange('brand', e.target.value)}
              >
                <MenuItem value="">All</MenuItem>
                {brands.map((brand) => (
                  <MenuItem key={brand} value={brand}>{brand}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid xs={12} md={3}>
            <Typography gutterBottom>Price Range: ₹{filters.minPrice} - ₹{filters.maxPrice}</Typography>
            <Slider
              value={[filters.minPrice, filters.maxPrice]}
              onChange={(_, value) => handleFilterChange('minPrice', value[0])}
              onChangeCommitted={(_, value) => {
                handleFilterChange('minPrice', value[0]);
                handleFilterChange('maxPrice', value[1]);
              }}
              min={0}
              max={50000}
              step={500}
              valueLabelDisplay="auto"
            />
          </Grid>
          <Grid xs={12} md={2}>
            <FormControl fullWidth size="small">
              <InputLabel>Min Rating</InputLabel>
              <Select
                value={filters.rating}
                label="Min Rating"
                onChange={(e) => handleFilterChange('rating', e.target.value)}
              >
                <MenuItem value={0}>All</MenuItem>
                <MenuItem value={3}>3+ Stars</MenuItem>
                <MenuItem value={4}>4+ Stars</MenuItem>
                <MenuItem value={4.5}>4.5+ Stars</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {products.length === 0 && !loading ? (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h6" color="text.secondary">
            No products found matching your criteria.
          </Typography>
        </Box>
      ) : (
        <>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Showing {products.length} of {pagination.total} products
          </Typography>

          <Grid container spacing={3}>
            {products.map((product) => (
              <Grid xs={12} sm={6} md={4} lg={3} key={product._id}>
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'transform 0.2s',
                    '&:hover': {
                      transform: 'translateY(-4px)'
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
                    <Typography gutterBottom variant="h6" component="h3" noWrap>
                      {product.name}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Star sx={{ fontSize: 16, color: 'warning.main', mr: 0.5 }} />
                      <Typography variant="body2">
                        {product.rating.average.toFixed(1)} ({product.rating.count})
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
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
                    <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                      <Chip label={product.category} size="small" />
                      <Chip label={product.brand} size="small" variant="outlined" />
                    </Box>
                    {product.stock <= 5 && (
                      <Typography variant="body2" color="warning.main">
                        Only {product.stock} left!
                      </Typography>
                    )}
                  </CardContent>
                  <CardActions>
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
                      disabled={addingToCart === product._id || product.stock === 0}
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

          {pagination.pages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Pagination
                count={pagination.pages}
                page={pagination.current}
                onChange={(_, page) => handleFilterChange('page', page)}
                color="primary"
              />
            </Box>
          )}
        </>
      )}
    </Container>
  );
};

export default Products;