
consultarApi()
renderGrafica()


async function consultarApi() {
    let resultado = await fetch('https://mindicador.cl/api/')
    dataMonedas = await resultado.json()
    completarSelect()
}

function completarSelect() {
    let html = ''
    let options = Object.values(dataMonedas)

    for (let index = 0; index < options.length; index++) {
        const option = options[index];

        if (index > 2) {
            html += `
            <option value="${option.codigo}" id="option${option.codigo}">${option.codigo}</option>
            `
        }
    }
    selectMonedas.innerHTML = html
    renderGrafica()
}

function renderResultado(operacion) {
    let html = ''
    html = `
    <span>Resultado: $${operacion}</span>
    `
    spanResultado.innerHTML = html
}

async function getMonedas() {
    const endpoint = `https://mindicador.cl/api/${selectMonedas.value}`
    const res = await fetch(endpoint)
    datos = await res.json()
    const datos1 = datos.serie
    console.log(datos1)
    let index = 0
    for (const dato1 of datos1) {
        ejeX[datos1.length - index] = dato1.fecha
        ejeY[datos1.length - index] = dato1.valor
        index++
    }
    console.log(ejeX)
    console.log(ejeY)
    return ejeX, ejeY
}

function chartConfig() {
    const tipoDeGrafica = "line"
    const titulo = `Valor ${selectMonedas.value}`
    const colorDeLinea = "green"

    const config = {
        type: tipoDeGrafica,
        data: {
            labels: ejeX,
            datasets: [
                {
                    label: titulo,
                    backgroundColor: colorDeLinea,
                    data: ejeY
                }
            ]
        }
    }
    return config
}

async function renderGrafica() {
    const monedas = await getMonedas();
    const config = chartConfig(monedas);
    const chartDOM = document.getElementById("myChart")
    myChart.style.width = '400px'
    myChart.style.height = '400px'
    new Chart(chartDOM, config);
}

formCambioMoneda.addEventListener('submit', (e) => {
    e.preventDefault()
    let operacion
    let arrayMonedas = Object.values(dataMonedas)
    arrayMonedas.splice(0, 3)
    console.log(arrayMonedas)
    for (const item of arrayMonedas) {
        if (item.codigo == selectMonedas.value) {
            let cambio = +inputPesos.value
            operacion = cambio * item.valor
        }
    }
    renderResultado(operacion)

})

selectMonedas.addEventListener('change', (e) => {
    e.preventDefault()
    renderGrafica()
})