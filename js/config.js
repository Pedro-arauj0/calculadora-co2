/**
 * CONFIG - Global Configuration Object
 * 
 * Stores configuration data and initialization functions for the CO2 calculator.
 * Includes transport modes metadata, carbon credit information, and DOM setup functions.
 */

const CONFIG = {
    /**
     * TRANSPORT_MODES - Metadata for each transport mode
     * 
     * Each mode contains:
     * - label: Portuguese name for display
     * - icon: emoji representation
     * - color: hex color code for UI elements
     */
    TRANSPORT_MODES: {
        bicycle: {
            label: "Bicicleta",
            icon: "🚴",
            color: "#10b981"
        },
        car: {
            label: "Carro",
            icon: "🚗",
            color: "#3b82f6"
        },
        bus: {
            label: "Ônibus",
            icon: "🚌",
            color: "#f59e0b"
        },
        truck: {
            label: "Caminhão",
            icon: "🚚",
            color: "#ef4444"
        }
    },

    /**
     * CARBON_CREDIT - Carbon credit pricing and conversion information
     * 
     * - KG_PER_CREDIT: kilograms of CO2 per carbon credit
     * - PRICE_MIN_BRL: minimum price in Brazilian Reals
     * - PRICE_MAX_BRL: maximum price in Brazilian Reals
     */
    CARBON_CREDIT: {
        KG_PER_CREDIT: 1000,
        PRICE_MIN_BRL: 50,
        PRICE_MAX_BRL: 150
    },

    /**
     * EMISSION_FACTORS - CO2 emission factors for each transport mode
     * 
     * Values in kg CO2 per kilometer
     */
    EMISSION_FACTORS: {
        bicycle: 0,
        car: 0.12,
        bus: 0.08,
        truck: 0.25
    },

    /**
     * populateDatalist - Populates the cities datalist from RoutesDB
     * 
     * Gets the unique list of cities from RoutesDB.getAllCities() and
     * creates option elements for each city in the datalist element.
     * 
     * This enables autocomplete functionality for origin and destination inputs.
     */
    populateDatalist: function() {
        // Get the datalist element by id
        const datalist = document.getElementById('cities-list');

        if (!datalist) {
            console.warn('Datalist element with id "cities-list" not found');
            return;
        }

        // Get unique sorted list of all cities from RoutesDB
        const cities = RoutesDB.getAllCities();

        // Create and append option elements for each city
        cities.forEach(city => {
            const option = document.createElement('option');
            option.value = city;
            datalist.appendChild(option);
        });

        console.log(`Datalist populated with ${cities.length} cities`);
    },

    /**
     * setupDistanceAutofill - Sets up automatic distance calculation and manual override
     * 
     * Adds event listeners to:
     * - Origin and destination inputs: updates distance automatically when both are filled
     * - Manual distance checkbox: toggles between readonly and editable distance input
     * 
     * Handles:
     * - Finding routes via RoutesDB.findDistance()
     * - Updating distance input and helper text
     * - Visual feedback (color changes) for success/failure
     * - Manual input toggle with checkbox
     */
    setupDistanceAutofill: function() {
        // Get form elements
        const originInput = document.getElementById('origin');
        const destinationInput = document.getElementById('destination');
        const distanceInput = document.getElementById('distance');
        const manualCheckbox = document.getElementById('manual-distance');
        const helperText = document.querySelector('.form-group__helper-text');

        if (!originInput || !destinationInput || !distanceInput || !manualCheckbox) {
            console.warn('Required form elements not found for distance autofill setup');
            return;
        }

        /**
         * updateDistance - Helper function to calculate and update distance
         * Called when origin/destination change or manual checkbox is toggled
         */
        const updateDistance = () => {
            const origin = originInput.value.trim();
            const destination = destinationInput.value.trim();

            // Only proceed if both origin and destination are filled
            if (!origin || !destination) {
                return;
            }

            // Find distance using RoutesDB
            const distance = RoutesDB.findDistance(origin, destination);

            if (distance !== null) {
                // Route found
                distanceInput.value = distance;
                distanceInput.style.borderColor = 'var(--primary)';
                helperText.textContent = '✓ Distância encontrada automaticamente';
                helperText.style.color = 'var(--primary)';
            } else {
                // Route not found
                distanceInput.value = '';
                distanceInput.style.borderColor = '';
                helperText.textContent = '✗ Rota não encontrada. Use a distância manual ou verifique os dados.';
                helperText.style.color = 'var(--danger)';
            }
        };

        // Add change event listeners to origin and destination inputs
        originInput.addEventListener('change', updateDistance);
        destinationInput.addEventListener('change', updateDistance);

        // Add change event listener to manual distance checkbox
        manualCheckbox.addEventListener('change', function() {
            if (this.checked) {
                // Enable manual distance entry
                distanceInput.removeAttribute('readonly');
                distanceInput.style.backgroundColor = 'var(--white)';
                distanceInput.focus();
                helperText.textContent = 'Digite a distância manualmente em km';
                helperText.style.color = 'var(--text-light)';
            } else {
                // Disable manual entry and revert to automatic
                distanceInput.setAttribute('readonly', '');
                distanceInput.style.backgroundColor = '';
                helperText.style.color = 'var(--text-light)';
                
                // Try to auto-fill distance again
                updateDistance();
            }
        });

        console.log('Distance autofill setup complete');
    }
};

// IIFE to initialize on DOM ready
(function() {
    // Wait for DOM to be fully loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            CONFIG.populateDatalist();
            CONFIG.setupDistanceAutofill();
        });
    } else {
        // DOM is already loaded
        CONFIG.populateDatalist();
        CONFIG.setupDistanceAutofill();
    }
})();