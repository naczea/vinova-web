import { Component, ElementRef, OnDestroy, ViewChild, afterNextRender, computed, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { VINOVA_HOME_CONTENT } from '../../../content/vinova-home.content';
import { ConditionId, VISION_SIMULATOR_CONDITIONS } from './vision-simulator.config';

const DIVIDER_MIN = 5;
const DIVIDER_MAX = 95;
const DIVIDER_KEY_STEP = 4;

@Component({
    selector: 'app-vision-simulator',
    imports: [RouterLink],
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

    protected readonly selectedCondition = computed(
        () => this.conditions.find(c => c.id === this.selectedConditionId())!
    );

    protected readonly filterUrl = computed(() => `url(#vs-filter-${this.selectedConditionId()})`);

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
    }

    ngOnDestroy(): void {
        this.observer?.disconnect();
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
