/**
 * schedule.js
 * Logic for the timeline view.
 */

import { Storage } from './storage.js';
import { Auth } from './auth.js';
import { initMobileMenu } from './ui.js';

async function initSchedule() {
    Auth.requireAuth();
    Auth.initAuthLink();

    await Storage.init();
    const sessions = Storage.getSessions();
    renderSchedule(sessions);
    initMobileMenu();
}

function renderSchedule(sessions) {
    const container = document.getElementById('schedule-container');
    if (!container) return;

    if (sessions.length === 0) {
        container.innerHTML = '<p class="text-secondary">No sessions found.</p>';
        return;
    }

    container.innerHTML = ''; // Clear loading text

    // Sort by Week, then by Day (Friday before Saturday)
    sessions.sort((a, b) => {
        if (a.week !== b.week) return a.week - b.week;
        // Simple day sort: Friday comes before Saturday alphabetically? No.
        // F < S, so Friday (F) comes before Saturday (S). That works coincidentally.
        // But let's be safer.
        const days = { 'Friday': 1, 'Saturday': 2 };
        return (days[a.day] || 0) - (days[b.day] || 0);
    });

    let currentWeek = null;

    sessions.forEach(session => {
        if (session.week !== currentWeek) {
            currentWeek = session.week;
            // Create a week header/container
            const weekHeader = document.createElement('h2');
            weekHeader.className = 'mt-1 mb-2';
            weekHeader.innerHTML = `Week ${currentWeek} <span style="font-weight: 400; color: var(--text-secondary); font-size: 1rem;">— ${session.title}</span>`;
            weekHeader.style.borderBottom = '1px solid var(--border)';
            weekHeader.style.paddingBottom = '0.5rem';
            weekHeader.style.marginTop = '2rem';

            container.appendChild(weekHeader);
        }

        const card = document.createElement('div');
        card.className = 'card session-card';
        if (session.completed) card.classList.add('completed-session');

        const taskCount = session.tasks.length;
        const tasksCompleted = session.tasks.filter(t => t.completed).length;

        card.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: start; flex-wrap: wrap; gap: 1rem;">
                <div>
                    <span class="badge ${session.completed ? 'badge-success' : 'badge-neutral'}">
                        ${session.completed ? 'Completed' : 'Upcoming'}
                    </span>
                    <h3 style="margin: 0.5rem 0;">${session.topic}</h3>
                    <p class="text-secondary" style="font-size: 0.9rem;">${session.day}</p>
                </div>
                <div style="text-align: right;">
                     <p class="text-secondary" style="font-size: 0.9rem;">Tasks: ${tasksCompleted}/${taskCount}</p>
                     <a href="session.html?id=${session.id}" class="btn btn-outline" style="margin-top: 0.5rem;">View Details</a>
                </div>
            </div>
        `;

        container.appendChild(card);
    });
}

// Start
document.addEventListener('DOMContentLoaded', initSchedule);
