/**
 * Templates Module - Output format templates
 */

const Templates = {
    /**
     * Format metric value based on type
     */
    formatMetric(value, type, beforeValue = '') {
        if (!value) return '';
        
        switch(type) {
            case 'percentage':
                return `${value}% growth`;
            case 'absolute':
                return beforeValue ? `${beforeValue} → ${value}` : value;
            case 'time':
                return `${value} improvement`;
            case 'revenue':
                return `$${value.toLocaleString()}`;
            default:
                return value;
        }
    },
    
    /**
     * Generate auto-hook headline
     */
    generateHook(data) {
        const industry = data.client_industry || 'company';
        const metric = this.formatMetric(data.result_metric_value, data.result_metric_type);
        const timeframe = data.result_timeframe || '';
        
        if (!metric) {
            return 'Client Success Story';
        }
        
        let hook = `How a ${industry}`;
        
        if (data.result_metric_type === 'percentage') {
            hook += ` increased results by ${data.result_metric_value}%`;
        } else if (data.result_metric_type === 'revenue') {
            hook += ` generated $${data.result_metric_value} in revenue`;
        } else {
            hook += ` achieved ${metric}`;
        }
        
        if (timeframe) {
            hook += ` in ${timeframe}`;
        }
        
        return hook;
    },
    
    /**
     * Shorten text for compact formats
     */
    shortenText(text, maxLength = 100) {
        if (!text) return '';
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength).trim() + '...';
    },
    
    /**
     * Format bullet points
     */
    formatBullets(text) {
        if (!text) return '';
        return text.split('\n')
            .map(line => line.trim())
            .filter(line => line)
            .map(line => {
                if (line.startsWith('•') || line.startsWith('-') || line.startsWith('*')) {
                    return line;
                }
                return `• ${line}`;
            })
            .join('\n');
    },
    
    /**
     * Website Case Study Template (Full)
     */
    caseStudy(data) {
        const hook = this.generateHook(data);
        const metric = this.formatMetric(data.result_metric_value, data.result_metric_type);
        
        let output = `# ${hook}\n\n`;
        
        // The Challenge
        output += `## The Challenge\n\n`;
        if (data.problem_broken) {
            output += `${data.problem_broken}\n\n`;
        }
        if (data.problem_affected) {
            output += `**Who was affected:** ${data.problem_affected}\n\n`;
        }
        if (data.problem_before) {
            output += `**Before:** ${data.problem_before}\n\n`;
        }
        
        // Why It Mattered
        output += `## Why It Mattered\n\n`;
        if (data.cost_impact) {
            output += `${data.cost_impact}\n\n`;
        }
        if (data.cost_risks) {
            output += `${data.cost_risks}\n\n`;
        }
        if (data.cost_emotional) {
            output += `*${data.cost_emotional}*\n\n`;
        }
        
        // Our Approach
        output += `## Our Approach\n\n`;
        if (data.solution_strategy) {
            output += `${data.solution_strategy}\n\n`;
        }
        if (data.solution_steps) {
            output += `### Steps Taken\n\n`;
            output += `${this.formatBullets(data.solution_steps)}\n\n`;
        }
        if (data.solution_tools) {
            output += `**Tools Used:** ${data.solution_tools}\n\n`;
        }
        
        // The Results
        output += `## The Results\n\n`;
        if (metric && data.result_timeframe) {
            output += `**${metric}** in ${data.result_timeframe}\n\n`;
        } else if (metric) {
            output += `**${metric}**\n\n`;
        }
        if (data.result_secondary) {
            output += `### Additional Outcomes\n\n${data.result_secondary}\n\n`;
        }
        if (data.result_quote) {
            output += `> ${data.result_quote}\n\n`;
        }
        
        // Company Info
        if (data.client_industry || data.company_size) {
            output += `---\n\n`;
            if (data.client_industry) {
                output += `**Industry:** ${data.client_industry}\n`;
            }
            if (data.company_size) {
                output += `**Company Size:** ${data.company_size} employees\n`;
            }
        }
        
        return output;
    },
    
    /**
     * LinkedIn Post Template
     */
    linkedinPost(data) {
        const hook = this.generateHook(data);
        const metric = this.formatMetric(data.result_metric_value, data.result_metric_type);
        
        let output = `${hook} 🚀\n\n`;
        output += `Here's what happened:\n\n`;
        
        if (data.problem_broken) {
            output += `📍 The Problem:\n`;
            output += `${this.shortenText(data.problem_broken, 150)}\n\n`;
        }
        
        if (data.solution_strategy) {
            output += `💡 What We Did:\n`;
            output += `${this.shortenText(data.solution_strategy, 150)}\n\n`;
        }
        
        if (metric) {
            output += `📈 Results:\n`;
            output += `${metric}`;
            if (data.result_timeframe) {
                output += ` in ${data.result_timeframe}`;
            }
            output += `\n\n`;
        }
        
        if (data.result_quote) {
            output += `💬 "${this.shortenText(data.result_quote, 100)}"\n\n`;
        }
        
        output += `---\n`;
        output += `Want similar results? Let's connect. 👇`;
        
        return output;
    },
    
    /**
     * Sales Deck Slide Template
     */
    salesDeck(data) {
        const metric = this.formatMetric(data.result_metric_value, data.result_metric_type);
        
        let output = `## Client Success Snapshot\n\n`;
        
        if (data.client_industry) {
            output += `**Client:** ${data.client_industry} company`;
            if (data.company_size) {
                output += ` (${data.company_size} employees)`;
            }
            output += `\n\n`;
        }
        
        if (data.problem_broken) {
            output += `**Challenge:** ${this.shortenText(data.problem_broken, 100)}\n\n`;
        }
        
        if (data.solution_strategy) {
            output += `**Solution:** ${this.shortenText(data.solution_strategy, 100)}\n\n`;
        }
        
        if (metric) {
            output += `**Result:** ${metric}`;
            if (data.result_timeframe) {
                output += ` in ${data.result_timeframe}`;
            }
            output += `\n\n`;
        }
        
        if (data.result_quote) {
            output += `> "${this.shortenText(data.result_quote, 80)}"\n`;
        }
        
        return output;
    },
    
    /**
     * Cold Email Proof Section Template
     */
    coldEmail(data) {
        const metric = this.formatMetric(data.result_metric_value, data.result_metric_type);
        const industry = data.client_industry || 'client';
        
        let output = `Recently helped a ${industry}:\n\n`;
        
        if (data.problem_broken) {
            output += `• Problem: ${this.shortenText(data.problem_broken, 80)}\n`;
        }
        
        if (metric) {
            output += `• Result: ${metric}\n`;
        }
        
        if (data.result_timeframe) {
            output += `• Timeline: ${data.result_timeframe}\n`;
        }
        
        output += `\nHappy to share more details if helpful.`;
        
        return output;
    },
    
    /**
     * Get template by format name
     */
    getTemplate(format, data) {
        switch(format) {
            case 'case-study':
                return this.caseStudy(data);
            case 'linkedin':
                return this.linkedinPost(data);
            case 'sales-deck':
                return this.salesDeck(data);
            case 'cold-email':
                return this.coldEmail(data);
            default:
                return this.caseStudy(data);
        }
    },
    
    /**
     * Convert markdown to HTML
     */
    markdownToHtml(markdown) {
        if (!markdown) return '';
        
        let html = markdown
            // Headers
            .replace(/^### (.*$)/gim, '<h3>$1</h3>')
            .replace(/^## (.*$)/gim, '<h2>$1</h2>')
            .replace(/^# (.*$)/gim, '<h1>$1</h1>')
            // Bold
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            // Italic
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            // Blockquotes
            .replace(/^> (.*$)/gim, '<blockquote>$1</blockquote>')
            // Bullets
            .replace(/^[•\-\*] (.*$)/gim, '<li>$1</li>')
            // Line breaks
            .replace(/\n\n/g, '</p><p>')
            .replace(/\n/g, '<br>')
            // Horizontal rule
            .replace(/---/g, '<hr>');
        
        // Wrap in paragraph tags
        html = '<p>' + html + '</p>';
        
        // Fix list items
        html = html.replace(/<\/li><br>/g, '</li>');
        html = html.replace(/(<li>.*<\/li>)+/g, '<ul>$&</ul>');
        
        // Clean up empty paragraphs
        html = html.replace(/<p><\/p>/g, '');
        html = html.replace(/<p><br><\/p>/g, '');
        
        return html;
    }
};
