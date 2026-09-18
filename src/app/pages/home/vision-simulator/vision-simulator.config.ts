// ⚠️ Todos los valores numéricos de este archivo (stdDeviation, paradas de
// gradiente, desplazamientos, equivalencias en dioptrías) son un punto de
// partida para un prototipo visual con fines educativos. DEBEN ser
// revisados y ajustados por una optometrista antes de publicar el
// simulador: no son mediciones clínicas ni pretenden representar con
// precisión ninguna condición.

export type ConditionId = 'miopia' | 'astigmatismo' | 'presbicia';

export interface ConditionConfig {
    id: ConditionId;
    label: string;
    // Escena fija de esta condición (no seleccionable por separado: cada
    // condición solo se aprecia bien en la escena donde es más notoria).
    scene: {
        // Basename bajo assets/images/home/vision-simulator/, sin sufijo de ancho ni extensión.
        basename: string;
        alt: string;
        // Dimensiones del fallback .jpg (máx. 1200px de ancho), para el width/height del <img>.
        width: number;
        height: number;
    };
    // Texto de la etiqueta derecha del divisor, ej. "Con miopía".
    withLabel: string;
    // Dioptría aproximada que representa esta condición (a revisar por optometrista).
    diopterApprox: string;
    // 2-3 frases, tono divulgativo, sin diagnósticos ni cifras clínicas.
    description: string;
    // Una frase breve que oriente la mirada hacia el detalle donde más se nota el efecto.
    focusHint: string;
    // Parámetros del filtro SVG (ver vs-filter-* en vision-simulator.component.html).
    // Todas las medidas de desenfoque/desplazamiento son FRACCIONES del ancho
    // real con que se renderiza el frame (no px fijos ni SVG primitiveUnits:
    // se probó primitiveUnits="objectBoundingBox" y produjo resultados
    // incorrectos/invertidos en combinación con feImage a ciertos tamaños de
    // viewport — bug real de interacción entre ambas features, documentado en
    // LIMPIEZA.md Bloque 11. En su lugar, vision-simulator.component.ts mide
    // el ancho real del frame con ResizeObserver y calcula el stdDeviation en
    // píxeles absolutos multiplicando por estas fracciones, recalculando en
    // cada resize — logra la misma proporcionalidad sin el bug del navegador.
    filter: {
        // Desenfoque base (feGaussianBlur), como fracción del ancho renderizado.
        // Un solo número (blur uniforme) o [x, y] (direccional, astigmatismo).
        blurStdDeviation: number | [number, number];
        // 'depth-far' (miopía: nítido cerca, borroso lejos) | 'depth-near'
        // (presbicia: borroso cerca, nítido lejos) | 'ghost' (astigmatismo:
        // desdoblamiento + blur direccional discreto).
        kind: 'depth-far' | 'depth-near' | 'ghost';
        // depth-far / depth-near: paradas del gradiente que define dónde
        // empieza y termina la transición nítido↔borroso (0-100, % de alto
        // de la escena para depth-far verticales; posición del objeto
        // cercano para depth-near radiales).
        depth?: {
            // depth-far: gradiente lineal vertical (0% = arriba/lejos).
            // depth-near: gradiente radial centrada en el objeto cercano.
            radial?: { cx: number; cy: number; r: number };
            // Paradas comunes: offset (0-1) -> opacidad del blur en ese punto.
            stops: { offset: number; opacity: number }[];
        };
        // ghost (astigmatismo): desplazamiento de la copia fantasma (fracción
        // del ancho renderizado) y su opacidad.
        ghost?: { dx: number; dy: number; opacity: number; blurStdDeviation: number | [number, number] };
    };
}

export const VISION_SIMULATOR_CONDITIONS: ConditionConfig[] = [
    {
        id: 'miopia',
        label: 'Miopía',
        scene: {
            basename: 'lejos',
            alt: 'Pizarra de una cafetería sobre una pared de piedra, con mesas y sillas nítidas en primer plano',
            width: 1200,
            height: 800
        },
        withLabel: 'Con miopía',
        diopterApprox: 'Aproximadamente -2.00 D (miopía moderada)',
        description:
            'Ver de lejos cuesta: los letreros, los rostros al otro lado de la calle o los semáforos se perciben borrosos. De cerca, en cambio, la visión suele mantenerse clara y nítida.',
        focusHint: 'Fíjate en el texto de la pizarra al fondo: es lo que más se desenfoca, mientras las sillas de primer plano se mantienen nítidas.',
        filter: {
            // Fracción del ancho renderizado (ver nota de la interfaz). Valor
            // final verificado por varianza del laplaciano (ver LIMPIEZA.md
            // Bloque 11): caída de nitidez en la pizarra (far) = 100.0% a
            // 1280px y 100.0% a 390px (umbral: ≥70%); caída en las sillas
            // (near, deben quedar nítidas) = -0.7% a 1280px y -0.8% a 390px
            // (umbral: ≤15%, valores negativos = sin degradación real).
            blurStdDeviation: 0.045,
            kind: 'depth-far',
            depth: {
                // Geometría real de esta foto (medida por análisis de píxeles, no
                // estimada): la pizarra ocupa 18%-43% de la altura; las sillas en
                // primer plano empiezan recién a partir de ~71% de la altura. La
                // transición baja a 0 bien antes de las sillas, no a un patrón
                // genérico de cuartiles.
                stops: [
                    { offset: 0, opacity: 0.5 },
                    { offset: 0.18, opacity: 1 },
                    { offset: 0.43, opacity: 1 },
                    { offset: 0.6, opacity: 0.15 },
                    { offset: 0.71, opacity: 0 }
                ]
            }
        }
    },
    {
        id: 'astigmatismo',
        label: 'Astigmatismo',
        scene: {
            basename: 'noche',
            alt: 'Calle urbana mojada de noche, con farolas y luces de neón aisladas sobre fondo oscuro',
            width: 1200,
            height: 675
        },
        withLabel: 'Con astigmatismo',
        diopterApprox: 'Aproximadamente -1.50 D cilíndricas',
        description:
            'Las luces y los bordes se perciben duplicados o arrastrados en una sola dirección, como si no terminaran de enfocar. De noche, cada farol o foco de auto se desdobla en vez de verse como un punto definido.',
        focusHint: 'Fíjate en cómo se duplican las luces y los bordes de los letreros de neón.',
        filter: {
            // El estiramiento direccional que ya identificaba a esta condición se
            // mantiene pero discreto; el rasgo principal es el desdoblamiento: una
            // segunda copia desplazada y semitransparente por encima. Fracciones
            // del ancho renderizado (ver nota de la interfaz), recalibradas para
            // reproducir el mismo resultado visual que ya funcionaba.
            blurStdDeviation: [0.001, 0.003],
            kind: 'ghost',
            ghost: { dx: 0.012, dy: 0.009, opacity: 0.45, blurStdDeviation: [0.001, 0.002] }
        }
    },
    {
        id: 'presbicia',
        label: 'Presbicia',
        scene: {
            basename: 'cerca',
            alt: 'Letrero de madera "OPEN" colgado de un poste en primer plano, con la terraza de un restaurante nítida detrás',
            width: 1200,
            height: 800
        },
        withLabel: 'Con presbicia',
        diopterApprox: 'Aproximadamente +1.50 D de adición',
        description:
            'El texto cercano —un libro, una etiqueta, el teléfono— pierde nitidez, mientras que lo que está más alejado se sigue viendo con claridad. Suele notarse con el paso de los años, al alejar instintivamente lo que se lee para enfocarlo mejor.',
        focusHint: 'Fíjate en el letrero de "OPEN" en primer plano: se desenfoca mientras la terraza del fondo se mantiene nítida.',
        filter: {
            // Lo contrario de la miopía: el desenfoque disminuye con la distancia.
            // Fracción del ancho renderizado, ver nota de miopía. Valor final
            // verificado por varianza del laplaciano (ver LIMPIEZA.md Bloque 11):
            // caída de nitidez en el letrero OPEN (near) = 97.9% a 1280px y
            // 98.0% a 390px (umbral: ≥70%); caída en la terraza (far, debe
            // quedar nítida) = -16.5% a 1280px y -9.4% a 390px (umbral: ≤10%,
            // valores negativos = sin degradación real).
            blurStdDeviation: 0.04,
            kind: 'depth-near',
            depth: {
                // Centro y radio medidos sobre el bbox real del letrero "OPEN"
                // (con su marco), no un centro genérico de la imagen: cx=0.684,
                // cy=0.499 es el punto medio exacto del letrero.
                radial: { cx: 0.684, cy: 0.499, r: 0.19 },
                stops: [
                    { offset: 0, opacity: 1 },
                    { offset: 0.6, opacity: 0.6 },
                    { offset: 1, opacity: 0 }
                ]
            }
        }
    }
];
