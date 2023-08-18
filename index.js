const canvas = document.querySelector('canvas')

const c = canvas.getContext('2d') // context

canvas.width = 1024;
canvas.height = 576;

const gravity = 0.1
class Player {
  constructor() {
    this.speed = 5
    this.image = gamer //Problem
    this.position = {
      x: 100,
      y: 100
    }
    this.width = 66
    this.height = 150
    this.frames = 0
    this.sprite = {
      stand:{
        right: gamer,
        cropWidth: 177,
        width:66
      },
      run:{
        right: runRight,
        cropWidth: 340,
        width:127.875
      },
      runLeft:{
        left: runLeft,
        cropWidth: 340,
        width:127.875
      }
    }
    this.currentSprite= this.sprite.stand.right
    this.currentCropWidth = 177
    this.velocity = {
      x: 0,
      y: 0 // in canvas the 0 is at the top so as we add positive numbers so the player will fall down
    }
  }
  //drawing the player
  draw() {
    c.drawImage(this.currentSprite,
                this.currentCropWidth* this.frames,
                0,
                this.currentCropWidth,
                400,
                this.position.x, this.position.y,this.width,this.height)
  } 

  update() {
    this.frames++
    if(this.frames > 59 && this.currentSprite=== this.sprite.stand.right){
      this.frames = 0
    }else if(this.frames > 27 && this.currentSprite=== this.sprite.run.right){
      this.frames = 0
    }else if(this.frames > 27 && this.currentSprite=== this.sprite.runLeft.left){
      this.frames = 0
    }
    this.draw()
    this.position.x += this.velocity.x
    this.position.y += this.velocity.y

    if (this.position.y + this.height + this.velocity.y <= canvas.height) {
      this.velocity.y += gravity
    } 
  }
}

class Platform {
  constructor({ x, y, image }) {
    this.position = {
      x: x,
      y: y
    }
    this.image = image
    this.width = image.width
    this.height = image.height
    
  }

  draw() {
    c.drawImage(this.image, this.position.x, this.position.y)
  }
}

class GenericObj {
  constructor({ x, y, image }) {
    this.position = {
      x: x,
      y: y
    }
    this.image = image
    this.width = image.width
    this.height = image.height
    
  }

  draw() {
    c.drawImage(this.image, this.position.x, this.position.y)
  }
}
let gamer= new Image()
gamer.src='sprite/spriteStandRight.png'

let runRight= new Image()
runRight.src='sprite/spriteRunRight.png' 

let runLeft= new Image()
runLeft.src='sprite/spriteRunLeft.png' 


let image = new Image()
image.src = 'sprite/platform.png'

let backGroung = new Image()
backGroung.src = 'sprite/background.png'

let hills = new Image()
hills.src = 'sprite/hills.png'

let smallplat = new Image()
smallplat.src= 'sprite/platformSmallTall.png'

let genericObj = []

let player = new Player()
let platforms = []
// restarting the game by calling the initial values
function init(){
  gamer= new Image()
  gamer.src='sprite/spriteStandRight.png'

  runRight= new Image()
  runRight.src='sprite/spriteRunRight.png'

   runLeft= new Image()
  runLeft.src='sprite/spriteRunLeft.png' 
  
 image = new Image()
image.src = 'sprite/platform.png'

 backGroung = new Image()
backGroung.src = 'sprite/background.png'

 hills = new Image()
hills.src = 'sprite/hills.png'

smallplat = new Image()
smallplat.src= 'sprite/platformSmallTall.png'

 genericObj = [new GenericObj({x:-1, y:-1, image:backGroung}),new GenericObj({x:0, y:0, image:hills})]

 player = new Player({image:gamer})
 platforms = [new Platform({ x: image.width*7+450, y: 200, image: smallplat }),new Platform({ x: 0, y: 460, image: image}), new Platform({ x: image.width-2, y: 460, image: image }),
  new Platform({ x: image.width*2+100, y: 460, image: image }),new Platform({ x: image.width*3+300, y: 460, image: image }),new Platform({ x: image.width*4+500, y: 460, image: image }),new Platform({ x: image.width*5+400, y: 460, image: image }),new Platform({ x: image.width*6+200, y: 460, image: image }),new Platform({ x: image.width*7+1100, y: 460, image: image }),new Platform({ x: image.width*8+1100, y: 460, image: image })]
   // Create a base platform where new platforms will appear after
  const basePlatform = new Platform({ x: image.width * 8 + 1100, y: 460, image: image });
  platforms.push(basePlatform);

  // Generate random standTallPlatforms after the base platform
  const maxPlatforms = 14; // You can adjust the number of random platforms
  let previousX = basePlatform.position.x;
  for (let i = 0; i < maxPlatforms; i++) {
    const randomX = previousX + basePlatform.width + Math.random() * 300; // Adjust the spacing between platforms
    const randomY = Math.random() * (canvas.height - smallplat.height);

    // Make sure the platform stays within canvas height
    const yPosition = Math.min(randomY, canvas.height - smallplat.height);

    platforms.push(new Platform({ x: randomX, y: yPosition, image: smallplat }));
    previousX = randomX;
  }
  console.log(player.position.x)
}
const keys = {
  right: {
    pressed: false
  },
  left: {
    pressed: false
  }
}

let scrollOffset = 0


function animate() {
  requestAnimationFrame(animate)
  c.fillStyle='white'
  c.fillRect(0, 0, canvas.width, canvas.height)//clearing the entaire canvas to get a fluid animation
  genericObj.forEach(genericObj =>{
    genericObj.draw()
  })
  platforms.forEach(platform => {
    platform.draw()
  })
  player.update()
  if (keys.right.pressed && player.position.x < 400) {
    player.velocity.x = player.speed
  } else if ((keys.left.pressed && player.position.x > 100)|| keys.left.pressed && scrollOffset ===0 && player.position.x > 0) {
    player.velocity.x = -player.speed
  }
  else {
    player.velocity.x = 0

    if (keys.right.pressed) {
      scrollOffset +=player.speed
      platforms.forEach(platform => {
        platform.position.x -= player.speed
      })
        genericObj.forEach(genericObj =>{
          genericObj.position.x -= player.speed* .66
        })
    } else if (keys.left.pressed && scrollOffset > 0) {
      scrollOffset -=player.speed
      platforms.forEach(platform => {
        platform.position.x += player.speed
      })
      genericObj.forEach(genericObj =>{
        genericObj.position.x += player.speed* .66
      })
    }
  }
  

  //platform collison detection
  platforms.forEach(platform => {
    if (player.position.y + player.height <= platform.position.y && player.position.y + player.height + player.velocity.y >= platform.position.y && player.position.x + player.width >= platform.position.x && player.position.x <= platform.position.x + platform.width) {
      player.velocity.y = 0
    }
  })
//win condition
  if(scrollOffset > 11643) {
    //alert("You win");

    console.log("You win")
  }
  //lose condition
  if(player.position.y > canvas.height){
    init()
  }
}
init()
animate()

window.addEventListener('keydown', ({ keyCode }) => {
  switch (keyCode) {
    case 65://a
      console.log("this is left")
      keys.left.pressed = true
      player.currentSprite = player.sprite.runLeft.left
      player.currentCropWidth = player.sprite.runLeft.cropWidth
      player.width = player.sprite.runLeft.width
      break
    case 83://s
      console.log("this is dows")
      break
    case 68://d
      console.log("this is right")
      keys.right.pressed = true
      player.currentSprite = player.sprite.run.right
      player.currentCropWidth = player.sprite.run.cropWidth
      player.width = player.sprite.run.width
      break
    case 87://w
      console.log("this is up")
      break
  }
})

window.addEventListener('keyup', ({ keyCode }) => {
  switch (keyCode) {
    case 65://a
      console.log("this is left")
      keys.left.pressed = false
      player.currentSprite = player.sprite.stand.right
      player.currentCropWidth = player.sprite.stand.cropWidth
      player.width = player.sprite.stand.width
      break
    case 83://s
      console.log("this is dows")
      break
    case 68://d
      console.log("this is right")
      keys.right.pressed = false
      player.currentSprite = player.sprite.stand.right
      player.currentCropWidth = player.sprite.stand.cropWidth
      player.width = player.sprite.stand.width
      break
    case 87://w
      console.log("this is up")
      player.velocity.y -= 5
      break
  }
})