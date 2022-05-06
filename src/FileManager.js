const fs = require('fs')
const child_process = require('child_process')
const path = require('path')
const { Blob } = require('buffer')
const helpers = require('./helper')

class FileManager {
    #parent
    #dir
    #name
    #forbiddenNames = [
        '$RECYCLE.BIN',
        'System Volume Information'
    ]

    constructor(dir, name) {
        this.#parent = helpers.getPreviousDir(dir)
        this.#dir = path.join(dir, name)
        this.#name = name
    }

    get parent() {
        return this.#parent
    }

    isPresentable() {
        return !this.#forbiddenNames.includes(this.#name)
    }

    isDriveBaseDir(){
        const s = this.#dir.split('/')
        return s.length === 1 && s[0].endsWith(':.')
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

    readFile() {
        if (!this.isFile()) return null
        try {
            return fs.readFileSync(this.#dir, 'utf8')
        } catch (err) {
            console.log(err.message);
        }
    }

    openFileLocation() {
        child_process.exec(`start "" ${ this.#dir }`);    
    }

    getFileMime() {
        if (!this.isFile()) return null
        const mimeType = child_process.execSync('file --mime-type -b "' + this.#dir + '"').toString();
        return mimeType.trim();
    }

    createDirectory(dir_name, recursive) {
        if (!this.isDirectory()) return
        try {
            if (!fs.existsSync(path.join(this.#dir, dir_name))) {
                fs.mkdirSync(path.join(this.#dir, dir_name), { recursive })
                return true
            } else {
                throw new Error('directory already exists')
            }
        } catch (err) {
            console.log(err.message);
            return err.message
        }
    }

    removeDirectory() {
        if (this.isFile()) return
        try {
            if (fs.existsSync(this.#dir)) {
                fs.rmSync(this.#dir, { recursive: true, force: true })
                return true
            } else {
                throw new Error('directory not found')
            }
        } catch (err) {
            console.log(err.message);
            return err.message
        }
    }

    removeFile() {
        if (this.isDirectory()) return
        try {
            if (fs.existsSync(this.#dir)) {
                fs.rmSync(this.#dir, { recursive: true, force: true })
                return true
            } else {
                throw new Error('directory not found')
            }
        } catch (err) {
            console.log(err.message);
            return err.message
        }
    }

    renameDirectory(new_name) {
        if (this.isFile()) return
        try {
            if (fs.existsSync(this.#dir)) {
                fs.renameSync(this.#dir, path.join(this.#parent, new_name))
                return true
            } else {
                throw new Error('directory not found')
            }
        } catch (err) {
            console.log(err.message);
            return err.message
        }
    }

    renameFile(new_name) {
        if (this.isDirectory()) return
        try {
            if (fs.existsSync(this.#dir)) {
                fs.renameSync(this.#dir, path.join(this.#parent, new_name))
                return true
            } else {
                throw new Error('file not found')
            }
        } catch (err) {
            console.log(err.message);
            return err.message
        }
    }

    createFile(file_name, file_content = '') {
        try {
            fs.writeFileSync(path.join(this.#dir, file_name), file_content)
        } catch (err) {
            console.log(err.message);
            return err.message
        }
    }
}

module.exports = FileManager