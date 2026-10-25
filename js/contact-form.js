(function () {
    // Reemplazar con las claves reales de tu cuenta en emailjs.com (Account > API Keys, Email Services, Email Templates)
    const EMAILJS_PUBLIC_KEY = 'u2RCygT3q9PjYjmjG';
    const EMAILJS_SERVICE_ID = 'service_8uvfg17';
    const EMAILJS_TEMPLATE_ID = 'template_1sgdiu4';

    emailjs.init(EMAILJS_PUBLIC_KEY);

    const form = document.getElementById('contact-form');
    const status = document.getElementById('form-status');
    const submitBtn = form.querySelector('.form-submit');

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        submitBtn.disabled = true;
        submitBtn.textContent = 'Enviando...';
        status.textContent = '';
        status.className = 'form-status';

        emailjs.sendForm(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, form)
            .then(() => {
                status.textContent = '¡Mensaje enviado! Te responderé a la brevedad.';
                status.classList.add('success');
                form.reset();
            })
            .catch(() => {
                status.textContent = 'Hubo un error al enviar. Probá de nuevo o escribinos por WhatsApp.';
                status.classList.add('error');
            })
            .finally(() => {
                submitBtn.disabled = false;
                submitBtn.textContent = 'Enviar Mensaje';
            });
    });
})();
