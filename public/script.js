async function searchCountry() {
    const country = document.getElementById("countryInput").value.trim();
    const resultDiv = document.getElementById("result");

    if (!country) {
        resultDiv.innerHTML = `<p style="color: #d9534f;">⚠️ Por favor, escribe el nombre de un país.</p>`;
        return;
    }

    resultDiv.innerHTML = `<p>Buscando <strong>${country}</strong>...</p>`;

    try {
        const response = await fetch(`https://restcountries.com/v3.1/name/${country}`);

        if (!response.ok) {
            throw new Error("No hemos encontrado ningún país con ese nombre.");
        }

        const data = await response.json();
        const countryData = data[0];

        const currencies = countryData.currencies 
            ? Object.values(countryData.currencies).map(c => c.name).join(", ") 
            : "N/A";
                
        const languages = countryData.languages 
            ? Object.values(countryData.languages).join(", ") 
            : "N/A";

        
        resultDiv.innerHTML = `
            <h3>${countryData.name.common}</h3>
            <p>Capital: ${countryData.capital ? countryData.capital[0] : "No tiene"}</p>
            <p>Població: ${countryData.population.toLocaleString()}</p>
            <img src="${countryData.flags.png}" width="100">
            <p>Moneda: ${currencies}</p>
            <p>Llenguatje: ${languages}</p>
            <p>Regio: ${countryData.region}</p>
            <br>
            <button onclick="addFavorite('${countryData.name.common}')">
                Afegir a favorits
            </button>
        `;

    } catch (error) {
        console.error("Hubo un problema:", error.message);
        
        resultDiv.innerHTML = `
            <div style="border: 1px solid #d9534f; padding: 15px; border-radius: 8px; background-color: #f9f2f2;">
                <p style="color: #d9534f; margin: 0;">
                    <strong>¡Ups! Algo salió mal:</strong><br>
                    ${error.message}
                </p>
                <small>Verifica que el nombre esté bien escrito (en inglés o español).</small>
            </div>
        `;
    }
}

async function addFavorite(country) {

    await fetch("https://travebweb.vercel.app/favorites", {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({ country: country })

    });

    loadFavorites();
}

async function loadFavorites() {

    const response = await fetch("https://travebweb.vercel.app/favorites");

    const data = await response.json();

    const list = document.getElementById("favorites");

    list.innerHTML = "";

    data.forEach(f => {

        const li = document.createElement("li");

        li.innerHTML = `
        ${f.country}
        <button onclick="deleteFavorite(${f.id})">Eliminar</button>
        `;

        list.appendChild(li);
    });
}

async function deleteFavorite(id) {

    await fetch(`https://travebweb.vercel.app/favorites/${id}`, {
        method: "DELETE"
    });

    loadFavorites();
}

loadFavorites();