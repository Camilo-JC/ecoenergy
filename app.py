from flask import Flask, render_template, jsonify, request
import pandas as pd
import numpy as np
from sklearn.linear_model import LinearRegression
import os

app = Flask(__name__)

# Cargar y preparar el modelo de EcoEnergy en memoria
try:
    df = pd.read_csv("datos_500_registros.csv")
    
    # Entrenar modelo ML con las 4 variables de EcoEnergy
    X = df[['Temperatura', 'Personas', 'Horas_AC', 'Horas_TV']]
    y = df['Consumo']
    
    modelo = LinearRegression()
    modelo.fit(X, y)
    print("Modelo EcoEnergy cargado y entrenado exitosamente en memoria.")
    
except Exception as e:
    print(f"Error cargando datos o entrenando el modelo EcoEnergy: {e}")
    df = None
    modelo = None

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/stats')
def get_stats():
    if df is None:
        return jsonify({"error": "Data not found"}), 404
        
    # KPIs del proyecto EcoEnergy
    kpis = {
        "total": int(len(df)),
        "avg_consumption": float(round(df['Consumo'].mean(), 2)),
        "max_consumption": float(round(df['Consumo'].max(), 2)),
        "impact_factor": "Horas_TV (+22.5 kWh/hora)"
    }
    
    # 1. Consumo promedio vs Horas de Televisión (Bar Chart)
    avg_by_tv = df.groupby('Horas_TV')['Consumo'].mean().round(2).reset_index()
    chart_tv = {
        "labels": [int(x) for x in avg_by_tv['Horas_TV']],
        "values": [float(y) for y in avg_by_tv['Consumo']]
    }
    
    # 2. Distribución del Consumo Energético (Histograma)
    hist, bin_edges = np.histogram(df['Consumo'], bins=12)
    chart_dist = {
        "labels": [f"{int(bin_edges[i])}-{int(bin_edges[i+1])} kWh" for i in range(len(hist))],
        "values": [int(x) for x in hist]
    }
    
    # 3. Consumo promedio por Temperatura (Line Chart)
    # Agrupar temperatura en bins para suavizar la línea
    df['temp_bin'] = pd.cut(df['Temperatura'], bins=6)
    avg_by_temp = df.groupby('temp_bin')['Consumo'].mean().round(2).reset_index()
    chart_temp = {
        "labels": [f"{int(b.left)}°C - {int(b.right)}°C" for b in avg_by_temp['temp_bin']],
        "values": [float(y) for y in avg_by_temp['Consumo']]
    }
    
    # Rangos para validación y UI
    ranges = {
        "temp_min": float(df['Temperatura'].min()),
        "temp_max": float(df['Temperatura'].max()),
        "pers_min": int(df['Personas'].min()),
        "pers_max": int(df['Personas'].max()),
        "ac_min": int(df['Horas_AC'].min()),
        "ac_max": int(df['Horas_AC'].max()),
        "tv_min": int(df['Horas_TV'].min()),
        "tv_max": int(df['Horas_TV'].max())
    }
    
    return jsonify({
        "kpis": kpis,
        "chart_tv": chart_tv,
        "chart_dist": chart_dist,
        "chart_temp": chart_temp,
        "ranges": ranges
    })

@app.route('/api/predict', methods=['POST'])
def predict():
    if modelo is None:
        return jsonify({"error": "Model not trained"}), 500
        
    data = request.json
    try:
        temp = float(data.get('Temperatura', 24.0))
        pers = int(data.get('Personas', 4))
        ac = int(data.get('Horas_AC', 4))
        tv = int(data.get('Horas_TV', 4))
        
        # Validar rangos realistas basados en los datos
        temp = np.clip(temp, 10.0, 45.0)
        pers = np.clip(pers, 0, 20)
        ac = np.clip(ac, 0, 24)
        tv = np.clip(tv, 0, 24)
        
        # Realizar predicción con el modelo entrenado
        input_data = np.array([[temp, pers, ac, tv]])
        prediccion = modelo.predict(input_data)[0]
        prediccion = max(10.0, prediccion) # Evitar consumos irreales negativos o cero
        
        return jsonify({"predicted_consumption": round(prediccion, 2)})
    except Exception as e:
        return jsonify({"error": str(e)}), 400

if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=True, port=5000)
