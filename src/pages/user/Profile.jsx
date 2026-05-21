import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useNavigate, Link } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "./Profile.css";

const Profile = () => {
    // ── Contexto global e navegação ──
    const { user, login, logout } = useAuth();
    const navigate = useNavigate();

    // ── Estados de controlo da interface ──
    const [isEditing, setIsEditing] = useState(false); // Alterna visualização / edição
    const [showPass, setShowPass] = useState(false); // Alterna visibilidade da password

    // ── React Hook Form inicializado com os dados do utilizador atual ──
    const { register, handleSubmit, reset } = useForm({
        defaultValues: user,
    });

    // Regex de validação — mesma do Auth.jsx
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$!%*?&])[A-Za-z\d@#$!%*?&]{6,}$/;

    // ── Handler: guardar alterações do perfil ──
    const onUpdate = (data) => {
        // Valida correspondência de passwords se foi preenchida
        if (data.password && data.password !== data.confirmPassword) {
            toast.error("As palavras-passe não coincidem!");
            return;
        }
        // Valida complexidade da nova password
        if (data.password && !passwordRegex.test(data.password)) {
            toast.error(
                "A nova password deve ter no mínimo 6 caracteres, com maiúscula, minúscula, número e símbolo."
            );
            return;
        }

        // Remove campos de password do objeto se não foram preenchidos
        const finalData = { ...data };
        if (!finalData.password) {
            delete finalData.password;
            delete finalData.confirmPassword;
        } else {
            delete finalData.confirmPassword;
        }

        // Atualiza o utilizador no localStorage
        const savedUsers = JSON.parse(localStorage.getItem("registrations") || "[]");
        const updatedUsers = savedUsers.map((u) =>
            u.email === user.email ? { ...u, ...finalData } : u
        );
        localStorage.setItem("registrations", JSON.stringify(updatedUsers));

        // Sincroniza o contexto global com os novos dados
        login({ ...user, ...finalData }, localStorage.getItem("token"));
        setIsEditing(false);
        toast.success("Perfil atualizado com sucesso!");
    };

    // ── Handler: eliminar conta permanentemente ──
    const confirmDeleteAccount = () => {
        const users = JSON.parse(localStorage.getItem("registrations") || "[]");
        const filtered = users.filter((u) => u.email !== user.email);
        localStorage.setItem("registrations", JSON.stringify(filtered));
        logout();
        navigate("/");
        toast.info("A tua conta foi permanentemente eliminada.");
    };

    // Mostra toast de confirmação antes de eliminar — evita eliminação acidental
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
                        <button
                            onClick={() => { confirmDeleteAccount(); closeToast(); }}
                            style={{
                                background: "#dc3545", color: "#fff", border: "none",
                                padding: "6px 12px", borderRadius: "4px",
                                cursor: "pointer", fontWeight: "bold",
                            }}
                        >
                            Sim, Apagar
                        </button>
                        <button
                            onClick={closeToast}
                            style={{
                                background: "#6c757d", color: "#fff", border: "none",
                                padding: "6px 12px", borderRadius: "4px", cursor: "pointer",
                            }}
                        >
                            Cancelar
                        </button>
                    </div>
                </div>
            ),
            { position: "top-center", autoClose: false, closeOnClick: false, draggable: false, closeButton: false }
        );
    };

    // Guarda enquanto os dados do utilizador carregam
    if (!user) return <p>A carregar dados do perfil...</p>;

    return (
        <div className="profile-container">

            {/* Botão de voltar — padrão idêntico ao Contact */}
            <div className="back-home-wrapper">
                <Link to="/" className="btn-back-home">
                    ← Voltar para a Home
                </Link>
            </div>

            <h1>O meu Perfil</h1>

            {/* ════════════════ MODO VISUALIZAÇÃO ════════════════ */}
            {!isEditing ? (
                <div className="profile-view">
                    <p><strong>Nome</strong>{user.nome} {user.apelido}</p>
                    <p><strong>NIF</strong>{user.nif}</p>
                    <p><strong>Contacto</strong>{user.telemovel || "Não associado"}</p>
                    <p><strong>Morada</strong>{user.morada?.logradouro}, nº {user.morada?.numero}</p>
                    <p><strong>Andar / Porta</strong>{user.morada?.andar || "N/A"}</p>
                    <p><strong>Localidade</strong>{user.morada?.cidade}, {user.morada?.codigoPostal}</p>
                    <p><strong>País</strong>{user.morada?.pais}</p>

                    <button type="button" onClick={() => setIsEditing(true)}>
                        Editar Dados
                    </button>
                </div>
            ) : (
                /* ════════════════ MODO EDIÇÃO ════════════════ */
                <form
                    onSubmit={handleSubmit(onUpdate)}
                    className="profile-edit-form"
                >
                    <h3>Editar Informações</h3>

                    {/* Dados pessoais */}
                    <input {...register("nome", { required: true })} placeholder="Primeiro Nome" />
                    <input {...register("apelido", { required: true })} placeholder="Apelido" />
                    <input {...register("nif", { required: true })} placeholder="NIF" />
                    <input {...register("telemovel")} placeholder="Telemóvel" />

                    {/* Morada */}
                    <input {...register("morada.logradouro", { required: true })} placeholder="Rua / Logradouro" />
                    <input {...register("morada.numero")} placeholder="Número da Porta" />
                    <input {...register("morada.andar")} placeholder="Andar / Apartamento" />
                    <input {...register("morada.codigoPostal", { required: true })} placeholder="Código Postal" />
                    <input {...register("morada.cidade", { required: true })} placeholder="Cidade" />
                    <input {...register("morada.pais", { required: true })} placeholder="País" />

                    {/* Password opcional — bloco com nota informativa */}
                    <div className="pass-group">
                        <small>Deixa em branco se não pretenderes alterar a palavra-passe atual.</small>
                        <input
                            type={showPass ? "text" : "password"}
                            {...register("password")}
                            placeholder="Nova Password (Opcional)"
                        />
                        <input
                            type={showPass ? "text" : "password"}
                            {...register("confirmPassword")}
                            placeholder="Confirmar Nova Password"
                        />
                        {/* Botão toggle do olho dentro do bloco de password */}
                        <button
                            type="button"
                            onClick={() => setShowPass(!showPass)}
                            style={{
                                alignSelf: "flex-end",
                                background: "none",
                                border: "none",
                                cursor: "pointer",
                                color: "var(--text-secondary)",
                                fontSize: "1rem",
                                padding: "0",
                                display: "flex",
                                alignItems: "center",
                                gap: "0.3rem",
                            }}
                        >
                            {showPass ? <FaEyeSlash /> : <FaEye />}
                            <span style={{ fontSize: "0.78rem" }}>
                                {showPass ? "Ocultar" : "Mostrar"} passwords
                            </span>
                        </button>
                    </div>

                    {/* Ações do formulário */}
                    <div className="form-actions">
                        <button type="submit">Guardar Alterações</button>
                        <button
                            type="button"
                            onClick={() => { reset(); setIsEditing(false); }}
                        >
                            Cancelar
                        </button>
                    </div>
                </form>
            )}

            {/* ── Ações de conta (fora do card) ── */}
            <div className="profile-actions" style={{ marginTop: "1.5rem" }}>
                <button type="button" onClick={logout}>Terminar Sessão</button>
                <button type="button" onClick={handleDelete}>Apagar Conta</button>
            </div>

        </div>
    );
};

export default Profile;