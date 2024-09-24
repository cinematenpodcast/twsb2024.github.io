
document.addEventListener('DOMContentLoaded', function () {
    // Firebase Database reference
    var database = firebase.database();
    let teams = [];
    let editingIndex = -1;

    // Fetch the team data from Firebase
    function fetchTeams() {
        return database.ref('teams').once('value').then(snapshot => snapshot.val()).then(data => {
            teams = data || [];
            renderTeams();
        });
    }

    // Update the team data on Firebase
    function updateTeamsOnServer() {
        return database.ref('teams').set(teams);
    }

    const teamList = document.getElementById('team-list');
    const teamNameInput = document.getElementById('team-name');
    const teamMembersInput = document.getElementById('team-members');
    const saveTeamButton = document.getElementById('save-team');
    const deleteTeamButton = document.getElementById('delete-team');
    const formTitle = document.getElementById('form-title');

    // Function to render the teams
    function renderTeams() {
        teamList.innerHTML = ''; // Clear the list
        teams.forEach((team, index) => {
            const li = document.createElement('li');
            li.classList.add('team-item');
            li.dataset.index = index;
            li.innerHTML = `
                <span class="team-name">${team.name}</span>
                <span class="team-members">${team.members.join(', ')}</span>
            `;
            li.addEventListener('click', () => editTeam(index));
            teamList.appendChild(li);
        });
    }

    // Function to handle adding or updating a team
    saveTeamButton.addEventListener('click', function () {
        const teamName = teamNameInput.value;
        const teamMembers = teamMembersInput.value.split(',').map(member => member.trim());

        if (teamName && teamMembers.length > 0) {
            const newTeam = { name: teamName, members: teamMembers, score: 0 };

            if (editingIndex === -1) {
                // Add new team
                teams.push(newTeam);
            } else {
                // Update existing team
                teams[editingIndex] = newTeam;
                editingIndex = -1;
                formTitle.innerText = 'Add New Team';
                deleteTeamButton.style.display = 'none';
            }

            updateTeamsOnServer().then(() => {
                renderTeams();
                teamNameInput.value = '';
                teamMembersInput.value = '';
            });
        } else {
            alert('Please enter a valid team name and members.');
        }
    });

    // Function to handle editing a team
    function editTeam(index) {
        editingIndex = index;
        const team = teams[index];
        teamNameInput.value = team.name;
        teamMembersInput.value = team.members.join(', ');
        formTitle.innerText = 'Edit Team';
        deleteTeamButton.style.display = 'inline-block';
    }

    // Function to handle deleting a team
    deleteTeamButton.addEventListener('click', function () {
        if (confirm('Are you sure you want to delete this team?')) {
            teams.splice(editingIndex, 1);
            updateTeamsOnServer().then(() => {
                renderTeams();
                teamNameInput.value = '';
                teamMembersInput.value = '';
                editingIndex = -1;
                formTitle.innerText = 'Add New Team';
                deleteTeamButton.style.display = 'none';
            });
        }
    });

    // Fetch the initial team data
    fetchTeams();
});
