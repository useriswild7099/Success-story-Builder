/**
 * Preview Module - Live preview rendering
 */

const Preview = {
    currentFormat: 'case-study',
    previewElement: null,
    
    /**
     * Initialize preview module
     */
    init() {
        this.previewElement = document.getElementById('preview-content');
        this.bindFormatTabs();
    },
    
    /**
     * Bind format tab click events
     */
    bindFormatTabs() {
        const tabs = document.querySelectorAll('.format-tab');
        tabs.forEach(tab => {
            tab.addEventListener('click', (e) => {
                this.setActiveFormat(e.target.dataset.format);
            });
        });
    },
    
    /**
     * Set active format and update preview
     */
    setActiveFormat(format) {
        this.currentFormat = format;
        
        // Update active tab
        document.querySelectorAll('.format-tab').forEach(tab => {
            tab.classList.toggle('active', tab.dataset.format === format);
        });
        
        // Re-render preview
        this.render(App.getFormData());
    },
    
    /**
     * Render preview with current data
     */
    render(data) {
        if (!this.previewElement) return;
        
        // Check if we have any data to show
        const hasData = Object.values(data).some(val => val && val.toString().trim());
        
        if (!hasData) {
            this.showPlaceholder();
            return;
        }
        
        // Generate content based on format
        const markdown = Templates.getTemplate(this.currentFormat, data);
        const html = Templates.markdownToHtml(markdown);
        
        this.previewElement.innerHTML = `<div class="preview-output">${html}</div>`;
    },
    
    /**
     * Show placeholder when no data
     */
    showPlaceholder() {
        this.previewElement.innerHTML = `
            <div class="preview-placeholder">
                <svg class="placeholder-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                </svg>
                <p>Start filling in the wizard to see your case study preview here.</p>
            </div>
        `;
    },
    
    /**
     * Get current format
     */
    getFormat() {
        return this.currentFormat;
    },
    
    /**
     * Get raw markdown output
     */
    getMarkdown(data) {
        return Templates.getTemplate(this.currentFormat, data);
    },
    
    /**
     * Get HTML output
     */
    getHtml(data) {
        return Templates.markdownToHtml(this.getMarkdown(data));
    }
};
