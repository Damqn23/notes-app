# Notes App

Това е уеб апликация за управление на записки (CRUD), разработена с **Django** (backend) и **React** (frontend). Приложението позволява на потребителите да се регистрират, да влизат чрез JWT автентикация и да създават, четат, редактират и изтриват записки.

## Изисквания

- **Python** 3.7+
- **Node.js** (v14 или по-нова версия)
- **npm** (v6+; при проблеми с peer dependencies използвайте флага `--legacy-peer-deps`)
- **Git**

## Инструкции за локална инсталация и стартиране

1. **Клонирайте репозиториото и отворете терминал в основната папка:**
```bash
   git clone https://github.com/Damqn23/notes_app.git
   cd notes_app


2. Backend (Django):

   python -m venv venv            # Създаване на виртуална среда (Windows: python -m venv venv, за Linux/Mac: python3 -m venv venv)
   venv\Scripts\activate          # За Windows (за Linux/Mac: source venv/bin/activate)
   cd notes_backend
   pip install django djangorestframework djangorestframework-simplejwt django-cors-headers
   python manage.py makemigrations
   python manage.py migrate
   python manage.py runserver

3. Frontend (React):

   cd ../notes_frontend
   npm install                # Ако срещате проблеми с peer dependencies, използвайте: npm install --legacy-peer-deps
   npm start
