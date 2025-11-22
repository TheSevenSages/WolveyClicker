let mdpCount = 0;
let creditsPerClick = 1;

let _itemTemplate = {
    count: 0,
    cost: 1,
    level: 1,
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

function CalculateUpgradeCost(itemIndex)
{
    return Math.pow(10, itemIndex + 1) * Math.pow(5, itemTracker[itemIndex].level)
}
