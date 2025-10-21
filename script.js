document.addEventListener("DOMContentLoaded", () => {
  const menuBtn = document.getElementById("menu-btn");
  const navMenu = document.getElementById("nav-menu");
  const pageLoader = document.getElementById("page-loader");
  const loaderFill = pageLoader ? pageLoader.querySelector(".loader-fill") : null;
  const orderBtns = document.querySelectorAll(".order-btn");
  const popup = document.getElementById("order-popup");
  const closePopup = document.getElementById("close-popup");
  const orderForm = document.getElementById("order-form");

  /* === NAV MENU === */
  if (menuBtn && navMenu) {
    menuBtn.addEventListener("click", () => {
      navMenu.classList.toggle("active");
    });

    // Close menu when clicking outside or pressing Esc
    document.addEventListener("click", (e) => {
      if (
        !navMenu.contains(e.target) &&
        !menuBtn.contains(e.target) &&
        navMenu.classList.contains("active")
      ) {
        navMenu.classList.remove("active");
      }
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && navMenu.classList.contains("active")) {
        navMenu.classList.remove("active");
      }
    });
  }

  /* === LOADER === */
  function showLoader() {
    if (!pageLoader || !loaderFill) return;
    pageLoader.classList.remove("hidden", "leaving");
    pageLoader.classList.add("showing");
    loaderFill.style.width = "0%";
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        loaderFill.style.width = "100%";
        loaderFill.setAttribute("aria-valuenow", "100");
      });
    });
  }

  function hideLoader() {
    if (!pageLoader || !loaderFill) return;
    pageLoader.classList.add("leaving");
    pageLoader.classList.remove("showing");
    setTimeout(() => {
      pageLoader.classList.add("hidden");
      loaderFill.style.width = "0%";
      loaderFill.setAttribute("aria-valuenow", "0");
    }, 900);
  }

  if (pageLoader && loaderFill) {
    showLoader();
    setTimeout(hideLoader, 900);
  }

  // Show loader on internal link clicks
  document.addEventListener("click", (e) => {
    const anchor = e.target.closest("a");
    if (!anchor) return;
    const href = anchor.getAttribute("href");
    if (!href) return;
    if (
      href.startsWith("#") ||
      href.startsWith("mailto:") ||
      href.startsWith("tel:")
    )
      return;
    if (href.startsWith("http") && !href.includes(location.hostname)) return;

    e.preventDefault();
    showLoader();
    setTimeout(() => {
      location.href = href;
    }, 850);
  });

  /* === ORDER POPUP === */
  if (popup && closePopup && orderForm) {
    orderBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        popup.style.display = "flex";
        document.body.style.overflow = "hidden"; // prevent scroll
      });
    });

    const closePopupFunc = () => {
      popup.style.display = "none";
      document.body.style.overflow = "";
    };

    closePopup.addEventListener("click", closePopupFunc);

    // Hide when clicking outside popup content
    popup.addEventListener("click", (e) => {
      if (e.target === popup) closePopupFunc();
    });

    // Hide on Esc key
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && popup.style.display === "flex") {
        closePopupFunc();
      }
    });

    orderForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = document.getElementById("order-name").value;
      const address = document.getElementById("order-address").value;
      const sushi = document.getElementById("order-type").value;
      const qty = document.getElementById("order-quantity").value;
      const email = document.getElementById("order-email").value;

      const subject = encodeURIComponent("New Sushi Order");
      const body = encodeURIComponent(
        `Name: ${name}\nAddress: ${address}\nType of Sushi: ${sushi}\nQuantity: ${qty}\nEmail: ${email}`
      );

      window.location.href = `mailto:sushicatch@gmail.com?subject=${subject}&body=${body}`;
      closePopupFunc();
      orderForm.reset();
    });
  }

  /* === PIXEL BUBBLES === */
  function makeBubble() {
    const bubble = document.createElement("div");
    bubble.className = "bubble";
    bubble.style.left = `${Math.random() * 100}vw`;
    bubble.style.width = bubble.style.height = `${Math.random() * 3 + 2}px`;
    bubble.style.animationDuration = `${3 + Math.random() * 4}s`;

    const mainArea =
      document.querySelector(".main-content") || document.body;
    mainArea.appendChild(bubble);
    setTimeout(() => bubble.remove(), 7000);
  }

  setInterval(makeBubble, 400);
});

/* === ENSURE LOADER HIDDEN ON PAGE LOAD === */
window.addEventListener("load", () => {
  const loader = document.getElementById("page-loader");
  if (loader) loader.classList.add("hidden");
});

// Background music autoplay
document.addEventListener('DOMContentLoaded', function() {
    const backgroundMusic = document.getElementById('backgroundMusic');
    const musicToggle = document.getElementById('musicToggle');
    const musicMute = document.getElementById('musicMute');
    
    // Set volume to a reasonable level (0.0 to 1.0)
    backgroundMusic.volume = 0.3;
    
    // Try to autoplay the music
    function playBackgroundMusic() {
        const playPromise = backgroundMusic.play();
        
        if (playPromise !== undefined) {
            playPromise.then(() => {
                // Audio started successfully
                console.log('Background music started');
                hideMusicControls();
            }).catch(error => {
                // Auto-play was prevented - show play button instead
                console.log('Autoplay prevented, waiting for user interaction');
                showMusicControls();
            });
        }
    }
    
    function showMusicControls() {
        const controls = document.querySelector('.music-controls');
        controls.style.display = 'block';
        
        // Add click event to start music
        document.body.addEventListener('click', function startMusicOnClick() {
            backgroundMusic.play();
            hideMusicControls();
            document.body.removeEventListener('click', startMusicOnClick);
        }, { once: true });
    }
    
    function hideMusicControls() {
        const controls = document.querySelector('.music-controls');
    }
    
    // Music control buttons
    musicToggle.addEventListener('click', function() {
        if (backgroundMusic.paused) {
            backgroundMusic.play();
            musicToggle.textContent = '🔊';
        } else {
            backgroundMusic.pause();
            musicToggle.textContent = '▶️';
        }
    });
    
    musicMute.addEventListener('click', function() {
        backgroundMusic.muted = !backgroundMusic.muted;
        musicMute.textContent = backgroundMusic.muted ? '🔊' : '🔇';
    });
    
    // Start the music
    playBackgroundMusic();
    
    // Save music state in localStorage to maintain across pages
    backgroundMusic.addEventListener('play', function() {
        localStorage.setItem('backgroundMusicPlaying', 'true');
    });
    
    backgroundMusic.addEventListener('pause', function() {
        localStorage.setItem('backgroundMusicPlaying', 'false');
    });
    
    // Check previous state when loading new page
    if (localStorage.getItem('backgroundMusicPlaying') === 'true') {
        backgroundMusic.play();
    }
    
    // Handle page visibility changes (when switching tabs)
    document.addEventListener('visibilitychange', function() {
        if (!document.hidden && localStorage.getItem('backgroundMusicPlaying') === 'true') {
            backgroundMusic.play();
        }
    });
});
