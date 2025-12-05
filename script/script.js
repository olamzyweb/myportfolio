    // Animate service cards on scroll
            document.addEventListener('DOMContentLoaded', function () {
                function animateServiceCards() {
                    document.querySelectorAll('.service-card').forEach((card, idx) => {
                        const rect = card.getBoundingClientRect();
                        if (rect.top < window.innerHeight - 60) {
                            setTimeout(() => {
                                card.classList.add('visible');
                            }, idx * 20);
                        }
                    });
                }
                animateServiceCards();
                window.addEventListener('scroll', animateServiceCards);
            });

             // Theme toggle functionality
    const themeToggle = document.getElementById('themeToggle');
    const htmlElement = document.documentElement;
    
    // Check for saved theme preference or respect OS preference
    if (localStorage.getItem('theme') === 'dark' || 
        (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        htmlElement.classList.add('dark');
    } else {
        htmlElement.classList.remove('dark');
    }

    // Add click event listener to toggle theme
themeToggle.addEventListener('click', () => {
    htmlElement.classList.toggle('dark');
    localStorage.setItem('theme', htmlElement.classList.contains('dark') ? 'dark' : 'light');
});
    
    // Scroll animations - unified approach
    function checkVisibility() {
        const sections = document.querySelectorAll('.section, .animate-fadein');
        
        sections.forEach(section => {
            const sectionTop = section.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (sectionTop < windowHeight * 0.75) {
                section.classList.add('visible');
            }
        });
    }
    
    // Initialize particles background
    function initParticles() {
        const container = document.getElementById('particles-container');
        const particleCount = 30;
        
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
            
            container.appendChild(particle);
        }
    }
    
    // Initialize typing effect
    function initTypingEffect() {
        const phrases = [
            "a Full Stack Developer",
            // "an IT Support Specialist",
            "a Web Designer",
            "a DevOps Engineer",
            "a Tech Enthusiast"
        ];
        
        let currentPhrase = 0;
        const typingElement = document.querySelector('.typing-text');
        
        function typeNextPhrase() {
            typingElement.textContent = phrases[currentPhrase];
            typingElement.style.animation = 'none';
            void typingElement.offsetWidth;
            typingElement.style.animation = null;
            
            currentPhrase = (currentPhrase + 1) % phrases.length;
            setTimeout(typeNextPhrase, 3500);
        }
        
        setTimeout(typeNextPhrase, 3500);
    }
    
    // Animate service cards on scroll
    function animateServiceCards() {
        document.querySelectorAll('.service-card').forEach((card, idx) => {
            const rect = card.getBoundingClientRect();
            if (rect.top < window.innerHeight - 60) {
                setTimeout(() => {
                    card.classList.add('visible');
                }, idx * 120);
            }
        });
    }
    
    // Initialize everything when DOM is loaded
    document.addEventListener('DOMContentLoaded', () => {
        checkVisibility(); // Check initial visibility
        initParticles();
        initTypingEffect();
        animateServiceCards();
        
        // Add scroll listener
        window.addEventListener('scroll', () => {
            checkVisibility();
            animateServiceCards();
        });
        
        // Smooth scroll for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                const targetId = this.getAttribute('href').slice(1);
                const target = document.getElementById(targetId);
                if (target) {
                    e.preventDefault();
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            });
        });
    });