/* ============================================================
   SITE ANNIVERSAIRE - SCRIPT PRINCIPAL
   ============================================================ */
(function() {
    'use strict';

    /* ========================================================
       1. CONFIGURATION
       ======================================================== */
    const CONFIG = {
        girlfriendName: "Marinette",
        girlfriendNickname: "Holali", // ⬅️ Le petit nom utilisé dans la chanson
        whatsappNumber: "22871302101",
        personalMessage: "Aujourd'hui c'est ton jour, mais j'avais envie de rendre cette journée encore un peu plus spéciale… ❤️\n\nEt justement… j'ai une petite question pour toi. 👀",
        musicMaxDuration: 55,
        photoBgDuration: 3000,
        autoSendDelay: 10000,

        // 🎵 MESSAGES D'INTRO (0 → 21s)
        introMessages: [
            { text: "Aujourd'hui est un jour très spécial…", start: 0 },
            { text: "Un jour où une personne magnifique est née…", start: 5 },
            { text: "Une personne qui illumine tout autour d'elle…", start: 10 },
            { text: "Une personne qui mérite tout le bonheur du monde…", start: 15 },
            { text: "Alors j'ai une petite chanson pour toi… ❤️", start: 19 }
        ],

        // 🎂 PAROLES (22s → 55s)
        lyrics: [
            { text: "Joyeux anniversaire…", start: 22 },
            { text: "Joyeux anniversaire…", start: 27 },
            { text: "Joyeux anniversaire Holali… ❤️", start: 32 },
            { text: "Joyeux anniversaire…", start: 37 },
            { text: "Que tous tes souhaits se réalisent ! ✨", start: 42 },
            { text: "Bonne fête ma chérie… ❤️", start: 47 }
        ],

        dodgeTexts: [
            "NON 😏", "Tu es sûre ? 😂", "Réessaie 🙈", "Mauvaise réponse 😭",
            "Sérieusement ? 😂", "Allez… dis oui ❤️", "Tu sais que tu vas dire oui 😌",
            "Je te vois essayer 😂", "Encore ? 😭", "Abandonne 😂❤️"
        ],
        dodgeSubTexts: [
            "Oups, le bouton a glissé ! 😜",
            "Aïe, raté ! 🙈",
            "Même pas en rêve 😂",
            "Le bouton OUI est juste là 👀",
            "Tu persistes ? J'adore ta détermination 😂",
            "Il n'y a qu'une seule bonne issue ❤️"
        ],
        calendarEventTitle: "Notre rendez-vous ❤️",
        calendarEventDescription: "Un petit moment spécial préparé pour Marinette ❤️ (Le lieu est une surprise ! 🤫)",
        calendarEventDurationMinutes: 120
    };

    /* ========================================================
       2. ÉTAT GLOBAL
       ======================================================== */
    const state = {
        currentScene: 0,
        selectedDate: null,
        selectedTime: "19:00",
        dodgeCount: 0,
        animationRunning: false,
        autoSendTriggered: false
    };

    /* ========================================================
       3. CANVAS & CONTEXTES
       ======================================================== */
    const canvases = {
        particle: document.getElementById('particle-canvas'),
        confetti: document.getElementById('confetti-canvas'),
        heart: document.getElementById('heart-canvas'),
        spark: document.getElementById('spark-canvas'),
        balloon: document.getElementById('balloon-canvas')
    };
    const contexts = {};
    Object.keys(canvases).forEach(key => { contexts[key] = canvases[key].getContext('2d'); });

    function resizeCanvases() {
        Object.values(canvases).forEach(c => {
            c.width = window.innerWidth;
            c.height = window.innerHeight;
        });
    }
    resizeCanvases();
    window.addEventListener('resize', resizeCanvases);

    /* ========================================================
       4. PARTICULES
       ======================================================== */
    const particles = [];
    const hearts = [];
    const confettis = [];
    const sparks = [];

    function createHeartExplosion(x, y, count = 20) {
        for (let i = 0; i < count; i++) {
            hearts.push({
                x, y,
                vx: (Math.random() - 0.5) * 8,
                vy: (Math.random() - 0.5) * 8,
                size: 10 + Math.random() * 20,
                life: 1,
                decay: 0.01 + Math.random() * 0.02,
                color: ['#FF2A75','#FF8FA3','#FFD700','#FF6B9D'][Math.floor(Math.random() * 4)]
            });
        }
    }

    function createParticleExplosion(x, y, count = 30) {
        for (let i = 0; i < count; i++) {
            particles.push({
                x, y,
                vx: (Math.random() - 0.5) * 10,
                vy: (Math.random() - 0.5) * 10,
                size: 3 + Math.random() * 6,
                life: 1,
                decay: 0.008 + Math.random() * 0.02,
                color: ['#ffffff','#FFD700','#FF2A75','#FFB700','#00FFCC'][Math.floor(Math.random() * 5)]
            });
        }
    }

    function createSparkExplosion(x, y, count = 25) {
        for (let i = 0; i < count; i++) {
            sparks.push({
                x, y,
                vx: (Math.random() - 0.5) * 15,
                vy: (Math.random() - 0.5) * 15,
                size: 2 + Math.random() * 4,
                life: 1,
                decay: 0.02 + Math.random() * 0.03,
                color: ['#FFD700','#ffffff','#FFB700','#FF2A75'][Math.floor(Math.random() * 4)]
            });
        }
    }

    function createConfettiBurst(x, y, count = 40) {
        for (let i = 0; i < count; i++) {
            confettis.push({
                x, y,
                vx: (Math.random() - 0.5) * 12,
                vy: (Math.random() - 0.5) * 12 - 3,
                size: 6 + Math.random() * 8,
                life: 1,
                decay: 0.005 + Math.random() * 0.01,
                color: ['#FF2A75','#FFB700','#00FFCC','#FF8FA3','#FFD700','#A29BFE'][Math.floor(Math.random() * 6)],
                rotation: Math.random() * 360,
                rotationSpeed: (Math.random() - 0.5) * 10
            });
        }
    }

    function createFirework(x, y) {
        for (let i = 0; i < 50; i++) {
            const angle = (Math.PI * 2 * i) / 50;
            const speed = 5 + Math.random() * 6;
            particles.push({
                x, y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                size: 3 + Math.random() * 5,
                life: 1,
                decay: 0.01 + Math.random() * 0.02,
                color: ['#FF2A75','#FFD700','#FFB700','#00FFCC','#ffffff','#FF8FA3'][Math.floor(Math.random() * 6)]
            });
        }
        createSparkExplosion(x, y, 30);
    }

    function createBalloonBurst(x, y) {
        for (let i = 0; i < 15; i++) {
            const balloon = document.createElement('div');
            balloon.className = 'balloon-dom';
            balloon.textContent = '🎈';
            balloon.style.left = `${x + (Math.random() - 0.5) * 200}px`;
            balloon.style.top = `${y}px`;
            balloon.style.fontSize = `${30 + Math.random() * 30}px`;
            balloon.style.animationDuration = `${5 + Math.random() * 7}s`;
            document.body.appendChild(balloon);
            setTimeout(() => balloon.remove(), 12000);
        }
    }

    /* ========================================================
       5. RENDU DES CANVAS
       ======================================================== */
    function renderAll() {
        Object.values(contexts).forEach(ctx => ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height));

        particles.forEach((p, i) => {
            p.x += p.vx; p.y += p.vy; p.vy += 0.1; p.life -= p.decay;
            if (p.life <= 0) { particles.splice(i, 1); return; }
            contexts.particle.globalAlpha = p.life;
            contexts.particle.fillStyle = p.color;
            contexts.particle.beginPath();
            contexts.particle.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            contexts.particle.fill();
            contexts.particle.globalAlpha = 1;
        });

        hearts.forEach((h, i) => {
            h.x += h.vx; h.y += h.vy; h.vy -= 0.05; h.life -= h.decay;
            if (h.life <= 0) { hearts.splice(i, 1); return; }
            contexts.heart.globalAlpha = h.life;
            contexts.heart.fillStyle = h.color;
            contexts.heart.font = `${h.size}px serif`;
            contexts.heart.fillText('❤️', h.x - h.size / 2, h.y + h.size / 2);
            contexts.heart.globalAlpha = 1;
        });

        confettis.forEach((c, i) => {
            c.x += c.vx; c.y += c.vy; c.vy += 0.15; c.rotation += c.rotationSpeed; c.life -= c.decay;
            if (c.life <= 0) { confettis.splice(i, 1); return; }
            contexts.confetti.globalAlpha = c.life;
            contexts.confetti.fillStyle = c.color;
            contexts.confetti.save();
            contexts.confetti.translate(c.x, c.y);
            contexts.confetti.rotate(c.rotation * Math.PI / 180);
            contexts.confetti.fillRect(-c.size / 2, -c.size / 4, c.size, c.size / 2);
            contexts.confetti.restore();
            contexts.confetti.globalAlpha = 1;
        });

        sparks.forEach((s, i) => {
            s.x += s.vx; s.y += s.vy; s.vy += 0.05; s.life -= s.decay;
            if (s.life <= 0) { sparks.splice(i, 1); return; }
            contexts.spark.globalAlpha = s.life;
            contexts.spark.fillStyle = s.color;
            contexts.spark.beginPath();
            contexts.spark.arc(s.x, s.y, s.size, 0, Math.PI * 2);
            contexts.spark.fill();
            contexts.spark.globalAlpha = 1;
        });

        requestAnimationFrame(renderAll);
    }
    renderAll();

    /* ========================================================
       6. DÉCORS AMBIANTS
       ======================================================== */
    const floatHeartStyle = document.createElement('style');
    floatHeartStyle.textContent = `@keyframes floatHeart { 0% { transform: translateY(110vh) rotate(0deg) scale(0.5); opacity: 0; } 10% { opacity: 1; } 90% { opacity: 1; } 100% { transform: translateY(-10vh) rotate(360deg) scale(1.2); opacity: 0; } }`;
    document.head.appendChild(floatHeartStyle);

    function createFloatingHearts() {
        setInterval(() => {
            if (Math.random() > 0.3) return;
            const heart = document.createElement('div');
            heart.textContent = ['❤️','💖','💕','💗','💓'][Math.floor(Math.random() * 5)];
            heart.style.position = 'fixed';
            heart.style.left = `${Math.random() * 100}%`;
            heart.style.top = '110vh';
            heart.style.fontSize = `${15 + Math.random() * 25}px`;
            heart.style.pointerEvents = 'none';
            heart.style.zIndex = '5';
            heart.style.animation = `floatHeart ${8 + Math.random() * 12}s linear forwards`;
            document.body.appendChild(heart);
            setTimeout(() => heart.remove(), 20000);
        }, 1500);
    }

    function createShootingStars() {
        setInterval(() => {
            if (Math.random() > 0.2) return;
            const star = document.createElement('div');
            star.className = 'shooting-star';
            star.style.left = `${Math.random() * 100}%`;
            star.style.top = `${Math.random() * 40}%`;
            document.body.appendChild(star);
            setTimeout(() => star.remove(), 2000);
        }, 4000);
    }

    /* ========================================================
       7. CURSEUR & INTERACTIONS
       ======================================================== */
    const cursorGlow = document.getElementById('cursor-glow');
    let mouseX = -100, mouseY = -100;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX; mouseY = e.clientY;
        cursorGlow.style.left = `${mouseX}px`;
        cursorGlow.style.top = `${mouseY}px`;
        document.querySelectorAll('.scene.active .content-box').forEach(el => {
            const rect = el.getBoundingClientRect();
            const cx = rect.left + rect.width / 2;
            const cy = rect.top + rect.height / 2;
            const dx = (mouseX - cx) / 40;
            const dy = (mouseY - cy) / 40;
            el.style.transform = `translate(${dx}px, ${dy}px)`;
        });
    });

    document.addEventListener('click', (e) => {
        createSparkExplosion(e.clientX, e.clientY, 12);
        createParticleExplosion(e.clientX, e.clientY, 8);
        cursorGlow.style.width = '120px';
        cursorGlow.style.height = '120px';
        setTimeout(() => {
            cursorGlow.style.width = '80px';
            cursorGlow.style.height = '80px';
        }, 300);
    });

    document.addEventListener('touchmove', (e) => {
        if (e.touches.length > 0) {
            mouseX = e.touches[0].clientX;
            mouseY = e.touches[0].clientY;
        }
    });

    document.addEventListener('touchstart', (e) => {
        if (e.touches.length > 0) {
            createSparkExplosion(e.touches[0].clientX, e.touches[0].clientY, 8);
        }
    });

    /* ========================================================
       8. ARRIÈRE-PLAN PHOTO (flouté)
       ======================================================== */
    let photoBgInterval = null;
    let photoBgIndex = 0;
    let photoBgToggle = false;

    function startPhotoBackground(startIndex) {
        const bg = document.getElementById('photo-bg');
        const imgA = document.getElementById('photo-bg-a');
        const imgB = document.getElementById('photo-bg-b');

        if (!bg || !imgA || !imgB) return;

        const allPhotos = Array.from(document.querySelectorAll('.photo-card img')).map(img => img.src);
        if (allPhotos.length === 0) return;

        bg.classList.add('active');

        photoBgIndex = (startIndex + 1) % allPhotos.length;
        photoBgToggle = false;

        imgA.src = allPhotos[photoBgIndex];
        imgA.classList.add('visible');
        imgB.classList.remove('visible');

        if (photoBgInterval) clearInterval(photoBgInterval);

        photoBgInterval = setInterval(() => {
            photoBgIndex = (photoBgIndex + 1) % allPhotos.length;

            if (photoBgToggle) {
                imgA.src = allPhotos[photoBgIndex];
                imgA.classList.add('visible');
                imgB.classList.remove('visible');
            } else {
                imgB.src = allPhotos[photoBgIndex];
                imgB.classList.add('visible');
                imgA.classList.remove('visible');
            }
            photoBgToggle = !photoBgToggle;
        }, CONFIG.photoBgDuration);
    }

    function stopPhotoBackground() {
        if (photoBgInterval) {
            clearInterval(photoBgInterval);
            photoBgInterval = null;
        }
        const bg = document.getElementById('photo-bg');
        if (bg) bg.classList.remove('active');
    }

    /* ========================================================
       9. NAVIGATION ENTRE SCÈNES
       ======================================================== */
    function goToScene(sceneIndex, transition = 'fade-blur') {
        if (state.animationRunning) return;
        state.animationRunning = true;

        const currentEl = document.getElementById(`scene-${state.currentScene}`);
        const nextEl = document.getElementById(`scene-${sceneIndex}`);

        if (currentEl) {
            currentEl.classList.remove('active');
            currentEl.classList.add(transition);
        }

        createParticleExplosion(window.innerWidth / 2, window.innerHeight / 2, 15);
        createSparkExplosion(window.innerWidth / 2, window.innerHeight / 2, 10);

        setTimeout(() => {
            if (currentEl) {
                currentEl.classList.remove('slide-left','slide-right','zoom-out','zoom-in','fade-blur','rotate-in','explode-out');
            }
            state.currentScene = sceneIndex;
            if (nextEl) {
                nextEl.classList.add('active');
                onSceneInit(sceneIndex);
            }
            state.animationRunning = false;
        }, 600);
    }

    function onSceneInit(sceneIndex) {
        switch (sceneIndex) {
            case 1: runCountdown(); break;
            case 2: startKaraokeScene(); break;
            case 3: startPhotoAlbumScene(); break;
            case 4: startTypewriterMessage(); break;
            case 5: initDodgingButton(); break;
            case 7: initCalendar(); break;
            case 8: renderSummary(); break;
            case 9:
                triggerFinalCelebration();
                // ⏱️ Envoi auto (image + WhatsApp) après 10s
                if (!state.autoSendTriggered) {
                    state.autoSendTriggered = true;
                    setTimeout(() => {
                        sendWhatsAppConfirmation();
                    }, CONFIG.autoSendDelay);
                }
                break;
        }
    }

    /* ========================================================
       10. SCÈNE 0 → 1
       ======================================================== */
    document.getElementById('btn-start').addEventListener('click', () => {
        const a1 = document.getElementById('audio-bday');
        a1.play().then(() => a1.pause()).catch(() => {});
        createHeartExplosion(window.innerWidth / 2, window.innerHeight / 2, 40);
        createConfettiBurst(window.innerWidth / 2, window.innerHeight / 2, 30);
        goToScene(1, 'zoom-in');
    });

    /* ========================================================
       11. SCÈNE 1 : COMPTE À REBOURS
       ======================================================== */
    function runCountdown() {
        const display = document.getElementById('countdown-display');
        const textContainer = document.getElementById('bday-text-container');
        let count = 3;

        display.classList.remove('hidden');
        textContainer.classList.add('hidden');

        const timer = setInterval(() => {
            count--;
            if (count > 0) {
                display.textContent = count;
                display.style.animation = 'none';
                void display.offsetWidth;
                display.style.animation = 'popNum 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
                createParticleExplosion(window.innerWidth / 2, window.innerHeight / 2, 5);
            } else if (count === 0) {
                display.textContent = "✨";
            } else {
                clearInterval(timer);
                display.classList.add('hidden');
                textContainer.classList.remove('hidden');
                if (typeof confetti === 'function') confetti({ particleCount: 150, spread: 100, origin: { y: 0.6 } });
                createHeartExplosion(window.innerWidth / 2, window.innerHeight / 2, 80);
                createFirework(window.innerWidth / 2, window.innerHeight / 3);
                setTimeout(() => goToScene(2, 'slide-left'), 4000);
            }
        }, 1200);
    }

    /* ========================================================
       12. SCÈNE 2 : KARAOKÉ (55s max, avec intro 0→21s)
       ======================================================== */
    function startKaraokeScene() {
        const audio = document.getElementById('audio-bday');
        const prevEl = document.getElementById('lyric-prev');
        const currEl = document.getElementById('lyric-current');
        const nextEl = document.getElementById('lyric-next');

        audio.currentTime = 0;
        audio.loop = true; // 🔁 Boucle si l'audio est trop court
        audio.play().catch(e => console.log("Audio autoplay prevented", e));

        const startTime = Date.now();
        let hasStopped = false;

        // Fusionne intro + paroles pour un seul tableau
        const allLines = [...CONFIG.introMessages, ...CONFIG.lyrics];

        const updateLyrics = () => {
            const elapsed = (Date.now() - startTime) / 1000;

            // 🛑 Arrêt à 55 secondes
            if (elapsed >= CONFIG.musicMaxDuration && !hasStopped) {
                hasStopped = true;
                audio.pause();
                audio.loop = false;
                setTimeout(() => goToScene(3, 'rotate-in'), 1000);
                return;
            }

            // Trouve la ligne actuelle
            let currentIndex = -1;
            for (let i = 0; i < allLines.length; i++) {
                if (elapsed >= allLines[i].start) currentIndex = i;
            }

            if (currentIndex !== -1) {
                prevEl.textContent = currentIndex > 0 ? allLines[currentIndex - 1].text : "";
                currEl.textContent = allLines[currentIndex].text;
                nextEl.textContent = currentIndex < allLines.length - 1 ? allLines[currentIndex + 1].text : "";
            }

            if (!hasStopped && state.currentScene === 2) {
                requestAnimationFrame(updateLyrics);
            }
        };

        updateLyrics();
    }

    /* ========================================================
       13. SCÈNE 3 : GALERIE PHOTOS
       ======================================================== */
    function startPhotoAlbumScene() {
        const audioNaza = document.getElementById('audio-naza');
        const audioBday = document.getElementById('audio-bday');
        audioBday.pause();
        audioNaza.currentTime = 0;
        audioNaza.play().catch(e => console.log("Audio play error", e));

        const photos = document.querySelectorAll('.photo-card');
        let currentPhoto = 0;

        const cyclePhotos = setInterval(() => {
            if (state.currentScene !== 3) { clearInterval(cyclePhotos); return; }
            photos[currentPhoto].classList.remove('active');
            currentPhoto = (currentPhoto + 1) % photos.length;
            photos[currentPhoto].classList.add('active');
        }, 3500);

        document.getElementById('btn-to-message').onclick = () => {
            clearInterval(cyclePhotos);
            startPhotoBackground(currentPhoto);
            goToScene(4, 'slide-right');
        };
    }

    /* ========================================================
       14. SCÈNE 4 : MESSAGE TYPEWRITER
       ======================================================== */
    function startTypewriterMessage() {
        const container = document.getElementById('typewriter-text');
        const btn = document.getElementById('btn-to-question');
        container.textContent = "";
        btn.classList.add('hidden');

        const message = CONFIG.personalMessage;
        let i = 0;

        function type() {
            if (i < message.length) {
                container.textContent += message.charAt(i);
                i++;
                setTimeout(type, 40);
            } else {
                btn.classList.remove('hidden');
            }
        }
        type();

        btn.onclick = () => {
            createHeartExplosion(window.innerWidth / 2, window.innerHeight / 2, 30);
            goToScene(5, 'zoom-out');
        };
    }
    /* ========================================================
       15. SCÈNE 5 : BOUTON NON QUI ESQUIVE
       ======================================================== */
    function initDodgingButton() {
        const btnNo = document.getElementById('btn-no');
        const btnYes = document.getElementById('btn-yes');
        const hint = document.getElementById('dodging-hint');

        const dodge = (e) => {
            if (e) e.preventDefault();
            state.dodgeCount++;

            const yesRect = btnYes.getBoundingClientRect();
            const btnWidth = btnNo.offsetWidth || 100;
            const btnHeight = btnNo.offsetHeight || 50;

            // 🌍 Toute la fenêtre
            const maxX = Math.max(window.innerWidth - btnWidth - 20, 20);
            const maxY = Math.max(window.innerHeight - btnHeight - 20, 20);

            let newX, newY, safe = false, attempts = 0;
            while (!safe && attempts < 60) {
                attempts++;
                newX = Math.random() * maxX + 10;
                newY = Math.random() * maxY + 10;
                const dist = Math.hypot(
                    newX - (yesRect.left + yesRect.width / 2),
                    newY - (yesRect.top + yesRect.height / 2)
                );
                if (dist > 150) safe = true;
            }

            btnNo.style.position = 'fixed';
            btnNo.style.left = `${newX}px`;
            btnNo.style.top = `${newY}px`;
            btnNo.style.transform = `scale(${Math.max(0.6, 1 - state.dodgeCount * 0.03)}) rotate(${(Math.random() - 0.5) * 20}deg)`;

            const textIdx = state.dodgeCount % CONFIG.dodgeTexts.length;
            btnNo.textContent = CONFIG.dodgeTexts[textIdx];
            const subIdx = state.dodgeCount % CONFIG.dodgeSubTexts.length;
            hint.textContent = CONFIG.dodgeSubTexts[subIdx];

            createSparkExplosion(newX + btnWidth / 2, newY + btnHeight / 2, 8);
        };

        btnNo.addEventListener('touchstart', dodge, { passive: false });
        btnNo.addEventListener('mouseover', dodge);

        btnYes.onclick = () => {
            if (state.animationRunning) return;
            state.animationRunning = true;

            const cx = window.innerWidth / 2;
            const cy = window.innerHeight / 2;

            createHeartExplosion(cx, cy, 120);
            createParticleExplosion(cx, cy, 90);
            createConfettiBurst(cx, cy, 70);
            createSparkExplosion(cx, cy, 60);
            createFirework(cx, cy - 100);

            setTimeout(() => createHeartExplosion(cx - 200, cy, 60), 500);
            setTimeout(() => createHeartExplosion(cx + 200, cy, 60), 800);
            setTimeout(() => createFirework(cx - 150, cy - 50), 1000);
            setTimeout(() => createFirework(cx + 150, cy - 50), 1500);
            setTimeout(() => createConfettiBurst(cx, cy - 50, 60), 2000);
            setTimeout(() => createBalloonBurst(cx, cy), 800);
            setTimeout(() => createBalloonBurst(cx - 100, cy + 50), 1300);

            if (typeof confetti === 'function') {
                confetti({ particleCount: 200, spread: 120, origin: { y: 0.5 } });
            }

            document.body.style.background = '#ffffff';
            setTimeout(() => document.body.style.background = '', 100);
            setTimeout(() => document.body.style.background = '#FF2A75', 200);
            setTimeout(() => document.body.style.background = '', 300);

            setTimeout(() => {
                stopPhotoBackground();
                state.animationRunning = false;
                goToScene(6, 'explode-out');
            }, 3000);
        };
    }
    /* ========================================================
       16. SCÈNE 6 → 7
       ======================================================== */
    document.getElementById('btn-to-calendar').onclick = () => goToScene(7, 'fade-blur');

    /* ========================================================
       17. SCÈNE 7 : CALENDRIER
       ======================================================== */
    function initCalendar() {
        const daysContainer = document.getElementById('calendar-days');
        const monthYearEl = document.getElementById('cal-month-year');
        const stepDate = document.getElementById('step-date');
        const stepTime = document.getElementById('step-time');

        let displayMonth = new Date().getMonth();
        let displayYear = new Date().getFullYear();

        function renderCalendar() {
            daysContainer.innerHTML = "";
            const months = ["Janvier","Février","Mars","Avril","Mai","Juin","Juillet","Août","Septembre","Octobre","Novembre","Décembre"];
            monthYearEl.textContent = `${months[displayMonth]} ${displayYear}`;

            const firstDay = new Date(displayYear, displayMonth, 1).getDay();
            const daysInMonth = new Date(displayYear, displayMonth + 1, 0).getDate();
            const startingDay = firstDay === 0 ? 6 : firstDay - 1;

            for (let i = 0; i < startingDay; i++) {
                const empty = document.createElement('div');
                daysContainer.appendChild(empty);
            }

            const today = new Date();
            today.setHours(0, 0, 0, 0);

            for (let day = 1; day <= daysInMonth; day++) {
                const dayEl = document.createElement('div');
                dayEl.classList.add('cal-day');
                dayEl.textContent = day;
                dayEl.style.animationDelay = `${day * 0.01}s`;

                const thisDate = new Date(displayYear, displayMonth, day);
                if (thisDate < today) {
                    dayEl.classList.add('disabled');
                } else {
                    dayEl.onclick = () => {
                        document.querySelectorAll('.cal-day').forEach(d => d.classList.remove('selected'));
                        dayEl.classList.add('selected');
                        state.selectedDate = thisDate;

                        const rect = dayEl.getBoundingClientRect();
                        createHeartExplosion(rect.left + rect.width / 2, rect.top + rect.height / 2, 15);

                        setTimeout(() => {
                            stepDate.classList.add('hidden');
                            stepTime.classList.remove('hidden');
                            initTimePicker();
                        }, 400);
                    };
                }
                daysContainer.appendChild(dayEl);
            }
        }

        document.getElementById('cal-prev').onclick = () => {
            displayMonth--;
            if (displayMonth < 0) { displayMonth = 11; displayYear--; }
            renderCalendar();
        };
        document.getElementById('cal-next').onclick = () => {
            displayMonth++;
            if (displayMonth > 11) { displayMonth = 0; displayYear++; }
            renderCalendar();
        };

        renderCalendar();
    }

    function initTimePicker() {
        const hoursSelect = document.getElementById('time-hours');
        hoursSelect.innerHTML = "";
        for (let h = 10; h <= 23; h++) {
            const opt = document.createElement('option');
            opt.value = h < 10 ? `0${h}` : `${h}`;
            opt.textContent = opt.value;
            if (h === 19) opt.selected = true;
            hoursSelect.appendChild(opt);
        }

        document.getElementById('btn-confirm-datetime').onclick = () => {
            const h = hoursSelect.value;
            const m = document.getElementById('time-minutes').value;
            state.selectedTime = `${h}:${m}`;
            createHeartExplosion(window.innerWidth / 2, window.innerHeight / 2, 40);
            goToScene(8, 'zoom-in');
        };
    }

    /* ========================================================
       18. SCÈNE 8 : RÉCAP
       ======================================================== */
    function renderSummary() {
        if (!state.selectedDate) return;

        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        const dateStr = state.selectedDate.toLocaleDateString('fr-FR', options);

        document.getElementById('summary-date').textContent = dateStr;
        document.getElementById('summary-time').textContent = state.selectedTime;

        // Le bouton "Suivant" va juste à la scène 9
        document.getElementById('btn-send-whatsapp').onclick = () => {
            createHeartExplosion(window.innerWidth / 2, window.innerHeight / 2, 60);
            createConfettiBurst(window.innerWidth / 2, window.innerHeight / 2, 50);
            goToScene(9, 'explode-out');
        };
    }

    /* ========================================================
       19. ENVOI WHATSAPP + TÉLÉCHARGEMENT (auto après 10s)
       ======================================================== */
    function sendWhatsAppConfirmation() {
        if (!state.selectedDate) return;

        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        const dateStr = state.selectedDate.toLocaleDateString('fr-FR', options);
        const timeStr = state.selectedTime;

        // ===== IMAGE DE CONFIRMATION =====
        const canvas = document.createElement('canvas');
        canvas.width = 600;
        canvas.height = 400;
        const ctx = canvas.getContext('2d');

        const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        gradient.addColorStop(0, '#FF2A75');
        gradient.addColorStop(1, '#8A2BE2');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.font = '120px serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('❤️', canvas.width / 2, canvas.height / 3);

        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 80px sans-serif';
        ctx.fillText('OUI !', canvas.width / 2, canvas.height / 2 + 30);

        ctx.fillStyle = '#FFD700';
        ctx.font = 'bold 32px sans-serif';
        ctx.fillText(`📅 ${dateStr}`, canvas.width / 2, canvas.height / 2 + 120);
        ctx.fillText(`🕐 ${timeStr}`, canvas.width / 2, canvas.height / 2 + 170);

        ctx.font = '30px serif';
        ctx.fillStyle = '#FF8FA3';
        ctx.fillText('❤️', 60, 60);
        ctx.fillText('❤️', canvas.width - 60, 60);
        ctx.fillText('❤️', 60, canvas.height - 60);
        ctx.fillText('❤️', canvas.width - 60, canvas.height - 60);

        // 1️⃣ Téléchargement auto de l'image
        const link = document.createElement('a');
        link.download = 'confirmation-oui.png';
        link.href = canvas.toDataURL('image/png');
        link.click();

        // 2️⃣ Ouverture WhatsApp auto (500ms après pour laisser le temps au download)
        setTimeout(() => {
            const message = `Oui, avec plaisir ❤️\n\nOn se retrouve le ${dateStr} à ${timeStr}\n\nÀ très bientôt 🤭💕`;
            const whatsappUrl = `https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent(message)}`;
            window.open(whatsappUrl, '_blank');
        }, 500);

        // 3️⃣ Ajout agenda (ICS)
        const start = new Date(
            state.selectedDate.getFullYear(),
            state.selectedDate.getMonth(),
            state.selectedDate.getDate(),
            parseInt(timeStr.split(':')[0]),
            parseInt(timeStr.split(':')[1])
        );
        const end = new Date(start.getTime() + CONFIG.calendarEventDurationMinutes * 60000);
        const formatDate = (d) => d.toISOString().replace(/-|:|\.\d+/g, '');

        const icsContent = [
            'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Birthday App//FR', 'CALSCALE:GREGORIAN',
            'BEGIN:VEVENT',
            `SUMMARY:${CONFIG.calendarEventTitle}`,
            `DESCRIPTION:${CONFIG.calendarEventDescription}`,
            `DTSTART:${formatDate(start)}`, `DTEND:${formatDate(end)}`,
            'BEGIN:VALARM', 'TRIGGER:-PT24H', 'ACTION:DISPLAY', 'DESCRIPTION:Rappel rendez-vous demain ! ❤️', 'END:VALARM',
            'BEGIN:VALARM', 'TRIGGER:-PT2H', 'ACTION:DISPLAY', 'DESCRIPTION:Rappel rendez-vous dans 2 heures ! ❤️', 'END:VALARM',
            'END:VEVENT', 'END:VCALENDAR'
        ].join('\r\n');

        const icsBlob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
        const icsUrl = window.URL.createObjectURL(icsBlob);
        setTimeout(() => window.open(icsUrl, '_blank'), 1000);

        // Effets visuels au moment de l'envoi
        createHeartExplosion(window.innerWidth / 2, window.innerHeight / 2, 100);
        createConfettiBurst(window.innerWidth / 2, window.innerHeight / 2, 80);
        createFirework(window.innerWidth / 2, window.innerHeight / 3);
        if (typeof confetti === 'function') confetti({ particleCount: 200, spread: 120, origin: { y: 0.5 } });
    }

    /* ========================================================
       20. SCÈNE 9 : CÉLÉBRATION FINALE
       ======================================================== */
    function triggerFinalCelebration() {
        const cx = window.innerWidth / 2;
        const cy = window.innerHeight / 2;

        for (let i = 0; i < 10; i++) {
            setTimeout(() => createFirework(cx + (Math.random() - 0.5) * 400, cy - Math.random() * 200), i * 300);
        }
        for (let i = 0; i < 5; i++) {
            setTimeout(() => createHeartExplosion(cx + (Math.random() - 0.5) * 300, cy + (Math.random() - 0.5) * 300, 40), i * 500);
        }
        for (let i = 0; i < 5; i++) {
            setTimeout(() => createConfettiBurst(cx + (Math.random() - 0.5) * 400, cy + (Math.random() - 0.5) * 300, 50), i * 400);
        }

        setTimeout(() => createBalloonBurst(cx, cy), 500);
        setTimeout(() => createBalloonBurst(cx - 200, cy + 100), 1000);
        setTimeout(() => createBalloonBurst(cx + 200, cy - 100), 1500);

        if (typeof confetti === 'function') {
            confetti({ particleCount: 300, spread: 160, origin: { y: 0.5 } });
            setTimeout(() => confetti({ particleCount: 200, spread: 120, origin: { y: 0.4 } }), 500);
        }

        document.body.style.background = '#FF2A75';
        setTimeout(() => document.body.style.background = '', 200);
        setTimeout(() => document.body.style.background = '#FFD700', 400);
        setTimeout(() => document.body.style.background = '', 600);
    }

    /* ========================================================
       21. UTILITAIRE CONFETTI
       ======================================================== */
    function triggerConfetti() {
        if (typeof confetti === 'function') {
            confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
        }
    }

    /* ========================================================
       22. INITIALISATION
       ======================================================== */
    window.addEventListener('DOMContentLoaded', () => {
        createFloatingHearts();
        createShootingStars();

        setInterval(() => {
            if (Math.random() > 0.5) {
                const x = Math.random() * window.innerWidth;
                const y = Math.random() * window.innerHeight;
                createParticleExplosion(x, y, 3);
            }
        }, 3000);
    });

    console.log('🎂✨ Site Anniversaire Interactif Chargé avec Succès ! ✨🎂');
    console.log('💖 Toutes les animations sont prêtes pour Marinette (Holali) !');
    console.log('🎉 25+ types d\'animations intégrés !');
    console.log('📲 Envoi WhatsApp configuré vers +' + CONFIG.whatsappNumber);
    console.log('⏱️ Envoi auto (image + WhatsApp) dans ' + (CONFIG.autoSendDelay / 1000) + 's après la scène finale');

})();
