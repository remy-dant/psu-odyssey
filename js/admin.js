// admin.js
// Gestion côté client de l’admin
// À compléter pour les appels AJAX vers les endpoints PHP
// --- Gestion du menu de gauche ---
function fetchMenu() {
    fetch('../api/menu_api.php', { method: 'POST' })
        .then(r => r.json())
        .then(data => renderMenu(data.menu));
}

function renderMenu(menu) {
    const menuList = document.getElementById('menuList');
    menuList.innerHTML = '';
    menu.forEach(item => {
        const li = document.createElement('li');
        li.textContent = item.title + ' (' + item.link + ')';
        const editBtn = document.createElement('button');
        editBtn.textContent = 'Modifier';
        editBtn.onclick = () => fillMenuForm(item);
        const delBtn = document.createElement('button');
        delBtn.textContent = 'Supprimer';
        delBtn.onclick = () => deleteMenu(item.id);
        li.appendChild(editBtn);
        li.appendChild(delBtn);
        menuList.appendChild(li);
    });
}

function fillMenuForm(item) {
    document.querySelector('[name=menuTitle]').value = item.title;
    document.querySelector('[name=menuLink]').value = item.link;
    document.getElementById('menuForm').dataset.id = item.id;
}

function deleteMenu(id) {
    const fd = new FormData();
    fd.append('action', 'delete');
    fd.append('id', id);
    fetch('../api/menu_api.php', { method: 'POST', body: fd })
        .then(r => r.json())
        .then(data => renderMenu(data.menu));
}

document.getElementById('menuForm').onsubmit = function (e) {
    e.preventDefault();
    const fd = new FormData(this);
    fd.append('action', this.dataset.id ? 'edit' : 'add');
    if (this.dataset.id) fd.append('id', this.dataset.id);
    fd.append('title', fd.get('menuTitle'));
    fd.append('link', fd.get('menuLink'));
    fetch('../api/menu_api.php', { method: 'POST', body: fd })
        .then(r => r.json())
        .then(data => {
            renderMenu(data.menu);
            this.reset();
            delete this.dataset.id;
        });
};

// --- Gestion des articles ---
function fetchArticles() {
    fetch('../api/article_api.php', { method: 'POST' })
        .then(r => r.json())
        .then(data => renderArticles(data.articles));
}

function renderArticles(articles) {
    const articleList = document.getElementById('articleList');
    articleList.innerHTML = '';
    articles.forEach(item => {
        const li = document.createElement('li');
        li.innerHTML = `<strong>${item.title}</strong><br>${item.content}`;
        if (item.image) {
            const img = document.createElement('img');
            img.src = item.image.replace('..', '..');
            img.style.maxWidth = '100px';
            li.appendChild(img);
        }
        const editBtn = document.createElement('button');
        editBtn.textContent = 'Modifier';
        editBtn.onclick = () => fillArticleForm(item);
        const delBtn = document.createElement('button');
        delBtn.textContent = 'Supprimer';
        delBtn.onclick = () => deleteArticle(item.id);
        li.appendChild(editBtn);
        li.appendChild(delBtn);
        articleList.appendChild(li);
    });
}

function fillArticleForm(item) {
    document.querySelector('[name=articleTitle]').value = item.title;
    document.querySelector('[name=articleContent]').value = item.content;
    document.getElementById('articleForm').dataset.id = item.id;
}

function deleteArticle(id) {
    const fd = new FormData();
    fd.append('action', 'delete');
    fd.append('id', id);
    fetch('../api/article_api.php', { method: 'POST', body: fd })
        .then(r => r.json())
        .then(data => renderArticles(data.articles));
}

document.getElementById('articleForm').onsubmit = function (e) {
    e.preventDefault();
    const fd = new FormData(this);
    fd.append('action', this.dataset.id ? 'edit' : 'add');
    if (this.dataset.id) fd.append('id', this.dataset.id);
    fd.append('title', fd.get('articleTitle'));
    fd.append('content', fd.get('articleContent'));
    if (this.articleImage && this.articleImage.files[0]) {
        fd.append('image', this.articleImage.files[0]);
    }
    fetch('../api/article_api.php', { method: 'POST', body: fd })
        .then(r => r.json())
        .then(data => {
            renderArticles(data.articles);
            this.reset();
            delete this.dataset.id;
        });
};

// Initialisation
fetchMenu();
fetchArticles();