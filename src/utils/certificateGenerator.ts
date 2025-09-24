export interface CertificateData {
  recipientName: string;
  courseName: string;
  completionDate: string;
  score: number;
  certificateId: string;
}

export const generateCertificate = async (data: CertificateData): Promise<void> => {
  // Create canvas
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not get canvas context');

  // Set canvas size (certificate dimensions)
  canvas.width = 1200;
  canvas.height = 850;

  // Background gradient
  const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
  gradient.addColorStop(0, '#f8fafc');
  gradient.addColorStop(1, '#e2e8f0');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Border
  ctx.strokeStyle = '#16a34a';
  ctx.lineWidth = 8;
  ctx.strokeRect(40, 40, canvas.width - 80, canvas.height - 80);

  // Inner border
  ctx.strokeStyle = '#22c55e';
  ctx.lineWidth = 2;
  ctx.strokeRect(60, 60, canvas.width - 120, canvas.height - 120);

  // Title
  ctx.fillStyle = '#16a34a';
  ctx.font = 'bold 56px serif';
  ctx.textAlign = 'center';
  ctx.fillText('CERTIFICATE OF COMPLETION', canvas.width / 2, 180);

  // Subtitle
  ctx.fillStyle = '#374151';
  ctx.font = '28px sans-serif';
  ctx.fillText('This is to certify that', canvas.width / 2, 250);

  // Recipient name
  ctx.fillStyle = '#16a34a';
  ctx.font = 'bold 48px serif';
  ctx.fillText(data.recipientName, canvas.width / 2, 320);

  // Course completion text
  ctx.fillStyle = '#374151';
  ctx.font = '28px sans-serif';
  ctx.fillText('has successfully completed the training course', canvas.width / 2, 380);

  // Course name
  ctx.fillStyle = '#16a34a';
  ctx.font = 'bold 36px serif';
  ctx.fillText(`"${data.courseName}"`, canvas.width / 2, 450);

  // Score
  ctx.fillStyle = '#374151';
  ctx.font = '24px sans-serif';
  ctx.fillText(`with a score of ${data.score}%`, canvas.width / 2, 500);

  // Completion date
  ctx.fillText(`on ${data.completionDate}`, canvas.width / 2, 540);

  // Certificate ID
  ctx.fillStyle = '#6b7280';
  ctx.font = '18px monospace';
  ctx.fillText(`Certificate ID: ${data.certificateId}`, canvas.width / 2, 580);

  // Signature line
  ctx.fillStyle = '#374151';
  ctx.font = '20px sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText('Authorized by:', 200, 680);
  
  // Signature
  ctx.font = 'italic 24px serif';
  ctx.fillText('Evergreen Group Training Department', 200, 720);
  
  // Line under signature
  ctx.strokeStyle = '#374151';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(200, 730);
  ctx.lineTo(500, 730);
  ctx.stroke();

  // Date issued
  ctx.font = '16px sans-serif';
  ctx.textAlign = 'right';
  ctx.fillText(`Issued: ${new Date().toLocaleDateString()}`, canvas.width - 200, 720);

  // Download the certificate
  canvas.toBlob((blob) => {
    if (blob) {
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `certificate-${data.courseName.replace(/\s+/g, '-').toLowerCase()}-${data.certificateId}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  }, 'image/png');
};

export const generateCertificateId = (): string => {
  return 'CERT-' + Date.now().toString(36).toUpperCase() + '-' + Math.random().toString(36).substr(2, 5).toUpperCase();
};