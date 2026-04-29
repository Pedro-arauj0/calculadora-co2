/**
 * UI - Global UI Object
 * 
 * Provides methods for formatting data, rendering HTML components,
 * and managing UI state for the CO2 calculator application.
 * 
 * Uses BEM naming convention for CSS classes and template literals for HTML generation.
 */

const UI = {
    // ===== UTILITY METHODS =====

    /**
     * formatNumber - Formats a number with specified decimal places and locale-specific separators
     * 
     * @param {number} number - The number to format
     * @param {number} decimals - Number of decimal places
     * @returns {string} Formatted number string (e.g., "1.234,56")
     */
    formatNumber: function(number, decimals) {
        // Use toFixed() for decimals
        const fixed = parseFloat(number).toFixed(decimals);
        
        // Add thousand separators using toLocaleString with pt-BR locale
        return parseFloat(fixed).toLocaleString('pt-BR', {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals
        });
    },

    /**
     * formatCurrency - Formats a value as Brazilian currency (R$)
     * 
     * @param {number} value - The value to format
     * @returns {string} Formatted currency string (e.g., "R$ 1.234,56")
     */
    formatCurrency: function(value) {
        // Format as R$ with pt-BR locale
        return value.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        });
    },

    /**
     * showElement - Makes an element visible by removing the 'hidden' class
     * 
     * @param {string} elementId - ID of the element to show
     */
    showElement: function(elementId) {
        // Get element by ID
        const element = document.getElementById(elementId);
        
        if (element) {
            // Remove 'hidden' class
            element.classList.remove('hidden');
        }
    },

    /**
     * hideElement - Hides an element by adding the 'hidden' class
     * 
     * @param {string} elementId - ID of the element to hide
     */
    hideElement: function(elementId) {
        // Get element by ID
        const element = document.getElementById(elementId);
        
        if (element) {
            // Add 'hidden' class
            element.classList.add('hidden');
        }
    },

    /**
     * scrollToElement - Smoothly scrolls an element into view
     * 
     * @param {string} elementId - ID of the element to scroll to
     */
    scrollToElement: function(elementId) {
        // Get element by ID
        const element = document.getElementById(elementId);
        
        if (element) {
            // Use scrollIntoView with smooth behavior
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    },

    // ===== RENDERING METHODS =====

    /**
     * renderResults - Renders the main results cards
     * 
     * HTML Structure:
     * - results__container: Main wrapper
     *   - results__card: Individual card for each metric
     *     - results__card-icon: Icon/emoji element
     *     - results__card-content: Card content wrapper
     *       - results__card-label: Label text
     *       - results__card-value: Main value
     * 
     * @param {Object} data - Results data object
     *   - origin: Starting city
     *   - destination: Destination city
     *   - distance: Distance in km
     *   - emission: CO2 emission in kg
     *   - mode: Transport mode key
     *   - savings: Object with savedKg and percentage (optional)
     * @returns {string} HTML string with results cards
     */
    renderResults: function(data) {
        // Get mode metadata from CONFIG.TRANSPORT_MODES
        const modeConfig = CONFIG.TRANSPORT_MODES[data.mode];
        const modeIcon = modeConfig?.icon || '🚗';
        const modeLabel = modeConfig?.label || data.mode;

        // Create HTML string with template literals containing:
        // Route card showing origin -> destination
        let html = `
            <div class="results__container">
                <!-- Route Card -->
                <div class="results__card">
                    <div class="results__card-icon">🛣️</div>
                    <div class="results__card-content">
                        <div class="results__card-label">Rota</div>
                        <div class="results__card-value">${data.origin} → ${data.destination}</div>
                    </div>
                </div>

                <!-- Distance Card showing distance in km -->
                <div class="results__card">
                    <div class="results__card-icon">📏</div>
                    <div class="results__card-content">
                        <div class="results__card-label">Distância</div>
                        <div class="results__card-value">${this.formatNumber(data.distance, 2)} km</div>
                    </div>
                </div>

                <!-- Emission Card showing CO2 in kg with green leaf icon -->
                <div class="results__card">
                    <div class="results__card-icon">🍃</div>
                    <div class="results__card-content">
                        <div class="results__card-label">Emissão de CO₂</div>
                        <div class="results__card-value">${this.formatNumber(data.emission, 2)} kg</div>
                    </div>
                </div>

                <!-- Transport Card showing mode icon and label -->
                <div class="results__card">
                    <div class="results__card-icon">${modeIcon}</div>
                    <div class="results__card-content">
                        <div class="results__card-label">Transporte</div>
                        <div class="results__card-value">${modeLabel}</div>
                    </div>
                </div>
        `;

        // If mode is not 'car' and savings exist: savings card
        // showing kg saved and percentage
        if (data.mode !== 'car' && data.savings) {
            html += `
                <!-- Savings Card -->
                <div class="results__card results__card--savings">
                    <div class="results__card-icon">✨</div>
                    <div class="results__card-content">
                        <div class="results__card-label">CO₂ Economizado</div>
                        <div class="results__card-value">${this.formatNumber(data.savings.savedKg, 2)} kg</div>
                        <div class="results__card-subtext">${this.formatNumber(data.savings.percentage, 1)}% menos que carro</div>
                    </div>
                </div>
            `;
        }

        html += `</div>`;

        // Return complete HTML string
        // Use div with class="results__card" for each card
        // Use BEM naming for internal elements
        return html;
    },

    /**
     * renderComparison - Renders comparison of all transport modes
     * 
     * HTML Structure:
     * - comparison__container: Main wrapper
     *   - comparison__item: Individual mode item (has --selected modifier when selected)
     *     - comparison__item-header: Mode info and badge
     *       - comparison__item-icon: Mode icon
     *       - comparison__item-label: Mode label
     *       - comparison__item-stats: Emission and percentage stats
     *       - comparison__item-badge: "Selecionado" badge
     *     - comparison__item-bar: Progress bar wrapper
     *       - comparison__item-bar-fill: Color-coded fill
     * - comparison__tip: Helpful message box
     * 
     * @param {Array} modesArray - Array from Calculator.calculateAllModes()
     * @param {string} selectedMode - Currently selected transport mode
     * @returns {string} HTML string with comparison cards
     */
    renderComparison: function(modesArray, selectedMode) {
        // Find max emission for bar scale reference
        const maxEmission = Math.max(...modesArray.map(m => m.emission));

        // Create HTML string for each mode:
        let html = '<div class="comparison__container">';

        modesArray.forEach(item => {
            const modeConfig = CONFIG.TRANSPORT_MODES[item.mode];
            const modeIcon = modeConfig?.icon || '🚗';
            const modeLabel = modeConfig?.label || item.mode;

            // Calculate bar width and color based on emission percentage
            const barPercentage = (item.emission / maxEmission) * 100;
            let barColor = '#10b981'; // green (0-25%)
            
            if (barPercentage > 100) {
                barColor = '#dc2626'; // red (>100%)
            } else if (barPercentage > 75) {
                barColor = '#ea580c'; // orange (75-100%)
            } else if (barPercentage > 25) {
                barColor = '#eab308'; // yellow (25-75%)
            }

            // Container div with class="comparison__item"
            // If mode === selectedMode, add class="comparison__item--selected"
            const selectedClass = item.mode === selectedMode ? ' comparison__item--selected' : '';
            
            html += `
                <div class="comparison__item${selectedClass}">
                    <!-- Header with mode icon, label, and emission stats -->
                    <div class="comparison__item-header">
                        <div class="comparison__item-info">
                            <div class="comparison__item-icon">${modeIcon}</div>
                            <div class="comparison__item-label">${modeLabel}</div>
                        </div>
                        <div class="comparison__item-stats">
                            <span class="comparison__item-emission">${this.formatNumber(item.emission, 2)} kg</span>
                            <span class="comparison__item-percentage">${this.formatNumber(item.percentageVsCar, 1)}%</span>
                        </div>
                        ${item.mode === selectedMode ? '<span class="comparison__item-badge">Selecionado</span>' : ''}
                    </div>

                    <!-- Progress bar with width based on emission -->
                    <!-- Color-code bar: green (0-25%), yellow (25-75%), orange (75-100%), red (>100%) -->
                    <div class="comparison__item-bar">
                        <div class="comparison__item-bar-fill" style="width: ${barPercentage}%; background-color: ${barColor};"></div>
                    </div>
                </div>
            `;
        });

        // At the end, add tip box with helpful message
        html += `
            <div class="comparison__tip">
                <span class="comparison__tip-icon">💡</span>
                <div class="comparison__tip-content">
                    <div class="comparison__tip-title">Dica</div>
                    <div class="comparison__tip-text">Utilize transporte público ou compartilhado para reduzir suas emissões de CO₂</div>
                </div>
            </div>
        </div>`;

        // Return complete HTML string
        return html;
    },

    /**
     * renderCarbonCredits - Renders carbon credits information and pricing
     * 
     * HTML Structure:
     * - credits__container: Main wrapper
     *   - credits__grid: 2-column grid
     *     - credits__card: Individual card
     *       - credits__card-value: Large number display
     *       - credits__card-helper: Helper text
     *   - credits__info: Information box explaining credits
     *   - credits__button: Action button for compensation
     * 
     * @param {Object} creditsData - Credits data object
     *   - credits: Number of carbon credits
     *   - price: Object with { min, max, average }
     * @returns {string} HTML string with carbon credits info
     */
    renderCarbonCredits: function(creditsData) {
        // Create HTML string with:
        // Grid with 2 cards
        let html = `
            <div class="credits__container">
                <div class="credits__grid">
                    <!-- Card 1: Credits needed -->
                    <div class="credits__card">
                        <div class="credits__card-label">Créditos Necessários</div>
                        <div class="credits__card-value">${this.formatNumber(creditsData.credits, 4)}</div>
                        <div class="credits__card-helper">1 crédito = 1.000 kg CO₂</div>
                    </div>

                    <!-- Card 2: Estimated price -->
                    <div class="credits__card">
                        <div class="credits__card-label">Preço Estimado</div>
                        <div class="credits__card-value">${this.formatCurrency(creditsData.price.average)}</div>
                        <div class="credits__card-range">
                            ${this.formatCurrency(creditsData.price.min)} - ${this.formatCurrency(creditsData.price.max)}
                        </div>
                    </div>
                </div>

                <!-- Info box explaining what carbon credits are -->
                <div class="credits__info">
                    <div class="credits__info-title">O que são Créditos de Carbono?</div>
                    <div class="credits__info-text">
                        Um crédito de carbono representa uma tonelada de CO₂ equivalente removida ou reduzida 
                        da atmosfera. Você pode compensar suas emissões adquirindo créditos de projetos 
                        ambientais certificados.
                    </div>
                </div>

                <!-- Button for compensation (demo) -->
                <button class="credits__button">
                    🛒 Compensar Emissões
                </button>
            </div>
        `;

        // Return complete HTML string
        // Use formatNumber and formatCurrency for values
        return html;
    },

    /**
     * showLoading - Shows a loading state on a button
     * 
     * HTML for spinner: '<span class="spinner"></span> Calculando...'
     * 
     * @param {HTMLElement} buttonElement - The button element to show loading state on
     */
    showLoading: function(buttonElement) {
        // Save original text in data attribute: buttonElement.dataset.originalText
        buttonElement.dataset.originalText = buttonElement.innerHTML;
        
        // Disable button
        buttonElement.disabled = true;
        
        // Change innerHTML to show spinner and "Calculando..." text
        // Spinner: '<span class="spinner"></span> Calculando...'
        buttonElement.innerHTML = '<span class="spinner"></span> Calculando...';
    },

    /**
     * hideLoading - Hides the loading state on a button and restores original text
     * 
     * @param {HTMLElement} buttonElement - The button element to restore
     */
    hideLoading: function(buttonElement) {
        // Enable button
        buttonElement.disabled = false;
        
        // Restore original text from data attribute
        buttonElement.innerHTML = buttonElement.dataset.originalText || 'Calcular';
    }
};

// Make UI globally available
window.UI = UI;