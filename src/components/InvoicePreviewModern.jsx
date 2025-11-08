import { formatDate } from '../utils';

function InvoicePreviewModern({ data }) {
  const formattedDate = formatDate(data.date, data.dateFormat || 'id');
  
  return (
    <div className="w-full h-full bg-white">
      {/* Professional Header with Gradient */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-12 py-8">
        <div className="flex justify-between items-start">
          {/* Logo */}
          <div className="w-24 h-24 bg-white rounded-lg shadow-lg flex items-center justify-center p-2">
            {data.logoUrl && (
              <img src={data.logoUrl} alt="Logo" className="max-w-full max-h-full object-contain" />
            )}
          </div>
          
          {/* Company Info */}
          <div className="flex-1 px-8 text-right">
            <h1 className="text-3xl font-bold text-white tracking-tight">{data.companyName}</h1>
            {data.companyTagline && (
              <p className="text-blue-100 text-sm mt-1 italic">{data.companyTagline}</p>
            )}
            {data.companyLicense && (
              <p className="text-blue-200 text-xs mt-2">{data.companyLicense}</p>
            )}
            {data.companyAddress && (
              <p className="text-blue-100 text-xs mt-2">{data.companyAddress}</p>
            )}
          </div>

          {/* Certificate Badge */}
          <div className="w-20 h-20 bg-white rounded-full shadow-lg flex items-center justify-center">
            {data.certUrl && (
              <img src={data.certUrl} alt="Certificate" className="w-16 h-16 object-contain rounded-full" />
            )}
          </div>
        </div>
      </div>

      {/* Invoice Title & Number */}
      <div className="px-12 py-6 bg-gray-50 border-b-2 border-blue-600">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-4xl font-bold text-gray-900">INVOICE</h2>
            <p className="text-gray-600 text-sm mt-1">Invoice Number: <span className="font-mono font-semibold text-blue-600">{data.invoiceNumber}</span></p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">Date</p>
            <p className="font-semibold text-gray-900">{formattedDate}</p>
            <p className="text-sm text-gray-600 mt-2">Location</p>
            <p className="font-medium text-gray-900">{data.location}</p>
          </div>
        </div>
      </div>

      {/* Bill To Section */}
      <div className="px-12 py-8">
        <div className="mb-8">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Bill To</p>
          <p className="text-2xl font-bold text-gray-900">{data.customerName}</p>
        </div>

        {/* Invoice Details */}
        <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm">
          <div className="space-y-6">
            <div className="flex justify-between items-start pb-4 border-b border-gray-200">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600 mb-1">Description / Purpose</p>
                <p className="text-lg font-semibold text-gray-900">{data.description}</p>
              </div>
            </div>

            <div className="flex justify-between items-start pb-4 border-b border-gray-200">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600 mb-1">Amount in Words</p>
                <p className="text-base text-gray-700 italic">{data.amountWords}</p>
              </div>
            </div>

            {/* Total Due - Most Prominent */}
            <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl p-6 shadow-lg">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-blue-100 text-sm font-medium uppercase tracking-wide">Total Due</p>
                  <p className="text-4xl font-bold text-white mt-2 font-mono">
                    {data.currency} {data.amountNumber}
                  </p>
                </div>
                <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                  <span className="text-3xl">💰</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Instructions */}
      {data.paymentInstructions && (
        <div className="px-12 py-6 bg-yellow-50 border-y border-yellow-200">
          <div className="flex items-start gap-3">
            <span className="text-2xl">ℹ️</span>
            <div className="flex-1">
              <p className="font-semibold text-gray-900 mb-2">Payment Instructions</p>
              <p className="text-sm text-gray-700 leading-relaxed">{data.paymentInstructions}</p>
            </div>
          </div>
        </div>
      )}

      {/* Signature Section */}
      <div className="px-12 py-12">
        <div className="flex justify-between items-start">
          {/* Left side - company info */}
          <div className="flex-1">
            <p className="text-sm text-gray-600 mb-8">Respectfully,</p>
            <div className="space-y-1">
              <p className="font-bold text-gray-900 text-lg">{data.companyName}</p>
              <p className="text-gray-600 text-sm">Office: {data.location}</p>
            </div>
          </div>

          {/* Right side - signature */}
          <div className="w-64 text-center">
            <p className="text-sm text-gray-600 mb-1">{data.location}, {formattedDate}</p>
            
            {/* Signature space */}
            <div className="mt-8 mb-4 h-20 border-b-2 border-gray-300"></div>
            
            {/* Signer details */}
            <div className="space-y-1">
              {data.signerName && (
                <p className="font-bold text-gray-900">{data.signerName}</p>
              )}
              <p className="text-gray-700 text-sm">{data.signerTitle}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="px-12 py-6 bg-gray-900 text-center">
        <p className="text-gray-400 text-xs">
          This is a computer-generated invoice. Thank you for your business!
        </p>
      </div>
    </div>
  );
}

export default InvoicePreviewModern;
