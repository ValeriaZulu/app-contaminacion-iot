import {
    MapContainer,
    TileLayer,
    CircleMarker,
    Popup,
    Polyline,
} from "react-leaflet";
import HeatMap from "./HeatMap";

const CENTRO_MEDELLIN = [6.2442, -75.5812];

function MeasurementMap({ mediciones, canalSeleccionado }) {
    const coordenadasRuta = mediciones.map((medicion) => [
        medicion.latitud,
        medicion.longitud,
    ]);

    return (
        <MapContainer
            center={CENTRO_MEDELLIN}
            zoom={12}
            style={{ height: "600px", width: "100%" }}
        >
            <TileLayer
                attribution="&copy; OpenStreetMap contributors"
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <HeatMap
                mediciones={mediciones}
                canal={canalSeleccionado}
            />

            <Polyline positions={coordenadasRuta} />

            {mediciones.map((medicion) => (
                <CircleMarker
                    key={medicion.medicion}
                    center={[medicion.latitud, medicion.longitud]}
                    radius={7}
                >
                    <Popup>
                        <strong>Medición {medicion.medicion}</strong>

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
                    </Popup>
                </CircleMarker>
            ))}
        </MapContainer>
    );
}

export default MeasurementMap;