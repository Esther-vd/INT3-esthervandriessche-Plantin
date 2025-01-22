
// variables for colour - canvas section
const $canvas = document.querySelector(".colour__canvas");
const $colourDrawing = document.querySelector(".colour__drawing");
const ctx = $canvas.getContext("2d");
let drawing = false;
let colourStrokeColour = "#97B7DB";

const colourDraw = (e) => {
    e.preventDefault();

    const startDrawing = e.type === 'mousedown' && drawing === false;
    const continueDrawing = e.type === 'mousemove' && drawing === true;
    const stopDrawing = e.type === 'mouseup';
    const position = getMousePos($canvas, e);

    if (startDrawing) {
        drawing = true;
        ctx.beginPath();
        ctx.moveTo(position.x, position.y);
    } else if (continueDrawing) {
        ctx.lineWidth = 10;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.strokeStyle = colourStrokeColour;
        ctx.lineTo(position.x, position.y);
        ctx.stroke();
        console.log("drawing");

    } else if (stopDrawing) {
        drawing = false;
        ctx.closePath();
    }

}
const getMousePos = (canvas, e) => {
    const rect = canvas.getBoundingClientRect();

    return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
    };
}

const colourClearCanvas = () => {
    ctx.clearRect(0, 0, $canvas.width, $canvas.height);
}

const colourChanger = (e) => {
    colourStrokeColour = e.target.dataset.colour;
    document.querySelector(".colour__option--selected").classList.remove("colour__option--selected");
    e.target.classList.add("colour__option--selected")
}

const colourMouseListeners = () => {
    //draw events
    $canvas.addEventListener('mousedown', colourDraw);
    $canvas.addEventListener('mouseup', colourDraw);
    $canvas.addEventListener('mousemove', colourDraw);
    colourEventsMobile();

    //change colour events
    document.querySelector(".colour__circle--blue").addEventListener('click', colourChanger);
    document.querySelector(".colour__circle--pink").addEventListener('click', colourChanger);
    document.querySelector(".colour__circle--green").addEventListener('click', colourChanger);
    document.querySelector(".colour__circle--yellow").addEventListener('click', colourChanger);
    //clear canvas events
    document.querySelector(".colour__circle--clear").addEventListener('click', colourClearCanvas);
}

const colourEventsMobile = () => {
    $canvas.addEventListener('touchstart', e => {
        e.preventDefault();
        let touch = e.touches[0];
        let mouseEvent = new MouseEvent("mousedown", {
            clientX: touch.clientX,
            clientY: touch.clientY
        });
        $canvas.dispatchEvent(mouseEvent);
    }, { passive: false });
    $canvas.addEventListener('touchmove', e => {
        e.preventDefault();
        let touch = e.touches[0];
        let mouseEvent = new MouseEvent("mousemove", {
            clientX: touch.clientX,
            clientY: touch.clientY
        });
        $canvas.dispatchEvent(mouseEvent);
    }, { passive: false });
    $canvas.addEventListener('touchend', () => {

        let mouseEvent = new MouseEvent("mouseup", {});
        $canvas.dispatchEvent(mouseEvent);
    }, { passive: false });
}


const init = () => {
        $canvas.width = $colourDrawing.getBoundingClientRect().width;
        $canvas.height = $colourDrawing.getBoundingClientRect().width;
        console.log($canvas.height);
        colourMouseListeners();
 
    

}

init();
