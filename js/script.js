// Функция инициализации меню (будет вызываться после загрузки шаблонов)
function initMenu() {
    // Элементы DOM
    const sidebar = document.getElementById('sidebar');
    const toggleSidebarBtn = document.getElementById('toggleSidebar');
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    
    // Переключение бокового меню
    if (toggleSidebarBtn) {
        toggleSidebarBtn.addEventListener('click', () => {
            sidebar.classList.toggle('collapsed');
            const icon = toggleSidebarBtn.querySelector('i');
            if (icon) {
                icon.classList.toggle('fa-chevron-left');
                icon.classList.toggle('fa-chevron-right');
            }
            
            // Закрываем все подменю при сворачивании
            if (sidebar.classList.contains('collapsed')) {
                closeAllSubmenus();
            }
        });
    }
    
    // Мобильное меню
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', () => {
            sidebar.classList.toggle('active');
        });
    }
    
    // Инициализация подменю
    initSubmenus();
    
    // Подсветка активного пункта меню
    highlightActiveMenu();
    
    // Параллакс эффект
    initParallax();
    
    // Закрытие меню при клике вне его на мобильных
    setupMobileMenuClose();
}

// Инициализация подменю
function initSubmenus() {
    // Обработка кликов по меню проектов
    const projectsMenu = document.getElementById('projectsMenu');
    const modsMenu = document.getElementById('modsMenu');
    
    if (projectsMenu) {
        projectsMenu.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const parent = this.closest('.has-submenu');
            const isActive = parent.classList.contains('active');
            
            // Закрываем все другие подменю
            closeAllSubmenusExcept(parent);
            
            // Открываем/закрываем текущее
            if (!isActive) {
                parent.classList.add('active');
            } else {
                parent.classList.remove('active');
            }
        });
    }
    
    if (modsMenu) {
        modsMenu.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const parent = this.closest('.submenu-item');
            const isActive = parent.classList.contains('active');
            
            // Закрываем все другие подменю на этом уровне
            const siblings = Array.from(parent.parentElement.children);
            siblings.forEach(sibling => {
                if (sibling !== parent && sibling.classList.contains('has-submenu')) {
                    sibling.classList.remove('active');
                }
            });
            
            // Открываем/закрываем текущее
            if (!isActive) {
                parent.classList.add('active');
            } else {
                parent.classList.remove('active');
            }
        });
    }
    
    // Закрытие подменю при клике вне на десктопе
    document.addEventListener('click', function(e) {
        if (window.innerWidth > 768 && !e.target.closest('.has-submenu')) {
            closeAllSubmenus();
        }
    });
}

// Закрытие всех подменю кроме указанного
function closeAllSubmenusExcept(exceptElement) {
    document.querySelectorAll('.has-submenu').forEach(item => {
        if (item !== exceptElement) {
            item.classList.remove('active');
        }
    });
}

// Закрытие всех подменю
function closeAllSubmenus() {
    document.querySelectorAll('.has-submenu.active').forEach(item => {
        item.classList.remove('active');
    });
}

// Параллакс эффект
function initParallax() {
    let isParallaxEnabled = true;
    
    // Проверяем, не мобильное ли устройство (отключаем параллакс на мобильных)
    if (window.innerWidth <= 768) {
        isParallaxEnabled = false;
    }
    
    if (isParallaxEnabled) {
        document.addEventListener('mousemove', (e) => {
            const x = e.clientX / window.innerWidth;
            const y = e.clientY / window.innerHeight;
            
            const layer1 = document.querySelector('.layer-1');
            const layer2 = document.querySelector('.layer-2');
            
            if (layer1) {
                layer1.style.transform = `translate(${x * 20}px, ${y * 20}px) translateZ(-10px) scale(2)`;
            }
            
            if (layer2) {
                layer2.style.transform = `translate(${x * 40}px, ${y * 40}px) translateZ(-5px) scale(1.5)`;
            }
        });
    }
}

// Подсветка активного пункта меню
function highlightActiveMenu() {
    const currentPath = window.location.pathname;
    const menuLinks = document.querySelectorAll('.menu-link');
    const submenuLinks = document.querySelectorAll('.submenu-link, .subsubmenu-link');
    const allLinks = [...menuLinks, ...submenuLinks];
    
    // Убираем активность у всех
    allLinks.forEach(link => link.classList.remove('active'));
    
    // Добавляем активность текущей странице
    let foundActive = false;
    
    allLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href && href !== '#') {
            // Нормализуем пути для сравнения
            const normalizedHref = href.replace(/^\/+/, '');
            const normalizedPath = currentPath.replace(/^\/+/, '');
            
            if (normalizedPath === normalizedHref || 
                (normalizedPath.startsWith(normalizedHref) && normalizedHref !== '')) {
                link.classList.add('active');
                foundActive = true;
                
                // Открываем родительские подменю
                let parent = link.closest('.has-submenu');
                while (parent) {
                    parent.classList.add('active');
                    parent = parent.parentElement.closest('.has-submenu');
                }
            }
        }
    });
    
    // Обработка главной страницы
    if (currentPath === '/' || currentPath === '/index.html' || currentPath.endsWith('/')) {
        document.querySelector('.menu-link[data-page="home"]')?.classList.add('active');
        foundActive = true;
    }
    
    // Если ничего не найдено, проверяем по частям пути
    if (!foundActive) {
        const pathParts = currentPath.split('/').filter(part => part);
        
        for (let i = pathParts.length; i > 0; i--) {
            const testPath = '/' + pathParts.slice(0, i).join('/');
            
            allLinks.forEach(link => {
                const href = link.getAttribute('href');
                if (href && href === testPath) {
                    link.classList.add('active');
                    
                    // Открываем родительские подменю
                    let parent = link.closest('.has-submenu');
                    while (parent) {
                        parent.classList.add('active');
                        parent = parent.parentElement.closest('.has-submenu');
                    }
                }
            });
        }
    }
}

// Закрытие меню при клике вне его на мобильных
function setupMobileMenuClose() {
    document.addEventListener('click', (e) => {
        if (window.innerWidth <= 768) {
            const sidebar = document.getElementById('sidebar');
            const mobileMenuToggle = document.getElementById('mobileMenuToggle');
            
            if (sidebar && !sidebar.contains(e.target) && e.target !== mobileMenuToggle) {
                sidebar.classList.remove('active');
            }
        }
    });
}

// Инициализация при загрузке DOM (если меню уже загружено)
document.addEventListener('DOMContentLoaded', function() {
    // Если меню уже есть на странице (не загружено через шаблон)
    if (document.getElementById('sidebar')) {
        initMenu();
    }
    
    // Добавляем обработчик для всех кнопок копирования email
    document.querySelectorAll('.copy-btn').forEach(btn => {
        if (btn.id !== 'copyEmailBtn') { // Чтобы не дублировать обработчик из contact/index.html
            btn.addEventListener('click', function() {
                const email = 'gatvit@mail.ru';
                const originalContent = this.innerHTML;
                
                navigator.clipboard.writeText(email).then(() => {
                    this.classList.add('copied');
                    this.innerHTML = '<i class="fas fa-check"></i><span>Скопировано!</span>';
                    
                    setTimeout(() => {
                        this.classList.remove('copied');
                        this.innerHTML = originalContent;
                    }, 2000);
                }).catch(err => {
                    console.error('Ошибка копирования: ', err);
                    alert('Не удалось скопировать email. Пожалуйста, скопируйте вручную.');
                });
            });
        }
    });
});

// Экспортируем функции для использования в других скриптах
window.initMenu = initMenu;
window.initSubmenus = initSubmenus;
window.closeAllSubmenus = closeAllSubmenus;
window.highlightActiveMenu = highlightActiveMenu;
