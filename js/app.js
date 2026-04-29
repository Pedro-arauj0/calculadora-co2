/**
 * App - Main Application Logic
 * 
 * Handles initialization, form submission, and coordination between
 * Calculator and UI modules to process user input and display results.
 */

// ===== INITIALIZATION =====

/**
 * Initialize application when DOM is fully loaded
 * Sets up form handlers and initializes configuration
 */
(function() {
    // Wait for DOM to be fully loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeApp);
    } else {
        // DOM is already loaded
        initializeApp();
    }

    function initializeApp() {
        // 1. Call CONFIG.populateDatalist() to fill city autocomplete
        CONFIG.populateDatalist();

        // 2. Call CONFIG.setupDistanceAutofill() to enable auto-distance feature
        CONFIG.setupDistanceAutofill();

        // 3. Get form element by id 'calculator-form'
        const calculatorForm = document.getElementById('calculator-form');

        if (!calculatorForm) {
            console.error('Calculator form element not found');
            return;
        }

        // 4. Add submit event listener to form
        calculatorForm.addEventListener('submit', handleFormSubmit);

        // 5. Log to console
        console.log('✅ Calculadora inicializada!');
    }
})();

// ===== FORM SUBMIT HANDLER =====

/**
 * handleFormSubmit - Processes form submission and displays results
 * 
 * @param {Event} event - Form submit event
 */
function handleFormSubmit(event) {
    // 1. Prevent default form submission
    event.preventDefault();

    // ===== GET FORM VALUES =====

    // 2. Get all form values
    const originInput = document.getElementById('origin');
    const destinationInput = document.getElementById('destination');
    const distanceInput = document.getElementById('distance');
    const transportModeRadios = document.getElementsByName('transport-mode');

    // Trim whitespace from text inputs
    const origin = originInput.value.trim();
    const destination = destinationInput.value.trim();
    const distance = parseFloat(distanceInput.value);

    // Get checked radio button value for transport mode
    let transportMode = null;
    for (const radio of transportModeRadios) {
        if (radio.checked) {
            transportMode = radio.value;
            break;
        }
    }

    // ===== VALIDATE INPUTS =====

    // 3. Validate inputs
    // Check if origin, destination, distance are filled
    if (!origin || !destination || !distance) {
        alert('❌ Por favor, preencha todos os campos!');
        return;
    }

    // Check if distance is greater than 0
    if (distance <= 0) {
        alert('❌ A distância deve ser maior que 0 km!');
        return;
    }

    // Check if transport mode is selected
    if (!transportMode) {
        alert('❌ Por favor, selecione um modo de transporte!');
        return;
    }

    // ===== SHOW LOADING STATE =====

    // 4. Get submit button element
    const submitButton = event.target.querySelector('button[type="submit"]');

    // 5. Call UI.showLoading(button) to show loading state
    UI.showLoading(submitButton);

    // 6. Hide previous results sections
    UI.hideElement('results-content');
    UI.hideElement('comparison-content');
    UI.hideElement('carbon-credits-content');

    // ===== PROCESS DATA WITH DELAY =====

    // 7. Use setTimeout with 1500ms delay to simulate processing
    setTimeout(function() {
        try {
            // ===== CALCULATIONS =====

            // Calculate emission for selected mode
            const selectedEmission = Calculator.calculateEmission(distance, transportMode);

            // Calculate car emission as baseline
            const carEmission = Calculator.calculateEmission(distance, 'car');

            // Calculate savings compared to car
            const savingsData = transportMode !== 'car' 
                ? Calculator.calculateSavings(selectedEmission, carEmission)
                : null;

            // Calculate all modes comparison
            const allModesData = Calculator.calculateAllModes(distance);

            // Calculate carbon credits and price estimate
            const creditsAmount = Calculator.calculateCarbonCredits(selectedEmission);
            const priceEstimate = Calculator.estimateCreditPrice(creditsAmount);

            // ===== BUILD DATA OBJECTS FOR RENDERING =====

            // Results data object
            const resultsData = {
                origin: origin,
                destination: destination,
                distance: distance,
                emission: selectedEmission,
                mode: transportMode,
                savings: savingsData
            };

            // Credits data object
            const creditsData = {
                credits: creditsAmount,
                price: priceEstimate
            };

            // ===== RENDER AND DISPLAY RESULTS =====

            // Call UI.renderResults() and set innerHTML of results-content
            const resultsContent = document.getElementById('results-content');
            if (resultsContent) {
                resultsContent.innerHTML = UI.renderResults(resultsData);
            }

            // Call UI.renderComparison() and set innerHTML of comparison-content
            const comparisonContent = document.getElementById('comparison-content');
            if (comparisonContent) {
                comparisonContent.innerHTML = UI.renderComparison(allModesData, transportMode);
            }

            // Call UI.renderCarbonCredits() and set innerHTML of carbon-credits-content
            const creditsContent = document.getElementById('carbon-credits-content');
            if (creditsContent) {
                creditsContent.innerHTML = UI.renderCarbonCredits(creditsData);
            }

            // Show all three sections
            UI.showElement('results-content');
            UI.showElement('comparison-content');
            UI.showElement('carbon-credits-content');

            // Scroll to results section
            UI.scrollToElement('results-content');

            // Hide loading state
            UI.hideLoading(submitButton);

            console.log('✅ Cálculo concluído com sucesso!', resultsData);

        } catch (error) {
            // ===== ERROR HANDLING =====

            // Log error to console
            console.error('❌ Erro ao calcular emissões:', error);

            // Show user-friendly alert
            alert('❌ Ocorreu um erro ao processar o cálculo. Por favor, tente novamente.');

            // Hide loading state
            UI.hideLoading(submitButton);
        }
    }, 1500);
}