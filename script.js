console.log("Lets write javascript")

let currentSong = new Audio();
let songs;
let currfolder;

//seconds to minutes
function secondsToMinutesSeconds(seconds) {
    // Base Case
    if (isNaN(seconds) || seconds < 0){
        return "00:00";
    }

    // Calculate the minutes and remaining seconds
    let minutes = Math.floor(seconds / 60);
    let remainingSeconds = Math.floor(seconds % 60);

    // Add leading zeros if necessary
    let minutesString = minutes < 10 ? '0' + minutes : minutes;
    let secondsString = remainingSeconds < 10 ? '0' + remainingSeconds : remainingSeconds;

    // Combine minutes and seconds with a colon
    let formattedTime = minutesString + ':' + secondsString;

    return formattedTime;
}

async function getSongs(folder){
    currfolder = folder
    let a = await fetch(`http://127.0.0.1:5500/${folder}/` );
    let response = await a.text();
    let div = document.createElement("div");
    div.innerHTML = response;
    let as = div.getElementsByTagName("a");
    songs = [];
    for(let i = 0; i<as.length; i++){
        const element = as[i];
        if(element.href.endsWith(".mp3")){
            songs.push(element.href.split(`/${folder}/`)[1]);
        }
    }

    //Show All the Songs in the playlist
    let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0];
    songUL.innerHTML = "";
    for (const song of songs) {
        let remove = song.replaceAll("%20%E2%80%93%20"," ");
        let result = remove.replace(".mp3"," ");
        result = result.split("-")
        songUL.innerHTML = songUL.innerHTML + `<li><img class="invert" src="music.svg" alt="music">
                    <div class="info">
                        <div>${result[0].replaceAll("%20"," ")}</div>
                        <div>${result[1].replaceAll("%20"," ")}</div>
                    </div>
                    <div class="playnow">
                        <img class="invert" src="play_mediaplayer.svg">
                    </div>
                    </li>`;
    }

    // Attack an event listner to each song
    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e=>{
        e.addEventListener("click",element=>{
            playMusic(e.querySelector(".info").childNodes[1].innerHTML.trim(),e.querySelector(".info").childNodes[3].innerHTML.trim());
        })
    });

    // Play the first song
    let now_song = songs[0];
    let remove = now_song.replaceAll("%20%E2%80%93%20"," ");
    let result = remove.replace(".mp3","");
    result = result.split("-")
    playMusic(result[0].replaceAll("%20"," "),result[1].replaceAll("%20"," "));
}

const playMusic = (track,artist)=>{
    currentSong.src  = `/${currfolder}/` + track + "-" + artist + ".mp3";
    currentSong.play();
    play.src = "pause.svg"
    document.querySelector(".songinfo").innerHTML = track + "-" + artist;
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00";
}

async function displayAlbums(){
    let a = await fetch(`http://127.0.0.1:5500/songs/` );
    let response = await a.text();
    let div = document.createElement("div");
    div.innerHTML = response;
    let anchors = div.getElementsByTagName("a");
    let cardContainer = document.querySelector(".cardContainer");
    for(let i = 0; i<anchors.length; i++){
        const element = anchors[i];
        if(element.href.includes("/songs/")){
            let folder = (element.href.split("/songs/")[1]);

            // Get the metadata of the folder
            let a = await fetch(`http://127.0.0.1:5500/songs/${folder}/info.json`);
            let curr_response = await a.json();
            cardContainer.innerHTML = cardContainer.innerHTML + `<div data-folder="${folder}" class="card">
                                                                    <div class="play">
                                                                    <img src="play_button.svg">
                                                                    </div>
                                                                    <img src="/songs/${folder}/cover.jpg">
                                                                    <h2>${curr_response.title}</h2>
                                                                    <p>${curr_response.description}</p>
                                                                </div>`
        }
    }

    //Load the playlist whenever card is clicked
    Array.from(document.getElementsByClassName("card")).forEach(e=>{
        e.addEventListener("click" , async item=>{
            await getSongs(`songs/${item.currentTarget.dataset.folder}`);
        })
    })
}

async function main(){
    // Get the list of all the songs
    await getSongs("songs/NCS");
    currentSong.src = `/${currfolder}/` + "Dreamer" + "-" + "Roa" + ".mp3";
    document.querySelector(".songinfo").innerHTML = "Dreamer" + "-" + "Roa";
    document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(currentSong.currentTime)}/03:15`;

    // Display all the albums on the page
    displayAlbums()

    // Attach an even listener to play
    let play = document.getElementById("play");
    play.addEventListener("click", ()=>{
        if(currentSong.paused){
            currentSong.play();
            play.src = "pause.svg"
        }
        else{
            currentSong.pause()
            play.src = "play_mediaplayer.svg"
        }
    });

    // Listen for timeupdate event
    currentSong.addEventListener("timeupdate",()=>{
        document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(currentSong.currentTime)}/${secondsToMinutesSeconds(currentSong.duration)}`;
        document.querySelector(".circle").style.left = (currentSong.currentTime/currentSong.duration)*100 + "%";
    });

    // Add an event listener to seek bar
    document.querySelector(".seekbar").addEventListener("click",e=>{
        let percent = (e.offsetX/e.target.getBoundingClientRect().width)*100;
        document.querySelector(".circle").style.left = percent + "%";
        currentSong.currentTime = currentSong.duration * (percent/100);
    })

    // Add an event listener for hamburger
    document.querySelector(".hamburger").addEventListener("click",()=>{
        document.querySelector(".left").style.left = 0;
    })
    document.querySelector(".close").addEventListener("click",()=>{
        document.querySelector(".left").style.left = -120 + "%";
    })

    // Add an event listener to previous and next
    previous.addEventListener("click",()=>{
        let index = songs.indexOf(currentSong.src.split(`/${currfolder}/`)[1].replaceAll(" ","%20"));
        if((index-1) >= 0){
            let track = songs[index-1].replaceAll("%20"," ").split("-")[0];
            let artist = songs[index-1].replaceAll("%20"," ").split("-")[1];
            playMusic(track,artist.replace(".mp3",""));
        }
    })
    next.addEventListener("click",()=>{
        let index = songs.indexOf(currentSong.src.split(`/${currfolder}/`)[1].replaceAll(" ","%20"));
        if((index+1) < songs.length){
            let track = songs[index+1].replaceAll("%20"," ").split("-")[0];
            let artist = songs[index+1].replaceAll("%20"," ").split("-")[1];
            playMusic(track,artist.replace(".mp3",""));
        }
    })

    // Add an event to volume
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change",e=>{
        currentSong.volume = parseInt(e.target.value)/100;
    })

    // Add event listener to the volume
    document.querySelector(".volume").getElementsByTagName("img")[0].addEventListener("click",e=>{
        if (e.target.src.includes("volume.svg")){
            e.target.src = e.target.src.replace("volume.svg","mute.svg");
            currentSong.volume = 0;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 0;
        }
        else{
            e.target.src = e.target.src.replace("mute.svg","volume.svg");
            currentSong.volume = 1;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 100;
        }
    })
};

main();