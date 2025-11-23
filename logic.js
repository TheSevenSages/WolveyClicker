const assetUrls = {
    wolvey: 'wolvey_head.png',
    meme1: 'carrot.png',
    meme2: 'booze.jpeg',
    meme3: 'aman.jpg',
    meme4: 'wav.png',
    meme5: 'suffer.jpg',
    swolvey: 'swol.png',
    igda: 'igda.png',
    tolmet: 'tolmet.webp',
    crisis: 'crisis.png',
    outofstock: 'oos.png'
};

// Game State
const assets = {
    wolvey: null,
    storeItems: [],
    powerUps: [],
    images: {}
};

const haha = new Audio('haha.mp3')

let mdpCount = 0;
let creditsPerClick = 1;
let igdaVisits = 0

let active_event = "none" // "crisis_wolverine = 5x click speed, "tolmet" = remove some memes 

let _itemTemplate = {
    count: 0,
    cost: 1,
    level: 1,
    creditsPerSecond: 1,
    name: "",
    image: "",
    audio: ""
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
        if (Math.random() < 0.001 * element.count)
        {
            let audio = new Audio(element.audio)
            audio.onload = flyImage(element.image, audio, 5000, 0.2)
        }
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

// --- NEW UTILITY: NORMALIZE IMAGE SCALE ---
function normalizeImageScale(img, targetWidth = 100, targetHeight = 100) {
    // Calculate the scale needed to achieve the target dimensions (e.g., 100x100)
    const scaleX = targetWidth / img.width;
    const scaleY = targetHeight / img.height;
    
    // Apply the scale factors directly to the fabric image object
    img.set({
        scaleX: scaleX,
        scaleY: scaleY
    });
}

function startRandomIntervalLoop(task, min, max) {
    // Configuration: Minutes converted to milliseconds
    const MIN_MINUTES = min;
    const MAX_MINUTES = max;
    
    const minDelay = MIN_MINUTES * 60 * 1000;
    const maxDelay = MAX_MINUTES * 60 * 1000;

    function scheduleNext() {
        // Calculate a random time between minDelay and maxDelay
        // Math.random() generates a float between 0 and 1
        const randomTime = Math.floor(Math.random() * (maxDelay - minDelay + 1) + minDelay);

        // Optional: Log when the next execution will happen (for debugging)
        const nextTimeMinutes = (randomTime / 60000).toFixed(2);
        console.log(`Next execution scheduled in ${nextTimeMinutes} minutes.`);

        setTimeout(() => {
            // 1. Execute the actual task
            try {
                task();
            } catch (error) {
                console.error("Error executing task:", error);
            }
        }, randomTime);
    }

    // Start the loop
    scheduleNext();
}

function tolmet()
{
    if (active_event != 'none') {
        startRandomIntervalLoop(tolmet, 1 , 2)
        return
    }
    let randomItem = Math.floor(Math.random() * itemTracker.length);
    i = 0
    while (itemTracker[randomItem].count <= 0){
        if (i >= 5) {return}
        randomItem = Math.floor(Math.random() * itemTracker.length)
        i += 1
    }
    itemTracker[randomItem].count -= 5
    if (itemTracker[randomItem].count < 0) {itemTracker[randomItem].count = 0}
    triggerImageChaos(assets.images.tolmet, 20, 5000, haha)
    showRedAlert('TOLMET IS HERE!', `5 ${itemTracker[randomItem].name} are gone for good!`, '#ff0000', '#8b0000')
    assets.storeItems[randomItem].fire('tolmet', {})
    startRandomIntervalLoop(tolmet, 4, 7)
}

const minTime = 3
const maxTime = 5
function crisis()
{
    if (active_event != 'none') {
        startRandomIntervalLoop(crisis, 1, 2)
        return
    }
    console.log('its a crisis!!')
    showRedAlert('ITS A CRISIS WOLVERINE!', `Austin Yarger is giving out lots of extra credit per click!`, '#11e30eff', '#0b8c16ff')
    triggerSineImageFlow(assets.images.crisis, 20, 30 * 1000, 5, 1000)
    active_event = 'crisis_wolverine'

    // Trigger code after X seconds
    setTimeout(() => {
        active_event = 'none'
    }, 30 * 1000);
    startRandomIntervalLoop(crisis, minTime * Math.pow(0.85, igdaVisits), maxTime * Math.pow(0.85, igdaVisits))
}

function startEventTimers(){
    // tolmet timer
    startRandomIntervalLoop(tolmet, 2, 4)
    startRandomIntervalLoop(crisis, 3, 5)
}

function showRedAlert(messageText, subtext, color1, color2) {
    // 1. Create the Text Object
    const t1 = new fabric.Text(messageText, {
        fontSize: 50,
        fontFamily: 'Arial',
        fontWeight: 'bold',
        fill: color1,      // Bright Red
        stroke: color2,    // Dark Red Outline for readability
        strokeWidth: 1,
        originX: 'center',
        top: 0,
        shadow: new fabric.Shadow({ color: 'black', blur: 10, offsetX: 0, offsetY: 0 })
    });
    const t2 = new fabric.Text(subtext, {
        fontSize: 22,
        fontFamily: 'Arial',
        fontWeight: 'bold',
        fill: color1,      // Bright Red
        stroke: color2,    // Dark Red Outline for readability
        strokeWidth: 1,
        originX: 'center',
        top: 50,
        shadow: new fabric.Shadow({ color: 'black', blur: 10, offsetX: 0, offsetY: 0 })
    });

    const g = new fabric.Group([t1, t2], {
        originX: 'center',    // Center horizontally
        originY: 'top',       // Align to top edge
        left: canvas.width / 2,
        top: 50,              // 50px down from the top
        opacity: 0,           // Start invisible
        selectable: false,    // User can't drag it
        evented: false,       // Clicks pass through it
    })

    // canvas.add(alertText);
    canvas.add(g);
    // canvas.bringToFront(alertText); // Ensure it sits on top of UI
    canvas.bringToFront(g); // Ensure it sits on top of UI

    // 2. Fade In Animation
    g.animate('opacity', 1, {
        duration: 500, // 0.5 seconds to fade in
        onChange: canvas.renderAll.bind(canvas),
        
        // 3. Wait 3 Seconds
        onComplete: () => {
            setTimeout(() => {
                
                // 4. Fade Out Animation
                g.animate('opacity', 0, {
                    duration: 1000, // 1 second to fade out
                    onChange: canvas.renderAll.bind(canvas),
                    
                    // 5. Cleanup (Remove from memory/canvas)
                    onComplete: () => {
                        canvas.remove(g);
                    }
                });
                
            }, 3000); // 3000ms = 3 seconds wait
        }
    });
}