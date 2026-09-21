'use client';

import React, { useState } from 'react';
import { SystemPricing } from '@/lib/types';
import { X, Settings, Zap, Droplets, Wifi, Trash2, CreditCard, Save, CheckCircle2 } from 'lucide-react';

interface PricingSettingsModalProps {
  currentPricing: SystemPricing;
  onClose: () => void;
  onSuccess: (newPricing: SystemPricing) => void;
}

export const PricingSettingsModal: React.FC<PricingSettingsModalProps> = ({
  currentPricing,
  onClose,
  onSuccess
}) => {
  const [electricPrice, setElectricPrice] = useState(currentPricing.electricPrice.toString());
  const [waterPrice, setWaterPrice] = useState(currentPricing.waterPrice.toString());
  const [internetFee, setInternetFee] = useState(currentPricing.internetFee.toString());
  const [cleaningFee, setCleaningFee] = useState(currentPricing.cleaningFee.toString());

  const [bankCode, setBankCode] = useState(currentPricing.bankCode);
  const [bankName, setBankName] = useState(currentPricing.bankName);
  const [accountNo, setAccountNo] = useState(currentPricing.accountNo);
  const [accountName, setAccountName] = useState(currentPricing.accountName);

  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload: SystemPricing = {
        electricPrice: Number(electricPrice),
        waterPrice: Number(waterPrice),
        internetFee: Number(internetFee),
        cleaningFee: Number(cleaningFee),
        bankCode,
        bankName,
        accountNo,
        accountName
      };

      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        const updated = await res.json();
        setSuccessMsg(true);
        setTimeout(() => {
          onSuccess(updated);
          onClose();
        }, 1000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
      <div className="relative w-full max-w-lg rounded-3xl bg-white border border-slate-200 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/80">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">Thiết Lập Biểu Giá & Thanh Toán</h3>
              <p className="text-xs text-slate-500">Chức năng dành riêng cho Chủ trọ quản lý tổng hợp</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Form */}
        <form onSubmit={handleSave} className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          {successMsg && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 animate-bounce">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Đã lưu thành công biểu giá và cấu hình thanh toán mới!</span>
            </div>
          )}

          {/* Biểu giá điện nước dịch vụ */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              1. Biểu giá điện, nước & dịch vụ
            </h4>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                  <Zap className="w-3.5 h-3.5 text-amber-500" /> Giá Điện (đ/kWh)
                </label>
                <input
                  type="number"
                  required
                  step="100"
                  value={electricPrice}
                  onChange={(e) => setElectricPrice(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-amber-700 font-bold text-sm focus:bg-white focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                  <Droplets className="w-3.5 h-3.5 text-cyan-500" /> Giá Nước (đ/m³)
                </label>
                <input
                  type="number"
                  required
                  step="1000"
                  value={waterPrice}
                  onChange={(e) => setWaterPrice(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-cyan-700 font-bold text-sm focus:bg-white focus:border-cyan-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                  <Wifi className="w-3.5 h-3.5 text-indigo-500" /> Internet (đ/tháng)
                </label>
                <input
                  type="number"
                  required
                  step="10000"
                  value={internetFee}
                  onChange={(e) => setInternetFee(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-sm focus:bg-white focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                  <Trash2 className="w-3.5 h-3.5 text-slate-400" /> Rác & Vệ sinh (đ/tháng)
                </label>
                <input
                  type="number"
                  required
                  step="5000"
                  value={cleaningFee}
                  onChange={(e) => setCleaningFee(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-sm focus:bg-white focus:border-indigo-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Cấu hình ngân hàng VietQR */}
          <div className="space-y-3 pt-3 border-t border-slate-100">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
              <CreditCard className="w-3.5 h-3.5 text-emerald-600" />
              2. Tài khoản thụ hưởng VietQR (Khách chuyển khoản)
            </h4>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Mã ngân hàng (NAPAS)</label>
                <select
                  value={bankCode}
                  onChange={(e) => {
                    setBankCode(e.target.value);
                    if (e.target.value === 'MB') setBankName('MBBank (Quân Đội)');
                    else if (e.target.value === 'VCB') setBankName('Vietcombank');
                    else if (e.target.value === 'TCB') setBankName('Techcombank');
                    else if (e.target.value === 'ACB') setBankName('ACB');
                  }}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-sm focus:bg-white focus:border-indigo-500 focus:outline-none"
                >
                  <option value="MB">MB (MBBank)</option>
                  <option value="VCB">VCB (Vietcombank)</option>
                  <option value="TCB">TCB (Techcombank)</option>
                  <option value="ACB">ACB (Á Châu)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Số tài khoản nhận tiền</label>
                <input
                  type="text"
                  required
                  value={accountNo}
                  onChange={(e) => setAccountNo(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 font-mono font-bold text-sm focus:bg-white focus:border-indigo-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Tên chủ tài khoản</label>
              <input
                type="text"
                required
                value={accountName}
                onChange={(e) => setAccountName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 uppercase font-semibold text-sm focus:bg-white focus:border-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={saving}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md shadow-indigo-600/20 transition cursor-pointer disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Đang lưu...' : 'Lưu Thay Đổi Biểu Giá & VietQR'}
          </button>
        </form>
      </div>
    </div>
  );
};
