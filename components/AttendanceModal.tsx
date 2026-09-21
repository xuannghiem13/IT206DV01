'use client';

import React, { useState } from 'react';
import { Employee } from '@/lib/types';
import { X, UserCheck, Clock, CheckCircle2 } from 'lucide-react';

interface AttendanceModalProps {
  employees: Employee[];
  onClose: () => void;
  onSuccess: () => void;
}

export const AttendanceModal: React.FC<AttendanceModalProps> = ({ employees, onClose, onSuccess }) => {
  const [employeeId, setEmployeeId] = useState<number>(employees[0]?.employeeId || 1);
  const [shift, setShift] = useState('Ca sáng (8h-17h)');
  const [notes, setNotes] = useState('Check-in tại bàn lễ tân / điểm danh ca');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/attendance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          employeeId: Number(employeeId),
          shift,
          notes
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
      <div className="relative w-full max-w-md rounded-3xl bg-white border border-slate-200 shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/80">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-purple-100 text-purple-700">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900">Chấm Công / Điểm Danh Ca</h3>
              <p className="text-xs text-slate-500">Ghi nhận giờ vào làm và trạng thái công tác</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Chọn nhân viên</label>
            <select
              value={employeeId}
              onChange={e => setEmployeeId(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:bg-white focus:border-purple-500 focus:outline-none transition-colors"
            >
              {employees.map(emp => (
                <option key={emp.employeeId} value={emp.employeeId}>
                  {emp.fullName} ({emp.position} - {emp.departmentName})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Ca trực / Ca làm việc</label>
            <select
              value={shift}
              onChange={e => setShift(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:bg-white focus:border-purple-500 focus:outline-none transition-colors"
            >
              <option value="Ca sáng (8h-17h)">Ca sáng (8h-17h)</option>
              <option value="Ca chiều (13h-21h)">Ca chiều (13h-21h)</option>
              <option value="Ca đêm trực kỹ thuật (21h-7h)">Ca đêm trực kỹ thuật (21h-7h)</option>
              <option value="Hành chính (8h30-17h30)">Hành chính (8h30-17h30)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Ghi chú công việc / Phân công</label>
            <input
              type="text"
              value={notes}
              onChange={e => setNotes(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:bg-white focus:border-purple-500 focus:outline-none transition-colors"
            />
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-2 text-xs text-slate-600">
            <Clock className="w-4 h-4 text-purple-600" />
            <span>Thời gian ghi nhận: <strong className="text-slate-900">{new Date().toLocaleTimeString('vi-VN')} hôm nay</strong></span>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-purple-600/20 disabled:opacity-50 transition-all"
          >
            <CheckCircle2 className="w-5 h-5" />
            {isSubmitting ? 'Đang chấm công...' : 'Xác nhận Điểm Danh'}
          </button>
        </form>
      </div>
    </div>
  );
};
