document.addEventListener("DOMContentLoaded", function() {
    const conversionType = document.getElementById("conversion-type");
    const fromUnit = document.getElementById("from-unit");
    const toUnit = document.getElementById("to-unit");
    const convertButton = document.getElementById("convert");
    const resultDisplay = document.getElementById("result");

    const units = {
        currency: ["USD", "CNY", "EUR", "GBP", "JPY"],
        length: ["meters", "kilometers", "miles", "feet"],
        weight: ["grams", "kilograms", "pounds", "ounces"],
        volume: ["liters", "milliliters", "gallons", "fluidOunces"]
    };

    let currencyRates = {}; // Object to store real-time exchange rates

    // Fetch real-time exchange rates
    async function fetchCurrencyRates() {
        try {
            const response = await fetch("https://api.exchangerate-api.com/v4/latest/USD"); 
            const data = await response.json();
            currencyRates = data.rates; 
        } catch (error) {
            console.error("Error fetching exchange rates:", error);
        }
    }

    function populateUnits(type) {
        fromUnit.innerHTML = "";
        toUnit.innerHTML = "";
        units[type].forEach(unit => {
            let option1 = new Option(unit, unit);
            let option2 = new Option(unit, unit);
            fromUnit.appendChild(option1);
            toUnit.appendChild(option2);
        });
    }

    conversionType.addEventListener("change", function() {
        populateUnits(conversionType.value);
    });

    convertButton.addEventListener("click", async function() {
        let value = parseFloat(document.getElementById("amount").value);
        let from = fromUnit.value;
        let to = toUnit.value;
        let conversionTypeValue = conversionType.value;

        if (isNaN(value)) {
            resultDisplay.textContent = "Enter a valid number";
            return;
        }

        if (conversionTypeValue === "currency") {
            if (!currencyRates[from] || !currencyRates[to]) {
                resultDisplay.textContent = "Fetching latest rates...";
                await fetchCurrencyRates(); // Fetch rates if not available
            }
            let result = value * (currencyRates[to] / currencyRates[from]);
            resultDisplay.textContent = result.toFixed(2);
        } else {
            let conversionRates = {
                length: { meters: 1, kilometers: 0.001, miles: 0.000621, feet: 3.281 },
                weight: { grams: 1, kilograms: 0.001, pounds: 0.0022, ounces: 0.0353 },
                volume: {
                    liters: 1,
                    milliliters: 1000,
                    cubicMeters: 0.001,
                    gallons: 0.264172,
                    fluidOunces: 33.814
                  }
                
            };
            let result = value * (conversionRates[conversionTypeValue][to] / conversionRates[conversionTypeValue][from]);
            resultDisplay.textContent = result.toFixed(2);
        }
    });

    // Initialize with default type and fetch latest currency rates
    populateUnits(conversionType.value);
    fetchCurrencyRates();
});
