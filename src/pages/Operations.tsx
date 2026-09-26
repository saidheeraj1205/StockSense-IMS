import { useState } from 'react';
import { Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import { ArrowDownToLine, ArrowUpFromLine, RefreshCw, GitMerge, X, Plus } from 'lucide-react';
import { useInventory } from '../context/InventoryContext';
import type { Operation } from '../context/InventoryContext';

const OperationList = ({ type }: { type: Operation['type'] }) => {
  const { operations, validateOperation } = useInventory();
  const filteredOps = operations.filter(o => o.type === type);

  return (
    <div className="table-container animate-fade-in">
      <table className="table">
        <thead>
          <tr>
            <th>Reference</th>
            <th>Partner / Info</th>
            <th>Scheduled Date</th>
            <th>Items</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredOps.length === 0 ? (
            <tr><td colSpan={6} style={{ textAlign: 'center', padding: '24px' }} className="text-muted">No {type.toLowerCase()}s found.</td></tr>
          ) : filteredOps.map(op => (
            <tr key={op.id}>
              <td style={{ fontWeight: 500 }}>{op.reference}</td>
              <td>{op.partner || '-'}</td>
              <td>{op.scheduledDate}</td>
              <td>{op.items.length} product(s)</td>
              <td>
                <span className={`badge ${
                  op.status === 'Done' ? 'badge-success' : 
                  op.status === 'Ready' ? 'badge-primary' : 
                  'badge-warning'
                }`}>
                  {op.status}
                </span>
              </td>
              <td>
                {op.status !== 'Done' && op.status !== 'Canceled' ? (
                  <button onClick={() => validateOperation(op.id)} className="btn btn-outline" style={{ padding: '4px 8px', fontSize: '0.8rem' }}>Validate</button>
                ) : (
                  <button className="btn btn-outline" style={{ padding: '4px 8px', fontSize: '0.8rem', opacity: 0.5 }}>View</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const Operations = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  const { products, addOperation } = useInventory();
  
  const [showModal, setShowModal] = useState(false);
  const [opType, setOpType] = useState<Operation['type']>('Receipt');
  const [partner, setPartner] = useState('');
  const [selectedProduct, setSelectedProduct] = useState('');
  const [quantity, setQuantity] = useState(0);

  const tabs = [
    { name: 'Receipts', path: '/operations/receipts', icon: <ArrowDownToLine size={18} />, type: 'Receipt' },
    { name: 'Deliveries', path: '/operations/deliveries', icon: <ArrowUpFromLine size={18} />, type: 'Delivery' },
    { name: 'Internal Transfers', path: '/operations/transfers', icon: <GitMerge size={18} />, type: 'Internal Transfer' },
    { name: 'Adjustments', path: '/operations/adjustments', icon: <RefreshCw size={18} />, type: 'Adjustment' },
  ];

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const product = products.find(p => p.id === selectedProduct);
    if (!product) return;

    addOperation({
      partner,
      scheduledDate: new Date().toISOString().split('T')[0],
      status: 'Ready',
      type: opType,
      items: [{ productId: product.id, productName: product.name, quantity }]
    });

    setShowModal(false);
    setPartner('');
    setSelectedProduct('');
    setQuantity(0);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1>Operations</h1>
          <p className="text-muted">Manage incoming, outgoing, internal stock movements, and stock adjustments.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <Plus size={18} /> Create Operation
        </button>
      </div>

      <div className="glass-panel" style={{ padding: '0' }}>
        <div style={{ display: 'flex', borderBottom: '1px solid var(--border-color)' }}>
          {tabs.map(tab => (
            <Link
              key={tab.name}
              to={tab.path}
              style={{
                padding: '16px 24px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                color: currentPath.includes(tab.path) ? 'var(--primary)' : 'var(--text-muted)',
                borderBottom: currentPath.includes(tab.path) ? '2px solid var(--primary)' : '2px solid transparent',
                textDecoration: 'none',
                fontWeight: 500,
                transition: 'all 0.2s ease'
              }}
            >
              {tab.icon} {tab.name}
            </Link>
          ))}
        </div>
        
        <div style={{ padding: '24px' }}>
          <Routes>
            <Route path="/" element={<Navigate to="/operations/receipts" replace />} />
            <Route path="/receipts" element={<OperationList type="Receipt" />} />
            <Route path="/deliveries" element={<OperationList type="Delivery" />} />
            <Route path="/transfers" element={<OperationList type="Internal Transfer" />} />
            <Route path="/adjustments" element={<OperationList type="Adjustment" />} />
          </Routes>
        </div>
      </div>

      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(4px)' }}>
          <div className="glass-panel animate-fade-in" style={{ width: '400px', padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2>New Operation</h2>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleCreate}>
              <div className="form-group">
                <label className="form-label">Type</label>
                <select className="form-control" value={opType} onChange={e => setOpType(e.target.value as Operation['type'])}>
                  <option value="Receipt">Receipt</option>
                  <option value="Delivery">Delivery</option>
                  <option value="Internal Transfer">Internal Transfer</option>
                  <option value="Adjustment">Adjustment</option>
                </select>
              </div>
              {opType !== 'Adjustment' && (
                <div className="form-group">
                  <input className="form-control" placeholder={opType === 'Receipt' ? 'Vendor Name' : opType === 'Delivery' ? 'Customer Name' : 'Destination'} value={partner} onChange={e => setPartner(e.target.value)} />
                </div>
              )}
              <div className="form-group">
                <label className="form-label">Product</label>
                <select className="form-control" required value={selectedProduct} onChange={e => setSelectedProduct(e.target.value)}>
                  <option value="">Select Product...</option>
                  {products.map(p => <option key={p.id} value={p.id}>{p.name} ({p.stock} {p.uom} available)</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">{opType === 'Adjustment' ? 'Quantity Adjustment (+/-)' : 'Quantity'}</label>
                <input type="number" className="form-control" placeholder="0" required value={quantity} onChange={e => setQuantity(parseInt(e.target.value) || 0)} />
              </div>
              <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Create</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Operations;
