console.log("Lets write javascript")

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
    let audio = new Audio("/songs/" + track + "-" + artist + ".mp3");
    audio.play();
}

async function main(){

    let currrentSong;

    // Get the list of all the songs
    let songs = await getSongs();

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
    })
};


main();