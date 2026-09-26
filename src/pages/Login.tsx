import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, LogIn } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isReset, setIsReset] = useState(false);
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock login
    navigate('/');
  };

  const handleReset = (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpSent) {
      setOtpSent(true);
    } else {
      setIsReset(false);
      setOtpSent(false);
    }
  };

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      width: '100vw',
      position: 'absolute',
      top: 0,
      left: 0,
      background: 'var(--bg-dark)'
    }}>
      <div className="glass-panel animate-fade-in" style={{ padding: '40px', width: '100%', maxWidth: '420px' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <Package size={48} color="var(--primary)" style={{ margin: '0 auto 16px' }} />
          <h2>StockMaster</h2>
          <p className="text-muted">{isReset ? 'Reset your password' : 'Login to manage inventory'}</p>
        </div>

        {!isReset ? (
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input 
                type="email" 
                className="form-control" 
                placeholder="manager@stockmaster.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required 
              />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input 
                type="password" 
                className="form-control" 
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required 
              />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                <input type="checkbox" /> Remember me
              </label>
              <button type="button" onClick={() => setIsReset(true)} style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontSize: '0.9rem' }}>
                Forgot Password?
              </button>
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
              <LogIn size={18} /> Sign In
            </button>
          </form>
        ) : (
          <form onSubmit={handleReset}>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input type="email" className="form-control" placeholder="Enter your email" required disabled={otpSent} />
            </div>
            {otpSent && (
              <div className="form-group animate-fade-in">
                <label className="form-label">OTP</label>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="Enter 6-digit OTP"
                  value={otp}
                  onChange={e => setOtp(e.target.value)}
                  required 
                />
              </div>
            )}
            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginBottom: '16px' }}>
              {otpSent ? 'Verify & Reset Password' : 'Send OTP'}
            </button>
            <div style={{ textAlign: 'center' }}>
              <button type="button" onClick={() => {setIsReset(false); setOtpSent(false);}} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.9rem' }}>
                Back to Login
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default Login;
