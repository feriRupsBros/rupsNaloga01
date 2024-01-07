async function postGraphColorPrefs() {

    const bar1 = document.getElementById("bar1")
    const bar2 = document.getElementById("bar2")
    const bar3 = document.getElementById("bar3")
    const bar4 = document.getElementById("bar4")
    const bar5 = document.getElementById("bar5")
    const bar6 = document.getElementById("bar6")
    const bar7 = document.getElementById("bar7")

    const sender = {
        color1: bar1.value,
        color2: bar2.value,
        color3: bar3.value,
        color4: bar4.value,
        color5: bar5.value,
        color6: bar6.value,
        color7: bar7.value,
    }

    try {
        const res = await fetch('/admin/prefs', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + getCookie('Authorization')
            },
            body: JSON.stringify(sender)
        })
        if (res.status !== 200) {
            throw Error('Napaka')
        }
        else {
            window.location = "/";
        }
    }
    catch (err) {
        alert(err);
    }

}

async function postadd() {
	document.getElementById("error").style = "display: none;"
    const a1 = document.getElementById("n")
    const a2 = document.getElementById("r")
    const a3 = document.getElementById("l1")
    const a4 = document.getElementById("l2")
    const a5 = document.getElementById("s")
    const a6 = document.getElementById("r2")
    const a7 = document.getElementById("PM_10")
    const a8 = document.getElementById("PM_2_5")
    const a9 = document.getElementById("SO2")
    const a0 = document.getElementById("CO")
    const a10 = document.getElementById("O3")
    const a11 = document.getElementById("NO2")
    const a12 = document.getElementById("C6H6")
    const a13 = document.getElementById("Start")
    const a14 = document.getElementById("End")

    const sender = {
        name: a1.value,
        region: a2.value,
        longtitude: a3.value,
        latitude: a4.value,
        source: a5.value,
        reliability: a6.value,
        PM10: a7.value,
        PM2_5: a8.value,
        SO2: a9.value,
        CO: a0.value,
        O3: a10.value,
        NO2: a11.value,
        C6H6: a12.value,
        measuring_start: a13.value,
        measuring_end: a14.value,
    }

    try {
        const res = await fetch('/air_pollution', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + getCookie('Authorization')
            },
            body: JSON.stringify(sender)
        })
        if (res.status !== 200) {
            document.getElementById("error").style = ""
        document.getElementById("error").textContent = "Internal server error"
        }
        else {
            window.location = "/";
        }
    }
    catch (err) {
document.getElementById("error").style = ""
        document.getElementById("error").textContent = "Internal server error"
        alert(err);
    }
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

b2.addEventListener("click", function (event) {
    event.preventDefault()
    postGraphColorPrefs()
});

badd.addEventListener("click", function (event) {
    event.preventDefault()
    postadd()
});
