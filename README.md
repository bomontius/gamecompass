# Oyun Pusulası / Game Compass

Oyun Pusulası, oyun türlerini ve sistemlerini keşfetmek için yerel çalışan kişisel bir keşif masasıdır. Uygulama temiz bir başlangıçla gelir: kişisel profil, kütüphane veya oynama saati verisi içermez. İlk açılışta kendi profilini oluşturursun.

Game Compass is a local-first game discovery desk for exploring genres, systems, and upcoming releases. It starts clean: no personal profile, library, or playtime data is bundled. On first launch, you create your own profile.

## Türkçe

### Neler var?

- Sevdiğin ve istemediğin oyun türlerini doğal dille tanımlama.
- İlk açılışta kapatılamayan, beş adımlı profil oluşturma sihirbazı: isim, tercihler, kategori/alt tür, görünüm ve kullanım koşulları.
- Türkçe/İngilizce dil seçimi, ilk günün önerisi ve arayüzü adım adım tanıtan odak kutulu rehber.
- Birden fazla profil oluşturma ve profiller arasında geçiş.
- Koloni yönetimi, şehir kurma, grand strategy, gerçekçi shooter, yönetim ve tycoon gibi sistem odaklı keşif.
- Ana kategori ve alt türlerde çoklu filtreleme.
- Steam puanı, oy sayısı, çıkış tarihi, kısa özet ve Steam sayfası bağlantısı.
- Yakında çıkacaklar, yeni gelenler, kişisel raflar, kaydetme, karşılaştırma ve planlama.
- İsteğe bağlı Steam Web API veya JSON/CSV/TSV/XML kütüphane aktarımı.
- Altı tema, altı yazı tipi ve yerel önbellekle daha hızlı açılış.

### Kullanım

1. Release bölümünden `Game-Compass-0.2.0-portable.exe` dosyasını indir.
2. Uygulamayı aç ve beş adımlı profil sihirbazını tamamla.
3. Sevdiğin türleri ve önermemem gereken oyun tiplerini yaz; kategori ve alt türleri çoklu seç.
4. Karşılama ekranındaki günün önerisini incele, istersen rehberli turu başlat.
5. Kütüphaneni istersen sonradan Steam Web API veya dosya aktarımıyla ekle.

Steam aktarımı şifre istemez. Steam Web API anahtarı ve SteamID64/profil adresi gerekir; Steam'de oyun ayrıntılarının herkese açık olması gerekir. API anahtarı uygulamada saklanmaz. Ayrıntılar için [FAQ](FAQ.md) dosyasına bak.

### Kaynaktan derleme

Gerekenler: Python 3.10+, Node.js ve npm.

```powershell
cd electron
npm ci
npm run dist -- --publish never
```

Portable build `electron/dist/` altında oluşur.

### Veri ve gizlilik

Uygulama Steam şifresini, çerezlerini veya Steam istemcisi oturumunu okumaz. Kullanıcı verileri Windows'ta `%APPDATA%\oyun-pusulasi-gamecompass\runtime\data` altında tutulur. Steam aktarımı isteğe bağlıdır ve haftalık mağaza güncellemesi oynama saatlerini takip etmez.

## English

### What is included?

- Natural-language preferences for games you want more or less of.
- A required five-step first-profile wizard covering identity, preferences, category/subgenre choices, appearance, and terms of use.
- Turkish/English language selection, a first-session welcome screen with a game of the day, and a guided tour with a moving focus frame.
- Multiple profiles with independent preferences, decisions, notes, plans, and libraries.
- System-focused discovery for colony management, city building, grand strategy, realistic shooters, management, and tycoon games.
- Multi-select filters for broad categories and subgenres.
- Steam rating, review count, release date, short summary, and a Steam page link.
- Upcoming releases, new additions, personal shelves, saves, comparisons, and planning.
- Optional Steam Web API import or local JSON/CSV/TSV/XML library import.
- Six themes, six fonts, local caching for a faster start, and a portable Windows build named **Game Compass**.

### Getting started

1. Download `Game-Compass-0.2.0-portable.exe` from the Releases page.
2. Open the app and complete the required five-step profile wizard.
3. Describe the genres and game types you enjoy or want to avoid, then choose multiple categories and subgenres.
4. Review the game of the day and start the guided tour if you want an introduction.
5. Optionally import your library later through Steam Web API or a file.

Steam import does not ask for your password. It requires a Steam Web API key and a SteamID64/profile URL, and Steam Game Details must be public. The API key is not stored by the app. See [FAQ](FAQ.md) for details.

### Build from source

Requirements: Python 3.10+, Node.js, and npm.

```powershell
cd electron
npm ci
npm run dist -- --publish never
```

The portable build is written to `electron/dist/`.

### Data and privacy

The app does not read your Steam password, cookies, or Steam client session. User data is stored locally at `%APPDATA%\oyun-pusulasi-gamecompass\runtime\data` on Windows. Steam import is optional, and the weekly store update does not track playtime changes.

## Project files

- `runtime/` — browser UI, local Python service, catalog seed, and update scripts.
- `electron/` — portable Electron host and release build configuration.
- [FAQ](FAQ.md) — common setup and privacy questions.
- [Credits](CREDITS.md) — project and technology acknowledgements.

## License

No open-source license has been assigned yet. Until a license is added, all rights are reserved.
