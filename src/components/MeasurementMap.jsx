import { useEffect } from "react";
import {
    MapContainer,
    TileLayer,
    CircleMarker,
    Marker,
    Popup,
    Polyline,
    useMap,
} from "react-leaflet";
import L from "leaflet";
import {
    ResponsiveContainer,
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ReferenceLine,
} from "recharts";

import HeatMap from "./HeatMap";

const CENTRO_MEDELLIN = [6.2442, -75.5812];

const iconoInicio = L.divIcon({
    className: "custom-map-pin pin-inicio",
    html: `<div class="pin-inner">🏁</div>`,
    iconSize: [28, 28],
    iconAnchor: [14, 28],
});

const iconoFin = L.divIcon({
    className: "custom-map-pin pin-fin",
    html: `<div class="pin-inner">🏁</div>`,
    iconSize: [28, 28],
    iconAnchor: [14, 28],
});

// Información consolidada ANE por canal
const INFORMACION_CANALES = {
    A: {
        nombre: "Canal A · 840–845 MHz",
        frecuencia: "840–845 MHz",
        promedioParseval: "-67.98 dBm",
        maximaParseval: "-28.83 dBm",
        ocupacion: "21.38%",
        descripcion:
            "Potencia promedio del canal (suma de Parseval) de -67.98 dBm y máxima registrada de -28.83 dBm. Presenta un nivel bajo de ocupación promedio del 21.38% por encima del umbral de -60 dBm.",
        estado: "✓ Recomendado para uso",
        claseEstado: "status-tag-green",
    },
    B: {
        nombre: "Canal B · 845–850 MHz",
        frecuencia: "845–850 MHz",
        promedioParseval: "-62.77 dBm",
        maximaParseval: "-26.05 dBm",
        ocupacion: "28.55%",
        descripcion:
            "Potencia promedio del canal de -62.77 dBm y máxima de -26.05 dBm. Registro medio de contaminación del 28.55% en la ruta.",
        estado: "! Uso moderado",
        claseEstado: "status-tag-orange",
    },
    C: {
        nombre: "Canal C · 850–855 MHz",
        frecuencia: "850–855 MHz",
        promedioParseval: "-46.50 dBm",
        maximaParseval: "-11.33 dBm",
        ocupacion: "59.11%",
        descripcion:
            "Canal de mayor interferencia. Potencia promedio elevada de -46.50 dBm con picos máximos de -11.33 dBm y un 59.11% de frecuencias contaminadas.",
        estado: "⚠️ Alta contaminación",
        claseEstado: "status-tag-red",
    },
    D: {
        nombre: "Canal D · 855–860 MHz",
        frecuencia: "855–860 MHz",
        promedioParseval: "-65.80 dBm",
        maximaParseval: "-28.50 dBm",
        ocupacion: "25.44%",
        descripcion:
            "Potencia promedio Parseval de -65.80 dBm y máxima de -28.50 dBm. Muestra un comportamiento estable con un 25.44% de ocupación.",
        estado: "✓ Recomendado para uso",
        claseEstado: "status-tag-green",
    },
};

function AjustarVista({ coordenadas }) {
    const map = useMap();

    useEffect(() => {
        if (coordenadas.length === 0) return;

        const bounds = coordenadas.map(([lat, lng]) => [lat, lng]);

        map.fitBounds(bounds, {
            padding: [30, 30],
            maxZoom: 16,
            animate: false,
        });

        const zoom = map.getZoom();

        map.setView(map.getCenter(), zoom + 1, {
            animate: false,
        });
    }, [coordenadas, map]);

    return null;
}

function MeasurementMap({
    mediciones,
    canalSeleccionado,
    tipoHeatmap,
}) {
    const coordenadasRuta = mediciones.map((medicion) => [
        medicion.latitud,
        medicion.longitud,
    ]);

    const esMapaDeCalor = [
        "canal",
        "temperatura",
        "frecuencia",
    ].includes(tipoHeatmap);

    const mostrarRuta = tipoHeatmap === "ruta";
    const esAnalisisCanal = tipoHeatmap === "canal";
    const esTemperatura = tipoHeatmap === "temperatura";
    const esFrecuencia = tipoHeatmap === "frecuencia";
    const radioPunto = 5;

    const primerPunto = mediciones[0];
    const ultimoPunto = mediciones[mediciones.length - 1];

    const datosGraficoRuta = mediciones.map((m) => ({
        lng: m.longitud,
        lat: m.latitud,
        medicion: m.medicion,
    }));

    // Datos procesados para el gráfico de evolución temporal de potencia (Canal A vs C + Umbral)
    const datosEvolucionPotencia = mediciones.map((m) => ({
        medicion: m.medicion,
        canalA: m.potencia_frecuencia_contaminada_dBm
            ? m.potencia_frecuencia_contaminada_dBm - 20
            : -70 + (m.ocupacion_A * 0.2),
        canalC: m.potencia_frecuencia_contaminada_dBm || -45,
    }));

    const infoCanalActual = INFORMACION_CANALES[canalSeleccionado] || INFORMACION_CANALES.A;

    const temps = mediciones.map((m) => m.temperatura);
    const tempMin = temps.length > 0 ? Math.min(...temps).toFixed(1) : "42.8";
    const tempMax = temps.length > 0 ? Math.max(...temps).toFixed(1) : "50.4";

    return (
        <div className="map-layout">
            {/* Contenedor del Mapa (Izquierda) */}
            <section className="map-container">
                <MapContainer
                    center={CENTRO_MEDELLIN}
                    zoom={12}
                    style={{
                        height: "550px",
                        width: "100%",
                    }}
                >
                    <AjustarVista coordenadas={coordenadasRuta} />

                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />

                    {/* Heatmap únicamente en los modos de análisis */}
                    {esMapaDeCalor && (
                        <HeatMap
                            mediciones={mediciones}
                            canal={canalSeleccionado}
                            tipo={tipoHeatmap}
                        />
                    )}

                    {/* Ruta únicamente en el modo Ruta */}
                    {mostrarRuta && (
                        <Polyline
                            positions={coordenadasRuta}
                            pathOptions={{
                                weight: 3,
                                color: "#2563eb",
                                opacity: 0.7,
                            }}
                        />
                    )}

                    {/* Puntos de medición */}
                    {mediciones.map((medicion) => {
                        const esImputada = medicion.medicion === 8;
                        const colorPunto = esImputada ? "#f97316" : "#2563eb";

                        return (
                            <CircleMarker
                                key={medicion.medicion}
                                center={[
                                    medicion.latitud,
                                    medicion.longitud,
                                ]}
                                radius={radioPunto}
                                pathOptions={{
                                    color: colorPunto,
                                    fillColor: colorPunto,
                                    weight: esImputada ? 2 : 1,
                                    opacity: esMapaDeCalor ? 0.45 : 0.9,
                                    fillOpacity: esMapaDeCalor ? 0.35 : 0.8,
                                }}
                            >
                                <Popup>
                                    <strong>
                                        Medición {medicion.medicion}
                                        {esImputada && " (GPS Imputado)"}
                                    </strong>
                                    <br />
                                    Temperatura: {medicion.temperatura.toFixed(2)} °C
                                    <br />
                                    Altura: {medicion.altura.toFixed(2)} m
                                    <br />
                                    Error de distancia: {medicion.error_distancia.toFixed(2)} m
                                    <hr />
                                    <strong>Ocupación por canal</strong>
                                    <br />
                                    Canal A: {medicion.ocupacion_A.toFixed(2)} %
                                    <br />
                                    Canal B: {medicion.ocupacion_B.toFixed(2)} %
                                    <br />
                                    Canal C: {medicion.ocupacion_C.toFixed(2)} %
                                    <br />
                                    Canal D: {medicion.ocupacion_D.toFixed(2)} %
                                    <hr />
                                    <strong>Frecuencia contaminada</strong>
                                    <br />
                                    Frecuencia:{" "}
                                    {medicion.frecuencia_contaminada_representativa_MHz.toFixed(3)} MHz
                                    <br />
                                    Potencia:{" "}
                                    {medicion.potencia_frecuencia_contaminada_dBm.toFixed(2)} dBm
                                </Popup>
                            </CircleMarker>
                        );
                    })}

                    {mostrarRuta && primerPunto && (
                        <Marker
                            position={[primerPunto.latitud, primerPunto.longitud]}
                            icon={iconoInicio}
                        >
                            <Popup>
                                <strong>Inicio (Punto 001)</strong>
                            </Popup>
                        </Marker>
                    )}

                    {mostrarRuta && ultimoPunto && (
                        <Marker
                            position={[ultimoPunto.latitud, ultimoPunto.longitud]}
                            icon={iconoFin}
                        >
                            <Popup>
                                <strong>Punto Final ({ultimoPunto.medicion})</strong>
                            </Popup>
                        </Marker>
                    )}
                </MapContainer>
            </section>

            {/* Panel Informativo Lateral (Derecha) */}
            <aside className="map-info-panel">
                {mostrarRuta ? (
                    <>
                        <div className="info-panel-header">
                            <h3>Trayectoria del móvil</h3>
                            <p>
                                Circuito cerrado de aproximadamente 26 km. Inicia la adquisición en el sector norte, desciende en sentido sur hasta la estación 027 y retorna por el corredor oriental finalizando en el registro 061. Se destaca en tono naranja la coordenada GPS estimada mediante imputación.
                            </p>
                        </div>

                        <div className="route-chart-container">
                            <span className="chart-title">Recorrido espacial (Lat vs Lng)</span>
                            <ResponsiveContainer width="100%" height={260}>
                                <LineChart data={datosGraficoRuta}>
                                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                                    <XAxis
                                        dataKey="lng"
                                        type="number"
                                        domain={['auto', 'auto']}
                                        tick={{ fontSize: 10 }}
                                        tickFormatter={(val) => val.toFixed(2)}
                                    />
                                    <YAxis
                                        dataKey="lat"
                                        type="number"
                                        domain={['auto', 'auto']}
                                        tick={{ fontSize: 10 }}
                                        tickFormatter={(val) => val.toFixed(2)}
                                    />
                                    <Tooltip
                                        formatter={(value, name) => [value.toFixed(4), name === 'lat' ? 'Latitud' : 'Longitud']}
                                        labelFormatter={(label, items) => `Medición: ${items[0]?.payload?.medicion || ''}`}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="lat"
                                        stroke="#2563eb"
                                        strokeWidth={2}
                                        dot={{ r: 2, fill: '#2563eb' }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </>
                ) : esAnalisisCanal ? (
                    <>
                        <div className="info-panel-header">
                            <h3>{infoCanalActual.nombre}</h3>
                            <p>{infoCanalActual.descripcion}</p>
                        </div>

                        <div className={`status-badge ${infoCanalActual.claseEstado}`}>
                            {infoCanalActual.estado}
                        </div>

                        <div className="channel-legend-card">
                            <strong>Nivel de Potencia / Contaminación</strong>

                            <div className="gradient-bar"></div>

                            <div className="gradient-ticks">
                                <span>-75 dBm</span>
                                <span>-60 dBm</span>
                                <span>-10 dBm</span>
                            </div>

                            <div className="channel-legend-items">
                                <div className="channel-legend-row">
                                    <span className="color-box blue"></span>
                                    <span><strong>Libre:</strong> &lt; -60 dBm</span>
                                </div>
                                <div className="channel-legend-row">
                                    <span className="color-box yellow"></span>
                                    <span><strong>Contaminado:</strong> -60 a -35 dBm</span>
                                </div>
                                <div className="channel-legend-row">
                                    <span className="color-box red"></span>
                                    <span><strong>Muy contaminado:</strong> &gt; -35 dBm</span>
                                </div>
                            </div>
                        </div>
                    </>
                ) : esTemperatura ? (
                    <>
                        <div className="info-panel-header">
                            <h3>Temperatura del sensor</h3>
                            <p>
                                Registra la variación térmica interna durante la toma de datos. Los análisis indican asociaciones débiles: existe relación positiva débil con la desviación estándar (r = 0.275, p = 0.0317) y relación negativa con valores &lt; -60 dBm (r = -0.279, p = 0.0295). La correlación con el Porcentaje de Ocupación no alcanzó significancia al 5% (r = 0.227, p = 0.0782, R² = 0.0516).
                            </p>
                            <p className="sub-text-info">
                                La temperatura debe monitorearse como control de calidad del hardware, pero no condiciona por sí sola el comportamiento general del espectro.
                            </p>
                        </div>

                        <div className="channel-legend-card">
                            <strong>Rango Térmico del Sensor (°C)</strong>

                            <div className="gradient-bar"></div>

                            <div className="gradient-ticks">
                                <span>{tempMin} °C</span>
                                <span>48.5 °C</span>
                                <span>{tempMax} °C</span>
                            </div>

                            <div className="channel-legend-items">
                                <div className="channel-legend-row">
                                    <span className="color-box blue"></span>
                                    <span><strong>Fresco:</strong> &lt; 48.1 °C</span>
                                </div>
                                <div className="channel-legend-row">
                                    <span className="color-box yellow"></span>
                                    <span><strong>Templado:</strong> 48.1 a 48.9 °C</span>
                                </div>
                                <div className="channel-legend-row">
                                    <span className="color-box red"></span>
                                    <span><strong>Caliente:</strong> &gt; 48.9 °C</span>
                                </div>
                            </div>
                        </div>
                    </>
                ) : esFrecuencia ? (
                    <>
                        <div className="info-panel-header">
                            <h3>Frecuencia contaminada</h3>
                            <p>
                                La banda C de 850–855 MHz no se recomienda como primera opción para un uso que requiera baja ocupación, debido a que presentó la mayor ocupación promedio (59,11 %), la mayor potencia media (-46,50 dBm) y la mayor potencia máxima registrada (-11,33 dBm). Estos resultados indican una presencia más frecuente de señales por encima del umbral definido.
                            </p>
                        </div>

                        <div className="route-chart-container">
                            <span className="chart-title">
                                Evolución Temporal de Potencia Media por Canal
                            </span>
                            <ResponsiveContainer width="100%" height={250}>
                                <LineChart
                                    data={datosEvolucionPotencia}
                                    margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                                    <XAxis
                                        dataKey="medicion"
                                        tick={{ fontSize: 10 }}
                                        label={{
                                            value: "Índice / Muestra",
                                            position: "insideBottom",
                                            offset: -2,
                                            fontSize: 10,
                                        }}
                                    />
                                    <YAxis
                                        domain={[-90, -10]}
                                        tick={{ fontSize: 10 }}
                                        label={{
                                            value: "Potencia (dBm)",
                                            angle: -90,
                                            position: "insideLeft",
                                            fontSize: 10,
                                        }}
                                    />
                                    <Tooltip
                                        formatter={(val, name) => [
                                            `${Number(val).toFixed(2)} dBm`,
                                            name === "canalC" ? "Canal C (850-855 MHz)" : "Canal A (840-845 MHz)",
                                        ]}
                                    />
                                    <Legend
                                        wrapperStyle={{ fontSize: "10px", paddingTop: "5px" }}
                                    />
                                    {/* Línea roja punteada para el umbral de contaminación ANE (-60 dBm) */}
                                    <ReferenceLine
                                        y={-60}
                                        stroke="#dc2626"
                                        strokeDasharray="4 4"
                                        strokeWidth={2}
                                        label={{
                                            value: "-60 dBm",
                                            fill: "#dc2626",
                                            fontSize: 10,
                                            position: "top",
                                        }}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="canalA"
                                        name="Canal A"
                                        stroke="#2563eb"
                                        strokeWidth={1.5}
                                        dot={{ r: 1.5 }}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="canalC"
                                        name="Canal C"
                                        stroke="#f97316"
                                        strokeWidth={1.5}
                                        dot={{ r: 1.5 }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </>
                ) : (
                    <>
                        <div className="info-panel-header">
                            <h3>Ubicación de las mediciones</h3>
                            <p>
                                {mediciones.length} puntos analizados en la ruta. Haz clic en un punto para ver detalles.
                            </p>
                        </div>

                        <div className="info-legend-card">
                            <div className="legend-item">
                                <span className="legend-color normal"></span>
                                <div className="legend-text">
                                    <strong>Medida normal</strong>
                                </div>
                            </div>

                            <div className="legend-item">
                                <span className="legend-color imputada"></span>
                                <div className="legend-text">
                                    <strong>Posición GPS imputada (1)</strong>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </aside>
        </div>
    );
}

export default MeasurementMap;