import React, { useEffect, useState } from "react";
import { Button, Table, Input, message, Tag } from "antd";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { 
  LeftOutlined, 
  SearchOutlined, 
  DollarOutlined,
  CreditCardOutlined,
  FilePdfOutlined,
  DownloadOutlined
} from "@ant-design/icons";
import moment from "moment";
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { Layout } from 'antd';
import AdminSidebar from './components/AdminSidebar';
import './Dashboard.css';
import './Paymenttable.css';

const { Content } = Layout;

export const Paymenttable = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]); 
  const [filteredData, setFilteredData] = useState([]); 
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(false); 

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:5000/api/v1/payment/list");
      setData(response?.data?.data || []);
      setFilteredData(response?.data?.data || []);
    } catch (error) {
      console.error(`Error fetching data: ${error.message}`);
      message.error("Failed to fetch payment data");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (value) => {
    setSearchText(value);
    if (value) {
      const filtered = data.filter((item) => 
        String(item.Payment_ID).toLowerCase().includes(value.toLowerCase()) ||
        String(item.Member_Id).toLowerCase().includes(value.toLowerCase()) ||
        String(item.Package_ID).toLowerCase().includes(value.toLowerCase()) ||
        String(item.Amount).toLowerCase().includes(value.toLowerCase())
      );
      setFilteredData(filtered);
    } else {
      setFilteredData(data);
    }
  };

  const generatePDF = async (payment) => {
    try {
      // Fetch member details
      const memberResponse = await axios.get(`http://localhost:5000/api/v1/member/list`);
      const members = memberResponse?.data?.data || [];
      const member = members.find(m => m.Mem_ID === payment.Member_Id);

      const doc = new jsPDF();
      
      // Header
      doc.setFillColor(102, 126, 234);
      doc.rect(0, 0, 210, 40, 'F');
      
      // Logo/Title
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(24);
      doc.setFont(undefined, 'bold');
      doc.text('MEGA POWER', 105, 20, { align: 'center' });
      doc.setFontSize(12);
      doc.setFont(undefined, 'normal');
      doc.text('GYM & FITNESS', 105, 28, { align: 'center' });
      
      // Payment Receipt Title
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(20);
      doc.setFont(undefined, 'bold');
      doc.text('PAYMENT RECEIPT', 105, 55, { align: 'center' });
      
      // Receipt Info Box
      doc.setDrawColor(102, 126, 234);
      doc.setLineWidth(0.5);
      doc.line(20, 65, 190, 65);
      
      // Receipt Details
      doc.setFontSize(11);
      doc.setFont(undefined, 'normal');
      
      let yPos = 75;
      
      // Receipt Number and Date
      doc.setFont(undefined, 'bold');
      doc.text('Receipt No:', 20, yPos);
      doc.setFont(undefined, 'normal');
      doc.text(`#${payment.Payment_ID}`, 60, yPos);
      
      doc.setFont(undefined, 'bold');
      doc.text('Date:', 130, yPos);
      doc.setFont(undefined, 'normal');
      doc.text(moment(payment.Date).format('DD MMM YYYY'), 150, yPos);
      
      yPos += 15;
      
      // Member Information Section
      doc.setFillColor(240, 240, 240);
      doc.rect(20, yPos, 170, 8, 'F');
      doc.setFont(undefined, 'bold');
      doc.setFontSize(12);
      doc.text('MEMBER INFORMATION', 25, yPos + 6);
      
      yPos += 15;
      doc.setFontSize(11);
      
      doc.setFont(undefined, 'bold');
      doc.text('Member ID:', 25, yPos);
      doc.setFont(undefined, 'normal');
      doc.text(String(payment.Member_Id), 65, yPos);
      
      if (member) {
        yPos += 8;
        doc.setFont(undefined, 'bold');
        doc.text('Name:', 25, yPos);
        doc.setFont(undefined, 'normal');
        doc.text(member.FName || 'N/A', 65, yPos);
        
        yPos += 8;
        doc.setFont(undefined, 'bold');
        doc.text('Email:', 25, yPos);
        doc.setFont(undefined, 'normal');
        doc.text(member.email || 'N/A', 65, yPos);
        
        yPos += 8;
        doc.setFont(undefined, 'bold');
        doc.text('Contact:', 25, yPos);
        doc.setFont(undefined, 'normal');
        doc.text(member.contactNo || 'N/A', 65, yPos);
      }
      
      yPos += 15;
      
      // Payment Details Section
      doc.setFillColor(240, 240, 240);
      doc.rect(20, yPos, 170, 8, 'F');
      doc.setFont(undefined, 'bold');
      doc.setFontSize(12);
      doc.text('PAYMENT DETAILS', 25, yPos + 6);
      
      yPos += 15;
      doc.setFontSize(11);
      
      // Package Info
      const packageMap = {
        "1": "Basic Package",
        "2": "Standard Package",
        "3": "Premium Package"
      };
      const packageName = packageMap[payment.Package_ID] || `Package ${payment.Package_ID}`;
      
      doc.setFont(undefined, 'bold');
      doc.text('Package:', 25, yPos);
      doc.setFont(undefined, 'normal');
      doc.text(packageName, 65, yPos);
      
      yPos += 8;
      doc.setFont(undefined, 'bold');
      doc.text('Payment Method:', 25, yPos);
      doc.setFont(undefined, 'normal');
      doc.text(payment.Payment_Method || 'N/A', 65, yPos);
      
      yPos += 8;
      doc.setFont(undefined, 'bold');
      doc.text('Payment Status:', 25, yPos);
      doc.setFont(undefined, 'normal');
      doc.text(payment.Payment_Status || 'N/A', 65, yPos);
      
      if (payment.Description) {
        yPos += 8;
        doc.setFont(undefined, 'bold');
        doc.text('Description:', 25, yPos);
        doc.setFont(undefined, 'normal');
        const descriptionLines = doc.splitTextToSize(payment.Description, 120);
        doc.text(descriptionLines, 65, yPos);
        yPos += (descriptionLines.length * 6);
      }
      
      yPos += 15;
      
      // Amount Box
      doc.setFillColor(102, 126, 234);
      doc.rect(20, yPos, 170, 20, 'F');
      
      doc.setTextColor(255, 255, 255);
      doc.setFont(undefined, 'bold');
      doc.setFontSize(12);
      doc.text('TOTAL AMOUNT PAID', 25, yPos + 8);
      
      doc.setFontSize(16);
      doc.text(`Rs. ${parseFloat(payment.Amount).toLocaleString()}`, 190, yPos + 13, { align: 'right' });
      
      yPos += 35;
      
      // Footer
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(9);
      doc.setFont(undefined, 'normal');
      doc.text('Thank you for your payment!', 105, yPos, { align: 'center' });
      
      yPos += 6;
      doc.setTextColor(100, 100, 100);
      doc.text('This is a computer-generated receipt and does not require a signature.', 105, yPos, { align: 'center' });
      
      yPos += 10;
      doc.setDrawColor(200, 200, 200);
      doc.line(20, yPos, 190, yPos);
      
      yPos += 8;
      doc.setFontSize(8);
      doc.text('Mega Power Gym & Fitness | Contact: +94 XX XXX XXXX | Email: info@megapower.com', 105, yPos, { align: 'center' });
      
      // Save the PDF
      doc.save(`Payment_Receipt_${payment.Payment_ID}_${moment(payment.Date).format('YYYYMMDD')}.pdf`);
      message.success('Payment receipt generated successfully!');
      
    } catch (error) {
      console.error('Error generating PDF:', error);
      message.error('Failed to generate payment receipt');
    }
  };

  const columns = [
    {
      title: "Payment ID",
      dataIndex: "Payment_ID",
      key: "paymentId",
      width: 120,
      fixed: "left",
      render: (id) => <Tag color="green" className="payment-id-tag">{id}</Tag>,
    },
    {
      title: "Member ID",
      dataIndex: "Member_Id",
      key: "member_id",
      width: 120,
      render: (id) => <Tag color="blue" className="member-id-tag">{id}</Tag>,
    },
    {
      title: "Package",
      dataIndex: "Package_ID",
      key: "packageId",
      width: 150,
      render: (pkg) => {
        const packageMap = {
          "1": { name: "Basic", color: "default" },
          "2": { name: "Standard", color: "blue" },
          "3": { name: "Premium", color: "gold" }
        };
        const packageInfo = packageMap[pkg] || { name: `Package ${pkg}`, color: "default" };
        return <Tag color={packageInfo.color}>{packageInfo.name}</Tag>;
      },
    },
    {
      title: "Amount",
      dataIndex: "Amount",
      key: "amount",
      width: 150,
      render: (amount) => (
        <span className="amount-display">
          <DollarOutlined className="amount-icon" />
          Rs. {parseFloat(amount).toLocaleString()}
        </span>
      ),
    },
    {
      title: "Payment Method",
      dataIndex: "Payment_Method",
      key: "paymentMethod",
      width: 150,
      render: (method) => {
        const methodMap = {
          "cash": { name: "Cash", color: "green" },
          "bank": { name: "Bank Transfer", color: "blue" },
          "payhere": { name: "PayHere", color: "purple" }
        };
        const methodInfo = methodMap[method] || { name: method || "N/A", color: "default" };
        return <Tag color={methodInfo.color}>{methodInfo.name}</Tag>;
      },
    },
    {
      title: "Payment Date",
      dataIndex: "Date",
      key: "date",
      width: 150,
      render: (date) => moment(date).format("YYYY-MM-DD"),
    },
    {
      title: "Status",
      dataIndex: "Status",
      key: "status",
      width: 120,
      render: (status) => {
        const statusMap = {
          "Completed": { color: "success" },
          "Pending": { color: "warning" },
          "Failed": { color: "error" }
        };
        const statusInfo = statusMap[status] || { color: "default" };
        return <Tag color={statusInfo.color}>{status || "Pending"}</Tag>;
      },
    },
    {
      title: "Description",
      dataIndex: "Payment_Slip",
      key: "description",
      width: 150,
      render: (slip, record) => {
        if (record.Payment_Method === 'bank' && slip) {
          return (
            <a 
              href={`http://localhost:5000/uploads/payment-slips/${slip}`} 
              target="_blank" 
              rel="noopener noreferrer"
            >
              View Slip
            </a>
          );
        }
        return <span style={{ color: '#999' }}>-</span>;
      },
    },
    {
      title: "Action",
      key: "action",
      width: 120,
      fixed: "right",
      render: (_, record) => (
        <Button
          type="primary"
          icon={<FilePdfOutlined />}
          onClick={() => generatePDF(record)}
          size="small"
          style={{ 
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            border: 'none'
          }}
        >
          PDF
        </Button>
      ),
    },
  ];

  return (
    <Layout className="dashboard-layout" hasSider>
      <AdminSidebar selectedKey="/Paymenttable" />
      <Layout style={{ marginLeft: 260 }}>
        <Content className="dashboard-content">
      <div className="payment-table-container">
        <div className="table-header">
          <div className="header-left">
            <CreditCardOutlined className="header-icon" />
            <h1 className="table-title">Payment Management</h1>
          </div>
          <div className="header-actions">
            <Input
              placeholder="Search by Payment ID, Member ID, Package or Amount..."
              value={searchText}
              onChange={(e) => handleSearch(e.target.value)}
              prefix={<SearchOutlined />}
              allowClear
              className="search-input"
            />
            <Button
              type="primary"
              icon={<CreditCardOutlined />}
              onClick={() => navigate("/Payment")}
              className="add-button"
            >
              Add Payment
            </Button>
          </div>
        </div>

        <div className="table-content">
          <Table
            columns={columns}
            dataSource={filteredData}
            loading={loading}
            rowKey="Payment_ID"
            scroll={{ x: 800 }}
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showTotal: (total) => `Total ${total} payments`,
            }}
            className="payment-table"
          />
        </div>
      </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default Paymenttable;