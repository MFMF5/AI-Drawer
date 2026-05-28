/**
 * GERÇEK TENSORFLOW.JS SİNİR AĞI ÇİZİM MOTORU
 */

class RealNeuralAI {
    constructor() {
        this.canvas = document.getElementById('paintCanvas');
        this.ctx = this.canvas.getContext('2d');
        
        // Kelime Sözlüğü (Bag of Words modeli için kelimeleri benzersiz sayılara eşliyoruz)
        this.vocabulary = [
            'kare', 'kutu', 'dikdörtgen', 'blok', 'küp', // Sınıf 0 (Kare) için kelimeler
            'çember', 'daire', 'yuvarlak', 'güneş', 'top', // Sınıf 1 (Çember) için kelimeler
            'çizgi', 'hat', 'vektör', 'ok', 'şerit'         // Sınıf 2 (Çizgi) için kelimeler
        ];
        
        // Yapay Zekayı Eğiteceğimiz Sentetik Veri Seti (Training Data)
        // Giriş cümleleri -> Çıkış Şekil Sınıfı (0: Kare, 1: Çember, 2: Çizgi)
        this.trainingData = [
            { text: "kare çiz", label: 0 },
            { text: "büyük bir kutu yap", label: 0 },
            { text: "kırmızı dikdörtgen blok yerleştir", label: 0 },
            { text: "ekrana küp koy", label: 0 },
            
            { text: "mavi çember yap", label: 1 },
            { text: "yuvarlak bir daire çiz", label: 1 },
            { text: "sarı bir güneş yap", label: 1 },
            { text: "top gibi yuvarlak olsun", label: 1 },
            
            { text: "düz çizgi çek", label: 2 },
            { text: "uzun bir hat oluştur", label: 2 },
            { text: "vektör şerit yerleştir", label: 2 },
            { text: "ince bir ok çiz", label: 2 }
        ];

        this.model = null;
        this.initNeuralNetwork();
    }

    // Metni Yapay Zekanın Anlayacağı Sayısal Vektöre Dönüştürme (Text Vectorization)
    textToVector(text) {
        const tokens = text.toLowerCase().split(' ');
        const vector = new Array(this.vocabulary.length).fill(0);
        tokens.forEach(token => {
            const index = this.vocabulary.indexOf(token);
            if (index !== -1) vector[index] = 1; // Kelime varsa o indeksi 1 yap
        });
        return vector;
    }

    // Sinir Ağı Mimarisi Oluşturma ve Eğitme
    async initNeuralNetwork() {
        // 1. Model Tipi: Sıralı Katmanlar (Sequential)
        this.model = tf.sequential();
        
        // Giriş Katmanı ve Gizli Katman (32 Yapay Nöron, Aktivasyon Fonksiyonu: ReLU)
        this.model.add(tf.layers.dense({
            inputShape: [this.vocabulary.length],
            units: 32,
            activation: 'relu'
        }));
        
        // Çıkış Katmanı (3 Sınıfımız var: Kare, Çember, Çizgi. Olasılık için Softmax)
        this.model.add(tf.layers.dense({
            units: 3,
            activation: 'softmax'
        }));

        // Modeli Derle (Kayıp Fonksiyonu: Categorical Crossentropy, Optimizasyon: Adam)
        this.model.compile({
            optimizer: tf.train.adam(0.02),
            loss: 'sparseCategoricalCrossentropy',
            metrics: ['accuracy']
        });

        // Verileri TensorFlow Tensor formatına çevir
        const xs = tf.tensor2d(this.trainingData.map(d => this.textToVector(d.text)));
        const ys = tf.tensor1d(this.trainingData.map(d => d.label), 'int32');

        // Sinir Ağını Eğitmeye Başla (100 Döngü/Epoch)
        await this.model.fit(xs, ys, {
            epochs: 100,
            callbacks: {
                onEpochEnd: (epoch, logs) => {
                    document.getElementById('epochValue').innerText = `${epoch + 1}/100`;
                    document.getElementById('lossValue').innerText = logs.loss.toFixed(4);
                }
            }
        });

        // Eğitim Bitti, Arayüzü Aktif Et
        document.getElementById('brainStatus').className = "brain-status active";
        document.getElementById('brainMood').innerText = "Durum: Sinir Ağı Eğitildi!";
        document.getElementById('userInput').disabled = false;
        document.getElementById('sendBtn').disabled = false;
        document.getElementById('initMsg').innerHTML = `<strong>[AI]:</strong> Yapay Sinir Ağı (Neural Network) eğitimimi tamamladım! Artık verdiğin cümleleri matematiksel olarak analiz edebilirim. <br><br>Eğitilmediğim bir cümle kursan bile (Örn: "ekranda parlayan sarı bir güneş olsun") kelimelerin ağırlıklarından ne demek istediğini tahmin edeceğim!`;
    }

    // Gerçek Zamanlı Tahmin Etme (Inference)
    predictAndPaint(sentence) {
        const inputVector = this.textToVector(sentence);
        
        // TensorFlow Belleğinde Tahmin Yürüt
        const prediction = tf.tidy(() => {
            const inputTensor = tf.tensor2d([inputVector]);
            return this.model.predict(inputTensor).dataSync();
        });

        // En yüksek olasılıklı sınıfı bul
        const highestPredictionIndex = prediction.indexOf(Math.max(...prediction));
        const confidence = (prediction[highestPredictionIndex] * 100).toFixed(1);

        // Renk Analizi (Basit estetik için)
        let color = '#3182ce';
        if (sentence.includes('kırmızı')) color = '#e53e3e';
        else if (sentence.includes('yeşil')) color = '#38a169';
        else if (sentence.includes('sarı')) color = '#ecc94b';
        else if (sentence.includes('siyah')) color = '#1a202c';

        this.drawShape(highestPredictionIndex, color);

        const shapes = ['Kare', 'Çember', 'Çizgi'];
        return {
            shape: shapes[highestPredictionIndex],
            confidence: confidence,
            probs: prediction
        };
    }

    drawShape(shapeId, color) {
        let size = 100;
        let x = Math.random() * (this.canvas.width - size * 2) + size;
        let y = Math.random() * (this.canvas.height - size * 2) + size;

        this.ctx.fillStyle = color;
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = 6;

        if (shapeId === 0) { // Kare
            this.ctx.fillRect(x - size/2, y - size/2, size, size);
        } else if (shapeId === 1) { // Çember
            this.ctx.beginPath();
            this.ctx.arc(x, y, size / 2, 0, 2 * Math.PI);
            this.ctx.fill();
        } else if (shapeId === 2) { // Çizgi
            this.ctx.beginPath();
            this.ctx.moveTo(x - size, y);
            this.ctx.lineTo(x + size, y);
            this.ctx.stroke();
        }
    }
}

// Global Tanımlamalar
let aiCore;
const chatOutput = document.getElementById('chatOutput');
const userInput = document.getElementById('userInput');
const sendBtn = document.getElementById('sendBtn');

window.onload = () => {
    aiCore = new RealNeuralAI();
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
};

function resizeCanvas() {
    const c = document.getElementById('paintCanvas');
    if(c) {
        c.width = c.parentElement.clientWidth;
        c.height = c.parentElement.clientHeight;
    }
}

function executeAI() {
    const text = userInput.value.trim();
    if(text === "") return;

    appendMsg(text, 'user');
    userInput.value = "";

    document.getElementById('brainStatus').className = "brain-status thinking";

    setTimeout(() => {
        const result = aiCore.predictAndPaint(text);
        
        let responseHTML = `Matematiksel Tahmin Motoru Sonucu:<br>
        • Karar: <strong>${result.shape}</strong><br>
        • Yapay Zeka Güven Oranı: <strong>%${result.confidence}</strong><br>
        <small>Olasılık Dağılımı (Softmax): [Kare: ${result.probs[0].toFixed(2)}, Çember: ${result.probs[1].toFixed(2)}, Çizgi: ${result.probs[2].toFixed(2)}]</small>`;
        
        appendMsg(responseHTML, 'ai');
        document.getElementById('brainStatus').className = "brain-status active";
    }, 300);
}

function appendMsg(text, sender) {
    const div = document.createElement('div');
    div.className = `msg ${sender}`;
    div.innerHTML = sender === 'ai' ? `<strong>[AI]:</strong> ${text}` : text;
    chatOutput.appendChild(div);
    chatOutput.scrollTop = chatOutput.scrollHeight;
}

sendBtn.addEventListener('click', executeAI);
userInput.addEventListener('keypress', (e) => { if(e.key === 'Enter') executeAI(); });
