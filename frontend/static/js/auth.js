/**
 * ContextGuard - Firebase Authentication
 */

// Initialize Firebase Auth listener
if (typeof firebase !== 'undefined' && firebase.auth) {
    firebase.auth().onAuthStateChanged(async (user) => {
        if (user) {
            // User is signed in
            const idToken = await user.getIdToken();
            
            // Verify token with backend
            try {
                const response = await fetch('/auth/verify-token', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ idToken })
                });
                
                if (response.ok) {
                    const data = await response.json();
                    updateAuthUI(true, {
                        email: user.email,
                        uid: data.uid
                    });
                    
                    // Load user preferences
                    await loadUserPreferences();
                }
            } catch (error) {
                console.error('Token verification failed:', error);
            }
        } else {
            // User is signed out
            updateAuthUI(false);
        }
    });
}

/**
 * Load user preferences from backend
 */
async function loadUserPreferences() {
    try {
        const response = await fetch('/auth/user/preferences');
        if (response.ok) {
            const prefs = await response.json();
            
            // Update UI with preferences
            if (document.getElementById('tone')) {
                document.getElementById('tone').value = prefs.tone || 'neutral';
            }
            if (document.getElementById('readingLevel')) {
                document.getElementById('readingLevel').value = prefs.readingLevel || 'intermediate';
            }
            if (document.getElementById('targetLanguage')) {
                document.getElementById('targetLanguage').value = prefs.targetLanguage || 'es';
            }
        }
    } catch (error) {
        console.error('Failed to load preferences:', error);
    }
}

/**
 * Save user preferences to backend
 */
async function saveUserPreferences(preferences) {
    try {
        const response = await fetch('/auth/user/preferences', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(preferences)
        });
        
        if (response.ok) {
            showNotification('Preferences saved!', 'success');
        } else {
            console.error('Failed to save preferences');
        }
    } catch (error) {
        console.error('Save preferences error:', error);
    }
}

/**
 * Sign in with Google
 */
async function signInWithGoogle() {
    if (typeof firebase === 'undefined' || !firebase.auth) {
        alert('Firebase is not configured. Please add your Firebase config.');
        return;
    }
    
    try {
        const provider = new firebase.auth.GoogleAuthProvider();
        await firebase.auth().signInWithPopup(provider);
        showNotification('Signed in successfully!', 'success');
    } catch (error) {
        console.error('Sign in error:', error);
        showNotification('Sign in failed: ' + error.message, 'error');
    }
}

/**
 * Sign in with Email/Password (demo)
 */
async function signInWithEmail(email, password) {
    if (typeof firebase === 'undefined' || !firebase.auth) {
        alert('Firebase is not configured. Please add your Firebase config.');
        return;
    }
    
    try {
        await firebase.auth().signInWithEmailAndPassword(email, password);
        showNotification('Signed in successfully!', 'success');
    } catch (error) {
        console.error('Sign in error:', error);
        showNotification('Sign in failed: ' + error.message, 'error');
    }
}

/**
 * Create account with Email/Password (demo)
 */
async function createAccount(email, password) {
    if (typeof firebase === 'undefined' || !firebase.auth) {
        alert('Firebase is not configured. Please add your Firebase config.');
        return;
    }
    
    try {
        await firebase.auth().createUserWithEmailAndPassword(email, password);
        showNotification('Account created successfully!', 'success');
    } catch (error) {
        console.error('Create account error:', error);
        showNotification('Account creation failed: ' + error.message, 'error');
    }
}
