// https://script.google.com/macros/s/~/exec";
var endpoint = "GASのエンドポイント";
var authToken = "アクセストークン";

/**
 * Get Translation URL
 *
 * @param {string} target_str
 */
function __get_translation_url(
	target_str
)
{
	let is_ja_str = __is_ja_str(target_str);
	let to = is_ja_str ? "en" : "ja";
	let url = (
		endpoint
		+ "?text=" + target_str
		+ "&to=" + to
    );
    return url;
}

/**
 * Is Japan String
 *
 * @param {string} target_str
 */
function __is_ja_str(
    target_str
)
{
    return /[\u3041-\u3096\u30A1-\u30FA\u3400-\u9FFF\uF900-\uFAFF\uF900-\uFAFF\u3000-\u301C]/.test(target_str);
}

/**
 * Get Translated String
 *
 * @param {string} request_url
 * @param {*} sender
 */
async function __get_translated_str(
    request_url,
    sender
)
{
    await $.ajax({
        url:request_url,
        type:"GET",
        headers: {
            "Authorization": "Bearer " + authToken,
            "Content-Type": "application/json; charset=UTF-8",
        },
        xhrFields: {
            withCredentials: true
        }
    })
    .done(function(data) {
        chrome.tabs.sendMessage(
            sender.tab.id,
            {
                body: data
            }
        );
    });
}


chrome.runtime.onMessage.addListener(
    function(
        req,
        sender,
        sendResponse
    )
    {
        __get_translated_str(
            __get_translation_url(
                req.body
            ),
            sender
        );
        return true;
    }
);