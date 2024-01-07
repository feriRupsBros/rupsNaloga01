const f = document.getElementById("1")
const b = document.getElementById("b")

async function register() {
    document.getElementById("error").style = "display: none;"

    const n = document.getElementById("n")
    const p = document.getElementById("p")

    if (p.value === '' || n.value === '') {
        document.getElementById("error").style = ""
        document.getElementById("error").textContent = "Please fill in the fields"
        return;
    }

    const sender = {
        username: n.value,
        password: p.value
    }

    try {
        const res = await fetch('/user/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(sender)
        })
        if (res.status !== 200) {
            document.getElementById("error").style = ""
            document.getElementById("error").textContent = "User allready exists"
        }
        else {
            window.location = "/login.html";
        }
    }
    catch (err) {
        document.getElementById("error").style = ""
        document.getElementById("error").textContent = "Internal server error"
    }
}

b.addEventListener("click", function (event) {
    event.preventDefault()
    register()
});