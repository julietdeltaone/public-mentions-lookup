function diagnoseSearchQuota() {
  const props = PropertiesService.getScriptProperties();
  const key = (props.getProperty('GEMINI_API_KEY') || '').trim();
  const model = (props.getProperty('GEMINI_MODEL') || '').trim();

  if (!key || !/^[a-zA-Z0-9.-]+$/.test(model)) {
    throw new Error('Check GEMINI_API_KEY and GEMINI_MODEL in Script properties.');
  }

  console.log('Model: ' + model);
  console.log('Sending ONE search request. No automatic retries.');

  let response;
  try {
    response = UrlFetchApp.fetch(
      'https://generativelanguage.googleapis.com/v1beta/models/' +
      model + ':generateContent',
      {
        method: 'post',
        contentType: 'application/json',
        headers: {'x-goog-api-key': key},
        payload: JSON.stringify({
          contents: [{parts: [{
            text: 'Use Google Search to find the official Google Apps Script documentation. Give its title and cite it.'
          }]}],
          tools: [{google_search: {}}],
          generationConfig: {maxOutputTokens: 2048}
        }),
        muteHttpExceptions: true
      }
    );
  } catch (_) {
    console.log('Could not send the request. Check Apps Script authorization.');
    return;
  }

  console.log('HTTP: ' + response.getResponseCode());

  let data;
  try {
    data = JSON.parse(response.getContentText());
  } catch (_) {
    console.log('Google returned a non-JSON response.');
    return;
  }

  if (data.error) {
    // Preserve quota violations and retry details, but redact credentials.
    const safe = JSON.stringify(data.error, null, 2)
      .split(key).join('[REDACTED]')
      .replace(/AIza[0-9A-Za-z_-]+/g, '[REDACTED]');
    console.log(safe);
    if (!data.error.details) {
      console.log('Google did not include detailed quota information.');
    }
    return;
  }

  const candidate = (data.candidates || [])[0] || {};
  const meta = candidate.groundingMetadata || {};
  console.log('Request accepted.');
  console.log('Finish reason: ' + (candidate.finishReason || 'not supplied'));
  console.log('Grounding sources: ' + (meta.groundingChunks || []).length);
  console.log('Citation-linked passages: ' + (meta.groundingSupports || []).length);
}
