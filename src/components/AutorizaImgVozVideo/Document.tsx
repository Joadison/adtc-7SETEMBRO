import Image from "next/image";

const channels = [
  "Publicações em redes sociais (Instagram, Facebook, YouTube, TikTok e outras)",
  "Websites e blogs institucionais",
  "Materiais impressos e digitais (folders, cartazes, e-books e apresentações)",
  "Transmissões ao vivo (lives), vídeos gravados ou editados",
  "Exibição em telões, TVs internas ou externas",
  "Outras formas de mídia destinadas à divulgação da atuação e missão da igreja",
];

export function Documents() {
  return (
    <article className="mx-auto" style={{ 
      maxWidth: '100%',
      fontSize: '14px',
      lineHeight: '1.6',
      color: '#000',
      textAlign: 'left', // 👈 Muda de justify para left
    }}>
      <div className="flex justify-start" style={{ marginBottom: '15px' }}>
        <img
          src="https://iiisjlgwrr.ufs.sh/f/c281d545-e49e-478e-ac64-7aa1327160e2-fqjls5.png"
          alt="ADTC 7 de Setembro"
          style={{
            width: 180,
            height: "auto",
            display: "block",
          }}
        />
      </div>

      <header style={{ marginBottom: '12px' }}>
        <h1 style={{
          fontSize: '15px',
          fontWeight: 'bold',
          textAlign: 'center',
          marginBottom: '10px',
          lineHeight: '1.3'
        }}>
          TERMO DE AUTORIZAÇÃO DE USO DE IMAGEM E VOZ
        </h1>
      </header>

      <p style={{ marginBottom: '8px', textIndent: '0' }}>
        Os participantes das atividades promovidas pela{" "}
        <strong>ADTC 7 de Setembro</strong> autorizam, de forma gratuita,
        irrevogável e irretratável, o uso de sua imagem e/ou voz captadas em
        fotografias, vídeos ou gravações de áudio realizadas durante cultos,
        eventos, reuniões, encontros e demais atividades promovidas pela igreja.
      </p>

      <p style={{ marginBottom: '8px' }}>
        Esta autorização é concedida para fins institucionais, promocionais,
        informativos e evangelísticos, permitindo a utilização dos registros
        pelos seguintes meios:
      </p>

      <ul style={{
        listStyle: 'disc',
        paddingLeft: '20px',
        marginBottom: '8px',
        marginTop: '0'
      }}>
        {channels.map((item) => (
          <li key={item} style={{ marginBottom: '3px' }}>{item}</li>
        ))}
      </ul>

      <p style={{ marginBottom: '8px' }}>
        Os participantes declaram estar cientes de que não receberão qualquer
        remuneração pelo uso de sua imagem e/ou voz, tratando-se de uma cessão
        gratuita, voluntária e consciente para apoio às atividades
        institucionais e evangelísticas da igreja.
      </p>

      <p style={{ marginBottom: '8px' }}>
        As imagens, vídeos e áudios poderão ser editados, recortados, adaptados
        ou reproduzidos conforme necessário, sempre preservando a dignidade, a
        honra e a integridade dos participantes.
      </p>

      <p style={{ marginBottom: '8px' }}>
        A presente autorização possui validade por prazo indeterminado e em
        território nacional e internacional, podendo ser revogada mediante
        solicitação formal por escrito. A revogação, entretanto, não produzirá
        efeitos sobre materiais já produzidos, divulgados ou publicados até a
        data do recebimento da solicitação.
      </p>

      <p style={{ marginBottom: '8px' }}>
        Os responsáveis legais que assinarem este termo também autorizam a
        utilização da imagem e/ou voz de seus filhos menores de idade que
        participem das atividades da igreja e venham a ser registrados nos
        materiais produzidos, assumindo integral responsabilidade legal pela
        presente autorização.
      </p>

      <div style={{ marginTop: '20px', paddingTop: '0' }}>
        <h2 style={{
          fontSize: '14px',
          fontWeight: 'bold',
          marginBottom: '10px'
        }}>
          ASSINATURA DOS PARTICIPANTES OU RESPONSÁVEIS LEGAIS
        </h2>

        <p>
          Ao assinar abaixo, declaro estar ciente e de acordo com os termos
          deste documento.
        </p>
      </div>
    </article>
  );
}