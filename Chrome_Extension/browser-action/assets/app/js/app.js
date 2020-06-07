$(function(){

    // When Open Browser Action Window,Set Config to Input
    __init();

    // When Click Save Button,Save Config
    __on_click_save_btn();
});

/**
 * When Open Browser Action Window,Set Config to Input
 */
function __init(){
    chrome.storage.sync.get(
        [
            "sstgt-endpoint",
            "sstgt-token"
        ],
        function(
            result
        )
        {
            $("#endpoint").val(
                result["sstgt-endpoint"]
            );
            $("#token").val(
                result["sstgt-token"]
            );
        }
    );
}

/**
 * When Click Save Button,Save Config
 */
function __on_click_save_btn()
{
    $("#save").on(
        "click",
        function()
        {
            // Save Config
            __save_config(
                $("#endpoint").val(),
                $("#token").val()
            );

            // When Save Config,Show Notify
            __on_saved();
        }
    );
}

/**
 * Save Config
 *
 * @param {string} endpoint
 * @param {string} token
 */
function __save_config(
    endpoint,
    token
){
    chrome.storage.sync.set(
        {
            "sstgt-endpoint" : endpoint,
            "sstgt-token" : token
        }
    );
}

/**
 * When Save Config,Show Notify
 */
function __on_saved(){
    $("h4 span").removeClass("d-none");
}