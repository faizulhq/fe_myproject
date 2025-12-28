'use client';

import { useState, useEffect } from 'react';
import { Form, Input, Button, Upload, message, Space } from 'antd';
import { 
  FileImageOutlined, 
  FilePdfOutlined,
  SaveOutlined 
} from '@ant-design/icons';
import { FiSave, FiX } from 'react-icons/fi';

const { TextArea } = Input;

export default function ItemForm({ editingItem, onSubmit, onCancel }) {
  const [form] = Form.useForm();
  
  // State untuk menyimpan file object (untuk dikirim ke API)
  const [imageFile, setImageFile] = useState(null);
  const [documentFile, setDocumentFile] = useState(null);
  
  // State untuk mengontrol tampilan list di komponen Upload (PENTING AGAR BISA RESET)
  const [fileListImage, setFileListImage] = useState([]);
  const [fileListDoc, setFileListDoc] = useState([]);

  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editingItem) {
      // MODE EDIT
      form.setFieldsValue({
        name: editingItem.name,
        description: editingItem.description,
      });
      // Tampilkan gambar lama di preview
      if (editingItem.image) {
        setImagePreview(editingItem.image);
      }
      // Kosongkan list upload karena user belum upload file BARU
      setFileListImage([]);
      setFileListDoc([]);
    } else {
      // MODE TAMBAH BARU (RESET TOTAL)
      resetAll();
    }
  }, [editingItem, form]);

  const resetAll = () => {
    form.resetFields();
    setImageFile(null);
    setDocumentFile(null);
    setImagePreview(null);
    setFileListImage([]); // Visual list gambar hilang
    setFileListDoc([]);   // Visual list dokumen hilang
  };

  const handleImageChange = ({ fileList }) => {
    // Ambil file terbaru
    const file = fileList.length > 0 ? fileList[0].originFileObj : null;
    
    // Update state visual & logic
    setFileListImage(fileList); 
    setImageFile(file);

    // Preview Logic
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else if (!file && editingItem?.image) {
      // Jika cancel upload saat edit, kembalikan ke gambar lama
      setImagePreview(editingItem.image);
    } else {
      setImagePreview(null);
    }
  };

  const handleDocumentChange = ({ fileList }) => {
    const file = fileList.length > 0 ? fileList[0].originFileObj : null;
    setFileListDoc(fileList);
    setDocumentFile(file);
    if(file) message.success(`${file.name} dipilih`);
  };

  const handleFinish = async (values) => {
    setLoading(true);
    
    const formData = new FormData();
    formData.append('name', values.name);
    formData.append('description', values.description);
    
    if (imageFile) {
      formData.append('image', imageFile);
    }
    
    if (documentFile) {
      formData.append('document', documentFile);
    }

    try {
      await onSubmit(formData);
      // Jika sukses dan mode tambah baru, reset form
      if (!editingItem) {
        resetAll();
      }
    } catch (error) {
      message.error('Gagal menyimpan item');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#1a1a2e] rounded-2xl p-8 shadow-2xl border border-[#27272a]">
      <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 mb-6">
        {editingItem ? '✏️ Edit Item' : '➕ Tambah Item Baru'}
      </h2>
      
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        className="space-y-4"
      >
        <Form.Item
          label={<span className="text-gray-300 font-semibold">Nama Item</span>}
          name="name"
          rules={[{ required: true, message: 'Nama item wajib diisi!' }]}
        >
          <Input 
            placeholder="Masukkan nama item..." 
            size="large"
            className="rounded-lg"
          />
        </Form.Item>

        <Form.Item
          label={<span className="text-gray-300 font-semibold">Deskripsi</span>}
          name="description"
          rules={[{ required: true, message: 'Deskripsi wajib diisi!' }]}
        >
          <TextArea 
            placeholder="Masukkan deskripsi..." 
            rows={4}
            className="rounded-lg"
          />
        </Form.Item>

        <Form.Item
          label={<span className="text-gray-300 font-semibold">🖼️ Upload Gambar</span>}
        >
          {/* PERBAIKAN: Tambahkan prop fileList={fileListImage} */}
          <Upload
            beforeUpload={() => false}
            onChange={handleImageChange}
            fileList={fileListImage}
            accept="image/*"
            maxCount={1}
            listType="picture"
          >
            <Button 
              icon={<FileImageOutlined />} 
              size="large"
              className="w-full"
            >
              {editingItem ? 'Ganti Gambar' : 'Pilih Gambar'}
            </Button>
          </Upload>
          
          {/* Preview Image */}
          {imagePreview && (
            <div className="mt-4">
              <p className="text-gray-400 mb-2 text-sm">Preview:</p>
              <img 
                src={imagePreview} 
                alt="Preview" 
                className="max-w-full h-auto rounded-lg shadow-lg border-2 border-purple-500"
                style={{ maxHeight: '200px' }}
              />
            </div>
          )}
        </Form.Item>

        <Form.Item
          label={<span className="text-gray-300 font-semibold">📄 Upload Dokumen</span>}
        >
          {/* PERBAIKAN: Tambahkan prop fileList={fileListDoc} */}
          <Upload
            beforeUpload={() => false}
            onChange={handleDocumentChange}
            fileList={fileListDoc}
            maxCount={1}
          >
            <Button 
              icon={<FilePdfOutlined />} 
              size="large"
              className="w-full"
            >
              {editingItem ? 'Ganti Dokumen' : 'Pilih Dokumen'}
            </Button>
          </Upload>
          <p className="text-gray-500 text-sm mt-2">Max size: 10MB</p>
        </Form.Item>

        <Form.Item>
          <Space className="w-full justify-end">
            <Button
              type="primary"
              htmlType="submit"
              icon={<FiSave className="inline" />}
              size="large"
              loading={loading}
              className="bg-gradient-to-r from-purple-600 to-pink-600 border-0 hover:from-purple-700 hover:to-pink-700"
            >
              {editingItem ? 'Update' : 'Tambah'}
            </Button>
            
            {editingItem && (
              <Button
                onClick={() => {
                   resetAll();
                   onCancel();
                }}
                icon={<FiX className="inline" />}
                size="large"
              >
                Batal
              </Button>
            )}
          </Space>
        </Form.Item>
      </Form>
    </div>
  );
}

