import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import { dataService } from './dataService.js';
import { auditService } from './auditService.js';

export const uploadService = {
  // Parse CSV file asynchronously
  parseCSV(file) {
    return new Promise((resolve, reject) => {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        dynamicTyping: true,
        complete: (results) => {
          resolve(results.data);
        },
        error: (err) => {
          reject(err);
        }
      });
    });
  },

  // Parse Excel file asynchronously
  parseExcel(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = e.target.result;
          const workbook = XLSX.read(data, { type: 'binary' });
          const firstSheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[firstSheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: '' });
          resolve(jsonData);
        } catch (err) {
          reject(err);
        }
      };
      reader.onerror = (err) => reject(err);
      reader.readAsBinaryString(file);
    });
  },

  // Validate fields schema based on datatype selected
  validateSchema(data, type) {
    if (!Array.isArray(data) || data.length === 0) {
      return { valid: false, error: 'File is empty or not parsed as an array.' };
    }

    const firstRow = data[0];
    const requiredFields = {
      applications: ['id', 'name', 'domain', 'portfolio', 'criticality'],
      incidents: ['id', 'title', 'severity', 'status', 'application'],
      releases: ['id', 'application', 'version', 'status'],
      journeys: ['id', 'name', 'description'],
    };

    const fields = requiredFields[type];
    if (!fields) return { valid: true };

    const missing = fields.filter(f => !(f in firstRow));
    if (missing.length > 0) {
      return {
        valid: false,
        error: `Missing required column headers: ${missing.join(', ')}`,
      };
    }

    return { valid: true };
  },

  // Process data imports
  importDataset(data, type, persona) {
    const validation = this.validateSchema(data, type);
    if (!validation.valid) {
      throw new Error(validation.error);
    }

    switch (type) {
      case 'applications':
        dataService.saveApplications(data);
        break;
      case 'incidents':
        dataService.saveIncidents(data);
        break;
      case 'releases':
        dataService.saveReleases(data);
        break;
      case 'journeys':
        dataService.saveJourneys(data);
        break;
      default:
        throw new Error(`Unsupported dataset type: ${type}`);
    }

    auditService.logAction(
      persona,
      'Upload Dataset',
      `Imported ${data.length} records into ${type} collections.`
    );
  }
};

export default uploadService;
