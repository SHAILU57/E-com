import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Divider,
  CircularProgress,
  Alert,
  Pagination,
  Paper,
  IconButton,
  LinearProgress
} from '@mui/material';
import { Grid } from '@mui/material';
import {
  LocalShipping as ShippingIcon,
  CheckCircle as DeliveredIcon,
  HourglassEmpty as PendingIcon,
  Cancel as CancelledIcon,
  Visibility as ViewIcon,
  Receipt as ReceiptIcon
} from '@mui/icons-material';
import axios from 'axios';

interface OrderItem {
  _id: string;
  product: {
    _id: string;
    name: string;
    image: string;
  };
  quantity: number;
  price: number;
}

interface Order {
  _id: string;
  orderNumber: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  items: OrderItem[];
  totalAmount: number;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  paymentMethod: string;
  paymentStatus: string;
  createdAt: string;
  deliveredAt?: string;
  trackingNumber?: string;
}

const Orders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchOrders();
  }, [page]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`/api/orders?page=${page}&limit=10`);
      setOrders(response.data.orders || response.data);
      if (response.data.pagination) {
        setTotalPages(response.data.pagination.pages);
      }
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'warning';
      case 'processing': return 'info';
      case 'shipped': return 'primary';
      case 'delivered': return 'success';
      case 'cancelled': return 'error';
      default: return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <PendingIcon />;
      case 'processing': return <PendingIcon />;
      case 'shipped': return <ShippingIcon />;
      case 'delivered': return <DeliveredIcon />;
      case 'cancelled': return <CancelledIcon />;
      default: return <PendingIcon />;
    }
  };

  const getOrderProgress = (status: string) => {
    const progressMap: { [key: string]: number } = {
      'pending': 20,
      'processing': 40,
      'shipped': 70,
      'delivered': 100,
      'cancelled': 0
    };
    return progressMap[status] || 0;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const openOrderDetails = (order: Order) => {
    setSelectedOrder(order);
    setDetailDialogOpen(true);
  };

  const closeOrderDetails = () => {
    setDetailDialogOpen(false);
    setSelectedOrder(null);
  };

  if (loading && orders.length === 0) {
    return (
      <Container maxWidth="lg" sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        My Orders
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {orders.length === 0 && !loading ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary">
            You haven't placed any orders yet.
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Start shopping to see your orders here!
          </Typography>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {orders.map((order) => (
            <Grid xs={12} md={6} lg={4} key={order._id}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Box>
                      <Typography variant="h6" gutterBottom>
                        Order #{order.orderNumber}
                      </Typography>
                      <Chip
                        icon={getStatusIcon(order.status)}
                        label={order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        color={getStatusColor(order.status)}
                        size="small"
                      />
                    </Box>
                    <IconButton
                      size="small"
                      onClick={() => openOrderDetails(order)}
                      color="primary"
                    >
                      <ViewIcon />
                    </IconButton>
                  </Box>

                  <LinearProgress
                    variant="determinate"
                    value={getOrderProgress(order.status)}
                    sx={{ mb: 2 }}
                  />

                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Placed on {formatDate(order.createdAt)}
                  </Typography>

                  <Box sx={{ mb: 2 }}>
                    {order.items.slice(0, 2).map((item, index) => (
                      <Box key={item._id} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Avatar
                          src={item.product.image}
                          alt={item.product.name}
                          sx={{ width: 32, height: 32, mr: 2 }}
                        />
                        <Box sx={{ flexGrow: 1 }}>
                          <Typography variant="body2" noWrap>
                            {item.product.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Qty: {item.quantity} × ${item.price.toFixed(2)}
                          </Typography>
                        </Box>
                      </Box>
                    ))}
                    {order.items.length > 2 && (
                      <Typography variant="caption" color="text.secondary">
                        +{order.items.length - 2} more items
                      </Typography>
                    )}
                  </Box>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h6" color="primary">
                      ${order.totalAmount.toFixed(2)}
                    </Typography>
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => openOrderDetails(order)}
                    >
                      View Details
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {totalPages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={(e, value) => setPage(value)}
            color="primary"
          />
        </Box>
      )}

      {/* Order Details Dialog */}
      <Dialog
        open={detailDialogOpen}
        onClose={closeOrderDetails}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Order Details - #{selectedOrder?.orderNumber}
        </DialogTitle>
        <DialogContent>
          {selectedOrder && (
            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Box>
                  <Chip
                    icon={getStatusIcon(selectedOrder.status)}
                    label={selectedOrder.status.charAt(0).toUpperCase() + selectedOrder.status.slice(1)}
                    color={getStatusColor(selectedOrder.status)}
                    sx={{ mb: 1 }}
                  />
                  <Typography variant="body2" color="text.secondary">
                    Placed on {formatDate(selectedOrder.createdAt)}
                    {selectedOrder.deliveredAt && (
                      <> • Delivered on {formatDate(selectedOrder.deliveredAt)}</>
                    )}
                  </Typography>
                </Box>
                <Typography variant="h6" color="primary">
                  ${selectedOrder.totalAmount.toFixed(2)}
                </Typography>
              </Box>

              {selectedOrder.trackingNumber && (
                <Alert severity="info" sx={{ mb: 3 }}>
                  Tracking Number: {selectedOrder.trackingNumber}
                </Alert>
              )}

              <Typography variant="h6" gutterBottom>
                Order Items
              </Typography>
              <List>
                {selectedOrder.items.map((item, index) => (
                  <React.Fragment key={item._id}>
                    <ListItem alignItems="flex-start">
                      <ListItemAvatar>
                        <Avatar
                          src={item.product.image}
                          alt={item.product.name}
                          variant="rounded"
                        />
                      </ListItemAvatar>
                      <ListItemText
                        primary={item.product.name}
                        secondary={
                          <Box>
                            <Typography variant="body2" color="text.secondary">
                              Quantity: {item.quantity} × ${item.price.toFixed(2)} = ${(item.quantity * item.price).toFixed(2)}
                            </Typography>
                          </Box>
                        }
                      />
                    </ListItem>
                    {index < selectedOrder.items.length - 1 && <Divider variant="inset" component="li" />}
                  </React.Fragment>
                ))}
              </List>

              <Typography variant="h6" sx={{ mt: 3, mb: 2 }}>
                Shipping Address
              </Typography>
              <Typography variant="body2">
                {selectedOrder.shippingAddress.street}<br />
                {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} {selectedOrder.shippingAddress.zipCode}<br />
                {selectedOrder.shippingAddress.country}
              </Typography>

              <Typography variant="h6" sx={{ mt: 3, mb: 2 }}>
                Payment Information
              </Typography>
              <Typography variant="body2">
                Method: {selectedOrder.paymentMethod}<br />
                Status: {selectedOrder.paymentStatus}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={closeOrderDetails}>Close</Button>
          <Button
            variant="contained"
            startIcon={<ReceiptIcon />}
            disabled={!selectedOrder || selectedOrder.status !== 'delivered'}
          >
            Download Receipt
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Orders;