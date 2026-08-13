# FAQ / Sık Sorulan Sorular

## Türkçe

### Uygulama neden boş açılıyor?

Bu bilinçli bir tasarım kararıdır. Paket kişisel profil, kütüphane ve oynama saati içermez. İlk açılışta **Yeni profil oluştur** penceresi açılır; kendi tercihlerini yazarak başlarsın.

### Steam hesabımı bağlamak zorunda mıyım?

Hayır. Kütüphaneni boş bırakabilir, oyunları tek tek arayarak ekleyebilir veya JSON, CSV, TSV ya da XML dosyası aktarabilirsin.

### Steam aktarımı için ne gerekir?

Steam Web API anahtarı ve SteamID64 ya da profil URL'si gerekir. Steam profilinde **Oyun ayrıntıları** görünürlüğü herkese açık olmalıdır. Uygulama Steam şifreni istemez ve API anahtarını kaydetmez.

### Oynama saatlerim önerileri belirler mi?

Hayır. Oynama saatleri yalnızca sen Steam aktarımı yaptığında kütüphanede bilgi olarak görünür. Öneri profili, yazdığın sevdiğim/istemediğim tercihler ve uygulama içindeki beğen/beğenme kararlarıyla şekillenir.

### Haftalık güncelleme ne yapar?

Steam'in herkese açık mağaza künyelerini, yeni çıkışları ve yaklaşan oyunları yeniler. Kişisel profili veya oynama saatlerini kendiliğinden değiştirmez. Windows Görev Zamanlayıcı kaydı ayrıca kurulmalıdır.

### Verilerim nereye kaydedilir?

Windows'ta `%APPDATA%\oyun-pusulasi-gamecompass\runtime\data` klasörüne kaydedilir. Uygulama yerel çalışır; profil ve karar verileri uzaktaki bir sunucuya gönderilmez.

### Eski kişisel Oyun Pusulası verilerim neden otomatik gelmiyor?

Bu public sürüm temiz bir veri alanı kullanır. Eski veriler silinmez; yeni sürüm onları otomatik olarak içeri almaz. İstersen kütüphaneni Steam veya dosya aktarımıyla kendin ekleyebilirsin.

## English

### Why does the app start empty?

This is intentional. The release contains no personal profile, library, or playtime data. On first launch, the **Create a new profile** dialog opens so you can define your own preferences.

### Do I have to connect Steam?

No. You can keep the library empty, add games by searching for them, or import a JSON, CSV, TSV, or XML file.

### What is required for Steam import?

You need a Steam Web API key and either a SteamID64 or profile URL. Steam **Game Details** visibility must be public. The app never asks for your Steam password and does not store the API key.

### Does playtime control recommendations?

No. Playtime is displayed as library information only when you import it. Recommendations are based on your written preferences and the like/dislike decisions you make in the app.

### What does the weekly update do?

It refreshes public Steam store metadata, new releases, and upcoming games. It does not silently change your profile or track playtime changes. The Windows Task Scheduler entry must be installed separately.

### Where is my data stored?

On Windows, data is stored locally in `%APPDATA%\oyun-pusulasi-gamecompass\runtime\data`. Profile and decision data are not sent to a remote application server.

### Why was my old personal Oyun Pusulası data not imported?

This public release uses a clean data namespace by design. Existing data is not deleted, but it is not imported automatically. You can add your library later through Steam or a local file import.
