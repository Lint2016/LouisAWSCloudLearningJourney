/**
 * auth.js
 * Handles user authentication via Firebase Auth.
 * Includes fallback mock auth if Firebase config is missing.
 */

// Import Firebase (Modular SDK)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

// TODO: Replace with your actual Firebase config
const firebaseConfig = {
    apiKey: "AIzaSyDZeR19GXDWdCqCKPLmA6Pu5mWHEMjJ-vE",
    authDomain: "louisawscloudlearningjourney.firebaseapp.com",
    projectId: "louisawscloudlearningjourney",
    storageBucket: "louisawscloudlearningjourney.firebasestorage.app",
    messagingSenderId: "210695892141",
    appId: "1:210695892141:web:8e877c127e75df9834ea24",
    measurementId: "G-S9WYT8155C"
};

// Initialize Firebase
let app, auth;

try {
    // Basic check to see if config is populated
    if (firebaseConfig.apiKey !== "YOUR_API_KEY") {
        app = initializeApp(firebaseConfig);
        auth = getAuth(app);
    } else {
        console.warn("⚠️ Firebase config missing. Running in Mock Auth mode.");
    }
} catch (e) {
    console.error("Firebase init error:", e);
}

export const Auth = {
    /**
     * Subscribe to auth state changes.
     */
    onStateChanged(callback) {
        if (auth) {
            onAuthStateChanged(auth, callback);
        } else {
            // Mock: Check localStorage for fake user
            const user = localStorage.getItem('mock_user');
            callback(user ? JSON.parse(user) : null);
        }
    },

    /**
     * Sign up a new user.
     */
    async signUp(email, password) {
        if (auth) {
            return await createUserWithEmailAndPassword(auth, email, password);
        } else {
            // Mock Signup
            console.log('Mock Signup:', email);
            const user = { uid: 'mock-user-123', email };
            localStorage.setItem('mock_user', JSON.stringify(user));
            // Reload to trigger state change
            window.location.href = 'index.html';
            return { user };
        }
    },

    /**
     * Sign in an existing user.
     */
    async signIn(email, password) {
        if (auth) {
            return await signInWithEmailAndPassword(auth, email, password);
        } else {
            // Mock Signin
            console.log('Mock Signin:', email);
            if (password === 'password') { // Simple mock check
                const user = { uid: 'mock-user-123', email };
                localStorage.setItem('mock_user', JSON.stringify(user));
                window.location.href = 'index.html';
                return { user };
            } else {
                throw new Error('Invalid password (mock: try "password")');
            }
        }
    },

    /**
     * Sign out the current user.
     */
    async signOut() {
        if (auth) {
            return await signOut(auth);
        } else {
            // Mock Signout
            localStorage.removeItem('mock_user');
            window.location.href = 'login.html';
        }
    },

    /**
     * Send password reset email.
     */
    async resetPassword(email) {
        if (auth) {
            return await sendPasswordResetEmail(auth, email);
        } else {
            console.log('Mock Reset Email sent to:', email);
            return true;
        }
    },

    /**
     * Guard function: Redirects to login if not authenticated.
     */
    requireAuth() {
        this.onStateChanged(user => {
            if (!user) {
                window.location.href = 'login.html';
            }
        });
    },

    /**
     * Initializes the Auth Link (Login/Logout) in the UI.
     */
    initAuthLink(elementId = 'auth-link') {
        const link = document.getElementById(elementId);
        if (!link) return;

        this.onStateChanged(user => {
            if (user) {
                link.textContent = 'Logout';
                link.href = '#';
                link.onclick = (e) => {
                    e.preventDefault();
                    this.signOut();
                };
            } else {
                link.textContent = 'Login';
                link.href = 'login.html';
                link.onclick = null;
            }
        });
    }
};
