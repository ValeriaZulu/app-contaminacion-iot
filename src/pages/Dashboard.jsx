import { useEffect, useState } from "react";
import { cargarMediciones } from "../data/dataService";
import MeasurementMap from "../components/MeasurementMap";

function Dashboard() {
    const [mediciones, setMediciones] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState(null);

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
        return <p>Cargando mediciones...</p>;
    }

    if (error) {
        return <p>Error: {error}</p>;
    }

    return (
        <main>
            <h1>Monitoreo de Ocupación del Espectro</h1>

            <p>Mediciones cargadas: {mediciones.length}</p>

            <MeasurementMap mediciones={mediciones} />
        </main>
    );
}

export default Dashboard;