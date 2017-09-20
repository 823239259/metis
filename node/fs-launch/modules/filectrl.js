var fs = require('fs');

module.exports = {
    getChannelList: function (req, res) {
        var start_num = req.query.start_num || 0;
        var count = req.query.count || 10;
        fs.readdir('launchs/', function (err, files) {
            if (err) {
                res.end(JSON.stringify({
                    error: 1,
                    message: '读取渠道目录失败',
                    total: 0,
                    data: []
                }));
            } else {
                var responseData = files.slice(start_num, start_num + count);
                res.end(JSON.stringify({
                    error: 0,
                    message: '读取渠道目录成功',
                    total: files.length,
                    data: responseData
                }));
            }
        });
    },
    addChannel: function (req, res) {
        var channelInfo = req.body;
        fs.mkdir('launchs/' + channelInfo.name + '/', function (err) {
            if (err) {
                res.end(JSON.stringify({
                    error: 0,
                    message: '添加渠道失败',
                    data: {}
                }));
            } else {
                res.end(JSON.stringify({
                    error: 0,
                    message: '添加渠道成功',
                    data: {}
                }));
            }
        });
    }
}