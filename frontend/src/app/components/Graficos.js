"use client";

import { useEffect, useState } from "react";
import {
  VictoryChart, VictoryLine, VictoryBar, VictoryPie,
  VictoryAxis, VictoryTooltip, VictoryLabel, VictoryVoronoiContainer, VictoryScatter
} from "victory";

export default function EstadisticasDashboard() {
  const [cosechas, setCosechas] = useState([]);
  const [tiposCosecha, setTiposCosecha] = useState([]);
  const [selectedCosecha, setSelectedCosecha] = useState(null);
  const [porDia, setPorDia] = useState([]);
  const [porCosechador, setPorCosechador] = useState([]);
  const [porCosecha, setPorCosecha] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentCosechaInfo, setCurrentCosechaInfo] = useState({});

    
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [resCosechas, resTipos] = await Promise.all([
          fetch("http://localhost:8080/administrador/cosechas/list"),
          fetch("http://localhost:8080/administrador/getTipo_cosecha")
        ]);

        const [dataCosechas, dataTipos] = await Promise.all([
          resCosechas.json(),
          resTipos.json()
        ]);

        setCosechas(dataCosechas);
        setTiposCosecha(dataTipos);
      } catch (error) {
        console.error("Error al cargar datos iniciales:", error);
      }
    };

    fetchInitialData();
  }, []);

useEffect(() => {
  const fetchData = async () => {
    if (cosechas.length === 0 || tiposCosecha.length === 0) return;

    setLoading(true);
    try {
      const baseUrl = "http://localhost:8080";
      const cosechaParam = selectedCosecha ? `/${selectedCosecha}` : "";

      // Si hay una cosecha seleccionada
      if (selectedCosecha) {
        const cosecha = cosechas.find(c => c.id.toString() === selectedCosecha.toString());
        if (cosecha) {
          const tipoEncontrado = tiposCosecha.find(t => t.id.toString() === cosecha.id_tipo_cosecha.toString());
          const resTotal = await fetch(`${baseUrl}/administrador/graficos/${selectedCosecha}/totalcapachos`);
          const { total } = await resTotal.json();

          setCurrentCosechaInfo({
            tipo: tipoEncontrado?.nombre || 'Desconocido',
            fechaInicio: cosecha.fecha_inicio ? new Date(cosecha.fecha_inicio).toLocaleDateString() : 'No especificada',
            fechaFin: cosecha.fecha_fin ? new Date(cosecha.fecha_fin).toLocaleDateString() : 'En curso',
            estado: cosecha.estado || 'Desconocido',
            totalCapachos: total || 0
          });

          const [resDia, resCosechador] = await Promise.all([
            fetch(`${baseUrl}/administrador/graficos/getcapachosdia${cosechaParam}`),
            fetch(`${baseUrl}/administrador/graficos/getcapachoscosechador${cosechaParam}`)
          ]);

          const [dataDia, dataCosechador] = await Promise.all([
            resDia.json(),
            resCosechador.json()
          ]);

          setPorDia(dataDia.map(item => ({ 
            x: item.fecha ? new Date(item.fecha) : 'Sin fecha', 
            y: item.total_capachos || 0 
          })));

          const cosechadoresConOrden = dataCosechador.map((item, index) => ({ 
            x: item.nombre || 'Sin nombre', 
            y: item.total || 0,
            orden: index + 1 
          }));

          setPorCosechador(cosechadoresConOrden);

          // Limpiar gráfico 3 si estás viendo uno seleccionado
          setPorCosecha([]);
        }
      } else {
        // Si NO hay cosecha seleccionada, mostrar gráfico 3
        const resCuadrilla = await fetch(`${baseUrl}/administrador/graficos/getcapachosporcosecha`);
        if (!resCuadrilla.ok) throw new Error("Error al cargar gráfico por cuadrilla");
        const dataCuadrilla = await resCuadrilla.json();

        setPorCosecha(dataCuadrilla.map(item => ({ 
  x: `Cosecha #${item.id_cosecha} - ${item.tipo_cosecha}`, 
  y: item.total_capachos || 0 
})));

        // Limpiar datos de gráficos 1 y 2
        setPorDia([]);
        setPorCosechador([]);
        setCurrentCosechaInfo({});
      }
    } catch (error) {
      console.error("Error al cargar estadísticas:", error);
    } finally {
      setLoading(false);
    }
  };

  fetchData();
}, [selectedCosecha, cosechas, tiposCosecha]);


  return (
    <div className="bg-white rounded-sm shadow-sm p-6 w-full">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h2 className="text-xl font-bold">Dashboard de Estadísticas</h2>
          <p className="text-[#737373]">Visualiza el rendimiento de las cosechas</p>
        </div>
      </div>

      <div className="bg-white p-4 rounded-sm shadow-sm mb-6">
        <CosechaSelector cosechas={cosechas} selectedCosecha={selectedCosecha} onSelect={setSelectedCosecha} />
        {selectedCosecha && (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-5 gap-4 text-sm text-center">
            <InfoBox label="Tipo de Cosecha" value={currentCosechaInfo.tipo} color="blue" center />
            <InfoBox label="Fecha Inicio" value={currentCosechaInfo.fechaInicio} color="green" />
            <InfoBox label="Fecha Fin" value={currentCosechaInfo.fechaFin} color="yellow" />
            <InfoBox label="Estado" value={currentCosechaInfo.estado} color="purple" />
            <InfoBox label="Total Capachos" value={currentCosechaInfo.totalCapachos} color="orange" />
            
          </div>
        )}
      </div>

      <div className="overflow-y-auto max-h-[calc(100vh-120px)] px-2 space-y-8">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="space-y-8">
            {selectedCosecha ? (
              <>

{/* 📅 Capachos por Día */}
<ChartContainer title={`📅 Capachos por Día - Cosecha #${selectedCosecha}`}>
  {porDia.length > 0 && (
    <VictoryChart
      containerComponent={<VictoryVoronoiContainer />}
      domainPadding={{ x: [25, 25] }}
      padding={{ top: 10, bottom: 40, left: 1, right: 1}}
      domain={{
        y: [
          Math.min(...porDia.map(d => d.y)) - 10, 
          Math.max(...porDia.map(d => d.y)) + 20
        ]
      }}
    >
      <VictoryAxis
        tickValues={porDia.map(d => d.x)}
        tickFormat={(t) => {
          const date = new Date(t);
          return `${String(date.getDate()).padStart(2, "0")}-${String(date.getMonth() + 1).padStart(2, "0")}`;
        }}
        style={{
          tickLabels: { 
            fontSize: 12,
            textAnchor: "middle",
            fill: "#4B5563"
          },
          axis: { stroke: "#E5E7EB" }
        }}
        tickLabelComponent={<VictoryLabel dy={15} />}
      />

      <VictoryAxis
        dependentAxis
        style={{ 
          tickLabels: { 
            fontSize: 12, 
            padding: 5, 
            fill: "#4B5563" 
          },
          axis: { stroke: "#E5E7EB" }
        }}
      />

      <VictoryLine
        data={porDia}
        interpolation="natural"
        style={{
          data: { 
            stroke: "#3B82F6", 
            strokeWidth: 3,
            strokeLinecap: "round"
          }
        }}
        labels={({ datum }) => {
          const date = new Date(datum.x);
          return `${String(date.getDate()).padStart(2, "0")}-${String(date.getMonth() + 1).padStart(2, "0")}-${date.getFullYear()}: ${datum.y} capachos`;
        }}
        labelComponent={
          <VictoryTooltip
            style={{ fontSize: 12 }}
            flyoutStyle={{ 
              fill: "white", 
              stroke: "#E5E7EB",
              strokeWidth: 1
            }}
            constrainToVisibleArea
            dy={-10}
          />
        }
      />

      <VictoryScatter
        data={porDia}
        size={5}
        style={{
          data: {
            fill: "#3B82F6",
            stroke: "#1D4ED8",
            strokeWidth: 1.5
          }
        }}
      />
    </VictoryChart>
  )}
</ChartContainer>

{/* 👨‍🌾 Top Cosechadores */}
<ChartContainer title={`👨‍🌾 Top Cosechadores - Cosecha #${selectedCosecha}`}>
  {porCosechador.length > 0 && (
    <VictoryChart
      domainPadding={40}
      padding={{ top: 10, bottom: 40, left: 1, right: 1 }}
    >
      <VictoryAxis
        style={{
          tickLabels: { 
            fontSize: 12, 
            angle: 0, 
            padding: 10, 
            fill: "#4B5563"
          },
          axis: { stroke: "#E5E7EB" }
        }}
      />

      <VictoryAxis
        dependentAxis
        tickFormat={(t) => Number.isInteger(t) ? t : null}
        style={{
          tickLabels: { 
            fontSize: 12, 
            padding: 5, 
            fill: "#4B5563" 
          },
          axis: { stroke: "#E5E7EB" }
        }}
      />

      <VictoryBar
        data={porCosechador}
        labels={({ datum }) =>
          `#${datum.orden} - ${datum.x}: ${datum.y} capachos`
        }
        labelComponent={
          <VictoryTooltip
            style={{ fontSize: 12 }}
            flyoutStyle={{ fill: "white", stroke: "#E5E7EB" }}
            constrainToVisibleArea
            dy={-10}
          />
        }
        style={{
          data: {
            fill: "#10B981",
            width: 20,
            stroke: "#047857",
            strokeWidth: 1.5
          },
          labels: { fontSize: 12, fill: "#1F2937" }
        }}
        animate={{ duration: 600, easing: "quadInOut" }}
      />
    </VictoryChart>
  )}
</ChartContainer>



              </>
            ) : (
                <div className="bg-white p-4 rounded-sm shadow-sm border">
      <h2 className="text-lg font-semibold mb-4">
        Distribución de Capachos por Cosecha
      </h2>
      <div className="h-96">
        {porCosecha.length > 0 ? (
          <div className="flex flex-col md:flex-row h-full">
            <div className="w-full md:w-2/3 h-full">
              <VictoryPie
                data={porCosecha}
                innerRadius={100}
                padAngle={3}
                labelRadius={120}
                labels={({ datum }) => {
                  const total = porCosecha.reduce((sum, i) => sum + i.y, 0);
                  const percentage = ((datum.y / total) * 100).toFixed(1);
                  return `${datum.x}\n${datum.y} capachos\n${percentage}%`;
                }}

colorScale={[
  "#f43f5e", "#10b981", "#a855f7", "#f59e0b", "#3b82f6",
  "#eab308", "#8b5cf6", "#14b8a6", "#f97316", "#22c55e",
  "#ec4899", "#0ea5e9", "#84cc16", "#ef4444", "#06b6d4",
  "#c084fc", "#4ade80", "#fb923c", "#60a5fa", "#34d399",
  "#facc15", "#38bdf8", "#a3e635", "#7c3aed", "#2dd4bf",
  "#fde047", "#f472b6", "#5eead4", "#fcd34d", "#6366f1",
  "#86efac", "#fca5a5", "#a78bfa", "#bef264", "#93c5fd",
  "#fda4af", "#7dd3fc", "#bbf7d0", "#e879f9", "#fef08a",
  "#c4b5fd", "#67e8f9", "#d9f99d", "#b91c1c", "#0284c7",
  "#16a34a", "#b45309", "#7e22ce", "#991b1b", "#15803d"
]}

                labelComponent={
                  <VictoryTooltip
                    flyoutStyle={{ stroke: "#e5e7eb", fill: "#f9fafb" }}
                    style={{ fontSize: 12, fontWeight: "bold", fill: "#111827" }}
                  />
                }
                style={{
                  data: { stroke: "#fff", strokeWidth: 2 },
                  labels: { fontSize: 12, fill: "#1f2937" }
                }}
                animate={{ duration: 800, easing: "circleInOut" }}
              />
            </div>
            <div className="w-full md:w-1/3 overflow-y-auto max-h-96 p-2">
                <ul className="divide-y divide-gray-200 text-sm">
  {porCosecha.map((item, idx) => {
    const total = porCosecha.reduce((sum, i) => sum + i.y, 0);
    const percentage = ((item.y / total) * 100).toFixed(1);
    return (
      <li
        key={idx}
        className="flex items-center justify-between py-2 px-2 hover:bg-gray-50 rounded transition"
      >
        <div className="flex items-center gap-3">
          <span className="w-2 h-2 rounded-full bg-blue-500" /> {/* opcional: punto de color */}
          <span className="font-semibold text-gray-800">{item.x}</span>
        </div>
        <div className="text-right text-gray-600">
          <span className="text-gray-500">N°Capachos:{item.y} </span>
          <span className="text-gray-500">{percentage}%</span>
          
        </div>
      </li>
    );
  })}
</ul>

            </div>
          </div>
        ) : (
          <div className="h-full flex items-center justify-center text-gray-500">
            No hay datos disponibles
          </div>
        )}
      </div>
    </div>

            )}
          </div>
        )}
      </div>
    </div>
  );
}

function CosechaSelector({ cosechas, selectedCosecha, onSelect }) {
  return (
    <select value={selectedCosecha || ""} onChange={(e) => onSelect(e.target.value || null)} className="border border-gray-300 rounded p-2 w-full max-w-xs">
      <option value="">Todas las Cosechas</option>
      {cosechas.map(c => (
        <option key={c.id} value={c.id}>
          {`Cosecha #${c.id} - ${new Date(c.fecha_inicio).toLocaleDateString()}`}
        </option>
      ))}
    </select>
  );
}

function InfoBox({ label, value, color }) {
  const colorClasses = {
    blue: { bg: 'bg-blue-50', border: 'border-blue-100', text: 'text-blue-800', textValue: 'text-blue-600' },
    green: { bg: 'bg-green-50', border: 'border-green-100', text: 'text-green-800', textValue: 'text-green-600' },
    yellow: { bg: 'bg-yellow-50', border: 'border-yellow-100', text: 'text-yellow-800', textValue: 'text-yellow-600' },
    purple: { bg: 'bg-purple-50', border: 'border-purple-100', text: 'text-purple-800', textValue: 'text-purple-600' },
    orange: { bg: 'bg-orange-50', border: 'border-orange-100', text: 'text-orange-800', textValue: 'text-orange-600'},
  };

  return (
    <div className={`${colorClasses[color].bg} p-3 rounded-sm border ${colorClasses[color].border}`}>
      <p className={`font-semibold ${colorClasses[color].text}`}>{label}</p>
      <p className={colorClasses[color].textValue}>{value}</p>
    </div>
  );
}

function ChartContainer({ title, children }) {
  return (
    <div className="bg-white p-6 rounded-md shadow-md border min-h-[500px]">
      <h2 className="text-xl font-semibold mb-4">{title}</h2>
      <div className="w-full h-[420px] overflow-x-auto">{children}</div>
    </div>
  );
}