/**
 * reflection.js
 * Logic for the Weeky Reflection functionality.
 */

import { Storage } from './storage.js';
import { Auth } from './auth.js';
import { initMobileMenu } from './ui.js';

async function initReflection() {
    Auth.requireAuth();
    Auth.initAuthLink();

    await Storage.init();

    populateWeekSelect();
    renderPastReflections();

    document.getElementById('save-reflection-btn').addEventListener('click', saveReflection);
    initMobileMenu();
}

function populateWeekSelect() {
    const sessions = Storage.getSessions();
    const weekSelect = document.getElementById('week-select');

    // Get unique weeks
    const weeks = [...new Set(sessions.map(s => s.week))].sort((a, b) => a - b);

    weeks.forEach(week => {
        const option = document.createElement('option');
        option.value = week;
        option.textContent = `Week ${week}`;
        weekSelect.appendChild(option);
    });
}

function saveReflection() {
    const weekId = document.getElementById('week-select').value;
    const understood = document.getElementById('understood-input').value;
    const confused = document.getElementById('confused-input').value;
    const questions = document.getElementById('questions-input').value;

    if (!understood && !confused) {
        alert('Please fill out at least one field.');
        return;
    }

    const reflection = {
        weekId: parseInt(weekId),
        date: new Date().toISOString(),
        understood,
        confused,
        questions
    };

    Storage.saveReflection(reflection);
    renderPastReflections();

    // Clear inputs (optional)
    document.getElementById('understood-input').value = '';
    document.getElementById('confused-input').value = '';
    document.getElementById('questions-input').value = '';

    alert('Reflection saved!');
}

function renderPastReflections() {
    const reflections = Storage.getReflections();
    const container = document.getElementById('past-reflections-container');

    if (reflections.length === 0) {
        container.innerHTML = '<p class="text-secondary">No reflections yet.</p>';
        return;
    }

    container.innerHTML = '';

    // Sort by most recent week
    reflections.sort((a, b) => b.weekId - a.weekId);

    reflections.forEach(ref => {
        const div = document.createElement('div');
        div.className = 'card';
        div.style.marginBottom = '1rem';
        div.innerHTML = `
            <h4>Week ${ref.weekId}</h4>
            <p class="text-secondary" style="font-size: 0.8rem; margin-bottom: 0.5rem;">${new Date(ref.date).toLocaleDateString()}</p>
            
            ${ref.understood ? `<p><strong>Understood:</strong> ${ref.understood}</p>` : ''}
            ${ref.confused ? `<p><strong>Confused:</strong> ${ref.confused}</p>` : ''}
            ${ref.questions ? `<p><strong>Questions:</strong> ${ref.questions}</p>` : ''}
        `;
        container.appendChild(div);
    });
}

// Start
document.addEventListener('DOMContentLoaded', initReflection);
