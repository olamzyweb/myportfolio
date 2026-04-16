// Theme toggle
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

        // Particles
        function initParticles() {
            const container = document.getElementById('particles-container');
            const particleCount = 20;
            
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

        // Category filtering
        const categoryButtons = document.querySelectorAll('.category-badge');
        const blogPosts = document.querySelectorAll('.blog-card');

        categoryButtons.forEach(button => {
            button.addEventListener('click', () => {
                const category = button.dataset.category;
                
                categoryButtons.forEach(btn => {
                    btn.classList.remove('bg-primary-600', 'text-white');
                    btn.classList.add('bg-white', 'dark:bg-gray-700', 'text-gray-800', 'dark:text-gray-200');
                });
                
                button.classList.remove('bg-white', 'dark:bg-gray-700', 'text-gray-800', 'dark:text-gray-200');
                button.classList.add('bg-primary-600', 'text-white');
                
                blogPosts.forEach(post => {
                    if (category === 'all' || post.dataset.category.includes(category)) {
                        post.style.display = 'block';
                    } else {
                        post.style.display = 'none';
                    }
                });
            });
        });

        // Fade in animation
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
    checkVisibility();
    window.addEventListener('scroll', checkVisibility);
});