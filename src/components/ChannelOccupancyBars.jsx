function ChannelOccupancyBars({ mediciones }) {

    const canales = [
        {
            id: "A",
            nombre: "Canal A",
            frecuencia: "840–845 MHz",
            campo: "ocupacion_A",
        },
        {
            id: "B",
            nombre: "Canal B",
            frecuencia: "845–850 MHz",
            campo: "ocupacion_B",
        },
        {
            id: "C",
            nombre: "Canal C",
            frecuencia: "850–855 MHz",
            campo: "ocupacion_C",
        },
        {
            id: "D",
            nombre: "Canal D",
            frecuencia: "855–860 MHz",
            campo: "ocupacion_D",
        },
    ];


    const resultados = canales.map((canal) => {

        const promedio =
            mediciones.reduce(
                (total, medicion) =>
                    total + medicion[canal.campo],
                0
            ) / mediciones.length;


        return {
            ...canal,
            promedio,
        };

    });


    return (
        <div className="channel-occupancy">

            {resultados.map((canal) => (

                <div
                    className="occupancy-item"
                    key={canal.id}
                >

                    <div className="occupancy-header">

                        <div>

                            <strong>
                                {canal.nombre}
                            </strong>

                            <span>
                                {canal.frecuencia}
                            </span>

                        </div>


                        <strong className="occupancy-value">
                            {canal.promedio.toFixed(2)}%
                        </strong>

                    </div>


                    <div className="occupancy-track">

                        <div
                            className={`occupancy-fill channel-${canal.id.toLowerCase()}`}

                            style={{
                                width: `${canal.promedio}%`,
                            }}
                        />

                    </div>

                </div>

            ))}

        </div>
    );
}


export default ChannelOccupancyBars;