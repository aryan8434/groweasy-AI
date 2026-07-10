const { Groq } = require('groq-sdk');

const GROQ_API_KEY = process.env.GROQ_API_KEY;

if (!GROQ_API_KEY) {
  throw new Error('Missing GROQ_API_KEY. Please set the GROQ_API_KEY environment variable in your Vercel settings or root .env file.');
}

const groq = new Groq({
  apiKey: GROQ_API_KEY,
});

/**
 * Use AI to identify mapping configuration between CSV headers and target CRM fields.
 * Uses 3 sample rows for context to handle arbitrary styles.
 * @param {Array<string>} headers - CSV column headers
 * @param {Array<Object>} sampleRows - 2-3 sample records for data-shape detection
 * @returns {Promise<Object>} - The JSON mapping configuration
 */
async function identifySchemaMapping(headers, sampleRows) {
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

  try {
    const response = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.1,
    });

    const content = response.choices[0].message.content;
    const parsedData = JSON.parse(content);
    return parsedData.mapping || {};
  } catch (error) {
    console.error('Error calling Groq for schema mapping:', error);
    throw error;
  }
}

/**
 * Process raw CSV rows programmatically using the AI-identified mapping structure.
 * Cleans data and applies standard filters locally.
 * @param {Array<Object>} rows - All raw CSV records
 * @param {Object} mapping - Mappings returned by Groq
 * @returns {Object} - Mapped { imported, skipped } lead list
 */
function mapRowsLocally(rows, mapping) {
  const imported = [];
  const skipped = [];

  const allowedStatuses = ['GOOD_LEAD_FOLLOW_UP', 'DID_NOT_CONNECT', 'BAD_LEAD', 'SALE_DONE'];
  const allowedSources = ['leads_on_demand', 'meridian_tower', 'eden_park', 'varah_swamy', 'sarjapur_plots'];

  rows.forEach((row, idx) => {
    // Helper to get field value safely
    const getValue = (fieldKey) => {
      const headerName = mapping[fieldKey];
      if (!headerName) return '';
      
      if (Array.isArray(headerName)) {
        return headerName
          .map(h => (row[h] || '').trim())
          .filter(Boolean)
          .join(' ');
      }
      return (row[headerName] || '').trim();
    };

    // 1. Name
    const name = getValue('name');

    // 2. Email parsing
    let email = '';
    const rawEmailCol = getValue('email');
    let extraEmails = [];
    if (rawEmailCol) {
      const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
      const matches = rawEmailCol.match(emailRegex);
      if (matches && matches.length > 0) {
        email = matches[0];
        if (matches.length > 1) {
          extraEmails = matches.slice(1);
        }
      } else {
        email = rawEmailCol;
      }
    }

    // 3. Phone parsing
    let phoneVal = getValue('mobile_without_country_code');
    let countryCode = getValue('country_code');
    let extraPhones = [];

    if (phoneVal) {
      // Split multiple numbers in single cell (comma, slash, or space separated)
      const splits = phoneVal.split(/[,/;\s]+/);
      if (splits.length > 1) {
        phoneVal = splits[0];
        extraPhones = splits.slice(1);
      }
      
      const cleanPhone = phoneVal.replace(/[^0-9+]/g, '');
      if (cleanPhone.startsWith('+')) {
        const match = cleanPhone.match(/^\+(\d{1,3})(\d{7,10})$/);
        if (match) {
          countryCode = '+' + match[1];
          phoneVal = match[2];
        } else {
          if (cleanPhone.startsWith('+91')) {
            countryCode = '+91';
            phoneVal = cleanPhone.substring(3);
          } else if (cleanPhone.startsWith('+1')) {
            countryCode = '+1';
            phoneVal = cleanPhone.substring(2);
          } else {
            phoneVal = cleanPhone;
          }
        }
      } else {
        const digits = cleanPhone.replace(/\D/g, '');
        if (digits.length > 10 && (digits.startsWith('91') || digits.startsWith('1'))) {
          if (digits.startsWith('91')) {
            countryCode = '+91';
            phoneVal = digits.substring(2);
          } else {
            countryCode = '+1';
            phoneVal = digits.substring(1);
          }
        } else {
          phoneVal = digits;
        }
      }
    }

    // 4. Skip Invalid Records: If a record contains neither email nor mobile, skip it
    if (!email && !phoneVal) {
      skipped.push({
        reason: 'Record lacks both email and mobile number',
        originalRecord: row,
        mappedRecord: { name },
      });
      return;
    }

    // 5. Mapped Date Format
    let createdAt = getValue('created_at');
    if (createdAt) {
      const testDate = new Date(createdAt);
      if (isNaN(testDate.getTime())) {
        createdAt = new Date().toISOString().replace('T', ' ').substring(0, 19);
      } else {
        // Format: YYYY-MM-DD HH:MM:SS
        const pad = (num) => String(num).padStart(2, '0');
        createdAt = `${testDate.getFullYear()}-${pad(testDate.getMonth() + 1)}-${pad(testDate.getDate())} ${pad(testDate.getHours())}:${pad(testDate.getMinutes())}:${pad(testDate.getSeconds())}`;
      }
    } else {
      const testDate = new Date();
      const pad = (num) => String(num).padStart(2, '0');
      createdAt = `${testDate.getFullYear()}-${pad(testDate.getMonth() + 1)}-${pad(testDate.getDate())} ${pad(testDate.getHours())}:${pad(testDate.getMinutes())}:${pad(testDate.getSeconds())}`;
    }

    // 6. CRM Status validation
    let crmStatus = getValue('crm_status');
    if (crmStatus) {
      const cleanInputStatus = crmStatus.replace(/[\s_]/g, '').toLowerCase();
      const match = allowedStatuses.find(s => {
        const cleanStandardStatus = s.replace(/_/g, '').toLowerCase();
        return cleanStandardStatus === cleanInputStatus || cleanStandardStatus.includes(cleanInputStatus) || cleanInputStatus.includes(cleanStandardStatus);
      });
      crmStatus = match || '';
    }

    // 7. Data Source validation
    let dataSource = getValue('data_source');
    if (dataSource) {
      const cleanInputSource = dataSource.replace(/[\s_]/g, '').toLowerCase();
      const match = allowedSources.find(s => {
        const cleanStandardSource = s.replace(/_/g, '').toLowerCase();
        return cleanStandardSource === cleanInputSource || cleanStandardSource.includes(cleanInputSource);
      });
      dataSource = match || '';
    }

    // 8. Notes collection
    let crmNote = getValue('crm_note');
    
    // Add extra emails/phones to notes
    if (extraEmails.length > 0) {
      crmNote += (crmNote ? ' | ' : '') + `Extra Email(s): ${extraEmails.join(', ')}`;
    }
    if (extraPhones.length > 0) {
      crmNote += (crmNote ? ' | ' : '') + `Extra Mobile(s): ${extraPhones.join(', ')}`;
    }

    // Add unmapped columns to note so we don't lose any data!
    const mappedHeaders = new Set();
    Object.values(mapping).forEach(val => {
      if (Array.isArray(val)) {
        val.forEach(v => mappedHeaders.add(v));
      } else if (val) {
        mappedHeaders.add(val);
      }
    });

    const unmappedInfo = [];
    Object.keys(row).forEach(key => {
      if (!mappedHeaders.has(key) && row[key]) {
        unmappedInfo.push(`${key}: ${row[key]}`);
      }
    });

    if (unmappedInfo.length > 0) {
      crmNote += (crmNote ? ' | ' : '') + `Other Data: ${unmappedInfo.join(', ')}`;
    }

    // Escape any newlines for clean CSV output compatibility
    if (crmNote) {
      crmNote = crmNote.replace(/\n/g, '\\n').replace(/\r/g, '');
    }

    imported.push({
      created_at: createdAt,
      name: name || 'Unknown Lead',
      email: email,
      country_code: countryCode || '',
      mobile_without_country_code: phoneVal || '',
      company: getValue('company'),
      city: getValue('city'),
      state: getValue('state'),
      country: getValue('country'),
      lead_owner: getValue('lead_owner'),
      crm_status: crmStatus,
      crm_note: crmNote,
      data_source: dataSource,
      possession_time: getValue('possession_time'),
      description: getValue('description')
    });
  });

  return { imported, skipped };
}

module.exports = {
  identifySchemaMapping,
  mapRowsLocally,
};
