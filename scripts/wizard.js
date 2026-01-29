/**
 * Wizard Module - 4-step form wizard controller
 */

const Wizard = {
    currentStep: 1,
    totalSteps: 4,
    stepsContainer: null,
    
    /**
     * Step configurations with all fields
     */
    steps: [
        {
            id: 1,
            title: 'Step 1: The Problem',
            description: 'Describe the situation before your solution.',
            fields: [
                { id: 'problem_broken', label: 'What was broken?', type: 'textarea', required: true, placeholder: 'e.g., Their sales team was spending 8+ hours per week manually qualifying leads, resulting in slow response times and missed opportunities.', rows: 3, hint: 'Recommended: 2-3 sentences describing the core issue' },
                { id: 'problem_affected', label: 'Who was affected?', type: 'text', required: true, placeholder: 'e.g., Sales team of 12, SDRs, Account Executives' },
                { id: 'problem_before', label: 'Before snapshot (metrics or state)', type: 'textarea', required: true, placeholder: 'e.g., Average lead response time: 4 hours | Conversion rate: 2.1% | Monthly qualified leads: 45', rows: 2 }
            ]
        },
        {
            id: 2,
            title: 'Step 2: The Cost',
            description: 'Explain why this problem mattered.',
            fields: [
                { id: 'cost_impact', label: 'What was the cost of not fixing this?', type: 'textarea', required: true, placeholder: 'e.g., They were losing an estimated $50K/month in potential revenue due to slow follow-ups and unqualified leads consuming rep time.', rows: 3 },
                { id: 'cost_risks', label: 'Risks, missed revenue, inefficiencies', type: 'textarea', required: true, placeholder: 'e.g., Competitors were responding in under 5 minutes. Team morale was dropping. Pipeline was stagnant.', rows: 2 },
                { id: 'cost_emotional', label: 'Emotional or strategic impact', type: 'text', required: false, placeholder: 'e.g., CEO was frustrated with stagnant growth despite increased ad spend' }
            ],
            optionalFields: [
                { id: 'cost_time_pressure', label: 'Time pressure', type: 'text', placeholder: 'e.g., Q4 revenue targets were at risk' },
                { id: 'cost_failed_attempts', label: 'Failed previous attempts', type: 'text', placeholder: 'e.g., Had tried 2 other CRMs that didn\'t integrate with their stack' }
            ]
        },
        {
            id: 3,
            title: 'Step 3: The Solution',
            description: 'Describe what you did to solve the problem.',
            fields: [
                { id: 'solution_strategy', label: 'Strategy overview', type: 'textarea', required: true, placeholder: 'e.g., We implemented an AI-powered lead scoring system integrated with their existing CRM, combined with automated email sequences for immediate follow-up.', rows: 3 },
                { id: 'solution_steps', label: 'Specific steps taken', type: 'textarea', required: true, placeholder: '• Audited existing lead flow and identified bottlenecks\n• Configured lead scoring criteria based on ICP\n• Built automated nurture sequences\n• Trained sales team on new workflow', rows: 4, hint: 'Use bullet points (• or -) for each step' },
                { id: 'solution_tools', label: 'Tools / frameworks used', type: 'text', required: false, placeholder: 'e.g., HubSpot, Zapier, Custom Python scripts' }
            ],
            optionalFields: [
                { id: 'solution_constraints', label: 'Constraints (budget, time, team size)', type: 'text', placeholder: 'e.g., $5K budget, 3-week timeline, 2-person team' },
                { id: 'solution_why', label: 'Why this approach was chosen', type: 'textarea', placeholder: 'e.g., Chose HubSpot over Salesforce due to easier onboarding and lower total cost of ownership', rows: 2 }
            ]
        },
        {
            id: 4,
            title: 'Step 4: The Outcome',
            description: 'Showcase the results achieved.',
            fields: [
                { id: 'result_metric_value', label: 'Primary metric value', type: 'text', required: true, placeholder: 'e.g., 42', halfWidth: true },
                { id: 'result_metric_type', label: 'Metric type', type: 'select', required: true, halfWidth: true, options: [
                    { value: 'percentage', label: 'Percentage growth (%)' },
                    { value: 'absolute', label: 'Absolute value' },
                    { value: 'time', label: 'Time-based improvement' },
                    { value: 'revenue', label: 'Revenue ($)' }
                ]},
                { id: 'result_timeframe', label: 'Time to result', type: 'text', required: true, placeholder: 'e.g., 60 days, 3 months, 6 weeks' }
            ],
            amplifiers: [
                { id: 'client_industry', label: 'Client industry', type: 'select', halfWidth: true, options: [
                    { value: '', label: 'Select industry...' },
                    { value: 'B2B SaaS', label: 'B2B SaaS' },
                    { value: 'E-commerce', label: 'E-commerce' },
                    { value: 'FinTech', label: 'FinTech' },
                    { value: 'Healthcare', label: 'Healthcare' },
                    { value: 'Agency', label: 'Agency' },
                    { value: 'Consulting', label: 'Consulting' },
                    { value: 'Manufacturing', label: 'Manufacturing' },
                    { value: 'Real Estate', label: 'Real Estate' },
                    { value: 'Education', label: 'Education' },
                    { value: 'Other', label: 'Other' }
                ]},
                { id: 'company_size', label: 'Company size', type: 'select', halfWidth: true, options: [
                    { value: '', label: 'Select size...' },
                    { value: '1-10', label: '1-10 employees' },
                    { value: '11-50', label: '11-50 employees' },
                    { value: '51-200', label: '51-200 employees' },
                    { value: '201-500', label: '201-500 employees' },
                    { value: '500+', label: '500+ employees' }
                ]}
            ],
            optionalFields: [
                { id: 'result_secondary', label: 'Secondary metrics', type: 'textarea', placeholder: 'e.g., Response time dropped from 4 hours to 12 minutes | Team saved 32 hours/week', rows: 2 },
                { id: 'result_quote', label: 'Client quote / testimonial', type: 'textarea', placeholder: 'e.g., "This completely transformed how we handle inbound leads. Our conversion rate doubled in the first month." — Sarah Johnson, VP Sales', rows: 2 }
            ]
        }
    ],
    
    /**
     * Initialize wizard
     */
    init() {
        this.stepsContainer = document.getElementById('wizard-steps');
        this.renderAllSteps();
        this.bindProgressSteps();
        this.goToStep(1);
    },
    
    /**
     * Render all step forms
     */
    renderAllSteps() {
        if (!this.stepsContainer) return;
        
        let html = '';
        this.steps.forEach(step => {
            html += this.renderStep(step);
        });
        this.stepsContainer.innerHTML = html;
    },
    
    /**
     * Render single step
     */
    renderStep(step) {
        let html = `
            <div class="wizard-step" data-step="${step.id}">
                <div class="step-header">
                    <h2 class="step-title">${step.title}</h2>
                    <p class="step-description">${step.description}</p>
                </div>
                <div class="step-content">
        `;
        
        // Check if we need a row for half-width fields
        let inRow = false;
        step.fields.forEach((field, index) => {
            if (field.halfWidth && !inRow) {
                html += '<div class="form-row">';
                inRow = true;
            }
            
            html += this.renderField(field);
            
            if (inRow && (!step.fields[index + 1] || !step.fields[index + 1].halfWidth)) {
                html += '</div>';
                inRow = false;
            }
        });
        
        // Amplifiers section (Step 4)
        if (step.amplifiers) {
            html += `
                <div class="amplifiers-section">
                    <h3 class="section-subtitle">Proof Amplifiers</h3>
                    <div class="form-row">
            `;
            step.amplifiers.forEach(field => {
                html += this.renderField(field);
            });
            html += '</div></div>';
        }
        
        // Optional fields
        if (step.optionalFields && step.optionalFields.length > 0) {
            html += `
                <div class="optional-fields">
                    <button class="toggle-optional" type="button" onclick="toggleOptional(this)">
                        <span class="toggle-icon">+</span> Show optional fields
                    </button>
                    <div class="optional-content">
            `;
            step.optionalFields.forEach(field => {
                html += this.renderField(field);
            });
            html += '</div></div>';
        }
        
        html += '</div>';
        
        // Navigation buttons
        html += `
            <div class="step-navigation">
                ${step.id > 1 ? '<button class="btn btn-secondary" type="button" onclick="prevStep()">← Back</button>' : '<div></div>'}
                ${step.id < this.totalSteps 
                    ? '<button class="btn btn-primary" type="button" onclick="nextStep()">Continue →</button>'
                    : '<button class="btn btn-primary btn-success" type="button" onclick="generateOutput()">Generate Case Study ✓</button>'
                }
            </div>
        `;
        
        html += '</div>';
        return html;
    },
    
    /**
     * Render individual field
     */
    renderField(field) {
        const requiredSpan = field.required ? '<span class="required">*</span>' : '';
        const halfClass = field.halfWidth ? ' form-group-half' : '';
        
        let html = `<div class="form-group${halfClass}">`;
        html += `<label class="form-label">${field.label} ${requiredSpan}</label>`;
        
        if (field.type === 'textarea') {
            html += `<textarea class="form-textarea" id="${field.id}" placeholder="${field.placeholder || ''}" rows="${field.rows || 3}"></textarea>`;
        } else if (field.type === 'select') {
            html += `<select class="form-select" id="${field.id}">`;
            field.options.forEach(opt => {
                html += `<option value="${opt.value}">${opt.label}</option>`;
            });
            html += '</select>';
        } else {
            html += `<input type="${field.type}" class="form-input" id="${field.id}" placeholder="${field.placeholder || ''}">`;
        }
        
        if (field.hint) {
            html += `<span class="form-hint">${field.hint}</span>`;
        }
        
        html += '</div>';
        return html;
    },
    
    /**
     * Bind progress step clicks
     */
    bindProgressSteps() {
        document.querySelectorAll('.progress-step').forEach(step => {
            step.addEventListener('click', () => {
                const stepNum = parseInt(step.dataset.step);
                this.goToStep(stepNum);
            });
        });
    },
    
    /**
     * Go to specific step
     */
    goToStep(stepNum) {
        if (stepNum < 1 || stepNum > this.totalSteps) return;
        
        this.currentStep = stepNum;
        
        // Update step visibility
        document.querySelectorAll('.wizard-step').forEach(step => {
            step.classList.toggle('active', parseInt(step.dataset.step) === stepNum);
        });
        
        // Update progress bar
        document.querySelectorAll('.progress-step').forEach(step => {
            const num = parseInt(step.dataset.step);
            step.classList.toggle('active', num === stepNum);
            step.classList.toggle('completed', num < stepNum);
        });
    },
    
    /**
     * Go to next step
     */
    nextStep() {
        if (this.currentStep < this.totalSteps) {
            this.goToStep(this.currentStep + 1);
        }
    },
    
    /**
     * Go to previous step
     */
    prevStep() {
        if (this.currentStep > 1) {
            this.goToStep(this.currentStep - 1);
        }
    },
    
    /**
     * Get current step
     */
    getCurrentStep() {
        return this.currentStep;
    }
};

// Global navigation functions
function nextStep() {
    Wizard.nextStep();
}

function prevStep() {
    Wizard.prevStep();
}

function toggleOptional(button) {
    const content = button.nextElementSibling;
    const icon = button.querySelector('.toggle-icon');
    
    if (content.classList.contains('show')) {
        content.classList.remove('show');
        icon.textContent = '+';
        button.innerHTML = button.innerHTML.replace('Hide', 'Show');
    } else {
        content.classList.add('show');
        icon.textContent = '−';
        button.innerHTML = button.innerHTML.replace('Show', 'Hide');
    }
}
