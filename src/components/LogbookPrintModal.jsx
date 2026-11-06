import React, { useRef } from 'react';
import { X, Printer, BookOpen, CheckSquare, Square, CheckCircle2 } from 'lucide-react';

export default function LogbookPrintModal({
  isOpen,
  onClose,
  selectedClass,
  teacherName,
  config,
  allSyllabusItems = [],
  checkedItemIds = []
}) {
  const printAreaRef = useRef(null);

  if (!isOpen || !selectedClass) return null;

  const handlePrint = () => {
    window.print();
  };

  const total = allSyllabusItems.length;
  const completed = allSyllabusItems.filter((it) => checkedItemIds.includes(it.id)).length;
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4">
      {/* Container */}
      <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full flex flex-col max-h-[94vh] overflow-hidden border border-slate-200">
        
        {/* Header - No Print */}
        <div className="px-6 py-4 bg-gradient-to-r from-emerald-700 via-teal-700 to-emerald-800 text-white flex items-center justify-between no-print shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center border border-white/20">
              <BookOpen className="w-5 h-5 text-emerald-200" />
            </div>
            <div>
              <h2 className="text-base font-black">كشف متابعة دفتر النصوص والسير المنهجي (A4)</h2>
              <p className="text-xs text-emerald-100">
                القسم: {selectedClass.name} • {selectedClass.stream || ''} • الأستاذ: {teacherName || 'غير مسند'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-white text-emerald-800 hover:bg-emerald-50 font-bold text-xs rounded-xl shadow flex items-center gap-2 transition cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>طباعة كشف A4</span>
            </button>

            <button
              onClick={onClose}
              className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Printable Document */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-slate-100">
          <div
            ref={printAreaRef}
            id="printable-logbook"
            className="bg-white mx-auto shadow-md p-6 sm:p-10 text-slate-900 border border-slate-300 max-w-[210mm] min-h-[297mm] flex flex-col justify-between"
            style={{ direction: 'rtl' }}
          >
            <div>
              {/* Official Algerian Republic Header */}
              <div className="text-center border-b-2 border-slate-800 pb-4 mb-5">
                <div className="text-[13px] font-bold tracking-wide">الجمهورية الجزائرية الديمقراطية الشعبية</div>
                <div className="text-[12px] font-bold text-slate-700">وزارة التربية الوطنية</div>
                
                <div className="flex justify-between items-center text-xs mt-3 px-2">
                  <div className="text-right">
                    <div>مديرية التربية لولاية: <span className="font-bold">{config?.wilaya || 'تقرت'}</span></div>
                    <div>المؤسسة: <span className="font-bold">{config?.schoolName || 'ثانوية أبي بكر بلقايد'}</span></div>
                  </div>
                  <div className="text-center">
                    <span className="inline-block px-4 py-1 border-2 border-emerald-800 rounded-lg text-emerald-900 font-black text-sm bg-emerald-50">
                      كشف متابعة دفتر النصوص وتدرج التعلمات
                    </span>
                  </div>
                  <div className="text-left" style={{ direction: 'ltr' }}>
                    <div style={{ direction: 'rtl' }}>السنة الدراسية: <span className="font-bold font-mono">{config?.academicYear || '2026/2027'}</span></div>
                    <div style={{ direction: 'rtl' }}>المادة: <span className="font-bold">{config?.subject || 'العلوم الفيزيائية'}</span></div>
                  </div>
                </div>

                {/* Class & Teacher Details Badge */}
                <div className="mt-3 pt-3 border-t border-slate-200 grid grid-cols-3 gap-2 text-xs bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                  <div>
                    <span className="text-slate-500">القسم / الشعبة: </span>
                    <span className="font-black text-slate-800">{selectedClass.name} ({selectedClass.stream || ''})</span>
                  </div>
                  <div className="text-center">
                    <span className="text-slate-500">الأستاذ(ة): </span>
                    <span className="font-black text-slate-800">{teacherName || 'غير مسند'}</span>
                  </div>
                  <div className="text-left">
                    <span className="text-slate-500">الدروس المدروسة: </span>
                    <span className="font-black text-emerald-700 font-mono">{completed} من {total} ({percentage}%)</span>
                  </div>
                </div>
              </div>

              {/* Table of Lessons */}
              {allSyllabusItems.length === 0 ? (
                <div className="text-center py-16 text-slate-400 border border-dashed border-slate-300 rounded-xl">
                  <p className="font-bold text-sm">لا توجد دروس محددة لهذا القسم.</p>
                </div>
              ) : (
                <table className="w-full text-right border-collapse text-[11px] border border-slate-800">
                  <thead>
                    <tr className="bg-slate-200 text-slate-900 font-bold border-b border-slate-800 text-center">
                      <th className="border border-slate-700 py-1.5 px-2 w-12">التأشير</th>
                      <th className="border border-slate-700 py-1.5 px-2 w-10">#</th>
                      <th className="border border-slate-700 py-1.5 px-2 w-24">نوع النشاط</th>
                      <th className="border border-slate-700 py-1.5 px-2 w-48">الوحدة التعليمية</th>
                      <th className="border border-slate-700 py-1.5 px-3">عنوان الدرس / السير المنهجي لتدرج التعلمات</th>
                      <th className="border border-slate-700 py-1.5 px-2 w-24">الحالة</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allSyllabusItems.map((item, idx) => {
                      const isChecked = checkedItemIds.includes(item.id);

                      return (
                        <tr
                          key={item.id || idx}
                          className={`border-b border-slate-400 ${
                            isChecked ? 'bg-emerald-50/50' : ''
                          }`}
                        >
                          <td className="border border-slate-600 py-1 px-2 text-center">
                            {isChecked ? (
                              <span className="font-black text-emerald-700 text-sm">☑</span>
                            ) : (
                              <span className="text-slate-300 text-sm">☐</span>
                            )}
                          </td>
                          <td className="border border-slate-600 py-1 px-2 text-center font-mono font-bold text-slate-500">
                            {idx + 1}
                          </td>
                          <td className="border border-slate-600 py-1 px-2 text-center font-bold text-[10px]">
                            {item.type || 'درس نظري'}
                          </td>
                          <td className="border border-slate-600 py-1 px-2 text-[10px] font-bold text-slate-800">
                            {item.unitTitle}
                          </td>
                          <td className="border border-slate-600 py-1 px-3">
                            <span className={isChecked ? 'font-black text-slate-900' : 'text-slate-700'}>
                              {item.title}
                            </span>
                          </td>
                          <td className="border border-slate-600 py-1 px-2 text-center font-bold text-[10px]">
                            {isChecked ? (
                              <span className="text-emerald-800 font-bold">تم تدريسه</span>
                            ) : (
                              <span className="text-slate-400">لم يدرس بعد</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>

            {/* Official Signatures & Visa Section */}
            <div className="mt-8 pt-4 border-t-2 border-slate-800 grid grid-cols-3 gap-6 text-center text-xs">
              <div>
                <div className="font-bold text-slate-800 mb-10">توقيع أستاذ(ة) المادة</div>
                <div className="text-slate-400 text-[10px]">....................................</div>
              </div>
              <div>
                <div className="font-bold text-slate-800 mb-10">تأشيرة السيد(ة) المفتش(ة)</div>
                <div className="text-slate-400 text-[10px]">....................................</div>
              </div>
              <div>
                <div className="font-bold text-slate-800 mb-10">تأشيرة مدير المؤسسة</div>
                <div className="text-slate-400 text-[10px]">....................................</div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer info - No print */}
        <div className="p-3 bg-white border-t border-slate-200 text-center text-xs text-slate-500 no-print flex items-center justify-between px-6">
          <span>نصيحة: يمكنك ضبط خيارات الطباعة على الورق A4 في المتصفح، واختيار حفظ بصيغة PDF.</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer"
          >
            إغلاق
          </button>
        </div>

      </div>
    </div>
  );
}
