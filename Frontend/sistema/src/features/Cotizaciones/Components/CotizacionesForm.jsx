


export default function CotizacionesForm({isOpen, onClose, title, children}) {

    if(!isOpen) return null

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl w-full max-w-4xl overflow-hidden flex flex-col max-h-[90vh]">

                {/* Header */}
                <div className="flex items-center justify-between px-8 py-6 border-gray-200 bg-blue-50">
                    <h2 className="text-2xl font-bold mb-4">{title}</h2>

                    <button 
                        onClick={onClose} 
                        className="text-gray-500 hover:text-gray-700"
                        >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Content */}
                <div className="overflow-y-auto flex-1 p-8">
                    {children}
                </div>
            </div>
        </div>
    )
}