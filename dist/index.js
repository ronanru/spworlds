"use strict";
var copyIp = function () {
    if ('clipboard' in navigator) {
        navigator.clipboard.writeText('mc.spworlds.ru').then(function () {
            var ipBytton = document.getElementById('ipBytton');
            ipBytton.innerText = 'Скопировано!';
            setTimeout(function () {
                ipBytton.innerText = 'IP: mc.spworlds.ru';
            }, 1000);
        });
    }
};
var modal = document.getElementById('modal'), formTitle = document.getElementById('formTitle'), serverInput = document.getElementById('serverInput');
var buy = function (server) {
    modal.style.display = 'grid';
    formTitle.innerText = "\u0412\u043E\u0439\u0442\u0438 \u043D\u0430" + ['СП', 'СПм', 'СПб'][server];
    serverInput.value = server.toString();
    setTimeout(function () { return (modal.style.opacity = '1'); }, 1);
};
window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.opacity = '0';
        setTimeout(function () { return (modal.style.display = 'none'); }, 500);
    }
};
//# sourceMappingURL=index.js.map