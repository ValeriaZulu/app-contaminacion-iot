function SummaryCards({ mediciones }) {
    const totalMediciones = mediciones.length;

    const promedioTemperatura =
        mediciones.reduce(
            (total, medicion) => total + medicion.temperatura,
            0
        ) / totalMediciones;

    const canales = ["A", "B", "C", "D"];

    const promediosCanales = canales.map((canal) => ({
        canal,
        promedio:
            mediciones.reduce(
                (total, medicion) =>
                    total + medicion[`ocupacion_${canal}`],
                0
            ) / totalMediciones,
    }));

    const canalMasOcupado = promediosCanales.reduce(
        (mayor, actual) =>
            actual.promedio > mayor.promedio ? actual : mayor
    );

    return (
        <section className="summary-grid">

            <article className="summary-card">
                <div className="summary-card-icon">📍</div>

                <div>
                    <p className="summary-label">Mediciones</p>
                    <h2>{totalMediciones}</h2>
                    <span>Registros analizados</span>
                </div>
            </article>

            <article className="summary-card">
                <div className="summary-card-icon">📶</div>

                <div>
                    <p className="summary-label">Canal más ocupado</p>
                    <h2>Canal {canalMasOcupado.canal}</h2>
                    <span>
                        {canalMasOcupado.promedio.toFixed(2)} % de ocupación
                    </span>
                </div>
            </article>

            <article className="summary-card">
                <div className="summary-card-icon">📊</div>

                <div>
                    <p className="summary-label">Ocupación máxima promedio</p>
                    <h2>
                        {canalMasOcupado.promedio.toFixed(2)} %
                    </h2>
                    <span>
                        Canal {canalMasOcupado.canal}
                    </span>
                </div>
            </article>

            <article className="summary-card">
                <div className="summary-card-icon">🌡️</div>

                <div>
                    <p className="summary-label">Temperatura promedio</p>
                    <h2>
                        {promedioTemperatura.toFixed(2)} °C
                    </h2>
                    <span>Temperatura del sensor</span>
                </div>
            </article>

        </section>
    );
}

export default SummaryCards;