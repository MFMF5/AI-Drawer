/**
 * GERÇEK SANATÇI KALEMİ İMLEÇ MOTORU
 */

const canvasEl = document.getElementById('paintCanvas');
const ctxEl = canvasEl.getContext('2d'); // Ana çizim context'ini etkilememek için sadece cursor katmanını her döngüde ayrı yönetmeyeceğiz, fare koordinatını takip edeceğiz.

let mX = -100;
let mY = -100;

// Farenin konumunu kaydet
window.addEventListener('mousemove', (e) => {
    const rect = canvasEl.getBoundingClientRect();
    mX = e.clientX - rect.left;
    mY = e.clientY - rect.top;
});

// Fare tuvalden çıkarsa kalemi gizle
window.addEventListener('mouseout', () => {
    mX = -100;
    mY = -100;
});

// Bu fonksiyon ana loop'a bağlanmak yerine animasyon efektini çizim katmanının üstüne bindirmesin diye, 
// AI her çizim yaptığında tuval sıfırlanmaz ama kalemi canlı göstermek için geçici bir fırça ucu efekti üretebiliriz.
// Ancak en temiz yöntem, kullanıcının fareyle tuvale dokunduğunda Manuel Çizim yapabilmesini de sağlamaktır!
// Al sana sürpriz içinde sürpriz: AI dışında farenle kendin de çizebilirsin!

let isDrawing = false;
window.addEventListener('mousedown', () => isDrawing = true);
window.addEventListener('mouseup', () => isDrawing = false);

// Hem otomatik AI çiziyor hem de farenle sen boyayabiliyorun:
window.addEventListener('mousemove', (e) => {
    if (!isDrawing || !painter) return;
    const rect = canvasEl.getBoundingClientRect();
    const currentX = e.clientX - rect.left;
    const currentY = e.clientY - rect.top;

    const ctx = canvasEl.getContext('2d');
    ctx.fillStyle = '#1a202c'; // Manuel çizim kalemi rengi
    ctx.beginPath();
    ctx.arc(currentX, currentY, 4, 0, 2 * Math.PI);
    ctx.fill();
});
