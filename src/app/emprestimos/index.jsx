import Image from "next/image";
import styles from "./index.module.css";
import Link from 'next/link';

import BarraPesquisa from "@/componentes/barraPesquisa";

export default function Emprestimos() {
  return (
    <main className={styles.main}>
      <div className="containerGlobal">
        <h1 className={styles.emprestimo}>Empréstimos</h1>
        <BarraPesquisa />
        <div className={styles.container}>
          <div className={styles.lineSquare}>
            <div className={styles.inputContainer}>
              <div className={styles.infoBookReserva}>
                <Image
                  src="/Capa_dos_livros/o diário de anne frank.jpg"
                  alt="O Diário de Anne Frank"
                  className={styles.imgReserva}
                />
                <div className={styles.livroInfo}>
                  <p>O Diário de Anne Frank</p>
                  <p>Por: Anne Frank</p>
                </div>
              </div>
              <div className={styles.line}></div>
              <p className={styles.info}>Reservado por: Clara Oliveira da Silva</p>
              <p className={styles.info}>Reserva realizada no dia: 12/03/2024</p>
              <p className={styles.info}>Período da reserva: 12/03/2024 até 27/03/2024</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}