const dateFrom = getPrevDay(10);
const dateTo = getPrevDay(0);
const URL = `https://api.carbonintensity.org.uk/intensity/`;

(() => {
    fetchData(dateFrom, dateTo)
        .then(function(response) { return calcutateStatistics(response, dateFrom, dateTo) })
        .then(display);
})();

function getPrevDay(x) {
    const date = new Date();
    date.setDate(date.getDate() - x);
    return date.toISOString().slice(0, 10)
}

async function fetchData(dateFrom, dateTo) {
    let response = await fetch(`${URL}${dateFrom}/${dateTo}`);
    if (!response.ok) {
        throw Error("Cannnot get response");
    }
    let responseJson = await response.json();
    return responseJson.data;
}

async function calcutateStatistics(dataList, dateFrom, dateTo) {
    const diffTime = Math.abs(new Date(dateFrom) - new Date(dateTo));
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const results = [];

    for (let i = 1; i <= diffDays; i++) {
        results.push(getData(dataList, getPrevDay(i)))
    }
    return results;
}


function getData(dataList, date) {
    const filteredData = dataList
        .filter(e => e.to.startsWith(date))
        .map(e => e.intensity.forecast)
        .sort((a, b) => b - a);

    const minForecast = filteredData[filteredData.length - 1];
    const maxForecast = filteredData[0];

    return {
        date: date,
        max: maxForecast,
        min: minForecast
    }
}

async function display(x) {
    x.forEach(createDiv)
}

function createDiv(x) {
    let colorName = (x.min > 250 || x.max > 250) ?
        "red" :
        "green";

    let newDiv = document.createElement("div");
    newDiv.innerHTML = `
        ${x.date} Min forecast: ${x.min} Max forecast: ${x.max}
        <img src='./img/${colorName}.jpg'/>
    `;
    newDiv.style.color = colorName;

    document.querySelector(".container").appendChild(newDiv);
}