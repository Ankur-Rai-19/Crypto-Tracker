const shimmerContainer = document.querySelector(".shimmer-container");
const paginationContainer = document.getElementById("pagination");
const sortPriceAsc = document.getElementById("sort-price-asc");
const sortPriceDesc = document.getElementById("sort-price-desc");
const searchBox = document.getElementById("search-box");

const options = {
    method: "GET",
    headers: {
        accept: "application/json",
        "x-cg-demo-api-key": "CG-UVgg3788A2mDzdqSZa6gS81b",
    },
};

let coins = [];
let itemsPerPage = 15;
let currentPage = 1;

// Fetch Data form API
const fetchCoins = async () => {
    try {
        const response = await fetch(
            "https://api.coingecko.com/api/v3/coins/markets?page=1&vs_currency=usd&per_page=100&order=market_cap_desc",
            options
        );
        const coinsData = await response.json();
        return coinsData;
    } catch (err) {
        console.log("Error while fetching coins", err);
    }
};

const fetchFavouriteCoins = () => {
    return JSON.parse(localStorage.getItem("favorites")) || [];
};
const saveFavouriteCoins = (favourites) => {
    localStorage.setItem("favorites", JSON.stringify(favourites));
};

// Favourite Click Function
const handleFavClick = (coinId) => {
    let favourites = fetchFavouriteCoins();
    //if coin is already present in fav, then remove it
    if (favourites.includes(coinId)) {
        favourites = favourites.filter((id) => id !== coinId);
    } else {
        favourites.push(coinId);
    }
    // save the coin id
    saveFavouriteCoins(favourites);
    displayCoins(getCoinsToDisplay(coins, currentPage), currentPage);
};

// Sort Function
const sortCoinsByPrice = (order) => {
    if (order === "asc") {
        coins.sort((a, b) => a.current_price - b.current_price);
    } else if (order === "desc") {
        coins.sort((a, b) => b.current_price - a.current_price);
    }
    currentPage = 1;
    displayCoins(getCoinsToDisplay(coins, currentPage), currentPage);
    renderPagination(coins);
};
sortPriceAsc.addEventListener("click", () => {
    sortCoinsByPrice("asc");
});
sortPriceDesc.addEventListener("click", () => {
    sortCoinsByPrice("desc");
});

// Search Function
const handleSearch = () => {
    const searchQuery = searchBox.value.trim();
    const filteredCoins = coins.filter((coin) =>
        coin.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    currentPage = 1;
    displayCoins(getCoinsToDisplay(filteredCoins, currentPage), currentPage);
    renderPagination(filteredCoins);
};
searchBox.addEventListener("input", handleSearch);

// Shimmer Screen
const showShimmer = () => {
    shimmerContainer.style.display = "flex";
};
const hideShimmer = () => {
    shimmerContainer.style.display = "none";
};

const getCoinsToDisplay = (coins, page) => {
    const start = (page - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return coins.slice(start, end);
};

// Display Data on Page
const displayCoins = (coins, currentPage) => {
    const start = (currentPage - 1) * itemsPerPage + 1;
    const favourites = fetchFavouriteCoins();

    const tableBody = document.getElementById("crypto-table-body");
    tableBody.innerHTML = "";

    coins.forEach((coin, index) => {
        const row = document.createElement("tr");
        const isFavourite = favourites.includes(coin.id);
        row.innerHTML = `
            <td>${start + index}</td>
            <td>
                <img src="${coin.image}" alt="${
            coin.name
        }" width="24" height="24" />
            </td>
            <td>${coin.name}</td>
            <td>$ ${coin.current_price.toLocaleString()}</td>
            <td>$ ${coin.total_volume.toLocaleString()}</td>
            <td>$ ${coin.market_cap.toLocaleString()}</td>
            <td><i class="fa-solid fa-star favorite-icon ${
                isFavourite ? "favorite" : ""
            }" data-id="${coin.id}" </i></td>
        `;

        row.addEventListener("click", () => {
            window.open(`coin/coin.html?id=${coin.id}`, "_blank");
        });

        row.querySelector(".favorite-icon").addEventListener(
            "click",
            (event) => {
                event.stopPropagation();
                handleFavClick(coin.id);
            }
        );

        tableBody.appendChild(row);
    });
};

// Pagination
const renderPagination = (coins) => {
    const totalPages = Math.ceil(coins.length / itemsPerPage);
    paginationContainer.innerHTML = "";

    for (let i = 1; i <= totalPages; i++) {
        // Create btn of total pages length
        const pageBtn = document.createElement("button");
        pageBtn.textContent = i;
        pageBtn.classList.add("page-button");

        if (i === currentPage) {
            pageBtn.classList.add("active");
        }
        pageBtn.addEventListener("click", () => {
            currentPage = i;
            displayCoins(getCoinsToDisplay(coins, currentPage), currentPage);
            updatePaginationButtons();
        });

        paginationContainer.appendChild(pageBtn);
    }
};

const updatePaginationButtons = () => {
    const pageBtns = document.querySelectorAll(".page-button");
    pageBtns.forEach((button, index) => {
        if (index + 1 === currentPage) {
            button.classList.add("active");
        } else {
            button.classList.remove("active");
        }
    });
};
// On load
document.addEventListener("DOMContentLoaded", async () => {
    try {
        showShimmer();
        coins = await fetchCoins();
        displayCoins(getCoinsToDisplay(coins, currentPage), currentPage);
        renderPagination(coins);
        hideShimmer();
    } catch (err) {
        console.log("Error while Fetching", err);
        hideShimmer();
    }
    // console.log(coins);
});
