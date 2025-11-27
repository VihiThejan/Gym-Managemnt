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
      <div className="login-container">
        <Card className="login-card">
          <div className="card-header">
            <div className="header-icon">
              <LoginOutlined />
            </div>
            <h2>Welcome Back</h2>
            <p>Login to your account</p>
          </div>

          <form className="login-form" onSubmit={handleSubmit}>
            <div className="user-type-section">
              <label className="form-label">
                <UserOutlined className="label-icon" />
                Login As
              </label>
              <Radio.Group 
                onChange={onuserChange} 
                value={user}
                className="user-radio-group"
              >
                <Radio value="Admin">Admin</Radio>
                <Radio value="Staff">Staff</Radio>
                <Radio value="Member">Member</Radio>
              </Radio.Group>
            </div>

            <div className="form-group">
              <label className="form-label">
                <PhoneOutlined className="label-icon" />
                Mobile Number
              </label>
              <PhoneInput
                country={'lk'}
                value={mobile}
                onChange={(phone) => {
                  setMobile(phone);
                  setMobileError(validateMobile(phone));
                }}
                containerClass="phone-input-container"
                inputClass="phone-input-field"
                buttonClass="phone-input-button"
              />
              {mobileError && <span className="error-message">{mobileError}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">
                <LockOutlined className="label-icon" />
                Password
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
              />
              {passError && <span className="error-message">{passError}</span>}
            </div>

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
                className="forgot-password-link"
              >
                Forgot password?
              </Button>
            </div>

            <Button 
              type="primary" 
              htmlType="submit"
              size="large"
              loading={loading}
              disabled={loading}
              className="login-button"
              block
            >
              {loading ? 'Logging in...' : 'Login'}
            </Button>
          </form>

          <div className="register-section">
            <p className="register-text">Don't have an account?</p>
            <div className="register-links">
              <Button type="link" onClick={() => navigate("/Admin")} className="register-link">
                Register as Admin
              </Button>
              <span className="link-separator">•</span>
              <Button type="link" onClick={() => navigate("/staffSignup")} className="register-link">
                Staff
              </Button>
              <span className="link-separator">•</span>
              <Button type="link" onClick={() => navigate("/Member")} className="register-link">
                Member
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Login;
