function testGeminiConnection() {
  const props = PropertiesService.getScriptProperties();
  const key = props.getProperty('GEMINI_API_KEY');
  const model = props.getProperty('GEMINI_MODEL') || 'gemini-2.5-flash';
  const lines = [];
  const report = message => {
    lines.push(message);
    console.log(message);
  };

  report('PUBLIC MENTIONS: CONNECTION TEST');

  if (!key) {
    report('FAIL: GEMINI_API_KEY is missing or empty in Script properties.');
    return lines.join('\n');
  }

  if (key !== key.trim() || /\s/.test(key)) {
    report('FAIL: The key contains whitespace. Remove spaces and line breaks from its saved value, then run again.');
    return lines.join('\n');
  }

  if (/^["']|["']$/.test(key)) {
    report('FAIL: Remove quotation marks around the saved key, then run again.');
    return lines.join('\n');
  }

  report('PASS: Saved key found. Its value will not be printed.');

  if (!/^[a-zA-Z0-9.-]+$/.test(model)) {
    report('FAIL: GEMINI_MODEL contains spaces or invalid characters.');
    return lines.join('\n');
  }

  report('Model: ' + model);

  const tests = [
    {
      name: 'Basic Gemini request',
      body: {
        contents: [{parts: [{text: 'Reply with the word OK.'}]}],
        generationConfig: {maxOutputTokens: 1024}
      }
    },
    {
      name: 'Google Search grounding',
      body: {
        contents: [{parts: [{
          text: 'Use Google Search to find the official Google Apps Script documentation. Return its title and cite the source.'
        }]}],
        tools: [{google_search: {}}],
        generationConfig: {maxOutputTokens: 2048}
      }
    }
  ];

  tests.forEach(test => {
    report('\nTEST: ' + test.name);
    let response;

    try {
      response = UrlFetchApp.fetch(
        'https://generativelanguage.googleapis.com/v1beta/models/' +
        model + ':generateContent',
        {
          method: 'post',
          contentType: 'application/json',
          headers: {'x-goog-api-key': key},
          payload: JSON.stringify(test.body),
          muteHttpExceptions: true
        }
      );
    } catch (_) {
      report('FAIL: Apps Script could not send the request. Check authorization for external requests and try again.');
      return;
    }

    const status = response.getResponseCode();
    let data;

    try {
      data = JSON.parse(response.getContentText());
    } catch (_) {
      report('FAIL: HTTP ' + status + ', response was not valid JSON.');
      return;
    }

    report('HTTP: ' + status);

    if (status !== 200) {
      const error = data.error || {};
      const message = String(error.message || 'No error message supplied.')
        .split(key).join('[REDACTED]')
        .replace(/AIza[0-9A-Za-z_-]+/g, '[REDACTED]');

      report('FAIL: ' + (error.status || 'API error'));
      report(message.slice(0, 2000));

      const help = {
        400: 'Check the message above: it can indicate an invalid key or an unsupported request.',
        401: 'The API credential was not accepted.',
        403: 'Check API/project permissions, key restrictions and regional availability.',
        404: 'The configured model is unavailable. This does not establish that the key is invalid.',
        429: 'A quota or rate limit was reached. Check Google AI Studio usage and billing.',
        503: 'Google is temporarily unavailable. Try again later.'
      };

      if (help[status]) report('NEXT: ' + help[status]);
      return;
    }

    report('PASS: Google accepted this request.');

    const candidate = (data.candidates || [])[0];

    if (!candidate) {
      report('WARNING: No answer candidate returned. Prompt status: ' +
        ((data.promptFeedback || {}).blockReason || 'unspecified'));
      return;
    }

    report('Finish reason: ' + (candidate.finishReason || 'unspecified'));

    if (candidate.finishReason !== 'STOP') {
      report('WARNING: The answer did not finish normally. The key was accepted, but the app may reject this result.');
    }

    if (test.body.tools) {
      const metadata = candidate.groundingMetadata || {};
      const sources = (metadata.groundingChunks || []).length;
      const supports = (metadata.groundingSupports || []).length;

      report('Grounding sources: ' + sources);
      report('Citation-linked passages: ' + supports);

      report(sources && supports
        ? 'PASS: Search returned source-linked evidence.'
        : 'WARNING: Request accepted, but no usable source-linked evidence returned. This is not proof of a bad key.');
    }
  });

  report('\nTEST COMPLETE. Copy this log for troubleshooting; do not copy your API key.');
  return lines.join('\n');
}
