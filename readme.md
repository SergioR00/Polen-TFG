## 📄Objetivo del proyecto
Desarrollar un sistema de modelado predictivo basado en XGBoost para la estimación de concentraciones atmosféricas de polen (Por el momento solo implementado para gramíneas en $t+1$).

![alt text](output_t+1.png)

## 📡Fuentes de datos
- Para polen por tipos PolinoCam “AYTM” (Gramíneas, platano de paseo, etc.)
    
    https://datos.comunidad.madrid/dataset/mediciones_polen
    
- Para datos de meteorología OpenMeteo (humedad, temperatura, etc.)
    
    https://open-meteo.com/
    
- Para datos de contaminantes:
    - OpenMeteo tiene datos, pero no muchos
    - IQAir, es de pago para datos pasados
    - Catálogo de datos de la comunidad de Madrid (solo provincias lejanas al centro)
    - Catálogo de datos del ayuntamiento de Madrid (este es el bueno)
        
        https://datos.madrid.es/portal/site/egob/menuitem.c05c1f754a33a9fbe4b2e4b284f1a5a0/?vgnextoid=aecb88a7e2b73410VgnVCM2000000c205a0aRCRD&vgnextchannel=374512b9ace9f310VgnVCM100000171f5a0aRCRD&vgnextfmt=default


## 📂 Estructura
- `original_datasets/...`: Carpeta con todos los datasets necesarios originales (Desde 2014 a 2025)

- `new_datasets/...`: Carpeta con los datasets unificados y mis propias variables.

- `get_Old_Data.ipynb`: Notebook que recoge los datos de polen, meteorología y contaminantes de los últimos 14 años 2012-2025.

- `update_Data.ipynb`: Notebook que actualiza los datos de los datasets con los valores de 2026.

- `add_Features_&_Train`: Notebook en el que creo mis propias features y entreno el modelo (Lo guardo en modelo_t+1.json). Además hago una prueba para 2024.

- `predict_Future.ipynb`: Notebook que te muestra la predicción de polen para mañana.

## 🛠️ Plan para la aplicación
- Crear una aplicación que según el tipo de polen al que es alérgico, prediga como se sentirá los próximos días.
- Como el SO2 por ejemplo aumenta la hiperreactividad, crear una aplicación donde la gente muestre si se encuentra peor o mejor, y así tener más datos para mejorar el modelo a la hora de predecir como se encontrará la gente.