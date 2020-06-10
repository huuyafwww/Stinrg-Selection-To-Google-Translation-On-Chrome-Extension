/**
 * Do Get
 */
function doGet(e)
{
    let p = e.parameter;
    let body = __get_translate(p);
    let response = ContentService.createTextOutput();
    response.setMimeType(ContentService.MimeType.JSON);
    response.setContent(JSON.stringify(body));
    return response;
}

/**
 * Get Translate
 *
 * @param {*} p
 */
function __get_translate(
  p
)
{
  let translatedText = LanguageApp.translate(p.text, "", p.to);
  if(translatedText)
  {
      return {
        code: 200,
        text: translatedText
      };
  }
  else
  {
      return {
        code: 400,
        text: "Bad Request"
      };
  }
}

/**
 * Get OAuth Token
 */
function get_oauth_token() {
  Logger.log(ScriptApp.getOAuthToken());
}