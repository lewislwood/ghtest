"use strict";
const mediaFolder = getMediaFolder();
function getMediaFolder() {
    const m = document.querySelector("#id_media_folder");
    if (m != undefined)
        return m.dataset.mediaFolder;
    else
        return "xmediax";
}
; // getMediaFolder
class CardTrack {
    constructor(card, trackNumber) {
        this.trackNumber = -1;
        this.category = "general";
        this.title = "title";
        this.src = "";
        this.controlPanel = {};
        this.timer = -1;
        try {
            this.trackNumber = trackNumber;
            this.track = card;
            this.audio = card.querySelector("audio");
            this.playButton = card.querySelector("[data-action-type='play']");
            this.playImage = this.playButton.querySelector("img");
            this.status1 = card.querySelector("[name='status1']");
            this.status2 = card.querySelector("[name='status2']");
            this.category = card.getAttribute("data-card-category");
            this.title = card.getAttribute("data-card-title");
            this.src = this.audio.src;
            this.playButton.addEventListener("click", (e) => { this.play(); });
            this.audio.volume = CardPlayer.currentVolume;
            const pl = () => { this.preLoad(); }, pe = (e) => { this.playEvent(e); };
            this.audio.addEventListener("loadeddata", (e) => { pl(); });
            this.audio.addEventListener("playing", (e) => { pe(e); });
            // Load Control Panel
            const cp = this.controlPanel;
            cp.control0 = card.querySelector("[name='control0']");
            cp.control1 = card.querySelector("[name='control1']");
            cp.control2 = card.querySelector("[name='control2']");
            cp.control3 = card.querySelector("[name='control3']");
            cp.control4 = card.querySelector("[name='control4']");
            cp.control5 = card.querySelector("[name='control5']");
        }
        catch (e) {
            DevOps.log("track.constructor  error: " + e.message);
        }
        ; // catch
    }
    ; // constructor
    timeUpdate() {
        if (this.isPlaying()) {
            if (this.timer > -1)
                this.timeStatus();
            this.timer = setTimeout(() => { this.timeUpdate(); }, 1000);
        }
        else
            this.timer = -1;
    }
    ; // timeUpdate
    playEvent(e) {
        var _a;
        try {
            const src = ((_a = this.playImage) === null || _a === void 0 ? void 0 : _a.src) ? this.playImage.src : "";
            if (this.playImage) {
                this.playImage.src = src.replace("play", "pause");
                this.playImage.alt = "pause";
            }
            ;
            let cp = "";
            if (!CardPlayer.switchingTrack) {
                if (CardPlayer.lastTrack != this.trackNumber) {
                    cp = "Playing: " + this.title;
                    const handler = () => { this.setActive(true); };
                    setTimeout(handler, 200);
                }
                ;
                CardPlayer.statusMessage(cp, this.timeStatus());
                CardPlayer.lastTrack = this.trackNumber;
                this.timeUpdate();
            }
            else
                CardPlayer.switchingTrack = false;
        }
        catch (err) {
            DevOps.log('cardTrack.playEvent error: ' + err.message);
        }
        ; // catch
    }
    ; // playEvent      
    setActive(active) {
        var _a, _b, _c, _d, _e;
        try {
            if (active) {
                const nc = CardPlayer.getNavControls();
                if (nc) {
                    const cp = this.controlPanel;
                    (_a = cp.control0) === null || _a === void 0 ? void 0 : _a.appendChild(nc.jumpBack);
                    (_b = cp.control2) === null || _b === void 0 ? void 0 : _b.appendChild(nc.jumpFoward);
                    (_c = cp.control3) === null || _c === void 0 ? void 0 : _c.appendChild(nc.prevTrack);
                    (_d = cp.control5) === null || _d === void 0 ? void 0 : _d.appendChild(nc.nextTrack);
                }
                ;
                const nb = CardPlayer.getNavBar();
                const tr = this.track;
                if ((nb) && (tr)) {
                    const pn = nb.parentNode;
                    const fc = (_e = this.track) === null || _e === void 0 ? void 0 : _e.firstChild;
                    if (fc)
                        tr.insertBefore(nb, fc);
                }
                ;
            }
        }
        catch (err) {
            DevOps.log("CardTrack.setActive error: " + err.message);
        }
    }
    preLoad() {
        try {
            if (this.status2)
                this.status2.innerText = "ready.";
            this.timeStatus();
        }
        catch (e) {
            DevOps.log("cardTrack.preLoad error: " + e.message);
        } //catch
    }
    play(doPlay = false) {
        try {
            if (this.playButton) {
                this.playButton.focus();
            }
            if (!CardPlayer.isCurrentTrack(this.trackNumber)) {
                CardPlayer.playTrack(this.trackNumber);
            }
            else {
                if (this.audio) {
                    if (!this.isPlaying()) {
                        this.audio.play();
                    }
                    else {
                        this.pause();
                    }
                }
                ;
            }
        }
        catch (e) {
            DevOps.log("track.play error: " + e.message);
        } // catch
    } // play
    pause() {
        var _a, _b;
        try {
            const src = ((_a = this.playImage) === null || _a === void 0 ? void 0 : _a.src) ? this.playImage.src : "";
            if (this.playImage) {
                this.playImage.src = src.replace("pause", "play");
                this.playImage.alt = "Play " + this.title;
            }
            ;
            if (this.audio) {
                this.timeStatus();
                if (this.audio.paused) {
                    DevOps.log("Already Paused crazy fool.... " + this.src);
                }
                else {
                    (_b = this.audio) === null || _b === void 0 ? void 0 : _b.pause();
                }
            }
            ;
        }
        catch (err) {
            DevOps.log('cardTrack.pause error: ' + err.message);
        }
        ; // catch
    }
    ; // pause
    duration() {
        if (this.audio)
            return this.audio.duration;
        else
            return 0;
    }
    position(newPosition = -1) {
        if (this.audio) {
            if (newPosition != -1) {
                this.audio.currentTime = Math.min(newPosition, this.duration());
                this.timeStatus();
            }
            CardPlayer.statusMessage("", this.timeStatus());
            return this.audio.currentTime;
        }
        else
            return -1;
    }
    ; //position
    isPlaying() {
        const p = (this.audio) ? (!this.audio.paused) : false;
        return p;
    }
    ; // isPlaying
    mute() {
        try {
            if (this.audio) {
                this.audio.muted = !this.audio.muted;
            }
        }
        catch (err) {
            DevOps.log('cardTrack.mute error: ' + err.message);
        }
        ; // catch
    }
    ; // mute
    playbackRate(newRate = -1) {
        try {
            if (this.audio) {
                if ((newRate > 0.3) && (newRate <= 2.5))
                    this.audio.playbackRate = newRate;
                return this.audio.playbackRate;
            }
            else
                return 1;
        }
        catch (e) {
            DevOps.log("cadTrack.playbackRate error: (" + newRate + ")" + e.mesage);
            return -1;
        }
        ; //catch
    }
    ; // playbackRate
    setVolume() {
        try {
            if (this.audio) {
                this.audio.volume = CardPlayer.currentVolume;
            }
        }
        catch (err) {
            DevOps.log('cardTrack.setVolume error: ' + err.message);
            return 1;
        }
        ; // catch
    }
    ; // setVolume
    timeStatus() {
        try {
            const tSay = (m, s) => {
                let d = "";
                if (m > 0)
                    d = m + " minutes ";
                if ((m > 0) && (s > 0))
                    d += "and ";
                if (s > 0)
                    d += s + " seconds";
                return d;
            }; // tSay
            if (this.audio) {
                const ct = Math.floor(this.audio.currentTime), tt = Math.floor(this.audio.duration);
                // time description and time screen reader description
                let td = "unknown", ts = "";
                if (tt > 0) {
                    let m = Math.floor(tt / 60);
                    let s = tt - (m * 60);
                    td = m + ":" + s.toString().padStart(2, "0");
                    ts = tSay(m, s);
                    if (ct > 0) {
                        td = " of " + td;
                        ts = " of " + ts;
                        m = Math.floor(ct / 60);
                        s = ct - (m * 60);
                        td = m + ":" + s.toString().padStart(2, "0") + td;
                        ts = tSay(m, s) + ts;
                    }
                    ; // ct > 0
                }
                ; // if tt > 0
                if (this.status1)
                    this.status1.innerText = td;
                return ts;
            }
            else {
                if (this.status1)
                    this.status1.innerText = "unknown";
                return "";
            }
            ;
        }
        catch (e) {
            DevOps.log("cardTrack.timeStatus error: " + e.mesage);
            return "";
        }
        ; // catch
    }
    ; // timeStatus
    currentStatus() {
        try {
            let cp = "";
            if (this.isPlaying())
                cp = "playing: " + this.title;
            else
                cp = this.title + " is paused";
            CardPlayer.statusMessage(cp, this.timeStatus());
        }
        catch (err) {
            DevOps.log('cardTrack.currentStatus error: ' + err.message);
        }
        ; // catch
    }
    ; // currentStatus   
}
; // class cardTrack
class CardPlayer {
    constructor() {
        DevOps.log("You cannot create and instance of CardPlayer.");
    }
    ; // constructor
    static initialize() {
        const newTracks = [];
        const els = document.querySelectorAll("[name='track']");
        if (els) {
            for (let i = 0; i < els.length; i++) {
                const eT = els[i];
                const t = new CardTrack(eT, newTracks.length);
                newTracks.push(t);
            }
            ; //for
            CardPlayer.tracks = newTracks;
        }
        ; // if el
        window.addEventListener("keyup", (e) => { CardPlayer.keyHandler(e); });
    }
    ; //Initialize
    static keyHandler(ev) {
        try {
            if (!(ev.altKey || ev.ctrlKey)) {
                let keyHandled = true;
                if (ev.shiftKey) {
                    switch (ev.key) {
                        case "V":
                            CardPlayer.volume("down");
                            break;
                        case "N":
                            CardPlayer.switchTrack("next");
                            break;
                        case "P":
                            CardPlayer.switchTrack("prev");
                            break;
                        case ">":
                            CardPlayer.rate("faster");
                            break;
                        case "<":
                            CardPlayer.rate("slower");
                            break;
                        default:
                            DevOps.log("Key pressed: " + ev.key);
                            keyHandled = false;
                    }
                }
                else {
                    switch (ev.key) {
                        case "k":
                            CardPlayer.play();
                            break;
                        case "l":
                            CardPlayer.jump("f");
                            break;
                        case "j":
                            CardPlayer.jump("b");
                            break;
                        case "m":
                            CardPlayer.mute();
                            break;
                        case "v":
                            CardPlayer.volume("up");
                            break;
                        case "s":
                            CardPlayer.speakStatus();
                            break;
                        default:
                            const ix = '0123456789"'.indexOf(ev.key);
                            if (ix > -1)
                                CardPlayer.moveTo(ev.key);
                            else
                                keyHandled = false;
                    }
                    ; // switch
                }
                ; // if shiftkey
                if (keyHandled)
                    ev.preventDefault();
            }
            ; // ef  ctrl, alt
        }
        catch (err) {
            DevOps.log("CardPlayer.keyHandle error: " + err.message);
        }
        ; //catch
    }
    ; // keyHandler
    static rate(newRate) {
        try {
            const card = CardPlayer.getTrack();
            let rate = card.playbackRate();
            rate += (newRate === "faster") ? 0.1 : -0.1;
            card.playbackRate(rate);
        }
        catch (err) {
            DevOps.log('CardPlayer.rate error: ' + err.message);
        }
        ; // catch
    }
    ; // rate
    static switchTrack(direction) {
        let nt = CardPlayer.currentTrack;
        if (direction === "next")
            nt++;
        else
            nt--;
        CardPlayer.switchingTrack = true;
        CardPlayer.playTrack(nt);
        const tu = () => { CardPlayer.timeUpdate(); };
        setTimeout(() => { tu(); }, 1100);
    }
    ; // switchTrack
    static volume(direction) {
        let newV = CardPlayer.currentVolume;
        ;
        if (direction === "down") {
            if (newV > 0.1)
                newV -= 0.1;
        }
        else if (newV < 0.9)
            newV += 0.1;
        CardPlayer.currentVolume = newV;
        CardPlayer.getTrack().setVolume();
    }
    ; // volume
    static mute() {
        CardPlayer.getTrack().mute();
    }
    ; // mute
    static jump(direction) {
        const card = CardPlayer.getTrack();
        let d = card.duration();
        if (!(d))
            d = 0;
        let ct = card.position();
        if (!(ct))
            ct = 0;
        ct += (direction === "b") ? -15 : 15;
        if (ct < 0)
            ct = 0;
        else if (ct > d)
            ct = d;
        card.position(ct);
    }
    ; //jump
    static moveTo(position) {
        try {
            const card = CardPlayer.getTrack();
            let newPosition = parseInt(position.trim().substr(0, 1), 10) / 10;
            newPosition *= card.duration();
            card.position(newPosition);
        }
        catch (e) {
            DevOps.log("CardPlayer.moveTo error: " + e.message);
        }
        ; // catch
    }
    ; // moveTo
    static isPlaying() {
        return CardPlayer.getTrack().isPlaying();
    } // isPlaying
    static pause() {
        if (CardPlayer.isPlaying()) {
            CardPlayer.getTrack().pause();
        }
        ;
    }
    ;
    static play() {
        const card = CardPlayer.getTrack();
        if (card.isPlaying())
            card.pause();
        else
            card.play();
    }
    ; //play()
    static isCurrentTrack(trackNumber) {
        return (CardPlayer.currentTrack === trackNumber);
    }
    ; // isCurrentTrack
    static playTrack(trackNumber) {
        try {
            const ct = CardPlayer.currentTrack;
            if (ct != trackNumber)
                CardPlayer.pause();
            CardPlayer.currentTrack = trackNumber;
            const card = CardPlayer.getTrack();
            card.setVolume();
            card.play(true);
        }
        catch (e) {
            DevOps.log("CardPlayer.playTrack error " + e.message);
        }
        ; // catch
    }
    ; // playTrack
    static getTrack() {
        try {
            let ct = CardPlayer.currentTrack;
            if ((ct < 0) || (ct >= CardPlayer.tracks.length)) {
                ct = 0;
                CardPlayer.currentTrack = ct;
            }
            ;
        }
        catch (err) {
            DevOps.log('CardPlayer.getTrack error: ' + err.message);
        }
        ; // catch
        return CardPlayer.tracks[CardPlayer.currentTrack];
    }
    ; // getTrack
    static statusMessage(status, info) {
        try {
            if (status) {
                CardPlayer.playerStatus.innerText = status;
                CardPlayer.currentStatus.innerText = status;
            }
            if (info)
                CardPlayer.playerInfo.innerText = info;
            setTimeout(() => CardPlayer.clearStatus(), 1500);
        }
        catch (e) {
            DevOps.log("CardPlayer.statusMessage error: " + e.message);
        }
        ; // catch
    }
    ; // statusMessage
    static clearStatus() {
        try {
            CardPlayer.playerStatus.innerText = "";
            CardPlayer.playerInfo.innerText = "";
        }
        catch (err) {
            DevOps.log('CardPlayer.clearStatus error: ' + err.message);
        }
        ; // catch
    }
    ; // clearStatus
    static speakStatus() {
        try {
            CardPlayer.getTrack().currentStatus();
        }
        catch (err) {
            DevOps.log('CardPlayer.speakStatus error: ' + err.message);
        }
        ; // catch
    }
    ; // speakStatus
    static makeNavControls() {
        try {
            const makeImg = (image, altText) => {
                const i = document.createElement("img");
                i.setAttribute("alt", altText);
                i.setAttribute("class", "card-img");
                // i.setAttribute("width", "30px");
                i.setAttribute("height", "30px");
                i.setAttribute("src", ("images/" + image + ".svg").toLowerCase());
                DevOps.log("Image: [" + i.getAttribute("src") + "]");
                return i;
            };
            const makeButton = (name, altText, handler) => {
                const b = document.createElement("button");
                b.setAttribute("class", "card-button mt-2");
                b.setAttribute("name", "name-button mt-2");
                b.onclick = () => { handler(); };
                b.appendChild(makeImg(name, altText));
                return b;
            };
            const nc = {
                jumpFoward: makeButton("foward", "foward 15 seconds (L)", () => { CardPlayer.jump("f"); }), jumpBack: makeButton("REWIND", "rewind15 seconds (J)", () => { CardPlayer.jump("b"); }),
                nextTrack: makeButton("next", "Next Track (N)", () => { CardPlayer.switchTrack("next"); }), prevTrack: makeButton("PREVIOUS", "Previous Track (P)", () => { CardPlayer.switchTrack("prev"); })
            };
            CardPlayer.navControls = nc;
        }
        catch (err) {
            DevOps.log('CardPlayer.getNavControls error: ' + err.message);
        }
        ; // catch
    }
    ; // getNavControls
    static getNavControls() {
        if (!CardPlayer.navControls)
            CardPlayer.makeNavControls();
        return CardPlayer.navControls;
    }
    ; // getNavControls;
    static makeNavBar() {
        try {
            const nb = document.createElement("div");
            nb.setAttribute("class", "card-nav-bar");
            nb.setAttribute("name", "navBar");
            nb.setAttribute("title", "Navigation Bar");
            CardPlayer.navBar = nb;
            const makeImage = (index) => {
                const i = document.createElement("img");
                i.setAttribute("class", "card-nb-img");
                i.setAttribute("src", (`images/${index}.svg`).toLowerCase());
                const altText = (index <= 0) ? "Beginning (0)" : `${index}0%  (${index})`;
                i.setAttribute("alt", altText);
                return i;
            };
            const makeButton = (index) => {
                const b = document.createElement("button");
                b.setAttribute("class", "card-nb-button");
                const handler = () => { CardPlayer.moveTo(index.toString()); };
                b.onclick = handler;
                b.appendChild(makeImage(index));
                return b;
            };
            for (let i = 0; i < 10; i++) {
                nb.appendChild(makeButton(i));
            }
            ; // for
        }
        catch (err) {
            DevOps.log('CardPlayer.makeNavBar error: ' + err.message);
        }
        ; // catch
    }
    ; // makeNavBar
    static getNavBar() {
        try {
            if (!CardPlayer.navBar)
                CardPlayer.makeNavBar();
            return CardPlayer.navBar;
        }
        catch (err) {
            DevOps.log("CardPlayer.getNavBar error: " + err.message);
        }
        ; // catch
        return CardPlayer.navBar;
    }
    ; // getNavBar
    static timeUpdate() {
        const tr = CardPlayer.getTrack();
        if (tr.timer < 0) {
            tr.timeUpdate();
        }
    }
}
CardPlayer.tracks = [];
CardPlayer.currentTrack = -1;
CardPlayer.lastTrack = -1;
CardPlayer.switchingTrack = false;
CardPlayer.currentVolume = 0.3;
CardPlayer.currentStatus = document.querySelector("#id_player_status_current");
CardPlayer.playerStatus = document.querySelector("#id_player_status");
CardPlayer.playerInfo = document.querySelector("#id_player_info");
(() => {
    CardPlayer.initialize();
})();
; // class cardPlayer
//# sourceMappingURL=index.js.map