setCookie = (name, value, exDays = 90) => {
    const d = new Date();
    d.setTime(d.getTime() + (exDays * 24 * 60 * 60 * 1000));
    let expires = "expires="+ d.toUTCString();
    document.cookie = name + "=" + value + ";" + expires + ";path=/";
}

getCookie = name => {
    name = name + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for(let i = 0; i < ca.length; i++) {
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

document.querySelectorAll('tr[data-href]').forEach(el => {
    el.addEventListener('click', () => {
        document.location = el.dataset.href
    })
})

const changeViewMode = mode => {
    setCookie('viewMode', mode)
    location.reload()
}

const changeTheme = theme => {
    setCookie('theme', theme)
    location.reload()
}