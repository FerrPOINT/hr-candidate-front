const { spawn } = require('child_process');
const { exec } = require('child_process');
const path = require('path');

// Функция для убийства процессов на порту 3000
function killProcessOnPort(port) {
    return new Promise((resolve, reject) => {
        exec(`netstat -ano | findstr :${port}`, (error, stdout) => {
            if (error) {
                console.log(`Порт ${port} свободен`);
                resolve();
                return;
            }

            const lines = stdout.split('\n');
            lines.forEach(line => {
                const parts = line.trim().split(/\s+/);
                if (parts.length > 4) {
                    const pid = parts[4];
                    if (pid && pid !== '0') {
                        console.log(`Убиваю процесс ${pid} на порту ${port}`);
                        exec(`taskkill /F /PID ${pid}`, (killError) => {
                            if (killError) {
                                console.log(`Ошибка убийства процесса ${pid}:`, killError.message);
                            } else {
                                console.log(`Процесс ${pid} успешно убит`);
                            }
                        });
                    }
                }
            });
            resolve();
        });
    });
}

// Функция для запуска React приложения
function startReactApp() {
    console.log('Запускаю React приложение...');

    const env = {
        ...process.env,
        // Не переопределяем REACT_APP_API_BASE_URL дефолтом, даём CRA загрузить из .env
        ...(process.env.REACT_APP_API_BASE_URL ? { REACT_APP_API_BASE_URL: process.env.REACT_APP_API_BASE_URL } : {}),
        BROWSER: process.env.BROWSER || 'none'
    };

    console.log(`REACT_APP_API_BASE_URL=${env.REACT_APP_API_BASE_URL || '(from .env or unset)'}`);

    const reactProcess = spawn('npx', ['craco', 'start'], {
        stdio: 'inherit',
        shell: true,
        cwd: process.cwd(),
        env
    });

    reactProcess.on('error', (error) => {
        console.error('Ошибка запуска React приложения:', error);
        process.exit(1);
    });

    reactProcess.on('exit', (code) => {
        console.log(`React приложение завершилось с кодом ${code}`);
        process.exit(code);
    });
}

// Основная функция
async function main() {
    try {
        console.log('Очищаю порт 3000...');
        await killProcessOnPort(3000);

        // Небольшая задержка для завершения процессов
        setTimeout(() => {
            startReactApp();
        }, 1000);

    } catch (error) {
        console.error('Ошибка:', error);
        process.exit(1);
    }
}

// Запуск
main(); 