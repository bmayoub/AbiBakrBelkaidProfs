import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import PasscodeGate from './components/PasscodeGate';
import RoleSelectModal from './components/RoleSelectModal';
import CoordinationTab from './components/CoordinationTab';
import CurriculumProgressTab from './components/CurriculumProgressTab';
import LogbookTab from './components/LogbookTab';
import DocumentsTab from './components/DocumentsTab';
import CoordinatorAdminTab from './components/CoordinatorAdminTab';
import MobileBottomNav from './components/MobileBottomNav';
import ReportPrintModal from './components/ReportPrintModal';
import ChangePinModal from './components/ChangePinModal';
import TeacherCredentialsPrintModal from './components/TeacherCredentialsPrintModal';
import { CURRICULA } from './data/curricula';
import { SYLLABUS_DATA } from './data/syllabusData';
import * as api from './api';

export default function App() {
  // Institutional gate
  const [isUnlocked, setIsUnlocked] = useState(() => {
    return localStorage.getItem('inst_unlocked') === 'true';
  });

  // Current session: role ('teacher' | 'coordinator') & user object
  const [currentRole, setCurrentRole] = useState(() => {
    return localStorage.getItem('curr_role') || null;
  });
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('curr_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Active Main Tab: Progress is primary, Coordination is secondary
  const [activeTab, setActiveTab] = useState('progress'); // 'progress' | 'coordination' | 'admin'

  // Modal states
  const [showRoleModal, setShowRoleModal] = useState(!currentRole);
  const [showReportModal, setShowReportModal] = useState(false);
  const [showChangePinModal, setShowChangePinModal] = useState(false);
  const [showTeacherCredentialsModal, setShowTeacherCredentialsModal] = useState(false);

  // App Data
  const [config, setConfig] = useState(null);
  const [teachers, setTeachers] = useState([]);
  const [classes, setClasses] = useState([]);
  const [coordinationList, setCoordinationList] = useState([]);
  const [progress, setProgress] = useState({});
  const [delays, setDelays] = useState({});
  const [logbookData, setLogbookData] = useState({});
  const [curriculaData, setCurriculaData] = useState(CURRICULA);
  const [syllabusData, setSyllabusData] = useState(SYLLABUS_DATA);
  const [archives, setArchives] = useState([]);
  const [selectedArchiveForReport, setSelectedArchiveForReport] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load all initial data
  const loadData = async () => {
    try {
      setLoading(true);
      const [cfg, tList, cList, coordList, prog, delayData, archs, logs, curriculaRes, syllabusRes] = await Promise.all([
        api.fetchConfig(),
        api.fetchTeachers(),
        api.fetchClasses(),
        api.fetchCoordination(),
        api.fetchProgress(),
        api.fetchDelays(),
        api.fetchArchives(),
        api.fetchLogbook(),
        api.fetchCurricula(),
        api.fetchSyllabus()
      ]);
      if (cfg) setConfig(cfg);
      if (tList) setTeachers(tList);
      if (cList) setClasses(cList);
      if (coordList) setCoordinationList(coordList);
      if (prog) setProgress(prog);
      if (delayData) setDelays(delayData);
      if (archs) setArchives(archs);
      if (logs) setLogbookData(logs);
      if (curriculaRes && Object.keys(curriculaRes).length > 0) setCurriculaData(curriculaRes);
      if (syllabusRes && Object.keys(syllabusRes).length > 0) setSyllabusData(syllabusRes);
    } catch (err) {
      console.error('Error loading data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Unlock institution gate
  const handleUnlockGate = async (passcode, callback) => {
    try {
      const res = await api.verifyInstitutionPasscode(passcode);
      if (res.success) {
        setIsUnlocked(true);
        localStorage.setItem('inst_unlocked', 'true');
        callback(null);
      } else {
        callback(res.message || 'رمز المؤسسة غير صحيح');
      }
    } catch (err) {
      callback('حدث خطأ في الاتصال بالخادم');
    }
  };

  // Login as Coordinator
  const handleSelectCoordinator = async (pin, callback) => {
    try {
      const res = await api.loginCoordinator(pin);
      if (res.success) {
        setCurrentRole('coordinator');
        setCurrentUser({ id: 'coord', name: 'منسق المادة' });
        localStorage.setItem('curr_role', 'coordinator');
        localStorage.setItem('curr_user', JSON.stringify({ id: 'coord', name: 'منسق المادة' }));
        setShowRoleModal(false);
        callback(null);
      } else {
        callback(res.message || 'رمز المرور غير صحيح');
      }
    } catch (err) {
      callback('تعذر التحقق من الرمز');
    }
  };

  // Login as Teacher / Coordinator
  const handleSelectTeacher = async (teacherId, pin, callback) => {
    try {
      const res = await api.loginTeacher(teacherId, pin);
      if (res.success) {
        const userRole = res.role || (res.teacher?.isCoordinator ? 'coordinator' : 'teacher');
        setCurrentRole(userRole);
        setCurrentUser(res.teacher);
        localStorage.setItem('curr_role', userRole);
        localStorage.setItem('curr_user', JSON.stringify(res.teacher));
        setShowRoleModal(false);
        callback(null);
      } else {
        callback(res.message || 'رمز المرور غير صحيح');
      }
    } catch (err) {
      callback('تعذر تسجيل الدخول');
    }
  };

  // Logout / Switch User
  const handleLogout = () => {
    setCurrentRole(null);
    setCurrentUser(null);
    localStorage.removeItem('curr_role');
    localStorage.removeItem('curr_user');
    setShowRoleModal(true);
  };

  // --- Coordination Actions ---
  const handleAssignCoordination = async (id, teacherId) => {
    const res = await api.assignCoordination(id, teacherId);
    if (res.success) {
      setCoordinationList((prev) =>
        prev.map((c) => (c.id === id ? res.coordinationItem : c))
      );
    }
  };

  const handleCollaborateCoordination = async (id, teacherId) => {
    const res = await api.collaborateCoordination(id, teacherId);
    if (res.success) {
      setCoordinationList((prev) =>
        prev.map((c) => (c.id === id ? res.coordinationItem : c))
      );
    }
  };

  const handleLeaveCoordination = async (id, teacherId) => {
    const res = await api.leaveCoordination(id, teacherId);
    if (res.success) {
      setCoordinationList((prev) =>
        prev.map((c) => (c.id === id ? res.coordinationItem : c))
      );
    }
  };

  const handleAddCoordination = async (data) => {
    const res = await api.createCoordination(data);
    if (res.success) {
      if (res.coordinationList) {
        setCoordinationList(res.coordinationList);
      } else if (res.coordinationItems && res.coordinationItems.length > 0) {
        setCoordinationList(res.coordinationItems);
      } else if (res.coordinationItem) {
        setCoordinationList([res.coordinationItem]);
      }
    }
  };

  const handleUpdateCoordination = async (id, data) => {
    const res = await api.updateCoordination(id, data);
    if (res.success) {
      setCoordinationList((prev) =>
        prev.map((c) => (c.id === id ? res.coordinationItem : c))
      );
    }
  };

  const handleDeleteCoordination = async (id) => {
    const res = await api.deleteCoordination(id);
    if (res.success) {
      setCoordinationList((prev) => prev.filter((c) => c.id !== id));
    }
  };

  const handleArchiveCurrentCoordination = async () => {
    const res = await api.archiveCurrentCoordination();
    if (res.success) {
      setCoordinationList([]);
    }
    return res;
  };

  // --- Progress Actions ---
  const handleToggleWeek = async (classId, weekNum) => {
    const res = await api.toggleProgressWeek(classId, weekNum);
    if (res.success) {
      setProgress((prev) => ({
        ...prev,
        [classId]: res.progress
      }));
    }
  };

  const handleSaveDelay = async (classId, reason, catchupPlan) => {
    const res = await api.saveDelayReason(classId, reason, catchupPlan);
    if (res.success) {
      setDelays(res.delays);
    }
  };

  const handleDeleteDelay = async (classId) => {
    const res = await api.deleteDelayReason(classId);
    if (res.success) {
      setDelays(res.delays);
    }
  };

  // --- Admin Actions ---
  const handleAddTeacher = async (data) => {
    const res = await api.createTeacher(data);
    if (res.success) {
      setTeachers((prev) => [...prev, res.teacher]);
    }
  };

  const handleUpdateTeacher = async (id, data) => {
    const res = await api.updateTeacher(id, data);
    if (res.success) {
      setTeachers((prev) => prev.map((t) => (t.id === id ? res.teacher : t)));
    }
  };

  const handleDeleteTeacher = async (id) => {
    const res = await api.deleteTeacher(id);
    if (res.success) {
      setTeachers((prev) => prev.filter((t) => t.id !== id));
      loadData(); // reload classes to refresh assignments
    }
  };

  const handleAddClass = async (data) => {
    const res = await api.createClass(data);
    if (res.success) {
      setClasses((prev) => [...prev, res.classItem]);
    }
  };

  const handleAddClassesBatch = async (batches, replaceExisting = false) => {
    const res = await api.createClassesBatch(batches, replaceExisting);
    if (res.success && res.allClasses) {
      setClasses(res.allClasses);
    }
  };

  const handleUpdateClass = async (id, data) => {
    const res = await api.updateClass(id, data);
    if (res.success) {
      setClasses((prev) => prev.map((c) => (c.id === id ? res.classItem : c)));
    }
  };

  const handleDeleteClass = async (id) => {
    const res = await api.deleteClass(id);
    if (res.success) {
      setClasses((prev) => prev.filter((c) => c.id !== id));
    }
  };

  const handleUpdateConfig = async (newConfig) => {
    const res = await api.updateConfig(newConfig);
    if (res.success) {
      setConfig(res.config);
    }
  };

  const handleResetData = async () => {
    await api.resetDatabase();
    await loadData();
  };

  const handleArchiveAndStartNewYear = async (newAcademicYear) => {
    const res = await api.archiveAndStartNewYear(newAcademicYear);
    if (res.success) {
      if (res.config) setConfig(res.config);
      if (res.classes) setClasses(res.classes);
      if (res.teachers) setTeachers(res.teachers);
      if (res.progress) setProgress(res.progress);
      if (res.coordination) setCoordinationList(res.coordination);
      if (res.delays) setDelays(res.delays);
      if (res.archives) setArchives(res.archives);
      return { success: true, message: res.message };
    }
    return { success: false, message: res.message || 'حدث خطأ أثناء الأرشفة' };
  };

  const handleDeleteArchive = async (id) => {
    const res = await api.deleteArchive(id);
    if (res.success && res.archives) {
      setArchives(res.archives);
    }
  };

  const handleChangeTeacherPin = async (teacherId, currentPin, newPin) => {
    const res = await api.changeTeacherPin(teacherId, currentPin, newPin);
    if (res.success && res.teacher) {
      setTeachers((prev) => prev.map((t) => (t.id === teacherId ? res.teacher : t)));
      if (currentUser && currentUser.id === teacherId) {
        setCurrentUser(res.teacher);
        localStorage.setItem('curr_user', JSON.stringify(res.teacher));
      }
    }
    return res;
  };

  // Logbook toggle handlers (like Curriculum Progress)
  const handleToggleLogbookItem = async (classId, itemId) => {
    // Optimistic UI update
    setLogbookData((prev) => {
      const currentList = prev[classId] || [];
      const updated = currentList.includes(itemId)
        ? currentList.filter((id) => id !== itemId)
        : [...currentList, itemId];
      return { ...prev, [classId]: updated };
    });

    try {
      const res = await api.toggleLogbookItem(classId, itemId);
      if (res.success && res.checkedItems) {
        setLogbookData((prev) => ({
          ...prev,
          [classId]: res.checkedItems
        }));
      }
    } catch (err) {
      console.error('Error toggling logbook item:', err);
    }
  };

  const handleToggleLogbookUnit = async (classId, itemIds, markCompleted) => {
    // Optimistic UI update
    setLogbookData((prev) => {
      const currentSet = new Set(prev[classId] || []);
      if (markCompleted) {
        itemIds.forEach((id) => currentSet.add(id));
      } else {
        itemIds.forEach((id) => currentSet.delete(id));
      }
      return { ...prev, [classId]: Array.from(currentSet) };
    });

    try {
      const res = await api.toggleLogbookUnit(classId, itemIds, markCompleted);
      if (res.success && res.checkedItems) {
        setLogbookData((prev) => ({
          ...prev,
          [classId]: res.checkedItems
        }));
      }
    } catch (err) {
      console.error('Error toggling logbook unit:', err);
    }
  };

  // Curriculum (التوزيع السنوي) modification handlers for Coordinator
  const handleUpdateCurriculum = async (streamId, data) => {
    setCurriculaData((prev) => ({
      ...prev,
      [streamId]: {
        ...prev[streamId],
        ...data
      }
    }));
    try {
      const res = await api.updateCurriculum(streamId, data);
      if (res.success && res.curricula) {
        setCurriculaData(res.curricula);
      }
      return res;
    } catch (err) {
      console.error('Error updating curriculum:', err);
      return { success: false, message: err.message };
    }
  };

  const handleResetCurriculum = async (streamId) => {
    try {
      const res = await api.resetCurriculum(streamId);
      if (res.success && res.curricula) {
        setCurriculaData(res.curricula);
      }
      return res;
    } catch (err) {
      console.error('Error resetting curriculum:', err);
      return { success: false, message: err.message };
    }
  };

  // Syllabus (دفتر النصوص) modification handlers for Coordinator
  const handleUpdateSyllabus = async (streamId, data) => {
    setSyllabusData((prev) => ({
      ...prev,
      [streamId]: {
        ...prev[streamId],
        ...data
      }
    }));
    try {
      const res = await api.updateSyllabus(streamId, data);
      if (res.success && res.allSyllabus) {
        setSyllabusData(res.allSyllabus);
      }
      return res;
    } catch (err) {
      console.error('Error updating syllabus:', err);
      return { success: false, message: err.message };
    }
  };

  const handleResetSyllabus = async (streamId) => {
    try {
      const res = await api.resetSyllabus(streamId);
      if (res.success && res.allSyllabus) {
        setSyllabusData(res.allSyllabus);
      }
      return res;
    } catch (err) {
      console.error('Error resetting syllabus:', err);
      return { success: false, message: err.message };
    }
  };

  // 1. If not unlocked, render Passcode Gate
  if (!isUnlocked) {
    return (
      <PasscodeGate
        onUnlock={handleUnlockGate}
        schoolName={config?.schoolName}
        academicYear={config?.academicYear}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-['Cairo'] text-slate-800">
      {/* Header */}
      <Header
        currentUser={currentUser}
        currentRole={currentRole}
        config={config}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenReport={() => setShowReportModal(true)}
        onOpenTeacherCredentials={() => setShowTeacherCredentialsModal(true)}
        onOpenChangePin={() => setShowChangePinModal(true)}
        onLogout={handleLogout}
      />

      {/* Main Content Area */}
      <main className={`flex-1 ${activeTab === 'coordination' ? 'max-w-[1700px]' : 'max-w-7xl'} w-full mx-auto p-3 sm:p-6 lg:p-8 no-print`}>
        {loading ? (
          <div className="flex flex-col items-center justify-center min-h-[50vh] text-slate-400">
            <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-3"></div>
            <p className="text-xs font-bold">جاري تحميل بيانات المنصة...</p>
          </div>
        ) : (
          <>
            {/* Tab 1: Progress Tracking */}
            {activeTab === 'progress' && (
              <CurriculumProgressTab
                classes={classes}
                teachers={teachers}
                progress={progress}
                delays={delays}
                curriculaData={curriculaData}
                currentUser={currentUser}
                currentRole={currentRole}
                onToggleWeek={handleToggleWeek}
                onSaveDelay={handleSaveDelay}
                onDeleteDelay={handleDeleteDelay}
                onUpdateCurriculum={handleUpdateCurriculum}
                onResetCurriculum={handleResetCurriculum}
                onOpenProgressReport={() => setShowReportModal(true)}
              />
            )}

            {/* Tab 2: Logbook (دفتر النصوص) */}
            {activeTab === 'logbook' && (
              <LogbookTab
                classes={classes}
                teachers={teachers}
                currentUser={currentUser}
                currentRole={currentRole}
                config={config}
                syllabusData={syllabusData}
                logbookData={logbookData}
                onToggleItem={handleToggleLogbookItem}
                onToggleUnit={handleToggleLogbookUnit}
                onUpdateSyllabus={handleUpdateSyllabus}
                onResetSyllabus={handleResetSyllabus}
              />
            )}

            {/* Tab 3: Coordination */}
            {activeTab === 'coordination' && (
              <CoordinationTab
                coordinationList={coordinationList}
                teachers={teachers}
                currentUser={currentUser}
                currentRole={currentRole}
                onAssign={handleAssignCoordination}
                onCollaborate={handleCollaborateCoordination}
                onLeave={handleLeaveCoordination}
                onAddCoordination={handleAddCoordination}
                onUpdateCoordination={handleUpdateCoordination}
                onDeleteCoordination={handleDeleteCoordination}
                onArchiveCurrent={handleArchiveCurrentCoordination}
              />
            )}

            {/* Tab 4: Official Documents & Direct Downloads (المكتبة التربوية) */}
            {activeTab === 'documents' && (
              <DocumentsTab config={config} />
            )}

            {/* Tab 5: Coordinator Admin */}
            {activeTab === 'admin' && currentRole === 'coordinator' && (
              <CoordinatorAdminTab
                teachers={teachers}
                classes={classes}
                config={config}
                archives={archives}
                onAddTeacher={handleAddTeacher}
                onUpdateTeacher={handleUpdateTeacher}
                onDeleteTeacher={handleDeleteTeacher}
                onAddClass={handleAddClass}
                onAddClassesBatch={handleAddClassesBatch}
                onUpdateClass={handleUpdateClass}
                onDeleteClass={handleDeleteClass}
                onUpdateConfig={handleUpdateConfig}
                onResetData={handleResetData}
                onArchiveAndStartNewYear={handleArchiveAndStartNewYear}
                onDeleteArchive={handleDeleteArchive}
                onViewArchiveReport={(arch) => setSelectedArchiveForReport(arch)}
                onOpenTeacherCredentials={() => setShowTeacherCredentialsModal(true)}
              />
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-4 px-6 text-center text-xs text-slate-500 mb-14 sm:mb-0 no-print">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <span>منصة التنسيق البيداغوجي لمادة العلوم الفيزيائية • {config?.schoolName || 'ثانوية أبي بكر بلقايد - النزلة'}</span>
          <span className="font-mono text-slate-400">السنة الدراسية: {config?.academicYear || '2026/2027'}</span>
        </div>
      </footer>

      {/* Mobile Sticky Bottom Navigation */}
      <MobileBottomNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentRole={currentRole}
      />

      {/* Role / Login Modal */}
      <RoleSelectModal
        isOpen={showRoleModal}
        teachers={teachers}
        onSelectCoordinator={handleSelectCoordinator}
        onSelectTeacher={handleSelectTeacher}
        onClose={() => setShowRoleModal(false)}
      />

      {/* Printable Report Modal */}
      <ReportPrintModal
        isOpen={Boolean(selectedArchiveForReport || showReportModal)}
        onClose={() => {
          setShowReportModal(false);
          setSelectedArchiveForReport(null);
        }}
        config={
          selectedArchiveForReport
            ? {
                schoolName: selectedArchiveForReport.schoolName,
                wilaya: selectedArchiveForReport.wilaya,
                academicYear: selectedArchiveForReport.academicYear,
                subject: config?.subject || 'العلوم الفيزيائية'
              }
            : config || {}
        }
        teachers={selectedArchiveForReport ? selectedArchiveForReport.teachers : teachers}
        classes={selectedArchiveForReport ? selectedArchiveForReport.classes : classes}
        coordinationList={selectedArchiveForReport ? selectedArchiveForReport.coordination : coordinationList}
        progress={selectedArchiveForReport ? selectedArchiveForReport.progress : progress}
        delays={selectedArchiveForReport ? selectedArchiveForReport.delays : delays}
        curriculaData={curriculaData}
      />

      {/* Change Password Modal */}
      <ChangePinModal
        isOpen={showChangePinModal}
        onClose={() => setShowChangePinModal(false)}
        teacher={currentUser}
        onChangePin={handleChangeTeacherPin}
      />

      {/* Teacher Credentials Print / Photo Modal */}
      <TeacherCredentialsPrintModal
        isOpen={showTeacherCredentialsModal}
        onClose={() => setShowTeacherCredentialsModal(false)}
        teachers={teachers}
        classes={classes}
        config={config || {}}
      />
    </div>
  );
}
