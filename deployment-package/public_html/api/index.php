<?php
declare(strict_types=1);
require_once __DIR__ . '/../config/database.php';

header('Content-Type: application/json; charset=utf-8');
$allowedOrigin = getenv('ALLOWED_ORIGIN') ?: ($_SERVER['HTTP_ORIGIN'] ?? '*');
header('Access-Control-Allow-Origin: ' . $allowedOrigin);
header('Vary: Origin');
header('X-Content-Type-Options: nosniff');
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(204); exit; }

function respond(mixed $data, int $status = 200): never {
    http_response_code($status);
    echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}
function body(): array {
    $raw = file_get_contents('php://input');
    $data = json_decode($raw ?: '{}', true);
    if (!is_array($data)) respond(['error' => 'Invalid JSON body'], 400);
    return $data;
}
function required(array $data, array $fields): void {
    foreach ($fields as $field) {
        if (!isset($data[$field]) || trim((string)$data[$field]) === '') {
            respond(['error' => "$field is required"], 422);
        }
    }
}

$method = $_SERVER['REQUEST_METHOD'];
$path = trim(parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH), '/');
$parts = explode('/', $path);
$apiAt = array_search('api', $parts, true);
$resource = $parts[$apiAt === false ? 0 : $apiAt + 1] ?? '';
$id = isset($parts[$apiAt === false ? 1 : $apiAt + 2]) ? (int)$parts[$apiAt === false ? 1 : $apiAt + 2] : null;

try {
    $pdo = db();
    if ($resource === 'health') respond(['status' => 'ok']);

    if ($resource === 'tutors') {
        if ($method === 'GET') {
            if ($id) {
                $s = $pdo->prepare('SELECT * FROM tutors WHERE id=?'); $s->execute([$id]);
                $row = $s->fetch(); $row ? respond($row) : respond(['error'=>'Tutor not found'], 404);
            }
            $q = trim($_GET['subject'] ?? '');
            if ($q !== '') { $s=$pdo->prepare('SELECT * FROM tutors WHERE subjects LIKE ? ORDER BY created_at DESC'); $s->execute(["%$q%"]); }
            else { $s=$pdo->query('SELECT * FROM tutors ORDER BY created_at DESC'); }
            respond($s->fetchAll());
        }
        $data = body();
        if ($method === 'POST') {
            required($data, ['name','department','subjects','available_time','mode','contact']);
            $s=$pdo->prepare('INSERT INTO tutors(name,department,subjects,available_time,mode,contact,bio,country,languages) VALUES(?,?,?,?,?,?,?,?,?)');
            $s->execute([$data['name'],$data['department'],$data['subjects'],$data['available_time'],$data['mode'],$data['contact'],$data['bio']??'',$data['country']??'India',$data['languages']??'English']);
            respond(['message'=>'Tutor profile created','id'=>(int)$pdo->lastInsertId()], 201);
        }
        if ($method === 'PUT' && $id) {
            required($data, ['name','department','subjects','available_time','mode','contact']);
            $s=$pdo->prepare('UPDATE tutors SET name=?,department=?,subjects=?,available_time=?,mode=?,contact=?,bio=?,country=?,languages=? WHERE id=?');
            $s->execute([$data['name'],$data['department'],$data['subjects'],$data['available_time'],$data['mode'],$data['contact'],$data['bio']??'',$data['country']??'India',$data['languages']??'English',$id]);
            $s->rowCount() ? respond(['message'=>'Tutor profile updated']) : respond(['error'=>'Tutor not found or unchanged'],404);
        }
        if ($method === 'DELETE' && $id) {
            $s=$pdo->prepare('DELETE FROM tutors WHERE id=?'); $s->execute([$id]);
            $s->rowCount() ? respond(['message'=>'Tutor profile deleted']) : respond(['error'=>'Tutor not found'],404);
        }
    }

    if ($resource === 'requests') {
        if ($method === 'GET') {
            if ($id) { $s=$pdo->prepare('SELECT * FROM help_requests WHERE id=?'); $s->execute([$id]); $row=$s->fetch(); $row?respond($row):respond(['error'=>'Request not found'],404); }
            $status = $_GET['status'] ?? '';
            if ($status !== '') { $s=$pdo->prepare('SELECT * FROM help_requests WHERE status=? ORDER BY created_at DESC'); $s->execute([$status]); }
            else $s=$pdo->query('SELECT * FROM help_requests ORDER BY created_at DESC');
            respond($s->fetchAll());
        }
        $data=body();
        if ($method === 'POST') {
            required($data,['student_name','subject','topic','description','preferred_time','mode','contact']);
            $s=$pdo->prepare('INSERT INTO help_requests(student_name,subject,topic,description,preferred_time,mode,contact,status,country,languages) VALUES(?,?,?,?,?,?,?,?,?,?)');
            $s->execute([$data['student_name'],$data['subject'],$data['topic'],$data['description'],$data['preferred_time'],$data['mode'],$data['contact'],'Open',$data['country']??'India',$data['languages']??'English']);
            respond(['message'=>'Help request created','id'=>(int)$pdo->lastInsertId()],201);
        }
        if ($method === 'PUT' && $id) {
            required($data,['student_name','subject','topic','description','preferred_time','mode','contact','status']);
            $s=$pdo->prepare('UPDATE help_requests SET student_name=?,subject=?,topic=?,description=?,preferred_time=?,mode=?,contact=?,status=?,country=?,languages=? WHERE id=?');
            $s->execute([$data['student_name'],$data['subject'],$data['topic'],$data['description'],$data['preferred_time'],$data['mode'],$data['contact'],$data['status'],$data['country']??'India',$data['languages']??'English',$id]);
            $s->rowCount()?respond(['message'=>'Help request updated']):respond(['error'=>'Request not found or unchanged'],404);
        }
        if ($method === 'DELETE' && $id) {
            $s=$pdo->prepare('DELETE FROM help_requests WHERE id=?'); $s->execute([$id]);
            $s->rowCount()?respond(['message'=>'Help request deleted']):respond(['error'=>'Request not found'],404);
        }
    }

    if ($resource === 'rooms') {
        if ($method === 'GET') {
            $sql = 'SELECT r.*, COUNT(m.id) AS members FROM study_rooms r LEFT JOIN room_members m ON m.room_id=r.id';
            $params = [];
            if ($id) { $sql .= ' WHERE r.id=?'; $params[] = $id; }
            $sql .= ' GROUP BY r.id ORDER BY FIELD(r.status,"Live","Scheduled","Closed"), r.created_at DESC';
            $s=$pdo->prepare($sql); $s->execute($params); $rows=$s->fetchAll();
            if ($id) $rows ? respond($rows[0]) : respond(['error'=>'Study room not found'],404);
            respond($rows);
        }
        $data=body();
        if ($method === 'POST') {
            required($data,['title','subject','host_name','scheduled_time','country','languages','level','capacity']);
            $s=$pdo->prepare('INSERT INTO study_rooms(title,subject,host_name,scheduled_time,country,languages,level,capacity,status) VALUES(?,?,?,?,?,?,?,?,?)');
            $s->execute([$data['title'],$data['subject'],$data['host_name'],$data['scheduled_time'],$data['country'],$data['languages'],$data['level'],(int)$data['capacity'],$data['status']??'Scheduled']);
            respond(['message'=>'Study room created','id'=>(int)$pdo->lastInsertId()],201);
        }
        if ($method === 'PUT' && $id) {
            required($data,['title','subject','host_name','scheduled_time','country','languages','level','capacity','status']);
            $s=$pdo->prepare('UPDATE study_rooms SET title=?,subject=?,host_name=?,scheduled_time=?,country=?,languages=?,level=?,capacity=?,status=? WHERE id=?');
            $s->execute([$data['title'],$data['subject'],$data['host_name'],$data['scheduled_time'],$data['country'],$data['languages'],$data['level'],(int)$data['capacity'],$data['status'],$id]);
            respond(['message'=>'Study room updated']);
        }
        if ($method === 'DELETE' && $id) {
            $s=$pdo->prepare('DELETE FROM study_rooms WHERE id=?'); $s->execute([$id]);
            $s->rowCount()?respond(['message'=>'Study room deleted']):respond(['error'=>'Study room not found'],404);
        }
    }

    if ($resource === 'join-room' && $method === 'POST') {
        $data=body(); required($data,['room_id','student_name']);
        $s=$pdo->prepare('SELECT capacity, (SELECT COUNT(*) FROM room_members WHERE room_id=?) members FROM study_rooms WHERE id=? AND status<>"Closed"');
        $s->execute([(int)$data['room_id'],(int)$data['room_id']]); $room=$s->fetch();
        if (!$room) respond(['error'=>'Room is unavailable'],404);
        if ((int)$room['members'] >= (int)$room['capacity']) respond(['error'=>'Room is full'],409);
        $s=$pdo->prepare('INSERT INTO room_members(room_id,student_name,email) VALUES(?,?,?)');
        $s->execute([(int)$data['room_id'],$data['student_name'],$data['email']??'']);
        respond(['message'=>'Your study-room seat is confirmed'],201);
    }
    respond(['error'=>'Route not found'],404);
} catch (PDOException $e) {
    $response = ['error'=>'Database operation failed'];
    if ((getenv('APP_DEBUG') ?: 'false') === 'true') $response['detail'] = $e->getMessage();
    respond($response,500);
}
