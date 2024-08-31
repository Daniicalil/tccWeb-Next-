
import "./globals.css";
import Cabecalho from "@/componentes/cabecalho/page";
import Rodape from "@/componentes/rodape/page";

export const metadata = {
  title: "SmoakBook",
  description: "Generated by create next app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-br">
      <body>
        <div className="layout">
          <Cabecalho />
          {children}
          <Rodape />
        </div>
      </body>
    </html>
  );
}
