# FAQ / Sık Sorulan Sorular

## Türkçe

### Uygulama neden ilk açılışta profil istiyor?

Game Compass kişisel veriler ve hazır profil olmadan başlar. İlk profil oluşturulana kadar beş adımlı sihirbaz kapatılamaz. Profil adı, iki metin alanı, en az bir kategori, en az bir alt tür ve kullanım koşulu onayı gerekir.

### Yedek profilimi ilk ekrandan nasıl yüklerim?

İlk profil sihirbazının ilk adımındaki Profili içe aktar bölümünü kullan. JSON yedeğini seçebilir veya Masaüstündeki profil klasörünü seçebilirsin. Klasör içe aktarmada profiles.json, library.json ve settings.json okunur. Game Compass - Çağrı Profil Yedeği gibi bir klasörü seçmen yeterlidir.

### Profilimi silebilir miyim?

Profil ve temalar sekmesinde Profili sil düğmesine bas. Onaydan sonra aktif profil, ona ait tercihler, notlar ve kararlar silinir. Başka profil varsa ilki aktif olur; yoksa uygulama yeni profil sihirbazına döner.

### Uygulama her açılışta ne gösterir?

Aktif profil varsa önce Hoş geldin ekranı görünür. Günün önerisi yerel tarihe ve profile göre her gün değişir. Keşfe geç düğmesiyle ana listeye gidebilirsin.

### Rehber nasıl çalışır?

Hoş geldin ekranındaki Rehberli turu başlat veya üst çubuktaki Rehber düğmesine bas. Rehber, ilgili sekmeye geçer ve hedefi renkli bir odak çerçevesiyle gösterir. Bu adımı atla yalnızca mevcut adımı geçer; Rehberi atla tüm turu kapatır. İlk profil tamamlanınca rehber otomatik açılır ve bitince Hoş geldin ekranına döner.

### Steam hesabımı bağlamak zorunda mıyım?

Hayır. Kütüphaneyi boş bırakabilir, oyunları Steam aramasıyla tek tek ekleyebilir, dosyadan içe aktarabilir veya Steam Web API kullanabilirsin.

### Steam aktarımı için ne gerekir?

Steam Web API anahtarı ve SteamID64 ya da profil URL’si gerekir. Steam profilinde Oyun ayrıntıları görünürlüğü herkese açık olmalıdır. Uygulama Steam şifreni istemez ve API anahtarını kaydetmez.

### Oynama saatlerim önerileri belirler mi?

Hayır. Oynama saatleri yalnızca Steam’den aktarılan kütüphane bilgisi olarak gösterilir. Öneriler yazdığın tercihler, kategori/alt tür seçimleri ve uygulama içindeki beğenme kararlarıyla şekillenir.

### Haftalık güncelleme ne yapar?

Steam’in herkese açık mağaza künyelerini, yeni çıkışları ve yaklaşan oyunları yeniler. Oynama saatlerini takip etmez ve profili kendiliğinden değiştirmez. Bilgisayar kapalıysa görev sonraki uygun açılışta çalışır.

### Arka planı ve hareketi değiştirebilir miyim?

Evet. Profil ve temalar sekmesinde üç oyun atmosferi arasından seçim yapabilirsin. Arka planlarda hafif canlı hareket vardır. Windows azaltılmış hareket ayarı açıksa animasyon otomatik olarak durur.

### Verilerim nereye kaydedilir?

Windows’ta profil, not, raf ve kütüphane verileri Belgeler\Game Compass\runtime\data klasörüne kaydedilir. Uygulama yerel çalışır; bu veriler uzaktaki bir uygulama sunucusuna gönderilmez.

### Yedek alabilir miyim?

Evet. Profil ve temalar sekmesindeki yerel profil yedeği bölümü JSON yedeği indirir ve daha sonra geri yükler. Steam API anahtarları yedeğe dahil edilmez. İlk açılış sihirbazı da aynı JSON biçimini kabul eder.

### Uygulama nasıl kaldırılır?

Windows Ayarlar > Uygulamalar veya Denetim Masası > Programlar bölümünden Game Compass’ı kaldır. Kaldırma uygulama dosyalarını ve kısayolları siler; kullanıcı verileri korunur. Verileri de kaldırmak istersen Belgeler\Game Compass klasörünü ayrıca silebilirsin.

## English

### Why does the app ask for a profile on first launch?

Game Compass starts without personal data or a ready-made profile. The five-step wizard cannot be closed until the first profile exists. It requires a profile name, two text fields, at least one category, at least one subgenre, and terms-of-use confirmation.

### How do I import my backed-up profile from the first screen?

Use the Import profile section on step one of the first-profile wizard. Choose a JSON backup or select the profile folder on your Desktop. Folder import reads profiles.json, library.json and settings.json. Selecting a folder such as Game Compass - Çağrı Profil Yedeği is enough.

### Can I delete a profile?

Open Profile & themes and choose Delete profile. After confirmation, the active profile and its preferences, notes and decisions are removed. If another profile exists it becomes active; otherwise the app returns to the new-profile wizard.

### What appears every time the app opens?

With an active profile, the Welcome screen appears first. The game of the day changes daily using the local date and active profile. Choose Enter discovery to open the main list.

### How does the guide work?

Choose Start guided tour on the Welcome screen or use Guide in the top bar. The guide moves to the relevant section and places a colored focus frame around the target. Skip this step advances one step; Skip tutorial closes the tour. After the first profile is created, the guide opens automatically and returns to Welcome when it ends.

### Do I have to connect Steam?

No. Keep the library empty, add games through Steam search, import a file, or use the Steam Web API.

### What is required for Steam import?

You need a Steam Web API key and either a SteamID64 or profile URL. Steam Game Details must be public. The app never asks for your Steam password and does not store the API key.

### Does playtime control recommendations?

No. Playtime is displayed as library information only. Recommendations use written preferences, category/subgenre choices, and the like/dislike decisions made in the app.

### What does the weekly update do?

It refreshes public Steam store dossiers, new releases, and upcoming games. It does not track playtime or silently change your profile. If the computer is off, the task runs at the next suitable launch.

### Can I change the background and motion?

Yes. Choose among three game-atmosphere backgrounds in Profile & themes. The backgrounds use subtle motion; Windows reduced-motion settings automatically disable the animation.

### Where is my data stored?

Profiles, notes, shelves and library data are stored locally at Documents\Game Compass\runtime\data on Windows. They are not sent to a remote application server.

### Can I back up and restore profiles?

Yes. The local profile backup section in Profile & themes downloads a JSON backup and restores it later. Steam API keys are excluded. The first-launch wizard accepts the same JSON format.

### How do I uninstall the app?

Remove Game Compass from Windows Settings > Apps or Control Panel > Programs. Uninstalling removes the installed app and shortcuts while preserving user data. Delete the Documents\Game Compass folder separately if you also want to remove the data.
