const { promisify } = require('util');
const fs = require('fs');
const config = require('../config');
const path = require('path');
const rootPath = path.dirname(path.dirname(require.main.filename));

const helper = {};

helper.resError = (res, message, status) => {
  console.log('resError: ', message);
  return res.status(status || 500).json({ status: 'error', message: message });
}

helper.checkFileExists = (filePath) => {
  if (!filePath) return false
  try {
    return fs.existsSync(filePath);
  } catch (error) {
    console.log('checkFileExists is error', error);
    return false;
  }
}

helper.deleteFile = (filePath) => {
  if (!filePath) return false
  try {
    fs.unlink(filePath, (err) => {
      if (err) {
        console.log(`${filePath} deleteFile is error`, err)
        return;
      }
      console.log(`${filePath} is deleted`)
    })
  } catch (error) {
    console.log('deleteFile is error', error);
  }
}

helper.getUploadPath = (type, fileName) => {
  if (!type) return '';
  try {
    var path = '';
    if (type == 'profile') {
      path = `${config.upload.profile_path}${fileName}`;
    } else if (type == 'item') {
      path = `${config.upload.item_path}${fileName}`;
    }
    return rootPath + '/' + path;
  } catch (error) {
    console.log('getUploadPath is error', error);
    return '';
  }
}

helper.deleteUploadFile = async (type, fileurl) => {
  if (!type || !fileurl) {
    return;
  }
  try {
    const filename = fileurl.split('/').pop();
    const filepath = helper.getUploadPath(type, filename);
    if (!helper.checkFileExists(filepath)) {
      return;
    }
    helper.deleteFile(filepath);
  } catch (err) {
    console.log('deleteUploadFile is error', err);
  }
}

helper.getUploadFileName = (fileurl) => {
  if (!fileurl) {
    return '';
  }
  return fileurl.split('/').pop();
}

helper.getUploadUrl = (type, fileName) => {
  if (!type || !fileName) {
    return '';
  }
  try {
    var path = '';
    if (type == 'profile') {
      path = `${config.upload.profile_path}${fileName}`;
    } else if (type == 'item') {
      path = `${config.upload.item_path}${fileName}`;
    }
    const base_url = config.is_server ? config.http_url_public : config.http_url;
    return path ? `${base_url}/${path}` : '';
  } catch (err) {
    console.log('getUploadUrl is error', err);
    return '';
  }
}


module.exports = helper;