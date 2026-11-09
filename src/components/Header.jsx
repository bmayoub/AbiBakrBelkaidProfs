import React from 'react';
import { Atom, User, Shield, LogOut, FileText, BarChart2, Calendar, BookOpen, BookMarked, Printer, KeyRound, FolderDown } from 'lucide-react';

export default function Header({
  currentUser,
  currentRole,
  config,
  activeTab,
  setActiveTab,
  onOpenReport,
  onOpenTeacherCredentials,
  onOpenChangePin,
  onLogout
}) {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs no-print">
      {/* Top Bar: Ministry & School info */}
      <div className="bg-slate-900 text-slate-300 px-3 sm:px-4 py-1.5 text-[10px] sm:text-[11px] flex items-center justify-between border-b border-slate-800 gap-2">
        <div className="flex items-center gap-1.5 truncate">
          <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-emerald-400 shrink-0 animate-pulse"></span>
          <span className="truncate">وزارة التربية الوطنية • {config?.schoolName || 'ثانوية أبي بكر بلقايد - النزلة'}</span>
        </div>
        <div className="flex items-center gap-2 shrink-0 font-mono text-amber-400 font-bold">
          <span>{config?.academicYear || '2026/2027'}</span>
        </div>
      </div>

      {/* Main Bar */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16 gap-2">
          {/* Logo & Department */}
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shrink-0 shadow-md shadow-indigo-500/20">
              <Atom className="w-5 h-5 sm:w-6 sm:h-6 animate-[spin_20s_linear_infinite]" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <h1 className="text-sm sm:text-lg font-black text-slate-800 tracking-tight truncate">
                  العلوم الفيزيائية
                </h1>
                <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-bold rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200">
                  تعليم ثانوي
                </span>
              </div>
              <p className="text-[10px] text-slate-500 hidden md:block">
                منصة الفروض والاختبارات والتوزيع السنوي
              </p>
            </div>
          </div>

          {/* User Status & Actions */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            {/* User Pill */}
            <div className="flex items-center gap-1.5 sm:gap-2 bg-slate-50 border border-slate-200 py-1 px-2 sm:py-1.5 sm:px-3 rounded-xl sm:rounded-2xl max-w-[130px] sm:max-w-none">
              <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl flex items-center justify-center font-bold text-xs text-white shrink-0 ${
                currentRole === 'coordinator' ? 'bg-blue-600' : 'bg-indigo-600'
              }`}>
                {currentRole === 'coordinator' ? (
                  <Shield className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                ) : (
                  <User className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                )}
              </div>
              <div className="text-right min-w-0">
                <div className="text-[11px] sm:text-xs font-bold text-slate-800 leading-tight truncate">
                  {currentRole === 'coordinator' ? 'منسق المادة' : currentUser?.name}
                </div>
                <div className="text-[9px] text-slate-500 hidden sm:block">
                  {currentRole === 'coordinator' ? 'صلاحيات الإشراف' : 'أستاذ(ة) التعليم الثانوي'}
                </div>
              </div>
            </div>

            {/* Change Password Button (for teachers) */}
            {currentRole === 'teacher' && currentUser && (
              <button
                onClick={onOpenChangePin}
                title="تغيير كلمة المرور الخاصة بي"
                className="p-2 sm:px-3 sm:py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer min-h-[36px]"
              >
                <KeyRound className="w-4 h-4 text-indigo-600" />
                <span className="hidden md:inline">كلمة المرور</span>
              </button>
            )}

            {/* Print Teachers Credentials / Passcodes Sheet (Coordinator Only) */}
            {currentRole === 'coordinator' && (
              <button
                onClick={onOpenTeacherCredentials}
                title="طباعة ورقة أسماء الأساتذة وكلمات مرورهم لتوزيعها أو تصويرها"
                className="p-2 sm:px-3 sm:py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer min-h-[36px]"
              >
                <KeyRound className="w-4 h-4 text-blue-600" />
                <span className="hidden md:inline">كلمات مرور الأساتذة</span>
              </button>
            )}

            {/* Print Curriculum Progress Report (Coordinator Only) */}
            {currentRole === 'coordinator' && (
              <button
                onClick={onOpenReport}
                title="طباعة تقرير تقدم المنهاج والتوزيع السنوي"
                className="p-2 sm:px-3 sm:py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer min-h-[36px]"
              >
                <Printer className="w-4 h-4 text-slate-600" />
                <span className="hidden md:inline">تقرير تقدم المنهاج</span>
              </button>
            )}

            {/* Logout/Switch Button */}
            <button
              onClick={onLogout}
              title="تبديل المستخدم أو تسجيل الخروج"
              className="p-2 sm:px-3 sm:py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold text-xs flex items-center gap-1.5 transition-all min-h-[36px]"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden md:inline">تبديل الحساب</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs - Responsive 2x2 Grid on Mobile, Clean Flex Row on Desktop */}
        <div className="grid grid-cols-2 sm:flex sm:items-center gap-1.5 sm:gap-2 border-t border-slate-100 py-2 sm:py-2.5">
          <button
            onClick={() => setActiveTab('progress')}
            className={`flex items-center justify-center sm:justify-start gap-1.5 sm:gap-2 px-2.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all text-center sm:text-right ${
              activeTab === 'progress'
                ? 'bg-indigo-600 text-white shadow-sm ring-1 ring-indigo-700/20'
                : 'text-slate-600 bg-slate-50 hover:bg-slate-100 sm:bg-transparent sm:hover:bg-slate-100 border border-slate-200/70 sm:border-0'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
            <span className="truncate">1- التقدم في الدروس</span>
            <span className="hidden lg:inline">والتوزيع السنوي</span>
          </button>

          <button
            onClick={() => setActiveTab('logbook')}
            className={`flex items-center justify-center sm:justify-start gap-1.5 sm:gap-2 px-2.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all text-center sm:text-right ${
              activeTab === 'logbook'
                ? 'bg-emerald-600 text-white shadow-sm ring-1 ring-emerald-700/20'
                : 'text-slate-600 bg-slate-50 hover:bg-slate-100 sm:bg-transparent sm:hover:bg-slate-100 border border-slate-200/70 sm:border-0'
            }`}
          >
            <BookMarked className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
            <span className="truncate">2- دفتر النصوص</span>
          </button>

          <button
            onClick={() => setActiveTab('coordination')}
            className={`flex items-center justify-center sm:justify-start gap-1.5 sm:gap-2 px-2.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all text-center sm:text-right ${
              activeTab === 'coordination'
                ? 'bg-indigo-600 text-white shadow-sm ring-1 ring-indigo-700/20'
                : 'text-slate-600 bg-slate-50 hover:bg-slate-100 sm:bg-transparent sm:hover:bg-slate-100 border border-slate-200/70 sm:border-0'
            }`}
          >
            <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
            <span className="truncate">3- تنسيق الفروض</span>
            <span className="hidden lg:inline">والاختبارات</span>
          </button>

          <button
            onClick={() => setActiveTab('documents')}
            className={`flex items-center justify-center sm:justify-start gap-1.5 sm:gap-2 px-2.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all text-center sm:text-right ${
              activeTab === 'documents'
                ? 'bg-purple-600 text-white shadow-sm ring-1 ring-purple-700/20'
                : 'text-slate-600 bg-slate-50 hover:bg-slate-100 sm:bg-transparent sm:hover:bg-slate-100 border border-slate-200/70 sm:border-0'
            }`}
          >
            <FolderDown className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
            <span className="truncate">4- مكتبة الوثائق</span>
            <span className="hidden lg:inline">والتحميل</span>
          </button>

          {currentRole === 'coordinator' && (
            <button
              onClick={() => setActiveTab('admin')}
              className={`col-span-2 sm:col-span-1 flex items-center justify-center sm:justify-start gap-1.5 sm:gap-2 px-2.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all text-center sm:text-right ${
                activeTab === 'admin'
                  ? 'bg-blue-600 text-white shadow-sm ring-1 ring-blue-700/20'
                  : 'text-slate-600 bg-slate-50 hover:bg-slate-100 sm:bg-transparent sm:hover:bg-slate-100 border border-slate-200/70 sm:border-0'
              }`}
            >
              <Shield className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
              <span>5- لوحة تحكم المنسق</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}

