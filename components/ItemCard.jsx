'use client';

import { Card, Button, Space, Image, Tag, Popconfirm } from 'antd';
import { 
  EditOutlined, 
  DeleteOutlined, 
  FileOutlined,
  CalendarOutlined 
} from '@ant-design/icons';
import { FiEdit2, FiTrash2, FiFile } from 'react-icons/fi';

export default function ItemCard({ item, onEdit, onDelete }) {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <Card
      hoverable
      className="bg-[#1a1a2e] border-[#27272a] overflow-hidden group"
      cover={
        item.image_url ? (
          <div className="relative overflow-hidden h-64">
            <Image
              src={item.image_url}
              alt={item.name}
              className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500"
              preview={{
                mask: <div className="text-white">🔍 Lihat</div>
              }}
            />
          </div>
        ) : (
          <div className="h-64 bg-gradient-to-br from-purple-900/30 to-pink-900/30 flex items-center justify-center">
            <FileOutlined className="text-6xl text-purple-400/50" />
          </div>
        )
      }
    >
      <div className="space-y-4">
        <div>
          <h3 className="text-xl font-bold text-white mb-2 line-clamp-1">
            {item.name}
          </h3>
          <p className="text-gray-400 line-clamp-3 leading-relaxed">
            {item.description}
          </p>
        </div>

        {item.document_url && (
          <a
            href={item.document_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg hover:bg-blue-500/20 transition-colors"
          >
            <FiFile className="text-blue-400" />
            <span className="text-blue-400 font-semibold">Lihat Dokumen</span>
          </a>
        )}

        <div className="flex items-center justify-between pt-4 border-t border-[#27272a]">
          <div className="flex items-center gap-2 text-gray-500 text-sm">
            <CalendarOutlined />
            <span>{formatDate(item.created_at)}</span>
          </div>
          <Tag color="purple">ID: {item.id}</Tag>
        </div>

        <Space className="w-full justify-between">
          <Button
            type="primary"
            icon={<FiEdit2 className="inline" />}
            onClick={() => onEdit(item)}
            className="bg-green-600 hover:bg-green-700 border-0"
          >
            Edit
          </Button>
          
          <Popconfirm
            title="Hapus Item"
            description="Yakin ingin menghapus item ini?"
            onConfirm={() => onDelete(item.id)}
            okText="Ya, Hapus"
            cancelText="Batal"
            okButtonProps={{ danger: true }}
          >
            <Button
              danger
              icon={<FiTrash2 className="inline" />}
            >
              Hapus
            </Button>
          </Popconfirm>
        </Space>
      </div>
    </Card>
  );
}