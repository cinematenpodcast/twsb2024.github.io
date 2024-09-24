document.addEventListener('DOMContentLoaded', function () {
    // Firebase Database reference
    var database = firebase.database();
    let teams = [];

    // Fetch the team data from Firebase
    function fetchTeams() {
        return database.ref('teams').once('value').then(snapshot => snapshot.val()).then(data => {
            if (data) {
                // Add index to each team object to preserve the original order
                teams = Object.keys(data).map((key) => ({
                    ...data[key],
                    id: key // Store the original database key for each team
                }));
                renderTeams();
            } else {
                console.error('No data found in the database!');
            }
        });
    }

    // Update the team data on Firebase
    function updateTeamScore(teamId, score) {
        return database.ref('teams/' + teamId).update({ score: score });
    }

    const teamList = document.getElementById('team-list');
    const sendButton = document.getElementById('send-button');
    
    // Function to render the teams sorted by score (highest to lowest)
    function renderTeams() {
        teamList.innerHTML = ''; // Clear the list

        // Sort teams by score in descending order
        teams.sort((a, b) => b.score - a.score);
        
        teams.forEach((team, index) => {
            const li = document.createElement('li');
            li.classList.add('team-item');
            li.dataset.index = index;
            li.dataset.teamId = team.id; // Store the team's database ID in the element
            li.innerHTML = `
                <div class="team-info">
                    <span class="team-name">${team.name}</span>
                    <span class="team-score">${team.score} points</span>
                </div>
                <div class="team-details" style="display: none;">
                    <span class="team-members">${team.members.join(', ')}</span>
                    <div class="input-container">
                        <input type="number" min="0" class="add-points" placeholder="+" data-index="${index}">
                        <input type="number" min="0" class="remove-points" placeholder="-" data-index="${index}">
                    </div>
                </div>
            `;
            teamList.appendChild(li);
        });
    }

    // Function to show/hide the team details and change color when expanded
    function toggleTeamDetails(index) {
        const teamItem = document.querySelector(`li[data-index="${index}"]`);
        const teamDetails = teamItem.querySelector('.team-details');
        const isVisible = teamDetails.style.display === 'flex';

        teamDetails.style.display = isVisible ? 'none' : 'flex';
        teamItem.style.backgroundColor = isVisible ? '#A7DEF1' : '#a7f1b5'; // Change color when expanded/collapsed
    }

    // Event delegation for handling team name clicks (click on the whole element, but not inputs)
    teamList.addEventListener('click', function (event) {
        const teamItem = event.target.closest('.team-item');
        if (teamItem && !event.target.matches('input')) { // Exclude clicks on inputs
            const index = teamItem.dataset.index;
            toggleTeamDetails(index);
        }
    });

    // Event delegation for handling point inputs - only updates on "Enter"
    teamList.addEventListener('keydown', function (event) {
        if (event.key === 'Enter') {
            const index = event.target.dataset.index;
            let points = 0;

            if (event.target.classList.contains('add-points')) {
                points = parseInt(event.target.value) || 0;
                teams[index].score += points;
            } else if (event.target.classList.contains('remove-points')) {
                points = parseInt(event.target.value) || 0;
                teams[index].score -= points;
            }

            event.target.value = ''; // Clear the input field
            renderTeams(); // Re-render the teams
        }
    });

    // Functionality for the SEND button
    sendButton.addEventListener('click', function () {
        teams.forEach((team) => {
            updateTeamScore(team.id, team.score).then(() => {
                console.log('Scores sent for team:', team.name);
            }).catch((error) => {
                console.error('Error sending scores:', error);
            });
        });
        alert('All scores have been sent to the database.');
    });

    // Fetch the initial team data
    fetchTeams();
});
