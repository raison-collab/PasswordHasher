async function computeSHA256(message) {
    const encoder = new TextEncoder();
    const data = encoder.encode(message);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
  }
  
  //первую букву делаем заглавной, затем добавляем точку в конце
  function formatHash(hash) {
    const arr = hash.split('');
    for (let i = 0; i < arr.length; i++) {
      if (/[a-f]/i.test(arr[i])) {
        arr[i] = arr[i].toUpperCase();
        break;
      }
    }
    return arr.join('') + '.';
  }
  
  // Загрузка сохранённого пароля
  function loadSavedPassword() {
    return localStorage.getItem('lastPassword') || '';
  }
  
  // Сохраняем пароль
  function savePassword(password) {
    localStorage.setItem('lastPassword', password);
  }
  
  // Копируем в буфер обмена
  function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
      const copyMsg = document.getElementById('copyMsg');
      copyMsg.style.display = 'block';
      setTimeout(() => {
        copyMsg.style.display = 'none';
      }, 1500);
    });
  }
  
  document.addEventListener('DOMContentLoaded', () => {
    const passwordInput = document.getElementById('passwordInput');
    const generateBtn = document.getElementById('generateBtn');
    const hashOutput = document.getElementById('hashOutput');
    const copyBtn = document.getElementById('copyBtn');
  
    passwordInput.value = loadSavedPassword();
  
    generateBtn.addEventListener('click', async () => {
      const password = passwordInput.value.trim();
      if (!password) {
        hashOutput.textContent = 'Введите пароль.';
        return;
      }
  
      savePassword(password);
      hashOutput.textContent = 'Вычисление...';
  
      try {
        const rawHash = await computeSHA256(password);
        const finalHash = formatHash(rawHash);
        hashOutput.textContent = finalHash;
      } catch (err) {
        hashOutput.textContent = 'Ошибка при вычислении.';
        console.error(err);
      }
    });
  
    copyBtn.addEventListener('click', () => {
      const text = hashOutput.textContent.trim();
      if (text) {
        copyToClipboard(text);
      }
    });
  });
  