;(function( $ ){
	/**
	 * Author: https://github.com/Barrior
	 * 
	 * DDSort: drag and drop sorting.
	 * @param {Object} options
	 *        target[string]: 		可选，jQuery事件委托选择器字符串，默认'li'
	 *        cloneStyle[object]: 	可选，设置占位符元素的样式
	 *        floatStyle[object]: 	可选，设置拖动元素的样式
	 *        down[function]: 		可选，鼠标按下时执行的函数
	 *        move[function]: 		可选，鼠标移动时执行的函数
	 *        up[function]: 		可选，鼠标抬起时执行的函数
	 */
	$.fn.DDSort = function( options ){
		var that = this,
			$doc = $( document ),
			fnEmpty = function(){},
			options = options || {},
			fnDown = options.down || fnEmpty,
			fnMove = options.move || fnEmpty,
			fnUp = options.up || fnEmpty,
			
			cloneStyle = $.extend({
				
				'background-color': '#eee'
				
			}, options.cloneStyle ),
			
			floatStyle = $.extend({
				
				//用固定定位可以防止定位父级不是Body的情况的兼容处理，表示不兼容IE6，无妨
				'position': 'fixed',
				'box-shadow': '10px 10px 20px 0 #eee',
				'webkitTransform': 'rotate(4deg)',
				'mozTransform': 'rotate(4deg)',
				'msTransform': 'rotate(4deg)',
				'transform': 'rotate(4deg)'
				
			}, options.floatStyle ),

			height = 'height',
			width = 'width';

		if( that.css( 'box-sizing' ) == 'border-box' ){
			height = 'outerHeight';
			width = 'outerWidth';
		}

		return that.on( 'mousedown.DDSort', options.target || 'li', function( e ){
			var tagName = e.target.tagName.toLowerCase();
			if( tagName == 'input' || tagName == 'textarea' || tagName == 'select' ){
				return;
			}

			var THIS = this,
				$this = $( THIS ),
				offset = $this.offset(),
				disX = e.pageX - offset.left,
				disY = e.pageY - offset.top,
			
				clone = $this.clone()
					.css( cloneStyle )
					.css( 'height', $this[ height ]() )
					.empty(),
					
				hasClone = 1,

				//缓存计算
				thisOuterHeight = $this.outerHeight(),
				thatOuterHeight = that.outerHeight(),

				//滚动速度
				upSpeed = 4,
				downSpeed = 4;
			
			fnDown.call( THIS );
			
			$doc.on( 'mousemove.DDSort', function( e ){
				if( hasClone ){
					$this.before( clone )
						.css( 'width', $this[ width ]() )
						.css( floatStyle )
						.appendTo( $this.parent() );
						
					hasClone = 0;
				}

				var left = e.pageX - disX,
					top = e.pageY - disY,
					
					prev = clone.prev(),
					next = clone.next();
				
				$this.css({
					left: left,
					top: top
				});
				
				//向上排序
				if( prev.length && top < prev.offset().top + prev.outerHeight()/2 ){
						
					clone.after( prev );
					
				//向下排序
				}else if( next.length && top + thisOuterHeight > next.offset().top + next.outerHeight()/2 ){
					
					clone.before( next );

				}

				/**
				 * 处理滚动条
				 * that是带着滚动条的元素，这里默认以为that元素是这样的元素（正常情况就是这样），如果使用者事件委托的元素不是这样的元素，那么需要提供接口出来
				 */
				var thatScrollTop = that.scrollTop(),
					thatOffsetTop = that.offset().top,
					scrollVal;

				//向上滚动
				if( top < thatOffsetTop ){

					downSpeed = 4;
					upSpeed = ++upSpeed > 10 ? 10 : upSpeed;
					scrollVal = thatScrollTop - upSpeed;

				//向下滚动
				}else if( top + thisOuterHeight - thatOffsetTop > thatOuterHeight ){

					upSpeed = 4;
					downSpeed = ++downSpeed > 10 ? 10 : downSpeed;
					scrollVal = thatScrollTop + downSpeed;
				}

				that.scrollTop( scrollVal );

				fnMove.call( THIS );
			});
			
			$doc.on( 'mouseup.DDSort', function(){
				
				$doc.off( 'mousemove.DDSort mouseup.DDSort' );
				
				//click的时候也会触发mouseup事件，加上判断阻止这种情况
				if( !hasClone ){
					clone.before( $this.removeAttr( 'style' ) ).remove();
					fnUp.call( THIS );
				}
			});
			
			return false;
		});
	};

})( jQuery );