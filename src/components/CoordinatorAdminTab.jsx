import React, { useState, useEffect } from 'react';
import {
  UserPlus,
  Shield,
  KeyRound,
  Trash2,
  Edit2,
  School,
  Calendar,
  Layers,
  Save,
  RotateCcw,
  Plus,
  Users,
  CheckCircle2,
  Lock,
  Phone,
  Archive,
  FolderArchive,
  History,
  FileText,
  AlertTriangle
} from 'lucide-react';
import { CURRICULA } from '../data/curricula';

export default function CoordinatorAdminTab({
  teachers = [],
  classes = [],
  config = {},
  archives = [],
  onAddTeacher,
  onUpdateTeacher,
  onDeleteTeacher,
  onAddClass,
  onAddClassesBatch,
  onUpdateClass,
  onDeleteClass,
  onUpdateConfig,
  onResetData,
  onArchiveAndStartNewYear,
  onDeleteArchive,
  onViewArchiveReport,
  onOpenTeacherCredentials
}) {
  const [activeAdminSubTab, setActiveAdminSubTab] = useState('teachers'); // 'teachers', 'classes', 'settings', 'archive'

  // Teacher Form State
  const [teacherName, setTeacherName] = useState('');
  const [teacherPin, setTeacherPin] = useState('');
  const [teacherPhone, setTeacherPhone] = useState('');
  const [teacherIsCoordinator, setTeacherIsCoordinator] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState(null);

  // Batch Classes Form State
  const [streamBatches, setStreamBatches] = useState([
    { streamId: '3as_se', name: '3 علوم تجريبية', prefix: '3 ع ت', count: 2 },
    { streamId: '3as_tm', name: '3 تقني رياضي', prefix: '3 تق ر', count: 1 },
    { streamId: '3as_m', name: '3 رياضيات', prefix: '3 ر', count: 1 },
    { streamId: '2as_se', name: '2 علوم تجريبية', prefix: '2 ع ت', count: 2 },
    { streamId: '2as_tm', name: '2 تقني رياضي', prefix: '2 تق ر', count: 1 },
    { streamId: '2as_m', name: '2 رياضيات', prefix: '2 ر', count: 1 },
    { streamId: '2as_lph', name: '2 آداب وفلسفة', prefix: '2 آداب', count: 1 },
    { streamId: '1as_tc_st', name: '1 ج م ع تك (جذع مشترك علوم)', prefix: '1 ج م ع ت', count: 3 },
    { streamId: '1as_tc_l', name: '1 ج م آداب (جذع مشترك آداب)', prefix: '1 ج م آداب', count: 1 }
  ]);
  const [replaceExistingClasses, setReplaceExistingClasses] = useState(false);
  const [batchSuccess, setBatchSuccess] = useState(false);

  // Single Class Edit Form State
  const [editingClass, setEditingClass] = useState(null);
  const [editClassName, setEditClassName] = useState('');
  const [editClassTeacherId, setEditClassTeacherId] = useState('');

  // Config Form State
  const [academicYear, setAcademicYear] = useState(config?.academicYear || '2026/2027');
  const [schoolName, setSchoolName] = useState(config?.schoolName || 'ثانوية الشهيد رابح بيطاط');
  const [wilaya, setWilaya] = useState(config?.wilaya || 'الجزائر');
  const [institutionPasscode, setInstitutionPasscode] = useState(config?.institutionPasscode || '0001');
  const [coordinatorPasscode, setCoordinatorPasscode] = useState(config?.coordinatorPasscode || '0000');
  const [configSuccess, setConfigSuccess] = useState(false);

  // Helper for computing the next academic year (e.g. 2026/2027 -> 2027/2028)
  const getNextAcademicYear = (curr) => {
    if (!curr) return '2027/2028';
    const match = curr.match(/(\d{4})\s*[\/\-]\s*(\d{4})/);
    if (match) {
      const y1 = parseInt(match[1], 10) + 1;
      const y2 = parseInt(match[2], 10) + 1;
      return `${y1}/${y2}`;
    }
    return '2027/2028';
  };

  // Archive & New Academic Year State
  const [newYearInput, setNewYearInput] = useState(() => getNextAcademicYear(config?.academicYear));
  const [confirmArchiveChecked, setConfirmArchiveChecked] = useState(false);
  const [archiveSuccessMessage, setArchiveSuccessMessage] = useState('');
  const [archiveLoading, setArchiveLoading] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  useEffect(() => {
    if (config) {
      if (config.academicYear) {
        setAcademicYear(config.academicYear);
        setNewYearInput(getNextAcademicYear(config.academicYear));
      }
      if (config.schoolName) setSchoolName(config.schoolName);
      if (config.wilaya) setWilaya(config.wilaya);
      if (config.institutionPasscode) setInstitutionPasscode(config.institutionPasscode);
      if (config.coordinatorPasscode) setCoordinatorPasscode(config.coordinatorPasscode);
    }
  }, [config]);

  // Handle Archive & New Year Submission
  const handleArchiveSubmit = async () => {
    if (!newYearInput.trim()) {
      alert('الرجاء إدخال تسمية السنة الدراسية الجديدة');
      return;
    }
    if (!confirmArchiveChecked) {
      alert('يرجى التأشير على مربع التأكيد للمتابعة');
      return;
    }

    setArchiveLoading(true);
    const result = await onArchiveAndStartNewYear(newYearInput.trim());
    setArchiveLoading(false);
    setShowConfirmModal(false);

    if (result && result.success) {
      setArchiveSuccessMessage(result.message || 'تمت أرشفة السنة الدراسية وبدء السنة الجديدة بنجاح');
      setConfirmArchiveChecked(false);
      setTimeout(() => setArchiveSuccessMessage(''), 6000);
    } else {
      alert(result?.message || 'فشلت عملية الأرشفة');
    }
  };

  // Handle Add / Edit Teacher
  const handleTeacherSubmit = (e) => {
    e.preventDefault();
    if (!teacherName.trim() || !teacherPin.trim()) return;

    if (editingTeacher) {
      onUpdateTeacher(editingTeacher.id, {
        name: teacherName.trim(),
        pin: teacherPin.trim(),
        phone: teacherPhone.trim(),
        isCoordinator: teacherIsCoordinator
      });
      setEditingTeacher(null);
    } else {
      onAddTeacher({
        name: teacherName.trim(),
        pin: teacherPin.trim(),
        phone: teacherPhone.trim(),
        isCoordinator: teacherIsCoordinator
      });
    }

    setTeacherName('');
    setTeacherPin('');
    setTeacherPhone('');
    setTeacherIsCoordinator(false);
  };

  const handleEditTeacherClick = (t) => {
    setEditingTeacher(t);
    setTeacherName(t.name);
    setTeacherPin(t.pin);
    setTeacherPhone(t.phone || '');
    setTeacherIsCoordinator(Boolean(t.isCoordinator));
  };

  const handleCancelEditTeacher = () => {
    setEditingTeacher(null);
    setTeacherName('');
    setTeacherPin('');
    setTeacherPhone('');
    setTeacherIsCoordinator(false);
  };

  const handleBatchCountChange = (streamId, val) => {
    setStreamBatches((prev) =>
      prev.map((b) => {
        if (b.streamId === streamId) {
          const nextCount = Math.max(0, Number(val) || 0);
          return { ...b, count: nextCount };
        }
        return b;
      })
    );
  };

  const handleBatchPrefixChange = (streamId, newPrefix) => {
    setStreamBatches((prev) =>
      prev.map((b) => (b.streamId === streamId ? { ...b, prefix: newPrefix } : b))
    );
  };

  const handleBatchSubmit = async (e) => {
    e.preventDefault();
    const totalCount = streamBatches.reduce((sum, b) => sum + (Number(b.count) || 0), 0);
    if (totalCount === 0) {
      alert('الرجاء تحديد عدد الأقسام (1 على الأقل) لأحد المستويات');
      return;
    }

    if (replaceExistingClasses) {
      if (!window.confirm('تنبيه: سيتم مسح الأقسام السابقة واستبدالها بالأقسام الجديدة. هل أنت متأكد؟')) {
        return;
      }
    }

    await onAddClassesBatch(streamBatches, replaceExistingClasses);
    setBatchSuccess(true);
    setTimeout(() => setBatchSuccess(false), 3500);
  };

  const handleEditClassClick = (cls) => {
    setEditingClass(cls);
    setEditClassName(cls.name);
    setEditClassTeacherId(cls.teacherId || '');
  };

  const handleSaveEditClass = (e) => {
    e.preventDefault();
    if (!editingClass || !editClassName.trim()) return;
    onUpdateClass(editingClass.id, {
      name: editClassName.trim(),
      teacherId: editClassTeacherId || null
    });
    setEditingClass(null);
  };

  // Handle Save Settings
  const handleConfigSubmit = (e) => {
    e.preventDefault();
    onUpdateConfig({
      academicYear,
      schoolName,
      wilaya,
      institutionPasscode,
      coordinatorPasscode
    });
    setConfigSuccess(true);
    setTimeout(() => setConfigSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Admin Navigation Pills */}
      <div className="bg-white rounded-2xl border border-slate-200 p-2 shadow-xs flex items-center gap-2 overflow-x-auto">
        <button
          onClick={() => setActiveAdminSubTab('teachers')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeAdminSubTab === 'teachers'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>إدارة الأساتذة وكلمات المرور</span>
        </button>

        <button
          onClick={() => setActiveAdminSubTab('classes')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeAdminSubTab === 'classes'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>إدارة الأقسام وتوزيع الإسناد</span>
        </button>

        <button
          onClick={() => setActiveAdminSubTab('settings')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeAdminSubTab === 'settings'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <School className="w-4 h-4" />
          <span>إعدادات المؤسسة وحماية الموقع</span>
        </button>

        <button
          onClick={() => setActiveAdminSubTab('archive')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeAdminSubTab === 'archive'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Archive className="w-4 h-4" />
          <span>أرشفة وبدء سنة جديدة</span>
          {archives.length > 0 && (
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
              activeAdminSubTab === 'archive' ? 'bg-white text-blue-700' : 'bg-blue-50 text-blue-700'
            }`}>
              {archives.length}
            </span>
          )}
        </button>
      </div>

      {/* SUBTAB 1: TEACHERS MANAGEMENT */}
      {activeAdminSubTab === 'teachers' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Add / Edit Teacher Form */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs h-fit">
            <h3 className="font-black text-base text-slate-800 mb-1 flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-blue-600" />
              <span>{editingTeacher ? 'تعديل بيانات الأستاذ' : 'إضافة أستاذ جديد'}</span>
            </h3>
            <p className="text-xs text-slate-500 mb-5">
              أدخل اسم الأستاذ وكلمة المرور الخاصة به للدخول إلى المنصة
            </p>

            <form onSubmit={handleTeacherSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  اسم الأستاذ(ة):
                </label>
                <input
                  type="text"
                  required
                  placeholder="مثال: الأستاذ بن عيسى"
                  value={teacherName}
                  onChange={(e) => setTeacherName(e.target.value)}
                  className="w-full text-xs font-semibold py-2.5 px-3 rounded-xl border border-slate-200 focus:border-blue-600 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  كلمة المرور (رمز PIN):
                </label>
                <input
                  type="text"
                  required
                  placeholder="أدخل كلمة المرور"
                  value={teacherPin}
                  onChange={(e) => setTeacherPin(e.target.value)}
                  className="w-full text-xs font-mono font-bold py-2.5 px-3 rounded-xl border border-slate-200 focus:border-blue-600 outline-none"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">
                  يستخدم الأستاذ هذا الرمز لتسجيل الدخول إلى حسابه في المنصة
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  رقم الهاتف (اختياري للتنسيق):
                </label>
                <input
                  type="tel"
                  placeholder="05 / 06 / 07 ..."
                  value={teacherPhone}
                  onChange={(e) => setTeacherPhone(e.target.value)}
                  className="w-full text-xs font-mono py-2.5 px-3 rounded-xl border border-slate-200 focus:border-blue-600 outline-none"
                  dir="ltr"
                />
              </div>

              {/* Coordinator role toggle */}
              <div className="bg-blue-50/70 border border-blue-200/80 rounded-xl p-3">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-blue-900">
                  <input
                    type="checkbox"
                    checked={teacherIsCoordinator}
                    onChange={(e) => setTeacherIsCoordinator(e.target.checked)}
                    className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                  />
                  <span>تعيين كمنسق لمادة العلوم الفيزيائية (صلاحيات الإشراف والإدارة)</span>
                </label>
              </div>

              <div className="pt-2 flex items-center gap-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs shadow-xs transition-all flex items-center justify-center gap-1.5"
                >
                  <Save className="w-4 h-4" />
                  <span>{editingTeacher ? 'حفظ التعديلات' : 'إضافة الأستاذ'}</span>
                </button>

                {editingTeacher && (
                  <button
                    type="button"
                    onClick={handleCancelEditTeacher}
                    className="py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-xs"
                  >
                    إلغاء
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Teacher List Table / Cards */}
          <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h4 className="font-black text-slate-800 text-base">قائمة أساتذة المادة بالمؤسسة</h4>
                <p className="text-xs text-slate-400">إجمالي الأساتذة: {teachers.length} أستاذ</p>
              </div>

              {/* Print credentials button */}
              <button
                type="button"
                onClick={onOpenTeacherCredentials}
                className="py-2.5 px-4 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 font-bold text-xs rounded-xl flex items-center gap-2 transition-all cursor-pointer shadow-2xs"
                title="طباعة ورقة أسماء الأساتذة وكلمات مرورهم"
              >
                <KeyRound className="w-4 h-4 text-indigo-600" />
                <span>طباعة ورقة كلمات المرور (A4)</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead>
                  <tr className="bg-slate-50 text-slate-600 border-b border-slate-200 font-bold">
                    <th className="py-3.5 px-4">اسم الأستاذ</th>
                    <th className="py-3.5 px-4 text-center">كلمة المرور PIN</th>
                    <th className="py-3.5 px-4">الأقسام المسندة</th>
                    <th className="py-3.5 px-4 text-center">الإجراءات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {teachers.map((teacher) => {
                    const assignedClasses = classes.filter((c) => c.teacherId === teacher.id);

                    return (
                      <tr key={teacher.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-2.5">
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${
                              teacher.isCoordinator ? 'bg-blue-600 text-white' : 'bg-indigo-100 text-indigo-700'
                            }`}>
                              {teacher.name.replace('الأستاذة ', '').replace('الأستاذ ', '').slice(0, 1)}
                            </div>
                            <div>
                              <div className="flex items-center gap-1.5">
                                <span className="font-extrabold text-slate-900 block">{teacher.name}</span>
                                {teacher.isCoordinator && (
                                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 border border-blue-200">
                                    المنسق
                                  </span>
                                )}
                              </div>
                              {teacher.phone && (
                                <span className="text-[10px] text-slate-400 font-mono" dir="ltr">
                                  {teacher.phone}
                                </span>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* PIN */}
                        <td className="py-3.5 px-4 text-center">
                          <span className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-800 font-mono font-bold text-xs border border-slate-200">
                            {teacher.pin}
                          </span>
                        </td>

                        {/* Assigned Classes */}
                        <td className="py-3.5 px-4">
                          <div className="flex flex-wrap gap-1">
                            {assignedClasses.length > 0 ? (
                              assignedClasses.map((cls) => (
                                <span
                                  key={cls.id}
                                  className="px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 font-bold text-[10px]"
                                >
                                  {cls.name}
                                </span>
                              ))
                            ) : (
                              <span className="text-slate-400 italic text-[11px]">لا توجد أقسام مسندة</span>
                            )}
                          </div>
                        </td>

                        {/* Actions */}
                        <td className="py-3.5 px-4 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              onClick={() => handleEditTeacherClick(teacher)}
                              className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition-all"
                              title="تعديل الأستاذ أو كلمة المرور"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => onDeleteTeacher(teacher.id)}
                              className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 transition-all"
                              title="حذف الأستاذ"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 2: CLASSES & ASSIGNMENT MANAGEMENT */}
      {activeAdminSubTab === 'classes' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* BATCH CLASS GENERATOR FORM (LEFT: 5 COLS) */}
          <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200 p-6 shadow-xs h-fit text-right">
            <div className="flex items-center justify-between mb-1">
              <h3 className="font-black text-base text-slate-800 flex items-center gap-2">
                <Layers className="w-5 h-5 text-blue-600" />
                <span>إضافة وتوليد الأقسام بالجملة</span>
              </h3>
              <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full">
                ترقيم تسلسلي آلي
              </span>
            </div>
            <p className="text-xs text-slate-500 mb-4 leading-relaxed">
              حدد عدد الأقسام لكل مستوى وشعبة، وسيتم إنشاؤها فوراً بترقيم تسلسلي (1، 2، 3...).
            </p>

            <form onSubmit={handleBatchSubmit} className="space-y-3">
              {/* List of 7 streams with count and prefix */}
              <div className="space-y-2 max-h-[380px] overflow-y-auto p-1 bg-slate-50/70 border border-slate-200/80 rounded-2xl">
                {streamBatches.map((batch) => {
                  const previewNames = [];
                  for (let i = 1; i <= (Number(batch.count) || 0); i++) {
                    previewNames.push(`${batch.prefix} ${i}`.trim());
                  }

                  return (
                    <div
                      key={batch.streamId}
                      className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs hover:border-blue-400 transition-all space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-black text-xs text-slate-800">
                          {batch.name}
                        </span>
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleBatchCountChange(batch.streamId, Math.max(0, (Number(batch.count) || 0) - 1))}
                            className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold flex items-center justify-center text-sm"
                          >
                            -
                          </button>
                          <input
                            type="number"
                            min="0"
                            max="20"
                            value={batch.count}
                            onChange={(e) => handleBatchCountChange(batch.streamId, e.target.value)}
                            className="w-12 text-center font-mono font-black text-sm py-1 border border-slate-200 rounded-lg focus:border-blue-500 outline-none"
                          />
                          <button
                            type="button"
                            onClick={() => handleBatchCountChange(batch.streamId, (Number(batch.count) || 0) + 1)}
                            className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold flex items-center justify-center text-sm"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-100">
                        <div className="flex items-center gap-1.5">
                          <span className="text-slate-400">الرمز:</span>
                          <input
                            type="text"
                            value={batch.prefix}
                            onChange={(e) => handleBatchPrefixChange(batch.streamId, e.target.value)}
                            className="w-20 font-bold text-xs py-0.5 px-1.5 border border-slate-200 rounded-md focus:border-blue-500 outline-none text-center bg-slate-50"
                          />
                        </div>
                        <div className="text-slate-500 truncate max-w-[160px]" title={previewNames.join('، ')}>
                          {previewNames.length > 0 ? (
                            <span className="font-mono font-bold text-blue-700 text-[10px]">
                              {previewNames.join('، ')}
                            </span>
                          ) : (
                            <span className="text-slate-400 italic text-[10px]">لا يوجد أقسام</span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Options */}
              <div className="p-3 bg-amber-50/60 border border-amber-200/80 rounded-xl">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-amber-950">
                  <input
                    type="checkbox"
                    checked={replaceExistingClasses}
                    onChange={(e) => setReplaceExistingClasses(e.target.checked)}
                    className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                  />
                  <span>استبدال الأقسام الحالية (مسح الأقسام القديمة والبدء من جديد)</span>
                </label>
              </div>

              {batchSuccess && (
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold py-2 px-3 rounded-xl flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>تم إنشاء وتوليد الأقسام بنجاح!</span>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" />
                <span>
                  توليد وإنشاء ({streamBatches.reduce((sum, b) => sum + (Number(b.count) || 0), 0)}) قسماً بالجملة
                </span>
              </button>
            </form>
          </div>

          {/* CLASSES & TEACHER ASSIGNMENT TABLE (RIGHT: 7 COLS) */}
          <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden text-right flex flex-col justify-between">
            <div>
              <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h4 className="font-black text-slate-800 text-base">
                    أقسام المؤسسة وتوزيع الإسناد
                  </h4>
                  <p className="text-xs text-slate-400">
                    يمكنك إسناد كل قسم لأستاذه مباشرة من القائمة المنسدلة في الجدول
                  </p>
                </div>
                <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 font-mono font-bold text-xs">
                  {classes.length} قسم بالمؤسسة
                </span>
              </div>

              <div className="overflow-x-auto max-h-[520px]">
                <table className="w-full text-right text-xs">
                  <thead className="sticky top-0 z-10">
                    <tr className="bg-slate-50 text-slate-600 border-b border-slate-200 font-extrabold text-[11px]">
                      <th className="py-3 px-3 text-center w-10">#</th>
                      <th className="py-3 px-3 w-28">اسم القسم</th>
                      <th className="py-3 px-3">المستوى والشعبة</th>
                      <th className="py-3 px-3 w-52">الأستاذ المكلف (إسناد مباشر)</th>
                      <th className="py-3 px-3 text-center w-16">إجراء</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {classes.map((cls, idx) => {
                      const curriculum = CURRICULA[cls.streamId];

                      return (
                        <tr key={cls.id} className="hover:bg-slate-50/70 transition-colors">
                          <td className="py-2.5 px-3 text-center font-mono font-bold text-slate-400 text-[11px]">
                            {idx + 1}
                          </td>
                          <td className="py-2.5 px-3 font-black text-slate-900 text-sm">
                            {cls.name}
                          </td>
                          <td className="py-2.5 px-3 font-bold text-slate-600 text-xs">
                            {curriculum?.stream || cls.streamId}
                          </td>
                          {/* Direct Inline Teacher Selector */}
                          <td className="py-2.5 px-3">
                            <select
                              value={cls.teacherId || ''}
                              onChange={(e) =>
                                onUpdateClass(cls.id, {
                                  teacherId: e.target.value || null
                                })
                              }
                              className={`w-full py-1.5 px-2 rounded-lg text-xs font-bold border outline-none transition-all ${
                                cls.teacherId
                                  ? 'bg-indigo-50/60 border-indigo-200 text-indigo-950 font-bold'
                                  : 'bg-rose-50/60 border-rose-200 text-rose-600 font-semibold'
                              }`}
                            >
                              <option value="">-- شاغر (بدون أستاذ) --</option>
                              {teachers.map((t) => (
                                <option key={t.id} value={t.id}>
                                  {t.name}
                                </option>
                              ))}
                            </select>
                          </td>
                          {/* Actions */}
                          <td className="py-2.5 px-3 text-center">
                            <div className="flex items-center justify-center gap-1">
                              <button
                                onClick={() => handleEditClassClick(cls)}
                                className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all"
                                title="تعديل اسم القسم"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => onDeleteClass(cls.id)}
                                className="p-1 rounded-md text-rose-400 hover:text-rose-600 hover:bg-rose-50 transition-all"
                                title="حذف القسم"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}

                    {classes.length === 0 && (
                      <tr>
                        <td colSpan={5} className="py-12 text-center text-slate-400">
                          <Layers className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                          <p className="font-bold text-xs">لا توجد أقسام مسجلة حالياً</p>
                          <p className="text-[11px] text-slate-400 mt-1">
                            استخدم النموذج المقابل لتوليد الأقسام بالجملة
                          </p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: EDIT SINGLE CLASS */}
      {editingClass && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn text-right">
          <div className="w-full max-w-sm bg-white rounded-3xl shadow-2xl p-6 border border-slate-100">
            <h3 className="text-base font-black text-slate-900 mb-1">تعديل اسم القسم</h3>
            <p className="text-xs text-slate-500 mb-4">
              المستوى: {CURRICULA[editingClass.streamId]?.stream || editingClass.streamId}
            </p>

            <form onSubmit={handleSaveEditClass} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  اسم القسم / الفوج:
                </label>
                <input
                  type="text"
                  required
                  value={editClassName}
                  onChange={(e) => setEditClassName(e.target.value)}
                  className="w-full text-xs font-bold py-2.5 px-3 rounded-xl border border-slate-200 focus:border-blue-600 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  الأستاذ المكلف:
                </label>
                <select
                  value={editClassTeacherId}
                  onChange={(e) => setEditClassTeacherId(e.target.value)}
                  className="w-full text-xs font-bold py-2.5 px-3 rounded-xl border border-slate-200 focus:border-blue-600 outline-none"
                >
                  <option value="">-- شاغر (بدون أستاذ) --</option>
                  {teachers.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingClass(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm"
                >
                  حفظ التعديل
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SUBTAB 3: SETTINGS & PASSCODES */}
      {activeAdminSubTab === 'settings' && (
        <div className="max-w-2xl mx-auto bg-white rounded-3xl border border-slate-200 p-8 shadow-xs space-y-6">
          <div>
            <h3 className="font-black text-lg text-slate-800 mb-1 flex items-center gap-2">
              <Shield className="w-6 h-6 text-blue-600" />
              <span>إعدادات النظام وكلمات المرور</span>
            </h3>
            <p className="text-xs text-slate-500">
              تعديل السنة الدراسية، اسم المؤسسة، ورموز الدخول السريعة
            </p>
          </div>

          <form onSubmit={handleConfigSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  السنة الدراسية:
                </label>
                <input
                  type="text"
                  required
                  value={academicYear}
                  onChange={(e) => setAcademicYear(e.target.value)}
                  placeholder="2026/2027"
                  className="w-full text-xs font-bold py-2.5 px-3 rounded-xl border border-slate-200 focus:border-blue-600 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  الولاية / مديرية التربية:
                </label>
                <input
                  type="text"
                  required
                  value={wilaya}
                  onChange={(e) => setWilaya(e.target.value)}
                  placeholder="الجزائر وسط"
                  className="w-full text-xs font-semibold py-2.5 px-3 rounded-xl border border-slate-200 focus:border-blue-600 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                اسم المؤسسة التربوية (الثانوية):
              </label>
              <input
                type="text"
                required
                value={schoolName}
                onChange={(e) => setSchoolName(e.target.value)}
                placeholder="ثانوية الشهيد رابح بيطاط"
                className="w-full text-xs font-semibold py-2.5 px-3 rounded-xl border border-slate-200 focus:border-blue-600 outline-none"
              />
            </div>

            <div className="pt-3 border-t border-slate-100">
              <h4 className="text-xs font-bold text-indigo-900 mb-3 flex items-center gap-1.5">
                <Lock className="w-4 h-4 text-indigo-600" />
                <span>إعدادات الحماية ورموز الدخول:</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    رمز بوابة المؤسسة (الرئيسية):
                  </label>
                  <input
                    type="text"
                    required
                    value={institutionPasscode}
                    onChange={(e) => setInstitutionPasscode(e.target.value)}
                    placeholder="رمز الدخول العام"
                    className="w-full text-sm font-mono font-bold py-2 px-3 rounded-xl border border-slate-200 focus:border-blue-600 outline-none bg-white"
                  />
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    الرمز الذي يدخله الأساتذة للدخول للموقع
                  </span>
                </div>

                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    رمز مرور منسق المادة:
                  </label>
                  <input
                    type="text"
                    required
                    value={coordinatorPasscode}
                    onChange={(e) => setCoordinatorPasscode(e.target.value)}
                    placeholder="رمز المنسق"
                    className="w-full text-sm font-mono font-bold py-2 px-3 rounded-xl border border-slate-200 focus:border-blue-600 outline-none bg-white"
                  />
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    الرمز الخاص بالمنسق للدخول للوحة الإدارة
                  </span>
                </div>
              </div>
            </div>

            {configSuccess && (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold py-2.5 px-4 rounded-xl flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>تم حفظ الإعدادات ورموز المرور بنجاح!</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>حفظ كافة التغييرات</span>
            </button>
          </form>

          {/* Reset Database Button */}
          <div className="pt-6 border-t border-slate-200 flex items-center justify-between">
            <div>
              <h5 className="text-xs font-bold text-slate-700">إعادة ضبط المنصة</h5>
              <p className="text-[11px] text-slate-400">إعادة تحميل المناهج والتوزيعات الوزارية الأولية</p>
            </div>
            <button
              onClick={() => {
                if (window.confirm('هل أنت متأكد من إعادة ضبط المنصة إلى الحالة الوزارية الأولية؟')) {
                  onResetData();
                }
              }}
              className="px-3.5 py-2 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 font-bold text-xs flex items-center gap-1.5 transition-all"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>إعادة الضبط</span>
            </button>
          </div>
        </div>
      )}

      {/* SUBTAB 4: ARCHIVE & START NEW ACADEMIC YEAR */}
      {activeAdminSubTab === 'archive' && (
        <div className="space-y-8 max-w-4xl mx-auto">
          {/* Main Action Card */}
          <div className="bg-white rounded-3xl border border-slate-200 p-7 shadow-xs space-y-6">
            <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-100 pb-5">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="p-2 rounded-xl bg-blue-50 text-blue-600">
                    <Archive className="w-6 h-6" />
                  </span>
                  <h3 className="font-black text-lg text-slate-800">
                    أرشفة السنة الدراسية الحالية وبدء سنة جديدة
                  </h3>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed max-w-2xl">
                  تتيح لك هذه الخاصية حفظ السجل الكامل للسنة الدراسية الحالية (التأشير على الدروس، الفروض والاختبارات، ومبررات التأخر) وأرشفته بشكل دائم، مع فتح سنة دراسية جديدة <strong className="text-slate-800">بنفس الأساتذة والأقسام</strong> ولكن <strong className="text-blue-700 font-black">بدون إسناد أي أستاذ لأي قسم</strong> لتوزيعها بحرية في بداية الموسم.
                </p>
              </div>

              <span className="px-3.5 py-1.5 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-bold font-mono shrink-0">
                الموسم الحالي: {config?.academicYear || '2026/2027'}
              </span>
            </div>

            {/* Comparison Grid: What Stays vs What Resets */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Stays Intact */}
              <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-2.5">
                <div className="flex items-center gap-2 text-emerald-900 font-black text-xs">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>ما يتم الاحتفاظ به كاملاً (بنفس البيانات):</span>
                </div>
                <ul className="text-xs text-emerald-950 space-y-2 list-disc list-inside">
                  <li>
                    <strong>قائمة الأساتذة ({teachers.length} أستاذ):</strong> تبقى الأسماء، الأرقام السرية (PIN)، والمنسق دون أي تغيير.
                  </li>
                  <li>
                    <strong>قائمة الأقسام ({classes.length} قسم):</strong> تبقى جميع الأقسام والشعب بنفس تسمياتها وترقيمها المعتمد.
                  </li>
                  <li>
                    <strong>إعدادات المؤسسة:</strong> اسم المؤسسة، الولاية، ومفتاح الدخول المؤسساتي.
                  </li>
                </ul>
              </div>

              {/* What Resets for New Year */}
              <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200 space-y-2.5">
                <div className="flex items-center gap-2 text-blue-900 font-black text-xs">
                  <RotateCcw className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>ما يتم تصفيره للسنة الدراسية الجديدة:</span>
                </div>
                <ul className="text-xs text-blue-950 space-y-2 list-disc list-inside">
                  <li>
                    <strong className="text-blue-800">إسناد الأقسام:</strong> تصبح جميع الأقسام ({classes.length} قسم) شاغرة <strong className="text-indigo-800">بدون إسناد لأي أستاذ</strong> ليتم إسنادها من جديد.
                  </li>
                  <li>
                    <strong>التأشير على الدروس:</strong> تصفير أسابيع الإنجاز لكل قسم ليبدأ التتبع من الأسبوع 1 (0%).
                  </li>
                  <li>
                    <strong>جدول التنسيق:</strong> تفريغ مواضيع الفروض والاختبارات لإعداد مواضيع الموسم الجديد.
                  </li>
                  <li>
                    <strong>مبررات التأخر:</strong> تصفير الملاحظات وخطط الاستدراك السابقة لبدء سنة نقية.
                  </li>
                </ul>
              </div>
            </div>

            {/* Archive & Start Form */}
            <form onSubmit={(e) => { e.preventDefault(); setShowConfirmModal(true); }} className="p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">
                    1- السنة الدراسية الحالية (ستنتقل للأرشيف):
                  </label>
                  <input
                    type="text"
                    disabled
                    value={config?.academicYear || '2026/2027'}
                    className="w-full text-xs font-bold font-mono py-2.5 px-3 rounded-xl border border-slate-200 bg-slate-100 text-slate-500 cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    2- تسمية السنة الدراسية الجديدة:
                  </label>
                  <input
                    type="text"
                    required
                    value={newYearInput}
                    onChange={(e) => setNewYearInput(e.target.value)}
                    placeholder="مثال: 2027/2028"
                    className="w-full text-xs font-bold font-mono py-2.5 px-3 rounded-xl border border-slate-200 focus:border-blue-600 outline-none bg-white text-slate-900 shadow-xs"
                  />
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200">
                <label className="flex items-start gap-2.5 cursor-pointer text-xs font-bold text-slate-800">
                  <input
                    type="checkbox"
                    checked={confirmArchiveChecked}
                    onChange={(e) => setConfirmArchiveChecked(e.target.checked)}
                    className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 mt-0.5"
                  />
                  <span>
                    أؤكد أرشفة كافة بيانات موسم ({config?.academicYear || '2026/2027'}) وفتح الموسم الجديد ({newYearInput}) بنفس الأساتذة والأقسام ولكن <strong className="text-blue-700">بدون إسناد أي أستاذ لأي قسم</strong>.
                  </span>
                </label>
              </div>

              {archiveSuccessMessage && (
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold py-3 px-4 rounded-xl flex items-center gap-2 animate-fadeIn">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span>{archiveSuccessMessage}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={!confirmArchiveChecked || !newYearInput.trim() || archiveLoading}
                className={`w-full py-3 rounded-xl font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 ${
                  confirmArchiveChecked && newYearInput.trim() && !archiveLoading
                    ? 'bg-blue-600 hover:bg-blue-700 text-white cursor-pointer active:scale-98'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                <Archive className="w-4 h-4" />
                <span>
                  {archiveLoading ? 'جاري الأرشفة والبدء...' : `أرشفة السنة الحالية وبدء السنة الجديدة (${newYearInput})`}
                </span>
              </button>
            </form>
          </div>

          {/* Previous Archives History Card */}
          <div className="bg-white rounded-3xl border border-slate-200 p-7 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <History className="w-5 h-5 text-slate-600" />
                <h4 className="font-black text-base text-slate-800">
                  سجل السنوات الدراسية المؤرشفة
                </h4>
              </div>
              <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 font-mono font-bold text-xs">
                {archives.length} سنة في الأرشيف
              </span>
            </div>

            {archives.length === 0 ? (
              <div className="py-10 text-center text-slate-400">
                <FolderArchive className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                <p className="font-bold text-xs text-slate-600">لا توجد سنوات سابقة مؤرشفة بعد</p>
                <p className="text-[11px] text-slate-400 mt-1 max-w-md mx-auto">
                  عند نهاية الموسم الدراسي والقيام بعملية الأرشفة، ستبقى جميع تقارير وإحصائيات السنوات السابقة محفوظة هنا مع إمكانية معاينة وطباعة التقرير الرسمي لكل سنة في أي وقت.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {archives.map((arch) => {
                  const archDate = new Date(arch.archivedAt).toLocaleDateString('ar-DZ', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  });
                  const teachersCount = (arch.teachers || []).length;
                  const classesCount = (arch.classes || []).length;
                  const topicsCount = (arch.coordination || []).length;

                  return (
                    <div
                      key={arch.id}
                      className="p-4 rounded-2xl border border-slate-200 bg-slate-50/70 hover:bg-white hover:border-blue-300 transition-all flex flex-wrap items-center justify-between gap-3"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-black text-slate-900 text-sm font-mono">
                            السنة الدراسية: {arch.academicYear}
                          </span>
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-200 text-slate-700">
                            مؤرشفة
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400">
                          تاريخ الأرشفة: {archDate} • {arch.schoolName} ({arch.wilaya})
                        </p>
                        <div className="flex items-center gap-3 pt-1 text-xs">
                          <span className="text-slate-600">
                            الأساتذة: <strong className="font-bold text-slate-900">{teachersCount}</strong>
                          </span>
                          <span className="text-slate-300">•</span>
                          <span className="text-slate-600">
                            الأقسام: <strong className="font-bold text-slate-900">{classesCount}</strong>
                          </span>
                          <span className="text-slate-300">•</span>
                          <span className="text-slate-600">
                            مواضيع التنسيق: <strong className="font-bold text-slate-900">{topicsCount}</strong>
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => onViewArchiveReport(arch)}
                          className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
                          title="عرض وطباعة التقرير الرسمي لبيانات هذه السنة المؤرشفة"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          <span>معاينة التقرير الرسمي (A4)</span>
                        </button>

                        <button
                          onClick={() => {
                            if (window.confirm(`هل أنت متأكد من حذف أرشيف السنة الدراسية (${arch.academicYear})؟`)) {
                              onDeleteArchive(arch.id);
                            }
                          }}
                          className="p-2 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-xl transition-all cursor-pointer"
                          title="حذف هذا الأرشيف"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Final Modal Confirmation */}
          {showConfirmModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
              <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-6 border border-slate-100 text-right space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <div className="text-center">
                  <h3 className="text-base font-black text-slate-900">
                    تأكيد أرشفة السنة وبدء الموسم الجديد
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    سيتم أرشفة كامل بيانات الموسم الحالي (<strong className="font-mono text-slate-700">{config?.academicYear}</strong>) وفتح الموسم الجديد (<strong className="font-mono text-blue-700">{newYearInput}</strong>).
                  </p>
                </div>

                <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl text-xs text-amber-950 font-bold space-y-1">
                  <p>⚠️ تأكيد شرط الإسناد:</p>
                  <p className="font-semibold text-[11px] leading-relaxed">
                    ستبقى جميع الأقسام والأساتذة موجودة، ولكن <strong className="underline text-rose-700">سيتم تفريغ إسناد كل أستاذ من قسمه</strong> لتكون جميع الأقسام شاغرة وجاهزة للإسناد الجديد.
                  </p>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowConfirmModal(false)}
                    className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-bold text-xs"
                  >
                    تراجع
                  </button>
                  <button
                    type="button"
                    onClick={handleArchiveSubmit}
                    disabled={archiveLoading}
                    className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md"
                  >
                    {archiveLoading ? 'جاري التنفيذ...' : 'تأكيد الأرشفة والبدء'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

