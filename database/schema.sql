-- ==============================================================================
-- MediFind - Comprehensive SQLite Database Schema (v2.0)
-- منصة البحث عن الأدوية ومستلزمات الطوارئ - قطاع غزة
-- العملة: شيكل (₪) | الميزة المحورية: التحقق البشري (Human Verification)
-- ==============================================================================

PRAGMA foreign_keys = ON;

-- ------------------------------------------------------------------------------
-- 1. جدول المستخدمين والصيدليات (Users & Pharmacies Table)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    role TEXT NOT NULL CHECK(role IN ('admin', 'pharmacist', 'patient')),
    name TEXT NOT NULL,
    phone TEXT NOT NULL UNIQUE,
    email TEXT,
    password_hash TEXT NOT NULL,
    pharmacy_name TEXT,                     -- اسم الصيدلية (للصيادلة)
    license_number TEXT,                    -- رقم رخصة وزارة الصحة / نقابة الصيادلة
    license_document_url TEXT,              -- رابط وثيقة الترخيص الرسمية
    verification_status TEXT NOT NULL DEFAULT 'verified' CHECK(verification_status IN ('verified', 'pending_approval', 'rejected', 'suspended')),
    governorate TEXT NOT NULL DEFAULT 'غزة' CHECK(governorate IN ('شمال غزة', 'غزة', 'دير البلح', 'خانيونس', 'رفح')),
    city_district TEXT,                     -- الحي / الشارع (مثل: الرمال، تل السلطان، النصيرات)
    address TEXT,                           -- العنوان الكامل
    location_lat REAL,                      -- خط العرض الجغرافي
    location_lng REAL,                      -- خط الطول الجغرافي
    is_night_shift INTEGER NOT NULL DEFAULT 0, -- هل الصيدلية في مناوبة طوارئ ليلية
    operating_hours TEXT DEFAULT '24 ساعة / طوارئ',
    status TEXT NOT NULL DEFAULT 'active' CHECK(status IN ('active', 'inactive', 'suspended', 'pending')),
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ------------------------------------------------------------------------------
-- 2. جدول الأدوية والمستلزمات الطبية (Medicines & Medical Supplies Table)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS medicines (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    pharmacy_id INTEGER NOT NULL,
    commercial_name TEXT NOT NULL,             -- الاسم التجاري (مثل: ميبو، بوفيدون، أكامول)
    scientific_name TEXT NOT NULL,             -- الاسم العلمي / المادة الفعالة
    category TEXT NOT NULL,                    -- الفئة (مستلزمات جروح وطوارئ، مسكنات، مضادات حيوية، إلخ)
    form TEXT DEFAULT 'عبوة',                  -- الشكل الصيدلاني (مرهم، شاش، شراب، أقراص)
    quantity INTEGER NOT NULL DEFAULT 0 CHECK(quantity >= 0), -- الكمية المتوفرة
    price REAL NOT NULL DEFAULT 0.0 CHECK(price >= 0),        -- السعر بالشيكل (₪)
    requires_prescription INTEGER NOT NULL DEFAULT 0,         -- هل يتطلب وصفة طبية أصلية
    is_emergency_supply INTEGER NOT NULL DEFAULT 0,           -- تمييز خاص لمستلزمات الحروق والجروح العاجلة
    expiry_date DATE,                          -- تاريخ انتهاء الصلاحية
    shelf_location TEXT,                       -- موقع الصنف في الصيدلية (مثل: رف الطوارئ A-2)
    last_updated DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (pharmacy_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ------------------------------------------------------------------------------
-- 3. جدول طلبات الحجز والتحقق البشري (Orders & Human Verification Table)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_code TEXT UNIQUE NOT NULL,           -- كود الطلب (مثل: MF-9102)
    patient_id INTEGER NOT NULL,
    pharmacy_id INTEGER NOT NULL,
    medicine_id INTEGER NOT NULL,
    requested_qty INTEGER NOT NULL DEFAULT 1 CHECK(requested_qty > 0),
    unit_price REAL NOT NULL DEFAULT 0.0,
    total_price REAL NOT NULL DEFAULT 0.0,
    status TEXT NOT NULL DEFAULT 'pending' CHECK(status IN ('pending', 'approved', 'rejected', 'ready_for_pickup', 'completed', 'cancelled')),
    urgency_level TEXT NOT NULL DEFAULT 'normal' CHECK(urgency_level IN ('emergency_wound', 'urgent', 'normal')),
    prescription_image_url TEXT,               -- رابط صورة الوصفة الطبية المرفقة
    patient_name TEXT NOT NULL,
    patient_phone TEXT NOT NULL,
    patient_notes TEXT,
    pharmacist_notes TEXT,                     -- ملاحظات وتوجيهات الصيدلي عند القبول
    rejection_reason TEXT,                     -- سبب الرفض الموثق
    pickup_verification_code TEXT,             -- رمز أمان سري لتسليم المريض
    rating INTEGER CHECK(rating BETWEEN 1 AND 5), -- تقييم المريض للخدمة
    rating_feedback TEXT,                      -- تعليق المريض بعد الاستلام
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    verified_at DATETIME,                      -- وقت التحقق البشري
    ready_at DATETIME,                         -- وقت اكتمال تجهيز الصنف
    completed_at DATETIME,                     -- وقت التسليم النهائي
    FOREIGN KEY (patient_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (pharmacy_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (medicine_id) REFERENCES medicines(id) ON DELETE CASCADE
);

-- ------------------------------------------------------------------------------
-- 4. جدول البلاغات وسجل تدقيق الإدارة (Complaints & Admin Audit Logs)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS complaints_and_reports (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    reporter_id INTEGER,
    pharmacy_id INTEGER,
    order_id INTEGER,
    report_type TEXT NOT NULL CHECK(report_type IN ('price_gouging', 'incorrect_stock', 'refusal_to_dispense', 'other')),
    details TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'open' CHECK(status IN ('open', 'under_investigation', 'resolved', 'dismissed')),
    admin_notes TEXT,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (pharmacy_id) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS admin_audit_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    admin_id INTEGER NOT NULL,
    action_type TEXT NOT NULL,                 -- نوع الإجراء (قبول صيدلية، إيقاف حساب، حل بلاغ)
    target_entity TEXT NOT NULL,
    entity_id INTEGER,
    details TEXT,
    ip_address TEXT,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS donations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    donor_name TEXT NOT NULL,
    donor_phone TEXT NOT NULL,
    medicine_name TEXT NOT NULL,
    quantity TEXT NOT NULL,
    expiry_date TEXT,
    governorate TEXT NOT NULL,
    district TEXT,
    status TEXT DEFAULT 'available',
    claimed_by TEXT,
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS sos_beacons (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    beacon_code TEXT UNIQUE,
    patient_name TEXT NOT NULL,
    patient_phone TEXT NOT NULL,
    urgency_level TEXT DEFAULT 'CRITICAL',
    medicine_needed TEXT NOT NULL,
    governorate TEXT NOT NULL,
    location_details TEXT,
    status TEXT DEFAULT 'active',
    responder_name TEXT,
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS delivery_missions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id INTEGER,
    runner_name TEXT,
    runner_phone TEXT,
    status TEXT DEFAULT 'available',
    pickup_address TEXT,
    dropoff_address TEXT,
    route_safety_status TEXT DEFAULT 'cautious',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ------------------------------------------------------------------------------
-- 5. الفهارس لتسريع استعلامات البحث والتقارير
-- ------------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_users_role_status ON users(role, status, verification_status);
CREATE INDEX IF NOT EXISTS idx_users_governorate ON users(governorate);
CREATE INDEX IF NOT EXISTS idx_medicines_search ON medicines(commercial_name, scientific_name);
CREATE INDEX IF NOT EXISTS idx_medicines_category ON medicines(category);
CREATE INDEX IF NOT EXISTS idx_medicines_emergency ON medicines(is_emergency_supply);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_pharmacy ON orders(pharmacy_id);
CREATE INDEX IF NOT EXISTS idx_orders_urgency ON orders(urgency_level);
