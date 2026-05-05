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
    var name = document.getElementById("searchInput").value.toLocaleLowerCase();
    db.collection("users").doc(name).get().then(function(doc) {
        if (doc.exists) {
            var user = doc.data();
            var user = doc.data();
            var modalAvatar = document.getElementById("modal-avatar");
            modalAvatar.style.backgroundImage = "";
            modalAvatar.style.backgroundSize = "";
            modalAvatar.style.backgroundPosition = "";
            document.getElementById("modal-avatar").innerHTML = user.name.charAt(0);
            if (user.photo) {
                var modalAvatar = document.getElementById("modal-avatar");
                modalAvatar.innerHTML ="";
                modalAvatar.style.backgroundImage = "url("+ user.photo + ")";
                modalAvatar.style.backgroundSize = "cover";
                modalAvatar.style.backgroundPosition = "center";
            } else {
                var modalAvatar = document.getElementById("modal-avatar");
                modalAvatar.innerHTML = user.name.charAt(0);
                modalAvatar.style.backgroundImage ="";
            }
            currentModalKey = name;
            document.getElementById("modal-share-btn").style.display = "block";
            document.getElementById("modal-handle").innerHTML = user.handle;
            document.getElementById("modal-location").innerHTML = user.location;
            document.getElementById("modal-verified").style.display = "inline-block";

var categoryLabels = {
    "personal": "👤 Personal",
    "business": "💼 Business",
    "messaging": "💬 Messaging",
    "groups": "👥 Groups & Channels",
    "ecommerce": "🛒 E-Commerce",
    "phone": "📞 Phone",
    "email": "📧 Email",
    "other": "🔗 Other"
};

var grouped ={};
for(var i = 0; i < user.apps.length; i++) {
    var app = user.apps[i];
    var cat = getCategoryForApp(app.name);
    if (!grouped[cat]) grouped[cat] = [];
    grouped[cat].push(app);
}

var appsHTML = "";
var catOrder = ["personal", "business", "messaging", "groups", "ecommerce", "phone", "email", "other"];
for (var c = 0; c < catOrder.length; c++) {
    var cat = catOrder[c];
    if (!grouped[cat]) continue;
    appsHTML += "<div style='width:100%; margin-bottom:16px; clear:both;'>";
    appsHTML += "<p style='color:#888; font-size:10px; text-transform:uppercase; letter-spacing:1px; margin:0 0 8px;'>" + categoryLabels[cat] + "</p>";
    appsHTML += "<div style='display:grid; grid-template-columns:repeat(4,1fr); gap:8px; width:100%;'>";
    for (var i = 0; i < grouped[cat].length; i++) {
        var app = grouped[cat][i];
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
            iconHTML = "<i class='" + iconClass + " " + app.icon + "' style='font-size:22px; color:white;'></i>";
        }
        appsHTML += "<div onclick=\"window.open('" + link + "', '_blank')\" style='background:" + app.color + "; width:60px; height:60px; border-radius:14px; display:flex; flex-direction:column; align-items:center; justify-content:center; cursor:pointer; gap:4px;'>" +
            iconHTML +
            "<span style='font-size:8px; color:rgba(255,255,255,0.8); text-align:center;'>" + app.name + "</span>" +
        "</div>";
    }
    appsHTML += "</div></div>";
}

document.getElementById("modal-apps").innerHTML = "<div style='display:flex; flex-direction:column; gap:4px;'>" + appsHTML + "</div>";

            document.getElementById("searchModal").style.display = "flex";
        } else {
            document.getElementById("modal-avatar").innerHTML = "?";
            document.getElementById("modal-handle").innerHTML = "";
            document.getElementById("modal-location").innerHTML = "";
            document.getElementById("modal-verified").style.display = "none";
            document.getElementById("result").innerHTML = "<div style='text-align:center; padding:20px 0;'><div style='font-size:40px; margin-bottom:12px;'>🔍</div><p style='color:white; font-size:16px; font-weight:600; margin-bottom:8px;'>No profile found</p><p style='color:#888; font-size:13px;'>\"" + name + "\" is not on Peep yet</p></div>";
            document.getElementById("modal-apps").innerHTML = "";
            document.getElementById("modal-share-btn").style.display ="none";
            document.getElementById("searchModal").style.display = "flex";
        }
    }).catch(function(error) {
        showToast("Error:" + error);
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
    var apps =[];
    for (var i = 0; i < list.length; i++) {
        var p = list[i].trim().toLocaleLowerCase();
        if (platformIcons[p]) {
            var linkInput = document.getElementById("link-" + p);
            var codeInput = document.getElementById("code-" + p);
            var link = linkInput ? linkInput.value :"";
            if (codeInput && codeInput.value && link) {
                link = codeInput.value + link;
            }
            apps.push({
                icon:platformIcons[p].icon,
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
            selectedplatforms =[];
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
        var link =app.link ? app.link : "#";
        var iconClass = ["fa-mobile-alt", "fa-phone", "fa-envelope", "fa-comment"].indexOf(app.icon) !== -1 ? "fas" : "fab";
        appsHTML += "<div class='app-icon' style='background:" + app.color + "' onclick=\"window.open('" + link + "', '_blank')\">" +
            "<i class='" + iconClass + " " + app.icon + "'></i>" +
            "<span>" + app.name + "</span>" +
        "</div>";
    }
    document.querySelector(".apps-grid").innerHTML = appsHTML;
}

var selectedplatforms = [];

function togglePlatform(btn, platform) {
    if (btn.classList.contains("selected")) {
        btn.classList.remove("selected");
        selectedplatforms = selectedplatforms.filter(function(p) {
            return p !==platform;
        });
        var existingInput = document.getElementById("link-" + platform);
        if (existingInput) {
            existingInput.parentElement.remove();
        }

    } else {
        btn.classList.add("selected");
        selectedplatforms.push(platform);
        var linkDiv = document.createElement("div");
        linkDiv.style.marginBottom = "8px";
        var placeholders = {
            "gmail": "Your Gmail address (example@gmail.com)",
            "yahoo": "Your Yahoo email (example@yahoo.com)",
            "outlook": "Your Outlook email (example@outlook.com)",
            "icloud": "Your iCloud email (example@icloud.com)",
            "mobile": "Your mobile number (+44 7700 900000)",
            "businessphone": "Your business number (+44 7700 900000)",
            "whatsapp": "Your WhatsApp number (+44 7700 900000)",
            "whatsappbusiness": "Your WhatsApp Business number (+44 7700 900000)",
            "whatsappgroup": "Your WhatsApp Group invite link...",
            "telegram": "Your Telegram username or link...",
            "telegramgroup": "Your Telegram Group link...",
            "telegramchannel": "Your Telegram Channel link...",
            "discord": "Your Discord server invite link...",
            "fbgroup": "Your Facebook Group link...",
            "fbpage": "Your Facebook Page link...",
            "instabusiness": "Your Instagram Business link...",
            "tiktokbusiness": "Your TikTok Business link...",
            "youtubechannel": "Your YouTube Channel link...",
            "signal": "Your Signal number (+44 7700 900000)"
        };
        var placeholder = placeholders[platform] ? placeholders[platform]: "Your " + platform + " link...";
            if (platform === "mobile" || platform === "businessphone") {
                linkDiv.innerHTML ="<div style='display:flex; gap:8px;'>"+
                "<select id='code-" + platform + "' style='padding:10px; border-radius:10px; border:1px solid #2e2e3e; background:#0a0a0f; color:white; font-size:13px; outline:none; width:130px;'>"+
                "</select>" +
                "<input type='text' id='link-" + platform + "' placeholder='7700 900000' style='flex:1; padding:10px 14px; border-radius:10px; border:1px solid #2e2e3e; background:#0a0a0f; color:white; font-size:13px; outline:none;'>" +
                "</div>";

            } else {
        linkDiv.innerHTML = "<input type='text' id='link-" + platform + "' placeholder='" + placeholder + "' style='width:100%; padding:10px 14px; border-radius:10px; border:1px solid #2e2e3e; background:#0a0a0f; color:white; font-size:13px; outline:none;'>";
            }
        document.getElementById("platformLinks").appendChild(linkDiv);
        if (platform === "mobile" || platform === "businessphone") {
            setTimeout(function() { loadCountryCodes("code-" + platform); }, 100);
        }
    }
}


function clearSearch() {
    document.getElementById("searchInput").value = "";
    document.getElementById("searchModal").style.display = "none";
    document.getElementById("result").innerHTML = "";
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
    document.getElementById("dashboard-page").style.display ="none";
    if (type === "login") {
        document.getElementById("login-form").style.display = "block";
        document.getElementById("register-form").style.display = "none";   
    } else {
        document.getElementById("login-form").style.display ="none";
        document.getElementById("register-form").style.display = "block";
    }
}

function showLanding() {
    document.getElementById("landing-page").style.display = "block";
    document.getElementById("auth-page").style.display = "none";
    document.getElementById("dashboard-page").style.display = "none";
}

function  showDashboard(user, key) {
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
    var appsHTML ="";
    for (var i = 0; i < user.apps.length; i++) {
        var app = user.apps[i];
        var link = "#";
        if (app.link) {
            if (app.icon === "fa-envelope") {
                link = "mailto:" + app.link;
            } else if (app.icon === "fa-whatsapp") {
                link = "https://wa.me/" + app.link.replace(/\D/g,"");
            } else if (app.icon === "fa-mobile-alt" || app.icon === "fa-phone") {
                link = "tel:" +app.link;
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
                "icloud": "https://www.icloud.com/favicon.ico",
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

var currentUserKey ="";
var editPlatforms =[];

function showEdit() {
    document.getElementById("editForm").style.display = "block";
    document.getElementById("editName").value = document.getElementById("dash-handle").innerHTML.replace("@", "");
    document.getElementById("editHandle").value = document.getElementById("dash-handle").innerHTML;
    document.getElementById("editLocation").value = document.getElementById("dash-location").innerHTML;

    editPlatforms = [];
    
    var editAvatar = document.getElementById("edit-avatar");
    editAvatar.style.backgroundImage ="";
    editAvatar.innerHTML = document.getElementById("dash-avatar").innerHTML || "";
    editAvatar.style.backgroundImage = document.getElementById("dash-avatar").style.backgroundImage;
    editAvatar.style.backgroundSize = "cover";
    editAvatar.style.backgroundPosition = "center";
    
    document.getElementById("editPlatformLinks").innerHTML ="";

    db.collection("users").doc(currentUserKey).get().then(function(doc) {
        if (doc.exists) {
            var user = doc.data();
            document.getElementById("editName").value = user.name;
            document.getElementById("editHandle").value = user.handle;
            document.getElementById("editLocation").value = user.location;

            var buttons = document.querySelectorAll("#editform .platform-btn");
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
                linkDiv.innerHTML = "<input type='text' id='editlink-" + platform + "' placeholder='Your " + platform + " link...' style='width:100%; padding:10px 14px; border-radius:10px; border:1px solid #2e2e3e; background:#0a0a0f; color:white; font-size:13px; outline:none;' value='" + app.link + "'>";
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
    editPlatforms = editPlatforms.filter(function(p) {
        return p !== platform;
    });
    var existingInput = document.getElementById("editlink-" + platform);
    if (existingInput) {
        existingInput.parentElement.remove();
    }
} else {
    btn.classList.add("selected");
    editPlatforms.push(platform);
    var linkDiv = document.createElement("div");
    linkDiv.style.marginBottom = "8px";
    linkDiv.innerHTML = "<input type='text' id='editlink-" +platform + "' placeholder='Your " + platform + " link...' style='width:100%; padding:10px 14px; border-radius:10px; border:1px solid #2e2e3e; background:#0a0a0f; color:white; font-size:13px; outline:none;'>";
    document.getElementById("editPlatformLinks").appendChild(linkDiv);
 }

}

function saveEdit() {
    var name = document.getElementById("editName").value;
    var handle = document.getElementById("editHandle").value;
    var location = document.getElementById("editLocation").value;

    if (name === "" || handle === "" || location === "") {
        showToast("please fill all fields!");
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
    showToast("profile updated!");
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
    }, 3000 );
}


var currentModalKey ="";

function shareProfile() {
    var shareLink = window.location.href.split('?')[0] + "?user=" + currentModalKey;
    var tempInput = document.createElement("input");
    tempInput.value = shareLink;
    document.body.appendChild(tempInput);
    tempInput.select();
    document.execCommand("copy");
    document.body.removeChild(tempInput);
    showToast("✓ Link: " + shareLink);
    
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
                showToast("Welcome! Please Complete your profile 👋");  
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
    if (!file)  return;

    showToast("uploading photo...");

    var formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "i7q7kwai");
    formData.append("cloud_name", "dlrhbfvyb");

    fetch("https://api.cloudinary.com/v1_1/dlrhbfvyb/image/upload", {
        method: "POST",
        body: formData
    })
     .then(function(response) { return response.json(); })
     .then(function(data) {
        var photoUrl =data.secure_url;
        var avatar = document.getElementById("dash-avatar");
        avatar.innerHTML = "";
        avatar.style.backgroundImage = "url(" + photoUrl + ")";
        avatar.style.backgroundSize = "cover";
        avatar.style.backgroundPosition = "center";

        db.collection("users").doc(currentUserKey).update({
            photo: photoUrl
     }).then(function() {
        showToast("✓ Photo Updated!");
    });
 })
 .catch(function(error) {
    showToast("Error uploading photo!");
 });
}


function uploadEditPhoto(input) {
    var file = input.files[0];
    if (!file) return;

    showToast("Uploading photo...");

    var formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "i7q7kwai");
    formData.append("cloud_name", "dlrhbfvyb");

    fetch("https://api.cloudinary.com/v1_1/dlrhbfvyb/image/upload", {
        method: "POST",
        body: formData
    })
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

        db.collection("users").doc(currentUserKey).update({
            photo:photoUrl
        }).then(function() {
            showToast("✓ Photo updated!");
        });
    })
    .catch(function(error) {
        showToast("Error uploading photo!");
    });
}

function toggleCategory(name) {
    var body = document.getElementById("cat-" + name);
    var arrow = body.previousElementSibling.querySelector(".category-arrow");
    if (body.style.display === "none") {
        body.style.display = "block";
        arrow.innerHTML = "▲";
    } else {
        body.style.display = "none";
        arrow.innerHTML = "▼";
    }
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
        if (categories[cat].indexOf(appName.toLocaleLowerCase()) !== -1){
            return cat;
        }
    }
    return "other";
}


if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js')
        .then(function(registeration) {
            console.log('PeeP PWA Ready!');
        })
        .catch(function(error) {
            console.log('SW Error: ', error);
        });
    });
}


function loadCountryCodes(selectID) {
    fetch("https://restcountries.com/v3.1/all?fields=name,idd,flag")
    .then(function(response) { return response.json(); })
    .then(function(countries) {
        countries.sort(function(a, b) {
            return a.name.common.localeCompare(b.name.common);
        });
        var select = document.getElementById(selectID);
        if (!select) return;
        select.innerHTML ="";
        countries.forEach(function(country) {
            if(country.idd && country.idd.root) {
                var code = country.idd.root + (country.idd.suffixes && country.idd.suffixes.length === 1 ? country.idd.suffixes[0] : "");
                var option = document.createElement("option");
                option.value = code;
                option.text = country.flag + "" + country.name.common + " " + code;
                if (code === "+93") option.selected = true;
                select.appendChild(option);
            }
        });
    });
}

function toggleEditCategory(name) {
    var body = document.getElementById("edit-cat-" + name);
    var arrow = body.previousElementSibling.querySelector(".category-arrow");
    if (body.style.display === "none") {
        body.style.display = "block";
        arrow.innerHTML = "▲";
    } else {
        body.style.display = "none";
        arrow.innerHTML = "▼";
    }
}


function forgotPassword() {
    var email = document.getElementById("loginEmail").value;
    if (email === "") {
        showToast("Please enter your email first!");
        return;
    }
    firebase.auth().sendPasswordResetEmail(email)
    .then(function() {
        showToast("✓ Password reset email sent! Check your inbox!");
    })
    .catch(function(error) {
        showToast("Error: " + error.message);
    });
}