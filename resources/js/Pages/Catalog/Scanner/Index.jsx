import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { useState, useEffect, useRef } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import Modal from '@/Components/Modal';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import { Camera, Scan, Package, AlertCircle, CheckCircle2, ShoppingCart, Trash2 } from 'lucide-react';
import axios from 'axios';

export default function Index() {
    const [scannedResult, setScannedResult] = useState(null);
    const [product, setProduct] = useState(null);
    const [isAdjustModalOpen, setIsAdjustModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const scannerRef = useRef(null);

    // Form data for quick adjustment
    const [formData, setFormData] = useState({
        quantity: 1,
        type: 'IN',
        notes: '',
    });
    const [scanMode, setScanMode] = useState('camera'); // 'camera' or 'machine'
    const machineInputRef = useRef(null);

    useEffect(() => {
        let scanner = null;
        if (scanMode === 'camera') {
            scanner = new Html5QrcodeScanner('reader', {
                fps: 10,
                qrbox: { width: 250, height: 250 },
                rememberLastUsedCamera: true,
                supportedScanTypes: [0]
            });

            scanner.render(onScanSuccess, (err) => {
                // Ignore standard "not found" errors which happen 30 times a second
                if (err?.includes("NotFound")) return;
                console.error("Scanner error:", err);
            });
        }

        if (scanMode === 'machine') {
            machineInputRef.current?.focus();
        }

        return () => {
            if (scanner) {
                scanner.clear().catch(error => console.error("Failed to clear scanner. ", error));
            }
        };
    }, [scanMode]);

    // Handle machine (keyboard) scan
    const handleMachineScan = (e) => {
        if (e.key === 'Enter') {
            const barcode = e.target.value.trim();
            if (barcode) {
                setScannedResult(barcode);
                playBeep();
                lookupProduct(barcode);
                e.target.value = '';
            }
        }
    };

    const playBeep = () => {
        const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/766/766-preview.mp3');
        audio.play().catch(e => console.log("Audio play blocked by browser."));
    };

    function onScanSuccess(decodedText, decodedResult) {
        if (decodedText !== scannedResult) {
            setScannedResult(decodedText);
            playBeep();
            lookupProduct(decodedText);
        }
    }

    function onScanFailure(error) {
        // quiet fail
        // now how will it fail? is there no code to be written here?
        
    }

    const lookupProduct = async (barcode) => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await axios.get(route('api.products.lookup', barcode));
            setProduct(response.data);
            setIsAdjustModalOpen(true);
        } catch (err) {
            setError(err.response?.data?.message || 'Product not found');
            setScannedResult(null);
        } finally {
            setIsLoading(false);
        }
    };

    const handleAdjustment = (e) => {
        e.preventDefault();
        router.post(route('products.stock', product.id), formData, {
            onSuccess: () => {
                setIsAdjustModalOpen(false);
                setScannedResult(null);
                setProduct(null);
                setFormData({ quantity: 1, type: 'IN', notes: '' });
                // Success toast handled by layout
            },
        });
    };

    return (
        <AuthenticatedLayout header="Scan Center">
            <Head title="Scan Center" />

            <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden mb-8">
                    <div className="p-8 bg-slate-900 text-white flex justify-between items-center transition-colors">
                        <div>
                            <h2 className="text-2xl font-bold flex items-center gap-2 text-indigo-400">
                                <Scan className="w-6 h-6" />
                                Interactive Scan Center
                            </h2>
                            <p className="text-slate-400 mt-1">Select your scanning preference below.</p>
                        </div>
                        <div className="flex bg-slate-800 p-1 rounded-xl border border-slate-700">
                            <button 
                                onClick={() => setScanMode('camera')}
                                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${scanMode === 'camera' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
                            >
                                <Camera className="w-3 h-3" />
                                Camera
                            </button>
                            <button 
                                onClick={() => setScanMode('machine')}
                                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${scanMode === 'machine' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
                            >
                                <Scan className="w-3 h-3" />
                                QR Machine
                            </button>
                        </div>
                    </div>

                    <div className="p-8">
                        {scanMode === 'camera' ? (
                            <div className="animate-in fade-in zoom-in-95 duration-500">
                                <div id="reader" className="w-full rounded-2xl overflow-hidden border-2 border-dashed border-slate-200 bg-slate-50 min-h-[300px]"></div>
                                <div className="mt-4 p-4 bg-amber-50 border border-amber-100 rounded-xl flex items-center gap-3 text-amber-700 text-xs font-medium">
                                    <AlertCircle className="w-4 h-4" />
                                    <span>If camera doesn't show, ensure you are on <strong>HTTPS</strong> and have granted permissions.</span>
                                </div>
                            </div>
                        ) : (
                            <div className="py-20 flex flex-col items-center justify-center border-2 border-dashed border-indigo-200 bg-indigo-50/30 rounded-2xl animate-in slide-in-from-bottom-4 duration-500">
                                <div className="h-20 w-20 rounded-full bg-indigo-100 flex items-center justify-center mb-6 ring-8 ring-indigo-50">
                                    <Scan className="w-10 h-10 text-indigo-600 animate-pulse" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-800">Machine Mode Active</h3>
                                <p className="text-slate-500 mt-2 mb-8 max-w-xs text-center">Your QR Scanner machine is ready. Point it at a barcode and pull the trigger.</p>
                                
                                <div className="w-full max-w-md relative">
                                    <TextInput 
                                        ref={machineInputRef}
                                        onKeyDown={handleMachineScan}
                                        placeholder="Waiting for hardware scan..."
                                        className="w-full h-16 px-6 text-xl font-bold border-indigo-200 focus:border-indigo-500 focus:ring-indigo-500 text-center rounded-2xl shadow-sm"
                                    />
                                    <div className="absolute inset-y-0 right-4 flex items-center">
                                        <div className="h-2 w-2 rounded-full bg-emerald-500 animate-ping"></div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {error && (
                            <div className="mt-6 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600 animate-in fade-in slide-in-from-top-2">
                                <AlertCircle className="w-5 h-5 shrink-0" />
                                <span className="font-semibold text-sm">{error}</span>
                            </div>
                        )}

                        {isLoading && (
                            <div className="mt-6 flex flex-col items-center justify-center py-10 text-slate-400">
                                <div className="h-10 w-10 border-4 border-indigo-600/20 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
                                <p className="font-medium">Searching catalog...</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Instructions */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center text-center">
                        <div className="h-10 w-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center mb-3">
                            <span className="font-bold">1</span>
                        </div>
                        <p className="text-sm font-semibold text-slate-700">Allow Camera access when prompted</p>
                    </div>
                    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center text-center">
                        <div className="h-10 w-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center mb-3">
                            <span className="font-bold">2</span>
                        </div>
                        <p className="text-sm font-semibold text-slate-700">Align barcode within the scanning box</p>
                    </div>
                    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center text-center">
                        <div className="h-10 w-10 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center mb-3">
                            <span className="font-bold">3</span>
                        </div>
                        <p className="text-sm font-semibold text-slate-700">Review product and adjust stock</p>
                    </div>
                </div>
            </div>

            {/* Quick Adjust Modal */}
            <Modal show={isAdjustModalOpen} onClose={() => setIsAdjustModalOpen(false)}>
                {product && (
                    <div className="p-0 overflow-hidden">
                        <div className="p-8 bg-indigo-600 text-white relative">
                            <div className="flex gap-4 items-center">
                                {product.image_url ? (
                                    <img src={product.image_url} alt={product.name} className="w-16 h-16 rounded-xl object-cover bg-white p-1" />
                                ) : (
                                    <div className="w-16 h-16 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                                        <Package className="w-8 h-8 text-white" />
                                    </div>
                                )}
                                <div className="min-w-0">
                                    <p className="text-xs font-bold uppercase tracking-widest text-indigo-200">{product.sku}</p>
                                    <h3 className="text-xl font-bold truncate">{product.name}</h3>
                                </div>
                            </div>
                            <div className="absolute top-8 right-8">
                                <div className="px-3 py-1 bg-white/10 backdrop-blur-md rounded-lg border border-white/20 flex flex-col items-center">
                                    <span className="text-[10px] font-bold uppercase text-indigo-100">Stock</span>
                                    <span className="text-xl font-black">{product.current_stock}</span>
                                </div>
                            </div>
                        </div>

                        <form onSubmit={handleAdjustment} className="p-8 space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <InputLabel value="Adjustment Type" className="mb-2" />
                                    <div className="grid grid-cols-1 gap-2">
                                        <button
                                            type="button"
                                            onClick={() => setFormData({ ...formData, type: 'IN' })}
                                            className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl border-2 transition-all font-bold ${formData.type === 'IN'
                                                ? 'bg-emerald-50 border-emerald-500 text-emerald-700'
                                                : 'bg-slate-50 border-slate-100 text-slate-500 hover:border-slate-200'
                                                }`}
                                        >
                                            <ShoppingCart className="w-4 h-4" />
                                            Stock IN
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setFormData({ ...formData, type: 'OUT' })}
                                            className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl border-2 transition-all font-bold ${formData.type === 'OUT'
                                                ? 'bg-red-50 border-red-500 text-red-700'
                                                : 'bg-slate-50 border-slate-100 text-slate-500 hover:border-slate-200'
                                                }`}
                                        >
                                            <Trash2 className="w-4 h-4" />
                                            Stock OUT
                                        </button>
                                    </div>
                                </div>

                                <div>
                                    <InputLabel value="Quantity" className="mb-2" />
                                    <TextInput
                                        type="number"
                                        min="1"
                                        className="w-full h-[104px] text-center text-4xl font-black rounded-xl border-slate-200 bg-slate-50 focus:bg-white focus:ring-indigo-500"
                                        value={formData.quantity}
                                        onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 0 })}
                                    />
                                </div>
                            </div>

                            <div>
                                <InputLabel value="Movement Notes (Optional)" className="mb-2" />
                                <textarea
                                    className="w-full rounded-xl border-slate-200 bg-slate-50 focus:bg-white focus:ring-indigo-500 min-h-[80px]"
                                    placeholder="Reason for adjustment..."
                                    value={formData.notes}
                                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                />
                            </div>

                            <div className="flex gap-3 pt-4">
                                <SecondaryButton onClick={() => setIsAdjustModalOpen(false)} className="flex-1 justify-center h-12">
                                    Cancel
                                </SecondaryButton>
                                <PrimaryButton className="flex-1 justify-center h-12 bg-indigo-600 flex items-center gap-2">
                                    <CheckCircle2 className="w-5 h-5" />
                                    Confirm Adjustment
                                </PrimaryButton>
                            </div>
                        </form>
                    </div>
                )}
            </Modal>
        </AuthenticatedLayout>
    );
}
