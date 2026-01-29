/**
 * Main App Module - Application controller
 */

const App = {
    formData: {},
    autoSaveTimeout: null,
    
    /**
     * Initialize application
     */
    init() {
        // Initialize modules
        Wizard.init();
        Preview.init();
        
        // Load saved draft
        this.loadDraft();
        
        // Bind input events for live preview
        this.bindInputEvents();
        
        // Initial preview render
        this.updatePreview();
        
        console.log('SaaS Success Story Builder initialized');
    },
    
    /**
     * Bind input events for live preview and autosave
     */
    bindInputEvents() {
        document.addEventListener('input', (e) => {
            if (e.target.matches('.form-input, .form-textarea, .form-select')) {
                this.onInputChange();
            }
        });
        
        document.addEventListener('change', (e) => {
            if (e.target.matches('.form-select')) {
                this.onInputChange();
            }
        });
    },
    
    /**
     * Handle input change
     */
    onInputChange() {
        // Update form data
        this.formData = this.getFormData();
        
        // Update preview
        this.updatePreview();
        
        // Debounced autosave
        clearTimeout(this.autoSaveTimeout);
        this.autoSaveTimeout = setTimeout(() => {
            this.saveDraft();
        }, 1000);
    },
    
    /**
     * Get all form data
     */
    getFormData() {
        const fields = [
            'problem_broken', 'problem_affected', 'problem_before',
            'cost_impact', 'cost_risks', 'cost_emotional', 'cost_time_pressure', 'cost_failed_attempts',
            'solution_strategy', 'solution_steps', 'solution_tools', 'solution_constraints', 'solution_why',
            'result_metric_value', 'result_metric_type', 'result_timeframe',
            'client_industry', 'company_size',
            'result_secondary', 'result_quote'
        ];
        
        const data = {};
        fields.forEach(field => {
            const element = document.getElementById(field);
            if (element) {
                data[field] = element.value;
            }
        });
        
        return data;
    },
    
    /**
     * Set form data (for loading drafts)
     */
    setFormData(data) {
        Object.keys(data).forEach(key => {
            const element = document.getElementById(key);
            if (element && key !== 'lastSaved') {
                element.value = data[key] || '';
            }
        });
        this.formData = data;
    },
    
    /**
     * Update preview panel
     */
    updatePreview() {
        Preview.render(this.getFormData());
    },
    
    /**
     * Save draft to localStorage
     */
    saveDraft() {
        const data = this.getFormData();
        StorageManager.save(data);
    },
    
    /**
     * Load draft from localStorage
     */
    loadDraft() {
        const data = StorageManager.load();
        if (data) {
            this.setFormData(data);
            this.showToast('Draft restored', 'success');
        }
    },
    
    /**
     * Clear draft
     */
    clearDraft() {
        if (confirm('Are you sure you want to clear all data?')) {
            StorageManager.clear();
            location.reload();
        }
    },
    
    /**
     * Generate final output
     */
    generateOutput() {
        this.saveDraft();
        this.updatePreview();
        this.showToast('Case study generated! Choose an export format below.', 'success');
        
        // Scroll to preview on mobile
        const previewPanel = document.querySelector('.preview-panel');
        if (previewPanel && window.innerWidth < 1024) {
            previewPanel.scrollIntoView({ behavior: 'smooth' });
        }
    },
    
    /**
     * Show toast notification
     */
    showToast(message, type = '') {
        const toast = document.getElementById('toast');
        const toastMessage = toast.querySelector('.toast-message');
        
        toastMessage.textContent = message;
        toast.className = 'toast show' + (type ? ` ${type}` : '');
        
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }
};

/**
 * Copy functions for export
 */
function copyAs(format) {
    const data = App.getFormData();
    let content = '';
    
    switch(format) {
        case 'markdown':
            content = Templates.getTemplate(Preview.getFormat(), data);
            break;
        case 'html':
            content = Templates.markdownToHtml(Templates.getTemplate(Preview.getFormat(), data));
            break;
        case 'notion':
            // Notion accepts markdown
            content = Templates.getTemplate(Preview.getFormat(), data);
            break;
        case 'webflow':
            // Webflow accepts HTML
            content = Templates.markdownToHtml(Templates.getTemplate(Preview.getFormat(), data));
            break;
        case 'linkedin':
            content = Templates.linkedinPost(data);
            break;
        default:
            content = Templates.getTemplate(Preview.getFormat(), data);
    }
    
    copyToClipboard(content);
}

/**
 * Copy to clipboard utility
 */
function copyToClipboard(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(() => {
            App.showToast('Copied to clipboard!', 'success');
        }).catch(err => {
            fallbackCopy(text);
        });
    } else {
        fallbackCopy(text);
    }
}

/**
 * Fallback copy for older browsers
 */
function fallbackCopy(text) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    
    try {
        document.execCommand('copy');
        App.showToast('Copied to clipboard!', 'success');
    } catch (err) {
        App.showToast('Failed to copy. Please select and copy manually.', '');
    }
    
    document.body.removeChild(textarea);
}

/**
 * Global functions
 */
function scrollToTool() {
    document.getElementById('tool').scrollIntoView({ behavior: 'smooth' });
}

function showExample() {
    // Populate with example data
    const exampleData = {
        problem_broken: 'Their sales team was spending 8+ hours per week manually qualifying leads, resulting in slow response times and missed opportunities.',
        problem_affected: 'Sales team of 12, SDRs, Account Executives',
        problem_before: 'Average lead response time: 4 hours | Conversion rate: 2.1% | Monthly qualified leads: 45',
        cost_impact: 'They were losing an estimated $50K/month in potential revenue due to slow follow-ups and unqualified leads consuming rep time.',
        cost_risks: 'Competitors were responding in under 5 minutes. Team morale was dropping. Pipeline was stagnant.',
        cost_emotional: 'CEO was frustrated with stagnant growth despite increased ad spend',
        solution_strategy: 'We implemented an AI-powered lead scoring system integrated with their existing CRM, combined with automated email sequences for immediate follow-up.',
        solution_steps: '• Audited existing lead flow and identified bottlenecks\n• Configured lead scoring criteria based on ICP\n• Built automated nurture sequences\n• Trained sales team on new workflow',
        solution_tools: 'HubSpot, Zapier, Custom Python scripts',
        result_metric_value: '42',
        result_metric_type: 'percentage',
        result_timeframe: '60 days',
        client_industry: 'B2B SaaS',
        company_size: '51-200',
        result_secondary: 'Response time dropped from 4 hours to 12 minutes | Team saved 32 hours/week',
        result_quote: '"This completely transformed how we handle inbound leads. Our conversion rate doubled in the first month." — Sarah Johnson, VP Sales'
    };
    
    App.setFormData(exampleData);
    App.updatePreview();
    scrollToTool();
    App.showToast('Example loaded! Feel free to edit.', 'success');
}

function generateOutput() {
    App.generateOutput();
}

/**
 * Initialize on DOM ready
 */
document.addEventListener('DOMContentLoaded', () => {
    App.init();
});
