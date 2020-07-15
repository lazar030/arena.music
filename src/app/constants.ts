export class Constants {
    public static validationSignUpMessage = {
        firstName: [
            {type: 'required', message: '* require.'}
        ],
        lastName: [
            {type: 'required', message: '* require.'}
        ],
        email: [
            { type: 'required', message: '* require.' },
            { type: 'pattern', message: 'Error, Please enter a valid email address.' }
        ],
        phone: [
            { type: 'required', message: '* require.' },
            { type: 'pattern', message: 'Error, Please enter a valid phone number.' }
        ],
        password: [
            { type: 'required', message: '* require.' },
            { type: 'minlength', message: 'Error, Password must be at least 8 characters long.' }
        ],
        cpassword: [
            { type: 'required', message: '* require.' },
            { type: 'minlength', message: 'Error, Password must be at least 8 characters long.' },
            { type: 'mustMatch', message: 'Error, Mismatch password. Please check it.' }
        ]

    };

    public static title = 'Arena Music';
    
    public static FC_PATH = 'src/app/';
    public static FC_PANEL_HEADER_PATH = 'src/app/panels/header/';
    public static FC_PANEL_MENU_PATH = 'src/app/panels/menu/';
    public static FC_PANEL_MUSIC_PATH = 'src/app/panels/music/';
    public static FC_PANEL_USER_PATH = 'src/app/panels/user/';
    public static FC_PAGE_PATH = 'src/app/pages/';
    public static FC_SERVICE_PATH = 'src/app/service/';

    public static tooltipDawnTheme = "Dawn Mode  (Go Light)";
    public static tooltipDuskTheme = "Dusk Mode  (Go Dark)";

    public static duskTheme = 'dusk-theme';
    public static dawnTheme = 'dawn-theme';

    public static msgAddSongToPlayList = 'Song was successfully added to playlist';
    public static msgRemoveSongToPlayList = 'Song was successfully removed to playlist';
    public static msgErrorToRemovePlayList = "This song is playing now, you can't remove this song from playlist now. Try again later!"

    public static msgSongPlayed = 'Song was played';
    public static msgSongPaused = 'Song was paused';
    public static msgSongStopped = 'Song was stopped';
    public static msgNoSongPlayList = "There isn't no more song to play on the playlist";
    public static msgEmptiedPlayList = "There isn't any song on the playlist. You have to add songs on the playlist";

    public static unitScreen = 'px';

    public static screenXS = 0;
    public static screenVS = 300;
    public static screenSM = 500;
    public static screenMD = 750;
    public static screenLG = 1000;
    public static screenVL = 1300;
    public static screenXL = 1600;

    public static expandSideBarWidth = 270;
    public static collapseSideBarWidth = 71;
    public static noneSideBarWidth = 0;

    public static expandMusicPanelHeight = 150; // Music Panel: 80px; Expanded Wave Form: 70px;
    public static musicPanelHeight = 80;
    public static nonemusicPanelHeight = 0;

    public static screenBreakpoints = {
        'xl': 'XL',
        'vl': 'VL',
        'lg': 'LG',
        'md': 'MD',
        'sm': 'SM',
        'vs': 'VS',
        'xs': 'XS'
    }

    public static aryPanels = ['headerPanel', 'menuPanel', 'musicPanel', 'userPanel'];
    public static aryBreakpoints = ['xl', 'vl', 'lg', 'md', 'sm', 'vs', 'xs'];
    public static aryNodes = ['defaultMode', 'defaultState', 'currentMode', 'currentState', 'userMode', 'userState', 'canCollapse', 'canExpand', 'canFloat', 'canHide', 'canPin', 'canStick'];
    public static panelMode = {
        'hd': 'Hidden', 
        'co': 'Collapsed', 
        'ex': 'Expanded'
    };
    public static panelPadding = {
        'flt': 'Float', 
        'pin': 'Pinned', 
        'sti': 'Sticky'
    };

    public static metaType = {
        'meta': 'META',
        'og': 'OG'
    };
}
