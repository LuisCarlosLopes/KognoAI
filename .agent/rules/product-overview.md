---
trigger: model_decision
description: Visão do App Kogno AI
---



# PRD: Kogno AI

**Status:** Pronto para Desenvolvimento
**Data:** 19/11/2025

## 1\. Visão do Produto

O **Kogno** é uma plataforma de aprendizado adaptativo *mobile-first*. Sua missão é otimizar o tempo de estudo através da **Cognição Direcionada**: em vez de entregar conteúdo genérico, utilizamos IA para identificar lacunas de conhecimento e preenchê-las instantaneamente.

No MVP (v1), o conteúdo será focado no **ENEM**, mas a marca e a arquitetura são agnósticas para permitir expansão futura (OAB, Concursos, Certificações).

## 2\. Objetivos de Negócio

  * **Objetivo Primário:** Validar a retenção de aprendizado através do feedback imediato gerado por IA.
  * **Métrica Norte (KPI):** 100 Downloads Orgânicos/mês (Foco em Aquisição).
  * **Métrica de Qualidade:** Taxa de conversão de "Erro" para "Leitura de Explicação" \> 80% (No Modo Treino).

## 3\. Persona Alvo

  * **Lucas, o "Otimizador":** Estudante que valoriza eficiência. Não quer assistir a uma aula de 40 minutos para resolver uma dúvida de 1 minuto. Usa o Kogno nos intervalos (ônibus, almoço) para micro-sessões de estudo.

## 4\. Requisitos Funcionais (User Stories)

### Épico 1: Onboarding & O "Grafo de Conhecimento"

  * **US-01: Mapeamento Inicial**
      * O usuário define suas áreas de dificuldade (ex: "Sou fraco em Química Orgânica").
      * *Impacto:* O algoritmo de seleção priorizará questões desses tópicos nas primeiras sessões.

### Épico 2: Core Loop (Modos de Estudo)

  * **US-02: Seletor de Modo (A Diferenciação)**
      * Ao iniciar uma sessão, o usuário deve escolher entre:
        1.  **Modo Performance (Simulado):** Com timer regressivo, sem feedback imediato. Foco em velocidade e resistência.
        2.  **Modo Cognitivo (Treino):** Sem timer. Foco em aprendizado profundo. Feedback imediato ativado.

### Épico 3: Inteligência Artificial & RAG

  * **US-03: Geração de Questões (Backend)**
      * O sistema consulta a base vetorial (Provas ENEM 2015-2024) e recupera questões baseadas no perfil do aluno.
  * **US-04: Feedback "Kogno AI" (Apenas Modo Treino)**
      * Ao responder uma questão, o sistema envia o contexto para a LLM.
      * **Requisito Crítico:** A IA deve explicar **por que** a alternativa do usuário está certa ou errada, citando o conceito subjacente, e não apenas dar o gabarito.

### Épico 4: Feedback Loop

  * **US-05: Ajuste de Dificuldade**
      * Se o usuário acerta 3 questões seguidas de um tópico no "Modo Cognitivo", o sistema marca aquele tópico como "Dominado" e sugere um novo tópico de maior dificuldade.

## 5\. Requisitos Não-Funcionais

  * **Branding:** Interface minimalista, usando tons que remetam a foco e tecnologia (ex: Azul Profundo, Roxo Elétrico), evitando a estética infantil de "sala de aula".
  * **Performance:** O feedback da IA deve começar a aparecer na tela em menos de 2 segundos (usar *streaming* de texto).
  * **Escalabilidade:** O banco de dados deve ser modelado para aceitar novos "Cursos" (ex: OAB) no futuro sem refatoração do código core.

## 6\. Fora do Escopo (V1)

  * Correção de Redação.
  * Upload de fotos de questões (Visão Computacional).
  * Ranking Social.
  * Assinaturas Pagas.
