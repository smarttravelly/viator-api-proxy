(function () {
  const css = `
    #viator-widget {
      max-width: 600px;
      margin: 20px auto;
      padding: 20px;
      border: 1px solid #ddd;
      border-radius: 10px;
      font-family: sans-serif;
    }
    #viator-widget input, #viator-widget button {
      width: 100%;
      padding: 10px;
      margin-bottom: 10px;
      font-size: 16px;
      border-radius: 5px;
      border: 1px solid #ccc;
    }
    #viator-widget button {
      background: #007bff;
      color: #fff;
      border: none;
      cursor: pointer;
    }
    #viator-widget .tour {
      border-bottom: 1px solid #eee;
      padding: 10px 0;
    }
    #viator-widget .tour img {
      max-width: 100%;
      border-radius: 5px;
    }
  `;

  const style = document.createElement("style");
  style.innerText = css;
  document.head.appendChild(style);

  const container = document.createElement("div");
  container.id = "viator-widget";
  container.innerHTML = `
    <h3>🔍 Search Tours by City</h3>
    <input type="text" id="viator-city-input" placeholder="Enter city (e.g. Paris, Tokyo)" />
    <button id="viator-search-btn">Search</button>
    <div id="viator-results"></div>
  `;
  document.body.appendChild(container);

  const destinationMap = {
    "new york": "732",
    "paris": "293",
    "london": "648",
    "tokyo": "672",
    "bangkok": "307",
    "sydney": "357",
    "rome": "290",
    "bali": "22857",
    "barcelona": "562",
    "dubai": "828",
    "singapore": "2931",
    "ho chi minh": "3077",
    "hanoi": "3078"
  };

  document.getElementById("viator-search-btn").addEventListener("click", async function () {
    const input = document.getElementById("viator-city-input").value.trim().toLowerCase();
    const resultsDiv = document.getElementById("viator-results");
    resultsDiv.innerHTML = "⏳ Loading...";

    const destinationId = destinationMap[input];
    if (!destinationId) {
      resultsDiv.innerHTML = "<p style='color:red'>❌ Destination not supported.</p>";
      return;
    }

    try {
      const res = await fetch("https://apiviator.smarttravelly.com/api/viator/products/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          filtering: {
            destination: destinationId,
            rating: { from: 4, to: 5 },
            flags: ["FREE_CANCELLATION"]
          },
          pagination: { start: 1, count: 5 },
          currency: "USD"
        })
      });

      const data = await res.json();
      if (!data?.data?.products?.length) {
        resultsDiv.innerHTML = "<p>No tours found.</p>";
        return;
      }

      const tours = data.data.products.map(tour => `
        <div class="tour">
          <h4>${tour.title}</h4>
          <p><strong>Price:</strong> ${tour.price?.formatted || "N/A"}</p>
          ${tour.primaryPhotoLargeUrl ? `<img src="${tour.primaryPhotoLargeUrl}" alt="${tour.title}" loading="lazy">` : ""}
        </div>
      `).join("");

      resultsDiv.innerHTML = tours;

    } catch (err) {
      resultsDiv.innerHTML = `<p style="color:red">Error: ${err.message}</p>`;
    }
  });
})();
