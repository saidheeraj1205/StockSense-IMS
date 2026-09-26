import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  PackageSearch, AlertTriangle, ArrowDownToLine, ArrowUpFromLine,
  GitMerge, Plus, TrendingUp, TrendingDown, Zap, RefreshCw
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, AreaChart, Area, Legend
} from 'recharts';
import { useInventory } from '../context/InventoryContext';

// Animated number counter hook
function useCountUp(target: number, duration = 1200) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration]);
  return count;
}

const weekData = [
  { name: 'Mon', receipts: 40, deliveries: 24, internal: 14 },
  { name: 'Tue', receipts: 30, deliveries: 13, internal: 22 },
  { name: 'Wed', receipts: 55, deliveries: 38, internal: 18 },
  { name: 'Thu', receipts: 27, deliveries: 39, internal: 20 },
  { name: 'Fri', receipts: 48, deliveries: 58, internal: 21 },
  { name: 'Sat', receipts: 23, deliveries: 18, internal: 25 },
  { name: 'Sun', receipts: 34, deliveries: 43, internal: 31 },
];

const stockTrend = [
  { time: '6d ago', value: 1800 },
  { time: '5d ago', value: 1750 },
  { time: '4d ago', value: 1900 },
  { time: '3d ago', value: 1820 },
  { time: '2d ago', value: 2010 },
  { time: 'Yesterday', value: 1960 },
  { time: 'Today', value: 2130 },
];

const KpiCard = ({ title, value, icon, bg, trend, trendLabel, color }: any) => {
  const animated = useCountUp(value);
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? 'rgba(35, 38, 55, 0.9)' : 'rgba(25, 28, 41, 0.6)',
        backdropFilter: 'blur(12px)',
        border: hovered ? `1px solid ${color}44` : '1px solid rgba(255,255,255,0.08)',
        borderRadius: '16px',
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        cursor: 'default',
        transform: hovered ? 'translateY(-4px)' : 'none',
        boxShadow: hovered ? `0 12px 40px ${color}22` : '0 8px 32px rgba(0,0,0,0.37)',
        transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ padding: '12px', borderRadius: '12px', background: bg }}>
          {icon}
        </div>
        {trend !== undefined && (
          <span style={{
            display: 'flex', alignItems: 'center', gap: '4px',
            fontSize: '0.78rem', fontWeight: 600,
            color: trend >= 0 ? 'var(--success)' : 'var(--danger)',
            background: trend >= 0 ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
            padding: '4px 8px', borderRadius: '20px'
          }}>
            {trend >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            {Math.abs(trend)}%
          </span>
        )}
      </div>
      <div>
        <h3 style={{ fontSize: '2.2rem', margin: '0 0 4px 0', fontWeight: 700, letterSpacing: '-1px' }}>{animated}</h3>
        <p className="text-muted" style={{ fontSize: '0.88rem', margin: 0 }}>{title}</p>
        {trendLabel && <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>{trendLabel}</p>}
      </div>
    </div>
  );
};

const Dashboard = () => {
  const { products, operations, moves } = useInventory();
  const navigate = useNavigate();
  const [chartView, setChartView] = useState<'bar' | 'area'>('bar');

  const totalProducts = products.length;
  const lowStock = products.filter(p => p.stock < 20).length;
  const totalStock = products.reduce((acc, p) => acc + p.stock, 0);
  const pendingReceipts = operations.filter(o => o.type === 'Receipt' && o.status !== 'Done' && o.status !== 'Canceled').length;
  const pendingDeliveries = operations.filter(o => o.type === 'Delivery' && o.status !== 'Done' && o.status !== 'Canceled').length;
  const pendingTransfers = operations.filter(o => o.type === 'Internal Transfer' && o.status !== 'Done' && o.status !== 'Canceled').length;

  const kpis = [
    { title: 'Total Products', value: totalProducts, icon: <PackageSearch size={22} color="#6366f1" />, bg: 'rgba(99,102,241,0.12)', trend: 8, trendLabel: 'vs last month', color: '#6366f1' },
    { title: 'Total Stock (Units)', value: totalStock, icon: <Zap size={22} color="#ec4899" />, bg: 'rgba(236,72,153,0.12)', trend: 4, trendLabel: 'vs last week', color: '#ec4899' },
    { title: 'Low / Out of Stock', value: lowStock, icon: <AlertTriangle size={22} color="#ef4444" />, bg: 'rgba(239,68,68,0.12)', trend: -3, trendLabel: 'improvement', color: '#ef4444' },
    { title: 'Pending Receipts', value: pendingReceipts, icon: <ArrowDownToLine size={22} color="#10b981" />, bg: 'rgba(16,185,129,0.12)', trend: 12, trendLabel: 'more this week', color: '#10b981' },
    { title: 'Pending Deliveries', value: pendingDeliveries, icon: <ArrowUpFromLine size={22} color="#f59e0b" />, bg: 'rgba(245,158,11,0.12)', trend: -5, trendLabel: 'vs yesterday', color: '#f59e0b' },
  ];

  const quickActions = [
    { label: 'New Receipt', icon: <ArrowDownToLine size={18} />, path: '/operations/receipts', color: '#10b981' },
    { label: 'New Delivery', icon: <ArrowUpFromLine size={18} />, path: '/operations/deliveries', color: '#f59e0b' },
    { label: 'Transfer Stock', icon: <GitMerge size={18} />, path: '/operations/transfers', color: '#ec4899' },
    { label: 'Add Product', icon: <Plus size={18} />, path: '/products', color: '#6366f1' },
  ];

  const alerts = products.filter(p => p.stock < 20).map(p => ({
    msg: `Low stock: ${p.name} (${p.stock} ${p.uom} left)`,
    type: p.stock === 0 ? 'danger' : 'warning'
  }));

  return (
    <div style={{ animation: 'fadeIn 0.5s ease' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 style={{ marginBottom: '4px' }}>
            Good {new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 17 ? 'Afternoon' : 'Evening'} 👋
          </h1>
          <p className="text-muted">Here's your live inventory snapshot — {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>
        <button
          className="btn btn-outline"
          onClick={() => window.location.reload()}
          style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <RefreshCw size={16} /> Refresh
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-5 gap-6" style={{ marginBottom: '28px' }}>
        {kpis.map((kpi, idx) => <KpiCard key={idx} {...kpi} />)}
      </div>

      {/* Quick Actions */}
      <div style={{ marginBottom: '28px' }}>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 600 }}>Quick Actions</p>
        <div className="grid grid-cols-4 gap-4">
          {quickActions.map((action, idx) => (
            <button
              key={idx}
              onClick={() => navigate(action.path)}
              style={{
                background: `linear-gradient(135deg, ${action.color}18, ${action.color}08)`,
                border: `1px solid ${action.color}33`,
                borderRadius: '12px',
                padding: '16px',
                cursor: 'pointer',
                color: 'var(--text-main)',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                fontWeight: 500,
                fontSize: '0.95rem',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
                (e.currentTarget as HTMLElement).style.background = `linear-gradient(135deg, ${action.color}30, ${action.color}15)`;
                (e.currentTarget as HTMLElement).style.boxShadow = `0 8px 24px ${action.color}22`;
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.transform = 'none';
                (e.currentTarget as HTMLElement).style.background = `linear-gradient(135deg, ${action.color}18, ${action.color}08)`;
                (e.currentTarget as HTMLElement).style.boxShadow = 'none';
              }}
            >
              <span style={{ color: action.color }}>{action.icon}</span>
              {action.label}
            </button>
          ))}
        </div>
      </div>

      {/* Charts + Activity */}
      <div className="grid grid-cols-3 gap-6" style={{ marginBottom: '28px' }}>
        <div style={{ gridColumn: 'span 2', background: 'rgba(25,28,41,0.6)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h3 style={{ margin: 0 }}>Operations This Week</h3>
            <div style={{ display: 'flex', gap: '8px' }}>
              {(['bar', 'area'] as const).map(v => (
                <button key={v} onClick={() => setChartView(v)} style={{
                  padding: '6px 14px', borderRadius: '8px', cursor: 'pointer', fontWeight: 500, fontSize: '0.85rem',
                  background: chartView === v ? 'var(--primary)' : 'rgba(255,255,255,0.05)',
                  color: chartView === v ? 'white' : 'var(--text-muted)',
                  border: '1px solid', borderColor: chartView === v ? 'var(--primary)' : 'rgba(255,255,255,0.1)',
                  transition: 'all 0.2s ease'
                }}>
                  {v === 'bar' ? 'Bar' : 'Area'}
                </button>
              ))}
            </div>
          </div>
          <div style={{ height: '280px' }}>
            <ResponsiveContainer width="100%" height="100%">
              {chartView === 'bar' ? (
                <BarChart data={weekData} barGap={4}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis dataKey="name" stroke="var(--text-muted)" tick={{ fill: 'var(--text-muted)', fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis stroke="var(--text-muted)" tick={{ fill: 'var(--text-muted)', fontSize: 12 }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ background: '#1a1d2e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', color: 'white' }} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
                  <Legend wrapperStyle={{ color: 'var(--text-muted)', fontSize: '12px' }} />
                  <Bar dataKey="receipts" fill="#10b981" radius={[6, 6, 0, 0]} name="Receipts" />
                  <Bar dataKey="deliveries" fill="#f59e0b" radius={[6, 6, 0, 0]} name="Deliveries" />
                  <Bar dataKey="internal" fill="#ec4899" radius={[6, 6, 0, 0]} name="Internal" />
                </BarChart>
              ) : (
                <AreaChart data={weekData}>
                  <defs>
                    <linearGradient id="cgReceipts" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="cgDeliveries" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis dataKey="name" stroke="var(--text-muted)" tick={{ fill: 'var(--text-muted)', fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis stroke="var(--text-muted)" tick={{ fill: 'var(--text-muted)', fontSize: 12 }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ background: '#1a1d2e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', color: 'white' }} />
                  <Legend wrapperStyle={{ color: 'var(--text-muted)', fontSize: '12px' }} />
                  <Area type="monotone" dataKey="receipts" stroke="#10b981" fill="url(#cgReceipts)" name="Receipts" strokeWidth={2} />
                  <Area type="monotone" dataKey="deliveries" stroke="#f59e0b" fill="url(#cgDeliveries)" name="Deliveries" strokeWidth={2} />
                </AreaChart>
              )}
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Activity */}
        <div style={{ background: 'rgba(25,28,41,0.6)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '24px' }}>
          <h3 style={{ marginBottom: '20px' }}>Recent Moves</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', overflowY: 'auto', maxHeight: '300px' }}>
            {moves.length === 0 && <p className="text-muted" style={{ fontSize: '0.9rem' }}>No movements yet.</p>}
            {moves.slice(0, 6).map((move, idx) => (
              <div key={idx} style={{
                display: 'flex', gap: '12px', alignItems: 'flex-start',
                padding: '12px', borderRadius: '10px',
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.04)',
                transition: 'background 0.2s',
                cursor: 'default'
              }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.05)'}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.02)'}
              >
                <div style={{
                  width: '36px', height: '36px', borderRadius: '10px', flexShrink: 0,
                  background: move.type === 'Receipt' ? 'rgba(16,185,129,0.15)' : move.type === 'Delivery' ? 'rgba(245,158,11,0.15)' : 'rgba(236,72,153,0.15)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  {move.type === 'Receipt' ? <ArrowDownToLine size={16} color="#10b981" /> : move.type === 'Delivery' ? <ArrowUpFromLine size={16} color="#f59e0b" /> : <GitMerge size={16} color="#ec4899" />}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: '0.85rem', fontWeight: 500, margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{move.productName}</p>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: '2px 0 0' }}>{move.reference} · {move.quantity} units</p>
                  <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', margin: '2px 0 0' }}>{new Date(move.date).toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stock Trend + Alerts */}
      <div className="grid grid-cols-3 gap-6">
        <div style={{ gridColumn: 'span 2', background: 'rgba(25,28,41,0.6)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '24px' }}>
          <h3 style={{ marginBottom: '24px' }}>Total Stock Trend (7 Days)</h3>
          <div style={{ height: '200px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stockTrend}>
                <defs>
                  <linearGradient id="stockGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="time" stroke="var(--text-muted)" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis stroke="var(--text-muted)" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} domain={['auto', 'auto']} />
                <Tooltip contentStyle={{ background: '#1a1d2e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', color: 'white' }} />
                <Area type="monotone" dataKey="value" stroke="#6366f1" fill="url(#stockGrad)" strokeWidth={3} dot={{ fill: '#6366f1', r: 4 }} activeDot={{ r: 6, fill: '#ec4899' }} name="Stock" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Alerts */}
        <div style={{ background: 'rgba(25,28,41,0.6)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '24px' }}>
          <h3 style={{ marginBottom: '20px' }}>🔔 Alerts</h3>
          {alerts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <span style={{ fontSize: '2rem' }}>✅</span>
              <p className="text-muted" style={{ marginTop: '8px', fontSize: '0.9rem' }}>No alerts. All stock levels are healthy!</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {alerts.map((alert, idx) => (
                <div key={idx} style={{
                  padding: '12px 14px',
                  borderRadius: '10px',
                  background: alert.type === 'danger' ? 'rgba(239,68,68,0.1)' : 'rgba(245,158,11,0.1)',
                  border: `1px solid ${alert.type === 'danger' ? 'rgba(239,68,68,0.3)' : 'rgba(245,158,11,0.3)'}`,
                  display: 'flex', alignItems: 'flex-start', gap: '10px'
                }}>
                  <AlertTriangle size={16} color={alert.type === 'danger' ? '#ef4444' : '#f59e0b'} style={{ flexShrink: 0, marginTop: '2px' }} />
                  <p style={{ margin: 0, fontSize: '0.85rem', color: alert.type === 'danger' ? '#ef4444' : '#f59e0b' }}>{alert.msg}</p>
                </div>
              ))}
              <button onClick={() => navigate('/products')} className="btn btn-outline" style={{ marginTop: '8px', width: '100%', fontSize: '0.85rem' }}>
                View Products →
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
