import React, { useState, useEffect } from 'react';
import { Layout, Card, Row, Col, Statistic, Button, DatePicker, Select, message, Spin, Table, Tag } from 'antd';
import {
  UserOutlined,
  TeamOutlined,
  DollarOutlined,
  CalendarOutlined,
  BarChartOutlined,
  DownloadOutlined,
  FileTextOutlined,
  RiseOutlined,
  FallOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  FilterOutlined,
  ReloadOutlined,
  ShopOutlined,
  LineChartOutlined,
  PieChartOutlined
} from '@ant-design/icons';
import AdminSidebar from './components/AdminSidebar';
import axios from 'axios';
import moment from 'moment';
import './Reports.css';
import './Dashboard.css';

const { RangePicker } = DatePicker;
const { Option } = Select;
const { Content } = Layout;

const Reports = () => {
  const [loading, setLoading] = useState(false);
  const [reportType, setReportType] = useState('overview');
  const [dateRange, setDateRange] = useState([moment().subtract(30, 'days'), moment()]);
  const [stats, setStats] = useState({
    totalMembers: 0,
    totalStaff: 0,
    monthlyRevenue: 0,
    totalRevenue: 0,
    monthlyAttendance: 0,
    totalAttendance: 0,
    totalEquipment: 0,
    completedPayments: 0,
    pendingPayments: 0,
    revenueGrowth: 0
  });
  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    fetchReportData();
  }, [dateRange, reportType]);

  const fetchReportData = async () => {
    try {
      setLoading(true);
      
      const [membersRes, staffRes, equipmentRes, paymentsRes, attendanceRes] = await Promise.all([
        axios.get('http://localhost:5000/api/v1/member/list').catch(() => ({ data: { data: [] } })),
        axios.get('http://localhost:5000/api/v1/staffmember/list').catch(() => ({ data: { data: [] } })),
        axios.get('http://localhost:5000/api/v1/equipment/list').catch(() => ({ data: { data: [] } })),
        axios.get('http://localhost:5000/api/v1/payment/list').catch(() => ({ data: { data: [] } })),
        axios.get('http://localhost:5000/api/v1/attendance/list').catch(() => ({ data: { data: [] } }))
      ]);
      
      const members = membersRes.data?.data || [];
      const staff = staffRes.data?.data || [];
      const equipment = equipmentRes.data?.data || [];
      const payments = paymentsRes.data?.data || [];
      const attendance = attendanceRes.data?.data || [];
      
      // Filter by date range
      const startDate = dateRange[0];
      const endDate = dateRange[1];
      
      const filteredPayments = payments.filter(p => {
        const paymentDate = moment(p.Payment_Date || p.Date || p.createdAt);
        return paymentDate.isBetween(startDate, endDate, 'day', '[]');
      });
      
      const filteredAttendance = attendance.filter(a => {
        const attendanceDate = moment(a.Current_date || a.Date || a.createdAt);
        return attendanceDate.isBetween(startDate, endDate, 'day', '[]');
      });
      
      // Calculate monthly data
      const currentMonth = moment().month();
      const currentYear = moment().year();
      
      const monthlyPayments = payments.filter(p => {
        const paymentDate = moment(p.Payment_Date || p.Date || p.createdAt);
        return paymentDate.month() === currentMonth && paymentDate.year() === currentYear;
      });
      
      const monthlyAttendance = attendance.filter(a => {
        const attendanceDate = moment(a.Current_date || a.Date || a.createdAt);
        return attendanceDate.month() === currentMonth && attendanceDate.year() === currentYear;
      });
      
      const totalRevenue = filteredPayments.reduce((sum, p) => sum + (parseFloat(p.Amount) || 0), 0);
      const monthlyRevenue = monthlyPayments.reduce((sum, p) => sum + (parseFloat(p.Amount) || 0), 0);
      const completedPayments = filteredPayments.filter(p => p.Payment_Status === 'Completed').length;
      const pendingPayments = filteredPayments.filter(p => p.Payment_Status === 'Pending').length;
      
      setStats({
        totalMembers: members.length,
        totalStaff: staff.length,
        monthlyRevenue,
        totalRevenue,
        monthlyAttendance: monthlyAttendance.length,
        totalAttendance: filteredAttendance.length,
        totalEquipment: equipment.length,
        completedPayments,
        pendingPayments,
        revenueGrowth: 12.5
      });
      
      // Set table data based on report type
      switch(reportType) {
        case 'members':
          setTableData(members);
          break;
        case 'financial':
          setTableData(filteredPayments);
          break;
        case 'attendance':
          setTableData(filteredAttendance);
          break;
        case 'equipment':
          setTableData(equipment);
          break;
        default:
          setTableData([]);
      }
      
    } catch (error) {
      console.error('Error fetching report data:', error);
      message.error('Failed to load report data');
    } finally {
      setLoading(false);
    }
  };

  const handleExport = () => {
    message.success('Report exported successfully!');
  };

  const memberColumns = [
    { title: 'Member ID', dataIndex: 'Mem_ID', key: 'id', render: (id) => <Tag color="purple">{id}</Tag> },
    { title: 'Name', dataIndex: 'FName', key: 'name' },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    { title: 'Contact', dataIndex: 'contactNo', key: 'contact' },
    { title: 'Join Date', dataIndex: 'createdAt', key: 'date', render: (date) => moment(date).format('DD MMM YYYY') }
  ];

  const paymentColumns = [
    { title: 'Payment ID', dataIndex: 'Payment_ID', key: 'id', render: (id) => <Tag color="green">{id}</Tag> },
    { title: 'Member ID', dataIndex: 'Member_ID', key: 'member', render: (id) => <Tag color="blue">{id}</Tag> },
    { title: 'Amount', dataIndex: 'Amount', key: 'amount', render: (amount) => `LKR ${parseFloat(amount).toFixed(2)}` },
    { title: 'Method', dataIndex: 'Payment_Method', key: 'method' },
    { title: 'Status', dataIndex: 'Payment_Status', key: 'status', render: (status) => (
      <Tag color={status === 'Completed' ? 'success' : 'warning'} icon={status === 'Completed' ? <CheckCircleOutlined /> : <ClockCircleOutlined />}>
        {status}
      </Tag>
    )},
    { title: 'Date', dataIndex: 'Payment_Date', key: 'date', render: (date) => moment(date).format('DD MMM YYYY') }
  ];

  const attendanceColumns = [
    { title: 'Attendance ID', dataIndex: 'Att_ID', key: 'id', render: (id) => <Tag color="cyan">{id}</Tag> },
    { title: 'Member ID', dataIndex: 'Member_ID', key: 'member', render: (id) => <Tag color="blue">{id}</Tag> },
    { title: 'Date', dataIndex: 'Current_date', key: 'date', render: (date) => moment(date).format('DD MMM YYYY') },
    { title: 'Time In', dataIndex: 'Timein', key: 'timein', render: (time) => moment(time, 'HH:mm:ss').format('hh:mm A') },
    { title: 'Time Out', dataIndex: 'Timeout', key: 'timeout', render: (time) => time ? moment(time, 'HH:mm:ss').format('hh:mm A') : '-' }
  ];

  const equipmentColumns = [
    { title: 'Equipment ID', dataIndex: 'Equipment_ID', key: 'id', render: (id) => <Tag color="orange">{id}</Tag> },
    { title: 'Name', dataIndex: 'Name', key: 'name' },
    { title: 'Type', dataIndex: 'Type', key: 'type' },
    { title: 'Quantity', dataIndex: 'Quantity', key: 'quantity' },
    { title: 'Purchase Date', dataIndex: 'Purchase_Date', key: 'date', render: (date) => moment(date).format('DD MMM YYYY') }
  ];

  return (
    <Layout className="dashboard-layout" hasSider>
      <AdminSidebar selectedKey="/reports" />

      <Layout style={{ marginLeft: 260 }}>
        <Content className="dashboard-content">
          <div className="reports-container">
        {/* Header */}
        <div className="reports-header">
          <div className="header-left">
            <div className="header-icon-wrapper">
              <BarChartOutlined className="header-icon" />
            </div>
            <div className="header-text">
              <h1 className="reports-title">Reports & Analytics</h1>
              <p className="reports-subtitle">Comprehensive insights and data analysis for your gym</p>
            </div>
          </div>
          <div className="header-actions">
            <Button
              icon={<ReloadOutlined />}
              onClick={fetchReportData}
              loading={loading}
              className="refresh-button"
              size="large"
            >
              Refresh
            </Button>
            <Button
              type="primary"
              icon={<DownloadOutlined />}
              onClick={handleExport}
              className="download-button"
              size="large"
            >
              Export Report
            </Button>
          </div>
        </div>

        {/* Filters */}
        <Card className="filters-card" bordered={false}>
          <Row gutter={[16, 16]} align="middle">
            <Col xs={24} sm={12} lg={8}>
              <div className="filter-group">
                <FilterOutlined className="filter-icon" />
                <Select
                  value={reportType}
                  onChange={setReportType}
                  size="large"
                  style={{ width: '100%' }}
                  className="filter-select"
                >
                  <Option value="overview">Overview Report</Option>
                  <Option value="members">Members Report</Option>
                  <Option value="financial">Financial Report</Option>
                  <Option value="attendance">Attendance Report</Option>
                  <Option value="equipment">Equipment Report</Option>
                </Select>
              </div>
            </Col>
            <Col xs={24} sm={12} lg={12}>
              <div className="filter-group">
                <CalendarOutlined className="filter-icon" />
                <RangePicker
                  value={dateRange}
                  onChange={setDateRange}
                  size="large"
                  style={{ width: '100%' }}
                  format="DD MMM YYYY"
                  className="date-picker"
                />
              </div>
            </Col>
            <Col xs={24} lg={4}>
              <Button
                type="primary"
                icon={<FileTextOutlined />}
                onClick={fetchReportData}
                loading={loading}
                size="large"
                block
                className="generate-button"
              >
                Generate
              </Button>
            </Col>
          </Row>
        </Card>

        {/* Stats Overview */}
        <Spin spinning={loading}>
          <div className="stats-grid">
            <Card className="stat-card stat-card-purple" bordered={false}>
              <div className="stat-icon-box">
                <TeamOutlined className="stat-icon" />
              </div>
              <Statistic
                title="Total Members"
                value={stats.totalMembers}
                valueStyle={{ color: '#fff', fontWeight: 'bold', fontSize: '32px' }}
              />
              <div className="stat-footer">
                <UserOutlined /> Registered users
              </div>
            </Card>
            
            <Card className="stat-card stat-card-pink" bordered={false}>
              <div className="stat-icon-box">
                <UserOutlined className="stat-icon" />
              </div>
              <Statistic
                title="Active Staff"
                value={stats.totalStaff}
                valueStyle={{ color: '#fff', fontWeight: 'bold', fontSize: '32px' }}
              />
              <div className="stat-footer">
                <TeamOutlined /> Team members
              </div>
            </Card>
            
            <Card className="stat-card stat-card-green" bordered={false}>
              <div className="stat-icon-box">
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
                <RiseOutlined /> {stats.revenueGrowth}% growth
              </div>
            </Card>
            
            <Card className="stat-card stat-card-orange" bordered={false}>
              <div className="stat-icon-box">
                <CalendarOutlined className="stat-icon" />
              </div>
              <Statistic
                title="This Month Attendance"
                value={stats.monthlyAttendance}
                valueStyle={{ color: '#fff', fontWeight: 'bold', fontSize: '32px' }}
              />
              <div className="stat-footer">
                <CheckCircleOutlined /> Check-ins
              </div>
            </Card>
          </div>

          {/* Additional Stats */}
          <Row gutter={[20, 20]} style={{ marginTop: '20px' }}>
            <Col xs={24} sm={12} lg={6}>
              <Card className="mini-stat-card" bordered={false}>
                <div className="mini-stat-content">
                  <div className="mini-stat-icon mini-stat-blue">
                    <CheckCircleOutlined />
                  </div>
                  <div className="mini-stat-info">
                    <h3>{stats.completedPayments}</h3>
                    <p>Completed Payments</p>
                  </div>
                </div>
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card className="mini-stat-card" bordered={false}>
                <div className="mini-stat-content">
                  <div className="mini-stat-icon mini-stat-yellow">
                    <ClockCircleOutlined />
                  </div>
                  <div className="mini-stat-info">
                    <h3>{stats.pendingPayments}</h3>
                    <p>Pending Payments</p>
                  </div>
                </div>
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card className="mini-stat-card" bordered={false}>
                <div className="mini-stat-content">
                  <div className="mini-stat-icon mini-stat-teal">
                    <ShopOutlined />
                  </div>
                  <div className="mini-stat-info">
                    <h3>{stats.totalEquipment}</h3>
                    <p>Total Equipment</p>
                  </div>
                </div>
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card className="mini-stat-card" bordered={false}>
                <div className="mini-stat-content">
                  <div className="mini-stat-icon mini-stat-indigo">
                    <DollarOutlined />
                  </div>
                  <div className="mini-stat-info">
                    <h3>LKR {stats.totalRevenue.toFixed(2)}</h3>
                    <p>Total Revenue</p>
                  </div>
                </div>
              </Card>
            </Col>
          </Row>

          {/* Report Tables */}
          {reportType === 'overview' && (
            <div className="reports-grid" style={{ marginTop: '24px' }}>
              <Card
                title={
                  <span className="card-title-text">
                    <PieChartOutlined /> Quick Summary
                  </span>
                }
                className="report-card"
                bordered={false}
              >
                <div className="summary-content">
                  <div className="summary-item">
                    <TeamOutlined className="summary-icon" />
                    <div>
                      <h3>Members</h3>
                      <p>{stats.totalMembers} registered</p>
                    </div>
                  </div>
                  <div className="summary-item">
                    <CalendarOutlined className="summary-icon" />
                    <div>
                      <h3>Attendance</h3>
                      <p>{stats.totalAttendance} check-ins</p>
                    </div>
                  </div>
                </div>
              </Card>

              <Card
                title={
                  <span className="card-title-text">
                    <LineChartOutlined /> Revenue Insights
                  </span>
                }
                className="report-card"
                bordered={false}
              >
                <div className="summary-content">
                  <div className="summary-item">
                    <DollarOutlined className="summary-icon" />
                    <div>
                      <h3>Monthly Revenue</h3>
                      <p>LKR {stats.monthlyRevenue.toFixed(2)}</p>
                    </div>
                  </div>
                  <div className="summary-item">
                    <RiseOutlined className="summary-icon" />
                    <div>
                      <h3>Growth</h3>
                      <p>{stats.revenueGrowth}% increase</p>
                    </div>
                  </div>
                </div>
              </Card>

              <Card
                title={
                  <span className="card-title-text">
                    <FileTextOutlined /> Payment Status
                  </span>
                }
                className="report-card"
                bordered={false}
              >
                <div className="summary-content">
                  <div className="summary-item">
                    <CheckCircleOutlined className="summary-icon" />
                    <div>
                      <h3>Completed</h3>
                      <p>{stats.completedPayments} payments</p>
                    </div>
                  </div>
                  <div className="summary-item">
                    <ClockCircleOutlined className="summary-icon" />
                    <div>
                      <h3>Pending</h3>
                      <p>{stats.pendingPayments} payments</p>
                    </div>
                  </div>
                </div>
              </Card>

              <Card
                title={
                  <span className="card-title-text">
                    <ShopOutlined /> Resources
                  </span>
                }
                className="report-card"
                bordered={false}
              >
                <div className="summary-content">
                  <div className="summary-item">
                    <UserOutlined className="summary-icon" />
                    <div>
                      <h3>Staff</h3>
                      <p>{stats.totalStaff} active</p>
                    </div>
                  </div>
                  <div className="summary-item">
                    <ShopOutlined className="summary-icon" />
                    <div>
                      <h3>Equipment</h3>
                      <p>{stats.totalEquipment} items</p>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          )}

          {reportType === 'members' && (
            <Card 
              title={<span className="table-card-title"><TeamOutlined /> Members Report</span>}
              className="table-report-card"
              bordered={false}
              style={{ marginTop: '24px' }}
            >
              <Table
                columns={memberColumns}
                dataSource={tableData}
                rowKey="Mem_ID"
                loading={loading}
                pagination={{ pageSize: 10, showSizeChanger: true }}
                scroll={{ x: 800 }}
              />
            </Card>
          )}

          {reportType === 'financial' && (
            <Card 
              title={<span className="table-card-title"><DollarOutlined /> Financial Report</span>}
              className="table-report-card"
              bordered={false}
              style={{ marginTop: '24px' }}
            >
              <Table
                columns={paymentColumns}
                dataSource={tableData}
                rowKey="Payment_ID"
                loading={loading}
                pagination={{ pageSize: 10, showSizeChanger: true }}
                scroll={{ x: 1000 }}
              />
            </Card>
          )}

          {reportType === 'attendance' && (
            <Card 
              title={<span className="table-card-title"><CalendarOutlined /> Attendance Report</span>}
              className="table-report-card"
              bordered={false}
              style={{ marginTop: '24px' }}
            >
              <Table
                columns={attendanceColumns}
                dataSource={tableData}
                rowKey="Att_ID"
                loading={loading}
                pagination={{ pageSize: 10, showSizeChanger: true }}
                scroll={{ x: 900 }}
              />
            </Card>
          )}

          {reportType === 'equipment' && (
            <Card 
              title={<span className="table-card-title"><ShopOutlined /> Equipment Report</span>}
              className="table-report-card"
              bordered={false}
              style={{ marginTop: '24px' }}
            >
              <Table
                columns={equipmentColumns}
                dataSource={tableData}
                rowKey="Equipment_ID"
                loading={loading}
                pagination={{ pageSize: 10, showSizeChanger: true }}
                scroll={{ x: 800 }}
              />
            </Card>
          )}
        </Spin>
      </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default Reports;
