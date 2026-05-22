import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useNavigate, Link } from "react-router-dom";
import { FaEye, FaEyeSlash, FaChevronLeft } from "react-icons/fa";
import "./Profile.css";

const Profile = () => {
    // Contexto global e navegação 
    const { user, login, logout } = useAuth();
    const navigate = useNavigate();

    // Estados de controlo da interface 
    const [isEditing, setIsEditing] = useState(false);
    const [showPass, setShowPass] = useState(false);

    // React Hook Form inicializado com os dados do utilizador atual
    const { register, handleSubmit, reset } = useForm({
        defaultValues: user,
    });

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$!%*?&])[A-Za-z\d@#$!%*?&]{6,}$/;

    // Guarda alterações do perfil 
    const onUpdate = (data) => {
        if (data.password && data.password !== data.confirmPassword) {
            toast.error("As palavras-passe não coincidem!");
            return;
        }
        if (data.password && !passwordRegex.test(data.password)) {
            toast.error("A nova password deve ter no mínimo 6 caracteres, com maiúscula, minúscula, número e símbolo.");
            return;
        }

        // Prepara os dados para atualização
        const finalData = { ...data };
        if (!finalData.password) {
            delete finalData.password;
            delete finalData.confirmPassword;
        } else {
            delete finalData.confirmPassword;
        }

        // Atualiza o utilizador no localStorage e no contexto global
        const savedUsers = JSON.parse(localStorage.getItem("registrations") || "[]");
        const updatedUsers = savedUsers.map((u) =>
            u.email === user.email ? { ...u, ...finalData } : u
        );
        localStorage.setItem("registrations", JSON.stringify(updatedUsers));
        login({ ...user, ...finalData }, localStorage.getItem("token"));
        setIsEditing(false);
        toast.success("Perfil atualizado com sucesso!");
    };

    // Eliminar conta permanentemente 
    const confirmDeleteAccount = () => {
        const users = JSON.parse(localStorage.getItem("registrations") || "[]");
        const filtered = users.filter((u) => u.email !== user.email);
        localStorage.setItem("registrations", JSON.stringify(filtered));
        logout();
        navigate("/");
        toast.error("A tua conta foi permanentemente eliminada.");
    };

    // Toast de confirmação antes de eliminar 
    const handleDelete = () => {
        toast.info(
            ({ closeToast }) => (
                <div className="custom-toast-confirm">
                    <p className="toast-title">Tens a certeza que queres apagar a tua conta?</p>
                    <p className="toast-desc">Esta ação é irreversível e vais perder todos os teus dados.</p>
                    <div className="toast-actions">
                        <button className="toast-btn toast-btn--danger" onClick={() => { confirmDeleteAccount(); closeToast(); }}>
                            Sim, Apagar
                        </button>
                        <button className="toast-btn toast-btn--cancel" onClick={closeToast}>
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
            <Link to="/" className="btn-back-profile">
                <FaChevronLeft /> Voltar à Página Inicial
            </Link>

            <h1>Meu Perfil</h1>

            {/* Modo visualização */}
            {!isEditing ? (
                <div className="profile-view">
                    <div className="profile-row">
                        <span className="profile-label">Nome</span>
                        <span className="profile-value">{user.nome} {user.apelido}</span>
                    </div>
                    <div className="profile-row">
                        <span className="profile-label">NIF</span>
                        <span className="profile-value">{user.nif}</span>
                    </div>
                    <div className="profile-row">
                        <span className="profile-label">Contacto</span>
                        <span className="profile-value">{user.telemovel || "Não associado"}</span>
                    </div>
                    <div className="profile-row">
                        <span className="profile-label">Morada</span>
                        <span className="profile-value">{user.morada?.logradouro}, nº {user.morada?.numero}</span>
                    </div>
                    <div className="profile-row">
                        <span className="profile-label">Andar / Porta</span>
                        <span className="profile-value">{user.morada?.andar || "N/A"}</span>
                    </div>
                    <div className="profile-row">
                        <span className="profile-label">Localidade</span>
                        <span className="profile-value">{user.morada?.cidade}, {user.morada?.codigoPostal}</span>
                    </div>
                    <div className="profile-row">
                        <span className="profile-label">País</span>
                        <span className="profile-value">{user.morada?.pais}</span>
                    </div>

                    <button type="button" className="btn-edit-profile" onClick={() => setIsEditing(true)}>
                        Editar Dados
                    </button>
                </div>
            ) : (
                /* Modo de edição */
                <form onSubmit={handleSubmit(onUpdate)} className="profile-edit-form">
                    <h3>Editar Informações</h3>

                    <div className="profile-grid">
                        {/* Linha 1: Nome - Apelido */}
                        <div className="profile-field">
                            <label>Nome</label>
                            <input {...register("nome", { required: true })} placeholder="Nome" />
                        </div>
                        <div className="profile-field">
                            <label>Apelido</label>
                            <input {...register("apelido", { required: true })} placeholder="Apelido" />
                        </div>

                        {/* Linha 2: NIF - Telemóvel */}
                        <div className="profile-field">
                            <label>NIF</label>
                            <input {...register("nif", { required: true })} placeholder="NIF" />
                        </div>
                        <div className="profile-field">
                            <label>Telemóvel</label>
                            <input {...register("telemovel")} placeholder="Telemóvel" />
                        </div>

                        {/* Linha 3: Rua - Nº */}
                        <div className="profile-field">
                            <label>Rua/ Avenida...</label>
                            <input {...register("morada.logradouro", { required: true })} placeholder="Rua, Avenida…" />
                        </div>
                        <div className="profile-field">
                            <label>Nº</label>
                            <input {...register("morada.numero")} placeholder="12" />
                        </div>

                        {/* Linha 4: Andar - Código Postal */}
                        <div className="profile-field">
                            <label>Andar / Porta...</label>
                            <input {...register("morada.andar")} placeholder="2º Dto" />
                        </div>
                        <div className="profile-field">
                            <label>Código Postal</label>
                            <input {...register("morada.codigoPostal", { required: true })} placeholder="0000-000" />
                        </div>

                        {/* Linha 5: Cidade - País */}
                        <div className="profile-field">
                            <label>Cidade</label>
                            <input {...register("morada.cidade", { required: true })} placeholder="Lisboa" />
                        </div>
                        <div className="profile-field">
                            <label>País</label>
                            <input {...register("morada.pais", { required: true })} placeholder="Portugal" />
                        </div>
                    </div>

                    {/* Bloco de password opcional */}
                    <div className="pass-group">
                        <small>Deixa em branco se não pretenderes alterar a palavra-passe atual.</small>
                        <div className="profile-field">
                            <label>Nova Password (Opcional)</label>
                            <div className="pass-input">
                                <input
                                    type={showPass ? "text" : "password"}
                                    {...register("password")}
                                    placeholder="Nova password"
                                />
                                <button type="button" className="pass-eye-btn" onClick={() => setShowPass(!showPass)}>
                                    {showPass ? <FaEyeSlash /> : <FaEye />}
                                </button>
                            </div>
                        </div>
                        <div className="profile-field">
                            <label>Confirmar Nova Password</label>

                            <div className="pass-input">
                                <input
                                    type={showPass ? "text" : "password"}
                                    {...register("confirmPassword")}
                                    placeholder="Confirmar nova password"
                                />

                                <button
                                    type="button"
                                    className="pass-eye-btn"
                                    onClick={() => setShowPass(!showPass)}
                                >
                                    {showPass ? <FaEyeSlash /> : <FaEye />}
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="form-actions">
                        <button type="submit" className="btn-save-profile">Guardar Alterações</button>
                        <button type="button" className="btn-cancel-profile" onClick={() => { reset(); setIsEditing(false); }}>
                            Cancelar
                        </button>
                    </div>
                </form>
            )}

            {/* Ações de conta */}
            <div className="profile-actions">
                <button type="button" className="btn-logout" onClick={logout}>Terminar Sessão</button>
                <button type="button" className="btn-delete" onClick={handleDelete}>Apagar Conta</button>
            </div>
        </div>
    );
};

export default Profile;