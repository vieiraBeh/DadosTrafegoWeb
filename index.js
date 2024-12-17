function analyzeData() {
    // Entrada de dados (dataInput)
    const input = document.getElementById('dataInput').value;
    const visits = input.split(',').map(Number).filter(n => !isNaN(n));

    // Validação
    if (visits.length === 0) {
        alert('Por favor, insira dados válidos.');
        return;
    }

    // Cálculo da Média
    const mean = (visits.reduce((a, b) => a + b, 0) / visits.length).toFixed(2);

    // Cálculo da Moda
    const frequency = {};
    visits.forEach(num => {
        frequency[num] = (frequency[num] || 0) + 1;
    });
    const mode = Object.keys(frequency).reduce((a, b) =>
        frequency[a] > frequency[b] ? a : b
    );

    // Cálculo da Mediana
    const sorted = [...visits].sort((a, b) => a - b);
    const median = sorted.length % 2 === 0
        ? ((sorted[sorted.length / 2 - 1] + sorted[sorted.length / 2]) / 2).toFixed(2)
        : sorted[Math.floor(sorted.length / 2)];

    // Exibição dos Resultados
    document.getElementById('results').innerHTML = `
        <strong>Média:</strong> ${mean}<br>
        <strong>Moda:</strong> ${mode}<br>
        <strong>Mediana:</strong> ${median}
    `;

    // Renderização do Gráfico
    renderBoxplot(visits);
}

function renderBoxplot(data) {
    const ctx = document.getElementById('boxplot').getContext('2d');
    const sorted = data.sort((a, b) => a - b);

    // Cálculo dos valores do Boxplot
    const q1 = sorted[Math.floor((sorted.length / 4))];
    const q3 = sorted[Math.ceil((sorted.length * (3 / 4))) - 1];
    const median = sorted[Math.floor(sorted.length / 2)];
    const min = Math.min(...data);
    const max = Math.max(...data);

    // Renderização do Gráfico
    new Chart(ctx, {
        type: 'boxplot',
        data: {
            labels: ['Tráfego'],
            datasets: [{
                label: 'Boxplot',
                data: [{
                    min: min,
                    q1: q1,
                    median: median,
                    q3: q3,
                    max: max
                }],
                backgroundColor: '#4CAF50',
                borderColor: '#388E3C',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true
        }
    });
}
