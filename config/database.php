<?php
declare(strict_types=1);

function db_settings(): array
{
    $settings = [
        'host' => '127.0.0.1',
        'port' => '3306',
        'name' => 'canteen_reservation',
        'user' => 'root',
        'pass' => '',
    ];

    $localConfigPath = __DIR__ . '/database.local.php';
    if (is_file($localConfigPath)) {
        $localConfig = require $localConfigPath;

        if (is_array($localConfig)) {
            foreach ($settings as $key => $defaultValue) {
                if (array_key_exists($key, $localConfig) && $localConfig[$key] !== '') {
                    $settings[$key] = (string) $localConfig[$key];
                }
            }
        }
    }

    $envMap = [
        'host' => 'DB_HOST',
        'port' => 'DB_PORT',
        'name' => 'DB_NAME',
        'user' => 'DB_USER',
        'pass' => 'DB_PASS',
    ];

    foreach ($envMap as $settingKey => $envName) {
        $envValue = getenv($envName);
        if ($envValue !== false && $envValue !== '') {
            $settings[$settingKey] = (string) $envValue;
        }
    }

    return $settings;
}

function db(): PDO
{
    static $pdo = null;

    if ($pdo instanceof PDO) {
        return $pdo;
    }

    $settings = db_settings();
    $dsn = sprintf(
        'mysql:host=%s;port=%s;dbname=%s;charset=utf8mb4',
        $settings['host'],
        $settings['port'],
        $settings['name']
    );

    $options = [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false,
    ];

    $pdo = new PDO($dsn, $settings['user'], $settings['pass'], $options);

    return $pdo;
}
