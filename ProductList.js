import React from 'react';

export default function ProductList({ products, addToCart }) {
  if (products.length === 0) return <p className="text-gray-500">No items listed yet.</p>;
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {products.map(product => (
        <div key={product._id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex flex-col justify-between">
          <div>
            <img src={product.image || 'https://placeholder.com'} alt={product.name} className="w-full h-40 object-cover rounded mb-2" />
            <h3 className="font-semibold text-lg">{product.name}</h3>
            <p className="text-gray-500 text-sm mb-2">{product.description}</p>
          </div>
          <div className="flex justify-between items-center mt-3">
            <span className="text-xl font-bold text-indigo-600">${product.price}</span>
            <button onClick={() => addToCart(product)} className="bg-indigo-50 text-indigo-600 px-3 py-1.5 rounded-md font-medium hover:bg-indigo-100 transition-colors">Add to Cart</button>
          </div>
        </div>
      ))}
    </div>
  );
}
