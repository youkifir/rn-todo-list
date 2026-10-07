# 📱 Todo App 3.0 — Real-Time Todo List (React Native + Expo Router + Convex)

Сучасний мобільний додаток для управління завданнями, побудований на **React Native**, **Expo Router** та облачному бекенді **Convex**. Додаток підтримує автоматичну Real-Time синхронізацію даних між пристроями, локальне збереження темного/світлого оформлення та аналітику продуктивності на стороні сервера.

---

## 📸 Скріншоти та Демонстрація

<div align="center">
  <h3>📱 Інтерфейс додатка</h3>
  
  <!-- Замініть посилання на свої фото/скріншоти -->
 <img width="1919" height="943" alt="изображение" src="https://github.com/user-attachments/assets/ce81350f-29b9-4441-b73a-b0991d45ac6a" />
 <img width="1919" height="947" alt="изображение" src="https://github.com/user-attachments/assets/3c10215b-fbec-40d9-ad2e-bae11a1a9311" />
 <img width="1919" height="945" alt="изображение" src="https://github.com/user-attachments/assets/838da42d-2151-4da2-af21-e698afb80397" />
</div>

<br />

---

## ✨ Основні можливості

- **🚀 Real-Time Синхронізація (Convex):** Будь-які зміни (додавання, редагування, статус виконання, видалення) миттєво відображаються на всіх підключених пристроях без ручного оновлення.
- **📊 Серверна Аналітика:** Автоматичний розрахунок продуктивності (всього, в процесі, виконано, % прогресу) безпосередньо через бекенд-запити Convex (`getStats`).
- **📝 Повний CRUD & Масове очищення:**
  - Створення завдань із валідацією порожніх рядків.
  - Перемикання статусу та інлайн-редагування тексту.
  - Масове видалення виконаних завдань або повне очищення бази даних з безпечним підтвердженням.
- **🎨 Перемикання тем (Light / Dark):** Підтримка світлої та темної теми із збереженням налаштувань у пам'яті пристрою через `AsyncStorage` та `ThemeContext`.
- **📂 Файловий роутинг:** Побудовано на `Expo Router` із розділенням на вкладки (`app/(tabs)/`).

---

## 🛠 Технологічний стек

* **Frontend:** React Native, Expo, Expo Router, TypeScript
* **UI & Стилі:** React Native StyleSheet, Expo Vector Icons (`@expo/vector-icons`), Safe Area Context
* **Backend & Database:** Convex (Cloud Reactive Database, TypeScript Server Functions)
* **Локальне збереження:** React Native Async Storage (для тем)

---

## 📁 Структура проєкту

```text
rn-todo-list/
├── app/
│   ├── (tabs)/
│   │   ├── _layout.tsx        # Конфігурація таб-бару
│   │   ├── index.tsx          # 📝 Вкладка 1: Список завдань (useQuery, useMutation)
│   │   ├── stats.tsx          # 📊 Вкладка 2: Статистика (useQuery)
│   │   └── settings.tsx       # ⚙️ Вкладка 3: Налаштування теми та масового очищення
│   └── _layout.tsx            # Кореневий макет (ConvexProvider + ThemeProvider)
├── components/
│   ├── Header.tsx             # Заголовок та лічильник
│   ├── TodoForm.tsx           # Форма створення нового завдання
│   ├── TodoItem.tsx           # Окремий елемент завдання
│   └── TodoList.tsx           # Список FlatList із лоадером
├── context/
│   └── ThemeContext.tsx       # Контекст тем (Light/Dark + AsyncStorage)
├── convex/                    # 🚀 Хмарний бекенд Convex
│   ├── schema.ts              # Схема бази даних (таблиця todos + індекси)
│   └── todos.ts               # Серверні Queries та Mutations
└── .env                       # Змінні оточення (EXPO_PUBLIC_CONVEX_URL)
