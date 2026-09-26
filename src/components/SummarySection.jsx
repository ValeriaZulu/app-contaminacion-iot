import {
    ResponsiveContainer,
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
} from "recharts";

import ChannelOccupancyBars from "./ChannelOccupancyBars";

function SummarySection({ mediciones }) {

    const datosCanalA = mediciones.map((medicion) => ({
        medicion: medicion.medicion,
        ocupacion: medicion.ocupacion_A,
    }));


    const datosCanalC = mediciones.map((medicion) => ({
        medicion: medicion.medicion,
        ocupacion: medicion.ocupacion_C,
    }));


    return (
        <section className="summary-section">

            <div className="section-heading">
                <h2>Resumen del análisis</h2>

                <p>
                    Principales resultados de ocupación del espectro
                    registrados durante el recorrido de la estación móvil.
                </p>
            </div>


            <div className="summary-dashboard-grid">

                {/* =====================================
            CANAL C
            ===================================== */}

                <article className="summary-chart-card">

                    <div className="chart-card-header">

                        <div>
                            <span className="chart-card-label">
                                Canal C · 850–855 MHz
                            </span>

                            <h3>
                                Ocupación del canal
                            </h3>
                        </div>

                        <div className="chart-card-value">
                            59.11%
                        </div>

                    </div>


                    <div className="chart-container">

                        <ResponsiveContainer
                            width="100%"
                            height="100%"
                        >

                            <LineChart data={datosCanalC}>

                                <CartesianGrid
                                    strokeDasharray="3 3"
                                    vertical={false}
                                />

                                <XAxis
                                    dataKey="medicion"
                                    tick={{ fontSize: 11 }}
                                    label={{
                                        value: "Medición",
                                        position: "insideBottom",
                                        offset: -5,
                                    }}
                                />

                                <YAxis
                                    domain={[0, 100]}
                                    tick={{ fontSize: 11 }}
                                    label={{
                                        value: "Ocupación (%)",
                                        angle: -90,
                                        position: "insideLeft",
                                    }}
                                />

                                <Tooltip
                                    formatter={(value) => [
                                        `${Number(value).toFixed(2)} %`,
                                        "Ocupación",
                                    ]}
                                    labelFormatter={(label) =>
                                        `Medición ${label}`
                                    }
                                />

                                <Line
                                    type="monotone"
                                    dataKey="ocupacion"
                                    stroke="#7c3aed"
                                    strokeWidth={2.5}
                                    dot={false}
                                    activeDot={{ r: 5 }}
                                />

                            </LineChart>

                        </ResponsiveContainer>

                    </div>

                    <p className="chart-card-description">
                        Es el canal con mayor ocupación promedio
                        observada en la ruta.
                    </p>

                </article>


                {/* =====================================
            COMPARACIÓN DE LOS 4 CANALES
        ===================================== */}

                <article className="summary-chart-card">

                    <div className="chart-card-header">

                        <div>

                            <span className="chart-card-label">
                                Comparación
                            </span>

                            <h3>
                                Ocupación promedio por canal
                            </h3>

                        </div>

                    </div>


                    <ChannelOccupancyBars
                        mediciones={mediciones}
                    />


                    <p className="chart-card-description">

                        Porcentaje promedio de frecuencias que superaron
                        el umbral de contaminación de −60 dBm durante
                        las mediciones.

                    </p>

                </article>

                {/* =====================================
            CANAL A
        ===================================== */}

                <article className="summary-chart-card">

                    <div className="chart-card-header">

                        <div>
                            <span className="chart-card-label">
                                Canal A · 840–845 MHz
                            </span>

                            <h3>
                                Ocupación del canal
                            </h3>
                        </div>

                        <div className="chart-card-value secondary">
                            21.38%
                        </div>

                    </div>


                    <div className="chart-container">

                        <ResponsiveContainer
                            width="100%"
                            height="100%"
                        >

                            <LineChart data={datosCanalA}>

                                <CartesianGrid
                                    strokeDasharray="3 3"
                                    vertical={false}
                                />

                                <XAxis
                                    dataKey="medicion"
                                    tick={{ fontSize: 11 }}
                                    label={{
                                        value: "Medición",
                                        position: "insideBottom",
                                        offset: -5,
                                    }}
                                />

                                <YAxis
                                    domain={[0, 100]}
                                    tick={{ fontSize: 11 }}
                                    label={{
                                        value: "Ocupación (%)",
                                        angle: -90,
                                        position: "insideLeft",
                                    }}
                                />

                                <Tooltip
                                    formatter={(value) => [
                                        `${Number(value).toFixed(2)} %`,
                                        "Ocupación",
                                    ]}
                                    labelFormatter={(label) =>
                                        `Medición ${label}`
                                    }
                                />

                                <Line
                                    type="monotone"
                                    dataKey="ocupacion"
                                    stroke="#a78bfa"
                                    strokeWidth={2.5}
                                    dot={false}
                                    activeDot={{ r: 5 }}
                                />

                            </LineChart>

                        </ResponsiveContainer>

                    </div>

                    <p className="chart-card-description">
                        Presenta la menor ocupación promedio entre
                        los cuatro canales analizados.
                    </p>

                </article>

            </div>

        </section>
    );
}


export default SummarySection;