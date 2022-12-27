const linesColor = 'rgba(190, 255, 250, 0.5)'

let amtInit = 80;
let sizeInit = 2;
let params = {
    Amt: amtInit,
    thresDist: 350,
    maxLineWidth: 8,
    direction: { x: 0.1, y: 0.1 },
    speed: 1,
    Maxsize: sizeInit,
    bounce: true,
}

var EPSILON = Number.EPSILON;

function randomRange(min, max) {
    if (max === undefined) {
        max = min;
        min = 0;
    }

    if (typeof min !== 'number' || typeof max !== 'number') {
        throw new TypeError('Expected all arguments to be numbers');
    }

    return Math.random() * (max - min) + min;
};

function mapRange(value, inputMin, inputMax, outputMin, outputMax, clamp) {

    if (Math.abs(inputMin - inputMax) < EPSILON) {
        return outputMin;
    } else {
        var outVal = ((value - inputMin) / (inputMax - inputMin) * (outputMax - outputMin) + outputMin);
        if (clamp) {
            if (outputMax < outputMin) {
                if (outVal < outputMax) outVal = outputMax;
                else if (outVal > outputMin) outVal = outputMin;
            } else {
                if (outVal > outputMax) outVal = outputMax;
                else if (outVal < outputMin) outVal = outputMin;
            }
        }
        return outVal;
    }
};



class Vector {
    constructor(x, y) {
        this.x = x;
        this.y = y;

    }
    getDistance(v) {
        const dx = this.x - v.x;
        const dy = this.y - v.y;
        return Math.sqrt(dx * dx + dy * dy);
    }

};

class Agent {
    constructor(x, y) {

        this.pos = new Vector(x, y);
        this.vel = new Vector(randomRange(-2, .3), randomRange(-2, .3));

        this.oldRadius = randomRange(20, 2);
        this.radius = this.oldRadius;
    }
    bounce(width, height, coords) {
        if (this.pos.x <= width * -.15 || this.pos.x >= width + width * .15) { this.vel.x *= -1 }
        if (this.pos.y <= height * -.15 || this.pos.y >= height + height * .15) { this.vel.y *= -1 }
        if (this.pos.x <= (coords.X + 185) && this.pos.x >= (coords.X - 185) && this.pos.y <= (coords.Y + 185) && this.pos.y >= (coords.Y - 185)) {
            this.vel.y *= -1
            this.vel.x *= -1
            let m = Math.floor(randomRange(0, 2)) === 0 ? -1 : 1
            this.pos.y = coords.Y + m * 185
            this.pos.x = coords.X + m * 185
        }
    }


    update(dir) {
        let speed = params.speed;

        let dirXPos = 1;
        let dirXNeg = 1;
        let dirYPos = 1;
        let dirYNeg = 1;
        if (dir > 0) { dirXPos = dir };
        if (dir < 0) { dirXNeg = dir };
        if (dir > 0) { dirYPos = dir };
        if (dir < 0) { dirYNeg = dir };
        this.pos.x += speed * this.vel.x * dirXNeg * dirXPos;
        this.pos.y += speed * this.vel.y * dirYPos * dirYNeg;

    }
    resize(p) {
        let newRad = this.oldRadius * p;
        this.radius = newRad;
    }

    draw(context) {
        context.save();
        context.translate(this.pos.x, this.pos.y);

        context.lineWidth = .5;

        context.beginPath();
        context.arc(0, 0, this.radius, 0, Math.PI * 2);

        context.strokeStyle = linesColor;
        //context.fill();
        context.stroke();

        context.restore();

    }
};
class staticAgent {
    constructor(x, y) {

        this.pos = new Vector(x, y);
        this.vel = new Vector(randomRange(-2, .3), randomRange(-2, .3));

        this.oldRadius = randomRange(5, 100);
        this.radius = this.oldRadius;
    }

    update() {
        let speed = params.speed;
        let dirXPos = 1;
        let dirXNeg = 1;
        let dirYPos = 1;
        let dirYNeg = 1;
        if (params.direction.x > 0) { dirXPos = params.direction.x };
        if (params.direction.x < 0) { dirXNeg = params.direction.x };
        if (params.direction.y > 0) { dirYPos = params.direction.y };
        if (params.direction.y < 0) { dirYNeg = params.direction.y };
        this.pos.x += speed * this.vel.x * dirXNeg * dirXPos;
        this.pos.y += speed * this.vel.y * dirYPos * dirYNeg;

    }


    draw(context, coords, alfa) {
        context.save();

        let color1 = `rgba(100, 205, 200, ${alfa + 0.2})`
        let color2 = `rgba(190, 255, 250, ${alfa})`

        context.translate(coords.X, coords.Y);

        context.lineWidth = 3;

        context.beginPath();
        context.arc(0, 0, this.radius, 0, Math.PI * 2);

        //  context.strokeStyle = 'rgba(190, 255, 250, 0.5)';
        context.strokeStyle = color1;

        // context.fillStyle = 'rgba(190, 255, 250, 0.15)';
        context.fillStyle = color2;
        context.fill();
        context.stroke();

        context.restore();
    }
}
export { mapRange, randomRange, EPSILON, Vector, Agent, staticAgent, params, amtInit, sizeInit }