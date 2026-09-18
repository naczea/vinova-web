import { Component, ElementRef, OnDestroy, ViewChild, afterNextRender, computed, effect, signal } from '@angular/core';
import { VINOVA_HOME_CONTENT } from '../../../content/vinova-home.content';
import { ConditionConfig, ConditionId, VISION_SIMULATOR_CONDITIONS } from './vision-simulator.config';

const DIVIDER_MIN = 5;
const DIVIDER_MAX = 95;
const DIVIDER_KEY_STEP = 4;

@Component({
    selector: 'app-vision-simulator',
    imports: [],
    templateUrl: './vision-simulator.component.html',
    styleUrl: './vision-simulator.component.scss'
})
export class VisionSimulatorComponent implements OnDestroy {
    @ViewChild('mediaWrap') private mediaWrapRef!: ElementRef<HTMLElement>;
    @ViewChild('frame') private frameRef?: ElementRef<HTMLElement>;

    protected readonly content = VINOVA_HOME_CONTENT;
    protected readonly whatsappUrl = VINOVA_HOME_CONTENT.contact.whatsappUrl;
    protected readonly conditions = VISION_SIMULATOR_CONDITIONS;

    private readonly widths = [480, 768, 1200, 1600];

    protected sceneAvifSrcset(basename: string): string {
        return this.widths.map(w => `assets/images/home/vision-simulator/${basename}-${w}.avif ${w}w`).join(', ');
    }

    protected sceneWebpSrcset(basename: string): string {
        return this.widths.map(w => `assets/images/home/vision-simulator/${basename}-${w}.webp ${w}w`).join(', ');
    }

    protected sceneJpg(basename: string): string {
        return `assets/images/home/vision-simulator/${basename}.jpg`;
    }

    protected readonly selectedConditionId = signal<ConditionId>('miopia');
    protected readonly dividerPosition = signal<number>(45);
    private isDragging = false;

    // Gate de rendimiento: la sección solo monta las <picture>/filtros SVG
    // (el coste real) una vez que entra en el viewport. Antes de eso se
    // muestra un marcador del mismo aspect-ratio, sin costo y sin CLS.
    protected readonly hasEnteredViewport = signal(false);
    private observer?: IntersectionObserver;

    // Ancho real del frame, medido en runtime (no un número fijo): el
    // desenfoque de cada condición se calcula como fracción de ESTE valor
    // (ver vision-simulator.config.ts), así es proporcional al tamaño real
    // con que se ve la imagen en cada pantalla, sin diluirse en desktop ni
    // desbordarse en móvil.
    protected readonly frameWidth = signal<number>(0);
    protected readonly frameHeight = signal<number>(0);
    private resizeObserver?: ResizeObserver;

    protected readonly selectedCondition = computed(
        () => this.conditions.find(c => c.id === this.selectedConditionId())!
    );

    // Miopía/presbicia ('depth-far'/'depth-near'): máscara de profundidad con
    // CSS mask-image (gradiente lineal/radial) + filter:blur() nativo del
    // navegador, aplicados directamente a la capa superior (.vs__img--overlay);
    // donde la máscara es transparente, se ve la capa nítida de abajo
    // (.vs__img--base) sin necesidad de componer nada a mano. Se probaron
    // primero feGaussianBlur+feImage+feComposite (SVG) y primitiveUnits
    // objectBoundingBox para esto mismo: ambos dieron resultados incorrectos
    // (la máscara aparecía en la zona opuesta) en Chrome a ciertos tamaños de
    // viewport — un bug real de esa combinación, no de la lógica de máscara en
    // sí — documentado en LIMPIEZA.md Bloque 11. mask-image es la técnica
    // estándar y universalmente soportada para este efecto exacto.
    // Astigmatismo ('ghost') sigue con el filtro SVG (feOffset/feMerge, sin
    // feImage de por medio), que no mostró ese problema.
    protected readonly overlayFilterCss = computed(() => {
        const cond = this.selectedCondition();
        if (cond.filter.kind === 'ghost') {
            return `url(#vs-filter-${cond.id})`;
        }
        // depth-far/depth-near siempre traen un único número (blur uniforme,
        // sin componente direccional), a diferencia del ghost de astigmatismo.
        const fraction = cond.filter.blurStdDeviation as number;
        return `blur(${fraction * this.frameWidth()}px)`;
    });

    protected readonly overlayMaskCss = computed(() => {
        const cond = this.selectedCondition();
        const depth = cond.filter.depth;
        if (!depth) {
            return 'none';
        }
        const stops = depth.stops.map(s => `rgba(255,255,255,${s.opacity}) ${s.offset * 100}%`).join(', ');
        if (cond.filter.kind === 'depth-near' && depth.radial) {
            const { cx, cy, r } = depth.radial;
            const radiusPx = r * this.frameWidth();
            return `radial-gradient(circle ${radiusPx}px at ${cx * 100}% ${cy * 100}%, ${stops})`;
        }
        return `linear-gradient(to bottom, ${stops})`;
    });

    // El filtro SVG de astigmatismo (ghost) sigue tomando la condición como
    // parámetro porque vive en un @for sobre todas las condiciones en el <svg>
    // de defs (para no remontar el DOM al cambiar de pestaña).
    protected ghostStdDeviationPx(condition: ConditionConfig): string {
        return condition.filter.ghost ? this.toStdDeviationAttr(condition.filter.ghost.blurStdDeviation) : '0';
    }

    protected ghostDxPx(condition: ConditionConfig): number {
        return (condition.filter.ghost?.dx ?? 0) * this.frameWidth();
    }

    protected ghostDyPx(condition: ConditionConfig): number {
        return (condition.filter.ghost?.dy ?? 0) * this.frameWidth();
    }

    protected blurStdDeviationPx(condition: ConditionConfig): string {
        return this.toStdDeviationAttr(condition.filter.blurStdDeviation);
    }

    // Formato del atributo SVG stdDeviation: un número (blur uniforme) o "x y"
    // (direccional) — sólo lo usa el filtro de astigmatismo (ghost).
    private toStdDeviationAttr(fraction: number | [number, number]): string {
        const width = this.frameWidth();
        if (Array.isArray(fraction)) {
            return `${fraction[0] * width} ${fraction[1] * width}`;
        }
        return `${fraction * width}`;
    }

    protected readonly dividerValueText = computed(() => {
        const pos = Math.round(this.dividerPosition());
        const label = this.selectedCondition().withLabel.toLowerCase();
        return `${pos}% de la imagen muestra la simulación ${label}, el resto muestra visión normal.`;
    });

    constructor() {
        afterNextRender(() => {
            this.observer = new IntersectionObserver(
                ([entry]) => {
                    if (entry.isIntersecting) {
                        this.hasEnteredViewport.set(true);
                        this.observer?.disconnect();
                    }
                },
                { threshold: 0.15 }
            );
            this.observer.observe(this.mediaWrapRef.nativeElement);
        });

        // El <div #frame> sólo existe una vez hasEnteredViewport() es true (está
        // dentro del mismo @if que monta las <picture>/filtros); se espera a que
        // aparezca para engancharle el ResizeObserver que alimenta frameWidth.
        effect(() => {
            if (!this.hasEnteredViewport() || this.resizeObserver) {
                return;
            }
            queueMicrotask(() => {
                const frame = this.frameRef?.nativeElement;
                if (!frame) {
                    return;
                }
                this.resizeObserver = new ResizeObserver(([entry]) => {
                    this.frameWidth.set(entry.contentRect.width);
                    this.frameHeight.set(entry.contentRect.height);
                });
                this.resizeObserver.observe(frame);
            });
        });
    }

    ngOnDestroy(): void {
        this.observer?.disconnect();
        this.resizeObserver?.disconnect();
    }

    protected selectCondition(id: ConditionId): void {
        this.selectedConditionId.set(id);
    }

    private setDividerFromClientX(clientX: number): void {
        const frame = this.frameRef?.nativeElement;
        if (!frame) {
            return;
        }
        const rect = frame.getBoundingClientRect();
        const pct = ((clientX - rect.left) / rect.width) * 100;
        this.dividerPosition.set(Math.min(DIVIDER_MAX, Math.max(DIVIDER_MIN, pct)));
    }

    protected onDividerPointerDown(event: PointerEvent): void {
        (event.target as HTMLElement).setPointerCapture(event.pointerId);
        this.isDragging = true;
        event.preventDefault();
    }

    protected onDividerPointerMove(event: PointerEvent): void {
        if (!this.isDragging) {
            return;
        }
        this.setDividerFromClientX(event.clientX);
    }

    protected onDividerPointerUp(): void {
        this.isDragging = false;
    }

    protected onDividerKeydown(event: KeyboardEvent): void {
        if (event.key === 'ArrowLeft') {
            event.preventDefault();
            this.dividerPosition.update(v => Math.max(DIVIDER_MIN, v - DIVIDER_KEY_STEP));
        } else if (event.key === 'ArrowRight') {
            event.preventDefault();
            this.dividerPosition.update(v => Math.min(DIVIDER_MAX, v + DIVIDER_KEY_STEP));
        }
    }
}
