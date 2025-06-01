// import React from "react";
// import "./UserSwitch.scss";
// import { useNavigate } from "react-router-dom";

// const fallbackAvatar = "/assets/default_avatar.png"; // You can adjust path

// const UserSwitch = ({
//   users,
//   currentUser,
//   selectedUser,
//   setCurrentUser,
//   getUserStats,
//   onUserClick
// }) => {
//   const navigate = useNavigate();

//   return (
//     <div className="user-switch">
//       <div className="user-switch__grid">
//         {users.map((userObj) => {
//           if (!userObj || typeof userObj !== "object" || !userObj.name) return null;

//           const isActive = userObj.name === currentUser;
//           const { groupCount, totalTarget, completed } = getUserStats(userObj.name);

//           return (
//             <div
//               key={userObj.name}
//               className={`dashboard__user-card ${isActive ? "active" : ""} ${
//                 userObj.name === selectedUser ? "selected" : ""
//               }`}
//               onClick={() => onUserClick(userObj.name)}
//             >
//               <div className="user-switch__avatar">
//                 <img
//                   src={userObj.avatar || fallbackAvatar}
//                   alt={userObj.name}
//                   className="user-switch__avatar-img"
//                 />
//               </div>

//               <div className="user-switch__info">
//                 <p className="user-switch__name">
//                   <strong>{userObj.name}</strong>
//                 </p>
//                 <p>{groupCount} groups</p>
//                 <p>💰 ${totalTarget}</p>
//                 <p>✅ {completed} completed</p>
//               </div>
//             </div>
//           );
//         })}
//       </div>
//     </div>
//   );
// };

// export default UserSwitch;


import React from "react";
import "./UserSwitch.scss";
import { useNavigate } from "react-router-dom";

const fallbackAvatar = "/assets/default_avatar.png"; // You can adjust path

const UserSwitch = ({
  users,
  currentUser,
  selectedUser,
  setCurrentUser,
  getUserStats,
  onUserClick
}) => {
  const navigate = useNavigate();

  return (
    <div className="user-switch">
      <div className="user-switch__grid">
        {users.map((userObj) => {
          if (!userObj || typeof userObj !== "object" || !userObj.name) return null;

          const isActive = userObj.name === currentUser;
          const { groupCount, totalTarget, completed } = getUserStats(userObj.name);

          return (
            <div
              key={userObj.name}
              className={`dashboard__user-card ${isActive ? "active" : ""} ${
                userObj.name === selectedUser ? "selected" : ""
              }`}
              onClick={() => onUserClick(userObj.name)}
            >
              <div className="user-switch__avatar">
                <img
                  src={userObj.avatar || fallbackAvatar}
                  alt={userObj.name}
                  className="user-switch__avatar-img"
                />
              </div>

              <div className="user-switch__info">
                <p className="user-switch__name">
                  <strong>{userObj.name}</strong>
                </p>
                <p>{groupCount} groups</p>
                <p>💰 ${totalTarget}</p>
                <p>✅ {completed} completed</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default UserSwitch;
