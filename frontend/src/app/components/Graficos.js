"use client";

import { useEffect, useState } from "react";
import {
  VictoryChart, VictoryLine, VictoryBar, VictoryPie,
  VictoryAxis, VictoryTooltip, VictoryLabel, VictoryVoronoiContainer
} from "victory";

export default function EstadisticasDashboard() {
  const [cosechas, setCosechas] = useState([]);
  const [tiposCosecha, setTiposCosecha] = useState([]);
  const [selectedCosecha, setSelectedCosecha] = useState(null);
  const [porDia, setPorDia] = useState([]);
  const [porCosechador, setPorCosechador] = useState([]);
  const [porCuadrilla, setPorCuadrilla] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentCosechaInfo, setCurrentCosechaInfo] = useState({});

  // Obtener lista de cosechas y tipos de cosecha
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

  // Obtener datos de gráficos cuando cambia la cosecha seleccionada
  useEffect(() => {
    const fetchData = async () => {
      if (cosechas.length === 0 || tiposCosecha.length === 0) return;
      
      setLoading(true);
      try {
        const baseUrl = "http://localhost:8080";
        const cosechaParam = selectedCosecha ? `/${selectedCosecha}` : '';
        
        if (selectedCosecha) {
          const cosecha = cosechas.find(c => c.id === selectedCosecha);
          if (cosecha) {
            const tipoEncontrado = tiposCosecha.find(t => 
              Number(t.id) === Number(cosecha.id_tipo_cosecha)
            );
            
            setCurrentCosechaInfo({
              tipo: tipoEncontrado?.nombre || 'Desconocido',
              fechaInicio: new Date(cosecha.fecha_inicio).toLocaleDateString(),
              fechaFin: cosecha.fecha_fin ? new Date(cosecha.fecha_fin).toLocaleDateString() : 'En curso',
              estado: cosecha.estado
            });
          }
        } else {
          setCurrentCosechaInfo({});
        }

        // Obtener datos para los gráficos
        const [resDia, resCosechador, resCuadrilla] = await Promise.all([
          fetch(`${baseUrl}/administrador/graficos/getcapachosdia${cosechaParam}`),
          fetch(`${baseUrl}/administrador/graficos/getcapachoscosechador${cosechaParam}`),
          fetch(`${baseUrl}/administrador/graficos/getcapachosporcosecha/`), // Nuevo endpoint para cuadrilla
        ]);

        const [dataDia, dataCosechador, dataCuadrilla] = await Promise.all([
          resDia.json(),
          resCosechador.json(),
          resCuadrilla.json(),
        ]);

        setPorDia(dataDia.map(item => ({
          x: item.fecha ? new Date(item.fecha).toLocaleDateString() : 'Sin fecha',
          y: item.total_capachos || 0
        })));

        setPorCosechador(dataCosechador.map(item => ({
          x: item.nombre || 'Sin nombre',
          y: item.total || 0
        })));

        setPorCuadrilla(dataCuadrilla.map(item => ({
          x: item.cuadrilla || 'Sin cuadrilla',
          y: item.total || 0
        })));

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
        <CosechaSelector 
          cosechas={cosechas} 
          selectedCosecha={selectedCosecha} 
          onSelect={setSelectedCosecha} 
        />
        
        {selectedCosecha && (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
            <div className="bg-blue-50 p-3 rounded-sm border border-blue-100">
              <p className="font-semibold text-blue-800">Tipo de Cosecha</p>
              <p className="text-blue-600">{currentCosechaInfo.tipo}</p>
            </div>
            <div className="bg-green-50 p-3 rounded-sm border border-green-100">
              <p className="font-semibold text-green-800">Fecha Inicio</p>
              <p className="text-green-600">{currentCosechaInfo.fechaInicio}</p>
            </div>
            <div className="bg-yellow-50 p-3 rounded-sm border border-yellow-100">
              <p className="font-semibold text-yellow-800">Fecha Fin</p>
              <p className="text-yellow-600">{currentCosechaInfo.fechaFin}</p>
            </div>
            <div className="bg-purple-50 p-3 rounded-sm border border-purple-100">
              <p className="font-semibold text-purple-800">Estado</p>
              <p className="text-purple-600">{currentCosechaInfo.estado}</p>
            </div>
          </div>
        )}
      </div>

      <div className="overflow-y-auto h-[calc(100vh-220px)]">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Mostrar gráficos 1 y 2 solo cuando hay cosecha seleccionada */}
            {selectedCosecha ? (
              <>
                {/* Gráfico 1: Capachos por Día */}
                <div className="bg-white p-4 rounded-sm shadow-sm border">
                  <h2 className="text-lg font-semibold mb-4">
                    📅 Capachos por Día - Cosecha #{selectedCosecha}
                  </h2>
                  <div className="h-64">
                    {porDia.length > 0 ? (
                      <VictoryChart 
                        containerComponent={<VictoryVoronoiContainer />} 
                        domainPadding={20}
                      >
                        <VictoryAxis 
                          style={{ 
                            tickLabels: { 
                              angle: -45, 
                              fontSize: 10,
                              padding: 5
                            } 
                          }} 
                        />
                        <VictoryAxis dependentAxis />
                        <VictoryLine
                          data={porDia}
                          labels={({ datum }) => `${datum.x}: ${datum.y} capachos`}
                          labelComponent={<VictoryTooltip />}
                          style={{ 
                            data: { 
                              stroke: "#16a34a", 
                              strokeWidth: 3 
                            } 
                          }}
                        />
                      </VictoryChart>
                    ) : (
                      <div className="h-full flex items-center justify-center text-gray-500">
                        No hay datos disponibles
                      </div>
                    )}
                  </div>
                </div>

                {/* Gráfico 2: Capachos por Cosechador */}
                <div className="bg-white p-4 rounded-sm shadow-sm border">
                  <h2 className="text-lg font-semibold mb-4">
                    👨‍🌾 Top Cosechadores - Cosecha #{selectedCosecha}
                  </h2>
                  <div className="h-64">
                    {porCosechador.length > 0 ? (
                      <VictoryChart 
                        domainPadding={30}
                        padding={{ top: 20, bottom: 80, left: 50, right: 20 }}
                      >
                        <VictoryAxis 
                          style={{ 
                            tickLabels: { 
                              angle: -45, 
                              fontSize: 9,
                              padding: 5
                            } 
                          }} 
                        />
                        <VictoryAxis dependentAxis />
                        <VictoryBar
                          data={porCosechador.slice(0, 10)}
                          labels={({ datum }) => `${datum.y} capachos`}
                          labelComponent={<VictoryTooltip />}
                          style={{ 
                            data: { 
                              fill: "#16a34a",
                              width: 20
                            } 
                          }}
                        />
                      </VictoryChart>
                    ) : (
                      <div className="h-full flex items-center justify-center text-gray-500">
                        No hay datos disponibles
                      </div>
                    )}
                  </div>
                </div>
              </>
            ) : (
              /* Gráfico 3: Capachos por Cuadrilla (solo cuando no hay cosecha seleccionada) */
              <div className="bg-white p-4 rounded-sm shadow-sm border">
                <h2 className="text-lg font-semibold mb-4">
                  Distribución de Capachos por Cuadrilla (Todas las cosechas)
                </h2>
                <div className="h-64">
                  {porCuadrilla.length > 0 ? (
                    <div className="flex flex-col md:flex-row h-full">
                      <div className="w-full md:w-2/3 h-full">
                        <VictoryPie
                          data={porCuadrilla}
                          colorScale={[
                            "#16a34a", "#3b82f6", "#f59e0b", "#ef4444", 
                            "#8b5cf6", "#ec4899", "#10b981", "#f97316",
                            "#84cc16", "#06b6d4", "#d946ef", "#f43f5e"
                          ]}
                          innerRadius={80}
                          padAngle={2}
                          labelRadius={({ innerRadius }) => innerRadius + 20}
                          labels={({ datum }) => {
                            const total = porCuadrilla.reduce((sum, item) => sum + item.y, 0);
                            const percentage = Math.round((datum.y / total) * 100);
                            return `${percentage}%`;
                          }}
                          labelComponent={
                            <VictoryLabel
                              style={{
                                fontSize: 10,
                                fontWeight: 'bold',
                                fill: '#fff'
                              }}
                            />
                          }
                          style={{
                            data: {
                              stroke: "#fff",
                              strokeWidth: 2,
                              fill: ({ datum }) => [
                                "#16a34a", "#3b82f6", "#f59e0b", "#ef4444",
                                "#8b5cf6", "#ec4899", "#10b981", "#f97316",
                                "#84cc16", "#06b6d4", "#d946ef", "#f43f5e"
                              ][datum._x % 12]
                            }
                          }}
                          events={[{
                            target: "data",
                            eventHandlers: {
                              onMouseOver: () => {
                                return [{
                                  target: "data",
                                  mutation: (props) => {
                                    const fillColor = [
                                      "#16a34a", "#3b82f6", "#f59e0b", "#ef4444",
                                      "#8b5cf6", "#ec4899", "#10b981", "#f97316",
                                      "#84cc16", "#06b6d4", "#d946ef", "#f43f5e"
                                    ][props.datum._x % 12];
                                    
                                    return {
                                      style: {
                                        stroke: "#fff",
                                        strokeWidth: 3,
                                        fill: fillColor,
                                        fillOpacity: 0.9
                                      }
                                    };
                                  }
                                }, {
                                  target: "labels",
                                  mutation: (props) => {
                                    return {
                                      style: {
                                        fontSize: 12,
                                        fontWeight: 'bold'
                                      }
                                    };
                                  }
                                }];
                              },
                              onMouseOut: () => {
                                return [{
                                  target: "data",
                                  mutation: (props) => {
                                    const fillColor = [
                                      "#16a34a", "#3b82f6", "#f59e0b", "#ef4444",
                                      "#8b5cf6", "#ec4899", "#10b981", "#f97316",
                                      "#84cc16", "#06b6d4", "#d946ef", "#f43f5e"
                                    ][props.datum._x % 12];
                                    
                                    return {
                                      style: {
                                        stroke: "#fff",
                                        strokeWidth: 2,
                                        fill: fillColor,
                                        fillOpacity: 1
                                      }
                                    };
                                  }
                                }, {
                                  target: "labels",
                                  mutation: () => {
                                    return {
                                      style: {
                                        fontSize: 10,
                                        fontWeight: 'bold'
                                      }
                                    };
                                  }
                                }];
                              }
                            }
                          }]}
                        />
                      </div>
                      <div className="w-full md:w-1/3 overflow-y-auto max-h-64 p-2">
                        <ul>
                          {porCuadrilla.map((item, idx) => {
                            const total = porCuadrilla.reduce((sum, i) => sum + i.y, 0);
                            const percentage = ((item.y / total) * 100).toFixed(2);
                            return (
                              <li
                                key={idx}
                                className="flex justify-between border-b border-gray-200 py-1 text-sm"
                              >
                                <span>{item.x}</span>
                                <span>{percentage}%</span>
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
    <select
      value={selectedCosecha || ""}
      onChange={(e) => onSelect(e.target.value || null)}
      className="border border-gray-300 rounded p-2 w-full max-w-xs"
    >
      <option value="">Todas las Cosechas</option>
      {cosechas.map(c => (
        <option key={c.id} value={c.id}>
          {`Cosecha #${c.id} - ${new Date(c.fecha_inicio).toLocaleDateString()}`}
        </option>
      ))}
    </select>
  );
}
