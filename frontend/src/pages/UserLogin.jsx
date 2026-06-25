import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogIn, AlertCircle, Smartphone, KeyRound, Mail } from 'lucide-react';

export default function UserLogin() {
  const [loginMethod, setLoginMethod] = useState('otp'); // 'otp' | 'password'
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  
  // OTP states
  const [otpIdentifier, setOtpIdentifier] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [timer, setTimer] = useState(0);

  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login, loginWithOTP, user } = useAuth();
  const navigate = useNavigate();

  // If already logged in, redirect to home
  useEffect(() => {
    if (user) {
      navigate('/', { replace: true });
    }
  }, [user, navigate]);

  // Timer effect for resend OTP code
  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  // Dynamically load MSG91 OTP widget script
  useEffect(() => {
    // Setup MSG91 OTP widget configuration
    window.configuration = {
      widgetId: "36667969306c343733383833",
      tokenAuth: "544626TwrWbOSvXspu6a3cee62P1",
      exposeMethods: true,
      success: (data) => {
        console.log("MSG91 OTP success callback", data);
      },
      failure: (error) => {
        console.error("MSG91 OTP failure callback", error);
      }
    };

    if (!document.getElementById('msg91-otp-script')) {
      const script = document.createElement('script');
      script.id = 'msg91-otp-script';
      script.src = 'https://control.msg91.com/app/assets/otp-provider/otp-provider.js';
      script.async = true;
      script.onload = () => {
        console.log("MSG91 script onload event triggered");
        if (window.initSendOTP) {
          window.initSendOTP(window.configuration);
        }
      };
      document.body.appendChild(script);
    } else {
      if (window.initSendOTP) {
        window.initSendOTP(window.configuration);
      }
    }
  }, []);

  if (user) {
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(username, password, '');
      navigate('/', { replace: true });
    } catch (err) {
      setError(err.message || 'Invalid username or password.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendOTP = (e) => {
    e.preventDefault();
    if (!otpIdentifier.trim()) {
      setError('Please enter a valid mobile number or email.');
      return;
    }
    setError('');
    setOtpLoading(true);

    if (window.sendOtp) {
      window.sendOtp(
        otpIdentifier.trim(),
        (response) => {
          setOtpLoading(false);
          setOtpSent(true);
          setTimer(60);
          console.log("OTP Sent success response:", response);
        },
        (errorMsg) => {
          setOtpLoading(false);
          setError(typeof errorMsg === 'string' ? errorMsg : (errorMsg?.message || 'Failed to send OTP. Check identifier format.'));
          console.error("OTP Sent failure response:", errorMsg);
        }
      );
    } else {
      setOtpLoading(false);
      setError('OTP verification service is initializing. Please wait a moment.');
    }
  };

  const handleVerifyOTP = (e) => {
    e.preventDefault();
    if (!otpCode.trim()) {
      setError('Please enter the OTP verification code.');
      return;
    }
    setError('');
    setIsLoading(true);

    if (window.verifyOtp) {
      window.verifyOtp(
        otpCode.trim(),
        async (data) => {
          console.log("OTP verification returned data:", data);
          const tokenVal = typeof data === 'string' ? data : (data?.token || data?.auth_token || data?.access_token || data?.jwt);
          const finalToken = tokenVal || "verified_otp_token_fallback";

          try {
            await loginWithOTP(otpIdentifier.trim(), finalToken);
            navigate('/', { replace: true });
          } catch (loginErr) {
            setError(loginErr.message || 'OTP successfully verified, but failed to load user session.');
            setIsLoading(false);
          }
        },
        (errorMsg) => {
          setIsLoading(false);
          setError(typeof errorMsg === 'string' ? errorMsg : (errorMsg?.message || 'Invalid verification code. Please try again.'));
          console.error("OTP verification error callback:", errorMsg);
        }
      );
    } else {
      setIsLoading(false);
      setError('OTP verification service is not ready. Please refresh and try again.');
    }
  };

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '80vh',
      padding: '40px 24px'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '420px',
        backgroundColor: 'var(--bg-secondary)',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--border-radius-lg)',
        padding: '48px 36px',
        boxShadow: 'var(--shadow-lg)'
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            backgroundColor: 'var(--accent-gold-light)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px auto'
          }}>
            {loginMethod === 'otp' ? (
              <Smartphone size={24} color="var(--accent-gold)" />
            ) : (
              <LogIn size={24} color="var(--accent-gold)" />
            )}
          </div>
          <h1 style={{
            fontFamily: 'var(--font-serif)',
            fontSize: '26px',
            fontWeight: 700,
            marginBottom: '8px'
          }}>
            User Sign In
          </h1>
          <p style={{
            color: 'var(--text-secondary)',
            fontSize: '14px'
          }}>
            {loginMethod === 'otp' 
              ? 'Verify your identity instantly via MSG91 OTP code.' 
              : 'Sign in to your account using your username and password.'}
          </p>
        </div>

        {/* Tab Selection */}
        <div style={{ 
          display: 'flex', 
          borderBottom: '1px solid var(--border-color)', 
          marginBottom: '28px',
          gap: '8px'
        }}>
          <button
            type="button"
            onClick={() => { setLoginMethod('otp'); setError(''); }}
            style={{
              flex: 1,
              padding: '12px 6px',
              background: 'none',
              border: 'none',
              borderBottom: loginMethod === 'otp' ? '2px solid var(--accent-gold)' : '2px solid transparent',
              color: loginMethod === 'otp' ? 'var(--text-primary)' : 'var(--text-secondary)',
              fontWeight: 600,
              fontSize: '13px',
              cursor: 'pointer',
              transition: 'all var(--transition-normal)'
            }}
          >
            OTP Verification
          </button>
          <button
            type="button"
            onClick={() => { setLoginMethod('password'); setError(''); }}
            style={{
              flex: 1,
              padding: '12px 6px',
              background: 'none',
              border: 'none',
              borderBottom: loginMethod === 'password' ? '2px solid var(--accent-gold)' : '2px solid transparent',
              color: loginMethod === 'password' ? 'var(--text-primary)' : 'var(--text-secondary)',
              fontWeight: 600,
              fontSize: '13px',
              cursor: 'pointer',
              transition: 'all var(--transition-normal)'
            }}
          >
            Password Login
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid var(--danger)',
            color: 'var(--danger)',
            padding: '12px 16px',
            borderRadius: 'var(--border-radius-md)',
            fontSize: '13px',
            marginBottom: '24px'
          }}>
            <AlertCircle size={16} />
            {error}
          </div>
        )}

        {/* Dynamic Login Form */}
        {loginMethod === 'otp' ? (
          // OTP Form
          !otpSent ? (
            <form onSubmit={handleSendOTP} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Mobile Number or Email</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. 919876543210 or user@example.com"
                  value={otpIdentifier}
                  onChange={(e) => setOtpIdentifier(e.target.value)}
                  required
                  autoFocus
                />
                <small style={{ display: 'block', color: 'var(--text-muted)', fontSize: '11px', marginTop: '6px', lineHeight: '1.4' }}>
                  Enter your mobile number with country code (no + or space, e.g. 91 for India) or email address.
                </small>
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                disabled={otpLoading}
                style={{
                  width: '100%',
                  padding: '14px',
                  fontSize: '14px',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  marginTop: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
              >
                {otpLoading ? 'Sending OTP...' : (
                  <>Send OTP Code <Smartphone size={16} /></>
                )}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOTP} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ 
                backgroundColor: 'rgba(212, 175, 55, 0.05)', 
                border: '1px dashed var(--accent-gold)', 
                padding: '12px 14px', 
                borderRadius: 'var(--border-radius-md)',
                fontSize: '13px',
                color: 'var(--text-primary)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <Mail size={16} color="var(--accent-gold)" />
                <span>Verification code sent to <strong>{otpIdentifier}</strong></span>
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Enter Verification Code</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter 6-digit OTP code"
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  maxLength={6}
                  required
                  autoFocus
                  style={{ textAlign: 'center', letterSpacing: '0.2em', fontSize: '18px' }}
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                disabled={isLoading}
                style={{
                  width: '100%',
                  padding: '14px',
                  fontSize: '14px',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  marginTop: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
              >
                {isLoading ? 'Verifying OTP...' : (
                  <>Verify & Sign In <KeyRound size={16} /></>
                )}
              </button>

              {/* Resend OTP Option */}
              <div style={{ textAlign: 'center', fontSize: '12px' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Didn't receive the code? </span>
                {timer > 0 ? (
                  <span style={{ color: 'var(--text-muted)', fontWeight: 500 }}>Resend in {timer}s</span>
                ) : (
                  <button
                    type="button"
                    onClick={handleSendOTP}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--accent-gold)',
                      fontWeight: 600,
                      cursor: 'pointer',
                      padding: 0
                    }}
                  >
                    Resend OTP
                  </button>
                )}
                <span style={{ margin: '0 8px', color: 'var(--text-muted)' }}>|</span>
                <button
                  type="button"
                  onClick={() => { setOtpSent(false); setOtpCode(''); }}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--text-muted)',
                    cursor: 'pointer',
                    padding: 0
                  }}
                  onMouseOver={(e) => e.target.style.color = 'var(--text-primary)'}
                  onMouseOut={(e) => e.target.style.color = 'var(--text-muted)'}
                >
                  Change identifier
                </button>
              </div>
            </form>
          )
        ) : (
          // Password Form
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Username</label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                autoFocus
                autoComplete="username"
              />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Password</label>
              <input
                type="password"
                className="form-control"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={isLoading}
              style={{
                width: '100%',
                padding: '14px',
                fontSize: '14px',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                marginTop: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              {isLoading ? 'Signing in...' : (
                <>Sign In <LogIn size={16} /></>
              )}
            </button>
          </form>
        )}

        {/* Redirect Footer Links */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '12px',
          marginTop: '32px',
          fontSize: '13px'
        }}>
          <p style={{ margin: 0, color: 'var(--text-secondary)' }}>
            Don't have an account?{' '}
            <Link to="/signup" style={{ color: 'var(--accent-gold)', textDecoration: 'none', fontWeight: 600 }}>
              Register here
            </Link>
          </p>
          <p style={{ margin: 0 }}>
            <Link to="/admin/login" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}
              onMouseOver={(e) => e.target.style.color = 'var(--accent-gold)'}
              onMouseOut={(e) => e.target.style.color = 'var(--text-muted)'}>
              Are you an Admin? Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
