# DaProdStore

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
