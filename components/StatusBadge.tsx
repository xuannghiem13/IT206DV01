import React from 'react';

interface StatusBadgeProps {
  status: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  let style = 'bg-slate-100 text-slate-700 border-slate-200';
  let dot = 'bg-slate-400';

  switch (status) {
    case 'Trống':
      style = 'bg-emerald-50 text-emerald-700 border-emerald-200';
      dot = 'bg-emerald-500 animate-pulse';
      break;
    case 'Đang thuê':
      style = 'bg-blue-50 text-blue-700 border-blue-200';
      dot = 'bg-blue-500';
      break;
    case 'Đang sửa chữa':
    case 'Chờ tiếp nhận':
      style = 'bg-amber-50 text-amber-700 border-amber-200';
      dot = 'bg-amber-500';
      break;
    case 'Đã thanh toán':
    case 'Hoàn thành':
    case 'Đúng giờ':
    case 'Còn hiệu lực':
      style = 'bg-emerald-50 text-emerald-700 border-emerald-200';
      dot = 'bg-emerald-500';
      break;
    case 'Chưa thanh toán':
    case 'Đã phân công':
    case 'Sắp hết hạn':
      style = 'bg-amber-50 text-amber-700 border-amber-200';
      dot = 'bg-amber-500';
      break;
    case 'Quá hạn':
    case 'Khẩn cấp':
    case 'Đi trễ':
      style = 'bg-rose-50 text-rose-700 border-rose-200';
      dot = 'bg-rose-500 animate-ping';
      break;
    case 'Thanh toán một phần':
    case 'Đang xử lý':
      style = 'bg-indigo-50 text-indigo-700 border-indigo-200';
      dot = 'bg-indigo-500';
      break;
  }

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${style}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dot}`}></span>
      {status}
    </span>
  );
};
