'use client';

import React, { useState, useRef, useEffect } from 'react';
import { 
  UploadCloud, 
  FileSpreadsheet, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight, 
  ArrowLeft, 
  Trash2, 
  Sparkles, 
  Clock, 
  Database,
  Building,
  MapPin,
  Mail,
  Phone,
  User,
  ShieldCheck,
  Sun,
  Moon
} from 'lucide-react';

export default function CSVImporterHome() {
  const [step, setStep] = useState(1);
  const [file, setFile] = useState(null);
  const [theme, setTheme] = useState('dark');
  const [engine, setEngine] = useState('groq'); // 'groq' | 'gemini'

  useEffect(() => {
    document.body.className = theme === 'light' ? 'light-theme' : '';
  }, [theme]);
  const [dragOver, setDragOver] = useState(false);
  const [rawFilename, setRawFilename] = useState('');
  const [rawRows, setRawRows] = useState([]);
  const [importResult, setImportResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('imported'); // 'imported' | 'skipped'
  
  // Loading sub-steps simulation
  const [currentLoadingStep, setCurrentLoadingStep] = useState(0);
  const loadingSteps = engine === 'gemini' ? [
    'Initializing Gemini AI engine mapping...',
    'Uploading CSV rows to extraction service...',
    'Matching header layouts to CRM schema (using gemini-3.5-flash)...',
    'Injecting dates, data source origins, and lead notes...',
    'Applying CRM validation filters (skipping invalid entries)...',
    'Compiling final structured JSON response...'
  ] : [
    'Initializing Groq AI engine mapping...',
    'Uploading CSV rows to extraction service...',
    'Matching header layouts to CRM schema (using llama-3.3-70b-versatile)...',
    'Injecting dates, data source origins, and lead notes...',
    'Applying CRM validation filters (skipping invalid entries)...',
    'Compiling final structured JSON response...'
  ];

  const fileInputRef = useRef(null);

  // Auto-advance loading steps for visual feedback during Step 3
  useEffect(() => {
    let interval;
    if (loading && step === 3) {
      setCurrentLoadingStep(0);
      interval = setInterval(() => {
        setCurrentLoadingStep((prev) => {
          if (prev < loadingSteps.length - 1) {
            return prev + 1;
          }
          return prev;
        });
      }, 2000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [loading, step]);

  // Handle Drag Over
  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  // Handle Drag Leave
  const handleDragLeave = () => {
    setDragOver(false);
  };

  // Handle Drop
  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      processFile(files[0]);
    }
  };

  // Handle File Selector
  const handleFileChange = (e) => {
    const files = e.target.files;
    if (files.length > 0) {
      processFile(files[0]);
    }
  };

  // Upload raw CSV to Parse (Step 2 - Raw Preview)
  const processFile = async (selectedFile) => {
    if (!selectedFile.name.endsWith('.csv')) {
      setError('Invalid file format. Please upload a valid CSV file (.csv).');
      return;
    }
    
    setError(null);
    setFile(selectedFile);
    setLoading(true);

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to upload and parse CSV.');
      }

      const data = await response.json();
      setRawFilename(data.filename);
      setRawRows(data.rows);
      setStep(2); // Advance to preview
    } catch (err) {
      console.error(err);
      setError(err.message || 'An error occurred while parsing the CSV.');
    } finally {
      setLoading(false);
    }
  };

  // Confirm Import (Step 3 -> Step 4 - AI Mapped Result)
  const handleConfirmImport = async () => {
    setError(null);
    setLoading(true);
    setStep(3); // Go to loading screen

    try {
      const response = await fetch('/api/import', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ rows: rawRows, engine }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to map CSV with AI.');
      }

      const data = await response.json();
      setImportResult(data);
      setStep(4); // Show metrics & mapping table
    } catch (err) {
      console.error(err);
      setError(err.message || 'An error occurred during AI mapping.');
      setStep(2); // Go back to preview if there's an error
    } finally {
      setLoading(false);
    }
  };

  // Reset and upload again
  const handleReset = () => {
    setFile(null);
    setRawFilename('');
    setRawRows([]);
    setImportResult(null);
    setError(null);
    setStep(1);
  };

  // Helper to load mock CSV data to bypass browser upload limitation
  const loadDemoData = (type) => {
    let csvContent = '';
    let filename = '';

    if (type === 'facebook') {
      filename = 'demo_facebook_leads.csv';
      csvContent = `created_time,full_name,email_address,phone_number,company_name,city_location,status_code,source,comments
2026-05-13 14:20:48,John Doe,john.doe@example.com,+91 9876543210,GrowEasy,Mumbai,GOOD_LEAD_FOLLOW_UP,leads_on_demand,Client is asking to reschedule demo
2026-05-13 14:25:30,Sarah Johnson,sarah.johnson@example.com,+91 9876543211,Tech Solutions,Bangalore,DID_NOT_CONNECT,meridian_tower,Person was busy
2026-05-13 14:30:15,Rajesh Patel,rajesh.patel@example.com,+91 9876543212,Startup Inc,Delhi,BAD_LEAD,eden_park,Not interested in our services
2026-05-13 14:35:22,Priya Singh,priya.singh@example.com,+91 9876543213,Enterprise Corp,Pune,SALE_DONE,varah_swamy,Deal closed onboarding in progress`;
    } else if (type === 'google') {
      filename = 'demo_google_ads_leads.csv';
      csvContent = `date,client_name,primary_email,contact_no,company,city_name,state_name,country_name,owner,lead_status,comments_notes,possession_timeline,lead_desc
05/13/2026 14:20:48,Amit Sharma,amit.sharma@example.com,9876543214,GrowEasy,Mumbai,Maharashtra,India,test@gmail.com,GOOD_LEAD_FOLLOW_UP,Needs details on residential plots,Ready to move,Client interested in 2BHK flat
05/13/2026 14:25:30,Vikram Malhotra,vikram@example.com,9876543215,Alpha Corp,Gurugram,Haryana,India,test@gmail.com,DID_NOT_CONNECT,Call back tomorrow,,
05/13/2026 14:30:15,Karan Johar,karan@example.com,9876543216,Dharma,Mumbai,Maharashtra,India,test@gmail.com,BAD_LEAD,Incorrect phone number,1 year,Wrong number dialled
05/13/2026 14:35:22,Meera Sen,meera@example.com,9876543217,TCS,Kolkata,West Bengal,India,test@gmail.com,SALE_DONE,Booking advance received,Immediate,Paid token money`;
    } else if (type === 'invalid') {
      filename = 'demo_invalid_leads.csv';
      csvContent = `name,email,mobile,company
John Doe,john.doe@example.com,9876543210,GrowEasy
Sarah Parker,,,Tech Solutions
Rajesh Patel,rajesh.patel@example.com,,Startup Inc
Priya Singh,,9876543213,Enterprise Corp
No Contact Lead,,,No Company`;
    }

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const mockFile = new File([blob], filename, { type: 'text/csv' });
    processFile(mockFile);
  };

  return (
    <div className="app-container">
      {/* Header */}
      <header className="app-header">
        <div className="logo-section">
          <div className="logo-icon">GE</div>
          <div>
            <h1 className="logo-text">GrowEasy CRM</h1>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>AI-Powered Smart Lead Hub</p>
          </div>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          {/* Groq API Expiry Notice Badge */}
          <div className="api-badge">
            <span className="pulse-indicator"></span>
            <span>Groq AI Key active (valid till 9 Aug 2026)</span>
          </div>

          {/* Theme Selector wrapper with clear descriptive text */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: '600' }}>
              {theme === 'dark' ? 'Dark Mode Enabled' : 'Light Mode Enabled'}
            </span>
            {/* Theme Toggle Button */}
            <button 
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="btn btn-secondary"
              style={{ padding: '0.5rem', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              id="theme-toggle"
            >
              {theme === 'dark' ? <Sun size={18} style={{ color: '#fbbf24' }} /> : <Moon size={18} style={{ color: '#6366f1' }} />}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main>
        {error && (
          <div className="alert-card alert-danger" id="error-banner">
            <AlertTriangle size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>
              <strong>Error encountered:</strong> {error}
            </div>
          </div>
        )}

        {/* STEP 1: UPLOAD FILE */}
        {step === 1 && (
          <div className="glass-card" id="step-1-card">
            <div className="intro-grid">
              <div>
                <span className="step-indicator">Step 1 of 4</span>
                <h2 className="step-title">Upload Raw CSV leads</h2>
                <p className="step-description">
                  Upload any leads file (Facebook leads, Google ads, Excel spreadsheets, or agency reports). 
                  Our system will automatically map the layouts using Groq's high-speed AI.
                </p>
                <ul className="instruction-list">
                  <li>Handles random headers (e.g. "Mail ID", "Ph No", "Client Name")</li>
                  <li>Extracts up to 15 key CRM fields</li>
                  <li>Skips invalid leads (leads with no email and no phone)</li>
                  <li>Cleans dates and fits allowed CRM status tags</li>
                </ul>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <div className="metric-card" style={{ borderLeft: '4px solid var(--accent-primary)' }}>
                  <span className="metric-label">Supported Fields</span>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginTop: '0.5rem' }}>
                    {['name', 'email', 'mobile', 'country', 'crm_status', 'crm_note', 'data_source'].map((f) => (
                      <span key={f} className="badge badge-info" style={{ fontSize: '0.7rem' }}>{f}</span>
                    ))}
                    <span className="badge badge-info" style={{ fontSize: '0.7rem' }}>+ 8 more</span>
                  </div>
                </div>
              </div>
            </div>

            <div 
              className={`upload-zone ${dragOver ? 'dragging' : ''}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              id="upload-dropzone"
              style={{ marginTop: '2rem' }}
            >
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                accept=".csv" 
                className="file-input"
                id="csv-file-picker"
              />
              <div className="upload-icon-wrapper">
                {loading ? (
                  <div className="spinner" style={{ width: '32px', height: '32px' }}></div>
                ) : (
                  <UploadCloud size={32} />
                )}
              </div>
              <div>
                <p className="upload-action-text">
                  {loading ? 'Uploading and parsing file...' : 'Drag & Drop your CSV file here'}
                </p>
                <p className="upload-sub-text">
                  {!loading && 'or click to browse local files (CSV format only)'}
                </p>
              </div>
            </div>

            {/* Demo Files Utility */}
            <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ height: '1px', width: '100%', background: 'var(--border-color)', margin: '0.5rem 0' }}></div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <ShieldCheck size={14} style={{ color: 'var(--accent-primary)' }} />
                  Quick Demo:
                </span>
                <button 
                  className="btn btn-secondary" 
                  style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', borderRadius: '6px' }}
                  onClick={() => loadDemoData('facebook')}
                  id="btn-demo-facebook"
                >
                  Facebook Leads
                </button>
                <button 
                  className="btn btn-secondary" 
                  style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', borderRadius: '6px' }}
                  onClick={() => loadDemoData('google')}
                  id="btn-demo-google"
                >
                  Google Ads
                </button>
                <button 
                  className="btn btn-secondary" 
                  style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', borderRadius: '6px' }}
                  onClick={() => loadDemoData('invalid')}
                  id="btn-demo-invalid"
                >
                  Invalid leads (Filter Test)
                </button>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: PREVIEW RAW CSV */}
        {step === 2 && (
          <div className="glass-card" id="step-2-card">
            <div className="step-header">
              <div>
                <span className="step-indicator">Step 2 of 4</span>
                <h2 className="step-title">Preview File Contents</h2>
                <p className="step-description">
                  Found <strong>{rawRows.length}</strong> rows inside <code>{rawFilename}</code>. No AI processing has started.
                </p>
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', minWidth: '160px' }}>
                  <label htmlFor="ai-engine-select" style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: '600' }}>
                    Select AI Engine:
                  </label>
                  <select
                    id="ai-engine-select"
                    value={engine}
                    onChange={(e) => setEngine(e.target.value)}
                    style={{
                      padding: '0.5rem 1rem',
                      borderRadius: '8px',
                      background: 'var(--bg-tertiary)',
                      color: 'var(--text-primary)',
                      border: '1px solid var(--border-color)',
                      fontFamily: 'var(--font-body)',
                      fontSize: '0.85rem',
                      fontWeight: '600',
                      cursor: 'pointer',
                      outline: 'none',
                    }}
                  >
                    <option value="groq">Groq AI (Llama 3.3)</option>
                    <option value="gemini">Gemini AI (3.5 Flash)</option>
                  </select>
                </div>
                
                <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.25rem' }}>
                  <button className="btn btn-secondary" onClick={handleReset} id="btn-back-upload">
                    <ArrowLeft size={16} /> Back to Upload
                  </button>
                  <button className="btn btn-primary" onClick={handleConfirmImport} id="btn-confirm-import">
                    <Sparkles size={16} /> Confirm Import (Process AI)
                  </button>
                </div>
              </div>
            </div>

            {rawRows.length > 0 ? (
              <div className="table-container" id="raw-preview-table-container">
                <table className="responsive-table" id="raw-preview-table">
                  <thead>
                    <tr>
                      {Object.keys(rawRows[0]).map((header) => (
                        <th key={header}>{header}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {rawRows.map((row, idx) => (
                      <tr key={idx}>
                        {Object.values(row).map((val, cellIdx) => (
                          <td key={cellIdx} title={String(val)}>
                            {String(val) || <em style={{ color: 'var(--text-muted)' }}>null</em>}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div style={{ padding: '2rem', textAlignment: 'center', color: 'var(--text-muted)' }}>
                No rows found in the parsed file.
              </div>
            )}
          </div>
        )}

        {/* STEP 3: CONFIRM & PROCESSING (LOADING STEP) */}
        {step === 3 && (
          <div className="glass-card" id="step-3-card" style={{ maxWidth: '650px', margin: '0 auto' }}>
            <div className="loader-wrapper">
              <div className="spinner"></div>
              <h2 className="step-title" style={{ textAlign: 'center', fontSize: '1.5rem' }}>
                Extracting Leads using {engine === 'gemini' ? 'Gemini' : 'Groq'} AI
              </h2>
              <p style={{ color: 'var(--text-secondary)', textAlign: 'center', fontSize: '0.9rem' }}>
                {engine === 'gemini' 
                  ? "Gemini's 3.5 Flash model is parsing structures, validating columns, and cleansing your data. Please don't close this window."
                  : "Groq's Llama 3.3 model is parsing structures, validating columns, and cleansing your data. Please don't close this window."
                }
              </p>

              <div className="loading-steps">
                {loadingSteps.map((loadingText, idx) => {
                  let statusClass = '';
                  if (idx < currentLoadingStep) statusClass = 'done';
                  else if (idx === currentLoadingStep) statusClass = 'active';
                  
                  return (
                    <div key={idx} className={`loading-step-item ${statusClass}`}>
                      <span className="loading-dot"></span>
                      <span>{loadingText}</span>
                    </div>
                  );
                })}
              </div>
              <button 
                className="btn btn-secondary" 
                onClick={handleReset} 
                style={{ marginTop: '1.5rem', width: '100%', justifyContent: 'center', gap: '0.5rem' }}
                id="btn-cancel-loading"
              >
                <ArrowLeft size={16} /> Cancel & Go Back
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: DISPLAY PARSED RESULTS */}
        {step === 4 && importResult && (
          <div className="glass-card" id="step-4-card">
            <div className="step-header">
              <div>
                <span className="step-indicator">Step 4 of 4</span>
                <h2 className="step-title">AI Lead Mapping Complete</h2>
                <p className="step-description">
                  Groq AI mapped records successfully and parsed them into the GrowEasy CRM database layout.
                </p>
              </div>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button className="btn btn-secondary" onClick={handleReset} id="btn-back-home">
                  <ArrowLeft size={16} /> Back to Home
                </button>
                <button className="btn btn-primary" onClick={handleReset} id="btn-import-new">
                  <UploadCloud size={16} /> Import Another File
                </button>
              </div>
            </div>

            {/* Metrics Dashboard */}
            <div className="metrics-grid">
              <div className="metric-card">
                <span className="metric-label">Total Processed</span>
                <span className="metric-value" id="val-processed">{importResult.totalProcessed}</span>
              </div>
              <div className="metric-card success">
                <span className="metric-label">Successfully Imported</span>
                <span className="metric-value" id="val-imported">{importResult.totalImported}</span>
              </div>
              <div className="metric-card skipped">
                <span className="metric-label">Skipped (Invalid)</span>
                <span className="metric-value" id="val-skipped">{importResult.totalSkipped}</span>
              </div>
            </div>

            {/* Tabs for Mapped vs Skipped */}
            <div className="tab-navigation">
              <button 
                className={`tab-btn ${activeTab === 'imported' ? 'active' : ''}`}
                onClick={() => setActiveTab('imported')}
                id="tab-imported-leads"
              >
                Imported Leads ({importResult.totalImported})
              </button>
              <button 
                className={`tab-btn ${activeTab === 'skipped' ? 'active' : ''}`}
                onClick={() => setActiveTab('skipped')}
                id="tab-skipped-leads"
              >
                Skipped Leads ({importResult.totalSkipped})
              </button>
            </div>

            {/* Tab contents */}
            {activeTab === 'imported' && (
              <div>
                {importResult.imported.length > 0 ? (
                  <div className="table-container" id="imported-table-container">
                    <table className="responsive-table" id="imported-leads-table">
                      <thead>
                        <tr>
                          <th>Lead Name</th>
                          <th>Email Address</th>
                          <th>Mobile</th>
                          <th>Status</th>
                          <th>Origin / Source</th>
                          <th>Lead Owner</th>
                          <th>Location</th>
                          <th>Company</th>
                          <th>Created At</th>
                          <th>CRM Notes</th>
                          <th>Possession Time</th>
                        </tr>
                      </thead>
                      <tbody>
                        {importResult.imported.map((lead, idx) => (
                          <tr key={idx}>
                            <td style={{ fontWeight: 600, color: 'white' }}>{lead.name || '—'}</td>
                            <td>
                              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                                <Mail size={12} style={{ color: 'var(--text-muted)' }} />
                                {lead.email || '—'}
                              </span>
                            </td>
                            <td>
                              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                                <Phone size={12} style={{ color: 'var(--text-muted)' }} />
                                {lead.country_code ? `${lead.country_code} ` : ''}{lead.mobile_without_country_code || '—'}
                              </span>
                            </td>
                            <td>
                              {lead.crm_status ? (
                                <span className={`badge status-${lead.crm_status}`}>
                                  {lead.crm_status}
                                </span>
                              ) : (
                                <em style={{ color: 'var(--text-muted)' }}>blank</em>
                              )}
                            </td>
                            <td>
                              {lead.data_source ? (
                                <span className="badge badge-info">
                                  {lead.data_source}
                                </span>
                              ) : (
                                <em style={{ color: 'var(--text-muted)' }}>blank</em>
                              )}
                            </td>
                            <td>{lead.lead_owner || '—'}</td>
                            <td>
                              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                                <MapPin size={12} style={{ color: 'var(--text-muted)' }} />
                                {[lead.city, lead.state, lead.country].filter(Boolean).join(', ') || '—'}
                              </span>
                            </td>
                            <td>{lead.company || '—'}</td>
                            <td>
                              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                                <Clock size={12} style={{ color: 'var(--text-muted)' }} />
                                {lead.created_at ? new Date(lead.created_at).toLocaleString() : '—'}
                              </span>
                            </td>
                            <td title={lead.crm_note}>
                              {lead.crm_note ? (
                                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                                  {lead.crm_note}
                                </span>
                              ) : '—'}
                            </td>
                            <td>{lead.possession_time || '—'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div style={{ padding: '3rem 1rem', textAlignment: 'center', color: 'var(--text-muted)' }}>
                    No leads were successfully imported from this CSV.
                  </div>
                )}
              </div>
            )}

            {activeTab === 'skipped' && (
              <div>
                {importResult.skipped.length > 0 ? (
                  <div className="table-container" id="skipped-table-container">
                    <table className="responsive-table" id="skipped-leads-table">
                      <thead>
                        <tr>
                          <th>Index</th>
                          <th>Skipped Reason</th>
                          <th>Raw CSV Row Content</th>
                        </tr>
                      </thead>
                      <tbody>
                        {importResult.skipped.map((skipItem, idx) => (
                          <tr key={idx}>
                            <td>#{idx + 1}</td>
                            <td>
                              <span className="badge badge-danger">
                                {skipItem.reason}
                              </span>
                            </td>
                            <td title={JSON.stringify(skipItem.originalRecord)}>
                              <code style={{ fontSize: '0.8rem', color: 'var(--accent-secondary)' }}>
                                {JSON.stringify(skipItem.originalRecord)}
                              </code>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div style={{ padding: '3rem 1rem', textAlignment: 'center', color: 'var(--text-muted)' }}>
                    Great! No leads were skipped.
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="footer">
        <p style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'center' }}>
          <span>© 2026 GrowEasy CRM. Protected by Enterprise Grade AI Mapping.</span>
          <span style={{ color: 'var(--text-secondary)', fontWeight: '500', fontSize: '0.8rem' }}>
            Made by <span style={{ color: 'var(--accent-primary)', fontWeight: '700' }}>Aryan Kumar Raj</span> as an assignment project
          </span>
        </p>
      </footer>
    </div>
  );
}
