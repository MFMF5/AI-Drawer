/**
 * AI NEURAL PAINTER ENGINE
 */

class PainterAI {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        
        // Renk Veritabanı
        this.colors = {
            'kırmızı': '#e53e3e', 'mavi': '#3182ce', 'yeşil': '#38a169', 
            'sarı': '#ecc94b', 'siyah': '#1a202c', 'turuncu': '#dd6b20', 
            'mor': '#805ad5', 'pembe': '#d53f8c', 'beyaz': '#ffffff'
        };

        // Boyut Veritabanı
        this.sizes = { 'küçük': 30, 'orta': 70, 'büyük': 130, 'devasa': 250 };
    }

    parseAndDraw(sentence) {
        const text = sentence.toLowerCase().trim();
        
        // 1. TEMİZLEME KOMUTU
        if (text.includes('temizle') || text.includes('sil') || text.includes('clear')) {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            return { success: true, msg: "Tuval tamamen temizlendi! Yeni şaheserini bekliyorum." };
        }

        // 2. TÜM EKRANI BOYAMA KOMUTU
        if (text.includes('boya') || text.includes('kapla')) {
            let foundColor = this.extractColor(text);
            this.ctx.fillStyle = foundColor;
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
            return { success: true, msg: `Tüm ekran başarıyla ${this.getColorName(foundColor)} renkle kaplandı.` };
        }

        // 3. ŞEKİL ÇİZME ANALİZİ
        let shape = null;
        if (text.includes('kare') || text.includes('dikdörtgen') || text.includes('kutu')) shape = 'square';
        else if (text.includes('çember') || text.includes('daire') || text.includes('yuvarlak')) shape = 'circle';
        else if (text.includes('çizgi') || text.includes('hat')) shape = 'line';

        if (!shape) {
            return { success: false, msg: "Ne çizmek istediğini tam anlayamadım. Cümle içinde 'kare', 'çember', 'çizgi' gibi kelimeler kullanabilirsin!" };
        }

        // Renk ve Boyut Ayıkla
        let color = this.extractColor(text);
        let size = this.extractSize(text);

        // Rastgele Koordinat Belirle (Tuvalin ortalarında bir yere çizsin)
        let x = Math.random() * (this.canvas.width - size * 2) + size;
        let y = Math.random() * (this.canvas.height - size * 2) + size;

        // Çizimi Gerçekleştir
        this.ctx.fillStyle = color;
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = 5;

        if (shape === 'square') {
            this.ctx.fillRect(x - size/2, y - size/2, size, size);
        } else if (shape === 'circle') {
            this.ctx.beginPath();
            this.ctx.arc(x, y, size / 2, 0, 2 * Math.PI);
            this.ctx.fill();
        } else if (shape === 'line') {
            this.ctx.beginPath();
            this.ctx.moveTo(x - size, y);
            this.ctx.lineTo(x + size, y);
            this.ctx.stroke();
        }

        return { 
            success: true, 
            msg: `İsteğin üzerine tuvalin rastgele bir noktasına **${this.getColorName(color)}** renkte bir **${shape === 'square' ? 'Kare' : shape === 'circle' ? 'Çember' : 'Çizgi'}** yerleştirdim!` 
        };
    }

    extractColor(text) {
        for (let key in this.colors) {
            if (text.includes(key)) return this.colors[key];
        }
        return '#3182ce'; // Varsayılan mavi
    }

    getColorName(hex) {
        for (let key in this.colors) {
            if (this.colors[key] === hex) return key;
        }
        return "özel";
    }

    extractSize(text) {
        for (let key in this.sizes) {
            if (text.includes(key)) return this.sizes[key];
        }
        return 80; // Varsayılan orta boy
    }
}

// Arayüz Bağlantıları
let painter;
const chatOutput = document.getElementById('chatOutput');
const userInput = document.getElementById('userInput');
const sendBtn = document.getElementById('sendBtn');
const brainStatus = document.getElementById('brainStatus');
const brainMood = document.getElementById('brainMood');

function resizeCanvas() {
    const c = document.getElementById('paintCanvas');
    // Tuvalin piksellerini kaybetmeden boyutunu koru
    if(c && painter) {
        c.width = c.parentElement.clientWidth;
        c.height = c.parentElement.clientHeight;
    }
}

window.onload = () => {
    painter = new PainterAI('paintCanvas');
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
};

function processCommand() {
    const cmd = userInput.value.trim();
    if (cmd === "") return;

    // Kullanıcı yazısını ekrana ekle
    appendMsg(cmd, 'user');
    userInput.value = "";

    brainStatus.className = "brain-status thinking";
    brainMood.innerText = "Durum: Çizim Tasarlanıyor...";

    setTimeout(() => {
        const result = painter.parseAndDraw(cmd);
        appendMsg(result.msg, 'ai');
        
        brainStatus.className = "brain-status active";
        brainMood.innerText = "Durum: Tuval Güncellendi";
    }, 400);
}

function appendMsg(text, sender) {
    const div = document.createElement('div');
    div.className = `msg ${sender}`;
    div.innerHTML = sender === 'ai' ? `<strong>[AI]:</strong> ${text}` : text;
    chatOutput.appendChild(div);
    chatOutput.scrollTop = chatOutput.scrollHeight;
}

sendBtn.addEventListener('click', processCommand);
userInput.addEventListener('keypress', (e) => { if(e.key === 'Enter') processCommand(); });
