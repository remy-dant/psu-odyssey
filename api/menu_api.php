<?php
// menu_api.php
// Endpoint pour gérer le menu de gauche
header('Content-Type: application/json');
$action = $_POST['action'] ?? '';
$file = '../data/menu.json';
if (!file_exists($file)) file_put_contents($file, '[]');
$menu = json_decode(file_get_contents($file), true);
if ($action === 'add' || $action === 'edit') {
    $title = $_POST['title'] ?? '';
    $link = $_POST['link'] ?? '';
    $id = $_POST['id'] ?? uniqid();
    $item = ['id' => $id, 'title' => $title, 'link' => $link];
    $found = false;
    foreach ($menu as &$m) {
        if ($m['id'] === $id) {
            $m = $item;
            $found = true;
            break;
        }
    }
    if (!$found) $menu[] = $item;
    file_put_contents($file, json_encode($menu));
    echo json_encode(['success' => true, 'menu' => $menu]);
    exit;
}
if ($action === 'delete') {
    $id = $_POST['id'] ?? '';
    $menu = array_filter($menu, fn($m) => $m['id'] !== $id);
    file_put_contents($file, json_encode(array_values($menu)));
    echo json_encode(['success' => true, 'menu' => $menu]);
    exit;
}
echo json_encode(['menu' => $menu]);
