import { useState, useEffect } from "react";
import { useForm } from "react-hook-form"; // Biblioteca para gerir o estado e validação de formulários
import { useAuth } from "../../context/AuthContext"; // Contexto para gerir a sessão do utilizador (global)
import { toast } from "react-toastify"; // Para exibir mensagens de alerta (Feedback visual)
import { FaEye, FaEyeSlash } from "react-icons/fa"; // Ícones para a visibilidade da password
import { useNavigate } from "react-router-dom"; // Hook para redirecionar o utilizador entre páginas
import "./Auth.css";

const Auth = () => {
    // 1. ESTADOS E HOOKS GLOBAIS
    const { login, isLoggedIn } = useAuth();
    const navigate = useNavigate();

    // 2. ESTADOS LOCAIS (INTERFACE)
    const [isLoginMode, setIsLoginMode] = useState(true); // true = Login, false = Registo
    const [isRecoveryMode, setIsRecoveryMode] = useState(false); // true = Modo recuperação ativo
    const [isVerified, setIsVerified] = useState(false); // true = Identidade validada (Passo 2)
    const [verifiedUserEmail, setVerifiedUserEmail] = useState(""); // Guarda o email do utilizador que está a recuperar
    const [showPass, setShowPass] = useState(false); // Controla a visibilidade da password

    // 3. CONFIGURAÇÃO DO REACT HOOK FORM
    const { register, handleSubmit, watch, unregister, formState: { errors } } = useForm();

    // Regex que aceita letras, números e símbolos (incluindo o '#')
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$!%*?&])[A-Za-z\d@#$!%*?&]{6,}$/;

    // Monitoriza as passwords para fazer as validações de igualdade em tempo real
    const passwordValue = watch("password");
    const recoveryPasswordValue = watch("newPassword");

    // 4. EFEITOS COLATERAIS (USEEFFECT)
    // Limpa os dados e validações dos campos ocultos ao alternar entre modos para evitar conflitos
    useEffect(() => {
        if (isLoginMode || isRecoveryMode) {
            unregister([
                "nome", "apelido", "nif", "telemovel", "morada", "confirmPassword",
                "recoveryEmail", "recoveryNif", "recoveryPhone", "newPassword", "confirmNewPassword"
            ]);
        }
    }, [isLoginMode, isRecoveryMode, unregister]);

    // Redireciona para a Home se detetar que o utilizador já está logado
    useEffect(() => {
        if (isLoggedIn) {
            navigate("/");
        }
    }, [isLoggedIn, navigate]);

    // 5. SUBMISSÃO DO FORMULÁRIO PRINCIPAL (LOGIN / REGISTO)
    const onAuthSubmit = (data) => {
        const savedUsers = JSON.parse(localStorage.getItem("registrations") || "[]");

        if (isLoginMode) {
            // --- LÓGICA DE LOGIN ---
            const foundUser = savedUsers.find(u => u.email === data.email && u.password === data.password);

            if (foundUser) {
                login(foundUser, "token-ativo");
                toast.success("Bem-vindo de volta!");
            } else {
                toast.error("Email ou password incorretos.");
            }
        } else {
            // --- LÓGICA DE REGISTO ---
            if (savedUsers.some(u => u.email === data.email)) {
                toast.error("Este email já está registado.");
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

    // 6. LÓGICA DE RECUPERAÇÃO DE PASSWORD (DOIS PASSOS)

    // PASSO 1: Verificar se Email, NIF e Telemóvel existem e coincidem
    const onVerifyIdentitySubmit = (data) => {
        const savedUsers = JSON.parse(localStorage.getItem("registrations") || "[]");

        // AJUSTADO: Agora valida também se o campo 'telemovel' coincide com o 'recoveryPhone'
        const foundUser = savedUsers.find(u =>
            u.email === data.recoveryEmail &&
            u.nif === data.recoveryNif &&
            u.telemovel === data.recoveryPhone
        );

        if (foundUser) {
            setVerifiedUserEmail(data.recoveryEmail);
            setIsVerified(true); // Avança para o Passo 2
            toast.success("Identidade confirmada! Defina a sua nova palavra-passe.");
        } else {
            toast.error("Dados incorretos. Os dados introduzidos não coincidem com nenhuma conta.");
        }
    };

    // PASSO 2: Gravar a nova Password no LocalStorage
    const onResetPasswordSubmit = (data) => {
        const savedUsers = JSON.parse(localStorage.getItem("registrations") || "[]");

        const updatedUsers = savedUsers.map(u => {
            if (u.email === verifiedUserEmail) {
                return { ...u, password: data.newPassword };
            }
            return u;
        });

        localStorage.setItem("registrations", JSON.stringify(updatedUsers));

        setIsVerified(false);
        setIsRecoveryMode(false);
        setIsLoginMode(true);
        setVerifiedUserEmail("");

        toast.success("Palavra-passe redefinida com sucesso! Já pode iniciar sessão.");
    };

    // -------------------------------------------------------------
    // RENDERIZAÇÃO DO MODO DE RECUPERAÇÃO / REDEFINIÇÃO
    // -------------------------------------------------------------
    if (isRecoveryMode) {
        return (
            <div className="auth-wrapper">
                <div className="auth-split-container">
                    <div className="auth-form-side">
                        <h2>Recuperar Conta</h2>

                        {/* PASSO 1: Verificação de Identidade (Três campos agora) */}
                        {!isVerified ? (
                            <form onSubmit={handleSubmit(onVerifyIdentitySubmit)}>
                                <p style={{ marginBottom: "20px", color: "#666", fontSize: "14px" }}>
                                    Insira o seu email, NIF e telemóvel associados para validar a sua conta.
                                </p>
                                <input
                                    {...register("recoveryEmail", { required: true })}
                                    type="email"
                                    placeholder="Email de Registo"
                                />
                                <input
                                    {...register("recoveryNif", { required: true })}
                                    type="text"
                                    placeholder="O seu NIF"
                                />
                                {/* NOVO: Input adicionado para recolha do telemóvel na recuperação */}
                                <input
                                    {...register("recoveryPhone", { required: true })}
                                    type="text"
                                    placeholder="Telemóvel de Registo"
                                />

                                <button type="submit" className="btn-main">
                                    VERIFICAR IDENTIDADE
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setIsRecoveryMode(false)}
                                    style={{ background: "none", border: "none", color: "#555", marginTop: "15px", cursor: "pointer", textDecoration: "underline" }}
                                >
                                    Voltar para o Login
                                </button>
                            </form>
                        ) : (
                            /* PASSO 2: Criação da Nova Password */
                            <form onSubmit={handleSubmit(onResetPasswordSubmit)}>
                                <p style={{ marginBottom: "20px", color: "#666", fontSize: "14px" }}>
                                    Introduza e confirme a sua nova chave de acesso segura.
                                </p>

                                <div className="pass-input">
                                    <input
                                        type={showPass ? "text" : "password"}
                                        {...register("newPassword", {
                                            required: true,
                                            pattern: {
                                                value: passwordRegex,
                                                message: "Mínimo 6 caracteres, com maiúscula, minúscula, número e especial (ex: #)."
                                            }
                                        })}
                                        placeholder="Nova Palavra-Passe"
                                    />
                                    <button type="button" onClick={() => setShowPass(!showPass)}>
                                        {showPass ? <FaEyeSlash /> : <FaEye />}
                                    </button>
                                </div>
                                {errors.newPassword && <p className="error">{errors.newPassword.message}</p>}

                                <div className="pass-input">
                                    <input
                                        type={showPass ? "text" : "password"}
                                        {...register("confirmNewPassword", {
                                            required: "Confirme a sua nova palavra-passe",
                                            validate: value => value === recoveryPasswordValue || "As palavras-passe não coincidem"
                                        })}
                                        placeholder="Confirmar Nova Palavra-Passe"
                                    />
                                    <button type="button" onClick={() => setShowPass(!showPass)}>
                                        {showPass ? <FaEyeSlash /> : <FaEye />}
                                    </button>
                                </div>
                                {errors.confirmNewPassword && <p className="error">{errors.confirmNewPassword.message}</p>}

                                <button type="submit" className="btn-main" style={{ marginTop: "10px" }}>
                                    GRAVAR NOVA PALAVRA-PASSE
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    // -------------------------------------------------------------
    // RENDERIZAÇÃO DO MODO PADRÃO (LOGIN / REGISTO)
    // -------------------------------------------------------------
    return (
        <div className="auth-wrapper">
            <div className="auth-split-container">
                <div className="auth-form-side">
                    <h2>{isLoginMode ? "Iniciar Sessão" : "Criar Conta"}</h2>

                    <form onSubmit={handleSubmit(onAuthSubmit)}>

                        {/* CAMPOS EXCLUSIVOS DO MODO DE REGISTO */}
                        {!isLoginMode && (
                            <>
                                <input {...register("nome", { required: !isLoginMode })} placeholder="Nome" />
                                <input {...register("apelido", { required: !isLoginMode })} placeholder="Apelido" />
                                <input {...register("nif", { required: !isLoginMode })} placeholder="NIF" />
                                <input {...register("telemovel")} placeholder="Telemóvel" />
                                <input {...register("morada.logradouro", { required: !isLoginMode })} placeholder="Rua / Logradouro" />
                                <input {...register("morada.numero")} placeholder="Número da Porta" />
                                <input {...register("morada.andar")} placeholder="Andar / Apartamento" />
                                <input {...register("morada.codigoPostal", { required: !isLoginMode })} placeholder="Código Postal" />
                                <input {...register("morada.cidade", { required: !isLoginMode })} placeholder="Cidade" />
                                <input {...register("morada.pais", { required: !isLoginMode })} placeholder="País" />
                            </>
                        )}

                        {/* CAMPO DE EMAIL */}
                        <input {...register("email", { required: true })} type="email" placeholder="Email" />

                        {/* BLOCO DA PALAVRA-PASSE */}
                        <div className="pass-input">
                            <input
                                type={showPass ? "text" : "password"}
                                {...register("password", {
                                    required: true,
                                    pattern: isLoginMode ? undefined : {
                                        value: passwordRegex,
                                        message: "Mínimo 6 caracteres, com maiúscula, minúscula, número e especial (ex: #)."
                                    }
                                })}
                                placeholder="Palavra-Passe"
                            />
                            <button type="button" onClick={() => setShowPass(!showPass)}>
                                {showPass ? <FaEyeSlash /> : <FaEye />}
                            </button>
                        </div>
                        {errors.password && <p className="error">{errors.password.message}</p>}

                        {/* BLOCO DE CONFIRMAÇÃO DE PALAVRA-PASSE (Apenas no Registo) */}
                        {!isLoginMode && (
                            <div className="pass-input">
                                <input
                                    type={showPass ? "text" : "password"}
                                    {...register("confirmPassword", {
                                        required: !isLoginMode ? "Confirma a tua palavra-passe" : false,
                                        validate: value => isLoginMode || value === passwordValue || "As palavras-passe não coincidem"
                                    })}
                                    placeholder="Confirmar Palavra-Passe"
                                />
                                <button type="button" onClick={() => setShowPass(!showPass)}>
                                    {showPass ? <FaEyeSlash /> : <FaEye />}
                                </button>
                            </div>
                        )}
                        {errors.confirmPassword && <p className="error">{errors.confirmPassword.message}</p>}

                        {/* Link de "Esqueci-me da password" */}
                        {isLoginMode && (
                            <div style={{ textAlign: "right", marginBottom: "15px" }}>
                                <button
                                    type="button"
                                    onClick={() => setIsRecoveryMode(true)}
                                    style={{ background: "none", border: "none", color: "#0f4c5c", cursor: "pointer", fontSize: "13px", textDecoration: "underline" }}
                                >
                                    Esqueceu-se da palavra-passe?
                                </button>
                            </div>
                        )}

                        <button type="submit" className="btn-main">
                            {isLoginMode ? "INICIAR SESSÃO" : "CRIAR CONTA"}
                        </button>
                    </form>
                </div>

                <div className="auth-info-side">
                    <button type="button" onClick={() => setIsLoginMode(!isLoginMode)} className="btn-secondary">
                        {isLoginMode ? "CRIAR CONTA" : "INICIAR SESSÃO"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Auth;