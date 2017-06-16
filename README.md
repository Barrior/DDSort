# DDSort

一个轻简的 `jQuery` 拖放排序插件，支持移动端。

##### ● 漂亮的UI展示：

![DDSort](img/ddsort.gif)


##### ● 使用方法：

1、假设 `Html` 结构如下：


    <div class="wrap">
	    <ul>
	        <li>...</li>
	        <li>...</li>
	        ...
	    </ul>
    </div>


2、依次引入 `jquery.js` 和 `ddsort.js`，然后使用 `DDSort API` 实现如图拖放排序效果：

    $( '.wrap' ).DDSort({
        
        // 示例而用，默认即 li
        target: 'li',

        // 示例而用，默认有一定的样式    
        floatStyle: {    
            'border': '1px solid #ccc',
            'background-color': '#fff'
        }
    });
	
3、如果拖放列表带有滚动条，那么 `$( '.wrap' )` 要是这个滚动条的元素。

##### ● 详细API
> `DDSort` 方法接受一个 `JSON` 对象类型的参数，以下是对这个参数的描述。


<table width="65%" cellspacing="0" style="border-collapse: collapse;">
<tbody>
	<tr>
		<td>参数列表</td>
		<td>类型</td>
		<td>描述</td>
	</tr>
	<tr>
		<td>target</td>
		<td>string</td>
		<td>可选，插件内部使用的是 jQuery 的 on 方法绑定的事件，此参数就是 on 方法上的选择器字符串，默认 li</td>
	</tr>
	<tr>
		<td>delay</td>
		<td>number</td>
		<td>可选，延迟拖拽，默认延时 100 毫秒</td>
	</tr>
	<tr>
		<td>cloneStyle</td>
		<td>object</td>
		<td>可选，设置占位符元素的样式</td>
	</tr>
	<tr>
		<td>floatStyle</td>
		<td>object</td>
		<td>可选，设置拖动元素的样式</td>
	</tr>
	<tr>
		<td>down</td>
		<td>function</td>
		<td>可选，鼠标按下时执行的函数</td>
	</tr>
	<tr>
		<td>move</td>
		<td>function</td>
		<td>可选，鼠标移动时执行的函数</td>
	</tr>
	<tr>
		<td>up</td>
		<td>function</td>
		<td>可选，鼠标抬起时执行的函数</td>
	</tr>
</tobdy>
</table>

##### ● Bootstrap 上的拖拽问题

请参考 [demo_bootstrap.html](./demo_bootstrap.html)

