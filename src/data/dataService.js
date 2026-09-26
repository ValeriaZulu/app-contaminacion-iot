const DATA_URL = "/data/mediciones_dashboard.json";

export async function cargarMediciones() {
    const response = await fetch(DATA_URL);

    if (!response.ok) {
        throw new Error("No se pudieron cargar las mediciones.");
    }

    return await response.json();
}