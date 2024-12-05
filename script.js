// 2024, Nov 30

let songLocation = 'res/aud/';
let globalCurrentSong = new Audio();
let globalCurrentSongIndex = 0;
let globalTitle = document.getElementById("song-title");
let globalPlayIcon = document.getElementById("play").firstElementChild; // Play/Pause icon.
let prevBtn = document.getElementById('prev');
let nextBtn = document.getElementById('next');
let globalProgressBar = document.getElementById('progress-bar');
const currentTimeEl = document.getElementById('current-time');
const globalDurationEl = document.getElementById('duration');

// —————————————————————————————————————————————

// Async Function to fetch songs database.
async function loadSongs() {
    // let data = await fetch("http://127.0.0.1:3000/Projects/Webdev/Spotify%20WebApp%20Clone%20-%20HTML%20CSS%20&%20JS/res/aud/");
    let data = await fetch(songLocation);

    let reponse = await data.text();
    // console.log(reponse);

    let div = document.createElement("div");
    div.innerHTML = reponse;
    // console.log(div);

    let ancherTags = div.getElementsByTagName("a")
    // console.log(ancherTags);

    let allSongs = []

    for (let index = 0; index < ancherTags.length; index++) {
        const ELEMENT = ancherTags[index];
        // console.log(ELEMENT);
        // console.log(ELEMENT.innerText);

        if (ELEMENT.href.endsWith(".mp3")) {
            allSongs.push(ELEMENT.href.split("aud/")[1]);
            // allSongs.push(ELEMENT.innerText);
        }
    }
    // console.log(allSongs);

    return allSongs;
}

// --------------------------------

// Update song title in the player. 
function updateSongTitle(title) {
    globalTitle.innerHTML = title.replaceAll("%20", " ");
}

// --------------------------------

// Function to play a song.
function playSong(song, pause = false) {

    // globalCurrentSong.src = `http://127.0.0.1:3000/Projects/Webdev/Spotify%20WebApp%20Clone%20-%20HTML,%20CSS%20&%20JS/res/aud/${song}`;
    globalCurrentSong.src = songLocation + song;

    globalCurrentSong.play();

    updateSongTitle(song);

    globalPlayIcon.src = "res/img/pause.svg";
}

// --------------------------------

// Update progress bar
function updateProgress() {

    let progress = (globalCurrentSong.currentTime / globalCurrentSong.duration) * 10000;
    globalProgressBar.value = progress;
    // console.log(globalCurrentSong.currentTime, globalCurrentSong.duration)

    let currentMinutes = Math.floor(globalCurrentSong.currentTime / 60);
    let currentSeconds = Math.floor(globalCurrentSong.currentTime % 60);

    let durationMinutes = Math.floor(globalCurrentSong.duration / 60);
    let durationSeconds = Math.floor(globalCurrentSong.duration % 60);

    if (currentSeconds < 10) currentSeconds = `0${currentSeconds}`;
    if (durationSeconds < 10) durationSeconds = `0${durationSeconds}`;

    currentTimeEl.textContent = `${currentMinutes}:${currentSeconds}`;
    globalDurationEl.textContent = `${durationMinutes}:${durationSeconds}`;
}

// --------------------------------

// Seek song
function seekSong() {
    const seekTime = (globalProgressBar.value / 10000) * globalCurrentSong.duration;
    console.log(seekTime);
    globalCurrentSong.currentTime = seekTime;
    console.log(globalCurrentSong.currentTime);
}

// —————————————————————————————————————————————

async function main() {
    let songs = await loadSongs();
    // console.log(songs);
    // playSong(songs[0], true)

    // default song for music player.
    // globalCurrentSong.src = `http://127.0.0.1:3000/Projects/Webdev/Spotify%20WebApp%20Clone%20-%20HTML,%20CSS%20&%20JS/res/aud/${songs[0]}`;
    globalCurrentSong.src = songLocation + songs[0];
    updateSongTitle(songs[0])

    // --------------------------------

    // Show all the songs in the library.
    let songUL = document.getElementById("songList").getElementsByTagName("ul")[0]
    // console.log(songUL);

    for (const song of songs) {
        songUL.innerHTML = songUL.innerHTML + `<li class="rounded flex">
                                    <img src="res/img/music.svg" alt="">

                                    <div class="info">
                                        <div>${song.replaceAll("%20", " ")}</div>
                                    </div>
                                </li>`;
    }

    // --------------------------------

    // Add an event listener to each song of library.
    Array.from(document.getElementById("songList").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", element => {
            playSong(e.querySelector(".info").firstElementChild.innerHTML);
        })
    })

    // --------------------------------

    // Add an event listener to play/pause icon in the music player. 
    globalPlayIcon.addEventListener("click", () => {
        if (globalCurrentSong.paused) {
            globalCurrentSong.play();
            globalPlayIcon.src = "res/img/pause.svg";
        }

        else {
            globalCurrentSong.pause();
            globalPlayIcon.src = "res/img/play.svg";
        }
    })

    // --------------------------------

    // Add an event listener for updating progress of progress-bar & time of audio in the music player.
    globalCurrentSong.addEventListener('timeupdate', updateProgress);

    // --------------------------------

    // Navigate songs
    prevBtn.addEventListener('click', () => {
        globalCurrentSongIndex = songs.indexOf(globalCurrentSong.src.split("/").slice(-1)[0]);

        if ((globalCurrentSongIndex - 1) >= 0) {
            playSong(songs[globalCurrentSongIndex - 1])
        }
    });

    nextBtn.addEventListener('click', () => {
        globalCurrentSongIndex = songs.indexOf(globalCurrentSong.src.split("/").slice(-1)[0]);

        if ((globalCurrentSongIndex + 1) < songs.length) {
            playSong(songs[globalCurrentSongIndex + 1])
        }
    });
}

main();

// --------------------------------

globalProgressBar.addEventListener('input', seekSong);