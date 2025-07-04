"use client"

import { useState, useEffect } from "react"
import { Scanner } from '@yudiel/react-qr-scanner';
import { QrCode, Camera } from "lucide-react"

export default function EscanearQR() {
    const [result, setResult] = useState('');
    const [error, setError] = useState('');
    const [isScanning, setIsScanning] = useState(false);
    const [facingMode, setFacingMode] = useState('environment');
    const [isMobile, setIsMobile] = useState(false);
    const [contCapachos, setContCapachos] = useState("1");
    const [cosechas, setCosechas] = useState([]);
    const [cuadrillas, setCuadrillas] = useState([]);
    const [tiposCosecha, setTiposCosecha] = useState([]);
    const [cosechaSeleccionada, setCosechaSeleccionada] = useState("");
    const [qrData, setQrData] = useState(null);
    const [cosechasFiltradas, setCosechasFiltradas] = useState([]);
    const [cosechadorData, setCosechadorData] = useState(null);

    // Obtener datos iniciales
    useEffect(() => {
        fetchCosechas();
        fetchCuadrillas();
        fetchTiposCosecha();
    }, []);

    const fetchCosechas = async () => {
        try {
            const response = await fetch("http://localhost:8080/administrador/cosecha");
            const data = await response.json();
            setCosechas(data);
        } catch (err) {
            console.error("Error fetching cosechas:", err);
            setError("Error al cargar cosechas");
        }
    };

    const fetchCuadrillas = async () => {
        try {
            const response = await fetch("http://localhost:8080/cuadrillas");
            const data = await response.json();
            setCuadrillas(data);
        } catch (err) {
            console.error("Error fetching cuadrillas:", err);
            setError("Error al cargar cuadrillas");
        }
    };

    const fetchTiposCosecha = async () => {
        try {
            const response = await fetch("http://localhost:8080/administrador/getTipo_cosecha");
            const data = await response.json();
            setTiposCosecha(data);
        } catch (err) {
            console.error("Error fetching tipos de cosecha:", err);
            setError("Error al cargar tipos de cosecha");
        }
    };

    // Obtener datos del cosechador por ID
    const fetchCosechadorData = async (id) => {
        try {
            const response = await fetch(`http://localhost:8080/cosechadores/${id}`);
            const data = await response.json();
            setCosechadorData(data);
            return data;
        } catch (err) {
            console.error("Error fetching cosechador data:", err);
            setError("Error al cargar datos del cosechador");
            return null;
        }
    };

    // Filtrar cosechas activas por cuadrilla del cosechador
    const filtrarCosechasActivas = async (idCuadrilla) => {
        const cosechasActivas = cosechas.filter(cosecha => 
            cosecha.estado === 'activa' && cosecha.id_cuadrilla === idCuadrilla
        );
        setCosechasFiltradas(cosechasActivas);
    };

    const getNombreCuadrilla = (id) => {
        return cuadrillas.find(c => c.id === id)?.nombre || id;
    };

    const getNombreTipoCosecha = (id) => {
        return tiposCosecha.find(t => t.id === id)?.nombre || id;
    };

    const registrarCosecha = async () => {
        if (!qrData?.id || !cosechaSeleccionada || !contCapachos) {
            alert('Faltan datos obligatorios.');
            return;
        }

        const payload = {
            id_cosecha: parseInt(cosechaSeleccionada),
            id_cosechador: qrData.id,
            fecha: new Date().toISOString(),
            cantidad_capachos: parseInt(contCapachos),
        };

        try {
            const response = await fetch("http://localhost:8080/registro", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) throw new Error("Error en la respuesta del servidor");

            const data = await response.json();
            alert("Registro creado exitosamente");
            resetForm();
        } catch (error) {
            console.error("Error registrando cosecha:", error);
            alert("Ocurrió un error al registrar la cosecha.");
        }
    };

    const resetForm = () => {
        setResult('');
        setQrData(null);
        setCosechadorData(null);
        setContCapachos("1");
        setCosechaSeleccionada("");
        setCosechasFiltradas([]);
    };

    // Detectar si es móvil
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth <= 768 || /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const handleScan = async (results) => {
        if (results && results.length > 0) {
            const raw = results[0].rawValue;

            try {
                const parsed = JSON.parse(raw);
                if (!parsed.id) throw new Error("El campo 'id' es obligatorio.");

                // Obtener datos completos del cosechador
                const cosechador = await fetchCosechadorData(parsed.id);
                if (!cosechador) return;

                // Filtrar cosechas activas para su cuadrilla
                await filtrarCosechasActivas(cosechador.id_cuadrilla);

                setQrData({ id: parsed.id, rut: parsed.rut, nombre: parsed.nombre });
                setResult(raw);
                setIsScanning(false);
                setError('');
            } catch (err) {
                console.error('QR inválido:', err);
                setError('El código QR escaneado no es válido.');
                resetForm();
            }
        }
    };

    const handleError = (err) => {
        console.error('Error escaneando QR:', err);
        setError('Error al acceder a la cámara. Verifica los permisos.');
    };

    const startScanning = async () => {
        try {
            if (!navigator.mediaDevices?.getUserMedia) {
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
                <p className="text-gris-texto">Escanea el código QR del cosechador para registrar la entrega.</p>
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
                                            Presiona el botón para escanear el código QR del cosechador.
                                        </p>
                                    </div>
                                    <button 
                                        className="flex justify-center items-center gap-2 px-4 py-2 w-full md:w-auto bg-principal hover:bg-principal-hover text-white rounded cursor-pointer text-nowrap"
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
                                    <button 
                                        onClick={stopScanning} 
                                        className="flex justify-center items-center gap-2 px-4 py-2 w-full md:w-auto bg-principal hover:bg-principal-hover text-white rounded cursor-pointer text-nowrap"
                                    >
                                        Detener Escáner
                                    </button>
                                    {isMobile && (
                                        <button 
                                            onClick={switchCamera} 
                                            className="flex justify-center items-center gap-2 px-4 py-2 w-full md:w-auto bg-principal hover:bg-principal-hover text-white rounded cursor-pointer text-nowrap"
                                        >
                                            Cambiar Cámara ({facingMode === 'environment' ? 'Trasera' : 'Frontal'})
                                        </button>
                                    )}
                                </div>
                            </>
                        )}
                    </>
                ) : (
                    <div className="flex flex-col justify-start items-start gap-4 w-full">
                        <h3 className="text-xl font-bold">Datos del Cosechador</h3>
                        <form className="flex flex-col justify-start items-center gap-4 w-full">
                            {cosechadorData && (
                                <div className="w-full space-y-2">
                                    <div className="flex flex-col justify-start items-start gap-1 w-full">
                                        <label className="block text-sm text-[#333] font-medium mb-1">Nombre:</label>
                                        <div className="w-full px-3 py-2 border rounded-sm bg-gray-100 text-gray-700">
                                            {cosechadorData.nombre} {cosechadorData.p_apellido} {cosechadorData.s_apellido || ''}
                                        </div>
                                    </div>
                                    <div className="flex flex-col justify-start items-start gap-1 w-full">
                                        <label className="block text-sm text-[#333] font-medium mb-1">Cuadrilla:</label>
                                        <div className="w-full px-3 py-2 border rounded-sm bg-gray-100 text-gray-700">
                                            {getNombreCuadrilla(cosechadorData.id_cuadrilla)}
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="flex flex-col justify-start items-start gap-1 w-full">
                                <label htmlFor="cosechaSeleccionada" className="block text-sm text-[#333] font-medium mb-1">Cosecha Activa:</label>
                                <select
                                    id="cosechaSeleccionada"
                                    className="border rounded-sm px-3 py-2 w-full outline-[#16a34a]"
                                    value={cosechaSeleccionada}
                                    onChange={(e) => setCosechaSeleccionada(e.target.value)}
                                    required
                                >
                                    <option value="" disabled>Selecciona una cosecha</option>
                                    {cosechasFiltradas.length > 0 ? (
                                        cosechasFiltradas.map(cosecha => (
                                            <option key={cosecha.id} value={cosecha.id}>
                                                {getNombreTipoCosecha(cosecha.id_tipo_cosecha)} - Desde: {new Date(cosecha.fecha_inicio).toLocaleDateString()}
                                            </option>
                                        ))
                                    ) : (
                                        <option disabled>No hay cosechas activas para esta cuadrilla</option>
                                    )}
                                </select>
                            </div>

                            <div className="flex flex-col justify-start items-start gap-1 w-full">
                                <label htmlFor="contCapachos" className="block text-sm text-[#333] font-medium mb-1">Cantidad de capachos:</label>
                                <input
                                    id="contCapachos"
                                    type="number"
                                    min="1"
                                    className="border rounded-sm px-3 py-2 w-full outline-[#16a34a]"
                                    value={contCapachos}
                                    onChange={(e) => setContCapachos(e.target.value)}
                                    required
                                />
                            </div>
                        </form>

                        <div className="flex justify-center items-start gap-4 w-full">
                            <button
                                onClick={resetForm}
                                className="flex justify-center items-center gap-2 px-4 py-2 w-full md:w-auto bg-principal hover:bg-principal-hover text-white rounded cursor-pointer text-nowrap"
                            >
                                Escanear otro código
                            </button>
                            <button
                                onClick={registrarCosecha}
                                disabled={cosechasFiltradas.length === 0}
                                className={`flex justify-center items-center gap-2 px-4 py-2 w-full md:w-auto ${cosechasFiltradas.length === 0 ? 'bg-gray-400 cursor-not-allowed' : 'bg-principal hover:bg-principal-hover'} text-white rounded cursor-pointer text-nowrap`}
                            >
                                Registrar Entrega
                            </button>
                        </div>
                    </div>
                )}
            </main>
        </section>
    )
}