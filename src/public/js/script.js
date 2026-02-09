

document.addEventListener('DOMContentLoaded', () => {
    // Mobile menu (only when present)
    const mobileMenu = document.getElementById('mobile-menu');
    const openButton = document.getElementById('mobile-menu-toggle-button');
    const closeButton = document.getElementById('mobile-menu-close-button');
    if (mobileMenu && (openButton || closeButton)) {
        const openMenu = () => mobileMenu.classList.remove('-translate-x-full');
        const closeMenu = () => mobileMenu.classList.add('-translate-x-full');
        if (openButton) openButton.addEventListener('click', openMenu);
        if (closeButton) closeButton.addEventListener('click', closeMenu);
        mobileMenu.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
    }

    // Show toasts from URL query (success / error)
    const container = document.getElementById('toast-container');
    if (container && typeof showToast === 'function' && window.location.search) {
        const params = new URLSearchParams(window.location.search);
        const success = params.get('success');
        const error = params.get('error');
        if (success) {
            showToast(decodeURIComponent(success), 'success');
        }
        if (error) {
            showToast(decodeURIComponent(error), 'error');
        }
        if (success || error) {
            params.delete('success');
            params.delete('error');
            const newSearch = params.toString();
            const url = window.location.pathname + (newSearch ? '?' + newSearch : '') + window.location.hash;
            history.replaceState({}, '', url);
        }
    }
});



function showToast(message, type = "info", duration = 4000) {
    const container = document.getElementById("toast-container");
    if (!container) return;

    const colors = {
        success: "from-green-500/80 to-green-600/80 text-white",
        error: "from-red-500/80 to-red-600/80 text-white",
        info: "from-blue-500/80 to-blue-600/80 text-white",
        warning: "from-yellow-400/80 to-yellow-500/80 text-gray-900",
    };

    const icons = {
        success: '<i class="fa-solid fa-circle-check text-white/90"></i>',
        error: '<i class="fa-solid fa-circle-xmark text-white/90"></i>',
        info: '<i class="fa-solid fa-circle-info text-white/90"></i>',
        warning: '<i class="fa-solid fa-triangle-exclamation text-gray-800"></i>',
    };

    // Toast element
    const toast = document.createElement("div");
    toast.className = `
    flex items-center gap-3 rounded-xl px-5 py-4 shadow-2xl 
    bg-gradient-to-br backdrop-blur-lg border border-white/20
    ${colors[type]} opacity-0 translate-x-10 transition-all duration-500
  `;
    toast.innerHTML = `
    <div class="text-xl flex-shrink-0">${icons[type]}</div>
    <div class="text-sm font-medium leading-snug">${message}</div>
  `;

    container.appendChild(toast);

    // Animate in
    requestAnimationFrame(() => {
        toast.classList.remove("opacity-0", "translate-x-10");
        toast.classList.add("opacity-100", "translate-x-0");
    });

    // Auto-remove after duration
    setTimeout(() => {
        toast.classList.remove("opacity-100", "translate-x-0");
        toast.classList.add("opacity-0", "translate-x-10");
        setTimeout(() => toast.remove(), 400);
    }, duration);
}

// Optional: expose globally
window.showToast = showToast;
// showToast("Appointment booked successfully!", "success");
// showToast("Something went wrong. Try again.", "error");
// showToast("Loading data...", "info");
// showToast("Password is weak!", "warning");