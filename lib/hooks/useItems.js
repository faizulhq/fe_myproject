import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as itemAPI from '@/lib/api/items';
import { message } from 'antd';

// Hook GET Items dengan parameter dinamis
export const useItems = (params) => {
  return useQuery({
    // queryKey unik berdasarkan params, jadi auto-refetch saat page/search berubah
    queryKey: ['items', params], 
    queryFn: () => itemAPI.getItems(params),
    // Menjaga data lama tetap tampil saat loading data baru (UX lebih mulus)
    keepPreviousData: true, 
  });
};

export const useCreateItem = (onSuccess) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: itemAPI.createItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['items'] });
      message.success('Item berhasil dibuat');
      if (onSuccess) onSuccess();
    },
    onError: () => message.error('Gagal membuat item'),
  });
};

export const useUpdateItem = (onSuccess) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: itemAPI.updateItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['items'] });
      message.success('Item berhasil diupdate');
      if (onSuccess) onSuccess();
    },
    onError: () => message.error('Gagal update item'),
  });
};

export const useDeleteItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: itemAPI.deleteItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['items'] });
      message.success('Item berhasil dihapus');
    },
    onError: () => message.error('Gagal menghapus item'),
  });
};