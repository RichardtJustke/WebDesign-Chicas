/**
 * Demonstração e Controles da Animação de Colunas
 * Use no console do navegador para testar
 */

// Aguardar carregamento da animação
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        if (window.columnAnimation) {
            console.log('🎮 Controles da Animação de Colunas disponíveis:');
            console.log('');
            console.log('📋 Comandos disponíveis:');
            console.log('• columnAnimation.pause() - Pausar animação');
            console.log('• columnAnimation.resume() - Retomar animação');
            console.log('• columnAnimation.stop() - Parar animação');
            console.log('• columnAnimation.restart() - Reiniciar animação');
            console.log('• columnAnimation.setSpeed(6) - Alterar velocidade (segundos)');
            console.log('• columnAnimation.setAmplitude(8) - Alterar amplitude (pixels)');
            console.log('');
            console.log('🎯 Exemplo de uso:');
            console.log('columnAnimation.setSpeed(4); // Animação mais rápida');
            console.log('columnAnimation.setAmplitude(16); // Movimento maior');
            console.log('');
            
            // Adicionar controles visuais (opcional)
            addVisualControls();
        }
    }, 1000);
});

function addVisualControls() {
    // Criar painel de controles (apenas para desenvolvimento)
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        const controlPanel = document.createElement('div');
        controlPanel.id = 'animation-controls';
        controlPanel.style.cssText = `
            position: fixed;
            top: 10px;
            right: 10px;
            background: rgba(0,0,0,0.8);
            color: white;
            padding: 10px;
            border-radius: 8px;
            font-family: monospace;
            font-size: 12px;
            z-index: 9999;
            display: none;
        `;
        
        controlPanel.innerHTML = `
            <div style="margin-bottom: 10px;">
                <strong>🎭 Controles da Animação</strong>
            </div>
            <div style="margin-bottom: 5px;">
                <button onclick="columnAnimation.pause()" style="margin-right: 5px; padding: 2px 6px;">Pausar</button>
                <button onclick="columnAnimation.resume()" style="margin-right: 5px; padding: 2px 6px;">Retomar</button>
                <button onclick="columnAnimation.restart()" style="padding: 2px 6px;">Reiniciar</button>
            </div>
            <div style="margin-bottom: 5px;">
                <label>Velocidade: </label>
                <input type="range" min="2" max="15" value="8" onchange="columnAnimation.setSpeed(this.value)" style="width: 80px;">
                <span id="speed-value">8s</span>
            </div>
            <div>
                <label>Amplitude: </label>
                <input type="range" min="4" max="20" value="12" onchange="columnAnimation.setAmplitude(this.value)" style="width: 80px;">
                <span id="amplitude-value">12px</span>
            </div>
        `;
        
        document.body.appendChild(controlPanel);
        
        // Atualizar valores dos sliders
        const speedSlider = controlPanel.querySelector('input[type="range"]:first-of-type');
        const amplitudeSlider = controlPanel.querySelector('input[type="range"]:last-of-type');
        
        speedSlider.addEventListener('input', function() {
            document.getElementById('speed-value').textContent = this.value + 's';
        });
        
        amplitudeSlider.addEventListener('input', function() {
            document.getElementById('amplitude-value').textContent = this.value + 'px';
        });
        
        // Mostrar/ocultar controles com tecla F12
        document.addEventListener('keydown', function(e) {
            if (e.key === 'F12') {
                e.preventDefault();
                const panel = document.getElementById('animation-controls');
                panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
            }
        });
        
        console.log('🎮 Painel de controles criado! Pressione F12 para mostrar/ocultar');
    }
}
