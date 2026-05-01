const firebaseConfig = {
    apiKey: "AIzaSyAef4_Ao42IWZxT43HTeu0JCWx2tUDoOhk",
    authDomain: "peep-8ea2f.firebaseapp.com",
    projectId: "peep-8ea2f",
    storageBucket: "peep-8ea2f.firebasestorage.app",
    messagingSenderId: "719628348290",
    appId: "1:719628348290:web:f3d43265ee0b1cd2ecbd9b"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

function search() {
    var name = document.getElementById("searchInput").value.toLowerCase();
    if (name === "") return;

    document.getElementById("result").innerHTML = "<p style='text-align:center; color:#888; padding:20px; font-size:13px;'>Searching...</p>";

    db.collection("users").doc(name).get().then(function(doc) {
        if (doc.exists) {
            var user = doc.data();
            var avatarStyle = "";
            var avatarContent = user.name.charAt(0);
            if (user.photo) {
                avatarStyle = "background-image:url(" + user.photo + "); background-size:cover; background-position:center;";
                avatarContent = "";
            }

            var categoryLabels = {
                "personal": "👤 Personal",
                "business": "💼 Business",
                "messaging": "💬 Messaging",
                "groups": "👥 Groups",
                "ecommerce": "🛒 E-Commerce",
                "phone": "📞 Phone",
                "email": "📧 Email",
                "other": "🔗 Other"
            };

            var grouped = {};
            for (var i = 0; i < user.apps.length; i++) {
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
                appsHTML += "<p class='cat-label'>" + categoryLabels[cat] + "</p>";
                appsHTML += "<div class='apps-grid'>";
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
                    var iconHTML = "<i class='" + iconClass + " " + app.icon + "'></i>";
                    appsHTML += "<div class='app-icon' style='background:" + app.color + "' onclick=\"chrome.tabs.create({url:'" + link + "'})\">" + iconHTML + "<span>" + app.name + "</span></div>";
                }
                appsHTML += "</div>";
            }

            document.getElementById("result").innerHTML =
                "<div class='profile-card'>" +
                    "<div class='profile-header'>" +
                        "<div class='avatar' style='" + avatarStyle + "'>" + avatarContent + "</div>" +
                        "<div>" +
                            "<div class='profile-name'>" + user.name + "</div>" +
                            "<div class='profile-location'>" + user.location + "</div>" +
                            "<span class='verified'>✓ Verified</span>" +
                        "</div>" +
                    "</div>" +
                    appsHTML +
                    "<button class='view-btn' onclick=\"chrome.tabs.create({url:'https://peep-v1.netlify.app/?user=" + name + "'})\">🔗 View Full Profile</button>" +
                "</div>";
        } else {
            document.getElementById("result").innerHTML =
                "<div class='not-found'>" +
                    "<div class='emoji'>🔍</div>" +
                    "<p style='color:white; font-weight:600; margin-bottom:4px;'>No profile found</p>" +
                    "<p>\"" + name + "\" is not on PeeP yet</p>" +
                "</div>";
        }
    }).catch(function(error) {
        document.getElementById("result").innerHTML = "<p style='color:#888; text-align:center; padding:20px; font-size:13px;'>Error: " + error + "</p>";
    });
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
        if (categories[cat].indexOf(appName.toLowerCase()) !== -1) {
            return cat;
        }
    }
    return "other";
}

document.getElementById("searchInput").addEventListener("keypress", function(e) {
    if (e.key === "Enter") search();
});
document.getElementById("searchBtn").addEventListener("click", search);