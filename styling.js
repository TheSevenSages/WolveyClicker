// --- NEW: BACKGROUND BAR ANIMATION ---
function createSpinningBars() {
    const barGroup1 = new fabric.Group([], {
        selectable: false,
        evented: false,
        originX: 'center',
        originY: 'center',
        opacity: 0.16 // Make them subtle
    });
    const barGroup2 = new fabric.Group([], {
        selectable: false,
        evented: false,
        originX: 'center',
        originY: 'center',
        opacity: 0.1 // Make them subtle
    });

    let totalAngles = 90
    while (totalAngles <= 270)
    {
        const bar = new fabric.Rect({
            width: 5000, // Will always span past the edge of the screen
            height: totalAngles % 10,
            fill: '#6F76B4',
            angle: totalAngles,
            originX: 'center',
            originY: 'top'
        });
        barGroup2.addWithUpdate(bar);
        totalAngles += 4
    }
    totalAngles = 0
    while (totalAngles < 360)
    {
        const bar = new fabric.Rect({
            width: 2000, // Will always span past the edge of the screen
            height: 5,
            fill: '#424eb9',
            angle: totalAngles,
            originX: 'center',
            originY: 'top'
        });
        barGroup1.addWithUpdate(bar);
        totalAngles += 5
    }
    // canvas.add(barGroup1);
    // canvas.add(barGroup2);
    canvas.sendToBack(barGroup1);
    canvas.sendToBack(barGroup2);
    // Save to gameState for easy access in layout and animation
    // gameState.backgroundBars = barGroup;

    // Start the rotation animation loop
    (function animateBars() {
        // Increase the angle slightly (0.1 degrees per frame)
        let currentAngle = barGroup1.angle;
        barGroup1.set('angle', (currentAngle + 0.02) % 360);

        currentAngle = barGroup2.angle;
        barGroup2.set('angle', (currentAngle - 0.01) % 360);
        canvas.requestRenderAll();
        fabric.util.requestAnimFrame(animateBars);
    })();

    const group = new fabric.Group([barGroup1, barGroup2], {
        selectable: false,
        evented: false,
        originX: 'center',
        originY: 'center',
    })

    return group
}