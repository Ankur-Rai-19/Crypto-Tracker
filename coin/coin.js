const coinContainer = document.getElementById("coin-container");
const shimmerContainer = document.querySelector(".shimmer-container");

const coinImage = document.getElementById("coin-image");
const coinName = document.getElementById("coin-name");
const coinPrice = document.getElementById("coin-price");
const coinMarketCap = document.getElementById("coin-market-cap");
const coinDescription = document.getElementById("coin-description");
const coinRank = document.getElementById("coin-rank");
const ctx = document.getElementById("coinChart");
const buttonContainer = document.querySelectorAll(".button-container button");

const options = {
    method: "GET",
    headers: {
        accept: "application/json",
        "x-cg-demo-api-key": "CG-UVgg3788A2mDzdqSZa6gS81b",
    },
};

const urlParam = new URLSearchParams(window.location.search);
const coinId = urlParam.get("id");

const fetchCoinData = async () => {
    try {
        const response = await fetch(
            `https://api.coingecko.com/api/v3/coins/${coinId}`
        );
        const coinData = await response.json();
        console.log(coinData);
        displayCoinsData(coinData);
    } catch (err) {
        console.log("Error while fetching coins", err);
    }
};

const displayCoinsData = (coinData) => {
    coinImage.src = coinData.image.large;
    coinName.alt = coinData.name;
    coinName.textContent = coinData.name;
    coinDescription.textContent = coinData.description.en.split(".")[0];
    coinRank.textContent = coinData.market_cap_rank;
    coinPrice.textContent = `$${coinData.market_data.current_price.usd.toLocaleString()}`;
    coinMarketCap.textContent = `$${coinData.market_data.market_cap.usd.toLocaleString()}`;
};

// Chart
const coinChart = new Chart(ctx, {
    type: "line",
    data: {
        labels: [], // for x axis
        datasets: [
            {
                label: "Price (USD)",
                data: [], // for y axis
                borderWidth: 1,
                borderColor: "#eebc1d",
            },
        ],
    },
});

// fetch the chart data from API

const fetchChartData = async (days) => {
    try {
        const response = await fetch(
            `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=usd&days=${days}`,
            options
        );
        const chartData = await response.json();
        updateChart(chartData.prices);
    } catch (err) {
        console.log("Error while fetching coins", err);
    }
};

// TO display the chart data
const updateChart = (prices) => {
    const data = prices.map((price) => price[1]);
    const labels = prices.map((price) => {
        let date = new Date(price[0]);
        return date.toLocaleDateString();
    });

    coinChart.data.labels = labels;
    coinChart.data.datasets[0].data = data;
    coinChart.update();
};

// on btn clicked fetch the chart and display it
buttonContainer.forEach((button) => {
    button.addEventListener("click", (event) => {
        const days =
            event.target.id === "24h" ? 1 : event.target.id === "30d" ? 30 : 90;
        fetchChartData(days);
    });
});

// On load
document.addEventListener("DOMContentLoaded", async () => {
    await fetchCoinData();

    // set 24hr as default
    document.getElementById("24h").click();
});
