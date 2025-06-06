// script.js - JavaScript functions for the InfNet document generator
// script.js - JavaScript functions for the InfNet document generator
// Developed by Luis Castelo Cidrao Neto

// Functions for modelo.html
// -------------------------

// Function to update test numbers

function atualizarNumeroTeste() {
    // Get test number from localStorage (default to 1 if it doesn't exist)
    const numeroTeste = localStorage.getItem('numeroTeste') || '1';

    // Update the number in all titles
    const elemento1 = document.getElementById('numeroTeste1');
    const elemento2 = document.getElementById('numeroTeste2');

    if (elemento1) elemento1.textContent = numeroTeste;
    if (elemento2) elemento2.textContent = numeroTeste;
}

// Function to update document date
function atualizarDataDocumento() {
    // Get date from localStorage or use default format
    const dataAtual = new Date();
    const dia = String(dataAtual.getDate()).padStart(2, '0');
    const mes = String(dataAtual.getMonth() + 1).padStart(2, '0');
    const ano = dataAtual.getFullYear();
    const dataDefault = `${dia}/${mes}/${ano}`;

    const dataDocumento = localStorage.getItem('dataDocumento') || dataDefault;

    // Update the date in the document (only on the first page)
    const dateElement = document.getElementById('dataDocumento');
    if (dateElement) dateElement.textContent = dataDocumento;
}

// Function to update course information
function atualizarInfoCurso() {
    // Get values from localStorage or use default values
    const nomeCurso = localStorage.getItem('nomeCurso') || '{Nome do Curso}';
    const nomeMateria = localStorage.getItem('nomeMateria') || '{Nome da Materia}';
    const nomeAluno = localStorage.getItem('nomeAluno') || '{Seu Nome}';
    const nomeProfessor = localStorage.getItem('nomeProfessor') || '{Nome do Professor}';

    // Update elements in the document
    const cursoElement = document.getElementById('nomeCurso');
    const materiaElement = document.getElementById('nomeMateria');
    const alunoElement = document.getElementById('nomeAluno');
    const professorElement = document.getElementById('nomeProfessor');

    if (cursoElement) cursoElement.textContent = nomeCurso;
    if (materiaElement) materiaElement.textContent = nomeMateria;
    if (alunoElement) alunoElement.textContent = nomeAluno;
    if (professorElement) professorElement.textContent = nomeProfessor;
}

function atualizarLinksRespostas() {
    const container = document.getElementById('respostas-links-container');
    if (!container) return;

    // Clear the container
    container.innerHTML = '';

    // Get links from localStorage
    const linksJSON = localStorage.getItem('respostasLinks');
    if (linksJSON) {
        const links = JSON.parse(linksJSON);

        // Create numbered list if there are links
        if (links.length > 0) {
            const lista = document.createElement('ol');
            lista.style.paddingLeft = '2cm';
            lista.style.lineHeight = '1.5';

            links.forEach(link => {
                const item = document.createElement('li');
                const linkElement = document.createElement('a');
                linkElement.href = link;
                linkElement.textContent = link;
                linkElement.target = '_blank'; // Open in new tab
                linkElement.style.color = '#0066cc';
                item.style.marginBottom = '32px';
                linkElement.style.textDecoration = 'underline';

                item.appendChild(linkElement);
                lista.appendChild(item);
            });

            container.appendChild(lista);
        }
    }
}

function atualizarTextoLivre() {
    const container = document.getElementById('texto-livre-container');
    if (!container) return;

    // Clear the container
    container.innerHTML = '';

    // Get text from localStorage
    const texto = localStorage.getItem('textoLivre');
    if (texto && texto.trim() !== '') {
        // Create a div to hold the text
        const textoDiv = document.createElement('div');
        textoDiv.style.padding = '0 2cm';
        textoDiv.style.lineHeight = '1.5';
        textoDiv.style.marginTop = '20px';
        textoDiv.innerHTML = texto;

        container.appendChild(textoDiv);
    }
}


// Initialize modelo.html page
function initModeloPage() {
    if (document.getElementById('numeroTeste1') || document.getElementById('numeroTeste2')) {
        // Function to update all content
        function atualizarTodoConteudo() {
            atualizarNumeroTeste();
            atualizarDataDocumento();
            atualizarInfoCurso();
            atualizarLinksRespostas();
            atualizarTextoLivre();
        }

        // Execute when page loads
        window.addEventListener('load', function() {
            atualizarTodoConteudo();

            // Set up PDF download button
            const downloadBtn = document.getElementById('download-pdf');
            if (downloadBtn) {
                downloadBtn.addEventListener('click', downloadPDF);
            }
        });

        // Also update when value is changed on another page
        window.addEventListener('storage', function(e) {
            if (e.key === 'numeroTeste' ||
                e.key === 'dataDocumento' ||
                e.key === 'nomeCurso' ||
                e.key === 'nomeMateria' ||
                e.key === 'nomeAluno' ||
                e.key === 'nomeProfessor' ||
                e.key === 'respostasLinks' ||
                e.key === 'textoLivre') {

                atualizarTodoConteudo();
            }
        });

        // Call immediately to ensure content is updated when page is loaded directly
        atualizarTodoConteudo();
    }
}

// Functions for configurar-numero.html
// -----------------------------------

// Função para atualizar a numeração dos links
function atualizarNumeracao() {
    const respostas = document.querySelectorAll('.resposta-item');
    respostas.forEach((item, index) => {
        const label = item.querySelector('label');
        if (label) {
            label.textContent = `${index + 1}:`;
        }
    });
}

// Função para adicionar novo campo de resposta
function adicionarCampoResposta() {
    const container = document.getElementById('respostas-container');
    const novaResposta = document.createElement('div');
    novaResposta.className = 'resposta-item';

    const numeroResposta = container.children.length + 1;

    novaResposta.innerHTML = `
        <div class="resposta-wrapper">
            <label for="resposta${numeroResposta}">${numeroResposta}:</label>
            <input type="text" id="resposta${numeroResposta}" class="resposta-input" placeholder="Cole o link aqui">
            <button type="button" class="remover-resposta">Remover</button>
        </div>
    `;

    container.appendChild(novaResposta);

    // Adicionar evento de remoção ao novo botão
    const botaoRemover = novaResposta.querySelector('.remover-resposta');
    botaoRemover.addEventListener('click', function() {
        novaResposta.remove();
        atualizarNumeracao(); // Atualiza a numeração após remover
    });
}

// Adicionar evento ao botão de adicionar resposta
document.addEventListener('DOMContentLoaded', function() {
    const botaoAdicionar = document.getElementById('adicionar-resposta');
    if (botaoAdicionar) {
        botaoAdicionar.addEventListener('click', adicionarCampoResposta);
    }
});

// Function to load response links from localStorage
function carregarLinksRespostas() {
    const container = document.getElementById('respostas-container');
    if (!container) return;

    // Clear all items from the container
    while (container.children.length > 0) {
        container.removeChild(container.lastChild);
    }

    // Get saved links
    const linksJSON = localStorage.getItem('respostasLinks');
    if (linksJSON) {
        const links = JSON.parse(linksJSON);

        // If there are no links, add an empty field
        if (links.length === 0) {
            adicionarCampoResposta();
        } else {
            // Add a field for each saved link
            links.forEach(link => {
                adicionarCampoResposta(link);
            });
        }
    } else {
        // If there are no saved links, add an empty field
        adicionarCampoResposta();
    }
}

// Function to save response links to localStorage
function salvarLinksRespostas() {
    const inputs = document.querySelectorAll('.resposta-input');
    const links = [];

    inputs.forEach(input => {
        const valor = input.value.trim();
        if (valor) {
            links.push(valor);
        }
    });

    localStorage.setItem('respostasLinks', JSON.stringify(links));
}

// Initialize configurar-numero.html page
function initConfigurarPage() {
    // Check if we're on the configurar-numero page
    const salvarNumeroBtn = document.getElementById('salvarNumero');
    if (!salvarNumeroBtn) return;

    // Load current value
    const numeroSalvo = localStorage.getItem('numeroTeste') || '1';
    document.getElementById('numeroTeste').value = numeroSalvo;

    // Load current date or from storage
    const hoje = new Date();
    const dataFormatada = hoje.toISOString().split('T')[0]; // Format YYYY-MM-DD for input type="date"
    const dataSalva = localStorage.getItem('dataDocumentoInput') || dataFormatada;
    document.getElementById('dataDocumento').value = dataSalva;

    // Load course information
    document.getElementById('nomeCurso').value = localStorage.getItem('nomeCurso') || '';
    document.getElementById('nomeMateria').value = localStorage.getItem('nomeMateria') || '';
    document.getElementById('nomeAluno').value = localStorage.getItem('nomeAluno') || '';
    document.getElementById('nomeProfessor').value = localStorage.getItem('nomeProfessor') || '';

    // Load response links
    carregarLinksRespostas();

    // Initialize custom text editor
    initCustomEditor();

    // Set up event for adding new response
    const adicionarRespostaBtn = document.getElementById('adicionar-resposta');
    if (adicionarRespostaBtn) {
        adicionarRespostaBtn.addEventListener('click', function() {
            adicionarCampoResposta();
        });
    }

    // Set up events for removing responses (for initial item and future items)
    document.addEventListener('click', function(e) {
        if (e.target && e.target.classList.contains('remover-resposta')) {
            e.target.closest('.resposta-item').remove();
        }
    });

    // Set up click event for save button
    salvarNumeroBtn.addEventListener('click', function() {
        const numeroTeste = document.getElementById('numeroTeste').value;
        const dataDocumento = document.getElementById('dataDocumento').value;

        let validado = true;

        // Validate if it's a valid number
        if (!numeroTeste || parseInt(numeroTeste) <= 0) {
            alert('Por favor, insira um número válido maior que zero.');
            validado = false;
        }

        // Validate if date was filled
        if (!dataDocumento) {
            alert('Por favor, selecione uma data para o documento.');
            validado = false;
        }

        if (validado) {
            // Save number to localStorage
            localStorage.setItem('numeroTeste', numeroTeste);

            // Save date to localStorage (input format and display)
            localStorage.setItem('dataDocumentoInput', dataDocumento);

            // Convert to DD/MM/YYYY format for display
            const partes = dataDocumento.split('-');
            if (partes.length === 3) {
                const dataFormatadaDisplay = `${partes[2]}/${partes[1]}/${partes[0]}`;
                localStorage.setItem('dataDocumento', dataFormatadaDisplay);
            }

            // Save course information
            localStorage.setItem('nomeCurso', document.getElementById('nomeCurso').value);
            localStorage.setItem('nomeMateria', document.getElementById('nomeMateria').value);
            localStorage.setItem('nomeAluno', document.getElementById('nomeAluno').value);
            localStorage.setItem('nomeProfessor', document.getElementById('nomeProfessor').value);

            // Save response links
            salvarLinksRespostas();

            // Save text editor content from custom editor
            const editorContent = document.getElementById('editor-texto-livre');
            if (editorContent) {
                localStorage.setItem('textoLivre', editorContent.innerHTML);
            }

            // Show success message
            const statusElement = document.getElementById('status');
            statusElement.textContent = 'Configurações atualizadas com sucesso!';
            statusElement.className = 'status success';
            statusElement.style.display = 'block';

            // Hide message after 3 seconds
            setTimeout(function() {
                statusElement.style.display = 'none';
            }, 3000);

            // Update the document link with a timestamp to force refresh
            const docLink = document.getElementById('abrirDocumento');
            if (docLink) {
                docLink.href = `modelo.html?t=${Date.now()}`;
            }
        }
    });
}

// Função para imprimir
function imprimirPDF() {
    // Oculta o botão antes de imprimir
    const botaoImprimir = document.querySelector('.botao-imprimir');
    if (botaoImprimir) {
        botaoImprimir.style.display = 'none';
    }

    // Chama a função de impressão
    window.print();

    // Restaura o botão depois de imprimir
    setTimeout(() => {
        if (botaoImprimir) {
            botaoImprimir.style.display = 'block';
        }
    }, 1000);
}

// Adicione um evento de clique ao botão (método alternativo)
document.addEventListener('DOMContentLoaded', function() {
    const botaoImprimir = document.querySelector('.botao-imprimir');
    if (botaoImprimir) {
        botaoImprimir.addEventListener('click', imprimirPDF);
    }
});

// Initialize the appropriate page
document.addEventListener('DOMContentLoaded', function() {
    initModeloPage();
    initConfigurarPage();
});

document.addEventListener('DOMContentLoaded', function() {
    const logo = document.querySelector('.rotating-logo');
    // Verifica se a logo com classe rotating-logo existe na página
    if (logo) {
        let isSpinning = false;

        function toggleSpin() {
            if (!isSpinning) {
                logo.classList.add('spinning');
                isSpinning = true;

                // Para a rotação após 5 segundos
                setTimeout(() => {
                    logo.classList.remove('spinning');
                    logo.classList.add('stopping');
                    isSpinning = false;

                    // Remove a classe 'stopping' após a transição
                    setTimeout(() => {
                        logo.classList.remove('stopping');
                    }, 1000);
                }, 5000);
            }
        }

        // Inicia o ciclo de rotação a cada 10 segundos (5 segundos girando + 5 segundos parado)
        setInterval(toggleSpin, 10000);

        // Inicia a primeira rotação
        toggleSpin();
    }
});

// Function to initialize the custom text editor
function initCustomEditor() {
    const editor = document.getElementById('editor-texto-livre');
    if (!editor) return;

    // Load content from localStorage
    const savedContent = localStorage.getItem('textoLivre');
    if (savedContent && savedContent.trim() !== '') {
        editor.innerHTML = savedContent;
    } else {
        editor.innerHTML = '';
    }

    // Function to update button states based on current selection
    function updateButtonStates() {
        const buttons = document.querySelectorAll('.toolbar-btn');
        buttons.forEach(button => {
            const command = button.dataset.command;
            if (['bold', 'italic', 'underline', 'strikeThrough'].includes(command)) {
                if (document.queryCommandState(command)) {
                    button.classList.add('active');
                } else {
                    button.classList.remove('active');
                }
            }
        });

        // Update format selector
        const formatSelector = document.querySelector('.toolbar-select');
        if (formatSelector) {
            const currentFormat = document.queryCommandValue('formatBlock').replace(/[<>]/g, '');
            if (currentFormat && Array.from(formatSelector.options).some(option => option.value === currentFormat)) {
                formatSelector.value = currentFormat;
            } else {
                formatSelector.value = 'p'; // Default to paragraph
            }
        }
    }

    // Add event listeners to toolbar buttons
    const buttons = document.querySelectorAll('.toolbar-btn');
    buttons.forEach(button => {
        button.addEventListener('click', function() {
            const command = this.dataset.command;

            if (command === 'bold' || command === 'italic' || command === 'underline' || 
                command === 'strikeThrough' || command === 'justifyLeft' || 
                command === 'justifyCenter' || command === 'justifyRight' || 
                command === 'insertUnorderedList' || command === 'insertOrderedList') {
                document.execCommand(command, false, null);
                updateButtonStates();
            }

            // Focus back on the editor
            editor.focus();
        });
    });

    // Add event listener to format selector
    const formatSelector = document.querySelector('.toolbar-select');
    if (formatSelector) {
        formatSelector.addEventListener('change', function() {
            const command = this.dataset.command;
            const value = this.value;

            if (command === 'formatBlock') {
                // Format block needs to be wrapped in < >
                document.execCommand(command, false, '<' + value + '>');
            }

            // Focus back on the editor
            editor.focus();
        });
    }

    // Make sure the editor is focused when clicked
    editor.addEventListener('click', function() {
        this.focus();
        updateButtonStates();
    });

    // Update button states when selection changes
    editor.addEventListener('keyup', updateButtonStates);
    editor.addEventListener('mouseup', updateButtonStates);

    // Use document for selectionchange for better browser compatibility
    document.addEventListener('selectionchange', function() {
        // Only update if the editor is focused
        if (document.activeElement === editor) {
            updateButtonStates();
        }
    });

    // Function to check if editor is empty
    function isEditorEmpty() {
        const content = editor.innerHTML.trim();
        return content === '' || content === '<br>' || content === '<div><br></div>';
    }

    // Function to handle placeholder visibility
    function updatePlaceholder() {
        if (isEditorEmpty()) {
            editor.classList.add('empty');
        } else {
            editor.classList.remove('empty');
        }
    }

    // Handle placeholder text
    editor.addEventListener('focus', function() {
        this.classList.add('focused');
        updatePlaceholder();
    });

    editor.addEventListener('blur', function() {
        this.classList.remove('focused');
        if (isEditorEmpty()) {
            this.innerHTML = '';
        }
        updatePlaceholder();
    });

    // Update placeholder on input
    editor.addEventListener('input', updatePlaceholder);

    // Initial update of button states and placeholder
    setTimeout(function() {
        updateButtonStates();
        updatePlaceholder();
    }, 100);
}

