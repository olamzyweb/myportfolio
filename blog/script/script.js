(() => {
    const BLOG_DATA_URL = 'data/posts.json';
    const POSTS_PER_PAGE = 6;
    let allPosts = [];
    let activeCategory = 'all';
    let searchQuery = '';
    let currentPage = 1;

    function initThemeToggle() {
        const themeToggle = document.getElementById('themeToggle');
        const htmlElement = document.documentElement;

        if (!themeToggle) {
            return;
        }

        if (
            localStorage.getItem('theme') === 'dark' ||
            (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches)
        ) {
            htmlElement.classList.add('dark');
        } else {
            htmlElement.classList.remove('dark');
        }

        themeToggle.addEventListener('click', () => {
            htmlElement.classList.toggle('dark');
            localStorage.setItem('theme', htmlElement.classList.contains('dark') ? 'dark' : 'light');
        });
    }

    function initParticles() {
        const container = document.getElementById('particles-container');
        const particleCount = 20;

        if (!container) {
            return;
        }

        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.classList.add('particle');

            const size = Math.random() * 20 + 5;
            const posX = Math.random() * 100;
            const posY = Math.random() * 100;
            const delay = Math.random() * 10;
            const duration = Math.random() * 10 + 10;
            const opacity = Math.random() * 0.2 + 0.1;

            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            particle.style.left = `${posX}%`;
            particle.style.top = `${posY}%`;
            particle.style.animationDelay = `${delay}s`;
            particle.style.animationDuration = `${duration}s`;
            particle.style.opacity = opacity;
            particle.style.backgroundColor = `rgba(14, 165, 233, ${opacity})`;
            particle.style.animation = `float ${duration}s ease-in-out infinite`;

            container.appendChild(particle);
        }
    }

    function formatDate(isoDate) {
        const date = new Date(isoDate);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }

    function escapeHtml(value) {
        return String(value)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    function getCategoryStyles(category) {
        const lower = category.toLowerCase();
        const map = {
            laravel: {
                badge: 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200',
                cover: 'from-red-400 to-red-600',
                icon: 'fab fa-laravel'
            },
            javascript: {
                badge: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200',
                cover: 'from-yellow-400 to-yellow-600',
                icon: 'fab fa-js-square'
            },
            devops: {
                badge: 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200',
                cover: 'from-blue-400 to-blue-600',
                icon: 'fas fa-server'
            },
            tutorial: {
                badge: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-200',
                cover: 'from-emerald-400 to-emerald-600',
                icon: 'fas fa-book-open'
            }
        };

        return map[lower] || {
            badge: 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200',
            cover: 'from-gray-500 to-gray-700',
            icon: 'fas fa-file-lines'
        };
    }

    function getFilteredPosts() {
        const normalizedQuery = searchQuery.trim().toLowerCase();

        return allPosts.filter(post => {
            const postCategories = Array.isArray(post.categories) ? post.categories : [];
            const matchesCategory = activeCategory === 'all' || postCategories.includes(activeCategory);

            if (!matchesCategory) {
                return false;
            }

            if (!normalizedQuery) {
                return true;
            }

            const haystack = [
                post.title,
                post.excerpt,
                post.categoryLabel,
                ...(Array.isArray(post.tags) ? post.tags : [])
            ]
                .filter(Boolean)
                .join(' ')
                .toLowerCase();

            return haystack.includes(normalizedQuery);
        });
    }

    function renderPagination(totalItems) {
        const pagination = document.getElementById('pagination');
        if (!pagination) {
            return;
        }

        const totalPages = Math.ceil(totalItems / POSTS_PER_PAGE);
        if (totalPages <= 1) {
            pagination.innerHTML = '';
            return;
        }

        let buttons = '';
        for (let page = 1; page <= totalPages; page++) {
            const activeClasses = page === currentPage
                ? 'bg-primary-600 text-white'
                : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200';

            buttons += `<button class="pagination-btn px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 ${activeClasses}" data-page="${page}">${page}</button>`;
        }

        pagination.innerHTML = buttons;
        pagination.querySelectorAll('.pagination-btn').forEach(button => {
            button.addEventListener('click', () => {
                const page = Number(button.dataset.page || 1);
                currentPage = page;
                renderPosts();
                const blogGrid = document.getElementById('blogGrid');
                if (blogGrid) {
                    blogGrid.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            });
        });
    }

    function renderPosts() {
        const blogGrid = document.getElementById('blogGrid');
        const postsStatus = document.getElementById('postsStatus');

        if (!blogGrid || !postsStatus) {
            return;
        }

        const filteredPosts = getFilteredPosts();
        const totalPosts = filteredPosts.length;
        const totalPages = Math.max(1, Math.ceil(totalPosts / POSTS_PER_PAGE));
        if (currentPage > totalPages) {
            currentPage = 1;
        }

        const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
        const pagedPosts = filteredPosts.slice(startIndex, startIndex + POSTS_PER_PAGE);

        if (!totalPosts) {
            blogGrid.innerHTML = '';
            postsStatus.textContent = 'No posts found for your current filter/search.';
            postsStatus.classList.remove('hidden');
            renderPagination(0);
            return;
        }

        const endIndex = Math.min(startIndex + POSTS_PER_PAGE, totalPosts);
        postsStatus.textContent = `Showing ${startIndex + 1}-${endIndex} of ${totalPosts} posts`;
        postsStatus.classList.remove('hidden');
        blogGrid.innerHTML = pagedPosts.map(post => {
            const category = post.categoryLabel || (post.categories && post.categories[0]) || 'Article';
            const styles = getCategoryStyles(category);
            return `
                <article class="blog-card bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md">
                    <div class="h-48 bg-gradient-to-br ${styles.cover} flex items-center justify-center">
                        <i class="${styles.icon} text-6xl text-white"></i>
                    </div>
                    <div class="p-6">
                        <div class="flex items-center gap-2 mb-3">
                            <span class="px-3 py-1 ${styles.badge} text-xs rounded-full">${escapeHtml(category)}</span>
                            <span class="text-sm text-gray-500">${escapeHtml(post.readTime || '5 min read')}</span>
                        </div>
                        <h3 class="text-xl font-semibold mb-2 hover:text-primary-600 dark:hover:text-primary-400">
                            <a href="post.html?slug=${encodeURIComponent(post.slug)}">${escapeHtml(post.title)}</a>
                        </h3>
                        <p class="text-gray-600 dark:text-gray-400 mb-4 text-sm">${escapeHtml(post.excerpt)}</p>
                        <div class="flex items-center justify-between">
                            <span class="text-sm text-gray-500">${escapeHtml(formatDate(post.publishedAt))}</span>
                            <a href="post.html?slug=${encodeURIComponent(post.slug)}" class="text-primary-600 dark:text-primary-400 font-medium hover:underline text-sm">Read More →</a>
                        </div>
                    </div>
                </article>
            `;
        }).join('');

        renderPagination(totalPosts);
    }

    function initCategoryFilter() {
        const categoryButtons = document.querySelectorAll('.category-badge');

        categoryButtons.forEach(button => {
            button.addEventListener('click', () => {
                activeCategory = button.dataset.category || 'all';

                categoryButtons.forEach(btn => {
                    btn.classList.remove('bg-primary-600', 'text-white');
                    btn.classList.add('bg-white', 'dark:bg-gray-700', 'text-gray-800', 'dark:text-gray-200');
                });

                button.classList.remove('bg-white', 'dark:bg-gray-700', 'text-gray-800', 'dark:text-gray-200');
                button.classList.add('bg-primary-600', 'text-white');

                currentPage = 1;
                renderPosts();
            });
        });
    }

    function initSearch() {
        const searchInput = document.getElementById('searchPosts');
        if (!searchInput) {
            return;
        }

        searchInput.addEventListener('input', () => {
            searchQuery = searchInput.value || '';
            currentPage = 1;
            renderPosts();
        });
    }

    async function loadPosts() {
        const postsStatus = document.getElementById('postsStatus');
        try {
            const response = await fetch(BLOG_DATA_URL, { cache: 'no-store' });
            if (!response.ok) {
                throw new Error('Could not load blog data');
            }

            const data = await response.json();
            allPosts = Array.isArray(data.posts) ? data.posts.sort((a, b) => {
                return new Date(b.publishedAt) - new Date(a.publishedAt);
            }) : [];

            renderPosts();
        } catch (error) {
            if (postsStatus) {
                postsStatus.textContent = 'Could not load posts right now. Please try again later.';
                postsStatus.classList.remove('hidden');
            }
            console.error(error);
        }
    }

    function checkVisibility() {
        const elements = document.querySelectorAll('.animate-fadein');
        elements.forEach(el => {
            const rect = el.getBoundingClientRect();
            if (rect.top < window.innerHeight * 0.75) {
                el.classList.add('visible');
            }
        });
    }

    document.addEventListener('DOMContentLoaded', () => {
        initThemeToggle();
        initParticles();
        initCategoryFilter();
        initSearch();
        loadPosts();
        checkVisibility();
        window.addEventListener('scroll', checkVisibility);
    });
})();