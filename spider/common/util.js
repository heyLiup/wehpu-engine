var crypto = require('crypto');
var config = require('../config');
var mimeWhiteList = require('./whiteList');

/**
 * AES加密
 * @param {String} data 加密数据
 */
exports.aesEncrypt = function (data) {
  const cipher = crypto.createCipher(config.commonAlgorithm, config.commonSecret);
  var crypted = cipher.update(data, 'utf8', 'hex');
  crypted += cipher.final('hex');
  return crypted;
}

/**
 * AES解密
 * @param {String} encrypted 解密数据
 */
exports.aesDecrypt = function (encrypted) {
  const decipher = crypto.createDecipher(config.commonAlgorithm, config.commonSecret);
  var decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

/**
 * MIME类型转扩展名
 * @param {String} type mime类型
 * @return {String} ext 对应的扩展名
 */
exports.mimeToExt = function (type) {
  var mime = mimeWhiteList.find(elem => {
    return elem.mime.toLowerCase() === type.toLowerCase();
  });

  return mime ? mime.ext : '';
}

/**
 * 过滤非白名单mime类型
 * @param {String} type mime类型
 * @return {Boolean} 合法文件类型
 */
exports.filterMime = function (mime) {
  var _mime = mimeWhiteList.find(elem => {
    return elem.mime.toLowerCase() === mime.toLowerCase();
  });

  return _mime ? true : false;
}