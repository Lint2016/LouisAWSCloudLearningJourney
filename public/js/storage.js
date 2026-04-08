/**
 * storage.js
 * Handles data persistence using LocalStorage.
 * In Phase 1, it seeds data from sessions.json if LocalStorage is empty.
 */

const STORAGE_KEYS = {
    SESSIONS: 'aws_study_sessions',
    REFLECTIONS: 'aws_weekly_reflections',
    DATA_VERSION: 'aws_data_version'
};

// Increment this version to force a reload of sessions.json on client browsers
const CURRENT_DATA_VERSION = '1.2';

export const Storage = {
    /**
     * Initializes the data by loading from JSON if LocalStorage is empty.
     */
    async init() {
        // Check for version mismatch to force update
        const storedVersion = localStorage.getItem(STORAGE_KEYS.DATA_VERSION);
        if (storedVersion !== CURRENT_DATA_VERSION) {
            console.log(`NEW DATA VERSION DETECTED: ${CURRENT_DATA_VERSION} (Old: ${storedVersion})`);
            // Clear old session data to force reload
            localStorage.removeItem(STORAGE_KEYS.SESSIONS);
            localStorage.setItem(STORAGE_KEYS.DATA_VERSION, CURRENT_DATA_VERSION);
        }

        if (!localStorage.getItem(STORAGE_KEYS.SESSIONS)) {
            let data = [];
            try {
                const response = await fetch('./data/sessions.json');
                if (response.ok) {
                    data = await response.json();
                } else {
                    throw new Error('Fetch failed');
                }
            } catch (error) {
                console.warn('⚠️ Fetch failed (likely due to CORS or file:// protocol). Using embedded fallback data.');
                data = [
                    {
                        "id": "week-1-fri",
                        "week": 1,
                        "day": "Friday",
                        "title": "AWS Account & Discipline",
                        "topic": "Account Setup Like a Pro",
                        "tasks": [
                            { "text": "Create AWS account", "completed": false },
                            { "text": "Enable billing alerts", "completed": false },
                            { "text": "Enable AWS Budgets", "completed": false },
                            { "text": "Enable MFA on root", "completed": false },
                            { "text": "Lock root user (never use again)", "completed": false }
                        ],
                        "deliverables": [
                            "Screenshot of billing alert",
                            "Written note: Why root user is dangerous"
                        ],
                        "completed": false,
                        "notes": "",
                        "issues": "",
                        "fixes": "",
                        "links": ["https://aws.amazon.com/premiumsupport/knowledge-center/create-and-activate-aws-account/"]
                    },
                    {
                        "id": "week-1-sat",
                        "week": 1,
                        "day": "Saturday",
                        "title": "IAM – Your First Real Skill",
                        "topic": "IAM Fundamentals",
                        "tasks": [
                            { "text": "Create IAM Admin user", "completed": false },
                            { "text": "Create IAM group", "completed": false },
                            { "text": "Attach least-privilege policy", "completed": false },
                            { "text": "Log out of root, log in as IAM user", "completed": false },
                            { "text": "Intentionally deny access → fix it", "completed": false }
                        ],
                        "deliverables": [
                            "IAM diagram (user → group → policy)",
                            "Explain difference: user vs role"
                        ],
                        "completed": false,
                        "notes": "",
                        "issues": "",
                        "fixes": "",
                        "links": ["https://docs.aws.amazon.com/IAM/latest/UserGuide/introduction.html"]
                    },
                    // Minimal fallback to ensure app boots if JSON fetch fails. 
                    // Full data is in sessions.json.
                ];
            }
            localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(data));
            console.log('✅ Storage initialized.');
        }
    },

    /**
     * Retrieves all sessions.
     */
    getSessions() {
        const data = localStorage.getItem(STORAGE_KEYS.SESSIONS);
        return data ? JSON.parse(data) : [];
    },

    /**
     * Saves all sessions back to LocalStorage.
     */
    saveSessions(sessions) {
        localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(sessions));
    },

    /**
     * Updates a single session.
     */
    updateSession(updatedSession) {
        const sessions = this.getSessions();
        const index = sessions.findIndex(s => s.id === updatedSession.id);
        if (index !== -1) {
            sessions[index] = { ...sessions[index], ...updatedSession };
            this.saveSessions(sessions);
            return true;
        }
        return false;
    },

    /**
     * Retrieves all weekly reflections.
     */
    getReflections() {
        const data = localStorage.getItem(STORAGE_KEYS.REFLECTIONS);
        return data ? JSON.parse(data) : [];
    },

    /**
     * Adds or updates a weekly reflection.
     */
    saveReflection(reflection) {
        const reflections = this.getReflections();
        const index = reflections.findIndex(r => r.weekId === reflection.weekId);
        if (index !== -1) {
            reflections[index] = reflection;
        } else {
            reflections.push(reflection);
        }
        localStorage.setItem(STORAGE_KEYS.REFLECTIONS, JSON.stringify(reflections));
    },

    /**
     * Utility to clear all data (for development use).
     */
    clearAll() {
        localStorage.removeItem(STORAGE_KEYS.SESSIONS);
        localStorage.removeItem(STORAGE_KEYS.REFLECTIONS);
        localStorage.removeItem(STORAGE_KEYS.DATA_VERSION);
        console.log('⚠️ Storage cleared.');
    }
};
