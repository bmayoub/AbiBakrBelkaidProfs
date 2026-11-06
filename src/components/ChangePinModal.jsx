import React, { useState } from 'react';
import { KeyRound, Lock, Eye, EyeOff, CheckCircle2, AlertCircle, X } from 'lucide-react';

export default function ChangePinModal({
  isOpen,
  onClose,
  teacher,
  onChangePin
}) {
  const [currentPin, setCurrentPin] = useState('');
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [showPins, setShowPins] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!isOpen || !teacher) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!currentPin.trim()) {
      setError('يرجى إدخال كلمة المرور الحالية للتأكيد');
      return;
    }

    if (!newPin.trim()) {
      setError('يرجى إدخال كلمة المرور الجديدة');
      return;
    }

    if (newPin.trim().length < 3) {
      setError('يجب أن تتكون كلمة المرور من 3 أرقام أو حروف على الأقل');
      return;
    }

    if (newPin.trim() !== confirmPin.trim()) {
      setError('كلمة المرور الجديدة وتأكيدها غير متطابقين');
      return;
    }

    setLoading(true);
    try {
      const res = await onChangePin(teacher.id, currentPin.trim(), newPin.trim());
      setLoading(false);
      if (res && res.success) {
        setSuccess(true);
        setTimeout(() => {
          setSuccess(false);
          setCurrentPin('');
          setNewPin('');
          setConfirmPin('');
          onClose();
        }, 1800);
      } else {
        setError(res?.message || 'فشل تغيير كلمة المرور، تأكد من صحة كلمة المرور الحالية');
      }
    } catch (err) {
      setLoading(false);
      setError('حدث خطأ أثناء الاتصال بالخادم');
    }
  };

  const handleClose = () => {
    setError('');
    setSuccess(false);
    setCurrentPin('');
    setNewPin('');
    setConfirmPin('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn no-print">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-6 border border-slate-100 text-right">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-800">
                تغيير كلمة المرور الخاصة بك
              </h3>
              <p className="text-xs text-slate-500">
                {teacher.name}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Success Alert */}
        {success ? (
          <div className="py-8 text-center space-y-3 animate-fadeIn">
            <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="text-base font-black text-emerald-900">
              تم تغيير كلمة المرور بنجاح!
            </h4>
            <p className="text-xs text-emerald-700">
              يمكنك الآن استخدام كلمة المرور الجديدة في تسجيلات الدخول القادمة.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Current PIN */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                كلمة المرور الحالية:
              </label>
              <div className="relative">
                <input
                  type={showPins ? 'text' : 'password'}
                  required
                  autoFocus
                  placeholder="أدخل كلمة المرور الحالية"
                  value={currentPin}
                  onChange={(e) => setCurrentPin(e.target.value)}
                  className="w-full text-xs font-mono font-bold py-2.5 px-3 rounded-xl border border-slate-200 focus:border-indigo-600 outline-none pl-9"
                />
                <button
                  type="button"
                  onClick={() => setShowPins(!showPins)}
                  className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  tabIndex={-1}
                >
                  {showPins ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* New PIN */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                كلمة المرور الجديدة:
              </label>
              <div className="relative">
                <input
                  type={showPins ? 'text' : 'password'}
                  required
                  placeholder="مثال: 5555 أو كلمة مرور جديدة"
                  value={newPin}
                  onChange={(e) => setNewPin(e.target.value)}
                  className="w-full text-xs font-mono font-bold py-2.5 px-3 rounded-xl border border-slate-200 focus:border-indigo-600 outline-none pl-9"
                />
              </div>
              <span className="text-[10px] text-slate-400 mt-0.5 block">
                اختر رمزاً سهلاً تتذكره (أرقام أو حروف)
              </span>
            </div>

            {/* Confirm New PIN */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                تأكيد كلمة المرور الجديدة:
              </label>
              <input
                type={showPins ? 'text' : 'password'}
                required
                placeholder="أعد كتابة كلمة المرور الجديدة"
                value={confirmPin}
                onChange={(e) => setConfirmPin(e.target.value)}
                className="w-full text-xs font-mono font-bold py-2.5 px-3 rounded-xl border border-slate-200 focus:border-indigo-600 outline-none"
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold py-2.5 px-3 rounded-xl flex items-center gap-2 animate-fadeIn">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Buttons */}
            <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={handleClose}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-bold text-xs"
              >
                إلغاء
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1.5"
              >
                <KeyRound className="w-3.5 h-3.5" />
                <span>{loading ? 'جاري الحفظ...' : 'حفظ كلمة المرور'}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

