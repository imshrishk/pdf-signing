# PDF Signing Server

Minimal Node.js service to cryptographically sign PDFs on the server using a `.p12` certificate.

## Requirements

- Node.js 14+
- npm
- OpenSSL (only for generating a local test certificate)

## Setup

```bash
npm install
npm run generate-cert
```

Create `.env` (or use defaults):

```env
PORT=3000
CERT_PASSPHRASE=password
```

## Run

```bash
npm start
```

Dev mode:

```bash
npm run dev
```

Health check:

```bash
npm test
```

## Docker

```bash
docker compose up --build -d
```

Health:

```bash
curl http://localhost:3000/health
```

## API

### `GET /health`
Returns server status.

### `POST /api/sign`
Signs uploaded PDF.

- Content-Type: `multipart/form-data`
- Field: `pdf` (file)
- Optional query params: `reason`, `location`, `contact`
- Response: signed PDF file (download)

### `POST /api/sign/base64`
Signs base64 PDF payload.

- Content-Type: `application/json`
- Body:

```json
{
  "pdf": "<base64-pdf>",
  "reason": "optional",
  "location": "optional",
  "contact": "optional"
}
```

- Response:

```json
{
  "signedPdf": "<base64-signed-pdf>"
}
```

### `GET /api/cert/info`
Returns loaded certificate metadata.

## Notes

- Private key stays on server (`certs/signing-cert.p12`).
- Signed PDFs include real signature structures (`/ByteRange`, `/Sig`, `/Contents`, `/AcroForm`).
- Self-signed certs are expected to show as untrusted in Adobe/Foxit unless trust chain is installed.

## Trust Model

- **Current default (`npm run generate-cert`)**: self-signed certificate.
- **Result**: signatures are cryptographically valid but usually appear as **untrusted** to external users.

### Free vs globally trusted

- **Free certificates**: not globally trusted for PDF signing in Adobe/Foxit by default.
- **Globally trusted signatures**: require a CA-issued document-signing certificate whose chain is trusted by clients.

### How to remove “untrusted” warnings

1. Obtain a CA-issued document-signing certificate (`.p12`/`.pfx`).
2. Replace `certs/signing-cert.p12` with that certificate.
3. Set `CERT_PASSPHRASE` in `.env` to the certificate password.
4. Restart the server.

### Internal/private deployments (no CA purchase)

- Keep self-signed/internal CA cert and distribute trust chain to all client machines.
- Users must import trust in OS + Adobe/Foxit for warnings to disappear.
