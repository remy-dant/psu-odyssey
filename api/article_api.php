<?php
// article_api.php
// Endpoint pour gérer les articles
header('Content-Type: application/json');
$action = $_POST['action'] ?? '';
$file = '../data/articles.json';
if (!file_exists($file)) file_put_contents($file, '[]');
$articles = json_decode(file_get_contents($file), true);
if ($action === 'add' || $action === 'edit') {
    $title = $_POST['title'] ?? '';
    $content = $_POST['content'] ?? '';
    $id = $_POST['id'] ?? uniqid();
    $image = '';
    if (!empty($_FILES['image']['name'])) {
        $target = '../assets/images/articles/' . basename($_FILES['image']['name']);
        if (move_uploaded_file($_FILES['image']['tmp_name'], $target)) {
            $image = $target;
        }
    }
    $item = ['id' => $id, 'title' => $title, 'content' => $content, 'image' => $image];
    $found = false;
    foreach ($articles as &$a) {
        if ($a['id'] === $id) {
            $a = $item;
            $found = true;
            break;
        }
    }
    if (!$found) $articles[] = $item;
    file_put_contents($file, json_encode($articles));
    echo json_encode(['success' => true, 'articles' => $articles]);
    exit;
}
if ($action === 'delete') {
    $id = $_POST['id'] ?? '';
    $articles = array_filter($articles, fn($a) => $a['id'] !== $id);
    file_put_contents($file, json_encode(array_values($articles)));
    echo json_encode(['success' => true, 'articles' => $articles]);
    exit;
}
echo json_encode(['articles' => $articles]);
