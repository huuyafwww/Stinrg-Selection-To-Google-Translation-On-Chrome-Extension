var __selected_str,
	__X,
	__Y,
	__click_x,
	__click_y,
	__position,
	__selected_window_index
;
var __history = [];
var __is_moving = false;

$(function(){

	// On Hover String
	__on_selection_str();

	// When Click "X" Button,Delete Preview.
	__click_delete_btn();

	// On Window Init
	__on_window_init()

});

/**
 * On Hover String
 */
function __on_selection_str()
{
	$("body").on(
		"mouseup",
		function(e){
			let target_str = __get_selected_str();
			if(
				target_str !== ""
				&&
				e.altKey
			)
			{
				__X = e.pageX
				__Y = e.pageY
				chrome.runtime.sendMessage({body:target_str});
				__on_message();
			}
		}
	);
}

/**
 * On Hover String
 */
function __on_message()
{
	chrome.runtime.onMessage.addListener(
		function(
			data
		)
		{
			let res = data["body"];
			(
				res["code"] === 200
				&&
				__history.indexOf(
					res["text"]
				) == -1
				&&
				__set_translated_str(
					res["text"],
					__X,
					__Y
				)
			);
			return true;
		}
	);
}

/**
 * Set Translated String
 *
 * @param {string} translated_str
 * @param {int} x
 * @param {int} y
 */
function __set_translated_str(
	translated_str,
	x,
	y
)
{
	let position = __get_insert_position(
		x,
		y
	);
	__history.push(translated_str);
	$("body").append(
		'<div class="d3SzntVG_par" style="top:'+position["y"]+'px;left:'+position["x"]+'px;">'
			+'<div class="d3SzntVG">'
				+ translated_str
				+'<button class="d3SzntVG_delete">X</button>'
			+'</div>'
		+'</div>'
	);
}

/**
 * Get Insert Position
 *
 * @param {int} x
 * @param {int} y
 */
function __get_insert_position(
	x,
	y
)
{
	let target_size = getSelectionDimensions();
	y -= target_size["height"] + 30;
	if(x <= 0) x = 0;
	if(y <= 0) y = 0;
	return {
		x:x,
		y:y,
	};
}

/**
 * Get Selected String
 */
function __get_selected_str()
{
	if(window.getSelection)
	{
        __selected_str = window.getSelection().toString();
		if(
			["","\n"].indexOf(
				__selected_str
			) == -1
		)
		{
            return __selected_str;
        }
    }
    return "";
}

/**
 * Get Selection Dimensions
 */
function getSelectionDimensions(){
    let sel = document.selection, range;
    let width = 0, height = 0;
	if(sel)
	{
		if (sel.type != "Control")
		{
            range = sel.createRange();
            width = range.boundingWidth;
            height = range.boundingHeight;
        }
	}
	else if(window.getSelection)
	{
        sel = window.getSelection();
		if(sel.rangeCount)
		{
            range = sel.getRangeAt(0).cloneRange();
			if(range.getBoundingClientRect)
			{
                let rect = range.getBoundingClientRect();
                width = rect.right - rect.left;
                height = rect.bottom - rect.top;
            }
        }
    }
    return {
		width:width,
		height:height
	};
}

/**
 * When Click "X" Button,Delete Preview.
 */
function __click_delete_btn()
{
	$(document).on(
		"click",
		"button.d3SzntVG_delete",
		function(){
			$(this).parent().parent().remove();
		}
	);
}


/**
 * On Window Init
 */
function __on_window_init()
{
	// On Mouse Down Window
	__on_mouse_down_window();

	// On Mouse Move Window
	__on_mouse_move_window();

	// On Mouse Up Window
	__on_mouse_up_window();
}

/**
 * On Mouse Down Window
 */
function __on_mouse_down_window()
{
	$(document).on(
		"mousedown",
		".d3SzntVG_par",
		function(e){
			if(__is_moving)return;
			__is_moving = true; //移動中にする
			__click_x = e.screenX;
			__click_y = e.screenY;
			__position = $(this).position();
			__selected_window_index = $('.d3SzntVG_par').index(this);
		}
	);
}

/**
 * On Mouse Move Window
 */
function __on_mouse_move_window()
{
	$(document).on(
		"mousemove",
		"body",
		function(e){
			if(!__is_moving)return;
			$(".d3SzntVG_par")
				.eq(__selected_window_index)
				.css(
					"left",
					(
						__position.left
						+ e.screenX
						- __click_x
					)
					+ "px"
				)
			;
			$(".d3SzntVG_par")
				.eq(__selected_window_index)
				.css(
					"top",
					(
						__position.top
						+ e.screenY
						- __click_y
					)
					+ "px"
				)
			;
		}
	);
}

/**
 * On Mouse Up Window
 */
function __on_mouse_up_window()
{
	$(document).on(
		"mouseup",
		"body",
		function(e){
			__is_moving = false;
		}
	);
}
