'use client';

import React, { useState } from 'react';
import { Layout, Menu, Avatar, Dropdown, Space, Typography } from 'antd';
import { 
  LogoutOutlined, 
  MenuUnfoldOutlined, 
  MenuFoldOutlined,
  UserOutlined,
  DatabaseOutlined
} from '@ant-design/icons';
import useAuthStore from '@/lib/store/authStore'; // Integrasi Logic

const { Header, Sider, Content } = Layout;
const { Title } = Typography;

export default function AdminLayout({ children }) {
  const [collapsed, setCollapsed] = useState(false);
  const { logout, user } = useAuthStore(); // Ambil fungsi logout

  // Menu Handler
  const handleMenuClick = ({ key }) => {
    if (key === 'logout') {
      logout();
    }
  };

  const menuItems = [
    {
      key: '1',
      icon: <DatabaseOutlined />,
      label: 'Data Items',
    },
    {
      key: '2',
      icon: <UserOutlined />,
      label: 'Profil Saya',
    },
  ];

  const userDropdownItems = [
    { key: 'logout', label: 'Logout', icon: <LogoutOutlined />, danger: true }
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {/* SIDEBAR FIXED */}
      <Sider 
        trigger={null} 
        collapsible 
        collapsed={collapsed}
        width={240}
        style={{ 
          borderRight: '1px solid #333',
          position: 'fixed', left: 0, top: 0, bottom: 0, zIndex: 100
        }}
      >
        <div className="h-16 flex items-center justify-center border-b border-[#333]">
          {collapsed ? (
            <div className="w-8 h-8 bg-white text-black font-bold flex items-center justify-center rounded">M</div>
          ) : (
            <Title level={4} style={{ margin: 0, color: 'white', letterSpacing: '1px' }}>
              MY<span className="font-light text-gray-500">APP</span>
            </Title>
          )}
        </div>

        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={['1']}
          items={menuItems}
          style={{ background: 'transparent', padding: '16px 0' }}
        />
      </Sider>

      {/* MAIN CONTENT */}
      <Layout style={{ marginLeft: collapsed ? 80 : 240, transition: 'all 0.2s', background: '#000' }}>
        
        <Header style={{ 
          padding: '0 24px', 
          background: 'rgba(17, 17, 17, 0.8)', 
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid #333',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          position: 'sticky', top: 0, zIndex: 90
        }}>
          <div onClick={() => setCollapsed(!collapsed)} className="cursor-pointer text-white hover:text-gray-400 text-lg">
            {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          </div>

          <Dropdown menu={{ items: userDropdownItems, onClick: handleMenuClick }}>
            <Space className="cursor-pointer hover:bg-[#222] py-1 px-3 rounded-full transition-colors">
              <Avatar size="small" icon={<UserOutlined />} className="bg-[#333]" />
              <span className="text-white text-sm font-medium hidden sm:block">
                {user?.username || 'Admin'}
              </span>
            </Space>
          </Dropdown>
        </Header>

        <Content style={{ padding: '24px', maxWidth: '1600px', margin: '0 auto', width: '100%' }}>
          {children}
        </Content>
      </Layout>
    </Layout>
  );
}