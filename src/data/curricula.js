// التوزيعات السنوية الرسمية لمادة العلوم الفيزيائية - وزارة التربية الوطنية الجزائرية

// أسابيع 3 تر + ر
const WEEKS_3AS_TM_M = [
  { num: 1, dates: '2026/09/21 - 2026/09/24', term: 1, unit: 'الدخول المدرسي للتلاميذ : تقديم البرنامج', percent: 0, evalType: 'تقويم تشخيصي', isHoliday: false },
  { num: 2, dates: '2026/09/27 - 2026/10/01', term: 1, unit: '01: المتابعة الزمنية لتحول كيميائي في وسط مائي (06 سا + 04 أ م)', percent: 4, evalType: '', isHoliday: false },
  { num: 3, dates: '2026/10/04 - 2026/10/08', term: 1, unit: '01: المتابعة الزمنية لتحول كيميائي في وسط مائي', percent: 8, evalType: '', isHoliday: false },
  { num: 4, dates: '2026/10/11 - 2026/10/15', term: 1, unit: '01: المتابعة الزمنية لتحول كيميائي في وسط مائي', percent: 12, evalType: 'واجب 1', isHoliday: false },
  { num: 5, dates: '2026/10/18 - 2026/10/22', term: 1, unit: '02: تطور جملة ميكانيكية (16 سا + 05 أ م)', percent: 16, evalType: '', isHoliday: false },
  { num: 6, dates: '2026/10/25 - 2026/10/28', term: 1, unit: '02: تطور جملة ميكانيكية', percent: 20, evalType: 'فرض 1', isHoliday: false },
  { num: 'ع1', dates: '2025/10/29 - 2025/11/02', term: 1, unit: 'عطلة الخريف', percent: 20, evalType: 'عطلة', isHoliday: true },
  { num: 7, dates: '2026/11/02 - 2026/11/05', term: 1, unit: '02: تطور جملة ميكانيكية (16 سا + 05 أ م)', percent: 25, evalType: 'واجب 2', isHoliday: false },
  { num: 8, dates: '2026/11/08 - 2026/11/12', term: 1, unit: '02: تطور جملة ميكانيكية', percent: 30, evalType: 'فرض 2', isHoliday: false },
  { num: 9, dates: '2026/11/15 - 2026/11/19', term: 1, unit: '02: تطور جملة ميكانيكية', percent: 34, evalType: '', isHoliday: false },
  { num: 10, dates: '2026/11/22 - 2026/11/26', term: 1, unit: '03: دراسة ظواهر كهربائية (11 سا + 03 أ م)', percent: 38, evalType: '', isHoliday: false },
  { num: 11, dates: '2026/11/29 - 2026/12/03', term: 1, unit: '03: دراسة ظواهر كهربائية', percent: 42, evalType: '', isHoliday: false },
  { num: 12, dates: '2026/12/06 - 2026/12/10', term: 1, unit: 'تقويم تحصيلي (اختبار الفصل الأول)', percent: 42, evalType: 'اختبار الفصل الأول', isHoliday: false },
  { num: 13, dates: '2026/12/13 - 2026/12/17', term: 1, unit: 'أسبوع مغلق', percent: 42, evalType: 'أسبوع مغلق', isHoliday: false },
  { num: 'ع2', dates: '2026/12/17 - 2027/01/03', term: 1, unit: 'عطلة الشتاء', percent: 42, evalType: 'عطلة', isHoliday: true },

  { num: 14, dates: '2027/01/03 - 2027/01/07', term: 2, unit: '03: دراسة ظواهر كهربائية (11 سا + 03 أ م)', percent: 46, evalType: 'واجب 3', isHoliday: false },
  { num: 15, dates: '2027/01/10 - 2027/01/14', term: 2, unit: '04: تطور جملة كيميائية نحو حالة التوازن (12 سا + 04 أ م)', percent: 50, evalType: '', isHoliday: false },
  { num: 16, dates: '2027/01/17 - 2027/01/21', term: 2, unit: '04: تطور جملة كيميائية نحو حالة التوازن', percent: 54, evalType: 'فرض 1', isHoliday: false },
  { num: 17, dates: '2027/01/24 - 2027/01/28', term: 2, unit: '04: تطور جملة كيميائية نحو حالة التوازن', percent: 58, evalType: '', isHoliday: false },
  { num: 18, dates: '2027/01/31 - 2027/02/04', term: 2, unit: '04: تطور جملة كيميائية نحو حالة التوازن', percent: 62, evalType: 'واجب 4', isHoliday: false },
  { num: 19, dates: '2027/02/07 - 2027/02/11', term: 2, unit: '05: التحولات النووية (12 سا + 03 أ م)', percent: 66, evalType: '', isHoliday: false },
  { num: 20, dates: '2027/02/14 - 2027/02/18', term: 2, unit: '05: التحولات النووية', percent: 70, evalType: 'فرض 2', isHoliday: false },
  { num: 21, dates: '2027/02/21 - 2027/02/25', term: 2, unit: '05: التحولات النووية', percent: 73, evalType: 'واجب 5', isHoliday: false },
  { num: 22, dates: '2027/02/28 - 2027/03/04', term: 2, unit: '06: مراقبة تطور جملة كيميائية (11 سا + 03 أ م)', percent: 76, evalType: '', isHoliday: false },
  { num: 'ع3', dates: '2027/03/08 - 2027/03/11', term: 2, unit: 'عطلة عيد الفطر المبارك', percent: 76, evalType: 'عطلة', isHoliday: true },
  { num: 24, dates: '2027/03/14 - 2027/03/18', term: 2, unit: 'تقويم تحصيلي (اختبار الفصل الثاني)', percent: 76, evalType: 'اختبار الفصل الثاني', isHoliday: false },
  { num: 25, dates: '2027/03/21 - 2027/03/25', term: 2, unit: 'أسبوع مغلق', percent: 76, evalType: 'أسبوع مغلق', isHoliday: false },
  { num: 'ع4', dates: '2027/03/25 - 2027/04/11', term: 2, unit: 'عطلة الربيع', percent: 76, evalType: 'عطلة', isHoliday: true },

  { num: 26, dates: '2027/04/11 - 2027/04/15', term: 3, unit: '06: مراقبة تطور جملة كيميائية (11 سا + 03 أ م)', percent: 84, evalType: 'واجب 6', isHoliday: false },
  { num: 27, dates: '2027/04/18 - 2027/04/22', term: 3, unit: '06: مراقبة تطور جملة كيميائية', percent: 88, evalType: '', isHoliday: false },
  { num: 28, dates: '2027/04/25 - 2027/04/29', term: 3, unit: '07: التطورات المهتزة (09 سا + 02 أ م)', percent: 92, evalType: 'فرض 1', isHoliday: false },
  { num: 29, dates: '2027/05/02 - 2027/05/06', term: 3, unit: '07: التطورات المهتزة', percent: 96, evalType: '', isHoliday: false },
  { num: 30, dates: '2027/05/09 - 2027/05/13', term: 3, unit: 'تقويم تحصيلي (البكالوريا التجريبي 2027)', percent: 100, evalType: 'بكالوريا تجريبي', isHoliday: false }
];

// أسابيع 2 تر + ر
const WEEKS_2AS_TM_M = [
  { num: 1, dates: '2026/09/21 - 2026/09/24', term: 1, unit: 'الدخول المدرسي للتلاميذ : تقديم البرنامج', percent: 0, evalType: 'تقويم تشخيصي', isHoliday: false },
  { num: 2, dates: '2026/09/27 - 2026/10/01', term: 1, unit: '01: مقاربة كيفية لطاقة جملة وانحفاظها (04 سا + 02 أ م)', percent: 4, evalType: '', isHoliday: false },
  { num: 3, dates: '2026/10/04 - 2026/10/08', term: 1, unit: '01: مقاربة كيفية لطاقة جملة وانحفاظها', percent: 8, evalType: '', isHoliday: false },
  { num: 4, dates: '2026/10/11 - 2026/10/15', term: 1, unit: '02: العمل والطاقة الحركية (حالة حركة انسحابية) (06 سا + 02 أ م)', percent: 12, evalType: 'واجب 1', isHoliday: false },
  { num: 5, dates: '2026/10/18 - 2026/10/22', term: 1, unit: '02: العمل والطاقة الحركية', percent: 16, evalType: '', isHoliday: false },
  { num: 6, dates: '2026/10/25 - 2026/10/28', term: 1, unit: '03: العمل والطاقة الحركية حالة ح دورانية (04 سا + 02 أ م)', percent: 20, evalType: 'فرض 1', isHoliday: false },
  { num: 'ع1', dates: '2025/10/29 - 2025/11/02', term: 1, unit: 'عطلة الخريف', percent: 20, evalType: 'عطلة', isHoliday: true },
  { num: 7, dates: '2026/11/02 - 2026/11/05', term: 1, unit: '03: العمل والطاقة الحركية حالة حركة دورانية (04 سا + 02 أ م)', percent: 23, evalType: 'واجب 2', isHoliday: false },
  { num: 8, dates: '2026/11/08 - 2026/11/12', term: 1, unit: '03: العمل والطاقة الحركية حالة حركة دورانية', percent: 27, evalType: '', isHoliday: false },
  { num: 9, dates: '2026/11/15 - 2026/11/19', term: 1, unit: '04: الطاقات الكامنة (06 سا + 02 أ م)', percent: 31, evalType: 'فرض 2', isHoliday: false },
  { num: 10, dates: '2026/11/22 - 2026/11/26', term: 1, unit: '04: الطاقات الكامنة', percent: 36, evalType: '', isHoliday: false },
  { num: 11, dates: '2026/11/29 - 2026/12/03', term: 1, unit: '05: تعيين كمية المادة عن طريق قياس الناقلية (04 سا + 03 أ م)', percent: 40, evalType: '', isHoliday: false },
  { num: 12, dates: '2026/12/06 - 2026/12/10', term: 1, unit: 'تقويم تحصيلي (اختبار الفصل الأول)', percent: 40, evalType: 'اختبار الفصل الأول', isHoliday: false },
  { num: 13, dates: '2026/12/13 - 2026/12/17', term: 1, unit: 'أسبوع مغلق', percent: 40, evalType: 'أسبوع مغلق', isHoliday: false },
  { num: 'ع2', dates: '2026/12/17 - 2027/01/03', term: 1, unit: 'عطلة الشتاء', percent: 40, evalType: 'عطلة', isHoliday: true },

  { num: 14, dates: '2027/01/03 - 2027/01/07', term: 2, unit: '05: تعيين كمية المادة عن طريق قياس الناقلية (04 سا + 03 أ م)', percent: 44, evalType: '', isHoliday: false },
  { num: 15, dates: '2027/01/10 - 2027/01/14', term: 2, unit: '06: الطاقة الداخلية (06 سا + 02 أ م) + 07: الطاقة والمواطنة (02 سا)', percent: 48, evalType: 'واجب 3', isHoliday: false },
  { num: 16, dates: '2027/01/17 - 2027/01/21', term: 2, unit: '06: الطاقة الداخلية + 07: الطاقة والمواطنة', percent: 52, evalType: '', isHoliday: false },
  { num: 17, dates: '2027/01/24 - 2027/01/28', term: 2, unit: '08: تعيين كمية المادة بواسطة المعايرة (08 سا + 03 أ م)', percent: 57, evalType: 'فرض 1', isHoliday: false },
  { num: 18, dates: '2027/01/31 - 2027/02/04', term: 2, unit: '08: تعيين كمية المادة بواسطة المعايرة', percent: 61, evalType: '', isHoliday: false },
  { num: 19, dates: '2027/02/07 - 2027/02/11', term: 2, unit: '08: تعيين كمية المادة بواسطة المعايرة', percent: 64, evalType: 'واجب 4', isHoliday: false },
  { num: 20, dates: '2027/02/14 - 2027/02/18', term: 2, unit: '09: مفهوم الحقل المغناطيسي (02 سا + 02 أ م)', percent: 68, evalType: 'فرض 2', isHoliday: false },
  { num: 21, dates: '2027/02/21 - 2027/02/25', term: 2, unit: '10: مقاربات الأفعال المتبادلة الكهرومغناطيسية (04 سا + 02 أ م)', percent: 70, evalType: '', isHoliday: false },
  { num: 22, dates: '2027/02/28 - 2027/03/04', term: 2, unit: '11: التحريض الكهرومغناطيسي (02 سا + 02 أ م)', percent: 74, evalType: 'واجب 5', isHoliday: false },
  { num: 'ع3', dates: '2027/03/08 - 2027/03/11', term: 2, unit: 'عطلة عيد الفطر المبارك', percent: 74, evalType: 'عطلة', isHoliday: true },
  { num: 24, dates: '2027/03/14 - 2027/03/18', term: 2, unit: 'تقويم تحصيلي (اختبار الفصل الثاني)', percent: 74, evalType: 'اختبار الفصل الثاني', isHoliday: false },
  { num: 25, dates: '2027/03/21 - 2027/03/25', term: 2, unit: 'أسبوع مغلق', percent: 74, evalType: 'أسبوع مغلق', isHoliday: false },
  { num: 'ع4', dates: '2027/03/25 - 2027/04/11', term: 2, unit: 'عطلة الربيع', percent: 74, evalType: 'عطلة', isHoliday: true },

  { num: 26, dates: '2027/04/11 - 2027/04/15', term: 3, unit: '12: التوترات والتيارات الكهربائية المتناوبة (02 سا + 01 أ م) + 13: كيف نمر من توتر كهربائي متناوب إلى مستمر (02 سا)', percent: 78, evalType: '', isHoliday: false },
  { num: 27, dates: '2027/04/18 - 2027/04/22', term: 3, unit: '14: كيف نميز بين التيار الكهربائي المتناوب والمستمر؟ (01 سا + 01 أ م) + 17: الكهرباء والحياة اليومية (02 سا)', percent: 83, evalType: 'واجب 6', isHoliday: false },
  { num: 28, dates: '2027/04/25 - 2027/04/29', term: 3, unit: '18: مدخل الى الكيمياء العضوية (04 سا + 03 أ م)', percent: 88, evalType: 'فرض 1', isHoliday: false },
  { num: 29, dates: '2027/05/02 - 2027/05/06', term: 3, unit: '18: مدخل الى الكيمياء العضوية', percent: 92, evalType: '', isHoliday: false },
  { num: 30, dates: '2027/05/16 - 2027/05/20', term: 3, unit: 'تقويم تحصيلي (اختبار الفصل الثالث)', percent: 100, evalType: 'اختبار الفصل الثالث', isHoliday: false }
];

export const CURRICULA = {
  // --- السنة الثالثة ثانوي ---
  '3as_se': {
    id: '3as_se',
    level: 'السنة الثالثة',
    stream: '3 علوم تجريبية',
    code: '3 ع ت',
    weeklyHours: '04 سا',
    coeff: '05',
    weeks: [
      { num: 1, dates: '2026/09/21 - 2026/09/24', term: 1, unit: 'الدخول المدرسي للتلاميذ : تقديم البرنامج', percent: 0, evalType: 'تقويم تشخيصي', isHoliday: false },
      { num: 2, dates: '2026/09/27 - 2026/10/01', term: 1, unit: '01: المتابعة الزمنية لتحول كيميائي في وسط مائي (06 سا + 03 أ م)', percent: 4, evalType: '', isHoliday: false },
      { num: 3, dates: '2026/10/04 - 2026/10/08', term: 1, unit: '01: المتابعة الزمنية لتحول كيميائي في وسط مائي', percent: 8, evalType: '', isHoliday: false },
      { num: 4, dates: '2026/10/11 - 2026/10/15', term: 1, unit: '01: المتابعة الزمنية لتحول كيميائي في وسط مائي', percent: 12, evalType: 'واجب 1', isHoliday: false },
      { num: 5, dates: '2026/10/18 - 2026/10/22', term: 1, unit: '02: تطور جملة ميكانيكية (10 سا + 05 أ م)', percent: 16, evalType: '', isHoliday: false },
      { num: 6, dates: '2026/10/25 - 2026/10/28', term: 1, unit: '02: تطور جملة ميكانيكية', percent: 20, evalType: 'فرض 1', isHoliday: false },
      { num: 'ع1', dates: '2025/10/29 - 2025/11/02', term: 1, unit: 'عطلة الخريف', percent: 20, evalType: 'عطلة', isHoliday: true },
      { num: 7, dates: '2026/11/02 - 2026/11/05', term: 1, unit: '02: تطور جملة ميكانيكية (10 سا + 05 أ م)', percent: 24, evalType: 'واجب 2', isHoliday: false },
      { num: 8, dates: '2026/11/08 - 2026/11/12', term: 1, unit: '02: تطور جملة ميكانيكية', percent: 30, evalType: 'فرض 2', isHoliday: false },
      { num: 9, dates: '2026/11/15 - 2026/11/19', term: 1, unit: '02: تطور جملة ميكانيكية', percent: 34, evalType: '', isHoliday: false },
      { num: 10, dates: '2026/11/22 - 2026/11/26', term: 1, unit: '03: دراسة ظواهر كهربائية (08 سا + 03 أ م)', percent: 38, evalType: '', isHoliday: false },
      { num: 11, dates: '2026/11/29 - 2026/12/03', term: 1, unit: '03: دراسة ظواهر كهربائية', percent: 42, evalType: '', isHoliday: false },
      { num: 12, dates: '2026/12/06 - 2026/12/10', term: 1, unit: 'تقويم تحصيلي (اختبار الفصل الأول)', percent: 42, evalType: 'اختبار الفصل الأول', isHoliday: false },
      { num: 13, dates: '2026/12/13 - 2026/12/17', term: 1, unit: 'أسبوع مغلق', percent: 42, evalType: 'أسبوع مغلق', isHoliday: false },
      { num: 'ع2', dates: '2026/12/17 - 2027/01/03', term: 1, unit: 'عطلة الشتاء', percent: 42, evalType: 'عطلة', isHoliday: true },
      
      { num: 14, dates: '2027/01/03 - 2027/01/07', term: 2, unit: '03: دراسة ظواهر كهربائية (08 سا + 03 أ م)', percent: 46, evalType: 'واجب 3', isHoliday: false },
      { num: 15, dates: '2027/01/10 - 2027/01/14', term: 2, unit: '04: تطور جملة كيميائية نحو حالة التوازن (08 سا + 04 أ م)', percent: 50, evalType: '', isHoliday: false },
      { num: 16, dates: '2027/01/17 - 2027/01/21', term: 2, unit: '04: تطور جملة كيميائية نحو حالة التوازن', percent: 54, evalType: 'فرض 1', isHoliday: false },
      { num: 17, dates: '2027/01/24 - 2027/01/28', term: 2, unit: '04: تطور جملة كيميائية نحو حالة التوازن', percent: 58, evalType: '', isHoliday: false },
      { num: 18, dates: '2027/01/31 - 2027/02/04', term: 2, unit: '04: تطور جملة كيميائية نحو حالة التوازن', percent: 62, evalType: 'واجب 4', isHoliday: false },
      { num: 19, dates: '2027/02/07 - 2027/02/11', term: 2, unit: '05: التحولات النووية (06 سا + 04 أ م)', percent: 66, evalType: '', isHoliday: false },
      { num: 20, dates: '2027/02/14 - 2027/02/18', term: 2, unit: '05: التحولات النووية', percent: 70, evalType: 'فرض 2', isHoliday: false },
      { num: 21, dates: '2027/02/21 - 2027/02/25', term: 2, unit: '05: التحولات النووية', percent: 73, evalType: 'واجب 5', isHoliday: false },
      { num: 22, dates: '2027/02/28 - 2027/03/04', term: 2, unit: '06: مراقبة تطور جملة كيميائية (08 سا + 03 أ م)', percent: 77, evalType: '', isHoliday: false },
      { num: 'ع3', dates: '2027/03/08 - 2027/03/11', term: 2, unit: 'عطلة عيد الفطر المبارك', percent: 77, evalType: 'عطلة', isHoliday: true },
      { num: 24, dates: '2027/03/14 - 2027/03/18', term: 2, unit: 'تقويم تحصيلي (اختبار الفصل الثاني)', percent: 77, evalType: 'اختبار الفصل الثاني', isHoliday: false },
      { num: 25, dates: '2027/03/21 - 2027/03/25', term: 2, unit: 'أسبوع مغلق', percent: 77, evalType: 'أسبوع مغلق', isHoliday: false },
      { num: 'ع4', dates: '2027/03/25 - 2027/04/11', term: 2, unit: 'عطلة الربيع', percent: 77, evalType: 'عطلة', isHoliday: true },

      { num: 26, dates: '2027/04/11 - 2027/04/15', term: 3, unit: '06: مراقبة تطور جملة كيميائية (08 سا + 03 أ م)', percent: 84, evalType: 'واجب 6', isHoliday: false },
      { num: 27, dates: '2027/04/18 - 2027/04/22', term: 3, unit: '06: مراقبة تطور جملة كيميائية', percent: 88, evalType: 'فرض 1', isHoliday: false },
      { num: 28, dates: '2027/04/25 - 2027/04/29', term: 3, unit: '07: التطورات المهتزة (06 سا + 02 أ م)', percent: 92, evalType: '', isHoliday: false },
      { num: 29, dates: '2027/05/02 - 2027/05/06', term: 3, unit: '07: التطورات المهتزة', percent: 96, evalType: '', isHoliday: false },
      { num: 30, dates: '2027/05/09 - 2027/05/13', term: 3, unit: 'تقويم تحصيلي (البكالوريا التجريبي 2027)', percent: 100, evalType: 'بكالوريا تجريبي', isHoliday: false }
    ]
  },

  '3as_tm': {
    id: '3as_tm',
    level: 'السنة الثالثة',
    stream: '3 تقني رياضي',
    code: '3 تق ر',
    weeklyHours: '05 سا',
    coeff: '06',
    weeks: WEEKS_3AS_TM_M
  },

  '3as_m': {
    id: '3as_m',
    level: 'السنة الثالثة',
    stream: '3 رياضيات',
    code: '3 ر',
    weeklyHours: '05 سا',
    coeff: '06',
    weeks: WEEKS_3AS_TM_M
  },

  // --- السنة الثانية ثانوي ---
  '2as_se': {
    id: '2as_se',
    level: 'السنة الثانية',
    stream: '2 علوم تجريبية',
    code: '2 ع ت',
    weeklyHours: '04 سا',
    coeff: '05',
    weeks: [
      { num: 1, dates: '2026/09/21 - 2026/09/24', term: 1, unit: 'الدخول المدرسي للتلاميذ : تقديم البرنامج', percent: 0, evalType: 'تقويم تشخيصي', isHoliday: false },
      { num: 2, dates: '2026/09/27 - 2026/10/01', term: 1, unit: '01: مقاربة كيفية لطاقة جملة وانحفاظها (04 سا + 02 أ م)', percent: 4, evalType: '', isHoliday: false },
      { num: 3, dates: '2026/10/04 - 2026/10/08', term: 1, unit: '01: مقاربة كيفية لطاقة جملة وانحفاظها', percent: 8, evalType: '', isHoliday: false },
      { num: 4, dates: '2026/10/11 - 2026/10/15', term: 1, unit: '02: العمل والطاقة الحركية (حالة حركة انسحابية) (06 سا + 02 أ م)', percent: 12, evalType: 'واجب 1', isHoliday: false },
      { num: 5, dates: '2026/10/18 - 2026/10/22', term: 1, unit: '02: العمل والطاقة الحركية', percent: 16, evalType: '', isHoliday: false },
      { num: 6, dates: '2026/10/25 - 2026/10/28', term: 1, unit: '03: الطاقات الكامنة (04 سا + 02 أ م)', percent: 20, evalType: 'فرض 1', isHoliday: false },
      { num: 'ع1', dates: '2025/10/29 - 2025/11/02', term: 1, unit: 'عطلة الخريف', percent: 20, evalType: 'عطلة', isHoliday: true },
      { num: 7, dates: '2026/11/02 - 2026/11/05', term: 1, unit: '03: الطاقات الكامنة (04 سا + 02 أ م)', percent: 22, evalType: 'واجب 2', isHoliday: false },
      { num: 8, dates: '2026/11/08 - 2026/11/12', term: 1, unit: '04: تعيين كمية المادة عن طريق قياس الناقلية (04 سا + 03 أ م)', percent: 25, evalType: '', isHoliday: false },
      { num: 9, dates: '2026/11/15 - 2026/11/19', term: 1, unit: '04: تعيين كمية المادة عن طريق قياس الناقلية', percent: 30, evalType: 'فرض 2', isHoliday: false },
      { num: 10, dates: '2026/11/22 - 2026/11/26', term: 1, unit: '04: تعيين كمية المادة عن طريق قياس الناقلية', percent: 34, evalType: '', isHoliday: false },
      { num: 11, dates: '2026/11/29 - 2026/12/03', term: 1, unit: '05: الطاقة الداخلية (06 سا + 02 أ م)', percent: 38, evalType: '', isHoliday: false },
      { num: 12, dates: '2026/12/06 - 2026/12/10', term: 1, unit: 'تقويم تحصيلي (اختبار الفصل الأول)', percent: 38, evalType: 'اختبار الفصل الأول', isHoliday: false },
      { num: 13, dates: '2026/12/13 - 2026/12/17', term: 1, unit: 'أسبوع مغلق', percent: 38, evalType: 'أسبوع مغلق', isHoliday: false },
      { num: 'ع2', dates: '2026/12/17 - 2027/01/03', term: 1, unit: 'عطلة الشتاء', percent: 38, evalType: 'عطلة', isHoliday: true },

      { num: 14, dates: '2027/01/03 - 2027/01/07', term: 2, unit: '05: الطاقة الداخلية (06 سا + 02 أ م)', percent: 42, evalType: '', isHoliday: false },
      { num: 15, dates: '2027/01/10 - 2027/01/14', term: 2, unit: '05: الطاقة الداخلية + 06: الطاقة والمواطنة (04 سا)', percent: 46, evalType: 'واجب 3', isHoliday: false },
      { num: 16, dates: '2027/01/17 - 2027/01/21', term: 2, unit: '07: تعيين كمية المادة بواسطة المعايرة (08 سا + 03 أ م)', percent: 50, evalType: '', isHoliday: false },
      { num: 17, dates: '2027/01/24 - 2027/01/28', term: 2, unit: '07: تعيين كمية المادة بواسطة المعايرة', percent: 54, evalType: 'فرض 1', isHoliday: false },
      { num: 18, dates: '2027/01/31 - 2027/02/04', term: 2, unit: '07: تعيين كمية المادة بواسطة المعايرة', percent: 58, evalType: '', isHoliday: false },
      { num: 19, dates: '2027/02/07 - 2027/02/11', term: 2, unit: '08: مفهوم الحقل المغناطيسي (02 سا + 02 أ م)', percent: 62, evalType: 'واجب 4', isHoliday: false },
      { num: 20, dates: '2027/02/14 - 2027/02/18', term: 2, unit: '08: مفهوم الحقل المغناطيسي', percent: 66, evalType: 'فرض 2', isHoliday: false },
      { num: 21, dates: '2027/02/21 - 2027/02/25', term: 2, unit: '09: مقاربات الأفعال المتبادلة الكهرومغناطيسية (04 سا + 02 أ م)', percent: 70, evalType: '', isHoliday: false },
      { num: 22, dates: '2027/02/28 - 2027/03/04', term: 2, unit: '09: مقاربات الأفعال المتبادلة الكهرومغناطيسية', percent: 74, evalType: 'واجب 5', isHoliday: false },
      { num: 'ع3', dates: '2027/03/08 - 2027/03/11', term: 2, unit: 'عطلة عيد الفطر المبارك', percent: 74, evalType: 'عطلة', isHoliday: true },
      { num: 24, dates: '2027/03/14 - 2027/03/18', term: 2, unit: 'تقويم تحصيلي (اختبار الفصل الثاني)', percent: 74, evalType: 'اختبار الفصل الثاني', isHoliday: false },
      { num: 25, dates: '2027/03/21 - 2027/03/25', term: 2, unit: 'أسبوع مغلق', percent: 74, evalType: 'أسبوع مغلق', isHoliday: false },
      { num: 'ع4', dates: '2027/03/25 - 2027/04/11', term: 2, unit: 'عطلة الربيع', percent: 74, evalType: 'عطلة', isHoliday: true },

      { num: 26, dates: '2027/04/11 - 2027/04/15', term: 3, unit: '10: الكهرباء والحياة اليومية (02 سا) + 11: مدخل الى الكيمياء العضوية (04 سا + 03 أ م)', percent: 78, evalType: '', isHoliday: false },
      { num: 27, dates: '2027/04/18 - 2027/04/22', term: 3, unit: '11: مدخل الى الكيمياء العضوية', percent: 83, evalType: 'واجب 6', isHoliday: false },
      { num: 28, dates: '2027/04/25 - 2027/04/29', term: 3, unit: '11: مدخل الى الكيمياء العضوية', percent: 88, evalType: 'فرض 1', isHoliday: false },
      { num: 29, dates: '2027/05/02 - 2027/05/06', term: 3, unit: '12: العدسات عناصر لعدة أجهزة بصرية (02 سا + 01 أ م)', percent: 92, evalType: '', isHoliday: false },
      { num: 30, dates: '2027/05/16 - 2027/05/20', term: 3, unit: 'تقويم تحصيلي (اختبار الفصل الثالث)', percent: 100, evalType: 'اختبار الفصل الثالث', isHoliday: false }
    ]
  },

  '2as_tm': {
    id: '2as_tm',
    level: 'السنة الثانية',
    stream: '2 تقني رياضي',
    code: '2 تق ر',
    weeklyHours: '05 سا',
    coeff: '05',
    weeks: WEEKS_2AS_TM_M
  },

  '2as_m': {
    id: '2as_m',
    level: 'السنة الثانية',
    stream: '2 رياضيات',
    code: '2 ر',
    weeklyHours: '05 سا',
    coeff: '06',
    weeks: WEEKS_2AS_TM_M
  },

  '2as_lph': {
    id: '2as_lph',
    level: 'السنة الثانية',
    stream: '2 آداب وفلسفة',
    code: '2 آداب',
    weeklyHours: '02 سا',
    coeff: '02',
    weeks: [
      { num: 1, dates: '2026/09/21 - 2026/09/24', term: 1, unit: 'الدخول المدرسي للتلاميذ : تقديم البرنامج', percent: 0, evalType: '', isHoliday: false },
      { num: 2, dates: '2026/09/27 - 2026/10/01', term: 1, unit: '01: الكيمياء و تحولات المادة (08 ساعة)', percent: 4, evalType: '', isHoliday: false },
      { num: 3, dates: '2026/10/04 - 2026/10/08', term: 1, unit: '01: الكيمياء و تحولات المادة', percent: 8, evalType: '', isHoliday: false },
      { num: 4, dates: '2026/10/11 - 2026/10/15', term: 1, unit: '01: الكيمياء و تحولات المادة', percent: 12, evalType: '', isHoliday: false },
      { num: 5, dates: '2026/10/18 - 2026/10/22', term: 1, unit: '01: الكيمياء و تحولات المادة', percent: 16, evalType: '', isHoliday: false },
      { num: 6, dates: '2026/10/25 - 2026/10/28', term: 1, unit: '02: الكيمياء في الحياة اليومية (10 ساعة)', percent: 20, evalType: 'واجب 1', isHoliday: false },
      { num: 'ع1', dates: '2025/10/29 - 2025/11/02', term: 1, unit: 'عطلة الخريف', percent: 20, evalType: 'عطلة', isHoliday: true },
      { num: 7, dates: '2026/11/02 - 2026/11/05', term: 1, unit: '02: الكيمياء في الحياة اليومية (10 ساعة)', percent: 25, evalType: '', isHoliday: false },
      { num: 8, dates: '2026/11/08 - 2026/11/12', term: 1, unit: '02: الكيمياء في الحياة اليومية', percent: 30, evalType: 'فرض 1', isHoliday: false },
      { num: 9, dates: '2026/11/15 - 2026/11/19', term: 1, unit: '02: الكيمياء في الحياة اليومية', percent: 34, evalType: '', isHoliday: false },
      { num: 10, dates: '2026/11/22 - 2026/11/26', term: 1, unit: '02: الكيمياء في الحياة اليومية', percent: 34, evalType: '', isHoliday: false },
      { num: 11, dates: '2026/11/29 - 2026/12/03', term: 1, unit: '01: الضوء للرؤية (10 ساعة)', percent: 38, evalType: '', isHoliday: false },
      { num: 12, dates: '2026/12/06 - 2026/12/10', term: 1, unit: 'تقويم تحصيلي (اختبار الفصل الأول)', percent: 38, evalType: 'اختبار الفصل الأول', isHoliday: false },
      { num: 13, dates: '2026/12/13 - 2026/12/17', term: 1, unit: 'أسبوع مغلق', percent: 38, evalType: 'أسبوع مغلق', isHoliday: false },
      { num: 'ع2', dates: '2026/12/17 - 2027/01/03', term: 1, unit: 'عطلة الشتاء', percent: 38, evalType: 'عطلة', isHoliday: true },

      { num: 14, dates: '2027/01/03 - 2027/01/07', term: 2, unit: '01: الضوء للرؤية (10 ساعة)', percent: 46, evalType: '', isHoliday: false },
      { num: 15, dates: '2027/01/10 - 2027/01/14', term: 2, unit: '01: الضوء للرؤية', percent: 50, evalType: '', isHoliday: false },
      { num: 16, dates: '2027/01/17 - 2027/01/21', term: 2, unit: '01: الضوء للرؤية', percent: 54, evalType: 'واجب 2', isHoliday: false },
      { num: 17, dates: '2027/01/24 - 2027/01/28', term: 2, unit: '01: الضوء للرؤية', percent: 58, evalType: '', isHoliday: false },
      { num: 18, dates: '2027/01/31 - 2027/02/04', term: 2, unit: '02: الصوت (08 ساعة)', percent: 62, evalType: '', isHoliday: false },
      { num: 19, dates: '2027/02/07 - 2027/02/11', term: 2, unit: '02: الصوت', percent: 66, evalType: '', isHoliday: false },
      { num: 20, dates: '2027/02/14 - 2027/02/18', term: 2, unit: '02: الصوت', percent: 70, evalType: 'فرض 1', isHoliday: false },
      { num: 21, dates: '2027/02/21 - 2027/02/25', term: 2, unit: '01: الطاقة في الحياة اليومية (06 ساعة)', percent: 75, evalType: '', isHoliday: false },
      { num: 22, dates: '2027/02/28 - 2027/03/04', term: 2, unit: '01: الطاقة في الحياة اليومية', percent: 79, evalType: '', isHoliday: false },
      { num: 'ع3', dates: '2027/03/08 - 2027/03/11', term: 2, unit: 'عطلة عيد الفطر المبارك', percent: 79, evalType: 'عطلة', isHoliday: true },
      { num: 24, dates: '2027/03/14 - 2027/03/18', term: 2, unit: 'تقويم تحصيلي (اختبار الفصل الثاني)', percent: 79, evalType: 'اختبار الفصل الثاني', isHoliday: false },
      { num: 25, dates: '2027/03/21 - 2027/03/25', term: 2, unit: 'أسبوع مغلق', percent: 79, evalType: 'أسبوع مغلق', isHoliday: false },
      { num: 'ع4', dates: '2027/03/25 - 2027/04/11', term: 2, unit: 'عطلة الربيع', percent: 79, evalType: 'عطلة', isHoliday: true },

      { num: 26, dates: '2027/04/11 - 2027/04/15', term: 3, unit: '01: الطاقة في الحياة اليومية (06 ساعة)', percent: 83, evalType: '', isHoliday: false },
      { num: 27, dates: '2027/04/18 - 2027/04/22', term: 3, unit: '02: كيف نضمن حاجاتنا للطاقة ؟ (06 ساعة)', percent: 88, evalType: 'واجب 3', isHoliday: false },
      { num: 28, dates: '2027/04/25 - 2027/04/29', term: 3, unit: '02: كيف نضمن حاجاتنا للطاقة ؟', percent: 94, evalType: 'فرض 1', isHoliday: false },
      { num: 29, dates: '2027/05/02 - 2027/05/06', term: 3, unit: '03: كيف يتم نقل الطاقة من مكان الى آخر؟ (06 ساعة)', percent: 100, evalType: '', isHoliday: false },
      { num: 30, dates: '2027/05/16 - 2027/05/20', term: 3, unit: 'تقويم تحصيلي (اختبار الفصل الثالث)', percent: 100, evalType: 'اختبار الفصل الثالث', isHoliday: false }
    ]
  },

  // --- السنة الأولى ثانوي ---
  '1as_tc_st': {
    id: '1as_tc_st',
    level: 'السنة الأولى',
    stream: '1 ج م ع تك (جذع مشترك علوم)',
    code: '1 ج م ع ت',
    weeklyHours: '04 سا',
    coeff: '04',
    weeks: [
      { num: 1, dates: '2026/09/21 - 2026/09/24', term: 1, unit: 'الدخول المدرسي للتلاميذ : تقديم البرنامج', percent: 0, evalType: 'تقويم تشخيصي', isHoliday: false },
      { num: 2, dates: '2026/09/27 - 2026/10/01', term: 1, unit: '01: بنية وهندسة أفراد بعض الأنواع الكيميائية (10 سا + 05 أ م)', percent: 4, evalType: '', isHoliday: false },
      { num: 3, dates: '2026/10/04 - 2026/10/08', term: 1, unit: '01: بنية وهندسة أفراد بعض الأنواع الكيميائية', percent: 8, evalType: '', isHoliday: false },
      { num: 4, dates: '2026/10/11 - 2026/10/15', term: 1, unit: '01: بنية وهندسة أفراد بعض الأنواع الكيميائية', percent: 12, evalType: 'واجب 1', isHoliday: false },
      { num: 5, dates: '2026/10/18 - 2026/10/22', term: 1, unit: '01: بنية وهندسة أفراد بعض الأنواع الكيميائية', percent: 16, evalType: '', isHoliday: false },
      { num: 6, dates: '2026/10/25 - 2026/10/28', term: 1, unit: '01: بنية وهندسة أفراد بعض الأنواع الكيميائية', percent: 20, evalType: 'فرض 1', isHoliday: false },
      { num: 'ع1', dates: '2025/10/29 - 2025/11/02', term: 1, unit: 'عطلة الخريف', percent: 20, evalType: 'عطلة', isHoliday: true },
      { num: 7, dates: '2026/11/02 - 2026/11/05', term: 1, unit: '02: القوة والحركات المستقيمة (06 سا + 02 أ م)', percent: 25, evalType: '', isHoliday: false },
      { num: 8, dates: '2026/11/08 - 2026/11/12', term: 1, unit: '02: القوة والحركات المستقيمة', percent: 28, evalType: 'واجب 2', isHoliday: false },
      { num: 9, dates: '2026/11/15 - 2026/11/19', term: 1, unit: '02: القوة والحركات المستقيمة', percent: 30, evalType: 'فرض 2', isHoliday: false },
      { num: 10, dates: '2026/11/22 - 2026/11/26', term: 1, unit: '03: القوة والحركات المنحنية (06 سا + 03 أ م)', percent: 34, evalType: '', isHoliday: false },
      { num: 11, dates: '2026/11/29 - 2026/12/03', term: 1, unit: '03: القوة والحركات المنحنية', percent: 38, evalType: '', isHoliday: false },
      { num: 12, dates: '2026/12/06 - 2026/12/10', term: 1, unit: 'تقويم تحصيلي (اختبار الفصل الأول)', percent: 38, evalType: 'اختبار الفصل الأول', isHoliday: false },
      { num: 13, dates: '2026/12/13 - 2026/12/17', term: 1, unit: 'أسبوع مغلق', percent: 38, evalType: 'أسبوع مغلق', isHoliday: false },
      { num: 'ع2', dates: '2026/12/17 - 2027/01/03', term: 1, unit: 'عطلة الشتاء', percent: 38, evalType: 'عطلة', isHoliday: true },

      { num: 14, dates: '2027/01/03 - 2027/01/07', term: 2, unit: '04: الحركة والقوة والمرجع (02 سا + 01 أ م) + 05: دفع وكبح متحرك (04 سا + 02 أ م)', percent: 46, evalType: '', isHoliday: false },
      { num: 15, dates: '2027/01/10 - 2027/01/14', term: 2, unit: '05: دفع وكبح متحرك', percent: 50, evalType: 'واجب 3', isHoliday: false },
      { num: 16, dates: '2027/01/17 - 2027/01/21', term: 2, unit: '05: دفع وكبح متحرك', percent: 54, evalType: '', isHoliday: false },
      { num: 17, dates: '2027/01/24 - 2027/01/28', term: 2, unit: '06: من المجهري إلى العياني (09 سا + 04 أ م)', percent: 58, evalType: 'فرض 1', isHoliday: false },
      { num: 18, dates: '2027/01/31 - 2027/02/04', term: 2, unit: '06: من المجهري إلى العياني', percent: 62, evalType: '', isHoliday: false },
      { num: 19, dates: '2027/02/07 - 2027/02/11', term: 2, unit: '06: من المجهري إلى العياني', percent: 66, evalType: 'واجب 4', isHoliday: false },
      { num: 20, dates: '2027/02/14 - 2027/02/18', term: 2, unit: '06: من المجهري إلى العياني', percent: 70, evalType: 'فرض 2', isHoliday: false },
      { num: 21, dates: '2027/02/21 - 2027/02/25', term: 2, unit: '07: التماسك في المادة وفي الفضاء (04 سا + 02 أ م)', percent: 74, evalType: '', isHoliday: false },
      { num: 22, dates: '2027/02/28 - 2027/03/04', term: 2, unit: '07: التماسك في المادة وفي الفضاء', percent: 78, evalType: 'واجب 5', isHoliday: false },
      { num: 'ع3', dates: '2027/03/08 - 2027/03/11', term: 2, unit: 'عطلة عيد الفطر المبارك', percent: 78, evalType: 'عطلة', isHoliday: true },
      { num: 24, dates: '2027/03/14 - 2027/03/18', term: 2, unit: 'تقويم تحصيلي (اختبار الفصل الثاني)', percent: 78, evalType: 'اختبار الفصل الثاني', isHoliday: false },
      { num: 25, dates: '2027/03/21 - 2027/03/25', term: 2, unit: 'أسبوع مغلق', percent: 78, evalType: 'أسبوع مغلق', isHoliday: false },
      { num: 'ع4', dates: '2027/03/25 - 2027/04/11', term: 2, unit: 'عطلة الربيع', percent: 78, evalType: 'عطلة', isHoliday: true },

      { num: 26, dates: '2027/04/11 - 2027/04/15', term: 3, unit: '08: انكسار الضوء (03 سا + 01 أ م)', percent: 82, evalType: '', isHoliday: false },
      { num: 27, dates: '2027/04/18 - 2027/04/22', term: 3, unit: '09: الضوء الأبيض والضوء وحيد اللون (03 سا + 01 أ م)', percent: 87, evalType: 'واجب 6', isHoliday: false },
      { num: 28, dates: '2027/04/25 - 2027/04/29', term: 3, unit: '10: المقاربة الكمية لتحول كيميائي (07 سا + 03 أ م)', percent: 90, evalType: 'فرض 1', isHoliday: false },
      { num: 29, dates: '2027/05/02 - 2027/05/06', term: 3, unit: '10: المقاربة الكمية لتحول كيميائي', percent: 96, evalType: '', isHoliday: false },
      { num: 30, dates: '2027/05/16 - 2027/05/20', term: 3, unit: 'تقويم تحصيلي (اختبار الفصل الثالث)', percent: 100, evalType: 'اختبار الفصل الثالث', isHoliday: false }
    ]
  },

  '1as_tc_l': {
    id: '1as_tc_l',
    level: 'السنة الأولى',
    stream: '1 ج م آداب (جذع مشترك آداب)',
    code: '1 ج م آداب',
    weeklyHours: '02 سا',
    coeff: '02',
    weeks: [
      { num: 1, dates: '2026/09/21 - 2026/09/24', term: 1, unit: 'الدخول المدرسي للتلاميذ : تقديم البرنامج', percent: 0, evalType: '', isHoliday: false },
      { num: 2, dates: '2026/09/27 - 2026/10/01', term: 1, unit: '01: الماء في الطبيعة (13 ساعة)', percent: 4, evalType: '', isHoliday: false },
      { num: 3, dates: '2026/10/04 - 2026/10/08', term: 1, unit: '01: الماء في الطبيعة', percent: 8, evalType: '', isHoliday: false },
      { num: 4, dates: '2026/10/11 - 2026/10/15', term: 1, unit: '01: الماء في الطبيعة', percent: 12, evalType: '', isHoliday: false },
      { num: 5, dates: '2026/10/18 - 2026/10/22', term: 1, unit: '01: الماء في الطبيعة', percent: 16, evalType: '', isHoliday: false },
      { num: 6, dates: '2026/10/25 - 2026/10/28', term: 1, unit: '01: الماء في الطبيعة', percent: 20, evalType: 'واجب 1', isHoliday: false },
      { num: 'ع1', dates: '2025/10/29 - 2025/11/02', term: 1, unit: 'عطلة الخريف', percent: 20, evalType: 'عطلة', isHoliday: true },
      { num: 7, dates: '2026/11/02 - 2026/11/05', term: 1, unit: '01: الماء في الطبيعة (13 سا)', percent: 22, evalType: '', isHoliday: false },
      { num: 8, dates: '2026/11/08 - 2026/11/12', term: 1, unit: '01: الماء في الطبيعة', percent: 25, evalType: '', isHoliday: false },
      { num: 9, dates: '2026/11/15 - 2026/11/19', term: 1, unit: '02: الهواء من حولنا (09 سا)', percent: 30, evalType: 'فرض 1', isHoliday: false },
      { num: 10, dates: '2026/11/22 - 2026/11/26', term: 1, unit: '02: الهواء من حولنا', percent: 34, evalType: '', isHoliday: false },
      { num: 11, dates: '2026/11/29 - 2026/12/03', term: 1, unit: '02: الهواء من حولنا', percent: 38, evalType: '', isHoliday: false },
      { num: 12, dates: '2026/12/06 - 2026/12/10', term: 1, unit: 'تقويم تحصيلي (اختبار الفصل الأول)', percent: 38, evalType: 'اختبار الفصل الأول', isHoliday: false },
      { num: 13, dates: '2026/12/13 - 2026/12/17', term: 1, unit: 'أسبوع مغلق', percent: 38, evalType: 'أسبوع مغلق', isHoliday: false },
      { num: 'ع2', dates: '2026/12/17 - 2027/01/03', term: 1, unit: 'عطلة الشتاء', percent: 38, evalType: 'عطلة', isHoliday: true },

      { num: 14, dates: '2027/01/03 - 2027/01/07', term: 2, unit: '02: الهواء من حولنا (09 سا)', percent: 44, evalType: '', isHoliday: false },
      { num: 15, dates: '2027/01/10 - 2027/01/14', term: 2, unit: '01: الضوء للرؤية (05 سا)', percent: 48, evalType: '', isHoliday: false },
      { num: 16, dates: '2027/01/17 - 2027/01/21', term: 2, unit: '01: الضوء للرؤية', percent: 53, evalType: 'واجب 2', isHoliday: false },
      { num: 17, dates: '2027/01/24 - 2027/01/28', term: 2, unit: '01: الضوء للرؤية', percent: 58, evalType: '', isHoliday: false },
      { num: 18, dates: '2027/01/31 - 2027/02/04', term: 2, unit: '02: الضوء للاتصال (05 سا)', percent: 62, evalType: '', isHoliday: false },
      { num: 19, dates: '2027/02/07 - 2027/02/11', term: 2, unit: '02: الضوء للاتصال', percent: 66, evalType: '', isHoliday: false },
      { num: 20, dates: '2027/02/14 - 2027/02/18', term: 2, unit: '03: الضوء وأبعاد الكون (05 سا)', percent: 70, evalType: 'فرض 2', isHoliday: false },
      { num: 21, dates: '2027/02/21 - 2027/02/25', term: 2, unit: '03: الضوء وأبعاد الكون', percent: 74, evalType: '', isHoliday: false },
      { num: 22, dates: '2027/02/28 - 2027/03/04', term: 2, unit: '01: ما هي الطاقة ؟ (07 سا)', percent: 79, evalType: '', isHoliday: false },
      { num: 'ع3', dates: '2027/03/08 - 2027/03/11', term: 2, unit: 'عطلة عيد الفطر المبارك', percent: 79, evalType: 'عطلة', isHoliday: true },
      { num: 24, dates: '2027/03/14 - 2027/03/18', term: 2, unit: 'تقويم تحصيلي (اختبار الفصل الثاني)', percent: 79, evalType: 'اختبار الفصل الثاني', isHoliday: false },
      { num: 25, dates: '2027/03/21 - 2027/03/25', term: 2, unit: 'أسبوع مغلق', percent: 79, evalType: 'أسبوع مغلق', isHoliday: false },
      { num: 'ع4', dates: '2027/03/25 - 2027/04/11', term: 2, unit: 'عطلة الربيع', percent: 79, evalType: 'عطلة', isHoliday: true },

      { num: 26, dates: '2027/04/11 - 2027/04/15', term: 3, unit: '01: ما هي الطاقة ؟ (07 سا)', percent: 84, evalType: 'واجب 3', isHoliday: false },
      { num: 27, dates: '2027/04/18 - 2027/04/22', term: 3, unit: '01: ما هي الطاقة ؟', percent: 90, evalType: '', isHoliday: false },
      { num: 28, dates: '2027/04/25 - 2027/04/29', term: 3, unit: '02: السلاسل الطاقوية (09 سا)', percent: 96, evalType: 'فرض 3', isHoliday: false },
      { num: 29, dates: '2027/05/02 - 2027/05/06', term: 3, unit: '02: السلاسل الطاقوية', percent: 100, evalType: '', isHoliday: false },
      { num: 30, dates: '2027/05/16 - 2027/05/20', term: 3, unit: 'تقويم تحصيلي (اختبار الفصل الثالث)', percent: 100, evalType: 'اختبار الفصل الثالث', isHoliday: false }
    ]
  }
};

// Aliases for backward compatibility with existing data
CURRICULA['3as_tm_m'] = CURRICULA['3as_tm'];
CURRICULA['2as_tm_m'] = CURRICULA['2as_tm'];

export const STREAMS_LIST = [
  CURRICULA['3as_se'],
  CURRICULA['3as_tm'],
  CURRICULA['3as_m'],
  CURRICULA['2as_se'],
  CURRICULA['2as_tm'],
  CURRICULA['2as_m'],
  CURRICULA['2as_lph'],
  CURRICULA['1as_tc_st'],
  CURRICULA['1as_tc_l']
];

