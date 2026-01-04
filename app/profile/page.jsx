'use client';
import { useState, useContext, useEffect } from 'react';
import { Form, Input, Button, Card, Upload, message, Avatar, Typography } from 'antd';
import { UserOutlined, UploadOutlined, MailOutlined } from '@ant-design/icons';
import { api } from '../../lib/api/api';
import { UserContext } from '../../components/AdminLayout';

const { Title } = Typography;

export default function ProfilePage() {
  const user = useContext(UserContext); // Ambil data user dari Layout
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);

  // Isi form saat data user tersedia
  useEffect(() => {
    if (user) {
      form.setFieldsValue({
        username: user.username,
        email: user.email,
        role: user.role === 'admin' ? 'Administrator' : 'User Biasa'
      });
    }
  }, [user, form]);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const formData = new FormData();
      // Username & Email biasanya tidak diedit di sini untuk simpelnya, 
      // kita fokus update avatar saja atau data tambahan lain.
      
      if (fileList.length > 0) {
        formData.append('avatar', fileList[0].originFileObj);
        await api.updateProfile(formData);
        message.success('Profil diperbarui! Refresh untuk melihat perubahan.');
        // Reload halaman agar AdminLayout mengambil data terbaru
        window.location.reload(); 
      } else {
        message.info('Tidak ada perubahan gambar.');
      }
    } catch (error) {
      console.error(error);
      message.error('Gagal memperbarui profil');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Title level={2} className="!text-white mb-6">Profil Saya</Title>
      
      <Card bordered={false} style={{ background: '#111', border: '1px solid #333' }}>
        <div className="flex flex-col md:flex-row gap-8 items-start">
          
          {/* Bagian Avatar */}
          <div className="flex flex-col items-center gap-4 w-full md:w-1/3">
            <Avatar 
              size={120} 
              src={user?.avatar} 
              icon={<UserOutlined />} 
              className="bg-[#222] border-2 border-[#333]"
            />
            <div className="text-center">
              <div className="text-white font-bold text-lg">{user?.username}</div>
              <div className="text-gray-500 uppercase text-xs">{user?.role}</div>
            </div>
          </div>

          {/* Bagian Form */}
          <div className="w-full md:w-2/3">
            <Form form={form} layout="vertical" onFinish={onFinish}>
              <Form.Item label={<span className="text-gray-400">Username</span>} name="username">
                <Input disabled className="bg-[#1a1a1a] border-[#333] text-gray-500" prefix={<UserOutlined />} />
              </Form.Item>
              
              <Form.Item label={<span className="text-gray-400">Email</span>} name="email">
                <Input disabled className="bg-[#1a1a1a] border-[#333] text-gray-500" prefix={<MailOutlined />} />
              </Form.Item>
              
              <Form.Item label={<span className="text-gray-400">Ganti Avatar</span>}>
                <Upload 
                  maxCount={1}
                  beforeUpload={() => false} // Jangan upload otomatis
                  fileList={fileList}
                  onChange={({ fileList }) => setFileList(fileList)}
                  listType="picture"
                  className="text-white"
                >
                  <Button icon={<UploadOutlined />} className="bg-[#222] text-white border-[#444] hover:border-white">
                    Pilih Gambar
                  </Button>
                </Upload>
              </Form.Item>

              <Button type="primary" htmlType="submit" loading={loading} className="bg-white text-black border-none font-semibold mt-2">
                Simpan Perubahan
              </Button>
            </Form>
          </div>
        </div>
      </Card>
    </div>
  );
}