class NILMatrix {
    constructor() {
        this.baseAmount = 200000; // Base amount for 3-star, 2-year experience
        this.maxPlayers = 13;
        this.endowmentRate = 0.08; // 8% annual return
        
        this.initializeMatrix();
        this.setupEventListeners();
        this.calculateLimits();
        this.displaySalaries(); // Display initial salaries
    }

    initializeMatrix() {
        // Initialize with default values (13 3-star players with 2 years experience)
        this.clearMatrix();
        const threeStarCell = document.querySelector('input[data-stars="3"][data-years="2"]');
        if (threeStarCell) {
            threeStarCell.value = 13;
        }
        this.updatePlayerCount();
    }

    getMultiplier(stars, years) {
        // Calculate multiplier based on stars and years
        const starMultiplier = (stars - 3) * 0.2 + 1;
        const yearMultiplier = years * 0.2 + 1;
        return starMultiplier * yearMultiplier;
    }

    calculateSalary(stars, years) {
        return this.baseAmount * this.getMultiplier(stars, years);
    }

    updatePlayerCount() {
        let total = 0;
        document.querySelectorAll('#nilMatrix input').forEach(input => {
            total += parseInt(input.value) || 0;
        });
        
        document.getElementById('playerCount').textContent = total;
        document.getElementById('calculateBtn').disabled = total !== this.maxPlayers;
    }

    calculateEndowment() {
        let totalSalary = 0;
        document.querySelectorAll('#nilMatrix input').forEach(input => {
            const stars = parseInt(input.dataset.stars);
            const years = parseInt(input.dataset.years);
            const players = parseInt(input.value) || 0;
            totalSalary += this.calculateSalary(stars, years) * players;
        });

        return totalSalary / this.endowmentRate;
    }

    calculateLimits() {
        const formatEndowment = (amount) => {
            return new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
                minimumFractionDigits: 0,
                maximumFractionDigits: 0
            }).format(Math.round(amount));
        };

        const minSalary = this.calculateSalary(0, 0) * this.maxPlayers;
        const minEndowment = minSalary / this.endowmentRate;
        
        const maxSalary = this.calculateSalary(5, 5) * this.maxPlayers;
        const maxEndowment = maxSalary / this.endowmentRate;

        document.getElementById('minEndowment').textContent = formatEndowment(minEndowment);
        document.getElementById('maxEndowment').textContent = formatEndowment(maxEndowment);
    }

    randomizeRoster() {
        this.clearMatrix();
        let remainingPlayers = this.maxPlayers;
        
        while (remainingPlayers > 0) {
            const stars = Math.floor(Math.random() * 6);
            const years = Math.floor(Math.random() * 6);
            const input = document.querySelector(`input[data-stars="${stars}"][data-years="${years}"]`);
            
            if (input) {
                const currentValue = parseInt(input.value) || 0;
                input.value = currentValue + 1;
                remainingPlayers--;
            }
        }
        
        this.updatePlayerCount();
        // Automatically calculate endowment for random roster
        this.calculateAndDisplayEndowment();
    }

    calculateAndDisplayEndowment() {
        const endowment = this.calculateEndowment();
        const formattedEndowment = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(Math.round(endowment));
        
        document.getElementById('endowmentResult').innerHTML = 
            `Required Endowment:<br><span style="font-size: 2.2rem; color: #4299e1; display: block; margin-top: 0.5rem;">${formattedEndowment}</span>`;
    }

    clearMatrix() {
        document.querySelectorAll('#nilMatrix input').forEach(input => {
            input.value = '';
        });
    }

    displaySalaries() {
        // Update all salary displays
        for (let stars = 0; stars <= 5; stars++) {
            for (let years = 0; years <= 5; years++) {
                const salary = this.calculateSalary(stars, years);
                const displayElement = document.querySelector(`[data-salary-display="${stars}-${years}"]`);
                if (displayElement) {
                    displayElement.textContent = `$${new Intl.NumberFormat().format(Math.round(salary))}/year`;
                }
            }
        }
    }

    setupEventListeners() {
        document.querySelectorAll('#nilMatrix input').forEach(input => {
            input.addEventListener('input', () => this.updatePlayerCount());
        });

        document.getElementById('calculateBtn').addEventListener('click', () => {
            this.calculateAndDisplayEndowment();
        });

        document.getElementById('randomizeBtn').addEventListener('click', () => {
            this.randomizeRoster();
        });

        // Mode switching
        document.getElementById('rosterMode').addEventListener('click', () => {
            document.querySelector('.matrix-container').style.display = 'block';
            document.querySelector('.endowment-input').style.display = 'none';
            document.getElementById('rosterMode').classList.add('active');
            document.getElementById('endowmentMode').classList.remove('active');
            this.displaySalaries();
        });

        document.getElementById('endowmentMode').addEventListener('click', () => {
            document.querySelector('.matrix-container').style.display = 'none';
            document.querySelector('.endowment-input').style.display = 'block';
            document.getElementById('endowmentMode').classList.add('active');
            document.getElementById('rosterMode').classList.remove('active');
        });

        // Setup endowment mode functionality
        this.setupEndowmentMode();

        // Display initial salaries
        this.displaySalaries();

        document.getElementById('clearBtn').addEventListener('click', () => {
            this.clearMatrix();
            this.updatePlayerCount();
            // Clear the endowment result as well
            document.getElementById('endowmentResult').innerHTML = '';
        });
    }

    setupEndowmentMode() {
        const endowmentInput = document.getElementById('endowmentAmount');
        const distributeBtn = document.getElementById('distributeBtn');
        
        // Convert input to millions format
        endowmentInput.addEventListener('input', (e) => {
            const value = e.target.value;
            if (value) {
                // Limit to 3 decimal places
                e.target.value = Math.round(parseFloat(value) * 1000) / 1000;
            }
        });

        distributeBtn.addEventListener('click', () => {
            const endowmentMillions = parseFloat(endowmentInput.value);
            if (!endowmentMillions) return;

            const endowmentAmount = endowmentMillions * 1000000;
            this.distributeRoster(endowmentAmount);
            
            // Switch back to roster view
            document.getElementById('rosterMode').click();
        });
    }

    distributeRoster(endowmentAmount) {
        // Clear current roster
        this.clearMatrix();
        
        // Calculate available annual budget (8% of endowment)
        const annualBudget = endowmentAmount * this.endowmentRate;
        
        // Try different combinations until we find one within 200,000 of target
        let bestRoster = null;
        let bestDifference = Infinity;
        let attempts = 0;
        const maxAttempts = 200; // Increased attempts for better matching

        while (attempts < maxAttempts) {
            this.clearMatrix();
            this.generatePotentialRoster(annualBudget);
            
            const currentEndowment = this.calculateEndowment();
            const difference = Math.abs(currentEndowment - endowmentAmount);

            if (difference < bestDifference) {
                bestDifference = difference;
                bestRoster = this.getCurrentRoster();
            }

            if (difference <= 200000) {
                break;
            }

            attempts++;
        }

        // Apply the best roster found
        if (bestRoster) {
            this.applyRoster(bestRoster);
        }

        this.updatePlayerCount();
        // Calculate and display the actual endowment needed for this roster
        this.calculateAndDisplayEndowment();
    }

    getCurrentRoster() {
        const roster = [];
        document.querySelectorAll('#nilMatrix input').forEach(input => {
            if (input.value && parseInt(input.value) > 0) {
                roster.push({
                    stars: parseInt(input.dataset.stars),
                    years: parseInt(input.dataset.years),
                    count: parseInt(input.value)
                });
            }
        });
        return roster;
    }

    applyRoster(roster) {
        this.clearMatrix();
        roster.forEach(player => {
            const input = document.querySelector(
                `input[data-stars="${player.stars}"][data-years="${player.years}"]`
            );
            if (input) {
                input.value = player.count;
            }
        });
    }

    generatePotentialRoster(annualBudget) {
        let remainingBudget = annualBudget;
        let remainingPlayers = this.maxPlayers;
        const targetAverageSalary = annualBudget / this.maxPlayers;

        while (remainingPlayers > 0) {
            // Calculate how much we can spend per remaining player
            const averageRemaining = remainingBudget / remainingPlayers;
            
            // Adjust star and year ranges based on remaining budget
            let maxStars = 5;
            let maxYears = 5;
            
            // If we're running low on budget, restrict to lower-rated players
            if (averageRemaining < this.baseAmount) {
                maxStars = 2;
                maxYears = 2;
            } else if (averageRemaining < this.baseAmount * 1.2) {
                maxStars = 3;
                maxYears = 3;
            }

            // Generate player within our affordable range
            const stars = Math.floor(Math.random() * (maxStars + 1));
            const years = Math.floor(Math.random() * (maxYears + 1));
            const salary = this.calculateSalary(stars, years);

            // Only add player if we can afford them
            if (salary <= remainingBudget && salary <= averageRemaining * 2) {
                const input = document.querySelector(
                    `input[data-stars="${stars}"][data-years="${years}"]`
                );
                if (input) {
                    const currentValue = parseInt(input.value) || 0;
                    input.value = currentValue + 1;
                    remainingBudget -= salary;
                    remainingPlayers--;
                }
            }
        }

        // If we couldn't allocate all players, try again with lower requirements
        const total = Array.from(document.querySelectorAll('#nilMatrix input'))
            .reduce((sum, input) => sum + (parseInt(input.value) || 0), 0);
        
        if (total < this.maxPlayers) {
            this.clearMatrix();
            // Fill remaining with minimum salary players
            const input = document.querySelector('input[data-stars="0"][data-years="0"]');
            if (input) {
                input.value = this.maxPlayers;
            }
        }
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    new NILMatrix();
}); 