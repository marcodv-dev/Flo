# Flō (PWA)
> **Diario a Flusso di Coscienza Zen, Offline-First e Ultra-Riservato**

Flō è una Progressive Web Application (PWA) progettata per la scrittura libera e senza filtri. Il suo scopo principale è eliminare qualsiasi barriera cognitiva, visiva o tecnica tra il sorgere di un pensiero e la sua trascrizione su schermo, gestendo ogni sessione di scarico mentale come un **testo indipendente cifrato**.

---

## 📸 1. Visione ed Esperienza Utente (UX)

L'applicazione si articola su due schermate principali concepite per azzerare la distrazione e garantire la massima velocità d'uso:

### 1.1. Vista Editor Zen (Schermata Principale)
* **Branding e Intestazione Minimale:** In alto a sinistra compare il nome dell'app **Flō** (con font *Abibas*) affiancato da data/ora corrente; in alto a destra il pulsante **`[ Lista ]`**.
* **Apertura Istantanea (One-Tap Entry):** Apri l'app e ti trovi immediatamente su una tela vuota con il cursore attivo, pronta per la digitazione.
* **Barra di 5 Bottoni Rotondi in Basso:** Una barra fluttuante e discreta contenente gli strumenti di scrittura principali:
  1. `•` **Punto Lista:** Stato *toggle*. Se attivo, ogni nuova riga inizia automaticamente con un punto elenco (`* `).
  2. `B` **Grassetto:** Stato *toggle*. Se attivo, il testo digitato viene formattato in grassetto (`**testo**`).
  3. `↵` **A Capo:** Inserisce un'interruzione di riga immediata.
  4. `⏱️` **Ora (Timestamp):** Inserisce l'orario preciso (es. `21:40 — `) all'inizio della riga attiva per separare momenti di pensiero diversi.
  5. `✓` **Fine:** Salva il testo corrente come record indipendente cifrato e conduce direttamente alla Vista Lista.

### 1.2. Vista Lista Pensieri (Archivio Cronologico)
* **Ordine Decrescente:** Mostra tutti i testi salvati ordinati dal più recente al più vecchio (`createdAt` desc).
* **Card Minimali:** Ogni voce mostra la data/ora di creazione e un'anteprima decifrata al volo delle prime righe.
* **Tasto `+ Nuovo`:** Posizionato in alto a destra per aprire immediatamente un nuovo foglio vuoto in modalità Zen.

---

## 🎨 2. Palette Colori e Struttura delle Schermate

### 2.1. Palette Colori
* **Sfondo Chiaro / Theme Gradient:** `linear-gradient(135deg, #059669 0%, #06B6D4 100%)` *(Emerald Green Cyan)*.
* **Tipografia Nome App:** Font **Abibas** posizionato in alto a sinistra.

### 2.2. Layout Schematico
```
┌─────────────────────────────────────────────────────────────┐
│                      1. VISTA EDITOR                        │
├─────────────────────────────────────────────────────────────┤
│  Flō | 24 LUGLIO 2026, 21:40                       [ Lista ]│
│                                                             │
│  Sto scrivendo un pensiero libero e senza filtri...         │
│  * Punto della lista attivo                                 │
│  **Testo in grassetto**                                     │
│                                                             │
│                                                             │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  ( • Lista ) ( B Bold ) ( ↵ A Capo ) ( ⏱️ Ora ) ( ✓ Fine ) │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                               │
                (Clic su '✓ Fine' o 'Lista')
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                      2. VISTA LISTA                         │
├─────────────────────────────────────────────────────────────┤
│  Flō | I TUOI PENSIERI                            [ + Nuovo ]│
│                                                             │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  24 Lug 2026 - 21:40                                  │  │
│  │  Sto scrivendo un pensiero libero e senza filtri...   │  │
│  └───────────────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  24 Lug 2026 - 18:15                                  │  │
│  │  Pomeriggio di riflessione sulla PWA...               │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔒 3. Sicurezza e Cifratura (Zero-Knowledge)

La riservatezza dei pensieri è garantita da un'architettura crittografica eseguita interamente lato client (*Client-Side Encryption*):

* **Crittografia AES-GCM (256-bit):** Nessun testo viene mai salvato o trasferito in chiaro. La cifratura avviene nel browser tramite le `Web Crypto API` native.
* **Derivazione della Chiave (PBKDF2):** La Master Password/PIN dell'utente genera una chiave crittografica temporanea conservata esclusivamente nella memoria volatile (RAM) del dispositivo.
* **Auto-Lock Tassativo:** Non appena l'applicazione viene minimizzata, la scheda del browser perde il focus, o viene premuto il tasto di blocco, la chiave in RAM viene distrutta e l'interfaccia torna allo stato di blocco.

---

## 🛠️ 4. Architettura Tecnica e Stack ($0/mese)

Il progetto è progettato per funzionare a **costo zero** sfruttando l'ecosistema Web moderno ed è eseguibile interamente offline.

| Componente | Tecnologia | Descrizione |
| :--- | :--- | :--- |
| **Front-End** | HTML5 / CSS3 / JavaScript (ES6+) | Interfaccia nativa, ultra-leggera e priva di framework complessi. Font *Abibas* per il logo. |
| **PWA Layer** | Service Worker + Web App Manifest | Permette l'installazione su iOS/Android/Desktop e l'uso offline. |
| **Cifratura** | `Web Crypto API` (Nativa) | Algoritmi `PBKDF2` per derivazione chiave e `AES-GCM` per il testo. |
| **Database** | `IndexedDB` (via *Dexie.js*) | Database NoSQL locale per memorizzare i singoli testi cifrati. |
| **Hosting** | Vercel / Netlify / GitHub Pages | Hosting statico gratuito con supporto HTTPS automatico. |

---

## 🗄️ 5. Modello dei Dati (IndexedDB)

Ogni blocco di testo costituisce un record indipendente salvato con la seguente struttura:

```json
{
  "id": "entry-1721852400000",
  "createdAt": 1721852400000,
  "formattedDate": "24 Lug 2026 - 21:40",
  "encryptedContent": "U2FsdGVkX19vA8... (stringa AES-GCM 256-bit illeggibile)",
  "iv": "e3b0c44298fc1c149afbf4c8996fb924",
  "hasContent": true
}
```

---

## 🔄 6. Ciclo di Vita della Sessione

1. **Sblocco:** L'utente inserisce il PIN/Passphrase. La `Web Crypto API` deriva la chiave AES-GCM in RAM.
2. **Scrittura:** L'utente scrive nell'Editor Zen di **Flō** interagendo con la barra dei 5 bottoni rotondi.
3. **Salvataggio:** Premendo `✓ Fine` (o `[ Lista ]`), il testo viene cifrato e scritto su `IndexedDB`.
4. **Consultazione:** L'utente accede alla Vista Lista, la quale legge i record e li ordina in senso cronologico decrescente.
5. **Blocco:** Alla chiusura dell'app o cambio scheda, la chiave in RAM viene cancellata istantaneamente.
