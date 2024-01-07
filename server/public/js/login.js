const f = document.getElementById("1")
const b = document.getElementById("b")

async function login() {
    document.getElementById("error").style = "display: none;"

    const n = document.getElementById("n")
    const p = document.getElementById("p")

    console.log(n)
    console.log(p)
    if (n.value === '' || p.value === '') {
        document.getElementById("error").style = ""
        document.getElementById("error").textContent = "Please fill in the fields"
        return;
    }

    const sender = {
        username: n.value,
        password: p.value
    }
    try {
        const res = await fetch('/user/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(sender)
        })
        if (res.status !== 200) {
            document.getElementById("error").style = ""
            document.getElementById("error").textContent = "Incorrect email/password"
        }
        else {
            window.location = "/";
        }
    }
    catch (err) {
        document.getElementById("error").style = ""
        document.getElementById("error").textContent = "Internal server error"
    }

}

b.addEventListener("click", function (event) {
    event.preventDefault()
    login()
});