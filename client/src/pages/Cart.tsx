import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import {
  Container,
  Typography,
  Card,
  CardMedia,
  CardContent,
  Button,
  Box,
  IconButton,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Alert,
  Divider,
  Grid
} from '@mui/material';
import {
  Add,
  Remove,
  Delete,
  ShoppingCart
} from '@mui/icons-material';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';

const Cart: React.FC = () => {
  const history = useHistory();
  const { items, totalAmount, loading, error, updateQuantity, removeFromCart, clearCart } = useCart();
  const { isAuthenticated } = useAuth();
  
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [orderPlacing, setOrderPlacing] = useState(false);

  const handleQuantityChange = async (productId: string, newQuantity: number) => {
    if (newQuantity < 1) {
      await removeFromCart(productId);
    } else {
      await updateQuantity(productId, newQuantity);
    }
  };

  const handleCheckout = () => {
    if (!isAuthenticated) {
      history.push('/login');
      return;
    }
    setCheckoutOpen(true);
  };

  const handlePlaceOrder = async () => {
    // This would typically open a more detailed checkout form
    // For now, we'll just redirect to a placeholder
    setOrderPlacing(true);
    // Simulate order placement
    setTimeout(() => {
      setOrderPlacing(false);
      setCheckoutOpen(false);
      alert('Order placed successfully! (This is a demo - implement actual checkout flow)');
      clearCart();
      history.push('/orders');
    }, 2000);
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
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Shopping Cart
      </Typography>

      {items.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <ShoppingCart sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            Your cart is empty
          </Typography>
          <Button
            variant="contained"
                  onClick={() => history.push('/products')}
            sx={{ mt: 2 }}
          >
            Continue Shopping
          </Button>
        </Box>
      ) : (
        <Grid container spacing={4}>
          <Grid xs={12} md={8}>
            {items.map((item) => (
              <Card key={item.product._id} sx={{ mb: 2 }}>
                <CardContent>
                  <Grid container spacing={2} alignItems="center">
                    <Grid xs={12} sm={3}>
                      <CardMedia
                        component="img"
                        height="100"
                        image={item.product.images[0]?.url || 'https://via.placeholder.com/100x100?text=Product'}
                        alt={item.product.name}
                        sx={{ objectFit: 'cover', borderRadius: 1 }}
                      />
                    </Grid>
                    
                      <Grid xs={12} sm={5}>
                       <Typography variant="h6" gutterBottom>
                         {item.product.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {item.product.description}
                        </Typography>
                     </Grid>
                    
                    <Grid xs={12} sm={4}>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                        <IconButton
                          size="small"
                          onClick={() => handleQuantityChange(item.product._id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                        >
                          <Remove />
                        </IconButton>
                        
                        <TextField
                          value={item.quantity}
                          size="small"
                          inputProps={{ 
                            min: 1, 
                            style: { textAlign: 'center', width: '60px' }
                          }}
                          onChange={(e) => {
                            const newQuantity = parseInt(e.target.value) || 1;
                            handleQuantityChange(item.product._id, newQuantity);
                          }}
                        />
                        
                        <IconButton
                          size="small"
                          onClick={() => handleQuantityChange(item.product._id, item.quantity + 1)}
                          disabled={item.quantity >= item.product.stock}
                        >
                          <Add />
                        </IconButton>
                        
                        <IconButton
                          color="error"
                          onClick={() => removeFromCart(item.product._id)}
                          sx={{ ml: 1 }}
                        >
                          <Delete />
                        </IconButton>
                      </Box>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            ))}
          </Grid>

          <Grid xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Order Summary
                </Typography>
                
                <Box sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography>Subtotal:</Typography>
                    <Typography>₹{totalAmount}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography>Shipping:</Typography>
                    <Typography>
                      {totalAmount > 500 ? 'FREE' : '₹40'}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography>Tax (18%):</Typography>
                    <Typography>₹{Math.round(totalAmount * 0.18 * 100) / 100}</Typography>
                  </Box>
                  <Divider sx={{ my: 1 }} />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="h6">Total:</Typography>
                    <Typography variant="h6" color="primary.main">
                      ₹{totalAmount + (totalAmount > 500 ? 0 : 40) + Math.round(totalAmount * 0.18 * 100) / 100}
                    </Typography>
                  </Box>
                </Box>

                {totalAmount < 500 && (
                  <Alert severity="info" sx={{ mb: 2 }}>
                    Add ₹{500 - totalAmount} more for FREE shipping!
                  </Alert>
                )}

                <Button
                  fullWidth
                  variant="contained"
                  size="large"
                  onClick={handleCheckout}
                  sx={{ mb: 2 }}
                >
                  Proceed to Checkout
                </Button>

                <Button
                  fullWidth
                  variant="outlined"
            onClick={() => history.push('/products')}
                >
                  Continue Shopping
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Checkout Dialog */}
      <Dialog open={checkoutOpen} onClose={() => setCheckoutOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Checkout</DialogTitle>
        <DialogContent>
          <Typography>
            This is a demo checkout. In a real application, you would:
          </Typography>
          <ul>
            <li>Select shipping address</li>
            <li>Choose payment method</li>
            <li>Review order details</li>
            <li>Complete payment</li>
          </ul>
          <Typography variant="h6" sx={{ mt: 2 }}>
            Total: ₹{totalAmount + (totalAmount > 500 ? 0 : 40) + Math.round(totalAmount * 0.18 * 100) / 100}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCheckoutOpen(false)}>Cancel</Button>
          <Button onClick={handlePlaceOrder} disabled={orderPlacing}>
            {orderPlacing ? <CircularProgress size={20} /> : 'Place Order'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Cart;