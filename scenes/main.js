	

function paletteSwapPlugin(k) {
	return {
		paletteSwap(
			palette = [{r:21,g:22,b:31},//darkest
					   {r:225,g:100,b:0},
					   {r:255,g:12,b:222},
					   {r:12,g:2,b:11},
					   {r:170,g:43,b:120},
					   {r:0,g:43,b:100},
					   {r:0,g:3,b:12},
					   {r:120,g:2,b:0} //lightest
					  ],
            sensitivity = 7, //number of shades matters
		) {
				loadShader("paletteSwap", null, `
				uniform float u_sensitivity;


				// get item from palette array 
				vec3 palette[${palette.length}];
				vec3 getItem(vec3[${palette.length}] a, int index) {
					for(int i=0; i<${palette.length};i++) {
						if(i==index) return a[i];
					}
				}
				
				
				vec4 frag(vec3 pos, vec2 uv, vec4 color, sampler2D tex) {
					${palette.map((col,i)=>`palette[${i}] = vec3(${col.r},${col.g},${col.b});`).join("")}
					vec3 gammaColor = texture2D(tex, uv).xyz;
					float alphaChannel = texture2D(tex, uv).a;
					vec3 linearColor = gammaColor * gammaColor;
					float gray = dot(linearColor, vec3(0.2126, 0.7152, 0.0722));
					float gammaGray = sqrt(gray);
					int indexSel = int(gammaGray * u_sensitivity + 0.25);//was 3.0
					//hard part pass array and use it here
					vec3 newColor = getItem(palette,indexSel) / 255.0;

					return vec4(newColor, alphaChannel * 255.0);
				}
				`);
 			return {
				//add() {},
				
				update() {
					this.uniform["u_sensitivity"] = sensitivity || palette.length - 1; //number of colors - 1
				},
			};
		},
	};
}

kaboom({
	global: true,
	fullscreen: true,
	scale: 2,
	plugins: [ peditPlugin, paletteSwapPlugin ],
});

loadSprite("sprite", "https://pbs.twimg.com/media/EQMaoJjWkAIHfIF.png");

loadPedit("testShades", "sprites/testShades.pedit");

const palette = [{r:221,g:222,b:1},//darkest 8
					   {r:25,g:100,b:107}, //7
					   {r:255,g:12,b:222}, //6
					   {r:120,g:122,b:100}, //5
					   {r:170,g:43,b:20}, //4
					   {r:25,g:43,b:100}, //3
					   {r:0,g:0,b:225}, //2
					   {r:23,g:225,b:0} //lightest 1
					  ];
scene("main", () => {
  add([sprite("sprite")]);
	add([
		sprite("testShades"),
		paletteSwap(palette),
		shader("paletteSwap")
	]);
  
});

start("main");
 