type If<T extends string, U> = T extends U ? true : false;
type Role = 'citizen' | 'mafia' | 'doctor' | 'sherif' | 'immortal' | 'maniac';

interface IGameData {
    totalPlayers: number,
    totalMafias: number,
    roles: Role[],
}

// helpers
const getRandomIndex: (arr: any[]) => number = (arr) => ~~(Math.random() * arr.length);
const pick: <T>(arr: T[]) => T = (arr) => arr[getRandomIndex(arr)];
const shuffle = <T>(arr: T[], total: number): T[] => {
    for (let i = 0; i < total; i++) {
        let randomIndexA: number = getRandomIndex(arr),
            randomIndexB: number = getRandomIndex(arr);
        [arr[randomIndexA], arr[randomIndexB]] = [arr[randomIndexB], arr[randomIndexA]]
    }

    return arr;
}


// initial state
const data: IGameData = {
    totalPlayers: 0,
    totalMafias: 0,
    roles: [
        'citizen',
        'mafia',
        'doctor',
        'sherif'
    ]
}

// to get total amount of mafias we will use next formula: floor(n / 3) where n => total players

// getting all required DOM elements for updating initial state
const totalPlayersInput: HTMLInputElement | null = document.querySelector('.total-players-input');
const totalMafiasInput: HTMLInputElement | null = document.querySelector('.total-mafias-input');
const additionalRoles: NodeListOf<HTMLInputElement> | null | undefined = document.querySelectorAll('.additional-role-choose-button');
const startGenerationButton: HTMLButtonElement | null = document.querySelector('.start-generation-button');

// containers
const gameForm: HTMLFormElement | null = document.forms[0];
const rolesContainer: HTMLDivElement | null = document.querySelector('.roles-container');
let roles: NodeListOf<HTMLLIElement> | null | undefined;

// creating functions
const updateGameStateData = (data: IGameData, totalPlayers: number, additionalRolesData: NodeListOf<HTMLInputElement>): IGameData => {
    data.totalPlayers = totalPlayers;
    data.totalMafias = ~~(totalPlayers / 3);
    additionalRolesData.forEach((role: HTMLInputElement) => {
        if (role.checked) {
            if (role.value === 'immortal' || role.value === 'maniac') {
                data.roles.push(role.value)
            }
        }
    })
    return data;
}

const generateRole = (data: IGameData): Role[] => {
    const generated: Role[] = data.totalPlayers > 5 ? ['doctor', 'sherif'] : data.totalPlayers > 4 ? ['doctor'] : [];
    while (data.totalPlayers > generated.length) {
        const available: Role[] = [];
        for (let role of data.roles) {
            if (
                (data.totalMafias === 0 && role === 'mafia') ||
                (generated.includes('doctor') && role === 'doctor') ||
                (generated.includes('sherif') && role === 'sherif') ||
                (generated.includes('immortal') && role === 'immortal') ||
                (generated.includes('maniac') && role === 'maniac')
            ) continue;
            available.push(role);
        }
        let randomRole: Role = pick<Role>(available);
        if (randomRole === 'mafia') data.totalMafias--;
        generated.push(randomRole);
    }
    shuffle(generated, 10);

    return generated
}

// events
const showRole = (e: Event) => {
    const role: HTMLLIElement = e.target as HTMLLIElement;
    role.style.color = 'black';
    setTimeout(() => {
        role.style.color = 'transparent';
        role.style.backgroundColor = 'rgba(255, 255, 255, .5)';
    }, 1000)
}

const startGeneration = (e: MouseEvent, data: IGameData) => {
    e.preventDefault();
    if (totalPlayersInput && additionalRoles) {
        updateGameStateData(data, +totalPlayersInput.value, additionalRoles)
        if (data.roles.includes('maniac')) {
            data.totalMafias--;
        }
        const generatedRoles: Role[] = generateRole(data);
        gameForm.remove();
        if (rolesContainer) {
            let html: string = '<ul class = "roles-list">';
            for (let role of generatedRoles) {
                html += `<li class='role'>${role}</li>`
            }
            html += '</ul>';
            rolesContainer.insertAdjacentHTML('afterbegin', `${html}`);
            roles = rolesContainer.querySelectorAll('.role');
            if (roles) {
                roles.forEach(role => {
                    role.addEventListener('click', showRole, { once: true })
                })
            }
        }
    }

}

const updateTotalMafias = (e: Event) => {
    if (totalMafiasInput && e.target) {
        totalMafiasInput.value = ~~(+(e.target as HTMLInputElement).value / 3) + '';
    }
}


// handling
if (startGenerationButton) {
    startGenerationButton.onclick = (e: MouseEvent) => startGeneration(e, data);
}
if (totalPlayersInput) {
    totalPlayersInput.oninput = (e: Event) => updateTotalMafias(e);

}