var schedule = require('node-schedule');
var logger = require('../../common/logger');
var config = require('./config');
var main = require('./main');

/**
 * 教务公告定时任务
 * vpn.hpu.edu.cn
 * 星期一/星期三/星期五 凌晨2:30
 */
module.exports = function () {
  return schedule.scheduleJob(config.rule, () => {
    var t = new Date();
    logger.info('Started', '教务公告定时任务', t.toISOString());

    // 执行主任务
    Promise
      .resolve(main.getNews())
      .then(() => {
        logger.info('Completed', '教务公告定时任务', (new Date() - t) + 'ms');
      })
      .catch(err => {
        logger.error('Completed', '教务公告定时任务失败:' + err);
      });
  });
}