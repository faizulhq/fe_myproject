'use client';
import React from 'react';
import { Form, Input, Button, Card, Typography } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useLogin } from '@/lib/hooks/useAuth'; // Pakai Hook baru
import Link from 'next/link';

const { Title } = Typography;

export default function LoginPage() {
  const loginMutation = useLogin();

  const onFinish = (values) => {
    loginMutation.mutate(values);
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <Card variant="borderless" style={{ width: 400, background: '#111', border: '1px solid #333' }}>
        <div className="text-center mb-8">
          <Title level={2} style={{ color: 'white', marginBottom: 0 }}>Welcome</Title>
          <p className="text-gray-500">Masuk untuk mengelola data</p>
        </div>

        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item name="username" rules={[{ required: true, message: 'Wajib diisi' }]}>
            <Input prefix={<UserOutlined className="text-gray-500" />} placeholder="Username" size="large" className="bg-[#1a1a1a] border-[#333] text-white" />
          </Form.Item>
          <Form.Item name="password" rules={[{ required: true, message: 'Wajib diisi' }]}>
            <Input.Password prefix={<LockOutlined className="text-gray-500" />} placeholder="Password" size="large" className="bg-[#1a1a1a] border-[#333] text-white" />
          </Form.Item>
          
          <Button 
            type="primary" htmlType="submit" block size="large" 
            loading={loginMutation.isPending} // Gunakan status pending dari hook
            className="mt-4 bg-white text-black hover:bg-gray-200 border-none font-bold"
          >
            LOGIN
          </Button>

          <div className="text-center mt-4">
            <Link href="/register" className="text-gray-500 hover:text-white text-sm">Belum punya akun? Daftar</Link>
          </div>
        </Form>
      </Card>
    </div>
  );
}