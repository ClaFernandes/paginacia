import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";
import { FaEye, FaEyeSlash, FaChevronLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import logoImage from "../../assets/logo2.png";
import "./Auth.css";

const Auth = () => {
    // Contexto global e navegação
    const { login, isLoggedIn } = useAuth();
    const navigate = useNavigate();

    // Estados de controlo da interface
    const [isLoginMode, setIsLoginMode] = useState(true);
    const [isRecoveryMode, setIsRecoveryMode] = useState(false);
    const [isVerified, setIsVerified] = useState(false);
    const [verifiedUserEmail, setVerifiedUserEmail] = useState("");
    const [showPass, setShowPass] = useState(false);

    // React Hook Form
    const {
        register,
        handleSubmit,
        watch,
        unregister,
        formState: { errors },
    } = useForm();

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$!%*?&])[A-Za-z\d@#$!%*?&]{6,}$/;
    const passwordValue = watch("password");
    const recoveryPasswordValue = watch("newPassword");

    // Limpa campos não usados ao mudar de modo
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

    // Redireciona se já estiver autenticado
    useEffect(() => {
        if (isLoggedIn) navigate("/");
    }, [isLoggedIn, navigate]);

    // Login e Registo 
    const onAuthSubmit = (data) => {
        const savedUsers = JSON.parse(localStorage.getItem("registrations") || "[]");

        if (isLoginMode) {
            const foundUser = savedUsers.find(
                (u) => u.email === data.email && u.password === data.password
            );
            if (foundUser) {
                login(foundUser, "token-ativo");
                toast.info("Bem-vindo!");
            } else {
                toast.error("Email ou password incorretos.");
            }
        } else {
            if (savedUsers.some((u) => u.email === data.email)) {
                toast.error("Email já registado.");
                return;
            }
            const { confirmPassword, ...userData } = data;
            const newUser = { ...userData, id: "user-" + Date.now() };
            savedUsers.push(newUser);
            localStorage.setItem("registrations", JSON.stringify(savedUsers));
            login(newUser, "token-ativo");
            toast.success("Conta criada com sucesso!");
        }
    };

    // Verificar identidade (passo 1 da recuperação)
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
            toast.info("Identidade validada.");
        } else {
            toast.error("Dados incorretos.");
        }
    };

    // Grava nova password (passo 2 da recuperação)
    const onResetPasswordSubmit = (data) => {
        const savedUsers = JSON.parse(localStorage.getItem("registrations") || "[]");
        const updatedUsers = savedUsers.map((u) =>
            u.email === verifiedUserEmail ? { ...u, password: data.newPassword } : u
        );
        localStorage.setItem("registrations", JSON.stringify(updatedUsers));
        setIsVerified(false);
        setIsRecoveryMode(false);
        setIsLoginMode(true);
        toast.info("Palavra-passe alterada!");
    };

    // Modo de Recuperação de Password
    if (isRecoveryMode) {
        return (
            <div className="auth-wrapper">
                <div className="auth-split-container">
                    <div className="auth-form-side">

                        <button
                            type="button"
                            className="btn-forgot btn-forgot--back"
                            onClick={() => { setIsRecoveryMode(false); setIsVerified(false); }}
                        >
                            <FaChevronLeft /> Voltar ao Login
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
                                <div className="auth-field">
                                    <label>Email</label>
                                    <input
                                        {...register("recoveryEmail", { required: "Email obrigatório" })}
                                        type="email"
                                        placeholder="exemplo@email.com"
                                    />
                                    {errors.recoveryEmail && <p className="field-error">{errors.recoveryEmail.message}</p>}
                                </div>
                                <div className="auth-field">
                                    <label>NIF</label>
                                    <input
                                        {...register("recoveryNif", { required: "NIF obrigatório" })}
                                        placeholder="000 000 000"
                                    />
                                    {errors.recoveryNif && <p className="field-error">{errors.recoveryNif.message}</p>}
                                </div>
                                <div className="auth-field">
                                    <label>Telemóvel</label>
                                    <input
                                        {...register("recoveryPhone", { required: "Telemóvel obrigatório" })}
                                        placeholder="+351 9xx xxx xxx"
                                    />
                                    {errors.recoveryPhone && <p className="field-error">{errors.recoveryPhone.message}</p>}
                                </div>
                                <button type="submit" className="btn-main">Verificar</button>
                            </form>
                        ) : (
                            /* Passo 2: nova password */
                            <form onSubmit={handleSubmit(onResetPasswordSubmit)}>
                                <div className="auth-field">
                                    <label>Nova Palavra-Passe</label>
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
                                        <button type="button" className="pass-eye-btn" onClick={() => setShowPass(!showPass)}>
                                            {showPass ? <FaEyeSlash /> : <FaEye />}
                                        </button>
                                    </div>
                                    {errors.newPassword && <p className="field-error">{errors.newPassword.message}</p>}
                                </div>
                                <div className="auth-field">
                                    <label>Confirmar Palavra-Passe</label>
                                    <div className="pass-input">
                                        <input
                                            type={showPass ? "text" : "password"}
                                            {...register("confirmNewPassword", {
                                                required: "Campo obrigatório",
                                                validate: (v) => v === recoveryPasswordValue || "As palavras-passe não coincidem.",
                                            })}
                                            placeholder="Confirmar Palavra-Passe"
                                        />
                                    </div>
                                    {errors.confirmNewPassword && <p className="field-error">{errors.confirmNewPassword.message}</p>}
                                </div>
                                <button type="submit" className="btn-main">Gravar</button>
                            </form>
                        )}
                    </div>

                    <div className="auth-info-side">
                        <img src={logoImage} alt="Logo" />
                        <span className="auth-brand-name">Página &amp; Cia</span>
                        <div className="auth-info-divider" />
                        <h3>Recupera o acesso à tua conta</h3>
                        <p>Confirma a tua identidade e define uma nova palavra-passe.</p>
                    </div>
                </div>
            </div>
        );
    }

    // Login / Registo
    return (
        <div className="auth-wrapper">
            <div className="auth-split-container">

                <div className="auth-form-side">
                    <h2>{isLoginMode ? "Iniciar Sessão" : "Criar Conta"}</h2>
                    <p className="auth-subtitle">
                        {isLoginMode
                            ? "Bem-vindo de volta! Introduz as tuas credenciais."
                            : "Preenche os teus dados para criar uma conta."}
                    </p>

                    <form onSubmit={handleSubmit(onAuthSubmit)}>

                        {/* Campos do Registo */}
                        {!isLoginMode && (
                            <div className="form-grid">
                                {/* Linha 1: Nome - Apelido */}
                                <div className="auth-field">
                                    <label>Nome</label>
                                    <input {...register("nome", { required: true })} placeholder="Nome" />
                                </div>
                                <div className="auth-field">
                                    <label>Apelido</label>
                                    <input {...register("apelido", { required: true })} placeholder="Apelido" />
                                </div>

                                {/* Linha 2: NIF - Telemóvel */}
                                <div className="auth-field">
                                    <label>NIF</label>
                                    <input {...register("nif", { required: true })} placeholder="000 000 000" />
                                </div>
                                <div className="auth-field">
                                    <label>Telemóvel</label>
                                    <input {...register("telemovel")} placeholder="+351 9xx xxx xxx" />
                                </div>

                                {/* Linha 3: Rua - Nº */}
                                <div className="auth-field">
                                    <label>Rua/ Avenida...</label>
                                    <input {...register("morada.logradouro", { required: true })} placeholder="Rua, Avenida…" />
                                </div>
                                <div className="auth-field">
                                    <label>Nº</label>
                                    <input {...register("morada.numero")} placeholder="12" />
                                </div>

                                {/* Linha 4: Andar - Código Postal */}
                                <div className="auth-field">
                                    <label>Andar/ Porta...</label>
                                    <input {...register("morada.andar")} placeholder="2º Dto" />
                                </div>
                                <div className="auth-field">
                                    <label>Código Postal</label>
                                    <input {...register("morada.codigoPostal", { required: true })} placeholder="0000-000" />
                                </div>

                                {/* Linha 5: Cidade - País */}
                                <div className="auth-field">
                                    <label>Cidade</label>
                                    <input {...register("morada.cidade", { required: true })} placeholder="Lisboa" />
                                </div>
                                <div className="auth-field">
                                    <label>País</label>
                                    <input {...register("morada.pais", { required: true })} placeholder="Portugal" />
                                </div>
                            </div>
                        )}

                        {/* Email — presente nos dois modos */}
                        <div className="auth-field">
                            <label>Email</label>
                            <input
                                {...register("email", { required: "Email obrigatório" })}
                                type="email"
                                placeholder="exemplo@email.com"
                            />
                            {errors.email && <p className="field-error">{errors.email.message}</p>}
                        </div>

                        {/* Password com toggle de visibilidade */}
                        <div className="auth-field">
                            <label>Palavra-Passe</label>
                            <div className="pass-input">
                                <input
                                    type={showPass ? "text" : "password"}
                                    {...register("password", {
                                        required: "Password obrigatória",
                                        validate: (v) =>
                                            isLoginMode ||
                                            passwordRegex.test(v) ||
                                            "Mín. 6 caracteres, maiúscula, minúscula, número e símbolo.",
                                    })}
                                    placeholder="Palavra-passe"
                                />
                                <button type="button" className="pass-eye-btn" onClick={() => setShowPass(!showPass)}>
                                    {showPass ? <FaEyeSlash /> : <FaEye />}
                                </button>
                            </div>
                            {errors.password && <p className="field-error">{errors.password.message}</p>}
                        </div>

                        {/* Confirmação de password — só no Registo */}
                        {!isLoginMode && (
                            <div className="auth-field">
                                <label>Confirmar Palavra-Passe</label>
                                <div className="pass-input">
                                    <input
                                        type={showPass ? "text" : "password"}
                                        {...register("confirmPassword", {
                                            required: "Confirmação obrigatória",
                                            validate: (v) =>
                                                v === passwordValue || "As palavras-passe não coincidem.",
                                        })}
                                        placeholder="Confirmar palavra-passe"
                                    />
                                    <button type="button" className="pass-eye-btn" onClick={() => setShowPass(!showPass)}>
                                        {showPass ? <FaEyeSlash /> : <FaEye />}
                                    </button>
                                </div>
                                {errors.confirmPassword && <p className="field-error">{errors.confirmPassword.message}</p>}
                            </div>
                        )}

                        {/* Esqueci a palavra-passe — só no Login */}
                        {isLoginMode && (
                            <button
                                type="button"
                                className="btn-forgot"
                                onClick={() => setIsRecoveryMode(true)}
                            >
                                Esqueceste a palavra-passe?
                            </button>
                        )}

                        <button type="submit" className="btn-main">
                            {isLoginMode ? "Entrar" : "Registar"}
                        </button>
                    </form>
                </div>

                {/* Painel lateral */}
                <div className="auth-info-side">
                    <img src={logoImage} alt="Logo" />
                    <span className="auth-brand-name">Página &amp; Cia</span>
                    <div className="auth-info-divider" />
                    <h3>{isLoginMode ? "Ainda não tens conta?" : "Já tens conta?"}</h3>
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