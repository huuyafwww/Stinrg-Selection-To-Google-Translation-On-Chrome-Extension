var selectedStr;
var __history = [];
var __X;
var __Y;

$(function(){
	__on_hover_str();
});

/**
 * On Hover String
 */
function __on_hover_str()
{
	$("body").on(
		"mouseup",
		function(e){
			let target_str = __get_selected_str();
			if(target_str !== "")
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
        selectedStr = window.getSelection().toString();
		if(
			selectedStr !== ""
			&&
			selectedStr !== "\n"
		)
		{
            return selectedStr;
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