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

        heatLayerRef.current = L.heatLayer(puntos, {
            radius: 25,
            blur: 20,
            maxZoom: 15,
            max: 1,
        }).addTo(map);

        return () => {
            if (heatLayerRef.current) {
                map.removeLayer(heatLayerRef.current);
            }
        };
    }, [map, puntos]);

    return null;
}

function HeatMap({ mediciones, canal, tipo }) {
    let puntos;

    if (tipo === "temperatura") {
        const temperaturas = mediciones.map(
            (medicion) => medicion.temperatura
        );

        const temperaturaMin = Math.min(...temperaturas);
        const temperaturaMax = Math.max(...temperaturas);

        puntos = mediciones.map((medicion) => {
            const intensidad =
                (medicion.temperatura - temperaturaMin) /
                (temperaturaMax - temperaturaMin);

            return [
                medicion.latitud,
                medicion.longitud,
                intensidad,
            ];
        });
    } else {
        puntos = mediciones.map((medicion) => [
            medicion.latitud,
            medicion.longitud,
            medicion[`ocupacion_${canal}`] / 100,
        ]);
    }

    return <HeatLayer puntos={puntos} />;
}

export default HeatMap;