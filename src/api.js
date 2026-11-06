// API helper with automatic fallback to localStorage if server is offline
const API_BASE = '/api';

export async function fetchConfig() {
  try {
    const res = await fetch(`${API_BASE}/config`);
    if (!res.ok) throw new Error('Failed to fetch config');
    return await res.json();
  } catch (err) {
    console.warn('API error, using local fallback:', err);
    return null;
  }
}

export async function updateConfig(data) {
  const res = await fetch(`${API_BASE}/config`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return await res.json();
}

export async function verifyInstitutionPasscode(passcode) {
  const res = await fetch(`${API_BASE}/auth/verify-institution`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ passcode })
  });
  return await res.json();
}

export async function loginCoordinator(passcode) {
  const res = await fetch(`${API_BASE}/auth/login-coordinator`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ passcode })
  });
  return await res.json();
}

export async function loginTeacher(teacherId, pin) {
  const res = await fetch(`${API_BASE}/auth/login-teacher`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ teacherId, pin })
  });
  return await res.json();
}

export async function fetchTeachers() {
  const res = await fetch(`${API_BASE}/teachers`);
  return await res.json();
}

export async function createTeacher(data) {
  const res = await fetch(`${API_BASE}/teachers`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return await res.json();
}

export async function updateTeacher(id, data) {
  const res = await fetch(`${API_BASE}/teachers/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return await res.json();
}

export async function changeTeacherPin(teacherId, currentPin, newPin) {
  const res = await fetch(`${API_BASE}/teachers/${teacherId}/change-pin`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ currentPin, newPin })
  });
  return await res.json();
}

export async function deleteTeacher(id) {
  const res = await fetch(`${API_BASE}/teachers/${id}`, { method: 'DELETE' });
  return await res.json();
}

export async function fetchClasses() {
  const res = await fetch(`${API_BASE}/classes`);
  return await res.json();
}

export async function createClassesBatch(batches, replaceExisting = false) {
  const res = await fetch(`${API_BASE}/classes/batch`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ batches, replaceExisting })
  });
  return await res.json();
}

export async function createClass(data) {
  const res = await fetch(`${API_BASE}/classes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return await res.json();
}

export async function updateClass(id, data) {
  const res = await fetch(`${API_BASE}/classes/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return await res.json();
}

export async function deleteClass(id) {
  const res = await fetch(`${API_BASE}/classes/${id}`, { method: 'DELETE' });
  return await res.json();
}

export async function fetchCoordination() {
  const res = await fetch(`${API_BASE}/coordination`);
  return await res.json();
}

export async function fetchCoordinationArchives() {
  try {
    const res = await fetch(`${API_BASE}/coordination/archives`);
    return await res.json();
  } catch (err) {
    console.warn('Failed to fetch coordination archives:', err);
    return [];
  }
}

export async function deleteCoordinationArchive(id) {
  const res = await fetch(`${API_BASE}/coordination/archives/${id}`, { method: 'DELETE' });
  return await res.json();
}

export async function archiveCurrentCoordination() {
  const res = await fetch(`${API_BASE}/coordination/archive-current`, {
    method: 'POST'
  });
  return await res.json();
}

export async function createCoordination(data) {
  const res = await fetch(`${API_BASE}/coordination`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return await res.json();
}

export async function updateCoordination(id, data) {
  const res = await fetch(`${API_BASE}/coordination/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return await res.json();
}

export async function deleteCoordination(id) {
  const res = await fetch(`${API_BASE}/coordination/${id}`, { method: 'DELETE' });
  return await res.json();
}

export async function assignCoordination(id, teacherId) {
  const res = await fetch(`${API_BASE}/coordination/${id}/assign`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ teacherId })
  });
  return await res.json();
}

export async function collaborateCoordination(id, teacherId) {
  const res = await fetch(`${API_BASE}/coordination/${id}/collaborate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ teacherId })
  });
  return await res.json();
}

export async function leaveCoordination(id, teacherId) {
  const res = await fetch(`${API_BASE}/coordination/${id}/leave`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ teacherId })
  });
  return await res.json();
}

export async function fetchProgress() {
  const res = await fetch(`${API_BASE}/progress`);
  return await res.json();
}

export async function toggleProgressWeek(classId, weekNum) {
  const res = await fetch(`${API_BASE}/progress/toggle`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ classId, weekNum })
  });
  return await res.json();
}

export async function fetchDelays() {
  const res = await fetch(`${API_BASE}/delays`);
  return await res.json();
}

export async function saveDelayReason(classId, reason, catchupPlan) {
  const res = await fetch(`${API_BASE}/delays`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ classId, reason, catchupPlan })
  });
  return await res.json();
}

export async function deleteDelayReason(classId) {
  const res = await fetch(`${API_BASE}/delays/${classId}`, {
    method: 'DELETE'
  });
  return await res.json();
}

export async function resetDatabase() {
  const res = await fetch(`${API_BASE}/reset`, { method: 'POST' });
  return await res.json();
}

// --- ARCHIVES ---
export async function fetchArchives() {
  try {
    const res = await fetch(`${API_BASE}/archives`);
    if (!res.ok) throw new Error('Failed to fetch archives');
    return await res.json();
  } catch (err) {
    console.warn('API error fetching archives:', err);
    return [];
  }
}

export async function archiveAndStartNewYear(newAcademicYear) {
  const res = await fetch(`${API_BASE}/archive/new-year`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ newAcademicYear })
  });
  return await res.json();
}

export async function deleteArchive(id) {
  const res = await fetch(`${API_BASE}/archives/${id}`, {
    method: 'DELETE'
  });
  return await res.json();
}

// --- LOGBOOK (دفتر النصوص) ---
export async function fetchLogbook() {
  try {
    const res = await fetch(`${API_BASE}/logbook`);
    if (!res.ok) throw new Error('Failed to fetch logbook');
    return await res.json();
  } catch (err) {
    console.warn('API error fetching logbook:', err);
    return {};
  }
}

export async function toggleLogbookItem(classId, itemId) {
  const res = await fetch(`${API_BASE}/logbook/toggle`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ classId, itemId })
  });
  return await res.json();
}

export async function toggleLogbookUnit(classId, itemIds, markCompleted) {
  const res = await fetch(`${API_BASE}/logbook/toggle-unit`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ classId, itemIds, markCompleted })
  });
  return await res.json();
}

// --- CURRICULA (التوزيع السنوي) ---
export async function fetchCurricula() {
  try {
    const res = await fetch(`${API_BASE}/curricula`);
    if (!res.ok) throw new Error('Failed to fetch curricula');
    return await res.json();
  } catch (err) {
    console.warn('API error fetching curricula:', err);
    return null;
  }
}

export async function updateCurriculum(streamId, data) {
  const res = await fetch(`${API_BASE}/curricula/${streamId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return await res.json();
}

export async function resetCurriculum(streamId) {
  const res = await fetch(`${API_BASE}/curricula/${streamId}/reset`, {
    method: 'POST'
  });
  return await res.json();
}

// --- SYLLABUS (دفتر النصوص) ---
export async function fetchSyllabus() {
  try {
    const res = await fetch(`${API_BASE}/syllabus`);
    if (!res.ok) throw new Error('Failed to fetch syllabus');
    return await res.json();
  } catch (err) {
    console.warn('API error fetching syllabus:', err);
    return null;
  }
}

export async function updateSyllabus(streamId, data) {
  const res = await fetch(`${API_BASE}/syllabus/${streamId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return await res.json();
}

export async function resetSyllabus(streamId) {
  const res = await fetch(`${API_BASE}/syllabus/${streamId}/reset`, {
    method: 'POST'
  });
  return await res.json();
}




