# GymTracker

React + Vite + Tailwind + Supabase. Deployed to GitHub Pages (`base: /gym_app/`).

## Auth & roles

- **Utente**: registrazione con ruolo Utente → dashboard, scheda assegnata dal trainer (sola lettura), allenamento, storico.
- **Personal trainer**: registrazione come trainer → elenco clienti, aggiunta cliente per **email** (l’utente deve esistere già), creazione/modifica scheda per ogni cliente, storico del cliente.

Variabili ambiente (locale: `.env`, CI: GitHub Secrets):

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

In Supabase Dashboard → Authentication → URL configuration, imposta **Site URL** e redirect consentiti per il dominio GitHub Pages se usi conferma email.

## Account demo

Per provare l'app senza registrarsi sono presenti alcuni account di esempio già popolati con clienti, schede e storico allenamenti. Tutti condividono la stessa password: **`GymDemo123!`**.

| Ruolo    | Email                          | Note                                                |
| -------- | ------------------------------ | --------------------------------------------------- |
| Trainer  | `coach.alex@gymtracker.demo`   | Alex Bianchi · clienti: Mario Rossi, Giulia Verdi   |
| Trainer  | `coach.sara@gymtracker.demo`   | Sara Conti · cliente: Luca Neri                     |
| Utente   | `mario.rossi@gymtracker.demo`  | 2 schede assegnate (Full Body, Push) + 2 sessioni  |
| Utente   | `giulia.verdi@gymtracker.demo` | 2 schede (Lower, Upper) + 3 sessioni                |
| Utente   | `luca.neri@gymtracker.demo`    | Scheda di forza + 3 sessioni con progressione       |

Lo script di seeding è in [`supabase/migrations/20260425173600_seed_demo_accounts.sql`](supabase/migrations/20260425173600_seed_demo_accounts.sql) ed è idempotente (può essere rilanciato senza creare duplicati). Le sessioni di allenamento sono datate al passato, così ogni account utente può comunque avviare un nuovo allenamento "oggi" durante la demo.

## Pagina dettaglio esercizio

La pagina esercizio è ispirata alle app fitness moderne (Fitbod, Nike Training, ecc.) e propone, nell'ordine:

1. **Anteprima animata del movimento** — pittogramma SVG in loop che mostra a grandi linee la traiettoria (spinta, trazione, squat, hip thrust, ecc.). Niente video YouTube: il pattern viene scelto in base a `movementPattern` definito in [`src/data/exercises.js`](src/data/exercises.js).
2. **Video coach interno all'app** (componente [`CoachVideo`](src/components/CoachVideo.jsx)) — player HTML5 con sovrapposizione dei cue come "scapole addotte", "spingi avanti", ecc. Per agganciare un video reale basta valorizzare `coachVideoSrc` (e opzionalmente `coachVideoPoster`) sull'esercizio. Finché l'asset non è disponibile, viene mostrata una card coach animata con i `focusPoints` in evidenza, così l'utente vede comunque su cosa concentrarsi.
3. **Su cosa concentrarsi** — i `focusPoints` dell'esercizio mostrati come check-list, anche per chi salta il video.
4. Muscoli secondari, descrizione, passi dettagliati, consigli e (in fondo, come opzione secondaria) la ricerca su YouTube.

## Sviluppo

```bash
npm install
npm run dev
```

```bash
npm run build
```
