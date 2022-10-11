// Resize.js
const sharp = require('sharp');
const { v4: uuidv4 } = require('uuid');
const path = require('path');

class Resize {
  constructor(folder) {
    this.folder = folder;
  }

  filepath(filename) {
    return path.resolve(`${this.folder}/${filename}`)
  }

  async save(file, name) {
    // const filename = Resize.filename();
    try {
      const extname = path.extname(file.originalname).toLowerCase();
      const filename = name ? `${name}${extname}` : `${uuidv4()}${extname}`;
      const filepath = this.filepath(filename);

      console.log('Resize', filepath);
      console.log('filepath', filename);
      console.log('buffer', file.buffer);

      await sharp(file.buffer)
        // .resize(1024, 0, {
        //   fit: sharp.fit.inside,
        //   withoutEnlargement: true
        // })
        .resize({
          width: 1024, 
          fit: sharp.fit.inside,
          withoutEnlargement: true
        })
        // .toformat('jpeg')
        .toFile(filepath);

      console.log('Resize', filepath);

      return filename;
    } catch (error) {
      console.log('Resize is error', error);
      return null;
    }
  }

}
module.exports = Resize;