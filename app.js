class Note {
    constructor(note, velocity, acceleration, pathLength) {
        this.note = note
        this.velocity = velocity
        this.acceleration = acceleration
        this.pathLength = pathLength
        this.position = 0
        this.lastPosition = 1
        this.synth = undefined
    }

    play(inst) {
        if (this.synth == undefined) {
            this.synth = new Tone.Synth().toDestination();
        }
        setInterval(() => {
            if ((this.position + this.pathLength) % this.pathLength < (this.lastPosition + this.pathLength) % this.pathLength) {
                this.synth.triggerAttackRelease(this.note, "8n")
            }
            this.lastPosition = this.position
        }, 1)
    }
}

// var notes = [new Note("C3", 0.5, 0, 2), new Note("E3", 0.6, 0, 2), new Note("G3", 0.7, 0, 2), new Note("B3", 0.8, 0, 2), new Note("C4", 0.9, 0, 2), new Note("E4", 1, 0, 2), new Note("G4", 1.1, 0, 2), new Note("B4", 1.2, 0, 2), new Note("C5", 1.3, 0, 2), new Note("E5", 1.4, 0, 2), new Note("G5", 1.5, 0, 2), new Note("B5", 1.6, 0, 2)]
var notes = []
for (index = 0; index < 20; index++) {
    chord = ["C", "E", "G", "B"]
    notes.push(new Note(chord[index%chord.length] + (Math.floor(index/chord.length) + 1), index*0.01 + 0.5, 0, 2))
}

const increment = 20

async function begin(btn) {
    await Tone.start()
    .then(
        () => {
            btn.hidden = true
            //create a synth and connect it to the main output (your speakers)
            for (note of notes) {
                note.play()
            }
            setInterval(animate, increment)
        }
    )
}

const canvas = document.getElementById("canvas")
const ctx = canvas.getContext("2d")

canvas.width = 1024
canvas.height = 1024

var frame = 0

var currentPoint = [canvas.width/2, canvas.height/2, 0]
function animate() {
    ctx.fillStyle = "rgba(0, 0, 0, 1)"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    ctx.strokeStyle = `rgba(255, 255, 255, ${1 - currentPoint[2]/100})`
    ctx.beginPath()
    ctx.arc(currentPoint[0], currentPoint[1], currentPoint[2], 0, 2*Math.PI)
    ctx.closePath()
    ctx.stroke()
    ctx.beginPath()
    ctx.arc(currentPoint[0], currentPoint[1], currentPoint[2]*0.8, 0, 2*Math.PI)
    ctx.closePath()
    ctx.stroke()
    ctx.beginPath()
    ctx.arc(currentPoint[0], currentPoint[1], currentPoint[2]*0.6, 0, 2*Math.PI)
    ctx.closePath()
    ctx.stroke()
    ctx.beginPath()
    ctx.arc(currentPoint[0], currentPoint[1], currentPoint[2]*0.4, 0, 2*Math.PI)
    ctx.closePath()
    ctx.stroke()
    ctx.beginPath()
    ctx.arc(currentPoint[0], currentPoint[1], currentPoint[2]*0.2, 0, 2*Math.PI)
    ctx.closePath()
    ctx.stroke()
    currentPoint[2]++
    if (currentPoint[2] >= 100) {
        currentPoint[2] = 0
        currentPoint[0] = Math.random()*canvas.width
        currentPoint[1] = Math.random()*canvas.height
    }

    for (let i = 0; i < notes.length; i++) {
        ctx.strokeStyle = "white"
        ctx.fillStyle = "white"
        ctx.lineWidth = 1
        // ctx.beginPath()
        // ctx.moveTo(((i/notes.length) + 0.5/notes.length)*canvas.width, canvas.height*0.1)
        // ctx.lineTo(((i/notes.length) + 0.5/notes.length)*canvas.width, canvas.height*0.9)
        // ctx.closePath()
        // ctx.stroke()
        ctx.strokeRect(((i/notes.length) + 0.5/notes.length)*canvas.width - 10, canvas.height*0.1 - 10, 20, canvas.height*0.8 + 20)

        let note = notes[i]
        note.velocity += note.acceleration/(1000/increment)
        note.position = note.position + note.velocity/(1000/increment)
        renderPosition = Math.abs((-(note.position %(note.pathLength*2))+ note.pathLength))
        ctx.fillRect(((i/notes.length) + 0.5/notes.length)*canvas.width - 10, canvas.height*0.1 + (renderPosition)/note.pathLength *canvas.height*0.8 - 10, 20, 20)
    }
    ctx.beginPath()
    for (let i = 0; i < notes.length; i++) {
        let note = notes[i]
        renderPosition = Math.abs((-(note.position %(note.pathLength*2))+ note.pathLength))
        ctx.lineTo(((i/notes.length) + 0.5/notes.length)*canvas.width, canvas.height*0.1 + (renderPosition)/note.pathLength *canvas.height*0.8)
    }
    ctx.strokeStyle = "rgba(255, 255, 255, 0.3)"
    ctx.lineWidth = 4
    ctx.stroke()
}