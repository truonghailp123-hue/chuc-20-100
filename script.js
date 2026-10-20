/* =====================================================
   1. DANH SÁCH NHẠC
   volume: âm lượng dự phòng từ 0 đến 1.
   ===================================================== */
const playlist = [
  { title: "Bài hát 1", src: "./assets/1.mp4", volume: 1 },
  { title: "Bài hát 2", src: "./assets/2.mp4", volume: 0.5 },
  { title: "Bài hát 3", src: "./assets/3.mp4", volume: 1 },
  { title: "Bài hát 4", src: "./assets/4.mp4", volume: 1 },
];

/* ================= DANH SÁCH LỜI CHÚC ================= */
const letters = [
  {
    icon: "./assets/letters.png",
    img: "./assets/ban1.jpg",
    text: "Chúc người xinh đẹp như tiên\nLuôn luôn vui vẻ ưu phiền tránh xa\nNhư là con nhà người ta\nLuôn luôn học giỏi lời ca dịu dàng",
  },
  {
    icon: "./assets/q3.png",
    img: "./assets/ban2.jpg",
    text: "Chúc người điều may muôn vàn\nĐường tài như nước đường duyên nhẹ nhàng\nTình duyên như cành hoa ban\nĐường tình hạnh phúc ngập tràn yêu thương",
  },
  {
    icon: "./assets/h1.png",
    img: "./assets/ban4.jpg",
    text: "Thế gian ngàn vạn loài hoa\nNhưng bông đẹp nhất không qua các nàng\nCác nàng lá ngọc cành vàng\nXin người bên cạnh nhẹ nhàng yêu thương",
  },
  {
    icon: "./assets/h3.png",
    img: "./assets/ban6.jpg",
    text: "Nhân ngày 20/10, chúc bạn không chỉ có một ngày ngập tràn hoa và lời chúc, mà còn có thật nhiều ngày được sống theo cách mình mong muốn. Mong những nỗ lực của bạn được trân trọng, những tổn thương được xoa dịu và những ước mơ rồi sẽ có ngày thành hiện thực.",
  },
  {
    icon: "./assets/t2.png",
    img: "./assets/ban5.jpg",
    text: "Nhân ngày 20/10, con chúc mẹ luôn mạnh khỏe, bình an và hạnh phúc. Cảm ơn mẹ vì đã luôn yêu thương, hy sinh và dành cho con những điều tốt đẹp nhất. Mong mẹ lúc nào cũng nở nụ cười trên môi.",
  },
  {
    icon: "./assets/t5.png",
    img: "./assets/ban3.jpg",
    text: "Nhân ngày Phụ nữ Việt Nam 20/10, em xin kính chúc các cô giáo luôn mạnh khỏe, xinh đẹp, hạnh phúc và tràn đầy nhiệt huyết với nghề. Chúc các cô luôn giữ mãi nụ cười trên môi, gặt hái nhiều thành công trong sự nghiệp trồng người và luôn được học trò yêu quý, kính trọng. Em xin chân thành cảm ơn các cô vì những kiến thức, tình yêu thương và sự tận tâm dành cho chúng em!",
  },
];

/* ================= CÁC PHẦN TỬ HTML ================= */
const popup = document.getElementById("popup");
const overlay = document.getElementById("overlay");
const popupImage = document.getElementById("popupImage");
const popupMessage = document.getElementById("popupMessage");
const centerText = document.getElementById("centerText");
const lettersRow = document.getElementById("lettersRow");

const player = document.getElementById("player");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const playPauseBtn = document.getElementById("playPauseBtn");
const iconPlay = document.getElementById("iconPlay");
const iconPause = document.getElementById("iconPause");
const musicTitle = document.getElementById("musicTitle");

/* ================= HIỆU ỨNG TRÁI TIM ================= */
function createHeartExplosion(x, y) {
  const hearts = ["💖", "🌸", "💕", "🌷"];
  const numHearts = 12;

  for (let i = 0; i < numHearts; i++) {
    const heart = document.createElement("div");

    heart.classList.add("heart");
    heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];

    const angle = ((Math.PI * 2) / numHearts) * i;
    const distance = Math.random() * 80 + 40;

    heart.style.left = x + "px";
    heart.style.top = y + "px";
    heart.style.setProperty("--dx", Math.cos(angle) * distance + "px");
    heart.style.setProperty("--dy", Math.sin(angle) * distance + "px");
    heart.style.fontSize = Math.random() * 10 + 20 + "px";

    document.body.appendChild(heart);

    setTimeout(() => heart.remove(), 2000);
  }
}

/* ================= HIỂN THỊ CÁC BIỂU TƯỢNG ================= */
function renderLettersRow() {
  letters.forEach((item) => {
    const letter = document.createElement("img");

    letter.src = item.icon;
    letter.alt = "Quà";
    letter.classList.add("letter-item");
    letter.draggable = false;

    letter.addEventListener("click", (e) => {
      createHeartExplosion(e.clientX, e.clientY);

      letter.classList.add("letter-clicked");

      setTimeout(() => {
        letter.classList.remove("letter-clicked");
      }, 500);

      setTimeout(() => showPopup(item), 300);
    });

    lettersRow.appendChild(letter);
  });
}

/* ================= HIỂN THỊ LỜI CHÚC ================= */
function showPopup(item) {
  popupImage.src = item.img;
  popupMessage.textContent = item.text;

  popup.style.display = "block";
  overlay.classList.add("active");

  popup.dataset.currentMessage = item.text;
}

function closePopup() {
  popup.style.display = "none";
  overlay.classList.remove("active");

  // Không thay đổi nội dung lời chúc chính giữa.
}

overlay.addEventListener("click", closePopup);

/* ================= ĐIỀU KHIỂN NHẠC ================= */
let currentSong = 0;
let userPaused = false;

/* ---------- TỰ CÂN BẰNG ÂM LƯỢNG ---------- */
let audioCtx = null;
let gainNode = null;
let gains = [];
let graphReady = false;

function applyVolume(i) {
  if (graphReady && gains[i] != null) {
    gainNode.gain.value = gains[i];
    player.volume = 1;
  } else {
    player.volume = playlist[i].volume != null ? playlist[i].volume : 1;
  }
}

async function analyzeLoudness() {
  const Ctx = window.AudioContext || window.webkitAudioContext;

  if (!Ctx) return;

  try {
    const ctx = new Ctx();
    const rmsList = [];

    for (const song of playlist) {
      try {
        const response = await fetch(song.src);

        if (!response.ok) {
          throw new Error("Không tải được file nhạc");
        }

        const audioBuffer = await ctx.decodeAudioData(
          await response.arrayBuffer(),
        );

        let sum = 0;
        let count = 0;

        for (let c = 0; c < audioBuffer.numberOfChannels; c++) {
          const data = audioBuffer.getChannelData(c);

          for (let i = 0; i < data.length; i += 4) {
            sum += data[i] * data[i];
            count++;
          }
        }

        rmsList.push(Math.sqrt(sum / count) || null);
      } catch (error) {
        rmsList.push(null);
      }
    }

    const valid = rmsList.filter(Boolean);

    if (valid.length < 2) {
      await ctx.close();
      return;
    }

    const target = Math.min(...valid);

    gains = rmsList.map((rms) => (rms ? Math.min(1, target / rms) : 1));

    audioCtx = ctx;
    await enableGainGraph();
  } catch (error) {
    // Nếu không đo được âm lượng, sử dụng volume dự phòng.
  }
}

async function enableGainGraph() {
  if (graphReady || !audioCtx || !gains.length) return;

  try {
    await audioCtx.resume();
  } catch (error) {}

  if (audioCtx.state !== "running") return;

  try {
    const source = audioCtx.createMediaElementSource(player);

    gainNode = audioCtx.createGain();

    source.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    graphReady = true;
    applyVolume(currentSong);
  } catch (error) {
    // Tránh tạo kết nối âm thanh nhiều lần.
  }
}

["click", "touchstart", "keydown"].forEach((eventName) => {
  document.addEventListener(eventName, enableGainGraph);
});

/* ---------- TẢI VÀ PHÁT BÀI HÁT ---------- */
function loadSong(index) {
  currentSong = (index + playlist.length) % playlist.length;

  const song = playlist[currentSong];

  player.src = song.src;
  applyVolume(currentSong);

  musicTitle.textContent =
    "♪ " + song.title + " (" + (currentSong + 1) + "/" + playlist.length + ")";
}

function playSong() {
  const promise = player.play();

  if (promise !== undefined) {
    promise.catch(() => {});
  }
}

function nextSong() {
  loadSong(currentSong + 1);

  if (!userPaused) {
    playSong();
  }
}

function prevSong() {
  loadSong(currentSong - 1);

  if (!userPaused) {
    playSong();
  }
}

function togglePlayPause() {
  if (player.paused) {
    userPaused = false;
    playSong();
  } else {
    userPaused = true;
    player.pause();
  }
}

/* ---------- CẬP NHẬT NÚT PHÁT / DỪNG ---------- */
player.addEventListener("play", () => {
  iconPlay.style.display = "none";
  iconPause.style.display = "block";
});

player.addEventListener("pause", () => {
  iconPlay.style.display = "block";
  iconPause.style.display = "none";
});

/* ---------- TỰ CHUYỂN BÀI KHI HẾT NHẠC ---------- */
player.addEventListener("ended", () => {
  loadSong(currentSong + 1);
  playSong();
});

/* ---------- XỬ LÝ KHI FILE NHẠC BỊ LỖI ---------- */
player.addEventListener("error", () => {
  if (playlist.length > 1 && !userPaused) {
    setTimeout(nextSong, 500);
  }
});

/* ---------- GẮN SỰ KIỆN CHO CÁC NÚT ---------- */
prevBtn.addEventListener("click", prevSong);
nextBtn.addEventListener("click", nextSong);
playPauseBtn.addEventListener("click", togglePlayPause);

/* ================= KHỞI CHẠY ================= */
loadSong(0);
playSong();
analyzeLoudness();

/* ---------- HỖ TRỢ MỞ KHÓA ÂM THANH ---------- */
function unlockAudio() {
  if (player.paused && !userPaused) {
    playSong();
  }

  ["click", "touchstart", "keydown"].forEach((eventName) => {
    document.removeEventListener(eventName, unlockAudio);
  });
}

["click", "touchstart", "keydown"].forEach((eventName) => {
  document.addEventListener(eventName, unlockAudio);
});

/* ---------- HIỂN THỊ CÁC BIỂU TƯỢNG LỜI CHÚC ---------- */
renderLettersRow();
