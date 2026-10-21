<?php
/**
 * MediFind / Dawaak - High-Performance Backend API (Gaza Relief Engine)
 * يدعم: SQLite فوري خفيف، مزامنة الطلبات، بنك التكافل الدوائي، ونداءات الاستغاثة SOS
 */

header('Content-Type: application/json; charset=UTF-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$dbPath = __DIR__ . '/database/medifind.db';
$isFirstRun = !file_exists($dbPath);

try {
    $pdo = new PDO("sqlite:" . $dbPath);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);

    // Initial setup if first run
    if ($isFirstRun) {
        $schemaFile = __DIR__ . '/database/schema.sql';
        $seedFile = __DIR__ . '/database/seed.sql';
        if (file_exists($schemaFile)) {
            $pdo->exec(file_get_contents($schemaFile));
        }
        if (file_exists($seedFile)) {
            $pdo->exec(file_get_contents($seedFile));
        }
    }

    // Ensure new Gaza humanitarian tables exist
    $pdo->exec("
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

        CREATE TABLE IF NOT EXISTS zero_results (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            query TEXT NOT NULL,
            governorate TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS sniper_watchdogs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            patient_name TEXT NOT NULL,
            patient_phone TEXT NOT NULL,
            medicine_query TEXT NOT NULL,
            governorate TEXT NOT NULL,
            max_price REAL DEFAULT 100,
            status TEXT DEFAULT 'hunting',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS reverse_bids (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            patient_name TEXT NOT NULL,
            patient_phone TEXT NOT NULL,
            prescription_text TEXT NOT NULL,
            governorate TEXT NOT NULL,
            max_budget REAL DEFAULT 100,
            status TEXT DEFAULT 'open',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS barter_listings (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            pharmacy_id INTEGER,
            pharmacy_name TEXT NOT NULL,
            offered_medicine TEXT NOT NULL,
            offered_qty INTEGER NOT NULL,
            needed_medicine TEXT NOT NULL,
            needed_qty INTEGER NOT NULL,
            governorate TEXT NOT NULL,
            status TEXT DEFAULT 'open',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );
    ");

} catch (Exception $e) {
    echo json_encode(['success' => false, 'error' => 'Database error: ' . $e->getMessage()]);
    exit;
}

$action = $_GET['action'] ?? 'bootstrap';

switch ($action) {
    case 'bootstrap':
        try {
            $users = $pdo->query("SELECT * FROM users WHERE status != 'inactive'")->fetchAll();
            $medicines = $pdo->query("SELECT * FROM medicines ORDER BY quantity DESC")->fetchAll();
            $orders = $pdo->query("SELECT * FROM orders ORDER BY created_at DESC LIMIT 50")->fetchAll();
            $donations = $pdo->query("SELECT * FROM donations ORDER BY created_at DESC")->fetchAll();
            $sos = $pdo->query("SELECT * FROM sos_beacons ORDER BY created_at DESC LIMIT 20")->fetchAll();

            echo json_encode([
                'success' => true,
                'data' => [
                    'users' => $users,
                    'medicines' => $medicines,
                    'orders' => $orders,
                    'donations' => $donations,
                    'sos_beacons' => $sos
                ]
            ], JSON_UNESCAPED_UNICODE);
        } catch (Exception $e) {
            echo json_encode(['success' => false, 'error' => $e->getMessage()]);
        }
        break;

    case 'create_order':
        $raw = file_get_contents('php://input');
        $data = json_decode($raw, true) ?: $_POST;
        if (!$data || empty($data['medicine_id'])) {
            echo json_encode(['success' => false, 'error' => 'Invalid order data']);
            exit;
        }

        try {
            $orderCode = 'MF-' . rand(1000, 9999);
            $pickupCode = strval(rand(1000, 9999));
            $stmt = $pdo->prepare("
                INSERT INTO orders (
                    order_code, patient_id, pharmacy_id, medicine_id, requested_qty,
                    unit_price, total_price, status, urgency_level, prescription_image_url,
                    patient_name, patient_phone, patient_notes, pickup_verification_code, created_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?, 'pending', ?, ?, ?, ?, ?, ?, datetime('now'))
            ");

            $patientId = intval($data['patient_id'] ?? 8);
            $pharmacyId = intval($data['pharmacy_id'] ?? 1);
            $medId = intval($data['medicine_id']);
            $qty = intval($data['requested_qty'] ?? 1);
            $unitPrice = floatval($data['unit_price'] ?? 0);
            $totalPrice = floatval($data['price_total'] ?? ($qty * $unitPrice));
            $urgency = $data['urgency_level'] ?? 'normal';
            $rxImg = $data['prescription_image_url'] ?? null;
            $name = $data['patient_name'] ?? 'مريض';
            $phone = $data['patient_phone'] ?? '0590000000';
            $notes = $data['patient_notes'] ?? '';

            $stmt->execute([
                $orderCode, $patientId, $pharmacyId, $medId, $qty,
                $unitPrice, $totalPrice, $urgency, $rxImg, $name, $phone, $notes, $pickupCode
            ]);

            echo json_encode([
                'success' => true,
                'order' => [
                    'id' => $pdo->lastInsertId(),
                    'order_code' => $orderCode,
                    'pickup_verification_code' => $pickupCode,
                    'status' => 'pending'
                ]
            ], JSON_UNESCAPED_UNICODE);
        } catch (Exception $e) {
            echo json_encode(['success' => false, 'error' => $e->getMessage()]);
        }
        break;

    case 'create_sos':
        $raw = file_get_contents('php://input');
        $data = json_decode($raw, true) ?: $_POST;
        try {
            $code = 'SOS-' . rand(100, 999);
            $stmt = $pdo->prepare("
                INSERT INTO sos_beacons (beacon_code, patient_name, patient_phone, urgency_level, medicine_needed, governorate, location_details, notes)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            ");
            $stmt->execute([
                $code,
                $data['patient_name'] ?? 'مواطن',
                $data['patient_phone'] ?? '',
                $data['urgency_level'] ?? 'CRITICAL',
                $data['medicine_needed'] ?? '',
                $data['governorate'] ?? 'غزة',
                $data['location_details'] ?? '',
                $data['notes'] ?? ''
            ]);

            echo json_encode(['success' => true, 'code' => $code]);
        } catch (Exception $e) {
            echo json_encode(['success' => false, 'error' => $e->getMessage()]);
        }
        break;

    case 'create_donation':
        $raw = file_get_contents('php://input');
        $data = json_decode($raw, true) ?: $_POST;
        try {
            $stmt = $pdo->prepare("
                INSERT INTO donations (donor_name, donor_phone, medicine_name, quantity, expiry_date, governorate, district, notes)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            ");
            $stmt->execute([
                $data['donor_name'] ?? 'فاعل خير',
                $data['donor_phone'] ?? '',
                $data['medicine_name'] ?? '',
                $data['quantity'] ?? 'عبوة واحدة',
                $data['expiry_date'] ?? '',
                $data['governorate'] ?? 'غزة',
                $data['district'] ?? '',
                $data['notes'] ?? ''
            ]);
            echo json_encode(['success' => true, 'id' => $pdo->lastInsertId()]);
        } catch (Exception $e) {
            echo json_encode(['success' => false, 'error' => $e->getMessage()]);
        }
        break;

    case 'record_zero_result':
        $raw = file_get_contents('php://input');
        $data = json_decode($raw, true) ?: $_POST;
        try {
            $stmt = $pdo->prepare("INSERT INTO zero_results (query, governorate) VALUES (?, ?)");
            $stmt->execute([$data['query'] ?? '', $data['governorate'] ?? 'غزة']);
            echo json_encode(['success' => true]);
        } catch (Exception $e) {
            echo json_encode(['success' => false, 'error' => $e->getMessage()]);
        }
        break;

    case 'create_sniper':
        $raw = file_get_contents('php://input');
        $data = json_decode($raw, true) ?: $_POST;
        try {
            $stmt = $pdo->prepare("
                INSERT INTO sniper_watchdogs (patient_name, patient_phone, medicine_query, governorate, max_price)
                VALUES (?, ?, ?, ?, ?)
            ");
            $stmt->execute([
                $data['patient_name'] ?? 'مريض',
                $data['patient_phone'] ?? '',
                $data['medicine_query'] ?? '',
                $data['governorate'] ?? 'غزة',
                floatval($data['max_price'] ?? 100)
            ]);
            echo json_encode(['success' => true, 'id' => $pdo->lastInsertId()]);
        } catch (Exception $e) {
            echo json_encode(['success' => false, 'error' => $e->getMessage()]);
        }
        break;

    case 'create_reverse_bid':
        $raw = file_get_contents('php://input');
        $data = json_decode($raw, true) ?: $_POST;
        try {
            $stmt = $pdo->prepare("
                INSERT INTO reverse_bids (patient_name, patient_phone, prescription_text, governorate, max_budget)
                VALUES (?, ?, ?, ?, ?)
            ");
            $stmt->execute([
                $data['patient_name'] ?? 'مريض',
                $data['patient_phone'] ?? '',
                $data['prescription_text'] ?? '',
                $data['governorate'] ?? 'غزة',
                floatval($data['max_budget'] ?? 100)
            ]);
            echo json_encode(['success' => true, 'id' => $pdo->lastInsertId()]);
        } catch (Exception $e) {
            echo json_encode(['success' => false, 'error' => $e->getMessage()]);
        }
        break;

    case 'create_barter':
        $raw = file_get_contents('php://input');
        $data = json_decode($raw, true) ?: $_POST;
        try {
            $stmt = $pdo->prepare("
                INSERT INTO barter_listings (pharmacy_id, pharmacy_name, offered_medicine, offered_qty, needed_medicine, needed_qty, governorate)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            ");
            $stmt->execute([
                intval($data['pharmacy_id'] ?? 1),
                $data['pharmacy_name'] ?? 'صيدلية معتمدة',
                $data['offered_medicine'] ?? '',
                intval($data['offered_qty'] ?? 1),
                $data['needed_medicine'] ?? '',
                intval($data['needed_qty'] ?? 1),
                $data['governorate'] ?? 'غزة'
            ]);
            echo json_encode(['success' => true, 'id' => $pdo->lastInsertId()]);
        } catch (Exception $e) {
            echo json_encode(['success' => false, 'error' => $e->getMessage()]);
        }
        break;

    case 'get_ngo_data':
        try {
            $zeros = $pdo->query("SELECT query, governorate, COUNT(*) as count FROM zero_results GROUP BY query, governorate ORDER BY count DESC LIMIT 50")->fetchAll();
            $hotspots = $pdo->query("SELECT * FROM medicines WHERE quantity <= 3 ORDER BY quantity ASC")->fetchAll();
            echo json_encode([
                'success' => true,
                'zero_results_summary' => $zeros,
                'critical_medicines' => $hotspots
            ], JSON_UNESCAPED_UNICODE);
        } catch (Exception $e) {
            echo json_encode(['success' => false, 'error' => $e->getMessage()]);
        }
        break;

    default:
        echo json_encode(['success' => true, 'message' => 'MediFind Gaza API operational']);
        break;
}
