import React, { useState } from 'react';
import { uploadService } from '../services/uploadService.js';
import { dataService } from '../services/dataService.js';
import { auditService } from '../services/auditService.js';
import { usePersona } from '../contexts/PersonaContext.jsx';
import { Upload, FileSpreadsheet, CheckCircle2, AlertTriangle, RotateCcw } from 'lucide-react';

export default function AdminUploadPage() {
  const { persona } = usePersona();
  const [datasetType, setDatasetType] = useState('applications');
  const [file, setFile] = useState(null);
  const [previewData, setPreviewData] = useState([]);
  const [status, setStatus] = useState({ type: '', message: '' });

  const handleFileChange = async (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setStatus({ type: '', message: '' });

    try {
      let parsed = [];
      if (selectedFile.name.endsWith('.csv')) {
        parsed = await uploadService.parseCSV(selectedFile);
      } else if (selectedFile.name.endsWith('.xlsx') || selectedFile.name.endsWith('.xls')) {
        parsed = await uploadService.parseExcel(selectedFile);
      } else {
        setStatus({ type: 'error', message: 'Unsupported file extension. Please select CSV or Excel files.' });
        return;
      }

      const validation = uploadService.validateSchema(parsed, datasetType);
      if (!validation.valid) {
        setStatus({ type: 'error', message: validation.error });
        setPreviewData([]);
        return;
      }

      setPreviewData(parsed.slice(0, 10)); // preview first 10 rows
      setStatus({ type: 'info', message: `Parsed ${parsed.length} rows successfully. Verify preview below.` });
    } catch (err) {
      setStatus({ type: 'error', message: `Parsing failed: ${err.message}` });
    }
  };

  const handleImport = async () => {
    if (!file || previewData.length === 0) return;

    try {
      let parsed = [];
      if (file.name.endsWith('.csv')) {
        parsed = await uploadService.parseCSV(file);
      } else {
        parsed = await uploadService.parseExcel(file);
      }

      uploadService.importDataset(parsed, datasetType, persona);
      setStatus({ type: 'success', message: `Successfully imported ${parsed.length} records into ${datasetType}.` });
      setFile(null);
      setPreviewData([]);
    } catch (err) {
      setStatus({ type: 'error', message: `Import failed: ${err.message}` });
    }
  };

  const handleReset = () => {
    dataService.resetAllData();
    auditService.logAction(persona, 'Reset Defaults', 'Restored default Horizon SPoG mock datasets.');
    setStatus({ type: 'success', message: 'System datasets successfully restored to standard mock files.' });
    setFile(null);
    setPreviewData([]);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-dark-900 dark:text-dark-50 tracking-tight">
            Data Upload Console
          </h1>
          <p className="text-sm text-dark-500 dark:text-dark-400 mt-1">
            Import custom application metrics, releases, incidents, or journey maps from CSV/Excel documents.
          </p>
        </div>

        <button
          onClick={handleReset}
          className="flex items-center justify-center gap-2 px-4 py-2 border border-dark-200 dark:border-dark-800 rounded-lg text-xs font-bold text-dark-600 dark:text-dark-400 hover:bg-dark-50 dark:hover:bg-dark-800/50 hover:text-dark-800 transition-colors"
        >
          <RotateCcw className="h-4 w-4" />
          <span>Restore Default Mock Data</span>
        </button>
      </div>

      {/* Upload configuration section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 bg-white dark:bg-dark-900 border border-dark-200 dark:border-dark-800 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex flex-col gap-1">
            <label className="text-2xs font-bold text-dark-400 dark:text-dark-500 uppercase tracking-wider">
              Dataset Type
            </label>
            <select
              value={datasetType}
              onChange={(e) => {
                setDatasetType(e.target.value);
                setFile(null);
                setPreviewData([]);
                setStatus({ type: '', message: '' });
              }}
              className="w-full text-xs bg-dark-50 dark:bg-dark-950 border border-dark-200 dark:border-dark-800 rounded-lg px-3 py-2 text-dark-800 dark:text-dark-200 outline-none focus:ring-1 focus:ring-horizon-500 cursor-pointer"
            >
              <option value="applications">Applications Portfolio</option>
              <option value="incidents">ServiceNow Incident tickets</option>
              <option value="releases">Release pipeline history</option>
              <option value="journeys">Business Journeys maps</option>
            </select>
          </div>

          <div className="border border-dashed border-dark-200 dark:border-dark-800 rounded-xl p-6 flex flex-col items-center justify-center text-center relative hover:bg-dark-50/20 transition-colors cursor-pointer">
            <Upload className="h-8 w-8 text-dark-400 mb-2" />
            <span className="text-xs font-bold text-dark-700 dark:text-dark-300">Select source spreadsheet</span>
            <span className="text-[10px] text-dark-450 mt-1">CSV, XLSX or XLS formats</span>
            <input
              type="file"
              accept=".csv, .xlsx, .xls"
              onChange={handleFileChange}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
          </div>

          {file && (
            <div className="p-3 bg-dark-50 dark:bg-dark-950 rounded-lg border border-dark-100 flex items-center gap-2">
              <FileSpreadsheet className="h-5 w-5 text-horizon-600 flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-xs font-bold text-dark-800 dark:text-dark-250 truncate">{file.name}</p>
                <p className="text-[9px] text-dark-400">{(file.size / 1024).toFixed(1)} KB</p>
              </div>
            </div>
          )}

          {status.message && (
            <div className={`p-3 rounded-lg border text-xs font-semibold flex items-start gap-2 ${
              status.type === 'error'
                ? 'bg-critical-50 text-critical-700 border-critical-200 dark:bg-critical-950/20 dark:text-critical-400 dark:border-critical-900/50'
                : status.type === 'success'
                ? 'bg-healthy-50 text-healthy-700 border-healthy-200 dark:bg-healthy-950/20 dark:text-healthy-400 dark:border-healthy-900/50'
                : 'bg-info-50 text-info-700 border-info-200 dark:bg-info-950/20 dark:text-info-400 dark:border-info-900/50'
            }`}>
              {status.type === 'error' ? (
                <AlertTriangle className="h-4 w-4 flex-shrink-0" />
              ) : (
                <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
              )}
              <span>{status.message}</span>
            </div>
          )}

          {previewData.length > 0 && (
            <button
              onClick={handleImport}
              className="w-full py-2 bg-horizon-600 hover:bg-horizon-700 text-white rounded-lg text-xs font-bold shadow-md transition-colors"
            >
              Confirm and Import Data
            </button>
          )}
        </div>

        {/* Data Preview Table */}
        <div className="md:col-span-2 bg-white dark:bg-dark-900 border border-dark-200 dark:border-dark-800 rounded-2xl p-5 shadow-sm space-y-4 overflow-hidden">
          <h2 className="text-xs font-bold text-dark-400 dark:text-dark-500 uppercase tracking-wider">
            Dataset Preview (Limit 10 rows)
          </h2>

          {previewData.length > 0 ? (
            <div className="overflow-x-auto max-h-[350px] scrollbar-thin">
              <table className="w-full text-xs font-medium text-dark-700 dark:text-dark-350 text-left border-collapse">
                <thead>
                  <tr className="border-b border-dark-200 dark:border-dark-800 text-[10px] font-bold text-dark-400 dark:text-dark-500 uppercase tracking-wider bg-dark-50 dark:bg-dark-950/30">
                    {Object.keys(previewData[0]).map((h) => (
                      <th key={h} className="py-2 px-3">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-dark-100 dark:divide-dark-850">
                  {previewData.map((row, idx) => (
                    <tr key={idx} className="hover:bg-dark-50/50 dark:hover:bg-dark-850/50 transition-colors">
                      {Object.values(row).map((val, cIdx) => (
                        <td key={cIdx} className="py-2.5 px-3 truncate max-w-[120px]">
                          {val !== null && val !== undefined ? String(val) : ''}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="h-64 flex flex-col items-center justify-center text-dark-400 dark:text-dark-500 border border-dashed border-dark-200 dark:border-dark-800 rounded-xl">
              <FileSpreadsheet className="h-10 w-10 mb-2 text-dark-300" />
              <p className="text-xs font-semibold">Select a file to parse details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
