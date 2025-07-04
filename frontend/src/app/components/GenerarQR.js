'use client';

import { useRef, useState } from 'react';
import { QRCodeCanvas } from 'qrcode.react';

export default function GenerarQR({ id, rut, nombre }) {
    const [qrValue, setQrValue] = useState('');
    const [showModal, setShowModal] = useState(false);
    const canvasRef = useRef(null);

    const handleGenerateQR = () => {
        const data = { id, rut, nombre };
        setQrValue(JSON.stringify(data));
        setShowModal(true);
    };

    const handleDownloadQR = () => {
        const canvas = canvasRef.current?.querySelector('canvas');
        if (!canvas) return;

        const pngUrl = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = pngUrl;
        link.download = `qr-cosechador-${id}.png`;
        link.click();
    };

    return (
        <>
            {/* Botón para generar QR */}
            <button
                onClick={handleGenerateQR}
                className="px-4 py-1 border rounded-sm text-sm font-medium bg-principal hover:bg-principal-hover text-white cursor-pointer"
            >
                Ver QR
            </button>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="flex flex-col justify-center bg-white rounded-lg shadow-lg p-6 text-center relative max-w-sm w-full">
                        <div className="flex justify-center" ref={canvasRef}>
                            <QRCodeCanvas
                                value={qrValue}
                                size={200}
                                bgColor="#ffffff"
                                fgColor="#000000"
                                marginSize={4}
                            />
                        </div>

                        <div className="mt-4 flex justify-center gap-3">
                            <button
                                onClick={handleDownloadQR}
                                className="px-4 py-2 bg-principal text-white rounded hover:bg-principal-hover"
                            >
                                Descargar
                            </button>
                            <button
                                onClick={() => setShowModal(false)}
                                className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
                            >
                                Cerrar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
