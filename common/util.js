var request = require('superagent');
var cheerio = require('cheerio');
var config = require('../config');

// cheerio配置
var cheerioConfig = {
  // True 屏蔽urp不规范源码
  xmlMode: true,
  decodeEntities: true,
  lowerCaseTags: true,
  lowerCaseAttributeNames: true,
  ignoreWhitespace: true
};

/**
 * 处理校历信息
 * @return {Promise} 处理结果
 */
exports.calendar = function () {
  // 发起请求
  return request
    .get('http://my.hpu.edu.cn/viewschoolcalendar3.jsp')
    .then(calendarContent => {
      return new Promise((resolve, reject) => {
        var calendar = {};

        // 处理日历
        $ = cheerio.load(calendarContent.text, cheerioConfig);

        var fontItem = $('.red');
        var aItem = $('a').text().split('--');
        var weekItem = $('span').eq(0).text().match(/星期[\u4e00-\u9fa5]/);

        // 年月日
        calendar.date = fontItem.eq(0).text();
        // 周次
        calendar.weekly = fontItem.eq(1).text();
        // 总周数
        calendar.totalWeekly = fontItem.eq(2).text();
        // 星期几
        calendar.week = weekItem !== null ? weekItem[0] : '';
        // 开学日期
        calendar.termStart = aItem.length > 0 ? aItem[0] : '';
        // 放假日期
        calendar.termEnd = aItem.length > 0 ? aItem[1] : '';
        // 当前学期 1 秋季 2 春季
        calendar.currentTerm = calendar.termEnd ? calendar.termStart.split('-')[0] + '-' + calendar.termEnd.split('-')[0] + '-' + (calendar.termEnd.split('-')[1] < 4 ? 1 : 2) + '-1' : '';

        if (calendar.weekly) {
          resolve(calendar);
        } else {
          reject('日历获取失败');
        }
      })
    })
}