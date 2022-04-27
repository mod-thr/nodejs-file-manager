const fs = require('fs')
const path = require('path')

class FileManager {
    #dir
    #name
    #forbiddenNames = [
        '$RECYCLE.BIN',
        'System Volume Information'
    ]

    constructor(dir, name) {
        this.#dir = path.join(dir, name)
        this.#name = name
    }

    isPresentable() {
        return !this.#forbiddenNames.includes(this.#name)
    }

    isFile() {
        try {
            const ls = fs.lstatSync(this.#dir)
            return ls.isFile()
        } catch (err) {
            return undefined
        }
    }

    isDirectory() {
        try {
            const ls = fs.lstatSync(this.#dir)
            return ls.isDirectory()
        } catch (err) {
            return undefined
        }
    }

    getFileExtension() {
        if (!this.isFile()) return undefined
        return path.parse(this.#dir).ext
    }

    getFileSize() {
        if (!this.isFile()) return undefined
        return fs.statSync(this.#dir).size
    }
}

module.exports = FileManager