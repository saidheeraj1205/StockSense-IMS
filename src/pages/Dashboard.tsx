import { useState } from 'react';
import { PackageSearch, AlertTriangle, ArrowDownToLine, ArrowUpFromLine, GitMerge, Filter } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useInventory } from '../context/InventoryContext';

const data = [
  { name: 'Mon', receipts: 40, deliveries: 24, internal: 24 },
  { name: 'Tue', receipts: 30, deliveries: 13, internal: 22 },
  { name: 'Wed', receipts: 20, deliveries: 58, internal: 22 },
  { name: 'Thu', receipts: 27, deliveries: 39, internal: 20 },
  { name: 'Fri', receipts: 18, deliveries: 48, internal: 21 },
  { name: 'Sat', receipts: 23, deliveries: 38, internal: 25 },
  { name: 'Sun', receipts: 34, deliveries: 43, internal: 21 },
];

const Dashboard = () => {
  const { products, operations, moves } = useInventory();
  const [docFilter, setDocFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  const totalProducts = products.length;
  const lowStock = products.filter(p => p.stock < 20).length;
  const pendingReceipts = operations.filter(o => o.type === 'Receipt' && o.status !== 'Done' && o.status !== 'Canceled').length;
  const pendingDeliveries = operations.filter(o => o.type === 'Delivery' && o.status !== 'Done' && o.status !== 'Canceled').length;
  const pendingTransfers = operations.filter(o => o.type === 'Internal Transfer' && o.status !== 'Done' && o.status !== 'Canceled').length;

  const kpis = [
    { title: 'Total Products', value: totalProducts, icon: <PackageSearch size={24} color="var(--primary)" />, bg: 'rgba(99, 102, 241, 0.1)' },
    { title: 'Low / Out of Stock', value: lowStock, icon: <AlertTriangle size={24} color="var(--danger)" />, bg: 'rgba(239, 68, 68, 0.1)' },
    { title: 'Pending Receipts', value: pendingReceipts, icon: <ArrowDownToLine size={24} color="var(--success)" />, bg: 'rgba(16, 185, 129, 0.1)' },
    { title: 'Pending Deliveries', value: pendingDeliveries, icon: <ArrowUpFromLine size={24} color="var(--warning)" />, bg: 'rgba(245, 158, 11, 0.1)' },
    { title: 'Internal Transfers', value: pendingTransfers, icon: <GitMerge size={24} color="var(--secondary)" />, bg: 'rgba(236, 72, 153, 0.1)' },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1>Dashboard</h1>
          <p className="text-muted">Welcome back. Here's your inventory snapshot.</p>
        </div>
        <div style={{ display: 'flex', gap: '16px' }}>
          <div className="glass-panel" style={{ padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '8px', borderRadius: '24px' }}>
            <Filter size={16} color="var(--text-muted)" />
            <select 
              value={docFilter} 
              onChange={e => setDocFilter(e.target.value)}
              style={{ background: 'transparent', border: 'none', color: 'var(--text-main)', outline: 'none' }}
            >
              <option value="All">All Types</option>
              <option value="Receipts">Receipts</option>
              <option value="Delivery">Delivery</option>
              <option value="Internal">Internal</option>
              <option value="Adjustments">Adjustments</option>
            </select>
          </div>
          <div className="glass-panel" style={{ padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '8px', borderRadius: '24px' }}>
            <Filter size={16} color="var(--text-muted)" />
            <select 
              value={statusFilter} 
              onChange={e => setStatusFilter(e.target.value)}
              style={{ background: 'transparent', border: 'none', color: 'var(--text-main)', outline: 'none' }}
            >
              <option value="All">All Statuses</option>
              <option value="Draft">Draft</option>
              <option value="Waiting">Waiting</option>
              <option value="Ready">Ready</option>
              <option value="Done">Done</option>
              <option value="Canceled">Canceled</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-5 gap-6" style={{ marginBottom: '32px' }}>
        {kpis.map((kpi, idx) => (
          <div key={idx} className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ padding: '12px', borderRadius: '12px', background: kpi.bg }}>
                {kpi.icon}
              </div>
            </div>
            <div>
              <h3 style={{ fontSize: '2rem', margin: '0 0 4px 0' }}>{kpi.value}</h3>
              <p className="text-muted" style={{ fontSize: '0.9rem' }}>{kpi.title}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="glass-panel" style={{ padding: '24px', gridColumn: 'span 2' }}>
          <h3 style={{ marginBottom: '24px' }}>Operations Overview (7 Days)</h3>
          <div style={{ height: '300px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
                <XAxis dataKey="name" stroke="var(--text-muted)" tick={{fill: 'var(--text-muted)'}} />
                <YAxis stroke="var(--text-muted)" tick={{fill: 'var(--text-muted)'}} />
                <Tooltip 
                  contentStyle={{ background: 'var(--bg-card)', border: 'var(--glass-border)', borderRadius: '8px' }} 
                  itemStyle={{ color: 'var(--text-main)' }} 
                />
                <Bar dataKey="receipts" fill="var(--success)" radius={[4, 4, 0, 0]} name="Receipts" />
                <Bar dataKey="deliveries" fill="var(--warning)" radius={[4, 4, 0, 0]} name="Deliveries" />
                <Bar dataKey="internal" fill="var(--secondary)" radius={[4, 4, 0, 0]} name="Internal" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 style={{ marginBottom: '24px' }}>Recent Activity</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {moves.slice(0, 5).map((move, idx) => (
              <div key={idx} style={{ display: 'flex', gap: '12px', alignItems: 'center', padding: '12px', background: 'rgba(255,255,255,0.02)', borderRadius: '8px' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: `var(--${move.type === 'Receipt' ? 'success' : move.type === 'Delivery' ? 'warning' : 'primary'})` }}></div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: '0.9rem', margin: 0 }}>{move.reference} - {move.productName} ({move.quantity})</p>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{new Date(move.date).toLocaleString()}</span>
                </div>
              </div>
            ))}
            {moves.length === 0 && <p className="text-muted">No recent activity.</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
