export default {
    init(container, density = 200) {
        this.generateCss(density);
        this.spawnSnow(container, density);
    },

    // Creating snowflakes
    spawnSnow(container, density) {
        for (let x = 0; x < density; x++) {
            let board = document.createElement('div');
            board.className = "snowflake";
            container.appendChild(board);
        }
    },

    // Append style for each snowflake to the head
    addCss(rule) {
        let css = document.createElement('style');
        css.appendChild(document.createTextNode(rule)); // Support for the rest
        document.getElementsByTagName("head")[0].appendChild(css);
    },

    // Math
    randomInt(value = 100){
        return Math.floor(Math.random() * value) + 1;
    },

    randomRange(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },

    // Create style for snowflake
    generateCss(density){
        let snowflake_name = "snowflake";
        let rule = ``;

        // If we dont add 2 to density, we will have a single
        // snowflake stuck at the top left corner of the container.
        for(let i = 1; i <= density + 2; i++){
            let random_x = Math.random() * 100; // vw
            let random_offset = this.randomRange(-100000, 100000) * 0.0001; // vw;
            let random_x_end = random_x + random_offset;
            let random_x_end_yoyo = random_x + (random_offset / 2);
            let random_yoyo_time = this.randomRange(30000, 80000) / 100000;
            let random_yoyo_y = random_yoyo_time * 100; // vh
            let random_scale = Math.random();
            let fall_duration = this.randomRange(10, 30) * 1; // s
            let fall_delay = this.randomInt(30) * -1; // s
            let opacity_ = Math.random();

            rule += `
					.${snowflake_name}:nth-child(${i}) {
						opacity: ${opacity_};
						transform: translate(${random_x}vw, -10px) scale(${random_scale});
						animation: fall-${i} ${fall_duration}s ${fall_delay}s linear infinite;
					}

					@keyframes fall-${i} {
						${random_yoyo_time*100}% {
							transform: translate(${random_x_end}vw, ${random_yoyo_y}vh) scale(${random_scale});
						}

						to {
							transform: translate(${random_x_end_yoyo}vw, 100vh) scale(${random_scale});
						}

					}
				`
        }

        this.addCss(rule);
    }
}