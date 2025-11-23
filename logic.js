const assetUrls = {
    wolvey: 'images.png',
    meme1: 'carrot.png',
    meme2: 'images.png',
    meme3: 'images.png',
    meme4: 'images.png',
    meme5: 'images.png',
    swolvey: 'images.png',
    igda: 'images.png',
    tolmet: 'tolmet.webp'
};

// Game State
const assets = {
    wolvey: null,
    storeItems: [],
    powerUps: [],
    images: {}
};

let mdpCount = 0;
let creditsPerClick = 1;
let igdaVisits = 0

let active_event = "none" // "crisis_wolverine = 5x click speed, "tolmet" = remove some memes 

let _itemTemplate = {
    count: 0,
    cost: 1,
    level: 1,
    creditsPerSecond: 1,
    name: ""
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
    const randomItem = Math.floor(Math.random() * itemTracker.length);
    itemTracker[randomItem].count -= 5
    if (itemTracker[randomItem].count < 0) {itemTracker[randomItem].count = 0}
    console.log('no soul!', randomItem)
    triggerImageChaos(assets.images.tolmet, 20)
    showRedAlert('TOLMET IS HERE!', `5 ${itemTracker[randomItem].name} are gone for good!`, '#ff0000', '#8b0000')
    assets.storeItems[randomItem].fire('tolmet', {})
    startRandomIntervalLoop(tolmet, 4, 7)
}

const minTime = 3
const maxTime = 5
function crisis()
{
    console.log('its a crisis!!')
    
    startRandomIntervalLoop(crisis, minTime * Math.pow(0.85, igdaVisits), 0.2 * Math.pow(0.85, igdaVisits))
}

function startEventTimers(){
    // tolmet timer
    startRandomIntervalLoop(tolmet, 0, 0)
    startRandomIntervalLoop(crisis, 0.1, 0.1)
}

function showRedAlert(messageText, subtext, color1, color2) {
    // 1. Create the Text Object
    const t1 = new fabric.Text(messageText, {
        fontSize: 40,
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
        fontSize: 40,
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
                        canvas.remove(alertText);
                    }
                });
                
            }, 3000); // 3000ms = 3 seconds wait
        }
    });
}

/**
 * Spawns a chaotic swarm of images that fly around the screen.
 * @param {HTMLImageElement} imgElement - The source image to replicate.
 * @param {number} count - How many images to spawn (default 20).
 * @param {number} duration - How long (ms) they last (default 5000ms).
 */
function triggerImageChaos(imgElement, count = 20, duration = 5000) {
    const particles = [];
    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;

    // 1. Create Particles
    for (let i = 0; i < count; i++) {
        const p = new fabric.Image(imgElement, {
            left: canvasWidth / 2,
            top: canvasHeight / 2,
            originX: 'center',
            originY: 'center',
            selectable: false,
            evented: false,
            opacity: 1,
            // Random Scale between 0.5 and 1.5
            scaleX: Math.random() + 0.5,
            scaleY: Math.random() + 0.5,
            // Start at random angle
            angle: Math.random() * 360
        });
        normalizeImageScale(p, 100, 100)

        // Custom physics properties attached to the object
        p.velocity = {
            x: (Math.random() - 0.5) * 25, // Speed X: -12.5 to 12.5
            y: (Math.random() - 0.5) * 25, // Speed Y: -12.5 to 12.5
            rotation: (Math.random() - 0.5) * 20 // Spin speed
        };

        canvas.add(p);
        particles.push(p);
    }

    // Ensure they are on top
    particles.forEach(p => canvas.bringToFront(p));

    let startTime = Date.now();
    let running = true;

    // 2. Animation Loop
    function animate() {
        if (!running) return;

        const now = Date.now();
        const elapsed = now - startTime;
        const progress = elapsed / duration;

        if (elapsed > duration) {
            // Cleanup
            particles.forEach(p => canvas.remove(p));
            running = false;
            canvas.requestRenderAll();
            return;
        }

        particles.forEach(p => {
            // Move
            p.left += p.velocity.x;
            p.top += p.velocity.y;
            p.angle += p.velocity.rotation;

            // Bounce off walls
            if (p.left < 0 || p.left > canvas.width) {
                p.velocity.x *= -1;
            }
            if (p.top < 0 || p.top > canvas.height) {
                p.velocity.y *= -1;
            }

            // Fade out in the last 20% of the duration
            if (progress > 0.8) {
                p.set('opacity', 1 - ((progress - 0.8) * 5));
            }
        });

        canvas.requestRenderAll();
        fabric.util.requestAnimFrame(animate);
    }

    // Start the chaos
    animate();
}