import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
// Contexto global de autenticação
import { useForm } from "react-hook-form"; // Biblioteca para gerir o formulário
import { toast } from "react-toastify"; // Feedback visual de alertas
import { useNavigate, Link } from "react-router-dom"; // Navegação entre rotas
import { FaEye, FaEyeSlash } from "react-icons/fa";
// Ícones de visibilidade da password
import "./Profile.css";

const Profile = () => {
    // 1. Métodos e Estados Globais / Navegação
    const { user, login, logout } = useAuth();
    const navigate = useNavigate();

    // 2. Estados de Controlo da Interface
    const [isEditing, setIsEditing] = useState(false); // Alterna o modo Visualização / Edição
    const [showPass, setShowPass] = useState(false); // Alterna visibilidade da password

    // 3. Inicialização do React Hook Form com os defaultValues do utilizador logado
    const { register, handleSubmit, reset } = useForm({
        defaultValues: user
    });

    // Expressão Regular (Regex) idêntica à do Auth.jsx
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$!%*?&])[A-Za-z\d@#$!%*?&]{6,}$/;

    // 4. LÓGICA DE ATUALIZAÇÃO DE DADOS
    const onUpdate = (data) => {
        if (data.password && data.password !== data.confirmPassword) {
            toast.error("As palavras-passe não coincidem!");
            return;
        }

        if (data.password && !passwordRegex.test(data.password)) {
            toast.error("A nova password deve ter no mínimo 6 caracteres, com maiúscula, minúscula, número e um símbolo (ex: #).");
            return;
        }

        const finalData = { ...data };

        if (!finalData.password) {
            delete finalData.password;
            delete finalData.confirmPassword;
        } else {
            delete finalData.confirmPassword;
        }

        const savedUsers = JSON.parse(localStorage.getItem("registrations") || "[]");
        const updatedUsers = savedUsers.map(u => u.email === user.email ? { ...u, ...finalData } : u);
        localStorage.setItem("registrations", JSON.stringify(updatedUsers));

        login({ ...user, ...finalData }, localStorage.getItem("token"));
        setIsEditing(false);
        toast.success("Perfil updated com sucesso!");
    };

    // 5. LÓGICA DE ELIMINAÇÃO DE CONTA
    const confirmDeleteAccount = () => {
        const users = JSON.parse(localStorage.getItem("registrations") || "[]");
        const filtered = users.filter(u => u.email !== user.email);
        localStorage.setItem("registrations", JSON.stringify(filtered));

        logout();
        navigate("/");
        toast.info("A tua conta foi permanentemente eliminada.");
    };

    const handleDelete = () => {
        toast.warn(
            ({ closeToast }) => (
                <div className="custom-toast-confirm">
                    <p style={{ margin: "0 0 10px 0", fontWeight: "bold" }}>
                        ⚠️ Tens a certeza que queres apagar a tua conta?
                    </p>
                    <p style={{ margin: "0 0 15px 0", fontSize: "13px", color: "#555" }}>
                        Esta ação é irreversível e vais perder todos os teus dados salvos.
                    </p>
                    <div style={{ display: "flex", gap: "10px" }}>
                        <button onClick={() => { confirmDeleteAccount(); closeToast(); }}
                            style={{ background: "#dc3545", color: "#fff", border: "none", padding: "6px 12px", borderRadius: "4px", cursor: "pointer", fontWeight: "bold" }}>
                            Sim, Apagar
                        </button>
                        <button onClick={closeToast}
                            style={{ background: "#6c757d", color: "#fff", border: "none", padding: "6px 12px", borderRadius: "4px", cursor: "pointer" }}>
                            Cancelar
                        </button>
                    </div>
                </div>
            ),
            { position: "top-center", autoClose: false, closeOnClick: false, draggable: false, closeButton: false }
        );
    };

    if (!user) return <p>A carregar dados do perfil...</p>;

    return (
        <div className="profile-container">
            {/* Wrapper consistente para o botão de voltar */}
            <div className="back-home-wrapper">
                <Link to="/" className="btn-back-home">
                    ← Voltar para a Home
                </Link>
            </div>

            <h1>O meu Perfil</h1>

            {/* --- MODO VISUALIZAÇÃO --- */}
            {!isEditing ? (
                <div className="profile-view">
                    <p><strong>Nome:</strong> {user.nome} {user.apelido}</p>
                    <p><strong>NIF:</strong> {user.nif}</p>
                    <p><strong>Contacto:</strong> {user.telemovel || "Não associado"}</p>
                    <p><strong>Morada:</strong> {user.morada?.logradouro}, nº {user.morada?.numero}</p>
                    <p><strong>Andar/Porta:</strong> {user.morada?.andar || "N/A"}</p>
                    <p><strong>Localidade:</strong> {user.morada?.cidade}, {user.morada?.codigoPostal}</p>
                    <p><strong>País:</strong> {user.morada?.pais}</p>

                    <button type="button" onClick={() => setIsEditing(true)}>Editar Dados</button>
                </div>
            ) : (
                /* --- MODO EDIÇÃO --- */
                <form onSubmit={handleSubmit(onUpdate)} className="profile-edit-form">
                    <h3>Editar Informações</h3>
                    <input {...register("nome", { required: true })} placeholder="Primeiro Nome" />
                    <input {...register("apelido", { required: true })} placeholder="Apelido" />
                    <input {...register("nif", { required: true })} placeholder="NIF" />
                    <input {...register("telemovel")} placeholder="Telemóvel" />
                    <input {...register("morada.logradouro", { required: true })} placeholder="Rua / Logradouro" />
                    <input {...register("morada.numero")} placeholder="Número da Porta" />
                    <input {...register("morada.andar")} placeholder="Andar / Apartamento" />
                    <input {...register("morada.codigoPostal", { required: true })} placeholder="Código Postal" />
                    <input {...register("morada.cidade", { required: true })} placeholder="Cidade" />
                    <input {...register("morada.pais", { required: true })} placeholder="País" />

                    <div className="pass-group" style={{ position: "relative" }}>
                        <p><small>Deixa em branco se não pretenderes alterar a palavra-passe atual.</small></p>
                        <input type={showPass ? "text" : "password"} {...register("password")} placeholder="Nova Password (Opcional)" />
                        <input type={showPass ? "text" : "password"} {...register("confirmPassword")} placeholder="Confirmar Nova Password" />
                        <button type="button" onClick={() => setShowPass(!showPass)}>
                            {showPass ? <FaEyeSlash /> : <FaEye />}
                        </button>
                    </div>

                    <div className="form-actions">
                        <button type="submit">Guardar Alterações</button>
                        <button type="button" onClick={() => { reset(); setIsEditing(false); }}>Cancelar</button>
                    </div>
                </form>
            )}

            <div className="profile-actions" style={{ marginTop: "30px" }}>
                <button type="button" onClick={logout}>Terminar Sessão</button>
                <button type="button" onClick={handleDelete} style={{ color: "red", marginLeft: "15px" }}>Apagar Conta</button>
            </div>
        </div>
    );
};

export default Profile;