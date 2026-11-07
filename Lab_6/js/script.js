
// ========================================
// 1. API CONFIGURATION
// ========================================
const API_KEY = "04bbbf685ff4b302746629f76024b8f9";

const API_URL = "https://data.fixer.io/api/latest";

const currencies = {
    CAD: "Canadian Dollar",
    USD: "US Dollar",
    GBP: "British Pound",
    JPY: "Japanese Yen",
    CNY: "Chinese Yuan"
};

let exchangeRates = null;


// ========================================
// 2. FETCH LIVE EXCHANGE RATE DATA
// ========================================

async function fetchExchangeRates() {

    const refreshButton = document.getElementById("refresh-btn");
    const status = document.getElementById("status");
    const container = document.getElementById("rates-container");

    refreshButton.disabled = true;
    refreshButton.textContent = "Loading...";

    status.textContent = "Connecting to Fixer API...";

    try {

        // Send GET request to Fixer API
        const response = await fetch(
            `${API_URL}?access_key=${API_KEY}&symbols=CAD,USD,GBP,JPY,CNY`
        );

        // Check HTTP response
        if (!response.ok) {
            throw new Error("Network response was not successful.");
        }

        // Convert response into JSON
        const data = await response.json();

        // Check API response
        if (!data.success) {
            throw new Error(
                data.error?.info || "Unable to retrieve exchange rates."
            );
        }

        // Store exchange rates
        exchangeRates = data.rates;

        // Update webpage
        displayExchangeRates(data);

        // Update date
        document.getElementById("data-date").textContent = data.date;

        status.textContent = "Exchange rates successfully updated!";

        // Automatically calculate conversion
        convertCurrency();

    } catch (error) {

        console.error("API Error:", error);

        container.innerHTML = `
            <p class="loading">
                Unable to load exchange rates.
                Please check your API key or try again.
            </p>
        `;

        status.textContent = error.message;

    } finally {

        refreshButton.disabled = false;
        refreshButton.textContent = "↻ Refresh Rates";

    }
}


// ========================================
// 3. DYNAMICALLY DISPLAY EXCHANGE RATES
// ========================================

function displayExchangeRates(data) {

    const container = document.getElementById("rates-container");

    container.innerHTML = "";

    const rates = data.rates;

    // Find maximum rate for visual bar scaling
    const maxRate = Math.max(...Object.values(rates));

    Object.entries(rates).forEach(([code, rate]) => {

        const card = document.createElement("div");

        card.className = "rate-card";

        // Generate visual bar based on API data
        const barWidth = Math.max(
            5,
            (Math.log(rate) / Math.log(maxRate)) * 100
        );

        card.innerHTML = `
            <p class="currency-name">
                ${currencies[code]}
            </p>

            <h3 class="currency-code">${code}</h3>

            <p class="rate-value">
                ${rate.toFixed(4)}
            </p>

            <div class="rate-bar">
                <span style="width: ${barWidth}%"></span>
            </div>
        `;

        container.appendChild(card);

    });

}


// ========================================
// 4. CURRENCY CONVERTER
// ========================================

function convertCurrency() {

    if (!exchangeRates) {
        return;
    }

    const amount = parseFloat(
        document.getElementById("amount").value
    );

    const from = document.getElementById("from-currency").value;

    const to = document.getElementById("to-currency").value;

    const resultElement = document.getElementById("result");

    const detailElement = document.getElementById("conversion-detail");

    // Validate input
    if (!Number.isFinite(amount) || amount < 0) {

        resultElement.textContent = "Invalid amount";

        detailElement.textContent = "Please enter a valid non-negative amount.";

        return;
    }

    // EUR is the base currency, so its rate is 1
    const fromRate = from === "EUR" ? 1 : exchangeRates[from];

    const toRate = to === "EUR" ? 1 : exchangeRates[to];

    // Convert through the EUR base
    const convertedAmount = (amount / fromRate) * toRate;

    // Display formatted result
    resultElement.textContent = new Intl.NumberFormat("en-CA", {
        style: "currency",
        currency: to
    }).format(convertedAmount);

    detailElement.textContent =
        `${amount} ${from} = ${convertedAmount.toFixed(4)} ${to}`;

}


// ========================================
// 5. EVENT LISTENERS
// ========================================

// Refresh button
document.getElementById("refresh-btn")
    .addEventListener("click", fetchExchangeRates);

// Calculate button
document.getElementById("convert-btn")
    .addEventListener("click", convertCurrency);

// Recalculate when amount changes
document.getElementById("amount")
    .addEventListener("input", convertCurrency);

// Recalculate when currencies change
document.getElementById("from-currency")
    .addEventListener("change", convertCurrency);

document.getElementById("to-currency")
    .addEventListener("change", convertCurrency);


// ========================================
// 6. INITIALIZE WEBSITE
// ========================================

fetchExchangeRates();
