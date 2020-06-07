/**
 * Do Get
 */
function doGet(e) {
    let p = e.parameter;
    let translatedText = LanguageApp.translate(p.text, "", p.to);
    let body;
    if(translatedText)
    {
        body = {
          code: 200,
          text: translatedText
        };
    }
    else
    {
        body = {
          code: 400,
          text: "Bad Request"
        };
    }
    let response = ContentService.createTextOutput();
    response.setMimeType(ContentService.MimeType.JSON);
    response.setContent(JSON.stringify(body));
    return response;
}

/**
 * Get OAuth Token
 */
function get_oauth_token() {
  Logger.log(ScriptApp.getOAuthToken());
}