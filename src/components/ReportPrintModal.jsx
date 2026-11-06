import React from 'react';
import { Printer, X, FileText, CheckCircle } from 'lucide-react';
import { CURRICULA } from '../data/curricula';

export default function ReportPrintModal({
  isOpen,
  onClose,
  config = {},
  teachers = [],
  classes = [],
  coordinationList = [],
  progress = {},
  delays = {},
  curriculaData
}) {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const calculatePct = (classItem) => {
    if (!classItem) return 0;
    const allCurricula = curriculaData || CURRICULA;
    const curr = allCurricula[classItem.streamId];
    if (!curr) return 0;
    const checked = progress[classItem.id] || [];
    if (checked.length === 0) return 0;

    let maxPct = 0;
    checked.forEach((wNum) => {
      const w = (curr.weeks || []).find((week) => week.num === wNum);
      if (w && w.percent > maxPct) maxPct = w.percent;
    });
    return maxPct;
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
      {/* Container */}
      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200">
        {/* Floating actions (Hidden in print) */}
        <div className="no-print bg-slate-900 text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-indigo-400" />
            <span className="font-bold text-sm">تقرير متابعة تقدم المنهاج والتوزيع السنوي (خاص بالمنسق)</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>طباعة التقرير (A4)</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-all cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* PRINTABLE SHEET */}
        <div className="p-8 sm:p-12 text-slate-900 font-['Cairo'] printable-content">
          {/* Official Ministry Header */}
          <div className="text-center space-y-1 border-b-2 border-slate-900 pb-4 mb-6">
            <h2 className="text-sm font-bold tracking-wide">الجمهورية الجزائرية الديمقراطية الشعبية</h2>
            <h3 className="text-sm font-bold">وزارة التربية الوطنية</h3>
            <div className="flex justify-between text-xs font-semibold pt-2 text-slate-700">
              <span>مديرية التربية لولاية: {config.wilaya || 'الجزائر'}</span>
              <span>السنة الدراسية: {config.academicYear || '2026/2027'}</span>
              <span>المؤسسة: {config.schoolName || 'ثانوية أبي بكر بلقايد - النزلة'}</span>
            </div>
            <div className="pt-2">
              <span className="inline-block bg-slate-100 border border-slate-300 px-6 py-1.5 rounded-full text-base font-black text-slate-900">
                تقرير متابعة مدى تقدم تنفيذ المنهاج والتوزيع السنوي - مادة العلوم الفيزيائية
              </span>
            </div>
          </div>

          {/* Curriculum Progress Table */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-black text-slate-800 flex items-center gap-2 border-r-4 border-indigo-700 pr-2">
                جدول متابعة تقدم الأساتذة في تنفيذ التوزيع السنوي ومبررات وخطط الاستدراك
              </h4>
              <span className="text-[11px] text-slate-500 font-bold">
                إجمالي الأقسام: {classes.length} قسم
              </span>
            </div>
            <table className="w-full text-right text-xs border border-slate-300 divide-y divide-slate-200">
              <thead className="bg-slate-100 font-bold text-slate-700">
                <tr>
                  <th className="p-2 border border-slate-300 text-center w-10">الرقم</th>
                  <th className="p-2 border border-slate-300">الأستاذ المكلف</th>
                  <th className="p-2 border border-slate-300">الأقسام والشعب المسندة</th>
                  <th className="p-2 border border-slate-300 text-center w-24">الأسابيع المنجزة</th>
                  <th className="p-2 border border-slate-300 text-center w-24">نسبة الإنجاز %</th>
                  <th className="p-2 border border-slate-300">آخر وحدة مؤشر عليها</th>
                  <th className="p-2 border border-slate-300">ملاحظات وسبب التأخر / الاستدراك</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-[11px]">
                {classes.map((cls, idx) => {
                  const teacher = teachers.find((t) => t.id === cls.teacherId);
                  const curr = CURRICULA[cls.streamId];
                  const pct = calculatePct(cls);
                  const checked = progress[cls.id] || [];
                  const lastWeekNum = checked.slice(-1)[0];
                  const lastUnit = curr?.weeks.find((w) => w.num === lastWeekNum);
                  const classDelay = delays[cls.id];

                  return (
                    <tr key={cls.id}>
                      <td className="p-2 border border-slate-300 text-center font-bold">{idx + 1}</td>
                      <td className="p-2 border border-slate-300 font-bold text-slate-900">
                        {teacher?.name || 'شاغر'}
                      </td>
                      <td className="p-2 border border-slate-300">
                        <span className="font-bold">{cls.name}</span> ({curr?.stream})
                      </td>
                      <td className="p-2 border border-slate-300 text-center font-mono">
                        {checked.length} أسبوع
                      </td>
                      <td className="p-2 border border-slate-300 text-center font-bold font-mono">
                        {pct}%
                      </td>
                      <td className="p-2 border border-slate-300 text-slate-600 truncate max-w-[170px]">
                        {lastUnit ? lastUnit.unit : 'في بداية التوزيع'}
                      </td>
                      <td className="p-2 border border-slate-300 text-[10px]">
                        {classDelay ? (
                          <span className="font-bold text-amber-900">
                            ⚠️ {classDelay.reason}
                            {classDelay.catchupPlan ? ` (الاستدراك: ${classDelay.catchupPlan})` : ''}
                          </span>
                        ) : (
                          <span className="text-emerald-700 font-semibold">على المسار العادي</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Official Signatures */}
          <div className="grid grid-cols-3 gap-6 text-center text-xs pt-8 border-t border-slate-300">
            <div>
              <p className="font-bold text-slate-800">أستاذ منسق المادة</p>
              <div className="h-16"></div>
              <p className="text-[10px] text-slate-400">التوقيع والختم</p>
            </div>
            <div>
              <p className="font-bold text-slate-800">مفتش التعليم الثانوي لمادة العلوم الفيزيائية</p>
              <div className="h-16"></div>
              <p className="text-[10px] text-slate-400">تأشيرة السيد المفتش</p>
            </div>
            <div>
              <p className="font-bold text-slate-800">السيد مدير الثانوية</p>
              <div className="h-16"></div>
              <p className="text-[10px] text-slate-400">تأشيرة وختم الإدارة</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

