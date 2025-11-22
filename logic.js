let mdpCount = 0;
let creditsPerClick = 1;
let totalCreditsPerSecond = 0;

let _itemTemplate = {
    count: 0,
    creditsPerSecond: 1
}

let itemTracker = [
    JSON.parse(JSON.stringify(_itemTemplate)),
    JSON.parse(JSON.stringify(_itemTemplate)),
    JSON.parse(JSON.stringify(_itemTemplate)),
    JSON.parse(JSON.stringify(_itemTemplate)),
    JSON.parse(JSON.stringify(_itemTemplate))
]

function tick()
{
    let tickValue = 0
    itemTracker.forEach(element => {
        tickValue += element.count * (element.creditsPerSecond / 60)
    });
    mdpCount += tickValue
    totalCreditsPerSecond = Math.floor(tickValue * 60)
}
// Set tick speed to 1/60th of a second
window.setInterval(tick, 1000 / 60)
