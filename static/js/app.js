axios.defaults.headers.post['Content-Type'] = 'application/json'
axios.defaults.headers.post['Accept'] = 'application/json'

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

const sidebarButtons = enable => {
    document.querySelectorAll('#sidebarActions button:not(.enable)')?.forEach(el => {
        el.disabled = enable
    })
}

let selectedContents = [] 
const checkAll = document.getElementById('checkAll')
checkAll?.addEventListener('change', ev => {
    while (selectedContents.length > 0) {
        selectedContents.pop()
    }
    document.querySelectorAll('.rowCheckbox').forEach(el => {
        el.checked = ev.target.checked
        selectedContents.push(el.dataset.dir)
    })
    sidebarButtons(!ev.target.checked)
})

document.querySelectorAll('.rowCheckbox')?.forEach(el => {
    el.addEventListener('change', ev => {
        if (ev.target.checked) {
            selectedContents.push(el.dataset.dir)
        } else {
            selectedContents = selectedContents.filter(value => {
                return value !== el.dataset.dir
            })
        }
        sidebarButtons(selectedContents.length === 0)
    })
})

document.getElementById('deleteAll')?.addEventListener('click', ev => {
    if (ev.target.disabled) return
    ev.target.disabled = true
    axios.post('/api/group/delete', {
        dirs: selectedContents
    }).then(res => {
        checkAll.checked = false
        location.reload()
    }).catch(err => {
        
    })
})

document.getElementById('renameAll')?.addEventListener('click', ev => {
    const renameAllModalTitle = document.getElementById('renameAllModalTitle')
    const renameAllModalBody = document.getElementById('renameAllModalBody')
    
    renameAllModalTitle.innerText = `Renaming ${selectedContents.length} files`
    const inputs = selectedContents.map(el => {
        const name = el.split('/')
        return `<div class="form-group my-2"><input type="text" name="${el}" value="${name[name.length - 1]}" class="form-control"></div>`
    }).join('')

    renameAllModalBody.innerHTML = inputs
})

// search in directory
document.getElementById('searchInput')?.addEventListener('keyup', ev => {
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

document.getElementById('viewToggle')?.addEventListener('change', ev => {
    if (ev.target.checked) {
        changeViewMode('list')
    } else {
        changeViewMode('icon')
    }
})

document.getElementById('themeToggle')?.addEventListener('change', ev => {
    if (ev.target.checked) {
        changeTheme('dark')
    } else {
        changeTheme('light')
    }
})