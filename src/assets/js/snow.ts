import Random from './random';

export default class SnowEffect {
    private rngSeed: string = 'LetItSnow';

    private rng: Random;

    constructor(container: Element, density: number = 200) {
        this.rng = new Random(this.rngSeed);

        this.generateCss(density);
        this.injectMarkup(container, density);
    }

    // Creating snowflakes
    private injectMarkup(container: Element, density: number) {
        for (let x = 0; x < density; x++) {
            let board = document.createElement('div');
            board.className = "snowflake";
            container.appendChild(board);
        }
    }

    // Append style for each snowflake to the head
    private injectCss(rule: string) {
        let css = document.createElement('style');
        css.appendChild(document.createTextNode(rule)); // Support for the rest
        document.getElementsByTagName("head")[0].appendChild(css);
    }

    // Create style for snowflake
    private generateCss(density: number) {
        let snowflake_name = "snowflake";
        let rule = ``;

        // If we don't add 2 to density, we will have a single
        // snowflake stuck in the top left corner of the container.
        for (let i = 1; i <= density + 2; i++) {
            const random_x = this.rng.rangeFloat(0, 100);               // Unit: vw
            const random_offset = this.rng.rangeFloat(-10, 10);         // Unit: vw
            const random_x_end = random_x + random_offset;
            const random_x_end_yoyo = random_x + (random_offset / 2);
            const random_yoyo_time = this.rng.rangeFloat(0.3, 0.8);
            const random_yoyo_y = random_yoyo_time * 100;               // Unit: vh
            const random_scale = this.rng.float();
            const fall_duration = this.rng.range(10, 30);               // Unit: seconds
            const fall_delay = this.rng.integer(30) * -1;               // Unit: seconds
            const opacity = this.rng.float();

            rule += `
					.${snowflake_name}:nth-child(${i}) {
						opacity: ${opacity};
						transform: translate(${random_x}vw, -10px) scale(${random_scale});
						animation: fall-${i} ${fall_duration}s ${fall_delay}s linear infinite;
					}

					@keyframes fall-${i} {
						${random_yoyo_time * 100}% {
							transform: translate(${random_x_end}vw, ${random_yoyo_y}vh) scale(${random_scale});
						}

						to {
							transform: translate(${random_x_end_yoyo}vw, 100vh) scale(${random_scale});
						}

					}
				`
        }

        this.injectCss(rule);
    }
}