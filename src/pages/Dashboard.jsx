import { useEffect, useState } from "react";
import { cargarMediciones } from "../data/dataService";
import MeasurementMap from "../components/MeasurementMap";

function Dashboard() {
    const [mediciones, setMediciones] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState(null);

    const [canalSeleccionado, setCanalSeleccionado] =
        useState("A");

    const [tipoHeatmap, setTipoHeatmap] =
        useState("canal");

    useEffect(() => {
        cargarMediciones()
            .then((data) => setMediciones(data))
            .catch((error) => setError(error.message))
            .finally(() => setCargando(false));
    }, []);

    if (cargando) {
        return <p>Cargando mediciones...</p>;
    }

    if (error) {
        return <p>Error: {error}</p>;
    }

    return (
        <main>
            <h1>Monitoreo de Ocupación del Espectro</h1>

            <p>
                Mediciones cargadas: {mediciones.length}
            </p>

            <div>
                <h2>Variable del mapa</h2>

                <button
                    onClick={() => setTipoHeatmap("canal")}
                >
                    Ocupación por canal
                </button>

                <button
                    onClick={() => setTipoHeatmap("temperatura")}
                >
                    Temperatura
                </button>

                <button
                    onClick={() => setTipoHeatmap("frecuencia")}
                >
                    Frecuencia contaminada
                </button>
            </div>

            {tipoHeatmap === "canal" && (
                <div>
                    <h3>Canal seleccionado</h3>

                    {["A", "B", "C", "D"].map((canal) => (
                        <button
                            key={canal}
                            onClick={() =>
                                setCanalSeleccionado(canal)
                            }
                        >
                            Canal {canal}
                        </button>
                    ))}
                </div>
            )}

            <MeasurementMap
                mediciones={mediciones}
                canalSeleccionado={canalSeleccionado}
                tipoHeatmap={tipoHeatmap}
            />
        </main>
    );
}

export default Dashboard;