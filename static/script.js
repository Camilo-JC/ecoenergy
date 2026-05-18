document.addEventListener('DOMContentLoaded', () => {
    
    // Configuración global de Chart.js para Dark Mode Premium (Temática Emerald)
    Chart.defaults.color = '#a7f3d0';
    Chart.defaults.font.family = "'Plus Jakarta Sans', 'Outfit', sans-serif";
    Chart.defaults.plugins.tooltip.backgroundColor = 'rgba(6, 20, 16, 0.95)';
    Chart.defaults.plugins.tooltip.padding = 14;
    Chart.defaults.plugins.tooltip.cornerRadius = 12;
    Chart.defaults.plugins.tooltip.titleColor = '#ffffff';
    Chart.defaults.plugins.tooltip.bodyColor = '#a7f3d0';
    Chart.defaults.plugins.tooltip.borderColor = 'rgba(16, 185, 129, 0.2)';
    Chart.defaults.plugins.tooltip.borderWidth = 1;
    
    let tvChartInstance = null;
    let distChartInstance = null;
    let tempChartInstance = null;

    // Cargar datos iniciales desde el backend Flask
    fetch('/api/stats')
        .then(response => response.json())
        .then(data => {
            // 1. Actualizar tarjetas de KPI
            document.getElementById('kpi-total').textContent = data.kpis.total.toLocaleString();
            document.getElementById('kpi-avg').textContent = `${data.kpis.avg_consumption} kWh`;
            document.getElementById('kpi-max').textContent = `${data.kpis.max_consumption} kWh`;
            document.getElementById('kpi-impact').textContent = data.kpis.impact_factor;

            // 2. Rellenar inputs de la UI con los límites físicos ampliados y mostrar el rango histórico
            document.getElementById('temperatura').min = 10.0;
            document.getElementById('temperatura').max = 45.0;
            document.getElementById('hint-temp').innerHTML = `<span style="color:#6ee7b7">Histórico: ${data.ranges.temp_min.toFixed(1)}°C - ${data.ranges.temp_max.toFixed(1)}°C</span> | Límite: 10°C - 45°C`;

            document.getElementById('personas').min = 1;
            document.getElementById('personas').max = 20;
            document.getElementById('hint-pers').innerHTML = `<span style="color:#6ee7b7">Histórico: ${data.ranges.pers_min} - ${data.ranges.pers_max} personas</span> | Límite: 1 - 20`;

            document.getElementById('horas_ac').min = 0;
            document.getElementById('horas_ac').max = 24;
            document.getElementById('hint-ac').innerHTML = `<span style="color:#6ee7b7">Histórico: ${data.ranges.ac_min} - ${data.ranges.ac_max} hrs</span> | Límite: 0 - 24 hrs`;

            document.getElementById('horas_tv').min = 0;
            document.getElementById('horas_tv').max = 24;
            document.getElementById('hint-tv').innerHTML = `<span style="color:#6ee7b7">Histórico: ${data.ranges.tv_min} - ${data.ranges.tv_max} hrs</span> | Límite: 0 - 24 hrs`;

            // 3. Dibujar gráficos premium con Chart.js
            renderTvChart(data.chart_tv);
            renderDistChart(data.chart_dist);
            renderTempChart(data.chart_temp);
        })
        .catch(err => console.error("Error cargando estadísticas de EcoEnergy:", err));

    // Manejar Simulación Predictiva (Formulario)
    const form = document.getElementById('predict-form');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const Temperatura = parseFloat(document.getElementById('temperatura').value);
        const Personas = parseInt(document.getElementById('personas').value);
        const Horas_AC = parseInt(document.getElementById('horas_ac').value);
        const Horas_TV = parseInt(document.getElementById('horas_tv').value);
        
        const resultEl = document.getElementById('predicted-consumption');
        resultEl.textContent = "Calculando...";
        
        fetch('/api/predict', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ Temperatura, Personas, Horas_AC, Horas_TV })
        })
        .then(res => res.json())
        .then(data => {
            if (data.error) {
                resultEl.textContent = "Error";
                alert(`Error en predicción: ${data.error}`);
            } else {
                resultEl.textContent = `${data.predicted_consumption.toFixed(2)} kWh`;
                // Lanzar animación de pulso y glow en el elemento
                resultEl.classList.remove('price-updated');
                void resultEl.offsetWidth; // trigger reflow
                resultEl.classList.add('price-updated');
            }
        })
        .catch(err => {
            resultEl.textContent = "Error";
            console.error("Error al predecir consumo:", err);
        });
    });

    // Gráfico 1: Consumo Promedio vs Horas de TV (Barras Emerald)
    function renderTvChart(data) {
        const ctx = document.getElementById('tvChart').getContext('2d');
        
        let gradient = ctx.createLinearGradient(0, 0, 0, 300);
        gradient.addColorStop(0, '#10b981');
        gradient.addColorStop(1, '#064e3b');

        tvChartInstance = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: data.labels.map(l => `${l} hrs`),
                datasets: [{
                    label: 'Consumo Promedio (kWh)',
                    data: data.values,
                    backgroundColor: gradient,
                    borderRadius: 10,
                    borderSkipped: false
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    y: {
                        grid: { color: 'rgba(16, 185, 129, 0.05)' },
                        border: { display: false },
                        ticks: { color: '#6ee7b7' }
                    },
                    x: {
                        grid: { display: false },
                        border: { display: false },
                        ticks: { color: '#6ee7b7' }
                    }
                },
                animation: {
                    y: {
                        duration: 1500,
                        easing: 'easeOutQuart'
                    }
                }
            }
        });
    }

    // Gráfico 2: Histograma de Frecuencias de Consumo (Área Curvada Emerald Glow)
    function renderDistChart(data) {
        const ctx = document.getElementById('distChart').getContext('2d');
        
        let gradient = ctx.createLinearGradient(0, 0, 0, 300);
        gradient.addColorStop(0, 'rgba(52, 211, 153, 0.4)');
        gradient.addColorStop(1, 'rgba(6, 78, 59, 0.0)');

        distChartInstance = new Chart(ctx, {
            type: 'line',
            data: {
                labels: data.labels,
                datasets: [{
                    label: 'Frecuencia de Hogares',
                    data: data.values,
                    borderColor: '#34d399',
                    backgroundColor: gradient,
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    y: {
                        grid: { color: 'rgba(16, 185, 129, 0.05)' },
                        border: { display: false },
                        ticks: { color: '#6ee7b7' }
                    },
                    x: {
                        grid: { display: false },
                        border: { display: false },
                        ticks: { color: '#6ee7b7', maxRotation: 45, minRotation: 45 }
                    }
                },
                elements: {
                    point: {
                        radius: 3,
                        backgroundColor: '#10b981',
                        hitRadius: 10,
                        hoverRadius: 6
                    }
                }
            }
        });
    }

    // Gráfico 3: Consumo Promedio por Rango de Temperatura (Curva Climatológica)
    function renderTempChart(data) {
        const ctx = document.getElementById('tempChart').getContext('2d');
        
        let gradient = ctx.createLinearGradient(0, 0, 0, 350);
        gradient.addColorStop(0, 'rgba(16, 185, 129, 0.35)');
        gradient.addColorStop(1, 'rgba(6, 10, 8, 0.0)');

        tempChartInstance = new Chart(ctx, {
            type: 'line',
            data: {
                labels: data.labels,
                datasets: [{
                    label: 'Consumo Promedio kWh',
                    data: data.values,
                    borderColor: '#10b981',
                    backgroundColor: gradient,
                    borderWidth: 4,
                    fill: true,
                    tension: 0.25
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    y: {
                        grid: { color: 'rgba(16, 185, 129, 0.05)' },
                        border: { display: false },
                        ticks: { color: '#6ee7b7' }
                    },
                    x: {
                        grid: { display: false },
                        border: { display: false },
                        ticks: { color: '#6ee7b7' }
                    }
                },
                elements: {
                    point: {
                        radius: 5,
                        backgroundColor: '#ffffff',
                        borderColor: '#059669',
                        borderWidth: 2,
                        hitRadius: 12,
                        hoverRadius: 8
                    }
                }
            }
        });
    }

    // Navegación Sidebar Active State y Smooth Anchors
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
        });
    });
});
