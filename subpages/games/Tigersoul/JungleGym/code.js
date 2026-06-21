// put worker here
const API_URL = "https://jgym-record-keeper.anticlankerhammer.org";

async function fetchLeaderboard() {
    const tbody = document.getElementById('leaderboard-body');
    
    try {
        const response = await fetch(`${API_URL}/leaderboard`);
        
        if (!response.ok) throw new Error('Network response was not ok');
        
        const data = await response.json();
        
        // Clear loading spinner
        tbody.innerHTML = '';

        if (data.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="3" class="px-6 py-8 text-center text-slate-500 italic">
                        No times recorded yet. It's not a competition... or is it?
                    </td>
                </tr>`;
            return;
        }

        // Populate table
        data.forEach((entry, index) => {
            const rank = index + 1;
            
            // Styling for Top 3
            let rankStyle = "text-slate-400";
            if (rank === 1) rankStyle = "text-yellow-400 font-bold text-lg drop-shadow-[0_0_8px_rgba(250,204,21,0.5)]"; // Gold
            if (rank === 2) rankStyle = "text-slate-300 font-bold text-lg"; // Silver
            if (rank === 3) rankStyle = "text-amber-600 font-bold text-lg"; // Bronze

            const row = document.createElement('tr');
            row.className = "hover:bg-slate-700/30 transition-colors group";
            
            row.innerHTML = `
                <td class="px-6 py-4 text-center ${rankStyle}">
                    ${rank === 1 ? '👑 1' : rank}
                </td>
                <td class="px-6 py-4 font-medium text-slate-200 group-hover:text-white transition-colors">
                    ${escapeHTML(entry.player_name)}
                </td>
                <td class="px-6 py-4 text-right time-font text-cyan-300 font-bold tracking-wide">
                    ${parseFloat(entry.time).toFixed(3)}s
                </td>
            `;
            tbody.appendChild(row);
        });

    } catch (error) {
        console.error("Failed to fetch leaderboard:", error);
        tbody.innerHTML = `
            <tr>
                <td colspan="3" class="px-6 py-8 text-center text-red-400">
                    Failed to load data. The Api may be borked.
                </td>
            </tr>`;
    }
}

// Prevent XSS attacks by escaping HTML from player names
function escapeHTML(str) {
    return str.replace(/[&<>'"]/g, 
        tag => ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            "'": '&#39;',
            '"': '&quot;'
        }[tag] || tag)
    );
}

// Initial fetch on page load
window.onload = fetchLeaderboard;