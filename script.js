function getPlatforms(platforms) {
    var list = platforms.split(",");
    for (var i = 0; i < list.length; i++) {
        list[i] = list[i].trim();
    }
    var html = "<div class='platform-list'>";
    for (var i = 0; i < list.length; i++) {
        html += "<span class='platform-badge'>" + list[i] + "</span>";
    }
    html += "</div>";
    return html;
}

function search() {
    document.getElementById("result").innerHTML = "";
    var name = document.getElementById("searchInput").value.toLocaleLowerCase().trim();
    if (!name) return;

    db.collection("users").doc(name).get().then(function(doc) {
        if (doc.exists) {
            var user = doc.data();

            // ── Avatar ──
            var av = document.getElementById("modal-avatar");
            av.style.backgroundImage = "";
            av.style.backgroundSize = "";
            av.style.backgroundPosition = "";
            av.innerHTML = user.name.charAt(0);
            if (user.photo) {
                av.innerHTML = "";
                av.style.backgroundImage = "url(" + user.photo + ")";
                av.style.backgroundSize = "cover";
                av.style.backgroundPosition = "center";
            }

            // ── Header info ──
            currentModalKey = name;
            document.getElementById("modal-name").innerHTML = user.name;
            document.getElementById("modal-handle").innerHTML = user.handle;
            document.getElementById("modal-location").innerHTML =
                "<i class='fas fa-location-dot' style='font-size:11px;color:#57606a;'></i> " + user.location;
            document.getElementById("modal-verified").style.display = "inline-flex";
            document.getElementById("modal-share-btn").style.display = "flex";

            // ── Category config ──
            var categoryLabels = {
                "personal":  "👤 Personal",
                "business":  "💼 Business",
                "messaging": "💬 Messaging",
                "groups":    "👥 Groups & Channels",
                "ecommerce": "🛒 E-Commerce",
                "phone":     "📞 Phone",
                "email":     "📧 Email",
                "other":     "🔗 Other"
            };

            // Group apps by category
            var grouped = {};
            for (var i = 0; i < user.apps.length; i++) {
                var app = user.apps[i];
                var cat = getCategoryForApp(app.name);
                if (!grouped[cat]) grouped[cat] = [];
                grouped[cat].push(app);
            }

            var appsHTML = "";
            var catOrder = ["personal","business","messaging","groups","ecommerce","phone","email","other"];

            for (var c = 0; c < catOrder.length; c++) {
                var cat = catOrder[c];
                if (!grouped[cat]) continue;

                // Category header
                appsHTML += "<div style='margin-bottom:20px;'>";
                appsHTML += "<p style='font-size:10px;font-weight:700;letter-spacing:1.2px;text-transform:uppercase;color:#8c959f;margin:0 0 10px;display:flex;align-items:center;gap:6px;'>" + categoryLabels[cat] + "</p>";
                appsHTML += "<div style='display:grid;grid-template-columns:repeat(4,1fr);gap:8px;'>";

                for (var i = 0; i < grouped[cat].length; i++) {
                    var app = grouped[cat][i];

                    // Build link
                    var link = "#";
                    if (app.link) {
                        if (app.icon === "fa-envelope")                              link = "mailto:" + app.link;
                        else if (app.icon === "fa-whatsapp")                         link = "https://wa.me/" + app.link.replace(/\D/g, "");
                        else if (app.icon === "fa-mobile-alt" || app.icon === "fa-phone") link = "tel:" + app.link;
                        else                                                          link = app.link;
                    }

                    var iconClass = ["fa-mobile-alt","fa-phone","fa-envelope","fa-comment"].indexOf(app.icon) !== -1 ? "fas" : "fab";
                    var imgUrls   = { "gmail":"https://www.google.com/favicon.ico","yahoo":"https://www.yahoo.com/favicon.ico","outlook":"https://outlook.live.com/favicon.ico","icloud":"https://www.icloud.com/favicon.ico" };
                    var isEmail   = imgUrls[app.name];

                    var iconHTML = isEmail
                        ? "<img src='" + imgUrls[app.name] + "' style='width:22px;height:22px;border-radius:4px;'>"
                        : "<i class='" + iconClass + " " + app.icon + "' style='font-size:22px;color:white;'></i>";

                    // Nice readable labels
                    var labelMap = {
                        "instagram":"Instagram","facebook":"Facebook","tiktok":"TikTok",
                        "x":"X","youtube":"YouTube","snapchat":"Snapchat","pinterest":"Pinterest",
                        "fbpage":"FB Page","instabusiness":"Insta Business","tiktokbusiness":"TikTok Biz",
                        "linkedin":"LinkedIn","shopify":"Shopify","whatsapp":"WhatsApp",
                        "whatsappbusiness":"WA Business","telegram":"Telegram","signal":"Signal",
                        "messenger":"Messenger","whatsappgroup":"WA Group","telegramgroup":"TG Group",
                        "telegramchannel":"TG Channel","discord":"Discord","fbgroup":"FB Group",
                        "youtubechannel":"YT Channel","amazon":"Amazon","ebay":"eBay","etsy":"Etsy",
                        "tiktokshop":"TikTok Shop","fbmarketplace":"FB Market","instashop":"Insta Shop",
                        "mobile":"Mobile","businessphone":"Biz Phone","gmail":"Gmail",
                        "yahoo":"Yahoo","outlook":"Outlook","icloud":"iCloud"
                    };
                    var label = labelMap[app.name.toLowerCase()] || (app.name.charAt(0).toUpperCase() + app.name.slice(1));

                    appsHTML +=
                        "<div onclick=\"window.open('" + link + "','_blank')\" " +
                        "style='background:" + app.color + ";border-radius:12px;display:flex;flex-direction:column;align-items:center;justify-content:center;height:64px;cursor:pointer;gap:4px;transition:transform 0.15s,box-shadow 0.15s;'" +
                        " onmouseover=\"this.style.transform='scale(1.05)';this.style.boxShadow='0 4px 14px rgba(0,0,0,0.2)'\"" +
                        " onmouseout=\"this.style.transform='scale(1)';this.style.boxShadow='none'\">" +
                        iconHTML +
                        "<span style='font-size:9px;color:rgba(255,255,255,0.95);text-align:center;font-weight:600;padding:0 4px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:100%;'>" + label + "</span>" +
                        "</div>";
                }

                appsHTML += "</div></div>";
            }

            document.getElementById("modal-apps").innerHTML = "<div style='background:#ffffff;border:1px solid #d0d7de;border-radius:12px;padding:20px;'>" + appsHTML + "</div>";
            document.getElementById("searchModal").style.display = "block";
            document.body.style.overflow = "hidden";

        } else {
            // ── Not found ──
            document.getElementById("modal-name").innerHTML = "";
            document.getElementById("modal-handle").innerHTML = "";
            document.getElementById("modal-location").innerHTML = "";
            document.getElementById("modal-verified").style.display = "none";
            document.getElementById("modal-share-btn").style.display = "none";
            document.getElementById("modal-avatar").innerHTML = "?";
            document.getElementById("modal-avatar").style.backgroundImage = "";
            document.getElementById("modal-apps").innerHTML = "";
            document.getElementById("result").innerHTML =
                "<div style='text-align:center;padding:40px 0;'>" +
                "<div style='font-size:48px;margin-bottom:16px;'>🔍</div>" +
                "<p style='color:#24292f;font-size:17px;font-weight:700;margin-bottom:8px;'>No profile found</p>" +
                "<p style='color:#57606a;font-size:13px;'>" + name + " is not on PeeP yet</p>" +
                "<button onclick=\"showAuth('register')\" style='margin-top:20px;padding:10px 24px;border-radius:8px;border:none;background:linear-gradient(135deg,#667eea,#764ba2);color:white;font-size:13px;cursor:pointer;font-weight:600;font-family:inherit;'>Claim @" + name + "</button>" +
                "</div>";
            document.getElementById("searchModal").style.display = "block";
            document.body.style.overflow = "hidden";
        }
    }).catch(function(error) {
        showToast("Error: " + error);
    });
}


function register() {
    var email = document.getElementById("regEmail").value;
    var password = document.getElementById("regPassword").value;
    var name = document.getElementById("regName").value;
    var handle = document.getElementById("regHandle").value;
    var location = document.getElementById("regLocation").value;
    var platforms = selectedplatforms.join(", ");

    if (email === "" || password === "" || name === "" || handle === "" || location === "" || selectedplatforms.length === 0) {
        showToast("Please fill all fields!");
        return;
    }

    var platformIcons = {
        "instagram": {icon: "fa-instagram", color: "linear-gradient(135deg, #f09433, #dc2743)"},
        "facebook": {icon: "fa-facebook", color: "#1877f2"},
        "tiktok": {icon: "fa-tiktok", color: "#111"},
        "x": {icon: "fa-x-twitter", color: "#111"},
        "youtube": {icon: "fa-youtube", color: "#ff0000"},
        "snapchat": {icon: "fa-snapchat", color: "#fffc00"},
        "pinterest": {icon: "fa-pinterest", color: "#e60023"},
        "fbpage": {icon: "fa-facebook", color: "#1877f2"},
        "instabusiness": {icon: "fa-instagram", color: "linear-gradient(135deg, #f09433, #dc2743)"},
        "tiktokbusiness": {icon: "fa-tiktok", color: "#ff0050"},
        "linkedin": {icon: "fa-linkedin", color: "#0077b5"},
        "whatsapp": {icon: "fa-whatsapp", color: "#25d366"},
        "whatsappbusiness": {icon: "fa-whatsapp", color: "#128c7e"},
        "telegram": {icon: "fa-telegram", color: "#0088cc"},
        "signal": {icon: "fa-comment", color: "#3a76f0"},
        "messenger": {icon: "fa-facebook-messenger", color: "#0084ff"},
        "whatsappgroup": {icon: "fa-whatsapp", color: "#25d366"},
        "telegramgroup": {icon: "fa-telegram", color: "#0088cc"},
        "telegramchannel": {icon: "fa-telegram", color: "#229ed9"},
        "discord": {icon: "fa-discord", color: "#5865f2"},
        "fbgroup": {icon: "fa-facebook", color: "#1877f2"},
        "youtubechannel": {icon: "fa-youtube", color: "#ff0000"},
        "amazon": {icon: "fa-amazon", color: "#ff9900"},
        "ebay": {icon: "fa-ebay", color: "#e53238"},
        "etsy": {icon: "fa-etsy", color: "#f56400"},
        "shopify": {icon: "fa-shopify", color: "#96bf48"},
        "tiktokshop": {icon: "fa-tiktok", color: "#ff0050"},
        "fbmarketplace": {icon: "fa-facebook", color: "#1877f2"},
        "instashop": {icon: "fa-instagram", color: "linear-gradient(135deg, #f09433, #dc2743)"},
        "mobile": {icon: "fa-mobile-alt", color: "#667eea"},
        "businessphone": {icon: "fa-phone", color: "#764ba2"},
        "gmail": {icon: "fa-envelope", color: "#ea4335"},
        "yahoo": {icon: "fa-envelope", color: "#6001d2"},
        "outlook": {icon: "fa-envelope", color: "#0078d4"},
        "icloud": {icon: "fa-envelope", color: "#3693f3"}
    };

    var list = platforms.split(",");
    var apps = [];
    for (var i = 0; i < list.length; i++) {
        var p = list[i].trim().toLocaleLowerCase();
        if (platformIcons[p]) {
            var linkInput = document.getElementById("link-" + p);
            var codeInput = document.getElementById("code-" + p);
            var link = linkInput ? linkInput.value : "";
            if (codeInput && codeInput.value && link) {
                link = codeInput.value + link;
            }
            apps.push({
                icon: platformIcons[p].icon,
                name: list[i].trim(),
                color: platformIcons[p].color,
                link: link
            });
        }
    }

    var key = name.toLowerCase();
    firebase.auth().createUserWithEmailAndPassword(email, password)
    .then(function() {
        db.collection("users").doc(key).set({
            name: name,
            handle: handle,
            location: location,
            platforms: platforms,
            apps: apps,
            email: email
        }).then(function() {
            showDashboard({
                name: name,
                handle: handle,
                location: location,
                apps: apps
            }, key);
            selectedplatforms = [];
            var buttons = document.querySelectorAll(".platform-btn");
            for (var i = 0; i < buttons.length; i++) {
                buttons[i].classList.remove("selected");
            }
        });
    }).catch(function(error) {
        showToast("Error: " + error.message);
    });
}

function login() {
    var email = document.getElementById("loginEmail").value;
    var password = document.getElementById("loginPassword").value;

    if (email === "" || password === "") {
        showToast("Please enter email and password!");
        return;
    }

    firebase.auth().signInWithEmailAndPassword(email, password)
    .then(function() {
        db.collection("users").where("email", "==", email).get()
        .then(function(querySnapshot) {
            querySnapshot.forEach(function(doc) {
                var user = doc.data();
                var key = doc.id;
                showDashboard(user, key);
                showToast("✓ Welcome back, " + user.name + "!");
            });
        });
    }).catch(function(error) {
        showToast("Error: " + error.message);
    });
}

function updatePhone(user) {
    document.querySelector(".phone-avatar").innerHTML = user.name.charAt(0);
    document.querySelector(".phone-info h3").innerHTML = user.handle;
    document.querySelector("#phone-location").innerHTML = user.location;

    var appsHTML = "";
    for (var i = 0; i < user.apps.length; i++) {
        var app = user.apps[i];
        var link = app.link ? app.link : "#";
        var iconClass = ["fa-mobile-alt", "fa-phone", "fa-envelope", "fa-comment"].indexOf(app.icon) !== -1 ? "fas" : "fab";
        appsHTML += "<div class='app-icon' style='background:" + app.color + "' onclick=\"window.open('" + link + "', '_blank')\">" +
            "<i class='" + iconClass + " " + app.icon + "'></i>" +
            "<span>" + app.name + "</span>" +
        "</div>";
    }
    document.querySelector(".apps-grid").innerHTML = appsHTML;
}

var selectedplatforms = [];

// ─── Deep link config for each platform ───────────────────────────────────────
// appScheme: tried first on mobile (opens native app)
// webUrl:    fallback if app not installed / on desktop
// btnColor:  connect button brand colour
// btnIcon:   Font Awesome class
// btnLabel:  button text
var platformDeepLinks = {
    "instagram":       { appScheme: "instagram://",            webUrl: "https://www.instagram.com",         btnColor: "#dc2743", btnIcon: "fab fa-instagram",         btnLabel: "Open Instagram" },
    "instabusiness":   { appScheme: "instagram://",            webUrl: "https://www.instagram.com",         btnColor: "#dc2743", btnIcon: "fab fa-instagram",         btnLabel: "Open Instagram" },
    "instashop":       { appScheme: "instagram://",            webUrl: "https://www.instagram.com",         btnColor: "#dc2743", btnIcon: "fab fa-instagram",         btnLabel: "Open Instagram" },
    "facebook":        { appScheme: "fb://",                   webUrl: "https://www.facebook.com",          btnColor: "#1877f2", btnIcon: "fab fa-facebook",          btnLabel: "Open Facebook" },
    "fbpage":          { appScheme: "fb://",                   webUrl: "https://www.facebook.com",          btnColor: "#1877f2", btnIcon: "fab fa-facebook",          btnLabel: "Open Facebook" },
    "fbgroup":         { appScheme: "fb://",                   webUrl: "https://www.facebook.com",          btnColor: "#1877f2", btnIcon: "fab fa-facebook",          btnLabel: "Open Facebook" },
    "fbmarketplace":   { appScheme: "fb://marketplace",        webUrl: "https://www.facebook.com/marketplace", btnColor: "#1877f2", btnIcon: "fab fa-facebook",       btnLabel: "Open Facebook" },
    "tiktok":          { appScheme: "snssdk1233://",           webUrl: "https://www.tiktok.com",            btnColor: "#111111", btnIcon: "fab fa-tiktok",            btnLabel: "Open TikTok" },
    "tiktokbusiness":  { appScheme: "snssdk1233://",           webUrl: "https://www.tiktok.com",            btnColor: "#ff0050", btnIcon: "fab fa-tiktok",            btnLabel: "Open TikTok" },
    "tiktokshop":      { appScheme: "snssdk1233://",           webUrl: "https://www.tiktok.com",            btnColor: "#ff0050", btnIcon: "fab fa-tiktok",            btnLabel: "Open TikTok" },
    "x":               { appScheme: "twitter://",              webUrl: "https://x.com",                     btnColor: "#111111", btnIcon: "fab fa-x-twitter",         btnLabel: "Open X" },
    "youtube":         { appScheme: "youtube://",              webUrl: "https://www.youtube.com",           btnColor: "#ff0000", btnIcon: "fab fa-youtube",           btnLabel: "Open YouTube" },
    "youtubechannel":  { appScheme: "youtube://",              webUrl: "https://www.youtube.com",           btnColor: "#ff0000", btnIcon: "fab fa-youtube",           btnLabel: "Open YouTube" },
    "snapchat":        { appScheme: "snapchat://",             webUrl: "https://www.snapchat.com",          btnColor: "#ffcc00", btnIcon: "fab fa-snapchat",          btnLabel: "Open Snapchat" },
    "pinterest":       { appScheme: "pinterest://",            webUrl: "https://www.pinterest.com",         btnColor: "#e60023", btnIcon: "fab fa-pinterest",         btnLabel: "Open Pinterest" },
    "linkedin":        { appScheme: "linkedin://",             webUrl: "https://www.linkedin.com",          btnColor: "#0077b5", btnIcon: "fab fa-linkedin",          btnLabel: "Open LinkedIn" },
    "whatsapp":        { appScheme: "whatsapp://",             webUrl: "https://wa.me",                     btnColor: "#25d366", btnIcon: "fab fa-whatsapp",          btnLabel: "Open WhatsApp" },
    "whatsappbusiness":{ appScheme: "whatsapp://",             webUrl: "https://wa.me",                     btnColor: "#128c7e", btnIcon: "fab fa-whatsapp",          btnLabel: "Open WhatsApp" },
    "whatsappgroup":   { appScheme: "whatsapp://",             webUrl: "https://chat.whatsapp.com",         btnColor: "#25d366", btnIcon: "fab fa-whatsapp",          btnLabel: "Open WhatsApp" },
    "telegram":        { appScheme: "tg://",                   webUrl: "https://t.me",                      btnColor: "#0088cc", btnIcon: "fab fa-telegram",          btnLabel: "Open Telegram" },
    "telegramgroup":   { appScheme: "tg://",                   webUrl: "https://t.me",                      btnColor: "#0088cc", btnIcon: "fab fa-telegram",          btnLabel: "Open Telegram" },
    "telegramchannel": { appScheme: "tg://",                   webUrl: "https://t.me",                      btnColor: "#229ed9", btnIcon: "fab fa-telegram",          btnLabel: "Open Telegram" },
    "signal":          { appScheme: "sgnl://",                 webUrl: "https://signal.org",                btnColor: "#3a76f0", btnIcon: "fas fa-comment",           btnLabel: "Open Signal" },
    "messenger":       { appScheme: "fb-messenger://",         webUrl: "https://m.me",                      btnColor: "#0084ff", btnIcon: "fab fa-facebook-messenger",btnLabel: "Open Messenger" },
    "discord":         { appScheme: "discord://",              webUrl: "https://discord.com",               btnColor: "#5865f2", btnIcon: "fab fa-discord",           btnLabel: "Open Discord" },
    "amazon":          { appScheme: "com.amazon.mobile.shopping://", webUrl: "https://www.amazon.co.uk",   btnColor: "#ff9900", btnIcon: "fab fa-amazon",            btnLabel: "Open Amazon" },
    "ebay":            { appScheme: "ebay://",                 webUrl: "https://www.ebay.co.uk",            btnColor: "#e53238", btnIcon: "fab fa-ebay",              btnLabel: "Open eBay" },
    "etsy":            { appScheme: "etsy://",                 webUrl: "https://www.etsy.com",              btnColor: "#f56400", btnIcon: "fab fa-etsy",              btnLabel: "Open Etsy" },
    "shopify":         { appScheme: null,                      webUrl: "https://www.shopify.com",           btnColor: "#96bf48", btnIcon: "fab fa-shopify",           btnLabel: "Open Shopify" },
    "gmail":           { appScheme: "googlegmail://",          webUrl: "https://mail.google.com",           btnColor: "#ea4335", btnIcon: "fas fa-envelope",          btnLabel: "Open Gmail" },
    "yahoo":           { appScheme: "ymail://",                webUrl: "https://mail.yahoo.com",            btnColor: "#6001d2", btnIcon: "fas fa-envelope",          btnLabel: "Open Yahoo" },
    "outlook":         { appScheme: "ms-outlook://",           webUrl: "https://outlook.live.com",          btnColor: "#0078d4", btnIcon: "fas fa-envelope",          btnLabel: "Open Outlook" },
    "icloud":          { appScheme: null,                      webUrl: "https://www.icloud.com/mail",       btnColor: "#3693f3", btnIcon: "fas fa-envelope",          btnLabel: "Open iCloud" }
};

// ─── Placeholders ─────────────────────────────────────────────────────────────
var platformPlaceholders = {
    "instagram": "https://www.instagram.com/yourusername",
    "facebook": "https://www.facebook.com/yourusername",
    "tiktok": "https://www.tiktok.com/@yourusername",
    "x": "https://x.com/yourusername",
    "youtube": "https://www.youtube.com/@yourchannel",
    "snapchat": "https://www.snapchat.com/add/yourusername",
    "pinterest": "https://www.pinterest.com/yourusername",
    "fbpage": "https://www.facebook.com/yourpagename",
    "instabusiness": "https://www.instagram.com/yourbusiness",
    "tiktokbusiness": "https://www.tiktok.com/@yourbusiness",
    "linkedin": "https://www.linkedin.com/in/yourusername",
    "whatsapp": "Your WhatsApp number (+44 7700 900000)",
    "whatsappbusiness": "Your WhatsApp Business number (+44 7700 900000)",
    "whatsappgroup": "https://chat.whatsapp.com/yourgroup",
    "telegram": "https://t.me/yourusername",
    "telegramgroup": "https://t.me/yourgroupname",
    "telegramchannel": "https://t.me/yourchannelname",
    "discord": "https://discord.gg/yourinvite",
    "fbgroup": "https://www.facebook.com/groups/yourgroupname",
    "youtubechannel": "https://www.youtube.com/@yourchannel",
    "messenger": "https://m.me/yourusername",
    "signal": "Your Signal number (+44 7700 900000)",
    "amazon": "https://www.amazon.co.uk/s?me=yoursellerid",
    "ebay": "https://www.ebay.co.uk/usr/yourusername",
    "etsy": "https://www.etsy.com/shop/yourshopname",
    "shopify": "https://yourstore.myshopify.com",
    "tiktokshop": "https://www.tiktok.com/@yourshop/shop",
    "fbmarketplace": "https://www.facebook.com/marketplace/profile/yourid",
    "instashop": "https://www.instagram.com/yourshop",
    "gmail": "Your Gmail address (example@gmail.com)",
    "yahoo": "Your Yahoo email (example@yahoo.com)",
    "outlook": "Your Outlook email (example@outlook.com)",
    "icloud": "Your iCloud email (example@icloud.com)",
    "mobile": "Your mobile number (+44 7700 900000)",
    "businessphone": "Your business number (+44 7700 900000)"
};

// ─── Helper: open native app → fallback to web ────────────────────────────────
function openNativeApp(platform) {
    var cfg = platformDeepLinks[platform];
    if (!cfg) return;

    var isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    if (isMobile && cfg.appScheme) {
        // Try to open the native app
        var start = Date.now();
        window.location.href = cfg.appScheme;
        // After 1.5s, if still on page (app didn't open), fall back to web
        setTimeout(function() {
            if (Date.now() - start < 2000) {
                window.open(cfg.webUrl, "_blank");
            }
        }, 1500);
    } else {
        window.open(cfg.webUrl, "_blank");
    }

    // Unlock the input and prompt user to paste their link
    var linkInput = document.getElementById("link-" + platform);
    if (linkInput) {
        linkInput.removeAttribute("readonly");
        linkInput.placeholder = "Paste your " + platform + " profile link here...";
        linkInput.focus();
        showToast("Copy your " + platform + " link from the app and paste it here! 👆");
    }
}

// ─── Main togglePlatform ──────────────────────────────────────────────────────
function togglePlatform(btn, platform) {
    if (btn.classList.contains("selected")) {
        // Deselect
        btn.classList.remove("selected");
        selectedplatforms = selectedplatforms.filter(function(p) { return p !== platform; });
        var existingInput = document.getElementById("link-" + platform);
        if (existingInput) existingInput.parentElement.remove();
    } else {
        // Select
        btn.classList.add("selected");
        selectedplatforms.push(platform);

        var linkDiv = document.createElement("div");
        linkDiv.style.marginBottom = "8px";

        var placeholder = platformPlaceholders[platform] || ("Your " + platform + " link...");
        var cfg = platformDeepLinks[platform];

        if (platform === "mobile" || platform === "businessphone") {
            // Phone number with country code selector
            linkDiv.innerHTML =
                "<div style='display:flex; gap:8px;'>" +
                "<select id='code-" + platform + "' style='padding:8px; border-radius:6px; border:1px solid #d0d7de; background:#ffffff; color:#24292f; font-size:13px; outline:none; width:130px;'></select>" +
                "<input type='text' id='link-" + platform + "' placeholder='7700 900000' style='flex:1; padding:8px 12px; border-radius:6px; border:1px solid #d0d7de; background:#ffffff; color:#24292f; font-size:13px; outline:none;'>" +
                "</div>";
            document.getElementById("platformLinks").appendChild(linkDiv);
            setTimeout(function() { loadCountryCodes("code-" + platform); }, 100);

        } else if (cfg) {
            // Platform with deep-link Connect button
            linkDiv.innerHTML =
                "<div style='display:flex; gap:8px; align-items:center;'>" +
                "<input type='text' id='link-" + platform + "' placeholder='" + placeholder + "' style='flex:1; padding:8px 12px; border-radius:6px; border:1px solid #d0d7de; background:#ffffff; color:#24292f; font-size:13px; outline:none;'>" +
                "<button onclick='openNativeApp(\"" + platform + "\")' style='padding:8px 14px; border-radius:6px; border:none; background:" + cfg.btnColor + "; color:white; font-size:13px; cursor:pointer; font-weight:600; white-space:nowrap; display:flex; align-items:center; gap:6px;'>" +
                "<i class='" + cfg.btnIcon + "'></i> " + cfg.btnLabel +
                "</button>" +
                "</div>";
            document.getElementById("platformLinks").appendChild(linkDiv);

        } else {
            // Plain text input (no deep link)
            linkDiv.innerHTML =
                "<input type='text' id='link-" + platform + "' placeholder='" + placeholder + "' style='width:100%; padding:8px 12px; border-radius:6px; border:1px solid #d0d7de; background:#ffffff; color:#24292f; font-size:13px; outline:none;'>";
            document.getElementById("platformLinks").appendChild(linkDiv);
        }
    }
}

function clearSearch() {
    document.getElementById("searchInput").value = "";
    document.getElementById("searchModal").style.display = "none";
    document.getElementById("result").innerHTML = "";
    document.body.style.overflow = "";
}

function copyLink() {
    var linkInput = document.getElementById("linkInput");
    linkInput.select();
    document.execCommand("copy");
    showToast("Link copied!");
}

window.onload = function() {
    var urlParams = new URLSearchParams(window.location.search);
    var user = urlParams.get('user');
    if (user) {
        document.getElementById("searchInput").value = user;
        search();
    }
}

function generateQR(link) {
    document.getElementById("qrcode-img").innerHTML = "";
    new QRCode(document.getElementById("qrcode-img"), {
        text: link,
        width: 160,
        height: 160,
    });
}

function showAuth(type) {
    document.getElementById("landing-page").style.display = "none";
    document.getElementById("auth-page").style.display = "block";
    document.getElementById("dashboard-page").style.display = "none";
    if (type === "login") {
        document.getElementById("login-form").style.display = "block";
        document.getElementById("register-form").style.display = "none";
    } else {
        document.getElementById("login-form").style.display = "none";
        document.getElementById("register-form").style.display = "block";
    }
}

function showLanding() {
    document.getElementById("landing-page").style.display = "block";
    document.getElementById("auth-page").style.display = "none";
    document.getElementById("dashboard-page").style.display = "none";
}

function showDashboard(user, key) {
    currentUserKey = key;
    document.getElementById("dash-welcome").innerHTML = "Welcome back, " + user.name + " 👋";
    document.getElementById("landing-page").style.display = "none";
    document.getElementById("auth-page").style.display = "none";
    document.getElementById("dashboard-page").style.display = "block";
    var avatar = document.getElementById("dash-avatar");
    avatar.style.backgroundImage = "";
    avatar.style.backgroundSize = "";
    avatar.style.backgroundPosition = "";
    avatar.innerHTML = user.name.charAt(0) + "<div style='position:absolute; bottom:0; left:0; right:0; background:rgba(0,0,0,0.5); color:white; font-size:8px; text-align:center; padding:2px;'>Edit</div>";
    if (user.photo) {
        avatar.innerHTML = "<div style='position:absolute; bottom:0; left:0; right:0; background:rgba(0,0,0,0.5); color:white; font-size:8px; text-align:center; padding:2px;'>Edit</div>";
        avatar.style.backgroundImage = "url(" + user.photo + ")";
        avatar.style.backgroundSize = "cover";
        avatar.style.backgroundPosition = "center";
    }
    document.getElementById("dash-handle").innerHTML = user.handle;
    document.getElementById("dash-location").innerHTML = user.location;

    var appsHTML = "";
    for (var i = 0; i < user.apps.length; i++) {
        var app = user.apps[i];
        var link = "#";
        if (app.link) {
            if (app.icon === "fa-envelope") {
                link = "mailto:" + app.link;
            } else if (app.icon === "fa-whatsapp") {
                link = "https://wa.me/" + app.link.replace(/\D/g, "");
            } else if (app.icon === "fa-mobile-alt" || app.icon === "fa-phone") {
                link = "tel:" + app.link;
            } else {
                link = app.link;
            }
        }
        var iconClass = ["fa-mobile-alt", "fa-phone", "fa-envelope", "fa-comment"].indexOf(app.icon) !== -1 ? "fas" : "fab";
        var iconHTML = "";
        if (app.name === "gmail" || app.name === "yahoo" || app.name === "outlook" || app.name === "icloud") {
            var imgUrls = {
                "gmail": "https://www.google.com/favicon.ico",
                "yahoo": "https://www.yahoo.com/favicon.ico",
                "outlook": "https://outlook.live.com/favicon.ico",
                "icloud": "https://www.icloud.com/favicon.ico"
            };
            iconHTML = "<img src='" + imgUrls[app.name] + "' style='width:22px; height:22px; border-radius:4px;'>";
        } else {
            iconHTML = "<i class='" + iconClass + " " + app.icon + "'></i>";
        }
        appsHTML += "<div class='app-icon' style='background:" + app.color + "' onclick=\"window.open('" + link + "', '_blank')\">" +
            iconHTML +
            "<span>" + app.name + "</span>" +
        "</div>";
    }

    document.getElementById("dash-apps").innerHTML = appsHTML;
    var userLink = window.location.href.split('?')[0] + "?user=" + key;
    document.getElementById("linkInput").value = userLink;
    generateQR(userLink);
}

function logout() {
    firebase.auth().signOut().then(function() {
        showLanding();
    });
}

var currentUserKey = "";
var editPlatforms = [];

function showEdit() {
    document.getElementById("editForm").style.display = "block";

    editPlatforms = [];

    var editAvatar = document.getElementById("edit-avatar");
    editAvatar.style.backgroundImage = "";
    editAvatar.innerHTML = document.getElementById("dash-avatar").innerHTML || "";
    editAvatar.style.backgroundImage = document.getElementById("dash-avatar").style.backgroundImage;
    editAvatar.style.backgroundSize = "cover";
    editAvatar.style.backgroundPosition = "center";

    document.getElementById("editPlatformLinks").innerHTML = "";

    db.collection("users").doc(currentUserKey).get().then(function(doc) {
        if (doc.exists) {
            var user = doc.data();
            document.getElementById("editName").value = user.name;
            document.getElementById("editHandle").value = user.handle;
            document.getElementById("editLocation").value = user.location;

            var buttons = document.querySelectorAll("#editForm .platform-btn");
            buttons.forEach(function(btn) {
                btn.classList.remove("selected");
            });

            user.apps.forEach(function(app) {
                var platform = app.name.toLowerCase();
                editPlatforms.push(platform);
                var btn = document.querySelector("#editPlatformSelector [onclick*='" + platform + "']");
                if (btn) btn.classList.add("selected");
                var linkDiv = document.createElement("div");
                linkDiv.style.marginBottom = "8px";
                linkDiv.innerHTML = "<input type='text' id='editlink-" + platform + "' placeholder='Your " + platform + " link...' style='width:100%; padding:8px 12px; border-radius:6px; border:1px solid #d0d7de; background:#ffffff; color:#24292f; font-size:13px; outline:none;' value='" + (app.link || "") + "'>";
                document.getElementById("editPlatformLinks").appendChild(linkDiv);
            });
        }
    });
}

function hideEdit() {
    document.getElementById("editForm").style.display = "none";
}

function toggleEditPlatform(btn, platform) {
    if (btn.classList.contains("selected")) {
        btn.classList.remove("selected");
        editPlatforms = editPlatforms.filter(function(p) { return p !== platform; });
        var existingInput = document.getElementById("editlink-" + platform);
        if (existingInput) existingInput.parentElement.remove();
    } else {
        btn.classList.add("selected");
        editPlatforms.push(platform);
        var linkDiv = document.createElement("div");
        linkDiv.style.marginBottom = "8px";
        linkDiv.innerHTML = "<input type='text' id='editlink-" + platform + "' placeholder='Your " + platform + " link...' style='width:100%; padding:8px 12px; border-radius:6px; border:1px solid #d0d7de; background:#ffffff; color:#24292f; font-size:13px; outline:none;'>";
        document.getElementById("editPlatformLinks").appendChild(linkDiv);
    }
}

function saveEdit() {
    var name = document.getElementById("editName").value;
    var handle = document.getElementById("editHandle").value;
    var location = document.getElementById("editLocation").value;

    if (name === "" || handle === "" || location === "") {
        showToast("Please fill all fields!");
        return;
    }

    var platformIcons = {
        "instagram": {icon: "fa-instagram", color: "linear-gradient(135deg, #f09433, #dc2743)"},
        "facebook": {icon: "fa-facebook", color: "#1877f2"},
        "tiktok": {icon: "fa-tiktok", color: "#111"},
        "x": {icon: "fa-x-twitter", color: "#111"},
        "youtube": {icon: "fa-youtube", color: "#ff0000"},
        "snapchat": {icon: "fa-snapchat", color: "#fffc00"},
        "pinterest": {icon: "fa-pinterest", color: "#e60023"},
        "fbpage": {icon: "fa-facebook", color: "#1877f2"},
        "instabusiness": {icon: "fa-instagram", color: "linear-gradient(135deg, #f09433, #dc2743)"},
        "tiktokbusiness": {icon: "fa-tiktok", color: "#ff0050"},
        "linkedin": {icon: "fa-linkedin", color: "#0077b5"},
        "whatsapp": {icon: "fa-whatsapp", color: "#25d366"},
        "whatsappbusiness": {icon: "fa-whatsapp", color: "#128c7e"},
        "telegram": {icon: "fa-telegram", color: "#0088cc"},
        "signal": {icon: "fa-comment", color: "#3a76f0"},
        "messenger": {icon: "fa-facebook-messenger", color: "#0084ff"},
        "whatsappgroup": {icon: "fa-whatsapp", color: "#25d366"},
        "telegramgroup": {icon: "fa-telegram", color: "#0088cc"},
        "telegramchannel": {icon: "fa-telegram", color: "#229ed9"},
        "discord": {icon: "fa-discord", color: "#5865f2"},
        "fbgroup": {icon: "fa-facebook", color: "#1877f2"},
        "youtubechannel": {icon: "fa-youtube", color: "#ff0000"},
        "amazon": {icon: "fa-amazon", color: "#ff9900"},
        "ebay": {icon: "fa-ebay", color: "#e53238"},
        "etsy": {icon: "fa-etsy", color: "#f56400"},
        "shopify": {icon: "fa-shopify", color: "#96bf48"},
        "tiktokshop": {icon: "fa-tiktok", color: "#ff0050"},
        "fbmarketplace": {icon: "fa-facebook", color: "#1877f2"},
        "instashop": {icon: "fa-instagram", color: "linear-gradient(135deg, #f09433, #dc2743)"},
        "mobile": {icon: "fa-mobile-alt", color: "#667eea"},
        "businessphone": {icon: "fa-phone", color: "#764ba2"},
        "gmail": {icon: "fa-envelope", color: "#ea4335"},
        "yahoo": {icon: "fa-envelope", color: "#6001d2"},
        "outlook": {icon: "fa-envelope", color: "#0078d4"},
        "icloud": {icon: "fa-envelope", color: "#3693f3"}
    };

    var apps = [];
    for (var i = 0; i < editPlatforms.length; i++) {
        var p = editPlatforms[i];
        if (platformIcons[p]) {
            var linkInput = document.getElementById("editlink-" + p);
            var link = linkInput ? linkInput.value : "";
            apps.push({
                icon: platformIcons[p].icon,
                name: p,
                color: platformIcons[p].color,
                link: link
            });
        }
    }

    db.collection("users").doc(currentUserKey).update({
        name: name,
        handle: handle,
        location: location,
        apps: apps
    }).then(function() {
        showToast("✓ Profile updated!");
        showDashboard({
            name: name,
            handle: handle,
            location: location,
            apps: apps
        }, currentUserKey);
        hideEdit();
    }).catch(function(error) {
        showToast("Error: " + error.message);
    });
}

function showToast(message) {
    var toast = document.getElementById("toast");
    document.getElementById("toast-message").innerHTML = message;
    toast.style.display = "block";
    setTimeout(function() {
        toast.style.display = "none";
    }, 3000);
}

var currentModalKey = "";

function shareProfile() {
    var shareLink = window.location.href.split('?')[0] + "?user=" + currentModalKey;
    var tempInput = document.createElement("input");
    tempInput.value = shareLink;
    document.body.appendChild(tempInput);
    tempInput.select();
    document.execCommand("copy");
    document.body.removeChild(tempInput);
    showToast("✓ Link copied: " + shareLink);
}

function loginWithGoogle() {
    var provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider)
    .then(function(result) {
        var user = result.user;
        var email = user.email;
        var name = user.displayName;

        db.collection("users").where("email", "==", email).get()
        .then(function(querySnapshot) {
            if (querySnapshot.empty) {
                showAuth('register');
                document.getElementById("regName").value = name;
                document.getElementById("regEmail").value = email;
                showToast("Welcome! Please complete your profile 👋");
            } else {
                querySnapshot.forEach(function(doc) {
                    var userData = doc.data();
                    var key = doc.id;
                    showDashboard(userData, key);
                    showToast("✓ Welcome back, " + userData.name + "!");
                });
            }
        });
    }).catch(function(error) {
        showToast("Error: " + error.message);
    });
}

function uploadPhoto(input) {
    var file = input.files[0];
    if (!file) return;
    showToast("Uploading photo...");
    var formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "i7q7kwai");
    formData.append("cloud_name", "dlrhbfvyb");
    fetch("https://api.cloudinary.com/v1_1/dlrhbfvyb/image/upload", { method: "POST", body: formData })
    .then(function(response) { return response.json(); })
    .then(function(data) {
        var photoUrl = data.secure_url;
        var avatar = document.getElementById("dash-avatar");
        avatar.innerHTML = "";
        avatar.style.backgroundImage = "url(" + photoUrl + ")";
        avatar.style.backgroundSize = "cover";
        avatar.style.backgroundPosition = "center";
        db.collection("users").doc(currentUserKey).update({ photo: photoUrl })
        .then(function() { showToast("✓ Photo updated!"); });
    })
    .catch(function() { showToast("Error uploading photo!"); });
}

function uploadEditPhoto(input) {
    var file = input.files[0];
    if (!file) return;
    showToast("Uploading photo...");
    var formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "i7q7kwai");
    formData.append("cloud_name", "dlrhbfvyb");
    fetch("https://api.cloudinary.com/v1_1/dlrhbfvyb/image/upload", { method: "POST", body: formData })
    .then(function(response) { return response.json(); })
    .then(function(data) {
        var photoUrl = data.secure_url;
        var editAvatar = document.getElementById("edit-avatar");
        editAvatar.innerHTML = "";
        editAvatar.style.backgroundImage = "url(" + photoUrl + ")";
        editAvatar.style.backgroundSize = "cover";
        editAvatar.style.backgroundPosition = "center";
        var dashAvatar = document.getElementById("dash-avatar");
        dashAvatar.innerHTML = "";
        dashAvatar.style.backgroundImage = "url(" + photoUrl + ")";
        dashAvatar.style.backgroundSize = "cover";
        dashAvatar.style.backgroundPosition = "center";
        db.collection("users").doc(currentUserKey).update({ photo: photoUrl })
        .then(function() { showToast("✓ Photo updated!"); });
    })
    .catch(function() { showToast("Error uploading photo!"); });
}

function toggleCategory(name) {
    var body = document.getElementById("cat-" + name);
    var arrow = body.previousElementSibling.querySelector(".category-arrow");
    if (body.style.display === "none") { body.style.display = "block"; arrow.innerHTML = "▲"; }
    else { body.style.display = "none"; arrow.innerHTML = "▼"; }
}

function toggleEditCategory(name) {
    var body = document.getElementById("edit-cat-" + name);
    var arrow = body.previousElementSibling.querySelector(".category-arrow");
    if (body.style.display === "none") { body.style.display = "block"; arrow.innerHTML = "▲"; }
    else { body.style.display = "none"; arrow.innerHTML = "▼"; }
}

function getCategoryForApp(appName) {
    var categories = {
        "personal": ["instagram", "facebook", "tiktok", "x", "youtube", "snapchat", "pinterest"],
        "business": ["fbpage", "instabusiness", "tiktokbusiness", "linkedin"],
        "messaging": ["whatsapp", "whatsappbusiness", "telegram", "signal", "messenger"],
        "groups": ["whatsappgroup", "telegramgroup", "telegramchannel", "discord", "fbgroup", "youtubechannel"],
        "ecommerce": ["amazon", "ebay", "etsy", "shopify", "tiktokshop", "fbmarketplace", "instashop"],
        "phone": ["mobile", "businessphone"],
        "email": ["gmail", "yahoo", "outlook", "icloud"]
    };
    for (var cat in categories) {
        if (categories[cat].indexOf(appName.toLocaleLowerCase()) !== -1) return cat;
    }
    return "other";
}

if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js')
        .then(function() { console.log('PeeP PWA Ready!'); })
        .catch(function(error) { console.log('SW Error: ', error); });
    });
}

function loadCountryCodes(selectID) {
    fetch("https://restcountries.com/v3.1/all?fields=name,idd,flag")
    .then(function(response) { return response.json(); })
    .then(function(countries) {
        countries.sort(function(a, b) { return a.name.common.localeCompare(b.name.common); });
        var select = document.getElementById(selectID);
        if (!select) return;
        select.innerHTML = "";
        countries.forEach(function(country) {
            if (country.idd && country.idd.root) {
                var code = country.idd.root + (country.idd.suffixes && country.idd.suffixes.length === 1 ? country.idd.suffixes[0] : "");
                var option = document.createElement("option");
                option.value = code;
                option.text = country.flag + " " + country.name.common + " " + code;
                if (code === "+44") option.selected = true;
                select.appendChild(option);
            }
        });
    });
}

function forgotPassword() {
    var email = document.getElementById("loginEmail").value;
    if (email === "") { showToast("Please enter your email first!"); return; }
    firebase.auth().sendPasswordResetEmail(email)
    .then(function() { showToast("✓ Password reset email sent! Check your inbox."); })
    .catch(function(error) { showToast("Error: " + error.message); });
}

// connectFacebook kept for backward compatibility but now handled by openNativeApp
function connectFacebook() {
    openNativeApp("facebook");
}