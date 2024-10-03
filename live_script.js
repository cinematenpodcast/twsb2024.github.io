document.addEventListener('DOMContentLoaded', function () {
    var database = firebase.database();

    function fetchTeams() {
        return database.ref('teams').once('value').then(snapshot => snapshot.val());
    }

    function renderPodium(teams) {
        teams.sort((a, b) => b.score - a.score);
        document.getElementById('first-place-name').innerText = teams[0].name;
        document.getElementById('first-place-score').innerText = teams[0].score;
        document.getElementById('second-place-name').innerText = teams[1].name;
        document.getElementById('second-place-score').innerText = teams[1].score;
        document.getElementById('third-place-name').innerText = teams[2].name;
        document.getElementById('third-place-score').innerText = teams[2].score;
    }

    function renderColumns(teams) {
        const column1 = document.getElementById('column-1');
        const column2 = document.getElementById('column-2');
        const column3 = document.getElementById('column-3');

        column1.innerHTML = '';
        column2.innerHTML = '';
        column3.innerHTML = '';

        for (let i = 3; i < 7; i++) {
            const team = teams[i];
            const teamDiv = document.createElement('div');
            teamDiv.innerText = `${i + 1}. ${team.name}`;

            if (i % 2 === 1) {
                column1.appendChild(teamDiv);
            } else {
                column2.appendChild(teamDiv);
            }
        }

        if (teams.length > 7) {
            const team8 = teams[7];
            const centeredDiv = document.createElement('div');
            centeredDiv.innerText = `8. ${team8.name}`;
            centeredDiv.classList.add('centered');
            column3.appendChild(centeredDiv);
        }
    }

    function updateLiveView() {
        fetchTeams().then(teams => {
            renderPodium(teams);
            renderColumns(teams);
        });
    }

    updateLiveView();
    setInterval(updateLiveView, 5000);
});
