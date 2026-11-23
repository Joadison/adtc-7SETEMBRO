"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { fetchEventsOfMonths } from "@/lib/calendar-client";
import type { EscalaFields, FieldKey } from "@/lib/calendar-description";
import { MESES } from "@/lib/escala-types";
import {
  montarSlots,
  resumoSyncSlots,
  sincronizarSlots,
  slotAlterado,
  type ConfigEscala,
  type Slot,
} from "@/lib/escalas-periodo";
import { opcoesPeriodo, periodoAtual } from "@/lib/periodos";

/** Estado de uma escala por período: carrega do Calendar, edita, envia só o que mudou. */
export function useEscalaPeriodo(config: ConfigEscala, ativo: boolean) {
  const opcoes = useMemo(() => opcoesPeriodo(config.periodo), [config.periodo]);
  const [ano, setAno] = useState(() => new Date().getFullYear());
  const [periodo, setPeriodo] = useState(() => periodoAtual(config.periodo));
  const [slots, setSlots] = useState<Slot[]>([]);
  const [base, setBase] = useState<Record<string, EscalaFields>>({});
  const [carregando, setCarregando] = useState(false);
  const [sincronizando, setSincronizando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const carregado = useRef<string | null>(null);

  const opcao = opcoes.find((o) => o.value === periodo) ?? opcoes[0];

  const carregar = useCallback(async () => {
    setCarregando(true);
    setErro(null);
    try {
      const eventos = await fetchEventsOfMonths(opcao.meses.map((m) => MESES[m]), ano);
      const novos = montarSlots(config, opcao.meses, ano, eventos);
      setSlots(novos);
      setBase(Object.fromEntries(novos.map((s) => [s.id, { ...s.campos }])));
      carregado.current = `${ano}-${periodo}`;
    } catch (e: any) {
      setErro(e.message);
    } finally {
      setCarregando(false);
    }
  }, [config, opcao, ano, periodo]);

  // carrega quando a aba é aberta e quando muda ano/período (sem descartar edições ao só trocar de aba)
  useEffect(() => {
    if (ativo && carregado.current !== `${ano}-${periodo}`) carregar();
  }, [ativo, ano, periodo, carregar]);

  const setCampo = (slotId: string, campo: FieldKey, valor: string) =>
    setSlots((s) => s.map((x) => (x.id === slotId ? { ...x, campos: { ...x.campos, [campo]: valor } } : x)));

  const sincronizar = async () => {
    setSincronizando(true);
    try {
      alert(resumoSyncSlots(await sincronizarSlots(config, slots, base)));
      await carregar(); // recarrega: novos ids e nova base
    } catch (e: any) {
      console.error(e);
      alert("Erro ao sincronizar: " + e.message);
    } finally {
      setSincronizando(false);
    }
  };

  const alterado = (slot: Slot) => slotAlterado(config, slot, base[slot.id]);
  const temAlteracao = slots.some(alterado);

  return {
    opcoes, opcao, ano, setAno, periodo, setPeriodo,
    slots, setCampo, alterado, temAlteracao,
    carregando, sincronizando, erro, sincronizar,
    titulo: `${config.titulo} – ${opcao.curto}`,
    subtitulo: [`${opcao.nomes} de ${ano}`, config.subtituloPreview].filter(Boolean).join(" · "),
    arquivo: `${config.titulo.replace(/\s+/g, "-")}-${opcao.curto.replace(/\W+/g, "-")}-${ano}.png`,
  };
}
