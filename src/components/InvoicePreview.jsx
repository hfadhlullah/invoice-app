import { formatDate } from '../utils/dateFormatter';

function InvoicePreview({ invoiceData }) {
  // Provide default empty object if invoiceData is undefined
  const data = invoiceData || {};
  const formattedDate = formatDate(data.date, data.dateFormat || 'id');
  
  return (
    <div className="invoice-page w-full px-12 py-8 bg-white text-gray-900">
      {/* Header with logo, company name, and certifications */}
      <div className="border-b-2 border-gray-800 pb-3 mb-8">
        <div className="flex justify-between items-start mb-2">
          {/* Logo left */}
          <div className="w-24 h-24 flex items-center justify-center">
            {data.logoUrl ? (
              <img src={data.logoUrl} alt="Logo" className="max-w-full max-h-full object-contain" />
            ) : (
              <div className="w-full h-full bg-gray-100 border border-gray-300 flex items-center justify-center text-xs text-gray-500 print:bg-transparent print:border-gray-400">
                Logo
              </div>
            )}
          </div>
          
          {/* Company name center */}
          <div className="flex-1 text-center px-4">
            <div className="text-3xl font-bold text-blue-900 tracking-wide">{data.companyName}</div>
            <div className="text-xs mt-1 text-gray-700">{data.companyLicense}</div>
            <div className="text-sm italic mt-1 text-gray-700">{data.companyTagline}</div>
          </div>
          
          {/* Certifications right */}
          <div className="w-24 h-24 flex items-center justify-center">
            {data.certUrl ? (
              <img src={data.certUrl} alt="Certificate" className="max-w-full max-h-full object-contain" />
            ) : (
              <div className="w-full h-full bg-gray-100 border border-gray-300 flex items-center justify-center text-xs text-gray-500 print:bg-transparent print:border-gray-400">
                Cert
              </div>
            )}
          </div>
        </div>
        <div className="text-center text-xs italic text-gray-700">
          {data.companyAddress}
        </div>
      </div>

        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-blue-900 underline decoration-2 underline-offset-4">INVOICE</h1>
          {data.invoiceNumber && (
            <p className="text-sm text-gray-700 mt-2">No: {data.invoiceNumber}</p>
          )}
        </div>

        {/* Receipt details */}
        <div className="space-y-3 mb-12">
          <div className="flex items-baseline">
            <div className="w-48 text-base text-blue-800">Sudah Terima Dari</div>
            <div className="flex-1 border-b border-gray-400 text-base text-left">{data.customerName}</div>
          </div>
          
          <div className="flex items-baseline">
            <div className="w-48 text-base text-blue-800">Banyaknya Uang</div>
            <div className="flex-1 border-b border-gray-400 text-base text-left">{data.amountWords}</div>
          </div>
          
          <div className="flex items-baseline">
            <div className="w-48 text-base text-blue-800">Untuk Pembayaran</div>
            <div className="flex-1 text-base text-left">{data.description}</div>
          </div>
          <div className="flex items-baseline">
            <div className="w-48"></div>
            <div className="flex-1 border-b border-gray-400 text-base">&nbsp;</div>
          </div>
        </div>

        {/* Amount and signature section */}
        <div className="flex justify-between items-start">
          {/* Amount box left */}
          <div className="border-4 border-gray-800 px-6 py-3">
            <div className="text-lg font-bold">{data.currency} {data.amountNumber}</div>
          </div>

          {/* Signature block right */}
          <div className="text-right">
            <div className="text-base mb-1">{data.location}, {formattedDate}</div>
            <div className="text-base">Hormat Kami,</div>
            <div className="text-base font-semibold">{data.companyName}</div>
            <div className="text-base mb-28">Kantor {data.location}</div>
            
            {/* Stamp placeholder */}
            {/* <div className="w-32 h-32 rounded-full border-4 border-red-600 flex items-center justify-center mb-2 mx-auto">
              <div className="text-center text-xs font-bold text-red-600">STAMP</div>
            </div> */}
            
            <div className="mt-2 border-t border-gray-800 pt-1">
              {data.signerName && (
                <div className="text-base font-semibold">{data.signerName}</div>
              )}
              <div className="text-base">{data.signerTitle}</div>
            </div>
          </div>
        </div>

        {/* Payment instructions at bottom */}
        <div className="mt-12 text-sm text-gray-700 italic">
          <div className="font-semibold">Instruksi Pembayaran:</div>
          <div>{data.paymentInstructions}</div>
        </div>
    </div>
  );
}

export default InvoicePreview;
