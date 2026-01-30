import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Divider,
  Alert,
  Snackbar,
  Chip
} from '@mui/material';
import {
  Edit as EditIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  LocationOn as LocationIcon
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

interface Address {
  _id: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault: boolean;
}

interface UserInfo {
  name: string;
  email: string;
  phone: string;
}

const Profile: React.FC = () => {
  const { user, updateUser } = useAuth();
  const [userInfo, setUserInfo] = useState<UserInfo>({
    name: '',
    email: '',
    phone: ''
  });
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [editMode, setEditMode] = useState(false);
  const [addressDialogOpen, setAddressDialogOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [addressForm, setAddressForm] = useState({
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    isDefault: false
  });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  useEffect(() => {
    if (user) {
      setUserInfo({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || ''
      });
      fetchAddresses();
    }
  }, [user]);

  const fetchAddresses = async () => {
    try {
      const response = await axios.get('/api/auth/addresses');
      setAddresses(response.data);
    } catch (error) {
      setSnackbar({ open: true, message: 'Failed to fetch addresses', severity: 'error' });
    }
  };

  const handleUpdateProfile = async () => {
    try {
      const response = await axios.put('/api/auth/profile', userInfo);
      updateUser(response.data);
      setSnackbar({ open: true, message: 'Profile updated successfully', severity: 'success' });
      setEditMode(false);
    } catch (error) {
      setSnackbar({ open: true, message: 'Failed to update profile', severity: 'error' });
    }
  };

  const handleOpenAddressDialog = (address?: Address) => {
    if (address) {
      setEditingAddress(address);
      setAddressForm({
        street: address.street,
        city: address.city,
        state: address.state,
        zipCode: address.zipCode,
        country: address.country,
        isDefault: address.isDefault
      });
    } else {
      setEditingAddress(null);
      setAddressForm({
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: '',
        isDefault: false
      });
    }
    setAddressDialogOpen(true);
  };

  const handleCloseAddressDialog = () => {
    setAddressDialogOpen(false);
    setEditingAddress(null);
  };

  const handleSaveAddress = async () => {
    try {
      if (editingAddress) {
        await axios.put(`/api/auth/addresses/${editingAddress._id}`, addressForm);
      } else {
        await axios.post('/api/auth/addresses', addressForm);
      }
      
      setSnackbar({ open: true, message: 'Address saved successfully', severity: 'success' });
      handleCloseAddressDialog();
      fetchAddresses();
    } catch (error) {
      setSnackbar({ open: true, message: 'Failed to save address', severity: 'error' });
    }
  };

  const handleDeleteAddress = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this address?')) {
      try {
        await axios.delete(`/api/auth/addresses/${id}`);
        setSnackbar({ open: true, message: 'Address deleted successfully', severity: 'success' });
        fetchAddresses();
      } catch (error) {
        setSnackbar({ open: true, message: 'Failed to delete address', severity: 'error' });
      }
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        My Profile
      </Typography>

      {/* Profile Information */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <Avatar sx={{ width: 64, height: 64, mr: 2, bgcolor: 'primary.main' }}>
              {userInfo.name.charAt(0).toUpperCase()}
            </Avatar>
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="h5">{userInfo.name}</Typography>
              <Typography variant="body2" color="text.secondary">{userInfo.email}</Typography>
            </Box>
            <Button
              variant={editMode ? "contained" : "outlined"}
              startIcon={<EditIcon />}
              onClick={() => editMode ? handleUpdateProfile() : setEditMode(true)}
            >
              {editMode ? 'Save' : 'Edit'}
            </Button>
          </Box>

          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' }, gap: 2 }}>
            <Box sx={{ gridColumn: { xs: 'span 1', sm: 'span 1' } }}>
              <TextField
                fullWidth
                label="Full Name"
                value={userInfo.name}
                onChange={(e) => setUserInfo({ ...userInfo, name: e.target.value })}
                disabled={!editMode}
                margin="normal"
              />
            </Box>
            <Box sx={{ gridColumn: { xs: 'span 1', sm: 'span 1' } }}>
              <TextField
                fullWidth
                label="Email"
                value={userInfo.email}
                onChange={(e) => setUserInfo({ ...userInfo, email: e.target.value })}
                disabled={!editMode}
                margin="normal"
              />
            </Box>
            <Box sx={{ gridColumn: { xs: 'span 1', sm: 'span 2' } }}>
              <TextField
                fullWidth
                label="Phone Number"
                value={userInfo.phone}
                onChange={(e) => setUserInfo({ ...userInfo, phone: e.target.value })}
                disabled={!editMode}
                margin="normal"
              />
            </Box>
          </Box>
              <TextField
                fullWidth
                label="Phone Number"
                value={userInfo.phone}
                onChange={(e) => setUserInfo({ ...userInfo, phone: e.target.value })}
                disabled={!editMode}
                margin="normal"
              />
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Addresses */}
      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center' }}>
              <LocationIcon sx={{ mr: 1 }} />
              Shipping Addresses
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => handleOpenAddressDialog()}
            >
              Add Address
            </Button>
          </Box>

          {addresses.length === 0 ? (
            <Typography variant="body2" color="text.secondary">
              No addresses added yet. Add your first shipping address.
            </Typography>
          ) : (
            <List>
              {addresses.map((address, index) => (
                <React.Fragment key={address._id}>
                  <ListItem
                    secondaryAction={
                      <Box>
                        <IconButton
                          edge="end"
                          onClick={() => handleOpenAddressDialog(address)}
                          sx={{ mr: 1 }}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          edge="end"
                          onClick={() => handleDeleteAddress(address._id)}
                          color="error"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    }
                  >
                    <ListItemText
                      primary={
                        <Box>
                          {address.street}
                          {address.isDefault && (
                            <Chip label="Default" size="small" color="primary" sx={{ ml: 1 }} />
                          )}
                        </Box>
                      }
                      secondary={`${address.city}, ${address.state} ${address.zipCode}, ${address.country}`}
                    />
                  </ListItem>
                  {index < addresses.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          )}
        </CardContent>
      </Card>

      {/* Address Dialog */}
      <Dialog open={addressDialogOpen} onClose={handleCloseAddressDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingAddress ? 'Edit Address' : 'Add New Address'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' }, gap: 2 }}>
            <Box sx={{ gridColumn: { xs: 'span 1', sm: 'span 2' } }}>
              <TextField
                fullWidth
                label="Street Address"
                value={addressForm.street}
                onChange={(e) => setAddressForm({ ...addressForm, street: e.target.value })}
                margin="normal"
                required
              />
            </Box>
            <Box sx={{ gridColumn: { xs: 'span 1', sm: 'span 1' } }}>
              <TextField
                fullWidth
                label="State"
                value={addressForm.state}
                onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })}
                margin="normal"
                required
              />
            </Box>
            <Box sx={{ gridColumn: { xs: 'span 1', sm: 'span 1' } }}>
              <TextField
                fullWidth
                label="City"
                value={addressForm.city}
                onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                margin="normal"
                required
              />
            </Box>
            <Box sx={{ gridColumn: { xs: 'span 1', sm: 'span 2' } }}>
              <TextField
                fullWidth
                label="Country"
                value={addressForm.country}
                onChange={(e) => setAddressForm({ ...addressForm, country: e.target.value })}
                margin="normal"
                required
              />
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAddressDialog}>Cancel</Button>
          <Button onClick={handleSaveAddress} variant="contained">
            {editingAddress ? 'Update' : 'Add'} Address
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Profile;
