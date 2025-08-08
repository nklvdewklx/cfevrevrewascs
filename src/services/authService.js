// src/services/authService.js
import { showToast } from '../lib/toast';
import { storageService } from './storageService';

export const authService = {
    login(users, username, password) {
        const user = users.find(u => u.username === username);

        if (user && user.password === password) {
            const currentUser = {
                id: user.id,
                username: user.username,
                role: user.role,
                name: user.name
            };
            
            // Save only the user session to local storage
            storageService.saveState({ currentUser });
            showToast(`Welcome, ${user.name}!`, 'success');
            return currentUser;
        } else {
            showToast('Invalid username or password.', 'error');
            return null;
        }
    },

    logout() {
        storageService.clearState();
        showToast('You have been logged out.', 'info');
    },

    hasRole(currentUser, requiredRoles) {
        if (!currentUser) return false;
        
        const userRole = currentUser.role;
        if (Array.isArray(requiredRoles)) {
            return requiredRoles.includes(userRole);
        }
        return userRole === requiredRoles;
    },
};