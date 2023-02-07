const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const PLAYER_STORAGE_KEY = 'F8_PLAYER';

const cd = $('.cd');
const playlist = $('.playlist');
const heading = $('header h2');
const cdThumb = $('.cd-thumb');
const audio = $('#audio');
const playButton = $('.btn-toggle-play');
const player = $('.player');
const progress = $('#progress');
const nextBtn = $('.btn-next');
const prevBtn = $('.btn-prev');
const randomBtn = $('.btn-random');
const repeatBtn = $('.btn-repeat');

const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
    setConfig(key, value) {
        this.config[key] = value;
        localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config));
    },
    songs: [
        {
            name: 'Dang Do',
            singer: 'Tui Khong Nho',
            path: './assets/musics/dangdo.mp3',
            image: './assets/imgs/dangdo.jpg'
        },
        {
            name: 'Gettin\' it',
            singer: '2 $hort',
            path: './assets/musics/gettinit.mp3',
            image: './assets/imgs/gettinit.jpg'
        },
        {
            name: 'Haru Haru',
            singer: 'Big Bang',
            path: './assets/musics/haruharu.mp3',
            image: './assets/imgs/haruharu.jpg'
        },
        {
            name: 'Kiss me more',
            singer: 'Doja Cat',
            path: './assets/musics/kissmemore.mp3',
            image: './assets/imgs/kissmemore.png'
        },
        {
            name: 'Loser',
            singer: 'Big Bang',
            path: './assets/musics/loser.mp3',
            image: './assets/imgs/loser.jpg'
        },
        {
            name: 'Nhin Ve Phia Em',
            singer: 'Tui Khong Nho',
            path: './assets/musics/nhinvephiaem.mp3',
            image: './assets/imgs/nhinvephiaem.jpg'
        },
        {
            name: 'Stay',
            singer: 'Kid LaRoi',
            path: './assets/musics/stay.mp3',
            image: './assets/imgs/stay.png'
        },
        {
            name: 'Tong Hua',
            singer: 'Dong Quang',
            path: './assets/musics/tonghua.mp3',
            image: './assets/imgs/tonghua.jpg'
        },
        {
            name: 'Tong Phu',
            singer: 'Tui Khong Nho',
            path: './assets/musics/tongphu.mp3',
            image: './assets/imgs/tongphu.jpg'
        },
        {
            name: 'Waiting For U',
            singer: 'Mono',
            path: './assets/musics/waitingforu.mp3',
            image: './assets/imgs/waitingforu.jpg'
        },
    
    ],
    defineProperties() {
        Object.defineProperty(this, 'currentSong', {
            get() {
                return this.songs[this.currentIndex];
            }})
    },
    render() {
        const htmls = this.songs.map((song, index) => {
            return `
                <div class="song ${index === this.currentIndex ? 'active' : ''}" data-index="${index}">
                    <div class="thumb" 
                        style="background-image: url('${song.image}')">
                    </div>
                    <div class="body">
                        <h3 class="title">${song.name}</h3>
                        <p class="author">${song.singer}</p>
                    </div>
                    <div class="option">
                        <i class="fas fa-ellipsis-h"></i>
                    </div>
                </div>
            `
        })
        playlist.innerHTML = htmls.join('');
        
    },
    nextSong() {
        this.currentIndex++;
        if(this.currentIndex >= this.songs.length) {
            this.currentIndex = 0;
        };
        this.loadCurrentSong();
    },
    prevSong() {
        if(this.currentIndex <= 0) {
            this.currentIndex = this.songs.length - 1;
        } else {
            this.currentIndex--;
        }
        this.loadCurrentSong();
        
    },
    loadConfig() {
        this.isRandom = this.config.isRandom;
        this.isRepeat = this.config.isRepeat;
    },
    playRandomSong() {
        let newIndex;
        do {
            newIndex = Math.floor(Math.random() * this.songs.length);
        } while(newIndex === this.currentIndex);
        this.currentIndex = newIndex;
        this.loadCurrentSong();
    },
    scrollToActiveSong() {
        setTimeout(() => {
            $('.song.active').scrollIntoView({
                behavior: 'smooth',
                block: 'center',
            })
        }, 100);
    },
    handleEvents() {
        const _this = this;
        const cdWidth = cd.offsetWidth;
        //Xu ly phong to thu nho CD
        document.onscroll = function() {
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            const newCdWidth = cdWidth - scrollTop;
            cd.style.width = newCdWidth > 0 ? newCdWidth + "px" : 0;
            cd.style.opacity = newCdWidth / cdWidth;
        }
        //Xu ly quay/dung cd

        const cdThumbAnimate = cdThumb.animate([
            {transform: 'rotate(360deg)'}
        ], {
            duration: 10000,
            iterations: Infinity
        });
        cdThumbAnimate.pause();

        //Xu ly click play
        playButton.onclick = function() {
            if(_this.isPlaying) {
                audio.pause();
            } else {
                audio.play();
            };
        };
        audio.onplay = function() {
            _this.isPlaying = true;
            player.classList.add('playing');
            cdThumbAnimate.play();
        };
        audio.onpause = function() {
            _this.isPlaying = false;
            player.classList.remove('playing');
            cdThumbAnimate.pause();
        };
        //Tien do bai hat thay doi
        audio.ontimeupdate = function() {
            if(audio.duration) {
                const progressPercent = Math.floor(audio.currentTime / audio.duration * 100);
                progress.value = progressPercent;
            }
        };
        //Xu ly khi tua
        progress.onchange = function(e) {
            const seekTime = audio.duration / 100 * e.target.value;
            audio.currentTime = seekTime;
        }
        //Next bai hat
        nextBtn.onclick = function() {
            if(_this.isRandom) {
                _this.playRandomSong();
            } else {
                _this.nextSong();
            }
            audio.play();
            _this.render();
            _this.scrollToActiveSong();
        };
        //Prev bai hat
        prevBtn.onclick = function() {
            if(_this.isRandom) {
                _this.playRandomSong();
            } else {
                _this.prevSong();
            }
            audio.play();
            _this.render();
            _this.scrollToActiveSong();
        }
        //Random bai hat
        randomBtn.onclick = function() {
            // if(_this.isRandom) {
            //     _this.isRandom = false;
            //     randomBtn.classList.remove('active');
            // } else {
            //     _this.isRandom = true;
            //     randomBtn.classList.add('active');
            // }
            _this.isRandom = !_this.isRandom;
            _this.setConfig('isRandom', _this.isRandom);
            randomBtn.classList.toggle('active', _this.isRandom);
        }
        //Xu ly khi het bai
        audio.onended = function() {
            if(_this.isRepeat) {
                audio.play();
            } else {
                nextBtn.click();
            }
        }
        //Xu ly repeat
        repeatBtn.onclick = function() {
            _this.isRepeat = !_this.isRepeat;
            _this.setConfig('isRepeat', _this.isRepeat);
            repeatBtn.classList.toggle('active', _this.isRepeat);
        }
        //Lang nghe su kien click vao playlist 
        playlist.onclick = function(e) {
            const songNode = e.target.closest('.song:not(.active)')
            if (songNode || e.target.closest('.option')) {
                //Xu ly khi bam vao song
                if (songNode) {
                    _this.currentIndex = Number(songNode.dataset.index);
                    _this.loadCurrentSong();
                    _this.render();
                    audio.play();    
                }
                //Xu ly khi bam vao option


            }
        }
    },
    loadCurrentSong(){
        heading.textContent = this.currentSong.name;
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`;
        audio.src = this.currentSong.path;
    },
    start() {
        this.loadConfig();
        this.defineProperties();
        this.handleEvents();
        this.loadCurrentSong();
        this.render();
        //Hien thi trang thai repeat & random luc ban dau
        randomBtn.classList.toggle('active', this.isRandom);
        repeatBtn.classList.toggle('active', this.isRepeat);

    }
}

app.start();