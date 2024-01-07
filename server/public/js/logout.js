async function logout() {
  try {
    const res = await fetch('/user/logout', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + getCookie('Authorization')
      },
    })
    if (res.status !== 200) {
      throw Error('Nisi prijavljen')
    }
    else {
      document.cookie = "Authorization=; expires=Thu, 18 Dec 2013 12:00:00 UTC";
    }
  }
  catch (err) {
    alert(err);
  }

  window.location = "/";
}

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

logout()