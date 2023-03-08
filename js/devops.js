/*
Lewis Wood
*/
"use strict";
class DevOps {
    constructor() {
        throw new Error("Static class you cannot create an instance");
    }
    ; // constructor
    ;
    static initialize() {
        const dc = DevOps.controls;
        dc.root = document.querySelector("#devOpsRoot");
        if (!(dc.root))
            DevOps.createRoot();
        else {
            const dr = dc.root;
            dc.style = dr.querySelector("style");
            ;
            if (!(dc.style)) {
                DevOps.createStyle();
            }
            ;
            dc.container = dr.querySelector("#devOpsContainer");
            if (!(dc.container)) {
                DevOps.createContainer();
            }
            else {
                DevOps.initLog(dr);
            }
            ; // devOps Containter
        }
        ; //devOpsRoot 
        DevOps.initNotes(dc.root);
        let b = document.body.querySelector("#devOpsHotKeysButton");
        if (!(b)) {
            b = document.createElement("button");
            b.setAttribute("style", "position: absolute;left: 10000px ;width: 1px;");
            b.setAttribute("id", "devOpsHotKeysButton");
            b.innerText = "GoTo DevOps Console";
            dc.hotKeysButton = b;
            const body = document.body;
            body.insertBefore(b, body.children[0]);
        }
        dc.hotKeysButton = b;
        if (b)
            b.onclick = (e) => { DevOps.hotKeyButtonAction(e); };
        window.addEventListener("keyup", (e) => { DevOps.keyHandler(e); });
        DevOps.setActiveActions();
        DevOps.toggleMode(DevOps.mode, true);
        DevOps.log("DevOps Loaded successfully.");
    }
    ; // Initialize()}
    static initLog(root) {
        try {
            const dc = DevOps.controls;
            dc.logContainer = root.querySelector("#devOpsLogSection");
            if (!(dc.logContainer)) {
                DevOps.createLogSection();
            }
            else {
                if (!(dc.header))
                    dc.header = root.querySelector("#devOpsHeading");
                if (!(dc.header)) {
                    DevOps.createLogHeader();
                }
                if (!(dc.log))
                    dc.log = root.querySelector("#devOpsLog");
                if (!(dc.log)) {
                    DevOps.createLog();
                }
                ;
                if (!(dc.clearButton))
                    dc.clearButton = root.querySelector("#devOpsClear");
                if (!(dc.clearButton)) {
                    DevOps.createClearLog();
                }
                ;
            }
            ; // if containter
            if (dc.clearButton)
                dc.clearButton.onclick = () => { DevOps.clearLog(); };
        }
        catch (e) {
            console.log('DevOps.initLog error: ' + e.message);
        }
        ; //  catch
    }
    ; // initLog 
    static initNotes(root) {
        try {
            if (DevOps.notes) {
                const dc = DevOps.controls;
                if (!(dc.notesContainer))
                    dc.notesContainer = root.querySelector("#devOpsNotesContainer");
                if (!(dc.notesContainer))
                    DevOps.createNoteContainer();
                else {
                    dc.notesHeader = dc.notesContainer.querySelector("#devOpsNotesHeader");
                    if (dc.notesHeader)
                        dc.notesHeader.setAttribute("tabindex", "0"); // allows focus from button
                    dc.notesList = root.querySelector("#devOpsNotesList");
                }
                ; // if notes containe
            }
            else {
                DevOps.actions.notes.Toggle = false;
            }
            ; // if notes enabled
        }
        catch (e) {
            console.log('DevOps.initNotes error: ' + e.message);
        }
        ; //  catch
    }
    ; // initNotes 
    static setHotKeysButtonCaption() {
        var _a;
        try {
            let caption = "Go to Dev Console";
            if (DevOps.controls.hotKeysButton) {
                if (DevOps.modes[DevOps.mode] === "disabled")
                    caption = "Enable Dev Console";
                else if (DevOps.activeActions.length <= 0)
                    caption = "Enable Dev Hot Keys";
                if (((_a = DevOps.controls.hotKeysButton) === null || _a === void 0 ? void 0 : _a.innerText) != caption)
                    DevOps.controls.hotKeysButton.innerText = caption;
            }
            ;
        }
        catch (e) {
            DevOps.log("setHotKeyButtonCapation error: " + e.message);
        }
        ;
    } // setHotKeyButtonCaption
    static hotKeyButtonAction(e) {
        try {
            const dc = DevOps.controls;
            if (DevOps.modes[DevOps.mode] === "disabled") {
                DevOps.toggleMode();
            }
            else {
                DevOps.setActiveActions();
                if (DevOps.activeActions.length > 0)
                    DevOps.log("Hot Keys Enabled");
            }
            if (dc.header) {
                dc.header.focus();
            }
        }
        catch (e) {
            DevOps.log('DevOps.hotKeyButtonAction error: ' + e.message);
        }
        ; //  catch
    }
    ; // hotKeyButtonAction
    static disableNotes() {
        var _a;
        DevOps.notes = false;
        DevOps.actions.notes.Toggle = false;
        if (DevOps.controls.notesContainer) {
            const nc = DevOps.controls.notesContainer;
            (_a = nc.parentNode) === null || _a === void 0 ? void 0 : _a.removeChild(nc);
        }
        DevOps.log("Notes deleted. Console full width.");
    }
    static logError(message) { DevOps.log(message); }
    ; // DevOps.logError
    static log(message) {
        console.log("HelpLog: ", message);
        try {
            const hl = DevOps.controls.log;
            if (hl) {
                const cur = hl.innerHTML;
                hl.innerHTML = message + "<br/>" + cur;
            } // if 
        } // try
        catch (e) {
            console.log("HelpLog Error: ", e.message);
            alert(e.message);
        }
        ;
    }
    ; // log(message)
    static keyHandler(e) {
        const matchKey = (e, k) => {
            return ((e.key === k.key) && (e.altKey === k.alt) && (e.ctrlKey === k.ctrl) && (e.shiftKey === k.shift));
        };
        DevOps.activeActions.forEach((k) => {
            const a = DevOps.actions[k];
            if (matchKey(e, a.key)) {
                switch (k) {
                    case "clear":
                        DevOps.clearLog();
                        break;
                    case "mode":
                        DevOps.toggleMode();
                        break;
                    case "share":
                        DevOps.shareLog();
                        break;
                    case "keys":
                        DevOps.disableKeys();
                        break;
                    case "notes":
                        DevOps.disableNotes();
                        break;
                }
            }
        });
    }
    ;
    static disableKeys() {
        DevOps.activeActions = [];
        DevOps.log("Dev HotKeys disabled. Click enable button at very top to re-enable.");
        DevOps.setHotKeysButtonCaption();
    }
    static toggleMode(setMode, silent = false) {
        try {
            DevOps.mode = (!(setMode) ? DevOps.mode + 1 : setMode);
            if ((DevOps.mode > (DevOps.modes.length - 1)) || (DevOps.mode < 0))
                DevOps.mode = 0;
            const mode = ((DevOps.modes.length > 0) ? DevOps.modes[DevOps.mode] : 'empty');
            const act = DevOps.actions.mode;
            if (!(act.statusMessage))
                act.statusMessage = DevOps.log;
            const c = DevOps.controls.container;
            switch (mode) {
                case "empty":
                    if (!silent)
                        DevOps.log("Empty DevOps.modes: adding mode visible");
                    DevOps.modes.push("visible");
                case "visible":
                    if (!silent)
                        act.statusMessage(`Enable Log: Visible`);
                    if (c) {
                        c.classList.remove("devOpsNotVisible");
                        c.setAttribute("aria-hidden", "false");
                    }
                    break;
                case "invisible":
                    if (!silent)
                        act.statusMessage(`Log not visible or accessible without screen reader`);
                    if (c) {
                        c.classList.add("devOpsNotVisible");
                        c.setAttribute("aria-hidden", "false");
                    }
                    break;
                case "disabled":
                    act.statusMessage(`Log disabled for everyone. Press alt plush shift + D to bring it back.`);
                    setTimeout(() => {
                        if (c) {
                            c.classList.add("devOpsNotVisible");
                            c.setAttribute("aria-hidden", "true");
                        }
                    }, 350);
                    break;
                default:
                    DevOps.log(`Invalid mode, ignoring value:${mode}  #${DevOps.mode}}`);
            }
            ; // switch
            DevOps.setHotKeysButtonCaption();
        }
        catch (e) {
            DevOps.log("DevOps.toggleMode error: " + e.message);
        }
        ; // catch
    }
    ; // toggleMode
    static setAction(actionName = "mode", key, statusMessage, toggle = true) {
        try {
            const act = DevOps.actions[actionName];
            act.Toggle = toggle;
            if (key)
                act.key = key;
            if (statusMessage)
                act.statusMessage = statusMessage;
            DevOps.setActiveActions();
        }
        catch (e) {
            DevOps.log('DevOps.setAction error: ' + e.message);
        }
        ; //  catch
    }
    ; // setAction
    static setActiveActions() {
        DevOps.activeActions = [];
        if (DevOps.actions.mode.Toggle) {
            DevOps.activeActions.push("mode");
        }
        ;
        if (DevOps.actions.clear.Toggle) {
            DevOps.activeActions.push("clear");
        }
        ;
        if (DevOps.actions.log.Toggle) {
            DevOps.activeActions.push("log");
        }
        ;
        if (DevOps.actions.share.Toggle) {
            DevOps.activeActions.push("share");
        }
        ;
        if (DevOps.actions.keys.Toggle) {
            DevOps.activeActions.push("keys");
        }
        ;
        if (DevOps.actions.notes.Toggle) {
            DevOps.activeActions.push("notes");
        }
        ;
        DevOps.setHotKeysButtonCaption();
    }
    static clearLog() {
        try {
            const hl = DevOps.controls.log;
            if (hl) {
                hl.innerHTML = "Log Cleared";
            }
            ; // if hl
        }
        catch (e) {
            console.log("DevOps.clearLog error: " + e.message);
        }
        ; // catch
    }
    ; // clearLog
    static shareLog() {
        try {
            const hl = DevOps.controls.log;
            if (hl) {
                const act = DevOps.actions.share;
                if (act.statusMessage === null)
                    act.statusMessage = DevOps.log;
                const txt = hl.innerHTML.split("<br>");
                navigator.clipboard.writeText(txt.join("\n"));
                const sm = act.statusMessage;
                console.log("statusmessage: ", sm);
                if (sm) {
                    sm("Log shared to clipboard.");
                    DevOps.log("copied to clipboard. should be there twice" + sm);
                }
                else {
                    DevOps.log("no sm. copied to clipboard.");
                }
                ;
            }
        }
        catch (e) {
            DevOps.log("DevOps.share error: " + e.message);
        }
        ; // catch
    }
    ; // share
    static newKey(key, alt = true, ctrl = false, shift = true) {
        const k = { key, alt, shift, ctrl };
        return k;
    }
    static createRoot() {
        const dc = DevOps.controls;
        const dr = document.createElement("div");
        dc.root = dr;
        document.body.appendChild(dr);
        dr.setAttribute("id", "devOpsRoot");
        dr.setAttribute("style", "width: 100%;display : block;");
        DevOps.createStyle();
        DevOps.createContainer();
    }
    static createStyle() {
        var _a;
        const dc = DevOps.controls;
        dc.style = document.createElement("style");
        (_a = dc.root) === null || _a === void 0 ? void 0 : _a.appendChild(dc.style);
        dc.style.innerText = `
  .devOpsNotVisible {
    transform: scale(0,0);
  z-index: 0;
  position: absolute;
  top: -10;
  left: -10;
}
.devOpsContainer {
    display : flex;
    flex-direction: row;
    border-width: 3px;
    border-style: outset;
    flex-direction: row;
margin: 5px;
padding: 5px;
background-color: #000080; 
color: yellow;

}
#devOpsLogSection {
    flex-direction: column;
    justify-self: left;;
}
.devOpsNoteContainer {
    display: flex;
    justify-self: right;
width : 600px;
font-size:larger;
border: solid;
}
  `;
    }
    static createContainer() {
        var _a;
        const dc = DevOps.controls;
        const c = document.createElement("div");
        dc.container = c;
        c.setAttribute("id", "devOpsContainer");
        c.setAttribute("class", "devOpsContainer");
        c.setAttribute("aria-hidden", "false");
        (_a = dc.root) === null || _a === void 0 ? void 0 : _a.appendChild(c);
        ;
        DevOps.createLogSection();
    }
    static createLogSection() {
        var _a;
        const dc = DevOps.controls;
        const l = document.createElement("div");
        l.setAttribute("id", "devOpsLogSection");
        dc.logContainer = l;
        (_a = dc.container) === null || _a === void 0 ? void 0 : _a.appendChild(l);
        DevOps.createLogHeader();
        DevOps.createLog();
        DevOps.createClearLog();
    }
    static createLogHeader() {
        var _a;
        const dc = DevOps.controls;
        const h = document.createElement("h5");
        (_a = dc.logContainer) === null || _a === void 0 ? void 0 : _a.appendChild(h);
        dc.header = h;
        h.innerText = "DevOps Console";
        h.setAttribute("id", "devOpsHeading");
        h.setAttribute("tabindex", "0");
    }
    static createLog() {
        var _a;
        const dc = DevOps.controls;
        const l = document.createElement("p");
        l.setAttribute("aria-live", "assertive");
        l.innerText = "";
        l.setAttribute("id", "devOpsLog");
        (_a = dc.logContainer) === null || _a === void 0 ? void 0 : _a.appendChild(l);
        dc.log = l;
    }
    static createClearLog() {
        var _a;
        const dc = DevOps.controls;
        const b = document.createElement("button");
        (_a = dc.logContainer) === null || _a === void 0 ? void 0 : _a.appendChild(b);
        dc.clearButton = b;
        b.setAttribute("type", "button");
        b.innerText = "Clear Console";
        b.setAttribute("id", "devOpsClear");
    }
    static createNoteContainer() {
        var _a;
        const dc = DevOps.controls;
        const n = document.createElement("div");
        (_a = dc.container) === null || _a === void 0 ? void 0 : _a.appendChild(n);
        dc.notesContainer = n;
        n.setAttribute("id", "devOpsNotesContainer");
        n.setAttribute("class", "devOpsNoteContainer");
        const h = document.createElement("h5");
        n.appendChild(h);
        h.innerText = "Developer Notebook";
        h.setAttribute("id", "devOpsNotesHeader");
        h.setAttribute("tabindex", "0");
        dc.notesHeader = h;
        const l = document.createElement("ul");
        n.appendChild(l);
        l.setAttribute("id", "devOpsNotesList");
        dc.notesList = l;
        DevOps.addNote("Alt + shift + D  -  Toggle Developer Console ");
        DevOps.addNote("Alt + shift + C -  Clear Developer Console");
        DevOps.addNote("Alt + shift + S  -  Share Developer Console");
        DevOps.addNote("Alt + shift + K  -  Disable all dev hot keys. Top button will allow you to re-enable.");
        DevOps.addNote("Alt + shift + N  -  Delete ths notes section. Makes console full width.");
    }
    static addNote(note) {
        const n = DevOps.controls.notesList;
        if (n) {
            const l = document.createElement("li");
            l.innerText = note;
            n.appendChild(l);
        }
        else
            DevOps.log("NoteList does not exist. Note not added.");
    }
}
DevOps.mode = 1;
DevOps.modes = ["disabled", "visible", "invisible"]; // determines mode values and order 
DevOps.notes = true; // Wether or not to add a developers Notes and section
DevOps.controls = {
    notesContainer: null,
}; // Controls
DevOps.actions = { mode: { "Toggle": true, "key": DevOps.newKey("D") },
    log: { "Toggle": true, "key": DevOps.newKey("L") },
    clear: { "Toggle": true, "key": DevOps.newKey("C") },
    share: { "Toggle": true, "key": DevOps.newKey("S") },
    keys: { "Toggle": true, "key": DevOps.newKey("K") },
    notes: { "Toggle": true, "key": DevOps.newKey("N") } };
DevOps.activeActions = [];
(() => {
    DevOps.initialize();
})();
; //  class devOps
//# sourceMappingURL=devops.js.map