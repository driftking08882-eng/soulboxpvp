document.addEventListener('DOMContentLoaded', () => {
    const resultBox = document.getElementById('result');
    const loadingDiv = document.getElementById('loading');
    const errorDiv = document.getElementById('error');
    const serverNameEl = document.getElementById('server-name');
    const statusBadgeEl = document.getElementById('status-badge');
    const playerCountEl = document.getElementById('player-count');
    const versionEl = document.getElementById('version');
    const motdEl = document.getElementById('motd');
    const playerListContainer = document.getElementById('player-list-container');
    const playerListEl = document.getElementById('player-list');

    const SERVER_IP = "soulboxpvp.aternos.me";
    const SERVER_PORT = "59911";

    // Initial check
    initCheck();

    function initCheck() {
        loadingDiv.classList.remove('hidden');
        resultBox.classList.add('hidden');
        errorDiv.classList.add('hidden');
        
        fetchData();
        
        // Auto refresh every 5 seconds
        setInterval(() => {
            fetchData(true);
        }, 5000);
    }

    function fetchData(isBackground = false) {
        fetch(`https://mcapi.us/server/status?ip=${SERVER_IP}&port=${SERVER_PORT}`)
            .then(response => response.json())
            .then(data => {
                if (!isBackground) {
                    loadingDiv.classList.add('hidden');
                    resultBox.classList.remove('hidden');
                }
                updateUI(data);
            })
            .catch(err => {
                if (!isBackground) {
                    loadingDiv.classList.add('hidden');
                    errorDiv.classList.remove('hidden');
                }
                console.error(err);
            });
    }

    function updateUI(data) {
        if (data.online) {
            statusBadgeEl.textContent = "Online";
            statusBadgeEl.className = "badge online";
            
            // mcapi.us returns players.now and players.max
            playerCountEl.textContent = `${data.players.now} / ${data.players.max}`;
            
            // mcapi.us returns server.name as version
            versionEl.textContent = data.server.name;
            
            // MOTD handling
            motdEl.textContent = data.motd;

            // Player List
            playerListEl.innerHTML = '';
            // mcapi.us returns data.players.sample for the list
            if (data.players.sample && data.players.sample.length > 0) {
                playerListContainer.classList.remove('hidden');
                data.players.sample.forEach(player => {
                    const li = document.createElement('li');
                    
                    const img = document.createElement('img');
                    // Use the player name for the head
                    img.src = `https://minotar.net/avatar/${player.name}/16`;
                    img.alt = player.name;
                    
                    const span = document.createElement('span');
                    span.textContent = player.name;
                    
                    li.appendChild(img);
                    li.appendChild(span);
                    playerListEl.appendChild(li);
                });
            } else {
                // If online but no players or sample is empty
                if (data.players.now > 0) {
                    const li = document.createElement('li');
                    li.textContent = "Player list hidden or empty";
                    playerListEl.appendChild(li);
                    playerListContainer.classList.remove('hidden');
                } else {
                    playerListContainer.classList.add('hidden');
                }
            }

        } else {
            statusBadgeEl.textContent = "Offline";
            statusBadgeEl.className = "badge offline";
            
            playerCountEl.textContent = "-";
            versionEl.textContent = "-";
            motdEl.textContent = "Server is currently offline.";
            playerListContainer.classList.add('hidden');
        }
    }
});
