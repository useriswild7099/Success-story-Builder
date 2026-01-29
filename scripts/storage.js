/**
 * Storage Module - LocalStorage management for autosave
 */

const StorageManager = {
    STORAGE_KEY: 'caseStudyDraft',
    
    /**
     * Save form data to localStorage
     */
    save(data) {
        try {
            const serialized = JSON.stringify({
                ...data,
                lastSaved: new Date().toISOString()
            });
            localStorage.setItem(this.STORAGE_KEY, serialized);
            return true;
        } catch (error) {
            console.error('Failed to save draft:', error);
            return false;
        }
    },
    
    /**
     * Load form data from localStorage
     */
    load() {
        try {
            const data = localStorage.getItem(this.STORAGE_KEY);
            if (data) {
                return JSON.parse(data);
            }
            return null;
        } catch (error) {
            console.error('Failed to load draft:', error);
            return null;
        }
    },
    
    /**
     * Clear saved draft
     */
    clear() {
        try {
            localStorage.removeItem(this.STORAGE_KEY);
            return true;
        } catch (error) {
            console.error('Failed to clear draft:', error);
            return false;
        }
    },
    
    /**
     * Check if a draft exists
     */
    hasDraft() {
        return localStorage.getItem(this.STORAGE_KEY) !== null;
    },
    
    /**
     * Get last saved timestamp
     */
    getLastSaved() {
        const data = this.load();
        return data?.lastSaved || null;
    }
};
