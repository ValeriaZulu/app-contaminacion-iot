import { useEffect, useState } from "react";

import { cargarMediciones } from "../data/dataService";

import Header from "../components/Header";
import SummaryCards from "../components/SummaryCards";
import SummarySection from "../components/SummarySection";
import AnalysisSelector from "../components/AnalysisSelector";
import MeasurementMap from "../components/MeasurementMap";


function Dashboard() {

    const [mediciones, setMediciones] = useState([]);

    const [cargando, setCargando] = useState(true);

    const [error, setError] = useState(null);


    // Sección actualmente visible
    const [seccionActiva, setSeccionActiva] =
        useState("resumen");


    // Estado de los mapas
    const [canalSeleccionado, setCanalSeleccionado] =
        useState("A");

    const [tipoHeatmap, setTipoHeatmap] =
        useState("ubicaciones");


    useEffect(() => {

        cargarMediciones()

            .then((data) => {
                setMediciones(data);
            })

            .catch((error) => {
                setError(error.message);
            })

            .finally(() => {
                setCargando(false);
            });

    }, []);


    if (cargando) {

        return (
            <div className="loading-screen">
                <div className="loading-spinner"></div>

                <p>
                    Cargando mediciones...
                </p>
            </div>
        );

    }


    if (error) {

        return (
            <div className="error-screen">

                <h2>
                    No fue posible cargar los datos
                </h2>

                <p>
                    {error}
                </p>

            </div>
        );

    }


    return (
        <>

            <Header />


            <main>

                {/* =====================================
            NAVEGACIÓN PRINCIPAL
        ===================================== */}

                <nav className="dashboard-tabs">

                    <button
                        className={
                            seccionActiva === "resumen"
                                ? "dashboard-tab active"
                                : "dashboard-tab"
                        }

                        onClick={() =>
                            setSeccionActiva("resumen")
                        }
                    >
                        <span>📊</span>

                        Resumen
                    </button>


                    <button
                        className={
                            seccionActiva === "mapas"
                                ? "dashboard-tab active"
                                : "dashboard-tab"
                        }

                        onClick={() =>
                            setSeccionActiva("mapas")
                        }
                    >
                        <span>🗺️</span>

                        Mapas
                    </button>

                </nav>


                {/* =====================================
            RESUMEN
        ===================================== */}

                {seccionActiva === "resumen" && (

                    <section className="dashboard-view">

                        <SummaryCards
                            mediciones={mediciones}
                        />

                        <SummarySection
                            mediciones={mediciones}
                        />

                    </section>

                )}


                {/* =====================================
            MAPAS
        ===================================== */}

                {seccionActiva === "mapas" && (

                    <section className="dashboard-view">

                        <AnalysisSelector
                            tipoHeatmap={tipoHeatmap}
                            setTipoHeatmap={setTipoHeatmap}
                        />


                        {tipoHeatmap === "canal" && (

                            <div className="channel-selector">

                                <h3>
                                    Canal seleccionado
                                </h3>


                                {["A", "B", "C", "D"].map(
                                    (canal) => (

                                        <button
                                            key={canal}

                                            onClick={() =>
                                                setCanalSeleccionado(canal)
                                            }

                                            className={
                                                canalSeleccionado === canal
                                                    ? "channel-active"
                                                    : ""
                                            }
                                        >
                                            Canal {canal}
                                        </button>

                                    )
                                )}

                            </div>

                        )}


                        <MeasurementMap
                            mediciones={mediciones}
                            canalSeleccionado={canalSeleccionado}
                            tipoHeatmap={tipoHeatmap}
                        />

                    </section>

                )}

            </main>

        </>
    );
}


export default Dashboard;