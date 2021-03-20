"use strict";
const copyIp = () => {
    if ('clipboard' in navigator) {
        navigator.clipboard.writeText('mc.spworlds.ru').then(() => {
            const ipBytton = document.getElementById('ipBytton');
            ipBytton.innerText = 'Скопировано!';
            setTimeout(() => {
                ipBytton.innerText = 'IP: mc.spworlds.ru';
            }, 1000);
        });
    }
};
const modal = document.getElementById('modal'), formTitle = document.getElementById('formTitle'), serverInput = document.getElementById('serverInput');
const buy = (server) => {
    modal.style.display = 'grid';
    formTitle.innerText = `Войти на ${['СП', 'СПм', 'СПб'][server]}`;
    serverInput.value = server.toString();
    setTimeout(() => (modal.style.opacity = '1'), 1);
};
window.onclick = (event) => {
    if (event.target == modal) {
        modal.style.opacity = '0';
        setTimeout(() => (modal.style.display = 'none'), 500);
    }
};
//# sourceMappingURL=index.js.map