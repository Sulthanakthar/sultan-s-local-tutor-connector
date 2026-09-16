<?php
// router.php - Router script for PHP built-in CLI server (php -S 127.0.0.1:8080 router.php)
declare(strict_types=1);

$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

// 1. Forward API routes (/api/... or /backend/api/... or standalone /tutors, /requests, etc.)
if (
    str_starts_with($uri, '/api') ||
    str_starts_with($uri, '/backend/api') ||
    in_array($uri, ['/tutors', '/requests', '/rooms', '/join-room', '/health'], true)
) {
    require __DIR__ . '/backend/api/index.php';
    exit;
}

// 2. Serve static files if they exist on disk
$filePath = __DIR__ . $uri;
if ($uri !== '/' && file_exists($filePath) && !is_dir($filePath)) {
    return false; // Serve file directly
}

// 3. Serve root index.html or professional demo default
if ($uri === '/' || $uri === '/index.html') {
    require __DIR__ . '/professional-interface-demo/index.html';
    exit;
}

return false;
