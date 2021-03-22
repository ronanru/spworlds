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
const modal = document.getElementById('modal'), formTitle = document.getElementById('formTitle'), serverInput = document.getElementById('serverInput'), billingInput = document.getElementById('billingInput'), qiwiInputContainer = document.getElementById('qiwiInputContainer'), telInputContainer = document.getElementById('telInputContainer');
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

if (billingInput.value == 'QIWI_MYCOM')
        qiwiInputContainer.style.display = 'grid';
    else
        qiwiInputContainer.style.display = 'none';
    if (billingInput.value == 'MOBILE_FAKE')
        telInputContainer.style.display = 'grid';
    else
        telInputContainer.style.display = 'none';

const onInputChange = () => {
    if (billingInput.value == 'QIWI_MYCOM')
        qiwiInputContainer.style.display = 'grid';
    else
        qiwiInputContainer.style.display = 'none';
    if (billingInput.value == 'MOBILE_FAKE')
        telInputContainer.style.display = 'grid';
    else
        telInputContainer.style.display = 'none';
};
