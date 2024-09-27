"use client"
import { useState } from 'react';
import { useRouter } from 'next/navigation';
// import InputMask from 'react-input-mask';
import styles from './page.module.css';
import Image from 'next/image';
import Link from 'next/link';
import { IoSearchOutline } from "react-icons/io5";
import { IoEye, IoEyeOff, IoCheckmarkCircleOutline, IoAlertCircleOutline } from "react-icons/io5";
import api from '@/services/api';

export default function SignUp() {
    const router = useRouter();

    const [usuario, setUsuario] = useState({
        usu_rm: '',
        usu_nome: '',
        usu_email: '',
        usu_senha: '',
        confSenha: '',
        usu_sexo: '',
    });

    const valDefault = styles.formControl;
    const valSucesso = styles.formControl + ' ' + styles.success;
    const valErro = styles.formControl + ' ' + styles.error;

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };

    async function logar() {

        try {
            const dados = {
                usu_email_rm: login,
                usu_senha: senha
            }

            const response = await api.post('/usuarios', dados);

            if (response.data.sucesso == true) {
                const usuario = response.data.dados;
                const objLogado = {
                    "cod": usuario.usu_cod,
                    "nome": usuario.usu_nome,
                    "acesso": usuario.usu_tipo
                };
                // signin(JSON.stringify(objLogado));                
                localStorage.clear();
                localStorage.setItem('user', JSON.stringify(objLogado));
                router.push('/'); // é possível direcionar de acordo com a situação

            } else {
                alert('Erro: ' + response.data.mensagem + '\n' + response.data.dados)
            }

        } catch (error) {
            if (error.response) {
                alert(error.response.data.dados == null ?
                    error.response.data.mensagem
                    :
                    error.response.data.mensagem + '\n' + error.response.data.dados);
            } else {
                alert('Erro no front-end' + '\n' + error);
            }
        }
    }

    // validação
    const [valida, setValida] = useState({
        nome: {
            validado: valDefault,
            mensagem: []
        },
        rm: {
            validado: valDefault,
            mensagem: []
        },
        email: {
            validado: valDefault,
            mensagem: []
        },
        sexo: {
            validado: valDefault,
            mensagem: []
        },
        senha: {
            validado: valDefault,
            mensagem: []
        },
        confSenha: {
            validado: valDefault,
            mensagem: []
        }
    });

    const handleChange = (e) => {
        setUsuario(prev => ({ ...prev, [e.target.name]: e.target.value }));
    }

    const [select1, setSelect1] = useState('');
    const [select2, setSelect2] = useState('');

    const handleSelect1Change = (e) => {
        setSelect1(e.target.value);
        setSelect2(''); // Limpa o segundo select se algo for selecionado no primeiro
        setError('');
    };

    const handleSelect2Change = (e) => {
        setSelect2(e.target.value);
        setSelect1(''); // Limpa o primeiro select se algo for selecionado no segundo
        setError('');
    };

    function validaSelect() {

        let objTemp = {
            validado: valSucesso, // css referente ao estado de validação
            mensagem: [] // array de mensagens de validação
        };

        if (!select1 && !select2) {
            objTemp.validado = valErro;
            objTemp.mensagem.push('Por favor, selecione uma opção em um dos campos.');
        } else if (select1 && select2) {
            objTemp.validado = valErro;
            objTemp.mensagem.push('Não é permitido selecionar opções em ambos os campos.');
        }

        setValida(prevState => ({
            ...prevState, // mantém os valores anteriores
            opcao: objTemp // atualiza apenas o campo 'nome'
        }));

        const testeResult = objTemp.mensagem.length === 0 ? 1 : 0;
        return testeResult;
    }

    function validaNome() {

        let objTemp = {
            validado: valSucesso, // css referente ao estado de validação
            mensagem: [] // array de mensagens de validação
        };

        if (usuario.usu_nome === '') {
            objTemp.validado = valErro;
            objTemp.mensagem.push('O nome do usuário é obrigatório');
        } else if (usuario.usu_nome.length < 5) {
            objTemp.validado = valErro;
            objTemp.mensagem.push('Insira o nome completo do usuário');
        }

        setValida(prevState => ({
            ...prevState, // mantém os valores anteriores
            nome: objTemp // atualiza apenas o campo 'nome'
        }));

        const testeResult = objTemp.mensagem.length === 0 ? 1 : 0;
        return testeResult;
    }

    function validaRM() {

        let objTemp = {
            validado: valSucesso, // css referente ao estado de validação
            mensagem: [] // array de mensagens de validação
        };

        if (usuario.usu_rm === '') {
            objTemp.validado = valErro;
            objTemp.mensagem.push('O RM do usuário é obrigatório');
        } else if (usuario.usu_rm.length < 6) {
            objTemp.validado = valErro;
            objTemp.mensagem.push('O RM deve ter pelo menos 6 digitos');
        }

        setValida(prevState => ({
            ...prevState, // mantém os valores anteriores
            rm: objTemp // atualiza apenas o campo 'nome'
        }));

        const testeResult = objTemp.mensagem.length === 0 ? 1 : 0;
        return testeResult;
    }

    function checkEmail(email) {
        return /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
            email
        );
    }

    function validaEmail() {
        let objTemp = {
            validado: valSucesso,
            mensagem: []
        };

        if (usuario.usu_email === "") {
            objTemp.validado = valErro;
            objTemp.mensagem.push('O e-mail do usuário é obrigatório');
        } else if (!checkEmail(usuario.usu_email)) {
            objTemp.validado = valErro;
            objTemp.mensagem.push('Insira um e-mail válido');
        }

        setValida(prevState => ({
            ...prevState, // mantém os valores anteriores
            email: objTemp // atualiza apenas o campo 'nome'
        }));

        const testeResult = objTemp.mensagem.length === 0 ? 1 : 0;
        return testeResult;

    }

    function validaSenha() {

        let objTemp = {
            validado: valSucesso,
            mensagem: []
        };

        if (usuario.usu_senha === '') {
            objTemp.validado = valErro;
            objTemp.mensagem.push('O preenchimento da senha é obrigatório');
        } else if (usuario.usu_senha.length < 3) {
            objTemp.validado = valErro;
            objTemp.mensagem.push('A senha deve ter pelo menos 3 caracteres');
        }

        setValida(prevState => ({
            ...prevState, // mantém os valores anteriores
            senha: objTemp // atualiza apenas o campo 'nome'
        }));

        const testeResult = objTemp.mensagem.length === 0 ? 1 : 0;
        return testeResult;
    }

    function validaConfSenha() {

        let objTemp = {
            validado: valSucesso,
            mensagem: []
        };

        if (usuario.confSenha === '') {
            objTemp.validado = valErro;
            objTemp.mensagem.push('A confirmação da senha é obrigatória');
        } else if (usuario.confSenha !== usuario.usu_senha) {
            objTemp.validado = valErro;
            objTemp.mensagem.push('A senha e a confirmação devem ser iguais');
        }

        setValida(prevState => ({
            ...prevState, // mantém os valores anteriores
            confSenha: objTemp // atualiza apenas o campo 'nome'
        }));

        const testeResult = objTemp.mensagem.length === 0 ? 1 : 0;
        return testeResult;
    }

    function validaSexo() {
        let objTemp = {
            validado: valSucesso,
            mensagem: []
        };

        if (usuario.usu_sexo == 0) {
            objTemp.validado = valErro;
            objTemp.mensagem.push('Selecione o sexo do usuário');
        }

        setValida(prevState => ({
            ...prevState,
            sexo: objTemp
        }));

        const testeResult = objTemp.mensagem.length === 0 ? 1 : 0;
        return testeResult;
    }

    async function handleSubmit(event) {
        event.preventDefault();
        let itensValidados = 0;
        itensValidados += validaNome();
        itensValidados += validaRM();
        itensValidados += validaEmail();
        itensValidados += validaSelect();
        itensValidados += validaSexo();
        itensValidados += validaSenha();
        itensValidados += validaConfSenha();

        // salvar quando atingir o número de itens a serem validados
        // alert(itensValidados);
        if (itensValidados === 7) {
            // alert('chama api');            

            try {
                let confirmaCad;
                const response = await api.post('/usuarios', usuario);
                confirmaCad = response.data.sucesso;
                // const idUsu = confirmaCad;
                // alert(idUsu);
                if (confirmaCad) {
                    router.push('/')
                }
            } catch (error) {
                if (error.response) {
                    alert(error.response.data.mensagem + '\n' + error.response.data.dados);
                } else {
                    alert('Erro no front-end' + '\n' + error);
                }
            }
        }
    }


    return (
        <div className="containerGlobal">
            <div className={styles.background}>
                <div className={styles.container}>
                    <div className={styles.imgContainer}>
                        <Image
                            src="/imagens_telas/img_cadastro.png"
                            alt="Imagem tela de cadastro"
                            className={styles.imgCadastro}
                            width={500}
                            height={453}
                        />
                    </div>
                    <div className={styles.conteudo}>
                        <h1 className={styles.cadastro}>Cadastro</h1>
                        <form id="form" onSubmit={handleSubmit}>

                            <div className={valida.rm.validado + ' ' + styles.valRM} id="valRM">
                                <div className={styles.divInput}>
                                    <input
                                        type="number"
                                        name="usu_rm"
                                        placeholder="RM"
                                        className={styles.inputField}
                                        onChange={handleChange}
                                    />
                                    <IoCheckmarkCircleOutline className={styles.sucesso} />
                                    <IoAlertCircleOutline className={styles.erro} />
                                </div>
                                {
                                    valida.rm.mensagem.map(mens => <small key={mens} id="rm" className={styles.small}>{mens}</small>)
                                }
                            </div>

                            {/* estiliza o campo de acordo com o estado da validação (visual feedback) */}
                            <div className={valida.nome.validado + ' ' + styles.valNome} id="valNome">
                                <div className={styles.divInput}>
                                    <input
                                        type="text"
                                        name="usu_nome"
                                        placeholder="Nome completo"
                                        className={styles.inputField}
                                        onChange={handleChange}
                                    />
                                    <IoCheckmarkCircleOutline className={styles.sucesso} />
                                    <IoAlertCircleOutline className={styles.erro} />
                                </div>
                                {
                                    valida.nome.mensagem.map(mens => <small key={mens} id="nome" className={styles.small}>{mens}</small>) //exibe as mensagens de erro ou sucesso para o usuário.
                                }
                            </div>

                            <div className={valida.email.validado + ' ' + styles.valNome} id="valEmail">
                                <div className={styles.divInput}>
                                    <input
                                        type="email"
                                        name="usu_email"
                                        placeholder="E-mail"
                                        className={styles.inputField}
                                        onChange={handleChange}
                                    />
                                    <IoCheckmarkCircleOutline className={styles.sucesso} />
                                    <IoAlertCircleOutline className={styles.erro} />
                                </div>
                                {
                                    valida.email.mensagem.map(mens => <small key={mens} id="email" className={styles.small}>{mens}</small>)
                                }
                            </div>

                            <div className={(valida.opcao && valida.opcao.validado ? valida.opcao.validado : '') + ' ' + styles.valNome} id="valSelect1">
                                <div className={styles.divInput}>
                                    <select id="options" defaultValue="" value={select1} onChange={handleSelect1Change} className={styles.opcao}>
                                        <option value="" disabled>Curso Técnico</option>
                                        <option value="opcao1">Opção 1</option>
                                        <option value="opcao2">Opção 2</option>
                                        <option value="opcao3">Opção 3</option>
                                    </select>
                                    <IoCheckmarkCircleOutline className={styles.sucesso} />
                                    <IoAlertCircleOutline className={styles.erro} />
                                </div>
                                {
                                    valida.opcao && valida.opcao.mensagem && valida.opcao.mensagem.map(mens => (
                                        <small key={mens} id="select" className={styles.small}>{mens}</small>
                                    ))
                                }

                            </div>

                            <div className={(valida.opcao && valida.opcao.validado ? valida.opcao.validado : '') + ' ' + styles.valNome} id="valSelect2">
                                <div className={styles.divInput}>
                                    <select id="options" defaultValue="" value={select2} onChange={handleSelect2Change} className={styles.opcao}>
                                        <option value="" disabled style={{ color: '#ccc' }}>Ensino Médio</option>
                                        <option value="opcao1">Opção 1</option>
                                        <option value="opcao2">Opção 2</option>
                                        <option value="opcao3">Opção 3</option>
                                    </select>
                                    <IoCheckmarkCircleOutline className={styles.sucesso} />
                                    <IoAlertCircleOutline className={styles.erro} />
                                </div>
                                {
                                    valida.opcao && valida.opcao.mensagem && valida.opcao.mensagem.map(mens => (
                                        <small key={mens} id="select" className={styles.small}>{mens}</small>
                                    ))
                                }

                            </div>

                            <div className={styles.doisItens}>
                                <div className={styles.passwordRow}>
                                    <div className={styles.passwordContainer}>
                                        <div className={valida.senha.validado} id="validaSn1">
                                            <div className={styles.divInput}>
                                                <input
                                                    type={showPassword ? 'text' : 'password'}
                                                    name="usu_senha"
                                                    placeholder="Senha"
                                                    className={`${styles.inputField} ${styles.senhaField}`}
                                                    onChange={handleChange}
                                                />
                                                <IoCheckmarkCircleOutline className={styles.sucesso} />
                                                <IoAlertCircleOutline className={styles.erro} />
                                                <span
                                                    onClick={togglePasswordVisibility}
                                                    className={styles.eyeIcon}
                                                >
                                                    {showPassword ? <IoEyeOff /> : <IoEye />}
                                                </span>
                                            </div>
                                            {
                                                valida.senha.mensagem.map(mens => <small key={mens} id="senha" className={styles.small}>{mens}</small>)
                                            }
                                        </div>
                                    </div>


                                    <div className={styles.passwordContainer}>
                                        <div className={valida.confSenha.validado} id="validaSn2">
                                            <div className={styles.divInput}>
                                                <input
                                                    type={showConfirmPassword ? 'text' : 'password'}
                                                    name="confSenha"
                                                    placeholder="Confirmar senha"
                                                    className={`${styles.inputField} ${styles.senhaField}`}
                                                    onChange={handleChange}
                                                />
                                                <IoCheckmarkCircleOutline className={styles.sucesso} />
                                                <IoAlertCircleOutline className={styles.erro} />
                                                <span
                                                    onClick={toggleConfirmPasswordVisibility}
                                                    className={styles.eyeIcon}
                                                >
                                                    {showConfirmPassword ? <IoEyeOff /> : <IoEye />}
                                                </span>
                                            </div>
                                            {
                                                valida.confSenha.mensagem.map(mens => <small key={mens} id="confSenha" className={styles.small}>{mens}</small>)
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <form className={styles.sexoForm} name="sexo" id="sexo" onChange={handleChange} defaultValue={usuario.usu_sexo}>
                                <div className={valida.sexo.validado + ' ' + styles.valSexo} id="valSexo">
                                    <div className={styles.divRadio}>
                                        <legend>Sexo:</legend>
                                        {['feminino', 'masculino', 'neutro', 'padrao'].map((sexo) => (
                                            <label key={sexo} className={styles.buttonRadio}>
                                                <input
                                                    type="radio"
                                                    name="usu_sexo"
                                                    value={sexo}
                                                    defaultChecked={usuario.usu_sexo === sexo}

                                                />
                                                {sexo.charAt(0).toUpperCase() + sexo.slice(1)}
                                            </label>
                                        ))}
                                        <IoCheckmarkCircleOutline className={styles.sucesso} />
                                        <IoAlertCircleOutline className={styles.erro} />
                                    </div>
                                    {
                                        valida.sexo.mensagem.map(mens => <small key={mens} id="sexo" className={styles.small}>{mens}</small>)
                                    }

                                </div>
                            </form>
                            <div className={styles.logar}>
                                Já tem uma conta? <Link href="/usuarios/login">Faça login</Link>
                            </div>

                            <button
                                type="submit"
                                className={styles.cadastroButton}>
                                Fazer cadastro
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
