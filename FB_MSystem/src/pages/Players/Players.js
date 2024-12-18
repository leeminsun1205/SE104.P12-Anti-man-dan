import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import './Players.css'; // Thêm file CSS để cải thiện giao diện

const initialPlayers = {
  1: [
    { id: 1, name: 'Cầu thủ A1', position: 'Tiền đạo', age: 24 },
    { id: 2, name: 'Cầu thủ A2', position: 'Tiền vệ', age: 27 },
  ],
  2: [
    { id: 1, name: 'Cầu thủ B1', position: 'Hậu vệ', age: 22 },
    { id: 2, name: 'Cầu thủ B2', position: 'Thủ môn', age: 30 },
  ],
  3: [
    { id: 1, name: 'Cầu thủ C1', position: 'Tiền đạo', age: 25 },
    { id: 2, name: 'Cầu thủ C2', position: 'Tiền vệ', age: 28 },
  ],
};

function Player() {
  const { teamId } = useParams();
  const [players, setPlayers] = useState(initialPlayers);
  const [searchTerm, setSearchTerm] = useState('');
  const [newPlayer, setNewPlayer] = useState({ name: '', position: '', age: '' });
  const [editPlayer, setEditPlayer] = useState(null);
  const [deletedPlayer, setDeletedPlayer] = useState(null);

  const teamPlayers = players[teamId] || [];

  const filteredPlayers = teamPlayers.filter(player =>
    player.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddPlayer = () => {
    if (newPlayer.name && newPlayer.position && newPlayer.age) {
      const updatedPlayers = [...teamPlayers, { id: Date.now(), ...newPlayer }];
      setPlayers({ ...players, [teamId]: updatedPlayers });
      setNewPlayer({ name: '', position: '', age: '' });
    }
  };

  const handleDeletePlayer = (id) => {
    const playerToDelete = teamPlayers.find(player => player.id === id);
    setDeletedPlayer({ ...playerToDelete, teamId });
    setPlayers({ ...players, [teamId]: teamPlayers.filter(player => player.id !== id) });
  };

  const handleUndoDelete = () => {
    if (deletedPlayer) {
      const updatedPlayers = [...players[deletedPlayer.teamId], deletedPlayer];
      setPlayers({ ...players, [deletedPlayer.teamId]: updatedPlayers });
      setDeletedPlayer(null);
    }
  };

  const handleUpdatePlayer = () => {
    const updatedPlayers = teamPlayers.map(player =>
      player.id === editPlayer.id ? editPlayer : player
    );
    setPlayers({ ...players, [teamId]: updatedPlayers });
    setEditPlayer(null);
  };

  return (
    <div className="players-container">
      <h2>Quản lý cầu thủ</h2>

      {/* Thanh tìm kiếm */}
      <input
        type="text"
        placeholder="Tìm kiếm cầu thủ..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-input"
      />

      {/* Thêm cầu thủ mới */}
      <div className="add-player-form">
        <input
          type="text"
          placeholder="Tên cầu thủ"
          value={newPlayer.name}
          onChange={(e) => setNewPlayer({ ...newPlayer, name: e.target.value })}
        />
        <input
          type="text"
          placeholder="Vị trí"
          value={newPlayer.position}
          onChange={(e) => setNewPlayer({ ...newPlayer, position: e.target.value })}
        />
        <input
          type="number"
          placeholder="Tuổi"
          value={newPlayer.age}
          onChange={(e) => setNewPlayer({ ...newPlayer, age: parseInt(e.target.value) })}
        />
        <button onClick={handleAddPlayer}>Thêm cầu thủ</button>
      </div>

      {/* Danh sách cầu thủ */}
      <ul className="player-list">
        {filteredPlayers.length > 0 ? (
          filteredPlayers.map(player => (
            <li key={player.id} className="player-card">
              {editPlayer && editPlayer.id === player.id ? (
                <div className="edit-player-form">
                  <input
                    type="text"
                    value={editPlayer.name}
                    onChange={(e) => setEditPlayer({ ...editPlayer, name: e.target.value })}
                  />
                  <input
                    type="text"
                    value={editPlayer.position}
                    onChange={(e) => setEditPlayer({ ...editPlayer, position: e.target.value })}
                  />
                  <input
                    type="number"
                    value={editPlayer.age}
                    onChange={(e) => setEditPlayer({ ...editPlayer, age: parseInt(e.target.value) })}
                  />
                  <button onClick={handleUpdatePlayer}>Lưu</button>
                  <button onClick={() => setEditPlayer(null)}>Hủy</button>
                </div>
              ) : (
                <div className="player-details">
                  <h3>{player.name}</h3>
                  <p>Vị trí: {player.position}</p>
                  <p>Tuổi: {player.age}</p>
                  <button onClick={() => setEditPlayer(player)}>Sửa</button>
                  <button onClick={() => handleDeletePlayer(player.id)}>Xóa</button>
                </div>
              )}
            </li>
          ))
        ) : (
          <p>Không tìm thấy cầu thủ nào.</p>
        )}
      </ul>

      {/* Nút Hoàn tác Xóa */}
      {deletedPlayer && (
        <button onClick={handleUndoDelete} className="undo-delete-btn">
          Hoàn tác xóa
        </button>
      )}
    </div>
  );
}

export default Player;
