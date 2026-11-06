import React, { useState } from 'react';
import {
  Printer,
  X,
  KeyRound,
  Copy,
  Check
} from 'lucide-react';

export default function TeacherCredentialsPrintModal({
  isOpen,
  onClose,
  teachers = [],
  classes = [],
  config = {}
}) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const platformUrl = typeof window !== 'undefined'
    ? `${window.location.protocol}//${window.location.host}`
    : 'http://localhost:5000';

  // Copy text for WhatsApp
  const handleCopyText = () => {
    const lines = [
      `🔐 كلمات مرور أساتذة مادة العلوم الفيزيائية:`,
      `🏫 ${config.schoolName || 'المؤسسة'} (${config.academicYear || '2026/2027'})`,
      `🔗 الرابط: ${platformUrl}`,
      `---------------------------------`
    ];

    teachers.forEach((t, idx) => {
      lines.push(`${idx + 1}. ${t.name}: كلمة المرور [ ${t.pin || '0000'} ]`);
    });

    lines.push(`---------------------------------`);
    lines.push(`💡 يمكن لكل أستاذ تغيير كلمة مروره في أي وقت بعد الدخول.`);

    navigator.clipboard.writeText(lines.join('\n'));
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 print:p-0 print:bg-white print:static print:inset-auto">
      {/* Modal Container */}
      <div className="w-full max-w-3xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200 print:border-none print:shadow-none print:w-full print:max-w-none text-right">
        {/* Toolbar (Hidden during print) */}
        <div className="no-print bg-slate-900 text-white p-4 flex items-center justify-between gap-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <KeyRound className="w-5 h-5 text-blue-400" />
            <span className="font-bold text-sm">ورقة كلمات مرور الأساتذة</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyText}
              className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
                copied ? 'bg-emerald-600 text-white' : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
              }`}
              title="نسخ القائمة نصياً لإرسالها"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
              <span>{copied ? 'تم النسخ!' : 'نسخ للواتساب'}</span>
            </button>

            <button
              onClick={handlePrint}
              className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-black text-xs rounded-xl shadow-xs flex items-center gap-1.5 transition-all cursor-pointer active:scale-95"
            >
              <Printer className="w-4 h-4" />
              <span>طباعة (A4)</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-all cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Simple Sheet */}
        <div className="p-6 sm:p-8 print:p-6 bg-white text-slate-900 space-y-4">
          {/* Header */}
          <div className="border-b-2 border-slate-800 pb-3 text-center">
            <h2 className="text-lg font-black text-slate-900 mb-1">
              جدول كلمات مرور أساتذة مادة العلوم الفيزيائية
            </h2>
            <div className="flex items-center justify-between text-xs font-bold text-slate-600 pt-1">
              <span>{config.schoolName || 'ثانوية الشهيد رابح بيطاط'}</span>
              <span>السنة الدراسية: {config.academicYear || '2026/2027'}</span>
            </div>
          </div>

          {/* Simple Table */}
          <table className="w-full text-right border-collapse border border-slate-400 text-xs">
            <thead>
              <tr className="bg-slate-100 text-slate-900 border-b-2 border-slate-400 font-black">
                <th className="border border-slate-400 py-2.5 px-3 text-center w-12">#</th>
                <th className="border border-slate-400 py-2.5 px-4">اسم الأستاذ</th>
                <th className="border border-slate-400 py-2.5 px-4 text-center w-36">
                  كلمة المرور PIN
                </th>
                <th className="border border-slate-400 py-2.5 px-3 text-center w-28">الصفة</th>
                <th className="border border-slate-400 py-2.5 px-4">الأقسام المسندة</th>
              </tr>
            </thead>
            <tbody>
              {teachers.map((teacher, idx) => {
                const assigned = classes.filter((c) => c.teacherId === teacher.id).map((c) => c.name);

                return (
                  <tr key={teacher.id || idx} className="hover:bg-slate-50 border-b border-slate-300">
                    <td className="border border-slate-400 py-2.5 px-3 text-center font-bold text-slate-600">
                      {idx + 1}
                    </td>
                    <td className="border border-slate-400 py-2.5 px-4 font-black text-slate-900 text-sm">
                      {teacher.name}
                    </td>
                    <td className="border border-slate-400 py-2.5 px-4 text-center font-mono font-black text-base text-indigo-950 bg-indigo-50/40">
                      {teacher.pin || '0000'}
                    </td>
                    <td className="border border-slate-400 py-2.5 px-3 text-center font-bold">
                      {teacher.isCoordinator ? (
                        <span className="text-blue-700 font-black">المنسق</span>
                      ) : (
                        <span className="text-slate-600">أستاذ</span>
                      )}
                    </td>
                    <td className="border border-slate-400 py-2.5 px-4 text-[11px] font-mono">
                      {assigned.length > 0 ? assigned.join('، ') : '—'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* Footer Note */}
          <div className="pt-3 border-t border-slate-200 text-xs text-slate-500 flex flex-wrap items-center justify-between gap-2">
            <div>
              <span className="font-bold text-slate-700">رابط المنصة: </span>
              <span className="font-mono font-bold text-blue-700" dir="ltr">{platformUrl}</span>
            </div>
            <p className="text-[11px] text-slate-400">
              * يمكن لكل أستاذ تغيير كلمة المرور الخاصة به في أي وقت من حسابه داخل المنصة.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
