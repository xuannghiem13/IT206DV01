'use client';

import React, { useState } from 'react';
import { MaintenanceRequest } from '@/lib/types';
import { X, CheckCircle2, Wrench, DollarSign } from 'lucide-react';

interface FixIssueModalProps {
  request: MaintenanceRequest;
  onClose: () => void;
  onSuccess: () => void;
}

export const FixIssueModal: React.FC<FixIssueModalProps> = ({ request, onClose, onSuccess }) => {
  const [technicianName, setTechnicianName] = useState('Nguyễn Tuấn Kiệt (Kỹ thuật viên)');
  const [status, setStatus] = useState<MaintenanceRequest['status']>('Hoàn thành');
  const [actionTaken, setActionTaken] = useState('');
  const [materialsUsed, setMaterialsUsed] = useState('');
  const [repairCost, setRepairCost] = useState('0');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/maintenance', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          requestId: request.requestId,
          status,
          assignedTechnicianName: technicianName,
          actionTaken,
          materialsUsed,
          repairCost: Number(repairCost)
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
            <div className="p-2 rounded-xl bg-teal-100 text-teal-700">
              <Wrench className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900">Nghiệm Thu & Cập Nhật Sửa Chữa</h3>
              <p className="text-xs text-slate-500">{request.requestCode} - Phòng {request.roomNumber}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
            <p className="text-xs text-slate-600">Tiêu đề: <span className="font-semibold text-slate-900">{request.title}</span></p>
            <p className="text-xs text-slate-500">Mô tả: <span className="text-slate-700">{request.description}</span></p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Kỹ thuật viên</label>
              <input
                type="text"
                value={technicianName}
                onChange={e => setTechnicianName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:bg-white focus:border-indigo-500 focus:outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Trạng thái xử lý</label>
              <select
                value={status}
                onChange={e => setStatus(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:bg-white focus:border-indigo-500 focus:outline-none transition-colors"
              >
                <option value="Đang xử lý">Đang xử lý</option>
                <option value="Hoàn thành">Hoàn thành (Đã sửa xong)</option>
                <option value="Đã phân công">Chờ phụ tùng / Chờ linh kiện</option>
                <option value="Hủy">Hủy yêu cầu</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Kết quả & Biện pháp khắc phục</label>
            <textarea
              rows={2}
              required
              placeholder="VD: Đã thay tụ kích điều hòa, vệ sinh lưới lọc và nạp gas bổ sung..."
              value={actionTaken}
              onChange={e => setActionTaken(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:bg-white focus:border-indigo-500 focus:outline-none transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Vật tư & Linh kiện thay thế (nếu có)</label>
            <input
              type="text"
              placeholder="VD: 1 tụ đề 35uF, 2m ống đồng"
              value={materialsUsed}
              onChange={e => setMaterialsUsed(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:bg-white focus:border-indigo-500 focus:outline-none transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Chi phí sửa chữa (VNĐ)</label>
            <div className="relative">
              <input
                type="number"
                step="10000"
                value={repairCost}
                onChange={e => setRepairCost(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm font-bold text-emerald-600 focus:bg-white focus:border-emerald-500 focus:outline-none transition-colors"
              />
              <DollarSign className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            </div>
            <p className="text-[11px] text-slate-500 mt-1">Chi phí này sẽ được ghi nhận vào báo cáo tài chính của Kế toán.</p>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white font-bold flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-teal-600/20 disabled:opacity-50 transition-all"
          >
            <CheckCircle2 className="w-5 h-5" />
            {isSubmitting ? 'Đang lưu...' : 'Lưu Nghiệm Thu Kỹ Thuật'}
          </button>
        </form>
      </div>
    </div>
  );
};
