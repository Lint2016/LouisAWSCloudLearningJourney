/**
 * app.js
 * Main entry point for the Dashboard.
 */

import { Storage } from './storage.js';

async function initDashboard() {
    // 1. Initialize Storage
    await Storage.init();

    // 2. Fetch Data
    const sessions = Storage.getSessions();

    // 3. Calculate Progress
    renderProgress(sessions);

    // 4. Find Next Session
    renderNextSession(sessions);

    // 5. Render Phase
    renderCurrentPhase(sessions);
}

function renderProgress(sessions) {
    const total = sessions.length;
    const completed = sessions.filter(s => s.completed).length;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

    const progressBar = document.getElementById('overall-progress-bar');
    const progressStats = document.getElementById('progress-stats');

    if (progressBar) progressBar.style.width = `${percentage}%`;
    if (progressStats) progressStats.textContent = `${completed} of ${total} sessions completed (${percentage}%)`;
}

function renderNextSession(sessions) {
    const nextSessionContent = document.getElementById('next-session-content');
    const goToBtn = document.getElementById('go-to-session-btn');

    if (!nextSessionContent) return;

    // Filter for incomplete sessions and sort by date
    const incomplete = sessions
        .filter(s => !s.completed)
        .sort((a, b) => new Date(a.date) - new Date(b.date));

    if (incomplete.length > 0) {
        const next = incomplete[0];
        nextSessionContent.innerHTML = `
            <p style="font-weight: 700; font-size: 1.1rem; margin-bottom: 0.25rem;">${next.topic}</p>
            <p class="text-secondary">${next.day}, ${formatDate(next.date)}</p>
            <p class="text-secondary" style="font-size: 0.9rem; margin-top: 0.5rem;">Phase: ${next.phase}</p>
        `;
        goToBtn.style.display = 'inline-flex';
        goToBtn.href = `session.html?id=${next.id}`;
    } else {
        nextSessionContent.innerHTML = `<p class="text-secondary">All sessions caught up! Great work. 🎉</p>`;
        goToBtn.style.display = 'none';
    }
}

function renderCurrentPhase(sessions) {
    const phaseName = document.getElementById('current-phase-name');
    if (!phaseName) return;

    // Find the phase of the next incomplete session
    const next = sessions.find(s => !s.completed);
    if (next) {
        phaseName.textContent = next.phase;
    } else {
        phaseName.textContent = "Journey Completed!";
    }
}

/**
 * Utility: Format date to a readable string
 */
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
}

// Start the app
document.addEventListener('DOMContentLoaded', initDashboard);
