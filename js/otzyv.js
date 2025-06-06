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

    // Отзывы
    const reviewForm = document.getElementById('review-form');
    const reviewsGrid = document.querySelector('.reviews-grid');
    const stars = document.querySelectorAll('.star');
    const ratingInput = document.getElementById('rating');
    
    // Примеры отзывов (в реальном приложении можно загружать с сервера)
    const sampleReviews = [
        {
            name: "Иван Петров",
            service: "Замена масла и фильтров",
            rating: 5,
            comment: "Отличный сервис! Быстро и качественно заменили масло. Персонал вежливый, цены адекватные. Рекомендую!",
            date: "15.05.2023"
        },
        {
            name: "Анна Смирнова",
            service: "Химчистка салона",
            rating: 4,
            comment: "Сделали химчистку салона, результат хороший, но пришлось ждать дольше обещанного. В целом довольна.",
            date: "22.04.2023"
        },
        {
            name: "Дмитрий Иванов",
            service: "Ремонт двигателя",
            rating: 5,
            comment: "Спасибо за качественный ремонт! Двигатель работает как новый. Особенно понравилось детальное объяснение всех работ.",
            date: "10.03.2023"
        }
    ];
    
    // Инициализация звезд рейтинга
    stars.forEach(star => {
        star.addEventListener('click', function() {
            const value = parseInt(this.dataset.value);
            ratingInput.value = value;
            
            // Обновляем визуальное отображение звезд
            stars.forEach(s => {
                s.classList.toggle('active', parseInt(s.dataset.value) <= value);
            });
        });
    });
    
    // Загрузка отзывов
    function loadReviews() {
        reviewsGrid.innerHTML = '';
        
        const reviews = JSON.parse(localStorage.getItem('reviews')) || sampleReviews;
        
        if (reviews.length === 0) {
            reviewsGrid.innerHTML = '<p class="no-reviews">Пока нет отзывов. Будьте первым!</p>';
            return;
        }
        
        reviews.forEach(review => {
            const reviewCard = document.createElement('div');
            reviewCard.className = 'review-card';
            
            // Создаем звезды рейтинга
            let starsHtml = '';
            for (let i = 1; i <= 5; i++) {
                starsHtml += i <= review.rating ? '★' : '☆';
            }
            
            reviewCard.innerHTML = `
                <h3>${review.name}</h3>
                <div class="service">Услуга: ${review.service}</div>
                <div class="rating" title="${review.rating} из 5">${starsHtml}</div>
                <div class="comment">${review.comment}</div>
                <div class="date">${review.date}</div>
            `;
            
            reviewsGrid.appendChild(reviewCard);
        });
    }
    
    // Обработка формы
    reviewForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const name = document.getElementById('name').value;
        const service = document.getElementById('service').value;
        const rating = parseInt(ratingInput.value);
        const comment = document.getElementById('comment').value;
        
        if (!name || !service || !rating || !comment) {
            alert('Пожалуйста, заполните все поля формы!');
            return;
        }
        
        const newReview = {
            name,
            service,
            rating,
            comment,
            date: new Date().toLocaleDateString('ru-RU')
        };
        
        // Сохраняем отзыв
        const reviews = JSON.parse(localStorage.getItem('reviews')) || sampleReviews;
        reviews.unshift(newReview); // Добавляем новый отзыв в начало
        localStorage.setItem('reviews', JSON.stringify(reviews));
        
        // Обновляем список отзывов
        loadReviews();
        
        // Сбрасываем форму
        reviewForm.reset();
        stars.forEach(star => star.classList.remove('active'));
        ratingInput.value = '';
        
        alert('Спасибо за ваш отзыв!');
    });
    
    // Инициализация
    loadReviews();
});