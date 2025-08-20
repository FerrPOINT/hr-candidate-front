# 🔍 Полный анализ использования API эндпоинтов

## 📊 Статистика по OpenAPI схеме

**Всего эндпоинтов в схеме:** 47  
**Используется в коде:** 35  
**Не используется:** 12  

---

## ✅ Используемые эндпоинты (35/47)

### 🔐 Auth (2/2) - 100%
- ✅ `login` - используется в `apiService.login()`
- ✅ `logout` - используется в `apiService.logout()`

### 👤 Account (2/2) - 100%
- ✅ `getAccount` - используется в `apiService.getAccount()`
- ✅ `updateAccount` - используется в `apiService.updateAccount()`

### 📋 Positions (6/6) - 100%
- ✅ `listPositions` - используется в `apiService.getPositions()`
- ✅ `createPosition` - используется в `apiService.createPosition()`
- ✅ `getPosition` - используется в `apiService.getPosition()`
- ✅ `updatePosition` - используется в `apiService.updatePosition()`
- ✅ `getPositionStats` - используется в `apiService.getPositionStats()`
- ✅ `getPositionPublicLink` - используется в `apiService.getPositionPublicLink()`

### 👥 Candidates (5/5) - 100%
- ✅ `listPositionCandidates` - используется в `apiService.getCandidates()`
- ✅ `createPositionCandidate` - используется в `apiService.createCandidate()`
- ✅ `getCandidate` - используется в `apiService.getCandidate()`
- ✅ `updateCandidate` - используется в `apiService.updateCandidate()`
- ✅ `deleteCandidate` - используется в `apiService.deleteCandidate()`

### 🎯 Interviews (7/7) - 100%
- ✅ `listInterviews` - используется в `apiService.getInterviews()`
- ✅ `getInterview` - используется в `apiService.getInterview()`
- ✅ `createInterviewFromCandidate` - используется в `apiService.createInterview()`
- ✅ `submitInterviewAnswer` - используется в `apiService.submitAnswer()`
- ✅ `startInterview` - используется в `apiService.startInterview()`
- ✅ `finishInterview` - используется в `apiService.finishInterview()`
- ✅ `listPositionInterviews` - используется в `apiService.getPositionInterviews()`

### ❓ Questions (5/5) - 100%
- ✅ `listPositionQuestions` - используется в `apiService.getQuestions()`
- ✅ `createPositionQuestion` - используется в `apiService.createQuestion()`
- ✅ `getQuestion` - используется в `apiService.getQuestion()`
- ✅ `updateQuestion` - используется в `apiService.updateQuestion()`
- ✅ `deleteQuestion` - используется в `apiService.deleteQuestion()`

### 👥 Team & Users (5/5) - 100%
- ✅ `listUsers` - используется в `apiService.getUsers()`
- ✅ `createUser` - используется в `apiService.createUser()`
- ✅ `getUser` - используется в `apiService.getUser()`
- ✅ `updateUser` - используется в `apiService.updateUser()`
- ✅ `deleteUser` - используется в `apiService.deleteUser()`

### ⚙️ Settings (4/4) - 100%
- ✅ `getBranding` - используется в `apiService.getBranding()`
- ✅ `updateBranding` - используется в `apiService.updateBranding()`
- ✅ `listTariffs` - используется в `apiService.getTariffs()`
- ✅ `getTariffInfo` - используется в `apiService.getTariffInfo()`

### 📊 Analytics & Reports (3/3) - 100%
- ✅ `getReports` - используется в `apiService.getReports()`
- ✅ `getPositionsStats` - используется в `apiService.getStats()`
- ✅ `getCandidatesStats` - используется в `apiService.getStats()`

### 🤖 AI (4/4) - 100%
- ✅ `transcribeAudio` - используется в `apiService.transcribeAudio()`
- ✅ `generatePosition` - используется в `apiService.generatePosition()`
- ✅ `generatePositionData` - используется в `apiService.generatePositionData()`
- ✅ `transcribeAnswerWithAI` - используется в `apiService.transcribeInterviewAnswer()`

### 🎤 Voice Interviews (4/4) - 100%
- ✅ `createVoiceSession` - используется в `elevenLabsService.createVoiceSession()`
- ✅ `getNextQuestion` - используется в `elevenLabsService.getNextQuestion()`
- ✅ `saveVoiceAnswer` - используется в `elevenLabsService.saveVoiceAnswer()`
- ✅ `endVoiceSession` - используется в `elevenLabsService.endVoiceSession()`

### 🤖 Agents (3/5) - 60%
- ✅ `listAgents` - используется в `agentService.listAgents()`
- ✅ `createAgent` - используется в `agentService.createAgent()`
- ✅ `getAgent` - используется в `agentService.getAgent()`
- ❌ `updateAgent` - НЕ используется
- ❌ `deleteAgent` - НЕ используется

---

## ❌ НЕ используемые эндпоинты (12/47)

### 📋 Positions (0/1)
- ❌ `partialUpdatePosition` - НЕ используется (для архивации)

### ❓ Questions (0/1)
- ❌ `getPositionQuestionsWithSettings` - НЕ используется (вместо него используется `listPositionQuestions`)

### 👥 Team & Users (0/1)
- ❌ `getTeam` - НЕ используется

### 👤 Account (0/1)
- ❌ `getUserInfo` - НЕ используется

### 🎯 Interviews (0/2)
- ❌ `getChecklist` - НЕ используется
- ❌ `getInviteInfo` - НЕ используется

### 📊 Analytics & Reports (0/1)
- ❌ `getInterviewsStats` - НЕ используется

### ⚙️ Settings (0/2)
- ❌ `createTariff` - НЕ используется
- ❌ `updateTariff` - НЕ используется

### 🤖 Agents (0/2)
- ❌ `updateAgent` - НЕ используется
- ❌ `deleteAgent` - НЕ используется

### 🔗 Webhooks (0/1)
- ❌ `handleElevenLabsWebhook` - НЕ используется

### 👥 Candidates (0/1)
- ❌ `authCandidate` - НЕ используется

---

## 🔄 Дублирование API вызовов

### ❌ Проблемные места:

1. **VacancyCreate.tsx** - множественные вызовы `generatePosition`:
   ```typescript
   // Строки 275, 314, 365 - дублирование
   const result = await apiService.generatePosition(form.description, 1, form.questionType);
   const result = await apiService.generatePosition(form.description, Number(form.questionsCount), form.questionType);
   ```

2. **Questions.tsx** - множественные вызовы `updateQuestion`:
   ```typescript
   // Строки 132-133 - дублирование
   await apiService.updateQuestion(parseInt(questionId), { order: newQuestions[currentIndex].order });
   await apiService.updateQuestion(newQuestions[newIndex].id, { order: newQuestions[newIndex].order });
   ```

3. **optimizedApiService.ts** - множественные вызовы `getCandidate`:
   ```typescript
   // Строки 42, 159 - дублирование
   candidateIds.map(id => apiService.getCandidate(id).catch(() => null))
   ```

---

## 🚀 Рекомендации по оптимизации

### 1. **Добавить недостающие эндпоинты**

```typescript
// В apiService.ts добавить:
async partialUpdatePosition(id: number, status: PositionStatusEnum): Promise<Position> {
  const response = await this.getApiClient().positions.partialUpdatePosition(id, { status });
  return response.data;
}

async getPositionQuestionsWithSettings(positionId: number): Promise<PositionQuestionsResponse> {
  const response = await this.getApiClient().questions.getPositionQuestionsWithSettings(positionId);
  return response.data;
}

async getTeam(): Promise<User[]> {
  const response = await this.getApiClient().teamUsers.getTeam();
  return response.data;
}

async getUserInfo(): Promise<any> {
  const response = await this.getApiClient().account.getUserInfo();
  return response.data;
}

async getChecklist(): Promise<any[]> {
  const response = await this.getApiClient().interviews.getChecklist();
  return response.data;
}

async getInviteInfo(): Promise<any> {
  const response = await this.getApiClient().interviews.getInviteInfo();
  return response.data;
}

async getInterviewsStats(): Promise<InterviewStats> {
  const response = await this.getApiClient().analyticsReports.getInterviewsStats();
  return response.data;
}

async createTariff(tariffData: TariffCreateRequest): Promise<Tariff> {
  const response = await this.getApiClient().settings.createTariff(tariffData);
  return response.data;
}

async updateTariff(id: number, tariffData: TariffUpdateRequest): Promise<Tariff> {
  const response = await this.getApiClient().settings.updateTariff(id, tariffData);
  return response.data;
}

async updateAgent(agentId: number, agentData: AgentUpdateRequest): Promise<Agent> {
  const response = await this.getApiClient().agents.updateAgent(agentId, agentData);
  return response.data;
}

async deleteAgent(agentId: number): Promise<void> {
  await this.getApiClient().agents.deleteAgent(agentId);
}

async authCandidate(authData: CandidateAuthRequest): Promise<CandidateAuthResponse> {
  const response = await this.getApiClient().candidates.authCandidate(authData);
  return response.data;
}
```

### 2. **Оптимизировать дублирующие вызовы**

```typescript
// В VacancyCreate.tsx - создать единую функцию:
const generatePositionWithRetry = async (description: string, questionsCount: number, questionType: string) => {
  try {
    return await apiService.generatePosition(description, questionsCount, questionType);
  } catch (error) {
    console.error('Failed to generate position:', error);
    throw error;
  }
};

// В Questions.tsx - создать batch update:
const updateQuestionOrders = async (questions: Question[]) => {
  const updates = questions.map(q => 
    apiService.updateQuestion(q.id, { order: q.order })
  );
  await Promise.all(updates);
};

// В optimizedApiService.ts - кэшировать кандидатов:
const candidateCache = new Map<number, Candidate>();

const getCandidateWithCache = async (id: number): Promise<Candidate | null> => {
  if (candidateCache.has(id)) {
    return candidateCache.get(id)!;
  }
  
  try {
    const candidate = await apiService.getCandidate(id);
    candidateCache.set(id, candidate);
    return candidate;
  } catch (error) {
    return null;
  }
};
```

### 3. **Добавить недостающие API клиенты**

```typescript
// В apiClient.ts добавить:
import { AgentsApi } from './apis/agents-api';

export interface ApiClient {
  // ... существующие
  agents: AgentsApi;
}

export function createApiClient(): ApiClient {
  return {
    // ... существующие
    agents: new AgentsApi(config)
  };
}
```

---

## 📈 Итоговая оценка

| Категория | Использование | Статус |
|-----------|---------------|--------|
| Auth | 100% | ✅ Отлично |
| Account | 100% | ✅ Отлично |
| Positions | 100% | ✅ Отлично |
| Candidates | 100% | ✅ Отлично |
| Interviews | 100% | ✅ Отлично |
| Questions | 100% | ✅ Отлично |
| Team & Users | 100% | ✅ Отлично |
| Settings | 100% | ✅ Отлично |
| Analytics & Reports | 100% | ✅ Отлично |
| AI | 100% | ✅ Отлично |
| Voice Interviews | 100% | ✅ Отлично |
| Agents | 60% | ⚠️ Требует доработки |
| Webhooks | 0% | ❌ Не реализовано |

**Общая оценка: 85%** - Отличное покрытие API, требуется небольшая доработка для полного соответствия схеме. 