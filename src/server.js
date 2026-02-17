const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { PdfSigner } = require('./services/pdfSigner');

const app = express();
const PORT = process.env.PORT || 3000;

// Ensure directories exist
const uploadDir = path.join(__dirname, '../uploads');
const certDir = path.join(__dirname, '../certs');

[uploadDir, certDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf' || file.originalname.endsWith('.pdf')) {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed'), false);
    }
  }
});

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files (HTML UI)
const publicDir = path.join(__dirname, '../public');
if (fs.existsSync(publicDir)) {
  app.use(express.static(publicDir));
}

// Initialize PDF Signer
let pdfSigner;

const initializeSigner = async () => {
  try {
    const certPath = path.join(certDir, 'signing-cert.p12');
    const passphrase = process.env.CERT_PASSPHRASE || 'password';
    
    if (!fs.existsSync(certPath)) {
      console.error(`Certificate not found at ${certPath}`);
      console.error('Please generate a certificate using: npm run generate-cert');
      process.exit(1);
    }
    
    pdfSigner = new PdfSigner(certPath, passphrase);
    console.log('✓ PDF Signer initialized successfully');
  } catch (error) {
    console.error('Failed to initialize PDF Signer:', error.message);
    process.exit(1);
  }
};

// Routes

/**
 * Health check endpoint
 */
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'PDF Signing Server is running' });
});

/**
 * Sign a PDF file
 * POST /api/sign
 * Body: multipart/form-data with 'pdf' file
 * Optional query: reason, location, contact
 */
app.post('/api/sign', upload.single('pdf'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No PDF file provided' });
    }

    const {
      reason = 'Document signed by server',
      location = '',
      contact = ''
    } = req.query;

    const inputPath = req.file.path;
    const outputPath = path.join(uploadDir, `signed-${Date.now()}-${req.file.originalname}`);

    // Sign the PDF
    await pdfSigner.signPdf(inputPath, outputPath, {
      reason,
      location,
      contact
    });

    // Send the signed PDF
    res.download(outputPath, `signed-${req.file.originalname}`, (err) => {
      if (err) {
        console.error('Error sending file:', err);
      }
      // Clean up files
      setTimeout(() => {
        try {
          fs.unlinkSync(inputPath);
          if (fs.existsSync(outputPath)) {
            fs.unlinkSync(outputPath);
          }
        } catch (e) {
          console.error('Cleanup error:', e);
        }
      }, 1000);
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to sign PDF',
      details: error.message
    });
  }
});

/**
 * Sign PDF and return base64
 * POST /api/sign/base64
 * Body: { pdf: string (base64), reason?: string, location?: string, contact?: string }
 */
app.post('/api/sign/base64', async (req, res) => {
  try {
    const { pdf, reason = '', location = '', contact = '' } = req.body;

    if (!pdf) {
      return res.status(400).json({ error: 'No PDF data provided' });
    }

    // Convert base64 to buffer
    const pdfBuffer = Buffer.from(pdf, 'base64');
    
    const inputPath = path.join(uploadDir, `temp-${Date.now()}.pdf`);
    const outputPath = path.join(uploadDir, `signed-${Date.now()}.pdf`);

    // Write temp PDF
    fs.writeFileSync(inputPath, pdfBuffer);

    // Sign the PDF
    await pdfSigner.signPdf(inputPath, outputPath, {
      reason,
      location,
      contact
    });

    // Read signed PDF and convert to base64
    const signedPdf = fs.readFileSync(outputPath);
    const base64Pdf = signedPdf.toString('base64');

    res.json({ signedPdf: base64Pdf });

    // Clean up
    setTimeout(() => {
      try {
        fs.unlinkSync(inputPath);
        fs.unlinkSync(outputPath);
      } catch (e) {
        console.error('Cleanup error:', e);
      }
    }, 100);
  } catch (error) {
    res.status(500).json({
      error: 'Failed to sign PDF',
      details: error.message
    });
  }
});

/**
 * Get certificate info
 * GET /api/cert/info
 */
app.get('/api/cert/info', async (req, res) => {
  try {
    const info = await pdfSigner.getCertificateInfo();
    res.json(info);
  } catch (error) {
    res.status(500).json({
      error: 'Failed to get certificate info',
      details: error.message
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    error: err.message || 'Internal server error'
  });
});

// Initialize and start server
(async () => {
  await initializeSigner();
  
  app.listen(PORT, () => {
    console.log(`
╔════════════════════════════════════════╗
║   PDF Signing Server                   ║
║   Running on http://localhost:${PORT}     ║
╚════════════════════════════════════════╝

Available Endpoints:
  GET  /health                    - Health check
  POST /api/sign                  - Sign PDF (multipart)
  POST /api/sign/base64           - Sign PDF (base64)
  GET  /api/cert/info             - Certificate info
    `);
  });
})();

module.exports = app;
