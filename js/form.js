/* ============================================
   CONTACT FORM — VALIDATION & SUBMISSION
   ============================================ */

(function() {
    'use strict';

    document.addEventListener('DOMContentLoaded', function() {
        initContactForm();
    });

    function initContactForm() {
        const form = document.getElementById('contact-form');
        if (!form) return;

        const nameInput = form.querySelector('#name');
        const emailInput = form.querySelector('#email');
        const messageInput = form.querySelector('#message');
        const submitBtn = form.querySelector('#submit-btn');
        const successMsg = form.querySelector('#form-success');

        // Real-time validation
        [nameInput, emailInput, messageInput].forEach(input => {
            if (input) {
                input.addEventListener('blur', () => validateField(input));
                input.addEventListener('input', () => clearError(input));
            }
        });

        form.addEventListener('submit', async function(e) {
            e.preventDefault();

            // Validate all fields
            const isNameValid = validateField(nameInput);
            const isEmailValid = validateField(emailInput);
            const isMessageValid = validateField(messageInput);

            if (!isNameValid || !isEmailValid || !isMessageValid) {
                return;
            }

            // Honeypot check
            const honeypot = form.querySelector('[name="_gotcha"]');
            if (honeypot && honeypot.value !== '') {
                // Likely spam, pretend success
                showSuccess();
                return;
            }

            // Show loading state
            setLoading(true);

            try {
                const formData = new FormData(form);
                const response = await fetch(form.action, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                });

                if (response.ok) {
                    showSuccess();
                    form.reset();
                } else {
                    const data = await response.json();
                    if (data.errors) {
                        throw new Error(data.errors.map(e => e.message).join(', '));
                    } else {
                        throw new Error('Submission failed. Please try again or email directly.');
                    }
                }
            } catch (error) {
                showError(error.message || 'Something went wrong. Please try again.');
            } finally {
                setLoading(false);
            }
        });

        function validateField(input) {
            if (!input) return true;

            const value = input.value.trim();
            const errorEl = document.getElementById(`${input.id}-error`);
            let error = '';

            if (input.hasAttribute('required') && value === '') {
                error = 'This field is required';
            } else if (input.type === 'email' && value !== '') {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(value)) {
                    error = 'Please enter a valid email address';
                }
            } else if (input.id === 'message' && value.length < 10 && value !== '') {
                error = 'Please write a message of at least 10 characters';
            }

            if (error) {
                input.classList.add('error');
                if (errorEl) errorEl.textContent = error;
                return false;
            } else {
                input.classList.remove('error');
                if (errorEl) errorEl.textContent = '';
                return true;
            }
        }

        function clearError(input) {
            input.classList.remove('error');
            const errorEl = document.getElementById(`${input.id}-error`);
            if (errorEl) errorEl.textContent = '';
        }

        function setLoading(isLoading) {
            if (!submitBtn) return;
            const btnText = submitBtn.querySelector('.btn-text');
            const btnLoading = submitBtn.querySelector('.btn-loading');

            submitBtn.disabled = isLoading;

            if (btnText && btnLoading) {
                if (isLoading) {
                    btnText.hidden = true;
                    btnLoading.hidden = false;
                } else {
                    btnText.hidden = false;
                    btnLoading.hidden = true;
                }
            }
        }

        function showSuccess() {
            if (successMsg) {
                successMsg.hidden = false;
                successMsg.scrollIntoView({ behavior: 'smooth', block: 'center' });

                setTimeout(() => {
                    successMsg.hidden = true;
                }, 8000);
            }
        }

        function showError(message) {
            alert(message);
        }
    }

})();