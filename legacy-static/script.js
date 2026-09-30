document.getElementById('contact-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const serviceID = 'YOUR_SERVICE_ID';
    const templateID = 'YOUR_TEMPLATE_ID';

    emailjs.sendForm(serviceID, templateID, this)
        .then(() => {
            alert('Email sent successfully!');
        }, (err) => {
            alert('Failed to send email. Error: ' + JSON.stringify(err));
        });
});