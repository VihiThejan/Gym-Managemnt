import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Statistic, message, Spin, Button } from 'antd';
import { 
  UserOutlined, 
  ShopOutlined, 
  DollarOutlined, 
  TeamOutlined, 
  RiseOutlined, 
  CheckCircleOutlined,
  CalendarOutlined,
  TrophyOutlined,
  FireOutlined,
  ThunderboltOutlined,
  PlusCircleOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import MainLayout from './components/Layout/MainLayout';
import './Dashboard.css';

export const Dashboard = () => {
  const [stats, setStats] = useState({
    totalMembers: 0,
    totalStaff: 0,
    totalEquipment: 0,
    totalRevenue: 0,
    activeMembers: 0,
    pendingPayments: 0,
    todayAttendance: 0,
    monthlyRevenue: 0
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      
      // Fetch members
      const membersRes = await axios.get('http://localhost:5000/api/v1/member/list');
      const totalMembers = membersRes.data?.data?.length || 0;
      
      // Fetch staff
      const staffRes = await axios.get('http://localhost:5000/api/v1/staffmember/list');
      const totalStaff = staffRes.data?.data?.length || 0;
      
      // Fetch equipment
      const equipmentRes = await axios.get('http://localhost:5000/api/v1/equipment/list');
      const totalEquipment = equipmentRes.data?.data?.length || 0;
      
      // Fetch payments
      const paymentsRes = await axios.get('http://localhost:5000/api/v1/payment/list');
      const payments = paymentsRes.data?.data || [];
      const totalRevenue = payments.reduce((sum, payment) => sum + (parseFloat(payment.Amount) || 0), 0);
      
      // Calculate monthly revenue (mock - filter by current month)
      const currentMonth = new Date().getMonth();
      const monthlyRevenue = payments
        .filter(p => new Date(p.createdAt || Date.now()).getMonth() === currentMonth)
        .reduce((sum, payment) => sum + (parseFloat(payment.Amount) || 0), 0);
      
      // Fetch attendance
      const attendanceRes = await axios.get('http://localhost:5000/api/v1/attendance/list');
      const attendanceData = attendanceRes.data?.data || [];
      
      // Calculate today's attendance
      const today = new Date().toISOString().split('T')[0];
      const todayAttendance = attendanceData.filter(a => 
        a.Date && a.Date.startsWith(today)
      ).length;

      setStats({
        totalMembers,
        totalStaff,
        totalEquipment,
        totalRevenue,
        activeMembers: attendanceData.length,
        pendingPayments: Math.floor(totalMembers * 0.15),
        todayAttendance,
        monthlyRevenue
      });
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      message.error('Failed to load dashboard statistics');
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="dashboard-page">
        {/* Header Section */}
        <div className="dashboard-header">
          <div className="header-content">
            <div className="header-title">
              <h1>Admin Dashboard</h1>
              <p>Welcome back! Here's what's happening with your gym today.</p>
            </div>
            <div className="header-date">
              <CalendarOutlined className="date-icon" />
              <span>{new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}</span>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="stats-section">
          <Row gutter={[24, 24]}>
            {/* Total Members */}
            <Col xs={24} sm={12} lg={8}>
              <Card className="stat-card stat-card-purple" bordered={false} loading={loading}>
                <div className="stat-icon-wrapper">
                  <TeamOutlined className="stat-icon" />
                </div>
                <Statistic
                  title="Total Members"
                  value={stats.totalMembers}
                  valueStyle={{ color: '#fff', fontWeight: 'bold', fontSize: '32px' }}
                />
                <div className="stat-footer">
                  <RiseOutlined /> Active registrations
                </div>
              </Card>
            </Col>

            {/* Total Staff */}
            <Col xs={24} sm={12} lg={8}>
              <Card className="stat-card stat-card-pink" bordered={false} loading={loading}>
                <div className="stat-icon-wrapper">
                  <UserOutlined className="stat-icon" />
                </div>
                <Statistic
                  title="Total Staff"
                  value={stats.totalStaff}
                  valueStyle={{ color: '#fff', fontWeight: 'bold', fontSize: '32px' }}
                />
                <div className="stat-footer">
                  <CheckCircleOutlined /> Team members
                </div>
              </Card>
            </Col>

            {/* Today's Attendance */}
            <Col xs={24} sm={12} lg={8}>
              <Card className="stat-card stat-card-blue" bordered={false} loading={loading}>
                <div className="stat-icon-wrapper">
                  <CheckCircleOutlined className="stat-icon" />
                </div>
                <Statistic
                  title="Today's Check-ins"
                  value={stats.todayAttendance}
                  valueStyle={{ color: '#fff', fontWeight: 'bold', fontSize: '32px' }}
                />
                <div className="stat-footer">
                  <CalendarOutlined /> Members present
                </div>
              </Card>
            </Col>

            {/* Total Equipment */}
            <Col xs={24} sm={12} lg={8}>
              <Card className="stat-card stat-card-green" bordered={false} loading={loading}>
                <div className="stat-icon-wrapper">
                  <ShopOutlined className="stat-icon" />
                </div>
                <Statistic
                  title="Total Equipment"
                  value={stats.totalEquipment}
                  valueStyle={{ color: '#fff', fontWeight: 'bold', fontSize: '32px' }}
                />
                <div className="stat-footer">
                  <CheckCircleOutlined /> Assets available
                </div>
              </Card>
            </Col>

            {/* Total Revenue */}
            <Col xs={24} sm={12} lg={8}>
              <Card className="stat-card stat-card-orange" bordered={false} loading={loading}>
                <div className="stat-icon-wrapper">
                  <DollarOutlined className="stat-icon" />
                </div>
                <Statistic
                  title="Total Revenue"
                  value={stats.totalRevenue}
                  prefix="LKR "
                  precision={2}
                  valueStyle={{ color: '#fff', fontWeight: 'bold', fontSize: '28px' }}
                />
                <div className="stat-footer">
                  <RiseOutlined /> All-time earnings
                </div>
              </Card>
            </Col>

            {/* Monthly Revenue */}
            <Col xs={24} sm={12} lg={8}>
              <Card className="stat-card stat-card-teal" bordered={false} loading={loading}>
                <div className="stat-icon-wrapper">
                  <DollarOutlined className="stat-icon" />
                </div>
                <Statistic
                  title="Monthly Revenue"
                  value={stats.monthlyRevenue}
                  prefix="LKR "
                  precision={2}
                  valueStyle={{ color: '#fff', fontWeight: 'bold', fontSize: '28px' }}
                />
                <div className="stat-footer">
                  <RiseOutlined /> This month's earnings
                </div>
              </Card>
            </Col>
          </Row>
        </div>

        {/* Quick Actions & Recent Activity */}
        <Row gutter={[24, 24]} style={{ marginTop: '24px' }}>
          {/* Quick Actions */}
          <Col xs={24} lg={12}>
            <Card 
              className="action-card" 
              title={
                <div className="card-title">
                  <PlusCircleOutlined className="title-icon" />
                  <span>Quick Actions</span>
                </div>
              }
              bordered={false}
            >
              <div className="quick-actions">
                <Button 
                  className="action-button action-button-purple" 
                  icon={<UserOutlined />} 
                  onClick={() => navigate('/Member')}
                  size="large"
                  block
                >
                  Add New Member
                </Button>
                <Button 
                  className="action-button action-button-pink" 
                  icon={<UserOutlined />} 
                  onClick={() => navigate('/staff')}
                  size="large"
                  block
                >
                  Add New Staff
                </Button>
                <Button 
                  className="action-button action-button-blue" 
                  icon={<ShopOutlined />} 
                  onClick={() => navigate('/Equipment')}
                  size="large"
                  block
                >
                  Add Equipment
                </Button>
                <Button 
                  className="action-button action-button-green" 
                  icon={<CalendarOutlined />} 
                  onClick={() => navigate('/Attendance')}
                  size="large"
                  block
                >
                  Mark Attendance
                </Button>
              </div>
            </Card>
          </Col>

          {/* Recent Activity */}
          <Col xs={24} lg={12}>
            <Card 
              className="activity-card" 
              title={
                <div className="card-title">
                  <RiseOutlined className="title-icon" />
                  <span>System Overview</span>
                </div>
              }
              bordered={false}
            >
              <div className="activity-list">
                <div className="activity-item">
                  <div className="activity-icon activity-icon-purple">
                    <TeamOutlined />
                  </div>
                  <div className="activity-content">
                    <div className="activity-title">Total Members</div>
                    <div className="activity-value">{stats.totalMembers} registered</div>
                  </div>
                </div>
                <div className="activity-item">
                  <div className="activity-icon activity-icon-pink">
                    <UserOutlined />
                  </div>
                  <div className="activity-content">
                    <div className="activity-title">Staff Members</div>
                    <div className="activity-value">{stats.totalStaff} active</div>
                  </div>
                </div>
                <div className="activity-item">
                  <div className="activity-icon activity-icon-blue">
                    <CheckCircleOutlined />
                  </div>
                  <div className="activity-content">
                    <div className="activity-title">Today's Attendance</div>
                    <div className="activity-value">{stats.todayAttendance} check-ins</div>
                  </div>
                </div>
                <div className="activity-item">
                  <div className="activity-icon activity-icon-green">
                    <DollarOutlined />
                  </div>
                  <div className="activity-content">
                    <div className="activity-title">Revenue Generated</div>
                    <div className="activity-value">LKR {stats.totalRevenue.toFixed(2)}</div>
                  </div>
                </div>
              </div>
            </Card>
          </Col>
        </Row>
      </div>
    </MainLayout>
  );
};

export default Dashboard;


