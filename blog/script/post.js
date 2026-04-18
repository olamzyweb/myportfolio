(() => {
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

    function getSlug() {
        const params = new URLSearchParams(window.location.search);
        return params.get('slug');
    }

    function formatDate(isoDate) {
        const date = new Date(isoDate);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    function escapeHtml(value) {
        return String(value)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/\"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    function renderContentBlock(block) {
        switch (block.type) {
            case 'heading':
                return `<h2 class="text-2xl font-bold mt-8 mb-4">${escapeHtml(block.text)}</h2>`;
            case 'paragraph':
                return `<p class="mb-5 text-gray-700 dark:text-gray-300 leading-8">${escapeHtml(block.text)}</p>`;
            case 'list': {
                const items = Array.isArray(block.items) ? block.items : [];
                const itemHtml = items.map(item => `<li>${escapeHtml(item)}</li>`).join('');
                return `<ul class="list-disc pl-6 mb-5 space-y-2 text-gray-700 dark:text-gray-300">${itemHtml}</ul>`;
            }
            case 'code':
                return `
                    <pre class="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 overflow-x-auto mb-5">
                        <code>${escapeHtml(block.text || '')}</code>
                    </pre>
                `;
            default:
                return '';
        }
    }

    function setMeta(title, description) {
        document.title = title;
        const descMeta = document.querySelector('meta[name="description"]');
        if (descMeta) {
            descMeta.setAttribute('content', description);
        }
    }

    function showError(message) {
        const status = document.getElementById('postStatus');
        if (status) {
            status.textContent = message;
        }
    }

    async function loadPost() {
        const slug = getSlug();
        if (!slug) {
            showError('Missing post slug. Please return to blog home and open a post again.');
            return;
        }

        const container = document.getElementById('postContainer');
        const status = document.getElementById('postStatus');

        try {
            const response = await fetch(`posts/${encodeURIComponent(slug)}.json`, { cache: 'no-store' });
            if (!response.ok) {
                throw new Error('Post not found');
            }

            const post = await response.json();
            setMeta(post.seo?.title || post.title, post.seo?.description || post.excerpt || 'Blog article');

            const contentBlocks = Array.isArray(post.content) ? post.content : [];
            const articleHtml = contentBlocks.map(renderContentBlock).join('');
            const tags = Array.isArray(post.tags) ? post.tags : [];
            const tagsHtml = tags.map(tag => {
                return `<span class="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-xs rounded-full">${escapeHtml(tag)}</span>`;
            }).join('');

            if (status) {
                status.remove();
            }

            container.innerHTML = `
                <header class="mb-10">
                    <a href="index.html" class="text-sm text-primary-600 dark:text-primary-400 hover:underline">← Back to all posts</a>
                    <h1 class="text-4xl md:text-5xl font-bold mt-4 mb-4">${escapeHtml(post.title)}</h1>
                    <div class="flex flex-wrap items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
                        <span>${escapeHtml(formatDate(post.publishedAt))}</span>
                        <span>•</span>
                        <span>${escapeHtml(post.readTime || '5 min read')}</span>
                        <span>•</span>
                        <span>${escapeHtml(post.categoryLabel || post.category || 'Article')}</span>
                    </div>
                    <div class="mt-4 flex flex-wrap gap-2">${tagsHtml}</div>
                </header>
                <section class="blog-post-content">${articleHtml}</section>
            `;
        } catch (error) {
            showError('Could not load this post right now.');
            console.error(error);
        }
    }

    document.addEventListener('DOMContentLoaded', () => {
        initThemeToggle();
        loadPost();
    });
})();
