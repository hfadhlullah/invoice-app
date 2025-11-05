import { formatDate } from '../utils/dateFormatter';

function InvoicePreview({ invoiceData }) {
  // Provide default empty object if invoiceData is undefined
  const data = invoiceData || {};
  const formattedDate = formatDate(data.date, data.dateFormat || 'id');
  
  return (
    <div className="invoice-page w-full px-4 sm:px-8 lg:px-12 py-4 sm:py-6 lg:py-8 bg-white text-gray-900">
      {/* Header with logo, company name, and certifications */}
      <div className="border-b-2 border-gray-800 pb-3 mb-6 sm:mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-center sm:items-start mb-2 gap-4 sm:gap-0">
          {/* Logo left */}
          <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 flex items-center justify-center">
            {data.logoUrl ? (
              <img src={data.logoUrl} alt="Logo" className="max-w-full max-h-full object-contain" />
            ) : (
              <div className="w-full h-full bg-gray-100 border border-gray-300 flex items-center justify-center text-xs text-gray-500 print:bg-transparent print:border-gray-400">
                Logo
              </div>
            )}
          </div>
          
          {/* Company name center */}
          <div className="flex-1 text-center px-2 sm:px-4">
            <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-blue-900 tracking-wide break-words">{data.companyName}</div>
            <div className="text-xs mt-1 text-gray-700 break-words">{data.companyLicense}</div>
            <div className="text-sm italic mt-1 text-gray-700 break-words">{data.companyTagline}</div>
          </div>
          
          {/* Certifications right */}
          <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 flex items-center justify-center">
            {data.certUrl ? (
              <img src={data.certUrl} alt="Certificate" className="max-w-full max-h-full object-contain" />
            ) : (
              <div className="w-full h-full bg-gray-100 border border-gray-300 flex items-center justify-center text-xs text-gray-500 print:bg-transparent print:border-gray-400">
                Cert
              </div>
            )}
          </div>
        </div>
        <div className="text-center text-xs italic text-gray-700 break-words px-2">
          {data.companyAddress}
        </div>
      </div>

        {/* Title */}
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-blue-900 underline decoration-2 underline-offset-4">INVOICE</h1>
          {data.invoiceNumber && (
            <p className="text-sm text-gray-700 mt-2">No: {data.invoiceNumber}</p>
          )}
        </div>

        {/* Receipt details */}
        <div className="space-y-3 mb-8 sm:mb-12">
          <div className="flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-0">
            <div className="w-full sm:w-40 lg:w-48 text-sm sm:text-base text-blue-800 font-medium sm:font-normal">Sudah Terima Dari</div>
            <div className="flex-1 border-b border-gray-400 text-sm sm:text-base text-left pb-1 break-words">{data.customerName}</div>
          </div>
          
          <div className="flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-0">
            <div className="w-full sm:w-40 lg:w-48 text-sm sm:text-base text-blue-800 font-medium sm:font-normal">Banyaknya Uang</div>
            <div className="flex-1 border-b border-gray-400 text-sm sm:text-base text-left pb-1 break-words">{data.amountWords}</div>
          </div>
          
          <div className="flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-0">
            <div className="w-full sm:w-40 lg:w-48 text-sm sm:text-base text-blue-800 font-medium sm:font-normal">Untuk Pembayaran</div>
            <div className="flex-1 text-sm sm:text-base text-left break-words">{data.description}</div>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-0">
            <div className="w-full sm:w-40 lg:w-48"></div>
            <div className="flex-1 border-b border-gray-400 text-sm sm:text-base">&nbsp;</div>
          </div>
        </div>

        {/* Amount and signature section */}
        <div className="flex flex-col sm:flex-row justify-between items-start gap-6 sm:gap-4">
          {/* Amount box left */}
          <div className="border-4 border-gray-800 px-4 sm:px-6 py-3 w-full sm:w-auto">
            <div className="text-base sm:text-lg font-bold break-words">{data.currency} {data.amountNumber}</div>
          </div>

          {/* Signature block right */}
          <div className="text-left sm:text-right w-full sm:w-auto">
            <div className="text-sm sm:text-base mb-1 break-words">{data.location}, {formattedDate}</div>
            <div className="text-sm sm:text-base">Hormat Kami,</div>
            <div className="text-sm sm:text-base font-semibold break-words">{data.companyName}</div>
            <div className="text-sm sm:text-base mb-16 sm:mb-28 break-words">Kantor {data.location}</div>
            
            {/* Stamp placeholder */}
            {/* <div className="w-32 h-32 rounded-full border-4 border-red-600 flex items-center justify-center mb-2 mx-auto">
              <div className="text-center text-xs font-bold text-red-600">STAMP</div>
            </div> */}
            
            <div className="mt-2 border-t border-gray-800 pt-1">
              {data.signerName && (
                <div className="text-sm sm:text-base font-semibold break-words">{data.signerName}</div>
              )}
              <div className="text-sm sm:text-base break-words">{data.signerTitle}</div>
            </div>
          </div>
        </div>

        {/* Payment instructions at bottom */}
        <div className="mt-8 sm:mt-12 text-sm text-gray-700 italic">
          <div className="font-semibold">Instruksi Pembayaran:</div>
          <div className="break-words">{data.paymentInstructions}</div>
        </div>
    </div>
  );
}

export default InvoicePreview;
