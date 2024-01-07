function getCookie(cname) {
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

function checkCookie() {
  let auth = getCookie("Authorization");
  const p = document.getElementById("loginlogout")
  if (auth != "") {
    var a = document.createElement('a');
    var linkText = document.createTextNode("Logout");
    a.appendChild(linkText);
    a.title = "User logout";
    a.href = "/logout.html";
    a.className = "nav-link"
    p.appendChild(a);

    const p2 = document.getElementById("adminPanelHeader")
    var a2 = document.createElement('a');
    var linkText2 = document.createTextNode("Admin panel");
    a2.appendChild(linkText2);
    a2.href = "/adminpanel.html";
    a2.className = "nav-link"
    p2.appendChild(a2);
  }
  else {
    var a = document.createElement('a');
    var linkText = document.createTextNode("Login");
    a.appendChild(linkText);
    a.title = "User login";
    a.href = "/login.html";
    a.className = "nav-link"
    p.appendChild(a);
  }
}

checkCookie()