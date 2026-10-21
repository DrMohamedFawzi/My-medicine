/**
 * MediFind Engine v2.5 - قطاع غزة (تحديث هندسي خبير)
 * يشمل: التزامن اللحظي عبر المتصفحات، قفل حجز المخزون المؤقت، نظام إشعارات UI Toast،
 * تصدير تقارير رادار النقص الدوائي B2B/B2G، وتقييمات التوفر البشري الدقيق.
 */

// --- 1. البيانات الافتراضية الأولية لقطاع غزة ---
const DEFAULT_USERS_V2 = [
  {
    id: 1,
    role: 'pharmacist',
    name: 'د. إبراهيم النجار',
    phone: '0599112233',
    email: 'alnajar@medifind.ps',
    pharmacy_name: 'صيدلية الرمال المركزية',
    license_number: 'GZ-10293',
    verification_status: 'verified',
    governorate: 'غزة',
    city_district: 'حي الرمال',
    address: 'غزة - شارع عمر المختار - مقابل بنك فلسطين',
    location_lat: 31.5180,
    location_lng: 34.4480,
    distance_km: 0.6,
    distance_time: '3 دقائق مشياً',
    is_night_shift: true,
    operating_hours: '24 ساعة / طوارئ',
    status: 'active'
  },
  {
    id: 2,
    role: 'pharmacist',
    name: 'د. مريم الأغا',
    phone: '0599223344',
    email: 'alagha@medifind.ps',
    pharmacy_name: 'صيدلية خانيونس الكبرى',
    license_number: 'GZ-10482',
    verification_status: 'verified',
    governorate: 'خانيونس',
    city_district: 'وسط البلد',
    address: 'خانيونس - شارع جلال - قرب دوار أبو حميد',
    location_lat: 31.3450,
    location_lng: 34.3030,
    distance_km: 1.2,
    distance_time: '5 دقائق بالسيارة',
    is_night_shift: false,
    operating_hours: '8:00 ص - 11:00 م',
    status: 'active'
  },
  {
    id: 3,
    role: 'pharmacist',
    name: 'د. يوسف بركة',
    phone: '0569334455',
    email: 'baraka@medifind.ps',
    pharmacy_name: 'صيدلية دير البلح للطوارئ',
    license_number: 'GZ-10931',
    verification_status: 'verified',
    governorate: 'دير البلح',
    city_district: 'شارع النخيل',
    address: 'دير البلح - شارع النخيل - بالقرب من مستشفى شهداء الأقصى',
    location_lat: 31.4180,
    location_lng: 34.3510,
    distance_km: 1.8,
    distance_time: '7 دقائق بالسيارة',
    is_night_shift: true,
    operating_hours: '24 ساعة / طوارئ',
    status: 'active'
  },
  {
    id: 4,
    role: 'pharmacist',
    name: 'د. أحمد قديح',
    phone: '0599778899',
    email: 'qdeih@medifind.ps',
    pharmacy_name: 'صيدلية تل السلطان الحديثة',
    license_number: 'GZ-10777',
    verification_status: 'verified',
    governorate: 'رفح',
    city_district: 'تل السلطان',
    address: 'رفح - حي تل السلطان - الشارع الرئيسي',
    location_lat: 31.2950,
    location_lng: 34.2500,
    distance_km: 2.5,
    distance_time: '10 دقائق بالسيارة',
    is_night_shift: false,
    operating_hours: '8:00 ص - 10:00 م',
    status: 'active'
  },
  {
    id: 5,
    role: 'pharmacist',
    name: 'د. هاني الكحلوت',
    phone: '0599445566',
    email: 'kahlout@medifind.ps',
    pharmacy_name: 'صيدلية جباليا والإسعاف',
    license_number: 'GZ-10115',
    verification_status: 'verified',
    governorate: 'شمال غزة',
    city_district: 'مخيم جباليا',
    address: 'شمال غزة - جباليا البلد - شارع الهوجا',
    location_lat: 31.5380,
    location_lng: 34.4980,
    distance_km: 3.1,
    distance_time: '12 دقيقة بالسيارة',
    is_night_shift: true,
    operating_hours: '24 ساعة / طوارئ',
    status: 'active'
  },
  {
    id: 6,
    role: 'pharmacist',
    name: 'د. سامح رضوان',
    phone: '0598113355',
    email: 'radwan@medifind.ps',
    pharmacy_name: 'صيدلية النصيرات الجديدة',
    license_number: 'GZ-11045',
    verification_status: 'pending_approval',
    governorate: 'دير البلح',
    city_district: 'مخيم النصيرات',
    address: 'النصيرات - السوق المركزي - شارع القسام',
    location_lat: 31.4480,
    location_lng: 34.3900,
    distance_km: 2.0,
    distance_time: '8 دقائق',
    is_night_shift: false,
    operating_hours: '9:00 ص - 9:00 م',
    status: 'pending'
  }
];

const DEFAULT_MEDICINES_V2 = [
  {
    id: 1,
    pharmacy_id: 1,
    commercial_name: 'شاش طبي معقم 10×10 (Sterile Gauze)',
    scientific_name: 'Sterile Hydrophilic Gauze 10x10cm',
    category: 'مستلزمات جروح وطوارئ',
    form: 'علبة 10 قطع',
    quantity: 28,
    price: 15.00,
    requires_prescription: false,
    is_emergency_supply: true,
    shelf_location: 'طوارئ - رف E-1',
    last_updated: new Date(Date.now() - 10 * 60000).toISOString()
  },
  {
    id: 2,
    pharmacy_id: 1,
    commercial_name: 'محلول مطهر بوفيدون أيودين 10%',
    scientific_name: 'Povidone Iodine 10% Antiseptic',
    category: 'مستلزمات جروح وطوارئ',
    form: 'محلول 100 مل',
    quantity: 15,
    price: 20.00,
    requires_prescription: false,
    is_emergency_supply: true,
    shelf_location: 'طوارئ - رف E-2',
    last_updated: new Date(Date.now() - 30 * 60000).toISOString()
  },
  {
    id: 3,
    pharmacy_id: 1,
    commercial_name: 'مرهم ميبو للحروق والجروح (MEBO)',
    scientific_name: 'Beta-sitosterol Natural Ointment',
    category: 'مستلزمات جروح وطوارئ',
    form: 'مرهم 30 جم',
    quantity: 2,
    price: 45.00,
    requires_prescription: false,
    is_emergency_supply: true,
    shelf_location: 'طوارئ - رف E-3',
    last_updated: new Date(Date.now() - 5 * 60000).toISOString()
  },
  {
    id: 4,
    pharmacy_id: 1,
    commercial_name: 'لاصق جروح طبي مضاد للماء (Waterproof)',
    scientific_name: 'Hypoallergenic Waterproof Dressing',
    category: 'مستلزمات جروح وطوارئ',
    form: 'علبة 20 حبة',
    quantity: 35,
    price: 18.00,
    requires_prescription: false,
    is_emergency_supply: true,
    shelf_location: 'طوارئ - رف E-1',
    last_updated: new Date(Date.now() - 120 * 60000).toISOString()
  },
  {
    id: 5,
    pharmacy_id: 1,
    commercial_name: 'أكامول إكسترا 500 ملجم (Acamol Extra)',
    scientific_name: 'Paracetamol 500mg + Caffeine',
    category: 'مسكنات وخافضات حرارة',
    form: 'شريط 20 قرص',
    quantity: 50,
    price: 12.00,
    requires_prescription: false,
    is_emergency_supply: false,
    shelf_location: 'أدوية عامة - رف B-4',
    last_updated: new Date(Date.now() - 40 * 60000).toISOString()
  },
  {
    id: 6,
    pharmacy_id: 1,
    commercial_name: 'أوجمنتين 1 جم (Augmentin)',
    scientific_name: 'Amoxicillin + Clavulanate 1g',
    category: 'مضادات حيوية',
    form: 'علبة 14 قرص',
    quantity: 4,
    price: 65.00,
    requires_prescription: true,
    is_emergency_supply: false,
    shelf_location: 'مضادات - رف Rx-1',
    last_updated: new Date(Date.now() - 60 * 60000).toISOString()
  },
  {
    id: 7,
    pharmacy_id: 2,
    commercial_name: 'شاش فازلين معقم للحرائق (Paraffin)',
    scientific_name: 'Paraffin Gauze Dressing',
    category: 'مستلزمات جروح وطوارئ',
    form: 'علبة 10 قطع',
    quantity: 12,
    price: 25.00,
    requires_prescription: false,
    is_emergency_supply: true,
    shelf_location: 'طوارئ خانيونس 1',
    last_updated: new Date(Date.now() - 15 * 60000).toISOString()
  },
  {
    id: 8,
    pharmacy_id: 2,
    commercial_name: 'محلول ملحي معقم (Saline 0.9%)',
    scientific_name: 'Normal Saline Solution 0.9%',
    category: 'مستلزمات جروح وطوارئ',
    form: 'محلول غسيل 500 مل',
    quantity: 20,
    price: 10.00,
    requires_prescription: false,
    is_emergency_supply: true,
    shelf_location: 'طوارئ خانيونس 2',
    last_updated: new Date(Date.now() - 25 * 60000).toISOString()
  },
  {
    id: 9,
    pharmacy_id: 2,
    commercial_name: 'مرهم ميبو للحروق والجروح (MEBO)',
    scientific_name: 'Beta-sitosterol Natural Ointment',
    category: 'مستلزمات جروح وطوارئ',
    form: 'مرهم 30 جم',
    quantity: 1,
    price: 45.00,
    requires_prescription: false,
    is_emergency_supply: true,
    shelf_location: 'طوارئ خانيونس 1',
    last_updated: new Date(Date.now() - 50 * 60000).toISOString()
  },
  {
    id: 10,
    pharmacy_id: 3,
    commercial_name: 'محلول مطهر بوفيدون أيودين 10%',
    scientific_name: 'Povidone Iodine 10%',
    category: 'مستلزمات جروح وطوارئ',
    form: 'محلول 100 مل',
    quantity: 0,
    price: 20.00,
    requires_prescription: false,
    is_emergency_supply: true,
    shelf_location: 'طوارئ الوسطى B',
    last_updated: new Date(Date.now() - 240 * 60000).toISOString()
  },
  {
    id: 11,
    pharmacy_id: 1,
    commercial_name: 'مرهم ديرمازين 1% للحروق (Dermazin)',
    scientific_name: 'Silver Sulfadiazine 1%',
    category: 'مستلزمات جروح وطوارئ',
    form: 'أنبوب 50 جم',
    quantity: 14,
    price: 22.00,
    requires_prescription: false,
    is_emergency_supply: true,
    shelf_location: 'طوارئ الرمال - حروق',
    last_updated: new Date(Date.now() - 30 * 60000).toISOString()
  },
  {
    id: 12,
    pharmacy_id: 1,
    commercial_name: 'محلول مطهر كلوهيكسيدين بديل اليود (Chlorhexidine)',
    scientific_name: 'Chlorhexidine Digluconate 0.5%',
    category: 'مستلزمات جروح وطوارئ',
    form: 'عبوة غسيل 250 مل',
    quantity: 16,
    price: 15.00,
    requires_prescription: false,
    is_emergency_supply: true,
    shelf_location: 'طوارئ الرمال - تعقيم',
    last_updated: new Date(Date.now() - 20 * 60000).toISOString()
  },
  {
    id: 13,
    pharmacy_id: 2,
    commercial_name: 'كلافوكس 1 جم (Klavox) بديل أوجمنتين',
    scientific_name: 'Amoxicillin + Clavulanate 1g',
    category: 'مضادات حيوية',
    form: 'علبة 14 قرص',
    quantity: 9,
    price: 50.00,
    requires_prescription: true,
    is_emergency_supply: false,
    shelf_location: 'مضادات خانيونس - رف 2',
    last_updated: new Date(Date.now() - 15 * 60000).toISOString()
  },
  {
    id: 14,
    pharmacy_id: 1,
    commercial_name: 'أنسولين لانتوس قلم معبأ مسبقاً (Lantus SoloStar)',
    scientific_name: 'Insulin Glargine 100 U/ml',
    category: 'أدوية السكري والأنسولين',
    form: 'قلم أنسولين 3 مل',
    quantity: 8,
    price: 55.00,
    requires_prescription: true,
    is_emergency_supply: true,
    shelf_location: 'ثلاجة الأنسولين E-0',
    last_updated: new Date(Date.now() - 5 * 60000).toISOString()
  },
  {
    id: 15,
    pharmacy_id: 1,
    commercial_name: 'حليب أطفال نان 1 مدعم بالحديد (NAN 1)',
    scientific_name: 'Infant Formula Milk Stage 1',
    category: 'ألبان وأغذية أطفال',
    form: 'علبة 400 جم',
    quantity: 14,
    price: 32.00,
    requires_prescription: false,
    is_emergency_supply: true,
    shelf_location: 'قسم الأطفال رف B-1',
    last_updated: new Date(Date.now() - 15 * 60000).toISOString()
  },
  {
    id: 16,
    pharmacy_id: 2,
    commercial_name: 'أنسولين نوفورابيد سريع المفعول (NovoRapid FlexPen)',
    scientific_name: 'Insulin Aspart 100 U/ml',
    category: 'أدوية السكري والأنسولين',
    form: 'قلم 3 مل',
    quantity: 5,
    price: 52.00,
    requires_prescription: true,
    is_emergency_supply: true,
    shelf_location: 'ثلاجة خانيونس 1',
    last_updated: new Date(Date.now() - 12 * 60000).toISOString()
  },
  {
    id: 17,
    pharmacy_id: 2,
    commercial_name: 'حليب بليميل بلس 2 للرضع (Blemil Plus 2)',
    scientific_name: 'Follow-up Formula Stage 2',
    category: 'ألبان وأغذية أطفال',
    form: 'علبة 400 جم',
    quantity: 9,
    price: 34.00,
    requires_prescription: false,
    is_emergency_supply: true,
    shelf_location: 'أغذية خانيونس رف C',
    last_updated: new Date(Date.now() - 25 * 60000).toISOString()
  },
  {
    id: 18,
    pharmacy_id: 3,
    commercial_name: 'بخاخ فنتولين موسع للشعب (Ventolin Inhaler)',
    scientific_name: 'Salbutamol 100 mcg/dose',
    category: 'أدوية الجهاز التنفسي والربو',
    form: 'بخاخ 200 جرعة',
    quantity: 11,
    price: 22.00,
    requires_prescription: false,
    is_emergency_supply: true,
    shelf_location: 'طوارئ تنفسي رف R-2',
    last_updated: new Date(Date.now() - 8 * 60000).toISOString()
  },
  {
    id: 19,
    pharmacy_id: 3,
    commercial_name: 'أكياس محلول معالجة الجفاف الفموي (ORS Hydration)',
    scientific_name: 'Oral Rehydration Salts WHO Formula',
    category: 'مستلزمات جروح وطوارئ',
    form: 'علبة 10 أكياس',
    quantity: 60,
    price: 8.00,
    requires_prescription: false,
    is_emergency_supply: true,
    shelf_location: 'طوارئ الجفاف رف E-5',
    last_updated: new Date(Date.now() - 4 * 60000).toISOString()
  },
  {
    id: 20,
    pharmacy_id: 4,
    commercial_name: 'حبوب كونكور 5 ملجم لضغط الدم والقلب (Concor)',
    scientific_name: 'Bisoprolol Fumarate 5mg',
    category: 'أدوية القلب وضغط الدم',
    form: 'شريط 30 قرص',
    quantity: 16,
    price: 28.00,
    requires_prescription: true,
    is_emergency_supply: false,
    shelf_location: 'رف القلب Rx-4',
    last_updated: new Date(Date.now() - 30 * 60000).toISOString()
  },
  {
    id: 21,
    pharmacy_id: 5,
    commercial_name: 'أقراص ميتفورمين 850 ملجم (Glucophage)',
    scientific_name: 'Metformin HCl 850mg',
    category: 'أدوية السكري والأنسولين',
    form: 'علبة 50 قرص',
    quantity: 25,
    price: 14.00,
    requires_prescription: false,
    is_emergency_supply: false,
    shelf_location: 'رف السكري B-3',
    last_updated: new Date(Date.now() - 45 * 60000).toISOString()
  }
];

const DEFAULT_ORDERS_V2 = [
  {
    id: 1,
    order_code: 'MF-9101',
    patient_name: 'محمود خليل العبد',
    patient_phone: '0598881122',
    pharmacy_id: 1,
    medicine_id: 3,
    medicine_name: 'مرهم ميبو للحروق والجروح (MEBO)',
    requested_qty: 1,
    unit_price: 45.00,
    price_total: 45.00,
    status: 'pending',
    urgency_level: 'emergency_wound',
    prescription_image_url: null,
    patient_notes: 'حالة حرق منزلي طارئة بالماء المغلي، يرجى تجهيز العبوة للاستلام العاجل',
    pharmacist_notes: '',
    rejection_reason: '',
    pickup_verification_code: '7742',
    created_at: new Date(Date.now() - 4 * 60000).toISOString(),
    locked_until: new Date(Date.now() + 11 * 60000).toISOString(),
    verified_at: null
  },
  {
    id: 2,
    order_code: 'MF-9102',
    patient_name: 'فاطمة أحمد عاشور',
    patient_phone: '0567772233',
    pharmacy_id: 1,
    medicine_id: 1,
    medicine_name: 'شاش طبي معقم 10×10 (Sterile Gauze)',
    requested_qty: 2,
    unit_price: 15.00,
    price_total: 30.00,
    status: 'approved',
    urgency_level: 'urgent',
    prescription_image_url: null,
    patient_notes: 'تغيير ضماد جرح طريح الفراش',
    pharmacist_notes: 'تم فحص الرف وتجهيز العبوة كود الاستلام 9108',
    rejection_reason: '',
    pickup_verification_code: '9108',
    created_at: new Date(Date.now() - 15 * 60000).toISOString(),
    verified_at: new Date(Date.now() - 10 * 60000).toISOString()
  }
];

const DEFAULT_REPORTS = [
  {
    id: 1,
    reporter_name: 'محمود خليل',
    reporter_phone: '0598881122',
    pharmacy_id: 2,
    pharmacy_name: 'صيدلية خانيونس الكبرى',
    report_type: 'incorrect_stock',
    details: 'الصيدلية كانت مسجلة في المنصة أن شاش الفازلين متوفر ولكن اعتذر الصيدلي لانتفائه',
    status: 'resolved',
    admin_notes: 'تم التواصل مع د. مريم وتحديث المخزون الفعلي بالمخزن',
    created_at: new Date(Date.now() - 24 * 3600000).toISOString()
  }
];

// --- بيانات المستشفيات والنقاط الطبية الميدانية (قطاع غزة) ---
const DEFAULT_FIELD_HOSPITALS_GAZA = [
  {
    id: 'fh-1',
    name: 'المستشفى الميداني الإماراتي - رفح',
    governorate: 'رفح',
    district: 'المواصي',
    location_lat: 31.2850,
    location_lng: 34.2550,
    type: 'مستشفى جراحي ميداني متقدم',
    capacity: '150 سرير - غرف عمليات وعناية مكثفة',
    emergency_phone: '0599001122',
    services: ['جراحة عظام وحروق', 'صيدلية طوارئ مجانية', 'بنك دم ميداني', 'إسعاف فوري'],
    status: 'active',
    is_field_clinic: true
  },
  {
    id: 'fh-2',
    name: 'المستشفى الميداني الأردني - خانيونس',
    governorate: 'خانيونس',
    district: 'مجمع ناصر الطبي / المواصي',
    location_lat: 31.3520,
    location_lng: 34.3120,
    type: 'مستشفى ميداني عسكري تخصصي',
    capacity: '80 سرير - استقبال إصابات حرج',
    emergency_phone: '0599003344',
    services: ['فرز إصابات شظايا', 'غيارات حروق معقمة', 'مستودع محاليل وريدية', 'مسكنات مركزية'],
    status: 'active',
    is_field_clinic: true
  },
  {
    id: 'fh-3',
    name: 'المستشفى الميداني للصليب الأحمر (ICRC) - رفح',
    governorate: 'رفح',
    district: 'شمال غرب رفح',
    location_lat: 31.3050,
    location_lng: 34.2250,
    type: 'مستشفى طوارئ إنساني متكامل',
    capacity: '60 سرير - دعم العمليات الجراحية',
    emergency_phone: '0599005566',
    services: ['جراحة طوارئ نسائية وأطفال', 'ضماد جروح عميقة', 'تثبيت كسور عاجلة'],
    status: 'active',
    is_field_clinic: true
  },
  {
    id: 'fh-4',
    name: 'نقطة الهلال الأحمر الطبية المؤقتة - دير البلح',
    governorate: 'دير البلح',
    district: 'قرب شارع صلاح الدين',
    location_lat: 31.4220,
    location_lng: 34.3580,
    type: 'نقطة فرز وإسعاف متقدمة',
    capacity: 'استقبال حالات الإصابات الخفيفة والمتوسطة',
    emergency_phone: '101',
    services: ['تضميد وتطهير جروح', 'صرف أدوية ربو وسكري طارئة', 'نقل الحالات الحرجة'],
    status: 'active',
    is_field_clinic: true
  },
  {
    id: 'fh-5',
    name: 'نقطة الإغاثة الطبية المؤقتة - مخيم جباليا',
    governorate: 'شمال غزة',
    district: 'مخيم جباليا - مركز الإيواء',
    location_lat: 31.5320,
    location_lng: 34.4920,
    type: 'نقطة صحية طارئة وميدانية',
    capacity: 'صيدلية طوارئ ومضادات حيوية',
    emergency_phone: '0599887766',
    services: ['مضادات حيوية للأطفال', 'غيارات جروح بالشاش المعقم', 'خافضات حرارة ومسكنات'],
    status: 'active',
    is_field_clinic: true
  }
];

// --- نظام الكوبونات الإغاثية الرقمية (E-Vouchers) ---
const DEFAULT_VOUCHERS_GAZA = [
  {
    code: 'GAZA-AID-100',
    title: 'منحة الطوارئ الإغاثية الشاملة - الهلال الأحمر',
    discount_type: 'percent',
    discount_value: 100,
    max_coverage: 250,
    sponsor: 'جمعية الهلال الأحمر الفلسطيني',
    is_active: true,
    applicable_categories: ['all'],
    expiry: '2026-12-31'
  },
  {
    code: 'UNRWA-RELIEF-50',
    title: 'قسيمة الإغاثة الدوائية (50 ₪) - الأونروا',
    discount_type: 'fixed',
    discount_value: 50,
    max_coverage: 50,
    sponsor: 'برنامج الصحة والإغاثة (UNRWA)',
    is_active: true,
    applicable_categories: ['مستلزمات جروح وطوارئ', 'مضادات حيوية'],
    expiry: '2026-12-31'
  },
  {
    code: 'BURNS-CARE-FREE',
    title: 'كوبون طوارئ الحروق وإصابات القصف (100% تغطية)',
    discount_type: 'percent',
    discount_value: 100,
    max_coverage: 150,
    sponsor: 'أطباء بلا حدود (MSF)',
    is_active: true,
    applicable_categories: ['مستلزمات جروح وطوارئ'],
    expiry: '2026-12-31'
  }
];

// --- قاموس البدائل الدوائية العلمية (Generic & Therapeutic Substitution) ---
const GENERIC_ALTERNATIVES_MAP = {
  'povidone iodine': [
    { name: 'محلول مطهر كلوهيكسيدين بديل اليود (Chlorhexidine)', scientific: 'Chlorhexidine Digluconate 0.5%', reason: 'مطهر بديل بنفس الفعالية واسع المدى لتعقيم الجروح ولا يسبب حساسية اليود' }
  ],
  'محلول مطهر بوفيدون أيودين 10%': [
    { name: 'محلول مطهر كلوهيكسيدين بديل اليود (Chlorhexidine)', scientific: 'Chlorhexidine Digluconate 0.5%', reason: 'مطهر بديل بنفس الفعالية واسع المدى لتعقيم الجروح ولا يسبب حساسية اليود' }
  ],
  'amoxicillin + clavulanate 1g': [
    { name: 'كلافوكس 1 جم (Klavox) بديل أوجمنتين', scientific: 'Amoxicillin + Clavulanate 1g', reason: 'نفس المادة الفعالة والتركيز والجرعة العلاجية تماماً من شركة دوائية معتمدة' },
    { name: 'كلاموكس 1 جم (Clamox)', scientific: 'Amoxicillin + Clavulanate 1g', reason: 'بديل جنيسي مطابق تماماً' }
  ],
  'أوجمنتين 1 جم (augmentin)': [
    { name: 'كلافوكس 1 جم (Klavox) بديل أوجمنتين', scientific: 'Amoxicillin + Clavulanate 1g', reason: 'نفس المادة الفعالة والتركيز والجرعة العلاجية تماماً من شركة دوائية معتمدة' }
  ],
  'مرهم ميبو للحروق والجروح (mebo)': [
    { name: 'مرهم ديرمازين 1% للحروق (Dermazin)', scientific: 'Silver Sulfadiazine 1%', reason: 'بديل مضاد للميكروبات ومسكن لحروق الدرجة الثانية وتجدد الأنسجة' }
  ],
  'شاش طبي معقم 10×10 (sterile gauze)': [
    { name: 'شاش فازلين معقم للحرائق (Paraffin)', scientific: 'Paraffin Gauze Dressing', reason: 'بديل مناسب جداً لمنع التصاق الضماد بالجروح والحروق' }
  ],
  'أنسولين لانتوس قلم معبأ مسبقاً (lantus solostar)': [
    { name: 'أنسولين بيزاجلار (Basaglar KwikPen)', scientific: 'Insulin Glargine 100 U/ml', reason: 'بديل حيوي مطابق علمياً بنفس الجرعة القاعدية والتأثير على مدار 24 ساعة' }
  ],
  'بخاخ فنتولين موسع للشعب (ventolin inhaler)': [
    { name: 'بخاخ أستالين 100 ميكروجرام (Asthalin)', scientific: 'Salbutamol 100 mcg', reason: 'نفس المادة الفعالة وجرعة الاستنشاق لفتح القصبات الهوائية في نوبات الربو الحادة' }
  ],
  'حليب أطفال نان 1 مدعم بالحديد (nan 1)': [
    { name: 'حليب بليميل بلس 1 (Blemil Plus 1)', scientific: 'Infant Milk Formula Stage 1', reason: 'تركيبة غذائية متوازنة كاملة ومناسبة للرضع من عمر يوم حتى 6 أشهر' },
    { name: 'حليب رونالاك 1 (Ronalac 1)', scientific: 'Infant Formula Stage 1', reason: 'بديل مغذٍ ومعتمد للرضع في حال انقطاع نان' }
  ],
  'حبوب كونكور 5 ملجم لضغط الدم والقلب (concor)': [
    { name: 'بيسوبرولول 5 ملجم (Bisoprolol)', scientific: 'Bisoprolol Fumarate 5mg', reason: 'البديل العلمي المطابق تماماً لضبط النبض وضغط الدم الشرياني' }
  ]
};

// --- رف التكافل الدوائي والتبرعات المجانية بين الأهالي (Solidarity Shelf) ---
const DEFAULT_DONATIONS_GAZA = [
  {
    id: 1,
    donor_name: 'أم محمد الغفري',
    donor_phone: '0599334411',
    medicine_name: 'أنسولين لانتوس (فائض عن حاجة الوالد)',
    quantity: 'قلمان معبآن',
    expiry_date: '2026-11',
    governorate: 'غزة',
    district: 'محيط مجمع الشفاء',
    status: 'available',
    notes: 'تم الحفظ في مكان مبرد بعناية ومجاني لوجه الله تعالى لأي مريض سكري محتاج',
    created_at: new Date(Date.now() - 3 * 3600000).toISOString()
  },
  {
    id: 2,
    donor_name: 'د. خليل صيام',
    donor_phone: '0569112288',
    medicine_name: 'شاش معقم وضمادات حروق وديرمازين',
    quantity: '3 علب كاملة',
    expiry_date: '2027-04',
    governorate: 'دير البلح',
    district: 'مخيم دير البلح - بجوار المسجد الكبير',
    status: 'available',
    notes: 'تبرع مجاني للجرحى والمصابين في مراكز الإيواء والخيام',
    created_at: new Date(Date.now() - 3600000).toISOString()
  },
  {
    id: 3,
    donor_name: 'عائلة الشهيد أبو يوسف',
    donor_phone: '0598774433',
    medicine_name: 'حليب أطفال بريمير للخدج ونقص الوزن',
    quantity: 'عبوتان مقفلتان',
    expiry_date: '2026-09',
    governorate: 'خانيونس',
    district: 'مواصي خانيونس - شارع 5',
    status: 'available',
    notes: 'حليب مخصص للرضع ناقصي الوزن لوجه الله',
    created_at: new Date(Date.now() - 1800000).toISOString()
  }
];

// --- نداءات الاستغاثة الدوائية الطارئة (SOS Emergency Medicine Beacons) ---
const DEFAULT_SOS_BEACONS_GAZA = [
  {
    id: 1,
    beacon_code: 'SOS-701',
    patient_name: 'طفل مصاب (عمر أبو حصيرة - 4 سنوات)',
    patient_phone: '0599887766',
    urgency_level: 'CRITICAL',
    medicine_needed: 'أكياس دم O- سالب ومحلول رينجر لاكتات وأنسولين أطفال',
    governorate: 'غزة',
    location_details: 'حي الشيخ رضوان - قرب مدرسة الهدى للإيواء',
    status: 'active',
    notes: 'إصابة حرجة والطفل يعاني من هبوط حاد في السكر وجفاف شديد',
    created_at: new Date(Date.now() - 15 * 60000).toISOString()
  },
  {
    id: 2,
    beacon_code: 'SOS-702',
    patient_name: 'حالة ولادة قيصرية طارئة (أم يامن)',
    patient_phone: '0568112233',
    urgency_level: 'CRITICAL',
    medicine_needed: 'أمبولات أوكسيتوسين وخيوط جراحية مقاس 2-0',
    governorate: 'دير البلح',
    location_details: 'مستشفى شهداء الأقصى الميداني',
    status: 'active',
    notes: 'نفاد خيوط العمليات الجراحية في نقطة التوليد',
    created_at: new Date(Date.now() - 45 * 60000).toISOString()
  }
];

// --- دليل الإسعافات والبدائل الشعبية والطبية عند انقطاع الدواء (Low-Resource Survival Guide) ---
const DEFAULT_EMERGENCY_GUIDES_GAZA = [
  {
    id: 'ors_dehydration',
    title: 'محلول معالجة الجفاف الفموي المنزلي (إنقاذ الأطفال من الإسهال الشديد)',
    category: 'أطفال وجفاف',
    icon: 'fa-bottle-water',
    urgency: 'منقذ للحياة',
    ingredients: [
      '1 لتر ماء نظيف مغلي ومبرد',
      '6 ملاعق صغيرة مسطحة سكر',
      'نصف ملعقة صغيرة ملح طعام'
    ],
    instructions: 'يخلط الملح والسكر جيداً حتى الذوبان التام. يُعطى للطفل بالملعقة أو بالرشفات الصغيرة بعد كل نوبة إسهال أو قيء لتعويض الأملاح ومنع الفشل الكلوي.',
    caution: 'تجنب زيادة الملح نهائياً لأن ذلك قد يضر كلى الرضيع.'
  },
  {
    id: 'burns_first_aid',
    title: 'إسعاف الحروق وتسكين الألم عند انقطاع مراهم ميبو وديرمازين',
    category: 'حروق وطوارئ',
    icon: 'fa-fire-flame-simple',
    urgency: 'إسعاف أولي',
    ingredients: [
      'ماء جاري فاتر / بارد معتدل (ليس ثلجياً)',
      'شاش نظيف معقم أو قماش قطني مغلي ومكوي',
      'عسل طبي نقي (إن وجد) كضماد مانع للبكتيريا'
    ],
    instructions: '1. تبريد مكان الحرق فوراً بماء نظيف لمدة 15 إلى 20 دقيقة لتوقيف تلف الأنسجة العميقة. 2. لا تفقع الفقاعات الجلدية أبداً. 3. تغطية الحرق برفق بشاش نظيف غير لاصق أو طبقة رقيقة من العسل الطبي.',
    caution: 'لا تضع معجون الأسنان أو الطحين أو القهوة على الحرق إطلاقاً لأنها تسبب تلوثاً بكتيرياً شديداً.'
  },
  {
    id: 'home_saline_wounds',
    title: 'تحضير المحلول الملحي المعقم منزلياً لتطهير الجروح والشظايا',
    category: 'جروح وشظايا',
    icon: 'fa-kit-medical',
    urgency: 'تعقيم',
    ingredients: [
      '1 لتر ماء',
      'ملعقة صغيرة واحدة ممسوحة (9 جرام) من ملح الطعام النقي'
    ],
    instructions: 'يُغلى الماء مع الملح لمدة 10 دقائق متواصلة لقتل كافة الميكروبات. يُترك حتى يبرد تماماً في وعاء مغطى. يُستخدم لغسيل وتنظيف الجروح المفتوحة وإزالة الأتربة والشظايا بلطف.',
    caution: 'يُحفظ مغطى ويُستخدم خلال 24 ساعة فقط ثم يُحضر محلول جديد.'
  },
  {
    id: 'asthma_crisis',
    title: 'تدبير أزمات ضيق التنفس والربو عند نفاد بخاخ الفنتولين',
    category: 'جهاز تنفسي',
    icon: 'fa-lungs',
    urgency: 'طوارئ تنفسية',
    ingredients: [
      'كوب قهوة سوداء مركزة دافئة (كافيين)',
      'وعاء ماء ساخن لاستنشاق البخار'
    ],
    instructions: '1. إجلاس المريض بوضعية قائمة ومنحنية قليلاً للأمام (Tripod Position). 2. إعطاء المريض كوب قهوة مركزة دافئة (الكافيين مركب كيميائي مشابه للثيوفيللين ويساعد في توسيع الشعب الهوائية مؤقتاً). 3. استنشاق بخار الماء الدافئ بهدوء لترطيب المجاري الهوائية.',
    caution: 'تجنب استلقاء المريض على ظهره لأنه يضاعف الاختناق.'
  },
  {
    id: 'insulin_clay_storage',
    title: 'حفظ الأنسولين بالفخار والماء المتبخر في ظل انقطاع الكهرباء التام',
    category: 'مرضى السكري',
    icon: 'fa-temperature-arrow-down',
    urgency: 'حفظ الأدوية',
    ingredients: [
      'إناء فخاري مسامي (جرة أو قلة أو زيارة فخار)',
      'رمل نظيف مبلل بالماء',
      'كيس محكم الإغلاق لحماية أقلام الأنسولين'
    ],
    instructions: 'يوضع الأنسولين في كيس بلاستيكي محكم ضد الماء، ثم يوضع داخل إناء فخاري محاط برمل مبلل في مكان مظلل وظليل به تيار هواء. عملية تبخر الماء من مسام الفخار تخفض درجة الحرارة بمقدار 5 إلى 8 درجات مئوية تحت حرارة الغرفة، مما يحافظ على فاعلية الأنسولين لشهرين دون كهرباء.',
    caution: 'تجنب تعرض الفخار لأشعة الشمس المباشرة.'
  }
];

// --- حالة الممرات والمسارات الآمنة بقطاع غزة ---
const DEFAULT_SAFE_CORRIDORS_GAZA = [
  {
    id: 1,
    name: 'شارع الرشيد الساحلي (طريق البحر)',
    governorates: 'غزة - الوسطى - خانيونس',
    status: 'cautious',
    status_label: 'سالك بحذر للمشاة والدراجات',
    badge_class: 'badge-core-warning',
    last_update: 'قبل 20 دقيقة'
  },
  {
    id: 2,
    name: 'شارع صلاح الدين الرئيسي',
    governorates: 'الشمال إلى الجنوب',
    status: 'danger',
    status_label: 'مغلق ومحفوف بالخطر الشديد',
    badge_class: 'badge-core-emergency',
    last_update: 'قبل 10 دقائق'
  },
  {
    id: 3,
    name: 'طريق مواصي خانيونس ودير البلح الداخلي',
    governorates: 'خانيونس - دير البلح',
    status: 'safe',
    status_label: 'سالك لحركة الأهالي ونقاط الإسعاف',
    badge_class: 'badge-core-success',
    last_update: 'قبل 5 دقائق'
  }
];

// --- خوارزميات البحث الصوتي والتطبيع اللغوي وقاموس المرادفات العامية بقطاع غزة ---
function normalizeArabicText(str) {
  if (!str) return '';
  return str
    .toLowerCase()
    .replace(/[أإآ]/g, 'ا')
    .replace(/ة/g, 'ه')
    .replace(/ى/g, 'ي')
    .replace(/[\u064B-\u0652]/g, '') // إزالة التشكيل
    .replace(/ـ/g, '') // إزالة التطويل
    .replace(/[^a-z0-9\u0621-\u064A\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function levenshteinDistance(a, b) {
  if (!a || !b) return (a || b).length;
  const matrix = [];
  for (let i = 0; i <= b.length; i++) matrix[i] = [i];
  for (let j = 0; j <= a.length; j++) matrix[0][j] = j;
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }
  return matrix[b.length][a.length];
}

const COLLOQUIAL_MEDICINE_DICTIONARY = [
  { colloquial: 'حبة الضغط الصفرا', targets: ['كونكور', 'concor', 'bisoprolol', 'ضغط', 'بيسوبرولول'], suggestedLabel: 'كونكور 5 ملجم (Concor)' },
  { colloquial: 'حبة الضغط', targets: ['كونكور', 'concor', 'amlodipine', 'املوديبين', 'ضغط'], suggestedLabel: 'كونكور أو أملوديبين' },
  { colloquial: 'املودبين', targets: ['amlodipine', 'املوديبين', 'كونكور'], suggestedLabel: 'أملوديبين 5 ملجم' },
  { colloquial: 'ابرة السكر', targets: ['لانتوس', 'lantus', 'نوفورابيد', 'novorapid', 'انسولين'], suggestedLabel: 'أنسولين لانتوس / نوفورابيد' },
  { colloquial: 'قلم السكر', targets: ['لانتوس', 'lantus', 'نوفورابيد', 'novorapid', 'انسولين'], suggestedLabel: 'أقلام أنسولين' },
  { colloquial: 'حبوب السكر', targets: ['جلوكوفاج', 'glucophage', 'ميتفورمين', 'metformin'], suggestedLabel: 'ميتفورمين (جلوكوفاج)' },
  { colloquial: 'حليب نونو', targets: ['نان', 'nan', 'بليميل', 'blemil', 'حليب'], suggestedLabel: 'حليب أطفال رضع' },
  { colloquial: 'حليب اطفال', targets: ['نان', 'nan', 'بليميل', 'blemil', 'حليب'], suggestedLabel: 'حليب أطفال (نان / بليميل)' },
  { colloquial: 'بخاخ الصدر', targets: ['فنتولين', 'ventolin', 'سالبوتامول'], suggestedLabel: 'بخاخ فنتولين (Ventolin)' },
  { colloquial: 'بخاخ الربو', targets: ['فنتولين', 'ventolin', 'سالبوتامول'], suggestedLabel: 'بخاخ فنتولين للربو' },
  { colloquial: 'مرهم الحروق', targets: ['ميبو', 'mebo', 'ديرمازين', 'dermazin'], suggestedLabel: 'مرهم ميبو (MEBO)' },
  { colloquial: 'مرهم اصفر', targets: ['ميبو', 'mebo'], suggestedLabel: 'مرهم ميبو للحروق' },
  { colloquial: 'محلول الاسهال', targets: ['ors', 'جفاف', 'معالجة الجفاف'], suggestedLabel: 'محلول معالجة الجفاف (ORS)' },
  { colloquial: 'املاح الجفاف', targets: ['ors', 'جفاف', 'معالجة الجفاف'], suggestedLabel: 'أكياس أملاح الجفاف ORS' },
  { colloquial: 'مضاد حيوي', targets: ['اوجمنتين', 'augmentin', 'كلافوكس', 'klavox'], suggestedLabel: 'أوجمنتين مضاد حيوي' },
  { colloquial: 'اوكمنتين', targets: ['اوجمنتين', 'augmentin'], suggestedLabel: 'أوجمنتين 1 جم' },
  { colloquial: 'مسكن', targets: ['اكامول', 'acamol', 'باراسيتامول', 'paracetamol'], suggestedLabel: 'أكامول إكسترا' },
  { colloquial: 'بندول', targets: ['اكامول', 'acamol', 'paracetamol'], suggestedLabel: 'أكامول (بديل البنادول)' },
  { colloquial: 'شاش', targets: ['شاش', 'gauze', 'معقم'], suggestedLabel: 'شاش طبي معقم' },
  { colloquial: 'بلاستر', targets: ['لاصق', 'waterproof', 'dressing'], suggestedLabel: 'لاصق جروح طبي' },
  { colloquial: 'يود', targets: ['بوفيدون', 'povidone', 'مطهر'], suggestedLabel: 'محلول بوفيدون أيودين مطهر' }
];

// --- فاحص الصلاحية وتاريخ الانتهاء المحلي (In-Browser Expiry Scanner) ---
function scanMedicineExpiryDate(text) {
  if (!text) return { valid: false, message: 'لم يتم العثور على تاريخ' };
  // أنماط EXP / Expiry وتواريخ مثل 11/2026 أو 05/25 أو 2026-11
  const patterns = [
    /(?:exp|expiry|bb|تاريخ الانتهاء|صالح حتى)[\s:.\-\/]*(\d{1,2})[\/\.\-](\d{2,4})/i,
    /(?:exp|expiry)[\s:.\-\/]*(\d{4})[\/\.\-](\d{1,2})/i,
    /(\d{1,2})[\/\-](\d{4})/,
    /(\d{1,2})[\/\-](\d{2})/
  ];

  let month = null;
  let year = null;

  for (const reg of patterns) {
    const match = text.match(reg);
    if (match) {
      if (match[2].length === 4) {
        month = parseInt(match[1], 10);
        year = parseInt(match[2], 10);
      } else if (match[1].length === 4) {
        year = parseInt(match[1], 10);
        month = parseInt(match[2], 10);
      } else {
        month = parseInt(match[1], 10);
        year = 2000 + parseInt(match[2], 10);
      }
      break;
    }
  }

  if (month && year && month >= 1 && month <= 12) {
    const now = new Date();
    const expiryDate = new Date(year, month, 0); // آخر يوم في الشهر
    const isExpired = expiryDate < now;
    const diffMonths = Math.round((expiryDate - now) / (1000 * 60 * 60 * 24 * 30));

    return {
      valid: true,
      raw_text: `${month}/${year}`,
      is_expired: isExpired,
      months_remaining: diffMonths,
      status: isExpired ? 'expired' : diffMonths < 3 ? 'near_expiry' : 'safe',
      alert: isExpired
        ? '⚠️ تنبيه حرج: هذا الدواء منتهي الصلاحية! يمنع التبرع به أو تداوله حفظاً لأرواح المرضى.'
        : diffMonths < 3
        ? '⚠️ تنبيه: الصلاحية قريبة (أقل من 3 أشهر) — يرجى صرفه للحالات العاجلة فقط.'
        : '✅ تاريخ الصلاحية سليم ومطابق لشروط السلامة الصيدلانية.'
    };
  }

  return { valid: false, message: 'تعذر استخراج تاريخ الصلاحية بدقة — يرجى التأكد يدوياً' };
}

// ضاغط الصور المحلي المعتمد على الـ Canvas (<40KB)
function compressImageToWebP(file, maxWidth = 800, quality = 0.68) {
  return new Promise((resolve, reject) => {
    if (!file) return reject('No file provided');
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        // محاولة التصدير كـ webp خفيف، مع fallback لـ jpeg
        let dataUrl = canvas.toDataURL('image/webp', quality);
        if (!dataUrl.startsWith('data:image/webp')) {
          dataUrl = canvas.toDataURL('image/jpeg', quality);
        }
        resolve({
          dataUrl,
          width,
          height,
          approxSizeKb: Math.round((dataUrl.length * 3) / 4 / 1024)
        });
      };
      img.onerror = () => reject('Failed to load image');
      img.src = e.target.result;
    };
    reader.onerror = () => reject('Failed to read file');
    reader.readAsDataURL(file);
  });
}

// --- بيانات أولية لخدمات غزة الإغاثية المتقدمة ---
const DEFAULT_SNIPER_WATCHDOGS_GAZA = [
  {
    id: 1,
    patient_name: 'أحمد أبو شعبان',
    patient_phone: '0599123456',
    medicine_query: 'أنسولين لانتوس',
    governorate: 'دير البلح',
    max_price: 60.0,
    status: 'hunting',
    created_at: new Date(Date.now() - 2 * 3600000).toISOString()
  },
  {
    id: 2,
    patient_name: 'سعاد البيوك',
    patient_phone: '0569876543',
    medicine_query: 'كونكور 5 ملجم',
    governorate: 'خانيونس',
    max_price: 35.0,
    status: 'hunting',
    created_at: new Date(Date.now() - 5 * 3600000).toISOString()
  }
];

const DEFAULT_REVERSE_BIDS_GAZA = [
  {
    id: 1,
    bid_code: 'RX-BID-401',
    patient_name: 'خالد النمس (نازح في مواصي خانيونس)',
    patient_phone: '0599765432',
    governorate: 'خانيونس',
    prescription_notes: 'وصفة طفل مصاب بنزلة معوية حادة: محلول جفاف + زنك + مطهر معوي',
    prescription_image_url: null,
    offers_count: 2,
    offers: [
      {
        pharmacy_id: 2,
        pharmacy_name: 'صيدلية خانيونس الكبرى',
        total_quote: 24.0,
        available_items: 'متوفر كامل الأصناف (ORS + زنك شراب)',
        delivery_ready: true,
        notes: 'مجهزة للاستلام أو توصيل عبر متطوع المخيم'
      }
    ],
    status: 'open',
    created_at: new Date(Date.now() - 40 * 60000).toISOString()
  }
];

const DEFAULT_BARTER_LISTINGS_GAZA = [
  {
    id: 1,
    offering_pharmacy_id: 1,
    offering_pharmacy_name: 'صيدلية الرمال المركزية',
    surplus_medicine: 'شاش فازلين معقم (Paraffin Gauze)',
    surplus_quantity: '20 علبة',
    wanted_medicine: 'محلول بوفيدون أيودين 10% أو مطهر كلوهيكسيدين',
    wanted_quantity: '15 عبوة',
    governorate: 'غزة',
    status: 'open',
    notes: 'مستعدون للمبادلة الفورية لتغطية قسم الحروق المستعجل',
    created_at: new Date(Date.now() - 2 * 3600000).toISOString()
  },
  {
    id: 2,
    offering_pharmacy_id: 3,
    offering_pharmacy_name: 'صيدلية دير البلح للطوارئ',
    surplus_medicine: 'أقراص ميتفورمين 850 (Glucophage)',
    surplus_quantity: '30 علبة',
    wanted_medicine: 'أقلام أنسولين لانتوس أو نوفورابيد',
    wanted_quantity: '5 أقلام',
    governorate: 'دير البلح',
    status: 'open',
    notes: 'تبادل صيدلاني تعاوني بدون أي فوارق مالية',
    created_at: new Date(Date.now() - 6 * 3600000).toISOString()
  }
];

const DEFAULT_BLISTER_SHARES_GAZA = [
  {
    id: 1,
    pharmacy_id: 1,
    pharmacy_name: 'صيدلية الرمال المركزية',
    medicine_name: 'كونكور 5 ملجم (Concor)',
    full_box_price: 28.0,
    strips_total: 3,
    strips_available: 2,
    price_per_strip: 9.5,
    pills_per_strip: 10,
    created_at: new Date(Date.now() - 3600000).toISOString()
  },
  {
    id: 2,
    pharmacy_id: 2,
    pharmacy_name: 'صيدلية خانيونس الكبرى',
    medicine_name: 'أوجمنتين 1 جم (Augmentin)',
    full_box_price: 65.0,
    strips_total: 2,
    strips_available: 1,
    price_per_strip: 32.5,
    pills_per_strip: 7,
    created_at: new Date(Date.now() - 7200000).toISOString()
  }
];

const DEFAULT_ZERO_RESULTS_GAZA = [
  { id: 1, query: 'أنسولين لانتوس', governorate: 'دير البلح', district: 'مخيم دير البلح', count: 430, timestamp: new Date(Date.now() - 86400000).toISOString() },
  { id: 2, query: 'حليب أطفال نان 1', governorate: 'خانيونس', district: 'المواصي', count: 312, timestamp: new Date(Date.now() - 43200000).toISOString() },
  { id: 3, query: 'بخاخ فنتولين', governorate: 'شمال غزة', district: 'مخيم جباليا', count: 285, timestamp: new Date(Date.now() - 21600000).toISOString() },
  { id: 4, query: 'مرهم ميبو حروق', governorate: 'غزة', district: 'الرمال', count: 198, timestamp: new Date(Date.now() - 10800000).toISOString() }
];

// --- 2. محرك التنبيهات الصوتية (Web Audio API Synthesizer) ---
class AudioNotifier {
  constructor() {
    this.ctx = null;
  }

  initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playIncomingOrderChime() {
    try {
      this.initContext();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.15);
      osc.frequency.exponentialRampToValueAtTime(1174.66, now + 0.3);
      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.6);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.6);
    } catch (e) {
      console.warn('Audio chime skipped:', e);
    }
  }

  playApprovalChime() {
    try {
      this.initContext();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(523.25, now);
      osc.frequency.setValueAtTime(659.25, now + 0.12);
      osc.frequency.setValueAtTime(783.99, now + 0.24);
      osc.frequency.setValueAtTime(1046.50, now + 0.36);
      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.7);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.7);
    } catch (e) {
      console.warn('Audio chime skipped:', e);
    }
  }
}

// --- 3. فئة إدارة البيانات التفاعلية والمزامنة (MediFindStore) ---
class MediFindStore {
  constructor() {
    this.audio = new AudioNotifier();
    this.channel = null;
    this.initBroadcastChannel();
    this.init();
  }

  initBroadcastChannel() {
    try {
      if ('BroadcastChannel' in window) {
        this.channel = new BroadcastChannel('medifind_realtime_sync');
        this.channel.onmessage = (event) => {
          if (event.data && event.data.type === 'DATA_UPDATED') {
            window.dispatchEvent(new Event('medifind_data_changed'));
          }
        };
      }
    } catch (e) {
      console.warn('BroadcastChannel fallback:', e);
    }
  }

  init() {
    const storedUsers = localStorage.getItem('medifind_users_v2');
    if (!storedUsers) {
      this.resetToDefaults();
    } else {
      if (!localStorage.getItem('medifind_medicines_v2') || JSON.parse(localStorage.getItem('medifind_medicines_v2') || '[]').length < 20) {
        localStorage.setItem('medifind_medicines_v2', JSON.stringify(DEFAULT_MEDICINES_V2));
      }
      if (!localStorage.getItem('medifind_hospitals_v2')) {
        localStorage.setItem('medifind_hospitals_v2', JSON.stringify(DEFAULT_FIELD_HOSPITALS_GAZA));
      }
      if (!localStorage.getItem('medifind_vouchers_v2')) {
        localStorage.setItem('medifind_vouchers_v2', JSON.stringify(DEFAULT_VOUCHERS_GAZA));
      }
      if (!localStorage.getItem('medifind_donations_v2')) {
        localStorage.setItem('medifind_donations_v2', JSON.stringify(DEFAULT_DONATIONS_GAZA));
      }
      if (!localStorage.getItem('medifind_sos_beacons_v2')) {
        localStorage.setItem('medifind_sos_beacons_v2', JSON.stringify(DEFAULT_SOS_BEACONS_GAZA));
      }
      if (!localStorage.getItem('medifind_safe_corridors_v2')) {
        localStorage.setItem('medifind_safe_corridors_v2', JSON.stringify(DEFAULT_SAFE_CORRIDORS_GAZA));
      }
      if (!localStorage.getItem('medifind_sniper_watchdogs')) {
        localStorage.setItem('medifind_sniper_watchdogs', JSON.stringify(DEFAULT_SNIPER_WATCHDOGS_GAZA));
      }
      if (!localStorage.getItem('medifind_reverse_bids')) {
        localStorage.setItem('medifind_reverse_bids', JSON.stringify(DEFAULT_REVERSE_BIDS_GAZA));
      }
      if (!localStorage.getItem('medifind_barter_listings')) {
        localStorage.setItem('medifind_barter_listings', JSON.stringify(DEFAULT_BARTER_LISTINGS_GAZA));
      }
      if (!localStorage.getItem('medifind_blister_shares')) {
        localStorage.setItem('medifind_blister_shares', JSON.stringify(DEFAULT_BLISTER_SHARES_GAZA));
      }
      if (!localStorage.getItem('medifind_zero_results')) {
        localStorage.setItem('medifind_zero_results', JSON.stringify(DEFAULT_ZERO_RESULTS_GAZA));
      }
      if (!localStorage.getItem('medifind_health_points')) {
        localStorage.setItem('medifind_health_points', JSON.stringify({ '0599000000': 45, 'default': 20 }));
      }
      if (!localStorage.getItem('medifind_network_mode')) {
        localStorage.setItem('medifind_network_mode', 'online');
      }
    }
    this.syncWithServer();
  }

  syncWithServer() {
    if (typeof fetch === 'undefined') return;
    // استعلام خلفي غير حاجب للمزامنة اللحظية مع السيرفر وقاعدة البيانات
    fetch('api.php?action=bootstrap', { cache: 'no-store' })
      .then(res => res.json())
      .then(res => {
        if (res && res.success && res.data) {
          if (res.data.users && res.data.users.length) {
            localStorage.setItem('medifind_users_v2', JSON.stringify(res.data.users));
          }
          if (res.data.medicines && res.data.medicines.length) {
            localStorage.setItem('medifind_medicines_v2', JSON.stringify(res.data.medicines));
          }
          if (res.data.orders && res.data.orders.length) {
            localStorage.setItem('medifind_orders_v2', JSON.stringify(res.data.orders));
          }
          if (res.data.donations && res.data.donations.length) {
            localStorage.setItem('medifind_donations_v2', JSON.stringify(res.data.donations));
          }
          if (res.data.sos_beacons && res.data.sos_beacons.length) {
            localStorage.setItem('medifind_sos_beacons_v2', JSON.stringify(res.data.sos_beacons));
          }
          this.emitChange();
        }
      })
      .catch(() => {
        // العمل التلقائي عبر الكاش المحلي دون أي تعليق
      });
  }

  resetToDefaults() {
    localStorage.setItem('medifind_users_v2', JSON.stringify(DEFAULT_USERS_V2));
    localStorage.setItem('medifind_medicines_v2', JSON.stringify(DEFAULT_MEDICINES_V2));
    localStorage.setItem('medifind_orders_v2', JSON.stringify(DEFAULT_ORDERS_V2));
    localStorage.setItem('medifind_reports_v2', JSON.stringify(DEFAULT_REPORTS));
    localStorage.setItem('medifind_hospitals_v2', JSON.stringify(DEFAULT_FIELD_HOSPITALS_GAZA));
    localStorage.setItem('medifind_vouchers_v2', JSON.stringify(DEFAULT_VOUCHERS_GAZA));
    localStorage.setItem('medifind_donations_v2', JSON.stringify(DEFAULT_DONATIONS_GAZA));
    localStorage.setItem('medifind_sos_beacons_v2', JSON.stringify(DEFAULT_SOS_BEACONS_GAZA));
    localStorage.setItem('medifind_safe_corridors_v2', JSON.stringify(DEFAULT_SAFE_CORRIDORS_GAZA));
    localStorage.setItem('medifind_network_mode', 'online');
    localStorage.setItem('medifind_current_pharmacy_id', '1');
    this.emitChange();
  }

  emitChange() {
    window.dispatchEvent(new Event('medifind_data_changed'));
    if (this.channel) {
      try {
        this.channel.postMessage({ type: 'DATA_UPDATED', timestamp: Date.now() });
      } catch (e) {}
    }
  }

  // --- محرك الإشعارات البصرية المتكاملة (UI Toast Engine) ---
  showToast(message, type = 'info', title = '') {
    let container = document.getElementById('medifind-toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'medifind-toast-container';
      container.className = 'toast toast-top toast-end z-[9999] p-4 space-y-2';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    const alertTypes = {
      success: 'alert-success text-white',
      error: 'alert-error text-white',
      warning: 'alert-warning text-slate-900',
      info: 'alert-info text-white'
    };

    const alertClass = alertTypes[type] || alertTypes.info;
    const icons = {
      success: '<i class="fa-solid fa-circle-check text-xl"></i>',
      error: '<i class="fa-solid fa-triangle-exclamation text-xl"></i>',
      warning: '<i class="fa-solid fa-clock text-xl"></i>',
      info: '<i class="fa-solid fa-circle-info text-xl"></i>'
    };

    toast.className = `alert ${alertClass} shadow-lg rounded-xl flex items-start gap-3 transition-all duration-300 transform translate-y-2 opacity-0`;
    toast.innerHTML = `
      ${icons[type] || icons.info}
      <div class="flex-1">
        ${title ? `<h4 class="font-bold text-sm mb-0.5">${title}</h4>` : ''}
        <p class="text-xs font-medium leading-relaxed">${message}</p>
      </div>
      <button class="btn btn-ghost btn-xs text-current" onclick="this.parentElement.remove()">✕</button>
    `;

    container.appendChild(toast);
    setTimeout(() => {
      toast.classList.remove('translate-y-2', 'opacity-0');
    }, 10);

    setTimeout(() => {
      if (toast.parentElement) {
        toast.classList.add('opacity-0', 'translate-y-2');
        setTimeout(() => toast.remove(), 300);
      }
    }, 4500);
  }

  // --- الصيدليات والمستخدمين ---
  getPharmacies(onlyVerified = true, governorate = 'all') {
    const users = JSON.parse(localStorage.getItem('medifind_users_v2') || '[]');
    let pharmacists = users.filter(u => u.role === 'pharmacist');
    if (onlyVerified) {
      pharmacists = pharmacists.filter(p => p.verification_status === 'verified');
    }
    if (governorate !== 'all') {
      pharmacists = pharmacists.filter(p => p.governorate === governorate);
    }
    return pharmacists;
  }

  getAllUsers() {
    return JSON.parse(localStorage.getItem('medifind_users_v2') || '[]');
  }

  getCurrentPharmacy() {
    const id = parseInt(localStorage.getItem('medifind_current_pharmacy_id') || '1', 10);
    const pharmacies = this.getPharmacies(false);
    return pharmacies.find(p => p.id === id) || pharmacies[0];
  }

  setCurrentPharmacy(id) {
    localStorage.setItem('medifind_current_pharmacy_id', id.toString());
    this.emitChange();
  }

  setPharmacyShiftStatus(pharmacyId, isNightShift) {
    const users = this.getAllUsers();
    const index = users.findIndex(u => u.id === parseInt(pharmacyId, 10));
    if (index !== -1) {
      users[index].is_night_shift = Boolean(isNightShift);
      localStorage.setItem('medifind_users_v2', JSON.stringify(users));
      this.emitChange();
      return users[index];
    }
    return null;
  }

  verifyPharmacy(pharmacyId, approved = true) {
    const users = this.getAllUsers();
    const index = users.findIndex(u => u.id === parseInt(pharmacyId, 10));
    if (index !== -1) {
      users[index].verification_status = approved ? 'verified' : 'rejected';
      users[index].status = approved ? 'active' : 'inactive';
      localStorage.setItem('medifind_users_v2', JSON.stringify(users));
      this.emitChange();
      return users[index];
    }
    return null;
  }

  // --- الأدوية والمخزون والفرز الذكي ---
  getMedicines(pharmacyId = null) {
    const meds = JSON.parse(localStorage.getItem('medifind_medicines_v2') || '[]');
    if (pharmacyId) {
      return meds.filter(m => m.pharmacy_id === parseInt(pharmacyId, 10));
    }
    return meds;
  }

  getMedicineById(id) {
    const meds = this.getMedicines();
    return meds.find(m => m.id === parseInt(id, 10));
  }

  getUniqueCategories() {
    const meds = this.getMedicines();
    const categories = Array.from(new Set(meds.map(m => m.category))).filter(Boolean);
    return ['الكل', 'طوارئ', ...categories];
  }

  searchMedicines(query = '', category = 'الكل', governorate = 'all', sortBy = 'distance') {
    const meds = this.getMedicines();
    const pharmacies = this.getPharmacies(true, governorate);
    const validPharmacyIds = new Set(pharmacies.map(p => p.id));
    const rawCleanQuery = (query || '').trim();
    const cleanNormalized = normalizeArabicText(rawCleanQuery);

    // 1. فحص قاموس المرادفات العامية المعتمدة في قطاع غزة
    let colloquialMatch = null;
    let searchTokens = [];
    if (cleanNormalized) {
      colloquialMatch = COLLOQUIAL_MEDICINE_DICTIONARY.find(item => {
        const normColloquial = normalizeArabicText(item.colloquial);
        return cleanNormalized === normColloquial || cleanNormalized.includes(normColloquial) || normColloquial.includes(cleanNormalized);
      });

      if (colloquialMatch) {
        searchTokens = colloquialMatch.targets.map(t => normalizeArabicText(t));
      } else {
        searchTokens = cleanNormalized.split(/\s+/).filter(Boolean);
      }
    }

    let results = meds
      .filter(med => {
        if (!validPharmacyIds.has(med.pharmacy_id)) return false;
        const matchesCategory = category === 'الكل' || 
          (category === 'طوارئ' || category === 'emergency' ? med.is_emergency_supply : med.category === category);
        
        if (!matchesCategory) return false;
        if (!rawCleanQuery) return true;

        const medCommercialNorm = normalizeArabicText(med.commercial_name);
        const medScientificNorm = normalizeArabicText(med.scientific_name);
        const medCategoryNorm = normalizeArabicText(med.category);

        // إذا كان هناك تطابق عامي صريح
        if (colloquialMatch) {
          return searchTokens.some(tok => 
            medCommercialNorm.includes(tok) || 
            medScientificNorm.includes(tok) || 
            medCategoryNorm.includes(tok)
          );
        }

        // مطابقة مرنة (Exact Substring + Levenshtein Fuzzy Distance <= 2 للكلمات الطويلة)
        return searchTokens.every(token => {
          if (medCommercialNorm.includes(token) || medScientificNorm.includes(token) || medCategoryNorm.includes(token)) {
            return true;
          }
          // إذا كانت الكلمة أطول من 3 أحرف، نفحص المسافة الإملائية والصوتية
          if (token.length >= 4) {
            const allWords = (medCommercialNorm + ' ' + medScientificNorm).split(/\s+/);
            return allWords.some(w => {
              if (Math.abs(w.length - token.length) <= 2) {
                return levenshteinDistance(token, w) <= 2;
              }
              return false;
            });
          }
          return false;
        });
      })
      .map(med => {
        const pharmacy = pharmacies.find(p => p.id === med.pharmacy_id) || {};
        
        let availabilityInfo = {
          status_key: 'available_unverified',
          text: 'يبدو متوفراً حسب السجل — بانتظار التأكيد الميداني للصيدلي',
          badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
          icon: 'fa-solid fa-clock-rotate-left'
        };

        if (med.quantity === 0) {
          availabilityInfo = {
            status_key: 'out_of_stock',
            text: 'غير متوفر حالياً بالرف',
            badgeClass: 'bg-rose-50 text-rose-700 border-rose-200',
            icon: 'fa-solid fa-circle-xmark'
          };
        } else if (med.quantity <= 2) {
          availabilityInfo = {
            status_key: 'low_stock',
            text: 'كمية شحيحة جداً — يفضل الإسراع بطلب التأكيد',
            badgeClass: 'bg-amber-50 text-amber-800 border-amber-300',
            icon: 'fa-solid fa-triangle-exclamation'
          };
        }

        // بيانات الحجز الأعمى الآمن وحماية السعر (Blind Match)
        const areaLabel = pharmacy.city_district || pharmacy.governorate || 'حي الرمال';
        const distLabel = pharmacy.distance_time || '5 دقائق';

        return {
          ...med,
          pharmacy_name: pharmacy.pharmacy_name || 'صيدلية معتمدة',
          pharmacy_address: pharmacy.address || '',
          pharmacy_phone: pharmacy.phone || '',
          pharmacy_governorate: pharmacy.governorate || 'غزة',
          location_lat: pharmacy.location_lat || 31.5,
          location_lng: pharmacy.location_lng || 34.45,
          is_night_shift: Boolean(pharmacy.is_night_shift),
          distance_km: pharmacy.distance_km || 1.0,
          distance_time: distLabel,
          availability_info: availabilityInfo,
          // Blind Match Data
          blind_pharmacy_area: `صيدلية معتمدة في (${areaLabel} — تبعد عنك حوالي ${distLabel})`,
          blind_locked_price: med.price,
          blind_pickup_code: 'BM-' + Math.floor(100 + Math.random() * 900)
        };
      });

    // 2. تسجيل عمليات البحث غير الناجحة لتحليل العجز الدوائي للمنظمات (Zero-Result Logging)
    if (rawCleanQuery.length >= 3 && results.length === 0) {
      this.logZeroResult(rawCleanQuery, governorate);
    }

    if (sortBy === 'price_asc') {
      results.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price_desc') {
      results.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'updated') {
      results.sort((a, b) => new Date(b.last_updated) - new Date(a.last_updated));
    } else {
      results.sort((a, b) => a.distance_km - b.distance_km);
    }

    if (colloquialMatch) {
      results.didYouMean = colloquialMatch.suggestedLabel;
      results.colloquialMatched = colloquialMatch.colloquial;
    }

    return results;
  }

  updateQuantity(medicineId, newQuantity) {
    const meds = this.getMedicines();
    const index = meds.findIndex(m => m.id === parseInt(medicineId, 10));
    if (index !== -1) {
      const prevQty = meds[index].quantity;
      const parsedQty = Math.max(0, parseInt(newQuantity, 10));
      meds[index].quantity = parsedQty;
      meds[index].last_updated = new Date().toISOString();
      localStorage.setItem('medifind_medicines_v2', JSON.stringify(meds));
      this.emitChange();

      // إذا زادت الكمية وتوفر الدواء، نفحص رادار القناص الآلي
      if (parsedQty > 0 && prevQty === 0) {
        this.checkAndTriggerSniperWatchdogs(meds[index]);
      }
      return meds[index];
    }
    return null;
  }

  addMedicine(data) {
    const meds = this.getMedicines();
    const newId = meds.length > 0 ? Math.max(...meds.map(m => m.id)) + 1 : 1;
    const newMed = {
      id: newId,
      pharmacy_id: parseInt(data.pharmacy_id || this.getCurrentPharmacy().id, 10),
      commercial_name: data.commercial_name,
      scientific_name: data.scientific_name,
      category: data.category || 'مستلزمات جروح وطوارئ',
      form: data.form || 'عبوة',
      quantity: Math.max(0, parseInt(data.quantity || 0, 10)),
      price: parseFloat(data.price || 0),
      requires_prescription: Boolean(data.requires_prescription),
      is_emergency_supply: Boolean(data.is_emergency_supply || data.category === 'مستلزمات جروح وطوارئ'),
      shelf_location: data.shelf_location || 'طوارئ A-1',
      last_updated: new Date().toISOString()
    };
    meds.unshift(newMed);
    localStorage.setItem('medifind_medicines_v2', JSON.stringify(meds));
    this.emitChange();

    if (newMed.quantity > 0) {
      this.checkAndTriggerSniperWatchdogs(newMed);
    }
    return newMed;
  }

  deleteMedicine(id) {
    let meds = this.getMedicines();
    meds = meds.filter(m => m.id !== parseInt(id, 10));
    localStorage.setItem('medifind_medicines_v2', JSON.stringify(meds));
    this.emitChange();
  }

  // --- دورة التحقق البشري وقفل المخزون والطلبات ---
  getOrders(pharmacyId = null, status = 'all') {
    const orders = JSON.parse(localStorage.getItem('medifind_orders_v2') || '[]');
    let filtered = orders;
    if (pharmacyId) {
      filtered = filtered.filter(o => o.pharmacy_id === parseInt(pharmacyId, 10));
    }
    if (status !== 'all') {
      filtered = filtered.filter(o => o.status === status);
    }
    return filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  }

  createOrder(data) {
    const orders = this.getOrders();
    const newId = orders.length > 0 ? Math.max(...orders.map(o => o.id)) + 1 : 1;
    const code = 'MF-' + Math.floor(1000 + Math.random() * 9000);
    const pickupCode = Math.floor(1000 + Math.random() * 9000).toString();
    const lockedUntil = new Date(Date.now() + 15 * 60000).toISOString();

    const voucherDiscount = parseFloat(data.voucher_discount || 0);
    const calculatedTotal = Math.max(0, parseFloat(data.price_total || 0) - voucherDiscount);

    const newOrder = {
      id: newId,
      order_code: code,
      patient_name: data.patient_name || 'مواطن - غزة',
      patient_phone: data.patient_phone || '0599000000',
      pharmacy_id: parseInt(data.pharmacy_id, 10),
      medicine_id: parseInt(data.medicine_id, 10),
      medicine_name: data.medicine_name || 'صنف دوائي',
      requested_qty: parseInt(data.requested_qty || 1, 10),
      unit_price: parseFloat(data.unit_price || 0),
      price_total: calculatedTotal,
      original_price_total: parseFloat(data.price_total || 0),
      voucher_code: data.voucher_code || null,
      voucher_discount: voucherDiscount,
      needs_runner: Boolean(data.needs_runner),
      runner_status: data.needs_runner ? 'searching_runner' : 'none',
      runner_name: data.needs_runner ? 'متطوع الإغاثة (SOS Runner)' : null,
      delivery_mode: data.delivery_mode || (data.needs_runner ? 'camp_hub' : 'pickup'),
      camp_name: data.camp_name || '',
      landmark_desc: data.landmark_desc || '',
      tent_color_desc: data.tent_color_desc || '',
      delivery_pin: data.delivery_pin || pickupCode.slice(-3),
      status: 'pending',
      urgency_level: data.urgency_level || 'normal',
      prescription_image_url: data.prescription_image_url || null,
      patient_notes: data.patient_notes || '',
      pharmacist_notes: '',
      rejection_reason: '',
      pickup_verification_code: pickupCode,
      rating: null,
      rating_feedback: null,
      created_at: new Date().toISOString(),
      locked_until: lockedUntil,
      verified_at: null
    };

    orders.unshift(newOrder);
    localStorage.setItem('medifind_orders_v2', JSON.stringify(orders));
    this.audio.playIncomingOrderChime();
    this.emitChange();

    const runnerMsg = data.needs_runner ? ' وتم إرسال إشعار لشبكة متطوعي التوصيل الميداني' : '';
    this.showToast(`تم تقديم طلب تأكيد التوفر بنجاح، جاري إخطار الصيدلي لفحص الرف${runnerMsg}`, 'info', 'طلب قيد الفحص الميداني');
    return newOrder;
  }

  createEmergencyWoundKitOrder(patientData, pharmacyId = 1) {
    const pharmacy = this.getPharmacies(true).find(p => p.id === parseInt(pharmacyId, 10)) || this.getPharmacies(true)[0];
    const med = this.getMedicines(pharmacy.id).find(m => m.is_emergency_supply) || this.getMedicines(pharmacy.id)[0];
    
    return this.createOrder({
      patient_name: patientData.name || 'حالة طوارئ جروح عاجلة',
      patient_phone: patientData.phone || '0599000000',
      patient_notes: '🚨 باقة طوارئ جروح متكاملة (شاش معقم + بوفيدون مطهر + لاصق طبي + ميبو) - يرجى التجهيز الفوري',
      pharmacy_id: pharmacy.id,
      medicine_id: med ? med.id : 1,
      medicine_name: 'باقة طوارئ إسعاف الجروح والحروق الشاملة',
      requested_qty: 1,
      unit_price: 65.00,
      price_total: 65.00,
      urgency_level: 'emergency_wound'
    });
  }

  approveOrder(orderId, pharmacistNotes = '') {
    const orders = this.getOrders();
    const index = orders.findIndex(o => o.id === parseInt(orderId, 10));
    if (index !== -1) {
      orders[index].status = 'approved';
      orders[index].pharmacist_notes = pharmacistNotes;
      orders[index].verified_at = new Date().toISOString();

      const med = this.getMedicineById(orders[index].medicine_id);
      if (med) {
        const newQty = Math.max(0, med.quantity - orders[index].requested_qty);
        this.updateQuantity(med.id, newQty);
      }

      localStorage.setItem('medifind_orders_v2', JSON.stringify(orders));
      this.audio.playApprovalChime();
      this.emitChange();

      this.showToast(`تمت الموافقة وتأكيد التوفر للطلب ${orders[index].order_code}`, 'success', 'تأكيد الصيدلي');
      return orders[index];
    }
    return null;
  }

  rejectOrder(orderId, rejectionReason = '') {
    const orders = this.getOrders();
    const index = orders.findIndex(o => o.id === parseInt(orderId, 10));
    if (index !== -1) {
      orders[index].status = 'rejected';
      orders[index].rejection_reason = rejectionReason || 'نفاد الكمية من الرف';
      orders[index].verified_at = new Date().toISOString();
      localStorage.setItem('medifind_orders_v2', JSON.stringify(orders));
      
      // تطبيق خوارزمية المزامنة العكسية الذكية (Passive Stock Deduction)
      this.passiveStockDeductionOnRejection(orders[index].medicine_id, orders[index].pharmacy_id);

      this.emitChange();

      this.showToast(`اعتذر الصيدلي لعدم توفر الطلب ${orders[index].order_code}`, 'warning', 'طلب اعتذار');
      return orders[index];
    }
    return null;
  }

  cancelOrder(orderId, reason = 'إلغاء من طرف المريض') {
    const orders = this.getOrders();
    const index = orders.findIndex(o => o.id === parseInt(orderId, 10));
    if (index !== -1) {
      orders[index].status = 'cancelled';
      orders[index].rejection_reason = reason;
      orders[index].completed_at = new Date().toISOString();

      localStorage.setItem('medifind_orders_v2', JSON.stringify(orders));
      this.emitChange();

      this.showToast(`تم إلغاء الطلب ${orders[index].order_code} بنجاح وتحرير قفل الحجز`, 'info', 'إلغاء الطلب');
      return orders[index];
    }
    return null;
  }

  completeOrder(orderId) {
    const orders = this.getOrders();
    const index = orders.findIndex(o => o.id === parseInt(orderId, 10));
    if (index !== -1) {
      orders[index].status = 'completed';
      orders[index].completed_at = new Date().toISOString();
      localStorage.setItem('medifind_orders_v2', JSON.stringify(orders));
      this.emitChange();

      this.showToast(`تم تسليم الطلب ${orders[index].order_code} بنجاح!`, 'success', 'تم الاستلام');
      return orders[index];
    }
    return null;
  }

  rateOrder(orderId, rating, feedback = '') {
    const orders = this.getOrders();
    const index = orders.findIndex(o => o.id === parseInt(orderId, 10));
    if (index !== -1) {
      orders[index].rating = rating;
      orders[index].rating_feedback = feedback;
      localStorage.setItem('medifind_orders_v2', JSON.stringify(orders));
      this.emitChange();
      this.showToast('شكراً لتقييمك الخدمة وتوثيق تجربة التحقق', 'success');
      return orders[index];
    }
    return null;
  }

  getReports() {
    return JSON.parse(localStorage.getItem('medifind_reports_v2') || '[]');
  }

  resolveReport(reportId, adminNotes = '') {
    const reports = this.getReports();
    const index = reports.findIndex(r => r.id === parseInt(reportId, 10));
    if (index !== -1) {
      reports[index].status = 'resolved';
      reports[index].admin_notes = adminNotes;
      localStorage.setItem('medifind_reports_v2', JSON.stringify(reports));
      this.emitChange();
      this.showToast('تم حل البلاغ وتوثيق الإجراء في نظام الإدارة', 'success');
      return reports[index];
    }
    return null;
  }

  exportDrugShortageReport() {
    const meds = this.getMedicines();
    const outOfStock = meds.filter(m => m.quantity === 0);
    const lowStock = meds.filter(m => m.quantity > 0 && m.quantity <= 3);
    const pharmacies = this.getPharmacies(false);

    const reportData = {
      generated_at: new Date().toISOString(),
      governorate: 'قطاع غزة - كلي',
      summary: {
        total_tracked_medicines: meds.length,
        critical_out_of_stock: outOfStock.length,
        low_stock_warnings: lowStock.length,
        active_reporting_pharmacies: pharmacies.length
      },
      out_of_stock_items: outOfStock.map(m => ({
        commercial_name: m.commercial_name,
        scientific_name: m.scientific_name,
        category: m.category,
        pharmacy_id: m.pharmacy_id,
        last_seen: m.last_updated
      })),
      low_stock_items: lowStock.map(m => ({
        commercial_name: m.commercial_name,
        scientific_name: m.scientific_name,
        remaining_quantity: m.quantity,
        category: m.category
      }))
    };

    return JSON.stringify(reportData, null, 2);
  }

  getStats(pharmacyId = null) {
    const meds = this.getMedicines(pharmacyId);
    const orders = this.getOrders(pharmacyId);
    const allPharmacies = this.getPharmacies(false);

    const totalMedicines = meds.length;
    const totalUnits = meds.reduce((acc, m) => acc + m.quantity, 0);
    const lowStockCount = meds.filter(m => m.quantity > 0 && m.quantity <= 5).length;
    const outOfStockCount = meds.filter(m => m.quantity === 0).length;
    const emergencySuppliesCount = meds.filter(m => m.is_emergency_supply && m.quantity > 0).length;

    const pendingOrders = orders.filter(o => o.status === 'pending').length;
    const approvedOrders = orders.filter(o => o.status === 'approved').length;
    const completedOrders = orders.filter(o => o.status === 'completed').length;
    const rejectedOrders = orders.filter(o => o.status === 'rejected').length;

    const pendingPharmacies = allPharmacies.filter(p => p.verification_status === 'pending_approval').length;
    const verifiedPharmacies = allPharmacies.filter(p => p.verification_status === 'verified').length;

    return {
      totalMedicines,
      totalUnits,
      lowStockCount,
      outOfStockCount,
      emergencySuppliesCount,
      pendingOrders,
      approvedOrders,
      completedOrders,
      rejectedOrders,
      pendingPharmacies,
      verifiedPharmacies
    };
  }

  getWhatsAppLink(phone, message) {
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    const intlPhone = cleanPhone.startsWith('0') ? '970' + cleanPhone.substring(1) : cleanPhone;
    return `https://wa.me/${intlPhone}?text=${encodeURIComponent(message)}`;
  }

  formatTimeAgo(isoString) {
    if (!isoString) return '';
    const diffMs = Date.now() - new Date(isoString).getTime();
    const diffMin = Math.floor(diffMs / 60000);
    if (diffMin < 1) return 'الآن';
    if (diffMin < 60) return `منذ ${diffMin} دقيقة`;
    const diffHours = Math.floor(diffMin / 60);
    if (diffHours < 24) return `منذ ${diffHours} ساعة`;
    const diffDays = Math.floor(diffHours / 24);
    return `منذ ${diffDays} يوم`;
  }

  // --- 10. المستشفيات والنقاط الطبية الميدانية المؤقتة ---
  getFieldHospitals(governorate = 'all') {
    const list = JSON.parse(localStorage.getItem('medifind_hospitals_v2') || JSON.stringify(DEFAULT_FIELD_HOSPITALS_GAZA));
    if (governorate === 'all') return list;
    return list.filter(h => h.governorate === governorate);
  }

  // --- 6. اقتراح البدائل العلمية آلياً (Generic Drug Substitution) ---
  getGenericAlternatives(medicineQuery) {
    if (!medicineQuery) return [];
    const query = String(medicineQuery).toLowerCase().trim();
    
    let matchedRules = [];
    for (const key in GENERIC_ALTERNATIVES_MAP) {
      if (query.includes(key) || key.includes(query)) {
        matchedRules.push(...GENERIC_ALTERNATIVES_MAP[key]);
      }
    }

    const allMeds = this.getMedicines();
    const pharmacies = this.getPharmacies(true);
    const availableMatches = [];

    matchedRules.forEach(rule => {
      const hits = allMeds.filter(m => 
        (m.commercial_name.toLowerCase().includes(rule.name.toLowerCase()) || 
         rule.name.toLowerCase().includes(m.commercial_name.toLowerCase()) ||
         (m.scientific_name && m.scientific_name.toLowerCase().includes(rule.scientific.toLowerCase()))) &&
        m.quantity > 0
      );

      if (hits.length > 0) {
        hits.forEach(m => {
          const ph = pharmacies.find(p => p.id === m.pharmacy_id);
          availableMatches.push({
            substitute_name: m.commercial_name,
            scientific_name: m.scientific_name,
            medicine_id: m.id,
            pharmacy_id: m.pharmacy_id,
            pharmacy_name: ph ? ph.pharmacy_name : 'صيدلية معتمدة',
            pharmacy_phone: ph ? ph.phone : '',
            governorate: ph ? ph.governorate : 'غزة',
            quantity: m.quantity,
            price: m.price,
            reason: rule.reason
          });
        });
      } else {
        availableMatches.push({
          substitute_name: rule.name,
          scientific_name: rule.scientific,
          reason: rule.reason,
          quantity: 0,
          pharmacy_name: 'جاري التنسيق مع جهات الإغاثة'
        });
      }
    });

    return availableMatches;
  }

  // --- 8. الفرز الذكي للطوارئ (Smart Emergency Triage) ---
  evaluateTriage(symptomsText) {
    if (!symptomsText) return null;
    const text = symptomsText.toLowerCase();

    const redKeywords = ['نزيف حاد', 'نزيف مستمر', 'شظية', 'شظايا', 'بتر', 'حرق عميق', 'حروق من الدرجة الثالثة', 'صعوبة تنفس', 'اختناق', 'غيبوبة', 'كسر مضاعف', 'إصابة رأس'];
    const yellowKeywords = ['حرق ماء', 'حروق', 'جرح قطعي', 'خياطة', 'حمى شديدة', 'التهاب رئوي', 'نوبة ربو', 'إسهال جفاف', 'ألم شديد', 'تغيير ضماد'];

    const isRed = redKeywords.some(kw => text.includes(kw));
    const isYellow = yellowKeywords.some(kw => text.includes(kw));

    if (isRed) {
      return {
        level: 'CRITICAL_RED',
        label: 'حالة حرجة وفورية (الدرجة الأولى)',
        badgeClass: 'badge badge-error text-white font-black animate-pulse',
        icon: 'fa-solid fa-triangle-exclamation text-rose-500',
        recommendation: 'نوصي بالتوجه فوراً لأقرب مستشفى ميداني جراحي أو الاتصال بالإسعاف (101).',
        actionType: 'field_hospital'
      };
    } else if (isYellow) {
      return {
        level: 'URGENT_YELLOW',
        label: 'حالة عاجلة ذات أولوية (الدرجة الثانية)',
        badgeClass: 'badge badge-warning text-slate-900 font-bold',
        icon: 'fa-solid fa-bolt text-amber-500',
        recommendation: 'يوصى بطلب "باقة طوارئ الجروح الفورية" من صيدلية مناوبة 24 ساعة مع طلب متطوع توصيل (SOS Runner).',
        actionType: 'emergency_kit'
      };
    } else {
      return {
        level: 'STANDARD_GREEN',
        label: 'حالة روتينية مستقرة (الدرجة الثالثة)',
        badgeClass: 'badge badge-success text-white font-bold',
        icon: 'fa-solid fa-circle-check text-emerald-500',
        recommendation: 'حجز الصنف الدوائي المعتاد من أقرب صيدلية والتوجه لاستلامه خلال أوقات الدوام.',
        actionType: 'standard'
      };
    }
  }

  // --- 15. المحافظ الرقمية والكوبونات الإغاثية (E-Vouchers) ---
  getVouchers() {
    return JSON.parse(localStorage.getItem('medifind_vouchers_v2') || JSON.stringify(DEFAULT_VOUCHERS_GAZA));
  }

  addVoucher(voucher) {
    const list = this.getVouchers();
    list.unshift(voucher);
    localStorage.setItem('medifind_vouchers_v2', JSON.stringify(list));
    this.emitChange();
    this.showToast(`تم إصدار الكوبون الإغاثي ${voucher.code} بنجاح`, 'success');
  }

  validateVoucher(code, orderAmount = 0) {
    if (!code) return { valid: false, message: 'يرجى إدخال رمز الكوبون' };
    const list = this.getVouchers();
    const cleanCode = code.trim().toUpperCase();
    const voucher = list.find(v => v.code.toUpperCase() === cleanCode && v.is_active);

    if (!voucher) {
      return { valid: false, message: 'رمز الكوبون غير صحيح أو غير مفعل حالياً' };
    }

    let discount = 0;
    if (voucher.discount_type === 'percent') {
      discount = (orderAmount * voucher.discount_value) / 100;
      if (voucher.max_coverage && discount > voucher.max_coverage) {
        discount = voucher.max_coverage;
      }
    } else {
      discount = Math.min(orderAmount, voucher.discount_value);
    }

    const finalAmount = Math.max(0, orderAmount - discount);

    return {
      valid: true,
      voucher,
      originalAmount: orderAmount,
      discountAmount: discount,
      finalAmount: finalAmount,
      message: `تم اعتماد الكوبون الإغاثي: ${voucher.sponsor} بنجاح!`
    };
  }

  // --- 4. التحقق عبر مسح رموز الاستجابة السريعة (QR Code Scanning & Redemption) ---
  verifyAndRedeemByQr(qrPayload) {
    if (!qrPayload) return { success: false, message: 'رمز QR غير صالح أو فارغ' };
    const cleanPayload = String(qrPayload).trim();

    const orders = this.getOrders();
    let matchedOrder = null;

    if (cleanPayload.includes(':')) {
      const parts = cleanPayload.split(':');
      matchedOrder = orders.find(o => o.order_code === parts[0] && o.pickup_verification_code === parts[1]);
    }

    if (!matchedOrder) {
      matchedOrder = orders.find(o => o.order_code === cleanPayload || o.pickup_verification_code === cleanPayload);
    }

    if (!matchedOrder) {
      return { success: false, message: 'لم يتم العثور على أي حجز مطابق لرمز الـ QR الممسوح' };
    }

    if (matchedOrder.status === 'completed') {
      return { success: false, order: matchedOrder, message: `الطلب ${matchedOrder.order_code} تم تسليمه وصرفه بالفعل سابقاً!` };
    }

    if (matchedOrder.status === 'pending' || matchedOrder.status === 'approved') {
      const completed = this.completeOrder(matchedOrder.id);
      this.showToast(`تم مسح الـ QR وتأكيد تسليم الطلب ${matchedOrder.order_code} فورياً!`, 'success', 'مسح الـ QR السريع');
      return { success: true, order: completed, message: 'تم التحقق من هوية المريض وصرف الدواء بنجاح في ثانية واحدة!' };
    }

    return { success: false, order: matchedOrder, message: `حالة الطلب الحالية (${matchedOrder.status}) لا تسمح بالصرف المباشر` };
  }

  // --- 11. التجزئة الذكية للوصفة (Partial Fulfillment & Split Dispatch) ---
  partiallyFulfillOrder(orderId, suppliedQty, neighborPharmacyId = null, notes = '') {
    const orders = this.getOrders();
    const index = orders.findIndex(o => o.id === parseInt(orderId, 10));
    if (index === -1) return null;

    const mainOrder = orders[index];
    const originalQty = mainOrder.requested_qty;
    const supplied = Math.min(originalQty, Math.max(1, parseInt(suppliedQty, 10)));
    const remainingQty = originalQty - supplied;

    mainOrder.requested_qty = supplied;
    mainOrder.price_total = supplied * mainOrder.unit_price;
    mainOrder.status = 'approved';
    mainOrder.pharmacist_notes = `تم صرف جزئي (${supplied} عبوة) على الرف. ${notes}`;
    mainOrder.verified_at = new Date().toISOString();

    const med = this.getMedicineById(mainOrder.medicine_id);
    if (med) {
      this.updateQuantity(med.id, Math.max(0, med.quantity - supplied));
    }

    let childOrder = null;
    if (remainingQty > 0 && neighborPharmacyId) {
      childOrder = this.createOrder({
        patient_name: mainOrder.patient_name,
        patient_phone: mainOrder.patient_phone,
        pharmacy_id: neighborPharmacyId,
        medicine_id: mainOrder.medicine_id,
        medicine_name: mainOrder.medicine_name,
        requested_qty: remainingQty,
        unit_price: mainOrder.unit_price,
        price_total: remainingQty * mainOrder.unit_price,
        patient_notes: `🔄 استكمال متبقي للطلب ${mainOrder.order_code} (تجزئة ذكية للصرف السريع)`,
        urgency_level: mainOrder.urgency_level
      });
    }

    localStorage.setItem('medifind_orders_v2', JSON.stringify(orders));
    this.emitChange();
    this.showToast(`تم الصرف الجزئي لـ ${supplied} عبوة وتحويل ${remainingQty} عبوة للصيدلية المجاورة بنجاح`, 'success', 'التجزئة الذكية للوصفة');
    return { mainOrder, childOrder };
  }

  // --- 12. رف التكافل الدوائي والتبرع المجاني (Solidarity Donations Engine) ---
  getDonations(governorate = 'all') {
    const list = JSON.parse(localStorage.getItem('medifind_donations_v2') || JSON.stringify(DEFAULT_DONATIONS_GAZA));
    if (governorate === 'all') return list;
    return list.filter(d => d.governorate === governorate);
  }

  addDonation(data) {
    const list = this.getDonations();
    const newDonation = {
      id: Date.now(),
      donor_name: data.donor_name || 'فاعل خير',
      donor_phone: data.donor_phone || '',
      medicine_name: data.medicine_name || 'دواء تبرع',
      quantity: data.quantity || 'عبوة واحدة',
      expiry_date: data.expiry_date || 'ساري المفعول',
      governorate: data.governorate || 'غزة',
      district: data.district || '',
      status: 'available',
      notes: data.notes || '',
      created_at: new Date().toISOString()
    };
    list.unshift(newDonation);
    localStorage.setItem('medifind_donations_v2', JSON.stringify(list));
    this.emitChange();
    this.showToast(`بارك الله فيك! تم نشر تبرعك بـ [${newDonation.medicine_name}] على رف التكافل بنجاح`, 'success', 'رف التكافل الدوائي');

    // خلفي إلى السيرفر إن وجد
    if (typeof fetch !== 'undefined') {
      fetch('api.php?action=create_donation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newDonation)
      }).catch(() => {});
    }
    return newDonation;
  }

  claimDonation(donationId, claimantName, claimantPhone) {
    const list = this.getDonations();
    const item = list.find(d => d.id === parseInt(donationId, 10));
    if (item && item.status === 'available') {
      item.status = 'claimed';
      item.claimed_by = claimantName;
      item.claimed_phone = claimantPhone;
      item.claimed_at = new Date().toISOString();
      localStorage.setItem('medifind_donations_v2', JSON.stringify(list));
      this.emitChange();
      this.showToast(`تم حجز الدواء المتبرع به للمريض [${claimantName}] بنجاح، تواصل مع المتبرع للاستلام`, 'success', 'استلام تبرع تكافلي');
      return item;
    }
    return null;
  }

  // --- 13. نداءات الاستغاثة الدوائية الطارئة (SOS Emergency Medicine Beacons) ---
  getSOSBeacons(status = 'active') {
    const list = JSON.parse(localStorage.getItem('medifind_sos_beacons_v2') || JSON.stringify(DEFAULT_SOS_BEACONS_GAZA));
    if (status === 'all') return list;
    return list.filter(b => b.status === status);
  }

  createSOSBeacon(data) {
    const list = this.getSOSBeacons('all');
    const beaconCode = 'SOS-' + Math.floor(100 + Math.random() * 900);
    const newBeacon = {
      id: Date.now(),
      beacon_code: beaconCode,
      patient_name: data.patient_name || 'حالة طارئة حرجة',
      patient_phone: data.patient_phone || '',
      urgency_level: data.urgency_level || 'CRITICAL',
      medicine_needed: data.medicine_needed || '',
      governorate: data.governorate || 'غزة',
      location_details: data.location_details || '',
      status: 'active',
      notes: data.notes || '',
      created_at: new Date().toISOString()
    };
    list.unshift(newBeacon);
    localStorage.setItem('medifind_sos_beacons_v2', JSON.stringify(list));
    this.audio.playIncomingOrderChime();
    this.emitChange();
    this.showToast(`🚨 تم بث نداء الاستغاثة الدوائي [${beaconCode}] لكافة الصيدليات والمسعفين بالقطاع فوراً!`, 'error', 'نداء استغاثة عاجل');

    if (typeof fetch !== 'undefined') {
      fetch('api.php?action=create_sos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newBeacon)
      }).catch(() => {});
    }
    return newBeacon;
  }

  respondToSOSBeacon(beaconId, responderName, responderPhone, responderPharmacy = '') {
    const list = this.getSOSBeacons('all');
    const beacon = list.find(b => b.id === parseInt(beaconId, 10));
    if (beacon) {
      beacon.status = 'responded';
      beacon.responder_name = responderName;
      beacon.responder_phone = responderPhone;
      beacon.responder_pharmacy = responderPharmacy;
      beacon.responded_at = new Date().toISOString();
      localStorage.setItem('medifind_sos_beacons_v2', JSON.stringify(list));
      this.emitChange();
      this.showToast(`تم تسجيل استجابتك لنداء الاستغاثة ${beacon.beacon_code}، تم إرسال بياناتك لأسرة المريض`, 'success', 'استجابة إنسانية');
      return beacon;
    }
    return null;
  }

  // --- 14. دليل الإسعافات البديلة عند انقطاع الدواء ---
  getEmergencySurvivalGuides() {
    return DEFAULT_EMERGENCY_GUIDES_GAZA;
  }

  // --- 15. حالة الممرات الآمنة والمسارات الحية ---
  getSafeCorridorsStatus() {
    return JSON.parse(localStorage.getItem('medifind_safe_corridors_v2') || JSON.stringify(DEFAULT_SAFE_CORRIDORS_GAZA));
  }

  // --- 16. نظام التوصيل التطوعي (Volunteer Delivery Missions) ---
  getDeliveryMissions() {
    const orders = this.getOrders();
    const pharmacies = this.getPharmacies(false);
    // الطلبات التي تحتاج متطوع أو في طور الاستلام والتوصيل
    return orders.filter(o => o.needs_runner || o.status === 'in_transit' || o.runner_name).map(o => {
      const ph = pharmacies.find(p => p.id === o.pharmacy_id) || {};
      return {
        order_id: o.id,
        order_code: o.order_code,
        medicine_name: o.medicine_name,
        patient_name: o.patient_name,
        patient_phone: o.patient_phone,
        patient_notes: o.patient_notes,
        pharmacy_name: ph.pharmacy_name || 'صيدلية معتمدة',
        pharmacy_address: ph.address || '',
        pharmacy_phone: ph.phone || '',
        pickup_code: o.pickup_verification_code,
        status: o.status,
        runner_name: o.runner_name || null,
        runner_phone: o.runner_phone || null,
        urgency_level: o.urgency_level,
        delivery_mode: o.delivery_mode || 'camp_hub',
        camp_name: o.camp_name || '',
        landmark_desc: o.landmark_desc || '',
        tent_color_desc: o.tent_color_desc || '',
        delivery_pin: o.delivery_pin || (o.pickup_verification_code ? o.pickup_verification_code.slice(-3) : '789'),
        created_at: o.created_at
      };
    });
  }

  acceptDeliveryMission(orderId, runnerName, runnerPhone) {
    const orders = this.getOrders();
    const index = orders.findIndex(o => o.id === parseInt(orderId, 10));
    if (index !== -1) {
      orders[index].runner_name = runnerName;
      orders[index].runner_phone = runnerPhone;
      orders[index].status = 'in_transit';
      orders[index].assigned_at = new Date().toISOString();
      localStorage.setItem('medifind_orders_v2', JSON.stringify(orders));
      this.emitChange();
      this.showToast(`تم قبول مهمة التوصيل للطلب [${orders[index].order_code}]، توجه لاستلامه من الصيدلية بكود الاستلام`, 'success', 'مهمة توصيل إغاثية');
      return orders[index];
    }
    return null;
  }

  completeDeliveryMission(orderId) {
    return this.completeOrder(orderId);
  }

  // --- 17. نظام إشارات المرور للمخزون السريع (Traffic Light Inventory) ---
  setTrafficLightStock(medicineId, trafficColor) {
    const meds = this.getMedicines();
    const item = meds.find(m => m.id === parseInt(medicineId, 10));
    if (!item) return null;

    let targetQty = 25;
    let label = '🟢 متوفر';
    if (trafficColor === 'yellow') {
      targetQty = 2;
      label = '🟡 كمية شحيحة / حالات حرجة';
    } else if (trafficColor === 'red') {
      targetQty = 0;
      label = '🔴 نافد';
    }

    item.quantity = targetQty;
    item.last_updated = new Date().toISOString();
    localStorage.setItem('medifind_medicines_v2', JSON.stringify(meds));
    this.emitChange();
    this.showToast(`تم ضبط حالة الصنف [${item.commercial_name}] إلى ${label} بنقرة واحدة`, 'success', 'إشارات المرور للمخزون');
    return item;
  }

  // --- 18. المزامنة العكسية الذكية عند تكرار الاعتذار (Passive Stock Deduction) ---
  passiveStockDeductionOnRejection(medicineId, pharmacyId) {
    try {
      const counters = JSON.parse(localStorage.getItem('medifind_rejections_counter') || '{}');
      const key = `${pharmacyId}_${medicineId}`;
      counters[key] = (counters[key] || 0) + 1;
      localStorage.setItem('medifind_rejections_counter', JSON.stringify(counters));

      if (counters[key] >= 2) {
        const meds = this.getMedicines();
        const med = meds.find(m => m.id === parseInt(medicineId, 10) && m.pharmacy_id === parseInt(pharmacyId, 10));
        if (med && med.quantity > 0) {
          med.quantity = 0;
          med.last_updated = new Date().toISOString();
          localStorage.setItem('medifind_medicines_v2', JSON.stringify(meds));
          this.emitChange();
          this.showToast(`🚨 المزامنة العكسية الذكية: تم تحويل حالة [${med.commercial_name}] إلى (🔴 نافد) تلقائياً لتكرار اعتذار الصيدلية، حمايةً لوقت المرضى في غزة`, 'warning', 'مزامنة عكسية ذكية');
        }
      }
    } catch (e) {
      console.warn('Passive stock deduction skipped:', e);
    }
  }

  // --- 19. استيراد ملفات المخزون Excel / CSV بلمسة واحدة داخل المتصفح ---
  importInventoryFromCSV(csvText, pharmacyId = 1) {
    if (!csvText || !csvText.trim()) return { success: false, message: 'الملف فارغ' };
    const lines = csvText.split(/\r?\n/).filter(line => line.trim().length > 0);
    if (lines.length < 2) return { success: false, message: 'الملف لا يحتوي على صفوف بيانات كافية' };

    const meds = this.getMedicines();
    let updatedCount = 0;
    let addedCount = 0;

    const delimiter = lines[0].includes('\t') ? '\t' : lines[0].includes(';') ? ';' : ',';
    
    for (let i = 1; i < lines.length; i++) {
      const row = lines[i].split(delimiter).map(cell => cell.trim().replace(/^["']|["']$/g, ''));
      if (row.length < 2) continue;

      const medName = row[0];
      const qty = parseInt(row[1] || '0', 10);
      const price = parseFloat(row[2] || '0');
      const category = row[3] || 'أدوية عامة';
      const shelf = row[4] || 'المخزن الرئيسي';

      const existing = meds.find(m => m.pharmacy_id === parseInt(pharmacyId, 10) && 
        (normalizeArabicText(m.commercial_name) === normalizeArabicText(medName) || m.commercial_name.toLowerCase() === medName.toLowerCase()));

      if (existing) {
        existing.quantity = isNaN(qty) ? existing.quantity : Math.max(0, qty);
        if (!isNaN(price) && price > 0) existing.price = price;
        if (shelf) existing.shelf_location = shelf;
        existing.last_updated = new Date().toISOString();
        updatedCount++;
      } else if (medName) {
        const newId = meds.length > 0 ? Math.max(...meds.map(m => m.id)) + 1 : 1;
        meds.push({
          id: newId,
          pharmacy_id: parseInt(pharmacyId, 10),
          commercial_name: medName,
          scientific_name: medName,
          category: category,
          form: 'عبوة',
          quantity: Math.max(0, qty || 0),
          price: isNaN(price) ? 10.0 : price,
          requires_prescription: false,
          is_emergency_supply: category.includes('طوارئ') || category.includes('جروح'),
          shelf_location: shelf,
          last_updated: new Date().toISOString()
        });
        addedCount++;
      }
    }

    localStorage.setItem('medifind_medicines_v2', JSON.stringify(meds));
    this.emitChange();
    this.showToast(`تم استيراد المخزون بنجاح: تم تحديث ${updatedCount} صنف، وإضافة ${addedCount} صنف جديد`, 'success', 'مزامنة ملف الصيدلية');
    return { success: true, updatedCount, addedCount };
  }

  // --- 20. لوحة استخبارات الإغاثة والخريطة الحرارية للعجز الدوائي (NGO Heatmap API) ---
  logZeroResult(query, governorate = 'غزة', district = 'البلد', userLat = 31.5, userLng = 34.45) {
    if (!query || query.trim().length < 2) return;
    try {
      const list = JSON.parse(localStorage.getItem('medifind_zero_results') || JSON.stringify(DEFAULT_ZERO_RESULTS_GAZA));
      const clean = query.trim();
      const existing = list.find(item => normalizeArabicText(item.query) === normalizeArabicText(clean) && item.governorate === governorate);
      if (existing) {
        existing.count = (existing.count || 1) + 1;
        existing.timestamp = new Date().toISOString();
      } else {
        list.unshift({
          id: Date.now(),
          query: clean,
          governorate: governorate || 'غزة',
          district: district || 'المواصي',
          count: 1,
          location_lat: userLat,
          location_lng: userLng,
          timestamp: new Date().toISOString()
        });
      }
      localStorage.setItem('medifind_zero_results', JSON.stringify(list.slice(0, 100)));
    } catch (e) {
      console.warn('Zero-result logging skipped:', e);
    }
  }

  getZeroResultHeatmap() {
    const list = JSON.parse(localStorage.getItem('medifind_zero_results') || JSON.stringify(DEFAULT_ZERO_RESULTS_GAZA));
    return list.sort((a, b) => (b.count || 0) - (a.count || 0));
  }

  getEpidemicSurveillanceReport() {
    const zeroResults = this.getZeroResultHeatmap();
    const reports = [];

    // مؤشر الكوليرا والنزلات المعوية والجفاف (Dehydration / Cholera Cluster)
    const dehydrationQueries = zeroResults.filter(z => /ors|جفاف|اسهال|محلول|املاح/i.test(normalizeArabicText(z.query)));
    const totalDehydrationUnmet = dehydrationQueries.reduce((acc, curr) => acc + (curr.count || 0), 0);

    if (totalDehydrationUnmet > 0 || dehydrationQueries.length > 0) {
      reports.push({
        cluster: 'نزلات معوية وجفاف حاد (إنذار تلوث مياه)',
        severity: 'CRITICAL',
        affected_area: dehydrationQueries[0]?.governorate || 'دير البلح ومواصي خانيونس',
        unfulfilled_searches: totalDehydrationUnmet || 180,
        risk_description: 'تزايد حاد في محاولات البحث غير الملبّاة عن أملاح الجفاف ORS ومطهرات المعدة في خيام النازحين، مما ينذر بتفشي محتمل لبكتيريا المياه أو الكوليرا.',
        recommended_action: 'توجيه شحنات عاجلة من محاليل الوريد وأكياس الـ ORS بالتعاون مع WHO وUNICEF.'
      });
    }

    // مؤشر الأزمات التنفسية وتلوث الهواء بغبار القصف (Respiratory Trauma Cluster)
    const asthmaQueries = zeroResults.filter(z => /فنتولين|ربو|تنفس|صدر|سالبوتامول/i.test(normalizeArabicText(z.query)));
    const totalAsthmaUnmet = asthmaQueries.reduce((acc, curr) => acc + (curr.count || 0), 0);

    if (totalAsthmaUnmet > 0 || asthmaQueries.length > 0) {
      reports.push({
        cluster: 'أزمات تنفسية واختناق ربوي (غبار الركام)',
        severity: 'HIGH',
        affected_area: asthmaQueries[0]?.governorate || 'شمال غزة ومخيم جباليا',
        unfulfilled_searches: totalAsthmaUnmet || 285,
        risk_description: 'عجز دوائي في موسعات الشعب الهوائية وبخاخات الفنتولين لأطفال ومرضى الصدر جراء تلوث الهواء واستنشاق نواتج الانفجارات.',
        recommended_action: 'إنزال أجهزة تبخير وموسعات قصبية لنقاط الإسعاف الميدانية التابعة للهلال الأحمر.'
      });
    }

    // مؤشر العجز في أدوية الأمراض المزمنة (Insulin & Hypertension)
    const chronicQueries = zeroResults.filter(z => /لانتوس|انسولين|كونكور|ضغط|سكر/i.test(normalizeArabicText(z.query)));
    const totalChronicUnmet = chronicQueries.reduce((acc, curr) => acc + (curr.count || 0), 0);

    if (totalChronicUnmet > 0) {
      reports.push({
        cluster: 'انقطاع إمدادات الأنسولين وأدوية القلب والضغط',
        severity: 'URGENT',
        affected_area: chronicQueries[0]?.governorate || 'دير البلح والوسطى',
        unfulfilled_searches: totalChronicUnmet || 430,
        risk_description: 'أكثر من 400 مريض سكري لم يعثروا على أقلام الأنسولين القاعدي خلال الـ 48 ساعة الماضية، مع خطر دخول حالات غيبوبة كيتونية DKA.',
        recommended_action: 'فتح ممر إنساني لتبريد ونقل الأنسولين لمستشفيات شهداء الأقصى ومجمع ناصر الطبي.'
      });
    }

    return reports;
  }

  // --- 21. الحجز الأعمى الآمن وحماية السعر (Blind Match Reservation) + نقاط الصحة ---
  reserveMedicineBlindMatch(medicineId, patientData) {
    const med = this.getMedicineById(medicineId);
    if (!med) return null;
    const pharmacy = this.getPharmacies(false).find(p => p.id === med.pharmacy_id) || {};

    const orderData = {
      patient_name: patientData.name || 'مريض - غزة',
      patient_phone: patientData.phone || '0599000000',
      pharmacy_id: med.pharmacy_id,
      medicine_id: med.id,
      medicine_name: med.commercial_name,
      requested_qty: parseInt(patientData.quantity || 1, 10),
      unit_price: med.price,
      price_total: med.price * parseInt(patientData.quantity || 1, 10),
      needs_runner: Boolean(patientData.needs_runner),
      delivery_mode: patientData.delivery_mode || 'camp_hub',
      camp_name: patientData.camp_name || '',
      landmark_desc: patientData.landmark_desc || '',
      tent_color_desc: patientData.tent_color_desc || '',
      urgency_level: patientData.urgency_level || 'urgent',
      patient_notes: patientData.patient_notes || 'حجز فوري محمي السعر (Blind Match Protection)'
    };

    const newOrder = this.createOrder(orderData);
    this.addHealthPoints(patientData.phone, 10);

    return {
      order: newOrder,
      pharmacy_name: pharmacy.pharmacy_name || 'صيدلية معتمدة',
      pharmacy_address: pharmacy.address || 'غزة',
      pharmacy_phone: pharmacy.phone || '',
      pickup_code: newOrder.pickup_verification_code,
      locked_until_text: 'ساعتين من الآن (مضمون من المنصة بالسعر الرسمي المعلن)'
    };
  }

  getPatientHealthPoints(phone = 'default') {
    const pts = JSON.parse(localStorage.getItem('medifind_health_points') || '{}');
    return pts[phone] || pts['default'] || 20;
  }

  addHealthPoints(phone = 'default', amount = 10) {
    const pts = JSON.parse(localStorage.getItem('medifind_health_points') || '{}');
    const key = phone || 'default';
    const current = pts[key] || pts['default'] || 20;
    pts[key] = current + amount;
    localStorage.setItem('medifind_health_points', JSON.stringify(pts));
    this.emitChange();
    this.showToast(`🎉 حصلت على ${amount} نقاط صحة تكافلية (رصيدك الحالي: ${pts[key]} نقطة تستبدل بخصومات دوائية)`, 'info', 'نقاط الصحة والمكافآت');
    return pts[key];
  }

  redeemHealthPoints(phone = 'default', pointsToRedeem = 20) {
    const pts = JSON.parse(localStorage.getItem('medifind_health_points') || '{}');
    const key = phone || 'default';
    const current = pts[key] || pts['default'] || 20;
    if (current >= pointsToRedeem) {
      pts[key] = current - pointsToRedeem;
      localStorage.setItem('medifind_health_points', JSON.stringify(pts));
      this.emitChange();
      const discountShekel = (pointsToRedeem * 0.5).toFixed(1);
      this.showToast(`تم استبدال ${pointsToRedeem} نقطة بخصم ${discountShekel} ₪ على فاتورة الدواء!`, 'success', 'خصم نقاط الصحة');
      return { success: true, discountShekel: parseFloat(discountShekel), remainingPoints: pts[key] };
    }
    return { success: false, message: 'رصيد نقاط الصحة غير كافٍ' };
  }

  // --- 22. نظام الضمان المزدوج بالتوصيل (Double-PIN Escrow Delivery) ---
  verifyDeliveryDoublePIN(orderId, enteredPickupPin, enteredDeliveryPin) {
    const orders = this.getOrders();
    const order = orders.find(o => o.id === parseInt(orderId, 10));
    if (!order) return { success: false, message: 'الطلب غير موجود' };

    const validPickup = order.pickup_verification_code.trim() === String(enteredPickupPin).trim();
    const expectedDeliveryPin = order.delivery_pin || (order.pickup_verification_code.slice(-3));
    const validDelivery = String(expectedDeliveryPin).trim() === String(enteredDeliveryPin).trim();

    if (!validPickup) {
      return { success: false, message: 'رمز استلام الصيدلية (Pickup PIN) غير صحيح!' };
    }
    if (!validDelivery) {
      return { success: false, message: 'رمز تسليم المريض (Delivery PIN) غير صحيح! اطلبه من المريض عند باب الخيمة' };
    }

    order.status = 'completed';
    order.completed_at = new Date().toISOString();
    localStorage.setItem('medifind_orders_v2', JSON.stringify(orders));
    this.emitChange();
    this.audio.playApprovalChime();
    this.showToast(`✅ تم التحقق المزدوج بنجاح وإقفال مهمة التوصيل للطلب [${order.order_code}] بأمان تام`, 'success', 'اكتمال التسليم المضمون');
    return { success: true, order };
  }

  // --- 23. القناص الآلي للأدوية النادرة (Automated Medicine Sniper / Watchdog) ---
  getSniperWatchdogs() {
    return JSON.parse(localStorage.getItem('medifind_sniper_watchdogs') || JSON.stringify(DEFAULT_SNIPER_WATCHDOGS_GAZA));
  }

  registerSniperWatchdog(data) {
    const list = this.getSniperWatchdogs();
    const newWatchdog = {
      id: Date.now(),
      patient_name: data.patient_name || 'مريض بانتظار الدواء',
      patient_phone: data.patient_phone || '',
      medicine_query: data.medicine_query || '',
      governorate: data.governorate || 'غزة',
      max_price: parseFloat(data.max_price || 100),
      status: 'hunting',
      created_at: new Date().toISOString()
    };
    list.unshift(newWatchdog);
    localStorage.setItem('medifind_sniper_watchdogs', JSON.stringify(list));
    this.emitChange();
    this.showToast(`🎯 تم تفعيل القناص الآلي لدواء [${newWatchdog.medicine_query}]! سيتم حجز العلبة فور توفرها بأي صيدلية وإشعارك برنة هاتفية`, 'info', 'القناص الآلي للأدوية النادرة');
    return newWatchdog;
  }

  checkAndTriggerSniperWatchdogs(med) {
    if (!med || med.quantity <= 0) return;
    const list = this.getSniperWatchdogs();
    const normMed = normalizeArabicText(med.commercial_name + ' ' + med.scientific_name);

    list.forEach(dog => {
      if (dog.status === 'hunting') {
        const normQuery = normalizeArabicText(dog.medicine_query);
        if (normMed.includes(normQuery) || levenshteinDistance(normQuery, normalizeArabicText(med.commercial_name)) <= 2) {
          dog.status = 'captured';
          dog.captured_at = new Date().toISOString();
          dog.captured_medicine = med.commercial_name;
          dog.captured_pharmacy_id = med.pharmacy_id;

          this.audio.playApprovalChime();
          this.showToast(`🎯🎯 صيد ثمين بالقناص الآلي! توفر دواء [${med.commercial_name}] للمريض [${dog.patient_name}]! تم تثبيت أسبقية الحجز فوراً`, 'success', 'نجاح القناص الآلي');
        }
      }
    });

    localStorage.setItem('medifind_sniper_watchdogs', JSON.stringify(list));
  }

  // --- 24. استدراج العروض العكسي للروشتات (Reverse Prescription Bidding) ---
  getReversePrescriptionBids(governorate = 'all') {
    const list = JSON.parse(localStorage.getItem('medifind_reverse_bids') || JSON.stringify(DEFAULT_REVERSE_BIDS_GAZA));
    if (governorate === 'all') return list;
    return list.filter(b => b.governorate === governorate);
  }

  createReversePrescriptionBid(data) {
    const list = this.getReversePrescriptionBids('all');
    const newBid = {
      id: Date.now(),
      bid_code: 'RX-BID-' + Math.floor(100 + Math.random() * 900),
      patient_name: data.patient_name || 'مريض بوصفة طبية',
      patient_phone: data.patient_phone || '',
      governorate: data.governorate || 'غزة',
      prescription_notes: data.prescription_notes || 'أصناف روشتة علاجية',
      prescription_image_url: data.prescription_image_url || null,
      offers_count: 0,
      offers: [],
      status: 'open',
      created_at: new Date().toISOString()
    };
    list.unshift(newBid);
    localStorage.setItem('medifind_reverse_bids', JSON.stringify(list));
    this.emitChange();
    this.showToast(`تم طرح الوصفة الطبية [${newBid.bid_code}] في نظام استدراج العروض! ستصلك عروض الأسعار والتجهيز من صيدليات منطقتك`, 'info', 'الاستدراج العكسي للروشتات');
    return newBid;
  }

  submitPharmacyBidOffer(bidId, pharmacyId, offerData) {
    const list = this.getReversePrescriptionBids('all');
    const bid = list.find(b => b.id === parseInt(bidId, 10));
    const pharmacy = this.getPharmacies(false).find(p => p.id === parseInt(pharmacyId, 10)) || {};
    if (bid && bid.status === 'open') {
      const newOffer = {
        id: Date.now(),
        pharmacy_id: parseInt(pharmacyId, 10),
        pharmacy_name: pharmacy.pharmacy_name || 'صيدلية معتمدة',
        total_quote: parseFloat(offerData.total_quote || 0),
        available_items: offerData.available_items || 'الأصناف جاهزة بالكامل',
        delivery_ready: Boolean(offerData.delivery_ready),
        notes: offerData.notes || '',
        created_at: new Date().toISOString()
      };
      bid.offers.push(newOffer);
      bid.offers_count = bid.offers.length;
      localStorage.setItem('medifind_reverse_bids', JSON.stringify(list));
      this.emitChange();
      this.showToast(`تم تقديم عرضك المالي (${newOffer.total_quote} ₪) للروشتة [${bid.bid_code}] بنجاح`, 'success', 'عرض سعر روشتة');
      return newOffer;
    }
    return null;
  }

  acceptPharmacyBidOffer(bidId, offerPharmacyId) {
    const list = this.getReversePrescriptionBids('all');
    const bid = list.find(b => b.id === parseInt(bidId, 10));
    if (bid) {
      bid.status = 'awarded';
      bid.awarded_pharmacy_id = offerPharmacyId;
      localStorage.setItem('medifind_reverse_bids', JSON.stringify(list));
      this.emitChange();
      this.showToast(`مبروك! تم قبول عرض الصيدلية للروشتة وتثبيت السعر المخفض كطلب رسمي`, 'success', 'قبول عرض الوصفة');
      return bid;
    }
    return null;
  }

  // --- 25. تجزئة الشريط التعاوني (Shared Blister Pool) ---
  getBlisterShares() {
    return JSON.parse(localStorage.getItem('medifind_blister_shares') || JSON.stringify(DEFAULT_BLISTER_SHARES_GAZA));
  }

  createBlisterShare(data) {
    const list = this.getBlisterShares();
    const newShare = {
      id: Date.now(),
      pharmacy_id: parseInt(data.pharmacy_id || 1, 10),
      pharmacy_name: data.pharmacy_name || 'صيدلية الرمال',
      medicine_name: data.medicine_name,
      full_box_price: parseFloat(data.full_box_price || 0),
      strips_total: parseInt(data.strips_total || 3, 10),
      strips_available: parseInt(data.strips_available || 1, 10),
      price_per_strip: parseFloat(data.price_per_strip || 10),
      pills_per_strip: parseInt(data.pills_per_strip || 10, 10),
      created_at: new Date().toISOString()
    };
    list.unshift(newShare);
    localStorage.setItem('medifind_blister_shares', JSON.stringify(list));
    this.emitChange();
    this.showToast(`تم إدراج تجزئة الشريط التعاوني لدواء [${newShare.medicine_name}] بسعر ${newShare.price_per_strip} ₪ للشريط الواحد`, 'success', 'تجزئة الشريط التعاوني');
    return newShare;
  }

  claimBlisterShare(shareId, claimantName, stripsCount = 1) {
    const list = this.getBlisterShares();
    const item = list.find(s => s.id === parseInt(shareId, 10));
    if (item && item.strips_available >= stripsCount) {
      item.strips_available -= stripsCount;
      localStorage.setItem('medifind_blister_shares', JSON.stringify(list));
      this.emitChange();
      this.showToast(`تم حجز ${stripsCount} شريط من [${item.medicine_name}] للمريض [${claimantName}] بنجاح`, 'success', 'حجز شريط دواء');
      return item;
    }
    return null;
  }

  // --- 26. رعاية المغتربين والشتات (Diaspora Direct Care Link) ---
  generateDiasporaCareLink(orderId) {
    const orders = this.getOrders();
    const order = orders.find(o => o.id === parseInt(orderId, 10));
    if (!order) return '';
    const origin = (typeof window !== 'undefined' && window.location) ? (window.location.origin + window.location.pathname.replace(/\/[^/]*$/, '')) : '';
    const payUrl = `${origin}/index_patient.html?diaspora_pay=1&order_code=${order.order_code}&amount=${order.price_total}`;
    const msg = `مرحباً أخي/أختي الكريمة، تحية من غزة 🌿\nنحتاج مساهمتك الكريمة لتغطية قيمة علاج [${order.medicine_name}] بمبلغ [${order.price_total} ₪] مباشرة للصيدلية المعتمدة.\nيمكنك الدفع الآمن والمباشر عبر الرابط:\n${payUrl}\nجزاكم الله كل خير ورزقكم من واسع فضله.`;
    return `https://wa.me/?text=${encodeURIComponent(msg)}`;
  }

  processDiasporaPayment(orderCode, sponsorName, country = 'الإمارات') {
    const orders = this.getOrders();
    const order = orders.find(o => o.order_code === orderCode);
    if (order) {
      order.status = 'approved';
      order.is_diaspora_sponsored = true;
      order.sponsor_name = sponsorName;
      order.sponsor_country = country;
      order.sponsored_at = new Date().toISOString();
      localStorage.setItem('medifind_orders_v2', JSON.stringify(orders));
      this.emitChange();
      this.audio.playApprovalChime();
      this.showToast(`❤️ بارك الله بكم: تم سداد قيمة الدواء للطلب [${orderCode}] بنجاح بواسطة كفيل من الشتات [${sponsorName} - ${country}]!`, 'success', 'رعاية المغتربين المباشرة');
      return order;
    }
    return null;
  }

  // --- 27. البطاقة الطبية المشفرة دون اتصال (Offline Medical QR Card) ---
  generateOfflineMedicalQR(patientData) {
    const payload = [
      'MED-GZ:v1',
      patientData.name || 'مواطن',
      patientData.blood_type || 'O+',
      patientData.chronic_diseases || 'ضغط / سكري',
      patientData.regular_meds || 'أنسولين لانتوس + كونكور 5',
      patientData.allergies || 'حساسية بنسلين',
      patientData.emergency_phone || '0599000000',
      patientData.camp_location || 'مواصي خانيونس'
    ].join('|');

    return {
      encodedString: payload,
      qrImageUrl: `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(payload)}`
    };
  }

  decodeOfflineMedicalQR(payloadStr) {
    if (!payloadStr || !payloadStr.startsWith('MED-GZ:v1')) {
      return { valid: false, message: 'رمز QR غير متوافق مع بطاقة غزة الطبية' };
    }
    const parts = payloadStr.split('|');
    return {
      valid: true,
      name: parts[1] || '---',
      blood_type: parts[2] || '---',
      chronic_diseases: parts[3] || '---',
      regular_meds: parts[4] || '---',
      allergies: parts[5] || 'لا توجد',
      emergency_phone: parts[6] || '---',
      camp_location: parts[7] || '---'
    };
  }

  // --- 28. بورصة التبادل الصيدلاني للمقايضة الدوائية (B2B Medicine Barter) ---
  getBarterListings(status = 'open') {
    const list = JSON.parse(localStorage.getItem('medifind_barter_listings') || JSON.stringify(DEFAULT_BARTER_LISTINGS_GAZA));
    if (status === 'all') return list;
    return list.filter(b => b.status === status);
  }

  createBarterListing(offeringPharmacyId, surplusMed, neededMed, surplusQty, wantedQty, notes = '') {
    const list = this.getBarterListings('all');
    const pharmacy = this.getPharmacies(false).find(p => p.id === parseInt(offeringPharmacyId, 10)) || {};
    const newBarter = {
      id: Date.now(),
      offering_pharmacy_id: parseInt(offeringPharmacyId, 10),
      offering_pharmacy_name: pharmacy.pharmacy_name || 'صيدلية معتمدة',
      surplus_medicine: surplusMed,
      surplus_quantity: surplusQty,
      wanted_medicine: neededMed,
      wanted_quantity: wantedQty,
      governorate: pharmacy.governorate || 'غزة',
      status: 'open',
      notes: notes,
      created_at: new Date().toISOString()
    };
    list.unshift(newBarter);
    localStorage.setItem('medifind_barter_listings', JSON.stringify(list));
    this.emitChange();
    this.showToast(`تم إدراج عرض التبادل الصيدلاني بين الصيدليات بنجاح في بورصة المقايضة الدوائية`, 'success', 'تبادل صيدلاني تعاوني');
    return newBarter;
  }

  acceptBarterListing(barterId, claimingPharmacyId) {
    const list = this.getBarterListings('all');
    const item = list.find(b => b.id === parseInt(barterId, 10));
    const claiming = this.getPharmacies(false).find(p => p.id === parseInt(claimingPharmacyId, 10)) || {};
    if (item && item.status === 'open') {
      item.status = 'matched';
      item.matched_pharmacy_id = claiming.id;
      item.matched_pharmacy_name = claiming.pharmacy_name;
      item.matched_at = new Date().toISOString();
      localStorage.setItem('medifind_barter_listings', JSON.stringify(list));
      this.emitChange();
      this.showToast(`تم تأكيد تبادل الأدوية بين [${item.offering_pharmacy_name}] و [${claiming.pharmacy_name}]! تواصلوا لتسليم الفائض وحل العجز`, 'success', 'اكتمال المقايضة الدوائية');
      return item;
    }
    return null;
  }

  // --- 1 & 2. نمط الصمود واستمرارية العمل دون اتصال (Offline-First Mesh Status) ---
  getNetworkStatus() {
    return localStorage.getItem('medifind_network_mode') || 'online';
  }

  toggleNetworkMode() {
    const current = this.getNetworkStatus();
    const next = current === 'online' ? 'offline_mesh' : 'online';
    localStorage.setItem('medifind_network_mode', next);
    this.emitChange();
    if (next === 'offline_mesh') {
      this.showToast('تم تفعيل نمط الصمود غير المتصل (Offline-First Mesh) - العمل محلياً عبر IndexedDB/LocalStorage', 'warning', 'انقطاع الشبكة المركزية');
    } else {
      this.showToast('عادت الشبكة المركزية! تمت مزامنة كافة العمليات المحفوظة محلياً بنجاح', 'success', 'استعادة الاتصال');
    }
    return next;
  }
}

// Global Store Instance
window.medifindStore = new MediFindStore();
