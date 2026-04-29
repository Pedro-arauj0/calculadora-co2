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

// ===== VALIDATION FUNCTIONS =====

/**
 * validarECalcular - Validates and retrieves distance in both manual and automatic modes
 * 
 * Handles two scenarios:
 * 1. Manual mode: User enters distance manually
 * 2. Automatic mode: Distance is looked up from RoutesDB
 * 
 * Shows appropriate error messages for each mode.
 * 
 * @returns {number|null} Valid distance in km, or null if validation fails
 */
function validarECalcular() {
    const manualCheckbox = document.getElementById('manual-distance');
    const distanceInput = document.getElementById('distance');
    const originInput = document.getElementById('origin');
    const destinationInput = document.getElementById('destination');

    const isManual = manualCheckbox.checked;
    let distancia;

    if (isManual) {
        // Manual mode: get distance from input field
        distancia = parseFloat(distanceInput.value);

        if (!distancia || distancia <= 0) {
            alert('❌ Por favor, preencha a distância manual com um valor maior que 0!');
            return null;
        }
    } else {
        // Automatic mode: search distance in routes database
        const origem = originInput.value.trim();
        const destino = destinationInput.value.trim();

        if (!origem || !destino) {
            alert('❌ Por favor, preencha a origem e o destino!');
            return null;
        }

        // Search distance in RoutesDB
        distancia = RoutesDB.findDistance(origem, destino);

        if (distancia === null || distancia < 0) {
            alert('❌ Rota não encontrada! Por favor, ative o modo manual e insira a distância.');
            return null;
        }

        if (distancia === 0) {
            alert('❌ Origem e destino não podem ser iguais!');
            return null;
        }
    }

    // If we reach here, distance is valid
    return distancia;
}

// ===== FORM DATA COLLECTION =====

/**
 * obterDadosDoFormulario - Collects and validates all form data
 * 
 * Gathers data from form inputs and validates them:
 * - Origin and destination cities
 * - Selected transport mode
 * - Distance (from automatic or manual mode)
 * 
 * @returns {Object|null} Object with form data or null if validation fails
 */
function obterDadosDoFormulario() {
    const originInput = document.getElementById('origin');
    const destinationInput = document.getElementById('destination');
    const transportModeRadios = document.getElementsByName('transport');

    // Get and trim text inputs
    const origin = originInput.value.trim();
    const destination = destinationInput.value.trim();

    // Validate origin and destination
    if (!origin || !destination) {
        alert('❌ Por favor, preencha a origem e o destino!');
        return null;
    }

    // Get checked transport mode
    let transportMode = null;
    for (const radio of transportModeRadios) {
        if (radio.checked) {
            transportMode = radio.value;
            break;
        }
    }

    // Validate transport mode
    if (!transportMode) {
        alert('❌ Por favor, selecione um modo de transporte!');
        return null;
    }

    // Validate and get distance
    const distance = validarECalcular();
    if (distance === null) {
        return null;
    }

    // Return collected data object
    return {
        origin,
        destination,
        distance,
        transportMode
    };
}

// ===== ASYNC CALCULATION FUNCTION =====

/**
 * calcularEmissoes - Asynchronous function to perform all calculations
 * 
 * Simulates processing delay and performs all emission calculations:
 * - Selected transport mode emission
 * - Car baseline emission
 * - Savings comparison
 * - All modes comparison
 * - Carbon credits calculation
 * 
 * @param {Object} dados - Form data object containing distance and mode
 * @returns {Promise<Object>} Resolved with calculation results object
 */
async function calcularEmissoes(dados) {
    // Simulate processing delay (1500ms)
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Calculate emission for selected mode
    const selectedEmission = Calculator.calculateEmission(dados.distance, dados.transportMode);

    // Calculate car emission as baseline
    const carEmission = Calculator.calculateEmission(dados.distance, 'car');

    // Calculate savings compared to car
    const savingsData = dados.transportMode !== 'car' 
        ? Calculator.calculateSavings(selectedEmission, carEmission)
        : null;

    // Calculate all modes comparison
    const allModesData = Calculator.calculateAllModes(dados.distance);

    // Calculate carbon credits and price estimate
    const creditsAmount = Calculator.calculateCarbonCredits(selectedEmission);
    const priceEstimate = Calculator.estimateCreditPrice(creditsAmount);

    // Return results object
    return {
        resultsData: {
            origin: dados.origin,
            destination: dados.destination,
            distance: dados.distance,
            emission: selectedEmission,
            mode: dados.transportMode,
            savings: savingsData
        },
        comparisonData: allModesData,
        selectedMode: dados.transportMode,
        creditsData: {
            credits: creditsAmount,
            price: priceEstimate
        }
    };
}

// ===== FORM SUBMIT HANDLER =====

/**
 * handleFormSubmit - Processes form submission with async calculations
 * 
 * Workflow:
 * 1. Prevents default form submission
 * 2. Collects and validates form data
 * 3. Shows loading state with spinner animation
 * 4. Performs async calculations
 * 5. Renders and displays results
 * 6. Handles errors gracefully
 * 7. Always removes loading state (finally block)
 * 
 * @param {Event} event - Form submit event
 */
async function handleFormSubmit(event) {
    // Prevent default form submission
    event.preventDefault();

    // Collect and validate form data
    const dados = obterDadosDoFormulario();
    if (!dados) {
        return;
    }

    // Get submit button element for loading state
    const submitButton = event.target.querySelector('button[type="submit"]');

    try {
        // Add loading state with spinner animation
        if (submitButton) {
            submitButton.classList.add('loading');
            UI.showLoading(submitButton);
        }

        // Hide previous results sections
        UI.hideElement('results-content');
        UI.hideElement('comparison-content');
        UI.hideElement('carbon-credits-content');

        // Perform asynchronous calculations
        const resultado = await calcularEmissoes(dados);

        // Render results section
        const resultsContent = document.getElementById('results-content');
        if (resultsContent) {
            resultsContent.innerHTML = UI.renderResults(resultado.resultsData);
            UI.showElement('results-content');
        }

        // Render comparison section
        const comparisonContent = document.getElementById('comparison-content');
        if (comparisonContent) {
            comparisonContent.innerHTML = UI.renderComparison(
                resultado.comparisonData, 
                resultado.selectedMode
            );
            UI.showElement('comparison-content');
        }

        // Render carbon credits section
        const creditsContent = document.getElementById('carbon-credits-content');
        if (creditsContent) {
            creditsContent.innerHTML = UI.renderCarbonCredits(resultado.creditsData);
            UI.showElement('carbon-credits-content');
        }

        // Scroll to results section
        UI.scrollToElement('results-content');

        // Log success
        console.log('✅ Cálculo concluído com sucesso!', resultado);

    } catch (error) {
        // Log error to console for debugging
        console.error('❌ Erro ao calcular emissões:', error);

        // Show user-friendly error message
        alert('❌ Ocorreu um erro ao processar o cálculo. Por favor, tente novamente.');

    } finally {
        // Always remove loading state (happens regardless of success/error)
        if (submitButton) {
            submitButton.classList.remove('loading');
            UI.hideLoading(submitButton);
        }
    }
}