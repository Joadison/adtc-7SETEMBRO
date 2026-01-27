import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const mesesParam = searchParams.get('meses');
    let mesesFiltro: number[] = [];
  
    if (mesesParam) {
      mesesFiltro = mesesParam.split(',').map(m => parseInt(m.trim())).filter(m => m >= 1 && m <= 12);
    }
    
    if (mesesFiltro.length === 0) {
      const mesAtual = new Date().getMonth() + 1;
      for (let i = 0; i < 3; i++) {
        const mes = (mesAtual + i - 1) % 12 + 1;
        mesesFiltro.push(mes);
      }
    }
    
    const url = 'https://calendar.google.com/calendar/ical/adtemplocentral7setembro1%40gmail.com/public/basic.ics';
    
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch calendar: ${response.status}`);
    }

    const icsData = await response.text();
    const lines = icsData.split('\n');
    
    let currentEvent: { summary?: string; dtstart?: string } = {};
    const aniversariantesEncontrados: { 
      nome: string; 
      data: string; 
      mes: number; 
      dia: number;
      dataCompleta: string;
    }[] = [];
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      if (line === 'BEGIN:VEVENT') {
        currentEvent = {};
      } else if (line.startsWith('SUMMARY:')) {
        currentEvent.summary = line.substring(8);
      } else if (line.startsWith('DTSTART;VALUE=DATE:') || line.startsWith('DTSTART:')) {
        const dateLine = line.startsWith('DTSTART;VALUE=DATE:') 
          ? line.substring(19) 
          : line.substring(8);
        currentEvent.dtstart = dateLine;
      } else if (line === 'END:VEVENT') {
        if (currentEvent.summary && currentEvent.dtstart) {
          const nome = currentEvent.summary
            .replace(/\\/g, '')
            .trim();
          
          if (nome.toUpperCase().startsWith('SEDE')) {
            currentEvent = {};
            continue;
          }

          const isAniversario = nome.toLowerCase().includes('aniversário') || 
                               nome.toLowerCase().includes('aniversario');

          if (isAniversario) {
            let nomeLimpo = nome
              .replace(/^(?:-|–|—|•|·|\*)\s*/i, '') 
              .replace(/^(?:Ir\.|Irmão|Irmã|Irmao|Irma|Ir|Sr\.|Sr|Sra\.|Sra|Srta\.|Srta)\s*/i, '')
              .replace(/Aniversário de /i, '')
              .replace(/Aniversário /i, '')
              .replace(/\s*\d{1,2}\/\d{1,2}$/, '')
              .replace(/\s*-\s*\d{1,2}\/\d{1,2}$/, '')
              .replace(/\s+/g, ' ')
              .trim();
            
            nomeLimpo = nomeLimpo
              .replace(/^\s*[-–—]\s*/, '') 
              .replace(/\s*[-–—]\s*$/, '')
              .trim();

            if (!nomeLimpo) {
              nomeLimpo = nome
                .replace(/\s*\d{1,2}\/\d{1,2}$/, '')
                .replace(/\s*[-–—]\s*\d{1,2}\/\d{1,2}$/, '')
                .replace(/^\s*[-–—]\s*/, '')
                .trim();
            }
            const dataStr = currentEvent.dtstart!;
            const ano = parseInt(dataStr.substring(0, 4));
            const mes = parseInt(dataStr.substring(4, 6));
            const dia = parseInt(dataStr.substring(6, 8));
            
            // Filtrar pelos meses especificados
            if (mesesFiltro.includes(mes)) {
              aniversariantesEncontrados.push({
                nome: nomeLimpo || nome,
                data: `${dia.toString().padStart(2, '0')}/${mes.toString().padStart(2, '0')}`,
                dataCompleta: `${dia.toString().padStart(2, '0')}/${mes.toString().padStart(2, '0')}`,
                mes,
                dia
              });
            }
          }
        }
        currentEvent = {};
      }
    }
    
    // Ordenar por mês e dia
    aniversariantesEncontrados.sort((a, b) => {
      if (a.mes === b.mes) {
        return a.dia - b.dia;
      }
      return a.mes - b.mes;
    });
    
    return NextResponse.json({
      aniversariantes: aniversariantesEncontrados,
      meses: mesesFiltro,
      total: aniversariantesEncontrados.length
    }, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
    });
    
  } catch (error) {
    console.error('Error fetching calendar:', error);
    return NextResponse.json(
      { error: 'Failed to fetch calendar data' },
      { status: 500 }
    );
  }
}