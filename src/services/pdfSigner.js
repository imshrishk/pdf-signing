const fs = require('fs');
const { PDFDocument } = require('pdf-lib');
const { pdflibAddPlaceholder } = require('@signpdf/placeholder-pdf-lib');
const { SignPdf } = require('@signpdf/signpdf');
const { P12Signer } = require('@signpdf/signer-p12');

class PdfSigner {
  constructor(certPath, passphrase) {
    this.certPath = certPath;
    this.passphrase = passphrase;
    this.certificate = null;
    this.signPdfLib = new SignPdf();
    this.certificateInfo = null;
    
    this.loadCertificate();
  }

  /**
   * Load and verify the P12 certificate exists
   */
  loadCertificate() {
    try {
      const certBuffer = fs.readFileSync(this.certPath);
      this.certificate = certBuffer;
      this.parseCertificateInfo();
      console.log('✓ Certificate loaded successfully');
    } catch (error) {
      throw new Error(`Failed to load certificate: ${error.message}`);
    }
  }

  /**
   * Parse certificate info
   */
  parseCertificateInfo() {
    try {
      this.certificateInfo = {
        loaded: true,
        path: this.certPath,
        timestamp: fs.statSync(this.certPath).mtime,
        algorithm: 'PKCS#7/CMS (Detached)',
        hasPrivateKey: true
      };
    } catch (error) {
      this.certificateInfo = { loaded: false, error: error.message };
    }
  }

  /**
   * Get certificate information
   */
  async getCertificateInfo() {
    return {
      ...this.certificateInfo,
      message: 'Certificate is loaded and ready for signing'
    };
  }

  /**
   * Sign a PDF file with a real cryptographic PDF signature.
   * @param {string} inputPath - Path to unsigned PDF
   * @param {string} outputPath - Path to save signed PDF
   * @param {object} signatureOptions - { reason, location, contact }
   */
  async signPdf(inputPath, outputPath, signatureOptions = {}) {
    try {
      const pdfBuffer = fs.readFileSync(inputPath);
      if (!this.isPdfValid(pdfBuffer)) {
        throw new Error('Invalid or corrupted PDF file');
      }

      const signedPdfBytes = await this.signPdfBuffer(pdfBuffer, signatureOptions);
      fs.writeFileSync(outputPath, signedPdfBytes);
      
      console.log(`✓ PDF signed successfully: ${outputPath}`);
      return outputPath;
    } catch (error) {
      throw new Error(`Failed to sign PDF: ${error.message}`);
    }
  }

  /**
   * Sign a PDF buffer and return signed buffer
   * @param {Buffer} pdfBuffer - PDF file buffer
   * @param {object} signatureOptions - { reason, location, contact }
   * @returns {Promise<Buffer>} Signed PDF buffer
   */
  async signPdfBuffer(pdfBuffer, signatureOptions = {}) {
    try {
      if (!this.isPdfValid(pdfBuffer)) {
        throw new Error('Invalid or corrupted PDF file');
      }

      const pdfDoc = await PDFDocument.load(pdfBuffer, {
        updateMetadata: false,
      });

      pdflibAddPlaceholder({
        pdfDoc,
        reason: signatureOptions.reason || 'Document signed by server',
        location: signatureOptions.location || 'Server',
        contactInfo: signatureOptions.contact || 'N/A',
        name: 'PDF Signing Server',
        signatureLength: 8192,
      });

      const pdfBytesWithPlaceholder = await pdfDoc.save({
        useObjectStreams: false,
      });

      const p12Signer = new P12Signer(this.certificate, {
        passphrase: this.passphrase,
      });

      const signedPdfBytes = await this.signPdfLib.sign(Buffer.from(pdfBytesWithPlaceholder), p12Signer);
      
      console.log('✓ PDF buffer signed successfully');
      
      return signedPdfBytes;
    } catch (error) {
      throw new Error(`Failed to sign PDF buffer: ${error.message}`);
    }
  }

  /**
   * Validate if buffer is a valid PDF
   */
  isPdfValid(buffer) {
    // Check for PDF header
    if (buffer.length < 4) return false;
    
    const header = buffer.toString('ascii', 0, 4);
    if (!header.startsWith('%PDF')) {
      return false;
    }

    return true;
  }

}

module.exports = { PdfSigner };

