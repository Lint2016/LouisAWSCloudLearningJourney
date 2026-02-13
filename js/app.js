/**
 * app.js
 * Main entry point for the Dashboard.
 */

import { Storage } from './storage.js';
import { Auth } from './auth.js';

async function initDashboard() {
    // 0. Auth Guard
    Auth.requireAuth();
    Auth.initAuthLink(); // Initializes Logout button

    // 1. Initialize Storage
    await Storage.init();

    // 2. Fetch Data
    const sessions = Storage.getSessions();

    // 3. Calculate Progress
    renderProgress(sessions);

    // 4. Find Next Session
    renderNextSession(sessions);

    // 5. Render Phase/Week
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

    // Filter for incomplete sessions
    // Since we removed dates, we just take the first uncompleted session in the list.
    // The list is naturally ordered by Week/Day from JSON.
    const incomplete = sessions.filter(s => !s.completed);

    if (incomplete.length > 0) {
        const next = incomplete[0];
        nextSessionContent.innerHTML = `
            <p style="font-weight: 700; font-size: 1.1rem; margin-bottom: 0.25rem;">${next.topic}</p>
            <p class="text-secondary">Week ${next.week} - ${next.day}</p>
            <p class="text-secondary" style="font-size: 0.9rem; margin-top: 0.5rem;">${next.title}</p>
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

    // Find the week of the next incomplete session
    const nextText = document.querySelector('#current-phase-content .text-secondary');
    const next = sessions.find(s => !s.completed);

    if (next) {
        phaseName.textContent = `Week ${next.week}`;
        if (nextText) nextText.textContent = next.title;
    } else {
        phaseName.textContent = "Journey Completed!";
        if (nextText) nextText.textContent = "You are ready for the Cloud.";
    }
}

// Start the app
document.addEventListener('DOMContentLoaded', initDashboard);
