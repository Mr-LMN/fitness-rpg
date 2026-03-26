const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const ui = {
  score: document.getElementById('scoreDisplay'), stage: document.getElementById('stageDisplay'),
  text: document.getElementById('tutorialText'), lives: document.getElementById('livesCount'),
  multiplier: document.getElementById('multiplierCount'), coins: document.getElementById('coinCount'),
  overlay: document.getElementById('screenOverlay'), title: document.getElementById('screenTitle'),
  subtitle: document.getElementById('screenSubtitle'), btn: document.getElementById('actionBtn'),
  runCoins: document.getElementById('runCoinsDisplay')
};

let currentLevelIdx = 0; let levelData;
let score = 0; let stageHits = 0; let rawCoins = 0; let runCoinsTracker = 0;
let angle = 0; let direction = 1; let isPlaying = false;
let lives = 3; let multiplier = 1; let distanceTraveled = 0;

let isBossPhaseTwo = false; 

let targets = []; let particles = []; let popups = []; let trail = [];
const size = Math.min(window.innerWidth, window.innerHeight) * 0.8;
canvas.width = size; canvas.height = size;
const center = size / 2; const orbitRadius = size * 0.35;

const multiColors = ['#ffffff', '#00e5ff', '#00ff88', '#ffea00', '#ffaa00', '#ff3366', '#b300ff', '#ff00ff'];

function createParticles(x, y, color, count=20) {
  for (let i=0; i<count; i++) particles.push({ x:x, y:y, vx:(Math.random()-0.5)*12, vy:(Math.random()-0.5)*12, life:1.0, color:color });
}

function createPopup(x, y, text, color) { popups.push({ x: x, y: y, text: text, color: color, life: 1.0 }); }

function triggerScreenShake(intensity = 5) {
  canvas.style.transform = `translate(${Math.random()*intensity-intensity/2}px, ${Math.random()*intensity-intensity/2}px)`;
  setTimeout(() => canvas.style.transform = `translate(${Math.random()*intensity-intensity/2}px, ${Math.random()*intensity-intensity/2}px)`, 50);
  setTimeout(() => canvas.style.transform = `translate(0px, 0px)`, 100);
}

function getCheckpointIndex() {
  let currentWorld = levelData.id.split('-')[0];
  for(let i=0; i<campaign.length; i++) {
    if(campaign[i].id.startsWith(currentWorld + "-")) return i;
  }
  return 0;
}

function loadLevel(idx) {
  levelData = campaign[idx] || campaign[campaign.length-1];
  stageHits = 0; lives = levelData.lives; multiplier = 1; distanceTraveled = 0; trail = [];
  isBossPhaseTwo = false;
  
  ui.stage.innerText = `Stage ${levelData.id}`; ui.text.innerText = levelData.text;
  ui.lives.innerText = lives; ui.multiplier.innerText = multiplier;
  
  spawnTargets();
}

function spawnTargets() {
  targets = [];
  
  if (levelData.boss === 'aegis') {
    if (!isBossPhaseTwo) {
      ui.text.innerText = "BOSS: Break the shields!"; ui.text.style.color = "#00e5ff";
      let offset = Math.random() * Math.PI * 2;
      for(let i=0; i<3; i++) {
        targets.push({ start: offset + (i * (Math.PI * 2 / 3)), size: Math.PI / 4, color: '#00e5ff', active: true, hp: 3, maxHp: 3 });
      }
    } else {
      ui.text.innerText = "CORE EXPOSED! Need PERFECT hit!"; ui.text.style.color = "#ff3366";
      targets.push({ start: Math.random() * Math.PI * 2, size: Math.PI / 10, color: '#ffffff', active: true, hp: 1, maxHp: 1 });
    }
    return;
  }

  let tCount = levelData.targets === 'boss' || levelData.targets === 'random' ? Math.floor(Math.random()*3)+1 : levelData.targets;
  let sizeModifier = tCount > 1 ? 0.6 : 1.0; 
  let baseSize = Math.max(Math.PI / 8, (Math.PI / 3) - (currentLevelIdx * 0.02)) * sizeModifier;
  let offset = Math.random() * Math.PI * 2;

  for(let i=0; i<tCount; i++) {
    targets.push({ start: offset + (i * (Math.PI * 2 / tCount)), size: baseSize, color: tCount > 1 ? '#ff3366' : '#00ff88', active: true, hp: 1 });
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  ctx.beginPath(); ctx.arc(center, center, orbitRadius * 0.15, 0, Math.PI * 2); 
  ctx.fillStyle = (levelData.boss && isBossPhaseTwo) ? '#ffffff' : '#222'; 
  ctx.fill();

  ctx.beginPath(); ctx.arc(center, center, orbitRadius, 0, Math.PI * 2); ctx.strokeStyle = '#1a1a24'; ctx.lineWidth = 15; ctx.stroke();

  targets.forEach(t => {
    if(t.active) {
      let tCenter = t.start + (t.size/2);
      
      if (levelData.boss && !isBossPhaseTwo) {
        ctx.beginPath(); ctx.arc(center, center, orbitRadius, t.start, t.start + t.size);
        ctx.strokeStyle = t.color; ctx.globalAlpha = 0.9; ctx.lineWidth = 20; 
        ctx.lineCap = 'butt'; ctx.stroke();
      } else {
        ctx.beginPath(); ctx.arc(center, center, orbitRadius, t.start, t.start + t.size);
        ctx.strokeStyle = t.color; ctx.globalAlpha = 0.3; ctx.lineWidth = 15; ctx.lineCap = 'round'; ctx.stroke();
        
        ctx.beginPath(); ctx.arc(center, center, orbitRadius, tCenter - t.size/4, tCenter + t.size/4);
        ctx.strokeStyle = t.color; ctx.globalAlpha = 0.8; ctx.stroke();

        if(currentLevelIdx >= 2 || levelData.boss) {
           ctx.beginPath(); ctx.arc(center, center, orbitRadius, tCenter - t.size/12, tCenter + t.size/12);
           ctx.strokeStyle = '#ffffff'; ctx.globalAlpha = 1.0; ctx.stroke();
        }
      }
      ctx.globalAlpha = 1.0;
    }
  });

  let orbColor = multiColors[Math.min(multiplier - 1, 7)];

  trail.forEach((p, index) => {
    let opacity = (index / trail.length) * 0.6;
    ctx.beginPath(); ctx.arc(p.x, p.y, 8 * (index/trail.length), 0, Math.PI * 2);
    ctx.fillStyle = orbColor; ctx.globalAlpha = opacity; ctx.fill();
  });
  ctx.globalAlpha = 1.0;

  const x = center + Math.cos(angle) * orbitRadius; const y = center + Math.sin(angle) * orbitRadius;
  ctx.beginPath(); ctx.arc(x, y, 10, 0, Math.PI * 2); 
  ctx.fillStyle = orbColor; ctx.shadowBlur = 15; ctx.shadowColor = orbColor; ctx.fill(); ctx.shadowBlur = 0; 

  for (let i = particles.length - 1; i >= 0; i--) {
    let p = particles[i]; p.x += p.vx; p.y += p.vy; p.life -= 0.04;
    if (p.life <= 0) particles.splice(i, 1);
    else { ctx.beginPath(); ctx.arc(p.x, p.y, 4 * p.life, 0, Math.PI * 2); ctx.fillStyle = p.color; ctx.globalAlpha = p.life; ctx.fill(); ctx.globalAlpha = 1.0; }
  }

  for (let i = popups.length - 1; i >= 0; i--) {
    let pop = popups[i]; pop.y -= 1; pop.life -= 0.02;
    if (pop.life <= 0) popups.splice(i, 1);
    else { 
      ctx.fillStyle = pop.color; ctx.globalAlpha = pop.life; 
      ctx.font = "bold 1.2rem sans-serif"; ctx.textAlign = "center"; 
      ctx.fillText(pop.text, pop.x, pop.y); ctx.globalAlpha = 1.0; 
    }
  }
}

function update() {
  if (!isPlaying) return;
  let moveStep = levelData.speed * direction;
  
  if (levelData.boss && isBossPhaseTwo) moveStep *= 1.3; 

  angle += moveStep;
  distanceTraveled += Math.abs(moveStep); 

  const x = center + Math.cos(angle) * orbitRadius; const y = center + Math.sin(angle) * orbitRadius;
  trail.push({x: x, y: y});
  if (trail.length > multiplier * 4) trail.shift();

  if (angle > Math.PI * 2) angle -= Math.PI * 2;
  if (angle < 0) angle += Math.PI * 2;

  targets.forEach(t => {
    if(t.active && levelData.moveSpeed > 0) {
      t.start += levelData.moveSpeed;
      if (t.start > Math.PI * 2) t.start -= Math.PI * 2;
    }
  });

  if (currentLevelIdx >= 3) {
    if (distanceTraveled >= Math.PI * 2 && multiplier > 1) {
      multiplier = 1; ui.multiplier.innerText = multiplier; ui.text.innerText = "Too slow! Multiplier lost.";
      ui.multiplierBox.style.color = "#fff";
    }
    if (distanceTraveled >= Math.PI * 6) handleFail("IDLE TIMEOUT"); 
  }

  draw(); requestAnimationFrame(update);
}

function handleFail(reason) {
  lives--; ui.lives.innerText = lives;
  
  // BUG FIX: Reset the distance traveled and multiplier so it doesn't instantly fail again!
  distanceTraveled = 0; 
  multiplier = 1; ui.multiplier.innerText = multiplier;

  triggerScreenShake(10);
  canvas.style.boxShadow = `0 0 50px #ff3366`;
  setTimeout(() => canvas.style.boxShadow = '0 0 20px rgba(0, 255, 136, 0.1)', 150);

  if (lives <= 0) {
    isPlaying = false; ui.overlay.style.display = 'flex';
    ui.title.innerText = reason || "OUT OF SYNC"; ui.title.style.color = '#ff3366';
    ui.subtitle.innerText = `Failed on ${levelData.title}`; 
    ui.btn.innerText = `Restart World ${levelData.id.split('-')[0]}`;
    ui.runCoins.innerText = Math.floor(runCoinsTracker); 
  }
}

function tap() {
  if(ui.overlay.style.display === 'flex') return;
  if (!isPlaying) { isPlaying = true; ui.text.innerText = "Syncing..."; update(); return; }

  let hitIndex = -1; let hitQuality = "miss"; 

  for(let i = 0; i < targets.length; i++) {
    if(!targets[i].active) continue;
    let endAngle = targets[i].start + targets[i].size;
    let tCenter = targets[i].start + (targets[i].size / 2);
    
    let isHit = (endAngle > Math.PI * 2) ? (angle >= targets[i].start || angle <= (endAngle - Math.PI * 2)) : (angle >= targets[i].start && angle <= endAngle);
    
    if (isHit) {
      hitIndex = i;
      let dist = Math.abs(angle - tCenter);
      if (dist < targets[i].size / 6) hitQuality = "perfect";
      else if (dist < targets[i].size / 3) hitQuality = "good";
      else hitQuality = "ok";
      break;
    }
  }

  const hitX = center + Math.cos(angle) * orbitRadius; 
  const hitY = center + Math.sin(angle) * orbitRadius;

  if (hitIndex !== -1) {
    let t = targets[hitIndex]; 
    direction *= -1; distanceTraveled = 0; 
    
    if (levelData.boss && !isBossPhaseTwo) {
      t.hp--;
      triggerScreenShake(3);
      if (t.hp === 2) t.color = '#ffaa00'; 
      if (t.hp === 1) t.color = '#ff3366'; 
      if (t.hp <= 0) t.active = false;
      
      createParticles(hitX, hitY, t.color, 10);
      
      if (targets.every(tgt => !tgt.active)) {
        isBossPhaseTwo = true;
        createPopup(center, center - 50, "CORE EXPOSED!", "#ffffff");
        triggerScreenShake(15);
        setTimeout(spawnTargets, 500); 
      }
      return; 
    }

    t.active = false;
    
    if (levelData.boss && isBossPhaseTwo) {
      if (hitQuality === "perfect") {
        createParticles(center, center, '#ffffff', 50);
        createPopup(center, center - 50, "BOSS DEFEATED!", "#00ff88");
        triggerScreenShake(20);
        stageHits = 999; 
      } else {
        multiplier = 1; ui.multiplier.innerText = multiplier;
        createPopup(center, center - 50, "REGENERATING...", "#ff3366");
        triggerScreenShake(10);
        isBossPhaseTwo = false;
        setTimeout(spawnTargets, 500);
        return;
      }
    }

    if (hitQuality === "perfect" && currentLevelIdx >= 2) {
      multiplier = Math.min(multiplier + 1, 8); score += (3 * multiplier);
      createPopup(hitX, hitY - 20, "PERFECT!", multiColors[multiplier-1]);
    } else if (hitQuality === "good") {
      score += (2 * multiplier); createPopup(hitX, hitY - 20, "GOOD", "#fff");
    } else {
      multiplier = 1; score += 1; createPopup(hitX, hitY - 20, "OK", "#aaa");
    }
    
    let coinsEarned = ((hitQuality === "perfect" ? 3 : hitQuality === "good" ? 2 : 1) * multiplier) * 0.1;
    rawCoins += coinsEarned;
    runCoinsTracker += coinsEarned;
    
    ui.score.innerText = score; ui.coins.innerText = Math.floor(rawCoins); ui.multiplier.innerText = multiplier;
    document.getElementById('multiplierBox').style.color = multiColors[Math.min(multiplier-1, 7)];
    
    createParticles(hitX, hitY, t.color);
    canvas.style.boxShadow = `0 0 50px ${multiColors[Math.min(multiplier-1, 7)]}`;
    setTimeout(() => canvas.style.boxShadow = '0 0 20px rgba(0, 255, 136, 0.1)', 150);

    if (targets.every(tgt => !tgt.active) || stageHits >= levelData.hitsNeeded) {
      stageHits++;
      if (stageHits >= levelData.hitsNeeded) {
        isPlaying = false; currentLevelIdx++;
        ui.overlay.style.display = 'flex'; ui.title.innerText = "STAGE CLEARED"; ui.title.style.color = '#00ff88';
        ui.subtitle.innerText = `Total Banked: ${Math.floor(rawCoins)}`; ui.btn.innerText = "Next Stage";
        
        // BUG FIX: Actually display the run coins on the win screen instead of hiding them!
        ui.runCoins.innerText = Math.floor(runCoinsTracker); 
      } else { spawnTargets(); }
    }
  } else { handleFail("MISSED"); }
}

function startGame() {
  ui.overlay.style.display = 'none';
  if (lives <= 0) { 
    currentLevelIdx = getCheckpointIndex(); 
    runCoinsTracker = 0; 
  }
  loadLevel(currentLevelIdx);
  if(!isPlaying) { isPlaying = true; update(); }
}

document.addEventListener('touchstart', (e) => { if(e.target.tagName !== 'BUTTON') { e.preventDefault(); tap(); }}, {passive: false});
document.addEventListener('mousedown', (e) => { if(e.target.tagName !== 'BUTTON') tap(); });

loadLevel(0); draw();
