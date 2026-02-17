#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const http = require('http');
const https = require('https');
const FormData = require('form-data');

/**
 * Client utilities for testing the PDF Signing API
 */

const API_URL = process.env.API_URL || 'http://localhost:3000';

/**
 * Sign PDF via multipart upload
 */
async function signPdfFile(filePath, options = {}) {
  return new Promise((resolve, reject) => {
    const fileStream = fs.createReadStream(filePath);
    const form = new FormData();

    form.append('pdf', fileStream);

    const query = new URLSearchParams(options).toString();
    const url = `${API_URL}/api/sign${query ? '?' + query : ''}`;
    const urlObj = new URL(url);
    
    const protocol = urlObj.protocol.startsWith('https') ? https : http;
    
    const req = protocol.request(url, {
      method: 'POST',
      headers: form.getHeaders()
    }, (res) => {
      const chunks = [];
      res.on('data', (chunk) => chunks.push(chunk));
      res.on('end', () => {
        if (res.statusCode === 200) {
          resolve({
            status: res.statusCode,
            data: Buffer.concat(chunks),
            contentType: res.headers['content-type']
          });
        } else {
          reject(new Error(`HTTP ${res.statusCode}: ${Buffer.concat(chunks).toString()}`));
        }
      });
    });

    req.on('error', reject);
    form.pipe(req);
  });
}

/**
 * Sign PDF via base64
 */
async function signPdfBase64(pdfPath, options = {}) {
  const pdfBuffer = fs.readFileSync(pdfPath);
  const base64Pdf = pdfBuffer.toString('base64');

  return new Promise((resolve, reject) => {
    const protocol = API_URL.startsWith('https') ? https : http;
    
    const payload = JSON.stringify({
      pdf: base64Pdf,
      reason: options.reason || '',
      location: options.location || '',
      contact: options.contact || ''
    });

    const req = protocol.request(`${API_URL}/api/sign/base64`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload)
      }
    }, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        if (res.statusCode === 200) {
          try {
            const result = JSON.parse(data);
            resolve({
              status: res.statusCode,
              signedPdf: Buffer.from(result.signedPdf, 'base64')
            });
          } catch (e) {
            reject(new Error(`Failed to parse response: ${e.message}`));
          }
        } else {
          reject(new Error(`HTTP ${res.statusCode}: ${data}`));
        }
      });
    });

    req.on('error', reject);
    req.write(payload);
    req.end();
  });
}

/**
 * Get certificate info
 */
async function getCertificateInfo() {
  return new Promise((resolve, reject) => {
    const protocol = API_URL.startsWith('https') ? https : http;
    
    const req = protocol.get(`${API_URL}/api/cert/info`, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        if (res.statusCode === 200) {
          try {
            resolve(JSON.parse(data));
          } catch (e) {
            reject(new Error(`Failed to parse response: ${e.message}`));
          }
        } else {
          reject(new Error(`HTTP ${res.statusCode}: ${data}`));
        }
      });
    });

    req.on('error', reject);
  });
}

/**
 * Check server health
 */
async function checkHealth() {
  return new Promise((resolve, reject) => {
    const protocol = API_URL.startsWith('https') ? https : http;
    
    const req = protocol.get(`${API_URL}/health`, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(new Error(`Failed to parse response: ${e.message}`));
        }
      });
    });

    req.on('error', reject);
  });
}

// CLI Interface
if (require.main === module) {
  const args = process.argv.slice(2);
  const command = args[0];

  (async () => {
    try {
      switch (command) {
        case 'health':
          console.log('Checking server health...');
          const health = await checkHealth();
          console.log('✓ Server Health:', health);
          break;

        case 'cert-info':
          console.log('Fetching certificate info...');
          const certInfo = await getCertificateInfo();
          console.log('✓ Certificate Info:', JSON.stringify(certInfo, null, 2));
          break;

        case 'sign':
          if (!args[1]) {
            console.error('Usage: node client.js sign <pdf-file> [reason] [location] [contact]');
            process.exit(1);
          }
          const pdfPath = args[1];
          if (!fs.existsSync(pdfPath)) {
            console.error(`File not found: ${pdfPath}`);
            process.exit(1);
          }
          console.log(`Signing PDF: ${path.basename(pdfPath)}...`);
          const result = await signPdfFile(pdfPath, {
            reason: args[2] || '',
            location: args[3] || '',
            contact: args[4] || ''
          });
          const outputPath = path.join(
            path.dirname(pdfPath),
            `signed-${Date.now()}-${path.basename(pdfPath)}`
          );
          fs.writeFileSync(outputPath, result.data);
          console.log(`✓ PDF signed successfully!`);
          console.log(`  Output: ${outputPath}`);
          break;

        case 'sign-base64':
          if (!args[1]) {
            console.error('Usage: node client.js sign-base64 <pdf-file> [reason] [location] [contact]');
            process.exit(1);
          }
          const pdfPath2 = args[1];
          if (!fs.existsSync(pdfPath2)) {
            console.error(`File not found: ${pdfPath2}`);
            process.exit(1);
          }
          console.log(`Signing PDF (base64): ${path.basename(pdfPath2)}...`);
          const result2 = await signPdfBase64(pdfPath2, {
            reason: args[2] || '',
            location: args[3] || '',
            contact: args[4] || ''
          });
          const outputPath2 = path.join(
            path.dirname(pdfPath2),
            `signed-base64-${Date.now()}-${path.basename(pdfPath2)}`
          );
          fs.writeFileSync(outputPath2, result2.signedPdf);
          console.log(`✓ PDF signed successfully!`);
          console.log(`  Output: ${outputPath2}`);
          break;

        default:
          console.log(`
PDF Signing Client

Usage:
  node client.js health              - Check server health
  node client.js cert-info           - Get certificate information
  node client.js sign <file>         - Sign PDF file (multipart)
  node client.js sign-base64 <file>  - Sign PDF file (base64)

Environment Variables:
  API_URL - API endpoint (default: http://localhost:3000)

Examples:
  node client.js sign document.pdf "Approved by CEO" "New York" "ceo@company.com"
  API_URL=https://api.example.com node client.js health
          `);
      }
    } catch (error) {
      console.error('❌ Error:', error.message);
      process.exit(1);
    }
  })();
}

module.exports = {
  signPdfFile,
  signPdfBase64,
  getCertificateInfo,
  checkHealth
};
