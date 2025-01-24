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
    } else if (stopDrawing) {
        drawing = false;
        ctx.closePath();
    };
};

const getMousePos = (canvas, e) => {
    const rect = canvas.getBoundingClientRect();
    return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
    };
};

const colourClearCanvas = () => {
    ctx.clearRect(0, 0, $canvas.width, $canvas.height);
}

const colourChanger = (e) => {
    colourStrokeColour = e.target.dataset.colour;
    document.querySelector(".colour__option--selected").classList.remove("colour__option--selected");
    e.target.classList.add("colour__option--selected");
};

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
};

const colourEventsMobile = () => {
    //activate the mouse events when a touch event is activated but with the touch coordinates
    $canvas.addEventListener('touchstart', e => {
        e.preventDefault();
        let touch = e.touches[0];
        let mouseEvent = new MouseEvent("mousedown", {
            clientX: touch.clientX,
            clientY: touch.clientY
        });
        $canvas.dispatchEvent(mouseEvent);
    }, { passive: false }); // web browser don't prevent the scroll with a passive event listener
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
};

const colourSetup = () => {
    $canvas.width = $colourDrawing.getBoundingClientRect().width;
    $canvas.height = $colourDrawing.getBoundingClientRect().width;
    colourMouseListeners();
};

//variables for the pamphlet interaction
const $imgs = document.querySelectorAll(".shake__img");
const $box = document.querySelector(".shake__container");

const pamphletImgToRandomPos = (img) => {
    const numX = Math.floor(Math.random() * ($box.getBoundingClientRect().width - 100));
    const numY = Math.floor(Math.random() * (($box.getBoundingClientRect().height - 250) - 100) + 100);
    const angle = Math.floor(Math.random() * (60 + 60) - 60);
    img.style.left = `${numX}px`;
    img.style.top = `${numY}px`;
    img.style.transform = `rotate(${angle}deg)`
    img.classList.remove("hide");
};

const pamphletPlaceImg = () => {
    $imgs.forEach(img => {
        pamphletImgToRandomPos(img);
        img.addEventListener("mouseover", () => { img.classList.add('hide'); });
    });
}

const requestT = () => {
    document.querySelector(".shake__permission").classList.add('hide');
    if (typeof DeviceMotionEvent.requestPermission === 'function') {
        DeviceMotionEvent.requestPermission()
            .then(response => {
                if (response == 'granted') {
                    window.addEventListener('devicemotion', (e) => {
                        if ((e.rotationRate.alpha > 256 || e.rotationRate.beta > 256 || e.rotationRate.gamma > 256)) {
                            $imgs.forEach(img => {
                                img.classList.add('hide')
                            });
                        }
                    }, false)
                }
            })
            .catch(console.error)
    } else {
        window.addEventListener('devicemotion', (e) => {
            if ((e.rotationRate.alpha > 256 || e.rotationRate.beta > 256 || e.rotationRate.gamma > 256)) {
                $imgs.forEach(img => {
                    img.classList.add('hide')
                });
            }
        })
    }
}

//stamp section variables
const $stamps = document.querySelectorAll(".stamp__img");
const $stampsplace = document.querySelectorAll(".stamp__img__place");
const $stampSection = document.querySelector(".stamps__container");
let stampCounter = 0;
const stampMaximum = 8;

// const stampMouseFollow = (stamp, section) => {
//     section.addEventListener("mouseenter", e => {
//         gsap.to(stamp, { scale: 1, opacity: 1 }, 0.3);
//         positionCircle(e, stamp, section);
//     });
//     section.addEventListener("mouseleave", e => {
//         gsap.to(stamp, { scale: 0, opacity: 0 }, 0.3);
//         positionCircle(e, stamp, section);
//     });

//     section.addEventListener("mousemove", e => {
//         gsap.to(stamp, { scale: 1, opacity: 1 }, 0.3);
//         positionCircle(e, stamp, section);
//     });
// }

// const positionCircle = (e, stamp, section) => {
//    let xTo = gsap.quickTo(stamp, "x", { duration: 0.3 });
//     let yTo = gsap.quickTo(stamp, "y", { duration: 0.3 });
//     xTo(e.pageX - section.offsetLeft);
//     yTo(e.pageY - section.offsetTop);
// }

const stampClick = (e) => {
    if (stampCounter < stampMaximum) {
        $stamps[stampCounter].classList.remove("hide");
        gsap.set($stamps[stampCounter], { x: e.pageX - $stampSection.offsetLeft, y: e.pageY - $stampSection.offsetTop, scale: 1 }, 0.3);
        stampCounter++;
    } else {
        stampCounter = 0;
        gsap.set($stamps[stampCounter], { x: e.pageX - $stampSection.offsetLeft, y: e.pageY - $stampSection.offsetTop, scale: 1 }, 0.3);
        stampCounter++;
    }
}

const stampSetup = () => {
    $stamps.forEach(stamp => {
        gsap.set(stamp, { scale: 0, xPercent: -50, yPercent: -50 });
    });
    $stampSection.addEventListener('click', e => stampClick(e));
}

//scrollytelling sections
let mm = gsap.matchMedia();

//achievements gsap
const $billsReceiptLeft = document.querySelector(".achievements__receipt__left");
const $billsReceiptRight = document.querySelector(".achievements__receipt__right");

const billsTimeline = () => {
    $billsReceiptLeft.classList.remove("hide");
    $billsReceiptRight.classList.remove("hide");
    let bilssTl = gsap.timeline({
        scrollTrigger: {
            trigger: ".achievements__container",
            start: "top bottom",
            end: "bottom top",
            toggleActions: "play none reverse none",
            scrub: .5,
        },
    });

    mm.add("(max-width: 799px)", () => {
        bilssTl.from($billsReceiptRight, { x: 600, y: -600, duration: 1, delay: 2 },)
            .from($billsReceiptLeft, { x: -600, y: -600, duration: 6 },)

    });
    mm.add("(min-width: 800px)", () => {
        bilssTl.from($billsReceiptRight, { x: 600, y: -600 }, "-2")
            .from($billsReceiptLeft, { x: -600, y: -600 }, "<")
    });
}

//printer gsap
const printerTimeline = () => {
    let printerTl = gsap.timeline({
        scrollTrigger: {
            trigger: ".printer__container",
            start: "top bottom",
            end: "bottom top",
            toggleActions: "play none reverse none",
            scrub: .5,
        },
    });

    printerTl.from(".printer__book__container", {
        x: - 500
    })
}

//25000 section gsap
const $receiptTop = document.querySelector(".receipt__transition__top");
const $receiptBottom = document.querySelector(".receipt__transition__bottom");

const receiptTimeline = () => {
    let numberTl = gsap.timeline({
        scrollTrigger: {
            trigger: ".receipt__transition__container",
            start: "top bottom",
            end: "bottom top",
            toggleActions: "play none reverse none",
            scrub: .5,
        },
    });

    numberTl.from($receiptBottom, { x: 400, y: -400 })
        .from($receiptTop, { x: -400, y: -400 }, "<");

    let numberReverseTl = gsap.timeline({
        scrollTrigger: {
            trigger: ".receipt__transition__container---reverse",
            start: "top bottom",
            end: "bottom top",
            toggleActions: "play none reverse none",
            scrub: .5,
        },
    });

    numberReverseTl.from(".receipt__transition__bottom--reverse", { x: 400, y: -400 })
        .from(".receipt__transition__top--reverse", { x: -400, y: -400 }, "<");

}

//map of Antwerp gsap

const mapTimeline = () => {
    let mapTl = gsap.timeline({
        scrollTrigger: {
            trigger: ".map__container",
            start: "top bottom",
            end: "top",
        },
    });

    mapTl.from(".map__dart", { x: -600, y: -600, duration: .7, ease: "power4.in" })
}

//pitfalls section gsap
const pitfallsTimeline = () => {
    let mapTl = gsap.timeline({
        scrollTrigger: {
            trigger: ".pitfall__container",
            start: "top bottom",
            end: "top center",
            scrub: .6,
            toggleActions: "play none reverse none",
        },
    });

    mapTl.from(".pitfall__dart", { x: 1000, y: -1000, })
}

//gsap card effect
const cardTilt = (e, card) => {
    const movingcard = `.${card}`;
    const xPos = (e.clientX / window.innerWidth) - 0.5;
    const yPos = (e.clientY / window.innerHeight) - 0.5;

    gsap.to(movingcard, 0.6, {
        rotationY: 5 * xPos,
        rotationX: 5 * yPos,
        ease: Power1.easeOut,
        transformPerspective: 200,
        transformOrigin: 'center'
    });
}

const cardsSetup = () => {
    const $id = document.querySelector(".introduction__img");
    document.addEventListener("mousemove", ((e) => { cardTilt(e, $id.classList) }));
    const $green = document.querySelector(".pamphlets__greenimg");
    document.addEventListener("mousemove", ((e) => { cardTilt(e, $green.classList[0]) }));
    const $pink = document.querySelector(".pamphlets__pinkimg ");
    document.addEventListener("mousemove", ((e) => { cardTilt(e, $pink.classList[0]) }));
    const $blue = document.querySelector(".pamphlets__blueimg ");
    document.addEventListener("mousemove", ((e) => { cardTilt(e, $blue.classList[0]) }));
}

const init = () => {
    gsap.registerPlugin(ScrollTrigger);
    colourSetup();
    //pamphlet interaction
    pamphletPlaceImg();
    document.querySelector(".shake__permission").addEventListener("click", requestT());
    //stamp interaction
    stampSetup();

    //scrolltriggers
    billsTimeline();
    printerTimeline();
    receiptTimeline();
    mapTimeline();
    pitfallsTimeline();

    cardsSetup();
}

init();

