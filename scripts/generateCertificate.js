const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

/**
 * Generate a self-signed P12 certificate for testing
 * In production, you would use a proper CA-signed certificate
 */

const certDir = path.join(__dirname, '../certs');
const certPath = path.join(certDir, 'signing-cert.p12');
const keyPath = path.join(certDir, 'signing-key.pem');
const crtPath = path.join(certDir, 'signing-cert.pem');

const PASSPHRASE = 'password';
const CERTIFICATE_VALIDITY = 3650; // 10 years

console.log('🔐 Generating P12 Certificate for PDF Signing...\n');

// Ensure cert directory exists
if (!fs.existsSync(certDir)) {
  fs.mkdirSync(certDir, { recursive: true });
}

try {
  // Step 1: Generate private key
  console.log('Step 1: Generating private key...');
  execSync(
    `openssl genrsa -out "${keyPath}" 2048`,
    { stdio: 'inherit' }
  );
  console.log('✓ Private key generated\n');

  // Step 2: Create certificate signing request (CSR)
  console.log('Step 2: Creating certificate signing request...');
  const csrPath = path.join(certDir, 'signing.csr');
  execSync(
    `openssl req -new -key "${keyPath}" -out "${csrPath}" -subj "/C=US/ST=State/L=City/O=Organization/CN=PDF Signer"`,
    { stdio: 'inherit' }
  );
  console.log('✓ CSR created\n');

  // Step 3: Sign the certificate
  console.log('Step 3: Creating self-signed certificate...');
  execSync(
    `openssl x509 -req -days ${CERTIFICATE_VALIDITY} -in "${csrPath}" -signkey "${keyPath}" -out "${crtPath}"`,
    { stdio: 'inherit' }
  );
  console.log('✓ Certificate created\n');

  // Step 4: Convert to PKCS#12 (.p12)
  console.log('Step 4: Converting to PKCS#12 format...');
  execSync(
    `openssl pkcs12 -export -in "${crtPath}" -inkey "${keyPath}" -out "${certPath}" -name "PDF Signer" -passout pass:${PASSPHRASE}`,
    { stdio: 'inherit' }
  );
  console.log('✓ P12 certificate created\n');

  // Step 5: Cleanup intermediate files
  console.log('Step 5: Cleaning up...');
  fs.unlinkSync(csrPath);
  console.log('✓ Cleanup done\n');

  // Display certificate info
  console.log('════════════════════════════════════════');
  console.log('✓ Certificate Generated Successfully! ✓');
  console.log('════════════════════════════════════════\n');
  console.log('Certificate Details:');
  console.log(`  Path: ${certPath}`);
  console.log(`  Passphrase: ${PASSPHRASE}`);
  console.log(`  Validity: ${CERTIFICATE_VALIDITY} days\n`);
  
  console.log('Environment Setup:');
  console.log(`  export CERT_PASSPHRASE="${PASSPHRASE}"\n`);

  console.log('⚠️  IMPORTANT SECURITY NOTES:');
  console.log('  • This is a SELF-SIGNED certificate for testing only');
  console.log('  • For production, use a certificate from a trusted CA');
  console.log('  • Store the passphrase securely (use environment variables)');
  console.log('  • Never commit the P12 file to version control');
  console.log('  • Add certs/*.p12 to .gitignore\n');

  // Display certificate content
  console.log('Certificate Information:');
  try {
    execSync(`openssl x509 -in "${crtPath}" -text -noout`, { stdio: 'inherit' });
  } catch (e) {
    // Command might fail on Windows
    console.log('(Run "openssl x509 -in certs/signing-cert.pem -text -noout" to view full details)');
  }

} catch (error) {
  console.error('❌ Error generating certificate:', error.message);
  console.error('\n⚠️  Requirements:');
  console.error('  • OpenSSL must be installed and available in PATH');
  console.error('  • On Windows: Download from https://slproweb.com/products/Win32OpenSSL.html');
  console.error('  • On macOS: brew install openssl');
  console.error('  • On Linux: apt-get install openssl (or yum/dnf equivalent)\n');
  process.exit(1);
}
