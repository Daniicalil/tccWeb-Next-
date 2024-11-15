"use client";
import { useState, useEffect } from 'react';
import Image from "next/image";
import styles from "./page.module.css";
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { IoCheckmarkCircleOutline, IoAlertCircleOutline } from "react-icons/io5";
import { IoChevronBack, IoChevronForward, IoCaretBack, IoCaretForward } from "react-icons/io5";
import api from '@/services/api';

import FileInput from '@/componentes/FileInput/page';
import ModalConfirmar from '@/componentes/modalConfirmar/page';
import ModalAddAutor from '@/componentes/modalAddAutor/page';
import ModalAddEditora from '@/componentes/modalAddEditora/page';
import ModalAddGenero from '@/componentes/modalAddGenero/page';
import ModaisLiv_ from '../../componentes/modaisLiv_/page';

export default function AddLivroNovo({ codLiv }) {
    const [capaImage, setCapaImage] = useState('/imagens_telas/imgLivroNovo.jpg');
    const router = useRouter();

    const [autor, setAutor] = useState([]);
    const [editora, setEditora] = useState([]);
    const [genLiv, setGenLiv] = useState([]);
    const [generoSelecionadoLivro, setGeneroSelecionadoLivro] = useState(null);
    const [generoSelecionadoEscola, setGeneroSelecionadoEscola] = useState(null);
    console.log(generoSelecionadoLivro);

    const handleClickLivro = (gen_cod) => {
        setGeneroSelecionadoLivro(gen_cod);
    };
    const handleClickEscola = (gen_cod) => {
        setGeneroSelecionadoEscola(gen_cod);
    };

    const handleAddGenero = async () => {
        if (!livro.liv_cod) {
            alert("O livro precisa ser cadastrado antes de adicionar um gênero.");
            return;
        }

        try {
            const response = await api.post(`/livros_generos`, { liv_cod: codLiv, gen_cod: generoSelecionadoEscola });
            if (response.data.sucesso) {
                alert('Gênero adicionado com sucesso!');
                listaGeneros();
                handleCarregaLivro();
            }
        } catch (error) {
            console.error("Error ao adicionar gênero:", error);
            alert(error.response ? error.response.data.mensagem : 'Erro ao adicionar gênero. Tente novamente.');
        }
    };

    const handleRemoveGenero = async (gen_cod) => {
        try {
            const response = await api.delete(`/livros_generos/${generoSelecionadoLivro}`);
            if (response.data.sucesso) {
                alert('Gênero removido com sucesso!');
                listaGeneros();
                handleCarregaLivro();
            }
        } catch (error) {
            console.error("Error ao remover gênero:", error);
            alert(error.response ? error.response.data.mensagem : 'Erro ao remover gênero. Tente novamente.');
        }
    };

    const [livro, setLivro] = useState({
        "liv_cod": '',
        "liv_pha_cod": '',
        "liv_categ_cod": '',
        "liv_nome": '',
        "liv_desc": '',
        "edt_nome": '',
        "edt_cod": '',
        "liv_foto_capa": '',
        "aut_nome": '',
        "aut_cod": '',
        "disponivel": '',
        "Generos": [],
        "gen_cod": '',
        "gen_nome": '',
    });

    const valDefault = styles.formControl;
    const valSucesso = styles.formControl + ' ' + styles.success;
    const valErro = styles.formControl + ' ' + styles.error;

    const [showModalConfirm, setShowModalConfirm] = useState(false);
    const openModalConfirm = () => setShowModalConfirm(true);
    const closeModalConfirm = () => setShowModalConfirm(false);
    const handleConfirm = () => {
        setShowModalConfirm(false);
        router.push('../biblioteca');
    };

    const [showModalAutor, setShowModalAutor] = useState(false);
    const openModalAutor = () => setShowModalAutor(true);
    const closeModalAutor = () => setShowModalAutor(false);
    const handleAutor = () => {
        setShowModalAutor(false);
        router.push('../gerenciarLivroExistente');
    };

    const [showModalEditora, setShowModalEditora] = useState(false);
    const openModalEditora = () => setShowModalEditora(true);
    const closeModalEditora = () => setShowModalEditora(false);
    const handleEditora = () => {
        setShowModalEditora(false);
        router.push('../gerenciarLivroExistente');
    };

    const [showModalGenero, setShowModalGenero] = useState(false);
    const openModalGenero = () => setShowModalGenero(true);
    const closeModalGenero = () => setShowModalGenero(false);
    const handleGenero = () => {
        setShowModalGenero(false);
        router.push('../gerenciarLivroExistente');
    };

    const handleFileSelect = (imageUrl) => {
        setCapaImage(imageUrl);
    };

    useEffect(() => {
        listaAutores();
        listaEditoras();
    }, []);

    async function listaAutores() {
        try {
            const response = await api.get('/autores');
            setAutor(response.data.dados);
            console.log(response.data);
        } catch (error) {
            if (error.response) {
                alert(error.response.data.mensagem + '\n' + error.response.data.dados);
            } else {
                alert('Erro no front-end' + '\n' + error);
            }
        }
    }

    const handleAddAutor = () => {
        event.preventDefault();
        openModalAutor(); // Abre o modal
    };

    async function listaEditoras() {
        try {
            const response = await api.get('/editoras');
            setEditora(response.data.dados);
            console.log(response.data);
        } catch (error) {
            if (error.response) {
                alert(error.response.data.mensagem + '\n' + error.response.data.dados);
            } else {
                alert('Erro no front-end' + '\n' + error);
            }
        }
    }

    const handleFileChange = (e) => {
        const file = e.target.files[0];

        // Verifica se o arquivo foi selecionado
        if (!file) {
            setValida((prevState) => ({
                ...prevState,
                foto: { validado: valErro, mensagem: ["Por favor, selecione uma foto."] },
            }));
            return;
        }

        // Verifica o tipo do arquivo
        const validFileTypes = ["image/jpeg", "image/png"];
        if (!validFileTypes.includes(file.type)) {
            setValida((prevState) => ({
                ...prevState,
                foto: { validado: valErro, mensagem: ["O formato do arquivo deve ser PNG ou JPEG."] },
            }));
            return;
        }

        // Verifica o tamanho do arquivo (limite de 5MB, por exemplo)
        const maxSizeInBytes = 5 * 1024 * 1024;
        if (file.size > maxSizeInBytes) {
            setValida((prevState) => ({
                ...prevState,
                foto: { validado: valErro, mensagem: ["O tamanho do arquivo deve ser menor que 5MB."] },
            }));
            return;
        }

        // Se o arquivo for válido
        setLivro((prev) => ({ ...prev, usu_foto: file }));
        setValida((prevState) => ({
            ...prevState,
            foto: { validado: valSucesso, mensagem: [] },
        }));
    };

    useEffect(() => {
        if (codLiv) listaGeneros();
    }, [codLiv]);

    async function listaGeneros() {
        const dados = { liv_cod: codLiv };
        try {
            const response = await api.post('/dispGeneros', dados);
            setGenLiv(response.data.dados);
            console.log(response.data);
        } catch (error) {
            if (error.response) {
                alert(error.response.data.mensagem + '\n' + error.response.data.dados);
            } else {
                alert('Erro no front-end' + '\n' + error);
            }
        }
    }

    useEffect(() => {
        if (!codLiv) return;

        handleCarregaLivro();
    }, [codLiv]);

    const handleCarregaLivro = async () => {
        const dadosApi = { liv_cod: codLiv };
        try {
            const response = await api.post('/livros', dadosApi);
            if (response.data.sucesso) {
                const livroApi = response.data.dados[0];
                setLivro(livroApi);
            } else {
                alert(response.data.mensagem);
            }
        } catch (error) {
            alert(error.response ? error.response.data.mensagem : 'Erro no front-end');
        }
    };

    // // Função para gerar o código do livro
    // const generateBookCode = () => {
    //     // Aqui você pode implementar a lógica para gerar um código único para o livro.
    //     // Exemplo simples de código gerado aleatoriamente.
    //     return Math.floor(Math.random() * 100); // Código aleatório entre 0 e 9999
    // };

    // // useEffect para definir o código do livro ao entrar na tela
    // useEffect(() => {
    //     const newCode = generateBookCode(); // Gera um novo código
    //     setLivro((prevLivro) => ({ ...prevLivro, liv_cod: newCode })); // Atualiza o estado do livro
    // }, []);



    // validação
    const [valida, setValida] = useState({
        nome: {
            validado: valDefault,
            mensagem: []
        },
        aut_cod: {
            validado: valDefault,
            mensagem: []
        },
        edt_cod: {
            validado: valDefault,
            mensagem: []
        },
        gen_cod: {
            validado: valDefault,
            mensagem: []
        },
        liv_pha_cod: {
            validado: valDefault,
            mensagem: []
        },
        liv_categ_cod: {
            validado: valDefault,
            mensagem: []
        },
        capa: {
            validado: valDefault,
            mensagem: []
        },
        quant: {
            validado: valDefault,
            mensagem: []
        },
        resumo: {
            validado: valDefault,
            mensagem: []
        },
        foto: {
            validado: valDefault,
            mensagem: []
        }
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setLivro((prevLivro) => ({ ...prevLivro, [name]: value }));
    }

    // function validaFoto() {
    //     let objTemp = {
    //         validado: valSucesso,
    //         mensagem: []
    //     };

    //     if (!livro.usu_foto) {
    //         objTemp.validado = valErro;
    //         objTemp.mensagem.push("A foto do livro é obrigatória");
    //     }

    //     setValida((prevState) => ({
    //         ...prevState,
    //         foto: objTemp,
    //     }));

    //     const testeResult = objTemp.mensagem.length === 0 ? 1 : 0;
    //     return testeResult;
    // }

    function validaSelectAutor() {

        let objTemp = {
            validado: valSucesso, // css referente ao estado de validação
            mensagem: [] // array de mensagens de validação
        };

        if (!livro.aut_cod) {
            objTemp.validado = valErro;
            objTemp.mensagem.push('Por favor, selecione o nome do autor.');
        }

        setValida(prevState => ({
            ...prevState, // mantém os valores anteriores
            aut_cod: objTemp // atualiza apenas o campo 'nome'
        }));

        const testeResult = objTemp.mensagem.length === 0 ? 1 : 0;
        return testeResult;
    }

    function validaSelectEditora() {

        let objTemp = {
            validado: valSucesso, // css referente ao estado de validação
            mensagem: [] // array de mensagens de validação
        };

        if (!livro.edt_cod) {
            objTemp.validado = valErro;
            objTemp.mensagem.push('Por favor, selecione o nome da editora.');
        }

        setValida(prevState => ({
            ...prevState, // mantém os valores anteriores
            edt_cod: objTemp // atualiza apenas o campo 'nome'
        }));

        const testeResult = objTemp.mensagem.length === 0 ? 1 : 0;
        return testeResult;
    }

    function validaSelectGenero() {

        let objTemp = {
            validado: valSucesso, // css referente ao estado de validação
            mensagem: [] // array de mensagens de validação
        };

        if (!livro.gen_cod) {
            objTemp.validado = valErro;
            objTemp.mensagem.push('Por favor, selecione o gênero.');
        }

        setValida(prevState => ({
            ...prevState, // mantém os valores anteriores
            gen_cod: objTemp // atualiza apenas o campo 'nome'
        }));

        const testeResult = objTemp.mensagem.length === 0 ? 1 : 0;
        return testeResult;
    }


    function validaQuant() {

        let objTemp = {
            validado: valSucesso, // css referente ao estado de validação
            mensagem: [] // array de mensagens de validação
        };

        if (livro.disponivel === '') {
            objTemp.validado = valErro;
            objTemp.mensagem.push('A quantidade de livros é obrigatória');
        } else if (livro.disponivel.length <= 0) {
            objTemp.validado = valErro;
            objTemp.mensagem.push('A quantidade de livros deve ser maior que 0');
        }

        setValida(prevState => ({
            ...prevState, // mantém os valores anteriores
            quant: objTemp // atualiza apenas o campo 'nome'
        }));

        const testeResult = objTemp.mensagem.length === 0 ? 1 : 0;
        return testeResult;
    }

    function validaNome() {

        let objTemp = {
            validado: valSucesso, // css referente ao estado de validação
            mensagem: [] // array de mensagens de validação
        };

        if (livro.liv_nome === '') {
            objTemp.validado = valErro;
            objTemp.mensagem.push('O nome do livro é obrigatório');
        } else if (livro.liv_nome.length < 5) {
            objTemp.validado = valErro;
            objTemp.mensagem.push('Insira o nome do livro');
        }

        setValida(prevState => ({
            ...prevState, // mantém os valores anteriores
            nome: objTemp // atualiza apenas o campo 'nome'
        }));

        const testeResult = objTemp.mensagem.length === 0 ? 1 : 0;
        return testeResult;
    }

    function validapha() {

        let objTemp = {
            validado: valSucesso, // css referente ao estado de validação
            mensagem: [] // array de mensagens de validação
        };

        if (livro.liv_pha_cod === '') {
            objTemp.validado = valErro;
            objTemp.mensagem.push('O pha do livro é obrigatório');
        } else if (livro.liv_pha_cod.length < 5) {
            objTemp.validado = valErro;
            objTemp.mensagem.push('Insira o pha do livro');
        }

        setValida(prevState => ({
            ...prevState, // mantém os valores anteriores
            liv_pha_cod: objTemp // atualiza apenas o campo 'nome'
        }));

        const testeResult = objTemp.mensagem.length === 0 ? 1 : 0;
        return testeResult;
    }

    function validacateg() {

        let objTemp = {
            validado: valSucesso, // css referente ao estado de validação
            mensagem: [] // array de mensagens de validação
        };

        if (livro.liv_categ_cod === '') {
            objTemp.validado = valErro;
            objTemp.mensagem.push('A categ do livro é obrigatório');
        } else if (livro.liv_categ_cod.length < 5) {
            objTemp.validado = valErro;
            objTemp.mensagem.push('Insira a categ do livro');
        }

        setValida(prevState => ({
            ...prevState, // mantém os valores anteriores
            liv_categ_cod: objTemp // atualiza apenas o campo 'nome'
        }));

        const testeResult = objTemp.mensagem.length === 0 ? 1 : 0;
        return testeResult;
    }

    function validaResumo() {

        let objTemp = {
            validado: valSucesso, // css referente ao estado de validação
            mensagem: [] // array de mensagens de validação
        };

        if (livro.liv_desc === '') {
            objTemp.validado = valErro;
            objTemp.mensagem.push('O resumo do livro é obrigatório');
        } else if (livro.liv_desc.length < 5) {
            objTemp.validado = valErro;
            objTemp.mensagem.push('Insira o resumo do livro');
        }

        setValida(prevState => ({
            ...prevState, // mantém os valores anteriores
            resumo: objTemp // atualiza apenas o campo 'nome'
        }));

        const testeResult = objTemp.mensagem.length === 0 ? 1 : 0;
        return testeResult;
    }

    const [showModaisLiv, setShowModaisLiv] = useState(false);
    const openModaisLiv = () => setShowModaisLiv(true);
    const closeModaisLiv = () => setShowModaisLiv(false);
    const handleLiv = () => {
        setShowModaisLiv(false);
        router.push('../biblioteca');
    };

    async function handleSubmit(event) {
        event.preventDefault();
        let itensValidados = 0;

        // Validar campos
        // itensValidados += validaQuant();
        // itensValidados += validaNome();
        // itensValidados += validaSelectAutor();
        // itensValidados += validaSelectEditora();
        // itensValidados += validaSelectGenero();
        // itensValidados += validapha();
        // itensValidados += validacateg();
        // itensValidados += validaResumo();
        // itensValidados += validaFoto();

        // Verificar se todos os campos estão validados
        console.log('Livro a ser salvo:', livro);
        if (itensValidados === 0) {
            try {
                const response = await api.post('/liv_cadastrar', livro);
                if (response.data.sucesso) {
                    const livroCodigo = response.data.liv_cod; // Supondo que o código do livro seja retornado aqui
                    // Exibindo o aviso de sucesso com o código do livro
                    setLivro((prevLivro) => ({ ...prevLivro, liv_cod: livroCodigo }));
                    alert(`Livro salvo com sucesso! Código do livro: ${livroCodigo}`);

                    if (generoSelecionadoEscola) {
                        await handleAddGenero(); // Chama a função para associar o gênero ao livro
                    }

                    openModaisLiv();
                    router.push('biblioteca');
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
    console.log(livro);

    return (
        <main className={styles.main}>
            <div className="containerGlobal">
                <h1 className={styles.addLivroNovo}>Adicionar livro novo</h1>
                <form id="form" className={styles.container} onSubmit={handleSubmit}>
                    <div className={styles.inputTotal}>
                        <div className={styles.inputImgContainer}>
                            <div className={styles.imgBook}>

                                {/* <div className={valida.foto.validado + ' ' + styles.valFoto} id="valFoto"> */}
                                <p className={styles.textInput}>Capa:</p>
                                <div className={styles.imagePreview}>
                                    <Image
                                        src={capaImage}
                                        alt="Capa do livro"
                                        width={150}
                                        height={200}
                                    />
                                    {/* <IoCheckmarkCircleOutline className={styles.sucesso} />
                                        <IoAlertCircleOutline className={styles.erro} /> */}
                                </div>
                                <FileInput onFileSelect={handleFileSelect} onChange={handleFileChange} />
                                {/* {
                                        valida.foto.mensagem.map(mens => <small key={mens} id="foto" className={styles.small}>{mens}</small>)
                                    }
                                </div> */}
                            </div>
                        </div>
                        <div className={styles.inputContainer}>
                            {/* <div>
                                <p className={styles.textInput}>Código do livro:</p>
                                <div className={styles.divInput}>
                                    <input
                                        type="number"
                                        name='liv_cod'
                                        value={livro.liv_cod}
                                        className={styles.inputQuant}
                                        disabled
                                    />
                                </div>
                            </div> */}

                            <div className={valida.liv_pha_cod.validado + ' ' + styles.valpha} id="valpha">
                                <label className={styles.textInput}>Códido do pha:</label>
                                <div className={styles.divInput}>
                                    <input
                                        id="pha"
                                        name="liv_pha_cod"
                                        value={livro.liv_pha_cod}
                                        className={styles.inputQuant}
                                        onChange={handleChange}
                                    />
                                    <IoCheckmarkCircleOutline className={styles.sucesso} />
                                    <IoAlertCircleOutline className={styles.erro} />
                                </div>
                                {
                                    valida.liv_pha_cod.mensagem.map(mens => <small key={mens} id="pha" className={styles.small}>{mens}</small>)
                                }
                            </div>

                            <div className={valida.liv_categ_cod.validado + ' ' + styles.valResumo} id="valcateg">
                                <label className={styles.textInput}>Código da categ:</label>
                                <div className={styles.divInput}>
                                    <input
                                        id="categ"
                                        name="liv_categ_cod"
                                        value={livro.liv_categ_cod}
                                        className={styles.inputQuant}
                                        onChange={handleChange}
                                    />
                                    <IoCheckmarkCircleOutline className={styles.sucesso} />
                                    <IoAlertCircleOutline className={styles.erro} />
                                </div>
                                {
                                    valida.liv_categ_cod.mensagem.map(mens => <small key={mens} id="categ" className={styles.small}>{mens}</small>)
                                }
                            </div>

                            <div className={valida.quant.validado + ' ' + styles.valQuant} id="valQuant">
                                <label className={styles.textInput}>Quantidade:</label>
                                <div className={styles.divInput}>
                                    <input
                                        type="number"
                                        name="disponivel"
                                        value={livro.disponivel}
                                        className={styles.inputQuant}
                                        onChange={handleChange}
                                    />
                                    <IoCheckmarkCircleOutline className={styles.sucesso} />
                                    <IoAlertCircleOutline className={styles.erro} />
                                </div>
                                {
                                    valida.quant.mensagem.map(mens => <small key={mens} id="quant" className={styles.small}>{mens}</small>)
                                }
                            </div>

                            <div className={valida.nome.validado + ' ' + styles.valNome} id="valNome">
                                <label className={styles.textInput}>Nome:</label>
                                <div className={styles.divInput}>
                                    <input
                                        type="text"
                                        name="liv_nome"
                                        value={livro.liv_nome}
                                        className={styles.inputField}
                                        onChange={handleChange}
                                    />
                                    <IoCheckmarkCircleOutline className={styles.sucesso} />
                                    <IoAlertCircleOutline className={styles.erro} />
                                </div>
                                {
                                    valida.nome.mensagem.map(mens => <small key={mens} id="nome" className={styles.small}>{mens}</small>)
                                }
                            </div>

                            <div className={valida.aut_cod.validado + ' ' + styles.valSelectAut} id="valSelectAut">
                                <label className={styles.textInput}>Autor:</label>
                                <div className={styles.divInput}>
                                    <select id="aut_cod" name="aut_cod" defaultValue={livro.aut_cod} onChange={handleChange} className={styles.inputField}>
                                        <option value="0" disabled style={{ color: '#ccc' }}>Selecione autor(a)</option>
                                        {
                                            autor.map(aut => (
                                                <option key={aut.aut_cod} value={aut.aut_cod}>{`${aut.aut_cod} - ${aut.aut_nome}`}</option>
                                            ))
                                        }
                                    </select>
                                    <IoCheckmarkCircleOutline className={styles.sucesso} />
                                    <IoAlertCircleOutline className={styles.erro} />
                                </div>
                                {
                                    valida.aut_cod.mensagem.map(mens => (
                                        <small key={mens} id="autores" className={styles.small}>{mens}</small>
                                    ))
                                }
                            </div>

                            <div className={valida.edt_cod.validado + ' ' + styles.valSelectEdt} id="valSelectEdt">
                                <label className={styles.textInput}>Editora:</label>
                                <div className={styles.divInput}>
                                    <select id="edt_cod" name="edt_cod" defaultValue={livro.edt_cod} onChange={handleChange} className={styles.inputField}>
                                        <option value="0" disabled style={{ color: '#ccc' }}>Selecione editora</option>
                                        {
                                            editora.map(edt => (
                                                <option key={edt.edt_cod} value={edt.edt_cod}>{`${edt.edt_cod} - ${edt.edt_nome}`}</option>
                                            ))
                                        }
                                    </select>
                                    <IoCheckmarkCircleOutline className={styles.sucesso} />
                                    <IoAlertCircleOutline className={styles.erro} />
                                </div>
                                {
                                    valida.edt_cod.mensagem.map(mens => (
                                        <small key={mens} id="editoras" className={styles.small}>{mens}</small>
                                    ))
                                }
                            </div>

                            <div className={valida.gen_cod.validado + ' ' + styles.valSelectGen} id="valSelectGen">

                                    <div className={styles.listaCursos}>
                                        <div className={styles.inputCursos}>
                                            <label className={styles.textInput}>Gêneros já selecionados:</label>
                                            <div className={styles.divInput}>
                                                <ul
                                                    id="gen_cod"
                                                    name="gen_cod"
                                                    value={livro.gen_cod}
                                                    onChange={handleChange}
                                                    className={styles.opcaoCursos}
                                                >

                                                    {livro.genLiv && livro.genLiv.length > 0 ? (
                                                        livro.genLiv.map((gen) => (
                                                            <li
                                                                key={gen.lge_cod}
                                                                value={gen.lge_cod}
                                                                onClick={() => handleClickLivro(gen.lge_cod)}
                                                                className={generoSelecionadoLivro === gen.lge_cod ? styles.selected : ''}>
                                                                {gen.Generos}
                                                            </li>
                                                        ))
                                                    ) : (
                                                        <p>Não há gêneros registrados.</p>
                                                    )}
                                                </ul>
                                            </div>
                                        </div>
                                        <div className={styles.buttons}>
                                            <button className={styles.cursosButton}
                                                onClick={() => generoSelecionadoEscola && handleAddGenero(generoSelecionadoLivro)}
                                                disabled={!livro.liv_cod}>
                                                <IoChevronBack size={20} color="#FFF" />
                                            </button>
                                            <button className={styles.cursosButton}
                                                onClick={() => generoSelecionadoLivro && handleRemoveGenero(generoSelecionadoEscola)}
                                                disabled={!livro.liv_cod}>
                                                <IoChevronForward size={20} color="#FFF" />
                                            </button>
                                        </div>
                                        <div className={styles.inputCursos}>
                                            <label className={styles.textInput}>Selecione o gênero:</label>
                                            <ul
                                                id="gen_cod"
                                                name="gen_cod"
                                                value={livro.gen_cod}
                                                onChange={handleChange}
                                                className={styles.opcaoCursos}
                                            >
                                                {genLiv.length > 0 ? (
                                                    genLiv.map((gen) => (
                                                        <li
                                                            key={gen.gen_cod}
                                                            value={gen.gen_cod}
                                                            onClick={() => handleClickEscola(gen.gen_cod)}
                                                            className={generoSelecionadoEscola === gen.gen_cod ? styles.selected : ''}>
                                                            {gen.gen_nome}
                                                        </li>
                                                    ))
                                                ) : (
                                                    <p>Não há gêneros registrados.</p>
                                                )}
                                            </ul>
                                        </div>
                                    </div>

                            </div>
                            {
                                valida.gen_cod.mensagem.map(mens => (
                                    <small key={mens} id="generos" className={styles.small}>{mens}</small>
                                ))
                            }

                            <div className={valida.resumo.validado + ' ' + styles.valResumo} id="valResumo">
                                <label className={styles.textInput}>Resumo:</label>
                                <div className={styles.divInput}>
                                    <textarea
                                        id="resumo"
                                        name="liv_desc"
                                        value={livro.liv_desc}
                                        className={styles.inputResumo}
                                        onChange={handleChange}
                                    />
                                    <IoCheckmarkCircleOutline className={styles.sucesso} />
                                    <IoAlertCircleOutline className={styles.erro} />
                                </div>
                                {
                                    valida.resumo.mensagem.map(mens => <small key={mens} id="resumo" className={styles.small}>{mens}</small>)
                                }
                            </div>


                            <div className={styles.tresModais}>
                                {/* Modal para adicionar autor */}
                                <button
                                    type="button"
                                    onClick={handleAddAutor}
                                    className={styles.addButton}
                                >
                                    Adicionar Autor(a)
                                </button>
                                <ModalAddAutor
                                    show={showModalAutor}
                                    onClose={closeModalAutor}
                                    onConfirm={handleAutor}
                                />

                                {/* Modal para adicionar editora */}
                                <button
                                    type="button"
                                    onClick={openModalEditora}
                                    className={styles.addButton}
                                >
                                    Adicionar Editora
                                </button>
                                <ModalAddEditora
                                    show={showModalEditora}
                                    onClose={closeModalEditora}
                                    onConfirm={handleEditora}
                                />

                                {/* Modal para adicionar gênero */}
                                <button
                                    type="button"
                                    onClick={openModalGenero}
                                    className={styles.addButton}
                                >
                                    Adicionar Gênero
                                </button>
                                <ModalAddGenero
                                    show={showModalGenero}
                                    onClose={closeModalGenero}
                                    onConfirm={handleGenero}
                                />
                            </div>
                            <p className={styles.obs}>Obs.: se já tiver adicionado o que deseja em alguns dos botões acima é só selecionar o que deseja no campo selecionável desejável.</p>

                        </div>
                    </div>

                    <div className={styles.editar}>
                        <button
                            type="submit"
                            className={styles.addButtonPrinc}
                        >
                            Adicionar
                        </button>
                    </div>
                    <ModaisLiv_
                        show={showModaisLiv}
                        onClose={closeModaisLiv}
                        onConfirm={handleLiv}
                    />
                    <ModalConfirmar
                        show={showModalConfirm}
                        onClose={closeModalConfirm}
                        onConfirm={handleConfirm}
                    />
                </form>
            </div >
        </main >
    );
}
