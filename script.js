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
    var name = document.getElementById("searchInput").value.toLowerCase();
    db.collection("users").doc(name).get().then(function(doc) {
        if (doc.exists) {
            var user = doc.data();
            updatePhone(user);
            document.querySelector(".phone-screen").style.display = "block";
            document.getElementById("clearBtn").style.display = "block";
        } else {
            document.querySelector(".phone-screen").style.display = "none";
            document.getElementById("result").innerHTML = "<p>No profile found for: " + name + "</p>";
        }
    }).catch(function(error) {
        alert("Error: " + error);
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
        alert("Please fill all fields!");
        return;
    }

    var platformIcons = {
        "instagram": {icon: "fa-instagram", color: "linear-gradient(135deg, #f09433, #dc2743)"},
        "facebook": {icon: "fa-facebook", color: "#1877f2"},
        "tiktok": {icon: "fa-tiktok", color: "#111"},
        "x": {icon: "fa-x-twitter", color: "#111"},
        "youtube": {icon: "fa-youtube", color: "#ff0000"},
        "whatsapp": {icon: "fa-whatsapp", color: "#25d366"},
        "linkedin": {icon: "fa-linkedin", color: "#0077b5"},
        "amazon": {icon: "fa-amazon", color: "#ff9900"},
        "snapchat": {icon: "fa-snapchat", color: "#fffc00"}
    };

    var list = platforms.split(",");
    var apps =[];
    for (var i = 0; i < list.length; i++) {
        var p = list[i].trim().toLocaleLowerCase();
        if (platformIcons[p]) {
            var linkInput = document.getElementById("link-" + p);
            var link = linkInput ? linkInput.value :"";
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
            var userLink = window.location.href.split('?')[0] + "?user=" + key;
            document.getElementById("linkInput").value = userLink;
            document.getElementById("peepLink").style.display = "block";
            generateQR(userLink);
            document.getElementById("regEmail").value = "";
            document.getElementById("regPassword").value = "";
            document.getElementById("regName").value = "";
            document.getElementById("regHandle").value = "";
            document.getElementById("regLocation").value = "";
            selectedplatforms = [];
            var buttons = document.querySelectorAll(".platform-btn");
            for (var i = 0; i < buttons.length; i++) {
                buttons[i].classList.remove("selected");
            }
        });
    }).catch(function(error) {
        alert("Error: " + error.message);
    });
}

function login() {
    var email = document.getElementById("loginEmail").value;
    var password = document.getElementById("loginPassword").value;

    if (email === "" || password === "") {
        alert("Please enter email and password!");
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
            });
        });
    }).catch(function(error) {
        alert("Error: " + error.message);
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
        appsHTML += "<div class='app-icon' style='background:" + app.color + "' onclick=\"window.open('" + link + "', '_blank')\">" +
            "<i class='fab " + app.icon + "'></i>" +
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
        linkDiv.innerHTML = "<input type='text' id='link-" + platform + "' placeholder='Your " + platform + " link...' style='width:100%; padding:10px 14px; border-radius:10px; border:1px solid #2e2e3e; background:#0a0a0f; color:white; font-size:13px; outline:none;'>";
        document.getElementById("platformLinks").appendChild(linkDiv);
    }
}


function clearSearch() {
    document.getElementById("searchInput").value = "";
    document.getElementById("clearBtn").style.display = "none";
    document.querySelector(".phone-screen").style.display = "none";
    document.getElementById("result").innerHTML = "";
}

function copyLink() {
    var linkInput = document.getElementById("linkInput");
    linkInput.select();
    document.execCommand("copy");
    alert("Link copied!");
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
    
    document.getElementById("qrcode").style.display = "block";
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
    document.getElementById("landing-page").style.display = "none";
    document.getElementById("auth-page").style.display = "none";
    document.getElementById("dashboard-page").style.display = "block";
    document.getElementById("dash-avatar").innerHTML = user.name.charAt(0);
    document.getElementById("dash-handle").innerHTML = user.handle;
    document.getElementById("dash-location").innerHTML = user.location;
    var appsHTML ="";
    for (var i = 0; i < user.apps.length; i++) {
        var app = user.apps[i];
        var link = app.link ? app.link : "#";
        appsHTML += "<div class='app-icon' style='background:" + app.color + "' onclick=\"window.open('" + link + "', '_blank')\">" +
            "<i class='fab " +app.icon +"'></i>" +
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

