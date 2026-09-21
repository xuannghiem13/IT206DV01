'use client';

import React, { useState } from 'react';
import { Room } from '@/lib/types';
import { X, Wrench, AlertTriangle, Send } from 'lucide-react';

interface ReportIssueModalProps {
  rooms: Room[];
  onClose: () => void;
  onSuccess: () => void;
  defaultRoomNumber?: string;
  defaultTenantName?: string;
}

export const ReportIssueModal: React.FC<ReportIssueModalProps> = ({
  rooms,
  onClose,
  onSuccess,
  defaultRoomNumber,
  defaultTenantName
}) => {
  const defaultRoom = defaultRoomNumber ? rooms.find(r => r.roomNumber === defaultRoomNumber) : rooms[0];
  const [selectedRoomId, setSelectedRoomId] = useState<number>(defaultRoom?.roomId || 1);
  const [tenantName, setTenantName] = useState(defaultTenantName || 'Nguyễn Hoàng Anh');
  const [category, setCategory] = useState<'Điện' | 'Nước' | 'Điều hòa' | 'Thiết bị gia dụng' | 'Khác'>('Điều hòa');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<'Khẩn cấp' | 'Cao' | 'Bình thường' | 'Thấp'>('Bình thường');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const room = rooms.find(r => r.roomId === Number(selectedRoomId));
      const res = await fetch('/api/maintenance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roomId: Number(selectedRoomId),
          roomNumber: room?.roomNumber || '101',
          tenantId: 1,
          tenantName,
          category,
          title,
          description,
          priority,
          status: 'Chờ tiếp nhận'
        })
      });
      if (res.ok) {
        onSuccess();
        onClose();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg rounded-3xl bg-white border border-slate-200 shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/80">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-amber-100 text-amber-700">
              <Wrench className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900">Báo Cáo Sự Cố / Yêu Cầu Sửa Chữa</h3>
              <p className="text-xs text-slate-500">Chuyển trực tiếp đến Quản lý và Kỹ thuật viên</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Căn hộ / Phòng</label>
              <select
                value={selectedRoomId}
                onChange={e => setSelectedRoomId(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:bg-white focus:border-indigo-500 focus:outline-none transition-colors"
              >
                {rooms.map(room => (
                  <option key={room.roomId} value={room.roomId}>
                    Phòng {room.roomNumber} ({room.roomType})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Người báo sự cố</label>
              <input
                type="text"
                required
                value={tenantName}
                onChange={e => setTenantName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:bg-white focus:border-indigo-500 focus:outline-none transition-colors"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Phân loại sự cố</label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:bg-white focus:border-indigo-500 focus:outline-none transition-colors"
              >
                <option value="Điều hòa">Điều hòa / Máy lạnh</option>
                <option value="Điện">Hệ thống điện / Đèn / Ổ cắm</option>
                <option value="Nước">Đường nước / Vòi sen / Bồn cầu</option>
                <option value="Thiết bị gia dụng">Tủ lạnh / Máy giặt / Bếp</option>
                <option value="Khác">Cửa / Khóa / Thấm dột / Khác</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Mức độ ưu tiên</label>
              <select
                value={priority}
                onChange={e => setPriority(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:bg-white focus:border-indigo-500 focus:outline-none transition-colors"
              >
                <option value="Bình thường">Bình thường</option>
                <option value="Cao">Cao</option>
                <option value="Khẩn cấp">Khẩn cấp (Cháy/Chập/Tràn nước)</option>
                <option value="Thấp">Thấp / Kiểm tra định kỳ</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Tiêu đề sự cố</label>
            <input
              type="text"
              required
              placeholder="VD: Máy nước nóng bị mất nguồn, không sáng đèn"
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:bg-white focus:border-indigo-500 focus:outline-none transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Mô tả chi tiết</label>
            <textarea
              rows={3}
              required
              placeholder="Mô tả hiện tượng, vị trí, thời điểm bắt đầu xảy ra sự cố..."
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:bg-white focus:border-indigo-500 focus:outline-none transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-bold flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-amber-600/20 disabled:opacity-50 transition-all"
          >
            <Send className="w-5 h-5" />
            {isSubmitting ? 'Đang gửi...' : 'Gửi Yêu Cầu Sửa Chữa'}
          </button>
        </form>
      </div>
    </div>
  );
};
