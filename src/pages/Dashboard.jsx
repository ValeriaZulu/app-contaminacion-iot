import { useEffect, useState } from "react";
import { cargarMediciones } from "../data/dataService";

import Header from "../components/Header";
import SummaryCards from "../components/SummaryCards";
import AnalysisSelector from "../components/AnalysisSelector";
import MeasurementMap from "../components/MeasurementMap";

function Dashboard() {
    const [mediciones, setMediciones] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState(null);

    const [canalSeleccionado, setCanalSeleccionado] = useState("A");
    const [tipoHeatmap, setTipoHeatmap] = useState("canal");

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
        <>
            <Header />

            <main>
                <SummaryCards mediciones={mediciones} />

                <AnalysisSelector
                    tipoHeatmap={tipoHeatmap}
                    setTipoHeatmap={setTipoHeatmap}
                />

                {tipoHeatmap === "canal" && (
                    <div className="channel-selector">
                        <h3>Canal seleccionado</h3>

                        {["A", "B", "C", "D"].map((canal) => (
                            <button
                                key={canal}
                                onClick={() => setCanalSeleccionado(canal)}
                                className={
                                    canalSeleccionado === canal
                                        ? "channel-active"
                                        : ""
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
        </>
    );
}

export default Dashboard;