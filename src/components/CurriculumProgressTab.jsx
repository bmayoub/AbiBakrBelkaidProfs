import React, { useState } from 'react';
import {
  CheckSquare,
  Square,
  TrendingUp,
  Users,
  Award,
  BookOpen,
  Filter,
  AlertCircle,
  AlertTriangle,
  Clock,
  Sparkles,
  ChevronRight,
  Eye,
  CalendarCheck,
  Edit3,
  Trash2,
  PlusCircle,
  CheckCircle2,
  Printer,
  X
} from 'lucide-react';
import { CURRICULA, STREAMS_LIST } from '../data/curricula';

export default function CurriculumProgressTab({
  classes = [],
  teachers = [],
  progress = {},
  delays = {},
  curriculaData,
  currentUser,
  currentRole,
  onToggleWeek,
  onSaveDelay,
  onDeleteDelay,
  onUpdateCurriculum,
  onResetCurriculum,
  onOpenProgressReport
}) {
  // Tabs within this view: 'my_classes' or 'all_teachers'
  const [subTab, setSubTab] = useState('my_classes');

  const allCurricula = curriculaData || CURRICULA;

  // Filter for my classes
  const myClasses = currentRole === 'coordinator'
    ? classes
    : classes.filter((c) => c.teacherId === currentUser?.id);

  const [selectedClassId, setSelectedClassId] = useState(
    myClasses[0]?.id || classes[0]?.id || ''
  );

  const [termFilter, setTermFilter] = useState('all'); // 'all', 1, 2, 3
  const [streamFilter, setStreamFilter] = useState('all');

  // Delay Modal State
  const [showDelayModal, setShowDelayModal] = useState(false);
  const [delayReason, setDelayReason] = useState('');
  const [catchupPlan, setCatchupPlan] = useState('');

  // Coordinator Week Modal State
  const [weekModalOpen, setWeekModalOpen] = useState(false);
  const [editingWeekIndex, setEditingWeekIndex] = useState(null);
  const [weekFormData, setWeekFormData] = useState({
    num: '',
    dates: '',
    term: 1,
    unit: '',
    percent: 0,
    evalType: '',
    isHoliday: false
  });

  const selectedClass = classes.find((c) => c.id === selectedClassId);
  const selectedCurriculum = selectedClass ? allCurricula[selectedClass.streamId] : null;
  const assignedTeacher = selectedClass ? teachers.find((t) => t.id === selectedClass.teacherId) : null;
  const currentClassDelay = selectedClass ? delays[selectedClass.id] : null;

  // Permission check: only the assigned teacher of this class can toggle progress and manage delays.
  // Coordinator can view all classes, but can only edit progress for their own assigned classes.
  const isClassTeacher = Boolean(selectedClass && currentUser?.id && selectedClass.teacherId === currentUser.id);
  const canEditProgress = isClassTeacher;

  // Checked weeks for selected class
  const checkedWeeks = progress[selectedClassId] || [];

  // Calculate current percentage for selected class
  const calculateClassPercentage = (classItem) => {
    if (!classItem) return 0;
    const curr = allCurricula[classItem.streamId];
    if (!curr) return 0;
    const checked = progress[classItem.id] || [];
    if (checked.length === 0) return 0;

    let maxPct = 0;
    checked.forEach((wNum) => {
      const weekData = (curr.weeks || []).find((w) => w.num === wNum);
      if (weekData && weekData.percent > maxPct) {
        maxPct = weekData.percent;
      }
    });
    return maxPct;
  };

  const currentPercent = calculateClassPercentage(selectedClass);

  // Filtered weeks to display in checklist
  const weeksToDisplay = (selectedCurriculum?.weeks || []).filter((w) => {
    if (termFilter !== 'all' && w.term !== Number(termFilter)) return false;
    return true;
  });

  const completedWeeksCount = checkedWeeks.filter((w) => typeof w === 'number').length;

  // Coordinator Week Action Handlers
  const handleOpenAddWeekModal = () => {
    const currentWeeks = selectedCurriculum?.weeks || [];
    const nextNum = currentWeeks.length + 1;
    setEditingWeekIndex(null);
    setWeekFormData({
      num: nextNum,
      dates: '',
      term: termFilter !== 'all' ? Number(termFilter) : 1,
      unit: '',
      percent: 0,
      evalType: '',
      isHoliday: false
    });
    setWeekModalOpen(true);
  };

  const handleOpenEditWeekModal = (w, index) => {
    const actualIdx = (selectedCurriculum?.weeks || []).findIndex(
      (item) => item.num === w.num && item.dates === w.dates
    );
    setEditingWeekIndex(actualIdx !== -1 ? actualIdx : index);
    setWeekFormData({
      num: w.num,
      dates: w.dates || '',
      term: w.term || 1,
      unit: w.unit || '',
      percent: w.percent || 0,
      evalType: w.evalType || '',
      isHoliday: Boolean(w.isHoliday)
    });
    setWeekModalOpen(true);
  };

  const handleSaveWeek = (e) => {
    e.preventDefault();
    if (!selectedClass || !onUpdateCurriculum) return;
    const currentWeeks = [...(selectedCurriculum?.weeks || [])];
    const newEntry = {
      ...weekFormData,
      num: isNaN(Number(weekFormData.num)) ? weekFormData.num : Number(weekFormData.num),
      percent: Number(weekFormData.percent) || 0,
      term: Number(weekFormData.term) || 1
    };

    if (editingWeekIndex !== null && editingWeekIndex >= 0) {
      currentWeeks[editingWeekIndex] = newEntry;
    } else {
      currentWeeks.push(newEntry);
    }

    onUpdateCurriculum(selectedClass.streamId, {
      ...selectedCurriculum,
      weeks: currentWeeks
    });
    setWeekModalOpen(false);
  };

  const handleDeleteWeek = (w, index) => {
    if (!window.confirm(`هل أنت متأكد من حذف هذا الأسبوع ("${w.num}: ${w.unit}") من التوزيع السنوي؟`)) return;
    if (!selectedClass || !onUpdateCurriculum) return;
    const actualIdx = (selectedCurriculum?.weeks || []).findIndex(
      (item) => item.num === w.num && item.dates === w.dates
    );
    const targetIdx = actualIdx !== -1 ? actualIdx : index;
    const currentWeeks = [...(selectedCurriculum?.weeks || [])];
    currentWeeks.splice(targetIdx, 1);

    onUpdateCurriculum(selectedClass.streamId, {
      ...selectedCurriculum,
      weeks: currentWeeks
    });
  };

  const handleResetCurriculumClick = () => {
    if (!window.confirm('هل أنت متأكد من استعادة التوزيع السنوي الوزاري الافتراضي لهذه الشعبة؟')) return;
    if (!selectedClass || !onResetCurriculum) return;
    onResetCurriculum(selectedClass.streamId);
  };

  // Quick Common Delay Reasons
  const commonReasons = [
    'عطلة مرضية للأستاذ',
    'إضراب وتوقف مؤقت عن التدريس',
    'صعوبة استيعاب المفاهيم والحاجة لحصص معالجة ودعم',
    'غياب جماعي للتلاميذ قبل العطلة',
    'نقص وتجهيز عتاد التجارب المخبرية',
    'تأخر الدخول المدرسي وانطلاق الحصص'
  ];

  const commonPlans = [
    'برمجة حصة استدراكية يوم السبت',
    'استغلال حصص الدعم وساعات الفراغ',
    'تكثيف الواجبات المنزلية والتمارين الإضافية',
    'دمج الأنشطة المتشابهة لتسريع وتيرة التقدم'
  ];

  const handleOpenDelayModal = () => {
    if (currentClassDelay) {
      setDelayReason(currentClassDelay.reason || '');
      setCatchupPlan(currentClassDelay.catchupPlan || '');
    } else {
      setDelayReason('');
      setCatchupPlan('');
    }
    setShowDelayModal(true);
  };

  const handleSaveDelaySubmit = (e) => {
    e.preventDefault();
    if (!selectedClass || !delayReason.trim()) return;

    onSaveDelay(selectedClass.id, delayReason.trim(), catchupPlan.trim());
    setShowDelayModal(false);
  };

  const handleDeleteDelayClick = () => {
    if (!selectedClass) return;
    if (window.confirm('هل تريد إلغاء تسجيل التأخر واعتبار القسم قد استدرك برنامجه؟')) {
      onDeleteDelay(selectedClass.id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-4 sm:p-6 text-white shadow-xl relative overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-3 sm:gap-4 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-200 text-xs font-semibold mb-2 border border-indigo-500/30">
              <BookOpen className="w-3.5 h-3.5" />
              <span>التوزيع السنوي الرسمي 2026/2027</span>
            </div>
            <h2 className="text-lg sm:text-2xl font-black">
              التأشير الأسبوعي وتتبع التدرج البيداغوجي
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
              يقوم الأساتذة أسبوعياً بالتأشير على الحصص والوحدات المنجزة لحساب نسبة تقدم كل قسم آلياً ومقارنتها مع بقية الزملاء.
            </p>
          </div>

          {/* SubTab switcher & Coordinator Report Button */}
          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            {currentRole === 'coordinator' && onOpenProgressReport && (
              <button
                onClick={onOpenProgressReport}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/15 hover:bg-white/25 text-white text-xs font-bold transition-all border border-white/20 shadow-xs cursor-pointer active:scale-95"
                title="طباعة التقرير الرسمي لتقدم المنهاج والتوزيع السنوي (A4)"
              >
                <Printer className="w-4 h-4 text-emerald-300" />
                <span>طباعة تقرير تقدم المنهاج</span>
              </button>
            )}

            <div className="flex items-center bg-white/10 p-1 sm:p-1.5 rounded-2xl backdrop-blur-xs border border-white/10 w-full sm:w-auto justify-center">
              <button
                onClick={() => setSubTab('my_classes')}
                className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  subTab === 'my_classes'
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-indigo-200 hover:text-white'
                }`}
              >
                <CheckSquare className="w-4 h-4" />
                <span>{currentRole === 'coordinator' ? 'التأشير على الأقسام' : 'أقسامي والتأشير'}</span>
              </button>

              <button
                onClick={() => setSubTab('all_teachers')}
                className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  subTab === 'all_teachers'
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-indigo-200 hover:text-white'
                }`}
              >
                <Users className="w-4 h-4" />
                <span>مقارنة تقدم الأساتذة</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* VIEW 1: MY CLASSES & CHECKLIST */}
      {subTab === 'my_classes' && (
        <div className="space-y-4 sm:space-y-6">
          {/* Class Selector Pills */}
          <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 p-3.5 sm:p-4 shadow-xs">
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-xs font-bold text-slate-500">اختر القسم للمتابعة والتأشير:</span>
              {currentRole === 'coordinator' && (
                <span className="text-[10px] sm:text-[11px] text-blue-600 font-bold bg-blue-50 px-2.5 py-0.5 rounded-full">
                  وضع المنسق (جميع أقسام المؤسسة)
                </span>
              )}
            </div>

            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              {(currentRole === 'coordinator' ? classes : myClasses).map((cls) => {
                const curr = CURRICULA[cls.streamId];
                const pct = calculateClassPercentage(cls);
                const isSelected = cls.id === selectedClassId;
                const hasDelay = delays[cls.id];
                const isMyAssignedClass = cls.teacherId === currentUser?.id;

                return (
                  <button
                    key={cls.id}
                    onClick={() => setSelectedClassId(cls.id)}
                    className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-3 transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-indigo-600 text-white shadow-md scale-102'
                        : isMyAssignedClass && currentRole === 'coordinator'
                        ? 'bg-emerald-50/80 hover:bg-emerald-100/80 text-emerald-950 border border-emerald-300'
                        : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      <span>{cls.name}</span>
                      {currentRole === 'coordinator' && isMyAssignedClass && (
                        <span className={`text-[9px] px-1.5 py-0.2 rounded font-extrabold ${
                          isSelected ? 'bg-white/25 text-white' : 'bg-emerald-200 text-emerald-800'
                        }`}>
                          قسمي
                        </span>
                      )}
                    </div>
                    <span
                      className={`px-2 py-0.5 rounded-md text-[10px] font-mono font-bold ${
                        isSelected ? 'bg-white/20 text-white' : 'bg-indigo-50 text-indigo-700'
                      }`}
                    >
                      {pct}%
                    </span>
                    {hasDelay && (
                      <span className="text-amber-300 text-xs" title="يوجد تأخر مسجل">⚠️</span>
                    )}
                  </button>
                );
              })}

              {(currentRole === 'coordinator' ? classes : myClasses).length === 0 && (
                <p className="text-xs text-slate-400 italic py-2">
                  لم يتم إسناد أي أقسام بعد لهذا الحساب. يمكن للمنسق إسناد الأقسام من لوحة التحكم.
                </p>
              )}
            </div>
          </div>

          {selectedClass && selectedCurriculum && (
            <>
              {/* Permission & Mode Notice Banner */}
              {!canEditProgress ? (
                <div className="bg-amber-50/90 border border-amber-200 rounded-2xl p-3.5 sm:p-4 flex items-center justify-between gap-3 text-amber-950 text-xs shadow-xs">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-amber-200 text-amber-800 flex items-center justify-center shrink-0">
                      <Eye className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-bold flex items-center gap-2 text-amber-950">
                        <span>وضع المعاينة والمتابعة البيداغوجية</span>
                        <span className="text-[10px] bg-amber-200/90 text-amber-900 px-2 py-0.5 rounded-full font-extrabold">
                          للمعاينة فقط (محمي من التعديل)
                        </span>
                      </div>
                      <p className="text-[11px] text-amber-800 mt-0.5">
                        هذا القسم مسند للأستاذ(ة): <strong className="font-extrabold text-amber-950">{assignedTeacher?.name || 'غير مسند'}</strong>. التأشير على الأسابيع وتسجيل التأخر متاح حصراً لأستاذ القسم.
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-emerald-50/90 border border-emerald-200 rounded-2xl p-3 sm:p-3.5 flex items-center justify-between gap-2 text-emerald-950 text-xs shadow-xs">
                  <div className="flex items-center gap-2.5 font-bold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>
                      هذا القسم مسند إليك <strong className="font-extrabold text-emerald-900">({selectedClass.name})</strong> — يمكنك التأشير على الأسابيع المنجزة وحفظ التأخر والاستدراك.
                    </span>
                  </div>
                </div>
              )}

              {/* Progress Summary Card */}
              <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                  {/* Left: Big percentage circle / meter */}
                  <div className="flex items-center gap-5 md:border-l md:border-slate-100 pl-4">
                    <div className="relative w-24 h-24 flex-shrink-0 flex items-center justify-center">
                      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                        <path
                          className="text-slate-100"
                          strokeWidth="3.5"
                          stroke="currentColor"
                          fill="none"
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                        <path
                          className="text-indigo-600 transition-all duration-700 stroke-current"
                          strokeWidth="3.5"
                          strokeDasharray={`${currentPercent}, 100`}
                          strokeLinecap="round"
                          fill="none"
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                      </svg>
                      <div className="absolute flex flex-col items-center justify-center text-center">
                        <span className="text-xl font-black text-indigo-950 font-mono">
                          {currentPercent}%
                        </span>
                        <span className="text-[9px] text-slate-400 font-bold">التقدم</span>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-black text-slate-800">{selectedClass.name}</h3>
                      <p className="text-xs text-indigo-600 font-bold">{selectedCurriculum.stream}</p>
                      <p className="text-xs text-slate-500 mt-1">
                        الأستاذ: <strong className="text-slate-700">{assignedTeacher?.name || 'غير محدد'}</strong>
                      </p>
                    </div>
                  </div>

                  {/* Middle: Curriculum Specs */}
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                      <span className="text-slate-400 block mb-1">الحجم الساعي:</span>
                      <span className="font-black text-slate-800">{selectedCurriculum.weeklyHours}</span>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                      <span className="text-slate-400 block mb-1">المعامل:</span>
                      <span className="font-black text-slate-800">{selectedCurriculum.coeff}</span>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                      <span className="text-slate-400 block mb-1">الأسابيع المؤشر عليها:</span>
                      <span className="font-black text-indigo-600">{completedWeeksCount} أسبوع</span>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                      <span className="text-slate-400 block mb-1">إجمالي الأسابيع:</span>
                      <span className="font-black text-slate-800">30 أسبوع دراسي</span>
                    </div>
                  </div>

                  {/* Right: Quick Instructions */}
                  <div className={`border rounded-2xl p-4 text-xs leading-relaxed ${
                    canEditProgress
                      ? 'bg-indigo-50/60 border-indigo-100 text-indigo-900'
                      : 'bg-slate-50 border-slate-200 text-slate-700'
                  }`}>
                    <div className="flex items-center gap-1.5 font-bold mb-1.5">
                      {canEditProgress ? (
                        <>
                          <CalendarCheck className="w-4 h-4 text-indigo-800" />
                          <span className="text-indigo-800">طريقة التأشير:</span>
                        </>
                      ) : (
                        <>
                          <Eye className="w-4 h-4 text-slate-600" />
                          <span className="text-slate-800">متابعة تقدم الأستاذ:</span>
                        </>
                      )}
                    </div>
                    {canEditProgress
                      ? 'اضغط على خانة الاختيار بجانب الأسبوع الذي أتممت تدريسه مع تلاميذ هذا القسم. سيتم تحديث النسبة المئوية الرسمية فوراً وحفظها في قاعدة البيانات.'
                      : `يمكنك هنا متابعة التدرج المنجز من طرف الزميل (${assignedTeacher?.name || 'أستاذ الفوج'}). لتعديل التأشير يجب أن يتم من حساب أستاذ هذا القسم.`}
                  </div>
                </div>
              </div>

              {/* DELAY SECTION: Notification & Reason Entry */}
              {currentClassDelay ? (
                /* Card when a delay is recorded */
                <div className="bg-amber-50 border-2 border-amber-300 rounded-3xl p-5 shadow-xs text-amber-950 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-start gap-3 max-w-2xl">
                    <div className="w-10 h-10 rounded-2xl bg-amber-200 text-amber-800 flex items-center justify-center shrink-0 mt-0.5">
                      <AlertTriangle className="w-5 h-5 text-amber-700" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-black text-sm text-amber-900">
                          تم تسجيل تأخر بيداغوجي في هذا القسم
                        </h4>
                        <span className="text-[10px] text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full font-bold">
                          يحتاج استدراك
                        </span>
                      </div>
                      <p className="text-xs text-amber-900 mt-1 font-semibold leading-relaxed">
                        <strong className="text-amber-950">سبب التأخر: </strong>
                        {currentClassDelay.reason}
                      </p>
                      {currentClassDelay.catchupPlan && (
                        <p className="text-xs text-amber-800 mt-1 leading-relaxed">
                          <strong className="text-amber-900">خطة الاستدراك: </strong>
                          {currentClassDelay.catchupPlan}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Actions for delay */}
                  <div className="flex items-center gap-2">
                    {canEditProgress ? (
                      <>
                        <button
                          onClick={handleOpenDelayModal}
                          className="px-3 py-1.5 rounded-xl bg-white text-amber-900 hover:bg-amber-100 border border-amber-200 font-bold text-xs flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
                        >
                          <Edit3 className="w-3.5 h-3.5 text-amber-700" />
                          <span>تعديل السبب</span>
                        </button>
                        <button
                          onClick={handleDeleteDelayClick}
                          className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
                          title="تم استدراك التأخر بنجاح"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>تم الاستدراك</span>
                        </button>
                      </>
                    ) : (
                      <div className="flex items-center gap-1.5 text-xs text-amber-900 bg-amber-100/80 border border-amber-300 px-3 py-1.5 rounded-xl font-bold">
                        <Eye className="w-3.5 h-3.5 text-amber-700" />
                        <span>مسجل بواسطة: {assignedTeacher?.name || 'أستاذ القسم'}</span>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                /* Prompt bar when no delay is recorded */
                <div className="bg-slate-50 border border-dashed border-slate-300 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2 text-slate-600">
                    <AlertCircle className="w-4 h-4 text-slate-400" />
                    <span>
                      {canEditProgress
                        ? 'هل يواجه هذا القسم تأخراً عن التوزيع السنوي الرسمي؟'
                        : 'لم يسجل أستاذ هذا القسم أي تأخر بيداغوجي حتى الآن.'}
                    </span>
                  </div>
                  {canEditProgress ? (
                    <button
                      onClick={handleOpenDelayModal}
                      className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
                    >
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>تسجيل سبب التأخر وخطة الاستدراك</span>
                    </button>
                  ) : (
                    <span className="text-[11px] text-slate-400 font-bold">
                      (تسجيل التأخر محجوز لأستاذ الفوج)
                    </span>
                  )}
                </div>
              )}

              {/* Term Filter Bar & Coordinator Curriculum Edit Actions */}
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-500">تصفية الفصل:</span>
                  {['all', '1', '2', '3'].map((t) => (
                    <button
                      key={t}
                      onClick={() => setTermFilter(t)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        termFilter === t
                          ? 'bg-slate-900 text-white shadow-xs'
                          : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {t === 'all' ? 'كامل السنة' : `الفصل ${t}`}
                    </button>
                  ))}
                </div>

                {/* Coordinator Curriculum Edit Buttons */}
                {currentRole === 'coordinator' && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleOpenAddWeekModal}
                      className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition cursor-pointer"
                    >
                      <PlusCircle className="w-4 h-4" />
                      <span>إضافة أسبوع / درس للتوزيع</span>
                    </button>

                    <button
                      onClick={handleResetCurriculumClick}
                      className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-xs transition cursor-pointer"
                      title="استعادة التوزيع الوزاري الأصلي لهذه الشعبة"
                    >
                      <span>استعادة التوزيع الأصلي</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Interactive Curriculum Table */}
              <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-right text-xs">
                    <thead>
                      <tr className="bg-slate-50 text-slate-600 border-b border-slate-200 font-bold">
                        <th className="py-3.5 px-4 text-center w-14">التأشير</th>
                        <th className="py-3.5 px-4 text-center w-16">الأسبوع</th>
                        <th className="py-3.5 px-4 w-40">التاريخ</th>
                        <th className="py-3.5 px-4">الوحدة المقررة</th>
                        <th className="py-3.5 px-4 text-center w-20">النسبة %</th>
                        <th className="py-3.5 px-4 text-center w-36">التقويم والوقفات</th>
                        {currentRole === 'coordinator' && (
                          <th className="py-3.5 px-4 text-center w-24">إجراءات المنسق</th>
                        )}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {weeksToDisplay.map((w, index) => {
                        const isChecked = checkedWeeks.includes(w.num);
                        const isHoliday = w.isHoliday;

                        return (
                          <tr
                            key={index}
                            onClick={() => {
                              if (!canEditProgress || isHoliday) return;
                              onToggleWeek(selectedClass.id, w.num);
                            }}
                            className={`transition-colors select-none ${
                              isHoliday
                                ? 'bg-amber-50/50 text-amber-900'
                                : isChecked
                                ? canEditProgress
                                  ? 'bg-indigo-50/40 text-slate-900 cursor-pointer active:bg-indigo-100/60'
                                  : 'bg-indigo-50/20 text-slate-900 cursor-default'
                                : canEditProgress
                                ? 'hover:bg-slate-50/80 text-slate-700 cursor-pointer active:bg-slate-100'
                                : 'text-slate-700 cursor-default'
                            }`}
                          >
                            {/* Checkbox */}
                            <td className="py-2.5 sm:py-3 px-3 sm:px-4 text-center">
                              {!isHoliday ? (
                                <button
                                  type="button"
                                  disabled={!canEditProgress}
                                  title={
                                    !canEditProgress
                                      ? 'التأشير متاح فقط لأستاذ القسم المسند'
                                      : isChecked
                                      ? 'إلغاء التأشير'
                                      : 'تأشير الأسبوع كمنجز'
                                  }
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    if (!canEditProgress) return;
                                    onToggleWeek(selectedClass.id, w.num);
                                  }}
                                  className={`w-7 h-7 sm:w-6 sm:h-6 rounded-lg border flex items-center justify-center transition-all mx-auto ${
                                    isChecked
                                      ? 'bg-indigo-600 border-indigo-600 text-white shadow-xs'
                                      : 'border-slate-300 bg-white hover:border-indigo-400'
                                  } ${!canEditProgress ? 'cursor-not-allowed opacity-80' : 'cursor-pointer'}`}
                                >
                                  {isChecked ? (
                                    <CheckSquare className="w-4 h-4" />
                                  ) : (
                                    <Square className="w-4 h-4 text-transparent" />
                                  )}
                                </button>
                              ) : (
                                <span className="text-amber-500 text-xs">🌴</span>
                              )}
                            </td>

                            {/* Week Number */}
                            <td className="py-2.5 sm:py-3 px-3 sm:px-4 text-center font-mono font-bold text-slate-800">
                              {w.num}
                            </td>

                            {/* Date range */}
                            <td className="py-2.5 sm:py-3 px-3 sm:px-4 font-mono text-[10px] sm:text-[11px] text-slate-500 whitespace-nowrap" dir="ltr">
                              {w.dates}
                            </td>

                            {/* Unit Name */}
                            <td className="py-3 px-4">
                              <span className={`font-bold ${isChecked ? 'text-indigo-950 font-extrabold' : ''}`}>
                                {w.unit}
                              </span>
                            </td>

                            {/* Percentage */}
                            <td className="py-3 px-4 text-center font-mono font-bold text-indigo-700">
                              {w.percent > 0 ? `${w.percent}%` : '-'}
                            </td>

                            {/* Evaluation / Exam Pill */}
                            <td className="py-3 px-4 text-center">
                              {w.evalType ? (
                                <span
                                  className={`px-2.5 py-1 rounded-full text-[10px] font-bold inline-block ${
                                    w.evalType.includes('اختبار') || w.evalType.includes('بكالوريا')
                                      ? 'bg-purple-100 text-purple-800 border border-purple-200'
                                      : w.evalType.includes('فرض')
                                      ? 'bg-blue-100 text-blue-800 border border-blue-200'
                                      : w.evalType.includes('واجب')
                                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                                      : w.evalType.includes('عطلة')
                                      ? 'bg-amber-100 text-amber-800 border border-amber-200'
                                      : 'bg-slate-100 text-slate-700'
                                  }`}
                                >
                                  {w.evalType}
                                </span>
                              ) : (
                                <span className="text-slate-300">-</span>
                              )}
                            </td>

                            {/* Coordinator Actions */}
                            {currentRole === 'coordinator' && (
                              <td className="py-3 px-4 text-center whitespace-nowrap">
                                <div className="flex items-center justify-center gap-1.5">
                                  <button
                                    onClick={() => handleOpenEditWeekModal(w, index)}
                                    title="تعديل هذا الأسبوع"
                                    className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition cursor-pointer"
                                  >
                                    <Edit3 className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteWeek(w, index)}
                                    title="حذف هذا الأسبوع"
                                    className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 transition cursor-pointer"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </td>
                            )}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* VIEW 2: ALL TEACHERS PROGRESS COMPARISON */}
      {subTab === 'all_teachers' && (
        <div className="space-y-6">
          {/* Stream Filter */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-slate-500" />
              <span className="text-xs font-bold text-slate-600">تصفية حسب المستوى الدراسي:</span>
              <select
                value={streamFilter}
                onChange={(e) => setStreamFilter(e.target.value)}
                className="text-xs font-bold bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 focus:border-indigo-500 outline-none"
              >
                <option value="all">جميع المستويات والشعب</option>
                {STREAMS_LIST.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.stream}
                  </option>
                ))}
              </select>
            </div>

            <p className="text-xs text-slate-500">
              إجمالي الأقسام المعروضة: <strong className="text-slate-800">{classes.length} أقسام</strong>
            </p>
          </div>

          {/* Cards for each Level / Stream */}
          <div className="space-y-6">
            {STREAMS_LIST
              .filter((c) => streamFilter === 'all' || c.id === streamFilter)
              .map((curriculum) => {
                const streamClasses = classes.filter((cls) => cls.streamId === curriculum.id);
                if (streamClasses.length === 0) return null;

                return (
                  <div
                    key={curriculum.id}
                    className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4"
                  >
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                      <div>
                        <h3 className="font-black text-base text-slate-900">{curriculum.stream}</h3>
                        <p className="text-xs text-slate-400">
                          الحجم الساعي: {curriculum.weeklyHours} | المعامل: {curriculum.coeff}
                        </p>
                      </div>
                      <span className="px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold">
                        {streamClasses.length} أقسام في المؤسسة
                      </span>
                    </div>

                    {/* Progress bars for each class in this stream */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {streamClasses.map((cls) => {
                        const teacher = teachers.find((t) => t.id === cls.teacherId);
                        const pct = calculateClassPercentage(cls);
                        const checkedCount = (progress[cls.id] || []).length;
                        const classDelay = delays[cls.id];

                        // Find the last completed unit name
                        const lastWeekNum = (progress[cls.id] || []).slice(-1)[0];
                        const lastUnit = curriculum.weeks.find((w) => w.num === lastWeekNum);

                        return (
                          <div
                            key={cls.id}
                            className={`p-4 rounded-2xl border transition-all ${
                              classDelay
                                ? 'bg-amber-50/50 border-amber-200 hover:border-amber-400'
                                : 'bg-slate-50/80 border-slate-200/80 hover:border-indigo-300'
                            }`}
                          >
                            <div className="flex items-center justify-between mb-2">
                              <div>
                                <div className="flex items-center gap-2">
                                  <h4 className="font-black text-sm text-slate-800">{cls.name}</h4>
                                  {classDelay && (
                                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-200 text-amber-900 border border-amber-300">
                                      ⚠️ متأخر
                                    </span>
                                  )}
                                </div>
                                <span className="text-xs text-slate-500">
                                  الأستاذ: <strong className="text-indigo-900">{teacher?.name || 'غير مسند'}</strong>
                                </span>
                              </div>
                              <div className="text-left font-mono font-black text-lg text-indigo-700">
                                {pct}%
                              </div>
                            </div>

                            {/* Progress bar */}
                            <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden mb-2">
                              <div
                                className={`h-full rounded-full transition-all duration-500 ${
                                  classDelay ? 'bg-amber-500' : 'bg-indigo-600'
                                }`}
                                style={{ width: `${pct}%` }}
                              ></div>
                            </div>

                            <div className="flex items-center justify-between text-[11px] text-slate-500">
                              <span>أنجز: {checkedCount} أسبوع</span>
                              {lastUnit ? (
                                <span className="truncate max-w-[200px]" title={lastUnit.unit}>
                                  آخر وحدة: {lastUnit.unit}
                                </span>
                              ) : (
                                <span className="italic text-slate-400">لم يسجل أي أسبوع بعد</span>
                              )}
                            </div>

                            {/* Delay details if reported */}
                            {classDelay && (
                              <div className="mt-3 pt-2.5 border-t border-amber-200/60 text-[11px] text-amber-900">
                                <p className="font-bold">
                                  <span>سبب التأخر: </span>
                                  <span className="font-normal">{classDelay.reason}</span>
                                </p>
                                {classDelay.catchupPlan && (
                                  <p className="mt-1 text-amber-800">
                                    <span className="font-bold">الاستدراك: </span>
                                    <span>{classDelay.catchupPlan}</span>
                                  </p>
                                )}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* MODAL: ENTER / EDIT DELAY REASON */}
      {showDelayModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn text-right">
          <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl p-6 border border-slate-100">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                  <AlertTriangle className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">
                    تسجيل سبب التأخر في البرنامج
                  </h3>
                  <span className="text-xs text-indigo-600 font-bold">
                    القسم: {selectedClass?.name} ({selectedCurriculum?.stream})
                  </span>
                </div>
              </div>
              <button
                onClick={() => setShowDelayModal(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-500 mb-4">
              وضح أسباب تأخر تقدم البرنامج لمساعدة منسق المادة وإدارة المؤسسة على توفير حصص استدراكية وتوحيد الوتيرة قبل الفروض والاختبارات.
            </p>

            <form onSubmit={handleSaveDelaySubmit} className="space-y-4">
              {/* Quick Reason Suggestions */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  أسباب شائعة (اضغط للاختيار السريع):
                </label>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {commonReasons.map((r, i) => (
                    <button
                      type="button"
                      key={i}
                      onClick={() => setDelayReason(r)}
                      className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-slate-100 hover:bg-amber-100 hover:text-amber-900 text-slate-700 transition-all border border-slate-200"
                    >
                      {r}
                    </button>
                  ))}
                </div>

                <label className="block text-xs font-bold text-slate-700 mb-1">
                  سبب التأخر (يمكنك التعديل أو الكتابة بحرية):
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="مثال: صعوبة استيعاب الوحدة 02 وحاجة التلاميذ لحصص تمارين إضافية..."
                  value={delayReason}
                  onChange={(e) => setDelayReason(e.target.value)}
                  className="w-full text-xs font-semibold py-2.5 px-3 rounded-xl border border-slate-200 focus:border-amber-500 focus:bg-amber-50/20 outline-none"
                />
              </div>

              {/* Catchup Plan */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  خطة الاستدراك المقترحة (اختياري):
                </label>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {commonPlans.map((p, i) => (
                    <button
                      type="button"
                      key={i}
                      onClick={() => setCatchupPlan(p)}
                      className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-slate-100 hover:bg-indigo-100 hover:text-indigo-900 text-slate-700 transition-all border border-slate-200"
                    >
                      {p}
                    </button>
                  ))}
                </div>

                <input
                  type="text"
                  placeholder="مثال: برمجة حصة استدراكية يوم السبت القادم لاستكمال التمارين..."
                  value={catchupPlan}
                  onChange={(e) => setCatchupPlan(e.target.value)}
                  className="w-full text-xs font-semibold py-2.5 px-3 rounded-xl border border-slate-200 focus:border-amber-500 outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowDelayModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={!delayReason.trim()}
                  className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-sm transition-all disabled:opacity-50"
                >
                  حفظ سبب التأخر
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: COORDINATOR ADD / EDIT WEEK IN CURRICULUM */}
      {weekModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn text-right">
          <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl p-6 border border-slate-100 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-indigo-100 text-indigo-800 flex items-center justify-center font-bold">
                  <Edit3 className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">
                    {editingWeekIndex !== null ? 'تعديل الأسبوع في التوزيع السنوي' : 'إضافة أسبوع جديد للتوزيع السنوي'}
                  </h3>
                  <span className="text-xs text-indigo-600 font-bold">
                    شعبة: {selectedCurriculum?.stream || selectedClass?.stream}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setWeekModalOpen(false)}
                className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveWeek} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    رقم الأسبوع / الرمز:
                  </label>
                  <input
                    type="text"
                    required
                    value={weekFormData.num}
                    onChange={(e) => setWeekFormData({ ...weekFormData, num: e.target.value })}
                    placeholder="مثال: 12 أو ع2"
                    className="w-full text-xs font-bold py-2 px-3 rounded-xl border border-slate-200 focus:border-indigo-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    الفصل الدراسي:
                  </label>
                  <select
                    value={weekFormData.term}
                    onChange={(e) => setWeekFormData({ ...weekFormData, term: Number(e.target.value) })}
                    className="w-full text-xs font-bold py-2 px-3 rounded-xl border border-slate-200 focus:border-indigo-500 outline-none"
                  >
                    <option value={1}>الفصل الأول</option>
                    <option value={2}>الفصل الثاني</option>
                    <option value={3}>الفصل الثالث</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  فترة الأسبوع / التواريخ:
                </label>
                <input
                  type="text"
                  value={weekFormData.dates}
                  onChange={(e) => setWeekFormData({ ...weekFormData, dates: e.target.value })}
                  placeholder="مثال: 2026/10/11 - 2026/10/15"
                  className="w-full text-xs font-mono font-bold py-2 px-3 rounded-xl border border-slate-200 focus:border-indigo-500 outline-none text-left"
                  dir="ltr"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  عنوان الوحدة المقررة أو النشاط: *
                </label>
                <textarea
                  required
                  rows={2}
                  value={weekFormData.unit}
                  onChange={(e) => setWeekFormData({ ...weekFormData, unit: e.target.value })}
                  placeholder="مثال: 02: تطور جملة ميكانيكية (10 سا + 05 أ م)..."
                  className="w-full text-xs font-bold py-2 px-3 rounded-xl border border-slate-200 focus:border-indigo-500 outline-none leading-relaxed"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    نسبة التقدم التراكمية %:
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={weekFormData.percent}
                    onChange={(e) => setWeekFormData({ ...weekFormData, percent: e.target.value })}
                    className="w-full text-xs font-bold py-2 px-3 rounded-xl border border-slate-200 focus:border-indigo-500 outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    التقويم والوقفات البيداغوجية:
                  </label>
                  <input
                    type="text"
                    value={weekFormData.evalType}
                    onChange={(e) => setWeekFormData({ ...weekFormData, evalType: e.target.value })}
                    placeholder="مثال: فرض 1، واجب 1، اختبار..."
                    className="w-full text-xs font-bold py-2 px-3 rounded-xl border border-slate-200 focus:border-indigo-500 outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="isHolidayCheck"
                  checked={weekFormData.isHoliday}
                  onChange={(e) => setWeekFormData({ ...weekFormData, isHoliday: e.target.checked })}
                  className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                />
                <label htmlFor="isHolidayCheck" className="text-xs font-bold text-slate-700 cursor-pointer">
                  هذا الأسبوع عطلة مدرسية رسمية (لا يحتسب في النسبة المئوية)
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setWeekModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-sm transition-all cursor-pointer"
                >
                  {editingWeekIndex !== null ? 'حفظ تعديل الأسبوع' : 'إضافة الأسبوع'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
