import React, { useState, useMemo, useEffect } from 'react';
import {
  FolderDown,
  Download,
  ExternalLink,
  Search,
  FileText,
  BookOpen,
  Calendar,
  GraduationCap,
  Filter,
  CheckCircle2,
  Sparkles,
  Layers,
  FileCode,
  HardDrive
} from 'lucide-react';
import { DOCUMENTS_DATA } from '../data/documentsData';
import { fetchDocuments } from '../api';

export default function DocumentsTab({ config }) {
  const [documents, setDocuments] = useState(DOCUMENTS_DATA);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('all'); // 'all' | '1as' | '2as' | '3as'
  const [selectedCategory, setSelectedCategory] = useState('all'); // 'all' | 'progression' | 'curriculum' | 'accompanying' | 'guide'
  const [selectedStream, setSelectedStream] = useState('all');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadRemoteDocs() {
      try {
        const remote = await fetchDocuments();
        if (remote && Array.isArray(remote) && remote.length > 0) {
          setDocuments(remote);
        }
      } catch (err) {
        console.warn('Using bundled documents data');
      }
    }
    loadRemoteDocs();
  }, []);

  // Filtered documents
  const filteredDocuments = useMemo(() => {
    return documents.filter((doc) => {
      // Level filter
      if (selectedLevel !== 'all' && doc.level !== selectedLevel) return false;
      // Category filter
      if (selectedCategory !== 'all' && doc.category !== selectedCategory) return false;
      // Stream filter
      if (selectedStream !== 'all' && doc.stream !== selectedStream) return false;
      // Search filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchTitle = doc.title?.toLowerCase().includes(q);
        const matchFile = doc.fileName?.toLowerCase().includes(q);
        const matchStream = doc.streamName?.toLowerCase().includes(q);
        const matchCode = doc.code?.toLowerCase().includes(q);
        const matchCat = doc.categoryName?.toLowerCase().includes(q);
        if (!matchTitle && !matchFile && !matchStream && !matchCode && !matchCat) {
          return false;
        }
      }
      return true;
    });
  }, [documents, selectedLevel, selectedCategory, selectedStream, searchQuery]);

  // Statistics
  const stats = useMemo(() => {
    const total = documents.length;
    const pdfCount = documents.filter((d) => d.ext === 'PDF').length;
    const docCount = documents.filter((d) => d.ext === 'DOC' || d.ext === 'DOCX').length;
    const totalBytes = documents.reduce((acc, d) => acc + (d.sizeBytes || 0), 0);
    const totalMb = (totalBytes / (1024 * 1024)).toFixed(1);
    return { total, pdfCount, docCount, totalMb };
  }, [documents]);

  // Unique streams for filter dropdown
  const availableStreams = useMemo(() => {
    const map = new Map();
    documents.forEach((d) => {
      if (d.stream && !map.has(d.stream)) {
        map.set(d.stream, {
          stream: d.stream,
          streamName: d.streamName,
          level: d.level,
          levelName: d.levelName
        });
      }
    });
    return Array.from(map.values());
  }, [documents]);

  const getCategoryBadge = (cat) => {
    switch (cat) {
      case 'progression':
        return {
          bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
          dot: 'bg-emerald-500',
          icon: Calendar,
          label: 'تدرج سنوي'
        };
      case 'curriculum':
        return {
          bg: 'bg-blue-50 text-blue-700 border-blue-200',
          dot: 'bg-blue-500',
          icon: BookOpen,
          label: 'منهاج رسمي'
        };
      case 'accompanying':
        return {
          bg: 'bg-purple-50 text-purple-700 border-purple-200',
          dot: 'bg-purple-500',
          icon: FileText,
          label: 'وثيقة مرافقة'
        };
      case 'guide':
        return {
          bg: 'bg-amber-50 text-amber-700 border-amber-200',
          dot: 'bg-amber-500',
          icon: GraduationCap,
          label: 'دليل الأستاذ'
        };
      default:
        return {
          bg: 'bg-slate-50 text-slate-700 border-slate-200',
          dot: 'bg-slate-500',
          icon: FileText,
          label: 'وثيقة'
        };
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner / Hero Card */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 text-white p-6 sm:p-8 shadow-xl">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-semibold text-indigo-200 border border-white/10">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>المكتبة البيداغوجية والوثائق الوزارية الرسمية</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              مكتبة التحميل المباشر للوثائق والمناهج
            </h1>
            <p className="text-sm sm:text-base text-indigo-100/90 leading-relaxed">
              تحميل مباشر بنقرة واحدة لجميع الوثائق المرجعية لمادة العلوم الفيزيائية:
              آليات تنفيذ التدرجات السنوية، المناهج التعليمية الرسمية، الوثائق المرافقة، وأدلة الأستاذ للكتاب المدرسي لجميع المستويات والشعب.
            </p>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 shrink-0">
            <div className="bg-white/10 backdrop-blur-md p-3 rounded-xl border border-white/10 text-center">
              <div className="text-2xl font-black text-white">{stats.total}</div>
              <div className="text-[11px] font-medium text-indigo-200">وثيقة رسمية</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md p-3 rounded-xl border border-white/10 text-center">
              <div className="text-2xl font-black text-rose-300">{stats.pdfCount}</div>
              <div className="text-[11px] font-medium text-indigo-200">ملف PDF</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md p-3 rounded-xl border border-white/10 text-center">
              <div className="text-2xl font-black text-sky-300">{stats.docCount}</div>
              <div className="text-[11px] font-medium text-indigo-200">ملف Word</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md p-3 rounded-xl border border-white/10 text-center">
              <div className="text-2xl font-black text-amber-300">{stats.totalMb}</div>
              <div className="text-[11px] font-medium text-indigo-200">ميغابايت</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Control Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-4 sm:p-5 space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="w-5 h-5 absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ابحث باسم الوثيقة، الشعبة، أو الكلمات المفتاحية (مثال: دليل الأستاذ، منهاج، 3 علوم تجريبية)..."
            className="w-full pr-11 pl-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all text-slate-800 placeholder-slate-400"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-slate-600 bg-slate-200 hover:bg-slate-300 rounded-full w-5 h-5 flex items-center justify-center transition-colors"
            >
              ✕
            </button>
          )}
        </div>

        {/* Filter Chips / Selectors */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pt-1 border-t border-slate-100">
          {/* Level Filter */}
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-1 sm:pb-0">
            <span className="text-xs font-bold text-slate-400 shrink-0 ml-1">المستوى:</span>
            {[
              { id: 'all', label: 'الكل' },
              { id: '1as', label: '1 ثانوي (1AS)' },
              { id: '2as', label: '2 ثانوي (2AS)' },
              { id: '3as', label: '3 ثانوي (3AS)' }
            ].map((lvl) => (
              <button
                key={lvl.id}
                onClick={() => {
                  setSelectedLevel(lvl.id);
                  setSelectedStream('all');
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all shrink-0 ${
                  selectedLevel === lvl.id
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {lvl.label}
              </button>
            ))}
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-1 sm:pb-0">
            <span className="text-xs font-bold text-slate-400 shrink-0 ml-1">النوع:</span>
            {[
              { id: 'all', label: 'جميع الأنواع' },
              { id: 'progression', label: 'التدرجات السنوية' },
              { id: 'curriculum', label: 'المناهج الرسمية' },
              { id: 'accompanying', label: 'الوثائق المرافقة' },
              { id: 'guide', label: 'أدلة الأستاذ' }
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all shrink-0 ${
                  selectedCategory === cat.id
                    ? 'bg-slate-800 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Stream Filter (Optional fine-grained selection) */}
        {selectedLevel !== 'all' && (
          <div className="flex items-center gap-2 pt-2 border-t border-slate-100 overflow-x-auto scrollbar-none">
            <span className="text-xs font-semibold text-slate-500 shrink-0">الشعبة المحددة:</span>
            <button
              onClick={() => setSelectedStream('all')}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
                selectedStream === 'all'
                  ? 'bg-indigo-100 text-indigo-700 font-bold'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              جميع شعب هذا المستوى
            </button>
            {availableStreams
              .filter((s) => s.level === selectedLevel)
              .map((s) => (
                <button
                  key={s.stream}
                  onClick={() => setSelectedStream(s.stream)}
                  className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all shrink-0 ${
                    selectedStream === s.stream
                      ? 'bg-indigo-100 text-indigo-700 font-bold'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {s.streamName}
                </button>
              ))}
          </div>
        )}
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between text-xs sm:text-sm text-slate-500 px-1">
        <span>
          عرض <strong className="text-slate-800 font-bold">{filteredDocuments.length}</strong> من أصل{' '}
          <strong>{documents.length}</strong> وثيقة
        </span>
        {(searchQuery || selectedLevel !== 'all' || selectedCategory !== 'all' || selectedStream !== 'all') && (
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedLevel('all');
              setSelectedCategory('all');
              setSelectedStream('all');
            }}
            className="text-xs font-bold text-indigo-600 hover:text-indigo-800 hover:underline"
          >
            إعادة تعيين جميع الفلاتر
          </button>
        )}
      </div>

      {/* Documents Grid */}
      {filteredDocuments.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredDocuments.map((doc) => {
            const badge = getCategoryBadge(doc.category);
            const BadgeIcon = badge.icon;
            const isPdf = doc.ext === 'PDF';

            return (
              <div
                key={doc.id}
                className="group bg-white rounded-2xl border border-slate-200/90 hover:border-indigo-300 hover:shadow-md transition-all duration-200 p-5 flex flex-col justify-between"
              >
                {/* Header of Card */}
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold border ${badge.bg}`}
                    >
                      <BadgeIcon className="w-3.5 h-3.5 shrink-0" />
                      <span>{badge.label}</span>
                    </span>

                    {/* File Format Badge */}
                    <span
                      className={`px-2 py-0.5 rounded text-[11px] font-black tracking-wider uppercase border ${
                        isPdf
                          ? 'bg-rose-50 text-rose-700 border-rose-200'
                          : 'bg-sky-50 text-sky-700 border-sky-200'
                      }`}
                    >
                      {doc.ext}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-2 leading-snug">
                      {doc.title}
                    </h3>
                    <p className="text-xs font-medium text-slate-500 mt-1 flex items-center gap-1.5">
                      <span className="inline-block w-1.5 h-1.5 rounded-full bg-slate-300" />
                      <span>{doc.levelName}</span>
                      {doc.code && (
                        <>
                          <span>•</span>
                          <span className="font-semibold text-slate-700">{doc.code}</span>
                        </>
                      )}
                    </p>
                  </div>
                </div>

                {/* Footer and Actions */}
                <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                  <div className="text-[11px] text-slate-500 font-medium flex items-center gap-1">
                    <HardDrive className="w-3.5 h-3.5 text-slate-400" />
                    <span>{doc.sizeStr}</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {/* Inline Preview (for PDFs) */}
                    {doc.previewUrl && (
                      <a
                        href={doc.previewUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
                        title="معاينة الملف في نافذة جديدة"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">معاينة</span>
                      </a>
                    )}

                    {/* Direct Download Button */}
                    <a
                      href={doc.downloadUrl}
                      download
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 active:scale-95 shadow-sm transition-all"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>تحميل مباشر</span>
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-800">لا توجد وثائق مطابقة</h3>
          <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
            لم نتمكن من العثور على وثائق تطابق الفلاتر المحددة. جرب تغيير كلمة البحث أو إعادة تعيين الفلاتر.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedLevel('all');
              setSelectedCategory('all');
              setSelectedStream('all');
            }}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 transition-all shadow-sm"
          >
            إظهار كافة الوثائق ({documents.length})
          </button>
        </div>
      )}

      {/* Useful Educational Information Banner */}
      <div className="bg-slate-50 rounded-2xl border border-slate-200/80 p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-600 shrink-0 mt-0.5">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div className="text-xs sm:text-sm space-y-0.5">
            <h4 className="font-bold text-slate-800">جميع الملفات رسمية ومطابقة لأحدث تدرجات وزارة التربية</h4>
            <p className="text-slate-500">
              يمكن استخدام أدلة الأستاذ والمناهج كمرجع رسمي لتحضير الأنشطة المخبرية وبناء مذكرات الدروس.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

