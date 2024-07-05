const shimmerContainer = document.querySelector(".shimmer-container");
const tableBody = document.getElementById("favorite-table-body");

const options = {
    method: "GET",
    headers: {
        accept: "application/json",
        "x-cg-demo-api-key": "CG-UVgg3788A2mDzdqSZa6gS81b",
    },
};

const getFavouriteCoins = () => {
    return JSON.parse(localStorage.getItem("favorites")) || [];
};

const fetchFavouriteCoins = async (coinIds) => {
    try {
        const response = await fetch(
            `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${coinIds.join(
                ","
            )}`,
            options
        );
        const coinsData = await response.json();
        return coinsData;
    } catch (err) {
        console.log("Error while fetching coins", err);
    }
};

const displayFavoriteCoins = (favCoins) => {
    tableBody.innerHTML = "";
    favCoins.forEach((coin, index) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>
                <img src="${coin.image}" alt="${
            coin.name
        }" width="24" height="24" />
            </td>
            <td>${coin.name}</td>
            <td>$ ${coin.current_price.toLocaleString()}</td>
            <td>$ ${coin.total_volume.toLocaleString()}</td>
            <td>$ ${coin.market_cap.toLocaleString()}</td>
        `;

        tableBody.appendChild(row);

        row.addEventListener("click", () => {
            window.open(`../coin/coin.html?id=${coin.id}`, "_blank");
        });
    });
};

// Shimmer Screen
const showShimmer = () => {
    shimmerContainer.style.display = "flex";
};
const hideShimmer = () => {
    shimmerContainer.style.display = "none";
};

// On load
document.addEventListener("DOMContentLoaded", async () => {
    try {
        showShimmer();
        const favorite = getFavouriteCoins(); // it gets the fav list from ls
        if (favorite.length > 0) {
            const favoriteCoins = await fetchFavouriteCoins(favorite);
            displayFavoriteCoins(favoriteCoins);
        } else {
            const noFavMsg = document.getElementById("no-favorites");
            noFavMsg.style.display = "block";
        }
        hideShimmer();
    } catch (err) {
        console.log("Error while Fetching", err);
        hideShimmer();
    }
    // console.log(coins);
});
