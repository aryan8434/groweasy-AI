'use client';

import React, { useState, useRef, useEffect } from 'react';
import { 
  UploadCloud, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowLeft, 
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
  Moon,
  LayoutDashboard,
  Zap,
  Users,
  Radio,
  CreditCard,
  MessageCircle,
  Code,
  Search,
  RefreshCw,
  Download,
  X,
  ChevronRight,
  HelpCircle,
  FileSpreadsheet
} from 'lucide-react';

export default function CRMImporterApp() {
  const [activeMenu, setActiveMenu] = useState('Manage Leads');
  const [theme, setTheme] = useState('dark');
  const [engine, setEngine] = useState('groq'); // 'groq' | 'gemini'
  
  // Leads Database State - Initialized with default leads matching the screenshots
  const [leadsList, setLeadsList] = useState([
    {
      created_at: '2026-06-23 14:37:00',
      name: 'punnnf g',
      email: 'kjgkhv2@gcghc.com',
      country_code: '+91',
      mobile_without_country_code: '7894561177',
      company: '',
      crm_status: 'Sale Done',
      lead_owner: 'agent_peter@groweasy.com',
      city: 'Mumbai',
      state: 'Maharashtra',
      country: 'India',
      crm_note: 'Client is interested in plots',
      data_source: 'Eden Park',
      possession_time: 'Immediate',
      description: 'Interested in properties'
    },
    {
      created_at: '2026-06-23 12:23:00',
      name: 'kjjkvkh',
      email: 'jkhbkbn@hjf.hfv',
      country_code: '+91',
      mobile_without_country_code: '1212121415',
      company: 'fhtf',
      crm_status: 'Not Dialed',
      lead_owner: 'agent_john@groweasy.com',
      city: 'Delhi',
      state: 'Delhi',
      country: 'India',
      crm_note: 'No response from call',
      data_source: 'Leads on Demand',
      possession_time: '',
      description: ''
    },
    {
      created_at: '2026-06-23 12:17:00',
      name: 'kugkkh',
      email: 'ljgbjg@hgdh.hjc',
      country_code: '+91',
      mobile_without_country_code: '1212121217',
      company: 'fhtf',
      crm_status: 'Not Dialed',
      lead_owner: 'agent_john@groweasy.com',
      city: 'Delhi',
      state: 'Delhi',
      country: 'India',
      crm_note: '',
      data_source: 'Meridian Tower',
      possession_time: '',
      description: ''
    },
    {
      created_at: '2026-06-23 12:16:00',
      name: 'hjvjv',
      email: 'jfgf@fgd.com',
      country_code: '+91',
      mobile_without_country_code: '1515151515',
      company: 'fhtf',
      crm_status: 'Good Lead',
      lead_owner: 'agent_sarah@groweasy.com',
      city: 'Bangalore',
      state: 'Karnataka',
      country: 'India',
      crm_note: 'Requested quotation',
      data_source: 'Eden Park',
      possession_time: 'Ready to Move',
      description: ''
    },
    {
      created_at: '2026-06-23 11:01:00',
      name: 'Abhraneel Dhar',
      email: 'abhraneeldhar7@groweasy.com',
      country_code: '+91',
      mobile_without_country_code: '9051589728',
      company: 'groweasy',
      crm_status: 'Good Lead',
      lead_owner: 'agent_peter@groweasy.com',
      city: 'Kolkata',
      state: 'West Bengal',
      country: 'India',
      crm_note: 'Wants Site Visit on Saturday',
      data_source: 'Leads on Demand',
      possession_time: '1 Year',
      description: 'Looking for a flat in Sarjapur plots'
    },
    {
      created_at: '2026-06-22 16:49:00',
      name: 'fhjf ghf',
      email: 'tjrf.ft@gfjj.com',
      country_code: '+91',
      mobile_without_country_code: '1414141414',
      company: 'thr rh',
      crm_status: 'Not Dialed',
      lead_owner: 'agent_sarah@groweasy.com',
      city: 'Delhi',
      state: 'Delhi',
      country: 'India',
      crm_note: '',
      data_source: 'Eden Park',
      possession_time: '',
      description: ''
    },
    {
      created_at: '2026-06-22 16:48:00',
      name: 'fhf',
      email: 'gnhfg@fgjf.com',
      country_code: '+91',
      mobile_without_country_code: '1313131313',
      company: 'fhtf',
      crm_status: 'Not Dialed',
      lead_owner: 'agent_john@groweasy.com',
      city: 'Pune',
      state: 'Maharashtra',
      country: 'India',
      crm_note: '',
      data_source: 'Varah Swamy',
      possession_time: '',
      description: ''
    },
    {
      created_at: '2026-06-22 16:44:00',
      name: 'Abc 1',
      email: 'abc1@kryf.com',
      country_code: '+91',
      mobile_without_country_code: '1212121212',
      company: '',
      crm_status: 'Not Dialed',
      lead_owner: 'agent_peter@groweasy.com',
      city: 'Pune',
      state: 'Maharashtra',
      country: 'India',
      crm_note: '',
      data_source: 'Leads on Demand',
      possession_time: '',
      description: ''
    }
  ]);

  // Sidebar menus config
  const menuCategories = [
    {
      title: 'Main',
      items: [
        { name: 'Dashboard', icon: LayoutDashboard },
        { name: 'Generate Leads', icon: Zap },
        { name: 'Manage Leads', icon: Users },
        { name: 'Engage Leads', icon: MessageCircle }
      ]
    },
    {
      title: 'Control Center',
      items: [
        { name: 'Team Members', icon: Users },
        { name: 'Lead Sources', icon: Radio },
        { name: 'Ad Accounts', icon: CreditCard },
        { name: 'WhatsApp Account', icon: MessageCircle },
        { name: 'Tele Calling', icon: Phone },
        { name: 'CRM Fields', icon: SlidersCustom },
        { name: 'API Center', icon: Code }
      ]
    }
  ];

  // Custom Icon placeholder for CRM Fields
  function SlidersCustom(props) {
    return <Database {...props} />;
  }

  // Search and filter query state
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modal states
  const [showImportModal, setShowImportModal] = useState(false);
  const [modalStep, setModalStep] = useState(1); // 1: Dropzone, 2: Preview, 3: Processing, 4: Finished
  const [dragOver, setDragOver] = useState(false);
  const [file, setFile] = useState(null);
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

  // Sync theme
  useEffect(() => {
    document.body.className = theme === 'light' ? 'light-theme' : '';
  }, [theme]);

  // Loading stepper animation inside Modal (Step 3)
  useEffect(() => {
    let interval;
    if (loading && modalStep === 3) {
      setCurrentLoadingStep(0);
      interval = setInterval(() => {
        setCurrentLoadingStep((prev) => {
          if (prev < loadingSteps.length - 1) {
            return prev + 1;
          }
          return prev;
        });
      }, 1800);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [loading, modalStep, engine]);

  // Handle Drag & Drop
  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      processCSVFile(files[0]);
    }
  };

  const handleFileChange = (e) => {
    const files = e.target.files;
    if (files.length > 0) {
      processCSVFile(files[0]);
    }
  };

  // Upload file and parse raw CSV columns
  const processCSVFile = async (selectedFile) => {
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
      setModalStep(2); // Go to table preview inside the modal
    } catch (err) {
      console.error(err);
      setError(err.message || 'An error occurred while parsing the CSV.');
    } finally {
      setLoading(false);
    }
  };

  // Run AI processing pipeline (Step 3)
  const executeAIMapping = async () => {
    setError(null);
    setLoading(true);
    setModalStep(3); // Go to loader steps page inside the modal

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
      setModalStep(4); // Show metrics and tables
    } catch (err) {
      console.error(err);
      setError(err.message || 'An error occurred during AI mapping.');
      setModalStep(2); // Go back to raw preview inside modal on error
    } finally {
      setLoading(false);
    }
  };

  // Clear modal and close it
  const handleCloseModal = () => {
    // If successfully imported, merge imported leads into the main database!
    if (importResult && importResult.imported && importResult.imported.length > 0) {
      setLeadsList((prev) => [...importResult.imported, ...prev]);
    }
    
    // Reset modal state
    setFile(null);
    setRawFilename('');
    setRawRows([]);
    setImportResult(null);
    setError(null);
    setModalStep(1);
    setShowImportModal(false);
  };

  const handleResetModal = () => {
    setFile(null);
    setRawFilename('');
    setRawRows([]);
    setImportResult(null);
    setError(null);
    setModalStep(1);
  };

  // Load Demo Data bypass (simulating a CSV dropping)
  const loadDemoData = (type) => {
    let csvContent = '';
    let filename = '';

    if (type === 'facebook') {
      filename = 'CRM_leads_import_29th_june.csv';
      csvContent = `created_time,full_name,email_address,phone_number,company_name,city_location,status_code,source,comments
2026-06-29 10:00:00,Rahil Mohammad,rahil@test.com,91,9579290011,GrowEasy,Mumbai,GOOD_LEAD_FOLLOW_UP,leads_on_demand,Client is asking to reschedule demo
2026-06-29 10:00:00,Tarvinder Pal,tarvinderpal@beauty.com,91,9811362031,Tech Solutions,Bangalore,DID_NOT_CONNECT,meridian_tower,Person was busy
2026-06-29 10:00:00,Dhruv Bisht,,91,9711564021,Startup Inc,Delhi,BAD_LEAD,eden_park,Not interested in our services
2026-06-29 10:00:00,Amit Raheja,,91,9990110291,Enterprise Corp,Pune,SALE_DONE,varah_swamy,Deal closed onboarding in progress
2026-06-29 10:00:00,Amit Shetty,,91,8040742131,,Mumbai,GOOD_LEAD_FOLLOW_UP,leads_on_demand,Interested in our features
2026-06-29 10:00:00,Amit Singh,,91,7838091122,,Pune,Not Dialed,sarajapur_plots,Ready to move`;
    } else if (type === 'google') {
      filename = 'google_campaign_leads.csv';
      csvContent = `date,client_name,primary_email,contact_no,company,city_name,state_name,country_name,owner,lead_status,comments_notes,possession_timeline,lead_desc
2026-07-01 14:20:48,Vikram Malhotra,vikram@example.com,919876543215,Alpha Corp,Gurugram,Haryana,India,agent_sarah@groweasy.com,DID_NOT_CONNECT,Call back tomorrow,,
2026-07-01 14:35:22,Meera Sen,meera@example.com,919876543217,TCS,Kolkata,West Bengal,India,agent_peter@groweasy.com,SALE_DONE,Booking advance received,Immediate,Paid token money`;
    } else if (type === 'invalid') {
      filename = 'invalid_contact_leads.csv';
      csvContent = `name,email,mobile,company
John Doe,,,GrowEasy
Sarah Parker,sarah@tech.com,,Tech Solutions
No Contact Lead,,,No Company`;
    }

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const mockFile = new File([blob], filename, { type: 'text/csv' });
    processCSVFile(mockFile);
  };

  // Filtered Leads based on search bar
  const filteredLeads = leadsList.filter((lead) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      (lead.name || '').toLowerCase().includes(query) ||
      (lead.email || '').toLowerCase().includes(query) ||
      (lead.mobile_without_country_code || '').toLowerCase().includes(query) ||
      (lead.country_code || '').toLowerCase().includes(query) ||
      (lead.company || '').toLowerCase().includes(query)
    );
  });

  return (
    <div className="app-wrapper">
      {/* Sidebar Navigation */}
      <aside className="sidebar">
        <div className="sidebar-brand">
          <div className="sidebar-logo">
            <img
              src="/f3e5c6de-aaf0-4747-9768-bd472973ed2b.jpg"
              alt="AI CSV Analytics logo"
              className="sidebar-logo-image"
            />
          </div>
          <span className="sidebar-brand-name">GrowEasy</span>
        </div>

        <div className="sidebar-profile">
          <div className="profile-avatar">TC</div>
          <div className="profile-info">
            <h4 className="profile-name">Test Corp</h4>
            <span className="profile-role">Owner</span>
          </div>
          <ChevronRight size={14} style={{ color: 'var(--text-muted)' }} />
        </div>

        <div className="sidebar-menu-wrapper">
          {menuCategories.map((category) => (
            <div key={category.title}>
              <h5 className="sidebar-group-title">{category.title}</h5>
              <ul className="sidebar-nav">
                {category.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeMenu === item.name;
                  return (
                    <li key={item.name}>
                      <button 
                        className={`sidebar-link ${isActive ? 'active' : ''}`}
                        onClick={() => {
                          setActiveMenu(item.name);
                        }}
                      >
                        <Icon size={16} />
                        <span>{item.name}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="main-panel">
        <div className="main-container">
          {/* Header Panel */}
          <div className="panel-header">
            <div className="panel-header-info">
              <h2 className="panel-title">{activeMenu}</h2>
              <p className="panel-subtitle">
                {activeMenu === 'Manage Leads' && 'Monitor lead status, assign tasks, and close deals faster.'}
                {activeMenu === 'Lead Sources' && 'Connect, manage, and control all your lead channels from one dashboard.'}
                {activeMenu === 'Dashboard' && 'Comprehensive overview of your CRM leads performance and analytics.'}
                {activeMenu !== 'Manage Leads' && activeMenu !== 'Lead Sources' && activeMenu !== 'Dashboard' && 'Configure and view system settings.'}
              </p>
            </div>

            <div className="panel-actions">
              {/* API Status Badge */}
              <div className="api-badge">
                <span className="pulse-indicator"></span>
                <span>AI Agent Ready</span>
              </div>

              {/* Theme Toggle */}
              <button 
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="btn btn-secondary"
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                id="theme-toggle"
              >
                {theme === 'dark' ? <Sun size={16} style={{ color: '#fbbf24' }} /> : <Moon size={16} style={{ color: '#6366f1' }} />}
                <span>{theme === 'dark' ? 'Dark Mode' : 'Light Mode'}</span>
              </button>

              {/* Engine Selection Option */}
              <div className="engine-select-wrapper">
                <select
                  id="engine-select-dropdown"
                  value={engine}
                  onChange={(e) => setEngine(e.target.value)}
                  className="engine-select"
                >
                  <option value="groq">Groq AI (Llama 3.3)</option>
                  <option value="gemini">Gemini AI (3.5 Flash)</option>
                </select>
              </div>

              {/* Trigger Modal directly from leads page */}
              {activeMenu === 'Manage Leads' && (
                <button 
                  className="btn btn-primary"
                  onClick={() => setShowImportModal(true)}
                >
                  <UploadCloud size={16} /> Import CSV
                </button>
              )}
            </div>
          </div>

          {/* Error Banner */}
          {error && modalStep === 1 && (
            <div className="alert-card alert-danger" id="app-error-banner">
              <AlertTriangle size={16} style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <strong>Import Error:</strong> {error}
              </div>
            </div>
          )}

          {/* VIEW 1: DASHBOARD */}
          {activeMenu === 'Dashboard' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              <div className="stats-grid">
                <div className="stats-card">
                  <span className="stats-label">Total Leads</span>
                  <div className="stats-value-row">
                    <span className="stats-value">{leadsList.length}</span>
                    <span className="stats-trend up">+18%</span>
                  </div>
                </div>
                <div className="stats-card">
                  <span className="stats-label">Good Leads</span>
                  <div className="stats-value-row">
                    <span className="stats-value">
                      {leadsList.filter(l => l.crm_status === 'Good Lead' || l.crm_status === 'GOOD_LEAD_FOLLOW_UP').length}
                    </span>
                    <span className="stats-trend up">+8.5%</span>
                  </div>
                </div>
                <div className="stats-card">
                  <span className="stats-label">Sales Done</span>
                  <div className="stats-value-row">
                    <span className="stats-value">
                      {leadsList.filter(l => l.crm_status === 'Sale Done' || l.crm_status === 'SALE_DONE').length}
                    </span>
                    <span className="stats-trend up">+12.4%</span>
                  </div>
                </div>
                <div className="stats-card">
                  <span className="stats-label">Uncontacted Rate</span>
                  <div className="stats-value-row">
                    <span className="stats-value">
                      {((leadsList.filter(l => l.crm_status === 'Not Dialed').length / leadsList.length) * 100).toFixed(0)}%
                    </span>
                    <span className="stats-trend down">-4.2%</span>
                  </div>
                </div>
              </div>

              <div className="table-card">
                <h3 className="table-title" style={{ marginBottom: '1rem' }}>Active CRM Channels</h3>
                <div className="sources-grid">
                  <div className="source-card">
                    <div className="source-header">
                      <div className="source-icon-wrapper"><Radio size={18} /></div>
                      <span className="badge badge-info">Active</span>
                    </div>
                    <h4 className="source-title">CSV Direct Upload</h4>
                    <p className="source-desc">Direct CSV mapper powered by Groq and Gemini generative language agents.</p>
                  </div>
                  <div className="source-card">
                    <div className="source-header">
                      <div className="source-icon-wrapper"><MessageCircle size={18} /></div>
                      <span className="badge badge-secondary">Not Connected</span>
                    </div>
                    <h4 className="source-title">WhatsApp Marketing</h4>
                    <p className="source-desc">Inject campaigns leads straight into your CRM databases.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* VIEW 2: MANAGE LEADS (Dashboard main viewport) */}
          {activeMenu === 'Manage Leads' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              
              {/* Stats overview cards matching Screenshot 1 metrics */}
              <div className="stats-grid">
                <div className="stats-card">
                  <span className="stats-label">Total Leads</span>
                  <div className="stats-value-row">
                    <span className="stats-value">{leadsList.length}</span>
                    <span className="stats-trend up">+14.2%</span>
                  </div>
                </div>
                <div className="stats-card">
                  <span className="stats-label">Sales Done</span>
                  <div className="stats-value-row">
                    <span className="stats-value">
                      {leadsList.filter(l => l.crm_status === 'Sale Done' || l.crm_status === 'SALE_DONE').length}
                    </span>
                    <span className="stats-trend up">+5%</span>
                  </div>
                </div>
                <div className="stats-card">
                  <span className="stats-label">Not Dialed</span>
                  <div className="stats-value-row">
                    <span className="stats-value">
                      {leadsList.filter(l => l.crm_status === 'Not Dialed').length}
                    </span>
                    <span className="stats-trend down">-2.1%</span>
                  </div>
                </div>
                <div className="stats-card">
                  <span className="stats-label">Conversion Rate</span>
                  <div className="stats-value-row">
                    <span className="stats-value">
                      {((leadsList.filter(l => l.crm_status === 'Sale Done' || l.crm_status === 'SALE_DONE').length / leadsList.length) * 100).toFixed(1)}%
                    </span>
                    <span className="stats-trend up">+1.5%</span>
                  </div>
                </div>
              </div>

              {/* Table Card container */}
              <div className="table-card">
                <div className="table-title-row">
                  <h3 className="table-title">Your Leads</h3>
                  
                  {/* Search Bar + Controls */}
                  <div className="search-bar-container">
                    <div className="search-input-wrapper">
                      <Search size={14} />
                      <input 
                        type="text" 
                        placeholder="Enter email or phone number..."
                        className="search-input"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                    <div className="search-actions">
                      <button 
                        className="btn btn-secondary btn-circle"
                        title="Reload Leads"
                        onClick={() => {
                          setSearchQuery('');
                          setError(null);
                        }}
                      >
                        <RefreshCw size={14} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Table implementation */}
                <div className="table-container">
                  {filteredLeads.length > 0 ? (
                    <table className="responsive-table">
                      <thead>
                        <tr>
                          <th>Lead Name</th>
                          <th>Email</th>
                          <th>Contact</th>
                          <th>Date Created</th>
                          <th>Company</th>
                          <th>Status</th>
                          <th>Lead Owner</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredLeads.map((lead, idx) => (
                          <tr key={idx}>
                            <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                              {lead.name || 'Unknown Lead'}
                            </td>
                            <td>{lead.email || '—'}</td>
                            <td>
                              {lead.country_code ? `${lead.country_code} ` : ''}
                              {lead.mobile_without_country_code || '—'}
                            </td>
                            <td>
                              {lead.created_at ? (
                                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                                  <Clock size={12} style={{ color: 'var(--text-muted)' }} />
                                  {lead.created_at}
                                </span>
                              ) : '—'}
                            </td>
                            <td>{lead.company || '—'}</td>
                            <td>
                              <span className={`badge status-${(lead.crm_status || 'Not_Dialed').replace(/\s+/g, '_')}`}>
                                {lead.crm_status || 'Not Dialed'}
                              </span>
                            </td>
                            <td>{lead.lead_owner || '—'}</td>
                            <td>
                              <button 
                                className="btn btn-secondary"
                                style={{ padding: '0.25rem 0.6rem', fontSize: '0.75rem', borderRadius: '4px' }}
                                onClick={() => {
                                  alert(`Lead Details:\nName: ${lead.name}\nSource: ${lead.data_source || 'Unknown'}\nNotes: ${lead.crm_note || 'None'}`);
                                }}
                              >
                                More &gt;
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <div style={{ padding: '3rem 1rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                      No leads matching your search filter.
                    </div>
                  )}
                </div>

                {/* Load More Pagination */}
                <div className="table-footer">
                  <button 
                    className="btn btn-secondary"
                    onClick={() => alert('All matching leads are loaded.')}
                  >
                    Load more
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* VIEW 3: LEAD SOURCES (Active upload card location) */}
          {activeMenu === 'Lead Sources' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              <div className="sources-grid">
                
                {/* Importer source connector card */}
                <div className="source-card" style={{ borderLeft: '4px solid var(--accent-secondary)' }}>
                  <div className="source-header">
                    <div className="source-icon-wrapper">
                      <FileSpreadsheet size={20} />
                    </div>
                    <span className="badge badge-info">Active</span>
                  </div>
                  <div>
                    <h4 className="source-title">Import Leads via CSV</h4>
                    <p className="source-desc" style={{ marginTop: '0.25rem' }}>
                      Clean leads, map dynamic column headers using AI models, and append records directly.
                    </p>
                  </div>
                  <div className="source-footer">
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>CSV Importer</span>
                    <button 
                      className="btn btn-primary"
                      onClick={() => setShowImportModal(true)}
                    >
                      Upload File
                    </button>
                  </div>
                </div>

                {/* Mock channel 2 */}
                <div className="source-card">
                  <div className="source-header">
                    <div className="source-icon-wrapper">
                      <Users size={20} />
                    </div>
                    <span className="badge badge-secondary">Disconnected</span>
                  </div>
                  <div>
                    <h4 className="source-title">Facebook Lead Ads</h4>
                    <p className="source-desc" style={{ marginTop: '0.25rem' }}>
                      Sync Meta lead-gen forms directly into GrowEasy to trigger immediate automated campaigns.
                    </p>
                  </div>
                  <div className="source-footer">
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Meta Integration</span>
                    <button className="btn btn-secondary" onClick={() => alert('Connect Meta Lead ads configuration.')}>
                      Connect
                    </button>
                  </div>
                </div>

                {/* Mock channel 3 */}
                <div className="source-card">
                  <div className="source-header">
                    <div className="source-icon-wrapper">
                      <Building size={20} />
                    </div>
                    <span className="badge badge-secondary">Disconnected</span>
                  </div>
                  <div>
                    <h4 className="source-title">Google Ads CRM Link</h4>
                    <p className="source-desc" style={{ marginTop: '0.25rem' }}>
                      Gather Google Ads conversion leads dynamically through offline import API integrations.
                    </p>
                  </div>
                  <div className="source-footer">
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Google Search</span>
                    <button className="btn btn-secondary" onClick={() => alert('Google link configuration.')}>
                      Connect
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* VIEW FALLBACKS */}
          {activeMenu !== 'Manage Leads' && activeMenu !== 'Lead Sources' && activeMenu !== 'Dashboard' && (
            <div className="table-card" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
              <HelpCircle size={48} style={{ color: 'var(--accent-primary)', marginBottom: '1rem' }} />
              <h3>Feature under configuration</h3>
              <p style={{ maxWidth: '400px', margin: '0.5rem auto 1.5rem auto' }}>
                This navigation link ({activeMenu}) is currently active but under construction. Click on "Manage Leads" or "Lead Sources" to view full dashboard utilities.
              </p>
              <button className="btn btn-primary" onClick={() => setActiveMenu('Manage Leads')}>
                Back to Leads Panel
              </button>
            </div>
          )}

          {/* Footer */}
          <footer style={{ 
            marginTop: 'auto', 
            paddingTop: '2rem', 
            borderTop: '1px solid var(--border-color)', 
            textAlign: 'center',
            fontSize: '0.85rem',
            color: 'var(--text-muted)',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.35rem'
          }}>
            <span>Made by <strong>Aryan Kumar Raj</strong></span>
            <span style={{ fontSize: '0.8rem', color: 'var(--accent-primary)', fontWeight: '600' }}>
              Groq API key will be valid till 8 August 2026. If it's not working, contact admin.
            </span>
          </footer>
        </div>
      </main>

      {/* ========================================== */}
      {/* MODAL WIZARD: IMPORT LEADS VIA CSV */}
      {/* ========================================== */}
      {showImportModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            
            {/* Modal Header */}
            <div className="modal-header">
              <div className="modal-header-info">
                <h3 className="modal-title">Import Leads via CSV</h3>
                <p className="modal-subtitle">Upload a CSV file to bulk import leads into your system.</p>
              </div>
              <button className="modal-close-btn" onClick={handleCloseModal}>
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="modal-body">
              
              {/* Inner Modal Error Message */}
              {error && modalStep > 1 && (
                <div className="alert-card alert-danger">
                  <AlertTriangle size={16} style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <strong>Import Process Failed:</strong> {error}
                  </div>
                </div>
              )}

              {/* STEP 1: DROPZONE / UPLOAD FILE */}
              {modalStep === 1 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  <div 
                    className={`modal-upload-zone ${dragOver ? 'dragging' : ''}`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      onChange={handleFileChange} 
                      accept=".csv" 
                      style={{ display: 'none' }}
                    />
                    <div className="modal-upload-icon">
                      {loading ? (
                        <div className="spinner" style={{ width: '24px', height: '24px' }}></div>
                      ) : (
                        <UploadCloud size={28} />
                      )}
                    </div>
                    <div>
                      <p className="modal-upload-title">Drop your CSV file here</p>
                      <p className="modal-upload-subtitle">or click to browse files</p>
                      <p className="modal-upload-desc">Supported file: .csv (max 5MB)</p>
                    </div>
                  </div>

                  <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', lineHeight: '1.4', textAlign: 'center' }}>
                    Required headers: <code>created_at, name, email, country_code, mobile_without_country_code, company, city, state, country, lead_owner, crm_status, crm_note</code>. Template includes default + custom CRM fields to reduce upload errors.
                  </p>

                  <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <a 
                      href="/sample_template.csv" 
                      download="CRM_leads_template.csv"
                      className="btn btn-secondary"
                      style={{ padding: '0.45rem 1rem', fontSize: '0.8rem' }}
                    >
                      <Download size={14} /> Download Sample CSV Template
                    </a>
                  </div>

                  {/* Demo upload shortcuts inside modal */}
                  <div style={{ marginTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>Quick Testing Shortcuts:</span>
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                      <button className="btn btn-secondary" style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem' }} onClick={() => loadDemoData('facebook')}>
                        Facebook Template CSV
                      </button>
                      <button className="btn btn-secondary" style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem' }} onClick={() => loadDemoData('google')}>
                        Google Ads CSV
                      </button>
                      <button className="btn btn-secondary" style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem' }} onClick={() => loadDemoData('invalid')}>
                        Invalid File Filter
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 2: RAW FILE PARSING & PREVIEW TABLE */}
              {modalStep === 2 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  {/* File information card */}
                  <div className="file-card-wrapper">
                    <div className="file-card-left">
                      <div className="file-card-icon">
                        <FileSpreadsheet size={18} />
                      </div>
                      <div>
                        <h4 className="file-card-name">{file ? file.name : rawFilename}</h4>
                        <span className="file-card-size">
                          {file ? `${(file.size / 1024).toFixed(2)} KB` : '—'} • {rawRows.length} rows detected
                        </span>
                      </div>
                    </div>
                    <button className="modal-close-btn" style={{ width: '28px', height: '28px' }} onClick={handleResetModal}>
                      <X size={14} />
                    </button>
                  </div>

                  {/* Preview Title */}
                  <h5 className="modal-preview-title">Parsed CSV Contents Preview</h5>

                  {/* CSV preview table */}
                  <div className="table-container" style={{ maxHeight: '240px' }}>
                    <table className="responsive-table">
                      <thead>
                        <tr>
                          {rawRows.length > 0 && Object.keys(rawRows[0]).map((header) => (
                            <th key={header}>{header}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {rawRows.slice(0, 10).map((row, idx) => (
                          <tr key={idx}>
                            {Object.values(row).map((val, cellIdx) => (
                              <td key={cellIdx}>
                                {String(val) || <em style={{ color: 'var(--text-muted)' }}>null</em>}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {rawRows.length > 10 && (
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontStyle: 'italic', textAlign: 'center' }}>
                      Showing first 10 rows of {rawRows.length} total records.
                    </span>
                  )}
                </div>
              )}

              {/* STEP 3: LOADING STEPS FOR AI EXTRACTION */}
              {modalStep === 3 && (
                <div className="loader-wrapper">
                  <div className="spinner"></div>
                  <h4 style={{ fontSize: '1.1rem', fontWeight: 800 }}>
                    Extracting Leads using {engine === 'gemini' ? 'Gemini 3.5 Flash' : 'Groq Llama 3.3'}
                  </h4>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.82rem', textAlign: 'center', maxWidth: '450px' }}>
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
                </div>
              )}

              {/* STEP 4: MAPPED METRICS SUMMARY & RE-CHECK */}
              {modalStep === 4 && importResult && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  
                  {/* Step status banner */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-success)' }}>
                    <CheckCircle2 size={18} />
                    <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>AI Mapping Complete</span>
                  </div>

                  {/* Metrics grid inside modal */}
                  <div className="modal-metrics-grid">
                    <div className="modal-metric-card">
                      <span className="modal-metric-label">Processed</span>
                      <span className="modal-metric-value">{importResult.totalProcessed}</span>
                    </div>
                    <div className="modal-metric-card success">
                      <span className="modal-metric-label">Imported</span>
                      <span className="modal-metric-value">{importResult.totalImported}</span>
                    </div>
                    <div className="modal-metric-card skipped">
                      <span className="modal-metric-label">Skipped</span>
                      <span className="modal-metric-value">{importResult.totalSkipped}</span>
                    </div>
                  </div>

                  {/* Tabs navigation for success vs skipped leads */}
                  <div className="tab-navigation">
                    <button 
                      className={`tab-btn ${activeTab === 'imported' ? 'active' : ''}`}
                      onClick={() => setActiveTab('imported')}
                    >
                      Successfully Mapped ({importResult.totalImported})
                    </button>
                    <button 
                      className={`tab-btn ${activeTab === 'skipped' ? 'active' : ''}`}
                      onClick={() => setActiveTab('skipped')}
                    >
                      Skipped Leads ({importResult.totalSkipped})
                    </button>
                  </div>

                  {/* Tab contents */}
                  {activeTab === 'imported' && (
                    <div className="table-container" style={{ maxHeight: '200px' }}>
                      {importResult.imported.length > 0 ? (
                        <table className="responsive-table">
                          <thead>
                            <tr>
                              <th>Lead Name</th>
                              <th>Email</th>
                              <th>Mobile</th>
                              <th>Status</th>
                              <th>Source</th>
                            </tr>
                          </thead>
                          <tbody>
                            {importResult.imported.map((lead, idx) => (
                              <tr key={idx}>
                                <td style={{ fontWeight: 600 }}>{lead.name}</td>
                                <td>{lead.email || '—'}</td>
                                <td>{lead.mobile_without_country_code || '—'}</td>
                                <td>
                                  <span className={`badge status-${(lead.crm_status || 'Not_Dialed').replace(/\s+/g, '_')}`}>
                                    {lead.crm_status || 'Not Dialed'}
                                  </span>
                                </td>
                                <td>{lead.data_source || '—'}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      ) : (
                        <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                          No leads were successfully mapped.
                        </div>
                      )}
                    </div>
                  )}

                  {activeTab === 'skipped' && (
                    <div className="table-container" style={{ maxHeight: '200px' }}>
                      {importResult.skipped.length > 0 ? (
                        <table className="responsive-table">
                          <thead>
                            <tr>
                              <th>Row</th>
                              <th>Reason</th>
                              <th>CSV Row Data</th>
                            </tr>
                          </thead>
                          <tbody>
                            {importResult.skipped.map((skipItem, idx) => (
                              <tr key={idx}>
                                <td>#{idx + 1}</td>
                                <td><span className="badge badge-danger">{skipItem.reason}</span></td>
                                <td><code>{JSON.stringify(skipItem.originalRecord)}</code></td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      ) : (
                        <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                          No records were skipped during filters.
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Modal Footer Controls */}
            <div className="modal-footer">
              {modalStep === 1 && (
                <>
                  <button className="btn btn-secondary" onClick={handleCloseModal}>
                    Cancel
                  </button>
                  <button className="btn btn-primary" disabled={true}>
                    Upload File
                  </button>
                </>
              )}

              {modalStep === 2 && (
                <>
                  <button className="btn btn-secondary" onClick={handleResetModal}>
                    Cancel
                  </button>
                  <button className="btn btn-primary" onClick={executeAIMapping}>
                    Upload File
                  </button>
                </>
              )}

              {modalStep === 3 && (
                <button className="btn btn-secondary" onClick={handleResetModal}>
                  Cancel & Go Back
                </button>
              )}

              {modalStep === 4 && (
                <button className="btn btn-primary" onClick={handleCloseModal}>
                  Close & Refresh Leads
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
