# 📡 Dashboard de Ocupación del Espectro

Dashboard web desarrollado para el análisis espacial de la ocupación del espectro radioeléctrico en el rango de **840–860 MHz**, a partir de mediciones realizadas mediante un sensor RF instalado en una estación móvil de monitoreo en Medellín.

El proyecto hace parte del **Examen 03 de IoT** y permite visualizar los resultados obtenidos durante el proceso de limpieza, transformación y análisis de los datos.

---
## 👩‍💻 Autora

**Valeria Zuluaga Alzate**

Ingeniería de Sistemas e Informática
Universidad Pontificia Bolivariana — UPB

Proyecto académico — Examen 03 IoT 

## 🎯 Objetivo

Desarrollar una herramienta de visualización que permita analizar espacialmente las mediciones de ocupación del espectro y apoyar la interpretación de los resultados obtenidos para los cuatro canales de 5 MHz:

| Canal   | Rango       |
| ------- | ----------- |
| Canal A | 840–845 MHz |
| Canal B | 845–850 MHz |
| Canal C | 850–855 MHz |
| Canal D | 855–860 MHz |

Se considera que una frecuencia está **ocupada o contaminada cuando su potencia supera −60 dBm**.

El dashboard permite consultar:

* Resumen de los resultados del análisis.
* Ocupación promedio de los cuatro canales.
* Ubicación de las mediciones.
* Ruta de la estación móvil.
* Mapas de calor de ocupación por canal.
* Distribución espacial de la temperatura del sensor.
* Distribución espacial de la frecuencia contaminada representativa.
* Información detallada de cada medición.

---

## 🖥️ Tecnologías utilizadas

### Frontend

* React
* Vite
* JavaScript
* CSS
* React Leaflet
* Leaflet
* Leaflet.heat
* Recharts
* Lucide React

### Análisis y procesamiento

* Python
* Pandas
* NumPy
* Matplotlib
* SciPy
* Google Colab
* Jupyter Notebook

---

## 📁 Estructura del proyecto

```text
app-contaminacion/
│
├── public/
│   ├── data/
│   │   └── mediciones_dashboard.json
│   ├── favicon.svg
│   └── incons.svg
│
├── src/
│   ├── components/
│   │   ├── AnalysisSelector.jsx
│   │   ├── ChannelOccupancyBars.jsx
│   │   ├── Header.jsx
│   │   ├── HeatMap.jsx
│   │   ├── MeasurementMap.jsx
│   │   ├── SummaryCards.jsx
│   │   └── SummarySection.jsx
│   │
│   ├── data/
│   │   └── dataService.js
│   │
│   ├── pages/
│   │   └── Dashboard.jsx
│   │
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
│
├── etl/
│   └── procesar_datos.py
│
├── notebooks/
│   └── Examen_03_Analisis_Espectro.ipynb
│
├── .gitignore
├── eslint.config.js
├── index.html
├── package-lock.json
├── package.json
├── README.md
└── vite.config.js
```

---

## 🔄 Flujo de procesamiento de los datos

El proyecto sigue un flujo de procesamiento dividido en varias etapas:

```text
Datos originales
       │
       ▼
Limpieza y análisis exploratorio
       │
       ▼
Control de calidad
       │
       ▼
Imputación de datos inválidos
       │
       ▼
Cálculo de indicadores
       │
       ▼
Generación de datos para el dashboard
       │
       ▼
mediciones_dashboard.json
       │
       ▼
Dashboard React
       │
       ├── Resumen
       └── Mapas
```

### Limpieza y análisis

La limpieza, revisión de calidad, análisis exploratorio e imputación de los datos se realizaron en **Google Colab**.

El notebook utilizado durante el desarrollo se incluye también dentro del proyecto en:

```text
notebooks/Examen_03_Analisis_Espectro.ipynb
```

El proceso completo de análisis puede consultarse en el siguiente notebook de Google Colab:

https://colab.research.google.com/drive/1TRqhAd-nofP5dOxUP9GLPcb6wmLmDTME?usp=sharing

> **Nota:** aunque el archivo `.ipynb` y el archivo `.py` se encuentran incluidos dentro del proyecto, la limpieza y análisis de los datos utilizados para obtener los resultados finales se realizaron durante el desarrollo en Google Colab.

El archivo:

```text
etl/procesar_datos.py
```

se incluye como parte de la estructura del proyecto para documentar y organizar el proceso de preparación de los datos utilizado para alimentar el dashboard.

---

## 📊 Datos utilizados

El dataset contiene **61 mediciones**.

Cada medición contiene:

* 1024 valores correspondientes al espectro entre 840 y 860 MHz.
* Temperatura del sensor.
* Longitud.
* Latitud.
* Altura.
* Error de distancia.

Los indicadores transformados utilizados por el dashboard se almacenan en:

```text
public/data/mediciones_dashboard.json
```

Este archivo contiene la información necesaria para realizar las visualizaciones sin tener que cargar nuevamente el dataset espectral completo desde el navegador.

---

## 🧹 Calidad de los datos

Durante el análisis se realizó una revisión de:

* Valores nulos.
* Valores infinitos.
* Registros duplicados.
* Valores extremos.
* Consistencia de las coordenadas.
* Continuidad de la ruta.
* Comportamiento de la temperatura.
* Error de distancia.
* Comportamiento espectral.

Se identificó un registro con valores inválidos de **latitud, longitud y altura**, correspondientes a una medición cuya información espacial presentaba valores cero.

Estos valores fueron corregidos mediante **interpolación lineal utilizando los registros vecinos**, conservando la información espectral original.

También se identificó un valor atípico de **17,3 m en el error de distancia**. Después de comparar las coordenadas y la altura de las mediciones anterior y posterior, se determinó que la trayectoria mantenía continuidad espacial. Por esta razón, el registro fue conservado sin aplicar imputación.

---

## 📡 Cálculo de ocupación

Para cada uno de los cuatro canales se calculó:

* Potencia promedio del canal.
* Número de bins ocupados.
* Porcentaje de ocupación.

El criterio utilizado para determinar contaminación fue:

```text
Potencia > −60 dBm
```

La potencia promedio del canal se obtuvo mediante la suma discreta de las potencias expresadas en escala lineal, siguiendo el principio de **Parseval**, y posteriormente se convirtió nuevamente a dBm.

---

## 🗺️ Dashboard

El dashboard está dividido en dos secciones principales.

### 📊 Resumen

Presenta una visión general de los resultados:

* Número de mediciones.
* Canal con mayor ocupación.
* Canal con menor ocupación.
* Frecuencia contaminada representativa.
* Gráficas de ocupación de los canales A y C.
* Comparación visual de la ocupación promedio de los cuatro canales.

Las barras de ocupación permiten identificar rápidamente el porcentaje promedio de frecuencias que superaron el umbral de −60 dBm.

### 🗺️ Mapas

Permite seleccionar diferentes variables para realizar el análisis espacial:

#### 📍 Ubicaciones

Muestra las posiciones donde fueron realizadas las mediciones.

#### 🛣️ Ruta

Muestra el recorrido realizado por la estación móvil.

#### 📶 Ocupación por canal

Permite seleccionar los canales A, B, C o D y visualizar espacialmente su porcentaje de ocupación.

#### 🌡️ Temperatura

Muestra la distribución espacial de la temperatura del sensor.

Para evitar que una mayor cantidad de mediciones en una zona aumente artificialmente la intensidad del mapa, las mediciones se agrupan espacialmente y el color representa la **temperatura promedio de cada zona**.

#### 📡 Frecuencia contaminada

Muestra espacialmente la frecuencia contaminada representativa de cada medición.

---

## ▶️ Ejecución del proyecto

Para ejecutar el dashboard localmente es necesario tener instalado **Node.js**.

### 1. Abrir una terminal dentro de la carpeta del proyecto

```bash
cd app-contaminacion
```

### 2. Instalar las dependencias

```bash
npm install
```

Este comando instala las dependencias definidas en `package.json`.

### 3. Ejecutar el proyecto

```bash
npm run dev
```

Vite mostrará en la terminal la dirección local donde estará disponible el dashboard.

Generalmente será:

```text
http://localhost:5173/
```

Abrir la dirección indicada por Vite en el navegador.

---

## ⚠️ Importante para la ejecución desde el ZIP

El proyecto incluye:

```text
package.json
package-lock.json
```

por lo que **no es necesario enviar la carpeta `node_modules` dentro del ZIP**.

Después de descomprimir el proyecto, basta con ejecutar:

```bash
npm install
```

y posteriormente:

```bash
npm run dev
```

El archivo:

```text
public/data/mediciones_dashboard.json
```

ya se encuentra incluido en el proyecto, por lo que no es necesario ejecutar nuevamente el proceso de análisis para visualizar el dashboard.

---

## 📌 Resultados principales

A partir de las 61 mediciones analizadas se obtuvieron los siguientes valores promedio de ocupación:

| Canal | Rango       | Ocupación promedio |
| ----- | ----------- | -----------------: |
| A     | 840–845 MHz |            21,38 % |
| B     | 845–850 MHz |            28,55 % |
| C     | 850–855 MHz |            59,11 % |
| D     | 855–860 MHz |            25,44 % |

El **Canal C (850–855 MHz)** presentó la mayor ocupación promedio observada, mientras que el **Canal A (840–845 MHz)** presentó la menor.

Estos resultados corresponden al conjunto de mediciones analizado y deben interpretarse dentro del contexto espacial y temporal del recorrido realizado.

---


