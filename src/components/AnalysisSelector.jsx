const opciones = [
    {
        id: "ubicaciones",
        icono: "📍",
        titulo: "Ubicaciones",
        descripcion: "Visualiza dónde se realizaron las mediciones.",
    },
    {
        id: "ruta",
        icono: "🛣️",
        titulo: "Ruta de mediciones",
        descripcion: "Visualiza el recorrido de la estación móvil.",
    },
    {
        id: "canal",
        icono: "📶",
        titulo: "Ocupación por canal",
        descripcion: "Analiza la contaminación de los canales A, B, C y D.",
    },
    {
        id: "temperatura",
        icono: "🌡️",
        titulo: "Temperatura",
        descripcion: "Visualiza la distribución de temperatura del sensor.",
    },
    {
        id: "frecuencia",
        icono: "📡",
        titulo: "Frecuencia contaminada",
        descripcion: "Identifica la frecuencia contaminada representativa.",
    },
];

function AnalysisSelector({ tipoHeatmap, setTipoHeatmap }) {
    return (
        <section className="analysis-section">

            <div className="section-heading">
                <h2>Análisis espacial</h2>

                <p>
                    Selecciona una variable para visualizar su
                    comportamiento sobre el área de medición.
                </p>
            </div>

            <div className="analysis-selector">
                {opciones.map((opcion) => (
                    <button
                        key={opcion.id}
                        className={`analysis-option ${tipoHeatmap === opcion.id ? "active" : ""
                            }`}
                        onClick={() => setTipoHeatmap(opcion.id)}
                    >
                        <div className="analysis-icon">
                            {opcion.icono}
                        </div>

                        <div className="analysis-text">
                            <strong>{opcion.titulo}</strong>

                            <span>{opcion.descripcion}</span>
                        </div>
                    </button>
                ))}
            </div>

        </section>
    );
}

export default AnalysisSelector;