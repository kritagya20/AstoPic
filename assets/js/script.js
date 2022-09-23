//API KEY AND URL
const url = "https://api.nasa.gov/planetary/apod?";
const apiKey = "api_key=oZE6pQiVQIdUnGScbcRkpcIkbi1luROq42MtbL3F";
const defaultQuery = url + apiKey ;

//ELEMENTS FOR MANIPULATING THE DOM
const searchBtn =  document.querySelector('#search-form');
const errorCard = document.querySelector('#error-card');
const main = document.querySelector('main');
const container = document.querySelector('#api-data');
const loadingSpinner = document.getElementById('spinner'); //LOADING SPINNER
let apiNotFound = false;


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

//FETCHING DATA FROM API
const fetchData = async(query) => {
    try{
        loadingSpinner.style.display = "flex";
        let response = await fetch(query); //FETCHING SYNONYMS DATA
        let fetchedData = await response.json(); //CONVERTING SYNONYMS DATA
        loadingSpinner.style.display = "none";
        apiNotFound = false;
        renderData(fetchedData, apiNotFound);
    } catch(error){
        apiNotFound = true;
        renderData(fetchData, apiNotFound)
        console.log(error);
    }
}

//DEFAULT API CALL
fetchData(defaultQuery);

//DISPLAYING THE FETCHED DATA IN DOM
const renderData = (data, apiNotFound) => {
    if(apiNotFound === false){
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
    }else{        
        errorCard.classList.add('error-display');
        main.classList.add('error-bg');
    }
    
    container.style.display = "flex";
}


