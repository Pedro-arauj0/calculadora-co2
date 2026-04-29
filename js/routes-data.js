/**
 * RoutesDB - Database of Brazilian Routes and Distances
 * 
 * Stores information about routes between major Brazilian cities
 * and provides methods to query distance data and available cities.
 */

const RoutesDB = {
    /**
     * routes - Array of route objects with structure:
     * {
     *   origin: string (city name with state abbreviation, e.g., "São Paulo, SP"),
     *   destination: string (city name with state abbreviation),
     *   distanceKm: number (actual distance in kilometers)
     * }
     */
    routes: [
        // Southeast Region - Capital Connections
        { origin: "São Paulo, SP", destination: "Rio de Janeiro, RJ", distanceKm: 430 },
        { origin: "São Paulo, SP", destination: "Belo Horizonte, MG", distanceKm: 586 },
        { origin: "São Paulo, SP", destination: "Brasília, DF", distanceKm: 1015 },
        { origin: "Rio de Janeiro, RJ", destination: "Brasília, DF", distanceKm: 1148 },
        { origin: "Rio de Janeiro, RJ", destination: "Belo Horizonte, MG", distanceKm: 433 },
        { origin: "Belo Horizonte, MG", destination: "Brasília, DF", distanceKm: 717 },

        // Southeast Region - Major Routes
        { origin: "São Paulo, SP", destination: "Campinas, SP", distanceKm: 95 },
        { origin: "São Paulo, SP", destination: "Santos, SP", distanceKm: 71 },
        { origin: "São Paulo, SP", destination: "Sorocaba, SP", distanceKm: 108 },
        { origin: "Rio de Janeiro, RJ", destination: "Niterói, RJ", distanceKm: 13 },
        { origin: "Rio de Janeiro, RJ", destination: "Cabo Frio, RJ", distanceKm: 162 },
        { origin: "Belo Horizonte, MG", destination: "Ouro Preto, MG", distanceKm: 100 },
        { origin: "Belo Horizonte, MG", destination: "Diamantina, MG", distanceKm: 301 },
        { origin: "Belo Horizonte, MG", destination: "Uberlândia, MG", distanceKm: 457 },

        // South Region - Capital Connections
        { origin: "Rio de Janeiro, RJ", destination: "Curitiba, PR", distanceKm: 919 },
        { origin: "São Paulo, SP", destination: "Curitiba, PR", distanceKm: 408 },
        { origin: "São Paulo, SP", destination: "Porto Alegre, RS", distanceKm: 1165 },
        { origin: "Curitiba, PR", destination: "Porto Alegre, RS", distanceKm: 1019 },
        { origin: "Curitiba, PR", destination: "Florianópolis, SC", distanceKm: 499 },
        { origin: "Porto Alegre, RS", destination: "Florianópolis, SC", distanceKm: 520 },

        // South Region - Major Routes
        { origin: "Curitiba, PR", destination: "Foz do Iguaçu, PR", distanceKm: 640 },
        { origin: "Curitiba, PR", destination: "Maringá, PR", distanceKm: 428 },
        { origin: "Porto Alegre, RS", destination: "Pelotas, RS", distanceKm: 270 },
        { origin: "Florianópolis, SC", destination: "Blumenau, SC", distanceKm: 186 },
        { origin: "Florianópolis, SC", destination: "Joinville, SC", distanceKm: 275 },

        // Northeast Region - Capital Connections
        { origin: "Brasília, DF", destination: "Salvador, BA", distanceKm: 1446 },
        { origin: "Brasília, DF", destination: "Recife, PE", distanceKm: 1759 },
        { origin: "Brasília, DF", destination: "Fortaleza, CE", distanceKm: 2289 },

        // Northeast Region - Major Routes
        { origin: "Salvador, BA", destination: "Ilhéus, BA", distanceKm: 461 },
        { origin: "Recife, PE", destination: "Olinda, PE", distanceKm: 8 },
        { origin: "Recife, PE", destination: "Caruaru, PE", distanceKm: 134 },
        { origin: "Fortaleza, CE", destination: "Juazeiro do Norte, CE", distanceKm: 491 },
        { origin: "Fortaleza, CE", destination: "Canoa Quebrada, CE", distanceKm: 168 },
        { origin: "Salvador, BA", destination: "Feira de Santana, BA", distanceKm: 109 },

        // North Region - Major Routes
        { origin: "Manaus, AM", destination: "Porto Velho, RO", distanceKm: 1456 },
        { origin: "Belém, PA", destination: "Macapá, AP", distanceKm: 661 },
        { origin: "Brasília, DF", destination: "Palmas, TO", distanceKm: 910 },
        { origin: "Brasília, DF", destination: "Goiânia, GO", distanceKm: 209 },

        // Center-West Region - Major Routes
        { origin: "Brasília, DF", destination: "Cuiabá, MT", distanceKm: 947 },
        { origin: "Goiânia, GO", destination: "Anápolis, GO", distanceKm: 55 },
        { origin: "Cuiabá, MT", destination: "Rondonópolis, MT", distanceKm: 212 },
    ],

    /**
     * getAllCities - Returns a unique, sorted array of all cities in the database
     * 
     * @returns {array} Array of unique city names with state abbreviations, sorted alphabetically
     */
    getAllCities: function() {
        const citiesSet = new Set();

        // Extract all cities from both origin and destination
        this.routes.forEach(route => {
            citiesSet.add(route.origin);
            citiesSet.add(route.destination);
        });

        // Convert to array, remove duplicates (already done by Set), and sort alphabetically
        return Array.from(citiesSet).sort((a, b) => a.localeCompare(b, 'pt-BR'));
    },

    /**
     * findDistance - Finds the distance between two cities
     * 
     * Searches in both directions (origin-destination and destination-origin)
     * to handle cases where routes might be defined in either direction.
     * Normalizes input for case-insensitive and whitespace-tolerant comparison.
     * 
     * @param {string} origin - The origin city (with state, e.g., "São Paulo, SP")
     * @param {string} destination - The destination city (with state)
     * @returns {number|null} Distance in kilometers if route is found, null otherwise
     */
    findDistance: function(origin, destination) {
        // Normalize inputs: trim whitespace and convert to lowercase for comparison
        const normalizedOrigin = origin.trim().toLowerCase();
        const normalizedDestination = destination.trim().toLowerCase();

        // Check if origin and destination are the same
        if (normalizedOrigin === normalizedDestination) {
            return 0;
        }

        // Search through all routes
        for (let route of this.routes) {
            const routeOrigin = route.origin.toLowerCase();
            const routeDestination = route.destination.toLowerCase();

            // Check forward direction (origin -> destination)
            if (routeOrigin === normalizedOrigin && routeDestination === normalizedDestination) {
                return route.distanceKm;
            }

            // Check reverse direction (destination -> origin)
            if (routeOrigin === normalizedDestination && routeDestination === normalizedOrigin) {
                return route.distanceKm;
            }
        }

        // Return null if no route is found
        return null;
    }
};

// Export for use in other modules (if using ES6 modules, uncomment the line below)
// export default RoutesDB;