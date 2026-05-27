/**
 * SİBER İMLEÇ ÇİZGİLERİ VE IZGARA MOTORU (Cursor Line-Tracing Engine)
 */

const matrixCanvas = document.getElementById('cursorMatrixCanvas');
const mCtx = matrixCanvas.getContext('2d');

let mouseX = -1000;
let mouseY = -1000;
let targetX = 0;
let targetY = 0;

function resizeMatrixCanvas() {
    matrixCanvas.width = window.innerWidth;
    matrixCanvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeMatrixCanvas);
resizeMatrixCanvas();

// Fare hareketlerini dinle
window.addEventListener('mousemove', (e) => {
    targetX = e.clientX;
    targetY = e.clientY;
    
    // İlk hareket için ani eşitleme
    if(mouseX === -1000) {
        mouseX = targetX;
        mouseY = targetY;
    }
});

// İmlecin ekrandan çıkma durumu
window.addEventListener('mouseout', () => {
    targetX = -1000;
    targetY = -1000;
});

function drawCursorMatrixLoop() {
    mCtx.clearRect(0, 0, matrixCanvas.width, matrixCanvas.height);

    // Gerçekçi "İmleç Gecikmesi ve Yumuşatma" (Linear Interpolation - Lerp)
    // Bu sayede çizgiler imleci yağ gibi kayarak takip eder
    if(targetX !== -1000) {
        mouseX += (targetX - mouseX) * 0.25;
        mouseY += (targetY - mouseY) * 0.25;
    } else {
        // Fare ekranda değilse çizgileri yavaşça gizle/uzaklaştır
        mouseX += (-1000 - mouseX) * 0.1;
        mouseY += (-1000 - mouseY) * 0.1;
    }

    if (mouseX > -500) {
        // 1. KESKİN İMLEÇ ÇİZGİLERİ (Crosshair Lines)
        mCtx.strokeStyle = 'rgba(6, 182, 212, 0.25)'; // Neon Cyan rengi, hafif şeffaf
        mCtx.lineWidth = 1;
        
        // Yatay İmleç Çizgisi
        mCtx.beginPath();
        mCtx.moveTo(0, mouseY);
        mCtx.lineTo(matrixCanvas.width, mouseY);
        mCtx.stroke();

        // Dikey İmleç Çizgisi
        mCtx.beginPath();
        mCtx.moveTo(mouseX, 0);
        mCtx.lineTo(mouseX, matrixCanvas.height);
        mCtx.stroke();

        // 2. İMLEÇ MERKEZİNDEKİ SİBER İŞARET (+)
        mCtx.strokeStyle = '#ec4899'; // Merkez artı işareti için parlayan pembe
        mCtx.lineWidth = 2;
        let size = 8;
        
        // Yatay küçük artı ucu
        mCtx.beginPath();
        mCtx.moveTo(mouseX - size, mouseY);
        mCtx.lineTo(mouseX + size, mouseY);
        mCtx.stroke();

        // Dikey küçük artı ucu
        mCtx.beginPath();
        mCtx.moveTo(mouseX, mouseY - size);
        mCtx.lineTo(mouseX, mouseY + size);
        mCtx.stroke();

        // 3. İMLEÇ ETRAFINDAKİ RADAR HALKASI
        mCtx.strokeStyle = 'rgba(6, 182, 212, 0.4)';
        mCtx.lineWidth = 1;
        mCtx.beginPath();
        mCtx.arc(mouseX, mouseY, 18, 0, 2 * Math.PI);
        mCtx.stroke();
    }

    requestAnimationFrame(drawCursorMatrixLoop);
}

// Görsel motoru çalıştır
drawCursorMatrixLoop();
