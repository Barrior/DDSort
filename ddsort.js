/**
 * Author: https://github.com/Barrior
 *
 * DDSort: drag and drop sorting.
 * @param {Object} options
 *        target[string]:        可选，jQuery 事件委托选择器字符串，默认 li
 *        delay[number]:         可选，延时拖拽，单位毫秒
 *        cloneStyle[object]:    可选，设置占位符元素的样式
 *        floatStyle[object]:    可选，设置拖动元素的样式
 *        down[function]:        可选，鼠标按下时执行的函数
 *        move[function]:        可选，鼠标移动时执行的函数
 *        up[function]:          可选，鼠标抬起时执行的函数
 */
+function ($) {
    var defaultOptions = {
        down: $.noop,
        move: $.noop,
        up: $.noop,
        target: 'li',
        delay: 100,
        cloneStyle: {
            'background-color': '#eee'
        },
        floatStyle: {
            // 用固定定位可以防止定位父级不是Body的情况的兼容处理，表示不兼容IE6，无妨
            'position': 'fixed',
            'box-shadow': '10px 10px 20px 0 #eee',
            'webkitTransform': 'rotate(4deg)',
            'mozTransform': 'rotate(4deg)',
            'msTransform': 'rotate(4deg)',
            'transform': 'rotate(4deg)'
        }
    };

    $.fn.DDSort = function (options) {
        var $doc = $(document);
        var settings = $.extend(true, {}, defaultOptions, options);

        return this.each(function () {

            var that = $(this);
            var height = 'height';
            var width = 'width';

            if (that.css('box-sizing') == 'border-box') {
                height = 'outerHeight';
                width = 'outerWidth';
            }

            that.on('mousedown.DDSort touchstart.DDSort', settings.target, function (e) {

                var startTime = new Date().getTime();

                // 桌面端只允许鼠标左键拖动
                if (e.type == 'mousedown' && e.which != 1) return;

                // 防止表单元素，a 链接，可编辑元素失效
                var tagName = e.target.tagName.toLowerCase();
                if (tagName == 'input' || tagName == 'textarea' || tagName == 'select' ||
                    tagName == 'a' || $(e.target).prop('contenteditable') == 'true') {
                    return;
                }

                var self = this;
                var $this = $(self);
                var offset = $this.offset();

                // 桌面端
                var pageX = e.pageX;
                var pageY = e.pageY;

                // 移动端
                var targetTouches = e.originalEvent.targetTouches;
                if (e.type == 'touchstart' && targetTouches) {
                    pageX = targetTouches[0].pageX;
                    pageY = targetTouches[0].pageY;
                }

                var disX = pageX - offset.left;
                var disY = pageY - offset.top;

                var clone = $this.clone()
                        .css(settings.cloneStyle)
                        .css('height', $this[height]())
                        .empty();

                var hasClone = 1;

                // 缓存计算
                var thisOuterHeight = $this.outerHeight();
                var thatOuterHeight = that.outerHeight();

                // 滚动速度
                var upSpeed = thisOuterHeight;
                var downSpeed = thisOuterHeight;
                var maxSpeed = thisOuterHeight * 3;

                settings.down.call(self);

                $doc.on('mousemove.DDSort touchmove.DDSort', function (e) {

                    // 桌面端
                    var pageX = e.pageX;
                    var pageY = e.pageY;

                    // 移动端
                    var targetTouches = e.originalEvent.targetTouches;
                    if (e.type == 'touchmove' && targetTouches) {
                        pageX = targetTouches[0].pageX;
                        pageY = targetTouches[0].pageY;
                    }

                    if (new Date().getTime() - startTime < settings.delay) return;

                    if (hasClone) {
                        $this.before(clone)
                            .css('width', $this[width]())
                            .css(settings.floatStyle)
                            .appendTo($this.parent());

                        hasClone = 0;
                    }

                    var left = pageX - disX;
                    var top = pageY - disY;

                    var prev = clone.prev();
                    var next = clone.next().not($this);

                    // 超出首屏减去页面滚动条高度或宽度
                    $this.css({
                        left: left - $doc.scrollLeft(),
                        top: top - $doc.scrollTop()
                    });

                    // 向上排序
                    if (prev.length && top < prev.offset().top + prev.outerHeight() / 2) {

                        clone.after(prev);

                        // 向下排序
                    } else if (next.length && top + thisOuterHeight > next.offset().top + next.outerHeight() / 2) {

                        clone.before(next);

                    }

                    // 处理滚动条，that 是带着滚动条的元素，这里默认以为 that 元素是这样的元素（正常情况就是这样），
                    // 如果使用者事件委托的元素不是这样的元素，那么需要提供接口出来
                    var thatScrollTop = that.scrollTop();
                    var thatOffsetTop = that.offset().top;
                    var scrollVal;

                    // 向上滚动
                    if (top < thatOffsetTop) {

                        downSpeed = thisOuterHeight;
                        upSpeed = ++upSpeed > maxSpeed ? maxSpeed : upSpeed;
                        scrollVal = thatScrollTop - upSpeed;

                        // 向下滚动
                    } else if (top + thisOuterHeight - thatOffsetTop > thatOuterHeight) {

                        upSpeed = thisOuterHeight;
                        downSpeed = ++downSpeed > maxSpeed ? maxSpeed : downSpeed;
                        scrollVal = thatScrollTop + downSpeed;
                    }

                    that.scrollTop(scrollVal);

                    settings.move.call(self, left - $doc.scrollLeft(), top - $doc.scrollTop());
                })
                .on('mouseup.DDSort touchend.DDSort', function () {

                    $doc.off('mousemove.DDSort mouseup.DDSort touchmove.DDSort touchend.DDSort');

                    // click 的时候也会触发 mouseup 事件，加上判断阻止这种情况
                    if (!hasClone) {
                        clone.before($this.removeAttr('style')).remove();
                        settings.up.call(self);
                    }
                });

                return false;
            });
        });
    };
}(jQuery);
