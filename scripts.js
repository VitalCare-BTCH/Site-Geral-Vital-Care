document.addEventListener("DOMContentLoaded", () => {
    
    // ========================================================================
    // FUNÇÃO PARA CALCULAR A IDADE CORRETAMENTE A PARTIR DA DATA DE NASCIMENTO
    // ========================================================================
    const calculateAge = (dobString) => {
        if (!dobString) return "N/A";
        const parts = dobString.split('/');
        // parts[2]=Ano, parts[1]=Mês, parts[0]=Dia
        const birthDate = new Date(parts[2], parts[1] - 1, parts[0]);
        const today = new Date();
        
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    };


    // ========================================================================
    // DADOS MESTRES DO PROJETO (SIMULAÇÃO) - IDADE REMOVIDA
    // ========================================================================
    const UNIDADES_CIDADE = [
        { id: 'ubs-central', nome: 'UBS Central', tipo: 'UBS', endereco: 'Rua das Flores, 100' },
        { id: 'upa-norte', nome: 'UPA Zona Norte', tipo: 'UPA', endereco: 'Av. Brasil, 500' },
        { id: 'hosp-geral', nome: 'Hospital Geral', tipo: 'HOSPITAL', endereco: 'Rua Principal, 12' },
        { id: 'ubs-sul', nome: 'UBS Bairro Sul', tipo: 'UBS', endereco: 'Rua do Sol, 30' },
        { id: 'upa-leste', nome: 'UPA Leste', tipo: 'UPA', endereco: 'Av. Leste, 200' },
    ];

    // Os dados mantêm data_nascimento, mas o campo 'idade' não é mais usado na renderização
    const data = {
        medico: {
            'ubs-central': { 
                stats: { pendentes: 8, realizados_dia: 10, realizados_total: 460, tempo_medio_minutos: 15 }, 
                pacientes: [
                    { 
                        id: 1, nome: "Ana Silva", genero: "F", status: "agendada", cpf: "123.456.789-00", 
                        data_nascimento: "15/05/1991", historico: ["Consulta de rotina"], 
                        especialidade: "Clínica Geral", horario: "08:00", 
                        sintomas: ["Dor de cabeça"], tempo_sintomas: "2 dias", 
                        medicamentos_continuos: "Nenhum", doencas_cronicas: "Nenhuma condição crônica" 
                    },
                    { 
                        id: 2, nome: "Bruno Costa", genero: "M", status: "agendada", cpf: "987.654.321-01", 
                        data_nascimento: "03/12/1958", historico: ["Acompanhamento Pós-Cirurgia"], 
                        especialidade: "Oftalmologia", horario: "08:30",
                        sintomas: ["Nenhum (pós-operatório)"], tempo_sintomas: "N/A", 
                        medicamentos_continuos: "Losartana, AAS", doencas_cronicas: "Doenças cardíacas"
                    },
                    { 
                        id: 3, nome: "Carla Mendes", genero: "F", status: "agendada", cpf: "111.222.333-22", 
                        data_nascimento: "20/11/2013", historico: ["Exames de rotina"], 
                        especialidade: "Pediatria", horario: "09:00", 
                        sintomas: ["Nenhum"], tempo_sintomas: "N/A", 
                        medicamentos_continuos: "Nenhum", doencas_cronicas: "Asma"
                    },
                    { id: 4, nome: "Daniel Rocha", genero: "M", status: "agendada", cpf: "444.555.666-33", historico: ["Renovação de receita"], especialidade: "Clínica Geral", horario: "09:30", data_nascimento: "01/01/1980", sintomas: ["Nenhum"], tempo_sintomas: "N/A", medicamentos_continuos: "Metformina", doencas_cronicas: "Diabetes mellitus" },
                    { id: 5, nome: "Elena Freire", genero: "F", status: "agendada", cpf: "555.666.777-44", historico: ["Primeira consulta"], especialidade: "Ginecologia", horario: "10:00", data_nascimento: "22/08/1997", sintomas: ["Falta de ar"], tempo_sintomas: "3 dias", medicamentos_continuos: "Nenhum", doencas_cronicas: "Nenhuma condição crônica" },
                ], 
                atividades: [{ hora: "09:30", acao: "Atendimento de Ana Silva finalizado." }, { hora: "08:00", acao: "Checagem da agenda do dia." }] 
            },
            'upa-norte': { 
                stats: { pendentes: 12, realizados_dia: 40, realizados_total: 800, tempo_medio_minutos: 10 }, 
                pacientes: [
                    { 
                        id: 6, nome: "Gustavo Alves", genero: "M", status: "em espera", cpf: "888.999.000-55", 
                        data_nascimento: "10/10/1985", historico: ["Curativo"],
                        sintomas: ["Ferimento ou corte", "Dor abdominal"], tempo_sintomas: "5 horas", 
                        medicamentos_continuos: "Nenhum", doencas_cronicas: "Nenhuma condição crônica" 
                    }
                ], 
                atividades: [{ hora: "14:15", acao: "Diagnóstico de pneumonia para paciente X." }, { hora: "12:00", acao: "Início do plantão médico." }] 
            },
            'hosp-geral': { stats: { pendentes: 3, realizados_dia: 15, realizados_total: 1200, tempo_medio_minutos: 10 }, pacientes: [{ id: 7, nome: "Helena Santos", genero: "F", status: "internada", cpf: "111.000.111-66", historico: ["Liberação"], data_nascimento: "25/07/1972", sintomas: ["Mal-estar geral"], tempo_sintomas: "4 dias", medicamentos_continuos: "Insulina", doencas_cronicas: "Diabetes mellitus, Doenças cardíacas" }], atividades: [{ hora: "10:00", acao: "Transferência de paciente para UTI." }, { hora: "07:00", acao: "Revisão de prontuários de internação." }] },
        },
        enfermeiro: {
            'ubs-central': { stats: { pendentes: 8, realizados_dia: 30, realizados_total: 600, tempo_medio_minutos: 10 }, pacientes: [{ id: 5, nome: "Fernanda Lima", genero: "F", status: "ativo", cpf: "555.666.777-44", historico: ["Medição de pressão"], data_nascimento: "12/12/1989", sintomas: ["Tontura / Vertigem"], tempo_sintomas: "1 dia", medicamentos_continuos: "Pílula Anticoncepcional", doencas_cronicas: "Nenhuma condição crônica" }], atividades: [{ hora: "11:00", acao: "Triagem de 5 novos pacientes." }, { hora: "10:10", acao: "Procedimento de curativo concluído." }] },
            'upa-norte': { stats: { pendentes: 15, realizados_dia: 50, realizados_total: 950, tempo_medio_minutos: 10 }, pacientes: [{ id: 7, nome: "Helena Ribeiro", genero: "F", status: "alta", cpf: "999.000.111-66", historico: ["Remoção de pontos"], data_nascimento: "04/04/1965", sintomas: ["Dor nas costas"], tempo_sintomas: "1 semana", medicamentos_continuos: "Nenhum", doencas_cronicas: "Doença pulmonar obstrutiva crônica (DPOC)" }], atividades: [{ hora: "15:00", acao: "Verificação de sinais vitais em pediatria." }, { hora: "14:30", acao: "Monitoramento de paciente pós-procedimento." }] },
            'hosp-geral': { stats: { pendentes: 4, realizados_dia: 18, realizados_total: 1300, tempo_medio_minutos: 10 }, pacientes: [{ id: 2, nome: "Bruno Costa", genero: "M", status: "acompanhamento", cpf: "987.654.321-01", historico: ["Revisão"], data_nascimento: "03/12/1958", sintomas: ["Nenhum"], tempo_sintomas: "N/A", medicamentos_continuos: "Losartana, AAS", doencas_cronicas: "Doenças cardíacas" }], atividades: [{ hora: "12:45", acao: "Entrega de medicação no setor C." }, { hora: "06:00", acao: "Revisão de estoque de materiais." }] },
        },
    };

    // ========================================================================
    // FUNÇÕES DE MANIPULAÇÃO DO FLUXO E UX
    // ========================================================================
    
    // ... (funções applySidebarLinks, renderUnitList, handleUnitSelectionPage, handleDashboardPage permanecem as mesmas)
    
    // Função que aplica o parâmetro 'unit' em todos os links do sidebar
    const applySidebarLinks = (area, unit) => {
        const links = [
            { id: 'link-dashboard', page: `dashboard-${area}.html` },
            { id: 'link-pacientes', page: `pacientes-${area}.html` },
            { id: 'link-atendimento', page: `atendimento-${area}.html` }
        ];

        links.forEach(link => {
            const el = document.getElementById(link.id);
            if (el) {
                el.href = `${link.page}?unit=${unit}`;
            }
        });
    };

    // 1. Lógica da Página de Seleção de Unidade (com busca)
    const renderUnitList = (searchTerm = '') => {
        const listContainer = document.getElementById('unit-list-container');
        if (!listContainer) return;

        const area = sessionStorage.getItem('userArea') || 'medico';
        listContainer.innerHTML = '';
        
        const filteredUnits = UNIDADES_CIDADE.filter(unit => 
            unit.nome.toLowerCase().includes(searchTerm.toLowerCase()) || 
            unit.tipo.toLowerCase().includes(searchTerm.toLowerCase())
        );

        filteredUnits.forEach(unit => {
            if (data[area][unit.id]) { 
                const card = document.createElement('a');
                card.href = `dashboard-${area}.html?unit=${unit.id}`;
                card.className = 'card user-selection-card';
                card.innerHTML = `
                    <h3 style="color: var(--color-primary);">${unit.nome}</h3>
                    <p>Tipo: ${unit.tipo} | Endereço: ${unit.endereco}</p>
                `;
                listContainer.appendChild(card);
            }
        });

        if (listContainer.children.length === 0) {
            listContainer.innerHTML = `<p class="text-center" style="grid-column: 1 / -1;">Nenhuma unidade encontrada ou disponível para sua área.</p>`;
        }
    };

    const handleUnitSelectionPage = () => {
        const searchInput = document.getElementById('unit-search');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => renderUnitList(e.target.value));
        }
        renderUnitList();
    };

    // 2. Preenchimento da Dashboard
    const handleDashboardPage = (area, unit) => {
        const unitData = data[area][unit];
        const stats = unitData.stats;
        const atividades = unitData.atividades;

        if (stats) {
            document.querySelector('[data-stat="pendentes"]').textContent = stats.pendentes;
            document.querySelector('[data-stat="realizados-dia"]').textContent = stats.realizados_dia;
            document.querySelector('[data-stat="realizados-total"]').textContent = stats.realizados_total;
            document.getElementById('unit-title').textContent = unit.toUpperCase().replace('-', ' ');

            const tempoEsperaMinutos = stats.pendentes * stats.tempo_medio_minutos;
            const horas = Math.floor(tempoEsperaMinutos / 60);
            const minutos = tempoEsperaMinutos % 60;
            
            let tempoFormatado = '';
            if (horas > 0) tempoFormatado += `${horas}h `;
            tempoFormatado += `${minutos}min`;

            document.querySelector('[data-stat="tempo-espera"]').textContent = tempoFormatado.trim();
        }

        const logList = document.getElementById('log-atividades');
        if (logList) {
            logList.innerHTML = '';
            atividades.forEach(item => {
                const li = document.createElement('li');
                li.innerHTML = `<strong>[${item.hora}]</strong> ${item.acao}`;
                logList.appendChild(li);
            });
        }
        
        applySidebarLinks(area, unit);
    };

    // 3. Renderizar Tabela de Pacientes (handlePatientTable)
    const handlePatientTable = (area, unit) => {
        const pacientesData = data[area][unit].pacientes; 
        const tableBody = document.getElementById('pacientes-table-body');
        const tableHead = document.getElementById('pacientes-table-head');
        const searchInput = document.getElementById('search-input');
        const modal = document.getElementById('paciente-modal');
        
        document.getElementById('unit-title').textContent = unit.toUpperCase().replace('-', ' ');
        applySidebarLinks(area, unit);

        // Verifica se a unidade é UBS
        const isUBS = unit.includes('ubs'); 

        // FUNÇÃO DE RENDERIZAÇÃO DO CABEÇALHO DA TABELA
        if (tableHead) {
            if (isUBS) {
                tableHead.innerHTML = `
                    <tr>
                        <th>Horário</th>
                        <th>Nome</th>
                        <th>Especialidade</th>
                        <th>Idade</th>
                        <th>CPF</th>
                        <th>Status</th>
                        <th>Ações</th>
                    </tr>
                `;
            } else {
                 tableHead.innerHTML = `
                    <tr>
                        <th>Nome</th>
                        <th>CPF</th>
                        <th>Status</th>
                        <th>Ações</th>
                    </tr>
                `;
            }
        }

        const renderTable = (filterFn) => {
            tableBody.innerHTML = '';
            pacientesData.filter(filterFn).forEach(p => {
                const iconClass = p.genero === 'M' ? 'fa-male' : 'fa-female';
                
                const row = document.createElement('tr');
                let rowContent = '';
                
                // Calcula a idade do paciente para a exibição na tabela da UBS
                const idadeCalculada = p.data_nascimento ? calculateAge(p.data_nascimento) : 'N/A';

                if (isUBS) {
                    // Formato específico para UBS (com horário, especialidade, idade)
                    rowContent = `
                        <td>${p.horario}</td>
                        <td>
                            <div class="patient-name-container">
                                <i class="fas ${iconClass}"></i>
                                <span>${p.nome}</span>
                            </div>
                        </td>
                        <td>${p.especialidade}</td>
                        <td>${idadeCalculada}</td>
                        <td>${p.cpf}</td>
                        <td><span class="badge badge-success">${p.status.toUpperCase()}</span></td>
                        <td><button class="btn btn-outline" data-id="${p.id}">VER DETALHES</button></td>
                    `;
                } else {
                    // Formato para UPA/HOSPITAL
                    rowContent = `
                        <td>
                            <div class="patient-name-container">
                                <i class="fas ${iconClass}"></i>
                                <span>${p.nome}</span>
                            </div>
                        </td>
                        <td>${p.cpf}</td>
                        <td><span class="badge badge-info">${p.status.toUpperCase()}</span></td>
                        <td><button class="btn btn-outline" data-id="${p.id}">VER DETALHES</button></td>
                    `;
                }
                
                row.innerHTML = rowContent;
                tableBody.appendChild(row);
            });
        };

        const filterPatients = (e) => {
            const searchTerm = e.target.value.toLowerCase();
            renderTable(p => p.nome.toLowerCase().includes(searchTerm) || p.cpf.includes(searchTerm));
        };

        if (searchInput) {
            searchInput.addEventListener('input', filterPatients);
        }

        // Lógica de fechamento do modal
        const closeModal = () => modal?.classList.add('hidden');
        document.getElementById('modal-close')?.addEventListener('click', closeModal);
        modal?.addEventListener('click', (e) => {
            if (e.target.id === 'paciente-modal') { 
                closeModal();
            }
        });

        tableBody.addEventListener('click', (e) => {
            if (e.target.tagName === 'BUTTON') {
                const paciente = pacientesData.find(p => p.id === parseInt(e.target.dataset.id));
                if (paciente) {
                    const idadeCalculada = paciente.data_nascimento ? calculateAge(paciente.data_nascimento) : 'N/A';
                    
                    // Elementos do Modal
                    const additionalInfo = document.getElementById('modal-additional-info');
                    const historicoList = document.getElementById('modal-historico');
                    const prontuarioContent = document.getElementById('prontuario-content');
                    const historicoTitle = modal.querySelector('h4'); // Título "Histórico Médico"

                    // Renderiza o conteúdo fixo do modal (Nome, CPF, Status)
                    document.getElementById('modal-nome').textContent = paciente.nome;
                    document.getElementById('modal-cpf').textContent = paciente.cpf;
                    if (document.getElementById('modal-status')) { 
                        document.getElementById('modal-status').textContent = paciente.status.toUpperCase();
                    }

                    // Garante que ambos os containers estejam limpos
                    if (additionalInfo) additionalInfo.innerHTML = '';
                    if (prontuarioContent) prontuarioContent.innerHTML = '';
                    
                    // LÓGICA DE EXIBIÇÃO CONDICIONAL
                    if (isUBS) {
                        // 1. UBS: Formato original (simples)
                        
                        // Exibe o título do histórico padrão
                        if (historicoTitle) historicoTitle.classList.remove('hidden'); 

                        // Recria o conteúdo adicional ORIGINAL da UBS (especialidade, horário, idade)
                        if (additionalInfo) {
                           if (paciente.especialidade) {
                                additionalInfo.innerHTML += `<p><strong>Especialidade:</strong> ${paciente.especialidade}</p>`;
                                additionalInfo.innerHTML += `<p><strong>Horário:</strong> ${paciente.horario}</p>`;
                                additionalInfo.innerHTML += `<p><strong>Idade:</strong> ${idadeCalculada} anos</p>`;
                           }
                        }

                        // Recria o histórico ORIGINAL da UBS
                        if (historicoList) historicoList.innerHTML = paciente.historico.map(h => `<li>${h}</li>`).join('');

                    } else {
                        // 2. UPA/HOSPITAL: Novo formato de Prontuário Detalhado
                        
                        // Oculta o título do histórico padrão para usar o título interno do prontuário
                        if (historicoTitle) historicoTitle.classList.add('hidden'); 
                        // Limpa a lista de histórico padrão
                        if (historicoList) historicoList.innerHTML = ''; 
                        
                        // Renderiza o Prontuário Detalhado no 'prontuario-content'
                        if (prontuarioContent) {
                            prontuarioContent.innerHTML = `
                                <div class="prontuario-section">
                                    <h3>Informações Pessoais</h3>
                                    <p><strong>Nome Completo:</strong> ${paciente.nome}</p>
                                    <p><strong>CPF:</strong> ${paciente.cpf}</p>
                                    <p><strong>Data de Nascimento:</strong> ${paciente.data_nascimento || 'Não informado'}</p>
                                    <p><strong>Idade:</strong> ${idadeCalculada} anos</p>
                                </div>
                                <div class="prontuario-section">
                                    <h3>Anamnese Rápida / Triagem</h3>
                                    <p><strong>Sintomas:</strong> ${Array.isArray(paciente.sintomas) ? paciente.sintomas.join(', ') : (paciente.sintomas || 'N/A')}</p>
                                    <p><strong>Tempo de Sintomas:</strong> ${paciente.tempo_sintomas || 'N/A'}</p>
                                    <p><strong>Uso de Medicamentos Contínuos:</strong> ${paciente.medicamentos_continuos || 'N/A'}</p>
                                    <p><strong>Doenças Crônicas Pre-Existentes:</strong> ${paciente.doencas_cronicas || 'Nenhuma'}</p>
                                </div>
                                <div class="prontuario-section">
                                    <h3>Histórico Clínico</h3>
                                    <ul>${paciente.historico.map(h => `<li>${h}</li>`).join('')}</ul>
                                </div>
                            `;
                        }
                    }

                    modal.classList.remove('hidden'); 
                }
            }
        });

        renderTable(() => true);
    };
    
    // 4. Lógica de Formulário de Atendimento (handleFormSubmission)
    const handleFormSubmission = () => {
        const form = document.getElementById('atendimento-form');
        const alertDiv = document.getElementById('submission-alert');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                alertDiv.textContent = 'Atendimento registrado com sucesso!';
                alertDiv.classList.remove('hidden');
                alertDiv.classList.add('alert-success');
                form.reset();
            });
        }
    };

    // 5. Inicialização da Aplicação
const init = () => {
    const body = document.body;
    const pageId = body.getAttribute('data-page-id');
    const urlParams = new URLSearchParams(window.location.search);
    const userAreaFromUrl = urlParams.get('area');
    const unitFromUrl = urlParams.get('unit');
    let userAreaFromSession = sessionStorage.getItem('userArea');

    // 🔧 Se a área não estiver na sessão, detecta automaticamente pelo ID da página
    if (!userAreaFromSession) {
        if (pageId.includes('enfermeiro')) {
            userAreaFromSession = 'enfermeiro';
        } else if (pageId.includes('medico')) {
            userAreaFromSession = 'medico';
        } else {
            userAreaFromSession = 'selection';
        }
        sessionStorage.setItem('userArea', userAreaFromSession);
    }

    // Mantém prioridade da URL, se existir
    if (userAreaFromUrl) {
        userAreaFromSession = userAreaFromUrl;
        sessionStorage.setItem('userArea', userAreaFromUrl);
    }

    const userArea = userAreaFromSession;

    // Aplica o tema conforme a área
    body.classList.add(`theme-${userArea}`);

    // Inicialização por página
    if (pageId === 'unidade-selecao') {
        handleUnitSelectionPage();
    } else if (pageId.includes('dashboard') && unitFromUrl) {
        handleDashboardPage(userArea, unitFromUrl);
    } else if (pageId.includes('pacientes') && unitFromUrl) {
        handlePatientTable(userArea, unitFromUrl);
    } else if (pageId === 'atendimento-medico' || pageId === 'atendimento-enfermeiro') {
        handleFormSubmission();
    }

    // Login
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            if (username && password) {
                sessionStorage.setItem('userName', username);
                // Redireciona para seleção de unidade com área armazenada
                sessionStorage.setItem('userArea', username.includes('enf') ? 'enfermeiro' : 'medico');
                window.location.href = 'unidade-selecao.html'; 
            }
        });
    }
};

init(); 
});
