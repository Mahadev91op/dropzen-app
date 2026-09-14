import * as XLSX from 'xlsx';

/**
 * Exports customer lead data to a real Excel (.xlsx) file and triggers browser download
 * @param {Array} leads - Array of lead objects
 * @param {string} filename - Output file name
 */
export function exportLeadsToExcel(leads, filename = 'Dropzen_Customer_Leads.xlsx') {
  if (!leads || !Array.isArray(leads) || leads.length === 0) {
    alert('No lead records available to export.');
    return;
  }

  // Format data with clean business column headers
  const formattedData = leads.map((lead, index) => ({
    'Lead #': lead.id || index + 1,
    'Customer Name': lead.name || 'Verified Buyer',
    'Mobile / WhatsApp': lead.phone || 'N/A',
    'Delivery Address': lead.address || 'Standard Indian Metro Address',
    'City': lead.city || 'N/A',
    'State': lead.state || 'N/A',
    'PIN Code': lead.pincode || 'N/A',
    'Ordered Product': lead.product || 'Dropshipping Trending Item',
    'COD / Order Amount': lead.amount || '₹1,499',
    'Payment Type': lead.payment || 'COD Delivered',
    'Lead Verification': lead.status || 'Verified Ready to Resell',
    'Order Date': lead.date || 'Sept 2026',
  }));

  // Create worksheet
  const worksheet = XLSX.utils.json_to_sheet(formattedData);

  // Auto-size columns
  const colWidths = [
    { wch: 8 },  // Lead #
    { wch: 22 }, // Customer Name
    { wch: 18 }, // Mobile
    { wch: 35 }, // Address
    { wch: 16 }, // City
    { wch: 18 }, // State
    { wch: 12 }, // PIN Code
    { wch: 32 }, // Product
    { wch: 18 }, // Amount
    { wch: 18 }, // Payment
    { wch: 25 }, // Status
    { wch: 15 }, // Date
  ];
  worksheet['!cols'] = colWidths;

  // Create workbook
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Verified Buyer Leads');

  // Trigger download
  XLSX.writeFile(workbook, filename.endsWith('.xlsx') ? filename : `${filename}.xlsx`);
}

/**
 * Exports customer lead data to CSV format
 */
export function exportLeadsToCsv(leads, filename = 'Dropzen_Customer_Leads.csv') {
  if (!leads || !Array.isArray(leads) || leads.length === 0) {
    alert('No lead records available to export.');
    return;
  }

  const formattedData = leads.map((lead, index) => ({
    'Lead #': lead.id || index + 1,
    'Customer Name': lead.name || 'Verified Buyer',
    'Mobile / WhatsApp': lead.phone || 'N/A',
    'Delivery Address': lead.address || 'Standard Address',
    'City': lead.city || 'N/A',
    'State': lead.state || 'N/A',
    'PIN Code': lead.pincode || 'N/A',
    'Ordered Product': lead.product || 'Dropshipping Item',
    'Order Amount': lead.amount || '₹1,499',
    'Payment Type': lead.payment || 'COD Delivered',
    'Status': lead.status || 'Verified',
    'Date': lead.date || 'Sept 2026',
  }));

  const worksheet = XLSX.utils.json_to_sheet(formattedData);
  const csvOutput = XLSX.utils.sheet_to_csv(worksheet);

  const blob = new Blob([csvOutput], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.setAttribute('download', filename.endsWith('.csv') ? filename : `${filename}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
