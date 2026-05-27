/**
 * CORE AI - Doğal Dil İşleme ve Anlama Motoru (v1.2)
 */

class CoreAI {
    constructor() {
        // AI'ın kelime/niyet (Intent) haritası
        this.intents = {
            selamlasma: {
                keywords: ['selam', 'merhaba', 'hey', 'sa', 'naber', 'hi'],
                responses: [
                    "Selam insan dostum! Sistemlerim aktif, seni dinliyorum.",
                    "Merhaba! Algoritmalarım senin için hazır. Ne yapıyoruz bugün?",
                    "Hey! Çalışma alanıma hoş geldin. Kod mu yazıyoruz, sohbet mi?"
                ],
                mood: "Kararlı / Neşeli"
            },
            durum_sorgu: {
                keywords: ['nasılsın', 'nasıl gidiyor', 'keyifler', 'durumun ne'],
                responses: [
                    "Çekirdek sıcaklığım normal, nöron simülasyonum kararlı. Sen nasılsın?",
                    "Milyonlarca satır veriyi işlemekle meşgulüm ama senin için her zaman vaktim var. Harikayım!",
                    "Kuantum durumum %100 verimlilikte çalışıyor. Sorularını bekliyorum."
                ],
                mood: "Enerjik"
            },
            kod_yardimi: {
                keywords: ['kod', 'yazılım', 'programlama', 'javascript', 'html', 'css', 'python'],
                responses: [
                    "Kod mu? İşte benim en sevdiğim alan! Fonksiyonu veya algoritmayı söyle, hemen tasarlayayım.",
                    "Yazılım mühendisliği modülüm tetiklendi. Hangi dilde problem yaşıyorsun?",
                    "Mantıksal hata mı var, yoksa sıfırdan bir mimari mi kuruyoruz? Detay ver, halledelim."
                ],
                mood: "Mühendis Modu"
            },
            temizleme: {
                keywords: ['temizle', 'clear', 'sil', 'ekranı temizle'],
                responses: ["CLEAR_COMMAND_TRIGGERED"],
                mood: "Düzenli"
            },
            yardim: {
                keywords: ['yardım', 'help', 'ne yapabilirsin', 'komutlar'],
                responses: [
                    "Ben seni anlayan bir yapay zekayım. Bana 'nasılsın' diyebilir, 'yazılım/kod' projelerinden bahsedebilir ya da ekranı 'temizle' komutuyla sıfırlayabilirsin.",
                    "Doğal dil işleme motorum sayesinde cümlelerinden anlam çıkarabilirim. Rahatça konuş benimle!"
                ],
                mood: "Yardımsever"
            }
        };

        // Eşleşme bulunamazsa verilecek varsayılan yanıtlar
        this.fallbackResponses = [
            "Bu girdi üzerinde derin anlamsal analiz yapıyorum ancak tam niyetini çıkaramadım. Biraz daha açar mısın?",
            "Kelime dağarcığımdaki kurallarla tam eşleşmedi. Kod mu yazmak istiyorsun, yoksa genel bir soru mu?",
            "Seni duydum ve anladım, fakat bu konudaki mantık bloklarım henüz programlanmadı. Başka bir şey deneyelim mi?"
        ];
    }

    // Basit Tokenizer ve Niyet Sınıflandırıcı
    analyze(userInput) {
        const startTime = performance.now();
        const cleanInput = userInput.toLowerCase().trim();
        
        let detectedIntent = null;
        let highestScore = 0;

        // Cümle içindeki kelimeleri tara ve niyet skoru hesapla
        for (let intent in this.intents) {
            let score = 0;
            this.intents[intent].keywords.forEach(keyword => {
                if (cleanInput.includes(keyword)) {
                    score += 1;
                }
            });

            if (score > highestScore) {
                highestScore = score;
                detectedIntent = intent;
            }
        }

        const endTime = performance.now();
        const cognitiveTime = (endTime - startTime).toFixed(2);

        // Yanıtı Belirle
        if (detectedIntent && highestScore > 0) {
            const intentData = this.intents[detectedIntent];
            const randomIndex = Math.floor(Math.random() * intentData.responses.length);
            return {
                response: intentData.responses[randomIndex],
                mood: intentData.mood,
                confidence: Math.min(100, highestScore * 50),
                cognitiveTime: cognitiveTime
            };
        } else {
            const randomIndex = Math.floor(Math.random() * this.fallbackResponses.length);
            return {
                response: this.fallbackResponses[randomIndex],
                mood: "Düşünceli / Belirsiz",
                confidence: 20,
                cognitiveTime: cognitiveTime
            };
        }
    }
}

// Arayüz ve AI Entegrasyonu
const ai = new CoreAI();
const chatOutput = document.getElementById('chatOutput');
const userInput = document.getElementById('userInput');
const sendBtn = document.getElementById('sendBtn');
const aiStatusNode = document.getElementById('aiStatusNode');
const aiMoodText = document.getElementById('aiMoodText');
const statCognitive = document.getElementById('statCognitive');
const statConfidence = document.getElementById('statConfidence');

function handleMessage() {
    const text = userInput.value.trim();
    if (text === "") return;

    // Kullanıcı mesajını ekrana bas
    appendMessage(text, 'user');
    userInput.value = "";

    // AI'ı "Düşünüyor" moduna al
    aiStatusNode.className = "status-indicator thinking";
    aiMoodText.innerText = "Durum: İşleniyor...";

    // Gerçekçi bir AI gecikmesi simüle et (500ms)
    setTimeout(() => {
        const analysis = ai.analyze(text);

        if (analysis.response === "CLEAR_COMMAND_TRIGGERED") {
            chatOutput.innerHTML = `<div class="message ai"><span class="bot-tag">[CORE-AI]:</span> Terminal temizlendi. Hafıza taze.</div>`;
        } else {
            appendMessage(analysis.response, 'ai');
        }

        // Panel İstatistiklerini Güncelle
        aiStatusNode.className = "status-indicator live";
        aiMoodText.innerText = `Durum: ${analysis.mood}`;
        statCognitive.innerText = `${analysis.cognitiveTime}ms`;
        statConfidence.innerText = `%${analysis.confidence}`;

    }, 500);
}

function appendMessage(text, sender) {
    const msgDiv = document.createElement('div');
    msgDiv.className = `message ${sender}`;
    if (sender === 'ai') {
        msgDiv.innerHTML = `<span class="bot-tag">[CORE-AI]:</span> ${text}`;
    } else {
        msgDiv.innerText = text;
    }
    chatOutput.appendChild(msgDiv);
    chatOutput.scrollTop = chatOutput.scrollHeight;
}

sendBtn.addEventListener('click', handleMessage);
userInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') handleMessage(); });
