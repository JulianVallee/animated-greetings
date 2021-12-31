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
            const random_x = this.rng.rangeFloat(0, 100);               // Unit: %
            const random_offset = this.rng.rangeFloat(-10, 10);         // Unit: %
            const random_x_end = random_x + random_offset;
            const random_x_end_yoyo = random_x + (random_offset * 4);
            const random_yoyo_time = this.rng.rangeFloat(0.3, 0.5);
            const random_yoyo_y = random_yoyo_time * 100;               // Unit: %
            const random_scale = this.rng.float();
            const fall_duration = this.rng.range(5, 10);               // Unit: seconds
            const fall_delay = this.rng.integer(50) * -1;               // Unit: seconds
            const opacity = this.rng.float();

            rule += `
					.${snowflake_name}:nth-child(${i}) {
						opacity: ${opacity};
						left: ${random_x}%;
						top: -10%;
						transform: scale(${random_scale});
						animation: fall-${i} ${fall_duration}s ${fall_delay}s linear infinite;
					}

					@keyframes fall-${i} {
						${random_yoyo_time * 100}% {
                            left: ${random_x_end}%;
                            top: ${random_yoyo_y}%;
							transform: scale(${random_scale});
						}

						to {
                            left: ${random_x_end_yoyo}%;
                            top: 100%;
							transform: scale(${random_scale});
						}

					}
				`
        }

        this.injectCss(rule);
    }
}
