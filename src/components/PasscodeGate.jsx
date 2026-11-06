import React, { useState } from 'react';
import { KeyRound, ShieldCheck, Atom, School, ArrowLeft } from 'lucide-react';

export default function PasscodeGate({ onUnlock, schoolName, academicYear }) {
  const [passcode, setPasscode] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    if (!passcode) return;
    setIsLoading(true);
    setError('');

    onUnlock(passcode, (err) => {
      setIsLoading(false);
      if (err) {
        setError(err);
      }
    });
  };

  const handleDigitClick = (digit) => {
    if (passcode.length < 6) {
      const next = passcode + digit;
      setPasscode(next);
      if (next.length === 4) {
        // Auto submit on 4th digit for quick access
        setTimeout(() => {
          onUnlock(next, (err) => {
            if (err) setError(err);
          });
        }, 150);
      }
    }
  };

  const handleClear = () => {
    setPasscode('');
    setError('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 flex flex-col items-center justify-center p-4">
      {/* Decorative ambient elements */}
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-md bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl border border-white/20 p-8 text-center relative z-10">
        {/* Header Icon */}
        <div className="w-20 h-20 mx-auto -mt-16 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-3xl shadow-lg shadow-indigo-500/30 flex items-center justify-center text-white border-4 border-white">
          <Atom className="w-10 h-10 animate-[spin_12s_linear_infinite]" />
        </div>

        <div className="mt-4 mb-6">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100 mb-2">
            <School className="w-3.5 h-3.5" />
            {schoolName || 'ثانوية الشهيد رابح بيطاط'}
          </span>
          <h1 className="text-2xl font-black text-slate-800">
            فضاء أساتذة العلوم الفيزيائية
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            منصة التنسيق البيداغوجي وتتبع التوزيع السنوي ({academicYear || '2026/2027'})
          </p>
        </div>

        <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 mb-6 text-right">
          <div className="flex items-center gap-2 text-indigo-700 font-bold text-sm mb-1">
            <ShieldCheck className="w-4 h-4" />
            <span>بوابة المؤسسة</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            الرجاء إدخال الرمز السري المتفق عليه للدخول إلى المنصة.
          </p>
        </div>

        {/* Passcode input display */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex justify-center gap-3 mb-2" dir="ltr">
            {[0, 1, 2, 3].map((idx) => {
              const char = passcode[idx];
              return (
                <div
                  key={idx}
                  className={`w-12 h-14 rounded-xl border-2 flex items-center justify-center text-2xl font-mono font-bold transition-all ${
                    char
                      ? 'border-indigo-600 bg-indigo-50/50 text-indigo-900 shadow-sm scale-105'
                      : 'border-slate-200 bg-white text-slate-400'
                  }`}
                >
                  {char ? '•' : ''}
                </div>
              );
            })}
          </div>

          {error && (
            <p className="text-sm font-semibold text-rose-600 bg-rose-50 border border-rose-200 py-1.5 px-3 rounded-xl animate-shake">
              {error}
            </p>
          )}

          {/* Quick Keypad */}
          <div className="grid grid-cols-3 gap-2.5 max-w-xs mx-auto pt-2" dir="ltr">
            {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
              <button
                type="button"
                key={digit}
                onClick={() => handleDigitClick(digit)}
                className="h-12 rounded-xl bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 active:scale-95 font-bold text-lg text-slate-700 transition-all shadow-sm"
              >
                {digit}
              </button>
            ))}
            <button
              type="button"
              onClick={handleClear}
              className="h-12 rounded-xl bg-slate-100 hover:bg-rose-50 hover:text-rose-600 active:scale-95 font-medium text-xs text-slate-600 transition-all shadow-sm"
            >
              مسح
            </button>
            <button
              type="button"
              onClick={() => handleDigitClick('0')}
              className="h-12 rounded-xl bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 active:scale-95 font-bold text-lg text-slate-700 transition-all shadow-sm"
            >
              0
            </button>
            <button
              type="button"
              onClick={() => setPasscode(passcode.slice(0, -1))}
              className="h-12 rounded-xl bg-slate-100 hover:bg-amber-50 hover:text-amber-600 active:scale-95 font-medium text-xs text-slate-600 transition-all shadow-sm flex items-center justify-center"
            >
              ⌫
            </button>
          </div>

          <button
            type="submit"
            disabled={passcode.length < 4 || isLoading}
            className="w-full mt-4 py-3.5 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-2xl font-bold text-base shadow-lg shadow-indigo-500/25 active:scale-[0.98] transition-all disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2"
          >
            <span>{isLoading ? 'جاري التحقق...' : 'دخول المنصة'}</span>
            <ArrowLeft className="w-5 h-5" />
          </button>
        </form>
      </div>

      <p className="mt-8 text-xs text-slate-400">
        الجمهورية الجزائرية الديمقراطية الشعبية • وزارة التربية الوطنية
      </p>
    </div>
  );
}

