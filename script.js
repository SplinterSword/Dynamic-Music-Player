console.log("Lets write javascript")

let currentSong = new Audio();
let songs;

async function getSongs(){
    let a = await fetch("http://127.0.0.1:5500/songs/");
    let response = await a.text();
    let div = document.createElement("div");
    div.innerHTML = response;
    let as = div.getElementsByTagName("a");
    let songs = [];
    for(let i = 0; i<as.length; i++){
        const element = as[i];
        if(element.href.endsWith(".mp3")){
            songs.push(element.href.split("/songs/")[1]);
        }
    }
    return songs
}

const playMusic = (track,artist)=>{
    currentSong.src  = "/songs/" + track + "-" + artist + ".mp3";
    currentSong.play();
    play.src = "pause.svg"
    document.querySelector(".songinfo").innerHTML = track + "-" + artist;
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00";
}

async function main(){
    // Get the list of all the songs
    songs = await getSongs();
    currentSong.src = "/songs/" + "Dreamer" + "-" + "Roa" + ".mp3";
    document.querySelector(".songinfo").innerHTML = "Dreamer" + "-" + "Roa";
    document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(currentSong.currentTime)}/03:15`;

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

    //Show All the Songs in the playlist
    let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0];
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

    //Attack an event listner to each song
    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e=>{
        e.addEventListener("click",element=>{
            playMusic(e.querySelector(".info").childNodes[1].innerHTML.trim(),e.querySelector(".info").childNodes[3].innerHTML.trim());
        })
    });

    // Attach an even listener to play, next and previous

    //Play
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
        let index = songs.indexOf(currentSong.src.split("/songs/")[1].replaceAll(" ","%20"));
        if((index-1) >= 0){
            let track = songs[index-1].replaceAll("%20"," ").split("-")[0];
            let artist = songs[index-1].replaceAll("%20"," ").split("-")[1];
            playMusic(track,artist.replace(".mp3",""));
        }
    })
    next.addEventListener("click",()=>{
        let index = songs.indexOf(currentSong.src.split("/songs/")[1].replaceAll(" ","%20"));
        if((index+1) < songs.length){
            let track = songs[index+1].replaceAll("%20"," ").split("-")[0];
            let artist = songs[index+1].replaceAll("%20"," ").split("-")[1];
            playMusic(track,artist.replace(".mp3",""));
        }
    })
};


main();