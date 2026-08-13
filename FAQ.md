# FAQ / Sık Sorulan Sorular

## Türkçe

### Uygulama neden boş açılıyor?

Bu bilinçli bir tasarım kararıdır. Paket kişisel profil, kütüphane ve oynama saati içermez. İlk açılışta kapatılamayan beş adımlı profil sihirbazı açılır; isim, serbest metin tercihleri, kategori/alt tür seçimleri, tema ve kullanım koşulları tamamlanınca uygulamaya geçilir.

### Uygulama nereye kurulur?

Kurulum sihirbazında hedef klasörü kendin seçebilirsin. İstersen masaüstü ve Başlat menüsü kısayolları da oluşturulur. Uygulama dosyaları ile kişisel veriler birbirinden ayrıdır.

### Uygulamayı nasıl kaldırırım?

Windows Ayarlar > Uygulamalar veya Denetim Masası > Programlar bölümünden **Game Compass** uygulamasını kaldırabilirsin. Bu işlem uygulamayı ve kısayolları kaldırır; kullanıcı verilerin `Belgeler\Game Compass\runtime\data` altında kalır.

### Uygulama dilini değiştirebilir miyim?

Evet. Üst çubuktaki dil seçicisinden Türkçe veya English seçebilirsin. Dil tercihi yerel olarak saklanır.

### Rehber nasıl çalışır?

Karşılama ekranındaki **Rehberli turu başlat** veya üst çubuktaki **Rehber** düğmesine bas. Her adımda ilgili sekme ya da düğme renkli bir odak çerçevesiyle gösterilir. **Bu adımı atla** yalnızca mevcut adımı geçer; **Rehberi atla** tüm turu kapatır.

### Steam hesabımı bağlamak zorunda mıyım?

Hayır. Kütüphaneni boş bırakabilir, oyunları tek tek arayarak ekleyebilir veya JSON, CSV, TSV ya da XML dosyası aktarabilirsin.

### Steam aktarımı için ne gerekir?

Steam Web API anahtarı ve SteamID64 ya da profil URL'si gerekir. Steam profilinde **Oyun ayrıntıları** görünürlüğü herkese açık olmalıdır. Uygulama Steam şifreni istemez ve API anahtarını kaydetmez.

### Oynama saatlerim önerileri belirler mi?

Hayır. Oynama saatleri yalnızca sen Steam aktarımı yaptığında kütüphanede bilgi olarak görünür. Öneri profili, yazdığın sevdiğim/istemediğim tercihler ve uygulama içindeki beğen/beğenme kararlarıyla şekillenir.

### Haftalık güncelleme ne yapar?

Steam'in herkese açık mağaza künyelerini, yeni çıkışları ve yaklaşan oyunları yeniler. Kişisel profili veya oynama saatlerini kendiliğinden değiştirmez. Windows Görev Zamanlayıcı kaydı ayrıca kurulmalıdır.

### Arka planlar hareket ediyor; bunu kapatabilir miyim?

Tema ayarlarından üç arka plan arasından seçim yapabilirsin. Sisteminde azaltılmış hareket seçeneği açıksa animasyon otomatik olarak durur; ayrıca uygulama düşük kaynaklı bir efekt kullandığı için kapatıldığında da işlev kaybı olmaz.

### Verilerim nereye kaydedilir?

Windows'ta veriler `Belgeler\Game Compass\runtime\data` klasörüne kaydedilir. Uygulama yerel çalışır; profil ve karar verileri uzaktaki bir sunucuya gönderilmez. Eski sürüm verileri varsa ilk açılışta `%APPDATA%\oyun-pusulasi-gamecompass` klasöründen yeni konuma taşınmayı dener.

### Yedek alabilir miyim?

Evet. Ayarlar ve tercihler bölümündeki yerel profil yedekleme düğmesi JSON yedeği oluşturur. Aynı bölümdeki yükleme düğmesi daha önce alınmış yedeği geri getirir. Steam API anahtarları yedeğe dahil edilmez.

## English

### Why does the app start empty?

This is intentional. The release contains no personal profile, library, or playtime data. On first launch, a required five-step profile wizard asks for your name, preferences, category/subgenre choices, appearance, and terms-of-use confirmation before entering the app.

### Where is the app installed?

The setup wizard lets you choose the installation folder. It can also create Desktop and Start Menu shortcuts. Application files and personal data are kept separate.

### How do I uninstall the app?

Open Windows Settings > Apps or Control Panel > Programs and remove **Game Compass**. This removes the installed application and shortcuts; user data remains in `Documents\Game Compass\runtime\data`.

### Can I change the app language?

Yes. Use the language selector in the top bar to switch between Türkçe and English. The choice is stored locally.

### How does the guide work?

Choose **Start guided tour** on the welcome screen or use the **Guide** button in the top bar. Each step places a colored focus frame around the relevant tab or control. **Skip this step** advances one step; **Skip tutorial** closes the entire tour.

### Do I have to connect Steam?

No. You can keep the library empty, add games by searching for them, or import a JSON, CSV, TSV, or XML file.

### What is required for Steam import?

You need a Steam Web API key and either a SteamID64 or profile URL. Steam **Game Details** visibility must be public. The app never asks for your Steam password and does not store the API key.

### Does playtime control recommendations?

No. Playtime is displayed as library information only when you import it. Recommendations are based on your written preferences and the like/dislike decisions you make in the app.

### What does the weekly update do?

It refreshes public Steam store metadata, new releases, and upcoming games. It does not silently change your profile or track playtime changes. The Windows Task Scheduler entry must be installed separately.

### Can I choose or disable the animated background?

Yes. Choose one of the three backgrounds in appearance settings. If Windows reduced motion is enabled, the animation stops automatically; the effect is intentionally lightweight.

### Where is my data stored?

On Windows, data is stored locally at `Documents\Game Compass\runtime\data`. Profile and decision data are not sent to a remote application server. If legacy data exists, the app attempts to migrate it from `%APPDATA%\oyun-pusulasi-gamecompass` on first launch.

### Can I back up and restore profiles?

Yes. The local profile backup button in settings creates a JSON backup. The restore button imports a previous backup. Steam API keys are excluded from backups.
