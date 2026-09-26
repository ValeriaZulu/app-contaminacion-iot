import { useEffect, useRef } from "react";
import { useMap } from "react-leaflet";

import L from "leaflet";
import "leaflet.heat";


function HeatLayer({ puntos }) {

    const map = useMap();

    const heatLayerRef = useRef(null);


    useEffect(() => {

        if (heatLayerRef.current) {
            map.removeLayer(heatLayerRef.current);
        }

        if (puntos.length === 0) {
            return;
        }


        heatLayerRef.current = L.heatLayer(
            puntos,
            {
                radius: 35,

                blur: 28,

                maxZoom: 15,

                minOpacity: 0.25,

                max: 1,

                gradient: {
                    0.0: "#2563eb",
                    0.25: "#22c55e",
                    0.5: "#facc15",
                    0.75: "#f97316",
                    1.0: "#dc2626",
                },
            }
        ).addTo(map);


        return () => {

            if (heatLayerRef.current) {
                map.removeLayer(
                    heatLayerRef.current
                );
            }

        };

    }, [map, puntos]);


    return null;
}


function HeatMap({
    mediciones,
    canal,
    tipo,
}) {

    let puntos = [];


    /* =====================================
       OCUPACIÓN POR CANAL
    ===================================== */

    if (tipo === "canal") {

        puntos = mediciones.map(
            (medicion) => [

                medicion.latitud,

                medicion.longitud,

                medicion[
                `ocupacion_${canal}`
                ] / 100,

            ]
        );

    }


    /* =====================================
       TEMPERATURA
    ===================================== */

    if (tipo === "temperatura") {

        const temperaturas =
            mediciones.map(
                (medicion) =>
                    medicion.temperatura
            );

        const temperaturaMin =
            Math.min(...temperaturas);

        const temperaturaMax =
            Math.max(...temperaturas);


        puntos = mediciones.map(
            (medicion) => {

                const intensidad =
                    temperaturaMax ===
                        temperaturaMin
                        ? 1
                        : (
                            medicion.temperatura -
                            temperaturaMin
                        ) /
                        (
                            temperaturaMax -
                            temperaturaMin
                        );


                return [

                    medicion.latitud,

                    medicion.longitud,

                    intensidad,

                ];

            }
        );

    }


    /* =====================================
       FRECUENCIA CONTAMINADA
    ===================================== */

    if (tipo === "frecuencia") {

        const frecuencias =
            mediciones
                .map(
                    (medicion) =>
                        medicion
                            .frecuencia_contaminada_representativa_MHz
                )
                .filter(
                    (frecuencia) =>
                        Number.isFinite(frecuencia)
                );


        const frecuenciaMin =
            Math.min(...frecuencias);

        const frecuenciaMax =
            Math.max(...frecuencias);


        puntos = mediciones
            .filter(
                (medicion) =>
                    Number.isFinite(
                        medicion
                            .frecuencia_contaminada_representativa_MHz
                    )
            )
            .map(
                (medicion) => {

                    const frecuencia =
                        medicion
                            .frecuencia_contaminada_representativa_MHz;


                    const intensidad =
                        frecuenciaMax === frecuenciaMin
                            ? 1
                            : (
                                frecuencia -
                                frecuenciaMin
                            ) /
                            (
                                frecuenciaMax -
                                frecuenciaMin
                            );


                    return [

                        medicion.latitud,

                        medicion.longitud,

                        intensidad,

                    ];

                }
            );

    }


    return (
        <HeatLayer puntos={puntos} />
    );
}


export default HeatMap;