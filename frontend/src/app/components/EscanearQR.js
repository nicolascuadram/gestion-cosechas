"use client"

import { useState, useEffect } from "react"
import { Scanner } from '@yudiel/react-qr-scanner';
import { QrCode, Camera } from "lucide-react"

export default function EscanearQR() {
    const [result, setResult] = useState('');
    const [error, setError] = useState('');
    const [isScanning, setIsScanning] = useState(false);
    const [facingMode, setFacingMode] = useState('environment'); // 'user' para cámara frontal, 'environment' para trasera
    const [isMobile, setIsMobile] = useState(false);
    const [contCapachos, setContCapachos] = useState("1");
    const [tipoCultivo, setTipoCultivo] = useState("");

    const cultivos = [
        { id: 'manzana', nombre: 'Manzana' },
        { id: 'pera', nombre: 'Pera' }
    ];

    useEffect(() => {
        // Detectar si es móvil
        const checkMobile = () => {
            setIsMobile(window.innerWidth <= 768 || /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);

        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const handleScan = (result) => {
        if (result && result.length > 0) {
            setResult(result[0].rawValue);
            setIsScanning(false);
            setError('');
        }
    };

    const handleError = (err) => {
        console.error('Error escaneando QR:', err);
        setError('Error al acceder a la cámara. Verifica los permisos.');
    };

    const startScanning = async () => {
        try {
            // Verificar si el navegador soporta getUserMedia
            if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
                setError('Tu navegador no soporta acceso a la cámara');
                return;
            }

            setError('');
            setResult('');
            setIsScanning(true);
        } catch (err) {
            setError('Error al iniciar el escáner');
        }
    };

    const stopScanning = () => {
        setIsScanning(false);
    };

    const switchCamera = () => {
        setFacingMode(prev => prev === 'environment' ? 'user' : 'environment');
    };

    return (
        <section className="bg-white rounded-sm shadow-sm p-6">
            <header className="mb-6">
                <h2 className="text-2xl font-bold">Escaneo de Capachos</h2>
                <p className="text-gris-texto">Escanea el código QR de cada capacho lleno para registrar la entrega.</p>
            </header>
            <main className="flex flex-col justify-start items-center w-full gap-2">
                {!result ? (
                    <>
                        {!isScanning ? (
                            <>
                                <div className="flex justify-center items-start w-full py-4 md:py-12">
                                    <div className="p-4 bg-gris-fondo rounded-full scale-100 md:scale-120">
                                        <QrCode color="#737373" size={48} />
                                    </div>
                                </div>
                                <div className="flex flex-col justify-start items-center gap-4 w-full">
                                    <div className="flex justify-center items-start w-full">
                                        <p className="text-gris-texto text-center text-base font-medium">
                                            Presiona el botón para iniciar el escaneo del código QR del capacho.
                                        </p>
                                    </div>
                                    <button className="flex justify-center items-center gap-2 px-4 py-2 w-full md:w-auto bg-principal hover:bg-principal-hover text-white rounded cursor-pointer text-nowrap"
                                        onClick={startScanning}
                                    >
                                        <Camera color="#FFF" size={20} />
                                        Iniciar Escáner
                                    </button>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="flex flex-col justify-start items-center w-full gap-2 py-2">
                                    <Scanner
                                        onScan={handleScan}
                                        onError={handleError}
                                        constraints={{
                                            video: {
                                                facingMode: facingMode,
                                                width: { ideal: 640 },
                                                height: { ideal: 480 }
                                            }
                                        }}
                                        styles={{
                                            container: {
                                                width: '100%',
                                                maxWidth: '360px',
                                                height: 'auto'
                                            }
                                        }}
                                        components={{
                                            audio: false,
                                            finder: false
                                        }}
                                    />
                                    <div className="flex justify-center items-start w-full">
                                        <p className="text-gris-texto text-center text-base font-medium">
                                            {isMobile ? 'Apunta la cámara al código QR' : 'Coloca el código QR frente a la cámara'}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex justify-center items-start gap-4 w-full">
                                    <button onClick={stopScanning} className="flex justify-center items-center gap-2 px-4 py-2 w-full md:w-auto bg-principal hover:bg-principal-hover text-white rounded cursor-pointer text-nowrap">
                                        Detener Escáner
                                    </button>
                                    {isMobile && (
                                        <button onClick={switchCamera} className="flex justify-center items-center gap-2 px-4 py-2 w-full md:w-auto bg-principal hover:bg-principal-hover text-white rounded cursor-pointer text-nowrap">
                                            Cambiar Cámara ({facingMode === 'environment' ? 'Trasera' : 'Frontal'})
                                        </button>
                                    )}
                                </div>
                            </>
                        )}
                    </>
                ) : (
                    <div className="flex flex-col justify-start items-center gap-4 w-full">
                        <h3 className="text-xl font-bold">Resultado Escaneado:</h3>
                        <div className="flex justify-center items-start w-full bg-gris-fondo py-6 px-4 rounded">
                            {result}
                        </div>
                        <form className="flex flex-col justify-start items-center gap-4 w-full">
                            <div className="flex flex-col justify-start items-start gap-1 w-full">
                                <label htmlFor="contCapachos" className="block text-sm text-[#333] font-medium mb-1">Cantidad:</label>
                                <input
                                    id="contCapachos"
                                    type="number"
                                    className="border rounded-sm px-3 py-2 w-full outline-[#16a34a]"
                                    value={contCapachos}
                                    onChange={(e) => setContCapachos(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="flex flex-col justify-start items-start gap-1 w-full">
                                <label htmlFor="tipoCultivo" className="block text-sm text-[#333] font-medium mb-1">Tipo de Cultivo:</label>
                                <select
                                    id="tipoCultivo"
                                    className="border rounded-sm px-3 py-2 w-full outline-[#16a34a]"
                                    value={tipoCultivo}
                                    onChange={(e) => setTipoCultivo(e.target.value)}
                                    required
                                >
                                    <option value="" disabled>Selecciona un cultivo</option>
                                    {cultivos.map(cultivo => (
                                        <option key={cultivo.id} value={cultivo.id}>
                                            {cultivo.nombre}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </form>
                        <div className="flex justify-center items-start gap-4 w-full">
                            <button
                                onClick={() => {
                                    setResult('');
                                }}
                                className="flex justify-center items-center gap-2 px-4 py-2 w-full md:w-auto bg-principal hover:bg-principal-hover text-white rounded cursor-pointer text-nowrap"
                            >
                                Escanear otro código
                            </button>
                            <button
                                onClick={() => {
                                    /* Esto actualmente copia el resultado al portapapeles, cambiar a futuro */
                                    navigator.clipboard.writeText(result);
                                    alert('Resultado copiado al portapapeles');
                                }}
                                className="flex justify-center items-center gap-2 px-4 py-2 w-full md:w-auto bg-principal hover:bg-principal-hover text-white rounded cursor-pointer text-nowrap"
                            >
                                Registrar Entrega
                            </button>
                        </div>
                    </div>
                )}
            </main >
        </section >
    )
}