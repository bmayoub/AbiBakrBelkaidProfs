import React, { useState } from 'react';
import { User, Shield, KeyRound, Lock, ArrowLeft, CheckCircle2 } from 'lucide-react';

export default function RoleSelectModal({
  teachers = [],
  onSelectTeacher,
  isOpen,
  onClose
}) {
  const [selectedTeacherId, setSelectedTeacherId] = useState('');
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const selectedTeacher = teachers.find((t) => t.id === selectedTeacherId);

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    if (!selectedTeacherId) {
      setError('الرجاء اختيار الأستاذ من القائمة المنسدلة');
      return;
    }
    if (!pin) {
      setError('الرجاء إدخال كلمة المرور');
      return;
    }

    setLoading(true);
    setError('');

    onSelectTeacher(selectedTeacherId, pin, (err) => {
      setLoading(false);
      if (err) {
        setError(err);
      } else {
        setPin('');
      }
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden text-right">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 relative">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600/50 border border-indigo-400/30 flex items-center justify-center mx-auto mb-3">
            <User className="w-6 h-6 text-indigo-200" />
          </div>
          <h2 className="text-xl font-black text-center">
            تسجيل دخول الأستاذ
          </h2>
          <p className="text-xs text-indigo-200 text-center mt-1">
            اختر اسمك من القائمة المنسدلة ثم أدخل كلمة المرور الخاصة بك
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Dropdown Selection */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              1- اختيار الأستاذ:
            </label>
            <div className="relative">
              <select
                value={selectedTeacherId}
                onChange={(e) => {
                  setSelectedTeacherId(e.target.value);
                  setError('');
                }}
                className="w-full text-sm font-bold py-3 px-3.5 rounded-xl border-2 border-slate-200 focus:border-indigo-600 focus:bg-indigo-50/20 outline-none transition-all appearance-none bg-white text-slate-800"
              >
                <option value="">-- اضغط هنا لاختيار الأستاذ --</option>
                {teachers.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name} {t.isCoordinator ? '(منسق المادة)' : ''}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute left-3 top-3.5 text-slate-400">
                ▼
              </div>
            </div>
          </div>

          {/* Teacher Selected Info Pill */}
          {selectedTeacher && (
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-white text-xs ${
                  selectedTeacher.isCoordinator ? 'bg-blue-600' : 'bg-indigo-600'
                }`}>
                  {selectedTeacher.isCoordinator ? <Shield className="w-3.5 h-3.5" /> : <User className="w-3.5 h-3.5" />}
                </div>
                <div>
                  <span className="font-bold text-slate-800 block">{selectedTeacher.name}</span>
                  <span className="text-[10px] text-slate-500">
                    {selectedTeacher.isCoordinator ? 'منسق مادة العلوم الفيزيائية' : 'أستاذ(ة) التعليم الثانوي'}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Password Input */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              2- كلمة المرور:
            </label>
            <div className="relative">
              <input
                type="password"
                maxLength={10}
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder="أدخل كلمة المرور الخاصة بك"
                className="w-full text-center tracking-widest font-mono text-lg py-2.5 px-4 rounded-xl border-2 border-slate-200 focus:border-indigo-600 focus:bg-indigo-50/20 outline-none transition-all"
              />
              <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            </div>
          </div>

          {error && (
            <p className="text-xs font-bold text-rose-600 text-center bg-rose-50 border border-rose-200 py-2 px-3 rounded-xl animate-shake">
              {error}
            </p>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!selectedTeacherId || !pin || loading}
            className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-bold text-sm shadow-md transition-all disabled:opacity-50 flex items-center justify-center gap-2 active:scale-98"
          >
            <span>{loading ? 'جاري التحقق...' : 'دخول المنصة'}</span>
            <ArrowLeft className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
