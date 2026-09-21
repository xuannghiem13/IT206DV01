'use client';

import React, { useState } from 'react';
import { Invoice, SystemPricing, UserRole } from '@/lib/types';
import { QrCode, CheckCircle2, Copy, X, ShieldCheck, Download, Share2 } from 'lucide-react';

interface VietQRModalProps {
  invoice: Invoice;
  pricing?: SystemPricing;
  userRole?: UserRole;
  onClose: () => void;
  onPaymentSuccess: () => void;
}

export const VietQRModal: React.FC<VietQRModalProps> = ({ 
  invoice, 
  pricing, 
  userRole = 'tenant', 
  onClose, 
  onPaymentSuccess 
}) => {
  const [copied, setCopied] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const bankName = pricing?.bankName || 'MBBank (Ngân hàng Quân Đội)';
  const bankCode = pricing?.bankCode || 'MB';
  const accountNo = pricing?.accountNo || '0909123456';
  const accountName = pricing?.accountName || 'CHU TRO CAN HO DICH VU';
  const remainingAmount = Math.max(0, invoice.totalAmount - invoice.paidAmount);
  const transferContent = `THANHTOAN P${invoice.roomNumber || ''} T${invoice.billingMonth}`;

  // VietQR Dynamic URL
  const qrUrl = `https://img.vietqr.io/image/${bankCode}-${accountNo}-compact2.png?amount=${remainingAmount}&addInfo=${encodeURIComponent(transferContent)}&accountName=${encodeURIComponent(accountName)}`;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleConfirmPayment = async () => {
    setIsProcessing(true);
    try {
      const res = await fetch('/api/invoices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          invoiceId: invoice.invoiceId,
          amount: remainingAmount,
          paymentMethod: 'Chuyển khoản VietQR'
        })
      });
      if (res.ok) {
        onPaymentSuccess();
        onClose();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  const isTenant = userRole === 'tenant';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
      <div className="relative w-full max-w-md rounded-3xl bg-white border border-slate-200 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/80">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                {isTenant ? 'Thanh toán tiền phòng VietQR' : 'Mã VietQR thu tiền của hóa đơn'}
              </h3>
              <p className="text-xs text-slate-500">Mã hóa đơn: {invoice.invoiceCode}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          {/* Bill summary */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-500">Phòng & Khách thuê:</span>
              <span className="font-bold text-slate-900">Phòng {invoice.roomNumber} - {invoice.tenantName}</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-500">Kỳ thanh toán:</span>
              <span className="text-slate-700">Tháng {invoice.billingMonth}/{invoice.billingYear}</span>
            </div>
            <div className="flex justify-between items-center text-xs pt-1 border-t border-slate-200/60">
              <span className="text-slate-500 font-medium">Số tiền {isTenant ? 'cần thanh toán' : 'phải thu'}:</span>
              <span className="text-xl font-black text-emerald-600">
                {remainingAmount.toLocaleString('vi-VN')} đ
              </span>
            </div>
          </div>

          {/* QR Code Container */}
          <div className="flex flex-col items-center justify-center p-3 bg-slate-50 border border-slate-200 rounded-2xl">
            <div className="w-60 h-60 relative flex items-center justify-center bg-white p-2 rounded-xl shadow-xs">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={qrUrl}
                alt="VietQR Payment Code"
                className="w-full h-full object-contain"
                loading="eager"
              />
            </div>
            <p className="text-[11px] font-semibold text-indigo-700 mt-2 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              {isTenant 
                ? 'Mở App ngân hàng của bạn quét mã NAPAS 24/7' 
                : 'Mã QR đã gán sẵn số tiền & nội dung phòng để gửi khách'}
            </p>
          </div>

          {/* Account Details Box */}
          <div className="space-y-1.5 text-xs">
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-slate-500">Ngân hàng:</span>
              <span className="font-semibold text-slate-800">{bankName}</span>
            </div>
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-slate-500">Số tài khoản:</span>
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-slate-900">{accountNo}</span>
                <button
                  onClick={() => handleCopy(accountNo)}
                  className="p-1 text-slate-400 hover:text-indigo-600"
                  title="Sao chép số tài khoản"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-slate-500">Nội dung chuyển:</span>
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-indigo-700">{transferContent}</span>
                <button
                  onClick={() => handleCopy(transferContent)}
                  className="p-1 text-slate-400 hover:text-indigo-600"
                  title="Sao chép nội dung"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {copied && (
            <p className="text-center text-xs text-emerald-600 animate-pulse font-medium">
              ✓ Đã sao chép vào bộ nhớ tạm!
            </p>
          )}

          {/* Action button based on role */}
          {isTenant ? (
            <button
              onClick={handleConfirmPayment}
              disabled={isProcessing}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold flex items-center justify-center gap-2 shadow-md shadow-emerald-600/20 transition cursor-pointer disabled:opacity-50 text-sm"
            >
              <CheckCircle2 className="w-4 h-4" />
              {isProcessing ? 'Đang cập nhật...' : 'Tôi đã chuyển khoản thanh toán xong'}
            </button>
          ) : (
            <button
              onClick={handleConfirmPayment}
              disabled={isProcessing}
              className="w-full py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold flex items-center justify-center gap-2 shadow-md shadow-indigo-600/20 transition cursor-pointer disabled:opacity-50 text-sm"
            >
              <CheckCircle2 className="w-4 h-4" />
              {isProcessing ? 'Đang xử lý...' : 'Xác nhận Đã Nhận Chuyển Khoản'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
