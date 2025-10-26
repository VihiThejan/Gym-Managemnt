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
    
    antMessage.info(phoneNumber);
    axios.post('http://localhost:5000/api/v1/auth/forgetpw', {contact: phoneNumber})
    .then(async (data) => {
        console.log(data);
        if (data?.data?.code === 400) {
            antMessage.error(data?.data?.message);
        } else if (data?.data?.code === 200) {
          antMessage.success('OTP sent successfully');
          setOtpSent(true);
        }
    })
    .catch(err => {
        console.error(err.message);
        antMessage.error('Failed to send OTP. Please try again.');
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
    
    setVerifyingOtp(true);
    localStorage.setItem('contact', phoneNumber);
    
    axios.post('http://localhost:5000/api/v1/auth/verify', {contact: phoneNumber, otp: otp})
    .then(async (data) => {
        console.log(data);
        if (data?.data?.code === 400) {
            antMessage.error(data?.data?.message);
        } else if (data?.data?.code === 200 && data?.data?.data != null) {
          antMessage.success('OTP verified successfully');
          setTimeout(() => {
            navigate('/Resetpw');
          }, 1000);
        }
    })
    .catch(err => {
        console.error(err.message);
        antMessage.error('Failed to verify OTP. Please try again.');
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
