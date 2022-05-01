const fs = require('fs')
const path = require('path')
const { Blob } = require('buffer')

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

    readFile() {
        if (!this.isFile()) return null
        try {
            return fs.readFileSync(this.#dir, 'utf8')
        } catch (err) {
            console.log(err.message);
        }
    }

    openFileLocation() {
        require('child_process').exec(`start "" ${ this.#dir }`);    
    }

    getFileMime() {
        if (!this.isFile()) return null
        const execSync = require('child_process').execSync;
        const mimeType = execSync('file --mime-type -b "' + this.#dir + '"').toString();
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
                console.log(this.#dir);
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
}

module.exports = FileManager