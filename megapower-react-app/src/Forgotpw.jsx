import React, { useState } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { useNavigate } from 'react-router-dom';
import { Form, Input, Button, message as antMessage, Card } from "antd";
import { PhoneOutlined, SafetyOutlined, LockOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import axios from "axios";
import './Forgotpw.css';

export const ForgotPassword = () => {

  const navigate = useNavigate();
  const [phoneNumber, setPhoneNumber] = useState(""); 
  const [otp, setOtp] = useState("");
  const [sendingOtp, setSendingOtp] = useState(false);
  const [verifyingOtp, setVerifyingOtp] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  
  
  
  const sendOtp = () => {
    if (!phoneNumber || phoneNumber.length < 10) {
      antMessage.error("Please enter a valid phone number.");
      return;
    }
    
    setSendingOtp(true);
    
    // Format phone number: ensure it starts with country code
    const formattedPhone = phoneNumber.startsWith('+') ? phoneNumber : `+${phoneNumber}`;
    
    console.log('Sending OTP to:', formattedPhone);
    
    axios.post('http://localhost:5000/api/v1/auth/forgetpw', {contact: formattedPhone})
    .then((response) => {
        console.log('OTP Response:', response.data);
        if (response?.data?.code === 400) {
            antMessage.error(response?.data?.message || 'Failed to send OTP');
        } else if (response?.data?.code === 200) {
          const data = response.data;
          
          // Check if OTP is provided in response (development mode or SMS failed)
          if (data.otp) {
            // Show OTP in a prominent alert
            antMessage.success({
              content: (
                <div>
                  <strong>OTP Generated!</strong>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', margin: '10px 0', color: '#1890ff' }}>
                    {data.otp}
                  </div>
                  <div style={{ fontSize: '12px', color: '#666' }}>
                    {data.smsDelivered ? 'Also sent to your phone' : 'SMS delivery failed - use this code'}
                  </div>
                </div>
              ),
              duration: 0, // Don't auto-close
              style: { marginTop: '20vh' }
            });
            console.log('🔑 YOUR OTP:', data.otp);
          } else if (data.smsDelivered) {
            antMessage.success('OTP sent successfully! Check your phone.');
          } else {
            antMessage.warning(data.message || 'OTP generated. Check backend console.');
          }
          
          setOtpSent(true);
        } else {
          antMessage.warning('Unexpected response from server');
          console.warn('Unexpected response:', response.data);
        }
    })
    .catch(err => {
        console.error('OTP Error Details:', err);
        console.error('Error Response:', err.response?.data);
        
        if (err.response?.data?.message) {
            antMessage.error(err.response.data.message);
        } else if (err.response?.status === 500) {
            antMessage.error('Server error. Please try again later.');
        } else if (err.message === 'Network Error') {
            antMessage.error('Cannot connect to server. Please check if the backend is running.');
        } else {
            antMessage.error('Failed to send OTP. Please try again.');
        }
    })
    .finally(() => {
        setSendingOtp(false);
    });
  };


  
  const verifyOtp = () => {
    if (!otp) {
      antMessage.error("Please enter the OTP sent to your phone.");
      return;
    }
    
    if (otp.length !== 6) {
      antMessage.error("OTP must be 6 digits.");
      return;
    }
    
    setVerifyingOtp(true);
    
    // Use the same formatted phone number
    const formattedPhone = phoneNumber.startsWith('+') ? phoneNumber : `+${phoneNumber}`;
    localStorage.setItem('contact', formattedPhone);
    
    console.log('Verifying OTP for:', formattedPhone);
    
    axios.post('http://localhost:5000/api/v1/auth/verify', {contact: formattedPhone, otp: otp})
    .then((response) => {
        console.log('Verify Response:', response.data);
        if (response?.data?.code === 400) {
            antMessage.error(response?.data?.message || 'Invalid OTP');
        } else if (response?.data?.code === 200 && response?.data?.data != null) {
          antMessage.success('OTP verified successfully');
          setTimeout(() => {
            navigate('/Resetpw');
          }, 1000);
        } else {
          antMessage.error('Verification failed. Please try again.');
        }
    })
    .catch(err => {
        console.error('Verify Error:', err);
        console.error('Error Response:', err.response?.data);
        
        if (err.response?.data?.message) {
            antMessage.error(err.response.data.message);
        } else {
            antMessage.error('Failed to verify OTP. Please try again.');
        }
    })
    .finally(() => {
        setVerifyingOtp(false);
    });
  };

  return (
    <div className="forgotpw-page">
      <div className="forgotpw-container">
        <Button
          type="text"
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate('/Login')}
          className="back-button"
        >
          Back to Login
        </Button>

        <Card className="forgotpw-card">
          <div className="card-header">
            <div className="header-icon">
              <LockOutlined />
            </div>
            <h2>Forgot Password?</h2>
            <p>Enter your phone number to receive an OTP</p>
          </div>

          <Form layout="vertical" className="forgotpw-form">
            <div id="recaptcha-container"></div>

            <Form.Item>
              <label className="form-label">
                <PhoneOutlined className="label-icon" />
                Mobile Number
              </label>
              <PhoneInput
                country={"lk"} 
                value={phoneNumber}
                onChange={(phone) => setPhoneNumber(phone)}
                placeholder="Enter phone number"
                disabled={otpSent}
                containerClass="phone-input-container"
                inputClass="phone-input-field"
                buttonClass="phone-input-button"
              />
            </Form.Item>

            <Form.Item>
              <Button 
                type="primary" 
                onClick={sendOtp} 
                block
                size="large"
                loading={sendingOtp}
                disabled={sendingOtp || otpSent}
                className="send-otp-button"
              >
                {sendingOtp ? 'Sending...' : otpSent ? 'OTP Sent' : 'Send OTP'}
              </Button>
            </Form.Item>

            {otpSent && (
              <>
                <Form.Item>
                  <label className="form-label">
                    <SafetyOutlined className="label-icon" />
                    OTP Code
                  </label>
                  <Input
                    type="text"
                    placeholder="Enter 6-digit OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    maxLength={6}
                    size="large"
                    className="otp-input"
                  />
                </Form.Item>

                <Form.Item>
                  <Button 
                    type="primary" 
                    onClick={verifyOtp} 
                    block
                    size="large"
                    loading={verifyingOtp}
                    disabled={verifyingOtp || !otp}
                    className="verify-otp-button"
                  >
                    {verifyingOtp ? 'Verifying...' : 'Verify OTP'}
                  </Button>
                </Form.Item>

                <div className="resend-section">
                  <span>Didn't receive the code?</span>
                  <Button 
                    type="link" 
                    onClick={() => {
                      setOtpSent(false);
                      setOtp('');
                      sendOtp();
                    }}
                    className="resend-button"
                  >
                    Resend OTP
                  </Button>
                </div>
              </>
            )}
          </Form>
        </Card>
      </div>
    </div>
  );
};
