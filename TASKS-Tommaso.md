# SMOT APP — Task Tommaso (License Integration Rust + React)

> **Repo:** [BigBoss133/SMOT-APP](https://github.com/BigBoss133/SMOT-APP) (branch: `release/v0.1.0-beta`)
> **Backend API landing page:** gia completo su SMOT-Landing-page
> **Endpoint da chiamare:** `https://api.smot.app/api/license/validate/:key` (o localhost:3000 in dev)
>
> **OpenCode Ready** — Ogni task e delegabile con `/start-work <nome-task>`

---

## Setup

```bash
cd ~/SMOT-APP
git checkout release/v0.1.0-beta
git pull
cd smot-desktop
```

---

## Panoramica

Il flusso e:
```
1. Utente installa SMOT, avvia l'app
2. App controlla config.json -> c'e' una license_key?
   NO  -> Wizard -> LicenseStep (inserisci chiave)
   SI  -> Chiama GET /api/license/validate/{key}
3. Risposta API:
   - { valid: true, blocked: false }          -> Avvia normalmente
   - { valid: true, blocked: false, grace: true } -> Avvia con banner arancione
   - { valid: false, blocked: true }          -> Blocco totale (solo input chiave)
```

---

## Task 1 — Tauri command `validate_license`

- [ ] **APP-1**: Creare comando in `lib.rs`

```rust
#[tauri::command]
async fn validate_license(key: String) -> Result<serde_json::Value, String> {
    let client = reqwest::Client::new();
    let resp = client
        .get(format!("http://localhost:3000/api/license/validate/{}", key))
        .send()
        .await
        .map_err(|e| format!("Errore di connessione: {}", e))?;
    let body: serde_json::Value = resp.json().await.map_err(|e| e.to_string())?;
    Ok(body)
}
```

- [ ] Aggiungere al `invoke_handler` in `lib.rs`
- [ ] Compilare: `cargo build` -> 0 errori

---

## Task 2 — Schermata blocco licenza (React)

- [ ] **APP-2**: Creare `LicenseBlockedPage.tsx`
  - File: `smot-desktop/src/pages/LicenseBlockedPage.tsx`
  - Full-screen, niente sidebar, niente topbar
  - Solo: "Licenza scaduta" + campo input chiave + Bottone "Valida"
  - Chiama `invoke('validate_license', { key })`
  - Se valida: naviga a `/` e salva nel config
  - Se non valida: mostra errore
  - Se errore di rete: "Impossibile contattare il server"

---

## Task 3 — Check licenza in setup.rs

- [ ] **APP-3**: Modificare `setup.rs`

Dopo `on_app_startup()` (o all'inizio del setup), aggiungere:

```rust
// In setup.rs, dopo init database ma prima di emettere eventi:
let config_path = app_data_dir.join("config.json");
if let Some(config) = crate::setup::load_config_from_path(&config_path) {
    if let Some(license_key) = &config.license_key {
        // C'e' una chiave, ma l'app la validera' all'avvio della UI
        // Emetti evento con lo stato corrente
        let handle = app.handle().clone();
        let key = license_key.clone();
        tauri::async_runtime::spawn(async move {
            // Chiamata API asincrona
            let client = reqwest::Client::new();
            if let Ok(resp) = client
                .get(format!("http://localhost:3000/api/license/validate/{}", key))
                .send()
                .await
            {
                if let Ok(body) = resp.json::<serde_json::Value>().await {
                    if body["blocked"].as_bool().unwrap_or(false) {
                        let _ = handle.emit("license-blocked", &body);
                        return;
                    }
                    if body["grace"].as_bool().unwrap_or(false) {
                        let _ = handle.emit("license-grace", &body);
                    }
                }
            }
            let _ = handle.emit("first-launch", &serde_json::json!({}));
        });
        return; // Salta il flusso normale
    }
}
// Nessuna chiave -> avvia wizard normale
```

- [ ] Aggiungere campo `license_key: Option<String>` in `Config` struct
- [ ] Aggiungere campo `license_status: Option<String>` in `Config`
- [ ] Aggiornare `complete_onboarding` per salvare license_key
- [ ] Compilare: `cargo build` -> 0 errori

---

## Task 4 — Event listeners in App.tsx

- [ ] **APP-4**: Aggiungere listener in `App.tsx`
  - Ascoltare evento `license-blocked`: naviga a `/license-blocked`
  - Ascoltare evento `license-grace`: mostra banner "Licenza in scadenza"
  - Aggiungere route per `/license-blocked`
  - Aggiungere route per `/license-expired`

- [ ] Mostrare banner grazia:
  - Banner arancione in cima all'app
  - "La tua licenza scade oggi. Rinnova per non perdere l'accesso."
  - Bottone "Rinnova ora" -> apre browser su /pricing

---

## Task 5 — LicenseStep con validazione API

- [ ] **APP-5**: Aggiornare `LicenseStep.tsx`
  - File: `smot-desktop/src/components/onboarding/LicenseStep.tsx`
  - Input per chiave: formato SMOT-XXXX-XXXX-XXXX-XXXX
  - Bottone "Valida" -> chiama `invoke('validate_license')`
  - Se valida: salva in config, passa allo step successivo
  - Se non valida: mostra errore
  - Bottone "Salta (prova 7 giorni)" -> procede senza licenza

---

## Task 6 — Stato licenza in Settings

- [ ] **APP-6**: Mostrare stato licenza in `SettingsPage.tsx`
  - Sezione "Licenza" con:
    - Stato: Attiva / In scadenza / Prova / Scaduta
    - Chiave: SMOT-XXXX-XXXX-XXXX-XXXX
    - Scadenza: data
    - Se scaduta: bottone "Inserisci chiave"
    - Se in prova: "X giorni rimanenti"

---

## Flusso completo atteso

```
1. Utente scarica SMOT, avvia
2. setup.rs controlla config.json:
   - Nessuna chiave -> wizard onboarding con LicenseStep
   - Con chiave -> chiama API validate
3. Se blocked -> LicenseBlockedPage (solo input)
4. Se grace -> app normale + banner "Rinnova"
5. Se valida -> app normale

[DALLA DASHBOARD WEB]
6. Utente acquista -> riceve chiave -> la inserisce nell'app
7. App salva chiave in config.json -> OK
```

---

## Test

```bash
# Avviare backend API in un terminale:
cd ~/SMOT-Landing-page/backend && npm run dev

# Avviare SMOT-APP in un altro:
cd ~/SMOT-APP/smot-desktop && npm run tauri dev
```

---

*OpenCode: /start-work sul singolo task*
