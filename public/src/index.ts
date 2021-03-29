const copyIp = (): void => {
  if ('clipboard' in navigator) {
    navigator.clipboard.writeText('mc.spworlds.ru').then(() => {
      const ipBytton = document.getElementById('ipBytton') as HTMLButtonElement;
      ipBytton.innerText = 'Скопировано!';
      setTimeout(() => {
        ipBytton.innerText = 'IP: mc.spworlds.ru';
      }, 1000);
    });
  }
};

const modal = document.getElementById('modal') as HTMLElement,
  formTitle = document.getElementById('formTitle') as HTMLElement,
  serverInput = document.getElementById('serverInput') as HTMLInputElement,
  billingInput = document.getElementById('billingInput') as HTMLInputElement,
  qiwiInputContainer = document.getElementById('qiwiInputContainer') as HTMLElement,
  telInputContainer = document.getElementById('telInputContainer') as HTMLElement;

const buy = (server: number): void => {
  modal.style.display = 'grid';
  formTitle.innerText = `Войти на ${['СП', 'СПм', 'СПб'][server]}`;
  serverInput.value = server.toString();
  setTimeout(() => (modal.style.opacity = '1'), 1);
};

window.onclick = (event: Event) => {
  if (event.target == modal) {
    modal.style.opacity = '0';
    setTimeout(() => (modal.style.display = 'none'), 500);
  }
};

const onInputChange = () => {
  if (billingInput.value == 'QIWI_MYCOM') qiwiInputContainer.style.display = 'grid';
  else qiwiInputContainer.style.display = 'none';
  if (billingInput.value == 'MOBILE_FAKE') telInputContainer.style.display = 'grid';
  else telInputContainer.style.display = 'none';
};

onInputChange();
