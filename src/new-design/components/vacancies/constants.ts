export const vacanciesMockData = [
  {
    id: "frontend-1",
    title: "Frontend разработчик",
    department: "Разработка",
    manager: "M",
    candidateCount: 26,
    status: "active" as const,
  },
  {
    id: "frontend-2",
    title: "Frontend разработчик",
    manager: "M",
    candidateCount: 26,
    status: "paused" as const,
  },
  {
    id: "frontend-3",
    title: "Frontend разработчик",
    manager: "M",
    candidateCount: 26,
    status: "active" as const,
  },
  {
    id: "frontend-4",
    title: "Frontend разработчик",
    department: "Разработка",
    manager: "M",
    candidateCount: 26,
    status: "archived" as const,
  },
  {
    id: "frontend-5",
    title: "Frontend разработчик",
    manager: "M",
    candidateCount: 26,
    status: "active" as const,
  },
  {
    id: "backend-1",
    title: "Backend разработчик",
    department: "Разработка",
    manager: "A",
    candidateCount: 18,
    status: "active" as const,
  },
  {
    id: "designer-1",
    title: "UX/UI Дизайнер",
    department: "Дизайн",
    manager: "D",
    candidateCount: 12,
    status: "paused" as const,
  },
  {
    id: "devops-1",
    title: "DevOps инженер",
    department: "Инфраструктура",
    manager: "S",
    candidateCount: 8,
    status: "active" as const,
  },
  {
    id: "qa-1",
    title: "QA инженер",
    department: "Тестирование",
    manager: "T",
    candidateCount: 15,
    status: "archived" as const,
  },
];

export const candidatesMockData = [
  {
    id: "viktor",
    name: "Виктор Хомула",
    email: "torvik331@gmail.com",
    rating: 7.0,
    status: "screening",
    completed: "19.07.2025",
    selected: false,
  },
  {
    id: "james",
    name: "James Brown",
    email: "james@alignui.com",
    rating: 6.5,
    status: "screening",
    completed: "17.07.2025",
    selected: true,
  },
  {
    id: "sophia",
    name: "Sophia Williams",
    email: "sophia@alignui.com",
    rating: 7.5,
    status: "screening",
    completed: "17.07.2025",
    selected: false,
  },
  {
    id: "arthur",
    name: "Arthur Taylor",
    email: "arthur@alignui.com",
    rating: 8.5,
    status: "screening",
    completed: "17.07.2025",
    selected: false,
  },
  {
    id: "emma",
    name: "Emma Wright",
    email: "emma@alignui.com",
    rating: 4.0,
    status: "screening",
    completed: "17.07.2025",
    selected: false,
  },
];

export const defaultTopics = ["HTML/CSS", "Node.JS", "React"];

export const timeOptions = [
  "1 мин",
  "1 мин 30 сек",
  "2 мин",
  "2 мин 30 сек",
  "3 мин",
  "3 мин 30 сек",
  "4 мин",
  "5 мин",
];

export const levelOptions = ["Junior", "Middle", "Senior", "Lead"];

export const questionCountOptions = [5, 10, 15];

export const questionTypeOptions = [
  "В основном хард-скиллы",
  "В основном софт-скиллы",
  "Смешанный тип",
];

export const defaultSortFieldsOrder = [
  { key: "name", active: true, direction: "asc" as "asc" | "desc" },
  { key: "email", active: false, direction: "asc" as "asc" | "desc" },
  { key: "rating", active: false, direction: "desc" as "asc" | "desc" },
  { key: "status", active: false, direction: "asc" as "asc" | "desc" },
  { key: "completed", active: false, direction: "asc" as "asc" | "desc" },
];

export const sortFieldLabels = {
  name: "Имя кандидата",
  email: "Email",
  rating: "Рейтинг",
  status: "Статус",
  completed: "Дата завершения"
};

export const itemsPerPage = 5; 