const fs = require('fs');

/**
 * A class to manage system storage
 */
class StorageService {
  /**
   * @param {string} folder the folder where will be managing the files
   */
  constructor(folder) {
    this._folder = folder;

    if (!fs.existsSync(folder)) {
      fs.mkdirSync(folder, {recursive: true});
    }
  }

  /**
   * A function to write file to local system folder
   * @param {buffer} file the buffer of the file
   * @param {object} meta the details of the file
   * @return {string} the name of uploaded file
   */
  writeFile(file, meta) {
    const filename = `${+new Date()}-${meta.filename}`;
    const path = `${this._folder}/${filename}`;

    const fileStream = fs.createWriteStream(path);

    return new Promise((resolve, reject) => {
      fileStream.on('error', (error) => reject(error));
      file.pipe(fileStream);
      file.on('end', () => resolve(filename));
    });
  }
}

module.exports = StorageService;
