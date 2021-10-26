/*
$(document).ready( function() {

    // When site loaded, hide Modal frist.
    hideModal();

    //$('#popupBoxClose').click( function() {            
    //    unloadPopupBox();
    //});

    //$('#container').click( function() {
    //    unloadPopupBox();
    //});

    function hideModal() {    
        $('.modal').hide();
    }    

    function hideModal() {    
        $('.modal').show();
    }    


    function loadPopupBox() {    // To Load the Popupbox

        var counter = 10;
        var id;
        $('#popup_box').fadeIn("slow");
        $("#container").css({ // this is just for style
            "opacity": "0.3"  
        });

        id = setInterval(function() {
            counter--;
            if(counter < 0) {
                clearInterval(id);

                unloadPopupBox();
            } else {
                $("#countDown").text("it closed  after " + counter.toString() + " seconds.");
            }
        }, 1000);

    }        
});
*/




var counter = 60;

setInterval( function(){
    counter--;

    if( counter >= 0){
        id = document.getElementById("count");
        id.innerHTML = counter; //id.innerHTML 意思是：該id在HTML當中的「內容物」
    }
    if( counter === 0){
        console.log("時間到")
        $('.modal').show();
    }

},1000);
//控制時間倒數



    




const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
const CANVAS_WIDTH = canvas.width = 1920;
const CANVAS_HEIGHT = canvas.height = 1080;
let gameSpeed = 10;
//控制整個大遊戲的速度

const backgroundLayer1 = new Image();
backgroundLayer1.src = 'img/sky.jpg';
const backgroundLayer2 = new Image();
backgroundLayer2.src = 'img/house2.png';
const backgroundLayer3 = new Image();
backgroundLayer3.src = 'img/ground.png';

console.log(backgroundLayer1.src)

class Layer {
    constructor(image, speedModifier){
        this.x = 0;
        this.y = 0;
        this.width =3840; //範例中所有圖片都符合寬2400;之後自己實作需要自行制定高度。
        this.height = 1080;
        this.x2 = this.width;
        this.image = image;
        this.speedModifier = speedModifier;
        this.speed = gameSpeed * this.speedModifier;
    }
    update(){
        this.speed = gameSpeed * this.speedModifier;
        if(this.x <= -this.width){
            this.x = this.width + this.x2 - this.speed;
        }
        if(this.x2 <= -this.width){
            this.x2 = this.width + this.x - this.speed;
        }
        this.x = Math.floor(this.x - this.speed);
        this.x2 = Math.floor(this.x2 - this.speed);
    }
    draw(){
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
        ctx.drawImage(this.image, this.x2, this.y, this.width, this.height);
    }
}

const layer1 = new Layer(backgroundLayer1, 0.2);//sky
const layer2 = new Layer(backgroundLayer2, 0.3);
const layer3 = new Layer(backgroundLayer3, 0.5);
//控制不同背景層的個別速度

function animate(){
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    layer1.update();
    layer1.draw();
    layer2.update();
    layer2.draw();
    layer3.update();
    layer3.draw();
    requestAnimationFrame(animate);
};
animate() //執行

$(document).ready(function(){

    setTimeout(function(){
         $('.modal').show()
    },50000);
    
});



$('.time').hide();