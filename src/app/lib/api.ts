const BASE_URL = 'http://localhost:4000';

async function apiFetch(endpoint: string, options: RequestInit = {}): Promise<any> {
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    const token = typeof window !== 'undefined' ? localStorage.getItem('user_token') : null;

    const isPublicRoute = ['/login', '/register'].includes(cleanEndpoint);

    const response = await fetch(`${BASE_URL}${cleanEndpoint}`, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...(!isPublicRoute && token && { 'Authorization': `Bearer ${token}` }),
            ...((options.headers as Record<string, string>) || {}),
        },
    });

    if (response.status === 404) {
        return null;
    }

   if (!response.ok) {
        const errorBody = await response.text(); 
        console.error("Server Rejected with:", errorBody);
        
        let errorMessage = `API Error: ${response.status}`;
        try {
            const errorData = JSON.parse(errorBody);
            errorMessage = errorData.message || errorData.error || errorBody;
        } catch (e) { 
            errorMessage = errorBody;
        }
        
        throw new Error(errorMessage.replace(/"/g, '')); 
    }

    if (response.status === 204) {
        return {};
    }

    return response.json();
}

export const api = {
    products: {
        getAll: (options?: RequestInit) => apiFetch('/products', options),
        getById: (id: string, options?: RequestInit) => apiFetch(`/products/${id}`, options),
        create: (data: any, options?: RequestInit) => apiFetch('/products', { ...options, method: 'POST', body: JSON.stringify(data) }),
        update: (id: string, data: any, options?: RequestInit) => apiFetch(`/products/${id}`, { ...options, method: 'PUT', body: JSON.stringify(data) }),
        delete: (id: string, options?: RequestInit) => apiFetch(`/products/${id}`, { ...options, method: 'DELETE' }),
    },

    orders: {
        getAll: (options?: RequestInit) => apiFetch('/orders', options),
        getUserOrders: (userId: string, options?: RequestInit) => apiFetch(`/orders?userId=${userId}`, options),
        getById: (id: string, options?: RequestInit) => apiFetch(`/orders/${id}`, options),
        create: (orderData: any, options?: RequestInit) => apiFetch('/orders', { ...options, method: 'POST', body: JSON.stringify(orderData) }),
        updateStatus: (id: string, status: string, options?: RequestInit) => apiFetch(`/orders/${id}/status`, { ...options, method: 'PATCH', body: JSON.stringify({ status }) }),
    },

    categories: {
        getAll: (options?: RequestInit) => apiFetch('/categories', options),
        create: (data: any, options?: RequestInit) => apiFetch('/categories', { ...options, method: 'POST', body: JSON.stringify(data) }),
        delete: (id: string, options?: RequestInit) => apiFetch(`/categories/${id}`, { ...options, method: 'DELETE' }),
        getById: (id: string, options?: RequestInit) => apiFetch(`/categories/${id}`, options),
        update: (id: string, data: any, options?: RequestInit) => apiFetch(`/categories/${id}`, { ...options, method: 'PUT', body: JSON.stringify(data) }),
    },

    auth: {
        login: (credentials: any, options?: RequestInit) => apiFetch('/login', { ...options, method: 'POST', body: JSON.stringify(credentials) }),
        register: (data: any, options?: RequestInit) => apiFetch('/register', { ...options, method: 'POST', body: JSON.stringify(data) }),
        getProfile: (id: string, options?: RequestInit) => apiFetch(`/users/${id}`, options),
        updateProfile: (id: string, data: any, options?: RequestInit) => apiFetch(`/users/${id}`, { ...options, method: 'PATCH', body: JSON.stringify(data) }),
        resetPassword: (id: string, data: any, options?: RequestInit) => apiFetch(`/users/${id}`, { ...options, method: 'PATCH', body: JSON.stringify(data) }),
    },

    cart: {
        get: (options?: RequestInit) => apiFetch('/cart', options),
        sync: (cartData: any, options?: RequestInit) => apiFetch('/cart', { ...options, method: 'PUT', body: JSON.stringify(cartData) }),
        add: (product: any, quantity: number = 1, options?: RequestInit) => apiFetch('/cart', { ...options, method: 'POST', body: JSON.stringify({ ...product, productId: product.id, quantity }) }),
        update: (productId: string, quantity: number, options?: RequestInit) => apiFetch(`/cart/${productId}`, { ...options, method: 'PUT', body: JSON.stringify({ quantity }) }),
        remove: (productId: string, options?: RequestInit) => apiFetch(`/cart/${productId}`, { ...options, method: 'DELETE' }),
        clear: (options?: RequestInit) => apiFetch('/cart', { ...options, method: 'DELETE' }),
    }
};