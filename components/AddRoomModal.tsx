'use client';

import React, { useState } from 'react';
import { X, Plus, Building } from 'lucide-react';

interface AddRoomModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

export const AddRoomModal: React.FC<AddRoomModalProps> = ({ onClose, onSuccess }) => {
  const [roomNumber, setRoomNumber] = useState('');
  const [floor, setFloor] = useState('1');
  const [roomType, setRoomType] = useState('Studio');
  const [areaSqM, setAreaSqM] = useState('28');
  const [basePrice, setBasePrice] = useState('5500000');
  const [amenities, setAmenities] = useState('Điều hòa Inverter, Tủ lạnh, Giường nệm, Nóng lạnh, Tủ bếp');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/rooms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          buildingId: 1,
          buildingName: 'Sunrise Building (Q1)',
          roomNumber,
          floor: Number(floor),
          roomType,
          areaSqM: Number(areaSqM),
          basePrice: Number(basePrice),
          status: 'Trống',
          amenities
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
      <div className="relative w-full max-w-md rounded-3xl bg-white border border-slate-200 shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/80">
          <div className="flex items-center gap-2">
            <Building className="w-5 h-5 text-indigo-600" />
            <h3 className="font-bold text-slate-900">Thêm Căn hộ / Phòng mới</h3>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Số phòng</label>
              <input
                type="text"
                required
                placeholder="VD: 303"
                value={roomNumber}
                onChange={e => setRoomNumber(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-sm focus:bg-white focus:border-indigo-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Tầng</label>
              <input
                type="number"
                required
                min="1"
                value={floor}
                onChange={e => setFloor(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-sm focus:bg-white focus:border-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Loại phòng</label>
              <select
                value={roomType}
                onChange={e => setRoomType(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-sm focus:bg-white focus:border-indigo-500 focus:outline-none"
              >
                <option value="Studio">Studio</option>
                <option value="1 Phòng ngủ">1 Phòng ngủ</option>
                <option value="2 Phòng ngủ">2 Phòng ngủ</option>
                <option value="Duplex gác lửng">Duplex gác lửng</option>
                <option value="Penthouse">Penthouse</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Diện tích (m²)</label>
              <input
                type="number"
                required
                value={areaSqM}
                onChange={e => setAreaSqM(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-sm focus:bg-white focus:border-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Giá thuê cơ bản (VNĐ/tháng)</label>
            <input
              type="number"
              required
              step="100000"
              value={basePrice}
              onChange={e => setBasePrice(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-sm focus:bg-white focus:border-indigo-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Trang thiết bị & Tiện nghi</label>
            <textarea
              rows={3}
              value={amenities}
              onChange={e => setAmenities(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-sm focus:bg-white focus:border-indigo-500 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-indigo-600/20 disabled:opacity-50 text-sm"
          >
            <Plus className="w-4 h-4" />
            {isSubmitting ? 'Đang thêm...' : 'Tạo phòng mới'}
          </button>
        </form>
      </div>
    </div>
  );
};
