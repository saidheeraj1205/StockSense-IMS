import { useState } from 'react';
import { Search, Filter, History } from 'lucide-react';
import { useInventory } from '../context/InventoryContext';

const MoveHistory = () => {
  const { moves } = useInventory();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredMoves = moves.filter(m => 
    m.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.reference.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1>Move History</h1>
          <p className="text-muted">Ledger of all stock movements across the company.</p>
        </div>
      </div>

      <div className="glass-panel" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
          <div className="form-control" style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '300px', padding: '8px 12px' }}>
            <Search size={18} color="var(--text-muted)" />
            <input 
              type="text" 
              placeholder="Search by product or reference..." 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              style={{ background: 'transparent', border: 'none', color: 'white', outline: 'none', width: '100%' }}
            />
          </div>
          <button className="btn btn-outline">
            <Filter size={16} /> Filter
          </button>
        </div>

        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Reference</th>
                <th>Product</th>
                <th>From</th>
                <th>To</th>
                <th>Quantity</th>
                <th>Type</th>
              </tr>
            </thead>
            <tbody>
              {filteredMoves.length === 0 ? (
                <tr><td colSpan={7} style={{ textAlign: 'center', padding: '24px' }} className="text-muted">No movements found.</td></tr>
              ) : filteredMoves.map(move => (
                <tr key={move.id}>
                  <td>{new Date(move.date).toLocaleString()}</td>
                  <td><span className="badge badge-primary">{move.reference}</span></td>
                  <td style={{ fontWeight: 500 }}>{move.productName}</td>
                  <td>{move.fromLocation}</td>
                  <td>{move.toLocation}</td>
                  <td style={{ fontWeight: 'bold' }}>{move.quantity}</td>
                  <td>
                    <span className={`badge ${
                      move.type === 'Receipt' ? 'badge-success' : 
                      move.type === 'Delivery' ? 'badge-warning' : 
                      move.type === 'Internal Transfer' ? 'badge-secondary' : 'badge-primary'
                    }`}>
                      {move.type}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MoveHistory;
