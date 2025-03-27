import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import "./EditProfilePage.css";

const EditProfilePage = ({ onUpdateProfile }) => {
  const location = useLocation();
  const storedUser = JSON.parse(localStorage.getItem("editUser")) || {};
  const user = location.state?.user || storedUser;
  const navigate = useNavigate();
  const [fullName, setName] = useState(user?.fullName || "");
  const [email, setEmail] = useState(user?.email || "");
  const [showPasswordFields, setShowPasswordFields] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  useEffect(() => {
    if (user) {
      setName(user.fullName || "");
      setEmail(user.email || "");
    }
  }, [user]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const updatedUser = { ...user, fullName };
    localStorage.setItem("editUser", JSON.stringify(updatedUser));
  
    navigate(`/profile/${user.username}`);
    //onUpdateProfile(updatedUser);
  };
  
  const handleCancel = () => {
    navigate(`/profile/${user.username}`);
  };

  if (!user) {
    return <p>Cargando perfil...</p>;
  }

  return (
    <div className="edit-profile-container">
      <h2>Editar Perfil</h2>
      
      {/* Email solo lectura */}
      <p className="email-display">{email}</p>

      <form onSubmit={handleSubmit}>
        <label>Nombre</label>
        <input type="text" value={fullName} onChange={(e) => setName(e.target.value)} required />

        {/* Botón para cambiar la contraseña */}
        <button type="button" className="change-password-button" onClick={() => setShowPasswordFields(!showPasswordFields)}>
          Cambiar Contraseña
        </button>

        {/* Campos de contraseña que aparecen al hacer clic */}
        {showPasswordFields && (
          <>
            <label>Contraseña Actual</label>
            <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} required />

            <label>Nueva Contraseña</label>
            <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
          </>
        )}

        {/* Botones Confirmar y Cancelar */}
        <div className="button-group">
          <button type="submit" className="confirm-button">Confirmar</button>
          <button type="button" className="cancel-button" onClick={() => handleCancel()}>Cancelar</button>
        </div>
      </form>
    </div>
  );
};

export default EditProfilePage;
