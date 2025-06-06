document.addEventListener('DOMContentLoaded', function() {
    // Тема
    const themeToggle = document.getElementById('theme-toggle');
    const currentTheme = localStorage.getItem('theme') || 
                        (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    
    if (currentTheme === 'dark') {
        document.body.classList.add('dark-theme');
    }
    
    themeToggle.addEventListener('click', function() {
        document.body.classList.toggle('dark-theme');
        const theme = document.body.classList.contains('dark-theme') ? 'dark' : 'light';
        localStorage.setItem('theme', theme);
    });
    
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
        const newTheme = e.matches ? 'dark' : 'light';
        if (newTheme === 'dark') {
            document.body.classList.add('dark-theme');
        } else {
            document.body.classList.remove('dark-theme');
        }
        localStorage.setItem('theme', newTheme);
    });

    // Калькулятор
    const checkboxes = document.querySelectorAll('.service-option input[type="checkbox"]');
    const selectedServicesList = document.getElementById('selected-services-list');
    const totalAmountElement = document.getElementById('total-amount');
    const resetBtn = document.getElementById('reset-btn');

    let totalAmount = 0;
    const selectedServices = [];

    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const serviceName = this.nextElementSibling.textContent;
            const servicePrice = parseInt(this.dataset.price);

            if (this.checked) {
                // Добавляем услугу
                selectedServices.push({
                    name: serviceName,
                    price: servicePrice
                });
                totalAmount += servicePrice;
            } else {
                // Удаляем услугу
                const index = selectedServices.findIndex(service => service.name === serviceName);
                if (index !== -1) {
                    totalAmount -= selectedServices[index].price;
                    selectedServices.splice(index, 1);
                }
            }

            updateSelectedServicesList();
            updateTotalAmount();
        });
    });

    resetBtn.addEventListener('click', function() {
        // Сбрасываем все чекбоксы
        checkboxes.forEach(checkbox => {
            checkbox.checked = false;
        });
        
        // Очищаем список и общую сумму
        selectedServices.length = 0;
        totalAmount = 0;
        
        updateSelectedServicesList();
        updateTotalAmount();
    });

    function updateSelectedServicesList() {
        selectedServicesList.innerHTML = '';
        
        if (selectedServices.length === 0) {
            selectedServicesList.innerHTML = '<li>Нет выбранных услуг</li>';
            return;
        }
        
        selectedServices.forEach(service => {
            const li = document.createElement('li');
            li.textContent = `${service.name}`;
            selectedServicesList.appendChild(li);
        });
    }

    function updateTotalAmount() {
        totalAmountElement.textContent = `${totalAmount.toLocaleString('ru-RU')} ₽`;
    }

    // Инициализация
    updateSelectedServicesList();
    updateTotalAmount();
});