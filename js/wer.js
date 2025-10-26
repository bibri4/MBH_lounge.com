let weapons = [];
let usedWeaponsIndices = []; // Массив для отслеживания индексов выпавшего оружия

async function loadWeapons() {
    try {
        const response = await fetch('https://docs.google.com/spreadsheets/d/1pnRMWUSTXJidfTCbRZy9EeusXsQq86uRWHBW_YWlkZg/export?format=csv&gid=0');
        const data = await response.text();
        weapons = data.split('\n').map(line => {
            const [name, ...rest] = line.split(',');
            return { name: name.trim(), description: rest.join(',').trim() };
        }).filter(weapon => weapon.name);
        console.log('Weapons loaded:', weapons);
    } catch (error) {
        console.error('Ошибка загрузки данных:', error);
        weapons = [{ name: 'Ошибка загрузки данных', description: '' }];
    }
}

function getRandomWeapon() {
    if (weapons.length === 0) {
        console.log('Данные ещё не загружены!');
        return { name: 'Загрузка...', description: '' };
    }

    // Если всё оружие уже выпало — сбросить список
    if (usedWeaponsIndices.length === weapons.length) {
        usedWeaponsIndices = [];
        console.log('Все предметы выпали! Список сброшен.');
    }

    // Выбираем случайный индекс из неиспользованных
    let randomIndex;
    do {
        randomIndex = Math.floor(Math.random() * weapons.length);
    } while (usedWeaponsIndices.includes(randomIndex));

    // Добавляем индекс в использованные
    usedWeaponsIndices.push(randomIndex);

    const weapon = weapons[randomIndex];
    console.log('Selected weapon:', weapon);
    return weapon;
}

document.getElementById('randomWeaponBtn').addEventListener('click', function() {
    const weapon = getRandomWeapon();
    document.getElementById('weaponResult').textContent =
        `Ваше случайное оружие: ${weapon.name}${weapon.description ? ' (' + weapon.description + ')' : ''}`;
});

// Загружаем данные при загрузке страницы
loadWeapons();
