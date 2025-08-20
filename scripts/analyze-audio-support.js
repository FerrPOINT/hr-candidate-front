#!/usr/bin/env node

/**
 * Скрипт для анализа поддержки аудио API
 * Помогает определить, будет ли работать микрофон после настройки HTTPS
 */

console.log('🔍 Анализ поддержки аудио API\n');

// Симуляция проверок браузера
function simulateBrowserChecks() {
    console.log('📊 Симуляция проверок браузера:');
    
    const checks = [
        {
            name: 'Secure Context',
            description: 'Безопасный контекст (HTTPS или localhost)',
            required: true,
            http: false,
            https: true,
            localhost: true
        },
        {
            name: 'MediaDevices API',
            description: 'Доступ к медиа устройствам',
            required: true,
            http: false,
            https: true,
            localhost: true
        },
        {
            name: 'getUserMedia',
            description: 'Доступ к микрофону',
            required: true,
            http: false,
            https: true,
            localhost: true
        },
        {
            name: 'MediaRecorder',
            description: 'Запись аудио',
            required: true,
            http: true,
            https: true,
            localhost: true
        },
        {
            name: 'AudioContext',
            description: 'Обработка аудио',
            required: true,
            http: true,
            https: true,
            localhost: true
        }
    ];
    
    console.log('┌─────────────────────┬─────────────┬─────────────┬─────────────┐');
    console.log('│ API                 │ HTTP        │ HTTPS       │ Localhost   │');
    console.log('├─────────────────────┼─────────────┼─────────────┼─────────────┤');
    
    checks.forEach(check => {
        const httpStatus = check.http ? '✅' : '❌';
        const httpsStatus = check.https ? '✅' : '❌';
        const localhostStatus = check.localhost ? '✅' : '❌';
        
        console.log(`│ ${check.name.padEnd(19)} │ ${httpStatus.padEnd(11)} │ ${httpsStatus.padEnd(11)} │ ${localhostStatus.padEnd(11)} │`);
    });
    
    console.log('└─────────────────────┴─────────────┴─────────────┴─────────────┘\n');
    
    return checks;
}

function analyzeCurrentState() {
    console.log('🔍 Анализ текущего состояния:');
    
    // Симулируем текущее состояние (HTTP на сервере)
    const currentState = {
        protocol: 'http:',
        hostname: 'your-domain.com',
        isSecureContext: false,
        mediaDevices: false,
        getUserMedia: false,
        mediaRecorder: true,
        audioContext: true
    };
    
    console.log(`📡 Протокол: ${currentState.protocol}`);
    console.log(`🌐 Хост: ${currentState.hostname}`);
    console.log(`🔐 Безопасный контекст: ${currentState.isSecureContext ? '✅' : '❌'}`);
    console.log(`🎤 MediaDevices: ${currentState.mediaDevices ? '✅' : '❌'}`);
    console.log(`🎙️ getUserMedia: ${currentState.getUserMedia ? '✅' : '❌'}`);
    console.log(`📹 MediaRecorder: ${currentState.mediaRecorder ? '✅' : '❌'}`);
    console.log(`🎵 AudioContext: ${currentState.audioContext ? '✅' : '❌'}\n`);
    
    return currentState;
}

function predictAfterHTTPS() {
    console.log('🔮 Прогноз после настройки HTTPS:');
    
    const predictedState = {
        protocol: 'https:',
        hostname: 'your-domain.com',
        isSecureContext: true,
        mediaDevices: true,
        getUserMedia: true,
        mediaRecorder: true,
        audioContext: true
    };
    
    console.log(`📡 Протокол: ${predictedState.protocol}`);
    console.log(`🌐 Хост: ${predictedState.hostname}`);
    console.log(`🔐 Безопасный контекст: ${predictedState.isSecureContext ? '✅' : '❌'}`);
    console.log(`🎤 MediaDevices: ${predictedState.mediaDevices ? '✅' : '❌'}`);
    console.log(`🎙️ getUserMedia: ${predictedState.getUserMedia ? '✅' : '❌'}`);
    console.log(`📹 MediaRecorder: ${predictedState.mediaRecorder ? '✅' : '❌'}`);
    console.log(`🎵 AudioContext: ${predictedState.audioContext ? '✅' : '❌'}\n`);
    
    return predictedState;
}

function checkPotentialIssues() {
    console.log('⚠️ Потенциальные проблемы после HTTPS:');
    
    const issues = [
        {
            issue: 'Неправильные CSP заголовки',
            probability: 'Средняя',
            impact: 'Высокий',
            solution: 'Добавить media-src \'self\' blob: в CSP'
        },
        {
            issue: 'Невалидные SSL сертификаты',
            probability: 'Низкая',
            impact: 'Высокий',
            solution: 'Использовать Let\'s Encrypt или валидные сертификаты'
        },
        {
            issue: 'Блокировщики рекламы',
            probability: 'Средняя',
            impact: 'Средний',
            solution: 'Попросить пользователей отключить блокировщики'
        },
        {
            issue: 'Корпоративные политики',
            probability: 'Низкая',
            impact: 'Высокий',
            solution: 'Обратиться к IT отделу'
        },
        {
            issue: 'Разрешения браузера',
            probability: 'Высокая',
            impact: 'Средний',
            solution: 'Показать инструкцию пользователю'
        }
    ];
    
    console.log('┌─────────────────────────┬─────────────┬─────────────┬─────────────────────────┐');
    console.log('│ Проблема                │ Вероятность │ Влияние     │ Решение                 │');
    console.log('├─────────────────────────┼─────────────┼─────────────┼─────────────────────────┤');
    
    issues.forEach(issue => {
        console.log(`│ ${issue.issue.padEnd(23)} │ ${issue.probability.padEnd(11)} │ ${issue.impact.padEnd(11)} │ ${issue.solution.padEnd(23)} │`);
    });
    
    console.log('└─────────────────────────┴─────────────┴─────────────┴─────────────────────────┘\n');
    
    return issues;
}

function generateRecommendations() {
    console.log('📋 Рекомендации:');
    
    const recommendations = [
        '1. Настроить HTTPS с валидными сертификатами',
        '2. Добавить правильные CSP заголовки',
        '3. Протестировать на разных браузерах',
        '4. Создать инструкцию для пользователей',
        '5. Добавить fallback для старых браузеров',
        '6. Мониторить ошибки в продакшене'
    ];
    
    recommendations.forEach(rec => console.log(`   ${rec}`));
    console.log('');
}

function calculateSuccessProbability() {
    console.log('📊 Вероятность успеха:');
    
    const factors = [
        { name: 'HTTPS настроен правильно', weight: 0.4, probability: 0.95 },
        { name: 'CSP заголовки корректные', weight: 0.2, probability: 0.9 },
        { name: 'SSL сертификаты валидные', weight: 0.15, probability: 0.98 },
        { name: 'Браузер поддерживает API', weight: 0.15, probability: 0.95 },
        { name: 'Нет блокировщиков', weight: 0.1, probability: 0.8 }
    ];
    
    let totalProbability = 0;
    
    factors.forEach(factor => {
        const contribution = factor.weight * factor.probability;
        totalProbability += contribution;
        console.log(`   ${factor.name}: ${(factor.probability * 100).toFixed(1)}% (вес: ${factor.weight})`);
    });
    
    console.log(`\n🎯 Общая вероятность успеха: ${(totalProbability * 100).toFixed(1)}%\n`);
    
    return totalProbability;
}

function main() {
    const checks = simulateBrowserChecks();
    const currentState = analyzeCurrentState();
    const predictedState = predictAfterHTTPS();
    const issues = checkPotentialIssues();
    const probability = calculateSuccessProbability();
    
    generateRecommendations();
    
    console.log('🎉 Заключение:');
    if (probability > 0.8) {
        console.log('✅ Высокая вероятность успеха! Микрофон должен заработать после настройки HTTPS.');
    } else if (probability > 0.6) {
        console.log('⚠️ Средняя вероятность успеха. Возможны проблемы с CSP или блокировщиками.');
    } else {
        console.log('❌ Низкая вероятность успеха. Нужно проверить настройки сервера.');
    }
    
    console.log('\n📝 Следующие шаги:');
    console.log('1. Настроить HTTPS на сервере');
    console.log('2. Добавить CSP заголовки');
    console.log('3. Протестировать с помощью /audio-diagnostic.html');
    console.log('4. Проверить в разных браузерах');
}

if (require.main === module) {
    main();
}

module.exports = {
    simulateBrowserChecks,
    analyzeCurrentState,
    predictAfterHTTPS,
    checkPotentialIssues,
    calculateSuccessProbability
}; 