'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Users, Plus, Trophy, History, UserPlus, TrendingUp, Home, ChevronUp, X, Zap, Award, Target, BarChart3 } from 'lucide-react';

const PadelRankingApp = () => {
  const [activeTab, setActiveTab] = useState('rankings');
  const [players, setPlayers] = useState([]);
  const [matches, setMatches] = useState([]);
  const [showAddPlayer, setShowAddPlayer] = useState(false);
  const [showMatchForm, setShowMatchForm] = useState(false);
  const [showFAB, setShowFAB] = useState(false);
  const [newPlayerName, setNewPlayerName] = useState('');
  const [isFirstTime, setIsFirstTime] = useState(true);
  const touchStartRef = useRef(null);
  const touchEndRef = useRef(null);

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

  // Check if first time user
  useEffect(() => {
    setIsFirstTime(players.length === 0 && matches.length === 0);
  }, [players.length, matches.length]);

  // Swipe gesture handling
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    touchStartRef.current = e.changedTouches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!touchStartRef.current || !touchEndRef.current) return;
    
    const diff = touchStartRef.current - touchEndRef.current;
    const threshold = 50;

    if (Math.abs(diff) > threshold) {
      if (diff > 0) {
        // Swipe left - next tab
        const tabs = ['rankings', 'history', 'team'];
        const currentIndex = tabs.indexOf(activeTab);
        if (currentIndex < tabs.length - 1) {
          setActiveTab(tabs[currentIndex + 1]);
        }
      } else {
        // Swipe right - previous tab
        const tabs = ['rankings', 'history', 'team'];
        const currentIndex = tabs.indexOf(activeTab);
        if (currentIndex > 0) {
          setActiveTab(tabs[currentIndex - 1]);
        }
      }
    }
    
    touchStartRef.current = null;
    touchEndRef.current = null;
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    touchEndRef.current = e.changedTouches[0].clientX;
  };

  // Calculate ATP-style points
  const calculatePoints = (playerName: string) => {
    let matchWins = 0;
    let setWins = 0;
    let gameWins = 0;

    matches.forEach(match => {
      const isTeam1 = match.team1.includes(playerName);
      const isTeam2 = match.team2.includes(playerName);
      
      if (!isTeam1 && !isTeam2) return;

      const playerTeam = isTeam1 ? 'team1' : 'team2';
      const opponentTeam = isTeam1 ? 'team2' : 'team1';

      match.sets.forEach(set => {
        if (set[playerTeam] > set[opponentTeam]) {
          setWins++;
        }
        gameWins += set[playerTeam];
      });

      if (match.winner === playerTeam) {
        matchWins++;
      }
    });

    return (matchWins * 100) + (setWins * 10) + gameWins;
  };

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

  const addPlayer = () => {
    if (newPlayerName.trim() && !players.includes(newPlayerName.trim())) {
      setPlayers([...players, newPlayerName.trim()]);
      setNewPlayerName('');
      setShowAddPlayer(false);
      setShowFAB(false);
    }
  };

  const submitMatch = () => {
    const { team1Player1, team1Player2, team2Player1, team2Player2 } = selectedPlayers;
    const { set1Team1, set1Team2, set2Team1, set2Team2, set3Team1, set3Team2 } = matchScore;

    if (!team1Player1 || !team1Player2 || !team2Player1 || !team2Player2 ||
        !set1Team1 || !set1Team2 || !set2Team1 || !set2Team2) {
      alert('Please fill in all required fields');
      return;
    }

    const sets = [
      { team1: parseInt(set1Team1), team2: parseInt(set1Team2) },
      { team1: parseInt(set2Team1), team2: parseInt(set2Team2) }
    ];

    if (set3Team1 && set3Team2) {
      sets.push({ team1: parseInt(set3Team1), team2: parseInt(set3Team2) });
    }

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
    setShowFAB(false);
  };

  const formatMatchScore = (match) => {
    return match.sets.map(set => `${set.team1}-${set.team2}`).join(', ');
  };

  const getRecentMatches = () => {
    return matches.slice(-3).reverse();
  };

  const QuickStats = () => (
    <div className="grid grid-cols-3 gap-3 mb-4">
      <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl p-3 text-white text-center shadow-lg">
        <div className="text-2xl font-bold">{players.length}</div>
        <div className="text-xs opacity-90">Players</div>
      </div>
      <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl p-3 text-white text-center shadow-lg">
        <div className="text-2xl font-bold">{matches.length}</div>
        <div className="text-xs opacity-90">Matches</div>
      </div>
      <div className="bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl p-3 text-white text-center shadow-lg">
        <div className="text-2xl font-bold">{matches.length > 0 ? Math.round(matches.reduce((acc, m) => acc + m.sets.reduce((s, set) => s + set.team1 + set.team2, 0), 0) / matches.length) : 0}</div>
        <div className="text-xs opacity-90">Avg Sets</div>
      </div>
    </div>
  );

  const EmptyState = ({ icon: Icon, title, subtitle, action, actionText }: {
    icon: React.ComponentType<{ size: number; className?: string }>;
    title: string;
    subtitle: string;
    action?: () => void;
    actionText?: string;
  }) => (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mb-6 shadow-lg">
        <Icon size={32} className="text-blue-600" />
      </div>
      <h3 className="text-xl font-bold text-gray-800 mb-2">{title}</h3>
      <p className="text-gray-600 mb-6 max-w-sm">{subtitle}</p>
      {action && (
        <button
          onClick={action}
          className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-8 py-3 rounded-full font-semibold shadow-lg transform transition-all duration-200 hover:scale-105 active:scale-95"
        >
          {actionText}
        </button>
      )}
    </div>
  );

  return (
    <div 
      className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-cyan-50 relative"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Header */}
      <div className="bg-white/90 backdrop-blur-sm shadow-lg sticky top-0 z-40">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="text-center">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent flex items-center justify-center gap-2">
              <Trophy className="text-yellow-500" size={24} />
              Kuikma CUP
            </h1>
            <p className="text-sm text-gray-600 mt-1">ATP Rankings & Stats</p>
          </div>
          
          {!isFirstTime && <QuickStats />}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-md mx-auto px-4 pb-24 pt-4">
        {/* Rankings Tab */}
        {activeTab === 'rankings' && (
          <div className="space-y-4">
            {isFirstTime ? (
              <EmptyState
                icon={Trophy}
                title="Welcome to Kuikma CUP!"
                subtitle="Start by adding your team players to begin tracking rankings and matches"
                action={() => setShowAddPlayer(true)}
                actionText="Add First Player"
              />
            ) : (
              <>
                {/* Recent Matches Section */}
                {matches.length > 0 && (
                  <div className="bg-white rounded-2xl shadow-lg p-4 mb-4">
                    <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                      <Zap size={16} className="text-blue-600" />
                      Recent Matches
                    </h3>
                    <div className="space-y-2">
                      {getRecentMatches().map((match) => (
                        <div key={match.id} className="bg-gray-50 rounded-xl p-3">
                          <div className="flex justify-between items-center">
                            <div className="text-sm">
                              <div className="font-medium">{match.team1.join(' & ')}</div>
                              <div className="text-gray-600">vs {match.team2.join(' & ')}</div>
                            </div>
                            <div className="text-right">
                              <div className="text-sm font-bold text-blue-600">{formatMatchScore(match)}</div>
                              <div className="text-xs text-gray-500">{match.date}</div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Rankings */}
                <div className="bg-white rounded-2xl shadow-lg p-4">
                  <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <Award size={20} className="text-yellow-500" />
                    Current Rankings
                  </h2>
                  {players.length === 0 ? (
                    <EmptyState
                      icon={Users}
                      title="No Players Yet"
                      subtitle="Add team members to start tracking rankings"
                      action={() => setShowAddPlayer(true)}
                      actionText="Add Players"
                    />
                  ) : (
                    <div className="space-y-3">
                      {getRankings().map((player) => (
                        <div key={player.name} className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg ${
                            player.rank === 1 ? 'bg-gradient-to-br from-yellow-400 to-yellow-600' :
                            player.rank === 2 ? 'bg-gradient-to-br from-gray-400 to-gray-600' :
                            player.rank === 3 ? 'bg-gradient-to-br from-orange-400 to-orange-600' :
                            'bg-gradient-to-br from-blue-400 to-indigo-600'
                          }`}>
                            #{player.rank}
                          </div>
                          <div className="flex-1">
                            <div className="font-semibold text-gray-800">{player.name}</div>
                            <div className="text-sm text-gray-600">{player.points} pts • {player.matches} matches</div>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-bold text-blue-600">{player.wins}</div>
                            <div className="text-xs text-gray-500">wins</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        )}

        {/* Match History Tab */}
        {activeTab === 'history' && (
          <div className="bg-white rounded-2xl shadow-lg p-4">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <History size={20} className="text-blue-500" />
              Match History
            </h2>
            {matches.length === 0 ? (
              <EmptyState
                icon={Target}
                title="No Matches Yet"
                subtitle="Record your first match to see the history and start building team statistics"
                action={() => setShowMatchForm(true)}
                actionText="Add First Match"
              />
            ) : (
              <div className="space-y-3">
                {matches.slice().reverse().map((match) => (
                  <div key={match.id} className="border border-gray-200 rounded-xl p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex justify-between items-start mb-3">
                      <div className="text-sm text-gray-500">{match.date}</div>
                      <div className="text-sm font-bold text-blue-600">
                        {formatMatchScore(match)}
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-3 items-center">
                      <div className={`text-center p-3 rounded-xl ${
                        match.winner === 'team1' ? 'bg-blue-100 border-2 border-blue-300' : 'bg-gray-100'
                      }`}>
                        <div className="font-semibold text-gray-800 text-sm">Team 1</div>
                        <div className="text-xs text-gray-600 mt-1">
                          {match.team1[0]} & {match.team1[1]}
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm font-bold text-gray-700">VS</div>
                      </div>
                      <div className={`text-center p-3 rounded-xl ${
                        match.winner === 'team2' ? 'bg-blue-100 border-2 border-blue-300' : 'bg-gray-100'
                      }`}>
                        <div className="font-semibold text-gray-800 text-sm">Team 2</div>
                        <div className="text-xs text-gray-600 mt-1">
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

        {/* Team Tab */}
        {activeTab === 'team' && (
          <div className="bg-white rounded-2xl shadow-lg p-4">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Users size={20} className="text-purple-500" />
              Team ({players.length})
            </h2>
            {players.length === 0 ? (
              <EmptyState
                icon={Users}
                title="Build Your Team"
                subtitle="Add team members to start tracking individual performance and create match pairings"
                action={() => setShowAddPlayer(true)}
                actionText="Add Team Members"
              />
            ) : (
              <div className="grid grid-cols-1 gap-3">
                {players.map((player, index) => (
                  <div key={index} className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                        {player.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-gray-800">{player}</div>
                        <div className="text-sm text-gray-600">
                          {calculatePoints(player)} points
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-blue-600">
                          {matches.filter(m => 
                            (m.team1.includes(player) && m.winner === 'team1') ||
                            (m.team2.includes(player) && m.winner === 'team2')
                          ).length}
                        </div>
                        <div className="text-xs text-gray-500">wins</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Floating Action Button */}
      {!isFirstTime && (
        <div className="fixed bottom-20 right-4 z-50">
          {showFAB && (
            <div className="absolute bottom-16 right-0 space-y-3 animate-in fade-in duration-200">
              <button
                onClick={() => {
                  setShowAddPlayer(true);
                  setShowFAB(false);
                }}
                className="flex items-center gap-3 bg-white shadow-lg rounded-full px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-all duration-200 hover:scale-105"
              >
                <UserPlus size={16} className="text-blue-500" />
                Add Player
              </button>
              <button
                onClick={() => {
                  setShowMatchForm(true);
                  setShowFAB(false);
                }}
                className="flex items-center gap-3 bg-white shadow-lg rounded-full px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-all duration-200 hover:scale-105"
              >
                <BarChart3 size={16} className="text-blue-500" />
                Add Match
              </button>
            </div>
          )}
          <button
            onClick={() => setShowFAB(!showFAB)}
            className={`w-14 h-14 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 rounded-full shadow-lg flex items-center justify-center text-white transition-all duration-300 hover:scale-110 active:scale-95 ${
              showFAB ? 'rotate-45' : 'rotate-0'
            }`}
          >
            <Plus size={24} />
          </button>
        </div>
      )}

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-gray-200 z-40">
        <div className="max-w-md mx-auto px-4">
          <div className="flex justify-around py-2">
            <button
              onClick={() => setActiveTab('rankings')}
              className={`flex flex-col items-center gap-1 py-2 px-4 rounded-xl transition-all duration-200 min-h-[44px] ${
                activeTab === 'rankings'
                  ? 'text-blue-600 bg-blue-50'
                  : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              <TrendingUp size={20} />
              <span className="text-xs font-medium">Rankings</span>
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`flex flex-col items-center gap-1 py-2 px-4 rounded-xl transition-all duration-200 min-h-[44px] ${
                activeTab === 'history'
                  ? 'text-blue-600 bg-blue-50'
                  : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              <History size={20} />
              <span className="text-xs font-medium">History</span>
            </button>
            <button
              onClick={() => setActiveTab('team')}
              className={`flex flex-col items-center gap-1 py-2 px-4 rounded-xl transition-all duration-200 min-h-[44px] ${
                activeTab === 'team'
                  ? 'text-purple-600 bg-purple-50'
                  : 'text-gray-600 hover:text-purple-600'
              }`}
            >
              <Users size={20} />
              <span className="text-xs font-medium">Team</span>
            </button>
          </div>
        </div>
      </div>

      {/* Add Player Modal */}
      {showAddPlayer && (
        <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center p-4 z-50">
          <div className="bg-white rounded-t-2xl sm:rounded-2xl p-6 w-full max-w-md animate-in slide-in-from-bottom duration-300">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-800">Add New Player</h3>
              <button
                onClick={() => setShowAddPlayer(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X size={20} className="text-gray-500" />
              </button>
            </div>
            <input
              type="text"
              value={newPlayerName}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewPlayerName(e.target.value)}
              placeholder="Enter player name"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl mb-4 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
              onKeyPress={(e: React.KeyboardEvent<HTMLInputElement>) => e.key === 'Enter' && addPlayer()}
              autoFocus
            />
            <div className="flex gap-3">
              <button
                onClick={addPlayer}
                className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white py-3 rounded-xl font-semibold transition-all duration-200 hover:scale-105 active:scale-95"
              >
                Add Player
              </button>
              <button
                onClick={() => setShowAddPlayer(false)}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-xl font-semibold transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Match Modal */}
      {showMatchForm && (
        <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center p-4 z-50">
          <div className="bg-white rounded-t-2xl sm:rounded-2xl p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto animate-in slide-in-from-bottom duration-300">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-800">Record Match</h3>
              <button
                onClick={() => setShowMatchForm(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X size={20} className="text-gray-500" />
              </button>
            </div>
            
            {players.length < 4 ? (
              <div className="text-center py-8">
                <Target size={48} className="text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">You need at least 4 players to record a match</p>
                <button
                  onClick={() => setShowMatchForm(false)}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-xl font-semibold transition-colors"
                >
                  Close
                </button>
              </div>
            ) : (
              <>
                {/* Team Selection */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="bg-blue-50 rounded-xl p-4">
                    <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      Team 1
                    </h4>
                    <div className="space-y-3">
                      <select
                        value={selectedPlayers.team1Player1}
                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedPlayers({...selectedPlayers, team1Player1: e.target.value})}
                        className="w-full px-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 text-lg"
                      >
                        <option value="">Select Player 1</option>
                        {players.filter(p => !Object.values(selectedPlayers).includes(p) || p === selectedPlayers.team1Player1).map(player => (
                          <option key={player} value={player}>{player}</option>
                        ))}
                      </select>
                      <select
                        value={selectedPlayers.team1Player2}
                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedPlayers({...selectedPlayers, team1Player2: e.target.value})}
                        className="w-full px-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 text-lg"
                      >
                        <option value="">Select Player 2</option>
                        {players.filter(p => !Object.values(selectedPlayers).includes(p) || p === selectedPlayers.team1Player2).map(player => (
                          <option key={player} value={player}>{player}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="bg-blue-50 rounded-xl p-4">
                    <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      Team 2
                    </h4>
                    <div className="space-y-3">
                      <select
                        value={selectedPlayers.team2Player1}
                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedPlayers({...selectedPlayers, team2Player1: e.target.value})}
                        className="w-full px-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 text-lg"
                      >
                        <option value="">Select Player 1</option>
                        {players.filter(p => !Object.values(selectedPlayers).includes(p) || p === selectedPlayers.team2Player1).map(player => (
                          <option key={player} value={player}>{player}</option>
                        ))}
                      </select>
                      <select
                        value={selectedPlayers.team2Player2}
                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedPlayers({...selectedPlayers, team2Player2: e.target.value})}
                        className="w-full px-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 text-lg"
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
                  <h4 className="font-semibold text-gray-800 mb-4">Match Score</h4>
                  <div className="space-y-4">
                    {/* Set 1 */}
                    <div className="flex items-center justify-center gap-4">
                      <span className="w-16 font-medium text-center">Set 1</span>
                      <input
                        type="number"
                        min="0"
                        max="7"
                        value={matchScore.set1Team1}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setMatchScore({...matchScore, set1Team1: e.target.value})}
                        className="w-16 h-12 px-2 border border-gray-300 rounded-xl text-center text-lg font-semibold"
                        placeholder="0"
                      />
                      <span className="text-lg font-bold">-</span>
                      <input
                        type="number"
                        min="0"
                        max="7"
                        value={matchScore.set1Team2}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setMatchScore({...matchScore, set1Team2: e.target.value})}
                        className="w-16 h-12 px-2 border border-gray-300 rounded-xl text-center text-lg font-semibold"
                        placeholder="0"
                      />
                    </div>

                    {/* Set 2 */}
                    <div className="flex items-center justify-center gap-4">
                      <span className="w-16 font-medium text-center">Set 2</span>
                      <input
                        type="number"
                        min="0"
                        max="7"
                        value={matchScore.set2Team1}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setMatchScore({...matchScore, set2Team1: e.target.value})}
                        className="w-16 h-12 px-2 border border-gray-300 rounded-xl text-center text-lg font-semibold"
                        placeholder="0"
                      />
                      <span className="text-lg font-bold">-</span>
                      <input
                        type="number"
                        min="0"
                        max="7"
                        value={matchScore.set2Team2}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setMatchScore({...matchScore, set2Team2: e.target.value})}
                        className="w-16 h-12 px-2 border border-gray-300 rounded-xl text-center text-lg font-semibold"
                        placeholder="0"
                      />
                    </div>

                    {/* Set 3 (Optional) */}
                    <div className="flex items-center justify-center gap-4">
                      <span className="w-16 font-medium text-center text-gray-600">Set 3</span>
                      <input
                        type="number"
                        min="0"
                        max="7"
                        value={matchScore.set3Team1}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setMatchScore({...matchScore, set3Team1: e.target.value})}
                        className="w-16 h-12 px-2 border border-gray-300 rounded-xl text-center text-lg font-semibold"
                        placeholder="0"
                      />
                      <span className="text-lg font-bold text-gray-600">-</span>
                      <input
                        type="number"
                        min="0"
                        max="7"
                        value={matchScore.set3Team2}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setMatchScore({...matchScore, set3Team2: e.target.value})}
                        className="w-16 h-12 px-2 border border-gray-300 rounded-xl text-center text-lg font-semibold"
                        placeholder="0"
                      />
                      <span className="text-sm text-gray-500 ml-2">(optional)</span>
                    </div>
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={submitMatch}
                    className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white py-3 rounded-xl font-semibold transition-all duration-200 hover:scale-105 active:scale-95"
                  >
                    Save Match
                  </button>
                  <button
                    onClick={() => setShowMatchForm(false)}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-xl font-semibold transition-colors"
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
  );
};

export default PadelRankingApp;