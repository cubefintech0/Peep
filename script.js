var users = {
    "ahmad" : {
        name: " Ahmad Al-Rashid",
        handle: "@ahmad",
        location: "London",
        platforms: "Instagram, Facebook, Tiktok, X, Youtube",
        apps: [
            {icon: "fa-instagram", name: "Instagram" , color: "linear-gradient(135deg, #f09433, #dc2743)"},
            {icon: "fa-facebook", name: "Facebook", color: "#1877f2"},
            {icon: "fa-tiktok", name: "TikTok", color: "#111"},
            {icon: "fa-x-twitter", name: "X", color: "#111"},
            {icon: "fa-youtube", name: "YouTube", color: "#ff0000"},
            {icon: "fa-amazon", name: "Amazon", color: "#ff9900"}
        ]
    },
 "sara": {
        name: "Sara Mohammed",
        handle: "@sara",
        location: "Dubai",
        platforms: "Instagram, TikTok, Snapchat",
        apps: [
            {icon: "fa-instagram", name: "Instagram", color: "linear-gradient(135deg, #f09433, #dc2743)"},
            {icon: "fa-tiktok", name: "TikTok", color: "#111"},
            {icon: "fa-snapchat", name: "Snapchat", color: "#fffc00"}
        ]
    },
    "zubair": {
        name: "Zubair Khan",
        handle: "@zubair",
        location: "Cairo",
        platforms: "Facebook, LinkedIn, YouTube",
          apps: [
            {icon: "fa-facebook", name: "Facebook", color: "#1877f2"},
            {icon: "fa-linkedin", name: "LinkedIn", color: "#0077b5"},
            {icon: "fa-youtube", name: "YouTube", color: "#ff0000"}
        ]
    }   
}



function getPlatforms(platforms) {
    var list = platforms.split(",");
    for (var i = 0; i< list.length; i++) {
        list[i] = list[i].trim();
    }
    var html = "<div class='platform-list'>";
    for (var i = 0; i <list.length; i++) {
        html += "<span class='platform-badge'>" + list[i] + "</span>";

    }
    html += "</div>";
    return html;
}





function search () {
    document.getElementById("result").innerHTML ="";
    var name = document.getElementById("searchInput").value.toLowerCase();
    var user= users[name];

    if (user){
        updatePhone(user);
        document.querySelector(".phone-screen").style.display = "block";
    } else{
        document.getElementById("result").innerHTML = "<p>No Profile Found For: " + name + "</p>";
    }

    
   
}

function register() {
    var name = document.getElementById("regName").value;
    var handle = document.getElementById("regHandle").value;
    var location = document.getElementById("regLocation").value;
    var platforms = document.getElementById("regPlatforms").value;

    if (name === "" || handle === "" || location === "" || platforms === "") {
        alert("Please fill all fields!");
        return;
    }

    var platformIcons ={
        "instagram": {icon: "fa-instagram", color: "linear-gradient(135deg, #f09433, #dc2743)"},
        "facebook" : {icon: "fa-facebook", color: "#1877f2"},
        "tiktok": {icon: "fa-tiktok", color: "#111"},
        "x": {icon: "fa-x-twitter", color: "#111"},
        "youtube": {icon: "fa-youtube", color: "#ff0000"},
        "whatsapp": {icon: "fa-whatsapp", color: "#25d366"},
        "linkedin": {icon: "fa-linkedin", color: "#0077b5"},
        "amazon": {icon: "fa-amazon", color: "#ff9900"},
        "snapchat": {icon: "fa-snapchat", color: "#fffc00"}
    };

    var list = platforms.split(",");
    var apps = [];
    for (var i = 0; i < list.length; i++) {
        var p = list[i].trim().toLowerCase();
        if (platformIcons[p]){
            apps.push({
                icon:platformIcons[p].icon,
                name: list[i].trim(),
                color: platformIcons[p].color
            });
        }
    }
var key = name.toLowerCase();
users[key] = {
    name: name,
    handle: handle,
    location: location,
    platforms: platforms,
    apps: apps,
};

    alert("Welcome to Peep," + name + "!");

}

function updatePhone(user) {
    document.querySelector(".phone-avatar").innerHTML = user.name.charAt(0);
    document.querySelector(".phone-info h3").innerHTML = user.handle;
    document.querySelector("#phone-location").innerHTML = user.location;

    var appsHTMl = "";
    for (var i = 0; i < user.apps.length; i++) {
        var app = user.apps[i];
        appsHTMl += "<div class='app-icon' style='background:" +app.color + "'>"+
            "<i class='fab " + app.icon + "'></i>" +
            "<span>" + app.name + "</span>" +
        "</div>";
    }
    document.querySelector(".apps-grid").innerHTML = appsHTMl;
}