/**
 * Created by sunmy on 16/4/29.
 */

var $body = $('body');

var main = {
    do: function () {
        var _this = this;
        _this.commonCtrl();
    },
    commonCtrl: function () {
        $body.on('click', '.js_close', function (e) {
            e.preventDefault();
            $(this).parents('.js_mask').hide();
        });
        $body.on('click', '.js_goto', function (e) {
            e.preventDefault();
            location.href = e.target.href;
        });
        $body.on('click', '.js_back', function () {
            history.back();
        });
    },
    showResult: function (data, callback) {
        var _this = this;
        var status = JSON.parse(data).status;
        var message = JSON.parse(data).message;

        switch (status) {
            case 0: // 操作失败
                _this.showDialog({message: message});
                break;
            case 1: // 操作成功
                callback(message);
                break;
            case 1001: // 未登录
                _this.showDialog({
                    message: message,
                    href: '/',
                    btnClass: 'js_goto'
                });
                break;
        }
    },
    showDialog: function (opt) {
        var $dialog = $('#module_dialog').html()
            .replace('$message', opt.message)
            .replace('$href', opt.href || null)
            .replace('$btnClass', opt.btnClass || 'js_close');
        $body.append($dialog);
    },
    loadmore: function (opt) {
        var $loadmore = $('.js_loadmore');
        var $loading = $('.js_loading');
        var page = 1;
        var t = null;
        var request = function (opt, page) {
            $.ajax({
                url: opt.url + '&page=' + page,
                type: 'POST',
                success: function (res) {
                    var data = JSON.parse(res);
                    $('#' + opt.tmpl)
                        .tmpl(data)
                        .appendTo(opt.to);

                    switch (data.status) {
                        case 0:
                            break;
                        case 1:
                            $loadmore.unbind('click');
                            data.data.length ? opt.complete() : opt.empty();
                            break;
                    }
                },
                error: function () {
                    main.showDialog({message: '网络错误'});
                }
            });
        };

        // 渲染首分页
        request(opt, 0);

        $loadmore.on('click', function () {
            request(opt, page);
        });

        $(window).on('scroll', function () {
            if (t == null) {
                t = setTimeout(function () {
                    var scrollTop = $body.scrollTop();
                    var totalHeight = $body.height();
                    var screenHeight = window.innerHeight;

                    // 上拉至底
                    if (totalHeight - scrollTop < screenHeight + 20) {
                        $loadmore.trigger('click');
                        page++;
                    }
                    t = null;
                }, 500);
            }
        });
    }
};

main.do();