import React, { useEffect, useState } from 'react';
import { apiClient } from '../api/apiClient';
import type { Interview, Question } from '../api/models';

interface Props {
  interviewId: number;
}

const speak = (text: string) => {
  try {
    if ('speechSynthesis' in window) {
      const utter = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utter);
    }
  } catch {}
};

const SimpleQAInterview: React.FC<Props> = ({ interviewId }) => {
  const [interview, setInterview] = useState<Interview | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answer, setAnswer] = useState('');
  const [history, setHistory] = useState<Array<{ q: string; a: string }>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // positionId not used in current simple flow

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const interviewResp = await apiClient.interviews.getInterview(interviewId);
        setInterview(interviewResp.data);
        // Получаем вопросы по вакансии
        const pid = interviewResp.data.positionId;
        const qs = await apiClient.questions.listPositionQuestions(pid);
        const list: Question[] = (qs.data as any)?.content || [];
        setQuestions(list);
        if (list[0]?.text) speak(list[0].text as any);
      } catch (e: any) {
        setError(e?.message || 'Ошибка загрузки интервью');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [interviewId]);

  const onNext = async () => {
    const q = questions[currentIdx];
    setHistory((h) => [...h, { q: (q as any)?.text || 'Вопрос', a: answer }]);
    setAnswer('');
    const next = currentIdx + 1;
    if (next < questions.length) {
      setCurrentIdx(next);
      const text = (questions[next] as any)?.text || '';
      if (text) speak(text);
    }
  };

  if (loading) return <div className="p-6">Загрузка...</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;
  if (!interview) return <div className="p-6">Интервью не найдено</div>;

  const currentQ = questions[currentIdx];

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h2 className="text-xl font-semibold mb-4">Интервью #{interviewId}</h2>
      <div className="space-y-3 mb-6">
        {history.map((item, idx) => (
          <div key={idx} className="border rounded-lg p-3">
            <div className="text-sm text-gray-600">Вопрос:</div>
            <div className="font-medium mb-2">{item.q}</div>
            <div className="text-sm text-gray-600">Ответ:</div>
            <div>{item.a}</div>
          </div>
        ))}
      </div>
      {currentQ ? (
        <div className="border rounded-lg p-4">
          <div className="text-sm text-gray-600 mb-1">Текущий вопрос</div>
          <div className="font-medium mb-3">{(currentQ as any)?.text || 'Вопрос'}</div>
          <textarea
            className="w-full border rounded-md p-2"
            rows={4}
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Введите ваш ответ"
          />
          <div className="mt-3 flex gap-2">
            <button className="btn-primary" onClick={onNext} disabled={!answer.trim()}>Ответить</button>
            <button className="btn-secondary" onClick={() => speak(((currentQ as any)?.text || '') as string)}>Озвучить вопрос</button>
          </div>
        </div>
      ) : (
        <div className="p-4 bg-green-50 border border-green-200 rounded-md">Вопросы закончились. Спасибо!</div>
      )}
    </div>
  );
};

export default SimpleQAInterview; 