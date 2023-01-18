var song
var fft
var img
var particles = []

function preload() {
  song = loadSound('NCS2.mp3')
  img = loadImage('face.jpg')
}


function setup() {
  createCanvas(windowWidth, windowHeight-10);
  fft = new p5.FFT()
  angleMode(DEGREES)
  imageMode(CENTER)

  img.filter(BLUR, 5)
}

function draw() {
  background(0)
  stroke(224,46,79)
  strokeWeight(20)
  noFill()
  // fill(235,15,84)
  translate(width / 2, height / 2)

  fft.analyze()
  amp = fft.getEnergy(10, 200)

  push()
  if (amp > 230) {
    rotate(random(-0.5, 0.5))
  }

  image(img, 0, 0, width + 1250, height + 850)
  pop()

  var wave = fft.waveform()

  for (var t = -1.5; t <= 1.8; t += 3.1) {
    beginShape()
    for (var i = 0; i <= 100; i += 0.5) {   // i is amplitude and freq of wave
      var index = floor(map(i, 0, 75, 0, wave.length - 1))

      var r = map(wave[index], -1, 1, 150, 350)

      var x = r * sin(i) * t;
      var y = r * cos(i);
      vertex(x, y)
    }
    endShape()


  }
  var p = new Particle()
  particles.push(p)
  for (var i = particles.length - 1; i >= 0; i--) {
    if (!particles[i].edges()) {
      particles[i].update()
      particles[i].show()
    }
    else {
      particles.splice(i, 0)
    }
  }

}

function mouseClicked() {
  if (song.isPlaying()) {
    song.pause()
    noLoop()
  }
  else {
    song.play()
    loop()
  }
}

class Particle {
  constructor() {
    this.pos = p5.Vector.random2D().mult(340)
    this.vel = createVector(0, -0.7)
    this.acc = this.pos.copy().mult(random(0.0001, 0.00001))

    this.w = random(1, 10)
    // this.color = [random(100, 228), random(0,50), random(89, 211),]
  }
  update() {
    this.vel.add(this.acc)
    this.pos.add(this.vel)
  }
  edges() {
    // if (this.pos.x < rotate(-sin(width/ 2),0) || this.pos.x > width / 2 ||
    //   this.pos.y < (-height / 2) || this.pos.y > (height / 2)) {
    if (this.pos.x < translate(sin( -(width / 2))) || this.pos.x > (width / 2) ||
      this.pos.y < (cos(-height / 2)) || this.pos.y > (height / 2)) {
      return true
    }
    else {
      return false
    }
  }
  show() {
    noStroke()
    // fill(this.color)
    fill(235,15,84)
    ellipse(this.pos.x, this.pos.y, this.w)
  }
}