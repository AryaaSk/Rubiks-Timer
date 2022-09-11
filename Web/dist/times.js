"use strict";
let SESSION = [];
const LoadSession = () => {
    const timesJSON = localStorage.getItem("times");
    if (timesJSON == undefined) {
        SESSION = [];
    }
    else {
        SESSION = JSON.parse(timesJSON);
    }
};
const SaveSession = () => {
    const timesJSON = JSON.stringify(SESSION);
    localStorage.setItem("times", timesJSON);
};
const table = document.getElementById("times");
const SyncSession = () => {
    let total = 0;
    for (const time of SESSION) {
        total += time;
    }
    const mean = (SESSION.length != 0) ? total / SESSION.length : 0;
    table.innerHTML = `
<tr>
    <th>Mean: ${FormatTime(Math.round(mean))}</th>
</tr>`;
    for (const time of SESSION) {
        table.innerHTML += `
<tr>
    <td>${FormatTime(time)}</td>
</tr>
        `;
    }
};
const ResetSession = () => {
    SESSION = [];
    SaveSession();
    SyncSession();
};
const AddTime = (ms) => {
    SESSION.push(ms);
    SaveSession();
    SyncSession();
};
const Main = () => {
    document.getElementById("resetSession").onclick = ResetSession;
    LoadSession();
    SyncSession();
};
Main();
