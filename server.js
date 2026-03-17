const express = require("express");
const cors = require("cors");

const app = express();
// const PORT = 3000;

app.use(cors());
app.use(express.json());

// SERVIR FRONTEND
app.use(express.static("public"));

let favorites = [];

app.get("/favorites", (req, res) => {
    res.json(favorites);
});

app.post("/favorites", (req, res) => {
    const countryName = req.body.country;

    const exsiste = favorites.some(f => f.country === countryName);

    if (exsiste) {
        return res.status(400).json({ error: "Aquesta destinació ja és a favorits" });
    }

    const newFavorite = {
        id: Date.now(),
        country: req.body.country
    };

    favorites.push(newFavorite);

    res.status(201).json(newFavorite);
});

app.delete("/favorites/:id", (req, res) => {

    const id = parseInt(req.params.id);

    favorites = favorites.filter(f => f.id !== id);

    res.json({ message: "Destinació eliminada" });
});

// app.listen(PORT, () => {
//     console.log(`API executant-se a http://localhost:${PORT}`);
// }); 