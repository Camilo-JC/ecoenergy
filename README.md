# 🌱 EcoEnergy - Simulador de Consumo Energético Residencial

![EcoEnergy Banner](static/logo.svg)

> **EcoEnergy** es una plataforma web inteligente diseñada para hacer "visible" el consumo de energía eléctrica en los hogares. Mediante un simulador interactivo impulsado por Machine Learning, permite proyectar al instante el consumo diario de electricidad en base a los hábitos cotidianos.
> 
> *Proyecto desarrollado para la Hackathon 2026.*

## 🚀 Características Principales

*   **Simulador Predictivo de Alta Precisión:** Utiliza un modelo de Inteligencia Artificial (Regresión Lineal) con un **89% de precisión** para estimar el consumo diario.
*   **Análisis Dinámico:** Gráficas interactivas que revelan cómo variables como la **televisión** o el **aire acondicionado** impactan el gasto energético de manera directa.
*   **Dashboard Ejecutivo:** Una interfaz moderna (estilo Glassmorphism) y amigable para que cualquier usuario, sin conocimientos técnicos, pueda analizar su consumo en tiempo real.
*   **Sinergia IA/Human:** Modelo alimentado con datos orgánicos de hábitos de consumo humano, escalado con IA a 500 registros manteniendo fidelidad estadística.

## 🛠️ Tecnologías Utilizadas

*   **Backend & Machine Learning:** Python, Flask, Pandas, NumPy, Scikit-Learn.
*   **Frontend:** HTML5, CSS3, JavaScript Vainilla, Chart.js.
*   **Despliegue Serverless:** Configurado nativamente para Vercel (`vercel.json`).

## 💻 Instalación y Ejecución Local

Si deseas correr este proyecto en tu propia máquina, sigue estos pasos:

1. **Clona el repositorio**
   ```bash
   git clone https://github.com/Camilo-JC/ecoenergy.git
   cd ecoenergy
   ```

2. **Instala las dependencias necesarias**
   ```bash
   pip install -r requirements.txt
   ```

3. **Ejecuta la aplicación**
   ```bash
   python app.py
   ```

4. **Abre el proyecto en tu navegador**
   Visita `http://127.0.0.1:5000`

## ☁️ Despliegue en la Nube (Vercel)

El proyecto está preparado para desplegarse fácilmente en [Vercel](https://vercel.com/) gracias al archivo `vercel.json`. 

1. Importa el repositorio desde el panel de Vercel.
2. Vercel detectará el entorno de Python automáticamente e instalará las librerías de `requirements.txt`.
3. Haz clic en "Deploy" y tendrás tu URL pública lista en minutos.

---
💡 **El Descubrimiento Clave:** Nuestro modelo descubrió que la *televisión encendida* es el verdadero "termómetro" del hogar. No porque la TV consuma más que un motor, sino porque es el indicador principal de que la familia está activa en casa (luces prendidas, celulares cargando, nevera en uso), impactando enormemente en la factura mensual.
