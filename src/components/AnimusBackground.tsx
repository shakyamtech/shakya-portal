import React, { useEffect, useRef } from 'react';

const AnimusBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let particlesArray: Particle[] = [];
    let animationFrameId: number;

    // Responsive Canvas
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let mouse = {
      x: null as number | null,
      y: null as number | null,
      radius: 180 // Sync radius for mouse
    };

    const handleMouseMove = (event: MouseEvent) => {
      mouse.x = event.x;
      mouse.y = event.y;
    };

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      mouse.radius = 180;
      init();
    };

    const handleMouseOut = () => {
      mouse.x = null;
      mouse.y = null;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', handleResize);
    window.addEventListener('mouseout', handleMouseOut);

    class Particle {
      x: number;
      y: number;
      directionX: number;
      directionY: number;
      size: number;
      color: string;
      baseColor: string;

      constructor(x: number, y: number, directionX: number, directionY: number, size: number, color: string) {
        this.x = x;
        this.y = y;
        this.directionX = directionX;
        this.directionY = directionY;
        this.size = size;
        this.baseColor = color;
        this.color = color;
      }

      draw() {
        ctx!.beginPath();
        ctx!.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
        ctx!.fillStyle = this.color;
        ctx!.fill();
      }

      update() {
        if (this.x > canvas!.width || this.x < 0) {
          this.directionX = -this.directionX;
        }
        if (this.y > canvas!.height || this.y < 0) {
          this.directionY = -this.directionY;
        }

        this.x += this.directionX;
        this.y += this.directionY;

        this.draw();
      }
    }

    const init = () => {
      particlesArray = [];
      // Calculate number of particles based on screen size to prevent lag
      let numberOfParticles = (canvas!.height * canvas!.width) / 12000;
      for (let i = 0; i < numberOfParticles; i++) {
        let size = (Math.random() * 1.5) + 0.5;
        let x = (Math.random() * ((innerWidth - size * 2) - (size * 2)) + size * 2);
        let y = (Math.random() * ((innerHeight - size * 2) - (size * 2)) + size * 2);
        let directionX = (Math.random() * 0.4) - 0.2;
        let directionY = (Math.random() * 0.4) - 0.2;
        // Accent color (Gold) mixed with white for a tech feel. Very faded.
        let color = 'rgba(212, 175, 55, 0.4)'; 

        particlesArray.push(new Particle(x, y, directionX, directionY, size, color));
      }
    };

    const connect = () => {
      let opacityValue = 1;
      for (let a = 0; a < particlesArray.length; a++) {
        for (let b = a; b < particlesArray.length; b++) {
          let distance = ((particlesArray[a].x - particlesArray[b].x) * (particlesArray[a].x - particlesArray[b].x))
            + ((particlesArray[a].y - particlesArray[b].y) * (particlesArray[a].y - particlesArray[b].y));
          
          // Background network connections
          if (distance < (canvas!.width / 9) * (canvas!.height / 9)) {
            opacityValue = 1 - (distance / 20000);
            ctx!.strokeStyle = `rgba(212, 175, 55, ${opacityValue * 0.08})`; // Very faint gold network
            ctx!.lineWidth = 0.5;
            ctx!.beginPath();
            ctx!.moveTo(particlesArray[a].x, particlesArray[a].y);
            ctx!.lineTo(particlesArray[b].x, particlesArray[b].y);
            ctx!.stroke();
          }
        }
        
        // Interactive "Animus Sync" pulling towards the mouse
        if (mouse.x != null && mouse.y != null) {
          let dx = mouse.x - particlesArray[a].x;
          let dy = mouse.y - particlesArray[a].y;
          let distanceToMouse = Math.sqrt(dx * dx + dy * dy);
          
          if (distanceToMouse < mouse.radius) {
            // Fade opacity based on distance to mouse
            let syncOpacity = 0.4 - (distanceToMouse / mouse.radius) * 0.4;
            ctx!.beginPath();
            // Bright white/gold line snapping to the cursor
            ctx!.strokeStyle = `rgba(255, 255, 255, ${syncOpacity})`;
            ctx!.lineWidth = 1;
            ctx!.moveTo(particlesArray[a].x, particlesArray[a].y);
            ctx!.lineTo(mouse.x, mouse.y);
            ctx!.stroke();
            
            // Highlight the particle when it syncs
            particlesArray[a].color = `rgba(255, 255, 255, ${syncOpacity + 0.2})`;
          } else {
            particlesArray[a].color = particlesArray[a].baseColor;
          }
        }
      }
    };

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      ctx!.clearRect(0, 0, innerWidth, innerHeight);

      for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
      }
      connect();
    };

    init();
    animate();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mouseout', handleMouseOut);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 0, // Behind everything
        background: 'transparent'
      }}
    />
  );
};

export default AnimusBackground;
