let mdpCount = 0;
let creditsPerClick = 1;

let active_event = "none" // "crisis_wolverine = 5x click speed, "tolmet" = remove some memes 

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

function click()
{
    let clickValue = creditsPerClick
    if (active_event == "crisis_wolverine") {
        clickValue *= 5
    }  
    mdpCount += clickValue
}

function tick()
{
    let tickValue = 0
    itemTracker.forEach(element => {
        tickValue += element.count * (element.creditsPerSecond / 60)
    });
    mdpCount += tickValue
}
// Set tick speed to 1/60th of a second
window.setInterval(tick, 1000 / 60)

function CalculateUpgradeCost(itemIndex)
{
    return Math.pow(10, itemIndex + 1) * Math.pow(5, itemTracker[itemIndex].level)
}

function RoundToPlace(number, place){
    return Math.round(number * place) / place
}

function NumberFormatter(number) {
    // Fuck it, scientific notation
    if (number / Math.pow(10, 30) > 1) {
        power = 30
        while (number / Math.pow(10, power) > 9){
            power++
        } 
        return `${RoundToPlace(number / Math.pow(10, power), 10)}e^${NumberFormatter(power)}`
    }  

    // If # >= 1ot format as # / 1ot + ot
    if (number / Math.pow(10, 27) > 1) {
        return `${RoundToPlace(number / Math.pow(10, 27), 10)}ot`
    }    // If # >= 1sp format as # / 1sp + sp
    if (number / Math.pow(10, 24) > 1) {
        return `${RoundToPlace(number / Math.pow(10, 24), 10)}sp`
    }    // If # >= 1sx format as # / 1sx + sx
    if (number / Math.pow(10, 21) > 1) {
        return `${RoundToPlace(number / Math.pow(10, 21), 10)}sx`
    }
    // If # >= 1qi format as # / 1qi + qi
    if (number / Math.pow(10, 18) > 1) {
        return `${RoundToPlace(number / Math.pow(10, 18), 10)}qi`
    }
    // If # >= 1qa format as # / 1qa + qa
    if (number / Math.pow(10, 15) > 1) {
        return `${RoundToPlace(number / Math.pow(10, 15), 10)}qa`
    }
    // If # > 999,999,999,999 format as # / 1,000,000,000,000 + t
    if (number / Math.pow(10, 12) > 1) {
        return `${RoundToPlace(number / Math.pow(10, 12), 10)}t`
    }
    // If # > 999,999,999 format as # / 1,000,000,000 + b
    if (number / Math.pow(10, 9) > 1) {
        return `${RoundToPlace(number / Math.pow(10, 9), 10)}b`
    }
    // If # > 999,999 format as # / 1,000,000 + m
    if (number / Math.pow(10, 6) > 1) {
        return `${RoundToPlace(number / Math.pow(10, 6), 10)}m`
    }
    // If # > 999 format as # / 1000 + k
    if (number / Math.pow(10, 3) > 1) {
        return `${RoundToPlace(number / Math.pow(10, 3), 10)}k`
    }
    return number
}

// // --- NEW UTILITY: NORMALIZE IMAGE SCALE ---
// function normalizeImageScale(img, targetWidth = 100, targetHeight = 100) {
//     // Calculate the scale needed to achieve the target dimensions (e.g., 100x100)
//     const scaleX = targetWidth / img.width;
//     const scaleY = targetHeight / img.height;
    
//     // Apply the scale factors directly to the fabric image object
//     img.set({
//         scaleX: scaleX,
//         scaleY: scaleY
//     });
// }