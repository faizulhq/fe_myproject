'use client';
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeftOutlined,
  DeleteOutlined,
  PlusOutlined,
  LinkOutlined,
  SaveOutlined
} from "@ant-design/icons";
import {
  Card,
  Typography,
  Spin,
  message,
  Upload,
  Input,
  Button,
  Popconfirm,
  Avatar,
  Space
} from "antd";
import axiosClient from "@/lib/api/axiosClient";
import useAuthStore from "@/lib/store/authStore";

const { Title, Text } = Typography;

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [website, setWebsite] = useState("");
  const [imageUrl, setImageUrl] = useState(null);

  const router = useRouter();
  const { user } = useAuthStore();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axiosClient.get("/auth/profiles/");
        
        let data = null;
        if (Array.isArray(res.data) && res.data.length > 0) {
            data = res.data[0];
        } else if (!Array.isArray(res.data)) {
            data = res.data;
        }

        if (data) {
            setProfile(data);
            setWebsite(data?.website || "");
            setImageUrl(data.avatar); 
        }
      } catch (error) {
        // Silent error agar tidak mengganggu UX jika belum ada profil
        console.error("Fetch Profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const beforeUpload = (file) => {
    const isImage = file.type.startsWith("image/");
    if (!isImage) {
      message.error("File harus berupa gambar!");
      return Upload.LIST_IGNORE;
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error("Ukuran gambar harus kurang dari 2MB!");
      return Upload.LIST_IGNORE;
    }
    return true;
  };

  const handleUpload = async ({ file }) => {
    if (!profile?.id) {
        // Refresh otomatis jika ID profil hilang (sinkronisasi data)
        window.location.reload();
        return;
    }

    const formData = new FormData();
    formData.append("avatar", file);

    try {
      setUploading(true);
      
      // PERBAIKAN DI SINI:
      // Hapus headers manual 'Content-Type'. Biarkan Axios menanganinya.
      const res = await axiosClient.patch(`/auth/profiles/${profile.id}/`, formData);

      message.success("Foto profil berhasil diperbarui!");
      const data = res.data;
      setImageUrl(data.avatar);
      
      // Refresh halaman agar avatar di Navbar ikut berubah
      window.location.reload(); 
    } catch (error) {
      console.error(error);
      message.error("Gagal memperbarui foto profil");
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteAvatar = async () => {
    if (!profile?.id) return;
    try {
      setUploading(true);
      await axiosClient.patch(`/auth/profiles/${profile.id}/`, { avatar: null });
      setImageUrl(null);
      message.success("Foto profil berhasil dihapus!");
      window.location.reload();
    } catch {
      message.error("Gagal menghapus foto profil");
    } finally {
      setUploading(false);
    }
  };

  const handleUpdateWebsite = async () => {
    if (!profile?.id) return;
    try {
      await axiosClient.patch(`/auth/profiles/${profile.id}/`, { website });
      message.success("Link sosial berhasil diperbarui!");
    } catch {
      message.error("Gagal memperbarui link sosial");
    }
  };

  const uploadButton = (
    <div style={{ color: "#fff" }}>
      {uploading ? <Spin size="small" /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-black">
        <Spin size="large" tip="Memuat profil...">
            <div className="p-10" /> 
        </Spin>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex justify-center pt-20">
      <Card
        variant="borderless"
        style={{
          width: 400,
          textAlign: "center",
          backgroundColor: "#111",
          color: "white",
          border: "1px solid #333",
        }}
        loading={uploading && !imageUrl}
      >
        <div className="relative inline-block mb-4">
          <Upload
            name="avatar"
            listType="picture-circle"
            className="avatar-uploader"
            showUploadList={false}
            customRequest={handleUpload}
            beforeUpload={beforeUpload}
          >
            {imageUrl ? (
              <Avatar 
                src={imageUrl} 
                size={100} 
                style={{ border: '2px solid #333' }}
              />
            ) : (
              uploadButton
            )}
          </Upload>

          {imageUrl && (
            <Popconfirm
              title="Hapus Foto Profil?"
              description="Foto akan dihapus permanen."
              okText="Ya"
              cancelText="Batal"
              onConfirm={handleDeleteAvatar}
            >
              <Button
                shape="circle"
                danger
                icon={<DeleteOutlined />}
                size="small"
                style={{ position: "absolute", top: 0, right: 0 }}
              />
            </Popconfirm>
          )}
        </div>

        <Title level={4} style={{ margin: 0, color: "white" }}>
          {user?.username || "..."}
        </Title>
        <Text style={{ display: "block", marginBottom: 20, color: "#888" }}>
          {user?.is_staff || user?.role === 'admin' ? "ADMINISTRATOR" : "USER"}
        </Text>

        <Space.Compact style={{ width: '100%' }}>
            <Input
              prefix={<LinkOutlined style={{ color: "#888" }} />}
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              placeholder="Link website/sosmed..."
              onPressEnter={handleUpdateWebsite}
              style={{ backgroundColor: "#1a1a1a", border: "1px solid #333", color: "white" }}
            />
            <Button type="primary" onClick={handleUpdateWebsite} icon={<SaveOutlined />}>
                Simpan
            </Button>
        </Space.Compact>

        {website && (
          <a
            href={website}
            target="_blank"
            rel="noopener noreferrer"
            style={{ display: "block", marginTop: "1rem", color: "#1890ff" }}
          >
            {website}
          </a>
        )}

        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => router.push("/")}
          style={{ marginTop: "1.5rem", width: '100%' }}
        >
          Kembali ke Dashboard
        </Button>
      </Card>
    </div>
  );
}