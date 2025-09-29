// Initialize AOS (Animate On Scroll)
document.addEventListener('DOMContentLoaded', function() {
    AOS.init({
        duration: 800,
        easing: 'ease-in-out',
        once: true,
        offset: 100
    });
    
    // Initialize signup count animation
    animateSignupCount();
    
    // Initialize mobile menu
    initializeMobileMenu();
});

// Mobile Menu Functionality
function initializeMobileMenu() {
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const mobileMenuDropdown = document.getElementById('mobileMenuDropdown');
    const mobileMenuLinks = document.querySelectorAll('.mobile-menu-link');
    
    if (!mobileMenuToggle || !mobileMenuDropdown) return;
    
    // Toggle mobile menu
    mobileMenuToggle.addEventListener('click', function(e) {
        e.stopPropagation();
        toggleMobileMenu();
    });
    
    // Close mobile menu when clicking links
    mobileMenuLinks.forEach(link => {
        link.addEventListener('click', function() {
            closeMobileMenu();
        });
    });
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!mobileMenuToggle.contains(e.target) && !mobileMenuDropdown.contains(e.target)) {
            closeMobileMenu();
        }
    });
    
    // Close mobile menu on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && mobileMenuDropdown.classList.contains('active')) {
            closeMobileMenu();
        }
    });
}

function toggleMobileMenu() {
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const mobileMenuDropdown = document.getElementById('mobileMenuDropdown');
    
    if (mobileMenuToggle && mobileMenuDropdown) {
        mobileMenuToggle.classList.toggle('active');
        mobileMenuDropdown.classList.toggle('active');
    }
}

function closeMobileMenu() {
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const mobileMenuDropdown = document.getElementById('mobileMenuDropdown');
    
    if (mobileMenuToggle && mobileMenuDropdown) {
        mobileMenuToggle.classList.remove('active');
        mobileMenuDropdown.classList.remove('active');
    }
}

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Scroll to beta section function
function scrollToBeta() {
    document.getElementById('beta').scrollIntoView({
        behavior: 'smooth',
        block: 'start'
    });
}

// Beta form submission with Netlify Forms
document.getElementById('betaForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const submitBtn = this.querySelector('.submit-btn');
    const btnText = submitBtn.querySelector('.btn-text');
    
    // Validate email
    if (!isValidEmail(email)) {
        showErrorModal('Por favor, insira um email válido.');
        return;
    }
    
    // Show loading state
    showLoadingModal();
    submitBtn.classList.add('loading');
    submitBtn.disabled = true;
    
    try {
        // Check if running locally
        const isLocal = window.location.protocol === 'file:' || 
                       window.location.hostname === 'localhost' || 
                       window.location.hostname === '127.0.0.1';
        
        if (isLocal) {
            // Local testing - simulate success
            console.log('Form data (local test):', {
                email: email,
                subject: 'Quero ser um testador',
                message: `Novo testador beta inscrito: ${email}`,
                timestamp: new Date().toLocaleString('pt-BR')
            });
            
            // Simulate network delay
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            hideLoadingModal();
            showSuccessModal();
            updateSignupCount();
            this.reset();
            
            // Aviso para o usuário
            console.warn('⚠️ MODO TESTE LOCAL: Email não foi enviado realmente!');
            console.warn('📧 Para envio real, faça deploy no Netlify');
            return;
        }
        
        // Prepare form data for Netlify
        const formData = new FormData();
        formData.append('form-name', 'beta-signup');
        formData.append('email', email);
        formData.append('subject', 'Quero ser um testador');
        formData.append('message', `Novo testador beta inscrito: ${email}`);
        formData.append('timestamp', new Date().toLocaleString('pt-BR'));
        
        // Submit to Netlify Forms
        const response = await fetch('/', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/x-www-form-urlencoded',
                'Accept': 'text/html'
            },
            body: new URLSearchParams(formData).toString()
        });
        
        if (response.ok) {
            // Save to localStorage for demo purposes
            const existingEmails = JSON.parse(localStorage.getItem('betaEmails') || '[]');
            if (!existingEmails.includes(email)) {
                existingEmails.push(email);
                localStorage.setItem('betaEmails', JSON.stringify(existingEmails));
            }
            
            // Update signup count
            updateSignupCount(existingEmails.length);
            
            // Show success modal
            hideLoadingModal();
            showSuccessModal();
            
            // Reset form
            this.reset();
            
            console.log('✅ Formulário enviado com sucesso para Netlify Forms');
            console.log(`📧 Email: ${email}`);
            console.log(`📝 Assunto: Quero ser um testador`);
            
        } else {
            throw new Error('Erro ao enviar formulário para Netlify');
        }
        
    } catch (error) {
        console.error('Error submitting form:', error);
        hideLoadingModal();
        showErrorModal('Erro ao processar inscrição. Tente novamente ou entre em contato conosco.');
    } finally {
        // Reset button state
        submitBtn.classList.remove('loading');
        submitBtn.disabled = false;
        btnText.textContent = 'Participar';
    }
});

// Email validation
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Show success modal
function showSuccessModal() {
    const modal = document.getElementById('successModal');
    modal.style.display = 'block';
    
    // Animate modal content
    const modalContent = modal.querySelector('.modal-content');
    modalContent.style.transform = 'translate(-50%, -50%) scale(0.8)';
    modalContent.style.opacity = '0';
    
    setTimeout(() => {
        modalContent.style.transform = 'translate(-50%, -50%) scale(1)';
        modalContent.style.opacity = '1';
    }, 100);
}

// Show loading modal
function showLoadingModal() {
    const modal = document.getElementById('loadingModal');
    modal.style.display = 'block';
    
    const modalContent = modal.querySelector('.modal-content');
    modalContent.style.transform = 'translate(-50%, -50%) scale(0.8)';
    modalContent.style.opacity = '0';
    
    setTimeout(() => {
        modalContent.style.transform = 'translate(-50%, -50%) scale(1)';
        modalContent.style.opacity = '1';
    }, 100);
}

// Hide loading modal
function hideLoadingModal() {
    const modal = document.getElementById('loadingModal');
    const modalContent = modal.querySelector('.modal-content');
    
    modalContent.style.transform = 'translate(-50%, -50%) scale(0.8)';
    modalContent.style.opacity = '0';
    
    setTimeout(() => {
        modal.style.display = 'none';
    }, 300);
}

// Show error modal
function showErrorModal(message) {
    const modal = document.getElementById('errorModal');
    const errorMessage = document.getElementById('errorMessage');
    
    errorMessage.textContent = message;
    modal.style.display = 'block';
    
    const modalContent = modal.querySelector('.modal-content');
    modalContent.style.transform = 'translate(-50%, -50%) scale(0.8)';
    modalContent.style.opacity = '0';
    
    setTimeout(() => {
        modalContent.style.transform = 'translate(-50%, -50%) scale(1)';
        modalContent.style.opacity = '1';
    }, 100);
}

// Close modal functions
function closeModal() {
    const modal = document.getElementById('successModal');
    const modalContent = modal.querySelector('.modal-content');
    
    modalContent.style.transform = 'translate(-50%, -50%) scale(0.8)';
    modalContent.style.opacity = '0';
    
    setTimeout(() => {
        modal.style.display = 'none';
    }, 300);
}

function closeErrorModal() {
    const modal = document.getElementById('errorModal');
    const modalContent = modal.querySelector('.modal-content');
    
    modalContent.style.transform = 'translate(-50%, -50%) scale(0.8)';
    modalContent.style.opacity = '0';
    
    setTimeout(() => {
        modal.style.display = 'none';
    }, 300);
}

// Close modals when clicking outside
window.addEventListener('click', function(e) {
    const successModal = document.getElementById('successModal');
    const loadingModal = document.getElementById('loadingModal');
    const errorModal = document.getElementById('errorModal');
    
    if (e.target === successModal) {
        closeModal();
    }
    if (e.target === errorModal) {
        closeErrorModal();
    }
});

// Animate signup count
function animateSignupCount() {
    const countElement = document.getElementById('signupCount');
    if (countElement) {
        const targetCount = getStoredEmailCount();
        animateNumber(countElement, 0, targetCount, 2000);
    }
}

// Update signup count
function updateSignupCount(newCount) {
    const countElement = document.getElementById('signupCount');
    if (countElement) {
        const currentCount = parseInt(countElement.textContent) || 0;
        animateNumber(countElement, currentCount, newCount, 1000);
    }
}

// Animate number
function animateNumber(element, start, end, duration, originalText) {
    if (!element) return;
    
    const startTime = performance.now();
    
    function updateNumber(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function (ease-out)
        const easeOut = 1 - Math.pow(1 - progress, 3);
        
        const current = Math.floor(start + (end - start) * easeOut);
        
        if (originalText) {
            const suffix = originalText.replace(/[\d]/g, '');
            if (suffix.includes('R$')) {
                element.textContent = `R$ ${current}`;
            } else {
                element.textContent = `${current}${suffix}`;
            }
        } else {
            element.textContent = current;
        }
        
        if (progress < 1) {
            requestAnimationFrame(updateNumber);
        } else {
            element.textContent = originalText || end;
        }
    }
    
    requestAnimationFrame(updateNumber);
}

// Get stored email count
function getStoredEmailCount() {
    const emails = JSON.parse(localStorage.getItem('betaEmails') || '[]');
    return emails.length;
}

// Parallax effect for hero section
window.addEventListener('scroll', function() {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    const phoneMockup = document.querySelector('.phone-mockup');
    
    if (hero && phoneMockup) {
        const rate = scrolled * -0.5;
        phoneMockup.style.transform = `translateY(${rate}px) perspective(1000px) rotateY(-15deg) rotateX(10deg)`;
    }
    
    // Navbar background on scroll
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        if (scrolled > 50) {
            navbar.style.background = 'rgba(26, 26, 26, 0.98)';
            navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        } else {
            navbar.style.background = 'rgba(26, 26, 26, 0.95)';
            navbar.style.boxShadow = 'none';
        }
    }
});

// Feature cards hover effect
document.querySelectorAll('.feature-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-10px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

// Phone mockup animation on scroll
const observerOptions = {
    threshold: 0.5,
    rootMargin: '0px 0px -100px 0px'
};

const phoneObserver = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const phone = entry.target;
            phone.style.animation = 'float 3s ease-in-out infinite';
        }
    });
}, observerOptions);

document.addEventListener('DOMContentLoaded', function() {
    const phoneMockup = document.querySelector('.phone-mockup');
    if (phoneMockup) {
        phoneObserver.observe(phoneMockup);
    }
});

// Add floating animation
const style = document.createElement('style');
style.textContent = `
    @keyframes float {
        0%, 100% {
            transform: perspective(1000px) rotateY(-15deg) rotateX(10deg) translateY(0px);
        }
        50% {
            transform: perspective(1000px) rotateY(-15deg) rotateX(10deg) translateY(-10px);
        }
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        gap: 12px;
    }
    
    .notification-content i {
        font-size: 1.2rem;
    }
`;
document.head.appendChild(style);

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Add loading animation to CTA button
    const ctaButton = document.querySelector('.cta-button');
    if (ctaButton) {
        ctaButton.addEventListener('click', function() {
            this.style.transform = 'translateY(-2px) scale(0.98)';
            setTimeout(() => {
                this.style.transform = 'translateY(-2px) scale(1)';
            }, 150);
        });
    }
    
    // Add typing animation to hero title
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        const spanElement = heroTitle.querySelector('.gradient-text');
        if (spanElement) {
            const text = spanElement.textContent;
            spanElement.textContent = '';
            heroTitle.style.opacity = '1';
            
            let i = 0;
            const typeWriter = () => {
                if (i < text.length) {
                    spanElement.textContent += text.charAt(i);
                    i++;
                    setTimeout(typeWriter, 50);
                }
            };
            
            setTimeout(typeWriter, 1000);
        }
    }
});

// Add smooth reveal animation for stats
function revealStats() {
    const stats = document.querySelectorAll('.stat-number');
    stats.forEach(stat => {
        const finalValue = stat.textContent;
        if (finalValue) {
            const numericValue = parseInt(finalValue.replace(/[^\d]/g, ''));
            
            if (!isNaN(numericValue)) {
                animateNumberEnhanced(stat, 0, numericValue, 2000, finalValue);
            }
        }
    });
}

// Enhanced animate number function with suffix/prefix support
function animateNumberEnhanced(element, start, end, duration, originalText) {
    const startTime = performance.now();
    const suffix = originalText ? originalText.replace(/[\d]/g, '') : '';
    
    function updateNumber(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const current = Math.floor(start + (end - start) * easeOut);
        
        if (originalText && suffix.includes('R$')) {
            element.textContent = `R$ ${current}`;
        } else if (originalText) {
            element.textContent = `${current}${suffix}`;
        } else {
            element.textContent = current;
        }
        
        if (progress < 1) {
            requestAnimationFrame(updateNumber);
        } else {
            element.textContent = originalText || current;
        }
    }
    
    requestAnimationFrame(updateNumber);
}

// Trigger stats animation when hero section is visible
const heroObserver = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            setTimeout(revealStats, 500);
            heroObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

document.addEventListener('DOMContentLoaded', function() {
    const heroStats = document.querySelector('.hero-stats');
    if (heroStats) {
        heroObserver.observe(heroStats);
    }
});

// Interactive form enhancements
document.addEventListener('DOMContentLoaded', function() {
    const emailInput = document.getElementById('email');
    const submitBtn = document.querySelector('.submit-btn');
    
    // Real-time email validation
    emailInput.addEventListener('input', function() {
        const isValid = isValidEmail(this.value);
        const wrapper = this.parentElement;
        
        if (this.value.length > 0) {
            if (isValid) {
                wrapper.classList.add('valid');
                wrapper.classList.remove('invalid');
            } else {
                wrapper.classList.add('invalid');
                wrapper.classList.remove('valid');
            }
        } else {
            wrapper.classList.remove('valid', 'invalid');
        }
    });
    
    // Form submission with Enter key
    emailInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            submitBtn.click();
        }
    });
});

// Add CSS for validation states
const validationStyles = document.createElement('style');
validationStyles.textContent = `
    .input-wrapper.valid input {
        border-color: #10b981 !important;
        box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1) !important;
    }
    
    .input-wrapper.valid i {
        color: #10b981 !important;
    }
    
    .input-wrapper.invalid input {
        border-color: #ef4444 !important;
        box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1) !important;
    }
    
    .input-wrapper.invalid i {
        color: #ef4444 !important;
    }
`;
document.head.appendChild(validationStyles);