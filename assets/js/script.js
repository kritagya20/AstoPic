//API KEY AND URL
const url = "https://api.nasa.gov/planetary/apod?";
const apiKey = "api_key=oZE6pQiVQIdUnGScbcRkpcIkbi1luROq42MtbL3F";
const defaultQuery = url + apiKey ;

//ELEMENTS FOR MANIPULATING THE DOM
const searchBtn =  document.querySelector('#search-form');
const errorCard = document.querySelector('#error-dialog');
const retryBtn = document.querySelector('#retry');
const container = document.querySelector('#api-data');
const loadingSpinner = document.getElementById('spinner'); //LOADING SPINNER
let apiNotFound = false;
console.log(errorCard)



//PRELOADER
window.addEventListener('load', () => {
    document.querySelector('#preloader').style.display = 'none';
})

//SEARCH USING USER REQUEST
searchBtn.addEventListener('submit', (event) => {
    event.preventDefault(); //TO AVOID THE DEFAULT ACTION ASSOSIATED WITH SUBMIT EVENT IN JS
    SearchWithDate();
    container.style.display = "none";
});

//GETTING DATA FROM HTML
const SearchWithDate = ()=>{
    const dd =  String(document.querySelector('#date').value).padStart(2, '0'); //getting the date entered by the user and ensuring that it always has 2 digits
    const mm =  String(document.querySelector('#month').value).padStart(2, '0'); //getting the date entered by the user and ensuring that it always has 2 digits
    const yyyy =  document.querySelector('#year').value; //selecting the parent of  description container to append data in it
    let date = yyyy + '-' + mm + '-' + dd;
    let dateUrl = "&date=" + date;
    let dateQuery = url + apiKey + dateUrl;
    fetchData(dateQuery);
};

//CLEARING DATA
const clearData = () => {
    document.querySelector('#date').value = '';
    document.querySelector('#month').value = '';
    document.querySelector('#year').value = '';
}

//FETCHING DATA FROM API
const fetchData = async(query) => {
    try{
        loadingSpinner.style.display = "flex";
        let response = await fetch(query); //FETCHING  DATA
        let fetchedData = await response.json(); //CONVERTING  DATA
        loadingSpinner.style.display = "none";
        apiNotFound = false;
        renderData(fetchedData, apiNotFound);
    } catch(error){
        apiNotFound = true;
        renderData(fetchData, apiNotFound);
        loadingSpinner.style.display = "none";
        console.log(error);
    }
}

//DEFAULT API CALL
fetchData(defaultQuery);

//DISPLAYING THE FETCHED DATA IN DOM
const renderData = (data, apiNotFound) => {
    if(!apiNotFound){
        let copyright = data["copyright"];
        let explanation = data["explanation"];
        let hdurl = data["hdurl"];
        let media_type = data["media_type"];
        let title = data["title"];
        let url = data["url"];

        let imageType = ` 
            <a id="hd-image-url" href="" target="_blank">              
                <img class="image" id="image" src="#">
            </a>
        `;
        let videoType = `
            <div class="ratio ratio-16x9">
                <iframe
                class="shadow-1-strong rounded"
                id="video"
                src=""
                title="YouTube video"
                allowfullscreen
                ></iframe>
            </div>
        `;

        // Static elements
        document.getElementById("title").innerHTML = title;
        document.getElementById("description").innerHTML = explanation;

        // If statement for images/videos
        if (media_type === "video") {
            document.getElementById("media").innerHTML = videoType;
            document.getElementById("video").src = url;
        } else {
            document.getElementById("media").innerHTML = imageType;
            document.getElementById("image").src = url;
            document.getElementById("hd-image-url").href = hdurl;
        }

        //IF statements for copywrite
        if (copyright === undefined){
            document.getElementById("copyright").classList.add('nd');
        } else {
            document.getElementById("copyright").innerHTML = copyright;
        }  

        //CLEAR FORM DATA
        clearData();
    }else{        
        errorCard.showModal();
    }
    
    container.style.display = "flex";
}

//RETRY ON CLICK
retryBtn.addEventListener('click', () => {
    errorCard.close();
    fetchData(defaultQuery);
});


// CANVAS CODE FOR PARTICLE ANIMATION
const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d'); // it returns an object containing bunch of properties related to canvas
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
let particlesArray;

//get mouse position 
let mouse = {
    x: null,
    y: null,
    radius: (canvas.height/80) * (canvas.width/80)
}

window.addEventListener('mousemove',
    function(event) {
        mouse.x = event.x;
        mouse.y = event.y;
    }
);

// create particles
class Particle {
    constructor( x, y, directionX, directionY, size, color) {
       this.x = x;
       this.y = y;
       this.directionX = directionX;
       this.directionY = directionY;
       this.size = size;
       this.color = color; 
    }

    //method to draw individual particles
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
        ctx.fillStyle = 'rgba(255, 204, 18, .8)';
        ctx.fill();
    }

    //check particle position, check mouse position, move the partiles, draw tha particles
    update(){
        //check if particles is still within canvas
        if(this.x > canvas.width || this.x < 0 ) {
            this.directionX = -this.directionX;

        }
        if( this.y > canvas.height || this.y < 0 ) {
            this.directionY = -this.directionY;
        }

        //check collision detection - mouse position / particle position
        let dx = mouse.x - this.x;
        let dy = mouse.x - this.y;
        let distance = Math.sqrt(dx*dx + dy*dy);
        //pushing away the colliding particles
        if (distance < mouse.radius + this.size) {
            //pushing away the colliding particles
            if(mouse.x < this.x && this.y < canvas.width - this.size * 10) {
                this.x += 10;
            }
            if (mouse.x > this.x && this.x > this.size * 10) {
                this.x -=10;
            }
            if (mouse.y < this.y && this.y < canvas.height - this.size * 10) {
                this.y +=10;
            }
            if (mouse.y > this.y && this.y > canvas.height - this.size * 10) {
                this.y -=10;
            }
        }
        //moving non colliding particles
        this.x += this.directionX;
        this.y += this.directionY;

        //draw particles
        this.draw();
    }
}

//create particle array
function init() {
    particlesArray = [];
    let numberOfParticles = (canvas.height * canvas.width) / 9000;
    for (let i=0; i<numberOfParticles*1; i++) {
        let size = (Math.random()*3) +1;
        let x = (Math.random() * ((innerWidth - size * 2) - (size * 2)) + size * 2);
        let y = (Math.random() * ((innerHeight - size * 2) - (size * 2)) + size * 2);
        let directionX = (Math.random() * 3) - 1.5;
        let directionY = (Math.random() * 3) - 1.5;
        let color = 'rgba(255, 204, 18, .8)';
    
        particlesArray.push(new Particle(x, y, directionX, directionY, size, color))
    }
}

//animation loop 
function animate(){
    requestAnimationFrame(animate);
    ctx.clearRect(0,0,innerWidth,innerHeight);

    for (let i=0; i<particlesArray.length; i++) {
        particlesArray[i].update();
    }
    connect();
}

// check if particles are close enough to draw line between them
function connect() {
    let opacityValue =1;
    for( let a=0; a<particlesArray.length; a++) {
        for ( let b=a; b<particlesArray.length; b++) {
            let distance = ((particlesArray[a].x - particlesArray[b].x) * (particlesArray[a].x - particlesArray[b].x))
            + ((particlesArray[a].y - particlesArray[b].y) * (particlesArray[a].y - particlesArray[b].y));
            
            if (distance < (canvas.width/7) * (canvas.height/7)) {
                opacityValue = 1 - (distance/20000);
                ctx.strokeStyle= 'rgba(255, 218, 82,'+ opacityValue + ')';
                ctx.strokeStyle = 'rgba(255, 218, 82, .75)';
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                ctx.stroke();
            
            }
        
        }
    }
}

// resize event 
window.addEventListener('resize', 
function() {
    canvas.width = innerWidth;
    canvas.height = innerHeight;
    mouse.radius = ((canvas.height/80) * (canvas.height/80));
});

//mouse out event 
window.addEventListener('mouseout', 
function() {
    mouse.x = undefined;
    mouse.y = undefined;
});

init();
animate();



