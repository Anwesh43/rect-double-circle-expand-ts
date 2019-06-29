const w : number = window.innerWidth
const h : number = window.innerHeight
const scGap : number = 0.05
const scDiv : number = 0.51
const strokeFactor : number = 90
const sizeFactor : number = 2.9
const nodes : number = 5
const lines : number = 2
const foreColor : string = "green"
const backColor : string = "#BDBDBD"
const rFactor : number = 4

class ScaleUtil {

    static maxScale(scale : number, i : number, n : number) : number {
        return Math.max(0, scale - i / n)
    }

    static divideScale(scale : number, i : number, n : number) : number  {
        return Math.min(1 / n, ScaleUtil.maxScale(scale, i, n)) * n
    }

    static scaleFactor(scale : number) : number {
        return Math.max(scale / scDiv)
    }

    static mirrorValue(scale : number, a : number, b : number) : number {
        const k : number = ScaleUtil.scaleFactor(scale)
        return (1 - k) / a + k / b
    }

    static updateValue(scale : number, dir : number, a : number, b : number) : number {
        return ScaleUtil.mirrorValue(scale, a, b) * dir * scGap
    }
}

class DrawingUtil {

    static drawCircle(context : CanvasRenderingContext2D, x : number, y : number, r : number) {
        context.beginPath()
        context.arc(x, y, r, 0, 2 * Math.PI)
        context.stroke()
    }

    static drawLine(context : CanvasRenderingContext2D, x1 : number, y1 : number, x2 : number, y2 : number) {
        context.beginPath()
        context.moveTo(x1, y1)
        context.lineTo(x2, y2)
        context.stroke()
    }

    static drawRectCircleExpand(context : CanvasRenderingContext2D, i : number, sc : number, size : number) {
        const r : number = size / rFactor
        const sf : number = 1 - 2 * i
        const x : number = size * sf * ScaleUtil.divideScale(sc, i, lines)
        context.save()
        DrawingUtil.drawCircle(context, x, 0, r)
        for (var j = 0; j < 2; j++) {
            context.save()
            context.translate(0, -r + 2 * r * i)
            DrawingUtil.drawLine(context, 0, 0, x, 0)
            context.restore()
        }
        context.restore()
    }

    static drawRCENode(context : CanvasRenderingContext2D, i : number, scale : number) {
        const gap : number = h / (nodes + 1)
        const size : number = gap / sizeFactor
        const sc1 : number = ScaleUtil.divideScale(scale, 0, 2)
        const sc2 : number = ScaleUtil.divideScale(scale, 1, 2)
        context.lineCap = 'round'
        context.lineWidth = Math.min(w, h) / strokeFactor
        context.strokeStyle = foreColor
        context.save()
        context.translate(w / 2, gap * (i + 1))
        context.rotate(Math.PI / 2 * sc2)
        for (var j = 0; j < 2; j++) {
            DrawingUtil.drawRectCircleExpand(context, j, sc1, size)
        }
        context.restore()
    }
}

class RectCircleExpandStage {

    canvas : HTMLCanvasElement = document.createElement('canvas')
    context : CanvasRenderingContext2D

    initCanvas() {
        this.canvas.width = w
        this.canvas.height = h
        this.context = this.canvas.getContext('2d')
        document.body.appendChild(this.canvas)
    }

    render() {
        this.context.fillStyle = backColor
        this.context.fillRect(0, 0, w, h)
    }

    handleTap() {
        this.canvas.onmousedown = () => {

        }
    }

    static initCanvas() {
        const stage = new RectCircleExpandStage()
        stage.initCanvas()
        stage.render()
        stage.handleTap()
    }
}
