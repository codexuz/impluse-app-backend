# Certificate Generation Setup

## Installation

Install the required canvas package for image generation:

```bash
npm install canvas
npm install --save-dev @types/node
```

## Directory Structure

Create the following directories:

```
public/
  ├── templates/
  │   └── certificate-template.png    # Your certificate template image
  └── certificates/                   # Generated certificates will be saved here
```

## Template Image Guidelines

1. **Create a certificate template image** (`certificate-template.png`):
   - Recommended size: **1920x1080px** or **2480x3508px** (A4 size)
   - Format: PNG with transparent background or designed background
   - Leave space in the center for text overlay
   - Include decorative borders, logos, and static elements

2. **Template design areas**:
   ```
   ┌─────────────────────────────────────────┐
   │           [Logo/Header]                 │
   │                                         │
   │      CERTIFICATE OF COMPLETION          │
   │                                         │
   │         [Student Name Area]             │  ← Name will be placed here
   │                                         │
   │      [Course Name Area]                 │  ← Course name here
   │                                         │
   │         [Date Area]                     │  ← Issue date here
   │                                         │
   │  [Certificate Number]                   │  ← Bottom right
   └─────────────────────────────────────────┘
   ```

## Text Positioning Customization

Edit the `generateCertificateImage` method in `certificates.service.ts` to adjust text positions:

```typescript
// Student name position
ctx.fillText(studentName, canvas.width / 2, canvas.height / 2 - 50);

// Course name position
ctx.fillText(courseName, canvas.width / 2, canvas.height / 2 + 30);

// Issue date position
ctx.fillText(`Issued: ${issueDate}`, canvas.width / 2, canvas.height / 2 + 100);
```

**Y-axis positioning:**
- `canvas.height / 2 - 50` = 50px above center
- `canvas.height / 2` = center
- `canvas.height / 2 + 100` = 100px below center

## Custom Fonts (Optional)

To use custom fonts:

1. Place font files in `public/fonts/` directory
2. Register fonts before generating:

```typescript
import { registerFont } from 'canvas';

// In constructor or before generating
registerFont('public/fonts/YourFont.ttf', { family: 'YourFont' });

// Then use in generation
ctx.font = 'bold 60px YourFont';
```

## API Usage

### Generate Certificate

**POST** `/certificates`

```json
{
  "student_id": "uuid-of-student",
  "certificate_name": "English Language Certificate",
  "course_name": "IELTS Preparation Course",
  "description": "Successfully completed the course",
  "issue_date": "2025-12-18",
  "expiry_date": "2027-12-18"
}
```

**Response:**
```json
{
  "id": "cert-uuid",
  "student_id": "student-uuid",
  "certificate_number": "CERT-1734528000000-A1B2C3D4",
  "certificate_url": "/certificates/certificate-CERT-1734528000000-A1B2C3D4.png",
  "status": "issued",
  ...
}
```

### Get Student Certificates

**GET** `/certificates/student/:studentId`

### Verify Certificate

**GET** `/certificates/verify/:certificateNumber`

### Revoke Certificate

**PATCH** `/certificates/:id/revoke`

## Advanced Customization

### Multiple Languages

Adjust font size based on text length or language:

```typescript
// Auto-adjust font size for long names
const nameLength = studentName.length;
const fontSize = nameLength > 20 ? 40 : 60;
ctx.font = `bold ${fontSize}px Arial`;
```

### Add Logo/Signature

```typescript
// Load and draw logo
const logo = await loadImage('public/templates/logo.png');
ctx.drawImage(logo, 50, 50, 200, 100);

// Load and draw signature
const signature = await loadImage('public/templates/signature.png');
ctx.drawImage(signature, canvas.width - 300, canvas.height - 200, 250, 100);
```

### Add QR Code

Install qrcode:
```bash
npm install qrcode
```

Then generate QR code:
```typescript
import QRCode from 'qrcode';

const qrCodeDataUrl = await QRCode.toDataURL(
  `https://yourapp.com/verify/${certificateNumber}`
);
const qrImage = await loadImage(qrCodeDataUrl);
ctx.drawImage(qrImage, 100, canvas.height - 200, 150, 150);
```

## Troubleshooting

### Canvas Installation Issues (Windows)

If canvas installation fails, you may need:
- Visual Studio Build Tools
- Python 3.x

Or use pre-built binaries:
```bash
npm install canvas --canvas_binary_host_mirror=https://registry.npmmirror.com/-/binary/canvas/
```

### Font Not Found

Ensure Arial or your custom font is available. For Linux servers:
```bash
apt-get install -y fonts-liberation
```

### Template Not Found

Ensure template exists at the correct path:
```typescript
const templatePath = path.join(process.cwd(), 'public', 'templates', 'certificate-template.png');
```
