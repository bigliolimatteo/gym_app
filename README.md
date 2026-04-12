# GymTracker

React + Vite + Tailwind + Supabase. Deployed to GitHub Pages (`base: /gym_app/`).

## Auth & roles

- **Utente**: registrazione con ruolo Utente → dashboard, scheda assegnata dal trainer (sola lettura), allenamento, storico.
- **Personal trainer**: registrazione come trainer → elenco clienti, aggiunta cliente per **email** (l’utente deve esistere già), creazione/modifica scheda per ogni cliente, storico del cliente.

Variabili ambiente (locale: `.env`, CI: GitHub Secrets):

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

In Supabase Dashboard → Authentication → URL configuration, imposta **Site URL** e redirect consentiti per il dominio GitHub Pages se usi conferma email.

## Sviluppo

```bash
npm install
npm run dev
```

```bash
npm run build
```
