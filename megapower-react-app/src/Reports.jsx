import React from 'react';
import { Card, Row, Col, Statistic, Button } from 'antd';
import {
  UserOutlined,
  TeamOutlined,
  DollarOutlined,
  CalendarOutlined,
  BarChartOutlined,
  DownloadOutlined,
  FileTextOutlined
} from '@ant-design/icons';
import MainLayout from './components/Layout/MainLayout';
import './Reports.css';

const Reports = () => {
  return (
    <MainLayout showSidebar={true} showNavigation={false}>
      <div className="reports-container">
        {/* Header */}
        <div className="reports-header">
          <div className="header-left">
            <BarChartOutlined className="header-icon" />
            <h1 className="reports-title">Reports & Analytics</h1>
          </div>
          <div className="header-actions">
            <Button
              type="primary"
              icon={<DownloadOutlined />}
              className="download-button"
            >
              Export Reports
            </Button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="stats-grid">
          <Card className="stat-card">
            <Statistic
              title="Total Members"
              value={245}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#667eea' }}
            />
          </Card>
          <Card className="stat-card">
            <Statistic
              title="Active Staff"
              value={18}
              prefix={<TeamOutlined />}
              valueStyle={{ color: '#764ba2' }}
            />
          </Card>
          <Card className="stat-card">
            <Statistic
              title="Monthly Revenue"
              value={45680}
              prefix={<DollarOutlined />}
              valueStyle={{ color: '#10b981' }}
              precision={2}
            />
          </Card>
          <Card className="stat-card">
            <Statistic
              title="This Month Attendance"
              value={1024}
              prefix={<CalendarOutlined />}
              valueStyle={{ color: '#f59e0b' }}
            />
          </Card>
        </div>

        {/* Reports Sections */}
        <div className="reports-grid">
          <Card
            title={
              <span>
                <FileTextOutlined /> Member Reports
              </span>
            }
            className="report-card"
          >
            <p>View detailed member statistics and activity reports</p>
            <Button type="primary" icon={<DownloadOutlined />}>
              Generate Report
            </Button>
          </Card>

          <Card
            title={
              <span>
                <FileTextOutlined /> Financial Reports
              </span>
            }
            className="report-card"
          >
            <p>Access payment history and revenue analytics</p>
            <Button type="primary" icon={<DownloadOutlined />}>
              Generate Report
            </Button>
          </Card>

          <Card
            title={
              <span>
                <FileTextOutlined /> Attendance Reports
              </span>
            }
            className="report-card"
          >
            <p>Track member attendance patterns and trends</p>
            <Button type="primary" icon={<DownloadOutlined />}>
              Generate Report
            </Button>
          </Card>

          <Card
            title={
              <span>
                <FileTextOutlined /> Equipment Reports
              </span>
            }
            className="report-card"
          >
            <p>Monitor equipment usage and maintenance status</p>
            <Button type="primary" icon={<DownloadOutlined />}>
              Generate Report
            </Button>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default Reports;
