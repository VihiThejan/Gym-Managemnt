import React, { useState } from "react";
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { Button, Checkbox, Radio, Card, Input, message } from 'antd';
import { UserOutlined, PhoneOutlined, LockOutlined, LoginOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import './Login.css';

export const Login = () => {
  const navigate = useNavigate();
  const [mobile, setMobile] = useState('');
  const [pass, setPass] = useState('');
  const [user, setUser] = useState('Admin');
  const [mobileError, setMobileError] = useState('');
  const [passError, setPassError] = useState('');
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const onuserChange = (e) => {
    setUser(e.target.value);
  };

  
  const validateMobile = (mobile) => {
    if (!mobile) {
      return 'Mobile number is required.';
    }
    if (mobile.length < 10) {
      return 'Mobile number must be at least 10 digits.';
    }
    return '';
  };

  const validatePassword = (password) => {
    if (!password) {
      return 'Password is required.';
    }
    if (password.length < 6) {
      return 'Password must be at least 6 characters.';
    }
    return '';
  };

  
  const handleSubmit = (e) => {
    e.preventDefault();

    const mobileErrorMsg = validateMobile(mobile);
    const passErrorMsg = validatePassword(pass);

    if (mobileErrorMsg) {
      setMobileError(mobileErrorMsg);
    } else {
      setMobileError('');
    }

    if (passErrorMsg) {
      setPassError(passErrorMsg);
    } else {
      setPassError('');
    }

    if (mobileErrorMsg || passErrorMsg) {
      return;
    }

    setLoading(true);

    const body = {
      "username": mobile,
      "password": pass
    };

    if(user === "Admin"){
      axios.post('http://localhost:5000/api/v1/auth/login', body)
          .then(async (data) => {
              console.log(data);
              if (data?.data?.code === 400) {
                  message.error(data?.data?.message);
              } else if (data?.data?.code === 200) {
                  await localStorage.setItem('login', JSON.stringify(data?.data?.data));
                  message.success('Login successful!');
                  setTimeout(() => {
                    navigate("/Dashboard");
                  }, 1000);
              }
          })
          .catch(err => {
              console.error(err.message);
              message.error('Login failed. Please try again.');
          })
          .finally(() => {
              setLoading(false);
          });
      }
      else if(user === "Member"){
          axios.post('http://localhost:5000/api/v1/member/login', body)
          .then(async (data) => {
              console.log(data);
              if (data?.data?.code === 400) {
                  message.error(data?.data?.message);
              } else if (data?.data?.code === 200) {
                  await localStorage.setItem('login', JSON.stringify(data?.data?.data));
                  message.success('Login successful!');
                  setTimeout(() => {
                    navigate("/MemberDashboard");
                  }, 1000);
              }
          })
          .catch(err => {
              console.error(err.message);
              message.error('Login failed. Please try again.');
          })
          .finally(() => {
              setLoading(false);
          });
      }

      else if(user === "Staff"){
          console.log('Staff Login - Username:', mobile, 'Password:', pass);
          axios.post('http://localhost:5000/api/v1/staffmember/login', body)
          .then(async (data) => {
              console.log('Staff Login Response:', data);
              if (data?.data?.code === 400) {
                  message.error(data?.data?.message);
              } else if (data?.data?.code === 200) {
                  await localStorage.setItem('login', JSON.stringify(data?.data?.data));
                  message.success('Login successful!');
                  setTimeout(() => {
                    navigate("/StaffDashboard");
                  }, 1000);
              } else {
                  message.error('Login failed. Please try again.');
              }
          })
          .catch(err => {
              console.error('Staff Login Error:', err);
              message.error('Login failed. Please try again.');
          })
          .finally(() => {
              setLoading(false);
          });
      }
  };


  return (
    <div className="login-page">
      {/* Background decoration */}
      <div className="login-background">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
        <div className="shape shape-3"></div>
      </div>

      <div className="login-container">
        <div className="login-card">
          {/* Left Side - Branding */}
          <div className="login-left">
            <div className="brand-section">
              <div className="gym-icon">💪</div>
              <h1 className="brand-title">Mega Power Gym</h1>
              <p className="brand-tagline">Transform Your Body, Transform Your Life</p>
            </div>
            <div className="features-list">
              <div className="feature-item">
                <div className="feature-icon">✓</div>
                <span>Professional Trainers</span>
              </div>
              <div className="feature-item">
                <div className="feature-icon">✓</div>
                <span>Modern Equipment</span>
              </div>
              <div className="feature-item">
                <div className="feature-icon">✓</div>
                <span>Flexible Memberships</span>
              </div>
              <div className="feature-item">
                <div className="feature-icon">✓</div>
                <span>24/7 Access</span>
              </div>
            </div>
          </div>

          {/* Right Side - Login Form */}
          <div className="login-right">
            <div className="form-wrapper">
              <div className="form-header">
                <h2>Welcome Back!</h2>
                <p>Sign in to continue your fitness journey</p>
              </div>

              <form className="login-form" onSubmit={handleSubmit}>
                {/* User Type Selection */}
                <div className="user-type-cards">
                  <div 
                    className={`user-card ${user === 'Admin' ? 'active' : ''}`}
                    onClick={() => setUser('Admin')}
                  >
                    <div className="user-card-icon">👤</div>
                    <span>Admin</span>
                  </div>
                  <div 
                    className={`user-card ${user === 'Staff' ? 'active' : ''}`}
                    onClick={() => setUser('Staff')}
                  >
                    <div className="user-card-icon">👨‍💼</div>
                    <span>Staff</span>
                  </div>
                  <div 
                    className={`user-card ${user === 'Member' ? 'active' : ''}`}
                    onClick={() => setUser('Member')}
                  >
                    <div className="user-card-icon">🏋️</div>
                    <span>Member</span>
                  </div>
                </div>

                {/* Mobile Number */}
                <div className="form-group">
                  <label className="input-label">
                    <PhoneOutlined /> Mobile Number
                  </label>
                  <PhoneInput
                    country={'lk'}
                    value={mobile}
                    onChange={(phone) => {
                      setMobile(phone);
                      setMobileError(validateMobile(phone));
                    }}
                    containerClass="phone-input-container"
                    enableSearch={true}
                    placeholder="77 123 4567"
                  />
                  {mobileError && <span className="error-message">⚠ {mobileError}</span>}
                </div>

                {/* Password */}
                <div className="form-group">
                  <label className="input-label">
                    <LockOutlined /> Password
                  </label>
                  <Input.Password
                    value={pass}
                    onChange={(e) => {
                      setPass(e.target.value);
                      setPassError(validatePassword(e.target.value));
                    }}
                    placeholder="Enter your password"
                    size="large"
                    className="password-input"
                    prefix={<LockOutlined className="input-icon" />}
                  />
                  {passError && <span className="error-message">⚠ {passError}</span>}
                </div>

                {/* Remember Me & Forgot Password */}
                <div className="form-options">
                  <Checkbox 
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="remember-checkbox"
                  >
                    Remember me
                  </Checkbox>
                  <Button
                    type="link"
                    onClick={() => navigate("/Forgotpw")}
                    className="forgot-link"
                  >
                    Forgot password?
                  </Button>
                </div>

                {/* Login Button */}
                <Button 
                  type="primary" 
                  htmlType="submit"
                  size="large"
                  loading={loading}
                  disabled={loading}
                  className="login-button"
                  block
                  icon={<LoginOutlined />}
                >
                  {loading ? 'Signing in...' : 'Sign In'}
                </Button>
              </form>

              {/* Register Links - Dynamic based on user type selection */}
              <div className="register-section">
                <div className="divider">
                  <span>Don't have an account?</span>
                </div>
                <div className="register-buttons">
                  {user === 'Admin' && (
                    <Button 
                      className="register-btn" 
                      onClick={() => navigate("/Admin")}
                    >
                      Register as Admin
                    </Button>
                  )}
                  {user === 'Staff' && (
                    <Button 
                      className="register-btn" 
                      onClick={() => navigate("/staffSignup")}
                    >
                      Register as Staff
                    </Button>
                  )}
                  {user === 'Member' && (
                    <Button 
                      className="register-btn" 
                      onClick={() => navigate("/MemberRegister")}
                    >
                      Register as Member
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
