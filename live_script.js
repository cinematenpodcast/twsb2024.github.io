
document.addEventListener('DOMContentLoaded', function () {
    // Firebase Database reference
    var database = firebase.database();

    // Fetch the team data from Firebase
    function fetchTeams() {
        return database.ref('teams').once('value').then(snapshot => snapshot.val());
    }

    // Function to render the podium
    function renderPodium(teams) {
        teams.sort((a, b) => b.score - a.score);
        document.getElementById('first-place-name').innerText = teams[0].name;
        document.getElementById('first-place-score').innerText = teams[0].score;
        document.getElementById('second-place-name').innerText = teams[1].name;
        document.getElementById('second-place-score').innerText = teams[1].score;
        document.getElementById('third-place-name').innerText = teams[2].name;
        document.getElementById('third-place-score').innerText = teams[2].score;
    }

    // Function to render the team columns
    function renderColumns(teams) {
        const column1 = document.getElementById('column-1');
        const column2 = document.getElementById('column-2');
        const column3 = document.getElementById('column-3');
        
        column1.innerHTML = '';
        column2.innerHTML = '';
        column3.innerHTML = '';

        for (let i = 3; i < teams.length; i++) {
            const team = teams[i];
            const teamDiv = document.createElement('div');
            teamDiv.innerText = `${i + 1}. ${team.name}`;

            if (i >= 3 && i <= 6) {
                column1.appendChild(teamDiv);
            } else if (i >= 7 && i <= 10) {
                column2.appendChild(teamDiv);
            } else {
                column3.appendChild(teamDiv);
            }
        }
    }

    // Fetch and render the team data every few seconds for live updates
    function updateLiveView() {
        fetchTeams().then(teams => {
            renderPodium(teams);
            renderColumns(teams);
        });
    }

    // Initial render
    updateLiveView();
    setInterval(updateLiveView, 5000); // Update every 5 seconds
});
