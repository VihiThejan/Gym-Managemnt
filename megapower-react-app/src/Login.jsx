import React, { useState } from "react";
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { Button, Checkbox, Radio } from 'antd';
import { useNavigate } from 'react-router-dom';
import axios from "axios";

export const Login = () => {
  const navigate = useNavigate();
  const [mobile, setMobile] = useState('');
  const [pass, setPass] = useState('');
  const [user, setUser] = useState('Admin');
  const [mobileError, setMobileError] = useState('');
  const [passError, setPassError] = useState('');

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

    
    const body = {
      "username": mobile,
      "password": pass
    };

    if(user=="Admin"){
      axios.post('http://localhost:5000/api/v1/auth/login', body)
          .then(async (data) => {
              console.log(data);
              if (data?.data?.code === 400) {
                  alert(data?.data?.message);
              } else if (data?.data?.code === 200) {
                  await localStorage.setItem('login', JSON.stringify(data?.data?.data));
                  navigate("/Dashboard"); 
              }
          })
          .catch(err => {
              console.error(err.message);
          });
      }
      else if(user=="Member"){
          axios.post('http://localhost:5000/api/v1/member/login', body)
          .then(async (data) => {
              console.log(data);
              if (data?.data?.code === 400) {
                  alert(data?.data?.message);
              } else if (data?.data?.code === 200) {
                  await localStorage.setItem('login', JSON.stringify(data?.data?.data));
                  navigate("/MemberDashboard"); 
              }
          })
          .catch(err => {
              console.error(err.message);
          });
      }

      else if(user=="Staff"){
          axios.post('http://localhost:5000/api/v1/staffmember/login', body)
          .then(async (data) => {
              console.log(data);
              if (data?.data?.code === 400) {
                  alert(data?.data?.message);
              } else if (data?.data?.code === 200) {
                  await localStorage.setItem('login', JSON.stringify(data?.data?.data));
                  navigate("/StaffDashboard"); 
              }
          })
          .catch(err => {
              console.error(err.message);
          });
      }
  };


  return (
    <div className="auth-form-container" style={{ backgroundColor: "rgba(0, 0, 0, 0.5)", }}>
      <h2>Login</h2>
      <form className="login-form" onSubmit={handleSubmit}>
        <Radio.Group onChange={onuserChange} defaultValue="Admin" value={user}>
          <Radio value="Admin">Admin</Radio>
          <Radio value="Staff">Staff</Radio>
          <Radio value="Member">Member</Radio>
        </Radio.Group><br /><br />

        <label htmlFor="mobile">Mobile</label>
        <PhoneInput
          country={'lk'}
          value={mobile}
          onChange={(phone) => {
            setMobile(phone);
            setMobileError(validateMobile(phone)); 
          }}
        />
        {mobileError && <p style={{ color: 'red' }}>{mobileError}</p>}

        <label htmlFor="password">Password</label>
        <input
          value={pass}
          onChange={(e) => {
            setPass(e.target.value);
            setPassError(validatePassword(e.target.value)); 
          }}
          type="password"
          placeholder="********"
          id="password"
          name="password"
        />
        {passError && <p style={{ color: 'red' }}>{passError}</p>} 

        <Checkbox style={{ color: 'orange', display: 'flex', alignItems: 'center' }}>
          Remember me
        </Checkbox>

        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '10px' }}>
          <Button
            type="link"
            onClick={() => navigate("/Forgotpw")}
            style={{ color: 'lightblue' }}
          >
            Forgot password
          </Button>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '10px' }}>
          <Button type="primary" htmlType="submit">Login</Button>
        </div>
      </form>

      <p>Register Here</p>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '10px', textDecoration: 'underline' }}>

        <Button type="link" onClick={() => navigate("/Admin")}>Admin</Button>
        <Button type="link" onClick={() => navigate("/staff")}>Staff Member</Button>
        <Button type="link" onClick={() => navigate("/Member")}>Member</Button>
        
      </div>
    </div>
  );
};

export default Login;
