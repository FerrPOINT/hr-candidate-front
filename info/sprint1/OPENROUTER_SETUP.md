# Настройка OpenRouter с Claude 3.5 Sonnet

## Получение API ключа OpenRouter

1. Зарегистрируйтесь на [OpenRouter](https://openrouter.ai/)
2. Получите API ключ в разделе API Keys
3. Скопируйте ключ для использования в бэкенде

## Конфигурация для бэкенда

### 1. Переменные окружения (.env)

```bash
# OpenRouter Configuration
OPENROUTER_API_KEY=your-openrouter-api-key
OPENROUTER_MODEL=anthropic/claude-3.5-sonnet
OPENROUTER_BASE_URL=https://openrouter.ai/api/v1
OPENROUTER_MAX_TOKENS=4000
OPENROUTER_TEMPERATURE=0.7
```

### 2. Пример конфигурации в Spring Boot

```java
@Configuration
@ConfigurationProperties(prefix = "openrouter")
@Data
public class OpenRouterConfig {
    private String apiKey;
    private String model = "anthropic/claude-3.5-sonnet";
    private String baseUrl = "https://openrouter.ai/api/v1";
    private int maxTokens = 4000;
    private double temperature = 0.7;
}
```

### 3. Пример сервиса для работы с OpenRouter

```java
@Service
@Slf4j
public class OpenRouterService {
    
    @Autowired
    private OpenRouterConfig config;
    
    @Autowired
    private RestTemplate restTemplate;
    
    public String generateText(String prompt) {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setBearerAuth(config.getApiKey());
            
            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("model", config.getModel());
            requestBody.put("messages", Arrays.asList(
                Map.of("role", "user", "content", prompt)
            ));
            requestBody.put("max_tokens", config.getMaxTokens());
            requestBody.put("temperature", config.getTemperature());
            
            HttpEntity<Map<String, Object>> request = new HttpEntity<>(requestBody, headers);
            
            ResponseEntity<Map> response = restTemplate.postForEntity(
                config.getBaseUrl() + "/chat/completions",
                request,
                Map.class
            );
            
            Map<String, Object> responseBody = response.getBody();
            List<Map<String, Object>> choices = (List<Map<String, Object>>) responseBody.get("choices");
            Map<String, Object> firstChoice = choices.get(0);
            Map<String, Object> message = (Map<String, Object>) firstChoice.get("message");
            
            return (String) message.get("content");
            
        } catch (Exception e) {
            log.error("Error calling OpenRouter API", e);
            throw new RuntimeException("Failed to generate text with OpenRouter", e);
        }
    }
}
```

### 4. Использование в AI сервисах

```java
@Service
public class AIService {
    
    @Autowired
    private OpenRouterService openRouterService;
    
    public String transcribeAndFormat(String rawTranscript) {
        String prompt = String.format("""
            Отформатируй следующий текст интервью, убрав лишние слова и исправив ошибки речи.
            Не добавляй новый контент, только форматируй существующий:
            
            %s
            """, rawTranscript);
            
        return openRouterService.generateText(prompt);
    }
    
    public List<Question> generateQuestions(String positionDescription, int count) {
        String prompt = String.format("""
            Сгенерируй %d вопросов для собеседования на позицию: %s
            
            Формат ответа: JSON массив с полями:
            - text: текст вопроса
            - type: тип вопроса (technical, behavioral, general)
            - difficulty: сложность (easy, medium, hard)
            """, count, positionDescription);
            
        String response = openRouterService.generateText(prompt);
        // Парсинг JSON ответа
        return parseQuestionsFromJson(response);
    }
}
```

## Модели OpenRouter

### Доступные модели Claude:

- `anthropic/claude-3.5-sonnet` - **Рекомендуется** (быстрая, качественная)
- `anthropic/claude-3.5-haiku` - Быстрая, но менее качественная
- `anthropic/claude-3-opus` - Самая качественная, но медленная
- `anthropic/claude-3-sonnet` - Предыдущая версия

### Цены (на момент написания):

- Claude 3.5 Sonnet: $3/1M input tokens, $15/1M output tokens
- Claude 3.5 Haiku: $0.25/1M input tokens, $1.25/1M output tokens
- Claude 3 Opus: $15/1M input tokens, $75/1M output tokens

## Тестирование

### 1. Проверка подключения

```bash
curl -X POST https://openrouter.ai/api/v1/chat/completions \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "anthropic/claude-3.5-sonnet",
    "messages": [{"role": "user", "content": "Привет! Как дела?"}]
  }'
```

### 2. Мониторинг использования

- Проверяйте баланс в OpenRouter Dashboard
- Настройте алерты при превышении лимитов
- Логируйте все запросы для анализа

## Безопасность

1. **Никогда не коммитьте API ключи** в Git
2. Используйте переменные окружения
3. Ротация ключей каждые 3-6 месяцев
4. Мониторинг необычной активности 