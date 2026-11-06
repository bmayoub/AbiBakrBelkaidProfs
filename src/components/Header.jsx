import React from 'react';
import { Atom, User, Shield, LogOut, FileText, BarChart2, Calendar, BookOpen, BookMarked, Printer, KeyRound } from 'lucide-react';

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
      <div className="bg-slate-900 text-slate-300 px-4 py-1.5 text-[11px] flex flex-wrap items-center justify-between border-b border-slate-800">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>الجمهورية الجزائرية الديمقراطية الشعبية • وزارة التربية الوطنية</span>
        </div>
        <div className="flex items-center gap-4">
          <span>{config?.schoolName || 'ثانوية الشهيد رابح بيطاط'}</span>
          <span className="text-slate-500">|</span>
          <span className="text-amber-400 font-bold font-mono">السنة الدراسية: {config?.academicYear || '2026/2027'}</span>
        </div>
      </div>

      {/* Main Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Department */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
              <Atom className="w-6 h-6 animate-[spin_20s_linear_infinite]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-black text-slate-800 tracking-tight">
                  تنسيق مادة العلوم الفيزيائية
                </h1>
                <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-bold rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200">
                  تعليم ثانوي
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">
                منصة الفروض والاختبارات والتوزيع السنوي
              </p>
            </div>
          </div>

          {/* User Status & Actions */}
          <div className="flex items-center gap-3">
            {/* User Pill */}
            <div className="flex items-center gap-2.5 bg-slate-50 border border-slate-200 py-1.5 px-3 rounded-2xl">
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs text-white ${
                currentRole === 'coordinator' ? 'bg-blue-600' : 'bg-indigo-600'
              }`}>
                {currentRole === 'coordinator' ? (
                  <Shield className="w-4 h-4" />
                ) : (
                  <User className="w-4 h-4" />
                )}
              </div>
              <div className="text-right">
                <div className="text-xs font-bold text-slate-800 leading-tight">
                  {currentRole === 'coordinator' ? 'منسق المادة' : currentUser?.name}
                </div>
                <div className="text-[10px] text-slate-500">
                  {currentRole === 'coordinator' ? 'صلاحيات الإشراف' : 'أستاذ(ة) التعليم الثانوي'}
                </div>
              </div>
            </div>

            {/* Change Password Button (for teachers) */}
            {currentRole === 'teacher' && currentUser && (
              <button
                onClick={onOpenChangePin}
                title="تغيير كلمة المرور الخاصة بي"
                className="p-2 sm:px-3 sm:py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <KeyRound className="w-4 h-4 text-indigo-600" />
                <span className="hidden sm:inline">كلمة المرور</span>
              </button>
            )}

            {/* Print Teachers Credentials / Passcodes Sheet (Coordinator Only) */}
            {currentRole === 'coordinator' && (
              <button
                onClick={onOpenTeacherCredentials}
                title="طباعة ورقة أسماء الأساتذة وكلمات مرورهم لتوزيعها أو تصويرها"
                className="p-2 sm:px-3 sm:py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <KeyRound className="w-4 h-4 text-blue-600" />
                <span className="hidden sm:inline">كلمات مرور الأساتذة</span>
              </button>
            )}

            {/* Print Curriculum Progress Report (Coordinator Only) */}
            {currentRole === 'coordinator' && (
              <button
                onClick={onOpenReport}
                title="طباعة تقرير تقدم المنهاج والتوزيع السنوي"
                className="p-2 sm:px-3 sm:py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Printer className="w-4 h-4 text-slate-600" />
                <span className="hidden sm:inline">تقرير تقدم المنهاج</span>
              </button>
            )}

            {/* Logout/Switch Button */}
            <button
              onClick={onLogout}
              title="تبديل المستخدم أو تسجيل الخروج"
              className="p-2 sm:px-3 sm:py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold text-xs flex items-center gap-1.5 transition-all"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">تبديل الحساب</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-t border-slate-100 py-2 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveTab('progress')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
              activeTab === 'progress'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>1- التقدم في الدروس والتوزيع السنوي</span>
          </button>

          <button
            onClick={() => setActiveTab('logbook')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
              activeTab === 'logbook'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <BookMarked className="w-4 h-4" />
            <span>2- دفتر النصوص</span>
          </button>

          <button
            onClick={() => setActiveTab('coordination')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
              activeTab === 'coordination'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>3- تنسيق الفروض والاختبارات</span>
          </button>

          {currentRole === 'coordinator' && (
            <button
              onClick={() => setActiveTab('admin')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
                activeTab === 'admin'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Shield className="w-4 h-4" />
              <span>لوحة تحكم المنسق</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}

