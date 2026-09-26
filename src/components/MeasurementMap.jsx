import {
    MapContainer,
    TileLayer,
    CircleMarker,
    Popup,
    Polyline,
} from "react-leaflet";

import HeatMap from "./HeatMap";

const CENTRO_MEDELLIN = [6.2442, -75.5812];

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

    const radioPunto = esMapaDeCalor ? 3 : 4;

    return (
        <section className="map-container">

            <MapContainer
                center={CENTRO_MEDELLIN}
                zoom={12}
                style={{
                    height: "600px",
                    width: "100%",
                }}
            >

                <TileLayer
                    attribution="&copy; OpenStreetMap contributors"
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
                            opacity: 0.7,
                        }}
                    />
                )}

                {/* Puntos de medición */}
                {mediciones.map((medicion) => (
                    <CircleMarker
                        key={medicion.medicion}
                        center={[
                            medicion.latitud,
                            medicion.longitud,
                        ]}
                        radius={radioPunto}
                        pathOptions={{
                            weight: 1,
                            opacity: esMapaDeCalor ? 0.45 : 0.8,
                            fillOpacity: esMapaDeCalor ? 0.35 : 0.65,
                        }}
                    >
                        <Popup>

                            <strong>
                                Medición {medicion.medicion}
                            </strong>

                            <br />

                            Temperatura:{" "}
                            {medicion.temperatura.toFixed(2)} °C

                            <br />

                            Altura:{" "}
                            {medicion.altura.toFixed(2)} m

                            <br />

                            Error de distancia:{" "}
                            {medicion.error_distancia.toFixed(2)} m

                            <hr />

                            <strong>
                                Ocupación por canal
                            </strong>

                            <br />
                            Canal A:{" "}
                            {medicion.ocupacion_A.toFixed(2)} %

                            <br />
                            Canal B:{" "}
                            {medicion.ocupacion_B.toFixed(2)} %

                            <br />
                            Canal C:{" "}
                            {medicion.ocupacion_C.toFixed(2)} %

                            <br />
                            Canal D:{" "}
                            {medicion.ocupacion_D.toFixed(2)} %

                            <hr />

                            <strong>
                                Frecuencia contaminada
                            </strong>

                            <br />

                            Frecuencia:{" "}
                            {medicion
                                .frecuencia_contaminada_representativa_MHz
                                .toFixed(3)}{" "}
                            MHz

                            <br />

                            Potencia:{" "}
                            {medicion
                                .potencia_frecuencia_contaminada_dBm
                                .toFixed(2)}{" "}
                            dBm

                        </Popup>
                    </CircleMarker>
                ))}

            </MapContainer>

        </section>
    );
}

export default MeasurementMap;