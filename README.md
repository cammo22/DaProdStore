# DaProdStore

<p align="center">
  <a href="https://cammo22.github.io/DaProdStore/"><img src="https://img.shields.io/badge/%F0%9F%9B%92%20Apri%20lo%20Store-cammo22.github.io%2FDaProdStore-ffd54a?style=for-the-badge&labelColor=0b0a0f" alt="Apri lo Store"></a>
  <a href="https://discord.gg/Njs52aacwq"><img src="https://img.shields.io/badge/Discord-Entra%20nel%20server-5865F2?style=for-the-badge&logo=discord&logoColor=white&labelColor=0b0a0f" alt="Discord"></a>
</p>

Il banco dei prodotti di DaProd Produzioni: programmi e giochi in una pagina statica per GitHub Pages. HTML, CSS e JavaScript, senza build o chiavi API.

## Aggiungere un prodotto

Aggiungi un oggetto all'array in `prodotti.json`:

```json
{
  "nome": "Il mio prodotto",
  "repo": "cammo22/nome-repository",
  "descrizione": "Una frase corta.",
  "piattaforme": ["Windows", "macOS"],
  "categoria": "Utilità",
  "stato": "disponibile",
  "immagine": null
}
```

Usa `in arrivo` per un prodotto senza release pubbliche. Per un'immagine del repository, metti in `immagine` l'URL completo `https://raw.githubusercontent.com/...`; con `null` appare un segnaposto. Per un gioco nel browser aggiungi `"gioca": "https://..."`. I filtri si aggiornano dai dati.

Il pulsante Scarica legge l'ultima release pubblica dall'API GitHub e la conserva per la sessione del browser. Propone i file riconosciuti per Windows, macOS, Android e Linux, suggerendo quello adatto quando possibile. I nomi dei file restano visibili, anche per distinguere demo e portatili. Se l'API non risponde, apre il collegamento alla pagina delle release.

Per provare in locale, avvia nella cartella `python -m http.server 8000` e apri `http://localhost:8000/`. Serve un server perché la pagina legge `prodotti.json`.
