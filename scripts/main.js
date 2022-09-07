// helpers
var getRandomIndex = function (arr) { return ~~(Math.random() * arr.length); };
var pick = function (arr) { return arr[getRandomIndex(arr)]; };
var shuffle = function (arr, total) {
    var _a;
    for (var i = 0; i < total; i++) {
        var randomIndexA = getRandomIndex(arr), randomIndexB = getRandomIndex(arr);
        _a = [arr[randomIndexB], arr[randomIndexA]], arr[randomIndexA] = _a[0], arr[randomIndexB] = _a[1];
    }
    return arr;
};
// initial state
var data = {
    totalPlayers: 0,
    totalMafias: 0,
    roles: [
        'citizen',
        'mafia',
        'doctor',
        'sherif'
    ]
};
// to get total amount of mafias we will use next formula: floor(n / 3) where n => total players
// getting all required DOM elements for updating initial state
var totalPlayersInput = document.querySelector('.total-players-input');
var totalMafiasInput = document.querySelector('.total-mafias-input');
var additionalRoles = document.querySelectorAll('.additional-role-choose-button');
var startGenerationButton = document.querySelector('.start-generation-button');
// containers
var gameForm = document.forms[0];
var rolesContainer = document.querySelector('.roles-container');
var roles;
// creating functions
var updateGameStateData = function (data, totalPlayers, additionalRolesData) {
    data.totalPlayers = totalPlayers;
    data.totalMafias = ~~(totalPlayers / 3);
    additionalRolesData.forEach(function (role) {
        if (role.checked) {
            if (role.value === 'immortal' || role.value === 'maniac') {
                data.roles.push(role.value);
            }
        }
    });
    return data;
};
var generateRole = function (data) {
    var generated = data.totalPlayers > 5 ? ['doctor', 'sherif'] : data.totalPlayers > 4 ? ['doctor'] : [];
    while (data.totalPlayers > generated.length) {
        var available = [];
        for (var _i = 0, _a = data.roles; _i < _a.length; _i++) {
            var role = _a[_i];
            if ((data.totalMafias === 0 && role === 'mafia') ||
                (generated.includes('doctor') && role === 'doctor') ||
                (generated.includes('sherif') && role === 'sherif') ||
                (generated.includes('immortal') && role === 'immortal') ||
                (generated.includes('maniac') && role === 'maniac'))
                continue;
            available.push(role);
        }
        var randomRole = pick(available);
        if (randomRole === 'mafia')
            data.totalMafias--;
        generated.push(randomRole);
    }
    shuffle(generated, 10);
    return generated;
};
// events
var showRole = function (e) {
    var role = e.target;
    role.style.color = 'black';
    setTimeout(function () {
        role.style.color = 'transparent';
        role.style.backgroundColor = 'rgba(255, 255, 255, .5)';
    }, 1000);
};
var startGeneration = function (e, data) {
    e.preventDefault();
    if (totalPlayersInput && additionalRoles) {
        updateGameStateData(data, +totalPlayersInput.value, additionalRoles);
        if (data.roles.includes('maniac')) {
            data.totalMafias--;
        }
        var generatedRoles = generateRole(data);
        gameForm.remove();
        if (rolesContainer) {
            var html = '<ul class = "roles-list">';
            for (var _i = 0, generatedRoles_1 = generatedRoles; _i < generatedRoles_1.length; _i++) {
                var role = generatedRoles_1[_i];
                html += "<li class='role'>".concat(role, "</li>");
            }
            html += '</ul>';
            rolesContainer.insertAdjacentHTML('afterbegin', "".concat(html));
            roles = rolesContainer.querySelectorAll('.role');
            if (roles) {
                roles.forEach(function (role) {
                    role.addEventListener('click', showRole, { once: true });
                });
            }
        }
    }
};
var updateTotalMafias = function (e) {
    if (totalMafiasInput && e.target) {
        totalMafiasInput.value = ~~(+e.target.value / 3) + '';
    }
};
// handling
if (startGenerationButton) {
    startGenerationButton.onclick = function (e) { return startGeneration(e, data); };
}
if (totalPlayersInput) {
    totalPlayersInput.oninput = function (e) { return updateTotalMafias(e); };
}
