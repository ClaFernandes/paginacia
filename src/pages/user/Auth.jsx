import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import logoImage from "../../assets/logo.png";
import "./Auth.css";

const Auth = () => {
    // ── Contexto global e navegação ──
    const { login, isLoggedIn } = useAuth();
    const navigate = useNavigate();

    // ── Estados de controlo da interface ──
    const [isLoginMode, setIsLoginMode] = useState(true);  // true = Login | false = Registo
    const [isRecoveryMode, setIsRecoveryMode] = useState(false); // Modo recuperação de password
    const [isVerified, setIsVerified] = useState(false); // Passo 2 da recuperação (nova pass)
    const [verifiedUserEmail, setVerifiedUserEmail] = useState("");
    const [showPass, setShowPass] = useState(false); // Alterna visibilidade da password

    // ── React Hook Form ──
    const {
        register,
        handleSubmit,
        watch,
        unregister,
        formState: { errors },
    } = useForm();

    // Regex de validação — mesma do Profile
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$!%*?&])[A-Za-z\d@#$!%*?&]{6,}$/;

    // Observa o valor da password em tempo real para a validação de confirmação
    const passwordValue = watch("password");
    const recoveryPasswordValue = watch("newPassword");

    // ── Limpa campos não usados ao mudar de modo ──
    useEffect(() => {
        if (isLoginMode || isRecoveryMode) {
            unregister([
                "nome", "apelido", "nif", "telemovel",
                "morada.logradouro", "morada.numero", "morada.andar",
                "morada.codigoPostal", "morada.cidade", "morada.pais",
                "confirmPassword", "recoveryEmail", "recoveryNif",
                "recoveryPhone", "newPassword", "confirmNewPassword",
            ]);
        }
    }, [isLoginMode, isRecoveryMode, unregister]);

    // ── Redireciona se já estiver autenticado ──
    useEffect(() => {
        if (isLoggedIn) navigate("/");
    }, [isLoggedIn, navigate]);

    // ── Handler: Login e Registo ──
    const onAuthSubmit = (data) => {
        const savedUsers = JSON.parse(localStorage.getItem("registrations") || "[]");

        if (isLoginMode) {
            // Verifica credenciais
            const foundUser = savedUsers.find(
                (u) => u.email === data.email && u.password === data.password
            );
            if (foundUser) {
                login(foundUser, "token-ativo");
                toast("Bem-vindo!");
            } else {
                toast.error("Email ou password incorretos.");
            }
        } else {
            // Registo: impede email duplicado
            if (savedUsers.some((u) => u.email === data.email)) {
                toast.error("Email já registado.");
                return;
            }
            // Remove confirmPassword antes de guardar
            const { confirmPassword, ...userData } = data;
            const newUser = { ...userData, id: "user-" + Date.now() };
            savedUsers.push(newUser);
            localStorage.setItem("registrations", JSON.stringify(savedUsers));
            login(newUser, "token-ativo");
            toast.success("Conta criada com sucesso!");
        }
    };

    // ── Handler: Verificar identidade (passo 1 da recuperação) ──
    const onVerifyIdentitySubmit = (data) => {
        const savedUsers = JSON.parse(localStorage.getItem("registrations") || "[]");
        const foundUser = savedUsers.find(
            (u) =>
                u.email === data.recoveryEmail &&
                u.nif === data.recoveryNif &&
                u.telemovel === data.recoveryPhone
        );
        if (foundUser) {
            setVerifiedUserEmail(data.recoveryEmail);
            setIsVerified(true);
            toast("Identidade validada.");
        } else {
            toast.error("Dados incorretos.");
        }
    };

    // ── Handler: Gravar nova password (passo 2 da recuperação) ──
    const onResetPasswordSubmit = (data) => {
        const savedUsers = JSON.parse(localStorage.getItem("registrations") || "[]");
        const updatedUsers = savedUsers.map((u) =>
            u.email === verifiedUserEmail ? { ...u, password: data.newPassword } : u
        );
        localStorage.setItem("registrations", JSON.stringify(updatedUsers));
        // Volta ao modo de login
        setIsVerified(false);
        setIsRecoveryMode(false);
        setIsLoginMode(true);
        toast("Palavra-passe alterada!");
    };

    // ════════════════════════════════════════
    // RENDER — Modo de Recuperação de Password
    // ════════════════════════════════════════
    if (isRecoveryMode) {
        return (
            <div className="auth-wrapper">
                <div className="auth-split-container">
                    <div className="auth-form-side">

                        {/* Botão de voltar ao login */}
                        <button
                            type="button"
                            className="btn-forgot"
                            style={{ alignSelf: "flex-start", marginBottom: "1rem" }}
                            onClick={() => { setIsRecoveryMode(false); setIsVerified(false); }}
                        >
                            ← Voltar ao login
                        </button>

                        <h2>Recuperar Conta</h2>
                        <p className="auth-subtitle">
                            {!isVerified
                                ? "Confirma a tua identidade para continuar."
                                : "Define a tua nova palavra-passe."}
                        </p>

                        {/* Passo 1: verificar identidade */}
                        {!isVerified ? (
                            <form onSubmit={handleSubmit(onVerifyIdentitySubmit)}>
                                <input
                                    {...register("recoveryEmail", { required: "Email obrigatório" })}
                                    type="email"
                                    placeholder="Email"
                                />
                                {errors.recoveryEmail && (
                                    <p className="field-error">{errors.recoveryEmail.message}</p>
                                )}

                                <input
                                    {...register("recoveryNif", { required: "NIF obrigatório" })}
                                    placeholder="NIF"
                                />
                                {errors.recoveryNif && (
                                    <p className="field-error">{errors.recoveryNif.message}</p>
                                )}

                                <input
                                    {...register("recoveryPhone", { required: "Telemóvel obrigatório" })}
                                    placeholder="Telemóvel"
                                />
                                {errors.recoveryPhone && (
                                    <p className="field-error">{errors.recoveryPhone.message}</p>
                                )}

                                <button type="submit" className="btn-main">Verificar</button>
                            </form>
                        ) : (
                            /* Passo 2: nova password */
                            <form onSubmit={handleSubmit(onResetPasswordSubmit)}>
                                <div className="pass-input">
                                    <input
                                        type={showPass ? "text" : "password"}
                                        {...register("newPassword", {
                                            required: "Campo obrigatório",
                                            pattern: {
                                                value: passwordRegex,
                                                message: "Mín. 6 caracteres, maiúscula, minúscula, número e símbolo.",
                                            },
                                        })}
                                        placeholder="Nova Palavra-Passe"
                                    />
                                    <button type="button" onClick={() => setShowPass(!showPass)}>
                                        {showPass ? <FaEyeSlash /> : <FaEye />}
                                    </button>
                                </div>
                                {errors.newPassword && (
                                    <p className="field-error">{errors.newPassword.message}</p>
                                )}

                                <div className="pass-input">
                                    <input
                                        type={showPass ? "text" : "password"}
                                        {...register("confirmNewPassword", {
                                            required: "Campo obrigatório",
                                            validate: (v) =>
                                                v === recoveryPasswordValue || "As palavras-passe não coincidem.",
                                        })}
                                        placeholder="Confirmar Palavra-Passe"
                                    />
                                </div>
                                {errors.confirmNewPassword && (
                                    <p className="field-error">{errors.confirmNewPassword.message}</p>
                                )}

                                <button type="submit" className="btn-main">Gravar</button>
                            </form>
                        )}
                    </div>

                    {/* Painel lateral no modo de recuperação */}
                    <div className="auth-info-side">
                        <img src={logoImage} alt="Logo" />
                        <span className="auth-brand-name">Página &amp; Cia</span>
                        <div className="auth-info-divider" />
                        <h3>Recupera o acesso à tua conta</h3>
                        <p>Confirma a tua identidade e define uma nova palavra-passe em segundos.</p>
                    </div>
                </div>
            </div>
        );
    }

    // ════════════════════════════════════════
    // RENDER — Login / Registo
    // ════════════════════════════════════════
    return (
        <div className="auth-wrapper">
            <div className="auth-split-container">

                {/* ── Formulário ── */}
                <div className="auth-form-side">
                    <h2>{isLoginMode ? "Iniciar Sessão" : "Criar Conta"}</h2>
                    <p className="auth-subtitle">
                        {isLoginMode
                            ? "Bem-vindo de volta. Introduz as tuas credenciais."
                            : "Preenche os teus dados para criar uma conta."}
                    </p>

                    <form onSubmit={handleSubmit(onAuthSubmit)}>

                        {/* Campos exclusivos do modo Registo em grelha de 2 colunas */}
                        {!isLoginMode && (
                            <div className="form-grid">
                                <input {...register("nome", { required: true })} placeholder="Nome" />
                                <input {...register("apelido", { required: true })} placeholder="Apelido" />
                                <input {...register("nif", { required: true })} placeholder="NIF" />
                                <input {...register("telemovel")} placeholder="Telemóvel" />

                                {/* Campos de morada */}
                                <input
                                    className="full-width"
                                    {...register("morada.logradouro", { required: true })}
                                    placeholder="Rua / Logradouro"
                                />
                                <input {...register("morada.numero")} placeholder="Nº" />
                                <input {...register("morada.andar")} placeholder="Andar" />
                                <input {...register("morada.codigoPostal", { required: true })} placeholder="Cód. Postal" />
                                <input {...register("morada.cidade", { required: true })} placeholder="Cidade" />
                                <input {...register("morada.pais", { required: true })} placeholder="País" />
                            </div>
                        )}

                        {/* Email — presente em ambos os modos */}
                        <input
                            {...register("email", { required: "Email obrigatório" })}
                            type="email"
                            placeholder="Email"
                        />
                        {errors.email && <p className="field-error">{errors.email.message}</p>}

                        {/* Password com toggle de visibilidade */}
                        <div className="pass-input">
                            <input
                                type={showPass ? "text" : "password"}
                                {...register("password", {
                                    required: "Password obrigatória",
                                    // Valida complexidade apenas no registo
                                    validate: (v) =>
                                        isLoginMode ||
                                        passwordRegex.test(v) ||
                                        "Mín. 6 caracteres, maiúscula, minúscula, número e símbolo.",
                                })}
                                placeholder="Palavra-Passe"
                            />
                            <button type="button" onClick={() => setShowPass(!showPass)}>
                                {showPass ? <FaEyeSlash /> : <FaEye />}
                            </button>
                        </div>
                        {errors.password && <p className="field-error">{errors.password.message}</p>}

                        {/* Confirmação de password — só no Registo */}
                        {!isLoginMode && (
                            <>
                                <div className="pass-input">
                                    <input
                                        type={showPass ? "text" : "password"}
                                        {...register("confirmPassword", {
                                            required: "Confirmação obrigatória",
                                            validate: (v) =>
                                                v === passwordValue || "As palavras-passe não coincidem.",
                                        })}
                                        placeholder="Confirmar Palavra-Passe"
                                    />
                                </div>
                                {errors.confirmPassword && (
                                    <p className="field-error">{errors.confirmPassword.message}</p>
                                )}
                            </>
                        )}

                        {/* Link "Esqueci a password" — só no Login */}
                        {isLoginMode && (
                            <button
                                type="button"
                                className="btn-forgot"
                                onClick={() => setIsRecoveryMode(true)}
                            >
                                Esqueci a palavra-passe?
                            </button>
                        )}

                        <button type="submit" className="btn-main">
                            {isLoginMode ? "Entrar" : "Registar"}
                        </button>
                    </form>
                </div>

                {/* ── Painel lateral — substitui o bloco auth-info-side existente ── */}
                <div className="auth-info-side">
                    <img src={logoImage} alt="Logo" />
                    <span className="auth-brand-name">Página &amp; Cia</span>

                    <div className="auth-info-divider" />

                    <h3>
                        {isLoginMode ? "Ainda não tens conta?" : "Já tens conta?"}
                    </h3>
                    <p>
                        {isLoginMode
                            ? "Regista-te gratuitamente e começa a explorar."
                            : "Inicia sessão e acede à tua área pessoal."}
                    </p>
                    <button
                        type="button"
                        className="btn-secondary"
                        onClick={() => setIsLoginMode(!isLoginMode)}
                    >
                        {isLoginMode ? "Criar Conta" : "Iniciar Sessão"}
                    </button>
                </div>

            </div>
        </div>
    );
};

export default Auth;