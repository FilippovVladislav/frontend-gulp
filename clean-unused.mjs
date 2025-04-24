import depcheck from 'depcheck';
import { execSync } from 'child_process';
import readline from 'readline';

const options = {
    ignoreBinPackage: false,
    skipMissing: false,
};

function askYesNo(question) {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    return new Promise((resolve) => {
        rl.question(question, (answer) => {
            rl.close();
            resolve(answer.trim().toLowerCase() === 'y' || answer.trim().toLowerCase() === 'yes');
        });
    });
}

(async () => {
    const result = await new Promise((resolve) => {
        depcheck(process.cwd(), options, (unused) => resolve(unused));
    });

    const deps = result.dependencies;

    if (deps.length === 0) {
        console.log('✅ Нет неиспользуемых зависимостей');
        return;
    }

    console.log('🔍 Найдены неиспользуемые зависимости:\n', deps.join(', '));
    const confirm = await askYesNo('Удалить их? (y/n): ');

    if (!confirm) {
        console.log('❌ Отмена');
        return;
    }

    try {
        execSync(`npm uninstall ${deps.join(' ')}`, { stdio: 'inherit' });
        console.log('🧹 Удалено!');
    } catch (err) {
        console.error('❌ Ошибка при удалении:', err.message);
    }
})();
