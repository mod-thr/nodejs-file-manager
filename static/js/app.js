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

const changeViewMode = mode => {
    setCookie('viewMode', mode)
    location.reload()
}

const changeTheme = theme => {
    setCookie('theme', theme)
    location.reload()
}

const getMeta = metaName => {
    const metas = document.getElementsByTagName('meta');
    for (let i = 0; i < metas.length; i++) {
        if (metas[i].getAttribute('name') === metaName) {
            return metas[i].getAttribute('content');
        }
    }
    return '';
}

document.querySelectorAll('tr[data-href]').forEach(el => {
    el.addEventListener('click', () => {
        document.location = el.dataset.href
    })
})

const searchInput = document.getElementById('searchInput')
if (searchInput) {
    searchInput.addEventListener('keyup', ev => {
        const searchVal = searchInput.value.toLowerCase()
        const viewMode = getMeta('viewMode')
        document.querySelectorAll('[data-name]').forEach(el => {
            if (viewMode === 'icon') {
                el.style.display = 'block'
            } else {
                el.style.display = 'table-row'
            }
            if (searchVal === '') return

            const name = el.dataset.name.toLowerCase()
            if (!name.includes(searchVal)) {
                el.style.display = 'none'
            }
        })
    })
}