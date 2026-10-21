-- ==============================================================================
-- MediFind - Seed Data (v2.0) - محافظات قطاع غزة
-- العملة: شيكل (₪)
-- ==============================================================================

-- 1. إضافة صيدليات معتمدة وصيدليات بانتظار موافقة الإدارة في محافظات قطاع غزة
INSERT INTO users (id, role, name, phone, email, password_hash, pharmacy_name, license_number, verification_status, governorate, city_district, address, location_lat, location_lng, is_night_shift, operating_hours, status) VALUES
-- صيدليات معتمدة (Verified)
(1, 'pharmacist', 'د. إبراهيم النجار', '0599112233', 'alnajar@medifind.ps', '$2y$10$e8..mock..', 'صيدلية الرمال المركزية', 'GZ-10293', 'verified', 'غزة', 'حي الرمال', 'غزة - شارع عمر المختار - مقابل بنك فلسطين', 31.5180, 34.4480, 1, '24 ساعة / طوارئ', 'active'),
(2, 'pharmacist', 'د. مريم الأغا', '0599223344', 'alagha@medifind.ps', '$2y$10$e8..mock..', 'صيدلية خانيونس الكبرى', 'GZ-10482', 'verified', 'خانيونس', 'وسط البلد', 'خانيونس - شارع جلال - قرب دوار أبو حميد', 31.3450, 34.3030, 0, '8:00 ص - 11:00 م', 'active'),
(3, 'pharmacist', 'د. يوسف بركة', '0569334455', 'baraka@medifind.ps', '$2y$10$e8..mock..', 'صيدلية دير البلح للطوارئ', 'GZ-10931', 'verified', 'دير البلح', 'شارع النخيل', 'دير البلح - شارع النخيل - بالقرب من مستشفى شهداء الأقصى', 31.4180, 34.3510, 1, '24 ساعة / طوارئ', 'active'),
(4, 'pharmacist', 'د. أحمد قديح', '0599778899', 'qdeih@medifind.ps', '$2y$10$e8..mock..', 'صيدلية تل السلطان الحديثة', 'GZ-10777', 'verified', 'رفح', 'تل السلطان', 'رفح - حي تل السلطان - الشارع الرئيسي', 31.2950, 34.2500, 0, '8:00 ص - 10:00 م', 'active'),
(5, 'pharmacist', 'د. هاني الكحلوت', '0599445566', 'kahlout@medifind.ps', '$2y$10$e8..mock..', 'صيدلية جباليا والإسعاف', 'GZ-10115', 'verified', 'شمال غزة', 'مخيم جباليا', 'شمال غزة - جباليا البلد - شارع الهوجا', 31.5380, 34.4980, 1, '24 ساعة / طوارئ', 'active'),

-- صيدليات جديدة بانتظار مراجعة وتدقيق الإدارة (Pending Approval)
(6, 'pharmacist', 'د. سامح رضوان', '0598113355', 'radwan@medifind.ps', '$2y$10$e8..mock..', 'صيدلية النصيرات الجديدة', 'GZ-11045', 'pending_approval', 'دير البلح', 'مخيم النصيرات', 'النصيرات - السوق المركزي - شارع القسام', 31.4480, 34.3900, 0, '9:00 ص - 9:00 م', 'pending'),
(7, 'pharmacist', 'د. ريم الشيخ', '0567224466', 'sheikh@medifind.ps', '$2y$10$e8..mock..', 'صيدلية الصبرة والشفاء', 'GZ-11088', 'pending_approval', 'غزة', 'حي الصبرة', 'غزة - شارع الثلاثيني - تقاطع المغربي', 31.5050, 34.4550, 0, '8:00 ص - 10:00 م', 'pending'),

-- حسابات المرضى والإدارة
(8, 'patient', 'محمود خليل العبد', '0598881122', 'mahmoud@gmail.com', '$2y$10$e8..mock..', NULL, NULL, 'verified', 'غزة', 'حي الرمال', 'غزة - شارع الوحدة', 31.5200, 34.4510, 0, NULL, 'active'),
(9, 'patient', 'فاطمة أحمد عاشور', '0567772233', 'fatima@gmail.com', '$2y$10$e8..mock..', NULL, NULL, 'verified', 'خانيونس', 'حي الأمل', 'خانيونس - حي الأمل - الشارع العام', 31.3520, 34.3120, 0, NULL, 'active'),
(10, 'admin', 'د. كمال الشرافي (مشرف المنصة)', '0599000000', 'admin@medifind.ps', '$2y$10$e8..mock..', NULL, 'ADM-001', 'verified', 'غزة', 'الرمال', 'غزة - المقر الإداري المركزي', 31.5150, 34.4450, 0, '24/7', 'active');

-- 2. بيانات الأدوية والمستلزمات الطبية مع التركيز على مستلزمات الجروح والطوارئ
INSERT INTO medicines (id, pharmacy_id, commercial_name, scientific_name, category, form, quantity, price, requires_prescription, is_emergency_supply, shelf_location, last_updated) VALUES
-- صيدلية الرمال المركزية (pharmacy_id = 1)
(1, 1, 'شاش طبي معقم 10×10 (Sterile Gauze)', 'Sterile Hydrophilic Gauze', 'مستلزمات جروح وطوارئ', 'علبة 10 قطع', 28, 15.00, 0, 1, 'طوارئ - رف E-1', datetime('now', '-10 minutes')),
(2, 1, 'محلول مطهر بوفيدون أيودين 10%', 'Povidone Iodine 10% Antiseptic', 'مستلزمات جروح وطوارئ', 'محلول 100 مل', 15, 20.00, 0, 1, 'طوارئ - رف E-2', datetime('now', '-30 minutes')),
(3, 1, 'مرهم ميبو للحروق والجروح (MEBO)', 'Beta-sitosterol Natural Ointment', 'مستلزمات جروح وطوارئ', 'مرهم 30 جم', 6, 45.00, 0, 1, 'طوارئ - رف E-3', datetime('now', '-5 minutes')),
(4, 1, 'لاصق جروح طبي مضاد للماء (Waterproof)', 'Hypoallergenic Waterproof Tape', 'مستلزمات جروح وطوارئ', 'علبة 20 حبة', 35, 18.00, 0, 1, 'طوارئ - رف E-1', datetime('now', '-2 hours')),
(5, 1, 'أكامول إكسترا 500 ملجم (Acamol Extra)', 'Paracetamol 500mg + Caffeine', 'مسكنات وخافضات حرارة', 'شريط 20 قرص', 50, 12.00, 0, 0, 'أدوية عامة - رف B-4', datetime('now', '-40 minutes')),
(6, 1, 'أوجمنتين 1 جم (Augmentin)', 'Amoxicillin + Clavulanate 1g', 'مضادات حيوية', 'علبة 14 قرص', 4, 65.00, 1, 0, 'مضادات - رف Rx-1', datetime('now', '-1 hour')),

-- صيدلية خانيونس الكبرى (pharmacy_id = 2)
(7, 2, 'شاش فازلين معقم للحرائق (Paraffin)', 'Paraffin Gauze Dressing', 'مستلزمات جروح وطوارئ', 'علبة 10 قطع', 12, 25.00, 0, 1, 'طوارئ خانيونس 1', datetime('now', '-15 minutes')),
(8, 2, 'محلول ملحي معقم (Saline 0.9%)', 'Normal Saline Solution 0.9%', 'مستلزمات جروح وطوارئ', 'محلول غسيل 500 مل', 20, 10.00, 0, 1, 'طوارئ خانيونس 2', datetime('now', '-25 minutes')),
(9, 2, 'مرهم ميبو للحروق والجروح (MEBO)', 'Beta-sitosterol Natural Ointment', 'مستلزمات جروح وطوارئ', 'مرهم 30 جم', 2, 45.00, 0, 1, 'طوارئ خانيونس 1', datetime('now', '-50 minutes')),
(10, 2, 'رباط ضاغط طبي مطاطي 7.5 سم', 'Elastic Crepe Bandage', 'مستلزمات جروح وطوارئ', 'لفة واحدة', 40, 8.00, 0, 1, 'طوارئ خانيونس 3', datetime('now', '-3 hours')),
(11, 2, 'ديكلوفين مسكن 50 ملجم (Diclofin)', 'Diclofenac Sodium 50mg', 'مسكنات وخافضات حرارة', 'علبة 20 قرص', 22, 14.00, 0, 0, 'مسكنات - رف D', datetime('now', '-1 hour')),

-- صيدلية دير البلح للطوارئ (pharmacy_id = 3)
(12, 3, 'بخاخ مطهر للجروح أوكتينيسيبت (Octenisept)', 'Octenidine HCl Antiseptic Spray', 'مستلزمات جروح وطوارئ', 'بخاخ 50 مل', 8, 38.00, 0, 1, 'طوارئ الوسطى A', datetime('now', '-12 minutes')),
(13, 3, 'شاش طبي معقم 10×10 (Sterile Gauze)', 'Sterile Hydrophilic Gauze', 'مستلزمات جروح وطوارئ', 'علبة 10 قطع', 45, 15.00, 0, 1, 'طوارئ الوسطى A', datetime('now', '-8 minutes')),
(14, 3, 'محلول مطهر بوفيدون أيودين 10%', 'Povidone Iodine 10%', 'مستلزمات جروح وطوارئ', 'محلول 100 مل', 0, 20.00, 0, 1, 'طوارئ الوسطى B', datetime('now', '-4 hours')), -- نافد لاختبار التنبيهات
(15, 3, 'أكامول شراب للأطفال 120 ملجم', 'Paracetamol Pediatric Syrup', 'أدوية أطفال ومسكنات', 'شراب 100 مل', 18, 10.00, 0, 0, 'أطفال - رف C-2', datetime('now', '-20 minutes')),

-- صيدلية تل السلطان - رفح (pharmacy_id = 4)
(16, 4, 'مرهم ميبو للحروق والجروح (MEBO)', 'Beta-sitosterol Natural Ointment', 'مستلزمات جروح وطوارئ', 'مرهم 30 جم', 9, 45.00, 0, 1, 'طوارئ رفح 1', datetime('now', '-35 minutes')),
(17, 4, 'شاش طبي معقم 10×10 (Sterile Gauze)', 'Sterile Hydrophilic Gauze', 'مستلزمات جروح وطوارئ', 'علبة 10 قطع', 16, 15.00, 0, 1, 'طوارئ رفح 2', datetime('now', '-15 minutes')),

-- صيدلية جباليا والإسعاف - شمال غزة (pharmacy_id = 5)
(18, 5, 'شاش فازلين معقم للحرائق (Paraffin)', 'Paraffin Gauze Dressing', 'مستلزمات جروح وطوارئ', 'علبة 10 قطع', 14, 25.00, 0, 1, 'طوارئ الشمال 1', datetime('now', '-18 minutes')),
(19, 5, 'محلول مطهر بوفيدون أيودين 10%', 'Povidone Iodine 10%', 'مستلزمات جروح وطوارئ', 'محلول 100 مل', 12, 20.00, 0, 1, 'طوارئ الشمال 1', datetime('now', '-10 minutes')),
(20, 5, 'حقن مسكنة فولتارين 75 ملجم (Voltaren)', 'Diclofenac Sodium 75mg Amp', 'مسكنات وخافضات حرارة', 'علبة 5 أمبولات', 8, 30.00, 1, 1, 'أمبولات - ثلاجة الطوارئ', datetime('now', '-30 minutes')),
-- أدوية الأمراض المزمنة وألبان الأطفال (أولوية غزة الإنسانية الراهنة)
(21, 1, 'أنسولين لانتوس قلم معبأ مسبقاً (Lantus SoloStar)', 'Insulin Glargine 100 U/ml', 'أدوية السكري والأنسولين', 'قلم أنسولين 3 مل', 8, 55.00, 1, 1, 'ثلاجة الأنسولين E-0', datetime('now', '-5 minutes')),
(22, 1, 'حليب أطفال نان 1 مدعم بالحديد (NAN 1)', 'Infant Formula Milk Stage 1', 'ألبان وأغذية أطفال', 'علبة 400 جم', 14, 32.00, 0, 1, 'قسم الأطفال رف B-1', datetime('now', '-15 minutes')),
(23, 2, 'أنسولين نوفورابيد سريع المفعول (NovoRapid FlexPen)', 'Insulin Aspart 100 U/ml', 'أدوية السكري والأنسولين', 'قلم 3 مل', 5, 52.00, 1, 1, 'ثلاجة خانيونس 1', datetime('now', '-12 minutes')),
(24, 2, 'حليب بليميل بلس 2 للرضع (Blemil Plus 2)', 'Follow-up Formula Stage 2', 'ألبان وأغذية أطفال', 'علبة 400 جم', 9, 34.00, 0, 1, 'أغذية خانيونس رف C', datetime('now', '-25 minutes')),
(25, 3, 'بخاخ فنتولين موسع للشعب (Ventolin Inhaler)', 'Salbutamol 100 mcg/dose', 'أدوية الجهاز التنفسي والربو', 'بخاخ 200 جرعة', 11, 22.00, 0, 1, 'طوارئ تنفسي رف R-2', datetime('now', '-8 minutes')),
(26, 3, 'أكياس محلول معالجة الجفاف الفموي (ORS Hydration)', 'Oral Rehydration Salts WHO Formula', 'مستلزمات جروح وطوارئ', 'علبة 10 أكياس', 60, 8.00, 0, 1, 'طوارئ الجفاف رف E-5', datetime('now', '-4 minutes')),
(27, 4, 'حبوب كونكور 5 ملجم لضغط الدم والقلب (Concor)', 'Bisoprolol Fumarate 5mg', 'أدوية القلب وضغط الدم', 'شريط 30 قرص', 16, 28.00, 1, 0, 'رف القلب Rx-4', datetime('now', '-30 minutes')),
(28, 5, 'أقراص ميتفورمين 850 ملجم (Glucophage)', 'Metformin HCl 850mg', 'أدوية السكري والأنسولين', 'علبة 50 قرص', 25, 14.00, 0, 0, 'رف السكري B-3', datetime('now', '-45 minutes'));

-- 3. طلبات حجز تجريبية تدعم سيناريوهات التحقق البشري ورفع الروشتات
INSERT INTO orders (id, order_code, patient_id, pharmacy_id, medicine_id, requested_qty, unit_price, total_price, status, urgency_level, prescription_image_url, patient_name, patient_phone, patient_notes, pharmacist_notes, rejection_reason, pickup_verification_code, created_at, verified_at) VALUES
(1, 'MF-9101', 8, 1, 3, 2, 45.00, 90.00, 'pending', 'emergency_wound', 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&q=80', 'محمود خليل العبد', '0598881122', 'حالة حرق منزلي طارئة بالماء المغلي في حي الرمال، يرجى تجهيز الميبو بسرعة', NULL, NULL, '7742', datetime('now', '-4 minutes'), NULL),
(2, 'MF-9102', 9, 1, 1, 3, 15.00, 45.00, 'pending', 'urgent', NULL, 'فاطمة أحمد عاشور', '0567772233', 'تغيير ضماد جرح لمريض طريح الفراش بعد عملية جراحية', NULL, NULL, '9108', datetime('now', '-11 minutes'), NULL),
(3, 'MF-9098', 8, 1, 5, 1, 12.00, 12.00, 'approved', 'normal', NULL, 'سامي قاسم رضوان', '0599123456', 'صداع نصفي متكرر', 'تم حجز العبوة في الرف B-4، صالحة للاستلام خلال ساعتين بالرمز 4410', NULL, '4410', datetime('now', '-50 minutes'), datetime('now', '-42 minutes')),
(4, 'MF-9075', 9, 1, 6, 1, 65.00, 65.00, 'rejected', 'normal', NULL, 'خالد مصطفى', '0599554433', 'طلب أوجمنتين لالتهاب حاد بالحلق', NULL, 'الصنف يتطلب وصفة طبية أصلية سارية المفعول ومختومة من طبيب مختص', '1099', datetime('now', '-2 hours'), datetime('now', '-1 hour'));

-- 4. بلاغات وسجلات للإدارة
INSERT INTO complaints_and_reports (id, reporter_id, pharmacy_id, order_id, report_type, details, status, admin_notes, created_at) VALUES
(1, 8, 2, 3, 'incorrect_stock', 'الصيدلية كانت مسجلة في التطبيق أن شاش الفازلين متوفر ولكن عند الذهاب اعتذر الصيدلي', 'resolved', 'تم التواصل مع د. مريم الأغا وتحديث المخزون الفعلي', datetime('now', '-1 day')),
(2, 9, 4, NULL, 'price_gouging', 'ملاحظة ارتفاع سعر معقم اليدين عن السعر الموصى به', 'under_investigation', 'جارٍ التحقق مع نقابة الصيادلة بقطاع غزة', datetime('now', '-5 hours'));

-- 5. رف التكافل الدوائي والتبرعات المجانية بين المواطنين (Solidarity Shelf)
INSERT INTO donations (id, donor_name, donor_phone, medicine_name, quantity, expiry_date, governorate, district, status, notes, created_at) VALUES
(1, 'أم محمد الغفري', '0599334411', 'أنسولين لانتوس (فائض عن حاجة الوالد)', 'قلمان معبآن', '2026-11', 'غزة', 'محيط مجمع الشفاء', 'available', 'تم الحفظ في مكان مبرد بعناية ومجاني لوجه الله تعالى لأي مريض سكري محتاج', datetime('now', '-3 hours')),
(2, 'د. خليل صيام', '0569112288', 'شاش معقم وضمادات حروق وديرمازين', '3 علب كاملة', '2027-04', 'دير البلح', 'مخيم دير البلح - بجوار المسجد الكبير', 'available', 'تبرع مجاني للجرحى والمصابين في مراكز الإيواء', datetime('now', '-1 hour')),
(3, 'عائلة الشهيد أبو يوسف', '0598774433', 'حليب أطفال بريمير للخدج', 'عبوتان مقفلتان', '2026-09', 'خانيونس', 'مواصي خانيونس - شارع 5', 'available', 'حليب مخصص للرضع ناقصي الوزن لوجه الله', datetime('now', '-30 minutes'));

-- 6. نداءات استغاثة عاجلة (Emergency SOS Beacons)
INSERT INTO sos_beacons (id, beacon_code, patient_name, patient_phone, urgency_level, medicine_needed, governorate, location_details, status, notes, created_at) VALUES
(1, 'SOS-701', 'طفل مصاب (عمر أبو حصيرة - 4 سنوات)', '0599887766', 'CRITICAL', 'أكياس دم O- سالب ومحلول رينجر لاكتات وأنسولين أطفال', 'غزة', 'حي الشيخ رضوان - قرب مدرسة الهدى', 'active', 'إصابة حرجة والطفل يعاني من هبوط حاد في السكر', datetime('now', '-15 minutes')),
(2, 'SOS-702', 'حالة ولادة قيصرية طارئة (أم يامن)', '0568112233', 'CRITICAL', 'أمبولات أوكسيتوسين وخيوط جراحية مقاس 2-0', 'دير البلح', 'مستشفى شهداء الأقصى الميداني', 'active', 'نفاد خيوط العمليات الجراحية في نقطة الولادة', datetime('now', '-45 minutes'));

