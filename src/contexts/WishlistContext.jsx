import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import { useAuth } from './AuthContext';

const WishlistContext = createContext();

export const useWishlist = () => {
    const context = useContext(WishlistContext);
    if (!context) {
        throw new Error('useWishlist must be used within a WishlistProvider');
    }
    return context;
};

export const WishlistProvider = ({ children }) => {
    const { token } = useAuth();
    const [wishlistItems, setWishlistItems] = useState([]);
    const [wishlistIds, setWishlistIds] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchWishlist = useCallback(async () => {
        if (!token) return;
        try {
            setLoading(true);
            const response = await api.get('/users/wishlist');
            setWishlistItems(response.data.products);
            setWishlistIds(response.data.products.map(p => p._id));
        } catch (error) {
            console.error('Error fetching wishlist:', error);
        } finally {
            setLoading(false);
        }
    }, [token]);

    useEffect(() => {
        if (token) {
            fetchWishlist();
        } else {
            setWishlistItems([]);
            setWishlistIds([]);
        }
    }, [token, fetchWishlist]);

    const toggleWishlist = async (productId) => {
        if (!token) {
            // Redirect to login if trying to favorite while logged out
            window.location.href = '/login';
            return;
        }

        try {
            const response = await api.post(`/users/wishlist/${productId}`);

            const newIds = response.data.wishlist;
            setWishlistIds(newIds);

            // If we're removing, remove from items too
            if (!newIds.includes(productId)) {
                setWishlistItems(prev => prev.filter(item => item._id !== productId));
            } else {
                // If we're adding, refetch the whole list to get full product details
                fetchWishlist();
            }
        } catch (error) {
            console.error('Error toggling wishlist:', error);
        }
    };

    const isInWishlist = (productId) => {
        return wishlistIds.includes(productId);
    };

    return (
        <WishlistContext.Provider value={{
            wishlistItems,
            wishlistIds,
            loading,
            toggleWishlist,
            isInWishlist,
            refreshWishlist: fetchWishlist
        }}>
            {children}
        </WishlistContext.Provider>
    );
};
