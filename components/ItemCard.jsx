'use client';

import { Card, Button, Space, Tag, Popconfirm } from 'antd';
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
        item.image ? (
          <div className="relative overflow-hidden h-64 cursor-pointer" onClick={() => window.open(item.image, '_blank')}>
            <img
              src={item.image} 
              alt={item.name}
              className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500"
              onError={(e) => {
                console.error('Image load error:', item.image);
                e.target.style.display = 'none';
                e.target.parentElement.innerHTML = '<div class="h-64 bg-gradient-to-br from-purple-900/30 to-pink-900/30 flex items-center justify-center"><svg class="w-16 h-16 text-purple-400/50" fill="currentColor" viewBox="0 0 20 20"><path d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"/></svg></div>';
              }}
            />
            {/* Overlay on hover */}
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <span className="text-white text-lg font-semibold">🔍 Klik untuk Lihat</span>
            </div>
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

        {item.document && (
          <a
            href={item.document}
            target="_blank"
            rel="noopener noreferrer"
            download
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