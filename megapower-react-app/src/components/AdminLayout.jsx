import React from 'react';
import { Layout } from 'antd';
import { Sidebar } from './Sidebar';
import './AdminLayout.css';

const { Content } = Layout;

export const AdminLayout = ({ children }) => {
  return (
    <Layout className="admin-layout" hasSider>
      <Sidebar />
      <Layout className="admin-content-layout" style={{ marginLeft: 260 }}>
        <Content className="admin-content">
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};
