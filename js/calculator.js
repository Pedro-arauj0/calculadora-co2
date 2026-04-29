/**
 * Calculator - Global Calculator Object
 * 
 * Provides methods for calculating CO2 emissions, savings, carbon credits,
 * and credit price estimates for different transport modes.
 */

const Calculator = {
    /**
     * calculateEmission - Calculates CO2 emission for a given distance and transport mode
     * 
     * @param {number} distanceKm - Distance in kilometers
     * @param {string} transportMode - Transport mode key (e.g., 'car', 'bus')
     * @returns {number} CO2 emission in kg, rounded to 2 decimal places
     */
    calculateEmission: function(distanceKm, transportMode) {
        // Get emission factor from CONFIG.EMISSION_FACTORS using transportMode as key
        const factor = CONFIG.EMISSION_FACTORS[transportMode];
        
        // Calculate: distance * factor
        const emission = distanceKm * factor;
        
        // Return result rounded to 2 decimal places
        return Math.round(emission * 100) / 100;
    },

    /**
     * calculateAllModes - Calculates emissions for all transport modes and compares to car baseline
     * 
     * @param {number} distanceKm - Distance in kilometers
     * @returns {Array} Array of objects with mode, emission, and percentage vs car, sorted by emission (lowest first)
     */
    calculateAllModes: function(distanceKm) {
        // Create array to store results
        const results = [];
        
        // For each transport mode in CONFIG.EMISSION_FACTORS:
        const modes = Object.keys(CONFIG.EMISSION_FACTORS);
        
        // Calculate car emission as baseline
        const carEmission = this.calculateEmission(distanceKm, 'car');
        
        for (const mode of modes) {
            // Calculate emission for that mode
            const emission = this.calculateEmission(distanceKm, mode);
            
            // Calculate percentage vs car: (emission / carEmission) * 100
            const percentageVsCar = (emission / carEmission) * 100;
            
            // Push object to array: { mode: mode, emission: emission, percentageVsCar: percentageVsCar }
            results.push({
                mode: mode,
                emission: emission,
                percentageVsCar: Math.round(percentageVsCar * 100) / 100
            });
        }
        
        // Sort array by emission (lowest first)
        results.sort((a, b) => a.emission - b.emission);
        
        // Return array
        return results;
    },

    /**
     * calculateSavings - Calculates CO2 savings compared to a baseline emission
     * 
     * @param {number} emission - Actual emission in kg
     * @param {number} baselineEmission - Baseline emission in kg (e.g., car emission)
     * @returns {Object} Object with savedKg and percentage, both rounded to 2 decimal places
     */
    calculateSavings: function(emission, baselineEmission) {
        // Calculate saved kg: baseline - emission
        const savedKg = baselineEmission - emission;
        
        // Calculate percentage: (saved / baseline) * 100
        const percentage = (savedKg / baselineEmission) * 100;
        
        // Return object: { savedKg: savedKg, percentage: percentage }
        // Round numbers to 2 decimals
        return {
            savedKg: Math.round(savedKg * 100) / 100,
            percentage: Math.round(percentage * 100) / 100
        };
    },

    /**
     * calculateCarbonCredits - Calculates carbon credits equivalent to CO2 emission
     * 
     * @param {number} emissionKg - CO2 emission in kg
     * @returns {number} Number of carbon credits, rounded to 4 decimal places
     */
    calculateCarbonCredits: function(emissionKg) {
        // Divide emission by CONFIG.CARBON_CREDIT.KG_PER_CREDIT
        const credits = emissionKg / CONFIG.CARBON_CREDIT.KG_PER_CREDIT;
        
        // Return rounded to 4 decimal places
        return Math.round(credits * 10000) / 10000;
    },

    /**
     * estimateCreditPrice - Estimates price range for carbon credits
     * 
     * @param {number} credits - Number of carbon credits
     * @returns {Object} Object with min, max, and average prices in BRL, rounded to 2 decimal places
     */
    estimateCreditPrice: function(credits) {
        // Calculate min: credits * PRICE_MIN_BRL
        const min = credits * CONFIG.CARBON_CREDIT.PRICE_MIN_BRL;
        
        // Calculate max: credits * PRICE_MAX_BRL
        const max = credits * CONFIG.CARBON_CREDIT.PRICE_MAX_BRL;
        
        // Calculate average: (min + max) / 2
        const average = (min + max) / 2;
        
        // Return object: { min: min, max: max, average: average }
        // Round to 2 decimals
        return {
            min: Math.round(min * 100) / 100,
            max: Math.round(max * 100) / 100,
            average: Math.round(average * 100) / 100
        };
    }
};

// Make Calculator globally available
window.Calculator = Calculator;