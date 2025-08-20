import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { AudioVisualizer } from './AudioVisualizer';
import { Mic, MicOff, CheckCircle, AlertCircle } from 'lucide-react';

export function MicrophoneTest({ onTestComplete }: { onTestComplete: () => void }) {
  const [testStep, setTestStep] = useState<'welcome' | 'testing' | 'complete'>('welcome');
  const [isRecording, setIsRecording] = useState(false);
  const [testResult, setTestResult] = useState<'success' | 'failed' | null>(null);

  const startMicTest = () => {
    setTestStep('testing');
    setIsRecording(true);
    
    // Симуляция теста микрофона
    setTimeout(() => {
      setTestResult('success');
      setIsRecording(false);
      setTestStep('complete');
    }, 3000);
  };

  const retryTest = () => {
    setTestResult(null);
    setTestStep('welcome');
  };

  return (
    <div className="text-center space-y-6">
      {testStep === 'welcome' && (
        <>
          <div className="w-20 h-20 bg-[#e16349] rounded-full flex items-center justify-center mx-auto">
            <Mic className="w-10 h-10 text-white" />
          </div>
          <div>
            <h3 className="text-foreground mb-2">Тест микрофона</h3>
            <p className="text-muted-foreground mb-6">
              Перед началом интервью проверим качество записи вашего микрофона
            </p>
            <Button 
              onClick={startMicTest}
              className="bg-[#e16349] hover:bg-[#d55a42] rounded-[12px]"
            >
              Начать тест
            </Button>
          </div>
        </>
      )}

      {testStep === 'testing' && (
        <>
          <div className="w-20 h-20 bg-[#e16349] rounded-full flex items-center justify-center mx-auto animate-pulse">
            <Mic className="w-10 h-10 text-white" />
          </div>
          <div>
            <h3 className="text-foreground mb-2">Говорите в микрофон</h3>
            <p className="text-muted-foreground mb-4">
              Скажите несколько слов для проверки качества записи
            </p>
            <div className="bg-secondary rounded-[20px] p-4 max-w-md mx-auto">
              <AudioVisualizer isActive={isRecording} />
            </div>
          </div>
        </>
      )}

      {testStep === 'complete' && (
        <>
          <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto ${
            testResult === 'success' ? 'bg-green-100' : 'bg-red-100'
          }`}>
            {testResult === 'success' ? (
              <CheckCircle className="w-10 h-10 text-green-600" />
            ) : (
              <AlertCircle className="w-10 h-10 text-red-600" />
            )}
          </div>
          <div>
            <h3 className="text-foreground mb-2">
              {testResult === 'success' ? 'Тест пройден!' : 'Проблема с микрофоном'}
            </h3>
            <p className="text-muted-foreground mb-6">
              {testResult === 'success' 
                ? 'Качество записи отличное. Можно приступать к интервью.'
                : 'Не удалось записать звук. Проверьте настройки микрофона.'
              }
            </p>
            {testResult === 'success' ? (
              <Button 
                onClick={onTestComplete}
                className="bg-[#e16349] hover:bg-[#d55a42] rounded-[12px]"
              >
                Приступить к интервью
              </Button>
            ) : (
              <div className="flex gap-3 justify-center">
                <Button 
                  variant="outline"
                  onClick={retryTest}
                  className="rounded-[12px]"
                >
                  Повторить тест
                </Button>
                <Button 
                  onClick={onTestComplete}
                  className="bg-[#e16349] hover:bg-[#d55a42] rounded-[12px]"
                >
                  Продолжить без микрофона
                </Button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
