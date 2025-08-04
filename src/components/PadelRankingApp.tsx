import React, { useState, useEffect } from 'react';
import { Users, Plus, Trophy, History, UserPlus, Settings, TrendingUp } from 'lucide-react';

const PadelRankingApp = () => {
  const [activeTab, setActiveTab] = useState('rankings');
  const [players, setPlayers] = useState([]);
  const [matches, setMatches] = useState([]);
  const [showAddPlayer, setShowAddPlayer] = useState(false);
  const [showMatchForm, setShowMatchForm] = useState(false);
  const [newPlayerName, setNewPlayerName] = useState('');

  // Match form state
  const [selectedPlayers, setSelectedPlayers] = useState({
    team1Player1: '',
    team1Player2: '',
    team2Player1: '',
    team2Player2: ''
  });
  const [matchScore, setMatchScore] = useState({
    set1Team1: '',
    set1Team2: '',
    set2Team1: '',
    set2Team2: '',
    set3Team1: '',
    set3Team2: ''
  });

  // Calculate ATP-style points
  const calculatePoints = (playerName) => {
    let matchWins = 0;
    let matchLosses = 0;
    let setWins = 0;
    let setLosses = 0;
    let gameWins = 0;
    let gameLosses = 0;

    matches.forEach(match => {
      const isTeam1 = match.team1.includes(playerName);
      const isTeam2 = match.team2.includes(playerName);
      
      if (!isTeam1 && !isTeam2) return;

      const playerTeam = isTeam1 ? 'team1' : 'team2';
      const opponentTeam = isTeam1 ? 'team2' : 'team1';

      // Count sets won/lost
      match.sets.forEach(set => {
        if (set[playerTeam] > set[opponentTeam]) {
          setWins++;
        } else {
          setLosses++;
        }
        gameWins += set[playerTeam];
        gameLosses += set[opponentTeam];
      });

      // Count match win/loss
      if (match.winner === playerTeam) {
        matchWins++;
      } else {
        matchLosses++;
      }
    });

    // ATP-style point calculation: Match wins = 100pts, Set wins = 10pts, Games = 1pt
    return (matchWins * 100) + (setWins * 10) + gameWins;
  };

  // Get player rankings
  const getRankings = () => {
    return players.map(player => ({
      name: player,
      points: calculatePoints(player),
      matches: matches.filter(m => m.team1.includes(player) || m.team2.includes(player)).length,
      wins: matches.filter(m => 
        (m.team1.includes(player) && m.winner === 'team1') ||
        (m.team2.includes(player) && m.winner === 'team2')
      ).length
    }))
    .sort((a, b) => b.points - a.points)
    .map((player, index) => ({ ...player, rank: index + 1 }));
  };

  // Add new player
  const addPlayer = () => {
    if (newPlayerName.trim() && !players.includes(newPlayerName.trim())) {
      setPlayers([...players, newPlayerName.trim()]);
      setNewPlayerName('');
      setShowAddPlayer(false);
    }
  };

  // Submit match
  const submitMatch = () => {
    const { team1Player1, team1Player2, team2Player1, team2Player2 } = selectedPlayers;
    const { set1Team1, set1Team2, set2Team1, set2Team2, set3Team1, set3Team2 } = matchScore;

    // Validate required fields
    if (!team1Player1 || !team1Player2 || !team2Player1 || !team2Player2 ||
        !set1Team1 || !set1Team2 || !set2Team1 || !set2Team2) {
      alert('Please fill in all required fields');
      return;
    }

    // Build sets array
    const sets = [
      { team1: parseInt(set1Team1), team2: parseInt(set1Team2) },
      { team1: parseInt(set2Team1), team2: parseInt(set2Team2) }
    ];

    // Add third set if played
    if (set3Team1 && set3Team2) {
      sets.push({ team1: parseInt(set3Team1), team2: parseInt(set3Team2) });
    }

    // Determine winner (best of 3 sets)
    let team1Sets = 0;
    let team2Sets = 0;
    sets.forEach(set => {
      if (set.team1 > set.team2) team1Sets++;
      else team2Sets++;
    });

    const newMatch = {
      id: Date.now(),
      date: new Date().toLocaleDateString(),
      team1: [team1Player1, team1Player2],
      team2: [team2Player1, team2Player2],
      sets: sets,
      winner: team1Sets > team2Sets ? 'team1' : 'team2'
    };

    setMatches([...matches, newMatch]);
    
    // Reset form
    setSelectedPlayers({
      team1Player1: '',
      team1Player2: '',
      team2Player1: '',
      team2Player2: ''
    });
    setMatchScore({
      set1Team1: '',
      set1Team2: '',
      set2Team1: '',
      set2Team2: '',
      set3Team1: '',
      set3Team2: ''
    });
    setShowMatchForm(false);
  };

  const formatMatchScore = (match) => {
    return match.sets.map(set => `${set.team1}-${set.team2}`).join(', ');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <div className="max-w-4xl mx-auto p-4">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
                <Trophy className="text-yellow-500" />
                Madrid Padel Team
              </h1>
              <p className="text-gray-600 mt-1">ATP-Style Rankings & Match Tracking</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowAddPlayer(true)}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
              >
                <UserPlus size={16} />
                Add Player
              </button>
              <button
                onClick={() => setShowMatchForm(true)}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
              >
                <Plus size={16} />
                Add Match
              </button>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-xl shadow-lg mb-6">
          <div className="flex border-b">
            <button
              onClick={() => setActiveTab('rankings')}
              className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors ${
                activeTab === 'rankings' 
                  ? 'text-blue-600 border-b-2 border-blue-600' 
                  : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              <TrendingUp size={16} />
              Rankings
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors ${
                activeTab === 'history' 
                  ? 'text-blue-600 border-b-2 border-blue-600' 
                  : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              <History size={16} />
              Match History
            </button>
            <button
              onClick={() => setActiveTab('players')}
              className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors ${
                activeTab === 'players' 
                  ? 'text-blue-600 border-b-2 border-blue-600' 
                  : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              <Users size={16} />
              Players ({players.length})
            </button>
          </div>
        </div>

        {/* Rankings Tab */}
        {activeTab === 'rankings' && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Current Rankings</h2>
            {players.length === 0 ? (
              <div className="text-center py-12">
                <Users size={48} className="text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 text-lg">No players added yet</p>
                <p className="text-gray-500">Add players to start tracking rankings</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-gray-200">
                      <th className="text-left py-3 px-2 font-semibold text-gray-700">Rank</th>
                      <th className="text-left py-3 px-2 font-semibold text-gray-700">Player</th>
                      <th className="text-center py-3 px-2 font-semibold text-gray-700">Points</th>
                      <th className="text-center py-3 px-2 font-semibold text-gray-700">Matches</th>
                      <th className="text-center py-3 px-2 font-semibold text-gray-700">Wins</th>
                      <th className="text-center py-3 px-2 font-semibold text-gray-700">Win %</th>
                    </tr>
                  </thead>
                  <tbody>
                    {getRankings().map((player) => (
                      <tr key={player.name} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-2">
                          <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold ${
                            player.rank === 1 ? 'bg-yellow-100 text-yellow-800' :
                            player.rank === 2 ? 'bg-gray-100 text-gray-800' :
                            player.rank === 3 ? 'bg-orange-100 text-orange-800' :
                            'bg-blue-100 text-blue-800'
                          }`}>
                            {player.rank}
                          </span>
                        </td>
                        <td className="py-3 px-2 font-medium text-gray-800">{player.name}</td>
                        <td className="py-3 px-2 text-center font-semibold text-blue-600">{player.points}</td>
                        <td className="py-3 px-2 text-center text-gray-600">{player.matches}</td>
                        <td className="py-3 px-2 text-center text-gray-600">{player.wins}</td>
                        <td className="py-3 px-2 text-center text-gray-600">
                          {player.matches > 0 ? Math.round((player.wins / player.matches) * 100) : 0}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Match History Tab */}
        {activeTab === 'history' && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Match History</h2>
            {matches.length === 0 ? (
              <div className="text-center py-12">
                <History size={48} className="text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 text-lg">No matches recorded yet</p>
                <p className="text-gray-500">Add your first match to see history</p>
              </div>
            ) : (
              <div className="space-y-4">
                {matches.slice().reverse().map((match) => (
                  <div key={match.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                    <div className="flex justify-between items-start mb-2">
                      <div className="text-sm text-gray-500">{match.date}</div>
                      <div className="text-sm font-medium text-gray-700">
                        Score: {formatMatchScore(match)}
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                      <div className={`text-center p-3 rounded-lg ${
                        match.winner === 'team1' ? 'bg-green-100 border-2 border-green-300' : 'bg-gray-100'
                      }`}>
                        <div className="font-semibold text-gray-800">Team 1</div>
                        <div className="text-sm text-gray-600">
                          {match.team1[0]} & {match.team1[1]}
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-gray-700">VS</div>
                      </div>
                      <div className={`text-center p-3 rounded-lg ${
                        match.winner === 'team2' ? 'bg-green-100 border-2 border-green-300' : 'bg-gray-100'
                      }`}>
                        <div className="font-semibold text-gray-800">Team 2</div>
                        <div className="text-sm text-gray-600">
                          {match.team2[0]} & {match.team2[1]}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Players Tab */}
        {activeTab === 'players' && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Team Players</h2>
            {players.length === 0 ? (
              <div className="text-center py-12">
                <Users size={48} className="text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 text-lg">No players added yet</p>
                <button
                  onClick={() => setShowAddPlayer(true)}
                  className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors"
                >
                  Add First Player
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {players.map((player, index) => (
                  <div key={index} className="bg-gradient-to-r from-blue-50 to-green-50 rounded-lg p-4 border border-gray-200">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                        {player.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-semibold text-gray-800">{player}</div>
                        <div className="text-sm text-gray-600">
                          {calculatePoints(player)} points
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Add Player Modal */}
        {showAddPlayer && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-md">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Add New Player</h3>
              <input
                type="text"
                value={newPlayerName}
                onChange={(e) => setNewPlayerName(e.target.value)}
                placeholder="Enter player name"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-4 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                onKeyPress={(e) => e.key === 'Enter' && addPlayer()}
              />
              <div className="flex gap-2">
                <button
                  onClick={addPlayer}
                  className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg transition-colors"
                >
                  Add Player
                </button>
                <button
                  onClick={() => {
                    setShowAddPlayer(false);
                    setNewPlayerName('');
                  }}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Add Match Modal */}
        {showMatchForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-screen overflow-y-auto">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Record Match Result</h3>
              
              {players.length < 4 ? (
                <div className="text-center py-8">
                  <p className="text-gray-600 mb-4">You need at least 4 players to record a match</p>
                  <button
                    onClick={() => setShowMatchForm(false)}
                    className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-6 py-2 rounded-lg transition-colors"
                  >
                    Close
                  </button>
                </div>
              ) : (
                <>
                  {/* Team Selection */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="bg-blue-50 rounded-lg p-4">
                      <h4 className="font-semibold text-gray-800 mb-3">Team 1</h4>
                      <div className="space-y-2">
                        <select
                          value={selectedPlayers.team1Player1}
                          onChange={(e) => setSelectedPlayers({...selectedPlayers, team1Player1: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="">Select Player 1</option>
                          {players.filter(p => !Object.values(selectedPlayers).includes(p) || p === selectedPlayers.team1Player1).map(player => (
                            <option key={player} value={player}>{player}</option>
                          ))}
                        </select>
                        <select
                          value={selectedPlayers.team1Player2}
                          onChange={(e) => setSelectedPlayers({...selectedPlayers, team1Player2: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="">Select Player 2</option>
                          {players.filter(p => !Object.values(selectedPlayers).includes(p) || p === selectedPlayers.team1Player2).map(player => (
                            <option key={player} value={player}>{player}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="bg-green-50 rounded-lg p-4">
                      <h4 className="font-semibold text-gray-800 mb-3">Team 2</h4>
                      <div className="space-y-2">
                        <select
                          value={selectedPlayers.team2Player1}
                          onChange={(e) => setSelectedPlayers({...selectedPlayers, team2Player1: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                        >
                          <option value="">Select Player 1</option>
                          {players.filter(p => !Object.values(selectedPlayers).includes(p) || p === selectedPlayers.team2Player1).map(player => (
                            <option key={player} value={player}>{player}</option>
                          ))}
                        </select>
                        <select
                          value={selectedPlayers.team2Player2}
                          onChange={(e) => setSelectedPlayers({...selectedPlayers, team2Player2: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                        >
                          <option value="">Select Player 2</option>
                          {players.filter(p => !Object.values(selectedPlayers).includes(p) || p === selectedPlayers.team2Player2).map(player => (
                            <option key={player} value={player}>{player}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Score Input */}
                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-800 mb-3">Match Score</h4>
                    <div className="space-y-4">
                      {/* Set 1 */}
                      <div className="flex items-center gap-4">
                        <span className="w-12 font-medium">Set 1:</span>
                        <input
                          type="number"
                          min="0"
                          max="7"
                          value={matchScore.set1Team1}
                          onChange={(e) => setMatchScore({...matchScore, set1Team1: e.target.value})}
                          className="w-16 px-2 py-1 border border-gray-300 rounded text-center"
                          placeholder="0"
                        />
                        <span>-</span>
                        <input
                          type="number"
                          min="0"
                          max="7"
                          value={matchScore.set1Team2}
                          onChange={(e) => setMatchScore({...matchScore, set1Team2: e.target.value})}
                          className="w-16 px-2 py-1 border border-gray-300 rounded text-center"
                          placeholder="0"
                        />
                      </div>

                      {/* Set 2 */}
                      <div className="flex items-center gap-4">
                        <span className="w-12 font-medium">Set 2:</span>
                        <input
                          type="number"
                          min="0"
                          max="7"
                          value={matchScore.set2Team1}
                          onChange={(e) => setMatchScore({...matchScore, set2Team1: e.target.value})}
                          className="w-16 px-2 py-1 border border-gray-300 rounded text-center"
                          placeholder="0"
                        />
                        <span>-</span>
                        <input
                          type="number"
                          min="0"
                          max="7"
                          value={matchScore.set2Team2}
                          onChange={(e) => setMatchScore({...matchScore, set2Team2: e.target.value})}
                          className="w-16 px-2 py-1 border border-gray-300 rounded text-center"
                          placeholder="0"
                        />
                      </div>

                      {/* Set 3 (Optional) */}
                      <div className="flex items-center gap-4">
                        <span className="w-12 font-medium text-gray-600">Set 3:</span>
                        <input
                          type="number"
                          min="0"
                          max="7"
                          value={matchScore.set3Team1}
                          onChange={(e) => setMatchScore({...matchScore, set3Team1: e.target.value})}
                          className="w-16 px-2 py-1 border border-gray-300 rounded text-center"
                          placeholder="0"
                        />
                        <span className="text-gray-600">-</span>
                        <input
                          type="number"
                          min="0"
                          max="7"
                          value={matchScore.set3Team2}
                          onChange={(e) => setMatchScore({...matchScore, set3Team2: e.target.value})}
                          className="w-16 px-2 py-1 border border-gray-300 rounded text-center"
                          placeholder="0"
                        />
                        <span className="text-sm text-gray-500">(if played)</span>
                      </div>
                    </div>
                  </div>

                  {/* Buttons */}
                  <div className="flex gap-2">
                    <button
                      onClick={submitMatch}
                      className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg transition-colors"
                    >
                      Save Match
                    </button>
                    <button
                      onClick={() => setShowMatchForm(false)}
                      className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 rounded-lg transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PadelRankingApp;