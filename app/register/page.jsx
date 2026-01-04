'use client';
import { useState } from 'react';
import { Form, Input, Button, Card, Typography, message } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';
import { api } from '../../lib/api/api';
import { useRouter } from 'next/navigation';

const { Title } = Typography;

export default function RegisterPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      await api.register(values);
      message.success('Akun dibuat! Silakan login.');
      router.push('/login');
    } catch (error) {
      message.error('Gagal daftar. Username mungkin sudah ada.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      {/* FIX: Ganti bordered={false} jadi variant="borderless" */}
      <Card variant="borderless" style={{ width: 400, background: '#111', border: '1px solid #333' }}>
        <div className="text-center mb-8">
          <Title level={2} style={{ color: 'white', marginBottom: 0 }}>Register</Title>
          <p className="text-gray-500">Buat akun baru</p>
        </div>

        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item name="username" rules={[{ required: true, message: 'Wajib diisi' }]}>
            <Input prefix={<UserOutlined className="text-gray-500" />} placeholder="Username" size="large" className="bg-[#1a1a1a] border-[#333] text-white" />
          </Form.Item>

          <Form.Item name="email" rules={[{ type: 'email', message: 'Email tidak valid' }]}>
            <Input prefix={<MailOutlined className="text-gray-500" />} placeholder="Email (Opsional)" size="large" className="bg-[#1a1a1a] border-[#333] text-white" />
          </Form.Item>
          
          <Form.Item name="password" rules={[{ required: true, message: 'Wajib diisi' }]}>
            <Input.Password prefix={<LockOutlined className="text-gray-500" />} placeholder="Password" size="large" className="bg-[#1a1a1a] border-[#333] text-white" />
          </Form.Item>
          
          <Button type="primary" htmlType="submit" block size="large" loading={loading} className="mt-4 bg-white text-black hover:bg-gray-200 border-none font-bold">
            DAFTAR
          </Button>

          <div className="text-center mt-4">
            <a href="/login" className="text-gray-500 hover:text-white text-sm">Sudah punya akun? Login</a>
          </div>
        </Form>
      </Card>
    </div>
  );
}