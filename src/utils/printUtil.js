/**
 * Universal Print Utility
 * Optimized for Thermal POS Printing (80mm / D-Mart Style)
 */
let isPrinting = false;

export const printContent = (elementId = 'printable-area') => {
  if (isPrinting) {
    console.warn('[PrintUtil] Print already in progress, ignoring request.');
    return;
  }
  isPrinting = true;

  const source = document.getElementById(elementId) 
    || document.querySelector(`.${elementId}`)
    || document.querySelector('.printable-area')
    || document.querySelector('.print-section');

  if (!source) {
    console.warn('[PrintUtil] No printable element found for:', elementId);
    window.print(); // fallback
    isPrinting = false;
    return;
  }

  // Create a hidden iframe for clean, isolated printing
  const iframe = document.createElement('iframe');
  iframe.style.position = 'fixed';
  iframe.style.top = '-10000px';
  iframe.style.left = '-10000px';
  iframe.style.width = '80mm'; 
  iframe.style.height = '100%';
  iframe.style.border = 'none';
  document.body.appendChild(iframe);

  const doc = iframe.contentDocument || iframe.contentWindow.document;

  doc.open();
  doc.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8" />
      <title></title>
      <style>
        /* ===== Thermal POS Receipt CSS ===== */
        @page { 
          size: 80mm auto; 
          margin: 0 !important; 
        }

        @media print {
          html, body {
            margin: 0 !important;
            padding: 0 !important;
            background: #fff !important;
            width: 100% !important;
            height: auto !important;
            -webkit-print-color-adjust: exact;
          }

          body * {
            visibility: hidden !important;
          }

          .receipt-print,
          .receipt-print * {
            visibility: visible !important;
          }

          .receipt-print {
            position: absolute !important;
            top: 0 !important;
            left: 50% !important;
            transform: translateX(-50%) !important;
            width: 80mm !important;
            max-width: 80mm !important;
            margin: 0 auto !important;
            padding: 4mm !important;
            background: #fff !important;
            color: #000 !important;
            box-shadow: none !important;
            border: none !important;
            page-break-after: avoid !important;
            font-family: 'Courier New', Courier, monospace !important;
          }
        }

        /* ===== General Styling ===== */
        * { box-sizing: border-box; margin: 0; padding: 0; }
        
        body {
          font-family: 'Courier New', Courier, monospace;
          background: #fff;
          width: 100%;
        }

        .receipt-print {
          width: 80mm;
          margin: 0 auto;
          padding: 4mm;
        }

        /* Utility classes */
        .text-center { text-align: center; }
        .text-right { text-align: right; }
        .font-black { font-weight: 900; }
        .font-bold { font-weight: 700; }
        .uppercase { text-transform: uppercase; }
        .flex { display: flex; }
        .justify-between { justify-content: space-between; }
        .items-center { align-items: center; }
        .w-full { width: 100%; }
        .text-xs { font-size: 10px; }
        .text-sm { font-size: 12px; }
        .text-base { font-size: 14px; }
        .text-lg { font-size: 16px; }
        .text-xl { font-size: 18px; }
        .text-2xl { font-size: 22px; }
        .border-b-2 { border-bottom: 2px solid #000; }
        .border-t-2 { border-top: 2px solid #000; }
        .border-dashed { border-style: dashed !important; border-width: 1px !important; }
        .my-4 { margin-top: 16px; margin-bottom: 16px; }
        .space-y-1 > * + * { margin-top: 4px; }
        .space-y-2 > * + * { margin-top: 8px; }
        .pt-4 { padding-top: 16px; }
        
        table { width: 100%; border-collapse: collapse; }
        th, td { font-size: 11px; padding: 4px 0; }
        .divide-y-dashed > * + * { border-top: 1px dashed #000; }
      </style>
    </head>
    <body>
      <div class="receipt-print active-print">
        ${source.innerHTML}
      </div>
    </body>
    </html>
  `);
  doc.close();

  let hasPrinted = false;

  const triggerPrint = () => {
    if (hasPrinted) return;
    hasPrinted = true;
    try {
      iframe.contentWindow.focus();
      iframe.contentWindow.print();
    } catch (e) {
      console.error('[PrintUtil] Print failed:', e);
    }
    
    setTimeout(() => {
      if (document.body.contains(iframe)) {
        document.body.removeChild(iframe);
      }
      isPrinting = false;
    }, 1000);
  };

  iframe.contentWindow.onafterprint = () => {
    isPrinting = false;
  };

  iframe.onload = () => {
    setTimeout(triggerPrint, 300);
  };

  setTimeout(triggerPrint, 2000);
};

export default printContent;
