const dateFrom = getPrevDay(6);
const dateTo = getPrevDay(0);
const URL = `https://api.carbonintensity.org.uk/intensity/${dateFrom}/${dateTo}`;

(() => {
    fetchData()
        .then(calcutateStatistics)
        .then(display);
})();

function getPrevDay(x) {
    const date = new Date();
    date.setDate(date.getDate() - x);
    return date.toISOString().slice(0, 10)
}

async function fetchData() {
    let response = await fetch(URL);
    if (!response.ok) {
        throw Error("Cannnot get response");
    }
    let responseJson = await response.json();
    console.log(responseJson);
    return responseJson.data;
}

async function calcutateStatistics(dataList) {
    const a = getData(dataList, getPrevDay(1));
    console.log(a);
    const b = getData(dataList, getPrevDay(2));
    const c = getData(dataList, getPrevDay(3));
    const d = getData(dataList, getPrevDay(4));
    const e = getData(dataList, getPrevDay(5));
    return [a, b, c, d, e];
}


function getData(dataList, date) {
    const filteredData = dataList
        .filter(e => e.to.startsWith(date))
        .map(e => e.intensity.forecast)
        .sort((a, b) => b - a);
    console.log(filteredData);
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
    let colorName = (x.min > 250 || x.max > 250)
        ? "red"
        : "green";

    let newDiv = document.createElement("div");
    newDiv.innerHTML = `
        ${x.date} Min forecast: ${x.min} Max forecast: ${x.max}
        <img src='./img/${colorName}.jpg'/>
    `;
    newDiv.style.color = colorName;

    document.querySelector(".container").appendChild(newDiv);
}

