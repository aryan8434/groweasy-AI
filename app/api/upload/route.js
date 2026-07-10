import { NextResponse } from 'next/server';

/**
 * Custom Vanilla CSV Parser for Next.js Serverless API Route.
 * Handles commas in quotes, escaped quotes, and newlines.
 * @param {string} text - Raw CSV file content
 * @returns {Array<Object>} - Parsed records as JSON objects
 */
function parseCSVText(text) {
  const lines = [];
  let row = [];
  let inQuotes = false;
  let currentValue = '';

  // Normalize line endings
  const cleanText = text.replace(/\r/g, '');

  for (let i = 0; i < cleanText.length; i++) {
    const char = cleanText[i];
    const nextChar = cleanText[i + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        currentValue += '"';
        i++; // skip escaped quote character
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      row.push(currentValue.trim());
      currentValue = '';
    } else if (char === '\n' && !inQuotes) {
      row.push(currentValue.trim());
      if (row.some(val => val !== '')) {
        lines.push(row);
      }
      row = [];
      currentValue = '';
    } else {
      currentValue += char;
    }
  }

  // Handle remaining buffer
  if (currentValue !== '' || row.length > 0) {
    row.push(currentValue.trim());
    if (row.some(val => val !== '')) {
      lines.push(row);
    }
  }

  if (lines.length === 0) return [];

  // Map into objects using headers from first row
  const headers = lines[0].map(h => h.trim());
  const result = [];

  for (let i = 1; i < lines.length; i++) {
    const currentLine = lines[i];
    const obj = {};
    headers.forEach((header, index) => {
      obj[header] = currentLine[index] !== undefined ? currentLine[index] : '';
    });
    result.push(obj);
  }

  return result;
}

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get('file');

    if (!file) {
      return NextResponse.json(
        { error: 'No file uploaded. Please upload a valid CSV file.' },
        { status: 400 }
      );
    }

    const text = await file.text();
    const parsedRows = parseCSVText(text);

    return NextResponse.json({
      filename: file.name,
      rowCount: parsedRows.length,
      rows: parsedRows,
    });
  } catch (error) {
    console.error('Error in API upload route:', error);
    return NextResponse.json(
      { error: 'Failed to parse CSV file: ' + error.message },
      { status: 500 }
    );
  }
}
