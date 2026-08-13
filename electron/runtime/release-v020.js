(() => {
  "use strict";

  const messages = {
    tr: {
      appName: "Oyun Pusulası", appCaption: "kişisel keşif masası", discover: "KEŞFET", settings: "AYARLAR",
      navHome: "Sana göre", navNew: "Yeni gelenler", navUpcoming: "Yakında çıkacaklar", navLow: "Alt liste", navFavorites: "Kayıtlılarım", navLibrary: "Kütüphanem", navShelves: "Kişisel raflar", navExcluded: "Dışlananlar", navProfile: "Profil ve temalar", navUpdates: "Güncelleme durumu",
      profile: "PROFİL", language: "DİL", guide: "✦ Rehber", updateNow: "Şimdi güncelle", waitingUpdate: "Son güncelleme bekleniyor", preparing: "Hazırlanıyor", catalogReady: "Katalog güncel", catalogPreparing: "Katalog hazırlanıyor",
      welcomeKicker: "BUGÜNÜN PUSULA NOTU", welcomeTitle: "Hoş geldin, {name}.", welcomeBody: "Game Compass, sevdiğin oyun sistemlerini anlayıp her açılışta sana yeni bir günlük keşif sunar. İstersen pusulanı kullanmaya hemen başlayabilirsin.", dayGame: "GÜNÜN ÖNERİSİ", continue: "Keşfe geç", startGuide: "Rehberli turu başlat", viewDossier: "Künye aç", noDayGame: "Bugün için uygun bir oyun bulunamadı.",
      heroKicker: "BU HAFTANIN KISA NOTU", heroTitle: "Sistem kurmayı<br><em>seviyorsun.</em>", heroFreshTitle: "Kendi pusulanı<br><em>kur.</em>", heroBody: "Koloniler, yaşayan şehirler, gerçek tarihe dayalı strateji ve kararlarının sonuç verdiği yönetim oyunları senin keşif alanın.", heroFreshBody: "Önce sevdiğin oyun sistemlerini anlat. Oyun Pusulası, önerilerini bu seçimlere göre kurar; kişisel kütüphane aktarımı tamamen isteğe bağlıdır.", matches: "Eşleşmelere bak", editProfile: "Profilimi düzenle",
      libraryMetric: "KÜTÜPHANE", strongMetric: "GÜÇLÜ EŞLEŞME", lowMetric: "ALT LİSTE", upcomingMetric: "YAKLAŞAN", libraryFoot: "oyun aktarılmış", strongFoot: "öne çıkan keşif", lowFoot: "istersen göz at", upcomingFoot: "takip edilebilir çıkış",
      priority: "ÖNCELİKLİ KEŞİF", homeTitle: "Sana göre öneriler", searchPlaceholder: "Oyun, kategori veya alt tür ara...", allCategories: "Tüm kategoriler", allSubgenres: "Tüm alt türler", fitSort: "Uyuma göre", reviewSort: "Steam puanına göre", releaseSort: "Çıkış tarihine göre", playtimeSort: "Oynama saatine göre",
      steamAdd: "STEAM’DEN EKLE", addLibraryTitle: "Bu profile kütüphane oyunu ekle", addLibraryBody: "Yeni profil boş başlar; mevcut profile de istediğin oyunu ekleyebilirsin.", importSteam: "Steam hesabından oyunları çek", importFile: "Dosyadan içe aktar", steamSearch: "Steam oyun adı yaz...", notice: "Bu liste oynama saatini değil, açıkça tanımlanmış zevk profilini izler.", closeInfo: "Bilgiyi kapat", strongMatches: "GÜÇLÜ EŞLEŞMELER", emptyTitle: "Bu görünüm şimdilik sessiz.", emptyBody: "Filtreyi gevşetebilir, profil tercihlerini genişletebilir veya haftalık güncellemeyi çalıştırabilirsin.",
      footer: "Oyun Pusulası · yerel keşif masası", footerSteam: "Steam aktarımı isteğe bağlı · API anahtarı kaydedilmez", compareTable: " karşılaştırma masasında", clear: "Temizle", close: "Kapat",
      wizardEyebrow: "YENİ PROFİL", wizardTitle: "Kendi oyun pusulanı kur.", wizardIntro: "Birkaç kısa adımda tercihlerini seç. Kütüphane ve oynama saatleri bu profil için zorunlu değildir.", step1: "Kimlik", step2: "Tercihler", step3: "Kategoriler", step4: "Görünüm", step5: "Onay", next: "İleri", back: "Geri", cancel: "Vazgeç", create: "Profili oluştur", requiredName: "Profil adı", steamName: "Steam profil adı (isteğe bağlı)", description: "Kısa açıklama (isteğe bağlı)", namePlaceholder: "Örn. Hafta sonu stratejileri", steamPlaceholder: "Örn. oyuncu_adın veya profil URL’in", descriptionPlaceholder: "Bu profilde ne arıyorsun?",
      preferenceTitle: "Oyun zevkini tarif et.", preferenceBody: "Serbestçe yazabilir veya aşağıdaki seçimleri kullanabilirsin. Beğenmediğin oyun tiplerini ayrıca belirt.", liked: "Daha çok görmek istediklerim", disliked: "Önermeni istemediklerim", likedPlaceholder: "Örn. RimWorld benzeri koloni, tarihi şehir kurma ve lojistik", dislikedPlaceholder: "Örn. büyülü rekabetçi shooter, gacha", preferenceLimit: "10–1000 karakter", categoriesTitle: "Ana kategoriler", typesTitle: "Alt türler ve oyun sistemleri", chooseHint: "Birden fazla seçim yapabilirsin.", viewAllTypes: "Katalogdaki tüm seçimler", appearanceTitle: "Pusulanın görünümü", themeTitle: "Tema", fontTitle: "Yazı tipi", languageTitle: "Uygulama dili", weeklyTitle: "Haftalık tarama etkin", weeklyBody: "Cuma 13:00–20:00 aralığındaki görev çalışsın.", termsTitle: "Son bir kontrol.", termsBody: "Game Compass yerel çalışan bir keşif aracıdır. Öneriler kişisel tercihlere göre üretilir; sonuçlar garanti edilmez. Steam aktarımı isteğe bağlıdır ve API anahtarı kaydedilmez.", termsAccept: "Kullanım koşullarını ve yerel veri açıklamasını okudum, kabul ediyorum.", mustName: "Devam etmek için profil adına bir isim ver.", mustPreferences: "Görmek istediklerin alanına en az 10 karakter yazmalısın.", mustBlocks: "Önermeni istemediklerin alanına en az 10 karakter yazmalısın.", maxPreferences: "Tercih alanları en fazla 1000 karakter olabilir.", mustCategory: "En az bir ana kategori seçmelisin.", mustSubgenre: "En az bir alt tür seçmelisin.", importProfile: "Profili içe aktar", importProfileFolder: "Profil klasörünü seç", importProfileJson: "JSON yedeği seç", importProfileHint: "Masaüstündeki profil klasörünü veya JSON yedeğini kullanabilirsin.", mustTerms: "Profili oluşturmak için kullanım koşullarını kabul etmelisin.",
      guide: "REHBER", guideNext: "İleri", guideFinish: "Tamamla", guideSkipStep: "Bu adımı atla", guideSkip: "Rehberi atla", guideStep: "Adım {current} / {total}", guideDone: "Rehber tamamlandı.", guideNoProfile: "Rehberi başlatmak için önce profilini oluştur.", guideTitle1: "Pusulanın merkezi", guideBody1: "Bu başlık hangi keşif görünümünde olduğunu gösterir. Sol menüden öneriler, yeni gelenler, yaklaşan oyunlar ve kütüphanen arasında gezebilirsin.", guideTitle2: "Profil geçişi", guideBody2: "Birden fazla profil oluşturduğunda buradan aktif profili değiştirirsin. Her profilin tercihleri ve kütüphanesi ayrıdır.", guideTitle3: "Hızlı arama", guideBody3: "Oyun adı, ana kategori veya alt tür yazarak görünür sonuçları daraltabilirsin.", guideTitle4: "Çoklu filtre", guideBody4: "Birden fazla ana kategori ve alt türü aynı anda seçerek daha spesifik bir keşif listesi oluşturabilirsin.", guideTitle5: "Kategorili listeler", guideBody5: "Oyunlar temel kategoriler altında açılır-kapanır gruplar halinde görünür. Kartı açıp künyeyi ve Steam medyasını inceleyebilirsin.", guideTitle6: "Yeni gelenler", guideBody6: "Yeni gelenler, kataloğa son eklenen veya yakın zamanda çıkan ve profilinle eşleşen oyunları gösterir.", guideTitle7: "Yakında çıkacaklar", guideBody7: "Henüz çıkmamış, profilinle eşleşen oyunları burada takip edebilirsin. Takip et düğmesiyle çıkışlarını izlersin.", guideTitle8: "Kayıtlılarım", guideBody8: "Bir oyun kartında Kaydet düğmesine bastığında oyun burada görünür. Notlarını ve planını da bu ekrandan açabilirsin.", guideTitle9: "Kişisel raflar", guideBody9: "Raflar; koloni, şehir kurma, strateji veya yönetim gibi ortak sistemlere göre otomatik oluşur. Aynı oyun birden fazla rafı görebilir.", guideTitle10: "Profil ve temalar", guideBody10: "Profil tercihlerini, tema, font ve okuma boyutunu buradan değiştirir; yeni profil veya yedek işlemlerini yönetirsin.", guideTitle11: "Güncelleme durumu", guideBody11: "Son katalog taramasını, yaklaşan kayıt sayısını ve haftalık görevi burada görürsün.", guideTitle12: "Manuel güncelleme", guideBody12: "Katalogu istediğin zaman yenileyebilirsin. Haftalık tarama açıksa cuma 13:00–20:00 arasında da çalışır.", guideTitle13: "Dil seçimi", guideBody13: "Uygulamanın dilini istediğin zaman Türkçe ve İngilizce arasında değiştirebilirsin.", guideTitle14: "Rehber düğmesi", guideBody14: "Bu turu daha sonra yeniden başlatmak için rehber düğmesini kullan.",
      viewHome: "Sana göre", viewNew: "Yeni gelenler", viewUpcoming: "Yakında çıkacaklar", viewLow: "Alt liste", viewFavorites: "Kayıtlılarım", viewLibrary: "Kütüphanem", viewShelves: "Kişisel raflar", viewExcluded: "Dışlananlar", viewProfile: "Profil ve temalar", viewUpdates: "Güncelleme durumu", viewHomeSub: "Uzun soluklu sistemler, gerçek dünya ve sana göre oyunlar.", viewNewSub: "Yeni çıkanlar ve bu listeye yeni düşen keşifler.", viewUpcomingSub: "Profilinle eşleşen, henüz çıkmamış oyunları takip et.", viewLowSub: "Türe yakın; ama sende daha düşük uyum ihtimali taşıyanlar.", viewFavoritesSub: "Daha sonra dönmek için ayırdığın oyunlar ve notlar.", viewLibrarySub: "Bu profilin oyunları; oynama saatleri öneri kararına dönüşmez.", viewShelvesSub: "Benzer oyunları ortak sistemlerine göre otomatik raflara ayırdım.", viewExcludedSub: "Gizlediğin oyunlar ve profilinden çıkardığın oyun tipleri.", viewProfileSub: "Profilini değiştir, tema seç, yeni pusula oluştur veya sıfırla.", viewUpdatesSub: "Haftalık keşif taraması ve son yenilenen bilgiler.",
    },
    en: {
      appName: "Game Compass", appCaption: "personal discovery desk", discover: "DISCOVER", settings: "SETTINGS",
      navHome: "For you", navNew: "New arrivals", navUpcoming: "Upcoming releases", navLow: "Lower lane", navFavorites: "Saved", navLibrary: "My library", navShelves: "Personal shelves", navExcluded: "Excluded", navProfile: "Profile & themes", navUpdates: "Update status",
      profile: "PROFILE", language: "LANGUAGE", guide: "✦ Guide", updateNow: "Update now", waitingUpdate: "Waiting for first update", preparing: "Preparing", catalogReady: "Catalog ready", catalogPreparing: "Preparing catalog",
      welcomeKicker: "TODAY’S COMPASS NOTE", welcomeTitle: "Welcome, {name}.", welcomeBody: "Game Compass learns the systems you enjoy and brings you a fresh daily discovery every time you open it. Start exploring whenever you are ready.", dayGame: "GAME OF THE DAY", continue: "Enter discovery", startGuide: "Start guided tour", viewDossier: "Open dossier", noDayGame: "No suitable game was found for today.",
      heroKicker: "THIS WEEK’S NOTE", heroTitle: "You enjoy<br><em>building systems.</em>", heroFreshTitle: "Build your own<br><em>compass.</em>", heroBody: "Colonies, living cities, real-world strategy and management games where decisions have consequences are your discovery territory.", heroFreshBody: "Tell us which game systems you enjoy first. Game Compass will shape recommendations around those choices; importing a library is entirely optional.", matches: "View matches", editProfile: "Edit profile",
      libraryMetric: "LIBRARY", strongMetric: "STRONG MATCHES", lowMetric: "LOWER LANE", upcomingMetric: "UPCOMING", libraryFoot: "games imported", strongFoot: "featured discoveries", lowFoot: "browse if you like", upcomingFoot: "releases to follow",
      priority: "PRIORITY DISCOVERY", homeTitle: "Recommendations for you", searchPlaceholder: "Search a game, category or subgenre...", allCategories: "All categories", allSubgenres: "All subgenres", fitSort: "Best fit", reviewSort: "Steam rating", releaseSort: "Release date", playtimeSort: "Playtime",
      steamAdd: "ADD FROM STEAM", addLibraryTitle: "Add a library game to this profile", addLibraryBody: "New profiles start empty; you can also add any game to an existing profile.", importSteam: "Pull games from Steam", importFile: "Import from file", steamSearch: "Type a Steam game name...", notice: "This list follows your explicit taste profile, not your playtime.", closeInfo: "Dismiss information", strongMatches: "STRONG MATCHES", emptyTitle: "This view is quiet for now.", emptyBody: "Loosen a filter, broaden your profile preferences, or run the weekly update.",
      footer: "Game Compass · local discovery desk", footerSteam: "Steam import is optional · API keys are not saved", compareTable: " in the comparison tray", clear: "Clear", close: "Close",
      wizardEyebrow: "NEW PROFILE", wizardTitle: "Build your own game compass.", wizardIntro: "Choose your preferences in a few short steps. A library and playtime are not required for this profile.", step1: "Identity", step2: "Preferences", step3: "Categories", step4: "Appearance", step5: "Confirm", next: "Next", back: "Back", cancel: "Cancel", create: "Create profile", requiredName: "Profile name", steamName: "Steam profile name (optional)", description: "Short description (optional)", namePlaceholder: "e.g. Weekend strategies", steamPlaceholder: "e.g. your_name or profile URL", descriptionPlaceholder: "What are you looking for in this profile?",
      preferenceTitle: "Describe your game taste.", preferenceBody: "Write freely or use the choices below. You can also call out game types you do not enjoy.", liked: "Show me more of", disliked: "Do not recommend", likedPlaceholder: "e.g. RimWorld-like colonies, historical city builders and logistics", dislikedPlaceholder: "e.g. magical competitive shooters, gacha", preferenceLimit: "10–1000 characters", categoriesTitle: "Main categories", typesTitle: "Subgenres and systems", chooseHint: "You can select more than one.", viewAllTypes: "All choices from the catalog", appearanceTitle: "Make the compass yours", themeTitle: "Theme", fontTitle: "Font", languageTitle: "App language", weeklyTitle: "Enable weekly scan", weeklyBody: "Run the task on Fridays between 13:00 and 20:00.", termsTitle: "One last check.", termsBody: "Game Compass is a local discovery tool. Recommendations are generated from your preferences and are not guarantees. Steam import is optional and API keys are not saved.", termsAccept: "I have read and accept the terms of use and local data notice.", mustName: "Give your profile a name to continue.", mustPreferences: "Write at least 10 characters in the games you want to see field.", mustBlocks: "Write at least 10 characters in the games you do not want recommended field.", maxPreferences: "Preference fields can contain up to 1000 characters.", mustCategory: "Choose at least one main category.", mustSubgenre: "Choose at least one subgenre.", importProfile: "Import profile", importProfileFolder: "Choose profile folder", importProfileJson: "Choose JSON backup", importProfileHint: "You can use a profile folder from your Desktop or a JSON backup.", mustTerms: "You must accept the terms of use to create the profile.",
      guide: "GUIDE", guideNext: "Next", guideFinish: "Finish", guideSkipStep: "Skip this step", guideSkip: "Skip tutorial", guideStep: "Step {current} / {total}", guideDone: "Guide completed.", guideNoProfile: "Create a profile before starting the guide.", guideTitle1: "Your compass center", guideBody1: "This heading tells you which discovery view is open. Use the left menu to move between recommendations, new arrivals, upcoming games and your library.", guideTitle2: "Profile switching", guideBody2: "When you create multiple profiles, switch the active one here. Each profile keeps its own preferences and library.", guideTitle3: "Quick search", guideBody3: "Type a game name, main category or subgenre to narrow the visible results.", guideTitle4: "Multi-filter", guideBody4: "Select several categories and subgenres at once to make discovery more specific.", guideTitle5: "Categorized lists", guideBody5: "Games appear in collapsible groups under their main categories. Open a card to inspect its dossier and Steam media.", guideTitle6: "New arrivals", guideBody6: "New arrivals shows games recently added to the catalog or released recently that match your profile.", guideTitle7: "Upcoming releases", guideBody7: "Follow unreleased games that match your profile here. Use Follow to keep an eye on their release.", guideTitle8: "Saved", guideBody8: "Press Save on a game card and it appears here. You can also open its notes and plan from this view.", guideTitle9: "Personal shelves", guideBody9: "Shelves are created automatically around shared systems such as colony, city building, strategy or management. A game may appear on more than one shelf.", guideTitle10: "Profile & themes", guideBody10: "Change profile preferences, theme, font and reading size here; manage new profiles and backups too.", guideTitle11: "Update status", guideBody11: "See the latest catalog scan, upcoming count and weekly task here.", guideTitle12: "Manual update", guideBody12: "Refresh the catalog whenever you want. If weekly scanning is enabled, it also runs Friday between 13:00 and 20:00.", guideTitle13: "Language", guideBody13: "Switch the app between Turkish and English whenever you like.", guideTitle14: "Guide button", guideBody14: "Use the guide button to start this tour again later.",
      viewHome: "For you", viewNew: "New arrivals", viewUpcoming: "Upcoming releases", viewLow: "Lower lane", viewFavorites: "Saved", viewLibrary: "My library", viewShelves: "Personal shelves", viewExcluded: "Excluded", viewProfile: "Profile & themes", viewUpdates: "Update status", viewHomeSub: "Long-form systems, the real world and games shaped around your taste.", viewNewSub: "Fresh releases and discoveries newly added to this list.", viewUpcomingSub: "Unreleased games that match your profile and are worth following.", viewLowSub: "Close to the genre, but with a lower likelihood of fitting you.", viewFavoritesSub: "Games and notes you set aside for later.", viewLibrarySub: "This profile’s games; playtime does not become a recommendation signal.", viewShelvesSub: "Automatic shelves grouped by the systems your games share.", viewExcludedSub: "Games you hid and game types you removed from your profile.", viewProfileSub: "Change your profile, choose a theme, create a compass or reset it.", viewUpdatesSub: "Weekly discovery scans and the latest catalog activity.",
    },
  };

  const phraseTranslations = {
    "kişisel keşif masası": "personal discovery desk", "KEŞFET": "DISCOVER", "AYARLAR": "SETTINGS", "PROFİL": "PROFILE", "DİL": "LANGUAGE",
    "Sana göre": "For you", "Yeni gelenler": "New arrivals", "Yakında çıkacaklar": "Upcoming releases", "Alt liste": "Lower lane", "Kayıtlılarım": "Saved", "Kütüphanem": "My library", "Kişisel raflar": "Personal shelves", "Dışlananlar": "Excluded", "Profil ve temalar": "Profile & themes", "Güncelleme durumu": "Update status",
    "Hazırlanıyor": "Preparing", "Katalog güncel": "Catalog ready", "Katalog hazırlanıyor": "Preparing catalog", "Son güncelleme bekleniyor": "Waiting for first update", "Şimdi güncelle": "Update now", "Profil oluştur": "Create profile", "Yeni profil oluştur": "Create profile",
    "BU HAFTANIN KISA NOTU": "THIS WEEK’S NOTE", "HOŞ GELDİN": "WELCOME", "Sistem kurmayı": "You enjoy building systems", "seviyorsun.": "systems.", "Kendi pusulanı": "Build your own compass", "kur.": "compass.", "Eşleşmelere bak": "View matches", "Profilimi düzenle": "Edit profile",
    "KÜTÜPHANE": "LIBRARY", "GÜÇLÜ EŞLEŞME": "STRONG MATCHES", "ALT LİSTE": "LOWER LANE", "YAKLAŞAN": "UPCOMING", "oyun aktarılmış": "games imported", "öne çıkan keşif": "featured discoveries", "istersen göz at": "browse if you like", "takip edilebilir çıkış": "releases to follow",
    "ÖNCELİKLİ KEŞİF": "PRIORITY DISCOVERY", "Sana göre öneriler": "Recommendations for you", "SON HAREKETLER": "LATEST MOVES", "Yeni keşifler": "New discoveries", "TAKİP LİSTESİ": "FOLLOW LIST", "BİR ALT RAFTA": "IN THE LOWER SHELF", "Düşük uyumlu ama yakın oyunlar": "Close, lower-fit games", "SENİN İŞARETLEDİKLERİN": "YOUR SAVED GAMES", "Kayıtlı oyunlar": "Saved games", "AKTİF PROFİL KÜTÜPHANESİ": "ACTIVE PROFILE LIBRARY", "OTOMATİK RAF SİSTEMİ": "AUTOMATIC SHELVES", "FİLTRE DIŞI": "OUTSIDE THE FILTER", "Dışlanan oyunlar": "Excluded games",
    "STEAM’DEN EKLE": "ADD FROM STEAM", "Bu profile kütüphane oyunu ekle": "Add a library game to this profile", "Steam hesabından oyunları çek": "Pull games from Steam", "Dosyadan içe aktar": "Import from file", "Tüm kategoriler": "All categories", "Tüm alt türler": "All subgenres", "Uyuma göre": "Best fit", "Steam puanına göre": "Steam rating", "Çıkış tarihine göre": "Release date", "Oynama saatine göre": "Playtime",
    "GÜÇLÜ EŞLEŞMELER": "STRONG MATCHES", "Bu görünüm şimdilik sessiz.": "This view is quiet for now.", "Filtreyi gevşetebilir, profil tercihlerini genişletebilir veya haftalık güncellemeyi çalıştırabilirsin.": "Loosen a filter, broaden your profile preferences, or run the weekly update.", "KATEGORİ": "CATEGORY", "oyun": "games", "oyun ·": "games ·", "Kaydet": "Save", "Karşılaştır": "Compare", "Takip et": "Follow", "Takipte": "Following", "Künye ↗": "Dossier ↗", "Planla": "Plan", "Kayıtlı": "Saved", "Masada": "On table", "YAKINDA ÇIKIYOR": "UPCOMING", "KÜTÜPHANENDEN REFERANS": "FROM YOUR LIBRARY", "SANA GÖRE KEŞİF": "FOR YOU",
    "İLK ADIM": "FIRST STEP", "Kendi oyun pusulanı kur.": "Build your own game compass.", "Bu sürüm kişisel veriler veya hazır profil olmadan başlar. Sevdiğin türleri ve uzak durduğun oyun tiplerini yazarak sana özel keşif akışını oluştur.": "This version starts without personal data or a ready-made profile. Describe the genres you enjoy and the game types you avoid to build your discovery flow.", "Boş kütüphane": "Empty library", "Steam hesabından veya dosyadan isteğe bağlı aktarım yapabilirsin.": "You can optionally import from Steam or a file.", "Oynama saati şart değil": "Playtime is not required", "Öneriler, yazdığın tercihler üzerinden şekillenir.": "Recommendations follow the preferences you write.", "Her profil ayrı": "Every profile is separate", "İstediğin kadar profil oluşturup aralarında geçiş yapabilirsin.": "Create as many profiles as you like and switch between them.", "HAZIR": "READY", "zevk": "taste", "tür": "genre", "oyun": "game", "Temiz bir başlangıç.": "A clean start.", "Profilini oluşturduktan sonra katalog, filtreler ve öneriler senin seçimlerine göre görünür.": "Once you create a profile, the catalog, filters and recommendations will follow your choices.",
    "AKTİF PROFİL": "ACTIVE PROFILE", "Başlangıç profili": "Starting profile", "Sıfırdan profil": "From-scratch profile", "PROFİL SİNYALLERİ": "PROFILE SIGNALS", "Ne arıyoruz?": "What are we looking for?", "Bu profilde aranan ana sinyaller:": "The main signals for this profile:", "Henüz özel tercih yok": "No custom preference yet", "bu profilin başlangıç tercihi": "this profile’s starting preference", "senin dışlama kararın": "your exclusion decision", "profil tercihi": "profile preference", "＋ Yeni tercih tipi ekle": "+ Add preference type", "Tercihleri sıfırla": "Reset preferences", "Profili sıfırla": "Reset profile", "TEMA": "THEME", "YAZI TİPİ": "FONT", "Haftalık tarama etkin": "Weekly scan enabled", "Cuma 13:00–20:00 aralığındaki görev çalışsın.": "Run the task on Fridays between 13:00 and 20:00.", "Henüz çalışmadı": "Not run yet", "Keşif akışı hazır.": "Discovery flow ready.", "Sistem durumu": "System status", "SİSTEM DURUMU": "SYSTEM STATUS", "Son başarılı tarama": "Last successful scan", "Katalogdaki eşleşme": "Matches in catalog", "Yaklaşan profil eşleşmesi": "Upcoming profile matches", "Haftalık arka plan görevi": "Weekly background task", "Künye alınamayan kayıt": "Records without a dossier", "Etkin": "Enabled", "Kapalı": "Disabled", "Yok": "None", "Güncelleniyor…": "Updating…", "Künye alınamayan kayıt": "Records without a dossier",
    "Uzun soluklu sistemler, gerçek dünya ve sana göre oyunlar.": "Long-form systems, the real world and games shaped around your taste.", "Yeni çıkanlar ve bu listeye yeni düşen keşifler.": "Fresh releases and discoveries newly added to this list.", "Profilinle eşleşen, henüz çıkmamış oyunları takip et.": "Unreleased games that match your profile and are worth following.", "Türe yakın; ama sende daha düşük uyum ihtimali taşıyanlar.": "Close to the genre, but with a lower likelihood of fitting you.", "Daha sonra dönmek için ayırdığın oyunlar ve notlar.": "Games and notes you set aside for later.", "Bu profilin oyunları; oynama saatleri öneri kararına dönüşmez.": "This profile’s games; playtime does not become a recommendation signal.", "Benzer oyunları ortak sistemlerine göre otomatik raflara ayırdım.": "Automatic shelves grouped by the systems your games share.", "Gizlediğin oyunlar ve profilinden çıkardığın oyun tipleri.": "Games you hid and game types you removed from your profile.", "Profilini değiştir, tema seç, yeni pusula oluştur veya sıfırla.": "Change your profile, choose a theme, create a compass or reset it.", "Haftalık keşif taraması ve son yenilenen bilgiler.": "Weekly discovery scans and the latest catalog activity.",
    "Steam puanı": "Steam rating", "Steam puanı bekleniyor": "Steam rating pending", "Çıkış": "Release", "Kategori": "Category", "Oynama": "Playtime", "Kütüphanende değil": "Not in your library", "SENİN KARARIN": "YOUR DECISION", "KİŞİSEL NOT": "PERSONAL NOTE", "STEAM MEDYASI": "STEAM MEDIA", "Fragmanı yükle": "Load trailer", "Steam medyası · yalnızca isteyince açılır": "Steam media · loads only when requested", "Steam sayfasını aç ↗": "Open Steam page ↗",
    "Siyan, pembe, lime": "Cyan, pink, lime", "Amber, zeytin, kum": "Amber, olive, sand", "Mor, cyan, magenta": "Purple, cyan, magenta", "Kömür, kor, turuncu": "Charcoal, ember, orange", "Buz mavisi, çelik, beyaz": "Ice blue, steel, white", "Siyah, asit sarısı, elektrik": "Black, acid yellow, electric", "Köşeli ve enerjik": "Angular and energetic", "Dar, askeri ve net": "Narrow, military and clear", "Karakterli serif": "Characterful serif", "Monospace ve teknik": "Monospace and technical", "Klasik ve dengeli": "Classic and balanced", "Kalın ve vurucu": "Bold and striking",
    "Kullanım koşullarını kabul etmeden profil oluşturulamaz.": "You must accept the terms of use before creating a profile.", "Profil adı zorunlu.": "A profile name is required.", "Görmek istediklerin alanına en az 10 karakter yazmalısın.": "Write at least 10 characters in the games you want to see field.", "Önermememi istediklerin alanına en az 10 karakter yazmalısın.": "Write at least 10 characters in the games you do not want recommended field.", "Tercih alanları en fazla 1000 karakter olabilir.": "Preference fields can contain up to 1000 characters.", "En az bir ana kategori seçmelisin.": "Choose at least one main category.", "En az bir alt tür seçmelisin.": "Choose at least one subgenre.", "Profili sil": "Delete profile", "Profil silindi. Yeni bir profil oluşturabilirsin.": "Profile deleted. You can create a new one.", "Silinecek profil bulunamadı.": "No profile was found to delete.", "Profil bulunamadı.": "Profile not found.", "Vazgeç": "Cancel", "Kapat": "Close", "Temizle": "Clear",
  };

  messages.tr.fontSizeTitle = "Yaz\u0131 boyutu";
  messages.tr.fontSmall = "K\u00fc\u00e7\u00fck";
  messages.tr.fontNormal = "Normal";
  messages.tr.fontLarge = "B\u00fcy\u00fck";
  messages.en.fontSizeTitle = "Font size";
  messages.en.fontSmall = "Small";
  messages.en.fontNormal = "Normal";
  messages.en.fontLarge = "Large";

  Object.assign(phraseTranslations, {
    "KİŞİSEL RAF": "PERSONAL SHELF",
    "RimWorld’e yakın koloni sistemleri": "RimWorld-like colony systems",
    "Tarihsel devlet ve şehir": "Historical states and cities",
    "Üretim, lojistik ve tycoon": "Production, logistics and tycoons",
    "Gerçekçi operasyonlar": "Realistic operations",
    "Bu raf için henüz eşleşen bir oyun yok.": "No matching game has been found for this shelf yet.",
    "Ana kategorileri birlikte seç": "Select main categories together",
    "Alt türleri birlikte seç": "Select subgenres together",
    "Steam hesabı bağlantısı kullanılmaz.": "Steam account linking is not used.",
    "Katalog, Steam’in herkese açık mağaza künyeleri ve aktif yerel profil üzerinden yenilenir.": "The catalog refreshes from Steam's public store dossiers and the active local profile.",
    "New on list etiketi yalnızca ilk haftalık taramada yeni bulunan oyunlara verilir.": "The New on list tag is only assigned to games newly found in the first weekly scan.",
    "Oynama saatleri takip edilmez.": "Playtime is not tracked.",
    "Profil senin kararlarınla şekillenir.": "Your profile follows your decisions.",
    "İlk güncelleme bekleniyor": "Waiting for first update",
    "profil": "profile",
    "uyumu": "fit",
    "koloni / üs": "colony / base",
    "tarihsel": "historical",
    "strateji": "strategy",
    "yönetim / tycoon": "management / tycoon",
    "gerçekçi": "realistic",
    "taktik": "tactical",
    "Katalog türleri ve sistem etiketleriyle eşleşen bir keşif.": "A discovery matched to the catalog genres and systems you enjoy.",
    "Oyun türleri ve sistem etiketleriyle eşleşen bir keşif adayı.": "A discovery candidate matched to the game systems and genres you enjoy.",
    "Yaklaşan çıkışlar arasında profilinle eşleşebilecek bir keşif.": "An upcoming discovery that may match your profile.",
    "Profilinle eşleşen bir oyun.": "A game matched to your profile.",
    "Bu oyun aktif profilinin kütüphanesine eklendi.": "This game was added to the active profile library.",
    "Steam mağaza özeti henüz alınmadı.": "The Steam store summary has not been loaded yet.",
    "Beğendim": "I like this",
    "Beğenmedim": "I do not like this",
    "Bu oyunu önerme": "Do not recommend this game",
    "Bu oyun tipini önerme": "Do not recommend this game type",
    "Rafa ekle": "Add to shelf",
    "Takipten çıkar": "Stop following",
    "Çıkışı takip et": "Follow release",
    "Kayıtlılara eklendi.": "Added to saved.",
    "Kayıtlılardan çıkarıldı.": "Removed from saved.",
    "Tercihin kaydedildi; listeler hemen yenilendi.": "Your preference was saved; lists updated immediately.",
    "Beğenmeme kararın kaydedildi; listeler hemen yenilendi.": "Your dislike decision was saved; lists updated immediately.",
    "Bu oyun ana listeden gizlendi.": "This game was hidden from the main list.",
    "Karşılaştırma masası en fazla 4 oyun alır.": "The comparison tray holds up to 4 games.",
    "Karşılaştırma masasına eklendi.": "Added to the comparison tray.",
    "Karşılaştırma masasından çıkarıldı.": "Removed from the comparison tray.",
    "Çıkış takibe alındı.": "Release added to your follows.",
    "Çıkış takibinden çıkarıldı.": "Release removed from your follows.",
    "Oyun kişisel rafa eklendi.": "Game added to the personal shelf.",
    "Önce bir tercih yaz.": "Write a preference first.",
    "Profile bir ad ver.": "Give the profile a name.",
    "Profil ayarları sıfırlandı.": "Profile settings were reset.",
    "Not kaydedildi.": "Note saved.",
    "Haftalık tarama açıldı.": "Weekly scan enabled.",
    "Haftalık tarama kapatıldı.": "Weekly scan disabled.",
    "Steam hesabından oyunları çek": "Pull games from Steam",
    "Kişisel not": "Personal note",
    "Plan:": "Plan:",
    "Bekleniyor": "Pending",
    "Dışarıda": "Outside profile",
    "Ölçüt": "Metric",
    "Ana kategori": "Main category",
    "Alt tür": "Subgenre",
    "Profil uyumu": "Profile fit",
    "Oyun planı": "Game plan",
  });

  const original = {
    renderAll: typeof renderAll === "function" ? renderAll : null,
    setView: typeof setView === "function" ? setView : null,
    openProfileDialog: typeof openProfileDialog === "function" ? openProfileDialog : null,
    openDrawer: typeof openDrawer === "function" ? openDrawer : null,
    formatNumber: typeof formatNumber === "function" ? formatNumber : null,
    formatHours: typeof formatHours === "function" ? formatHours : null,
    formatDate: typeof formatDate === "function" ? formatDate : null,
  };
  const wizard = { step: 1, required: false, draft: null };
  window.__gcWizard = wizard;
  const guide = { active: false, index: 0, rendering: false, returnToWelcome: false };
  let sessionWelcomeShown = false;
  const guideSteps = [
    { selector: "#viewTitle", view: "home", title: "guideTitle1", body: "guideBody1" },
    { selector: "#profileSelect", view: "home", title: "guideTitle2", body: "guideBody2" },
    { selector: "#searchInput", view: "home", title: "guideTitle3", body: "guideBody3" },
    { selector: "#categoryFilterButton", view: "home", title: "guideTitle4", body: "guideBody4" },
    { selector: "#gameGrid", view: "home", title: "guideTitle5", body: "guideBody5" },
    { selector: '[data-view="new"]', view: "new", title: "guideTitle6", body: "guideBody6" },
    { selector: '[data-view="upcoming"]', view: "upcoming", title: "guideTitle7", body: "guideBody7" },
    { selector: '[data-view="favorites"]', view: "favorites", title: "guideTitle8", body: "guideBody8" },
    { selector: '[data-view="shelves"]', view: "shelves", title: "guideTitle9", body: "guideBody9" },
    { selector: '[data-view="profile"]', view: "profile", title: "guideTitle10", body: "guideBody10" },
    { selector: '[data-view="updates"]', view: "updates", title: "guideTitle11", body: "guideBody11" },
    { selector: "#updateButton", view: "updates", title: "guideTitle12", body: "guideBody12" },
    { selector: "#languageSelect", view: "updates", title: "guideTitle13", body: "guideBody13" },
    { selector: "#guideButton", view: "home", title: "guideTitle14", body: "guideBody14" },
  ];

  function lang() { return app.settings?.language === "en" ? "en" : "tr"; }
  function t(key, vars = {}) {
    let value = messages[lang()]?.[key] ?? messages.tr[key] ?? key;
    Object.entries(vars).forEach(([name, replacement]) => { value = value.replaceAll(`{${name}}`, String(replacement)); });
    return value;
  }
  function safeText(value) { return typeof cleanText === "function" ? cleanText(value) : String(value ?? ""); }
  function setText(selector, key) { const element = document.querySelector(selector); if (element) element.textContent = t(key); }
  function preserveWhitespace(originalText, replacement) {
    const leading = originalText.match(/^\s*/)?.[0] || "";
    const trailing = originalText.match(/\s*$/)?.[0] || "";
    return `${leading}${replacement}${trailing}`;
  }
  function translateText(value) {
    const trimmed = value.trim();
    if (!trimmed || lang() !== "en") return value;
    if (phraseTranslations[trimmed]) return preserveWhitespace(value, phraseTranslations[trimmed]);
    const patterns = [
      [/^(\d+) oyun$/, "$1 games"], [/^(\d+) oyun · (\d+) raf$/, "$1 games · $2 shelves"], [/^(\d+) oyun · (\d+) değerlendirme$/, "$1 games · $2 reviews"],
      [/^(\d+) değerlendirme$/, "$1 reviews"], [/^(\d+) saat$/, "$1 hours"], [/^(\d+) dk$/, "$1 min"], [/^(\d+)% olumlu · (\d+) oy$/, "$1% positive · $2 reviews"], [/^(\d+)% olumlu · (\d+) değerlendirme$/, "$1% positive · $2 reviews"], [/^Son: (.+)$/, "Last: $1"], [/^(\d+) sinyal$/, "$1 signals"], [/^(\d+) \/ 4$/, "$1 / 4"],
    ];
    const extraPatterns = [[/^(\d+) kategori seçili$/, "$1 categories selected"], [/^(\d+) alt tür seçili$/, "$1 subgenres selected"]];
    for (const [pattern, replacement] of [...patterns, ...extraPatterns]) if (pattern.test(trimmed)) return preserveWhitespace(value, trimmed.replace(pattern, replacement));
    const partialTranslations = [
      ["Steam hesabı bağlantısı kullanılmaz.", "Steam account linking is not used."],
      ["Katalog, Steam’in herkese açık mağaza künyeleri ve aktif yerel profil üzerinden yenilenir.", "The catalog refreshes from Steam's public store dossiers and the active local profile."],
      ["“New on list” etiketi yalnızca ilk haftalık taramada yeni bulunan oyunlara verilir.", "The New on list tag is only assigned to games newly found in the first weekly scan."],
    ];
    for (const [from, replacement] of partialTranslations) if (trimmed.includes(from)) return preserveWhitespace(value, trimmed.replaceAll(from, replacement));
    return value;
  }
  let translating = false;
  function translateDom(root = document.body) {
    if (lang() !== "en" || translating) return;
    translating = true;
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach((node) => { const translated = translateText(node.nodeValue); if (translated !== node.nodeValue) node.nodeValue = translated; });
    translating = false;
  }

  let translationObserver;
  function observeTranslations() {
    if (translationObserver || typeof MutationObserver === "undefined") return;
    translationObserver = new MutationObserver(() => {
      if (lang() === "en") translateDom(document.body);
    });
    ["gameGrid", "profileView", "updatesView", "drawerContent", "compareTray", "libraryTools", "categoryFilterMenu", "subgenreFilterMenu"].map((id) => document.getElementById(id)).filter(Boolean).forEach((root) => translationObserver.observe(root, { subtree: true, childList: true, characterData: true }));
  }

  function applyLanguage() {
    app.settings.language = lang();
    document.documentElement.lang = lang();
    document.title = t("appName");
    setText(".brand-name", "appName"); setText(".brand-caption", "appCaption"); setText(".sidebar-label", "discover"); setText(".sidebar-label-spaced", "settings");
    const navKeys = { home: "navHome", new: "navNew", upcoming: "navUpcoming", low: "navLow", favorites: "navFavorites", library: "navLibrary", shelves: "navShelves", excluded: "navExcluded", profile: "navProfile", updates: "navUpdates" };
    document.querySelectorAll(".nav-item").forEach((item) => { const span = item.querySelectorAll("span")[1]; if (span && navKeys[item.dataset.view]) span.textContent = t(navKeys[item.dataset.view]); });
    setText(".profile-switcher-label", "profile"); setText(".language-switcher .profile-switcher-label", "language"); setText("#guideButton", "guide"); setText("#guideSkipStep", "guideSkipStep"); setText("#guideSkip", "guideSkip"); setText("#guideNext", guide.index === guideSteps.length - 1 ? "guideFinish" : "guideNext");
    const updateLabel = document.querySelector("#updateButton span:last-child"); if (updateLabel) updateLabel.textContent = t("updateNow");
    const heroKicker = document.querySelector("#homeHero .hero-kicker"); const heroTitle = document.querySelector("#homeHero h2"); const heroBody = document.querySelector("#homeHero p");
    if (heroKicker) heroKicker.textContent = hasActiveProfile() ? t("heroKicker") : t("welcomeKicker");
    if (heroTitle) heroTitle.innerHTML = hasActiveProfile() ? t("heroTitle") : t("heroFreshTitle");
    if (heroBody) heroBody.textContent = hasActiveProfile() ? t("heroBody") : t("heroFreshBody");
    const heroButtons = document.querySelectorAll("#homeHero .hero-actions button"); if (heroButtons[0]) heroButtons[0].innerHTML = `${t("matches")} <span>↓</span>`; if (heroButtons[1]) heroButtons[1].innerHTML = `${t("editProfile")} <span>↗</span>`;
    const metricLabels = ["libraryMetric", "strongMetric", "lowMetric", "upcomingMetric"]; const metricFoots = ["libraryFoot", "strongFoot", "lowFoot", "upcomingFoot"];
    document.querySelectorAll(".metric-label").forEach((node, index) => { if (metricLabels[index]) node.textContent = t(metricLabels[index]); }); document.querySelectorAll(".metric-foot").forEach((node, index) => { if (metricFoots[index]) node.textContent = t(metricFoots[index]); });
    setText("#sectionKicker", "priority"); setText("#sectionTitle", "homeTitle");
    const search = document.querySelector("#searchInput"); if (search) search.placeholder = t("searchPlaceholder"); const librarySearch = document.querySelector("#librarySearchInput"); if (librarySearch) librarySearch.placeholder = t("steamSearch");
    const sort = document.querySelector("#sortSelect"); if (sort) { const sortKeys = { fit: "fitSort", review: "reviewSort", release: "releaseSort", playtime: "playtimeSort" }; [...sort.options].forEach((option) => { if (sortKeys[option.value]) option.textContent = t(sortKeys[option.value]); }); }
    setText(".library-tools .section-kicker", "steamAdd"); setText(".library-tools strong", "addLibraryTitle"); setText(".library-tools p", "addLibraryBody");
    const importButtons = document.querySelectorAll(".library-import-button"); if (importButtons[0]) importButtons[0].textContent = t("importSteam"); if (importButtons[1]) importButtons[1].textContent = t("importFile");
    const notice = document.querySelector("#noticeStrip > span:nth-child(2)"); if (notice) notice.textContent = t("notice"); const dismiss = document.querySelector("#dismissNotice"); if (dismiss) dismiss.setAttribute("aria-label", t("closeInfo"));
    setText("#gridKicker", "strongMatches"); setText("#emptyState h3", "emptyTitle"); setText("#emptyState p", "emptyBody");
    const footer = document.querySelectorAll(".app-footer span"); if (footer[0]) footer[0].textContent = t("footer"); if (footer[1]) footer[1].textContent = t("footerSteam");
    const language = document.querySelector("#languageSelect"); if (language) { language.value = lang(); language.setAttribute("aria-label", lang() === "en" ? "Language selection" : "Dil seçimi"); }
    const navs = document.querySelectorAll(".main-nav"); if (navs[0]) navs[0].setAttribute("aria-label", lang() === "en" ? "Main navigation" : "Ana gezinme"); if (navs[1]) navs[1].setAttribute("aria-label", lang() === "en" ? "Settings" : "Ayarlar");
    const sortLabel = document.querySelector("#sortSelect"); if (sortLabel) sortLabel.setAttribute("aria-label", lang() === "en" ? "Sort order" : "Sıralama");
    const heroSignal = document.querySelector(".hero-signal"); if (heroSignal) heroSignal.setAttribute("aria-label", lang() === "en" ? "Profile summary" : "Profil özeti");
    translateDom(document.body);
    if (guide.active && !guide.rendering) renderGuide();
    if (document.querySelector("#profileDialog")?.open) renderWizard();
  }

  function getChoices(field, fallback) {
    const values = [...new Set(allKnownGames().flatMap((game) => Array.isArray(game[field]) ? game[field] : []))].filter(Boolean).sort((a, b) => a.localeCompare(b, lang() === "tr" ? "tr" : "en"));
    return values.length ? values : fallback;
  }
  function localizedTheme(id, label, description) {
    if (lang() !== "en") return [label, description];
    const values = { neon: ["Neon Pulse", "Cyan, pink, lime"], field: ["Field Ops", "Amber, olive, sand"], synth: ["Synthwave", "Purple, cyan, magenta"], ember: ["Ember Raid", "Charcoal, ember, orange"], arctic: ["Arctic Command", "Ice blue, steel, white"], acid: ["Acid Grid", "Black, acid yellow, electric"] };
    return values[id] || [label, description];
  }
  function localizedFont(id, label, description) {
    if (lang() !== "en") return [label, description];
    const values = { arcade: ["Arcade Grid", "Angular and energetic"], command: ["Command", "Narrow, military and clear"], editorial: ["Editorial", "Characterful serif"], terminal: ["Terminal", "Monospace and technical"], catalog: ["Catalog", "Classic and balanced"], poster: ["Poster", "Bold and striking"] };
    return values[id] || [label, description];
  }
  function localizedNumber(value) { return new Intl.NumberFormat(lang() === "en" ? "en-US" : "tr-TR").format(Number(value || 0)); }
  function localizedHours(value) {
    const hours = Number(value || 0); if (!hours) return lang() === "en" ? "not played" : "oynanmadı";
    if (hours < 1) return lang() === "en" ? `${Math.round(hours * 60)} min` : `${Math.round(hours * 60)} dk`;
    return lang() === "en" ? `${hours.toLocaleString("en-US", { maximumFractionDigits: 1 })} hours` : `${hours.toLocaleString("tr-TR", { maximumFractionDigits: 1 })} saat`;
  }
  function localizedDate(value) { if (!value) return "—"; const date = new Date(value); if (Number.isNaN(date.getTime())) return safeText(value); return new Intl.DateTimeFormat(lang() === "en" ? "en-US" : "tr-TR", { day: "numeric", month: "short", year: "numeric" }).format(date); }
  function choiceGrid(values, selected, attribute) {
    return values.map((value) => `<label class="wizard-choice"><input type="checkbox" ${attribute}="${escapeHtml(value)}" ${selected.includes(value) ? "checked" : ""}><span>${escapeHtml(value)}</span></label>`).join("");
  }
  function draftDefaults(required) {
    return {
      name: "", steamProfileName: "", description: "", preferences: "", blocks: "", categories: [], subgenres: [],
      theme: app.settings.theme || "neon", font: app.settings.font || "arcade", fontSize: app.settings.fontSize || "normal", language: lang(), weeklyUpdatesEnabled: app.settings.weeklyUpdatesEnabled !== false, termsAccepted: false, required,
    };
  }
  function readWizardFields() {
    const fields = { name: "#gcWizardName", steamProfileName: "#gcWizardSteamName", description: "#gcWizardDescription", preferences: "#gcWizardPreferences", blocks: "#gcWizardBlocks" };
    Object.entries(fields).forEach(([key, selector]) => { const input = document.querySelector(selector); if (input) wizard.draft[key] = input.value; });
    const categoryInputs = [...document.querySelectorAll("[data-gc-category]")]; if (categoryInputs.length) wizard.draft.categories = categoryInputs.filter((input) => input.checked).map((input) => input.dataset.gcCategory);
    const subgenreInputs = [...document.querySelectorAll("[data-gc-subgenre]")]; if (subgenreInputs.length) wizard.draft.subgenres = subgenreInputs.filter((input) => input.checked).map((input) => input.dataset.gcSubgenre);
    const fontSize = document.querySelector("#gcWizardFontSize"); if (fontSize) wizard.draft.fontSize = fontSize.value;
    const terms = document.querySelector("#gcWizardTerms"); if (terms) wizard.draft.termsAccepted = terms.checked;
  }
  function themeChoice(id) { wizard.draft.theme = id; document.documentElement.dataset.theme = id; renderWizard(); }
  function fontChoice(id) { wizard.draft.font = id; document.documentElement.dataset.font = id; renderWizard(); }
  function renderWizard() {
    const dialog = document.querySelector("#profileDialog"); const form = document.querySelector("#profileForm"); if (!dialog || !form || !wizard.draft) return;
    const categories = getChoices("generalCategories", ["Action", "Strategy", "Simulation", "RPG", "Sports"]); const subgenres = getChoices("subgenres", ["Colony Sim", "Base Building", "City Builder", "Grand Strategy", "Tactical Shooter", "Management Sim", "Tycoon"]);
    const d = wizard.draft; const stepLabels = [t("step1"), t("step2"), t("step3"), t("step4"), t("step5")];
    let body = "";
    if (wizard.step === 1) body = `<div class="wizard-step-copy"><span class="wizard-icon">◎</span><div><h3>${t("requiredName")}</h3><p>${t("wizardIntro")}</p></div></div><label class="form-label" for="gcWizardName">${t("requiredName")}</label><input class="dialog-input" id="gcWizardName" required value="${escapeHtml(d.name)}" placeholder="${escapeHtml(t("namePlaceholder"))}"><label class="form-label" for="gcWizardSteamName">${t("steamName")}</label><input class="dialog-input" id="gcWizardSteamName" value="${escapeHtml(d.steamProfileName)}" placeholder="${escapeHtml(t("steamPlaceholder"))}"><label class="form-label" for="gcWizardDescription">${t("description")}</label><input class="dialog-input" id="gcWizardDescription" value="${escapeHtml(d.description)}" placeholder="${escapeHtml(t("descriptionPlaceholder"))}"><div class="wizard-import-box"><div class="wizard-section-label">${t("importProfile")}</div><p>${t("importProfileHint")}</p><div class="wizard-import-actions"><button type="button" class="library-import-button" data-gc-wizard-import>${t("importProfile")}</button><button type="button" class="library-import-button secondary" data-gc-wizard-import-json>${t("importProfileJson")}</button></div></div>`;
    if (wizard.step === 2) body = `<div class="wizard-step-copy"><span class="wizard-icon">✦</span><div><h3>${t("preferenceTitle")}</h3><p>${t("preferenceBody")}</p></div></div><label class="form-label" for="gcWizardPreferences">${t("liked")}<span class="wizard-limit">${t("preferenceLimit")}</span></label><textarea id="gcWizardPreferences" rows="4" maxlength="1000" placeholder="${escapeHtml(t("likedPlaceholder"))}">${escapeHtml(d.preferences)}</textarea><label class="form-label" for="gcWizardBlocks">${t("disliked")}<span class="wizard-limit">${t("preferenceLimit")}</span></label><textarea id="gcWizardBlocks" rows="3" maxlength="1000" placeholder="${escapeHtml(t("dislikedPlaceholder"))}">${escapeHtml(d.blocks)}</textarea>`;
    if (wizard.step === 3) body = `<div class="wizard-step-copy"><span class="wizard-icon">▦</span><div><h3>${t("categoriesTitle")}</h3><p>${t("chooseHint")}</p></div></div><div class="wizard-section-label">${t("categoriesTitle")}</div><div class="wizard-choice-grid">${choiceGrid(categories, d.categories, "data-gc-category")}</div><div class="wizard-section-label wizard-subgenre-label">${t("typesTitle")}</div><div class="wizard-choice-grid">${choiceGrid(subgenres, d.subgenres, "data-gc-subgenre")}</div>`;
    if (wizard.step === 4) body = `<div class="wizard-step-copy"><span class="wizard-icon">◈</span><div><h3>${t("appearanceTitle")}</h3><p>${t("chooseHint")}</p></div></div><div class="wizard-section-label">${t("themeTitle")}</div><div class="wizard-theme-grid">${themeOptions.map(([id, label, description]) => { const localized = localizedTheme(id, label, description); return `<button type="button" class="theme-card ${d.theme === id ? "active" : ""}" data-gc-theme="${id}"><span class="theme-preview ${id}"><i></i><i></i><i></i></span><strong>${escapeHtml(localized[0])}</strong><small>${escapeHtml(localized[1])}</small></button>`; }).join("")}</div><div class="wizard-section-label wizard-subgenre-label">${t("fontTitle")}</div><div class="wizard-font-grid">${fontOptions.map(([id, label, description]) => { const localized = localizedFont(id, label, description); return `<button type="button" class="font-card ${d.font === id ? "active" : ""}" data-gc-font="${id}"><span class="font-preview font-${id}">Aa / 01</span><strong>${escapeHtml(localized[0])}</strong><small>${escapeHtml(localized[1])}</small></button>`; }).join("")}</div><label class="form-label">${t("languageTitle")}</label><select id="gcWizardLanguage"><option value="tr" ${d.language === "tr" ? "selected" : ""}>Türkçe</option><option value="en" ${d.language === "en" ? "selected" : ""}>English</option></select><label class="weekly-toggle"><input id="gcWizardWeekly" type="checkbox" ${d.weeklyUpdatesEnabled ? "checked" : ""}><span><strong>${t("weeklyTitle")}</strong><small>${t("weeklyBody")}</small></span></label>`;
    if (wizard.step === 5) body = `<div class="wizard-step-copy"><span class="wizard-icon">✓</span><div><h3>${t("termsTitle")}</h3><p>${t("termsBody")}</p></div></div><div class="wizard-terms"><p>${t("termsBody")}</p><label class="import-check"><input id="gcWizardTerms" type="checkbox" ${d.termsAccepted ? "checked" : ""}><span>${t("termsAccept")}</span></label></div>`;
    form.innerHTML = `<div class="dialog-eyebrow">${t("wizardEyebrow")}</div><div class="wizard-heading"><div><h2>${t("wizardTitle")}</h2><p>${t("wizardIntro")}</p></div><span class="wizard-step-counter">${wizard.step} / 5</span></div><div class="wizard-step-tabs">${stepLabels.map((label, index) => `<span class="${index + 1 === wizard.step ? "active" : index + 1 < wizard.step ? "done" : ""}"><b>${index + 1}</b>${escapeHtml(label)}</span>`).join("")}</div><div class="wizard-content">${body}</div><div class="dialog-actions wizard-actions"><button class="text-button ${wizard.required ? "hidden" : ""}" type="button" id="gcWizardCancel">${t("cancel")}</button><span class="wizard-spacer"></span><button class="ghost-button ${wizard.step === 1 ? "hidden" : ""}" type="button" id="gcWizardBack">${t("back")}</button><button class="update-button" type="button" id="gcWizardNext">${wizard.step === 5 ? t("create") : t("next")}</button></div>`;
    window.__gcAfterWizardRender?.();
    if (wizard.step === 1) { const folderButton = document.querySelector("[data-gc-wizard-import]"); if (folderButton) folderButton.textContent = t("importProfileFolder"); }
  }
  function openWizard(required = !hasActiveProfile()) {
    wizard.required = required; wizard.step = 1; wizard.draft = draftDefaults(required); renderWizard();
    const dialog = document.querySelector("#profileDialog"); if (dialog && !dialog.open && typeof dialog.showModal === "function") dialog.showModal();
    if (dialog) { dialog.dataset.required = String(required); dialog.setAttribute("aria-label", t("wizardTitle")); }
  }
  function validateWizard() {
    readWizardFields();
    if (wizard.step === 1 && !wizard.draft.name.trim()) { toast(t("mustName"), true); return false; }
    if (wizard.step === 2) {
      const preferences = wizard.draft.preferences.trim(); const blocks = wizard.draft.blocks.trim();
      if (preferences.length > 1000 || blocks.length > 1000) { toast(t("maxPreferences"), true); return false; }
      if (preferences.length < 10) { toast(t("mustPreferences"), true); return false; }
      if (blocks.length < 10) { toast(t("mustBlocks"), true); return false; }
    }
    if (wizard.step === 3) {
      if (!wizard.draft.categories.length) { toast(t("mustCategory"), true); return false; }
      if (!wizard.draft.subgenres.length) { toast(t("mustSubgenre"), true); return false; }
    }
    if (wizard.step === 5 && !wizard.draft.termsAccepted) { toast(t("mustTerms"), true); return false; }
    return true;
  }
  async function submitWizard() {
    if (!validateWizard()) return;
    const draft = wizard.draft; const firstProfile = wizard.required;
    const positiveTags = [...new Set([...(inferTags(draft.preferences) || []), ...draft.categories, ...draft.subgenres])]; const blockedTypes = inferTags(draft.blocks) || [];
    try {
      const response = await fetch("/api/profile/create", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: draft.name.trim(), steamProfileName: draft.steamProfileName.trim(), description: draft.description.trim(), preferencesText: draft.preferences.trim(), blocksText: draft.blocks.trim(), positiveTags, blockedTypes, extraPreferences: [{ text: draft.preferences.trim(), direction: "more", source: "profile wizard", tags: inferTags(draft.preferences) || [] }, { text: draft.blocks.trim(), direction: "block", source: "profile wizard", tags: inferTags(draft.blocks) || [] }], preferredCategories: draft.categories, preferredSubgenres: draft.subgenres, theme: draft.theme, font: draft.font, termsAccepted: true }) });
      const payload = await response.json(); if (!response.ok || !payload.ok) throw new Error(payload.error || t("mustTerms"));
      if (payload.bundle) applyBundle(payload.bundle); app.settings = { ...app.settings, theme: draft.theme, font: draft.font, fontSize: draft.fontSize || "normal", language: draft.language, weeklyUpdatesEnabled: draft.weeklyUpdatesEnabled, welcomeSeen: false };
      await persistSettings(); const dialog = document.querySelector("#profileDialog"); if (dialog?.open) dialog.close();
      if (firstProfile) { sessionWelcomeShown = true; setView("welcome"); app.settings.welcomeSeen = false; renderWelcome(); window.setTimeout(() => startGuide(true), 360); } else setView("profile");
      toast(lang() === "en" ? `${draft.name.trim()} is ready. Your library starts empty.` : `${draft.name.trim()} profili hazır. Kütüphane boş başladı.`);
    } catch (error) { toast(error.message, true); }
  }

  function renderWelcome() {
    const target = document.querySelector("#welcomeView"); if (!target || !hasActiveProfile()) return;
    const candidates = allCatalogGames().filter((game) => !game.owned && !isBlocked(game)).sort((a, b) => profileFit(b) - profileFit(a) || (b.reviewPercent || 0) - (a.reviewPercent || 0) || String(a.id).localeCompare(String(b.id)));
    const today = new Date(); const dayKey = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`; const seedText = `${app.activeProfileId || "profile"}:${dayKey}`; let seed = 0; for (let index = 0; index < seedText.length; index += 1) seed = (seed * 31 + seedText.charCodeAt(index)) >>> 0;
    const game = candidates.length ? candidates[seed % candidates.length] : null;
    if (game) app.registry.set(game.id, game);
    const reviewText = game?.reviewPercent == null ? "Steam" : lang() === "en" ? `${game.reviewPercent}% · ${formatNumber(game.reviewCount)} reviews` : `%${game.reviewPercent} · ${formatNumber(game.reviewCount)} oy`;
    const card = game ? `<article class="welcome-game"><div class="welcome-cover">${game.headerImage || game.capsuleImage ? `<img src="${escapeHtml(game.headerImage || game.capsuleImage)}" alt="">` : `<div>${escapeHtml(game.title)}</div>`}</div><div class="welcome-game-copy"><span class="badge">${t("dayGame")}</span><h3>${escapeHtml(game.title)}</h3><p>${escapeHtml(game.shortDescription || game.reason || "")}</p><div class="welcome-game-meta"><span>${escapeHtml(game.releaseDate || "—")}</span><span>${reviewText}</span></div><button class="update-button" type="button" data-gc-welcome-open="${escapeHtml(game.id)}">${t("viewDossier")} ↗</button></div></article>` : `<div class="welcome-no-game">${t("noDayGame")}</div>`;
    target.innerHTML = `<div class="welcome-shell"><div class="welcome-copy"><span class="section-kicker">${t("welcomeKicker")}</span><h2>${t("welcomeTitle", { name: safeText(app.activeProfile.name) })}</h2><p>${t("welcomeBody")}</p><div class="welcome-actions"><button class="update-button" type="button" data-gc-continue>${t("continue")} <span>→</span></button><button class="ghost-button" type="button" data-gc-start-guide>${t("startGuide")} <span>✦</span></button></div></div>${card}</div>`;
  }
  function setWelcomeView() {
    sessionWelcomeShown = true;
    app.view = "welcome"; document.querySelectorAll(".nav-item").forEach((item) => item.classList.remove("active"));
    ["homeHero", "metricsRow", "gameSection", "noticeStrip", "profileView", "updatesView"].forEach((id) => document.getElementById(id)?.classList.add("hidden")); document.querySelector(".content-section")?.classList.add("hidden"); document.getElementById("libraryTools")?.classList.add("hidden");
    document.getElementById("welcomeView")?.classList.remove("hidden"); document.getElementById("viewEyebrow").textContent = ""; document.getElementById("viewTitle").textContent = lang() === "en" ? "Welcome" : "Hoş geldin"; document.getElementById("viewSubtitle").textContent = lang() === "en" ? "Your first discovery is waiting." : "İlk keşfin seni bekliyor."; renderWelcome(); applyLanguage();
  }
  function enhancedSetView(view) { if (view === "welcome") { setWelcomeView(); return; } document.getElementById("welcomeView")?.classList.add("hidden"); if (original.setView) original.setView(view); applyLanguage(); }
  function enhancedRenderAll(...args) { if (original.renderAll) original.renderAll(...args); if (app.view === "welcome" || (hasActiveProfile() && !sessionWelcomeShown)) setWelcomeView(); else applyLanguage(); }

  function guideTargets() { return guideSteps.filter((step) => document.querySelector(step.selector)); }
  function renderGuide() {
    const overlay = document.querySelector("#guideOverlay"); const focus = document.querySelector("#guideFocus"); const popover = document.querySelector("#guidePopover"); if (!overlay || !guide.active) return;
    const steps = guideTargets(); if (!steps.length) return;
    const step = steps[Math.min(guide.index, steps.length - 1)];
    guide.rendering = true;
    if (step.view && app.view !== step.view && typeof setView === "function") setView(step.view);
    const target = document.querySelector(step.selector); if (!target) { guide.rendering = false; return; }
    target.scrollIntoView({ block: "center", inline: "nearest" });
    const rect = target.getBoundingClientRect(); const pad = 8; focus.style.left = `${Math.max(8, rect.left - pad)}px`; focus.style.top = `${Math.max(8, rect.top - pad)}px`; focus.style.width = `${rect.width + pad * 2}px`; focus.style.height = `${rect.height + pad * 2}px`;
    document.querySelector("#guideProgress").textContent = t("guideStep", { current: guide.index + 1, total: steps.length }); document.querySelector("#guideEyebrow").textContent = t("guide"); document.querySelector("#guideTitle").textContent = t(step.title); document.querySelector("#guideBody").textContent = t(step.body);
    const next = document.querySelector("#guideNext"); if (next) next.textContent = guide.index === steps.length - 1 ? t("guideFinish") : t("guideNext");
    const popWidth = Math.min(390, window.innerWidth - 32); let left = rect.left; if (left + popWidth > window.innerWidth - 16) left = window.innerWidth - popWidth - 16; if (left < 16) left = 16; let top = rect.bottom + 18; if (top + popover.offsetHeight > window.innerHeight - 16) top = Math.max(16, rect.top - popover.offsetHeight - 18); popover.style.left = `${left}px`; popover.style.top = `${top}px`; overlay.setAttribute("aria-hidden", "false"); overlay.classList.add("open");
    guide.rendering = false;
  }
  function endGuide(completed = true) { const returnToWelcome = guide.returnToWelcome; guide.returnToWelcome = false; guide.active = false; document.querySelector("#guideOverlay")?.classList.remove("open"); document.querySelector("#guideOverlay")?.setAttribute("aria-hidden", "true"); if (completed) { app.settings.guideCompleted = true; persistSettings(); toast(t("guideDone")); } if (returnToWelcome) setView("welcome"); }
  function startGuide(returnToWelcome = app.view === "welcome") { if (!hasActiveProfile()) { toast(t("guideNoProfile"), true); return; } guide.returnToWelcome = returnToWelcome; setView("home"); guide.active = true; guide.index = 0; requestAnimationFrame(renderGuide); }
  window.__gcWelcomeAfterProfile = () => { sessionWelcomeShown = true; setView("welcome"); renderWelcome(); window.setTimeout(() => startGuide(true), 360); };
  function advanceGuide() { const steps = guideTargets(); if (guide.index >= steps.length - 1) endGuide(true); else { guide.index += 1; renderGuide(); } }

  function prepareWizard() {
    const dialog = document.querySelector("#profileDialog"); if (!dialog) return;
    dialog.addEventListener("cancel", (event) => { if (wizard.required) event.preventDefault(); });
    if (dialog.open && !wizard.draft) openWizard(true);
  }
  function installHandlers() {
    document.addEventListener("submit", (event) => { if (event.target?.id === "profileForm") { event.preventDefault(); event.stopImmediatePropagation(); submitWizard(); } }, true);
    document.addEventListener("click", (event) => {
      const theme = event.target.closest("[data-gc-theme]"); if (theme) { event.preventDefault(); event.stopImmediatePropagation(); themeChoice(theme.dataset.gcTheme); return; }
      const font = event.target.closest("[data-gc-font]"); if (font) { event.preventDefault(); event.stopImmediatePropagation(); fontChoice(font.dataset.gcFont); return; }
      const next = event.target.closest("#gcWizardNext"); if (next) { event.preventDefault(); event.stopImmediatePropagation(); if (validateWizard()) { if (wizard.step < 5) { wizard.step += 1; renderWizard(); } else submitWizard(); } return; }
      const back = event.target.closest("#gcWizardBack"); if (back) { event.preventDefault(); event.stopImmediatePropagation(); readWizardFields(); wizard.step = Math.max(1, wizard.step - 1); renderWizard(); return; }
      const cancel = event.target.closest("#gcWizardCancel"); if (cancel) { event.preventDefault(); event.stopImmediatePropagation(); if (!wizard.required) document.querySelector("#profileDialog")?.close(); return; }
      if (event.target.closest("#newProfileButton")) { event.preventDefault(); event.stopImmediatePropagation(); openWizard(false); return; }
      if (event.target.closest("[data-open-profile-dialog]")) { event.preventDefault(); event.stopImmediatePropagation(); openWizard(!hasActiveProfile()); return; }
      const start = event.target.closest("[data-gc-start-guide], #guideButton"); if (start) { event.preventDefault(); event.stopImmediatePropagation(); startGuide(app.view === "welcome"); return; }
      if (event.target.closest("#guideNext")) { event.preventDefault(); event.stopImmediatePropagation(); advanceGuide(); return; }
      if (event.target.closest("#guideSkipStep")) { event.preventDefault(); event.stopImmediatePropagation(); advanceGuide(); return; }
      if (event.target.closest("#guideSkip")) { event.preventDefault(); event.stopImmediatePropagation(); endGuide(false); return; }
      const continueButton = event.target.closest("[data-gc-continue]"); if (continueButton) { event.preventDefault(); event.stopImmediatePropagation(); app.settings.welcomeSeen = true; persistSettings(); setView("home"); return; }
      const welcomeOpen = event.target.closest("[data-gc-welcome-open]"); if (welcomeOpen) { event.preventDefault(); event.stopImmediatePropagation(); openDrawer(welcomeOpen.dataset.gcWelcomeOpen); return; }
    }, true);
    document.addEventListener("change", (event) => {
      if (event.target?.id === "languageSelect") { app.settings.language = event.target.value === "en" ? "en" : "tr"; void persistSettings().finally(() => window.location.reload()); return; }
      if (event.target?.id === "gcWizardLanguage") { readWizardFields(); wizard.draft.language = event.target.value; app.settings.language = wizard.draft.language; applyLanguage(); renderWizard(); return; }
      if (event.target?.id === "gcWizardWeekly") { wizard.draft.weeklyUpdatesEnabled = event.target.checked; return; }
    }, true);
    window.addEventListener("resize", () => { if (guide.active) renderGuide(); }); window.addEventListener("scroll", () => { if (guide.active) renderGuide(); }, true);
    document.addEventListener("keydown", (event) => { if (event.key === "Escape" && guide.active) { event.preventDefault(); endGuide(false); } }, true);
  }
  function installOverrides() {
    if (original.setView) setView = enhancedSetView;
    if (original.renderAll) renderAll = enhancedRenderAll;
    if (original.openProfileDialog) openProfileDialog = openWizard;
    if (original.openDrawer) openDrawer = function (gameId) { original.openDrawer(gameId); applyLanguage(); };
    if (original.formatNumber) formatNumber = localizedNumber;
    if (original.formatHours) formatHours = localizedHours;
    if (original.formatDate) formatDate = localizedDate;
  }
  function init() {
    app.settings = { language: "tr", fontSize: "normal", welcomeSeen: false, guideCompleted: false, ...app.settings };
    viewMeta.welcome = ["", "Hoş geldin", "İlk keşfin seni bekliyor."];
    window.__gcLocaleRefresh = () => { if (lang() === "en") translateDom(document.body); };
    prepareWizard(); installOverrides(); installHandlers(); applyLanguage(); observeTranslations();
    if (document.querySelector("#profileDialog")?.open && !wizard.draft) openWizard(!hasActiveProfile());
    if (app.view === "welcome") setWelcomeView();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init, { once: true }); else setTimeout(init, 0);
})();
