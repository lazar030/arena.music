import {Component, OnInit, AfterViewInit, ContentChild, ElementRef, ViewChild} from '@angular/core';
import {ThemeService} from 'src/app/service/theme';
import {NotificationService} from 'src/app/service/notification';
import {Constants} from 'src/app/constants';

import {PanelService} from 'src/app/service/panels/panel';
import {UserService} from 'src/app/service/panels/user';
import {MenuService} from 'src/app/service/panels/menu';
import {MusicService} from 'src/app/service/panels/music';
import {HeaderService} from 'src/app/service/panels/header';
import {DebugService} from 'src/app/service/debug';

declare var WaveSurfer;

@Component({
    selector: 'app-music',
    templateUrl: './music.html',
    styleUrls: ['./music.scss']
})
export class MusicComponent implements OnInit, AfterViewInit {

    isPlay = false;
    isPause = false;
    isStop = true;

    isEqualizerCreated = false;

    curVolume = 80;

    curDurationTime: any = '00:00';
    songDuration: any = '--:--';

    currentProgress = 0;

    wavesurfer: any;
    loaded = false;

    playList: any = [];
    currentPlaySongInfo = {
        artist: '',
        title: '',
        album: '',
        avatar: ''
    };
    isFirstPlay = true;
    cntList = 0;
    startIdx = 0;

    isDuskTheme = true;
    nameTheme: string;

    songSelectState = 'neutral';
    likeClicked = false;
    dislikeClicked = false;

    isShowed = false;
    isExpanded = false;

    isUserPanelShowed = false;
    isUserPanelExpanded = false;

    items = [{title: 'Profile'}, {title: 'Log out'}, {title: 'Log out'}];

    ios = false;

    constructor(
        private themeService: ThemeService,
        private panelService: PanelService,
        private debugService: DebugService,
        private userService: UserService,
        private menuService: MenuService,
        private musicService: MusicService,
        private headerService: HeaderService,
        private notificationService: NotificationService,
    ) {
        this.themeService.getActiveTheme().subscribe(val => {
            if (val === Constants.duskTheme) {
                this.nameTheme = Constants.tooltipDawnTheme;
            } else {
                this.nameTheme = Constants.tooltipDuskTheme;
            }
        });
    }

    ngOnInit() {
        this.getPlayList();
        this.createWaveSurfer();
        this.changeWaveSurferSomeColors();
    }

    ngAfterViewInit() {
        this.watchPlayPanelStatus();
        this.watchMusicPanelExpanded();
        this.watchCurrentPlaySong();

        this.watchUserPanelStatus();
        this.watchUserPanelExpanded();

    }

    watchPlayPanelStatus() {
        this.musicService.getActiveMusicPanel().subscribe(val => {
            this.isShowed = val;
        });
    }

    watchMusicPanelExpanded() {
        this.musicService.getExpandMusicPanel().subscribe(val => {
            this.isExpanded = val;
        });
    }

    watchCurrentPlaySong() {
        this.musicService.getCurrentPlayingSongInfo().subscribe(res => {
            this.currentPlaySongInfo = res;
        });
    }

    watchUserPanelStatus() {
        this.userService.getActiveUserPanel().subscribe(res => {
            this.isUserPanelShowed = res;
        });
    }

    watchUserPanelExpanded() {
        this.userService.getExpandUserPanel().subscribe(res => {
            this.isUserPanelExpanded = res;
        });
    }

    changeWaveSurferSomeColors() {
        this.themeService.getActiveTheme().subscribe(val => {
            if (val === Constants.duskTheme) {
                this.wavesurfer.setWaveColor('#aaaaaa');
                this.wavesurfer.setCursorColor('#ffffff');
                this.wavesurfer.setProgressColor('#f74264');
            } else {
                this.wavesurfer.setWaveColor('#555555');
                this.wavesurfer.setCursorColor('#000000');
                this.wavesurfer.setProgressColor('#f74264');
            }
        });
    }

    showMusicPanel() {
        if (!this.isShowed) {
            this.musicService.showMusicPanel();
            this.musicService.setActiveMusicPanel(true);

            if (this.panelService.isDesktop()) {
                if (this.isUserPanelShowed) {
                    if (this.isUserPanelExpanded) {
                        this.musicService.setMusicPanel_ExpandedWidth();
                    } else {
                        this.musicService.setMusicPanel_CollapsedWidth();
                    }
                } else {
                    this.musicService.setMusicPanel_FullWidth();
                }
            } else {
                this.musicService.setMusicPanel_FullWidth();
            }

            this.debugService.info('Music panel is shown', Constants.FC_PANEL_MUSIC_PATH + 'music.ts', '', 'showMusicPanel()', this.debugService.makeDebugObject());
        }
    }

    hideMusicPanel() {
        this.musicService.hideMusicPanel();
        this.musicService.setActiveMusicPanel(false);
        this.isFirstPlay = true;
        this.startIdx = 0;
        this.songDuration = '--:--';
        this.debugService.info('Music panel is hidden', Constants.FC_PANEL_MUSIC_PATH + 'music.ts', '', 'hideMusicPanel()', this.debugService.makeDebugObject());
    }

    getPlayList() {
        this.musicService.getPlayList().subscribe(res => {
            this.playList = res;
            this.cntList = this.playList.length === undefined ? 0 : this.playList.length;
            if (this.cntList === 0) {
                this.hideMusicPanel();
            }

            if (this.cntList > 0 && this.isFirstPlay) {
                this.makeWaveSurfer(0);
                this.isFirstPlay = false;
                this.currentPlaySongInfo = this.playList[0];
                this.showMusicPanel();
            }
        });
    }

    createWaveSurfer() {
        this.wavesurfer = WaveSurfer.create({
            container: '#waveform',
            mediaType: 'audio',
            normalize: true,
            cursorColor: '#ffffff',
            waveColor: '#aaaaaa',
            progressColor: '#f74264',
            height: 45,
            hideScrollbar: true,
            responsive: true,
            barWidth: 2,
            barHeight: 1,
            barGap: null,
        });

        const self = this;
        const selfWave = this.wavesurfer;

        this.wavesurfer.on('ready', function() {
            /*
            self.debugService.info('The waveform is successfully created', Constants.FC_PANEL_MUSIC_PATH + 'music.ts', '', 'createWaveSurfer()', self.wavesurfer);
            let filter = selfWave.backend.ac.createBiquadFilter();
            if(!self.isEqualizerCreated) {
              const EQ = [
                { f: 32, type: 'lowshelf'},
                { f: 64, type: 'peaking'},
                { f: 125, type: 'peaking'},
                { f: 250, type: 'peaking'},
                { f: 500, type: 'peaking'},
                { f: 1000, type: 'peaking'},
                { f: 2000, type: 'peaking'},
                { f: 4000, type: 'peaking'},
                { f: 8000, type: 'peaking'},
                { f: 16000, type: 'lowshelf'}
              ]

              let filters = EQ.map(function (band) {
                let filter = selfWave.backend.ac.createBiquadFilter();
                filter.type = band.type;
                filter.gain.value = 0;
                filter.Q.value = 1;
                filter.frequency.value = band.f;
                return filter;
              });

              selfWave.backend.setFilters(filters);

              let container = document.getElementById('equalizerDesktop');
              console.log('equalizerDesktop: ', container);

              filters.forEach(function(filter) {
                let input = document.createElement('input');
                selfWave.util.extend(input, {
                  type: 'range',
                  min: -40,
                  max: 40,
                  value: 0,
                  title: filter.frequency.value
                });
                input.style.display = "inline-block";
                input.setAttribute('orient', 'vertical');
                selfWave.util.style(input, {
                  'webkitAppearance': 'slider-vertical',
                  width: '25px',
                  height: '60px'
                })
                container.appendChild(input);

                let onChange = function(e) {
                  filter.gain.value = ~~e.target.value;
                };

                input.addEventListener('input', onChange);
                input.addEventListener('change', onChange);
                self.isEqualizerCreated = true;
              });
            }
            */
        });
    }

    makeWaveSurfer(idx) {
        this.wavesurfer.load(this.playList[idx].src);
        this.wavesurfer.loaded = false;

        const self = this;
        const selfWave = this.wavesurfer;

        this.wavesurfer.on('ready', function() {
            if (!selfWave.loaded) {
                selfWave.loaded = true;
                // selfWave.play();
                self.songDuration = Math.floor(selfWave.getDuration() / 60) + ':' + (Math.floor(selfWave.getDuration() % 60) < 10 ? '0' : '') + Math.floor(selfWave.getDuration() % 60);
                self.debugService.info('The waveform loaded "' + self.playList[idx].title + '" successfully', Constants.FC_PANEL_MUSIC_PATH + 'music.ts', '', 'makeWaveSurfer()', self.wavesurfer);
                self.debugService.info('The waveform volume is setup at ' + self.curVolume, Constants.FC_PANEL_MUSIC_PATH + 'music.ts', '', 'makeWaveSurfer()');
                selfWave.setVolume(self.curVolume / 100);
            }
        });

        this.wavesurfer.on('audioprocess', function(e) {
            if (selfWave.isPlaying()) {
                const currentSeconds = (Math.floor(selfWave.getCurrentTime() % 60) < 10 ? '0' : '') + Math.floor(selfWave.getCurrentTime() % 60);
                const currentMinutes = Math.floor(selfWave.getCurrentTime() / 60);
                // let currentTimePlaceholder = document.getElementById('curDurationTime');
                // currentTimePlaceholder.textContent = (currentMinutes > 10 ? currentMinutes : '0' + currentMinutes) + ':' + currentSeconds;

                const totalTime = selfWave.getDuration(),
                    currentTime = selfWave.getCurrentTime(),
                    remainingTime = totalTime - currentTime;
                const remainSeconds = (Math.floor(remainingTime % 60) < 10 ? '0' : '') + Math.floor(remainingTime % 60);
                const remainMinutes = Math.floor(remainingTime / 60);
                const remainPlaceholder = document.getElementById('remainTime');
                remainPlaceholder.textContent = (remainMinutes > 10 ? remainMinutes : '0' + remainMinutes) + ':' + remainSeconds;

                const percentageOfSong = currentTime / totalTime;
                const percentageOfSlider = document.getElementById('progressWrapper').offsetWidth * percentageOfSong;
                document.getElementById('trackProgress').style.width = Math.round(percentageOfSlider) + 'px';
            }
        });

        this.wavesurfer.on('finish', function(e) {
            self.next();
        });
    }

    play() {
        if (this.cntList === 0) {
            this.notificationService.showWarning(Constants.msgEmptiedPlayList);
        } else {
            this.isPlay = true;
            this.isPause = false;
            this.isStop = false;
            this.wavesurfer.play();
            this.musicService.setCurrentPlayingSongInfo(this.playList[this.startIdx]);
            this.notificationService.showSuccess(Constants.msgSongPlayed);
            this.debugService.info('"' + this.playList[this.startIdx].title + '" was played', Constants.FC_PANEL_MUSIC_PATH + 'music.ts', '', 'play()');
        }
    }

    pause() {
        this.isPlay = false;
        this.isPause = true;
        this.isStop = false;
        this.wavesurfer.pause();
        this.notificationService.showSuccess(Constants.msgSongPaused);
        this.debugService.info('"' + this.playList[this.startIdx].title + '" was paused', Constants.FC_PANEL_MUSIC_PATH + 'music.ts', '', 'pause()');
    }

    next() {
        if (this.cntList > 0) {
            if ((this.startIdx + 1) < this.cntList) {
                this.wavesurfer.stop();
                this.startIdx++;
                this.makeWaveSurfer(this.startIdx);
                const self = this;
                const selfWave = this.wavesurfer;
                this.musicService.setCurrentPlayingSongInfo(this.playList[this.startIdx]);
                if (this.isPlay) {
                    this.wavesurfer.on('ready', function() {
                        selfWave.play();
                        self.debugService.info('Played next song "' + self.playList[this.startIdx].title + ' "successfully', Constants.FC_PANEL_MUSIC_PATH + 'music.ts', '', 'next()');
                    });
                }
            } else {
                this.notificationService.showWarning(Constants.msgNoSongPlayList);
                this.debugService.warning('There is no songs to skip on playlist', Constants.FC_PANEL_MUSIC_PATH + 'music.ts', '', 'next()');
            }
        } else {
            this.notificationService.showWarning(Constants.msgEmptiedPlayList);
            this.debugService.warning('There is no songs to skip on playlist', Constants.FC_PANEL_MUSIC_PATH + 'music.ts', '', 'next()');
        }
    }

    playPause() {

    }

    volumeChange() {
        this.wavesurfer.setVolume(this.curVolume / 100);
        this.debugService.info('The waveform volume is setup at ' + this.curVolume, Constants.FC_PANEL_MUSIC_PATH + 'music.ts', '', 'volumeChange()');
    }

    toggleAppTheme() {
        if (this.isDuskTheme) {
            this.themeService.setActiveTheme(Constants.dawnTheme);
        } else {
            this.themeService.setActiveTheme(Constants.duskTheme);
        }
        this.isDuskTheme = !this.isDuskTheme;
    }

    selectSongState(selected) {
        if (selected !== undefined) {
            this.songSelectState = selected;
        }
        if (this.songSelectState === 'like') {
            if (this.likeClicked) {
                this.songSelectState = 'neutral';
                this.likeClicked = false;
                this.dislikeClicked = false;
            } else {
                this.likeClicked = true;
                this.dislikeClicked = false;
            }
        } else if (this.songSelectState === 'dislike') {
            if (this.dislikeClicked) {
                this.songSelectState = 'neutral';
                this.dislikeClicked = false;
                this.likeClicked = false;
            } else {
                this.likeClicked = false;
                this.dislikeClicked = true;
            }
        } else {
            this.likeClicked = false;
            this.dislikeClicked = false;
        }
    }

    setMusicScale() {
        const wave = document.getElementById('wave');
        if (this.isExpanded) {
            wave.style.opacity = '0';
            wave.style.position = 'absolute';
            this.musicService.collapseMusicPanel();
            this.menuService.expandMenuPanelLink_Mobile_MusicCollapsed();
            if (this.panelService.getCurrentBreakpoint(window.innerWidth) === Constants.screenBreakpoints.sm) {  // Current breakpoint is sm
                this.userService.expandUserPanelLink_SM();
            } else { // Current breakpoint is xs or vs
                this.userService.expandUserPanelLink_OnMobile_Collapse();
            }
        } else {
            wave.style.opacity = '1';
            wave.style.position = 'relative';
            this.musicService.expandMusicPanel();
            this.menuService.collapseMenuPanelLink_Mobile_Expanded();
            if (this.panelService.getCurrentBreakpoint(window.innerWidth) === Constants.screenBreakpoints.sm) {
                this.userService.collapseUserPanelLink_SM();
            } else {
                this.userService.collapseUserPanelLink_OnMobile_Expand();
            }
        }
        this.musicService.setExpandMusicPanel(!this.isExpanded);
        this.debugService.info(this.isExpanded ? 'Menu panel is expanded' : 'Menu panel is collapsed', Constants.FC_PANEL_MUSIC_PATH + 'music.ts', '', 'setMusicScale()', this.debugService.makeDebugObject());
    }

    manageEqualizer() {
        // setTimeout(() => {
        //   if(this.wavesurfer !== undefined || this.wavesurfer !== null) {
        //     let self = this;
        //     let selfWave = this.wavesurfer
        //     if(!self.isEqualizerCreated) {
        //     const EQ = [
        //       { f: 32, type: 'lowshelf'},
        //       { f: 64, type: 'peaking'},
        //       { f: 125, type: 'peaking'},
        //       { f: 250, type: 'peaking'},
        //       { f: 500, type: 'peaking'},
        //       { f: 1000, type: 'peaking'},
        //       { f: 2000, type: 'peaking'},
        //       { f: 4000, type: 'peaking'},
        //       { f: 8000, type: 'peaking'},
        //       { f: 16000, type: 'lowshelf'}
        //     ]

        //     let filters = EQ.map(function (band) {
        //       let filter = selfWave.backend.ac.createBiquadFilter();
        //       filter.type = band.type;
        //       filter.gain.value = 0;
        //       filter.Q.value = 1;
        //       filter.frequency.value = band.f;
        //       return filter;
        //     });

        //     selfWave.backend.setFilters(filters);
        //     let container = document.getElementById('equalizerDesktop');
        //     filters.forEach(function(filter) {
        //       let input = document.createElement('input');
        //       selfWave.util.extend(input, {
        //         type: 'range',
        //         min: -40,
        //         max: 40,
        //         value: 0,
        //         title: filter.frequency.value
        //       });
        //       input.style.display = "inline-block";
        //       input.setAttribute('orient', 'vertical');
        //       selfWave.util.style(input, {
        //         'webkitAppearance': 'slider-vertical',
        //         width: '25px',
        //         height: '60px'
        //       })
        //       container.appendChild(input);

        //       let onChange = function(e) {
        //         filter.gain.value = ~~e.target.value;
        //       };

        //       input.addEventListener('input', onChange);
        //       input.addEventListener('change', onChange);
        //       self.isEqualizerCreated = true;
        //     });
        //   }
        //   }
        // }, 10);
    }

}
