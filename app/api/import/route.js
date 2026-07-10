import { NextResponse } from 'next/server';
import { identifySchemaMapping, mapRowsLocally } from '../../utils/groqService';

export async function POST(req) {
  try {
    const { rows } = await req.json();

    if (!rows || !Array.isArray(rows)) {
      return NextResponse.json(
        { error: 'Invalid payload: "rows" must be an array of records.' },
        { status: 400 }
      );
    }

    if (rows.length === 0) {
      return NextResponse.json({
        success: true,
        imported: [],
        skipped: [],
        totalImported: 0,
        totalSkipped: 0,
        totalProcessed: 0,
      });
    }

    // 1. Get CSV headers from the first record
    const headers = Object.keys(rows[0]);

    // 2. Get first 3 rows as samples for data shape context
    const sampleRows = rows.slice(0, 3);

    console.log('Serverless: Sending CSV structure to Groq for header mapping analysis...');
    
    // 3. Request schema mapping from Groq AI (one call only!)
    const mapping = await identifySchemaMapping(headers, sampleRows);
    console.log('Serverless: Groq AI mapped headers successfully:', mapping);

    // 4. Map all rows locally programmatically (fast, zero rate limits!)
    const { imported, skipped } = mapRowsLocally(rows, mapping);
    console.log(`Serverless: Mapping complete. Imported: ${imported.length}, Skipped: ${skipped.length}`);

    return NextResponse.json({
      success: true,
      imported,
      skipped,
      totalImported: imported.length,
      totalSkipped: skipped.length,
      totalProcessed: rows.length,
      mappingUsed: mapping,
    });
  } catch (error) {
    console.error('Error in API import route:', error);
    return NextResponse.json(
      { error: 'An error occurred during AI mapping processing: ' + error.message },
      { status: 500 }
    );
  }
}
