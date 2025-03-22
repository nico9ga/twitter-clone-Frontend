import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./EditProfilePage.css";
const EditProfilePage = () => {
  const navigate = useNavigate();
  const { username } = useParams(); // Obtener el username desde la URL

  const [fullName, setFullName] = useState(""); // Estado para el nombre
  const [bio, setBio] = useState(""); // Estado para la biografía

  const handleSave = () => {
    // Aquí iría la lógica para actualizar la información en la base de datos
    console.log("Guardando cambios:", { fullName, bio });
    navigate(`/profile/${username}`); // Redirigir al perfil actualizado
  };

  return (
    <div className="edit-profile-container">
      <h1>Editar Perfil</h1>
      <label>
        Nombre completo:
        <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} />
      </label>
      <label>
        Biografía:
        <textarea value={bio} onChange={(e) => setBio(e.target.value)} />
      </label>
      <button onClick={handleSave}>Guardar cambios</button>
      <button onClick={() => navigate(-1)}>Cancelar</button>
    </div>
  );
};

export default EditProfilePage;
