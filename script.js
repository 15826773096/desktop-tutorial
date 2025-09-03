// 导航栏功能
document.addEventListener('DOMContentLoaded', function () {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.content-section');
    const navToggle = document.querySelector('.nav-toggle');
    const navLinksContainer = document.querySelector('.nav-links');
    const backToTop = document.getElementById('backToTop');

    // 导航链接点击事件
    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('data-target');

            // 移除所有活跃状态
            navLinks.forEach(l => l.classList.remove('active'));
            // 添加当前活跃状态
            this.classList.add('active');

            // 滚动到目标区域
            if (targetId) {
                scrollToSection(targetId);
            }

            // 移动端关闭菜单
            navLinksContainer.classList.remove('active');
            navToggle.classList.remove('active');
        });
    });

    // 移动端菜单切换
    navToggle.addEventListener('click', function () {
        navLinksContainer.classList.toggle('active');
        navToggle.classList.toggle('active');
    });

    // 滚动监听
    window.addEventListener('scroll', function () {
        const scrollY = window.scrollY;

        // 导航栏透明度
        const nav = document.querySelector('.nav-container');
        if (scrollY > 100) {
            nav.style.background = 'rgba(10, 10, 15, 0.95)';
        } else {
            nav.style.background = 'rgba(10, 10, 15, 0.9)';
        }

        // 返回顶部按钮
        if (scrollY > 500) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }

        // 更新导航栏活跃状态
        updateActiveNav();

        // 视差效果
        updateParallax();

        // 处理滚动淡出效果
        handleScrollFadeEffect();
    });

    // 返回顶部
    backToTop.addEventListener('click', function () {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // 初始化粒子系统
    initParticles();

    // 初始化入场动画
    initAnimations();

    // 初始化交互效果
    initInteractions();
});

// 滚动到指定区域
function scrollToSection(sectionId) {
    const element = document.getElementById(sectionId);
    if (element) {
        const offsetTop = element.offsetTop - 80; // 导航栏高度
        window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
        });
    }
}

// 更新导航栏活跃状态
function updateActiveNav() {
    const sections = ['hero', 'about', 'hobbies', 'achievements', 'projects', 'contact'];
    const navLinks = document.querySelectorAll('.nav-link');
    let currentSection = 'hero';

    sections.forEach(sectionId => {
        const element = document.getElementById(sectionId);
        if (element) {
            const rect = element.getBoundingClientRect();
            if (rect.top <= 100 && rect.bottom >= 100) {
                currentSection = sectionId;
            }
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('data-target') === currentSection) {
            link.classList.add('active');
        }
    });
}

// 视差效果（现在由handleScrollFadeEffect处理）
function updateParallax() {
    // 视差效果现在在handleScrollFadeEffect中处理，避免冲突
    // const scrollY = window.scrollY;
    // const heroSection = document.querySelector('.hero-section');
    // 
    // if (heroSection) {
    //     heroSection.style.transform = `translateY(${scrollY * 0.5}px)`;
    // }
}

// 处理滚动淡出效果
function handleScrollFadeEffect() {
    const scrollY = window.scrollY;
    const aboutSection = document.getElementById('about');
    const heroSection = document.querySelector('.hero-section');

    if (!aboutSection || !heroSection) return;

    // 获取关于我section的位置
    const aboutTop = aboutSection.offsetTop;
    const windowHeight = window.innerHeight;

    // 简化的淡出逻辑：当用户滚动超过Hero section高度的50%时开始淡出
    const heroHeight = heroSection.offsetHeight;
    const fadeStartPoint = heroHeight * 0.5;
    const fadeEndPoint = heroHeight * 1.2;

    let opacity = 1;
    let translateY = 0;

    // 计算基础视差效果
    const parallaxOffset = scrollY * 0.3;

    if (scrollY > fadeStartPoint) {
        if (scrollY <= fadeEndPoint) {
            // 在淡出范围内
            const fadeProgress = (scrollY - fadeStartPoint) / (fadeEndPoint - fadeStartPoint);
            opacity = Math.max(0, 1 - fadeProgress);
            translateY = fadeProgress * -30;
        } else {
            // 超过淡出范围，完全隐藏
            opacity = 0;
            translateY = -30;
        }
    } else {
        // 在淡出范围之前，完全显示
        opacity = 1;
        translateY = 0;
    }

    // 应用效果
    heroSection.style.opacity = opacity;
    heroSection.style.transform = `translateY(${parallaxOffset + translateY}px)`;
}

// 粒子系统
function initParticles() {
    const canvas = document.getElementById('particles');
    const ctx = canvas.getContext('2d');

    // 设置画布大小
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // 粒子数组
    const particles = [];
    const particleCount = 100;

    // 粒子类
    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.vx = (Math.random() - 0.5) * 2;
            this.vy = (Math.random() - 0.5) * 2;
            this.size = Math.random() * 2 + 1;
            this.opacity = Math.random() * 0.5 + 0.2;
            this.color = Math.random() > 0.5 ? '#00ffff' : '#ff00ff';
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            // 边界检测
            if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
            if (this.y < 0 || this.y > canvas.height) this.vy *= -1;

            // 保持在画布内
            this.x = Math.max(0, Math.min(canvas.width, this.x));
            this.y = Math.max(0, Math.min(canvas.height, this.y));
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.globalAlpha = this.opacity;
            ctx.fill();
        }
    }

    // 创建粒子
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }

    // 动画循环
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // 更新和绘制粒子
        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });

        // 绘制连接线
        drawConnections();

        requestAnimationFrame(animate);
    }

    // 绘制粒子连接线
    function drawConnections() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 100) {
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = '#00ffff';
                    ctx.globalAlpha = (100 - distance) / 100 * 0.2;
                    ctx.lineWidth = 1;
                    ctx.stroke();
                }
            }
        }
    }

    animate();
}

// 入场动画
function initAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);

    // 观察所有需要动画的元素
    const animateElements = document.querySelectorAll(
        '.about-card, .hobby-card, .timeline-item, .project-card, .contact-method'
    );

    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(50px)';
        el.style.transition = 'all 0.6s ease-out';
        observer.observe(el);
    });

    // 添加CSS类
    const style = document.createElement('style');
    style.textContent = `
        .animate-in {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    `;
    document.head.appendChild(style);
}

// 交互效果
function initInteractions() {
    // 鼠标跟随效果
    let mouseX = 0;
    let mouseY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;

        // 更新自定义光标效果
        updateCursor(mouseX, mouseY);
    });

    // 卡片3D倾斜效果
    const cards = document.querySelectorAll('.about-card, .hobby-card, .project-card');
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0)';
        });
    });

    // 打字机效果
    typewriterEffect();

    // 数字计数动画
    countUpAnimation();

    // 技能标签悬浮效果
    skillTagEffects();
}

// 自定义光标效果
function updateCursor(x, y) {
    // 创建光标跟随元素（如果不存在）
    let cursor = document.querySelector('.custom-cursor');
    if (!cursor) {
        cursor = document.createElement('div');
        cursor.className = 'custom-cursor';
        cursor.style.cssText = `
            position: fixed;
            width: 20px;
            height: 20px;
            background: radial-gradient(circle, #00ffff 0%, transparent 70%);
            border-radius: 50%;
            pointer-events: none;
            z-index: 9999;
            mix-blend-mode: difference;
            transition: transform 0.1s ease;
        `;
        document.body.appendChild(cursor);
    }

    cursor.style.left = (x - 10) + 'px';
    cursor.style.top = (y - 10) + 'px';
}

// 打字机效果
function typewriterEffect() {
    const texts = [
        "数字追梦者",
        "全栈创新者",
        "技术探索者",
        "代码艺术家"
    ];

    const subtitle = document.querySelector('.title-subtitle');
    if (!subtitle) return;

    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function type() {
        const currentText = texts[textIndex];

        if (isDeleting) {
            subtitle.textContent = currentText.substring(0, charIndex - 1);
            charIndex--;
        } else {
            subtitle.textContent = currentText.substring(0, charIndex + 1);
            charIndex++;
        }

        let typeSpeed = isDeleting ? 50 : 100;

        if (!isDeleting && charIndex === currentText.length) {
            typeSpeed = 2000; // 停留时间
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            textIndex = (textIndex + 1) % texts.length;
            typeSpeed = 500;
        }

        setTimeout(type, typeSpeed);
    }

    setTimeout(type, 1000);
}

// 数字计数动画
function countUpAnimation() {
    const statNumbers = document.querySelectorAll('.stat-number');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const finalValue = target.textContent;

                if (finalValue.includes('%')) {
                    animateNumber(target, 0, parseInt(finalValue), 2000, '%');
                } else if (finalValue === '985') {
                    animateNumber(target, 900, 985, 1500);
                } else if (finalValue === '国一') {
                    target.textContent = '国一';
                    target.style.animation = 'glow 2s ease-in-out infinite';
                }

                observer.unobserve(target);
            }
        });
    });

    statNumbers.forEach(num => observer.observe(num));
}

function animateNumber(element, start, end, duration, suffix = '') {
    const startTime = performance.now();

    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        const current = Math.floor(start + (end - start) * easeOutCubic(progress));
        element.textContent = current + suffix;

        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }

    requestAnimationFrame(update);
}

function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
}

// 技能标签效果
function skillTagEffects() {
    const tags = document.querySelectorAll('.trait-tag, .achievement-tag, .tech-tag');

    tags.forEach(tag => {
        tag.addEventListener('mouseenter', () => {
            tag.style.transform = 'scale(1.1) translateY(-2px)';
            tag.style.boxShadow = '0 5px 15px rgba(0, 255, 255, 0.3)';
        });

        tag.addEventListener('mouseleave', () => {
            tag.style.transform = 'scale(1) translateY(0)';
            tag.style.boxShadow = 'none';
        });
    });
}

// 图片懒加载
function initLazyLoading() {
    const images = document.querySelectorAll('img[loading="lazy"]');

    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.src;
                img.classList.add('loaded');
                imageObserver.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));
}

// 性能优化：节流函数
function throttle(func, limit) {
    let inThrottle;
    return function () {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// 移动端触摸手势
function initTouchGestures() {
    let startY = 0;
    let currentY = 0;

    document.addEventListener('touchstart', (e) => {
        startY = e.touches[0].clientY;
    });

    document.addEventListener('touchmove', (e) => {
        currentY = e.touches[0].clientY;
    });

    document.addEventListener('touchend', () => {
        const deltaY = startY - currentY;

        if (Math.abs(deltaY) > 50) {
            if (deltaY > 0) {
                // 向上滑动
                scrollToNextSection();
            } else {
                // 向下滑动
                scrollToPrevSection();
            }
        }
    });
}

function scrollToNextSection() {
    const sections = ['hero', 'about', 'hobbies', 'achievements', 'projects', 'contact'];
    const currentActive = document.querySelector('.nav-link.active');
    const currentTarget = currentActive ? currentActive.getAttribute('data-target') : 'hero';
    const currentIndex = sections.indexOf(currentTarget);

    if (currentIndex < sections.length - 1) {
        scrollToSection(sections[currentIndex + 1]);
    }
}

function scrollToPrevSection() {
    const sections = ['hero', 'about', 'hobbies', 'achievements', 'projects', 'contact'];
    const currentActive = document.querySelector('.nav-link.active');
    const currentTarget = currentActive ? currentActive.getAttribute('data-target') : 'hero';
    const currentIndex = sections.indexOf(currentTarget);

    if (currentIndex > 0) {
        scrollToSection(sections[currentIndex - 1]);
    }
}

// 初始化所有功能
document.addEventListener('DOMContentLoaded', function () {
    initLazyLoading();
    initTouchGestures();

    // 添加加载完成类
    setTimeout(() => {
        document.body.classList.add('loaded');
    }, 500);
});

// 错误处理
window.addEventListener('error', (e) => {
    console.warn('页面加载出现问题，但不影响基本功能使用');
});

// 添加键盘导航支持
document.addEventListener('keydown', (e) => {
    switch (e.key) {
        case 'ArrowDown':
        case 'PageDown':
            e.preventDefault();
            scrollToNextSection();
            break;
        case 'ArrowUp':
        case 'PageUp':
            e.preventDefault();
            scrollToPrevSection();
            break;
        case 'Home':
            e.preventDefault();
            scrollToSection('hero');
            break;
        case 'End':
            e.preventDefault();
            scrollToSection('contact');
            break;
    }
});