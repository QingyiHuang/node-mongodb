// 处理删除电影数据的逻辑
$(function () {
    //拿到所有删除按钮
    $('.del').click(function (e) {
        var target = $(e.target);//this.target当前点击的按钮
        var id = target.data('id');
        var tr = $('.item-id-' + id);//拿到list页面中对应那行

        $.ajax({
            type: 'DELETE', // 异步请求类型：删除
            url: '/admin/list?id=' + id,
        })
        //删除以后服务器返回一个状态台
        .done(function (results) {
            if (results.success === 1) {
                if (tr.length > 0) {//如果这行有东西就remove掉
                    tr.remove();
                }
            }
        });
    });
});