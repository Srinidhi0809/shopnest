import React, { useState, useEffect, useTransition, Suspense } from 'react';

// Lazy load product display cards to reflect the optimization metrics on your resume
const ProductList = React.lazy(() => import('./ProductList'));

export default function App() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isPending, startTransition] = useTransition();
  
  const API_URL = "https://shopnest-api-7khf.onrender.com/"; // Update after backend deploy

  useEffect(() => {
    fetch(`${API_URL}/api/products`)
      .then(res => res.json())
      .then(data => startTransition(() => setProducts(data)));
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    const res = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (data.token) {
      setToken(data.token);
      localStorage.setItem('token', data.token);
    } else {
      alert('Login failed');
    }
  };

  const addToCart = (product) => {
    const exist = cart.find(x => x._id === product._id);
    if (exist) {
      setCart(cart.map(x => x._id === product._id ? { ...exist, quantity: exist.quantity + 1 } : x));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const handleCheckout = async () => {
    if (!token) return alert('Please login to checkout');
    const res = await fetch(`${API_URL}/api/payment/checkout`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ items: cart, CLIENT_URL: window.location.origin })
    });
    const data = await res.json();
    if (data.id) window.location.href = data.id;
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <header className="bg-indigo-600 text-white p-4 flex justify-between items-center shadow-md">
        <h1 className="text-2xl font-bold tracking-tight">ShopNest</h1>
        <div>Cart Status: <span className="font-semibold">{cart.reduce((a,c) => a + c.quantity, 0)} items</span></div>
      </header>

      <main className="max-w-6xl mx-auto p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <h2 className="text-xl font-bold mb-4">Our Catalog</h2>
          {isPending ? <p>Loading items...</p> : (
            <Suspense fallback={<div>Loading elements safely...</div>}>
              <ProductList products={products} addToCart={addToCart} />
            </Suspense>
          )}
        </div>

        <div className="space-y-6">
          {!token ? (
            <form onSubmit={handleLogin} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h2 className="text-lg font-bold mb-3">Customer Access</h2>
              <input type="email" placeholder="Email" onChange={e=>setEmail(e.target.value)} className="w-full mb-2 p-2 border rounded" required />
              <input type="password" placeholder="Password" onChange={e=>setPassword(e.target.value)} className="w-full mb-3 p-2 border rounded" required />
              <button type="submit" className="w-full bg-indigo-600 text-white p-2 rounded hover:bg-indigo-700">Enter Shop</button>
            </form>
          ) : (
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h2 className="text-lg font-bold mb-3">Your Selection</h2>
              {cart.map(item => (
                <div key={item._id} className="flex justify-between py-1 border-b">
                  <span>{item.name} (x{item.quantity})</span>
                  <span>${item.price * item.quantity}</span>
                </div>
              ))}
              <button onClick={handleCheckout} className="w-full mt-4 bg-green-600 text-white p-2 rounded font-medium hover:bg-green-700">Pay via Stripe</button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
