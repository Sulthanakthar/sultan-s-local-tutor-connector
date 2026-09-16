<?php
declare(strict_types=1);

function db(): PDO
{
    static $pdo = null;
    if ($pdo instanceof PDO) return $pdo;

    $localFile = __DIR__ . '/database.local.php';
    $local = file_exists($localFile) ? require $localFile : [];
    $host = getenv('DB_HOST') ?: ($local['host'] ?? '127.0.0.1');
    $port = getenv('DB_PORT') ?: ($local['port'] ?? '3306');
    $name = getenv('DB_NAME') ?: ($local['name'] ?? 'local_tutor_connector');
    $user = getenv('DB_USER') ?: ($local['user'] ?? 'root');
    $pass = getenv('DB_PASS') ?: ($local['pass'] ?? '');
    $dsn = "mysql:host={$host};port={$port};dbname={$name};charset=utf8mb4";

    $pdo = new PDO($dsn, $user, $pass, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false,
    ]);
    return $pdo;
}
