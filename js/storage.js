/**
 * storage.js
 * Handles data persistence using LocalStorage.
 * In Phase 1, it seeds data from sessions.json if LocalStorage is empty.
 */

const STORAGE_KEYS = {
    SESSIONS: 'aws_study_sessions',
    REFLECTIONS: 'aws_weekly_reflections'
};

export const Storage = {
    /**
     * Initializes the data by loading from JSON if LocalStorage is empty.
     */
    async init() {
        if (!localStorage.getItem(STORAGE_KEYS.SESSIONS)) {
            try {
                const response = await fetch('./data/sessions.json');
                if (!response.ok) throw new Error('Failed to fetch initial sessions');
                const data = await response.json();
                localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(data));
                console.log('✅ Storage initialized with seed data.');
            } catch (error) {
                console.error('❌ Storage initialization failed:', error);
                // Fallback to empty array to prevent app crash
                localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify([]));
            }
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
        console.log('⚠️ Storage cleared.');
    }
};
