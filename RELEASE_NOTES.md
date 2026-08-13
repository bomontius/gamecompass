# Oyun Pusulası / Game Compass v0.3.0

## Türkçe

Game Compass v0.3.0, taşınabilir dosya yerine Windows kurulum deneyimi ve daha canlı bir oyun keşfi görünümü sunar.

- NSIS kurulum sihirbazı eklendi: kurulum klasörü seçimi, masaüstü/ Başlat menüsü kısayolları ve Windows kaldırma kaydı.
- Uygulama dosyaları ile kullanıcı verileri ayrıldı. Profil, not, raf ve yerel kütüphane verileri `Belgeler\Game Compass\runtime\data` altında tutulur; kaldırma sırasında korunur.
- Eski `%APPDATA%\oyun-pusulasi-gamecompass` alanı ilk açılışta yeni Documents konumuna taşınmayı dener.
- Kullanıcının seçtiği üç oyun atmosferi arka planı eklendi. Birinci görsel varsayılandır; neon ve management varyantları ayarlardan seçilebilir.
- Arka planlara düşük kaynak tüketimli hafif hareket/parallax efekti eklendi; azaltılmış hareket tercihi desteklenir.
- Altı tema, altı yazı tipi ve küçük/normal/büyük yazı boyutu seçenekleri korunup ayar ekranında görünür hale getirildi.
- Türkçe/İngilizce arayüz kapsamı tamamlandı; kategori ve alt tür adları iki dilde de İngilizce tutuldu.
- Rehber, kategori bazlı öneri listelerini ve New arrivals, Upcoming releases, Saved, Personal shelves, Profile ve Updates sekmelerini adım adım gösterir.
- Profil oluşturma sihirbazında canlı tema ve yazı tipi önizlemesi, çoklu kategori/alt tür seçimi ve kullanım koşulları akışı bulunur.
- Yerel profil yedekleme/geri yükleme, çoklu profil, Steam Web API/dosya aktarımı, künye bilgileri, öneriler, kaydetme, karşılaştırma ve planlama korunur.
- GitHub sürüm kontrolü, GitHub bağlantısı ve Game Compass markalı kurulum paketi eklendi.

## English

Game Compass v0.3.0 replaces the portable-only flow with a Windows installer and a more vivid game-discovery experience.

- Added an NSIS setup wizard with a selectable install folder, Desktop/Start Menu shortcuts, and a Windows uninstall entry.
- Separated application files from user data. Profiles, notes, shelves, and the local library are stored in `Documents\Game Compass\runtime\data` and survive uninstall.
- The app attempts to migrate legacy data from `%APPDATA%\oyun-pusulasi-gamecompass` to the new Documents location on first launch.
- Added three user-selectable game-atmosphere backgrounds. The first generated visual is the default; the neon and management variants are available in settings.
- Added a lightweight animated/parallax effect with reduced-motion support.
- Preserved six themes, six fonts, and small/normal/large font-size choices, with visible previews in settings.
- Completed Turkish/English UI coverage; category and subgenre names intentionally remain in English in both languages.
- The guide now explains categorized recommendation lists and the New arrivals, Upcoming releases, Saved, Personal shelves, Profile, and Updates sections step by step.
- The profile wizard includes live theme/font previews, multi-select category/subgenre choices, and terms-of-use confirmation.
- Preserved local profile backup/restore, multiple profiles, Steam Web API/file import, game cards, recommendations, saves, comparisons, and planning.
- Added GitHub release checking, a GitHub sidebar link, and a Game Compass-branded installer package.
