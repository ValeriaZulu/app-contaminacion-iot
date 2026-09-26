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

function HeatMap({ mediciones, canal }) {
    const puntos = mediciones.map((medicion) => [
        medicion.latitud,
        medicion.longitud,
        medicion[`ocupacion_${canal}`] / 100,
    ]);

    return <HeatLayer puntos={puntos} />;
}

export default HeatMap;