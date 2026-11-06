import React, { useState, useCallback, useMemo } from 'react';
import {
  Calendar,
  CheckCircle2,
  Clock,
  UserPlus,
  Users,
  Plus,
  Trash2,
  Check,
  AlertCircle,
  Archive,
  X,
  Sparkles,
  BookOpen,
  UserCheck,
  UserX,
  LogOut,
  HelpCircle
} from 'lucide-react';
import { CURRICULA, STREAMS_LIST } from '../data/curricula';
import { fetchCoordinationArchives, deleteCoordinationArchive } from '../api';

export default function CoordinationTab({
  coordinationList = [],
  teachers = [],
  currentUser,
  currentRole,
  onAssign,
  onCollaborate,
  onLeave,
  onAddCoordination,
  onUpdateCoordination,
  onDeleteCoordination,
  onArchiveCurrent
}) {
  // View mode switcher:
  // 'streams' = الطريقة الأولى: عرض الشعب مع زر اختيار او انسحاب وتحتها الأساتذة المسندين له
  // 'teachers' = الطريقة الثانية: عرض الأساتذة وتحتهم المواضيع المسندة إليهم (مرتبين تصاعدياً بالأقل إسناداً)
  const [viewMode, setViewMode] = useState('streams');

  const [showAddModal, setShowAddModal] = useState(false);

  // Coordination Archives Modal State
  const [showArchivesModal, setShowArchivesModal] = useState(false);
  const [archivedRounds, setArchivedRounds] = useState([]);
  const [loadingArchives, setLoadingArchives] = useState(false);

  const handleOpenArchives = async () => {
    setShowArchivesModal(true);
    setLoadingArchives(true);
    try {
      const data = await fetchCoordinationArchives();
      setArchivedRounds(data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingArchives(false);
    }
  };

  const handleDeleteArchivedRound = async (id) => {
    if (window.confirm('هل أنت متأكد من حذف هذا السجل المؤرشف؟')) {
      const res = await deleteCoordinationArchive(id);
      if (res.success) {
        setArchivedRounds((prev) => prev.filter((r) => r.id !== id));
      }
    }
  };

  // Form state for adding new coordination item
  const [newType, setNewType] = useState('فرض'); // 'فرض' | 'اختبار'
  const [newTerm, setNewTerm] = useState('1'); // '1' | '2' | '3'
  const [selectedStreamIds, setSelectedStreamIds] = useState(STREAMS_LIST.map((s) => s.id));
  const [addError, setAddError] = useState('');

  const getTeacher = (id) => teachers.find((t) => t.id === id);

  // Helper: Count how many topics are assigned to a teacher
  const getTeacherTopicCount = useCallback(
    (teacherId) => {
      return (coordinationList || []).filter(
        (c) => c.primaryTeacherId === teacherId || (c.collaboratorIds || []).includes(teacherId)
      ).length;
    },
    [coordinationList]
  );

  // Sorted teachers for Mode 2 (Always sorted ascending by topic count: fewest assigned topics first)
  const sortedTeachers = useMemo(() => {
    return [...teachers].sort((a, b) => {
      const countA = getTeacherTopicCount(a.id);
      const countB = getTeacherTopicCount(b.id);
      if (countA !== countB) {
        return countA - countB; // Fewest topics first!
      }
      return a.name.localeCompare(b.name, 'ar');
    });
  }, [teachers, getTeacherTopicCount]);

  // Summary counts
  const totalTopicsCount = coordinationList.length;
  const availableTopicsCount = coordinationList.filter((c) => !c.primaryTeacherId).length;
  const assignedTopicsCount = totalTopicsCount - availableTopicsCount;

  // Active Coordination Title (e.g. "فرض الفصل الثاني" or "اختبار الفصل الأول")
  const activeCoordinationTitle = coordinationList.length > 0
    ? coordinationList[0].title
    : null;
  const activeCoordinationTerm = coordinationList.length > 0
    ? coordinationList[0].term
    : null;

  // Teachers who have chosen vs those who haven't
  const teachersWithTopic = teachers.filter((t) =>
    coordinationList.some((c) => c.primaryTeacherId === t.id || (c.collaboratorIds || []).includes(t.id))
  );

  const allStreamList = STREAMS_LIST;

  const handleToggleStream = (streamId) => {
    if (selectedStreamIds.includes(streamId)) {
      setSelectedStreamIds(selectedStreamIds.filter((id) => id !== streamId));
    } else {
      setSelectedStreamIds([...selectedStreamIds, streamId]);
    }
  };

  const handleSelectAllStreams = () => {
    if (selectedStreamIds.length === allStreamList.length) {
      setSelectedStreamIds([]);
    } else {
      setSelectedStreamIds(allStreamList.map((c) => c.id));
    }
  };

  const handleCreate = (e) => {
    e.preventDefault();
    if (selectedStreamIds.length === 0) {
      setAddError('الرجاء التأشير على مستوى واحد على الأقل');
      return;
    }
    setAddError('');

    onAddCoordination({
      type: newType,
      term: Number(newTerm),
      streamIds: selectedStreamIds
    });

    setShowAddModal(false);
  };

  return (
    <div className="space-y-6 text-right">
      {/* 1. TOP HERO CARD: Coordination Title Banner & Actions */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                تنسيق مواضيع الفروض والاختبارات
              </span>
              {activeCoordinationTerm && (
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200 font-mono">
                  الفصل {activeCoordinationTerm}
                </span>
              )}
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {activeCoordinationTitle || 'لا يوجد تنسيق جاري حالياً'}
            </h2>

            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
              {coordinationList.length > 0 ? (
                viewMode === 'streams'
                  ? 'عرض الشعب: قائمة بالشعب المعنية مع زر الاختيار أو الانسحاب، وقائمة الأساتذة المسندين لكل موضوع.'
                  : 'عرض الأساتذة: قائمة مرتبة تصاعدياً (الأساتذة الأقل إسناداً يظهرون أولاً دائماً) مع المواضيع المسندة لكل أستاذ.'
              ) : (
                'يمكن لمنسق المادة إضافة موضوع الفرض أو الاختبار الجديد، لتظهر الشعب ويبدأ الأساتذة في حجزها.'
              )}
            </p>
          </div>

          {/* Action Buttons & Counters */}
          <div className="flex flex-wrap items-center gap-2.5">
            {coordinationList.length > 0 && (
              <div className="flex items-center gap-2 text-xs ml-2">
                <span className="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 font-bold border border-slate-200">
                  الشعب: <strong className="text-indigo-600 font-mono">{totalTopicsCount}</strong>
                </span>
                <span className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 font-bold border border-emerald-200">
                  محجوزة: <strong className="text-emerald-800 font-mono">{assignedTopicsCount}</strong>
                </span>
                <span className="px-3 py-1.5 rounded-xl bg-amber-50 text-amber-700 font-bold border border-amber-200">
                  شاغرة: <strong className="text-amber-800 font-mono">{availableTopicsCount}</strong>
                </span>
              </div>
            )}

            {/* View Archives Button */}
            <button
              onClick={handleOpenArchives}
              className="py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs"
              title="عرض أرشيف الفروض والاختبارات السابقة"
            >
              <Archive className="w-4 h-4 text-slate-500" />
              <span>سجل الأرشيف</span>
            </button>

            {/* Manual Archive Current Topics Button (Coordinator Only) */}
            {currentRole === 'coordinator' && coordinationList.length > 0 && (
              <button
                onClick={async () => {
                  if (
                    window.confirm(
                      `هل أنت متأكد من رغبتك في أرشفة التنسيق الحالي (${activeCoordinationTitle}) وإفراغ القائمة؟\nسيتم حفظ التنسيق بالكامل في سجل الأرشيف.`
                    )
                  ) {
                    await onArchiveCurrent();
                  }
                }}
                className="py-2.5 px-4 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-all cursor-pointer active:scale-95 shadow-2xs"
                title="أرشفة التنسيق الحالي وإفراغ القائمة"
              >
                <Archive className="w-4 h-4 text-amber-700" />
                <span>أرشفة هذا التنسيق</span>
              </button>
            )}

            {/* Coordinator Add Topic Button */}
            {currentRole === 'coordinator' && (
              <button
                onClick={() => setShowAddModal(true)}
                className="py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-md transition-all cursor-pointer active:scale-95"
              >
                <Plus className="w-4 h-4" />
                <span>إضافة موضوع جديد</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 2. VIEW MODE SWITCHER TABS */}
      {coordinationList.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-2 shadow-xs flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-bold text-slate-500 mr-1 flex items-center gap-1">
              <span>طريقة العرض:</span>
            </span>
            <div className="inline-flex rounded-xl bg-slate-100 p-1 gap-1">
              {/* Option 1: Streams View (الطريقة الأولى) */}
              <button
                type="button"
                onClick={() => setViewMode('streams')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  viewMode === 'streams'
                    ? 'bg-white text-indigo-700 shadow-xs font-black'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>عرض الشعب (اختيار / انسحاب)</span>
              </button>

              {/* Option 2: Teachers View (الطريقة الثانية) */}
              <button
                type="button"
                onClick={() => setViewMode('teachers')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  viewMode === 'teachers'
                    ? 'bg-white text-indigo-700 shadow-xs font-black'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Users className="w-3.5 h-3.5" />
                <span className="flex items-center gap-1">
                  <span>عرض الأساتذة</span>
                  <span className="text-[10px] text-amber-700 font-bold bg-amber-100/70 px-1 rounded">الأقل إسناداً أولاً</span>
                </span>
              </button>
            </div>
          </div>

          <div className="text-[11px] text-slate-400 font-bold hidden md:block">
            {viewMode === 'streams' && 'بطاقات الشعب مع زر اختيار أو انسحاب وقائمة الأساتذة المسندين'}
            {viewMode === 'teachers' && 'ترتيب تصاعدي يضع الأساتذة الذين لديهم أقل عدد من المواضيع في المقدمة'}
          </div>
        </div>
      )}

      {/* 3. MAIN CONTENT: BASED ON VIEW MODE */}
      {coordinationList.length === 0 ? (
        /* Empty State */
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center text-slate-400 space-y-3">
          <div className="w-16 h-16 rounded-3xl bg-indigo-50 text-indigo-500 flex items-center justify-center mx-auto">
            <Calendar className="w-8 h-8" />
          </div>
          <h3 className="text-base font-black text-slate-800">
            لا يوجد تنسيق جاري حالياً للفروض أو الاختبارات
          </h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
            عندما يقوم منسق المادة بإضافة فرض أو اختبار جديد، ستظهر الشعب ويبدأ الأساتذة في حجزها بجميع طرق العرض المتاحة.
          </p>
          {currentRole === 'coordinator' && (
            <button
              onClick={() => setShowAddModal(true)}
              className="mt-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl inline-flex items-center gap-2 shadow-md transition-all cursor-pointer active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>إضافة موضوع للتنسيق الآن</span>
            </button>
          )}
        </div>
      ) : viewMode === 'streams' ? (
        /* ========================================================================= */
        /* الطريقة الأولى: عرض الشعب مع زر اختيار او انسحاب وتحتها الأساتذة المسندين  */
        /* ========================================================================= */
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-600"></span>
              <h3 className="font-black text-base text-slate-900">
                قائمة شعب ومستويات الموضوع
              </h3>
            </div>
            <span className="text-xs text-slate-500 font-bold">
              إجمالي الشعب: <strong className="text-indigo-600 font-mono">{coordinationList.length}</strong>
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {coordinationList.map((item) => {
              const curriculum = CURRICULA[item.streamId];
              const primaryTeacher = getTeacher(item.primaryTeacherId);
              const collaborators = (item.collaboratorIds || []).map(getTeacher).filter(Boolean);
              const isVacant = !item.primaryTeacherId;
              const isMyPrimary = currentUser && item.primaryTeacherId === currentUser.id;
              const isMyCollab = currentUser && (item.collaboratorIds || []).includes(currentUser.id);
              const isMyTopic = isMyPrimary || isMyCollab;

              return (
                <div
                  key={item.id}
                  className={`bg-white rounded-3xl border-2 p-5 shadow-xs transition-all flex flex-col justify-between ${
                    isVacant
                      ? 'border-dashed border-emerald-300 bg-emerald-50/15 hover:border-emerald-500'
                      : isMyTopic
                      ? 'border-indigo-300 bg-indigo-50/30 hover:border-indigo-500'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  {/* Top: Stream Identity & Action Button */}
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-0.5 rounded-lg text-xs font-black bg-indigo-100 text-indigo-900 font-mono">
                            {curriculum?.code || item.streamId}
                          </span>
                          <h4 className="font-black text-sm text-slate-900">
                            {curriculum?.stream || item.streamId}
                          </h4>
                        </div>
                        {curriculum?.level && (
                          <span className="text-[11px] text-slate-400 mt-1 block">
                            {curriculum.level}
                          </span>
                        )}
                      </div>

                      {/* Vacant Badge or Delete Button for Coordinator */}
                      <div className="flex items-center gap-1 shrink-0">
                        {isVacant && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-[10px] font-bold bg-emerald-100 text-emerald-800">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
                            شاغر
                          </span>
                        )}
                        {currentRole === 'coordinator' && (
                          <button
                            onClick={() => onDeleteCoordination(item.id)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-all cursor-pointer"
                            title="حذف الشعبة من التنسيق"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Action Button: اختيار أو انسحاب أو تعاون */}
                    <div className="pt-2 pb-3 border-t border-slate-100">
                      {isVacant ? (
                        /* زر اختيار الموضوع */
                        currentUser ? (
                          <button
                            onClick={() => onAssign(item.id, currentUser.id)}
                            className="w-full py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
                          >
                            <Check className="w-4 h-4" />
                            <span>اختيار هذا الموضوع</span>
                          </button>
                        ) : (
                          <span className="text-xs text-slate-400 block text-center py-2">
                            متاح للحجز
                          </span>
                        )
                      ) : isMyTopic ? (
                        /* زر الانسحاب */
                        <button
                          onClick={() => onLeave(item.id, currentUser.id)}
                          className="w-full py-2 px-3 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer border border-rose-200"
                        >
                          <LogOut className="w-3.5 h-3.5" />
                          <span>انسحاب من إعداد هذا الموضوع</span>
                        </button>
                      ) : (
                        /* زر التعاون */
                        currentUser && (
                          <button
                            onClick={() => onCollaborate(item.id, currentUser.id)}
                            className="w-full py-2 px-3 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer border border-blue-200"
                          >
                            <UserPlus className="w-3.5 h-3.5" />
                            <span>التعاون في إعداد هذا الموضوع</span>
                          </button>
                        )
                      )}
                    </div>
                  </div>

                  {/* Bottom: الأساتذة المسندين له */}
                  <div className="pt-3 border-t border-slate-100 mt-2">
                    <span className="text-[11px] font-bold text-slate-400 block mb-2">
                      الأساتذة المسندين للموضوع:
                    </span>

                    {isVacant ? (
                      <div className="p-3 bg-slate-50 rounded-2xl text-center text-slate-400 text-xs">
                        لم يتم اختيار هذا الموضوع من أي أستاذ بعد
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {/* Primary Teacher */}
                        {primaryTeacher && (
                          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2 min-w-0">
                              <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-black text-xs shrink-0">
                                {primaryTeacher.name.charAt(primaryTeacher.name.indexOf(' ') + 1) || 'أ'}
                              </div>
                              <span className="font-black text-xs text-slate-900 truncate">
                                {primaryTeacher.name}
                              </span>
                            </div>
                            <span className="px-2 py-0.5 rounded-md text-[10px] font-black bg-emerald-100 text-emerald-800 shrink-0">
                              المكلف الرئيسي
                            </span>
                          </div>
                        )}

                        {/* Collaborators */}
                        {collaborators.map((collab) => (
                          <div
                            key={collab.id}
                            className="p-2.5 rounded-xl bg-blue-50/60 border border-blue-200/80 flex items-center justify-between gap-2"
                          >
                            <div className="flex items-center gap-2 min-w-0">
                              <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center font-black text-xs shrink-0">
                                {collab.name.charAt(collab.name.indexOf(' ') + 1) || 'م'}
                              </div>
                              <span className="font-bold text-xs text-slate-900 truncate">
                                {collab.name}
                              </span>
                            </div>
                            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-blue-100 text-blue-800 shrink-0">
                              متعاون
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* ========================================================================= */
        /* الطريقة الثانية: عرض الأساتذة مرتبين تصاعدياً بالأقل إسناداً وتحتهم المواضيع */
        /* ========================================================================= */
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
              <h3 className="font-black text-base text-slate-900">
                قائمة الأساتذة (مرتبين تصاعدياً حسب الأقل إسناداً للمواضيع)
              </h3>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-500 font-bold">
              <span>الأقل إسناداً: <strong className="text-amber-700">{getTeacherTopicCount(sortedTeachers[0]?.id || '')} موضوع</strong></span>
              <span>•</span>
              <span>إجمالي الأساتذة: <strong className="text-indigo-600 font-mono">{teachers.length}</strong></span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {sortedTeachers.map((teacher, rankIdx) => {
              const primaryTopics = coordinationList.filter((c) => c.primaryTeacherId === teacher.id);
              const collabTopics = coordinationList.filter((c) => (c.collaboratorIds || []).includes(teacher.id));
              const allTeacherTopics = [
                ...primaryTopics.map((top) => ({ topic: top, role: 'primary' })),
                ...collabTopics.map((top) => ({ topic: top, role: 'collab' }))
              ];
              const topicCount = allTeacherTopics.length;
              const isMe = currentUser && currentUser.id === teacher.id;

              return (
                <div
                  key={teacher.id}
                  className={`bg-white rounded-3xl border-2 p-5 shadow-xs transition-all flex flex-col justify-between ${
                    topicCount === 0
                      ? 'border-amber-200 bg-amber-50/20 hover:border-amber-400'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  {/* Top: Teacher Header & Topic Count Badge */}
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-11 h-11 rounded-2xl flex items-center justify-center font-bold text-sm shrink-0 shadow-2xs ${
                            topicCount > 0 ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {topicCount > 0 ? <UserCheck className="w-5 h-5" /> : <UserX className="w-5 h-5" />}
                        </div>

                        <div>
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="font-black text-sm text-slate-900">
                              {teacher.name}
                            </span>
                            {isMe && (
                              <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-indigo-100 text-indigo-700">
                                أنت
                              </span>
                            )}
                          </div>
                          {teacher.isCoordinator && (
                            <span className="text-[11px] font-bold text-blue-600 block mt-0.5">
                              (منسق المادة)
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Rank Indicator / Workload Count Badge */}
                      <div className="shrink-0">
                        {topicCount === 0 ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-[11px] font-black bg-amber-100 text-amber-900 border border-amber-200">
                            <Clock className="w-3.5 h-3.5 text-amber-600" />
                            <span>0 موضوع</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-[11px] font-black bg-emerald-100 text-emerald-900 border border-emerald-200">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            <span>{topicCount} موضوع</span>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Bottom: المواضيع المسندة إليه */}
                  <div className="pt-3 border-t border-slate-100 mt-2">
                    <span className="text-[11px] font-bold text-slate-400 block mb-2">
                      المواضيع المسندة لهذا الأستاذ ({topicCount}):
                    </span>

                    {topicCount === 0 ? (
                      <div className="p-3 bg-slate-50 border border-dashed border-slate-200 rounded-2xl text-center text-slate-400 text-xs space-y-1.5">
                        <p className="font-bold text-amber-800">لم يُسند إليه أي موضوع بعد</p>
                        {isMe && (
                          <button
                            type="button"
                            onClick={() => setViewMode('streams')}
                            className="mt-1 text-xs font-black text-indigo-600 hover:text-indigo-800 underline cursor-pointer"
                          >
                            اختر موضوعاً الآن من قائمة الشعب ◄
                          </button>
                        )}
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {allTeacherTopics.map(({ topic, role }) => {
                          const curr = CURRICULA[topic.streamId];
                          const isPrimary = role === 'primary';

                          return (
                            <div
                              key={topic.id}
                              className={`p-2.5 rounded-xl border flex items-center justify-between gap-2 ${
                                isPrimary
                                  ? 'bg-slate-50 border-slate-200'
                                  : 'bg-blue-50/50 border-blue-200/80'
                              }`}
                            >
                              <div className="min-w-0">
                                <div className="flex items-center gap-1.5 flex-wrap">
                                  <span className="px-2 py-0.5 rounded-md text-[10px] font-black bg-indigo-100 text-indigo-900 font-mono">
                                    {curr?.code || topic.streamId}
                                  </span>
                                  <span className="font-bold text-xs text-slate-900 truncate">
                                    {curr?.stream || topic.streamId}
                                  </span>
                                </div>
                                <span className="text-[10px] text-slate-400 mt-0.5 block">
                                  {isPrimary ? 'مكلف رئيسي بالإعداد' : 'متعاون في الإعداد'}
                                </span>
                              </div>

                              {/* Action if this card belongs to ME: Option to leave */}
                              {isMe && (
                                <button
                                  onClick={() => onLeave(topic.id, currentUser.id)}
                                  className="px-2 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-[10px] shrink-0 transition-all cursor-pointer"
                                  title="انسحاب من هذا الموضوع"
                                >
                                  انسحاب
                                </button>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* MODAL: ADD COORDINATION ITEM */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
          <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-6 border border-slate-100 text-right">
            <h3 className="text-lg font-black text-slate-900 mb-1">إضافة موضوع جديد للتنسيق</h3>
            <p className="text-xs text-slate-500 mb-3">
              حدد نوع الموضوع والفصل، ثم أشر على المستويات والشعب التي يشملها هذا الموضوع
            </p>

            {/* Auto-archive notice */}
            {coordinationList.length > 0 && (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl text-amber-950 text-xs flex items-start gap-2 mb-3">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-black block">أرشفة تلقائية للمواضيع السابقة:</span>
                  <span className="text-[11px] text-amber-900 leading-relaxed">
                    سيتم أرشفة جميع الفروض والاختبارات الحالية ({coordinationList.length} موضوع) تلقائياً، والبدء بقائمة جديدة خاصة بهذا الموضوع.
                  </span>
                </div>
              </div>
            )}

            <form onSubmit={handleCreate} className="space-y-4">
              {/* Field 1: Topic Type (فرض / اختبار) */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  1- اسم الموضوع:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {['فرض', 'اختبار'].map((t) => (
                    <button
                      type="button"
                      key={t}
                      onClick={() => setNewType(t)}
                      className={`py-2.5 px-4 rounded-xl text-xs font-black border-2 transition-all cursor-pointer ${
                        newType === t
                          ? 'border-indigo-600 bg-indigo-50 text-indigo-700 shadow-xs'
                          : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Field 2: Term (الفصل الأول / الثاني / الثالث) */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  2- الفصل:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: '1', label: 'الفصل الأول' },
                    { id: '2', label: 'الفصل الثاني' },
                    { id: '3', label: 'الفصل الثالث' }
                  ].map((term) => (
                    <button
                      type="button"
                      key={term.id}
                      onClick={() => setNewTerm(term.id)}
                      className={`py-2 px-2 text-center rounded-xl text-xs font-bold border-2 transition-all cursor-pointer ${
                        newTerm === term.id
                          ? 'border-indigo-600 bg-indigo-50 text-indigo-700 shadow-xs'
                          : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {term.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Field 3: Streams / Levels with Checkboxes */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-slate-700">
                    3- المستويات والشعب المعنية:
                  </label>
                  <button
                    type="button"
                    onClick={handleSelectAllStreams}
                    className="text-[11px] font-bold text-indigo-600 hover:text-indigo-800 underline cursor-pointer"
                  >
                    {selectedStreamIds.length === allStreamList.length
                      ? 'إلغاء التحديد'
                      : `تحديد كل المستويات والشعب (${allStreamList.length})`}
                  </button>
                </div>

                <div className="space-y-1.5 max-h-52 overflow-y-auto p-1 bg-slate-50 border border-slate-200 rounded-2xl">
                  {allStreamList.map((c) => {
                    const isChecked = selectedStreamIds.includes(c.id);
                    return (
                      <label
                        key={c.id}
                        onClick={() => handleToggleStream(c.id)}
                        className={`p-2.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                          isChecked
                            ? 'bg-white border-indigo-500 shadow-xs'
                            : 'bg-transparent border-transparent hover:bg-white/60'
                        }`}
                      >
                        <span
                          className={`text-xs ${
                            isChecked ? 'font-black text-indigo-950' : 'font-semibold text-slate-700'
                          }`}
                        >
                          {c.stream}
                        </span>
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {}}
                          className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 pointer-events-none"
                        />
                      </label>
                    );
                  })}
                </div>
                {addError && <p className="text-xs text-rose-600 mt-1">{addError}</p>}
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-black shadow-md cursor-pointer active:scale-95"
                >
                  إنشاء وبدء التنسيق ({selectedStreamIds.length} شعبة)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: COORDINATION ARCHIVES LIST */}
      {showArchivesModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn no-print">
          <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl p-6 border border-slate-100 text-right max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4 shrink-0">
              <div className="flex items-center gap-2">
                <Archive className="w-5 h-5 text-indigo-600" />
                <h3 className="text-base font-black text-slate-800">
                  أرشيف الفروض والاختبارات السابقة
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowArchivesModal(false)}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="overflow-y-auto space-y-4 flex-1 pr-1">
              {loadingArchives ? (
                <div className="py-12 text-center text-slate-400 font-bold text-xs">
                  جاري تحميل الأرشيف...
                </div>
              ) : archivedRounds.length === 0 ? (
                <div className="py-12 text-center text-slate-400 space-y-2">
                  <Archive className="w-10 h-10 text-slate-300 mx-auto" />
                  <p className="font-bold text-xs text-slate-600">لا يوجد مواضيع مؤرشفة بعد</p>
                  <p className="text-[11px] text-slate-400">
                    عند إضافة موضوع جديد للتنسيق، سيتم أرشفة الفروض أو الاختبارات السابقة تلقائياً وتظهر سجلاتها هنا.
                  </p>
                </div>
              ) : (
                archivedRounds.map((round, rIdx) => {
                  const roundDate = new Date(round.archivedAt).toLocaleDateString('ar-DZ', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  });

                  return (
                    <div
                      key={round.id || rIdx}
                      className="border border-slate-200 rounded-2xl p-4 bg-slate-50/70 space-y-3"
                    >
                      <div className="flex items-center justify-between border-b border-slate-200/80 pb-2">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                          <span className="text-xs font-black text-slate-800 font-mono">
                            دورة تنسيق سابقة • {roundDate}
                          </span>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 text-indigo-700">
                            {round.items?.length || 0} موضوع
                          </span>
                        </div>
                        {currentRole === 'coordinator' && (
                          <button
                            onClick={() => handleDeleteArchivedRound(round.id)}
                            className="p-1 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-all cursor-pointer"
                            title="حذف هذا السجل المؤرشف"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                        {(round.items || []).map((item) => {
                          const primaryTeacher = teachers.find((t) => t.id === item.primaryTeacherId);
                          const curr = CURRICULA[item.streamId];
                          return (
                            <div
                              key={item.id}
                              className="p-2.5 rounded-xl bg-white border border-slate-200/80 flex items-center justify-between"
                            >
                              <div>
                                <span className="font-bold text-slate-800 block">{item.title}</span>
                                <span className="text-[10px] text-slate-500">
                                  {curr?.stream || item.streamId}
                                </span>
                              </div>
                              <div className="text-left">
                                <span className="text-[11px] font-bold text-indigo-900 block">
                                  {primaryTeacher ? primaryTeacher.name : 'شاغر'}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            <div className="pt-3 border-t border-slate-100 mt-2 flex justify-end shrink-0">
              <button
                type="button"
                onClick={() => setShowArchivesModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer"
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
