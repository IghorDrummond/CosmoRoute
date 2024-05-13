//Declaração de Variaveis
//objeto
var cena = null;
var camera = null;
var renderizacao  = null;
var terraMaterial = null;
var estrelaGeometria = null;
var estrelaMaterial = null;
var ceuEstrelado = null;
var terraTextura = null;
var terraGeometria = null;
var terraMaterial = null;
var terra = null;
var luz = null;
var lua = null;
var luaGeometria = null;
var luaMaterial = null
var luaTextura = null;
var dirLuz = null;
var jsonHttp = new XMLHttpRequest();
//Elementos
var Section = document.getElementsByTagName('section');
var Titulo = document.querySelectorAll('section h1');
var Cep = document.getElementById('CampoCep');
var CamposEnd = document.getElementsByTagName('input');
var Main = document.getElementsByTagName('main');
var Voltar = document.getElementsByTagName('button');
//Booleano
var luaRotaciona = true;
//Constantes
const ZOOM = 20

//------------------Escopo
configuracaoInicial();//Configura o Cenário, Camera e Renderização
configuracaoAmbiente();//Configura o Ambiente 3D
configuracao3D();//Configura o Objeto 3D e adiciona no ambiente desejado
configuracaoLuz();//Configura a Luz do Cenário
animaTerra();//Renderiza o quadro 3d e Anima a Terra
var Z = setTimeout(function(){
	clearTimeout(Z);
	introducao();//Inicia a Introdução da Página ao ser carregada
}, 5000);
//------------------Eventos
/*
*Evento: mascaraCep()
*Descrição: Responsavel por colocar um traço divisório entre os dados do cep
*Programador(a): Ighor Drummond
*Data: 11/05/2024
*/
Cep.addEventListener('keydown', function(event) {
	var Aux = '';
	
	if(Cep.value.length >= 5 ){
		for(let nCont = 0; nCont <= Cep.value.length -1; nCont++){
			if(nCont === 5 && Cep.value.substr(nCont,1) != '-'){
				Aux += '-' ;
			}
			Aux += Cep.value.substr(nCont,1);
		}
		Cep.value = Aux;
	}
});
/*
*Evento: buscaCep()
*Descrição: Responsavel por buscar e retornar o cep caso for valido
*Programador(a): Ighor Drummond
*Data: 11/05/2024
*/
Cep.addEventListener('change', function(event) {
	var Aux = '';

	if(Cep.value.length === 9){
		Aux = Cep.value.replace('-', '');
		jsonHttp.open('GET', 'https://viacep.com.br/ws/'+ Aux +'/json/');

		jsonHttp.onreadystatechange = ()=>{
			if(jsonHttp.readyState === 4 && jsonHttp.status < 400){
				let jsonVal = JSON.parse(jsonHttp.responseText);
				if(!jsonVal.hasOwnProperty('erro')){
					CamposEnd[1].value = 'Endereço: ' + jsonVal.logradouro;
					CamposEnd[2].value = 'Bairro: ' + jsonVal.bairro;
					CamposEnd[3].value = 'Cidade: ' + jsonVal.localidade;
					CamposEnd[4].value = 'UF: ' + jsonVal.uf;
					CamposEnd[5].value = 'DDD: ' + jsonVal.ddd;
					CamposEnd[6].value = 'IBGE: ' + jsonVal.ibge;
					CamposEnd[7].value = 'SIAFI: ' + jsonVal.siafi;
					CamposEnd[8].value = 'GIA: ' + jsonVal.gia;
				}else{
					Section[1].style.animation = '1s titulo_desaparece';
					var X = setTimeout(()=>{
						Section[1].style.display = 'none';
						erro('O CEP digitado não existe! Por favor, insira um válido novamente.');
					}, 1000);
				}
			}else if(jsonHttp.status >= 400 && jsonHttp.status <= 499){
				Section[1].style.animation = '1s titulo_desaparece';
				var X = setTimeout(()=>{
					Section[1].style.display = 'none';
					erro('Houve um problema de conexão do seu lado. Por favor, tente novamente mais tarde. Erro: ' + jsonHttp.status.toString());
				}, 1000);				
			}
			else if(jsonHttp.status >= 500 && jsonHttp.status <= 599){
				Section[1].style.animation = '1s titulo_desaparece';
				var X = setTimeout(()=>{
					Section[1].style.display = 'none';
					erro('Houve um problema que está no servidor. Estamos trabalhando para corrigi-lo o mais breve possível. Erro: ' + jsonHttp.status.toString());
				}, 1000);				
			}
		}
		jsonHttp.send();
	}
});
/*
*Evento: voltaTerra()
*Descrição: Responsavel por retorna na aba de buscas além de deletar a lua do cenário
*Programador(a): Ighor Drummond
*Data: 11/05/2024
*/
Voltar[0].addEventListener('click', function(event) {
	var nCont = 5;
	//Volta padrão para os elementos
	Main[0].classList.remove("p-2");
	Section[2].style.display = 'none';

	var P = setInterval(()=>{
		if(nCont >= 0){
			camera.position.x = nCont;
		}
		else{
			Section[1].style.animation = '2s titulo_aparece';
			Section[1].style.display = 'block';
			clearInterval(P);		
		}
		//Remove a Lua da Cena
		if(parseInt(nCont) === 2){
			//Remover a Lua do cenário
			cena.remove(lua);
			//renderiza o quadro sem a lua
			renderizacao.render(cena, camera);
		}
		console.log(nCont);
		nCont -= 0.1;
	},25);
});
//------------------Funções
/*
*Função: configuraInicial()
*Descrição: Responsavel por construir a camera, cena e renderização do quadro 3d
*Programador(a): Ighor Drummond
*Data: 11/05/2024
*/
function configuracaoInicial(){
	//Constrói uma cena 
	cena = new THREE.Scene();
	//Constrói uma camera
	camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
	camera.position.z = ZOOM; //Responsavel por dar o zoom no objeto 3d
	//Constrói a Renderização
	renderizacao = new THREE.WebGLRenderer({antialias: true});
	renderizacao.setSize(window.innerWidth, window.innerHeight);
	//Ejeta o o quadro renderizado na página HTML
	document.getElementById('fundo').appendChild(renderizacao.domElement);
}
/*
*Função: configuraAmbiente()
*Descrição: Responsavel por Configurar a ambientação do cenário e seu fundo estrelado
*Programador(a): Ighor Drummond
*Data: 11/05/2024
*/
function configuracaoAmbiente(){
	//Criando um fundo estrelado
	estrelaGeometria = new THREE.SphereGeometry(100, 64, 64);//Cria o material e sua dimensão
	const textura = new THREE.TextureLoader().load('img/estrelas.jpg')
	estrelaMaterial = new THREE.MeshBasicMaterial({
		map: textura,
		side: THREE.BackSide
	});
	ceuEstrelado = new THREE.Mesh(estrelaGeometria, estrelaMaterial);//Cria o Ceu com a textura e o material definidos
	cena.add(ceuEstrelado);//Adiciona o Ceu estrelado na cena do quadro 3d
}
/*
*Função: configuraAmbiente()
*Descrição: Responsavel por Criar, texturizar e modelar o planeta terra 3d
*Programador(a): Ighor Drummond
*Data: 11/05/2024
*/
function configuracao3D(){
    // Adicionando a Textura para o Planeta Terra 
    terraTextura = new THREE.TextureLoader().load('img/terra.jpg'); // Textura da terra

    // Adiciona os materiais com suas respectivas texturas
    terraMaterial = new THREE.MeshBasicMaterial({map: terraTextura});

    // Adiciona as geometrias
    terraGeometria = new THREE.SphereGeometry(1.02, 32, 32); // Aumentei o raio para que as texturas não fiquem coladas à esfera

    // Cria os meshes para cada parte do planeta
    terra = new THREE.Mesh(terraGeometria, terraMaterial);
    // Adiciona cada parte do planeta à cena
    cena.add(terra);
}
/*
*Função: configuraLuz()
*Descrição: Responsavel por Configurar a Luz do Cenário e sua direção
*Programador(a): Ighor Drummond
*Data: 11/05/2024
*/
function configuracaoLuz(){
	//Adicionando uma luz ao ambiente
	luz = new THREE.AmbientLight(0xffffff, 0.2);
	cena.add(luz); //adicionando Luz na Cena

	//Aplicando uma direção para luz
	dirLuz = new THREE.DirectionalLight(0xffffff, 0.8);
	dirLuz.position.set(8, 7, 2);
	cena.add(dirLuz);//Adicionando Direção da Luz para cena 
}
/*
*Função: animaterra()
*Descrição: Rotaciona a Terra no Eixo Y
*Programador(a): Ighor Drummond
*Data: 11/05/2024
*/
function animaTerra(){
	requestAnimationFrame(animaTerra);
	// Girando o planeta Terra lentamente
	terra.rotation.y += 0.001;
	if(luaRotaciona=== false){
		cena.remove(lua);
	}
	renderizacao.render(cena, camera);//Renderiza todos os dados fornecidos ao quadro 3d
}
/*
*Função: animaLua()
*Descrição: Rotaciona a Lua no Eixo Y
*Programador(a): Ighor Drummond
*Data: 12/05/2024
*/
function animaLua(){
	requestAnimationFrame(animaLua);
	// Girando a lua lentamente
	lua.rotation.y += 0.001;
}
/*
*Função: introducao()
*Descrição: Responsavel por iniciar uma animação introdutória após carregar a página e seus elementos
*Programador(a): Ighor Drummond
*Data: 11/05/2024
*/
function introducao(){
	Titulo[0].style.animation = '2s titulo_desaparece';

	var Z = setTimeout(()=>{
		clearTimeout(Z);
		Section[0].classList.remove("d-flex");
		Section[0].classList.add("d-none");
		Titulo[0].style.display = 'none';
		darZoom(20);
	}, 2000);

}
/*
*Função: darZoom(valor inicial do Zoom aplicado)
*Descrição: Responsavel por dar o zoom necessário em cima do planeta
*Programador(a): Ighor Drummond
*Data: 11/05/2024
*/
function darZoom(nCont){
	var Y = setInterval(()=>{
		nCont -= 0.1;
		if(nCont > 2){
			nCont--;
		}else{
			clearInterval(Y);
			Section[1].style.display = 'block';
		}
		camera.position.z = nCont;
	}, 55);
}
/*
*Função: erroCep()
*Descrição: Responsavel por movimentar a camera para o lua
*Programador(a): Ighor Drummond
*Data: 12/05/2024
*/
function erro(error){
	/*Cria o Elemento Lua */
    // Adicionando a Textura para o Planeta Terra 
    luaTextura = new THREE.TextureLoader().load('img/lua.jpg'); // Textura da terra

    // Adiciona os materiais com suas respectivas texturas
    luaMaterial = new THREE.MeshBasicMaterial({map: luaTextura});

    // Adiciona as geometrias
    luaGeometria = new THREE.SphereGeometry(0.3, 32, 32); // Aumentei o raio para que as texturas não fiquem coladas à esfera

    // Cria os meshes para cada parte do planeta
    lua = new THREE.Mesh(luaGeometria, luaMaterial);

	// Define a posição da Lua em relação à Terra
	lua.position.set(5, 0, 0); // Exemplo: posicione a Lua 5 unidades à direita da Terra
	//camera.position.z = 20;
    // Adiciona cada parte do planeta à cena
    cena.add(lua);
	animaLua();//Adiciona a Lua no quadro 3D
	renderizacao.render(cena, camera);//Renderiza todos os dados fornecidos ao quadro 3d
	zoomLua();//Desloca a Camera para a Lua
	//Adiciona a Mensagem de Erro passada por parametro
	Section[2].getElementsByTagName('p')[0].innerText = error;
}
/*
*Função: zoomLua()
*Descrição: Responsavel por o zoom na lua
*Programador(a): Ighor Drummond
*Data: 12/05/2024
*/
function zoomLua(){
	var nCont = 0;//Posição X inicial de 0;

	var U = setInterval(()=>{

		if(nCont <= 5){
			camera.position.x = nCont;
		}else{
			Main[0].classList.add("p-2");
			Section[2].style.display = 'block';
			clearInterval(U);		
		}
		nCont += 0.1;
	},25);
}