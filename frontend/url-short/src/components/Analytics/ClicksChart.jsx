import { Line } from 'react-chartjs-2'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Tooltip } from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip)

function getLast7Days() {
    const days = []
    for (let i = 6; i >= 0; i--) {
        const d = new Date()
        d.setDate(d.getDate() - i)
        days.push(d.toISOString().slice(0, 10)) // "YYYY-MM-DD"
    }
    return days
}

export default function ClicksChart({ clicks, originalUrl }) {
    const labels = getLast7Days()

    //clicks per day
    const clicksPerDay = labels.map(day => {
        return clicks.filter(c => c.clicked_at.slice(0, 10) === day).length
    })

    const data = {
        labels: labels.map(d => {
        const [, month, dayNum] = d.split('-')
        return `${month}/${dayNum}`
        }),
        datasets: [
        {
            label: 'Clicks',
            data: clicksPerDay,
            fill: true,
            borderColor: '#6366f1',
            backgroundColor: 'rgba(99, 102, 241, 0.15)',
            pointBackgroundColor: '#6366f1',
            pointRadius: 5,
            tension: 0.4,
        },
        ],
    }

    const options = {
        responsive: true,
        plugins: {
        legend: { display: false },
        title: {
            display: true,
            text: `Clicks for: ${originalUrl}`,
            font: { size: 13 },
            color: '#555',
        },
        tooltip: {
            callbacks: {
            label: ctx => ` ${ctx.parsed.y} click${ctx.parsed.y !== 1 ? 's' : ''}`,
            },
        },
        },
        scales: {
        y: {
            beginAtZero: true,
            ticks: { stepSize: 1, precision: 0 },
        },
        },
    }

    return <Line data={data} options={options} />
}
