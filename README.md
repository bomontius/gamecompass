# Game Compass 1.0.0

Game Compass (Türkçe adı: Oyun Pusulası), sevdiğin oyun sistemlerini keşfetmek, Steam kütüphaneni incelemek ve kişisel bir oyun listesi oluşturmak için Windows üzerinde yerel çalışan bir masaüstü uygulamasıdır.

Game Compass is a local-first Windows desktop app for discovering game systems you enjoy, reviewing an optional Steam library, and building a personal discovery list.

## Türkçe

### Özellikler

- Beş adımlı, ilk profil oluşturulmadan geçilemeyen profil sihirbazı.
- Zorunlu profil adı; 10–1000 karakter aralığında “görmek istediklerim” ve “önermeni istemediklerim” alanları.
- Ana kategori ve alt türlerde çoklu seçim; kategori isimleri iki dilde de İngilizce tutulur.
- Koloni yönetimi, RimWorld benzeri base building, Manor Lords/Ostriv tarzı şehir kurma, tarihsel grand strategy, gerçekçi shooter, menajerlik, ofis yönetimi ve tycoon odaklı keşif.
- Beğendim, beğenmedim ve oyun tipi dışlama kararlarını liste sıralamasına anında yansıtma.
- Her açılışta karşılama ekranı ve profile göre günlük değişen bir öneri.
- Uygulama sekmelerini renkli odak çerçevesiyle anlatan, adım atlama ve rehberi tamamen atlama seçenekli rehber.
- Yeni gelenler, yakında çıkacaklar, alt liste, kayıtlılarım, kütüphanem, kişisel raflar, dışlananlar ve güncelleme durumu görünümleri.
- Kategorilere ayrılmış, açılır-kapanır oyun grupları ve çoklu filtreler.
- Steam puanı, oy sayısı, çıkış tarihi, kısa özet, künye, Steam mağaza bağlantısı ve isteğe bağlı Steam medya yükleme.
- Steam Web API, JSON/CSV/TSV/XML dosyası veya tek tek Steam aramasıyla kütüphane ekleme.
- Oynama saatlerini kütüphanede gösterme; oynama saatlerini öneri zevkinin yerine kullanmama.
- Kaydetme, kişisel not, karşılaştırma masası, planlama, takip ve kişisel raflar.
- Birden fazla profil, profiller arası geçiş, profil sıfırlama ve profil silme.
- Ayarlar ekranından JSON yedeği alma ve geri yükleme.
- İlk açılış sihirbazından masaüstündeki profil yedeği klasörünü veya JSON yedeğini doğrudan içe aktarma.
- Türkçe/English dil seçimi, altı tema, altı yazı tipi, küçük/normal/büyük yazı boyutu.
- Üç oyun atmosferi arka planı, hafif canlı/parallax hareketi ve azaltılmış hareket desteği.
- GitHub release kontrolü, yeni sürüm bildirimi ve repo bağlantısı.
- Windows kurulum klasörü seçimi, masaüstü/Başlat menüsü kısayolları ve kaldırma kaydı.

### Kurulum

1. [GitHub Releases](https://github.com/bomontius/gamecompass/releases) sayfasından Game-Compass-1.0.0-Setup.exe dosyasını indir.
2. Kurulumda hedef klasörü seç; istersen masaüstü ve Başlat menüsü kısayollarını oluştur.
3. Uygulamayı aç. Yeni profil oluştur veya ilk ekrandaki “Profili içe aktar” seçeneğiyle JSON yedeğini ya da profil klasörünü seç.
4. Profil oluşturursan karşılama ekranı, günün önerisi ve rehber otomatik açılır.

### Steam aktarımı

Steam şifresi istenmez. Steam Web API anahtarı ve SteamID64/profil adresi gerekir; Steam’de oyun ayrıntılarının herkese açık olması gerekir. API anahtarı kaydedilmez. Steam bağlantısı zorunlu değildir.

### Yerel veriler ve kaldırma

Uygulama verileri Windows’ta Belgeler\Game Compass\runtime\data altında tutulur. Kurulumdan kaldırma uygulama dosyalarını ve kısayolları siler; kullanıcı profilleri ve notlar korunur. Kullanıcı verilerini de kaldırmak istersen bu klasörü ayrıca silebilirsin.

## English

### Features

- A required five-step profile wizard that cannot be bypassed before the first profile exists.
- A required profile name and 10–1000 character fields for games to show and game types to avoid.
- Multi-select main categories and subgenres; category names intentionally stay in English in both languages.
- Discovery focused on colony management, RimWorld-like base building, Manor Lords/Ostriv-style city building, historical grand strategy, realistic shooters, management, office simulation and tycoon games.
- Like, dislike and game-type exclusion decisions that update lists immediately.
- A welcome screen on every app launch with a profile-aware daily recommendation.
- A guided tour with colored focus frames, step skipping and a full tutorial skip option.
- New arrivals, upcoming releases, lower lane, saved, library, personal shelves, excluded and update status views.
- Categorized collapsible game groups and multi-select filters.
- Steam rating, review count, release date, short summary, dossier, Steam store link and optional Steam media loading.
- Library import through Steam Web API, JSON/CSV/TSV/XML files, or individual Steam search.
- Playtime displayed as library information without becoming a recommendation signal.
- Saving, notes, comparison tray, planning, follows and personal shelves.
- Multiple profiles, profile switching, reset, and delete.
- JSON backup and restore from settings.
- First-launch import from a Desktop profile-backup folder or a JSON backup file.
- Turkish/English language selection, six themes, six fonts, and small/normal/large font sizes.
- Three game-atmosphere backgrounds, subtle live/parallax motion, and reduced-motion support.
- GitHub release checking, update notification and repository link.
- Selectable Windows install folder, Desktop/Start Menu shortcuts and an uninstall entry.

### Installation

1. Download Game-Compass-1.0.0-Setup.exe from the [GitHub Releases](https://github.com/bomontius/gamecompass/releases) page.
2. Choose the installation folder and optionally create Desktop and Start Menu shortcuts.
3. Open the app. Create a new profile or choose “Import profile” to select a JSON backup or profile folder.
4. After profile creation, the welcome screen, game of the day and guided tour open automatically.

### Steam import

The app never asks for your Steam password. Steam import requires a Steam Web API key and a SteamID64/profile URL, with Steam Game Details set to public. The API key is not stored. Steam import is optional.

### Local data and uninstall

User data is stored at Documents\Game Compass\runtime\data on Windows. Uninstalling removes the installed application and shortcuts while preserving profiles and notes. Delete that data folder separately if you also want to remove user data.

## Project structure

- runtime/ — browser UI, local Python service, catalog data, backgrounds and update scripts.
- electron/ — Electron host and Windows NSIS installer configuration.
- FAQ.md — setup, profile, Steam, backup and privacy questions.
- CREDITS.md — project acknowledgements.
- RELEASE_NOTES.md — complete v1.0.0 feature overview.

## License

No open-source license has been assigned. Until a license is added, all rights are reserved.
