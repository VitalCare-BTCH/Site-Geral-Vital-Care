document.addEventListener("DOMContentLoaded", () => {
    
    // ========================================================================
    // DADOS MESTRES DO PROJETO (SIMULAÇÃO)
    // ========================================================================
    const UNIDADES_CIDADE = [
        { id: 'ubs-central', nome: 'UBS Central', tipo: 'UBS', endereco: 'Rua das Flores, 100' },
        { id: 'upa-norte', nome: 'UPA Zona Norte', tipo: 'UPA', endereco: 'Av. Brasil, 500' },
        { id: 'hosp-geral', nome: 'Hospital Geral', tipo: 'HOSPITAL', endereco: 'Rua Principal, 12' },
        { id: 'ubs-sul', nome: 'UBS Bairro Sul', tipo: 'UBS', endereco: 'Rua do Sol, 30' },
        { id: 'upa-leste', nome: 'UPA Leste', tipo: 'UPA', endereco: 'Av. Leste, 200' },
    ];

    const data = {
        // Dados de Atendimento/Paciente por Área e por Unidade
        medico: {
            'ubs-central': { 
                stats: { pendentes: 8, realizados_dia: 10, realizados_total: 460, tempo_medio_minutos: 15 }, 
                // NOVOS DADOS PARA UBS (Consultas Agendadas)
                pacientes: [
                    { id: 1, nome: "Ana Silva", genero: "F", status: "agendada", cpf: "123.456.789-00", historico: ["Consulta de rotina"], especialidade: "Clínica Geral", horario: "08:00", idade: 34 },
                    { id: 2, nome: "Bruno Costa", genero: "M", status: "agendada", cpf: "987.654.321-01", historico: ["Acompanhamento Pós-Cirurgia"], especialidade: "Oftalmologia", horario: "08:30", idade: 67 },
                    { id: 3, nome: "Carla Mendes", genero: "F", status: "agendada", cpf: "111.222.333-22", historico: ["Exames de rotina"], especialidade: "Pediatria", horario: "09:00", idade: 12 },
                    { id: 4, nome: "Daniel Rocha", genero: "M", status: "agendada", cpf: "444.555.666-33", historico: ["Renovação de receita"], especialidade: "Clínica Geral", horario: "09:30", idade: 45 },
                    { id: 5, nome: "Elena Freire", genero: "F", status: "agendada", cpf: "555.666.777-44", historico: ["Primeira consulta"], especialidade: "Ginecologia", horario: "10:00", idade: 28 },
                ], 
                atividades: [{ hora: "09:30", acao: "Atendimento de Ana Silva finalizado." }, { hora: "08:00", acao: "Checagem da agenda do dia." }] 
            },
            'upa-norte': { stats: { pendentes: 12, realizados_dia: 40, realizados_total: 800, tempo_medio_minutos: 10 }, pacientes: [{ id: 6, nome: "Gustavo Alves", genero: "M", status: "em espera", cpf: "888.999.000-55", historico: ["Curativo"] }], atividades: [{ hora: "14:15", acao: "Diagnóstico de pneumonia para paciente X." }, { hora: "12:00", acao: "Início do plantão médico." }] },
            'hosp-geral': { stats: { pendentes: 3, realizados_dia: 15, realizados_total: 1200, tempo_medio_minutos: 10 }, pacientes: [{ id: 7, nome: "Helena Santos", genero: "F", status: "internada", cpf: "111.000.111-66", historico: ["Liberação"] }], atividades: [{ hora: "10:00", acao: "Transferência de paciente para UTI." }, { hora: "07:00", acao: "Revisão de prontuários de internação." }] },
        },
        enfermeiro: {
            // ... (Manter os dados do enfermeiro inalterados ou adaptá-los)
            'ubs-central': { stats: { pendentes: 8, realizados_dia: 30, realizados_total: 600, tempo_medio_minutos: 10 }, pacientes: [{ id: 5, nome: "Fernanda Lima", genero: "F", status: "ativo", cpf: "555.666.777-44", historico: ["Medição de pressão"] }], atividades: [{ hora: "11:00", acao: "Triagem de 5 novos pacientes." }, { hora: "10:10", acao: "Procedimento de curativo concluído." }] },
            'upa-norte': { stats: { pendentes: 15, realizados_dia: 50, realizados_total: 950, tempo_medio_minutos: 10 }, pacientes: [{ id: 7, nome: "Helena Ribeiro", genero: "F", status: "alta", cpf: "999.000.111-66", historico: ["Remoção de pontos"] }], atividades: [{ hora: "15:00", acao: "Verificação de sinais vitais em pediatria." }, { hora: "14:30", acao: "Monitoramento de paciente pós-procedimento." }] },
            'hosp-geral': { stats: { pendentes: 4, realizados_dia: 18, realizados_total: 1300, tempo_medio_minutos: 10 }, pacientes: [{ id: 2, nome: "Bruno Costa", genero: "M", status: "acompanhamento", cpf: "987.654.321-01", historico: ["Revisão"] }], atividades: [{ hora: "12:45", acao: "Entrega de medicação no setor C." }, { hora: "06:00", acao: "Revisão de estoque de materiais." }] },
        },
    };

    // ========================================================================
    // FUNÇÕES DE MANIPULAÇÃO DO FLUXO E UX
    // ========================================================================

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

                if (isUBS) {
                    // Novo formato para UBS
                    rowContent = `
                        <td>${p.horario}</td>
                        <td>
                            <div class="patient-name-container">
                                <i class="fas ${iconClass}"></i>
                                <span>${p.nome}</span>
                            </div>
                        </td>
                        <td>${p.especialidade}</td>
                        <td>${p.idade}</td>
                        <td>${p.cpf}</td>
                        <td><span class="badge badge-success">${p.status.toUpperCase()}</span></td>
                        <td><button class="btn btn-outline" data-id="${p.id}">VER DETALHES</button></td>
                    `;
                } else {
                    // Formato original para UPA/HOSPITAL
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
                    // Renderiza o conteúdo do modal
                    document.getElementById('modal-nome').textContent = paciente.nome;
                    document.getElementById('modal-cpf').textContent = paciente.cpf;
                    document.getElementById('modal-status').textContent = paciente.status.toUpperCase();
                    
                    const additionalInfo = document.getElementById('modal-additional-info');
                    additionalInfo.innerHTML = '';
                    if (isUBS && paciente.especialidade) {
                        additionalInfo.innerHTML += `<p><strong>Especialidade:</strong> ${paciente.especialidade}</p>`;
                        additionalInfo.innerHTML += `<p><strong>Horário:</strong> ${paciente.horario}</p>`;
                        additionalInfo.innerHTML += `<p><strong>Idade:</strong> ${paciente.idade} anos</p>`;
                    }

                    const historicoList = document.getElementById('modal-historico');
                    historicoList.innerHTML = paciente.historico.map(h => `<li>${h}</li>`).join('');
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

        if (userAreaFromUrl) {
            userAreaFromSession = userAreaFromUrl;
            sessionStorage.setItem('userArea', userAreaFromUrl);
        }

        const userArea = userAreaFromSession || 'selection';

        body.classList.add(`theme-${userArea}`);
        
        if (pageId === 'unidade-selecao') {
            handleUnitSelectionPage();
        } else if (unitFromUrl) {
            if (pageId.includes('dashboard')) {
                handleDashboardPage(userArea, unitFromUrl);
            } else if (pageId.includes('pacientes')) {
                handlePatientTable(userArea, unitFromUrl);
            }
        } else if (pageId === 'atendimento-medico' || pageId === 'atendimento-enfermeiro') {
            handleFormSubmission();
        }
        
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const username = document.getElementById('username').value;
                const password = document.getElementById('password').value;
                if (username && password) {
                    sessionStorage.setItem('userName', username);
                    // O valor 'medico' é definido na tela de seleção anterior, aqui só redireciona.
                    window.location.href = 'unidade-selecao.html'; 
                }
            });
        }
    };

    init();
});