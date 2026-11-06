import React, { useState, useMemo } from 'react';
import {
  CheckSquare,
  Square,
  BookOpen,
  Filter,
  CheckCircle2,
  Circle,
  TrendingUp,
  Award,
  Search,
  Printer,
  ChevronDown,
  ChevronUp,
  FlaskConical,
  GraduationCap,
  Sparkles,
  CheckCheck,
  RotateCcw,
  PlusCircle,
  Edit3,
  Trash2,
  FolderPlus,
  Plus
} from 'lucide-react';
import { SYLLABUS_DATA } from '../data/syllabusData';
import LogbookPrintModal from './LogbookPrintModal';

export default function LogbookTab({
  classes = [],
  teachers = [],
  currentUser,
  currentRole,
  config,
  syllabusData,
  logbookData = {},
  onToggleItem,
  onToggleUnit,
  onUpdateSyllabus,
  onResetSyllabus
}) {
  // Accessible classes: for teacher -> their classes; for coordinator -> all classes
  const myClasses = useMemo(() => {
    if (currentRole === 'coordinator') {
      return classes;
    }
    const assigned = classes.filter((c) => c.teacherId === currentUser?.id);
    return assigned.length > 0 ? assigned : classes;
  }, [classes, currentUser, currentRole]);

  // Selected Class ID
  const [selectedClassId, setSelectedClassId] = useState(() => {
    return myClasses[0]?.id || classes[0]?.id || '';
  });

  // Selected class object
  const currentClass = useMemo(() => {
    return classes.find((c) => c.id === selectedClassId) || myClasses[0] || classes[0] || null;
  }, [classes, myClasses, selectedClassId]);

  // Assigned teacher
  const assignedTeacher = useMemo(() => {
    if (!currentClass?.teacherId) return null;
    return teachers.find((t) => t.id === currentClass.teacherId);
  }, [teachers, currentClass]);

  // Stream syllabus data
  const classStreamId = currentClass?.streamId || '3as_se';
  const allSyllabus = syllabusData || SYLLABUS_DATA;
  const syllabus = useMemo(() => {
    return allSyllabus[classStreamId] || allSyllabus['3as_se'];
  }, [allSyllabus, classStreamId]);

  // Checked items array for this class: ['3as_se_u1_1', '3as_se_u1_2', ...]
  const checkedItems = useMemo(() => {
    if (!currentClass) return [];
    const val = logbookData[currentClass.id];
    return Array.isArray(val) ? val : [];
  }, [logbookData, currentClass]);

  // Filter state: 'all' | 'completed' | 'pending'
  const [statusFilter, setStatusFilter] = useState('all');

  // Search filter
  const [searchQuery, setSearchQuery] = useState('');

  // Selected unit filter: 'all' or unit.id
  const [selectedUnitFilter, setSelectedUnitFilter] = useState('all');

  // Print modal state
  const [showPrintModal, setShowPrintModal] = useState(false);

  // Coordinator Unit Modal (Add / Edit Unit)
  const [unitModalOpen, setUnitModalOpen] = useState(false);
  const [editingUnitId, setEditingUnitId] = useState(null);
  const [unitFormData, setUnitFormData] = useState({
    number: '',
    title: ''
  });

  // Coordinator Lesson/Item Modal (Add / Edit Lesson)
  const [itemModalOpen, setItemModalOpen] = useState(false);
  const [targetUnitForNewItem, setTargetUnitForNewItem] = useState(null);
  const [editingItemId, setEditingItemId] = useState(null);
  const [itemFormData, setItemFormData] = useState({
    title: '',
    type: 'درس نظري'
  });

  // Total lessons count in the whole syllabus
  const allSyllabusItems = useMemo(() => {
    if (!syllabus?.units) return [];
    return syllabus.units.flatMap((u) => (u.items || []).map((it) => ({ ...it, unitTitle: u.title, unitNumber: u.number })));
  }, [syllabus]);

  const totalLessons = allSyllabusItems.length;
  const completedLessons = useMemo(() => {
    return allSyllabusItems.filter((it) => checkedItems.includes(it.id)).length;
  }, [allSyllabusItems, checkedItems]);

  const completionPercentage = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

  // Toggle single item
  const handleItemClick = (itemId) => {
    if (!currentClass) return;
    onToggleItem(currentClass.id, itemId);
  };

  // Toggle all items in a unit
  const handleUnitToggleAll = (unit, markCompleted) => {
    if (!currentClass || !unit.items) return;
    const itemIds = unit.items.map((it) => it.id);
    onToggleUnit(currentClass.id, itemIds, markCompleted);
  };

  // --- COORDINATOR UNIT HANDLERS ---
  const handleOpenAddUnit = () => {
    const nextNumber = (syllabus?.units?.length || 0) + 1;
    setEditingUnitId(null);
    setUnitFormData({
      number: nextNumber,
      title: `الوحدة ${nextNumber}: `
    });
    setUnitModalOpen(true);
  };

  const handleOpenEditUnit = (unit) => {
    setEditingUnitId(unit.id);
    setUnitFormData({
      number: unit.number || '',
      title: unit.title || ''
    });
    setUnitModalOpen(true);
  };

  const handleSaveUnit = (e) => {
    e.preventDefault();
    if (!unitFormData.title.trim() || !onUpdateSyllabus) return;
    const currentUnits = [...(syllabus?.units || [])];
    if (editingUnitId) {
      const idx = currentUnits.findIndex((u) => u.id === editingUnitId);
      if (idx !== -1) {
        currentUnits[idx] = {
          ...currentUnits[idx],
          number: Number(unitFormData.number) || currentUnits[idx].number,
          title: unitFormData.title.trim()
        };
      }
    } else {
      const newUnitId = `${classStreamId}_u_${Date.now()}`;
      currentUnits.push({
        id: newUnitId,
        number: Number(unitFormData.number) || currentUnits.length + 1,
        title: unitFormData.title.trim(),
        items: []
      });
    }

    onUpdateSyllabus(classStreamId, {
      ...syllabus,
      units: currentUnits
    });
    setUnitModalOpen(false);
  };

  const handleDeleteUnit = (unit) => {
    if (!window.confirm(`هل أنت متأكد من حذف الوحدة "${unit.title}" وجميع دروسها من المنهاج؟`)) return;
    if (!onUpdateSyllabus) return;
    const updatedUnits = (syllabus?.units || []).filter((u) => u.id !== unit.id);
    onUpdateSyllabus(classStreamId, {
      ...syllabus,
      units: updatedUnits
    });
  };

  // --- COORDINATOR LESSON HANDLERS ---
  const handleOpenAddItem = (unit) => {
    setTargetUnitForNewItem(unit);
    setEditingItemId(null);
    setItemFormData({
      title: '',
      type: 'درس نظري'
    });
    setItemModalOpen(true);
  };

  const handleOpenEditItem = (unit, item) => {
    setTargetUnitForNewItem(unit);
    setEditingItemId(item.id);
    setItemFormData({
      title: item.title,
      type: item.type || 'درس نظري'
    });
    setItemModalOpen(true);
  };

  const handleSaveItem = (e) => {
    e.preventDefault();
    if (!itemFormData.title.trim() || !targetUnitForNewItem || !onUpdateSyllabus) return;
    const currentUnits = JSON.parse(JSON.stringify(syllabus?.units || []));
    const uIdx = currentUnits.findIndex((u) => u.id === targetUnitForNewItem.id);
    if (uIdx === -1) return;

    if (!currentUnits[uIdx].items) currentUnits[uIdx].items = [];

    if (editingItemId) {
      const itIdx = currentUnits[uIdx].items.findIndex((it) => it.id === editingItemId);
      if (itIdx !== -1) {
        currentUnits[uIdx].items[itIdx] = {
          ...currentUnits[uIdx].items[itIdx],
          title: itemFormData.title.trim(),
          type: itemFormData.type
        };
      }
    } else {
      const newItemId = `${classStreamId}_it_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`;
      currentUnits[uIdx].items.push({
        id: newItemId,
        title: itemFormData.title.trim(),
        type: itemFormData.type
      });
    }

    onUpdateSyllabus(classStreamId, {
      ...syllabus,
      units: currentUnits
    });
    setItemModalOpen(false);
  };

  const handleDeleteItem = (unit, item) => {
    if (!window.confirm(`هل أنت متأكد من حذف الدرس "${item.title}" من هذه الوحدة؟`)) return;
    if (!onUpdateSyllabus) return;
    const currentUnits = JSON.parse(JSON.stringify(syllabus?.units || []));
    const uIdx = currentUnits.findIndex((u) => u.id === unit.id);
    if (uIdx === -1) return;

    currentUnits[uIdx].items = currentUnits[uIdx].items.filter((it) => it.id !== item.id);
    onUpdateSyllabus(classStreamId, {
      ...syllabus,
      units: currentUnits
    });
  };

  const handleResetSyllabusClick = () => {
    if (!window.confirm('هل أنت متأكد من استعادة منهاج دفتر النصوص الوزاري الافتراضي لهذه الشعبة؟')) return;
    if (!onResetSyllabus) return;
    onResetSyllabus(classStreamId);
  };

  return (
    <div className="space-y-6" style={{ direction: 'rtl' }}>
      
      {/* Top Banner: Class Selector & Quick Progress Metrics */}
      <div className="bg-white rounded-3xl shadow-xs border border-slate-200/80 p-4 sm:p-6 transition-all">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 sm:gap-4 border-b border-slate-100 pb-4 sm:pb-5">
          {/* Service Identity */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 shrink-0">
              <BookOpen className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-xl font-black text-slate-800 tracking-tight">
                  دفتر النصوص: التأشير على الدروس
                </h2>
                <span className="px-2 py-0.5 text-[10px] sm:text-[11px] font-bold rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0">
                  السير المنهجي
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5">
                يؤشر الأستاذ مباشرة على الدروس والأنشطة المنجزة في القسم
              </p>
            </div>
          </div>

          {/* Class Switcher, Print & Coordinator Actions */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Class Dropdown */}
            <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-2xl border border-slate-200 w-full sm:w-auto">
              <span className="text-xs font-bold text-slate-600 shrink-0">القسم:</span>
              <select
                value={selectedClassId}
                onChange={(e) => setSelectedClassId(e.target.value)}
                className="bg-transparent font-black text-slate-800 text-xs sm:text-sm focus:outline-hidden cursor-pointer w-full"
              >
                {myClasses.map((cls) => (
                  <option key={cls.id} value={cls.id}>
                    {cls.name} ({cls.stream || cls.streamId})
                  </option>
                ))}
              </select>
            </div>

            {/* Coordinator Add Unit Button */}
            {currentRole === 'coordinator' && (
              <>
                <button
                  onClick={handleOpenAddUnit}
                  className="px-3 py-1.5 sm:py-2 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition cursor-pointer"
                  title="إضافة وحدة تعليمية جديدة لمنهاج هذه الشعبة"
                >
                  <FolderPlus className="w-4 h-4" />
                  <span>إضافة وحدة</span>
                </button>

                <button
                  onClick={handleResetSyllabusClick}
                  className="px-3 py-1.5 sm:py-2 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-xs transition cursor-pointer"
                  title="استعادة منهاج دفتر النصوص الوزاري الأصلي لهذه الشعبة"
                >
                  <span>استعادة الأصلي</span>
                </button>
              </>
            )}

            {/* Print Official Cahier Button */}
            <button
              onClick={() => setShowPrintModal(true)}
              className="px-3.5 py-1.5 sm:py-2 rounded-2xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center gap-1.5 transition cursor-pointer border border-emerald-200 shadow-xs"
            >
              <Printer className="w-4 h-4 text-emerald-600" />
              <span>طباعة دفتر النصوص</span>
            </button>
          </div>
        </div>

        {/* Selected Class Meta info & Progress Bar */}
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
          {/* Class & Teacher Details */}
          <div className="text-xs space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-slate-500 font-bold">الشعبة:</span>
              <span className="font-black text-indigo-600">{syllabus?.streamName || currentClass?.stream}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-slate-500 font-bold">الأستاذ(ة):</span>
              <span className="font-bold text-slate-800">{assignedTeacher?.name || 'غير مسند'}</span>
            </div>
          </div>

          {/* Progress Counters */}
          <div className="flex items-center justify-center gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-100">
            <div className="text-center">
              <div className="text-xl font-black text-emerald-700 font-mono">
                {completedLessons}
              </div>
              <div className="text-[10px] font-bold text-slate-500">دروس مدروسة</div>
            </div>
            <span className="text-slate-300 font-bold text-lg">/</span>
            <div className="text-center">
              <div className="text-xl font-black text-slate-700 font-mono">
                {totalLessons}
              </div>
              <div className="text-[10px] font-bold text-slate-500">إجمالي الدروس</div>
            </div>
            <span className="text-slate-300 font-bold text-lg">/</span>
            <div className="text-center">
              <div className="text-xl font-black text-indigo-600 font-mono">
                {completionPercentage}%
              </div>
              <div className="text-[10px] font-bold text-slate-500">نسبة الإنجاز</div>
            </div>
          </div>

          {/* Visual Progress Bar */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-slate-700">تقدم إنجاز التعلمات:</span>
              <span className="font-mono font-black text-emerald-700">{completionPercentage}%</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden border border-slate-200">
              <div
                className="bg-gradient-to-r from-emerald-500 to-teal-500 h-full rounded-full transition-all duration-300"
                style={{ width: `${completionPercentage}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-3 rounded-2xl border border-slate-200 flex flex-wrap items-center justify-between gap-3">
        {/* Status Filter Buttons */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-xs font-bold text-slate-500 ml-1">عرض:</span>
          {[
            { id: 'all', label: `جميع التعلمات (${totalLessons})` },
            { id: 'completed', label: `المدروسة فقط (${completedLessons})` },
            { id: 'pending', label: `المتبقية (${totalLessons - completedLessons})` }
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setStatusFilter(f.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                statusFilter === f.id
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Unit Selector Filter */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-500">الوحدة:</span>
          <select
            value={selectedUnitFilter}
            onChange={(e) => setSelectedUnitFilter(e.target.value)}
            className="text-xs font-bold bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 focus:outline-hidden cursor-pointer max-w-[200px]"
          >
            <option value="all">جميع الوحدات المقررة</option>
            {syllabus?.units?.map((u) => (
              <option key={u.id} value={u.id}>
                {u.title}
              </option>
            ))}
          </select>
        </div>

        {/* Search */}
        <div className="relative min-w-[220px]">
          <input
            type="text"
            placeholder="بحث في الدروس أو التجارب..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-3 pr-8 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:border-emerald-500"
          />
          <Search className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2" />
        </div>
      </div>

      {/* Units & Checklist Table */}
      <div className="space-y-4">
        {(!syllabus?.units || syllabus.units.length === 0) ? (
          <div className="bg-white rounded-3xl p-12 text-center text-slate-400 border border-slate-200">
            <BookOpen className="w-12 h-12 mx-auto mb-3 text-slate-300" />
            <p className="font-bold">لا يوجد منهاج محدد لهذه الشعبة حالياً.</p>
            {currentRole === 'coordinator' && (
              <button
                onClick={handleOpenAddUnit}
                className="mt-3 px-4 py-2 bg-emerald-600 text-white rounded-xl font-bold text-xs"
              >
                + إضافة وحدة تعليمية
              </button>
            )}
          </div>
        ) : (
          syllabus.units.map((unit, uIdx) => {
            if (selectedUnitFilter !== 'all' && unit.id !== selectedUnitFilter) {
              return null;
            }

            const unitItems = unit.items || [];
            const filteredItems = unitItems.filter((item) => {
              const isChecked = checkedItems.includes(item.id);
              if (statusFilter === 'completed' && !isChecked) return false;
              if (statusFilter === 'pending' && isChecked) return false;
              if (searchQuery.trim()) {
                const q = searchQuery.toLowerCase();
                return item.title.toLowerCase().includes(q) || unit.title.toLowerCase().includes(q);
              }
              return true;
            });

            if (filteredItems.length === 0 && (searchQuery.trim() || statusFilter !== 'all')) {
              return null;
            }

            const unitTotal = unitItems.length;
            const unitCompleted = unitItems.filter((it) => checkedItems.includes(it.id)).length;
            const unitPct = unitTotal > 0 ? Math.round((unitCompleted / unitTotal) * 100) : 0;
            const isAllCompleted = unitCompleted === unitTotal && unitTotal > 0;

            return (
              <div
                key={unit.id || uIdx}
                className="bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden transition-all"
              >
                {/* Unit Header Bar */}
                <div className="bg-slate-50/80 px-4 sm:px-6 py-3.5 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-xs ${
                      isAllCompleted
                        ? 'bg-emerald-600 text-white'
                        : unitCompleted > 0
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-slate-200 text-slate-700'
                    }`}>
                      {unit.number || uIdx + 1}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm sm:text-base font-black text-slate-800">
                          {unit.title}
                        </h3>

                        {/* Coordinator Unit Edit/Delete Icons */}
                        {currentRole === 'coordinator' && (
                          <div className="flex items-center gap-1 mr-2">
                            <button
                              onClick={() => handleOpenEditUnit(unit)}
                              title="تعديل عنوان الوحدة"
                              className="p-1 rounded-md text-slate-400 hover:text-indigo-600 hover:bg-white transition cursor-pointer"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteUnit(unit)}
                              title="حذف هذه الوحدة بالكامل"
                              className="p-1 rounded-md text-slate-400 hover:text-rose-600 hover:bg-white transition cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}
                      </div>

                      <div className="text-[11px] text-slate-500 font-bold mt-0.5 flex items-center gap-2">
                        <span>أنجز: <span className="font-mono text-emerald-700">{unitCompleted}</span> من <span className="font-mono">{unitTotal}</span> درساً</span>
                        <span>•</span>
                        <span className="font-mono text-emerald-700 font-black">{unitPct}%</span>
                      </div>
                    </div>
                  </div>

                  {/* Batch Actions & Coordinator Add Lesson */}
                  <div className="flex items-center gap-2">
                    {currentRole === 'coordinator' && (
                      <button
                        type="button"
                        onClick={() => handleOpenAddItem(unit)}
                        className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 transition cursor-pointer flex items-center gap-1"
                        title="إضافة درس أو نشاط جديد لهذه الوحدة"
                      >
                        <Plus className="w-3.5 h-3.5 text-indigo-600" />
                        <span>إضافة درس للوحدة</span>
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => handleUnitToggleAll(unit, true)}
                      className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 transition cursor-pointer flex items-center gap-1"
                      title="التأشير على جميع دروس هذه الوحدة كمنجزة"
                    >
                      <CheckCheck className="w-3.5 h-3.5 text-emerald-600" />
                      <span>تأشير الكل</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleUnitToggleAll(unit, false)}
                      className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition cursor-pointer flex items-center gap-1"
                      title="إلغاء التأشير عن دروس هذه الوحدة"
                    >
                      <RotateCcw className="w-3 h-3 text-slate-500" />
                      <span>إلغاء الكل</span>
                    </button>
                  </div>
                </div>

                {/* Table of Lessons / Items */}
                <div className="overflow-x-auto">
                  <table className="w-full text-right text-xs">
                    <thead>
                      <tr className="bg-slate-100/70 text-slate-600 border-b border-slate-200 font-bold">
                        <th className="py-2.5 px-4 text-center w-16">التأشير</th>
                        <th className="py-2.5 px-4 text-center w-14">الرقم</th>
                        <th className="py-2.5 px-4 text-center w-28">نوع النشاط</th>
                        <th className="py-2.5 px-4">عنوان الدرس / السير المنهجي لتدرج التعلمات</th>
                        <th className="py-2.5 px-4 text-center w-28">الحالة</th>
                        {currentRole === 'coordinator' && (
                          <th className="py-2.5 px-4 text-center w-20">تعديل</th>
                        )}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredItems.map((item, itemIdx) => {
                        const isChecked = checkedItems.includes(item.id);

                        return (
                          <tr
                            key={item.id || itemIdx}
                            onClick={() => handleItemClick(item.id)}
                            className={`transition cursor-pointer select-none ${
                              isChecked
                                ? 'bg-emerald-50/40 hover:bg-emerald-50/70 text-slate-900'
                                : 'hover:bg-slate-50 text-slate-700'
                            }`}
                          >
                            {/* Checkbox */}
                            <td className="py-2.5 sm:py-3 px-2 sm:px-4 text-center">
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleItemClick(item.id);
                                }}
                                className={`w-7 h-7 sm:w-6 sm:h-6 rounded-lg border flex items-center justify-center transition-all mx-auto cursor-pointer ${
                                  isChecked
                                    ? 'bg-emerald-600 border-emerald-600 text-white shadow-xs'
                                    : 'border-slate-300 bg-white hover:border-emerald-400'
                                }`}
                              >
                                {isChecked ? (
                                  <CheckSquare className="w-4 h-4" />
                                ) : (
                                  <Square className="w-4 h-4 text-transparent" />
                                )}
                              </button>
                            </td>

                            {/* Item Index */}
                            <td className="py-2.5 sm:py-3 px-2 sm:px-4 text-center font-mono font-bold text-slate-400">
                              {itemIdx + 1}
                            </td>

                            {/* Activity Type Badge */}
                            <td className="py-2.5 sm:py-3 px-2 sm:px-4 text-center whitespace-nowrap">
                              <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                                item.type === 'عمل مخبري'
                                  ? 'bg-amber-100 text-amber-900 border border-amber-200'
                                  : item.type === 'أعمال موجهة'
                                  ? 'bg-blue-100 text-blue-900 border border-blue-200'
                                  : 'bg-emerald-100 text-emerald-900 border border-emerald-200'
                              }`}>
                                {item.type || 'درس نظري'}
                              </span>
                            </td>

                            {/* Lesson Title */}
                            <td className="py-2.5 sm:py-3 px-2 sm:px-4">
                              <span className={`block font-bold text-xs sm:text-sm leading-relaxed ${
                                isChecked ? 'text-emerald-950 font-black' : 'text-slate-800'
                              }`}>
                                {item.title}
                              </span>
                            </td>

                            {/* Status */}
                            <td className="py-3 px-4 text-center whitespace-nowrap">
                              {isChecked ? (
                                <span className="inline-flex items-center gap-1 text-[11px] font-black text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-full">
                                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                  <span>تم تدريسه</span>
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                                  <Circle className="w-3 h-3 text-slate-300" />
                                  <span>لم يدرس بعد</span>
                                </span>
                              )}
                            </td>

                            {/* Coordinator Actions for Lesson */}
                            {currentRole === 'coordinator' && (
                              <td
                                className="py-3 px-4 text-center whitespace-nowrap"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <div className="flex items-center justify-center gap-1">
                                  <button
                                    onClick={() => handleOpenEditItem(unit, item)}
                                    title="تعديل هذا الدرس"
                                    className="p-1 rounded-md text-slate-400 hover:text-indigo-600 hover:bg-slate-100 transition cursor-pointer"
                                  >
                                    <Edit3 className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteItem(unit, item)}
                                    title="حذف هذا الدرس"
                                    className="p-1 rounded-md text-slate-400 hover:text-rose-600 hover:bg-slate-100 transition cursor-pointer"
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
            );
          })
        )}
      </div>

      {/* MODAL: COORDINATOR ADD / EDIT UNIT */}
      {unitModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn text-right">
          <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-6 border border-slate-100 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                  <FolderPlus className="w-4 h-4 text-emerald-600" />
                </div>
                <h3 className="text-base font-black text-slate-900">
                  {editingUnitId ? 'تعديل بيانات الوحدة التعليمية' : 'إضافة وحدة تعليمية جديدة'}
                </h3>
              </div>
              <button
                onClick={() => setUnitModalOpen(false)}
                className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveUnit} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  رقم / ترتيب الوحدة:
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  value={unitFormData.number}
                  onChange={(e) => setUnitFormData({ ...unitFormData, number: e.target.value })}
                  className="w-full text-xs font-bold py-2 px-3 rounded-xl border border-slate-200 focus:border-emerald-500 outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  عنوان الوحدة المقررة: *
                </label>
                <textarea
                  required
                  rows={2}
                  value={unitFormData.title}
                  onChange={(e) => setUnitFormData({ ...unitFormData, title: e.target.value })}
                  placeholder="مثال: 01: المتابعة الزمنية لتحول كيميائي في وسط مائي..."
                  className="w-full text-xs font-bold py-2 px-3 rounded-xl border border-slate-200 focus:border-emerald-500 outline-none leading-relaxed"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setUnitModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm transition-all cursor-pointer"
                >
                  {editingUnitId ? 'حفظ التعديل' : 'إضافة الوحدة'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: COORDINATOR ADD / EDIT LESSON ITEM */}
      {itemModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn text-right">
          <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl p-6 border border-slate-100 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-800 flex items-center justify-center font-bold">
                  <Edit3 className="w-4 h-4 text-indigo-600" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">
                    {editingItemId ? 'تعديل الدرس في المنهاج' : 'إضافة درس / نشاط جديد للوحدة'}
                  </h3>
                  <span className="text-xs text-indigo-600 font-bold truncate max-w-[280px] block">
                    {targetUnitForNewItem?.title}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setItemModalOpen(false)}
                className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveItem} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  نوع النشاط:
                </label>
                <div className="flex flex-wrap gap-2">
                  {['درس نظري', 'عمل مخبري', 'أعمال موجهة'].map((t) => (
                    <button
                      type="button"
                      key={t}
                      onClick={() => setItemFormData({ ...itemFormData, type: t })}
                      className={`text-xs px-3 py-1.5 rounded-xl font-bold transition cursor-pointer border ${
                        itemFormData.type === t
                          ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                          : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  عنوان الدرس / السير المنهجي لتدرج التعلمات: *
                </label>
                <textarea
                  required
                  rows={3}
                  value={itemFormData.title}
                  onChange={(e) => setItemFormData({ ...itemFormData, title: e.target.value })}
                  placeholder="موضوع الدرس أو النشاط التجريبي أو التمارين المنجزة..."
                  className="w-full text-xs font-bold py-2 px-3 rounded-xl border border-slate-200 focus:border-emerald-500 outline-none leading-relaxed"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setItemModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-sm transition-all cursor-pointer"
                >
                  {editingItemId ? 'حفظ تعديل الدرس' : 'إضافة الدرس للمنهاج'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Official A4 Print Modal */}
      <LogbookPrintModal
        isOpen={showPrintModal}
        onClose={() => setShowPrintModal(false)}
        selectedClass={currentClass}
        teacherName={assignedTeacher?.name || currentUser?.name || ''}
        config={config}
        allSyllabusItems={allSyllabusItems}
        checkedItemIds={checkedItems}
      />

    </div>
  );
}
