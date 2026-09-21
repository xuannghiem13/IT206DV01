'use client';

import React, { useState } from 'react';
import { Room, SystemPricing } from '@/lib/types';
import { X, Zap, Droplets, CheckCircle2, Calculator } from 'lucide-react';

interface RecordUtilityModalProps {
  rooms: Room[];
  pricing?: SystemPricing;
  onClose: () => void;
  onSuccess: () => void;
}

export const RecordUtilityModal: React.FC<RecordUtilityModalProps> = ({ rooms, pricing, onClose, onSuccess }) => {
  const occupiedRooms = rooms.filter(r => r.status === 'Đang thuê');
  const [selectedRoomId, setSelectedRoomId] = useState<number>(occupiedRooms[0]?.roomId || 1);
  const [readingMonth, setReadingMonth] = useState(new Date().getMonth() + 1);
  const [readingYear, setReadingYear] = useState(new Date().getFullYear());

  const [prevElectric, setPrevElectric] = useState(1375);
  const [currElectric, setCurrElectric] = useState(1510);
  const [prevWater, setPrevWater] = useState(52);
  const [currWater, setCurrWater] = useState(61);
  const [recordedBy, setRecordedBy] = useState('Trần Văn Hoàng (Quản lý)');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const electricUsage = Math.max(0, currElectric - prevElectric);
  const waterUsage = Math.max(0, currWater - prevWater);

  const electricPrice = pricing?.electricPrice || 3500;
  const waterPrice = pricing?.waterPrice || 25000;
  const serviceFee = (pricing?.internetFee || 100000) + (pricing?.cleaningFee || 50000);

  const electricTotal = electricUsage * electricPrice;
  const waterTotal = waterUsage * waterPrice;
  const grandTotal = electricTotal + waterTotal + serviceFee;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const selectedRoom = rooms.find(r => r.roomId === Number(selectedRoomId));
      const res = await fetch('/api/utilities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roomId: Number(selectedRoomId),
          roomNumber: selectedRoom?.roomNumber || '101',
          readingMonth: Number(readingMonth),
          readingYear: Number(readingYear),
          prevElectric: Number(prevElectric),
          currElectric: Number(currElectric),
          prevWater: Number(prevWater),
          currWater: Number(currWater),
          recordedBy
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
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900">Chốt Chỉ Số Điện & Nước</h3>
              <p className="text-xs text-slate-500">Tự động tính mức tiêu thụ và lập hóa đơn tiền phòng</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-1">
              <label className="block text-xs font-semibold text-slate-700 mb-1">Phòng chốt số</label>
              <select
                value={selectedRoomId}
                onChange={e => setSelectedRoomId(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:bg-white focus:border-indigo-500 focus:outline-none transition-colors"
              >
                {rooms.map(room => (
                  <option key={room.roomId} value={room.roomId}>
                    P.{room.roomNumber} ({room.status})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Tháng</label>
              <input
                type="number"
                min="1"
                max="12"
                value={readingMonth}
                onChange={e => setReadingMonth(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:bg-white focus:border-indigo-500 focus:outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Năm</label>
              <input
                type="number"
                value={readingYear}
                onChange={e => setReadingYear(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:bg-white focus:border-indigo-500 focus:outline-none transition-colors"
              />
            </div>
          </div>

          {/* Điện */}
          <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200/80 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-amber-900">
              <span className="flex items-center gap-1.5"><Zap className="w-4 h-4 text-amber-600" /> Chỉ số ĐIỆN (kWh)</span>
              <span className="text-amber-700">Đơn giá: {electricPrice.toLocaleString()} đ/kWh</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-0.5">Số cũ (đầu kỳ)</label>
                <input
                  type="number"
                  value={prevElectric}
                  onChange={e => setPrevElectric(Number(e.target.value))}
                  className="w-full px-3 py-1.5 rounded-xl bg-white border border-amber-200 text-slate-900 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-0.5">Số mới (hiện tại)</label>
                <input
                  type="number"
                  value={currElectric}
                  onChange={e => setCurrElectric(Number(e.target.value))}
                  className="w-full px-3 py-1.5 rounded-xl bg-white border border-amber-200 text-slate-900 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>
            </div>
            <p className="text-xs text-amber-900 font-medium">
              Tiêu thụ: <strong className="text-amber-700">{electricUsage} kWh</strong> → Thành tiền: <strong className="text-amber-800">{electricTotal.toLocaleString()} đ</strong>
            </p>
          </div>

          {/* Nước */}
          <div className="p-3.5 rounded-2xl bg-cyan-50/70 border border-cyan-200/80 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-cyan-900">
              <span className="flex items-center gap-1.5"><Droplets className="w-4 h-4 text-cyan-600" /> Chỉ số NƯỚC (m³)</span>
              <span className="text-cyan-700">Đơn giá: {waterPrice.toLocaleString()} đ/m³</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-0.5">Số cũ (đầu kỳ)</label>
                <input
                  type="number"
                  value={prevWater}
                  onChange={e => setPrevWater(Number(e.target.value))}
                  className="w-full px-3 py-1.5 rounded-xl bg-white border border-cyan-200 text-slate-900 text-sm focus:outline-none focus:ring-1 focus:ring-cyan-500"
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-0.5">Số mới (hiện tại)</label>
                <input
                  type="number"
                  value={currWater}
                  onChange={e => setCurrWater(Number(e.target.value))}
                  className="w-full px-3 py-1.5 rounded-xl bg-white border border-cyan-200 text-slate-900 text-sm focus:outline-none focus:ring-1 focus:ring-cyan-500"
                />
              </div>
            </div>
            <p className="text-xs text-cyan-900 font-medium">
              Tiêu thụ: <strong className="text-cyan-700">{waterUsage} m³</strong> → Thành tiền: <strong className="text-cyan-800">{waterTotal.toLocaleString()} đ</strong>
            </p>
          </div>

          {/* Người ghi nhận */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Nhân viên chốt số</label>
            <input
              type="text"
              value={recordedBy}
              onChange={e => setRecordedBy(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:bg-white focus:border-indigo-500 focus:outline-none transition-colors"
            />
          </div>

          {/* Tóm tắt tiền dịch vụ */}
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex justify-between items-center text-xs">
            <span className="text-slate-600 flex items-center gap-1 font-medium">
              <Calculator className="w-3.5 h-3.5 text-indigo-500" />
              Tổng điện + nước + internet/vệ sinh:
            </span>
            <span className="text-sm font-bold text-emerald-600">{grandTotal.toLocaleString()} đ</span>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-bold flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-amber-600/20 disabled:opacity-50 transition-all"
          >
            <CheckCircle2 className="w-5 h-5" />
            {isSubmitting ? 'Đang lưu chỉ số...' : 'Lưu chỉ số & Tạo hóa đơn'}
          </button>
        </form>
      </div>
    </div>
  );
};
