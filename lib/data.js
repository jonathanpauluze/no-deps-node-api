import fs from 'fs'
import path from 'path'

const __dirname = path.resolve();

class Data {
  constructor() {
    this.baseDir = path.join(__dirname, '.data')
  }

  create(dir, file, data, callback) {
    fs.open(this.baseDir + `/${dir}/${file}.json`, 'wx', (err, fileDescriptor) => {
      if (err || !fileDescriptor) {
        callback('Could not create new file, it may already exist')
        return
      }

      const stringData = JSON.stringify(data)

      fs.writeFile(fileDescriptor, stringData, (err) => {
        if (err) {
          callback('Error writing to new file')
          return
        }

        fs.close(fileDescriptor, (err) => {
          if (err) {
            callback('Error closing new file')
            return
          }

          callback(false)
        })
      })
    })
  }

  read(dir, file, callback) {
    fs.readFile(this.baseDir + `/${dir}/${file}.json`, 'utf8', (err, data) => {
      callback(err, data)
    })
  }

  update(dir, file, data, callback) {
    fs.open(this.baseDir + `/${dir}/${file}.json`, 'r+', (err, fileDescriptor) => {
      if (err || !fileDescriptor) {
        callback('Could not open the file, it may not exist yet')
        return
      }

      const stringData = JSON.stringify(data)

      fs.truncate(fileDescriptor, (err) => {
        if (err) {
          callback('Error truncating file')
          return
        }

        fs.writeFile(fileDescriptor, stringData, (err) => {
          if (err) {
            callback('Error writing to existing file')
            return
          }

          fs.close(fileDescriptor, (err) => {
            if (err) {
              callback('Error closing existing file')
              return
            }

            callback(false)
          })
        })
      })
    })
  }

  delete(dir, file, callback) {
    fs.unlink(this.baseDir + `/${dir}/${file}.json`, (err) => {
      if (err) {
        callback('Error deleting the file')
        return
      }

      callback(false)
    })
  }
}

export { Data }
