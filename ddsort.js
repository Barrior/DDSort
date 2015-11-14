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
		var $doc = $( document ),
			fnEmpty = function(){},
			fnDown = options.down || fnEmpty,
			fnMove = options.move || fnEmpty,
			fnUp = options.up || fnEmpty,
			
			cloneStyle = $.extend({
				
				'background-color': '#eee'
				
			}, options.cloneStyle ),
			
			floatStyle = $.extend({
				
				'position': 'absolute',
				'box-shadow': '10px 10px 20px 0 #eee',
				'webkitTransform': 'rotate(4deg)',
				'mozTransform': 'rotate(4deg)',
				'msTransform': 'rotate(4deg)',
				'transform': 'rotate(4deg)'
				
			}, options.floatStyle ),

			height = 'height',
			width = 'width';

		if( this.css( 'box-sizing' ) == 'border-box' ){
			height = 'outerHeight';
			width = 'outerWidth';
		}

		return this.on( 'mousedown.DDSort', options.target || 'li', function( e ){
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

				parentLeft = 0,
				parentTop = parentLeft,
				offsetParent = THIS.offsetParent,
				parentOffset,

				//缓存计算
				thisOuterHeight = $this.outerHeight();
			
			/**
			 * 处理定位父级不是body的情况
			 */
			if( offsetParent.tagName.toLowerCase() != 'body' ){
				parentOffset = $( offsetParent ).offset();
				parentLeft = parentOffset.left;
				parentTop = parentOffset.top;
			}

			fnDown.call( THIS );
			
			$doc.on( 'mousemove.DDSort', function( e ){
				if( hasClone ){
					$this.before( clone )
						.css( 'width', $this[ width ]() )
						.css( floatStyle )
						.appendTo( $this.parent() );
						
					hasClone = 0;
				}

				var left = e.pageX - disX - parentLeft,
					top = e.pageY - disY - parentTop,
					
					prev = clone.prev(),
					next = clone.next();
				
				$this.css({
					left: left,
					top: top
				});
				
				if( prev.length && top < prev.offset().top + prev.outerHeight()/2 - parentTop ){
						
					clone.after( prev );
					
				}else if( next.length && top + thisOuterHeight > next.offset().top + next.outerHeight()/2 - parentTop ){
					
					clone.before( next );
				}
				
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