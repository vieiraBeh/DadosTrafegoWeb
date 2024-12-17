function analyzeData() {
    const input = document.getElementById('dataInput').value;
    const visits = input.split(',').map(Number).filter(n => !isNaN(n));

    if (visits.length === 0) {
        alert('Por favor, insira dados válidos.');
        return;
    }

    const mean = (visits.reduce((a, b) => a + b, 0) / visits.length).toFixed(2);
rdg
    const frequency = {};
    visits.forEach(num => {
        frequency[num] = (frequency[num] || 0) + 1;
    });
    const mode = Object.keys(frequency).reduce((a, b) =>
        frequency[a] > frequency[b] ? a : b
    );

    const sorted = [...visits].sort((a, b) => a - b);
    const median = sorted.length % 2 === 0
        ? ((sorted[sorted.length / 2 - 1] + sorted[sorted.length / 2]) / 2).toFixed(2)
        : sorted[Math.floor(sorted.length / 2)];

    document.getElementById('results').innerHTML = `
        <strong>Média:</strong> ${mean}<br>
        <strong>Moda:</strong> ${mode}<br>
        <strong>Mediana:</strong> ${median}
    `;

    renderBoxplot(visits);
    renderSankey(visits);
}

function renderBoxplot(data) {
    const ctx = document.getElementById('boxplot').getContext('2d');
    const sorted = data.sort((a, b) => a - b);

    const q1 = sorted[Math.floor((sorted.length / 4))];
    const q3 = sorted[Math.ceil((sorted.length * (3 / 4))) - 1];
    const median = sorted[Math.floor(sorted.length / 2)];
    const min = Math.min(...data);
    const max = Math.max(...data);

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

function renderSankey(data) {
    const sankeyData = {
        nodes: data.map((_, i) => ({ name: `Dia ${i + 1}` })),
        links: data.map((value, i) => ({
            source: 0,
            target: i + 1,
            value: value
        }))
    };

    const svg = d3.select("#sankey").html('').append("svg")
        .attr("width", 800)
        .attr("height", 400);

    const sankeyGenerator = d3.sankey()
        .nodeWidth(20)
        .nodePadding(10)
        .extent([[1, 1], [798, 398]]);

    const graph = sankeyGenerator({
        nodes: sankeyData.nodes.map(d => Object.assign({}, d)),
        links: sankeyData.links.map(d => Object.assign({}, d))
    });

    svg.append("g")
        .selectAll(".link")
        .data(graph.links)
        .enter()
        .append("path")
        .attr("class", "link")
        .attr("d", d3.sankeyLinkHorizontal())
        .style("stroke-width", d => Math.max(1, d.width))
        .style("stroke", "#4CAF50")
        .style("fill", "none");

    const node = svg.append("g")
        .selectAll(".node")
        .data(graph.nodes)
        .enter()
        .append("g");

    node.append("rect")
        .attr("x", d => d.x0)
        .attr("y", d => d.y0)
        .attr("height", d => d.y1 - d.y0)
        .attr("width", sankeyGenerator.nodeWidth())
        .style("fill", "#388E3C")
        .style("stroke", "#000");

    node.append("text")
        .attr("x", d => d.x0 - 6)
        .attr("y", d => (d.y0 + d.y1) / 2)
        .attr("dy", "0.35em")
        .attr("text-anchor", "end")
        .text(d => d.name);
}
