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
	return (
		"?text=" + target_str
		+ "&to=" + to
    );
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
 * @param {string} param
 * @param {*} sender
 * @param {string} endpoint
 * @param {string} authToken
 */
async function __get_translated_str(
    param,
    sender,
    endpoint,
    authToken
)
{
    await $.ajax({
        url:endpoint + param,
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

/**
 * Get Config
 *
 * @param {string} request_url
 * @param {*} sender
 */
function __get_config(
    param,
    sender
){
    chrome.storage.sync.get(
        [
            "sstgt-endpoint",
            "sstgt-token"
        ],
        function(
            result
        )
        {

            // Get Translated String
            __get_translated_str(
                param,
                sender,
                result["sstgt-endpoint"],
                result["sstgt-token"]
            );
        }
    );
}


chrome.runtime.onMessage.addListener(
    async function(
        req,
        sender,
        sendResponse
    )
    {
        // Get Config
        __get_config(
            // Get Translation URL
            __get_translation_url(
                req.body
            ),
            sender
        );
        return true;
    }
);