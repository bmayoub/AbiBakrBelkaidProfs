import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { MongoClient } from 'mongodb';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables (supports atlas-credentials.env or .env)
if (fs.existsSync(path.join(__dirname, 'atlas-credentials.env'))) {
  dotenv.config({ path: path.join(__dirname, 'atlas-credentials.env') });
} else {
  dotenv.config();
}

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const DATA_DIR = path.join(__dirname, 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');
const CURRICULA_DEFAULT_FILE = path.join(DATA_DIR, 'curricula_default.json');
const SYLLABUS_DEFAULT_FILE = path.join(DATA_DIR, 'syllabus_default.json');

function getDefaultCurricula() {
  try {
    if (fs.existsSync(CURRICULA_DEFAULT_FILE)) {
      return JSON.parse(fs.readFileSync(CURRICULA_DEFAULT_FILE, 'utf-8'));
    }
  } catch (e) {
    console.error('Error loading default curricula:', e);
  }
  return {};
}

function getDefaultSyllabus() {
  try {
    if (fs.existsSync(SYLLABUS_DEFAULT_FILE)) {
      return JSON.parse(fs.readFileSync(SYLLABUS_DEFAULT_FILE, 'utf-8'));
    }
  } catch (e) {
    console.error('Error loading default syllabus:', e);
  }
  return {};
}

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Initial Database Template
const INITIAL_DATA = {
  config: {
    institutionPasscode: '0001',
    coordinatorPasscode: '0000',
    academicYear: '2026/2027',
    schoolName: 'ثانوية الشهيد رابح بيطاط',
    wilaya: 'الجزائر',
    subject: 'العلوم الفيزيائية'
  },
  teachers: [
    { id: 't_benmohamed', name: 'الأستاذ بن محمد أيوب', pin: '0000', isCoordinator: true, phone: '0550000000', notes: 'أستاذ منسق المادة' },
    { id: 't1', name: 'الأستاذ عبية', pin: '1111', isCoordinator: false, phone: '0550000001', notes: 'أستاذ مادة' },
    { id: 't2', name: 'الأستاذ مختاري', pin: '2222', isCoordinator: false, phone: '0550000002', notes: 'أستاذ مادة' },
    { id: 't3', name: 'الأستاذة بن سالم', pin: '3333', isCoordinator: false, phone: '0550000003', notes: 'أستاذة مادة' },
    { id: 't4', name: 'الأستاذ قاسم', pin: '4444', isCoordinator: false, phone: '0550000004', notes: 'أستاذ مادة' }
  ],
  classes: [
    { id: 'c1', name: '3 ع ت 1', streamId: '3as_se', teacherId: 't_benmohamed' },
    { id: 'c2', name: '3 ع ت 2', streamId: '3as_se', teacherId: 't3' },
    { id: 'c3', name: '3 تق ر 1', streamId: '3as_tm', teacherId: 't1' },
    { id: 'c3_m', name: '3 ر 1', streamId: '3as_m', teacherId: 't1' },
    { id: 'c4', name: '2 ع ت 1', streamId: '2as_se', teacherId: 't2' },
    { id: 'c5', name: '2 ع ت 2', streamId: '2as_se', teacherId: 't_benmohamed' },
    { id: 'c6', name: '2 تق ر 1', streamId: '2as_tm', teacherId: 't4' },
    { id: 'c6_m', name: '2 ر 1', streamId: '2as_m', teacherId: 't4' },
    { id: 'c7', name: '1 ج م ع ت 1', streamId: '1as_tc_st', teacherId: 't3' },
    { id: 'c8', name: '1 ج م ع ت 2', streamId: '1as_tc_st', teacherId: 't4' },
    { id: 'c9', name: '2 آداب 1', streamId: '2as_lph', teacherId: 't2' },
    { id: 'c10', name: '1 ج م آداب 1', streamId: '1as_tc_l', teacherId: 't2' }
  ],
  coordination: [
    {
      id: 'coord-1',
      title: 'اختبار الفصل الأول - 3 علوم تجريبية',
      term: 1,
      streamId: '3as_se',
      type: 'اختبار',
      primaryTeacherId: 't1',
      collaboratorIds: ['t3'],
      status: 'قيد الإنجاز',
      notes: 'الموضوع يشمل المتابعة الزمنية والميكانيكا والظواهر الكهربائية',
            updatedAt: new Date().toISOString()
    },
    {
      id: 'coord-2',
      title: 'اختبار الفصل الأول - 3 تقني رياضي',
      term: 1,
      streamId: '3as_tm',
      type: 'اختبار',
      primaryTeacherId: 't1',
      collaboratorIds: [],
      status: 'قيد الإنجاز',
      notes: 'يرجى التركيز على التمارين النموذجية للتقني رياضي',
            updatedAt: new Date().toISOString()
    },
    {
      id: 'coord-2-m',
      title: 'اختبار الفصل الأول - 3 رياضيات',
      term: 1,
      streamId: '3as_m',
      type: 'اختبار',
      primaryTeacherId: 't1',
      collaboratorIds: [],
      status: 'قيد الإنجاز',
      notes: '',
            updatedAt: new Date().toISOString()
    },
    {
      id: 'coord-3',
      title: 'اختبار الفصل الأول - 2 علوم تجريبية',
      term: 1,
      streamId: '2as_se',
      type: 'اختبار',
      primaryTeacherId: 't2',
      collaboratorIds: [],
      status: 'قيد الإنجاز',
      notes: '',
            updatedAt: new Date().toISOString()
    },
    {
      id: 'coord-4',
      title: 'اختبار الفصل الأول - 2 تقني رياضي',
      term: 1,
      streamId: '2as_tm',
      type: 'اختبار',
      primaryTeacherId: 't4',
      collaboratorIds: [],
      status: 'قيد الإنجاز',
      notes: '',
            updatedAt: new Date().toISOString()
    },
    {
      id: 'coord-4-m',
      title: 'اختبار الفصل الأول - 2 رياضيات',
      term: 1,
      streamId: '2as_m',
      type: 'اختبار',
      primaryTeacherId: null,
      collaboratorIds: [],
      status: 'متاح',
      notes: '',
            updatedAt: new Date().toISOString()
    },
    {
      id: 'coord-5',
      title: 'اختبار الفصل الأول - 1 ج م ع تك',
      term: 1,
      streamId: '1as_tc_st',
      type: 'اختبار',
      primaryTeacherId: null,
      collaboratorIds: [],
      status: 'متاح',
      notes: 'موضوع مشترك بين جميع أقسام الأولى جذع مشترك علوم',
            updatedAt: new Date().toISOString()
    },
    {
      id: 'coord-6',
      title: 'اختبار الفصل الأول - 1 ج م آداب',
      term: 1,
      streamId: '1as_tc_l',
      type: 'اختبار',
      primaryTeacherId: 't2',
      collaboratorIds: [],
      status: 'جاهز للمراجعة',
      notes: 'الموضوع جاهز للمراجعة والتدقيق اللغوي والعلمي',
            updatedAt: new Date().toISOString()
    },
    {
      id: 'coord-7',
      title: 'فرض 2 الفصل الأول - 2 علوم تجريبية',
      term: 1,
      streamId: '2as_se',
      type: 'فرض 2',
      primaryTeacherId: null,
      collaboratorIds: [],
      status: 'متاح',
      notes: 'الأسبوع 09 في التوزيع',
            updatedAt: new Date().toISOString()
    }
  ],
  progress: {
    // classId: [array of checked week numbers]
    'c1': [1, 2, 3, 4, 5, 6, 7, 8],
    'c2': [1, 2, 3, 4, 5, 6, 7],
    'c3': [1, 2, 3, 4, 5, 6, 7, 8],
    'c4': [1, 2, 3, 4, 5, 6, 7],
    'c5': [1, 2, 3, 4, 5, 6, 7, 8],
    'c6': [1, 2, 3, 4, 5, 6],
    'c7': [1, 2, 3, 4, 5, 6, 7, 8],
    'c8': [1, 2, 3, 4, 5, 6, 7],
    'c9': [1, 2, 3, 4, 5, 6, 7],
    'c10': [1, 2, 3, 4, 5, 6, 7, 8]
  },
  delays: {
    'c6': {
      reason: 'صعوبة استيعاب وحدة العمل والطاقة الحركية والحاجة لحصص دعم إضافية',
      catchupPlan: 'برمجة حصة استدراكية يوم السبت',
      updatedAt: new Date().toISOString()
    }
  },
  logbook: {},
  archives: [],
  coordinationArchives: []
};

// Helper to read DB
function readDb() {
  try {
    if (!fs.existsSync(DB_FILE)) {
      INITIAL_DATA.curricula = getDefaultCurricula();
      INITIAL_DATA.syllabus = getDefaultSyllabus();
      fs.writeFileSync(DB_FILE, JSON.stringify(INITIAL_DATA, null, 2), 'utf-8');
      return INITIAL_DATA;
    }
    const data = fs.readFileSync(DB_FILE, 'utf-8');
    const db = JSON.parse(data);
    let changed = false;
    if (!db.curricula || Object.keys(db.curricula).length === 0) {
      db.curricula = getDefaultCurricula();
      changed = true;
    }
    if (!db.syllabus || Object.keys(db.syllabus).length === 0) {
      db.syllabus = getDefaultSyllabus();
      changed = true;
    }
    if (changed) {
      writeDb(db);
    }
    return db;
  } catch (err) {
    console.error('Error reading DB:', err);
    return INITIAL_DATA;
  }
}

// MongoDB Atlas connection state
let mongoCollection = null;

async function initMongo() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.log('No MONGODB_URI configured. Running with local filesystem database.');
    return;
  }
  try {
    console.log('Connecting to MongoDB Atlas...');
    const client = new MongoClient(uri, { serverSelectionTimeoutMS: 10000 });
    await client.connect();
    const db = client.db('profs_db');
    mongoCollection = db.collection('app_state');
    console.log('Connected successfully to MongoDB Atlas!');

    // Fetch existing data from MongoDB Atlas
    const cloudDoc = await mongoCollection.findOne({ _id: 'main_db' });
    if (cloudDoc) {
      delete cloudDoc._id;
      // Sync cloud data to local db.json
      const tempFile = `${DB_FILE}.tmp`;
      fs.writeFileSync(tempFile, JSON.stringify(cloudDoc, null, 2), 'utf-8');
      fs.renameSync(tempFile, DB_FILE);
      console.log('Database state synced from MongoDB Atlas cloud!');
    } else {
      // First time initialization: upload current local db.json to cloud
      console.log('First time setup: uploading local database to MongoDB Atlas...');
      const localData = readDb();
      await mongoCollection.replaceOne(
        { _id: 'main_db' },
        { ...localData, _id: 'main_db' },
        { upsert: true }
      );
      console.log('Uploaded initial data to MongoDB Atlas!');
    }
  } catch (err) {
    console.error('MongoDB Atlas notice:', err.message);
    console.log('Continuing with local filesystem storage.');
  }
}

// Helper to write DB atomically & sync with MongoDB Atlas
function writeDb(data) {
  try {
    const tempFile = `${DB_FILE}.tmp`;
    fs.writeFileSync(tempFile, JSON.stringify(data, null, 2), 'utf-8');
    fs.renameSync(tempFile, DB_FILE);

    // Asynchronously update MongoDB Atlas
    if (mongoCollection) {
      mongoCollection.replaceOne(
        { _id: 'main_db' },
        { ...data, _id: 'main_db' },
        { upsert: true }
      ).catch((e) => console.error('Error saving to MongoDB Atlas:', e.message));
    }
    return true;
  } catch (err) {
    console.error('Error writing DB:', err);
    return false;
  }
}

// Initialize on start
readDb();

// --- AUTH & CONFIG ROUTES ---
app.get('/api/config', (req, res) => {
  const db = readDb();
  res.json({
    academicYear: db.config.academicYear,
    schoolName: db.config.schoolName,
    wilaya: db.config.wilaya,
    subject: db.config.subject,
    institutionPasscode: db.config.institutionPasscode
  });
});

app.post('/api/config', (req, res) => {
  const db = readDb();
  const { institutionPasscode, coordinatorPasscode, academicYear, schoolName, wilaya, subject } = req.body;
  
  if (institutionPasscode !== undefined) db.config.institutionPasscode = institutionPasscode;
  if (coordinatorPasscode !== undefined) db.config.coordinatorPasscode = coordinatorPasscode;
  if (academicYear !== undefined) db.config.academicYear = academicYear;
  if (schoolName !== undefined) db.config.schoolName = schoolName;
  if (wilaya !== undefined) db.config.wilaya = wilaya;
  if (subject !== undefined) db.config.subject = subject;

  writeDb(db);
  res.json({ success: true, config: db.config });
});

app.post('/api/auth/verify-institution', (req, res) => {
  const { passcode } = req.body;
  const db = readDb();
  if (passcode === db.config.institutionPasscode) {
    return res.json({ success: true });
  }
  return res.status(401).json({ success: false, message: 'رمز المؤسسة غير صحيح' });
});

app.post('/api/auth/login-coordinator', (req, res) => {
  const { passcode } = req.body;
  const db = readDb();
  if (passcode === db.config.coordinatorPasscode) {
    return res.json({ success: true, role: 'coordinator' });
  }
  return res.status(401).json({ success: false, message: 'كلمة مرور المنسق غير صحيحة' });
});

app.post('/api/auth/login-teacher', (req, res) => {
  const { teacherId, pin } = req.body;
  const db = readDb();
  const teacher = db.teachers.find(t => t.id === teacherId);
  if (!teacher) {
    return res.status(404).json({ success: false, message: 'الرجاء اختيار الأستاذ من القائمة' });
  }
  if (teacher.pin === pin) {
    const role = teacher.isCoordinator ? 'coordinator' : 'teacher';
    return res.json({ success: true, role, teacher });
  }
  return res.status(401).json({ success: false, message: 'كلمة المرور غير صحيحة' });
});

// --- TEACHERS ROUTES ---
app.get('/api/teachers', (req, res) => {
  const db = readDb();
  res.json(db.teachers);
});

app.post('/api/teachers', (req, res) => {
  const db = readDb();
  const { name, pin, phone, notes, isCoordinator } = req.body;
  if (!name || !pin) {
    return res.status(400).json({ success: false, message: 'الاسم وكلمة المرور مطلوبان' });
  }
  const newTeacher = {
    id: `t_${Date.now()}`,
    name,
    pin: String(pin),
    isCoordinator: Boolean(isCoordinator),
    phone: phone || '',
    notes: notes || ''
  };
  db.teachers.push(newTeacher);
  writeDb(db);
  res.json({ success: true, teacher: newTeacher });
});

app.put('/api/teachers/:id', (req, res) => {
  const db = readDb();
  const { id } = req.params;
  const { name, pin, phone, notes, isCoordinator } = req.body;
  const index = db.teachers.findIndex(t => t.id === id);
  if (index === -1) {
    return res.status(404).json({ success: false, message: 'الأستاذ غير موجود' });
  }
  db.teachers[index] = {
    ...db.teachers[index],
    name: name !== undefined ? name : db.teachers[index].name,
    pin: pin !== undefined ? String(pin) : db.teachers[index].pin,
    phone: phone !== undefined ? phone : db.teachers[index].phone,
    notes: notes !== undefined ? notes : db.teachers[index].notes,
    isCoordinator: isCoordinator !== undefined ? Boolean(isCoordinator) : db.teachers[index].isCoordinator
  };
  writeDb(db);
  res.json({ success: true, teacher: db.teachers[index] });
});

// Teacher changes their own PIN
app.post('/api/teachers/:id/change-pin', (req, res) => {
  const db = readDb();
  const { id } = req.params;
  const { currentPin, newPin } = req.body;

  const teacher = db.teachers.find(t => t.id === id);
  if (!teacher) {
    return res.status(404).json({ success: false, message: 'الأستاذ غير موجود' });
  }

  // Check current PIN (trim for safety)
  if (teacher.pin && String(teacher.pin).trim() !== String(currentPin || '').trim()) {
    return res.status(400).json({ success: false, message: 'كلمة المرور الحالية غير صحيحة' });
  }

  if (!newPin || !String(newPin).trim()) {
    return res.status(400).json({ success: false, message: 'كلمة المرور الجديدة لا يمكن أن تكون فارغة' });
  }

  teacher.pin = String(newPin).trim();
  writeDb(db);

  res.json({ success: true, message: 'تم تغيير كلمة المرور بنجاح', teacher });
});

app.delete('/api/teachers/:id', (req, res) => {
  const db = readDb();
  const { id } = req.params;
  db.teachers = db.teachers.filter(t => t.id !== id);
  // unassign from classes
  db.classes = db.classes.map(c => c.teacherId === id ? { ...c, teacherId: null } : c);
  // update coordination items
  db.coordination = db.coordination.map(coord => {
    let changed = false;
    let primary = coord.primaryTeacherId;
    let collabs = coord.collaboratorIds || [];
    if (primary === id) {
      primary = null;
      changed = true;
    }
    if (collabs.includes(id)) {
      collabs = collabs.filter(cid => cid !== id);
      changed = true;
    }
    if (changed) {
      return {
        ...coord,
        primaryTeacherId: primary,
        collaboratorIds: collabs,
        status: !primary && collabs.length === 0 ? 'متاح' : coord.status
      };
    }
    return coord;
  });
  writeDb(db);
  res.json({ success: true });
});

// --- CLASSES ROUTES ---
app.get('/api/classes', (req, res) => {
  const db = readDb();
  res.json(db.classes);
});

// Batch create classes with sequential numbering
app.post('/api/classes/batch', (req, res) => {
  const db = readDb();
  const { batches, replaceExisting } = req.body;
  if (!Array.isArray(batches) || batches.length === 0) {
    return res.status(400).json({ success: false, message: 'بيانات الأقسام غير صحيحة' });
  }

  if (replaceExisting) {
    db.classes = [];
  }

  const createdClasses = [];
  let index = Date.now();

  batches.forEach((b) => {
    const count = Number(b.count) || 0;
    const prefix = b.prefix || '';
    const streamId = b.streamId;
    if (count > 0 && streamId) {
      for (let i = 1; i <= count; i++) {
        const className = `${prefix} ${i}`.trim();
        const newClass = {
          id: `c_${index++}`,
          name: className,
          streamId,
          teacherId: null
        };
        db.classes.push(newClass);
        if (!db.progress[newClass.id]) {
          db.progress[newClass.id] = [];
        }
        createdClasses.push(newClass);
      }
    }
  });

  writeDb(db);
  res.json({ success: true, createdClasses, allClasses: db.classes });
});

app.post('/api/classes', (req, res) => {
  const db = readDb();
  const { name, streamId, teacherId } = req.body;
  if (!name || !streamId) {
    return res.status(400).json({ success: false, message: 'اسم القسم والمستوى مطلوبان' });
  }
  const newClass = {
    id: `c_${Date.now()}`,
    name,
    streamId,
    teacherId: teacherId || null
  };
  db.classes.push(newClass);
  if (!db.progress[newClass.id]) {
    db.progress[newClass.id] = [];
  }
  writeDb(db);
  res.json({ success: true, classItem: newClass });
});

app.put('/api/classes/:id', (req, res) => {
  const db = readDb();
  const { id } = req.params;
  const { name, streamId, teacherId } = req.body;
  const index = db.classes.findIndex(c => c.id === id);
  if (index === -1) {
    return res.status(404).json({ success: false, message: 'القسم غير موجود' });
  }
  db.classes[index] = {
    ...db.classes[index],
    name: name !== undefined ? name : db.classes[index].name,
    streamId: streamId !== undefined ? streamId : db.classes[index].streamId,
    teacherId: teacherId !== undefined ? teacherId : db.classes[index].teacherId
  };
  writeDb(db);
  res.json({ success: true, classItem: db.classes[index] });
});

app.delete('/api/classes/:id', (req, res) => {
  const db = readDb();
  const { id } = req.params;
  db.classes = db.classes.filter(c => c.id !== id);
  delete db.progress[id];
  writeDb(db);
  res.json({ success: true });
});

// --- COORDINATION ROUTES ---
app.get('/api/coordination', (req, res) => {
  const db = readDb();
  res.json(db.coordination);
});

// Get coordination archives
app.get('/api/coordination/archives', (req, res) => {
  const db = readDb();
  res.json(db.coordinationArchives || []);
});

// Delete a coordination archive entry
app.delete('/api/coordination/archives/:id', (req, res) => {
  const db = readDb();
  if (db.coordinationArchives) {
    db.coordinationArchives = db.coordinationArchives.filter(a => a.id !== req.params.id);
    writeDb(db);
  }
  res.json({ success: true, coordinationArchives: db.coordinationArchives || [] });
});

// Manually archive currently active coordination topics
app.post('/api/coordination/archive-current', (req, res) => {
  const db = readDb();
  if (!db.coordinationArchives) db.coordinationArchives = [];
  const prevCount = (db.coordination || []).length;
  if (prevCount === 0) {
    return res.status(400).json({ success: false, message: 'لا توجد مواضيع حالية للأرشفة' });
  }

  db.coordinationArchives.unshift({
    id: `coord_arch_${Date.now()}`,
    archivedAt: new Date().toISOString(),
    itemCount: prevCount,
    items: [...db.coordination]
  });
  db.coordination = [];
  writeDb(db);

  res.json({
    success: true,
    message: `تمت أرشفة جميع المواضيع الحالية (${prevCount} موضوع) بنجاح`,
    coordinationList: db.coordination,
    coordinationArchives: db.coordinationArchives
  });
});

app.post('/api/coordination', (req, res) => {
  const db = readDb();
  const { title, term, streamId, streamIds, type } = req.body;
  const termNum = Number(term) || 1;
  const topicType = type || 'فرض';

  // Automatically archive all previous active coordination items when adding a new test/exam
  if (!db.coordinationArchives) db.coordinationArchives = [];
  const prevCount = (db.coordination || []).length;
  if (prevCount > 0) {
    db.coordinationArchives.unshift({
      id: `coord_arch_${Date.now()}`,
      archivedAt: new Date().toISOString(),
      itemCount: prevCount,
      items: [...db.coordination]
    });
    db.coordination = [];
  }

  // Support batch creation when multiple streams are checked
  if (Array.isArray(streamIds) && streamIds.length > 0) {
    const createdItems = [];
    streamIds.forEach((sid, idx) => {
      const itemTitle = `${topicType} الفصل ${termNum}`;
      const newCoord = {
        id: `coord_${Date.now()}_${idx}`,
        title: itemTitle,
        term: termNum,
        streamId: sid,
        type: topicType,
        primaryTeacherId: null,
        collaboratorIds: [],
        status: 'متاح',
        notes: '',
        updatedAt: new Date().toISOString()
      };
      db.coordination.push(newCoord);
      createdItems.push(newCoord);
    });
    writeDb(db);
    return res.json({
      success: true,
      coordinationItems: createdItems,
      coordinationItem: createdItems[0],
      coordinationList: db.coordination,
      archivedPreviousCount: prevCount
    });
  }

  // Single creation fallback
  if (!streamId) {
    return res.status(400).json({ success: false, message: 'يرجى اختيار مستوى واحد على الأقل' });
  }
  const itemTitle = title || `${topicType} الفصل ${termNum}`;
  const newCoord = {
    id: `coord_${Date.now()}`,
    title: itemTitle,
    term: termNum,
    streamId,
    type: topicType,
    primaryTeacherId: null,
    collaboratorIds: [],
    status: 'متاح',
    notes: '',
    updatedAt: new Date().toISOString()
  };
  db.coordination.push(newCoord);
  writeDb(db);
  res.json({
    success: true,
    coordinationItem: newCoord,
    coordinationItems: [newCoord],
    coordinationList: db.coordination,
    archivedPreviousCount: prevCount
  });
});

app.put('/api/coordination/:id', (req, res) => {
  const db = readDb();
  const { id } = req.params;
  const index = db.coordination.findIndex(c => c.id === id);
  if (index === -1) {
    return res.status(404).json({ success: false, message: 'الموضوع غير موجود' });
  }
  db.coordination[index] = {
    ...db.coordination[index],
    ...req.body,
    updatedAt: new Date().toISOString()
  };
  writeDb(db);
  res.json({ success: true, coordinationItem: db.coordination[index] });
});

// Teacher assigns self as primary
app.post('/api/coordination/:id/assign', (req, res) => {
  const db = readDb();
  const { id } = req.params;
  const { teacherId } = req.body;
  const item = db.coordination.find(c => c.id === id);
  if (!item) {
    return res.status(404).json({ success: false, message: 'الموضوع غير موجود' });
  }
  if (item.primaryTeacherId && item.primaryTeacherId !== teacherId) {
    return res.status(400).json({ success: false, message: 'هذا الموضوع محجوز بالفعل من قبل أستاذ آخر، يمكنك اختيار التعاون معه' });
  }

  item.primaryTeacherId = teacherId;
  item.status = 'قيد الإنجاز';
  item.updatedAt = new Date().toISOString();
  writeDb(db);
  res.json({ success: true, coordinationItem: item });
});

// Teacher collaborates
app.post('/api/coordination/:id/collaborate', (req, res) => {
  const db = readDb();
  const { id } = req.params;
  const { teacherId } = req.body;
  const item = db.coordination.find(c => c.id === id);
  if (!item) {
    return res.status(404).json({ success: false, message: 'الموضوع غير موجود' });
  }
  if (!item.primaryTeacherId) {
    // If no primary teacher yet, make this teacher primary
    item.primaryTeacherId = teacherId;
  } else if (item.primaryTeacherId === teacherId) {
    return res.status(400).json({ success: false, message: 'أنت الأستاذ الرئيسي لهذا الموضوع' });
  } else {
    if (!item.collaboratorIds) item.collaboratorIds = [];
    if (!item.collaboratorIds.includes(teacherId)) {
      item.collaboratorIds.push(teacherId);
    }
  }
  item.status = 'قيد الإنجاز';
  item.updatedAt = new Date().toISOString();
  writeDb(db);
  res.json({ success: true, coordinationItem: item });
});

// Teacher leaves/unassigns
app.post('/api/coordination/:id/leave', (req, res) => {
  const db = readDb();
  const { id } = req.params;
  const { teacherId } = req.body;
  const item = db.coordination.find(c => c.id === id);
  if (!item) {
    return res.status(404).json({ success: false, message: 'الموضوع غير موجود' });
  }

  if (item.primaryTeacherId === teacherId) {
    // If there is a collaborator, promote collaborator to primary
    if (item.collaboratorIds && item.collaboratorIds.length > 0) {
      item.primaryTeacherId = item.collaboratorIds.shift();
    } else {
      item.primaryTeacherId = null;
      item.status = 'متاح';
    }
  } else if (item.collaboratorIds && item.collaboratorIds.includes(teacherId)) {
    item.collaboratorIds = item.collaboratorIds.filter(cid => cid !== teacherId);
  }

  item.updatedAt = new Date().toISOString();
  writeDb(db);
  res.json({ success: true, coordinationItem: item });
});

app.delete('/api/coordination/:id', (req, res) => {
  const db = readDb();
  const { id } = req.params;
  db.coordination = db.coordination.filter(c => c.id !== id);
  writeDb(db);
  res.json({ success: true });
});

// --- PROGRESS ROUTES ---
app.get('/api/progress', (req, res) => {
  const db = readDb();
  res.json(db.progress);
});

app.post('/api/progress/toggle', (req, res) => {
  const db = readDb();
  const { classId, weekNum } = req.body;
  if (!classId || weekNum === undefined) {
    return res.status(400).json({ success: false, message: 'معرف القسم ورقم الأسبوع مطلوبان' });
  }

  if (!db.progress[classId]) {
    db.progress[classId] = [];
  }

  const list = db.progress[classId];
  const weekInt = Number(weekNum);
  const index = list.indexOf(weekInt);

  if (index > -1) {
    list.splice(index, 1);
  } else {
    list.push(weekInt);
    list.sort((a, b) => a - b);
  }

  writeDb(db);
  res.json({ success: true, progress: db.progress[classId] });
});

// --- DELAYS ROUTES ---
app.get('/api/delays', (req, res) => {
  const db = readDb();
  res.json(db.delays || {});
});

app.post('/api/delays', (req, res) => {
  const db = readDb();
  if (!db.delays) db.delays = {};
  const { classId, reason, catchupPlan } = req.body;
  if (!classId) {
    return res.status(400).json({ success: false, message: 'معرف القسم مطلوب' });
  }
  if (!reason || !reason.trim()) {
    delete db.delays[classId];
  } else {
    db.delays[classId] = {
      reason: reason.trim(),
      catchupPlan: catchupPlan ? catchupPlan.trim() : '',
      updatedAt: new Date().toISOString()
    };
  }
  writeDb(db);
  res.json({ success: true, delays: db.delays });
});

app.delete('/api/delays/:classId', (req, res) => {
  const db = readDb();
  if (db.delays && db.delays[req.params.classId]) {
    delete db.delays[req.params.classId];
    writeDb(db);
  }
  res.json({ success: true, delays: db.delays || {} });
});

// --- LOGBOOK (دفتر النصوص) ROUTES ---
app.get('/api/logbook', (req, res) => {
  const db = readDb();
  res.json(db.logbook || {});
});

app.post('/api/logbook/toggle', (req, res) => {
  const { classId, itemId } = req.body;
  if (!classId || !itemId) {
    return res.status(400).json({ success: false, message: 'معرف القسم ومعرف الدرس مطلوبان' });
  }
  const db = readDb();
  if (!db.logbook) db.logbook = {};
  if (!Array.isArray(db.logbook[classId])) {
    db.logbook[classId] = [];
  }
  const idx = db.logbook[classId].indexOf(itemId);
  if (idx === -1) {
    db.logbook[classId].push(itemId);
  } else {
    db.logbook[classId].splice(idx, 1);
  }
  writeDb(db);
  res.json({ success: true, checkedItems: db.logbook[classId], logbook: db.logbook });
});

app.post('/api/logbook/toggle-unit', (req, res) => {
  const { classId, itemIds, markCompleted } = req.body;
  if (!classId || !Array.isArray(itemIds)) {
    return res.status(400).json({ success: false, message: 'بيانات غير صحيحة' });
  }
  const db = readDb();
  if (!db.logbook) db.logbook = {};
  if (!Array.isArray(db.logbook[classId])) {
    db.logbook[classId] = [];
  }
  const currentSet = new Set(db.logbook[classId]);
  if (markCompleted) {
    itemIds.forEach((id) => currentSet.add(id));
  } else {
    itemIds.forEach((id) => currentSet.delete(id));
  }
  db.logbook[classId] = Array.from(currentSet);
  writeDb(db);
  res.json({ success: true, checkedItems: db.logbook[classId], logbook: db.logbook });
});

// --- CURRICULA (التوزيع السنوي) MANAGEMENT ROUTES ---
app.get('/api/curricula', (req, res) => {
  const db = readDb();
  res.json(db.curricula || getDefaultCurricula());
});

app.put('/api/curricula/:streamId', (req, res) => {
  const { streamId } = req.params;
  const db = readDb();
  if (!db.curricula) db.curricula = getDefaultCurricula();
  if (!db.curricula[streamId]) {
    db.curricula[streamId] = { id: streamId, weeks: [] };
  }
  db.curricula[streamId] = {
    ...db.curricula[streamId],
    ...req.body,
    id: streamId
  };
  writeDb(db);
  res.json({ success: true, curriculum: db.curricula[streamId], curricula: db.curricula });
});

app.post('/api/curricula/:streamId/reset', (req, res) => {
  const { streamId } = req.params;
  const db = readDb();
  const defaults = getDefaultCurricula();
  if (!defaults[streamId]) {
    return res.status(404).json({ success: false, message: 'الشعبة غير معروفة' });
  }
  if (!db.curricula) db.curricula = {};
  db.curricula[streamId] = JSON.parse(JSON.stringify(defaults[streamId]));
  writeDb(db);
  res.json({ success: true, curriculum: db.curricula[streamId], curricula: db.curricula });
});

// --- SYLLABUS (دفتر النصوص) MANAGEMENT ROUTES ---
app.get('/api/syllabus', (req, res) => {
  const db = readDb();
  res.json(db.syllabus || getDefaultSyllabus());
});

app.put('/api/syllabus/:streamId', (req, res) => {
  const { streamId } = req.params;
  const db = readDb();
  if (!db.syllabus) db.syllabus = getDefaultSyllabus();
  if (!db.syllabus[streamId]) {
    db.syllabus[streamId] = { streamId, units: [] };
  }
  db.syllabus[streamId] = {
    ...db.syllabus[streamId],
    ...req.body,
    streamId
  };
  writeDb(db);
  res.json({ success: true, syllabus: db.syllabus[streamId], allSyllabus: db.syllabus });
});

app.post('/api/syllabus/:streamId/reset', (req, res) => {
  const { streamId } = req.params;
  const db = readDb();
  const defaults = getDefaultSyllabus();
  if (!defaults[streamId]) {
    return res.status(404).json({ success: false, message: 'الشعبة غير معروفة' });
  }
  if (!db.syllabus) db.syllabus = {};
  db.syllabus[streamId] = JSON.parse(JSON.stringify(defaults[streamId]));
  writeDb(db);
  res.json({ success: true, syllabus: db.syllabus[streamId], allSyllabus: db.syllabus });
});

// --- ARCHIVE & NEW ACADEMIC YEAR ROUTES ---
app.get('/api/archives', (req, res) => {
  const db = readDb();
  res.json(db.archives || []);
});

app.post('/api/archive/new-year', (req, res) => {
  const db = readDb();
  const { newAcademicYear } = req.body;
  if (!newAcademicYear || !newAcademicYear.trim()) {
    return res.status(400).json({ success: false, message: 'السنة الدراسية الجديدة مطلوبة' });
  }

  if (!db.archives) db.archives = [];

  // Snapshot the current year's full records
  const archiveEntry = {
    id: `archive_${Date.now()}`,
    academicYear: db.config?.academicYear || 'السنة السابقة',
    schoolName: db.config?.schoolName || '',
    wilaya: db.config?.wilaya || '',
    archivedAt: new Date().toISOString(),
    teachers: JSON.parse(JSON.stringify(db.teachers || [])),
    classes: JSON.parse(JSON.stringify(db.classes || [])),
    progress: JSON.parse(JSON.stringify(db.progress || {})),
    coordination: JSON.parse(JSON.stringify(db.coordination || [])),
    delays: JSON.parse(JSON.stringify(db.delays || {})),
    logbook: JSON.parse(JSON.stringify(db.logbook || {}))
  };

  db.archives.unshift(archiveEntry);

  // Start new academic year:
  // 1. Update academic year
  if (!db.config) db.config = {};
  db.config.academicYear = newAcademicYear.trim();

  // 2. Keep the same teachers (untouched)

  // 3. Keep the same classes, BUT reset teacher assignments (teacherId = null)
  db.classes = (db.classes || []).map((cls) => ({
    ...cls,
    teacherId: null
  }));

  // 4. Reset progress, coordination, delays, logbook
  db.progress = {};
  db.coordination = [];
  db.delays = {};
  db.logbook = {};

  writeDb(db);

  res.json({
    success: true,
    message: `تمت أرشفة السنة الدراسية (${archiveEntry.academicYear}) وفتح السنة الدراسية الجديدة (${newAcademicYear}) بنجاح`,
    archive: archiveEntry,
    config: db.config,
    classes: db.classes,
    teachers: db.teachers,
    progress: db.progress,
    coordination: db.coordination,
    delays: db.delays,
    archives: db.archives
  });
});

app.delete('/api/archives/:id', (req, res) => {
  const db = readDb();
  if (db.archives) {
    db.archives = db.archives.filter((a) => a.id !== req.params.id);
    writeDb(db);
  }
  res.json({ success: true, archives: db.archives || [] });
});

// Reset database to initial template
app.post('/api/reset', (req, res) => {
  writeDb(INITIAL_DATA);
  res.json({ success: true, message: 'تمت إعادة ضبط البيانات بنجاح' });
});

// Serve frontend build if in production
const distPath = path.join(__dirname, 'dist');
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  app.use((req, res, next) => {
    if (req.method === 'GET' && !req.path.startsWith('/api')) {
      return res.sendFile(path.join(distPath, 'index.html'));
    }
    next();
  });
}

// Connect to MongoDB Atlas if configured, then start server
await initMongo();

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
