const si = require('systeminformation')
const fs = require('fs')
const path = require('path')

exports.getDriversList = () => {
    return new Promise((resolve, reject) => {
        si.fsSize().then(data => {
            resolve(data)
        })
    })
}

exports.getUseCssClass = use => {
    if (use > 70 && use < 85) {
        return 'bg-warning'
    } else if (use > 85) {
        return 'bg-danger'
    } else {
        return 'bg-info'
    }
}

exports.getSize = size => {
    if (!size) return undefined
    const i = Math.floor( Math.log(size) / Math.log(1024) )
    const str = (size / Math.pow(1024, i)).toFixed(2) * 1 + '' + ['B', 'kB', 'MB', 'GB', 'TB'][i]
    return str
}

exports.getDirectoryContent = dir => {
    try {
        return fs.readdirSync(path.join(dir))
    } catch (err) {
        return []
    }
}

exports.getTitle = dir => {
    const s = dir.split('/')
    return s[s.length - 1]
}

exports.createLink = link => {
    return '/?dir=' + link
}