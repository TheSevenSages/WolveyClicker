/**
 * Spawns multiple instances of an image that flow from top to bottom 
 * in multiple, distinct, and synchronized sine wave lines (lanes), 
 * releasing them in staggered rows over time.
 * * IMPORTANT: The vertical speed is dynamically calculated to ensure the final
 * row reaches the bottom exactly at the 'duration' time mark.
 * * * @param {HTMLImageElement} imgElement - The source image to replicate.
 * @param {number} numRows - The number of rows/groups of images to spawn (default 5).
 * @param {number} duration - How long (ms) the entire flow lasts, from first spawn to last particle off-screen (default 6000ms).
 * @param {number} lanes - The number of distinct horizontal lanes/columns (default 3).
 * @param {number} [delayBetweenRowsMs=500] - The time delay in milliseconds between spawning each row.
 */
function triggerSineImageFlow(imgElement, numRows = 5, duration = 6000, lanes = 3, delayBetweenRowsMs = 500) {
    if (!imgElement) return;

    const particles = [];
    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;
    
    // Scale images down if they are too large
    const scaleFactor = Math.min(1, 80 / imgElement.width); 
    const imgHeightScaled = imgElement.height * scaleFactor;

    // Calculate lane geometry
    const laneWidth = canvasWidth / lanes;
    const startY = -imgHeightScaled; // Starting position above the screen
    const totalDistance = canvasHeight + imgHeightScaled;

    // --- CRITICAL TIMING CALCULATION ---
    
    // 1. Calculate the total time elapsed before the last row is spawned.
    const totalSpawnDelay = (numRows - 1) * delayBetweenRowsMs;

    // 2. Determine the time remaining for the LAST row to cross the screen.
    let requiredCrossingTime = duration - totalSpawnDelay;

    // 3. Safety Check: Ensure the time available for the last row is positive.
    // If requiredCrossingTime <= 0, the delay is too long, so we enforce a minimum crossing time (e.g., 20% of duration).
    const minCrossingTime = duration * 0.2;
    if (requiredCrossingTime <= minCrossingTime) {
        // If the delay is too long, we calculate the speed based on a minimum viable crossing time.
        // This ensures the particles move fast enough, but the entire effect will exceed the stated 'duration'.
        console.warn(`[Sine Flow] Spawn delay (${totalSpawnDelay}ms) is too long for duration (${duration}ms). Adjusting speed.`);
        requiredCrossingTime = minCrossingTime;
    }

    // 4. Calculate the required vertical speed: Distance / Time.
    // This speed ensures the last particle covers the distance in 'requiredCrossingTime'.
    const verticalSpeed = totalDistance / requiredCrossingTime; 

    // --- END CRITICAL TIMING CALCULATION ---

    // Animation Constants
    const amplitude = laneWidth * 0.4; 
    const frequency = 0.5; 
    const lanePhaseStep = (Math.PI * 2) / lanes; 
    
    let isAnimating = false;
    
    /** Creates one particle and adds it to the list of animated objects. */
    function createParticle(rowIndex, laneIndex) {
        const initialX = (laneIndex * laneWidth) + (laneWidth / 2); 

        const p = new fabric.Image(imgElement, {
            left: initialX, 
            top: startY,
            originX: 'center',
            originY: 'top',
            selectable: false,
            evented: false,
            opacity: 0.35,
            scaleX: scaleFactor,
            scaleY: scaleFactor,
            baseX: initialX, 
            laneIndex: laneIndex,
            // Record individual particle spawn time from the moment the function was called
            spawnTime: Date.now() 
        });

        canvas.add(p);
        particles.push(p);

        if (!isAnimating) {
            isAnimating = true;
            animateFlow();
        }
    }
    
    /** Spawns one entire row (one particle per lane) */
    function spawnRow(rowIndex) {
        for (let lane = 0; lane < lanes; lane++) {
             createParticle(rowIndex, lane);
        }
    }
    
    // 1. Schedule the rows using setTimeout for the staggered effect
    for (let i = 0; i < numRows; i++) {
        setTimeout(() => {
            spawnRow(i);
        }, i * delayBetweenRowsMs);
    }
    
    // 2. The continuous animation loop
    function animateFlow() {
        if (!isAnimating) return;

        const currentTime = Date.now();
        const particlesToRemove = [];

        // Iterate backwards to safely remove items
        for (let i = particles.length - 1; i >= 0; i--) {
            const p = particles[i];
            
            // Calculate elapsed time based on when THIS particle was spawned
            const elapsed = currentTime - p.spawnTime;
            const timeFactor = elapsed / 1000; // Convert elapsed to seconds

            // 1. Vertical Movement: Use the calculated speed based on particle's individual elapsed time
            const newTop = startY + (verticalSpeed * elapsed);
            p.set('top', newTop);

            // 2. Horizontal Movement: Sine Wave with a phase shift based on the lane
            const wavePhaseOffset = p.laneIndex * lanePhaseStep;
            const sineOffset = amplitude * Math.sin(frequency * timeFactor + wavePhaseOffset); 
            p.set('left', p.baseX + sineOffset);
            
            // 3. Fade out the particle as it leaves the bottom 20% of the screen
            const fadeDistance = canvasHeight * 0.2; 
            if (p.top > canvasHeight - fadeDistance) {
                const opacityProgress = (p.top - (canvasHeight - fadeDistance)) / fadeDistance;
                p.set('opacity', Math.max(0, 0.35 - opacityProgress));
            }

            // 4. Cleanup check: remove if completely off-screen
            if (p.top > canvasHeight + imgHeightScaled * 0.5) {
                particlesToRemove.push(p);
                particles.splice(i, 1); // Remove from array immediately
            }
        }

        // Final Canvas Cleanup
        particlesToRemove.forEach(p => canvas.remove(p));

        canvas.requestRenderAll();
        
        // Continue looping as long as there are particles to move.
        if (particles.length > 0) {
            fabric.util.requestAnimFrame(animateFlow);
        } else {
             isAnimating = false;
        }
    }
}

/**
 * Spawns a chaotic swarm of images that fly around the screen.
 * @param {HTMLImageElement} imgElement - The source image to replicate.
 * @param {number} count - How many images to spawn (default 20).
 * @param {number} duration - How long (ms) they last (default 5000ms).
 */
function triggerImageChaos(imgElement, count = 20, duration = 5000, bounceSound) {
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
                if (bounceSound){
                    bounceSound.play()
                }
            }
            if (p.top < 0 || p.top > canvas.height) {
                p.velocity.y *= -1;
                if (bounceSound){
                    bounceSound.play()
                }
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

/**
 * Triggers a single animation where an image flies across the screen 
 * from side to side once, with a chance to play an audio file during the flight.
 * * * @param {HTMLImageElement} imgElement - The source image to fly across the screen.
 * @param {HTMLAudioElement} audioElement - The source audio to play (must be preloaded/ready).
 * @param {number} flightDuration - Time in milliseconds for one trip across the screen (e.g., 5000).
 * @param {number} [chanceToPlay=0.4] - Probability (0.0 to 1.0) the audio will play during this flight.
 * @returns {fabric.Image} The single Fabric image object created for this flight.
 */
function flyImage(imgElement, audioElement, flightDuration, chanceToPlay = 0.4) {
    if (!imgElement || !audioElement) {
        console.error("Missing image or audio element for flying event.");
        return null;
    }

    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;
    
    // Scale the image down for better visibility
    const scale = Math.min(1, 150 / imgElement.width); 

    const flyingImage = new fabric.Image(imgElement, {
        originX: 'center',
        originY: 'center',
        scaleX: scale,
        scaleY: scale,
        selectable: false,
        evented: false, // Ensures it never blocks interaction
        visible: true, // Start visible as it's a single flight
    });
    
    // Add to canvas and send to the background layer
    canvas.add(flyingImage);
    canvas.sendToBack(flyingImage);

    // 1. Determine direction and starting/ending X coordinates
    const direction = Math.random() < 0.5 ? 'right' : 'left';
    const imgW = flyingImage.width * scale; 
    
    let startX, endX;
    
    if (direction === 'right') { // Fly from Left to Right
        startX = -imgW;
        endX = canvasWidth + imgW;
    } else { // Fly from Right to Left
        startX = canvasWidth + imgW;
        endX = -imgW;
    }

    // 2. Determine random Y position
    const randomY = Math.random() * (canvasHeight - 200) + 100;
    
    // 3. Apply initial state
    flyingImage.set({
        left: startX,
        top: randomY,
        angle: direction === 'right' ? 0 : 180, // Rotate if flying left
        opacity: 0.5
    });
    normalizeImageScale(flyingImage, 80, 80)

    // 4. Decide if audio plays
    const shouldPlayAudio = Math.random() < chanceToPlay;
    if (shouldPlayAudio) {
        audioElement.currentTime = 0;
        audioElement.play().catch(e => console.log("Audio playback blocked:", e));
    }

    // 5. Start the Fabric animation
    flyingImage.animate('left', endX, {
        duration: flightDuration,
        easing: fabric.util.ease.easeLinear,
        onChange: canvas.renderAll.bind(canvas),
        onComplete: () => {
            // 6. Cleanup: Remove the object from the canvas
            if (shouldPlayAudio) {
                audioElement.pause();
            }
            canvas.remove(flyingImage);
            canvas.requestRenderAll();
        }
    });
    
    return flyingImage;
}