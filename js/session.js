/**
 * session.js
 * Logic for the session detail view.
 */

import { Storage } from './storage.js';
import { Auth } from './auth.js';

let currentSession = null;

async function initSession() {
    Auth.requireAuth();
    Auth.initAuthLink();

    await Storage.init();

    // Get session ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const sessionId = urlParams.get('id');

    if (!sessionId) {
        alert('No session ID provided.');
        window.location.href = 'schedule.html';
        return;
    }

    const sessions = Storage.getSessions();
    currentSession = sessions.find(s => s.id === sessionId);

    if (!currentSession) {
        alert('Session not found.');
        window.location.href = 'schedule.html';
        return;
    }

    renderSession(currentSession);
    setupEventListeners();
}

function renderSession(session) {
    document.getElementById('session-topic').textContent = session.topic;
    // Updated metadata display for 7-week structure
    document.getElementById('session-metadata').textContent = `Week ${session.week} - ${session.day} | ${session.title}`;

    // Render Tasks
    const tasksContainer = document.getElementById('tasks-container');
    tasksContainer.innerHTML = '';

    session.tasks.forEach((task, index) => {
        const item = document.createElement('div');
        item.className = `checklist-item ${task.completed ? 'completed' : ''}`;

        item.innerHTML = `
            <input type="checkbox" id="task-${index}" ${task.completed ? 'checked' : ''}>
            <label for="task-${index}" style="cursor: pointer; flex: 1;">${task.text}</label>
        `;

        // Add change listener for this specific task
        const checkbox = item.querySelector('input');
        checkbox.addEventListener('change', () => {
            currentSession.tasks[index].completed = checkbox.checked;
            item.classList.toggle('completed', checkbox.checked);
            checkCompletionStatus();
            saveData();
        });

        tasksContainer.appendChild(item);
    });

    // Render Deliverables (New in Phase 2)
    // We reuse the "Links" container or create a new one?
    // Let's create a new section for Deliverables if they exist.
    let deliverablesHtml = '';
    if (session.deliverables && session.deliverables.length > 0) {
        deliverablesHtml = `
            <div class="card mt-1" style="background-color: #f0fdf4; border-color: #bbf7d0;">
                <h3 style="color: #166534;">🏆 Deliverables</h3>
                <ul style="padding-left: 1.2rem; margin-top: 0.5rem;">
                    ${session.deliverables.map(d => `<li>${d}</li>`).join('')}
                </ul>
            </div>
        `;
    }

    // Inject deliverables before links
    const linksCard = document.getElementById('links-container').closest('.card');
    if (deliverablesHtml && linksCard) {
        const div = document.createElement('div');
        div.innerHTML = deliverablesHtml;
        linksCard.parentNode.insertBefore(div, linksCard);
    }

    // Render Links
    const linksContainer = document.getElementById('links-container');
    linksContainer.innerHTML = '';
    if (session.links && session.links.length > 0) {
        session.links.forEach(link => {
            const li = document.createElement('li');
            li.style.marginBottom = '0.5rem';
            li.innerHTML = `<a href="${link}" target="_blank" rel="noopener noreferrer" style="color: var(--primary); text-decoration: underline;">${link}</a>`;
            linksContainer.appendChild(li);
        });
    } else {
        linksContainer.innerHTML = '<li class="text-secondary">No links provided.</li>';
    }

    // Render Text Areas
    document.getElementById('notes-input').value = session.notes || '';
    document.getElementById('issues-input').value = session.issues || '';
    document.getElementById('fixes-input').value = session.fixes || '';
}

function checkCompletionStatus() {
    const allCompleted = currentSession.tasks.every(t => t.completed);
    currentSession.completed = allCompleted;
}

function saveData() {
    // Update text fields
    currentSession.notes = document.getElementById('notes-input').value;
    currentSession.issues = document.getElementById('issues-input').value;
    currentSession.fixes = document.getElementById('fixes-input').value;

    Storage.updateSession(currentSession);
    console.log('Session saved.');
}

function setupEventListeners() {
    // Auto-save on blur for text areas
    ['notes-input', 'issues-input', 'fixes-input'].forEach(id => {
        document.getElementById(id).addEventListener('blur', saveData);
    });

    // Save button (manual trigger)
    document.getElementById('save-btn').addEventListener('click', () => {
        saveData();
        alert('Progress saved!');
    });
}

// Start
document.addEventListener('DOMContentLoaded', initSession);
