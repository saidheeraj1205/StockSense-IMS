import { useState } from 'react';
import { Plus, Search, MoreVertical, X } from 'lucide-react';
import { useInventory } from '../context/InventoryContext';

const Products = () => {
  const { products, addProduct } = useInventory();
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [newProd, setNewProd] = useState({ name: '', sku: '', category: '', uom: '', stock: 0, location: '' });

  const filteredProducts = products.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.sku.toLowerCase().includes(searchTerm.toLowerCase()));

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    addProduct(newProd);
    setShowModal(false);
    setNewProd({ name: '', sku: '', category: '', uom: '', stock: 0, location: '' });
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1>Products</h1>
          <p className="text-muted">Manage your product catalog, categories, and stock levels.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <Plus size={18} /> New Product
        </button>
      </div>

      <div className="glass-panel" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <div className="form-control" style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '300px', padding: '8px 12px' }}>
              <Search size={18} color="var(--text-muted)" />
              <input 
                type="text" 
                placeholder="Search products, SKUs..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ background: 'transparent', border: 'none', color: 'white', outline: 'none', width: '100%' }}
              />
            </div>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button className="btn btn-outline">Categories</button>
            <button className="btn btn-outline">Reordering Rules</button>
          </div>
        </div>

        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Product Name</th>
                <th>SKU / Code</th>
                <th>Category</th>
                <th>Unit</th>
                <th>Stock on Hand</th>
                <th>Location</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map(product => (
                <tr key={product.id}>
                  <td style={{ fontWeight: 500 }}>{product.name}</td>
                  <td><span className="badge badge-primary" style={{ background: 'rgba(255,255,255,0.1)', color: 'var(--text-muted)' }}>{product.sku}</span></td>
                  <td>{product.category}</td>
                  <td>{product.uom}</td>
                  <td>
                    <span className={`badge ${product.stock < 20 ? 'badge-danger' : 'badge-success'}`}>
                      {product.stock}
                    </span>
                  </td>
                  <td>{product.location}</td>
                  <td>
                    <button style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                      <MoreVertical size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(4px)' }}>
          <div className="glass-panel animate-fade-in" style={{ width: '400px', padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2>Create Product</h2>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleCreate}>
              <div className="form-group"><input className="form-control" placeholder="Product Name" required value={newProd.name} onChange={e => setNewProd({...newProd, name: e.target.value})} /></div>
              <div className="form-group"><input className="form-control" placeholder="SKU / Code" required value={newProd.sku} onChange={e => setNewProd({...newProd, sku: e.target.value})} /></div>
              <div className="form-group"><input className="form-control" placeholder="Category" required value={newProd.category} onChange={e => setNewProd({...newProd, category: e.target.value})} /></div>
              <div className="form-group"><input className="form-control" placeholder="Unit of Measure (e.g., kg, Units)" required value={newProd.uom} onChange={e => setNewProd({...newProd, uom: e.target.value})} /></div>
              <div className="form-group"><input type="number" className="form-control" placeholder="Initial Stock" value={newProd.stock} onChange={e => setNewProd({...newProd, stock: parseInt(e.target.value) || 0})} /></div>
              <div className="form-group"><input className="form-control" placeholder="Location (e.g., Warehouse 1)" required value={newProd.location} onChange={e => setNewProd({...newProd, location: e.target.value})} /></div>
              <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Save Product</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;
