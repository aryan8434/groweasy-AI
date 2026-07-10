/**
 * Use Gemini AI to identify mapping configuration between CSV headers and target CRM fields.
 * Uses 3 sample rows for context.
 * @param {Array<string>} headers - CSV column headers
 * @param {Array<Object>} sampleRows - 2-3 sample records for data-shape detection
 * @returns {Promise<Object>} - The JSON mapping configuration
 */
async function identifySchemaMappingGemini(headers, sampleRows) {
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
  if (!GEMINI_API_KEY) {
    throw new Error('Missing GEMINI_API_KEY. Please set the GEMINI_API_KEY environment variable in your Vercel settings or root .env file.');
  }

  if (!headers || headers.length === 0) {
    return { mapping: {} };
  }

  const systemPrompt = `You are an AI assistant specialized in analyzing CSV layouts and mapping raw headers to GrowEasy CRM target fields.
You will be given the list of CSV headers and 3 sample rows. Your task is to output a mapping configuration.

Target CRM Fields to Map:
1. "created_at": Lead creation date.
2. "name": Lead's full name. (If the CSV splits name into multiple fields like "First Name" and "Last Name", map it as an array of strings: ["First Name", "Last Name"]).
3. "email": Lead email address.
4. "country_code": Country calling code (e.g. "+91", "+1").
5. "mobile_without_country_code": Mobile or phone number.
6. "company": Company name.
7. "city": City.
8. "state": State.
9. "country": Country.
10. "lead_owner": Owner or agent assigned.
11. "crm_status": CRM status / lead tag.
12. "crm_note": Notes, comments, or extra columns.
13. "data_source": Data source / origin.
14. "possession_time": Property possession timeline.
15. "description": Lead requirements/description.

Your response must be a valid JSON object matching the following structure:
{
  "mapping": {
    "created_at": "<header_name_or_null>",
    "name": "<header_name>" | ["<header_name_1>", "<header_name_2>"] | null,
    "email": "<header_name_or_null>",
    "country_code": "<header_name_or_null>",
    "mobile_without_country_code": "<header_name_or_null>",
    "company": "<header_name_or_null>",
    "city": "<header_name_or_null>",
    "state": "<header_name_or_null>",
    "country": "<header_name_or_null>",
    "lead_owner": "<header_name_or_null>",
    "crm_status": "<header_name_or_null>",
    "crm_note": "<header_name>" | ["<header_name_1>", "<header_name_2>"] | null,
    "data_source": "<header_name_or_null>",
    "possession_time": "<header_name_or_null>",
    "description": "<header_name_or_null>"
  }
}

Rules:
- If a target field is not present in the headers, output null.
- Map names, emails, and phones to their closest match (e.g., "Mail ID" -> "email", "Ph No" -> "mobile_without_country_code", "Client Name" -> "name").
- Do NOT map columns to multiple target fields unless necessary.
- Return ONLY the raw JSON object. No extra conversational wrapper.`;

  const userPrompt = `Here is the CSV structure to analyze:
Headers: ${JSON.stringify(headers)}
Sample data rows:
${JSON.stringify(sampleRows, null, 2)}

Please return the mapping JSON object.`;

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key=${GEMINI_API_KEY}`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: systemPrompt + '\n\n' + userPrompt }
            ]
          }
        ],
        generationConfig: {
          responseMimeType: 'application/json',
        }
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Gemini API Error (HTTP ${response.status}): ${errorText}`);
    }

    const data = await response.json();
    
    if (!data.candidates || data.candidates.length === 0 || !data.candidates[0].content) {
      throw new Error('Gemini API returned an empty response. Please verify the API key and prompts.');
    }

    const text = data.candidates[0].content.parts[0].text;
    const parsedData = JSON.parse(text);
    return parsedData.mapping || {};
  } catch (error) {
    console.error('Error calling Gemini for schema mapping:', error);
    throw error;
  }
}

module.exports = {
  identifySchemaMappingGemini,
};
