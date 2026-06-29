import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
import gsap from 'gsap';

const bgVertexShader = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const bgFragmentShader = `
uniform vec3 uColor1;
uniform vec3 uColor2;
uniform float uRatio;
uniform float uOpacity;
uniform float uProgress;
varying vec2 vUv;
void main() {
  vec2 uv = vUv - 0.5;
  uv *= 0.75;
  uv *= uRatio;
  float d1 = length(uv);
  float d2 = length(uv - vec2(0.08, 0.0));
  float d3 = length(uv + vec2(0.08, 0.0));
  float d4 = length(uv + vec2(0.0, 0.08));
  float m1 = smoothstep(0.5, 0.0, d1);
  float m2 = smoothstep(0.5, 0.0, d2);
  float m3 = smoothstep(0.5, 0.0, d3);
  float m4 = smoothstep(0.5, 0.0, d4);
  float m = m1 + m2 + m3 + m4;
  m = clamp(m, 0.0, 1.0);
  gl_FragColor = vec4(mix(uColor1, uColor2, m), 1.0);
}
`;

const bevelVertexShader = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const bevelFragmentShader = `
varying vec2 vUv;
uniform sampler2D uRt;
uniform vec3 uBgColor;
uniform vec3 uTextColor;
uniform vec3 uBevelColor;
uniform float uBevelSize;
uniform float uBevelThickness;
uniform float uTextSurrounding;
uniform vec3 uSmoothMin;
uniform vec3 uSmoothMax;
uniform float uOpacity;

vec3 screen(vec3 a, vec3 b) {
  return 1.0 - (1.0 - a) * (1.0 - b);
}

vec3 sampleTextureSmooth(sampler2D tex, vec2 uv, vec3 smin, vec3 smax) {
  vec3 b0 = step(smin, vec3(uv, 0.0));
  vec3 b1 = step(vec3(uv, 0.0), smax);
  vec3 a0 = texture2D(tex, uv - 0.5).rgb;
  vec3 a1 = texture2D(tex, uv + 0.5).rgb;
  return a0 * b0.x * b0.y * b0.z * b1.x * b1.y * b1.z + a1 * (1.0 - b0.x * b0.y * b0.z * b1.x * b1.y * b1.z);
}

vec4 blur(sampler2D image, vec2 uv, vec2 resolution, vec2 direction) {
  vec4 color = vec4(0.0);
  vec2 off = resolution * direction;
  color += texture2D(image, uv) * 0.1633;
  color += texture2D(image, uv + off * 1.0) * 0.1531;
  color += texture2D(image, uv - off * 1.0) * 0.1531;
  color += texture2D(image, uv + off * 2.0) * 0.12245;
  color += texture2D(image, uv - off * 2.0) * 0.12245;
  color += texture2D(image, uv + off * 3.0) * 0.0918;
  color += texture2D(image, uv - off * 3.0) * 0.0918;
  color += texture2D(image, uv + off * 4.0) * 0.051;
  color += texture2D(image, uv - off * 4.0) * 0.051;
  return color;
}

void main() {
  vec2 uv = gl_FragCoord.xy;
  float minSize = min(uBevelSize, uBevelThickness);
  vec3 textureU = texture2D(uRt, vUv + vec2(0.0, minSize * 1.0)).rgb;
  vec3 textureD = texture2D(uRt, vUv - vec2(0.0, minSize * 1.0)).rgb;
  vec3 blurU = blur(uRt, vUv + vec2(0.0, minSize * 3.0), vec2(uBevelSize, uBevelThickness), vec2(0.0, 1.0)).rgb;
  vec3 blurD = blur(uRt, vUv - vec2(0.0, minSize * 3.0), vec2(uBevelSize, uBevelThickness), vec2(0.0, 1.0)).rgb;
  vec3 tex = blurU + blurD;
  float bevelTop = smoothstep(0.0, 1.0, (textureU.r + blurU.r) * 0.5);
  float bevelBottom = smoothstep(0.0, 1.0, (textureD.r + blurD.r) * 0.5);
  float bordersSize = 0.05;
  float borderTop = smoothstep(0.0, bordersSize, vUv.y) * (1.0 - smoothstep(1.0 - bordersSize, 1.0, vUv.y));
  vec4 bevel = vec4(screen(screen(uBevelColor * pow(bevelTop, 0.9), uBevelColor * bevelBottom), uTextColor * borderTop), borderTop);
  float inText = smoothstep(0.0, 1.0, tex.r * 0.5);
  vec4 bg = vec4(mix(uBgColor, vec3(1.0), (tex.r + tex.g) * 0.15), tex.r);
  vec4 color;
  if (uv.x < 1.0 || uv.x > uTextSurrounding - 1.0 || uv.y < 1.0 || uv.y > uTextSurrounding - 1.0) {
    vec3 smoothTexture = sampleTextureSmooth(uRt, vUv, uSmoothMin, uSmoothMax);
    bg = vec4(mix(uBgColor, vec3(1.0), smoothTexture.r), smoothTexture.r);
  }
  vec4 textBevel = mix(bg, bevel, inText);
  vec4 text = vec4(uTextColor, smoothstep(0.0, 1.0, tex.r * 0.35));
  float textSmooth = sampleTextureSmooth(uRt, vUv, uSmoothMin, uSmoothMax).r;
  text.a = smoothstep(0.0, 1.0, textSmooth * 0.35);
  float invertedColor = 1.0 - textBevel.a;
  vec3 blendedColor = textBevel.rgb * invertedColor + text.a * text.rgb;
  float blendedAlpha = textBevel.a * invertedColor + text.a;
  color = vec4(blendedColor, blendedAlpha);
  vec4 finalColor = mix(color, vec4(uTextColor, 1.0), inText);
  gl_FragColor = finalColor * uOpacity;
}
`;

interface GlassTextProps {
  word?: string;
}

export default function GlassText({ word = 'S. Ponnoli' }: GlassTextProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const composerRef = useRef<EffectComposer | null>(null);
  const uniformsRef = useRef<{ uOpacity: { value: number } }>({ uOpacity: { value: 0 } });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.offsetWidth;
    const height = container.offsetHeight;
    if (width === 0 || height === 0) return;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    renderer.domElement.style.display = 'block';
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(
      width / -2, width / 2, height / 2, height / -2, -1000, 1000
    );
    camera.position.set(0, 0, 10);

    const textSurrounding = Math.max(width, height);
    const renderTargetA = new THREE.WebGLRenderTarget(textSurrounding, textSurrounding);

    const uniforms = {
      uRt: { value: renderTargetA.texture },
      uBgColor: { value: new THREE.Color('#F5F0EB') },
      uTextColor: { value: new THREE.Color('#2D2D2D') },
      uBevelColor: { value: new THREE.Color('#E8E0D8') },
      uBevelSize: { value: 0.8 },
      uBevelThickness: { value: 0.6 },
      uTextSurrounding: { value: textSurrounding },
      uSmoothMin: { value: new THREE.Vector3(0.0, height - 1.0, 0.0) },
      uSmoothMax: { value: new THREE.Vector3(width - 1.0, 0.0, 0.0) },
      uOpacity: { value: 0 },
    };
    uniformsRef.current = uniforms;

    const shaderPass = new ShaderPass(
      new THREE.ShaderMaterial({
        uniforms,
        vertexShader: bevelVertexShader,
        fragmentShader: bevelFragmentShader,
        transparent: true,
      })
    );

    const composer = new EffectComposer(renderer);
    composer.addPass(shaderPass);
    composerRef.current = composer;

    const group = new THREE.Group();
    scene.add(group);

    const fontSize = 0.45 * height;
    const padding = 0.2 * fontSize;

    const loader = new FontLoader();
    loader.load(
      'https://cdn.jsdelivr.net/npm/three@0.177.0/examples/fonts/dm-sans/DMSans-Bold.woff',
      (font) => {
        const textGeo = new TextGeometry(word, {
          font,
          size: 1,
          depth: 0.01,
          curveSegments: 12,
        });
        textGeo.computeBoundingBox();
        // Manual normalize - scale to unit size
        const bbox = textGeo.boundingBox;
        if (bbox) {
          const sizeX = bbox.max.x - bbox.min.x;
          const sizeY = bbox.max.y - bbox.min.y;
          const maxSize = Math.max(sizeX, sizeY);
          if (maxSize > 0) {
            textGeo.scale(1 / maxSize, 1 / maxSize, 1 / maxSize);
          }
          // Center the geometry
          textGeo.translate(-(bbox.min.x + sizeX / 2) / maxSize, -(bbox.min.y + sizeY / 2) / maxSize, 0);
        }

        const textMat = new THREE.MeshBasicMaterial();
        const textMesh = new THREE.Mesh(textGeo, textMat);
        textMesh.scale.set(fontSize, fontSize * 1.3, 1);
        group.add(textMesh);
        group.position.y = -padding;

        // Background
        const bgGeo = new THREE.PlaneGeometry(1, 1);
        const bgMat = new THREE.ShaderMaterial({
          uniforms: {
            uColor1: { value: new THREE.Color('#F0EBE4') },
            uColor2: { value: new THREE.Color('#FAF8F5') },
            uRatio: { value: 1 },
            uOpacity: { value: 1 },
            uProgress: { value: 0 },
          },
          vertexShader: bgVertexShader,
          fragmentShader: bgFragmentShader,
        });
        const bgMesh = new THREE.Mesh(bgGeo, bgMat);
        const aspect = width / height;
        const camHeight = camera.top - camera.bottom;
        const camWidth = camHeight * aspect;
        bgMesh.scale.set(camWidth, camHeight, 1);
        bgMesh.position.z = -1;
        scene.add(bgMesh);

        const ratio = Math.min(width, height) / Math.max(width, height);
        bgMat.uniforms.uRatio.value = ratio;

        // Render scene to renderTargetA for the shader pass
        renderer.setRenderTarget(renderTargetA);
        renderer.render(scene, camera);
        renderer.setRenderTarget(null);

        composer.render();

        // Fade in
        gsap.to(uniforms.uOpacity, {
          value: 1,
          duration: 0.8,
          ease: 'power2.out',
        });
      }
    );

    const handleResize = () => {
      const newWidth = container.offsetWidth;
      const newHeight = container.offsetHeight;
      if (newWidth === 0 || newHeight === 0) return;
      renderer.setSize(newWidth, newHeight);
      camera.left = newWidth / -2;
      camera.right = newWidth / 2;
      camera.top = newHeight / 2;
      camera.bottom = newHeight / -2;
      camera.updateProjectionMatrix();
      composer.setSize(newWidth, newHeight);
      renderTargetA.setSize(Math.max(newWidth, newHeight), Math.max(newWidth, newHeight));
      uniforms.uTextSurrounding.value = Math.max(newWidth, newHeight);
      uniforms.uSmoothMin.value = new THREE.Vector3(0, newHeight - 1, 0);
      uniforms.uSmoothMax.value = new THREE.Vector3(newWidth - 1, 0, 0);

      renderer.setRenderTarget(renderTargetA);
      renderer.render(scene, camera);
      renderer.setRenderTarget(null);
      composer.render();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      renderTargetA.dispose();
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [word]);

  return (
    <div
      ref={containerRef}
      style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden' }}
    />
  );
}
