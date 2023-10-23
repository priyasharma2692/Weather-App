const APIkey="22796fb1208f0dc93dd9d77da80d88f2";

const userTab=document.querySelector("[data-userWeather]");
const searchTab = document.querySelector("[data-searchWeather]");


const userContainer=document.querySelector("weather-container");
const grantAccessContainer=document.querySelector(".grant-location-container");
const searchForm=document.querySelector("[data-searchForm]");

const loadingScreen=document.querySelector(".loading-container");

const userInfoContainer=document.querySelector(".user-info-container");
const errormessage=document.querySelector("#errormsg")
let currentTab=userTab;
currentTab.classList.add("current-tab");
getfromSessionStorage();

function switchTab(clickedTab)
{
    if(clickedTab !=currentTab){
        currentTab.classList.remove("current-tab");
        currentTab=clickedTab;
        currentTab.classList.add("current-tab");
    

    if(!searchForm.classList.contains("active"))
    {
        userInfoContainer.classList.remove("active"); 
        grantAccessContainer.classList.remove("active");
        searchForm.classList.add("active");
    }
    else{
        searchForm.classList.remove("active");
        userInfoContainer.classList.remove("active");
        getfromSessionStorage();
    }
    }
}

userTab.addEventListener("click", () =>{
    //pass clicked tab as input parameter
    switchTab(userTab);
});

searchTab.addEventListener('click',()=>{
    //pass clicked tab as input parameter
    switchTab(searchTab);
});

//check if coordinates are already present in session storgae
function getfromSessionStorage(){
                const localCoordinates=sessionStorage.getItem("user-Coordinates");
                if(!localCoordinates)
                {
                    //if local coordinates are not present
                    grantAccessContainer.classList.add("active");
                }
                else{
                    const coordinates=JSON.parse(localCoordinates);
                    fetchUserWeatherInfo(coordinates);
                }
}
let errorbox=document.querySelector("[data-error]");

 async function fetchUserWeatherInfo(coordinates)
{
     const{ lat ,lon}=coordinates;
     //make grantcontainer invisible
     grantAccessContainer.classList.remove("active");
     //make loader visible
     loadingScreen.classList.add("active");

     //API call

     try{
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${APIkey}&units=metric`
          );
         const data= await response.json();

         loadingScreen.classList.remove("active");
         userInfoContainer.classList.add("active");

         renderWeatherInfo(data);
     }
     catch(err){
        loadingScreen.classList.remove("active");
        //homework
     }
}


function renderWeatherInfo(weatherinfo){
    //fisrtly fetch all elements

    const cityname=document.querySelector("[data-cityName]");
    const countryicon=document.querySelector("[ data-countryIcon]");
    const desc=document.querySelector("[data-weatherDesc]");
    const weatherIcon=document.querySelector("[data-weatherIcon]");
    const temp=document.querySelector("[data-temperature]");
    const windspeed=document.querySelector("[data-windspeed]");
    const humidity=document.querySelector("[ data-humidity]");
    const cloudiness=document.querySelector("[data-cloudiness]");

    //using optional chaining  operator
    //fetch values from weatherinfo object and show them in UI elements
        cityname.innerText= weatherinfo?.name;
        countryicon.src=`https://flagcdn.com/144x108/${weatherinfo?.sys?.country.toLowerCase()}.png`;
        desc.innerText=weatherinfo?.weather?.[0]?.description;
        weatherIcon.src=`http://openweathermap.org/img/w/${weatherinfo?.weather?.[0]?.icon}.png`;
        temp.innerText=`${weatherinfo?.main?.temp} °C`;
        windspeed.innerText=`${weatherinfo?.wind?.speed} m/s`;
        humidity.innerText=`${weatherinfo?.main?.humidity} %`;
        cloudiness.innerText=`${weatherinfo?.clouds?.all} %`;

    
 }





function getLocation()
{
    if(navigator.geolocation){
           navigator.geolocation.getCurrentPosition(showPosition);
    }
    else{
             //show an alert for no geolocation support available
             alert("Geolocation Not Supported");
    }
}


function showPosition(position)
{
    const userCoordinates={
        lat:position.coords.latitude,
        lon :position.coords.longitude,
    }

    sessionStorage.setItem("user-coordinates", JSON.stringify(userCoordinates));
    fetchUserWeatherInfo(userCoordinates);
}



const grantAccessButton=document.querySelector("[data-grantAccess]");
grantAccessButton.addEventListener('click', getLocation);


let searchInput=document.querySelector("[data-searchInput]");
searchForm.addEventListener("submit", (e)=>{
       e.preventDefault();
       let cityName = searchInput.value;
       if(cityName=="")
       return;
       else
       fetchSearchWeatherInfo(cityName);
});


async function fetchSearchWeatherInfo(city)
{         
          errorbox.classList.remove("active");
          loadingScreen.classList.add("active");
           userInfoContainer.classList.remove("active");
           grantAccessContainer.classList.remove("active");


           try{
                   const response= await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${APIkey}&units=metric`);
                   const data= await response.json();

                   loadingScreen.classList.remove("active");
                    userInfoContainer.classList.add("active");
 
                    renderWeatherInfo(data);
                 if(response.status==404)
                 {
                    loadingScreen.classList.remove("active");
                    userInfoContainer.classList.remove("active");
                    errorbox.classList.add("active");
                 }
                 else{
                    
                    loadingScreen.classList.remove("active");
                    userInfoContainer.classList.add("active");
 
                    renderWeatherInfo(data);
                 }
                  
           }
           
            catch (err) {
               
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.remove("active");
        errorbox.classList.add("active");
               
            }
           
}




