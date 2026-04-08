/**
 * ui.js
 * Shared UI logic for the application.
 */

export function initMobileMenu() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            navMenu.classList.toggle('show');
        });

        // Close menu when clicking a link
        navMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('show');
            });
        });

        // Close menu when clicking outside (on the backdrop)
        document.addEventListener('click', (e) => {
            if (navMenu.classList.contains('show') && !navMenu.contains(e.target) && !hamburger.contains(e.target)) {
                navMenu.classList.remove('show');
            }
        });
    }
}

export function initPasswordToggle() {
    const eyeIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-eye"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0z"/><circle cx="12" cy="12" r="3"/></svg>`;
    const eyeOffIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-eye-off"><path d="M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49"/><path d="M14.084 14.158a3 3 0 0 1-4.242-4.242"/><path d="M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143"/><path d="m2 2 20 20"/></svg>`;

    const toggleButtons = document.querySelectorAll('.password-toggle-btn');

    toggleButtons.forEach(btn => {
        // Set initial icon
        btn.innerHTML = eyeIcon;

        btn.addEventListener('click', () => {
            const wrapper = btn.closest('.password-toggle-wrapper');
            const input = wrapper.querySelector('input');

            if (input.type === 'password') {
                input.type = 'text';
                btn.innerHTML = eyeOffIcon;
            } else {
                input.type = 'password';
                btn.innerHTML = eyeIcon;
            }
        });
    });
}

